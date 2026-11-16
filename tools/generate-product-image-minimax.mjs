/**
 * Generates the portable power station product shot with MiniMax (through the
 * magpie gateway) and installs it as the catalogue image.
 *
 * The catalogue image is a real generated render, not a drawing: MiniMax's
 * image model renders the unit from a product-photography prompt. Provenance
 * matters for a B2B catalogue, so the prompt is kept in the repository and the
 * model id is printed on every run.
 *
 * Requirements
 *   - the magpie gateway running on 127.0.0.1:3425 with a signed-in
 *     "MiniMax Code (Global)" account
 *   - agent.minimax.io reachable from this machine (a proxy rule for
 *     minimax.io is needed on networks where the domain is routed direct)
 *
 * Versioning: /images/* is served with a one-year immutable cache, so a new
 * picture must land under a new filename. This writes power-station-v2.jpg;
 * the next replacement becomes power-station-v3.jpg.
 *
 * Usage: node tools/generate-product-image-minimax.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const gateway = process.env.MAGPIE_GATEWAY ?? 'http://127.0.0.1:3425';
const key = process.env.MAGPIE_KEY ?? 'magpie';
const model = 'minimax-code-global/MiniMax-Image';

const outFile = path.join(root, 'client', 'public', 'images', 'products', 'power-station-v2.jpg');

const prompt = [
  'Professional e-commerce product photograph of a portable power station (portable solar generator),',
  '500W / 512Wh class. Compact rectangular unit in matte dark charcoal-grey ABS housing with a sturdy',
  'integrated carrying handle on top, cooling vents on the side, and a front control panel with a small',
  'blue-lit LCD status display, two AC sockets with covers, two USB-A ports, one USB-C port, a 12V car',
  'socket and a round DC input. Clean pure white seamless studio background, soft even lighting with a',
  'subtle contact shadow beneath the unit, three-quarter front view, sharp focus, high detail, commercial',
  'catalogue style, no text, no logos, no watermarks.',
].join(' ');

console.log(`→ asking ${model} for the product shot`);

const res = await fetch(`${gateway}/v1/images/generations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model, prompt, n: 1, size: '1024x1024' }),
});

const text = await res.text();
if (!res.ok) {
  console.error(text.slice(0, 500));
  process.exit(1);
}

const json = JSON.parse(text);
const item = json.data?.[0];
if (!item) {
  console.error('no image in response');
  process.exit(1);
}

let buffer;
if (item.b64_json) {
  buffer = Buffer.from(item.b64_json, 'base64');
} else {
  const download = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!download.ok) {
    console.error(`download failed: ${download.status}`);
    process.exit(1);
  }
  buffer = Buffer.from(await download.arrayBuffer());
}

const meta = await sharp(buffer).metadata();
console.log(`← source ${meta.format} ${meta.width}x${meta.height}, ${(buffer.length / 1024).toFixed(0)}KB`);

// The catalogue expects a 1200x900 JPEG; the pipeline (optimize-images.mjs)
// turns it into the WebP variants.
await sharp(buffer)
  .resize(1200, 900, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(outFile);

console.log(`✓ wrote ${path.relative(root, outFile)} (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
