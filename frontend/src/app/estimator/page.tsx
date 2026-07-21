'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import LoginModal from '../../components/LoginModal';
import { trackEvent } from '../../lib/gtag';
import { 
  Sparkles, ChevronRight, ChevronLeft, Calculator, ShieldCheck, 
  HelpCircle, DollarSign, Calendar, MessageSquare, ArrowRight, Layout 
} from 'lucide-react';

export default function AIProjectEstimator() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  // Steps state
  const [step, setStep] = useState(1);

  // Form selections
  const [businessType, setBusinessType] = useState('Service Business');
  const [industry, setIndustry] = useState('Real Estate');
  const [pagesCount, setPagesCount] = useState(5);
  const [backendRequired, setBackendRequired] = useState(false);
  const [crmRequired, setCrmRequired] = useState(false);
  const [aiRequired, setAiRequired] = useState(false);
  const [whatsappRequired, setWhatsappRequired] = useState(false);
  const [seoPackage, setSeoPackage] = useState('Standard'); // "None", "Standard", "Enterprise"
  const [maintenance, setMaintenance] = useState(true);
  const [timeline, setTimeline] = useState('Standard (3-4 Weeks)');

  // Result state
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateEstimate = async () => {
    // Force login to capture CRM Lead (SRS #82)
    if (!user) {
      setLoginOpen(true);
      return;
    }

    setLoading(true);
    try {
      // Calculate costs locally based on options
      let baseCost = 1500;
      if (businessType === 'E-commerce') baseCost = 3500;
      if (businessType === 'Custom Platform') baseCost = 5000;

      const pageCost = pagesCount * 120;
      const backendCost = backendRequired ? 1200 : 0;
      const crmCost = crmRequired ? 1800 : 0;
      const aiCost = aiRequired ? 1500 : 0;
      const whatsappCost = whatsappRequired ? 800 : 0;
      const seoCost = seoPackage === 'Enterprise' ? 1200 : seoPackage === 'Standard' ? 500 : 0;
      const maintCost = maintenance ? 400 : 0;

      const totalCost = baseCost + pageCost + backendCost + crmCost + aiCost + whatsappCost + seoCost + maintCost;

      // Map package tier recommendation
      let recommendedTier = 'Starter';
      let matchingService = 'portfolio-website';
      if (totalCost > 3000) {
        recommendedTier = 'Professional';
        matchingService = 'business-website';
      }
      if (totalCost > 6000) {
        recommendedTier = 'Enterprise';
        matchingService = 'crm-development';
      }

      // Submit lead quote entry to database
      const requirements = `AI Estimator Run: Business: ${businessType}, Industry: ${industry}, Pages: ${pagesCount}, Backend: ${backendRequired}, CRM: ${crmRequired}, AI: ${aiRequired}, WhatsApp: ${whatsappRequired}, SEO: ${seoPackage}, Maint: ${maintenance}.`;
      
      await apiRequest('/quotes', {
        method: 'POST',
        body: JSON.stringify({
          serviceName: `AI Project Estimate: ${recommendedTier} Blueprint`,
          templateName: 'Estimator Calculator',
          budget: totalCost,
          timeline,
          requirements
        })
      });

      setResult({
        costRange: `$${Math.round(totalCost * 0.9)} - $${Math.round(totalCost * 1.15)}`,
        timeline: timeline.split(' ')[0] + ' Weeks',
        recommendedTier,
        matchingService,
        breakdown: {
          baseCost,
          featuresCost: pageCost + backendCost + crmCost + aiCost + whatsappCost,
          addonsCost: seoCost + maintCost
        }
      });
      // Track AI Estimator Completion
      trackEvent({
        action: 'complete_estimator',
        category: 'estimator',
        label: recommendedTier,
        value: totalCost
      });

      await refreshProfile(); // Refresh activities count
      setStep(4);
    } catch (err) {
      console.error('Estimator post failed:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider mx-auto">
          <Calculator className="w-3.5 h-3.5" /> Interactive Estimator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-light-gray tracking-tight premium-gradient-text">
          AI Project Cost Estimator
        </h1>
        <p className="text-xs text-navy-slate max-w-md mx-auto leading-relaxed">
          Configure pages, custom backends, and integrations. Capture quote estimates in your CRM dashboard immediately.
        </p>
      </div>

      {/* Estimator Wizard Card */}
      <div className="glass-panel p-8 rounded-2xl border border-gold/15 bg-navy-light/10 relative">
        
        {step < 4 && (
          <div className="w-full bg-navy h-1.5 rounded-full mb-8 overflow-hidden">
            <div 
              className="bg-gold h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Step 1: Business Overview */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-light-gray">Step 1: Tell us about your business</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-slate mb-2">Business Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Service Business', 'E-commerce', 'Custom Platform'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBusinessType(type)}
                      className={`p-4 rounded-xl border text-xs font-bold transition-all text-center ${
                        businessType === type 
                          ? 'border-gold bg-gold/10 text-gold shadow' 
                          : 'border-navy-slate/10 bg-navy/40 text-navy-slate hover:border-gold/30 hover:text-light-gray'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-slate mb-2">Target Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-navy-slate/20 bg-navy text-xs text-light-gray focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="Real Estate">Real Estate & Construction</option>
                  <option value="Restaurant">Restaurant & Cafe</option>
                  <option value="Interior Design">Interior Design & Architecture</option>
                  <option value="Medical">Doctor & Clinic Health</option>
                  <option value="Corporate">Corporate Enterprises</option>
                  <option value="NGO">Non-Profit Organisation</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-dark border border-gold/25 text-xs text-gold font-bold transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Scale & Backends */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-light-gray">Step 2: Define size and complexity</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-navy-slate mb-1">
                  Estimated Pages Count: <strong className="text-gold">{pagesCount} Pages</strong>
                </label>
                <input 
                  type="range"
                  min="1"
                  max="30"
                  value={pagesCount}
                  onChange={(e) => setPagesCount(parseInt(e.target.value))}
                  className="w-full accent-gold bg-navy h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Custom features toggles */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-navy-slate">Technical Requirements</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { state: backendRequired, set: setBackendRequired, title: 'Secure User Database', desc: 'Required for client profiles or portals.' },
                    { state: crmRequired, set: setCrmRequired, title: 'CRM Lead Pipeline', desc: 'Dashboard to manage quote logs and lead scores.' },
                    { state: aiRequired, set: setAiRequired, title: 'AI Conversational Bot', desc: 'Vector chatbot trained on custom business data.' },
                    { state: whatsappRequired, set: setWhatsappRequired, title: 'WhatsApp Automations', desc: 'Auto confirmations and alert pipelines.' }
                  ].map((feat, i) => (
                    <div 
                      key={i}
                      onClick={() => feat.set(!feat.state)}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all ${
                        feat.state 
                          ? 'border-gold bg-gold/5 text-light-gray' 
                          : 'border-navy-slate/10 bg-navy/40 text-navy-slate hover:border-gold/20'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-light-gray flex items-center justify-between">
                        {feat.title}
                        <input type="checkbox" checked={feat.state} onChange={() => {}} className="accent-gold pointer-events-none" />
                      </h4>
                      <p className="text-[10px] text-navy-slate mt-1 leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={handlePrevStep}
                className="flex items-center gap-1 text-xs text-navy-slate hover:text-gold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-dark border border-gold/25 text-xs text-gold font-bold transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Timelines & Marketing */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-light-gray">Step 3: Marketing & Maintenance</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-slate mb-2">SEO Blueprint Package</label>
                <div className="grid grid-cols-3 gap-3">
                  {['None', 'Standard', 'Enterprise'].map((pkg) => (
                    <button
                      key={pkg}
                      type="button"
                      onClick={() => setSeoPackage(pkg)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        seoPackage === pkg 
                          ? 'border-gold bg-gold/10 text-gold' 
                          : 'border-navy-slate/10 bg-navy/40 text-navy-slate hover:border-gold/30'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-slate mb-2">Project Delivery Timeline</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-navy-slate/20 bg-navy text-xs text-light-gray focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="1-2 Weeks">1 - 2 Weeks (Express Acceleration)</option>
                  <option value="3-4 Weeks">3 - 4 Weeks (Standard Timeline)</option>
                  <option value="5-8 Weeks">5 - 8 Weeks (Complex Software)</option>
                </select>
              </div>

              <div 
                onClick={() => setMaintenance(!maintenance)}
                className={`p-4 rounded-xl border cursor-pointer select-none transition-all ${
                  maintenance ? 'border-gold bg-gold/5' : 'border-navy-slate/10 bg-navy/40'
                }`}
              >
                <h4 className="text-xs font-bold text-light-gray flex items-center justify-between">
                  Include Monthly Support & Maintenance Care
                  <input type="checkbox" checked={maintenance} onChange={() => {}} className="accent-gold pointer-events-none" />
                </h4>
                <p className="text-[10px] text-navy-slate mt-1">Includes cloud deployment scaling, SSL checkups, sitemap rebuilds, and security logs auditing.</p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={handlePrevStep}
                className="flex items-center gap-1 text-xs text-navy-slate hover:text-gold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={calculateEstimate}
                disabled={loading}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-xs text-navy font-extrabold transition-all uppercase tracking-wider shadow-md"
              >
                {loading ? 'Analyzing...' : 'Generate Estimate'}
                <Calculator className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results Breakdown */}
        {step === 4 && result && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <Calculator className="w-12 h-12 text-gold mx-auto" />
              <h2 className="text-xl font-bold text-light-gray">Estimated Price Range</h2>
              <span className="block text-3xl font-black text-gold premium-gradient-text">{result.costRange}</span>
              <p className="text-xs text-navy-slate max-w-sm mx-auto leading-normal">
                Estimated Delivery: <strong className="text-light-gray">{result.timeline}</strong> on the recommended <strong className="text-gold">{result.recommendedTier} Package</strong>.
              </p>
            </div>

            {/* Recommendations matching service catalog link (SRS #297) */}
            <div className="p-4 rounded-xl border border-navy-slate/10 bg-navy-dark/40 max-w-md mx-auto space-y-3">
              <span className="text-[9px] font-bold text-gold uppercase tracking-wider block">Recommended Blueprint Service</span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-light-gray text-left">OakPillar {result.recommendedTier} Service Package</span>
                <button
                  onClick={() => router.push(`/services/${result.matchingService}`)}
                  className="px-3 py-1.5 rounded-lg bg-navy hover:bg-navy-dark border border-gold/15 text-[10px] text-gold font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-slate/10 flex justify-center gap-3">
              <button 
                onClick={() => { setStep(1); setResult(null); }}
                className="px-4 py-2 rounded-lg border border-navy-slate/20 text-xs text-navy-slate hover:text-gold transition-colors"
              >
                Estimate Again
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-navy text-xs font-bold tracking-wide transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

    </div>
  );
}
