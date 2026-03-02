import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export function useCallSessionRedirect(userId: string | undefined) {
    const router = useRouter();
    const lastPulseRef = useRef<number>(0);

    const checkActiveSession = async () => {
        if (!userId) return;
        
        // Prevent excessive pulses (debounce 2s)
        const now = Date.now();
        if (now - lastPulseRef.current < 2000) return;
        lastPulseRef.current = now;

        try {
            console.log('[Session-Guard] Checking for active sessions...');
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
                // --- 🎖️ PRIORITY LOGIC ---
                const isManualActive = session.is_manual && ['active', 'disposition_pending'].includes(session.manual_status);
                const isSystemActive = ['active', 'disposition_pending'].includes(session.status);

                let targetCamp = null;
                let targetCust = null;
                let mode = "";

                if (isManualActive) {
                    // 1. First Priority: Manual Call
                    targetCamp = session.manual_campaign_id || session.campaign_id;
                    targetCust = session.manual_customer_id;
                    mode = "Manual";
                } else if (isSystemActive) {
                    // 2. Second Priority: System Assigned
                    targetCamp = session.campaign_id;
                    targetCust = session.customer_id;
                    mode = "System";
                }

                if (targetCamp && targetCust) {
                    const currentPath = router.asPath;
                    const expectedPath = `/campaign/${targetCamp}/${targetCust}`;
                    
                    // Prevent circular redirection: Check if we are already on the target page
                    // We check if path contains both campaign and customer IDs
                    const isAlreadyThere = currentPath.includes(`/${targetCamp}/`) && currentPath.includes(`/${targetCust}`);
                    
                    if (!isAlreadyThere) {
                        console.log(`[Session-Guard] 🚀 Auto-Redirecting to ${mode} session: ${expectedPath}`);
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

        // 1. Initial Pulse
        checkActiveSession();

        // 2. Real-time Subscription (Instant Change Detection)
        const channel = supabase
            .channel(`global_session_guard:${userId}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'call_sessions',
                filter: `user_id=eq.${userId}`
             }, (payload: any) => {
                console.log('[Session-Guard] DB Change detected. Syncing...');
                checkActiveSession();
            })
            .subscribe();

        // 3. Visibility Sync (Pulse when user returns to tab)
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                checkActiveSession();
            }
        };

        // 4. Aggressive Heartbeat (Every 2 seconds to prevent navigating away during active calls)
        const heartbeat = setInterval(checkActiveSession, 500);

        window.addEventListener('visibilitychange', handleVisibility);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
            window.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [userId]); // Only depend on userId to keep it stable at portal scope
}
