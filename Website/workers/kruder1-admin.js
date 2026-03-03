/**
 * Kruder1 Admin Worker
 * Endpoints: login, stats, users, user-details, adjust-credits, delete-device, reset-demo
 * Env: ADMIN_PASSWORD, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
 */

const ALLOWED_ORIGINS = [
  "https://kruder1.com",
  "https://www.kruder1.com",
  "https://admin.kruder1.com",
  "https://kruder1-admin.pages.dev",
  "http://127.0.0.1",
  "http://localhost",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.some((o) => origin === o || origin.startsWith(o + ":"));
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

// ── Crypto Helpers ──────────────────────────────────────────

function base64url(buf) {
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signJwt(payload, secret, expiresInSec = 86400) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSec };
  const enc = new TextEncoder();
  const h = base64url(enc.encode(JSON.stringify(header)));
  const p = base64url(enc.encode(JSON.stringify(body)));
  const data = `${h}.${p}`;
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return `${data}.${base64url(sig)}`;
}

async function verifyJwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const data = `${parts[0]}.${parts[1]}`;
  const sig = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const ok = await crypto.subtle.verify("HMAC", key, sig, enc.encode(data));
  if (!ok) return null;
  const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// ── Supabase Helpers ────────────────────────────────────────

async function supabase(env, path, opts = {}) {
  const url = `${env.SUPABASE_URL}/rest/v1${path}`;
  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...opts.headers,
  };
  const res = await fetch(url, { ...opts, headers: { ...headers, ...opts.headers } });
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

async function supabaseDelete(env, table, query) {
  const res = await supabase(env, `/${table}?${query}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

// ── Rate Limiting (Cloudflare KV) ──────────────────────────
async function isRateLimited(kv, ip, endpoint, maxReqs, windowMs) {
  const key = `r2:${endpoint}:${ip}`;
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

// ── Admin Auth ──────────────────────────────────────────────

async function requireAdmin(request, env) {
  const auth = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!auth) return { error: err("Unauthorized", 401) };
  const payload = await verifyJwt(auth, env.JWT_SECRET);
  if (!payload || payload.role !== "admin") return { error: err("Unauthorized", 401) };
  return { payload };
}

// ── Worker Entry ────────────────────────────────────────────

export default {
  async fetch(request, env) {
    _corsHeaders = getCorsHeaders(request);
    if (request.method === "OPTIONS") return new Response(null, { headers: _corsHeaders });

    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "");

    try {
      // ── Rate limiting ────────────────────────────────────
      if (path === "login" && request.method === "POST" && env.RATE_LIMIT) {
        const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
        if (await isRateLimited(env.RATE_LIMIT, clientIp, "admin-login", 3, 60000))
          return err("Too many requests. Please try again later.", 429);
      }

      // ── POST /login ─────────────────────────────────────
      if (path === "login" && request.method === "POST") {
        const { password } = (await request.json()) || {};
        if (!password) return err("Password required");
        const enc = new TextEncoder();
        const expected = enc.encode(env.ADMIN_PASSWORD);
        const received = enc.encode(password);
        if (expected.length !== received.length || !expected.every((b, i) => b === received[i]))
          return err("Invalid credentials", 401);

        const token = await signJwt({ role: "admin" }, env.JWT_SECRET, 86400);
        return json({ ok: true, token });
      }

      // ── GET /stats ──────────────────────────────────────
      if (path === "stats" && request.method === "GET") {
        const { error: authErr } = await requireAdmin(request, env);
        if (authErr) return authErr;

        const [accounts, purchases] = await Promise.all([
          supabaseSelect(env, "accounts", "select=id,credits,email_verified,created_at"),
          supabaseSelect(env, "purchases", "select=credits_added,amount_paid"),
        ]);

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgo = new Date(now - 7 * 86400000).toISOString();
        const monthAgo = new Date(now - 30 * 86400000).toISOString();

        const totalUsers = accounts.length;
        const verifiedUsers = accounts.filter((a) => a.email_verified).length;
        const creditsInAccounts = accounts.reduce((s, a) => s + (a.credits || 0), 0);
        const regToday = accounts.filter((a) => a.created_at >= todayStart).length;
        const regWeek = accounts.filter((a) => a.created_at >= weekAgo).length;
        const regMonth = accounts.filter((a) => a.created_at >= monthAgo).length;

        const totalCreditsSold = purchases.reduce((s, p) => s + (p.credits_added || 0), 0);
        const totalRevenueCents = purchases.reduce((s, p) => s + (p.amount_paid || 0), 0);
        const totalRevenue = (totalRevenueCents / 100).toFixed(2);

        return json({
          ok: true,
          totalUsers,
          verifiedUsers,
          totalRevenue: parseFloat(totalRevenue),
          totalCreditsSold,
          creditsInAccounts,
          registrations: { today: regToday, week: regWeek, month: regMonth },
        });
      }

      // ── GET /users ──────────────────────────────────────
      if (path === "users" && request.method === "GET") {
        const { error: authErr } = await requireAdmin(request, env);
        if (authErr) return authErr;

        const search = url.searchParams.get("search")?.trim() || "";
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
        const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "25", 10)));
        const offset = (page - 1) * limit;

        let query = "select=id,email,credits,email_verified,created_at&order=created_at.desc";
        if (search) query += `&email=ilike.*${encodeURIComponent(search)}*`;

        // Get total count
        let countQuery = "select=id";
        if (search) countQuery += `&email=ilike.*${encodeURIComponent(search)}*`;
        const allRows = await supabaseSelect(env, "accounts", countQuery);
        const total = allRows.length;

        query += `&offset=${offset}&limit=${limit}`;
        const users = await supabaseSelect(env, "accounts", query);

        return json({
          ok: true,
          users,
          total,
          page,
          pages: Math.ceil(total / limit),
        });
      }

      // ── GET /user-details ───────────────────────────────
      if (path === "user-details" && request.method === "GET") {
        const { error: authErr } = await requireAdmin(request, env);
        if (authErr) return authErr;

        const id = url.searchParams.get("id");
        if (!id) return err("User ID required");

        const [devices, purchases, demoClaims] = await Promise.all([
          supabaseSelect(env, "account_devices", `account_id=eq.${encodeURIComponent(id)}&order=last_seen_at.desc`),
          supabaseSelect(env, "purchases", `account_id=eq.${encodeURIComponent(id)}&order=created_at.desc`),
          supabaseSelect(env, "hwid_demo_claimed", `account_id=eq.${encodeURIComponent(id)}`),
        ]);

        // Build a set of HWIDs that claimed demo credits
        const demoHwids = {};
        for (const dc of demoClaims || []) {
          demoHwids[dc.hwid] = dc.claimed_at || true;
        }

        return json({
          ok: true,
          devices: devices || [],
          purchases: purchases || [],
          demoClaimed: (demoClaims?.length || 0) > 0,
          demoHwids,
        });
      }

      // ── POST /delete-device ────────────────────────────
      if (path === "delete-device" && request.method === "POST") {
        const { error: authErr } = await requireAdmin(request, env);
        if (authErr) return authErr;

        const { accountId, hwid } = (await request.json()) || {};
        if (!accountId) return err("Account ID required");
        if (!hwid?.trim()) return err("HWID required");

        await supabaseDelete(env, "account_devices", `account_id=eq.${encodeURIComponent(accountId)}&hwid=eq.${encodeURIComponent(hwid.trim())}`);

        return json({ ok: true });
      }

      // ── POST /reset-demo ──────────────────────────────
      if (path === "reset-demo" && request.method === "POST") {
        const { error: authErr } = await requireAdmin(request, env);
        if (authErr) return authErr;

        const { hwid } = (await request.json()) || {};
        if (!hwid?.trim()) return err("HWID required");

        await supabaseDelete(env, "hwid_demo_claimed", `hwid=eq.${encodeURIComponent(hwid.trim())}`);

        return json({ ok: true });
      }

      // ── POST /adjust-credits ────────────────────────────
      if (path === "adjust-credits" && request.method === "POST") {
        const { error: authErr } = await requireAdmin(request, env);
        if (authErr) return authErr;

        const { accountId, amount, reason } = (await request.json()) || {};
        if (!accountId) return err("Account ID required");
        if (typeof amount !== "number" || amount === 0) return err("Amount must be a non-zero number");
        if (!reason?.trim()) return err("Reason required");

        const rows = await supabaseSelect(env, "accounts", `id=eq.${encodeURIComponent(accountId)}&select=credits`);
        if (!rows?.length) return err("Account not found", 404);

        const currentCredits = rows[0].credits || 0;
        const newCredits = Math.max(0, currentCredits + amount);

        await supabaseUpdate(env, "accounts", "id", accountId, { credits: newCredits, updated_at: new Date().toISOString() });

        return json({ ok: true, newCredits });
      }

      // ── Health check ────────────────────────────────────
      if (path === "" || path === "health") {
        return json({ ok: true, service: "kruder1-admin", timestamp: new Date().toISOString() });
      }

      return err("Not found", 404);
    } catch (e) {
      return err(e?.message || "Internal error", 500);
    }
  },
};
