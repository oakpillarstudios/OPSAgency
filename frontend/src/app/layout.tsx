import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OakPillar Studios | Premium Enterprise Full Stack Agency Platform",
  description: "OakPillar Studios combines digital agency services, website template marketplaces, dynamic AI automations, and custom CRM systems. Engineered for business growth.",
  keywords: "OakPillar, digital agency, custom software, CRM, AI chatbot, Next.js, web development",
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={{ colorScheme: 'light' }}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-navy-dark text-light-gray font-sans selection:bg-gold/30 selection:text-gold">
        
        {/* Google reCAPTCHA v3 Script Loading */}
        {recaptchaKey && recaptchaKey !== 'PASTE_YOUR_RECAPTCHA_SITE_KEY_HERE' && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`}
            strategy="afterInteractive"
          />
        )}

        {/* Google Analytics Gtag Script Loading */}
        {gaId && gaId !== 'PASTE_YOUR_GA_MEASUREMENT_ID_HERE' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity Script Loading */}
        {clarityId && clarityId !== 'PASTE_YOUR_CLARITY_PROJECT_ID_HERE' && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${clarityId}");
            `}
          </Script>
        )}

        <Providers>
          <Navbar />
          
          {/* Structured Schema Graph */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": "https://oakpillarstudios.com/#organization",
                    "name": "OakPillar Studios",
                    "url": "https://oakpillarstudios.com",
                    "logo": "https://oakpillarstudios.com/logo.png",
                    "sameAs": [
                      "https://linkedin.com/company/oakpillar",
                      "https://instagram.com/oakpillar"
                    ],
                    "contactPoint": {
                      "@type": "ContactPoint",
                      "telephone": "+91 77380 49380",
                      "contactType": "customer service",
                      "email": "oakpillarstudios@gmail.com"
                    }
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://oakpillarstudios.com/#website",
                    "url": "https://oakpillarstudios.com",
                    "name": "OakPillar Studios",
                    "publisher": {
                      "@id": "https://oakpillarstudios.com/#organization"
                    }
                  },
                  {
                    "@type": "LocalBusiness",
                    "name": "OakPillar Studios",
                    "image": "https://oakpillarstudios.com/logo.png",
                    "@id": "https://oakpillarstudios.com/#localbusiness",
                    "url": "https://oakpillarstudios.com",
                    "telephone": "+91 77380 49380",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "BKC",
                      "addressLocality": "Mumbai",
                      "addressRegion": "MH",
                      "postalCode": "400051",
                      "addressCountry": "IN"
                    }
                  }
                ]
              })
            }}
          />

          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

