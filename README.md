# Kruder 1

AI-powered photo booth software for Windows. Turn any PC and webcam into a professional AI photo booth for events.

**Free software. Pay only for credits. No subscriptions.**

## Overview

Kruder 1 captures a photo of your guest, sends it to an AI model, and returns a stylized image in seconds. Guests can share via email, QR code, or print on the spot.

- **AI Model**: Seedream 4.5 via Segmind API
- **Credit System**: 1 credit = 1 AI image (no expiration)
- **Packages**: Basic 150/$40USD - $750MXN | Plus 300/$75USD - $1,350MXN | Pro 600/$120USD - $2,400MXN
- **Free Demo**: 10 credits per verified account
- **New prompt categories added monthly**

## Features

- AI image generation with customizable prompt categories
- Hand gesture capture (raise hand to trigger photo)
- Custom PNG frame overlays (2:3 ratio, auto-resize)
- Built-in photo printing support
- QR code and email sharing
- Event management with gallery
- Import/export event data (.kruder1 format)
- Kiosk mode with PIN lock
- Fullscreen with edge swipe blocking
- 10 languages (EN, ES, FR, DE, IT, PT, RU, ZH, JA, AR)
- Light and dark themes

## Architecture

```
Desktop App (pywebview + Python)
    |
    v  HTTPS
Cloudflare Workers (auth, gen, landing, admin)
    |
    v
Supabase (DB) + R2 (storage) + Stripe (payments) + Segmind (AI) + Brevo (email)
```

## Project Structure

```
Software/               Desktop app (Python + vanilla JS SPA)
  main.py               Entry point
  router.py             Local HTTP server (port 8765)
  api.py                pywebview JS bridge
  config.py             Settings + version
  utils.py              DataService, SecurityService, NetworkService
  index.html            SPA shell
  modules/              Feature modules (py + html pairs)
  static/css/app.css    Single stylesheet (design source of truth)
  static/js/i18n.js     Internationalization engine
  static/locales/       10 language files

Website/
  kruder1-landing/      Public website (kruder1.com)
  kruder1-admin/        Admin dashboard (admin.kruder1.com)
  workers/              4 Cloudflare Workers

Docs/                   Documentation
  Architecture.md       Full technical architecture
  Brand-Guide.md        Brand identity + design system
  KRUDER1-Manual.md     Software user manual
  Database-Schema.md    Supabase schema
```

## Requirements

### Desktop App
- Windows 10/11
- Python 3.10
- Webcam
- Internet connection

### Development
- Python 3.10 (system-level `dis.py` patch for IndexError bug)
- Node.js (for Wrangler CLI / Cloudflare Workers)
- PyInstaller (build)
- Inno Setup (installer)

## Setup

### Desktop App

```bash
cd Software
pip install -r requirements.txt
python main.py
```

### Workers (local dev)

```bash
cd Website/workers
npx wrangler dev --config wrangler-auth.toml
```

## Build & Distribution

```bash
# Build executable
cd Software
pyinstaller kruder1.spec --clean --noconfirm

# Create installer (Inno Setup)
iscc installer.iss
```

Updates are distributed via `releases/latest.json` + installer hosted on Cloudflare R2.

## Deployment

Push to `master` triggers GitHub Actions to deploy all Cloudflare Pages sites and Workers automatically.

```bash
# Manual deploy (backup)
cd Website
./deploy.sh              # Deploy everything
./deploy.sh landing      # Landing only
./deploy.sh admin        # Admin only
```

### Domains

| Domain | Service |
|--------|---------|
| kruder1.com | Landing (Pages) |
| kruder.uno | Landing (Pages) |
| kruder.one | Landing (Pages) |
| admin.kruder1.com | Admin (Pages) |

## Design System

- **Fonts**: Barlow (headings/buttons) + Inter (inputs)
- **Colors**: Monochrome (pure B&W), no accent colors
- **Background**: Animated grid canvas with traveling dot particles
- **Decorative**: Corner crosshairs at all 4 viewport corners
- **Themes**: Light (#FFFFFF bg) and Dark (#000000 bg)

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Desktop app | Python 3.10, pywebview |
| Frontend | Vanilla JS, single CSS file |
| Backend | Cloudflare Workers |
| Database | Supabase (PostgreSQL) |
| Storage | Cloudflare R2 |
| Payments | Stripe |
| AI | Segmind API (Seedream 4.5) |
| Email | Brevo |
| Auth | PBKDF2-SHA256 + JWT (HS256) |

## License

Proprietary. All rights reserved.

## Contact

hola@kruder1.com
