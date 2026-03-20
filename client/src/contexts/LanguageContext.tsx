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
    const saved = localStorage.getItem('houseplus_lang') as Language;
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
    return detectBrowserLanguage();
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('houseplus_lang', lang);
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
