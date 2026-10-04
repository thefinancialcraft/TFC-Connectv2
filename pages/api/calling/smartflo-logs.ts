import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabase } from '@/lib/supabase';
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
  if (!bearerMatch) return null;

  const token = bearerMatch[1];
  const client = supabaseAdmin || supabase;
  if (!client) return null;

  try {
    const { data: { user }, error } = await client.auth.getUser(token);
    if (!error && user) return user;

    if (supabaseAdmin && client !== supabase) {
      const { data: { user: fallbackUser }, error: fallbackError } = await supabase.auth.getUser(token);
      if (!fallbackError && fallbackUser) return fallbackUser;
    }
  } catch {
    return null;
  }
  return null;
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
  let targetCallId = String(req.query.call_id || req.body?.call_id || '').trim();

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

    if (targetPhone) {
      const itemDest = cleanPhone(item.destinationNumber || '');
      const raw = (item.rawPayload || {}) as any;
      const itemCaller = cleanPhone(
        item.agentNumber ||
        raw.caller_id_number ||
        raw.caller_id ||
        raw.customer_number ||
        raw.from ||
        ''
      );
      if (
        (itemDest && (itemDest.includes(targetPhone) || targetPhone.includes(itemDest))) ||
        (itemCaller && (itemCaller.includes(targetPhone) || targetPhone.includes(itemCaller)))
      ) {
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

  // 3. Real-time query to Tata Smartflo Live Calls API (GET v1/live_calls) & CDR (v1/call/records)
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

      // --- A. Query Realtime Active Calls: GET /v1/live_calls (Live Calls Switch Dashboard) ---
      try {
        const liveListUrl = 'https://api-smartflo.tatateleservices.com/v1/live_calls';
        console.log(`\n================== [SMARTFLO LIVE CALLS LIST] ==================`);
        console.log(`📡 GET ${liveListUrl}`);
        console.log(`🔑 Authorization: Bearer ${token.slice(0, 10)}...${token.slice(-6)}`);

        const listRes = await fetch(liveListUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const listText = await listRes.text();
        console.log(`📥 HTTP Status: ${listRes.status} ${listRes.statusText}`);
        console.log(`📋 Response Result:`, listText.slice(0, 500));
        console.log(`================================================================\n`);

        let listJson: any = null;
        try {
          listJson = listText ? JSON.parse(listText) : null;
        } catch {
          listJson = null;
        }

        if (listRes.ok && listJson) {
          const callsArray: any[] = Array.isArray(listJson)
            ? listJson
            : Array.isArray(listJson?.calls)
              ? listJson.calls
              : Array.isArray(listJson?.data)
                ? listJson.data
                : Array.isArray(listJson?.records)
                  ? listJson.records
                  : Array.isArray(listJson?.data?.calls)
                    ? listJson.data.calls
                    : Array.isArray(listJson?.result?.calls)
                      ? listJson.result.calls
                      : Array.isArray(listJson?.result)
                        ? listJson.result
                        : [];

          liveCallsApiResult = {
            url: liveListUrl,
            status: listRes.status,
            count: callsArray.length,
          };

          const matchedCall = callsArray.find((c: any) => {
            const rawCustId = c.custom_identifier ? JSON.stringify(c.custom_identifier) : '';
            const cRef = String(c.ref_id || c.refId || c.uuid || '');
            const cCallId = String(c.call_id || c.callId || c.id || '');
            const cDest = cleanPhone(String(c.destination || c.customer_number || c.destination_number || c.call_to_number || c.to || ''));
            const cCaller = cleanPhone(String(c.caller_id_number || c.caller_id || c.from || c.caller || ''));

            if (targetRefId && (cRef === targetRefId || cCallId === targetRefId || rawCustId.includes(targetRefId))) return true;
            if (targetCallId && (cCallId === targetCallId || cRef === targetCallId || rawCustId.includes(targetCallId))) return true;
            if (targetPhone && ((cDest && (cDest.includes(targetPhone) || targetPhone.includes(cDest))) || (cCaller && (cCaller.includes(targetPhone) || targetPhone.includes(cCaller))))) return true;
            return false;
          });

          if (matchedCall) {
            console.log(`🎯 [Smartflo Live Calls List] Matched active live call:`, matchedCall);
            liveCallStatusData = matchedCall;
            liveCallsApiResult.matched_live_call = matchedCall;
            if (matchedCall.call_id) {
              targetCallId = String(matchedCall.call_id);
            }
          } else {
            console.log(`ℹ️ [Smartflo Live Calls List] No active call in list matching ref_id: ${targetRefId || targetCallId}. Call may have ended or not yet bridged.`);
          }
        }
      } catch (listErr) {
        console.warn('[Smartflo Live Calls List] Exception querying live calls list:', listErr);
      }

      // --- B. Query Tata Smartflo CDR API (v1/call/records) for completed calls ---
      const now = new Date();
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const fromDate = formatDateForSmartflo(past24h);
      const toDate = formatDateForSmartflo(now);

      const recordsUrl = new URL('https://api-smartflo.tatateleservices.com/v1/call/records');
      recordsUrl.searchParams.set('from_date', fromDate);
      recordsUrl.searchParams.set('to_date', toDate);
      recordsUrl.searchParams.set('limit', '40');

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

        // Filter and map CDR records
        liveSmartfloRecords = records
          .filter((rec: any) => {
            if (!targetPhone && !targetRefId && !targetCallId) return true;
            const recRef = String(rec.ref_id || rec.custom_identifier || rec.uuid || '');
            const recCallId = String(rec.call_id || rec.id || '');
            const recDest = cleanPhone(String(rec.destination || rec.customer_number || rec.destination_number || rec.call_to_number || rec.to || ''));
            const recCaller = cleanPhone(String(rec.caller_id_number || rec.caller_id || rec.agent_number || rec.from || rec.caller || ''));

            if (targetRefId && (recRef === targetRefId || recCallId === targetRefId)) return true;
            if (targetCallId && (recCallId === targetCallId || recRef === targetCallId)) return true;
            if (targetPhone && (
              (recDest && (recDest.includes(targetPhone) || targetPhone.includes(recDest))) ||
              (recCaller && (recCaller.includes(targetPhone) || targetPhone.includes(recCaller)))
            )) return true;
            return false;
          })
          .map((rec: any, idx: number) => {
            const isRecInbound =
              String(rec.direction || '').toLowerCase() === 'inbound' ||
              String(rec.call_type || '').toLowerCase().includes('inbound') ||
              Boolean(rec.call_to_number && !rec.customer_no_with_prefix);

            return {
              id: rec.call_id || rec.id || `live-${idx}`,
              receivedAt: rec.created_at || rec.start_time || new Date().toISOString(),
              callId: String(rec.call_id || rec.id || ''),
              refId: String(rec.ref_id || rec.custom_identifier || rec.call_id || ''),
              direction: isRecInbound ? 'inbound' : String(rec.direction || 'outbound'),
              callType: isRecInbound
                ? 'Inbound Call'
                : String(rec.call_type === 'c' ? 'Answered' : rec.call_type === 'm' ? 'Missed' : rec.call_type || 'Call'),
              agentNumber: String(rec.agent_number || rec.caller_id || ''),
              destinationNumber: String(rec.destination || rec.customer_number || rec.destination_number || ''),
              status: rec.status || (rec.call_type === 'c' ? 'answered' : 'missed'),
              hangupCause: rec.hangup_cause || rec.status || 'NORMAL_CLEARING',
              duration: Number(rec.outbound_sec ?? rec.outbound_talktime ?? rec.duration ?? rec.billsec ?? rec.talk_duration ?? 0),
              recordingUrl: rec.recording_url || rec.record_url || null,
              source: 'smartflo_api',
              rawPayload: rec,
            };
          });
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
      status: String(liveCallStatusData.state || liveCallStatusData.status || liveCallStatusData.call_status || 'ringing'),
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
    const isLiveInbound =
      String(liveCallStatusData.direction || '').toLowerCase() === 'inbound' ||
      String(liveCallStatusData.type || '').toLowerCase().includes('inbound') ||
      String(liveCallStatusData.call_type || '').toLowerCase().includes('inbound');

    // Switch state directly from Tata Smartflo switch (e.g. "Ringing", "Answered", "In-Call")
    const switchState = String(
      liveCallStatusData.state ||
      liveCallStatusData.call_state ||
      ''
    ).toLowerCase().trim();

    const statusStr = String(
      liveCallStatusData.status ||
      liveCallStatusData.call_status ||
      liveCallStatusData.state ||
      ''
    ).toLowerCase().trim();

    const agentStatusStr = String(
      liveCallStatusData.agent_status ||
      liveCallStatusData.agent_state ||
      liveCallStatusData.answered_agent ||
      ''
    ).toLowerCase().trim();

    const customerStatusStr = String(
      liveCallStatusData.customer_status ||
      liveCallStatusData.client_status ||
      liveCallStatusData.destination_status ||
      ''
    ).toLowerCase().trim();

    const causeStr = String(
      liveCallStatusData.hangup_cause ||
      liveCallStatusData.hangup_cause_description ||
      liveCallStatusData.hangup_cause_key ||
      ''
    ).toLowerCase().trim();

    const isClickToCall =
      String(liveCallStatusData.type || liveCallStatusData.multiple_destination_type || '').toLowerCase().includes('c2c') ||
      String(liveCallStatusData.type || '').toLowerCase().includes('click');

    // Parse call duration / call_time (e.g. "00:00:08" -> 8 seconds)
    const callTimeRaw = String(liveCallStatusData.call_time || liveCallStatusData.duration || liveCallStatusData.billsec || '0');
    const callTimeParts = callTimeRaw.split(':').map(Number);
    const callTimeSec = callTimeParts.length === 3
      ? callTimeParts[0] * 3600 + callTimeParts[1] * 60 + callTimeParts[2]
      : callTimeParts.length === 2
        ? callTimeParts[0] * 60 + callTimeParts[1]
        : Number(callTimeRaw) || 0;

    const isLiveCallBothAnswered =
      switchState === 'in-call' ||
      switchState === 'connected' ||
      switchState === 'bridge' ||
      (switchState === 'answered' && callTimeSec > 5) ||
      customerStatusStr.includes('speak') ||
      agentStatusStr.includes('speak');

    let agentColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'gray';
    let agentSublabel = 'Standby';
    let customerColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'gray';
    let customerSublabel = 'Standby';

    if (isLiveInbound) {
      // INBOUND: Customer initiated call -> Customer connected first
      customerColor = 'green';
      customerSublabel = isLiveCallBothAnswered ? 'Speaking' : 'Waiting...';

      if (isLiveCallBothAnswered) {
        agentColor = 'green';
        agentSublabel = 'Answered';
      } else if (agentStatusStr.includes('busy') || causeStr.includes('busy')) {
        agentColor = 'violet';
        agentSublabel = 'Busy';
      } else if (agentStatusStr.includes('reject') || agentStatusStr.includes('miss')) {
        agentColor = 'red';
        agentSublabel = 'Missed / Cut';
      } else {
        agentColor = 'orange';
        agentSublabel = 'Ringing Agent...';
      }
    } else {
      // OUTBOUND: Agent initiated call -> Agent connected first
      const isAgentBusy = agentStatusStr.includes('busy') || causeStr.includes('busy');
      const isAgentCut = agentStatusStr.includes('reject') || agentStatusStr.includes('cut') || agentStatusStr.includes('miss');

      if (isAgentBusy) {
        agentColor = 'violet';
        agentSublabel = 'Busy';
      } else if (isAgentCut) {
        agentColor = 'red';
        agentSublabel = 'Cut / Rejected';
      } else {
        agentColor = 'green';
        agentSublabel = 'Answered';
      }

      const isCustBusy = customerStatusStr.includes('busy') || causeStr.includes('busy');
      const isCustCut = customerStatusStr.includes('cancel') || customerStatusStr.includes('reject') || customerStatusStr.includes('drop');
      const isLiveCallRingingCustomer =
        switchState === 'ringing' ||
        switchState === 'dialing' ||
        customerStatusStr.includes('ring') ||
        customerStatusStr.includes('dial') ||
        (isClickToCall && (switchState.includes('ring') || (switchState === 'answered' && callTimeSec <= 15)));

      if (agentColor === 'violet' || agentColor === 'red') {
        customerColor = 'gray';
        customerSublabel = 'Not Reached';
      } else if (isCustBusy) {
        customerColor = 'violet';
        customerSublabel = 'Busy';
      } else if (isCustCut) {
        customerColor = 'red';
        customerSublabel = 'Cancel / Dropped';
      } else if (isLiveCallBothAnswered) {
        customerColor = 'green';
        customerSublabel = 'Speaking';
      } else {
        customerColor = 'orange';
        customerSublabel = 'Ringing Customer...';
      }
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
      isInbound: Boolean(isLiveInbound),
      agent: { color: agentColor, sublabel: agentSublabel },
      customer: { color: customerColor, sublabel: customerSublabel },
      hangup: { color: hangupColor, sublabel: hangupSublabel },
      duration: durNum,
      recordingUrl: null,
      rawPayload: liveCallStatusData,
    };
  } else if (targetRefId || targetCallId || targetPhone) {
    // 2. Not live on switch -> Check completed CDR or webhook responses:
    const targetKey = targetRefId || targetCallId;
    const matched = targetKey
      ? finalLogs.find((item) => {
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
        })
      : finalLogs.find((item) => {
          if (!targetPhone) return false;
          const itemDest = cleanPhone(item.destinationNumber || '');
          const raw = (item.rawPayload || {}) as any;
          const itemCaller = cleanPhone(
            item.agentNumber ||
            raw.caller_id_number ||
            raw.caller_id ||
            raw.customer_number ||
            raw.from ||
            ''
          );
          return (
            (itemDest && (itemDest.includes(targetPhone) || targetPhone.includes(itemDest))) ||
            (itemCaller && (itemCaller.includes(targetPhone) || targetPhone.includes(itemCaller)))
          );
        });

    if (matched) {
      if (!targetCallId && matched.callId) {
        targetCallId = String(matched.callId);
      }
      const raw = (matched.rawPayload || {}) as any;
      const isMatchedInbound = Boolean(
        String(matched.direction || '').toLowerCase() === 'inbound' ||
        String(matched.callType || '').toLowerCase().includes('inbound') ||
        String(raw.direction || '').toLowerCase() === 'inbound' ||
        String(raw.call_type || '').toLowerCase().includes('inbound')
      );

      const statusStr = String(matched.status || raw.call_status || '').toLowerCase();
      const causeStr = String(matched.hangupCause || raw.hangup_cause_description || raw.hangup_cause_key || '').toLowerCase();
      const reasonStr = String(raw.reason_key || '').toLowerCase();

      const isBusy = causeStr.includes('busy') || reasonStr.includes('busy') || statusStr.includes('busy');
      const isMissedOrDropped = statusStr.includes('miss') || reasonStr.includes('drop') || reasonStr.includes('noanswer') || causeStr.includes('normal_unspecified') || causeStr.includes('no_answer') || causeStr.includes('cancel') || causeStr.includes('reject');
      const isAnswered = !isMissedOrDropped && (statusStr.includes('answer') || matched.callType === 'Answered');

      let agentColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'green';
      let agentSublabel = 'Answered';
      let customerColor: 'orange' | 'green' | 'violet' | 'red' | 'gray' = 'gray';
      let customerSublabel = 'Waiting';

      if (isMatchedInbound) {
        // INBOUND Call: Customer is caller, Agent is receiver
        customerColor = 'green';
        customerSublabel = isAnswered ? 'Connected' : isBusy ? 'Busy' : 'Connected';

        if (isAnswered) {
          agentColor = 'green';
          agentSublabel = 'Answered';
        } else if (isBusy) {
          agentColor = 'violet';
          agentSublabel = 'Busy';
        } else {
          agentColor = 'red';
          agentSublabel = raw.reason_key === 'noanswer' ? 'No Answer' : 'Missed / Cut';
        }
      } else {
        // OUTBOUND Call: Agent is caller, Customer is destination
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

        if (agentColor === 'violet' || agentColor === 'red') {
          customerColor = 'gray';
          customerSublabel = 'Not Reached';
        } else if (isAnswered) {
          customerColor = 'green';
          customerSublabel = 'Connected';
        } else if (isBusy) {
          customerColor = 'violet';
          customerSublabel = 'Busy';
        } else if (isMissedOrDropped) {
          customerColor = 'red';
          customerSublabel = raw.reason_key === 'noanswer' ? 'No Answer' : raw.reason_key === 'cancel' ? 'Cancelled' : raw.reason_key || raw.hangup_cause_description || 'Missed';
        } else {
          customerColor = 'gray';
          customerSublabel = 'Not Reached';
        }
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
        isInbound: isMatchedInbound,
        agent: { color: agentColor, sublabel: agentSublabel },
        customer: { color: customerColor, sublabel: customerSublabel },
        hangup: { color: hangupColor, sublabel: hangupSublabel },
        duration: matched.duration,
        recordingUrl: matched.recordingUrl,
      };
    } else {
      // 3. Not live on switch yet and no completed CDR/webhook:
      // If targetCallId is a real switch ID (contains '.' or differs from targetRefId),
      // the call was ALREADY active on the switch and has just hung up! It is NOT ringing the agent!
      const isSwitchCallId = Boolean(
        targetCallId &&
        (targetCallId.includes('.') || (targetRefId && targetCallId !== targetRefId))
      );

      if (isSwitchCallId) {
        refStatus = {
          refId: targetRefId || targetCallId,
          callId: targetCallId || targetRefId,
          hasRecord: false,
          isLive: false,
          isEnded: true,
          agent: { color: 'green', sublabel: 'Answered' },
          customer: { color: 'gray', sublabel: 'Ended' },
          hangup: { color: 'indigo', sublabel: 'Call Ended' },
          duration: 0,
          recordingUrl: null,
        };
      } else {
        // Truly a new call where agent phone is ringing
        refStatus = {
          refId: targetRefId || targetCallId,
          callId: targetCallId || targetRefId,
          hasRecord: false,
          isLive: false,
          isEnded: false,
          agent: { color: 'orange', sublabel: 'Ringing Agent...' },
          customer: { color: 'gray', sublabel: 'Waiting' },
          hangup: { color: 'gray', sublabel: 'Connecting...' },
          duration: 0,
          recordingUrl: null,
        };
      }
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
