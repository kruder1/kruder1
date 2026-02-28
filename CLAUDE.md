# KRUDER 1

## Owner
Solo vibe-coder, not a professional developer. 14+ years running photo booths at real events. Building everything with AI assistance.

## What It Does
AI-powered photo booth software for Windows. Credit-based model (1 credit = 1 AI image). Free software, paid credits. No subscriptions, no expiration.

- **AI Model**: Seedream 4.5 (ByteDance) via Segmind API
- **Credit Packages**: Basic 150/$40 | Plus 300/$60 | Pro 600/$90
- **Demo**: 10 free credits per verified account (one per HWID)

## Architecture

```
Desktop App (pywebview + Python)
    ↓ HTTPS
3 Cloudflare Workers (auth, gen, landing)
    ↓
Supabase (DB) + R2 (storage) + Stripe (payments) + Segmind (AI) + Brevo (email)
```

## Project Structure

```
Software/                    ← Desktop app (source of truth for design)
├── main.py                  ← Entry point
├── router.py                ← HTTP server (port 8765)
├── api.py                   ← NativeApi bridge (pywebview js_api)
├── config.py                ← Settings + APP_VERSION
├── utils.py                 ← DataService, SecurityService, NetworkService
├── log_service.py           ← Logging with daily rotation
├── index.html               ← SPA shell
├── modules/                 ← Feature modules (py + html pairs)
│   ├── auth.{py,html}
│   ├── dashboard.{py,html}
│   ├── events.{py,html}
│   ├── eventmode.{py,html}
│   ├── promptlab.{py,html}
│   ├── frames.{py,html}
│   └── settings.{py,html}
├── static/
│   ├── css/app.css          ← Single stylesheet (design tokens here)
│   ├── js/i18n.js           ← Internationalization engine
│   ├── locales/{lang}.json  ← 10 languages
│   ├── fonts/               ← Barlow + Inter
│   ├── sounds/              ← UI sound effects
│   └── img/                 ← Icons, logos, frames
├── kruder1.spec             ← PyInstaller build spec
├── build.bat                ← Build script
└── installer.iss            ← Inno Setup installer script

Website/
├── kruder1-landing/         ← 10 HTML pages (Cloudflare Pages)
│   ├── index.html           ← Landing / hero
│   ├── pricing.html         ← Credit packages + Stripe checkout
│   ├── login.html           ← Login / register / forgot password
│   ├── dashboard.html       ← User panel (credits, purchases, download)
│   ├── faqs.html            ← FAQ accordion
│   ├── contact.html         ← Contact info
│   ├── privacy.html         ← Privacy policy
│   ├── terms.html           ← Terms & conditions
│   ├── verify-email.html    ← Email verification
│   └── reset-password.html  ← Password reset
└── workers/
    ├── kruder1-auth.js      ← Auth, payments, credits
    ├── kruder1-gen.js       ← AI generation, email, prompts sync
    └── kruder1-landing.js   ← Photo pages, pass-through to Pages

Docs/
├── Brand-Guide.md           ← Brand identity + design system
├── Architecture.md          ← Full technical architecture
├── AI-Provider-Decision.md  ← AI provider evaluation + stress tests
├── Stripe-Webhook-Setup.md  ← Stripe webhook config
├── KRUDER1-Manual.md        ← Software user manual (to be created)
├── sensitive/               ← API keys (gitignored)
└── logo/                    ← Brand assets
```

## Design System (Source of Truth: `Software/static/css/app.css`)

- **Fonts**: Barlow (headings/buttons) + Inter (inputs)
- **Colors**: Pure B&W + accent `#F25606` (orange) / `#b33f04` (dark)
- **Borders**: `2px solid`, radius `0.5rem`
- **Buttons**: `4px` drop shadow, press animation (scale + shadow reduction)
- **Effects**: CRT scanlines overlay + particles.js background
- **Themes**: Light (black on white) and Dark (white on black), accent stays same

## Code Conventions

### Frontend (HTML/CSS/JS)
- SPA with `loadModule(name)` — loads HTML into `#module-container`
- Global state: `window.AppState` (currentModule, session, theme, language)
- Module handlers: `window.moduleHandlers` (click, keydown, change events)
- i18n: `data-i18n` attributes + `t(key)` function
- API returns: `{ok: true, ...}` or `{error: "message"}`
- Virtual keyboard: `initKeyboard(opts)` for kiosk-mode inputs

### Backend (Python)
- All module methods return `{ok: true}` or `{error: "msg"}`
- NativeApi in `api.py` uses lazy-loaded module instances
- Background threads for long operations (generation, printing)
- Local data in `%APPDATA%/Kruder1/`

### Workers (Cloudflare)
- Deployed via `wrangler` CLI (no npm/package.json)
- Auth: PBKDF2-SHA256 + JWT (HS256)
- Desktop tokens: ~long-lived with HWID validation
- Web tokens: 7-day expiry

## Build & Distribution
- **PyInstaller**: `pyinstaller kruder1.spec --clean --noconfirm` (one-folder mode)
- **Inno Setup**: Compile `installer.iss` with ISCC
- **Updates**: `releases/latest.json` + installer on Cloudflare R2
- **Python**: 3.10 (dis.py patched for IndexError bug)

## Important Notes
- Never expose API keys in client code — all secrets live in Cloudflare Workers env vars
- The Software's visual design is the source of truth — website must match
- Single CSS file (`app.css`) — no CSS frameworks
- No npm in the project — vanilla JS everywhere
