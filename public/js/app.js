// =========================================================
// AlkindiX — Shared App Logic
// =========================================================

// Nav overlay
const navToggle = document.querySelector('.nav__toggle');
const navOverlay = document.getElementById('navOverlay');

function closeOverlay() {
  navOverlay?.classList.remove('active');
  navToggle?.classList.remove('active');
  navToggle?.setAttribute('aria-expanded', 'false');
  navOverlay?.setAttribute('aria-hidden', 'true');
  navOverlay?.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

if (navToggle && navOverlay) {
  navToggle.addEventListener('click', () => {
    const open = !navOverlay.classList.contains('active');

    if (!open) {
      closeOverlay();
      return;
    }

    navOverlay.removeAttribute('hidden');
    navOverlay.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeOverlay);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlay();
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
document.querySelectorAll('.nav__menu a, .nav__links a, .nav__dropdown-menu a').forEach(a => {
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

// Quiet text rotator
document.querySelectorAll('[data-rotator]').forEach(el => {
  const items = (el.dataset.rotator || '').split('|').map(item => item.trim()).filter(Boolean);
  if (items.length < 2) return;

  let index = 0;
  el.textContent = items[index];

  window.setInterval(() => {
    index = (index + 1) % items.length;
    el.classList.add('is-changing');

    window.setTimeout(() => {
      el.textContent = items[index];
      el.classList.remove('is-changing');
    }, 180);
  }, 2600);
});

// Project filters
document.querySelectorAll('[data-project-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter;
    const group = button.closest('[data-filter-group]');
    const scope = button.closest('section') || document;

    group?.querySelectorAll('[data-project-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    scope.querySelectorAll('[data-project-category]').forEach(card => {
      const match = filter === 'all' || card.dataset.projectCategory === filter;
      card.toggleAttribute('hidden', !match);
    });
  });
});

// Photography filters
document.querySelectorAll('[data-gallery-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.galleryFilter;
    const group = button.closest('[data-filter-group]');
    const gallery = document.querySelector('[data-gallery]');

    group?.querySelectorAll('[data-gallery-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    gallery?.querySelectorAll('[data-gallery-item]').forEach(item => {
      const match = filter === 'all' || item.dataset.galleryItem === filter;
      item.toggleAttribute('hidden', !match);
    });
  });
});

// Photo lightbox
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
const lightboxClose = lightbox?.querySelector('[data-lightbox-close]');

function closeLightbox() {
  if (!lightbox) return;
  lightbox.setAttribute('hidden', '');
  lightboxImage?.removeAttribute('src');
  lightboxImage?.setAttribute('alt', '');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox-src]').forEach(button => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    const image = button.querySelector('img');
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = image?.alt || 'Selected photograph';
    if (lightboxCaption) lightboxCaption.textContent = button.dataset.lightboxCaption || '';
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeLightbox();
});

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
