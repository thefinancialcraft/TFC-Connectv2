import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

// Dynamic imports for performance
const WorkflowSteps = dynamic(() => import('@/components/landing/WorkflowSteps'), { ssr: true });

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Head>
                <title>How it Works | Rynxly</title>
                <meta name="description" content="Discover the Rynxly workflow: Automated SIM calls, real-time web dashboard, and intelligent lead management." />
                <meta name="keywords" content="CRM workflow, call automation, sales process, lead management guide, how Rynxly works" />
                <link rel="canonical" href="https://www.rynxly.in/how-it-works" />
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
                                    "name": "How it Works",
                                    "item": "https://www.rynxly.in/how-it-works"
                                }
                            ]
                        })
                    }}
                />
            </Head>

            <LandingNavbar />

            {/* Compact Hero Section */}
            <div className="relative pt-24 pb-12 bg-white overflow-hidden border-b border-gray-50">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-[#4b33e8] tracking-widest uppercase">The Closing Blueprint</span>
                    </div>
                    <h1 className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#263238] mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Power Your Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">With Rynxly Engine.</span>
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        A dual-platform ecosystem designed to remove friction from calling and complexity from management.
                    </p>
                </div>
            </div>

            {/* The Core Workflow Component */}
            <WorkflowSteps />

            {/* DEEP DIVE: How the Engine Actually Works (SEO Optimized Sections) */}
            <div className="py-24 space-y-32">
                {/* 1. The Intelligent Routing Engine */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-indigo-100/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                                alt="Intelligent Sales Lead Distribution Engine" 
                                className="relative rounded-[2.5rem] shadow-2xl border border-gray-100 z-10"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-gray-50 hidden md:block animate-float-medium">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#4b33e8]">
                                        <i className="fi fi-rr-chart-connected"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Routing Logic</p>
                                        <p className="text-sm font-bold text-[#263238]">Round-Robin Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#4b33e8] text-[10px] font-black uppercase tracking-widest">Stage 01: Distribution</span>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#263238] tracking-tight leading-tight">
                                Intelligent Lead Distribution.
                            </h2>
                            <p className="text-gray-500 leading-relaxed text-base italic font-medium">
                                "Stop losing leads to slow response times. Our engine ensures every lead meets its perfect agent in seconds."
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Rynxly's core engine uses sophisticated algorithms to handle lead injection. Whether you're importing 10,000 leads via CSV or syncing from Facebook Ads, the engine instantly validates data and assigns leads based on your custom rules—Round Robin, performance-based, or location-specific.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h4 className="text-sm font-bold text-[#263238] mb-1">Instant Validation</h4>
                                    <p className="text-[11px] text-gray-400 font-medium leading-normal">Automatic duplicate removal and number verification.</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h4 className="text-sm font-bold text-[#263238] mb-1">Smart Load Balance</h4>
                                    <p className="text-[11px] text-gray-400 font-medium leading-normal">Optimizing agent bandwidth for maximum call volume.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. The GSM to Cloud Sync Protocol */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="lg:order-2 relative group">
                            <div className="absolute -inset-4 bg-blue-100/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000" 
                                alt="Automated GSM Call Logging Sync" 
                                className="relative rounded-[2.5rem] shadow-2xl border border-gray-100 z-10"
                            />
                        </div>
                        <div className="lg:order-1 space-y-6 text-left">
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">Stage 02: Real-time Sync</span>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#263238] tracking-tight leading-tight">
                                Seamless <span className="text-blue-600">GSM & Cloud Sync.</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                The Rynxly Engine bridges the gap between traditional SIM calling and cloud CRM. When an agent places a call through our Android app, the "Sync Engine" monitors the GSM network in real-time. Immediately upon call completion, its duration, timestamp, and recording are securely pushed to your central dashboard.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    { title: "Zero-Latency Updates", text: "Dashboard reflects call outcomes within 3 seconds of hanging up." },
                                    { title: "Offline Resilience", text: "Logs are cached locally on the device and sync automatically when internet returns." },
                                    { title: "Automatic Accountability", text: "Recording and logs cannot be edited by agents, ensuring 100% data integrity." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px]">
                                            <i className="fi fi-rr-check"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#263238] tracking-tight leading-none mb-1">{item.title}</h4>
                                            <p className="text-[12px] text-gray-400 font-medium leading-normal">{item.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. Lifecycle Management & Recycling */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-purple-100/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000" 
                                alt="CRM Lead Recycling and Lifecycle Management" 
                                className="relative rounded-[2.5rem] shadow-2xl border border-gray-100 z-10"
                            />
                        </div>
                        <div className="space-y-6">
                            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest">Stage 03: ROI Optimization</span>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#263238] tracking-tight leading-tight">
                                Automated <span className="text-purple-600">Lead Recycling.</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Most CRMs treat "Missed" or "Busy" calls as dead ends. Rynxly's lifecycle engine treats them as future opportunities. If a call isn't answered, the lead is automatically recycled back into the "Warm Pool" for follow-up at a more optimal time, ensuring your lead acquisition cost is utilized to the hundredth percentile.
                            </p>
                            <div className="pt-6 border-t border-gray-100 flex items-start gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-[#263238]">40%</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Avg. Call Lift</p>
                                </div>
                                <div className="text-center border-l border-gray-100 pl-6">
                                    <p className="text-2xl font-black text-purple-600">Zero</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Lead Leakage</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* The "Double Engine" Explanation Section */}
            <div className="py-20 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#263238] tracking-tight">One Platform. <span className="text-[#4b33e8]">Two Powerhouses.</span></h2>
                        <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest font-bold">Bridging the gap between field agents and office managers</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                        {/* Web App Workflow Card */}
                        <div className="relative group bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <i className="fi fi-rr-computer text-9xl text-indigo-600"></i>
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] mb-6">
                                    <i className="fi fi-rr-dashboard text-xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-[#263238] mb-4 tracking-tight">The Web Command Center</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    Designed for Managers and Admins. This is where high-level strategy meets execution. Upload bulk leads and monitor team performance.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { title: "Smart Lead Injection", desc: "Import CSVs and let the engine distribute them instantly." },
                                        { title: "Live Activity Feed", desc: "Watch calls happen live with real-time status updates." },
                                        { title: "Lead Recycling", desc: "Automatically move missed calls back into the general pool." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                                            <div>
                                                <h4 className="text-[13px] font-bold text-[#263238] tracking-tight leading-none mb-1">{item.title}</h4>
                                                <p className="text-[11px] text-gray-400 font-medium leading-normal">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile App Workflow Card */}
                        <div className="relative group bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <i className="fi fi-rr-smartphone text-9xl text-[#4b33e8]"></i>
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                                    <i className="fi fi-rr-phone-call text-xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-[#263238] mb-4 tracking-tight">The Mobile Agent Kit</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    Designed for high-speed calling. Agents receive leads on their Android devices and close deals with one-tap dialing.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { title: "One-Tap Dialing", desc: "Initiate GSM calls directly from the lead profile." },
                                        { title: "Instant Disposition", desc: "Select call outcome in 2 seconds after the call ends." },
                                        { title: "Local Store Sync", desc: "Work offline and sync logs automatically when online." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                                            <div>
                                                <h4 className="text-[13px] font-bold text-[#263238] tracking-tight leading-none mb-1">{item.title}</h4>
                                                <p className="text-[11px] text-gray-400 font-medium leading-normal">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informative: Technical Comparison Section */}
            <div className="py-24 bg-slate-50/50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-[#4b33e8] text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">The Competitive Edge</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-6 tracking-tight">How Rynxly <span className="text-[#4b33e8]">Outsmarts</span> Traditional CRMs.</h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                Most CRMs are glorified spreadsheets. Rynxly is an active participant in your sales cycle, automating the "grunt work" that usually leads to agent burnout.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { feature: "Call Logging", trad: "Manual Entry (High Error)", rynxly: "100% Automated GSM Sync" },
                                    { feature: "Lead Distribution", trad: "Static/Manual", rynxly: "Dynamic Round-Robin Engine" },
                                    { feature: "Offline Work", trad: "Requires Constant Internet", rynxly: "Local Store & Sync Protocol" },
                                    { feature: "Recycling", trad: "Manual Follow-ups", rynxly: "Automatic Lifecycle Loop" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{item.feature}</p>
                                            <p className="text-xs font-bold text-gray-300 line-through decoration-red-400/30">{item.trad}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-[#4b33e8] uppercase tracking-tighter">Verified Result</p>
                                            <p className="text-sm font-bold text-[#263238]">{item.rynxly}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-indigo-500/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                                <h3 className="text-xl font-bold text-[#263238] mb-6 tracking-tight">Technical Resilience.</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] shrink-0">
                                            <i className="fi fi-rr-cloud-check text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#263238] mb-1">Dual-Stack Architecture</h4>
                                            <p className="text-[12px] text-gray-500 leading-relaxed">Our system runs on a distributed cloud network, ensuring that your dashboard remains active even during high-traffic lead injections.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <i className="fi fi-rr-shield-check text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#263238] mb-1">Encrypted GSM Logs</h4>
                                            <p className="text-[12px] text-gray-500 leading-relaxed">Call recordings and metadata are encrypted with AES-256 before being transmitted, meeting strict enterprise compliance standards.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                            <i className="fi fi-rr-database text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#263238] mb-1">Real-Time Data Indexing</h4>
                                            <p className="text-[12px] text-gray-500 leading-relaxed">We use ultra-fast indexing to ensure that search queries across millions of leads return results in under 200ms.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Grid: More Benefit Cards */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Zero Manual Entry */}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-indigo-200 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] mb-6 group-hover:scale-110 transition-transform">
                                <i className="fi fi-rr-keyboard-hide text-lg"></i>
                            </div>
                            <h3 className="text-sm font-bold text-[#263238] tracking-tight mb-2">Zero Manual Data Entry.</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                Rynxly captures every call duration and timestamp automatically from your device's network. Your agents stop typing and start talking.
                            </p>
                        </div>

                        {/* Card 2: 100% Accountability */}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <i className="fi fi-rr-shield-check text-lg"></i>
                            </div>
                            <h3 className="text-sm font-bold text-[#263238] tracking-tight mb-2">100% Lead Accountability.</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                Every lead has a history. From the first import to the last rejection, track every interaction with millisecond precision. No leakage.
                            </p>
                        </div>

                        {/* Card 3: Real-Time Sync */}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-purple-200 transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <i className="fi fi-rr-refresh text-lg"></i>
                            </div>
                            <h3 className="text-sm font-bold text-[#263238] tracking-tight mb-2">Instant Cloud Sync.</h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed">
                                Call on mobile, track on web. Data flows seamlessly across platforms, ensuring managers always have the latest ROI metrics at their fingertips.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-[#01040a] rounded-[3rem] mx-4 my-12 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight"> Ready to <span className="text-[#4b33e8]">Optimize</span> Your Team? </h2>
                    <p className="text-gray-400 text-sm mb-10 leading-relaxed max-w-xl mx-auto">
                        Join the elite sales teams closing deals 3x faster with Rynxly's automated workflow.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/login" className="px-10 py-4 rounded-full bg-[#4b33e8] text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all"> Get Started </a>
                        <a href="/pricing" className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"> View Pricing </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
