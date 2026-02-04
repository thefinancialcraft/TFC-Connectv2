export default function Testimonials() {
  const reviews = [
    {
      text: "Rynxly completely changed how our sales team operates. We went from 50 calls a day per agent to 120+. The tracking is phenomenal.",
      author: "Priya Mehta",
      role: "Sales Director, Housing.com",
      color: "bg-blue-500"
    },
    {
      text: "The 'Zero-Overdue' feature is a game changer. My team finally clears their backlog before asking for new leads. Conversion is up 40%.",
      author: "Rajesh Kumar",
      role: "CEO, FinServe Capital",
      color: "bg-emerald-500"
    },
    {
      text: "Setup took 10 minutes. The mobile app sync is instant. No more 'I forgot to update the excel sheet' excuses from my agents.",
      author: "Sneha Patel",
      role: "HR Head, TalentHire",
      color: "bg-purple-500"
    }
  ];

  return (
    <div id="testimonials" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by <span className="text-[#4b33e8]">Performance Teams</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300">
              {/* Quote Icon */}
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif leading-none group-hover:text-indigo-50 transition-colors">"</div>
              
              <div className="relative z-10">
                <div className="flex gap-1 text-amber-400 mb-4 text-sm">
                  <i className="fi fi-rs-star"></i>
                  <i className="fi fi-rs-star"></i>
                  <i className="fi fi-rs-star"></i>
                  <i className="fi fi-rs-star"></i>
                  <i className="fi fi-rs-star"></i>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed italic">
                  "{r.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${r.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {r.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{r.author}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{r.role}</p>
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
