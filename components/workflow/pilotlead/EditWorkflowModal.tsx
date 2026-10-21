import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import CustomSelect from "./CustomSelect";

interface Agent {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

interface Campaign {
  id: string;
  name: string;
  status?: string;
  users?: any[];
}

interface EditWorkflowModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workflow: any;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function EditWorkflowModal({
  show,
  onClose,
  onSuccess,
  workflow,
}: EditWorkflowModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form states initialized from workflow
  const [workflowName, setWorkflowName] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Scheduling states
  const [batchesPerDay, setBatchesPerDay] = useState<number>(3);
  const [batchTimes, setBatchTimes] = useState<string[]>(["10:00", "13:00", "17:00"]);
  const [batchSize, setBatchSize] = useState<number>(250);
  const [pauseDays, setPauseDays] = useState<string[]>(["Sunday"]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Assignment states
  const [assignmentType, setAssignmentType] = useState<"unassigned" | "assigned">("unassigned");
  const [distributionMode, setDistributionMode] = useState<"uniform" | "custom_quota">("uniform");
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);

  // Sorting state
  const [sortBy, setSortBy] = useState<
    "file_order" | "name_asc" | "name_desc" | "expiry_date_asc" | "expiry_date_desc"
  >("file_order");

  // Active sub-tab in edit modal for clean organization
  const [activeEditTab, setActiveEditTab] = useState<"general" | "schedule" | "assignment">("general");

  // Populate from workflow on mount/show
  useEffect(() => {
    if (show && workflow) {
      setWorkflowName(workflow.name || "");
      setSelectedCampaignId(workflow.campaign_id || "");
      setBatchesPerDay(workflow.batches_per_day || 3);
      setBatchTimes(workflow.batch_times || ["10:00", "13:00", "17:00"]);
      setBatchSize(workflow.batch_size || 250);
      setPauseDays(workflow.pause_days || []);
      setStartDate(workflow.start_date || "");
      setEndDate(workflow.end_date || "");
      setAssignmentType(workflow.assignment_type || "unassigned");
      setSortBy(workflow.sort_by || "file_order");

      const agentConfig = workflow.assigned_agents_config || {};
      setDistributionMode(agentConfig.mode || "uniform");
      setSelectedAgentIds(agentConfig.agent_ids || []);

      setErrorMessage("");
      setSuccessMessage("");
      setActiveEditTab("general");

      if (workflow.organization_id) {
        fetchCampaigns(workflow.organization_id);
      }
    }
  }, [show, workflow]);

  // Adjust batch times if batchesPerDay changes
  useEffect(() => {
    const defaultTimes = ["09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"];
    setBatchTimes((prev) => {
      const updated = [...prev];
      if (updated.length < batchesPerDay) {
        for (let i = updated.length; i < batchesPerDay; i++) {
          updated.push(defaultTimes[i % defaultTimes.length] || "10:00");
        }
      } else if (updated.length > batchesPerDay) {
        return updated.slice(0, batchesPerDay);
      }
      return updated;
    });
  }, [batchesPerDay]);

  // Update agents when campaign changes
  useEffect(() => {
    if (!selectedCampaignId) {
      setAvailableAgents([]);
      return;
    }
    const camp = campaigns.find((c) => c.id === selectedCampaignId);
    if (camp && camp.users && Array.isArray(camp.users)) {
      const agents: Agent[] = camp.users
        .map((u: any) => ({
          id: u.user_id || u.id,
          name: u.name || u.user_name || u.email || "Agent",
          email: u.email,
          role: u.role,
        }))
        .filter((a: Agent) => Boolean(a.id));
      setAvailableAgents(agents);
    } else if (workflow?.organization_id) {
      fetchOrgAgents(workflow.organization_id);
    }
  }, [selectedCampaignId, campaigns, workflow]);

  const fetchCampaigns = async (orgId: string) => {
    setLoadingCampaigns(true);
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name, status, users")
        .eq("organization_id", orgId)
        .eq("status", "active");
      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchOrgAgents = async (orgId: string) => {
    try {
      const { data } = await supabase
        .from("user_profiles")
        .select("user_id, user_name, role")
        .eq("organization_id", orgId);
      if (data) {
        const agents: Agent[] = data.map((u) => ({
          id: u.user_id,
          name: u.user_name || "Agent",
          role: u.role,
        }));
        setAvailableAgents(agents);
      }
    } catch (err) {
      console.error("Failed to fetch org agents:", err);
    }
  };

  const togglePauseDay = (day: string) => {
    setPauseDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleAgent = (id: string) => {
    setSelectedAgentIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Submit updated workflow configuration
  const handleSaveChanges = async () => {
    if (!workflowName.trim()) {
      setErrorMessage("Please enter a workflow name.");
      return;
    }
    if (!selectedCampaignId) {
      setErrorMessage("Please select a target campaign.");
      return;
    }
    if (batchTimes.length !== batchesPerDay) {
      setErrorMessage(`Please configure all ${batchesPerDay} execution times.`);
      return;
    }
    if (batchSize < 1) {
      setErrorMessage("Batch size must be at least 1 lead.");
      return;
    }
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      setErrorMessage("Please provide a valid active date window.");
      return;
    }
    if (assignmentType === "assigned" && selectedAgentIds.length === 0) {
      setErrorMessage("Please select at least one agent or switch to Unassigned mode.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("Saving updated workflow settings...");

    try {
      const sortedTimes = [...batchTimes].sort();

      // Recompute next_execution_at with updated timings
      const { data: recomputedNext, error: nextExecErr } = await supabase.rpc(
        "calculate_leadpilot_next_execution",
        {
          p_batch_times: sortedTimes,
          p_pause_days: pauseDays,
          p_start_date: startDate,
          p_end_date: endDate,
          p_from_time: new Date().toISOString(),
        }
      );

      const nextExecutionAt = nextExecErr ? workflow.next_execution_at : recomputedNext;

      const agentConfigObj = {
        mode: distributionMode,
        agent_ids: selectedAgentIds,
        quotas: {},
      };

      // 1. Update public.leadpilot
      const { error: wfError } = await supabase
        .from("leadpilot")
        .update({
          name: workflowName.trim(),
          campaign_id: selectedCampaignId,
          batches_per_day: batchesPerDay,
          batch_times: sortedTimes,
          batch_size: batchSize,
          pause_days: pauseDays,
          start_date: startDate,
          end_date: endDate,
          assignment_type: assignmentType,
          assigned_agents_config: agentConfigObj,
          sort_by: sortBy,
          next_execution_at: nextExecutionAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", workflow.id);

      if (wfError) throw wfError;

      // 2. Update public.system_logs source_name if name changed
      await supabase
        .from("system_logs")
        .update({
          source_name: workflowName.trim(),
          campaign_id: selectedCampaignId,
        })
        .eq("source_id", workflow.source_id);

      setSuccessMessage("Workflow settings updated successfully!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 900);
    } catch (err: any) {
      console.error("Update workflow error:", err);
      setErrorMessage(err.message || "Failed to update workflow settings.");
      setSubmitting(false);
    }
  };

  if (!show || !workflow) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center text-sm">
              <i className="fi flex fi-rr-edit"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">Edit Workflow Settings</h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Source: <span className="font-semibold text-[#4b33e8]">{workflow.source_id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="fi flex fi-rr-cross text-[11px]"></i>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-gray-100 bg-gray-50/50 px-5 text-xs font-bold shrink-0">
          {[
            { id: "general", label: "General & Campaign", icon: "fi-rr-info" },
            { id: "schedule", label: "Batches & Schedule", icon: "fi-rr-clock" },
            { id: "assignment", label: "Agent Distribution", icon: "fi-rr-users" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEditTab(tab.id as any)}
              className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeEditTab === tab.id
                  ? "border-[#4b33e8] text-[#4b33e8]"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              <i className={`fi flex ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2">
              <i className="fi flex fi-rr-exclamation text-xs"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium flex items-center gap-2">
              <i className="fi flex fi-rr-check text-xs"></i>
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: General & Campaign */}
          {activeEditTab === "general" && (
            <div className="space-y-4">
              {workflow?.organizations?.company_name && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Organization
                  </label>
                  <div className="w-full px-3.5 py-2 rounded-lg border border-purple-200 text-xs text-purple-700 font-semibold bg-purple-50/70 flex items-center gap-1.5">
                    <i className="fi flex fi-rr-building text-xs text-purple-600"></i>
                    <span>{workflow.organizations.company_name}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Workflow Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Workflow Name"
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-black font-semibold outline-none focus:border-[#4b33e8] bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Target Active Campaign <span className="text-rose-500">*</span>
                </label>
                {loadingCampaigns ? (
                  <div className="text-xs text-gray-400 py-2">Loading active campaigns...</div>
                ) : (
                  <CustomSelect
                    value={selectedCampaignId}
                    onChange={(val) => setSelectedCampaignId(val)}
                    options={campaigns.map((camp) => ({
                      value: camp.id,
                      label: camp.name,
                      badge: camp.status ? camp.status.toUpperCase() : undefined,
                      icon: "fi-rr-bullhorn",
                    }))}
                    placeholder="Select Target Campaign..."
                    searchable={campaigns.length > 4}
                    size="sm"
                  />
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  Scheduled batches promote staged leads into this campaign.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Leads Ingestion Priority Order
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "file_order", label: "File Order (FIFO)", desc: "Original sequence in file" },
                    { id: "name_asc", label: "Customer Name (A ➔ Z)", desc: "Alphabetical sequence" },
                    { id: "expiry_date_asc", label: "Expiry Date (Earliest)", desc: "Urgent policies first" },
                  ].map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSortBy(s.id as any)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        sortBy === s.id
                          ? "border-[#4b33e8] bg-[#4b33e8]/[0.03]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-[#263238]">{s.label}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Batches & Schedule */}
          {activeEditTab === "schedule" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Batches Per Day (1–20)
                  </label>
                  <CustomSelect
                    value={batchesPerDay.toString()}
                    onChange={(val) => setBatchesPerDay(parseInt(val) || 1)}
                    options={Array.from({ length: 20 }, (_, i) => ({
                      value: (i + 1).toString(),
                      label: `${i + 1} Batch${i > 0 ? "es" : ""} per Day`,
                      badge: i === 2 ? "Recommended" : undefined,
                      icon: "fi-rr-layers",
                    }))}
                    placeholder="Select Batches..."
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Batch Size (Leads per Release)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={batchSize}
                    onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-[#4b33e8] outline-none text-black font-semibold bg-white"
                  />
                </div>
              </div>

              {/* Dynamic Batch Time Pickers */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Execution Times (IST): {batchesPerDay} Slot{batchesPerDay > 1 ? "s" : ""}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {batchTimes.map((time, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Batch #{idx + 1}
                      </span>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBatchTimes((prev) => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        className="w-full bg-white px-2 py-1 rounded border border-gray-200 text-xs font-bold text-black focus:border-[#4b33e8] outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pause Days */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Pause Days (Skip Execution)
                </label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => {
                    const isPaused = pauseDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => togglePauseDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isPaused
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isPaused ? `✕ ${day}` : day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Date Window */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Workflow Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-[#4b33e8] outline-none bg-white text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Workflow End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-[#4b33e8] outline-none bg-white text-black font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Agent Distribution */}
          {activeEditTab === "assignment" && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Assignment Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setAssignmentType("unassigned")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      assignmentType === "unassigned"
                        ? "border-[#4b33e8] bg-[#4b33e8]/[0.03]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                        <i className="fi flex fi-rr-box-alt"></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#263238]">Unassigned Pool</h4>
                        <p className="text-[11px] text-gray-400">Pushed to campaign open pool</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setAssignmentType("assigned")}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      assignmentType === "assigned"
                        ? "border-[#4b33e8] bg-[#4b33e8]/[0.03]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 flex items-center justify-center text-[#4b33e8]">
                        <i className="fi flex fi-rr-users"></i>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#263238]">Assign to Agents</h4>
                        <p className="text-[11px] text-gray-400">Direct distribution per batch</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {assignmentType === "assigned" && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                      Select Target Agents ({selectedAgentIds.length} Selected)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAgentIds(
                          selectedAgentIds.length === availableAgents.length
                            ? []
                            : availableAgents.map((a) => a.id)
                        )
                      }
                      className="text-xs text-[#4b33e8] font-bold hover:underline"
                    >
                      {selectedAgentIds.length === availableAgents.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  {availableAgents.length === 0 ? (
                    <div className="p-4 rounded-xl bg-gray-50 text-xs text-gray-400 text-center">
                      No agents found for this campaign.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1">
                      {availableAgents.map((agent) => {
                        const isSelected = selectedAgentIds.includes(agent.id);
                        return (
                          <div
                            key={agent.id}
                            onClick={() => toggleAgent(agent.id)}
                            className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? "bg-[#4b33e8]/5 border-[#4b33e8]/30"
                                : "bg-gray-50/70 border-gray-100 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-[#4b33e8]">
                                {agent.name.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="text-xs font-bold text-gray-800 line-clamp-1">
                                {agent.name}
                              </span>
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                                isSelected
                                  ? "bg-[#4b33e8] text-white border-[#4b33e8]"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && "✓"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={handleSaveChanges}
            className="px-5 py-2 rounded-lg bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-none"
          >
            {submitting && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
