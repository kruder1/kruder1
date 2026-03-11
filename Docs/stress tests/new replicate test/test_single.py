import json
import time
import sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError

REPLICATE_API_TOKEN = "API_TOKEN_HERE"
ENDPOINT = "https://api.replicate.com/v1/models/google/nano-banana-2/predictions"
IMAGE_URL = "https://i.postimg.cc/hPyTxKf1/GROUP.jpg"

# El primer prompt de tu archivo
PROMPT = "CRITICAL: ALL subjects' facial features must remain 100% identical to their respective reference images. Each face must be individually recognizable with no blending or distortion. A hyper-realistic group hero shot. The subjects stand side by side in a dramatic V-formation power pose. They look directly at the camera with fierce determination. Replace original clothing completely. Each subject wears a unique high-tech superhero suit in coordinated colors. The aftermath of an epic battle on a city street. 8K resolution, ultra-realistic."

def main():
    body = {
        "input": {
            "prompt": PROMPT,
            "image_input": [IMAGE_URL],
            "aspect_ratio": "2:3",
            "resolution": "1K"
        }
    }
    
    req = Request(ENDPOINT, data=json.dumps(body).encode("utf-8"), method="POST")
    req.add_header("Authorization", f"Bearer {REPLICATE_API_TOKEN}")
    req.add_header("Content-Type", "application/json")

    print("Disparando 1 sola petición a Nano Banana 2...")
    try:
        with urlopen(req) as r:
            data = json.loads(r.read().decode())
            get_url = data["urls"]["get"]
            print(f"Petición aceptada por Replicate. ID: {data['id']}")
    except HTTPError as e:
        print(f"Error HTTP {e.code} en POST: {e.read().decode()}")
        sys.exit(1)

    # Polling
    print("Esperando procesamiento...")
    while True:
        time.sleep(2)
        req_get = Request(get_url, method="GET")
        req_get.add_header("Authorization", f"Bearer {REPLICATE_API_TOKEN}")
        try:
            with urlopen(req_get) as r:
                poll_data = json.loads(r.read().decode())
                status = poll_data["status"]
                
                print(f"Estado actual: {status.upper()}")
                
                if status == "succeeded":
                    print("\n¡ÉXITO!")
                    print(f"Output URL: {poll_data.get('output')}")
                    print(f"GPU Time cobrado: {poll_data['metrics'].get('predict_time', 0)}s")
                    break
                elif status == "failed":
                    print("\n¡FALLO EL MODELO!")
                    print(f"Error exacto: {poll_data.get('error')}")
                    print(f"\nLog completo de Replicate para analizar:\n{json.dumps(poll_data, indent=2)}")
                    break
                elif status == "canceled":
                    print("\nCancelada.")
                    break
        except Exception as e:
            print(f"Error haciendo polling: {e}")

if __name__ == "__main__":
    main()