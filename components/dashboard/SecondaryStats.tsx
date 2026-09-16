import React from "react";
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
  const totalRecords = secondaryStats.newProspects || 1;
  const freshPercentage = Math.min(
    Math.round(((secondaryStats.freshProspects || 0) / (totalRecords || 1)) * 100),
    100
  );
  const overduePercentage = Math.min(
    Math.round(
      ((secondaryStats.overdueFollowups || 0) / (secondaryStats.followupCalls || 1)) * 100
    ),
    100
  );

  const items = [
    {
      label: "Active Campaigns",
      value: (stats.activeCampaigns || 0).toLocaleString(),
      badge: "Active",
      subtext: "Live campaigns",
    },
    {
      label: "Team Members",
      value: (secondaryStats.assignedMembers || 0).toLocaleString(),
      badge: "Online",
      subtext: "Available callers",
    },
    {
      label: "Total Records",
      value: (secondaryStats.newProspects || 0).toLocaleString(),
      badge: "CRM",
      subtext: "All leads assigned",
    },
    {
      label: "Fresh Prospects",
      value: (secondaryStats.freshProspects || 0).toLocaleString(),
      badge: "0 Dials",
      subtext: `${freshPercentage}% untouched`,
    },
    {
      label: "Total Followups",
      value: (secondaryStats.followupCalls || 0).toLocaleString(),
      badge: "Pipeline",
      subtext: "Scheduled callbacks",
    },
    {
      label: "Overdue",
      value: (secondaryStats.overdueFollowups || 0).toLocaleString(),
      badge: "Pending",
      subtext: `${overduePercentage}% of followups`,
    },
  ];

  return (
    <div className="w-full bg-[#fbfbfa] rounded-2xl border border-[#ecebe6] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-[#ecebe6]">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between h-full pt-3 md:pt-0 ${
              idx > 0 ? "md:pl-5 lg:pl-6" : ""
            } group cursor-pointer`}
          >
            {loading ? (
              <div className="animate-pulse w-full py-1">
                <div className="h-3 bg-gray-200/60 rounded w-2/3 mb-2.5"></div>
                <div className="h-7 bg-gray-200/80 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200/50 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                {/* Header: Label + Pill */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[11px] font-medium text-[#71717a] truncate">
                    {item.label}
                  </span>
                  <span className="text-[9px] font-semibold text-[#18181b] bg-[#ecebe6]/60 px-1.5 py-0.5 rounded tracking-wide shrink-0">
                    {item.badge}
                  </span>
                </div>

                {/* Main Big Number */}
                <div className="my-1 flex items-baseline">
                  <span className="text-2xl sm:text-3xl font-bold text-[#18181b] font-mono tracking-tight">
                    {item.value}
                  </span>
                </div>

                {/* Subtitle with Arrow */}
                <div className="flex items-center justify-between text-[#71717a] group-hover:text-[#18181b] transition-colors mt-0.5">
                  <span className="text-[10px] sm:text-[11px] font-normal truncate">
                    {item.subtext}
                  </span>
                  <span className="text-xs font-semibold opacity-60 transition-transform group-hover:translate-x-1 group-hover:opacity-100 ml-1 shrink-0">
                    &rarr;
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
