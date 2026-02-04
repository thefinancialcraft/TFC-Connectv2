export default function ClientLogos() {
  const logos = [
    { name: "TechCorp", icon: "fi-brands-slack flex" },
    { name: "FinServe", icon: "fi-brands-stripe flex" },
    { name: "EstatePro", icon: "fi-brands-airbnb flex" },
    { name: "EduLearn", icon: "fi-brands-discord flex" },
    { name: "AutoFix", icon: "fi-brands-uber flex" },
    { name: "CloudSystems", icon: "fi-brands-amazon flex" },
  ];

  return (
    <div className="py-32 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-sm font-semibold text-gray-400 mb-16 uppercase tracking-widest">Trusted by fast-growing teams</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-300 transition-colors hover:text-gray-500 cursor-pointer">
              <i className={`fi ${logo.icon} text-3xl`}></i>
              <span className="text-xl font-bold font-sans">{logo.name}</span>
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
      
      <style jsx>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
