export default function IndustrySolutions() {
  const industries = [
    {
      name: "Insurance Agencies",
      icon: "fi-rr-umbrella flex",
      desc: "Manage policy renewals and claims efficiently. Ensure every lead gets a callback and track agent performance during peak renewal seasons.",
      stats: "35% higher conversion in renewal calls"
    },
    {
      name: "Real Estate",
      icon: "fi-rr-building flex",
      desc: "Never miss a property inquiry. Group internal leads by location or budget and automate site-visit confirmations.",
      stats: "2x more site visits scheduled"
    },
    {
      name: "Loan & Finance",
      icon: "fi-rr-sack-dollar flex",
      desc: "Securely handle sensitive customer data with number masking. Track disbursement follow-ups and document collection calls.",
      stats: "Zero data leakage incidents"
    },
    {
      name: "Education & Coaching",
      icon: "fi-rr-graduation-cap flex",
      desc: "Manage thousands of student inquiries. Segment leads by course interest (NEET/JEE/UPSC) and assign to specialized counselors.",
      stats: "Streamlined counselor workflow"
    },
    {
      name: "Recruitment (HR)",
      icon: "fi-rr-briefcase flex",
      desc: "High-volume candidate calling made easy. Screen candidates faster and manage interview scheduling directly from the CRM.",
      stats: "50+ calls per hour per recruiter"
    },
    {
      name: "Service Centers",
      icon: "fi-rr-wrench-simple flex",
      desc: "Automate service reminders and feedback calls. Keep customers happy with timely updates on their vehicle or appliance status.",
      stats: "Improved customer retention score"
    }
  ];

  return (
    <div className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-purple-50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-wide text-[#4b33e8] uppercase mb-3 text-center">Industries</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
            Built for High-Volume <span className="text-[#4b33e8]">Calling Teams</span>
          </h3>
          <p className="text-base text-gray-500 text-center">
            Whether you are selling policies, booking flats, or hiring talent—if your team interacts with customers via phone, Rynxly is your engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-100/20 transition-all duration-500 group flex flex-col relative overflow-hidden">
              {/* Subtle Decorative Icon in background */}
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                <i className={`fi ${item.icon} flex text-8xl`}></i>
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#4b33e8] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-[#4b33e8] group-hover:text-white transition-all duration-500 shadow-sm">
                  <i className={`fi ${item.icon}`}></i>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4b33e8] transition-colors">{item.name}</h4>
                
                <p className="text-gray-500 mb-8 leading-relaxed text-sm flex-1">
                  {item.desc}
                </p>
                
                <div className="pt-6 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <i className="fi fi-rr-chart-histogram flex text-xs"></i>
                        </div>
                        <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                            {item.stats}
                        </p>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
