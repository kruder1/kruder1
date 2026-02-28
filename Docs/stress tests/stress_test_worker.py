"""
Kruder1 Worker (generate-prompt) - Stress Test

Qué necesitas TÚ (sin tocar código):
  1. Una cuenta en Kruder1 (la misma que usas en la app o en kruder1.com) con créditos suficientes
     (al menos tantos como prompts haya en prompts.json; ej. 80 créditos para 80 prompts).
  2. Un archivo en esta misma carpeta llamado:  stress_config.txt
     - Primera línea: tu email
     - Segunda línea: tu contraseña
  El script hará login por ti y usará esa cuenta para la prueba.

Cómo correr:  python stress_test_worker.py

Dependencia:  pip install Pillow
"""
import os
import io
import json
import time
import base64
import ssl
import concurrent.futures
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

WORKER_AUTH_URL = os.environ.get("WORKER_AUTH_URL", "https://kruder1-auth.kruder1-master.workers.dev").rstrip("/")
WORKER_GEN_URL = os.environ.get("WORKER_GEN_URL", "https://gen.kruder1.com").rstrip("/")
STRESS_JWT = os.environ.get("STRESS_JWT", "")


def ts():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S.") + f"{int(time.time() * 1000) % 1000:03d}"


def load_email_password_from_config(script_dir):
    """
    Lee stress_config.txt: primera línea = email, segunda = contraseña.
    Retorna (email, password) o (None, None) si no existe o está mal.
    """
    path = os.path.join(script_dir, "stress_config.txt")
    if not os.path.isfile(path):
        return None, None
    try:
        with open(path, "r", encoding="utf-8") as f:
            lines = [ln.strip() for ln in f.readlines()]
        if len(lines) < 2:
            return None, None
        email, password = lines[0].strip(), lines[1].strip()
        if not email or not password:
            return None, None
        return email, password
    except Exception:
        return None, None


def get_jwt_from_login(email, password):
    """Hace login en el worker de auth y devuelve el token (JWT)."""
    url = f"{WORKER_AUTH_URL}/login"
    body = json.dumps({
        "email": email,
        "password": password,
        "persistent": True,
    }).encode("utf-8")
    req = Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("User-Agent", "Kruder1-StressTest/1.0")
    with urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8"))
    if not data.get("token"):
        raise ValueError(data.get("error", "Login falló: no se recibió token"))
    return data["token"]


def load_prompts_from_json(script_dir):
    """Carga prompts desde prompts.json en la misma carpeta. Array de strings."""
    path = os.path.join(script_dir, "prompts.json")
    if not os.path.isfile(path):
        raise FileNotFoundError(f"prompts.json no encontrado: {path}")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list) or not all(isinstance(p, str) for p in data):
        raise ValueError("prompts.json debe ser un array de strings")
    return data


def load_ref_image_base64(path):
    """Carga imagen y devuelve base64 sin prefijo data:."""
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("ascii")


def download_image_bytes(url, timeout=90):
    """Descarga URL y devuelve bytes. SSL unverified si falla cert."""
    req = Request(url, headers={"User-Agent": "Kruder1-StressTest/1.0"})
    try:
        ctx = ssl.create_default_context()
        with urlopen(req, timeout=timeout, context=ctx) as r:
            return r.read()
    except (URLError, OSError) as e:
        if "SSL" in str(e).upper() or "certificate" in str(e).lower():
            ctx = ssl._create_unverified_context()
            with urlopen(req, timeout=timeout, context=ctx) as r:
                return r.read()
        raise


def download_and_save_jpg_85(image_url, out_path, timeout=90):
    """
    Descarga imagen desde URL y la guarda como JPG calidad 85%, igual que
    main.py _save_generated_image_to_event (cuadrada 1:1, comprimida).
    Retorna (size_bytes, download_elapsed_ms).
    """
    from PIL import Image
    t0 = time.perf_counter()
    image_data = download_image_bytes(image_url, timeout=timeout)
    download_ms = (time.perf_counter() - t0) * 1000
    img = Image.open(io.BytesIO(image_data))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    elif img.mode != "RGB":
        img = img.convert("RGB")
    img.save(out_path, "JPEG", quality=85, optimize=True)
    size = os.path.getsize(out_path)
    return size, download_ms


def call_worker(idx, prompt, ref_b64, headers):
    url = f"{WORKER_GEN_URL}/generate-prompt"
    body = json.dumps({
        "referenceImageBase64": ref_b64,
        "promptText": prompt,
    }).encode("utf-8")
    req = Request(url, data=body, method="POST")
    for k, v in headers.items():
        req.add_header(k, v)
    sent_at = time.perf_counter()
    result = {
        "idx": idx,
        "prompt_preview": prompt[:100] + "..." if len(prompt) > 100 else prompt,
        "status_code": None,
        "elapsed_ms": None,
        "elapsed_s": None,
        "credits_remaining": None,
        "image_url": None,
        "local_path": None,
        "download_elapsed_ms": None,
        "download_size_bytes": None,
        "error": None,
        "response_body_preview": None,
    }
    try:
        with urlopen(req, timeout=180) as r:
            elapsed_ms = (time.perf_counter() - sent_at) * 1000
            raw = r.read().decode("utf-8")
            data = json.loads(raw)
            result["status_code"] = r.status
            result["elapsed_ms"] = elapsed_ms
            result["elapsed_s"] = elapsed_ms / 1000
            result["credits_remaining"] = data.get("creditsRemaining")
            result["image_url"] = data.get("imageUrl")
            result["response_body_preview"] = raw[:300] if len(raw) > 300 else raw
            return result
    except HTTPError as e:
        elapsed_ms = (time.perf_counter() - sent_at) * 1000
        err_body = e.read().decode() if e.fp else ""
        result["status_code"] = e.code
        result["elapsed_ms"] = elapsed_ms
        result["elapsed_s"] = elapsed_ms / 1000
        result["error"] = err_body[:500] if err_body else str(e)
        return result
    except Exception as ex:
        elapsed_ms = (time.perf_counter() - sent_at) * 1000
        result["elapsed_ms"] = elapsed_ms
        result["elapsed_s"] = elapsed_ms / 1000
        result["error"] = str(ex)
        return result


def run_one(idx, prompt, ref_b64, headers, output_dir):
    r = call_worker(idx, prompt, ref_b64, headers)
    if r["status_code"] == 200 and r.get("image_url"):
        img_url = r["image_url"]
        local_path = os.path.join(output_dir, f"idx_{idx+1:03d}.jpg")
        try:
            size, download_ms = download_and_save_jpg_85(img_url, local_path)
            r["download_elapsed_ms"] = download_ms
            r["local_path"] = local_path
            r["download_size_bytes"] = size
        except Exception as e:
            r["download_error"] = str(e)
            r["local_path"] = None
    return r


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Obtener JWT: si ya viene en variable de entorno, usarlo; si no, intentar login con stress_config.txt
    jwt = STRESS_JWT.strip() if STRESS_JWT else ""
    if not jwt:
        email, password = load_email_password_from_config(script_dir)
        if email and password:
            print("Iniciando sesión con tu cuenta (stress_config.txt)...")
            try:
                jwt = get_jwt_from_login(email, password)
                print("Sesión iniciada correctamente.")
            except HTTPError as e:
                err_body = e.read().decode() if e.fp else ""
                try:
                    err_data = json.loads(err_body)
                    msg = err_data.get("error", err_body[:200])
                except Exception:
                    msg = err_body[:200] if err_body else str(e)
                print(f"Error al iniciar sesión: {msg}")
                return
            except Exception as e:
                print(f"Error al iniciar sesión: {e}")
                return
        else:
            print("Para correr la prueba necesitas:")
            print("  1. Una cuenta en Kruder1 (la misma que usas en la app o en kruder1.com).")
            print("  2. Esa cuenta con créditos suficientes (tantos como prompts en prompts.json).")
            print("     Si no tienes, compra créditos en la app o en kruder1.com.")
            print("  3. Un archivo en esta carpeta llamado: stress_config.txt")
            print("     - Primera línea: tu email")
            print("     - Segunda línea: tu contraseña")
            print("Luego ejecuta de nuevo: python stress_test_worker.py")
            return

    source_jpg = os.path.join(script_dir, "source.jpg")
    if not os.path.isfile(source_jpg):
        print("Error: source.jpg no encontrado en esta carpeta.")
        return

    output_dir = os.path.join(script_dir, "output")
    os.makedirs(output_dir, exist_ok=True)

    try:
        PROMPTS = load_prompts_from_json(script_dir)
    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}")
        return
    if not PROMPTS:
        print("Error: prompts.json está vacío.")
        return

    n = len(PROMPTS)
    log_filename = f"stress_test_worker_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    log_path = os.path.join(script_dir, log_filename)

    print(f"[{ts()}] Prompts cargados: {n}  (tu cuenta debe tener al menos {n} créditos)")
    print(f"[{ts()}] Imagen de referencia: source.jpg")
    ref_b64 = load_ref_image_base64(source_jpg)
    print(f"[{ts()}] Reference image size (base64): {len(ref_b64)} chars")
    print(f"[{ts()}] Output: JPG 85% (igual que software) en {output_dir}")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {jwt}",
    }

    print(f"[{ts()}] Starting worker stress test: {n} concurrent requests")
    print(f"[{ts()}] Worker: {WORKER_GEN_URL}")
    print(f"[{ts()}] Output dir: {output_dir}")
    print(f"[{ts()}] Log: {log_path}")
    print()

    start_all = time.perf_counter()
    results = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=n) as ex:
        futures = {
            ex.submit(run_one, i, p, ref_b64, headers, output_dir): i
            for i, p in enumerate(PROMPTS)
        }
        for f in concurrent.futures.as_completed(futures):
            r = f.result()
            results.append(r)
            idx = r["idx"]
            sc = r["status_code"]
            el = r.get("elapsed_s")
            el_s = f" elapsed={el:.1f}s" if el is not None else ""
            if sc == 200:
                path_info = f" -> {r.get('local_path', '?')}" if r.get("local_path") else " (download failed)"
                print(f"[{ts()}] REQ #{idx+1:03d} 200 OK{el_s}{path_info}")
            else:
                err = (r.get("error") or "?")[:70]
                print(f"[{ts()}] REQ #{idx+1:03d} {sc}{el_s} error={err}")

    total_wall_s = time.perf_counter() - start_all
    results.sort(key=lambda x: x["idx"])

    ok = [r for r in results if r["status_code"] == 200]
    throttled = [r for r in results if r["status_code"] == 429]
    insufficient = [r for r in results if r["status_code"] == 402]
    other_fail = [r for r in results if r["status_code"] not in (200, 429, 402) and r["status_code"] is not None]
    errors = [r for r in results if r["status_code"] is None]

    # Resumen
    print()
    print(f"[{ts()}] --- STRESS TEST COMPLETE ---")
    print(f"  OK (200):           {len(ok)}")
    print(f"  Throttled (429):    {len(throttled)}")
    print(f"  No credits (402):   {len(insufficient)}")
    print(f"  Other/Failed:       {len(other_fail) + len(errors)}")
    print(f"  Wall clock:         {total_wall_s:.1f}s")
    if ok:
        times = [r["elapsed_s"] for r in ok if r.get("elapsed_s") is not None]
        if times:
            times_sorted = sorted(times)
            p50 = times_sorted[len(times_sorted) // 2] if times_sorted else 0
            p95 = times_sorted[int(len(times_sorted) * 0.95)] if len(times_sorted) > 1 else times_sorted[0]
            print(f"  Avg time (OK):      {sum(times)/len(times):.1f}s")
            print(f"  Min / Max:          {min(times):.1f}s / {max(times):.1f}s")
            print(f"  P50 / P95:          {p50:.1f}s / {p95:.1f}s")
            print(f"  Throughput:         {len(ok) / (total_wall_s / 60):.1f} ok/min")
    downloaded = [r for r in ok if r.get("local_path")]
    print(f"  Images downloaded: {len(downloaded)}")
    if throttled:
        print(f"  Failed indices (429): {[r['idx']+1 for r in throttled]}")
    print()

    # Log ultra detallado
    with open(log_path, "w", encoding="utf-8") as f:
        f.write(f"Kruder1 Worker Stress Test - {ts()}\n")
        f.write("=" * 80 + "\n")
        f.write(f"WORKER_GEN_URL={WORKER_GEN_URL}\n")
        f.write("REF_IMAGE=source.jpg (esta carpeta)\n")
        f.write("prompts_source=prompts.json  output_format=JPG 85% (igual que software)\n")
        f.write(f"Total requests={n}  Concurrent={n}\n")
        f.write(f"Wall clock (s)={total_wall_s:.2f}\n")
        f.write(f"OK={len(ok)}  429={len(throttled)}  402={len(insufficient)}  Other={len(other_fail)+len(errors)}\n")
        f.write("=" * 80 + "\n\n")
        for r in results:
            # Quitar image_url largo del dump para legibilidad; ya está en response_body_preview si hace falta
            log_entry = {k: v for k, v in r.items()}
            if log_entry.get("image_url") and len(str(log_entry["image_url"])) > 120:
                log_entry["image_url_len"] = len(str(r["image_url"]))
                log_entry["image_url"] = str(r["image_url"])[:120] + "..."
            f.write(json.dumps(log_entry, indent=2, ensure_ascii=False))
            f.write("\n\n")
        f.write("=" * 80 + "\n")
        f.write("SUMMARY\n")
        f.write(f"ok={len(ok)} throttled_429={len(throttled)} insufficient_credits_402={len(insufficient)} other_failed={len(other_fail)+len(errors)}\n")
        f.write(f"wall_clock_s={total_wall_s:.2f}\n")
        if ok and [r.get("elapsed_s") for r in ok]:
            times = [r["elapsed_s"] for r in ok if r.get("elapsed_s") is not None]
            f.write(f"avg_elapsed_s={sum(times)/len(times):.2f} min_s={min(times):.2f} max_s={max(times):.2f}\n")
            f.write(f"throughput_ok_per_min={len(ok)/(total_wall_s/60):.2f}\n")
        f.write(f"images_downloaded={len(downloaded)}\n")
        if throttled:
            f.write(f"throttled_indices={[r['idx']+1 for r in throttled]}\n")

    print(f"Log saved to: {log_path}")
    print(f"Images in: {output_dir}")


if __name__ == "__main__":
    main()
