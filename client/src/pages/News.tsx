// ============================================================
// House Plus Group - News Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, ChevronRight, Tag } from 'lucide-react';
import { Link } from 'wouter';

const NEWS_ARTICLES = [
  {
    id: 'solar-africa-2024',
    title: 'House Plus Group Expands Solar Product Line for African Market',
    excerpt: 'House Plus Group announces the launch of 15 new solar energy products specifically designed for African market conditions, including high-temperature resistant solar panels and robust inverters.',
    category: 'Company News',
    date: '2024-02-15',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
    tags: ['Solar', 'Africa', 'New Products'],
  },
  {
    id: 'lifepo4-battery-launch',
    title: 'New LiFePO4 Battery Series: 200Ah & 300Ah Models Now Available',
    excerpt: 'Our latest LiFePO4 lithium battery series offers 5000+ cycle life, built-in BMS, and Bluetooth monitoring. Perfect for off-grid solar systems in Nigeria and across Africa.',
    category: 'Product Launch',
    date: '2024-01-28',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80',
    tags: ['Battery', 'LiFePO4', 'Solar'],
  },
  {
    id: 'nigeria-office-expansion',
    title: 'House Plus Opens Third Location in Lagos, Nigeria',
    excerpt: 'To better serve our Nigerian and West African clients, House Plus has opened a third office location at 8 Felicia Koleosho St Allen, Ikeja, Lagos.',
    category: 'Company News',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    tags: ['Nigeria', 'Lagos', 'Expansion'],
  },
  {
    id: 'air-fryer-bestseller',
    title: 'Air Fryer Sales Surge in African Markets — House Plus Leads',
    excerpt: 'The demand for air fryers in Nigeria and other African markets has grown by 300% in 2023. House Plus Group is meeting this demand with factory-direct pricing and fast delivery.',
    category: 'Market News',
    date: '2023-12-20',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80',
    tags: ['Air Fryer', 'Appliances', 'Market'],
  },
  {
    id: 'oem-partnership',
    title: 'House Plus Group Welcomes New OEM/ODM Partnership Program',
    excerpt: 'We are launching a new OEM/ODM partnership program for African brands looking to develop their own product lines. Minimum order quantities starting from 500 units.',
    category: 'Business',
    date: '2023-12-05',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80',
    tags: ['OEM', 'ODM', 'Partnership'],
  },
  {
    id: 'solar-street-light-project',
    title: 'House Plus Solar Street Lights Power Rural Communities in Nigeria',
    excerpt: 'A recent project saw 500 House Plus all-in-one solar street lights installed in rural communities in Ogun State, Nigeria, bringing reliable lighting to thousands of residents.',
    category: 'Project',
    date: '2023-11-18',
    image: 'https://images.unsplash.com/photo-1548613053-22087dd8edb8?w=600&q=80',
    tags: ['Solar Street Light', 'Nigeria', 'Project'],
  },
];

const CATEGORIES = ['All', 'Company News', 'Product Launch', 'Market News', 'Business', 'Project'];

export default function News() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_news') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('news_title')}</h1>
          <p className="text-white/60">{t('news_subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Article */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10 group hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative overflow-hidden h-64 lg:h-auto">
              <img src={NEWS_ARTICLES[0].image} alt={NEWS_ARTICLES[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#f59e0b] text-[#0f2d5e] text-xs font-bold px-3 py-1 rounded-full">Featured</span>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#0f2d5e]/10 text-[#0f2d5e] text-xs font-semibold px-3 py-1 rounded-full">{NEWS_ARTICLES[0].category}</span>
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Calendar className="w-3.5 h-3.5" /> {NEWS_ARTICLES[0].date}
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#0f2d5e] mb-4 group-hover:text-[#f59e0b] transition-colors">{NEWS_ARTICLES[0].title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{NEWS_ARTICLES[0].excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {NEWS_ARTICLES[0].tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 text-[#0f2d5e] font-semibold hover:text-[#f59e0b] transition-colors">
                {t('news_read_more')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEWS_ARTICLES.slice(1).map((article, i) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden h-48">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 text-[#0f2d5e] text-xs font-semibold px-2.5 py-1 rounded-full">{article.category}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                  <Calendar className="w-3.5 h-3.5" /> {article.date}
                </div>
                <h3 className="font-bold text-[#0f2d5e] mb-3 line-clamp-2 group-hover:text-[#f59e0b] transition-colors">{article.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{article.excerpt}</p>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
