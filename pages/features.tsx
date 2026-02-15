import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

// Dynamic imports for performance and layout control
const CallEngineShowcase = dynamic(() => import('@/components/landing/CallEngineShowcase'), { ssr: true });
const ReminderShowcase = dynamic(() => import('@/components/landing/ReminderShowcase'), { ssr: true });
const UtilityShowcase = dynamic(() => import('@/components/landing/UtilityShowcase'), { ssr: true });
const IntegrationSection = dynamic(() => import('@/components/landing/IntegrationSection'), { ssr: true });

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Head>
                <title>Features | Rynxly</title>
                <meta name="description" content="Explore Rynxly's powerful feature set: GSM call tracking, automated reminders, intelligent utility tools, and seamless integrations." />
                <meta name="keywords" content="CRM features, call tracking, lead management tools, Rynxly capabilities" />
                <link rel="canonical" href="https://www.rynxly.in/features" />
                <meta property="og:title" content="Features | Rynxly" />
                <meta property="og:description" content="Explore Rynxly's powerful feature set: GSM call tracking, automated reminders, and seamless integrations." />
                <meta property="og:url" content="https://www.rynxly.in/features" />
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
                                    "name": "Features",
                                    "item": "https://www.rynxly.in/features"
                                }
                            ]
                        })
                    }}
                />
            </Head>

            <LandingNavbar />

            {/* Features Hero */}
            <div className="relative pt-32 pb-20 bg-white overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] select-none pointer-events-none translate-x-1/4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#4b33e8" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#4b33e8" strokeWidth="0.5" strokeDasharray="1 1" />
                    </svg>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-[#4b33e8] tracking-widest uppercase">The Full Capabilities</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#263238] mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">Outperform.</span>
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        From cellular automation to enterprise-level reporting, Rynxly gives your team the edge they need to close more deals, faster.
                    </p>
                </div>
            </div>

            {/* Feature Sections */}
            <div className="space-y-0">
                {/* 1. Core Calling Engine */}
                <div id="calling-engine" className="border-t border-gray-50 pt-12">
                   <CallEngineShowcase />
                </div>

                {/* 2. Automated Reminders */}
                <div id="reminders" className="bg-gray-50/30">
                    <ReminderShowcase />
                </div>

                {/* 3. Utility Systems */}
                <div id="utility" className="bg-white">
                    <UtilityShowcase />
                </div>

                {/* 4. Integrations */}
                <div id="integrations" className="bg-[#fcfcff] pb-24 border-t border-gray-100">
                    <IntegrationSection />
                </div>
            </div>

            {/* Feature Highlight Grid */}
            <div className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-[#263238] tracking-tight">Enterprise-Grade <span className="text-[#4b33e8]">Performance.</span></h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Built for high-volume sales teams</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Bank-Grade Privacy", desc: "End-to-end encryption for all customer data and call logs.", icon: "fi-rr-lock" },
                            { title: "Smart Escalation", desc: "Automatically notify managers when priority leads go cold.", icon: "fi-rr-arrow-trend-up" },
                            { title: "Bulk SMS Engine", desc: "Follow up with cold leads instantly via integrated SMS sync.", icon: "fi-rr-comment-alt" },
                            { title: "Unified API", desc: "Connect Rynxly data to your existing BI tools via JSON API.", icon: "fi-rr-cursor-text" }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#4b33e8] mb-6 group-hover:scale-110 transition-transform">
                                    <i className={`fi ${feature.icon} text-lg`}></i>
                                </div>
                                <h3 className="text-sm font-bold text-[#263238] tracking-tight mb-2 uppercase tracking-wide">{feature.title}</h3>
                                <p className="text-[12px] text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-[#01040a] rounded-[3rem] mx-4 my-12 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Ready to see these <span className="text-[#4b33e8]">Features</span> in action?</h2>
                    <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-xl mx-auto italic">
                        "The most feature-rich SIM CRM ever built for mobile calling teams."
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/login" className="px-10 py-4 rounded-full bg-[#4b33e8] text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all"> Start Free Trial </a>
                        <a href="/how-it-works" className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"> Explore Workflow </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
