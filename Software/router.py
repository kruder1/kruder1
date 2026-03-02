# =============================================================================
# KRUDER 1 - ROUTER.PY
# HTTP server and route handling
# =============================================================================

import os
import json
import logging
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler

from config import APP_DATA
from utils import (
    PORT, BASE_DIR, EVENTS_DIR, IMAGES_DIR, SESSION_FILE,
    SecurityService, NetworkService, DataService
)

log = logging.getLogger("kruder1")

# =============================================================================
# HTTP ROUTER
# =============================================================================

class KruderRouter(BaseHTTPRequestHandler):
    
    def _set_headers(self, status=200, content_type="application/json"):
        """Set response headers with CORS."""
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self._set_headers()

    def do_POST(self):
        """Handle POST requests (API proxy)."""
        if self.path.startswith("/api/"):
            endpoint = self.path.replace("/api/", "")
            length = int(self.headers.get("Content-Length", 0))
            if length > 50 * 1024 * 1024:  # 50 MB limit
                self.send_error(413, "Payload too large")
                return
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            auth = self.headers.get("Authorization")
            
            status, resp = NetworkService.proxy_api(endpoint, body, auth, "POST")
            
            # Save session on successful responses
            if status == 200:
                try:
                    data = json.loads(resp)
                    if endpoint == "login":
                        DataService.save_json(SESSION_FILE, data)
                    elif endpoint == "claim-demo":
                        current = DataService.load_json(SESSION_FILE, {})
                        if "account" not in current:
                            current["account"] = {}
                        acc = data.get("account", data)
                        if isinstance(acc, dict) and ("credits" in acc or "email" in acc):
                            current["account"].update(acc)
                            DataService.save_json(SESSION_FILE, current)
                except Exception as e:
                    log.debug("Session save after %s: %s", endpoint, e)

            self._set_headers(status)
            self.wfile.write(resp.encode("utf-8"))
        else:
            self.send_error(404)

    def do_GET(self):
        """Handle GET requests (API and static files)."""
        
        # --- API Proxy ---
        if self.path.startswith("/api/"):
            endpoint = self.path.replace("/api/", "")
            auth = self.headers.get("Authorization")
            status, resp = NetworkService.proxy_api(endpoint, None, auth, "GET")

            # Update session with /me data
            if status == 200 and endpoint == "me":
                try:
                    data = json.loads(resp)
                    current = DataService.load_json(SESSION_FILE, {})
                    if "account" not in current:
                        current["account"] = {}
                    acc = data.get("account", data)
                    if isinstance(acc, dict):
                        current["account"].update(acc)
                        DataService.save_json(SESSION_FILE, current)
                except Exception as e:
                    log.debug("Session save after /me: %s", e)

            self._set_headers(status)
            self.wfile.write(resp.encode("utf-8"))
            return

        # --- Static Files ---
        path = self.path.split("?")[0]
        fpath = None

        # Route: Prompt images
        if path.startswith("/local-data/images/"):
            rel_path = path.replace("/local-data/images/", "").replace("/", os.sep)
            fpath = SecurityService.validate_path(IMAGES_DIR, rel_path)
        
        # Route: App data (e.g. printplaceholder.jpg next to settings.json)
        elif path.startswith("/local-data/app/"):
            rel_path = path.replace("/local-data/app/", "").replace("/", os.sep)
            fpath = SecurityService.validate_path(APP_DATA, rel_path)
            # Block sensitive files from HTTP access
            if fpath and os.path.basename(fpath).lower() in ("session.json", "settings.json"):
                fpath = None

        # Route: Event images
        elif path.startswith("/event-data/"):
            parts = path.strip("/").split("/")
            if len(parts) >= 4 and parts[0] == "event-data" and parts[2] == "images":
                event_id = parts[1]
                filename = parts[3]
                target_dir = os.path.join(EVENTS_DIR, event_id, "images")
                fpath = SecurityService.validate_path(target_dir, filename)

        # Route: HTML modules
        elif path.startswith("/modules/"):
            module_path = path.replace("/modules/", "")
            fpath = SecurityService.validate_path(
                os.path.join(BASE_DIR, "modules"), 
                module_path
            )

        # Route: Index and static assets
        else:
            if path == "/" or path == "":
                path = "/index.html"
            fpath = SecurityService.validate_path(BASE_DIR, path.lstrip("/"))

        # Serve file
        if fpath and os.path.isfile(fpath):
            mime, _ = mimetypes.guess_type(fpath)
            self._set_headers(200, mime or "application/octet-stream")
            with open(fpath, "rb") as f:
                self.wfile.write(f.read())
        else:
            self.send_error(404)

    def log_message(self, format, *args):
        """Suppress server logs."""
        pass

# =============================================================================
# SERVER RUNNER
# =============================================================================

def run_server():
    """Start the HTTP server."""
    server = HTTPServer(("127.0.0.1", PORT), KruderRouter)
    print(f"[KRUDER] Server running on http://127.0.0.1:{PORT}")
    server.serve_forever()
