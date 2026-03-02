import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export function useCallSessionRedirect(userId: string | undefined) {
    const router = useRouter();
    const lastPulseRef = useRef<number>(0);

    const checkActiveSession = async () => {
        if (!userId || !router.isReady) return;
        
        // Prevent redirects during active save operations
        const isSaving = typeof window !== 'undefined' && localStorage.getItem('lead_save_in_progress') === 'true';
        if (isSaving) return;

        // Match debounce to heartbeat (approx 500ms-1000ms is safe)
        const now = Date.now();
        if (now - lastPulseRef.current < 500) return;
        lastPulseRef.current = now;

        try {
            // Fetch all sessions to monitor them separately
            const { data: sessions, error } = await supabase
                .from('call_sessions')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;
            if (!sessions || sessions.length === 0) return;

            // 1. Filter for "HOT" sessions (Active or Pending)
            // We separate them to prioritize Manual calls over System calls
            const manualHotSessions = sessions.filter(s => 
                (s.manual_status === 'active' || s.manual_status === 'disposition_pending')
            );

            const systemHotSessions = sessions.filter(s => 
                (s.status === 'active' || s.status === 'disposition_pending')
            );

            let sessionToFollow = null;
            let prioritizeManual = false;

            // PRIORITY RULE: Manual sessions take priority over System sessions
            if (manualHotSessions.length > 0) {
                // Pick the most recently updated manual session
                sessionToFollow = manualHotSessions.sort((a,b) => 
                    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                )[0];
                prioritizeManual = true;
            } else if (systemHotSessions.length > 0) {
                // Pick the most recently updated system session
                sessionToFollow = systemHotSessions.sort((a,b) => 
                    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                )[0];
            }

            if (sessionToFollow) {
                const targetCamp = prioritizeManual 
                    ? (sessionToFollow.manual_campaign_id || sessionToFollow.campaign_id) 
                    : sessionToFollow.campaign_id;
                
                const targetCust = prioritizeManual 
                    ? sessionToFollow.manual_customer_id 
                    : sessionToFollow.customer_id;

                if (targetCamp && targetCust) {
                    const { id: currentCamp, customerId: currentCust } = router.query;
                    
                    const isAlreadyThere = String(currentCamp) === String(targetCamp) && 
                                          String(currentCust) === String(targetCust);
                    
                    if (!isAlreadyThere) {
                        const expectedPath = `/portal/campaign/${targetCamp}/${targetCust}`;
                        console.log(`[Session-Guard] Forced redirection to HOT session (${prioritizeManual ? 'Manual' : 'System'}): ${expectedPath}`);
                        router.push(expectedPath);
                    }
                }
            } else {
                // NO HOT SESSIONS FOUND
                // If the leads are just 'assigned' (call_start_at is null, etc.), we ALLOW navigation.
                // console.log("[Session-Guard] No active/pending sessions. Navigation allowed.");
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
             }, (payload) => {
                console.log(`[Session-Guard] Realtime sync event received:`, payload.eventType);
                // Short delay to allow DB propagation
                setTimeout(checkActiveSession, 500);
             })
            .subscribe();

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') checkActiveSession();
        };

        // 2000ms Stable Heartbeat (Reduced from aggressive 500ms)
        const heartbeat = setInterval(() => {
            // Check for localized "save-in-progress" lock to prevent race conditions
            const isSaving = typeof window !== 'undefined' && localStorage.getItem('lead_save_in_progress') === 'true';
            if (!isSaving) {
                checkActiveSession();
            }
        }, 2000);

        window.addEventListener('visibilitychange', handleVisibility);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
            window.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [userId, router.query]); // Reliable dependency on query change
}
