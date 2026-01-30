import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { globalBridgeLogger } from "../lib/bridgeLogger";

export default function GlobalCallHandler() {
    const router = useRouter();
    const lastNavigatedCustomerId = useRef<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        console.log("[Global-Call] 🟢 GlobalCallHandler mounted and listening for bridge messages.");

        const updateSessionInBackground = async (campaignId: string, customerId: string) => {
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
                            status: 'active'
                        })
                    });
                    console.log(`[Global-Call] Session updated to active in background for ${customerId}`);
                }
            } catch (err) {
                console.error("[Global-Call] Failed to update session in background:", err);
            }
        };

        const handleBridgeMessage = async (e: any) => {
            const data = e.detail;
            const eventType = data?.type;
            const phoneNo = data?.value;

            // Log to internal Bridge Logger for Settings > Bridge Tab visibility
            if (eventType) {
                globalBridgeLogger.addLog('in', `global_${eventType}`, phoneNo);
            }

            // Verbose logging for ALL bridge messages to confirm bridge is working
            console.log(`[Bridge-Debug] Message received: type="${eventType}", value="${phoneNo}"`);

            // List of events that indicate a call is starting or dialled
            const isDialEvent = eventType === 'connecting' || 
                              eventType === 'connected' ||
                              eventType === 'call_to' || 
                              eventType === 'dial';

            if (isDialEvent && phoneNo) {
                // 1. Normalize phone to last 10 digits
                const cleanPhone = String(phoneNo).replace(/\D/g, '').slice(-10);
                if (!cleanPhone || cleanPhone.length < 10) {
                    console.log(`[Global-Call] ⚠️ Invalid phone number format: "${phoneNo}". Ignoring.`);
                    return;
                }

                console.log(`[Global-Call] 🎯 Detect Dial Event: ${eventType} for ${cleanPhone}`);

                // 2. Search for the lead
                try {
                    console.log(`[Global-Call] 🔍 Searching database for lead with phone: ${cleanPhone}...`);
                    const response = await fetch(`/api/customer/find-by-phone?phone=${cleanPhone}`);
                    const result = await response.json();

                    if (result.success && result.lead) {
                        const { id: customerId, campaign_id: campaignId } = result.lead;
                        console.log(`[Global-Call] ✅ Lead Found! ID: ${customerId}, Campaign: ${campaignId}`);
                        
                        // 3. Optimistic Navigation Guard
                        if (lastNavigatedCustomerId.current === customerId) {
                            console.log(`[Global-Call] 🛡️ Redirection guard: Already redirected to ${customerId} recently. Skipping.`);
                            return;
                        }
                        
                        const currentPath = router.asPath;
                        const targetPath = `/campaign/${campaignId}/${customerId}`;
                        
                        if (!currentPath.includes(customerId)) {
                            console.log(`[Global-Call] 🚀 REDIRECTING to: ${targetPath}`);
                            
                            // Track to prevent loops
                            lastNavigatedCustomerId.current = customerId;
                            
                            // Navigate IMMEDIATELY
                            router.push(targetPath);
                            
                            // Update session in background so we don't block the UI
                            console.log(`[Global-Call] 🔄 Updating session to 'active' in background...`);
                            updateSessionInBackground(campaignId, customerId);

                            // Reset the guard after some time
                            setTimeout(() => { 
                                console.log(`[Global-Call] 🛡️ Redirection guard reset for next calls.`);
                                lastNavigatedCustomerId.current = null; 
                            }, 5000);
                        } else {
                            console.log(`[Global-Call] ℹ️ Agent is already on the target lead page: ${customerId}`);
                        }
                    } else {
                        console.log(`[Global-Call] ❌ No lead found in CRM for phone: ${cleanPhone}`);
                    }
                } catch (err) {
                    console.error("[Global-Call] 💥 Error during lead search/redirection:", err);
                }
            }
        };

        window.addEventListener('tfc-bridge-message' as any, handleBridgeMessage);
        return () => window.removeEventListener('tfc-bridge-message' as any, handleBridgeMessage);
    }, [router]);

    return null;
}
