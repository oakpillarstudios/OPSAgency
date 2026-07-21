'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import LoginModal from '../../components/LoginModal';
import { 
  Search, SlidersHorizontal, ArrowUpRight, DollarSign, Clock, 
  HelpCircle, Server, CheckCircle2, Landmark 
} from 'lucide-react';

export default function ServicesCatalog() {
  const router = useRouter();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [budgetLimit, setBudgetLimit] = useState<string>('');
  const [timelineFilter, setTimelineFilter] = useState<string>('all');

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        // Build query string
        let query = '';
        const params: string[] = [];
        if (selectedCategory !== 'all') params.push(`category=${selectedCategory}`);
        if (search) params.push(`search=${search}`);
        if (budgetLimit) params.push(`maxPrice=${budgetLimit}`);
        if (timelineFilter !== 'all') params.push(`timeline=${timelineFilter}`);
        
        if (params.length > 0) {
          query = '?' + params.join('&');
        }

        const res = await apiRequest<{ services: any[] }>(`/services${query}`);
        setServices(res.services || []);

        // Mock categories load
        const mockCats = [
          { slug: 'website-development', name: 'Website Development' },
          { slug: 'custom-software', name: 'Custom Software & CRM' },
          { slug: 'ai-automation', name: 'AI & Automations' },
          { slug: 'seo-performance', name: 'SEO & Performance' }
        ];
        setCategories(mockCats);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, [selectedCategory, search, budgetLimit, timelineFilter]);

  const handleRestrictedAction = (slug: string) => {
    if (!user) {
      setLoginOpen(true);
    } else {
      router.push(`/services/${slug}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider">
          <Server className="w-3.5 h-3.5" /> Discovery Marketplace
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-light-gray tracking-tight premium-gradient-text">
          OakPillar Services Catalog
        </h1>
        <p className="text-xs text-navy-slate max-w-lg leading-relaxed">
          Discover modular digital systems engineered exclusively by our internal team. Filter by budget, timeline, and tech stack to find the perfect blueprint for your business growth.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-5 rounded-2xl border border-navy-slate/15 bg-white shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>

        {/* Category Selector */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Budget Limit */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
          <input
            type="number"
            placeholder="Max budget limit ($)..."
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>

        {/* Timeline Range */}
        <div>
          <select
            value={timelineFilter}
            onChange={(e) => setTimelineFilter(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
          >
            <option value="all">Any Timeline</option>
            <option value="Weeks">Weeks</option>
            <option value="Month">Month</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton-box h-80 rounded-xl" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-navy-slate/20 rounded-2xl">
          <HelpCircle className="w-10 h-10 text-gold/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-light-gray">No Services Found</h3>
          <p className="text-xs text-navy-slate mt-1 max-w-xs mx-auto leading-relaxed">
            We couldn't find any services matching your filters. Try clearing your search parameters or query limits.
          </p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('all'); setBudgetLimit(''); setTimelineFilter('all'); }}
            className="mt-4 px-4 py-2 rounded-lg bg-navy border border-gold/25 text-xs text-gold font-bold hover:bg-navy-dark transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div 
              key={s.id}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-gold/10 bg-navy-light/10 group"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full overflow-hidden bg-navy-dark">
                <img 
                  src={s.featuredImage} 
                  alt={s.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-navy-dark/95 border border-navy-slate/25 text-[8px] font-bold text-navy-slate uppercase">
                  {s.category.name}
                </span>
              </div>

              {/* Description */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-light-gray group-hover:text-gold transition-colors">{s.title}</h3>
                  <p className="text-xs text-navy-slate leading-relaxed line-clamp-3">{s.shortDesc}</p>
                </div>

                <div className="space-y-3.5 border-t border-navy-slate/10 pt-4">
                  {/* Stats metadata */}
                  <div className="flex items-center justify-between text-[10px] text-navy-slate font-bold">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> {s.timeline}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gold" /> From ${s.priceFrom}</span>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleRestrictedAction(s.slug)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gold/25 hover:bg-gold hover:text-navy-dark text-gold text-xs font-bold transition-all"
                  >
                    View Details
                    <ArrowUpRight className="w-4 h-4" />
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
