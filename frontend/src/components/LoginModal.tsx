'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import { executeRecaptcha } from '../lib/recaptcha';
import { trackEvent } from '../lib/gtag';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithGoogle, loginWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState('');

  if (!isOpen) return null;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErr('Please fill in both email and password.');
      return;
    }
    
    setIsSubmitting(true);
    setErr('');

    try {
      const recaptchaToken = await executeRecaptcha('login');
      await loginWithEmailAndPassword(email, password, recaptchaToken);
      trackEvent({ action: 'login', category: 'auth', label: 'Credentials' });
      onClose();
    } catch (e: any) {
      setErr(e.response?.message || e.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-navy-slate/10 bg-white shadow-2xl p-8 transition-all duration-300 transform scale-100 hover:shadow-gold/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-navy-slate hover:text-gold transition-colors duration-200 hover:scale-110 active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Image 
            src="/logo.png" 
            alt="OakPillar Studios Logo" 
            width={140} 
            height={44} 
            className="mb-4 h-10 object-contain filter"
            style={{ mixBlendMode: 'multiply' }}
          />
          <h2 className="text-2xl font-bold tracking-tight text-navy">
            Welcome to OakPillar
          </h2>
          <p className="text-sm text-navy-slate mt-1">
            Access your custom client workspace and workspace templates.
          </p>
        </div>

        {/* Perks list */}
        <div className="space-y-2.5 mb-6 bg-navy-dark/40 p-4 rounded-xl border border-navy-slate/5">
          <div className="flex items-start gap-2.5 text-xs text-navy-slate">
            <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span>Save premium service packages and browse template metrics.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-navy-slate">
            <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span>Access client proposal dashboard & workspace timeline.</span>
          </div>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {err}
          </div>
        )}

        <div className="space-y-4">
          {/* Primary Google Login Button */}
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
           process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'PASTE_YOUR_GOOGLE_CLIENT_ID_HERE' && 
           process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== 'mock_google_oauth_client_id_for_dev' && (
            <div className="flex justify-center w-full pb-2 border-b border-navy-slate/10">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setErr('');
                    const credential = credentialResponse.credential;
                    const recaptchaToken = await executeRecaptcha('login');
                    await loginWithGoogle(credential, recaptchaToken);
                    trackEvent({ action: 'login', category: 'auth', label: 'Google OAuth' });
                    onClose();
                  } catch (e: any) {
                    setErr(e.message || 'Google Authentication failed');
                  }
                }}
                onError={() => {
                  setErr('Google Authentication failed. Please verify credentials.');
                }}
                useOneTap
                theme="outline"
                shape="pill"
                size="large"
                width="336"
              />
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-slate uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-sm text-navy placeholder:text-navy-slate/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200 font-sans"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-navy-slate uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-sm text-navy placeholder:text-navy-slate/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-slate/60 hover:text-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-sm shadow-sm transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In with Credentials'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 pt-4 border-t border-navy-slate/10 text-[10px] text-navy-slate text-center flex items-center justify-center gap-1.5 font-medium">
          <Lock className="w-3 h-3 text-gold" />
          <span>Secured connection with JWT protocol.</span>
        </div>

      </div>
    </div>
  );
}
