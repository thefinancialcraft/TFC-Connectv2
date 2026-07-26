import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
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
    <>
      <Head>
        <title>System Logs | TFC Connect</title>
      </Head>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Page Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                System Logs
              </h1>
              <p
                className="text-sm sm:text-base"
                style={{
                  color: "#787E9D",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Track file uploads and live lead distributions
              </p>
            </div>
            
            <button 
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-indigo-50 hover:bg-indigo-100 text-[#4b33e8] border border-indigo-100 font-bold text-xs rounded-xl transition-all uppercase tracking-widest"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              <i className={`fi fi-rr-refresh flex text-sm ${loading ? 'animate-spin' : ''}`}></i>
              Refresh Logs
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Tile 1: Total Uploads */}
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
                <i className="fi flex fi-rr-upload text-5xl sm:text-6xl" style={{ color: "#4b33e8" }}></i>
              </div>
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
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
                    Total Uploads
                  </p>
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl">
                    <i className="fi flex fi-rr-upload text-lg sm:text-xl" style={{ color: "#4b33e8" }}></i>
                  </div>
                </div>
                <div className="mt-auto">
                  <p
                    className="text-3xl sm:text-4xl font-semibold"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {logs.length}
                  </p>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Files Uploaded
                  </p>
                </div>
              </div>
            </div>

            {/* Tile 2: Total Imported Leads */}
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
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-100/30 blur-2xl" />
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-emerald-200/20 blur-xl" />
              <div className="absolute -right-2 -bottom-2 opacity-5">
                <i className="fi flex fi-rr-users text-5xl sm:text-6xl" style={{ color: "#10b981" }}></i>
              </div>
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
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
                    Imported Leads
                  </p>
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl">
                    <i className="fi flex fi-rr-users text-lg sm:text-xl" style={{ color: "#10b981" }}></i>
                  </div>
                </div>
                <div className="mt-auto">
                  <p
                    className="text-3xl sm:text-4xl font-semibold"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {logs.reduce((acc, curr) => acc + curr.total_leads, 0)}
                  </p>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Total Leads Count
                  </p>
                </div>
              </div>
            </div>

            {/* Tile 3: Duplicate Leads */}
            <div
              className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md"
              style={{ backgroundColor: "white" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(245, 158, 11, 0.08), transparent 60%)",
                }}
              />
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-100/30 blur-2xl" />
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-amber-200/20 blur-xl" />
              <div className="absolute -right-2 -bottom-2 opacity-5">
                <i className="fi flex fi-rr-copy text-5xl sm:text-6xl" style={{ color: "#f59e0b" }}></i>
              </div>
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
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
                    Duplicate Leads
                  </p>
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl">
                    <i className="fi flex fi-rr-copy text-lg sm:text-xl" style={{ color: "#f59e0b" }}></i>
                  </div>
                </div>
                <div className="mt-auto">
                  <p
                    className="text-3xl sm:text-4xl font-semibold"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {logs.reduce((acc, curr) => acc + curr.duplicate_leads, 0)}
                  </p>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Duplicates Removed
                  </p>
                </div>
              </div>
            </div>

            {/* Tile 4: Active Database Sources */}
            <div
              className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 backdrop-blur flex flex-col text-white hover:shadow-md"
              style={{ backgroundColor: "#4b33e8" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)",
                }}
              />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
              <div className="absolute -right-2 -bottom-2 opacity-10">
                <i className="fi flex fi-rr-dashboard text-5xl sm:text-6xl text-white"></i>
              </div>
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "25px 25px",
                }}
              />
              <div className="relative flex flex-col h-full z-10">
                <div className="flex items-start justify-between mb-auto">
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{
                      color: "#ffffff",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Database Sources
                  </p>
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-lg">
                    <i className="fi flex fi-rr-dashboard text-lg sm:text-xl" style={{ color: "#ffffff" }}></i>
                  </div>
                </div>
                <div className="mt-auto">
                  <p
                    className="text-3xl sm:text-4xl font-semibold"
                    style={{
                      color: "#ffffff",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {new Set(logs.map(l => l.source_id)).size}
                  </p>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Active Sources count
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Table Section */}
          <div className="mt-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              {/* Table Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2
                    className="text-lg font-bold mb-1"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    All Upload Logs
                  </h2>
                  <p
                    className="text-xs"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    Showing {paginatedLogs.length} of {filteredLogs.length} upload records
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="relative w-64 text-gray-800">
                    <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                      type="text"
                      placeholder="Search file name or source ID..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent font-medium"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    />
                  </div>
                </div>
              </div>

              {/* Table Content */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
                  <p className="text-xs text-gray-400 font-bold">Loading upload logs...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest rounded-xl">
                  {error}
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100/50 mb-4">
                    <i className="fi fi-rr-box-open text-gray-300 text-2xl"></i>
                  </div>
                  <h4 className="text-gray-400 font-black text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>No Logs Found</h4>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "'Roboto', sans-serif" }}>No bulk files have been uploaded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          Uploaded At
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          Source Name (File)
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          Source ID
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          Campaign
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          Organization
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                          Total Leads
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                          Duplicates
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                          Active CRM
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                          Rejected
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                          Closed
                        </th>
                        <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedLogs.map((log) => {
                        const sCounts = counts[log.source_id] || { active_count: 0, rejected_count: 0, closed_count: 0 };
                        return (
                          <tr 
                            key={log.id} 
                            className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0"
                          >
                            <td className="px-4 py-4 font-mono text-[10px] text-gray-400">
                              {formatDisplayDate(log.created_at)}
                            </td>
                            <td className="px-4 py-4">
                              <Link
                                href={`/portal/system-logs/${log.source_id}`}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline break-all max-w-xs block cursor-pointer"
                                style={{
                                  fontFamily: "'Poppins', sans-serif",
                                }}
                              >
                                {log.source_name}
                              </Link>
                            </td>
                            <td className="px-4 py-4 text-xs font-semibold text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-[10px]">
                                {log.source_id}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs font-medium text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
                              {log.campaigns?.name || "N/A"}
                            </td>
                            <td className="px-4 py-4 text-xs font-medium text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
                              {log.organizations?.company_name || "N/A"}
                            </td>
                            <td className="px-4 py-4 text-center font-bold text-gray-800 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {log.total_leads}
                            </td>
                            <td className="px-4 py-4 text-center text-amber-600 text-xs font-semibold" style={{ fontFamily: "'Roboto', sans-serif" }}>
                              {log.duplicate_leads}
                            </td>
                            <td className="px-4 py-4 text-center text-indigo-600 font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {sCounts.active_count}
                            </td>
                            <td className="px-4 py-4 text-center text-amber-600 font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {sCounts.rejected_count}
                            </td>
                            <td className="px-4 py-4 text-center text-emerald-600 font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {sCounts.closed_count}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                onClick={() => handleDeleteLeads(log.source_id)}
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center justify-center ml-auto"
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
                <div className="mt-6 flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
