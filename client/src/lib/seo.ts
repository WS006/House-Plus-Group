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
    description: "Learn about HousePlus Group Nigerian Factory's 10+ years of manufacturing experience, mission to bridge China and Africa, and commitment to quality, integrity, and innovation. Serving 50+ countries with 500+ product SKUs.",
    keywords: "HousePlus Group Nigerian Factory, HousePlus Group, Nigerian manufacturer, Africa trade bridge, manufacturing experience, OEM ODM services, company history, mission vision values",
    canonical: "https://www.houseplus.com.ng/about",
  },
  products: {
    title: "Products — HousePlus Group Nigerian Factory | Solar, Appliances & 3C",
    description: "Browse HousePlus Group Nigerian Factory's extensive product catalog: solar energy solutions (panels, inverters, batteries), home appliances (air fryers, blenders), and 3C electronics (smart watches, power banks). Factory direct pricing.",
    keywords: "HousePlus Group Nigerian Factory, solar panels, inverters, lithium batteries, home appliances, air fryer, blender, 3C electronics, smart watch, power bank, USB cable, Bluetooth speaker, factory direct",
    canonical: "https://www.houseplus.com.ng/products",
  },
  factory: {
    title: "Factory — HousePlus Group Nigerian Factory Manufacturing",
    description: "Explore HousePlus Group Nigerian Factory's state-of-the-art manufacturing facilities. ISO certified production, quality control processes, and capacity to handle large-scale orders with OEM/ODM customization.",
    keywords: "HousePlus Group Nigerian Factory, manufacturing facility, factory tour, production capacity, ISO certification, quality control, OEM ODM manufacturing, China factory",
    canonical: "https://www.houseplus.com.ng/factory",
  },
  team: {
    title: "Team — House Plus Group Leadership & Experts",
    description: "Meet the experienced team at House Plus Group with expertise in manufacturing, supply chain, quality assurance, and customer service. Dedicated to delivering excellence and building long-term partnerships.",
    keywords: "House Plus Group team, leadership, manufacturing experts, supply chain professionals, customer service team, company culture",
    canonical: "https://www.houseplus.com.ng/team",
  },
  services: {
    title: "Services — OEM/ODM, Customization & Support",
    description: "House Plus Group offers comprehensive services: OEM/ODM manufacturing, product customization, bulk orders, quality assurance, logistics support, and 24/7 customer service for global buyers.",
    keywords: "OEM services, ODM services, product customization, bulk orders, quality assurance, logistics support, customer service, manufacturing services",
    canonical: "https://www.houseplus.com.ng/services",
  },
  faq: {
    title: "FAQ — HousePlus Group Nigerian Factory | Common Questions",
    description: "Find answers to common questions about HousePlus Group Nigerian Factory's products, MOQ, payment methods, delivery times, OEM/ODM services, certifications, shipping to Nigeria and Africa.",
    keywords: "HousePlus Group Nigerian Factory, FAQ, frequently asked questions, MOQ, payment methods, delivery time, OEM ODM, certifications, shipping Nigeria Africa",
    canonical: "https://www.houseplus.com.ng/faq",
  },
  news: {
    title: "News & Updates — HousePlus Group Nigerian Factory News",
    description: "Stay updated with the latest news, announcements, and industry insights from HousePlus Group Nigerian Factory. Learn about new products, company milestones, and market trends.",
    keywords: "HousePlus Group Nigerian Factory news, company updates, product announcements, industry news, market trends, company milestones",
    canonical: "https://www.houseplus.com.ng/news",
  },
  careers: {
    title: "Careers — Join House Plus Group Team",
    description: "Explore career opportunities at House Plus Group. We're looking for talented professionals in manufacturing, supply chain, sales, and customer service. Join our growing team.",
    keywords: "careers, job opportunities, manufacturing jobs, supply chain jobs, sales jobs, customer service jobs, House Plus Group careers",
    canonical: "https://www.houseplus.com.ng/careers",
  },
  contact: {
    title: "Contact HousePlus Group Nigerian Factory — Get in Touch",
    description: "Contact HousePlus Group Nigerian Factory for product inquiries, orders, or partnerships. Reach us via phone, email, or WhatsApp. Our team is available 24/7 to assist you.",
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
    title: "Privacy Policy — House Plus Group",
    description: "Learn how House Plus Group collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.",
    keywords: "privacy policy, data protection, personal information, GDPR, CCPA, privacy rights",
    canonical: "https://www.houseplus.com.ng/privacy",
  },
  terms: {
    title: "Terms of Service — House Plus Group",
    description: "Read House Plus Group Terms of Service. Learn about our policies regarding product sales, shipping, returns, intellectual property, and user responsibilities.",
    keywords: "terms of service, terms and conditions, user agreement, legal terms, refund policy, shipping policy",
    canonical: "https://www.houseplus.com.ng/terms",
  },
};

/**
 * 更新页面的 Meta 标签
 */
export function updatePageMeta(page: string) {
  const meta = pageMetadata[page];
  if (!meta) return;

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
  updateMetaTag("property", "og:url", meta.canonical || window.location.href);
  
  // 更新 Twitter Card 标签
  updateMetaTag("name", "twitter:card", "summary_large_image");
  updateMetaTag("name", "twitter:title", meta.title);
  updateMetaTag("name", "twitter:description", meta.description);
  if (meta.ogImage) {
    updateMetaTag("name", "twitter:image", meta.ogImage);
  }
  updateMetaTag("name", "twitter:url", meta.canonical || window.location.href);

  // 更新 Canonical 链接
  if (meta.canonical) {
    updateCanonicalLink(meta.canonical);
  }
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
  const normalized = href.replace(/\/+$/, "");
  const finalHref =
    normalized === "" || normalized === "https://www.houseplus.com.ng"
      ? "https://www.houseplus.com.ng/"
      : normalized + "/";

  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", finalHref);
}

/**
 * 为页面添加 Schema.org 结构化数据
 * 相同 key 的脚本会被替换，避免切换语言或路由时重复注入
 */
export function addPageSchema(schema: Record<string, any>, key = "default") {
  const selector = `script[type="application/ld+json"][data-schema-key="${key}"]`;
  const existing = document.querySelector<HTMLScriptElement>(selector);
  const script = existing || document.createElement("script");

  script.setAttribute("type", "application/ld+json");
  script.setAttribute("data-schema-key", key);
  script.textContent = JSON.stringify(schema);

  if (!existing) {
    document.head.appendChild(script);
  }
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
