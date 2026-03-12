# KRUDER 1

## Owner
Solo vibe-coder, not a professional developer. 14+ years running photo booths at real events. Building everything with AI assistance.

## What It Does
AI-powered photo booth software for Windows. Credit-based model (1 credit = 1 AI image). Free software, paid credits. No subscriptions, no expiration.

- **AI Model**: Nano Banana 2 / Gemini 3.1 Flash Image (Google) via Segmind API
- **Credit Packages**: Basic 150/$40USD - $750MXN | Plus 300/$75USD - $1,350MXN | Pro 600/$120USD - $2,400MXN
- **Demo**: 10 free credits per verified account (one per HWID)

## Architecture

```
Desktop App (pywebview + Python)
    ↓ HTTPS
4 Cloudflare Workers (auth, gen, landing, admin)
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
├── kruder1-landing/         ← Cloudflare Pages: kruder1.com, kruder.uno, kruder.one
│   ├── index.html           ← Landing / hero
│   ├── pricing.html         ← Credit packages + Stripe checkout
│   ├── login.html           ← Login / register / forgot password
│   ├── dashboard.html       ← User panel (credits, purchases, download)
│   ├── faqs.html            ← FAQ accordion
│   ├── contact.html         ← Contact info
│   ├── privacy.html         ← Privacy policy
│   ├── terms.html           ← Terms & conditions
│   ├── verify-email.html    ← Email verification
│   ├── reset-password.html  ← Password reset
│   ├── manual.html          ← Software user manual
│   ├── status.html          ← System status page
│   ├── main.js              ← Shared website JS (KRUDER global)
│   └── style.css            ← Website stylesheet
├── kruder1-admin/           ← Cloudflare Pages: admin.kruder1.com
│   └── index.html           ← Admin dashboard (single-page)
├── workers/
│   ├── kruder1-landing.js   ← Photo pages only (/photo/* routes)
│   ├── kruder1-auth.js      ← Auth, payments, credits
│   ├── kruder1-gen.js       ← AI generation, email, prompts sync
│   ├── kruder1-admin.js     ← Admin API (stats, users, credits)
│   ├── wrangler-landing.toml
│   ├── wrangler-auth.toml
│   ├── wrangler-gen.toml
│   └── wrangler-admin.toml
├── deploy.sh                ← Manual deploy script (backup)
└── .github/workflows/deploy.yml ← Auto-deploy on push

Docs/
├── Brand-Guide.md           ← Brand identity + design system
├── Architecture.md          ← Full technical architecture
├── AI-Provider-Decision.md  ← AI provider evaluation + stress tests
├── Stripe-Webhook-Setup.md  ← Stripe webhook config
├── sensitive/               ← API keys (gitignored)
└── logo/                    ← Brand assets
```

## Deployment (Auto via GitHub Actions)

**Push to `master` → everything deploys automatically.** No manual steps needed.

The workflow (`.github/workflows/deploy.yml`) triggers on push to `master` when `Website/**` files change. It deploys:
- 2 Cloudflare Pages sites (landing + admin)
- 4 Cloudflare Workers (landing, auth, gen, admin)

GitHub Secrets (already configured):
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account
- `CLOUDFLARE_API_TOKEN` — API token with Workers + Pages edit permissions

### Domains & Routing

| Domain | Points to | Notes |
|--------|-----------|-------|
| `kruder1.com` | Pages direct | Same as all other domains |
| `kruder1.com/photo/*` | Landing Worker | Only photo routes go through worker |
| `kruder.uno` | Pages direct | |
| `kruder.one` | Pages direct | |
| `admin.kruder1.com` | Admin Pages direct | |

**All domains point directly to Cloudflare Pages.** The `kruder1-landing` worker only handles `/photo/*` routes (photo sharing pages + download).

### Cloudflare Pages Projects

| Project | Directory | Production Branch | Domains |
|---------|-----------|-------------------|---------|
| `kruder1-landing` | `Website/kruder1-landing/` | `master` | kruder1.com, kruder.uno, kruder.one |
| `kruder1-admin` | `Website/kruder1-admin/` | `master` | admin.kruder1.com |

### Manual Deploy (backup)

If GitHub Actions isn't working, use `Website/deploy.sh`:
```bash
cd Website
./deploy.sh              # Deploy everything
./deploy.sh landing      # Landing only (Pages + Worker)
./deploy.sh admin        # Admin only (Pages + Worker)
```

### Worker Environment Variables (Cloudflare Dashboard)

Workers have secrets configured in the Cloudflare dashboard (not in code):
- **kruder1-landing**: `MEDIA_BASE_URL`
- **kruder1-auth**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **kruder1-gen**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `SEGMIND_API_KEY`, `BREVO_API_KEY`
- **kruder1-admin**: `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`

## Design System (Source of Truth: `Software/static/css/app.css`)

- **Fonts**: Barlow (headings/buttons) + Inter (inputs)
- **Colors**: Monochrome (pure B&W), no accent color
- **Borders**: `2px solid`, radius `0.5rem`
- **Buttons**: Flat, no drop shadows
- **Background**: Animated grid canvas with dot particles traveling along grid lines
- **Decorative**: Corner crosshairs (`+`) fixed at all 4 corners
- **Themes**: Light (`#FFFFFF` bg, `#000000` text) and Dark (`#000000` bg, `#FFFFFF` text)

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
- Each worker has its own `wrangler-{name}.toml` in `Website/workers/`
- Auth: PBKDF2-SHA256 + JWT (HS256)
- Desktop tokens: ~long-lived with HWID validation
- Web tokens: 7-day expiry
- CORS: Each worker has `ALLOWED_ORIGINS` array — update when adding new domains

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
- **NEVER use worktrees** — always work directly on `master` branch
- When deploying website changes: just commit and push, GitHub Actions handles the rest
- Pages production branch is `master` — GitHub Action deploys with `--branch=master`
