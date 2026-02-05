import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WorkflowSteps from '@/components/landing/WorkflowSteps';
import IndustrySolutions from '@/components/landing/IndustrySolutions';
import AppShowcase from '@/components/landing/AppShowcase';
import Footer from '@/components/landing/Footer';

export default function FeaturesPage() {
  return (
    <>
      <Head>
        <title>Key Features | Rynxly SIM-Based CRM</title>
        <meta name="description" content="Explore Rynxly's powerful features: Live SIM-to-Dashboard sync, Smart Call Routing, Zero-Overdue logic, and comprehensive team performance analytics." />
        <meta name="keywords" content="CRM features, SIM tracking, call recording, lead management, sales automation features" />
        <link rel="canonical" href="https://www.rynxly.in/features" />
      </Head>
      
      <main className="min-h-screen bg-white font-sans">
        <LandingNavbar />
        <div className="pt-20">
            <FeaturesSection />
            <WorkflowSteps />
            <AppShowcase />
            <IndustrySolutions />
        </div>
        <Footer />
      </main>
    </>
  );
}
