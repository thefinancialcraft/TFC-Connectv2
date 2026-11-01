import React from 'react';
import Head from 'next/head';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

export default function DataDeletion() {
    return (
        <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <Head>
                <title>Data Deletion Instructions | Rynxly CRM</title>
                <meta name="description" content="How to request access to or deletion of personal data and Meta Lead Ads data held in Rynxly CRM." />
                <link rel="canonical" href="https://www.rynxly.in/data-deletion" />
            </Head>

            <LandingNavbar />

            <header className="relative pt-24 pb-10 bg-white overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 mb-4">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase">Privacy & Data Requests</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#263238] mb-4 leading-tight">
                        Data Deletion Instructions
                    </h1>
                    <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-500 leading-relaxed">
                        You can ask Rynxly to find and delete personal information held in a Rynxly CRM workspace, including information received through Meta Lead Ads.
                    </p>
                </div>
            </header>

            <main className="py-14 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 p-7 md:p-12 space-y-10 text-[#333e48]">
                        <section className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-bold text-[#263238]">How to submit a request</h2>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                Email <a className="font-bold text-indigo-600 hover:underline" href="mailto:support@rynxly.in?subject=Data%20deletion%20request">support@rynxly.in</a> with the subject <strong>Data deletion request</strong>. If your information is held in a business or organization workspace, you can also contact that organization's Rynxly administrator and ask them to submit or authorize the request.
                            </p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">Please include enough information for us to identify the correct record:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-sm md:text-base leading-relaxed">
                                <li>Your name and a safe way to contact you about the request.</li>
                                <li>The business or organization workspace name, if known.</li>
                                <li>The phone number or other contact detail used on the lead form, and the Meta Page, form, campaign, or approximate submission date if known.</li>
                                <li>A clear statement that you are requesting deletion of your information.</li>
                            </ul>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Do not send account passwords, access tokens, or unnecessary identity documents by email. We may ask for reasonable additional information to verify your identity or your authority to act for the organization before changing or deleting a record.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-bold text-[#263238]">What happens next</h2>
                            <ol className="list-decimal pl-6 space-y-3 text-gray-600 text-sm md:text-base leading-relaxed">
                                <li>Rynxly support reviews the request and verifies it as needed to protect the person and organization connected to the record.</li>
                                <li>We identify matching CRM lead records and, where applicable, related Meta lead synchronization records in the relevant workspace.</li>
                                <li>We process deletion of the matching information or explain if we need more details or cannot delete some information for a legal, security, or dispute-resolution reason.</li>
                                <li>We reply to the contact address provided when we have processed the request or need more information.</li>
                            </ol>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                A Meta account administrator can disconnect the Meta integration to stop future synchronization. Disconnecting does not itself delete lead records already imported into Rynxly; submit a separate request using the instructions above to request deletion of existing data.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-bold text-[#263238]">Scope and retention</h2>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                A deletion request may cover a CRM lead record and associated imported form details and synchronization records that identify the lead. Some limited information may need to be retained where required by law or where reasonably necessary for security, fraud prevention, or resolving disputes. If information must be retained, it will remain subject to applicable access and use restrictions.
                            </p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                For more information about how Rynxly handles personal information, see the <a href="/privacy-policy" className="font-bold text-indigo-600 hover:underline">Privacy Policy</a>. These instructions apply to information held in Rynxly CRM; they do not delete information held by Meta or another service. You may need to contact those services separately.
                            </p>
                        </section>

                        <div className="pt-6 border-t border-gray-100 text-sm text-gray-500">
                            Questions? Contact <a className="font-bold text-indigo-600 hover:underline" href="mailto:support@rynxly.in">support@rynxly.in</a>.
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
