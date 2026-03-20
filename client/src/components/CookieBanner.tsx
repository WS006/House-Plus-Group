// ============================================================
// House Plus Group - GDPR Cookie Banner
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('houseplus_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('houseplus_cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('houseplus_cookie_consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f2d5e] border-t border-[#f59e0b]/30 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-5 h-5 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                <p className="text-white/80 text-sm leading-relaxed">
                  {t('cookie_notice')}{' '}
                  <a href="/privacy" className="text-[#f59e0b] hover:underline">
                    {t('cookie_policy')}
                  </a>
                  .
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={decline}
                  className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-lg text-sm transition-colors"
                >
                  {t('cookie_decline')}
                </button>
                <button
                  onClick={accept}
                  className="px-5 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-semibold rounded-lg text-sm transition-colors"
                >
                  {t('cookie_accept')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
