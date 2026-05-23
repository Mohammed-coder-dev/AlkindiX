// =========================================================
// AlkindiX — Shared App Logic
// =========================================================

// Nav toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Projects dropdown
const dropdown = document.querySelector('.nav__dropdown');
const dropdownBtn = dropdown?.querySelector('.nav__dropdown-btn');

if (dropdown && dropdownBtn) {
  dropdownBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('active');
    dropdownBtn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  dropdown.querySelectorAll('.nav__dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
      dropdown.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Nav scroll state
const nav = document.querySelector('.nav');
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement;
  progressBar.style.width = (window.scrollY / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

// Active nav link based on current path
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav__links a, .nav__dropdown-menu a').forEach(a => {
  const href = a.getAttribute('href');
  const hrefPath = href ? new URL(href, window.location.href).pathname.replace(/\/$/, '') : '';
  if (hrefPath === currentPath) {
    a.classList.add('active');
    const parentDropdown = a.closest('.nav__dropdown');
    if (parentDropdown) parentDropdown.classList.add('active');
  }
});

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const dur = 1600;
  const step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur);
    if (cur >= target) clearInterval(t);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Page load fade-in
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});

// Hero typewriter (index page only)
(function () {
  const h1 = document.querySelector('.hero__h1');
  const sub = document.querySelector('.hero__sub');
  const actions = document.querySelector('.hero__actions');
  if (!h1 || !sub || !actions) return;

  const H1_TEXT = 'Hi, I am Alkindi.';
  const SUB_TEXT = 'I build and study systems where ideas become structure and structure becomes clarity. This space documents research tools, computational projects, and long-form thinking.';

  h1.textContent = '';
  sub.textContent = '';
  actions.style.opacity = '0';
  actions.style.transition = 'opacity 0.4s ease';

  function type(el, text, speed, done) {
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    el.appendChild(cursor);
    let i = 0;
    (function tick() {
      if (i < text.length) {
        cursor.insertAdjacentText('beforebegin', text[i++]);
        setTimeout(tick, speed);
      } else {
        cursor.remove();
        done && done();
      }
    })();
  }

  document.addEventListener('DOMContentLoaded', () => {
    type(h1, H1_TEXT, 60, () => {
      setTimeout(() => {
        type(sub, SUB_TEXT, 30, () => {
          setTimeout(() => { actions.style.opacity = '1'; }, 400);
        });
      }, 300);
    });
  });
})();