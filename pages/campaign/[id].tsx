
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../../lib/authService";
import { supabase } from "../../lib/supabase";
import { getStoredUserData, storeUserData } from "../../lib/localStorageUtils";
import { useCallSessionRedirect } from "../../hooks/useCallSessionRedirect";
import BottomNav from "../../components/BottomNav";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, 
    PieChart, Pie, Legend
} from 'recharts';
import ImportCustomersModal from "../../components/ImportCustomersModal";

interface Campaign {
    id: string;
    name: string | null;
    description: string | null;
    status: string | null;
    created_at: string | null;
    created_by?: string | null;
    employee_id?: string | null;
    talktime?: string | null;
    total_dials?: number | null;
    users?: { id: string, name: string, email: string, employee_id?: string }[];
    organization_id?: string | null;
    organizations?: { id: string, company_name: string, org_code: string } | null;
}

interface CampaignStats {
    totalCustomers: number;
    followupCount: number;
    overdueCount: number;
    freshProspects: number;
    upcomingProspects: number;
    recentCount: number;
    managedCount: number;
}

interface AnalyticsData {
    hourly_calls: { hour: number; count: number }[];
    agent_performance: { name: string; employee_id: string; calls: number; duration: number }[];
    disposition_stats: { name: string; value: number }[];
    hourly_detailed: { 
        hour: number; 
        total_calls: number; 
        connected_calls: number; 
        outgoing_calls: number; 
        incoming_calls: number; 
        missed_calls: number; 
        total_duration: number; 
    }[];
    caller_performance: {
        caller: string;
        employee_id: string;
        total_calls: number;
        connected_calls: number;
        outgoing_calls: number;
        incoming_calls: number;
        missed_calls: number;
        total_duration: number;
    }[];
}

const COLORS = ['#4b33e8', '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#775DD0'];

export default function CampaignDetails() {
    const router = useRouter();
    const { id } = router.query;

    const [user, setUser] = useState<UserProfile | null>(() => {
        const cachedData = getStoredUserData();
        if (cachedData) {
            return {
                uid: cachedData.user_id || '',
                displayName: cachedData.user_name || cachedData.displayName || null,
                email: cachedData.email || '',
                phone: null,
                providers: [],
                providerType: null,
                createdAt: '',
                lastSignInAt: null,
                employeeId: cachedData.employee_id || null,
                role: cachedData.role || null,
                approvalStatus: null,
                accountStatus: null,
                updatedAt: null,
                profilePicUrl: cachedData.profile_pic_url || null,
            };
        }
        return null;
    });
    
    useCallSessionRedirect(user?.uid);

    const [loading, setLoading] = useState(true);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [stats, setStats] = useState<CampaignStats>({
        totalCustomers: 0,
        followupCount: 0,
        overdueCount: 0,
        freshProspects: 0,
        upcomingProspects: 0,
        recentCount: 0,
        managedCount: 0
    });
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        hourly_calls: [],
        agent_performance: [],
        disposition_stats: [],
        hourly_detailed: [],
        caller_performance: []
    });
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [leads, setLeads] = useState<any[]>([]);
    const [recentCalls, setRecentCalls] = useState<any[]>([]);
    const [overdueLeads, setOverdueLeads] = useState<any[]>([]);
    const [upcomingLeads, setUpcomingLeads] = useState<any[]>([]);
    const [managedLeads, setManagedLeads] = useState<any[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [expandedChart, setExpandedChart] = useState<'hourly' | 'users' | null>(null);
    const [campaignStats, setCampaignStats] = useState({ talkTime: '0h 0m', totalDials: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(10);
    const [totalLeadsCount, setTotalLeadsCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [showImportModal, setShowImportModal] = useState(false);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            return `${day}/${month}/${year}`;
        } catch (e) {
            return '—';
        }
    };

    const fetchAuth = async () => {
        const result = await checkAuthAndFetchProfile();
        if (result.shouldRedirect) {
            router.push("/login");
            return;
        }
        if (result.user) {
            setUser(result.user);
        }
    };

    const fetchCampaignData = async () => {
        if (!id) return;

        try {
            setLoading(true);

            // 1. Fetch Campaign Details with organization
            const { data: cRows, error: campaignError } = await supabase
                .from('campaigns')
                .select('*, organizations(id, company_name, org_code)')
                .eq('id', id)
                .limit(1);

            const campaignData = cRows ? cRows[0] : null;

            if (campaignError) throw campaignError;
            setCampaign(campaignData);

            const now = new Date().toISOString();

            // 2. Fetch Stats
            // Total Customers
            const { count: totalCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id);

            // Follow-up Count
            const { count: followupCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id)
                .eq('status', 'followup');

            // Overdue Count (Followup + Expiry Date < Now)
            const { count: overdueCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id)
                .eq('status', 'followup')
                .lt('expiry_date', now);

            // Fresh Prospects (Not assigned to any user)
            const { count: freshCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id)
                .is('assigned_to', null);

            // Upcoming Prospects (Followup + Expiry Date >= Now)
            const { count: upcomingCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id)
                .eq('status', 'followup')
                .gte('expiry_date', now);

            // Recent Activity Count (Last 24h)
            const twentyFourHoursAgoCount = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { count: recentCount } = await supabase
                .from('call_logs')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id)
                .gte('created_at', twentyFourHoursAgoCount);

            // Managed Count (Managed By is not null)
            const { count: managedCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id)
                .not('managed_by', 'is', null);

            setStats({
                totalCustomers: totalCount || 0,
                followupCount: followupCount || 0,
                overdueCount: overdueCount || 0,
                freshProspects: freshCount || 0,
                upcomingProspects: upcomingCount || 0,
                recentCount: recentCount || 0,
                managedCount: managedCount || 0
            });

            // 2.5 Fetch Analytics (RPC)
            // Use Supabase RPC to fetch aggregated analytics data
            // We'll use a simple `any` cast if the type definition isn't updated yet in the library
            const { data: analyticsResult, error: analyticsError } = await supabase
                .rpc('get_campaign_analytics', { campaign_id_input: id });

            if (!analyticsError && analyticsResult) {
                // Ensure data structure matches
                setAnalytics({
                    hourly_calls: analyticsResult.hourly_calls || [],
                    agent_performance: analyticsResult.agent_performance || [],
                    disposition_stats: analyticsResult.disposition_stats || [],
                    hourly_detailed: analyticsResult.hourly_detailed || [],
                    caller_performance: analyticsResult.caller_performance || []
                });
            } else {
                console.error("Analytics fetch error:", analyticsError);
            }

            // 2.6 Fetch Today's Campaign Stats (Talk Time & Total Dials)
            const { data: todayStats } = await supabase
                .from('call_logs')
                .select('duration')
                .eq('campaign_id', id)
                .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

            if (todayStats) {
                const totalDuration = todayStats.reduce((sum, log) => sum + (log.duration || 0), 0);
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor((totalDuration % 3600) / 60);
                setCampaignStats({
                    talkTime: `${hours}h ${minutes}m`,
                    totalDials: todayStats.length
                });
            }

            // 3. Fetch Tile Data (Recent, Overdue, Upcoming)
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            
            // a. Recent Calls (Limit 3)
            const { data: recentData } = await supabase
                .from('call_logs')
                .select(`
                    id, 
                    disposition, 
                    sub_disposition,
                    created_at, 
                    customer_id,
                    customers (customer_name, expiry_date)
                `)
                .eq('campaign_id', id)
                .gte('created_at', twentyFourHoursAgo)
                .order('created_at', { ascending: false })
                .limit(3);
            setRecentCalls(recentData || []);

            // b. Overdue (Limit 3)
            const { data: overdueData } = await supabase
                .from('customers')
                .select('id, customer_name, disposition, sub_disposition, expiry_date')
                .eq('campaign_id', id)
                .eq('status', 'followup')
                .lt('expiry_date', now)
                .order('expiry_date', { ascending: true })
                .limit(3);
            setOverdueLeads(overdueData || []);

            // c. Upcoming (Limit 3)
            const { data: upcomingData } = await supabase
                .from('customers')
                .select('id, customer_name, disposition, sub_disposition, expiry_date')
                .eq('campaign_id', id)
                .eq('status', 'followup')
                .gte('expiry_date', now)
                .order('expiry_date', { ascending: true })
                .limit(3);
            setUpcomingLeads(upcomingData || []);

            // d. Managed Leads (Limit 3)
            const { data: managedData } = await supabase
                .from('customers')
                .select('id, customer_name, managed_by, assigned_to')
                .eq('campaign_id', id)
                .not('managed_by', 'is', null)
                .order('created_at', { ascending: false })
                .limit(3);

            // Fetch manager and agent names for these leads
            let enrichedManagedLeads: any[] = [];
            if (managedData && managedData.length > 0) {
                const userIds = [
                    ...new Set([
                        ...managedData.map((d: any) => d.managed_by),
                        ...managedData.map((d: any) => d.assigned_to)
                    ])
                ].filter(Boolean);
                
                // Fetch profiles where either user_id OR id matches
                const { data: userProfiles } = await supabase
                    .from('user_profiles')
                    .select('id, user_id, user_name, employee_id')
                    .or(`user_id.in.(${userIds.join(',')}),id.in.(${userIds.join(',')})`);
                
                enrichedManagedLeads = managedData.map((lead: any) => {
                    // Resolve Manager
                    const manager = userProfiles?.find((p: any) => p.user_id === lead.managed_by || p.id === lead.managed_by);
                    // Resolve Agent
                    const agent = userProfiles?.find((p: any) => p.user_id === lead.assigned_to || p.id === lead.assigned_to);

                    return {
                        ...lead,
                        manager_name: manager?.user_name || 'Unknown',
                        manager_emp_id: manager?.employee_id || 'N/A',
                        agent_name: agent?.user_name || 'Unassigned',
                        agent_emp_id: agent?.employee_id || '—'
                    };
                });
            }
            setManagedLeads(enrichedManagedLeads);

            // 2. Fetch Leads
            fetchLeads();

        } catch (err: any) {
            console.error("Error fetching campaign details:", err);
            setError(err.message || "Failed to load campaign details");
        } finally {
            setLoading(false);
        }
    };

    const fetchLeads = async (pageOverride?: number) => {
        if (!id) return;
        try {
            setLoadingLeads(true);

            // Use the override if provided (e.g. when search changes), otherwise use state
            const targetPage = pageOverride || currentPage;

            // Build base query for count
            let countQuery = supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id);
            
            if (searchQuery) {
                countQuery = countQuery.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`);
            }

            const { count: totalCount } = await countQuery;
            
            setTotalLeadsCount(totalCount || 0);

            const from = (targetPage - 1) * leadsPerPage;
            const to = from + leadsPerPage - 1;

            // Build base query for data
            let dataQuery = supabase
                .from('customers')
                .select('*')
                .eq('campaign_id', id);

            if (searchQuery) {
                dataQuery = dataQuery.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`);
            }

            const { data, error } = await dataQuery
                .order('expiry_date', { ascending: true })
                .range(from, to);

            if (error) throw error;

            // Fetch assigned user names and last updated by info
            const allUserIds = [
                ...new Set(
                    (data || [])
                        .flatMap((c: any) => [c.assigned_to, c.last_updated_by, c.managed_by])
                        .filter((userId: string | null) => userId)
                ),
            ];

            let userMap: Record<string, {name: string, empId: string}> = {};

            if (allUserIds.length > 0) {
                const { data: userData } = await supabase
                    .from("user_profiles")
                    .select("user_id, user_name, employee_id")
                    .in("user_id", allUserIds);

                if (userData) {
                    userData.forEach((u: any) => {
                        const info = {
                            name: u.user_name || "Unknown",
                            empId: u.employee_id || "N/A"
                        };
                        userMap[u.user_id] = info;
                    });
                }
            }
            
            // Re-fetch with 'id' to be absolutely sure we can map both
            if (allUserIds.length > 0) {
                const { data: userDataById } = await supabase
                    .from("user_profiles")
                    .select("id, user_name, employee_id")
                    .in("id", allUserIds);
                
                if (userDataById) {
                    userDataById.forEach((u: any) => {
                        userMap[u.id] = {
                            name: u.user_name || "Unknown",
                            empId: u.employee_id || "N/A"
                        };
                    });
                }
            }

            const enrichedLeads = (data || []).map((lead: any) => ({
                ...lead,
                // assigned_to mapping
                assigned_user_name: lead.assigned_to ? userMap[lead.assigned_to]?.name : "Unassigned",
                assigned_user_info: lead.assigned_to ? userMap[lead.assigned_to] : null,
                
                // managed_by mapping
                managed_by_name: lead.managed_by ? userMap[lead.managed_by]?.name : "Self",
                managed_by_id: lead.managed_by ? userMap[lead.managed_by]?.empId : null,

                // last_updated_by mapping
                last_updated_by_info: lead.last_updated_by ? userMap[lead.last_updated_by] : null
            }));

            setLeads(enrichedLeads);
        } catch (err: any) {
            console.error("Error fetching leads:", err);
            setLeads([]);
        } finally {
            setLoadingLeads(false);
        }
    };

    useEffect(() => {
        if (!router.isReady) return;
        fetchAuth();
        fetchCampaignData();
    }, [router.isReady, id]);

    // Effect for Page Change (Standard pagination)
    useEffect(() => {
        if (id) fetchLeads();
    }, [id, currentPage]);

    // Handle pagination change
    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
        fetchLeads(newPage);
    };

    // Handle Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchLeads(1);
        }, 500); 
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const toggleSelect = (id: string) => {
        setSelectedLeads(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const pageIds = leads.map(l => l.id);
        const allSelected = pageIds.every(id => selectedLeads.includes(id));
        if (allSelected) {
            setSelectedLeads(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedLeads(prev => [...new Set([...prev, ...pageIds])]);
        }
    };

    const [calling, setCalling] = useState(false);

    const handleStartCalling = async () => {
        if (!id || !user) return;
        
        try {
            setCalling(true);

            // 0. Check for active/pending sessions across ALL campaigns first
            const { data: allSessions } = await supabase
                .from('call_sessions')
                .select('*')
                .eq('user_id', user.uid)
                .in('status', ['active', 'disposition_pending']);

            if (allSessions && allSessions.length > 0) {
                const activeSession = allSessions[0];
                console.log('[Session] Found active session in cross-campaign check, redirecting...', activeSession);
                router.push(`/campaign/${activeSession.campaign_id}/${activeSession.customer_id}`);
                return;
            }

            // 1. Check if user already has a session for THIS campaign
            const { data: campaignSession } = await supabase
                .from('call_sessions')
                .select('*')
                .eq('user_id', user.uid)
                .eq('campaign_id', id)
                .maybeSingle();

            if (campaignSession && campaignSession.status === 'assigned') {
                console.log('[Session] Found existing assigned session for this campaign, resuming...', campaignSession);
                router.push(`/campaign/${campaignSession.campaign_id}/${campaignSession.customer_id}`);
                return;
            }
            
            // 1. Assign Next Lead via RPC
            const { data: leadId, error: rpcError } = await supabase.rpc('assign_next_lead', {
                p_campaign_id: id,
                p_user_id: user.uid
            });

            if (rpcError) throw rpcError;

            if (!leadId) {
                alert("No compatible leads found for assignment.");
                return;
            }

            // 2. Create/Update Call Session
            await supabase
                .from('call_sessions')
                .upsert({
                    user_id: user.uid,
                    campaign_id: id,
                    customer_id: leadId,
                    status: 'assigned',
                    updated_at: new Date().toISOString()
                });

            // 3. Redirect to Lead Page
            if (id && leadId) {
                router.push(`/campaign/${id}/${leadId}`);
            } else {
                throw new Error("Missing campaign ID or lead ID for redirection");
            }
        } catch (err: any) {
            console.error("Error starting call assignment:", err);
            alert(err.message || "Failed to assign lead");
        } finally {
            setCalling(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCampaignData();
        }
    }, [id]);

    const handleLogoutClick = async () => {
        await handleLogout(router);
    };

    if (loading && !campaign) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f6f5f7]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4 border-[#4b33e8]"></div>
                    <p className="text-[#4b33e8] font-medium">Loading Campaign Details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f6f5f7]">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md">
                    <i className="fi flex fi-rr-cross-circle text-4xl text-red-500 mb-4 justify-center"></i>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Occurred</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/campaign')}
                        className="px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition-all"
                    >
                        Back to Campaigns
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full overflow-x-hidden bg-[#f6f5f7]">
            <Sidebar
                user={{
                    displayName: user?.displayName || null,
                    email: user?.email || "",
                    employeeId: user?.employeeId || null,
                    lastSignInAt: user?.lastSignInAt || null,
                    profilePicUrl: user?.profilePicUrl || null,
                }}
                activeNav="campaign"
                onNavChange={() => { }}
                userRole={user?.role || null}
            />

            <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0">
                <Header
                    user={{
                        displayName: user?.displayName || null,
                        email: user?.email || "",
                        employeeId: user?.employeeId || null,
                        profilePicUrl: user?.profilePicUrl || null,
                    }}
                    onLogout={handleLogoutClick}
                />

                <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px] lg:ml-0">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 px-1">
                            <span className="cursor-pointer hover:text-[#4b33e8] transition-colors" onClick={() => router.push('/campaign')}>Campaigns</span>
                            <i className="fi flex fi-rr-angle-small-right text-[10px]"></i>
                            <span className="text-gray-600 font-bold">{campaign?.name}</span>
                        </div>

                        {/* Top Banner */}
                        <div className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 mb-8 group">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"  />
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700">
                                <i className="fi flex fi-rr-megaphone text-9xl"></i>
                            </div>

                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] shadow-sm">
                                            <i className="fi flex fi-rr-megaphone text-xl"></i>
                                        </div>
                                        <div>
                                            <h1 className="text-xl  md:text-xl   font-black text-gray-800" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>
                                                {campaign?.name}
                                            </h1>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${campaign?.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                                                    }`}>
                                                    {campaign?.status}
                                                </span>
                                                <div className="w-1 h-1 rounded-full bg-gray-300 mx-1"></div>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Campaign ID: <span className="text-gray-600">{id}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                                        {campaign?.description || 'No description provided for this campaign.'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                            <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                                <i className="fi flex fi-rr-calendar"></i>
                                            </div>
                                            <span>Created: {campaign?.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                            <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                                <i className="fi flex fi-rr-user"></i>
                                            </div>
                                            <span>Creator: {campaign?.created_by || 'System'} {campaign?.employee_id ? `(#${campaign.employee_id})` : ''}</span>
                                        </div>
                                        {campaign?.organizations && (
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                    <i className="fi flex fi-rr-building"></i>
                                                </div>
                                                <span className="text-blue-600">Org: {campaign.organizations.company_name} {campaign.organizations.org_code ? `(${campaign.organizations.org_code})` : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 items-center self-start lg:self-center">
                                    {/* Talk Time Tile */}
                                    <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm transition-transform hover:scale-110">
                                            <i className="fi flex fi-rr-microphone-alt text-base"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1.5">Talk Time</span>
                                            <span className="text-base font-black text-gray-800 leading-none">{campaignStats.talkTime}</span>
                                        </div>
                                    </div>

                                    {/* Dials Tile */}
                                    <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm transition-transform hover:scale-110">
                                            <i className="fi flex fi-rr-phone-call text-base"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1.5">Total Dials</span>
                                            <span className="text-base font-black text-gray-800 leading-none">{campaignStats.totalDials}</span>
                                        </div>
                                    </div>

                                    {/* Start Calling Tile */}
                                    <button
                                        onClick={handleStartCalling}
                                        disabled={calling}
                                        className={`flex items-center gap-4 px-7 py-4 rounded-2xl border border-white/10 shadow-xl shadow-indigo-200/50 transition-all hover:scale-[1.03] active:scale-95 group/btn relative overflow-hidden h-18 ${calling ? 'opacity-80' : ''}`}
                                        style={{
                                            background: 'linear-gradient(135deg, #4b33e8 0%, #8b5cf6 100%)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                        
                                        <div className="relative z-10 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover/btn:bg-white/30 transition-colors shadow-sm ring-1 ring-white/30">
                                            {calling ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <i className="fi flex fi-rr-play text-sm ml-0.5"></i>
                                            )}
                                        </div>
                                        <div className="relative z-10 flex flex-col items-start translate-y-[1px]">
                                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1.5">{calling ? 'Assigning...' : 'Mission'}</span>
                                            <span className="text-base font-black text-white leading-none">{calling ? 'Finding Lead' : 'Start Calling'}</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                           {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-8">
                            {/* Total Leads */}
                            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(59, 130, 246, 0.12), transparent 60%)" }}></div>
                                <div className="absolute -right-2 -bottom-2">
                                    <i className="fi flex fi-rr-users text-5xl" style={{ color: "#3b82f6", opacity: 0.15 }}></i>
                                </div>
                                <div className="relative flex flex-col h-full z-10">
                                    <div className="flex items-start justify-between mb-auto">
                                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Total Leads</p>
                                    </div>
                                    <div className="mt-auto">
                                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.totalCustomers}</p>
                                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Assigned to campaign</p>
                                    </div>
                                </div>
                            </div>

                            {/* Fresh Prospects */}
                            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(139, 92, 246, 0.12), transparent 60%)" }}></div>
                                <div className="absolute -right-2 -bottom-2">
                                    <i className="fi flex fi-rr-bulb text-5xl" style={{ color: "#8b5cf6", opacity: 0.15 }}></i>
                                </div>
                                <div className="relative flex flex-col h-full z-10">
                                    <div className="flex items-start justify-between mb-auto">
                                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Fresh</p>
                                    </div>
                                    <div className="mt-auto">
                                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.freshProspects}</p>
                                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Not yet assigned</p>
                                    </div>
                                </div>
                            </div>

                            {/* Follow-ups */}
                            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(249, 115, 22, 0.12), transparent 60%)" }}></div>
                                <div className="absolute -right-2 -bottom-2">
                                    <i className="fi flex fi-rr-phone-call text-5xl" style={{ color: "#f97316", opacity: 0.15 }}></i>
                                </div>
                                <div className="relative flex flex-col h-full z-10">
                                    <div className="flex items-start justify-between mb-auto">
                                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Follow-ups</p>
                                    </div>
                                    <div className="mt-auto">
                                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.followupCount}</p>
                                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Pending action</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming */}
                            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(16, 185, 129, 0.12), transparent 60%)" }}></div>
                                <div className="absolute -right-2 -bottom-2">
                                    <i className="fi flex fi-rr-calendar-clock text-5xl" style={{ color: "#10b981", opacity: 0.15 }}></i>
                                </div>
                                <div className="relative flex flex-col h-full z-10">
                                    <div className="flex items-start justify-between mb-auto">
                                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Upcoming</p>
                                    </div>
                                    <div className="mt-auto">
                                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.upcomingProspects}</p>
                                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Scheduled leads</p>
                                    </div>
                                </div>
                            </div>

                            {/* Overdue */}
                            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(185, 22, 16, 0.12), transparent 60%)" }}></div>
                                <div className="absolute -right-2 -bottom-2">
                                    <i className="fi flex fi-rr-time-watch-calendar text-5xl" style={{ color: "#ef4444", opacity: 0.15 }}></i>
                                </div>
                                <div className="relative flex flex-col h-full z-10">
                                    <div className="flex items-start justify-between mb-auto">
                                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Overdue</p>
                                    </div>
                                    <div className="mt-auto">
                                        <p className="text-xl   sm:text-4xl font-semibold text-red-600" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.overdueCount}</p>
                                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-red-400">Past due date</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* ANALYTICS SECTION */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* 1. Hourly Activity (Area Chart) */}
                            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${
                                expandedChart === 'hourly' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'
                            }`}>
                                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <i className="fi fi-rr-chart-histogram text-[#4b33e8]"></i>
                                    Hourly Activity (Today)
                                </h3>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analytics.hourly_calls}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4b33e8" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#4b33e8" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="hour" 
                                                tick={{fontSize: 10, fill: '#9ca3af'}} 
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(tick) => `${tick}:00`}
                                            />
                                            <YAxis hide />
                                            <Tooltip 
                                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                                labelStyle={{color: '#6b7280', fontSize: '10px', fontWeight: 'bold'}}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke="#4b33e8" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorCount)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <button 
                                    onClick={() => setExpandedChart(expandedChart === 'hourly' ? null : 'hourly')}
                                    className="absolute bottom-4 right-4 text-gray-400 hover:text-[#4b33e8] transition-colors p-2 hover:bg-gray-50 rounded-lg"
                                >
                                    <i className={`fi ${expandedChart === 'hourly' ? 'fi-rr-compress' : 'fi-rr-expand'} text-xs`}></i>
                                </button>
                            </div>

                            {/* 2. Agent Performance (Bar Chart) */}
                            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${
                                expandedChart === 'users' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'
                            }`}>
                                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <i className="fi fi-rr-trophy text-yellow-500"></i>
                                    Top Agents (Today)
                                </h3>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                            data={analytics.agent_performance
                                                .filter(row => 
                                                    campaign?.users?.some(u => 
                                                        (u.employee_id && u.employee_id === row.employee_id) || 
                                                        (u.name && u.name.toLowerCase() === row.name.toLowerCase())
                                                    )
                                                )
                                                .slice(0, expandedChart === 'users' ? 20 : 5)} 
                                            layout="vertical"
                                            barSize={12}
                                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                            <XAxis type="number" hide />
                                            <YAxis 
                                                dataKey="name" 
                                                type="category" 
                                                tick={{fontSize: 10, fill: '#4b5563', fontWeight: 600}} 
                                                width={60}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(val) => val.split(' ')[0]} 
                                            />
                                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}}/>
                                            <Bar dataKey="calls" fill="#00C49F" radius={[0, 4, 4, 0]} background={{ fill: '#f9fafb', radius: 4 }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <button 
                                    onClick={() => setExpandedChart(expandedChart === 'users' ? null : 'users')}
                                    className="absolute bottom-4 right-4 text-gray-400 hover:text-[#4b33e8] transition-colors p-2 hover:bg-gray-50 rounded-lg"
                                >
                                    <i className={`fi ${expandedChart === 'users' ? 'fi-rr-compress' : 'fi-rr-expand'} text-xs`}></i>
                                </button>
                            </div>

                            {/* 3. Outcomes (Pie Chart) */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-1 flex flex-col h-[300px]">
                                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <i className="fi fi-rr-pie-chart text-pink-500"></i>
                                    Call Outcomes
                                </h3>
                                <div className="flex-1 w-full min-h-0 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={analytics.disposition_stats}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {analytics.disposition_stats.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{borderRadius: '8px'}} />
                                            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Label */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-14">
                                        <div className="text-center">
                                            <span className="text-xs text-gray-400 font-bold block">TOTAL</span>
                                            <span className="text-xl font-black text-gray-800">
                                                {analytics.disposition_stats.reduce((acc, curr) => acc + curr.value, 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Hourly Analytics Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-8">
                           <div className="p-6 border-b border-gray-50">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fi fi-rr-time-check text-[#4b33e8]"></i>
                                    Hourly Performance Breakdown
                                </h3>
                           </div>
                           <div className="overflow-x-auto">
                               <table className="w-full text-left">
                                   <thead className="bg-[#f9fafb]">
                                       <tr>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hour</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Connected Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Outgoing Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Incoming Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Missed Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Talktime</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-50">
                                       {analytics.hourly_detailed.length > 0 ? (
                                            analytics.hourly_detailed.map((row, index) => (
                                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-700">
                                                        Time - {row.hour % 12 === 0 ? 12 : row.hour % 12} {row.hour >= 12 ? 'pm' : 'am'}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.total_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-green-600">{row.connected_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.outgoing_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.incoming_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-red-500">{row.missed_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                                        {new Date(row.total_duration * 1000).toISOString().substr(11, 8)}
                                                    </td>
                                                </tr>
                                            ))
                                       ) : (
                                           <tr>
                                               <td colSpan={7} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                                                   No data available for today
                                               </td>
                                           </tr>
                                       )}
                                   </tbody>
                               </table>
                           </div>
                        </div>

                        {/* Caller Performance Breakdown Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-8">
                           <div className="p-6 border-b border-gray-50">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <i className="fi fi-rr-headset text-[#4b33e8]"></i>
                                    Caller Performance Breakdown
                                </h3>
                           </div>
                           <div className="overflow-x-auto">
                               <table className="w-full text-left">
                                   <thead className="bg-[#f9fafb]">
                                       <tr>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Caller</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Connected Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Outgoing Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Incoming Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Missed Calls</th>
                                           <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Talktime</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-50">
                                       {analytics.caller_performance.filter(row => 
                                            campaign?.users?.some(u => 
                                                (u.employee_id && u.employee_id === row.employee_id) || 
                                                (u.name && u.name.toLowerCase() === row.caller.toLowerCase())
                                            )
                                        ).length > 0 ? (
                                            analytics.caller_performance
                                                .filter(row => 
                                                    campaign?.users?.some(u => 
                                                        (u.employee_id && u.employee_id === row.employee_id) || 
                                                        (u.name && u.name.toLowerCase() === row.caller.toLowerCase())
                                                    )
                                                )
                                                .map((row, index) => (
                                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-700 capitalize">
                                                        {row.caller}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.total_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-green-600">{row.connected_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.outgoing_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.incoming_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-red-500">{row.missed_calls}</td>
                                                    <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                                        {new Date(row.total_duration * 1000).toISOString().substr(11, 8)}
                                                    </td>
                                                </tr>
                                            ))
                                       ) : (
                                           <tr>
                                               <td colSpan={7} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                                                   No data available for today
                                               </td>
                                           </tr>
                                       )}
                                   </tbody>
                               </table>
                           </div>
                        </div>

                     

                        {/* Call Dashboard Section */}
                        <div className="space-y-6">
                            {/* Top 4 Cards Grid - 2x2 Layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 {/* Recent Calls */}
                                 <div className="bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all">
                                     <div className="absolute inset-0" style={{ background: "#ffffff" }}></div>
                                     <div className="flex items-center justify-between mb-6 relative z-10">
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-[#4b33e8] transition-colors">
                                                 <i className="fi flex fi-rr-time-past text-sm"></i>
                                             </div>
                                             <div>
                                                 <h3 className="font-bold text-gray-800 text-sm italic" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>Recent Calls</h3>
                                                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Last 24 Hours</p>
                                             </div>
                                         </div>
                                         <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-400 border border-gray-100">
                                             {stats.recentCount}
                                         </div>
                                     </div>
                                     <div className="flex-1 flex flex-col relative z-10">
                                         {recentCalls.length === 0 ? (
                                             <div className="flex flex-col items-center justify-center h-full py-8">
                                                 <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2 border border-dashed border-gray-200">
                                                     <i className="fi flex fi-rr-time-past text-gray-300 text-lg"></i>
                                                 </div>
                                                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No recent records</p>
                                             </div>
                                         ) : (
                                             <div className="space-y-3">
                                                 {recentCalls.map((item: any) => (
                                                     <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-200 transition-all group/item">
                                                         <div className="flex flex-col min-w-0 pr-2">
                                                             <span className="text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize">{item.customers?.customer_name || 'Anonymous'}</span>
                                                             <div className="flex flex-col gap-1.5">
                                                                 <div className="flex items-center gap-2 flex-wrap">
                                                                     <span className="text-[9px] font-black text-[#4b33e8] bg-indigo-50 px-2 py-1 rounded inline-block uppercase tracking-tighter">
                                                                         {item.disposition || 'Call'}
                                                                         {item.sub_disposition && ` > ${item.sub_disposition}`}
                                                                     </span>
                                                                     {item.customers?.expiry_date && (
                                                                         <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase tracking-tighter">
                                                                             <i className="fi fi-rr-calendar-check text-[8px]"></i>
                                                                             <span>{formatDate(item.customers.expiry_date)}</span>
                                                                         </div>
                                                                     )}
                                                                 </div>
                                                                 <div className="flex items-center gap-1.5 text-gray-400">
                                                                     <i className="fi fi-rr-clock text-[8px]"></i>
                                                                     <span className="text-[9px] font-bold leading-none">{formatDate(item.created_at)}</span>
                                                                     <span className="text-[8px] font-medium leading-none">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         <button 
                                                             onClick={() => {
                                                                 if (id && item.customer_id) {
                                                                     router.push(`/campaign/${id}/${item.customer_id}`);
                                                                 }
                                                             }}
                                                             className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-gray-100"
                                                         >
                                                             <i className="fi flex fi-rr-phone-call text-[10px]"></i>
                                                         </button>
                                                     </div>
                                                 ))}
                                             </div>
                                         )}
                                     </div>
                                 </div>
 
                                 {/* Overdue Calls */}
                                 <div className="bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all">
                                     <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgb(239, 68, 68) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                     <div className="flex items-center justify-between mb-6 relative z-10">
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                                                 <i className="fi flex fi-rr-pending text-sm"></i>
                                             </div>
                                             <div>
                                                 <h3 className="font-bold text-gray-800 text-sm italic" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>Overdue</h3>
                                                 <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest leading-none mt-1">Action Required</p>
                                             </div>
                                         </div>
                                         <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-[11px] font-black text-white border border-red-600 shadow-lg shadow-red-100">
                                             {stats.overdueCount}
                                         </div>
                                     </div>
                                     <div className="flex-1 flex flex-col relative z-10">
                                         {overdueLeads.length === 0 ? (
                                             <div className="flex flex-col items-center justify-center h-full py-8">
                                                 <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2 border border-red-100">
                                                     <i className="fi flex fi-rr-check opacity-50 text-red-500 text-lg"></i>
                                                 </div>
                                                 <p className="text-[10px] text-red-500 font-black opacity-50 uppercase tracking-widest">All caught up</p>
                                             </div>
                                         ) : (
                                             <div className="space-y-3">
                                                 {overdueLeads.map((item: any) => (
                                                     <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl border border-red-50 bg-red-50/10 hover:bg-white hover:border-red-200 transition-all group/item shadow-[0_0_15px_-10px_rgba(239,68,68,0.2)]">
                                                         <div className="flex flex-col min-w-0 pr-2">
                                                             <span className="text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize">{item.customer_name || 'Anonymous'}</span>
                                                             <div className="flex flex-col gap-1.5">
                                                                 <div className="flex items-center gap-2">
                                                                     <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded inline-block uppercase tracking-tighter">
                                                                         {item.disposition || 'Follow Up'}
                                                                         {item.sub_disposition && ` > ${item.sub_disposition}`}
                                                                     </span>
                                                                 </div>
                                                                 <div className="flex items-center gap-1.5 text-red-400">
                                                                     <i className="fi fi-rr-calendar-clock text-[9px]"></i>
                                                                     <span className="text-[9px] font-bold leading-none">{formatDate(item.expiry_date)}</span>
                                                                     <span className="text-[8px] font-medium leading-none">{item.expiry_date && String(item.expiry_date).includes('T') ? new Date(item.expiry_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No Time'}</span>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         <button 
                                                             onClick={() => router.push(`/campaign/${id}/${item.id}`)}
                                                             className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-red-100"
                                                         >
                                                             <i className="fi flex fi-rr-phone-call text-[10px]"></i>
                                                         </button>
                                                     </div>
                                                 ))}
                                             </div>
                                         )}
                                     </div>
                                 </div>
 
                                 {/* Upcoming Calls */}
                                 <div className="bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all">
                                     <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgb(59, 130, 246) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                     <div className="flex items-center justify-between mb-6 relative z-10">
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                                 <i className="fi flex fi-rr-clock text-sm"></i>
                                             </div>
                                             <div>
                                                 <h3 className="font-bold text-gray-800 text-sm italic" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>Upcoming</h3>
                                                 <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-1">Scheduled Tasks</p>
                                             </div>
                                         </div>
                                         <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-100">
                                             {stats.upcomingProspects}
                                         </div>
                                     </div>
                                     <div className="flex-1 flex flex-col relative z-10">
                                         {upcomingLeads.length === 0 ? (
                                             <div className="flex flex-col items-center justify-center h-full py-8">
                                                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                                                     <i className="fi flex fi-rr-clock text-blue-300 text-lg"></i>
                                                 </div>
                                                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No scheduled tasks</p>
                                             </div>
                                         ) : (
                                             <div className="space-y-3">
                                                 {upcomingLeads.map((item: any) => (
                                                     <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl border border-blue-50 bg-blue-50/10 hover:bg-white hover:border-blue-200 transition-all group/item">
                                                         <div className="flex flex-col min-w-0 pr-2">
                                                             <span className="text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize">{item.customer_name || 'Anonymous'}</span>
                                                             <div className="flex flex-col gap-1.5">
                                                                 <div className="flex items-center gap-2">
                                                                     <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded inline-block uppercase tracking-tighter">
                                                                         {item.disposition || 'Scheduled'}
                                                                         {item.sub_disposition && ` > ${item.sub_disposition}`}
                                                                     </span>
                                                                 </div>
                                                                 <div className="flex items-center gap-1.5 text-blue-400">
                                                                     <i className="fi fi-rr-calendar-clock text-[9px]"></i>
                                                                     <span className="text-[9px] font-bold leading-none">{formatDate(item.expiry_date)}</span>
                                                                     <span className="text-[8px] font-medium leading-none">{item.expiry_date && String(item.expiry_date).includes('T') ? new Date(item.expiry_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No Time'}</span>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         <button 
                                                             onClick={() => router.push(`/campaign/${id}/${item.id}`)}
                                                             className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-blue-100"
                                                         >
                                                             <i className="fi flex fi-rr-phone-call text-[10px]"></i>
                                                         </button>
                                                     </div>
                                                 ))}
                                             </div>
                                         )}
                                     </div>
                                 </div>

                                 {/* Managed By */}
                                 <div className="bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all">
                                     <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgb(20, 184, 166) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                     <div className="flex items-center justify-between mb-6 relative z-10">
                                         <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500">
                                                 <i className="fi flex fi-rr-briefcase text-sm"></i>
                                             </div>
                                             <div>
                                                 <h3 className="font-bold text-gray-800 text-sm italic" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>Managed By</h3>
                                                 <p className="text-[9px] text-teal-400 font-bold uppercase tracking-widest leading-none mt-1">Assigned Leads</p>
                                             </div>
                                         </div>
                                         <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-100">
                                             {stats.managedCount}
                                         </div>
                                     </div>
                                     <div className="flex-1 flex flex-col relative z-10">
                                         {managedLeads.length === 0 ? (
                                             <div className="flex flex-col items-center justify-center h-full py-8">
                                                 <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-2">
                                                     <i className="fi flex fi-rr-user-add text-teal-300 text-lg"></i>
                                                 </div>
                                                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No managed leads</p>
                                             </div>
                                         ) : (
                                             <div className="space-y-3">
                                                 {managedLeads.map((item: any) => (
                                                     <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl border border-teal-50 bg-teal-50/10 hover:bg-white hover:border-teal-200 transition-all group/item">
                                                         <div className="flex flex-col min-w-0 pr-2">
                                                             <span className="text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize">{item.customer_name || 'Anonymous'}</span>
                                                             <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                                 {/* Manager Info */}
                                                                 <div className="flex items-center gap-2">
                                                                     <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded inline-block uppercase tracking-tighter">
                                                                         M: {item.manager_name?.split(' ')[0]}
                                                                     </span>
                                                                     <span className="text-[8px] font-bold text-teal-400">({item.manager_emp_id})</span>
                                                                 </div>
                                                                 {/* Agent Info */}
                                                                 <div className="flex items-center gap-2">
                                                                     <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block uppercase tracking-tighter">
                                                                         A: {item.agent_name?.split(' ')[0]}
                                                                     </span>
                                                                     <span className="text-[8px] font-bold text-indigo-400">({item.agent_emp_id})</span>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                         <button 
                                                             onClick={() => router.push(`/campaign/${id}/${item.id}`)}
                                                             className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-400 hover:bg-teal-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-teal-100"
                                                         >
                                                             <i className="fi flex fi-rr-phone-call text-[10px]"></i>
                                                         </button>
                                                     </div>
                                                 ))}
                                             </div>
                                         )}
                                     </div>
                                 </div>
                            </div>

                            {/* Large Bottom Card: All Leads */}
                            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 min-h-[400px] relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] border border-indigo-100/50 shadow-sm">
                                            <i className="fi flex fi-rr-users text-lg font-bold"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-xl leading-none mb-2" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>All Leads</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] text-gray-400 font-semibold tracking-[0.2em]">Campaign Database • {totalLeadsCount} Records</p>
                                                {selectedLeads.length > 0 && (
                                                    <span className="bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold  animate-in fade-in slide-in-from-left-4 duration-300">
                                                        {selectedLeads.length} Selected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Search Bar */}
                                        <div className="relative group/search min-w-[240px]">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i className="fi fi-rr-search text-gray-400 text-xs group-focus-within/search:text-[#4b33e8] transition-colors"></i>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="SEARCH NAME OR PHONE..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full h-[42px] pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all placeholder:text-gray-300 tracking-widest uppercase"
                                            />
                                        </div>

                                       
                                        

                                        {/* Add Bulk Button */}
                                        <button 
                                            onClick={() => setShowImportModal(true)}
                                            className="flex items-center gap-2 px-6 h-[42px] bg-indigo-50 text-[#4b33e8] border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest"
                                        >
                                            <i className="fi flex fi-rr-upload"></i>
                                            Add Bulk
                                        </button>

                                        {/* Add Lead Button */}
                                        <button className="flex items-center gap-2 px-6 h-[42px] bg-[#4b33e8] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:opacity-90 transition-all uppercase tracking-widest">
                                            <i className="fi flex fi-rr-plus"></i>
                                            Add Lead
                                        </button>
                                    </div>
                                </div>

                                {/* Leads Table */}
                                {loadingLeads ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
                                        <p className="text-xs text-gray-400 font-bold">Fetching leads...</p>
                                    </div>
                                ) : leads.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                                        <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100/50">
                                            <i className="fi flex fi-rr-phone-call text-gray-200 text-3xl"></i>
                                        </div>
                                        <h4 className="text-gray-400 font-black text-sm mb-2">No leads found</h4>
                                        <p className="text-[10px] text-gray-300 font-bold max-w-[200px] text-center">There are no leads assigned to this campaign yet.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto -mx-2">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-50">
                                                    <th className="px-4 py-4 w-10">
                                                        <div className="flex items-center justify-center">
                                                            <input 
                                                                type="checkbox"
                                                                checked={leads.length > 0 && leads.every(l => selectedLeads.includes(l.id))}
                                                                onChange={toggleSelectAll}
                                                                className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                            />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Customer Name</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Contact Info</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">Status</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">Disposition/Sub</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Expiry Date</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Assigned To</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">Manage By</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Last Called</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Last Updated By</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {leads.map((lead) => (
                                                    <tr 
                                                        key={lead.id} 
                                                        onClick={() => {
                                                            if (id && lead.id) {
                                                                router.push(`/campaign/${id}/${lead.id}`);
                                                            }
                                                        }}
                                                        className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0"
                                                    >
                                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex items-center justify-center">
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={selectedLeads.includes(lead.id)}
                                                                    onChange={() => toggleSelect(lead.id)}
                                                                    className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase">
                                                                    {lead.customer_name?.charAt(0) || 'C'}
                                                                </div>
                                                                <span className="text-xs font-medium text-gray-800" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{lead.customer_name || 'Anonymous'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-gray-700 leading-none mb-1">{lead.phone_no || 'No Contact'}</span>
                                                                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Verified Lead</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex justify-center">
                                                                <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                                                                    lead.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                                    lead.status === 'followup' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                                    lead.status === 'closed' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                                    'bg-gray-50 text-gray-600 border border-gray-100'
                                                                }`}>
                                                                    {lead.status === 'closed' && <i className="fi fi-rr-check-circle flex text-[10px]"></i>}
                                                                    {lead.status}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[10px] font-bold text-gray-700 leading-none mb-1">
                                                                    {lead.disposition || 'Fresh'}
                                                                </span>
                                                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                                                                    {lead.sub_disposition || '---'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-indigo-600">{formatDate(lead.expiry_date)}</span>
                                                                {lead.expiry_date && (
                                                                    <span className="text-[8px] text-gray-400 font-medium">
                                                                        {new Date(lead.expiry_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${lead.assigned_user_name === 'Unassigned' ? 'bg-gray-300' : 'bg-indigo-400'}`}></div>
                                                                {lead.assigned_user_info ? (
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-medium text-gray-800 leading-none mb-0.5">
                                                                            {lead.assigned_user_info.name}
                                                                        </span>
                                                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                                                                            ID: {lead.assigned_user_info.empId}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                     <span className="text-[10px] font-medium text-gray-600 uppercase tracking-tighter">
                                                                        {lead.assigned_user_name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <div className="flex flex-col items-center justify-center gap-1">
                                                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50/40 border border-indigo-100/50 backdrop-blur-sm">
                                                                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-tighter">{lead.managed_by_name}</span>
                                                                </div>
                                                                {lead.managed_by_id && (
                                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">ID: {lead.managed_by_id}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-gray-700">{formatDate(lead.last_called_at)}</span>
                                                                {lead.last_called_at && (
                                                                    <span className="text-[8px] text-gray-400 font-medium">
                                                                        {new Date(lead.last_called_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {lead.last_updated_by_info ? (
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-bold text-gray-800 leading-none mb-1">{lead.last_updated_by_info.name}</span>
                                                                    <span className="text-[9px] text-indigo-500 font-black uppercase tracking-tighter">ID: {lead.last_updated_by_info.empId}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-300 italic">No Updates</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination Controls */}
                                {!loadingLeads && totalLeadsCount > 0 && (
                                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                            Showing <span className="text-gray-800">{(currentPage - 1) * leadsPerPage + 1}</span> to <span className="text-gray-800">{Math.min(currentPage * leadsPerPage, totalLeadsCount)}</span> of <span className="text-gray-800">{totalLeadsCount}</span> Leads
                                        </p>
                                        
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                                                    currentPage === 1 
                                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 shadow-sm'
                                                }`}
                                            >
                                                <i className="fi fi-rr-angle-small-left text-lg"></i>
                                            </button>
                                            
                                            <div className="flex items-center gap-1">
                                                {[...Array(Math.ceil(totalLeadsCount / leadsPerPage))].map((_, idx) => {
                                                    const pgNum = idx + 1;
                                                    // Show only few pages if there are many
                                                    if (
                                                        pgNum === 1 || 
                                                        pgNum === Math.ceil(totalLeadsCount / leadsPerPage) || 
                                                        (pgNum >= currentPage - 1 && pgNum <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pgNum}
                                                                onClick={() => setCurrentPage(pgNum)}
                                                                className={`w-10 h-10 rounded-xl text-[11px] font-bold transition-all ${
                                                                    currentPage === pgNum
                                                                    ? 'bg-[#4b33e8] text-white shadow-lg shadow-indigo-100'
                                                                    : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-500'
                                                                }`}
                                                            >
                                                                {pgNum}
                                                            </button>
                                                        );
                                                    } else if (
                                                        (pgNum === currentPage - 2 && pgNum > 1) || 
                                                        (pgNum === currentPage + 2 && pgNum < Math.ceil(totalLeadsCount / leadsPerPage))
                                                    ) {
                                                        return <span key={pgNum} className="text-gray-300 px-1">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalLeadsCount / leadsPerPage)))}
                                                disabled={currentPage === Math.ceil(totalLeadsCount / leadsPerPage)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                                                    currentPage === Math.ceil(totalLeadsCount / leadsPerPage)
                                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 shadow-sm'
                                                }`}
                                            >
                                                <i className="fi fi-rr-angle-small-right text-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Navigation for Mobile */}
            <BottomNav activeNav="campaign" userRole={user?.role || null} />

            {/* Import Customers Modal */}
            <ImportCustomersModal 
                show={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    fetchLeads(1);
                    fetchCampaignData();
                }}
                preselectedOrgId={campaign?.organization_id || ""}
                preselectedCampaignId={id as string}
            />
        </div>
    );
}
