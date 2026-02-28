# =============================================================================
# KRUDER 1 - MAIN.PY
# Application entry point
# =============================================================================

import threading
import webview

from utils import PORT, init_environment
from router import run_server
from api import NativeApi
from log_service import append_log, cleanup_old_logs

# =============================================================================
# BOOTSTRAP
# =============================================================================

if __name__ == '__main__':
    init_environment()
    cleanup_old_logs()
    append_log("INFO", "session_start", {"version": "1.0", "build": "production"})
    append_log("INFO", "app_start")

    # 1. Start HTTP Server
    threading.Thread(target=run_server, daemon=True).start()
    
    # 2. Create API Bridge
    api = NativeApi()

    # 3. Create Window (maximized = full screen size but with title bar)
    window = webview.create_window(
        'KRUDER 1',
        url=f'http://127.0.0.1:{PORT}/index.html',
        maximized=True,
        resizable=True,
        fullscreen=False,
        frameless=False,
        js_api=api
    )

    # 4. Connect API to Window
    api._window = window

    # 5. Log when window is closed via title bar X button
    def _on_closing():
        append_log("INFO", "app_exit", {"source": "window_close"})
    window.events.closing += _on_closing

    # 6. Start
    webview.start(debug=False)