"""
Segmind Seedream 4.5 - Stress Test RPM
Envía 30 requests espaciadas 2 s (1 cada 2 s durante 60 s). Todo en log_rpm_segmind.txt.
Cada request tiene coste: nada puede quedar sin registrar.
"""
import json
import sys
import time
import traceback
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# --- Configuración (plan) ---
API_KEY = "SG_12184fb578802a41"
IMAGE_URL = "https://i.ibb.co/ns85znQV/pareja.jpg"
ENDPOINT = "https://api.segmind.com/v1/seedream-4.5"
NUM_REQUESTS = 60
INTERVAL_S = 1
REQUEST_TIMEOUT = 120
SCRIPT_DIR = Path(__file__).resolve().parent
PROMPTS_JSON_PATH = SCRIPT_DIR / "prompts_segmind_parejas.json"
LOG_PATH = SCRIPT_DIR / "log_rpm_segmind.txt"


def ts():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S.") + f"{int(time.time() * 1000) % 1000:03d}"


def log_write(log_file, msg: str):
    """Escribe en log y en consola; flush para no perder nada."""
    line = msg if msg.endswith("\n") else msg + "\n"
    try:
        log_file.write(line)
        log_file.flush()
    except Exception as e:
        sys.stderr.write(f"LOG WRITE ERROR: {e}\n{line}")
    print(msg, end="" if msg.endswith("\n") else "\n")


def load_prompts(log_file) -> list[str] | None:
    """Carga prompts desde JSON. Valida existencia y >= 30. Devuelve None si falla."""
    if not PROMPTS_JSON_PATH.exists():
        log_write(log_file, f"[{ts()}] ERROR: No existe el archivo de prompts: {PROMPTS_JSON_PATH}")
        return None
    try:
        raw = PROMPTS_JSON_PATH.read_text(encoding="utf-8")
        prompts = json.loads(raw)
    except Exception as e:
        log_write(log_file, f"[{ts()}] ERROR al leer JSON de prompts: {e}\n{traceback.format_exc()}")
        return None
    if not isinstance(prompts, list):
        log_write(log_file, f"[{ts()}] ERROR: prompts_segmind_parejas.json no es un array")
        return None
    if len(prompts) < NUM_REQUESTS:
        log_write(log_file, f"[{ts()}] ERROR: Se necesitan al menos {NUM_REQUESTS} prompts, hay {len(prompts)}")
        return None
    return prompts


def send_request(idx_1based: int, prompt: str, log_file) -> dict:
    """
    Envía una request a Segmind. Índice 1..30.
    Cualquier excepción o resultado se registra en log_file. Nunca se pierde información.
    """
    body = {
        "prompt": prompt,
        "image_input": [IMAGE_URL],
        "size": "2K",
        "width": 2048,
        "height": 2048,
        "max_images": 1,
        "aspect_ratio": "match_input_image",
    }
    body_bytes = json.dumps(body, ensure_ascii=False).encode("utf-8")
    req = Request(ENDPOINT, data=body_bytes, method="POST")
    req.add_header("x-api-key", API_KEY)
    req.add_header("Content-Type", "application/json")

    sent_at = time.perf_counter()
    send_ts = ts()
    prompt_len = len(prompt)
    prompt_preview = prompt[:80].replace("\n", " ") + "..." if len(prompt) > 80 else prompt.replace("\n", " ")

    try:
        log_write(log_file, f"[{send_ts}] REQ #{idx_1based} SEND idx={idx_1based} prompt_len={prompt_len} image_url={IMAGE_URL}")
        log_write(log_file, f"[{send_ts}] REQ #{idx_1based} prompt_preview={prompt_preview}")

        with urlopen(req, timeout=REQUEST_TIMEOUT) as r:
            elapsed_ms = (time.perf_counter() - sent_at) * 1000
            elapsed_s = elapsed_ms / 1000
            raw_body = r.read()
            status = r.status
            body_len = len(raw_body)
            body_text = None

            body_preview = None
            if status == 200:
                log_write(log_file, f"[{ts()}] REQ #{idx_1based} RESPONSE status={status} elapsed_ms={elapsed_ms:.0f} elapsed_s={elapsed_s:.2f} body_size_bytes={body_len} OK")
            else:
                try:
                    body_preview = raw_body.decode("utf-8", errors="replace")
                except Exception:
                    body_preview = repr(raw_body[:2000])
                headers = dict(r.headers) if hasattr(r, "headers") else {}
                log_write(log_file, f"[{ts()}] REQ #{idx_1based} RESPONSE status={status} elapsed_ms={elapsed_ms:.0f} elapsed_s={elapsed_s:.2f} body_size={body_len}")
                log_write(log_file, f"[{ts()}] REQ #{idx_1based} response_headers={json.dumps(headers, default=str)}")
                log_write(log_file, f"[{ts()}] REQ #{idx_1based} response_body_full={body_preview}")

            return {
                "idx": idx_1based,
                "status": status,
                "elapsed_ms": elapsed_ms,
                "elapsed_s": elapsed_s,
                "body_size": body_len,
                "error": None,
                "body_preview": body_preview,
            }

    except HTTPError as e:
        elapsed_ms = (time.perf_counter() - sent_at) * 1000
        elapsed_s = elapsed_ms / 1000
        err_body = ""
        try:
            if e.fp:
                err_body = e.fp.read().decode("utf-8", errors="replace")
        except Exception:
            err_body = repr(e)
        headers = dict(e.headers) if hasattr(e, "headers") else {}
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} HTTPError status={e.code} elapsed_ms={elapsed_ms:.0f} elapsed_s={elapsed_s:.2f}")
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} error_headers={json.dumps(headers, default=str)}")
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} error_body_full={err_body}")
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} traceback:\n{traceback.format_exc()}")
        return {
            "idx": idx_1based,
            "status": e.code,
            "elapsed_ms": elapsed_ms,
            "elapsed_s": elapsed_s,
            "body_size": 0,
            "error": err_body,
            "body_preview": err_body,
        }

    except Exception as ex:
        elapsed_ms = (time.perf_counter() - sent_at) * 1000
        elapsed_s = elapsed_ms / 1000
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} EXCEPTION type={type(ex).__name__} msg={ex} elapsed_ms={elapsed_ms:.0f} elapsed_s={elapsed_s:.2f}")
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} traceback:\n{traceback.format_exc()}")
        log_write(log_file, f"[{ts()}] REQ #{idx_1based} payload_sent_prompt_len={len(prompt)} image_url={IMAGE_URL}")
        return {
            "idx": idx_1based,
            "status": None,
            "elapsed_ms": elapsed_ms,
            "elapsed_s": elapsed_s,
            "body_size": 0,
            "error": str(ex),
            "body_preview": None,
        }


def main():
    try:
        log_file = open(LOG_PATH, "w", encoding="utf-8")
    except Exception as e:
        sys.stderr.write(f"ERROR: No se pudo abrir log {LOG_PATH}: {e}\n")
        sys.exit(1)

    log_write(log_file, f"[{ts()}] ========== SEGMIND RPM STRESS TEST ==========")
    log_write(log_file, f"[{ts()}] endpoint={ENDPOINT}")
    log_write(log_file, f"[{ts()}] image_url={IMAGE_URL}")
    log_write(log_file, f"[{ts()}] num_requests={NUM_REQUESTS} mode=rpm interval_s={INTERVAL_S}")
    log_write(log_file, f"[{ts()}] request_timeout_s={REQUEST_TIMEOUT}")
    log_write(log_file, "")

    if not API_KEY or not API_KEY.strip():
        log_write(log_file, f"[{ts()}] ERROR: API key vacía. Abortando.")
        log_file.close()
        sys.exit(1)
    if not IMAGE_URL or not IMAGE_URL.strip():
        log_write(log_file, f"[{ts()}] ERROR: URL de imagen vacía. Abortando.")
        log_file.close()
        sys.exit(1)

    prompts = load_prompts(log_file)
    if prompts is None:
        log_file.close()
        sys.exit(1)

    prompts_to_use = prompts[:NUM_REQUESTS]
    log_write(log_file, f"[{ts()}] Cargados {len(prompts_to_use)} prompts. Enviando 1 request cada {INTERVAL_S} s (envíos en t=0,1,2,...59 s), sin esperar respuesta.")
    log_write(log_file, "")

    def run_one(send_at_index: int):
        """Espera send_at_index*INTERVAL_S segundos y luego envía la request (no espera a que termine la anterior)."""
        time.sleep(INTERVAL_S * send_at_index)
        idx_1based = send_at_index + 1
        prompt = prompts_to_use[send_at_index]
        try:
            return send_request(idx_1based, prompt, log_file)
        except Exception as ex:
            log_write(log_file, f"[{ts()}] REQ #{idx_1based} UNHANDLED EXCEPTION: {ex}\n{traceback.format_exc()}")
            return {
                "idx": idx_1based,
                "status": None,
                "elapsed_ms": 0,
                "elapsed_s": 0,
                "body_size": 0,
                "error": str(ex),
                "body_preview": None,
            }

    start_wall = time.perf_counter()
    results = []
    with ThreadPoolExecutor(max_workers=NUM_REQUESTS) as executor:
        futures = [executor.submit(run_one, i) for i in range(NUM_REQUESTS)]
        for f in as_completed(futures):
            results.append(f.result())

    total_wall_s = time.perf_counter() - start_wall
    results_sorted = sorted([r for r in results if r.get("idx") is not None], key=lambda x: x["idx"])
    failed_indices = [r["idx"] for r in results_sorted if r.get("status") != 200]
    ok = [r for r in results_sorted if r.get("status") == 200]
    throttled = [r for r in results_sorted if r.get("status") == 429]
    other = [r for r in results_sorted if r.get("status") not in (200, 429) and r.get("status") is not None]
    exc = [r for r in results_sorted if r.get("status") is None]

    log_write(log_file, "")
    log_write(log_file, f"[{ts()}] ========== RESUMEN ==========")
    log_write(log_file, f"[{ts()}] total_ok_200={len(ok)}")
    log_write(log_file, f"[{ts()}] total_429_throttled={len(throttled)}")
    log_write(log_file, f"[{ts()}] total_other_status={len(other)}")
    log_write(log_file, f"[{ts()}] total_exception={len(exc)}")
    log_write(log_file, f"[{ts()}] failed_request_indices={failed_indices}")
    log_write(log_file, f"[{ts()}] wall_clock_s={total_wall_s:.2f}")
    if ok:
        times_s = [r["elapsed_s"] for r in ok]
        log_write(log_file, f"[{ts()}] elapsed_s min={min(times_s):.2f} avg={sum(times_s)/len(times_s):.2f} max={max(times_s):.2f}")
    log_write(log_file, f"[{ts()}] hora_fin={ts()}")
    log_write(log_file, "")

    try:
        log_file.close()
    except Exception as e:
        sys.stderr.write(f"Al cerrar log: {e}\n")

    print(f"  OK (200):       {len(ok)}")
    print(f"  Throttled (429): {len(throttled)}")
    print(f"  Other/Failed:  {len(other) + len(exc)}")
    print(f"  Failed indices: {failed_indices}")
    print(f"  Log: {LOG_PATH}")


if __name__ == "__main__":
    main()
