/* ============================================================
   KRUDER 1 — Website Shared JavaScript v2
   No hamburger menu. Sticky nav with auth-aware access button.
   Usage: KRUDER.init({ key: { en: '...', es: '...' }, ... })
   ============================================================ */

const KRUDER = (() => {

    /* --- Config --- */
    const CONFIG = {
        keyLang: 'KRUDER1-concept-lang',
        keyTheme: 'KRUDER1-concept-theme',
        keyToken: 'KRUDER1_token',
        apiBase: 'https://kruder1-auth.kruder1-master.workers.dev',
        particlesColor: {
            light: '#404040',
            dark: '#E6E6E6'
        }
    };

    /* --- Shared i18n keys (nav + footer) --- */
    const SHARED_DICT = {
        nav_access:     { en: 'CLIENT ACCESS', es: 'ACCESO A CLIENTE' },
        nav_dashboard:  { en: 'DASHBOARD', es: 'DASHBOARD' },
        footer_privacy: { en: 'Privacy', es: 'Privacidad' },
        footer_terms:   { en: 'Terms', es: 'Términos' },
        footer_contact: { en: 'Contact', es: 'Contacto' }
    };

    /* --- State --- */
    const detectSystemLang = () => {
        const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        return lang.startsWith('es') ? 'es' : 'en';
    };

    const STATE = {
        lang: localStorage.getItem(CONFIG.keyLang) || detectSystemLang(),
        theme: localStorage.getItem(CONFIG.keyTheme) || 'light',
        dict: {}
    };

    /* --- DOM refs (populated on init) --- */
    let DOM = {};

    /* --- Core Functions --- */

    const t = (key) => {
        const entry = STATE.dict[key];
        return entry ? (entry[STATE.lang] || entry.en) : key;
    };

    const updateTexts = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) el.innerHTML = t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) el.placeholder = t(key);
        });
    };

    const setLang = (newLang) => {
        STATE.lang = newLang;
        localStorage.setItem(CONFIG.keyLang, newLang);
        document.documentElement.lang = newLang;
        if (DOM.btnLang) DOM.btnLang.textContent = newLang.toUpperCase();
        updateTexts();
        updateAuthUI();
    };

    const setTheme = (newTheme) => {
        STATE.theme = newTheme;
        localStorage.setItem(CONFIG.keyTheme, newTheme);
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (DOM.btnTheme) DOM.btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (DOM.btnTheme) DOM.btnTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
        initParticles();
    };

    const updateAuthUI = () => {
        const isLoggedIn = !!localStorage.getItem(CONFIG.keyToken);
        document.querySelectorAll('[data-auth-guest]').forEach(el => el.classList.toggle('auth-hidden', isLoggedIn));
        document.querySelectorAll('[data-auth-user]').forEach(el => el.classList.toggle('auth-hidden', !isLoggedIn));

        // Update access button
        if (DOM.btnAccess) {
            if (isLoggedIn) {
                DOM.btnAccess.href = 'dashboard.html';
                DOM.btnAccess.innerHTML = t('nav_dashboard');
            } else {
                DOM.btnAccess.href = 'login.html';
                DOM.btnAccess.innerHTML = t('nav_access');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem(CONFIG.keyToken);
        window.location.href = 'login.html';
    };

    /* --- Particles --- */

    const initParticles = () => {
        if (!window.particlesJS) return;
        const color = STATE.theme === 'dark' ? CONFIG.particlesColor.dark : CONFIG.particlesColor.light;
        particlesJS('particles-js', {
            particles: {
                number: { value: 200, density: { enable: true, value_area: 800 } },
                color: { value: color },
                shape: { type: 'circle' },
                opacity: { value: 0.25, random: true },
                size: { value: 2, random: true },
                line_linked: { enable: true, distance: 150, color: color, opacity: 0.2, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', out_mode: 'out' }
            },
            interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false } } },
            retina_detect: true
        });
    };

    /* --- Helpers (exported) --- */

    const setBtnLoading = (btn, loading) => {
        if (!btn) return;
        btn.disabled = loading;
        btn.classList.toggle('is-loading', loading);
        btn.dataset.originalText = btn.dataset.originalText || btn.innerHTML;
        if (loading) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        else btn.innerHTML = btn.dataset.originalText;
    };

    const showModal = (msgKey, isError, callback) => {
        const overlay = document.getElementById('modal-overlay');
        const msgEl = document.getElementById('modal-message');
        const box = overlay?.querySelector('.modal-box');
        if (!overlay || !msgEl) return;
        msgEl.textContent = t(msgKey);
        overlay.classList.add('is-active');
        if (isError && box) { box.classList.add('shake'); setTimeout(() => box.classList.remove('shake'), 600); }
        overlay._callback = callback || null;
    };

    const hideModal = () => {
        const overlay = document.getElementById('modal-overlay');
        if (!overlay) return;
        overlay.classList.remove('is-active');
        if (overlay._callback) { overlay._callback(); overlay._callback = null; }
    };

    /* --- Init --- */

    const init = (pageDict = {}) => {
        STATE.dict = { ...SHARED_DICT, ...pageDict };

        DOM = {
            btnLang: document.getElementById('btn-lang'),
            btnTheme: document.getElementById('btn-theme'),
            btnAccess: document.getElementById('btn-access')
        };

        // Event listeners
        DOM.btnLang?.addEventListener('click', () => setLang(STATE.lang === 'en' ? 'es' : 'en'));
        DOM.btnTheme?.addEventListener('click', () => setTheme(STATE.theme === 'light' ? 'dark' : 'light'));

        // Modal close
        document.getElementById('modal-btn-ok')?.addEventListener('click', hideModal);

        // Scroll-to-top button
        const btnTop = document.createElement('button');
        btnTop.className = 'btn-scroll-top';
        btnTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
        btnTop.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(btnTop);
        btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => {
            btnTop.classList.toggle('is-visible', window.scrollY > 400);
        }, { passive: true });

        // Boot
        setLang(STATE.lang);
        setTheme(STATE.theme);
        updateAuthUI();
    };

    /* --- Public API --- */
    return {
        CONFIG,
        STATE,
        init,
        t,
        setLang,
        setTheme,
        updateTexts,
        updateAuthUI,
        setBtnLoading,
        showModal,
        hideModal,
        logout
    };

})();
