/**
 * Regenerates products.data.json from client/src/lib/store.ts.
 *
 * Why: the prerenderer and sitemap read products.data.json while the app reads
 * DEFAULT_PRODUCTS in store.ts. Those were two independently maintained copies
 * of the same catalogue, guaranteed to drift (a new product would appear in the
 * SPA but never get a prerendered page). Now the JSON is derived from the store.
 *
 * Runs automatically before `vite build`.
 *
 * Run: node tools/generate-product-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const storeFile = path.join(root, 'client', 'src', 'lib', 'store.ts');
const outFile = path.join(root, 'products.data.json');

const src = fs.readFileSync(storeFile, 'utf8');

// Find the DEFAULT_PRODUCTS array literal and evaluate it in isolation.
const startMark = 'const DEFAULT_PRODUCTS: Product[] = [';
const start = src.indexOf(startMark);
if (start === -1) {
  console.error('✗ could not locate DEFAULT_PRODUCTS in store.ts');
  process.exit(1);
}

// Walk brackets to find the matching close of the array.
let i = start + startMark.length - 1; // at '['
let depth = 0;
let inString = null;
let end = -1;
for (; i < src.length; i++) {
  const ch = src[i];
  if (inString) {
    if (ch === '\\') { i++; continue; }
    if (ch === inString) inString = null;
    continue;
  }
  if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue; }
  if (ch === '[') depth++;
  else if (ch === ']') {
    depth--;
    if (depth === 0) { end = i + 1; break; }
  }
}
if (end === -1) {
  console.error('✗ could not find end of DEFAULT_PRODUCTS array');
  process.exit(1);
}

const literal = src.slice(start + startMark.length - 1, end);

// The array is plain data (strings/numbers/booleans/arrays/nested objects), so
// evaluating it as JS is safe here — it is our own source file, not user input.
const products = new Function(`return (${literal});`)();

if (!Array.isArray(products) || products.length === 0) {
  console.error('✗ parsed DEFAULT_PRODUCTS is not a non-empty array');
  process.exit(1);
}

// Only the fields the prerenderer/sitemap need — keeps the file small and
// avoids shipping translation blobs into build-time tooling.
const slim = products.map((p) => ({
  id: p.id,
  nameEn: p.nameEn,
  descEn: p.descEn,
  image: p.image,
  moq: p.moq,
}));

fs.writeFileSync(outFile, JSON.stringify(slim, null, 2) + '\n', 'utf8');
console.log(`✓ products.data.json: ${slim.length} products derived from store.ts`);
