import React, { useState } from 'react';

export default function UtilityShowcase() {
    const [activeTab, setActiveTab] = useState('notes');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <section className="py-16 bg-white overflow-hidden" id="productivity-tools">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-4 font-bold text-[9px] text-[#4b33e8] uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4b33e8] animate-pulse"></span>
                        Power User Experience
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3">
                        The Only CRM That <span className="text-[#4b33e8]">Works Your Way.</span>
                    </h2>
                    <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Say goodbye to switching apps. Explore our interactive Sidebar and see how Rynxly puts every tool you need right at your fingertips.
                    </p>
                </div>

                {/* Monitor Display Simulation - COMPACT VERSION */}
                <div className="relative w-full max-w-4xl mx-auto">
                    {/* Monitor Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-indigo-500/5 blur-[100px] rounded-full -z-10"></div>
                    
                    {/* Monitor Body */}
                    <div className="relative bg-[#1a1c1e] rounded-[1.8rem] p-3 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] border border-white/5 overflow-hidden min-h-[400px] lg:min-h-[480px] flex flex-col group/monitor">
                        
                        {/* Monitor Bezel Top & Camera */}
                        <div className="absolute top-0 left-0 right-0 h-3 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-white/10"></div>
                        </div>

                        {/* Browser Container */}
                        <div className="flex-1 bg-white rounded-[1.4rem] overflow-hidden flex items-stretch relative shadow-inner">
                            
                            {/* Left Side: Browser Window (Header + Content) */}
                            <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-50 min-h-0">
                                {/* Browser Header */}
                                <div className="h-8 px-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                    </div>
                                    <div className="flex-1 max-w-[200px] h-4 bg-white border border-slate-200 rounded flex items-center px-3 text-[8px] text-slate-400 font-bold lowwecase tracking-widest overflow-hidden">
                                         rynxly.in/portal
                                    </div>
                                </div>

                                {/* Dashboard Content (Dynamic Details) */}
                                <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-500 relative min-h-0">
                                    {isSidebarOpen ? (
                                        <div key={activeApp.id} className="animate-in slide-in-from-bottom-2 duration-500">
                                            <div className={`w-10 h-10 rounded-xl ${activeApp.color} text-white flex items-center justify-center mb-5 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500`}>
                                                <i className={`fi flex ${activeApp.icon} text-xl`}></i>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">{activeApp.title}</h3>
                                            <p className="text-sm text-indigo-600 font-medium mb-6 leading-relaxed">{activeApp.desc}</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                {activeApp.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-2.5">
                                                        <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center text-[#4b33e8] border border-indigo-100 shrink-0 mt-0.5">
                                                            <i className="fi fi-rr-check text-[7px] font-bold"></i>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium leading-snug">{feature}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 p-3 bg-slate-50 rounded-xl border border-slate-100 inline-flex items-center gap-3">
                                                <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm text-[#4b33e8]">
                                                    <i className="fi fi-rr-info text-[10px]"></i>
                                                </div>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Tap sidebar icons to switch tools</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-700">
                                            <div className="mb-6">
                                                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2 leading-tight">
                                                    Your <span className="text-[#4b33e8]">Ultimate Sales</span> <br/>
                                                    Productivity Toolkit.
                                                </h3>
                                                <div className="w-12 h-1 bg-[#4b33e8] rounded-full"></div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
                                                <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#4b33e8]">
                                                        <i className="fi fi-rr-bolt text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Zero Context Switching</p>
                                                        <p className="text-[9px] text-slate-500 font-medium">Never leave your lead page.</p>
                                                    </div>
                                                </div>
                                                <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500">
                                                        <i className="fi fi-rr-cloud-share text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Cloud Sync</p>
                                                        <p className="text-[9px] text-slate-500 font-medium">Auto-save voice & text notes.</p>
                                                    </div>
                                                </div>
                                                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-500">
                                                        <i className="fi fi-rr-brain text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">AI Assisted</p>
                                                        <p className="text-[9px] text-slate-500 font-medium">Live scripts & summaries.</p>
                                                    </div>
                                                </div>
                                                <div className="p-3.5 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-100 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                                                        <i className="fi fi-rr-resize text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-white uppercase tracking-tight">Custom Width</p>
                                                        <p className="text-[9px] text-white/70 font-medium">Resizable floating panel.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                <span className="flex h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                                                500+ TEAMS OPTIMIZED THEIR WORKFLOW
                                            </div>
                                        </div>
                                    )}

                                    {/* Sidebar Trigger (Placed inside content for z-indexing) */}
                                    {!isSidebarOpen && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-30">
                                            {/* POINTER ARROW & LABEL */}
                                            <div className="absolute right-full mr-4 flex flex-col items-end animate-bounce-horizontal">
                                                <div className="bg-[#ff9900] text-white py-1.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl flex items-center gap-2">
                                                    Open for Live Demo
                                                    <i className="fi fi-rr-arrow-right mt-0.5"></i>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => setIsSidebarOpen(true)}
                                                className="w-4 h-10 bg-[#4b33e8] text-white rounded-l-lg flex items-center justify-center shadow-lg hover:w-5 transition-all outline outline-4 outline-indigo-100"
                                            >
                                                <i className="fi flex fi-rr-angle-small-left text-[10px] font-bold"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* THE ACTUAL INTERACTIVE SIDEBAR SIMULATION */}
                            <div className={`transition-all duration-500 flex items-stretch shadow-[-10px_0_20px_rgba(0,0,0,0.02)] z-20 overflow-hidden ${isSidebarOpen ? 'w-[240px]' : 'w-0'}`}>
                                
                                {/* Sidebar Menu (Indigo) */}
                                <div className="w-[45px] bg-[#4b33e8] flex flex-col items-center py-4 gap-3.5 h-full self-stretch shrink-0">
                                    <div className="mb-2">
                                        <button 
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="w-6 h-6 rounded-md text-white/50 hover:text-white transition-colors flex items-center justify-center"
                                        >
                                            <i className="fi flex fi-rr-cross-small text-base"></i>
                                        </button>
                                    </div>
                                    
                                    {appDetails.map((app) => (
                                        <button 
                                            key={app.id}
                                            onClick={() => setActiveTab(app.id)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeTab === app.id ? 'bg-white text-[#4b33e8] shadow-md scale-105' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                                        >
                                            <i className={`fi flex ${app.icon} text-xs`}></i>
                                        </button>
                                    ))}
                                </div>

                                {/* Sidebar Content */}
                                <div className="flex-1 flex flex-col h-full bg-white overflow-hidden self-stretch border-l border-slate-50">
                                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                                        <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{activeApp.id} suite</h4>
                                        <div className="flex gap-1">
                                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                                        {activeTab === 'notes' && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-300">
                                                <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
                                                    <i className="fi fi-rr-search text-[10px] text-slate-400"></i>
                                                    <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/30">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <i className="fi fi-rr-microphone text-indigo-500 text-[10px]"></i>
                                                            <div className="h-2 w-16 bg-indigo-200 rounded-full"></div>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-indigo-100/50 rounded-full"></div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <i className="fi fi-rr-document text-slate-400 text-[10px]"></i>
                                                            <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="h-1 w-full bg-slate-50 rounded-full"></div>
                                                            <div className="h-1 w-2/3 bg-slate-50 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="w-full py-2 bg-[#4b33e8] text-white rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-100">
                                                    + New Note
                                                </button>
                                            </div>
                                        )}

                                        {activeTab === 'todo' && (
                                            <div className="p-4 space-y-4 animate-in fade-in duration-300">
                                                <div className="flex gap-2">
                                                    <div className="px-2 py-1 bg-indigo-50 text-[#4b33e8] rounded-md text-[8px] font-bold">Today</div>
                                                    <div className="px-2 py-1 bg-slate-50 text-slate-400 rounded-md text-[8px] font-bold">Planned</div>
                                                </div>
                                                <div className="space-y-3">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="flex items-center gap-3 group">
                                                            <div className={`w-4 h-4 rounded border ${i === 1 ? 'bg-[#4b33e8] border-[#4b33e8]' : 'border-slate-200'} flex items-center justify-center`}>
                                                                {i === 1 && <i className="fi fi-rr-check text-[8px] text-white"></i>}
                                                            </div>
                                                            <div className={`h-1.5 ${i === 1 ? 'w-24 bg-slate-200 line-through opacity-50' : 'w-32 bg-slate-100'} rounded-full`}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-8 p-3 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center">
                                                     <div className="h-1.5 w-20 bg-slate-50 rounded-full"></div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'ai' && (
                                            <div className="h-full flex flex-col animate-in fade-in duration-300">
                                                <div className="flex-1 p-4 space-y-4">
                                                    <div className="flex gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-indigo-500 shrink-0 flex items-center justify-center">
                                                            <i className="fi fi-rr-brain text-white text-[10px]"></i>
                                                        </div>
                                                        <div className="bg-slate-50 p-2.5 rounded-2xl rounded-tl-none border border-slate-100">
                                                            <div className="h-1.5 w-24 bg-slate-200 rounded-full mb-2"></div>
                                                            <div className="h-1.5 w-16 bg-slate-100 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row-reverse gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0"></div>
                                                        <div className="bg-[#4b33e8] p-2.5 rounded-2xl rounded-tr-none text-white">
                                                            <div className="h-1.5 w-20 bg-white/20 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                                                    <div className="bg-white rounded-full border border-slate-200 p-2 flex items-center justify-between">
                                                        <div className="h-1.5 w-24 bg-slate-100 rounded-full ml-2"></div>
                                                        <div className="w-6 h-6 rounded-full bg-[#4b33e8] flex items-center justify-center text-white">
                                                            <i className="fi fi-rr-paper-plane-top text-[10px]"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'calendar' && (
                                            <div className="p-4 space-y-5 animate-in fade-in duration-300">
                                                <div className="grid grid-cols-7 gap-1">
                                                    {Array.from({length: 31}).map((_, i) => (
                                                        <div key={i} className={`h-4 rounded-sm flex items-center justify-center text-[7px] font-bold ${i+1 === 14 ? 'bg-[#4b33e8] text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                            {i+1}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="p-2 border-l-2 border-indigo-500 bg-indigo-50/30 rounded-r-lg">
                                                        <div className="h-1.5 w-16 bg-indigo-200 rounded-full mb-1"></div>
                                                        <div className="h-1 w-12 bg-slate-300 rounded-full"></div>
                                                    </div>
                                                    <div className="p-2 border-l-2 border-amber-500 bg-amber-50/30 rounded-r-lg">
                                                        <div className="h-1.5 w-20 bg-amber-200 rounded-full mb-1"></div>
                                                        <div className="h-1 w-12 bg-slate-300 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'calc' && (
                                            <div className="p-4 flex flex-col h-full animate-in fade-in duration-300">
                                                <div className="bg-slate-900 rounded-xl p-4 mb-4 text-right">
                                                    <div className="text-[8px] text-slate-500 mb-1 tracking-widest">2,450 + 15%</div>
                                                    <div className="text-xl font-bold text-white tracking-tight">2,817.50</div>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 flex-1">
                                                    {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+'].map(btn => (
                                                        <div key={btn} className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${['÷', '×', '-', '+'].includes(btn) ? 'bg-[#4b33e8] text-white' : 'bg-slate-50 text-slate-600'}`}>
                                                            {btn}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'age' && (
                                            <div className="p-4 space-y-6 animate-in fade-in duration-300">
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <div className="h-1.5 w-20 bg-slate-400 rounded-full"></div>
                                                        <div className="h-8 w-full bg-slate-50 border border-slate-100 rounded-lg"></div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                       <div className="h-8 bg-slate-50 border border-slate-100 rounded-lg"></div>
                                                       <div className="h-8 bg-slate-50 border border-slate-100 rounded-lg"></div>
                                                    </div>
                                                </div>
                                                <button className="w-full py-2.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">
                                                    Calculate 
                                                </button>
                                                <div className="pt-4 border-t border-slate-50 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="h-2 w-16 bg-slate-800 rounded-full"></div>
                                                        <div className="h-2 w-10 bg-emerald-500 rounded-full"></div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="h-2 w-12 bg-slate-400 rounded-full"></div>
                                                        <div className="h-2 w-20 bg-slate-100 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monitor Bottom Logo Side */}
                        <div className="h-6 flex items-center justify-center">
                            <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">Rynxly Pro</div>
                        </div>
                    </div>

                    {/* Monitor Stand */}
                    <div className="relative h-12 w-24 bg-[#2a2d31] mx-auto overflow-hidden shadow-lg -mt-1">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                    </div>
                    {/* Monitor Base */}
                    <div className="w-40 h-2 bg-[#1a1c1e] mx-auto rounded-t-lg shadow-xl"></div>
                    
                    {/* Interaction Hint */}
                    <div className="mt-8 text-center mb-20">
                         <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                             <span className="flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                             </span>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Interactive Desktop Demo</p>
                         </div>
                    </div>
                </div>

                {/* Individual App Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {appDetails.map((app) => (
                        <div 
                            key={app.id} 
                            onClick={() => {
                                setActiveTab(app.id);
                                setIsSidebarOpen(true);
                                document.getElementById('productivity-tools')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-30px_rgba(75,51,232,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                            
                            <div className={`w-12 h-12 rounded-2xl ${app.color} text-white flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:rotate-6 transition-transform`}>
                                <i className={`fi flex ${app.icon} text-xl`}></i>
                            </div>

                            <h4 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{app.title}</h4>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed relative z-10">{app.desc}</p>

                            <div className="space-y-3 relative z-10">
                                {app.features.slice(0, 3).map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5">
                                        <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center text-[#4b33e8] border border-indigo-100 shrink-0 mt-0.5">
                                            <i className="fi fi-rr-check text-[7px] font-bold"></i>
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-medium leading-snug">{feature}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                                <span className="text-[9px] font-bold text-[#4b33e8] uppercase tracking-widest">Try it Live</span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4b33e8] group-hover:text-white transition-all duration-300">
                                    <i className="fi fi-rr-arrow-right text-xs"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                
                @keyframes bounce-horizontal {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-10px); }
                }
                .animate-bounce-horizontal {
                    animation: bounce-horizontal 2s infinite;
                }
            `}</style>
        </section>
    );
}
