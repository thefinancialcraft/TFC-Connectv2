import { useState } from 'react';

const plans = [
    {
        name: "Spark",
        icon: "fi-rr-bolt flex",
        period: "Monthly",
        price: 700,
        minUsers: 10,
        desc: "Perfect for starting teams",
        badge: "STARTER"
    },
    {
        name: "Boost",
        icon: "fi-rr-rocket-lunch flex",
        period: "Monthly",
        price: 500,
        minUsers: 20,
        desc: "Faster calling, better tracking",
        badge: "GROWTH"
    },
    {
        name: "Surge",
        icon: "fi-rr-flame flex",
        period: "Quarterly",
        price: 450,
        minUsers: 20,
        desc: "Scale performance with savings",
        badge: "MOST POPULAR",
        highlight: true
    },
    {
        name: "Prime",
        icon: "fi-rr-star flex",
        period: "Half-Yearly",
        price: 400,
        minUsers: 20,
        desc: "Strong value for growing teams",
        badge: "RECOMMENDED"
    },
    {
        name: "Elite",
        icon: "fi-rr-crown flex",
        period: "Yearly",
        price: 350,
        minUsers: 20,
        desc: "Maximum savings. Maximum control.",
        badge: "BEST VALUE",
        highlight: true
    }
];

const sharedFeatures = [
    { title: "Call Tracking", icon: "fi-rr-target flex" },
    { title: "Talk Time", icon: "fi-rr-clock flex" },
    { title: "Daily Dials", icon: "fi-rr-chart-histogram flex" },
    { title: "Sim Based Calls", icon: "fi-rr-sim-card flex" },
    { title: "Smart Followup", icon: "fi-rr-redo flex" },
    { title: "100% Leads Consumption", icon: "fi-rr-stats flex" },
    { title: "Team Management", icon: "fi-rr-users flex" },
    { title: "Masked Contacts", icon: "fi-rr-eye-crossed flex" },
    { title: "Lead Protection", icon: "fi-rr-shield-check flex" },
    { title: "Lead Assignment", icon: "fi-rr-user-add flex" },
    { title: "Customer Support", icon: "fi-rr-headset flex" },
    { title: "Easy to Use UI", icon: "fi-rr-magic-wand flex" }
];

export default function Pricing() {
    const [activeIdx, setActiveIdx] = useState(2); // Surge (Most Popular)

    return (
        <div id="pricing" className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header - Styled like IndustrySolutions/Features */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-sm font-bold tracking-wide text-[#4b33e8] uppercase mb-3">Investment</h2>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Pricing <span className="text-[#4b33e8]">Plans</span>
                    </h2>
                    <p className="text-base text-gray-500">
                        Transparent pricing for high-performance teams. Scale your sales engine without breaking the bank.
                    </p>
                </div>

                {/* Pricing Console - Integrated Design */}
                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        
                        {/* Sidebar Selector - Unified with site theme */}
                        <div className="w-full lg:w-1/3 bg-gray-50/80 p-6 lg:p-8 border-r border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Subscription Period</p>
                            <div className="space-y-3">
                                {plans.map((plan, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveIdx(idx)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                                            activeIdx === idx 
                                            ? 'bg-white shadow-md border-l-4 border-[#4b33e8] ring-1 ring-gray-100' 
                                            : 'hover:bg-gray-100 bg-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeIdx === idx ? 'bg-[#4b33e8] text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                                <i className={`fi ${plan.icon} text-sm`}></i>
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold text-sm ${activeIdx === idx ? 'text-gray-900' : 'text-gray-500'}`}>{plan.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{plan.period}</p>
                                            </div>
                                        </div>
                                        {plan.badge && idx === activeIdx && (
                                            <span className="text-[9px] bg-[#4b33e8]/10 text-[#4b33e8] px-2 py-0.5 rounded-full font-bold">
                                                {plan.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Info Box */}
                            <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                <div className="flex gap-3">
                                    <i className="fi fi-rr-info flex text-[#4b33e8] mt-0.5"></i>
                                    <p className="text-[11px] text-[#4b33e8] font-medium leading-relaxed">
                                        All plans include full CRM features. Lower prices are secured via longer billing commitments.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Plan Details Display - Unified with Hero/Showcase */}
                        <div className="flex-1 p-8 lg:p-12 flex flex-col">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-50 pb-10 mb-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#4b33e8] text-[10px] font-black uppercase tracking-widest mb-4">
                                        Active Selection
                                    </div>
                                    <h4 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4b33e8] flex items-center justify-center text-2xl shadow-sm border border-indigo-100/50">
                                            <i className={`fi ${plans[activeIdx].icon}`}></i>
                                        </div>
                                        {plans[activeIdx].name}
                                    </h4>
                                    <p className="text-gray-500 text-sm font-medium">{plans[activeIdx].desc}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end">
                                        <span className="text-5xl font-black text-[#4b33e8]">₹{plans[activeIdx].price}</span>
                                        <span className="text-sm font-bold text-gray-400 ml-1">/mo</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Billed {plans[activeIdx].period.toLowerCase()}</p>
                                    
                                    {/* Simple Min Users Label */}
                                    {plans[activeIdx].minUsers && (
                                        <p className="mt-3 text-sm font-black text-orange-600 uppercase tracking-wide">
                                            Min {plans[activeIdx].minUsers} users
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                                {sharedFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center text-xs group-hover:bg-[#4b33e8] group-hover:text-white transition-all">
                                            <i className={`fi ${feature.icon}`}></i>
                                        </div>
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{feature.title}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-12 flex flex-col sm:flex-row items-center gap-4">
                                <button className="w-full sm:w-auto px-10 py-4 bg-[#4b33e8] text-white rounded-2xl font-black text-base hover:bg-[#3b27b8] transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200">
                                    Get Started with {plans[activeIdx].name}
                                </button>
                                <p className="text-[11px] text-gray-400 font-medium">No hidden fees. 24/7 dedicated support.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Volume Discounts Section - Styled like Pricing Console */}
                <div className="mt-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-[#0F172A] rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-3">Enterprise Grade</p>
                                <h4 className="text-3xl font-bold mb-3 italic">Volume Discounts 💸</h4>
                                <p className="text-gray-400 text-sm max-w-sm">Scaling fast? We offer additional savings for teams exceeding 50 agents.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">50+ Users</p>
                                    <p className="text-xl font-black text-amber-400">10% OFF</p>
                                </div>
                                <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">100+ Users</p>
                                    <p className="text-xl font-black text-emerald-400">20% OFF</p>
                                </div>
                            </div>
                         </div>
                    </div>
                    <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 border border-gray-100 flex flex-col justify-center items-center text-center">
                         <h5 className="text-lg font-bold text-gray-900 mb-2">Need a Custom Plan?</h5>
                         <p className="text-xs text-gray-500 mb-6">Tailored solutions for large enterprises and BPOs.</p>
                         <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl font-bold text-sm transition-all">
                             Contact Sales
                         </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
