# =============================================================================
# KRUDER 1 - CONFIG
# Loads settings from config.json if present; otherwise uses defaults.
# =============================================================================

import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

_DEFAULT = {
    "WORKER_BASE": "https://kruder1-auth.kruder1-master.workers.dev",
    "GEN_WORKER_BASE": "https://kruder1-gen.kruder1-master.workers.dev",
    "PORT": 8765,
    "APP_DATA": os.path.join(os.getenv("APPDATA", os.path.expanduser("~")), "Kruder1"),
}

def _load():
    out = _DEFAULT.copy()
    config_path = os.path.join(BASE_DIR, "config.json")
    if os.path.isfile(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            for k, v in data.items():
                if k in out and v is not None:
                    out[k] = v
        except Exception:
            pass
    return out

_cfg = _load()
WORKER_BASE = _cfg["WORKER_BASE"]
GEN_WORKER_BASE = _cfg["GEN_WORKER_BASE"]
PORT = _cfg["PORT"]
APP_DATA = _cfg["APP_DATA"]

# App version
APP_VERSION = "1.0.0"

# Image processing defaults
IMAGE_SCALE_FACTOR = 0.75
JPEG_QUALITY = 85
