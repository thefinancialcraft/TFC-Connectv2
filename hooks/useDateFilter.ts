import { useState, useCallback, useMemo } from "react";

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
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).toISOString();
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    ).toISOString();

    let start = todayStart;
    let end = todayEnd;

    if (selectedFilter === "yesterday") {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      start = new Date(
        y.getFullYear(),
        y.getMonth(),
        y.getDate()
      ).toISOString();
      end = new Date(
        y.getFullYear(),
        y.getMonth(),
        y.getDate(),
        23,
        59,
        59
      ).toISOString();
    } else if (selectedFilter === "this_week") {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      start = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate()
      ).toISOString();
    } else if (selectedFilter === "last_7_days") {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = d.toISOString();
    } else if (selectedFilter === "this_month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (selectedFilter === "last_month") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      end = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59
      ).toISOString();
    } else if (selectedFilter === "this_year") {
      start = new Date(now.getFullYear(), 0, 1).toISOString();
    } else if (selectedFilter === "multi_year") {
      start = new Date(now.getFullYear() - 3, 0, 1).toISOString();
    } else if (selectedFilter === "all_time") {
      start = "2000-01-01T00:00:00.000Z";
    }

    return { start, end };
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
