import React, { useState } from 'react';

export default function UtilityShowcase() {
    const [activeTab, setActiveTab] = useState('notes');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const appDetails = [
        {
            id: 'notes',
            title: 'Smart Notes & Voice Memos',
            desc: 'The ultimate tool for capturing instant data.',
            features: [
                'Live voice recording with Supabase sync',
                'Rich text editor for detailed call notes',
                'Categorized storage for easy retrieval',
                'Instant dashboard sync for team visibility'
            ],
            icon: 'fi-rr-note',
            color: 'bg-indigo-500'
        },
        {
            id: 'todo',
            title: 'Advanced Task Manager',
            desc: 'Never miss a lead follow-up again.',
            features: [
                'Multiple list management for different projects',
                'One-click task completion tracking',
                'Automated reminders for pending items',
                'Priority tagging for high-value leads'
            ],
            icon: 'fi-rr-list-check',
            color: 'bg-emerald-500'
        },
        {
            id: 'calendar',
            title: 'Unified Calendar Suite',
            desc: 'Global meetings meet local context.',
            features: [
                'Seamless Google Calendar integration',
                'Automated Indian Public Holiday fetcher',
                'Interactive day-view for schedule planning',
                'Meeting conflict alerts'
            ],
            icon: 'fi-rr-calendar',
            color: 'bg-amber-500'
        },
        {
            id: 'ai',
            title: 'Sales AI Co-Pilot',
            desc: 'Your internal sales intelligence expert.',
            features: [
                'Real-time call script generation',
                'Customer history & sentiment analysis',
                'Intelligent deal closing recommendations',
                'Automated call summary creation'
            ],
            icon: 'fi-rr-brain',
            color: 'bg-rose-500'
        },
        {
            id: 'calc',
            title: 'Utility Calculator',
            desc: 'Quick math for high-speed deals.',
            features: [
                'Comprehensive operation history',
                'One-tap tax & discount calculations',
                'Floating window for easy access',
                'Session-based memory'
            ],
            icon: 'fi-rr-calculator',
            color: 'bg-slate-700'
        },
        {
            id: 'age',
            title: 'Health & Eligibility Tools',
            desc: 'Instant verification for insurance & finance.',
            features: [
                'Exact Age calculator (Y/M/D accuracy)',
                'Instant BMI metrics for health checks',
                'Multi-family member profile tracking',
                'Eligibility check presets'
            ],
            icon: 'fi-rr-user-time',
            color: 'bg-[#4b33e8]'
        }
    ];

    const activeApp = appDetails.find(a => a.id === activeTab) || appDetails[0];

    return (
        <section className="py-24 bg-white overflow-hidden" id="productivity-tools">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6 font-bold text-[10px] text-[#4b33e8] uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-[#4b33e8] animate-pulse"></span>
                        Power User Experience
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        The Only CRM That <span className="text-[#4b33e8]">Works Your Way.</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        Say goodbye to switching apps. Explore our interactive Sidebar and see how Rynxly puts every tool you need right at your fingertips.
                    </p>
                </div>

                {/* Monitor Display Simulation */}
                <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
                    
                    {/* Monitor Frame */}
                    <div className="relative w-full bg-slate-950 rounded-[1.5rem] p-2.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.3)] border-[6px] border-[#2a2d3e] overflow-hidden aspect-video min-h-[500px] lg:min-h-[650px] flex flex-col z-10">
                        
                        {/* Internal Screen Area */}
                        <div className="flex-1 flex flex-col rounded-[0.8rem] overflow-hidden bg-white shadow-inner relative">
                            
                            {/* Browser Header / OS Bar */}
                            <div className="h-9 px-6 flex items-center justify-between border-b border-slate-100 bg-[#f8f9fc]">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                                </div>
                                <div className="flex-1 max-w-md h-6 bg-white border border-slate-200 rounded-md flex items-center px-4 text-[9px] text-slate-400 font-bold mx-auto shadow-sm">
                                    <i className="fi fi-rr-lock text-[8px] mr-2"></i> rynxly.com/workspace/productivity
                                </div>
                                <div className="flex items-center gap-3">
                                     <div className="w-5 h-5 rounded-full bg-slate-200 animate-pulse"></div>
                                     <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
                                </div>
                            </div>

                            {/* Main Interaction Area */}
                            <div className="flex-1 flex overflow-hidden relative">
                                
                                {/* Dashboard Canvas */}
                                <div className="flex-1 p-8 lg:p-20 overflow-y-auto custom-scrollbar bg-[#fdfcff] animate-in fade-in duration-700">
                                    <div key={activeApp.id}>
                                        <div className="flex items-center gap-6 mb-10">
                                            <div className={`w-20 h-20 rounded-3xl ${activeApp.color} text-white flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(75,51,232,0.3)]`}>
                                                <i className={`fi flex ${activeApp.icon} text-4xl`}></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Rynxly Utility</p>
                                                <h3 className="text-3xl md:text-5xl font-extrabold text-[#1a1c2d] tracking-tight">{activeApp.title}</h3>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed max-w-2xl">{activeApp.desc}</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            {activeApp.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-4 group">
                                                    <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                                                        <i className="fi fi-rr-check text-[11px] font-bold"></i>
                                                    </div>
                                                    <p className="text-base text-slate-600 font-semibold leading-relaxed">{feature}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* THE INTERACTIVE SIDEBAR */}
                                <div className={`h-full bg-white border-l border-slate-100 transition-all duration-500 flex absolute right-0 top-0 shadow-[-20px_0_40px_rgba(0,0,0,0.03)] z-20 ${isSidebarOpen ? 'w-[320px]' : 'w-0'}`}>
                                    
                                    {/* Resize Bar (Static) */}
                                    <div className="absolute left-0 top-0 w-[1.5px] h-full bg-gradient-to-b from-indigo-100 to-transparent"></div>

                                    {/* Sidebar Navigation */}
                                    <div className="w-[64px] bg-[#4b33e8] flex flex-col items-center py-8 gap-6 h-full shrink-0 shadow-[4px_0_15px_rgba(0,0,0,0.1)_inset]">
                                        <div className="mb-6">
                                            <button 
                                                onClick={() => setIsSidebarOpen(false)}
                                                className="w-10 h-10 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center"
                                            >
                                                <i className="fi flex fi-rr-cross-small text-xl"></i>
                                            </button>
                                        </div>
                                        
                                        {appDetails.map((app) => (
                                            <button 
                                                key={app.id}
                                                onClick={() => setActiveTab(app.id)}
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === app.id ? 'bg-white text-[#4b33e8] shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-110' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                            >
                                                <i className={`fi flex ${app.icon} text-lg`}></i>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sidebar Panel */}
                                    <div className="flex-1 flex flex-col h-full bg-white">
                                        <div className="px-6 py-6 border-b border-slate-50 flex justify-between items-center bg-[#fcfdff]">
                                            <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-widest">{activeApp.id} suite</h4>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                                <span className="text-[9px] font-bold text-slate-400">READY</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 p-6 space-y-5 bg-white/50">
                                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500" key={`sb-${activeTab}`}>
                                                <div className="h-3 w-1/2 bg-slate-100 rounded-full"></div>
                                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                                     <div className="flex justify-between items-center"><div className="h-2 w-20 bg-slate-50 rounded"></div><div className="w-10 h-5 rounded-full bg-indigo-50 animate-pulse"></div></div>
                                                     <div className="space-y-2"><div className="h-1.5 w-full bg-slate-50 rounded"></div><div className="h-1.5 w-5/6 bg-slate-50 rounded"></div></div>
                                                </div>
                                                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                                     <div className="h-2 w-1/3 bg-slate-50 rounded"></div>
                                                     <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-50"></div><div className="h-2.5 flex-1 bg-slate-50 rounded"></div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Sidebar Trigger */}
                                {!isSidebarOpen && (
                                    <button 
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-[#4b33e8] text-white rounded-l-2xl flex items-center justify-center shadow-[-10px_0_20px_rgba(75,51,232,0.3)] hover:w-10 transition-all animate-in slide-in-from-right duration-500 z-30"
                                    >
                                        <i className="fi flex fi-rr-angle-small-left text-lg font-bold"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Monitor Stand Bottom Reflection */}
                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/10 border-t border-white/5"></div>
                    </div>

                    {/* Monitor Neck */}
                    <div className="w-32 h-12 bg-gradient-to-b from-[#2a2d3e] to-[#12141d] shadow-xl"></div>
                    
                    {/* Monitor Base */}
                    <div className="w-64 h-4 bg-[#1a1c2d] rounded-t-3xl shadow-2xl relative overflow-hidden text-transparent">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    </div>
                </div>

                {/* Interaction Hint */}
                <div className="mt-12 text-center flex flex-col items-center">
                    <div className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent mb-4"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Live Component Simulation</p>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </section>
    );
}
