import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface AgentDataPoint {
  name: string;
  count: number;
}

export interface UseAgentPerformanceReturn {
  agentData: AgentDataPoint[];
  totalDials: number;
  loading: boolean;
  error: string | null;
  fetchAgentPerformance: (orgId?: string, dateFilter?: string, customRange?: { start: string; end: string }) => Promise<void>;
}

interface CacheEntry {
  data: {
    agentData: AgentDataPoint[];
    totalDials: number;
  };
  timestamp: number;
}

const CACHE_TTL = 60 * 1000;

export function useAgentPerformance(): UseAgentPerformanceReturn {
  const [agentData, setAgentData] = useState<AgentDataPoint[]>([]);
  const [totalDials, setTotalDials] = useState(0);
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
    async (orgId?: string, dateFilter: string = "this_month", customRange?: { start: string; end: string }) => {
      const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}`;

      const cached = cacheRef.current[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setAgentData(cached.data.agentData);
        setTotalDials(cached.data.totalDials);
        loading && setLoading(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const params = new URLSearchParams({
          dateFilter,
          ...(orgId && { orgId }),
          ...(customRange && { startDate: customRange.start, endDate: customRange.end }),
        });

        const response = await fetch(`/api/dashboard/agent-performance?${params}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const result = await response.json();
        if (!result.success || !result.data) throw new Error(result.error || "Failed to fetch agent performance data");

        const data = {
            agentData: result.data.agents,
            totalDials: result.data.totalDials || 0
        };

        setAgentData(data.agentData);
        setTotalDials(data.totalDials);

        cacheRef.current[cacheKey] = {
           data,
           timestamp: Date.now()
        };

      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Agent Performance Fetch Error:", err);
        setError(err.message || "Unknown error");
      } finally {
         if (abortControllerRef.current?.signal.aborted) {
             // Do nothing
         } else {
             setLoading(false);
             abortControllerRef.current = null;
         }
      }
    },
    []
  );

  return {
    agentData,
    totalDials,
    loading,
    error,
    fetchAgentPerformance,
  };
}
