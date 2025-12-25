import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../../../lib/authService";
import { supabase } from "../../../lib/supabase";
import BottomNav from "../../../components/BottomNav";

export default function CallingPage() {
    const router = useRouter();
    const { id: campaignId, customerId } = router.query;
    
    const [user, setUser] = useState<UserProfile | null>(null);
    const [customer, setCustomer] = useState<any>(null);
    const [campaign, setCampaign] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    
    // Call States
    const [isCalling, setIsCalling] = useState(false);
    const [postCall, setPostCall] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStartTime, setCallStartTime] = useState<number | null>(null);
    const [serverTimeOffset, setServerTimeOffset] = useState(0);
    const [disposition, setDisposition] = useState("");
    const [subDisposition, setSubDisposition] = useState("");
    const [callbackDate, setCallbackDate] = useState("");
    const [callbackTime, setCallbackTime] = useState("");
    const [notes, setNotes] = useState("");

    const dispositionHierarchy: Record<string, string[]> = {
        "Not Intrested": [],
        "Language barrier": [],
        "DND": [],
        "Wrong NO": [],
        "Not Contactable": ["hang up", "busy", "Ring", "not reacable", "others"],
        "Call Back": ["intrested", "follow up", "busy"],
        "Deal Done": [],
    };

    const primaryDispositions = Object.keys(dispositionHierarchy);

    useEffect(() => {
        let interval: any;
        
        const updateDuration = () => {
            if (isCalling && callStartTime) {
                // Calibrate duration using server offset
                const now = Date.now() + serverTimeOffset;
                const diff = Math.floor((now - callStartTime) / 1000);
                setCallDuration(diff > 0 ? diff : 0);
            }
        };

        if (isCalling && callStartTime) {
            updateDuration(); // Sync immediately
            interval = setInterval(updateDuration, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isCalling, callStartTime, serverTimeOffset]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

    const renderCleanedDetails = (details: any) => {
        if (!details) return <p className="text-gray-400 italic">No information available</p>;
        
        let data = details;
        if (typeof details === 'string') {
            try {
                data = JSON.parse(details);
            } catch (e) {
                return <p className="italic">"{details}"</p>;
            }
        }

        if (typeof data !== 'object' || data === null) {
            return <p className="italic">"{String(data)}"</p>;
        }

        return (
            <div className="grid grid-cols-1 gap-3">
                {Object.entries(data).map(([key, value]) => {
                    const cleanKey = key.replace(/_(un)?checked/gi, '').replace(/_/g, ' ');
                    return (
                        <div key={key} className="flex flex-col border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <span className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>{cleanKey}</span>
                            <span className="text-[13px] font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{String(value)}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const fetchAuth = async () => {
        const result = await checkAuthAndFetchProfile();
        if (result.shouldRedirect) {
            router.push("/login");
            return;
        }
        if (result.user) setUser(result.user);
        
        // Calibration
        if (result.serverNow) {
            const serverMs = new Date(result.serverNow).getTime();
            const localMs = Date.now();
            const offset = serverMs - localMs;
            console.log(`[Time-Calib] Server Offset: ${offset}ms`);
            setServerTimeOffset(offset);
        }
    };

    const fetchData = async (overrideId?: string) => {
        const idToFetch = overrideId || customerId;
        if (!campaignId || !idToFetch || !user) return;
        
        console.log(`[Fetch] Fetching data for Customer: ${idToFetch} (User: ${user.uid})`);
        
        try {
            setLoading(true);
            
            // 1. Fetch Campaign (Static for the page)
            if (!campaign) {
                const { data: campaignData, error: campaignError } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('id', campaignId)
                    .single();
                if (!campaignError) setCampaign(campaignData);
            }

            // 2. Fetch Customer (Try all three tables)
            let foundCustomer: any = null;
            
            // Try primary customers table
            const { data: cData } = await supabase
                .from('customers')
                .select('*')
                .eq('id', idToFetch)
                .maybeSingle();
            
            if (cData) {
                foundCustomer = cData;
            } else {
                // Try closed_deals
                const { data: clData } = await supabase
                    .from('closed_deals')
                    .select('*')
                    .eq('id', idToFetch)
                    .maybeSingle();
                
                if (clData) {
                    foundCustomer = clData;
                } else {
                    // Try rejected_leads
                    const { data: rData } = await supabase
                        .from('rejected_leads')
                        .select('*')
                        .eq('id', idToFetch)
                        .maybeSingle();
                    if (rData) foundCustomer = rData;
                }
            }
            
            if (foundCustomer) {
                setCustomer(foundCustomer);
            } else {
                console.warn(`[Fetch] Customer ${idToFetch} not found in any table.`);
                
                // Ghost Session Recovery: If this missing customer is currently assigned to the user, clear it and re-assign.
                const { data: sessionData } = await supabase
                    .from('call_sessions')
                    .select('*')
                    .eq('user_id', user.uid)
                    .single();

                // If user has a session for THIS missing customer, clear and re-assign
                if (sessionData && sessionData.customer_id === idToFetch) {
                    console.log(`[Ghost-Recovery] Ghost session detected for customer ${idToFetch}. Clearing and re-assigning...`);
                    
                    await supabase
                        .from('call_sessions')
                        .delete()
                        .eq('user_id', user.uid);

                    const { data: nextLeadId } = await supabase.rpc('assign_next_lead', {
                        p_campaign_id: campaignId,
                        p_user_id: user.uid
                    });

                    if (nextLeadId) {
                        await supabase.from('call_sessions').upsert({
                            user_id: user.uid,
                            campaign_id: campaignId,
                            customer_id: nextLeadId,
                            status: 'assigned',
                            updated_at: new Date().toISOString()
                        });
                        router.push(`/campaign/${campaignId}/${nextLeadId}`);
                        return;
                    } else {
                        router.push(`/campaign/${campaignId}`);
                        return;
                    }
                } else {
                    // No matching session for this missing customer, but page is broken. 
                    // Redirect to dashboard to be safe.
                    console.warn(`[Fetch] No session matches missing customer ${idToFetch}. Redirecting to safety.`);
                    router.push(`/campaign/${campaignId}`);
                    return;
                }
            }

            // 3. Fetch History (Call Logs) - Always attempt this
            const { data: historyData, error: historyError } = await supabase
                .from('call_logs')
                .select(`
                    *,
                    agent:agent_id(user_name, employee_id),
                    updater:last_updated_by(user_name, employee_id)
                `)
                .eq('customer_id', idToFetch)
                .order('created_at', { ascending: false });
            
            if (historyError) {
                console.error("[Fetch] History error:", historyError);
                setHistory([]);
            } else {
                console.log(`[Fetch] Found ${historyData?.length || 0} history records.`);
                setHistory(historyData || []);
            }

        } catch (err: any) {
            console.error("[Fetch] Error in fetchData:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuth();
    }, []);

    useEffect(() => {
        if (router.isReady && user) {
            // Reset states for new customer
            setCustomer(null);
            setHistory([]);
            setDisposition("");
            setSubDisposition("");
            setNotes("");
            setCallbackDate("");
            setCallbackTime("");
            setCallDuration(0);
            setIsCalling(false);
            setPostCall(false);
            setError("");
            
            fetchData();
        }
    }, [router.isReady, campaignId, customerId, user?.uid]);

    const parseUTCtoMS = (timestamp: string) => {
        if (!timestamp) return null;
        // Normalize: replace space with T, and handle offsets
        let normalized = timestamp.replace(" ", "T");
        
        // If it ends with +00 or +00:00, replace with Z for absolute UTC parsing
        if (normalized.includes("+00")) {
            normalized = normalized.split("+")[0] + "Z";
        }

        const date = new Date(normalized);
        const ms = date.getTime();
        
        if (isNaN(ms)) {
            console.error('[Time] Invalid timestamp format:', timestamp);
            return null;
        }
        
        return ms; // Returns UTC milliseconds
    };

    // Subscribe to Real-time Session Changes
    useEffect(() => {
        if (!user?.uid || !campaignId || !customerId) return;

        const syncChannel = supabase
            .channel(`lead_sync_${user.uid}_${customerId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'call_sessions',
                    filter: `user_id=eq.${user.uid}`
                },
                (payload: any) => {
                    console.log('[Realtime-Sync] Event received:', payload.eventType, payload.new);
                    const session = payload.new;
                    
                    if (!session) return;

                    // Ensure we are comparing strings
                    const currentCampaignId = String(campaignId);
                    const currentCustomerId = String(customerId);
                    const incomingCampaignId = String(session.campaign_id);
                    const incomingCustomerId = String(session.customer_id);

                    if (incomingCampaignId === currentCampaignId && incomingCustomerId === currentCustomerId) {
                        console.log('[Realtime-Sync] Updating local state for current lead');
                        if (session.status === 'active') {
                            setPostCall(false);
                            setIsCalling(true);
                            if (session.call_start_at) {
                                const start = parseUTCtoMS(session.call_start_at);
                                if (start) setCallStartTime(start);
                            }
                        } else if (session.status === 'assigned') {
                            // Lead assigned but call not started
                            setIsCalling(false);
                            setPostCall(false);
                            setCallDuration(0);
                            setCallStartTime(null);
                        } else if (session.status === 'disposition_pending') {
                            setIsCalling(false);
                            setPostCall(true);
                        } else if (session.status === 'closed') {
                            setIsCalling(false);
                            setPostCall(false);
                            setCallDuration(0);
                            setCallStartTime(null);
                        }
                    } else {
                        console.log('[Realtime-Sync] Session change detected for different lead, ignoring on this page.');
                    }
                }
            )
            .subscribe((status) => {
                console.log(`[Realtime-Sync] Subscription status: ${status}`);
            });

        return () => {
            console.log('[Realtime-Sync] Unsubscribing');
            supabase.removeChannel(syncChannel);
        };
    }, [user?.uid, campaignId, customerId]);

    // Initial State Restoration
    useEffect(() => {
        if (user && campaignId && customerId) {
            const session = user.currentCallSession as any;
            // Check if this is the active session for the current page
            if (session && String(session.campaign_id) === String(campaignId) && String(session.customer_id) === String(customerId)) {
                if (session.status === 'active') {
                    setIsCalling(true);
                    setPostCall(false);
                    // Calculate duration since start
                    if (session.call_start_at) {
                        const start = parseUTCtoMS(session.call_start_at);
                        if (start) setCallStartTime(start);
                    }
                } else if (session.status === 'assigned') {
                    setIsCalling(false);
                    setPostCall(false);
                } else if (session.status === 'disposition_pending') {
                    setIsCalling(false);
                    setPostCall(true);
                }
            }
        }
    }, [user, campaignId, customerId]);

    // Smart Date Rollover: If user picks a time that passed today, move to tomorrow
    useEffect(() => {
        if (!callbackTime || !callbackDate) return;

        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        // Only trigger if the date is currently set to Today
        if (callbackDate === todayStr) {
            const [hours, minutes] = callbackTime.split(':').map(Number);
            const selectedDateTime = new Date();
            selectedDateTime.setHours(hours, minutes, 0, 0);

            // If the selected time is in the past (e.g. 00:10 AM at 11:30 PM)
            if (selectedDateTime < now) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
                
                console.log('[Scheduler] Time is in the past for today, rolling over date to tomorrow.');
                setCallbackDate(tomorrowStr);
            }
        }
    }, [callbackTime, callbackDate]);

    const handleStartCall = async () => {
        const cId = campaignId as string;
        const custId = customerId as string;

        if (!cId || !custId) {
            console.error('[Session] Missing campaignId or customerId in router query');
            return;
        }

        // --- Optimistic UI Update ---
        // Set state immediately using local time so the timer starts without waiting for API
        const localNow = new Date();
        setCallStartTime(localNow.getTime());
        setIsCalling(true);
        setPostCall(false);
        setCallDuration(0);
        // ----------------------------

        if (customer?.phone_no) {
            window.location.href = `tel:${customer.phone_no}`;
        }

        setDisposition("");
        setSubDisposition("");
        setNotes("");
        setCallbackDate("");
        setCallbackTime("");

        // Persist session to call_sessions table in real-time
        if (user?.uid) {
            console.log('[Session] Attempting to create active session in DB...');
            try {
                const { data: { session: authSession } } = await supabase.auth.getSession();
                if (authSession) {
                    const response = await fetch("/api/auth/update-call-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authSession.access_token}`,
                        },
                        body: JSON.stringify({
                            campaign_id: cId,
                            customer_id: custId,
                            status: 'active'
                        })
                    });
                    const result = await response.json();
                    if (result.success && result.session?.call_start_at) {
                        console.log('[Session] Active session synced with server time');
                        
                        // Recalibrate offset
                        if (result.server_now) {
                            const sNow = new Date(result.server_now).getTime();
                            const lNow = Date.now();
                            setServerTimeOffset(sNow - lNow);
                        }

                        // Sync with server time to ensure all devices are identical
                        const serverStart = parseUTCtoMS(result.session.call_start_at);
                        if (serverStart) setCallStartTime(serverStart);
                    } else if (!result.success) {
                        console.error('[Session] Failed to persist session:', result.error);
                    }
                }
            } catch (err) {
                console.error('[Session] Network error persisting session:', err);
            }
        }
    };

    const handleEndCall = async () => {
        setIsCalling(false);
        setPostCall(true);

        // Update state to disposition_pending in call_sessions table
        if (user?.uid) {
            const { data: { session: authSession } } = await supabase.auth.getSession();
            if (authSession) {
                await fetch("/api/auth/update-call-session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authSession.access_token}`,
                    },
                    body: JSON.stringify({
                        campaign_id: campaignId,
                        customer_id: customerId,
                        status: 'disposition_pending'
                    })
                });
            }
        }
    };

    const handleSaveDisposition = async () => {
        if (!disposition) {
            alert("Please select a primary status");
            return;
        }

        if (dispositionHierarchy[disposition]?.length > 0 && !subDisposition) {
            alert("Please select a specific sub-disposition");
            return;
        }

        const finalDisposition = subDisposition ? `${disposition} > ${subDisposition}` : disposition;

        try {
            setSaving(true);
            
            const now = new Date().toISOString();

            // Determine Connection Status
            const isConnected = (disposition === 'Call Back' || disposition === 'Deal Done' || disposition === 'Not Intrested' || disposition === 'Language barrier' || disposition === 'DND' || disposition === 'Wrong NO') 
                ? 'contactable' 
                : (disposition === 'Not Contactable' ? 'uncontactable' : null);

            // 2. Perform Movement Logic or Update Status
            const isRejected = disposition === 'DND' || disposition === 'Language barrier' || disposition === 'Wrong NO';
            const isClosed = disposition === 'Deal Done';

            let logNextCalledAt = null;
            let logStatus = 'active';
            let logAssignedTo = null;

            if (isRejected) {
                // Move to rejected table and delete from customers
                const { error: rejectError } = await supabase.rpc('move_to_rejected', {
                    p_customer_id: customerId,
                    p_agent_id: user?.uid,
                    p_notes: notes,
                    p_disposition: disposition,
                    p_sub_disposition: subDisposition
                });
                if (rejectError) throw rejectError;
                logStatus = 'rejected';
            } else if (isClosed) {
                // Move to closed table and delete from customers
                const { error: closeError } = await supabase.rpc('move_to_closed', {
                    p_customer_id: customerId,
                    p_agent_id: user?.uid,
                    p_notes: notes,
                    p_final_disposition: finalDisposition
                });
                if (closeError) throw closeError;
                logStatus = 'closed';
            } else if (disposition === 'Not Contactable' || disposition === 'Not Intrested') {
                // --- Specific Logic for Retries (Not Contactable or Not Interested) ---
                const currentAttempts = customer?.attempt_count || 0;
                const newAttempts = currentAttempts + 1;
                const isRetryable = newAttempts <= 3;
                
                const nextCallTime = new Date(new Date(now).getTime() + 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(); // 1h + 2m buffer

                let updatePayload: any = {
                    last_called_at: now,
                    updated_at: now,
                    last_updated_by: user?.uid,
                    is_connected: isConnected
                };

                if (isRetryable) {
                    updatePayload = {
                        ...updatePayload,
                        attempt_count: newAttempts,
                        last_attempt_at: now,
                        next_called_at: nextCallTime,
                        assigned_to: user?.uid,
                        disposition: disposition,
                        sub_disposition: subDisposition
                    };
                    logNextCalledAt = nextCallTime;
                    logAssignedTo = user?.uid;
                    logStatus = 'active';
                } else {
                    updatePayload = {
                        ...updatePayload,
                        attempt_count: 0,
                        last_attempt_at: null,
                        next_called_at: null,
                        assigned_to: null,
                        status: 'active',
                        disposition: disposition,
                        sub_disposition: subDisposition
                    };
                    logStatus = 'active';
                }

                const { error: customerUpdateError } = await supabase
                    .from('customers')
                    .update(updatePayload)
                    .eq('id', customerId);

                if (customerUpdateError) throw customerUpdateError;

            } else {
                // Regular Update (Call Back, etc.)
                const isFollowup = disposition === 'Call Back' || subDisposition === 'intrested' || subDisposition === 'follow up';
                
                let updatePayload: any = { 
                    disposition: disposition,
                    sub_disposition: subDisposition,
                    is_connected: isConnected,
                    status: isFollowup ? 'followup' : 'active',
                    last_called_at: now,
                    updated_at: now,
                    last_updated_by: user?.uid,
                    assigned_to: (isFollowup) ? user?.uid : null
                };

                updatePayload.attempt_count = 0;
                updatePayload.last_attempt_at = null;

                if (disposition === 'Call Back' && callbackDate) {
                    const combinedDateTime = callbackTime 
                        ? new Date(`${callbackDate}T${callbackTime}`).toISOString()
                        : new Date(callbackDate).toISOString();
                    updatePayload.expiry_date = combinedDateTime;
                    updatePayload.next_called_at = combinedDateTime;
                    logNextCalledAt = combinedDateTime;
                } else {
                    updatePayload.next_called_at = null;
                }

                logStatus = updatePayload.status;
                logAssignedTo = updatePayload.assigned_to;

                const { error: customerUpdateError } = await supabase
                    .from('customers')
                    .update(updatePayload)
                    .eq('id', customerId);

                if (customerUpdateError) throw customerUpdateError;
            }

            // 1. Save Call Log (Moved here to include calculated metadata)
            const { error: logError } = await supabase
                .from('call_logs')
                .insert({
                    customer_id: customerId,
                    campaign_id: campaignId,
                    agent_id: user?.uid,
                    last_updated_by: user?.uid,
                    disposition: disposition,
                    sub_disposition: subDisposition,
                    is_connected: isConnected,
                    notes: notes,
                    duration: callDuration,
                    last_called_at: now,
                    updated_at: now,
                    next_called_at: logNextCalledAt,
                    status: logStatus,
                    assigned_to: logAssignedTo
                });

            if (logError) throw logError;

            // 2.5 Check if this is a manual call before clearing session
            let isManualCall = false;
            let preservedCampaignId = null;
            let preservedCustomerId = null;

            if (user?.uid) {
                const { data: currentSession } = await supabase
                    .from('call_sessions')
                    .select('is_manual, campaign_id, customer_id')
                    .eq('user_id', user.uid)
                    .single();

                if (currentSession) {
                    isManualCall = currentSession.is_manual || false;
                    preservedCampaignId = currentSession.campaign_id;
                    preservedCustomerId = currentSession.customer_id;
                    console.log('[Disposition] Current session check:', { isManualCall, preservedCampaignId, preservedCustomerId });
                }
            }

            // 3. Handle Manual Call vs CRM Call differently
            if (isManualCall) {
                // Manual Call: Just redirect back to the preserved CRM lead
                console.log('[Disposition] Manual call detected. Redirecting to preserved lead:', preservedCustomerId);
                
                // Update the session to mark manual call as complete (is_manual=false, status=assigned)
                if (user?.uid) {
                    await supabase.from('call_sessions').update({
                        is_manual: false,
                        status: 'assigned',
                        updated_at: new Date().toISOString()
                    }).eq('user_id', user.uid);
                }

                // Redirect to the preserved CRM lead
                if (preservedCampaignId && preservedCustomerId) {
                    router.push(`/campaign/${preservedCampaignId}/${preservedCustomerId}`);
                } else {
                    router.push(`/campaign/${campaignId}`);
                }
                setSaving(false);
                return;
            } else {
                // CRM Call: Clear session and run auto-assignment
                if (user?.uid) {
                    await supabase.from('call_sessions').delete().eq('user_id', user.uid);
                }

                // Automated Re-assignment Flow
                const { data: nextLeadId, error: reassignError } = await supabase.rpc('assign_next_lead', {
                    p_campaign_id: campaignId,
                    p_user_id: user?.uid
                });

                if (reassignError) {
                    console.error("Auto-assignment failed:", reassignError);
                    // Fallback to dashboard if re-assignment fails
                    router.push(`/campaign/${campaignId}`);
                    return;
                }

                if (nextLeadId && user?.uid) {
                    // Update session to 'assigned' for the NEW lead
                    await supabase.from('call_sessions').upsert({
                        user_id: user.uid,
                        campaign_id: campaignId,
                        customer_id: nextLeadId,
                        status: 'assigned',
                        updated_at: new Date().toISOString()
                    });
                    
                    // Redirect to the next lead automatically
                    router.push(`/campaign/${campaignId}/${nextLeadId}`);
                    // Note: useEffect will handle fetchData() for the new lead
                    setSaving(false);
                    return; 
                } else {
                    // No more leads or No user, go to dashboard
                    router.push(`/campaign/${campaignId}`);
                    setSaving(false);
                    return;
                }
            }

            // If we reached here, no automatic redirection happened (standard fallback or different flow)
            fetchData();
            setPostCall(false);
            setDisposition("");
            setSubDisposition("");
            setNotes("");
            setCallDuration(0);
            setCallbackDate("");
            setCallbackTime("");
           
        } catch (err: any) {
            console.error("Error saving disposition:", err);
            alert("Failed to save disposition. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8faff]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-[#4b33e8]"></div>
                    <p className="text-sm font-semibold text-slate-400 animate-pulse uppercase tracking-widest">Initialising Session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f8fafc", maxWidth: "100vw" }}>
            <Sidebar activeNav="campaign" />
            
            <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
                <Header 
                    user={user ? {
                        displayName: user.displayName,
                        email: user.email,
                        employeeId: user.employeeId,
                        profilePicUrl: user.profilePicUrl
                    } : undefined} 
                    onLogout={() => handleLogout(router)} 
                />
                
                <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f8fafc" }}>
                    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-12 max-w-7xl">
                        
                        {/* 1. Header & Navigation */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    <button onClick={() => router.push('/campaign')} className="hover:text-indigo-600 transition-colors">Campaigns</button>
                                    <span className="opacity-30">/</span>
                                    <button onClick={() => router.push(`/campaign/${campaignId}`)} className="hover:text-indigo-600 transition-colors">{campaign?.name || 'Campaign'}</button>
                                    <span className="opacity-30">/</span>
                                    <span className="text-indigo-500">{customer?.lead_id}</span>
                                </div>
                                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Call Interface
                                </h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-400">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div className="h-8 w-px bg-slate-200 mx-1" />
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-semibold text-slate-400 ">Active Operator</p>
                                    <p className="text-xs font-semibold text-slate-700">{user?.displayName}</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Primary Customer Profile Card */}
                        <div className="relative mb-6 rounded-3xl bg-white border border-slate-100 overflow-hidden group">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute top-12 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="relative z-10 p-6 sm:p-10">
                                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">
                                    {/* Profile Meta */}
                                    <div className="flex items-center gap-6 sm:gap-8">
                                        <div className="relative">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-2xl sm:text-2xl font-semibold shadow-2xl shadow-indigo-200 transform group-hover:scale-105 transition-all duration-500">
                                                {customer?.customer_name?.charAt(0) || 'C'}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-indigo-600">
                                                <i className="fi flex  fi-rr-star text-xs"></i>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-2xl sm:text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                                    {customer?.customer_name || 'Anonymous Customer'}
                                                </h2>
                                                <span className={`px-3 py-1 rounded-xl text-[10px] font-semibold  ${
                                                    customer?.status === 'followup' 
                                                    ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                    {customer?.status || 'Active'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <i className="fi flex  fi-rr-id-badge text-indigo-400"></i>
                                                    <span>{customer?.lead_id}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <div className="flex items-center gap-1.5">
                                                    <i className="fi flex  fi-rr-phone-call text-indigo-400"></i>
                                                    <span>{customer?.phone_no || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 w-full xl:w-auto pt-6 xl:pt-0 border-t xl:border-t-0 xl:border-l border-slate-100 xl:pl-12">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-semibold text-slate-400 ">Experience</p>
                                            <div className="flex flex-col">
                                                <span className="text-base font-semibold text-slate-800">{customer?.disposition || 'Fresh Lead'}</span>
                                                <span className="text-[10px] text-slate-400">Past Interaction</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-semibold text-slate-400 ">Valid Until</p>
                                            <div className="flex flex-col">
                                                <span className="text-base font-semibold text-slate-800">
                                                    {formatDate(customer?.expiry_date)}
                                                </span>
                                                <span className="text-[10px] text-slate-400">Expiry Schedule</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <p className="text-[10px] font-semibold text-slate-400 ">Campaign</p>
                                            <div className="flex flex-col">
                                                <span className="text-base font-semibold text-indigo-600 line-clamp-1">{campaign?.name || 'N/A'}</span>
                                                <span className="text-[10px] text-slate-400 uppercase">Current Source</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Tags Area */}
                                {customer?.utilities && (
                                    <div className="mt-10 pt-10 border-t border-slate-50">
                                        <div className="flex items-center gap-3 mb-6">
                                            <i className="fi flex  fi-rr-layers text-indigo-500"></i>
                                            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-[0.2em]">Extended Profile Data</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {(() => {
                                                const data = typeof customer.utilities === 'string' ? JSON.parse(customer.utilities) : customer.utilities;
                                                return Object.entries(data).slice(0, 8).map(([key, value]) => (
                                                    <div key={key} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                                                        <p className="text-[12px] font-semibold text-slate-400  mb-1 truncate">{key.replace(/_/g, ' ')}</p>
                                                        <p className="text-xs font-semibold text-slate-800 truncate">{String(value)}</p>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Main Action Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* CALLING INTERFACE (Left) */}
                            <div className="lg:col-span-8 space-y-6">
                                
                                {/* The Call Engine */}
                                <div className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 transition-all duration-1000 ${
                                    isCalling 
                                    ? 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 ' 
                                    : 'bg-white border border-slate-100'
                                }`}>
                                    {/* Animated Background effects for active call */}
                                    {isCalling && (
                                        <>
                                            <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full animate-pulse blur-[120px]" />
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                                        </>
                                    )}

                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            {/* Dynamic Icon Container */}
                                            <div className={`relative group`}>
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-700 ${
                                                    isCalling 
                                                    ? 'bg-white text-indigo-600 animate-bounce shadow-2xl' 
                                                    : 'bg-indigo-50 text-indigo-500 border border-indigo-100 group-hover:scale-105 group-hover:rotate-6'
                                                }`}>
                                                    <i className={`fi fi-rr-${isCalling ? 'headset' : 'phone-call'}`}></i>
                                                </div>
                                                {isCalling && (
                                                    <div className="" />
                                                )}
                                            </div>

                                            <div className="text-center md:text-left space-y-2">
                                                <h4 className={`text-2xl font-extrabold tracking-tight ${isCalling ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                                    {isCalling ? 'Call Active' : postCall ? 'Session Ended' : 'Ready to Connect'}
                                                </h4>
                                                <div className="flex items-center justify-center md:justify-start gap-3">
                                                   
                                                    <p className={`text-[11px] font-semibold tracking-[0.2em] ${isCalling ? 'text-indigo-100' : 'text-slate-400'}`}>
                                                        {isCalling ? 'Voice transmission live' : 'System standby • Waiting for operator'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Action Area */}
                                        <div className="flex flex-col items-center md:items-end gap-2">
                                            {isCalling ? (
                                                <div className="flex flex-col md:flex-row items-center gap-6">
                                                    <div className="text-center md:text-right px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                                                        <p className="text-2xl font-semibold text-white lining-nums tabular-nums tracking-tighter">
                                                            {formatTime(callDuration)}
                                                        </p>
                                                        <p className="text-[12px] font-semibold  text-indigo-200">Live Duration</p>
                                                    </div>
                                                    <button 
                                                        onClick={handleEndCall}
                                                        className="h-14 px-7 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 transition-all hover:-translate-y-1 active:translate-y-0 group"
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <i className="fi flex  fi-rr-phone-slash text-lg group-hover:rotate-12 transition-transform"></i>
                                                            End Call
                                                        </span>
                                                    </button>
                                                </div>
                                            ) : !postCall ? (
                                                <button 
                                                    onClick={handleStartCall}
                                                    className="h-14 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 group"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <i className="fi flex  fi-rr-phone-call text-sm"></i>
                                                    </div>
                                                    Start Calling
                                                </button>
                                            ) : (
                                                <div className="px-6 py-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-semibold ">
                                                    Session complete • Save Outcome
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Display & Form Area */}
                                <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
                                    {/* INFO CARD */}
                                    <div className="xl:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 relative overflow-hidden h-[800px] flex flex-col">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-bl-[3rem] -z-0" />
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 flex items-center justify-center text-white">
                                                    <i className="fi flex  fi-rr-document text-sm"></i>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">Policy Details</h3>
                                                    <p className="text-[10px] font-semibold text-slate-400 ">Reference Data</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                                {renderCleanedDetails(customer?.customer_details)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* OUTCOME FORM */}
                                    <div className={`xl:col-span-4 bg-white rounded-3xl p-8 border border-slate-100 relative overflow-hidden transition-opacity duration-500 h-[800px] flex flex-col ${!postCall ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-bl-[3rem] -z-0" />
                                        <div className="relative z-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-purple-600 shadow-lg shadow-purple-100 flex items-center justify-center text-white">
                                                    <i className="fi flex  fi-rr-check-circle text-sm"></i>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Set Outcome</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post-Call Disposition</p>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                {/* Primary Dispositions */}
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Status</p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                        {primaryDispositions.map((item) => (
                                                            <button
                                                                key={item}
                                                                onClick={() => {
                                                                    setDisposition(item);
                                                                    setSubDisposition(""); 
                                                                }}
                                                                className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                                    disposition === item 
                                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' 
                                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-sm'
                                                                }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Sub Dispositions (Conditional) */}
                                                {disposition && dispositionHierarchy[disposition]?.length > 0 && (
                                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest pl-1 text-[10px]">Reason / Type</p>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {dispositionHierarchy[disposition].map((sub) => (
                                                                <button
                                                                    key={sub}
                                                                    onClick={() => setSubDisposition(sub)}
                                                                    className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                                        subDisposition === sub 
                                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' 
                                                                        : 'bg-white text-indigo-500 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-sm'
                                                                    }`}
                                                                >
                                                                    {sub}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Call Back Scheduling (Modern Version) */}
                                                {disposition === 'Call Back' && (
                                                    <div className="space-y-5 p-6 rounded-3xl bg-indigo-50/40 border border-indigo-100/50 backdrop-blur-sm animate-in zoom-in-95 duration-500 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                                                        
                                                        <div className="flex items-center justify-between relative z-10">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                                                    <i className="fi flex fi-rr-calendar-clock text-xs"></i>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest leading-none mb-1">Schedule Call</p>
                                                                    <p className="text-[12px] font-semibold text-slate-400">
                                                                        {callbackDate ? `Interaction set for ${formatDate(callbackDate)}` : 'Next interaction timeline'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quick Presets */}
                                                         <div className="flex flex-wrap gap-3 relative z-10">
                                                             {[
                                                                 { 
                                                                     label: '10 Min', 
                                                                     icon: 'clock', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         now.setMinutes(now.getMinutes() + 10);
                                                                         const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                         setCallbackTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                                                     }
                                                                 },
                                                                 { 
                                                                     label: 'In 1 Hr', 
                                                                     icon: 'clock-three', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         now.setHours(now.getHours() + 1);
                                                                         const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                         setCallbackTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                                                     }
                                                                 },
                                                                 { 
                                                                     label: '3 Hr', 
                                                                     icon: 'stopwatch', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         now.setHours(now.getHours() + 3);
                                                                         const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                         setCallbackTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                                                     }
                                                                 },
                                                                 { 
                                                                     label: 'Today', 
                                                                     icon: 'calendar-day', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                     }
                                                                 },
                                                                 { 
                                                                     label: 'Tomorrow', 
                                                                     icon: 'sunrise', 
                                                                     action: () => {
                                                                         const tomorrow = new Date();
                                                                         tomorrow.setDate(tomorrow.getDate() + 1);
                                                                         const localDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                     }
                                                                 }
                                                             ].map((preset) => (
                                                                <button
                                                                    key={preset.label}
                                                                    type="button"
                                                                    onClick={preset.action}
                                                                    className="px-3 py-1.5 rounded-xl bg-white border border-indigo-100 text-[12px] font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5"
                                                                >
                                                                    <i className={`fi flex fi-rr-${preset.icon} text-[10px]`}></i>
                                                                    {preset.label}
                                                                </button>
                                                            ))}
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                                            <div className="relative group/date">
                                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                                                                    <i className="fi flex fi-rr-calendar text-slate-400 text-[12px]"></i>
                                                                </div>
                                                                <div className="w-full h-[30px] bg-white rounded-full pl-9 pr-3 text-[10px] font-bold text-slate-700 border border-slate-100 flex items-center group-hover/date:border-indigo-200 transition-all uppercase tracking-tight">
                                                                    {callbackDate ? formatDate(callbackDate) : 'DD/MM/YY'}
                                                                </div>
                                                                <input 
                                                                    type="date" 
                                                                    value={callbackDate}
                                                                    onChange={(e) => setCallbackDate(e.target.value)}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                                                    style={{ colorScheme: 'light' }}
                                                                />
                                                            </div>

                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                    <i className="fi flex fi-rr-clock-three text-slate-400 text-[12px]"></i>
                                                                </div>
                                                                <input 
                                                                    type="time" 
                                                                    value={callbackTime}
                                                                    onChange={(e) => setCallbackTime(e.target.value)}
                                                                    className="w-full h-[30px] bg-white rounded-full pl-9 pr-3 text-[10px] font-bold text-slate-700 border border-slate-100 focus:border-indigo-200 outline-none transition-all uppercase tracking-tight [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                                    style={{ colorScheme: 'light' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-3">
                                                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1">Session Notes</p>
                                                    <textarea 
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="Add specific details about the conversation..."
                                                        className="w-full bg-slate-50/50 rounded-2xl p-4 text-xs font-semibold border border-slate-100 focus:ring-2 focus:ring-indigo-100 focus:bg-white focus:outline-none transition-all min-h-[100px] resize-none"
                                                    />
                                                </div>

                                                <button 
                                                    disabled={saving || !postCall}
                                                    onClick={handleSaveDisposition}
                                                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-slate-900 text-white font-semibold text-xs uppercase tracking-[0.2em] shadow-xl transition-all disabled:opacity-50"
                                                >
                                                    {saving ? 'Processing...' : 'Save & Continue'}
                                                </button>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ACTIVITY SIDEBAR (Right) */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 h-[800px] flex flex-col">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white">
                                                <i className="fi flex  fi-rr-time-past text-sm"></i>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800">Timeline</h3>
                                                <p className="text-[10px] font-semibold text-slate-400 ">History</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-semibold text-slate-400 border border-slate-100">
                                            {history.length}
                                        </div>
                                    </div>

                                    <div className="h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                        {history.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale py-20">
                                                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                                    <i className="fi flex  fi-rr-box-open text-2xl"></i>
                                                </div>
                                                <p className="text-xs font-semibold ">No Activity Yet</p>
                                            </div>
                                        ) : (
                                            <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                                                {history.map((log: any) => (
                                                    <div key={log.id} className="relative">
                                                        {/* Timeline Marker */}
                                                        <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                                                            log.disposition === 'Deal Done' ? 'bg-green-500' :
                                                            log.disposition === 'Call Back' ? 'bg-amber-500' :
                                                            log.disposition === 'Not Contactable' ? 'bg-red-400' :
                                                            'bg-indigo-500'
                                                        }`} />
                                                        
                                                        <div className="space-y-2">
                                                            {/* Header: Disposition + Date */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-xs font-bold uppercase tracking-tight ${
                                                                        log.disposition === 'Deal Done' ? 'text-green-600' :
                                                                        log.disposition === 'Call Back' ? 'text-amber-600' :
                                                                        log.disposition === 'Not Contactable' ? 'text-red-500' :
                                                                        'text-slate-900'
                                                                    }`}>{log.disposition || 'N/A'}</span>
                                                                    {log.sub_disposition && (
                                                                        <span className="text-[12px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                                            {log.sub_disposition}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[10px] font-semibold text-slate-400">
                                                                    {formatDate(log.created_at)}
                                                                </span>
                                                            </div>

                                                            {/* Content Card */}
                                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all space-y-3">
                                                                {/* Notes */}
                                                                {log.notes && (
                                                                    <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                                                                        "{log.notes}"
                                                                    </p>
                                                                )}

                                                                {/* Metadata Grid */}
                                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                                                   
                                                                    {/* Next Follow Up */}
                                                                    {log.next_called_at && (
                                                                        <div className="flex items-center gap-1.5 col-span-2">
                                                                            
                                                                            <div className="flex grid">
                                                                                <span className="text-[12px] flex font-semibold text-slate-400"> <i className="fi flex mr-2 fi-rr-calendar-clock text-[12px] text-amber-400"></i> Follow Up: </span>
                                                                                <span className="text-[12px] font-bold text-amber-600">
                                                                                    {new Date(log.next_called_at).toLocaleString('en-IN', {
                                                                                        day: '2-digit',
                                                                                        month: 'short',
                                                                                        year: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Duration + Time */}
                                                                <div className="flex items-center gap-3 pt-2">
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[12px] font-semibold uppercase">
                                                                        <i className="fi flex fi-rr-clock-three"></i>
                                                                        {formatTime(log.duration || 0)}
                                                                    </div>
                                                                    <span className="text-[12px] font-semibold text-slate-300">
                                                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                             {/* Agent */}
                                                                    <div className="flex items-center gap-1.5">
                                                                        <i className="fi flex fi-rr-user mt-1 text-[12px] text-indigo-400"></i>
                                                                        <div className="truncate">
                                                                            <span className="text-[12px] font-semibold text-slate-400">Agent: </span>
                                                                            <span className="text-[12px] font-bold text-slate-600">
                                                                                {log.agent?.user_name || 'N/A'}
                                                                                {log.agent?.employee_id && (
                                                                                    <span className="text-slate-400"> ({log.agent.employee_id})</span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Last Updated By */}
                                                                    <div className="flex items-center gap-1.5">
                                                                        <i className="fi flex fi-rr-pencil mt-1 text-[12px] text-purple-400"></i>
                                                                        <div className="truncate">
                                                                            <span className="text-[12px] font-semibold text-slate-400">Updated: </span>
                                                                            <span className="text-[12px] font-bold text-slate-600">
                                                                                {log.updater?.user_name || 'N/A'}
                                                                                {log.updater?.employee_id && (
                                                                                    <span className="text-slate-400"> ({log.updater.employee_id})</span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>



                                                            
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-8 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                                <i className="fi flex  fi-rr-phone-call text-xs"></i>
                                            </div>
                                            <span className="text-[10px] font-semibold ">Total Connects</span>
                                        </div>
                                        <span className="text-sm font-semibold">{history.filter(h => h.duration > 0).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <BottomNav activeNav="campaign" userRole={user?.role || null} />
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
