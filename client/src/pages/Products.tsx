// ============================================================
// House Plus Group - Products Page
// Design: Grid layout with filters, search, category tabs
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product, favoritesStore, productsStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { injectSchema, clearSchemaScripts, generateWebPageSchema, generateOrganizationSchema } from '@/lib/schema';

type Category = 'all' | 'solar' | 'appliances' | '3c';

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'All Products',
  solar: '☀️ Solar Energy',
  appliances: '🏠 Home Appliances',
  '3c': '📱 3C Electronics',
};

export default function Products() {
  const { t, language } = useLanguage();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initCat = (params.get('cat') || 'all') as Category;

  const [category, setCategory] = useState<Category>(initCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'new' | 'hot'>('default');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => favoritesStore.getAll());
  const [showFilters, setShowFilters] = useState(false);

  // Inject Schema.org structured data
  useEffect(() => {
    clearSchemaScripts();
    injectSchema(generateWebPageSchema({
      pageTitle: 'Products - House Plus Group',
      pageDescription: 'Browse our complete catalog of solar panels, inverters, lithium batteries, home appliances, and 3C electronics. Factory direct pricing with OEM/ODM options.',
      pageUrl: 'https://www.houseplus.com.ng/products'
    }));
    injectSchema(generateOrganizationSchema());
  }, []);

  const allProducts = productsStore.getAll();

  const filtered = useMemo(() => {
    let list = allProducts;
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.nameEn.toLowerCase().includes(q) ||
        p.descEn.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'new') list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    if (sortBy === 'hot') list = [...list].sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    return list;
  }, [allProducts, category, searchQuery, sortBy]);

  const getProductName = (p: Product) => {
    const map: Record<string, string> = { en: p.nameEn, zh: p.nameZh, fr: p.nameFr, ru: p.nameRu, es: p.nameEs, ar: p.nameAr };
    return map[language] || p.nameEn;
  };

  const toggleFav = (id: string) => {
    favoritesStore.toggle(id);
    setFavorites(favoritesStore.getAll());
  };

  const openInquiry = (productName: string) => {
    setInquiryProduct(productName);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_products') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('products_title')}</h1>
          <p className="text-white/60">Factory-direct products with competitive pricing and fast delivery</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('products_search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([cat, label]) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    category === cat
                      ? 'bg-[#0f2d5e] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 bg-white"
              >
                <option value="default">Default</option>
                <option value="new">Newest</option>
                <option value="hot">Best Sellers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-semibold text-[#0f2d5e]">{filtered.length}</span> products
            {searchQuery && <span> for "<span className="text-[#f59e0b]">{searchQuery}</span>"</span>}
          </p>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearchQuery(''); setCategory('all'); }}
              className="bg-[#0f2d5e] text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.image}
                    alt={getProductName(product)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {product.isNew && <span className="bg-[#10b981] text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>}
                    {product.isHot && <span className="bg-[#f59e0b] text-[#0f2d5e] text-xs font-bold px-2 py-0.5 rounded-full">HOT</span>}
                  </div>
                  <button
                    onClick={() => toggleFav(product.id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      product.category === 'solar' ? 'bg-amber-100 text-amber-700' :
                      product.category === 'appliances' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {product.category === 'solar' ? 'Solar' : product.category === 'appliances' ? 'Appliances' : '3C'}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0f2d5e] text-sm mt-2 mb-1.5 line-clamp-2 group-hover:text-[#f59e0b] transition-colors">
                    {getProductName(product)}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>MOQ: {product.moq}</span>
                    <span>{product.delivery}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 text-center bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      Details <ChevronRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => openInquiry(getProductName(product))}
                      className="flex-1 text-center bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-semibold py-2 rounded-lg text-xs transition-colors"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} productName={inquiryProduct} />
    </div>
  );
}
