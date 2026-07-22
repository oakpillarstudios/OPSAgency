'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../lib/api';
import { X, Search, FileText, Layout, Server, Landmark } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  services: any[];
  templates: any[];
  blogs: any[];
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ services: [], templates: [], blogs: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ services: [], templates: [], blogs: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ services: [], templates: [], blogs: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch services
        const servRes = await apiRequest<{ services: any[] }>(`/services?search=${query}`);
        // Fetch templates
        const tempRes = await apiRequest<{ templates: any[] }>(`/templates?search=${query}`);
        // Fetch blogs
        const blogRes = await apiRequest<{ blogs: any[] }>(`/blogs?search=${query}`);

        setResults({
          services: servRes.services || [],
          templates: tempRes.templates || [],
          blogs: blogRes.blogs || []
        });
      } catch (err) {
        console.error('Search fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const hasResults = results.services.length > 0 || results.templates.length > 0 || results.blogs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-4 bg-navy-dark/95 backdrop-blur-lg">
      <div className="w-full max-w-2xl mt-10 md:mt-20 overflow-hidden flex flex-col h-[70vh] rounded-2xl border border-gold/15 bg-navy-light/95 shadow-2xl p-6">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-navy-slate/10 pb-4 mb-4">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search services, templates, blogs, or industries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-light-gray placeholder-navy-slate text-base focus:outline-none"
          />
          <button onClick={onClose} className="text-navy-slate hover:text-gold transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {loading ? (
            <div className="space-y-4 py-8">
              <div className="skeleton-box h-10 w-full rounded" />
              <div className="skeleton-box h-8 w-2/3 rounded" />
              <div className="skeleton-box h-8 w-1/2 rounded" />
            </div>
          ) : query.trim() === '' ? (
            <div className="text-center py-12 text-navy-slate text-sm">
              <Search className="w-8 h-8 text-gold/30 mx-auto mb-2" />
              <p>Type a keyword to discover services and templates</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-sm mx-auto">
                {['CRM', 'Next.js', 'E-commerce', 'AI Chatbot', 'Restaurant'].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setQuery(kw)}
                    className="px-2.5 py-1 rounded bg-navy text-xs hover:border-gold/30 hover:bg-navy-dark border border-navy-slate/10 transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-12 text-navy-slate text-sm">
              <p>No results found matching "{query}"</p>
              <button 
                onClick={() => navigateTo('/contact')}
                className="mt-4 text-xs font-bold text-gold underline hover:text-gold-hover transition-colors"
              >
                Inquire for custom solution
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Services Results */}
              {results.services.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold mb-2 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" /> Services
                  </h3>
                  <div className="space-y-1.5">
                    {results.services.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => navigateTo(`/services/${s.slug}`)}
                        className="p-3 rounded-lg bg-navy/40 hover:bg-navy border border-transparent hover:border-gold/10 cursor-pointer flex justify-between items-center transition-all group"
                      >
                        <div>
                          <span className="text-sm font-semibold text-light-gray group-hover:text-gold transition-colors">{s.title}</span>
                          <span className="text-xs text-navy-slate block line-clamp-1">{s.shortDesc}</span>
                        </div>
                        <span className="text-xs font-semibold text-gold">From ${s.priceFrom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Templates Results */}
              {results.templates.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold mb-2 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5" /> HTML Templates
                  </h3>
                  <div className="space-y-1.5">
                    {results.templates.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => navigateTo(`/templates/${t.slug}`)}
                        className="p-3 rounded-lg bg-navy/40 hover:bg-navy border border-transparent hover:border-gold/10 cursor-pointer flex justify-between items-center transition-all group"
                      >
                        <div>
                          <span className="text-sm font-semibold text-light-gray group-hover:text-gold transition-colors">{t.name}</span>
                          <span className="text-xs text-navy-slate block">{t.industry} ({t.technology})</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-gold/10 text-gold text-[10px] font-bold">SEO Ready</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs Results */}
              {results.blogs.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Blog CMS Articles
                  </h3>
                  <div className="space-y-1.5">
                    {results.blogs.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => navigateTo(`/blog/${b.slug}`)}
                        className="p-3 rounded-lg bg-navy/40 hover:bg-navy border border-transparent hover:border-gold/10 cursor-pointer flex justify-between items-center transition-all group"
                      >
                        <div>
                          <span className="text-sm font-semibold text-light-gray group-hover:text-gold transition-colors">{b.title}</span>
                          <span className="text-xs text-navy-slate block line-clamp-1">{b.excerpt}</span>
                        </div>
                        <span className="text-xs text-navy-slate shrink-0">{b.readingTime} min read</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
