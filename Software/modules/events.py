# =============================================================================
# KRUDER 1 - EVENTS MODULE
# Handles CRUD for events (create, list, rename, delete)
# =============================================================================

import os
import uuid
import shutil
import zipfile
from datetime import datetime

from utils import EVENTS_DIR, DataService, send_to_recycle_bin
from log_service import append_log


class EventsModule:
    """Event management module."""

    def get_events(self) -> list:
        """List all events with their images."""
        evs = []
        if os.path.exists(EVENTS_DIR):
            for d in os.listdir(EVENTS_DIR):
                event_path = os.path.join(EVENTS_DIR, d, "event.json")
                event_data = DataService.load_json(event_path)
                if event_data:
                    # Enrich images with email
                    if "images" in event_data:
                        for img_obj in event_data["images"]:
                            gen_id = img_obj.get("id")
                            gen_json_path = os.path.join(EVENTS_DIR, d, "images", f"{gen_id}.json")
                            gen_data = DataService.load_json(gen_json_path)
                            if gen_data:
                                img_obj["email"] = gen_data.get("email", "NO EMAIL")
                                img_obj["qrImage"] = gen_data.get("qrImage")
                        event_data["images"].sort(
                            key=lambda x: x.get("timestamp", ""),
                            reverse=True
                        )
                    evs.append(event_data)
        
        evs.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        return evs

    def create_event(self, name: str) -> dict:
        """Create a new event."""
        try:
            eid = str(uuid.uuid4())
            edir = os.path.join(EVENTS_DIR, eid)
            os.makedirs(os.path.join(edir, "images"))
            
            data = {
                "id": eid,
                "name": name,
                "createdAt": datetime.now().isoformat(),
                "stats": {"total": 0, "success": 0, "failed": 0},
                "images": []
            }
            DataService.save_json(os.path.join(edir, "event.json"), data)
            append_log("INFO", "create_event", {"event_id": eid, "name": name[:80]})
            return data
        except Exception as e:
            append_log("ERROR", "create_event", {"error": str(e)[:200]})
            return {"error": str(e)}

    def rename_event(self, eid: str, new_name: str) -> dict:
        """Rename an event."""
        path = os.path.join(EVENTS_DIR, eid, "event.json")
        data = DataService.load_json(path)
        if data:
            data["name"] = new_name
            DataService.save_json(path, data)
            append_log("INFO", "rename_event", {"event_id": eid, "name": new_name[:80]})
            return {"ok": True, "name": new_name}
        append_log("WARNING", "rename_event", {"event_id": eid, "error": "Event not found"})
        return {"error": "Event not found"}

    def delete_event(self, eid: str) -> dict:
        """Delete an event (send to Windows Recycle Bin)."""
        try:
            src = os.path.abspath(os.path.join(EVENTS_DIR, eid))
            if not os.path.exists(src):
                return {"error": "Event not found"}
            if send_to_recycle_bin(src):
                append_log("INFO", "delete_event", {"event_id": eid})
                return {"ok": True}
            append_log("ERROR", "delete_event", {"event_id": eid, "error": "SHFileOperation failed"})
            return {"error": "SHFileOperation failed"}
        except Exception as e:
            append_log("ERROR", "delete_event", {"event_id": eid, "error": str(e)[:200]})
            return {"error": str(e)}

    def delete_event_image(self, event_id: str, image_id: str) -> dict:
        """Delete an event image (send to Windows Recycle Bin)."""
        try:
            event_path = os.path.join(EVENTS_DIR, event_id, "event.json")
            event_data = DataService.load_json(event_path)
            if not event_data:
                return {"error": "Event not found"}

            gen_json_path = os.path.join(EVENTS_DIR, event_id, "images", f"{image_id}.json")
            gen_data = DataService.load_json(gen_json_path)
            
            original_len = len(event_data.get("images", []))
            event_data["images"] = [img for img in event_data.get("images", []) if img.get("id") != image_id]
            
            if len(event_data["images"]) < original_len:
                # Stats counters are historical — deleting an image does not undo the generation
                DataService.save_json(event_path, event_data)

            files_to_delete = []
            if os.path.exists(gen_json_path):
                files_to_delete.append(os.path.abspath(gen_json_path))
            
            if gen_data:
                res_img = gen_data.get("resultImage")
                qr_img = gen_data.get("qrImage")
                if res_img:
                    p = os.path.abspath(os.path.join(EVENTS_DIR, event_id, "images", res_img))
                    if os.path.exists(p): files_to_delete.append(p)
                if qr_img:
                    p = os.path.abspath(os.path.join(EVENTS_DIR, event_id, "images", qr_img))
                    if os.path.exists(p): files_to_delete.append(p)

            if files_to_delete:
                send_to_recycle_bin(files_to_delete)
            append_log("INFO", "delete_event_image", {"event_id": event_id, "image_id": image_id})
            return {"ok": True}
        except Exception as e:
            append_log("ERROR", "delete_event_image", {"event_id": event_id, "image_id": image_id, "error": str(e)[:200]})
            return {"error": str(e)}

    def export_gallery(self, event_id: str, dest_path: str, export_type: str) -> dict:
        try:
            event_path = os.path.join(EVENTS_DIR, event_id, "event.json")
            event_data = DataService.load_json(event_path)
            if not event_data or "images" not in event_data:
                return {"error": "No event data or images found"}

            images_dir = os.path.join(EVENTS_DIR, event_id, "images")
            valid_images = [img.get("image") for img in event_data["images"] if img.get("image")]

            if not valid_images:
                return {"error": "No valid images to export"}

            if export_type == "zip":
                with zipfile.ZipFile(dest_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for img_file in valid_images:
                        src_path = os.path.join(images_dir, img_file)
                        if os.path.exists(src_path):
                            zipf.write(src_path, img_file)
            else:
                for img_file in valid_images:
                    src_path = os.path.join(images_dir, img_file)
                    if os.path.exists(src_path):
                        shutil.copy2(src_path, os.path.join(dest_path, img_file))
            append_log("INFO", "export_gallery", {"event_id": event_id, "export_type": export_type})
            return {"ok": True}
        except Exception as e:
            append_log("ERROR", "export_gallery", {"event_id": event_id, "error": str(e)[:200]})
            return {"error": str(e)}
