import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { handleLogout } from "@/lib/authService";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext"; 
import { useSession } from "@/context/SessionContext";
import { getStoredUserData, storeUserData } from "@/lib/localStorageUtils";
import { useSessionState } from "@/hooks/useSessionState";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, 
    PieChart, Pie, Legend
} from 'recharts';
import ImportCustomersModal from "@/components/ImportCustomersModal";
import { formatMaskedPhone, computePhoneHash } from "@/lib/phoneUtils";
import CampaignStatsGrid from "@/components/campaign/CampaignStatsGrid";
import CampaignHeader from "@/components/campaign/CampaignHeader";

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
    users?: { id: string, name: string, email: string, employee_id?: string, user_id?: string }[];
    organization_id?: string | null;
    organizations?: { id: string, company_name: string, org_code: string } | null;
    ishourlyactivitywidgevisible?: boolean;
    istopagentvwidgetvisible?: boolean;
    iscalloutcomeswidgetvisible?: boolean;
    isaddbulkbuttonvisible?: boolean;
    isaddleadbuttonvisible?: boolean;
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
        user_id: string;
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

    const { user, loading: authLoading, mounted: userMounted } = useUser();
    const { startManualLock } = useSession();
    
    // Permission Flags using the global user
    const isLevel1User = user?.isClient === true && (user?.designation?.toLowerCase() === 'agent' || !user?.designation);
    const isLevel2User = user?.isClient === true && (user?.designation?.toLowerCase() === 'team_leader' || user?.designation?.toLowerCase() === 'manager');
    const userId = user?.uid;



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
    const [selectedDate, setSelectedDate] = useSessionState<string>("camp_selectedDate", new Date().toISOString().split('T')[0]);
    const [leads, setLeads] = useState<any[]>([]);
    const [recentCalls, setRecentCalls] = useState<any[]>([]);
    const [overdueLeads, setOverdueLeads] = useState<any[]>([]);
    const [upcomingLeads, setUpcomingLeads] = useState<any[]>([]);
    const [managedLeads, setManagedLeads] = useState<any[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [expandedChart, setExpandedChart] = useState<'hourly' | 'users' | null>(null);
    const [campaignStats, setCampaignStats] = useState({ talkTime: '0h 0m', totalDials: 0 });
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useSessionState<number>("camp_currentPage", 1);
    const [leadsPerPage] = useState(10);
    const [totalLeadsCount, setTotalLeadsCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [teamMemberIds, setTeamMemberIds] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);
    const [searchQuery, setSearchQuery] = useSessionState<string>("camp_searchQuery", "");
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [selectedUserFilter, setSelectedUserFilter] = useSessionState<string>("camp_selectedUserFilter", "");
    const [selectedDispositionFilter, setSelectedDispositionFilter] = useSessionState<string>("camp_selectedDispFilter", "");
    const [showImportModal, setShowImportModal] = useState(false);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear());
            return `${day}/${month}/${year}`;
        } catch (e) {
            return '—';
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
            const twentyFourHoursAgoCount = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            // 2. Fetch Stats & Analytics in Parallel
            // User constraints are now defined at the component level
            
            // --- LEVEL 2: Fetch Team Members if applicable ---
            let effectiveTeamMembers: string[] = [];
            if (isLevel2User && userId) {
                const { data: teamData } = await supabase
                    .from('teams')
                    .select('members')
                    .eq('leader_id', userId)
                    .eq('is_active', true);
                
                if (teamData && teamData.length > 0) {
                    // Collect all members from teams where user is leader
                    const allMembers = teamData.flatMap(t => t.members || []);
                    
                    // Intersection with campaign users
                    const campaignUserIds = (campaignData?.users || []).map((u: any) => u.user_id || u.id);
                    effectiveTeamMembers = allMembers.filter(mid => campaignUserIds.includes(mid));
                    
                    // Also include the TL themselves if they are in the campaign
                    if (campaignUserIds.includes(userId) && !effectiveTeamMembers.includes(userId)) {
                        effectiveTeamMembers.push(userId);
                    }
                    
                    console.log('--- TL Debug ---', { userId, allMembers, campaignUserIds, effectiveTeamMembers });
                    setTeamMemberIds(effectiveTeamMembers);
                }
            }

            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            // Prepare Queries based on User Level
            // Total Customers
            let qTotal = supabase.from('customers').select('*', { count: 'exact', head: true }).eq('campaign_id', id);
            if (isLevel1User && userId) qTotal = qTotal.eq('assigned_to', userId);
            if (isLevel2User) qTotal = effectiveTeamMembers.length > 0 ? qTotal.in('assigned_to', effectiveTeamMembers) : qTotal.eq('assigned_to', '00000000-0000-0000-0000-000000000000');

            // Follow-ups
            let qFollowup = supabase.from('customers').select('*', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', 'followup');
            if (isLevel1User && userId) qFollowup = qFollowup.eq('assigned_to', userId);
            if (isLevel2User) qFollowup = effectiveTeamMembers.length > 0 ? qFollowup.in('assigned_to', effectiveTeamMembers) : qFollowup.eq('assigned_to', '00000000-0000-0000-0000-000000000000');

            // Overdue
            let qOverdue = supabase.from('customers').select('*', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', 'followup').lt('expiry_date', now);
            if (isLevel1User && userId) qOverdue = qOverdue.eq('assigned_to', userId);
            if (isLevel2User) qOverdue = effectiveTeamMembers.length > 0 ? qOverdue.in('assigned_to', effectiveTeamMembers) : qOverdue.eq('assigned_to', '00000000-0000-0000-0000-000000000000');

            // Upcoming
            let qUpcoming = supabase.from('customers').select('*', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', 'followup').gte('expiry_date', now);
            if (isLevel1User && userId) qUpcoming = qUpcoming.eq('assigned_to', userId);
            if (isLevel2User) qUpcoming = effectiveTeamMembers.length > 0 ? qUpcoming.in('assigned_to', effectiveTeamMembers) : qUpcoming.eq('assigned_to', '00000000-0000-0000-0000-000000000000');

            // Managed
            let qManaged = supabase.from('customers').select('*', { count: 'exact', head: true }).eq('campaign_id', id).not('managed_by', 'is', null);
            if (isLevel1User && userId) qManaged = qManaged.eq('assigned_to', userId); 
            if (isLevel2User) qManaged = effectiveTeamMembers.length > 0 ? qManaged.in('assigned_to', effectiveTeamMembers) : qManaged.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            
            // Fresh (Unassigned or explicitly Fresh)
            let qFresh = supabase.from('customers').select('*', { count: 'exact', head: true }).eq('campaign_id', id).is('disposition', null).eq('attempt_count', 0);

            
            // Recent (Calls made by specific user if L1, or team if L2)
            let qRecentCount = supabase.from('call_logs').select('*', { count: 'exact', head: true }).eq('campaign_id', id).gte('created_at', twentyFourHoursAgoCount);
            if (isLevel1User && userId) qRecentCount = qRecentCount.eq('agent_id', userId);
            if (isLevel2User) qRecentCount = effectiveTeamMembers.length > 0 ? qRecentCount.in('agent_id', effectiveTeamMembers) : qRecentCount.eq('agent_id', '00000000-0000-0000-0000-000000000000');

            // Analytics (Server-side RPC to bypass 1000-row PostgREST limits)
            const analyticsPromise = (async () => {
                try {
                    const { data, error } = await supabase.rpc('get_campaign_daily_analytics', {
                        campaign_id_input: id,
                        target_date_input: selectedDate
                    });

                    if (error) throw error;
                    return { data, error: null };
                } catch (e: any) {
                    console.error("Failed to aggregate analytics:", e);
                    return { data: null, error: e };
                }
            })();
            
            const [
                { count: totalCount },
                { count: followupCount },
                { count: overdueCount },
                { count: freshCount },
                { count: upcomingCount },
                { count: recentCount },
                { count: managedCount },
                analyticsResponse
            ] = await Promise.all([
                qTotal, // 0
                qFollowup, // 1
                qOverdue, // 2
                qFresh, // 3
                qUpcoming, // 4
                qRecentCount, // 5
                qManaged, // 6
                analyticsPromise // 7
            ]);

            setStats({
                totalCustomers: totalCount || 0,
                followupCount: followupCount || 0,
                overdueCount: overdueCount || 0,
                freshProspects: freshCount || 0,
                upcomingProspects: upcomingCount || 0,
                recentCount: recentCount || 0,
                managedCount: managedCount || 0
            });

            // Process Analytics (Always use aggregation result)
            const { data: analyticsResult, error: analyticsError } = analyticsResponse;

            // --- USER PROFILES: Fetch all profiles needed for analytics and tiles ---
            // Collect all agent IDs that appear in today's analytics
            const analyticsAgentIds = (analyticsResult?.caller_performance || []).map((p: any) => p.user_id).filter(Boolean);
            
            const allRequiredProfileIds = [...new Set([
                userId, 
                ...effectiveTeamMembers,
                ...analyticsAgentIds
            ])].filter(Boolean) as string[];

            let userProfiles: any[] = [];
            if (allRequiredProfileIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('user_profiles')
                    .select('id, user_id, user_name, employee_id')
                    .or(`user_id.in.(${allRequiredProfileIds.join(',')}),id.in.(${allRequiredProfileIds.join(',')})`);
                userProfiles = profiles || [];
            }

            const findUser = (targetId: string) => userProfiles.find((p: any) => p.user_id === targetId || p.id === targetId);

            if (!analyticsError && analyticsResult) {
                // Enrich caller_performance with names from userProfiles
                const enrichedCallerPerformance = (analyticsResult.caller_performance || []).map((perf: any) => {
                    const profile = findUser(perf.user_id);
                    return {
                        ...perf,
                        caller: profile?.user_name || 'Unknown Agent',
                        user_name: profile?.user_name || 'Unknown Agent',
                        employee_id: profile?.employee_id || 'N/A'
                    };
                });

                setAnalytics({
                    hourly_calls: analyticsResult.hourly_calls || [],
                    agent_performance: analyticsResult.agent_performance || [],
                    disposition_stats: analyticsResult.disposition_stats || [],
                    hourly_detailed: analyticsResult.hourly_detailed || [],
                    caller_performance: enrichedCallerPerformance
                });

                // Update Campaign-wide Stats (Talktime & Dials) from the new data source
                const perfData = analyticsResult.caller_performance || [];
                const totalDials = perfData.reduce((sum: number, row: any) => sum + (Number(row.total_calls) || 0), 0);
                const totalDuration = perfData.reduce((sum: number, row: any) => sum + (Number(row.total_duration) || 0), 0);
                
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor((totalDuration % 3600) / 60);
                
                setCampaignStats({
                    talkTime: `${hours}h ${minutes}m`,
                    totalDials: totalDials
                });
            } else if (analyticsError) {
                  console.error("Analytics fetch error:", analyticsError);
            }

            // 3. Fetch Tile Data (Recent, Overdue, Upcoming, Managed) in Parallel
            // Prepare Tile Queries (Modified to avoid Relationship error on call_logs -> customers)
            let qRecentLogs = supabase.from('call_logs').select(`id, disposition, sub_disposition, created_at, agent_id, customer_id`).eq('campaign_id', id).gte('created_at', twentyFourHoursAgo).order('created_at', { ascending: false }).limit(3);
            if (isLevel1User && userId) qRecentLogs = qRecentLogs.eq('agent_id', userId);
            if (isLevel2User) qRecentLogs = effectiveTeamMembers.length > 0 ? qRecentLogs.in('agent_id', effectiveTeamMembers) : qRecentLogs.eq('agent_id', '00000000-0000-0000-0000-000000000000');

            let qOverdueLeads = supabase.from('customers').select('id, customer_name, disposition, sub_disposition, expiry_date, assigned_to, managed_by').eq('campaign_id', id).eq('status', 'followup').lt('expiry_date', now).order('expiry_date', { ascending: true }).limit(3);
            if (isLevel1User && userId) qOverdueLeads = qOverdueLeads.eq('assigned_to', userId);
            if (isLevel2User) qOverdueLeads = effectiveTeamMembers.length > 0 ? qOverdueLeads.in('assigned_to', effectiveTeamMembers) : qOverdueLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');

            let qUpcomingLeads = supabase.from('customers').select('id, customer_name, disposition, sub_disposition, expiry_date, assigned_to, managed_by').eq('campaign_id', id).eq('status', 'followup').gte('expiry_date', now).order('expiry_date', { ascending: true }).limit(3);
            if (isLevel1User && userId) qUpcomingLeads = qUpcomingLeads.eq('assigned_to', userId);
            if (isLevel2User) qUpcomingLeads = effectiveTeamMembers.length > 0 ? qUpcomingLeads.in('assigned_to', effectiveTeamMembers) : qUpcomingLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');

            let qManagedLeads = supabase.from('customers').select('id, customer_name, managed_by, assigned_to').eq('campaign_id', id).not('managed_by', 'is', null).order('created_at', { ascending: false }).limit(3);
            if (isLevel1User && userId) qManagedLeads = qManagedLeads.eq('assigned_to', userId);
            if (isLevel2User) qManagedLeads = effectiveTeamMembers.length > 0 ? qManagedLeads.in('assigned_to', effectiveTeamMembers) : qManagedLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');

            const [recentRes, overdueRes, upcomingRes, managedRes] = await Promise.all([
                 qRecentLogs,
                 qOverdueLeads,
                 qUpcomingLeads,
                 qManagedLeads
            ]);

            const recentData = recentRes.data || [];
            const overdueData = overdueRes.data || [];
            const upcomingData = upcomingRes.data || [];
            const managedData = managedRes.data || [];

            // 4. Manual Join for Recent Logs Customers (Fixing missing FK)
            const recentCustomerIds = [...new Set(recentData.map((d: any) => d.customer_id).filter(Boolean))];
            let recentCustomerMap: Record<string, any> = {};
            if (recentCustomerIds.length > 0) {
               const { data: cData } = await supabase
                 .from('customers')
                 .select('id, customer_name, expiry_date')
                 .in('id', recentCustomerIds);
               if (cData) {
                 cData.forEach((c: any) => {
                   recentCustomerMap[c.id] = c;
                 });
               }
            }


            // 4b. Collect additional User IDs that might have appeared in Tile data but not in team/agent lists
            const extraUserIds = [
                ...new Set([
                    ...recentData.map((d: any) => d.agent_id),
                    ...overdueData.map((d: any) => d.assigned_to),
                    ...overdueData.map((d: any) => d.managed_by),
                    ...upcomingData.map((d: any) => d.assigned_to),
                    ...upcomingData.map((d: any) => d.managed_by),
                    ...managedData.map((d: any) => d.managed_by),
                    ...managedData.map((d: any) => d.assigned_to)
                ])
            ].filter(id => id && !userProfiles.some(p => p.user_id === id || p.id === id));

            if (extraUserIds.length > 0) {
                const { data: extraProfiles } = await supabase
                    .from('user_profiles')
                    .select('id, user_id, user_name, employee_id')
                    .or(`user_id.in.(${extraUserIds.join(',')}),id.in.(${extraUserIds.join(',')})`);
                if (extraProfiles) {
                    userProfiles = [...userProfiles, ...extraProfiles];
                }
            }

            // Enrich Recent Calls
            setRecentCalls(recentData.map((log: any) => {
                const caller = findUser(log.agent_id);
                const customer = recentCustomerMap[log.customer_id];
                return {
                    ...log,
                    caller_name: caller?.user_name || 'System',
                    caller_emp_id: caller?.employee_id || 'N/A',
                    customers: customer ? { // Mimic the structure expected by UI
                        customer_name: customer.customer_name,
                        expiry_date: customer.expiry_date
                    } : null
                };
            }));

            // Enrich Overdue
            setOverdueLeads(overdueData.map((lead: any) => {
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));

            // Enrich Upcoming
            setUpcomingLeads(upcomingData.map((lead: any) => {
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));
            
            // Enrich Managed Leads
            setManagedLeads(managedData.map((lead: any) => {
                const manager = findUser(lead.managed_by);
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    manager_name: manager?.user_name || 'Unknown',
                    manager_emp_id: manager?.employee_id || 'N/A',
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));

            // 2. Fetch Leads - Pass effective members directly to avoid waiting for state update
            fetchLeads(undefined, effectiveTeamMembers);

        } catch (err: any) {
            console.error("Error fetching campaign details:", err);
            setError(err.message || "Failed to load campaign details");
        } finally {
            setLoading(false);
        }
    };



    const fetchLeads = async (pageOverride?: number, teamIdsOverride?: string[]) => {
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
            
            if (isLevel1User && user?.uid) {
                countQuery = countQuery.eq('assigned_to', user.uid);
            } else if (isLevel2User) {
                const activeTeamIds = teamIdsOverride || teamMemberIds;
                countQuery = activeTeamIds.length > 0 ? countQuery.in('assigned_to', activeTeamIds) : countQuery.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            }

            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`;
                
                // If search looks like a phone number
                if (searchQuery.replace(/\D/g, '').length > 0) {
                     const hash = computePhoneHash(searchQuery);
                     if (hash) {
                         orConditions += `,phone_search_hash.eq.${hash}`;
                     }
                }
                countQuery = countQuery.or(orConditions);
            }

            if (selectedUserFilter && selectedUserFilter !== 'ALL') {
                countQuery = countQuery.eq('assigned_to', selectedUserFilter);
            }
            if (selectedDispositionFilter) {
                if (selectedDispositionFilter === 'Fresh') {
                    countQuery = countQuery.is('disposition', null);
                } else {
                    countQuery = countQuery.eq('disposition', selectedDispositionFilter);
                }
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

            if (isLevel1User && user?.uid) {
                dataQuery = dataQuery.eq('assigned_to', user.uid);
            } else if (isLevel2User) {
                const activeTeamIds = teamIdsOverride || teamMemberIds;
                dataQuery = activeTeamIds.length > 0 ? dataQuery.in('assigned_to', activeTeamIds) : dataQuery.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            }

            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`;
                
                // If search looks like a phone number
                if (searchQuery.replace(/\D/g, '').length > 0) {
                     const hash = computePhoneHash(searchQuery);
                     if (hash) {
                         orConditions += `,phone_search_hash.eq.${hash}`;
                     }
                }
                dataQuery = dataQuery.or(orConditions);
            }

            if (selectedUserFilter && selectedUserFilter !== 'ALL') {
                dataQuery = dataQuery.eq('assigned_to', selectedUserFilter);
            }
            if (selectedDispositionFilter) {
                if (selectedDispositionFilter === 'Fresh') {
                    dataQuery = dataQuery.is('disposition', null);
                } else {
                    dataQuery = dataQuery.eq('disposition', selectedDispositionFilter);
                }
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
        if (!router.isReady || !id || authLoading || !userId) return;
        fetchCampaignData();
    }, [router.isReady, id, userId, isLevel1User, authLoading, selectedDate]);

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

    // Handle Filter Changes
    useEffect(() => {
        setCurrentPage(1);
        fetchLeads(1);
    }, [selectedUserFilter, selectedDispositionFilter]);

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
                router.push(`/portal/campaign/${activeSession.campaign_id}/${activeSession.customer_id}`);
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
                router.push(`/portal/campaign/${campaignSession.campaign_id}/${campaignSession.customer_id}`);
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
                    organization_id: campaign?.organization_id,
                    status: 'assigned',
                    updated_at: new Date().toISOString()
                });

            // 3. Redirect to Lead Page
            if (id && leadId) {
                router.push(`/portal/campaign/${id}/${leadId}`);
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

    const SkeletonTile = () => (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 min-h-[320px] animate-pulse">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
                    <div className="h-4 w-24 bg-gray-100 rounded"></div>
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-100"></div>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-50 rounded-2xl"></div>
                ))}
            </div>
        </div>
    );

    const SkeletonTable = () => (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="p-6 border-b border-gray-50 flex justify-between">
                <div className="h-4 w-48 bg-gray-100 rounded"></div>
            </div>
            <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-10 bg-gray-50 rounded"></div>
                ))}
            </div>
        </div>
    );

    if ((loading || authLoading) && !campaign) {
        return (
            <div className="max-w-[1600px] mx-auto space-y-8 p-4 md:p-8">
                {/* Header Skeleton */}
                <div className="h-32 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
                
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
                    ))}
                </div>

                {/* Analytics Skeleton */}
                {userMounted && !isLevel1User && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[300px] bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
                        ))}
                    </div>
                )}

                {/* Breakdown Table Skeleton */}
                <SkeletonTable />

                {/* Tiles Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SkeletonTile />
                    <SkeletonTile />
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
                        onClick={() => router.push('/portal/campaign')}
                        className="px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition-all"
                    >
                        Back to Campaigns
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-[1600px] mx-auto space-y-8 p-4 md:p-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 px-1">
                    <span className="cursor-pointer hover:text-[#4b33e8] transition-colors" onClick={() => router.push('/portal/campaign')}>Campaigns</span>
                    <i className="fi flex fi-rr-angle-small-right text-[10px]"></i>
                    <span className="text-gray-600 font-bold">{campaign?.name}</span>
                </div>

                {/* Top Banner */}
                <CampaignHeader 
                    id={id}
                    campaign={campaign}
                    campaignStats={campaignStats}
                    calling={calling}
                    onStartCalling={handleStartCalling}
                />

                {/* Stats Grid */}
                <CampaignStatsGrid stats={stats} />

                {/* ANALYTICS SECTION - Hidden for Level 1 Users but Visible for Level 2 */}
                {(isLevel2User || !isLevel1User) && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* 1. Hourly Activity (Area Chart) */}
                            {(campaign?.ishourlyactivitywidgevisible || isLevel2User) && (
                                <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${
                                    expandedChart === 'hourly' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'
                                }`}>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <i className="fi fi-rr-chart-histogram text-[#4b33e8]"></i>
                                        Hourly Activity (Today) {isLevel2User && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2">Team Mode</span>}
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
                                 )}

                                {/* 2. Agent Performance (Bar Chart) */}
                                 {(campaign?.istopagentvwidgetvisible || isLevel2User) && (
                                     <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${
                                         expandedChart === 'users' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'
                                     }`}>
                                         <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                             <i className="fi fi-rr-trophy text-yellow-500"></i>
                                             Top Agents (Today) {isLevel2User && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2">Team Mode</span>}
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
                                 )}

                                {/* 3. Outcomes (Pie Chart) */}
                                 {(campaign?.iscalloutcomeswidgetvisible || isLevel2User) && (
                                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-1 flex flex-col h-[300px]">
                                         <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                             <i className="fi fi-rr-pie-chart text-pink-500"></i>
                                             Call Outcomes {isLevel2User && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2">Team Mode</span>}
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
                                 )}
                            </div>
                        </>
                        )}

                        {/* Performance Breakdown Tables - Visible to All */}
                        <div className="space-y-8 mb-8">
                             {/* Detailed Hourly Analytics Table */}
                             <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <i className="fi fi-rr-time-check text-[#4b33e8]"></i>
                                            Hourly Performance Breakdown
                                        </h3>
                                        <div className="relative">
                                            <div className="group relative">
                                                <button 
                                                    onClick={() => dateInputRef.current?.showPicker()}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
                                                >
                                                    <i className="fi fi-rr-calendar text-indigo-500 text-[10px]"></i>
                                                    {new Date(selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </button>
                                                <input 
                                                    ref={dateInputRef}
                                                    type="date" 
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="absolute inset-0 opacity-0 pointer-events-none w-full"
                                                />
                                            </div>
                                        </div>
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
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <i className="fi fi-rr-headset text-[#4b33e8]"></i>
                                            Caller Performance Breakdown
                                        </h3>
                                        <div className="relative">
                                            <div className="group relative">
                                                <button 
                                                    onClick={() => dateInputRef.current?.showPicker()}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
                                                >
                                                    <i className="fi fi-rr-calendar text-indigo-500 text-[10px]"></i>
                                                    {new Date(selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </button>
                                                <input 
                                                    ref={dateInputRef}
                                                    type="date" 
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="absolute inset-0 opacity-0 pointer-events-none w-full"
                                                />
                                            </div>
                                        </div>
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
                                                        (u.employee_id && row.employee_id && u.employee_id === row.employee_id) || 
                                                        (u.name && row.caller && u.name.toLowerCase() === row.caller.toLowerCase()) ||
                                                        (u.id && row.user_id && u.id === row.user_id)
                                                    )
                                                ).length > 0 ? (
                                                    analytics.caller_performance
                                                        .filter(row => 
                                                            campaign?.users?.some(u => 
                                                                (u.employee_id && row.employee_id && u.employee_id === row.employee_id) || 
                                                                (u.name && row.caller && u.name.toLowerCase() === row.caller.toLowerCase()) ||
                                                                (u.id && row.user_id && u.id === row.user_id)
                                                            )
                                                        )
                                                        .map((row, index) => (
                                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4 text-xs font-bold text-gray-700 capitalize">
                                                                {row.caller || 'Unknown Agent'}
                                                            </td>
                                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.total_calls}</td>
                                                            <td className="px-6 py-4 text-xs font-medium text-green-600">{row.connected_calls}</td>
                                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.outgoing_calls}</td>
                                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.incoming_calls}</td>
                                                            <td className="px-6 py-4 text-xs font-medium text-red-500">{row.missed_calls}</td>
                                                            <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                                                {new Date((row.total_duration || 0) * 1000).toISOString().substr(11, 8)}
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
                                                                         {item.caller_name?.split(' ')[0]} ({item.caller_emp_id})
                                                                     </span>
                                                                     <span className="text-[9px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block uppercase tracking-tighter">
                                                                         {item.disposition || 'Call'}
                                                                         {item.sub_disposition && ` > ${item.sub_disposition}`}
                                                                     </span>
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
                                                                 if (id && item.customer_id && user?.uid) {
                                                                     startManualLock({ id: "manual-" + Date.now(), user_id: user.uid, campaign_id: String(id), customer_id: item.customer_id, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() });                                                                      router.push(`/portal/campaign/${id}/${item.customer_id}?isManual=true`);
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
                                                                 <div className="flex items-center gap-2 flex-wrap">
                                                                     <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-1 rounded inline-block uppercase tracking-tighter">
                                                                         {item.agent_name?.split(' ')[0]} ({item.agent_emp_id})
                                                                     </span>
                                                                     <span className="text-[9px] font-black text-red-400 border border-red-100 px-2 py-1 rounded inline-block uppercase tracking-tighter">
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
                                                             onClick={() => {
                                                                 if (id && item.id && user?.uid) {
                                                                     startManualLock({
                                                                         id: 'manual-' + Date.now(),
                                                                         user_id: user.uid,
                                                                         campaign_id: String(id),
                                                                         customer_id: item.id,
                                                                         status: 'active',
                                                                         created_at: new Date().toISOString(),
                                                                         updated_at: new Date().toISOString()
                                                                     });
                                                                     router.push(`/portal/campaign/${id}/${item.id}?isManual=true`);
                                                                 }
                                                             }}
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
                                                                 <div className="flex items-center gap-2 flex-wrap">
                                                                     <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block uppercase tracking-tighter">
                                                                         Agent: {item.agent_name?.split(' ')[0]} ({item.agent_emp_id})
                                                                     </span>
                                                                     <span className="text-[9px] font-black text-blue-400 border border-blue-100 px-2 py-1 rounded inline-block uppercase tracking-tighter">
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
                                                             onClick={() => {
                                                                 if (id && item.id && user?.uid) {
                                                                     startManualLock({
                                                                         id: 'manual-' + Date.now(),
                                                                         user_id: user.uid,
                                                                         campaign_id: String(id),
                                                                         customer_id: item.id,
                                                                         status: 'active',
                                                                         created_at: new Date().toISOString(),
                                                                         updated_at: new Date().toISOString()
                                                                     });
                                                                     router.push(`/portal/campaign/${id}/${item.id}?isManual=true`);
                                                                 }
                                                             }}
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
                                                             onClick={() => {
                                                                 if (id && item.id && user?.uid) {
                                                                     startManualLock({
                                                                         id: 'manual-' + Date.now(),
                                                                         user_id: user.uid,
                                                                         campaign_id: String(id),
                                                                         customer_id: item.id,
                                                                         status: 'active',
                                                                         created_at: new Date().toISOString(),
                                                                         updated_at: new Date().toISOString()
                                                                     });
                                                                     router.push(`/portal/campaign/${id}/${item.id}?isManual=true`);
                                                                 }
                                                             }}
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
                                        {/* User Filter */}
                                        <div className="relative group/filter min-w-[140px]">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="fi flex fi-rr-user text-gray-400 text-xs"></i>
                                            </div>
                                            <select
                                                value={selectedUserFilter || "ALL"}
                                                onChange={(e) => setSelectedUserFilter(e.target.value)}
                                                className="w-full h-[42px] pl-8 pr-8 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all uppercase tracking-wider appearance-none cursor-pointer"
                                            >
                                                <option value="ALL">All Users</option>
                                                {campaign?.users?.map(u => (
                                                    <option key={u.id} value={(u as any).user_id || u.id}>{u.name || (u as any).displayName || 'User'}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <i className="fi flex fi-rr-angle-small-down text-gray-400"></i>
                                            </div>
                                        </div>

                                        {/* Disposition Filter */}
                                        <div className="relative group/filter min-w-[140px]">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="fi flex fi-rr-filter text-gray-400 text-xs"></i>
                                            </div>
                                            <select
                                                value={selectedDispositionFilter}
                                                onChange={(e) => setSelectedDispositionFilter(e.target.value)}
                                                className="w-full h-[42px] pl-8 pr-8 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all uppercase tracking-wider appearance-none cursor-pointer"
                                            >
                                                <option value="">All Status</option>
                                                {['Fresh', 'Call Back', 'Not Interested', 'Converted', 'Follow Up', 'DNE', 'Busy', 'No Answer', 'Invalid Number', 'Wrong Number', 'Not Reachable'].map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <i className="fi flex fi-rr-angle-small-down text-gray-400"></i>
                                            </div>
                                        </div>
                                        {/* Search Bar */}
                                        <div className="relative group/search min-w-[240px]">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <i className="fi flex fi-rr-search text-gray-400 text-xs group-focus-within/search:text-[#4b33e8] transition-colors"></i>
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
                                         {!isLevel1User && !isLevel2User && campaign?.isaddbulkbuttonvisible && (
                                             <button 
                                                 onClick={() => setShowImportModal(true)}
                                                 className="flex items-center gap-2 px-6 h-[42px] bg-indigo-50 text-[#4b33e8] border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest"
                                             >
                                                 <i className="fi flex fi-rr-upload"></i>
                                                 Add Bulk
                                             </button>
                                         )}

                                         {/* Add Lead Button */}
                                         {!isLevel1User && !isLevel2User && campaign?.isaddleadbuttonvisible && (
                                             <button className="flex items-center gap-2 px-6 h-[42px] bg-[#4b33e8] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:opacity-90 transition-all uppercase tracking-widest">
                                                 <i className="fi flex fi-rr-plus"></i>
                                                 Add Lead
                                             </button>
                                         )}
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
                                                            if (id && lead.id && user?.uid) {
                                                                startManualLock({
                                                                    id: 'manual-' + Date.now(),
                                                                    user_id: user.uid,
                                                                    campaign_id: String(id),
                                                                    customer_id: lead.id,
                                                                    status: 'active',
                                                                    created_at: new Date().toISOString(),
                                                                    updated_at: new Date().toISOString()
                                                                });
                                                                router.push(`/portal/campaign/${id}/${lead.id}?isManual=true`);
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
                                                                <span className="text-xs font-medium text-gray-700 leading-none mb-1">{formatMaskedPhone(lead.phone_no)}</span>
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
                    </>
                );
            }
