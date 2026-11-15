/**
 * Builds every site icon from the real HousePlus artwork:
 *   client/public/apple-touch-icon.png  (180x180, opaque navy — iOS fills
 *                                        transparent pixels with black)
 *   client/public/favicon.svg           (64px raster embedded, so it stays
 *                                        faithful instead of being redrawn)
 *   client/public/favicon.ico           (16/32/48 PNG entries)
 *
 * Two different crops on purpose. At 180px the full lockup reads; at 16px the
 * "House" wordmark collapses into a smudge, so the tab icon keeps only the
 * roof-and-sun glyph, which is the part that survives the downscale.
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
// Roof + sun + beam only. The "House" stems start at y=659 and would show up as
// two stray specks below the beam.
const GLYPH = { left: 0, top: 0, width: 1423, height: 659 };

const NAVY = '#0f2d5e';
const SIZE = 180;

if (!fs.existsSync(SRC)) {
  console.warn(`⚠ source artwork not found, keeping existing icons: ${SRC}`);
  process.exit(0);
}

/** Draws `crop` on a navy square, scaled to `fill` of the canvas width. */
async function square(crop, fill) {
  const inner = Math.round(SIZE * fill);
  const mark = await sharp(SRC).extract(crop).resize({ width: inner }).png().toBuffer();
  const { height: markH } = await sharp(mark).metadata();
  const buf = await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: NAVY } })
    .composite([{ input: mark, left: Math.round((SIZE - inner) / 2), top: Math.round((SIZE - markH) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  return { buf, inner, markH };
}

const lockup = await square(LOCKUP, 0.86);
fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), lockup.buf);

// The glyph is ~2.2:1, so on a square it needs a wider fill to stay legible.
const glyph = await square(GLYPH, 0.92);

// 64px covers the largest slot browsers ask for (32 at 2x) and keeps the inline
// payload small — this file is fetched on every first page view.
const svgPng = await sharp(glyph.buf).resize(64, 64, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();
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
  pngs.push(await sharp(glyph.buf).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer());
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
  `✓ icons: apple-touch-icon.png ${lockup.buf.length}B (lockup ${lockup.inner}x${lockup.markH}), ` +
    `favicon.svg ${svg.length}B, favicon.ico ${ico.length}B (glyph ${glyph.inner}x${glyph.markH})`,
);
