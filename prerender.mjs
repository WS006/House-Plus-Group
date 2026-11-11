import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist', 'public');
const SITE = 'https://www.houseplus.com.ng';

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.data.json'), 'utf8'));

// title/description are the only per-page differences; React hydrates over the shell.
const pages = [
  { url: '/', file: 'index.html' },
];

const routes = [
  '/about', '/products', '/factory', '/team', '/services', '/faq',
  '/news', '/careers', '/contact', '/privacy', '/terms',
];

// Single source of truth for per-route title/description, shared with the
// client (client/src/lib/seo.ts) so the prerendered HTML and the hydrated SPA
// never disagree about what a page is called.
const meta = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.meta.json'), 'utf8')).map((r) => [
    r.path,
    { title: r.title, description: r.description },
  ])
);

const shell = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// NOTE: this site is a single static document per route; translations are
// applied client-side from the ?lang= query parameter. Publishing hreflang
// alternates for those URLs would tell Google there are 6 localised copies of
// every page while each URL canonicalises back to the English one — a
// contradiction that gets the whole annotation set ignored (or worse, creates
// 144 near-duplicate URLs). So no hreflang block is emitted; the canonical URL
// is the only address search engines should index.

// Replace the whole block of default meta so each route gets its own values.
function render(url, { title, description, image, jsonLd }) {
  // GitHub Pages serves directory indexes at a trailing-slash URL, so the
  // canonical must match the URL that is actually returned to crawlers.
  const canonical = SITE + (url === '/' ? '/' : url + '/');
  const ogImage = SITE + (image || '/images/logo-houseplus-group.svg');
  let html = shell;

  const start = html.indexOf('<!-- Primary Meta Tags -->');
  const end = html.indexOf('<!-- Favicon -->');
  if (start === -1 || end === -1) throw new Error('meta block markers not found');

  const block = `<!-- Primary Meta Tags -->
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="HousePlus Group Nigerian Factory" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <!-- Geo Tags -->
    <meta name="geo.region" content="NG" />
    <meta name="geo.placename" content="Lagos, Nigeria" />
    <meta name="geo.position" content="6.5967;3.3421" />
    <meta name="ICBM" content="6.5967, 3.3421" />

    ${jsonLd ? `<script type="application/ld+json" data-schema-key="product">\n    ${JSON.stringify(jsonLd, null, 2).split('\n').join('\n    ')}\n    </script>\n\n    ` : ''}`;

  html = html.slice(0, start) + block + html.slice(end);
  return html;
}

function write(route, html) {
  const dir = route === '/' ? distPath : path.join(distPath, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

/**
 * GitHub Pages serves this file for unknown paths. It must not be indexed and
 * must not claim a canonical URL, otherwise Google treats a soft 404 as a real
 * page (and previously canonicalised it to the homepage).
 */
function writeNotFound() {
  let html = shell;
  const start = html.indexOf('<!-- Primary Meta Tags -->');
  const end = html.indexOf('<!-- Favicon -->');
  if (start === -1 || end === -1) throw new Error('meta block markers not found');

  const block = `<!-- Primary Meta Tags -->
    <title>Page Not Found — HousePlus Group Nigerian Factory</title>
    <meta name="title" content="Page Not Found — HousePlus Group Nigerian Factory" />
    <meta name="description" content="The page you are looking for does not exist. Browse HousePlus Group Nigerian Factory products, factory information, and contact details instead." />
    <meta name="robots" content="noindex, follow" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Page Not Found — HousePlus Group Nigerian Factory" />
    <meta property="og:description" content="The page you are looking for does not exist." />
    <meta property="og:image" content="${SITE}/images/logo-houseplus-group.svg" />
    <meta property="og:site_name" content="HousePlus Group Nigerian Factory" />
    <meta property="og:locale" content="en_US" />

    <!-- Geo Tags -->
    <meta name="geo.region" content="NG" />
    <meta name="geo.placename" content="Lagos, Nigeria" />

    `;

  html = html.slice(0, start) + block + html.slice(end);
  fs.writeFileSync(path.join(distPath, '404.html'), html, 'utf8');
}

let count = 0;
for (const route of routes) {
  try {
    write(route, render(route, meta[route]));
    count++;
  } catch (e) {
    console.error(`✗ ${route}: ${e.message}`);
  }
}

for (const p of products) {
  const url = `/products/${p.id}`;
  const html = render(url, {
    title: `${p.nameEn} — HousePlus Group Nigerian Factory`,
    description: p.descEn,
    image: p.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.nameEn,
      description: p.descEn,
      image: SITE + p.image,
      url: SITE + url + '/',
      brand: { '@type': 'Brand', name: 'HousePlus Group Nigerian Factory' },
      manufacturer: {
        '@type': 'Organization',
        name: 'HousePlus Group Nigerian Factory',
        url: 'https://www.houseplus.com.ng',
        parentOrganization: { '@type': 'Organization', name: 'HousePlus Group', url: 'https://www.houseplus-ch.com' },
      },
    },
  });
  write(url, html);
  count++;
}

writeNotFound();

console.log(`✓ prerendered ${count + 1} routes (incl. ${products.length} products) + 404`);
