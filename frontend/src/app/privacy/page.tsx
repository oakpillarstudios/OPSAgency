'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-6 text-xs text-navy-slate leading-relaxed">
      <h1 className="text-2xl font-bold text-light-gray premium-gradient-text">Privacy Policy</h1>
      <p>Last Updated: July 2026</p>
      
      <p>
        At OakPillar Studios, we respect your privacy. This policy outlines how we handle the personal information collected when you log in via Google OAuth, request pricing estimations, or submit project requirements.
      </p>

      <h2 className="text-sm font-bold text-light-gray">1. Information We Collect</h2>
      <p>
        We collect name, email address, profile photos (provided by Google), company specifications, target budget ranges, timelines, and messages you submit through our estimator wizards or quotation intake sheets.
      </p>

      <h2 className="text-sm font-bold text-light-gray">2. Lead Score Scoring Rules</h2>
      <p>
        To prioritize high-value consultations, our system processes user actions to compute an internal Lead Priority Score (+10 for login, +20 for editing profiles, +40 for scheduling consultations, and +50 for submitting quotes). This information is solely used internally by our administrative CRM agents.
      </p>

      <h2 className="text-sm font-bold text-light-gray">3. Third-party Sharing</h2>
      <p>
        We do not sell, rent, or trade your lead profiles with third-party freelancers or advertisement networks. Every service is fulfilled exclusively in-house.
      </p>
    </div>
  );
}
