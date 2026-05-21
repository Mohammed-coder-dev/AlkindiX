# Architecture

## Overview

AlkindiX is a zero-build static site served by Vercel. There are no frameworks, bundlers, or build steps — just HTML, CSS, and vanilla JavaScript.

## File roles

| File | Purpose |
|------|---------|
| `public/index.html` | Home page — centred hero, social bar |
| `public/about.html` | About page — bio grid, principles, timeline |
| `public/photography.html` | Masonry gallery with lightbox |
| `public/memoir.html` | Memoir — excerpt cards |
| `public/styles.css` | Shared design system (tokens, nav, buttons, cards, reveal, footer, social bar) |
| `public/app.js` | Shared behaviour (mobile nav, scroll progress, active link, scroll reveal, counter animation, smooth scroll, page fade-in) |
| `public/robots.txt` | Crawler directives |
| `public/sitemap.xml` | Pages indexed by search engines |
| `public/favicon.svg` | SVG favicon, scales to any size |
| `public/images/` | Photography assets (`h*.jpg`, `v*.jpg`) |
| `vercel.json` | URL rewrites, redirects, security headers, cache policy |

## Routing

Vercel rewrites clean URLs to the files in `public/`:

```
/              → public/index.html
/about         → public/about.html
/photography   → public/photography.html
/memoir        → public/memoir.html
/robots.txt    → public/robots.txt
/sitemap.xml   → public/sitemap.xml
```

Short-link redirects (non-permanent):

```
/linkedin  → linkedin.com/in/alkindi-network/
/github    → github.com/MohammedAlkindi/
```

Domain aliases (permanent 301):

```
photographyx.org/*         → alkindix.com/photography
architectofsilence.com/*   → alkindix.com/memoir
```

## JavaScript behaviour (`app.js`)

All pages include `app.js`. It initialises only what is present in the DOM, so unused features are no-ops.

| Feature | Trigger | Mechanism |
|---------|---------|-----------|
| Mobile nav | `.nav__toggle` click | Toggle `.active` class, `aria-expanded` |
| Nav scroll state | `window.scroll` | `.scrolled` class on `.nav` above 40 px |
| Scroll progress bar | `window.scroll` | Injected `div.scroll-progress`, width set by % scrolled |
| Active nav link | Page load | Compares `window.location.pathname` to each `<a>` href |
| Scroll reveal | `[data-reveal]` elements | `IntersectionObserver`, adds `.visible` class |
| Counter animation | `[data-count]` elements | `IntersectionObserver`, RAF-driven integer count-up |
| Smooth scroll | `a[href^="#"]` | `scrollTo({ behavior: 'smooth' })` |
| Page fade-in | `DOMContentLoaded` | Adds `.loaded` to `<body>` (opacity 0 → 1) |

## Photography gallery (`photography.html`)

Images are loaded by JavaScript at runtime — the gallery self-heals as photos are added or removed:

1. A hardcoded `IMAGES` array lists expected filenames (`h1`–`h31`).
2. For each name, a `new Image()` probe fires an `onload`/`onerror`.
3. Images that load successfully are inserted into the grid in original order.
4. Missing images are silently skipped (no broken-image placeholders).
5. The frame counter updates after all probes settle.

To extend the gallery add entries to the `IMAGES` array and drop the corresponding files in `public/images/`.

## Caching policy

Set in `vercel.json`:

| Asset type | `Cache-Control` |
|------------|----------------|
| `public/images/*` | `public, max-age=31536000, immutable` |
| `public/*.css`, `public/*.js` | `public, max-age=31536000, immutable` |
| Everything else | Vercel default |

Because assets are immutable-cached for one year, any file update requires a filename change (or a new Vercel deployment clears the edge cache automatically).
