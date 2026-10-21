import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { getUserDashboardLevel, DashboardLevel } from '@/lib/dashboardUtils';
import { supabase } from '@/lib/supabase';
import AppendLeadsModal from '@/components/workflow/pilotlead/AppendLeadsModal';
import EditWorkflowModal from '@/components/workflow/pilotlead/EditWorkflowModal';
import CustomSelect from '@/components/workflow/pilotlead/CustomSelect';

interface StagedLead {
  id: string;
  lead_id: string;
  customer_name: string;
  phone_no: string;
  expiry_date: string | null;
  assigned_to: string | null;
  row_index: number;
  upload_status: string;
  batch_number: number | null;
  uploaded_at: string | null;
  error_reason: string | null;
  source_file_name: string | null;
  created_at: string;
}

interface BatchLog {
  id: string;
  batch_number: number;
  scheduled_time: string;
  executed_at: string;
  leads_attempted: number;
  leads_succeeded: number;
  leads_failed: number;
  leads_skipped: number;
  status: string;
  agent_distribution_summary: Record<string, number>;
  error_message: string | null;
}

interface UploadHistoryItem {
  id: string;
  file_name: string;
  file_size_bytes: number;
  total_rows: number;
  valid_rows: number;
  duplicate_rows: number;
  created_at: string;
}

export default function WorkflowDashboardPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, mounted, loading: authLoading } = useUser();

  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'staged' | 'logs' | 'uploads' | 'config'>('logs');

  // Staged Leads tab state
  const [stagedLeads, setStagedLeads] = useState<StagedLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadsPage, setLeadsPage] = useState(1);
  const LEADS_PER_PAGE = 25;

  // Batch Logs tab state
  const [batchLogs, setBatchLogs] = useState<BatchLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Upload History tab state
  const [uploadsHistory, setUploadsHistory] = useState<UploadHistoryItem[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);

  // Agent name map
  const [agentMap, setAgentMap] = useState<Record<string, string>>({});

  // Modals
  const [showAppendModal, setShowAppendModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isAuthorized = useMemo(() => {
    if (!user) return false;
    const level = getUserDashboardLevel(user);
    const role = (user.role || '').toLowerCase().trim();
    const designation = (user.designation || '').toLowerCase().trim();
    const isL1 = level === DashboardLevel.LEVEL_1_ADMIN || (!user.isClient && (role === 'superadmin' || role === 'super_admin' || designation === 'ceo'));
    const isL2 = level === DashboardLevel.LEVEL_2_CLIENT_CEO || (user.isClient === true && designation === 'ceo');
    return isL1 || isL2;
  }, [user]);

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!user) {
        router.replace('/portal/login');
        return;
      }
      if (!isAuthorized) {
        router.replace('/portal/dashboard');
        return;
      }
      if (id && typeof id === 'string') {
        fetchWorkflowDetails(id);
        fetchAgentMap();
      }
    }
  }, [mounted, authLoading, user, isAuthorized, id]);

  // Auto-open upload modal when redirected from wizard with ?firstUpload=true
  useEffect(() => {
    if (workflow && router.query.firstUpload === 'true') {
      setShowAppendModal(true);
    }
  }, [workflow, router.query.firstUpload]);

  const fetchWorkflowDetails = async (wfId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leadpilot')
        .select('*, campaigns(name), organizations(id, company_name)')
        .eq('id', wfId)
        .single();
      if (error) throw error;
      setWorkflow(data);

      // Load sub-tab data
      fetchStagedLeads(wfId);
      fetchBatchLogs(wfId);
      fetchUploadHistory(wfId);
    } catch (err: any) {
      console.error('Failed to fetch workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentMap = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('user_id, user_name');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((p) => {
          if (p.user_id && p.user_name) map[p.user_id] = p.user_name;
        });
        setAgentMap(map);
      }
    } catch (e) {}
  };

  const fetchStagedLeads = async (wfId: string) => {
    setLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from('lead_sheduled')
        .select('*')
        .eq('pilotlead_id', wfId)
        .order('row_index', { ascending: true })
        .limit(1000);
      if (error) throw error;
      setStagedLeads(data || []);
    } catch (err) {
      console.error('Failed to fetch staged leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchBatchLogs = async (wfId: string) => {
    setLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('pilotlead_log')
        .select('*')
        .eq('pilotlead_id', wfId)
        .order('executed_at', { ascending: false });
      if (error) throw error;
      setBatchLogs(data || []);
    } catch (err) {
      console.error('Failed to fetch batch logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchUploadHistory = async (wfId: string) => {
    setLoadingUploads(true);
    try {
      const { data, error } = await supabase
        .from('pilotlead_uploads')
        .select('*')
        .eq('pilotlead_id', wfId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUploadsHistory(data || []);
    } catch (err) {
      console.error('Failed to fetch upload history:', err);
    } finally {
      setLoadingUploads(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!workflow) return;
    const isCurrentlyActive = workflow.status === 'scheduled' || workflow.status === 'running';
    if (!isCurrentlyActive && (workflow.pending_leads || 0) === 0) {
      alert("No pending leads remaining in this workflow. Please upload more leads to resume.");
      return;
    }
    const newStatus = isCurrentlyActive ? 'paused' : 'scheduled';

    try {
      let nextExec = workflow.next_execution_at;
      if (!isCurrentlyActive) {
        const { data: recomputed } = await supabase.rpc(
          'calculate_leadpilot_next_execution',
          {
            p_batch_times: workflow.batch_times || ['10:00', '13:00', '17:00'],
            p_pause_days: workflow.pause_days || [],
            p_start_date: workflow.start_date,
            p_end_date: workflow.end_date,
            p_from_time: new Date().toISOString(),
          }
        );
        nextExec = recomputed;
      }

      const { error } = await supabase
        .from('leadpilot')
        .update({
          status: newStatus,
          next_execution_at: nextExec,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workflow.id);

      if (error) throw error;
      fetchWorkflowDetails(workflow.id);
    } catch (err: any) {
      alert(err.message || 'Failed to update workflow status.');
    }
  };

  const formatIST = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Mask phone number for display
  const maskPhone = (encPhone: string | null) => {
    if (!encPhone) return '—';
    return '••••••••' + encPhone.slice(-4);
  };

  // Filtered staged leads
  const filteredStagedLeads = useMemo(() => {
    return stagedLeads.filter((lead) => {
      const matchesSearch =
        lead.customer_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
        (lead.source_file_name || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.lead_id.toLowerCase().includes(leadSearch.toLowerCase());

      const matchesStatus =
        leadStatusFilter === 'all' ? true : lead.upload_status === leadStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stagedLeads, leadSearch, leadStatusFilter]);

  const paginatedLeads = useMemo(() => {
    const start = (leadsPage - 1) * LEADS_PER_PAGE;
    return filteredStagedLeads.slice(start, start + LEADS_PER_PAGE);
  }, [filteredStagedLeads, leadsPage]);

  const totalLeadPages = Math.ceil(filteredStagedLeads.length / LEADS_PER_PAGE);

  if (!mounted || authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Loading Workflow Dashboard...</p>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-xl font-bold text-gray-800">Workflow Not Found</h2>
        <Link href="/workflow/pilotlead" className="mt-4 inline-block text-[#4b33e8] font-bold text-xs">
          ← Back to Workflows List
        </Link>
      </div>
    );
  }

  const isRunning = workflow.status === 'scheduled' || workflow.status === 'running';
  const isCompleted = workflow.status === 'completed';
  const isPaused = workflow.status === 'paused';
  const percentComplete = workflow.total_leads > 0 ? Math.round((workflow.uploaded_leads / workflow.total_leads) * 100) : 0;

  return (
    <>
      <Head>
        <title>{workflow.name} | LeadPilot Workflow</title>
      </Head>

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 max-w-[1400px]">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-none">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <Link href="/workflow" className="hover:text-[#4b33e8] transition-colors">
                Workflows
              </Link>
              <span>/</span>
              <Link href="/workflow/pilotlead" className="hover:text-[#4b33e8] transition-colors">
                LeadPilot
              </Link>
              <span>/</span>
              {workflow.organizations?.company_name && (
                <>
                  <span className="text-purple-600 font-semibold">{workflow.organizations.company_name}</span>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-600 font-bold">{workflow.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#263238]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {workflow.name}
              </h1>

              {/* Status Pill */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isRunning
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : isPaused
                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                    : isCompleted
                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isRunning ? 'bg-emerald-500 animate-pulse' : isPaused ? 'bg-amber-500' : isCompleted ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                ></span>
                {workflow.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#787E9D] pt-0.5">
              {/* Organization Pill */}
              {workflow.organizations?.company_name && (
                <div className="flex items-center gap-1.5 font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg">
                  <i className="fi flex fi-rr-building text-xs text-purple-600"></i>
                  <span>{workflow.organizations.company_name}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 font-mono bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                <span className="text-gray-400">Source:</span>
                <span className="font-bold text-[#4b33e8]">{workflow.source_id}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                <i className="fi flex fi-rr-bullhorn text-xs text-[#4b33e8]"></i>
                <span className="font-semibold text-gray-700">{workflow.campaigns?.name || 'Assigned Campaign'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 px-1">
                <i className="fi flex fi-rr-calendar text-xs text-gray-400"></i>
                <span>Created {formatIST(workflow.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold transition-all border border-gray-200 shadow-none cursor-pointer"
            >
              <i className="fi flex fi-rr-edit text-xs text-[#4b33e8]"></i>
              <span>Edit</span>
            </button>

            {/* Upload Leads Button */}
            <button
              type="button"
              onClick={() => setShowAppendModal(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-none cursor-pointer ${
                workflow.total_leads === 0
                  ? 'bg-[#4b33e8] hover:bg-[#3d28d0] text-white'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-[#4b33e8] border border-indigo-200'
              }`}
            >
              <i className="fi flex fi-rr-cloud-upload text-xs"></i>
              <span>Upload</span>
            </button>

            {/* Pause / Resume Button */}
            {!isCompleted && workflow.status !== 'cancelled' && (
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-none cursor-pointer ${
                  isRunning
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <i className={`fi flex ${isRunning ? 'fi-rr-pause' : 'fi-rr-play'} text-xs`}></i>
                <span>{isRunning ? 'Pause' : 'Resume'}</span>
              </button>
            )}

            {/* Link to System Logs Analytics */}
            <Link
              href={`/portal/system-logs/${workflow.source_id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold transition-all border border-gray-200 shadow-none"
            >
              <i className="fi flex fi-rr-chart-histogram text-xs text-[#4b33e8]"></i>
              <span>Analytics</span>
            </Link>
          </div>
        </div>

        {/* Real-Time KPI Cards (5 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-none">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Total Ingested
            </span>
            <div className="text-2xl font-black text-[#263238]">{workflow.total_leads.toLocaleString()}</div>
            <p className="text-[10px] text-gray-400 mt-0.5">{workflow.total_files_uploaded} file(s) uploaded</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-none">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1 text-emerald-600">
              Live Promoted
            </span>
            <div className="text-2xl font-black text-emerald-600">{workflow.uploaded_leads.toLocaleString()}</div>
            <p className="text-[10px] text-gray-400 mt-0.5">{percentComplete}% of pool promoted</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-none">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1 text-[#4b33e8]">
              Pending Staged
            </span>
            <div className="text-2xl font-black text-[#4b33e8]">{workflow.pending_leads.toLocaleString()}</div>
            <p className="text-[10px] text-gray-400 mt-0.5">Awaiting batch dispatches</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-none">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Completed Batches
            </span>
            <div className="text-2xl font-black text-gray-800">{workflow.completed_batches}</div>
            <p className="text-[10px] text-gray-400 mt-0.5">{workflow.batch_size} leads / batch</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-none col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Next Execution (IST)
            </span>
            <div className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">
              {isRunning ? formatIST(workflow.next_execution_at) : '—'}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {workflow.batches_per_day} times daily
            </p>
          </div>
        </div>

        {/* Step 2 Banner if 0 leads uploaded yet */}
        {workflow.total_leads === 0 && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-lg shrink-0">
                <i className="fi flex fi-rr-cloud-upload"></i>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Step 2: Upload Leads File</h4>
                <p className="text-[11px] text-gray-600">
                  Workflow schedule and rules are configured. Upload your leads spreadsheet (.xlsx or .csv) to begin automatic batch processing.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAppendModal(true)}
              className="px-4 py-2 rounded-xl bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-all shrink-0 inline-flex items-center gap-1.5 shadow-none"
            >
              <i className="fi flex fi-rr-upload text-xs"></i>
              <span>Upload Leads Now</span>
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          {[
            { id: 'logs', label: 'Batch Execution Logs', icon: 'fi-rr-list-check', count: batchLogs.length },
            { id: 'staged', label: 'Staged Leads Pool', icon: 'fi-rr-database', count: workflow.pending_leads },
            { id: 'uploads', label: 'Upload History', icon: 'fi-rr-folder', count: uploadsHistory.length },
            { id: 'config', label: 'Configuration & Schedule', icon: 'fi-rr-settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-[#4b33e8] text-[#4b33e8]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              <i className={`fi flex ${tab.icon}`}></i>
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-[#4b33e8]/10 text-[#4b33e8]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Batch Execution Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
              Autonomous Background Execution History
            </h3>

            {loadingLogs ? (
              <div className="py-12 text-center text-xs text-gray-400 font-bold animate-pulse">
                Loading execution audit logs...
              </div>
            ) : batchLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 font-bold">
                No batch execution logs recorded yet. The background engine checks every minute.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Batch #</th>
                      <th className="py-3 px-4">Executed At (IST)</th>
                      <th className="py-3 px-4">Slot Time</th>
                      <th className="py-3 px-4">Leads Attempted</th>
                      <th className="py-3 px-4">Succeeded</th>
                      <th className="py-3 px-4">Failed</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {batchLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-800">Batch #{log.batch_number}</td>
                        <td className="py-3 px-4 font-mono text-gray-600">{formatIST(log.executed_at)}</td>
                        <td className="py-3 px-4 font-bold text-[#4b33e8]">{log.scheduled_time}</td>
                        <td className="py-3 px-4 font-bold text-gray-700">{log.leads_attempted}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">{log.leads_succeeded}</td>
                        <td className="py-3 px-4 font-bold text-rose-600">{log.leads_failed}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              log.status === 'success'
                                ? 'bg-emerald-50 text-emerald-600'
                                : log.status === 'partial'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Staged Leads Pool */}
        {activeTab === 'staged' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
            {workflow.total_leads === 0 ? (
              <div className="py-12 sm:py-16 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center mx-auto text-2xl">
                  <i className="fi flex fi-rr-cloud-upload"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    No Leads Uploaded Yet
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This workflow is configured with <span className="font-bold text-gray-800">{workflow.batches_per_day} batches/day</span> ({workflow.batch_size} leads each). Upload your Excel or CSV file to start processing.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setShowAppendModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-none"
                  >
                    <i className="fi flex fi-rr-upload text-xs"></i>
                    <span>Upload Leads File</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <i className="fi flex fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                    <input
                      type="text"
                      placeholder="Search lead name or ID..."
                      value={leadSearch}
                      onChange={(e) => {
                        setLeadSearch(e.target.value);
                        setLeadsPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-black font-medium placeholder:text-gray-400 outline-none focus:border-[#4b33e8] focus:ring-4 focus:ring-[#4b33e8]/10 transition-all shadow-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Status:</span>
                    <div className="w-full sm:w-56">
                      <CustomSelect
                        value={leadStatusFilter}
                        onChange={(val) => {
                          setLeadStatusFilter(val);
                          setLeadsPage(1);
                        }}
                        options={[
                          { value: 'all', label: `All Leads (${stagedLeads.length})` },
                          { value: 'pending', label: 'Pending Queue', badge: 'Queue' },
                          { value: 'uploaded', label: 'Uploaded / Promoted', badge: 'Active' },
                          { value: 'failed', label: 'Failed' },
                          { value: 'cancelled', label: 'Cancelled' },
                        ]}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {loadingLeads ? (
                  <div className="py-12 text-center text-xs text-gray-400 font-bold animate-pulse">
                    Loading staged leads...
                  </div>
                ) : filteredStagedLeads.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400 font-bold">
                    No staged leads match the filter.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4">Row</th>
                          <th className="py-2.5 px-4">Customer Name</th>
                          <th className="py-2.5 px-4">Phone Number</th>
                          <th className="py-2.5 px-4">Assigned Agent</th>
                          <th className="py-2.5 px-4">Batch #</th>
                          <th className="py-2.5 px-4">Status</th>
                          <th className="py-2.5 px-4">Source File</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {paginatedLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-2.5 px-4 font-mono text-gray-400">{lead.row_index}</td>
                            <td className="py-2.5 px-4 font-bold text-gray-800">{lead.customer_name}</td>
                            <td className="py-2.5 px-4 font-mono text-gray-500">{maskPhone(lead.phone_no)}</td>
                            <td className="py-2.5 px-4">
                              {lead.assigned_to && agentMap[lead.assigned_to] ? (
                                <span className="font-semibold text-gray-700">{agentMap[lead.assigned_to]}</span>
                              ) : (
                                <span className="text-gray-400 italic">Unassigned</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-gray-700">
                              {lead.batch_number ? `Batch #${lead.batch_number}` : '—'}
                            </td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  lead.upload_status === 'uploaded'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : lead.upload_status === 'pending'
                                    ? 'bg-indigo-50 text-[#4b33e8]'
                                    : lead.upload_status === 'failed'
                                    ? 'bg-rose-50 text-rose-600'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {lead.upload_status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-gray-400 text-[11px] line-clamp-1 max-w-[150px]">
                              {lead.source_file_name || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalLeadPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <span>
                      Showing {(leadsPage - 1) * LEADS_PER_PAGE + 1} to{' '}
                      {Math.min(leadsPage * LEADS_PER_PAGE, filteredStagedLeads.length)} of{' '}
                      {filteredStagedLeads.length} leads
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={leadsPage === 1}
                        onClick={() => setLeadsPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <span className="font-bold text-gray-800 px-2">{leadsPage} / {totalLeadPages}</span>
                      <button
                        disabled={leadsPage === totalLeadPages}
                        onClick={() => setLeadsPage((p) => Math.min(totalLeadPages, p + 1))}
                        className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 3: Upload History */}
        {activeTab === 'uploads' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Files Appended into this Workflow ({uploadsHistory.length})
              </h3>
              <button
                onClick={() => setShowAppendModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#4b33e8] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <i className="fi flex fi-rr-plus text-[10px]"></i>
                <span>Append Leads File</span>
              </button>
            </div>

            {loadingUploads ? (
              <div className="py-12 text-center text-xs text-gray-400 font-bold animate-pulse">
                Loading files history...
              </div>
            ) : uploadsHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 font-bold">
                No upload files history recorded.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-4">File Name</th>
                      <th className="py-3 px-4">Uploaded At (IST)</th>
                      <th className="py-3 px-4">Total Rows</th>
                      <th className="py-3 px-4">Valid Staged</th>
                      <th className="py-3 px-4">Duplicates Skipped</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {uploadsHistory.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-800 flex items-center gap-2">
                          <i className="fi flex fi-rr-document text-[#4b33e8]"></i>
                          <span>{u.file_name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">{formatIST(u.created_at)}</td>
                        <td className="py-3 px-4 font-bold text-gray-700">{u.total_rows.toLocaleString()}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">{u.valid_rows.toLocaleString()}</td>
                        <td className="py-3 px-4 font-bold text-amber-600">{u.duplicate_rows.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Configuration & Schedule */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Workflow Parameters & Rules
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-none"
              >
                <i className="fi flex fi-rr-edit text-xs"></i>
                <span>Edit Configuration</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scheduling Card */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3 text-xs">
                <h4 className="font-bold text-[#263238] uppercase tracking-wider text-[11px] text-[#4b33e8]">
                  Batch Schedule
                </h4>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Batches per Day:</span>
                  <span className="font-bold text-gray-800">{workflow.batches_per_day} Batches</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Batch Size:</span>
                  <span className="font-bold text-gray-800">{workflow.batch_size} leads / batch</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Scheduled Times (IST):</span>
                  <span className="font-bold text-[#4b33e8]">
                    {(workflow.batch_times || []).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Pause Days:</span>
                  <span className="font-bold text-rose-600">
                    {workflow.pause_days?.length > 0 ? workflow.pause_days.join(', ') : 'None (Daily)'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Active Window:</span>
                  <span className="font-bold text-gray-800">
                    {workflow.start_date} to {workflow.end_date}
                  </span>
                </div>
              </div>

              {/* Assignment & Ingestion Rules */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3 text-xs">
                <h4 className="font-bold text-[#263238] uppercase tracking-wider text-[11px] text-[#4b33e8]">
                  Distribution & Ingestion
                </h4>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Assignment Mode:</span>
                  <span className="font-bold text-gray-800 capitalize">{workflow.assignment_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Ingestion Order:</span>
                  <span className="font-bold text-gray-800 capitalize">{workflow.sort_by?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span className="text-gray-500">Target Campaign:</span>
                  <span className="font-bold text-[#4b33e8]">{workflow.campaigns?.name}</span>
                </div>
                {workflow.organizations?.company_name && (
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span className="text-gray-500">Organization:</span>
                    <span className="font-bold text-purple-700">{workflow.organizations.company_name}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Saved Column Mapping:</span>
                  <span className="font-mono text-[10px] text-gray-600">
                    Name: {workflow.column_mapping?.name || '—'} | Phone: {workflow.column_mapping?.phone || '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Append Leads Modal */}
      {showAppendModal && (
        <AppendLeadsModal
          show={showAppendModal}
          workflow={workflow}
          onClose={() => setShowAppendModal(false)}
          onSuccess={() => {
            setShowAppendModal(false);
            if (id && typeof id === 'string') fetchWorkflowDetails(id);
          }}
        />
      )}

      {/* Edit Workflow Modal */}
      {showEditModal && workflow && (
        <EditWorkflowModal
          show={showEditModal}
          workflow={workflow}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            if (id && typeof id === 'string') fetchWorkflowDetails(id);
          }}
        />
      )}
    </>
  );
}
