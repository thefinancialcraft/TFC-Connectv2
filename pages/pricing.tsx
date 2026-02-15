import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

const Pricing = dynamic(() => import('@/components/landing/Pricing'), { ssr: true });
const ComparisonSection = dynamic(() => import('@/components/landing/ComparisonSection'), { ssr: false });

const growthMetrics = [
    {
        title: "300% Higher Answer Rates",
        desc: "Calls from real SIM numbers are trusted 3x more than VOIP numbers, which are often flagged as 'Scam' or 'Spam'.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
        stat: "+300%",
        label: "Answering Reliability"
    },
    {
        title: "40% More Daily Calls",
        desc: "Automated logging and the One-Tap CRM overlay remove the 'admin headache', allowing agents to make 40% more calls every single day.",
        image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800",
        stat: "40%",
        label: "Efficiency Boost"
    },
    {
        title: "Zero Lead Leakage",
        desc: "The 'Zero-Overdue' protocol ensures every lead is followed up. No more forgotten spreadsheets or lost opportunities.",
        image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
        stat: "100%",
        label: "Lead Accountability"
    }
];

const inclusiveBenefits = [
    {
        title: "Full Sales Kit",
        desc: "Every plan includes access to the Android App, Web Dashboard, and Manager HQ.",
        icon: "fi-rr-briefcase"
    },
    {
        title: "Unlimited Call Logs",
        desc: "No limits on how many calls you log. Scale your history as you scale your team.",
        icon: "fi-rr-database"
    },
    {
        title: "Team Calibration",
        desc: "Detailed heatmaps and talk-time analytics to coach your 'B' players into 'A' players.",
        icon: "fi-rr-users-alt"
    },
    {
        title: "Enterprise Security",
        desc: "Number masking and data encryption provided as standard on all professional tiers.",
        icon: "fi-rr-shield-check"
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Head>
                <title>Pricing | At ₹350/mo, Increase Your Sales with Rynxly</title>
                <meta name="description" content="Start growing your sales for just ₹350/month. Discover how Rynxly's SIM-based CRM boosts answer rates by 300%." />
                <meta name="keywords" content="CRM pricing, sales calling software cost, affordable CRM, SIM based calling price" />
                <link rel="canonical" href="https://www.rynxly.in/pricing" />
                <meta property="og:title" content="Pricing | At ₹350/mo, Increase Your Sales with Rynxly" />
                <meta property="og:description" content="Start growing your sales for just ₹350/month. Discover how Rynxly's SIM-based CRM boosts answer rates by 300%." />
                <meta property="og:url" content="https://www.rynxly.in/pricing" />
            </Head>

            <LandingNavbar />

            {/* Pricing Hero Header */}
            <div className="relative pt-32 pb-10 bg-white overflow-hidden">
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                {/* Atmospheric Glows (Subtle for white theme) */}
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-50 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-50 blur-[120px]" />
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
                    {/* Floating Call Icon */}
                    <div className="absolute top-[25%] left-[10%] md:left-[20%] w-8 h-8 flex items-center justify-center text-[#4b33e8] animate-float-slow opacity-90">
                        <i className="fi fi-rr-phone-call text-lg"></i>
                    </div>
                    
                    {/* Floating Growth Icon */}
                    <div className="absolute top-[40%] right-[10%] md:right-[15%] w-10 h-10 flex items-center justify-center text-[#806bf9] animate-float-medium opacity-90">
                        <i className="fi fi-rr-stats text-xl"></i>
                    </div>

                    {/* NEW: Floating User Icon */}
                    <div className="absolute top-[25%] right-[25%] w-6 h-6 flex items-center justify-center text-indigo-500 animate-float-fast opacity-80">
                        <i className="fi fi-rr-user text-sm"></i>
                    </div>

                    {/* NEW: Floating Shield Icon */}
                    <div className="absolute bottom-[35%] left-[5%] md:left-[10%] w-8 h-8 flex items-center justify-center text-purple-500 animate-float-slow opacity-80">
                        <i className="fi fi-rr-shield-check text-lg"></i>
                    </div>

                    {/* NEW: Floating Database Icon */}
                    <div className="absolute top-[60%] left-[25%] w-6 h-6 flex items-center justify-center text-violet-500 animate-float-medium opacity-85">
                        <i className="fi fi-rr-database text-base"></i>
                    </div>

                    {/* NEW: Floating Clock Icon */}
                    <div className="absolute top-[32%] right-[40%] w-5 h-5 flex items-center justify-center text-purple-600 animate-float-slow opacity-70">
                        <i className="fi fi-rr-clock text-xs"></i>
                    </div>

                    {/* NEW: Floating Settings Icon */}
                    <div className="absolute bottom-[20%] right-[30%] w-8 h-8 flex items-center justify-center text-indigo-600 animate-float-medium opacity-80">
                        <i className="fi fi-rr-settings text-base"></i>
                    </div>

                    {/* Floating CRM Badge */}
                    <div className="absolute bottom-[10%] left-[15%] flex items-center gap-2 animate-float-fast opacity-70">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest leading-none pt-0.5">Automated</span>
                    </div>

                    {/* Abstract Circles */}
                    <svg className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 text-indigo-50/50" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <circle cx="100" cy="50" r="40" strokeWidth="0.5" strokeDasharray="4 4" />
                        <circle cx="100" cy="50" r="30" strokeWidth="0.5" />
                    </svg>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-[#4b33e8] tracking-widest uppercase">Pricing & Value</span>
                    </div>
                    <h1 className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#263238] mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Scale Your Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">at ₹350/mo.</span>
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-500 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        No hidden per-minute fees. Just pure performance using your existing SIM cards.
                    </p>
                </div>
            </div>

            {/* The Pricing Component (Now as a standalone rounded card) */}
            <div className="relative z-10 bg-white pb-20">
                <Pricing />
            </div>

            {/* Growth & Benefits Section */}
            <div className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#263238] mb-6 tracking-tight">How Your Sales Will Grow</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">We don't just provide a tool; we provide a high-performance engine designed for closing.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {growthMetrics.map((metric, idx) => (
                            <div key={idx} className="group relative">
                                <div className="relative h-64 overflow-hidden rounded-[2rem] mb-8 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                                    <img src={metric.image} alt={metric.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#263238]/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <p className="text-4xl font-black mb-1">{metric.stat}</p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">{metric.label}</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#263238] mb-3">{metric.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{metric.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* The "What's in the Box" Section */}
            <div className="py-32 bg-[#fcfcff] border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-5xl font-bold text-[#263238] mb-8 tracking-tight">Everything you need to <span className="text-[#4b33e8]">Outperform</span></h2>
                            <p className="text-gray-500 text-lg mb-12 leading-relaxed">
                                When you purchase a Rynxly plan, you're not just getting a login. You're getting a complete sales transformation kit designed for the modern agent.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {inclusiveBenefits.map((benefit, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-[#4b33e8] text-xl">
                                            <i className={`fi ${benefit.icon} flex`}></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#263238] mb-1">{benefit.title}</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            {/* Decorative Background for Image */}
                            <div className="absolute -inset-4 bg-indigo-50 rounded-[3rem] -z-10 blur-2xl"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000" 
                                alt="Rynxly Workspace" 
                                className="w-full rounded-[2.5rem] shadow-2xl border border-white"
                            />
                            {/* Glassmorphic Stat Overlay */}
                            <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl">
                                        <i className="fi fi-rr-stats flex"></i>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-white">40% ROI</p>
                                        <p className="text-[10px] text-white/60 font-medium uppercase tracking-[0.2em]">Guaranteed within 30 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Section */}
            <ComparisonSection />

            {/* Global CTA */}
            <div className="py-40 bg-white">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="relative rounded-[4rem] bg-[#263238] p-12 md:p-24 overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#4b33e8] opacity-20 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 opacity-20 rounded-full blur-[100px]"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight leading-tight">
                                Ready to Turn Your SIM into a <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">Revenue Machine?</span>
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <a href="/login" className="px-12 py-5 rounded-full bg-[#4b33e8] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all">
                                    Start Closing Now
                                </a>
                                <a href="#contact" className="px-12 py-5 rounded-full bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                                    Book Personal Demo
                                </a>
                            </div>
                            <p className="mt-10 text-gray-500 font-medium text-sm tracking-widest uppercase">
                                Stop Managing Spreadsheets. <span className="text-white">Start Closing Deals.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float-slow {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
