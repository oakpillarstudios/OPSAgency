import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany({});
  await prisma.contactRequest.deleteMany({});
  await prisma.analytics.deleteMany({});
  await prisma.websiteSettings.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.savedTemplate.deleteMany({});
  await prisma.savedService.deleteMany({});
  await prisma.template.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Default Website Settings
  await prisma.websiteSettings.create({
    data: {
      logo: '/logo.png',
      favicon: '/favicon.ico',
      companyName: 'OakPillar Studios',
      email: 'hello@oakpillar.com',
      phone: '+91 98765 43210',
      whatsApp: 'https://wa.me/919876543210',
      address: 'OakPillar Towers, BKC, Mumbai, MH, India',
      businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM IST',
      footerText: '© 2026 OakPillar Studios. All rights reserved.',
      announcementBar: 'Unlock Premium Custom Web Development. Book a Consultation Today!',
      socialLinks: JSON.stringify({
        linkedin: 'https://linkedin.com/company/oakpillar',
        instagram: 'https://instagram.com/oakpillar',
        facebook: 'https://facebook.com/oakpillar',
        twitter: 'https://twitter.com/oakpillar',
        github: 'https://github.com/oakpillar'
      }),
      themeColors: JSON.stringify({
        primary: '#0A192F',
        secondary: '#D4AF37',
        background: '#020C1B',
        surface: '#112240',
        text: '#F8F9FA'
      }),
      defaultSeo: JSON.stringify({
        title: 'OakPillar Studios | Premium Enterprise Full Stack Agency',
        description: 'OakPillar Studios develops custom enterprise-grade websites, web apps, CRM portals, and AI systems. Built for performance, SEO, and business growth.',
        keywords: 'Web Development, Custom CRM, AI Chatbots, Next.js Developer, Enterprise Software'
      })
    }
  });

  // 3. Create Service Categories
  const webDevCat = await prisma.serviceCategory.create({
    data: { name: 'Website Development', slug: 'website-development' }
  });
  const customSoftwareCat = await prisma.serviceCategory.create({
    data: { name: 'Custom Software & Dashboards', slug: 'custom-software' }
  });
  const aiCat = await prisma.serviceCategory.create({
    data: { name: 'AI Solutions & Automation', slug: 'ai-automation' }
  });
  const seoCat = await prisma.serviceCategory.create({
    data: { name: 'SEO & Performance Optimization', slug: 'seo-performance' }
  });

  // 4. Create Services
  // Category: Website Development
  const serviceData = [
    {
      categoryId: webDevCat.id,
      slug: 'portfolio-website',
      title: 'Premium Portfolio Website',
      shortDesc: 'A high-end, responsive portfolio showcase tailored for creatives, interior designers, and architects.',
      longDesc: 'Elevate your personal brand with an outstanding portfolio website designed to showcase your craft. We focus on visual elegance, fluid animations, and mobile responsiveness to leave a premium impression on high-profile clients.',
      features: JSON.stringify([
        'Custom interactive project gallery',
        'Mobile-first responsive grids',
        'SEO-first semantic structure',
        'Light / Dark Mode transition support',
        'Contact form integration & activity logs'
      ]),
      timeline: '2 - 3 Weeks',
      priceFrom: 1200,
      priceTo: 2500,
      featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['Next.js', 'Tailwind CSS', 'Framer Motion', 'Prisma']),
      popular: false,
      featured: true
    },
    {
      categoryId: webDevCat.id,
      slug: 'business-website',
      title: 'Corporate Business Website',
      shortDesc: 'Stunning business websites engineered for conversion, performance, and search engine visibility.',
      longDesc: 'Establish your industry authority. We build custom multi-page business websites with fast page speeds, custom typography, structured schemas, and integrated contact tools that drive client acquisition.',
      features: JSON.stringify([
        'Up to 10 customized landing pages',
        'Automated SEO meta-tag generation',
        'Lead capture integration with CRM pipeline',
        'Lighthouse score optimization (95+)',
        'SSL and secure CDN setup'
      ]),
      timeline: '3 - 4 Weeks',
      priceFrom: 2200,
      priceTo: 4500,
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL']),
      popular: true,
      featured: true
    },
    {
      categoryId: webDevCat.id,
      slug: 'ecommerce-development',
      title: 'High-Performance E-commerce',
      shortDesc: 'Scalable custom shopping carts and marketplaces designed for seamless checkout and high conversion.',
      longDesc: 'Expand your retail footprint. Our custom e-commerce applications feature lightning-fast product filtering, secure inventory management, smooth cart transitions, and payment gate-way integrations that maximize customer spend.',
      features: JSON.stringify([
        'Custom catalog with dynamic search',
        'Secure multi-gateway payment integration',
        'Admin inventory & order dashboard',
        'Automated customer invoice generation',
        'Cart abandonment re-engagement trigger'
      ]),
      timeline: '5 - 8 Weeks',
      priceFrom: 4500,
      priceTo: 12000,
      featuredImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['React', 'Node.js', 'Express', 'MySQL', 'Stripe']),
      popular: false,
      featured: false
    },
    // Category: Custom Software
    {
      categoryId: customSoftwareCat.id,
      slug: 'crm-development',
      title: 'Custom CRM Development',
      shortDesc: 'Tailor-made Customer Relationship Management systems built around your specific business workflow.',
      longDesc: 'Ditch generic spreadsheets. We develop bespoke CRM software that automates lead assignment, records user activities, generates sales pipelines, tracks meetings, and exports analytics to keep your team operating at peak efficiency.',
      features: JSON.stringify([
        'Drag-and-drop lead pipeline columns',
        'Activity feed audit log with timestamps',
        'Secure JWT authorization & role access',
        'One-click Excel / CSV export functionality',
        'Integration with email and WhatsApp alerts'
      ]),
      timeline: '6 - 10 Weeks',
      priceFrom: 6000,
      priceTo: 15000,
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['Express.js', 'TypeScript', 'Prisma', 'React', 'Chart.js']),
      popular: true,
      featured: true
    },
    {
      categoryId: customSoftwareCat.id,
      slug: 'admin-panel-development',
      title: 'Enterprise Admin Dashboards',
      shortDesc: 'Premium dashboard systems to manage business data, content libraries, and user permissions.',
      longDesc: 'Centralize your business operations. Our custom admin panels feature rich analytics charts, drag-and-drop widgets, media library folders, permission role overrides, and database backups with zero loading latency.',
      features: JSON.stringify([
        'Interactive charts using Recharts/ChartJS',
        'Centralized media asset manager',
        'Granular role-based user privileges',
        'Database backup & restore triggers',
        'Fast virtualized tables for large rows'
      ]),
      timeline: '4 - 6 Weeks',
      priceFrom: 3500,
      priceTo: 8000,
      featuredImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'Zustand', 'Node.js', 'MySQL']),
      popular: false,
      featured: false
    },
    // Category: AI Solutions
    {
      categoryId: aiCat.id,
      slug: 'ai-chatbot',
      title: 'Intelligent AI Chatbots',
      shortDesc: 'Automate sales and support with custom chatbots trained on your internal business documents.',
      longDesc: 'Provide 24/7 answers. We design and integrate conversational AI assistants that capture lead info, answer service FAQs, recommend website templates, and schedule Zoom calls without hallucinating.',
      features: JSON.stringify([
        'Custom knowledge-base vector training',
        'Lead qualification & details capture flow',
        'Instant handoff to human agents alert',
        'Secure API token logs and monitoring',
        'Embeddable widget for web and WhatsApp'
      ]),
      timeline: '3 - 5 Weeks',
      priceFrom: 2500,
      priceTo: 6000,
      featuredImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['OpenAI API', 'LangChain', 'Node.js', 'Express', 'React']),
      popular: true,
      featured: true
    },
    {
      categoryId: aiCat.id,
      slug: 'whatsapp-automation',
      title: 'WhatsApp Marketing Automation',
      shortDesc: 'Set up instant customer alerts, quote notifications, and automated consultation reminders.',
      longDesc: 'Meet clients where they are. We configure robust WhatsApp messaging pipelines that trigger instant project status notifications, consultation confirmations, and follow-up templates that double response rates.',
      features: JSON.stringify([
        'WhatsApp Business API setup',
        'Configurable automated reply templates',
        'Lead score trigger sync with CRM status',
        'Anti-spam pacing & queuing log',
        'One-click manual chat overrides'
      ]),
      timeline: '2 - 4 Weeks',
      priceFrom: 1800,
      priceTo: 4000,
      featuredImage: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['WhatsApp API', 'Node.js', 'Express', 'Prisma']),
      popular: false,
      featured: false
    },
    // Category: SEO
    {
      categoryId: seoCat.id,
      slug: 'technical-seo',
      title: 'Technical SEO & Speed Audit',
      shortDesc: 'Maximize your search visibility and hit 100% Core Web Vitals and Lighthouse scores.',
      longDesc: 'Stop losing traffic to slow loads. We audit and rebuild your page assets, configure server caching, set up variable font subsets, and apply JSON-LD schemas to make Google reward your site with Page 1 rankings.',
      features: JSON.stringify([
        'Lighthouse speed optimization to 95+',
        'Cumulative Layout Shift (CLS) reduction',
        'Automated schema JSON-LD generation',
        'Google Search Console indexing setup',
        'Robots.txt & XML sitemaps configuration'
      ]),
      timeline: '1 - 2 Weeks',
      priceFrom: 1000,
      priceTo: 3000,
      featuredImage: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop&q=60',
      techStack: JSON.stringify(['Google Search Console', 'Lighthouse', 'Next.js', 'Node.js']),
      popular: false,
      featured: true
    }
  ];

  for (const s of serviceData) {
    await prisma.service.create({ data: s });
  }

  // 5. Create Templates
  const templateData = [
    {
      slug: 'interior-designer',
      name: 'Aura Design Template',
      category: 'Interior Design',
      industry: 'Interior Design',
      description: 'A luxurious design with gorgeous project carousels, soft typography, and inline consultation bookings.',
      technology: 'Next.js, Tailwind, Framer Motion',
      primaryColor: 'Soft Beige & Charcoal',
      thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=60'
      ]),
      responsive: true,
      seoReady: true,
      perfScore: 99,
      accessScore: 100
    },
    {
      slug: 'restaurant',
      name: 'Gusto Bistro Template',
      category: 'Restaurant',
      industry: 'Restaurant',
      description: 'A dynamic dark-mode layout with smooth menu accordion, integrated reservation widget, and responsive map footer.',
      technology: 'Next.js, CSS variables',
      primaryColor: 'Gold & Deep Obsidian',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60'
      ]),
      responsive: true,
      seoReady: true,
      perfScore: 98,
      accessScore: 100
    },
    {
      slug: 'real-estate',
      name: 'Apex Realty Template',
      category: 'Real Estate',
      industry: 'Real Estate',
      description: 'Clean design with filtering maps, property layout tables, brochures download capture, and agents grid.',
      technology: 'React, Tailwind, Node.js',
      primaryColor: 'Deep Navy & White',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60'
      ]),
      responsive: true,
      seoReady: true,
      perfScore: 96,
      accessScore: 100
    },
    {
      slug: 'doctor',
      name: 'HealPoint Clinic Template',
      category: 'Medical',
      industry: 'Medical',
      description: 'Trustworthy corporate layout with doctors directory, patient portal placeholder, and direct Google Calendar booking.',
      technology: 'Next.js, TypeScript',
      primaryColor: 'Emerald Green & Light Silver',
      thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60'
      ]),
      responsive: true,
      seoReady: true,
      perfScore: 99,
      accessScore: 100
    }
  ];

  for (const t of templateData) {
    await prisma.template.create({ data: t });
  }

  // 6. Create Blog Articles
  const blogData = [
    {
      slug: 'why-every-business-needs-crm',
      title: 'Why Every Business Needs a Custom CRM in 2025',
      excerpt: 'Discover why standard spreadsheets fail to scale customer acquisition, and how a custom CRM keeps leads warm with automated WhatsApp alerts.',
      content: 'Spreadsheets are great for organizing lists when you start out. But once you have multiple channels (forms, search ads, WhatsApp, email referrals), manual lead tracking breaks down. Leads slip through the cracks, response times lag, and sales representatives lose context of previous conversations.\n\nA custom Customer Relationship Management (CRM) system solves this by automatically logging every contact submission, quote proposal, and appointment booking into a centralized dashboard. Plus, by integrating automated WhatsApp alerts, your sales team gets notified instantly, reducing time-to-first-contact to under 5 minutes.',
      featuredImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
      author: 'Vikram Mehta',
      category: 'CRM',
      readingTime: 5,
      views: 124,
      status: 'PUBLISHED'
    },
    {
      slug: 'technical-seo-checklist-web-apps',
      title: 'The Ultimate Technical SEO Checklist for Modern Web Apps',
      excerpt: 'From JSON-LD schema markup to dynamic sitemaps and Core Web Vitals, here is your definitive technical SEO audit guide.',
      content: 'Building a beautiful website is only half the battle. If search engines can’t crawl, render, and index your content, it won’t rank. Modern single-page applications often suffer from blank initial renders that Googlebot struggles to understand.\n\nBy leveraging Server-Side Rendering (SSR) or Static Site Generation (SSG) in frameworks like Next.js, you ensure search engines receive complete HTML on request. Key components of a successful technical SEO setup include:\n1. Structured data (JSON-LD Organization, LocalBusiness, and FAQ schemas).\n2. Self-referencing canonical URLs to avoid duplicate content penalties.\n3. Optimizing Core Web Vitals, specifically targeting First Contentful Paint (FCP) under 1.5 seconds.',
      featuredImg: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop&q=60',
      author: 'Elena Rostova',
      category: 'SEO',
      readingTime: 8,
      views: 312,
      status: 'PUBLISHED'
    },
    {
      slug: 'restaurant-website-design-reservation-guide',
      title: 'Restaurant Website Design: A Guide to Dynamic Reservations',
      excerpt: 'How high-end bistros and cafes use responsive menus, integrated maps, and interactive table bookings to double local reservations.',
      content: 'A restaurant website shouldn’t just be a PDF of your menu. Guests visit your site to find your address, view your food aesthetics, and book tables. If they encounter a clunky layout or an unreadable menu download, they will go elsewhere.\n\nModern restaurant sites should feature responsive menus, local schema coordinates, and direct table reservation components. Optimizing the mobile checkout or booking experience is critical, as more than 70% of restaurant search volume comes from mobile devices.',
      featuredImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
      author: 'Elena Rostova',
      category: 'Website Design',
      readingTime: 4,
      views: 89,
      status: 'PUBLISHED'
    },
    {
      slug: 'optimize-interior-design-portfolio-leads',
      title: 'How to Optimize Interior Design Portfolios for High-Value Leads',
      excerpt: 'Case study on how optimizing image load speeds and using structured schemas increased luxury designer inquiries by 40%.',
      content: 'Interior design is inherently visual. Portfolios contain heavy, high-resolution photographs of spaces. Without proper optimization, these images drag down page performance, frustrating high-intent luxury clients.\n\nBy utilizing next-gen image compression formats (like WebP or AVIF), dynamic lazy loading, and subsetting custom fonts, you can showcase gorgeous galleries without compromising on performance. Pairing this with clean project descriptions increases organic search visibility.',
      featuredImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60',
      author: 'Elena Rostova',
      category: 'Performance',
      readingTime: 6,
      views: 145,
      status: 'PUBLISHED'
    },
    {
      slug: 'lighthouse-performance-score-100-guide',
      title: 'Google Lighthouse Performance Guide: Achieving 100% Scores',
      excerpt: 'Step-by-step techniques to optimize Next.js rendering, defer scripts, subset fonts, and compile next-gen WebP images.',
      content: 'Google uses page speed as a primary ranking signal. A slow site increases bounce rates and reduces conversions. Achieving a 100% Lighthouse score requires optimizing every aspect of your asset pipeline.\n\nKey steps include deferring non-essential scripts, subsetting and pre-loading custom typography, compressing media assets, and avoiding layout shifts (CLS) by declaring explicit image proportions in your layouts.',
      featuredImg: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60',
      author: 'Vikram Mehta',
      category: 'Performance',
      readingTime: 7,
      views: 405,
      status: 'PUBLISHED'
    },
    {
      slug: 'intelligent-ai-chatbots-lead-capture',
      title: 'Integrating Intelligent AI Chatbots for Instant Lead Capture',
      excerpt: 'How conversational AI qualified prospects and booked Google Meet calls 24/7.',
      content: 'Traditional contact forms are static. Today’s consumers expect instant answers. Integrating an intelligent AI assistant trained on your custom knowledge base helps capture lead data immediately.\n\nBy qualifying prospects in a friendly conversational thread and connecting directly to booking tools (like Google Calendar), AI assistants convert anonymous traffic into qualified appointments 24/7.',
      featuredImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60',
      author: 'Vikram Mehta',
      category: 'AI',
      readingTime: 6,
      views: 251,
      status: 'PUBLISHED'
    },
    {
      slug: 'increase-website-conversions-without-ads',
      title: 'How to Increase Website Conversions by 300% Without Ads',
      excerpt: 'Refining typography hierarchy, vertical spacing rhythm, floating action panels, and micro-interactions for higher intent actions.',
      content: 'Driving traffic to your site is expensive. Converting existing traffic is far more cost-effective. Improving your conversion rate involves refining layout visual hierarchy and removing friction from action states.\n\nEnsure CTAs stand out with proper color contrast, forms are readable with light backgrounds, and page layout maintains a clear vertical rhythm. Micro-animations like card lifts on hover build trust and encourage user interaction.',
      featuredImg: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
      author: 'Elena Rostova',
      category: 'Business',
      readingTime: 5,
      views: 198,
      status: 'PUBLISHED'
    },
    {
      slug: 'streamline-onboarding-automated-whatsapp-alerts',
      title: 'Streamlining Client Onboarding via Automated WhatsApp Alerts',
      excerpt: 'How integrating WhatsApp marketing automation triggers instant confirmations and raises customer retention rates.',
      content: 'Customer onboarding sets the tone for your client relationships. If confirmation emails get lost in spam folders, clients feel anxious. Automating immediate status triggers via WhatsApp keeps clients aligned.\n\nSyncing WhatsApp API notifications with your CRM stages ensures clients receive updates on quote reviews, meeting links, and onboarding milestones instantly on their preferred messaging application.',
      featuredImg: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&auto=format&fit=crop&q=60',
      author: 'Vikram Mehta',
      category: 'Automation',
      readingTime: 5,
      views: 167,
      status: 'PUBLISHED'
    }
  ];

  for (const b of blogData) {
    await prisma.blog.create({ data: b });
  }

  // 7. Create FAQs
  const faqData = [
    {
      category: 'General',
      question: 'Do you work with third-party freelancers?',
      answer: 'No. Every single service, template, and design on our platform is developed, maintained, and backed exclusively by the engineering and design teams at OakPillar Studios. This ensures a consistent, premium, enterprise-grade standard for every deliverable.'
    },
    {
      category: 'Website Development',
      question: 'Will I own the source code of my custom website?',
      answer: 'Absolutely. Unlike template builders or closed SaaS websites, our custom development is fully yours once completed. We hand over the complete source code repository, clean design assets, and database setups with zero vendor lock-in.'
    },
    {
      category: 'SEO & Speed',
      question: 'How do you guarantee a 95+ Lighthouse Score?',
      answer: 'We leverage modern static rendering (Next.js), dynamic route pre-fetching, Variable Font subsetting, safe layout grids (preventing layout shifts), and compressed next-gen image formats (WebP/AVIF). Performance is built into the architecture, not added as an afterthought.'
    },
    {
      category: 'Pricing',
      question: 'Do you charge monthly maintenance fees?',
      answer: 'We offer flexible hosting and Monthly Website Care packages, but they are entirely optional. If you choose to host and support the website yourself, there are zero ongoing monthly royalties to OakPillar Studios.'
    }
  ];

  for (const f of faqData) {
    await prisma.fAQ.create({ data: f });
  }

  // 7. Create Testimonials
  const testimonialData = [
    {
      clientName: 'Elena Rostova',
      company: 'Aura Living Space',
      designation: 'Founder & Principal Designer',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      rating: 5,
      review: 'OakPillar Studios built our website and custom gallery layout. Instantly generated premium trust from luxury clients, causing our project size queries to grow by 40% in two months.',
      industry: 'Interior Design',
      projectType: 'Premium Portfolio Website',
      location: 'Mumbai, India',
      featured: true
    },
    {
      clientName: 'Rajiv Sharma',
      company: 'Apex BuildCon',
      designation: 'Managing Director',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60',
      rating: 5,
      review: 'Bespoke CRM and builder pipeline dashboard. The automated WhatsApp integration alerts our sales agents immediately, meaning leads never get dropped. Professional, sleek work.',
      industry: 'Real Estate',
      projectType: 'CRM & Custom Admin Dashboard',
      location: 'Delhi, India',
      featured: true
    }
  ];

  for (const t of testimonialData) {
    await prisma.testimonial.create({ data: t });
  }

  // 8. Create Portfolio / Case Studies
  const portfolioData = [
    {
      projectName: 'Aura Living Digital Transformation',
      client: 'Aura Living Space',
      industry: 'Interior Design',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=60'
      ]),
      projectStory: 'Aura Living was struggling with a slow WordPress site that failed to showcase the premium nature of their luxury interior projects.',
      challenges: 'Slow loading times (5.2s FCP) and layout shifts due to legacy plugins, leading to a high bounce rate on mobile devices.',
      solutions: 'We designed a custom portfolio built on Next.js with optimized image loading, breadcrumbs, and JSON-LD schema for local designer rankings.',
      technologies: JSON.stringify(['Next.js', 'Tailwind CSS', 'Framer Motion', 'Cloudinary']),
      perfScore: 99,
      seoScore: 100,
      clientReview: 'Exceptional visual layout and speed. Our bounce rate fell from 58% to under 20% within weeks of deployment.',
      clientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      clientName: 'Elena Rostova',
      clientRole: 'Principal Designer',
      featured: true,
      slug: 'aura-living-portfolio'
    }
  ];

  for (const p of portfolioData) {
    await prisma.portfolio.create({ data: p });
  }

  // 9. Create Admin User
  const hashedPassword = await bcrypt.hash('OPS123', 10);
  await prisma.user.create({
    data: {
      name: 'OakPillar Admin',
      email: 'oakpillarstudios@gmail.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      phone: '+91 7738049380',
      whatsApp: '+91 7738049380',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60'
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
