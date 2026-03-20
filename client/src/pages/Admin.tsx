// ============================================================
// House Plus Group - Admin Dashboard
// Design: Clean admin panel with sidebar navigation
// ============================================================

import { useLanguage } from '@/contexts/LanguageContext';
import { Message, Product, adminStore, exportToCSV, messagesStore, productsStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart2, CheckCircle, Download, Eye, EyeOff, LogOut, Mail, Package, Plus, Settings, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'products' | 'messages' | 'settings';

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminStore.login(username, password)) {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2d5e] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#f59e0b] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-[#0f2d5e] font-black text-xl">HP</span>
          </div>
          <h1 className="text-2xl font-black text-[#0f2d5e]">{t('admin_login')}</h1>
          <p className="text-gray-500 text-sm mt-1">House Plus Group Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_username')}</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e]"
              placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('admin_password')}</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20 focus:border-[#0f2d5e] pr-12"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-bold py-3 rounded-xl transition-colors">
            {t('admin_login_btn')}
          </button>
          <p className="text-center text-gray-400 text-xs">Default: admin / houseplus2024</p>
        </form>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(() => adminStore.isLoggedIn());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setProducts(productsStore.getAll());
      setMessages(messagesStore.getAll());
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    adminStore.logout();
    setIsLoggedIn(false);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Delete this product?')) {
      productsStore.delete(id);
      setProducts(productsStore.getAll());
      toast.success('Product deleted');
    }
  };

  const deleteMessage = (id: string) => {
    messagesStore.delete(id);
    setMessages(messagesStore.getAll());
    setSelectedMsg(null);
    toast.success('Message deleted');
  };

  const markRead = (id: string) => {
    messagesStore.markRead(id);
    setMessages(messagesStore.getAll());
    if (selectedMsg?.id === id) setSelectedMsg({ ...selectedMsg, isRead: true });
  };

  const exportMessages = () => {
    exportToCSV(messages.map(m => ({
      Name: m.name, Email: m.email, Phone: m.phone, Country: m.country,
      Subject: m.subject, Message: m.message, Type: m.type,
      Date: m.createdAt, Read: m.isRead ? 'Yes' : 'No',
    })), 'houseplus_messages');
    toast.success('Messages exported');
  };

  const exportProducts = () => {
    exportToCSV(products.map(p => ({
      ID: p.id, Name: p.nameEn, Category: p.category, MOQ: p.moq, Delivery: p.delivery,
    })), 'houseplus_products');
    toast.success('Products exported');
  };

  if (!isLoggedIn) return <LoginForm onLogin={() => setIsLoggedIn(true)} />;

  const unreadCount = messages.filter(m => !m.isRead).length;

  const TABS = [
    { id: 'dashboard' as Tab, icon: <BarChart2 className="w-5 h-5" />, label: t('admin_dashboard') },
    { id: 'products' as Tab, icon: <Package className="w-5 h-5" />, label: t('admin_products') },
    { id: 'messages' as Tab, icon: <Mail className="w-5 h-5" />, label: t('admin_messages'), badge: unreadCount },
    { id: 'settings' as Tab, icon: <Settings className="w-5 h-5" />, label: t('admin_settings') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f2d5e] flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#f59e0b] rounded-lg flex items-center justify-center">
              <span className="text-[#0f2d5e] font-black text-sm">HP</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">Admin Panel</div>
              <div className="text-white/40 text-xs">House Plus Group</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(t_item => (
            <button
              key={t_item.id}
              onClick={() => setTab(t_item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === t_item.id ? 'bg-[#f59e0b] text-[#0f2d5e]' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t_item.icon}
              <span>{t_item.label}</span>
              {t_item.badge ? (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {t_item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium transition-all">
            <LogOut className="w-5 h-5" />
            {t('admin_logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="p-8">
            <h1 className="text-2xl font-black text-[#0f2d5e] mb-8">{t('admin_dashboard')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Products', value: products.length, icon: <Package className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
                { label: 'Total Messages', value: messages.length, icon: <Mail className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
                { label: 'Unread Messages', value: unreadCount, icon: <Mail className="w-6 h-6" />, color: 'bg-red-50 text-red-600' },
                { label: 'Inquiries', value: messages.filter(m => m.type === 'inquiry').length, icon: <BarChart2 className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>{stat.icon}</div>
                  <div className="text-3xl font-black text-[#0f2d5e] mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* Recent Messages */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-[#0f2d5e] mb-4">Recent Messages</h2>
              {messages.slice(0, 5).map(msg => (
                <div key={msg.id} className={`flex items-start gap-4 py-3 border-b border-gray-100 last:border-0 ${!msg.isRead ? 'bg-blue-50/50 -mx-2 px-2 rounded-lg' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#0f2d5e]">{msg.name}</span>
                      <span className="text-gray-400 text-xs">{msg.email}</span>
                    </div>
                    <p className="text-gray-600 text-sm truncate">{msg.subject || msg.message}</p>
                  </div>
                  <span className="text-gray-400 text-xs flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black text-[#0f2d5e]">{t('admin_products')}</h1>
              <div className="flex gap-3">
                <button onClick={exportProducts} className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  <Download className="w-4 h-4" /> {t('admin_export')}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">MOQ</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.nameEn} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-semibold text-[#0f2d5e] text-sm">{product.nameEn}</div>
                            <div className="text-gray-400 text-xs">{product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          product.category === 'solar' ? 'bg-amber-100 text-amber-700' :
                          product.category === 'appliances' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>{product.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.moq}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5">
                          {product.isNew && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">New</span>}
                          {product.isHot && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Hot</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages */}
        {tab === 'messages' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black text-[#0f2d5e]">{t('admin_messages')}</h1>
              <button onClick={exportMessages} className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> {t('admin_export')}
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No messages yet</div>
                  ) : messages.map(msg => (
                    <button
                      key={msg.id}
                      onClick={() => { setSelectedMsg(msg); if (!msg.isRead) markRead(msg.id); }}
                      className={`w-full flex items-start gap-4 p-4 text-left hover:bg-gray-50 transition-colors ${selectedMsg?.id === msg.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-sm ${msg.isRead ? 'text-gray-700' : 'text-[#0f2d5e]'}`}>{msg.name}</span>
                          <span className="text-gray-400 text-xs flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-gray-500 text-xs mb-0.5">{msg.email}</div>
                        <p className="text-gray-600 text-sm truncate">{msg.subject || msg.message}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${msg.type === 'inquiry' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {msg.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Detail */}
              {selectedMsg ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-[#0f2d5e] text-lg">{selectedMsg.name}</h3>
                      <div className="text-gray-500 text-sm">{selectedMsg.email}</div>
                      {selectedMsg.phone && <div className="text-gray-500 text-sm">{selectedMsg.phone}</div>}
                    </div>
                    <button onClick={() => deleteMessage(selectedMsg.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 mb-5">
                    {selectedMsg.country && <div className="flex gap-2 text-sm"><span className="text-gray-400 w-24">Country:</span><span className="text-gray-700">{selectedMsg.country}</span></div>}
                    {selectedMsg.subject && <div className="flex gap-2 text-sm"><span className="text-gray-400 w-24">Subject:</span><span className="text-gray-700">{selectedMsg.subject}</span></div>}
                    {selectedMsg.product && <div className="flex gap-2 text-sm"><span className="text-gray-400 w-24">Product:</span><span className="text-gray-700">{selectedMsg.product}</span></div>}
                    {selectedMsg.quantity && <div className="flex gap-2 text-sm"><span className="text-gray-400 w-24">Quantity:</span><span className="text-gray-700">{selectedMsg.quantity}</span></div>}
                    <div className="flex gap-2 text-sm"><span className="text-gray-400 w-24">Date:</span><span className="text-gray-700">{new Date(selectedMsg.createdAt).toLocaleString()}</span></div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedMsg.message || selectedMsg.requirements}</p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <a href={`mailto:${selectedMsg.email}`} className="flex-1 bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-semibold py-2.5 rounded-xl text-sm text-center transition-colors">
                      Reply via Email
                    </a>
                    {selectedMsg.phone && (
                      <a href={`https://wa.me/${selectedMsg.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-2.5 rounded-xl text-sm text-center transition-colors">
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center text-gray-400">
                  Select a message to view details
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div className="p-8">
            <h1 className="text-2xl font-black text-[#0f2d5e] mb-8">{t('admin_settings')}</h1>
            <div className="max-w-lg space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-[#0f2d5e] mb-4">Change Password</h2>
                <ChangePasswordForm />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-[#0f2d5e] mb-4">Data Management</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => { if (confirm('Reset all products to default?')) { productsStore.reset(); setProducts(productsStore.getAll()); toast.success('Products reset to default'); } }}
                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    Reset Products to Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ChangePasswordForm() {
  const [form, setForm] = useState({ old: '', new: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.new !== form.confirm) { setError('New passwords do not match'); return; }
    if (form.new.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (adminStore.changePassword(form.old, form.new)) {
      toast.success('Password changed successfully');
      setForm({ old: '', new: '', confirm: '' });
    } else {
      setError('Current password is incorrect');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="password" required placeholder="Current Password" value={form.old} onChange={e => setForm(f => ({ ...f, old: e.target.value }))}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20" />
      <input type="password" required placeholder="New Password" value={form.new} onChange={e => setForm(f => ({ ...f, new: e.target.value }))}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20" />
      <input type="password" required placeholder="Confirm New Password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="w-full bg-[#0f2d5e] hover:bg-[#1a3f7a] text-white font-semibold py-3 rounded-xl text-sm transition-colors">
        Update Password
      </button>
    </form>
  );
}
