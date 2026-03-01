import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface AgentDataPoint {
  id: string;
  name: string;
  employee_id: string | null;
  profile_pic_url: string | null;
  count: number;
  duration: number;
  connected_count: number;
  deals_count: number;
  follow_ups_count: number;
  last_active: string | null;
  last_online: string | null;
  on_call: boolean;
  is_personal: boolean;
}

export interface UseAgentPerformanceReturn {
  agentData: AgentDataPoint[];
  totalDials: number;
  totalDuration: number;
  loading: boolean;
  error: string | null;
  fetchAgentPerformance: (orgId?: string, dateFilter?: string, customRange?: { start: string; end: string }, force?: boolean, userId?: string) => Promise<void>;
}

interface CacheEntry {
  data: {
    agentData: AgentDataPoint[];
    totalDials: number;
    totalDuration: number;
  };
  timestamp: number;
}

const CACHE_TTL = 60 * 1000;

export function useAgentPerformance(): UseAgentPerformanceReturn {
  const [agentData, setAgentData] = useState<AgentDataPoint[]>([]);
  const [totalDials, setTotalDials] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Record<string, CacheEntry>>({});

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchAgentPerformance = useCallback(
    async (orgId?: string, dateFilter: string = "this_month", customRange?: { start: string; end: string }, force: boolean = false, userId?: string) => {
      const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}-${userId || 'all'}`;

      const cached = cacheRef.current[cacheKey];
      if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setAgentData(cached.data.agentData);
        setTotalDials(cached.data.totalDials);
        setTotalDuration(cached.data.totalDuration);
        loading && setLoading(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);
        setError(null);

        // Wait for session using the robust helper (handles hydration race conditions)
        const { ensureValidSession } = await import("../lib/sessionManager");
        const session = await ensureValidSession();

        if (!session) throw new Error("Not authenticated");


        const params = new URLSearchParams({
          dateFilter,
          ...(orgId && { orgId }),
          ...(customRange && { startDate: customRange.start, endDate: customRange.end }),
          ...(userId && { userId }),
        });

        const response = await fetch(`/api/agent_performance?${params}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
          signal: controller.signal,
        });

        let result;
        try {
          result = await response.json();
        } catch (e) {
          throw new Error(`API error: ${response.status}`);
        }

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || `API error: ${response.status}`);
        }

        const data = {
            agentData: result.data.agents,
            totalDials: result.data.totalDials || 0,
            totalDuration: result.data.totalDuration || 0
        };

        setAgentData(data.agentData);
        setTotalDials(data.totalDials);
        setTotalDuration(data.totalDuration);

        cacheRef.current[cacheKey] = {
           data,
           timestamp: Date.now()
        };

      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Agent Performance Fetch Error:", err);
        setError(err.message || "Unknown error");
      } finally {
         if (controller.signal.aborted) {
             // Do nothing
         } else {
             setLoading(false);
             if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
             }
         }
      }
    },
    []
  );

  return {
    agentData,
    totalDials,
    totalDuration,
    loading,
    error,
    fetchAgentPerformance,
  };
}
