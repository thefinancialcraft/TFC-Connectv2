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
        
        const { status, campaign_id, customer_id } = session;
        if (status === 'active' || status === 'disposition_pending') {
            const targetPath = `/campaign/${campaign_id}/${customer_id}`;
            const currentPath = router.asPath.split('?')[0].replace(/\/$/, "");
            const normalizedTarget = targetPath.replace(/\/$/, "");

            if (currentPath !== normalizedTarget && lastRedirectedPath.current !== normalizedTarget) {
                console.log(`[Redirect] Enforcing session: ${status}. Target: ${normalizedTarget}`);
                lastRedirectedPath.current = normalizedTarget;
                router.replace(normalizedTarget);
                
                // Clear the ref after redirect to allow future navigations if session changes again
                setTimeout(() => { lastRedirectedPath.current = null; }, 2000);
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
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, applyRedirect]);

    return null;
}
