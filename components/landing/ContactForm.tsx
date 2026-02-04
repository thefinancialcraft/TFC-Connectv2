import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        <div id="contact" className="py-24 bg-[#0F172A] relative overflow-hidden">
            {/* Background Decorative Mesh */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.15] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Content */}
                    <div>
                        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-widest uppercase border border-indigo-500/20 inline-block mb-6">
                            Ready to scale?
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
                            Let's Build Your <br/>
                            <span className="text-[#4b33e8] bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Dream Sales Engine</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                            Fill out the form and our sales experts will get back to you within 24 hours to schedule a custom demo of Rynxly.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-sm shrink-0">
                                    <i className="fi fi-rr-headset flex text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Customized Demo</h4>
                                    <p className="text-sm text-gray-400">See exactly how Rynxly fits your specific industry and workflow.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-sm shrink-0">
                                    <i className="fi fi-rr-cloud-check flex text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Setup Assistance</h4>
                                    <p className="text-sm text-gray-400">We'll help you import your data and configure your first campaign.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-30"></div>
                        <div className="bg-white rounded-[1.7rem] p-8 border border-gray-100 shadow-2xl relative">
                            {success ? (
                                <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                        <i className="fi fi-rr-check flex"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Request Received!</h3>
                                    <p className="text-gray-500">Our team will contact you shortly. Thank you for choosing Rynxly.</p>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="mt-8 text-[#4b33e8] font-bold hover:underline"
                                    >
                                        Submit another request
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                            <input required name="name" type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Company Name</label>
                                            <input required name="company" type="text" placeholder="TechCorp Inc." className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                            <input required name="phone" type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
                                            <input required name="email" type="email" placeholder="john@techcorp.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Team Strength</label>
                                        <div className="relative">
                                            <select required name="team_strength" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 appearance-none cursor-pointer">
                                                <option value="">Select Team Size</option>
                                                <option value="10">Under 10 Agents</option>
                                                <option value="20">10 - 25 Agents</option>
                                                <option value="50">25 - 50 Agents</option>
                                                <option value="100">50 - 100 Agents</option>
                                                <option value="100+">100+ Agents</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <i className="fi fi-rr-angle-small-down flex text-xl"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="col-span-1 md:col-span-3">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Address</label>
                                            <input name="address" type="text" placeholder="Office floor, building name..." className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                            <input name="city" type="text" placeholder="Gurugram" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Country</label>
                                            <input name="country" type="text" placeholder="India" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Pincode</label>
                                            <input name="pincode" type="text" placeholder="122001" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Requirements / Notes</label>
                                        <textarea name="notes" placeholder="Tell us about your team size, calling process, and any specific requirements..." className="w-full px-4 py-3 h-24 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#4b33e8] focus:bg-white outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400 resize-none"></textarea>
                                    </div>

                                    {error && (
                                        <div className="p-3 rounded-lg bg-red-50 text-red-500 text-xs font-bold flex items-center gap-2">
                                            <i className="fi fi-rr-info flex"></i>
                                            {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full py-4 bg-[#4b33e8] text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Sending...</span>
                                            </>
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
        </div>
    );
}
