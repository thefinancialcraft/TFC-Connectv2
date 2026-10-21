import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CustomSelect from './CustomSelect';

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

interface CreateWorkflowWizardModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: (newWorkflowId: string) => void;
  organizationId: string;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CreateWorkflowWizardModal({
  show,
  onClose,
  onSuccess,
  organizationId,
}: CreateWorkflowWizardModalProps) {
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 1: Basic Info & Campaign
  const [workflowName, setWorkflowName] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Step 2: Scheduling Configuration
  const [batchesPerDay, setBatchesPerDay] = useState<number>(3);
  const [batchTimes, setBatchTimes] = useState<string[]>(['10:00', '13:00', '17:00']);
  const [batchSize, setBatchSize] = useState<number>(250);
  const [pauseDays, setPauseDays] = useState<string[]>(['Sunday']);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  // Step 3: Agent Assignment & Distribution
  const [assignmentType, setAssignmentType] = useState<'unassigned' | 'assigned'>('unassigned');
  const [distributionMode, setDistributionMode] = useState<'uniform' | 'custom_quota'>('uniform');
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [customQuotas, setCustomQuotas] = useState<Record<string, number>>({});

  // Step 4: Ingestion Priority
  const [sortBy, setSortBy] = useState<'file_order' | 'name_asc' | 'name_desc' | 'expiry_date_asc' | 'expiry_date_desc'>('file_order');

  // Load campaigns on mount
  useEffect(() => {
    if (show && organizationId) {
      fetchActiveCampaigns();
      setStep(1);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [show, organizationId]);

  // Adjust batchTimes array when batchesPerDay changes
  useEffect(() => {
    const defaultTimes = ['09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00'];
    setBatchTimes((prev) => {
      const updated = [...prev];
      if (updated.length < batchesPerDay) {
        for (let i = updated.length; i < batchesPerDay; i++) {
          updated.push(defaultTimes[i % defaultTimes.length] || '10:00');
        }
      } else if (updated.length > batchesPerDay) {
        return updated.slice(0, batchesPerDay);
      }
      return updated;
    });
  }, [batchesPerDay]);

  // Update available agents when campaign changes
  useEffect(() => {
    if (!selectedCampaignId) {
      setAvailableAgents([]);
      setSelectedAgentIds([]);
      return;
    }
    const camp = campaigns.find((c) => c.id === selectedCampaignId);
    if (camp && camp.users && Array.isArray(camp.users)) {
      const agents: Agent[] = camp.users
        .map((u: any) => ({
          id: u.user_id || u.id,
          name: u.name || u.user_name || u.email || 'Agent',
          email: u.email,
          role: u.role,
        }))
        .filter((a: Agent) => Boolean(a.id));
      setAvailableAgents(agents);
      setSelectedAgentIds(agents.map((a) => a.id));
    } else {
      fetchOrgAgents();
    }
  }, [selectedCampaignId, campaigns]);

  const fetchActiveCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, status, users')
        .eq('organization_id', organizationId)
        .eq('status', 'active');
      if (error) throw error;
      setCampaigns(data || []);
      if (data && data.length > 0 && !selectedCampaignId) {
        setSelectedCampaignId(data[0].id);
      }
    } catch (err: any) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchOrgAgents = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('user_id, user_name, role')
        .eq('organization_id', organizationId);
      if (data) {
        const agents: Agent[] = data.map((u) => ({
          id: u.user_id,
          name: u.user_name || 'Agent',
          role: u.role,
        }));
        setAvailableAgents(agents);
        setSelectedAgentIds(agents.map((a) => a.id));
      }
    } catch (err) {
      console.error('Failed to fetch org agents:', err);
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

  // Validation before advancing step
  const handleNextStep = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!workflowName.trim()) {
        setErrorMessage('Please enter a workflow name.');
        return;
      }
      if (!selectedCampaignId) {
        setErrorMessage('Please select an active target campaign.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (batchTimes.length !== batchesPerDay) {
        setErrorMessage(`Please configure all ${batchesPerDay} execution times.`);
        return;
      }
      if (batchSize < 1) {
        setErrorMessage('Batch size must be at least 1 lead.');
        return;
      }
      if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
        setErrorMessage('Please provide a valid active date window.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (assignmentType === 'assigned' && selectedAgentIds.length === 0) {
        setErrorMessage('Please select at least one agent or switch to Unassigned mode.');
        return;
      }
      setStep(4);
    }
  };

  // Final submission: Create workflow configuration
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('Configuring workflow...');

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      // 1. Generate Master Source ID
      const timestampSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const masterSourceId = `SRC-LP-${timestampSuffix}`;

      // 2. Compute initial next_execution_at
      const sortedTimes = [...batchTimes].sort();
      const { data: nextExecData, error: nextExecErr } = await supabase.rpc(
        'calculate_leadpilot_next_execution',
        {
          p_batch_times: sortedTimes,
          p_pause_days: pauseDays,
          p_start_date: startDate,
          p_end_date: endDate,
          p_from_time: new Date().toISOString(),
        }
      );

      const nextExecutionAt = nextExecErr ? null : nextExecData;

      const agentConfigObj = {
        mode: distributionMode,
        agent_ids: selectedAgentIds,
        quotas: distributionMode === 'custom_quota' ? customQuotas : {},
      };

      // 3. Insert into public.leadpilot with 0 initial leads (ready for upload on details page)
      const { data: newWf, error: wfError } = await supabase
        .from('leadpilot')
        .insert({
          organization_id: organizationId,
          campaign_id: selectedCampaignId,
          name: workflowName.trim(),
          source_id: masterSourceId,
          status: 'scheduled',
          batches_per_day: batchesPerDay,
          batch_times: sortedTimes,
          batch_size: batchSize,
          pause_days: pauseDays,
          start_date: startDate,
          end_date: endDate,
          assignment_type: assignmentType,
          assigned_agents_config: agentConfigObj,
          agent_cursor_index: 0,
          sort_by: sortBy,
          column_mapping: null,
          total_files_uploaded: 0,
          total_leads: 0,
          uploaded_leads: 0,
          pending_leads: 0,
          completed_batches: 0,
          next_execution_at: nextExecutionAt,
          created_by: authUser?.id,
        })
        .select()
        .single();

      if (wfError) throw wfError;

      // 4. Insert Master Record into public.system_logs for telemetry
      await supabase.from('system_logs').insert({
        source_id: masterSourceId,
        source_name: workflowName.trim(),
        total_leads: 0,
        duplicate_leads: 0,
        campaign_id: selectedCampaignId,
        organization_id: organizationId,
        workflow_id: newWf.id,
        is_workflow_source: true,
        workflow_type: 'bulk_upload',
        created_by: authUser?.id,
      });

      setSuccessMessage('Workflow configured successfully! Redirecting to upload leads...');
      setTimeout(() => {
        onSuccess(newWf.id);
      }, 900);
    } catch (err: any) {
      console.error('Workflow creation error:', err);
      setErrorMessage(err.message || 'Failed to initialize workflow.');
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center text-sm">
              <i className="fi flex fi-rr-rocket-lunch"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">Configure LeadPilot Workflow</h2>
              <p className="text-[11px] text-gray-500 font-medium">Step {step} of 4: {
                step === 1 ? 'Basic Info & Target Campaign' :
                step === 2 ? 'Batch Scheduling & Timings' :
                step === 3 ? 'Agent Assignment & Distribution' :
                'Ingestion Priority & Confirmation'
              }</p>
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

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-100 h-1 flex">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= step ? 'bg-[#4b33e8]' : 'bg-gray-100'
              }`}
            ></div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 min-h-[280px] max-h-[72vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2">
              <i className="fi flex fi-rr-exclamation text-xs"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium flex items-center gap-2">
              <i className="fi flex fi-rr-check text-xs"></i>
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: Basic Info & Campaign */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Workflow Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. November High-Priority Inbound Leads"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#4b33e8] outline-none transition-all placeholder:text-gray-400 text-xs text-black font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Target Active Campaign <span className="text-rose-500">*</span>
                </label>
                {loadingCampaigns ? (
                  <div className="text-xs text-gray-400 py-2">Loading active campaigns...</div>
                ) : campaigns.length === 0 ? (
                  <div className="p-3 rounded-lg bg-amber-50 text-amber-700 text-xs border border-amber-200">
                    No active campaigns found for this organization. Please activate a campaign first.
                  </div>
                ) : (
                  <CustomSelect
                    value={selectedCampaignId}
                    onChange={(val) => setSelectedCampaignId(val)}
                    options={campaigns.map((camp) => ({
                      value: camp.id,
                      label: camp.name,
                      badge: camp.status ? camp.status.toUpperCase() : undefined,
                      icon: 'fi-rr-bullhorn',
                    }))}
                    placeholder="Select Target Campaign..."
                    searchable={campaigns.length > 4}
                    size="sm"
                  />
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  Scheduled batches will be promoted directly into this campaign.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Scheduling Configuration */}
          {step === 2 && (
            <div className="space-y-5">
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
                      label: `${i + 1} Batch${i > 0 ? 'es' : ''} per Day`,
                      badge: i === 2 ? 'Recommended' : undefined,
                      icon: 'fi-rr-layers',
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
                  Execution Times (IST): {batchesPerDay} Slot{batchesPerDay > 1 ? 's' : ''}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {batchTimes.map((time, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
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
                        className="w-full bg-white px-2.5 py-1.5 rounded-md border border-gray-200 text-xs font-bold text-black focus:border-[#4b33e8] outline-none"
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
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
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

          {/* STEP 3: Agent Assignment & Lead Distribution */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Assignment Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setAssignmentType('unassigned')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      assignmentType === 'unassigned'
                        ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03]'
                        : 'border-gray-200 hover:border-gray-300'
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
                    onClick={() => setAssignmentType('assigned')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      assignmentType === 'assigned'
                        ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03]'
                        : 'border-gray-200 hover:border-gray-300'
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

              {assignmentType === 'assigned' && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
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
                      {selectedAgentIds.length === availableAgents.length ? 'Deselect All' : 'Select All'}
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
                                ? 'bg-[#4b33e8]/5 border-[#4b33e8]/30'
                                : 'bg-gray-50/70 border-gray-100 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
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
                                  ? 'bg-[#4b33e8] text-white border-[#4b33e8]'
                                  : 'border-gray-300'
                              }`}
                            >
                              {isSelected && '✓'}
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

          {/* STEP 4: Sorting & Review */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Leads Ingestion Priority Order
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'file_order', label: 'File Order (FIFO)', desc: 'Original sequence in file' },
                    { id: 'name_asc', label: 'Customer Name (A ➔ Z)', desc: 'Alphabetical order' },
                    { id: 'expiry_date_asc', label: 'Expiry Date (Earliest First)', desc: 'Urgent policies first' },
                  ].map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSortBy(s.id as any)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        sortBy === s.id
                          ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-[#263238]">{s.label}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Summary Box */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Configuration Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Target Campaign</span>
                    <span className="font-bold text-[#4b33e8]">
                      {campaigns.find((c) => c.id === selectedCampaignId)?.name || 'Selected Campaign'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Batch Release</span>
                    <span className="font-bold text-[#263238]">{batchSize} leads / batch</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Batches Per Day</span>
                    <span className="font-bold text-[#263238]">{batchesPerDay} batches / day</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-200/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Active Schedule</span>
                    <span className="font-semibold text-gray-700">{startDate} to {endDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Pause Days</span>
                    <span className="font-semibold text-gray-700">{pauseDays.length > 0 ? pauseDays.join(', ') : 'None'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Assignment</span>
                    <span className="font-bold text-gray-700">
                      {assignmentType === 'unassigned'
                        ? 'Unassigned (Open Pool)'
                        : `${selectedAgentIds.length} Agents Selected`}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-2 text-[11px] text-blue-700 font-medium">
                  <i className="fi flex fi-rr-info text-xs"></i>
                  <span>You will upload your lead files directly on the workflow details page after creation.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              disabled={submitting}
              onClick={() => setStep((s) => s - 1)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 rounded-lg bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-semibold transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="px-5 py-2 rounded-lg bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {submitting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>Configure Workflow</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
