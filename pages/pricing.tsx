import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Pricing from '@/components/landing/Pricing';
import ComparisonSection from '@/components/landing/ComparisonSection';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing Plans | Rynxly CRM Investment</title>
        <meta name="description" content="Transparent pricing for every stage of growth. Start with our Spark plan or scale up with Elite. No hidden fees, just pure performance." />
        <meta name="keywords" content="CRM pricing India, affordable sales CRM, Rynxly cost, best CRM rates" />
        <link rel="canonical" href="https://www.rynxly.in/pricing" />
      </Head>
      
      <main className="min-h-screen bg-white font-sans">
        <LandingNavbar />
        <div className="pt-20">
            <Pricing />
            <ComparisonSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
