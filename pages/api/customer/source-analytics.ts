// Updated source-analytics API - HMR Refresh
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

function parseAndMaskPhone(phone: string | null | undefined): { masked: string; raw: string } {
  if (!phone) return { masked: 'N/A', raw: '' };
  let raw = phone;
  if (raw.startsWith('__enc__')) {
    try {
      const base64Data = raw.substring(7);
      const encrypted = atob(base64Data);
      const SECRET_KEY = process.env.NEXT_PUBLIC_PHONE_ENCRYPTION_KEY || "RYNXLY_SECURE_PHONE_VAULT";
      raw = encrypted.split('').map((char, i) =>
        String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))
      ).join('');
    } catch (e) {
      // keep raw
    }
  }

  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.length >= 6) {
    const first4 = digits.substring(0, 4);
    const last2 = digits.substring(digits.length - 2);
    return { masked: `${first4}***${last2}`, raw: digits };
  } else if (digits.length > 0) {
    return { masked: digits, raw: digits };
  }
  return { masked: 'N/A', raw: '' };
}

function getCurrentAgentAttemptCount(custId: string, assignedAgentId: string | null | undefined, customerLogs: any[]): { count: number; currentAgentId: string | null } {
  if (!customerLogs || customerLogs.length === 0) return { count: 0, currentAgentId: assignedAgentId || null };
  
  const sortedLogs = [...customerLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const lastAgentId = sortedLogs[0]?.agent_id;
  const targetAgentId = assignedAgentId || lastAgentId;

  if (!targetAgentId) return { count: customerLogs.length, currentAgentId: null };

  const agentLogs = customerLogs.filter((l) => l.agent_id === targetAgentId);
  return {
    count: agentLogs.length > 0 ? agentLogs.length : 1,
    currentAgentId: targetAgentId
  };
}

type Data = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  const { sourceId } = req.query;

  if (!sourceId || typeof sourceId !== 'string') {
    return res.status(400).json({ success: false, error: 'Source ID is required' });
  }

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, error: 'Admin database client is not initialized' });
    }

    // 1. Verify user authentication
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    // 2. Fetch user profile to get organization_id
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('organization_id, role')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(403).json({ success: false, error: 'Access denied: Profile not found' });
    }

    // 3. Fetch system log metadata
    const { data: systemLog, error: logError } = await supabaseAdmin
      .from('system_logs')
      .select('*')
      .eq('source_id', sourceId)
      .eq('organization_id', profile.organization_id)
      .maybeSingle();

    if (logError || !systemLog) {
      return res.status(404).json({ success: false, error: 'Source file not found or unauthorized access: ' + (logError?.message || '') });
    }

    let campaignName = 'N/A';
    if (systemLog.campaign_id) {
      const { data: campaign } = await supabaseAdmin
        .from('campaigns')
        .select('name')
        .eq('id', systemLog.campaign_id)
        .maybeSingle();
      if (campaign) {
        campaignName = campaign.name;
      }
    }

    let companyName = 'N/A';
    if (systemLog.organization_id) {
      const { data: org } = await supabaseAdmin
        .from('organizations')
        .select('company_name')
        .eq('id', systemLog.organization_id)
        .maybeSingle();
      if (org) {
        companyName = org.company_name;
      }
    }

    // 4. Fetch all customers under this source_id in batches to bypass Supabase's default 1000 row limit
    let customers: any[] = [];
    let fromRange = 0;
    const BATCH_SIZE = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data: batch, error: custError } = await supabaseAdmin
        .from('customers')
        .select('id, customer_name, phone_no, status, disposition, attempt_count, assigned_to, created_at, next_called_at, last_attempt_at, campaign_id')
        .eq('source_id', sourceId)
        .eq('organization_id', profile.organization_id)
        .range(fromRange, fromRange + BATCH_SIZE - 1);

      if (custError) {
        return res.status(500).json({ success: false, error: 'Failed to fetch leads data: ' + custError.message });
      }

      if (batch && batch.length > 0) {
        customers = customers.concat(batch);
        fromRange += BATCH_SIZE;
        if (batch.length < BATCH_SIZE) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    // Fetch user profiles to map assigned_to to names in memory (since no foreign key constraint exists on assigned_to)
    const { data: profilesList } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, user_name')
      .eq('organization_id', profile.organization_id);

    const agentMap = new Map<string, string>();
    profilesList?.forEach((p) => {
      if (p.user_id && p.user_name) {
        agentMap.set(p.user_id, p.user_name);
      }
    });

    const customerIds = customers.map((c) => c.id);

    // 5. Fetch call logs for these customers (Querying by campaign & org to prevent Bad Request query string limit issues)
    let callLogs: any[] = [];
    if (systemLog.campaign_id) {
      const { data: campaignLogs, error: logsErr } = await supabaseAdmin
        .from('call_logs')
        .select('id, customer_id, agent_id, duration, disposition, is_connected, created_at')
        .eq('campaign_id', systemLog.campaign_id)
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(3000);

      if (logsErr) {
        return res.status(500).json({ success: false, error: 'Failed to fetch call logs: ' + logsErr.message });
      }

      if (campaignLogs) {
        const customerSet = new Set(customerIds);
        callLogs = campaignLogs.filter((log) => customerSet.has(log.customer_id));
      }
    }

    // Fetch closed deals count from 'closed_deals' table matching source_id
    const { count: closedDealsCount } = await supabaseAdmin
      .from('closed_deals')
      .select('id', { count: 'exact', head: true })
      .eq('source_id', sourceId)
      .eq('organization_id', profile.organization_id);

    // Total metrics
    const totalLeads = systemLog.total_leads || customers.length;
    const activeLeads = customers.filter((c) => c.status === 'active' || !c.status).length; // Only leads with active status
    const closedLeads = (closedDealsCount !== null && closedDealsCount !== undefined)
      ? closedDealsCount
      : customers.filter((c) => c.status === 'closed').length;

    // 1. Gather all lead IDs associated with this source_id across customers (all paginated rows), rejected_leads, and closed_deals tables
    const [{ data: rejLeadRows }, { data: closedLeadRows }] = await Promise.all([
      supabaseAdmin.from('rejected_leads').select('id, customer_id, customer_name, phone_no, campaign_id, disposition, sub_disposition, agent_id, rejected_at, attempt_count, customer_details').eq('source_id', sourceId).eq('organization_id', profile.organization_id),
      supabaseAdmin.from('closed_deals').select('customer_id, id, customer_name, phone_no').eq('source_id', sourceId).eq('organization_id', profile.organization_id)
    ]);

    const leadIds = Array.from(new Set<string>([
      ...customers.map(c => c.id),
      ...(rejLeadRows || []).map(r => r.customer_id || r.id),
      ...(closedLeadRows || []).map(c => c.customer_id || c.id)
    ])).filter(Boolean);

    // 2. Batch query ALL call_logs for these source lead IDs in chunks of 50 with range pagination
    let allSourceCallLogs: any[] = [];
    if (leadIds.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < leadIds.length; i += chunkSize) {
        const batch = leadIds.slice(i, i + chunkSize);
        let fromRange = 0;
        let hasMore = true;
        while (hasMore) {
          const { data: cLogs } = await supabaseAdmin
            .from('call_logs')
            .select('id, customer_id, agent_id, is_connected, duration, created_at, disposition')
            .eq('organization_id', profile.organization_id)
            .in('customer_id', batch)
            .range(fromRange, fromRange + 999);

          if (cLogs && cLogs.length > 0) {
            allSourceCallLogs.push(...cLogs);
            fromRange += 1000;
            if (cLogs.length < 1000) hasMore = false;
          } else {
            hasMore = false;
          }
        }
      }
    }

    // 3. Unique connected leads in call_logs from upload date to current
    const overallConnectedLogs = allSourceCallLogs.filter((cl) => cl.is_connected === 'contactable');
    const overallUniqueConnectedLeads = new Set(overallConnectedLogs.map((cl) => cl.customer_id)).size;

    // 4. Net uploaded leads = Total Uploaded Leads - Duplicate Leads
    const duplicateLeadsCount = systemLog.duplicate_leads || 0;
    const netUploadedLeads = Math.max(1, totalLeads - duplicateLeadsCount);

    // 5. Connectivity Rate (%) = (Unique Connected Leads in Call Logs / Net Uploaded Leads) * 100
    const connectivityRate = (overallUniqueConnectedLeads / netUploadedLeads) * 100;

    // Total Called Leads: unique customer_ids in call_logs across all source tables
    const uniqueCalledLeads = new Set(allSourceCallLogs.map((cl) => cl.customer_id)).size;
    const totalCalls = uniqueCalledLeads;

    // Conversion rate
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

    // Avg talk time across all call logs for this source_id
    const totalDuration = allSourceCallLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const avgTalkTime = totalCalls > 0 ? totalDuration / totalCalls : 0;

    // Unique agents
    const uniqueAgentIds = new Set(customers.map((c) => c.assigned_to).filter(Boolean));
    const uniqueAgents = uniqueAgentIds.size;

    // Fresh leads (strictly leads from customers table for this source_id where attempt_count === 0 or null)
    const freshLeads = customers.filter((c) => !c.attempt_count || c.attempt_count === 0).length;

    // Rejected leads count
    const rejectedLeads = (rejLeadRows || []).length;

    // Funnel data
    const funnel = {
      uploaded: totalLeads,
      imported: totalLeads,
      assigned: customers.filter((c) => c.assigned_to).length,
      called: customers.filter((c) => (c.attempt_count || 0) > 0).length,
      connected: customers.filter((c) => c.status === 'connected' || c.status === 'interested' || c.status === 'closed').length,
      interested: customers.filter((c) => c.status === 'interested' || c.status === 'closed').length,
      closed: closedLeads,
    };

    // Group all call logs by customer_id for current agent attempt calculations
    const logsByCustomerMap = new Map<string, any[]>();
    allSourceCallLogs.forEach((log) => {
      if (!logsByCustomerMap.has(log.customer_id)) {
        logsByCustomerMap.set(log.customer_id, []);
      }
      logsByCustomerMap.get(log.customer_id)!.push(log);
    });

    // Attempts distribution (based on current assigned agent's dials)
    const customerAgentAttempts = customers.map((c) => {
      const logs = logsByCustomerMap.get(c.id) || [];
      return getCurrentAgentAttemptCount(c.id, c.assigned_to, logs).count;
    });

    const attemptsDist = {
      one: customerAgentAttempts.filter((att) => att === 1).length,
      two: customerAgentAttempts.filter((att) => att === 2).length,
      three: customerAgentAttempts.filter((att) => att === 3).length,
      fourPlus: customerAgentAttempts.filter((att) => att >= 4).length,
    };

    // Callback analytics (all leads with status followup or disposition Call Back)
    const nowDate = new Date();
    const pendingCallbacks = customers.filter((c) => c.status === 'followup' || c.disposition === 'Call Back').length;
    const overdueCallbacks = customers.filter((c) => c.disposition === 'Call Back' && c.next_called_at && new Date(c.next_called_at) <= nowDate).length;
    const completedCallbacks = callLogs.filter((cl) => cl.disposition === 'Call Back' && cl.duration > 0).length; // simple approximation

    // Callback Loss Ratio count & Leads List:
    const allSourceCustomerMap = new Map<string, any>();
    customers.forEach((c) => {
      if (c.id) allSourceCustomerMap.set(c.id, c);
    });
    (rejLeadRows || []).forEach((r) => {
      if (r.customer_id) allSourceCustomerMap.set(r.customer_id, r);
      if (r.id) allSourceCustomerMap.set(r.id, r);
    });
    (closedLeadRows || []).forEach((c) => {
      if (c.customer_id) allSourceCustomerMap.set(c.customer_id, c);
      if (c.id) allSourceCustomerMap.set(c.id, c);
    });

    const rejectedCustomerIdsSet = new Set<string>([
      ...(rejLeadRows || []).map(r => r.customer_id || r.id),
      ...customers.filter(c => c.status === 'rejected').map(c => c.id)
    ].filter(Boolean));

    let callbackToNotContactable = 0;
    const rawCallbackLossList: any[] = [];

    if (rejectedCustomerIdsSet.size > 0) {
      const rejectedLogsByCustomer: { [key: string]: any[] } = {};
      allSourceCallLogs.forEach((log) => {
        if (rejectedCustomerIdsSet.has(log.customer_id)) {
          if (!rejectedLogsByCustomer[log.customer_id]) {
            rejectedLogsByCustomer[log.customer_id] = [];
          }
          rejectedLogsByCustomer[log.customer_id].push(log);
        }
      });

      Object.keys(rejectedLogsByCustomer).forEach((custId) => {
        const logs = rejectedLogsByCustomer[custId];
        const cbLog = logs.find(l => l.disposition && l.disposition.toLowerCase().includes('call back'));
        if (cbLog) {
          const rej = allSourceCustomerMap.get(custId) || customers.find(c => c.id === custId);
          const currentAgentId = rej?.agent_id || rej?.assigned_to;
          const { count: attemptCount, currentAgentId: effectiveAgentId } = getCurrentAgentAttemptCount(custId, currentAgentId, logs);

          // Only count leads with 2 or more attempts by current agent (attempts >= 2)
          if (attemptCount >= 2) {
            callbackToNotContactable++;
            const rawName = rej?.customer_name || (rej as any)?.customerName || (rej as any)?.name || '';
            const rawPhone = rej?.phone_no || (rej as any)?.phoneNo || (rej as any)?.phone || '';
            const phoneObj = parseAndMaskPhone(rawPhone);
            const agentName = agentMap.get(rej?.agent_id || rej?.assigned_to || (cbLog as any)?.agent_id || '') || 'Unassigned';

            const displayName = rawName ? rawName : (phoneObj.masked && phoneObj.masked !== 'N/A' ? `Customer (${phoneObj.masked})` : `Lead #${custId.substring(0, 6)}`);
            const displayPhone = phoneObj.masked && phoneObj.masked !== 'N/A' ? phoneObj.masked : '—';

            rawCallbackLossList.push({
              id: custId,
              rejectedId: rej?.id || custId,
              customerName: displayName,
              phoneNo: displayPhone,
              rawPhone: phoneObj.raw,
              campaignId: rej?.campaign_id || systemLog.campaign_id,
              assignedAgent: agentName,
              disposition: rej?.disposition || 'Rejected',
              attempts: attemptCount,
              callbackTime: cbLog.created_at,
              rejectedAt: rej?.rejected_at || (rej as any)?.created_at || cbLog.created_at,
              customerDetails: rej?.customer_details,
            });
          }
        }
      });
    }

    rawCallbackLossList.sort((a, b) => new Date(b.rejectedAt).getTime() - new Date(a.rejectedAt).getTime());
    const callbackLossLeads = rawCallbackLossList.slice(0, 20);

    // Call Time hour analysis
    const hourlyDistribution: { [key: number]: { calls: number; connected: number } } = {};
    for (let h = 9; h <= 18; h++) {
      hourlyDistribution[h] = { calls: 0, connected: 0 };
    }
    callLogs.forEach((cl) => {
      const hr = new Date(cl.created_at).getHours();
      if (hr >= 9 && hr <= 18) {
        hourlyDistribution[hr].calls++;
        if (cl.is_connected === 'contactable') {
          hourlyDistribution[hr].connected++;
        }
      }
    });

    // Talk time distribution ranges
    const talkTimeDist = {
      zeroTo30: callLogs.filter((cl) => cl.duration <= 30).length,
      thirtyTo60: callLogs.filter((cl) => cl.duration > 30 && cl.duration <= 60).length,
      oneTo2Min: callLogs.filter((cl) => cl.duration > 60 && cl.duration <= 120).length,
      twoTo5Min: callLogs.filter((cl) => cl.duration > 120 && cl.duration <= 300).length,
      fiveMinPlus: callLogs.filter((cl) => cl.duration > 300).length,
    };

    // Disposition Breakdown count mapping
    const dispositionCounts: { [key: string]: number } = {};
    callLogs.forEach((cl) => {
      const disp = cl.disposition || 'Unknown';
      dispositionCounts[disp] = (dispositionCounts[disp] || 0) + 1;
    });

    // Agent performance table grouping
    const agentPerfMap: { [key: string]: any } = {};
    customers.forEach((c) => {
      const agentId = c.assigned_to;
      if (!agentId) return;
      const agentName = agentMap.get(agentId) || 'Unassigned';
      if (!agentPerfMap[agentId]) {
        agentPerfMap[agentId] = {
          agentId,
          agentName,
          leads: 0,
          calls: 0,
          connectedCalls: 0,
          deals: 0,
          totalDuration: 0,
        };
      }
      agentPerfMap[agentId].leads++;
      if (c.status === 'closed') {
        agentPerfMap[agentId].deals++;
      }
    });

    callLogs.forEach((cl) => {
      const agentId = cl.agent_id;
      if (!agentId || !agentPerfMap[agentId]) return;
      agentPerfMap[agentId].calls++;
      if (cl.is_connected === 'contactable') {
        agentPerfMap[agentId].connectedCalls++;
      }
      agentPerfMap[agentId].totalDuration += (cl.duration || 0);
    });

    const agentPerformance = Object.values(agentPerfMap).map((a: any) => {
      const connectedRate = a.calls > 0 ? (a.connectedCalls / a.calls) * 100 : 0;
      const convRate = a.leads > 0 ? (a.deals / a.leads) * 100 : 0;
      const avgTalk = a.calls > 0 ? a.totalDuration / a.calls : 0;
      const score = Math.round(Math.min(100, (connectedRate * 0.4) + (convRate * 10) + (Math.min(avgTalk, 180) / 1.8)));
      return {
        ...a,
        connectedRate: connectedRate.toFixed(1),
        conversionRate: convRate.toFixed(1),
        avgTalkTime: Math.round(avgTalk),
        productivityScore: score,
      };
    }).sort((a, b) => b.productivityScore - a.productivityScore);

    // Dynamic AI Quality score
    const duplicateRate = systemLog.total_leads > 0 ? (systemLog.duplicate_leads / systemLog.total_leads) * 100 : 0;
    const invalidRate = totalLeads > 0 ? (dispositionCounts['Wrong NO'] || 0) / totalLeads * 100 : 0;
    const aiQualityScore = Math.max(0, Math.round(100 - (duplicateRate * 0.5) - (invalidRate * 1.5) - ((100 - connectivityRate) * 0.3)));

    // 6. Dynamic Time Range Filter (1h, 5h, 12h, 24h, 7d, 10d, 15d, 30d, 1m)
    const timeRange = (req.query.timeRange as string) || '7d';
    const trendNow = new Date();

    let numBuckets = 10;
    let isHourly = false;

    if (timeRange === '1h') {
      isHourly = true;
      numBuckets = 6; // 10-min intervals
    } else if (timeRange === '5h') {
      isHourly = true;
      numBuckets = 5;
    } else if (timeRange === '12h') {
      isHourly = true;
      numBuckets = 12;
    } else if (timeRange === '24h') {
      isHourly = true;
      numBuckets = 24;
    } else if (timeRange === '7d') {
      numBuckets = 7;
    } else if (timeRange === '10d') {
      numBuckets = 10;
    } else if (timeRange === '15d') {
      numBuckets = 15;
    } else if (timeRange === '30d' || timeRange === '1m') {
      numBuckets = 30;
    }

    const connectivityTrend: any[] = [];

    if (isHourly) {
      if (timeRange === '1h') {
        for (let i = 5; i >= 0; i--) {
          const startTime = new Date(trendNow.getTime() - (i + 1) * 10 * 60 * 1000);
          const endTime = new Date(trendNow.getTime() - i * 10 * 60 * 1000);
          const displayDate = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          const bucketLogs = allSourceCallLogs.filter((cl) => {
            if (!cl.created_at) return false;
            const t = new Date(cl.created_at).getTime();
            return t >= startTime.getTime() && t < endTime.getTime();
          });

          const bucketCalls = bucketLogs.length;
          const connectedLogs = bucketLogs.filter((cl) => cl.is_connected === 'contactable');
          const uniqueConnectedLeads = new Set(connectedLogs.map((cl) => cl.customer_id)).size;
          const dayRate = netUploadedLeads > 0 ? (uniqueConnectedLeads / netUploadedLeads) * 100 : 0;

          connectivityTrend.push({
            date: startTime.toISOString(),
            displayDate,
            totalCalls: bucketCalls,
            connectedCalls: connectedLogs.length,
            uniqueConnectedLeads,
            rate: parseFloat(dayRate.toFixed(3)),
            total: bucketCalls,
            contactable: uniqueConnectedLeads,
          });
        }
      } else {
        for (let i = numBuckets - 1; i >= 0; i--) {
          const startTime = new Date(trendNow.getTime() - (i + 1) * 60 * 60 * 1000);
          const endTime = new Date(trendNow.getTime() - i * 60 * 60 * 1000);
          const displayDate = startTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

          const bucketLogs = allSourceCallLogs.filter((cl) => {
            if (!cl.created_at) return false;
            const t = new Date(cl.created_at).getTime();
            return t >= startTime.getTime() && t < endTime.getTime();
          });

          const bucketCalls = bucketLogs.length;
          const connectedLogs = bucketLogs.filter((cl) => cl.is_connected === 'contactable');
          const uniqueConnectedLeads = new Set(connectedLogs.map((cl) => cl.customer_id)).size;
          const dayRate = netUploadedLeads > 0 ? (uniqueConnectedLeads / netUploadedLeads) * 100 : 0;

          connectivityTrend.push({
            date: startTime.toISOString(),
            displayDate,
            totalCalls: bucketCalls,
            connectedCalls: connectedLogs.length,
            uniqueConnectedLeads,
            rate: parseFloat(dayRate.toFixed(3)),
            total: bucketCalls,
            contactable: uniqueConnectedLeads,
          });
        }
      }
    } else {
      for (let i = numBuckets - 1; i >= 0; i--) {
        const d = new Date(trendNow);
        d.setDate(trendNow.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const dayLogs = allSourceCallLogs.filter((cl) => cl.created_at && cl.created_at.startsWith(dateStr));
        const dayCalls = dayLogs.length;
        const dayConnectedLogs = dayLogs.filter((cl) => cl.is_connected === 'contactable');
        const uniqueConnectedLeads = new Set(dayConnectedLogs.map((cl) => cl.customer_id)).size;
        const dayRate = netUploadedLeads > 0 ? (uniqueConnectedLeads / netUploadedLeads) * 100 : 0;

        connectivityTrend.push({
          date: dateStr,
          displayDate,
          totalCalls: dayCalls,
          connectedCalls: dayConnectedLogs.length,
          uniqueConnectedLeads,
          rate: parseFloat(dayRate.toFixed(3)),
          total: dayCalls,
          contactable: uniqueConnectedLeads,
        });
      }
    }

    // Window filtered stats for Pie chart and summary metrics
    let cutoffTime = new Date(0);
    if (timeRange === '1h') cutoffTime = new Date(trendNow.getTime() - 1 * 60 * 60 * 1000);
    else if (timeRange === '5h') cutoffTime = new Date(trendNow.getTime() - 5 * 60 * 60 * 1000);
    else if (timeRange === '12h') cutoffTime = new Date(trendNow.getTime() - 12 * 60 * 60 * 1000);
    else if (timeRange === '24h') cutoffTime = new Date(trendNow.getTime() - 24 * 60 * 60 * 1000);
    else if (timeRange === '7d') cutoffTime = new Date(trendNow.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (timeRange === '10d') cutoffTime = new Date(trendNow.getTime() - 10 * 24 * 60 * 60 * 1000);
    else if (timeRange === '15d') cutoffTime = new Date(trendNow.getTime() - 15 * 24 * 60 * 60 * 1000);
    else if (timeRange === '30d' || timeRange === '1m') cutoffTime = new Date(trendNow.getTime() - 30 * 24 * 60 * 60 * 1000);

    const windowLogs = allSourceCallLogs.filter((cl) => cl.created_at && new Date(cl.created_at) >= cutoffTime);
    const windowCallsCount = windowLogs.length;
    const windowUniqueCalledLeads = new Set(windowLogs.map((cl) => cl.customer_id)).size;
    const windowConnectedLogs = windowLogs.filter((cl) => cl.is_connected === 'contactable');
    const windowUniqueConnectedLeads = new Set(windowConnectedLogs.map((cl) => cl.customer_id)).size;

    // Top 10 Rejected Leads directly from rejected_leads table (ordered by attempt_count highest to lowest)
    const { data: topRejectedRows } = await supabaseAdmin
      .from('rejected_leads')
      .select('id, customer_id, customer_name, phone_no, campaign_id, disposition, sub_disposition, agent_id, rejected_at, attempt_count, customer_details')
      .eq('source_id', sourceId)
      .eq('organization_id', profile.organization_id)
      .order('attempt_count', { ascending: false })
      .order('rejected_at', { ascending: false })
      .limit(10);

    const topRejectedLeads = (topRejectedRows || []).map((r) => {
      const custId = r.customer_id || r.id;
      const custLogs = logsByCustomerMap.get(custId) || [];
      const { count: currentAttempts, currentAgentId } = getCurrentAgentAttemptCount(custId, r.agent_id, custLogs);
      const effectiveAgentId = r.agent_id || currentAgentId;
      const agentName = agentMap.get(effectiveAgentId || '') || 'Unassigned';
      const phoneObj = parseAndMaskPhone(r.phone_no);
      return {
        id: custId,
        rejectedId: r.id,
        customerName: r.customer_name || 'N/A',
        phoneNo: phoneObj.masked,
        rawPhone: phoneObj.raw,
        campaignId: r.campaign_id || systemLog.campaign_id,
        assignedAgent: agentName,
        disposition: r.disposition || 'Rejected',
        subDisposition: r.sub_disposition || '',
        attempts: currentAttempts > 0 ? currentAttempts : (r.attempt_count || 0),
        rejectedAt: r.rejected_at || (r as any).created_at,
        customerDetails: r.customer_details,
        status: 'rejected',
      };
    });

    const allProcessedLeads = customers.map((c) => {
      const custLogs = logsByCustomerMap.get(c.id) || [];
      const sortedLogs = [...custLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const latestDisposition = sortedLogs[0]?.disposition || c.disposition || 'Fresh';
      const { count: currentAttempts, currentAgentId } = getCurrentAgentAttemptCount(c.id, c.assigned_to, custLogs);
      const effectiveAgentId = c.assigned_to || currentAgentId;
      const agentName = agentMap.get(effectiveAgentId || '') || 'Unassigned';
      const phoneObj = parseAndMaskPhone(c.phone_no);
      const attempts = currentAttempts > 0 ? currentAttempts : (c.attempt_count || 0);
      const status = (latestDisposition && latestDisposition.toLowerCase().includes('call back')) ? 'followup' : (c.status || 'fresh');

      let riskScore = attempts * 20 + 25;
      let riskLevel = 'Medium';
      let riskColor = 'text-amber-700 bg-amber-50 border-amber-200';
      if (riskScore >= 80 || attempts >= 4) {
        riskLevel = 'Critical';
        riskColor = 'text-rose-700 bg-rose-50 border-rose-200';
      } else if (riskScore >= 40 || attempts >= 2) {
        riskLevel = 'High';
        riskColor = 'text-orange-700 bg-orange-50 border-orange-200';
      }

      return {
        id: c.id,
        campaignId: c.campaign_id || systemLog.campaign_id,
        customerName: c.customer_name || 'N/A',
        phoneNo: phoneObj.masked,
        rawPhone: phoneObj.raw,
        assignedAgent: agentName,
        attempts,
        lastCall: (c as any).last_attempt_at || c.created_at,
        disposition: latestDisposition,
        status,
        riskScore,
        riskLevel,
        riskColor,
      };
    });

    const top10ActiveFatigueLeads = allProcessedLeads
      .filter((l) => {
        if (l.status === 'rejected' || l.status === 'closed') return false;
        const disp = (l.disposition || '').toLowerCase();
        return disp.includes('call back') || disp.includes('callback') || l.status === 'followup';
      })
      .sort((a, b) => b.attempts - a.attempts || new Date(b.lastCall || 0).getTime() - new Date(a.lastCall || 0).getTime())
      .slice(0, 10);

    const responseData = {
      meta: {
        sourceId,
        sourceName: systemLog.source_name,
        campaignId: systemLog.campaign_id,
        campaign: campaignName,
        organization: companyName,
        createdAt: systemLog.created_at,
        processingStatus: 'Completed',
        healthStatus: aiQualityScore >= 90 ? 'Excellent' : aiQualityScore >= 75 ? 'Good' : aiQualityScore >= 60 ? 'Average' : 'Poor',
        qualityScore: aiQualityScore,
      },
      stats: {
        totalLeads,
        activeLeads,
        closedLeads,
        connectivityRate: connectivityRate.toFixed(3),
        conversionRate: conversionRate.toFixed(3),
        avgTalkTime: Math.round(avgTalkTime),
        totalCalls,
        uniqueAgents,
        freshLeads,
        rejectedLeads,
      },
      filteredStats: {
        timeRange,
        totalCallsInWindow: windowCallsCount,
        uniqueCalledLeadsInWindow: windowUniqueCalledLeads,
        uniqueConnectedLeadsInWindow: windowUniqueConnectedLeads,
      },
      connectivityTrend,
      dailyDialsTrend: connectivityTrend,
      funnel,
      attemptsDist,
      callbacks: {
        pending: pendingCallbacks,
        completed: completedCallbacks,
        overdue: overdueCallbacks,
        callbackToNotContactable,
      },
      hourlyDistribution,
      talkTimeDist,
      dispositions: Object.entries(dispositionCounts).map(([disposition, count]) => ({ disposition, count })),
      agentPerformance,
      systemLogDetails: {
        fileSize: '1.2 MB',
        duplicateCount: systemLog.duplicate_leads,
        rejectedCount: 0,
        totalImported: totalLeads,
      },
      topRejectedLeads,
      callbackLossLeads,
      top10ActiveFatigueLeads,
      leads: allProcessedLeads
    };

    return res.status(200).json({ success: true, data: responseData });
  } catch (error: any) {
    console.error('Source analytics error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
}
