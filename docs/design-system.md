# Design System

All pages share `public/styles.css`. The system is built on CSS custom properties (tokens), a small set of utility classes, and a single font pair.

## Tokens

Defined on `:root`:

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0b0b0b` | Page background |
| `--bg-elevated` | `#111111` | Cards, gallery items |
| `--text` | `#e7e7e7` | Body copy |
| `--muted` | `#9a9a9a` | Secondary text, captions |
| `--accent` | `#ffffff` | Headings, primary CTA background, brand mark |
| `--line` | `rgba(255,255,255,0.10)` | Borders, dividers |
| `--line-subtle` | `rgba(255,255,255,0.05)` | Section separators |
| `--card` | `#111` | Alias for `--bg-elevated` |
| `--radius` | `10px` | Default border-radius |
| `--radius-lg` | `16px` | Cards, principle grid |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Shared animation easing |
| `--font` | `"Inter", sans-serif` | Body font |

## Typography

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| `h1` | `clamp(2.4rem, 6vw, 3.6rem)` | 600 | Fluid, letter-spacing −0.02em |
| `h2` | `clamp(1.8rem, 4vw, 2.4rem)` | 600 | |
| `h3` | `1.25rem` | 600 | |
| `p` | `1rem` | 400 | `opacity: 0.85`, max-width 720 px |
| `.muted` | `0.92rem` | 400 | `color: var(--muted)` |
| `.eyebrow` | `0.7rem` | 400 | Space Mono, uppercase, 0.14em spacing |

Two fonts are loaded from Google Fonts:

- **Inter** (300, 400, 500, 600) — body and UI
- **Space Mono** (400, 700) — labels, counters, eyebrows, meta items

## Components

### Button

```html
<a class="btn" href="/about">Label</a>
<a class="btn btn--primary" href="/about">Label</a>
```

`.btn` — ghost pill (transparent bg, `--line` border).  
`.btn--primary` — filled pill (white bg, black text).

### Card

```html
<div class="card">…</div>
```

`background: var(--bg-elevated)`, `border: 1px solid var(--line)`, `border-radius: var(--radius-lg)`. Hover lifts border opacity and adds a shadow.

### Eyebrow

```html
<span class="eyebrow">Section label</span>
```

Small uppercase mono label used above section headings.

### Scroll Reveal

Add `data-reveal` to any element to animate it in on scroll:

```html
<div data-reveal>…</div>
```

Starts at `opacity: 0; transform: translateY(28px)`. The `IntersectionObserver` in `app.js` adds `.visible` (restores both) when the element enters the viewport.

### Counter

```html
<span data-count="48"></span>
```

Counts from 0 to the target value over ~1.6 s when scrolled into view.

## Background grid

A fixed `::before` pseudo-element on `<body>` renders a subtle 60 px dot-grid using two `linear-gradient` backgrounds at `rgba(255,255,255,0.018)`. It sits at `z-index: 0`; the `.container` sits at `z-index: 1`.

## Responsive breakpoints

| Breakpoint | Changes |
|-----------|---------|
| `≤ 768px` | Mobile nav drawer, single-column layouts, reduced padding |
| `≤ 480px` | Tighter container (90%), smaller h1 |

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All transitions and animations are disabled for users who prefer reduced motion.
