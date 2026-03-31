// ============================================================
// House Plus Group - Services Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { Award, Globe, Package, Settings, Shield, Truck, Users, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { generateServiceSchema, injectSchema, clearSchemaScripts } from '@/lib/schema';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Services() {
  const { t } = useLanguage();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    clearSchemaScripts();
    // 为 OEM/ODM 服务添加 Service Schema
    const oemSchema = generateServiceSchema('OEM/ODM Services', 'Custom manufacturing and original design manufacturing services for solar energy, home appliances, and 3C electronics', 'https://www.houseplus.com.ng/services');
    injectSchema(oemSchema);
  }, []);

  const SERVICES = [
    { icon: <Settings className="w-7 h-7" />, titleKey: 'services_oem', descKey: 'services_oem_desc', color: 'bg-amber-50 border-amber-200', iconBg: 'bg-amber-100 text-amber-600' },
    { icon: <Package className="w-7 h-7" />, titleKey: 'services_wholesale', descKey: 'services_wholesale_desc', color: 'bg-blue-50 border-blue-200', iconBg: 'bg-blue-100 text-blue-600' },
    { icon: <Truck className="w-7 h-7" />, titleKey: 'services_logistics', descKey: 'services_logistics_desc', color: 'bg-green-50 border-green-200', iconBg: 'bg-green-100 text-green-600' },
    { icon: <Users className="w-7 h-7" />, titleKey: 'services_aftersale', descKey: 'services_aftersale_desc', color: 'bg-purple-50 border-purple-200', iconBg: 'bg-purple-100 text-purple-600' },
    { icon: <Zap className="w-7 h-7" />, titleKey: 'services_consulting', descKey: 'services_consulting_desc', color: 'bg-orange-50 border-orange-200', iconBg: 'bg-orange-100 text-orange-600' },
    { icon: <Shield className="w-7 h-7" />, titleKey: 'services_quality', descKey: 'services_quality_desc', color: 'bg-red-50 border-red-200', iconBg: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_services') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('services_title')}</h1>
          <p className="text-white/60">{t('services_subtitle')}</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`${service.color} border rounded-2xl p-8 h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center mb-5`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#0f2d5e] mb-3">{t(service.titleKey as any)}</h3>
                  <p className="text-gray-600 leading-relaxed flex-1">{t(service.descKey as any)}</p>
                  <button onClick={() => setInquiryOpen(true)} className="mt-5 text-[#0f2d5e] font-semibold text-sm hover:text-[#f59e0b] transition-colors text-left">
                    Learn More →
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#0f2d5e] mb-4">How We Work</h2>
            <p className="text-gray-500">Simple, transparent process from inquiry to delivery</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Inquiry', desc: 'Send us your requirements via WhatsApp, email, or inquiry form' },
              { step: '02', title: 'Quotation', desc: 'We provide competitive factory-direct pricing within 24 hours' },
              { step: '03', title: 'Sample', desc: 'Request product samples for quality verification before bulk order' },
              { step: '04', title: 'Production', desc: 'Confirmed orders go into production with regular progress updates' },
              { step: '05', title: 'Delivery', desc: 'Quality inspection, packaging, and door-to-door shipping worldwide' },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 relative">
                  <div className="w-12 h-12 bg-[#0f2d5e] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-lg">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-[#0f2d5e] mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-[#0f2d5e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Globe className="w-8 h-8" />, title: 'Global Reach', desc: 'Shipping to 50+ countries with reliable freight partners' },
              { icon: <Award className="w-8 h-8" />, title: 'Quality Guarantee', desc: '100% quality inspection before shipment, 12-month warranty' },
              { icon: <Users className="w-8 h-8" />, title: 'Dedicated Support', desc: 'Personal account manager for every client, 24/7 availability' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#f59e0b]/20 text-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
