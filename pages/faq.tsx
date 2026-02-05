import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Rynxly</title>
        <meta name="description" content="Find answers to common questions about Rynxly's SIM-based CRM, data security, pricing, and installation process." />
        <meta name="keywords" content="Rynxly FAQ, CRM help, how rynxly works, security questions" />
        <link rel="canonical" href="https://www.rynxly.in/faq" />
      </Head>
      
      <main className="min-h-screen bg-white font-sans">
        <LandingNavbar />
        <div className="pt-20">
            <FAQSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
