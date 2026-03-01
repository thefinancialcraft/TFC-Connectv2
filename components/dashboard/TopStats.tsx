import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);



  const cards = [
    {
      label: "TOTAL TALKTIME",
      value: (() => {
        const totalSecs = stats.totalTalktime || 0;
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m ${totalSecs % 60}s`;
      })(),
      trend: "12%",
      color: "#6366F1", // Indigo
      trendColor: "#6366F1",
    },
    {
      label: "TOTAL DIALS",
      value: (stats.totalDials || 0).toLocaleString(),
      trend: "8%",
      color: "#F59E0B", // Amber
      trendColor: "#F59E0B",
    },
    {
      label: "DEALS CLOSED",
      value: (stats.totalConverted || 0).toLocaleString(),
      trend: "4%",
      color: "#10B981", // Emerald
      trendColor: "#10B981",
    },
    {
      label: "CONVERSION RATE",
      value: `${stats.conversionRate}%`,
      trend: "2%",
      color: "#EC4899", // Pink/Rose
      trendColor: "#EC4899",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="relative bg-white rounded-[20px] p-5 flex flex-col justify-start"
          style={{ overflow: 'hidden' }}
        >
          {/* Left Accent Border */}
          <div 
            className="absolute left-0 top-[30%] bottom-[30%] w-[3px] rounded-r-full"
            style={{ backgroundColor: card.color }}
          ></div>

          {loading ? (
             <div className="animate-pulse w-full">
                <div className="flex justify-between items-start mb-3">
                    <div className="h-2 bg-gray-100 rounded w-1/3"></div>
                    <div className="h-1 w-3 bg-gray-100 rounded-full"></div>
                </div>
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-50 rounded w-1/4"></div>
             </div>
          ) : (
            <>
              {/* Card Header */}
              <div className="flex justify-between items-start mb-2.5">
                <p className="text-[9px] font-bold text-gray-400 tracking-[0.05em] uppercase">
                  {card.label}
                </p>
                <div className="text-gray-300 hover:text-gray-500 cursor-pointer transition-colors p-1 -mt-1 -mr-1">
                   <div className="flex gap-[1.5px]">
                      <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                      <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                      <div className="w-[2px] h-[2px] rounded-full bg-current"></div>
                   </div>
                </div>
              </div>

              {/* Big Value */}
              <div className="mb-3.5">
                <h2 className="text-xl font-bold text-[#1F2937] font-poppins tracking-tight">
                  {card.value}
                </h2>
              </div>

              {/* Trend Info */}
              <div className="flex items-center gap-2">
                <div 
                   className="w-4.5 h-4.5 rounded-md flex items-center justify-center transition-transform group-hover:scale-110"
                   style={{ backgroundColor: `${card.color}15`, color: card.color }}
                >
                   <i className="fi fi-rr-arrow-trend-up flex text-[8px]"></i>
                </div>
                <p className="text-[10px] font-bold text-gray-600">
                  {card.trend}
                </p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
