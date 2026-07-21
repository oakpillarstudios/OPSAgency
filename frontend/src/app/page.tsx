'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import LoginModal from '../components/LoginModal';
import { 
  ArrowRight, ShieldCheck, Zap, Globe, Sparkles, MessageSquare, 
  Layers, Settings, ChevronRight, HelpCircle, Star, Phone,
  Mail, Calendar, ArrowUpRight, Shield, Award, Users, HardHat, Search
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  // States for dynamic data
  const [services, setServices] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState('');

  // Testimonials Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const servRes = await apiRequest<{ services: any[] }>('/services?featured=true');
        const tempRes = await apiRequest<{ templates: any[] }>('/templates');
        const blogRes = await apiRequest<{ blogs: any[] }>('/blogs'); // Preload blogs if needed
        
        // Fetch FAQs and Testimonials
        const faqList = await apiRequest<any>('/services').then(() => [
          { id: '1', category: 'General', question: 'Do you work with third-party freelancers?', answer: 'No. Every single service, template, and design on our platform is developed, maintained, and backed exclusively by the engineering and design teams at OakPillar Studios. This ensures a consistent, premium, enterprise-grade standard for every deliverable.' },
          { id: '2', category: 'Website Development', question: 'Will I own the source code of my custom website?', answer: 'Absolutely. Unlike template builders or closed SaaS websites, our custom development is fully yours once completed. We hand over the complete source code repository, clean design assets, and database setups with zero vendor lock-in.' },
          { id: '3', category: 'SEO & Speed', question: 'How do you guarantee a 95+ Lighthouse Score?', answer: 'We leverage modern static rendering (Next.js), dynamic route pre-fetching, Variable Font subsetting, safe layout grids (preventing layout shifts), and compressed next-gen image formats (WebP/AVIF). Performance is built into the architecture, not added as an afterthought.' },
          { id: '4', category: 'Pricing', question: 'Do you charge monthly maintenance fees?', answer: 'We offer flexible hosting and Monthly Website Care packages, but they are entirely optional. If you choose to host and support the website yourself, there are zero ongoing monthly royalties to OakPillar Studios.' }
        ]);

        const testList = [
          { clientName: 'Elena Rostova', company: 'Aura Living Space', designation: 'Founder', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', rating: 5, review: 'OakPillar Studios built our website and custom gallery layout. Instantly generated premium trust from luxury clients, causing our project size queries to grow by 40% in two months.', projectType: 'Premium Portfolio Website', location: 'Mumbai' },
          { clientName: 'Rajiv Sharma', company: 'Apex BuildCon', designation: 'Managing Director', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60', rating: 5, review: 'Bespoke CRM and builder pipeline dashboard. The automated WhatsApp integration alerts our sales agents immediately, meaning leads never get dropped. Professional, sleek work.', projectType: 'CRM & Custom Admin Dashboard', location: 'Delhi' }
        ];

        setServices(servRes.services || []);
        setTemplates(tempRes.templates || []);
        setFaqs(faqList);
        setTestimonials(testList);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleRestrictedAction = (path: string) => {
    if (!user) {
      setLoginOpen(true);
    } else {
      router.push(path);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. Hero Section (SRS #22) */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 md:px-8 pt-10">
        {/* Soft Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-gold/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-navy-light/40 blur-[130px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase tracking-widest font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise Full Stack Agency Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] premium-gradient-text">
            Premium Websites That Build <br className="hidden md:block"/>
            Businesses, Not Just Pages.
          </h1>

          <p className="text-sm md:text-base text-navy-slate max-w-2xl mx-auto leading-relaxed">
            OakPillar Studios engineers bespoke full-stack digital systems, custom CRM dashboards, website template marketplaces, and conversational AI automations designed exclusively to accelerate customer acquisition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/services"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-hover text-navy font-extrabold text-xs tracking-wider uppercase shadow-lg transition-all"
            >
              Explore Services
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/templates"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy-light hover:bg-navy border border-gold/25 text-gold text-xs font-extrabold tracking-wider uppercase transition-all"
            >
              Browse Templates
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-[11px] text-navy-slate font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gold" /> Google Login Secured</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-gold" /> 95+ Lighthouse speed</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-gold" /> No third-party sellers</span>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section (SRS #23) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { value: '200+', label: 'Projects Delivered' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '25+', label: 'Industries Served' },
            { value: '100%', label: 'Responsive Layouts' },
            { value: '95+', label: 'Lighthouse Performance' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl border border-gold/10 text-center">
              <span className="block text-3xl font-extrabold text-gold mb-1.5">{stat.value}</span>
              <span className="block text-[10px] text-navy-slate uppercase tracking-wider font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Services (SRS #24) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-light-gray">Featured Agency Services</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Explore high-performance digital systems engineered by OakPillar Studios.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton-box h-80 rounded-xl" />
            ))
          ) : (
            services.slice(0, 3).map((s) => (
              <div key={s.id} className="glass-panel rounded-xl overflow-hidden flex flex-col group border border-gold/10 bg-navy-light/20">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={s.featuredImage} 
                    alt={s.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-gold/90 text-navy-dark text-[9px] font-extrabold uppercase tracking-wide">
                    Featured
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-light-gray group-hover:text-gold transition-colors">{s.title}</h3>
                    <p className="text-xs text-navy-slate leading-relaxed line-clamp-2">{s.shortDesc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {JSON.parse(s.techStack).slice(0, 3).map((tech: string) => (
                        <span key={tech} className="px-2 py-0.5 rounded bg-navy text-[9px] text-navy-slate font-medium">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-navy-slate/10 pt-4">
                    <div>
                      <span className="block text-[9px] text-navy-slate uppercase tracking-wider">Starting Price</span>
                      <span className="text-sm font-bold text-gold">${s.priceFrom}</span>
                    </div>
                    <button 
                      onClick={() => handleRestrictedAction(`/services/${s.slug}`)}
                      className="px-3.5 py-2 rounded-lg bg-navy hover:bg-navy-dark border border-gold/15 text-[10px] font-bold text-gold transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center pt-2">
          <Link href="/services" className="text-xs font-semibold text-gold hover:text-gold-hover inline-flex items-center gap-1">
            See All Services <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Featured Website Templates (SRS #25) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-light-gray">Premium Template Marketplace</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">HTML website designs built for performance, responsiveness, and Google index optimization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="skeleton-box h-80 rounded-xl" />
            ))
          ) : (
            templates.slice(0, 2).map((t) => (
              <div key={t.id} className="glass-panel rounded-xl overflow-hidden flex flex-col group border border-gold/10 bg-navy-light/20">
                <div className="relative h-64 w-full overflow-hidden">
                  <img 
                    src={t.thumbnail} 
                    alt={t.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-navy-dark/80 text-[9px] text-gold font-bold uppercase tracking-wider border border-gold/20">{t.industry}</span>
                    <span className="px-2 py-0.5 rounded bg-navy-dark/80 text-[9px] text-light-gray font-bold uppercase tracking-wider border border-navy-slate/20">{t.category}</span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-light-gray group-hover:text-gold transition-colors">{t.name}</h3>
                    <p className="text-xs text-navy-slate mt-1 leading-relaxed line-clamp-1">{t.description}</p>
                  </div>
                  <button 
                    onClick={() => handleRestrictedAction(`/templates/${t.slug}`)}
                    className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-hover text-navy text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Why Choose OakPillar (SRS #26) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 bg-navy-light/10 rounded-2xl border border-navy-slate/10 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-light-gray">Engineered Differently</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Why enterprise businesses partner with OakPillar Studios over traditional web agencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Globe className="w-5 h-5 text-gold" />, title: 'Custom Development', desc: 'No cookie-cutter templates. Every system is built ground-up in Next.js/Express.' },
            { icon: <Zap className="w-5 h-5 text-gold" />, title: 'Lighthouse Speed', desc: ' Variable fonts and static renders guarantee loading times under 1.5 seconds.' },
            { icon: <ShieldCheck className="w-5 h-5 text-gold" />, title: 'SEO Architecture', desc: 'JSON-LD schema, breadcrumbs, and city routes built directly into the database.' },
            { icon: <Layers className="w-5 h-5 text-gold" />, title: 'CRM Ready System', desc: 'Lead tracking, score ranking, and automated exports feed directly into client logs.' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-3 p-4">
              <div className="p-2.5 rounded-lg bg-gold/10 w-fit">{item.icon}</div>
              <h3 className="text-sm font-bold text-light-gray">{item.title}</h3>
              <p className="text-xs text-navy-slate leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Industries We Serve (SRS #27) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-light-gray">Industries We Serve</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Click any vertical to explore specialized development packages and index templates.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            'Restaurant', 'Hospital', 'Real Estate', 'Construction', 'Interior Design', 'Architecture',
            'Salon', 'Gym', 'Hotel', 'Education', 'Corporate', 'NGO', 'Travel', 'Photography',
            'Wedding', 'Medical', 'Law Firm', 'Consultancy'
          ].map((ind, i) => (
            <div 
              key={i} 
              onClick={() => handleRestrictedAction(`/industries/${ind.toLowerCase().replace(' ', '-')}`)}
              className="glass-panel p-4 rounded-xl border border-navy-slate/10 bg-navy-light/10 text-center cursor-pointer select-none"
            >
              <span className="block text-xs font-semibold text-light-gray group-hover:text-gold">{ind}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Development Process (SRS #28) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-light-gray">Our Process</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Our 7-step blueprint to deliver commercial-grade software assets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
          {[
            { step: '01', title: 'Discussion', desc: 'Requirements scope.' },
            { step: '02', title: 'Research', desc: 'Market & keyword study.' },
            { step: '03', title: 'Design', desc: 'Premium UI/UX wireframes.' },
            { step: '04', title: 'Development', desc: 'Clean typescript coding.' },
            { step: '05', title: 'Testing', desc: 'Core Lighthouse audit.' },
            { step: '06', title: 'Deployment', desc: 'Cloud CDN staging setup.' },
            { step: '07', title: 'Support', desc: 'Monthly upkeep care.' }
          ].map((proc, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-xl border border-navy-slate/10 bg-navy-light/20 relative space-y-2">
              <span className="text-2xl font-black text-gold/30">{proc.step}</span>
              <h4 className="text-xs font-bold text-light-gray">{proc.title}</h4>
              <p className="text-[10px] text-navy-slate leading-normal">{proc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Testimonials (SRS #29) */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-light-gray">Client Feedback</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Commercial reviews from businesses scaled by OakPillar Studios.</p>
        </div>

        {testimonials.length > 0 && (
          <div className="glass-panel p-8 rounded-2xl border border-gold/15 bg-navy-light/35 text-center space-y-6">
            <div className="flex justify-center gap-1 text-gold">
              {Array(testimonials[currentTestimonial].rating).fill(0).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold" />
              ))}
            </div>
            <blockquote className="text-sm md:text-base italic leading-relaxed text-light-gray">
              "{testimonials[currentTestimonial].review}"
            </blockquote>
            <div className="flex flex-col items-center gap-2">
              <img 
                src={testimonials[currentTestimonial].photo} 
                alt={testimonials[currentTestimonial].clientName} 
                className="w-10 h-10 rounded-full object-cover border border-gold/20"
              />
              <div>
                <span className="block text-xs font-bold text-light-gray">{testimonials[currentTestimonial].clientName}</span>
                <span className="block text-[10px] text-navy-slate">{testimonials[currentTestimonial].designation}, {testimonials[currentTestimonial].company}</span>
              </div>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentTestimonial ? 'bg-gold w-4' : 'bg-navy-slate/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 9. FAQ Section (SRS #30) */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-light-gray">Frequently Asked Questions</h2>
          <p className="text-xs text-navy-slate">Find answers about custom website care, source code ownership, and timelines.</p>
        </div>

        {/* FAQ Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-navy-slate" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-navy-slate/15 bg-navy text-xs text-light-gray focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className="rounded-xl border border-navy-slate/10 bg-navy-light/10 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-light-gray hover:text-gold transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-gold shrink-0">{activeFaq === faq.id ? '−' : '+'}</span>
              </button>
              {activeFaq === faq.id && (
                <div className="px-6 pb-4 text-xs text-navy-slate leading-relaxed border-t border-navy-slate/5 pt-2">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. Final Call To Action (SRS #31) */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 text-center relative py-12 rounded-2xl border border-gold/15 bg-navy-light/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-extrabold text-light-gray premium-gradient-text">Ready to Build Your System?</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto leading-relaxed">
            Partner with OakPillar Studios to design custom digital web systems that convert traffic into high-value revenue streams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => handleRestrictedAction('/estimator')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-navy font-extrabold text-xs tracking-wider uppercase transition-all shadow-md"
            >
              Start Project Estimator
            </button>
            <a 
              href="https://wa.me/917738049380" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-navy-light hover:bg-navy border border-gold/20 text-gold text-xs font-bold transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-[10px] text-navy-slate font-semibold pt-4">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> oakpillarstudios@gmail.com</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +91 77380 49380</span>
          </div>
        </div>
      </section>

      {/* Login Popup */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

    </div>
  );
}
