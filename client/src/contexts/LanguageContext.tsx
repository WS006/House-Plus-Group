// ============================================================
// House Plus Group - Language Context
// Manages: language state, RTL, localStorage persistence
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, LANGUAGES, TranslationKey, detectBrowserLanguage, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  currentLangInfo: typeof LANGUAGES[0];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // ?lang=xx wins: the prerendered pages advertise these URLs as hreflang
    // alternates, so they must actually render in that language for crawlers.
    if (typeof window !== 'undefined') {
      const fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (fromUrl && LANGUAGES.some(l => l.code === fromUrl)) {
        return fromUrl as Language;
      }
    }
    const saved = localStorage.getItem('houseplus_lang') as Language;
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
    // Default to English for all users
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('houseplus_lang', lang);

    // Keep the URL in sync with the language so it can be shared and so the
    // hreflang alternates we publish resolve to the matching rendering.
    const url = new URL(window.location.href);
    if (lang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState(window.history.state, '', url.toString());
  };

  const isRTL = LANGUAGES.find(l => l.code === language)?.rtl ?? false;
  const currentLangInfo = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  const t = (key: TranslationKey) => getTranslation(language, key);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, currentLangInfo }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
