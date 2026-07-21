'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import QuoteModal from '../../../components/QuoteModal';
import ConsultationModal from '../../../components/ConsultationModal';
import LoginModal from '../../../components/LoginModal';
import { 
  ArrowLeft, Landmark, Check, AlertTriangle, ShieldCheck, 
  ChevronRight, Calendar, MessageSquare, Sparkles 
} from 'lucide-react';

interface IndustryPageData {
  title: string;
  slug: string;
  desc: string;
  challenges: string[];
  solutions: string[];
  serviceSlug: string;
  templateSlug: string;
}

export default function IndustryDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [industry, setIndustry] = useState<IndustryPageData | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    // Generate static content mapping to fulfill requirement #70
    const mockIndustries: Record<string, IndustryPageData> = {
      restaurant: {
        title: 'Restaurants & Cafes',
        slug: 'restaurant',
        desc: 'Fluid responsive menu sheets, automated Reservation tables, and local Google Map discovery integration.',
        challenges: [
          'High commissions charged by food aggregators',
          'Poor loading speeds for mobile menus',
          'Dropped bookings from clunky PDF menu sheets'
        ],
        solutions: [
          'Bespoke zero-commission online reservation portals',
          'Lighthouse 100% speed mobile digital menus',
          'WhatsApp-alert notification pipelines'
        ],
        serviceSlug: 'portfolio-website',
        templateSlug: 'restaurant'
      },
      medical: {
        title: 'Doctors & Clinics',
        slug: 'medical',
        desc: 'HIPAA-secure practitioner directories, booking slot tables, and patient feedback capture portals.',
        challenges: [
          'Double-booked appointment slots from phone calling errors',
          'Poor search rankings for clinic name keywords',
          'Inefficient patient record capture systems'
        ],
        solutions: [
          'Real-time automated calendar reservation slots',
          'Structured Local SEO schema rating blocks',
          'Secure JWT profile patient dashboards'
        ],
        serviceSlug: 'business-website',
        templateSlug: 'doctor'
      },
      'real-estate': {
        title: 'Real Estate & Builders',
        slug: 'real-estate',
        desc: 'Map listing grids, custom property filters, interactive brochure downloads, and lead scoring.',
        challenges: [
          'High lead-leakage from slow agent follow-up call rates',
          'Visual layout shifts causing high mobile bounce rates',
          'Spam queries from low-intent lead captures'
        ],
        solutions: [
          'Instant WhatsApp notification alerts to agents',
          'CLS-optimized property gallery grids',
          'Lead qualification scoring synced to dashboards'
        ],
        serviceSlug: 'crm-development',
        templateSlug: 'real-estate'
      }
    };

    const target = mockIndustries[slug] || {
      title: 'Enterprise Businesses',
      slug: 'corporate',
      desc: 'Bespoke corporate digital systems designed for high-performance and business growth.',
      challenges: [
        'Vendor lock-in from legacy CMS solutions',
        'Vulnerabilities to database XSS scripts',
        'Slow perceived loading speeds on mobile'
      ],
      solutions: [
        'Complete repository handovers with zero ongoing royalties',
        'Express and Helmet route security locks',
        'Next.js variable font subset performance'
      ],
      serviceSlug: 'business-website',
      templateSlug: 'real-estate'
    };

    setIndustry(target);
  }, [slug]);

  const handleAction = (type: 'QUOTE' | 'CONSULTATION') => {
    if (!user) {
      setLoginOpen(true);
    } else {
      if (type === 'QUOTE') setQuoteOpen(true);
      if (type === 'CONSULTATION') setConsultationOpen(true);
    }
  };

  if (!industry) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
      
      {/* Back Button */}
      <button 
        onClick={() => router.push('/industries')} 
        className="flex items-center gap-1.5 text-xs font-semibold text-navy-slate hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Industries list
      </button>

      {/* Hero */}
      <section className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider">
          <Landmark className="w-3.5 h-3.5" /> {industry.title} Blueprint
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-light-gray tracking-tight premium-gradient-text">
          Website Design for {industry.title}
        </h1>
        <p className="text-xs text-navy-slate leading-relaxed">{industry.desc}</p>
      </section>

      {/* Challenges & Solutions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pain points */}
        <div className="glass-panel p-6 rounded-2xl border border-red-500/10 bg-navy-light/5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Industry Pain Points
          </h3>
          <ul className="space-y-3 text-xs text-navy-slate">
            {industry.challenges.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-normal">
                <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OakPillar Solutions */}
        <div className="glass-panel p-6 rounded-2xl border border-gold/15 bg-navy-light/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> OakPillar Digital Solutions
          </h3>
          <ul className="space-y-3 text-xs text-navy-slate">
            {industry.solutions.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-normal">
                <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recommends Toggles */}
      <section className="space-y-6">
        <h3 className="text-base font-bold text-light-gray border-b border-navy-slate/10 pb-2">Recommended Digital Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service */}
          <div className="p-5 rounded-2xl border border-navy-slate/15 bg-navy-light/10 flex items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[9px] font-bold text-gold uppercase tracking-wider block mb-1">Recommended Agency Service</span>
              <strong className="text-light-gray text-sm">Targeted {industry.title} Development</strong>
            </div>
            <button
              onClick={() => router.push(`/services/${industry.serviceSlug}`)}
              className="px-4 py-2 rounded-lg bg-navy hover:bg-navy-dark border border-gold/15 text-[10px] text-gold font-bold transition-all flex items-center gap-1 shrink-0"
            >
              Learn More <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Template */}
          <div className="p-5 rounded-2xl border border-navy-slate/15 bg-navy-light/10 flex items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[9px] font-bold text-gold uppercase tracking-wider block mb-1">Target Template Mockup</span>
              <strong className="text-light-gray text-sm">{industry.title} Next.js Layout</strong>
            </div>
            <button
              onClick={() => router.push(`/templates/${industry.templateSlug}`)}
              className="px-4 py-2 rounded-lg bg-navy hover:bg-navy-dark border border-gold/15 text-[10px] text-gold font-bold transition-all flex items-center gap-1 shrink-0"
            >
              Preview Template <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Final CTAs */}
      <section className="text-center py-10 rounded-2xl border border-gold/15 bg-navy-light/25 max-w-4xl mx-auto space-y-6">
        <h3 className="text-xl font-bold text-light-gray premium-gradient-text">Deploy an Optimized Platform for Your Business</h3>
        <p className="text-xs text-navy-slate max-w-sm mx-auto leading-relaxed">
          Unlock the complete source code, index sitemaps, and WhatsApp alerts for your operations today.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2 max-w-xs sm:max-w-none mx-auto">
          <button 
            onClick={() => handleAction('QUOTE')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-navy font-extrabold text-xs tracking-wider uppercase transition-colors"
          >
            Get Custom Quote
          </button>
          <button 
            onClick={() => handleAction('CONSULTATION')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-navy hover:bg-navy-dark border border-gold/20 text-gold text-xs font-bold transition-all"
          >
            <Calendar className="w-4 h-4" /> Book Consultation
          </button>
        </div>
      </section>

      {/* Modals */}
      <QuoteModal 
        isOpen={quoteOpen} 
        onClose={() => setQuoteOpen(false)} 
        serviceName={`${industry.title} System Package`}
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
