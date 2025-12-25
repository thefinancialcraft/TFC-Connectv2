import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkAuthAndFetchProfile } from "../lib/authService";
import { supabase } from "../lib/supabase";

export default function SessionRedirect() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    // Initial check and set userId
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                setUserId(session.user.id);
            }
            if (router.isReady) {
                checkActiveSession();
            }
        };
        init();
    }, [router.isReady]);

    // Re-check on path changes
    useEffect(() => {
        if (router.isReady) {
            checkActiveSession();
        }
    }, [router.asPath]);

    const checkActiveSession = async () => {
        if (router.pathname === "/login") return;

        const result = await checkAuthAndFetchProfile();
        if (result.user) {
            applyRedirect(result.user.currentCallSession);
        }
    };

    const applyRedirect = (session: any) => {
        if (session && (session.status === 'active' || session.status === 'disposition_pending')) {
            const targetPath = `/campaign/${session.campaign_id}/${session.customer_id}`;
            const currentPath = router.asPath.split('?')[0].replace(/\/$/, "");
            const normalizedTarget = targetPath.replace(/\/$/, "");

            if (currentPath !== normalizedTarget) {
                console.log(`[Redirect] Enforcing session: ${session.status}. Target: ${normalizedTarget}`);
                router.replace(normalizedTarget);
            }
        }
    };

    // Real-time listener for session changes
    useEffect(() => {
        if (!userId) return;

        console.log(`[Realtime] Subscribing to session updates for: ${userId}`);
        
        const channel = supabase
            .channel(`public:call_sessions:user_id=eq.${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'call_sessions',
                    filter: `user_id=eq.${userId}`
                },
                (payload: any) => {
                    console.log('[Realtime] Session payload received:', payload);
                    const newSession = payload.new;
                    if (newSession) {
                        applyRedirect(newSession);
                    }
                }
            )
            .subscribe((status) => {
                console.log(`[Realtime] Subscription status: ${status}`);
            });

        return () => {
            console.log('[Realtime] Cleaning up subscription');
            supabase.removeChannel(channel);
        };
    }, [userId, router.asPath]);

    return null;
}
