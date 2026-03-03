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
    };

    /* --- Shared i18n keys (nav + footer) --- */
    const SHARED_DICT = {
        nav_access:     { en: 'CLIENT ACCESS', es: 'ACCESO A CLIENTE' },
        nav_dashboard:  { en: 'DASHBOARD', es: 'DASHBOARD' },
        footer_privacy: { en: 'Privacy', es: 'Privacidad' },
        footer_terms:   { en: 'Terms', es: 'Términos' },
        footer_contact: { en: 'Contact', es: 'Contacto' },
        footer_status:  { en: 'Status', es: 'Estado' }
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

    /* --- Animated Grid Background --- */

    const initGrid = () => {
        const canvas = document.getElementById('bgCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const GRID = {
            SIZE: 40,
            PARTICLES: 30,
            SPEED_MIN: 0.5,
            SPEED_MAX: 5,
            TRAIL_LIMIT: 60,
            GRID_OPACITY: 0.15,
            DOT_RADIUS: 0.4
        };

        const occupied = { h: new Set(), v: new Set() };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            occupied.h.clear();
            occupied.v.clear();
            particles.forEach(p => p.init());
        }

        function getColors() {
            const dark = document.documentElement.getAttribute('data-theme') === 'dark';
            return {
                bg: dark ? '#000000' : '#FFFFFF',
                rgb: dark ? '255,255,255' : '0,0,0'
            };
        }

        function drawGrid() {
            const c = getColors();
            ctx.fillStyle = c.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, 'rgba(' + c.rgb + ',' + GRID.GRID_OPACITY + ')');
            grad.addColorStop(1, 'rgba(' + c.rgb + ',0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;

            for (let y = 0; y < canvas.height; y += GRID.SIZE) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            for (let x = 0; x < canvas.width; x += GRID.SIZE) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
        }

        function Particle() { this.init(); }
        Particle.prototype.init = function() {
            this.trail = [];
            this.speed = Math.random() * (GRID.SPEED_MAX - GRID.SPEED_MIN) + GRID.SPEED_MIN;
            this.lineFreed = false;
            let ok = false;
            for (let i = 0; i < 100; i++) {
                if (Math.random() > 0.5) {
                    const y = Math.round(Math.random() * canvas.height / GRID.SIZE) * GRID.SIZE;
                    if (!occupied.h.has(y)) {
                        this.axis = 'h'; this.x = 0; this.y = y;
                        occupied.h.add(y); ok = true; break;
                    }
                } else {
                    const x = Math.round(Math.random() * canvas.width / GRID.SIZE) * GRID.SIZE;
                    if (!occupied.v.has(x)) {
                        this.axis = 'v'; this.x = x; this.y = 0;
                        occupied.v.add(x); ok = true; break;
                    }
                }
            }
            if (!ok) {
                this.axis = 'h'; this.x = -9999; this.y = -9999;
                this.lineFreed = true;
            }
        };
        Particle.prototype.update = function() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > GRID.TRAIL_LIMIT) this.trail.shift();
            if (this.axis === 'h') {
                this.x += this.speed;
                if (!this.lineFreed && this.x > canvas.width) {
                    this.lineFreed = true;
                    occupied.h.delete(this.y);
                }
            } else {
                this.y += this.speed;
                if (!this.lineFreed && this.y > canvas.height) {
                    this.lineFreed = true;
                    occupied.v.delete(this.x);
                }
            }
            if (this.lineFreed) {
                const w = canvas.width, h = canvas.height, ax = this.axis;
                const allGone = this.trail.length === 0 || this.trail.every(p =>
                    ax === 'h' ? p.x > w : p.y > h
                );
                if (allGone) this.init();
            }
        };
        Particle.prototype.draw = function() {
            const c = getColors();
            for (let i = 0; i < this.trail.length; i++) {
                const alpha = i / this.trail.length;
                ctx.fillStyle = 'rgba(' + c.rgb + ',' + alpha + ')';
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, GRID.DOT_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const particles = [];
        for (let i = 0; i < GRID.PARTICLES; i++) particles.push(new Particle());

        let animFrameId = null;
        function animate() {
            drawGrid();
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animFrameId = requestAnimationFrame(animate);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
            } else {
                if (!animFrameId) animate();
            }
        });

        window.addEventListener('resize', resize);
        resize();
        animate();
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
        msgEl.innerHTML = t(msgKey);
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
        initGrid();
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
