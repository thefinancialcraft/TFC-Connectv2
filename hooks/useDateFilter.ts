import { useState, useCallback, useMemo } from "react";
import { getISTDateRange } from "@/lib/dateUtils";

export type DateFilterType =
  | "today"
  | "yesterday"
  | "this_week"
  | "last_7_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "multi_year"
  | "all_time";

export interface DateRange {
  start: string;
  end: string;
}

export interface UseDateFilterReturn {
  selectedFilter: DateFilterType;
  dateRange: DateRange;
  setFilter: (filter: DateFilterType) => void;
  getDateRangeLabel: (filter: string) => string;
}

/**
 * Hook for managing date filter state and calculations
 * Provides date range based on selected filter
 */
export function useDateFilter(
  initialFilter: DateFilterType = "this_month"
): UseDateFilterReturn {
  const [selectedFilter, setSelectedFilter] = useState<DateFilterType>(initialFilter);

  const dateRange = useMemo(() => {
    return getISTDateRange(selectedFilter);
  }, [selectedFilter]);

  const setFilter = useCallback((filter: DateFilterType) => {
    setSelectedFilter(filter);
    // Optionally persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboard_date_filter", filter);
    }
  }, []);

  const getDateRangeLabel = useCallback((filter: string): string => {
    switch(filter) {
        case "today": return "Today";
        case "yesterday": return "Yesterday";
        case "this_week": return "This Week";
        case "last_7_days": return "Last 7 Days";
        case "this_month": return "This Month";
        case "last_month": return "Last Month";
        case "this_year": return "1 Year Report";
        case "multi_year": return "Multi-Year Report";
        case "all_time": return "All Time";
        default: return filter;
    }
  }, []);

  return {
    selectedFilter,
    dateRange,
    setFilter,
    getDateRangeLabel
  };
}
