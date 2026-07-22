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

// Nav scroll state
const nav = document.querySelector('.nav');
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement;
  const scrollableDistance = h.scrollHeight - h.clientHeight;
  const progress = scrollableDistance > 0 ? window.scrollY / scrollableDistance * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });

// Active nav link based on current path
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav__menu a, .nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  const hrefPath = href ? new URL(href, window.location.href).pathname.replace(/\/$/, '') : '';
  if (hrefPath === currentPath) {
    a.classList.add('active');
  }
});

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

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
const lightboxPrevious = lightbox?.querySelector('[data-lightbox-prev]');
const lightboxNext = lightbox?.querySelector('[data-lightbox-next]');
let lightboxItems = [];
let lightboxIndex = 0;
let lightboxTrigger = null;

function showLightboxImage() {
  const button = lightboxItems[lightboxIndex];
  if (!button || !lightboxImage) return;

  lightboxImage.src = button.dataset.lightboxSrc;
  lightboxImage.alt = `Photograph ${lightboxIndex + 1} of ${lightboxItems.length}`;
  if (lightboxCaption) {
    lightboxCaption.textContent = `${String(lightboxIndex + 1).padStart(2, '0')} / ${String(lightboxItems.length).padStart(2, '0')}`;
  }
}

function moveLightbox(step) {
  if (!lightboxItems.length) return;
  lightboxIndex = (lightboxIndex + step + lightboxItems.length) % lightboxItems.length;
  showLightboxImage();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.setAttribute('hidden', '');
  lightboxImage?.removeAttribute('src');
  lightboxImage?.setAttribute('alt', '');
  document.body.style.overflow = '';
  lightboxTrigger?.focus();
}

document.querySelectorAll('[data-lightbox-src]').forEach(button => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxItems = [...document.querySelectorAll('[data-lightbox-src]')].filter(item => !item.hidden);
    lightboxIndex = Math.max(0, lightboxItems.indexOf(button));
    lightboxTrigger = button;
    showLightboxImage();
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrevious?.addEventListener('click', () => moveLightbox(-1));
lightboxNext?.addEventListener('click', () => moveLightbox(1));
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (!lightbox || lightbox.hasAttribute('hidden')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
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
