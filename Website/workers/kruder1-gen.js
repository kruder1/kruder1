/**
 * Kruder1 Generation Worker
 * Routes: generate, generate-prompt (image generation with Segmind Seedream 4.5)
 *
 * Required bindings:
 * - BUCKET: R2 bucket (kruder1-bucket)
 *
 * Required env variables:
 * - SEGMIND_API_KEY
 * - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - BREVO_API_KEY, BREVO_FROM_EMAIL
 * - JWT_SECRET
 * - R2_PUBLIC_URL (e.g., https://media.kruder1.com)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const SEGMIND_ENDPOINT = "https://api.segmind.com/v1/seedream-4.5";

// ─────────────────────────────────────────────────────────────────────────────
// CORS & Response Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "https://kruder1.com",
  "https://www.kruder1.com",
  "http://127.0.0.1",
  "http://localhost",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.some((o) => origin === o || origin.startsWith(o + ":"));
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-HWID",
    ...(allowed ? { "Vary": "Origin" } : {}),
  };
}

let _corsHeaders = {};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ..._corsHeaders },
  });
}

function err(message, status = 400) {
  return json({ error: message }, status);
}

// ─────────────────────────────────────────────────────────────────────────────
// JWT Verification
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function supabase(env, path, opts = {}) {
  const url = `${env.SUPABASE_URL}/rest/v1${path}`;
  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...opts.headers,
  };
  const res = await fetch(url, { ...opts, headers });
  return res;
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

async function supabaseDeductCredit(env, accountId) {
  const res = await supabase(env, `/rpc/deduct_credit`, {
    method: "POST",
    body: JSON.stringify({ p_account_id: accountId }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (txt.includes("Insufficient") || res.status === 400) return { ok: false, error: "Insufficient credits" };
    throw new Error(txt);
  }
  const result = await res.json();
  return { ok: true, credits: result };
}

async function supabaseRefundCredit(env, accountId) {
  await supabase(env, `/rpc/refund_credit`, {
    method: "POST",
    body: JSON.stringify({ p_account_id: accountId }),
  });
}

async function supabaseInsert(env, table, data) {
  const res = await supabase(env, `/${table}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// R2 Helpers
// ─────────────────────────────────────────────────────────────────────────────

function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const random = crypto.getRandomValues(new Uint8Array(8));
  const randomStr = [...random].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${timestamp}-${randomStr}`;
}

async function uploadToR2(env, key, data, contentType) {
  await env.BUCKET.put(key, data, {
    httpMetadata: { contentType },
  });
  const publicUrl = env.R2_PUBLIC_URL || "https://media.kruder1.com";
  return `${publicUrl}/${key}`;
}

async function deleteFromR2(env, key) {
  try {
    await env.BUCKET.delete(key);
  } catch (e) {
    console.error("Failed to delete from R2:", e);
  }
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/png";
  return { buffer, contentType };
}

// ─────────────────────────────────────────────────────────────────────────────
// Email
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_TEXTS = {
  generation: {
    en: {
      subject: "Your AI photo is ready! – Kruder1",
      title: "Your photo is ready!",
      body: "Your AI-generated photo is ready. Click the button below to view your photo (you can download or share it from that page). This link expires in 7 days.",
      cta: "View your photo",
    },
    es: {
      subject: "¡Tu foto IA está lista! – Kruder1",
      title: "¡Tu foto está lista!",
      body: "Tu foto generada con IA está lista. Haz clic en el botón para ver tu foto (desde esa página podrás descargarla o compartirla). Este enlace expira en 7 días.",
      cta: "Ver tu foto",
    },
  },
};

function emailTemplate(base, { lang, imageUrl, photoPageUrl, texts }) {
  const t = texts[lang] || texts.en;
  const logoUrl = `${base}/img/logo.png`;
  const ctaLink = photoPageUrl || imageUrl;  // Prefer photo page (Share+Download) over direct image
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
                    <p style="margin:0 0 28px; font-size:1rem; line-height:1.6; color:rgba(0,0,0,0.85);">${t.body}</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" style="background:#000; border:2px solid #000; border-radius:12px;">
                          <a href="${ctaLink}" style="display:inline-block; padding:14px 32px; font-size:1.1rem; font-weight:700; color:#fff; text-decoration:none; text-transform:uppercase; letter-spacing:0.01em;">${t.cta}</a>
                        </td>
                      </tr>
                    </table>
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(str) {
  return typeof str === "string" && str.length > 0 && EMAIL_REGEX.test(str.trim());
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate Limiting (Cloudflare KV)
// ─────────────────────────────────────────────────────────────────────────────

async function isRateLimited(kv, ip, endpoint, maxReqs, windowMs) {
  const key = `rl:${endpoint}:${ip}`;
  try {
    const entry = await kv.get(key, { type: "json" });
    const now = Date.now();
    const ttlSec = Math.max(60, Math.ceil(windowMs / 1000));
    if (!entry || now - entry.s > windowMs) {
      await kv.put(key, JSON.stringify({ s: now, c: 1 }), { expirationTtl: ttlSec });
      return false;
    }
    entry.c++;
    await kv.put(key, JSON.stringify(entry), { expirationTtl: ttlSec });
    return entry.c > maxReqs;
  } catch (_) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Segmind Generation (Seedream 4.5, synchronous, returns binary image)
// ─────────────────────────────────────────────────────────────────────────────

const RETRY_CONFIG = {
  maxRetries: 5,
  delays: [5000, 8000, 12000, 15000, 20000],
};

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Call Segmind Seedream 4.5. Returns binary image buffer.
 * Response is synchronous (binary image/png in body).
 */
async function callSegmind(apiKey, imageUrl, promptText, aspectRatio = "2:3") {
  const width = aspectRatio === "1:1" ? 2048 : 2048;
  const height = aspectRatio === "1:1" ? 2048 : 3072;

  const requestBody = {
    prompt: promptText,
    image_input: [imageUrl],
    size: "2K",
    width,
    height,
    max_images: 1,
    aspect_ratio: aspectRatio,
  };

  const res = await fetch(SEGMIND_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Segmind error (${res.status}): ${errorText}`);
  }

  const buffer = await res.arrayBuffer();
  return buffer;
}

async function callSegmindWithRetry(env, imageUrl, promptText, aspectRatio = "2:3") {
  const apiKey = env.SEGMIND_API_KEY;
  if (!apiKey) {
    throw new Error("SEGMIND_API_KEY is not configured");
  }

  let lastError;
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const buffer = await callSegmind(apiKey, imageUrl, promptText, aspectRatio);
      return buffer;
    } catch (error) {
      lastError = error;
      const errorMsg = error.message || "";
      const is429 = errorMsg.includes("429") || errorMsg.includes("Too Many Requests");
      if (is429 && attempt < RETRY_CONFIG.maxRetries) {
        const delay = RETRY_CONFIG.delays[attempt] || RETRY_CONFIG.delays[RETRY_CONFIG.delays.length - 1];
        console.log(`Segmind rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Handler
// ─────────────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    _corsHeaders = getCorsHeaders(request);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: _corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "";

    try {
      // ── Rate limiting (send-email only; no limit on generate) ──────────
      if (path === "send-email" && request.method === "POST" && env.RATE_LIMIT) {
        const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
        if (await isRateLimited(env.RATE_LIMIT, clientIp, "gen-email", 10, 60000))
          return err("Too many requests. Please try again later.", 429);
      }

      // ─────────────────────────────────────────────────────────────────────
      // POST /generate - Generate an AI image
      // ─────────────────────────────────────────────────────────────────────
      if (path === "generate" && request.method === "POST") {
        // Verify JWT
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);
        
        // Parse request body
        const body = await request.json();
        const { userPhotoBase64, promptText, userEmail, lang } = body;
        
        if (!userPhotoBase64) return err("User photo is required");
        if (!promptText) return err("Prompt text is required");
        
        // Verify user has credits
        const [account] = await supabaseSelect(
          env,
          "accounts",
          `id=eq.${encodeURIComponent(payload.sub)}`
        );
        
        if (!account) return err("Account not found", 404);
        if ((account.credits || 0) < 1) return err("Insufficient credits", 402);

        // 1. Deduct credit BEFORE generation (atomic via RPC)
        const deductResult = await supabaseDeductCredit(env, account.id);
        if (!deductResult.ok) return err("Insufficient credits", 402);
        const newCredits = deductResult.credits;

        // Generate unique IDs for this generation
        const generationId = generateUniqueId();
        const tempPhotoKey = `temp/${generationId}-input.jpg`;

        let tempPhotoUrl = null;

        try {
          // 2. Upload user photo to R2 (temporary)
          let photoBuffer;
          if (userPhotoBase64.includes(",")) {
            const base64Data = userPhotoBase64.split(",")[1];
            photoBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          } else {
            photoBuffer = Uint8Array.from(atob(userPhotoBase64), c => c.charCodeAt(0));
          }

          tempPhotoUrl = await uploadToR2(env, tempPhotoKey, photoBuffer, "image/jpeg");

          // 3. Call Segmind (returns binary image)
          const imageBuffer = await callSegmindWithRetry(env, tempPhotoUrl, promptText, "2:3");
          const imageBase64 = arrayBufferToBase64(imageBuffer);

          // 4. Delete temporary user photo from R2
          await deleteFromR2(env, tempPhotoKey);

          // 5. Send email if valid email provided
          const base = (env.AUTH_BASE_URL || "https://kruder1.com").replace(/\/$/, "");
          const photoPageUrl = `${base}/photo/${generationId}`;
          const emailLang = (lang === "es" || lang === "en") ? lang : "en";
          if (userEmail && isValidEmail(userEmail)) {
            try {
              const texts = EMAIL_TEXTS.generation;
              await sendBrevoEmail(env, {
                to: userEmail.trim(),
                subject: texts[emailLang].subject,
                htmlContent: emailTemplate(base, { lang: emailLang, imageUrl: photoPageUrl, photoPageUrl, texts }),
              });
            } catch (emailErr) {
              console.error("Failed to send email:", emailErr);
            }
          }

          // 6. Return success
          return json({
            ok: true,
            imageBase64,
            photoPageUrl,
            filename: `${generationId}.jpg`,
            creditsRemaining: newCredits,
          });

        } catch (genError) {
          // Refund credit on failure
          await supabaseRefundCredit(env, account.id);
          if (tempPhotoUrl) {
            await deleteFromR2(env, tempPhotoKey);
          }
          throw genError;
        }
      }

      // ─────────────────────────────────────────────────────────────────────
      // POST /generate-prompt - Generate prompt image (2:3, no R2, no email)
      // ─────────────────────────────────────────────────────────────────────
      if (path === "generate-prompt" && request.method === "POST") {
        // Verify JWT
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);
        
        // Parse request body
        const body = await request.json();
        const { referenceImageBase64, promptText } = body;
        
        if (!referenceImageBase64) return err("Reference image is required");
        if (!promptText) return err("Prompt text is required");
        
        // Verify user has credits
        const [account] = await supabaseSelect(
          env,
          "accounts",
          `id=eq.${encodeURIComponent(payload.sub)}`
        );
        
        if (!account) return err("Account not found", 404);
        if ((account.credits || 0) < 1) return err("Insufficient credits", 402);

        // 1. Deduct credit BEFORE generation (atomic via RPC)
        const deductResult = await supabaseDeductCredit(env, account.id);
        if (!deductResult.ok) return err("Insufficient credits", 402);
        const newCredits = deductResult.credits;

        const tempId = generateUniqueId();
        const tempPhotoKey = `temp/${tempId}-ref.jpg`;

        let tempPhotoUrl = null;

        try {
          // 2. Upload reference image to R2 (temporary)
          let photoBuffer;
          if (referenceImageBase64.includes(",")) {
            const base64Data = referenceImageBase64.split(",")[1];
            photoBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          } else {
            photoBuffer = Uint8Array.from(atob(referenceImageBase64), c => c.charCodeAt(0));
          }

          tempPhotoUrl = await uploadToR2(env, tempPhotoKey, photoBuffer, "image/jpeg");

          // 3. Call Segmind (returns binary image)
          const imageBuffer = await callSegmindWithRetry(env, tempPhotoUrl, promptText, "2:3");
          const imageBase64 = arrayBufferToBase64(imageBuffer);

          // 4. Delete temporary reference image from R2
          await deleteFromR2(env, tempPhotoKey);

          // 5. Return success
          return json({
            ok: true,
            imageBase64,
            creditsRemaining: newCredits,
          });

        } catch (genError) {
          // Refund credit on failure
          await supabaseRefundCredit(env, account.id);
          if (tempPhotoUrl) {
            await deleteFromR2(env, tempPhotoKey);
          }
          throw genError;
        }
      }

      // ─────────────────────────────────────────────────────────────────────
      // POST /send-email - Send email notification with image link
      // ─────────────────────────────────────────────────────────────────────
      if (path === "send-email" && request.method === "POST") {
        // Verify JWT
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);
        
        // Parse request body
        const body = await request.json();
        const { email, imageUrl, photoPageUrl: bodyPhotoPageUrl, lang } = body;
        
        if (!email || !isValidEmail(email)) {
          return err("Valid email is required");
        }
        // Necesitamos photoPageUrl o imageUrl para el enlace del email
        const photoPageUrl = bodyPhotoPageUrl || (() => {
          if (!imageUrl) return null;
          const base = (env.AUTH_BASE_URL || "https://kruder1.com").replace(/\/$/, "");
          const match = String(imageUrl).match(/\/results\/([^/]+)\.(png|jpg|jpeg)$/i);
          const photoId = match ? match[1] : null;
          return photoId ? `${base}/photo/${photoId}` : null;
        })();
        if (!photoPageUrl && !imageUrl) {
          return err("Photo page URL or image URL is required");
        }
        
        try {
          const emailLang = (lang === "es" || lang === "en") ? lang : "en";
          const base = (env.AUTH_BASE_URL || "https://kruder1.com").replace(/\/$/, "");
          const texts = EMAIL_TEXTS.generation;
          
          await sendBrevoEmail(env, {
            to: email.trim(),
            subject: texts[emailLang].subject,
            htmlContent: emailTemplate(base, { lang: emailLang, imageUrl, photoPageUrl, texts }),
          });
          
          return json({ ok: true });
        } catch (emailErr) {
          console.error("Failed to send email:", emailErr);
          return err("Failed to send email", 500);
        }
      }

      // ─────────────────────────────────────────────────────────────────────
      // GET /check-prompts-update - Check if new prompts are available
      // ─────────────────────────────────────────────────────────────────────
      if (path === "check-prompts-update" && request.method === "GET") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);

        const obj = await env.BUCKET.head("prompts/latest.kruder1");
        if (!obj) return err("No prompts file available", 404);

        return json({
          ok: true,
          hash: obj.httpEtag || obj.etag || "",
          size: obj.size,
          uploaded: obj.uploaded?.toISOString() || null,
        });
      }

      // ─────────────────────────────────────────────────────────────────────
      // GET /download-prompts - Download the latest .kruder1 file
      // ─────────────────────────────────────────────────────────────────────
      if (path === "download-prompts" && request.method === "GET") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);

        const obj = await env.BUCKET.get("prompts/latest.kruder1");
        if (!obj) return err("No prompts file available", 404);

        return new Response(obj.body, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": 'attachment; filename="prompts-latest.kruder1"',
            "X-Prompts-Hash": obj.httpEtag || obj.etag || "",
            ..._corsHeaders,
          },
        });
      }

      // ─────────────────────────────────────────────────────────────────────
      // GET /check-software-update - Check if a new app version is available
      // ─────────────────────────────────────────────────────────────────────
      if (path === "check-software-update" && request.method === "GET") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);

        const obj = await env.BUCKET.get("releases/latest.json");
        if (!obj) return err("No release info available", 404);

        try {
          const manifest = JSON.parse(await obj.text());
          const R2_PUBLIC = env.R2_PUBLIC_URL || "https://media.kruder1.com";
          const downloadUrl = manifest.url.startsWith("http")
            ? manifest.url
            : `${R2_PUBLIC}/${manifest.url}`;
          return json({
            ok: true,
            version: manifest.version,
            url: downloadUrl,
            notes: manifest.notes || "",
            date: manifest.releaseDate || manifest.date || "",
          });
        } catch (e) {
          return err("Invalid release manifest", 500);
        }
      }

      // ─────────────────────────────────────────────────────────────────────
      // POST /upload-framed-result - Replace R2 image with framed version
      // ─────────────────────────────────────────────────────────────────────
      if (path === "upload-framed-result" && request.method === "POST") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const payload = await verifyJwt(auth, env.JWT_SECRET);
        if (!payload) return err("Invalid token", 401);

        const formData = await request.formData();
        const generationId = (formData.get("generationId") || "").toString().trim();
        const file = formData.get("image");
        if (!generationId || !file) return err("generationId and image file are required");
        if (!/^[a-zA-Z0-9\-]+$/.test(generationId)) return err("Invalid generationId format", 400);

        const imageBuffer = new Uint8Array(await file.arrayBuffer());
        const key = `results/${generationId}.jpg`;
        await env.BUCKET.put(key, imageBuffer, {
          httpMetadata: { contentType: "image/jpeg" },
        });

        return json({ ok: true });
      }

      // ─────────────────────────────────────────────────────────────────────
      // POST /upload-debug-log - Receive debug log and store in R2
      // ─────────────────────────────────────────────────────────────────────
      if (path === "upload-debug-log" && request.method === "POST") {
        const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
        if (!auth) return err("Unauthorized", 401);
        const logPayload = await verifyJwt(auth, env.JWT_SECRET);
        if (!logPayload) return err("Invalid token", 401);
        const hwid = request.headers.get("X-HWID");
        if (!hwid) return err("HWID required", 400);

        const body = await request.text();
        if (!body || body.length < 10) return err("Log content is empty", 400);
        if (body.length > 5 * 1024 * 1024) return err("Log too large", 413);

        const now = new Date();
        const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
        const key = `logs/${hwid}_${ts}.txt`;

        await env.BUCKET.put(key, body, {
          httpMetadata: { contentType: "text/plain; charset=utf-8" },
        });

        return json({ ok: true, key });
      }

      // ─────────────────────────────────────────────────────────────────────
      // GET /health - Health check
      // ─────────────────────────────────────────────────────────────────────
      if (path === "health" && request.method === "GET") {
        return json({ ok: true, service: "kruder1-gen", timestamp: new Date().toISOString() });
      }

      return err("Not found", 404);
    } catch (e) {
      console.error("Gen worker error:", e?.message || e);
      return err("Internal error", 500);
    }
  },
};
