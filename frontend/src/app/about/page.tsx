'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Award, Users, HardHat, Calendar } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-extrabold text-light-gray premium-gradient-text">About OakPillar Studios</h1>
        <p className="text-xs text-navy-slate max-w-md mx-auto leading-relaxed">
          An elite full stack engineering agency providing direct, high-performance web systems and CRM dashboards.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-gold/15 bg-navy-light/10 space-y-6">
        <h2 className="text-base font-bold text-light-gray">Our Philosophy</h2>
        <p className="text-xs text-navy-slate leading-relaxed">
          Traditional agencies outsource development to unvetted freelancers, resulting in fragile code, slow load times, and poor search index representation. At OakPillar Studios, we control 100% of our code stack. Every template, service, and automation is coded in-house by our full-time engineers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-navy-slate/5">
          <div className="space-y-2">
            <Users className="w-5 h-5 text-gold" />
            <h3 className="text-xs font-bold text-light-gray">Direct Developers Only</h3>
            <p className="text-[10px] text-navy-slate">No middlemen or freelancers. You deal directly with principal engineers.</p>
          </div>
          <div className="space-y-2">
            <Award className="w-5 h-5 text-gold" />
            <h3 className="text-xs font-bold text-light-gray">Clean Code Handovers</h3>
            <p className="text-[10px] text-navy-slate">100% repository transfer on project completion. Zero vendor lock-in.</p>
          </div>
          <div className="space-y-2">
            <HardHat className="w-5 h-5 text-gold" />
            <h3 className="text-xs font-bold text-light-gray">Enterprise Upkeep</h3>
            <p className="text-[10px] text-navy-slate">Active 24/7 security auditing, daily backups, and speed maintenance packages.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button 
          onClick={() => router.push('/estimator')}
          className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-navy font-extrabold text-xs tracking-wider uppercase transition-colors"
        >
          Launch Cost Estimator
        </button>
      </div>
    </div>
  );
}
