import { useState } from "react";
import { SecondaryStats as SecondaryStatsType } from "../../hooks/useDashboardStats";
import { DashboardStats } from "../../hooks/useDashboardStats";

interface SecondaryStatsProps {
  stats: DashboardStats;
  secondaryStats: SecondaryStatsType;
  loading?: boolean;
}

export default function SecondaryStats({
  stats,
  secondaryStats,
  loading = false,
}: SecondaryStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const items = [
    {
      label: "Active Campaigns",
      value: stats.activeCampaigns,
      icon: "fi-rr-bullhorn",
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      label: "Team Members",
      value: secondaryStats.assignedMembers,
      icon: "fi-rr-users",
      color: "#ec4899",
      bg: "#fdf2f8",
    },
    {
      label: "Total Records",
      value: secondaryStats.newProspects,
      icon: "fi-rr-user-add",
      color: "#8b5cf6",
      bg: "#f5f3ff",
    },
    {
      label: "Fresh Prospects",
      value: secondaryStats.freshProspects,
      icon: "fi-rr-address-card",
      color: "#10b981",
      bg: "#ecfdf5",
    },
    {
      label: "Total Followups",
      value: secondaryStats.followupCalls,
      icon: "fi-rr-phone-call",
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "Overdue",
      value: secondaryStats.overdueFollowups,
      icon: "fi-rr-calendar-exclamation",
      color: "#ef4444",
      bg: "#fef2f2",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between"
        >
          {loading ? (
            <div className="animate-pulse w-full">
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 font-medium mb-1">
                {item.label}
              </p>
              <p className="text-xl font-bold text-gray-800">
                {item.value || 0}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
