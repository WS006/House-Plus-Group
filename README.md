# HousePlus Group Nigeria Factory

Solar panels, inverters, batteries, home appliances and 3C electronics, factory-direct from HousePlus Group's Nigerian branch. Main group site: houseplus-ch.com.

**Live**: https://www.houseplus.com.ng

## Quick start

```bash
npm install --legacy-peer-deps   # required: Manus Vite plugin peer ranges conflict
npm run dev                      # local dev server
npm run build                    # full build + publish to docs/
npm run check                    # TypeScript
npx wrangler pages dev docs      # preview with Cloudflare Pages routing/headers
```

`npm run build` needs a local Chrome/Edge (the prerenderer renders all 24 routes in a headless browser). It exits with an error rather than publishing empty pages if no browser is available.

## Deployment

GitHub Pages currently serves `docs/` on `main`. The build writes to `dist/public` and `tools/publish-docs.mjs` mirrors it into `docs/`, so a plain `git push` publishes the site.

We are migrating to **Cloudflare Pages** so that `_headers` (CSP, security headers, cache policy) and `_redirects` actually take effect — GitHub Pages ignores both. See [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md) for the setup steps. **Build command must be left empty**; Pages CI has no Chromium for prerendering.

Current status, audit findings and remaining work: [OPTIMIZATION_REPORT.md](./OPTIMIZATION_REPORT.md).

## Repository layout

| Path | Purpose |
|---|---|
| `client/src/` | React app |
| `client/public/` | Static assets, `_headers`, `_redirects`, self-hosted fonts |
| `shared/routes.meta.json` | Single source of truth for titles/descriptions |
| `tools/` | Image pipeline, product data, OG cards, favicon, `publish-docs.mjs` |
| `prerender.mjs` | Headless-browser prerender of 24 routes + 404 + admin shell |
| `docs/` | **Published output** (GitHub Pages / Cloudflare Pages) |
| `wrangler.toml` | Cloudflare Pages project config |
| `cloudflare-worker.js` | Unused fallback (GitHub Pages + Worker approach); superseded by Pages |

`docs/` is generated — edit sources, not `docs/`, then run `npm run build`.
