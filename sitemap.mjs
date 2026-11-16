/**
 * Sitemap generator.
 *
 * Deliberately emits no <lastmod>, <changefreq> or <priority>:
 *  - lastmod came from each output file's mtime, which is the build date, so all
 *    24 URLs claimed to change on the same day. Google reads that as fake
 *    freshness and starts ignoring lastmod entirely.
 *  - changefreq and priority are ignored by every major crawler.
 * The route list comes from shared/routes.meta.json, the same file the
 * prerenderer and the SPA read, so a new page cannot appear in one and not the
 * others.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.join(__dirname, 'dist', 'public');

const company = JSON.parse(fs.readFileSync(path.join(__dirname, 'shared', 'company.json'), 'utf8'));
const base = company.url;
const routeMeta = JSON.parse(fs.readFileSync(path.join(__dirname, 'shared', 'routes.meta.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(__dirname, 'shared', 'guides.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.data.json'), 'utf8'));

/** Social/share image per static route (also used as the image sitemap entry). */
const IMAGE_BY_ROUTE = {
  '/': '/images/hero-solar.jpg',
  '/about': '/images/about-team.jpg',
  '/products': '/images/products/solar-panel.jpg',
  '/products/solar': '/images/products/power-station-v2.jpg',
  '/products/home-appliances': '/images/products/air-fryer.jpg',
  '/products/3c-electronics': '/images/products/power-bank.jpg',
  '/guides': '/images/hero-solar.jpg',
  '/factory': '/images/hero-factory.jpg',
  '/services': '/images/africa-market.jpg',
  '/faq': '/images/hero-solar.jpg',
  '/contact': '/images/hero-factory.jpg',
  '/news': '/images/hero-3c.jpg',
  '/careers': '/images/about-team.jpg',
  '/team': '/images/about-team.jpg',
};

/** Routes kept out of the sitemap on purpose. */
const EXCLUDED = new Set(['/admin', '/404']);

const pages = routeMeta
  .filter((r) => !EXCLUDED.has(r.path))
  .map((r) => ({
    url: r.path === '/' ? '/' : `${r.path.replace(/\/+$/, '')}/`,
    image: IMAGE_BY_ROUTE[r.path],
    title: r.title,
  }));

const productEntries = products.map((p) => ({
  url: `/products/${p.id}/`,
  image: p.image,
  title: p.nameEn,
}));

const guideEntries = guides.map((g) => ({
  url: `/guides/${g.slug}/`,
  image: '/images/hero-solar.jpg',
  title: g.title,
}));

const all = pages.concat(productEntries, guideEntries);

function entry({ url, image, title }) {
  let out = `  <url>\n    <loc>${base}${url}</loc>\n`;
  if (image) {
    out +=
      `    <image:image>\n` +
      `      <image:loc>${base}${image}</image:loc>\n` +
      `      <image:title>${escapeXml(title || company.name)}</image:title>\n` +
      `    </image:image>\n`;
  }
  return out + '  </url>';
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${all.map(entry).join('\n')}
</urlset>
`;

for (const dest of ['client/public/sitemap.xml', 'dist/public/sitemap.xml']) {
  const p = path.join(__dirname, dest);
  if (dest.startsWith('dist') && !fs.existsSync(path.dirname(p))) continue;
  fs.writeFileSync(p, xml, 'utf8');
}
console.log(`✓ sitemap: ${all.length} urls, ${all.filter((e) => e.image).length} with images`);
