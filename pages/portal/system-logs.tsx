import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";

interface SystemLog {
  id: string;
  source_name: string;
  source_id: string;
  total_leads: number;
  duplicate_leads: number;
  created_at: string;
  organization_id: string | null;
  campaign_id: string | null;
  created_by: string | null;
  campaigns?: { name: string } | null;
  organizations?: { company_name: string } | null;
}


interface LeadCounts {
  source_id: string;
  active_count: number;
  rejected_count: number;
  closed_count: number;
}

export default function SystemLogs() {
  const router = useRouter();
  const { user, mounted } = useUser();

  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [counts, setCounts] = useState<Record<string, LeadCounts>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Authorization Guard
  useEffect(() => {
    if (mounted) {
      if (!user) {
        router.push("/login");
        return;
      }
      const designation = user.designation?.toLowerCase() || "";
      const isClientCEO = user.isClient === true && designation === "ceo";
      const isDeveloper = designation === "developer";
      const isInternalAdmin = user.isClient === false && (user.role === 'admin' || user.role === 'super_admin');
      
      const isAllowed = isClientCEO || isDeveloper || isInternalAdmin;
      if (!isAllowed) {
        router.push("/portal/dashboard");
      }
    }
  }, [user, mounted, router]);

  // Fetch System Logs
  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      let query = supabase
        .from("system_logs")
        .select("*, campaigns(name), organizations(company_name)")
        .order("created_at", { ascending: false });

      if (user.isClient && user.organization_id) {
        query = query.eq("organization_id", user.organization_id);
      }

      const { data: logsData, error: logsError } = await query;
      if (logsError) throw logsError;

      const fetchedLogs = logsData || [];
      setLogs(fetchedLogs);

      // Fetch dynamic lead counts for the unique source IDs
      const uniqueSourceIds = Array.from(new Set(fetchedLogs.map(l => l.source_id).filter(Boolean)));
      if (uniqueSourceIds.length > 0) {
        const { data: countsData, error: countsError } = await supabase
          .rpc("get_lead_counts_by_sources", { p_source_ids: uniqueSourceIds });
        
        if (countsError) throw countsError;

        const countsMap: Record<string, LeadCounts> = {};
        (countsData || []).forEach((row: any) => {
          countsMap[row.source_id] = {
            source_id: row.source_id,
            active_count: parseInt(row.active_count) || 0,
            rejected_count: parseInt(row.rejected_count) || 0,
            closed_count: parseInt(row.closed_count) || 0
          };
        });
        setCounts(countsMap);
      }
    } catch (err: any) {
      console.error("Error fetching logs:", err);
      setError(err.message || "Failed to load system logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLeads = async (sourceId: string) => {
    const confirmation = window.confirm(
      `Are you sure you want to delete all leads associated with Source ID "${sourceId}"?\n\nThis will permanently delete these leads from Active CRM, Rejected leads, Closed deals, and delete this log entry. This action cannot be undone.`
    );
    if (!confirmation) return;

    try {
      const { error: deleteError } = await supabase.rpc("delete_leads_by_source_id", {
        p_source_id: sourceId
      });
      if (deleteError) throw deleteError;

      alert(`Successfully deleted all records associated with Source ID "${sourceId}".`);
      fetchLogs(); // Reload logs
    } catch (err: any) {
      console.error("Error deleting leads:", err);
      alert(err.message || "Failed to delete leads.");
    }
  };

  useEffect(() => {
    if (mounted && user) {
      fetchLogs();
    }
  }, [user, mounted]);

  // Filter logs by search query (file name or source id)
  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter(log => 
      log.source_name.toLowerCase().includes(query) ||
      log.source_id.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * logsPerPage;
    return filteredLogs.slice(startIndex, startIndex + logsPerPage);
  }, [filteredLogs, currentPage]);

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!mounted || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
        <p className="text-xs text-gray-400 font-bold">Verifying authorization...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            System Logs
          </h1>
          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mt-1">
            Track file uploads and live lead distributions
          </p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center justify-center gap-2 h-10 px-4 bg-indigo-50 hover:bg-indigo-100 text-[#4b33e8] border border-indigo-100 font-bold text-xs rounded-xl transition-all uppercase tracking-widest"
        >
          <i className={`fi fi-rr-refresh flex text-sm ${loading ? 'animate-spin' : ''}`}></i>
          Refresh Logs
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4b33e8] flex items-center justify-center">
            <i className="fi fi-rr-upload text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Uploads</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">{logs.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <i className="fi fi-rr-users text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Imported Leads</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {logs.reduce((acc, curr) => acc + curr.total_leads, 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <i className="fi fi-rr-copy text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duplicate Leads</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {logs.reduce((acc, curr) => acc + curr.duplicate_leads, 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#4b33e8]/5 text-[#4b33e8] flex items-center justify-center">
            <i className="fi fi-rr-dashboard text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Database Sources</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {new Set(logs.map(l => l.source_id)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <input 
              type="text" 
              placeholder="Search file name or source ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-100 text-xs rounded-xl focus:bg-white focus:border-[#4b33e8]/30 outline-none transition-all placeholder:text-gray-300 font-bold uppercase tracking-wider"
            />
            <i className="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
            Showing {paginatedLogs.length} of {filteredLogs.length} Upload Logs
          </span>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
            <p className="text-xs text-gray-400 font-bold">Loading upload logs...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest">
            {error}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100/50 mb-4">
              <i className="fi fi-rr-box-open text-gray-300 text-2xl"></i>
            </div>
            <h4 className="text-gray-400 font-black text-sm mb-1">No Logs Found</h4>
            <p className="text-xs text-gray-400">No bulk files have been uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Uploaded At</th>
                  <th className="px-6 py-4">Source Name (File)</th>
                  <th className="px-6 py-4">Source ID</th>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4 text-center">Total Leads</th>
                  <th className="px-6 py-4 text-center">Duplicates</th>
                  <th className="px-6 py-4 text-center text-indigo-600 bg-indigo-50/20">Active CRM</th>
                  <th className="px-6 py-4 text-center text-amber-600 bg-amber-50/20">Rejected</th>
                  <th className="px-6 py-4 text-center text-emerald-600 bg-emerald-50/20">Closed</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600 font-semibold">
                {paginatedLogs.map((log) => {
                  const sCounts = counts[log.source_id] || { active_count: 0, rejected_count: 0, closed_count: 0 };
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-400">
                        {formatDisplayDate(log.created_at)}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 break-all max-w-xs">
                        {log.source_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-[10px]">
                          {log.source_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        {log.campaigns?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        {log.organizations?.company_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800 text-sm">
                        {log.total_leads}
                      </td>
                      <td className="px-6 py-4 text-center text-amber-600">
                        {log.duplicate_leads}
                      </td>
                      <td className="px-6 py-4 text-center text-indigo-600 font-bold bg-indigo-50/10">
                        {sCounts.active_count}
                      </td>
                      <td className="px-6 py-4 text-center text-amber-600 font-bold bg-amber-50/10">
                        {sCounts.rejected_count}
                      </td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-bold bg-emerald-50/10">
                        {sCounts.closed_count}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteLeads(log.source_id)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center justify-center mx-auto"
                          title="Delete all leads associated with this Source ID"
                        >
                          <i className="fi fi-rr-trash flex text-sm"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              Previous
            </button>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
