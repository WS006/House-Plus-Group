/**
 * Vendors the Barlow webfont into client/public/fonts/ so the site no longer
 * depends on fonts.googleapis.com (unreachable from mainland China, and a
 * render-blocking request everywhere else).
 *
 * Only the binary files are handled here; the matching @font-face rules live in
 * client/src/index.css so first paint does not wait on a second stylesheet.
 *
 * The generated files are committed, so this only needs re-running when the
 * weight list changes. It requires the font package first:
 *
 *   npm install --no-save --legacy-peer-deps @fontsource/barlow
 *   node tools/vendor-fonts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'node_modules', '@fontsource', 'barlow', 'files');
const outDir = path.join(root, 'client', 'public', 'fonts');
const cssPath = path.join(root, 'client', 'src', 'index.css');

// Only the weights the stylesheets actually use. Barlow Condensed is loaded by
// the old Google Fonts URL but never referenced, so it is not shipped.
const FACES = [
  { weight: 400, style: 'normal' },
  { weight: 500, style: 'normal' },
  { weight: 600, style: 'normal' },
  { weight: 700, style: 'normal' },
  { weight: 800, style: 'normal' },
  { weight: 900, style: 'normal' },
  { weight: 400, style: 'italic' },
];

if (!fs.existsSync(src)) {
  console.error('x @fontsource/barlow is not installed (npm install --no-save --legacy-peer-deps @fontsource/barlow)');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

let bytes = 0;
for (const { weight, style } of FACES) {
  const file = `barlow-latin-${weight}-${style}.woff2`;
  const from = path.join(src, file);
  if (!fs.existsSync(from)) {
    console.error(`x missing ${file}`);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(outDir, file));
  bytes += fs.statSync(from).size;
}

// The stylesheet must stay in sync with the files above.
const css = fs.readFileSync(cssPath, 'utf8');
const missing = FACES.filter((f) => !css.includes(`barlow-latin-${f.weight}-${f.style}.woff2`));
if (missing.length) {
  console.error(`x client/src/index.css is missing @font-face for: ${missing.map((f) => `${f.weight} ${f.style}`).join(', ')}`);
  process.exit(1);
}

console.log(`OK fonts: ${FACES.length} woff2 files, ${(bytes / 1024).toFixed(1)} KB total`);
