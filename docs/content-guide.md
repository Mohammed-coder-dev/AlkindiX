# Content Guide

How to update each part of the site without touching the layout or styles.

## About page (`public/about.html`)

### Bio text

Edit the paragraphs inside `<div class="about-body">`. Each `<p>` is a paragraph of body copy. The `<h3>` tags are subsection headings ("Research interests", etc.).

### Sidebar meta

Edit the `<span class="meta-item__value">` text inside `<div class="about-sidebar__meta">`:

```html
<div class="meta-item">
  <span class="meta-item__label">Based in</span>
  <span class="meta-item__value">New York · Lisbon · Kyoto</span>
</div>
```

### Principles grid

Each principle is a `<div class="principle-card">`. To add one, copy an existing card and update the number, title, and description. The grid uses `auto-fill` with `minmax(280px, 1fr)` so new cards reflow automatically.

### Timeline

Each entry is a `<div class="timeline-item">` inside `<div class="timeline">`. To add a milestone, copy an existing item and update the year, heading, and description paragraph. Items are displayed top-to-bottom in DOM order — newest first by convention.

---

## Memoir page (`public/memoir.html`)

Each excerpt is a card component. To add a new excerpt, copy an existing card block and update:
- The eyebrow label (chapter number / section)
- The heading
- The body text
- Any pull-quote if present

---

## Home page (`public/index.html`)

### Hero text

Edit the `<h1>` and `<p class="hero__sub">` inside `<section class="hero">`.

### Hero buttons

Edit or add `<a class="btn …">` elements inside `<div class="hero__actions">`.

### Social bar

The fixed bottom bar lists social links as `<a class="social-bar__link">` elements. Each contains an inline SVG icon and an `aria-label`. To add a platform, copy an existing link and replace the `href`, `aria-label`, and SVG.

---

## Shared navigation (`public/*.html`)

The nav is duplicated across all HTML files — update each one when adding or renaming a link. The `app.js` active-link logic compares `window.location.pathname` to each `href`, so no additional changes are needed when updating links.

---

## SEO

- **Page title**: `<title>` in `<head>`
- **Meta description**: `<meta name="description">`
- **Canonical URL**: `<link rel="canonical" href="…">`
- **Open Graph**: `og:title`, `og:description`, `og:type`
- **Sitemap**: update `public/sitemap.xml` if a page is added or removed
