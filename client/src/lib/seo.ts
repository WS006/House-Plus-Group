/**
 * SEO helpers: per-route metadata, canonical handling and structured data.
 *
 * Per-route titles/descriptions live in shared/routes.meta.json — the same file
 * the prerenderer and sitemap generator read. Keeping one copy means the
 * prerendered HTML, the hydrated SPA and the sitemap can never disagree.
 */

import routesMeta from '@shared/routes.meta.json';
import guidesMeta from '@shared/guides.json';
import { COMPANY, SITE_ORIGIN, breadcrumbNode } from './company';
import { injectSiteGraph } from './schema';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schema?: Record<string, any>;
}

/** Default share card (1200x630, see tools/generate-og-images.mjs). */
const DEFAULT_OG_IMAGE = '/images/og/home.jpg';

/** Route -> 1200x630 share card. */
const OG_BY_KEY: Record<string, string> = {
  home: '/images/og/home.jpg',
  about: '/images/og/about.jpg',
  products: '/images/og/products.jpg',
  'products/solar': '/images/og/product-power-station-v2.jpg',
  'products/home-appliances': '/images/og/product-air-fryer.jpg',
  'products/3c-electronics': '/images/og/product-power-bank.jpg',
  guides: '/images/og/home.jpg',
  factory: '/images/og/factory.jpg',
  services: '/images/og/services.jpg',
  news: '/images/og/news.jpg',
  team: '/images/og/about.jpg',
  contact: '/images/og/factory.jpg',
  faq: '/images/og/home.jpg',
  careers: '/images/og/about.jpg',
};

/** Keyword sets stay in the client: they are advisory, not used by prerender. */
const KEYWORDS: Record<string, string> = {
  home: 'HousePlus Group Nigerian Factory, HousePlus Group, portable power stations, solar panels, inverters, lithium batteries, home appliances, 3C electronics, Nigeria manufacturer, Lagos factory, OEM ODM',
  about: 'HousePlus Group Nigerian Factory, Nigerian manufacturer, Africa trade bridge, OEM ODM services, company history',
  products: 'solar panels, inverters, lithium batteries, home appliances, air fryer, blender, 3C electronics, factory direct',
  'products/solar': 'portable power station Nigeria, solar products Nigeria, solar panel price Nigeria, hybrid inverter, LiFePO4 battery, MPPT charge controller, solar street light',
  'products/home-appliances': 'home appliances Nigeria, wholesale air fryer, blender supplier, rice cooker wholesale, kitchen appliances Nigeria',
  'products/3c-electronics': '3C electronics Nigeria, smart watch supplier, TWS earbuds wholesale, solar power bank, SD memory card supplier',
  guides: 'solar panel price Nigeria, how to size solar system, inverter vs generator Nigeria, LiFePO4 vs lead acid',
  factory: 'manufacturing facility, factory tour, production capacity, ISO certification, quality control, OEM ODM',
  team: 'HousePlus Group team, leadership, manufacturing experts, supply chain, customer service',
  services: 'OEM services, ODM services, product customisation, bulk orders, quality assurance, logistics support',
  faq: 'HousePlus Group FAQ, MOQ, payment methods, delivery time, OEM ODM, shipping Nigeria Africa',
  news: 'HousePlus Group news, company updates, product announcements, solar industry trends',
  careers: 'careers, job opportunities, manufacturing jobs, supply chain jobs, sales jobs',
  contact: 'contact HousePlus Group, phone number, email, WhatsApp, office location, Lagos Nigeria',
  privacy: 'privacy policy, data protection, personal information, GDPR, privacy rights',
  terms: 'terms of service, terms and conditions, user agreement, refund policy, shipping policy',
};

/** Short labels used by the visible breadcrumb and the BreadcrumbList node. */
const NAV_LABEL: Record<string, string> = {
  about: 'About',
  products: 'Products',
  guides: 'Guides',
  factory: 'Factory',
  team: 'Team',
  services: 'Services',
  faq: 'FAQ',
  news: 'News',
  careers: 'Careers',
  contact: 'Contact',
  privacy: 'Privacy',
  terms: 'Terms',
};

/** Route path -> metadata key. '/' maps to 'home'. */
function keyForPath(pathname: string): string {
  const clean = normalizePath(pathname);
  return clean === '/' ? 'home' : clean.slice(1).split('/')[0];
}

function pathFor(key: string): string {
  return key === 'home' ? '/' : `/${key}`;
}

function buildMetadata(): Record<string, PageMetadata> {
  const out: Record<string, PageMetadata> = {};
  for (const route of routesMeta as Array<{ path: string; title: string; description: string }>) {
    // Nested routes keep their full path as the key. Keying on the first
    // segment made "/products/solar" overwrite "/products", so the catalogue
    // page shipped the solar category's title.
    const key = route.path === '/' ? 'home' : route.path.replace(/^\/+/, '');
    out[key] = {
      title: route.title,
      description: route.description,
      keywords: KEYWORDS[key] ?? '',
      canonical: SITE_ORIGIN + (route.path === '/' ? '/' : route.path),
      ogImage: OG_BY_KEY[key] ?? DEFAULT_OG_IMAGE,
    };
  }
  // Guide detail pages: metadata comes from shared/guides.json, the same file
  // the guide component renders, so the head and the body cannot disagree.
  for (const guide of guidesMeta as Array<{ slug: string; metaTitle: string; description: string }>) {
    out[`guides/${guide.slug}`] = {
      title: guide.metaTitle,
      description: guide.description,
      keywords: KEYWORDS.guides,
      canonical: `${SITE_ORIGIN}/guides/${guide.slug}`,
      ogImage: OG_BY_KEY.guides,
    };
  }
  // Pages that exist but are intentionally out of the sitemap.
  out.notFound = {
    title: 'Page Not Found — HousePlus Group Nigeria',
    description:
      'The page you are looking for does not exist. Browse HousePlus Group Nigerian Factory products, factory information and contact details instead.',
    keywords: '404, page not found, HousePlus Group Nigerian Factory',
  };
  out.admin = {
    title: 'Admin — HousePlus Group',
    description: 'Internal demo panel for managing sample content.',
    keywords: 'admin',
  };
  return out;
}

export const pageMetadata: Record<string, PageMetadata> = buildMetadata();

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * Canonical/og:url always use an absolute URL with the trailing slash GitHub
 * Pages actually serves, so prerendered HTML and hydrated SPA agree.
 */
function normalizeCanonical(href: string) {
  const trimmed = href.replace(/\/+$/, '');
  return trimmed === SITE_ORIGIN || trimmed === '' ? `${SITE_ORIGIN}/` : `${trimmed}/`;
}

export function updatePageMeta(key: string) {
  const meta = pageMetadata[key];
  if (!meta) return;

  const pageUrl = meta.canonical ? normalizeCanonical(meta.canonical) : window.location.href;

  document.title = meta.title;
  // Real routes are indexable; unknown ones are not (see applyRouteSeo).
  updateMetaTag('name', 'robots', key === 'notFound' ? 'noindex, follow' : 'index, follow');
  updateMetaTag('name', 'description', meta.description);
  if (meta.keywords) updateMetaTag('name', 'keywords', meta.keywords);

  updateMetaTag('property', 'og:title', meta.title);
  updateMetaTag('property', 'og:description', meta.description);
  updateMetaTag('property', 'og:url', pageUrl);
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', meta.title);
  updateMetaTag('name', 'twitter:description', meta.description);
  updateMetaTag('name', 'twitter:url', pageUrl);

  if (meta.ogImage) {
    const absolute = SITE_ORIGIN + meta.ogImage;
    updateMetaTag('property', 'og:image', absolute);
    updateMetaTag('property', 'og:image:width', '1200');
    updateMetaTag('property', 'og:image:height', '630');
    updateMetaTag('property', 'og:image:alt', meta.title);
    updateMetaTag('name', 'twitter:image', absolute);
    updateMetaTag('name', 'twitter:image:alt', meta.title);
  }

  if (meta.canonical) updateCanonicalLink(meta.canonical);
}

/**
 * Route-level SEO: sync title/description/canonical on SPA navigation and drop
 * structured data left over from the previous route.
 */
export function applyRouteSeo(pathname: string) {
  const clean = normalizePath(pathname);

  // The site graph describes the site, not the route, so it is refreshed on
  // every navigation and never removed by the cleanup below.
  injectSiteGraph();
  cleanupStaleSchemas(clean);

  // Nested keys first: "/products/solar" must resolve to its own metadata, not
  // to the catalogue's. Product detail pages have no entry at all and manage
  // their own head from the product record.
  const fullKey = clean === '/' ? 'home' : clean.replace(/^\/+/, '');
  if (/^\/products\/[^/]+$/.test(clean) && !pageMetadata[fullKey]) {
    updateCanonicalLink(SITE_ORIGIN + clean);
    return;
  }

  const key = pageMetadata[fullKey] ? fullKey : keyForPath(clean);

  if (pageMetadata[key] && key !== 'admin') {
    updatePageMeta(key);
    // BreadcrumbList for every static page; product pages build a three-level
    // trail themselves, so they are skipped here.
    if (clean !== '/' && NAV_LABEL[key]) {
      addBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: NAV_LABEL[key] }]);
    }
    return;
  }

  // Unknown route: noindex metadata, no canonical.
  if (key === 'admin') {
    // Demo panel — keep it out of the index but don't mislabel it as a 404.
    updatePageMeta('admin');
    updateMetaTag('name', 'robots', 'noindex, nofollow');
  } else {
    updatePageMeta('notFound');
  }
  document.querySelector('link[rel="canonical"]')?.remove();
}

function updateMetaTag(attribute: 'name' | 'property', value: string, content: string) {
  let tag = document.querySelector(`meta[${attribute}="${value}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

function updateCanonicalLink(href: string) {
  const finalHref = normalizeCanonical(href);
  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', finalHref);
}

/**
 * Product detail meta.
 *
 * `title` is the English, search-optimised headline from products.data.json so
 * the hydrated page and the prerendered HTML agree even when the visitor is
 * browsing in another language; `name` stays localised for the image alt text.
 */
export function updateProductMeta(product: {
  name: string;
  title?: string;
  description: string;
  image?: string;
  ogImage?: string;
}) {
  const title = product.title || `${product.name} | HousePlus`;
  const image = SITE_ORIGIN + (product.ogImage || DEFAULT_OG_IMAGE);
  const productUrl = SITE_ORIGIN + normalizePath(window.location.pathname) + '/';

  document.title = title;
  updateMetaTag('name', 'robots', 'index, follow');
  updateMetaTag('name', 'description', product.description);
  updateMetaTag('property', 'og:type', 'product');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', product.description);
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '630');
  updateMetaTag('property', 'og:image:alt', product.name);
  updateMetaTag('property', 'og:url', productUrl);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', product.description);
  updateMetaTag('name', 'twitter:image', image);
  updateMetaTag('name', 'twitter:image:alt', product.name);
  updateMetaTag('name', 'twitter:url', productUrl);
  updateCanonicalLink(productUrl);
}

/**
 * Adds a JSON-LD block. Scripts are keyed so re-rendering (e.g. language
 * switch) replaces rather than duplicates them.
 */
export function addPageSchema(schema: Record<string, any>, key = 'default') {
  const selector = `script[type="application/ld+json"][data-schema-key="${key}"]`;
  const existing = document.querySelector<HTMLScriptElement>(selector);
  const script = existing || document.createElement('script');

  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-schema-key', key);
  script.setAttribute('data-schema-path', normalizePath(window.location.pathname));
  script.textContent = JSON.stringify(schema);

  if (!existing) document.head.appendChild(script);
}

/**
 * Removes structured data belonging to routes other than the current one.
 * Page effects run before the router effect, so anything already stamped with
 * the current path belongs to this page and is kept.
 */
export function cleanupStaleSchemas(pathname: string) {
  const current = normalizePath(pathname);

  document
    .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"][data-schema-key]')
    .forEach((el) => {
      const owner = el.getAttribute('data-schema-path');
      // Prerendered blocks carry no path marker; their page component adopts them.
      if (owner && owner !== current) el.remove();
    });
}

/**
 * Product schema.
 *
 * No `offers` block: Google requires `offers.price` for merchant listings, and
 * publishing an Offer without a price produced a Search Console error for no
 * benefit. The catalogue has no public prices, so the node stays a plain
 * Product — valid, and still the shape AI answer engines read for specs.
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  sku?: string;
  image?: string;
  category?: string;
  specs?: Array<{ key: string; value: string }>;
  url?: string;
}) {
  const productUrl = product.url || `${SITE_ORIGIN}${normalizePath(window.location.pathname)}/`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: product.description,
    image: product.image ? SITE_ORIGIN + product.image : SITE_ORIGIN + DEFAULT_OG_IMAGE,
    sku: product.sku,
    url: productUrl,
    ...(product.category ? { category: product.category } : {}),
    brand: { '@type': 'Brand', name: COMPANY.name },
    manufacturer: { '@id': `${SITE_ORIGIN}/#organization` },
    ...(product.specs?.length
      ? {
          additionalProperty: product.specs.map((spec) => ({
            '@type': 'PropertyValue',
            name: spec.key,
            value: spec.value,
          })),
        }
      : {}),
  };
}

/**
 * BreadcrumbList for the current page.
 *
 * `trail` is the visible breadcrumb: Home first, current page last. The last
 * entry has no path, so it resolves to the page itself.
 */
export function addBreadcrumbSchema(trail: Array<{ name: string; path?: string }>, key = 'breadcrumb') {
  const pagePath = normalizePath(window.location.pathname);
  addPageSchema(
    {
      '@context': 'https://schema.org',
      ...breadcrumbNode(pagePath, trail),
    },
    key
  );
}
