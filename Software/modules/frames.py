# =============================================================================
# KRUDER 1 - FRAMES MODULE
# Handles frame overlays (CRUD, exclusive toggle, active frame path)
# =============================================================================

import os
import uuid
import shutil
from datetime import datetime

from utils import FRAMES_DIR, FRAMES_IMAGES_DIR, FRAMES_JSON, DataService, send_to_recycle_bin


class FramesModule:
    """Manage PNG frame overlays for event photos."""

    def get_frames(self) -> list:
        """Get all frames."""
        db = DataService.load_json(FRAMES_JSON, {"frames": []})
        return db.get("frames", [])

    def add_frame(self, src_path: str) -> dict:
        """Add a new frame from a PNG file."""
        try:
            if not src_path.lower().endswith(".png"):
                return {"error": "ONLY PNG FILES ARE ALLOWED"}

            # Generate unique filename
            filename = f"{uuid.uuid4().hex}.png"
            dest_path = os.path.join(FRAMES_IMAGES_DIR, filename)

            # Copy file
            shutil.copy2(src_path, dest_path)

            # Extract name from original filename
            original_name = os.path.splitext(os.path.basename(src_path))[0].upper()

            # Add to JSON
            frame = {
                "id": str(uuid.uuid4()),
                "name": original_name,
                "filename": filename,
                "enabled": False,
                "createdAt": datetime.now().isoformat()
            }

            db = DataService.load_json(FRAMES_JSON, {"frames": []})
            db["frames"].append(frame)
            DataService.save_json(FRAMES_JSON, db)

            return {"ok": True, "frame": frame}
        except Exception as e:
            return {"error": str(e)}

    def delete_frame(self, frame_id: str) -> dict:
        """Delete a frame and its image file."""
        try:
            db = DataService.load_json(FRAMES_JSON, {"frames": []})
            frame = next((f for f in db["frames"] if f["id"] == frame_id), None)

            if not frame:
                return {"error": "Frame not found"}

            # Remove image file
            img_path = os.path.join(FRAMES_IMAGES_DIR, frame["filename"])
            if os.path.exists(img_path):
                send_to_recycle_bin(img_path)

            # Remove from JSON
            db["frames"] = [f for f in db["frames"] if f["id"] != frame_id]
            DataService.save_json(FRAMES_JSON, db)

            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def toggle_frame(self, frame_id: str, enabled: bool) -> dict:
        """Toggle a frame. Only one frame can be active at a time (exclusive)."""
        try:
            db = DataService.load_json(FRAMES_JSON, {"frames": []})

            if enabled:
                # Deactivate ALL frames first
                for f in db["frames"]:
                    f["enabled"] = False
                # Activate only the selected one
                frame = next((f for f in db["frames"] if f["id"] == frame_id), None)
                if frame:
                    frame["enabled"] = True
            else:
                # Just deactivate this one
                frame = next((f for f in db["frames"] if f["id"] == frame_id), None)
                if frame:
                    frame["enabled"] = False

            DataService.save_json(FRAMES_JSON, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def get_active_frame_path(self) -> str:
        """Get the file path of the active frame, or None if no frame is active."""
        try:
            db = DataService.load_json(FRAMES_JSON, {"frames": []})
            active = next((f for f in db["frames"] if f.get("enabled")), None)
            if not active:
                return None
            path = os.path.join(FRAMES_IMAGES_DIR, active["filename"])
            if os.path.exists(path):
                return path
            return None
        except Exception:
            return None
