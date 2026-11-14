// Drives a real browser over the built site. `puppeteer` is already a
// devDependency; the bundled Chrome download is skipped in this environment
// (PUPPETEER_SKIP_DOWNLOAD), so an installed Chrome or Edge is passed in
// explicitly below.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const REPO = path.resolve(__dirname, '..');
const DOCS = path.join(REPO, 'docs');

const CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const exe = CANDIDATES.find((c) => c && fs.existsSync(c));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml',
  '.txt': 'text/plain', '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DOCS, p);
  try {
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
    if (!fs.existsSync(f) && fs.existsSync(path.join(DOCS, p, 'index.html'))) f = path.join(DOCS, p, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  } catch (e) { res.writeHead(500); res.end('err'); }
});

const assets = fs.readdirSync(path.join(DOCS, 'assets'));
const productsChunk = assets.find((f) => /^Products-.*\.js$/.test(f));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PRODUCTS_RE = new RegExp('/assets/' + esc(productsChunk) + '$');

/** Waits without blocking the event loop for pending intercepted requests. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function snapshot(page) {
  return page.evaluate(() => ({
    path: location.pathname + location.search,
    nav: !!document.querySelector('nav')?.getClientRects().length,
    spinner: !!document.querySelector('.animate-spin')?.getClientRects().length,
    retry: /This page didn't load/i.test(document.body.innerText || ''),
    errorPage: /unexpected error occurred/i.test(document.body.innerText || ''),
    h1: document.querySelector('h1')?.textContent?.trim()?.slice(0, 34) || null,
  }));
}

(async () => {
  await new Promise((r) => server.listen(8899, '127.0.0.1', r));
  const BASE = 'http://127.0.0.1:8899';
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'] });
  const results = [];

  async function scenario(label, { block, mode, start = '/', click = '/products' } = {}) {
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 900 });
    const jsErrors = [];
    let fullLoads = 0;
    let chunkRequests = 0;
    page.on('pageerror', (e) => jsErrors.push(String(e).slice(0, 110)));
    page.on('framenavigated', (f) => { if (f === page.mainFrame()) fullLoads++; });

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (block && PRODUCTS_RE.test(req.url())) {
        chunkRequests++;
        if (mode === 'hang') return; // never answer: simulates a stalled connection
        return req.respond({ status: 404, contentType: 'text/html', body: 'gone' });
      }
      req.continue();
    });

    await page.goto(BASE + start, { waitUntil: 'networkidle2', timeout: 60000 });

    let clicked = false;
    if (click) {
      clicked = await page.evaluate((target) => {
        const a = [...document.querySelectorAll('a')].find(
          (x) => (x.getAttribute('href') || '') === target
        );
        if (!a) return false;
        a.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        return true;
      }, click);
      await sleep(450); // give the hover prefetch its chance

      await page.evaluate((target) => {
        const a = [...document.querySelectorAll('a')].find(
          (x) => (x.getAttribute('href') || '') === target
        );
        a && a.click();
      }, click);
      await sleep(150);
    }

    const snaps = [];
    for (const wait of [900, 1500, 2500, 6000]) {
      await sleep(wait);
      const s = await snapshot(page);
      snaps.push(
        `t+${wait}ms path=${s.path} nav=${s.nav ? 'Y' : 'N'} spin=${s.spinner ? 'Y' : 'N'} ` +
        `retry=${s.retry ? 'Y' : 'N'} errPage=${s.errorPage ? 'Y' : 'N'} h1="${s.h1}"`
      );
    }
    results.push({ label, snaps, fullLoads, jsErrors, clicked, chunkRequests });
    await page.close();
  }

  await scenario('A. normal click (hover prefetch first)');
  await scenario('B. Products chunk 404 on navigation', { block: true, mode: '404' });
  await scenario('C. Products chunk hangs on navigation', { block: true, mode: 'hang' });
  await scenario('D. direct load /products with chunk 404', { block: true, mode: '404', start: '/products', click: null });
  await scenario('E. direct load /products with chunk hanging', { block: true, mode: 'hang', start: '/products', click: null });

  console.log(`\nProducts chunk under test: ${productsChunk}`);
  for (const r of results) {
    console.log(`\n=== ${r.label} ===`);
    console.log(`  link found: ${r.clicked === null ? '(no click)' : r.clicked} | chunk requests intercepted: ${r.chunkRequests}`);
    r.snaps.forEach((s) => console.log('  ' + s));
    console.log(`  full page loads: ${r.fullLoads} | js errors: ${r.jsErrors.length}`);
    r.jsErrors.slice(0, 2).forEach((e) => console.log('    ' + e));
  }

  await browser.close();
  server.close();
})();
