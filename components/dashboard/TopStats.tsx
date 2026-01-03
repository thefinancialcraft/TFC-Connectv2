import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { DashboardStats } from "../../hooks/useDashboardStats";
import { ChartPoint } from "../../hooks/useDashboardCharts";

// ... imports

interface TopStatsProps {
  stats: DashboardStats;
  chartData: ChartPoint[];
  loading?: boolean;
}

export default function TopStats({ stats, chartData, loading = false }: TopStatsProps) {
  const router = useRouter();

  const cards = [
    // ... same cards
    {
      label: "Active Leads",
      value: stats.totalCustomers.toLocaleString(),
      sub: "+12%",
      color: "#4b33e8",
      icon: "fi-rr-users",
      chartType: "bar" as const,
    },
    {
      label: "Total Premium",
      value: `₹${stats.totalPremium.toLocaleString()}`,
      sub: "+9%",
      color: "#f97316",
      icon: "fi-rr-earnings",
      chartType: "area" as const,
    },
    {
      label: "Deals Closed",
      value: stats.totalConverted.toLocaleString(),
      sub: "+7%",
      color: "#10b981",
      icon: "fi-rr-check-circle",
      chartType: "bar" as const,
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      sub: "-2%",
      color: "#ef4444",
      icon: "fi-rr-chart-pie",
      chartType: "area" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 flex flex-col justify-between group hover:shadow-md transition-all duration-300 min-h-[160px]"
        >
          {loading ? (
             <div className="animate-pulse w-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-3 w-full">
                        <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/4"></div>
                    </div>
                    <div className="w-9 h-9 bg-gray-100 rounded-xl"></div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="w-24 h-8 bg-gray-100 rounded"></div>
                    <div className="w-16 h-3 bg-gray-100 rounded"></div>
                </div>
             </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-[#787E9D] flex items-center gap-1.5">
                    {card.label}
                    <i className="fi fi-rr-info text-[9px]"></i>
                  </p>
                  <h2 className="text-xl font-bold text-[#263238] font-poppins">
                    {card.value}
                  </h2>
                  <p
                    className={`text-[10px] font-bold ${
                      card.sub.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    vs last month <span className="ml-1">{card.sub}</span>
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-gray-50 group-hover:scale-110"
                  style={{ color: card.color }}
                >
                  <i className={`fi ${card.icon} flex text-base`}></i>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="w-24 h-10">
                  {card.chartType === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <Bar
                          dataKey="dials"
                          fill={card.color}
                          radius={[2, 2, 0, 0]}
                          opacity={0.6}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <Area
                          type="monotone"
                          dataKey="dials"
                          stroke={card.color}
                          fill={card.color}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <button
                  onClick={() => router.push("/activity")}
                  className="text-xs font-bold text-gray-400 hover:text-[#4b33e8] transition-colors flex items-center gap-1 group/btn"
                >
                  See Details{" "}
                  <i className="fi fi-rr-arrow-right text-[10px] mt-0.5 group-hover/btn:translate-x-1 transition-transform"></i>
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
