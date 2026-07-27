import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DashboardStats } from "../../hooks/useDashboardStats";
import { ChartPoint } from "../../hooks/useDashboardCharts";

interface TopStatsProps {
  stats: DashboardStats;
  chartData: ChartPoint[];
  loading?: boolean;
}

export default function TopStats({ stats, chartData, loading = false }: TopStatsProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);



  const cards = [
    {
      label: "Total Talktime",
      value: (() => {
        const totalSecs = stats.totalTalktime || 0;
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m ${totalSecs % 60}s`;
      })(),
      valueColor: "text-indigo-600",
    },
    {
      label: "Total Dials",
      value: (stats.totalDials || 0).toLocaleString(),
      valueColor: "text-gray-800",
    },
    {
      label: "Deals Closed",
      value: (stats.totalConverted || 0).toLocaleString(),
      valueColor: "text-emerald-600",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      valueColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between"
        >
          {loading ? (
             <div className="animate-pulse w-full">
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
             </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 font-medium mb-1">
                {card.label}
              </p>
              <p className={`text-2xl font-bold ${card.valueColor}`}>
                {card.value}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
