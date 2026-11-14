// ============================================================
// House Plus Group - Breadcrumb Component
// Design: SEO-friendly breadcrumb with structured data
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * "dark" for breadcrumbs placed on the navy page header, "light" for
   * breadcrumbs on a white background. The default stays "light" so existing
   * usages keep their current appearance.
   */
  variant?: 'light' | 'dark';
}

export default function Breadcrumb({ items, variant = 'light' }: BreadcrumbProps) {
  const { t } = useLanguage();
  const allItems = [{ label: t('breadcrumb_home'), path: '/' }, ...items];
  const dark = variant === 'dark';

  return (
    <nav
      aria-label="breadcrumb"
      className={
        dark
          ? 'flex items-center gap-1.5 text-sm text-white/70 flex-wrap'
          : 'flex items-center gap-1.5 text-sm text-gray-500 flex-wrap'
      }
    >
      {allItems.map((item, idx) => {
        const isLast = idx === allItems.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && (
              <ChevronRight
                className={
                  dark
                    ? 'w-3.5 h-3.5 text-gray-500 flex-shrink-0'
                    : 'w-3.5 h-3.5 text-gray-400 flex-shrink-0'
                }
              />
            )}
            {idx === 0 && <Home className="w-3.5 h-3.5 flex-shrink-0" />}
            {item.path && !isLast ? (
              <Link
                href={item.path}
                className={
                  dark
                    ? 'hover:text-white hover:underline transition-colors'
                    : 'hover:text-[#0f2d5e] hover:underline transition-colors'
                }
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? dark
                      ? 'text-white font-medium'
                      : 'text-[#0f2d5e] font-medium'
                    : ''
                }
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
