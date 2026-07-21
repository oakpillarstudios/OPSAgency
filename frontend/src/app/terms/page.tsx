'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-6 text-xs text-navy-slate leading-relaxed">
      <h1 className="text-2xl font-bold text-light-gray premium-gradient-text">Terms of Service</h1>
      <p>Last Updated: July 2026</p>
      
      <p>
        By browsing the services and templates at OakPillar Studios, you agree to these Terms.
      </p>

      <h2 className="text-sm font-bold text-light-gray">1. Service Delivery</h2>
      <p>
        Every custom website, backend design, or CRM implementation is custom-compiled for the purchasing business. Project delivery follows the timeline milestones detailed in the agreed-upon Statement of Work.
      </p>

      <h2 className="text-sm font-bold text-light-gray">2. Intellectual Property</h2>
      <p>
        Upon successful payment and project completion, we hand over full ownership of the source code repository to the client. The client is free to host, modify, or resell their custom software assets without licensing restrictions.
      </p>

      <h2 className="text-sm font-bold text-light-gray">3. Watermark Protection</h2>
      <p>
        Our preview website templates feature interactive watermark protections to prevent intellectual theft of design sheets. Removal of watermarks prior to purchase is strictly prohibited.
      </p>
    </div>
  );
}
