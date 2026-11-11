import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = 'https://www.houseplus.com.ng';
const lastmod = '2026-11-11';

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.data.json'), 'utf8'));

const pages = [
  { url: '/', priority: '1.0', image: '/images/hero-solar.jpg', title: 'HousePlus Group Nigerian Factory - Solar Energy Solutions', changefreq: 'weekly' },
  { url: '/about/', priority: '0.9', image: '/images/about-team.jpg', title: 'About HousePlus Group Nigerian Factory' },
  { url: '/products/', priority: '0.9', image: '/images/products/solar-panel.jpg', title: 'Solar, Home Appliance and 3C Product Catalogue' },
  { url: '/factory/', priority: '0.8', image: '/images/hero-factory.jpg', title: 'HousePlus Group Manufacturing and Quality Control' },
  { url: '/services/', priority: '0.8', image: '/images/africa-market.jpg', title: 'OEM/ODM, Sourcing and Logistics Services' },
  { url: '/faq/', priority: '0.7' },
  { url: '/contact/', priority: '0.8' },
  { url: '/news/', priority: '0.6', image: '/images/hero-3c.jpg', title: 'HousePlus Group News and Updates' },
  { url: '/careers/', priority: '0.5' },
  { url: '/team/', priority: '0.6', image: '/images/about-team.jpg', title: 'HousePlus Group Nigerian Factory Team' },
  { url: '/privacy/', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms/', priority: '0.3', changefreq: 'yearly' },
];

const productEntries = products.map(p => ({
  url: `/products/${p.id}/`,
  priority: '0.7',
  image: p.image,
  title: p.nameEn,
}));

const all = pages.concat(productEntries);

/**
 * The site is one static document per route with client-side translations via
 * ?lang=. Emitting xhtml:link alternates pointing at those query URLs would
 * advertise 144 near-duplicate pages that all canonicalise back to the English
 * URL, so the sitemap deliberately omits hreflang annotations.
 */
function entry({ url, priority, image, title, changefreq = 'weekly' }) {
  let out = `  <url>\n    <loc>${base}${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n`;
  if (image) {
    out += `    <image:image>\n      <image:loc>${base}${image}</image:loc>\n      <image:title>${(title || 'HousePlus Group Nigerian Factory').replace(/&/g, '&amp;')}</image:title>\n    </image:image>\n`;
  }
  return out + '  </url>';
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
console.log(`sitemap written, urls=${all.length}`);
