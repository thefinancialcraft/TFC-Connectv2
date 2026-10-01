import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import {
  decryptSmartfloToken,
  smartfloAdminClient,
  formatSmartfloWebhookEvent,
} from '@/lib/smartfloServer';

function cleanPhone(raw: string): string {
  let cleaned = String(raw || '').replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.substring(2);
  if (cleaned.startsWith('0') && cleaned.length === 11) cleaned = cleaned.substring(1);
  return cleaned;
}

function formatDateForSmartflo(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

async function getAuthenticatedUser(req: NextApiRequest) {
  const authorization = req.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch || !supabaseAdmin) return null;

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(bearerMatch[1]);
  return error || !user ? null : user;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  const user = await getAuthenticatedUser(req);
  if (!user || !supabaseAdmin || !smartfloAdminClient) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please sign in.' });
  }

  // 1. Fetch user organization
  let { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('id, organization_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    const fallbackProfile = await supabaseAdmin
      .from('user_profiles')
      .select('id, organization_id')
      .eq('id', user.id)
      .maybeSingle();
    if (fallbackProfile.data) profile = fallbackProfile.data;
  }

  const organizationId = profile?.organization_id;
  if (!organizationId) {
    return res.status(400).json({ success: false, message: 'User organization not found.' });
  }

  const rawPhone = String(req.query.phone || req.body?.phone || '');
  const targetPhone = cleanPhone(rawPhone);
  const targetCustomerId = String(req.query.customer_id || req.body?.customer_id || '').trim();
  const targetRefId = String(req.query.ref_id || req.body?.ref_id || '').trim();
  const targetCallId = String(req.query.call_id || req.body?.call_id || '').trim();

  // 2. Fetch recent webhook responses from public.webhook_responses
  const { data: dbResponses } = await smartfloAdminClient
    .from('webhook_responses')
    .select('id, webhook_id, organization_id, response, created_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(100);

  let formattedEvents = (dbResponses || []).map((row) =>
    formatSmartfloWebhookEvent(row.id, row.created_at, row.response)
  );

  // If no webhook_responses, check fallback config.webhook_events
  if (formattedEvents.length === 0) {
    const { data: config } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .select('webhook_events')
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (Array.isArray(config?.webhook_events)) {
      formattedEvents = config.webhook_events.map((item: any, idx: number) =>
        formatSmartfloWebhookEvent(item.id || `legacy-${idx}`, item.receivedAt, item)
      );
    }
  }

  // Filter events matching customer phone, ref_id, call_id, or customer_id
  let filteredLogs = formattedEvents.filter((item) => {
    if (targetRefId || targetCallId) {
      const raw = (item.rawPayload || {}) as any;
      const customIdStr = raw.custom_identifier ? JSON.stringify(raw.custom_identifier) : '';
      if (
        (targetRefId && (
          item.refId === targetRefId ||
          item.callId === targetRefId ||
          raw.ref_id === targetRefId ||
          raw.call_id === targetRefId ||
          raw.uuid === targetRefId ||
          customIdStr.includes(targetRefId)
        )) ||
        (targetCallId && (
          item.callId === targetCallId ||
          item.refId === targetCallId ||
          raw.call_id === targetCallId ||
          raw.ref_id === targetCallId ||
          raw.uuid === targetCallId ||
          customIdStr.includes(targetCallId)
        ))
      ) {
        return true;
      }
    }

    if (targetPhone && item.destinationNumber) {
      const itemDest = cleanPhone(item.destinationNumber);
      if (itemDest.includes(targetPhone) || targetPhone.includes(itemDest)) {
        return true;
      }
    }

    if (targetCustomerId && item.rawPayload) {
      const payloadStr = JSON.stringify(item.rawPayload);
      if (payloadStr.includes(targetCustomerId)) {
        return true;
      }
    }

    return false;
  });

  // If no specific filter match, only show latest 15 if no filter params at all were passed
  if (filteredLogs.length === 0 && !targetRefId && !targetPhone && !targetCallId) {
    filteredLogs = formattedEvents.slice(0, 15);
  }

  // 3. Real-time query to Tata Smartflo Live Calls API (GET v1/live_calls/{call_id}) & CDR (v1/call/records)
  let liveSmartfloRecords: any[] = [];
  let liveCallStatusData: any = null;
  let liveCallsApiResult: any = null;

  try {
    let { data: config } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .select('smartflo_api_token, is_token_valid, is_validate, token_expires_at')
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (config?.smartflo_api_token && (config.is_token_valid ?? config.is_validate)) {
      const token = decryptSmartfloToken(config.smartflo_api_token);

      // --- A. Query Realtime Active Call: GET /v1/live_calls/{call_id} ---
      const activeCallIdToQuery = targetCallId || targetRefId;
      let liveRawResponseText: string | null = null;
      if (activeCallIdToQuery) {
        try {
          const liveUrl = `https://api-smartflo.tatateleservices.com/v1/live_calls/${encodeURIComponent(activeCallIdToQuery)}`;
          console.log(`\n================== [SMARTFLO LIVE CALLS API RESULT] ==================`);
          console.log(`📡 GET ${liveUrl}`);
          console.log(`🔑 Authorization: Bearer ${token.slice(0, 10)}...${token.slice(-6)}`);

          const liveRes = await fetch(liveUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });

          liveRawResponseText = await liveRes.text();
          console.log(`📥 HTTP Status: ${liveRes.status} ${liveRes.statusText}`);
          console.log(`📋 Response Result:`, liveRawResponseText);
          console.log(`=======================================================================\n`);

          let liveJson: any = null;
          try {
            liveJson = liveRawResponseText ? JSON.parse(liveRawResponseText) : null;
          } catch {
            liveJson = null;
          }

          liveCallsApiResult = {
            url: liveUrl,
            status: liveRes.status,
            statusText: liveRes.statusText,
            result: liveJson || liveRawResponseText,
          };

          if (liveRes.ok && liveJson) {
            const dataObj = liveJson?.data || liveJson;
            if (dataObj && typeof dataObj === 'object') {
              liveCallStatusData = dataObj;
            }
          } else if (liveRes.status === 404 && targetRefId && targetRefId !== targetCallId) {
            // Fallback to targetRefId if targetCallId was not found
            const fallbackLiveUrl = `https://api-smartflo.tatateleservices.com/v1/live_calls/${encodeURIComponent(targetRefId)}`;
            console.log(`\n📡 [Smartflo Live Calls Fallback] GET ${fallbackLiveUrl}`);
            const fallbackRes = await fetch(fallbackLiveUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
            const fallbackText = await fallbackRes.text();
            console.log(`📥 Fallback Status: ${fallbackRes.status} | Response:`, fallbackText);
            try {
              const fallbackJson = fallbackText ? JSON.parse(fallbackText) : null;
              liveCallsApiResult.fallback = {
                url: fallbackLiveUrl,
                status: fallbackRes.status,
                result: fallbackJson || fallbackText,
              };
              const dataObj = fallbackJson?.data || fallbackJson;
              if (fallbackRes.ok && dataObj && typeof dataObj === 'object') {
                liveCallStatusData = dataObj;
              }
            } catch {}
          }
        } catch (liveErr) {
          console.error('[Smartflo Live Call] Error querying live_calls/{call_id}:', liveErr);
          liveCallsApiResult = { error: String(liveErr) };
        }
      }

      // --- B. Query Tata Smartflo CDR API (v1/call/records) for completed calls ---
      const now = new Date();
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const fromDate = formatDateForSmartflo(past24h);
      const toDate = formatDateForSmartflo(now);

      const recordsUrl = new URL('https://api-smartflo.tatateleservices.com/v1/call/records');
      recordsUrl.searchParams.set('from_date', fromDate);
      recordsUrl.searchParams.set('to_date', toDate);
      if (targetPhone) {
        recordsUrl.searchParams.set('destination', targetPhone);
      }
      recordsUrl.searchParams.set('limit', '20');

      const sfRes = await fetch(recordsUrl.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (sfRes.ok) {
        const sfData = await sfRes.json();
        const records = Array.isArray(sfData.data)
          ? sfData.data
          : Array.isArray(sfData.records)
            ? sfData.records
            : Array.isArray(sfData)
              ? sfData
              : [];

        liveSmartfloRecords = records.map((rec: any, idx: number) => ({
          id: rec.call_id || rec.id || `live-${idx}`,
          receivedAt: rec.created_at || rec.start_time || new Date().toISOString(),
          callId: String(rec.call_id || rec.id || ''),
          refId: String(rec.ref_id || rec.custom_identifier || rec.call_id || ''),
          direction: String(rec.direction || 'outbound'),
          callType: String(rec.call_type === 'c' ? 'Answered' : rec.call_type === 'm' ? 'Missed' : rec.call_type || 'Call'),
          agentNumber: String(rec.agent_number || rec.caller_id || ''),
          destinationNumber: String(rec.destination || rec.customer_number || rec.destination_number || ''),
          status: rec.status || (rec.call_type === 'c' ? 'answered' : 'missed'),
          hangupCause: rec.hangup_cause || rec.status || 'NORMAL_CLEARING',
          duration: Number(rec.duration || rec.billsec || rec.talk_duration || 0),
          recordingUrl: rec.recording_url || rec.record_url || null,
          source: 'smartflo_api',
          rawPayload: rec,
        }));
      }
    }
  } catch (liveErr) {
    console.warn('[Smartflo Logs API] Smartflo query exception (non-fatal):', liveErr);
  }

  // Deduplicate and combine logs by callId / refId
  const combinedMap = new Map<string, any>();
  for (const item of filteredLogs) {
    const key = item.callId || item.refId || item.id;
    combinedMap.set(key, item);
  }
  for (const liveItem of liveSmartfloRecords) {
    const key = liveItem.callId || liveItem.refId || liveItem.id;
    if (combinedMap.has(key)) {
      combinedMap.set(key, { ...combinedMap.get(key), ...liveItem });
    } else {
      combinedMap.set(key, liveItem);
    }
  }

  // If live call was returned from /v1/live_calls/{call_id}, insert it at top of logs
  if (liveCallStatusData) {
    const liveItem = {
      id: String(liveCallStatusData.call_id || targetCallId || 'live-call'),
      receivedAt: liveCallStatusData.created_at || new Date().toISOString(),
      callId: String(liveCallStatusData.call_id || targetCallId || ''),
      refId: String(liveCallStatusData.ref_id || targetRefId || targetCallId || ''),
      direction: String(liveCallStatusData.direction || 'clicktocall'),
      callType: 'Click to Call',
      agentNumber: String(liveCallStatusData.agent_number || liveCallStatusData.caller_id || ''),
      destinationNumber: String(liveCallStatusData.destination || liveCallStatusData.customer_number || targetPhone || ''),
      status: String(liveCallStatusData.status || liveCallStatusData.call_status || 'ringing'),
      hangupCause: 'ACTIVE_CALL',
      duration: Number(liveCallStatusData.duration || liveCallStatusData.billsec || 0),
      recordingUrl: null,
      source: 'smartflo_live_call',
      rawPayload: liveCallStatusData,
    };
    combinedMap.set(liveItem.callId || liveItem.refId, liveItem);
  }

  const finalLogs = Array.from(combinedMap.values()).sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  // Compute detailed point-by-point lifecycle status
  let refStatus = null;

  // 1. If actively returned by GET /v1/live_calls/{call_id}:
  if (liveCallStatusData) {
    const statusStr = String(
      liveCallStatusData.status ||
      liveCallStatusData.call_status ||
      liveCallStatusData.state ||
      ''
    ).toLowerCase();

    const agentStatusStr = String(
      liveCallStatusData.agent_status ||
      liveCallStatusData.agent_state ||
      liveCallStatusData.answered_agent ||
      ''
    ).toLowerCase();

    const customerStatusStr = String(
      liveCallStatusData.customer_status ||
      liveCallStatusData.client_status ||
      liveCallStatusData.destination_status ||
      ''
    ).toLowerCase();

    const causeStr = String(
      liveCallStatusData.hangup_cause ||
      liveCallStatusData.hangup_cause_description ||
      liveCallStatusData.hangup_cause_key ||
      ''
    ).toLowerCase();

    // Agent Leg
    let agentColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'orange';
    let agentSublabel = 'Ringing Agent...';

    const isAgentAnswered =
      agentStatusStr.includes('answer') ||
      agentStatusStr.includes('connect') ||
      statusStr.includes('answered') ||
      statusStr.includes('in-call') ||
      statusStr.includes('connected') ||
      statusStr.includes('bridge') ||
      Boolean(liveCallStatusData.answered_agent_number || liveCallStatusData.answered_agent);

    const isAgentBusy = agentStatusStr.includes('busy') || statusStr.includes('busy') || causeStr.includes('busy');
    const isAgentCut = agentStatusStr.includes('reject') || agentStatusStr.includes('cut') || agentStatusStr.includes('miss');

    if (isAgentBusy) {
      agentColor = 'violet';
      agentSublabel = 'Busy';
    } else if (isAgentCut) {
      agentColor = 'red';
      agentSublabel = 'Cut / Rejected';
    } else if (isAgentAnswered) {
      agentColor = 'green';
      agentSublabel = 'Answered';
    } else {
      agentColor = 'orange';
      agentSublabel = 'Ringing Agent...';
    }

    // Customer Leg
    let customerColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'gray';
    let customerSublabel = 'Waiting';

    const isCustAnswered =
      customerStatusStr.includes('answer') ||
      customerStatusStr.includes('connect') ||
      customerStatusStr.includes('speaking') ||
      statusStr.includes('bridge') ||
      (isAgentAnswered && statusStr.includes('in-call'));

    const isCustRinging =
      customerStatusStr.includes('ring') ||
      customerStatusStr.includes('dial') ||
      (isAgentAnswered && (statusStr.includes('dialing') || statusStr.includes('ringing')));

    const isCustBusy = customerStatusStr.includes('busy') || causeStr.includes('busy');
    const isCustCut = customerStatusStr.includes('cancel') || customerStatusStr.includes('reject') || customerStatusStr.includes('drop');

    if (agentColor === 'orange' || agentColor === 'violet' || agentColor === 'red') {
      customerColor = 'gray';
      customerSublabel = agentColor === 'orange' ? 'Waiting' : 'Not Reached';
    } else if (isCustBusy) {
      customerColor = 'violet';
      customerSublabel = 'Busy';
    } else if (isCustCut) {
      customerColor = 'red';
      customerSublabel = 'Cancel / Dropped';
    } else if (isCustAnswered) {
      customerColor = 'green';
      customerSublabel = 'Speaking';
    } else if (isCustRinging) {
      customerColor = 'orange';
      customerSublabel = 'Ringing Customer...';
    } else {
      customerColor = 'orange';
      customerSublabel = 'Ringing Customer...';
    }

    // Hangup
    let hangupColor: 'gray' | 'indigo' | 'violet' | 'red' = 'gray';
    const durNum = Number(liveCallStatusData.duration || liveCallStatusData.billsec || 0);
    let hangupSublabel = durNum > 0 ? `${durNum}s` : 'In Call';

    const isCallEnded = statusStr.includes('hangup') || statusStr.includes('end') || statusStr.includes('complete');
    if (isCallEnded) {
      if (agentColor === 'violet' || customerColor === 'violet') {
        hangupColor = 'violet';
        hangupSublabel = 'User Busy';
      } else if (agentColor === 'red' || customerColor === 'red') {
        hangupColor = 'red';
        hangupSublabel = 'Dropped / Cancel';
      } else {
        hangupColor = 'indigo';
        hangupSublabel = 'Completed';
      }
    }

    refStatus = {
      refId: targetRefId || targetCallId,
      callId: targetCallId || targetRefId,
      hasRecord: true,
      isLive: true,
      isEnded: isCallEnded,
      agent: { color: agentColor, sublabel: agentSublabel },
      customer: { color: customerColor, sublabel: customerSublabel },
      hangup: { color: hangupColor, sublabel: hangupSublabel },
      duration: durNum,
      recordingUrl: null,
      rawPayload: liveCallStatusData,
    };
  } else if (targetRefId || targetCallId) {
    // 2. Not live on switch -> Check completed CDR or webhook responses:
    const targetKey = targetRefId || targetCallId;
    const matched = finalLogs.find((item) => {
      const raw = (item.rawPayload || {}) as any;
      const customIdStr = raw.custom_identifier ? JSON.stringify(raw.custom_identifier) : '';
      return (
        item.refId === targetKey ||
        item.callId === targetKey ||
        raw.ref_id === targetKey ||
        raw.call_id === targetKey ||
        raw.uuid === targetKey ||
        customIdStr.includes(targetKey)
      );
    });

    if (matched) {
      const raw = (matched.rawPayload || {}) as any;
      const statusStr = String(matched.status || raw.call_status || '').toLowerCase();
      const causeStr = String(matched.hangupCause || raw.hangup_cause_description || raw.hangup_cause_key || '').toLowerCase();
      const reasonStr = String(raw.reason_key || '').toLowerCase();

      const isBusy = causeStr.includes('busy') || reasonStr.includes('busy') || statusStr.includes('busy');
      const isAnswered = statusStr.includes('answer') || matched.callType === 'Answered' || raw.call_connected === '1';
      const isMissedOrDropped = statusStr.includes('miss') || reasonStr.includes('drop') || causeStr.includes('normal_unspecified') || causeStr.includes('no_answer') || causeStr.includes('cancel') || causeStr.includes('reject');

      // 1. Agent Status: Orange=Ringing, Green=Answered, Violet=Busy, Red=Cut/Rejected
      let agentColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'green';
      let agentSublabel = 'Answered';
      const hasMissedAgent = Boolean(raw.missed_agent && (Array.isArray(raw.missed_agent) ? raw.missed_agent.length > 0 : String(raw.missed_agent).trim() !== ''));
      const agentRingSecs = Number(raw.agent_ring_time || 0);

      if (hasMissedAgent || (agentRingSecs === 0 && isBusy)) {
        if (isBusy) {
          agentColor = 'violet';
          agentSublabel = 'Busy';
        } else {
          agentColor = 'red';
          agentSublabel = 'Cut / Rejected';
        }
      } else {
        agentColor = 'green';
        agentSublabel = 'Answered';
      }

      // 2. Customer Status: Orange=Ringing, Green=Speaking, Violet=Busy, Red=Cut/Dropped, Gray=Waiting
      let customerColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'gray';
      let customerSublabel = 'Waiting';

      if (agentColor === 'violet' || agentColor === 'red') {
        customerColor = 'gray';
        customerSublabel = 'Not Reached';
      } else if (isAnswered && !isMissedOrDropped) {
        customerColor = 'green';
        customerSublabel = 'Speaking';
      } else if (isBusy) {
        customerColor = 'violet';
        customerSublabel = 'Busy';
      } else if (isMissedOrDropped) {
        customerColor = 'red';
        customerSublabel = raw.reason_key || raw.hangup_cause_description || 'Cut / Dropped';
      } else {
        customerColor = 'green';
        customerSublabel = 'Connected';
      }

      // 3. Hangup Status: Indigo=Completed, Violet=Busy, Red=Cut/Dropped
      let hangupColor: 'indigo' | 'violet' | 'red' | 'gray' = 'indigo';
      let hangupSublabel = raw.hangup_cause_description || matched.hangupCause || 'Completed';

      if (agentColor === 'violet' || customerColor === 'violet') {
        hangupColor = 'violet';
        hangupSublabel = raw.hangup_cause_description || 'User Busy';
      } else if (agentColor === 'red' || customerColor === 'red') {
        hangupColor = 'red';
        hangupSublabel = raw.hangup_cause_description || raw.reason_key || 'Dropped / Cut';
      } else {
        hangupColor = 'indigo';
        hangupSublabel = raw.hangup_cause_description || 'Completed';
      }

      refStatus = {
        refId: targetRefId || targetCallId,
        callId: targetCallId || targetRefId,
        hasRecord: true,
        isLive: false,
        isEnded: true,
        agent: { color: agentColor, sublabel: agentSublabel },
        customer: { color: customerColor, sublabel: customerSublabel },
        hangup: { color: hangupColor, sublabel: hangupSublabel },
        duration: matched.duration,
        recordingUrl: matched.recordingUrl,
      };
    }
  }

  return res.status(200).json({
    success: true,
    active_ref_id: targetRefId || null,
    active_call_id: targetCallId || null,
    is_live: Boolean(liveCallStatusData),
    live_calls_api_result: liveCallsApiResult,
    ref_status: refStatus,
    total: finalLogs.length,
    logs: finalLogs,
  });
}
