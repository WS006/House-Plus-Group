// ============================================================
// House Plus Group - Navbar Component
// Design: African Solar Commerce - Navy Blue + Solar Gold
// Features: Fixed top, scroll-hide, mobile hamburger, language switcher
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/lib/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';

const NAV_ITEMS = [
  { key: 'nav_home', path: '/' },
  { key: 'nav_about', path: '/about' },
  { key: 'nav_products', path: '/products' },
  { key: 'nav_factory', path: '/factory' },
  { key: 'nav_team', path: '/team' },
  { key: 'nav_services', path: '/services' },
  { key: 'nav_careers', path: '/careers' },
  { key: 'nav_faq', path: '/faq' },
  { key: 'nav_news', path: '/news' },
  { key: 'nav_contact', path: '/contact' },
] as const;

export default function Navbar() {
  const { t, language, setLanguage, currentLangInfo } = useLanguage();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileOpen
            ? 'bg-[#0f2d5e] shadow-lg shadow-black/20'
            : 'bg-[#0f2d5e]/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/HousePlusGroupLogo_9e1cc7f4.png" 
                alt="HousePlus Group Nigeria Factory"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.slice(0, 7).map(item => (
                <Link
                  key={item.key}
                  href={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors duration-150 ${
                    isActive(item.path)
                      ? 'text-[#f59e0b] bg-white/10'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t(item.key as any)}
                </Link>
              ))}
              <div className="relative group">
                <button className="px-3 py-2 text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1">
                  More <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full right-0 mt-1 bg-[#0f2d5e] border border-white/10 rounded-lg shadow-xl py-1 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {NAV_ITEMS.slice(7).map(item => (
                    <Link
                      key={item.key}
                      href={item.path}
                      className={`block px-4 py-2 text-sm ${
                        isActive(item.path)
                          ? 'text-[#f59e0b] bg-white/10'
                          : 'text-white/85 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t(item.key as any)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/85 hover:text-white hover:bg-white/10 rounded transition-colors text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{currentLangInfo.flag} {currentLangInfo.code.toUpperCase()}</span>
                  <span className="sm:hidden">{currentLangInfo.flag}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px] z-50"
                    >
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors ${
                            language === lang.code
                              ? 'bg-[#0f2d5e]/10 text-[#0f2d5e] font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Button */}
              <Link
                href="/contact"
                className="hidden md:flex items-center gap-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-150"
              >
                {t('nav_get_quote')}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map(item => (
                  <Link
                    key={item.key}
                    href={item.path}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-[#f59e0b] text-[#0f2d5e]'
                        : 'text-white/85 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {t(item.key as any)}
                  </Link>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <Link
                    href="/contact"
                    className="block w-full text-center bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    {t('nav_get_quote')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
