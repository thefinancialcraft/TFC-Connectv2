import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

const blogs = [
    {
        id: 1,
        title: "The Rynxly Story: Why we built a CRM for the SIM Era",
        excerpt: "Discover the journey from messy spreadsheets to a unified calling engine. How real-world sales friction led to a mobile-first revolution.",
        category: "Company",
        author: "Founding Team",
        date: "Feb 10, 2026",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", // Team collaborating
        readTime: "5 min read",
        featured: true
    },
    {
        id: 2,
        title: "GSM vs VOIP: The Connectivity Battle for Modern Sales",
        excerpt: "Why high-growth sales teams are ditching virtual numbers for the reliability of the SIM network. Connectivity is the new ROI.",
        category: "Connectivity",
        author: "Tech Strategy",
        date: "Feb 11, 2026",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800", // Digital networking
        readTime: "4 min read"
    },
    {
        id: 3,
        title: "The Zero-Overdue Policy: How to Force Sales Discipline",
        excerpt: "Passive tracking is dead. Learn how Rynxly's disciplinary engine ensures every lead is followed up by design, not by chance.",
        category: "Performance",
        author: "Growth Lead",
        date: "Feb 12, 2026",
        image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800", // Task management/Discipline
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Data Theft Protective: Is Your Customer List Walking Out?",
        excerpt: "In a mobile world, your database is vulnerable. Discover how number masking keeps your most valuable asset safe within the company.",
        category: "Security",
        author: "Security Team",
        date: "Feb 09, 2026",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", // Cyber security
        readTime: "5 min read"
    },
    {
        id: 5,
        title: "Automation vs. Spreadsheets: A Real-World ROI Audit",
        excerpt: "We audited 500+ spreadsheets to see exactly how much revenue is lost to manual entry errors. The results are shocking.",
        category: "Strategy",
        author: "Data Analytics",
        date: "Feb 08, 2026",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", // Charts/Data
        readTime: "7 min read"
    }
];

export default function BlogListing() {
    const featuredPost = blogs.find(b => b.featured);
    const regularPosts = blogs.filter(b => !b.featured);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Head>
                <title>Blog | Rynxly SIM Based Calling CRM & Sales Strategy</title>
                <meta name="description" content="Expert insights on SIM based calling CRM, sales automation, and lead management. Scale your sales with data-driven strategies from Rynxly." />
                <meta name="keywords" content="sales blog, calling CRM insights, sales automation tips, lead management blog" />
                <link rel="canonical" href="https://www.rynxly.in/blog" />
                <meta property="og:title" content="Blog | Rynxly SIM Based Calling CRM & Sales Strategy" />
                <meta property="og:description" content="Expert insights on SIM based calling CRM, sales automation, and lead management." />
                <meta property="og:url" content="https://www.rynxly.in/blog" />
            </Head>

            <LandingNavbar />

            {/* Hero Header */}
            <div className="relative pt-32 pb-20 bg-[#fcfcff] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-50 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-50 blur-[120px]" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6 sm:mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-[#4b33e8] tracking-widest uppercase">The Closing Blog</span>
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#263238] mb-6 tracking-tight leading-tight">
                        Insights for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">High-Performance</span> Teams
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base leading-relaxed">
                        Master the art of mobile sales automation. Everything you need to know about GSM connectivity, lead management, and closing deals.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
                {/* Featured Post */}
                {featuredPost && (
                    <div className="group relative mb-24 cursor-pointer">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative overflow-hidden rounded-[2.5rem] aspect-[16/10] shadow-2xl">
                                <img 
                                    src={featuredPost.image} 
                                    alt={featuredPost.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-[#4b33e8] text-[10px] font-black uppercase tracking-widest">
                                        {featuredPost.category}
                                    </span>
                                    <span className="text-gray-400 text-xs font-medium">{featuredPost.date}</span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold text-[#263238] mb-6 tracking-tight leading-tight group-hover:text-[#4b33e8] transition-colors">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-[#4b33e8] font-bold">
                                        R
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#263238]">{featuredPost.author}</p>
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{featuredPost.readTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 gap-y-20">
                    {regularPosts.map((post) => (
                        <div key={post.id} className="group flex flex-col cursor-pointer bg-white rounded-[2rem] transition-all hover:-translate-y-4">
                            <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] mb-8 shadow-xl">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#263238]/20 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur shadow-lg text-[#263238] text-[9px] font-black uppercase tracking-widest">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex-1 px-2">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{post.date}</span>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{post.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#263238] mb-4 tracking-tight leading-tight group-hover:text-[#4b33e8] transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] text-[#4b33e8] font-bold">R</div>
                                        <span className="text-xs font-bold text-gray-600">{post.author}</span>
                                    </div>
                                    <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[#4b33e8] group-hover:bg-[#4b33e8] group-hover:text-white transition-all transform group-hover:rotate-45">
                                        <i className="fi fi-rr-arrow-right flex text-[10px]"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-40 relative rounded-[3rem] bg-[#263238] p-12 md:p-20 overflow-hidden text-center">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#4b33e8] opacity-20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 opacity-20 rounded-full blur-[100px]"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 tracking-tight leading-tight">
                            Stop Managing Spreadsheets.<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b33e8] to-[#806bf9]">Start Closing Deals.</span>
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base mb-12 max-w-2xl mx-auto leading-relaxed">
                            Join the revolution in mobile sales calling. Deploy Rynxly in 10 minutes and watch your conversion rates skyrocket.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#4b33e8] text-white font-black text-xs uppercase tracking-[0.15em] transition-all shadow-2xl shadow-indigo-500/20 hover:bg-[#3b27b8] hover:-translate-y-1">
                                Get Started for Free
                            </a>
                            <a href="#contact" className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-white/20 text-white font-black text-xs uppercase tracking-[0.15em] transition-all hover:bg-white/5 hover:border-white/40">
                                Contact Sales Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
