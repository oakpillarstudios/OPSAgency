'use client';

import React from 'react';

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-6 text-xs text-navy-slate leading-relaxed">
      <h1 className="text-2xl font-bold text-light-gray premium-gradient-text">Cookie Policy</h1>
      <p>Last Updated: July 2026</p>
      
      <p>
        OakPillar Studios uses cookies to improve authentication performance, track visitor sessions, and analyze lead conversion rates.
      </p>

      <h2 className="text-sm font-bold text-light-gray">1. Essential Cookies</h2>
      <p>
        These cookies are necessary to store JWT tokens in localStorage or session cookies, keeping you securely logged in as you browse template designs or estimator wizards.
      </p>

      <h2 className="text-sm font-bold text-light-gray">2. Analytical Cookies</h2>
      <p>
        These help us count unique visits, identify popular services, and compute lead scoring funnel priority counts inside the Admin CRM dashboard.
      </p>
    </div>
  );
}
