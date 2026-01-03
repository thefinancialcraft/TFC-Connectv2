import { useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";

export function useAgentIntelligence() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAgentIntelligence = useCallback(
    async (agentId: string, dateFilter: string = "this_month", orgId?: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const params = new URLSearchParams({
          agentId,
          dateFilter,
          ...(orgId && { orgId }),
        });

        const response = await fetch(`/api/dashboard/agent_intelligence?${params}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const result = await response.json();
        if (!result.success || !result.data) throw new Error(result.error || "Failed to fetch agent intelligence");

        setData(result.data);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Agent Intelligence Fetch Error:", err);
        setError(err.message || "Unknown error");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          abortControllerRef.current = null;
        }
      }
    },
    []
  );

  return {
    data,
    loading,
    error,
    fetchAgentIntelligence,
    clearIntelligence: () => setData(null)
  };
}
