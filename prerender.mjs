/**
 * Real static prerenderer.
 *
 * The previous version only rewrote <head> metadata: every route shipped an
 * empty <div id="root">, so crawlers that don't execute JavaScript saw ~60
 * characters of page text and no headings, images or links. Google can render
 * JS, but it costs crawl budget, delays indexing, and leaves social/link
 * previews and slower crawlers with nothing.
 *
 * This script boots the built SPA in a headless browser, waits for the route to
 * settle, then writes the rendered markup into the <div id="root"> of each
 * route's index.html. React hydrates over it on load.
 *
 * Requires a Chromium-based browser. Resolution order:
 *   1. PUPPETEER_EXECUTABLE_PATH env var
 *   2. System Chrome / Edge
 *   3. Puppeteer's bundled Chromium
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist', 'public');
const SITE = 'https://www.houseplus.com.ng';
const require = createRequire(import.meta.url);

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.data.json'), 'utf8'));

const SITE_NAME = 'HousePlus Group Nigerian Factory';

/** 1200x630 share cards, one per route (see tools/generate-og-images.mjs). */
const OG_BY_ROUTE = {
  '/': '/images/og/home.jpg',
  '/about': '/images/og/about.jpg',
  '/products': '/images/og/products.jpg',
  '/factory': '/images/og/factory.jpg',
  '/services': '/images/og/services.jpg',
  '/news': '/images/og/news.jpg',
  '/team': '/images/og/about.jpg',
  '/contact': '/images/og/factory.jpg',
  '/faq': '/images/og/home.jpg',
  '/careers': '/images/og/about.jpg',
};

/** Products map to their own card, or a category fallback. */
const OG_BY_PRODUCT = {
  'solar-panel-mono-400w': '/images/og/product-solar-panel.jpg',
  'solar-inverter-5kw': '/images/og/product-solar-inverter.jpg',
  'lithium-battery-100ah': '/images/og/product-lithium-battery.jpg',
  'solar-street-light-100w': '/images/og/product-solar-street-light.jpg',
  'air-fryer-5l': '/images/og/product-air-fryer.jpg',
  'blender-1200w': '/images/og/product-blender.jpg',
  'smart-watch-pro': '/images/og/product-smart-watch.jpg',
  'tws-earphone': '/images/og/product-tws-earbuds.jpg',
  'power-bank-20000': '/images/og/product-power-bank.jpg',
  'sd-card-128gb': '/images/og/product-sd-card.jpg',
  'charge-controller-40a': '/images/og/product-charge-controller.jpg',
  'rice-cooker-5l': '/images/og/product-rice-cooker.jpg',
};

function ogImageFor(route, product) {
  if (product) return OG_BY_PRODUCT[product.id] || '/images/og/products.jpg';
  return OG_BY_ROUTE[route] || '/images/og/home.jpg';
}

/** Routes written to disk. '/' is the shell itself. */
const routes = [
  '/', '/about', '/products', '/factory', '/team', '/services', '/faq',
  '/news', '/careers', '/contact', '/privacy', '/terms',
  ...products.map((p) => `/products/${p.id}`),
];

/** Per-route title/description: single source shared with the SPA. */
const meta = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(__dirname, 'shared', 'routes.meta.json'), 'utf8')).map((r) => [
    r.path,
    { title: r.title, description: r.description },
  ])
);

/** Product pages get their own product copy rather than the site defaults. */
for (const p of products) {
  meta[`/products/${p.id}`] = {
    title: `${p.nameEn} | HousePlus`,
    description: p.descEn,
  };
}

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------------------------------------------------------------------------
// Browser resolution
// ---------------------------------------------------------------------------
function findBrowser() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : process.platform === 'darwin'
        ? [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
          ]
        : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];

  for (const c of candidates) if (c && fs.existsSync(c)) return c;
  return null; // fall back to Puppeteer's bundled Chromium
}

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  puppeteer = null;
}

// ---------------------------------------------------------------------------
// Minimal static server (serves dist, SPA-fallbacks to index.html)
// ---------------------------------------------------------------------------
function startServer() {
  const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
  };

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(distPath, urlPath);

    // Directory -> index.html, unknown path -> SPA shell.
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) filePath = path.join(distPath, 'index.html');

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ---------------------------------------------------------------------------
// Meta block rendering
// ---------------------------------------------------------------------------
/**
 * LCP preload for the route's hero art.
 *
 * The <img> and the preload must resolve to the *same* candidate, otherwise the
 * browser downloads two variants and repaints the hero twice (measured: the
 * <picture> picked 768w while a 100vw preload forced 1200w, pushing LCP to
 * 3.8s on a throttled phone). So the values are copied verbatim from the
 * rendered priority image instead of being recomputed here.
 */
function preloadLink(preload) {
  if (!preload || !preload.src) return '';
  if (preload.srcset && preload.sizes) {
    return (
      `    <link rel="preload" as="image" type="image/webp" fetchpriority="high"` +
      ` imagesrcset="${escapeHtml(preload.srcset)}" imagesizes="${escapeHtml(preload.sizes)}" />\n`
    );
  }
  const base = preload.src.replace(/\.jpe?g$/i, '');
  const srcset = [480, 768, 1200, 1800].map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  return `    <link rel="preload" as="image" type="image/webp" href="${base}-1200.webp" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high" />\n`;
}

function renderHead({ url, title, description, image, ogType, jsonLd, preload }) {
  const canonical = SITE + (url === '/' ? '/' : url + '/');
  const ogImage = SITE + (image || '/images/logo-houseplus-group.svg');

  return `<!-- Primary Meta Tags -->
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
${preloadLink(preload)}

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${ogType || 'website'}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
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
${jsonLd ? `\n    <script type="application/ld+json" data-schema-key="product">\n    ${JSON.stringify(jsonLd, null, 2).split('\n').join('\n    ')}\n    </script>` : ''}
`;
}

function productJsonLd(p) {
  const url = `${SITE}/products/${p.id}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nameEn,
    description: p.descEn,
    image: SITE + p.image,
    url,
    sku: p.id,
    brand: { '@type': 'Brand', name: SITE_NAME },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE,
      parentOrganization: { '@type': 'Organization', name: 'HousePlus Group', url: 'https://www.houseplus-ch.com' },
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
  };
}

/**
 * Splices rendered markup + head block into the shell HTML.
 * The shell already contains a <div id="root"></div>; we replace its contents.
 */
function compose(shell, { headBlock, rootHtml, headSchemas = [] }) {
  const start = shell.indexOf('<!-- Primary Meta Tags -->');
  const end = shell.indexOf('<!-- Favicon -->');
  if (start === -1 || end === -1) throw new Error('meta block markers not found');

  let head = headBlock;

  // Append runtime-injected structured data (FAQPage, LocalBusiness, Person…).
  // Skip any key already emitted above (e.g. the richer product block).
  const existingKeys = new Set([...head.matchAll(/data-schema-key="([^"]+)"/g)].map((m) => m[1]));
  for (const s of headSchemas) {
    if (existingKeys.has(s.key)) continue;
    existingKeys.add(s.key);
    head += `    <script type="application/ld+json" data-schema-key="${s.key}">\n    ${s.json}\n    </script>\n`;
  }

  let html = shell.slice(0, start) + head + shell.slice(end);

  // Inject prerendered markup inside #root.
  if (rootHtml) {
    html = html.replace(/<div id="root"><\/div>/, `<div id="root">${rootHtml}</div>`);
  }
  return html;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const shell = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

const server = await startServer();
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

let count = 0;
let failed = 0;

const executablePath = findBrowser();
let browser = null;

if (puppeteer) {
  try {
    browser = await puppeteer.launch({
      ...(executablePath ? { executablePath } : {}),
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    console.log(`✓ browser: ${executablePath || 'puppeteer bundled chromium'}`);
  } catch (e) {
    console.warn(`⚠ could not launch browser (${e.message.split('\n')[0]})`);
  }
} else {
  console.warn('⚠ puppeteer not installed — falling back to metadata-only prerender');
}

/** LCP artwork per static route (the first large image rendered above the fold). */
const HERO_BY_ROUTE = {
  '/': '/images/hero-solar.jpg',
  '/factory': '/images/hero-factory.jpg',
  '/news': '/images/hero-3c.jpg',
  '/products': '/images/products/solar-panel.jpg',
};

/** Reads the srcset/sizes of the route's priority image so the preload matches it. */
const CAPTURE_PRELOAD = () => {
  const img = document.querySelector('#root img[fetchpriority="high"]');
  if (!img) return null;
  const picture = img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement : null;
  const source = picture ? picture.querySelector('source[type="image/webp"]') : null;
  return {
    src: img.getAttribute('src'),
    srcset: source ? source.getAttribute('srcset') : null,
    sizes: source ? source.getAttribute('sizes') : null,
  };
};

for (const route of routes) {
  const m = meta[route] || { title: SITE_NAME, description: '' };
  const isProduct = route.startsWith('/products/') && route !== '/products';
  const product = isProduct ? products.find((p) => route === `/products/${p.id}`) : null;

  let rootHtml = '';
  let headSchemas = [];
  let preload = { src: product ? product.image : HERO_BY_ROUTE[route] };
  if (browser) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(origin + route, { waitUntil: 'networkidle0', timeout: 45000 });
      // Wait for the route's h1 — the app renders it only after data resolves.
      await page.waitForSelector('#root h1', { timeout: 15000 }).catch(() => {});
      // Let framer-motion settle so text isn't captured mid-animation.
      await new Promise((r) => setTimeout(r, 400));

      // Reveal wrappers may have applied their hidden inline styles by now.
      // Never bake those into the static HTML: crawlers and no-JS visitors must
      // see the content, and a hidden hero would also destroy LCP.
      await page.evaluate(() => {
        document.querySelectorAll('[data-fade-in]').forEach((el) => el.removeAttribute('style'));
        // The cookie banner is a client-only, consent-gated overlay captured
        // mid-animation; it must not end up in the static markup either.
        document.querySelectorAll('[data-cookie-banner]').forEach((el) => el.remove());
      });

      preload = (await page.evaluate(CAPTURE_PRELOAD)) || preload;

      rootHtml = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.innerHTML : '';
      });

      // Components inject JSON-LD into <head> at runtime (FAQPage, LocalBusiness,
      // Person…). Capture those so they survive into the static HTML — otherwise
      // every route would ship only the shell's Organization block.
      headSchemas = await page.evaluate(() =>
        [...document.querySelectorAll('script[type="application/ld+json"][data-schema-path]')].map(
          (el) => ({ key: el.getAttribute('data-schema-key') || 'page', json: el.textContent || '' })
        )
      );
    } catch (e) {
      console.warn(`  ⚠ ${route}: ${e.message.split('\n')[0]} (writing metadata only)`);
      failed++;
    } finally {
      await page.close();
    }
  }

  const headBlock = renderHead({
    url: route,
    title: m.title,
    description: m.description,
    image: ogImageFor(route, product),
    ogType: isProduct ? 'product' : 'website',
    jsonLd: product ? productJsonLd(product) : null,
    preload,
  });

  const html = compose(shell, { headBlock, rootHtml, headSchemas });
  const dir = route === '/' ? distPath : path.join(distPath, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  count++;

  console.log(`  ${rootHtml ? '✓' : '·'} ${route.padEnd(28)} ${(rootHtml.length / 1024).toFixed(0)}KB html`);
}

if (browser) await browser.close();
server.close();

// 404 shell: noindex, no canonical.
{
  const headBlock = renderHead({
    url: '/404',
    title: 'Page Not Found — HousePlus Group Nigeria',
    description: 'The page you are looking for does not exist.',
    ogType: 'website',
  }).replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, follow" />')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '');

  // Static fallback body: without JavaScript (or before hydration) the page must
  // still show a heading and a way back instead of a blank screen.
  const notFoundHtml = `<div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
  <div class="w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-xl">
    <div class="pt-8 pb-8 px-6 text-center">
      <h1 class="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <h2 class="text-xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
      <p class="text-slate-600 mb-8 leading-relaxed">Sorry, the page you are looking for doesn't exist.<br />It may have been moved or deleted.</p>
      <a href="/" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">Go Home</a>
    </div>
  </div>
</div>`;

  fs.writeFileSync(path.join(distPath, '404.html'), compose(shell, { headBlock, rootHtml: notFoundHtml }), 'utf8');
}

console.log(`\n✓ prerendered ${count} routes + 404${failed ? ` (${failed} without body)` : ''}`);
