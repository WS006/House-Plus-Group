/**
 * The company, defined once.
 *
 * Every JSON-LD block, every canonical URL and every NAP (name/address/phone)
 * reference in the app reads from shared/company.json. Before this file existed
 * the same company was described three different ways — `addressLocality` was
 * "Lagos" in index.html and "Ikeja" in schema.ts, and `sameAs` listed Instagram
 * on one page but not another. Search engines and AI answer engines merge
 * entities by exact match, so a disagreement is read as a different company.
 *
 * prerender.mjs and sitemap.mjs read the same JSON, so the prerendered HTML, the
 * hydrated SPA and the sitemap cannot drift apart.
 */
import company from '@shared/company.json';

export const COMPANY = company;

/** Canonical origin. All absolute URLs are built from this. */
export const SITE_ORIGIN = company.url;

/** Stable identifiers so nodes can reference each other instead of repeating. */
export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const LOCALBUSINESS_ID = `${SITE_ORIGIN}/#localbusiness`;

/** Absolute URL for a site-relative path, with the trailing slash Pages serves. */
export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const clean = pathname.replace(/\/+$/, '');
  return clean === '' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${clean}/`;
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: company.address.streetAddress,
    addressLocality: company.address.addressLocality,
    addressRegion: company.address.addressRegion,
    postalCode: company.address.postalCode,
    addressCountry: company.address.addressCountry,
  };
}

/** The parent group, referenced by @id-compatible fields. */
function parentOrganization() {
  return {
    '@type': 'Organization',
    '@id': `${company.parentOrganization.url}/#organization`,
    name: company.parentOrganization.name,
    url: company.parentOrganization.url,
  };
}

/** Organization node: the entity itself. */
export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: company.name,
    alternateName: company.alternateName,
    url: company.url,
    description: company.description,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_ORIGIN}${company.logo}`,
      width: company.logoWidth,
      height: company.logoHeight,
    },
    image: `${SITE_ORIGIN}${company.logo}`,
    email: company.email,
    telephone: company.phone,
    address: postalAddress(),
    sameAs: company.sameAs,
    parentOrganization: parentOrganization(),
    areaServed: company.areaServed,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: company.phone,
        email: company.email,
        availableLanguage: ['English', 'Chinese'],
        areaServed: company.areaServed,
      },
    ],
  };
}

/** WebSite node: what the site is, and who publishes it. */
export function webSiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: company.url,
    name: company.name,
    description: company.description,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

/**
 * LocalBusiness node. Only emitted on pages that actually describe the premises
 * (contact, factory), because repeating a local business on every route is how
 * a site ends up with 24 competing local entities.
 */
export function localBusinessNode() {
  return {
    '@type': 'LocalBusiness',
    '@id': LOCALBUSINESS_ID,
    name: company.name,
    url: company.url,
    image: `${SITE_ORIGIN}${company.logo}`,
    logo: `${SITE_ORIGIN}${company.logo}`,
    description: company.description,
    telephone: company.phone,
    email: company.email,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: company.geo.latitude,
      longitude: company.geo.longitude,
    },
    priceRange: '$$',
    areaServed: company.areaServed,
    sameAs: company.sameAs,
    parentOrganization: { '@id': ORG_ID },
  };
}

/** The site-wide graph injected on every page: one Organization + one WebSite. */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(), webSiteNode()],
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path, e.g. "/products". Absolute URLs are accepted as-is. */
  path?: string;
}

/** BreadcrumbList for a page. `items` should start at Home and end at the page. */
export function breadcrumbNode(pagePath: string, items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(pagePath)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path ? absoluteUrl(item.path) : absoluteUrl(pagePath),
    })),
  };
}

/** A WebPage node that points back at the site graph instead of restating it. */
export function webPageNode(config: {
  path: string;
  title: string;
  description: string;
  image?: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(config.path)}#webpage`,
    url: absoluteUrl(config.path),
    name: config.title,
    description: config.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
    ...(config.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_ORIGIN}${config.image}` } } : {}),
  };
}
