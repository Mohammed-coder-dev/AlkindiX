# Alkindi

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-alkindix.com-brightgreen)](https://www.alkindix.com)

Personal portfolio for Mohammed Alkindi's projects, research, photography, and writing.

## Pages

| URL | Content |
| --- | --- |
| [`/`](https://www.alkindix.com/) | Home |
| [`/about`](https://www.alkindix.com/about) | Profile, experience, and education |
| [`/projects`](https://www.alkindix.com/projects) | Selected systems and product work |
| [`/research`](https://www.alkindix.com/research) | Research and computational studies |
| [`/creative`](https://www.alkindix.com/creative) | Photography and writing |
| [`/creative/photography`](https://www.alkindix.com/creative/photography) | Complete photography archive |
| [`/creative/memoir`](https://www.alkindix.com/creative/memoir) | Architect of Silence |

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
