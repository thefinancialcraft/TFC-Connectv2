import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { checkAuthAndFetchProfile } from "../lib/authService";
import { supabase } from "../lib/supabase";

export default function SessionRedirect() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const lastRedirectedPath = useRef<string | null>(null);

    // Stable redirect function
    const applyRedirect = useCallback((session: any) => {
        if (!session) return;
        
        // DUAL SESSION LOGIC: 
        // If is_manual is true, use manual columns, otherwise use primary columns
        const isManual = session.is_manual === true;
        const status = isManual ? (session.manual_status || session.status) : session.status;
        const campaignId = (isManual && session.manual_campaign_id) ? session.manual_campaign_id : session.campaign_id;
        const customerId = (isManual && session.manual_customer_id) ? session.manual_customer_id : session.customer_id;

        if (status === 'active' || status === 'disposition_pending') {
            const targetPath = `/campaign/${campaignId}/${customerId}`;
            const currentPath = router.asPath.split('?')[0].replace(/\/$/, "");
            const normalizedTarget = targetPath.replace(/\/$/, "");

            console.log(`[Redirect-Debug] Mode: ${isManual ? 'MANUAL' : 'PRIMARY'}, Current: "${currentPath}", Target: "${normalizedTarget}"`);

            if (currentPath !== normalizedTarget && lastRedirectedPath.current !== normalizedTarget) {
                console.log(`[Redirect] 🚀 Redirection triggered to: ${normalizedTarget}`);
                lastRedirectedPath.current = normalizedTarget;
                router.replace(normalizedTarget);
                
                setTimeout(() => { lastRedirectedPath.current = null; }, 2000);
            }
        } else {
            // EXIT LOGIC: If session is no longer active/pending, and we are ON that campaign's lead profile, leave.
            const currentPath = router.asPath;
            const pathParts = currentPath.split('/').filter(Boolean);
            if (pathParts[0] === 'campaign' && pathParts.length >= 3) {
                const campaignIdInPath = pathParts[1];
                if (campaignIdInPath === session.campaign_id) {
                    console.log(`[Redirect] 🏠 Session status for ${session.campaign_id} is "${status}". Exiting profile.`);
                    router.push(`/campaign/${session.campaign_id}`);
                }
            }
        }
    }, [router]);

    // Initial check
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                setUserId(session.user.id);
            }
            
            if (router.isReady && router.pathname !== "/login") {
                const result = await checkAuthAndFetchProfile();
                if (result.user?.currentCallSession) {
                    applyRedirect(result.user.currentCallSession);
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
                    const pathParts = currentPath.split('/').filter(Boolean);
                    if (pathParts[0] === 'campaign' && pathParts.length >= 3) {
                         const campaignIdInPath = pathParts[1];
                         const deletedCampaignId = payload.old?.campaign_id;
                         if (!deletedCampaignId || campaignIdInPath === deletedCampaignId) {
                             console.log(`[Realtime-Redirect] Session deleted. Returning to dashboard.`);
                             router.push('/campaign');
                         }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, applyRedirect]);

    return null;
}
