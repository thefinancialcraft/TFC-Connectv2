import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';
import LeadershipSection from '@/components/landing/LeadershipSection';

export default function TeamPage() {
  return (
    <>
      <Head>
        <title>Leadership Team | Rynxly CRM</title>
        <meta name="description" content="Meet the visionary leadership team at Rynxly, dedicated to revolutionizing sales technology." />
      </Head>

      <main className="min-h-screen bg-white">
        <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
          Meet the Rynxly Leadership Team: Deepak Kumar, Director & Visionary behind the Leading SIM-Based Calling CRM
        </h1>
        <LandingNavbar />
        
        {/* Header Spacer */}
        <div className="pt-32 pb-12 bg-gradient-to-b from-indigo-50/50 to-bg-white">
           <div className="container mx-auto px-4 text-center">
             <h1 className="text-3xl sm:text-5xl font-bold text-[#263238] mb-6"> Our <span className="text-[#4b33e8]">Team</span> </h1>
             <p className="text-gray-600 text-lg max-w-2xl mx-auto italic">
               "Leading with innovation, integrity, and a passion for empowering sales teams worldwide."
             </p>
           </div>
        </div>

        <LeadershipSection />

        <div className="py-24 container mx-auto px-4">
           <div className="bg-[#4b33e8] rounded-[48px] p-12 text-center text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-4">Want to Join Us?</h2>
                <p className="text-indigo-100 mb-8 max-w-xl mx-auto">We are always looking for passionate individuals to join our journey of redefining the CRM space.</p>
                <button className="px-10 py-4 bg-white text-[#4b33e8] font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl">
                    View Careers
                </button>
              </div>
              
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
           </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
