import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function SessionRedirect() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const lastRedirectedPath = useRef<string | null>(null);
    const lastRedirectTimestamp = useRef<number>(0);

    // Stable redirect function
    const applyRedirect = useCallback((session: any) => {
        if (!session) return;
            
        // DUAL SESSION LOGIC: Determine which context is "HOT" (Active or Pending)
        // PRIORITY RULE: Manual sessions take priority over System sessions
        const isManualHot = (session.manual_status === 'active' || session.manual_status === 'disposition_pending');
        const isSystemHot = (session.status === 'active' || session.status === 'disposition_pending');

        if (isManualHot || isSystemHot) {
            // Priority: Manual > System
            const useManual = isManualHot;
            const campaignId = (useManual && session.manual_campaign_id) ? session.manual_campaign_id : session.campaign_id;
            const customerId = (useManual && session.manual_customer_id) ? session.manual_customer_id : session.customer_id;

            if (campaignId && customerId) {
                const targetPath = `/portal/campaign/${campaignId}/${customerId}`;
                const currentPath = router.asPath.split('?')[0].replace(/\/$/, "");
                const normalizedTarget = targetPath.replace(/\/$/, "");

                const now = Date.now();
                const stabilityCooldown = 3000; 

                if (currentPath !== normalizedTarget && 
                    (lastRedirectedPath.current !== normalizedTarget || (now - lastRedirectTimestamp.current) > stabilityCooldown)) {
                    
                    console.log(`[Redirect] 🚀 Forced redirection to HOT session (${useManual ? 'Manual' : 'System'}): ${normalizedTarget}`);
                    lastRedirectedPath.current = normalizedTarget;
                    lastRedirectTimestamp.current = now;
                    router.replace(normalizedTarget);
                    
                    setTimeout(() => { lastRedirectedPath.current = null; }, 5000);
                }
            }
        } else {
            // NO HOT SESSIONS FOUND:
            // If the status is just 'assigned', we intentionally DO NOT forcedly redirect.
            // This allows the agent to navigate the dashboard/portal freely until they actually start a call.
            console.log(`[Redirect] Session is parked (Status: ${session.status}, Manual: ${session.manual_status}). Navigation allowed.`);
        }
    }, [router]);

    // Initial check
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) return;
            setUserId(session.user.id);
            
            if (router.isReady && !router.pathname.includes("/login")) {
                const { data } = await supabase
                    .from('call_sessions')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                if (data) {
                    applyRedirect(data);
                }
            }
        };
        init();
    }, [router.isReady, applyRedirect]);

    // Real-time listener for session changes
    useEffect(() => {
        if (!userId) return;

        console.log(`[Realtime-Redirect] Monitoring session for: ${userId}`);
        
        const channel = supabase
            .channel(`session_sync_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'call_sessions',
                    filter: `user_id=eq.${userId}`
                },
                (payload: any) => {
                    console.log('[Realtime-Redirect] New session:', payload.new);
                    applyRedirect(payload.new);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'call_sessions',
                    filter: `user_id=eq.${userId}`
                },
                (payload: any) => {
                    console.log('[Realtime-Redirect] Session updated:', payload.new);
                    applyRedirect(payload.new);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'call_sessions',
                    filter: `user_id=eq.${userId}`
                },
                (payload: any) => {
                    console.log('[Realtime-Redirect] Session deleted:', payload.old);
                    // Handle EXIT on deletion
                    const currentPath = router.asPath;
                    const pathParts = currentPath.split('/').filter(p => Boolean(p) && p !== 'portal');
                    if (pathParts[0] === 'campaign' && pathParts.length >= 3) {
                         const campaignIdInPath = pathParts[1];
                         const deletedCampaignId = payload.old?.campaign_id;
                         if (!deletedCampaignId || campaignIdInPath === deletedCampaignId) {
                             console.log(`[Realtime-Redirect] Session deleted. Returning to dashboard.`);
                             router.push('/portal/campaign');
                         }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, applyRedirect, router]);

    return null;
}
