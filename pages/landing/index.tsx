import Head from 'next/head';
import LandingNavbar from '../../components/landing/LandingNavbar';
import HeroSection from '../../components/landing/HeroSection';
import ClientLogos from '../../components/landing/ClientLogos';
import ProblemSolution from '../../components/landing/ProblemSolution';
import FeaturesSection from '../../components/landing/FeaturesSection';
import WorkflowSteps from '../../components/landing/WorkflowSteps';
import AppShowcase from '../../components/landing/AppShowcase';
import IndustrySolutions from '../../components/landing/IndustrySolutions';
import Testimonials from '../../components/landing/Testimonials';
import FAQSection from '../../components/landing/FAQSection';
import Footer from '../../components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Rynxly - SIM-Based Calling CRM</title>
        <meta name="description" content="The comprehensive SIM-based calling CRM that syncs your mobile workforce with real-time web analytics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <LandingNavbar />
        <HeroSection />
        <ClientLogos />
        <ProblemSolution />
        <FeaturesSection />
        <WorkflowSteps />
        <AppShowcase />
        <IndustrySolutions />
        <Testimonials />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
}
