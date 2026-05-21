# Deployment

## Overview

The site is deployed on Vercel as a static project. There is no build step — Vercel serves the files directly.

## First-time setup

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
3. Leave all build settings blank (no framework preset, no build command, no output directory).
4. Click **Deploy**.

Vercel reads `vercel.json` automatically and applies all rewrites, redirects, and headers.

## Continuous deployment

Every push to `main` triggers a new production deployment. Pull requests get preview deployments at a unique URL.

## Custom domain

1. In the Vercel project → **Settings → Domains** → add `alkindix.com`.
2. Update your DNS registrar:
   - `A` record: `76.76.21.21`
   - `CNAME` for `www`: `cname.vercel-dns.com`
3. Vercel provisions TLS automatically.

## Domain alias

`vercel.json` contains a permanent (301) redirect for one alias domain:

| Domain | Redirects to |
|--------|-------------|
| `architectofsilence.com` | `alkindix.com/memoir` |

Add the alias domain in Vercel → Settings → Domains, then point its DNS to Vercel the same way.

## Environment variables

None required. The site is fully static with no server-side logic.

## Security headers

Set globally in `vercel.json` for all routes:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

## Caching

Images and static assets (`css`, `js`) are served with:

```
Cache-Control: public, max-age=31536000, immutable
```

This means browsers and CDN edges cache them for one year. A new Vercel deployment automatically invalidates the CDN cache, so updated files are served immediately after deploy even with immutable headers.

## Local development

No server required for basic work:

```bash
open public/index.html
```

To test routing exactly as production behaves, use the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
vercel dev
```

## CI

GitHub Actions runs on every push and pull request to `main`. See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

- **Lint HTML** — `htmlhint` validates all pages in `public/`
- **Check links** — `lychee` checks all external links in HTML files
