# =============================================================================
# KRUDER 1 - UTILS
# Shared services and global configuration
# =============================================================================

import os
import json
import hashlib
import uuid
import logging
import tempfile

try:
    import winreg
except ImportError:
    winreg = None

import requests

from config import WORKER_BASE, GEN_WORKER_BASE, PORT, APP_DATA, BASE_DIR, IMAGE_SCALE_FACTOR, JPEG_QUALITY

log = logging.getLogger("kruder1")

# Data paths
EVENTS_DIR = os.path.join(APP_DATA, "events")
PROMPTS_DIR = os.path.join(APP_DATA, "prompts")
IMAGES_DIR = os.path.join(PROMPTS_DIR, "images")
JSON_FILE = os.path.join(PROMPTS_DIR, "prompts.json")
SESSION_FILE = os.path.join(APP_DATA, "session.json")
FRAMES_DIR = os.path.join(APP_DATA, "frames")
FRAMES_IMAGES_DIR = os.path.join(FRAMES_DIR, "images")
FRAMES_JSON = os.path.join(FRAMES_DIR, "frames.json")
LOGS_DIR = os.path.join(APP_DATA, "logs")

# =============================================================================
# INITIALIZATION
# =============================================================================

def init_environment():
    """Create required folders if they do not exist."""
    for d in [APP_DATA, EVENTS_DIR, PROMPTS_DIR, IMAGES_DIR, FRAMES_DIR, FRAMES_IMAGES_DIR, LOGS_DIR]:
        if not os.path.exists(d):
            os.makedirs(d)
    if not os.path.exists(JSON_FILE):
        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump({"categories": [], "prompts": []}, f)
    if not os.path.exists(FRAMES_JSON):
        with open(FRAMES_JSON, "w", encoding="utf-8") as f:
            json.dump({"frames": []}, f)

# =============================================================================
# RECYCLE BIN (Windows)
# =============================================================================

def send_to_recycle_bin(paths):
    """
    Send file(s) to Windows Recycle Bin. paths: str or list of str.
    Returns True on success, False otherwise.
    """
    try:
        import ctypes
        if isinstance(paths, str):
            paths = [paths]
        paths = [os.path.abspath(p) for p in paths if os.path.exists(p)]
        if not paths:
            return True
        FO_DELETE = 3
        FOF_ALLOWUNDO = 0x40
        FOF_NOCONFIRMATION = 0x10
        FOF_SILENT = 0x4
        class SHFILEOPSTRUCT(ctypes.Structure):
            _fields_ = [
                ("hwnd", ctypes.c_void_p),
                ("wFunc", ctypes.c_uint),
                ("pFrom", ctypes.c_wchar_p),
                ("pTo", ctypes.c_wchar_p),
                ("fFlags", ctypes.c_uint),
                ("fAnyOperationsAborted", ctypes.c_int),
                ("hNameMappings", ctypes.c_void_p),
                ("lpszProgressTitle", ctypes.c_wchar_p),
            ]
        pFrom_str = "\0".join(paths) + "\0\0"
        fileop = SHFILEOPSTRUCT()
        fileop.hwnd = None
        fileop.wFunc = FO_DELETE
        fileop.pFrom = pFrom_str
        fileop.pTo = None
        fileop.fFlags = FOF_ALLOWUNDO | FOF_NOCONFIRMATION | FOF_SILENT
        fileop.fAnyOperationsAborted = 0
        fileop.hNameMappings = None
        fileop.lpszProgressTitle = None
        result = ctypes.windll.shell32.SHFileOperationW(ctypes.byref(fileop))
        return result == 0
    except Exception as e:
        log.warning("send_to_recycle_bin failed: %s", e)
        return False

# =============================================================================
# SECURITY SERVICE
# =============================================================================

class SecurityService:
    @staticmethod
    def get_hwid() -> str:
        """Generate a unique hardware identifier."""
        parts = []
        if winreg:
            try:
                key = winreg.OpenKey(
                    winreg.HKEY_LOCAL_MACHINE,
                    r"SOFTWARE\Microsoft\Cryptography",
                    0,
                    winreg.KEY_READ | winreg.KEY_WOW64_64KEY
                )
                val, _ = winreg.QueryValueEx(key, "MachineGuid")
                winreg.CloseKey(key)
                parts.append(str(val))
            except Exception:
                pass
        try:
            parts.append(str(uuid.getnode()))
        except Exception:
            pass
        if not parts:
            parts.append("fallback-hwid")
        return hashlib.sha256("|".join(parts).encode()).hexdigest()

    @staticmethod
    def validate_path(base_dir, requested_path):
        """Validate path does not escape base dir (path traversal)."""
        full_path = os.path.abspath(os.path.join(base_dir, requested_path))
        if not full_path.startswith(os.path.abspath(base_dir)):
            return None
        return full_path

# =============================================================================
# ERROR SANITIZATION
# =============================================================================

def friendly_error(raw_error: str) -> str:
    """Convert raw API/worker errors into user-friendly messages."""
    lower = (raw_error or "").lower()
    content_keywords = ["content", "flagged", "safety", "policy", "moderation", "nsfw", "inappropriate"]
    if any(kw in lower for kw in content_keywords):
        return "CONTENT NOT ALLOWED"
    return "GENERATION FAILED, TRY AGAIN"


# =============================================================================
# NETWORK SERVICE
# =============================================================================

class NetworkService:
    @staticmethod
    def proxy_api(endpoint, data=None, auth=None, method="POST"):
        """Proxy for auth API calls."""
        url = f"{WORKER_BASE}/{endpoint}"
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Kruder1-Desktop/PROD",
            "X-HWID": SecurityService.get_hwid()
        }
        if auth:
            headers["Authorization"] = auth
        try:
            if method == "GET":
                resp = requests.get(url, headers=headers, timeout=60)
            else:
                if data is None:
                    data = {}
                data["hwid"] = SecurityService.get_hwid()
                if endpoint == "login":
                    data["persistent"] = True
                resp = requests.post(url, json=data, headers=headers, timeout=60)
            return resp.status_code, resp.text
        except Exception as e:
            log.exception("proxy_api %s failed", endpoint)
            return 500, json.dumps({"error": str(e)})

    @staticmethod
    def generate_image(token, payload):
        """Generate prompt thumbnail with AI."""
        url = f"{GEN_WORKER_BASE}/generate-prompt"
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        return requests.post(url, json=payload, headers=headers)

    @staticmethod
    def generate_event_photo(token, payload):
        """Generate event photo with AI."""
        url = f"{GEN_WORKER_BASE}/generate"
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        return requests.post(url, json=payload, headers=headers)

    @staticmethod
    def send_email(token, payload):
        """Send email with generated photo."""
        url = f"{GEN_WORKER_BASE}/send-email"
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        return requests.post(url, json=payload, headers=headers)

    @staticmethod
    def upload_framed_result(token, generation_id, image_path):
        """Upload final JPG to R2 (multipart). image_path: path to the JPG file."""
        url = f"{GEN_WORKER_BASE}/upload-framed-result"
        headers = {"Authorization": f"Bearer {token}"}
        with open(image_path, "rb") as f:
            files = {"image": (f"{generation_id}.jpg", f, "image/jpeg")}
            data = {"generationId": generation_id}
            return requests.post(url, data=data, files=files, headers=headers, timeout=60)

# =============================================================================
# DATA SERVICE
# =============================================================================

class DataService:
    @staticmethod
    def load_json(filepath, default=None):
        """Load JSON file safely."""
        if os.path.exists(filepath):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                log.debug("load_json %s: %s", filepath, e)
        return default

    @staticmethod
    def save_json(filepath, data):
        """Save data to JSON file atomically (write tmp then rename)."""
        dir_name = os.path.dirname(os.path.abspath(filepath))
        fd, tmp_path = tempfile.mkstemp(suffix=".tmp", dir=dir_name)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            os.replace(tmp_path, filepath)
        except BaseException:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
            raise

# =============================================================================
# SESSION HELPERS
# =============================================================================

def update_session_credits(credits_remaining):
    """Update credits in local session file after a generation."""
    if credits_remaining is not None:
        try:
            sess = DataService.load_json(SESSION_FILE)
            if sess and "account" in sess:
                sess["account"]["credits"] = credits_remaining
                DataService.save_json(SESSION_FILE, sess)
        except Exception:
            pass

# =============================================================================
# IMAGE PROCESSING
# =============================================================================

def decode_and_resize_image(base64_str, scale=IMAGE_SCALE_FACTOR):
    """Decode base64 image → RGB → resize. Returns PIL Image (caller must close)."""
    import base64 as b64
    from io import BytesIO
    from PIL import Image
    raw = base64_str.split("base64,")[1] if "base64," in base64_str else base64_str
    img = Image.open(BytesIO(b64.b64decode(raw)))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    return img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)


def process_and_save_image(base64_str, output_path, scale=IMAGE_SCALE_FACTOR, quality=JPEG_QUALITY):
    """Decode base64 image → RGB → resize → save as JPEG."""
    img = decode_and_resize_image(base64_str, scale)
    img.save(output_path, "JPEG", quality=quality)
    img.close()

# init_environment() is called explicitly from main.py at startup
