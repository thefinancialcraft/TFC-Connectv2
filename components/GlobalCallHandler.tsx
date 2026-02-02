import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { globalBridgeLogger } from "../lib/bridgeLogger";
import { useUser } from "../context/UserContext";

export default function GlobalCallHandler() {
    const router = useRouter();
    const { user } = useUser();
    const lastNavigatedCustomerId = useRef<string | null>(null);
    const lastAttemptRef = useRef<{id: string, time: number} | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        console.log("[Global-Call] 🟢 GlobalCallHandler mounted and listening for bridge messages.");

        const updateSessionInBackground = async (campaignId: string, customerId: string, status: string = 'active', isUnassigned: boolean = false) => {
            try {
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
                            status: status,
                            is_manual_event: true,  // This tells API to use manual_ columns
                            is_unassigned: isUnassigned
                        })
                    });
                    console.log(`[Global-Call] Session updated to ${status} (MANUAL, Unassigned=${isUnassigned}) in background for ${customerId}`);
                }
            } catch (err) {
                console.error("[Global-Call] Failed to update manual session:", err);
            }
        };

        const notifyLeadOwner = async (ownerId: string, customerName: string) => {
            if (!user) return;
            
            const channelName = `agent_notifications_${ownerId}`;
            console.log(`[Global-Call] 🔔 Notifying owner ${ownerId} about reach attempt to ${customerName}`);
            
            // 1. Persist to Database for persistence
            try {
                await supabase.from('notifications').insert({
                    user_id: ownerId,
                    type: 'lead_access',
                    message: `${user.displayName || user.employeeId} is trying to reach ${customerName}`,
                    actor_id: user.uid,
                    metadata: { 
                        customer_name: customerName,
                        actor_name: user.displayName,
                        employee_id: user.employeeId
                    }
                });
            } catch (err) {
                console.error("[Global-Call] Failed to save notification:", err);
            }

            // 2. Broadcast for real-time UI reaction (Immediate Signal)
            const notifyChannel = supabase.channel(channelName);
            await notifyChannel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await notifyChannel.send({
                        type: 'broadcast',
                        event: 'manual_lead_access',
                        payload: {
                            actor_id: user.uid,
                            actor_name: user.displayName || (user as any).user_name,
                            customer_name: customerName,
                            message: `${user.displayName || user.employeeId} is trying to reach ${customerName}`,
                            employee_id: user.employeeId
                        },
                    });
                    console.log(`[Global-Call] 🚀 Broadcast sent to ${channelName}`);
                }
            });
        };

        const handleBridgeMessage = async (e: any) => {
            const data = e.detail;
            const eventType = data?.type;
            const phoneNo = data?.value || data?.payload;

            // Log to internal Bridge Logger for Settings > Bridge Tab visibility
            if (eventType) {
                globalBridgeLogger.addLog('in', `global_${eventType}`, phoneNo);
            }

            // Verbose logging for ALL bridge messages to confirm bridge is working
            console.log(`[Bridge-Debug] Message received: type="${eventType}", value="${phoneNo}"`);

            const isDialEvent = eventType === 'connecting' || 
                              eventType === 'connected' ||
                              eventType === 'call_to' || 
                              eventType === 'dial';

            const isEndEvent = eventType === 'disconnected' || 
                             eventType === 'call_disconnected' ||
                             eventType === 'call_disconected' ||
                             eventType === 'call_disconnect';

            // STRICT CRM FLOW TOGGLE
            if (eventType === 'call_to') {
                console.log(`[Global-Call] 🛡️ CRM Call Initiated (call_to). Locking global handler.`);
                if (typeof window !== 'undefined') (window as any).isCrmCallActive = true;
                return; // Strictly Inactive
            }

            if (eventType === 'call_disconnect' || eventType === 'call_disconnected') {
                console.log(`[Global-Call] 🛡️ CRM Call Ended. Re-activating global handler.`);
                if (typeof window !== 'undefined') (window as any).isCrmCallActive = false;
                return; // Strictly Skip this end event for manual logic
            }

            // HARD BYPASS: if flag is true, ignore ALL other bridge events (connecting, connected, dial, etc.)
            if (typeof window !== 'undefined' && (window as any).isCrmCallActive) {
                console.log(`[Global-Call] 🛡️ Handler Bypassed: CRM call in progress (${eventType})`);
                return; 
            }

            if ((isDialEvent || isEndEvent) && phoneNo) {
                // 1. Clean phone number
                const cleanPhone = String(phoneNo).replace(/\D/g, '');
                if (!cleanPhone) return;

                console.log(`[Global-Call] 🎯 Detect ${isDialEvent ? 'Dial' : 'End'} Event: ${eventType} for ${cleanPhone}`);

                // 2. Search for the lead
                try {
                    const response = await fetch(`/api/customer/find-by-phone?phone=${cleanPhone}`);
                    const result = await response.json();

                    if (result.success && result.lead) {
                        const { id: customerId, campaign_id: campaignId, assigned_to: ownerId, customer_name: customerName } = result.lead;
                        
                        if (isDialEvent) {
                            // --- START CALL LOGIC ---
                            
                            // INCREMENT ATTEMPT COUNT (Manual/External Calls)
                            const now = Date.now();
                            const lastAttempt = lastAttemptRef.current;
                            if (!lastAttempt || lastAttempt.id !== customerId || (now - lastAttempt.time > 10000)) {
                                console.log(`[Global-Call] Incrementing attempt count for manual dial: ${customerId}`);
                                lastAttemptRef.current = { id: customerId, time: now };
                                try {
                                    supabase.rpc('increment_attempt_count', { p_customer_id: customerId })
                                            .then(({ error }) => {
                                                if(error) console.error("[Global-Call] RPC Error:", error);
                                            });
                                } catch (e) {
                                     console.error("[Global-Call] Attempt increment exception:", e);
                                }
                            }

                            // 3. Ownership Check
                            if (user) {
                                const currentUserId = user.uid || (user as any).id; 
                                if (ownerId && ownerId !== currentUserId) {
                                     notifyLeadOwner(ownerId, customerName);
                                }
                            }

                            // 4. Permission Check before navigation/session update
                            let isAuthorized = false;
                            try {
                                const { data: campData } = await supabase.from('campaigns').select('users').eq('id', campaignId).single();
                                if (campData?.users && user) {
                                    const assigned = Array.isArray(campData.users) ? campData.users : [];
                                    const uid = user.uid || (user as any).id;
                                    isAuthorized = assigned.some((u: any) => String(u.user_id) === String(uid));
                                }
                                if (user && !user.isClient) isAuthorized = true;
                            } catch (e) {
                                console.error("[Global-Call] Permission check failed:", e);
                            }

                            // 5. Navigate and Update (Now allowing unassigned but marking them)
                            if (lastNavigatedCustomerId.current === customerId) return;
                            
                            const currentPath = router.asPath;
                            const targetPath = `/campaign/${campaignId}/${customerId}`;
                            
                            if (!currentPath.includes(customerId)) {
                                console.log(`[Global-Call] 🚀 REDIRECTING to manual lead: ${targetPath}`);
                                
                                lastNavigatedCustomerId.current = customerId;
                                router.push(targetPath);
                                
                                // 6. Update Manual Session State to 'active'
                                // Mark as unassigned if user is not authorized for THIS campaign
                                await updateSessionInBackground(campaignId, customerId, 'active', !isAuthorized);

                                setTimeout(() => { lastNavigatedCustomerId.current = null; }, 5000);
                            }
                        } else {
                            // --- END CALL LOGIC ---
                            console.log(`[Global-Call] 🛑 Updating manual session to DISPOSITION_PENDING for ${customerId}`);
                            // Update session through API to trigger real-time sync on the page
                            await updateSessionInBackground(campaignId, customerId, 'disposition_pending');
                        }
                    }
                } catch (err) {
                    console.error("[Global-Call] Error searching/updating session:", err);
                }
            }
        };

        window.addEventListener('tfc-bridge-message' as any, handleBridgeMessage);
        return () => window.removeEventListener('tfc-bridge-message' as any, handleBridgeMessage);
    }, [router, user]);

    return null;
}
