/* ============================================================
   AlkindiX — main.js
   - No frameworks, no trackers
   - A11y-first, CSP-friendly
   - Works on static hosting (Vercel)
   ============================================================ */

/* --------------------------------------------
 * Bootstrap
 * ------------------------------------------*/
const html = document.documentElement;
html.classList.remove('no-js'); // allow .no-js fallbacks to hide

// Footer year
const yearEl = document.getElementById('y');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* --------------------------------------------
 * Theme: light | dark | auto (system)
 * - persists to localStorage
 * - honors prefers-color-scheme when "auto"
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
  // Optional inline label update
  const label = next === 'auto' ? 'Theme: Auto' : `Theme: ${next[0].toUpperCase()}${next.slice(1)}`;
  themeBtn.setAttribute('aria-label', label);
});

/* --------------------------------------------
 * Mobile Menu (accessible)
 * - toggles hidden/aria-modal
 * - ESC to close
 * - click outside to close
 * - simple focus trap while open
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
  // move focus to first focusable
  const focusables = panel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
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

// basic focus trap
document.addEventListener('keydown', (e) => {
  if (!isOpen() || e.key !== 'Tab' || !panel) return;
  const focusables = panel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
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
 * ------------------------------------------*/
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // make it keyboard-focusable momentarily for SR/visual focus
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
 * Newsletter form (progressive enhancement)
 * - serverless-friendly
 * - shows inline status (aria-live)
 * ------------------------------------------*/
const form = document.querySelector('form[action="/api/subscribe"]');
if (form) {
  // status element
  let status = form.querySelector('[data-status]');
  if (!status) {
    status = document.createElement('div');
    status.setAttribute('data-status', '');
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
    const email = String(fd.get('email') || '');
    const ok = /\S+@\S+\.\S+/.test(email);
    if (!ok) {
      status.textContent = 'Please provide a valid email address.';
      return;
    }

    submitBtn && (submitBtn.disabled = true);
    status.textContent = 'Submitting…';

    try {
      const res = await fetch('/api/subscribe', { method: 'POST', body: fd });
      const type = res.headers.get('content-type') || '';
      let msg = '';
      if (type.includes('application/json')) {
        const json = await res.json().catch(() => ({}));
        msg = json.message || (res.ok ? 'Subscribed. Check your inbox.' : 'Subscription failed.');
      } else {
        msg = res.ok ? 'Subscribed. Check your inbox.' : 'Subscription failed.';
      }
      status.textContent = msg;
      if (res.ok) form.reset();
    } catch (err) {
      status.textContent = 'Network error. Please try again.';
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
}
