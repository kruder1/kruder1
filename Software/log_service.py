# =============================================================================
# KRUDER 1 - LOG SERVICE
# Writes app events to a daily .txt file in APP_DATA/logs (one file per day).
# Session header includes HWID for machine identification.
# =============================================================================

import os
import json
import threading
from datetime import datetime

from utils import LOGS_DIR, SecurityService

VALID_LEVELS = ("DEBUG", "INFO", "WARN", "WARNING", "ERROR")
_LEVEL_NORMALIZE = {"WARN": "WARNING"}
RETENTION_DAYS = 30
_log_lock = threading.Lock()

# Keys whose values must never be written to the log (passwords, tokens, base64)
REDACT_KEYS = frozenset(("password", "token", "input_b64", "ref_base64", "new_img_base64"))

def _sanitize_value(v, max_len=200):
    if v is None:
        return None
    if isinstance(v, str):
        return v[:max_len] + "..." if len(v) > max_len else v
    if isinstance(v, (dict, list)):
        return f"<{type(v).__name__} len={len(v)}>"
    if isinstance(v, bytes):
        return f"<bytes len={len(v)}>"
    return v


def _redact_dict(d):
    """Return a shallow copy of dict with sensitive keys replaced by [REDACTED]."""
    if not isinstance(d, dict):
        return d
    out = {}
    for k, v in d.items():
        if k.lower() in REDACT_KEYS:
            out[k] = "[REDACTED]"
        else:
            out[k] = _sanitize_value(v)
    return out


def get_log_path_for_today():
    """Return absolute path for today's log file: kruder1_YYYY-MM-DD.txt"""
    today = datetime.now().strftime("%Y-%m-%d")
    return os.path.join(LOGS_DIR, f"kruder1_{today}.txt")


def append_log(level, message, extra=None):
    """
    Append one line to today's log file. Creates file and session header if needed.
    level: DEBUG | INFO | WARNING | ERROR
    message: short string (English)
    extra: optional dict, serialized as compact JSON on the same line
    """
    level = (level or "INFO").upper()
    level = _LEVEL_NORMALIZE.get(level, level)
    if level not in ("DEBUG", "INFO", "WARNING", "ERROR"):
        level = "INFO"
    message = (message or "").strip().replace("\n", " ").replace("\r", "")
    try:
        path = get_log_path_for_today()
        new_file = not os.path.exists(path)
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        line_extra = ""
        if extra is not None and isinstance(extra, dict) and extra:
            try:
                safe = _redact_dict(extra)
                line_extra = " " + json.dumps(safe, ensure_ascii=False, separators=(",", ":"))
            except (TypeError, ValueError):
                line_extra = " " + str(extra)[:200].replace("\n", " ")
        elif extra is not None and not isinstance(extra, dict):
            line_extra = " " + str(extra)[:200].replace("\n", " ")
        log_line = f"{ts} [{level}] {message}{line_extra}"
        with _log_lock:
            with open(path, "a", encoding="utf-8") as f:
                if new_file:
                    hwid = SecurityService.get_hwid()
                    date_str = datetime.now().strftime("%Y-%m-%d")
                    header = f"[SESSION] HWID={hwid} date={date_str} app=Kruder1"
                    f.write(header + "\n")
                f.write(log_line + "\n")
    except Exception:
        pass


def cleanup_old_logs(days=RETENTION_DAYS):
    """Remove log files older than `days` in LOGS_DIR. Call once at startup."""
    if not os.path.isdir(LOGS_DIR):
        return
    try:
        now = datetime.now()
        for name in os.listdir(LOGS_DIR):
            if not name.startswith("kruder1_") or not name.endswith(".txt"):
                continue
            path = os.path.join(LOGS_DIR, name)
            if not os.path.isfile(path):
                continue
            mtime = datetime.fromtimestamp(os.path.getmtime(path))
            if (now - mtime).days > days:
                os.remove(path)
    except Exception:
        pass
