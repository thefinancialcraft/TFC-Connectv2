import React from 'react';

const LeadershipSection = () => {
  const leaders = [
    {
      name: "Deepak kumar",
      role: "Director of Rynxly",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQGqpFFshSoPGA/profile-displayphoto-scale_400_400/B4DZxQXpn4KYAg-/0/1770874906991?e=1773273600&v=beta&t=2l-ZjQk1JC0lYJuf_Tt-JYpzQYsCs39U83sH70gwxsY",
      bio: "Visionary leader driving the future of SIM-based CRM solutions. With over a decade of experience in sales technology, Deepak kumar leads Rynxly's strategic growth and product innovation.",
      linkedin: "https://www.linkedin.com/in/deepak-kumar-8027233b0/",
    }
  ];

  const employees = [
    { name: "Harshit Pandey", role: "Software Engineer", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&gesture=ok" },
    { name: "Manoj Kohli", role: "Product Designer", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&gesture=ok" },
    { name: "Aakash Sharma", role: "Sales Lead", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Oliver&gesture=point" },
    { name: "Deepak Tiwari", role: "Operations Manager", image: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&gesture=ok" },
  ];

  const investors = [
    { 
      name: "Ajay Kumar", 
      role: "Director of The Financial Craft", 
      image: "https://media.licdn.com/dms/image/v2/D5603AQF3KsdFJvrLVg/profile-displayphoto-scale_200_200/B56Zof7yFKJwAY-/0/1761472359234?e=1773273600&v=beta&t=r-aLAChM6OouHt7kzLBV4_4CRazXNwxLhTfM0WAMtyc",
      bio: "A seasoned finance expert providing strategic guidance to ensure Rynxly remains at the forefront of financial technology integration.",
      linkedin: "https://www.linkedin.com/in/ajay-kumar-42aa13190/"
    },
    { 
      name: "Ashwani Patel", 
      role: "Director of Kridha Cash Wave", 
      image:"https://api.dicebear.com/7.x/notionists/svg?seed=Felix&gesture=ok" ,
      bio: "An industry veteran empowering Rynxly with market insights and investment strategies to scale the platform globally.",
      linkedin: "#"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Leadership Main Section - Dark Theme Like Pricing */}
      <section id="team-leadership" className="relative py-24 bg-[#01040a] overflow-hidden rounded-[4rem] mx-2 my-12 shadow-2xl shadow-indigo-500/20 group/team">
        {/* Texture & Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        {/* background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/20 blur-[130px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/15 blur-[120px] rounded-full"></div>
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>

        <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center pb-2 max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="px-3 py-1 rounded-full bg-indigo-50/10 border border-[#4b33e8]/20 text-[#4b33e8] text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
                    The Minds Behind Rynxly
                </span>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                    Visionary <span className="text-[#4b33e8]">Leadership</span> Team
                </h2>
                <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                    Driving the future of SIM-based CRM technology for global sales teams.
                </p>
            </div>

            {/* Founder Card - Wide & Premium */}
            <div className="flex justify-center max-w-6xl mx-auto mb-24">
                {leaders.map((leader, index) => (
                    <div key={index} className="relative group/card w-full p-[3px] rounded-[3rem] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_50px_rgba(75,51,232,0.3)]">
                        {/* Shimmer Border Animation (Only on Hover) */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_10%,#4b33e8_30%,#8571ff_50%,#4b33e8_70%,transparent_90%)] animate-[spin_3s_linear_infinite] blur-[2px]"></div>
                        </div>

                        <div className="relative z-10 bg-[#0a0c12]/90 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 border border-white/10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="relative shrink-0">
                                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl relative">
                                    <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-700" />
                                </div>
                                <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#4b33e8] text-white rounded-2xl flex items-center justify-center hover:bg-[#3b27b8] transition-all shadow-xl">
                                    <i className="fi fi-brands-linkedin flex text-xl"></i>
                                </a>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-3xl sm:text-5xl font-bold text-white mb-3 tracking-tight">{leader.name}</h3>
                                <p className="text-[#4b33e8] font-black text-xs tracking-[0.3em] uppercase mb-8">{leader.role}</p>
                                <div className="h-[1px] w-20 bg-white/10 mb-8 mx-auto md:mx-0"></div>
                                <p className="text-gray-400 text-lg leading-relaxed italic max-w-xl font-medium">"{leader.bio}"</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Core Team Grid */}
            <div className="text-center mb-16">
                <span className="text-[9px] font-black text-[#4b33e8] uppercase tracking-[0.3em] mb-4 inline-block">The Specialists</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">Core <span className="text-[#4b33e8]">Team</span></h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-24">
                {employees.map((emp, i) => (
                    <div key={i} className="group relative bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 hover:border-[#4b33e8]/30 transition-all text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:scale-110 transition-transform shadow-lg">
                            <img src={emp.image} alt={emp.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-white mb-1">{emp.name}</h4>
                        <p className="text-[#4b33e8] text-[8px] font-black uppercase tracking-widest">{emp.role}</p>
                    </div>
                ))}
            </div>

            {/* Investors Grid */}
            <div className="text-center mb-16">
                <span className="text-[9px] font-black text-[#4b33e8] uppercase tracking-[0.3em] mb-4 inline-block">Strategic Growth</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">Our <span className="text-[#4b33e8]">Investors</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {investors.map((inv, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm p-10 rounded-[3rem] border border-white/10 flex gap-8 items-center group relative overflow-hidden transition-all hover:bg-white/[0.08]">
                        <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-white/5 relative group-hover:scale-105 transition-transform duration-500">
                            <img src={inv.image} alt={inv.name} className="w-full h-full object-cover" />
                            {inv.linkedin !== "#" && (
                                <a href={inv.linkedin} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-[#4b33e8]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl">
                                    <i className="fi fi-brands-linkedin"></i>
                                </a>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-xl text-white mb-1">{inv.name}</h4>
                            <p className="text-[#4b33e8] text-[9px] font-black uppercase tracking-[0.15em] mb-4">{inv.role}</p>
                            <p className="text-gray-400 text-xs italic leading-relaxed line-clamp-2">"{inv.bio}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LeadershipSection;
