'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import LoginModal from '../components/LoginModal';
import { 
  ArrowRight, ShieldCheck, Zap, Globe, Sparkles, MessageSquare, 
  Layers, Settings, ChevronRight, ChevronLeft, HelpCircle, Star, Phone,
  Mail, Calendar, ArrowUpRight, Shield, Award, Users, HardHat, Search
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

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
        {/* Soft Background Gradients & Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(170,139,44,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(170,139,44,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
          <div className="absolute top-1/10 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-gold/5 to-transparent blur-[140px]" />
          <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-gold/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-navy-light/20 blur-[130px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center z-10 space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase tracking-widest font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise Full Stack Agency Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] premium-gradient-text animate-slide-up">
            Premium Websites That Build <br className="hidden md:block"/>
            Businesses, Not Just Pages.
          </h1>

          <p className="text-sm md:text-base text-navy-slate max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            OakPillar Studios engineers bespoke full-stack digital systems, custom CRM dashboards, website template marketplaces, and conversational AI automations designed exclusively to accelerate customer acquisition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up delay-200">
            <Link 
              href="/services"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 btn-gold uppercase tracking-wider text-xs"
            >
              Explore Services
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/templates"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 btn-white uppercase tracking-wider text-xs"
            >
              Browse Templates
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-[11px] text-navy-slate font-bold uppercase tracking-wider bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-navy-slate/5 max-w-2xl mx-auto animate-slide-up delay-300">
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
            <div key={i} className="bg-white p-6 rounded-2xl border border-navy-slate/10 shadow-sm text-center card-hover">
              <span className="block text-3xl font-black text-gold mb-1.5">{stat.value}</span>
              <span className="block text-[10px] text-navy-slate uppercase tracking-wider font-bold">{stat.label}</span>
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
              <div key={s.id} className="bg-white border border-navy-slate/10 shadow-sm rounded-2xl overflow-hidden flex flex-col group card-hover">
                <div className="relative h-48 w-full overflow-hidden img-zoom-container bg-navy-dark">
                  <Image 
                    src={s.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'} 
                    alt={s.title} 
                    width={500}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-gold text-white text-[9px] font-black uppercase tracking-wide">
                    Featured
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-navy group-hover:text-gold transition-colors">{s.title}</h3>
                    <p className="text-xs text-navy-slate leading-relaxed line-clamp-2">{s.shortDesc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {JSON.parse(s.techStack).slice(0, 3).map((tech: string) => (
                        <span key={tech} className="px-2.5 py-0.5 rounded-lg bg-navy-dark text-[9px] text-navy font-bold">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-navy-slate/5 pt-4">
                    <div>
                      <span className="block text-[9px] text-navy-slate uppercase tracking-wider font-bold">Starting Price</span>
                      <span className="text-sm font-black text-gold">${s.priceFrom}</span>
                    </div>
                    <button 
                      onClick={() => handleRestrictedAction(`/services/${s.slug}`)}
                      className="btn-white text-[10px] px-4 py-2 cursor-pointer"
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
          <Link href="/services" className="text-xs font-bold text-gold hover:text-gold-hover inline-flex items-center gap-1">
            See All Services <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Featured Website Templates (SRS #25) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy">Premium Template Marketplace</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">HTML website designs built for performance, responsiveness, and Google index optimization.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="skeleton-box h-80 rounded-xl" />
            ))
          ) : (
            templates.slice(0, 2).map((t) => (
              <div key={t.id} className="bg-white border border-navy-slate/10 shadow-sm rounded-2xl overflow-hidden flex flex-col group card-hover">
                <div className="relative h-64 w-full overflow-hidden img-zoom-container bg-navy-dark">
                  <Image 
                    src={t.thumbnail || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60'} 
                    alt={t.name} 
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                    <span className="px-2.5 py-0.5 rounded bg-navy-dark text-[9px] text-gold font-extrabold uppercase tracking-wider border border-gold/25">{t.industry}</span>
                    <span className="px-2.5 py-0.5 rounded bg-navy-dark text-[9px] text-white font-extrabold uppercase tracking-wider border border-navy-slate/20">{t.category}</span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="text-base font-bold text-navy group-hover:text-gold transition-colors">{t.name}</h3>
                    <p className="text-xs text-navy-slate mt-1 leading-relaxed line-clamp-1">{t.description}</p>
                  </div>
                  <button 
                    onClick={() => handleRestrictedAction(`/templates/${t.slug}`)}
                    className="btn-gold text-[10px] px-5 py-2.5 cursor-pointer shrink-0"
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
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 bg-slate-50 rounded-3xl border border-navy-slate/10 space-y-12 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy">Engineered Differently</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Why enterprise businesses partner with OakPillar Studios over traditional web agencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Globe className="w-5 h-5 text-gold" />, title: 'Custom Development', desc: 'No cookie-cutter templates. Every system is built ground-up in Next.js/Express.' },
            { icon: <Zap className="w-5 h-5 text-gold" />, title: 'Lighthouse Speed', desc: 'Variable fonts and static renders guarantee loading times under 1.5 seconds.' },
            { icon: <ShieldCheck className="w-5 h-5 text-gold" />, title: 'SEO Architecture', desc: 'JSON-LD schema, breadcrumbs, and city routes built directly into the database.' },
            { icon: <Layers className="w-5 h-5 text-gold" />, title: 'CRM Ready System', desc: 'Lead tracking, score ranking, and automated exports feed directly into client logs.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-navy-slate/10 shadow-sm card-hover space-y-4">
              <div className="p-3 rounded-xl bg-gold/10 w-fit">{item.icon}</div>
              <h3 className="text-sm font-bold text-navy">{item.title}</h3>
              <p className="text-xs text-navy-slate leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Industries We Serve (SRS #27) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy">Industries We Serve</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Click any vertical to explore specialized development packages and index templates.</p>
        </div>

        <div className="relative group">
          {/* Left Arrow */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-2.5 rounded-full bg-white border border-navy-slate/10 shadow-lg text-navy hover:text-gold transition-all duration-200 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slider Container */}
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              'Restaurant', 'Hospital', 'Real Estate', 'Construction', 'Interior Design', 'Architecture',
              'Salon', 'Gym', 'Hotel', 'Education', 'Corporate', 'NGO', 'Travel', 'Photography',
              'Wedding', 'Medical', 'Law Firm', 'Consultancy'
            ].map((ind, i) => (
              <div 
                key={i} 
                onClick={() => handleRestrictedAction(`/industries/${ind.toLowerCase().replace(' ', '-')}`)}
                className="flex-shrink-0 w-44 snap-start p-6 rounded-2xl border border-navy-slate/10 bg-white hover:border-gold/30 hover:shadow-md cursor-pointer select-none text-center transition-all duration-200 card-hover"
              >
                <span className="block text-xs font-bold text-navy">{ind}</span>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-2.5 rounded-full bg-white border border-navy-slate/10 shadow-lg text-navy hover:text-gold transition-all duration-200 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7. Development Process (SRS #28) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-10 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy">Our Process</h2>
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
            <div key={idx} className="bg-white p-5 rounded-2xl border border-navy-slate/10 shadow-sm relative space-y-2 card-hover">
              <span className="text-2xl font-black text-gold/30">{proc.step}</span>
              <h4 className="text-xs font-bold text-navy">{proc.title}</h4>
              <p className="text-[10px] text-navy-slate leading-normal">{proc.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/5 to-gold/20 rounded-b-2xl" />
            </div>
          ))}
        </div>
      </section>

      {/* 8. Testimonials (SRS #29) */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy">Client Feedback</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto">Commercial reviews from businesses scaled by OakPillar Studios.</p>
        </div>

        {testimonials.length > 0 && (
          <div className="relative group">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-navy-slate/10 shadow-md text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-4 left-6 text-7xl font-serif text-gold/10 pointer-events-none select-none">“</div>
              <div className="flex justify-center gap-1 text-gold">
                {Array(testimonials[currentTestimonial].rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="text-sm md:text-base italic leading-relaxed text-navy max-w-3xl mx-auto relative z-10">
                "{testimonials[currentTestimonial].review}"
              </blockquote>
              <div className="flex flex-col items-center gap-3">
                <Image 
                  src={testimonials[currentTestimonial].photo} 
                  alt={testimonials[currentTestimonial].clientName} 
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                />
                <div>
                  <span className="block text-xs font-black text-navy">{testimonials[currentTestimonial].clientName}</span>
                  <span className="block text-[10px] text-navy-slate font-bold uppercase tracking-wider">{testimonials[currentTestimonial].designation}, {testimonials[currentTestimonial].company}</span>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 pt-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentTestimonial ? 'bg-gold w-5' : 'bg-navy-slate/20 hover:bg-navy-slate/40'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Carousel Controls */}
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-navy-slate/10 shadow-lg text-navy hover:text-gold transition-all duration-200 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-navy-slate/10 shadow-lg text-navy hover:text-gold transition-all duration-200 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 9. FAQ Section (SRS #30) */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy">Frequently Asked Questions</h2>
          <p className="text-xs text-navy-slate">Find answers about custom website care, source code ownership, and timelines.</p>
        </div>

        {/* FAQ Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-4 w-4 h-4 text-navy-slate" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-navy-slate/15 bg-white text-xs text-navy focus:outline-none focus:border-gold transition-colors shadow-sm"
          />
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className="rounded-2xl border border-navy-slate/10 bg-white overflow-hidden transition-all duration-300 shadow-sm hover:border-gold/30 hover:shadow-md"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-navy hover:text-gold transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-gold shrink-0 text-base font-bold">{activeFaq === faq.id ? '−' : '+'}</span>
              </button>
              {activeFaq === faq.id && (
                <div className="px-6 pb-5 text-xs text-navy-slate leading-relaxed border-t border-navy-slate/5 pt-3 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. Final Call To Action (SRS #31) */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 text-center relative py-16 rounded-3xl border border-navy-slate/10 bg-white shadow-xl overflow-hidden animate-fade-in">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(170,139,44,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(170,139,44,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-extrabold text-navy premium-gradient-text">Ready to Build Your System?</h2>
          <p className="text-xs text-navy-slate max-w-md mx-auto leading-relaxed">
            Partner with OakPillar Studios to design custom digital web systems that convert traffic into high-value revenue streams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => handleRestrictedAction('/estimator')}
              className="w-full sm:w-auto px-8 py-4 btn-gold uppercase tracking-wider text-xs shadow-md"
            >
              Start Project Estimator
            </button>
            <a 
              href="https://wa.me/917738049380" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4 btn-white text-xs uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4 text-gold" />
              WhatsApp Us
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] text-navy-slate font-bold uppercase tracking-wider pt-4">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gold" /> oakpillarstudios@gmail.com</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gold" /> +91 77380 49380</span>
          </div>
        </div>
      </section>

      {/* Login Popup */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

    </div>
  );
}
