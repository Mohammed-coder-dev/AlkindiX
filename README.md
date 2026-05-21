# Alkindi — alkindix.com

[![CI](https://github.com/MohammedAlkindi/AlkindiX/actions/workflows/ci.yml/badge.svg)](https://github.com/MohammedAlkindi/AlkindiX/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-alkindix.com-brightgreen)](https://alkindix.com)

Personal HQ — systems, computation, and thoughtful work.

## Pages

| URL | Description |
|-----|-------------|
| [`/`](https://alkindix.com/) | Home |
| [`/about`](https://alkindix.com/about) | About |
| [`/memoir`](https://alkindix.com/memoir) | Memoir |
| [`/linkedin`](https://alkindix.com/linkedin) | → LinkedIn |
| [`/github`](https://alkindix.com/github) | → GitHub |

## Structure

```
AlkindiX/
├── public/
│   ├── index.html       # Home
│   ├── about.html       # About
│   ├── memoir.html      # Memoir
│   ├── css/
│   │   └── styles.css   # Shared design system
│   ├── js/
│   │   └── app.js       # Shared behaviour (nav, scroll, reveal)
│   ├── robots.txt       # Crawler rules
│   ├── sitemap.xml      # Sitemap
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── ci.yml       # HTML lint + link checker
├── vercel.json          # Routing, redirects, caching headers
├── .htmlhintrc          # HTML linting rules
├── .editorconfig        # Editor formatting
└── LICENSE
```

## Local development

No build step. Open any page directly in a browser:

```bash
open public/index.html
# or serve locally:
npx serve public
```

## Deploy

Push to `main` → Vercel deploys automatically. No build step required.

Domain alias configured in `vercel.json`:

- `architectofsilence.com` → `/memoir`

## Docs

| Document | Description |
|----------|-------------|
| [docs/architecture.md](docs/architecture.md) | File roles, routing, JS behaviour, caching |
| [docs/design-system.md](docs/design-system.md) | CSS tokens, typography, components |
| [docs/content-guide.md](docs/content-guide.md) | How to update pages and edit copy |
| [docs/deployment.md](docs/deployment.md) | Vercel setup, domains, headers, local dev |
