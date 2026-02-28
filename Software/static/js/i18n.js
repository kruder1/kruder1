/* =============================================================================
   KRUDER 1 - I18N
   Language dictionaries loaded from static/locales/{lang}.json
   Fallback: en. Persisted in settings.json.
   ============================================================================= */

(function() {
    'use strict';

    const SUPPORTED = ['en', 'es', 'ja', 'fr', 'de', 'it', 'pt', 'zh', 'ru', 'ar'];
    const FALLBACK = 'en';

    const i18n = {
        dict: {},
        lang: FALLBACK,

        async load(lang) {
            const code = SUPPORTED.includes(lang) ? lang : FALLBACK;
            try {
                const res = await fetch(`/static/locales/${code}.json`);
                if (res.ok) {
                    this.dict = await res.json();
                    this.lang = code;
                    this.apply();
                    return true;
                }
            } catch (e) {
                console.warn('[i18n] Failed to load', code, e);
            }
            if (code !== FALLBACK) {
                return this.load(FALLBACK);
            }
            this.dict = {};
            return false;
        },

        t(key, params) {
            const parts = String(key).split('.');
            let val = this.dict;
            for (const p of parts) {
                val = val && val[p];
            }
            let s = (val != null && typeof val === 'string') ? val : key;
            if (params && typeof params === 'object') {
                Object.keys(params).forEach(k => {
                    s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
                });
            }
            return s;
        },

        apply() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const attr = el.getAttribute('data-i18n-attr') || 'text';
                const val = this.t(key);
                if (attr === 'text') {
                    el.textContent = val;
                } else if (attr === 'placeholder') {
                    el.placeholder = val;
                } else if (attr === 'title' || attr === 'aria-label') {
                    el.setAttribute(attr, val);
                }
            });
            window.dispatchEvent(new Event('languagechange'));
        },

        async setLanguage(code) {
            if (!code || typeof code !== 'string') return false;
            try {
                if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.update_setting === 'function') {
                    await window.pywebview.api.update_setting('language', code);
                }
                const ok = await this.load(code);
                if (ok) this.apply();
                return ok;
            } catch (e) {
                console.warn('[i18n] setLanguage failed', e);
                return false;
            }
        }
    };

    window.i18n = i18n;
    window.t = (key, params) => i18n.t(key, params);
})();
