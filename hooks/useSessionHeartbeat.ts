import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { removeAccount, getStoredAccounts } from '../lib/sessionManager';
import { supabase } from '../lib/supabase';

/**
 * Hook to manage session heartbeat and auto-logout with tab sync
 */
export const useSessionHeartbeat = (user: any) => {
  const router = useRouter();
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isLeader = useRef<boolean>(false);

  useEffect(() => {
    // Tab Syncing using BroadcastChannel
    channelRef.current = new BroadcastChannel('tfc_session_sync');
    
    const handleSyncMessage = (event: MessageEvent) => {
        if (event.data.type === 'HEARTBEAT_DONE' && !isLeader.current) {
            // Another tab already did the heartbeat, we can skip our turn
            console.log("💓 [Heartbeat] Skip: Sync from leader tab");
        }
    };

    channelRef.current.onmessage = handleSyncMessage;

    return () => {
        channelRef.current?.close();
    };
  }, []);

  const performHeartbeat = async () => {
    if (!user || !user.uid) return;

    const accounts = getStoredAccounts();
    const currentAccount = accounts.find(a => a.user_id === user.uid);
    
    if (!currentAccount || !currentAccount.token_id) return;

    try {
      // Leader Tab Logic: In a real system, you'd use a more complex leader election.
      // For simplicity, we'll just send a broadcast after a successful heartbeat.
      const response = await fetch('/api/auth/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token_id: currentAccount.token_id })
      });

      const data = await response.json();

      if (data.success) {
          // Notify other tabs
          channelRef.current?.postMessage({ type: 'HEARTBEAT_DONE', timestamp: Date.now() });
      }

      if (!data.is_active || data.force_logout || response.status === 404) {
        console.warn(`💔 [Heartbeat] Session invalid (Status: ${response.status}, Force: ${data.force_logout}). Logging out...`);
        
        // Remove from local storage if the session doesn't exist on server
        if (data.force_logout || response.status === 404) {
           removeAccount(currentAccount.token_id);
           console.log(`🗑️ [Heartbeat] Removed invalid account ${currentAccount.token_id} from storage`);
        }
        
        handleLogout(currentAccount.token_id);
      }
      
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
          handleLogout(currentAccount.token_id);
      }


    } catch (error) {
      console.error('Heartbeat failed:', error);
    }
  };

  const handleLogout = async (tokenId: string) => {
    const { handleLogout } = await import('../lib/authService');
    await handleLogout(router, tokenId);
  };



  useEffect(() => {
    if (user && user.uid) {
      performHeartbeat();
      // Every 3 minutes (staggered slightly to avoid all tabs hitting at once)
      const offset = Math.floor(Math.random() * 10000); 
      heartbeatInterval.current = setInterval(performHeartbeat, 3 * 60 * 1000 + offset);
    }

    return () => {
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    };
  }, [user]);

  return { performHeartbeat };
};

