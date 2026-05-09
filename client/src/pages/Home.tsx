// ============================================================
// House Plus Group - Home Page
// Design: African Solar Commerce - Navy Blue + Solar Gold
// Sections: Hero Carousel, Stats, Industries, Products, Trust, CTA
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { productsStore } from '@/lib/store';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Award, CheckCircle, ChevronLeft, ChevronRight, Factory, Globe, Package, Shield, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import InquiryModal from '@/components/InquiryModal';
import { injectSchema, clearSchemaScripts, generateWebPageSchema, generateOrganizationSchema } from '@/lib/schema';

// Hero slides data
const HERO_SLIDES = [
  {
    titleKey: 'hero_slide1_title' as const,
    subtitleKey: 'hero_slide1_subtitle' as const,
    btnKey: 'hero_slide1_btn' as const,
    btnPath: '/products',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/hero-solar-9WdVUX6sZBGChCdiLZdas5.webp',
    badge: 'Solar Energy Solutions',
  },
  {
    titleKey: 'hero_slide2_title' as const,
    subtitleKey: 'hero_slide2_subtitle' as const,
    btnKey: 'hero_slide2_btn' as const,
    btnPath: '/products?cat=3c',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/hero-products-3Fp7bhLBGeJPBrpb6QyQSd.webp',
    badge: '3C Electronics',
  },
  {
    titleKey: 'hero_slide3_title' as const,
    subtitleKey: 'hero_slide3_subtitle' as const,
    btnKey: 'hero_slide3_btn' as const,
    btnPath: '/contact',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/hero-factory-jqHyZnMd2rskttsRiV62zU.webp',
    badge: 'Factory Direct',
  },
];

// Animated counter
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Section animation wrapper
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const products = productsStore.getAll();
  const hotProducts = products.filter(p => p.isHot).slice(0, 6);

  // Inject Schema.org structured data
  useEffect(() => {
    clearSchemaScripts();
    injectSchema(generateWebPageSchema({
      pageTitle: 'HousePlus Group Nigeria Factory | Solar Panels, Home Appliances & 3C Electronics for Africa',
      pageDescription: 'HousePlus Group Nigeria Factory is a leading manufacturer and supplier of solar panels, inverters, lithium batteries, home appliances, and 3C electronics. Factory direct pricing, OEM/ODM available. Serving Nigeria, Africa and global markets.',
      pageUrl: 'https://www.houseplus.com.ng/',
      imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/hero-solar-9WdVUX6sZBGChCdiLZdas5.webp'
    }));
    injectSchema(generateOrganizationSchema());
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen">
      {/* ===== HERO CAROUSEL ===== */}
      <section className="relative h-[85vh] min-h-[500px] max-h-[750px] overflow-hidden bg-[#0f2d5e]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt={`${t(HERO_SLIDES[currentSlide].titleKey)} - HousePlus Group Nigeria Factory`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d5e]/85 via-[#0f2d5e]/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
                  <Zap className="w-3.5 h-3.5" />
                  {HERO_SLIDES[currentSlide].badge}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                  {t(HERO_SLIDES[currentSlide].titleKey)}
                </h1>
                <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
                  {t(HERO_SLIDES[currentSlide].subtitleKey)}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={HERO_SLIDES[currentSlide].btnPath}
                    className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    {t(HERO_SLIDES[currentSlide].btnKey)}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setInquiryOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm backdrop-blur-sm"
                  >
                    {t('nav_get_quote')}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <button onClick={prevSlide} className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${i === currentSlide ? 'w-6 h-2 bg-[#f59e0b]' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f2d5e] to-transparent h-24 z-10" />
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[#0f2d5e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Factory className="w-6 h-6" />, value: 10, suffix: '+', key: 'stats_years' },
              { icon: <Package className="w-6 h-6" />, value: 500, suffix: '+', key: 'stats_products' },
              { icon: <Globe className="w-6 h-6" />, value: 50, suffix: '+', key: 'stats_countries' },
              { icon: <Users className="w-6 h-6" />, value: 1000, suffix: '+', key: 'stats_clients' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2 text-[#f59e0b]">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/60 text-xs mt-1 uppercase tracking-wide">{t(stat.key as any)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#f59e0b] text-sm font-semibold uppercase tracking-wider mb-3">
              <span className="w-8 h-0.5 bg-[#f59e0b]" />
              What We Offer
              <span className="w-8 h-0.5 bg-[#f59e0b]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d5e] mb-4">
              Three Core Industries
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              House Plus Group specializes in three major product categories, providing one-stop sourcing solutions for global buyers.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '☀️',
                titleKey: 'industry_solar',
                descKey: 'industry_solar_desc',
                path: '/products?cat=solar',
                color: 'from-amber-50 to-orange-50',
                border: 'border-amber-200',
                badge: 'bg-amber-100 text-amber-700',
                products: ['Solar Panels', 'Inverters', 'LiFePO4 Batteries', 'Charge Controllers', 'Solar Street Lights'],
              },
              {
                icon: '🏠',
                titleKey: 'industry_appliances',
                descKey: 'industry_appliances_desc',
                path: '/products?cat=appliances',
                color: 'from-blue-50 to-indigo-50',
                border: 'border-blue-200',
                badge: 'bg-blue-100 text-blue-700',
                products: ['Air Fryers', 'Blenders', 'Rice Cookers', 'Kitchen Appliances', 'Household Electronics'],
              },
              {
                icon: '📱',
                titleKey: 'industry_3c',
                descKey: 'industry_3c_desc',
                path: '/products?cat=3c',
                color: 'from-green-50 to-emerald-50',
                border: 'border-green-200',
                badge: 'bg-green-100 text-green-700',
                products: ['Smart Watches', 'TWS Earphones', 'Power Banks', 'SD Cards', 'USB Cables'],
              },
            ].map((industry, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`bg-gradient-to-br ${industry.color} border ${industry.border} rounded-2xl p-8 h-full flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="text-5xl mb-5">{industry.icon}</div>
                  <h3 className="text-xl font-bold text-[#0f2d5e] mb-3">{t(industry.titleKey as any)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{t(industry.descKey as any)}</p>
                  <ul className="space-y-1.5 mb-6 flex-1">
                    {industry.products.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={industry.path}
                    className="inline-flex items-center gap-2 text-[#0f2d5e] font-semibold text-sm hover:gap-3 transition-all"
                  >
                    View Products <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOT PRODUCTS ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-[#f59e0b] text-sm font-semibold uppercase tracking-wider mb-3">
                <span className="w-8 h-0.5 bg-[#f59e0b]" />
                Best Sellers
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d5e]">{t('products_title')}</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-[#0f2d5e] font-semibold text-sm hover:text-[#f59e0b] transition-colors">
              {t('btn_view_all')} <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={product.image}
                      alt={product.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {product.isNew && (
                        <span className="bg-[#10b981] text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                      )}
                      {product.isHot && (
                        <span className="bg-[#f59e0b] text-[#0f2d5e] text-xs font-bold px-2 py-0.5 rounded-full">HOT</span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        product.category === 'solar' ? 'bg-amber-100 text-amber-700' :
                        product.category === 'appliances' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {product.category === 'solar' ? '☀️ Solar' : product.category === 'appliances' ? '🏠 Appliances' : '📱 3C'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#0f2d5e] text-base mb-2 line-clamp-2 group-hover:text-[#f59e0b] transition-colors">
                      {product.nameEn}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.descEn}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>MOQ: {product.moq}</span>
                      <span>Delivery: {product.delivery}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex-1 text-center bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                      >
                        {t('products_details')}
                      </Link>
                      <button
                        onClick={() => setInquiryOpen(true)}
                        className="flex-1 text-center bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-semibold py-2 rounded-lg text-sm transition-colors"
                      >
                        {t('products_inquire')}
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              {t('btn_view_all')} Products
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 text-[#f59e0b] text-sm font-semibold uppercase tracking-wider mb-4">
                <span className="w-8 h-0.5 bg-[#f59e0b]" />
                Why Choose Us
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d5e] mb-6">
                HousePlus Group Nigeria Factory — Your Trusted Local Partner
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                HousePlus Group Nigeria Factory has been serving Africa and global markets for over 10 years. We provide premium solar energy products, home appliances, and 3C electronics direct from our Lagos manufacturing facility with uncompromising quality.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: 'ISO Certified', desc: 'International quality standards' },
                  { icon: <TrendingUp className="w-5 h-5" />, title: 'Factory Direct', desc: 'Best price, no middlemen' },
                  { icon: <Globe className="w-5 h-5" />, title: 'Global Shipping', desc: 'Door-to-door to Africa & worldwide' },
                  { icon: <Award className="w-5 h-5" />, title: 'OEM/ODM', desc: 'Custom branding available' },
                  { icon: <Users className="w-5 h-5" />, title: '24/7 Support', desc: 'Dedicated account manager' },
                  { icon: <Star className="w-5 h-5" />, title: '10+ Years', desc: 'Proven track record' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-[#0f2d5e]/5 transition-colors">
                    <div className="w-9 h-9 bg-[#f59e0b]/20 text-[#f59e0b] rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0f2d5e] text-sm">{item.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/about-team-jJL8e3Sfsi9U6dH7YCRUAi.webp"
                  alt="HousePlus Group Nigeria Factory Team"
                  className="rounded-2xl shadow-2xl w-full object-cover h-[450px]"
                  loading="lazy"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-[#0f2d5e] text-white p-5 rounded-2xl shadow-xl max-w-[200px]">
                  <div className="text-3xl font-black text-[#f59e0b]">10+</div>
                  <div className="text-sm text-white/80">Years of Excellence in Nigeria Manufacturing</div>
                </div>
                <div className="absolute -top-6 -right-6 bg-[#f59e0b] text-[#0f2d5e] p-4 rounded-2xl shadow-xl">
                  <div className="text-2xl font-black">50+</div>
                  <div className="text-xs font-semibold">Countries</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== AFRICA MARKET ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/africa-market-WLNYuj8npFK3XLGKhLanDJ.webp"
            alt="Africa Market"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#0f2d5e]/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-[#f59e0b] text-sm font-semibold uppercase tracking-wider mb-4">
              <span className="w-8 h-0.5 bg-[#f59e0b]" />
              Nigeria & Africa
              <span className="w-8 h-0.5 bg-[#f59e0b]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
              Empowering Nigeria & Africa's Growth
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              HousePlus Group Nigeria Factory bridges the gap between manufacturing excellence and Africa's booming market. Our Lagos factory provides local jobs and high-quality products for the continent.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-center">
                <div className="text-2xl font-black text-[#f59e0b]">Lagos</div>
                <div className="text-white/70 text-sm">Nigeria Office</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-center">
                <div className="text-2xl font-black text-[#f59e0b]">China</div>
                <div className="text-white/70 text-sm">Manufacturing Base</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-center">
                <div className="text-2xl font-black text-[#f59e0b]">50+</div>
                <div className="text-white/70 text-sm">Countries Served</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-[#f59e0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f2d5e] mb-4">
              Ready to Start Your Order?
            </h2>
            <p className="text-[#0f2d5e]/70 mb-8 text-lg max-w-xl mx-auto">
              Contact us today for factory-direct pricing, product samples, and customization options.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setInquiryOpen(true)}
                className="bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
              >
                Get a Free Quote
              </button>
              <a
                href="https://wa.me/2349078080738"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-8 py-4 rounded-xl transition-colors text-base flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
