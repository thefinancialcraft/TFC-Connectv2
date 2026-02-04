export default function ProblemSolution() {
    return (
      <div className="py-24 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left: The Problems */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                        Break Free from the <br/>
                        <span className="text-red-400">Chaos of Manual Calling</span>
                    </h2>
                    
                    <div className="space-y-8">
                        <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-1">
                                <i className="fi fi-rr-cross"></i>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-200 mb-2">The "Excel Headache"</h4>
                                <p className="text-gray-400">Leads get lost, duplicate calls annoy customers, and managers have zero visibility into who called whom.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-1">
                                <i className="fi fi-rr-cross"></i>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-200 mb-2">Missed Follow-Ups</h4>
                                <p className="text-gray-400">"I forgot to call back" is the #1 reason for lost sales. Without automated reminders, money is left on the table.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-1">
                                <i className="fi fi-rr-cross"></i>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-200 mb-2">Data Theft Risk</h4>
                                <p className="text-gray-400">Agents leaving with your customer list in their pocket. Raw excel sheets are insecure and prone to leakage.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: The Solution (Visual Card) */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#4b33e8] to-purple-600 rounded-3xl blur-lg opacity-30"></div>
                    <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-6">
                            <div className="w-10 h-10 bg-[#4b33e8] rounded-lg flex items-center justify-center text-white">
                                <i className="fi fi-rr-check text-xl"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">The Rynxly Advantage</h3>
                                <p className="text-sm text-gray-400">Transforming chaos into order</p>
                            </div>
                        </div>

                        <ul className="space-y-5">
                            <li className="flex items-center gap-4">
                                <i className="fi fi-rr-check-circle text-emerald-400 text-xl"></i>
                                <span className="text-gray-300"><strong className="text-white">Smart Pooling:</strong> Leads are distributed automatically. No more fighting for data.</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <i className="fi fi-rr-check-circle text-emerald-400 text-xl"></i>
                                <span className="text-gray-300"><strong className="text-white">Zero-Overdue Policy:</strong> System blocks new leads until follow-ups are cleared.</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <i className="fi fi-rr-check-circle text-emerald-400 text-xl"></i>
                                <span className="text-gray-300"><strong className="text-white">Data Privacy:</strong> Numbers are masked. Agents click-to-call securely.</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <i className="fi fi-rr-check-circle text-emerald-400 text-xl"></i>
                                <span className="text-gray-300"><strong className="text-white">Live Tracking:</strong> See exactly who is talking, who is idle, and who is closing.</span>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                            <p className="text-sm text-gray-500 italic">"We replaced 400 spreadsheets with 1 Rynxly dashboard."</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    );
  }
