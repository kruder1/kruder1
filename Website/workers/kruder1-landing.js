/**
 * Kruder1 Landing Worker
 * Handles /photo/* routes and /api/pricing on kruder1.com.
 * All other traffic goes directly to Pages (custom domain).
 */

const PHOTO_ID_REGEX = /^[a-zA-Z0-9\-]+$/;

function photoPageHtml(photoId, imageUrl, downloadUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Your Photo - Kruder 1</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;700;900&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="https://kruder1.com/img/icon.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      /* Z-Index System */
      --z-canvas: 0;
      --z-content: 10;
      --z-ui: 50;
      --z-header: 1200;

      /* Typography */
      --font-base: 'Barlow', sans-serif;
      --font-input: 'Inter', sans-serif;

      /* Spacing */
      --space-xs: 0.5rem;
      --space-sm: 1rem;
      --space-md: 1.5rem;
      --space-lg: 2rem;

      /* Layout */
      --nav-height: 130px;
      --logo-width: 80px;
      --border-width: 2px;
      --radius-main: 0.5rem;

      /* Colors (Light Theme Default) */
      --color-bg: #FFFFFF;
      --color-text: #000000;
      --color-contrast: #FFFFFF;
      --color-border: #000000;
      --color-muted: rgba(0, 0, 0, 0.5);
    }

    [data-theme="dark"] {
      --color-bg: #000000;
      --color-text: #FFFFFF;
      --color-contrast: #000000;
      --color-border: #FFFFFF;
      --color-muted: rgba(255, 255, 255, 0.5);
      color-scheme: dark;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    *::-webkit-scrollbar { display: none; }
    html, body { height: 100%; width: 100%; }
    
    body {
      display: flex;
      flex-direction: column;
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-base);
      font-size: 1rem;
      line-height: 1.5;
      overflow-x: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    a { text-decoration: none !important; color: inherit; cursor: pointer; }
    button { border: none; background: transparent; cursor: pointer; color: inherit; font-family: inherit; }
    
    [data-theme="dark"] .brand-logo img { filter: invert(1); }
    
    /* Animated Grid Canvas */
    #bgCanvas {
      display: block;
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: var(--z-canvas);
      pointer-events: none;
    }

    /* Corner Crosshairs (+) */
    body::before,
    body::after,
    #ch-bottom::before,
    #ch-bottom::after {
      content: '+';
      position: fixed;
      font-family: monospace;
      font-size: 2.5rem;
      font-weight: 300;
      line-height: 1;
      color: var(--color-text);
      z-index: var(--z-ui);
      pointer-events: none;
    }
    body::before       { top: 8px; left: 8px; }
    body::after        { top: 8px; right: 8px; }
    #ch-bottom::before { bottom: 8px; left: 8px; }
    #ch-bottom::after  { bottom: 8px; right: 8px; }
    
    /* Header/Nav - exactly like website */
    .nav-container {
      position: fixed; top: 0; left: 0; width: 100%; height: var(--nav-height);
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 var(--space-lg);
      background: var(--color-bg);
      border-bottom: 1px solid var(--bg-overlay-light);
      z-index: var(--z-header);
    }
    
    .brand-logo img { 
      display: block; 
      width: var(--logo-width); 
      height: auto;
      padding: var(--space-md) 0;
    }
    
    .nav-actions { 
      display: flex; 
      align-items: center; 
      gap: var(--space-md); 
    }
    
    .nav-action-btn {
      font-family: var(--font-base);
      font-weight: 700; 
      font-size: 1.1rem; 
      text-transform: uppercase; 
      padding: 0; 
      transition: opacity 0.2s;
    }
    .nav-action-btn:hover { opacity: 0.6; }
    
    /* Main content */
    main {
      flex: 1; 
      width: 100%; 
      padding-top: var(--nav-height);
      display: flex; 
      flex-direction: column; 
      align-items: center;
      justify-content: center;
      position: relative; 
      z-index: var(--z-content);
    }
    
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 400px;
      padding: var(--space-lg) var(--space-md);
    }
    
    /* Photo - click to open full image */
    .photo-wrap {
      width: 100%;
      margin-bottom: var(--space-lg);
      border-radius: var(--radius-main);
      overflow: hidden;
      border: var(--border-width) solid var(--color-border);
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .photo-wrap:hover { opacity: 0.9; }
    .photo-wrap:active { opacity: 0.8; }
    .photo-wrap img {
      display: block;
      width: 100%;
      height: auto;
      background: var(--color-bg);
    }
    
    /* Actions */
    .actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      width: 100%;
    }
    
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: var(--space-sm) var(--space-lg);
      font-family: var(--font-base);
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.01em;
      text-align: center;
      text-decoration: none;
      border-radius: var(--radius-main);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background: var(--color-text);
      color: var(--color-bg);
      border: var(--border-width) solid var(--color-text);
    }
    .btn-primary:hover { opacity: 0.8; }
    .btn-primary:active { opacity: 0.6; }

    .btn-secondary {
      background: transparent;
      color: var(--color-text);
      border: var(--border-width) solid var(--color-border);
    }
    .btn-secondary:hover {
      background: var(--color-text);
      color: var(--color-bg);
    }
    .btn-secondary:active { opacity: 0.6; }
    
    /* Footer - same as website */
    .site-footer {
      position: relative;
      z-index: var(--z-content);
      padding: var(--space-lg) 0;
      text-align: center;
      font-size: 0.8rem;
    }
    .footer-links a {
      font-family: var(--font-base);
      font-weight: 700;
      text-transform: uppercase;
      margin: 0 var(--space-sm);
      transition: opacity 0.2s;
    }
    .footer-links a:hover { opacity: 0.7; }
    .footer-copyright {
      opacity: 0.5;
      margin-top: var(--space-sm);
    }
    
    /* Error state */
    .error {
      text-align: center;
      padding: var(--space-lg);
      color: var(--color-muted);
      font-weight: 700;
    }
  </style>
</head>
<body>
  <canvas id="bgCanvas"></canvas>
  <div id="ch-bottom"></div>
  
  <nav class="nav-container">
    <a href="https://kruder1.com" class="brand-logo">
      <img src="https://kruder1.com/img/logo.png" alt="Kruder 1">
    </a>
    <div class="nav-actions">
      <button id="btn-theme" class="nav-action-btn" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>
      <button id="btn-lang" class="nav-action-btn">EN</button>
    </div>
  </nav>
  
  <main>
    <div class="content">
      <div class="photo-wrap" id="photoWrap">
        <img id="photo" src="${imageUrl}" alt="Your photo" onerror="document.getElementById('photoWrap').innerHTML='<p class=error id=error-msg>Photo expired or not found.</p>'">
      </div>
      
      <div class="actions">
        <button type="button" class="btn btn-primary" id="btnShare">Share</button>
        <a href="${downloadUrl}" class="btn btn-secondary" id="btnDownload" download>Download</a>
      </div>
    </div>
  </main>
  
  <footer class="site-footer">
    <div class="footer-links">
      <a href="https://kruder1.com/privacy.html" id="link-privacy">Privacy</a>
      <span>·</span>
      <a href="https://kruder1.com/terms.html" id="link-terms">Terms</a>
      <span>·</span>
      <a href="https://kruder1.com/contact.html" id="link-contact">Contact</a>
    </div>
    <div class="footer-copyright">© 2026 Kruder 1</div>
  </footer>
  
  <script>
    (function() {
      'use strict';
      
      // --- Configuration ---
      var CONFIG = {
        keyTheme: 'KRUDER1-concept-theme',
        keyLang: 'KRUDER1-concept-lang',
        imageUrl: '${imageUrl}'
      };
      
      // --- i18n Dictionary ---
      var TEXTS = {
        share: { en: 'Share', es: 'Compartir' },
        copyLink: { en: 'Copy link', es: 'Copiar enlace' },
        copied: { en: 'Copied!', es: '¡Copiado!' },
        download: { en: 'Download', es: 'Descargar' },
        privacy: { en: 'Privacy', es: 'Privacidad' },
        terms: { en: 'Terms', es: 'Términos' },
        contact: { en: 'Contact', es: 'Contacto' },
        error: { en: 'Photo expired or not found.', es: 'Foto expirada o no encontrada.' }
      };
      
      // --- Detect system language (prioritize system over stored for first visit) ---
      var detectSystemLang = function() {
        var navLangs = navigator.languages || [navigator.language || 'en'];
        for (var i = 0; i < navLangs.length; i++) {
          var lang = navLangs[i].toLowerCase();
          if (lang.startsWith('es')) return 'es';
          if (lang.startsWith('en')) return 'en';
        }
        return 'en';
      };
      
      // --- State ---
      var storedLang = localStorage.getItem(CONFIG.keyLang);
      var STATE = {
        lang: storedLang || detectSystemLang(),
        theme: localStorage.getItem(CONFIG.keyTheme) || 'light'
      };
      
      var t = function(key) { 
        return TEXTS[key] ? (TEXTS[key][STATE.lang] || TEXTS[key].en) : key; 
      };
      
      // --- DOM ---
      var root = document.documentElement;
      var btnTheme = document.getElementById('btn-theme');
      var btnLang = document.getElementById('btn-lang');
      var btnShare = document.getElementById('btnShare');
      var btnDownload = document.getElementById('btnDownload');
      var photoWrap = document.getElementById('photoWrap');
      
      // --- Theme ---
      var setTheme = function(theme) {
        STATE.theme = theme;
        localStorage.setItem(CONFIG.keyTheme, theme);
        
        if (theme === 'dark') {
          root.setAttribute('data-theme', 'dark');
          btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
          root.removeAttribute('data-theme');
          btnTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
      };
      
      btnTheme.addEventListener('click', function() {
        setTheme(STATE.theme === 'light' ? 'dark' : 'light');
      });
      
      // --- Language ---
      var updateTexts = function() {
        if (btnShare) btnShare.textContent = navigator.share ? t('share') : t('copyLink');
        if (btnDownload) btnDownload.textContent = t('download');
        var privacyEl = document.getElementById('link-privacy');
        var termsEl = document.getElementById('link-terms');
        var contactEl = document.getElementById('link-contact');
        var errorEl = document.getElementById('error-msg');
        if (privacyEl) privacyEl.textContent = t('privacy');
        if (termsEl) termsEl.textContent = t('terms');
        if (contactEl) contactEl.textContent = t('contact');
        if (errorEl) errorEl.textContent = t('error');
      };
      
      var setLang = function(lang) {
        STATE.lang = lang;
        localStorage.setItem(CONFIG.keyLang, lang);
        root.lang = lang;
        if (btnLang) btnLang.textContent = lang.toUpperCase();
        updateTexts();
      };
      
      if (btnLang) {
        btnLang.addEventListener('click', function() {
          setLang(STATE.lang === 'en' ? 'es' : 'en');
        });
      }
      
      // --- Animated Grid Background ---
      var initGrid = function() {
        var canvas = document.getElementById('bgCanvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var GRID = { SIZE: 40, PARTICLES: 30, SPEED_MIN: 0.5, SPEED_MAX: 5, TRAIL_LIMIT: 60, GRID_OPACITY: 0.15, DOT_RADIUS: 0.4 };
        var occupied = { h: new Set(), v: new Set() };
        function resize() {
          canvas.width = window.innerWidth; canvas.height = window.innerHeight;
          occupied.h.clear(); occupied.v.clear();
          particles.forEach(function(p) { p.init(); });
        }
        function getColors() {
          var dark = document.documentElement.getAttribute('data-theme') === 'dark';
          return { bg: dark ? '#000000' : '#FFFFFF', rgb: dark ? '255,255,255' : '0,0,0' };
        }
        function drawGrid() {
          var c = getColors();
          ctx.fillStyle = c.bg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, 'rgba(' + c.rgb + ',' + GRID.GRID_OPACITY + ')');
          grad.addColorStop(1, 'rgba(' + c.rgb + ',0)');
          ctx.strokeStyle = grad; ctx.lineWidth = 1;
          for (var y = 0; y < canvas.height; y += GRID.SIZE) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
          for (var x = 0; x < canvas.width; x += GRID.SIZE) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        }
        function Particle() { this.init(); }
        Particle.prototype.init = function() {
          this.trail = []; this.speed = Math.random() * (GRID.SPEED_MAX - GRID.SPEED_MIN) + GRID.SPEED_MIN; this.lineFreed = false;
          var ok = false;
          for (var i = 0; i < 100; i++) {
            if (Math.random() > 0.5) {
              var y = Math.round(Math.random() * canvas.height / GRID.SIZE) * GRID.SIZE;
              if (!occupied.h.has(y)) { this.axis = 'h'; this.x = 0; this.y = y; occupied.h.add(y); ok = true; break; }
            } else {
              var x = Math.round(Math.random() * canvas.width / GRID.SIZE) * GRID.SIZE;
              if (!occupied.v.has(x)) { this.axis = 'v'; this.x = x; this.y = 0; occupied.v.add(x); ok = true; break; }
            }
          }
          if (!ok) { this.axis = 'h'; this.x = -9999; this.y = -9999; this.lineFreed = true; }
        };
        Particle.prototype.update = function() {
          this.trail.push({ x: this.x, y: this.y });
          if (this.trail.length > GRID.TRAIL_LIMIT) this.trail.shift();
          if (this.axis === 'h') { this.x += this.speed; if (!this.lineFreed && this.x > canvas.width) { this.lineFreed = true; occupied.h.delete(this.y); } }
          else { this.y += this.speed; if (!this.lineFreed && this.y > canvas.height) { this.lineFreed = true; occupied.v.delete(this.x); } }
          if (this.lineFreed) {
            var w = canvas.width, h = canvas.height, ax = this.axis;
            var allGone = this.trail.length === 0 || this.trail.every(function(p) { return ax === 'h' ? p.x > w : p.y > h; });
            if (allGone) this.init();
          }
        };
        Particle.prototype.draw = function() {
          var c = getColors();
          for (var i = 0; i < this.trail.length; i++) {
            var alpha = i / this.trail.length;
            ctx.fillStyle = 'rgba(' + c.rgb + ',' + alpha + ')';
            ctx.beginPath(); ctx.arc(this.trail[i].x, this.trail[i].y, GRID.DOT_RADIUS, 0, Math.PI * 2); ctx.fill();
          }
        };
        var particles = [];
        for (var i = 0; i < GRID.PARTICLES; i++) particles.push(new Particle());
        var animFrameId = null;
        function animate() {
          drawGrid();
          for (var i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); }
          animFrameId = requestAnimationFrame(animate);
        }
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) { if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; } }
          else { if (!animFrameId) animate(); }
        });
        window.addEventListener('resize', resize);
        resize(); animate();
      };
      
      // --- Photo click: open full image in new tab ---
      if (photoWrap) {
        photoWrap.addEventListener('click', function() {
          window.open(CONFIG.imageUrl, '_blank');
        });
      }
      
      // --- Handle browser back button ---
      window.addEventListener('popstate', function() {
        // If user presses back, they stay on this page or go to previous
        // This is default browser behavior, no action needed
      });
      
      // --- Share ---
      var pageUrl = window.location.href;
      
      if (btnShare) {
        if (navigator.share) {
          btnShare.addEventListener('click', function() {
            navigator.share({
              title: 'Kruder 1',
              text: STATE.lang === 'es' ? '¡Mira mi foto generada con IA!' : 'Check out my AI-generated photo!',
              url: pageUrl
            }).catch(function() {});
          });
        } else {
          btnShare.addEventListener('click', function() {
            navigator.clipboard.writeText(pageUrl).then(function() {
              btnShare.textContent = t('copied');
              setTimeout(function() { btnShare.textContent = t('copyLink'); }, 2000);
            });
          });
        }
      }
      
      // --- Init ---
      setTheme(STATE.theme);
      setLang(STATE.lang);
      initGrid();
    })();
  <\/script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "";

    // ─── /api/pricing ───────────────────────────────────────────────────
    if (path === "api/pricing") {
      const pricingData = {
        basic: {
          id: env.PRICE_ID_BASIC,
          price_en: env.PRICE_TXT_BASIC_EN,
          price_es: env.PRICE_TXT_BASIC_ES
        },
        plus: {
          id: env.PRICE_ID_PLUS,
          price_en: env.PRICE_TXT_PLUS_EN,
          price_es: env.PRICE_TXT_PLUS_ES
        },
        pro: {
          id: env.PRICE_ID_PRO,
          price_en: env.PRICE_TXT_PRO_EN,
          price_es: env.PRICE_TXT_PRO_ES
        }
      };

      return new Response(JSON.stringify(pricingData), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "max-age=60" // Cachea la respuesta 1 minuto para no saturar
        }
      });
    }

    // ─── /photo/:id ─────────────────────────────────────────────────────
    const photoMatch = path.match(/^photo\/([^/]+)$/);
    if (photoMatch) {
      const photoId = photoMatch[1];
      if (!PHOTO_ID_REGEX.test(photoId)) {
        return new Response("Invalid photo ID", { status: 400 });
      }
      const mediaBase = (env.MEDIA_BASE_URL || "https://media.kruder1.com").replace(/\/$/, "");
      const imageUrl = `${mediaBase}/results/${photoId}.jpg`;
      const downloadUrl = `${url.origin}/photo/${photoId}/download`;

      const html = photoPageHtml(photoId, imageUrl, downloadUrl);
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    // ─── /photo/:id/download ─────────────────────────────────────────────
    const downloadMatch = path.match(/^photo\/([^/]+)\/download$/);
    if (downloadMatch) {
      const photoId = downloadMatch[1];
      if (!PHOTO_ID_REGEX.test(photoId)) {
        return new Response("Invalid photo ID", { status: 400 });
      }
      const mediaBase = (env.MEDIA_BASE_URL || "https://media.kruder1.com").replace(/\/$/, "");
      const imageUrl = `${mediaBase}/results/${photoId}.jpg`;

      try {
        const res = await fetch(imageUrl);
        if (!res.ok) {
          return new Response("Photo not found or expired", { status: 404 });
        }
        const contentType = res.headers.get("Content-Type") || "image/jpeg";
        const body = await res.arrayBuffer();
        return new Response(body, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${photoId}.jpg"`,
            "Cache-Control": "no-store",
          },
        });
      } catch (e) {
        return new Response("Failed to fetch photo", { status: 502 });
      }
    }

    // Worker only handles /photo/* routes and /api/pricing — everything else is served by Pages directly
    return new Response("Not found", { status: 404 });
  },
};