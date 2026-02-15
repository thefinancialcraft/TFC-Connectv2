import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import ContactForm from '@/components/landing/ContactForm';
import Footer from '@/components/landing/Footer';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact | Rynxly</title>
        <meta name="description" content="Get in touch with the Rynxly team. Schedule a demo, ask about enterprise plans, or get support for your account." />
        <meta name="keywords" content="contact Rynxly, CRM support, sales inquiry, book demo" />
        <link rel="canonical" href="https://www.rynxly.in/contact" />
        <meta property="og:title" content="Contact | Rynxly" />
        <meta property="og:description" content="Get in touch with the Rynxly team for support or demos." />
        <meta property="og:url" content="https://www.rynxly.in/contact" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.rynxly.in"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Contact",
                  "item": "https://www.rynxly.in/contact"
                }
              ]
            })
          }}
        />
      </Head>
      
      <main className="min-h-screen bg-white font-sans">
        <LandingNavbar />
        <div className="pt-20">
            <ContactForm />
        </div>
        <Footer />
      </main>
    </>
  );
}
