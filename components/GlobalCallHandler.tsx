import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function GlobalCallHandler() {
    const router = useRouter();
    const lastNavigatedCustomerId = useRef<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

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

            // List of events that indicate a call is starting or dialled
            // Including 'connecting' and 'call_connected' for maximum sensitivity
            const isDialEvent = eventType === 'connecting' || 
                              eventType === 'connected' ||
                              eventType === 'call_to' || 
                              eventType === 'dial';

            if (isDialEvent && phoneNo) {
                // 1. Normalize phone to last 10 digits
                const cleanPhone = String(phoneNo).replace(/\D/g, '').slice(-10);
                if (!cleanPhone || cleanPhone.length < 10) return;

                console.log(`[Global-Call] Detect Dial Event: ${eventType} for ${cleanPhone}`);

                // 2. Search for the lead
                try {
                    const response = await fetch(`/api/customer/find-by-phone?phone=${cleanPhone}`);
                    const result = await response.json();

                    if (result.success && result.lead) {
                        const { id: customerId, campaign_id: campaignId } = result.lead;
                        
                        // 3. Optimistic Navigation Guard
                        if (lastNavigatedCustomerId.current === customerId) return;
                        
                        const currentPath = router.asPath;
                        const targetPath = `/campaign/${campaignId}/${customerId}`;
                        
                        if (!currentPath.includes(customerId)) {
                            console.log(`[Global-Call] 🚀 INSTANT REDIRECT to found lead: ${customerId}`);
                            
                            // Track to prevent loops
                            lastNavigatedCustomerId.current = customerId;
                            
                            // Navigate IMMEDIATELY
                            router.push(targetPath);
                            
                            // Update session in background so we don't block the UI
                            updateSessionInBackground(campaignId, customerId);

                            // Reset the guard after some time
                            setTimeout(() => { lastNavigatedCustomerId.current = null; }, 5000);
                        }
                    }
                } catch (err) {
                    console.error("[Global-Call] Error searching for lead:", err);
                }
            }
        };

        window.addEventListener('tfc-bridge-message' as any, handleBridgeMessage);
        return () => window.removeEventListener('tfc-bridge-message' as any, handleBridgeMessage);
    }, [router]);

    return null;
}
