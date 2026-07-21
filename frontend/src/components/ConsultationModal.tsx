'use client';

import React, { useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, Calendar, Clock, Video, Send, CheckCircle2 } from 'lucide-react';
import { executeRecaptcha } from '../lib/recaptcha';
import { trackEvent } from '../lib/gtag';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const { refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [timezone, setTimezone] = useState('GMT+5:30 (India Standard Time)');
  const [contactMethod, setContactMethod] = useState('GOOGLE_MEET');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');

  if (!isOpen) return null;

  // Set minimum date to today
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate || !preferredTime) {
      setErr('Please select both date and time.');
      return;
    }

    setLoading(true);
    setErr('');
    try {
      const recaptchaToken = await executeRecaptcha('consultation_booking');
      
      await apiRequest('/consultation', {
        method: 'POST',
        body: JSON.stringify({
          preferredDate,
          preferredTime,
          timezone,
          contactMethod,
          notes,
          recaptchaToken
        })
      });

      // Track consultation booking in Google Analytics
      trackEvent({
        action: 'book_consultation',
        category: 'consultation',
        label: `${preferredDate} ${preferredTime}`,
      });

      showToast('Consultation scheduled successfully.', 'success');
      setSuccess(true);
      await refreshProfile(); // Refresh dashboard notifications and activities
    } catch (e: any) {
      setErr(e.message || 'Failed to book consultation. Please try again.');
      showToast(e.message || 'Failed to book consultation. Please check input fields.', 'error');
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
                CRM Appointment Booking
              </span>
              <h2 className="text-xl font-bold text-light-gray">
                Book Consultation Meeting
              </h2>
              <p className="text-xs text-navy-slate mt-1">
                Schedule a 1-on-1 strategy meeting with our principal engineers.
              </p>
            </div>

            {err && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-xs text-red-400">
                {err}
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
                <input 
                  type="date" 
                  required
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-navy-slate/20 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Preferred Time Slot (IST)</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-navy-slate/20 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
              >
                <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                <option value="03:00 PM">03:00 PM - 04:00 PM</option>
                <option value="04:00 PM">04:00 PM - 05:00 PM</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Target Timezone</label>
              <input
                type="text"
                required
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-navy-slate/20 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
              />
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Preferred Contact Channel</label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-navy-slate/20 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
              >
                <option value="GOOGLE_MEET">Google Meet Video Call</option>
                <option value="ZOOM">Zoom Video Call</option>
                <option value="WHATSAPP">WhatsApp Audio / Video</option>
                <option value="PHONE">Direct Cellular Phone Call</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-navy-slate mb-1">Brief Project Notes (Optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any existing website URLs, design styles, or goals..."
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
                  <Video className="w-4 h-4" />
                  Confirm Consultation
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-gold mx-auto animate-bounce" />
            <h2 className="text-lg font-bold text-light-gray">Consultation Scheduled!</h2>
            <p className="text-xs text-navy-slate max-w-sm mx-auto leading-relaxed">
              Your meeting request has been logged in our CRM and your calendar invite is queued. An executive will confirm the meeting link shortly.
            </p>
            <button 
              onClick={() => { setSuccess(false); setNotes(''); onClose(); }}
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
