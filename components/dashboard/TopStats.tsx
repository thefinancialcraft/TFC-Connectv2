import React, { useMemo } from "react";
import { DashboardStats, SecondaryStats as SecondaryStatsType } from "../../hooks/useDashboardStats";
import { ChartPoint, HourlyStatPoint } from "../../hooks/useDashboardCharts";

interface TopStatsProps {
  stats: DashboardStats;
  secondaryStats?: SecondaryStatsType;
  chartData: ChartPoint[];
  hourlyStats?: HourlyStatPoint[];
  dateFilter?: string;
  loading?: boolean;
}

export default function TopStats({
  stats,
  secondaryStats,
  chartData = [],
  hourlyStats = [],
  dateFilter = "today",
  loading = false,
}: TopStatsProps) {
  // Dynamic bar data based on dateFilter:
  // 1. "today" or "yesterday": 6 bars for 9 AM - 9 PM window (2-hour slots: 9-11 AM, 11 AM-1 PM, 1-3 PM, 3-5 PM, 5-7 PM, 7-9 PM)
  // 2. "this_week" or "last_7_days": 7 bars with weekday names (Mon, Tue, etc.)
  // 3. "this_month" or "last_month": 6 bars with 5-day interval gaps
  // 4. "this_year", "1yr", "multi_year": 6 bars with 2-month gaps
  const barData = useMemo(() => {
    // -------------------------------------------------------------
    // Mode 1: Today / Yesterday -> 9 AM to 9 PM window (6 bars, 2-hr intervals)
    // -------------------------------------------------------------
    if (dateFilter === "today" || dateFilter === "yesterday") {
      const slots = [
        { label: "9-11A", fullLabel: "9:00 AM - 11:00 AM", hours: ["9 AM", "10 AM"] },
        { label: "11-1P", fullLabel: "11:00 AM - 1:00 PM", hours: ["11 AM", "12 PM"] },
        { label: "1-3P", fullLabel: "1:00 PM - 3:00 PM", hours: ["1 PM", "2 PM"] },
        { label: "3-5P", fullLabel: "3:00 PM - 5:00 PM", hours: ["3 PM", "4 PM"] },
        { label: "5-7P", fullLabel: "5:00 PM - 7:00 PM", hours: ["5 PM", "6 PM"] },
        { label: "7-9P", fullLabel: "7:00 PM - 9:00 PM", hours: ["7 PM", "8 PM"] },
      ];

      const hourlyMap: Record<string, number> = {};
      (hourlyStats || []).forEach((h) => {
        if (h.hour) {
          hourlyMap[h.hour] = (hourlyMap[h.hour] || 0) + (h.total || 0);
        }
      });

      // Current hour in IST to highlight active slot if "today"
      const nowIst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const curHour = nowIst.getHours(); // 0-23

      const slotVals = slots.map((s) => {
        return s.hours.reduce((acc, h) => acc + (hourlyMap[h] || 0), 0);
      });
      const maxVal = Math.max(...slotVals, 1);

      return slots.map((s, idx) => {
        const val = slotVals[idx];
        const startH = 9 + idx * 2;
        const endH = startH + 2;
        const isCurrentSlot = dateFilter === "today" && curHour >= startH && curHour < endH;

        return {
          day: s.label,
          fullLabel: s.fullLabel,
          val,
          heightPct: Math.max(Math.min(Math.round((val / maxVal) * 100), 100), val > 0 ? 8 : 4),
          isHighlighted: isCurrentSlot,
          isEmpty: val === 0,
        };
      });
    }

    // -------------------------------------------------------------
    // Mode 2: Week / Last 7 Days -> Last 7 days with weekday names
    // -------------------------------------------------------------
    if (dateFilter === "this_week" || dateFilter === "last_7_days") {
      const dataMap: Record<string, number> = {};
      (chartData || []).forEach((d) => {
        if (d.name) dataMap[d.name] = (dataMap[d.name] || 0) + (d.dials || 0);
      });

      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const days7: { dateKey: string; label: string; fullLabel: string; isToday: boolean }[] = [];
      const now = new Date();

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateKey = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
        const dayOfWeek = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getDay();
        const dayNum = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getDate();
        const monthName = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).toLocaleDateString("en-US", { month: "short" });
        days7.push({
          dateKey,
          label: dayLabels[dayOfWeek],
          fullLabel: `${dayLabels[dayOfWeek]} ${dayNum} ${monthName}`,
          isToday: i === 0,
        });
      }

      const vals = days7.map((d) => dataMap[d.dateKey] || 0);
      const maxVal = Math.max(...vals, 1);

      return days7.map((d, idx) => ({
        day: d.label,
        fullLabel: d.fullLabel,
        val: vals[idx],
        heightPct: Math.max(Math.min(Math.round((vals[idx] / maxVal) * 100), 100), vals[idx] > 0 ? 8 : 4),
        isHighlighted: d.isToday,
        isEmpty: vals[idx] === 0,
      }));
    }

    // -------------------------------------------------------------
    // Mode 3: Month / Last Month -> 6 bars with 5-day intervals
    // -------------------------------------------------------------
    if (dateFilter === "this_month" || dateFilter === "last_month") {
      const dataMap: Record<string, number> = {};
      (chartData || []).forEach((d) => {
        if (d.name) dataMap[d.name] = (dataMap[d.name] || 0) + (d.dials || 0);
      });

      const now = new Date();
      const istDateStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      const parts = istDateStr.split("-");
      let year = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10); // 1-12

      if (dateFilter === "last_month") {
        month -= 1;
        if (month === 0) {
          month = 12;
          year -= 1;
        }
      }

      const totalDaysInMonth = new Date(year, month, 0).getDate(); // 28, 29, 30, or 31
      const monthShort = new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "short" });

      // 6 intervals across the month
      const intervals = [
        { start: 1, end: 5, label: "1-5" },
        { start: 6, end: 10, label: "6-10" },
        { start: 11, end: 15, label: "11-15" },
        { start: 16, end: 20, label: "16-20" },
        { start: 21, end: 25, label: "21-25" },
        { start: 26, end: totalDaysInMonth, label: `26-${totalDaysInMonth}` },
      ];

      const curDay = dateFilter === "this_month" ? new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getDate() : -1;

      const vals = intervals.map((iv) => {
        let sum = 0;
        for (let d = iv.start; d <= iv.end; d++) {
          const dStr = d.toString().padStart(2, "0");
          const mStr = month.toString().padStart(2, "0");
          const key = `${year}-${mStr}-${dStr}`;
          sum += dataMap[key] || 0;
        }
        return sum;
      });
      const maxVal = Math.max(...vals, 1);

      return intervals.map((iv, idx) => {
        const val = vals[idx];
        const isCurrent = curDay >= iv.start && curDay <= iv.end;
        return {
          day: iv.label,
          fullLabel: `${iv.label} ${monthShort} (${year})`,
          val,
          heightPct: Math.max(Math.min(Math.round((val / maxVal) * 100), 100), val > 0 ? 8 : 4),
          isHighlighted: isCurrent,
          isEmpty: val === 0,
        };
      });
    }

    // -------------------------------------------------------------
    // Mode 4: 1 Year / Multi-Year / Other -> 6 bars with 2-month gaps
    // -------------------------------------------------------------
    const dataMap: Record<string, number> = {};
    (chartData || []).forEach((d) => {
      if (d.name) dataMap[d.name] = (dataMap[d.name] || 0) + (d.dials || 0);
    });

    const now = new Date();
    const istDateStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const currentYear = parseInt(istDateStr.split("-")[0], 10);
    const curMonthIndex = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getMonth(); // 0-11

    // 6 intervals: Jan-Feb, Mar-Apr, May-Jun, Jul-Aug, Sep-Oct, Nov-Dec
    const biMonths = [
      { months: [1, 2], label: "Jan-Feb", fullLabel: `Jan - Feb ${currentYear}` },
      { months: [3, 4], label: "Mar-Apr", fullLabel: `Mar - Apr ${currentYear}` },
      { months: [5, 6], label: "May-Jun", fullLabel: `May - Jun ${currentYear}` },
      { months: [7, 8], label: "Jul-Aug", fullLabel: `Jul - Aug ${currentYear}` },
      { months: [9, 10], label: "Sep-Oct", fullLabel: `Sep - Oct ${currentYear}` },
      { months: [11, 12], label: "Nov-Dec", fullLabel: `Nov - Dec ${currentYear}` },
    ];

    const vals = biMonths.map((bm) => {
      let sum = 0;
      Object.keys(dataMap).forEach((dateKey) => {
        // format YYYY-MM-DD
        const parts = dateKey.split("-");
        if (parts.length >= 2) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          if (y === currentYear && bm.months.includes(m)) {
            sum += dataMap[dateKey] || 0;
          }
        }
      });
      return sum;
    });
    const maxVal = Math.max(...vals, 1);

    return biMonths.map((bm, idx) => {
      const val = vals[idx];
      const isCurrent = bm.months.includes(curMonthIndex + 1);
      return {
        day: bm.label,
        fullLabel: bm.fullLabel,
        val,
        heightPct: Math.max(Math.min(Math.round((val / maxVal) * 100), 100), val > 0 ? 8 : 4),
        isHighlighted: isCurrent,
        isEmpty: val === 0,
      };
    });
  }, [chartData, hourlyStats, dateFilter]);

  // Conversion rate
  const conversionPct = Math.min(Math.max(Number(stats.conversionRate) || 0, 0), 100);

  // Compact Minimal Radial Arc Ticks (themed with brand indigo #4b33e8 and cool gray)
  const totalTicks = 34;
  const activeTicks = Math.round((conversionPct / 100) * totalTicks);

  const ticks = useMemo(() => {
    const radius = 56;
    const centerX = 68;
    const centerY = 62;
    return Array.from({ length: totalTicks }).map((_, i) => {
      const angleDeg = 180 - (i / (totalTicks - 1)) * 180;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x1 = centerX + (radius - 9) * Math.cos(angleRad);
      const y1 = centerY - (radius - 9) * Math.sin(angleRad);
      const x2 = centerX + radius * Math.cos(angleRad);
      const y2 = centerY - radius * Math.sin(angleRad);
      const isActive = i <= activeTicks;
      return { x1, y1, x2, y2, isActive };
    });
  }, [activeTicks]);

  // Format Talktime
  const talktimeDisplay = useMemo(() => {
    const totalSecs = stats.totalTalktime || 0;
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }, [stats.totalTalktime]);

  // Secondary metrics
  const totalRecords = secondaryStats?.newProspects || 1;
  const freshPercentage = Math.min(
    Math.round(((secondaryStats?.freshProspects || 0) / (totalRecords || 1)) * 100),
    100
  );
  const overduePercentage = Math.min(
    Math.round(
      ((secondaryStats?.overdueFollowups || 0) / (secondaryStats?.followupCalls || 1)) * 100
    ),
    100
  );

  const secondaryItems = [
    {
      label: "Active Campaigns",
      value: (stats.activeCampaigns || 0).toLocaleString(),
      subtext: "Live campaigns",
    },
    {
      label: "Team Members",
      value: (secondaryStats?.assignedMembers || 0).toLocaleString(),
      subtext: "Available callers",
    },
    {
      label: "Total Records",
      value: (secondaryStats?.newProspects || 0).toLocaleString(),
      subtext: "All leads assigned",
    },
    {
      label: "Fresh Prospects",
      value: (secondaryStats?.freshProspects || 0).toLocaleString(),
      subtext: `${freshPercentage}% untouched`,
    },
    {
      label: "Total Followups",
      value: (secondaryStats?.followupCalls || 0).toLocaleString(),
      subtext: "Scheduled callbacks",
    },
    {
      label: "Overdue",
      value: (secondaryStats?.overdueFollowups || 0).toLocaleString(),
      subtext: `${overduePercentage}% of followups`,
    },
  ];

  return (
    <div className="w-full bg-transparent p-1 sm:p-2 box-border">
      {/* Upper Row: Seamless Modern Canvas Layout matching TFC Connect Theme (#263238 / #4b33e8 / #787E9D) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-6 sm:gap-y-8 lg:gap-x-8 items-center pb-7">
        {/* 1. Bar Chart Widget - Activity Dials (Span 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between min-w-0 pr-0 lg:pr-4">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-[13px] sm:text-[14px] font-semibold text-[#263238] tracking-tight">
              Activity Dials
            </span>
            <span className="text-[12px] font-medium text-[#787E9D] font-mono">
              {(stats.totalDials || 0).toLocaleString()} calls
            </span>
          </div>

          <div className="flex items-end justify-between h-20 px-1 pt-1 pb-1.5 border-b border-gray-200 gap-1">
            {barData.map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <div className="w-full h-14 flex items-end justify-center">
                  <div
                    style={{ height: `${bar.heightPct}%` }}
                    className={`w-full max-w-[18px] rounded-t-[4px] transition-all duration-500 ${
                      bar.isHighlighted
                        ? "bg-[#4b33e8] shadow-sm shadow-indigo-300"
                        : bar.isEmpty
                        ? "bg-gray-100"
                        : "bg-[#4b33e8] opacity-50"
                    }`}
                    title={`${bar.fullLabel} — ${bar.val} call${bar.val !== 1 ? 's' : ''}`}
                  />
                </div>
                <span className={`text-[9px] font-medium ${ bar.isHighlighted ? 'text-[#4b33e8] font-bold' : 'text-[#787E9D]'}`}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Semi-Circle Gauge Widget - Conversion Rate (Span 3) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center min-w-0 px-0 lg:px-2">
          <div className="relative w-36 h-22 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 136 72" className="w-full h-full">
              {ticks.map((t, idx) => (
                <line
                  key={idx}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.isActive ? "#4b33e8" : "#E2E8F0"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute bottom-0 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#263238] leading-none font-mono">
                {conversionPct}%
              </span>
              <span className="text-[10px] font-medium text-[#787E9D] mt-1 tracking-wide" title="Unique leads converted to Call Back / Total unique leads">
                Callbacks Converted
              </span>
            </div>
          </div>
        </div>

        {/* 3. Number Widget - Callbacks Converted (Span 2.5) */}
        <div className="lg:col-span-2 lg:col-start-8 flex flex-col justify-center min-w-0 group cursor-pointer">
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-4xl font-bold text-[#263238] font-mono tracking-tight leading-none group-hover:text-[#4b33e8] transition-colors">
              {(stats.totalConverted || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 text-[#787E9D] group-hover:text-[#263238] transition-colors">
            <div className="text-[12px] font-medium leading-tight text-[#263238]">
              Callbacks Converted
              <div className="text-[10px] font-normal text-[#787E9D] mt-0.5">Unique leads in callbacks</div>
            </div>
            <span className="text-base font-semibold text-[#4b33e8] transition-transform group-hover:translate-x-1.5 shrink-0 ml-2">
              &rarr;
            </span>
          </div>
        </div>

        {/* 4. Number Widget - Total Talktime (Span 3) */}
        <div className="lg:col-span-3 flex flex-col justify-center min-w-0 group cursor-pointer pl-0 lg:pl-4">
          <div className="flex items-baseline">
            <span className="text-[28px] sm:text-[34px] font-bold text-[#263238] font-mono tracking-tight leading-none group-hover:text-[#4b33e8] transition-colors">
              {talktimeDisplay}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 text-[#787E9D] group-hover:text-[#263238] transition-colors">
            <div className="text-[12px] font-medium leading-tight text-[#263238]">
              Total talktime
              <div className="text-[10px] font-normal text-[#787E9D] mt-0.5">Caller duration</div>
            </div>
            <span className="text-base font-semibold text-[#4b33e8] transition-transform group-hover:translate-x-1.5 shrink-0 ml-2">
              &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Modern Hairline Divider in Theme Border */}
      <div className="w-full border-t border-gray-200/80" />

      {/* Lower Row: 6 Secondary Operational Metrics (Seamless, In Brand Tone) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-6 pt-6">
        {secondaryItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between min-w-0 group cursor-pointer"
          >
            {loading ? (
              <div className="animate-pulse w-full py-0.5">
                <div className="h-2.5 bg-gray-200/60 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200/80 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200/50 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                {/* Header: Label */}
                <div className="flex items-center mb-1.5">
                  <span className="text-[12px] font-medium text-[#787E9D] truncate tracking-tight">
                    {item.label}
                  </span>
                </div>

                {/* Main Clean Mono Number */}
                <div className="my-1 flex items-baseline">
                  <span className="text-2xl font-bold text-[#263238] font-mono tracking-tight truncate leading-tight group-hover:text-[#4b33e8] transition-colors">
                    {item.value}
                  </span>
                </div>

                {/* Subtitle with Arrow on Hover */}
                <div className="flex items-center justify-between text-[#787E9D] group-hover:text-[#263238] transition-colors mt-1">
                  <span className="text-[11px] font-normal truncate text-[#787E9D]">
                    {item.subtext}
                  </span>
                  <span className="text-[12px] font-semibold text-[#4b33e8] opacity-0 transition-all -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 ml-1 shrink-0">
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
