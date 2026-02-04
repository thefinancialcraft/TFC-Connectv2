export default function FeaturesSection() {
  const features = [
    {
      title: "Mobile-Web Bridge",
      description: "Live syncing of call logs from SIM to Dashboard. Your agents use their mobile, you track everything on the web.",
      icon: "fi-rr-smartphone", // Using uicons class
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Smart Pooling & Recycling",
      description: "Never lose a lead. Unanswered calls are automatically recycled back into the general pool for a second chance.",
      icon: "fi-rr-refresh",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Zero-Overdue Protocol",
      description: "Our system forces follow-ups to be cleared before new leads are assigned, ensuring no opportunity slips through the cracks.",
      icon: "fi-rr-calendar-clock",
      color: "bg-amber-100 text-amber-600"
    },
    {
      title: "Role-Based Security",
      description: "Enterprise-grade permissions. From 'Agent' to 'Sales Head' to 'Admin', everyone sees exactly what they need to see.",
      icon: "fi-rr-shield-check",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Number Masking",
      description: "Protect your customer data. Agents can click-to-call without ever seeing the full customer phone number.",
      icon: "fi-rr-eye-crossed",
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Custom Kanban",
      description: "Visualize your workflow. Customize lead outcomes and move deals through a drag-and-drop Kanban board.",
      icon: "fi-rr-layout-fluid",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  return (
    <div id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wide text-[#4b33e8] uppercase mb-3">Power Features</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to <span className="text-[#4b33e8]">scale your sales team</span>
          </h3>
          <p className="text-lg text-gray-500">
            Rynxly isn't just a dialer. It's a complete ecosystem designed to eliminate spreadsheets and maximize agent efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-xl transition-transform group-hover:scale-110 ${feature.color}`}>
                <i className={`fi ${feature.icon}`}></i>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4b33e8] transition-colors">
                {feature.title}
              </h4>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
