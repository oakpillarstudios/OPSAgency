'use client';

import React from 'react';

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-6 text-xs text-navy-slate leading-relaxed">
      <h1 className="text-2xl font-bold text-light-gray premium-gradient-text">Refund & Cancellation Policy</h1>
      <p>Last Updated: July 2026</p>
      
      <p>
        Because we provide digital assets and custom development services, we enforce strict refund terms.
      </p>

      <h2 className="text-sm font-bold text-light-gray">1. Custom Development Services</h2>
      <p>
        For custom website development, CRM builds, and AI implementations, refunds are handled according to the milestones defined in our contract. Work completed under approved milestones is non-refundable.
      </p>

      <h2 className="text-sm font-bold text-light-gray">2. Website Templates Marketplace</h2>
      <p>
        Since templates are delivered as digital source code downloads, they are non-refundable once the file bundle has been transferred or preview access is unlocked.
      </p>
    </div>
  );
}
