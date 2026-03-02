import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export function useCallSessionRedirect(userId: string | undefined) {
    const router = useRouter();
    const lastPulseRef = useRef<number>(0);

    const checkActiveSession = async () => {
        if (!userId) return;
        
        // Match debounce to heartbeat (approx 500ms-1000ms is safe)
        const now = Date.now();
        if (now - lastPulseRef.current < 500) return;
        lastPulseRef.current = now;

        try {
            const { data: session, error } = await supabase
                .from('call_sessions')
                .select('*')
                .eq('user_id', userId)
                .or('status.in.(active,disposition_pending),manual_status.in.(active,disposition_pending)')
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;

            if (session) {
                const isManualActive = session.is_manual && ['active', 'disposition_pending'].includes(session.manual_status);
                const isSystemActive = ['active', 'disposition_pending'].includes(session.status);

                let targetCamp = null;
                let targetCust = null;

                if (isManualActive) {
                    targetCamp = session.manual_campaign_id || session.campaign_id;
                    targetCust = session.manual_customer_id;
                } else if (isSystemActive) {
                    targetCamp = session.campaign_id;
                    targetCust = session.customer_id;
                }

                if (targetCamp && targetCust) {
                    // 🛡️ PRECISION CHECK: Compare using router query for accuracy
                    const { id: currentCamp, customerId: currentCust } = router.query;
                    
                    const isAlreadyThere = String(currentCamp) === String(targetCamp) && 
                                          String(currentCust) === String(targetCust);
                    
                    if (!isAlreadyThere) {
                        // Ensure fixed portal prefix to match actual routes
                        const expectedPath = `/portal/campaign/${targetCamp}/${targetCust}`;
                        console.log(`[Session-Guard] Redirecting to active session context: ${expectedPath}`);
                        router.push(expectedPath);
                    }
                }
            }
        } catch (err) {
            console.error('[Session-Guard] Error:', err);
        }
    };

    useEffect(() => {
        if (!userId) return;

        checkActiveSession();

        const channel = supabase
            .channel(`global_session_guard:${userId}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'call_sessions',
                filter: `user_id=eq.${userId}`
             }, () => checkActiveSession())
            .subscribe();

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') checkActiveSession();
        };

        // 500ms Aggressive Heartbeat
        const heartbeat = setInterval(checkActiveSession, 500);

        window.addEventListener('visibilitychange', handleVisibility);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
            window.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [userId, router.query]); // Reliable dependency on query change
}
