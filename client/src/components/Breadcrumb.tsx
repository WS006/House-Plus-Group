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
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useLanguage();
  const allItems = [{ label: t('breadcrumb_home'), path: '/' }, ...items];

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
      {allItems.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
          {idx === 0 && <Home className="w-3.5 h-3.5 flex-shrink-0" />}
          {item.path && idx < allItems.length - 1 ? (
            <Link href={item.path} className="hover:text-[#0f2d5e] hover:underline transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={idx === allItems.length - 1 ? 'text-[#0f2d5e] font-medium' : ''}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
