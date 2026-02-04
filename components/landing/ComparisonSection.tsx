import React from 'react';

const comparisonData = [
  {
    feature: "Native SIM Calling (no VoIP)",
    rynxly: { val: "yes", desc: "Uses Android SIM for calling" },
    others: { val: "no", desc: "Mostly VoIP / 3rd-party required" }
  },
  {
    feature: "Zero Overdue Protocol",
    rynxly: { val: "yes", desc: "Enforces follow-up discipline" },
    others: { val: "no", desc: "Depends on manual tracking" }
  },
  {
    feature: "Smart Lead Distribution",
    rynxly: { val: "yes", desc: "Built-in round-robin & performance" },
    others: { val: "maybe", desc: "Basic automation, not specialized" }
  },
  {
    feature: "Data Security / Number Masking",
    rynxly: { val: "yes", desc: "High privacy — no raw numbers shown" },
    others: { val: "maybe", desc: "Standard CRMs store raw numbers" }
  },
  {
    feature: "Real-Time Mobile ↔ Web Sync",
    rynxly: { val: "yes", desc: "Instant call logs & durations" },
    others: { val: "maybe", desc: "Syncs after call or via add-ons" }
  },
  {
    feature: "Call Details & Recording",
    rynxly: { val: "yes", desc: "In-app + Dashboard logging" },
    others: { val: "maybe", desc: "Built-in only with VoIP partners" }
  },
  {
    feature: "Designed for High Call Volumes",
    rynxly: { val: "yes", desc: "Purpose-built engine" },
    others: { val: "maybe", desc: "Optional add-ons or partners" }
  },
  {
    feature: "Cost Efficiency",
    rynxly: { val: "yes", desc: "Lower CTI costs (no VoIP fees)" },
    others: { val: "maybe", desc: "Telephony add-ons are expensive" }
  },
  {
    feature: "Marketing Automation",
    rynxly: { val: "no", desc: "Focus is calling & follow-ups" },
    others: { val: "yes", desc: "Email, campaign workflows" }
  },
  {
    feature: "Setup & Training",
    rynxly: { val: "yes", desc: "Minimal / Zero setup time" },
    others: { val: "maybe", desc: "Moderate to high for enterprise" }
  }
];

export default function WhyRynxly() {
  return (
    <div id="comparison" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wide text-[#4b33e8] uppercase mb-3">Comparison</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-[#4b33e8]">Rynxly?</span>
          </h3>
          <p className="text-base text-gray-500 leading-relaxed">
            Rynxly isn't just another CRM. It's a purpose-built engine for high-performance calling teams. 
            See how we compare to traditional sales platforms.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 overflow-x-auto rounded-3xl border border-gray-100 shadow-2xl shadow-indigo-100/20">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Feature / Capability</th>
                <th className="p-6 text-sm font-black text-[#4b33e8] uppercase tracking-widest border-b border-gray-100 bg-indigo-50/30">Rynxly CRM</th>
                <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Traditional CRMs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <p className="text-sm font-bold text-gray-800">{row.feature}</p>
                  </td>
                  
                  {/* Rynxly Column */}
                  <td className="p-6 bg-indigo-50/10 group-hover:bg-indigo-50/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        row.rynxly.val === 'yes' ? 'bg-emerald-100 text-emerald-600' : 
                        row.rynxly.val === 'no' ? 'bg-gray-100 text-gray-400' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <i className={`fi flex text-[10px] ${
                          row.rynxly.val === 'yes' ? 'fi-rr-check' : 
                          row.rynxly.val === 'no' ? 'fi-rr-cross' : 'fi-rr-info'
                        }`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight mb-0.5">
                          {row.rynxly.val === 'yes' ? 'Included' : row.rynxly.val === 'no' ? 'Not Focus' : 'Limited'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">{row.rynxly.desc}</p>
                      </div>
                    </div>
                  </td>

                  {/* Others Column */}
                  <td className="p-6">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        row.others.val === 'yes' ? 'bg-emerald-100 text-emerald-600' : 
                        row.others.val === 'no' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        <i className={`fi flex text-[10px] ${
                          row.others.val === 'yes' ? 'fi-rr-check' : 
                          row.others.val === 'no' ? 'fi-rr-cross' : 'fi-rr-exclamation'
                        }`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700 leading-tight mb-0.5">
                          {row.others.val === 'yes' ? 'Standard' : row.others.val === 'no' ? 'Missing' : 'Restricted'}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium leading-tight">{row.others.desc}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-[#0F172A] rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4b33e8]/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
               <h4 className="text-3xl font-bold mb-4 italic">The Rynxly Edge ⚡</h4>
               <p className="text-gray-400 leading-relaxed text-sm">
                 Traditional CRMs are built for managing accounts and marketing emails. **Rynxly is built for the calling floor.** We prioritize the agent's time, the manager's visibility, and the security of your leads above everything else.
               </p>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#0F172A] flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-[#4b33e8] border-2 border-[#0F172A] flex items-center justify-center text-[10px] font-bold">500+</div>
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Trusted by 500+ Agents</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
