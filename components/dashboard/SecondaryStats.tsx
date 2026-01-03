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
      label: "New Today",
      value: secondaryStats.newProspects,
      icon: "fi-rr-user-add",
      color: "#8b5cf6",
      bg: "#f5f3ff",
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
          className="bg-white rounded-[16px] p-3.5 border border-gray-50 flex flex-col gap-2.5 hover:shadow-md transition-all h-[100px]"
        >
          {loading ? (
             <div className="animate-pulse flex flex-col justify-between h-full">
                <div className="w-7 h-7 bg-gray-100 rounded-lg"></div>
                <div>
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                </div>
             </div>
          ) : (
            <>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <i className={`fi ${item.icon} text-xs flex`}></i>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#263238] leading-tight">
                  {item.value.toLocaleString()}
                </h4>
                <p className="text-[9px] font-bold text-[#787E9D] uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
