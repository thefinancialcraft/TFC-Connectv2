import { useRouter } from "next/router";
import AppLayout, { useUser } from "../components/AppLayout";
import { useFollowUpLeads } from "../hooks/useFollowUpLeads";

export default function FollowUp() {
  const router = useRouter();
  const { user } = useUser();
  const {
    loading,
    error,
    filteredLeads,
    searchQuery,
    setSearchQuery,
    stats,
    fetchLeads,
    formatDate
  } = useFollowUpLeads(user?.uid);



  return (
    <AppLayout>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                Follow Up Scheduler
              </h1>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Roboto', sans-serif" }}>
                Manage upcoming calls and overdue tasks spanning all your campaigns.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
                {/* Total Card */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-indigo-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-indigo-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-indigo-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-calendar-clock text-5xl sm:text-6xl"
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
                        Total Follow Ups
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-calendar-clock text-lg sm:text-xl"
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
                        {stats.total}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Active Callbacks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overdue Card */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(239, 68, 68, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-red-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-red-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-red-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-time-past text-5xl sm:text-6xl"
                      style={{ color: "#ef4444" }}
                    ></i>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ef4444 1px, transparent 1px)",
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
                        Overdue
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-time-past text-lg sm:text-xl"
                          style={{ color: "#ef4444" }}
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
                        {stats.overdue}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Action Required
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Card */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-blue-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-blue-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-blue-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-calendar-lines text-5xl sm:text-6xl"
                      style={{ color: "#3b82f6" }}
                    ></i>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
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
                        Upcoming
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-calendar-lines text-lg sm:text-xl"
                          style={{ color: "#3b82f6" }}
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
                        {stats.upcoming}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                         Scheduled for Later
                      </p>
                    </div>
                  </div>
                </div>
            </div>

            {/* Leads Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                
                {/* Mobile Header (similar to provided snippet) */}
                <div className="mb-4 sm:hidden">
                    <h2 className="text-lg font-bold mb-1" style={{ color: "rgb(38, 50, 56)", fontFamily: "'Poppins', sans-serif" }}>
                        Scheduled Leads
                    </h2>
                    <p className="text-xs" style={{ color: "rgb(120, 126, 157)", fontFamily: "'Roboto', sans-serif" }}>
                        Manage upcoming and overdue calls
                    </p>
                </div>

                {/* Mobile Search & Actions */}
                <div className="mb-4 sm:hidden space-y-3">
                     <div className="relative w-full">
                        <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input 
                            placeholder="Search leads..." 
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            type="text" 
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>
                     {/* Mobile Filters could go here */}
                </div>

                {/* Desktop Header & Controls */}
                <div className="hidden sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold mb-1" style={{ color: "rgb(38, 50, 56)", fontFamily: "'Poppins', sans-serif" }}>
                            Scheduled Leads
                        </h2>
                        <p className="text-sm" style={{ color: "rgb(120, 126, 157)", fontFamily: "'Roboto', sans-serif" }}>
                            Manage upcoming and overdue calls
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input 
                                placeholder="Search leads..." 
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                type="text" 
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Additional Filter Buttons (Visual only for now matching style) */}
                         <button className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center" title="Filter">
                            <i className="fi flex fi-rr-filter text-sm text-gray-600"></i>
                        </button>
                        <button 
                            onClick={() => fetchLeads()}
                            disabled={loading}
                            className={`h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            title="Refresh Data"
                        >
                            <i className={`fi flex fi-rr-refresh text-sm text-gray-600 ${loading ? 'animate-spin' : ''}`}></i>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                        <i className="fi fi-rr-info"></i>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
                        <p className="text-xs text-gray-400 font-bold">Syncing schedule...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <i className="fi fi-rr-calendar-check text-2xl text-gray-300"></i>
                        </div>
                        <h3 className="text-gray-500 font-bold text-sm mb-1">All Caught Up!</h3>
                        <p className="text-xs text-gray-400">You have no pending follow-up calls matching your criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-4 py-4 w-10">
                                        <div className="flex items-center justify-center">
                                            <input className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer" type="checkbox" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Customer Name</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Contact Info</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Organization</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Campaign</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Scheduled Time</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Assigned To</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLeads.map((lead: any) => (
                                    <tr key={lead.id} className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0" onClick={() => router.push(`/campaign/${lead.campaign_id}/${lead.id}`)}>
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center">
                                                <input className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer" type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase">
                                                    {lead.customer_name?.charAt(0) || 'C'}
                                                </div>
                                                <span className="text-xs font-medium text-gray-800" style={{ fontFamily: "'Poppins', sans-serif", color: "rgb(38, 50, 56)" }}>
                                                    {lead.customer_name || 'Anonymous'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-700 leading-none mb-1">{lead.phone_no}</span>
                                                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Verified Lead</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex justify-center">
                                                {lead.isOverdue ? (
                                                    <div className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100">
                                                        Overdue
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100">
                                                        Upcoming
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <i className="fi flex fi-rr-building text-[#4b33e8] text-xs"></i>
                                                <span className="text-[12px] font-medium text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                                    {lead.organization_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
                                                {lead.campaign_name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-medium leading-none mb-1 ${lead.isOverdue ? 'text-red-500' : 'text-gray-700'}`}>
                                                    {formatDate(lead.next_called_at)}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Scheduled</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-medium text-gray-600">
                                                {lead.assigned_name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => router.push(`/campaign/${lead.campaign_id}/${lead.id}`)}
                                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4b33e8] text-white rounded-lg text-[10px] font-bold shadow-md hover:bg-[#3f2bc2] transition-colors"
                                                >
                                                    <i className="fi fi-rr-phone-call text-xs"></i>
                                                    <span>Call</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
          </div>
    </AppLayout>
  );
}
