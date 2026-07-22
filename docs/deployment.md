# Deployment

The site is deployed as a static Vercel project. `vercel.json` sets `public/` as
the output directory, so no framework preset or build command is required.

## Continuous deployment

Every push to `main` creates a production deployment. Other branches can receive
preview deployments through the connected GitHub repository.

## Domains

| Domain | Destination |
| --- | --- |
| `alkindix.com` | Primary site |
| `photographyx.org` | `alkindix.com/creative/photography` |
| `architectofsilence.com` | `alkindix.com/creative/memoir` |

Each domain must also be attached to the Vercel project and configured at its DNS
provider. Vercel provisions TLS after the DNS records resolve.

## Local preview

```powershell
python -m http.server 4174 --directory public
```

The local server covers page rendering and clean root-relative assets. Vercel-specific
redirects and headers are defined in `vercel.json` and take effect after deployment.

## Security and caching

The project sends content-type, framing, referrer, and browser-permission headers.
Images, CSS, and JavaScript use long-lived caching; their query-string version should
change whenever shared CSS or JavaScript changes.
