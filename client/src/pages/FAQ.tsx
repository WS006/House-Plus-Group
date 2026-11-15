// ============================================================
// House Plus Group - FAQ Page
//
// Content lives in shared/faq.json so the same text powers the visible page,
// the FAQPage schema and llms.txt. Questions render as <h3> inside a grouped
// <h2> section: an accordion whose questions are <button> text is invisible to
// the extraction that answer engines do, and a heading that is not on the page
// makes the FAQPage markup invalid.
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { useLanguage } from '@/contexts/LanguageContext';
import faqGroups from '@shared/faq.json';
import {
  CheckCircle,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { generateFAQPageSchema, injectSchema, clearSchemaScripts } from '@/lib/schema';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  group: string;
  id: string;
  faqs: FaqItem[];
}

const GROUPS = faqGroups as FaqGroup[];

/** Flat list for the schema; must match what is rendered below. */
const ALL_FAQS = GROUPS.flatMap((group) => group.faqs);

export default function FAQ() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('price-0');
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    clearSchemaScripts();
    injectSchema(
      generateFAQPageSchema(ALL_FAQS.map((faq) => ({ question: faq.q, answer: faq.a }))),
      'faq'
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_faq') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('faq_title')}</h1>
          <p className="text-white/60">
            {ALL_FAQS.length} answers on pricing, minimum order quantities, shipping, warranty and
            solar sizing.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {GROUPS.map((group) => (
          <section key={group.id} className="mb-10">
            <h2 className="text-lg font-black text-[#0f2d5e] mb-4">{group.group}</h2>
            <div className="space-y-3">
              {group.faqs.map((faq, i) => {
                const id = `${group.id}-${i}`;
                const open = openId === id;
                return (
                  <div key={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3>
                      <button
                        onClick={() => setOpenId(open ? null : id)}
                        aria-expanded={open}
                        aria-controls={`${id}-answer`}
                        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0f2d5e]"
                      >
                        <span className="font-semibold text-[#0f2d5e] pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#b45309] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>
                    {/* The answer is always in the HTML; collapsing only hides it
                        visually, so crawlers and answer engines still read it. */}
                    <div
                      id={`${id}-answer`}
                      hidden={!open}
                      className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4"
                    >
                      {faq.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Still have questions */}
        <div className="mt-12 bg-[#0f2d5e] rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-[#f59e0b]/20 text-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-white font-bold text-xl mb-3">Still Have Questions?</h2>
          <p className="text-white/60 mb-6">
            Our team answers enquiries within one business day, in English or Chinese.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setInquiryOpen(true)}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Send Inquiry
            </button>
            <a
              href="https://wa.me/2349078080738"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
