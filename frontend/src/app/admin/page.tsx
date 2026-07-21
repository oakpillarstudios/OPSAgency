'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiRequest } from '../../lib/api';
import { 
  ShieldAlert, ShieldCheck, Users, FileText, Calendar, TrendingUp, 
  Search, Download, Plus, Trash2, Edit2, CheckCircle, Activity,
  Server, Layout, ListTodo, Settings, ChevronRight, Ban, UserCheck, 
  BarChart4, HelpCircle, Building2, Globe, Sparkles, PlusCircle, Check, Briefcase
} from 'lucide-react';

export default function AdminCRM() {
  const router = useRouter();
  const { user, loading, loginWithEmailAndPassword } = useAuth();
  const { showToast } = useToast();

  // Secure login form states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginErr, setLoginErr] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginErr('');
    try {
      await loginWithEmailAndPassword(adminEmail, adminPassword);
      showToast('Admin access authorized successfully.', 'success');
    } catch (err: any) {
      setLoginErr(err.message || 'Access Denied. Invalid admin credentials.');
      showToast(err.message || 'Access Denied. Invalid admin credentials.', 'error');
    } finally {
      setLoggingIn(false);
    }
  };

  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  
  const [loadingData, setLoadingData] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  // Active Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'crm' | 'services' | 'templates' | 'blogs' | 'industries' | 'users' | 'analytics' | 'settings'>('overview');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // CMS Edit Blog states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Website Development');
  const [blogContent, setBlogContent] = useState('');
  const [blogStatus, setBlogStatus] = useState('PUBLISHED');
  const [blogEditId, setBlogEditId] = useState<string | null>(null);

  // Services Form States
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [serviceShortDesc, setServiceShortDesc] = useState('');
  const [serviceTimeline, setServiceTimeline] = useState('2-3 Weeks');
  const [servicePriceFrom, setServicePriceFrom] = useState('');
  const [servicePriceTo, setServicePriceTo] = useState('');
  const [serviceFeatures, setServiceFeatures] = useState('');
  const [serviceTechStack, setServiceTechStack] = useState('');
  const [servicePopular, setServicePopular] = useState(false);
  const [serviceFeatured, setServiceFeatured] = useState(false);
  const [serviceEditId, setServiceEditId] = useState<string | null>(null);

  // Templates Form States
  const [templateName, setTemplateName] = useState('');
  const [templateSlug, setTemplateSlug] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateIndustry, setTemplateIndustry] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateTech, setTemplateTech] = useState('');
  const [templateColor, setTemplateColor] = useState('');
  const [templateThumbnail, setTemplateThumbnail] = useState('');
  const [templateEditId, setTemplateEditId] = useState<string | null>(null);

  // Settings mock states
  const [companyName, setCompanyName] = useState('OakPillar Studios');
  const [companyEmail, setCompanyEmail] = useState('oakpillarstudios@gmail.com');
  const [companyPhone, setCompanyPhone] = useState('+91 7738049380');
  const [seoTitle, setSeoTitle] = useState('OakPillar Studios | Enterprise Full Stack Agency');
  const [seoDesc, setSeoDesc] = useState('Develop premium custom websites, web applications, CRM systems, and AI automation workflows.');
  const [successToast, setSuccessToast] = useState('');

  // Industries list state
  const [industriesList, setIndustriesList] = useState<string[]>([
    'Interior Design', 'Restaurant', 'Real Estate', 'Medical', 'Legal', 'Financial Services', 'E-commerce'
  ]);
  const [newIndustryName, setNewIndustryName] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return;

    const fetchAdminData = async () => {
      try {
        setLoadingData(true);
        const statsRes = await apiRequest('/admin/stats');
        const leadsRes = await apiRequest(`/admin/leads?search=${searchQuery}`);
        const blogsRes = await apiRequest('/blogs?status=DRAFT'); 
        const pubBlogs = await apiRequest<{ blogs: any[] }>('/blogs');
        const servicesRes = await apiRequest<any>('/services');
        const templatesRes = await apiRequest<any>('/templates');
        const usersRes = await apiRequest<any>('/admin/users');

        setStats(statsRes.stats);
        setLeads(leadsRes.leads || []);
        setServices(servicesRes.services || servicesRes || []);
        setTemplates(templatesRes.templates || templatesRes || []);
        setUsersList(usersRes.users || []);
        
        const allBlogs = [...(blogsRes.blogs || []), ...(pubBlogs.blogs || [])];
        const uniqueBlogs = allBlogs.filter((value, index, self) =>
          self.findIndex(v => v.id === value.id) === index
        );
        setBlogs(uniqueBlogs);
      } catch (err) {
        console.error('Failed to load admin logs:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAdminData();
  }, [user, searchQuery, refreshCount]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-navy font-sans">
        <div className="text-center space-y-4">
          <div className="spinner mx-auto" />
          <p className="text-xs font-semibold text-navy-slate">Initializing Secure Admin Shell...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 font-sans select-none">
        <div className="w-full max-w-md p-8 rounded-3xl border border-navy-slate/10 bg-white shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <img src="/logo.png" alt="OakPillar Studios Logo" className="h-10 mx-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
            <h2 className="text-2xl font-black text-navy tracking-tight">Secure Admin Console</h2>
            <p className="text-xs text-navy-slate">Enter authorized credentials to override client limits.</p>
          </div>

          {loginErr && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-semibold">
              {loginErr}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-navy-slate font-bold mb-1.5 uppercase tracking-wider">Admin Email</label>
              <input 
                type="email" 
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@oakpillarstudios.com"
                className="w-full px-3.5 py-3 rounded-xl border border-navy-slate/15 bg-white text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-navy-slate font-bold mb-1.5 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-3 rounded-xl border border-navy-slate/15 bg-white text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-navy-slate font-bold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-navy-slate/30 text-gold focus:ring-gold" />
                Remember Me
              </label>
              <a href="#" className="hover:text-gold hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-navy hover:bg-navy-dark text-white font-extrabold tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loggingIn ? 'Authorizing...' : 'Login Console'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Update Lead Status/Score
  const handleUpdateLead = async (leadId: string, updates: { role?: string; leadScore?: number; disabled?: boolean }) => {
    try {
      await apiRequest(`/admin/leads/${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      showToast('Account status updated successfully.');
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to update lead settings:', err);
    }
  };

  // Blog CMS Save
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    try {
      if (blogEditId) {
        await apiRequest(`/blogs/${blogEditId}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: blogTitle,
            category: blogCategory,
            content: blogContent,
            status: blogStatus,
            author: 'OakPillar Editorial'
          })
        });
        showToast('Blog article updated successfully.');
      } else {
        await apiRequest('/blogs', {
          method: 'POST',
          body: JSON.stringify({
            title: blogTitle,
            category: blogCategory,
            content: blogContent,
            status: blogStatus,
            author: 'OakPillar Editorial'
          })
        });
        showToast('New blog article published.');
      }
      setBlogTitle('');
      setBlogContent('');
      setBlogEditId(null);
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to save blog:', err);
    }
  };

  // Service CRUD
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !serviceShortDesc || !servicePriceFrom) return;

    const payload = {
      title: serviceTitle,
      slug: serviceSlug,
      shortDesc: serviceShortDesc,
      timeline: serviceTimeline,
      priceFrom: parseFloat(servicePriceFrom),
      priceTo: servicePriceTo ? parseFloat(servicePriceTo) : null,
      features: serviceFeatures.split('\n').filter(f => f.trim() !== ''),
      techStack: serviceTechStack.split(',').map(t => t.trim()).filter(t => t !== ''),
      popular: servicePopular,
      featured: serviceFeatured
    };

    try {
      if (serviceEditId) {
        await apiRequest(`/admin/services/${serviceEditId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Service package updated successfully.');
      } else {
        await apiRequest('/admin/services', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('New service package created.');
      }
      resetServiceForm();
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      console.error('Service save failed:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await apiRequest(`/admin/services/${id}`, { method: 'DELETE' });
      showToast('Service package deleted.');
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      console.error('Service delete failed:', err);
    }
  };

  // Template CRUD
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName || !templateCategory || !templateIndustry) return;

    const payload = {
      name: templateName,
      slug: templateSlug,
      category: templateCategory,
      industry: templateIndustry,
      description: templateDesc,
      technology: templateTech,
      primaryColor: templateColor,
      thumbnail: templateThumbnail || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60'
    };

    try {
      if (templateEditId) {
        await apiRequest(`/admin/templates/${templateEditId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Template details updated successfully.');
      } else {
        await apiRequest('/admin/templates', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('New template cataloged.');
      }
      resetTemplateForm();
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      console.error('Template save failed:', err);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await apiRequest(`/admin/templates/${id}`, { method: 'DELETE' });
      showToast('Template deleted.');
      setRefreshCount(prev => prev + 1);
    } catch (err) {
      console.error('Template delete failed:', err);
    }
  };

  const triggerCSVExport = () => {
    const token = localStorage.getItem('oakpillar_token');
    window.open(`http://localhost:5000/api/v1/admin/export?Authorization=Bearer ${token}`);
  };


  const resetServiceForm = () => {
    setServiceTitle('');
    setServiceSlug('');
    setServiceShortDesc('');
    setServiceTimeline('2-3 Weeks');
    setServicePriceFrom('');
    setServicePriceTo('');
    setServiceFeatures('');
    setServiceTechStack('');
    setServicePopular(false);
    setServiceFeatured(false);
    setServiceEditId(null);
  };

  const resetTemplateForm = () => {
    setTemplateName('');
    setTemplateSlug('');
    setTemplateCategory('');
    setTemplateIndustry('');
    setTemplateDesc('');
    setTemplateTech('');
    setTemplateColor('');
    setTemplateThumbnail('');
    setTemplateEditId(null);
  };

  const handleAddIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndustryName.trim()) return;
    if (industriesList.includes(newIndustryName.trim())) return;
    setIndustriesList([...industriesList, newIndustryName.trim()]);
    setNewIndustryName('');
    showToast('New target industry registered.');
  };

  const handleDeleteIndustry = (name: string) => {
    setIndustriesList(industriesList.filter(i => i !== name));
    showToast('Target industry removed.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 font-sans">
      

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-navy-slate/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-red-500/20 bg-red-50 text-red-600 text-[10px] uppercase font-bold tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrative Operating Console
          </div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight">OakPillar Engine</h1>
          <p className="text-sm text-navy-slate">Supervise lead acquisition pipelines, database catalog, and active conversion analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-1">
          {[
            { id: 'overview', name: 'Overview KPI', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'crm', name: 'Leads Pipeline', icon: <Users className="w-4 h-4" /> },
            { id: 'services', name: 'Services Catalog', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'templates', name: 'Templates CMS', icon: <Layout className="w-4 h-4" /> },
            { id: 'blogs', name: 'Blog Editorial', icon: <FileText className="w-4 h-4" /> },
            { id: 'industries', name: 'Target Industries', icon: <Building2 className="w-4 h-4" /> },
            { id: 'users', name: 'User Directory', icon: <Globe className="w-4 h-4" /> },
            { id: 'analytics', name: 'Real Analytics', icon: <BarChart4 className="w-4 h-4" /> },
            { id: 'settings', name: 'Console Settings', icon: <Settings className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left w-full ${
                adminTab === item.id 
                  ? 'bg-navy text-white shadow-sm' 
                  : 'text-navy-slate hover:bg-navy-dark hover:text-navy'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        {/* Viewport content */}
        <div className="lg:col-span-4 min-w-0">
          
          {/* Tab 1: Overview */}
          {adminTab === 'overview' && stats && (
            <div className="space-y-6 animate-fade-in">
              {/* Stat Deck */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-5 text-center shadow-sm">
                  <span className="block text-2xl font-black text-gold">{stats.totalLeads}</span>
                  <span className="block text-[10px] text-navy-slate font-bold uppercase tracking-wider mt-1">Total CRM Leads</span>
                </div>
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-5 text-center shadow-sm">
                  <span className="block text-2xl font-black text-gold">{stats.totalQuotes}</span>
                  <span className="block text-[10px] text-navy-slate font-bold uppercase tracking-wider mt-1">Quotes Requested</span>
                </div>
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-5 text-center shadow-sm">
                  <span className="block text-2xl font-black text-gold">{stats.totalConsultations}</span>
                  <span className="block text-[10px] text-navy-slate font-bold uppercase tracking-wider mt-1">Bookings</span>
                </div>
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-5 text-center shadow-sm">
                  <span className="block text-2xl font-black text-gold">${(stats.totalQuotes * 3200).toLocaleString()}</span>
                  <span className="block text-[10px] text-navy-slate font-bold uppercase tracking-wider mt-1">Estimated Value</span>
                </div>
              </div>

              {/* Conversion Pipeline & Stepper */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy">Lead Conversion Funnel Metrics</h3>
                <div className="space-y-4">
                  {[
                    { stage: '1. Registered Leads', count: stats.totalLeads, percentage: 100 },
                    { stage: '2. Quote Requests Submitted', count: stats.totalQuotes, percentage: Math.round((stats.totalQuotes / (stats.totalLeads || 1)) * 100) },
                    { stage: '3. Consultation Meetings Scheduled', count: stats.totalConsultations, percentage: Math.round((stats.totalConsultations / (stats.totalLeads || 1)) * 100) }
                  ].map((f, i) => (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-navy-slate">{f.stage}</span>
                        <span className="text-gold">{f.count} ({f.percentage}%)</span>
                      </div>
                      <div className="w-full bg-navy-dark h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gold h-full" style={{ width: `${Math.min(f.percentage, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent System Activity Logs */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gold" /> System Activity Log
                </h3>
                <div className="space-y-3.5">
                  {stats.recentLogs.map((log: any) => (
                    <div key={log.id} className="flex justify-between items-center text-xs border-b border-navy-slate/5 pb-2.5">
                      <div>
                        <span className="font-bold text-[9px] uppercase tracking-wider text-gold mr-3">{log.action}</span>
                        <span className="text-navy-slate font-medium">{log.user} executed action</span>
                      </div>
                      <span className="text-[10px] text-navy-slate/50">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: CRM Leads Pipeline */}
          {adminTab === 'crm' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-navy-slate/60" />
                  <input
                    type="text"
                    placeholder="Search CRM leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-xs text-navy focus:outline-none focus:border-gold"
                  />
                </div>
                <button
                  onClick={triggerCSVExport}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {/* Leads Table */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-navy-slate">
                    <thead>
                      <tr className="border-b border-navy-slate/10 bg-navy-dark/40 font-bold uppercase text-[9px] tracking-wider text-navy">
                        <th className="p-4">Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Business / Industry</th>
                        <th className="p-4">Priority Score</th>
                        <th className="p-4 text-right">Adjust priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-slate/5">
                      {loadingData ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center">Loading Leads...</td>
                        </tr>
                      ) : leads.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center">No leads registered in database.</td>
                        </tr>
                      ) : (
                        leads.map((l) => (
                          <tr key={l.id} className="hover:bg-navy-dark/40 transition-colors">
                            <td className="p-4 font-bold text-navy">{l.name}</td>
                            <td className="p-4 space-y-0.5">
                              <span className="block">{l.email}</span>
                              <span className="block text-[10px] text-navy-slate">{l.phone || 'No Phone'}</span>
                            </td>
                            <td className="p-4 space-y-0.5">
                              <span className="block">{l.company || 'N/A'}</span>
                              <span className="block text-[10px] text-navy-slate">{l.industry || 'No Industry'}</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded bg-gold/15 text-gold font-bold">
                                {l.leadScore} pts
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1.5 shrink-0">
                              <button 
                                onClick={() => handleUpdateLead(l.id, { leadScore: l.leadScore + 10 })}
                                className="px-2 py-1 rounded bg-white hover:bg-gold hover:text-white border border-navy-slate/10 text-[10px] text-gold font-bold transition-all"
                              >
                                +10
                              </button>
                              <button 
                                onClick={() => handleUpdateLead(l.id, { leadScore: Math.max(0, l.leadScore - 10) })}
                                className="px-2 py-1 rounded bg-white hover:bg-red-50 border border-navy-slate/10 text-[10px] text-red-500 font-bold transition-all"
                              >
                                -10
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Services CRUD */}
          {adminTab === 'services' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              {/* Form Block */}
              <div className="lg:col-span-1 rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4 h-fit">
                <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-gold" /> 
                  {serviceEditId ? 'Edit Service' : 'Add Service'}
                </h3>
                <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-navy-slate mb-1">Service Title</label>
                    <input 
                      type="text" 
                      required 
                      value={serviceTitle} 
                      onChange={(e) => setServiceTitle(e.target.value)}
                      placeholder="e.g. Mobile Application"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Slug (URL key)</label>
                    <input 
                      type="text" 
                      value={serviceSlug} 
                      onChange={(e) => setServiceSlug(e.target.value)}
                      placeholder="e.g. mobile-application"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Short Description</label>
                    <textarea 
                      required 
                      rows={2} 
                      value={serviceShortDesc} 
                      onChange={(e) => setServiceShortDesc(e.target.value)}
                      placeholder="Enter lead-in text..."
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-navy-slate mb-1">Starts at ($)</label>
                      <input 
                        type="number" 
                        required 
                        value={servicePriceFrom} 
                        onChange={(e) => setServicePriceFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-navy-slate mb-1">Ends at ($)</label>
                      <input 
                        type="number" 
                        value={servicePriceTo} 
                        onChange={(e) => setServicePriceTo(e.target.value)}
                        className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Features (One per line)</label>
                    <textarea 
                      rows={3} 
                      value={serviceFeatures} 
                      onChange={(e) => setServiceFeatures(e.target.value)}
                      placeholder="Custom Database design&#10;SSL Certificate"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Tech Stack (comma-separated)</label>
                    <input 
                      type="text" 
                      value={serviceTechStack} 
                      onChange={(e) => setServiceTechStack(e.target.value)}
                      placeholder="Next.js, Tailwind, SQLite"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" checked={servicePopular} onChange={(e) => setServicePopular(e.target.checked)} /> Popular
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input type="checkbox" checked={serviceFeatured} onChange={(e) => setServiceFeatured(e.target.checked)} /> Featured
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    {serviceEditId && (
                      <button 
                        type="button" 
                        onClick={resetServiceForm}
                        className="px-3 py-2 border border-navy-slate/10 rounded-xl hover:bg-navy-dark"
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold">
                      Save
                    </button>
                  </div>
                </form>
              </div>

              {/* List Block */}
              <div className="lg:col-span-2 space-y-4">
                {services.map((item: any) => (
                  <div key={item.id} className="rounded-2xl border border-navy-slate/10 bg-white p-4 shadow-sm flex items-center justify-between text-xs gap-4">
                    <div>
                      <h4 className="font-bold text-navy text-sm">{item.title}</h4>
                      <p className="text-navy-slate/80 mt-1 line-clamp-1">{item.shortDesc}</p>
                      <span className="text-[10px] text-navy-slate font-bold block mt-1">Starts at: ${item.priceFrom} | Slug: {item.slug}</span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button 
                        onClick={() => {
                          setServiceTitle(item.title);
                          setServiceSlug(item.slug);
                          setServiceShortDesc(item.shortDesc);
                          setServiceTimeline(item.timeline || '2-3 Weeks');
                          setServicePriceFrom(item.priceFrom.toString());
                          setServicePriceTo(item.priceTo ? item.priceTo.toString() : '');
                          setServiceFeatures(JSON.parse(item.features || '[]').join('\n'));
                          setServiceTechStack(JSON.parse(item.techStack || '[]').join(', '));
                          setServicePopular(!!item.popular);
                          setServiceFeatured(!!item.featured);
                          setServiceEditId(item.id);
                        }}
                        className="p-2 border border-navy-slate/10 rounded-xl hover:text-gold transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(item.id)}
                        className="p-2 border border-navy-slate/10 rounded-xl hover:text-red-500 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Templates CMS */}
          {adminTab === 'templates' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              {/* Form Block */}
              <div className="lg:col-span-1 rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4 h-fit">
                <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-gold" />
                  {templateEditId ? 'Edit Template' : 'Add Template'}
                </h3>
                <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-navy-slate mb-1">Template Name</label>
                    <input 
                      type="text" 
                      required 
                      value={templateName} 
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g. Apex Realty"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Slug</label>
                    <input 
                      type="text" 
                      value={templateSlug} 
                      onChange={(e) => setTemplateSlug(e.target.value)}
                      placeholder="e.g. apex-realty"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-navy-slate mb-1">Category</label>
                      <input 
                        type="text" 
                        required
                        value={templateCategory} 
                        onChange={(e) => setTemplateCategory(e.target.value)}
                        placeholder="Real Estate"
                        className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-navy-slate mb-1">Industry</label>
                      <input 
                        type="text" 
                        required
                        value={templateIndustry} 
                        onChange={(e) => setTemplateIndustry(e.target.value)}
                        placeholder="Real Estate"
                        className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Description</label>
                    <textarea 
                      rows={2} 
                      value={templateDesc} 
                      onChange={(e) => setTemplateDesc(e.target.value)}
                      placeholder="Short intro..."
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Tech Stack</label>
                    <input 
                      type="text" 
                      value={templateTech} 
                      onChange={(e) => setTemplateTech(e.target.value)}
                      placeholder="Next.js, Tailwind, Framer Motion"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Thumbnail URL</label>
                    <input 
                      type="text" 
                      value={templateThumbnail} 
                      onChange={(e) => setTemplateThumbnail(e.target.value)}
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    {templateEditId && (
                      <button 
                        type="button" 
                        onClick={resetTemplateForm}
                        className="px-3 py-2 border border-navy-slate/10 rounded-xl hover:bg-navy-dark"
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold">
                      Save
                    </button>
                  </div>
                </form>
              </div>

              {/* List Block */}
              <div className="lg:col-span-2 space-y-4">
                {templates.map((item: any) => (
                  <div key={item.id} className="rounded-2xl border border-navy-slate/10 bg-white p-4 shadow-sm flex items-center justify-between text-xs gap-4">
                    <div>
                      <h4 className="font-bold text-navy text-sm">{item.name}</h4>
                      <p className="text-navy-slate/85 mt-0.5">{item.industry} | {item.technology}</p>
                      <span className="text-[10px] text-navy-slate font-bold block mt-1">Slug: {item.slug} | Perf: {item.perfScore}%</span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button 
                        onClick={() => {
                          setTemplateName(item.name);
                          setTemplateSlug(item.slug);
                          setTemplateCategory(item.category);
                          setTemplateIndustry(item.industry);
                          setTemplateDesc(item.description);
                          setTemplateTech(item.technology);
                          setTemplateThumbnail(item.thumbnail);
                          setTemplateEditId(item.id);
                        }}
                        className="p-2 border border-navy-slate/10 rounded-xl hover:text-gold transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTemplate(item.id)}
                        className="p-2 border border-navy-slate/10 rounded-xl hover:text-red-500 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Blog Editorial CMS */}
          {adminTab === 'blogs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-gold" />
                  {blogEditId ? 'Edit Article' : 'Write New Article'}
                </h3>
                <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-navy-slate mb-1">Post Title</label>
                    <input 
                      type="text" 
                      required 
                      value={blogTitle} 
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="How to audit Core Web Vitals"
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Category</label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full px-2 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-navy cursor-pointer"
                    >
                      <option value="Website Development">Website Development</option>
                      <option value="SEO">SEO & Marketing</option>
                      <option value="AI">AI Solutions</option>
                      <option value="Automation">Automation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1.5">Publish Status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 font-bold">
                        <input type="radio" checked={blogStatus === 'PUBLISHED'} onChange={() => setBlogStatus('PUBLISHED')} /> Published
                      </label>
                      <label className="flex items-center gap-1.5 font-bold">
                        <input type="radio" checked={blogStatus === 'DRAFT'} onChange={() => setBlogStatus('DRAFT')} /> Draft
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-navy-slate mb-1">Article Content (Markdown)</label>
                    <textarea 
                      required 
                      rows={6} 
                      value={blogContent} 
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Write markdown here..."
                      className="w-full px-3 py-2 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none font-mono"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    {blogEditId && (
                      <button 
                        type="button" 
                        onClick={() => { setBlogTitle(''); setBlogContent(''); setBlogEditId(null); }}
                        className="px-3 py-2 border border-navy-slate/10 rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold">
                      Save Post
                    </button>
                  </div>
                </form>
              </div>

              {/* Blog list */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy">Manage Articles</h3>
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {blogs.map((b) => (
                    <div key={b.id} className="p-3.5 rounded-xl border border-navy-slate/10 bg-navy-dark flex items-center justify-between text-xs gap-4">
                      <div>
                        <span className="font-bold text-navy block leading-relaxed">{b.title}</span>
                        <span className="text-[10px] text-navy-slate block mt-1">
                          Category: {b.category} | Status: <strong className={b.status === 'PUBLISHED' ? 'text-emerald-600' : 'text-gold'}>{b.status}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button 
                          onClick={() => {
                            setBlogTitle(b.title);
                            setBlogCategory(b.category);
                            setBlogContent(b.content);
                            setBlogStatus(b.status);
                            setBlogEditId(b.id);
                          }}
                          className="p-1.5 hover:text-gold"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (!confirm('Delete this blog post?')) return;
                            await apiRequest(`/blogs/${b.id}`, { method: 'DELETE' });
                            showToast('Blog article deleted.');
                            setRefreshCount(prev => prev + 1);
                          }}
                          className="p-1.5 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Industries CRUD */}
          {adminTab === 'industries' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4 h-fit">
                <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-gold" />
                  Add Supported Industry
                </h3>
                <form onSubmit={handleAddIndustry} className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={newIndustryName} 
                    onChange={(e) => setNewIndustryName(e.target.value)}
                    placeholder="e.g. Architecture"
                    className="flex-1 px-3 py-2.5 border border-navy-slate/20 bg-navy-dark rounded-xl text-xs text-navy focus:outline-none"
                  />
                  <button type="submit" className="px-5 py-2.5 bg-gold hover:bg-gold-hover text-white font-bold text-xs rounded-xl shadow-sm">
                    Add
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy">Registered Target Industries</h3>
                <div className="divide-y divide-navy-slate/5">
                  {industriesList.map((ind, index) => (
                    <div key={index} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-navy">{ind}</span>
                      <button 
                        onClick={() => handleDeleteIndustry(ind)}
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: User Directory */}
          {adminTab === 'users' && (
            <div className="rounded-2xl border border-navy-slate/10 bg-white shadow-sm overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-navy-slate">
                  <thead>
                    <tr className="border-b border-navy-slate/10 bg-navy-dark/40 font-bold uppercase text-[9px] tracking-wider text-navy">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role Privileges</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-slate/5">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-navy-dark/40 transition-colors">
                        <td className="p-4 font-bold text-navy">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateLead(u.id, { role: e.target.value })}
                            className="px-2 py-1 rounded bg-navy-dark text-[10px] font-bold text-navy border border-navy-slate/10 cursor-pointer"
                          >
                            <option value="USER">USER (Client)</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            u.disabled ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {u.disabled ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleUpdateLead(u.id, { disabled: !u.disabled })}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              u.disabled 
                                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600' 
                                : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                            }`}
                          >
                            {u.disabled ? 'Re-Activate' : 'Suspend User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 8: Analytics */}
          {adminTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Google Analytics Panel */}
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-navy-slate/5 pb-3">
                    <BarChart4 className="w-5 h-5 text-gold" />
                    <h3 className="text-sm font-bold text-navy">Google Analytics (G-VKZVHTWH4L)</h3>
                  </div>
                  <div className="text-xs text-navy-slate space-y-3">
                    <div className="flex justify-between border-b border-navy-slate/5 pb-2">
                      <span>Live Active Visitors:</span>
                      <span className="font-bold text-navy">0</span>
                    </div>
                    <div className="flex justify-between border-b border-navy-slate/5 pb-2">
                      <span>Monthly Sessions:</span>
                      <span className="font-bold text-navy">0</span>
                    </div>
                    <div className="p-4 bg-navy-dark rounded-xl text-center font-medium text-[11px]">
                      No live analytics data synchronized yet.
                    </div>
                  </div>
                </div>

                {/* Microsoft Clarity Panel */}
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-navy-slate/5 pb-3">
                    <Globe className="w-5 h-5 text-gold" />
                    <h3 className="text-sm font-bold text-navy">Microsoft Clarity (xpy7ok47vi)</h3>
                  </div>
                  <div className="text-xs text-navy-slate space-y-3">
                    <div className="flex justify-between border-b border-navy-slate/5 pb-2">
                      <span>Recorded Sessions:</span>
                      <span className="font-bold text-navy">0</span>
                    </div>
                    <div className="flex justify-between border-b border-navy-slate/5 pb-2">
                      <span>Rage Clicks Count:</span>
                      <span className="font-bold text-navy">0</span>
                    </div>
                    <div className="p-4 bg-navy-dark rounded-xl text-center font-medium text-[11px]">
                      No heatmap session recording logs synchronized yet.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 9: Settings */}
          {adminTab === 'settings' && (
            <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-navy border-b border-navy-slate/5 pb-3">Console System Config</h2>
              <form onSubmit={(e) => { e.preventDefault(); showToast('Company details and branding config updated.'); }} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block text-navy-slate mb-1.5 font-bold">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-navy-slate mb-1.5 font-bold">Contact Email</label>
                  <input 
                    type="email" 
                    value={companyEmail} 
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-navy-slate mb-1.5 font-bold">Company Phone</label>
                  <input 
                    type="text" 
                    value={companyPhone} 
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-navy-slate mb-1.5 font-bold">Default SEO title tag</label>
                  <input 
                    type="text" 
                    value={seoTitle} 
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-navy-slate mb-1.5 font-bold">Meta Description</label>
                  <textarea 
                    rows={3} 
                    value={seoDesc} 
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-navy-slate/20 bg-navy-dark rounded-xl text-navy focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm">
                    Save General Configuration
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
