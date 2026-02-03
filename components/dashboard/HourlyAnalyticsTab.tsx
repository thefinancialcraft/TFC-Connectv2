import { useState, useEffect } from "react";
import { HeatmapDataPoint, HourlyStatPoint, useDashboardCharts } from "../../hooks/useDashboardCharts";

interface HourlyAnalyticsTabProps {
  heatmapData?: HeatmapDataPoint[];
  hourlyStats?: HourlyStatPoint[];
  selectedUserId?: string;
  selectedOrgId?: string;
}

export default function HourlyAnalyticsTab({
  heatmapData: initialHeatmap,
  hourlyStats: initialHourly,
  selectedUserId,
  selectedOrgId
}: HourlyAnalyticsTabProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  
  const { 
    heatmapData, 
    hourlyStats, 
    fetchChartData, 
    loading 
  } = useDashboardCharts();

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      // Create ISO strings for start and end of selected dates
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      setIsFiltered(true);
      fetchChartData(selectedOrgId === 'all' ? undefined : selectedOrgId, "custom", {
        start: start.toISOString(),
        end: end.toISOString()
      }, selectedUserId === 'all' ? undefined : selectedUserId);
    }
  };

  const currentHeatmap = isFiltered ? heatmapData : (initialHeatmap || []);
  const currentHourly = isFiltered ? hourlyStats : (initialHourly || []);
  const isLoading = isFiltered ? loading : false;

  const timeSlots = [
    "8 AM - 10 AM",
    "10 AM - 12 PM",
    "12 PM - 2 PM",
    "2 PM - 4 PM",
    "4 PM - 6 PM",
    "6 PM - 8 PM",
    "8 PM - 10 PM",
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Inputs */}
      <div className="flex justify-end items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-500 focus:outline-none focus:border-[#4b33e8] shadow-sm"
          />
          <span className="text-gray-400 font-bold">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-500 focus:outline-none focus:border-[#4b33e8] shadow-sm"
          />
        </div>
        <button
          onClick={handleApplyFilter}
          disabled={isLoading || !startDate || !endDate}
          className="px-4 py-2 bg-[#4b33e8] hover:bg-[#3b25b8] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <i className="fi fi-rr-filter flex text-xs"></i>
          )}
          Apply Filter
        </button>
      </div>

      {/* Heatmap Widget */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-[20px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b33e8]"></div>
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#263238] text-sm">
              Visit by Time
            </h3>
            <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-400">
              0
            </span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.7, 1].map((op, i) => (
                <div
                  key={i}
                  className="w-4 h-2 rounded-full bg-[#f97316]"
                  style={{ opacity: op }}
                ></div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-tighter">
              1,000+
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-x-3">
            <thead>
              <tr>
                <th className="w-32 sticky left-0 bg-white z-10"></th>
                {currentHeatmap.map((d) => (
                  <th
                    key={d.day}
                    className="pb-6 text-[10px] font-bold text-gray-400 tracking-widest text-center whitespace-nowrap"
                  >
                    {d.day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeslot, idx) => (
                <tr key={idx}>
                  <td className="sticky left-0 bg-white z-10 pr-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap text-right align-middle">
                    {timeslot}
                  </td>
                  {currentHeatmap.map((dayData, i) => {
                    const val = (dayData[timeslot] as number) || 0;
                    const intensity = Math.min(1, val / 100);
                    return (
                      <td key={i} className="p-0.5">
                        <div
                          className="h-8 min-w-[60px] rounded-[16px] transition-all duration-300 cursor-pointer hover:scale-[1.05]"
                          title={`${dayData.day}, ${timeslot}: ${val} calls`}
                          style={{
                            backgroundColor:
                              val > 0 ? "#f97316" : "#F9FBFE",
                            opacity:
                              val > 0 ? 0.1 + intensity * 0.9 : 1,
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hourly Table */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-[20px]">
             {/* Spinner already shown in heatmap, avoid duplicate if close or just show subtle opacity */}
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-[#263238] text-lg">
              Hourly Analysis
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Time interval tracking
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
            <i className="fi fi-rr-download flex text-[10px]"></i>
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Hour Interval
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Total Calls
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Connected
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Outgoing
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Missed
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Avg Talktime
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {currentHourly.map((row, i) => (
                <tr
                  key={i}
                  className="bg-white hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-50">
                    <span className="text-sm font-bold text-[#263238]">
                      {row.hour}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-y border-gray-50">
                    <span className="text-sm font-bold text-gray-600">
                      {row.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-y border-gray-50">
                    <span className="text-sm font-bold text-green-600">
                      {row.connected}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-y border-gray-50">
                    <span className="text-sm font-bold text-gray-600">
                      {row.outgoing}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-y border-gray-50">
                    <span className="text-sm font-bold text-red-500">
                      {row.missed}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-y border-gray-50">
                    <span className="text-sm font-bold text-gray-600">
                      {Math.floor(row.talktime / (row.total || 1))}s
                    </span>
                  </td>
                  <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-50 text-right">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[100px] ml-auto overflow-hidden">
                      <div
                        className="bg-[#4b33e8] h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (row.total / 100) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
