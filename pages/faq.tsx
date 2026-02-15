import React, { useState } from 'react';
import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

const faqGroups = [
  {
    title: "Product Fundamentals",
    description: "Understand the core philosophy and technology that makes Rynxly the #1 SIM calling CRM.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
    faqs: [
      {
        q: "What makes Rynxly unique in the CRM market?",
        a: "Rynxly solves the 'administrative friction' that kills sales momentum. Unlike desktop CRMs that require manual logging, Rynxly captures call data directly from the SIM/GSM network. It ensures 100% voice clarity and displays a real mobile number, resulting in 3x higher answer rates compared to VOIP systems."
      },
      {
        q: "How does the SIM-based tracking actually work?",
        a: "We install a lightweight application on the agent's Android device. This app acts as a bridge between the phone's native calling system and the Rynxly cloud. Every call log, duration, and recording is synced instantly to the manager's dashboard without any agent intervention."
      },
      {
        q: "Is it a VOIP system? Do I need internet for calling?",
        a: "No. Rynxly is NOT a VOIP system. It uses your regular SIM card network (GSM). You use your existing unlimited calling plans, which means zero per-minute costs and crystal-clear voice quality even with basic mobile data."
      }
    ]
  },
  {
    title: "Accountability & Discipline",
    description: "Learn how our specialized features eliminate lead leakage and force a follow-up culture.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    faqs: [
      {
        q: "What is the 'Zero-Overdue' Discipline Policy?",
        a: "This is Rynxly's flagship discipline feature. If an agent has pending follow-ups from yesterday, the system can be set to 'Block' them from receiving fresh leads. This ensures that old leads aren't wasted and agents stay focused on their pipeline."
      },
      {
        q: "Can I monitor my team in real-time if they work remotely?",
        a: "Yes. The dashboard provides a live 'Leaderboard' and 'Active Status' feed. You can see who is currently on a call, the average talk time of each agent, and convert raw data into performance heat-maps instantly."
      },
      {
        q: "How does the 'Daily Reminder Overlay' help agents?",
        a: "A smart floating widget appears on the agent's mobile screen every morning. It shows a list of calls they must make today. After every call, it prompts for a 'one-tap disposition' so no data entry is left for the end of the day."
      }
    ]
  },
  {
    title: "Security & Data Privacy",
    description: "In the age of data theft, we provide enterprise-grade protection for your lead database.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    faqs: [
      {
        q: "How does 'Number Masking' protect my lead data?",
        a: "With Number Masking, agents can call leads through the Rynxly app without ever seeing the actual 10-digit number. This prevents agents from saving customer data locally or exporting it if they leave the company."
      },
      {
        q: "Are the call recordings secure?",
        a: "Absolutely. All recordings are encrypted and stored in secure AWS S3 buckets. Only authorized managers can access, listen to, or download these recordings for quality and coaching purposes."
      },
      {
        q: "Does Rynxly comply with data privacy laws?",
        a: "Yes, Rynxly is built with GDPR and Indian data protection guidelines in mind. We provide enterprise-level access controls, ensuring that only the right people see the right data."
      }
    ]
  },
  {
    title: "Scalability & API Integration",
    description: "Connect Rynxly to your existing tech stack and watch your sales ecosystem thrive.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    faqs: [
      {
        q: "Can I connect Rynxly with my CRM like Salesforce or Zoho?",
        a: "Yes. Rynxly provides flexible API hooks and Webhooks. You can trigger data syncs to your existing CRM every time a call disposition is tagged on our mobile app."
      },
      {
        q: "Is there an integration for Lead Generation sources?",
        a: "Definitely. We have direct integrations with Facebook (Meta) Lead Ads and Google Ads. Every time a new lead lands from your ads, it is instantly pushed to the Rynxly pool and assigned to an agent."
      },
      {
        q: "Does Rynxly support WhatsApp automation?",
        a: "Rynxly allows for 'One-Tap WhatsApp' from the mobile overlay. After a call, an agent can send a pre-approved message template to the prospect to keep the conversation moving."
      }
    ]
  },
  {
    title: "ROI & Performance Analytics",
    description: "Stop guessing and start closing with data-driven insights into your sales pipeline.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800",
    faqs: [
      {
        q: "How soon can I see results after deploying Rynxly?",
        a: "Most teams report a 40% increase in daily talk time and a 20% increase in call answer rates within the first 7 days of deployment."
      },
      {
        q: "What kind of reports can I generate?",
        a: "Rynxly provides detailed reports on Agent talk-time, Conversion ratios, Peak calling hours, and Disposition breakdowns. You get clear visibility into which agents are performing and which need coaching."
      },
      {
        q: "How does the 'Talk-Time Heatmap' help me?",
        a: "The heatmap visualizes your team's energy levels throughout the day. It helps you identify periods where your team is most active and ensures that fresh leads are distributed during high-energy intervals."
      }
    ]
  }
];

export default function EnhancedFAQPage() {
  const [activeFaq, setActiveFaq] = useState<{group: number, item: number} | null>({group: 0, item: 0});

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Head>
        <title>FAQ | Rynxly</title>
        <meta name="description" content="Discover how SIM-based calling CRMs can transform your sales operations. Comprehensive guide on lead management, call tracking, and data security." />
        <meta name="keywords" content="CRM FAQ, sales calling guide, lead management FAQ, SIM calling support" />
        <link rel="canonical" href="https://www.rynxly.in/faq" />
        <meta property="og:title" content="FAQ | Rynxly" />
        <meta property="og:description" content="Discover how SIM-based calling CRMs can transform your sales operations. Comprehensive guide on lead management, call tracking, and data security." />
        <meta property="og:url" content="https://www.rynxly.in/faq" />
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
                  "name": "FAQ",
                  "item": "https://www.rynxly.in/faq"
                }
              ]
            })
          }}
        />
      </Head>

      <LandingNavbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 bg-[#fcfcff] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-50 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-50 blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-gray-100 pb-20">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
            <span className="text-[10px] font-bold text-[#4b33e8] tracking-widest uppercase">The Closing Guide</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#263238] mb-6 tracking-tight leading-tight">
            Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">Queries & Strategy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base leading-relaxed">
            Everything you need to know to transform your sales team from a spreadsheet-managed group to a high-performance closing machine.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Dynamic Guide Sections */}
        <div className="space-y-32 mb-40">
          {faqGroups.map((group, groupIdx) => (
            <div key={groupIdx} className={`flex flex-col lg:flex-row gap-16 items-center ${groupIdx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Visual Content */}
              <div className="lg:w-1/2 w-full">
                <div className="relative group">
                  {/* Decorative Border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#4b33e8] to-[#806bf9] rounded-[2.5rem] opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
                  
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl aspect-[4/3]">
                    <img 
                      src={group.image} 
                      alt={group.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#263238]/60 to-transparent"></div>
                    
                    {/* Mini Web App Component Mockup Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between text-white">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-[#4b33e8] flex items-center justify-center font-bold text-sm">R</div>
                             <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Live Sync active</p>
                                <p className="text-sm font-bold truncate max-w-[150px]">{group.title}</p>
                             </div>
                          </div>
                          <div className="flex gap-1.5">
                             {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>)}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="lg:w-1/2 w-full">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight">{group.title}</h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">{group.description}</p>
                </div>

                <div className="space-y-4">
                  {group.faqs.map((faq, itemIdx) => (
                    <div key={itemIdx} className="border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-indigo-100 bg-white">
                      <button 
                        onClick={() => setActiveFaq(activeFaq?.group === groupIdx && activeFaq?.item === itemIdx ? null : {group: groupIdx, item: itemIdx})}
                        className="w-full text-left px-6 py-4 bg-white flex items-center justify-between font-bold text-[#263238] focus:outline-none transition-colors"
                      >
                        <span className="text-sm md:text-base pr-8">{faq.q}</span>
                        <i className={`fi fi-rr-angle-small-down flex transform transition-transform text-lg text-gray-400 ${activeFaq?.group === groupIdx && activeFaq?.item === itemIdx ? 'rotate-180 text-[#4b33e8]' : ''}`}></i>
                      </button>
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq?.group === groupIdx && activeFaq?.item === itemIdx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-6 pb-6 pt-0 text-xs md:text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Global CTA Section */}
        <div className="bg-[#263238] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 opacity-20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 tracking-tight">
              Ready to See it in Action?<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">Stop Managing Spreadsheets. Start Closing Deals.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/login" className="px-10 py-4 bg-[#4b33e8] text-white font-bold rounded-full hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-500/20 text-xs uppercase tracking-widest">
                Deploy in 10 Minutes
              </a>
              <a href="tel:+918882558932" className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all text-xs uppercase tracking-widest">
                Speak to an Expert
              </a>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
