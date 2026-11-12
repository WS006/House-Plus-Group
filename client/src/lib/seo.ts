/**
 * SEO helpers: per-route metadata, canonical handling and structured data.
 *
 * Per-route titles/descriptions live in shared/routes.meta.json — the same file
 * the prerenderer and sitemap generator read. Keeping one copy means the
 * prerendered HTML, the hydrated SPA and the sitemap can never disagree.
 */

import routesMeta from '@shared/routes.meta.json';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schema?: Record<string, any>;
}

/** Site canonical origin — all canonical/og:url values point here. */
const SITE_ORIGIN = 'https://www.houseplus.com.ng';

/** Default share card (1200x630, see tools/generate-og-images.mjs). */
const DEFAULT_OG_IMAGE = '/images/og/home.jpg';

/** Route -> 1200x630 share card. */
const OG_BY_KEY: Record<string, string> = {
  home: '/images/og/home.jpg',
  about: '/images/og/about.jpg',
  products: '/images/og/products.jpg',
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
  home: 'HousePlus Group Nigerian Factory, HousePlus Group, solar panels, inverters, lithium batteries, home appliances, 3C electronics, Nigeria manufacturer, Lagos factory, OEM ODM',
  about: 'HousePlus Group Nigerian Factory, Nigerian manufacturer, Africa trade bridge, OEM ODM services, company history',
  products: 'solar panels, inverters, lithium batteries, home appliances, air fryer, blender, 3C electronics, factory direct',
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
    const key = keyForPath(route.path);
    out[key] = {
      title: route.title,
      description: route.description,
      keywords: KEYWORDS[key] ?? '',
      canonical: SITE_ORIGIN + (route.path === '/' ? '/' : route.path),
      ogImage: OG_BY_KEY[key] ?? DEFAULT_OG_IMAGE,
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

  cleanupStaleSchemas(clean);

  // Product detail pages own their own title/description/schema.
  if (/^\/products\/[^/]+$/.test(clean)) {
    updateCanonicalLink(SITE_ORIGIN + clean);
    return;
  }

  const key = keyForPath(clean);

  if (pageMetadata[key] && key !== 'admin') {
    updatePageMeta(key);
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
 * Product detail meta. Titles are kept short enough to survive SERP truncation:
 * "Product name | HousePlus" rather than appending the full legal entity name.
 */
export function updateProductMeta(product: { name: string; description: string; image?: string; ogImage?: string }) {
  const title = `${product.name} | HousePlus`;
  const image = SITE_ORIGIN + (product.ogImage || DEFAULT_OG_IMAGE);
  const productUrl = SITE_ORIGIN + normalizePath(window.location.pathname) + '/';

  document.title = title;
  updateMetaTag('name', 'description', product.description);
  updateMetaTag('property', 'og:type', 'product');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', product.description);
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '630');
  updateMetaTag('property', 'og:image:alt', title);
  updateMetaTag('property', 'og:url', productUrl);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', product.description);
  updateMetaTag('name', 'twitter:image', image);
  updateMetaTag('name', 'twitter:image:alt', title);
  updateMetaTag('name', 'twitter:url', productUrl);
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
 * Product schema. `offers` is emitted even without a published price, because
 * an Offer with availability (but no price) is what makes a page eligible for
 * product rich results — the previous version omitted `offers` entirely, so
 * Google had nothing to show.
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  sku?: string;
  price?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url?: string;
}) {
  const productUrl = product.url || `${SITE_ORIGIN}${normalizePath(window.location.pathname)}/`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? SITE_ORIGIN + product.image : SITE_ORIGIN + DEFAULT_OG_IMAGE,
    sku: product.sku,
    url: productUrl,
    brand: { '@type': 'Brand', name: 'HousePlus Group Nigerian Factory' },
    manufacturer: { '@type': 'Organization', name: 'HousePlus Group Nigerian Factory' },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'HousePlus Group Nigerian Factory' },
      // A price is only claimed when one is actually published.
      ...(product.price ? { price: product.price.toString() } : {}),
    },
    ...(product.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating.toString(),
            reviewCount: (product.reviewCount || 1).toString(),
          },
        }
      : {}),
  };
}

/** Article schema for news posts. */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image ? SITE_ORIGIN + article.image : SITE_ORIGIN + DEFAULT_OG_IMAGE,
    author: { '@type': 'Organization', name: article.author || 'HousePlus Group' },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'HousePlus Group Nigerian Factory',
      logo: { '@type': 'ImageObject', url: SITE_ORIGIN + DEFAULT_OG_IMAGE },
    },
  };
}
