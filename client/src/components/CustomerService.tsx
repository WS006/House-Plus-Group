// ============================================================
// House Plus Group - Customer Service Widget
// Design: Right-side floating, WhatsApp/Email/WeChat/Inquiry
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ChevronRight, Mail, MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';
import InquiryModal from './InquiryModal';

export default function CustomerService() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Floating Button Group - Right Side */}
      <div className="fixed right-4 bottom-6 z-40 flex flex-col items-end gap-2">
        {/* Expanded Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-64"
            >
              {/* Header */}
              <div className="bg-[#0f2d5e] px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">{t('cs_title')}</div>
                  <div className="text-[#f59e0b] text-xs">House Plus Group</div>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="p-3 space-y-2">
                {/* WhatsApp Nigeria */}
                <a
                  href="https://wa.me/2349078080738"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors group"
                >
                  <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">WhatsApp (Nigeria)</div>
                    <div className="text-xs text-gray-500">+234 907 808 0738</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#25D366] transition-colors" />
                </a>

                {/* WhatsApp China */}
                <a
                  href="https://wa.me/8615578119543"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors group"
                >
                  <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">WhatsApp (China)</div>
                    <div className="text-xs text-gray-500">+86 155 7811 9543</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#25D366] transition-colors" />
                </a>

                {/* Email */}
                <a
                  href="mailto:jack@houseplus-ch.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 transition-colors group"
                >
                  <div className="w-9 h-9 bg-[#f59e0b] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{t('cs_email')}</div>
                    <div className="text-xs text-gray-500 truncate">jack@houseplus-ch.com</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#f59e0b] transition-colors" />
                </a>

                {/* WeChat */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07C160]/10 hover:bg-[#07C160]/20 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 bg-[#07C160] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{t('cs_wechat')}</div>
                    <div className="text-xs text-gray-500">JackHousePlus</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#07C160] transition-colors" />
                </div>

                {/* Quick Inquiry */}
                <button
                  onClick={() => { setInquiryOpen(true); setOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0f2d5e]/10 hover:bg-[#0f2d5e]/20 transition-colors group"
                >
                  <div className="w-9 h-9 bg-[#0f2d5e] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-800">{t('cs_inquiry')}</div>
                    <div className="text-xs text-gray-500">Get a quote</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0f2d5e] transition-colors" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <div className="flex gap-2">
          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white border border-gray-200 text-gray-600 hover:text-[#0f2d5e] hover:border-[#0f2d5e] rounded-full shadow-lg flex items-center justify-center transition-colors"
            title={t('cs_back_top')}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>

          {/* CS Toggle */}
          <motion.button
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
              open
                ? 'bg-[#0f2d5e] text-white'
                : 'bg-[#25D366] text-white'
            }`}
            title={t('cs_title')}
          >
            {open ? (
              <X className="w-6 h-6" />
            ) : (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
