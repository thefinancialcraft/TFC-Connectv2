import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  LabelList,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { DashboardStats, PerformanceMetrics } from "../../hooks/useDashboardStats";
import { CampaignDataPoint, PieDataPoint } from "../../hooks/useDashboardCharts";

interface ProspectTabProps {
  stats: DashboardStats;
  performanceMetrics: PerformanceMetrics;
  campaignData: CampaignDataPoint[];
  pieData: PieDataPoint[];
}

export default function ProspectTab({
  stats,
  performanceMetrics,
  campaignData,
  pieData,
}: ProspectTabProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {/* Middle Row (Analytics & Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales Performance (Gauge) */}
        <div className="lg:col-span-4 bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#263238] text-sm flex items-center gap-2">
              Efficiency Score
              <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
            </h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full" style={{ height: '180px' }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>

                  <RadialBarChart
                    cx="50%"
                    cy="100%"
                    innerRadius="150%"
                    outerRadius="130%"
                    startAngle={180}
                    endAngle={0}
                    data={[
                      {
                        name: "Score",
                        value: stats.efficiencyScore,
                        fill: "#f97316",
                      },
                    ]}
                  >
                    <RadialBar
                      background={{ fill: "#f5f5f5" }}
                      dataKey="value"
                      cornerRadius={30}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              )}

              <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <h4 className="text-3xl font-bold text-[#263238]">
                  {stats.efficiencyScore}{" "}
                  <span className="text-base text-green-500 font-medium">
                    +1
                  </span>
                </h4>
                <p className="text-[9px] text-[#787E9D] font-medium mt-0.5 uppercase tracking-tighter">
                  of 100 points
                </p>
              </div>
            </div>

            <div className="mt-6 text-center px-4">
              <p className="text-sm font-bold text-[#263238]">
                Team Momentum is high ✨
              </p>
            </div>
          </div>
        </div>

        {/* Summary Details */}
        <div className="lg:col-span-8 bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#263238] text-sm">
              Engagement Summary
            </h3>
            <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              On Target
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            {[
              {
                title: "Connected",
                val: performanceMetrics.connectedRate,
                desc: "Ratio",
                color: "blue",
              },
              {
                title: "Duration",
                val: performanceMetrics.avgDuration,
                desc: "Avg talk",
                color: "purple",
              },
              {
                title: "ROI",
                val: performanceMetrics.roi,
                desc: "Performance",
                color: "orange",
              },
              {
                title: "Response",
                val: (stats.totalDials || 0).toLocaleString(),
                desc: "Tracked",
                color: "emerald",
              },
            ].map((box, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
              >
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {box.title}
                </p>
                <div className="mt-1.5">
                  <h5 className="text-xl font-bold text-[#263238] leading-tight">
                    {box.val}
                  </h5>
                  <p className="text-[8px] text-gray-500 mt-0.5">
                    {box.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row (Heatmap & Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-4">
        {/* Campaign-wise Analysis */}
        <div className="lg:col-span-8 bg-white rounded-[20px] p-6 border border-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#263238] text-sm flex items-center gap-2">
              Campaign Responses
              <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
            </h3>
          </div>
          <div className="flex-1" style={{ height: '250px', width: '100%', position: 'relative' }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>

                <BarChart data={campaignData} barGap={8}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F1F1"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#787E9D",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                    dy={5}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#787E9D",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F9FAFB", radius: 8 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      background: "#111827",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    name="Total"
                    fill="#4b33e8"
                    radius={[4, 4, 4, 4]}
                    barSize={20}
                  >
                    <LabelList
                      dataKey="total"
                      position="center"
                      fill="#fff"
                      fontSize={8}
                      fontWeight="bold"
                    />
                  </Bar>
                  <Bar
                    dataKey="success"
                    name="Conv"
                    fill="#10b981"
                    radius={[4, 4, 4, 4]}
                    barSize={20}
                  >
                    <LabelList
                      dataKey="success"
                      position="center"
                      fill="#fff"
                      fontSize={8}
                      fontWeight="bold"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

        {/* Latest Responses Distribution */}
        <div className="lg:col-span-4 bg-white rounded-[20px] p-6 border border-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#263238] text-sm flex items-center gap-2">
              Latest Status
              <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
            </h3>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="relative w-full" style={{ height: '180px' }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>

                  <PieChart>
                    <Pie
                      data={
                        pieData.length > 0
                          ? pieData
                          : [{ name: "Fresh Lead", value: 1 }]
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#f97316",
                              "#4b33e8",
                              "#10b981",
                              "#facc15",
                              "#6366f1",
                            ][index % 5]
                          }
                        />
                      ))}
                      <Label
                        content={(props: any) => {
                          const { cx, cy } = props.viewBox;
                          return (
                            <g>
                              <text
                                x={cx}
                                y={cy - 5}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  fill: "#263238",
                                  fontFamily: "Poppins",
                                }}
                              >
                                {stats.totalCustomers}
                              </text>
                              <text
                                x={cx}
                                y={cy + 12}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{
                                  fontSize: "8px",
                                  fontWeight: "bold",
                                  fill: "#787E9D",
                                  fontFamily: "Poppins",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                Leads
                              </text>
                            </g>
                          );
                        }}
                      />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}

            </div>

            <div className="mt-4 space-y-3.5">
              {pieData.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                    <span className="truncate max-w-[120px]">
                      {item.name}
                    </span>
                    <span>
                      {(
                        (item.value / (stats.totalCustomers || 1)) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden border border-gray-100/50">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${
                          (item.value / (stats.totalCustomers || 1)) *
                          100
                        }%`,
                        backgroundColor: [
                          "#f97316",
                          "#4b33e8",
                          "#10b981",
                          "#facc15",
                          "#6366f1",
                        ][idx % 5],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
