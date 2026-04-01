// ============================================================
// House Plus Group - Team Page
// ============================================================

import Breadcrumb from '@/components/Breadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { generatePersonSchema, injectSchema, clearSchemaScripts } from '@/lib/schema';

const TEAM = [
  {
    name: 'Jack',
    role: 'Sales Director & Key Account Manager',
    desc: 'Jack leads our international sales team with over 8 years of experience in China-Africa trade. He is your primary point of contact for all business inquiries.',
    email: 'jack@houseplus-ch.com',
    phone: '+234 907 808 0738',
    whatsapp: 'https://wa.me/2349078080738',
    wechat: 'JackHousePlus',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    tags: ['Solar Energy', 'Home Appliances', '3C Electronics', 'OEM/ODM'],
  },
  {
    name: 'Production Team',
    role: 'Manufacturing & Quality Control',
    desc: 'Our experienced production team ensures every product meets international quality standards before shipment.',
    email: 'jack@houseplus-ch.com',
    phone: '+86 155 7811 9543',
    whatsapp: 'https://wa.me/8615578119543',
    wechat: 'JackHousePlus',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
    tags: ['Quality Control', 'Manufacturing', 'ISO 9001'],
  },
  {
    name: 'Logistics Team',
    role: 'Shipping & Logistics',
    desc: 'Our logistics experts handle all shipping arrangements, customs clearance, and door-to-door delivery across Africa and worldwide.',
    email: 'jack@houseplus-ch.com',
    phone: '+234 707 706 5158',
    whatsapp: 'https://wa.me/2347077065158',
    wechat: 'JackHousePlus',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
    tags: ['Shipping', 'Customs', 'Africa Logistics'],
  },
];

export default function Team() {
  const { t } = useLanguage();

  useEffect(() => {
    clearSchemaScripts();
    // 为主要联系人 Jack 添加 Person Schema
    const jackSchema = generatePersonSchema('Jack', 'Sales Director & Key Account Manager', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80');
    injectSchema(jackSchema);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0f2d5e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: t('nav_team') }]} />
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">{t('team_title')}</h1>
          <p className="text-white/60">{t('team_subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                <img src={member.avatar} alt={`${member.name} - ${member.role}`} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2d5e]/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-black text-xl">{member.name}</h3>
                  <p className="text-[#f59e0b] text-sm">{member.role}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {member.tags.map(tag => (
                    <span key={tag} className="bg-[#0f2d5e]/10 text-[#0f2d5e] text-xs px-2.5 py-1 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
                <div className="space-y-2">
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0f2d5e] transition-colors">
                    <Mail className="w-4 h-4 text-[#f59e0b]" />
                    {member.email}
                  </a>
                  <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#25D366] transition-colors">
                    <Phone className="w-4 h-4 text-[#25D366]" />
                    {member.phone}
                  </a>
                </div>
                <a href={member.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t('team_contact_jack')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
