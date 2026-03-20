// ============================================================
// House Plus Group - FAQ Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const FAQS = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
    { q: t('faq_q7'), a: t('faq_a7') },
    { q: t('faq_q8'), a: t('faq_a8') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_faq') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('faq_title')}</h1>
          <p className="text-white/60">{t('faq_subtitle')}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#0f2d5e] pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-[#f59e0b]" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-[#0f2d5e] rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-[#f59e0b]/20 text-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h3 className="text-white font-bold text-xl mb-3">Still Have Questions?</h3>
          <p className="text-white/60 mb-6">Our team is ready to help you with any questions about our products and services.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setInquiryOpen(true)} className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-6 py-3 rounded-xl transition-colors">
              Send Inquiry
            </button>
            <a href="https://wa.me/2349078080738" target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-xl transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
