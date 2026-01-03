import { useState, useCallback } from "react";
import { useDashboardStats } from "./useDashboardStats";
import { useDashboardCharts } from "./useDashboardCharts";
import { useAgentPerformance } from "./useAgentPerformance";
import { useDateFilter } from "./useDateFilter";

/**
 * Combined hook for fetching ALL dashboard data for reporting purposes
 */
export function useDashboardReportData() {
  const {
    stats,
    secondaryStats,
    performanceMetrics,
    loading: statsLoading,
    fetchStats,
  } = useDashboardStats();

  const {
    chartData,
    pieData,
    campaignData,
    heatmapData,
    hourlyStats,
    loading: chartsLoading,
    fetchChartData,
  } = useDashboardCharts();

  const {
    agentData,
    totalDials: agentTotalDials,
    loading: agentLoading,
    fetchAgentPerformance,
  } = useAgentPerformance();

  const { getDateRangeLabel } = useDateFilter();

  const [loading, setLoading] = useState(false);

  const fetchReportData = useCallback(
    async (orgId?: string, dateFilter: string = "this_month") => {
      setLoading(true);
      try {
        await Promise.all([
            fetchStats(orgId, dateFilter),
            fetchChartData(orgId, dateFilter),
            fetchAgentPerformance(orgId, dateFilter)
        ]);
      } catch (error) {
        console.error("Failed to fetch report data", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchStats, fetchChartData, fetchAgentPerformance]
  );

  return {
    // Stats
    stats,
    secondaryStats,
    performanceMetrics,
    
    // Charts
    chartData,
    pieData,
    campaignData,
    heatmapData,
    hourlyStats,
    
    // Agent
    agentData,
    agentTotalDials,
    
    // Utils
    loading: loading || statsLoading || chartsLoading || agentLoading,
    fetchReportData,
    getDateRangeLabel
  };
}
