// Dashboard Hooks - Centralized exports
export { useAuthGuard } from './useAuthGuard';
export type { UseAuthGuardReturn } from './useAuthGuard';

export { useDashboardStats } from './useDashboardStats';
export type {
  DashboardStats,
  SecondaryStats,
  PerformanceMetrics,
  UseDashboardStatsReturn,
} from './useDashboardStats';

export { useDashboardCharts } from './useDashboardCharts';
export type {
  ChartPoint,
  PieDataPoint,
  HeatmapDataPoint,
  CampaignDataPoint,
  HourlyStatPoint,
  UseDashboardChartsReturn,
} from './useDashboardCharts';

export { useAgentPerformance } from './useAgentPerformance';
export type {
  AgentDataPoint,
  UseAgentPerformanceReturn,
} from './useAgentPerformance';

export { useDateFilter } from './useDateFilter';
export type {
  DateFilterType,
  DateRange,
  UseDateFilterReturn,
} from './useDateFilter';

export { useOrganizationDetailData } from './useOrganizationDetailData';
export type { OrgUser } from './useOrganizationDetailData';
