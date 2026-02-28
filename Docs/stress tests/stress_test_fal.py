"""
Fal.ai Seedream 4.5 - Stress Test
Sends 30 concurrent requests to fal.run (sync - waits for result).
Run: set FAL_KEY=your_key & python stress_test_fal.py
"""
import os
import json
import time
import concurrent.futures
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

FAL_KEY = os.environ.get("FAL_KEY", "")
IMAGE_URL = "https://iili.io/fLDSnaV.jpg"
ENDPOINT = "https://fal.run/fal-ai/bytedance/seedream/v4.5/edit"

PROMPTS = [
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into astronauts in white space suits standing on the lunar surface with Earth in the sky, cinematic sci-fi lighting and realistic moon dust. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into astronauts inside a space station module with control panels, Earth view through windows, and soft ambient lighting. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into superheroes in a comic book style with bold colors, dynamic poses and urban city skyline background. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into superheroes in cinematic movie style with dramatic lighting, metallic costumes and explosive action backdrop. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into firefighters in full gear at a rescue scene with fire trucks, hoses and dramatic smoke and ember lighting. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into firefighters inside a burning building with intense orange glow, smoke particles and heroic dramatic lighting. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into police officers in uniform during a street patrol with urban background and natural daylight. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into SWAT team members in tactical gear with armored vehicles and professional law enforcement atmosphere. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into military soldiers in desert camouflage in a forward operating base with military vehicles and harsh sunlight. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into military pilots in flight suits standing next to fighter jets on a runway with dramatic sky. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into navy sailors in dress whites on the deck of a ship with ocean and sunset background. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into superheroes in a vintage 1960s comic style with dot shading and nostalgic color palette. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into astronauts in Mars colony suits on the red planet surface with habitat domes and dust storms. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into paramedics in uniform at an emergency scene with ambulance and medical equipment. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into secret agents in sleek black suits in a high-tech headquarters with holographic displays. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into knights in medieval armor in a castle throne room with torches and stone architecture. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into superheroes as anime characters with vibrant colors and dynamic manga-style composition. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into astronauts floating in zero gravity inside a space shuttle with equipment and Earth through windows. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into army rangers in jungle camouflage with dense tropical foliage and filtered green lighting. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into coast guard rescue team in orange gear on a helicopter deck with ocean and dramatic clouds. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into superheroes in a gritty noir style with high contrast shadows and rainy city night. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into bomb squad technicians in protective suits at a controlled demolition site. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into astronauts in vintage 1960s NASA gear during the Apollo era with retro spacecraft. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into firefighters as vintage calendar pin-up style with classic truck and nostalgic Americana aesthetic. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into superheroes in a watercolor illustration style with soft edges and painterly atmosphere. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into military medics in field hospital with tents and medical supplies, warm dramatic lighting. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into police detectives in trench coats at a crime scene with yellow tape and urban night lighting. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into superheroes in a vintage propaganda poster style with bold graphics and heroic composition. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into search and rescue volunteers with headlamps in a mountain rescue scenario at dusk. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
    "Use the people in the reference image as the primary source and preserve facial identity with maximum accuracy. Transform them into astronauts in futuristic spaceship cockpit with holographic controls and starlight through viewport. Always facing directly toward the camera. No mask or any object covering the face partially or completely.",
]


def ts():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S.") + f"{int(time.time() * 1000) % 1000:03d}"


def call_fal(idx, prompt):
    body = json.dumps({
        "prompt": prompt,
        "image_urls": [IMAGE_URL],
        "image_size": {"height": 2048, "width": 2048},
    }).encode("utf-8")
    req = Request(ENDPOINT, data=body, method="POST")
    req.add_header("Authorization", f"Key {FAL_KEY}")
    req.add_header("Content-Type", "application/json")
    sent_at = time.perf_counter()
    try:
        # fal.run blocks until generation completes - allow up to 120s
        with urlopen(req, timeout=120) as r:
            elapsed = (time.perf_counter() - sent_at) * 1000
            data = json.loads(r.read().decode())
            images = data.get("images", [])
            return {
                "idx": idx,
                "status": r.status,
                "elapsed_ms": elapsed,
                "elapsed_s": elapsed / 1000,
                "data": data,
                "image_count": len(images),
                "error": None,
            }
    except HTTPError as e:
        elapsed = (time.perf_counter() - sent_at) * 1000
        err_body = e.read().decode() if e.fp else ""
        return {
            "idx": idx,
            "status": e.code,
            "elapsed_ms": elapsed,
            "elapsed_s": elapsed / 1000,
            "data": None,
            "image_count": 0,
            "error": err_body[:200] if err_body else str(e),
        }
    except Exception as ex:
        elapsed = (time.perf_counter() - sent_at) * 1000
        return {
            "idx": idx,
            "status": None,
            "elapsed_ms": elapsed,
            "elapsed_s": elapsed / 1000,
            "data": None,
            "image_count": 0,
            "error": str(ex),
        }


def main():
    if not FAL_KEY:
        print("Error: Set FAL_KEY environment variable.")
        print("  PowerShell: $env:FAL_KEY=\"your-key\"; python scripts/stress_test_fal.py")
        print("  CMD:        set FAL_KEY=your-key & python scripts/stress_test_fal.py")
        return

    log_path = os.path.join(os.path.dirname(__file__), "stress_test_fal_log.txt")
    results = []

    print(f"[{ts()}] Starting fal.ai stress test: 30 concurrent requests")
    print(f"[{ts()}] Image: {IMAGE_URL}")
    print(f"[{ts()}] Endpoint: {ENDPOINT}")
    print(f"[{ts()}] Each request blocks until image is generated (up to 120s)")
    print()

    start_all = time.perf_counter()

    with concurrent.futures.ThreadPoolExecutor(max_workers=30) as ex:
        futures = {ex.submit(call_fal, i, p): i for i, p in enumerate(PROMPTS)}
        for f in concurrent.futures.as_completed(futures):
            r = f.result()
            results.append(r)
            idx = r["idx"]
            status = r["status"]
            elapsed_s = r["elapsed_s"]
            if status == 200:
                print(f"[{ts()}] REQ #{idx+1:2d} 200 OK elapsed={elapsed_s:.1f}s images={r['image_count']}")
            else:
                err = (r["error"] or "?")[:60]
                print(f"[{ts()}] REQ #{idx+1:2d} {status} elapsed={elapsed_s:.1f}s error={err}")

    total_time = (time.perf_counter() - start_all)
    results.sort(key=lambda x: x["idx"])

    ok = [r for r in results if r["status"] == 200]
    throttled = [r for r in results if r["status"] == 429]
    failed = [r for r in results if r["status"] not in (200, 429) and r["status"] is not None]
    errors = [r for r in results if r["status"] is None]

    print()
    print(f"[{ts()}] --- STRESS TEST COMPLETE ---")
    print(f"  OK (200):       {len(ok)}")
    print(f"  Throttled (429): {len(throttled)}")
    print(f"  Other/Failed:   {len(failed) + len(errors)}")
    print(f"  Wall clock:     {total_time:.1f}s")
    if ok:
        times = [r["elapsed_s"] for r in ok]
        print(f"  Avg time (OK):  {sum(times)/len(times):.1f}s (min={min(times):.1f}s max={max(times):.1f}s)")
    print()

    with open(log_path, "w", encoding="utf-8") as f:
        f.write(f"Fal.ai Stress Test Log - {ts()}\n")
        f.write("=" * 60 + "\n")
        for r in results:
            f.write(json.dumps({k: v for k, v in r.items() if k != "data"}, indent=2))
            f.write("\n")
    print(f"Log saved to: {log_path}")


if __name__ == "__main__":
    main()
