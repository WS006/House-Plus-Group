// ============================================================
// House Plus Group - Careers Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';
import { messagesStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, ChevronDown, Globe, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const JOBS = [
  { title: 'International Sales Manager', location: 'Lagos, Nigeria / Remote', type: 'Full-time', dept: 'Sales', desc: 'Lead our international sales efforts across Africa and the Middle East. Develop new business relationships and manage key accounts.' },
  { title: 'Solar Energy Technical Consultant', location: 'Lagos, Nigeria', type: 'Full-time', dept: 'Technical', desc: 'Provide technical support for solar energy products, assist clients with system design, and conduct product training.' },
  { title: 'Marketing Specialist (Digital)', location: 'Remote', type: 'Full-time', dept: 'Marketing', desc: 'Manage social media, content marketing, and digital advertising campaigns for African and global markets.' },
  { title: 'Logistics Coordinator', location: 'Lagos, Nigeria', type: 'Full-time', dept: 'Operations', desc: 'Coordinate shipments from China to Nigeria and other African countries. Handle customs clearance and last-mile delivery.' },
  { title: 'Product Sourcing Specialist', location: 'China (Guangzhou/Shenzhen)', type: 'Full-time', dept: 'Sourcing', desc: 'Identify and evaluate new product opportunities, negotiate with Chinese manufacturers, and manage supplier relationships.' },
  { title: 'Customer Service Representative', location: 'Lagos, Nigeria / Remote', type: 'Part-time', dept: 'Customer Service', desc: 'Handle customer inquiries via WhatsApp, email, and phone. Provide product information and after-sales support.' },
];

export default function Careers() {
  const { t } = useLanguage();
  const [openJob, setOpenJob] = useState<number | null>(null);
  const [applyJob, setApplyJob] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    messagesStore.add({
      name: form.name,
      email: form.email,
      phone: form.phone,
      country: '',
      subject: `Job Application: ${applyJob}`,
      message: form.message,
      type: 'contact',
    });
    setSubmitting(false);
    toast.success('Application submitted! We will review and contact you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
    setApplyJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_careers') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('careers_title')}</h1>
          <p className="text-white/60">{t('careers_subtitle')}</p>
        </div>
      </div>

      {/* Why Join Us */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#0f2d5e] mb-8 text-center">Why Join House Plus Group?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Globe className="w-6 h-6" />, title: 'Global Exposure', desc: 'Work with clients from 50+ countries and gain international trade experience' },
              { icon: <Users className="w-6 h-6" />, title: 'Growing Team', desc: 'Be part of a fast-growing China-Africa trade company with exciting opportunities' },
              { icon: <Briefcase className="w-6 h-6" />, title: 'Career Growth', desc: 'Clear career progression paths with training and development support' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-[#f59e0b]/20 text-[#f59e0b] rounded-xl flex items-center justify-center mx-auto mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#0f2d5e] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#0f2d5e] mb-8">Open Positions</h2>
          <div className="space-y-4">
            {JOBS.map((job, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenJob(openJob === i ? null : i)}
                  className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-[#0f2d5e] text-lg mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-gray-500 text-sm"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1 text-gray-500 text-sm"><Briefcase className="w-3.5 h-3.5" /> {job.type}</span>
                      <span className="bg-[#0f2d5e]/10 text-[#0f2d5e] text-xs font-semibold px-2.5 py-1 rounded-full">{job.dept}</span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: openJob === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-[#f59e0b] mt-1 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openJob === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                        <p className="text-gray-600 mb-5">{job.desc}</p>
                        <button
                          onClick={() => setApplyJob(job.title)}
                          className="bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
                        >
                          {t('careers_apply')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setApplyJob(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <h3 className="text-xl font-bold text-[#0f2d5e] mb-1">Apply for Position</h3>
              <p className="text-[#f59e0b] text-sm mb-6">{applyJob}</p>
              <form onSubmit={handleApply} className="space-y-4">
                <input type="text" required placeholder="Your Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20" />
                <input type="email" required placeholder="Email Address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20" />
                <input type="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20" />
                <textarea rows={4} placeholder="Tell us about yourself and why you're interested..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 resize-none" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setApplyJob(null)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-[#0f2d5e] font-bold py-3 rounded-xl text-sm transition-colors">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
