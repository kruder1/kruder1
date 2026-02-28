# =============================================================================
# KRUDER 1 - AUTH MODULE
# Handles authentication, session and account data
# =============================================================================

import os
import json
import threading

from utils import SESSION_FILE, NetworkService, DataService
from log_service import append_log


class AuthModule:
    """Authentication and session management module."""

    def login(self, email: str, password: str) -> dict:
        """Authenticate user against server."""
        try:
            status, resp = NetworkService.proxy_api("login", {
                "email": email,
                "password": password
            })

            if status == 200:
                data = json.loads(resp)
                DataService.save_json(SESSION_FILE, data)
                append_log("INFO", "login", {"ok": True})

                # Auto-claim demo credits in background (silent, fire-and-forget)
                token = data.get("token")
                if token:
                    threading.Thread(target=self._try_claim_demo, args=(token,), daemon=True).start()

                return data

            try:
                err = json.loads(resp).get("error", "Login failed")
            except Exception:
                err = "Login failed"
            append_log("WARNING", "login", {"ok": False, "error": str(err)[:200]})
            return {"error": err}

        except Exception as e:
            append_log("ERROR", "login", {"ok": False, "error": str(e)[:200]})
            return {"error": str(e)}

    def _try_claim_demo(self, token: str):
        """Silently attempt to claim demo credits after login."""
        try:
            status, resp = NetworkService.proxy_api(
                "claim-demo", {}, auth=f"Bearer {token}"
            )
            if status == 200:
                data = json.loads(resp)
                # Update local session with new credit count
                session = DataService.load_json(SESSION_FILE)
                if session and "account" in session:
                    session["account"]["credits"] = data.get("credits", session["account"].get("credits", 0))
                    DataService.save_json(SESSION_FILE, session)
                append_log("INFO", "claim_demo", {"ok": True, "credits": data.get("credits")})
            else:
                # Expected failures: already claimed, email not verified — silently ignore
                append_log("DEBUG", "claim_demo_skip", {"status": status})
        except Exception as e:
            append_log("DEBUG", "claim_demo_error", {"error": str(e)[:200]})

    def get_session_data(self) -> dict:
        """Get locally stored session data."""
        return DataService.load_json(SESSION_FILE)

    def clear_session(self) -> dict:
        """Clear local session (logout)."""
        if os.path.exists(SESSION_FILE):
            os.remove(SESSION_FILE)
        append_log("INFO", "clear_session")
        return {"ok": True}

    def refresh_account(self) -> dict:
        """Sync account data with server."""
        try:
            session = DataService.load_json(SESSION_FILE)
            if not session or "token" not in session:
                append_log("WARNING", "refresh_account", {"ok": False, "error": "No token"})
                return {"error": "No token"}

            status, resp = NetworkService.proxy_api(
                "me",
                auth=f"Bearer {session['token']}",
                method="GET"
            )

            if status == 200:
                data = json.loads(resp)
                acc = data.get("account", data)

                if isinstance(acc, dict) and "credits" in acc:
                    session["account"] = acc
                    DataService.save_json(SESSION_FILE, session)
                    append_log("INFO", "refresh_account", {"ok": True, "credits": acc.get("credits")})
                    return {"ok": True, "account": acc}

            append_log("WARNING", "refresh_account", {"ok": False, "error": "Failed to sync with DB"})
            return {"error": "Failed to sync with DB"}
        except Exception as e:
            append_log("ERROR", "refresh_account", {"ok": False, "error": str(e)[:200]})
            return {"error": str(e)}
