'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import LoginModal from '../../components/LoginModal';
import { 
  Search, SlidersHorizontal, Layout, LayoutGrid, CheckCircle2, 
  HelpCircle, Monitor, Smartphone, Tablet 
} from 'lucide-react';

export default function TemplatesCatalog() {
  const router = useRouter();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        let query = '';
        const params: string[] = [];
        if (selectedCategory !== 'all') params.push(`category=${selectedCategory}`);
        if (selectedIndustry !== 'all') params.push(`industry=${selectedIndustry}`);
        if (search) params.push(`search=${search}`);

        if (params.length > 0) {
          query = '?' + params.join('&');
        }

        const res = await apiRequest<{ templates: any[] }>(`/templates${query}`);
        setTemplates(res.templates || []);
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [selectedCategory, selectedIndustry, search]);

  const handleRestrictedAction = (slug: string) => {
    if (!user) {
      setLoginOpen(true);
    } else {
      router.push(`/templates/${slug}`);
    }
  };

  const categories = ['Business', 'Corporate', 'Restaurant', 'Medical', 'Real Estate', 'Interior Design'];
  const industries = ['Restaurant', 'Medical', 'Real Estate', 'Interior Design', 'Corporate'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider">
          <Layout className="w-3.5 h-3.5" /> HTML Blueprint Marketplace
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-light-gray tracking-tight premium-gradient-text">
          OakPillar Website Templates
        </h1>
        <p className="text-xs text-navy-slate max-w-lg leading-relaxed">
          Premium commercial layouts ready for Next.js integration. Every template is strictly built for 98+ mobile speed, accessible contrast, and schema-indexed local SEO visibility.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 rounded-2xl border border-navy-slate/15 bg-white shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
          <input
            type="text"
            placeholder="Search templates by style, technology, color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
          >
            <option value="all">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton-box h-[350px] rounded-xl" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-navy-slate/20 rounded-2xl">
          <LayoutGrid className="w-10 h-10 text-gold/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-light-gray">No Templates Available</h3>
          <p className="text-xs text-navy-slate mt-1 max-w-xs mx-auto leading-relaxed">
            We couldn't find templates matching your selection. Clean your search criteria to reload.
          </p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedIndustry('all'); }}
            className="mt-4 px-4 py-2 rounded-lg bg-navy border border-gold/25 text-xs text-gold font-bold hover:bg-navy-dark transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((t) => (
            <div 
              key={t.id}
              className="glass-panel rounded-2xl overflow-hidden border border-gold/10 bg-navy-light/10 group flex flex-col justify-between"
            >
              {/* Preview Container with watermark overlay protection (SRS #65) */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden bg-navy-dark select-none">
                <img 
                  src={t.thumbnail} 
                  alt={t.name} 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  draggable="false" // Protect drag
                />
                
                {/* Watermark overlay */}
                <div className="absolute inset-0 template-protection-watermark" />
                
                {/* Visual blur overlay for guests */}
                {!user && (
                  <div className="absolute inset-0 bg-navy-dark/45 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-navy-dark/90 border border-gold/30 text-[9px] font-black text-gold uppercase tracking-wider">
                      Login to Unlock Premium Preview
                    </span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 flex gap-1.5">
                  <span className="px-2.5 py-0.5 rounded bg-navy-dark/95 border border-gold/15 text-[8px] font-bold text-gold uppercase">
                    {t.technology}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-navy-dark/95 border border-navy-slate/25 text-[8px] font-bold text-navy-slate uppercase">
                    {t.industry}
                  </span>
                </div>
              </div>

              {/* Specs & CTAs */}
              <div className="p-6 space-y-4 border-t border-navy-slate/10 bg-navy-light/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-light-gray group-hover:text-gold transition-colors">{t.name}</h3>
                    <p className="text-xs text-navy-slate mt-1 leading-normal line-clamp-1">{t.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="text-right">
                      <span className="block text-[8px] text-navy-slate uppercase tracking-wider font-bold">Speed Score</span>
                      <span className="text-xs font-black text-emerald-400">{t.perfScore}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-navy-slate/10 pt-4 text-[10px] text-navy-slate font-bold">
                  <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5" /> Desktop Ready</span>
                  <button
                    onClick={() => handleRestrictedAction(t.slug)}
                    className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-hover text-navy font-extrabold text-[10px] tracking-wider uppercase transition-colors"
                  >
                    View Specs
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Login Popup */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

    </div>
  );
}
