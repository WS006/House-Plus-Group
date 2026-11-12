/**
 * Publishes the build to docs/, which is what GitHub Pages serves.
 *
 * Pages is configured with source = main branch, /docs folder, and it cannot
 * run a build step. The Vite output goes to dist/public, so without this copy
 * the repository keeps shipping whatever was last copied by hand: source
 * changes land in git and never reach visitors.
 *
 * The directory is mirrored, not merged, so old hashed bundles don't pile up
 * (they would still be served, and they count against the Pages size limit).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'dist', 'public');
const dest = path.join(root, 'docs');

/** Kept in the repo even though the build doesn't produce them. */
const KEEP = new Set(['.gitkeep']);

if (!fs.existsSync(path.join(src, 'index.html'))) {
  console.error('x dist/public/index.html is missing - run `npm run build` first');
  process.exit(1);
}

let removed = 0;
let copied = 0;

function mirror(from, to) {
  fs.mkdirSync(to, { recursive: true });
  const want = new Set(fs.readdirSync(from));

  for (const entry of fs.readdirSync(to)) {
    if (want.has(entry) || KEEP.has(entry)) continue;
    fs.rmSync(path.join(to, entry), { recursive: true, force: true });
    removed++;
  }

  for (const entry of fs.readdirSync(from)) {
    const s = path.join(from, entry);
    const d = path.join(to, entry);
    if (fs.statSync(s).isDirectory()) {
      mirror(s, d);
    } else {
      fs.copyFileSync(s, d);
      copied++;
    }
  }
}

mirror(src, dest);

console.log(`OK published to docs/: ${copied} files copied, ${removed} stale entries removed`);
