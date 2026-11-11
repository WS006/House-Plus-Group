/**
 * SEO 页面元数据管理工具
 * 为每个页面提供独特的 Meta 描述、关键词和 Schema.org 结构化数据
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  canonical?: string;
  schema?: Record<string, any>;
}

export const pageMetadata: Record<string, PageMetadata> = {
  home: {
    title: "HousePlus Group Nigerian Factory | Solar Panels, Home Appliances & 3C Electronics for Africa",
    description: "HousePlus Group Nigerian Factory is the Nigerian branch of HousePlus Group and a leading supplier of solar panels, inverters, lithium batteries, home appliances, and 3C electronics. Factory direct pricing, OEM/ODM available. Serving Nigeria, Africa and global markets.",
    keywords: "HousePlus Group Nigerian Factory, HousePlus Group, solar panels, inverters, lithium batteries, home appliances, 3C electronics, Nigeria manufacturer, Lagos factory, Africa, OEM ODM, solar energy, air fryer, smart watch, power bank",
    canonical: "https://www.houseplus.com.ng/",
  },
  about: {
    title: "About HousePlus Group Nigerian Factory — Manufacturing Excellence",
    description: "HousePlus Group Nigerian Factory is the Nigerian branch and local entity of HousePlus Group. 10+ years of manufacturing experience supplying solar, appliances and 3C electronics to 50+ countries.",
    keywords: "HousePlus Group Nigerian Factory, HousePlus Group, Nigerian manufacturer, Africa trade bridge, manufacturing experience, OEM ODM services, company history, mission vision values",
    canonical: "https://www.houseplus.com.ng/about",
  },
  products: {
    title: "Products — HousePlus Group Nigerian Factory | Solar, Appliances & 3C",
    description: "Browse the HousePlus Group Nigerian Factory catalogue: solar panels, inverters, lithium batteries, home appliances and 3C electronics. Factory direct pricing, OEM/ODM available.",
    keywords: "HousePlus Group Nigerian Factory, solar panels, inverters, lithium batteries, home appliances, air fryer, blender, 3C electronics, smart watch, power bank, USB cable, Bluetooth speaker, factory direct",
    canonical: "https://www.houseplus.com.ng/products",
  },
  factory: {
    title: "Factory — HousePlus Group Nigerian Factory Manufacturing",
    description: "Explore HousePlus Group's manufacturing facilities, ISO-certified production lines, quality control processes and OEM/ODM capacity for large-scale orders.",
    keywords: "HousePlus Group Nigerian Factory, manufacturing facility, factory tour, production capacity, ISO certification, quality control, OEM ODM manufacturing, China factory",
    canonical: "https://www.houseplus.com.ng/factory",
  },
  team: {
    title: "Team — HousePlus Group Nigerian Factory Leadership",
    description: "Meet the HousePlus Group team: manufacturing, supply chain, quality assurance and customer service experts serving Nigeria, Africa and global buyers.",
    keywords: "House Plus Group team, leadership, manufacturing experts, supply chain professionals, customer service team, company culture",
    canonical: "https://www.houseplus.com.ng/team",
  },
  services: {
    title: "Services — OEM/ODM, Customization & Logistics | HousePlus Group",
    description: "HousePlus Group services: OEM/ODM manufacturing, product customization, bulk orders, quality assurance, logistics support and 24/7 customer service for global buyers.",
    keywords: "OEM services, ODM services, product customization, bulk orders, quality assurance, logistics support, customer service, manufacturing services",
    canonical: "https://www.houseplus.com.ng/services",
  },
  faq: {
    title: "FAQ — HousePlus Group Nigerian Factory | Common Questions",
    description: "Answers to common questions about HousePlus Group Nigerian Factory's products, MOQ, payment methods, delivery times, OEM/ODM services and shipping to Nigeria and Africa.",
    keywords: "HousePlus Group Nigerian Factory, FAQ, frequently asked questions, MOQ, payment methods, delivery time, OEM ODM, certifications, shipping Nigeria Africa",
    canonical: "https://www.houseplus.com.ng/faq",
  },
  news: {
    title: "News & Updates — HousePlus Group Nigerian Factory",
    description: "Latest news, announcements and market insights from HousePlus Group Nigerian Factory: new products, company milestones and solar industry trends in Africa.",
    keywords: "HousePlus Group Nigerian Factory news, company updates, product announcements, industry news, market trends, company milestones",
    canonical: "https://www.houseplus.com.ng/news",
  },
  careers: {
    title: "Careers — Join the HousePlus Group Nigerian Factory Team",
    description: "Career opportunities at HousePlus Group Nigerian Factory in manufacturing, supply chain, sales and customer service. Join our growing Nigeria and China teams.",
    keywords: "careers, job opportunities, manufacturing jobs, supply chain jobs, sales jobs, customer service jobs, House Plus Group careers",
    canonical: "https://www.houseplus.com.ng/careers",
  },
  contact: {
    title: "Contact HousePlus Group Nigerian Factory — Get in Touch",
    description: "Contact HousePlus Group Nigerian Factory for product inquiries, bulk orders or partnerships. Phone, email and WhatsApp support available for Nigeria and global buyers.",
    keywords: "contact HousePlus Group Nigerian Factory, phone number, email address, WhatsApp, office location, Lagos Nigeria, customer support",
    canonical: "https://www.houseplus.com.ng/contact",
  },
  admin: {
    title: "Admin Dashboard — House Plus Group Management",
    description: "Secure admin dashboard for managing products, inquiries, orders, and company information.",
    keywords: "admin dashboard, product management, order management, admin panel",
    canonical: "https://www.houseplus.com.ng/admin",
  },
  privacy: {
    title: "Privacy Policy — HousePlus Group Nigerian Factory",
    description: "How HousePlus Group Nigerian Factory collects, uses and protects personal information, and the rights available to visitors and customers.",
    keywords: "privacy policy, data protection, personal information, GDPR, CCPA, privacy rights",
    canonical: "https://www.houseplus.com.ng/privacy",
  },
  terms: {
    title: "Terms of Service — HousePlus Group Nigerian Factory",
    description: "HousePlus Group Nigerian Factory terms of service covering product sales, shipping, returns, intellectual property and user responsibilities.",
    keywords: "terms of service, terms and conditions, user agreement, legal terms, refund policy, shipping policy",
    canonical: "https://www.houseplus.com.ng/terms",
  },
  notFound: {
    title: "Page Not Found — HousePlus Group Nigerian Factory",
    description: "The page you are looking for does not exist. Browse HousePlus Group Nigerian Factory products, factory information, and contact details instead.",
    keywords: "404, page not found, HousePlus Group Nigerian Factory",
  },
};

/**
 * 更新页面的 Meta 标签
 */
export function updatePageMeta(page: string) {
  const meta = pageMetadata[page];
  if (!meta) return;

  const pageUrl = meta.canonical
    ? normalizeCanonical(meta.canonical)
    : window.location.href;

  // 更新标题
  document.title = meta.title;

  // 更新或创建 Meta 标签
  updateMetaTag("name", "description", meta.description);
  updateMetaTag("name", "keywords", meta.keywords);
  
  // 更新 Open Graph 标签
  updateMetaTag("property", "og:title", meta.title);
  updateMetaTag("property", "og:description", meta.description);
  if (meta.ogImage) {
    updateMetaTag("property", "og:image", meta.ogImage);
  }
  updateMetaTag("property", "og:url", pageUrl);
  
  // 更新 Twitter Card 标签
  updateMetaTag("name", "twitter:card", "summary_large_image");
  updateMetaTag("name", "twitter:title", meta.title);
  updateMetaTag("name", "twitter:description", meta.description);
  if (meta.ogImage) {
    updateMetaTag("name", "twitter:image", meta.ogImage);
  }
  updateMetaTag("name", "twitter:url", pageUrl);

  // 更新 Canonical 链接
  if (meta.canonical) {
    updateCanonicalLink(meta.canonical);
  }
}

/**
 * 站点正式域名，canonical 必须始终指向它（GitHub Pages 的自定义域名）。
 */
const SITE_ORIGIN = "https://www.houseplus.com.ng";

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

/**
 * 统一 canonical / og:url 的形式：绝对地址 + 目录式尾斜杠，
 * 与 GitHub Pages 实际返回的 URL 保持一致。
 */
function normalizeCanonical(href: string) {
  const trimmed = href.replace(/\/+$/, "");
  return trimmed === SITE_ORIGIN || trimmed === "" ? SITE_ORIGIN + "/" : trimmed + "/";
}

/**
 * 路由级 SEO：在 SPA 内部跳转时同步 title / description / canonical，
 * 并清掉上个页面遗留的结构化数据，保证与预渲染 HTML 一致。
 */
export function applyRouteSeo(pathname: string) {
  const clean = normalizePath(pathname);

  // 先清掉上个页面残留的结构化数据（不会误删本页刚注入的）
  cleanupStaleSchemas(clean);

  // 产品详情页的标题、描述和 Product 结构化数据都由 ProductDetail 负责，
  // 这里只同步 canonical。
  if (/^\/products\/[^/]+$/.test(clean)) {
    updateCanonicalLink(SITE_ORIGIN + clean);
    return;
  }

  const key = clean === "/" ? "home" : clean.slice(1).split("/")[0];

  if (pageMetadata[key]) {
    updatePageMeta(key);
    return;
  }

  // 未知路由交给 NotFound 页面，使用 404 专用 Meta，避免残留首页标题。
  // 404 页面不应声明 canonical（指向不存在的 URL 会污染索引）。
  updatePageMeta("notFound");
  document.querySelector('link[rel="canonical"]')?.remove();
}

/**
 * 更新或创建 Meta 标签
 */
function updateMetaTag(
  attribute: "name" | "property",
  value: string,
  content: string
) {
  let tag = document.querySelector(`meta[${attribute}="${value}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

/**
 * 更新 Canonical 链接
 * GitHub Pages 以目录形式提供页面（/about/），canonical 需统一带尾斜杠，
 * 否则预渲染 HTML 与客户端 hydration 后的 canonical 会互相冲突。
 */
function updateCanonicalLink(href: string) {
  const finalHref = normalizeCanonical(href);

  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", finalHref);
}

/**
 * 产品详情页的 Meta 更新。
 * 产品名与描述随语言变化，因此由页面组件自己调用；
 * 路由层只负责 canonical。
 */
export function updateProductMeta(product: {
  name: string;
  description: string;
  image?: string;
}) {
  const title = `${product.name} — HousePlus Group Nigerian Factory`;
  const image = product.image
    ? SITE_ORIGIN + product.image
    : SITE_ORIGIN + "/images/logo-houseplus-group.svg";
  const productUrl = SITE_ORIGIN + normalizePath(window.location.pathname) + "/";

  document.title = title;
  updateMetaTag("name", "description", product.description);
  updateMetaTag("property", "og:title", title);
  updateMetaTag("property", "og:description", product.description);
  updateMetaTag("property", "og:image", image);
  updateMetaTag("property", "og:url", productUrl);
  updateMetaTag("name", "twitter:title", title);
  updateMetaTag("name", "twitter:description", product.description);
  updateMetaTag("name", "twitter:image", image);
  updateMetaTag("name", "twitter:url", productUrl);
}

/**
 * 为页面添加 Schema.org 结构化数据
 * 相同 key 的脚本会被替换，避免切换语言或路由时重复注入。
 * 每条脚本都会标记注入时的路由，路由切换后由 cleanupStaleSchemas 清理。
 */
export function addPageSchema(schema: Record<string, any>, key = "default") {
  const selector = `script[type="application/ld+json"][data-schema-key="${key}"]`;
  const existing = document.querySelector<HTMLScriptElement>(selector);
  const script = existing || document.createElement("script");

  script.setAttribute("type", "application/ld+json");
  script.setAttribute("data-schema-key", key);
  script.setAttribute("data-schema-path", normalizePath(window.location.pathname));
  script.textContent = JSON.stringify(schema);

  if (!existing) {
    document.head.appendChild(script);
  }
}

/**
 * 移除不属于当前路由的结构化数据。
 * 页面的 useEffect 先于 Router 的 useEffect 执行，所以新页面的 Schema
 * 已被打上新路径；这里按路径比对即可安全清理旧页面的残留。
 */
export function cleanupStaleSchemas(pathname: string) {
  const current = normalizePath(pathname);

  document
    .querySelectorAll<HTMLScriptElement>(
      'script[type="application/ld+json"][data-schema-key]'
    )
    .forEach((el) => {
      const owner = el.getAttribute("data-schema-path");
      // 预渲染注入的脚本没有路径标记，保留交由对应页面组件接管。
      if (owner && owner !== current) el.remove();
    });
}

/**
 * 为产品页面生成 Product Schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  price?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image || "https://www.houseplus.com.ng/images/logo-houseplus-group.svg",
    brand: {
      "@type": "Brand",
      name: "HousePlus Group Nigerian Factory",
    },
    manufacturer: {
      "@type": "Organization",
      name: "HousePlus Group Nigerian Factory",
    },
    ...(product.price && {
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price.toString(),
      },
    }),
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount || "1",
      },
    }),
  };
}

/**
 * 为文章/新闻生成 Article Schema
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image || "https://www.houseplus.com.ng/images/logo-houseplus-group.svg",
    author: {
      "@type": "Organization",
      name: article.author || "House Plus Group",
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    publisher: {
      "@type": "Organization",
      name: "HousePlus Group Nigerian Factory",
      logo: {
        "@type": "ImageObject",
        url: "https://www.houseplus.com.ng/images/logo-houseplus-group.svg",
      },
    },
  };
}
