# Alkindi

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-alkindix.com-brightgreen)](https://alkindix.com)

Personal portfolio for Mohammed Alkindi's projects, research, photography, and writing.

## Pages

| URL | Content |
| --- | --- |
| [`/`](https://alkindix.com/) | Home |
| [`/about`](https://alkindix.com/about) | Profile, experience, and education |
| [`/projects`](https://alkindix.com/projects) | Selected systems and product work |
| [`/research`](https://alkindix.com/research) | Research and computational studies |
| [`/creative`](https://alkindix.com/creative) | Photography and writing |
| [`/creative/photography`](https://alkindix.com/creative/photography) | Complete photography archive |
| [`/creative/memoir`](https://alkindix.com/creative/memoir) | Architect of Silence |

## Development

The site uses static HTML, CSS, and vanilla JavaScript. There is no build step.

```powershell
python -m http.server 4174 --directory public
```

Open `http://localhost:4174` after starting the server.

## Structure

```text
public/
  creative/
    memoir/
    photography/
  css/styles.css
  images/photography/
  js/app.js
  about.html
  index.html
  projects.html
  research.html
vercel.json
```

## Deployment

Vercel serves `public/` and deploys `main` automatically. Redirects in
`vercel.json` consolidate the former PhotographyX and Architect of Silence domains
under `alkindix.com`.

See [`docs/`](docs/) for architecture, content, design, and deployment notes.
