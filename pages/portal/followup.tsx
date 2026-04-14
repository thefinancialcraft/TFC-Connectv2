import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useUser } from "@/components/AppLayout";
import { useSession } from "@/context/SessionContext";
import { useFollowUpLeads, FollowUpLead } from "@/hooks/useFollowUpLeads";
import { formatMaskedPhone } from "@/lib/phoneUtils";

interface Pipeline {
  id: string;
  name: string;
  filters: {
    dispositions: string[];
    sub_dispositions: string[];
    outcomes?: string[];
  };
}

export default function FollowUp() {
  const router = useRouter();
  const { user } = useUser();
  const { allSessions, startManualLock } = useSession();
  const {
    loading,
    error,
    leads,
    filteredLeads,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    stats,
    fetchLeads,
    formatDate
  } = useFollowUpLeads();

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'calendar'>('table');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [editingPipelineId, setEditingPipelineId] = useState<string | null>(null);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [newPipeline, setNewPipeline] = useState({ name: '', dispositions: [] as string[], sub_dispositions: [] as string[], outcomes: [] as string[] });
  const [userOutcomes, setUserOutcomes] = useState<any[]>([]);

  // Fetch user outcomes when config opens
  useEffect(() => {
    if (showConfig && user?.uid) {
        supabase.from('user_outcomes').select('*').eq('user_id', user.uid)
        .then(({ data }) => setUserOutcomes(data || []));
    }
  }, [showConfig, user?.uid]);

  const toggleSelection = (list: string[], item: string) => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  const dispositionHierarchy: Record<string, string[]> = {
    "Not Intrested": [],
    "Language barrier": [],
    "DND": [],
    "Wrong NO": [],
    "Ported / Expired": [],
    "Not Contactable": ["busy","Switch off", "Ring", "not reacable", "others"],
    "Call Back": ["Interested", "Follow up", "Not Connected"],
    "Deal Done": [],
  };

  const addPipeline = () => {
    if (!newPipeline.name) return;
    
    if (editingPipelineId) {
      // Update existing
      setPipelines(pipelines.map(p => p.id === editingPipelineId ? {
        ...p,
        name: newPipeline.name,
        filters: {
          dispositions: newPipeline.dispositions,
          sub_dispositions: newPipeline.sub_dispositions,
          outcomes: newPipeline.outcomes
        }
      } : p));
      setEditingPipelineId(null);
    } else {
      // Add new
      const id = Date.now().toString();
      setPipelines([...pipelines, { 
        id, 
        name: newPipeline.name, 
        filters: { 
          dispositions: newPipeline.dispositions, 
          sub_dispositions: newPipeline.sub_dispositions,
          outcomes: newPipeline.outcomes
        } 
      }]);
    }
    
    setNewPipeline({ name: '', dispositions: [], sub_dispositions: [], outcomes: [] });
    setShowConfig(false);
  };

  const removePipeline = (id: string) => {
    setPipelines(pipelines.filter((p: Pipeline) => p.id !== id));
    setShowMenuId(null);
  };

  const startEdit = (p: Pipeline) => {
    setNewPipeline({
      name: p.name,
      dispositions: p.filters.dispositions,
      sub_dispositions: p.filters.sub_dispositions,
      outcomes: p.filters.outcomes || []
    });
    setEditingPipelineId(p.id);
    setShowConfig(true);
    setShowMenuId(null);
  };

  // --- PERSISTENCE LOGIC ---
  // 1. Fetch settings on mount
  useEffect(() => {
    if (!user?.uid) return;

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('user_kanban_settings')
        .select('*')
        .eq('user_id', user.uid)
        .single();

      if (data) {
        if (data.view_mode) setViewMode(data.view_mode as 'table' | 'kanban' | 'calendar');
        if (data.pipelines) setPipelines(data.pipelines);
      } else if (error && error.code === 'PGRST116') {
        // No settings found, create initial
        await supabase.from('user_kanban_settings').insert({
          user_id: user.uid,
          view_mode: 'table',
          pipelines: [
            { id: '1', name: 'Interested', filters: { dispositions: ['Call Back'], sub_dispositions: ['intrested'], outcomes: [] } },
            { id: '2', name: 'Follow Up', filters: { dispositions: ['Call Back'], sub_dispositions: ['follow up'], outcomes: [] } },
          ]
        });
      }
    };

    fetchSettings();
  }, [user?.uid]);

  // 2. Save settings when viewMode or pipelines change
  useEffect(() => {
    if (!user?.uid) return;

    const saveSettings = async () => {
      await supabase
        .from('user_kanban_settings')
        .upsert({
          user_id: user.uid,
          view_mode: viewMode,
          pipelines: pipelines,
          updated_at: new Date().toISOString()
        });
    };

    // Use a small delay/debounce or just sync (since this is low frequency)
    const timeout = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timeout);
  }, [viewMode, pipelines, user?.uid]);
  
  // --- MANUAL NAVIGATION HANDLER ---
  const handleManualLeadOpen = (campaignId: string, customerId: string) => {
    console.log("[Follow-up] Manual Lead Open triggered for:", customerId);
    
    // Create a mock session to lock the target lead for manual inspection
    if (user?.uid) {
        startManualLock({
            id: 'manual-' + Date.now(),
            user_id: user.uid,
            campaign_id: campaignId,
            customer_id: customerId,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
    }
    
    // Explicitly using the masked path to trigger rewrites correctly
    router.push(`/portal/campaign/${campaignId}/${customerId}`);
  };

  // Derive filter options from leads
  const filterOptions = useMemo(() => {
    const orgs = new Map();
    const campaigns = new Map();
    const agents = new Map();

    leads.forEach((lead: FollowUpLead) => {
      if (lead.organization_id) orgs.set(lead.organization_id, lead.organization_name);
      if (lead.campaign_id) campaigns.set(lead.campaign_id, lead.campaign_name);
      if (lead.assigned_to) agents.set(lead.assigned_to, { name: lead.assigned_name, empId: lead.employee_id });
    });

    return {
      organizations: Array.from(orgs.entries()).map(([id, name]) => ({ id, name })),
      campaigns: Array.from(campaigns.entries()).map(([id, name]) => ({ id, name })),
      agents: Array.from(agents.entries()).map(([id, info]) => ({ id, name: info.name, empId: info.empId }))
    };
  }, [leads]);



  return (
    <>
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
                     <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
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
                        <button 
                             onClick={() => setShowFilterModal(true)}
                             className={`h-9 w-9 border border-gray-300 rounded-lg transition-colors flex items-center justify-center flex-shrink-0 ${Object.values(filters).some(v => v !== "") ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white text-gray-600'}`} 
                        >
                            <i className="fi flex fi-rr-filter text-sm"></i>
                        </button>
                        <button 
                             onClick={() => setShowConfig(!showConfig)}
                             className={`h-9 w-9 border border-gray-300 rounded-lg transition-colors flex items-center justify-center flex-shrink-0 ${showConfig ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white text-gray-600'}`} 
                        >
                            <i className="fi flex fi-rr-settings-sliders text-sm"></i>
                        </button>
                        <button 
                            onClick={() => fetchLeads()}
                            disabled={loading}
                            className="h-9 w-9 border border-gray-300 rounded-lg bg-white flex items-center justify-center flex-shrink-0"
                        >
                            <i className={`fi flex fi-rr-refresh text-sm text-gray-600 ${loading ? 'animate-spin' : ''}`}></i>
                        </button>
                     </div>

                     <div className="flex bg-gray-100 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`flex-1 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all flex flex-row items-center justify-center gap-1.5 whitespace-nowrap ${viewMode === 'table' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500'}`}
                        >
                            <i className="fi flex fi-rr-apps-sort"></i>
                            Table
                        </button>
                        <button 
                            onClick={() => setViewMode('kanban')}
                            className={`flex-1 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all flex flex-row items-center justify-center gap-1.5 whitespace-nowrap ${viewMode === 'kanban' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500'}`}
                        >
                            <i className="fi fi-rr-layout-fluid flex"></i>
                            Kanban
                        </button>
                        <button 
                            onClick={() => setViewMode('calendar')}
                            className={`flex-1 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all flex flex-row items-center justify-center gap-1.5 whitespace-nowrap ${viewMode === 'calendar' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500'}`}
                        >
                            <i className="fi flex fi-rr-calendar"></i>
                            Calendar
                        </button>
                     </div>
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
                        <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
                            <button 
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex flex-row items-center gap-2 ${viewMode === 'table' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <i className="fi flex fi-rr-apps-sort mr-2"></i>
                                Table
                            </button>
                            <button 
                                onClick={() => setViewMode('kanban')}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex flex-row items-center gap-2 ${viewMode === 'kanban' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <i className="fi fi-rr-layout-fluid flex mr-2"></i>
                                Kanban
                            </button>
                            <button 
                                onClick={() => setViewMode('calendar')}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex flex-row items-center gap-2 ${viewMode === 'calendar' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <i className="fi flex fi-rr-calendar mr-2"></i>
                                Calendar
                            </button>
                        </div>

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
                        <button 
                             onClick={() => setShowFilterModal(true)}
                             className={`h-10 px-3 border border-gray-300 rounded-lg transition-colors flex items-center justify-center ${Object.values(filters).some(v => v !== "") ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white hover:bg-gray-50 text-gray-600'}`} 
                             title="Filter Leads"
                         >
                            <i className="fi flex fi-rr-filter text-sm mr-2"></i>
                            <span className="text-xs font-bold">Filter</span>
                        </button>
                        {/* Additional Filter Buttons (Visual only for now matching style) */}
                         <button 
                             onClick={() => setShowConfig(!showConfig)}
                             className={`h-10 px-3 border border-gray-300 rounded-lg transition-colors flex items-center justify-center ${showConfig ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white hover:bg-gray-50 text-gray-600'}`} 
                             title="Kanban Settings"
                         >
                            <i className="fi flex fi-rr-settings-sliders text-sm"></i>
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

                {/* Pipeline Config Popup */}
                {showConfig && (
                    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl relative">
                        <button onClick={() => setShowConfig(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                             <i className="fi fi-rr-cross-small"></i>
                        </button>
                        <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
                            <i className="fi fi-rr-settings text-indigo-600"></i>
                            Configure Kanban Pipelines
                        </h3>
                        
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="w-full">
                                <label className="block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-1">
                                    {editingPipelineId ? 'Update Pipeline Name' : 'Pipeline Name'}
                                </label>
                                <input 
                                    className="w-full px-3 text-gray-800 py-2 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500" 
                                    placeholder="e.g. Interested & Language"
                                    value={newPipeline.name}
                                    onChange={e => setNewPipeline({...newPipeline, name: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 bg-white border border-indigo-100 rounded-lg">
                                    <label className="block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-2">Dispositions (Multiple)</label>
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                        {Object.keys(dispositionHierarchy).map(d => (
                                            <button 
                                                key={d}
                                                onClick={() => setNewPipeline({...newPipeline, dispositions: toggleSelection(newPipeline.dispositions, d)})}
                                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all border ${newPipeline.dispositions.includes(d) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 bg-white border border-indigo-100 rounded-lg">
                                    <label className="block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-2">Sub-Dispositions (Multiple)</label>
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                        {/* Show all sub-dispositions from selected dispositions */}
                                        {Array.from(new Set(newPipeline.dispositions.flatMap(d => dispositionHierarchy[d] || []))).length > 0 ? (
                                            Array.from(new Set(newPipeline.dispositions.flatMap(d => dispositionHierarchy[d] || []))).map(s => (
                                                <button 
                                                    key={s}
                                                    onClick={() => setNewPipeline({...newPipeline, sub_dispositions: toggleSelection(newPipeline.sub_dispositions, s)})}
                                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all border ${newPipeline.sub_dispositions.includes(s) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-gray-400 italic">Select disposition first</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-white border border-indigo-100 rounded-lg">
                                <label className="block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-2">Outcomes (Multiple)</label>
                                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                                    {newPipeline.sub_dispositions.length > 0 ? (
                                        (userOutcomes && userOutcomes.length > 0) ? (
                                            userOutcomes
                                            .filter(out => newPipeline.sub_dispositions.includes(out.parent_category))
                                            .map((out: any) => (
                                                <button 
                                                    key={out.id}
                                                    onClick={() => setNewPipeline({...newPipeline, outcomes: toggleSelection(newPipeline.outcomes || [], out.outcome_label)})}
                                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all border ${newPipeline.outcomes?.includes(out.outcome_label) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`}
                                                >
                                                    {out.outcome_label} <span className="opacity-60 text-[9px] lowercase">({out.parent_category})</span>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-gray-400 italic">No custom outcomes found. Add them from the calling page.</p>
                                        )
                                    ) : (
                                        <p className="text-[10px] text-gray-400 italic">Select sub-disposition first to view outcomes</p>
                                    )}
                                    
                                    {newPipeline.sub_dispositions.length > 0 && userOutcomes.filter(out => newPipeline.sub_dispositions.includes(out.parent_category)).length === 0 && (
                                         <p className="text-[10px] text-gray-400 italic w-full">No outcomes found for selected sub-dispositions.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={addPipeline}
                                    className="h-10 px-6 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <i className={editingPipelineId ? "fi fi-rr-check" : "fi fi-rr-plus"}></i>
                                    {editingPipelineId ? 'Update Pipeline' : 'Create Pipeline'}
                                </button>
                                {editingPipelineId && (
                                    <button 
                                        onClick={() => {
                                            setEditingPipelineId(null);
                                            setNewPipeline({ name: '', dispositions: [], sub_dispositions: [], outcomes: [] });
                                            setShowConfig(false);
                                        }}
                                        className="h-10 px-4 text-gray-500 text-[11px] font-bold hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {pipelines.map(p => (
                                <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-xs font-medium text-indigo-700 shadow-sm">
                                    <span>{p.name}</span>
                                    <span className="text-[10px] opacity-40 px-1 bg-indigo-50 rounded">
                                        {p.filters.dispositions.length > 0 ? p.filters.dispositions.join(', ') : 'Any'}
                                        {p.filters.sub_dispositions.length > 0 ? ` > ${p.filters.sub_dispositions.join(', ')}` : ''}
                                        {p.filters.outcomes && p.filters.outcomes.length > 0 ? ` [${p.filters.outcomes.join(', ')}]` : ''}
                                    </span>
                                    <button onClick={() => removePipeline(p.id)} className="hover:text-red-500 transition-colors">
                                        <i className="fi fi-rr-cross-circle"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Structured Filter Modal */}
                {showFilterModal && (
                    <div className="fixed inset-0 z-[120] backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 text-xs font-sans">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
                            {/* Header */}
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-800">Filter Follow-ups</h3>
                                </div>
                                <button onClick={() => setShowFilterModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                                    <i className="fi fi-rr-cross-small text-xl leading-none"></i>
                                </button>
                            </div>
                            
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Organization Filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Organization</label>
                                        <select 
                                            value={filters.organizationId}
                                            onChange={(e) => setFilters({...filters, organizationId: e.target.value})}
                                            className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                        >
                                            <option value="">All Organizations</option>
                                            {filterOptions.organizations.map((org: any) => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Campaign Filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Campaign</label>
                                        <select 
                                            value={filters.campaignId}
                                            onChange={(e) => setFilters({...filters, campaignId: e.target.value})}
                                            className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                        >
                                            <option value="">All Campaigns</option>
                                            {filterOptions.campaigns.map((camp: any) => (
                                                <option key={camp.id} value={camp.id}>{camp.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Status Filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Sequence Status</label>
                                        <select 
                                            value={filters.status}
                                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                                            className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="overdue">Overdue</option>
                                            <option value="upcoming">Upcoming</option>
                                        </select>
                                    </div>

                                    {/* Assigned To Filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Assigned Personnel</label>
                                        <select 
                                            value={filters.assignedTo}
                                            onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
                                            className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                        >
                                            <option value="">Everyone</option>
                                            {filterOptions.agents.map((agent: any) => (
                                                <option key={agent.id} value={agent.id}>
                                                    {agent.name} {agent.empId ? `(${agent.empId})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Callback Date Filter */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Execution Date</label>
                                    <div className="relative">
                                        <input 
                                            type="date"
                                            value={filters.callbackDate}
                                            onChange={(e) => setFilters({...filters, callbackDate: e.target.value})}
                                            className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
                                <button 
                                    onClick={() => setFilters({ organizationId: "", assignedTo: "", status: "", campaignId: "", callbackDate: "" })}
                                    className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all"
                                >
                                    Clear Config
                                </button>
                                <button 
                                    onClick={() => setShowFilterModal(false)}
                                    className="px-6 py-1.5 bg-[#4b33e8] text-white rounded font-bold uppercase tracking-widest transition-all hover:bg-indigo-700"
                                >
                                    Apply Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                ) : viewMode === 'table' ? (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <table className="w-full text-left">
                            {/* ... (existing table headers) ... */}
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
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Disposition</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Organization</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Campaign</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Scheduled Time</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Assigned To</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLeads.map((lead: any) => (
                                    <tr key={lead.id} className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0" onClick={() => handleManualLeadOpen(lead.campaign_id, lead.id)}>
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
                                                <span className="text-xs font-medium text-gray-700 leading-none mb-1">{formatMaskedPhone(lead.phone_no)}</span>
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
                                            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-tight">
                                                {lead.disposition || 'Call Back'}
                                            </span>
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
                                                    onClick={() => handleManualLeadOpen(lead.campaign_id, lead.id)}
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
                ) : viewMode === 'kanban' ? (
                    <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide min-h-[500px] snap-x">
                        {pipelines.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-20 text-gray-400">
                                <i className="fi fi-rr-plus text-3xl mb-2"></i>
                                <p className="text-sm font-bold">No pipelines configured.</p>
                                <p className="text-xs">Click the gear icon to add pipelines.</p>
                            </div>
                        ) : (
                            pipelines.map((pipeline: Pipeline) => {
                                const leadsInPipeline = filteredLeads.filter((l: FollowUpLead) => {
                                    const matchDisp = pipeline.filters.dispositions.length === 0 || pipeline.filters.dispositions.includes(l.disposition);
                                    const matchSub = pipeline.filters.sub_dispositions.length === 0 || (l.sub_disposition && pipeline.filters.sub_dispositions.includes(l.sub_disposition));
                                    const matchOutcome = !pipeline.filters.outcomes || pipeline.filters.outcomes.length === 0 || (l.outcome && pipeline.filters.outcomes.includes(l.outcome));
                                    return matchDisp && matchSub && matchOutcome;
                                });

                                return (

                                    <div key={pipeline.id} className="flex-shrink-0 w-[280px] sm:w-80 bg-gray-50/50 rounded-2xl p-3 border border-gray-100 flex flex-col h-full max-h-[700px] snap-center">
                                        <div className="flex items-center justify-between mb-4 px-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{pipeline.name}</h3>
                                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white border border-gray-200 text-[10px] font-black text-indigo-600 shadow-sm">
                                                    {leadsInPipeline.length}
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setShowMenuId(showMenuId === pipeline.id ? null : pipeline.id)}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showMenuId === pipeline.id ? 'bg-indigo-100 text-indigo-600' : 'text-gray-300 hover:text-indigo-600'}`}
                                                >
                                                    <i className="fi fi-rr-menu-dots-vertical"></i>
                                                </button>

                                                {showMenuId === pipeline.id && (
                                                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[100] animate-in fade-in zoom-in duration-200">
                                                        <button 
                                                            onClick={() => startEdit(pipeline)}
                                                            className="w-full px-3 py-2 text-left text-[11px] font-bold text-slate-700 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <i className="fi fi-rr-edit text-indigo-500"></i>
                                                            Edit Pipeline
                                                        </button>
                                                        <div className="h-px bg-gray-50 my-1" />
                                                        <button 
                                                            onClick={() => removePipeline(pipeline.id)}
                                                            className="w-full px-3 py-2 text-left text-[11px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <i className="fi fi-rr-trash"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                                            {leadsInPipeline.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                                     <i className="fi fi-rr-box-open text-2xl mb-2"></i>
                                                     <p className="text-[10px] uppercase font-bold tracking-widest">No leads</p>
                                                </div>
                                            ) : (
                                                leadsInPipeline.map((lead: any) => (
                                                    <div 
                                                        key={lead.id} 
                                                        onClick={() => handleManualLeadOpen(lead.campaign_id, lead.id)}
                                                        className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group animate-fade-in relative overflow-hidden"
                                                    >
                                                        {/* Status Accent Line */}
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${lead.isOverdue ? 'bg-red-500' : 'bg-indigo-500 opacity-20'}`} />
                                                        
                                                        <div className="flex items-start justify-between mb-1 ml-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                                                                    {lead.customer_name?.charAt(0) || 'C'}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <h4 className="text-[14px] font-bold text-slate-800 leading-tight truncate max-w-[160px]">
                                                                        {lead.customer_name || 'Anonymous'}
                                                                    </h4>
                                                                    <div className="flex items-center gap-1 text-gray-400">
                                                                        <span className="text-[10px] font-medium tracking-tight mb-0.5">{formatMaskedPhone(lead.phone_no)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {lead.isOverdue && <i className="fi fi-rr-time-past text-red-500 text-[10px] animate-pulse"></i>}
                                                        </div>

                                                        <div className="flex flex-wrap gap-1 mb-1.5 ml-1">
                                                            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[8px] font-bold uppercase">
                                                                {lead.campaign_name}
                                                            </span>
                                                            {lead.sub_disposition && (
                                                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[8px] font-bold lowercase italic">
                                                                    {lead.sub_disposition}
                                                                </span>
                                                            )}
                                                            {lead.outcome && (
                                                                <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[8px] font-bold uppercase tracking-tight">
                                                                    {lead.outcome}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="pt-1.5 border-t border-gray-50 flex items-center justify-between ml-1">
                                                            <span className={`text-[9px] font-bold ${lead.isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                                                                {formatDate(lead.next_called_at)}
                                                            </span>
                                                            <button 
                                                                className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-indigo-100 shadow-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleManualLeadOpen(lead.campaign_id, lead.id);
                                                                }}
                                                            >
                                                                <i className="fi fi-rr-phone-call text-[8px]"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        {!selectedDate ? (
                            <>
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                        >
                                            <i className="fi fi-rr-angle-left text-sm mt-1"></i>
                                        </button>
                                        <button 
                                            onClick={() => setCurrentMonth(new Date())}
                                            className="px-4 py-1.5 text-xs font-bold bg-[#EEF2FF] text-[#4F46E5] rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            Today
                                        </button>
                                        <button 
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                        >
                                            <i className="fi fi-rr-angle-right text-sm mt-1"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Days Header */}
                                <div className="grid grid-cols-7 mb-2 text-center">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-xs font-bold text-gray-400 uppercase py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Month Grid */}
                                <div className="grid grid-cols-7 gap-2">
                                    {/* Empty cells for prev month days */}
                                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                                        <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50/30 rounded-lg"></div>
                                    ))}

                                    {/* Days of current month */}
                                    {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
                                        
                                        const dayLeads = filteredLeads.filter((l: any) => {
                                            if (!l.next_called_at) return false;
                                            const leadDate = new Date(l.next_called_at);
                                            return leadDate.getDate() === day && leadDate.getMonth() === currentMonth.getMonth() && leadDate.getFullYear() === currentMonth.getFullYear();
                                        });

                                        return (
                                            <div 
                                                key={day} 
                                                onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                                                className={`min-h-[120px] p-2 rounded-lg border cursor-pointer hover:shadow-md ${isToday ? 'border-indigo-500 bg-indigo-50/10' : 'border-gray-100 bg-white hover:border-indigo-200'} transition-all relative group`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-sm font-bold ${isToday ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                                                        {day}
                                                    </span>
                                                    {dayLeads.length > 0 && (
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 rounded-full">
                                                            {dayLeads.length}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-1">
                                                    {dayLeads.slice(0, 3).map((lead: any) => (
                                                        <div 
                                                            key={lead.id}
                                                            className={`px-2 py-1 rounded text-[9px] font-bold truncate ${lead.isOverdue ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}
                                                            title={`${lead.customer_name} - ${lead.campaign_name}`}
                                                        >
                                                            {lead.customer_name || 'Anonymous'}
                                                        </div>
                                                    ))}
                                                    {dayLeads.length > 3 && (
                                                        <div className="text-[9px] text-gray-400 font-medium pl-1">
                                                            +{dayLeads.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Hover Overlay hint */}
                                                <div className="absolute inset-x-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center pointer-events-none">
                                                    <span className="text-[9px] font-bold text-gray-400 bg-white/90 px-2 py-0.5 rounded-full shadow-sm border border-gray-100">View Day</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="animate-fade-in">
                                {/* Day View Header */}
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setSelectedDate(null)}
                                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                        >
                                            <i className="fi fi-rr-arrow-small-left text-xl"></i>
                                        </button>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800 leading-tight">
                                                {selectedDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </h2>
                                            <p className="text-xs text-gray-500 font-medium">Hourly Schedule</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg shadow-sm">
                                            Day View
                                        </button>
                                        <button 
                                            onClick={() => setSelectedDate(null)}
                                            className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                                        >
                                            Month View
                                        </button>
                                    </div>
                                </div>

                                {!selectedHour ? (
                                    /* Hourly Slots Grid */
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                                        {Array.from({ length: 16 }).map((_, i) => { // 8 AM to 11 PM (16 slots)
                                            const hour = i + 8;
                                            const timeLabel = new Date(0, 0, 0, hour).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                                            
                                            // Filter leads for this hour
                                            const slotLeads = filteredLeads.filter((l: any) => {
                                                if (!l.next_called_at) return false;
                                                const d = new Date(l.next_called_at);
                                                return d.getDate() === selectedDate.getDate() && 
                                                    d.getMonth() === selectedDate.getMonth() && 
                                                    d.getHours() === hour;
                                            });

                                            const isCurrentHour = new Date().getHours() === hour && new Date().toDateString() === selectedDate.toDateString();

                                            return (
                                                <div 
                                                    key={hour} 
                                                    onClick={() => setSelectedHour(hour)}
                                                    className={`flex flex-col h-full min-h-[140px] rounded-2xl border ${isCurrentHour ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-gray-200 bg-white hover:border-indigo-300'} transition-all p-3 relative group hover:shadow-md cursor-pointer`}
                                                >
                                                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                                        <span className={`text-sm font-bold ${isCurrentHour ? 'text-indigo-700' : 'text-gray-700'}`}>{timeLabel}</span>
                                                        {slotLeads.length > 0 && (
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCurrentHour ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {slotLeads.length} Calls
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className={`flex-1 space-y-2 custom-scrollbar max-h-[200px] ${slotLeads.length > 0 ? 'overflow-y-auto' : 'overflow-hidden flex items-center justify-center'}`}>
                                                        {slotLeads.length > 0 ? (
                                                            slotLeads.map((lead: any) => (
                                                                <div 
                                                                    key={lead.id}
                                                                    onClick={(e) => { e.stopPropagation(); handleManualLeadOpen(lead.campaign_id, lead.id); }}
                                                                    className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                                                                >
                                                                    <div className={`w-1 h-8 rounded-full flex-shrink-0 ${lead.isOverdue ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-xs font-medium text-gray-800 truncate" title={lead.customer_name}>{lead.customer_name || 'Anonymous'}</h4>
                                                                        <p className="text-[9px] text-gray-500 truncate">{lead.campaign_name}</p>
                                                                    </div>
                                                                    {lead.isOverdue && <i className="fi fi-rr-time-past text-red-500 text-[10px]"></i>}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="h-full flex flex-col items-center justify-center opacity-30 mt-2">
                                                                <i className="fi fi-rr-minus-circle text-2xl text-gray-300 mb-1"></i>
                                                                <span className="text-[10px] font-medium text-gray-400">Free Slot</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Timeline View for Selected Hour */
                                    <div className="animate-fade-in">
                                        <div className="flex items-center gap-3 mb-6">
                                             <button 
                                                onClick={() => setSelectedHour(null)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                                            >
                                                <i className="fi fi-rr-arrow-small-left text-xl"></i>
                                            </button>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {new Date(0, 0, 0, selectedHour).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(0, 0, 0, selectedHour + 1).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </h3>
                                                <p className="text-xs text-gray-500">Timeline view</p>
                                            </div>
                                        </div>

                                        <div className="relative pl-4 space-y-8 py-4">
                                            {/* Timeline Vertical Line */}
                                            <div className="absolute left-[85px] top-0 bottom-0 w-px bg-gray-200"></div>

                                            {(() => {
                                                 const hourLeads = filteredLeads.filter((l: any) => {
                                                    if (!l.next_called_at) return false;
                                                    const d = new Date(l.next_called_at);
                                                    return d.getDate() === selectedDate.getDate() && 
                                                        d.getMonth() === selectedDate.getMonth() && 
                                                        d.getHours() === selectedHour;
                                                });

                                                // Group by minute
                                                const groupedByMinute: { [key: string]: any[] } = {};
                                                hourLeads.forEach((l: any) => {
                                                    const d = new Date(l.next_called_at);
                                                    const timeKey = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }); // Use 24h for sorting ease or just minute str
                                                    // Let's use formatted 12h string for Key 
                                                    const displayTime = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                                                    if (!groupedByMinute[displayTime]) groupedByMinute[displayTime] = [];
                                                    groupedByMinute[displayTime].push(l);
                                                });

                                                // If no leads
                                                if (Object.keys(groupedByMinute).length === 0) {
                                                    return (
                                                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                                            <i className="fi fi-rr-time-forward text-4xl text-indigo-200 mb-3"></i>
                                                            <p className="text-gray-400 font-medium">No calls scheduled for this hour</p>
                                                        </div>
                                                    );
                                                }

                                                // Sort keys by time (simple since we are within same hour)
                                                const sortedTimes = Object.keys(groupedByMinute).sort();

                                                return sortedTimes.map((time) => (
                                                    <div key={time} className="flex group relative">
                                                        {/* Time Label */}
                                                        <div className="w-[70px] flex-shrink-0 text-right pr-6 pt-2">
                                                            <span className="text-sm font-bold text-gray-600 font-mono">{time}</span>
                                                        </div>

                                                        {/* Timeline Dot */}
                                                        <div className="absolute left-[80.5px] top-3 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 z-10"></div>

                                                        {/* Cards Horizontal List */}
                                                        <div className="flex-1 pl-6 pt-2 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                                    {groupedByMinute[time].length} Contact{groupedByMinute[time].length > 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                                                {groupedByMinute[time].map((lead: any) => (
                                                                    <div 
                                                                        key={lead.id}
                                                                        onClick={() => handleManualLeadOpen(lead.campaign_id, lead.id)}
                                                                        className="min-w-[250px] bg-white p-3 rounded-xl border border-gray-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-2"
                                                                    >
                                                                        <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                                                                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${lead.isOverdue ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                                                {lead.customer_name?.charAt(0)}
                                                                             </div>
                                                                             <div className="flex-1 min-w-0">
                                                                                 <h4 className="text-sm font-bold text-gray-800 truncate">{lead.customer_name || 'Anonymous'}</h4>
                                                                                 <span className="text-[10px] text-gray-500">{lead.campaign_name}</span>
                                                                             </div>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                                                                                <i className="fi fi-rr-smartphone"></i>
                                                                                {formatMaskedPhone(lead.phone_no)}
                                                                            </span>
                                                                            <button className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                                                <i className="fi fi-rr-arrow-right text-[10px]"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
    </>
  );
}
