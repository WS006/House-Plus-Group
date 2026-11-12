/**
 * Sitemap generator.
 *
 * Fixes over the previous version:
 *  - lastmod was hardcoded to a single date, so it never reflected real edits.
 *    It now comes from each page's output file mtime.
 *  - five important pages had no <image:image> entry.
 *  - the image list reuses the same source files as the prerenderer.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = 'https://www.houseplus.com.ng';
const distPublic = path.join(__dirname, 'dist', 'public');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.data.json'), 'utf8'));

const pages = [
  { url: '/', priority: '1.0', image: '/images/hero-solar.jpg', title: 'HousePlus Group Nigerian Factory — Solar Energy Solutions', changefreq: 'weekly' },
  { url: '/about/', priority: '0.9', image: '/images/about-team.jpg', title: 'About HousePlus Group Nigerian Factory' },
  { url: '/products/', priority: '0.9', image: '/images/products/solar-panel.jpg', title: 'Solar, Home Appliance and 3C Product Catalogue' },
  { url: '/factory/', priority: '0.8', image: '/images/hero-factory.jpg', title: 'HousePlus Group Manufacturing and Quality Control' },
  { url: '/services/', priority: '0.8', image: '/images/africa-market.jpg', title: 'OEM/ODM, Sourcing and Logistics Services' },
  { url: '/faq/', priority: '0.7', image: '/images/hero-solar.jpg', title: 'HousePlus Group Frequently Asked Questions' },
  { url: '/contact/', priority: '0.8', image: '/images/hero-factory.jpg', title: 'Contact HousePlus Group Nigerian Factory' },
  { url: '/news/', priority: '0.6', image: '/images/hero-3c.jpg', title: 'HousePlus Group News and Updates' },
  { url: '/careers/', priority: '0.5', image: '/images/about-team.jpg', title: 'Careers at HousePlus Group' },
  { url: '/team/', priority: '0.6', image: '/images/about-team.jpg', title: 'HousePlus Group Nigerian Factory Team' },
  { url: '/privacy/', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms/', priority: '0.3', changefreq: 'yearly' },
];

const productEntries = products.map((p) => ({
  url: `/products/${p.id}/`,
  priority: '0.7',
  image: p.image,
  title: p.nameEn,
}));

const all = pages.concat(productEntries);

/** mtime of the generated index.html for a route, or today if missing. */
function lastmodFor(url) {
  const clean = url.replace(/^\/|\/$/g, '');
  const file = clean ? path.join(distPublic, clean, 'index.html') : path.join(distPublic, 'index.html');
  try {
    return fs.statSync(file).mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function entry({ url, priority, image, title, changefreq = 'weekly' }) {
  let out =
    `  <url>\n` +
    `    <loc>${base}${url}</loc>\n` +
    `    <lastmod>${lastmodFor(url)}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n`;

  if (image) {
    out +=
      `    <image:image>\n` +
      `      <image:loc>${base}${image}</image:loc>\n` +
      `      <image:title>${escapeXml(title || 'HousePlus Group Nigerian Factory')}</image:title>\n` +
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
