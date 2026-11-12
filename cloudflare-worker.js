/**
 * Cloudflare Worker — security headers, caching and SPA fallback for
 * www.houseplus.com.ng in front of GitHub Pages.
 *
 * Why this exists: the site is hosted on GitHub Pages, which serves static
 * files only. It ignores the `_headers` and `_redirects` files in the repo, so
 * none of the intended security headers or long-lived asset caching ever
 * reached visitors. A worker in front of the origin is the only way to apply
 * them without moving hosts.
 *
 * Deploy: Cloudflare dashboard -> Workers & Pages -> create worker -> paste this
 * -> add a route for www.houseplus.com.ng/*.
 *
 * Replace the previous cloudflare-worker*.js variants (four conflicting copies,
 * two with a wrong GitHub Pages base URL).
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
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
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

    // Unknown route -> serve the SPA shell so client-side routing takes over.
    // Only for navigations; a missing .js must stay a 404, not return HTML.
    const wantsHtml = (request.headers.get('Accept') || '').includes('text/html');
    if (upstream.status === 404 && wantsHtml && !/\.[a-z0-9]+$/i.test(pathname)) {
      upstream = await fetch(ORIGIN + '/index.html', { headers: request.headers });
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
