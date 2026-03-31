// ============================================================
// House Plus Group - About Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Award, CheckCircle, Globe, Shield, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { generateOrganizationSchema, injectSchema, clearSchemaScripts } from '@/lib/schema';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const TIMELINE = [
  { year: '2012', event: 'House Plus Group founded in China, focusing on consumer electronics manufacturing' },
  { year: '2015', event: 'Expanded to solar energy products, entering the African market' },
  { year: '2018', event: 'Established House Plus Ltd office in Lagos, Nigeria (Ikeja GRA)' },
  { year: '2020', event: 'Launched 3C electronics product line, serving 30+ countries' },
  { year: '2022', event: 'Opened second Nigeria office at Herbert Macaulay St, Ikeja GRA' },
  { year: '2024', event: 'Serving 50+ countries with 500+ product SKUs, 1000+ satisfied clients' },
];

export default function About() {
  const { t } = useLanguage();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    clearSchemaScripts();
    const schema = generateOrganizationSchema();
    injectSchema(schema);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_about') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('about_title')}</h1>
          <p className="text-white/60">Your trusted partner for quality Chinese manufacturing</p>
        </div>
      </div>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 text-[#f59e0b] text-sm font-semibold uppercase tracking-wider mb-4">
                <span className="w-8 h-0.5 bg-[#f59e0b]" />
                Our Story
              </div>
              <h2 className="text-3xl font-black text-[#0f2d5e] mb-6">House Plus Group — Bridging China & Africa</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>House Plus Group Nigeria Factory (also known as House Plus Ltd) is a China-based manufacturer and supplier specializing in a broad range of consumer electronics (3C goods), solar energy solutions, and household appliances.</p>
                <p>With over 10 years of manufacturing experience, we have built a reputation for delivering high-quality, competitively priced products directly from our factory to buyers worldwide — with a special focus on the African market.</p>
                <p>Our Nigeria offices in Lagos serve as the bridge between Chinese manufacturing excellence and Africa's growing consumer demand, providing local support, warehousing, and after-sales service.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setInquiryOpen(true)} className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-6 py-3 rounded-xl transition-colors">
                  Get a Quote
                </button>
                <Link href="/contact" className="border border-[#0f2d5e] text-[#0f2d5e] hover:bg-[#0f2d5e] hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Contact Us
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Globe className="w-6 h-6" />, value: '50+', label: 'Countries Served' },
                  { icon: <Users className="w-6 h-6" />, value: '1000+', label: 'Happy Clients' },
                  { icon: <Award className="w-6 h-6" />, value: '10+', label: 'Years Experience' },
                  { icon: <TrendingUp className="w-6 h-6" />, value: '500+', label: 'Product SKUs' },
                ].map((stat, i) => (
                  <div key={i} className="bg-gradient-to-br from-[#0f2d5e] to-[#1a3f7a] rounded-2xl p-6 text-center">
                    <div className="flex justify-center text-[#f59e0b] mb-3">{stat.icon}</div>
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#0f2d5e] mb-4">Our Mission & Values</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Target className="w-8 h-8" />, title: 'Our Mission', desc: 'To provide high-quality, affordable products directly from Chinese factories to global markets, with a focus on empowering African businesses and consumers.' },
              { icon: <Zap className="w-8 h-8" />, title: 'Our Vision', desc: 'To become the most trusted China-Africa trade bridge, connecting manufacturers with buyers through transparent, efficient, and reliable supply chains.' },
              { icon: <Shield className="w-8 h-8" />, title: 'Our Values', desc: 'Quality, Integrity, Innovation, and Partnership. We believe in building long-term relationships based on trust, transparency, and mutual success.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center h-full">
                  <div className="w-16 h-16 bg-[#f59e0b]/20 text-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-5">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#0f2d5e] mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#0f2d5e] mb-4">Our Journey</h2>
            <p className="text-gray-500">A decade of growth, innovation, and global expansion</p>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gray-200" />
            {TIMELINE.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`flex items-center gap-8 mb-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
                      <div className="text-[#f59e0b] font-black text-xl mb-2">{item.year}</div>
                      <p className="text-gray-600 text-sm">{item.event}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-[#f59e0b] rounded-full border-4 border-white shadow-md flex-shrink-0 z-10" />
                  <div className="flex-1" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-[#0f2d5e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-2xl font-black text-white mb-4">Certifications & Standards</h2>
            <p className="text-white/60 mb-10">Our products meet international quality and safety standards</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['CE Certified', 'RoHS Compliant', 'ISO 9001:2015', 'FCC Approved', 'UL Listed', 'SONCAP Nigeria'].map(cert => (
                <div key={cert} className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-[#f59e0b]" />
                  <span className="font-semibold text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
