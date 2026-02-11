import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teamStrength, setTeamStrength] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            company: formData.get('company') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            team_strength: formData.get('team_strength') as string,
            address: formData.get('address') as string,
            city: formData.get('city') as string,
            country: formData.get('country') as string,
            pincode: formData.get('pincode') as string,
            notes: formData.get('notes') as string,
        };

        try {
            const { error: submitError } = await supabase
                .from('contact_requests')
                .insert([data]);

            if (submitError) throw submitError;
            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            console.error('Error submitting form:', err);
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="relative py-20 bg-[#01040a] overflow-hidden">
            {/* Advanced Atmospheric Glowing Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Main Central Glow */}
                <div className="absolute top-[-20%] right-[10%] w-[800px] h-[600px] bg-indigo-500/20 blur-[130px] rounded-full"></div>
                
                {/* Accent Violet Glow Bottom Left */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/15 blur-[120px] rounded-full animate-pulse-slow"></div>
                
                {/* Accent Purple Glow Middle Right */}
                <div className="absolute top-1/2 -translate-y-1/2 right-[-5%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>

                {/* Subtle Grid for Depth */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Content */}
                    <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                        <span className="px-3 py-1 rounded-full bg-indigo-50/10 border border-[#4b33e8]/20 text-[#4b33e8] text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                            Scale Your Growth
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Ready to build your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Sales DNA?</span>
                        </h2>
                        <p className="text-sm md:text-base text-gray-400 mb-8 leading-relaxed max-w-lg">
                            Deploy Rynxly and transform your sales team into a high-performance machine. Our team will contact you within 24 hours.
                        </p>

                        <div className="space-y-6">
                            {[
                                { 
                                    title: "Customized Demo", 
                                    desc: "See exactly how Rynxly fits your specific industry and workflow.", 
                                    icon: "fi-rr-headset"
                                },
                                { 
                                    title: "Setup Assistance", 
                                    desc: "We'll help you import your data and configure your first campaign.", 
                                    icon: "fi-rr-cloud-check"
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#4b33e8] shadow-sm shrink-0">
                                        <i className={`fi ${item.icon} flex text-base`}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form Container */}
                    <div className="relative group/form animate-in fade-in slide-in-from-right-8 duration-1000 rounded-[2rem] overflow-hidden p-[1px]">
                        {/* Rotating Border Highlight */}
                        <div className="absolute inset-0 opacity-0 group-hover/form:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_20%,#4b33e8_40%,#806bf9_50%,#4b33e8_60%,transparent_80%)] animate-[spin_4s_linear_infinite]"></div>
                        </div>

                        <div className="relative z-10 bg-[#0a0c12] backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden group-hover/form:border-transparent transition-colors duration-300">
                            {success ? (
                                <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl border border-emerald-500/20">
                                        <i className="fi fi-rr-check flex"></i>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3">Request Received!</h3>
                                    <p className="text-gray-400 text-sm">Our expert will call you shortly to schedule your demo.</p>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="mt-8 text-[#4b33e8] text-xs font-black uppercase tracking-widest hover:text-indigo-400 transition-colors"
                                    >
                                        Submit another request
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            required name="name" type="text" placeholder="Full Name" 
                                            className="w-full px-5 py-3.5 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium text-white placeholder:text-white/40" 
                                        />
                                        <input 
                                            required name="company" type="text" placeholder="Company Name" 
                                            className="w-full px-5 py-3.5 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium text-white placeholder:text-white/40" 
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            required name="phone" type="tel" placeholder="Mobile Number" 
                                            className="w-full px-5 py-3.5 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium text-white placeholder:text-white/40" 
                                        />
                                        <input 
                                            required name="email" type="email" placeholder="Work Email" 
                                            className="w-full px-5 py-3.5 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium text-white placeholder:text-white/40" 
                                        />
                                    </div>

                                    <div className="relative">
                                        <select 
                                            required 
                                            name="team_strength" 
                                            value={teamStrength}
                                            onChange={(e) => setTeamStrength(e.target.value)}
                                            className={`w-full px-5 py-3.5 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium appearance-none cursor-pointer ${teamStrength === "" ? 'text-white/40' : 'text-white'}`}
                                        >
                                            <option value="" className="text-white/40 bg-[#01040a]">Select Agent Strength</option>
                                            <option value="10" className="text-white bg-[#01040a]">1 - 10 Agents</option>
                                            <option value="25" className="text-white bg-[#01040a]">11 - 25 Agents</option>
                                            <option value="50" className="text-white bg-[#01040a]">26 - 50 Agents</option>
                                            <option value="100" className="text-white bg-[#01040a]">51+ Agents</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                                            <i className="fi fi-rr-angle-small-down flex text-xl"></i>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            name="city" type="text" placeholder="City" 
                                            className="w-full px-5 py-3.5 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium text-white placeholder:text-white/40" 
                                        />
                                        <input 
                                            name="pincode" type="text" placeholder="Pincode" 
                                            className="w-full px-5 py-3.5 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium text-white placeholder:text-white/40" 
                                        />
                                    </div>

                                    <textarea 
                                        name="notes" placeholder="How can we help you?" 
                                        className="w-full px-5 py-3.5 h-24 rounded-xl bg-[#01040a] border border-white/10 focus:border-[#4b33e8] outline-none transition-all text-sm font-medium text-white placeholder:text-white/40 resize-none"
                                    ></textarea>

                                    {error && (
                                        <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-2">
                                            <i className="fi fi-rr-info flex"></i>
                                            {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full py-4.5 bg-[#4b33e8] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-2xl shadow-indigo-600/20 hover:bg-[#3b27b8] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Request Custom Demo</span>
                                                <i className="fi fi-rr-arrow-right flex group-hover:translate-x-1 transition-transform"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
