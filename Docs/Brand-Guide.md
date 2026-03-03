# KRUDER1 — Brand Guide

> Consolidated brand document: narrative, positioning, identity, and design system.

---

## 1. What Is Kruder1

Kruder1 is the **core brand and software platform** — not the hardware, not the physical booth, not the event.

It is:
- The system
- The brain
- The platform

Everything else (hardware, workflows, event experiences) runs **on top of Kruder1**.

Kruder1 is an AI-powered photo booth software for Windows, built on a credit-based model. The software is free to download and install. Revenue comes from credit sales (1 credit = 1 AI-generated image). No subscriptions. No expiration. No fine print.

---

## 2. Brand Naming

### "Kruder"
- Strong, industrial, Germanic sound
- Does not describe the product (intentional)
- Not emotional or "startup friendly"
- Feels like system, machine, core

It doesn't try to say *what it does*. It says *how serious it is*.

### The "1"
The number is structural, not decorative:
- Unity, origin, core, base version, primary system
- Works equally in Spanish ("Kruder uno") and English ("Kruder one")
- Visual identity: technical, clean, systematic — aviation / automotive / Kubrick

### Domain
- **kruder1.com** — the number reduces conflicts and increases distinctiveness
- Works well for subdomains: api.kruder1.com, media.kruder1.com

### Hardware (Future)
- Software/Brand: **Kruder1**
- Physical booth: **Monolith** (Monolith Mk I, Monolith Zero)
- Clear hierarchy: Kruder1 is the system, Monolith is the container

---

## 3. Brand Positioning

Kruder1 exists for photo booth owners who understand one thing: the problem is not the booth — the problem is competing with the same offer as everyone else.

Kruder1 does not help you lower prices. It gives you something worth charging more for. This is not a tool to survive the market. It is a tool to exit the price war.

### Target Audience

**Core client:**
- Photo booth owner (business owner, not employee)
- Tired of competing on price, frustrated by generic offers
- Commercial mindset (seller, not technician)
- Not afraid to invest if ROI is clear
- Wants to be early, not late

**Non-ideal client (self-filtered):**
- People looking for the cheapest option
- Anyone copying what everyone else does
- Those who need excessive hand-holding

Kruder1 does not reject them. They reject themselves.

### The Enemy (Ideological)
- Price wars
- Generic photo booth experiences
- Overcomplicated, poorly designed software
- The mindset of "this is how it's always been done"

---

## 4. Brand Promise

**Kruder1 promises:**
- Real differentiation (not marketing noise)
- Radical simplicity (fast to understand, easy to use)
- A tool that changes the client conversation
- Higher perceived value

**Kruder1 does NOT promise:**
- Automatic clients
- Guaranteed bookings
- Overnight success

### Relationship With Money

> It's not expensive. It's profitable if you know how to sell.

Kruder1 is not measured by its price, but by what it allows you to charge.

---

## 5. Brand Personality & Voice

### Kruder1 Is
Confident. Calm. Direct. Elegant. Functional. Built from 14+ years of real-world photo booth experience.

### Kruder1 Is Not
A generic startup. "AI buzzword" marketing. Aggressive sales-driven. Empty hype. Over-explanatory.

### Voice
- Confident and calmly dominant
- Never defensive, never apologetic, never needy

### Tone
- Direct, filters clients naturally
- Subtly challenges ego
- Premium without saying "premium"

> If it sounds like it's trying to convince, it's wrong.

---

## 6. Anchor Phrases

- **You don't sell photos. You sell differentiation.**
- **The photo booth isn't the problem. Offering the same thing as everyone else is.**
- **Kruder1 doesn't get you clients. It gives you something worth paying more for.**
- **It's not for everyone. And that's part of the value.**

---

## 7. Exclusivity Communication

Never communicate hard limits or numbers. Always communicate exclusivity as intent:
- "Not mass-market"
- "Not for everyone"
- "Designed for those who understand differentiation"
- "We're not chasing volume"

---

## 8. Language Strategy

- English is the primary language (structure, headlines)
- Spanish is equally important, not a poor translation
- Both languages must sound natural, confident, and premium
- Avoid cheap Spanglish and literal translations without intent

---

## 9. Manifesto

Kruder1 isn't for everyone. And it was never meant to be.

We don't believe in competing on price. We believe in offering something that's noticed, remembered, and worth paying for.

The photo booth isn't dead. It's saturated with the same experience.

Built by people with over 14 years of real-world experience running photo booths at real events.

One credit. One image. No subscriptions. No expiration. No fine print.

If you're tired of the price war, you're in the right place. If you're not, Kruder1 probably isn't for you.

---

## 10. Aesthetic Influence

Inspirations (not literal):
- 2001: A Space Odyssey / Kubrick
- Monolith
- Swiss / International Style
- Operating room precision

Core concepts: cleanliness, monochrome, precision, quiet power, emotional neutrality.

Kruder1 doesn't "sell fun." It sells control, system, transformation.

---

## 11. Design System (Source of Truth: Software)

The desktop application (`Software/static/css/app.css`) is the **source of truth** for all visual design. The website and all other materials must be coherent with these tokens.

### Typography
| Role | Font | Usage |
|------|------|-------|
| Headings & Buttons | **Barlow** | Primary font for all UI text |
| Inputs & Body | **Inter** | Secondary font for form inputs |

### Color Palette

**Light Theme:**
| Token | Value | Usage |
|-------|-------|-------|
| `--theme-ink` | `#000000` | Text, borders, icons |
| `--theme-paper` | `#FFFFFF` | Backgrounds |
| `--theme-border` | `#000000` | Borders |
| `--theme-input-bg` | `#FFFFFF` | Input backgrounds |
| `--color-error` | `#ff3333` | Error states |

**Dark Theme:**
| Token | Value |
|-------|-------|
| `--theme-ink` | `#FFFFFF` |
| `--theme-paper` | `#000000` |
| `--theme-border` | `#FFFFFF` |
| `--theme-input-bg` | `#000000` |

Fully monochrome — no accent colors. Both themes use only black and white.

### Dimensions & Spacing
| Token | Value |
|-------|-------|
| `--radius-main` | `0.5rem` (8px) |
| `--width-border` | `2px` |
| `--border-main` | `2px solid var(--theme-ink)` |
| `--dim-btn-height` | `60px` |
| Shadows | `none` (flat design) |

### Effects
- **Animated grid canvas**: Full-viewport grid with dot particles traveling along grid lines
- **Button press**: Active state with scale animation
- No scanlines, no CRT effects, no particles.js

### Key Principles
- Pure black & white (no grays for main surfaces)
- Fully monochrome — no accent colors
- 2px solid borders everywhere
- 0.5rem border radius (not 12px, not rounded)
- Flat buttons with no drop shadow
- Pure monochrome = visual identity

---

## 12. Long-Term Vision

Kruder1 will be known as the brand that raised the photo booth standard, with beautifully designed, highly functional products made for owners who understand return on investment.

---

## 13. Credit System

| Plan | Credits | Price (USD) |
|------|---------|-------------|
| Basic | 150 | $40 |
| Plus | 300 | $60 |
| Pro | 600 | $90 |

- Demo: 10 free credits per verified account (one-time per HWID)
- 1 credit = 1 AI-generated image
- No subscriptions, no expiration

---
