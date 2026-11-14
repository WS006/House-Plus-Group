/**
 * Builds the site icons from the real HousePlus artwork:
 *   client/public/apple-touch-icon.png  (180x180, opaque navy — iOS fills
 *                                        transparent pixels with black)
 *   client/public/favicon.svg           (same mark, raster embedded so it stays
 *                                        faithful instead of being redrawn)
 *
 * tools/generate-favicon.mjs then wraps the 180px PNG into favicon.ico.
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
const CROP = { left: 0, top: 0, width: 1426, height: 1033 };
const NAVY = '#0f2d5e';
const SIZE = 180;
// Landscape mark on a square: 0.86 keeps the roof/sun silhouette readable at 16px.
const FILL = 0.86;

if (!fs.existsSync(SRC)) {
  console.warn(`⚠ source artwork not found, keeping existing icons: ${SRC}`);
  process.exit(0);
}

const inner = Math.round(SIZE * FILL);
const mark = await sharp(SRC).extract(CROP).resize({ width: inner }).png().toBuffer();
const { height: markH } = await sharp(mark).metadata();

const icon = await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: NAVY } })
  .composite([{ input: mark, left: Math.round((SIZE - inner) / 2), top: Math.round((SIZE - markH) / 2) }])
  .png({ compressionLevel: 9 })
  .toBuffer();

fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), icon);

// 64px covers the largest slot browsers ask for (32 at 2x) and keeps the inline
// payload small — this file is fetched on every first page view.
const small = await sharp(icon).resize(64, 64, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="HousePlus Group">
  <image href="data:image/png;base64,${small.toString('base64')}" width="64" height="64"/>
</svg>
`;
fs.writeFileSync(path.join(pub, 'favicon.svg'), svg);

console.log(
  `✓ icons: apple-touch-icon.png ${icon.length}B, favicon.svg ${svg.length}B (mark ${inner}x${markH})`,
);
