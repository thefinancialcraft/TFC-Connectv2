import { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
// Removed AppLayout import as it's now handled globally in PortalContainer
import { useActivityData } from "@/hooks/useActivityData";

export default function Activity() {
  const {
    loading,
    error,
    filteredActivities,
    stats,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    formatSeconds,
    formatTime,
    formatDisplayDate,
    source,
    setSource,
    activities,
    mobileActivities,
    orgFilter, setOrgFilter,
    agentFilter, setAgentFilter,
    campaignFilter, setCampaignFilter,
    dispositionFilter, setDispositionFilter,
    callTypeFilter, setCallTypeFilter,
    filterOptions
  } = useActivityData();

  const [activeNav] = useState("activity");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Combined filtration logic - Consolidated into useActivityData hook
  // Reset all filters
  const resetFilters = () => {
     setAgentFilter("All Agents");
     setCampaignFilter("All Campaigns");
     setDispositionFilter("All Dispositions");
     setOrgFilter("All Organizations");
     setCallTypeFilter("All Types");
  };

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  }, []);

  const formatMonthYear = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, []);

  const isSameDay = useCallback((date1: Date, date2: string) => {
    const d2 = new Date(date2);
    return date1.getDate() === d2.getDate() &&
           date1.getMonth() === d2.getMonth() &&
           date1.getFullYear() === d2.getFullYear();
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
    setShowDatePicker(false);
  }, [setSelectedDate]);

  const calendarDays = useMemo(() => getDaysInMonth(currentMonth), [currentMonth, getDaysInMonth]);




  return (
    <>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-6 sm:space-y-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Activity
                  </h1>
                  <p
                    className="text-sm sm:text-base"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Track your calling activities and performance metrics
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-phone-call text-5xl sm:text-6xl"
                      style={{ color: "#4b33e8" }}
                    ></i>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total Dials
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-phone-call text-lg sm:text-xl"
                          style={{ color: "#4b33e8" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {stats.totalDials}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total calls made
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-clock text-5xl sm:text-6xl"
                      style={{ color: "#10b981" }}
                    ></i>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #10b981 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total Talk Time
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-clock text-lg sm:text-xl"
                          style={{ color: "#10b981" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {formatSeconds(stats.totalTalkTime).substring(0, 5)}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        HH:MM
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="relative p-0 flex flex-col overflow-hidden"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-check-circle text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-check-circle text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xl sm:text-2xl font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {stats.contactable}
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Contactable
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-cross-circle text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-cross-circle text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xl sm:text-2xl font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {stats.uncontactable}
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Uncontactable
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="relative p-0 flex flex-col overflow-hidden"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-time-forward text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-time-forward text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xs sm:text-sm font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {stats.idleFrom}
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Idle From
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-phone-pause text-3xl text-white"></i>
                      </div>
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex flex-col justify-between h-full z-10">
                        <div className="flex items-start justify-end mb-1">
                          <i
                            className="fi flex fi-rr-phone-pause text-base sm:text-lg"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        <div>
                          <p
                            className="text-xs sm:text-sm font-bold mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {stats.lastCallTime !== "N/A" ? `${formatDisplayDate(selectedDate)} / ${stats.lastCallTime}` : "N/A"}
                          </p>
                          <p
                            className="text-[10px] sm:text-xs font-medium"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Last Call At
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <div className="mb-4 sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h2
                        className="text-lg font-bold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Activity Details
                      </h2>
                      <div className="relative">
                        <button
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-calendar text-xs" style={{ color: "#4b33e8" }}></i>
                          <span>{formatDisplayDate(selectedDate)}</span>
                        </button>
                        {showDatePicker && (
                          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-72">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={handlePrevMonth}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-left text-sm" style={{ color: "#263238" }}></i>
                              </button>
                              <span className="text-sm font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                {formatMonthYear(currentMonth)}
                              </span>
                              <button
                                onClick={handleNextMonth}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-right text-sm" style={{ color: "#263238" }}></i>
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium py-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                  {day}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {calendarDays.map((day, index) => {
                                const isSelected = isSameDay(day.date, selectedDate);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleDateSelect(day.date)}
                                    className={`text-xs py-2 rounded-lg transition-all ${
                                      isSelected
                                        ? 'text-white font-semibold'
                                        : day.isCurrentMonth
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-gray-400'
                                    }`}
                                    style={{
                                      backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                      fontFamily: "'Roboto', sans-serif"
                                    }}
                                  >
                                    {day.date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                    </div>
                     <p
                      className="text-xs mb-3"
                      style={{
                        color: "#787E9D",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Detailed view of all employee activities
                    </p>

                    {/* Source Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-4 w-full sm:w-auto self-start">
                        <button
                          onClick={() => setSource('crm')}
                          className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            source === 'crm' 
                              ? 'bg-white text-purple-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          CRM Activity
                        </button>
                        <button
                          onClick={() => setSource('mobile')}
                          className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            source === 'mobile' 
                              ? 'bg-white text-purple-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Mobile History
                        </button>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <div className="relative flex-1">
                        <i className="fi flex  fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input
                          type="text"
                          placeholder="Search activities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 h-9 pr-4 py-2 text-xs border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowFilterModal(!showFilterModal)}
                          className={`h-9 w-9 border rounded-lg transition-all flex items-center justify-center ${showFilterModal ? 'bg-[#4b33e8] border-[#4b33e8] text-white shadow-lg' : 'bg-white border-gray-300 text-gray-600 hover:border-[#4b33e8] hover:text-[#4b33e8]'}`}
                        >
                           <i className="fi flex fi-rr-filter text-sm"></i>
                        </button>

                        {showFilterModal && (
                          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                             <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Filters</h3>
                                <button onClick={resetFilters} className="text-[10px] font-black text-indigo-600 uppercase">Reset</button>
                             </div>
                             
                             <div className="space-y-3">
                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Organization</label>
                                   <select 
                                      value={orgFilter}
                                      onChange={(e) => setOrgFilter(e.target.value)}
                                      className="w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                                   >
                                      <option>All Organizations</option>
                                      {filterOptions.organizations.map(org => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                      ))}
                                   </select>
                                </div>

                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Select Agent</label>
                                   <select 
                                      value={agentFilter}
                                      onChange={(e) => setAgentFilter(e.target.value)}
                                      className="w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                                   >
                                      <option>All Agents</option>
                                      {filterOptions.agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name} ({agent.id})</option>
                                      ))}
                                   </select>
                                </div>

                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Campaign</label>
                                   <select 
                                      value={campaignFilter}
                                      onChange={(e) => setCampaignFilter(e.target.value)}
                                      className="w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                                   >
                                      <option>All Campaigns</option>
                                      {filterOptions.campaigns.map(camp => (
                                        <option key={camp} value={camp}>{camp}</option>
                                      ))}
                                   </select>
                                </div>

                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Disposition</label>
                                   <select 
                                      value={dispositionFilter}
                                      onChange={(e) => setDispositionFilter(e.target.value)}
                                      className="w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                                   >
                                      <option>All Dispositions</option>
                                      {filterOptions.dispositions.map(disp => (
                                        <option key={disp} value={disp}>{disp}</option>
                                      ))}
                                   </select>
                                </div>

                                 {source === 'mobile' && (
                                   <div>
                                      <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Call Type</label>
                                      <select 
                                         value={callTypeFilter}
                                         onChange={(e) => setCallTypeFilter(e.target.value)}
                                         className="w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                                      >
                                         <option value="All Types">All Types</option>
                                         <option value="Outgoing">Outgoing</option>
                                         <option value="Incoming">Incoming</option>
                                         <option value="Missed">Missed / Reject</option>
                                      </select>
                                   </div>
                                 )}
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                   
                  </div>

                  <div className="hidden sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2
                        className="text-xl font-bold mb-1"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Activity Details
                      </h2>
                      <p
                        className="text-sm"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Detailed view of all employee activities
                      </p>
                    </div>

                    {/* Desktop Source Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                          onClick={() => setSource('crm')}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            source === 'crm' 
                              ? 'bg-white text-purple-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          CRM Activity
                        </button>
                        <button
                          onClick={() => setSource('mobile')}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                            source === 'mobile' 
                              ? 'bg-white text-purple-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Mobile History
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-64">
                        <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                          type="text"
                          placeholder="Search activities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowFilterModal(!showFilterModal)}
                          className={`h-10 w-10 border rounded-xl transition-all flex items-center justify-center ${showFilterModal ? 'bg-[#4b33e8] border-[#4b33e8] text-white shadow-lg' : 'bg-white border-gray-300 text-gray-600 hover:border-[#4b33e8] hover:text-[#4b33e8]'}`}
                        >
                           <i className="fi flex fi-rr-filter text-base"></i>
                        </button>

                        {showFilterModal && (
                          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-5 animate-in fade-in slide-in-from-top-2">
                             <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Advanced Filters</h3>
                                <button onClick={resetFilters} className="text-[10px] font-black text-indigo-600 hover:underline uppercase">Reset All</button>
                             </div>
                             
                             <div className="space-y-4">
                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Organization Name</label>
                                   <select 
                                      value={orgFilter}
                                      onChange={(e) => setOrgFilter(e.target.value)}
                                      className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                                   >
                                      <option>All Organizations</option>
                                      {filterOptions.organizations.map(org => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                      ))}
                                   </select>
                                </div>

                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Select Agent Name / ID</label>
                                   <select 
                                      value={agentFilter}
                                      onChange={(e) => setAgentFilter(e.target.value)}
                                      className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                                   >
                                      <option>All Agents</option>
                                      {filterOptions.agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name} ({agent.id})</option>
                                      ))}
                                   </select>
                                </div>

                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Campaign Filter</label>
                                   <select 
                                      value={campaignFilter}
                                      onChange={(e) => setCampaignFilter(e.target.value)}
                                      className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                                   >
                                      <option>All Campaigns</option>
                                      {filterOptions.campaigns.map(camp => (
                                        <option key={camp} value={camp}>{camp}</option>
                                      ))}
                                   </select>
                                </div>

                                <div>
                                   <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Disposition Filter</label>
                                   <select 
                                      value={dispositionFilter}
                                      onChange={(e) => setDispositionFilter(e.target.value)}
                                      className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                                   >
                                      <option>All Dispositions</option>
                                      {filterOptions.dispositions.map(disp => (
                                        <option key={disp} value={disp}>{disp}</option>
                                      ))}
                                   </select>
                                </div>

                                {source === 'mobile' && (
                                   <div>
                                      <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Call Type Filter</label>
                                      <select 
                                         value={callTypeFilter}
                                         onChange={(e) => setCallTypeFilter(e.target.value)}
                                         className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                                      >
                                         <option value="All Types">All Types</option>
                                         <option value="Outgoing">Outgoing</option>
                                         <option value="Incoming">Incoming</option>
                                         <option value="Missed">Missed / Reject</option>
                                      </select>
                                   </div>
                                )}
                             </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="pl-5 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2 w-38"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-calendar absolute top-1/2 transform -translate-y-1/2 text-sm" style={{ color: "#4b33e8" }}></i>
                          <span className="ml-6">{formatDisplayDate(selectedDate)}</span>
                        </button>
                        {showDatePicker && (
                          <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-80">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={handlePrevMonth}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-left text-base" style={{ color: "#263238" }}></i>
                              </button>
                              <span className="text-sm font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                {formatMonthYear(currentMonth)}
                              </span>
                              <button
                                onClick={handleNextMonth}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <i className="fi flex fi-rr-angle-right text-base" style={{ color: "#263238" }}></i>
                              </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium py-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                  {day}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {calendarDays.map((day, index) => {
                                const isSelected = isSameDay(day.date, selectedDate);
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleDateSelect(day.date)}
                                    className={`text-sm py-2.5 rounded-lg transition-all ${
                                      isSelected
                                        ? 'text-white font-semibold'
                                        : day.isCurrentMonth
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-gray-400'
                                    }`}
                                    style={{
                                      backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                      fontFamily: "'Roboto', sans-serif"
                                    }}
                                  >
                                    {day.date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#e4ebf5] sticky top-0 z-10 text-[10px] md:text-xs">
                        <tr>
                          {source === 'mobile' ? (
                            <>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Emp. ID</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Emp. Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Number</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Device</th>
                            </>
                          ) : (
                            <>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">Emp. ID</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]">Emp Name</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]">Customer</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]">Callback</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[180px]">Disposition</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]">Campaign</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]">Last Call</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">Talk Time</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]">Dialed</th>
                                <th className="px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[200px]">Remark</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredActivities.length === 0 ? (
                           <tr>
                             <td colSpan={source === 'mobile' ? 8 : 10} className="px-6 py-20 text-center opacity-40">
                               <i className="fi flex fi-rr-search-heart text-5xl mb-3 text-gray-300 justify-center"></i>
                               <p className="text-sm font-bold uppercase tracking-widest text-gray-400">No activities found</p>
                             </td>
                           </tr>
                        ) : (
                          filteredActivities.map((activity, index) => {
                             if (source === 'mobile') {
                                 // Mobile History Row
                                 const callDate = new Date(activity.timestamp);
                                 const type = (activity.call_type || 'unknown').toLowerCase();
                                 let iconClass = "fi-rr-question";
                                 let iconColor = "text-gray-400";
                                 
                                 if (type.includes('outgoing')) { iconClass="fi-rr-arrow-up-right"; iconColor="text-blue-500"; }
                                 else if (type.includes('incoming')) { iconClass="fi-rr-arrow-down-left"; iconColor="text-green-500"; }
                                 else if (type.includes('missed')) { iconClass="fi-rr-cross-circle"; iconColor="text-red-500"; }
                                 else if (type.includes('reject')) { iconClass="fi-rr-ban"; iconColor="text-red-500"; }
                                 
                                 return (
                                    <tr
                                      key={activity.id || index}
                                      className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                      <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-600 font-bold">
                                         {activity.employee_id || "N/A"}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-800 font-semibold">
                                         {activity.user_name || "Unknown"}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                                         <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-[10px] text-gray-400">{callDate.getDate()}/{callDate.getMonth()+1}</span>
                                         </div>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <i className={`fi flex ${iconClass} ${iconColor} text-sm`}></i>
                                            <span className="text-xs uppercase font-semibold text-gray-600">{type}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-800 font-medium">
                                        {activity.name || "Unknown"}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-xs text-blue-600 font-mono">
                                        {(() => {
                                          const phone = activity.number;
                                          if (!phone) return "—";
                                          const cleaned = phone.toString().replace(/\D/g, "");
                                          if (cleaned.length < 6) return phone;
                                          return `+91 ******${cleaned.slice(-4)}`;
                                        })()}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                                        {formatSeconds(activity.duration || 0)}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                        <div className="flex items-center gap-1" title={activity.device_id}>
                                            <i className="fi flex fi-rr-smartphone text-xs"></i>
                                            <span className="max-w-[100px] truncate">{activity.device_id || "Unknown"}</span>
                                        </div>
                                      </td>
                                    </tr>
                                 );
                             } else {
                                // Default CRM Row
                                return (
                                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-900">
                                    {activity.agent?.employee_id || "N/A"}
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs font-semibold text-gray-800">
                                    {activity.agent?.user_name || "Unknown Agent"}
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs text-gray-700 font-medium">
                                    {activity.customer?.customer_name || activity.rejected_customer?.customer_name || "Unknown Customer"}
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs text-gray-600">
                                    {activity.next_called_at ? formatDisplayDate(activity.next_called_at) : "No Followup"}
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs font-bold text-slate-700">
                                    <div className="flex flex-col">
                                       <span className="text-indigo-600 font-black tracking-tight">{activity.disposition || "N/A"}</span>
                                       {activity.sub_disposition && (
                                         <span className="text-[10px] text-gray-400 font-medium lowercase italic leading-none">{activity.sub_disposition}</span>
                                       )}
                                    </div>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs text-indigo-600 font-bold uppercase tracking-tighter">
                                    {activity.campaign?.name || "General"}
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs text-gray-600">
                                    <div className="flex flex-col">
                                      <span className="text-gray-900 font-medium">{formatTime(activity.created_at)}</span>
                                      <span className="text-[10px] text-gray-400">{formatDisplayDate(activity.created_at)}</span>
                                    </div>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs font-mono font-bold text-gray-600">
                                    {activity.duration ? formatSeconds(activity.duration) : "00:00:00"}
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activity.is_connected === 'contactable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                      {activity.is_connected || "N/A"}
                                    </span>
                                  </td>
                                  <td className="px-2 md:px-6 py-3 md:py-4 text-xs text-gray-500 italic max-w-xs truncate" title={activity.notes}>
                                    {activity.notes || "No remark provided"}
                                  </td>
                                </tr>
                                );
                             }
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>
  );
}
