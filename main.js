// Year
document.getElementById('y').textContent = new Date().getFullYear();

// Theme toggle (persist in localStorage)
const root = document.documentElement;
const themeBtn = document.querySelector('.theme-toggle');
if (themeBtn) {
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
  });
}

// Mobile menu
const menuBtn = document.querySelector('.menu-btn > button');
const panel = document.getElementById('menuPanel');
if (menuBtn && panel) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    if (open) {
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-modal', 'false');
    } else {
      panel.removeAttribute('hidden');
      panel.setAttribute('aria-modal', 'true');
    }
  });
}

// Progressive enhancement for /api/subscribe (works without JS too)
const form = document.querySelector('form[action="/api/subscribe"]');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    // Honeypot
    if (data.get('website')) return;
    const res = await fetch('/api/subscribe', { method: 'POST', body: data });
    alert(res.ok ? 'Subscribed. Check your inbox.' : 'Subscription failed. Try again later.');
    if (res.ok) form.reset();
  });
}
