'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

export default function IndustriesIndex() {
  const router = useRouter();

  const industryData = [
    { name: 'Restaurants & Cafes', slug: 'restaurant', desc: 'Custom menu systems, reservation widgets, and local search visibility boosters.' },
    { name: 'Doctors & Clinics', slug: 'medical', desc: 'Appointment schedulers, practitioner profiles, and HIPAA-compliant portals.' },
    { name: 'Real Estate & Builders', slug: 'real-estate', desc: 'Property listings filters, maps integrations, and high-value lead captures.' },
    { name: 'Hospitals & Medical Care', slug: 'hospital', desc: 'Patient administration frameworks, departments navigation, and safety audits.' },
    { name: 'Interior Designers', slug: 'interior-design', desc: 'Premium fluid project galleries, dark-mode styling, and visual catalog tools.' },
    { name: 'Education & Schools', slug: 'education', desc: 'Syllabus downloads, student dashboard connectors, and event timetables.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider mx-auto">
          <Landmark className="w-3.5 h-3.5" /> Industry Verticals
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-light-gray tracking-tight premium-gradient-text">
          Industries We Service
        </h1>
        <p className="text-xs text-navy-slate max-w-md mx-auto leading-relaxed">
          Select your industry to view optimized blueprints, tailored Next.js templates, and targeted business automations.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {industryData.map((ind) => (
          <div 
            key={ind.slug}
            onClick={() => router.push(`/industries/${ind.slug}`)}
            className="glass-panel p-6 rounded-2xl border border-gold/10 bg-navy-light/10 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Target Verticals</span>
              <h3 className="text-base font-bold text-light-gray group-hover:text-gold transition-colors">{ind.name}</h3>
              <p className="text-xs text-navy-slate leading-relaxed">{ind.desc}</p>
            </div>
            <span className="text-xs font-bold text-gold flex items-center gap-1 mt-2">
              Explore Blueprint <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
