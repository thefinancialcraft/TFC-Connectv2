export default function WorkflowSteps() {
  const steps = [
    {
      step: "01",
      title: "Import Data",
      desc: "Upload CSVs or sync leads via API. Our system automatically cleans duplicates and validates numbers.",
      bg: "bg-blue-100/50",
      text: "text-blue-600",
      icon: "fi-rr-cloud-upload flex"
    },
    {
      step: "02",
      title: "Auto-Assign",
      desc: "Define your logic. Round-robin, performance-based, or location-based. Detailed lead routing rules.",
      bg: "bg-purple-100/50",
      text: "text-purple-600",
      icon: "fi-rr-network flex"
    },
    {
      step: "03",
      title: "Agents Call",
      desc: "Agents receive leads on their mobile app. One tap to dial. Call outcome is logged instantly.",
      bg: "bg-emerald-100/50",
      text: "text-emerald-600",
      icon: "fi-rr-smartphone flex"
    },
    {
      step: "04",
      title: "Track & Close",
      desc: "Managers watch live dashboards. Identify bottlenecks, listen to recordings, and celebrate closings.",
      bg: "bg-amber-100/50",
      text: "text-amber-600",
      icon: "fi-rr-chart-histogram flex"
    }
  ];

  return (
    <div id="how-it-works" className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-50/80 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full bg-indigo-100/50 text-[#4b33e8] text-xs font-bold tracking-widest uppercase border border-indigo-100 inline-block mb-4">
             Process
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            How <span className="text-[#4b33e8]">Rynxly Works</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
             Complex routing logic happens in the background. Your team just sees a simple, streamlined path to success.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[70px] left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200 rounded-full opacity-50 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 group">
                <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-2">
                  
                  {/* Step Number & Icon Circle */}
                  <div className="relative mb-8 flex justify-center lg:justify-start">
                     <div 
                        className={`w-16 h-16 rounded-xl ${s.bg} ${s.text} flex items-center justify-center text-2xl shadow-sm border-4 border-white relative z-10 group-hover:scale-110 transition-transform duration-300`}
                        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }} 
                      >
                        <i className={`fi ${s.icon}`}></i>
                        
                        {/* Number Badge */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                           {s.step}
                        </div>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="text-center lg:text-left">
                     <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#4b33e8] transition-colors">{s.title}</h4>
                     <p className="text-gray-500 leading-relaxed text-xs mb-4 min-h-[50px]">{s.desc}</p>
                     
                     {/* "Lean More" Pseudo-link */}
                     <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-bold text-gray-400 group-hover:text-[#4b33e8] transition-colors cursor-pointer">
                        <span>Learn more</span>
                        <i className="fi fi-rr-arrow-right flex group-hover:translate-x-1 transition-transform"></i>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SMART SYSTEM FLOW VISUALIZATION (PREMIUM BRAIN LOGIC) --- */}
        <div className="mt-28 relative">
          <div className="text-center mb-12">
             <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 mb-4 inline-block">
                Universal Workflow
             </span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">The Only CRM <span className="text-[#4b33e8]">That Works Your Way.</span></h3>
            <p className="max-w-xl mx-auto text-sm text-gray-500  leading-relaxed">Experience a seamless, automated journey for every lead. Our intelligent engine ensures no opportunity is lost, routing and recycling leads with precision to maximize your revenue.</p>
          </div>

          {/* Canva Container */}
          <div className="bg-slate-950 rounded-[3.5rem] p-12 md:py-29 md:px-16 shadow-2xl relative overflow-hidden border border-white/5 group">
            
            {/* 🛡️ PRIVACY & SECURITY LAYER (WATERMARK) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
                <div className="grid grid-cols-6 gap-20 -rotate-12 scale-150">
                    {Array.from({length: 24}).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <i className="fi fi-rr-shield flex text-6xl"></i>
                            <span className="text-xs font-black uppercase tracking-tighter">
                                {i % 3 === 0 ? 'Encrypted' : i % 3 === 1 ? 'Masked' : 'Secured'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔁 RECYCLE FLOW (STEPPED RECTANGULAR STYLE: TOP ARCH FROM AGENT 2 TO POOL) */}
            <div className="hidden md:block absolute inset-0 pointer-events-none z-20">
               <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 600">
                  <defs>
                     <linearGradient id="recycleMatchedGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ff9900" stopOpacity="0.3" />
                        <stop offset="70%" stopColor="#ff9900" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ff9900" stopOpacity="0.1" />
                     </linearGradient>
                  </defs>
                  {/* Stepped Rectangular Path with Rounded Corners */}
                  <path 
                    d="M 820 190 L 822 190 Q 830 190, 830 180 L 830 80 Q 830 70, 822 70 L 210 70 Q 190 70, 190 90 L 190 180" 
                    fill="none" 
                    stroke="url(#recycleMatchedGradient)" 
                    strokeWidth="1" 
                    className="opacity-80"
                  />
                  
                  {/* 🔴 REJECTION PATH (BOTTOM STEPPED STYLE: FROM AGENT 3 TO REJECTED POOL) */}
                  <defs>
                     <linearGradient id="rejectionGradientBottom" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                     </linearGradient>
                  </defs>
                  {/* Stepped Rectangular Path via Bottom - Slightly Adjusted Start Height */}
                  <path 
                    d="M 800 250 L 800 380 Q 800 400, 780 400 L 140 400 Q 120 400, 120 380 L 120 350" 
                    fill="none" 
                    stroke="url(#rejectionGradientBottom)" 
                    strokeWidth="1.5" 
                    className="opacity-50"
                  />
                  
                  {/* Moving Particle following the Stepped Path (Agent 2 Recycle) */}
                  <circle r="4" fill="#f59e0b" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }}>
                      <animateMotion 
                        dur="4s" 
                        repeatCount="indefinite" 
                        path="M 820 190 L 822 190 Q 830 190, 830 180 L 830 80 Q 830 70, 822 70 L 210 70 Q 190 70, 190 90 L 190 180" 
                      />
                  </circle>

                  {/* Moving Red Particle (Agent 3 Rejection) - Adjusted Start Height */}
                  <circle r="4.5" fill="#ef4444" style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}>
                      <animateMotion 
                        dur="6s" 
                        repeatCount="indefinite" 
                        path="M 800 250 L 800 380 Q 800 400, 780 400 L 140 400 Q 120 400, 120 380 L 120 350" 
                      />
                  </circle>

                  {/* � CLOSED PATH (STEPPED STYLE: FROM AGENT 4 TO CLOSED BUCKET) */}
                  <defs>
                     <linearGradient id="closedGradientGreen" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                     </linearGradient>
                  </defs>
                  <path 
                    d="M 750 310 L 750 355 Q 750 365, 730 365 L 300 365 Q 280 365, 280 355 L 280 350" 
                    fill="none" 
                    stroke="url(#closedGradientGreen)" 
                    strokeWidth="2" 
                    className="opacity-80"
                  />
                  
                  {/* Moving Green Particle (Agent 4 Closed) */}
                  <circle r="4.5" fill="#10b981" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}>
                      <animateMotion 
                        dur="5s" 
                        repeatCount="indefinite" 
                        path="M 750 310 L 750 355 Q 750 365, 730 365 L 300 365 Q 280 365, 280 355 L 280 350" 
                      />
                  </circle>

                  {/* Context Text on Bottom */}
                 

                 
               </svg>
            </div>

            {/* Main Stage Grid */}
            <div className="relative z-30 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 items-center">
              
              {/* 🔹 1. GENERAL POOL & AUX BUCKETS */}
              <div className="flex flex-col items-center gap-6">
                {/* General Pool (Main) */}
                <div className="w-32 h-32 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-2xl flex flex-col items-center justify-center relative group-hover:border-indigo-500/50 transition-all duration-700">
                  {/* Counter Pulse */}
                  <div className="absolute -top-4 bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                    <i className="fi fi-rr-arrow-trend-up flex"></i>
                    +12 Incoming
                  </div>
                  
                  <i className="fi fi-rr-layers flex text-4xl text-indigo-400 mb-2"></i>
                  
                  {/* Floating Chips */}
                  <div className="flex flex-wrap justify-center gap-1 px-4">
                     <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase border border-indigo-500/30">Fresh</span>
                     <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[8px] font-black uppercase border border-blue-500/30">Re-entry</span>
                  </div>

                  {/* Negative Counter Pulse */}
                  <div className="absolute -bottom-2 -right-2 bg-red-500/80 text-white px-2 py-0.5 rounded-full text-[8px] font-black border border-white/10">
                    -1 Assigned
                  </div>
                </div>
                
                <div className="text-center">
                    <h5 className="text-white font-black text-sm uppercase tracking-widest leading-none mb-1">General Pool</h5>
                    <p className="text-[9px] text-slate-500 font-bold">Leads Kabhi Rukti Nahi</p>
                </div>

                {/* Sub Buckets Grid */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    {/* Rejected Pool */}
                    <div className="bg-slate-900/50 border border-red-500/10 p-2.5 rounded-2xl flex flex-col items-center group/junk hover:border-red-500/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mb-1 group-hover/junk:scale-110 transition-transform">
                            <i className="fi fi-rr-trash flex text-red-500/60 text-xs"></i>
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Rejected Pool</p>
                        <p className="text-[7px] text-red-500/40 font-bold italic">NOT INTERESTED</p>
                    </div>

                    {/* Closed Bucket */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-2xl flex flex-col items-center group/closed hover:border-emerald-500/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-1 group-hover/closed:scale-110 transition-transform">
                            <i className="fi fi-rr-check flex text-emerald-500/60 text-xs"></i>
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Closed</p>
                        <p className="text-[7px] text-emerald-500/60 font-bold italic">REVENUE LOCK</p>
                    </div>
                </div>
              </div>

              {/* 🔹 2. ASSIGNMENT ENGINE: REAL "BRAIN" FEEL */}
              <div className="relative flex flex-col items-center z-20">
                {/* 🔹 INCOMING FLOW: POOL -> BRAIN */}
                <div className="hidden md:block absolute -left-[70%] top-1/2 -translate-y-1/2 w-[150%] h-[300px] pointer-events-none z-0 overflow-visible">
                   <svg className="w-full h-full overflow-visible" viewBox="0 0 300 300">
                      <defs>
                        <linearGradient id="incomingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      
                      {/* Central Feed Line */}
                      <path d="M 20 150 L 300 150" fill="none" stroke="url(#incomingGradient)" strokeWidth="1.5" className="opacity-40" />
                      
                      {/* Rapid Lead Particles */}
                      {[0, 1, 2, 3, 4].map((i) => (
                         <circle key={i} r="3" fill="#fff" className="opacity-60" style={{ filter: 'drop-shadow(0 0 6px #fff)' }}>
                            <animateMotion 
                               dur="2.5s" 
                               repeatCount="indefinite" 
                               begin={`${i * 0.5}s`} 
                               path="M 20 150 L 300 150" 
                            />
                         </circle>
                      ))}
                   </svg>
                </div>

                {/* Sequenced Flow Lines to Individuals (SVG Paths) */}
                <div className="hidden md:block absolute -right-[65%] top-1/2 -translate-y-1/2 w-[140%] h-[300px] pointer-events-none z-0 overflow-visible">
                   <svg className="w-full h-full overflow-visible" viewBox="0 0 300 300">
                      <defs>
                        <linearGradient id="passingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                      
                      {/* 4 Professional Curved Lines to Agent Nodes */}
                      <path d="M 0 150 C 100 150, 150 40, 245 40" fill="none" stroke="url(#passingGradient)" strokeWidth="1.5" className="opacity-80" />
                      <path d="M 0 150 C 100 150, 150 112, 245 112" fill="none" stroke="url(#passingGradient)" strokeWidth="1.5" className="opacity-80" />
                      <path d="M 0 150 C 100 150, 150 184, 245 184" fill="none" stroke="url(#passingGradient)" strokeWidth="1.5" className="opacity-80" />
                      <path d="M 0 150 C 100 150, 150 256, 245 256" fill="none" stroke="url(#passingGradient)" strokeWidth="1.5" className="opacity-80" />
                      
                      {/* Animated Particles (Sequenced) following the curves */}
                      {[0, 1, 2, 3].map((i) => (
                         <circle key={i} r="4.5" fill="#fff" style={{ filter: 'drop-shadow(0 0 8px #fff)' }}>
                            <animateMotion 
                               dur="2s" 
                               repeatCount="indefinite" 
                               begin={`${i * 0.5}s`} 
                               path={
                                 i === 0 ? "M 0 150 C 100 150, 150 40, 245 40" : 
                                 i === 1 ? "M 0 150 C 100 150, 150 112, 245 112" : 
                                 i === 2 ? "M 0 150 C 100 150, 150 184, 245 184" : 
                                 "M 0 150 C 100 150, 150 256, 245 256"
                               } 
                            />
                         </circle>
                      ))}
                   </svg>
                </div>

                <div className="w-44 h-44 rounded-full border-[6px] border-double border-slate-800 flex items-center justify-center p-3 mb-6 relative group-hover:border-indigo-500/20 transition-all bg-slate-950">
                  <div className="absolute inset-0 rounded-full animate-spin-slow border-t-4 border-indigo-500/40"></div>
                  
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-600 via-[#4b33e8] to-blue-600 flex flex-col items-center justify-center relative overflow-hidden">
                    <i className="fi fi-rr-bolt flex text-3xl text-white mb-1"></i>
                    
                    {/* Animated Text Sequence */}
                    <div className="relative h-4 w-full overflow-hidden">
                        <div className="text-white text-[8px] font-black uppercase text-center animate-text-slide">
                            <p className="h-4 flex items-center justify-center">Routing Lead</p>
                            <p className="h-4 flex items-center justify-center">Agent Locked</p>
                            <p className="h-4 flex items-center justify-center">Verifying Data</p>
                            <p className="h-4 flex items-center justify-center">Next Lead Sync</p>
                        </div>
                    </div>
                  </div>

                  {/* Live Status Label */}
                  <div className="absolute -bottom-2 bg-slate-900 border border-indigo-500/50 px-3 py-1 rounded-full whitespace-nowrap z-30">
                      <p className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          Direct Individual Feed
                      </p>
                  </div>
                </div>
                <h5 className="text-white font-black text-sm uppercase tracking-widest">Assignment Engine</h5>
              </div>

              {/* 🔹 3. ACTIVE CALLING: MULTI-AGENT MODE (Vertical Alignment) */}
              <div className="relative flex flex-col items-center z-30">
                <div className="flex flex-col gap-4 mb-6 relative">
                  {[1,2,3,4].map(i => (
                     <div key={i} className={`relative group/agent flex items-center gap-3 ${i === 4 ? 'z-50' : 'z-10'}`}>
                        {/* 🌟 LEAD MOVE ANIMATION (FOR AGENT 1) */}
                        {i === 1 && (
                            <div className="absolute left-7 top-1/2 -mt-[4px] w-48 h-1 pointer-events-none z-0">
                                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-lead-to-pool shadow-[0_0_8px_#60a5fa]"></div>
                            </div>
                        )}

                        <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover/agent:border-indigo-500/50 group-hover/agent:scale-110 relative z-10`}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i+20}`} alt="Agent" className="w-10 h-10" />
                            <div className={`absolute inset-0 border-2 rounded-2xl ${i % 2 === 0 ? 'border-emerald-500' : 'border-amber-400 font-bold'} opacity-20`}></div>
                        </div>
                        
                        {/* Agent Node Info */}
                        <div className={`w-24 px-3 py-1.5 bg-slate-900/80 border border-white/5 rounded-xl backdrop-blur-md relative overflow-visible ${i === 4 ? 'z-50' : 'z-10'}`}>
                            {/* Floating "INTERESTED" Label (ABOVE AGENT_1) */}
                            {i === 1 && (
                                <div className="absolute -top-5 left-0 w-full flex justify-center py-1">
                                    <span className="bg-blue-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap">
                                        INTERESTED
                                    </span>
                                </div>
                            )}

                            {/* Floating "RINGING" Label (ABOVE AGENT_2) */}
                            {i === 2 && (
                                <div className="absolute -top-5 left-0 w-full flex justify-center py-1">
                                    <span className="bg-amber-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap">
                                        RINGING...
                                    </span>
                                </div>
                            )}

                            {/* Floating "NOT INTERESTED" Label (ABOVE AGENT_3) */}
                            {i === 3 && (
                                <div className="absolute -top-5 left-0 w-full flex justify-center py-1">
                                    <span className="bg-red-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap">
                                        NOT INTERESTED
                                    </span>
                                </div>
                            )}

                            {/* Floating "CLOSED" Label (ABOVE AGENT_4) */}
                            {i === 4 && (
                                <div className="absolute -top-5 left-0 w-full flex justify-center py-1">
                                    <span className="bg-emerald-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap">
                                        CLOSED
                                    </span>
                                </div>
                            )}

                            <p className="text-[8px] font-black text-white/50 uppercase">Agent_{i}</p>
                            <div className="flex items-center gap-1">
                                <span className={`w-1 h-1 rounded-full ${i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-amber-500' : i === 3 ? 'bg-red-500' : i === 4 ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                <p className="text-[7px] text-white font-bold leading-tight uppercase tracking-tighter">
                                    {i === 1 ? 'FOLLOW UP' : i === 2 ? 'RINGING' : i === 3 ? 'NOT INTERESTED' : i === 4 ? 'CLOSED' : 'READY'}
                                </p>
                            </div>

                            {/* ✅ TICK BUTTON (FOR AGENT 1) */}
                            {i === 1 && (
                                <div className="absolute -right-2 -top-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border border-white/20">
                                    <i className="fi fi-rr-check flex text-white text-[10px]"></i>
                                </div>
                            )}

                            {/* 📞 MISSED CALL ICON (FOR AGENT 2) */}
                            {i === 2 && (
                                <div className="absolute -right-2 -top-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border border-white/20 z-50">
                                    <i className="fi fi-rr-phone-slash flex text-white text-[11px]"></i>
                                </div>
                            )}

                            {/* ❌ REJECTED ICON (FOR AGENT 3) */}
                            {i === 3 && (
                                <div className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white/20 z-50">
                                    <i className="fi fi-rr-cross-small flex text-white text-[12px]"></i>
                                </div>
                            )}

                            {/* 💰 CLOSED ICON (FOR AGENT 4) */}
                            {i === 4 && (
                                <div className="absolute -right-2 -top-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border border-white/20 z-50">
                                    <i className="fi fi-rr-usd-circle flex text-white text-[11px]"></i>
                                </div>
                            )}
                        </div>

                        {/* 🏢 INDIVIDUAL FOLLOW-UP POOL */}
                        <div className="flex items-center gap-2 group/pool relative">
                           {/* Tiny Connection Line */}
                           <div className="w-6 h-[1px] bg-slate-800 relative -z-10"></div>
                           
                           <div className="px-3 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/40 transition-all duration-500 backdrop-blur-md relative overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover/pool:translate-x-full transition-transform duration-1000"></div>
                               <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center">
                                     <i className="fi fi-rr-box flex text-indigo-400 text-[10px]"></i>
                                  </div>
                                  <div className="text-left">
                                      <p className="text-[6px] font-black text-indigo-300 uppercase leading-none mb-1 text-nowrap">Personal Pool</p>
                                      <div className="flex items-center gap-1">
                                         <p className="text-[10px] text-white font-black leading-none">{12+i*3 + (i === 1 ? 1 : 0)}</p>
                                         <span className="text-[6px] text-slate-500 font-bold uppercase tracking-tighter italic">Follow-ups</span>
                                      </div>
                                  </div>
                               </div>
                               {/* Tiny dots representing leads in pool */}
                               <div className="flex gap-0.5 mt-1.5">
                                  {[1,2,3,4,5].map(dot => (
                                     <div key={dot} className={`w-1 h-1 rounded-full ${i === 1 && dot === 5 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`}></div>
                                  ))}
                               </div>
                           </div>
                        </div>
                     </div>
                  ))}
                </div>

              
             
              </div>

            </div>

            {/* SYNC WAVE & MESSAGE */}
            <div className="mt-20 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center">
                                <i className="fi fi-rr-shield-check flex text-indigo-400 text-[10px]"></i>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-1">Encrypted • Masked • Role-Based</p>
                        <p className="text-white text-xs font-black uppercase">Enterprise Grade Security Protocol</p>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-3xl">
                        <i className="fi fi-rr-cloud-share flex text-blue-400 text-xl"></i>
                        <span className="text-white font-black text-[10px] uppercase tracking-widest whitespace-nowrap">Cloud Synced • Auto Recovery • Real-Time</span>
                    </div>
                 
                </div>
            </div>

          
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        @keyframes sequenced-flow {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-sequenced-flow {
          animation: sequenced-flow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes text-slide {
          0%, 15% { transform: translateY(0); }
          25%, 40% { transform: translateY(-16px); }
          50%, 65% { transform: translateY(-32px); }
          75%, 90% { transform: translateY(-48px); }
          100% { transform: translateY(0); }
        }
        .animate-text-slide {
          animation: text-slide 8s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes glow-pulse {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); box-shadow: 0 0 20px rgba(75, 51, 232, 0); }
          50% { border-color: rgba(75, 51, 232, 0.4); box-shadow: 0 0 30px rgba(75, 51, 232, 0.2); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 4s infinite;
        }
        .animate-bounce-slow {
          animation: bounce 4s infinite;
        }
        @keyframes lead-to-pool {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(180px); opacity: 0; }
        }
        .animate-lead-to-pool {
          animation: lead-to-pool 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
