// Landing page for Rynxly CRM
import Head from 'next/head';
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
import IntegrationSection from '@/components/landing/IntegrationSection';
import UtilityShowcase from '@/components/landing/UtilityShowcase';
import ReminderShowcase from '@/components/landing/ReminderShowcase';
import CallEngineShowcase from '@/components/landing/CallEngineShowcase';
import ContactForm from '@/components/landing/ContactForm';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>SIM Based Calling CRM for Sales Teams | Rynxly</title>
        <meta name="description" content="Rynxly is an advanced SIM based calling CRM that syncs mobile calls to your web dashboard, improves follow-ups, and boosts sales team performance." />
        <meta name="keywords" content="SIM based calling CRM, Calling CRM software, Sales calling CRM, CRM with call tracking, Best CRM for outbound calling teams, SIM CRM for telesales India, CRM for sales call follow up, mobile CRM, Rynxly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4b33e8" />
        <link rel="canonical" href="https://www.rynxly.in" />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rynxly.in" />
        <meta property="og:title" content="SIM Based Calling CRM for Sales Teams | Rynxly" />
        <meta property="og:description" content="Rynxly is an advanced SIM based calling CRM that syncs mobile calls to your web dashboard, improves follow-ups, and boosts sales team performance." />
        <meta property="og:image" content="https://rynxly.in/home-page.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rynxly" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.rynxly.in" />
        <meta property="twitter:title" content="SIM Based Calling CRM for Sales Teams | Rynxly" />
        <meta property="twitter:description" content="Rynxly is an advanced SIM based calling CRM that syncs mobile calls to your web dashboard, improves follow-ups, and boosts sales team performance." />
        <meta property="twitter:image" content="https://rynxly.in/home-page.png" />

        {/* JSON-LD Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Rynxly",
              "description": "SIM based calling CRM for sales and calling teams.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web, Android",
              "url": "https://www.rynxly.in",
              "offers": {
                "@type": "Offer",
                "price": "450",
                "priceCurrency": "INR",
                "url": "https://www.rynxly.in/home"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "124"
              }
            })
          }}
        />
      </Head>
      
      <main className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <LandingNavbar />
        <HeroSection />
        <ClientLogos />
        <ProblemSolution />
        <FeaturesSection />
        <WorkflowSteps />
        <UtilityShowcase />
        <ReminderShowcase />
        <CallEngineShowcase />
        <AppShowcase />
        <ComparisonSection />
        <IntegrationSection />
        <Pricing />
        <FAQSection />
        <IndustrySolutions />
        <Testimonials />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
