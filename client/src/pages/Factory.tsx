// ============================================================
// House Plus Group - Factory Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle, Factory as FactoryIcon, Settings, Shield, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { generateLocalBusinessSchema, injectSchema, clearSchemaScripts } from '@/lib/schema';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const CAPABILITIES = [
  { icon: <FactoryIcon className="w-6 h-6" />, title: 'Modern Production Lines', desc: 'Fully automated assembly lines with advanced machinery for consistent quality output' },
  { icon: <Shield className="w-6 h-6" />, title: 'Strict Quality Control', desc: 'Multi-stage QC inspection from raw materials to finished products, ensuring zero defects' },
  { icon: <Settings className="w-6 h-6" />, title: 'R&D Center', desc: 'Dedicated research and development team for product innovation and customization' },
  { icon: <TrendingUp className="w-6 h-6" />, title: 'Large Production Capacity', desc: 'Monthly capacity of 100,000+ units across all product categories' },
  { icon: <Award className="w-6 h-6" />, title: 'International Certifications', desc: 'CE, RoHS, FCC, ISO 9001:2015 certified manufacturing processes' },
  { icon: <Zap className="w-6 h-6" />, title: 'Fast Lead Times', desc: 'Standard products ready in 7-15 days; OEM/ODM in 20-30 days' },
];

const CERTIFICATIONS = [
  { name: 'CE', desc: 'European Conformity' },
  { name: 'RoHS', desc: 'Restriction of Hazardous Substances' },
  { name: 'FCC', desc: 'Federal Communications Commission' },
  { name: 'ISO 9001', desc: 'Quality Management System' },
  { name: 'SONCAP', desc: 'Standards Organisation of Nigeria' },
  { name: 'UL', desc: 'Underwriters Laboratories' },
];

export default function Factory() {
  const { t } = useLanguage();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  
  useEffect(() => {
    clearSchemaScripts();
    const schema = generateLocalBusinessSchema();
    injectSchema(schema);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_factory') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('factory_title')}</h1>
          <p className="text-white/60">{t('factory_subtitle')}</p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-80 sm:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1400&q=80"
          alt="House Plus Factory"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f2d5e]/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-5xl font-black mb-2">10+</div>
            <div className="text-xl">Years of Manufacturing Excellence</div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-black text-[#0f2d5e] mb-6">World-Class Manufacturing Facility</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{t('factory_desc')}</p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPABILITIES.map((cap, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-12 h-12 bg-[#f59e0b]/20 text-[#f59e0b] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#f59e0b] group-hover:text-white transition-all">
                    {cap.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0f2d5e] mb-3">{cap.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{cap.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Production Stats */}
      <section className="py-16 bg-[#0f2d5e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: 'sq.m Factory Area' },
              { value: '500+', label: 'Skilled Workers' },
              { value: '100,000+', label: 'Monthly Capacity (units)' },
              { value: '99.5%', label: 'Quality Pass Rate' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#f59e0b] mb-2">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#0f2d5e] mb-4">{t('factory_certifications')}</h2>
            <p className="text-gray-500">Our products meet the highest international quality and safety standards</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CERTIFICATIONS.map((cert, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-[#0f2d5e] text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="font-black text-[#0f2d5e] text-lg mb-1">{cert.name}</div>
                  <div className="text-gray-400 text-xs">{cert.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#f59e0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-[#0f2d5e] mb-4">Interested in Factory Visit or Partnership?</h2>
          <p className="text-[#0f2d5e]/70 mb-6">We welcome factory visits and business partnerships. Contact us to schedule a visit.</p>
          <button onClick={() => setInquiryOpen(true)} className="bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-bold px-8 py-4 rounded-xl transition-colors">
            Schedule a Visit
          </button>
        </div>
      </section>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
