import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../../lib/authService";
import { supabase } from "../../lib/supabase";
import { getStoredUserData, storeUserData } from "../../lib/localStorageUtils";
import BottomNav from "../../components/BottomNav";

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
}

interface CampaignStats {
    totalCustomers: number;
    followupCount: number;
    overdueCount: number;
    freshProspects: number;
    upcomingProspects: number;
}

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

    const [loading, setLoading] = useState(true);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [stats, setStats] = useState<CampaignStats>({
        totalCustomers: 0,
        followupCount: 0,
        overdueCount: 0,
        freshProspects: 0,
        upcomingProspects: 0
    });
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);

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

            // 1. Fetch Campaign Details
            const { data: campaignData, error: campaignError } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (campaignError) throw campaignError;
            setCampaign(campaignData);

            const now = new Date().toISOString().split('T')[0];

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

            // Upcoming Prospects (Active/Upcoming status or Expiry Date >= Now)
            const { count: upcomingCount } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', id)
                .or(`status.eq.upcoming,and(status.eq.active,expiry_date.gte.${now})`);

            setStats({
                totalCustomers: totalCount || 0,
                followupCount: followupCount || 0,
                overdueCount: overdueCount || 0,
                freshProspects: freshCount || 0,
                upcomingProspects: upcomingCount || 0
            });

            // 3. Fetch Leads
            fetchLeads();

        } catch (err: any) {
            console.error("Error fetching campaign details:", err);
            setError(err.message || "Failed to load campaign details");
        } finally {
            setLoading(false);
        }
    };

    const fetchLeads = async () => {
        if (!id) return;
        try {
            setLoadingLeads(true);
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('campaign_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch assigned user names
            const assignedUserIds = [
                ...new Set(
                    (data || [])
                        .map((c: any) => c.assigned_to)
                        .filter((userId: string | null) => userId)
                ),
            ];

            let userMap: Record<string, string> = {};

            if (assignedUserIds.length > 0) {
                const { data: userData } = await supabase
                    .from("user_profiles")
                    .select("user_id, user_name")
                    .in("user_id", assignedUserIds);

                if (userData) {
                    userData.forEach((u) => {
                        userMap[u.user_id] = u.user_name || "Unknown";
                    });
                }
            }

            const mappedLeads = (data || []).map((lead: any) => ({
                ...lead,
                assigned_user_name: lead.assigned_to ? userMap[lead.assigned_to] || "Unknown" : "Unassigned"
            }));

            setLeads(mappedLeads);
        } catch (err) {
            console.error("Error fetching leads:", err);
        } finally {
            setLoadingLeads(false);
        }
    };

    useEffect(() => {
        fetchAuth();
    }, []);

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

                <main className="flex-1 pt-[60px] pb-24 lg:pb-8">
                    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                            <span className="cursor-pointer hover:text-[#4b33e8]" onClick={() => router.push('/campaign')}>Campaigns</span>
                            <i className="fi flex fi-rr-angle-small-right"></i>
                            <span className="text-gray-600 font-medium">{campaign?.name}</span>
                        </div>

                        {/* Top Banner */}
                        <div className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <i className="fi flex fi-rr-megaphone text-9xl"></i>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl md:text-3xl font-black text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            {campaign?.name}
                                        </h1>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${campaign?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {campaign?.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                                        {campaign?.description || 'No description provided for this campaign.'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 mt-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <i className="fi flex fi-rr-calendar"></i>
                                            <span>Created: {campaign?.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <i className="fi flex fi-rr-user"></i>
                                            <span>Creator: {campaign?.created_by || 'System'} {campaign?.employee_id ? `(#${campaign.employee_id})` : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Talk Time Tile */}
                                    <div className="flex items-center gap-3 bg-blue-50/50 px-5 py-4 rounded-2xl border border-blue-100/50">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform hover:scale-110">
                                            <i className="fi flex fi-rr-microphone-alt text-base"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider leading-none mb-1.5">Talk Time</span>
                                            <span className="text-base font-black text-gray-800 leading-none">{campaign?.talktime || '0h 0m'}</span>
                                        </div>
                                    </div>

                                    {/* Dials Tile */}
                                    <div className="flex items-center gap-3 bg-purple-50/50 px-5 py-4 rounded-2xl border border-purple-100/50">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm transition-transform hover:scale-110">
                                            <i className="fi flex fi-rr-phone-call text-base"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider leading-none mb-1.5">Total Dials</span>
                                            <span className="text-base font-black text-gray-800 leading-none">{campaign?.total_dials || 0}</span>
                                        </div>
                                    </div>

                                    {/* Start Calling Tile */}
                                    <button
                                        onClick={() => router.push(`/activity?campaignId=${campaign?.id}`)}
                                        className="flex items-center gap-4 px-7 py-4 rounded-2xl border border-white/10 shadow-xl shadow-indigo-200/50 transition-all hover:scale-[1.03] active:scale-95 group relative overflow-hidden"
                                        style={{
                                            background: 'linear-gradient(135deg, #4b33e8 0%, #8b5cf6 100%)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="relative z-10 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:bg-white/30 transition-colors shadow-sm ring-1 ring-white/30">
                                            <i className="fi flex fi-rr-play text-sm ml-0.5"></i>
                                        </div>
                                        <div className="relative z-10 flex flex-col items-start translate-y-[1px]">
                                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1.5">Mission</span>
                                            <span className="text-base font-black text-white leading-none">Start Calling</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                            {/* Total Assigned */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
                                    <i className="fi flex fi-rr-users"></i>
                                </div>
                                <span className="text-2xl font-black text-gray-800 leading-none mb-1">{stats.totalCustomers}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Leads</span>
                            </div>

                            {/* Fresh Prospects */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 text-purple-500">
                                    <i className="fi flex fi-rr-bulb"></i>
                                </div>
                                <span className="text-2xl font-black text-gray-800 leading-none mb-1">{stats.freshProspects}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fresh Prospects</span>
                            </div>

                            {/* Followups */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 text-orange-500">
                                    <i className="fi flex fi-rr-phone-call"></i>
                                </div>
                                <span className="text-2xl font-black text-gray-800 leading-none mb-1">{stats.followupCount}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Follow-ups</span>
                            </div>

                            {/* Upcoming */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4 text-green-500">
                                    <i className="fi flex fi-rr-calendar-clock"></i>
                                </div>
                                <span className="text-2xl font-black text-gray-800 leading-none mb-1">{stats.upcomingProspects}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Upcoming</span>
                            </div>

                            {/* Overdue */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4 text-red-500">
                                    <i className="fi flex fi-rr-time-watch-calendar"></i>
                                </div>
                                <span className="text-2xl font-black text-red-600 leading-none mb-1">{stats.overdueCount}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Overdue</span>
                            </div>
                        </div>

                        {/* Call Dashboard Section */}
                        <div className="space-y-6">
                            {/* Top 3 Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Recent Calls */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[180px] relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                                                <i className="fi flex fi-rr-time-past text-sm"></i>
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Recent Calls</h3>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-100">
                                            0
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                            <i className="fi flex fi-rr-time-past text-gray-300 text-base"></i>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium font-bold">No recent calls</p>
                                    </div>
                                </div>

                                {/* Overdue Calls */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[180px] relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                                <i className="fi flex fi-rr-pending text-sm"></i>
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Overdue Calls</h3>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white border border-red-600 shadow-lg shadow-red-100">
                                            {stats.overdueCount}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-2 border border-green-100">
                                            <i className="fi flex fi-rr-pending text-green-500 text-base"></i>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium font-bold">No overdue calls</p>
                                    </div>
                                </div>

                                {/* Upcoming Calls */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[180px] relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                <i className="fi flex fi-rr-clock text-sm"></i>
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Upcoming Calls</h3>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-100">
                                            {stats.upcomingProspects}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                            <i className="fi flex fi-rr-clock text-gray-300 text-base"></i>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium font-bold">No upcoming calls</p>
                                    </div>
                                </div>
                            </div>

                            {/* Large Bottom Card: All Leads */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px] relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4b33e8]">
                                            <i className="fi flex fi-rr-users text-base font-bold"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg md:text-xl leading-none mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>All Leads </h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Full Campaign Database</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Add Lead Button */}
                                        <button className="flex items-center gap-2 px-4 py-2 bg-[#4b33e8] text-white rounded-xl text-[10px] font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                                            <i className="fi flex fi-rr-plus"></i>
                                            Add Lead
                                        </button>

                                        {/* Working Date Picker Container */}
                                        <div
                                            className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-500 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all relative group/date"
                                        >
                                            <i className="fi flex fi-rr-calendar text-gray-400 group-hover/date:text-[#4b33e8] transition-colors"></i>
                                            <span>{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                            <input
                                                type="date"
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                            />
                                        </div>
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
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Customer Name</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Contact Info</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">Status</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Disposition</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Assigned To</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Expiry Date</th>
                                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {leads.map((lead) => (
                                                    <tr key={lead.id} className="group hover:bg-gray-50/50 transition-all">
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-medium shadow-lg shadow-indigo-100 uppercase">
                                                                    {lead.customer_name?.charAt(0) || 'C'}
                                                                </div>
                                                                <span className="text-xs font-medium text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{lead.customer_name || 'Anonymous'}</span>
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
                                                                <div className={`px-3 py-1 rounded-full text-[9px] font-medium uppercase tracking-widest ${lead.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                                    lead.status === 'followup' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                                        'bg-gray-50 text-gray-600 border border-gray-100'
                                                                    }`}>
                                                                    {lead.status}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[10px] font-medium text-gray-700 leading-none mb-1">{lead.disposition || 'Fresh'}</span>
                                                                <span className="text-[8px] text-gray-400 font-medium uppercase tracking-widest text-center">Outcome</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${lead.assigned_user_name === 'Unassigned' ? 'bg-gray-300' : 'bg-indigo-400'}`}></div>
                                                                <span className="text-[10px] font-medium text-gray-600 uppercase tracking-tighter">
                                                                    {lead.assigned_user_name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-xs font-medium text-gray-500">
                                                            {lead.expiry_date ? new Date(lead.expiry_date).toLocaleDateString() : '—'}
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <button
                                                                onClick={() => router.push(`/campaign/${id}/${lead.id}`)}
                                                                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm group-hover:scale-110 active:scale-95"
                                                            >
                                                                <i className="fi flex fi-rr-phone-call text-xs"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <BottomNav activeNav="campaign" userRole={user?.role || null} />
        </div>
    );
}
