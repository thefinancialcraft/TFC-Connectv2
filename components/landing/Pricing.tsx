import { useState } from 'react';

const plans = [
    {
        name: "Elite",
        period: "Yearly",
        price: 350,
        minUsers: 20,
        desc: "The ultimate power package. Half the price, all the enterprise features.",
        badge: "Best Value",
        color: "bg-[#0a0c12]/80",
        border: "border-white/10"
    },
    {
        name: "Prime",
        period: "Half-Yearly",
        price: 400,
        minUsers: 20,
        desc: "Long-term stability with full insights for established sales engines.",
        badge: "",
        color: "bg-[#0a0c12]/80",
        border: "border-white/10"
    },
    {
        name: "Surge",
        period: "Quarterly",
        price: 450,
        minUsers: 20,
        desc: "High-performance features for scale. Includes priority support and analytics.",
        badge: "Most popular",
        highlight: true,
        color: "bg-gradient-to-b from-[#b8c6db] to-[#f5f7fa]",
        border: "border-black/5"
    },
    {
        name: "Boost",
        period: "Monthly",
        price: 500,
        minUsers: 20,
        desc: "Ideal for growing teams needing advanced lead tracking and voice memos.",
        badge: "",
        color: "bg-[#0a0c12]/80",
        border: "border-white/10"
    },
    {
        name: "Spark",
        period: "Monthly",
        price: 700,
        minUsers: 10,
        desc: "Perfect for small teams testing the waters with essential CRM tools.",
        badge: "",
        color: "bg-[#0a0c12]/80",
        border: "border-white/10"
    }
];

const sharedFeatures = [
    "100% Mobile Dashboard Sync",
    "Zero Follow-up Protocol",
    "Customer Lead Masking",
    "GSM SIM Card Integration",
    "Live Analytics Performance",
    "24/7 Dedicated Support",
    "Automated Call Log Reports"
];

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        teamStrength: ''
    });

    const handleOpenModal = (plan: any) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsSubmitted(false);
    };

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            handleCloseModal();
            setFormData({ name: '', email: '', phone: '', teamStrength: '' });
        }, 3000);
    };

    return (
        <section id="pricing" className="relative py-24 bg-[#01040a] overflow-hidden rounded-[4rem] mx-2 my-12 shadow-2xl shadow-indigo-500/20 group/pricing">
            {/* Texture & Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* texture grid background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Main Central Glow */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/30 blur-[130px] rounded-full"></div>
                
                {/* Accent Violet Glow Left */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/25 blur-[120px] rounded-full animate-pulse-slow"></div>
                
                {/* Accent Purple Glow Right */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/20 blur-[120px] rounded-full"></div>

                {/* Sophisticated Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
            </div>

            <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center pb-2 max-w-2xl mx-auto mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="px-3 py-1 rounded-full bg-indigo-50/10 border border-[#4b33e8]/20 text-[#4b33e8] text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
                        Investment & ROI
                    </span>
                    <h2 className="text-xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                        Flexible <span >Calling CRM Software</span> Plans
                    </h2>
                    <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed mb-4">
                        Scaling your sales engine for as low as ₹350/mo.
                    </p>
                </div>

                {/* Plan Carousel / Grid */}
                <div className="relative group/carousel">
                    {/* Navigation Buttons (Visible on Hover/Desktop) */}
                    <button 
                        onClick={() => {
                            const el = document.getElementById('pricing-scroll');
                            if (el) el.scrollBy({ left: -el.offsetWidth / 2, behavior: 'smooth' });
                        }}
                        className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
                    >
                        <i className="fi fi-rr-angle-left flex"></i>
                    </button>
                    <button 
                        onClick={() => {
                            const el = document.getElementById('pricing-scroll');
                            if (el) el.scrollBy({ left: el.offsetWidth / 2, behavior: 'smooth' });
                        }}
                        className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
                    >
                        <i className="fi fi-rr-angle-right flex"></i>
                    </button>

                    <div 
                        id="pricing-scroll"
                        className="flex overflow-x-auto snap-x snap-mandatory gap-5 pt-10 pb-8 scrollbar-hide px-2 items-stretch max-w-6xl mx-auto -mt-10"
                    >
                        {plans.map((plan, idx) => (
                            <div 
                                key={idx} 
                                className={`relative group shrink-0 w-[80vw] lg:w-[calc(33.33%-1rem)] snap-center flex flex-col p-[2px] rounded-[3rem] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-400 transition-all duration-300 hover:-translate-y-3`}
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                {/* Rotating Border Highlight (Hover only) */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_20%,#4b33e8_40%,#9333ea_50%,#4b33e8_60%,transparent_80%)] animate-[spin_2.5s_linear_infinite]"></div>
                                </div>

                                <div className={`relative z-10 flex flex-col h-full p-6 p-8 rounded-[3rem] border ${plan.border} ${plan.color} transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_rgba(75,51,232,0.15)]`}>
                                    {plan.badge && (
                                        <div className="absolute top-0 right-0">
                                            <span className={`text-[9px] font-bold tracking-tight px-3 py-1 rounded-full uppercase ${plan.highlight ? 'bg-[#4b33e8] text-white shadow-lg' : 'bg-white/10 text-white/80'}`}>
                                                {plan.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h4 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-slate-900' : 'text-white'}`}>{plan.name}</h4>
                                        <p className={`text-xs leading-relaxed mb-4 h-10 line-clamp-2 ${plan.highlight ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {plan.desc}
                                        </p>
                                        
                                        <div className="flex flex-col">
                                            <p className={`text-[9px] font-bold uppercase tracking-wider ${plan.highlight ? 'text-slate-500' : 'text-gray-500'}`}>
                                                Starting from
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-4xl font-black ${plan.highlight ? 'text-slate-900' : 'text-white'}`}>
                                                    ₹{plan.price}
                                                </span>
                                                <span className={`text-xs font-bold ${plan.highlight ? 'text-slate-500' : 'text-gray-500'}`}>
                                                    /user/mo
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Divider */}
                                    <div className="relative flex items-center justify-center mb-5">
                                        <div className={`flex-grow h-[1px] ${plan.highlight ? 'bg-slate-900/10' : 'bg-white/10'}`}></div>
                                        <span className={`mx-3 text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap ${plan.highlight ? 'text-slate-900/40' : 'text-white/20'}`}>
                                            Included Features
                                        </span>
                                        <div className={`flex-grow h-[1px] ${plan.highlight ? 'bg-slate-900/10' : 'bg-white/10'}`}></div>
                                    </div>

                                    {/* Features */}
                                    <div className="flex-1 space-y-3 mb-8">
                                        {sharedFeatures.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2.5">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${plan.highlight ? 'bg-[#4b33e8] text-white' : 'bg-white/10 text-white'}`}>
                                                    <i className="fi fi-rr-check flex"></i>
                                                </div>
                                                <span className={`text-xs font-medium tracking-tight ${plan.highlight ? 'text-slate-700' : 'text-gray-300'}`}>
                                                    {f}
                                                </span>
                                            </div>
                                        ))}
                                        {plan.minUsers && (
                                            <div className="pt-2">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${plan.highlight ? 'bg-slate-900/5 text-slate-900' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                                                    <i className="fi fi-rr-users flex"></i>
                                                    Min {plan.minUsers} Users
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <p className={`text-center text-[10px] font-black uppercase mb-3 tracking-wider ${plan.highlight ? 'text-slate-500' : 'text-gray-400'}`}>
                                        Billed {plan.period}
                                    </p>
                                    <button 
                                        onClick={() => handleOpenModal(plan)}
                                        className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] transition-all border ${
                                            plan.highlight 
                                            ? 'bg-[#4b33e8] text-white border-transparent shadow-xl hover:bg-[#3b27b8]' 
                                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        Get a consultation
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#000]/80 backdrop-blur-2xl" onClick={handleCloseModal}></div>
                    <div className="relative w-full max-w-lg bg-[#0a0c12] rounded-[2.5rem] border border-white/10 shadow-3xl p-10 animate-in zoom-in-95 duration-300">
                        <button onClick={handleCloseModal} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <i className="fi fi-rr-cross-small flex"></i>
                        </button>

                        {!isSubmitted ? (
                            <>
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-black text-white">Unlock {selectedPlan?.name}</h3>
                                    <p className="text-gray-500 mt-3 text-sm">Scale your sales team with Rynxly's professional SIM-based CRM.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input 
                                        name="name" required placeholder="Full Name" 
                                        onChange={handleInputChange} value={formData.name}
                                        className="w-full px-6 py-4 bg-[#01040a] border border-white/10 rounded-2xl focus:border-[#4b33e8] transition-all outline-none text-white text-sm"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            name="email" type="email" required placeholder="Email Address" 
                                            onChange={handleInputChange} value={formData.email}
                                            className="w-full px-6 py-4 bg-[#01040a] border border-white/10 rounded-2xl focus:border-[#4b33e8] transition-all outline-none text-white text-sm"
                                        />
                                        <input 
                                            name="phone" required placeholder="Mobile Number" 
                                            onChange={handleInputChange} value={formData.phone}
                                            className="w-full px-6 py-4 bg-[#01040a] border border-white/10 rounded-2xl focus:border-[#4b33e8] transition-all outline-none text-white text-sm"
                                        />
                                    </div>
                                    <select 
                                        name="teamStrength" required 
                                        onChange={handleInputChange} value={formData.teamStrength}
                                        className="w-full px-6 py-4 bg-[#01040a] border border-white/10 rounded-2xl focus:border-[#4b33e8] transition-all outline-none text-gray-400 text-sm"
                                    >
                                        <option value="">Agent Strength</option>
                                        <option value="1-10">1-10 Agents</option>
                                        <option value="11-50">11-50 Agents</option>
                                        <option value="50+">50+ Agents</option>
                                    </select>
                                    <button className="w-full py-5 mt-4 bg-[#4b33e8] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-indigo-500/20 hover:bg-[#3b27b8] transition-all">
                                        Activate Plan
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-10 animate-in fade-in zoom-in-95">
                                <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-4xl mx-auto mb-8 border border-emerald-500/20">
                                    <i className="fi fi-rr-check flex"></i>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2">Success!</h3>
                                <p className="text-gray-400 text-sm">Our expert will call you shortly on <strong>{formData.phone}</strong>.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 10s ease-in-out infinite;
                }
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
        </section>
    );
}
