/* ============================================================
   AlkindiX — main.js
   - No frameworks, no trackers
   - A11y-first, CSP-friendly
   - Works on static hosting (Vercel)
   - Enhancements: reduced-motion safe smooth scroll, hash-focus,
     keyboard shortcuts, copy-to-clipboard, offline banner,
     UTM stripping, viewport height fix, SW (if present),
     safer menu UX, smarter newsletter messaging.
   ============================================================ */

/* --------------------------------------------
 * Bootstrap
 * ------------------------------------------*/
const html = document.documentElement;
html.classList.remove('no-js'); // allow .no-js fallbacks to hide

// Footer year
const yearEl = document.getElementById('y');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile viewport height fix (iOS 100vh)
function setVHUnit() {
  const vh = window.innerHeight * 0.01;
  html.style.setProperty('--vh', `${vh}px`);
}
setVHUnit();
window.addEventListener('resize', () => {
  // throttle
  clearTimeout(setVHUnit._t);
  setVHUnit._t = setTimeout(setVHUnit, 120);
});

/* --------------------------------------------
 * Theme: light | dark | auto (system)
 * - persists to localStorage
 * - honors prefers-color-scheme when "auto"
 * - keyboard shortcut: press "t" to cycle
 * ------------------------------------------*/
const THEME_KEY = 'theme'; // 'light' | 'dark' | 'auto'
const themeBtn = document.querySelector('.theme-toggle');
const mqDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(mode) {
  // mode: 'light' | 'dark' | 'auto'
  if (mode === 'auto') {
    html.removeAttribute('data-theme'); // allow system to decide via CSS
    themeBtn?.setAttribute('aria-pressed', String(mqDark.matches));
    themeBtn?.setAttribute('data-mode', 'auto');
    return;
  }
  html.setAttribute('data-theme', mode);
  themeBtn?.setAttribute('aria-pressed', String(mode === 'dark'));
  themeBtn?.setAttribute('data-mode', mode);
}

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'auto';
}

function setTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
}

// init
applyTheme(getSavedTheme());
// keep in sync when system theme changes and user is on "auto"
mqDark.addEventListener?.('change', () => {
  if (getSavedTheme() === 'auto') applyTheme('auto');
});

// button cycles: auto → dark → light → auto
themeBtn?.addEventListener('click', () => {
  const order = ['auto', 'dark', 'light'];
  const current = getSavedTheme();
  const next = order[(order.indexOf(current) + 1) % order.length];
  setTheme(next);
  const label =
    next === 'auto'
      ? 'Theme: Auto'
      : `Theme: ${next[0].toUpperCase()}${next.slice(1)}`;
  themeBtn.setAttribute('aria-label', label);
});

// keyboard shortcut: "t" to cycle theme (ignores when typing in inputs)
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 't' && !e.altKey && !e.ctrlKey && !e.metaKey) {
    const el = document.activeElement;
    const editing =
      el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    if (!editing) themeBtn?.click();
  }
});

/* --------------------------------------------
 * Mobile Menu (accessible)
 * - toggles hidden/aria-modal
 * - ESC to close
 * - click outside to close
 * - focus trap while open
 * - auto-close when a link inside is clicked
 * - closes on resize up (md+)
 * ------------------------------------------*/
const menuBtn = document.querySelector('.menu-btn > button');
const panel = document.getElementById('menuPanel');
let lastFocused = null;

function isOpen() {
  return panel && !panel.hasAttribute('hidden');
}

function openMenu() {
  if (!menuBtn || !panel) return;
  lastFocused = document.activeElement;
  menuBtn.setAttribute('aria-expanded', 'true');
  panel.removeAttribute('hidden');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('role', 'dialog');
  // move focus to first focusable
  const focusables = panel.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusables.length && focusables[0].focus();
}

function closeMenu() {
  if (!menuBtn || !panel) return;
  menuBtn.setAttribute('aria-expanded', 'false');
  panel.setAttribute('hidden', '');
  panel.setAttribute('aria-modal', 'false');
  if (lastFocused) lastFocused.focus();
}

menuBtn?.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen()) {
    e.preventDefault();
    closeMenu();
  }
});

// click outside
document.addEventListener('click', (e) => {
  if (!isOpen() || !panel) return;
  const withinPanel = panel.contains(e.target);
  const withinBtn = menuBtn.contains(e.target);
  if (!withinPanel && !withinBtn) closeMenu();
});

// close when a link inside the panel is activated
panel?.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  // internal nav: close and let link proceed
  closeMenu();
});

// basic focus trap
document.addEventListener('keydown', (e) => {
  if (!isOpen() || e.key !== 'Tab' || !panel) return;
  const focusables = panel.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

// close menu on md+ layouts when resizing up
const CLOSE_BREAKPOINT = 840;
let resizeTO;
window.addEventListener('resize', () => {
  clearTimeout(resizeTO);
  resizeTO = setTimeout(() => {
    if (window.innerWidth >= CLOSE_BREAKPOINT && isOpen()) closeMenu();
  }, 100);
});

/* --------------------------------------------
 * Smooth in-page navigation (hash links)
 * - Respects reduced motion
 * - On page load with hash, focus target
 * ------------------------------------------*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start'
  });
  // make it keyboard-focusable momentarily for SR/visual focus
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  setTimeout(() => target.removeAttribute('tabindex'), 300);
  // update URL hash without jumping
  history.pushState(null, '', `#${id}`);
});

// If page loads with a hash, focus the section for a11y
window.addEventListener('load', () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  setTimeout(() => target.removeAttribute('tabindex'), 300);
});

/* --------------------------------------------
 * Harden external links opened in new tabs
 * ------------------------------------------*/
for (const a of document.querySelectorAll('a[target="_blank"]')) {
  const rel = (a.getAttribute('rel') || '').split(/\s+/);
  if (!rel.includes('noopener')) rel.push('noopener');
  if (!rel.includes('noreferrer')) rel.push('noreferrer');
  a.setAttribute('rel', rel.join(' ').trim());
}

/* --------------------------------------------
 * Strip UTM params on internal navigation
 * (keeps clean URLs while preserving referrer)
 * ------------------------------------------*/
(function stripUTM() {
  if (!location.search) return;
  const params = new URLSearchParams(location.search);
  let changed = false;
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
    if (params.has(k)) {
      params.delete(k);
      changed = true;
    }
  });
  if (changed) {
    const q = params.toString();
    const newUrl = location.pathname + (q ? `?${q}` : '') + location.hash;
    history.replaceState(null, '', newUrl);
  }
})();

/* --------------------------------------------
 * Copy-to-clipboard for elements with [data-copy]
 * - Adds aria-live feedback into a sibling [data-copy-status]
 * ------------------------------------------*/
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const text = btn.getAttribute('data-copy') || btn.textContent || '';
  const status = btn.parentElement?.querySelector('[data-copy-status]');
  try {
    await navigator.clipboard.writeText(text.trim());
    status && (status.textContent = 'Copied');
    btn.setAttribute('aria-label', 'Copied');
    setTimeout(() => {
      status && (status.textContent = '');
      btn.removeAttribute('aria-label');
    }, 1200);
  } catch {
    status && (status.textContent = 'Copy failed');
    setTimeout(() => (status.textContent = ''), 1200);
  }
});

/* --------------------------------------------
 * Optional offline banner (progressive)
 * Add <div id="offlineBanner" hidden>You're offline.</div> to HTML
 * ------------------------------------------*/
(function offlineBanner() {
  const banner = document.getElementById('offlineBanner');
  if (!banner) return;
  function set(v) {
    if (v) banner.removeAttribute('hidden');
    else banner.setAttribute('hidden', '');
  }
  set(!navigator.onLine);
  window.addEventListener('online', () => set(false));
  window.addEventListener('offline', () => set(true));
})();

/* --------------------------------------------
 * Service Worker registration (only if /sw.js exists)
 * Won’t throw 404s on static hosts without SW.
 * ------------------------------------------*/
if ('serviceWorker' in navigator) {
  // HEAD to avoid downloading the file if it isn’t there
  fetch('/sw.js', { method: 'HEAD' })
    .then((r) => {
      if (r.ok) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }
    })
    .catch(() => {});
}

/* --------------------------------------------
 * Keyboard shortcut: "/" focuses a site search input
 * Requires an element like: <input data-search>
 * ------------------------------------------*/
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
    const el = document.querySelector('[data-search]');
    const active = document.activeElement;
    const editing =
      active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    if (el && !editing) {
      e.preventDefault();
      el.focus();
    }
  }
});

/* --------------------------------------------
 * Newsletter form (progressive enhancement)
 * - serverless-friendly
 * - shows inline status (aria-live)
 * - smarter messages for common API responses
 * ------------------------------------------*/
const form = document.querySelector('form[action="/api/subscribe"]');
if (form) {
  // status element
  let status = form.querySelector('[data-status]');
  if (!status) {
    status = document.createElement('div');
    status.setAttribute('data-status', '');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.className = 'small';
    status.style.marginTop = '8px';
    form.appendChild(status);
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    // Honeypot guard
    if (fd.get('website')) return;

    // basic client-side email check (non-blocking)
    const email = String(fd.get('email') || '').trim();
    const ok = /\S+@\S+\.\S+/.test(email);
    if (!ok) {
      status.textContent = 'Please provide a valid email address.';
      return;
    }

    submitBtn && (submitBtn.disabled = true);
    submitBtn && submitBtn.setAttribute('aria-busy', 'true');
    status.textContent = 'Submitting…';

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        body: fd
      });

      // Try JSON first
      let message = '';
      let json = null;
      const type = res.headers.get('content-type') || '';
      if (type.includes('application/json')) {
        json = await res.json().catch(() => null);
      }
      if (json && typeof json.message === 'string') {
        message = json.message;
      } else {
        // Fallback based on status
        if (res.ok) {
          message = 'Subscribed. Check your inbox.';
        } else if (res.status === 409) {
          message = 'You’re already subscribed.';
        } else if (res.status === 429) {
          message = 'Too many attempts. Please try again later.';
        } else if (res.status >= 500) {
          message = 'Server error. Please try again shortly.';
        } else {
          message = 'Subscription failed.';
        }
      }

      status.textContent = message;
      if (res.ok) form.reset();
    } catch {
      status.textContent = 'Network error. Please try again.';
    } finally {
      submitBtn && (submitBtn.disabled = false);
      submitBtn && submitBtn.removeAttribute('aria-busy');
    }
  });
}
