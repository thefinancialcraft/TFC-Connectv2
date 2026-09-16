import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { supabase, supabaseAdmin } from "../../../lib/supabase";
import { getISTDateRange } from "../../../lib/dateUtils";

interface TimeSlotResult {
  slotKey: string;
  timeLabel: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  disposedLeads: number;
  dialedLeads: number;
  connectedLeads: number;
  followUpLeads: number;
  connectedConversion: string;
}

interface EmployeeTimeBreakdownResponse {
  success: boolean;
  data?: {
    slots: TimeSlotResult[];
    totalDisposed: number;
    totalDialed: number;
    totalConnected: number;
    totalFollowUps: number;
    overallConversion: string;
    employeeName: string;
    employeeId: string;
    campaignName: string;
  };
  error?: string;
}

// Generate time slots from 9:00 AM to 9:00 PM IST
function generateSlots(interval: "1hr" | "30min"): TimeSlotResult[] {
  const slots: TimeSlotResult[] = [];
  const startHour = 9;
  const endHour = 21; // 9:00 PM

  if (interval === "30min") {
    for (let h = startHour; h < endHour; h++) {
      // First 30 min: h:00 to h:30
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const startLabel = `${String(h12).padStart(2, "0")}:00 ${ampm}`;
      const endLabel = `${String(h12).padStart(2, "0")}:30 ${ampm}`;
      slots.push({
        slotKey: `${h}:00-${h}:30`,
        timeLabel: `${startLabel} - ${endLabel}`,
        startHour: h,
        startMin: 0,
        endHour: h,
        endMin: 30,
        disposedLeads: 0,
        dialedLeads: 0,
        connectedLeads: 0,
        followUpLeads: 0,
        connectedConversion: "0.0%",
      });

      // Second 30 min: h:30 to (h+1):00
      const nextH = h + 1;
      const nextH12 = nextH > 12 ? nextH - 12 : nextH === 0 ? 12 : nextH;
      const nextAmpm = nextH >= 12 ? "PM" : "AM";
      const endLabel2 = `${String(nextH12).padStart(2, "0")}:00 ${nextAmpm}`;
      slots.push({
        slotKey: `${h}:30-${nextH}:00`,
        timeLabel: `${endLabel} - ${endLabel2}`,
        startHour: h,
        startMin: 30,
        endHour: nextH,
        endMin: 0,
        disposedLeads: 0,
        dialedLeads: 0,
        connectedLeads: 0,
        followUpLeads: 0,
        connectedConversion: "0.0%",
      });
    }
  } else {
    // 1 hour intervals
    for (let h = startHour; h < endHour; h++) {
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const nextH = h + 1;
      const nextH12 = nextH > 12 ? nextH - 12 : nextH === 0 ? 12 : nextH;
      const nextAmpm = nextH >= 12 ? "PM" : "AM";
      const startLabel = `${String(h12).padStart(2, "0")}:00 ${ampm}`;
      const endLabel = `${String(nextH12).padStart(2, "0")}:00 ${nextAmpm}`;
      slots.push({
        slotKey: `${h}:00-${nextH}:00`,
        timeLabel: `${startLabel} - ${endLabel}`,
        startHour: h,
        startMin: 0,
        endHour: nextH,
        endMin: 0,
        disposedLeads: 0,
        dialedLeads: 0,
        connectedLeads: 0,
        followUpLeads: 0,
        connectedConversion: "0.0%",
      });
    }
  }

  return slots;
}

function getSlotIndex(date: Date, interval: "1hr" | "30min"): number {
  // Convert date to IST parts
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);

  // Must be between 9 AM and 9 PM (9 to 21)
  if (hour < 9 || hour >= 21) return -1;

  if (interval === "30min") {
    const hourOffset = hour - 9;
    const halfOffset = minute >= 30 ? 1 : 0;
    return hourOffset * 2 + halfOffset;
  } else {
    return hour - 9;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeTimeBreakdownResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    const {
      campaignId,
      userId,
      employeeId,
      dateFilter = "today",
      interval = "1hr",
      startDate,
      endDate,
    } = req.query;

    if (!campaignId) {
      return res.status(400).json({ success: false, error: "Missing campaignId" });
    }

    const dbClient = supabaseAdmin || supabase;
    const intervalMode = interval === "30min" ? "30min" : "1hr";

    // Resolve date range
    let startRange: string;
    let endRange: string;
    if (startDate && endDate) {
      startRange = startDate as string;
      endRange = endDate as string;
    } else {
      const range = getISTDateRange((dateFilter as string) || "today");
      startRange = range.start;
      endRange = range.end || new Date().toISOString();
    }

    // Resolve user IDs and employee ID
    let resolvedUserId = (userId as string) || "";
    let resolvedEmpId = (employeeId as string) || "";
    let resolvedUserName = "Agent";

    if (resolvedUserId || resolvedEmpId) {
      let profQuery = dbClient
        .from("user_profiles")
        .select("user_id, employee_id, user_name");
      if (resolvedUserId) {
        profQuery = profQuery.eq("user_id", resolvedUserId);
      } else {
        profQuery = profQuery.eq("employee_id", resolvedEmpId);
      }
      const { data: prof } = await profQuery.maybeSingle();
      if (prof) {
        resolvedUserId = prof.user_id || resolvedUserId;
        resolvedEmpId = prof.employee_id || resolvedEmpId;
        resolvedUserName = prof.user_name || resolvedEmpId || "Agent";
      }
    }

    // Fetch campaign details
    let campaignName = "Campaign";
    const { data: campRow } = await dbClient
      .from("campaigns")
      .select("name")
      .eq("id", campaignId)
      .maybeSingle();
    if (campRow?.name) {
      campaignName = campRow.name;
    }

    // 1. Fetch CRM call_logs for this campaign & agent in date range (including disposition & sub_disposition)
    let callLogsQuery = dbClient
      .from("call_logs")
      .select("customer_id, created_at, duration, is_connected, disposition, sub_disposition")
      .eq("campaign_id", campaignId)
      .gte("created_at", startRange)
      .lte("created_at", endRange);

    if (resolvedUserId) {
      callLogsQuery = callLogsQuery.eq("agent_id", resolvedUserId);
    }

    const { data: callLogs } = await callLogsQuery;

    // 2. Fetch rejected_leads for CRM activity
    let rejQuery = dbClient
      .from("rejected_leads")
      .select("customer_id, rejected_at, disposition, sub_disposition")
      .eq("campaign_id", campaignId)
      .gte("rejected_at", startRange)
      .lte("rejected_at", endRange);

    if (resolvedUserId) {
      rejQuery = rejQuery.eq("agent_id", resolvedUserId);
    }
    const { data: rejData } = await rejQuery;

    // 3. Fetch closed_deals for CRM activity
    let dealsQuery = dbClient
      .from("closed_deals")
      .select("customer_id, closed_at")
      .eq("campaign_id", campaignId)
      .gte("closed_at", startRange)
      .lte("closed_at", endRange);

    if (resolvedUserId) {
      dealsQuery = dealsQuery.eq("agent_id", resolvedUserId);
    }
    const { data: dealsData } = await dealsQuery;

    // Deduplicate CRM actions within 5-sec window matching dashboard logic
    const validLogs = callLogs || [];
    const dedupedRej = (rejData || []).filter(
      (r: any) =>
        !validLogs.some(
          (l: any) =>
            l.customer_id &&
            l.customer_id === r.customer_id &&
            Math.abs(new Date(l.created_at).getTime() - new Date(r.rejected_at).getTime()) < 5000
        )
    );
    const dedupedDeals = (dealsData || []).filter(
      (d: any) =>
        !validLogs.some(
          (l: any) =>
            l.customer_id &&
            l.customer_id === d.customer_id &&
            Math.abs(new Date(l.created_at).getTime() - new Date(d.closed_at).getTime()) < 5000
        )
    );

    // 4. Fetch mobile call_history for employee
    let mobileCalls: any[] = [];
    if (resolvedEmpId) {
      const { data: mCalls } = await dbClient
        .from("call_history")
        .select("number, duration, timestamp")
        .eq("employee_id", resolvedEmpId)
        .gte("timestamp", startRange)
        .lte("timestamp", endRange);

      if (mCalls && mCalls.length > 0) {
        // Collect dialed hashes/phones to verify if they belong to this campaign
        const cleanDigits = Array.from(
          new Set(
            mCalls
              .map((m: any) => String(m.number || "").replace(/\D/g, "").slice(-10))
              .filter((d: string) => d.length >= 7)
          )
        );

        const dialedHashes = cleanDigits.map((d: string) =>
          crypto.createHash("sha256").update(d).digest("hex")
        );

        const campPhones = new Set<string>();
        const campHashes = new Set<string>();

        if (dialedHashes.length > 0) {
          const chunkSize = 200;
          for (let i = 0; i < dialedHashes.length; i += chunkSize) {
            const hashChunk = dialedHashes.slice(i, i + chunkSize);

            const [custRes, rejRes, dealRes] = await Promise.all([
              dbClient
                .from("customers")
                .select("phone_no, phone_search_hash")
                .eq("campaign_id", campaignId)
                .in("phone_search_hash", hashChunk),
              dbClient
                .from("rejected_leads")
                .select("phone_no, phone_search_hash")
                .eq("campaign_id", campaignId)
                .in("phone_search_hash", hashChunk),
              dbClient
                .from("closed_deals")
                .select("phone_no, phone_search_hash")
                .eq("campaign_id", campaignId)
                .in("phone_search_hash", hashChunk),
            ]);

            [...(custRes.data || []), ...(rejRes.data || []), ...(dealRes.data || [])].forEach(
              (item: any) => {
                if (item.phone_search_hash) campHashes.add(item.phone_search_hash);
                if (item.phone_no) {
                  const d = String(item.phone_no).replace(/\D/g, "").slice(-10);
                  if (d) campPhones.add(d);
                }
              }
            );
          }
        }

        // Filter mobile calls that match this campaign
        mobileCalls = mCalls.filter((m: any) => {
          const rawNum = String(m.number || "");
          const clean10 = rawNum.replace(/\D/g, "").slice(-10);
          if (clean10 && campPhones.has(clean10)) return true;
          if (rawNum) {
            const h = crypto
              .createHash("sha256")
              .update(clean10 || rawNum.replace(/\D/g, ""))
              .digest("hex");
            if (campHashes.has(h)) return true;
          }
          return false;
        });
      }
    }

    // Helper to check if a record represents a follow-up disposition
    const isFollowUpDisposition = (disp?: string | null, subDisp?: string | null) => {
      const d = String(disp || "").toLowerCase().trim();
      const s = String(subDisp || "").toLowerCase().trim();
      return (
        d === "call back" ||
        d === "callback" ||
        d === "follow up" ||
        d === "followup" ||
        s === "follow up" ||
        s === "followup" ||
        s === "intrested" ||
        s === "interested"
      );
    };

    // Prepare slots
    const slots = generateSlots(intervalMode);

    // Tally CRM Disposed leads & Follow Ups
    validLogs.forEach((l: any) => {
      if (l.created_at) {
        const idx = getSlotIndex(new Date(l.created_at), intervalMode);
        if (idx >= 0 && idx < slots.length) {
          slots[idx].disposedLeads++;
          if (isFollowUpDisposition(l.disposition, l.sub_disposition)) {
            slots[idx].followUpLeads++;
          }
        }
      }
    });

    dedupedRej.forEach((r: any) => {
      if (r.rejected_at) {
        const idx = getSlotIndex(new Date(r.rejected_at), intervalMode);
        if (idx >= 0 && idx < slots.length) {
          slots[idx].disposedLeads++;
          if (isFollowUpDisposition(r.disposition, r.sub_disposition)) {
            slots[idx].followUpLeads++;
          }
        }
      }
    });

    dedupedDeals.forEach((d: any) => {
      if (d.closed_at) {
        const idx = getSlotIndex(new Date(d.closed_at), intervalMode);
        if (idx >= 0 && idx < slots.length) {
          slots[idx].disposedLeads++;
        }
      }
    });

    // Tally Mobile Dialed & Connected leads
    // If mobileCalls has data, use it; if employee only has CRM call logs, fallback to CRM call logs
    const callSource = mobileCalls.length > 0 ? mobileCalls : validLogs;
    const isMobileSource = mobileCalls.length > 0;

    callSource.forEach((call: any) => {
      const timeField = isMobileSource ? call.timestamp : call.created_at;
      if (timeField) {
        const idx = getSlotIndex(new Date(timeField), intervalMode);
        if (idx >= 0 && idx < slots.length) {
          slots[idx].dialedLeads++;
          const isConn =
            Number(call.duration) > 0 ||
            call.is_connected === "contactable" ||
            call.is_connected === "connected";
          if (isConn) {
            slots[idx].connectedLeads++;
          }
        }
      }
    });

    // Calculate conversions and totals
    let totalDisposed = 0;
    let totalDialed = 0;
    let totalConnected = 0;
    let totalFollowUps = 0;

    slots.forEach((s) => {
      totalDisposed += s.disposedLeads;
      totalDialed += s.dialedLeads;
      totalConnected += s.connectedLeads;
      totalFollowUps += s.followUpLeads;
      s.connectedConversion =
        s.dialedLeads > 0
          ? `${((s.connectedLeads / s.dialedLeads) * 100).toFixed(1)}%`
          : "0.0%";
    });

    const overallConversion =
      totalDialed > 0
        ? `${((totalConnected / totalDialed) * 100).toFixed(1)}%`
        : "0.0%";

    return res.status(200).json({
      success: true,
      data: {
        slots,
        totalDisposed,
        totalDialed,
        totalConnected,
        totalFollowUps,
        overallConversion,
        employeeName: resolvedUserName,
        employeeId: resolvedEmpId,
        campaignName,
      },
    });
  } catch (error: any) {
    console.error("Error in employee campaign time breakdown API:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}
