# =============================================================================
# KRUDER 1 - PROMPTLAB MODULE
# Handles prompt library (CRUD, generation, toggles)
# =============================================================================

import os
import uuid
import json
import time
from datetime import datetime

import requests

from utils import PORT, APP_DATA, IMAGES_DIR, JSON_FILE, NetworkService, DataService, send_to_recycle_bin, update_session_credits, friendly_error, process_and_save_image, decode_and_resize_image
from config import GEN_WORKER_BASE
from log_service import append_log

PROMPTLAB_STATS_FILE = os.path.join(APP_DATA, "promptlab_stats.json")


class PromptLabModule:
    """Prompt library management module."""

    def get_prompt_library(self) -> list:
        """Get prompt library grouped by category."""
        db = DataService.load_json(JSON_FILE, {"categories": [], "prompts": []})
        library = []
        cats = db.get("categories", [])
        prompts = db.get("prompts", [])
        active_cats = []

        for cat in cats:
            cps = [p for p in prompts if p.get("categoryId") == cat["id"]]
            if cps:
                active_cats.append(cat)
                library.append({
                    "id": cat["id"],
                    "name": cat["name"],
                    "enabled": cat.get("enabled", True),
                    "images": [p["image"] for p in cps][:4]
                })

        # Cleanup empty categories
        if len(active_cats) < len(cats):
            db["categories"] = active_cats
            DataService.save_json(JSON_FILE, db)

        return library

    def get_categories(self) -> list:
        """List all categories."""
        return DataService.load_json(JSON_FILE, {}).get("categories", [])

    def get_prompts_by_category(self, cat_id: str) -> list:
        """Get prompts for a category."""
        prompts = DataService.load_json(JSON_FILE, {}).get("prompts", [])
        filtered = [p for p in prompts if p.get("categoryId") == cat_id]
        return filtered

    def get_prompt_details(self, prompt_id: str) -> dict:
        """Get details for a specific prompt."""
        prompts = DataService.load_json(JSON_FILE, {}).get("prompts", [])
        return next((p for p in prompts if p["id"] == prompt_id), None)

    def _update_promptlab_stats(self, success: bool, duration_seconds=None):
        """Increment persistent prompt lab statistics."""
        stats = DataService.load_json(PROMPTLAB_STATS_FILE, {
            "total": 0, "success": 0, "failed": 0, "durations": []
        })
        stats["total"] = stats.get("total", 0) + 1
        if success:
            stats["success"] = stats.get("success", 0) + 1
            if duration_seconds is not None:
                if "durations" not in stats:
                    stats["durations"] = []
                stats["durations"].append(round(duration_seconds, 1))
        else:
            stats["failed"] = stats.get("failed", 0) + 1
        DataService.save_json(PROMPTLAB_STATS_FILE, stats)

    def get_promptlab_stats(self) -> dict:
        """Return prompt lab generation statistics."""
        stats = DataService.load_json(PROMPTLAB_STATS_FILE, {
            "total": 0, "success": 0, "failed": 0, "durations": []
        })
        total = stats.get("total", 0)
        success = stats.get("success", 0)
        failed = stats.get("failed", 0)
        durations = stats.get("durations", [])
        rate = round((success / total * 100), 1) if total > 0 else 0
        avg = round(sum(durations) / len(durations), 1) if durations else None
        return {
            "total": total,
            "success": success,
            "failed": failed,
            "successRate": rate,
            "avgTimeSeconds": avg,
        }

    def generate_and_save_prompt(self, token: str, ref_base64: str, prompt_name: str,
                                  category_name: str, category_id_or_new: str,
                                  prompt_desc: str) -> dict:
        """Generate a prompt with AI and save it."""
        start_time = time.time()
        try:
            payload = {"referenceImageBase64": ref_base64, "promptText": prompt_desc}
            resp = NetworkService.generate_image(token, payload)

            if resp.status_code != 200:
                self._update_promptlab_stats(success=False)
                append_log("ERROR", "promptlab_generate", {"ok": False, "error": str(resp.text)[:200]})
                return {"error": friendly_error(resp.text)}

            data = resp.json()
            if not data.get("ok"):
                self._update_promptlab_stats(success=False)
                append_log("WARNING", "promptlab_generate", {"ok": False, "error": str(data.get("error", "Unknown"))[:200]})
                return {"error": friendly_error(data.get("error", "Unknown error"))}

            duration = time.time() - start_time

            # Decode & process image
            filename = f"{uuid.uuid4().hex}.jpg"
            final_path = os.path.join(IMAGES_DIR, filename)
            process_and_save_image(data.get("imageBase64"), final_path)

            # Update session credits
            credits_rem = data.get("creditsRemaining")
            update_session_credits(credits_rem)

            # Update prompt lab stats
            self._update_promptlab_stats(success=True, duration_seconds=duration)

            # Save to DB
            db = DataService.load_json(JSON_FILE, {"categories": [], "prompts": []})
            ts = datetime.now().isoformat()

            if category_id_or_new == "create_new":
                cat_id = str(uuid.uuid4())
                db["categories"].append({
                    "id": cat_id,
                    "name": category_name.upper(),
                    "createdAt": ts
                })
            else:
                cat_id = category_id_or_new

            db["prompts"].append({
                "id": str(uuid.uuid4()),
                "categoryId": cat_id,
                "name": prompt_name,
                "text": prompt_desc,
                "image": filename,
                "createdAt": ts
            })
            DataService.save_json(JSON_FILE, db)

            append_log("INFO", "promptlab_generate", {"ok": True, "credits": credits_rem, "duration_sec": round(time.time() - start_time, 1)})
            return {
                "ok": True,
                "localUrl": f"http://127.0.0.1:{PORT}/local-data/images/{filename}",
                "credits": credits_rem
            }
        except Exception as e:
            self._update_promptlab_stats(success=False)
            append_log("ERROR", "promptlab_generate", {"ok": False, "error": str(e)[:200]})
            return {"error": str(e)}

    def save_manual_prompt(self, img_base64: str, name: str, cat_id_or_new: str,
                           new_cat_name: str, text: str) -> dict:
        """Save a prompt with manual image (no AI)."""
        try:
            db = DataService.load_json(JSON_FILE, {"categories": [], "prompts": []})
            ts = datetime.now().isoformat()

            # Handle Category
            if cat_id_or_new == "create_new":
                cat_id = str(uuid.uuid4())
                db["categories"].append({
                    "id": cat_id,
                    "name": new_cat_name.upper(),
                    "createdAt": ts
                })
            else:
                cat_id = cat_id_or_new

            # Process Image
            filename = f"{uuid.uuid4().hex}.jpg"
            final_path = os.path.join(IMAGES_DIR, filename)
            process_and_save_image(img_base64, final_path)

            # Save to DB
            db["prompts"].append({
                "id": str(uuid.uuid4()),
                "categoryId": cat_id,
                "name": name,
                "text": text,
                "image": filename,
                "createdAt": ts
            })
            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def update_prompt(self, prompt_id: str, name: str, category_id_or_new: str,
                      new_cat_name: str, text: str, new_img_base64: str = None) -> dict:
        """Update an existing prompt."""
        try:
            db = DataService.load_json(JSON_FILE)
            prompt = next((p for p in db.get("prompts", []) if p["id"] == prompt_id), None)
            if not prompt:
                return {"error": "Prompt not found"}

            old_cat_id = prompt.get("categoryId")

            if category_id_or_new == "create_new":
                cat_id = str(uuid.uuid4())
                db["categories"].append({
                    "id": cat_id,
                    "name": new_cat_name.upper(),
                    "createdAt": datetime.now().isoformat()
                })
            else:
                cat_id = category_id_or_new

            # Update image if provided
            if new_img_base64:
                try:
                    os.remove(os.path.join(IMAGES_DIR, prompt["image"]))
                except Exception:
                    pass

                fname = f"{uuid.uuid4().hex}.jpg"
                process_and_save_image(new_img_base64, os.path.join(IMAGES_DIR, fname))
                prompt["image"] = fname

            prompt.update({"name": name, "categoryId": cat_id, "text": text})

            # Cleanup old category if empty
            if old_cat_id and old_cat_id != cat_id:
                if not any(p for p in db["prompts"] if p.get("categoryId") == old_cat_id):
                    db["categories"] = [c for c in db["categories"] if c["id"] != old_cat_id]

            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def rename_category(self, cat_id: str, new_name: str) -> dict:
        """Rename an existing category."""
        try:
            new_name = (new_name or "").strip()
            if not new_name:
                return {"error": "Name cannot be empty"}
            db = DataService.load_json(JSON_FILE)
            cat = next((c for c in db.get("categories", []) if c["id"] == cat_id), None)
            if not cat:
                return {"error": "Category not found"}
            cat["name"] = new_name
            DataService.save_json(JSON_FILE, db)
            return {"ok": True, "name": new_name}
        except Exception as e:
            return {"error": str(e)}

    def delete_category(self, cat_id: str) -> dict:
        try:
            db = DataService.load_json(JSON_FILE)
            cat = next((c for c in db.get("categories", []) if c["id"] == cat_id), None)
            if not cat:
                return {"error": "Category not found"}
                
            prompts_to_delete = [p for p in db.get("prompts", []) if p.get("categoryId") == cat_id]
            files_to_delete = []
            
            for p in prompts_to_delete:
                if p.get("image"):
                    img_path = os.path.abspath(os.path.join(IMAGES_DIR, p["image"]))
                    if os.path.exists(img_path):
                        files_to_delete.append(img_path)
                        
            db["prompts"] = [p for p in db["prompts"] if p.get("categoryId") != cat_id]
            db["categories"] = [c for c in db["categories"] if c["id"] != cat_id]
            
            DataService.save_json(JSON_FILE, db)
            
            if files_to_delete:
                send_to_recycle_bin(files_to_delete)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def reorder_categories(self, category_ids: list) -> dict:
        try:
            db = DataService.load_json(JSON_FILE)
            cat_dict = {c["id"]: c for c in db.get("categories", [])}
            new_cats = []
            for cid in category_ids:
                if cid in cat_dict:
                    new_cats.append(cat_dict.pop(cid))
            new_cats.extend(cat_dict.values())
            db["categories"] = new_cats
            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def move_prompt_to_category(self, prompt_id: str, category_id: str) -> dict:
        """Move a prompt to another category."""
        try:
            db = DataService.load_json(JSON_FILE)
            prompt = next((p for p in db.get("prompts", []) if p["id"] == prompt_id), None)
            if not prompt:
                return {"error": "Prompt not found"}
            cat = next((c for c in db.get("categories", []) if c["id"] == category_id), None)
            if not cat:
                return {"error": "Category not found"}

            old_cat_id = prompt.get("categoryId")
            prompt["categoryId"] = category_id

            if old_cat_id and old_cat_id != category_id:
                if not any(p for p in db["prompts"] if p.get("categoryId") == old_cat_id):
                    db["categories"] = [c for c in db["categories"] if c["id"] != old_cat_id]

            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def create_category_and_move_prompt(self, category_name: str, prompt_id: str) -> dict:
        """Create a new category and move a prompt into it."""
        try:
            db = DataService.load_json(JSON_FILE)
            prompt = next((p for p in db.get("prompts", []) if p["id"] == prompt_id), None)
            if not prompt:
                return {"error": "Prompt not found"}

            old_cat_id = prompt.get("categoryId")
            ts = datetime.now().isoformat()
            new_cat_id = str(uuid.uuid4())
            db["categories"].append({
                "id": new_cat_id,
                "name": category_name.upper(),
                "createdAt": ts
            })
            prompt["categoryId"] = new_cat_id

            if old_cat_id and old_cat_id != new_cat_id:
                if not any(p for p in db["prompts"] if p.get("categoryId") == old_cat_id and p["id"] != prompt_id):
                    db["categories"] = [c for c in db["categories"] if c["id"] != old_cat_id]

            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def reorder_prompts(self, prompt_ids: list) -> dict:
        try:
            db = DataService.load_json(JSON_FILE)
            prompts = db.get("prompts", [])
            prompt_dict = {p["id"]: p for p in prompts}
            new_prompts = []
            for pid in prompt_ids:
                if pid in prompt_dict:
                    new_prompts.append(prompt_dict.pop(pid))
            new_prompts.extend(prompt_dict.values())
            db["prompts"] = new_prompts
            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def delete_prompt(self, prompt_id: str) -> dict:
        """Delete a prompt."""
        try:
            db = DataService.load_json(JSON_FILE)
            prompt = next((p for p in db.get("prompts", []) if p["id"] == prompt_id), None)
            if not prompt:
                return {"error": "Prompt not found"}

            cat_id = prompt.get("categoryId")
            try:
                os.remove(os.path.join(IMAGES_DIR, prompt["image"]))
            except OSError:
                pass

            db["prompts"] = [p for p in db["prompts"] if p["id"] != prompt_id]

            # Cleanup category if empty
            if cat_id:
                if not any(p for p in db["prompts"] if p.get("categoryId") == cat_id):
                    db["categories"] = [c for c in db["categories"] if c["id"] != cat_id]

            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def toggle_category(self, cat_id: str, enabled: bool) -> dict:
        """Enable/disable a category."""
        return self._toggle_entity("categories", cat_id, enabled)

    def toggle_prompt(self, prompt_id: str, enabled: bool) -> dict:
        """Enable/disable a prompt."""
        return self._toggle_entity("prompts", prompt_id, enabled)

    def _toggle_entity(self, collection: str, eid: str, state: bool) -> dict:
        """Helper for toggling entities."""
        db = DataService.load_json(JSON_FILE)
        item = next((i for i in db.get(collection, []) if i["id"] == eid), None)
        if item:
            item["enabled"] = state
            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        return {"error": "Item not found"}

    def export_prompts(self, dest_path: str) -> dict:
        import zipfile
        try:
            db = DataService.load_json(JSON_FILE, {"categories": [], "prompts": []})
            export_data = {"categories": [], "prompts": []}
            images_to_export = set()

            export_data["categories"] = db.get("categories", [])
            export_data["prompts"] = db.get("prompts", [])
            for p in export_data["prompts"]:
                if p.get("image"): images_to_export.add(p["image"])

            with zipfile.ZipFile(dest_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                zipf.writestr("data.json", json.dumps(export_data))
                for img in images_to_export:
                    img_path = os.path.join(IMAGES_DIR, img)
                    if os.path.exists(img_path):
                        zipf.write(img_path, f"images/{img}")
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def import_prompts(self, src_path: str) -> dict:
        import zipfile
        import shutil
        try:
            with zipfile.ZipFile(src_path, 'r') as zipf:
                if "data.json" not in zipf.namelist():
                    return {"error": "Invalid .kruder1 file"}
                
                import_data = json.loads(zipf.read("data.json").decode("utf-8"))
                db = DataService.load_json(JSON_FILE, {"categories": [], "prompts": []})
                
                existing_cats_by_name = {c["name"].upper(): c["id"] for c in db.get("categories", [])}
                existing_prompts_by_cat_and_name = {(p["categoryId"], p["name"].upper()): p["id"] for p in db.get("prompts", [])}
                
                id_map = {}
                
                for cat in import_data.get("categories", []):
                    cat_name_upper = cat["name"].upper()
                    if cat_name_upper in existing_cats_by_name:
                        id_map[cat["id"]] = existing_cats_by_name[cat_name_upper]
                    else:
                        new_id = str(uuid.uuid4())
                        id_map[cat["id"]] = new_id
                        cat["id"] = new_id
                        db["categories"].append(cat)
                        existing_cats_by_name[cat_name_upper] = new_id
                        
                for p in import_data.get("prompts", []):
                    old_cat_id = p.get("categoryId")
                    if old_cat_id not in id_map:
                        continue
                        
                    target_cat_id = id_map[old_cat_id]
                    prompt_name_upper = p["name"].upper()
                    
                    if (target_cat_id, prompt_name_upper) not in existing_prompts_by_cat_and_name:
                        p["categoryId"] = target_cat_id
                        p["id"] = str(uuid.uuid4())
                        
                        old_img = p.get("image")
                        if old_img and f"images/{old_img}" in zipf.namelist():
                            ext = old_img.split('.')[-1] if '.' in old_img else 'jpg'
                            new_img = f"{uuid.uuid4().hex}.{ext}"
                            p["image"] = new_img
                            
                            target_img_path = os.path.join(IMAGES_DIR, new_img)
                            with zipf.open(f"images/{old_img}") as source, open(target_img_path, "wb") as target:
                                shutil.copyfileobj(source, target)
                                
                        db["prompts"].append(p)
                        existing_prompts_by_cat_and_name[(target_cat_id, prompt_name_upper)] = p["id"]

            DataService.save_json(JSON_FILE, db)
            return {"ok": True}
        except Exception as e:
            return {"error": str(e)}

    def update_prompts(self, token: str) -> dict:
        """Download prompts from server and merge with local library."""
        import tempfile
        try:
            headers = {"Authorization": f"Bearer {token}"}

            # 1. Download the .kruder1 file
            resp = requests.get(f"{GEN_WORKER_BASE}/download-prompts", headers=headers, timeout=60)
            if resp.status_code != 200:
                append_log("WARNING", "update_prompts_failed", {"status": resp.status_code, "body": resp.text[:300]})
                return {"error": "COULD NOT DOWNLOAD PROMPTS"}

            # 2. Save to temp and import (merge)
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".kruder1")
            try:
                tmp.write(resp.content)
                tmp.close()
                return self.import_prompts(tmp.name)
            finally:
                try:
                    os.unlink(tmp.name)
                except OSError:
                    pass
        except Exception as e:
            return {"error": "UPDATE FAILED, TRY AGAIN"}

