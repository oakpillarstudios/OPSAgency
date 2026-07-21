'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../lib/api';
import { ArrowLeft, Clock, Calendar, User, FileText, AlertCircle } from 'lucide-react';

interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImg: string;
  author: string;
  category: string;
  readingTime: number;
  views: number;
  publishedDate: string;
}

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await apiRequest<{ blog: BlogData }>(`/blogs/${slug}`);
        setBlog(res.blog);
      } catch (err: any) {
        console.error('Fetch blog detail error:', err);
        setError(err.message || 'Failed to load article details.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchBlogDetail();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-8">
        <div className="skeleton-box h-10 w-2/3 rounded animate-pulse" />
        <div className="skeleton-box h-[300px] w-full rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-light-gray">Article Not Found</h2>
        <p className="text-xs text-navy-slate">{error || 'The requested blog post does not exist.'}</p>
        <button onClick={() => router.push('/blog')} className="px-4 py-2 rounded-lg bg-navy border border-gold/25 text-xs text-gold font-bold">
          Back to Blog List
        </button>
      </div>
    );
  }

  // Schema structured markup (complying with SRS #199)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blog.title,
    'image': blog.featuredImg,
    'author': {
      '@type': 'Person',
      'name': blog.author
    },
    'datePublished': blog.publishedDate,
    'description': blog.excerpt
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push('/blog')} 
          className="flex items-center gap-1.5 text-xs font-semibold text-navy-slate hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog List
        </button>

        {/* Heading */}
        <div className="space-y-4">
          <span className="px-2.5 py-0.5 rounded bg-gold/15 text-gold text-[9px] font-bold uppercase tracking-wider">
            {blog.category}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-light-gray tracking-tight leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-navy-slate border-b border-navy-slate/10 pb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold" /> {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold" /> {new Date(blog.publishedDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold" /> {blog.readingTime} min read
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-64 md:h-[400px] w-full rounded-2xl overflow-hidden border border-navy-slate/10 shadow-lg">
          <img src={blog.featuredImg} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Content body */}
        <div className="text-sm text-navy-slate leading-relaxed space-y-6 pt-4 text-justify whitespace-pre-line">
          {blog.content}
        </div>

      </article>
    </>
  );
}
