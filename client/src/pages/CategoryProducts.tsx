// ============================================================
// House Plus Group - Category Page (/products/solar/ etc.)
//
// The flat /products/ grid gave every product an <h3> and no
// category-level page for a search engine or an answer engine to
// land on. Each category gets a real page: a heading, a written
// introduction, and its products.
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import ResponsiveImage from '@/components/ResponsiveImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { getImageSize } from '@/lib/imageManifest';
import { Product, favoritesStore, productsStore } from '@/lib/store';
import { addBreadcrumbSchema, addPageSchema } from '@/lib/seo';
import { clearSchemaScripts } from '@/lib/schema';
import { motion } from 'framer-motion';
import { ChevronRight, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';

interface CategoryContent {
  slug: string;
  /** schema.org + visible label. */
  name: string;
  title: string;
  description: string;
  /** 120–180 word introduction, first sentence carries the answer. */
  intro: string[];
  /** What a buyer should compare when choosing in this category. */
  buyingTips: { heading: string; body: string }[];
}

export const CATEGORIES: Record<string, CategoryContent> = {
  solar: {
    slug: 'solar',
    name: 'Solar Energy Equipment',
    title: 'Solar Products in Nigeria — Portable Power Stations, Panels, Inverters | HousePlus',
    description:
      'Solar products from HousePlus Group Nigerian Factory: portable power stations (our flagship line), 400W monocrystalline solar panels, 5kW hybrid inverters, 100Ah LiFePO4 batteries, MPPT charge controllers and solar street lights. Factory-direct, OEM/ODM available.',
    intro: [
      'Solar is more than panels. HousePlus Group Nigerian Factory supplies the complete solar product line — portable power stations, monocrystalline solar panels, hybrid inverters, LiFePO4 batteries, MPPT charge controllers and solar street lights — from one supplier, so every component in a shipment is sized to work together.',
      'Our flagship is the portable power station category: a 512Wh LiFePO4 unit with a 500W pure-sine inverter that charges from solar, wall or car socket. It is the fastest-growing product line in Nigeria — no installation, no wiring, power out of the box for phones, laptops, fans, TVs and small appliances, at home, in a shop, on site or at an event. Panels start at an MOQ of 10 pieces, power stations at 20, inverters at 5.',
      'The range is built for Nigerian conditions first: high ambient temperature, dust in the dry season, and multi-day rainy-season clouds. That drives three specification choices — LiFePO4 storage chemistry (not lead-acid) in every battery product including the power stations, inverters rated for 45°C+ operation, and panels with tempered glass and an aluminium frame for handling and hail.',
    ],
    buyingTips: [
      {
        heading: 'Start with a power station if wiring is the blocker',
        body: 'A 512Wh portable power station runs lights, phones, a fan and a TV through an outage with zero installation. It is also the entry product for resellers: the smallest logistics footprint of the solar line and no installer network required.',
      },
      {
        heading: 'Size the battery bank before the panel array',
        body: 'Work out the kilowatt-hours you need per night, divide by the usable fraction of the battery (about 80–90% for LiFePO4), then size the array to refill that bank on an average day — with headroom for harmattan haze and rainy-season cloud.',
      },
      {
        heading: 'Match the inverter to the surge, not the average load',
        body: 'Pumps, fridges and air conditioners draw two to three times their rated power at startup. A 5kW hybrid inverter survives most household surge profiles; a 3kW unit trips on the same load set.',
      },
    ],
  },
  'home-appliances': {
    slug: 'home-appliances',
    name: 'Home Appliances',
    title: 'Home Appliances Wholesale — Air Fryers, Blenders, Rice Cookers | HousePlus',
    description:
      'Kitchen appliances at wholesale MOQ from HousePlus Group Nigerian Factory: 5L digital air fryers, 1200W professional blenders and 5L digital rice cookers, with OEM/ODM branding available.',
    intro: [
      'HousePlus Group Nigerian Factory supplies kitchen appliances at wholesale minimums — 5L digital air fryers, 1200W blenders and 5L digital rice cookers, each with an MOQ of 50 pieces and delivery in 7–15 days.',
      'The range is chosen for the Nigerian retail market: 220V/50Hz motors for local supply, frying and blending performance tuned for local recipes, and packaging that survives sea freight. Retail cartons ship with inner foam as standard.',
      'All three models are OEM/ODM-ready. Logo printing on the housing and full custom packaging are available above a higher minimum than stock orders, because the print plates are set up once per run. We send a digital proof first, then a physical pre-production sample before the full run starts.',
    ],
    buyingTips: [
      {
        heading: 'Check the plug and voltage before the price',
        body: 'Every unit ships 220V/50Hz with a Nigerian-compatible plug on request. Confirming this first avoids a container of appliances that needs adaptors or rewiring on arrival.',
      },
      {
        heading: 'Order a sample before branding',
        body: 'A sample order lets you test the product against local expectations — air-fryer presets, blender jug capacity, rice-cooker keep-warm behaviour — before committing to a 50-piece run with your logo on it.',
      },
      {
        heading: 'Plan packaging for the shelf, not the container',
        body: 'Retail packaging sells the second unit. If you are reselling, budget for custom printed cartons; the pre-production sample stage exists so you can check the artwork before the full run.',
      },
    ],
  },
  '3c-electronics': {
    slug: '3c-electronics',
    name: '3C Electronics',
    title: '3C Electronics Supplier Nigeria — Watches, Earbuds, Power Banks | HousePlus',
    description:
      'HousePlus Group Nigerian Factory supplies smart watches, TWS earbuds, 20000mAh solar power banks and 128GB SD memory cards at wholesale MOQ from 100 pieces. OEM/ODM available.',
    intro: [
      'HousePlus Group Nigerian Factory supplies consumer electronics at wholesale minimums: a health-monitoring smart watch, TWS earbuds with ANC, a 20000mAh solar power bank and 128GB SD memory cards.',
      'Minimums scale with unit value — 100 pieces for watches, earbuds and power banks, 500 for memory cards — and delivery runs 5–10 days for cards and 7–15 days for the rest. The power bank is the category standout for the Nigerian market: a 20000mAh lithium pack with a built-in solar panel for emergency charging and IP65 weather sealing.',
      'As with the appliance line, every model is OEM/ODM-ready: your logo on the housing, custom retail packaging, and firmware defaults (languages, watch faces) configurable above the branding minimum.',
    ],
    buyingTips: [
      {
        heading: 'Specify the battery truthfully',
        body: 'Capacity claims are the most common quality problem in this category. The power bank is specified at 20000mAh with the cell grade stated on the datasheet; ask for the datasheet and test a sample before bulk.',
      },
      {
        heading: 'Verify memory cards with a capacity tester',
        body: 'Counterfeit SD cards are endemic. We supply verification instructions with every card order; a USB capacity tester costs little and reads the true size of a sample before you accept the shipment.',
      },
      {
        heading: 'Confirm certification per model',
        body: 'Radio-frequency products (watches, earbuds) need the right certificates for your market. The applicable certificates are supplied with the quotation for the specific model — ask for the numbers and verify them with the issuing body.',
      },
    ],
  },
};

/** schema.org category labels per catalogue category. */
const CATEGORY_SCHEMA: Record<string, string> = {
  solar: 'Solar energy equipment',
  'home-appliances': 'Home appliances',
  '3c-electronics': 'Consumer electronics',
};

/** Featured product per category, pinned above the grid. */
const FEATURED_BY_CATEGORY: Record<string, string> = {
  solar: 'portable-power-station-500w',
  'home-appliances': 'air-fryer-5l',
  '3c-electronics': 'power-bank-20000',
};

/** Catalogue category per URL slug. */
const CATEGORY_KEY: Record<string, Product['category']> = {
  solar: 'solar',
  'home-appliances': 'appliances',
  '3c-electronics': '3c',
};

export default function CategoryProducts() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const slug = location.replace(/\/+$/, '').split('/').pop() || '';
  const content = CATEGORIES[slug];
  const [favorites, setFavorites] = useState<string[]>(() => favoritesStore.getAll());
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    if (!content) return;
    clearSchemaScripts();
    addPageSchema(
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `https://www.houseplus.com.ng/products/${content.slug}/#webpage`,
        url: `https://www.houseplus.com.ng/products/${content.slug}/`,
        name: content.title,
        description: content.description,
        inLanguage: 'en',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: productsStore
            .getAll()
            .filter((p) => p.category === CATEGORY_KEY[content.slug])
            .map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.nameEn,
              url: `https://www.houseplus.com.ng/products/${p.id}/`,
            })),
        },
      },
      'category'
    );
    addBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      { name: content.name },
    ]);
  }, [slug]);

  if (!content) return null;

  const getName = (p: Product) => {
    const map: Record<string, string> = { en: p.nameEn, zh: p.nameZh, fr: p.nameFr, ru: p.nameRu, es: p.nameEs, ar: p.nameAr };
    return map[language] || p.nameEn;
  };

  const products = productsStore.getAll().filter((p) => p.category === CATEGORY_KEY[content.slug]);
  const featured = products.find((p) => p.id === FEATURED_BY_CATEGORY[content.slug]) || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: t('nav_products'), path: '/products' },
              { label: content.name },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{content.name}</h1>
          <p className="text-white/60 max-w-3xl">{content.intro[0]}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-4 text-gray-600 leading-relaxed mb-12">
          {content.intro.map((paragraph, i) => (
            <p key={i} className={i > 0 ? '' : 'font-medium text-gray-700'}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Flagship: the featured product gets a banner above the grid, so the
            first product a visitor meets is the one we are pushing. */}
        {featured && (
          <div className="bg-gradient-to-br from-[#0f2d5e] to-[#1a3f7a] rounded-3xl overflow-hidden shadow-xl mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <Link href={`/products/${featured.id}`} className="block relative h-64 lg:h-auto group">
                <ResponsiveImage
                  src={featured.image}
                  alt={featured.nameEn}
                  {...getImageSize(featured.image)}
                  priority
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  pictureClassName="block w-full h-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute top-4 left-4 bg-[#f59e0b] text-[#0f2d5e] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                  Flagship
                </span>
              </Link>
              <div className="p-8 lg:p-10 text-white flex flex-col justify-center">
                <h2 className="text-2xl font-black mb-1">{featured.nameEn}</h2>
                <p className="text-[#f59e0b] text-sm font-semibold uppercase tracking-wider mb-4">
                  Our flagship {content.name.toLowerCase()} product
                </p>
                <p className="text-white/80 text-sm leading-relaxed mb-6">{featured.descEn}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-6 max-w-md">
                  {featured.specs.slice(0, 4).map((spec) => (
                    <div key={spec.key} className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/50">{spec.key}</span>
                      <span className="font-semibold text-white/90 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/products/${featured.id}`}
                    className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    View specifications
                  </Link>
                  <button
                    onClick={() => setInquiryOpen(true)}
                    className="border border-white/40 hover:bg-white/10 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Request a quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Choosing guide: the comparison structure answer engines quote. */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="text-xl font-bold text-[#0f2d5e] mb-6">
            Choosing {content.name.toLowerCase()} from HousePlus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.buyingTips.map((tip) => (
              <div key={tip.heading} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-[#0f2d5e] text-sm mb-2">{tip.heading}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#0f2d5e] mb-6">
          {content.name} — {products.length} models
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={i < 3 ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min((i - 3) * 0.05, 0.3) }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100"
            >
              <Link href={`/products/${product.id}`} className="block relative overflow-hidden h-48">
                <ResponsiveImage
                  src={product.image}
                  alt={product.nameEn}
                  {...getImageSize(product.image)}
                  priority={i === 0}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  pictureClassName="block w-full h-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-[#0f2d5e] text-xs font-semibold px-2 py-0.5 rounded-full">
                  MOQ {product.moq}
                </span>
                <span
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
                  aria-hidden="true"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.includes(product.id) ? 'text-red-500 fill-red-500' : 'text-white drop-shadow'}`}
                  />
                </span>
              </Link>
              <div className="p-4">
                <h3 className="font-bold text-[#0f2d5e] text-sm mt-1 mb-1.5 line-clamp-2 group-hover:text-[#b45309] transition-colors">
                  <Link href={`/products/${product.id}`}>{getName(product)}</Link>
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{product.descEn}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>Delivery: {product.delivery}</span>
                  <span>{product.payment}</span>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="w-full text-center bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                >
                  Specifications <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 bg-[#0f2d5e] rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-white font-bold text-xl mb-2">Get a quotation for {content.name.toLowerCase()}</h2>
          <p className="text-white/60 mb-6 text-sm">
            Send the models and quantities you need — we confirm stock, freight and pricing within one
            business day.
          </p>
          <button
            onClick={() => setInquiryOpen(true)}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Request a Quote
          </button>
        </div>
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
