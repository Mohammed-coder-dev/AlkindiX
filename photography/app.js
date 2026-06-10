// =========================================================
// PhotographyX — Gallery Controller (Production Grade)
// =========================================================

// Configuration
const IMAGES_DIR = 'images';
const MAX_IMAGES = 50;
const EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'];

// Optional captions
const imageCaptions = {
  // Horizontal images
  'h1': 'Terraced order at dusk',
  'h2': 'Geometry across hillsides',
  'h3': 'Light mapping structure',
  'h4': 'Agricultural patterns from above',
  'h5': 'Human scale in vast landscape',

  // Vertical images
  'v1': 'Human scale in symmetry',
  'v2': 'Vertical tension in light',
  'v3': 'Silence between forms',
  'v4': 'Portrait of structure',
  'v5': 'Minimal presence',
};

// State management
let horizontalImages = [];
let verticalImages = [];
let currentGallery = [];
let currentImageIndex = 0;

// DOM elements
const horizontalGallery = document.querySelector('.horizontal-gallery');
const verticalGallery = document.querySelector('.vertical-gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

// =========================================================
// Utility Functions
// =========================================================

function toAbsoluteUrl(relativePath) {
  return new URL(relativePath, window.location.href).toString();
}

function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function firstExistingSrc(baseName) {
  for (const ext of EXTENSIONS) {
    const candidate = toAbsoluteUrl(`${IMAGES_DIR}/${baseName}.${ext}`);
    if (await imageExists(candidate)) return candidate;
  }
  return null;
}

// =========================================================
// Gallery Loading
// =========================================================

async function loadSeries(prefix) {
  const images = [];

  for (let i = 1; i <= MAX_IMAGES; i++) {
    const filename = `${prefix}${i}`;
    const src = await firstExistingSrc(filename);

    if (src) {
      images.push({
        src,
        caption: imageCaptions[filename] || '',
        filename
      });
    }
  }

  console.log(`[PhotographyX] Loaded ${prefix}-images:`, images.length);
  return images;
}

function createImageElement(image, index, gallery) {
  const img = document.createElement('img');
  img.src = image.src;
  img.alt = image.caption || 'Photography';
  img.loading = 'lazy';
  img.setAttribute('aria-label', `View ${image.caption || 'image'} in lightbox`);
  img.addEventListener('click', () => openLightbox(index, gallery));
  
  return img;
}

function populateGallery(images, container, galleryType) {
  if (!container) return;

  container.innerHTML = '';

  if (images.length === 0) {
    const placeholder = document.createElement('p');
    placeholder.textContent = 'No images found';
    placeholder.style.opacity = '0.5';
    placeholder.style.textAlign = 'center';
    placeholder.style.gridColumn = '1 / -1';
    container.appendChild(placeholder);
    return;
  }

  images.forEach((image, index) => {
    const imgElement = createImageElement(image, index, galleryType);
    container.appendChild(imgElement);
  });
}

// =========================================================
// Lightbox Functions
// =========================================================

function openLightbox(index, gallery) {
  currentGallery = gallery === 'horizontal' ? horizontalImages : verticalImages;
  currentImageIndex = index;
  
  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus management for accessibility
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  
  setTimeout(() => {
    lightboxImg.src = '';
  }, 300);
}

function updateLightboxImage() {
  if (currentGallery.length === 0) return;
  
  const image = currentGallery[currentImageIndex];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.caption || 'Photography';
  lightboxCaption.textContent = image.caption || '';
  
  // Update counter
  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
  }
  
  // Update navigation button states
  if (prevBtn) {
    prevBtn.style.opacity = currentImageIndex === 0 ? '0.3' : '0.7';
    prevBtn.style.pointerEvents = currentImageIndex === 0 ? 'none' : 'auto';
  }
  
  if (nextBtn) {
    nextBtn.style.opacity = currentImageIndex === currentGallery.length - 1 ? '0.3' : '0.7';
    nextBtn.style.pointerEvents = currentImageIndex === currentGallery.length - 1 ? 'none' : 'auto';
  }
}

function showNextImage() {
  if (currentImageIndex < currentGallery.length - 1) {
    currentImageIndex++;
    updateLightboxImage();
  }
}

function showPreviousImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    updateLightboxImage();
  }
}

// =========================================================
// Gallery Initialization
// =========================================================

async function initGalleries() {
  // Show loading state
  if (horizontalGallery) {
    horizontalGallery.innerHTML = '<div class="gallery-loading"></div>';
  }
  if (verticalGallery) {
    verticalGallery.innerHTML = '<div class="gallery-loading"></div>';
  }

  // Load images
  horizontalImages = await loadSeries('h');
  verticalImages = await loadSeries('v');

  // Populate galleries
  populateGallery(horizontalImages, horizontalGallery, 'horizontal');
  populateGallery(verticalImages, verticalGallery, 'vertical');

  // Observe images for scroll animations
  setTimeout(() => {
    document.querySelectorAll('.gallery img').forEach(img => {
      imageObserver.observe(img);
    });
  }, 100);
}

// =========================================================
// Lightbox Event Listeners
// =========================================================

if (closeBtn) {
  closeBtn.addEventListener('click', closeLightbox);
}

if (prevBtn) {
  prevBtn.addEventListener('click', showPreviousImage);
}

if (nextBtn) {
  nextBtn.addEventListener('click', showNextImage);
}

// Click outside image to close
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  switch(e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowRight':
      showNextImage();
      break;
    case 'ArrowLeft':
      showPreviousImage();
      break;
  }
});

// =========================================================
// Mobile Navigation
// =========================================================

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// =========================================================
// Smooth Scroll
// =========================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href === '#' || href === '#hero') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const nav = document.querySelector('.nav');
      const offset = nav ? nav.offsetHeight + 20 : 100;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// =========================================================
// Active Nav Highlighting
// =========================================================

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__links a[href^="#"]');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${sectionId}`) {
          item.classList.add('active');
        }
      });
    }
  });
  
  // Add scrolled class to nav
  const nav = document.querySelector('.nav');
  if (nav) {
    if (scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
}

let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
  scrollTimeout = window.requestAnimationFrame(() => highlightNavOnScroll());
});

// =========================================================
// Image Loading Animation
// =========================================================

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transform = 'scale(0.95)';

      setTimeout(() => {
        img.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 50);

      imageObserver.unobserve(img);
    }
  });
}, { threshold: 0.1, rootMargin: '100px' });

// =========================================================
// Scroll Reveal Animation
// =========================================================

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px' });

// =========================================================
// Counter Animation
// =========================================================

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// =========================================================
// Initialize Everything
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize galleries
  initGalleries();
  
  // Initial nav highlighting
  highlightNavOnScroll();
  
  // Observe scroll reveal elements
  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    scrollObserver.observe(el);
  });
  
  // Observe counter elements
  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });
  
  console.log('[PhotographyX] Portfolio initialized');
});

// =========================================================
// Performance: Preload critical images
// =========================================================

window.addEventListener('load', () => {
  // Preload first few images of each gallery
  const preloadImages = [...horizontalImages.slice(0, 2), ...verticalImages.slice(0, 2)];
  preloadImages.forEach(image => {
    const img = new Image();
    img.src = image.src;
  });
});

// =========================================================
// Error Handling
// =========================================================

window.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    console.error('[PhotographyX] Image failed to load:', e.target.src);
    // Optionally add a placeholder or error state
  }
}, true);

// =========================================================
// Accessibility: Focus management
// =========================================================

// Trap focus within lightbox when open
lightbox?.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  
  const focusableElements = lightbox.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});