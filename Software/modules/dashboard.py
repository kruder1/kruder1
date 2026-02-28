# =============================================================================
# KRUDER 1 - DASHBOARD MODULE
# Handles main dashboard functionality
# =============================================================================

import os

from utils import SESSION_FILE, EVENTS_DIR, JSON_FILE, DataService


class DashboardModule:
    """Main dashboard module."""

    def get_dashboard_data(self) -> dict:
        """Get full dashboard data (session + stats)."""
        try:
            session = DataService.load_json(SESSION_FILE)
            return {
                "ok": True,
                "account": session.get("account") if session else None,
                "stats": self._get_stats()
            }
        except Exception as e:
            return {"error": str(e)}

    def _get_stats(self) -> dict:
        """Aggregate real stats from events and prompts on disk."""
        total_events = 0
        total_photos = 0
        total_prompts = 0

        # Count events and photos
        if os.path.exists(EVENTS_DIR):
            for d in os.listdir(EVENTS_DIR):
                event_path = os.path.join(EVENTS_DIR, d, "event.json")
                event_data = DataService.load_json(event_path)
                if event_data:
                    total_events += 1
                    stats = event_data.get("stats", {})
                    total_photos += stats.get("success", 0)

        # Count prompts
        db = DataService.load_json(JSON_FILE, {})
        total_prompts = len(db.get("prompts", []))

        return {
            "totalEvents": total_events,
            "totalPhotos": total_photos,
            "totalPrompts": total_prompts
        }
