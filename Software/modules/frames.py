# =============================================================================
# KRUDER 1 - FRAMES MODULE
# Handles frame overlays (CRUD, exclusive toggle, active frame path)
# =============================================================================

import os
import uuid
import shutil
from datetime import datetime

from PIL import Image

from utils import FRAMES_DIR, FRAMES_IMAGES_DIR, FRAMES_JSON, DataService, send_to_recycle_bin

TARGET_WIDTH = 848
TARGET_HEIGHT = 1264


class FramesModule:
    """Manage PNG frame overlays for event photos."""

    def get_frames(self) -> list:
        """Get all frames."""
        db = DataService.load_json(FRAMES_JSON, {"frames": []})
        return db.get("frames", [])

    def add_frame(self, src_path: str) -> dict:
        """Add a new frame from a PNG file. Validates transparency and 2:3 aspect ratio."""
        try:
            if not src_path.lower().endswith(".png"):
                return {"error": "ONLY PNG FILES ARE ALLOWED"}

            # Validate image
            img = Image.open(src_path)
            w, h = img.size

            # Must have alpha channel (RGBA or PA)
            if img.mode not in ("RGBA", "LA", "PA") and "transparency" not in img.info:
                img.close()
                return {"error": "INVALID_FORMAT"}

            # Convert to RGBA if needed
            if img.mode != "RGBA":
                img = img.convert("RGBA")

            # Check aspect ratio is ~2:3 (tolerance 1% for non-exact sizes like 848x1264)
            ratio = w / h
            if abs(ratio - 2 / 3) > 0.01:
                img.close()
                return {"error": "INVALID_RATIO"}

            # Resize to target if different
            if w != TARGET_WIDTH or h != TARGET_HEIGHT:
                img = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)

            # Save to destination
            filename = f"{uuid.uuid4().hex}.png"
            dest_path = os.path.join(FRAMES_IMAGES_DIR, filename)
            img.save(dest_path, "PNG")
            img.close()

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
