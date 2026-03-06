# =============================================================================
# KRUDER 1 - API.PY
# NativeApi - Bridge between JavaScript and Python (pywebview)
# Delegates all logic to specialized modules
# =============================================================================

import os
import re
import webview
import requests

try:
    import winreg
except ImportError:
    winreg = None

from config import GEN_WORKER_BASE, APP_VERSION
from utils import EVENTS_DIR, DataService, SecurityService, NetworkService, SESSION_FILE
from log_service import append_log, get_log_path_for_today
from modules import AuthModule, SettingsModule


class NativeApi:
    """
    API exposed to JavaScript via window.pywebview.api.
    Delegates to specialized modules to keep code organized.
    Heavy modules (EventMode, PromptLab, Frames) are lazy-loaded on first use.
    """

    def __init__(self):
        self._window = None
        self._modules = {}
        self._is_fullscreen = True  # App starts in fullscreen (main.py)

        # Auth and Settings load immediately (needed for login + theme)
        self._modules['auth'] = AuthModule()
        self._modules['settings'] = SettingsModule()

    def _get(self, name):
        """Lazy-load a module on first access."""
        if name not in self._modules:
            if name == 'dashboard':
                from modules import DashboardModule
                self._modules[name] = DashboardModule()
            elif name == 'events':
                from modules import EventsModule
                self._modules[name] = EventsModule()
            elif name == 'eventmode':
                from modules import EventModeModule
                self._modules[name] = EventModeModule()
            elif name == 'promptlab':
                from modules import PromptLabModule
                self._modules[name] = PromptLabModule()
            elif name == 'frames':
                from modules import FramesModule
                self._modules[name] = FramesModule()
        return self._modules[name]

    @property
    def _auth(self):
        return self._modules['auth']

    @property
    def _settings(self):
        return self._modules['settings']

    @property
    def _dashboard(self):
        return self._get('dashboard')

    @property
    def _events(self):
        return self._get('events')

    @property
    def _eventmode(self):
        return self._get('eventmode')

    @property
    def _promptlab(self):
        return self._get('promptlab')

    @property
    def _frames(self):
        return self._get('frames')

    # =========================================================================
    # SYSTEM
    # =========================================================================

    def get_app_version(self):
        """Return the current application version."""
        return APP_VERSION

    def close_app(self):
        """Close the application."""
        self._set_edge_swipe_blocked(False)
        try:
            append_log("INFO", "app_exit", {"source": "quit_button"})
        except Exception:
            pass
        if self._window:
            self._window.destroy()
        os._exit(0)

    def toggle_fullscreen(self):
        """Toggle between fullscreen and maximized windowed."""
        if self._window:
            self._window.toggle_fullscreen()
            self._is_fullscreen = not self._is_fullscreen
            if not self._is_fullscreen:
                self._window.maximize()
            self._set_edge_swipe_blocked(self._is_fullscreen)
            return {"ok": True, "fullscreen": self._is_fullscreen}
        return {"error": "Window not available"}

    def get_fullscreen_state(self):
        """Get current fullscreen state."""
        if self._window:
            return {"ok": True, "fullscreen": self._is_fullscreen}
        return {"error": "Window not available"}

    def _set_edge_swipe_blocked(self, block):
        """Block/unblock Windows edge swipe gestures via registry. Requires admin."""
        if not winreg:
            return
        try:
            key_path = r"SOFTWARE\Policies\Microsoft\Windows\EdgeUI"
            if block:
                key = winreg.CreateKeyEx(
                    winreg.HKEY_LOCAL_MACHINE, key_path, 0,
                    winreg.KEY_SET_VALUE | winreg.KEY_WOW64_64KEY
                )
                winreg.SetValueEx(key, "AllowEdgeSwipe", 0, winreg.REG_DWORD, 0)
                winreg.CloseKey(key)
            else:
                key = winreg.OpenKey(
                    winreg.HKEY_LOCAL_MACHINE, key_path, 0,
                    winreg.KEY_SET_VALUE | winreg.KEY_WOW64_64KEY
                )
                winreg.SetValueEx(key, "AllowEdgeSwipe", 0, winreg.REG_DWORD, 1)
                winreg.CloseKey(key)
        except Exception:
            pass  # No admin rights — silently skip

    def check_system_status(self):
        """Check health of all backend services."""
        return NetworkService.check_system_status()

    def log_event(self, level, message, data=None):
        """Append an event to the daily log file (called from frontend)."""
        try:
            append_log(level, message, extra=data)
        except Exception:
            pass

    def upload_debug_log(self):
        """Read today's log file and upload it to R2 via the gen worker."""
        try:
            path = get_log_path_for_today()
            if not os.path.isfile(path):
                return {"ok": False, "error": "No log file for today"}
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if not content.strip():
                return {"ok": False, "error": "Log file is empty"}
            sess = DataService.load_json(SESSION_FILE)
            token = (sess or {}).get("token", "")
            hwid = SecurityService.get_hwid()
            resp = requests.post(
                f"{GEN_WORKER_BASE}/upload-debug-log",
                headers={
                    "Authorization": f"Bearer {token}" if token else "",
                    "X-HWID": hwid,
                    "Content-Type": "text/plain; charset=utf-8",
                },
                data=content.encode("utf-8"),
                timeout=30,
            )
            if resp.status_code == 200:
                append_log("INFO", "debug_log_uploaded")
                return {"ok": True}
            append_log("WARNING", "debug_log_upload_failed", {"status": resp.status_code})
            return {"ok": False, "error": "Upload failed"}
        except Exception as e:
            append_log("ERROR", "debug_log_upload_error", {"error": str(e)[:200]})
            return {"ok": False, "error": str(e)}

    # =========================================================================
    # AUTH MODULE - Delegation
    # =========================================================================

    def login(self, email, password):
        return self._auth.login(email, password)

    def get_session_data(self):
        return self._auth.get_session_data()

    def clear_session(self):
        return self._auth.clear_session()

    def refresh_account(self):
        return self._auth.refresh_account()

    # =========================================================================
    # DASHBOARD MODULE - Delegation
    # =========================================================================

    def get_dashboard_data(self):
        return self._dashboard.get_dashboard_data()

    # =========================================================================
    # EVENTS MODULE - Delegation
    # =========================================================================

    def get_events(self):
        return self._events.get_events()

    def create_event(self, name):
        return self._events.create_event(name)

    def rename_event(self, eid, new_name):
        return self._events.rename_event(eid, new_name)

    def delete_event(self, eid):
        return self._events.delete_event(eid)

    def delete_event_image(self, event_id, image_id):
        return self._events.delete_event_image(event_id, image_id)

    def print_event_image(self, event_id, filename, printer_name, copies=1):
        """Print event image (event_id/images/filename) to the printer, N copies."""
        if not event_id or not filename:
            return {"ok": False, "error": "Missing event or filename"}
        copies = max(1, min(999, int(copies)))
        images_dir = os.path.join(EVENTS_DIR, str(event_id), "images")
        fpath = SecurityService.validate_path(images_dir, str(filename).replace("..", "").strip())
        if not fpath or not os.path.isfile(fpath):
            return {"ok": False, "error": "Image not found"}

        successful = 0
        last_error = None
        for _ in range(copies):
            res = self._settings.print_image(fpath, printer_name)
            if res.get("ok"):
                successful += 1
            else:
                last_error = res

        # Update print stats in event.json
        self._update_print_stats(event_id, copies, successful)

        if successful == copies:
            append_log("INFO", "print_event_image", {"event_id": event_id, "filename": filename, "copies": copies, "ok": True})
            return {"ok": True}
        elif successful > 0:
            append_log("WARNING", "print_event_image", {"event_id": event_id, "printed": successful, "requested": copies})
            return {"ok": True, "partial": True, "printed": successful, "requested": copies}
        else:
            err = last_error or {"ok": False, "error": "Print failed"}
            append_log("ERROR", "print_event_image", {"event_id": event_id, "error": err.get("error", "Print failed")[:200]})
            return err

    def _update_print_stats(self, event_id, sent, successful):
        """Increment print counters in event.json stats."""
        try:
            event_path = os.path.join(EVENTS_DIR, str(event_id), "event.json")
            event_data = DataService.load_json(event_path)
            if not event_data:
                return
            if "stats" not in event_data:
                event_data["stats"] = {"total": 0, "success": 0, "failed": 0}
            event_data["stats"]["printsSent"] = event_data["stats"].get("printsSent", 0) + sent
            event_data["stats"]["printsSuccessful"] = event_data["stats"].get("printsSuccessful", 0) + successful
            DataService.save_json(event_path, event_data)
        except Exception:
            pass

    def export_gallery(self, event_id, event_name, export_type):
        if not self._window:
            return {"error": "Window not available"}
        try:
            desktop = os.path.expanduser("~\\Desktop")
            if export_type == "zip":
                result = self._window.create_file_dialog(
                    webview.FileDialog.SAVE, 
                    directory=desktop, 
                    save_filename=f"{event_name}.zip",
                    file_types=('ZIP Files (*.zip)', 'All Files (*.*)')
                )
                if result and len(result) > 0:
                    return self._events.export_gallery(event_id, result[0], "zip")
            else:
                result = self._window.create_file_dialog(
                    webview.FileDialog.FOLDER, 
                    directory=desktop
                )
                if result and len(result) > 0:
                    return self._events.export_gallery(event_id, result[0], "images")
            return {"ok": False, "cancelled": True}
        except Exception as e:
            return {"error": str(e)}

    # =========================================================================
    # EVENTMODE MODULE - Delegation
    # =========================================================================

    def start_event_generation(self, token, event_id, input_b64, style_id, prompt_text):
        return self._eventmode.start_event_generation(token, event_id, input_b64, style_id, prompt_text)

    def check_generation_status(self, event_id, gen_id):
        return self._eventmode.check_generation_status(event_id, gen_id)

    def finalize_event_generation(self, token, event_id, gen_id, email):
        return self._eventmode.finalize_event_generation(token, event_id, gen_id, email)

    # =========================================================================
    # PROMPTLAB MODULE - Delegation
    # =========================================================================

    def get_prompt_library(self):
        return self._promptlab.get_prompt_library()

    def get_categories(self):
        return self._promptlab.get_categories()

    def get_prompts_by_category(self, cat_id):
        return self._promptlab.get_prompts_by_category(cat_id)

    def get_prompt_details(self, prompt_id):
        return self._promptlab.get_prompt_details(prompt_id)

    def generate_and_save_prompt(self, token, ref_base64, prompt_name, category_name, category_id_or_new, prompt_desc):
        return self._promptlab.generate_and_save_prompt(token, ref_base64, prompt_name, category_name, category_id_or_new, prompt_desc)

    def update_prompt(self, prompt_id, name, category_id_or_new, new_cat_name, text, new_img_base64=None):
        return self._promptlab.update_prompt(prompt_id, name, category_id_or_new, new_cat_name, text, new_img_base64)

    def delete_prompt(self, prompt_id):
        return self._promptlab.delete_prompt(prompt_id)

    def rename_category(self, cat_id, new_name):
        return self._promptlab.rename_category(cat_id, new_name)

    def delete_category(self, cat_id):
        return self._promptlab.delete_category(cat_id)

    def reorder_categories(self, category_ids):
        return self._promptlab.reorder_categories(category_ids)

    def move_prompt_to_category(self, prompt_id, category_id):
        return self._promptlab.move_prompt_to_category(prompt_id, category_id)

    def create_category_and_move_prompt(self, category_name, prompt_id):
        return self._promptlab.create_category_and_move_prompt(category_name, prompt_id)

    def reorder_prompts(self, prompt_ids):
        return self._promptlab.reorder_prompts(prompt_ids)

    def toggle_category(self, cat_id, enabled):
        return self._promptlab.toggle_category(cat_id, enabled)

    def toggle_prompt(self, prompt_id, enabled):
        return self._promptlab.toggle_prompt(prompt_id, enabled)

    def export_prompts(self):
        if not self._window: return {"error": "Window not available"}
        try:
            import webview
            desktop = os.path.join(os.path.expanduser("~"), "Desktop")
            filename = "all_prompts.kruder1"
                
            result = self._window.create_file_dialog(
                webview.FileDialog.SAVE, 
                directory=desktop, 
                save_filename=filename,
                file_types=('Kruder1 Files (*.kruder1)', 'All Files (*.*)')
            )
            if result and len(result) > 0:
                return self._promptlab.export_prompts(result[0])
            return {"ok": False, "cancelled": True}
        except Exception as e:
            return {"error": str(e)}

    def import_prompts(self):
        if not self._window: return {"error": "Window not available"}
        try:
            import webview
            desktop = os.path.join(os.path.expanduser("~"), "Desktop")
            result = self._window.create_file_dialog(
                webview.FileDialog.OPEN, 
                directory=desktop, 
                file_types=('Kruder1 Files (*.kruder1)', 'All Files (*.*)')
            )
            if result and len(result) > 0:
                return self._promptlab.import_prompts(result[0])
            return {"ok": False, "cancelled": True}
        except Exception as e:
            return {"error": str(e)}

    def update_prompts(self, token):
        return self._promptlab.update_prompts(token)

    # =========================================================================
    # FRAMES MODULE - Delegation
    # =========================================================================

    def get_frames(self):
        return self._frames.get_frames()

    def delete_frame(self, frame_id):
        return self._frames.delete_frame(frame_id)

    def toggle_frame(self, frame_id, enabled):
        return self._frames.toggle_frame(frame_id, enabled)

    def add_frame(self):
        if not self._window: return {"error": "Window not available"}
        try:
            import webview
            desktop = os.path.join(os.path.expanduser("~"), "Desktop")
            result = self._window.create_file_dialog(
                webview.FileDialog.OPEN,
                directory=desktop,
                file_types=('PNG Images (*.png)', 'All Files (*.*)')
            )
            if result and len(result) > 0:
                return self._frames.add_frame(result[0])
            return {"ok": False, "cancelled": True}
        except Exception as e:
            return {"error": str(e)}

    # =========================================================================
    # SETTINGS MODULE - Delegation
    # =========================================================================

    def get_settings(self):
        return self._settings.get_settings()

    def get_setting(self, key):
        return self._settings.get_setting(key)

    def update_setting(self, key, value):
        return self._settings.update_setting(key, value)

    def update_settings(self, updates):
        return self._settings.update_settings(updates)

    def reset_settings(self):
        return self._settings.reset_settings()

    def get_theme(self):
        return self._settings.get_theme()

    def set_theme(self, theme):
        return self._settings.set_theme(theme)

    def get_sound_settings(self):
        return self._settings.get_sound_settings()

    def update_sound_settings(self, sound_settings):
        return self._settings.update_sound_settings(sound_settings)

    def get_camera_settings(self):
        return self._settings.get_camera_settings()

    def update_camera_settings(self, camera_settings):
        return self._settings.update_camera_settings(camera_settings)

    def get_printing_settings(self):
        return self._settings.get_printing_settings()

    def update_printing_settings(self, printing_settings):
        return self._settings.update_printing_settings(printing_settings)

    def get_lock_screen_text(self):
        return self._settings.get_lock_screen_text()

    def update_lock_screen_text(self, text):
        return self._settings.update_lock_screen_text(text)

    def get_locales(self):
        return self._settings.get_locales()

    def get_printers(self):
        return self._settings.get_printers()

    def open_printer_settings(self, printer_name):
        return self._settings.open_printer_settings(printer_name)

    def test_print(self, printer_name):
        return self._settings.test_print(printer_name)

    def get_statistics(self, event_id=None):
        return self._settings.get_statistics(event_id)

    def get_promptlab_stats(self):
        return self._promptlab.get_promptlab_stats()

    def get_event_emails(self, event_id=None):
        return self._settings.get_event_emails(event_id)

    # =========================================================================
    # SOFTWARE UPDATE - Delegation
    # =========================================================================

    def check_for_update(self):
        sess = DataService.load_json(SESSION_FILE)
        token = (sess or {}).get("token", "")
        return self._settings.check_for_update(token)

    def download_update(self, url, expected_hash=""):
        return self._settings.download_update(url, expected_hash)

    def get_download_progress(self):
        return self._settings.get_download_progress()

    def install_update(self, path):
        return self._settings.install_update(path)

    def get_pending_update(self):
        return self._settings.get_pending_update()

    def save_emails_to_desktop(self, event_name, emails):
        """Save email list as .txt to Desktop. Returns True if saved."""
        if not isinstance(emails, (list, tuple)):
            emails = []
        safe_name = re.sub(r'[<>:"/\\|?*]', '_', str(event_name or "event").strip())[:80]
        if not safe_name:
            safe_name = "event"
        default_filename = f"email_list_{safe_name}.txt"
        desktop = os.path.join(
            os.environ.get("USERPROFILE", os.path.expanduser("~")), "Desktop"
        )
        if not os.path.isdir(desktop):
            desktop = os.path.expanduser("~")
        try:
            path = os.path.join(desktop, default_filename)
            content = "\n".join(str(e).strip() for e in emails if e)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return True
        except Exception as e:
            append_log("ERROR", "save_emails_error", {"error": str(e)[:200]})
        return False