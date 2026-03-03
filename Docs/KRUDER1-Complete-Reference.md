# KRUDER 1 — Complete Reference Document

> **Purpose**: This document contains absolutely everything about the Kruder 1 project — architecture, code, modules, API calls, design system, workers, database, business logic, brand, vision, and every technical detail. If all source files were lost, an AI could reconstruct the entire project from this document alone.
>
> **Last updated**: March 2, 2026
> **Version**: 1.0.0

---

## TABLE OF CONTENTS

1. [Who Is Behind This](#1-who-is-behind-this)
2. [What Is Kruder 1](#2-what-is-kruder-1)
3. [Business Model](#3-business-model)
4. [Brand Identity](#4-brand-identity)
5. [System Architecture](#5-system-architecture)
6. [Desktop Software — Overview](#6-desktop-software--overview)
7. [Desktop Software — Entry Point & Config](#7-desktop-software--entry-point--config)
8. [Desktop Software — HTTP Router](#8-desktop-software--http-router)
9. [Desktop Software — NativeApi Bridge](#9-desktop-software--nativeapi-bridge)
10. [Desktop Software — Utilities & Services](#10-desktop-software--utilities--services)
11. [Desktop Software — Log Service](#11-desktop-software--log-service)
12. [Desktop Software — Module: Auth](#12-desktop-software--module-auth)
13. [Desktop Software — Module: Dashboard](#13-desktop-software--module-dashboard)
14. [Desktop Software — Module: Events](#14-desktop-software--module-events)
15. [Desktop Software — Module: Event Mode](#15-desktop-software--module-event-mode)
16. [Desktop Software — Module: Prompt Lab](#16-desktop-software--module-prompt-lab)
17. [Desktop Software — Module: Frames](#17-desktop-software--module-frames)
18. [Desktop Software — Module: Settings](#18-desktop-software--module-settings)
19. [Desktop Software — Frontend (SPA Shell)](#19-desktop-software--frontend-spa-shell)
20. [Desktop Software — i18n System](#20-desktop-software--i18n-system)
21. [Desktop Software — CSS Design System](#21-desktop-software--css-design-system)
22. [Cloudflare Worker: kruder1-auth](#22-cloudflare-worker-kruder1-auth)
23. [Cloudflare Worker: kruder1-gen](#23-cloudflare-worker-kruder1-gen)
24. [Cloudflare Worker: kruder1-landing](#24-cloudflare-worker-kruder1-landing)
25. [Website (kruder1.com)](#25-website-kruder1com)
26. [Database Schema (Supabase)](#26-database-schema-supabase)
27. [External Integrations](#27-external-integrations)
28. [Security Architecture](#28-security-architecture)
29. [Data Flows](#29-data-flows)
30. [Local Storage Structure](#30-local-storage-structure)
31. [Build & Distribution](#31-build--distribution)
32. [Environment Variables](#32-environment-variables)
33. [URLs & Endpoints](#33-urls--endpoints)
34. [Project File Structure](#34-project-file-structure)
35. [Known Issues & Notes](#35-known-issues--notes)

---

## 1. Who Is Behind This

- **Owner**: Aldo — solo vibe-coder (not a professional developer), based in Mexico
- **Experience**: 14+ years running photo booths at real events
- **Building method**: Everything built with AI assistance (Claude, etc.)
- **Languages**: Spanish (native), English
- **Contact**: hola@kruder1.com
- **Domain**: kruder1.com

Aldo understands the photo booth business deeply. The software is built from real experience — what works at events, what clients want, what operators need. This is not a startup experiment; it's a tool designed by someone who has worked thousands of events.

---

## 2. What Is Kruder 1

**Kruder 1** is an AI-powered photo booth software for Windows. It captures photos from a webcam, transforms them using AI (Seedream 4.5 by ByteDance, via Segmind API), and delivers the results to event guests via QR code, email, or print.

### Core Concept
- The software is **free to download and install**
- Revenue comes from **credit sales** (1 credit = 1 AI-generated image)
- **No subscriptions. No expiration. No fine print.**
- Credits are purchased once and used whenever the operator wants

### What Makes It Different
- It's built for **photo booth owners** who want to charge more for a unique experience
- The AI transformation creates something no traditional photo booth can offer
- The operator's clients (event guests) get a unique AI-generated image, not just a filtered selfie

---

## 3. Business Model

### Credit Packages

| Plan | Credits | Price (USD) | Per Credit |
|------|---------|-------------|------------|
| Basic | 150 | $40 | $0.27 |
| Plus | 300 | $60 | $0.20 |
| Pro | 600 | $90 | $0.15 |

### Demo Credits
- 10 free credits per verified account
- Restricted to 1 demo per HWID (hardware ID) to prevent abuse
- Requires: email verified + HWID not previously claimed

### Payment Flow
1. User selects plan (from software or website)
2. Stripe Checkout Session created
3. User completes payment on Stripe
4. Webhook processes payment → credits added to account
5. Confirmation email sent

### Stripe Configuration
- **Mode**: Checkout Sessions (not Payment Intents)
- **Webhook event**: `checkout.session.completed`
- **Webhook URL**: `https://kruder1-auth.kruder1-master.workers.dev/stripe-webhook`
- **Price IDs**: Stored in worker env vars (STRIPE_PRICE_ID_BASIC, _PLUS, _PRO)

---

## 4. Brand Identity

### Name: "Kruder"
- Strong, industrial, Germanic sound
- Does not describe the product (intentional)
- Not emotional or "startup friendly"
- Feels like system, machine, core

### The "1"
- Unity, origin, core, base version, primary system
- Works in Spanish ("Kruder uno") and English ("Kruder one")
- Visual identity: technical, clean, systematic — aviation / automotive / Kubrick

### Future Hardware
- Software/Brand: **Kruder 1**
- Physical booth: **Monolith** (Monolith Mk I, Monolith Zero)

### Voice & Personality
- Confident. Calm. Direct. Elegant. Functional.
- Never defensive, never apologetic, never needy
- Premium without saying "premium"
- **"If it sounds like it's trying to convince, it's wrong."**

### Target Audience
- Photo booth **owners** (business owners, not employees)
- Tired of competing on price, frustrated by generic offers
- Commercial mindset (seller, not technician)
- Not afraid to invest if ROI is clear

### Anchor Phrases
- "You don't sell photos. You sell differentiation."
- "The photo booth isn't the problem. Offering the same thing as everyone else is."
- "It's not for everyone. And that's part of the value."

### Aesthetic Influence
- 2001: A Space Odyssey / Kubrick / Monolith
- Swiss / International Style
- Operating room precision
- Concepts: cleanliness, monochrome, precision, quiet power, emotional neutrality

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SOFTWARE (Windows)                       │
│  Python 3.10 + PyWebview + HTML/CSS/JS                      │
│  Local HTTP server on port 8765                              │
│  Fullscreen window (WebView2)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────────────┐
│               CLOUDFLARE WORKERS                             │
│  ├─ kruder1-auth.js   → Auth, payments, credits, email      │
│  ├─ kruder1-gen.js    → AI generation, R2, email, prompts   │
│  └─ kruder1-landing.js → Photo pages, pass-through to Pages │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬────────────────┐
        ▼               ▼               ▼                ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐      ┌─────────┐
   │ Supabase│    │ Stripe  │    │ Segmind │      │  Brevo  │
   │ (DB)    │    │ (Pays)  │    │ (AI)    │      │ (Email) │
   └─────────┘    └─────────┘    └─────────┘      └─────────┘
        │                                              │
   PostgreSQL                                    Email + SMS
   REST API                                     (Transactional)
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Desktop app | Python 3.10 + pywebview 4.x | Native Windows GUI using WebView2 |
| Frontend | Vanilla HTML/CSS/JS | No frameworks, SPA pattern |
| Backend API | Cloudflare Workers | Serverless business logic |
| Database | Supabase (PostgreSQL) | User accounts, credits, purchases |
| Payments | Stripe | Credit card processing |
| AI Generation | Segmind (Seedream 4.5) | Image transformation |
| Email | Brevo (SendinBlue) | Transactional emails |
| Object Storage | Cloudflare R2 | Temp photos, results, installer, logs |
| Static Site | Cloudflare Pages | kruder1.com website |
| Rate Limiting | Cloudflare KV | Request throttling |
| DNS/CDN | Cloudflare | Domain management |

### Python Dependencies
```
pywebview>=4.0      # GUI native with WebView2
requests>=2.28      # HTTP requests
Pillow>=9.0         # Image processing (resize, compose frames)
pywin32>=306        # Windows printing (win32ui, win32print)
qrcode>=7.0         # QR code generation
```

---

## 6. Desktop Software — Overview

The desktop app is a **Single Page Application** rendered inside a pywebview window. The Python backend serves HTML/CSS/JS via a local HTTP server (port 8765) and exposes a `NativeApi` class as a JavaScript bridge (`window.pywebview.api`).

### Architecture Pattern

```
User clicks button in HTML
  → JavaScript calls window.pywebview.api.method_name(args)
    → NativeApi dispatches to the appropriate Python module
      → Module performs logic (local files, network calls)
        → Returns {ok: true, ...} or {error: "message"}
          → JavaScript updates the UI
```

### Module System
Each feature has a paired `.py` (logic) and `.html` (template) file in `Software/modules/`:
- `auth.py` + `auth.html` — Login, registration, session
- `dashboard.py` + `dashboard.html` — Dashboard stats
- `events.py` + `events.html` — Event CRUD, gallery
- `eventmode.py` + `eventmode.html` — Photo capture + AI generation
- `promptlab.py` + `promptlab.html` — Prompt library management
- `frames.py` + `frames.html` — Frame overlay management
- `settings.py` + `settings.html` — App settings, printing, updates

### Global Frontend State
```javascript
window.AppState = {
    currentModule: 'dashboard',  // Which module is loaded
    session: { token, account }, // User session
    theme: 'light',              // 'light' or 'dark'
    language: 'en'               // Current language code
}
```

### Module Loading
```javascript
// SPA navigation — loads HTML into #module-container
loadModule('events')  // Fetches /modules/events.html and injects
```

### Event Handling
```javascript
window.moduleHandlers = {
    click: function(e) { /* handle clicks */ },
    keydown: function(e) { /* handle keys */ },
    change: function(e) { /* handle changes */ }
}
```

---

## 7. Desktop Software — Entry Point & Config

### main.py (Entry Point)
```python
# Bootstrap sequence:
# 1. init_environment() — create folders in %APPDATA%/Kruder1
# 2. cleanup_old_logs() — delete logs older than 30 days
# 3. Start HTTP server on port 8765 (daemon thread)
# 4. Create NativeApi instance
# 5. Create pywebview window (fullscreen=True, maximized=True)
# 6. Connect api._window = window
# 7. Register closing event handler
# 8. webview.start(debug=False)
```

**Key details:**
- Window opens fullscreen by default
- HTTP server runs in a background daemon thread
- `debug=False` in production (no DevTools)
- Window closing is logged

### config.py (Configuration)

```python
# Hardcoded values (cannot be overridden):
WORKER_BASE = "https://kruder1-auth.kruder1-master.workers.dev"
GEN_WORKER_BASE = "https://kruder1-gen.kruder1-master.workers.dev"
APP_VERSION = "1.0.0"
IMAGE_SCALE_FACTOR = 0.75  # Resize factor for captured photos
JPEG_QUALITY = 85           # JPEG compression quality

# Safe overrides from config.json (only PORT and APP_DATA):
PORT = 8765
APP_DATA = "%APPDATA%/Kruder1"

# BASE_DIR = directory where main.py lives
```

**Security**: Only `PORT` and `APP_DATA` can be overridden via `config.json`. Worker URLs cannot be changed — this prevents man-in-the-middle attacks by redirecting API calls.

---

## 8. Desktop Software — HTTP Router

### router.py

The HTTP server runs on `http://127.0.0.1:8765` and handles:

| Route Pattern | Purpose | Security |
|--------------|---------|----------|
| `/api/*` | Proxy to Cloudflare Workers | Auth token forwarded |
| `/local-data/images/*` | Serve prompt thumbnail images | Path traversal protection |
| `/local-data/app/*` | Serve app data files | Path traversal protection |
| `/event-data/*` | Serve event images | Path traversal protection |
| `/modules/*.html` | Serve module HTML templates | Read-only |
| `/static/*` | Serve CSS, JS, fonts, images | Read-only |
| `/index.html` | Serve SPA shell | Read-only |
| `POST /*` | Accept POST data (max 50MB) | Size limit enforced |

**Path Traversal Protection:**
All file-serving routes use `SecurityService.validate_path(base_dir, requested_path)` which ensures the resolved absolute path stays within the allowed base directory. Requests like `../../etc/passwd` are rejected.

**API Proxy:**
- POST requests to `/api/*` are proxied to `WORKER_BASE/{endpoint}`
- The session token and HWID are included automatically
- Content-Type is application/json

---

## 9. Desktop Software — NativeApi Bridge

### api.py

The `NativeApi` class is the bridge between JavaScript and Python. It's passed to pywebview as `js_api=api` and becomes accessible in the browser as `window.pywebview.api`.

#### System Methods

| Method | Purpose |
|--------|---------|
| `close_app()` | Close the application window |
| `toggle_fullscreen()` | Toggle fullscreen + maximize on exit |
| `check_system_status()` | Health check all services |
| `log_event(level, message, extra)` | Write to daily log file |
| `upload_debug_log()` | Upload log file to R2 (Easter egg: 5 taps on logo in settings) |

#### Auth Methods (delegated to auth.py)
| Method | Purpose |
|--------|---------|
| `login(email, password)` | Login and get JWT |
| `get_session()` | Load saved session from disk |
| `logout()` | Clear session file |
| `refresh_account()` | Fetch latest account data from server |

#### Dashboard Methods (delegated to dashboard.py)
| Method | Purpose |
|--------|---------|
| `get_dashboard_stats()` | Aggregate stats from disk |

#### Event Methods (delegated to events.py)
| Method | Purpose |
|--------|---------|
| `create_event(name)` | Create new event folder |
| `get_events()` | List all events |
| `rename_event(event_id, new_name)` | Rename event |
| `delete_event(event_id)` | Send event to Recycle Bin |
| `get_event_images(event_id)` | List images in event |
| `delete_event_image(event_id, image_id)` | Delete single image |
| `export_gallery(event_id, format)` | Export as zip or folder |

#### Event Mode Methods (delegated to eventmode.py)
| Method | Purpose |
|--------|---------|
| `start_event_generation(...)` | Start AI generation (background thread) |
| `get_generation_status()` | Poll generation progress |
| `send_email_notification(...)` | Send photo email to guest |

#### Prompt Lab Methods (delegated to promptlab.py)
| Method | Purpose |
|--------|---------|
| `get_prompts()` | Get all categories and prompts |
| `create_category(name)` | Create prompt category |
| `rename_category(cat_id, new_name)` | Rename category |
| `delete_category(cat_id)` | Delete category |
| `reorder_categories(ordered_ids)` | Reorder categories |
| `create_prompt(cat_id, name, text, ...)` | Create prompt |
| `update_prompt(prompt_id, updates)` | Update prompt |
| `delete_prompt(prompt_id)` | Delete prompt |
| `toggle_prompt(prompt_id, enabled)` | Enable/disable prompt |
| `reorder_prompts(cat_id, ordered_ids)` | Reorder prompts in category |
| `generate_prompt_image(prompt_id, ...)` | Generate AI thumbnail |
| `export_prompts(category_ids)` | Export as .kruder1 file |
| `import_prompts(file_path)` | Import .kruder1 file |
| `check_server_prompts()` | Check for server prompt updates |
| `download_server_prompts()` | Download and merge prompts from server |

#### Frames Methods (delegated to frames.py)
| Method | Purpose |
|--------|---------|
| `get_frames()` | List all frames |
| `add_frame(src_path)` | Add PNG frame overlay |
| `delete_frame(frame_id)` | Delete frame |
| `toggle_frame(frame_id, enabled)` | Toggle frame (exclusive — only one active) |

#### Settings Methods (delegated to settings.py)
| Method | Purpose |
|--------|---------|
| `get_settings()` | Get all settings |
| `get_setting(key)` | Get single setting (dot notation: `camera.brightness`) |
| `update_setting(key, value)` | Update single setting |
| `update_settings(updates)` | Update multiple settings |
| `reset_settings()` | Reset to defaults |
| `get_printers()` | List available Windows printers |
| `test_print(printer_name)` | Print test image |
| `print_image(image_path, printer_name)` | Print specific image |
| `open_printer_settings(printer_name)` | Open Windows printer preferences |
| `get_statistics(event_id)` | Compute event or global statistics |
| `get_event_emails(event_id)` | Get collected email addresses |
| `check_for_update(token)` | Check for software updates |
| `download_update(url, hash)` | Download installer to ~/Downloads |
| `get_download_progress()` | Poll download progress |
| `install_update(installer_path)` | Launch installer EXE |

#### Module Lazy Loading
Modules are loaded on first access via `__getattr__` in `modules/__init__.py`:
```python
_LAZY_MODULES = {
    'eventmode': ('modules.eventmode', 'EventModeModule'),
    'promptlab': ('modules.promptlab', 'PromptLabModule'),
    'frames': ('modules.frames', 'FramesModule'),
    # auth, dashboard, events, settings are loaded normally
}
```

---

## 10. Desktop Software — Utilities & Services

### utils.py

#### Data Paths (all under %APPDATA%/Kruder1/)
```
EVENTS_DIR      = %APPDATA%/Kruder1/events/
PROMPTS_DIR     = %APPDATA%/Kruder1/prompts/
IMAGES_DIR      = %APPDATA%/Kruder1/prompts/images/
JSON_FILE       = %APPDATA%/Kruder1/prompts/prompts.json
SESSION_FILE    = %APPDATA%/Kruder1/session.json
FRAMES_DIR      = %APPDATA%/Kruder1/frames/
FRAMES_IMAGES_DIR = %APPDATA%/Kruder1/frames/images/
FRAMES_JSON     = %APPDATA%/Kruder1/frames/frames.json
LOGS_DIR        = %APPDATA%/Kruder1/logs/
```

#### init_environment()
Creates all required directories on startup. Creates empty `prompts.json` and `frames.json` if they don't exist.

#### SecurityService

| Method | Purpose |
|--------|---------|
| `get_hwid()` | Generate SHA-256 hash from CPU ID + motherboard serial + BIOS serial. Cached after first call. Falls back to Windows MachineGuid if WMI fails. |
| `validate_path(base_dir, requested_path)` | Prevent path traversal attacks. Returns None if path escapes base_dir. |

**HWID Generation**: Uses `wmic` to get CPU processorid, baseboard serialnumber, and bios serialnumber. Combines with `|` separator and SHA-256 hashes them.

#### NetworkService

| Method | Purpose |
|--------|---------|
| `proxy_api(endpoint, data, auth, method)` | Proxy calls to auth worker. Automatically adds HWID header and `persistent=True` for login. |
| `generate_image(token, payload)` | Call gen worker `/generate-prompt` |
| `generate_event_photo(token, payload)` | Call gen worker `/generate` |
| `send_email(token, payload)` | Call gen worker `/send-email` |
| `upload_framed_result(token, gen_id, path)` | Upload framed JPG to R2 (multipart) |
| `check_system_status()` | Health check via gen worker `/system-status` |

**All network calls include:**
- `User-Agent: Kruder1-Desktop/PROD`
- `X-HWID: {sha256_hwid}`
- `Authorization: Bearer {jwt_token}` (when authenticated)

#### DataService

| Method | Purpose |
|--------|---------|
| `load_json(filepath, default)` | Safely load JSON file |
| `save_json(filepath, data)` | **Atomic save**: write to temp file, then `os.replace()` to destination |

The atomic save pattern prevents data corruption if the app crashes during a write.

#### Image Processing

| Function | Purpose |
|----------|---------|
| `decode_and_resize_image(base64_str, scale)` | Decode base64 → PIL Image → resize by scale factor (0.75 default) |
| `process_and_save_image(base64_str, output_path, scale, quality)` | Decode + resize + save as JPEG |

#### Windows Recycle Bin
```python
send_to_recycle_bin(paths)  # Uses SHFileOperationW with FOF_ALLOWUNDO
```
Files are never permanently deleted — they go to the Windows Recycle Bin.

#### Error Sanitization
```python
friendly_error(raw_error)
# Content moderation keywords → "CONTENT NOT ALLOWED"
# Everything else → "GENERATION FAILED, TRY AGAIN"
```
Never shows raw API errors to users.

---

## 11. Desktop Software — Log Service

### log_service.py

**Pattern**: Daily log files in `%APPDATA%/Kruder1/logs/`

**File naming**: `kruder1_YYYY-MM-DD.txt`

**Session header** (written once per day):
```
[SESSION] HWID=abc123def... date=2026-03-02 app=Kruder1
```

**Log line format**:
```
2026-03-02 14:30:45.123 [INFO] app_start
2026-03-02 14:31:00.456 [ERROR] generation_failed {"error":"timeout"}
```

**Security features**:
- **Redacted keys**: password, token, input_b64, ref_base64, new_img_base64 → `[REDACTED]`
- **Value truncation**: strings max 200 chars
- **Thread-safe**: uses `threading.Lock()`

**Retention**: 30 days. Old logs cleaned at startup via `cleanup_old_logs()`.

**Easter egg**: 5 taps on the logo in settings triggers `upload_debug_log()` which uploads today's log to R2 at `logs/{hwid}_{timestamp}.txt`.

---

## 12. Desktop Software — Module: Auth

### auth.py

#### login(email, password)
1. Calls `NetworkService.proxy_api("login", {email, password})`
2. On success, saves session to `SESSION_FILE`
3. In a background thread, auto-claims demo credits if HWID hasn't claimed yet
4. Returns `{ok: true, account: {id, email, credits}}`

#### get_session()
1. Loads `SESSION_FILE` from disk
2. Returns `{ok: true, token, account}` or `{ok: true, token: null}`

#### logout()
1. Deletes `SESSION_FILE`
2. Returns `{ok: true}`

#### refresh_account()
1. Calls `NetworkService.proxy_api("me", method="GET")`
2. Updates credits in local session file
3. Returns `{ok: true, account: {...}}`

**Demo credit auto-claim**: On login, a background thread calls `/claim-demo` with the HWID. If the HWID has never claimed, 10 credits are added. This is transparent to the user.

---

## 13. Desktop Software — Module: Dashboard

### dashboard.py

#### get_dashboard_stats()
Aggregates data from local disk:
```python
{
    "ok": True,
    "events": count_of_event_folders,
    "photos": total_jpg_files_across_all_events,
    "prompts": count_of_prompts_in_prompts_json
}
```

Scans `EVENTS_DIR` for event folders, counts `.jpg` files in each `images/` subfolder, and counts prompts from `prompts.json`.

---

## 14. Desktop Software — Module: Events

### events.py

#### Data Structure
Each event lives in `%APPDATA%/Kruder1/events/{uuid}/`:
```
{event_id}/
├── event.json          # Event metadata
└── images/
    ├── {gen_id}.jpg    # Generated image
    ├── {gen_id}.json   # Generation metadata (email, duration, prompt)
    └── {gen_id}_qr.png # QR code for download
```

#### event.json schema:
```json
{
    "id": "uuid",
    "name": "Wedding Reception",
    "createdAt": "2026-03-02T14:30:00.000",
    "stats": {
        "total": 0,
        "success": 0,
        "failed": 0,
        "printsSent": 0,
        "printsSuccessful": 0
    }
}
```

#### Methods

| Method | Details |
|--------|---------|
| `create_event(name)` | Creates UUID folder + event.json. Max name length validated. |
| `get_events()` | Lists all events sorted by creation date (newest first) |
| `rename_event(event_id, new_name)` | Updates name in event.json |
| `delete_event(event_id)` | Sends entire folder to Windows Recycle Bin |
| `get_event_images(event_id)` | Returns list of {id, path, metadata} for all JPGs |
| `delete_event_image(event_id, image_id)` | Deletes .jpg, .json, and _qr.png |
| `export_gallery(event_id, format)` | "zip" → creates .zip; "folder" → opens folder in Explorer |

---

## 15. Desktop Software — Module: Event Mode

### eventmode.py

This is the core generation flow — the actual photo booth experience.

#### start_event_generation(event_id, prompt_text, input_b64, email, language)

Runs in a **background thread**. Steps:

1. **Validate inputs** — event exists, prompt not empty, base64 not empty
2. **Set status** → `generating`
3. **Save original photo** — decode base64, resize (0.75x), save as JPEG
4. **Call AI** — `NetworkService.generate_event_photo()` with token, base64, prompt
5. **Retry logic** — 5 attempts on 429 errors with delays [5, 8, 12, 15, 20] seconds
6. **On success**:
   - Decode AI result base64 → save as `{gen_id}.jpg`
   - **Frame overlay**: If active frame exists, composite using PIL `alpha_composite`
   - **Upload framed result to R2**: 3 retry attempts with 2s delays
   - **Generate QR code** pointing to `https://kruder1.com/photo/{gen_id}`
   - **Save metadata JSON** (email, prompt, duration, photoPageUrl)
   - **Update event stats** (increment success count)
   - **Update local session credits**
   - Set status → `complete`
7. **On failure**:
   - Use `friendly_error()` to sanitize error message
   - Update event stats (increment failed count if credit was deducted)
   - Set status → `error`

#### get_generation_status()
Returns:
```python
{
    "status": "generating" | "complete" | "error" | "idle",
    "result_image": "/event-data/{event_id}/images/{gen_id}.jpg",
    "qr_image": "/event-data/{event_id}/images/{gen_id}_qr.png",
    "photo_page_url": "https://kruder1.com/photo/{gen_id}",
    "credits_remaining": 42,
    "error_message": "GENERATION FAILED, TRY AGAIN"  # only on error
}
```

#### Frame Composition
When a frame is active:
```python
from PIL import Image
result = Image.open(ai_result_path).convert("RGBA")
frame = Image.open(frame_path).convert("RGBA")
frame_resized = frame.resize(result.size, Image.Resampling.LANCZOS)
final = Image.alpha_composite(result, frame_resized)
final.convert("RGB").save(output_path, "JPEG", quality=92)
```

#### QR Code Generation
```python
import qrcode
qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=2)
qr.add_data(photo_page_url)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(qr_path)
```

---

## 16. Desktop Software — Module: Prompt Lab

### promptlab.py

The Prompt Lab manages the operator's AI prompt library — categories, prompts with images, import/export.

#### Data Structure (`prompts.json`)
```json
{
    "categories": [
        {
            "id": "uuid",
            "name": "Superheroes",
            "order": 0
        }
    ],
    "prompts": [
        {
            "id": "uuid",
            "categoryId": "uuid",
            "name": "Iron Man",
            "text": "Transform this person into Iron Man, cinematic lighting...",
            "image": "abc123.jpg",
            "enabled": true,
            "order": 0,
            "stats": { "used": 5, "lastUsed": "2026-03-01T..." }
        }
    ]
}
```

#### Key Features

**Category Management**: Create, rename, delete, reorder (drag-and-drop). Deleting a category deletes all its prompts and their images.

**Prompt Management**: Create, update, delete, toggle enable/disable, reorder within category. Each prompt has a name, text (the AI prompt), and optional thumbnail image.

**Generate Thumbnail**: Uses 1 credit to generate a reference image for the prompt. Calls `/generate-prompt` on the gen worker with `aspect_ratio: "2:3"`.

**Export/Import (.kruder1 format)**:
- Export creates a ZIP file renamed to `.kruder1` containing:
  - `data.json` — categories and prompts
  - `images/` — all prompt thumbnail images
- Import reads the ZIP, deduplicates by prompt name within each category, assigns new UUIDs
- Deduplication: skips prompts with identical names in the same category

**Server Prompts**:
- `check_server_prompts()` — HEAD request to R2 `prompts/latest.kruder1`, returns hash and size
- `download_server_prompts()` — Downloads the .kruder1 file, merges with local prompts

**Statistics Tracking**:
```python
prompt["stats"]["used"] += 1
prompt["stats"]["lastUsed"] = datetime.now().isoformat()
```

---

## 17. Desktop Software — Module: Frames

### frames.py

Manages PNG frame overlays that are composited onto generated photos.

#### Data Structure (`frames.json`)
```json
{
    "frames": [
        {
            "id": "uuid",
            "name": "KRUDER 1 BLACK FRAME",
            "filename": "abc123.png",
            "enabled": false,
            "createdAt": "2026-03-01T..."
        }
    ]
}
```

#### Key Rules
- **Only PNG files** accepted (must have transparency for overlay)
- **Exclusive toggle**: Only one frame can be active at a time. Enabling a frame disables all others.
- **Name**: Extracted from original filename, uppercased
- **Storage**: Frame PNGs stored in `%APPDATA%/Kruder1/frames/images/`
- **Deletion**: Sends to Windows Recycle Bin

#### Methods
| Method | Details |
|--------|---------|
| `add_frame(src_path)` | Copy PNG, create record |
| `delete_frame(frame_id)` | Remove file + record |
| `toggle_frame(frame_id, enabled)` | Exclusive toggle |
| `get_active_frame_path()` | Returns path or None |
| `get_frames()` | List all frames |

---

## 18. Desktop Software — Module: Settings

### settings.py

#### Default Settings
```python
DEFAULT_SETTINGS = {
    "theme": "light",                    # "light" or "dark"
    "language": "en",                    # Language code
    "accentHue": 20,                     # Custom accent hue (0-360)
    "themeLuminance": 15,                # Theme luminance (0-100)
    "inkLuminance": 75,                  # Ink/text luminance (0-100)
    "sound": {
        "volume": 0.15,                  # Background music volume (0-1)
        "uiVolume": 0.75                 # UI sound effects volume (0-1)
    },
    "camera": {
        "deviceId": None,                # Selected camera device ID
        "brightness": None,              # Camera brightness (0-100)
        "contrast": None,                # Camera contrast (0-100)
        "whiteBalance": None             # Camera white balance (0-100)
    },
    "printing": {
        "enabled": False,                # Printing feature on/off
        "automaticPrinting": False,      # Auto-print after generation
        "copies": 1,                     # Number of copies (1-999)
        "printer": None                  # Selected printer name
    },
    "lockScreenText": "We'll be back in a few minutes..."
}
```

#### Input Sanitization
All settings are sanitized through `_sanitize()`:
- Theme must be "light" or "dark"
- Language must exist in `static/locales/*.json`
- Volumes normalized to 0-1 range (converts 0-100 to 0-1 if needed)
- Camera values clamped to 0-100
- Copies clamped to 1-999
- Boolean values coerced with `bool()`

#### Printing System
Uses `win32ui` and `PIL.ImageWin` for silent printing (no dialog):
```python
hdc = win32ui.CreateDC()
hdc.CreatePrinterDC(printer_name)
# Get printer dimensions
printer_w = hdc.GetDeviceCaps(110)  # PHYSICALWIDTH
printer_h = hdc.GetDeviceCaps(111)  # PHYSICALHEIGHT
# Print image
dib = ImageWin.Dib(img)
dib.draw(hdc.GetHandleOutput(), (0, 0, printer_w, printer_h))
```

Printer list retrieved via `win32print.EnumPrinters()` with PowerShell fallback.

#### Statistics
Computed from disk by scanning event folders:
```python
{
    "generationAttempts": total,
    "photosGenerated": success,
    "generationFailed": total - success,
    "successRate": percentage,
    "printsSent": prints_sent,
    "printsSuccessful": prints_ok,
    "printsFailed": prints_sent - prints_ok,
    "printSuccessRate": percentage,
    "emailsCount": unique_email_count,
    "avgTimeSeconds": average_generation_duration
}
```

#### Software Updates
1. `check_for_update(token)` — GET `/check-software-update` from gen worker → compares semver
2. `download_update(url, hash)` — Background thread downloads to `~/Downloads/`, verifies SHA-256
3. `get_download_progress()` — Returns `{percent, downloaded_mb, total_mb, status}`
4. `install_update(path)` — Re-verifies SHA-256, then `os.startfile(installer.exe)`

#### Email Export
`get_event_emails(event_id)` — Scans generation JSON files for email addresses, returns unique valid emails for CSV export.

---

## 19. Desktop Software — Frontend (SPA Shell)

### index.html

The main SPA shell contains:
- Navigation bar with logo, credit display, theme/language toggles
- `#module-container` — where module HTML is injected
- Global JavaScript for:
  - Module loading (`loadModule(name)`)
  - Session management
  - Theme switching (CSS class on `<html>`)
  - Sound system (background music + UI effects)
  - Virtual keyboard for kiosk mode
  - PIN lock screen (4-digit, sessionStorage-based)
  - Animated grid canvas (dots traveling along grid lines)

### Virtual Keyboard
```javascript
initKeyboard({
    target: '#email-input',
    type: 'email',    // 'email', 'text', 'numeric'
    onSubmit: (value) => { /* handle input */ }
})
```
Full on-screen keyboard for kiosk/touchscreen use at events.

### Sound System
Sound files in `static/sounds/`:
- `button.mp3` — Button click
- `back.mp3` — Back navigation
- `keyboard.mp3` — Virtual keyboard tap
- `lock.mp3` / `unlock.mp3` — PIN lock/unlock
- `pinpad.mp3` — PIN entry
- `toggle.mp3` — Toggle switch
- `warning.mp3` — Warning/error
- `loop.mp3` / `loop chill.mp3` — Background music

Two volume controls: `volume` (music) and `uiVolume` (effects).

### PIN Lock
- 4-digit PIN stored in `sessionStorage` (per-session, not persisted)
- When locked, shows customizable message (`lockScreenText` setting)
- Prevents unauthorized access during events

---

## 20. Desktop Software — i18n System

### i18n.js

**10 supported languages**: en, es, ja, fr, de, it, pt, zh, ru, ar

**Pattern**: JSON dictionary files in `static/locales/{lang}.json`

**HTML markup**: `<span data-i18n="events.title">EVENT MANAGER</span>`

**JavaScript**: `t('events.title')` or `i18n.t('events.title', {count: 5})`

**Parameter interpolation**: `{key}` placeholders in strings replaced at runtime.

**Attributes supported**: `data-i18n-attr="placeholder"` for placeholders, `data-i18n-attr="title"` for tooltips, etc.

**Language change flow**:
1. User clicks language button
2. `i18n.setLanguage(code)` called
3. Persists choice to settings.json via `pywebview.api.update_setting('language', code)`
4. Loads new JSON dictionary
5. `i18n.apply()` updates all `[data-i18n]` elements
6. Dispatches `window.languagechange` event

**Locale file structure** (example en.json):
```json
{
    "auth": {
        "title": "WELCOME TO KRUDER 1",
        "email_placeholder": "Email",
        "password_placeholder": "Password",
        "btn_login": "LOG IN"
    },
    "dashboard": {
        "title": "DASHBOARD",
        "events": "EVENTS",
        "photos": "PHOTOS"
    },
    "events": {
        "title": "EVENT MANAGER",
        "btn_create_event": "CREATE EVENT"
    }
}
```

---

## 21. Desktop Software — CSS Design System

### app.css (Source of Truth)

**The desktop app's CSS is the source of truth for all visual design.** The website must match.

#### Typography
| Role | Font | Weight |
|------|------|--------|
| Headings, buttons, labels | Barlow | 700-900 |
| Inputs, body text | Inter | 400-500 |

#### Color Tokens (CSS Custom Properties)

**Light Theme:**
```css
--theme-ink: #000000;
--theme-paper: #FFFFFF;
--theme-border: #000000;
--theme-input-bg: #FFFFFF;
--color-error: #ff3333;
```

**Dark Theme:**
```css
--theme-ink: #FFFFFF;
--theme-paper: #000000;
--theme-border: #FFFFFF;
--theme-input-bg: #000000;
```

Fully monochrome — no accent colors. Both themes use only black and white.

#### Key Design Rules
1. **Pure B&W**: No grays for main surfaces — only pure black and pure white
2. **Fully monochrome**: No accent colors — everything is black and white
3. **Borders**: `2px solid` everywhere
4. **Border radius**: `0.5rem` (8px) — not 12px, not rounded
5. **Flat buttons**: No drop shadow, scale animation on press
6. **Animated grid canvas**: Full-viewport grid with dot particles traveling along grid lines
7. **Button height**: 60px (`--dim-btn-height`)

#### Button Styles
```css
.btn-main {
    border: 2px solid var(--theme-ink);
    border-radius: 0.5rem;
    box-shadow: 0 4px 0 0 var(--theme-ink);
    font-family: Barlow;
    font-weight: 700;
    text-transform: uppercase;
}
.btn-main:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 0 var(--theme-ink);
}
.btn-primary {
    background: var(--theme-accent);
    color: #fff;
    border-color: var(--theme-accent);
    box-shadow: 0 4px 0 0 var(--theme-accent-dark);
}
```

---

## 22. Cloudflare Worker: kruder1-auth

### kruder1-auth.js

**Purpose**: Authentication, payments, credits, account management

#### Routes

| Method | Path | Rate Limit | Auth | Purpose |
|--------|------|-----------|------|---------|
| POST | `/register` | 10/hour | No | Create account + send verification email |
| POST | `/login` | 5/min | No | Login → JWT |
| GET | `/verify-email` | — | No | Verify email token |
| POST | `/forgot-password` | 5/hour | No | Send reset email |
| POST | `/reset-password` | — | No | Reset password with token |
| POST | `/claim-demo` | — | JWT | Claim 10 free credits (1 per HWID) |
| GET | `/me` | — | JWT | Get account data |
| POST | `/create-checkout-session` | — | JWT | Create Stripe checkout |
| POST | `/stripe-webhook` | — | Stripe sig | Process payment webhook |
| GET | `/purchases` | — | JWT | Purchase history |
| GET | `/health` | — | No | Health check |

#### Security Features

**Password Hashing**: PBKDF2-SHA256 with 100,000 iterations, 16-byte random salt
```javascript
// Storage format: base64(salt + hash)
// Salt: 16 bytes random
// Hash: 256-bit derived key
```

**Password Requirements**: Min 8 chars, must have: lowercase, uppercase, digit

**JWT Tokens**:
- **Web tokens**: 7-day expiry, HS256
- **Desktop tokens**: 90-day expiry, include `client: "desktop"` claim
- Desktop tokens validated against HWID in `account_devices` table

**Account Lockout**: After 10 failed login attempts → locked for 15 minutes

**Registration Security**: If email already exists, sends "someone tried to register" email instead of revealing that the email exists.

**Webhook Verification**: HMAC-SHA256 signature validation + 5-minute timestamp window

#### Email Templates
4 types: verify, reset, already_registered, purchase
- Bilingual (en/es)
- Branded HTML template matching Kruder 1 design (black border, logo, CTA button)

#### CORS
Allowed origins:
```javascript
["https://kruder1.com", "https://www.kruder1.com", "http://127.0.0.1", "http://localhost"]
```

---

## 23. Cloudflare Worker: kruder1-gen

### kruder1-gen.js

**Purpose**: AI image generation, R2 storage, email delivery, prompts sync, software updates

#### Routes

| Method | Path | Rate Limit | Auth | Purpose |
|--------|------|-----------|------|---------|
| POST | `/generate` | — | JWT | Generate AI photo (event mode) |
| POST | `/generate-prompt` | — | JWT | Generate prompt thumbnail |
| POST | `/send-email` | 10/min | JWT | Send photo email |
| POST | `/upload-framed-result` | — | JWT | Replace R2 image with framed version |
| POST | `/upload-debug-log` | — | JWT | Upload debug log to R2 |
| GET | `/check-prompts-update` | — | JWT | Check for new server prompts |
| GET | `/download-prompts` | — | JWT | Download .kruder1 file |
| GET | `/check-software-update` | — | JWT | Check latest.json for new version |
| GET | `/health` | — | No | Health check |
| GET | `/system-status` | — | No | Aggregated health of all services |

#### AI Generation Flow (/generate)

1. Verify JWT + check credits
2. **Deduct 1 credit BEFORE generation** (atomic via `rpc/deduct_credit`)
3. Upload user photo to R2 (`temp/{id}-input.jpg`)
4. Call Segmind Seedream 4.5 with prompt + photo URL
5. Return base64 image to client
6. Delete temp photo from R2
7. Send email if valid email provided
8. **On failure**: Refund credit + delete temp photo

#### Segmind Configuration
```javascript
SEGMIND_ENDPOINT = "https://api.segmind.com/v1/seedream-4.5"
// 2:3 aspect ratio (2048x3072) for event photos
// 1:1 aspect ratio (2048x2048) for prompt thumbnails
// Retry: 5 attempts on 429 with delays [5, 8, 12, 15, 20] seconds
```

#### System Status (/system-status)
Checks 4 services:
1. **gen** — always ok (self)
2. **auth** — fetch auth worker `/health`, status < 500 = ok
3. **ai** — empty POST to Segmind, status < 500 = ok (400/422 = alive)
4. **db** — fetch Supabase REST API root, status < 500 = ok

Returns: `{status: "operational" | "degraded" | "down", services: {...}}`

#### R2 Key Structure
```
temp/{id}-input.jpg          # Temporary user photos (deleted after processing)
temp/{id}-ref.jpg            # Temporary reference images
results/{id}.jpg             # Generated results (served via media.kruder1.com)
prompts/latest.kruder1       # Server prompts file
releases/latest.json         # Software update manifest
releases/Kruder1-Setup-x.x.x.exe  # Installer
logs/{hwid}_{timestamp}.txt  # Debug logs
```

---

## 24. Cloudflare Worker: kruder1-landing

### kruder1-landing.js

**Purpose**: Serve photo share/download pages and proxy to Cloudflare Pages

#### Routes

| Pattern | Purpose |
|---------|---------|
| `GET /photo/:id` | Render photo page (Share + Download buttons) |
| `GET /photo/:id/download` | Proxy download with Content-Disposition: attachment |
| `* (everything else)` | Pass-through to Cloudflare Pages (static site) |

#### Photo Page Features
- Full branded page with Kruder 1 design (animated grid, header)
- Photo displayed with border
- **Share button**: Uses `navigator.share()` if available, falls back to clipboard copy
- **Download button**: Direct download link
- Theme toggle (light/dark, persisted in localStorage)
- Language toggle (EN/ES, auto-detects system language)
- Photo click → opens full image in new tab

#### Photo ID Validation
```javascript
const PHOTO_ID_REGEX = /^[a-zA-Z0-9\-]+$/;
```

#### Pass-through to Pages
```javascript
const origin = env.PAGES_ORIGIN || "https://kruder1-landing.pages.dev";
// Proxies request to Pages, strips content-encoding header
```

---

## 25. Website (kruder1.com)

### Pages

| Page | Purpose |
|------|---------|
| `index.html` | Landing page — hero, value prop, FAQ (8 questions), CTA |
| `pricing.html` | 3 credit packages with Stripe checkout |
| `login.html` | Login, register, forgot password (3 forms in 1 page) |
| `dashboard.html` | User panel: credits, purchase history, software download |
| `faqs.html` | FAQ accordion |
| `contact.html` | Contact info |
| `privacy.html` | Privacy policy (EN/ES toggle) |
| `terms.html` | Terms & conditions (EN/ES toggle) |
| `verify-email.html` | Email verification with token |
| `reset-password.html` | Password reset with token |
| `status.html` | System status page (4 services health) |

### Website Architecture
- **Static HTML** deployed to Cloudflare Pages
- **Served via** kruder1-landing worker (pass-through proxy)
- **i18n**: Page-specific dictionaries merged with `SHARED_DICT` from `main.js`
- **Pattern**: Each page calls `KRUDER.init({page_dict})` which merges with shared dict
- **Theme**: Light/dark toggle persisted in localStorage
- **Language**: EN/ES toggle persisted in localStorage

### Website main.js Pattern
```javascript
// Shared dictionary (navigation, footer, common terms)
const SHARED_DICT = {
    nav_home: { en: 'Home', es: 'Inicio' },
    nav_pricing: { en: 'Pricing', es: 'Precios' },
    // ...
};

// KRUDER.init(pageDict) merges page dict with shared dict
// KRUDER.setLang(lang) applies translations
// KRUDER.toggleTheme() switches theme
```

### Deployment
```bash
# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name kruder1-landing --branch main --commit-dirty=true

# Must use --branch main to update the production alias
```

---

## 26. Database Schema (Supabase)

### Tables

#### accounts
```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
email                 TEXT UNIQUE NOT NULL
password_hash         TEXT NOT NULL
credits               INTEGER DEFAULT 0
email_verified        BOOLEAN DEFAULT FALSE
failed_login_attempts INTEGER DEFAULT 0
locked_until          TIMESTAMP NULL
created_at            TIMESTAMP DEFAULT NOW()
```

#### verification_tokens
```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
account_id   UUID REFERENCES accounts(id)
token        TEXT UNIQUE NOT NULL  -- SHA-256 hash of actual token
expires_at   TIMESTAMP NOT NULL    -- 24 hours from creation
created_at   TIMESTAMP DEFAULT NOW()
```

#### password_reset_tokens
```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
account_id   UUID REFERENCES accounts(id)
token_hash   TEXT UNIQUE NOT NULL  -- SHA-256 hash of actual token
expires_at   TIMESTAMP NOT NULL    -- 1 hour from creation
created_at   TIMESTAMP DEFAULT NOW()
```

#### account_devices
```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
account_id   UUID REFERENCES accounts(id)
hwid         TEXT NOT NULL
last_seen_at TIMESTAMP DEFAULT NOW()
created_at   TIMESTAMP DEFAULT NOW()
```

#### purchases
```sql
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
account_id        UUID REFERENCES accounts(id)
credits_added     INTEGER NOT NULL
amount_paid       DECIMAL NOT NULL  -- in cents (Stripe amount_total)
currency          TEXT DEFAULT 'usd'
stripe_payment_id TEXT             -- Stripe session ID (idempotency check)
created_at        TIMESTAMP DEFAULT NOW()
```

#### hwid_demo_claimed
```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
hwid         TEXT UNIQUE NOT NULL
account_id   UUID REFERENCES accounts(id)
created_at   TIMESTAMP DEFAULT NOW()
```

### RPC Functions

#### add_credits(p_account_id, p_credits)
Atomically adds credits to an account. Returns new credit balance.

#### deduct_credit(p_account_id)
Atomically deducts 1 credit. Throws error if insufficient credits. Returns new balance.

#### refund_credit(p_account_id)
Atomically adds 1 credit back (on generation failure).

### RLS (Row Level Security)
- RLS enabled on all tables
- Workers use `service_role` key (bypasses RLS)
- Direct user access restricted to own data

---

## 27. External Integrations

### Segmind (AI Generation)
- **Model**: Seedream 4.5 (ByteDance)
- **Endpoint**: `https://api.segmind.com/v1/seedream-4.5`
- **Auth**: `Authorization: Bearer {api_key}`
- **Response**: Synchronous binary image (not async/polling)
- **Capacity**: 30+ concurrent generations per API key
- **Sizes**: 2048x3072 (2:3) for photos, 2048x2048 (1:1) for thumbnails
- **Retry**: 5 attempts on 429 with exponential backoff [5, 8, 12, 15, 20]s
- **Note**: Provider name never exposed to clients — referred to as "AI Engine"

### Stripe (Payments)
- **Mode**: Checkout Sessions
- **Events**: Only `checkout.session.completed` processed
- **Webhook signature**: HMAC-SHA256 verification with timestamp validation
- **Idempotency**: Checks `purchases.stripe_payment_id` to prevent duplicate processing
- **Success URL**: `https://kruder1.com/dashboard.html?success=1&session_id={id}`
- **Cancel URL**: `https://kruder1.com/pricing.html`
- **URL validation**: Only allows kruder1.com, www.kruder1.com, 127.0.0.1, localhost

### Brevo (Email)
- **API**: `https://api.brevo.com/v3/smtp/email`
- **Auth**: `api-key` header
- **Sender**: `Kruder1 <{BREVO_FROM_EMAIL}>`
- **Email types**: Verification, password reset, purchase confirmation, photo ready, already registered
- **Languages**: EN and ES for all email templates

### Cloudflare R2 (Object Storage)
- **Bucket**: `kruder1-bucket`
- **Public URL**: `https://media.kruder1.com`
- **Keys**: `temp/`, `results/`, `prompts/`, `releases/`, `logs/`
- **Temp files**: Deleted after processing
- **Results**: Available for download (expire per operational policy)

### Cloudflare KV (Rate Limiting)
- **Namespace ID**: `429a2d9cae174b0e9e308e8ea6d41431`
- **Key pattern**: `r2:{endpoint}:{ip}`
- **TTL**: Auto-expire based on window size

---

## 28. Security Architecture

### Authentication Flow
1. User registers with email + password
2. Password hashed with PBKDF2-SHA256 (100k iterations, 16-byte salt)
3. Verification email sent with SHA-256 hashed token (24h expiry)
4. After verification, user can log in
5. JWT issued: HS256, includes `sub` (account ID) and `email`
6. Desktop clients: `persistent: true` → 90-day token with `client: "desktop"` claim
7. Desktop tokens validated against HWID in `account_devices` table

### Security Measures
| Measure | Implementation |
|---------|---------------|
| Password hashing | PBKDF2-SHA256, 100k iterations, random salt |
| JWT | HS256 with expiration |
| HWID validation | Desktop tokens require matching device |
| Account lockout | 10 failed attempts → 15 min lock |
| Email enumeration prevention | Same response for existing/new emails |
| Path traversal | `SecurityService.validate_path()` |
| CORS | Strict origin whitelist |
| Rate limiting | KV-based per-IP throttling |
| Webhook verification | HMAC-SHA256 + timestamp |
| Credit deduction | Atomic RPC (deduct before generation, refund on failure) |
| Error sanitization | Never expose raw API errors to users |
| Log redaction | Passwords, tokens, base64 data redacted |
| Config lockdown | Worker URLs cannot be overridden |
| Input validation | Email regex, password strength, file type checks |
| Installer verification | SHA-256 hash check before execution |
| Photo ID validation | Regex: `[a-zA-Z0-9\-]+` only |
| Payload limit | 50MB max on POST requests |
| Debug log upload | Requires auth + HWID, max 5MB |

### Token Types
| Token | Expiry | Validation |
|-------|--------|-----------|
| JWT (web) | 7 days | Signature only |
| JWT (desktop) | 90 days | Signature + HWID match |
| Email verification | 24 hours | SHA-256 hash in DB |
| Password reset | 1 hour | SHA-256 hash in DB |

---

## 29. Data Flows

### Registration Flow
```
User → register(email, password)
  → Auth worker creates account (email_verified: false)
  → Generates random token → SHA-256 hash stored in DB
  → Sends verification email via Brevo
  → User clicks link → verify-email.html?token=xxx
  → Website calls /verify-email?token=xxx
  → Worker verifies hash, sets email_verified: true
  → Token deleted from DB
```

### Login Flow (Desktop)
```
User → login(email, password) in software
  → api.py → NetworkService.proxy_api("login", {email, password, hwid, persistent: true})
  → Auth worker verifies password (PBKDF2)
  → Checks/creates device record in account_devices
  → Issues JWT with client: "desktop", 90-day expiry
  → Software saves {token, account} to session.json
  → Background thread: claim-demo (10 free credits if new HWID)
```

### Generation Flow (Full Event Mode)
```
1. Guest steps up to photo booth
2. Operator selects event + prompt category + specific prompt
3. Camera countdown (3, 2, 1) → flash → capture
4. Guest confirms photo
5. Software starts background generation:
   a. Save original photo to disk (resize 0.75x)
   b. Send base64 + prompt to gen worker /generate
   c. Worker: deduct credit → upload temp to R2 → call Segmind → return base64
   d. Software: save AI result as JPEG
   e. If frame active: composite frame overlay using PIL
   f. Upload framed result to R2 (replace original)
   g. Generate QR code → save as PNG
   h. Save metadata JSON (email, duration, prompt, photoPageUrl)
   i. Update event stats
6. Screen shows result + QR code
7. Guest scans QR → kruder1.com/photo/{id} → share/download
8. Optional: enter email → send photo link via email
9. Optional: auto-print if enabled
```

### Purchase Flow
```
1. User selects plan (website or software)
2. Software/website calls /create-checkout-session with priceId
3. Auth worker creates Stripe Checkout Session
4. User redirected to Stripe → completes payment
5. Stripe sends webhook to auth worker
6. Worker: verify signature → check idempotency → add credits (RPC)
7. Worker: record purchase → send confirmation email
8. User returns to dashboard → credits updated
```

---

## 30. Local Storage Structure

```
%APPDATA%/Kruder1/
├── session.json                    # {token: "jwt...", account: {id, email, credits}}
├── settings.json                   # Theme, sound, camera, printing, language
├── events/
│   └── {uuid}/
│       ├── event.json              # {id, name, createdAt, stats}
│       └── images/
│           ├── {gen_id}.jpg        # AI-generated image
│           ├── {gen_id}.json       # {email, prompt, duration, photoPageUrl}
│           └── {gen_id}_qr.png     # QR code image
├── prompts/
│   ├── prompts.json                # {categories: [...], prompts: [...]}
│   └── images/
│       └── {filename}.jpg          # Prompt thumbnails
├── frames/
│   ├── frames.json                 # {frames: [...]}
│   └── images/
│       └── {filename}.png          # Frame overlay PNGs
└── logs/
    └── kruder1_YYYY-MM-DD.txt      # Daily log files (30-day retention)
```

---

## 31. Build & Distribution

### PyInstaller Build
```bash
cd Software
pyinstaller kruder1.spec --clean --noconfirm
# Output: dist/Kruder1/ (one-folder mode)
```

**kruder1.spec key settings:**
- Entry point: `main.py`
- Data files: index.html, static/*, modules/*.html, modules/*.py
- Hidden imports: webview, PIL, qrcode, requests
- Excludes: tkinter, unittest, test, setuptools
- `console=False` — windowed mode (no terminal)
- Icon: `static/img/icon.ico`
- UPX compression enabled

### Inno Setup Installer
```bash
# Compile with ISCC (Inno Setup Compiler)
iscc installer.iss
# Output: Kruder1-Setup-1.0.0.exe (~30MB)
```

**installer.iss key settings:**
- App name: Kruder 1
- Install dir: `{autopf}\Kruder1`
- Icon: `.ico` format (not .png!)
- Creates desktop shortcut
- Uninstaller included

### Distribution via R2
```bash
# Upload installer
wrangler r2 object put kruder1-bucket/releases/Kruder1-Setup-1.0.0.exe --file=Output/Kruder1-Setup-1.0.0.exe --remote

# Update manifest
wrangler r2 object put kruder1-bucket/releases/latest.json --file=latest.json --remote
```

**latest.json format:**
```json
{
    "version": "1.0.0",
    "url": "releases/Kruder1-Setup-1.0.0.exe",
    "date": "2026-03-02",
    "notes": "Security hardening, status page, FAQ updates"
}
```

### Update Flow
1. Software checks `/check-software-update` (gen worker reads `releases/latest.json` from R2)
2. Compares semver with current `APP_VERSION`
3. If newer: show update prompt
4. Download to `~/Downloads/` with SHA-256 verification
5. Launch installer → installs over existing installation

### Important Build Notes
- **Python 3.10.0** has a `dis.py` IndexError bug — must be patched at system level
- Icon must be `.ico` format for Inno Setup (not .png)
- R2 uploads require `--remote` flag with wrangler

---

## 32. Environment Variables

### kruder1-auth Worker
```
SUPABASE_URL              # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY # Supabase service role key (bypasses RLS)
JWT_SECRET                # HMAC key for JWT signing
STRIPE_SECRET_KEY         # Stripe secret key
STRIPE_WEBHOOK_SECRET     # Stripe webhook signing secret
STRIPE_PRICE_ID_BASIC     # Stripe price ID for Basic plan
STRIPE_PRICE_ID_PLUS      # Stripe price ID for Plus plan
STRIPE_PRICE_ID_PRO       # Stripe price ID for Pro plan
STRIPE_SUCCESS_URL        # Success redirect URL
STRIPE_CANCEL_URL         # Cancel redirect URL
BREVO_API_KEY             # Brevo API key
BREVO_FROM_EMAIL          # Sender email address
AUTH_BASE_URL             # Base URL for email links (https://kruder1.com)
```

**KV Binding:** `RATE_LIMIT` → KV namespace for rate limiting

### kruder1-gen Worker
```
SUPABASE_URL              # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY # Supabase service role key
JWT_SECRET                # HMAC key for JWT verification
SEGMIND_API_KEY           # Segmind API key
BREVO_API_KEY             # Brevo API key
BREVO_FROM_EMAIL          # Sender email address
R2_PUBLIC_URL             # Public R2 URL (https://media.kruder1.com)
AUTH_BASE_URL             # Base URL for email links
```

**R2 Binding:** `BUCKET` → R2 bucket `kruder1-bucket`
**KV Binding:** `RATE_LIMIT` → KV namespace for rate limiting

### kruder1-landing Worker
```
PAGES_ORIGIN    # Cloudflare Pages URL (https://kruder1-landing.pages.dev)
MEDIA_BASE_URL  # R2 public URL (https://media.kruder1.com)
```

### Worker Deployment
```bash
# No npm/package.json — deployed directly with wrangler
wrangler deploy --name kruder1-auth workers/kruder1-auth.js
wrangler deploy --name kruder1-gen workers/kruder1-gen.js
wrangler deploy --name kruder1-landing workers/kruder1-landing.js
```

---

## 33. URLs & Endpoints

### Public URLs
| URL | Service |
|-----|---------|
| https://kruder1.com | Main website |
| https://www.kruder1.com | Redirect to main |
| https://media.kruder1.com | R2 public access |
| https://kruder1.com/photo/{id} | Photo share page |
| https://kruder1.com/status.html | System status page |

### Worker URLs
| URL | Worker |
|-----|--------|
| https://kruder1-auth.kruder1-master.workers.dev | Auth worker |
| https://kruder1-gen.kruder1-master.workers.dev | Gen worker |
| https://kruder1-landing.kruder1-master.workers.dev | Landing worker |

### Internal URLs
| URL | Purpose |
|-----|---------|
| http://127.0.0.1:8765 | Local HTTP server |
| http://127.0.0.1:8765/index.html | SPA entry point |
| http://127.0.0.1:8765/api/* | API proxy |

---

## 34. Project File Structure

```
Kruder 1 - Official/
├── CLAUDE.md                        # AI context file
├── Software/                        # Desktop app (source of truth for design)
│   ├── main.py                      # Entry point
│   ├── router.py                    # HTTP server (port 8765)
│   ├── api.py                       # NativeApi bridge (pywebview js_api)
│   ├── config.py                    # Settings + APP_VERSION
│   ├── utils.py                     # DataService, SecurityService, NetworkService
│   ├── log_service.py               # Logging with daily rotation
│   ├── index.html                   # SPA shell
│   ├── requirements.txt             # Python dependencies
│   ├── kruder1.spec                 # PyInstaller build spec
│   ├── build.bat                    # Build script
│   ├── installer.iss                # Inno Setup installer script
│   ├── modules/
│   │   ├── __init__.py              # Lazy module loading
│   │   ├── auth.py + auth.html
│   │   ├── dashboard.py + dashboard.html
│   │   ├── events.py + events.html
│   │   ├── eventmode.py + eventmode.html
│   │   ├── promptlab.py + promptlab.html
│   │   ├── frames.py + frames.html
│   │   └── settings.py + settings.html
│   └── static/
│       ├── css/app.css              # Single stylesheet (design tokens)
│       ├── css/fonts.css            # Font definitions
│       ├── css/all.min.css          # Font Awesome
│       ├── js/i18n.js               # i18n engine
│       ├── locales/                 # 10 language JSON files
│       ├── fonts/                   # Barlow + Inter
│       ├── sounds/                  # 10 sound effect files
│       └── img/                     # Icons, logos, frames, test print
├── Website/
│   ├── kruder1-landing/             # Static site (Cloudflare Pages)
│   │   ├── index.html               # Landing page + FAQ
│   │   ├── pricing.html             # Credit packages
│   │   ├── login.html               # Auth forms
│   │   ├── dashboard.html           # User panel
│   │   ├── faqs.html                # FAQ page
│   │   ├── contact.html             # Contact
│   │   ├── privacy.html             # Privacy policy
│   │   ├── terms.html               # Terms
│   │   ├── verify-email.html        # Email verification
│   │   ├── reset-password.html      # Password reset
│   │   ├── status.html              # System status
│   │   ├── style.css                # Website stylesheet
│   │   ├── main.js                  # Shared JS (i18n, theme, grid canvas)
│   │   ├── _headers                 # Cloudflare Pages headers (CSP)
│   │   └── img/                     # Website images
│   └── workers/
│       ├── kruder1-auth.js          # Auth + payments worker
│       ├── kruder1-gen.js           # Generation + R2 worker
│       └── kruder1-landing.js       # Photo pages + proxy worker
└── Docs/
    ├── Brand-Guide.md               # Brand identity + design system
    ├── Architecture.md              # Technical architecture (Spanish)
    ├── AI-Provider-Decision.md      # AI provider evaluation
    ├── Stripe-Webhook-Setup.md      # Stripe config
    ├── KRUDER1-Complete-Reference.md # THIS FILE
    ├── sensitive/                   # API keys (gitignored)
    └── logo/                        # Brand assets
```

---

## 35. Known Issues & Notes

### Python 3.10.0 dis.py Bug
Python 3.10.0 has an IndexError bug in `dis.py` that affects PyInstaller. Must be patched at the system level before building.

### Segmind Rate Limits
The Segmind API can return 429 (Too Many Requests) during high load. The retry logic handles this with 5 attempts and exponential backoff delays.

### Generation Times
- Typical: 25-40 seconds per image
- Complex prompts or more people: up to 90 seconds
- More people in photo = lower accuracy, longer processing

### Group Photos
- Best results: 1-2 people (maximum detail and accuracy)
- Supports: up to 4-5 people (results vary, processing longer)
- AI accuracy decreases with more faces

### Credit System
- Credits deducted BEFORE generation (prevents negative balance race conditions)
- Refunded automatically on generation failure
- Atomic operations via PostgreSQL RPC functions

### Frame Overlay
- Only PNG files with transparency supported
- Frame is resized to match the AI result dimensions
- Composited using PIL `alpha_composite` (preserves transparency)
- Framed version uploaded to R2 to replace original

### Data Safety
- All file deletions use Windows Recycle Bin (recoverable)
- JSON files saved atomically (temp file → rename)
- Session tokens stored locally in session.json
- No sensitive data logged (passwords, tokens, base64 all redacted)

### No npm
The entire project uses vanilla JavaScript. No npm, no webpack, no build tools for the frontend. Cloudflare Workers are deployed directly with `wrangler` CLI.

### Internationalization
10 languages supported in the desktop app, 2 (EN/ES) on the website. Language preference persisted in settings.json (app) or localStorage (website).

### CSP Headers
Website uses Content Security Policy headers configured in `_headers` file for Cloudflare Pages.

---

> **This document was generated to serve as a complete reconstruction reference. With this document, the CLAUDE.md file, and the Brand-Guide.md, an AI assistant should have sufficient context to rebuild the entire Kruder 1 project from scratch.**
