import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist', 'public');
const SITE = 'https://www.houseplus.com.ng';
const LANGS = ['en', 'zh', 'fr', 'ru', 'es', 'ar'];

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.data.json'), 'utf8'));

// title/description are the only per-page differences; React hydrates over the shell.
const pages = [
  { url: '/', file: 'index.html' },
];

const routes = [
  '/about', '/products', '/factory', '/team', '/services', '/faq',
  '/news', '/careers', '/contact', '/privacy', '/terms',
];

const meta = {
  '/about': {
    title: 'About HousePlus Group Nigerian Factory — Manufacturing Excellence',
    description: "HousePlus Group Nigerian Factory is the Nigerian branch and local entity of HousePlus Group. 10+ years of manufacturing experience supplying solar, appliances and 3C electronics to 50+ countries.",
  },
  '/products': {
    title: 'Products — HousePlus Group Nigerian Factory | Solar, Appliances & 3C',
    description: 'Browse the HousePlus Group Nigerian Factory catalogue: solar panels, inverters, lithium batteries, home appliances and 3C electronics. Factory direct pricing, OEM/ODM available.',
  },
  '/factory': {
    title: 'Factory — HousePlus Group Nigerian Factory Manufacturing',
    description: "Explore HousePlus Group's manufacturing facilities, ISO-certified production lines, quality control processes and OEM/ODM capacity for large-scale orders.",
  },
  '/team': {
    title: 'Team — HousePlus Group Nigerian Factory Leadership',
    description: 'Meet the HousePlus Group team: manufacturing, supply chain, quality assurance and customer service experts serving Nigeria, Africa and global buyers.',
  },
  '/services': {
    title: 'Services — OEM/ODM, Customization & Logistics | HousePlus Group',
    description: 'HousePlus Group services: OEM/ODM manufacturing, product customization, bulk orders, quality assurance, logistics support and 24/7 customer service for global buyers.',
  },
  '/faq': {
    title: 'FAQ — HousePlus Group Nigerian Factory | Common Questions',
    description: "Answers to common questions about HousePlus Group Nigerian Factory's products, MOQ, payment methods, delivery times, OEM/ODM services and shipping to Nigeria and Africa.",
  },
  '/news': {
    title: 'News & Updates — HousePlus Group Nigerian Factory',
    description: 'Latest news, announcements and market insights from HousePlus Group Nigerian Factory: new products, company milestones and solar industry trends in Africa.',
  },
  '/careers': {
    title: 'Careers — Join the HousePlus Group Nigerian Factory Team',
    description: 'Career opportunities at HousePlus Group Nigerian Factory in manufacturing, supply chain, sales and customer service. Join our growing Nigeria and China teams.',
  },
  '/contact': {
    title: 'Contact HousePlus Group Nigerian Factory — Get in Touch',
    description: 'Contact HousePlus Group Nigerian Factory for product inquiries, bulk orders or partnerships. Phone, email and WhatsApp support available for Nigeria and global buyers.',
  },
  '/privacy': {
    title: 'Privacy Policy — HousePlus Group Nigerian Factory',
    description: 'How HousePlus Group Nigerian Factory collects, uses and protects personal information, and the rights available to visitors and customers.',
  },
  '/terms': {
    title: 'Terms of Service — HousePlus Group Nigerian Factory',
    description: 'HousePlus Group Nigerian Factory terms of service covering product sales, shipping, returns, intellectual property and user responsibilities.',
  },
};

const shell = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function hreflang(url) {
  return LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${SITE}${url}?lang=${l}" />`)
    .concat([`<link rel="alternate" hreflang="x-default" href="${SITE}${url}" />`]).join('\n    ');
}

// Replace the whole block of default meta so each route gets its own values.
function render(url, { title, description, image, jsonLd }) {
  // GitHub Pages serves directory indexes at a trailing-slash URL, so the
  // canonical must match the URL that is actually returned to crawlers.
  const canonical = SITE + (url === '/' ? '/' : url + '/');
  const ogImage = SITE + (image || '/images/logo-houseplus-group.svg');
  let html = shell;

  const start = html.indexOf('<title>');
  const end = html.indexOf('<!-- Favicon -->');
  if (start === -1 || end === -1) throw new Error('meta block markers not found');

  const block = `<!-- Primary Meta Tags -->
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="HousePlus Group Nigerian Factory" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    <!-- Geo Tags -->
    <meta name="geo.region" content="NG" />
    <meta name="geo.placename" content="Lagos, Nigeria" />
    <meta name="geo.position" content="6.5967;3.3421" />
    <meta name="ICBM" content="6.5967, 3.3421" />

    <!-- Hreflang for multilingual -->
    ${hreflang(url)}

    ${jsonLd ? `<script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2).split('\n').join('\n    ')}\n    </script>\n\n    ` : ''}`;

  html = html.slice(0, start) + block + html.slice(end);
  return html;
}

function write(route, html) {
  const dir = route === '/' ? distPath : path.join(distPath, route.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

let count = 0;
for (const route of routes) {
  try {
    write(route, render(route, meta[route]));
    count++;
  } catch (e) {
    console.error(`✗ ${route}: ${e.message}`);
  }
}

for (const p of products) {
  const url = `/products/${p.id}`;
  const html = render(url, {
    title: `${p.nameEn} — HousePlus Group Nigerian Factory`,
    description: p.descEn,
    image: p.image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.nameEn,
      description: p.descEn,
      image: SITE + p.image,
      url: SITE + url,
      brand: { '@type': 'Brand', name: 'HousePlus Group Nigerian Factory' },
      manufacturer: {
        '@type': 'Organization',
        name: 'HousePlus Group Nigerian Factory',
        url: 'https://www.houseplus.com.ng',
        parentOrganization: { '@type': 'Organization', name: 'HousePlus Group', url: 'https://www.houseplus-ch.com' },
      },
    },
  });
  write(url, html);
  count++;
}

console.log(`✓ prerendered ${count + 1} routes (incl. ${products.length} products)`);
