export default function WorkflowSteps() {
  const steps = [
    {
      step: "01",
      title: "Import Data",
      desc: "Upload CSVs or sync leads via API. Our system automatically cleans duplicates and validates numbers.",
      bg: "bg-blue-100/50",
      text: "text-blue-600",
      icon: "fi-rr-cloud-upload"
    },
    {
      step: "02",
      title: "Auto-Assign",
      desc: "Define your logic. Round-robin, performance-based, or location-based. Detailed lead routing rules.",
      bg: "bg-purple-100/50",
      text: "text-purple-600",
      icon: "fi-rr-network"
    },
    {
      step: "03",
      title: "Agents Call",
      desc: "Agents receive leads on their mobile app. One tap to dial. Call outcome is logged instantly.",
      bg: "bg-emerald-100/50",
      text: "text-emerald-600",
      icon: "fi-rr-smartphone"
    },
    {
      step: "04",
      title: "Track & Close",
      desc: "Managers watch live dashboards. Identify bottlenecks, listen to recordings, and celebrate closings.",
      bg: "bg-amber-100/50",
      text: "text-amber-600",
      icon: "fi-rr-chart-histogram"
    }
  ];

  return (
    <div id="how-it-works" className="py-32 bg-gray-50/50 relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4b33e8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-indigo-50/80 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-blue-50/80 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <span className="px-4 py-2 rounded-full bg-indigo-100/50 text-[#4b33e8] text-xs font-bold tracking-widest uppercase border border-indigo-100 inline-block mb-4">
             Seamless Workflow
          </span>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            From <span className="text-[#4b33e8]">Lead to Deal</span> <br/>in 4 Automated Steps
          </h3>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
             Complex routing logic happens in the background. Your team just sees a simple, streamlined path to success.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[80px] left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200 rounded-full opacity-50 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 group">
                <div className="flex flex-col h-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-2">
                  
                  {/* Step Number & Icon Circle */}
                  <div className="relative mb-8 flex justify-center lg:justify-start">
                     <div 
                        className={`w-20 h-20 rounded-2xl ${s.bg} ${s.text} flex items-center justify-center text-3xl shadow-sm border-4 border-white relative z-10 group-hover:scale-110 transition-transform duration-300`}
                        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }} 
                      >
                        <i className={`fi ${s.icon}`}></i>
                        
                        {/* Number Badge */}
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                           {s.step}
                        </div>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="text-center lg:text-left">
                     <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#4b33e8] transition-colors">{s.title}</h4>
                     <p className="text-gray-500 leading-relaxed text-sm mb-6 min-h-[60px]">{s.desc}</p>
                     
                     {/* "Lean More" Pseudo-link */}
                     <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-bold text-gray-400 group-hover:text-[#4b33e8] transition-colors cursor-pointer">
                        <span>Learn more</span>
                        <i className="fi fi-rr-arrow-right group-hover:translate-x-1 transition-transform"></i>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
