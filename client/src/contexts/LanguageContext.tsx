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
  /** Appends ?lang=<code> to an internal link so the choice survives navigation. */
  withLang: (href: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Reads ?lang= from the current URL, falling back to stored preference. */
function initialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && LANGUAGES.some(l => l.code === fromUrl)) {
      return fromUrl as Language;
    }
  }
  try {
    const saved = localStorage.getItem('houseplus_lang') as Language;
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
  } catch {
    /* storage blocked */
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('houseplus_lang', lang);
    } catch {
      /* ignore */
    }

    // Keep ?lang= in the URL so the choice is shareable and survives a reload.
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

  /**
   * Internal links previously dropped ?lang=, so a visitor browsing in Chinese
   * who clicked any nav item landed on an English URL. The page still *looked*
   * Chinese (state survived the SPA transition) but sharing that URL gave the
   * recipient the English version.
   */
  const withLang = (href: string) => {
    if (language === 'en') return href;
    if (!href.startsWith('/') || href.startsWith('//')) return href;
    if (/[?&]lang=/.test(href)) return href;
    return href + (href.includes('?') ? '&' : '?') + `lang=${language}`;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, currentLangInfo, withLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
