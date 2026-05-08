import React from 'react';
import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

export default function HelperDownloadPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Head>
                <title>Download Helper | Rynxly</title>
                <meta name="description" content="Download the Rynxly Helper utility to enable automated call logging and real-time CRM synchronization on your Android device." />
                <link rel="canonical" href="https://rynxly.in/helper" />
            </Head>

            <LandingNavbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] select-none pointer-events-none translate-x-1/4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#4b33e8" strokeWidth="0.5" strokeDasharray="2 2" />
                    </svg>
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-[#4b33e8] tracking-widest uppercase">Companion Utility</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#263238] mb-6 leading-tight">
                        Power Up Your CRM with <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">Rynxly Helper.</span>
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-500 mb-10">
                        The Helper app acts as a secure bridge between your phone's call logs and the Rynxly CRM, ensuring every interaction is captured instantly.
                    </p>

                    <div className="flex flex-col gap-4 justify-center items-center">
                        <a 
                            href="http://rynxly.in/app/rynxly_helper.apk" 
                            className="px-10 py-5 rounded-2xl bg-[#4b33e8] text-white font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-200 flex items-center gap-3"
                        >
                            <i className="fi fi-rr-download text-lg"></i>
                            Download for Android
                        </a>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                            v1.0.0 • 4.2 MB • .APK
                        </p>
                    </div>
                </div>
            </div>

            {/* Why Helper? */}
            <div className="py-24 bg-gray-50/50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-[#263238] tracking-tight uppercase">Why do I need this?</h2>
                        <div className="h-1 w-12 bg-[#4b33e8] mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                title: "Automated Logging", 
                                desc: "No more manual entry. Helper detects incoming and outgoing calls and logs them to your CRM dashboard in real-time.",
                                icon: "fi-rr-refresh" 
                            },
                            { 
                                title: "High-Quality Recording", 
                                desc: "Bypass standard Android restrictions to ensure clear call recordings are attached to every lead interaction.",
                                icon: "fi-rr-mic" 
                            },
                            { 
                                title: "Background Sync", 
                                desc: "The helper runs silently in the background, consuming minimal battery while keeping your data perfectly in sync.",
                                icon: "fi-rr-shield-check" 
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] mb-6">
                                    <i className={`fi ${item.icon} text-xl`}></i>
                                </div>
                                <h3 className="text-base font-bold text-[#263238] mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Installation Guide */}
            <div className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-[#263238] text-center mb-16 uppercase tracking-widest">Installation Guide</h2>
                    
                    <div className="space-y-12">
                        {[
                            { 
                                step: "01", 
                                title: "Download & Install APK", 
                                desc: "Click the download button above. Once downloaded, tap the file to install. If prompted, allow 'Installation from Unknown Sources'." 
                            },
                            { 
                                step: "02", 
                                title: "Enable Accessibility Service", 
                                desc: "Open the Helper app and tap 'Enable Accessibility'. Find 'Rynxly Helper' in the list and toggle it ON. This allows the app to detect call events." 
                            },
                            { 
                                step: "03", 
                                title: "Handshake with Main App", 
                                desc: "Open the Rynxly CRM app. It will automatically detect the Helper and establish a secure bridge. You're ready to go!" 
                            }
                        ].map((guide, i) => (
                            <div key={i} className="flex gap-8 items-start group">
                                <div className="text-4xl font-black text-gray-100 group-hover:text-indigo-100 transition-colors leading-none">
                                    {guide.step}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#263238] mb-2">{guide.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{guide.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Safety Notice */}
            <div className="max-w-5xl mx-auto px-4 mb-24">
                <div className="p-10 rounded-[3rem] bg-[#01040a] text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <i className="fi fi-rr-shield-check text-[#4b33e8] text-4xl mb-6 inline-block"></i>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 italic">"Privacy is our priority."</h2>
                        <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
                            The Helper app only accesses call metadata and audio during active business calls. No personal messages, contacts, or private data are ever tracked or shared.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
