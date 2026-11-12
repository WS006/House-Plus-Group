// ============================================================
// House Plus Group - Inquiry Modal Component
// Design: Clean form modal with navy/gold theme
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { submitInquiry } from '@/lib/forms';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
}

export default function InquiryModal({ open, onClose, productName }: InquiryModalProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    product: productName || '',
    quantity: '',
    requirements: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitInquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      country: form.country,
      subject: `Inquiry: ${form.product}`,
      message: form.requirements,
      product: form.product,
      quantity: form.quantity,
      requirements: form.requirements,
      type: 'inquiry',
    });
    setSubmitting(false);

    if (!result.ok) {
      toast.error(`Could not send your inquiry: ${result.error}`);
      return;
    }

    toast.success(
      result.via === 'mailto'
        ? 'Your email app should now be open with your inquiry ready to send.'
        : t('inquiry_success')
    );
    setForm({ name: '', email: '', phone: '', country: '', product: productName || '', quantity: '', requirements: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0f2d5e] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">{t('inquiry_title')}</h3>
                <p className="text-[#f59e0b] text-sm">House Plus Group</p>
              </div>
              <button onClick={onClose} aria-label="Close inquiry form" className="text-white/60 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inquiry-name" className="block text-xs font-medium text-gray-600 mb-1">{t('contact_name')} *</label>
                  <input
                    id="inquiry-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-country" className="block text-xs font-medium text-gray-600 mb-1">{t('contact_country')}</label>
                  <input
                    id="inquiry-country"
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-email" className="block text-xs font-medium text-gray-600 mb-1">{t('contact_email')} *</label>
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="inquiry-phone" className="block text-xs font-medium text-gray-600 mb-1">{t('contact_phone')}</label>
                <input
                  id="inquiry-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inquiry-product" className="block text-xs font-medium text-gray-600 mb-1">{t('inquiry_product')}</label>
                  <input
                    id="inquiry-product"
                    name="product"
                    type="text"
                    value={form.product}
                    onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-quantity" className="block text-xs font-medium text-gray-600 mb-1">{t('inquiry_quantity')}</label>
                  <input
                    id="inquiry-quantity"
                    name="quantity"
                    type="text"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                    placeholder="e.g. 100 pcs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-requirements" className="block text-xs font-medium text-gray-600 mb-1">{t('inquiry_requirements')}</label>
                <textarea
                  id="inquiry-requirements"
                  name="requirements"
                  rows={3}
                  value={form.requirements}
                  onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e] resize-none"
                  placeholder="Special requirements, specifications..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 text-[#0f2d5e] font-bold py-3 rounded-xl transition-colors text-sm"
              >
                {submitting ? t('contact_submitting') : t('inquiry_submit')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
