import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CustomSelect from '@/components/workflow/pilotlead/CustomSelect';

export interface DiscoverableMetaAd {
  ad_id: string | null;
  ad_name: string;
  ad_status?: string;
  meta_campaign_id?: string | null;
  meta_campaign_name?: string;
  adset_id?: string | null;
  adset_name?: string;
  ad_account_id?: string;
  ad_account_name?: string;
  page_id: string;
  page_name: string;
  form_id: string;
  form_name: string;
  leads_count?: number;
  questions?: Array<{ key: string; label: string; type?: string }>;
}

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

interface ConnectMetaAdModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: (savedConfig: any) => void;
  organizationId: string;
  selectedAd: DiscoverableMetaAd | null;
  editingConfig?: any | null;
  pages?: Array<{ page_id: string; page_name: string }>;
}

export default function ConnectMetaAdModal({
  show,
  onClose,
  onSuccess,
  organizationId,
  selectedAd,
  editingConfig = null,
  pages = [],
}: ConnectMetaAdModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Target Campaign & Source Name
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [sourceName, setSourceName] = useState('');

  // Custom Ad / Form fields (if user connects a manual Form ID / Ad ID)
  const [pageId, setPageId] = useState('');
  const [pageName, setPageName] = useState('');
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [adId, setAdId] = useState('');
  const [adName, setAdName] = useState('');

  // Assignment Configuration: 'unassigned' (General Pool) | 'single_agent' | 'round_robin'
  const [assignmentType, setAssignmentType] = useState<'unassigned' | 'single_agent' | 'round_robin'>('unassigned');
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [singleAgentId, setSingleAgentId] = useState<string>('');
  const [roundRobinAgentIds, setRoundRobinAgentIds] = useState<string[]>([]);

  // Expiry Date Configuration: 'relative_days' | 'fixed_date' | 'none'
  const [expiryMode, setExpiryMode] = useState<'relative_days' | 'fixed_date' | 'none'>('relative_days');
  const [expiryDays, setExpiryDays] = useState<number>(15);
  const [fixedExpiryDate, setFixedExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  // Duplicate Handling & Field Mapping
  const [duplicateHandling, setDuplicateHandling] = useState<'skip' | 'merge'>('skip');
  const [nameFieldKey, setNameFieldKey] = useState('full_name');
  const [phoneFieldKey, setPhoneFieldKey] = useState('phone_number');

  // Populate initial state when modal opens
  useEffect(() => {
    if (!show) return;
    setErrorMessage('');
    setSuccessMessage('');

    if (organizationId) {
      fetchActiveCampaigns(organizationId);
    }

    if (editingConfig) {
      setSelectedCampaignId(editingConfig.campaign_id || '');
      setSourceName(editingConfig.source_name || '');
      setPageId(editingConfig.page_id || '');
      setPageName(editingConfig.page_name || '');
      setFormId(editingConfig.form_id || '');
      setFormName(editingConfig.form_name || '');
      setAdId(editingConfig.ad_id || '');
      setAdName(editingConfig.ad_name || '');
      setAssignmentType(editingConfig.assignment_type || 'unassigned');
      setSingleAgentId(editingConfig.assigned_agent_id || '');
      setRoundRobinAgentIds(
        Array.isArray(editingConfig.assigned_agents_config?.agent_ids)
          ? editingConfig.assigned_agents_config.agent_ids
          : []
      );
      setExpiryMode(editingConfig.expiry_mode || 'relative_days');
      setExpiryDays(Number(editingConfig.expiry_days) || 15);
      if (editingConfig.expiry_date) {
        setFixedExpiryDate(String(editingConfig.expiry_date).split('T')[0]);
      }
      setDuplicateHandling(editingConfig.duplicate_handling || 'skip');
      setNameFieldKey(editingConfig.field_mapping?.name || 'full_name');
      setPhoneFieldKey(editingConfig.field_mapping?.phone || 'phone_number');
    } else if (selectedAd) {
      setPageId(selectedAd.page_id);
      setPageName(selectedAd.page_name);
      setFormId(selectedAd.form_id);
      setFormName(selectedAd.form_name);
      setAdId(selectedAd.ad_id || '');
      setAdName(selectedAd.ad_name || selectedAd.form_name);
      setSourceName(`Meta - ${selectedAd.ad_name || selectedAd.form_name}`);
      setAssignmentType('unassigned');
      setExpiryMode('relative_days');
      setExpiryDays(15);
      setDuplicateHandling('skip');

      const questions = selectedAd.questions || [];
      const detectedName =
        questions.find((q) => /name/i.test(q.key) || q.type === 'FULL_NAME')?.key || 'full_name';
      const detectedPhone =
        questions.find((q) => /phone|mobile|contact/i.test(q.key) || q.type === 'PHONE')?.key ||
        'phone_number';
      setNameFieldKey(detectedName);
      setPhoneFieldKey(detectedPhone);
    } else {
      const firstPage = pages[0];
      setPageId(firstPage?.page_id || 'page_custom');
      setPageName(firstPage?.page_name || 'Facebook Business Page');
      setFormId('');
      setFormName('');
      setAdId('');
      setAdName('');
      setSourceName('Meta Lead Ad');
      setAssignmentType('unassigned');
      setExpiryMode('relative_days');
      setExpiryDays(15);
    }
  }, [show, selectedAd, editingConfig, organizationId]);

  const fetchActiveCampaigns = async (orgId: string) => {
    setLoadingCampaigns(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, status, users')
        .eq('organization_id', orgId)
        .eq('status', 'active');
      if (error) throw error;
      const list = data || [];
      setCampaigns(list);
      if (list.length > 0 && !editingConfig) {
        setSelectedCampaignId((prev) => (list.some((c) => c.id === prev) ? prev : list[0].id));
      }
    } catch (err) {
      console.error('[ConnectMetaAdModal] Error loading campaigns:', err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Load agents belonging to the selected campaign (or fallback to organization agents)
  useEffect(() => {
    if (!selectedCampaignId) {
      setAvailableAgents([]);
      return;
    }
    const camp = campaigns.find((c) => c.id === selectedCampaignId);
    if (camp && Array.isArray(camp.users) && camp.users.length > 0) {
      const agents: Agent[] = camp.users
        .map((u: any) => ({
          id: u.user_id || u.id,
          name: u.name || u.user_name || u.email || 'Agent',
          email: u.email,
          role: u.role,
        }))
        .filter((a: Agent) => Boolean(a.id));
      setAvailableAgents(agents);
      if (!editingConfig) {
        if (agents.length > 0 && !singleAgentId) setSingleAgentId(agents[0].id);
        setRoundRobinAgentIds(agents.map((a) => a.id));
      }
    } else if (organizationId) {
      supabase
        .from('user_profiles')
        .select('user_id, user_name, role')
        .eq('organization_id', organizationId)
        .then(({ data }) => {
          if (data) {
            const agents: Agent[] = data.map((u: any) => ({
              id: u.user_id,
              name: u.user_name || 'Agent',
              role: u.role,
            }));
            setAvailableAgents(agents);
            if (!editingConfig) {
              if (agents.length > 0 && !singleAgentId) setSingleAgentId(agents[0].id);
              setRoundRobinAgentIds(agents.map((a) => a.id));
            }
          }
        });
    }
  }, [selectedCampaignId, campaigns, organizationId]);

  const toggleRoundRobinAgent = (agentId: string) => {
    setRoundRobinAgentIds((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedCampaignId) {
      setErrorMessage('Please select a Target Campaign where leads will be added.');
      return;
    }
    if (!sourceName.trim()) {
      setErrorMessage('Please enter a Source Name for tracking these leads.');
      return;
    }
    if (!formId.trim()) {
      setErrorMessage('Lead Form ID is required.');
      return;
    }
    if (assignmentType === 'single_agent' && !singleAgentId) {
      setErrorMessage('Please select an agent or switch to General Pool.');
      return;
    }
    if (assignmentType === 'round_robin' && roundRobinAgentIds.length === 0) {
      setErrorMessage('Please select at least one agent for Round-Robin distribution.');
      return;
    }
    if (expiryMode === 'fixed_date' && !fixedExpiryDate) {
      setErrorMessage('Please choose an expiry date.');
      return;
    }

    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Session expired. Please sign in again.');

      const questions = selectedAd?.questions || [
        { key: 'full_name', label: 'Full Name' },
        { key: 'phone_number', label: 'Phone Number' },
      ];

      const customFields = questions
        .filter((q) => q.key !== nameFieldKey && q.key !== phoneFieldKey)
        .map((q) => ({
          meta_key: q.key,
          crm_label: q.label || q.key,
          checked: true,
        }));

      const payload = {
        id: editingConfig?.id,
        organizationId,
        page_id: pageId || 'page_custom',
        page_name: pageName || 'Facebook Business Page',
        ad_account_id: selectedAd?.ad_account_id || editingConfig?.ad_account_id || null,
        ad_account_name: selectedAd?.ad_account_name || editingConfig?.ad_account_name || null,
        ad_id: adId.trim() || null,
        ad_name: adName.trim() || formName.trim() || 'Meta Lead Ad',
        form_id: formId.trim(),
        form_name: formName.trim() || `Form ${formId.trim()}`,
        campaign_id: selectedCampaignId,
        source_name: sourceName.trim(),
        assignment_type: assignmentType,
        assigned_agent_id: assignmentType === 'single_agent' ? singleAgentId : null,
        assigned_agents_config: {
          mode: 'uniform',
          agent_ids: assignmentType === 'round_robin' ? roundRobinAgentIds : [],
        },
        expiry_mode: expiryMode,
        expiry_date:
          expiryMode === 'fixed_date' ? new Date(fixedExpiryDate).toISOString() : null,
        expiry_days: expiryMode === 'relative_days' ? Number(expiryDays) || 15 : null,
        duplicate_handling: duplicateHandling,
        field_mapping: {
          name: nameFieldKey || 'full_name',
          phone: phoneFieldKey || 'phone_number',
          custom_fields: customFields,
        },
      };

      const res = await fetch('/api/meta/configs', {
        method: editingConfig ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save Ad configuration.');
      }

      setSuccessMessage(
        editingConfig
          ? 'Ad routing configuration updated!'
          : 'Ad connected! Incoming leads will now flow into your CRM campaign.'
      );
      setTimeout(() => {
        onSuccess(data.config);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to save configuration.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  const questionOptions =
    selectedAd?.questions && selectedAd.questions.length > 0
      ? selectedAd.questions
      : [
          { key: 'full_name', label: 'Full Name (full_name)' },
          { key: 'phone_number', label: 'Phone Number (phone_number)' },
          { key: 'email', label: 'Email Address (email)' },
          { key: 'city', label: 'City (city)' },
        ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#1877F2]/5 via-white to-[#4b33e8]/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center text-base font-bold shadow-xs">
              <i className="fi flex fi-brands-facebook"></i>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                {editingConfig ? 'Edit Meta Ad Lead Configuration' : 'Connect Meta Ad to CRM'}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Configure Target Campaign, Source Name, Agent Assignment &amp; Expiry Date
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="fi flex fi-rr-cross text-xs"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveConfig} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <i className="fi flex fi-rr-exclamation text-sm shrink-0"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <i className="fi flex fi-rr-check-circle text-sm shrink-0"></i>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Selected Meta Ad / Form Banner */}
          {selectedAd ? (
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1877F2] text-white uppercase tracking-wider">
                    Meta Ad
                  </span>
                  <span className="text-xs font-bold text-gray-900">{selectedAd.ad_name}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Page: <strong className="text-gray-800">{selectedAd.page_name}</strong> • Form:{' '}
                  <strong className="text-gray-800">{selectedAd.form_name}</strong>
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#1877F2] bg-white px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
                Form ID: {selectedAd.form_id}
              </span>
            </div>
          ) : !editingConfig ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Facebook PageName / ID <span className="text-rose-500">*</span>
                </label>
                {pages.length > 0 ? (
                  <select
                    value={pageId}
                    onChange={(e) => {
                      const p = pages.find((x) => x.page_id === e.target.value);
                      setPageId(e.target.value);
                      if (p) setPageName(p.page_name);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-[#4b33e8]"
                  >
                    {pages.map((p) => (
                      <option key={p.page_id} value={p.page_id}>
                        {p.page_name} ({p.page_id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    placeholder="e.g. 10492819283"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-[#4b33e8]"
                  />
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Meta Lead Form ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="e.g. 849201928374"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-[#4b33e8]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Ad / Form Title
                </label>
                <input
                  type="text"
                  value={adName}
                  onChange={(e) => {
                    setAdName(e.target.value);
                    setFormName(e.target.value);
                  }}
                  placeholder="e.g. Festive Lead Form"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-[#4b33e8]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Specific Ad ID (Optional)
                </label>
                <input
                  type="text"
                  value={adId}
                  onChange={(e) => setAdId(e.target.value)}
                  placeholder="Leave blank for all ads using form"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-[#4b33e8]"
                />
              </div>
            </div>
          ) : null}

          {/* 1. Target Campaign & 2. Source Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                1. Target CRM Campaign <span className="text-rose-500">*</span>
              </label>
              {loadingCampaigns ? (
                <div className="h-9 rounded-lg bg-gray-100 animate-pulse" />
              ) : (
                <CustomSelect
                  value={selectedCampaignId}
                  onChange={(val) => setSelectedCampaignId(val)}
                  options={campaigns.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  placeholder="Select active campaign..."
                />
              )}
              <p className="text-[10px] text-gray-500 mt-1">
                Meta Ad leads will be automatically added to this campaign.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                2. Lead Source Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g. Meta Ad - Diwali Offer"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:border-[#4b33e8]"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Appears in System Logs &amp; Source Analytics for ROI tracking.
              </p>
            </div>
          </div>

          {/* 3. Lead Assignment: General Pool vs Agent */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              3. Lead Assignment (Agent or General Pool) <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setAssignmentType('unassigned')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  assignmentType === 'unassigned'
                    ? 'border-[#4b33e8] bg-[#4b33e8]/5 ring-1 ring-[#4b33e8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">General Pool</span>
                  <i className="fi flex fi-rr-users text-xs text-[#4b33e8]"></i>
                </div>
                <p className="text-[10px] text-gray-500 leading-snug">
                  Keep unassigned in campaign pool for any agent to dial.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAssignmentType('single_agent')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  assignmentType === 'single_agent'
                    ? 'border-[#4b33e8] bg-[#4b33e8]/5 ring-1 ring-[#4b33e8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">Specific Agent</span>
                  <i className="fi flex fi-rr-user text-xs text-[#4b33e8]"></i>
                </div>
                <p className="text-[10px] text-gray-500 leading-snug">
                  Assign every incoming lead from this ad to one chosen agent.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAssignmentType('round_robin')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  assignmentType === 'round_robin'
                    ? 'border-[#4b33e8] bg-[#4b33e8]/5 ring-1 ring-[#4b33e8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-gray-900">Round-Robin Team</span>
                  <i className="fi flex fi-rr-refresh text-xs text-[#4b33e8]"></i>
                </div>
                <p className="text-[10px] text-gray-500 leading-snug">
                  Distribute leads equally 1-by-1 among selected agents.
                </p>
              </button>
            </div>

            {assignmentType === 'single_agent' && (
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Select Target Agent ({availableAgents.length} available in campaign)
                </label>
                {availableAgents.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    No agents found in this campaign. Please add agents to the campaign or choose General Pool.
                  </p>
                ) : (
                  <CustomSelect
                    value={singleAgentId}
                    onChange={(val) => setSingleAgentId(val)}
                    options={availableAgents.map((a) => ({
                      value: a.id,
                      label: `${a.name}${a.role ? ` (${a.role})` : ''}`,
                    }))}
                    placeholder="Choose agent..."
                  />
                )}
              </div>
            )}

            {assignmentType === 'round_robin' && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-gray-700">
                    Select Agents for Round-Robin ({roundRobinAgentIds.length} selected)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setRoundRobinAgentIds(
                        roundRobinAgentIds.length === availableAgents.length
                          ? []
                          : availableAgents.map((a) => a.id)
                      )
                    }
                    className="text-[11px] font-semibold text-[#4b33e8] hover:underline"
                  >
                    {roundRobinAgentIds.length === availableAgents.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
                  {availableAgents.map((agent) => {
                    const checked = roundRobinAgentIds.includes(agent.id);
                    return (
                      <label
                        key={agent.id}
                        className={`flex items-center gap-2 p-1.5 rounded-md cursor-pointer text-xs border transition-colors ${
                          checked
                            ? 'bg-[#4b33e8]/5 border-[#4b33e8]/30 text-gray-900 font-semibold'
                            : 'border-transparent text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRoundRobinAgent(agent.id)}
                          className="rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8]"
                        />
                        <span className="truncate">{agent.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Expiry Date Configuration */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              4. Lead Expiry Date Rule <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setExpiryMode('relative_days')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  expiryMode === 'relative_days'
                    ? 'border-[#4b33e8] bg-[#4b33e8]/5 ring-1 ring-[#4b33e8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-xs font-bold text-gray-900">Dynamic (+X Days)</p>
                <p className="text-[10px] text-gray-500">Auto-set from lead arrival date</p>
              </button>

              <button
                type="button"
                onClick={() => setExpiryMode('fixed_date')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  expiryMode === 'fixed_date'
                    ? 'border-[#4b33e8] bg-[#4b33e8]/5 ring-1 ring-[#4b33e8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-xs font-bold text-gray-900">Fixed Calendar Date</p>
                <p className="text-[10px] text-gray-500">Same expiry date for all leads</p>
              </button>

              <button
                type="button"
                onClick={() => setExpiryMode('none')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  expiryMode === 'none'
                    ? 'border-[#4b33e8] bg-[#4b33e8]/5 ring-1 ring-[#4b33e8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="text-xs font-bold text-gray-900">No Expiry Date</p>
                <p className="text-[10px] text-gray-500">Leads never expire</p>
              </button>
            </div>

            {expiryMode === 'relative_days' && (
              <div className="flex items-center gap-3 pt-1">
                <label className="text-xs font-semibold text-gray-700">
                  Expire lead after:
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Math.max(1, Number(e.target.value) || 15))}
                  className="w-20 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white text-black text-center"
                />
                <span className="text-xs text-gray-600">days from when lead arrives</span>
              </div>
            )}

            {expiryMode === 'fixed_date' && (
              <div className="flex items-center gap-3 pt-1">
                <label className="text-xs font-semibold text-gray-700">
                  Select Expiry Date:
                </label>
                <input
                  type="date"
                  value={fixedExpiryDate}
                  onChange={(e) => setFixedExpiryDate(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-black"
                />
              </div>
            )}
          </div>

          {/* 5. Form Field Mapping & Duplicate Handling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-gray-200 bg-white">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                Customer Name Field
              </label>
              <select
                value={nameFieldKey}
                onChange={(e) => setNameFieldKey(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-black"
              >
                {questionOptions.map((q) => (
                  <option key={q.key} value={q.key} className="text-black">
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                Phone Number Field
              </label>
              <select
                value={phoneFieldKey}
                onChange={(e) => setPhoneFieldKey(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-black"
              >
                {questionOptions.map((q) => (
                  <option key={q.key} value={q.key} className="text-black">
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                If Phone Already in CRM
              </label>
              <select
                value={duplicateHandling}
                onChange={(e) => setDuplicateHandling(e.target.value as 'skip' | 'merge')}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-black"
              >
                <option value="skip" className="text-black">Skip Duplicate Lead</option>
                <option value="merge" className="text-black">Merge New Form Details</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#4b33e8] hover:bg-[#3d27c7] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fi flex fi-rr-check text-xs"></i>
                  <span>{editingConfig ? 'Update Configuration' : 'Connect Ad & Activate Sync'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

