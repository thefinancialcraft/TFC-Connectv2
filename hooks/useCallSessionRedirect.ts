import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

export function useCallSessionRedirect(userId: string | undefined) {
    const router = useRouter();

    useEffect(() => {
        if (!userId) return;

        const checkActiveSession = async () => {
            try {
                const { data: session, error } = await supabase
                    .from('call_sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .in('status', ['active', 'disposition_pending'])
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (error) throw error;

                if (session) {
                    const currentPath = router.asPath;
                    const expectedPath = `/campaign/${session.campaign_id}/${session.customer_id}`;
                    
                    // Only redirect if not already on the destination page
                    if (!currentPath.includes(expectedPath)) {
                        console.log(`[Session-Manager] Redirecting to most recent active session: ${expectedPath}`);
                        router.push(expectedPath);
                    }
                }
            } catch (err) {
                console.error('Error checking active call session:', err);
            }
        };

        // Check on mount and path changes
        checkActiveSession();

        // Subscribe to changes in call_sessions for this user
        const channel = supabase
            .channel(`public:call_sessions:user_id=eq.${userId}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'call_sessions',
                filter: `user_id=eq.${userId}`
             }, (payload: any) => {
                const session = payload.new;
                if (session && (session.status === 'active' || session.status === 'disposition_pending')) {
                    const expectedPath = `/campaign/${session.campaign_id}/${session.customer_id}`;
                    if (!router.asPath.includes(expectedPath)) {
                        router.push(expectedPath);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, router.asPath]);
}
