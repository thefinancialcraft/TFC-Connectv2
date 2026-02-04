export default function IndustrySolutions() {
  const industries = [
    {
      name: "Insurance Agencies",
      icon: "fi-rr-umbrella",
      desc: "Manage policy renewals and claims efficiently. Ensure every lead gets a callback and track agent performance during peak renewal seasons.",
      stats: "35% higher conversion in renewal calls"
    },
    {
      name: "Real Estate",
      icon: "fi-rr-building",
      desc: "Never miss a property inquiry. Group internal leads by location or budget and automate site-visit confirmations.",
      stats: "2x more site visits scheduled"
    },
    {
      name: "Loan & Finance",
      icon: "fi-rr-sack-dollar",
      desc: "Securely handle sensitive customer data with number masking. Track disbursement follow-ups and document collection calls.",
      stats: "Zero data leakage incidents"
    },
    {
      name: "Education & Coaching",
      icon: "fi-rr-graduation-cap",
      desc: "Manage thousands of student inquiries. Segment leads by course interest (NEET/JEE/UPSC) and assign to specialized counselors.",
      stats: "Streamlined counselor workflow"
    },
    {
      name: "Recruitment (HR)",
      icon: "fi-rr-briefcase",
      desc: "High-volume candidate calling made easy. Screen candidates faster and manage interview scheduling directly from the CRM.",
      stats: "50+ calls per hour per recruiter"
    },
    {
      name: "Service Centers",
      icon: "fi-rr-wrench-simple",
      desc: "Automate service reminders and feedback calls. Keep customers happy with timely updates on their vehicle or appliance status.",
      stats: "Improved customer retention score"
    }
  ];

  return (
    <div className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-purple-50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wide text-[#4b33e8] uppercase mb-3">Industries</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for High-Volume <span className="text-[#4b33e8]">Calling Teams</span>
          </h3>
          <p className="text-lg text-gray-500">
            Whether you are selling policies, booking flats, or hiring talent—if your team interacts with customers via phone, Rynxly is your engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4b33e8] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className={`fi ${item.icon}`}></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900">{item.name}</h4>
              </div>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {item.desc}
              </p>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs font-bold text-[#4b33e8] uppercase tracking-wider flex items-center gap-2">
                    <i className="fi fi-rr-chart-histogram"></i>
                    {item.stats}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
