'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import QuoteModal from '../../../components/QuoteModal';
import LoginModal from '../../../components/LoginModal';
import { trackEvent } from '../../../lib/gtag';
import { 
  ArrowLeft, Monitor, Tablet, Smartphone, Sparkles, AlertCircle, 
  CheckCircle2, Star, ShieldAlert, Award, FileText, Settings, Heart 
} from 'lucide-react';

interface TemplateDetailData {
  id: string;
  name: string;
  slug: string;
  category: string;
  industry: string;
  description: string;
  technology: string;
  primaryColor: string;
  thumbnail: string;
  gallery: string; // JSON String list
  responsive: boolean;
  seoReady: boolean;
  perfScore: number;
  accessScore: number;
}

export default function TemplateDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [template, setTemplate] = useState<TemplateDetailData | null>(null);
  const [recommendations, setRecommendations] = useState<any>({ similarTemplates: [], recommendedServices: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Device Simulator Viewport
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Modals state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchTemplateDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiRequest<{ template: TemplateDetailData; recommendations: any }>(`/templates/${slug}`);
        setTemplate(res.template);
        setRecommendations(res.recommendations);

        // Track template view event in Google Analytics
        trackEvent({
          action: 'view_template',
          category: 'template',
          label: res.template.name
        });

        // Check if bookmarked in user profile
        if (user && res.template) {
          const profile = await apiRequest<any>('/auth/profile');
          const saved = profile.user.savedTemplates.some((t: any) => t.templateId === res.template.id);
          setIsSaved(saved);
        }

      } catch (err: any) {
        console.error('Fetch template error:', err);
        setError(err.message || 'Failed to load template.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTemplateDetail();
    }
  }, [slug, user]);

  const handleBookmark = async () => {
    if (!user || !template) {
      setLoginOpen(true);
      return;
    }

    try {
      if (isSaved) {
        await apiRequest(`/templates/save/${template.id}`, { method: 'DELETE' });
        setIsSaved(false);
      } else {
        await apiRequest('/templates/save', {
          method: 'POST',
          body: JSON.stringify({ templateId: template.id })
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to update template bookmark:', err);
    }
  };

  const handleAction = () => {
    if (!user) {
      setLoginOpen(true);
    } else {
      setQuoteOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-8">
        <div className="skeleton-box h-10 w-1/3 rounded" />
        <div className="skeleton-box h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-light-gray">Template Not Found</h2>
        <p className="text-xs text-navy-slate">{error || 'The requested template does not exist.'}</p>
        <button 
          onClick={() => router.push('/templates')} 
          className="px-4 py-2 rounded-lg bg-navy border border-gold/25 text-xs text-gold font-bold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const galleryList = JSON.parse(template.gallery);

  const pagesIncluded = ['Homepage Layout', 'Service Deliverables Catalog', 'About Agency Narrative', 'Contact Intake Portal', 'Faq Accordion Details'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/templates')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-navy-slate hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Templates Marketplace
        </button>

        {/* Favorite */}
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
            isSaved 
              ? 'border-gold/30 bg-gold/10 text-gold' 
              : 'border-navy-slate/20 bg-navy-light/10 text-navy-slate hover:border-gold/30 hover:text-gold'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-gold text-gold' : ''}`} />
          {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
        </button>
      </div>

      {/* Device Simulation Container */}
      <section className="space-y-4">
        {/* Device Switcher */}
        <div className="flex justify-center items-center gap-3 border-b border-navy-slate/10 pb-4">
          <button 
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${
              viewport === 'desktop' ? 'bg-gold/10 text-gold border border-gold/30' : 'text-navy-slate hover:text-light-gray'
            }`}
          >
            <Monitor className="w-4 h-4" /> Desktop
          </button>
          <button 
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${
              viewport === 'tablet' ? 'bg-gold/10 text-gold border border-gold/30' : 'text-navy-slate hover:text-light-gray'
            }`}
          >
            <Tablet className="w-4 h-4" /> Tablet
          </button>
          <button 
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${
              viewport === 'mobile' ? 'bg-gold/10 text-gold border border-gold/30' : 'text-navy-slate hover:text-light-gray'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Mobile
          </button>
        </div>

        {/* Device viewport frame simulation (SRS #64 & #65) */}
        <div className="flex justify-center bg-navy-dark/40 p-6 rounded-2xl border border-navy-slate/5 overflow-hidden select-none relative min-h-[450px] items-center">
          {/* Watermark overlay protection */}
          <div className="absolute inset-0 template-protection-watermark z-10" />

          {viewport === 'desktop' && (
            <div className="w-full flex flex-col border border-navy-slate/15 rounded-2xl overflow-hidden bg-white shadow-2xl transition-all duration-300 transform">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-slate/10 bg-navy-dark flex-shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-grow max-w-md mx-auto bg-white border border-navy-slate/10 text-[10px] text-navy-slate text-center py-1 rounded-lg truncate font-mono">
                  https://oakpillarstudios.com/preview/{template.slug}
                </div>
              </div>
              <div className="relative h-[480px] overflow-y-auto">
                <img 
                  src={galleryList[0] || template.thumbnail} 
                  alt="Desktop Preview" 
                  className="w-full object-cover object-top"
                  draggable="false"
                />
              </div>
            </div>
          )}

          {viewport === 'tablet' && (
            <div className="w-[500px] border-[14px] border-navy rounded-[32px] overflow-hidden shadow-2xl relative bg-white transition-all duration-300 transform">
              {/* Tablet Camera */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-navy-slate/40 z-20"></div>
              <div className="relative h-[500px] overflow-y-auto">
                <img 
                  src={galleryList[1] || galleryList[0] || template.thumbnail} 
                  alt="Tablet Preview" 
                  className="w-full object-cover object-top"
                  draggable="false"
                />
              </div>
            </div>
          )}

          {viewport === 'mobile' && (
            <div className="w-[290px] border-[12px] border-navy rounded-[40px] overflow-hidden shadow-2xl relative bg-white flex flex-col transition-all duration-300 transform">
              {/* Dynamic Island / Speaker */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-navy z-20 flex items-center justify-end px-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-navy-slate/40"></div>
              </div>
              <div className="relative h-[440px] overflow-y-auto pt-2">
                <img 
                  src={galleryList[2] || galleryList[0] || template.thumbnail} 
                  alt="Mobile Preview" 
                  className="w-full object-cover object-top"
                  draggable="false"
                />
              </div>
              {/* Home bar */}
              <div className="h-6 bg-white flex items-center justify-center border-t border-navy-slate/5">
                <div className="w-20 h-1 rounded-full bg-navy-slate/30"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Specifications details */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Core Specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest block">
              HTML Blueprint Specifications
            </span>
            <h2 className="text-xl font-bold text-light-gray">
              {template.name}
            </h2>
            <p className="text-xs text-navy-slate leading-relaxed">
              {template.description}
            </p>
          </div>

          {/* Scores (SRS #64) */}
          <div className="grid grid-cols-3 gap-4 border-t border-b border-navy-slate/10 py-6">
            <div className="text-center">
              <span className="block text-2xl font-black text-emerald-400">{template.perfScore}</span>
              <span className="block text-[9px] text-navy-slate uppercase tracking-wider font-bold">Lighthouse Speed</span>
            </div>
            <div className="text-center border-l border-r border-navy-slate/10">
              <span className="block text-2xl font-black text-emerald-400">{template.accessScore}</span>
              <span className="block text-[9px] text-navy-slate uppercase tracking-wider font-bold">Accessibility</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-emerald-400">100</span>
              <span className="block text-[9px] text-navy-slate uppercase tracking-wider font-bold">SEO Indexable</span>
            </div>
          </div>

          {/* Included Pages list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-light-gray uppercase tracking-wider">Pre-compiled Pages Included</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-navy-slate">
              {pagesIncluded.map((pg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>{pg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-gold/15 bg-navy-light/10 space-y-6 h-fit">
          <div>
            <span className="text-[10px] text-navy-slate uppercase tracking-wider block font-bold">Customization Options</span>
            <p className="text-xs text-navy-slate mt-1">Our engineers will customize colors, copy, assets, and connect your business domains.</p>
          </div>

          <div className="space-y-2 border-t border-b border-navy-slate/10 py-4 text-xs text-navy-slate">
            <div>
              <span className="text-navy-slate mr-2">Framework:</span>
              <strong className="text-light-gray">{template.technology}</strong>
            </div>
            <div>
              <span className="text-navy-slate mr-2">Primary Color:</span>
              <strong className="text-gold">{template.primaryColor}</strong>
            </div>
            <div>
              <span className="text-navy-slate mr-2">Layout:</span>
              <strong className="text-light-gray">Responsive Grid</strong>
            </div>
          </div>

          <button
            onClick={handleAction}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-hover text-navy font-extrabold text-xs tracking-wider uppercase transition-all shadow-md"
          >
            I am interested in this design
          </button>
        </div>

      </section>

      {/* Modals */}
      <QuoteModal 
        isOpen={quoteOpen} 
        onClose={() => setQuoteOpen(false)} 
        serviceName="Website Template Integration"
        templateName={template.name}
      />
      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)} 
      />

    </div>
  );
}
