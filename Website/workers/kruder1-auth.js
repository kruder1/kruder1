/**
 * Kruder1 Auth Worker
 * Routes: register, login, verify-email, forgot-password, reset-password, claim-demo, me, create-checkout-session, stripe-webhook, purchases
 */

function getPriceToCredits(env) {
  const basic = env.STRIPE_PRICE_ID_BASIC || "price_1SlhwWGae0bQUD5hdQ60UHmJ";
  const plus = env.STRIPE_PRICE_ID_PLUS || "price_1SlhwyGae0bQUD5hsSeTuRhF";
  const pro = env.STRIPE_PRICE_ID_PRO || "price_1SlhxaGae0bQUD5h12SGTNLw";
  return { [basic]: 150, [plus]: 300, [pro]: 600 };
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-HWID",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function err(message, status = 400) {
  return json({ error: message }, status);
}

function base64url(buf) {
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return new Uint8Array(bits);
}

async function hashPasswordForStorage(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await hashPassword(password, salt);
  const combined = new Uint8Array(salt.length + hash.length);
  combined.set(salt, 0);
  combined.set(hash, salt.length);
  return btoa(String.fromCharCode(...combined));
}

async function verifyPassword(password, stored) {
  const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
  const salt = combined.slice(0, 16);
  const expected = combined.slice(16);
  const hash = await hashPassword(password, salt);
  return hash.length === expected.length && hash.every((b, i) => b === expected[i]);
}

function sha256Hex(str) {
  return crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(str))
    .then((b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""));
}

async function signJwt(payload, secret, expiresInSec = 86400 * 7) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSec };
  const enc = new TextEncoder();
  const h = base64url(enc.encode(JSON.stringify(header)));
  const p = base64url(enc.encode(JSON.stringify(body)));
  const data = `${h}.${p}`;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return `${data}.${base64url(sig)}`;
}

async function verifyJwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const data = `${parts[0]}.${parts[1]}`;
  const sig = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) =>
    c.charCodeAt(0)
  );
  const ok = await crypto.subtle.verify("HMAC", key, sig, enc.encode(data));
  if (!ok) return null;
  const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

async function validateDesktopToken(request, payload, env) {
  if (payload.client !== "desktop") return null;
  const origin = request.headers.get("Origin") || request.headers.get("Referer") || "";
  const isWeb = origin && (origin.startsWith("https://") || /kruder1\.com|workers\.dev/i.test(origin));
  if (isWeb) return err("Desktop token cannot be used from web", 403);
  const hwid = request.headers.get("X-HWID")?.trim();
  if (!hwid) return err("HWID required for desktop session", 401);
  const rows = await supabaseSelect(
    env,
    "account_devices",
    `account_id=eq.${encodeURIComponent(payload.sub)}&hwid=eq.${encodeURIComponent(hwid)}`
  );
  if (!rows?.length) return err("Device not authorized for this account", 403);
  return null;
}

async function supabase(env, path, opts = {}) {
  const url = `${env.SUPABASE_URL}/rest/v1${path}`;
  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...opts.headers,
  };
  const res = await fetch(url, {
    ...opts,
    headers: { ...headers, ...opts.headers },
  });
  return res;
}

async function supabaseInsert(env, table, data) {
  const res = await supabase(env, `/${table}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || res.statusText);
  }
  return res.json();
}

async function supabaseSelect(env, table, query = "") {
  const res = await supabase(env, `/${table}?${query}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supabaseUpdate(env, table, idCol, idVal, data) {
  const res = await supabase(env, `/${table}?${idCol}=eq.${idVal}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

async function supabaseDelete(env, table, query) {
  const res = await supabase(env, `/${table}?${query}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

async function sendBrevoEmail(env, { to, subject, htmlContent }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Kruder1", email: env.BREVO_FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function randomToken() {
  return [...crypto.getRandomValues(new Uint8Array(32))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(str) {
  return typeof str === "string" && str.length > 0 && EMAIL_REGEX.test(str.trim());
}

function isValidPassword(str) {
  if (typeof str !== "string" || str.length < 6) return false;
  return /\d/.test(str);
}

const EMAIL_TEXTS = {
  verify: {
    en: {
      subject: "Verify your Kruder1 account",
      title: "Thanks for signing up",
      body: "Click the button below to verify your email and activate your account.",
      cta: "Verify email",
      footer: "If you didn't create this account, you can ignore this email.",
    },
    es: {
      subject: "Verifica tu cuenta de Kruder1",
      title: "Gracias por registrarte",
      body: "Haz clic en el botón para verificar tu correo y activar tu cuenta.",
      cta: "Verificar correo",
      footer: "Si no creaste esta cuenta, puedes ignorar este correo.",
    },
  },
  reset: {
    en: {
      subject: "Reset your Kruder1 password",
      title: "Password reset",
      body: "Click the button below to set a new password. This link expires in 1 hour.",
      cta: "Reset password",
      footer: "If you didn't request this, you can ignore this email.",
    },
    es: {
      subject: "Restablece tu contraseña de Kruder1",
      title: "Restablecer contraseña",
      body: "Haz clic en el botón para establecer una nueva contraseña. Este enlace expira en 1 hora.",
      cta: "Restablecer contraseña",
      footer: "Si no solicitaste esto, puedes ignorar este correo.",
    },
  },
  purchase: {
    en: {
      subject: "Thank you for your purchase – Kruder1",
      title: "Thank you for your purchase",
      body: "We've added {credits} credits to your account. You can use them in the Kruder 1 software.",
      cta: "Go to dashboard",
      footer: "Enjoy creating with Kruder 1.",
    },
    es: {
      subject: "Gracias por tu compra – Kruder1",
      title: "Gracias por tu compra",
      body: "Hemos añadido {credits} créditos a tu cuenta. Puedes usarlos en el software Kruder 1.",
      cta: "Ir al panel",
      footer: "Disfruta creando con Kruder 1.",
    },
  },
};

function emailTemplate(base, { type, lang, link, texts, credits }) {
  const t = texts[lang] || texts.en;
  let body = t.body || "";
  if (credits != null) body = body.replace(/\{credits\}/g, String(credits));
  const logoUrl = `${base}/img/logo.png`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#ffffff; min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;">
          <tr>
            <td style="background-color:#ffffff; border:2px solid #000; border-radius:12px; padding:40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="padding-bottom:24px;">
                    <img src="${logoUrl}" alt="Kruder 1" width="80" height="auto" style="display:block;">
                  </td>
                </tr>
                <tr>
                  <td>
              <h1 style="margin:0 0 20px; font-size:1.75rem; font-weight:900; color:#000; text-transform:uppercase; letter-spacing:-0.02em;">${t.title}</h1>
              <p style="margin:0 0 28px; font-size:1rem; line-height:1.6; color:rgba(0,0,0,0.85);">${body}</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background:#000; border:2px solid #000; border-radius:12px;">
                    <a href="${link}" style="display:inline-block; padding:14px 32px; font-size:1.1rem; font-weight:700; color:#fff; text-decoration:none; text-transform:uppercase; letter-spacing:0.01em;">${t.cta}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0; font-size:0.85rem; color:rgba(0,0,0,0.6);">${t.footer}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0; font-size:0.8rem; color:rgba(0,0,0,0.5);">© 2026 Kruder 1</p>
              <p style="margin:4px 0 0; font-size:0.8rem;"><a href="https://kruder1.com" style="color:rgba(0,0,0,0.5); text-decoration:none;">kruder1.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS")
      return new Response(null, { headers: CORS_HEADERS });

    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "";

    try {
      if (path === "register" && request.method === "POST") {
        const { email, password, lang } = (await request.json()) || {};
        if (!email?.trim() || !password) return err("Email and password required");
        if (!isValidEmail(email)) return err("Invalid email format");
        if (!isValidPassword(password)) return err("Password must be at least 6 characters and contain a number");
        const pwHash = await hashPasswordForStorage(password);
        const rows = await supabaseSelect(
          env,
          "accounts",
          `email=eq.${encodeURIComponent(email.trim().toLowerCase())}`
        );
        if (rows?.length) return err("Email already registered", 409);
        const [acc] = await supabaseInsert(env, "accounts", {
          email: email.trim().toLowerCase(),
          password_hash: pwHash,
        });
        const token = randomToken();
        await supabaseInsert(env, "verification_tokens", {
          account_id: acc.id,
          token,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
        const base = env.AUTH_BASE_URL || url.origin;
        const verifyLink = `${base}/verify-email.html?token=${token}`;
        const emailLang = (lang === "es" || lang === "en") ? lang : "en";
        const texts = EMAIL_TEXTS.verify;
        await sendBrevoEmail(env, {
          to: email.trim(),
          subject: texts[emailLang].subject,
          htmlContent: emailTemplate(base, { type: "verify", lang: emailLang, link: verifyLink, texts }),
        });
        return json({ ok: true, message: "Check your email to verify" });
      }

      if (path === "verify-email" && request.method === "GET") {
        const token = url.searchParams.get("token");
        if (!token) return err("Token required");
        const rows = await supabaseSelect(
          env,
          "verification_tokens",
          `token=eq.${encodeURIComponent(token)}`
        );
        if (!rows?.length) return err("Invalid or expired token", 404);
        const vt = rows[0];
        if (new Date(vt.expires_at) < new Date()) {
          await supabaseDelete(env, "verification_tokens", `id=eq.${vt.id}`);
          return err("Token expired", 400);
        }
        await supabaseUpdate(env, "accounts", "id", vt.account_id, {
          email_verified: true,
        });
        await supabaseDelete(env, "verification_tokens", `id=eq.${vt.id}`);
        return json({ ok: true, message: "Email verified" });
      }

      if (path === "login" && request.method === "POST") {
        const { email, password, hwid, persistent } = (await request.json()) || {};
        if (!email?.trim() || !password) return err("Email and password required");
        if (!isValidEmail(email)) return err("Invalid email format");
        const rows = await supabaseSelect(
          env,
          "accounts",
          `email=eq.${encodeURIComponent(email.trim().toLowerCase())}`
        );
        if (!rows?.length) return err("Invalid credentials", 401);
        const acc = rows[0];
        if (!acc.email_verified) return err("Please verify your email first", 403);
        if (!(await verifyPassword(password, acc.password_hash)))
          return err("Invalid credentials", 401);
        if (hwid?.trim()) {
          const now = new Date().toISOString();
          const hw = encodeURIComponent(hwid.trim());
          const existing = await supabaseSelect(
            env,
            "account_devices",
            `account_id=eq.${acc.id}&hwid=eq.${hw}`
          );
          if (existing?.length) {
            await supabase(
              env,
              `/account_devices?account_id=eq.${acc.id}&hwid=eq.${hw}`,
              { method: "PATCH", body: JSON.stringify({ last_seen_at: now }) }
            );
          } else {
            await supabaseInsert(env, "account_devices", {
              account_id: acc.id,
              hwid: hwid.trim(),
            });
          }
        }
        const expiresIn = persistent === true ? 3153600000 : 86400 * 7;
        const jwtPayload = { sub: acc.id, email: acc.email };
        if (persistent === true) jwtPayload.client = "desktop";
        const jwt = await signJwt(jwtPayload, env.JWT_SECRET, expiresIn);
        return json({
          ok: true,
          token: jwt,
          account: { id: acc.id, email: acc.email, credits: acc.credits, email_verified: acc.email_verified },
        });
      }

      if (path === "forgot-password" && request.method === "POST") {
        const { email, lang } = (await request.json()) || {};
        if (!email?.trim()) return err("Email required");
        if (!isValidEmail(email)) return err("Invalid email format");
        const rows = await supabaseSelect(
          env,
          "accounts",
          `email=eq.${encodeURIComponent(email.trim().toLowerCase())}`
        );
        if (!rows?.length) return json({ ok: true });
        const acc = rows[0];
        const token = randomToken();
        const tokenHash = await sha256Hex(token);
        await supabaseInsert(env, "password_reset_tokens", {
          account_id: acc.id,
          token_hash: tokenHash,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        });
        const base = env.AUTH_BASE_URL || url.origin;
        const resetLink = `${base}/reset-password.html?token=${token}`;
        const emailLang = (lang === "es" || lang === "en") ? lang : "en";
        const texts = EMAIL_TEXTS.reset;
        await sendBrevoEmail(env, {
          to: email.trim(),
          subject: texts[emailLang].subject,
          htmlContent: emailTemplate(base, { type: "reset", lang: emailLang, link: resetLink, texts }),
        });
        return json({ ok: true });
      }

      if (path === "reset-password" && request.method === "POST") {
        const { token, newPassword } = (await request.json()) || {};
        if (!token || !newPassword) return err("Token and new password required");
        const tokenHash = await sha256Hex(token);
        const rows = await supabaseSelect(
          env,
          "password_reset_tokens",
          `token_hash=eq.${encodeURIComponent(tokenHash)}`
        );
        if (!rows?.length) return err("Invalid or expired token", 400);
        const prt = rows[0];
        if (new Date(prt.expires_at) < new Date()) {
          await supabaseDelete(env, "password_reset_tokens", `id=eq.${prt.id}`);
          return err("Token expired", 400);
        }
        const pwHash = await hashPasswordForStorage(newPassword);
        await supabaseUpdate(env, "accounts", "id", prt.account_id, {
          password_hash: pwHash,
        });
        await supabaseDelete(env, "password_reset_tokens", `id=eq.${prt.id}`);
        return json({ ok: true });
      }

      if (path === "claim-demo" && request.method === "POST") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);
        const desktopErr = await validateDesktopToken(request, payload, env);
        if (desktopErr) return desktopErr;
        const { hwid } = (await request.json()) || {};
        if (!hwid?.trim()) return err("HWID required");
        const [acc] = await supabaseSelect(
          env,
          "accounts",
          `id=eq.${encodeURIComponent(payload.sub)}`
        );
        if (!acc) return err("Account not found", 404);
        if (!acc.email_verified) return err("Verify your email first", 400);
        const claimed = await supabaseSelect(
          env,
          "hwid_demo_claimed",
          `hwid=eq.${encodeURIComponent(hwid.trim())}`
        );
        if (claimed?.length)
          return err("This device already received demo credits", 400);
        const now = new Date().toISOString();
        await supabaseInsert(env, "hwid_demo_claimed", {
          hwid: hwid.trim(),
          account_id: acc.id,
        });
        const existingDev = await supabaseSelect(
          env,
          "account_devices",
          `account_id=eq.${acc.id}&hwid=eq.${encodeURIComponent(hwid.trim())}`
        );
        if (existingDev?.length) {
          await supabase(
            env,
            `/account_devices?account_id=eq.${acc.id}&hwid=eq.${encodeURIComponent(hwid.trim())}`,
            { method: "PATCH", body: JSON.stringify({ last_seen_at: now }) }
          );
        } else {
          await supabaseInsert(env, "account_devices", {
            account_id: acc.id,
            hwid: hwid.trim(),
          });
        }
        const newCredits = (acc.credits || 0) + 10;
        await supabaseUpdate(env, "accounts", "id", acc.id, {
          credits: newCredits,
        });
        return json({ ok: true, credits: newCredits });
      }

      if (path === "me" && request.method === "GET") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);
        const desktopErr = await validateDesktopToken(request, payload, env);
        if (desktopErr) return desktopErr;
        const [acc] = await supabaseSelect(
          env,
          "accounts",
          `id=eq.${encodeURIComponent(payload.sub)}`
        );
        if (!acc) return err("Account not found", 404);
        return json({
          id: acc.id,
          email: acc.email,
          credits: acc.credits,
          email_verified: acc.email_verified,
        });
      }

      if (path === "create-checkout-session" && request.method === "POST") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);
        const desktopErr = await validateDesktopToken(request, payload, env);
        if (desktopErr) return desktopErr;
        const body = (await request.json()) || {};
        const { priceId, lang, success_url: reqSuccessUrl, cancel_url: reqCancelUrl } = body;
        const priceToCredits = getPriceToCredits(env);
        if (!priceId || !(priceId in priceToCredits))
          return err("Invalid price", 400);
        const emailLang = (lang === "es" || lang === "en") ? lang : "en";
        const successUrl = (typeof reqSuccessUrl === "string" && reqSuccessUrl) ? reqSuccessUrl : (env.STRIPE_SUCCESS_URL || "https://kruder1.com/dashboard.html");
        const cancelUrl = (typeof reqCancelUrl === "string" && reqCancelUrl) ? reqCancelUrl : (env.STRIPE_CANCEL_URL || "https://kruder1.com/pricing.html");
        const params = new URLSearchParams({
          "mode": "payment",
          "line_items[0][price]": priceId,
          "line_items[0][quantity]": "1",
          "success_url": `${successUrl}?success=1&session_id={CHECKOUT_SESSION_ID}`,
          "cancel_url": cancelUrl,
          "client_reference_id": payload.sub,
          "metadata[price_id]": priceId,
          "metadata[lang]": emailLang,
        });
        const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });
        const stripeData = await stripeRes.json();
        if (stripeData.error) return err(stripeData.error.message || "Stripe error", 400);
        if (!stripeData.url) return err("No checkout URL", 500);
        return json({ url: stripeData.url });
      }

      if (path === "stripe-webhook" && request.method === "POST") {
        const rawBody = await request.text();
        const sig = request.headers.get("stripe-signature");
        if (!sig || !env.STRIPE_WEBHOOK_SECRET) return err("Missing webhook config", 400);
        const parts = sig.split(",").reduce((o, p) => {
          const [k, v] = p.split("=");
          if (k && v) o[k] = v;
          return o;
        }, {});
        const timestamp = parts.t;
        const v1 = parts.v1;
        if (!timestamp || !v1) return err("Invalid signature", 400);
        const payload = `${timestamp}.${rawBody}`;
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          enc.encode(env.STRIPE_WEBHOOK_SECRET),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const sigBytes = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
        const computed = [...new Uint8Array(sigBytes)].map((x) => x.toString(16).padStart(2, "0")).join("");
        if (computed !== v1) return err("Invalid webhook signature", 400);
        const ev = JSON.parse(rawBody);
        if (ev.type !== "checkout.session.completed") return json({ received: true });
        const session = ev.data?.object;
        if (!session) return json({ received: true });
        const accountId = session.client_reference_id;
        const priceId = session.metadata?.price_id || session.line_items?.data?.[0]?.price?.id;
        const priceToCredits = getPriceToCredits(env);
        const credits = priceToCredits[priceId];
        if (!accountId || !credits) return json({ received: true });
        const sessionId = session.id;
        const amountPaid = session.amount_total || 0;  // en centavos
        const currency = session.currency || "usd";
        const existing = await supabaseSelect(
          env,
          "purchases",
          `stripe_payment_id=eq.${encodeURIComponent(sessionId)}`
        );
        if (existing?.length) return json({ received: true });
        const [acc] = await supabaseSelect(env, "accounts", `id=eq.${encodeURIComponent(accountId)}`);
        if (!acc) return json({ received: true });
        const newCredits = (acc.credits || 0) + credits;
        await supabaseUpdate(env, "accounts", "id", accountId, { credits: newCredits });
        await supabaseInsert(env, "purchases", {
          account_id: accountId,
          credits_added: credits,
          amount_paid: amountPaid,
          currency: currency,
          stripe_payment_id: sessionId,
        });
        const emailLang = (session.metadata?.lang === "es" || session.metadata?.lang === "en")
          ? session.metadata.lang
          : "en";
        const base = env.AUTH_BASE_URL || "https://kruder1.com";
        const dashboardUrl = env.STRIPE_SUCCESS_URL || `${base.replace(/\/$/, "")}/dashboard.html`;
        const texts = EMAIL_TEXTS.purchase;
        await sendBrevoEmail(env, {
          to: acc.email,
          subject: texts[emailLang].subject,
          htmlContent: emailTemplate(base, {
            type: "purchase",
            lang: emailLang,
            link: dashboardUrl,
            texts,
            credits,
          }),
        });
        return json({ received: true });
      }

      if (path === "purchases" && request.method === "GET") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);
        const desktopErr = await validateDesktopToken(request, payload, env);
        if (desktopErr) return desktopErr;
        const rows = await supabaseSelect(
          env,
          "purchases",
          `account_id=eq.${encodeURIComponent(payload.sub)}&order=created_at.desc`
        );
        return json({ purchases: rows || [] });
      }

      return err("Not found", 404);
    } catch (e) {
      return err(e?.message || "Internal error", 500);
    }
  },
};
