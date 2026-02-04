export default function AppShowcase() {
    return (
      <div className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Complete <span className="text-[#4b33e8]">360° Ecosystem</span>
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    A powerful Web Dashboard for managers to track performance, coupled with a simple Mobile App for agents to make calls.
                </p>
            </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mobile App Mockup (Left/Center on mobile) */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end order-2 lg:order-1">
                 <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                      <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                      
                      {/* Mobile Screen Content */}
                      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
                           {/* Status Bar */}
                           <div className="h-8 bg-gray-100 w-full flex items-center justify-between px-4 pb-1">
                                <span className="text-[10px] font-bold">9:41</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 bg-black rounded-full text-[8px] flex items-center justify-center text-white"><i className="fi fi-rr-signal-alt-2"></i></div>
                                    <div className="w-4 h-2.5 bg-black rounded-[2px]"></div>
                                </div>
                           </div>
                           
                           {/* App Header */}
                           <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-400">Welcome back,</h3>
                                    <h2 className="text-lg font-bold text-gray-800">Rahul Sharma</h2>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#4b33e8] flex items-center justify-center text-white font-bold">RS</div>
                           </div>
  
                           {/* Current Lead Card */}
                           <div className="flex-1 p-5 bg-gray-50 flex flex-col gap-4">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between mb-4">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Fresh Lead</span>
                                        <i className="fi fi-rr-menu-dots text-gray-400"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Amit Verma</h3>
                                    <p className="text-sm text-gray-500 mb-4">Interested in 3BHK Apartment</p>
                                    
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 bg-[#4b33e8] text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                                            <i className="fi fi-rr-phone-call"></i> Call Now
                                        </button>
                                        <button className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                                            <i className="fi fi-brands-whatsapp text-xl"></i>
                                        </button>
                                    </div>
                                </div>
  
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                        <span className="text-2xl font-bold text-gray-800 block">42</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Calls Today</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                                        <span className="text-2xl font-bold text-emerald-500 block">02:15</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Talk Time</span>
                                    </div>
                                </div>
                           </div>
  
                           {/* Bottom Nav */}
                           <div className="bg-white p-4 border-t border-gray-100 flex justify-around text-2xl text-gray-300">
                                <i className="fi fi-rr-home text-[#4b33e8]"></i>
                                <i className="fi fi-rr-list-check hover:text-gray-500"></i>
                                <i className="fi fi-rr-settings hover:text-gray-500"></i>
                           </div>
                      </div>
                 </div>
            </div>
  
            {/* Web Dashboard Mockup (Right/Top on mobile) */}
            <div className="lg:col-span-8 order-1 lg:order-2">
                 <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                     {/* Browser Header */}
                     <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                         <div className="flex gap-1.5">
                             <div className="w-3 h-3 rounded-full bg-red-400"></div>
                             <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                             <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                         </div>
                         <div className="flex-1 text-center">
                            <div className="inline-block px-12 py-1 bg-white rounded-md text-xs text-gray-400 border border-gray-200 shadow-sm">
                                app.rynxly.com/dashboard/analytics
                            </div>
                         </div>
                     </div>
  
                     {/* Web Content */}
                     <div className="p-6 md:p-8 bg-gray-50/50">
                         <div className="flex justify-between items-center mb-8">
                             <div>
                                 <h2 className="text-2xl font-bold text-gray-800">Campaign Performance</h2>
                                 <p className="text-gray-500 text-sm">Real-time analytics for 'Diwali Sales Drive'</p>
                             </div>
                             <div className="flex gap-2">
                                 <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600">Last 7 Days</span>
                                 <button className="px-4 py-1 bg-[#4b33e8] text-white rounded-lg text-sm font-bold">Export Report</button>
                             </div>
                         </div>
  
                         {/* Stats Grid */}
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                             {[
                                 { label: "Total Leads", val: "2,450", color: "text-blue-600", bg: "bg-blue-50" },
                                 { label: "Calls Made", val: "1,890", color: "text-purple-600", bg: "bg-purple-50" },
                                 { label: "Connected", val: "850", color: "text-emerald-600", bg: "bg-emerald-50" },
                                 { label: "Conversion Rate", val: "12.4%", color: "text-amber-600", bg: "bg-amber-50" },
                             ].map((stat, i) => (
                                 <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                     <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                                     <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h3>
                                     <div className={`mt-3 h-1 w-full rounded-full ${stat.bg}`}>
                                         <div className={`h-full rounded-full ${stat.color.replace('text', 'bg')} w-[70%] opacity-50`}></div>
                                     </div>
                                 </div>
                             ))}
                         </div>
  
                         {/* Mock Charts */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                 <h4 className="font-bold text-gray-800 mb-6">Call Volume Trends</h4>
                                 <div className="flex items-end gap-2 h-40">
                                     {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                         <div key={i} className="flex-1 bg-indigo-50 rounded-t-sm relative group">
                                             <div 
                                                className="absolute bottom-0 left-0 right-0 bg-[#4b33e8] rounded-t-sm transition-all group-hover:bg-indigo-400"
                                                style={{ height: `${h}%` }}
                                             ></div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                 <h4 className="font-bold text-gray-800 mb-6">Lead Outcomes</h4>
                                 <div className="flex justify-center">
                                      {/* Simple Donut Chart CSS */}
                                      <div className="w-32 h-32 rounded-full border-[12px] border-emerald-400 border-r-indigo-500 border-b-amber-400 border-l-red-400 relative">
                                          <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-gray-700">
                                              Total
                                          </div>
                                      </div>
                                 </div>
                                 <div className="mt-6 space-y-2 text-sm">
                                     <div className="flex justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div>Interested</div> <span className="font-bold">45%</span></div>
                                     <div className="flex justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>Follow Up</div> <span className="font-bold">25%</span></div>
                                     <div className="flex justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div>Not Interested</div> <span className="font-bold">20%</span></div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
