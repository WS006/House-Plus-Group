/**
 * Schema.org Structured Data Generator
 * Generates JSON-LD structured data for SEO optimization
 */

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

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HousePlus Group Nigerian Factory",
    "alternateName": ["HousePlus Group Nigeria", "HousePlus Nigeria", "HousePlus Group Nigerian Factory"],
    "url": "https://www.houseplus.com.ng",
    "logo": "https://www.houseplus.com.ng/images/logo-houseplus-group.svg",
    "parentOrganization": {
      "@type": "Organization",
      "name": "HousePlus Group",
      "url": "https://www.houseplus-ch.com"
    },
    "description": "Nigerian branch and local entity of HousePlus Group, supplying solar energy products, home appliances and 3C electronics across Nigeria, Africa and global markets. Group website: https://www.houseplus-ch.com",
    "email": "jack@houseplus-ch.com",
    "telephone": ["+2349078080738", "+8615578119543"],
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "8 Eso Cl, Ikeja GRA",
        "addressLocality": "Ikeja",
        "addressRegion": "Lagos",
        "postalCode": "101233",
        "addressCountry": "NG"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+2349078080738",
        "contactType": "sales",
        "availableLanguage": ["English", "Chinese"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/HousePlusNigeria",
      "https://www.instagram.com/houseplusgroup",
      "https://www.linkedin.com/company/houseplus-group"
    ]
  };
}

/**
 * Generate WebPage Schema
 */
export function generateWebPageSchema(config: SchemaConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": config.pageTitle,
    "description": config.pageDescription,
    "url": config.pageUrl,
    "image": config.imageUrl || "https://www.houseplus.com.ng/images/hero-solar.jpg",
    "isPartOf": {
      "@type": "WebSite",
      "name": "HousePlus Group Nigerian Factory",
      "url": "https://www.houseplus.com.ng"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HousePlus Group Nigerian Factory",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.houseplus.com.ng/images/logo-houseplus-group.svg"
      }
    }
  };
}

/**
 * Generate Product Schema
 */
export function generateProductSchema(config: SchemaConfig) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": config.productName || "House Plus Product",
    "description": config.productDescription || config.pageDescription,
    "image": config.imageUrl || "https://www.houseplus.com.ng/images/hero-solar.jpg",
    "brand": {
      "@type": "Brand",
      "name": "HousePlus Group Nigerian Factory"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "HousePlus Group Nigerian Factory",
      "url": "https://www.houseplus.com.ng"
    },
    "url": config.pageUrl
  };

  if (config.productPrice && config.productCurrency) {
    schema.offers = {
      "@type": "Offer",
      "price": config.productPrice,
      "priceCurrency": config.productCurrency,
      "availability": "https://schema.org/InStock",
      "url": config.pageUrl
    };
  }

  if (config.productRating && config.productReviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": config.productRating,
      "reviewCount": config.productReviewCount
    };
  }

  return schema;
}

/**
 * Generate Article Schema
 */
export function generateArticleSchema(config: SchemaConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": config.pageTitle,
    "description": config.pageDescription,
    "image": config.imageUrl || "https://www.houseplus.com.ng/images/hero-solar.jpg",
    "datePublished": config.articlePublishedDate || new Date().toISOString(),
    "dateModified": config.articleModifiedDate || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": config.articleAuthor || "HousePlus Group Nigerian Factory"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HousePlus Group Nigerian Factory",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.houseplus.com.ng/images/logo-houseplus-group.svg"
      }
    }
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate LocalBusiness Schema
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "HousePlus Group Nigerian Factory",
    "image": "https://www.houseplus.com.ng/images/logo-houseplus-group.svg",
    "description": "Nigerian branch of HousePlus Group providing solar energy products, home appliances, and 3C electronics to the African market.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "8 Eso Cl, Ikeja GRA",
      "addressLocality": "Ikeja",
      "addressRegion": "Lagos",
      "postalCode": "101233",
      "addressCountry": "NG"
    },
    "telephone": "+2349078080738",
    "email": "jack@houseplus-ch.com",
    "url": "https://www.houseplus.com.ng",
    "priceRange": "$$",
    "areaServed": ["NG", "Africa", "Global"]
  };
}

/**
 * Inject schema into page head
 */
export function injectSchema(schema: any) {
  if (typeof document === 'undefined') return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Generate Service Schema
 */
export function generateServiceSchema(serviceName: string, serviceDescription: string, serviceUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": serviceDescription,
    "url": serviceUrl,
    "provider": {
      "@type": "Organization",
      "name": "HousePlus Group Nigerian Factory",
      "url": "https://www.houseplus.com.ng"
    },
    "areaServed": ["NG", "Africa", "Global"]
  };
}

/**
 * Generate FAQPage Schema
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate Person Schema (for team members)
 */
export function generatePersonSchema(name: string, title: string, imageUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": title,
    "image": imageUrl || "https://www.houseplus.com.ng/images/about-team.jpg",
    "worksFor": {
      "@type": "Organization",
      "name": "HousePlus Group Nigerian Factory"
    }
  };
}

/**
 * Generate JobPosting Schema
 */
export function generateJobPostingSchema(jobTitle: string, jobDescription: string, jobUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": jobTitle,
    "description": jobDescription,
    "url": jobUrl,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "HousePlus Group Nigerian Factory",
      "sameAs": "https://www.houseplus.com.ng",
      "logo": "https://www.houseplus.com.ng/images/logo-houseplus-group.svg"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "8 Eso Cl, Ikeja GRA",
        "addressLocality": "Lagos",
        "addressRegion": "Lagos",
        "postalCode": "101233",
        "addressCountry": "NG"
      }
    },
    "baseSalary": {
      "@type": "PriceSpecification",
      "priceCurrency": "NGN",
      "price": "Competitive"
    },
    "employmentType": "FULL_TIME"
  };
}

/**
 * Generate ContactPoint Schema
 */
export function generateContactPointSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+2349078080738",
    "email": "jack@houseplus-ch.com",
    "areaServed": ["NG", "Africa", "Global"],
    "availableLanguage": ["en", "zh", "fr"]
  };
}

/**
 * Remove existing schema scripts (to avoid duplicates)
 */
export function clearSchemaScripts() {
  if (typeof document === 'undefined') return;

  const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach(script => {
    if (!script.textContent?.includes('Organization')) {
      script.remove();
    }
  });
}
