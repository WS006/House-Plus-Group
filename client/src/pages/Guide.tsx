// ============================================================
// House Plus Group - Guide Page (/guides/<slug>/)
//
// Content lives in shared/guides.json so the same file feeds this page, the
// guides index and the prerenderer's head metadata — no title or description is
// typed twice.
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { addBreadcrumbSchema, addPageSchema } from '@/lib/seo';
import { clearSchemaScripts } from '@/lib/schema';
import guides from '@shared/guides.json';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  table?: { headers: string[]; rows: string[][] };
  list?: string[];
}

export interface GuideData {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  answer: string;
  sections: GuideSection[];
  related: { label: string; path: string }[];
}

export const GUIDES = guides as GuideData[];

export default function Guide() {
  const [location] = useLocation();
  const slug = location.replace(/\/+$/, '').split('/').pop() || '';
  const guide = GUIDES.find((g) => g.slug === slug);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    if (!guide) return;
    clearSchemaScripts();
    const url = `https://www.houseplus.com.ng/guides/${guide.slug}/`;
    addPageSchema(
      {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            '@id': `${url}#article`,
            headline: guide.title,
            description: guide.description,
            url,
            inLanguage: 'en',
            author: { '@type': 'Organization', '@id': 'https://www.houseplus.com.ng/#organization' },
            publisher: { '@id': 'https://www.houseplus.com.ng/#organization' },
            // No dates: this is a maintained reference page, not a news
            // article, and a fabricated publication date is worse than none.
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: guide.title,
                acceptedAnswer: { '@type': 'Answer', text: guide.answer },
              },
            ],
          },
        ],
      },
      'guide'
    );
    addBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Guides', path: '/guides' },
      { name: guide.title },
    ]);
  }, [slug]);

  if (!guide) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Guides', path: '/guides' }, { label: guide.title }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-3">{guide.title}</h1>
          <p className="text-white/60">Guide — HousePlus Group Nigerian Factory</p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* The direct answer, first. This is the block answer engines quote. */}
        <div className="bg-white rounded-2xl border-l-4 border-[#f59e0b] shadow-sm p-6 mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#b45309] mb-2">Short answer</h2>
          <p className="text-gray-700 leading-relaxed font-medium">{guide.answer}</p>
        </div>

        <div className="space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-[#0f2d5e] mb-4">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="space-y-2 mb-4">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray-600 leading-relaxed">
                      <span className="text-[#b45309] mt-1 flex-shrink-0" aria-hidden="true">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0f2d5e] text-white">
                        {section.table.headers.map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`px-4 py-2.5 ${ci === 0 ? 'font-semibold text-[#0f2d5e]' : 'text-gray-600'}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-12">
          <h2 className="text-lg font-bold text-[#0f2d5e] mb-4">Continue reading</h2>
          <ul className="space-y-2">
            {guide.related.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="text-[#b45309] hover:text-[#92400e] font-semibold text-sm inline-flex items-center gap-1.5"
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#0f2d5e] rounded-2xl p-8 text-center mt-8">
          <h2 className="text-white font-bold text-xl mb-2">Planning a system?</h2>
          <p className="text-white/60 mb-6 text-sm">
            Send your appliance list and daily usage hours — we return an itemised quotation within one
            business day.
          </p>
          <button
            onClick={() => setInquiryOpen(true)}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Request a Quote
          </button>
        </div>
      </article>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
