const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error('Failed to parse .env.local', e);
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase keys missing. URL:', supabaseUrl, 'Key:', !!supabaseServiceRoleKey);
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function run() {
  const sourceId = 'SRC-BK23RIQ1';
  console.log('Testing analytics for source:', sourceId);
  try {
    // 3. Fetch system log
    const { data: systemLog, error: logError } = await supabaseAdmin
      .from('system_logs')
      .select('*')
      .eq('source_id', sourceId)
      .maybeSingle();

    if (logError) {
      console.error('system_logs query failed:', logError);
      return;
    }
    console.log('systemLog found:', systemLog ? 'yes' : 'no');
    if (!systemLog) return;

    // 4. Fetch customers
    const { data: customers, error: custError } = await supabaseAdmin
      .from('customers')
      .select('id, customer_name, phone_no, status, disposition, attempt_count, assigned_to, created_at, next_called_at, last_attempt_at')
      .eq('source_id', sourceId);

    if (custError) {
      console.error('customers query failed:', custError);
      return;
    }
    console.log('customers count:', customers.length);

    // Fetch user profiles
    const { data: profilesList, error: pError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, user_name')
      .eq('organization_id', systemLog.organization_id);

    if (pError) {
      console.error('user_profiles query failed:', pError);
      return;
    }
    console.log('profiles count:', profilesList.length);

    const agentMap = new Map();
    profilesList.forEach((p) => {
      if (p.user_id && p.user_name) {
        agentMap.set(p.user_id, p.user_name);
      }
    });

    const customerIds = customers.map((c) => c.id);
    console.log('customerIds count:', customerIds.length);

    // 5. Fetch call logs
    let callLogs = [];
    if (systemLog.campaign_id) {
      const { data: campaignLogs, error: logsErr } = await supabaseAdmin
        .from('call_logs')
        .select('id, customer_id, agent_id, duration, disposition, is_connected, created_at')
        .eq('campaign_id', systemLog.campaign_id)
        .eq('organization_id', systemLog.organization_id);

      if (logsErr) {
        console.error('call_logs query failed:', logsErr);
        return;
      }
      const customerSet = new Set(customerIds);
      callLogs = campaignLogs ? campaignLogs.filter(log => customerSet.has(log.customer_id)) : [];
    }
    console.log('callLogs count:', callLogs.length);

    // Now let's run the calculations in the API to see if they crash
    const totalLeads = customers.length;
    const activeLeads = customers.filter((c) => ['fresh', 'called', 'connected', 'interested'].includes(c.status || '')).length;
    const closedLeads = customers.filter((c) => c.status === 'closed').length;

    const connectedCalls = callLogs.filter((cl) => cl.is_connected === 'contactable').length;
    const totalCalls = callLogs.length;
    const connectivityRate = totalCalls > 0 ? (connectedCalls / totalCalls) * 100 : 0;
    const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

    const totalDuration = callLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const avgTalkTime = totalCalls > 0 ? totalDuration / totalCalls : 0;

    const uniqueAgentIds = new Set(customers.map((c) => c.assigned_to).filter(Boolean));
    const uniqueAgents = uniqueAgentIds.size;

    const funnel = {
      uploaded: totalLeads,
      imported: totalLeads,
      assigned: customers.filter((c) => c.assigned_to).length,
      called: customers.filter((c) => (c.attempt_count || 0) > 0).length,
      connected: customers.filter((c) => c.status === 'connected' || c.status === 'interested' || c.status === 'closed').length,
      interested: customers.filter((c) => c.status === 'interested' || c.status === 'closed').length,
      closed: closedLeads,
    };

    const attemptsDist = {
      one: customers.filter((c) => c.attempt_count === 1).length,
      two: customers.filter((c) => c.attempt_count === 2).length,
      three: customers.filter((c) => c.attempt_count === 3).length,
      fourPlus: customers.filter((c) => (c.attempt_count || 0) >= 4).length,
    };

    const now = new Date();
    const pendingCallbacks = customers.filter((c) => c.disposition === 'Call Back' && c.next_called_at && new Date(c.next_called_at) > now).length;
    const overdueCallbacks = customers.filter((c) => c.disposition === 'Call Back' && c.next_called_at && new Date(c.next_called_at) <= now).length;
    const completedCallbacks = callLogs.filter((cl) => cl.disposition === 'Call Back' && cl.duration > 0).length;

    let callbackToNotContactable = 0;
    if (customerIds.length > 0) {
      const logsByCustomer = {};
      callLogs.forEach((log) => {
        if (!logsByCustomer[log.customer_id]) {
          logsByCustomer[log.customer_id] = [];
        }
        logsByCustomer[log.customer_id].push(log);
      });

      Object.keys(logsByCustomer).forEach((custId) => {
        const sortedLogs = logsByCustomer[custId].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        let hadCallback = false;
        for (let i = 0; i < sortedLogs.length; i++) {
          if (sortedLogs[i].disposition === 'Call Back') {
            hadCallback = true;
          } else if (hadCallback && sortedLogs[i].disposition === 'Not Contactable') {
            callbackToNotContactable++;
            break;
          }
        }
      });
    }

    const hourlyDistribution = {};
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

    const talkTimeDist = {
      zeroTo30: callLogs.filter((cl) => cl.duration <= 30).length,
      thirtyTo60: callLogs.filter((cl) => cl.duration > 30 && cl.duration <= 60).length,
      oneTo2Min: callLogs.filter((cl) => cl.duration > 60 && cl.duration <= 120).length,
      twoTo5Min: callLogs.filter((cl) => cl.duration > 120 && cl.duration <= 300).length,
      fiveMinPlus: callLogs.filter((cl) => cl.duration > 300).length,
    };

    const dispositionCounts = {};
    callLogs.forEach((cl) => {
      const disp = cl.disposition || 'Unknown';
      dispositionCounts[disp] = (dispositionCounts[disp] || 0) + 1;
    });

    const agentPerfMap = {};
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

    console.log('agentPerfMap successfully populated');

    const duplicateRate = systemLog.total_leads > 0 ? (systemLog.duplicate_leads / systemLog.total_leads) * 100 : 0;
    const invalidRate = totalLeads > 0 ? (dispositionCounts['Wrong NO'] || 0) / totalLeads * 100 : 0;
    const aiQualityScore = Math.max(0, Math.round(100 - (duplicateRate * 0.5) - (invalidRate * 1.5) - ((100 - connectivityRate) * 0.3)));

    console.log('Calculations finished successfully. Quality Score:', aiQualityScore);
  } catch (err) {
    console.error('Run caught error:', err);
  }
}

run();
