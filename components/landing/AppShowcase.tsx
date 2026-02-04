export default function AppShowcase() {
    return (
      <div className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Complete <span className="text-[#4b33e8]">360° Ecosystem</span>
                </h2>
                <p className="text-base text-gray-500 max-w-2xl mx-auto">
                    A powerful Web Dashboard for managers to track performance, coupled with a simple Mobile App for agents to make calls.
                </p>
            </div>
  
          {/* Overlapping Mockups Container */}
          <div className="relative max-w-5xl mx-auto">
            
            {/* Web Dashboard Mockup (Background) */}
            <div className="relative z-0 md:mr-20 lg:mr-32">
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
                                wwww.rynxly.com/dashboard
                            </div>
                         </div>
                     </div>
  
                     {/* Web Content - Dashboard Screenshot */}
                     <div className="w-full bg-white relative overflow-hidden group">
                        <img 
                          src="/dashboard.png" 
                          alt="Rynxly Web Dashboard" 
                          className="w-full h-auto block hover:scale-[1.01] transition-transform duration-700"
                        />
                     </div>
                 </div>
            </div>

            {/* Mobile App Mockup (Upfront / Overlapping) */}
            <div className="absolute -bottom-12 -right-4 md:-right-8 lg:-right-1 z-10 animate-in fade-in slide-in-from-right-8 duration-1000">
                 <div className="relative border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-[1.8rem] h-[400px] w-[200px] shadow-2xl hover:-translate-y-2 transition-transform duration-500">
                      {/* Notch */}
                      <div className="w-[100px] h-[14px] bg-gray-800 top-0 rounded-b-[0.8rem] left-1/2 -translate-x-1/2 absolute"></div>
                      
                      {/* Buttons */}
                      <div className="h-[28px] w-[3px] bg-gray-800 absolute -left-[11px] top-[60px] rounded-l-lg"></div>
                      <div className="h-[40px] w-[3px] bg-gray-800 absolute -left-[11px] top-[100px] rounded-l-lg"></div>
                      <div className="h-[50px] w-[3px] bg-gray-800 absolute -right-[11px] top-[120px] rounded-r-lg"></div>
                      
                      {/* Mobile Screen Content */}
                      <div className="rounded-[1.4rem] overflow-hidden w-full h-full bg-white relative">
                            <img 
                              src="/login-mobile.png" 
                              alt="Rynxly Mobile Login" 
                              className="w-full h-full object-cover"
                            />
                       </div>
                 </div>
            </div>
            
          </div>

          {/* Bottom Spacing Spacer */}
          <div className="h-20"></div>
        </div>
      </div>
    );
  }
