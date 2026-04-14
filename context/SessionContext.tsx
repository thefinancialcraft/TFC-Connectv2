import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { useUser } from './UserContext';

interface CallSession {
  id: string;
  user_id: string;
  campaign_id: string;
  customer_id: string;  
  status: 'assigned' | 'active' | 'disposition_pending' | 'closed';
  manual_status?: string;
  manual_customer_id?: string;
  manual_campaign_id?: string;
  is_manual?: boolean;
  updated_at: string;
  created_at?: string;
  call_start_at?: string;
}

interface SessionContextType {
  currentSession: CallSession | null;
  allSessions: CallSession[];
  isLoading: boolean;
  isLocked: boolean;
  startManualLock: (session: CallSession) => void;
  clearManualLock: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, mounted } = useUser();
  const router = useRouter();
  
  const [currentSession, setCurrentSession] = useState<CallSession | null>(null);
  const [allSessions, setAllSessions] = useState<CallSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const lastRedirectPath = useRef<string | null>(null);
  const lastRedirectTime = useRef<number>(0);

  // --- REDIRECTION LOGIC ---
  const handleRedirection = useCallback((sessions: CallSession[]) => {
    if (!router.isReady || router.pathname.includes('/login')) return;

    // 1. Find the Absolute Master (Active or Disposition Pending in ANY campaign)
    const masterSession = [...sessions].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    ).find(s => 
      s.manual_status === 'active' || s.manual_status === 'disposition_pending' ||
      s.status === 'active' || s.status === 'disposition_pending'
    );

    // 2. If no Master, look for the latest Assigned Lead matching CURRENT context
    let targetSession = masterSession;
    if (!targetSession) {
        const currentCampaignId = router.query.id;
        const currentCustomerId = router.query.customerId;

        const contextualAssigned = [...sessions].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ).find(s => 
            s.status === 'assigned' && 
            String(s.campaign_id) === String(currentCampaignId)
        );

        if (contextualAssigned && !!currentCustomerId) {
            targetSession = contextualAssigned;
        }
    }

    if (!targetSession) {
      if (typeof window !== 'undefined' && localStorage.getItem('manual_inspection_snapshot')) {
        localStorage.removeItem('manual_inspection_snapshot');
        setIsLocked(false);
      }
      setCurrentSession(null);
      return;
    }

    const hot = targetSession;
    setCurrentSession(hot);

    // NEW: URL-based Manual Mode Handling
    const isManualInUrl = router.query.isManual === 'true';
    if (isManualInUrl) {
      const status = hot.manual_status || hot.status;
      const isGenuinelyHot = status === 'active' || status === 'disposition_pending';
      const currentCustomerId = router.query.customerId;

      // If we are on a different CUSTOMER than the server's 'hot' session
      // AND that server session is NOT active/pending, we STAY on the manual lead.
      if (String(hot.customer_id) !== String(currentCustomerId) && !isGenuinelyHot) {
        setIsLocked(true);
        console.log("[Session-Context] 🔒 Manual Mode (URL) Active. Ignoring non-hot server session:", hot.id);
        return; 
      }
    }

    // FALLBACK: Heritage Manual Lock (LocalStorage)
    const snapshotStr = typeof window !== 'undefined' ? localStorage.getItem('manual_inspection_snapshot') : null;
    if (snapshotStr) {
      try {
        const snapshot = JSON.parse(snapshotStr);
        const currentCampaignId = router.query.id;
        const currentCustomerId = router.query.customerId;

        if (String(currentCampaignId) === String(snapshot.campaign_id) && 
            String(currentCustomerId) === String(snapshot.customer_id)) {
          
          // Re-verify if server session has overtaken this lead with higher priority
          const hotStatus = hot.manual_status || hot.status;
          const isServerOvertaken = (hotStatus === 'active' || hotStatus === 'disposition_pending') && 
                                   String(hot.customer_id) !== String(currentCustomerId);

          if (!isServerOvertaken) {
            setIsLocked(true);
            return; 
          }
        }
      } catch (e) {
        localStorage.removeItem('manual_inspection_snapshot');
      }
    }

    // Perform Redirection logic
    const status = hot.manual_status || hot.status;
    const isActuallyHot = status === 'active' || status === 'disposition_pending';
    
    // Redirect for 'assigned' ONLY if we are already on a customer page of the SAME campaign
    const currentCampaignId = router.query.id;
    const isSequentialAssignment = 
        status === 'assigned' && 
        !!router.query.customerId && 
        String(hot.campaign_id) === String(currentCampaignId);

    if (!isActuallyHot && !isSequentialAssignment) return;

    const targetCamp = hot.is_manual ? (hot.manual_campaign_id || hot.campaign_id) : hot.campaign_id;
    const targetCust = hot.is_manual ? hot.manual_customer_id : hot.customer_id;

    if (!targetCamp || !targetCust) return;

    const targetPath = `/portal/campaign/${targetCamp}/${targetCust}`;
    const maskPath = `/campaign/${targetCamp}/${targetCust}`;
    
    const currentPath = router.asPath.split('?')[0].replace(/\/$/, "");
    const normalizedTarget = targetPath.replace(/\/$/, "");
    const normalizedMask = maskPath.replace(/\/$/, "");

    const isAlreadyThere = currentPath === normalizedTarget || currentPath === normalizedMask;

    const now = Date.now();
    if (!isAlreadyThere && (lastRedirectPath.current !== normalizedTarget || (now - lastRedirectTime.current) > 3000)) {
       console.log(`[Session-Context] 🚀 Redirecting to: ${normalizedTarget}`);
       lastRedirectPath.current = normalizedTarget;
       lastRedirectTime.current = now;
       router.push(targetPath);
    }
  }, [router]);

  const fetchSessions = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const { data, error } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('user_id', user.uid)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      const latestSessions = data || [];
      setAllSessions(latestSessions);
      handleRedirection(latestSessions);
    } catch (e) {
      console.error("[Session-Context] Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, handleRedirection]);

  // Initial and Polling
  useEffect(() => {
    if (!mounted || !user?.uid) return;
    
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); 

    return () => clearInterval(interval);
  }, [user?.uid, mounted, fetchSessions]);

  // Real-time
  useEffect(() => {
    if (!user?.uid) return;

    const channel = supabase
      .channel(`session_updates_${user.uid}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'call_sessions',
        filter: `user_id=eq.${user.uid}` 
      }, () => {
        console.log("[Session-Context] ⚡ Real-time update detected.");
        fetchSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.uid, fetchSessions]);

  const startManualLock = (session: CallSession) => {
    localStorage.setItem('manual_inspection_snapshot', JSON.stringify(session));
    setIsLocked(true);
  };

  const clearManualLock = () => {
    localStorage.removeItem('manual_inspection_snapshot');
    setIsLocked(false);
  };

  return (
    <SessionContext.Provider value={{
      currentSession,
      allSessions,
      isLoading,
      isLocked,
      startManualLock,
      clearManualLock
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
