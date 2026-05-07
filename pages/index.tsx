// Landing page for Rynxly CRM - Main Entry Point
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import ClientLogos from '@/components/landing/ClientLogos';
import ProblemSolution from '@/components/landing/ProblemSolution';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WorkflowSteps from '@/components/landing/WorkflowSteps';
import AppShowcase from '@/components/landing/AppShowcase';
import IndustrySolutions from '@/components/landing/IndustrySolutions';
import ComparisonSection from '@/components/landing/ComparisonSection';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQSection from '@/components/landing/FAQSection';
import SEOContent from '@/components/landing/SEOContent';
import IntegrationSection from '@/components/landing/IntegrationSection';
import UtilityShowcase from '@/components/landing/UtilityShowcase';
import ReminderShowcase from '@/components/landing/ReminderShowcase';
import CallEngineShowcase from '@/components/landing/CallEngineShowcase';
import ContactForm from '@/components/landing/ContactForm';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for Flutter Bridge (InAppWebView)
    const isFlutter = typeof window !== 'undefined' && 
                      !!(window as any).flutter_inappwebview;

    if (isFlutter) {
      console.log("📱 [Index] Flutter environment detected. Redirecting to Portal Login.");
      router.push("/login"); // This will be rewritten to /portal/login
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>SIM Based Calling CRM & Sales Calling Software | Rynxly</title>
        <meta name="description" content="Scale your sales with the #1 SIM based calling CRM. Automate call logging, track lead performance, and sync mobile data in real-time. Start closing deals today!" />
        <meta name="keywords" content="SIM based calling CRM, Calling CRM software, Sales calling CRM, Call tracking software, CRM for sales teams, Lead management CRM, Call analytics software, SIM calling solution for business, mobile CRM, Rynxly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4b33e8" />
        <link rel="canonical" href="https://rynxly.in" />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rynxly.in" />
        <meta property="og:title" content="SIM Based Calling CRM & Sales Calling Software | Rynxly" />
        <meta property="og:description" content="Boost conversions with Rynxly, the leading SIM based calling CRM. Track sales calls, manage leads & sync mobile data to your dashboard effortlessly." />
        <meta property="og:image" content="https://rynxly.in/home-page.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rynxly" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.rynxly.in" />
        <meta property="twitter:title" content="SIM Based Calling CRM & Sales Calling Software | Rynxly" />
        <meta property="twitter:description" content="Boost conversions with Rynxly, the leading SIM based calling CRM. Track sales calls, manage leads & sync mobile data to your dashboard effortlessly." />
        <meta property="twitter:image" content="https://rynxly.in/home-page.png" />

        {/* JSON-LD Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Rynxly",
                "description": "The #1 SIM Based Calling CRM for modern sales teams. Track calls, manage leads, and sync mobile data to a central dashboard.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web, Android",
                "url": "https://www.rynxly.in",
                "offers": {
                  "@type": "Offer",
                  "price": "450",
                  "priceCurrency": "INR"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "124"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is a SIM based calling CRM?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "A SIM based calling CRM uses your existing mobile network (GSM) to make calls while automatically syncing logs and recordings to a centralized web dashboard."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is Rynxly suitable for remote sales teams?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Rynxly is designed for distributed teams. Agents can make calls from anywhere using their SIM cards while managers track performance in real-time."
                    }
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Rynxly",
                "url": "https://rynxly.in",
                "logo": "https://rynxly.in/logo.png",
                "sameAs": [
                  "https://www.linkedin.com/company/rynxly",
                  "https://www.instagram.com/_rynxly"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Rynxly",
                "alternateName": ["Rynxly CRM", "Rynxly SIM CRM"],
                "url": "https://rynxly.in",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://rynxly.in/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Features",
                    "item": "https://www.rynxly.in/features"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Pricing",
                    "item": "https://www.rynxly.in/pricing"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "How it Works",
                    "item": "https://www.rynxly.in/how-it-works"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Blog",
                    "item": "https://www.rynxly.in/blog"
                  }
                ]
              }
            ])
          }}
        />
      </Head>
      
      <main className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <LandingNavbar />
        <HeroSection />
        {/* <ClientLogos /> */}
        <ProblemSolution />
        <FeaturesSection />
        <WorkflowSteps />
        <AppShowcase />
        <ReminderShowcase />
        <CallEngineShowcase />
        <IntegrationSection />
        <UtilityShowcase />
        <ComparisonSection />
        <IndustrySolutions />
        <Pricing />
        <FAQSection />
        <SEOContent />
        <Testimonials />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
