# =============================================================================
# KRUDER 1 - EVENTMODE MODULE
# Handles capture and photo generation flow during events
# =============================================================================

import os
import uuid
import time
import threading
from datetime import datetime
import requests

from utils import PORT, EVENTS_DIR, NetworkService, DataService, update_session_credits, friendly_error, decode_and_resize_image
from modules.settings import SETTINGS_FILE
from log_service import append_log


def _email_lang():
    """Return language for email: only 'en' or 'es' (worker supports these two)."""
    data = DataService.load_json(SETTINGS_FILE, None) or {}
    lang = (data.get("language") or "en").strip().lower()
    return "es" if lang == "es" else "en"


class EventModeModule:
    """Event photo generation module."""

    def __init__(self):
        self._active_generations = {}

    def start_event_generation(self, token: str, event_id: str, input_b64: str, 
                                style_id: str, prompt_text: str) -> dict:
        """Start photo generation in background."""
        gen_id = str(uuid.uuid4())

        # Setup directories
        event_dir = os.path.join(EVENTS_DIR, event_id)
        images_dir = os.path.join(event_dir, "images")
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)

        # Init JSON
        gen_data = {
            "id": gen_id,
            "eventId": event_id,
            "timestamp": datetime.now().isoformat(),
            "status": "processing",
            "prompt": prompt_text,
            "styleId": style_id,
            "inputImage": None,
            "email": None,
            "sendEmailOnComplete": False
        }
        json_path = os.path.join(images_dir, f"{gen_id}.json")
        DataService.save_json(json_path, gen_data)

        # Start Thread
        thread = threading.Thread(
            target=self._run_generation_thread,
            args=(token, event_id, gen_id, input_b64, prompt_text, json_path)
        )
        thread.daemon = True
        thread.start()

        append_log("INFO", "start_event_generation", {"event_id": event_id, "gen_id": gen_id})
        return {"ok": True, "genId": gen_id}

    def _run_generation_thread(self, token: str, event_id: str, gen_id: str,
                                input_b64: str, prompt_text: str, json_path: str):
        """Worker thread for image generation."""
        import qrcode
        from PIL import Image
        start_time = time.time()
        try:
            payload = {
                "userPhotoBase64": input_b64,
                "promptText": prompt_text,
                "userEmail": None,
                "lang": _email_lang()
            }

            resp = NetworkService.generate_event_photo(token, payload)
            current_data = DataService.load_json(json_path)

            if resp.status_code == 200:
                res_data = resp.json()
                if res_data.get("ok"):
                    image_base64 = res_data.get("imageBase64")
                    page_url = res_data.get("photoPageUrl")
                    # Client uploads final JPG to results/{worker_id}.jpg; QR and email point to /photo/{worker_id}
                    fn = res_data.get("filename") or ""
                    worker_generation_id = (fn.replace(".jpg", "").replace(".png", "").strip() if fn else page_url.rstrip("/").split("/")[-1])

                    # Decode image → RGB → resize
                    result_filename = f"{gen_id}.jpg"
                    result_path = os.path.join(os.path.dirname(json_path), result_filename)
                    img = decode_and_resize_image(image_base64)

                    # --- FRAME COMPOSITION ---
                    active_frame = self._get_active_frame_path()
                    if active_frame:
                        frame_img = Image.open(active_frame).convert("RGBA")
                        frame_img = frame_img.resize(img.size, Image.Resampling.LANCZOS)
                        img = img.convert("RGBA")
                        img = Image.alpha_composite(img, frame_img)
                        img = img.convert("RGB")
                        frame_img.close()
                    # --- END FRAME ---

                    img.save(result_path, "JPEG", quality=100)
                    img.close()

                    # Upload final JPG to R2 (with or without frame) so QR and email serve the same image.
                    upload_ok = False
                    for attempt in range(3):
                        try:
                            r = NetworkService.upload_framed_result(token, worker_generation_id, result_path)
                            if r is not None and getattr(r, "status_code", None) == 200:
                                upload_ok = True
                                break
                        except Exception:
                            pass
                        if attempt < 2:
                            time.sleep(2)
                    if not upload_ok:
                        append_log("ERROR", "event_generation_upload_failed", {"event_id": event_id, "gen_id": gen_id})
                        current_data["status"] = "failed"
                        current_data["error"] = "Could not upload photo. Please try again."
                        DataService.save_json(json_path, current_data)
                        self._update_event_stats(event_id, gen_id, current_data, success=False)
                        return

                    # Generate QR
                    qr_filename = f"{gen_id}_qr.png"
                    qr_path = os.path.join(os.path.dirname(json_path), qr_filename)
                    qr = qrcode.make(page_url)
                    qr.save(qr_path)

                    # RELOAD JSON TO PREVENT OVERWRITING USER EMAIL
                    fresh_data = DataService.load_json(json_path)
                    if fresh_data:
                        current_data["email"] = fresh_data.get("email")
                        current_data["sendEmailOnComplete"] = fresh_data.get("sendEmailOnComplete")

                    # Update Gen JSON
                    current_data["status"] = "completed"
                    current_data["resultImage"] = result_filename
                    current_data["qrImage"] = qr_filename
                    current_data["photoPageUrl"] = page_url
                    current_data["creditsRemaining"] = res_data.get("creditsRemaining")
                    current_data["generationDurationSeconds"] = round(time.time() - start_time, 1)
                    DataService.save_json(json_path, current_data)

                    # Update session credits
                    update_session_credits(current_data["creditsRemaining"])

                    # Update Event Stats
                    self._update_event_stats(event_id, gen_id, current_data, success=True)

                    append_log("INFO", "event_generation_completed", {"event_id": event_id, "gen_id": gen_id, "duration_sec": round(time.time() - start_time, 1)})

                    # Send pending email
                    if current_data.get("email") and current_data.get("sendEmailOnComplete"):
                        email_payload = {
                            "email": current_data["email"],
                            "photoPageUrl": page_url,
                            "lang": _email_lang()
                        }
                        NetworkService.send_email(token, email_payload)

                    return

            # FAILURE
            error_msg = resp.text
            try:
                error_msg = resp.json().get("error", resp.text)
            except (ValueError, AttributeError):
                pass

            append_log("ERROR", "event_generation_failed", {"event_id": event_id, "gen_id": gen_id, "error": str(error_msg)[:200]})
            current_data["status"] = "failed"
            current_data["error"] = friendly_error(error_msg)
            DataService.save_json(json_path, current_data)

            # Update Event Stats
            self._update_event_stats(event_id, gen_id, current_data, success=False)

        except Exception as e:
            append_log("ERROR", "event_generation_exception", {"event_id": event_id, "gen_id": gen_id, "error": str(e)[:200]})
            try:
                current_data = DataService.load_json(json_path)
                current_data["status"] = "failed"
                current_data["error"] = friendly_error(str(e))
                DataService.save_json(json_path, current_data)
            except Exception:
                pass

    def _get_active_frame_path(self):
        """Get active frame path from FramesModule (cached instance)."""
        try:
            if not hasattr(self, '_frames_module'):
                from modules.frames import FramesModule
                self._frames_module = FramesModule()
            return self._frames_module.get_active_frame_path()
        except Exception:
            return None

    def _update_event_stats(self, event_id: str, gen_id: str, gen_data: dict, success: bool):
        """Update event statistics."""
        event_json_path = os.path.join(EVENTS_DIR, event_id, "event.json")
        event_data = DataService.load_json(event_json_path)
        
        if event_data:
            if "stats" not in event_data:
                event_data["stats"] = {"total": 0, "success": 0, "failed": 0}
            if "images" not in event_data:
                event_data["images"] = []

            event_data["stats"]["total"] += 1
            
            if success:
                event_data["stats"]["success"] += 1
                event_data["images"].insert(0, {
                    "id": gen_id,
                    "timestamp": gen_data["timestamp"],
                    "image": gen_data.get("resultImage")
                })
            else:
                event_data["stats"]["failed"] += 1

            DataService.save_json(event_json_path, event_data)

    def check_generation_status(self, event_id: str, gen_id: str) -> dict:
        """Poll generation status."""
        path = os.path.join(EVENTS_DIR, event_id, "images", f"{gen_id}.json")
        data = DataService.load_json(path)
        
        if not data:
            return {"status": "not_found"}

        if data.get("resultImage"):
            data["localUrl"] = f"http://127.0.0.1:{PORT}/event-data/{event_id}/images/{data['resultImage']}"
            data["qrUrl"] = f"http://127.0.0.1:{PORT}/event-data/{event_id}/images/{data['qrImage']}"

        return data

    def finalize_event_generation(self, token: str, event_id: str,
                                   gen_id: str, email: str) -> dict:
        """Send email with the photo (or queue if still processing)."""
        path = os.path.join(EVENTS_DIR, event_id, "images", f"{gen_id}.json")
        data = DataService.load_json(path)
        
        if not data:
            return {"error": "Not found"}

        data["email"] = email
        DataService.save_json(path, data)

        if data["status"] == "completed":
            payload = {
                "email": email,
                "imageUrl": None,
                "photoPageUrl": data.get("photoPageUrl"),
                "lang": _email_lang()
            }
            if not payload["photoPageUrl"]:
                return {"error": "Missing public URL"}

            threading.Thread(target=NetworkService.send_email, args=(token, payload)).start()
            return {"ok": True, "sent": True}

        else:
            data["sendEmailOnComplete"] = True
            DataService.save_json(path, data)
            return {"ok": True, "queued": True}
