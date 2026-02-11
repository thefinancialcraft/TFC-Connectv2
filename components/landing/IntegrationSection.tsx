
export default function IntegrationSection() {
    return (
       <div className="py-24 bg-gray-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-sm font-bold tracking-wide text-[#4b33e8] uppercase mb-3">
                      <i className="fi fi-brands-google flex inline-block mr-2 transform translate-y-0.5"></i>
                      Native Integration
                  </h2>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Seamlessly Sync with <span className="text-[#4b33e8]">Google Calendar</span>
                  </h2>
                  <p className="text-base text-gray-500">
                      Never miss a follow-up. Rynxly automatically pushes scheduled calls and meetings directly to your agents' Google Calendar, ensuring they are always notified on time.
                  </p>
            </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left: Content */}
              <div>
                  <div className="space-y-6 mb-10">
                      <div className="flex items-start gap-4 group">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                             <i className="fi fi-rr-calendar-clock flex"></i>
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-900 mb-1">Auto-Scheduling</h4>
                              <p className="text-sm text-gray-500">Scheduled a callback? It's instantly added to the calendar.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                             <i className="fi fi-rr-bell-ring flex"></i>
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-900 mb-1">Smart Reminders</h4>
                              <p className="text-sm text-gray-500">Get native phone notifications 10 minutes before every call.</p>
                          </div>
                      </div>
                  </div>
 
                  {/* Code Snippet Card */}
                  {/* Settings Widget Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-gray-900">Integration Settings</h3>
                          <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wide border border-green-100">Active</span>
                      </div>

                      <div className="space-y-4">
                          {/* Account Connection */}
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100">
                                      <i className="fi fi-brands-google text-lg flex"></i>
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-900">Google Calendar</p>
                                      <p className="text-xs text-gray-500">Connected as team@rynxly.in</p>
                                  </div>
                              </div>
                              <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                              </div>
                          </div>

                          {/* Toggles */}
                          <div className="space-y-3 pl-2">
                              <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded bg-[#4b33e8] flex items-center justify-center text-white text-xs">
                                      <i className="fi fi-rr-check flex"></i>
                                  </div>
                                  <span className="text-sm font-medium text-gray-600">Sync Call Schedules</span>
                              </div>
                              <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded bg-[#4b33e8] flex items-center justify-center text-white text-xs">
                                      <i className="fi fi-rr-check flex"></i>
                                  </div>
                                  <span className="text-sm font-medium text-gray-600">Sync Reminders</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
 
              {/* Right: Visual Mockup */}
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-100 rounded-3xl rotate-3 scale-95 opacity-50 -z-10"></div>
                 <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative">
                     {/* Fake Browser Headers */}
                     <div className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-6">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calendar View</span>
                         <div className="flex gap-2">
                             <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                             <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                         </div>
                     </div>
                     
                     {/* Calendar Visual */}
                     <div className="p-8">
                         <div className="grid grid-cols-1 gap-4">
                             {/* Time Slots */}
                             {[
                                 { time: "09:00 AM", event: "Daily Standup", color: "bg-gray-100 text-gray-500", border: "border-gray-200" },
                                 { time: "10:00 AM", event: "", color: "", border: "" },
                                 { time: "10:30 AM", event: "Call with Rohit Sharma (Lead #402)", color: "bg-blue-50 text-blue-700", border: "border-blue-100", active: true },
                                 { time: "11:00 AM", event: "", color: "", border: "" },
                                 { time: "11:15 AM", event: "Follow-up: Sneha Gupta", color: "bg-indigo-50 text-indigo-700", border: "border-indigo-100", active: true },
                                 { time: "12:00 PM", event: "Lunch Break", color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
                             ].map((slot, i) => (
                                 <div key={i} className="flex gap-4">
                                     <div className="w-20 text-xs font-bold text-gray-400 pt-3 text-right">{slot.time}</div>
                                     <div className={`flex-1 min-h-[50px] rounded-xl border ${slot.border || 'border-transparent border-t-gray-50'} ${slot.color || ''} p-3 relative group`}>
                                         {slot.event && (
                                             <div className="flex items-center justify-between">
                                                 <span className="text-xs font-bold">{slot.event}</span>
                                                 {slot.active && <i className="fi fi-brands-google text-xs opacity-50 flex"></i>}
                                             </div>
                                         )}
                                         {slot.active && (
                                              <div className="absolute -right-2 -top-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white text-[10px] transform scale-0 group-hover:scale-110 transition-transform duration-200">
                                                  <i className="fi fi-rr-check flex"></i>
                                              </div>
                                         )}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
 
                     {/* Integration Status Badge */}
                     <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur border border-green-100 rounded-lg flex items-center gap-3 animate-bounce">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         <span className="text-xs font-bold text-green-700">Sync Active</span>
                     </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
 }
