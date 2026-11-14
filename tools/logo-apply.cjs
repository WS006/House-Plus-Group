// Emits the final card logo: real HousePlus artwork (white version, transparent
// background) inside the existing amber-bordered navy card, plus the wordmark.
// The raster is embedded as a data URI because browsers refuse to load external
// images referenced from an <img>-embedded SVG.
//
// The tagline is centred on the wordmark. Its x is measured rather than guessed,
// because letter-spacing adds a trailing gap that shifts the optical centre.
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
const FONT = 'Segoe UI, Helvetica, Arial, sans-serif';

const WORD_X = 118;
const WORD_SIZE = 35;
const WORD_TRACK = -0.8;
const GROUP_SIZE = 23;
const GROUP_TRACK = -0.2;
const GROUP_GAP = 7;
const SUB_SIZE = 12.5;
const SUB_TRACK = 3;

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

/** Measures the wordmark and the tagline in the font the SVG actually asks for. */
function measure(page, cfg) {
  return page.evaluate((c) => {
    const NS = 'http://www.w3.org/2000/svg';
    const host = document.createElementNS(NS, 'svg');
    host.setAttribute('width', '0');
    host.setAttribute('height', '0');
    document.body.appendChild(host);

    const word = document.createElementNS(NS, 'text');
    word.setAttribute('font-family', c.font);
    word.setAttribute('font-size', c.wordSize);
    word.setAttribute('font-weight', '800');
    word.setAttribute('letter-spacing', c.wordTrack);
    for (const part of [
      { text: 'House', fill: '#fff' },
      { text: 'Plus', fill: '#f59e0b' },
      { text: 'Group', fill: '#fff', size: c.groupSize, weight: '700', track: c.groupTrack, dx: c.groupGap },
    ]) {
      const t = document.createElementNS(NS, 'tspan');
      t.textContent = part.text;
      if (part.fill) t.setAttribute('fill', part.fill);
      if (part.size) t.setAttribute('font-size', part.size);
      if (part.weight) t.setAttribute('font-weight', part.weight);
      if (part.track) t.setAttribute('letter-spacing', part.track);
      if (part.dx) t.setAttribute('dx', part.dx);
      word.appendChild(t);
    }
    host.appendChild(word);
    const wordBox = word.getBBox();

    const sub = document.createElementNS(NS, 'text');
    sub.setAttribute('font-family', c.font);
    sub.setAttribute('font-size', c.subSize);
    sub.setAttribute('font-weight', '700');
    sub.setAttribute('letter-spacing', c.subTrack);
    sub.textContent = 'NIGERIAN FACTORY';
    host.appendChild(sub);
    const subBox = sub.getBBox();

    host.remove();
    return {
      wordWidth: wordBox.width,
      subWidth: subBox.width,
      // Chrome counts the trailing letter-space in the advance, so drop it.
      wordInkWidth: wordBox.width + c.wordTrack,
      subInkWidth: subBox.width - c.subTrack,
    };
  }, cfg);
}

function buildSvg(uri, subX) {
  const iconH = 90;
  const iconW = Math.round(iconH * (CROP.w / CROP.h)); // 99
  const iconY = Math.round((120 - iconH) / 2); // 15
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120" role="img" aria-label="HousePlus Group — Nigerian Factory">
  <title>HousePlus Group — Nigerian Factory</title>
  <rect x="1.5" y="1.5" width="397" height="117" rx="18" fill="#0f2d5e" stroke="#f59e0b" stroke-width="3"/>
  <image href="${uri}" x="12" y="${iconY}" width="${iconW}" height="${iconH}" preserveAspectRatio="xMidYMid meet"/>
  <text x="${WORD_X}" y="60" font-family="${FONT}" font-size="${WORD_SIZE}" font-weight="800" letter-spacing="${WORD_TRACK}"><tspan fill="#ffffff">House</tspan><tspan fill="#f59e0b">Plus</tspan><tspan dx="${GROUP_GAP}" font-size="${GROUP_SIZE}" font-weight="700" fill="#ffffff" letter-spacing="${GROUP_TRACK}">Group</tspan></text>
  <text x="${subX.toFixed(1)}" y="87" font-family="${FONT}" font-size="${SUB_SIZE}" font-weight="700" fill="#f59e0b" letter-spacing="${SUB_TRACK}">NIGERIAN FACTORY</text>
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
  const m = await measure(page, {
    font: FONT,
    wordSize: WORD_SIZE,
    wordTrack: WORD_TRACK,
    groupSize: GROUP_SIZE,
    groupTrack: GROUP_TRACK,
    groupGap: GROUP_GAP,
    subSize: SUB_SIZE,
    subTrack: SUB_TRACK,
  });
  await browser.close();

  const wordCentre = WORD_X + m.wordInkWidth / 2;
  const subX = wordCentre - m.subInkWidth / 2;
  console.log(
    `wordmark ${WORD_X}..${(WORD_X + m.wordInkWidth).toFixed(1)} (centre ${wordCentre.toFixed(1)}), ` +
      `tagline w=${m.subInkWidth.toFixed(1)} x=${subX.toFixed(1)}..${(subX + m.subInkWidth).toFixed(1)}`,
  );

  const svg = buildSvg(uri, subX);
  const targets = [
    path.join(REPO, 'client', 'public', 'images', 'logo-houseplus-group.svg'),
    path.join(REPO, 'docs', 'images', 'logo-houseplus-group.svg'),
  ];
  for (const t of targets) {
    fs.mkdirSync(path.dirname(t), { recursive: true });
    fs.writeFileSync(t, svg);
  }
  console.log(`svg ${(svg.length / 1024).toFixed(1)} KB -> ${targets.length} files`);
})();
