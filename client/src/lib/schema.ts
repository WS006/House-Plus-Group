/**
 * Schema.org structured data.
 *
 * The company facts live in shared/company.json and are exposed through
 * ./company.ts. This module only assembles them into the per-page shapes and
 * handles the DOM plumbing, so no name, phone number or address is ever typed
 * twice.
 */

import {
  COMPANY,
  ORG_ID,
  SITE_ORIGIN,
  absoluteUrl,
  breadcrumbNode,
  localBusinessNode,
  organizationNode,
  webPageNode,
  webSiteNode,
} from './company';

export interface SchemaConfig {
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
  imageUrl?: string;
  productName?: string;
  productDescription?: string;
  productPrice?: number;
  productCurrency?: string;
  productRating?: number;
  productReviewCount?: number;
  articlePublishedDate?: string;
  articleModifiedDate?: string;
  articleAuthor?: string;
}

/** Strips the origin so nodes can be built from site-relative paths. */
function toPath(pageUrl: string) {
  return pageUrl.replace(SITE_ORIGIN, '').replace(/\/+$/, '') || '/';
}

/** Organization node on its own (kept for pages that want it explicitly). */
export function generateOrganizationSchema() {
  return { '@context': 'https://schema.org', ...organizationNode() };
}

/** WebPage node for a route; the site graph is injected globally. */
export function generateWebPageSchema(config: SchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageNode({
        path: toPath(config.pageUrl),
        title: config.pageTitle,
        description: config.pageDescription,
        image: config.imageUrl ? config.imageUrl.replace(SITE_ORIGIN, '') : undefined,
      }),
    ],
  };
}

/** Site-wide graph: Organization + WebSite, injected once per page. */
export function generateSiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(), webSiteNode()],
  };
}

/**
 * LocalBusiness node. Only used on pages that describe the premises, so the
 * site does not publish 24 competing local entities.
 */
export function generateLocalBusinessSchema() {
  return { '@context': 'https://schema.org', ...localBusinessNode() };
}

/** BreadcrumbList from {name,url} pairs. */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  const last = breadcrumbs[breadcrumbs.length - 1];
  const pagePath = last ? toPath(last.url) : '/';
  return {
    '@context': 'https://schema.org',
    ...breadcrumbNode(
      pagePath,
      breadcrumbs.map((item) => ({ name: item.name, path: toPath(item.url) }))
    ),
  };
}

/** Service offering, attributed to the organization by @id. */
export function generateServiceSchema(serviceName: string, serviceDescription: string, serviceUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    url: absoluteUrl(toPath(serviceUrl)),
    provider: { '@id': ORG_ID },
    areaServed: COMPANY.areaServed,
  };
}

/** FAQPage. Questions must also be visible on the page as headings. */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** Person node for team members. */
export function generatePersonSchema(name: string, title: string, imageUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: title,
    ...(imageUrl ? { image: imageUrl } : {}),
    worksFor: { '@id': ORG_ID },
  };
}

/**
 * Article node for a real, dated article.
 *
 * `datePublished` is required on purpose: the previous version defaulted to
 * `new Date()`, which relabelled every build as "published today". Missing
 * dates are better than fabricated ones, so this throws rather than inventing
 * a timestamp.
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
}) {
  if (!article.datePublished) {
    throw new Error('generateArticleSchema requires a real datePublished');
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: absoluteUrl(toPath(article.url)),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${absoluteUrl(toPath(article.url))}#webpage` },
    ...(article.image ? { image: SITE_ORIGIN + article.image } : {}),
    author: { '@type': 'Organization', '@id': ORG_ID, name: article.author || COMPANY.name },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    publisher: { '@id': ORG_ID },
  };
}

/** ContactPoint for the contact page. */
export function generateContactPointSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: COMPANY.phone,
    email: COMPANY.email,
    areaServed: COMPANY.areaServed,
    availableLanguage: ['English', 'Chinese'],
  };
}

/**
 * Inject a JSON-LD block into <head>.
 * Reuses the script registered under the same key so navigating between routes
 * (or re-running an effect) replaces the block instead of stacking duplicates.
 */
export function injectSchema(schema: unknown, key = 'default') {
  if (typeof document === 'undefined') return;

  const selector = `script[type="application/ld+json"][data-schema-key="${key}"]`;
  const existing = document.querySelector<HTMLScriptElement>(selector);
  const script = existing || document.createElement('script');

  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-schema-key', key);
  script.setAttribute('data-schema-path', window.location.pathname.replace(/\/+$/, '') || '/');
  script.textContent = JSON.stringify(schema);

  if (!existing) document.head.appendChild(script);
}

/**
 * Injects the site-wide graph under the "organization" key.
 *
 * Deliberately does not stamp `data-schema-path`: the node describes the site,
 * not a route, so the route-change cleanup must leave it alone.
 */
export function injectSiteGraph() {
  if (typeof document === 'undefined') return;

  const selector = 'script[type="application/ld+json"][data-schema-key="organization"]';
  const existing = document.querySelector<HTMLScriptElement>(selector);
  const script = existing || document.createElement('script');

  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-schema-key', 'organization');
  script.textContent = JSON.stringify(generateSiteGraph());

  if (!existing) document.head.appendChild(script);
}

/**
 * Remove page-level schema scripts, keeping the site-wide graph and the
 * breadcrumb the router may have just written for this route.
 *
 * Ordering matters: React runs a page's effects before the router's when the
 * route chunk is already loaded, but after it when the chunk arrives later.
 * Excluding "breadcrumb" means the second case no longer wipes a breadcrumb
 * that was already correct for the current URL.
 */
export function clearSchemaScripts() {
  if (typeof document === 'undefined') return;

  const keep = new Set(['organization', 'breadcrumb']);
  document
    .querySelectorAll<HTMLScriptElement>('head script[type="application/ld+json"][data-schema-key]')
    .forEach((script) => {
      const key = script.getAttribute('data-schema-key');
      if (key && !keep.has(key)) script.remove();
    });
}
