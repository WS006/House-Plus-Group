/**
 * Builds client/public/favicon.ico from apple-touch-icon.png.
 *
 * Browsers request /favicon.ico automatically; without it the site logged a 404
 * on every page view. ICO can embed PNG-compressed entries (Vista+), so we wrap
 * the PNG in a minimal ICONDIR rather than pulling in an icon encoder.
 *
 * Run: node tools/generate-favicon.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'client', 'public', 'apple-touch-icon.png');
const dest = path.join(root, 'client', 'public', 'favicon.ico');

// Multi-size ICO: 16, 32, 48. Each entry is a PNG payload.
const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  pngs.push(await sharp(src).resize(size, size, { fit: 'cover' }).png({ compressionLevel: 9 }).toBuffer());
}

const headerSize = 6;
const entrySize = 16;
const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4); // image count

const entries = [];
let offset = headerSize + entrySize * pngs.length;

for (let i = 0; i < pngs.length; i++) {
  const size = sizes[i];
  const e = Buffer.alloc(entrySize);
  e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
  e.writeUInt8(size >= 256 ? 0 : size, 1); // height
  e.writeUInt8(0, 2); // palette colours
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8); // payload size
  e.writeUInt32LE(offset, 12); // payload offset
  offset += pngs[i].length;
  entries.push(e);
}

fs.writeFileSync(dest, Buffer.concat([header, ...entries, ...pngs]));
console.log(`✓ favicon.ico written (${sizes.join('/')}px, ${fs.statSync(dest).size} bytes)`);
