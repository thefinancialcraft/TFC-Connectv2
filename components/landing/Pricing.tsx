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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        teamStrength: ''
    });

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Here you would typically send data to your backend
        console.log("Form Submitted:", formData);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setIsModalOpen(false);
            setFormData({ name: '', email: '', phone: '', teamStrength: '' });
        }, 3000);
    };

    return (
        <div id="pricing" className="py-24 bg-gray-950 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header - Styled like IndustrySolutions/Features */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-sm font-bold tracking-wide text-indigo-400 uppercase mb-3">Investment</h2>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Pricing <span className="text-indigo-400">Plans</span>
                    </h2>
                    <p className="text-base text-gray-400">
                        Transparent pricing for high-performance teams. Scale your sales engine without breaking the bank.
                    </p>
                </div>

                {/* Pricing Console - Integrated Design (Desktop/Tablet) */}
                <div className="hidden lg:block max-w-6xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
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
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full sm:w-auto px-10 py-4 bg-[#4b33e8] text-white rounded-2xl font-black text-base hover:bg-[#3b27b8] transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200"
                                >
                                    Get Started with {plans[activeIdx].name}
                                </button>
                                <p className="text-[11px] text-gray-400 font-medium">No hidden fees. 24/7 dedicated support.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View: Swipeable Carousel */}
                <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-12 -mx-4 scrollbar-hide">
                    {plans.map((plan, i) => (
                        <div key={i} className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-indigo-100/20 flex flex-col relative">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4b33e8] flex items-center justify-center text-xl">
                                        <i className={`fi ${plan.icon}`}></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 leading-none mb-1">{plan.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{plan.period}</p>
                                    </div>
                                </div>
                                {plan.badge && (
                                    <span className="text-[9px] bg-[#4b33e8] text-white px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                                        {plan.badge}
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-baseline justify-center">
                                    <span className="text-4xl font-black text-[#4b33e8]">₹{plan.price}</span>
                                    <span className="text-sm font-bold text-gray-400 ml-1">/mo</span>
                                </div>
                                {plan.minUsers && (
                                    <p className="text-[10px] font-bold text-orange-600 mt-1 text-center uppercase tracking-wide">Min {plan.minUsers} users</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2 text-center leading-tight">"{plan.desc}"</p>
                            </div>

                            {/* Features Compact */}
                            <div className="flex-1 space-y-2 mb-6">
                                {sharedFeatures.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                             <i className="fi fi-rr-check text-[8px] flex"></i>
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium">{feature.title}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Button */}
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-3 bg-[#4b33e8] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-[#3b27b8] active:scale-95 transition-all"
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
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
                         <a 
                            href="tel:+918882558932"
                            className="w-full block py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl font-bold text-sm transition-all"
                         >
                             Contact Sales
                         </a>
                    </div>
                </div>

            </div>

             {/* Booking Modal */}
             {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <i className="fi fi-rr-cross-small flex text-xl"></i>
                        </button>

                        {!isSubmitted ? (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4b33e8] flex items-center justify-center text-2xl mx-auto mb-4">
                                        <i className="fi fi-rr-rocket-lunch flex"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Get Started</h3>
                                    <p className="text-gray-500 text-sm mt-2">Fill in your details to kickstart your sales engine.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-[#4b33e8] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-[#4b33e8] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-[#4b33e8] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1.5">Team Strength</label>
                                        <select 
                                            name="teamStrength"
                                            required
                                            value={formData.teamStrength}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-[#4b33e8] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm font-medium text-gray-600"
                                        >
                                            <option value="">Select team size</option>
                                            <option value="1-10">1 - 10 Agents</option>
                                            <option value="11-50">11 - 50 Agents</option>
                                            <option value="51-200">51 - 200 Agents</option>
                                            <option value="200+">200+ Agents</option>
                                        </select>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-3.5 bg-[#4b33e8] text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all mt-4"
                                    >
                                        Submit Request
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-4xl mx-auto mb-6">
                                    <i className="fi fi-rr-check flex"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                                <p className="text-gray-500 max-w-[260px] mx-auto">
                                    Thanks {formData.name}, our executive will connect with you shortly.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
