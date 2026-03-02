# =============================================================================
# KRUDER 1 - SETTINGS MODULE
# Persists theme, sound, and camera (deviceId, brightness, contrast, whiteBalance).
# =============================================================================

import os
import json
import hashlib
import threading
import requests

from utils import APP_DATA, EVENTS_DIR, DataService
from config import BASE_DIR, GEN_WORKER_BASE, APP_VERSION
from log_service import append_log


SETTINGS_FILE = os.path.join(APP_DATA, "settings.json")

LOCALES_DIR = os.path.join(BASE_DIR, "static", "locales")


def _get_language_values():
    """Return tuple of language codes from locales folder (*.json files)."""
    if not os.path.isdir(LOCALES_DIR):
        return ("en",)
    codes = []
    for f in os.listdir(LOCALES_DIR):
        if f.endswith(".json"):
            code = f[:-5]  # strip .json
            if code:
                codes.append(code)
    return tuple(sorted(codes)) if codes else ("en",)


DEFAULT_SETTINGS = {
    "theme": "light",
    "language": "en",
    "accentHue": 20,
    "themeLuminance": 15,
    "inkLuminance": 75,
    "sound": {
        "volume": 0.15,
        "uiVolume": 0.75
    },
    "camera": {
        "deviceId": None,
        "brightness": None,
        "contrast": None,
        "whiteBalance": None
    },
    "printing": {
        "enabled": False,
        "automaticPrinting": False,
        "copies": 1,
        "printer": None
    },
    "lockScreenText": "We'll be back in a few minutes..."
}


def _norm_volume(v, default):
    """Normalize volume to 0-1. If stored as 0-100 (e.g. 75), convert to 0.75."""
    if not isinstance(v, (int, float)):
        return default
    if v > 1:
        return max(0.0, min(1.0, v / 100.0))
    return max(0.0, min(1.0, v))


def _sanitize(data):
    """Return theme, sound, camera, printing for persistence."""
    if not data:
        return dict(DEFAULT_SETTINGS)
    sound = data.get("sound") or {}
    camera = data.get("camera") or {}
    printing = data.get("printing") or {}
    def num(v, default):
        return v if isinstance(v, (int, float)) else default
    def copies_val(v):
        n = num(v, 1)
        return max(1, min(999, int(n))) if n is not None else 1
    return {
        "theme": data.get("theme") if data.get("theme") in ("light", "dark") else "light",
        "sound": {
            "volume": _norm_volume(sound.get("volume"), DEFAULT_SETTINGS["sound"]["volume"]),
            "uiVolume": _norm_volume(sound.get("uiVolume"), DEFAULT_SETTINGS["sound"]["uiVolume"])
        },
        "camera": {
            "deviceId": camera.get("deviceId") if isinstance(camera.get("deviceId"), str) and camera.get("deviceId") else None,
            "brightness": max(0, min(100, camera.get("brightness"))) if isinstance(camera.get("brightness"), (int, float)) else None,
            "contrast": max(0, min(100, camera.get("contrast"))) if isinstance(camera.get("contrast"), (int, float)) else None,
            "whiteBalance": max(0, min(100, camera.get("whiteBalance"))) if isinstance(camera.get("whiteBalance"), (int, float)) else None
        },
        "printing": {
            "enabled": bool(printing.get("enabled") if printing.get("enabled") is not None else False),
            "automaticPrinting": bool(printing.get("automaticPrinting")) if printing.get("automaticPrinting") is not None else False,
            "copies": copies_val(printing.get("copies")),
            "printer": printing.get("printer") if isinstance(printing.get("printer"), str) and printing.get("printer") else None
        },
        "lockScreenText": data.get("lockScreenText") if isinstance(data.get("lockScreenText"), str) else DEFAULT_SETTINGS["lockScreenText"],
        "language": data.get("language") if data.get("language") in _get_language_values() else "en",
        "accentHue": max(0, min(360, int(data.get("accentHue", DEFAULT_SETTINGS["accentHue"])))) if isinstance(data.get("accentHue"), (int, float)) else DEFAULT_SETTINGS["accentHue"],
        "themeLuminance": max(0, min(100, int(data.get("themeLuminance", DEFAULT_SETTINGS["themeLuminance"])))) if isinstance(data.get("themeLuminance"), (int, float)) else DEFAULT_SETTINGS["themeLuminance"],
        "inkLuminance": max(0, min(100, int(data.get("inkLuminance", DEFAULT_SETTINGS["inkLuminance"])))) if isinstance(data.get("inkLuminance"), (int, float)) else DEFAULT_SETTINGS["inkLuminance"]
    }


class SettingsModule:

    def __init__(self):
        self._ensure_settings_file()

    def _ensure_settings_file(self):
        if not os.path.exists(SETTINGS_FILE):
            DataService.save_json(SETTINGS_FILE, DEFAULT_SETTINGS)
        else:
            # Migrate: keep only theme and sound so file stays clean
            current = DataService.load_json(SETTINGS_FILE, None)
            DataService.save_json(SETTINGS_FILE, _sanitize(current))

    def get_settings(self) -> dict:
        settings = DataService.load_json(SETTINGS_FILE, None)
        return {"ok": True, "settings": _sanitize(settings)}

    def get_setting(self, key: str) -> dict:
        settings = _sanitize(DataService.load_json(SETTINGS_FILE, None))
        keys = key.split(".")
        value = settings
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return {"error": f"Setting not found: {key}"}
        return {"ok": True, "value": value}

    def update_setting(self, key: str, value) -> dict:
        try:
            current = DataService.load_json(SETTINGS_FILE, None)
            data = _sanitize(current)
            keys = key.split(".")
            target = data
            for k in keys[:-1]:
                if k not in target:
                    target[k] = {}
                target = target[k]
            target[keys[-1]] = value
            DataService.save_json(SETTINGS_FILE, _sanitize(data))
            return {"ok": True}
        except Exception as e:
            append_log("ERROR", "update_setting", {"key": key, "error": str(e)[:200]})
            return {"error": str(e)}

    def update_settings(self, updates: dict) -> dict:
        try:
            current = DataService.load_json(SETTINGS_FILE, None)
            data = _sanitize(current)
            for key, value in updates.items():
                if key == "sound" and isinstance(value, dict):
                    data["sound"]["volume"] = _norm_volume(value.get("volume"), data["sound"]["volume"])
                    data["sound"]["uiVolume"] = _norm_volume(value.get("uiVolume"), data["sound"]["uiVolume"])
                elif key == "theme" and value in ("light", "dark"):
                    data["theme"] = value
                elif key == "language" and value in _get_language_values():
                    data["language"] = value
                elif key == "accentHue" and isinstance(value, (int, float)):
                    data["accentHue"] = max(0, min(360, int(value)))
                elif key == "themeLuminance" and isinstance(value, (int, float)):
                    data["themeLuminance"] = max(0, min(100, int(value)))
                elif key == "inkLuminance" and isinstance(value, (int, float)):
                    data["inkLuminance"] = max(0, min(100, int(value)))
                elif key == "camera" and isinstance(value, dict):
                    c = value
                    if isinstance(c.get("deviceId"), str): data["camera"]["deviceId"] = c.get("deviceId") or None
                    if isinstance(c.get("brightness"), (int, float)): data["camera"]["brightness"] = max(0, min(100, c.get("brightness")))
                    if isinstance(c.get("contrast"), (int, float)): data["camera"]["contrast"] = max(0, min(100, c.get("contrast")))
                    if isinstance(c.get("whiteBalance"), (int, float)): data["camera"]["whiteBalance"] = max(0, min(100, c.get("whiteBalance")))
            DataService.save_json(SETTINGS_FILE, data)
            return {"ok": True}
        except Exception as e:
            append_log("ERROR", "update_settings", {"error": str(e)[:200]})
            return {"error": str(e)}

    def reset_settings(self) -> dict:
        try:
            DataService.save_json(SETTINGS_FILE, DEFAULT_SETTINGS)
            return {"ok": True, "settings": DEFAULT_SETTINGS}
        except Exception as e:
            return {"error": str(e)}

    def get_theme(self) -> str:
        settings = DataService.load_json(SETTINGS_FILE, None)
        data = _sanitize(settings)
        return data.get("theme", "light")

    def set_theme(self, theme: str) -> dict:
        if theme not in ("light", "dark"):
            return {"error": "Invalid theme"}
        return self.update_setting("theme", theme)

    def get_sound_settings(self) -> dict:
        settings = DataService.load_json(SETTINGS_FILE, None)
        data = _sanitize(settings)
        return {"ok": True, "sound": data["sound"]}

    def update_sound_settings(self, sound_settings: dict) -> dict:
        return self.update_settings({"sound": sound_settings})

    def get_camera_settings(self) -> dict:
        settings = DataService.load_json(SETTINGS_FILE, None)
        data = _sanitize(settings)
        return {"ok": True, "camera": data["camera"]}

    def update_camera_settings(self, camera_settings: dict) -> dict:
        try:
            current = DataService.load_json(SETTINGS_FILE, None)
            data = _sanitize(current)
            c = camera_settings or {}
            if "deviceId" in c: data["camera"]["deviceId"] = c["deviceId"] if isinstance(c.get("deviceId"), str) else None
            if isinstance(c.get("brightness"), (int, float)): data["camera"]["brightness"] = max(0, min(100, c["brightness"]))
            if isinstance(c.get("contrast"), (int, float)): data["camera"]["contrast"] = max(0, min(100, c["contrast"]))
            if isinstance(c.get("whiteBalance"), (int, float)): data["camera"]["whiteBalance"] = max(0, min(100, c["whiteBalance"]))
            DataService.save_json(SETTINGS_FILE, data)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def get_printing_settings(self) -> dict:
        settings = DataService.load_json(SETTINGS_FILE, None)
        data = _sanitize(settings)
        return {"ok": True, "printing": data["printing"]}

    def update_printing_settings(self, printing_settings: dict) -> dict:
        try:
            current = DataService.load_json(SETTINGS_FILE, None)
            data = _sanitize(current)
            p = printing_settings or {}
            if "enabled" in p:
                data["printing"]["enabled"] = bool(p["enabled"])
            if "automaticPrinting" in p:
                data["printing"]["automaticPrinting"] = bool(p["automaticPrinting"])
            if "copies" in p and isinstance(p.get("copies"), (int, float)):
                data["printing"]["copies"] = max(1, min(999, int(p["copies"])))
            if "printer" in p:
                data["printing"]["printer"] = p["printer"] if isinstance(p.get("printer"), str) and p.get("printer") else None
            DataService.save_json(SETTINGS_FILE, data)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def open_printer_settings(self, printer_name: str) -> dict:
        """Open printer preferences dialog on Windows (/e = printing preferences)."""
        if not printer_name or not str(printer_name).strip():
            return {"ok": False, "error": "No printer selected"}
        try:
            import subprocess
            name = str(printer_name).strip()
            subprocess.Popen(
                ["rundll32", "printui.dll,PrintUIEntry", "/e", "/n", name],
                shell=False,
                creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, "CREATE_NO_WINDOW") else 0
            )
            return {"ok": True}
        except Exception as e:
            return {"ok": False, "error": str(e)}

    def test_print(self, printer_name: str) -> dict:
        """Send 1 silent test print of the placeholder image to the printer (no dialogs)."""
        if not printer_name or not str(printer_name).strip():
            return {"ok": False, "error": "No printer selected"}
        path = os.path.join(BASE_DIR, "static", "img", "print_test.jpg")
        if not os.path.isfile(path):
            return {"ok": False, "error": "print_test.jpg not found"}
        name = str(printer_name).strip()
        try:
            import win32ui
            from PIL import Image, ImageWin
            hdc = win32ui.CreateDC()
            hdc.CreatePrinterDC(name)
            try:
                printer_w = hdc.GetDeviceCaps(110)   # PHYSICALWIDTH
                printer_h = hdc.GetDeviceCaps(111)   # PHYSICALHEIGHT
                rect = (0, 0, printer_w, printer_h)
                hdc.StartDoc("Print placeholder")
                hdc.StartPage()
                img = Image.open(path)
                if img.mode not in ("1", "L", "P", "RGB"):
                    img = img.convert("RGB")
                dib = ImageWin.Dib(img)
                dib.draw(hdc.GetHandleOutput(), rect)
                hdc.EndPage()
                hdc.EndDoc()
            finally:
                hdc.DeleteDC()
            return {"ok": True}
        except ImportError as e:
            return {"ok": False, "error": "Install pywin32 and Pillow for silent print: " + str(e)}
        except Exception as e:
            return {"ok": False, "error": str(e)}

    def print_image(self, image_path: str, printer_name: str) -> dict:
        """Print an image at the given path to the specified printer (no dialogs)."""
        path = os.path.abspath(image_path)
        if not os.path.isfile(path):
            return {"ok": False, "error": "Image file not found"}
        name = str(printer_name).strip() if printer_name else None
        if not name:
            return {"ok": False, "error": "No printer selected"}
        try:
            import win32ui
            from PIL import Image, ImageWin
            hdc = win32ui.CreateDC()
            hdc.CreatePrinterDC(name)
            try:
                printer_w = hdc.GetDeviceCaps(110)
                printer_h = hdc.GetDeviceCaps(111)
                rect = (0, 0, printer_w, printer_h)
                hdc.StartDoc(os.path.basename(path))
                hdc.StartPage()
                img = Image.open(path)
                if img.mode not in ("1", "L", "P", "RGB"):
                    img = img.convert("RGB")
                dib = ImageWin.Dib(img)
                dib.draw(hdc.GetHandleOutput(), rect)
                hdc.EndPage()
                hdc.EndDoc()
            finally:
                hdc.DeleteDC()
            return {"ok": True}
        except ImportError as e:
            return {"ok": False, "error": "Install pywin32 and Pillow for silent print: " + str(e)}
        except Exception as e:
            return {"ok": False, "error": str(e)}

    def get_lock_screen_text(self) -> dict:
        settings = DataService.load_json(SETTINGS_FILE, None)
        data = _sanitize(settings)
        return {"ok": True, "text": data.get("lockScreenText") or DEFAULT_SETTINGS["lockScreenText"]}

    def update_lock_screen_text(self, text: str) -> dict:
        try:
            current = DataService.load_json(SETTINGS_FILE, None)
            data = _sanitize(current)
            data["lockScreenText"] = str(text) if text is not None else DEFAULT_SETTINGS["lockScreenText"]
            DataService.save_json(SETTINGS_FILE, data)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def get_locales(self) -> dict:
        """Return list of available locale codes from static/locales/*.json."""
        codes = list(_get_language_values())
        return {"ok": True, "locales": codes}

    def get_printers(self) -> dict:
        """Return list of printer names for the dropdown. Same machine as settings.json."""
        names = []
        try:
            import win32print
            names = [p[2] for p in win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS)]
        except Exception:
            try:
                import subprocess
                r = subprocess.run(
                    ["powershell", "-NoProfile", "-Command", "Get-Printer | Select-Object -ExpandProperty Name"],
                    capture_output=True, text=True, timeout=5
                )
                if r.returncode == 0 and r.stdout:
                    names = [s.strip() for s in r.stdout.strip().splitlines() if s.strip()]
            except Exception:
                pass
        return {"ok": True, "printers": names or []}

    def get_statistics(self, event_id=None) -> dict:
        """Compute statistics for a single event or all events (global)."""
        try:
            if event_id and event_id != "__global__":
                stats = self._compute_event_stats(event_id)
                if stats is None:
                    return {"ok": False, "error": "Event not found"}
                return {"ok": True, "stats": stats, "eventId": event_id}
            else:
                stats = self._compute_global_stats()
                return {"ok": True, "stats": stats}
        except Exception as e:
            return {"ok": False, "error": str(e)}

    def _compute_event_stats(self, event_id: str) -> dict:
        """Compute stats for a single event from event.json + generation JSONs."""
        event_path = os.path.join(EVENTS_DIR, event_id, "event.json")
        event_data = DataService.load_json(event_path)
        if not event_data:
            return None

        raw = event_data.get("stats", {})
        total = raw.get("total", 0)
        success = raw.get("success", 0)
        failed = raw.get("failed", 0)
        prints_sent = raw.get("printsSent", 0)
        prints_ok = raw.get("printsSuccessful", 0)

        # Scan generation JSONs for unique emails and durations
        unique_emails = set()
        durations = []
        images_dir = os.path.join(EVENTS_DIR, event_id, "images")
        if os.path.isdir(images_dir):
            for fname in os.listdir(images_dir):
                if not fname.endswith(".json"):
                    continue
                gen_data = DataService.load_json(os.path.join(images_dir, fname))
                if not gen_data:
                    continue
                email = gen_data.get("email")
                if email and str(email).strip():
                    unique_emails.add(str(email).strip().lower())
                dur = gen_data.get("generationDurationSeconds")
                if dur is not None:
                    try:
                        durations.append(float(dur))
                    except (ValueError, TypeError):
                        pass
        emails_count = len(unique_emails)

        if total < success:
            total = success
        gen_failed = max(0, total - success)
        success_rate = round((success / total * 100), 1) if total > 0 else 0
        prints_failed = max(0, prints_sent - prints_ok)
        print_rate = round((prints_ok / prints_sent * 100), 1) if prints_sent > 0 else 0
        avg_time = round(sum(durations) / len(durations), 1) if durations else None

        return {
            "generationAttempts": total,
            "photosGenerated": success,
            "generationFailed": gen_failed,
            "successRate": success_rate,
            "printsSent": prints_sent,
            "printsSuccessful": prints_ok,
            "printsFailed": prints_failed,
            "printSuccessRate": print_rate,
            "emailsCount": emails_count,
            "avgTimeSeconds": avg_time,
        }

    def _compute_global_stats(self) -> dict:
        """Aggregate statistics across all events."""
        total_attempts = 0
        total_generated = 0
        total_prints_sent = 0
        total_prints_ok = 0
        global_emails = set()
        all_durations = []

        if os.path.isdir(EVENTS_DIR):
            for d in os.listdir(EVENTS_DIR):
                event_path = os.path.join(EVENTS_DIR, d, "event.json")
                if not os.path.isfile(event_path):
                    continue
                es = self._compute_event_stats(d)
                if not es:
                    continue
                total_attempts += es["generationAttempts"]
                total_generated += es["photosGenerated"]
                total_prints_sent += es["printsSent"]
                total_prints_ok += es["printsSuccessful"]

                # Collect unique emails and durations from gen JSONs
                images_dir = os.path.join(EVENTS_DIR, d, "images")
                if os.path.isdir(images_dir):
                    for fname in os.listdir(images_dir):
                        if not fname.endswith(".json"):
                            continue
                        gd = DataService.load_json(os.path.join(images_dir, fname))
                        if not gd:
                            continue
                        email = gd.get("email")
                        if email and str(email).strip():
                            global_emails.add(str(email).strip().lower())
                        dur = gd.get("generationDurationSeconds")
                        if dur is not None:
                            try:
                                all_durations.append(float(dur))
                            except (ValueError, TypeError):
                                pass

        failed = max(0, total_attempts - total_generated)
        success_rate = round((total_generated / total_attempts * 100), 1) if total_attempts > 0 else 0
        prints_failed = max(0, total_prints_sent - total_prints_ok)
        print_rate = round((total_prints_ok / total_prints_sent * 100), 1) if total_prints_sent > 0 else 0
        avg_time = round(sum(all_durations) / len(all_durations), 1) if all_durations else None

        return {
            "generationAttempts": total_attempts,
            "photosGenerated": total_generated,
            "generationFailed": failed,
            "successRate": success_rate,
            "printsSent": total_prints_sent,
            "printsSuccessful": total_prints_ok,
            "printsFailed": prints_failed,
            "printSuccessRate": print_rate,
            "emailsCount": len(global_emails),
            "avgTimeSeconds": avg_time,
        }

    @staticmethod
    def _is_valid_email(s):
        """Basic email validation: must have @ and a dot after @."""
        if not s or "@" not in s:
            return False
        parts = s.split("@")
        if len(parts) != 2:
            return False
        return len(parts[0]) > 0 and "." in parts[1] and len(parts[1]) > 2

    def get_event_emails(self, event_id=None) -> dict:
        """Return unique valid emails from one event or all events."""
        emails = []
        seen = set()

        event_ids = []
        if event_id and event_id != "__global__":
            event_ids = [event_id]
        elif os.path.isdir(EVENTS_DIR):
            event_ids = [d for d in os.listdir(EVENTS_DIR)
                         if os.path.isfile(os.path.join(EVENTS_DIR, d, "event.json"))]

        for eid in event_ids:
            images_dir = os.path.join(EVENTS_DIR, eid, "images")
            if not os.path.isdir(images_dir):
                continue
            for fname in os.listdir(images_dir):
                if not fname.endswith(".json"):
                    continue
                gd = DataService.load_json(os.path.join(images_dir, fname))
                if not gd:
                    continue
                email = gd.get("email")
                if email:
                    clean = str(email).strip().lower()
                    if clean not in seen and self._is_valid_email(clean):
                        emails.append(clean)
                        seen.add(clean)

        # Get event name for export filename
        event_name = "all_events"
        if event_id and event_id != "__global__":
            ep = os.path.join(EVENTS_DIR, event_id, "event.json")
            ed = DataService.load_json(ep)
            if ed:
                event_name = ed.get("name", "event")

        return {"ok": True, "emails": emails, "eventName": event_name}

    # =========================================================================
    # SOFTWARE UPDATE
    # =========================================================================

    def __init_update_state(self):
        if not hasattr(self, '_update_available'):
            self._update_available = None
        if not hasattr(self, '_download_progress'):
            self._download_progress = None

    def check_for_update(self, token):
        """Check the gen worker for a newer version."""
        self.__init_update_state()
        try:
            resp = requests.get(
                f"{GEN_WORKER_BASE}/check-software-update",
                headers={"Authorization": f"Bearer {token}" if token else ""},
                timeout=15,
            )
            if resp.status_code != 200:
                return {"error": f"Server returned {resp.status_code}"}
            data = resp.json()
            if not data.get("ok"):
                return {"error": data.get("error", "Unknown error")}
            remote = data.get("version", "0.0.0")
            update_available = self._compare_versions(remote, APP_VERSION) > 0
            result = {
                "ok": True,
                "update_available": update_available,
                "current": APP_VERSION,
                "latest": remote,
                "url": data.get("url", ""),
                "size": data.get("size", 0),
                "hash": data.get("hash", ""),
                "notes": data.get("notes", ""),
                "date": data.get("date", ""),
            }
            if update_available:
                self._update_available = result
            return result
        except Exception as e:
            append_log("ERROR", "check_for_update", {"error": str(e)[:200]})
            return {"error": str(e)}

    def get_pending_update(self):
        """Return cached update info from auto-check (or None)."""
        self.__init_update_state()
        if self._update_available and self._update_available.get("update_available"):
            return self._update_available
        return {"ok": True, "update_available": False}

    def download_update(self, download_url, expected_hash=""):
        """Download installer to ~/Downloads in a background thread."""
        self.__init_update_state()
        self._download_progress = {"percent": 0, "downloaded_mb": 0, "total_mb": 0, "status": "downloading", "path": ""}
        thread = threading.Thread(target=self._download_thread, args=(download_url, expected_hash), daemon=True)
        thread.start()
        return {"ok": True}

    def _download_thread(self, url, expected_hash):
        try:
            resp = requests.get(url, stream=True, timeout=300)
            if resp.status_code != 200:
                self._download_progress["status"] = "error"
                self._download_progress["error"] = f"HTTP {resp.status_code}"
                return
            total = int(resp.headers.get("content-length", 0))
            total_mb = round(total / 1048576, 1) if total else 0
            self._download_progress["total_mb"] = total_mb

            downloads = os.path.join(os.path.expanduser("~"), "Downloads")
            os.makedirs(downloads, exist_ok=True)
            filename = url.rsplit("/", 1)[-1] if "/" in url else "Kruder1-Setup.exe"
            dest = os.path.join(downloads, filename)

            sha = hashlib.sha256()
            downloaded = 0
            with open(dest, "wb") as f:
                for chunk in resp.iter_content(chunk_size=65536):
                    f.write(chunk)
                    sha.update(chunk)
                    downloaded += len(chunk)
                    self._download_progress["downloaded_mb"] = round(downloaded / 1048576, 1)
                    self._download_progress["percent"] = int(downloaded / total * 100) if total else 0

            # Validate hash if provided
            if expected_hash:
                h = expected_hash.replace("sha256:", "")
                if sha.hexdigest() != h:
                    self._download_progress["status"] = "error"
                    self._download_progress["error"] = "Hash mismatch"
                    try:
                        os.remove(dest)
                    except Exception:
                        pass
                    return

            self._download_progress["status"] = "complete"
            self._download_progress["percent"] = 100
            self._download_progress["path"] = dest
            # Store verified hash for re-check before install
            self._last_download_hash = sha.hexdigest()
            self._last_download_path = dest
            append_log("INFO", "update_downloaded", {"path": dest})
        except Exception as e:
            self._download_progress["status"] = "error"
            self._download_progress["error"] = str(e)[:200]
            append_log("ERROR", "update_download_error", {"error": str(e)[:200]})

    def get_download_progress(self):
        """Return current download progress."""
        self.__init_update_state()
        if not self._download_progress:
            return {"ok": True, "status": "idle"}
        return {"ok": True, **self._download_progress}

    def install_update(self, installer_path):
        """Launch the installer and signal the frontend to close."""
        path = os.path.abspath(installer_path)
        if not os.path.isfile(path) or not path.lower().endswith(".exe"):
            return {"error": "Invalid installer path"}
        # Re-verify file integrity before executing
        self.__init_update_state()
        if hasattr(self, '_last_download_hash') and self._last_download_hash:
            if hasattr(self, '_last_download_path') and os.path.abspath(self._last_download_path) == path:
                sha = hashlib.sha256()
                with open(path, "rb") as f:
                    for chunk in iter(lambda: f.read(65536), b""):
                        sha.update(chunk)
                if sha.hexdigest() != self._last_download_hash:
                    append_log("ERROR", "install_update_hash_mismatch", {"path": path})
                    return {"error": "File integrity check failed — file may have been tampered with"}
        try:
            os.startfile(path)
            append_log("INFO", "update_install_launched", {"path": path})
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def _compare_versions(a, b):
        """Compare semver strings. Returns >0 if a > b, 0 if equal, <0 if a < b."""
        def parts(v):
            return tuple(int(x) for x in v.split(".") if x.isdigit())
        pa, pb = parts(a), parts(b)
        for i in range(max(len(pa), len(pb))):
            va = pa[i] if i < len(pa) else 0
            vb = pb[i] if i < len(pb) else 0
            if va != vb:
                return va - vb
        return 0
