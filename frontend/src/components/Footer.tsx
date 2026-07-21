'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, Clock, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const services = [
    { name: 'Portfolio Website', href: '/services/portfolio-website' },
    { name: 'Business Website', href: '/services/business-website' },
    { name: 'CRM Development', href: '/services/crm-development' },
    { name: 'AI Chatbots', href: '/services/ai-chatbot' },
    { name: 'Technical SEO', href: '/services/technical-seo' }
  ];

  const templates = [
    { name: 'Interior Design', href: '/templates/interior-designer' },
    { name: 'Restaurant Cafe', href: '/templates/restaurant' },
    { name: 'Real Estate Builder', href: '/templates/real-estate' },
    { name: 'Medical Clinic', href: '/templates/doctor' }
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Success Stories', href: '/portfolio' },
    { name: 'Latest Blogs', href: '/blog' },
    { name: 'Cost Estimator', href: '/estimator' }
  ];

  const legals = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refund' },
    { name: 'Cookies', href: '/cookies' }
  ];

  return (
    <footer className="w-full bg-navy-dark border-t border-navy-slate/10 pt-16 pb-8 text-navy-slate text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        
        {/* Brand / Logo */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.png" 
              alt="OakPillar Studios Logo" 
              width={140} 
              height={45} 
              className="h-10 w-auto object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>
          <p className="text-xs max-w-sm leading-relaxed">
            We don't simply create websites. We build premium, full stack digital systems that generate real business growth. Engineered for performance, SEO, and long-term support.
          </p>
          <div className="flex items-center gap-3.5 pt-2">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Services Columns */}
        <div className="space-y-3">
          <h4 className="font-bold text-light-gray uppercase tracking-wider text-[10px]">Services</h4>
          <ul className="space-y-2">
            {services.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-gold transition-colors flex items-center gap-0.5">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Templates Marketplace */}
        <div className="space-y-3">
          <h4 className="font-bold text-light-gray uppercase tracking-wider text-[10px]">Templates</h4>
          <ul className="space-y-2">
            {templates.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="hover:text-gold transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-3">
          <h4 className="font-bold text-light-gray uppercase tracking-wider text-[10px]">Contact Info</h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
              <a href="mailto:oakpillarstudios@gmail.com" className="hover:text-gold transition-colors">oakpillarstudios@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
              <a href="tel:+917738049380" className="hover:text-gold transition-colors">+91 77380 49380</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>9:00 AM - 6:00 PM IST</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
              <span className="leading-normal">BKC, Mumbai, MH, India</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-navy-slate/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px]">
          © {currentYear} OakPillar Studios. All rights reserved. Made for premium businesses.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {legals.map((item) => (
            <Link key={item.name} href={item.href} className="hover:text-gold transition-colors text-[10px]">
              {item.name}
            </Link>
          ))}
          <Link href="/admin" className="text-[10px] text-navy-slate/40 hover:text-navy hover:underline transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
