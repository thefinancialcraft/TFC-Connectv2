import React from 'react';
import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Head>
                <title>Terms of Service | Rynxly CRM</title>
                <meta name="description" content="Terms of Service for Rynxly CRM - Learn about the terms governing your use of our application." />
                <link rel="canonical" href="https://www.rynxly.in/terms" />
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
                        Terms of Service
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
                            
                            {/* 1. Acceptance of Terms */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">01</span>
                                    <span className="tracking-tight">Acceptance of Terms</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        By downloading, installing, or using Rynxly CRM (“Rynxly”, “we”, “our”, or “us”), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the application.
                                    </p>
                                    <p>
                                        These Terms govern your access to and use of the Rynxly CRM mobile application and related services.
                                    </p>
                                </div>
                            </section>

                            {/* 2. Description of Service */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">02</span>
                                    <span className="tracking-tight">Description of Service</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM is a SIM-based calling Customer Relationship Management platform designed to help businesses manage customer interactions, track call activity, and streamline sales and support workflows.
                                    </p>
                                    <p className="font-bold text-[#263238]">The platform provides features such as:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Call tracking (incoming, outgoing, missed calls)",
                                            "CRM lead management",
                                            "Call popups (overlay interface)",
                                            "Follow-ups and activity tracking",
                                            "Team-based performance monitoring"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2 font-bold text-[#263238]">
                                        Rynxly relies on device-level telephony integration to deliver its core functionality.
                                    </p>
                                </div>
                            </section>

                            {/* 3. User Eligibility */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">03</span>
                                    <span className="tracking-tight">User Eligibility</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>By using Rynxly CRM, you confirm that:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "You are at least 18 years old",
                                            "You are using the app for business or professional purposes",
                                            "You have the authority to use the app on behalf of your organization (if applicable)"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 4. User Responsibilities */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">04</span>
                                    <span className="tracking-tight">User Responsibilities</span>
                                </h2>
                                <div className="space-y-6 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>You agree to use Rynxly CRM responsibly and in compliance with applicable laws.</p>
                                    
                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-indigo-50 text-[#4b33e8] rounded-xl flex items-center justify-center text-lg border border-indigo-100/50 shadow-sm"><i className="fi flex fi-rr-check-circle"></i></span>
                                            You must:
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Provide accurate and valid information",
                                                    "Use the app only for legitimate business purposes",
                                                    "Ensure that you have the right to access and manage the call data processed"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-red-50/30 rounded-2xl p-6 border border-red-100">
                                        <h4 className="text-lg font-bold text-[#263238] mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-lg border border-red-100 shadow-sm"><i className="fi flex fi-rr-cross-circle"></i></span>
                                            You must NOT:
                                        </h4>
                                        <div className="pl-13 space-y-3">
                                            <ul className="space-y-2 ml-2">
                                                {[
                                                    "Use the app for unlawful or fraudulent activities",
                                                    "Attempt to reverse-engineer or misuse the system",
                                                    "Interfere with the app’s functionality or services"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 5. Permissions & Device Access */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">05</span>
                                    <span className="tracking-tight">Permissions & Device Access</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM requires certain permissions to function correctly, including access to call logs, phone state, and overlay display.
                                    </p>
                                    <p className="font-bold text-[#263238]">By using the application, you agree to grant necessary permissions for:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Call tracking and CRM logging",
                                            "Real-time call state detection",
                                            "Displaying call-related information via overlay"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2">You may revoke permissions at any time, but doing so may limit or disable core functionality.</p>
                                </div>
                            </section>

                            {/* 6. Data Usage & Privacy */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">06</span>
                                    <span className="tracking-tight">Data Usage & Privacy</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Your use of Rynxly CRM is also governed by our <a href="/privacy-policy" className="text-indigo-600 font-bold hover:underline">Privacy Policy</a>.
                                    </p>
                                    <p className="font-bold text-[#263238]">By using the app, you acknowledge that:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Call-related data will be processed for CRM functionality",
                                            "Data may be stored and synced with CRM systems",
                                            "Data handling practices are described in the Privacy Policy"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 7. Account & Organizational Use */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">07</span>
                                    <span className="tracking-tight">Account & Organizational Use</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p className="font-bold text-[#263238]">If you are using Rynxly CRM as part of a team or organization:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Your data may be accessible to authorized team members",
                                            "Your organization may manage your access and permissions",
                                            "Data ownership may be governed by your organization"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2">You are responsible for maintaining the confidentiality of your account.</p>
                                </div>
                            </section>

                            {/* 8. Service Availability */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">08</span>
                                    <span className="tracking-tight">Service Availability</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly CRM aims to provide reliable and uninterrupted service. However, we do not guarantee that the application will always function without interruptions.
                                    </p>
                                    <p className="font-bold text-[#263238]">Service may be affected by:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Device limitations",
                                            "Android OS restrictions",
                                            "Network issues",
                                            "Third-party dependencies"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2">We reserve the right to modify, suspend, or discontinue features at any time.</p>
                                </div>
                            </section>

                            {/* 9. Limitation of Liability */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">09</span>
                                    <span className="tracking-tight">Limitation of Liability</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p className="font-bold text-[#263238]">To the maximum extent permitted by law, Rynxly shall not be liable for:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Any indirect, incidental, or consequential damages",
                                            "Loss of data, business, or revenue",
                                            "Issues arising from device or OS restrictions",
                                            "Misuse of the application by users"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2 font-bold text-[#263238]">The app is provided on an “as-is” and “as-available” basis.</p>
                                </div>
                            </section>

                            {/* 10. Prohibited Use */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">10</span>
                                    <span className="tracking-tight">Prohibited Use</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p className="font-bold text-[#263238]">You agree not to:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Use the app to monitor individuals without proper authorization",
                                            "Violate privacy or data protection laws",
                                            "Use the app for spam, harassment, or illegal communication",
                                            "Exploit the system for unintended purposes"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2">Violation of these terms may result in suspension or termination of access.</p>
                                </div>
                            </section>

                            {/* 11. Termination */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">11</span>
                                    <span className="tracking-tight">Termination</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p className="font-bold text-[#263238]">We reserve the right to suspend or terminate your access to Rynxly CRM if:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "You violate these Terms",
                                            "You misuse the application",
                                            "Required permissions are revoked affecting functionality"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="pt-2">You may stop using the app at any time.</p>
                                </div>
                            </section>

                            {/* 12. Intellectual Property */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">12</span>
                                    <span className="tracking-tight">Intellectual Property</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        All rights related to Rynxly CRM, including software, design, branding, and functionality, are owned by Rynxly.
                                    </p>
                                    <p className="font-bold text-[#263238]">You may not:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Copy, modify, or distribute the application",
                                            "Use branding without permission"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 13. Third-Party Services */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">13</span>
                                    <span className="tracking-tight">Third-Party Services</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Rynxly may rely on third-party services such as:
                                    </p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Cloud hosting providers",
                                            "Analytics tools",
                                            "Notification services"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p>We are not responsible for the behavior or policies of third-party services.</p>
                                </div>
                            </section>

                            {/* 14. Changes to Terms */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">14</span>
                                    <span className="tracking-tight">Changes to Terms</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        We may update these Terms of Service from time to time.
                                    </p>
                                    <p className="font-bold text-[#263238]">In case of significant changes:</p>
                                    <ul className="space-y-2 ml-4">
                                        {[
                                            "Users may be notified within the app",
                                            "Continued use implies acceptance of updated terms"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] mt-2.5 shrink-0"></div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 15. Governing Law */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">15</span>
                                    <span className="tracking-tight">Governing Law</span>
                                </h2>
                                <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        These Terms shall be governed by and interpreted in accordance with the laws of India.
                                    </p>
                                    <p>
                                        Any disputes arising from the use of Rynxly CRM shall be subject to the jurisdiction of appropriate courts in India.
                                    </p>
                                </div>
                            </section>

                            {/* 16. Contact Information */}
                            <section>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#263238] mb-4 tracking-tight flex items-baseline gap-4">
                                    <span className="text-indigo-200 text-3xl font-black opacity-50 select-none">16</span>
                                    <span className="tracking-tight">Contact Information</span>
                                </h2>
                                <div className="space-y-6 text-gray-500 text-sm md:text-base leading-relaxed">
                                    <p>
                                        For any questions regarding these Terms:
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
                                <a href="https://www.rynxly.in/terms" className="hover:text-[#4b33e8] transition-colors">www.rynxly.in/terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
