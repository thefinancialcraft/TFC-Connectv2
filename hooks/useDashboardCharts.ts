import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Interfaces... (unchanged)
export interface ChartPoint {
  name: string;
  dials: number;
  connected: number;
  monthIndex?: number;
}
export interface PieDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
export interface HeatmapDataPoint {
  day: string;
  [key: string]: string | number;
}
export interface CampaignDataPoint {
  name: string;
  total: number;
  success: number;
}
export interface HourlyStatPoint {
  hour: string;
  total: number;
  connected: number;
  outgoing: number;
  incoming: number;
  missed: number;
  talktime: number;
}
export interface UseDashboardChartsReturn {
  chartData: ChartPoint[];
  pieData: PieDataPoint[];
  heatmapData: HeatmapDataPoint[];
  campaignData: CampaignDataPoint[];
  hourlyStats: HourlyStatPoint[];
  loading: boolean;
  error: string | null;
  fetchChartData: (orgId?: string, dateFilter?: string, customRange?: { start: string; end: string }) => Promise<void>;
}

interface CacheEntry {
  data: {
    chartData: ChartPoint[];
    pieData: PieDataPoint[];
    heatmapData: HeatmapDataPoint[];
    campaignData: CampaignDataPoint[];
    hourlyStats: HourlyStatPoint[];
  };
  timestamp: number;
}

const CACHE_TTL = 60 * 1000;

export function useDashboardCharts(): UseDashboardChartsReturn {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [pieData, setPieData] = useState<PieDataPoint[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
  const [campaignData, setCampaignData] = useState<CampaignDataPoint[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStatPoint[]>([]);
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

  const fetchChartData = useCallback(
    async (orgId?: string, dateFilter: string = "this_month", customRange?: { start: string; end: string }) => {
      const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}`;

      const cached = cacheRef.current[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setChartData(cached.data.chartData);
        setPieData(cached.data.pieData);
        setHeatmapData(cached.data.heatmapData);
        setCampaignData(cached.data.campaignData);
        setHourlyStats(cached.data.hourlyStats);
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

        const response = await fetch(`/api/dashboard/dashboard_charts?${params}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const result = await response.json();
        if (!result.success || !result.data) throw new Error(result.error || "Failed to fetch chart data");

        const data = result.data;

        setChartData(data.chartData);
        setPieData(data.pieData);
        setHeatmapData(data.heatmapData);
        setCampaignData(data.campaignData);
        setHourlyStats(data.hourlyStats);

        cacheRef.current[cacheKey] = {
          data,
          timestamp: Date.now(),
        };

      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Dashboard Charts Fetch Error:", err);
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
    chartData,
    pieData,
    heatmapData,
    campaignData,
    hourlyStats,
    loading,
    error,
    fetchChartData,
  };
}
