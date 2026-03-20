// ============================================================
// House Plus Group - Product Detail Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import InquiryModal from '@/components/InquiryModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product, favoritesStore, productsStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, Heart, Package, Share2, Shield, Truck, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'wouter';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(() => favoritesStore.isFavorite(id || ''));

  const product = productsStore.getById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
          <Link href="/products" className="bg-[#0f2d5e] text-white px-6 py-3 rounded-xl font-semibold">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const getName = (p: Product) => {
    const map: Record<string, string> = { en: p.nameEn, zh: p.nameZh, fr: p.nameFr, ru: p.nameRu, es: p.nameEs, ar: p.nameAr };
    return map[language] || p.nameEn;
  };
  const getDesc = (p: Product) => {
    const map: Record<string, string> = { en: p.descEn, zh: p.descZh, fr: p.descFr, ru: p.descRu, es: p.descEs, ar: p.descAr };
    return map[language] || p.descEn;
  };

  const toggleFav = () => {
    favoritesStore.toggle(product.id);
    setIsFav(!isFav);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: getName(product), url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const relatedProducts = productsStore.getAll()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f2d5e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: t('nav_products'), path: '/products' },
            { label: getName(product) },
          ]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
              <img
                src={product.images[activeImg] || product.image}
                alt={getName(product)}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-[#f59e0b]' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex gap-2 mb-2">
                  {product.isNew && <span className="bg-[#10b981] text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>}
                  {product.isHot && <span className="bg-[#f59e0b] text-[#0f2d5e] text-xs font-bold px-2 py-0.5 rounded-full">HOT SELLER</span>}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    product.category === 'solar' ? 'bg-amber-100 text-amber-700' :
                    product.category === 'appliances' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {product.category === 'solar' ? '☀️ Solar' : product.category === 'appliances' ? '🏠 Appliances' : '📱 3C'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f2d5e]">{getName(product)}</h1>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleFav} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isFav ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-400'}`}>
                  <Heart className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} />
                </button>
                <button onClick={share} className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-[#0f2d5e] flex items-center justify-center transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{getDesc(product)}</p>

            {/* Key Info */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: <Package className="w-4 h-4" />, label: 'MOQ', value: product.moq },
                { icon: <Truck className="w-4 h-4" />, label: 'Delivery', value: product.delivery },
                { icon: <Shield className="w-4 h-4" />, label: 'Payment', value: product.payment },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="flex justify-center text-[#f59e0b] mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold text-[#0f2d5e]">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => setInquiryOpen(true)}
                className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {t('products_inquire')}
              </button>
              <a
                href="https://wa.me/2349078080738"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold text-[#0f2d5e] mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.specs.map((spec, i) => (
              <div key={i} className={`flex items-center justify-between py-3 px-4 rounded-xl ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
                <span className="text-gray-500 text-sm">{spec.key}</span>
                <span className="font-semibold text-[#0f2d5e] text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#0f2d5e] mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <img src={p.image} alt={getName(p)} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[#0f2d5e] line-clamp-2 group-hover:text-[#f59e0b] transition-colors">{getName(p)}</h3>
                    <div className="text-xs text-gray-400 mt-1">MOQ: {p.moq}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} productName={getName(product)} />
    </div>
  );
}
