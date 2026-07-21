'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import QuoteModal from '../../../components/QuoteModal';
import ConsultationModal from '../../../components/ConsultationModal';
import LoginModal from '../../../components/LoginModal';
import { trackEvent } from '../../../lib/gtag';
import { 
  ArrowLeft, Clock, DollarSign, Check, X, Shield, MessageSquare, 
  Video, FileText, ChevronRight, Server, Sparkles, AlertCircle 
} from 'lucide-react';

interface ServiceDetailData {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  features: string; // JSON String
  techStack: string; // JSON String
  priceFrom: number;
  priceTo?: number;
  timeline: string;
  featuredImage: string;
  category: { name: string; slug: string };
}

interface Recommendations {
  similarServices: any[];
  recommendedTemplates: any[];
}

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [service, setService] = useState<ServiceDetailData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations>({ similarServices: [], recommendedTemplates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiRequest<{ service: ServiceDetailData; recommendations: Recommendations }>(`/services/${slug}`);
        setService(res.service);
        setRecommendations(res.recommendations);
        
        // Track service view event in Google Analytics
        trackEvent({
          action: 'view_service',
          category: 'service',
          label: res.service.title,
          value: res.service.priceFrom
        });
      } catch (err: any) {
        console.error('Fetch service detail error:', err);
        setError(err.message || 'Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchServiceDetail();
    }
  }, [slug]);


  const handleAction = (type: 'QUOTE' | 'CONSULTATION') => {
    if (!user) {
      setLoginOpen(true);
    } else {
      if (type === 'QUOTE') setQuoteOpen(true);
      if (type === 'CONSULTATION') setConsultationOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-8">
        <div className="skeleton-box h-10 w-1/3 rounded" />
        <div className="skeleton-box h-64 w-full rounded-xl" />
        <div className="skeleton-box h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-light-gray">Service Not Found</h2>
        <p className="text-xs text-navy-slate">{error || 'The requested service does not exist.'}</p>
        <button 
          onClick={() => router.push('/services')} 
          className="px-4 py-2 rounded-lg bg-navy border border-gold/25 text-xs text-gold font-bold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const featuresList = JSON.parse(service.features);
  const techStackList = JSON.parse(service.techStack);

  // Pricing Package Mock Tiers (derived from starting price)
  const starterPrice = service.priceFrom;
  const proPrice = Math.round(service.priceFrom * 1.8);
  const entPrice = Math.round(service.priceFrom * 3.5);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
      
      {/* Back Button */}
      <button 
        onClick={() => router.push('/services')} 
        className="flex items-center gap-1.5 text-xs font-semibold text-navy-slate hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services Catalog
      </button>

      {/* Hero Service Details */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery/Image */}
        <div className="relative h-80 lg:h-[450px] w-full rounded-2xl overflow-hidden border border-gold/15 bg-navy shadow-2xl">
          <img 
            src={service.featuredImage} 
            alt={service.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 space-y-1">
            <span className="px-2 py-0.5 rounded bg-gold text-navy-dark text-[9px] font-extrabold uppercase tracking-wide">
              {service.category.name}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-light-gray mt-1">
              {service.title}
            </h1>
          </div>
        </div>

        {/* Overview & Quick Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider w-fit">
              <Sparkles className="w-3.5 h-3.5" /> Premium Digital System
            </div>
            <h2 className="text-xl font-bold text-light-gray">Project Blueprint & Deliverables</h2>
            <p className="text-xs text-navy-slate leading-relaxed">{service.longDesc || service.shortDesc}</p>
            
            <div className="pt-2">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Technologies Integrated</h4>
              <div className="flex flex-wrap gap-2">
                {techStackList.map((tech: string) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-navy-light text-xs text-light-gray border border-navy-slate/10">{tech}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-navy-slate/10 bg-navy-light/20 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] text-navy-slate uppercase tracking-wider font-semibold">Delivery Timeline</span>
              <span className="text-sm font-bold text-gold flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4" /> {service.timeline}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-navy-slate uppercase tracking-wider font-semibold">Investment Tier</span>
              <span className="text-sm font-bold text-gold flex items-center gap-1.5 mt-1">
                <DollarSign className="w-4 h-4" /> From ${service.priceFrom}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => handleAction('QUOTE')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-navy font-extrabold text-xs tracking-wider uppercase transition-all shadow-md"
            >
              Request Quote Proposal
            </button>
            <button
              onClick={() => handleAction('CONSULTATION')}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-navy hover:bg-navy-dark border border-gold/20 text-gold text-xs font-bold transition-all"
            >
              <Video className="w-4 h-4" />
              Book Consult
            </button>
          </div>
        </div>
      </section>

      {/* Service Deliverables List */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-light-gray border-b border-navy-slate/10 pb-2">What is Included</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuresList.map((feat: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-xs text-navy-slate">
              <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span className="leading-normal">{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Comparison Table (SRS #54 & #55) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-light-gray">Pricing Packages</h3>
          <p className="text-xs text-navy-slate">Choose the package model that fits your current business stage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Tier */}
          <div className="glass-panel p-6 rounded-2xl border border-navy-slate/15 bg-navy-light/10 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-navy-slate uppercase tracking-wider block">Starter Pack</span>
              <h4 className="text-base font-bold text-light-gray">Local Presence</h4>
              <span className="text-2xl font-black text-gold">${starterPrice}</span>
              <p className="text-[11px] text-navy-slate leading-relaxed">Perfect blueprint for local establishments, clinics, and startups requiring a quick, high-performance portal.</p>
            </div>
            <div className="border-t border-navy-slate/10 pt-4 space-y-2.5 text-xs text-navy-slate">
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Responsive Landing Page</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Standard SEO Schema</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Contact Form Integration</span></div>
              <div className="flex items-center gap-2 text-navy-slate/50"><X className="w-3.5 h-3.5 text-red-500/50 shrink-0" /> <span className="line-through">Custom CRM Dashboard</span></div>
              <div className="flex items-center gap-2 text-navy-slate/50"><X className="w-3.5 h-3.5 text-red-500/50 shrink-0" /> <span className="line-through">AI Chatbot training</span></div>
            </div>
            <button 
              onClick={() => handleAction('QUOTE')}
              className="w-full py-2.5 rounded-xl border border-gold/25 hover:bg-gold hover:text-navy-dark text-gold text-xs font-bold transition-all"
            >
              Order Starter
            </button>
          </div>

          {/* Professional Tier */}
          <div className="glass-panel p-6 rounded-2xl border border-gold/30 bg-navy-light/20 flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gold text-navy-dark text-[9px] font-black uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Professional Pack</span>
              <h4 className="text-base font-bold text-light-gray">Business Growth</h4>
              <span className="text-2xl font-black text-gold">${proPrice}</span>
              <p className="text-[11px] text-navy-slate leading-relaxed">Best for medium firms, doctors, and builders looking to generate automated leads and index programmatic pages.</p>
            </div>
            <div className="border-t border-navy-slate/10 pt-4 space-y-2.5 text-xs text-navy-slate">
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Multi-page Custom Website</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Advanced Local SEO Routes</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Automated WhatsApp Alerts</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>CRM Lead Score Syncing</span></div>
              <div className="flex items-center gap-2 text-navy-slate/50"><X className="w-3.5 h-3.5 text-red-500/50 shrink-0" /> <span className="line-through">Custom ERP Integrations</span></div>
            </div>
            <button 
              onClick={() => handleAction('QUOTE')}
              className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-navy text-xs font-bold transition-all shadow-md"
            >
              Order Professional
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="glass-panel p-6 rounded-2xl border border-navy-slate/15 bg-navy-light/10 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-navy-slate uppercase tracking-wider block">Enterprise Pack</span>
              <h4 className="text-base font-bold text-light-gray">Digital Platform</h4>
              <span className="text-2xl font-black text-gold">${entPrice}</span>
              <p className="text-[11px] text-navy-slate leading-relaxed">Complete corporate digital transformation featuring AI vectors training, full-stack backends, and modular CRM.</p>
            </div>
            <div className="border-t border-navy-slate/10 pt-4 space-y-2.5 text-xs text-navy-slate">
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Complete SaaS Platform / App</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Intelligent AI Chatbots</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Custom Admin CRM System</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Cloud connection & security</span></div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0" /> <span>Dedicated monthly maintenance</span></div>
            </div>
            <button 
              onClick={() => handleAction('QUOTE')}
              className="w-full py-2.5 rounded-xl border border-gold/25 hover:bg-gold hover:text-navy-dark text-gold text-xs font-bold transition-all"
            >
              Order Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Recommendation Block (SRS #57) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-navy-slate/10 pt-16">
        {/* Similar Services */}
        {recommendations.similarServices.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-light-gray uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-gold" /> Similar Services
            </h4>
            <div className="space-y-2">
              {recommendations.similarServices.map((sim) => (
                <div 
                  key={sim.id}
                  onClick={() => router.push(`/services/${sim.slug}`)}
                  className="p-4 rounded-xl bg-navy-light/20 hover:bg-navy-light border border-navy-slate/10 hover:border-gold/20 cursor-pointer flex justify-between items-center transition-all group"
                >
                  <div>
                    <span className="block text-xs font-bold text-light-gray group-hover:text-gold transition-colors">{sim.title}</span>
                    <span className="text-[10px] text-navy-slate line-clamp-1">{sim.shortDesc}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-navy-slate group-hover:text-gold transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Website Templates */}
        {recommendations.recommendedTemplates.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-light-gray uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" /> Recommended Templates
            </h4>
            <div className="space-y-2">
              {recommendations.recommendedTemplates.map((temp) => (
                <div 
                  key={temp.id}
                  onClick={() => router.push(`/templates/${temp.slug}`)}
                  className="p-4 rounded-xl bg-navy-light/20 hover:bg-navy-light border border-navy-slate/10 hover:border-gold/20 cursor-pointer flex justify-between items-center transition-all group"
                >
                  <div>
                    <span className="block text-xs font-bold text-light-gray group-hover:text-gold transition-colors">{temp.name}</span>
                    <span className="text-[10px] text-navy-slate">{temp.industry} ({temp.technology})</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-gold/10 text-gold font-bold">SEO READY</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      <QuoteModal 
        isOpen={quoteOpen} 
        onClose={() => setQuoteOpen(false)} 
        serviceName={service.title}
      />
      <ConsultationModal 
        isOpen={consultationOpen} 
        onClose={() => setConsultationOpen(false)} 
      />
      <LoginModal 
        isOpen={loginOpen} 
        onClose={() => setLoginOpen(false)} 
      />

    </div>
  );
}
