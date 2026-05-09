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
    title: "HousePlus Group Nigeria Factory | Solar Panels, Home Appliances & 3C Electronics for Africa",
    description: "HousePlus Group Nigeria Factory is a leading manufacturer and supplier of solar panels, inverters, lithium batteries, home appliances, and 3C electronics. Factory direct pricing, OEM/ODM available. Serving Nigeria, Africa and global markets.",
    keywords: "HousePlus Group Nigeria Factory, HousePlus Group, solar panels, inverters, lithium batteries, home appliances, 3C electronics, Nigeria manufacturer, Lagos factory, Africa, OEM ODM, solar energy, air fryer, smart watch, power bank",
    canonical: "https://www.houseplus.com.ng/",
  },
  about: {
    title: "About House Plus Group — China-Africa Manufacturing Bridge",
    description: "Learn about House Plus Group's 10+ years of manufacturing experience, mission to bridge China and Africa, and commitment to quality, integrity, and innovation. Serving 50+ countries with 500+ product SKUs.",
    keywords: "House Plus Group about, China manufacturer, Africa trade bridge, manufacturing experience, OEM ODM services, company history, mission vision values",
    canonical: "https://www.houseplus.com.ng/about",
  },
  products: {
    title: "Products — Solar Panels, Home Appliances & 3C Electronics",
    description: "Browse House Plus Group's extensive product catalog: solar energy solutions (panels, inverters, batteries), home appliances (air fryers, blenders), and 3C electronics (smart watches, power banks). Factory direct pricing.",
    keywords: "solar panels, inverters, lithium batteries, home appliances, air fryer, blender, 3C electronics, smart watch, power bank, USB cable, Bluetooth speaker, factory direct",
    canonical: "https://www.houseplus.com.ng/products",
  },
  factory: {
    title: "Factory — House Plus Group Manufacturing Facilities",
    description: "Explore House Plus Group's state-of-the-art manufacturing facilities in China. ISO certified production, quality control processes, and capacity to handle large-scale orders with OEM/ODM customization.",
    keywords: "manufacturing facility, factory tour, production capacity, ISO certification, quality control, OEM ODM manufacturing, China factory",
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
    title: "FAQ — Frequently Asked Questions | House Plus Group",
    description: "Find answers to common questions about House Plus Group's products, MOQ, payment methods, delivery times, OEM/ODM services, certifications, shipping to Nigeria and Africa.",
    keywords: "FAQ, frequently asked questions, MOQ minimum order quantity, payment methods, delivery time, OEM ODM, certifications, shipping Nigeria Africa",
    canonical: "https://www.houseplus.com.ng/faq",
  },
  news: {
    title: "News & Updates — House Plus Group Latest News",
    description: "Stay updated with the latest news, announcements, and industry insights from House Plus Group. Learn about new products, company milestones, and market trends.",
    keywords: "House Plus Group news, company updates, product announcements, industry news, market trends, company milestones",
    canonical: "https://www.houseplus.com.ng/news",
  },
  careers: {
    title: "Careers — Join House Plus Group Team",
    description: "Explore career opportunities at House Plus Group. We're looking for talented professionals in manufacturing, supply chain, sales, and customer service. Join our growing team.",
    keywords: "careers, job opportunities, manufacturing jobs, supply chain jobs, sales jobs, customer service jobs, House Plus Group careers",
    canonical: "https://www.houseplus.com.ng/careers",
  },
  contact: {
    title: "Contact House Plus Group — Get in Touch",
    description: "Contact House Plus Group for product inquiries, orders, or partnerships. Reach us via phone, email, or WhatsApp. Our team is available 24/7 to assist you.",
    keywords: "contact House Plus Group, phone number, email address, WhatsApp, office location, Lagos Nigeria, customer support",
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
 */
function updateCanonicalLink(href: string) {
  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

/**
 * 为页面添加 Schema.org 结构化数据
 */
export function addPageSchema(schema: Record<string, any>) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
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
    image: product.image || "https://www.houseplus.com.ng/logo.png",
    brand: {
      "@type": "Brand",
      name: "HousePlus Group Nigeria Factory",
    },
    manufacturer: {
      "@type": "Organization",
      name: "HousePlus Group Nigeria Factory",
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
    image: article.image || "https://www.houseplus.com.ng/logo.png",
    author: {
      "@type": "Organization",
      name: article.author || "House Plus Group",
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    publisher: {
      "@type": "Organization",
      name: "HousePlus Group Nigeria Factory",
      logo: {
        "@type": "ImageObject",
        url: "https://www.houseplus.com.ng/logo.png",
      },
    },
  };
}
