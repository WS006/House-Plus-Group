// ============================================================
// House Plus Group - Contact Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';
import { messagesStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    messagesStore.add({ ...form, type: 'contact' });
    setSubmitting(false);
    toast.success(t('contact_success'));
    setForm({ name: '', email: '', phone: '', country: '', subject: '', message: '' });
  };

  const OFFICES = [
    {
      name: 'House Plus Ltd — Ikeja GRA',
      address: '8 Eso Cl, Ikeja GRA, Ikeja 101233, Lagos, Nigeria',
      phone: '+234 707 706 5158',
      mapUrl: 'https://maps.app.goo.gl/ciNFnZNAUULu3Pjx9',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3!2d3.35!3d6.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMDAuMCJOIDPCsDIxJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1234567890',
    },
    {
      name: 'House Plus Group — Herbert Macaulay',
      address: '3 Herbert Macaulay St, Ikeja GRA, Lagos 101233, Nigeria',
      phone: '+234 907 808 0738',
      mapUrl: 'https://maps.app.goo.gl/qqQ4upNwdaG1UPAt9',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3!2d3.35!3d6.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMDAuMCJOIDPCsDIxJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1234567890',
    },
    {
      name: 'House Plus Factory — Allen Ikeja',
      address: '8 Felicia Koleosho St Allen, Ikeja, Lagos, Nigeria',
      phone: '+234 907 808 0738',
      mapUrl: 'https://maps.app.goo.gl/h1gJq15txzC3TYGa9',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3!2d3.35!3d6.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnMDAuMCJOIDPCsDIxJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1234567890',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_contact') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('contact_title')}</h1>
          <p className="text-white/60">We're here to help. Reach out via any channel below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
              title: 'WhatsApp Nigeria',
              value: '+234 907 808 0738',
              href: 'https://wa.me/2349078080738',
              color: 'bg-[#25D366]',
            },
            {
              icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
              title: 'WhatsApp China',
              value: '+86 155 7811 9543',
              href: 'https://wa.me/8615578119543',
              color: 'bg-[#25D366]',
            },
            {
              icon: <Mail className="w-6 h-6" />,
              title: 'Email (Attn: Jack)',
              value: 'jack@houseplus-ch.com',
              href: 'mailto:jack@houseplus-ch.com',
              color: 'bg-[#f59e0b]',
            },
            {
              icon: <MessageCircle className="w-6 h-6" />,
              title: 'WeChat',
              value: 'JackHousePlus',
              href: '#',
              color: 'bg-[#07C160]',
            },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group text-center"
            >
              <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className="text-xs text-gray-400 mb-1">{item.title}</div>
              <div className="font-semibold text-[#0f2d5e] text-sm">{item.value}</div>
            </motion.a>
          ))}
        </div>

        {/* Contact Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-[#0f2d5e] mb-6">{t('contact_send_message')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact_name')} *</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact_country')}</label>
                    <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                      placeholder="Your country" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact_email')} *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                      placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact_phone')}</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                      placeholder="+1 234 567 8900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact_subject')}</label>
                  <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
                    placeholder="Product inquiry, partnership, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('contact_message')} *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e] resize-none"
                    placeholder="Tell us about your requirements, product needs, or any questions..." />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 text-[#0f2d5e] font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  {submitting ? t('contact_submitting') : t('contact_submit')}
                </button>
              </form>
            </div>
          </div>

          {/* Offices */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0f2d5e] mb-4">Our Offices</h2>
            {OFFICES.map((office, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-[#0f2d5e] text-sm mb-3">{office.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-xs leading-relaxed">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-gray-600 text-xs hover:text-[#0f2d5e]">{office.phone}</a>
                  </div>
                </div>
                <a href={office.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[#0f2d5e] text-xs font-semibold hover:text-[#f59e0b] transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> View on Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
