# Stripe Webhook - URL y Configuración

## URL del webhook

**URL:** `https://kruder1-auth.kruder1-master.workers.dev/stripe-webhook`

## Cómo configurarla en Stripe

1. Entra en [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. **Add endpoint**
3. **Endpoint URL:** pega la URL de arriba
4. **Events to send:** selecciona `checkout.session.completed`
5. Guarda y copia el **Signing secret** (empieza con `whsec_`)
6. Actualiza la variable `STRIPE_WEBHOOK_SECRET` en Cloudflare Workers con ese valor

## Cambio a producción

Cuando pases a Stripe en modo LIVE:

1. **Variables en Cloudflare Workers:**
   - `STRIPE_SECRET_KEY` → tu clave secreta LIVE (`sk_live_...`)
   - `STRIPE_WEBHOOK_SECRET` → el signing secret del webhook **LIVE** (crea uno nuevo en Stripe)
   - `STRIPE_PRICE_ID_BASIC`, `STRIPE_PRICE_ID_PLUS`, `STRIPE_PRICE_ID_PRO` → los IDs de precios LIVE

2. **Frontend (pricing.html):**  
   Actualiza los `data-price-id` en los botones de compra con los nuevos price IDs de producción.

3. **Stripe Dashboard:**  
   Crea un nuevo webhook en modo LIVE apuntando a la misma URL.
