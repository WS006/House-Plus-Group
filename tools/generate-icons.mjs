/**
 * Builds every site icon from the real HousePlus artwork:
 *   client/public/apple-touch-icon.png  (180x180, transparent)
 *   client/public/favicon.svg           (64px raster embedded, so it stays
 *                                        faithful instead of being redrawn)
 *   client/public/favicon.ico           (16/32/48 PNG entries)
 *
 * The same full lockup goes into all three. Cropping the "House" wordmark off
 * the tab icon made the logo look truncated, so the wordmark stays even though
 * it is only a few pixels tall at 16px.
 *
 * The background is transparent, so the tile blends into whatever the browser
 * chrome paints behind it. The artwork itself is saturated orange/red, which
 * reads on both light and dark tab bars. Note that iOS does not honour alpha on
 * home-screen icons: transparent pixels are painted black there.
 *
 * Run: node tools/generate-icons.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'client', 'public');
const SRC =
  'C:\\Users\\Jack Hu\\Desktop\\HOUSE PLUS\\HOUSE PLUS LOGO\\logo\\houseplus-logo-square-transparent-white.png';

// The mark plus its "House" word. The stray "House Plus" line sits at y>=1135.
const LOCKUP = { left: 0, top: 0, width: 1426, height: 1033 };

const SIZE = 180;
// With the plate gone there is no visual padding to respect, so the lockup grows
// to 0.96 of the width: as large as it can be without the roof tip or the sun's
// rays touching the edge. At 0.86 the icon read as small and timid in the tab.
const FILL = 0.96;

if (!fs.existsSync(SRC)) {
  console.warn(`⚠ source artwork not found, keeping existing icons: ${SRC}`);
  process.exit(0);
}

/** Draws `crop` centred on a transparent square, scaled to `fill` of the width. */
async function square(crop, fill) {
  const inner = Math.round(SIZE * fill);
  const mark = await sharp(SRC).extract(crop).resize({ width: inner }).png().toBuffer();
  const { height: markH } = await sharp(mark).metadata();
  const buf = await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: mark, left: Math.round((SIZE - inner) / 2), top: Math.round((SIZE - markH) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  return { buf, inner, markH };
}

// Same lockup everywhere: the wordmark is part of the logo, and cropping it off
// made the icon look truncated.
const icon = await square(LOCKUP, FILL);
fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), icon.buf);

/** Downscales for the tab sizes, sharpening slightly so the edges stay crisp. */
async function small(size) {
  return sharp(icon.buf)
    .resize(size, size, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 0.4 })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// 64px covers the largest slot browsers ask for (32 at 2x) and keeps the inline
// payload small — this file is fetched on every first page view.
const svgPng = await small(64);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="HousePlus Group">
  <image href="data:image/png;base64,${svgPng.toString('base64')}" width="64" height="64"/>
</svg>
`;
fs.writeFileSync(path.join(pub, 'favicon.svg'), svg);

// Multi-size ICO. Browsers request /favicon.ico automatically; each entry is a
// PNG payload (Vista+), which avoids pulling in an icon encoder.
const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  pngs.push(await small(size));
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);

const entries = [];
let offset = 6 + sizes.length * 16;
for (let i = 0; i < sizes.length; i++) {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0); // width
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1); // height
  e.writeUInt8(0, 2); // palette colours
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  entries.push(e);
}

const ico = Buffer.concat([header, ...entries, ...pngs]);
fs.writeFileSync(path.join(pub, 'favicon.ico'), ico);

console.log(
  `✓ icons: apple-touch-icon.png ${icon.buf.length}B, favicon.svg ${svg.length}B, ` +
    `favicon.ico ${ico.length}B (mark ${icon.inner}x${icon.markH}, transparent)`,
);
