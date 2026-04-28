import React from 'react';
import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Head>
                <title>Privacy Policy | Rynxly CRM</title>
                <meta name="description" content="Privacy Policy for Rynxly CRM - Learn how we collect, use, process, and protect your information." />
                <link rel="canonical" href="https://www.rynxly.in/privacy-policy" />
            </Head>

            <LandingNavbar />

            {/* Compact Header Section */}
            <div className="relative pt-24 pb-10 bg-white overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase">Legal & Compliance</span>
                    </div>
                    <h1 className="relative z-10 text-3xl md:text-4xl font-bold tracking-tight text-[#263238] mb-4 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Privacy Policy
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500 font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <i className="fi flex fi-rr-calendar text-indigo-400"></i>
                            <span className="text-xs">Effective Date: April 29, 2026</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <i className="fi flex fi-rr-time-forward text-indigo-400"></i>
                            <span className="text-xs">Last Updated: April 29, 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section with Glassmorphism and Elegant Typography */}
            <div className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100/80 p-8 md:p-16 relative overflow-hidden">
                        {/* Decorative background accent inside the card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-bl-[100px] -z-10"></div>
                        
                        <div className="space-y-16 text-[#333e48]">
                            
                            {/* 1. Introduction */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">01</span>
                                    <span className="tracking-tight">Introduction</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM (“Rynxly”, “we”, “our”, or “us”) is a SIM-based calling Customer Relationship Management (CRM) platform designed to help businesses manage customer interactions, track call activities, and improve communication efficiency. The application integrates with your device’s telephony system to provide real-time insights, call tracking, and CRM automation features.
                                    </p>
                                    <p>
                                        This Privacy Policy explains how we collect, use, process, and protect your information when you use our application. By using Rynxly CRM, you agree to the practices described in this policy.
                                    </p>
                                </div>
                            </section>

                            {/* 2. Nature of the Application */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">02</span>
                                    <span className="tracking-tight">Nature of the Application</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM functions as a call-integrated system that relies on real-time communication data to deliver its features. This means the application actively interacts with your device’s calling system and may operate in the background to ensure uninterrupted functionality.
                                    </p>
                                    <p className="font-bold text-[#263238]">Specifically, the application:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Listens to call state changes (incoming, outgoing, ended)",
                                            "Processes call events in real-time",
                                            "Displays contextual CRM information using overlay popups",
                                            "Runs background services for continuous tracking"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2">These capabilities are essential for delivering core CRM functionality.</p>
                                </div>
                            </section>

                            {/* 3. Information We Collect */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">03</span>
                                    <span className="tracking-tight">Information We Collect</span>
                                </h2>
                                <div className="space-y-6 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly follows a strict data minimization approach and collects only the information required to provide its services. The collected data includes:
                                    </p>

                                    {/* Call Data */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-phone-call"></i></span>
                                            Call Data
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>We collect call-related information to maintain accurate CRM records. This includes:</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Incoming, outgoing, and missed calls",
                                                    "Call timestamps and duration",
                                                    "Call status (ringing, connected, ended)"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p>This data helps in tracking communication and enabling follow-up actions.</p>
                                        </div>
                                    </div>

                                    {/* Phone Numbers */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-id-badge"></i></span>
                                            Phone Numbers
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>We may collect phone numbers associated with calls to identify customers and link them with CRM records. This may include:</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Incoming caller numbers",
                                                    "Outgoing dialed numbers"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p>These numbers are used only for CRM operations such as lead management and call mapping.</p>
                                        </div>
                                    </div>

                                    {/* Device & Technical Information */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-smartphone"></i></span>
                                            Device & Technical Information
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>To ensure compatibility and performance, we may collect limited technical details such as:</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Device model and manufacturer",
                                                    "Operating system version",
                                                    "Application version"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p>This information helps us improve system stability and resolve technical issues.</p>
                                        </div>
                                    </div>

                                    {/* Usage & Diagnostic Data */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-settings"></i></span>
                                            Usage & Diagnostic Data
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>We may collect usage-related data to improve the application experience. This includes:</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Feature usage patterns",
                                                    "Error logs and crash reports",
                                                    "Performance metrics"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p>This data is used solely for improving functionality and reliability.</p>
                                        </div>
                                    </div>

                                </div>
                            </section>

                            {/* 4. How We Use Your Information */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">04</span>
                                    <span className="tracking-tight">How We Use Your Information</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        The information collected by Rynxly CRM is used exclusively to deliver and improve CRM functionality. We use this data to track calls, manage leads, schedule follow-ups, and provide insights into communication patterns.
                                    </p>
                                    <p className="font-bold text-[#263238]">In practical terms, your data helps us:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Maintain accurate call records within the CRM",
                                            "Enable real-time customer identification",
                                            "Improve team productivity and tracking",
                                            "Enhance application performance and stability"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2 font-bold text-[#4b33e8] bg-indigo-50/50 inline-block px-4 py-2 rounded-lg border border-indigo-100/50">
                                        We do not use your data for advertising or unrelated profiling activities.
                                    </p>
                                </div>
                            </section>

                            {/* 5. Permissions We Request & Justification */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">05</span>
                                    <span className="tracking-tight">Permissions We Request & Justification</span>
                                </h2>
                                <div className="space-y-6 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM requires certain device permissions to function correctly. Each permission is used strictly for a specific purpose.
                                    </p>

                                    {/* READ_CALL_LOG */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-phone-call"></i></span>
                                            Call Log Access <span className="text-[10px] text-gray-400 font-mono bg-white border border-gray-200 px-2 py-1 rounded ml-2 shadow-sm">(READ_CALL_LOG)</span>
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>We use this permission to access call history after a call ends, ensuring accurate tracking of call activity across different Android versions.</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Retrieve incoming, outgoing, and missed calls",
                                                    "Maintain CRM call records"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* READ_PHONE_STATE */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-smartphone"></i></span>
                                            Phone State <span className="text-[10px] text-gray-400 font-mono bg-white border border-gray-200 px-2 py-1 rounded ml-2 shadow-sm">(READ_PHONE_STATE)</span>
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>This permission allows the application to detect call status in real time.</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Identify ringing, active, and ended calls",
                                                    "Trigger CRM workflows automatically"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* SYSTEM_ALERT_WINDOW */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-browser"></i></span>
                                            Overlay Permission <span className="text-[10px] text-gray-400 font-mono bg-white border border-gray-200 px-2 py-1 rounded ml-2 shadow-sm">(SYSTEM_ALERT_WINDOW)</span>
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>This permission enables a floating popup during calls.</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Display customer details in real-time",
                                                    "Allow quick actions like notes and follow-ups"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Foreground Service */}
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-refresh"></i></span>
                                            Foreground Service
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <p>This allows the app to run reliably in the background.</p>
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Monitor call events continuously",
                                                    "Ensure uninterrupted tracking"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </section>

                            {/* 6. Background Processing */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">06</span>
                                    <span className="tracking-tight">Background Processing</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM uses background services to ensure that call tracking continues even when the app is not actively in use. This is a core requirement for the application to function as a real-time CRM system.
                                    </p>
                                    <p className="font-bold text-[#263238]">These services:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Listen to telephony state changes",
                                            "Process call events instantly",
                                            "Sync data with CRM servers"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2">Without background processing, the application would not be able to provide accurate or reliable call tracking.</p>
                                </div>
                            </section>

                            {/* 7. Data Sharing & Disclosure */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">07</span>
                                    <span className="tracking-tight">Data Sharing & Disclosure</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly respects your privacy and does not sell or rent your personal data. However, data may be shared in limited scenarios to support functionality and comply with legal obligations.
                                    </p>
                                    <p className="font-bold text-[#263238]">Data may be shared:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Within your organization for team-based CRM usage",
                                            "With trusted service providers (cloud, analytics)",
                                            "When required by law or legal authorities"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2 font-bold text-[#263238]">All data sharing is controlled and limited to necessary use cases.</p>
                                </div>
                            </section>

                            {/* 8. Data Security */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">08</span>
                                    <span className="tracking-tight">Data Security</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        We implement industry-standard security measures to protect your information. This includes secure communication channels, restricted access controls, and continuous monitoring of systems.
                                    </p>
                                    <p className="font-bold text-[#263238]">Our goal is to protect your data from:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Unauthorized access",
                                            "Data breaches",
                                            "Misuse or disclosure"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 9. Data Retention */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">09</span>
                                    <span className="tracking-tight">Data Retention</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly retains data only for as long as necessary to provide CRM services and meet legal requirements. Data associated with active accounts is maintained to ensure continuous functionality.
                                    </p>
                                    <p className="font-bold text-[#263238]">
                                        Users may request deletion of their data at any time.
                                    </p>
                                </div>
                            </section>

                            {/* 10. User Rights & Control */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">10</span>
                                    <span className="tracking-tight">User Rights & Control</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        You have full control over your data and permissions. You can manage your privacy preferences directly from your device or by contacting us.
                                    </p>
                                    <p className="font-bold text-[#263238]">You have the right to:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Revoke permissions at any time",
                                            "Request access to your data",
                                            "Request deletion of your data",
                                            "Stop using the application at any time"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 11. Third-Party Services */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">11</span>
                                    <span className="tracking-tight">Third-Party Services</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly may use trusted third-party services to support infrastructure and functionality. These may include:
                                    </p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Cloud hosting providers",
                                            "Analytics tools",
                                            "Notification systems"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p>These services operate under their own privacy policies.</p>
                                </div>
                            </section>

                            {/* 12. Children’s Privacy */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">12</span>
                                    <span className="tracking-tight">Children’s Privacy</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM is intended for business use and is not designed for individuals under the age of 18. We do not knowingly collect personal data from children.
                                    </p>
                                </div>
                            </section>

                            {/* 13. Policy Updates */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">13</span>
                                    <span className="tracking-tight">Policy Updates</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        We may update this Privacy Policy from time to time to reflect changes in features, legal requirements, or operational practices.
                                    </p>
                                    <p>
                                        Users will be notified of significant changes through the application or other appropriate channels.
                                    </p>
                                </div>
                            </section>

                            {/* 14. Contact Information */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">14</span>
                                    <span className="tracking-tight">Contact Information</span>
                                </h2>
                                <div className="space-y-6 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        If you have any questions, concerns, or requests regarding this Privacy Policy, you can contact us:
                                    </p>
                                    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50 inline-block">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl text-[#4b33e8] shadow-sm border border-indigo-100"><i className="fi flex fi-rr-envelope"></i></span>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email Support</p>
                                                    <a href="mailto:support@rynxly.in" className="font-bold text-[#263238] hover:text-[#4b33e8] transition-colors">support@rynxly.in</a>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl text-[#4b33e8] shadow-sm border border-indigo-100"><i className="fi flex fi-rr-globe"></i></span>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Website</p>
                                                    <a href="https://www.rynxly.in" target="_blank" rel="noopener noreferrer" className="font-bold text-[#263238] hover:text-[#4b33e8] transition-colors">www.rynxly.in</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                        
                        {/* Footer decorative element */}
                        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-[#4b33e8] font-bold tracking-widest text-[10px] uppercase">
                                <i className="fi flex fi-rr-shield-check text-base"></i>
                                <span>Protected by Rynxly</span>
                            </div>
                            <div className="text-gray-400 text-xs font-medium">
                                <a href="https://www.rynxly.in/privacy-policy" className="hover:text-[#4b33e8] transition-colors">www.rynxly.in/privacy-policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
