'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../lib/api';
import { FileText, Search, Clock, Calendar, ArrowRight } from 'lucide-react';

export default function BlogIndex() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        let query = '';
        const params: string[] = [];
        if (category !== 'all') params.push(`category=${category}`);
        if (search) params.push(`search=${search}`);
        if (params.length > 0) {
          query = '?' + params.join('&');
        }

        const res = await apiRequest<{ blogs: any[] }>(`/blogs${query}`);
        setBlogs(res.blogs || []);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [category, search]);

  const categories = ['CRM', 'SEO', 'Website Design', 'Performance', 'AI', 'Business', 'Automation'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider">
          <FileText className="w-3.5 h-3.5" /> SEO Content Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-light-gray tracking-tight premium-gradient-text">
          OakPillar Studios Blog
        </h1>
        <p className="text-xs text-navy-slate max-w-lg leading-relaxed">
          Evergreen strategy articles, design checklists, and business growth guides. Built to index keywords and scale digital acquisition.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl border border-navy-slate/15 bg-white shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-navy-slate/10 bg-white text-xs text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton-box h-[300px] rounded-xl" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-navy-slate/20 rounded-2xl">
          <FileText className="w-10 h-10 text-gold/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-light-gray">No Articles Found</h3>
          <p className="text-xs text-navy-slate mt-1">Try refining your category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div 
              key={b.id}
              onClick={() => router.push(`/blog/${b.slug}`)}
              className="glass-panel rounded-2xl overflow-hidden border border-gold/10 bg-navy-light/10 group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden bg-navy-dark">
                <img src={b.featuredImg} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-navy-dark/95 border border-gold/20 text-[8px] font-bold text-gold uppercase">
                  {b.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-light-gray group-hover:text-gold transition-colors">{b.title}</h3>
                  <p className="text-xs text-navy-slate leading-relaxed line-clamp-3">{b.excerpt}</p>
                </div>
                <div className="flex items-center justify-between border-t border-navy-slate/10 pt-4 text-[9px] text-navy-slate font-bold">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold" /> {b.readingTime} min read</span>
                  <span className="flex items-center gap-1 text-gold">Read Article <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
