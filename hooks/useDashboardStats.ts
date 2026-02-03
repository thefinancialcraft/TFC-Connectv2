import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface DashboardStats {
  totalCustomers: number;
  totalPremium: number;
  totalConverted: number;
  conversionRate: number;
  totalDials: number;
  activeCampaigns: number;
  teamSize: number;
  efficiencyScore: number;
}

export interface SecondaryStats {
  todayCalls: number;
  freshProspects: number;
  followupCalls: number;
  overdueFollowups: number;
  newProspects: number;
  assignedMembers: number;
}

export interface PerformanceMetrics {
  avgDuration: string;
  connectedRate: string;
  roi: string;
}

export interface UseDashboardStatsReturn {
  stats: DashboardStats;
  secondaryStats: SecondaryStats;
  performanceMetrics: PerformanceMetrics;
  loading: boolean;
  error: string | null;
  fetchStats: (orgId?: string, dateFilter?: string, userId?: string) => Promise<void>;
}

interface CacheEntry {
  data: {
    stats: DashboardStats;
    secondaryStats: SecondaryStats;
    performanceMetrics: PerformanceMetrics;
  };
  timestamp: number;
}

const CACHE_TTL = 60 * 1000; // 60 seconds

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalPremium: 0,
    totalConverted: 0,
    conversionRate: 0,
    totalDials: 0,
    activeCampaigns: 0,
    teamSize: 0,
    efficiencyScore: 75,
  });

  const [secondaryStats, setSecondaryStats] = useState<SecondaryStats>({
    todayCalls: 0,
    freshProspects: 0,
    followupCalls: 0,
    overdueFollowups: 0,
    newProspects: 0,
    assignedMembers: 0,
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    avgDuration: "0m 0s",
    connectedRate: "0%",
    roi: "1.0x",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Record<string, CacheEntry>>({});

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchStats = useCallback(
    async (orgId?: string, dateFilter: string = "this_month", userId?: string) => {
      const cacheKey = `${orgId || 'all'}-${dateFilter}-${userId || 'all'}`;
      
      // Check cache
      const cached = cacheRef.current[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setStats(cached.data.stats);
        setSecondaryStats(cached.data.secondaryStats);
        setPerformanceMetrics(cached.data.performanceMetrics);
        loading && setLoading(false); // Ensure loading is false if cache hit
        return;
      }

      // Cancel previous request
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
          ...(userId && { userId }),
        });

        const response = await fetch(`/api/dashboard/dashboard_overview?${params}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const result = await response.json();
        if (!result.success || !result.data) throw new Error(result.error || "Failed to fetch data");

        const data = {
          stats: result.data.stats,
          secondaryStats: result.data.secondaryStats,
          performanceMetrics: result.data.performanceMetrics,
        };

        // Update State
        setStats(data.stats);
        setSecondaryStats(data.secondaryStats);
        setPerformanceMetrics(data.performanceMetrics);

        // Update Cache
        cacheRef.current[cacheKey] = {
          data,
          timestamp: Date.now(),
        };

      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Dashboard Stats Fetch Error:", err);
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
    stats,
    secondaryStats,
    performanceMetrics,
    loading,
    error,
    fetchStats,
  };
}
