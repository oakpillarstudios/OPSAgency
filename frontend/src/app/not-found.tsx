'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Server, Layout } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-sans">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        
        {/* Animated Icon */}
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto animate-pulse">
          <ShieldAlert className="w-8 h-8 text-gold" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-navy premium-gradient-text tracking-tight">
            404 — Lost In Orbit
          </h1>
          <h2 className="text-sm font-bold text-navy-slate">
            The requested digital asset does not exist.
          </h2>
          <p className="text-xs text-navy-slate/85 max-w-sm mx-auto leading-relaxed">
            The URL path is invalid, or the case study project page has been archived by the system administration.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            Home Console
          </Link>
          <Link
            href="/services"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-navy-dark border border-navy-slate/20 text-navy font-bold text-xs tracking-wider uppercase transition-all"
          >
            <Server className="w-4 h-4" />
            Explore Services
          </Link>
        </div>

        <div className="pt-6 text-[10px] text-navy-slate">
          Need direct help? Contact <strong className="text-gold">oakpillarstudios@gmail.com</strong>
        </div>

      </div>
    </div>
  );
}
