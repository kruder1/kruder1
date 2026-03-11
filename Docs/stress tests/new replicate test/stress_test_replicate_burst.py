"""
Replicate Seedream 4.5 - Stress Test BURST (50 Concurrentes)
Lanza 50 peticiones simultáneas con el payload EXACTO de la documentación de ByteDance.
Hace polling inteligente y cancela si tardan > 60s en fila.
"""
import json
import os
import sys
import time
import traceback
import concurrent.futures
from pathlib import Path
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# --- Configuración Exacta ---
REPLICATE_API_TOKEN = "API_TOKEN_HERE"
IMAGE_URL = "https://i.postimg.cc/hPyTxKf1/GROUP.jpg"
# Endpoint oficial para bytedance/seedream-4.5
ENDPOINT = "https://api.replicate.com/v1/models/bytedance/seedream-4.5/predictions" 
NUM_REQUESTS = 50
MAX_STARTING_TIME = 60 # Segundos máximos en fila antes de abortar para no quemar saldo

SCRIPT_DIR = Path(__file__).resolve().parent
PROMPTS_JSON_PATH = SCRIPT_DIR / "prompts_replicate_grupo.json"
LOG_PATH = SCRIPT_DIR / "log_burst_replicate.txt"

def ts():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S.") + f"{int(time.time() * 1000) % 1000:03d}"

def log_write(log_file, msg: str):
    line = msg if msg.endswith("\n") else msg + "\n"
    try:
        log_file.write(line)
        log_file.flush()
    except Exception as e:
        sys.stderr.write(f"LOG WRITE ERROR: {e}\n{line}")
    print(msg, end="" if msg.endswith("\n") else "\n")

def load_prompts(log_file):
    if not PROMPTS_JSON_PATH.exists():
        log_write(log_file, f"[{ts()}] ERROR: No existe {PROMPTS_JSON_PATH}")
        return None
    try:
        raw = PROMPTS_JSON_PATH.read_text(encoding="utf-8")
        prompts = json.loads(raw)
    except Exception as e:
        log_write(log_file, f"[{ts()}] ERROR JSON: {e}")
        return None
    if len(prompts) < NUM_REQUESTS:
        log_write(log_file, f"[{ts()}] ERROR: Se necesitan {NUM_REQUESTS} prompts, hay {len(prompts)}.")
        return None
    return prompts

def cancel_prediction(cancel_url, log_file, idx):
    req = Request(cancel_url, method="POST")
    req.add_header("Authorization", f"Bearer {REPLICATE_API_TOKEN}")
    try:
        with urlopen(req, timeout=10) as r:
            log_write(log_file, f"[{ts()}] REQ #{idx} CANCELADA EXITOSAMENTE (Evitando cobro).")
    except Exception as e:
        log_write(log_file, f"[{ts()}] REQ #{idx} ERROR AL CANCELAR: {e}")

def send_and_poll(idx_1based: int, prompt: str, log_file) -> dict:
    # Payload EXACTO sacado de la documentación que proveíste
    body = {
        "input": {
            "prompt": prompt,
            "image_input": [IMAGE_URL],
            "size": "2K",
            "aspect_ratio": "2:3",
            "sequential_image_generation": "disabled",
            "max_images": 1
        }
    }
    body_bytes = json.dumps(body).encode("utf-8")
    req = Request(ENDPOINT, data=body_bytes, method="POST")
    req.add_header("Authorization", f"Bearer {REPLICATE_API_TOKEN}")
    req.add_header("Content-Type", "application/json")

    t_start_post = time.perf_counter()
    
    # 1. EL DISPARO (POST inicial)
    try:
        with urlopen(req, timeout=30) as r:
            t1_network_ms = (time.perf_counter() - t_start_post) * 1000
            data = json.loads(r.read().decode())
            pred_id = data.get("id")
            urls = data.get("urls", {})
            get_url = urls.get("get")
            cancel_url = urls.get("cancel")
            log_write(log_file, f"[{ts()}] REQ #{idx_1based} ACEPTADA (T1: {t1_network_ms:.0f}ms) ID={pred_id}")
            
    except HTTPError as e:
        err_body = e.read().decode() if e.fp else ""
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} RECHAZADA POST (Status {e.code}): {err_body}")
        return {"idx": idx_1based, "status": e.code, "error": "Rechazo inicial (429 o payload incorrecto)"}
    except Exception as e:
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} ERROR POST: {e}")
        return {"idx": idx_1based, "status": 500, "error": str(e)}

    # 2. EL POLLING (Revisar estado cada 2 segundos)
    status = "starting"
    t_enter_starting = time.perf_counter()
    t_enter_processing = None
    predict_time = 0
    
    while True:
        time.sleep(2)
        req_get = Request(get_url, method="GET")
        req_get.add_header("Authorization", f"Bearer {REPLICATE_API_TOKEN}")
        
        try:
            with urlopen(req_get, timeout=20) as r:
                poll_data = json.loads(r.read().decode())
                new_status = poll_data.get("status")
                
                # Transición a Processing (salió de la fila)
                if new_status == "processing" and status == "starting":
                    t_enter_processing = time.perf_counter()
                    t2_queue_s = t_enter_processing - t_enter_starting
                    log_write(log_file, f"[{ts()}] REQ #{idx_1based} -> PROCESSING (Tiempo en fila T2: {t2_queue_s:.1f}s)")
                
                status = new_status
                
                # Check de Aborto si sigue en Starting (en la fila) por más de 60s
                if status == "starting":
                    time_in_queue = time.perf_counter() - t_enter_starting
                    if time_in_queue > MAX_STARTING_TIME:
                        log_write(log_file, f"[{ts()}] REQ #{idx_1based} ATASCADA (> {MAX_STARTING_TIME}s). ABORTANDO...")
                        cancel_prediction(cancel_url, log_file, idx_1based)
                        return {"idx": idx_1based, "status": "canceled_by_script", "queue_time": time_in_queue}
                
                # Si terminó o falló
                if status in ["succeeded", "failed", "canceled"]:
                    t3_process_s = (time.perf_counter() - t_enter_processing) if t_enter_processing else 0
                    predict_time = poll_data.get("metrics", {}).get("predict_time", 0)
                    
                    if status == "failed":
                        err_msg = poll_data.get("error", "Error desconocido")
                        log_write(log_file, f"[{ts()}] REQ #{idx_1based} FAILED: {err_msg}")
                    else:
                        log_write(log_file, f"[{ts()}] REQ #{idx_1based} FINALIZADA: {status.upper()} (GPU Time cobrado: {predict_time:.2f}s)")
                        
                    return {
                        "idx": idx_1based, 
                        "status": status, 
                        "queue_time_s": (t_enter_processing - t_enter_starting) if t_enter_processing else (time.perf_counter() - t_enter_starting),
                        "gpu_time_s": predict_time
                    }
                    
        except Exception as e:
            log_write(log_file, f"[{ts()}] REQ #{idx_1based} Error en polling: {e} (reintentando en el próximo loop)")

def main():
    try:
        log_file = open(LOG_PATH, "w", encoding="utf-8")
    except Exception as e:
        sys.exit(1)

    log_write(log_file, f"[{ts()}] ========== REPLICATE SEEDREAM 4.5 BURST STRESS TEST ==========")
    log_write(log_file, f"[{ts()}] Endpoint: {ENDPOINT}")
    log_write(log_file, f"[{ts()}] Concurrentes: {NUM_REQUESTS}")
    
    prompts = load_prompts(log_file)
    if not prompts: 
        log_file.close()
        return
        
    prompts_to_use = prompts[:NUM_REQUESTS]

    start_wall = time.perf_counter()
    results = []

    def task(i):
        return send_and_poll(i + 1, prompts_to_use[i], log_file)

    # Lanza las 50 simultáneas
    with concurrent.futures.ThreadPoolExecutor(max_workers=NUM_REQUESTS) as ex:
        futures = [ex.submit(task, i) for i in range(NUM_REQUESTS)]
        for f in concurrent.futures.as_completed(futures):
            results.append(f.result())

    total_wall_s = time.perf_counter() - start_wall
    
    ok = [r for r in results if r.get("status") == "succeeded"]
    throttled = [r for r in results if r.get("status") == 429]
    failed = [r for r in results if r.get("status") == "failed"]
    canceled = [r for r in results if r.get("status") == "canceled_by_script"]
    total_gpu_time = sum([r.get("gpu_time_s", 0) for r in ok])

    log_write(log_file, f"\n[{ts()}] ========== RESUMEN ==========")
    log_write(log_file, f"[{ts()}] OK (Succeeded) = {len(ok)}")
    log_write(log_file, f"[{ts()}] Fallidas (Failed) = {len(failed)}")
    log_write(log_file, f"[{ts()}] Rechazos 429   = {len(throttled)}")
    log_write(log_file, f"[{ts()}] Canceladas >60s= {len(canceled)}")
    log_write(log_file, f"[{ts()}] Wall Clock Total= {total_wall_s:.2f}s")
    log_write(log_file, f"[{ts()}] Hardware Facturado = {total_gpu_time:.2f} segundos")
    
    log_file.close()

if __name__ == "__main__":
    main()