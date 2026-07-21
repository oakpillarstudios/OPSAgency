'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Sparkles, Search, SlidersHorizontal, ArrowUpRight, Award, 
  Smartphone, Monitor, Tablet, CheckCircle2, Star, Calendar, MessageSquare 
} from 'lucide-react';
import QuoteModal from '../../components/QuoteModal';

export default function PortfolioPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Premium Custom Website');

  // Preview viewport device simulation state per project ID
  const [viewports, setViewports] = useState<Record<string, 'desktop' | 'tablet' | 'mobile'>>({});

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await apiRequest<{ portfolios: any[] }>('/portfolios');
        setProjects(res.portfolios || []);
        
        // Initialize default viewports to desktop
        const initialViewports: Record<string, 'desktop' | 'tablet' | 'mobile'> = {};
        (res.portfolios || []).forEach((p) => {
          initialViewports[p.id] = 'desktop';
        });
        setViewports(initialViewports);
      } catch (err) {
        console.error('Failed to load portfolio items:', err);
        showToast('Failed to load case studies.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [showToast]);

  const changeViewport = (projectId: string, mode: 'desktop' | 'tablet' | 'mobile') => {
    setViewports((prev) => ({ ...prev, [projectId]: mode }));
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.projectStory.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || p.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const uniqueIndustries = Array.from(new Set(projects.map((p) => p.industry)));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16 animate-fade-in font-sans">
      
      {/* 1. Hero Block */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider mx-auto">
          <Award className="w-3.5 h-3.5" /> Commercial Transformation Stories
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy leading-tight tracking-tight premium-gradient-text">
          Enterprise Case Studies
        </h1>
        <p className="text-xs text-navy-slate leading-relaxed">
          Explore specialized digital assets engineered by OakPillar Studios. Real metrics, 99+ Lighthouse performance scores, and custom backend dashboard components.
        </p>
      </div>

      {/* 2. Stats Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { metric: '99/100', label: 'Average Core Speed Score', desc: 'Next.js pre-fetched asset pipelines' },
          { metric: '-65%', label: 'Mobile Bounce Rate Decrease', desc: 'Responsive CSS layout optimizations' },
          { metric: '40%+', label: 'Organic Query Growth', desc: 'JSON-LD schema structured data setups' },
          { metric: '100%', label: 'In-House Development', desc: 'Zero third-party unverified developers' }
        ].map((item, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-navy-slate/10 bg-white text-center hover:scale-102 transition-transform duration-200">
            <span className="block text-3xl font-black text-gold mb-1">{item.metric}</span>
            <span className="block text-[10px] text-navy font-bold uppercase tracking-wider">{item.label}</span>
            <span className="block text-[9px] text-navy-slate mt-1">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* 3. Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl border border-navy-slate/10 bg-white shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
          <input
            type="text"
            placeholder="Search projects by stack, description, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-navy-slate/15 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
          />
        </div>
        <div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-navy-slate/15 bg-white text-xs text-navy focus:outline-none focus:border-gold cursor-pointer"
          >
            <option value="all">All Industries</option>
            {uniqueIndustries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Projects Showcase */}
      {loading ? (
        <div className="space-y-12">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="skeleton-box h-96 rounded-2xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-navy-slate/20 rounded-2xl bg-white shadow-sm">
          <Award className="w-10 h-10 text-gold/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-navy">No Case Studies Found</h3>
          <p className="text-xs text-navy-slate max-w-xs mx-auto leading-relaxed mt-1">
            There are no transformations matching your filtered parameters yet. Clear criteria to show all works.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredProjects.map((p) => {
            const currentMode = viewports[p.id] || 'desktop';
            const techList = JSON.parse(p.technologies || '[]');
            const galleryList = JSON.parse(p.gallery || '[]');
            
            // Viewport simulation styling
            const viewportClass = {
              desktop: 'w-full max-w-4xl h-80 md:h-96 border border-navy-slate/15 rounded-xl object-cover',
              tablet: 'w-[480px] h-80 border border-navy-slate/30 rounded-xl shadow-lg object-cover mx-auto',
              mobile: 'w-[280px] h-80 border-4 border-navy rounded-2xl shadow-xl object-cover mx-auto'
            }[currentMode];

            return (
              <div key={p.id} className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-navy-slate/10 pb-12 items-start">
                
                {/* Device Viewport Simulation Frame */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-navy-slate/5 pb-3">
                    <span className="text-[10px] text-navy font-bold uppercase tracking-wider">Device Viewport Simulator</span>
                    <div className="flex gap-2">
                      {[
                        { mode: 'desktop', icon: <Monitor className="w-3.5 h-3.5" /> },
                        { mode: 'tablet', icon: <Tablet className="w-3.5 h-3.5" /> },
                        { mode: 'mobile', icon: <Smartphone className="w-3.5 h-3.5" /> }
                      ].map((btn) => (
                        <button
                          key={btn.mode}
                          onClick={() => changeViewport(p.id, btn.mode as any)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                            currentMode === btn.mode 
                              ? 'border-gold bg-gold/10 text-gold shadow-sm' 
                              : 'border-navy-slate/10 hover:border-gold/30 text-navy-slate hover:text-navy'
                          }`}
                          aria-label={`Preview ${btn.mode}`}
                        >
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-navy-dark rounded-2xl flex items-center justify-center min-h-[350px] overflow-hidden">
                    <img 
                      src={galleryList[0] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60'} 
                      alt={`${p.projectName} screenshot`} 
                      className={`${viewportClass} transition-all duration-300`} 
                    />
                  </div>
                </div>

                {/* Case Study Details */}
                <div className="space-y-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-gold/10 text-gold text-[9px] font-black uppercase tracking-wider">
                      {p.industry}
                    </span>
                    <h2 className="text-xl font-bold text-navy mt-2">{p.projectName}</h2>
                    <span className="block text-[10px] text-navy-slate font-bold mt-1">Client: {p.client}</span>
                  </div>

                  <div className="space-y-3.5 text-xs text-navy-slate leading-relaxed">
                    <div>
                      <strong className="block text-navy font-bold">The Challenge:</strong>
                      <p>{p.challenges}</p>
                    </div>
                    <div>
                      <strong className="block text-navy font-bold">Our Solution:</strong>
                      <p>{p.solutions}</p>
                    </div>
                  </div>

                  {/* Lighthouse Scores */}
                  <div className="flex gap-4 p-4 rounded-xl bg-navy-dark border border-navy-slate/10">
                    <div className="flex-1 text-center">
                      <span className="block text-xl font-black text-emerald-500">{p.perfScore}%</span>
                      <span className="block text-[8px] uppercase tracking-wider text-navy font-bold">Performance</span>
                    </div>
                    <div className="flex-1 text-center border-l border-navy-slate/10">
                      <span className="block text-xl font-black text-emerald-500">{p.seoScore}%</span>
                      <span className="block text-[8px] uppercase tracking-wider text-navy font-bold">SEO Indexing</span>
                    </div>
                    <div className="flex-1 text-center border-l border-navy-slate/10">
                      <span className="block text-xl font-black text-emerald-500">100%</span>
                      <span className="block text-[8px] uppercase tracking-wider text-navy font-bold">Accessibility</span>
                    </div>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {techList.map((tech: string) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded bg-white border border-navy-slate/10 text-[9px] font-semibold text-navy">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  {p.clientReview && (
                    <div className="border-l-2 border-gold pl-4 py-1 italic text-xs text-navy-slate">
                      "{p.clientReview}"
                      <span className="block not-italic text-[10px] text-navy font-bold mt-1">— {p.clientName}, {p.clientRole}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <div>
                    <button
                      onClick={() => { setSelectedService(p.projectName); setQuoteOpen(true); }}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow-sm"
                    >
                      Get Similar Quote <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. Final CTA */}
      <div className="text-center p-8 rounded-2xl bg-white border border-navy-slate/10 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-navy">Ready to engineer a digital transformation for your brand?</h3>
        <p className="text-xs text-navy-slate max-w-sm mx-auto leading-relaxed">
          Contact our principal developers to scoping custom dashboard, web systems, or landing platforms.
        </p>
        <button
          onClick={() => { setSelectedService('Custom Agency Consultation'); setQuoteOpen(true); }}
          className="px-6 py-3 rounded-xl bg-navy hover:bg-navy-dark text-white font-extrabold text-xs tracking-wider uppercase transition-colors"
        >
          Scoping Quote Review
        </button>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} serviceName={selectedService} />

    </div>
  );
}
