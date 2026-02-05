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
import ContactForm from '@/components/landing/ContactForm';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Rynxly • The Advanced SIM-Based Calling CRM</title>
        <meta name="description" content="Transform your mobile workforce with Rynxly. The only CRM that syncs SIM-based calls with real-time web analytics, automated call routing, and performance tracking." />
        <meta name="keywords" content="SIM based CRM, mobile CRM, call tracking software, sales tracking, telecalling CRM, Rynxly, lead management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4b33e8" />
        <link rel="canonical" href="https://rynxly.in" />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rynxly.in" />
        <meta property="og:title" content="Rynxly • Sync Mobile Calls with Web Power" />
        <meta property="og:description" content="Stop losing lead data. Automatically track every SIM call, record conversations, and visualize team performance in real-time." />
        <meta property="og:image" content="https://rynxly.in/home-page.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rynxly" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://rynxly.in" />
        <meta property="twitter:title" content="Rynxly • Advanced Calling CRM" />
        <meta property="twitter:description" content="The ultimate tool for high-performance sales teams. Sync mobile calls, automate routing, and close more deals." />
        <meta property="twitter:image" content="https://rynxly.in/home-page.png" />

        {/* JSON-LD Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Rynxly CRM",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Android, Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "Rupee"
              },
              "description": "A SIM-based calling CRM that synchronizes mobile call data with a central web dashboard for real-time analytics and team management.",
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
        <AppShowcase />
        <ComparisonSection />
        <Pricing />
        <IndustrySolutions />
        <Testimonials />
        <FAQSection />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
