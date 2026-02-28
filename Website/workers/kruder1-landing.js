/**
 * Kruder1 Landing Worker
 * Sits in front of kruder1.com (Pages).
 * Routes:
 *   GET /photo/:id         - Photo page with Share + Download
 *   GET /photo/:id/download - Proxy download (Content-Disposition: attachment)
 *   *                      - Pass-through to static site (Pages)
 *
 * Required env:
 *   PAGES_ORIGIN   - e.g. https://kruder1-landing.pages.dev (no trailing slash)
 *   MEDIA_BASE_URL - e.g. https://media.kruder1.com
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
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="https://kruder1.com/img/icon.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"><\/script>
  <style>
    :root {
      /* Z-Index System */
      --z-particles: 0;
      --z-content: 10;
      --z-header: 1200;
      --z-scanlines: 9999;
      
      /* Typography */
      --font-main: 'Inter Tight', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      
      /* Spacing */
      --space-xs: 0.5rem;
      --space-sm: 1rem;
      --space-md: 1.5rem;
      --space-lg: 2rem;
      
      /* Layout - same as website */
      --nav-height: 130px;
      --logo-width: 80px;
      --border-width: 2px;
      --border-radius: 12px;
      
      /* Colors (Light Theme Default) */
      --color-bg: #ffffff;
      --color-text: #000000;
      --color-contrast: #ffffff;
      --color-border: #000000;
      --color-muted: rgba(0, 0, 0, 0.5);
      --bg-overlay-light: rgba(0, 0, 0, 0.05);
    }
    
    [data-theme="dark"] {
      --color-bg: #000000;
      --color-text: #ffffff;
      --color-contrast: #000000;
      --color-border: #ffffff;
      --color-muted: rgba(255, 255, 255, 0.5);
      --bg-overlay-light: rgba(255, 255, 255, 0.05);
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
      font-family: var(--font-main);
      font-size: 1rem;
      line-height: 1.5;
      overflow-x: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    a { text-decoration: none !important; color: inherit; cursor: pointer; }
    button { border: none; background: transparent; cursor: pointer; color: inherit; font-family: inherit; }
    
    [data-theme="dark"] .brand-logo img { filter: invert(1); }
    
    /* Particles */
    #particles-js {
      position: fixed; inset: 0;
      z-index: var(--z-particles);
      pointer-events: none;
    }
    
    /* Scanlines */
    #scanlines {
      position: fixed; inset: 0;
      background: repeating-linear-gradient(0deg, var(--bg-overlay-light), var(--bg-overlay-light) 1px, transparent 1px, transparent 3px);
      pointer-events: none;
      z-index: var(--z-scanlines);
    }
    
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
      font-family: var(--font-mono); 
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
      border-radius: var(--border-radius);
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
      font-family: var(--font-mono);
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.01em;
      text-align: center;
      text-decoration: none;
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-primary {
      background: var(--color-text);
      color: var(--color-contrast);
    }
    .btn-primary:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }
    
    .btn-secondary {
      background: transparent;
      color: var(--color-text);
    }
    .btn-secondary:hover {
      background: var(--color-text);
      color: var(--color-contrast);
    }
    
    /* Footer - same as website */
    .site-footer {
      position: relative;
      z-index: var(--z-content);
      padding: var(--space-lg) 0;
      text-align: center;
      font-size: 0.8rem;
    }
    .footer-links a {
      font-family: var(--font-mono);
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
  <div id="particles-js"></div>
  <div id="scanlines"></div>
  
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
        particlesColor: { light: '#000000', dark: '#ffffff' },
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
        initParticles();
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
      
      // --- Particles (same config as all website pages) ---
      var initParticles = function() {
        if (!window.particlesJS) return;
        var color = STATE.theme === 'dark' ? CONFIG.particlesColor.dark : CONFIG.particlesColor.light;
        particlesJS('particles-js', {
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: color },
            shape: { type: 'circle' },
            opacity: { value: 0.1, random: true },
            size: { value: 2, random: true },
            line_linked: { enable: true, distance: 150, color: color, opacity: 0.1, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', out_mode: 'out' }
          },
          interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false } } },
          retina_detect: true
        });
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
    })();
  <\/script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "";

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

    // ─── Pass-through to static site ────────────────────────────────────
    const origin = (env.PAGES_ORIGIN || "https://kruder1-landing.pages.dev").replace(/\/$/, "");
    const targetUrl = `${origin}/${path}${url.search}`;
    try {
      const res = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      });
      const newHeaders = new Headers(res.headers);
      newHeaders.delete("content-encoding");
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders,
      });
    } catch (e) {
      return new Response("Origin unavailable", { status: 502 });
    }
  },
};
