/**
 * Image optimisation pipeline.
 *
 * Emits, next to every source JPEG in client/public/images:
 *   - <name>-<width>.webp   responsive WebP variants
 *   - <name>.webp           full-size WebP fallback
 * and rewrites nothing in code — the markup references the variants explicitly.
 *
 * Run: node tools/optimize-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'client', 'public', 'images');

// Widths to emit. Hero art gets a wider ladder than thumbnails.
const WIDTHS = [480, 768, 1200, 1800];

async function processJpeg(file) {
  const abs = path.join(imagesDir, file);
  const rel = file.replace(/\\/g, '/');
  const base = abs.replace(/\.jpe?g$/i, '');
  const img = sharp(abs);
  const meta = await img.metadata();

  const emitted = [];
  for (const w of WIDTHS) {
    if (w > meta.width * 1.05) continue; // don't upscale
    const out = `${base}-${w}.webp`;
    // Quality 74 + effort 6 is the knee of the curve for photographic product
    // shots: ~15% smaller than q78 with no visible loss at 1x or 2x DPR.
    await sharp(abs).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74, effort: 6 }).toFile(out);
    emitted.push({ w, bytes: fs.statSync(out).size, file: path.basename(out) });
  }

  // Full-size WebP: keeps the original pixel box for og:image-ish use.
  const fullOut = `${base}.webp`;
  await sharp(abs).webp({ quality: 76, effort: 5 }).toFile(fullOut);
  emitted.push({ w: meta.width, bytes: fs.statSync(fullOut).size, file: path.basename(fullOut) });

  const original = fs.statSync(abs).size;
  const best = Math.min(...emitted.map((e) => e.bytes));
  console.log(
    `${rel.padEnd(38)} ${meta.width}x${meta.height}  ${(original / 1024).toFixed(0)}KB -> ` +
      `webp ${(best / 1024).toFixed(0)}KB (${emitted.length} files, -${(100 - (best / original) * 100).toFixed(0)}%)`
  );
  return { rel, original, emitted };
}

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    // images/og holds already-final 1200x630 share cards; re-optimising them
    // would produce pointless -480/-768 variants of a fixed-size asset.
    if (e.isDirectory()) {
      if (e.name === 'og') continue;
      walk(p);
    } else if (/\.jpe?g$/i.test(e.name)) {
      files.push(path.relative(imagesDir, p));
    }
  }
})(imagesDir);

// Remove WebP variants whose source JPEG no longer exists (renamed/deleted
// artwork would otherwise linger in client/public and be deployed forever).
const expected = new Set();
for (const f of files) {
  const base = path.join(imagesDir, f).replace(/\.jpe?g$/i, '');
  for (const w of WIDTHS) expected.add(base + '-' + w + '.webp');
  expected.add(base + '.webp');
}
let pruned = 0;
(function prune(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'og') prune(p);
      continue;
    }
    if (/\.webp$/i.test(e.name) && !expected.has(p)) {
      fs.unlinkSync(p);
      pruned++;
    }
  }
})(imagesDir);
if (pruned) console.log(`  pruned ${pruned} stale WebP variant(s)\n`);

const results = [];
for (const f of files) results.push(await processJpeg(f));

const before = results.reduce((s, r) => s + r.original, 0);
const afterLargest = results.reduce((s, r) => s + Math.max(...r.emitted.map((e) => e.bytes)), 0);
console.log(
  `\n${files.length} images: ${(before / 1048576).toFixed(2)} MB JPEG -> ` +
    `${(afterLargest / 1048576).toFixed(2)} MB WebP full-size`
);
