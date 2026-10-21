import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { getUserDashboardLevel, DashboardLevel } from '@/lib/dashboardUtils';
import { supabase } from '@/lib/supabase';
import CreateWorkflowWizardModal from '@/components/workflow/pilotlead/CreateWorkflowWizardModal';
import AppendLeadsModal from '@/components/workflow/pilotlead/AppendLeadsModal';
import CustomSelect from '@/components/workflow/pilotlead/CustomSelect';

interface LeadPilotWorkflow {
  id: string;
  name: string;
  source_id: string;
  status: string;
  campaign_id: string;
  organization_id: string;
  batches_per_day: number;
  batch_times: string[];
  batch_size: number;
  pause_days: string[];
  start_date: string;
  end_date: string;
  total_leads: number;
  uploaded_leads: number;
  pending_leads: number;
  completed_batches: number;
  next_execution_at: string | null;
  last_executed_at: string | null;
  total_files_uploaded: number;
  column_mapping?: any;
  created_at: string;
  campaigns?: { name: string } | null;
  organizations?: { id: string; company_name: string } | null;
}

export default function PilotLeadListPage() {
  const router = useRouter();
  const { user, mounted, loading: authLoading } = useUser();

  const [workflows, setWorkflows] = useState<LeadPilotWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Organizations filter state for Level 1 user
  const [organizations, setOrganizations] = useState<{ id: string; company_name: string }[]>([]);
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('all');

  // Modals state
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [appendWorkflow, setAppendWorkflow] = useState<LeadPilotWorkflow | null>(null);

  // Authorization check (Level 1 and Level 2 only)
  const isL1 = useMemo(() => {
    if (!user) return false;
    const level = getUserDashboardLevel(user);
    const role = (user.role || '').toLowerCase().trim();
    const designation = (user.designation || '').toLowerCase().trim();
    return level === DashboardLevel.LEVEL_1_ADMIN || (!user.isClient && (role === 'superadmin' || role === 'super_admin' || designation === 'ceo'));
  }, [user]);

  const isL2 = useMemo(() => {
    if (!user) return false;
    const level = getUserDashboardLevel(user);
    const designation = (user.designation || '').toLowerCase().trim();
    return level === DashboardLevel.LEVEL_2_CLIENT_CEO || (user.isClient === true && designation === 'ceo');
  }, [user]);

  const isAuthorized = isL1 || isL2;

  // Load organizations if Level 1
  useEffect(() => {
    if (isL1) {
      fetchOrganizations();
    }
  }, [isL1]);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, company_name')
        .order('company_name', { ascending: true });
      if (error) throw error;
      setOrganizations(data || []);
    } catch (e) {
      console.error('Failed to load organizations:', e);
    }
  };

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
      fetchWorkflows();
    }
  }, [mounted, authLoading, user, isAuthorized, selectedOrgFilter]);

  const fetchWorkflows = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from('leadpilot')
        .select('*, campaigns(name), organizations(id, company_name)')
        .order('created_at', { ascending: false });

      if (isL1) {
        // Level 1 users can view all organizations or filter by specific organization
        if (selectedOrgFilter !== 'all') {
          query = query.eq('organization_id', selectedOrgFilter);
        }
      } else if (user.isClient && user.organization_id) {
        // Client users (Level 2+) only see their own organization
        query = query.eq('organization_id', user.organization_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setWorkflows((data as any[]) || []);
    } catch (err: any) {
      console.error('Failed to fetch leadpilot workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (wf: LeadPilotWorkflow) => {
    const isCurrentlyActive = wf.status === 'scheduled' || wf.status === 'running';
    const newStatus = isCurrentlyActive ? 'paused' : 'scheduled';

    try {
      let nextExec = wf.next_execution_at;
      if (!isCurrentlyActive) {
        // Resuming: recompute next_execution_at
        const { data: recomputed } = await supabase.rpc(
          'calculate_leadpilot_next_execution',
          {
            p_batch_times: wf.batch_times || ['10:00', '13:00', '17:00'],
            p_pause_days: wf.pause_days || [],
            p_start_date: wf.start_date,
            p_end_date: wf.end_date,
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
        .eq('id', wf.id);

      if (error) throw error;
      fetchWorkflows();
    } catch (err: any) {
      alert(err.message || 'Failed to update workflow status.');
    }
  };

  const handleDeleteWorkflow = async (wf: LeadPilotWorkflow) => {
    const confirm = window.confirm(
      `Are you sure you want to cancel workflow "${wf.name}"?\n\nFuture scheduled batches will be cancelled. Already uploaded leads in the CRM will be preserved.`
    );
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from('leadpilot')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', wf.id);

      if (error) throw error;

      // Also cancel pending staged rows
      await supabase
        .from('lead_sheduled')
        .update({ upload_status: 'cancelled' })
        .eq('pilotlead_id', wf.id)
        .eq('upload_status', 'pending');

      fetchWorkflows();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel workflow.');
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

  // Filtered workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.source_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.campaigns?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.organizations?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? w.status === 'scheduled' || w.status === 'running'
          : w.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workflows, searchQuery, statusFilter]);

  // Overall metrics
  const metrics = useMemo(() => {
    const totalWfs = workflows.length;
    const activeWfs = workflows.filter((w) => w.status === 'scheduled' || w.status === 'running').length;
    const totalIngested = workflows.reduce((acc, w) => acc + (w.uploaded_leads || 0), 0);
    const totalPending = workflows.reduce((acc, w) => acc + (w.pending_leads || 0), 0);
    return { totalWfs, activeWfs, totalIngested, totalPending };
  }, [workflows]);

  if (!mounted || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Loading LeadPilot...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>LeadPilot Workflows | TFC Connect</title>
      </Head>

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 max-w-[1400px]">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1.5">
              <Link href="/workflow" className="hover:text-[#4b33e8] transition-colors">
                Workflows
              </Link>
              <span>/</span>
              <span className="text-[#4b33e8]">LeadPilot</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#263238] flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span>LeadPilot Scheduled Uploads</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#4b33e8]/10 text-[#4b33e8]">
                {metrics.activeWfs} Active
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#787E9D] mt-1">
              Automated, micro-batch lead distribution scheduled across active campaigns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateWizard(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4b33e8] to-[#7962ff] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#4b33e8]/20 flex items-center gap-2"
            >
              <i className="fi flex fi-rr-plus text-xs"></i>
              <span>Add Bulk Upload</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Workflows</span>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                <i className="fi flex fi-rr-branching text-sm"></i>
              </div>
            </div>
            <div className="text-2xl font-black text-[#263238]">{metrics.totalWfs}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">{metrics.activeWfs} currently scheduled</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-emerald-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Ingested</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <i className="fi flex fi-rr-check text-sm"></i>
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">{metrics.totalIngested.toLocaleString()}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Promoted to live campaigns</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-[#4b33e8] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Staged</span>
              <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 flex items-center justify-center text-[#4b33e8]">
                <i className="fi flex fi-rr-clock-three text-sm"></i>
              </div>
            </div>
            <div className="text-2xl font-black text-[#4b33e8]">{metrics.totalPending.toLocaleString()}</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Queued for upcoming batches</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Background Engine</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <i className="fi flex fi-rr-settings text-sm"></i>
              </div>
            </div>
            <div className="text-base font-black text-gray-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              pg_cron 1-Min
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">100% Autonomous Backend</p>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-none flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-72">
              <i className="fi flex fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search workflow, campaign, org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black font-medium placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#4b33e8] focus:ring-4 focus:ring-[#4b33e8]/10 transition-all"
              />
            </div>

            {/* Level 1: Organization Filter Dropdown */}
            {isL1 && (
              <div className="w-full sm:w-56">
                <CustomSelect
                  value={selectedOrgFilter}
                  onChange={(val) => setSelectedOrgFilter(val)}
                  options={[
                    { value: 'all', label: '🏢 All Organizations', badge: `${workflows.length}` },
                    ...organizations.map((org) => ({
                      value: org.id,
                      label: org.company_name,
                      icon: 'fi-rr-building',
                    })),
                  ]}
                  size="sm"
                  placeholder="Filter by Organization"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
              Status:
            </span>
            <div className="flex rounded-xl bg-gray-100 p-1 w-full sm:w-auto text-xs">
              {['all', 'active', 'paused', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                    statusFilter === tab
                      ? 'bg-white text-[#4b33e8] shadow-none'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workflows Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-none overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-[#4b33e8] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-gray-400 font-bold">Loading workflow instances...</p>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fi flex fi-rr-rocket-lunch"></i>
              </div>
              <h3 className="text-base font-bold text-gray-700">No LeadPilot Workflows Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
                {searchQuery || statusFilter !== 'all' || selectedOrgFilter !== 'all'
                  ? 'No workflows match the applied filter criteria.'
                  : 'Start by creating your first scheduled bulk upload workflow to distribute leads into campaigns.'}
              </p>
              <button
                onClick={() => setShowCreateWizard(true)}
                className="px-5 py-2.5 rounded-xl bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold uppercase tracking-wider shadow-none cursor-pointer"
              >
                + Create Bulk Upload
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Workflow & Campaign</th>
                    {isL1 && <th className="py-3.5 px-5">Organization</th>}
                    <th className="py-3.5 px-5">Progress</th>
                    <th className="py-3.5 px-5">Schedule</th>
                    <th className="py-3.5 px-5">Next Execution (IST)</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredWorkflows.map((wf) => {
                    const isRunning = wf.status === 'scheduled' || wf.status === 'running';
                    const isCompleted = wf.status === 'completed';
                    const isPaused = wf.status === 'paused';
                    const percent = wf.total_leads > 0 ? Math.round((wf.uploaded_leads / wf.total_leads) * 100) : 0;

                    return (
                      <tr key={wf.id} className="hover:bg-gray-50/60 transition-colors group">
                        {/* Name & Campaign */}
                        <td className="py-4 px-5">
                          <div className="flex flex-col">
                            <Link
                              href={`/workflow/pilotlead/${wf.id}`}
                              className="font-bold text-sm text-[#263238] group-hover:text-[#4b33e8] transition-colors line-clamp-1"
                            >
                              {wf.name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {wf.source_id}
                              </span>
                              <span className="text-[11px] text-[#787E9D] flex items-center gap-1">
                                <i className="fi flex fi-rr-bullhorn text-[10px]"></i>
                                {wf.campaigns?.name || 'General Campaign'}
                              </span>
                              {wf.total_files_uploaded > 1 && (
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                                  {wf.total_files_uploaded} Files
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Organization (for Level 1 user) */}
                        {isL1 && (
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-1.5 font-semibold text-xs text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg w-fit">
                              <i className="fi flex fi-rr-building text-[11px] text-purple-600"></i>
                              <span>{wf.organizations?.company_name || '—'}</span>
                            </div>
                          </td>
                        )}

                        {/* Progress */}
                        <td className="py-4 px-5 min-w-[170px]">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span className="text-[#263238]">
                              {wf.uploaded_leads.toLocaleString()} / {wf.total_leads.toLocaleString()}
                            </span>
                            <span className="text-[#4b33e8]">{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#4b33e8] to-[#7962ff] h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {wf.pending_leads.toLocaleString()} pending in queue
                          </span>
                        </td>

                        {/* Schedule */}
                        <td className="py-4 px-5">
                          <div className="text-gray-700 font-bold">
                            {wf.batches_per_day} Batches / Day
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {wf.batch_size} leads/batch • {wf.completed_batches} done
                          </div>
                        </td>

                        {/* Next Execution */}
                        <td className="py-4 px-5">
                          {isRunning ? (
                            <div>
                              <div className="text-gray-800 font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {formatIST(wf.next_execution_at)}
                              </div>
                              <span className="text-[10px] text-gray-400">
                                {wf.pause_days?.length > 0 ? `Pauses: ${wf.pause_days.join(', ')}` : 'Daily'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              {isCompleted ? 'Completed' : isPaused ? 'Paused' : 'Inactive'}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
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
                                isRunning ? 'bg-emerald-500' : isPaused ? 'bg-amber-500' : isCompleted ? 'bg-blue-500' : 'bg-gray-400'
                              }`}
                            ></span>
                            {wf.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Append Leads Button */}
                            <button
                              onClick={() => setAppendWorkflow(wf)}
                              title="Upload More Leads into this workflow"
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#4b33e8] text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <i className="fi flex fi-rr-cloud-upload"></i>
                              <span>Upload</span>
                            </button>

                            {/* Pause / Resume Switch */}
                            {!isCompleted && wf.status !== 'cancelled' && (
                              <button
                                onClick={() => handleToggleStatus(wf)}
                                title={isRunning ? 'Pause Workflow' : 'Resume Workflow'}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isRunning
                                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                <i className={`fi flex ${isRunning ? 'fi-rr-pause' : 'fi-rr-play'} text-xs`}></i>
                              </button>
                            )}

                            {/* View Dashboard */}
                            <Link
                              href={`/workflow/pilotlead/${wf.id}`}
                              title="Open Workflow Dashboard"
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-[#4b33e8] text-gray-500 hover:text-white flex items-center justify-center transition-colors"
                            >
                              <i className="fi flex fi-rr-arrow-right text-xs"></i>
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteWorkflow(wf)}
                              title="Cancel Workflow"
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                            >
                              <i className="fi flex fi-rr-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 4-Step Creation Wizard Modal */}
      {showCreateWizard && (
        <CreateWorkflowWizardModal
          show={showCreateWizard}
          organizationId={
            user?.organization_id ||
            (selectedOrgFilter !== 'all' ? selectedOrgFilter : organizations[0]?.id || '')
          }
          isL1User={isL1}
          organizations={organizations}
          onClose={() => setShowCreateWizard(false)}
          onSuccess={(newId) => {
            setShowCreateWizard(false);
            fetchWorkflows();
            router.push(`/workflow/pilotlead/${newId}?firstUpload=true`);
          }}
        />
      )}

      {/* Append Leads Modal */}
      {appendWorkflow && (
        <AppendLeadsModal
          show={Boolean(appendWorkflow)}
          workflow={appendWorkflow}
          onClose={() => setAppendWorkflow(null)}
          onSuccess={() => {
            setAppendWorkflow(null);
            fetchWorkflows();
          }}
        />
      )}
    </>
  );
}
