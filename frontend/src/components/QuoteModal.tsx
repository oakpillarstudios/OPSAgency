'use client';

import React, { useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, Send, CheckCircle2, DollarSign, Calendar, FileText } from 'lucide-react';
import { executeRecaptcha } from '../lib/recaptcha';
import { trackEvent } from '../lib/gtag';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  templateName?: string;
}

export default function QuoteModal({ isOpen, onClose, serviceName, templateName }: QuoteModalProps) {
  const { refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('2-3 Weeks');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !requirements) {
      setErr('Please fill in both your budget and project requirements.');
      return;
    }

    setLoading(true);
    setErr('');
    try {
      const recaptchaToken = await executeRecaptcha('quote_request');
      
      await apiRequest('/quotes', {
        method: 'POST',
        body: JSON.stringify({
          serviceName,
          templateName: templateName || undefined,
          budget: parseFloat(budget),
          timeline,
          requirements,
          recaptchaToken
        })
      });

      // Track quote event in Google Analytics
      trackEvent({
        action: 'submit_quote_request',
        category: 'quote',
        label: serviceName,
        value: parseFloat(budget)
      });

      showToast('Quote request submitted successfully.', 'success');
      setSuccess(true);
      await refreshProfile(); // Refresh leads timeline and notifications
    } catch (e: any) {
      setErr(e.message || 'Failed to submit quote request. Please try again.');
      showToast(e.message || 'Failed to submit quote request. Please check input fields.', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gold/15 bg-navy-light/95 shadow-2xl p-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-navy-slate hover:text-gold transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-1">
                CRM Client Intake
              </span>
              <h2 className="text-xl font-bold text-light-gray">
                Request Quote Proposal
              </h2>
              <p className="text-xs text-navy-slate mt-1">
                Let us know your project goals. We will calculate estimated costs and deliverables.
              </p>
            </div>

            {/* Read-only details */}
            <div className="p-3 bg-navy-dark/50 rounded-xl border border-navy-slate/10 space-y-1.5 text-xs text-light-gray">
              <div>
                <span className="text-navy-slate mr-2">Selected Service:</span>
                <strong className="text-gold">{serviceName}</strong>
              </div>
              {templateName && (
                <div>
                  <span className="text-navy-slate mr-2">Matched Template:</span>
                  <strong className="text-gold">{templateName}</strong>
                </div>
              )}
            </div>

            {err && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-xs text-red-400">
                {err}
              </div>
            )}

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Target Budget (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
                <input 
                  type="number" 
                  required
                  min="500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-navy-slate/20 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                />
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Target Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-navy-slate/20 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
              >
                <option value="1-2 Weeks">1 - 2 Weeks (Express)</option>
                <option value="2-3 Weeks">2 - 3 Weeks (Standard)</option>
                <option value="3-4 Weeks">3 - 4 Weeks</option>
                <option value="5-8 Weeks">5 - 8 Weeks</option>
                <option value="8+ Weeks">8+ Weeks (Enterprise)</option>
              </select>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Project Requirements</label>
              <textarea
                required
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe your pages, features, and business objectives..."
                className="w-full px-3 py-2.5 rounded-xl border border-navy-slate/20 bg-white text-xs text-navy placeholder:text-navy-slate/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              />
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gold hover:bg-gold-hover disabled:bg-navy-slate/50 disabled:cursor-not-allowed text-white font-extrabold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="skeleton-box h-4 w-4 rounded-full" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Quote Request
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-gold mx-auto animate-bounce" />
            <h2 className="text-lg font-bold text-light-gray">Quote Request Submitted!</h2>
            <p className="text-xs text-navy-slate max-w-sm mx-auto leading-relaxed">
              Your inquiry has been successfully logged in our CRM. An email notification and a dashboard alert have been dispatched. Our team will review and contact you within 24 business hours.
            </p>
            <button 
              onClick={() => { setSuccess(false); setBudget(''); setRequirements(''); onClose(); }}
              className="px-6 py-2.5 rounded-xl border border-gold/25 text-gold text-xs font-bold hover:bg-navy-dark transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
