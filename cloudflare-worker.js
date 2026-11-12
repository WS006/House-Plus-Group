/**
 * Cloudflare Worker - UNUSED FALLBACK, NOT DEPLOYED.
 *
 * This was written for an earlier "GitHub Pages origin + Worker in front"
 * approach. The project has since moved to Cloudflare Pages, where
 * client/public/_headers and client/public/_redirects are applied natively:
 * security headers, cache policy and real 404s no longer need custom code.
 *
 * See CLOUDFLARE_PAGES_DEPLOYMENT.md. DO NOT deploy this alongside Pages:
 * the two would set overlapping headers and the origin path is different.
 *
 * Kept only as a reference in case the site ever moves back to an origin that
 * cannot apply custom headers. It is not part of the build or deploy pipeline.
 */

const ORIGIN = 'https://ws006.github.io/House-Plus-Group';

/** Applied to every response. */
const SECURITY_HEADERS = {
  // The site loads no third-party scripts, so the policy can stay tight.
  // 'unsafe-inline' is required for the inline SPA route-recovery script and
  // for React's style attributes.
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    // Fonts are self-hosted (/fonts/*), so no external font hosts are needed.
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https:",
    'upgrade-insecure-requests',
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

/** Vite fingerprints these filenames, so they can be cached forever. */
const IMMUTABLE = /^\/assets\/.+-[A-Za-z0-9_-]{6,}\.(js|css|woff2?)$/;

/** Files whose content changes and must be revalidated. */
const REVALIDATE = [
  '/', '/index.html', '/404.html', '/sitemap.xml', '/robots.txt',
  '/favicon.ico', '/favicon.svg', '/CNAME',
];

function cacheControlFor(pathname) {
  if (IMMUTABLE.test(pathname)) return 'public, max-age=31536000, immutable';
  if (REVALIDATE.includes(pathname)) return 'public, max-age=0, must-revalidate';
  // Images and other static art: cache a week.
  if (/\.(jpg|jpeg|png|webp|svg|ico|gif|avif)$/i.test(pathname)) {
    return 'public, max-age=604800';
  }
  return 'public, max-age=3600';
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Academic honesty for crawlers: /index.html duplicates /, so point
    // clients at the canonical URL instead of serving the same bytes twice.
    if (pathname === '/index.html') {
      return Response.redirect(url.origin + '/' + url.search, 301);
    }

    // Try the exact path first (GitHub Pages serves /about/ from /about/index.html).
    let upstream = await fetch(ORIGIN + pathname + url.search, {
      headers: request.headers,
      redirect: 'manual',
    });

    // Every marketing route is prerendered to its own index.html, so an unknown
    // path is genuinely missing. It used to fall back to the SPA shell with a
    // 200, which is a "soft 404": Google treats those as thin duplicates of the
    // homepage and they can outrank real content.
    //
    // /admin is the one client-only route (never prerendered), so it keeps the
    // SPA fallback. Missing assets never fall back either — a 404 for a .js
    // must stay a 404, not return HTML.
    const wantsHtml = (request.headers.get('Accept') || '').includes('text/html');
    const isAsset = /\.[a-z0-9]+$/i.test(pathname);
    const isClientRoute = pathname === '/admin' || pathname.startsWith('/admin/');

    if (upstream.status === 404 && wantsHtml && !isAsset) {
      if (isClientRoute) {
        upstream = await fetch(ORIGIN + '/index.html', { headers: request.headers });
      } else {
        // Serve the prerendered 404 page, with a real 404 status.
        const notFound = await fetch(ORIGIN + '/404.html', { headers: request.headers });
        const headers = new Headers(notFound.headers);
        for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
        headers.delete('ETag');
        return new Response(notFound.body, { status: 404, statusText: 'Not Found', headers });
      }
    }

    const headers = new Headers(upstream.headers);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
    headers.set('Cache-Control', cacheControlFor(pathname));
    // GitHub Pages sets a weak ETag that no longer matches after rewriting.
    headers.delete('ETag');

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  },
};
