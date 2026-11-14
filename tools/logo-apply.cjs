// Emits the final card logo: real HousePlus artwork (white version, transparent
// background) inside the existing amber-bordered navy card, plus the wordmark.
// The raster is embedded as a data URI because browsers refuse to load external
// images referenced from an <img>-embedded SVG.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const exe = CANDIDATES.find((c) => c && fs.existsSync(c));
const toUrl = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');

const REPO = path.resolve(__dirname, '..');
const SQ = 'C:\\Users\\Jack Hu\\Desktop\\HOUSE PLUS\\HOUSE PLUS LOGO\\logo\\houseplus-logo-square-transparent-white.png';
// Full square artwork: the small "House Plus" line under the mark is part of the
// brand lockup and is kept on purpose.
const CROP = { x: 0, y: 0, w: 1426, h: 1300 };
const RASTER_H = 260;

async function dataUri(page, file, crop, targetH) {
  return page.evaluate(async (src, c, h) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const w = Math.round(h * (c.w / c.h));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  }, toUrl(file), crop, targetH);
}

function buildSvg(uri) {
  const iconH = 90;
  const iconW = Math.round(iconH * (CROP.w / CROP.h)); // 99
  const iconY = Math.round((120 - iconH) / 2); // 15
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120" role="img" aria-label="HousePlus Group — Nigerian Factory">
  <title>HousePlus Group — Nigerian Factory</title>
  <rect x="1.5" y="1.5" width="397" height="117" rx="18" fill="#0f2d5e" stroke="#f59e0b" stroke-width="3"/>
  <image href="${uri}" x="12" y="${iconY}" width="${iconW}" height="${iconH}" preserveAspectRatio="xMidYMid meet"/>
  <text x="118" y="60" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="35" font-weight="800" letter-spacing="-0.8"><tspan fill="#ffffff">House</tspan><tspan fill="#f59e0b">Plus</tspan><tspan dx="7" font-size="23" font-weight="700" fill="#ffffff" letter-spacing="-0.2">Group</tspan></text>
  <text x="119" y="87" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="12" font-weight="700" fill="#f59e0b" letter-spacing="2.4">NIGERIAN FACTORY</text>
</svg>
`;
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  const seed = path.join(__dirname, '_seed.html');
  fs.writeFileSync(seed, '<!doctype html><meta charset="utf-8">');
  await page.goto(toUrl(seed), { waitUntil: 'load' });

  const uri = await dataUri(page, SQ, CROP, RASTER_H);
  await browser.close();

  const svg = buildSvg(uri);
  const targets = [
    path.join(REPO, 'client', 'public', 'images', 'logo-houseplus-group.svg'),
    path.join(REPO, 'docs', 'images', 'logo-houseplus-group.svg'),
  ];
  for (const t of targets) {
    fs.mkdirSync(path.dirname(t), { recursive: true });
    fs.writeFileSync(t, svg);
  }
  fs.writeFileSync(path.join(__dirname, 'logo-final.svg'), svg);
  console.log(`svg ${(svg.length / 1024).toFixed(1)} KB -> ${targets.length} files`);
})();
