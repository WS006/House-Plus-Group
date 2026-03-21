// ============================================================
// House Plus Group - Footer Component
// Design: Deep navy background, solar gold accents
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/lib/i18n';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { Link } from 'wouter';

const PRODUCT_LINKS = [
  { label: 'Solar Panels', path: '/products?cat=solar' },
  { label: 'Inverters', path: '/products?cat=solar' },
  { label: 'Lithium Batteries', path: '/products?cat=solar' },
  { label: 'Home Appliances', path: '/products?cat=appliances' },
  { label: 'Air Fryers', path: '/products?cat=appliances' },
  { label: '3C Electronics', path: '/products?cat=3c' },
  { label: 'Smart Watches', path: '/products?cat=3c' },
  { label: 'Power Banks', path: '/products?cat=3c' },
];

const QUICK_LINKS = [
  { key: 'nav_home', path: '/' },
  { key: 'nav_about', path: '/about' },
  { key: 'nav_factory', path: '/factory' },
  { key: 'nav_services', path: '/services' },
  { key: 'nav_faq', path: '/faq' },
  { key: 'nav_news', path: '/news' },
  { key: 'nav_careers', path: '/careers' },
  { key: 'nav_contact', path: '/contact' },
] as const;

export default function Footer() {
  const { t, language, setLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1f42] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/HousePlusGroupLogo_9e1cc7f4.png" 
              alt="House Plus Group"
              className="h-14 w-auto mb-4"
            />
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {t('footer_desc')}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="https://wa.me/2349078080738" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 hover:bg-[#25D366] rounded-lg flex items-center justify-center transition-colors"
                title="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="mailto:jack@houseplus-ch.com"
                className="w-8 h-8 bg-white/10 hover:bg-[#f59e0b] rounded-lg flex items-center justify-center transition-colors"
                title="Email">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#E4405F] rounded-lg flex items-center justify-center transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#FF0000] rounded-lg flex items-center justify-center transition-colors" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-[#0A66C2] rounded-lg flex items-center justify-center transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#f59e0b] font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer_quick_links')}
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(link => (
                <li key={link.key}>
                  <Link href={link.path}
                    className="text-white/60 hover:text-[#f59e0b] text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-[#f59e0b] rounded-full flex-shrink-0" />
                    {t(link.key as any)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[#f59e0b] font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer_products')}
            </h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map(link => (
                <li key={link.label}>
                  <Link href={link.path}
                    className="text-white/60 hover:text-[#f59e0b] text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-[#f59e0b] rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#f59e0b] font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer_contact')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white/60 text-xs mb-0.5">Attn: Jack</div>
                  <a href="mailto:jack@houseplus-ch.com" className="text-white/80 hover:text-[#f59e0b] text-sm transition-colors">
                    jack@houseplus-ch.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <a href="https://wa.me/2349078080738" target="_blank" rel="noopener noreferrer"
                    className="block text-white/80 hover:text-[#f59e0b] text-sm transition-colors">
                    +234 907 808 0738 (NG)
                  </a>
                  <a href="https://wa.me/8615578119543" target="_blank" rel="noopener noreferrer"
                    className="block text-white/80 hover:text-[#f59e0b] text-sm transition-colors">
                    +86 155 7811 9543 (CN)
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5">
                  <a href="https://maps.app.goo.gl/ciNFnZNAUULu3Pjx9" target="_blank" rel="noopener noreferrer"
                    className="block text-white/60 hover:text-white/80 text-xs transition-colors leading-relaxed">
                    8 Eso Cl, Ikeja GRA, Lagos, Nigeria
                  </a>
                  <a href="https://maps.app.goo.gl/qqQ4upNwdaG1UPAt9" target="_blank" rel="noopener noreferrer"
                    className="block text-white/60 hover:text-white/80 text-xs transition-colors leading-relaxed">
                    3 Herbert Macaulay St, Ikeja GRA, Lagos
                  </a>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="pt-2">
                <div className="text-white/40 text-xs mb-2 uppercase tracking-wide">{t('language')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        language === lang.code
                          ? 'bg-[#f59e0b] text-[#0f2d5e] font-semibold'
                          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {lang.flag} {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-xs text-center sm:text-left">
              © {currentYear} House Plus Group. {t('footer_rights')}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-white/40 hover:text-white/60 text-xs transition-colors">
                {t('footer_privacy')}
              </Link>
              <Link href="/terms" className="text-white/40 hover:text-white/60 text-xs transition-colors">
                {t('footer_terms')}
              </Link>
              <a href="/sitemap.xml" className="text-white/40 hover:text-white/60 text-xs transition-colors">
                {t('footer_sitemap')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
