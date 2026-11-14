// Screenshots the real built site so the logo can be judged in place.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const REPO = path.resolve(__dirname, '..');
const DOCS = path.join(REPO, 'docs');
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

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
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
};

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DOCS, p);
  try {
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && fs.existsSync(path.join(DOCS, p, 'index.html'))) f = path.join(DOCS, p, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  } catch { res.writeHead(500); res.end('err'); }
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await new Promise((r) => server.listen(8901, '127.0.0.1', r));
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'] });
  const out = [];

  async function shot(width, height, label, selector, dsf = 2) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: dsf });
    await page.goto('http://127.0.0.1:8901/', { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(500);
    const el = await page.$(selector);
    if (!el) { console.log('missing selector', selector); await page.close(); return; }
    const file = path.join(SHOTS, `shot-${label}.png`);
    await el.screenshot({ path: file });
    out.push(file);
    await page.close();
  }

  await shot(1280, 900, 'nav-desktop', 'nav');
  await shot(375, 800, 'nav-mobile', 'nav');
  await shot(1280, 900, 'footer', 'footer');

  // Close-up of the logo itself at 4x for detail inspection.
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 4 });
    await page.goto('http://127.0.0.1:8901/', { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(500);
    const el = await page.$('nav a img');
    const file = path.join(SHOTS, 'shot-logo-closeup.png');
    await el.screenshot({ path: file });
    out.push(file);
    await page.close();
  }

  await browser.close();
  server.close();
  console.log(out.map((f) => path.basename(f)).join('\n'));
})();
