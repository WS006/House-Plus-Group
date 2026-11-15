// ============================================================
// House Plus Group - Guides Index (/guides/)
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import { addBreadcrumbSchema } from '@/lib/seo';
import { GUIDES } from './Guide';
import { useEffect } from 'react';
import { Link } from 'wouter';

/** Ordering is deliberate: the pricing guide is the highest-intent entry. */
const GUIDE_ORDER = [
  'solar-panel-price-nigeria',
  'how-to-size-a-solar-system',
  'inverter-vs-generator-nigeria',
  'lifepo4-vs-lead-acid-battery',
];

export default function Guides() {
  useEffect(() => {
    addBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Guides' }]);
  }, []);

  const ordered = GUIDE_ORDER.map((slug) => GUIDES.find((g) => g.slug === slug)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Guides' }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">Solar Buying Guides</h1>
          <p className="text-white/60 max-w-3xl">
            Straight answers on pricing, sizing and equipment choices for the Nigerian market — written
            by the factory, no invented figures.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {ordered.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[#0f2d5e]/20 transition-all group"
            >
              <h2 className="text-lg font-bold text-[#0f2d5e] mb-2 group-hover:text-[#b45309] transition-colors">
                {guide.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{guide.description}</p>
              <span className="text-[#b45309] text-sm font-semibold inline-flex items-center gap-1 mt-3">
                Read the guide <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
