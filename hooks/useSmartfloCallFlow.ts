import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  SmartfloCallFlowState,
  computeSmartfloFlowState,
  cleanPhone,
  CallDirection,
} from '@/lib/smartfloFlowEngine';

interface UseSmartfloCallFlowParams {
  phone?: string | null;
  customerId?: string | null;
  activeCallingProvider?: string | null;
  isPlacingCall?: boolean;
  isCalling?: boolean;
  isEndingCall?: boolean;
  activeRefId?: string | null;
  activeCallId?: string | null;
  onCallEndDetected?: (callId?: string) => void;
}

export function useSmartfloCallFlow({
  phone,
  customerId,
  activeCallingProvider,
  isPlacingCall = false,
  isCalling = false,
  isEndingCall = false,
  activeRefId = null,
  activeCallId = null,
  onCallEndDetected,
}: UseSmartfloCallFlowParams) {
  const [flowState, setFlowState] = useState<SmartfloCallFlowState>(() =>
    computeSmartfloFlowState({
      isPlacingCall,
      isCalling,
      isEndingCall,
      refId: activeRefId,
      callId: activeCallId,
    })
  );

  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [trackedRefId, setTrackedRefId] = useState<string | null>(activeRefId);
  const [trackedCallId, setTrackedCallId] = useState<string | null>(activeCallId);
  const [inboundDetected, setInboundDetected] = useState(false);

  // Sync refs for async callbacks & mutex locks
  const trackedRefIdRef = useRef<string | null>(activeRefId);
  const trackedCallIdRef = useRef<string | null>(activeCallId);
  const isFetchingRef = useRef(false);
  const callEndTriggeredRef = useRef(false);
  const lastSyncTimestampRef = useRef(0);

  // Keep refs in sync with incoming active props
  useEffect(() => {
    if (activeRefId && activeRefId !== trackedRefIdRef.current) {
      trackedRefIdRef.current = activeRefId;
      setTrackedRefId(activeRefId);
      callEndTriggeredRef.current = false;
    }
  }, [activeRefId]);

  useEffect(() => {
    if (activeCallId && activeCallId !== trackedCallIdRef.current) {
      trackedCallIdRef.current = activeCallId;
      setTrackedCallId(activeCallId);
      callEndTriggeredRef.current = false;
    }
  }, [activeCallId]);

  // Reset when customer changes
  useEffect(() => {
    trackedRefIdRef.current = null;
    trackedCallIdRef.current = null;
    callEndTriggeredRef.current = false;
    setTrackedRefId(null);
    setTrackedCallId(null);
    setInboundDetected(false);
    setRawLogs([]);
    setFlowState(
      computeSmartfloFlowState({
        isPlacingCall: false,
        isCalling: false,
        isEndingCall: false,
      })
    );
  }, [customerId]);

  // Core function to fetch logs and compute deterministic flow state
  const refreshFlowState = useCallback(
    async (overrideRef?: string | null, overrideCallId?: string | null) => {
      if (!phone || activeCallingProvider !== 'smartflo') return;
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const currentRef = overrideRef ?? trackedRefIdRef.current ?? '';
        const currentCallId = overrideCallId ?? trackedCallIdRef.current ?? '';
        const cleanedTargetPhone = cleanPhone(phone);

        const url = `/api/calling/smartflo-logs?phone=${encodeURIComponent(
          cleanedTargetPhone
        )}&customer_id=${encodeURIComponent(
          String(customerId || '')
        )}&ref_id=${encodeURIComponent(currentRef)}&call_id=${encodeURIComponent(
          currentCallId
        )}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();

        if (data.success) {
          const logs: any[] = Array.isArray(data.logs) ? data.logs : [];
          setRawLogs(logs);

          const liveCall = data.live_calls_api_result?.matched_live_call || (data.is_live && data.ref_status?.rawPayload) || null;
          const liveCallId = data.active_call_id || liveCall?.call_id || null;

          if (liveCallId && liveCallId !== trackedCallIdRef.current) {
            trackedCallIdRef.current = liveCallId;
            setTrackedCallId(liveCallId);
          }

          // Match the relevant log for completed state
          const targetKey = currentCallId || currentRef || liveCallId;
          let matchedLog: any = null;
          if (targetKey) {
            matchedLog = logs.find((l: any) => {
              const raw = (l.rawPayload || {}) as any;
              const customIdStr = raw.custom_identifier
                ? JSON.stringify(raw.custom_identifier)
                : '';
              return (
                l.refId === targetKey ||
                l.callId === targetKey ||
                raw.ref_id === targetKey ||
                raw.call_id === targetKey ||
                raw.uuid === targetKey ||
                customIdStr.includes(targetKey)
              );
            });
          }

          if (!matchedLog && cleanedTargetPhone) {
            matchedLog = logs.find((l: any) => {
              const raw = (l.rawPayload || {}) as any;
              const dest = cleanPhone(l.destinationNumber || raw.destination || raw.call_to_number || '');
              const caller = cleanPhone(l.agentNumber || raw.caller_id_number || raw.caller_id || '');
              return dest.includes(cleanedTargetPhone) || caller.includes(cleanedTargetPhone);
            });
          }

          const isLiveInbound = Boolean(
            data.ref_status?.isInbound ||
            (liveCall && (String(liveCall.direction || '').includes('inbound') || String(liveCall.call_type || '').includes('inbound'))) ||
            (matchedLog && (String(matchedLog.direction || '').includes('inbound') || String(matchedLog.callType || '').includes('inbound')))
          );

          if (isLiveInbound) {
            setInboundDetected(true);
          }

          const computed = computeSmartfloFlowState({
            direction: isLiveInbound || inboundDetected ? 'inbound' : 'outbound',
            isPlacingCall,
            isCalling,
            isEndingCall,
            refId: currentRef || null,
            callId: liveCallId || currentCallId || null,
            liveCallData: liveCall,
            matchedLog,
          });

          setFlowState(computed);
          lastSyncTimestampRef.current = Date.now();

          // Auto trigger call end when call has completed on backend switch
          if (
            isCalling &&
            !callEndTriggeredRef.current &&
            (computed.isEnded || (matchedLog && matchedLog.hangupCause && matchedLog.hangupCause !== 'ACTIVE_CALL'))
          ) {
            callEndTriggeredRef.current = true;
            if (onCallEndDetected) {
              onCallEndDetected(liveCallId || currentCallId || undefined);
            }
          }
        }
      } catch (err) {
        console.warn('[useSmartfloCallFlow] Refresh error:', err);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [
      phone,
      customerId,
      activeCallingProvider,
      isPlacingCall,
      isCalling,
      isEndingCall,
      inboundDetected,
      onCallEndDetected,
    ]
  );

  // 1. Instant Realtime updates on webhook_responses INSERT
  useEffect(() => {
    if (activeCallingProvider !== 'smartflo') return;

    const channel = supabase
      .channel('smartflo-call-flow-webhook')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webhook_responses',
        },
        (payload) => {
          const resPayload = (payload.new?.response || {}) as any;
          const raw = (resPayload.rawPayload || resPayload) as any;

          const callerNum = cleanPhone(
            raw.caller_id_number ||
              raw.caller_id ||
              resPayload.agentNumber ||
              raw.customer_number ||
              raw.from ||
              ''
          );
          const destNum = cleanPhone(
            raw.call_to_number ||
              raw.destination ||
              resPayload.destinationNumber ||
              raw.to ||
              ''
          );
          const currentCustPhone = phone ? cleanPhone(phone) : '';

          const incomingCallId = String(
            raw.call_id || raw.uuid || resPayload.callId || resPayload.refId || ''
          );

          if (
            currentCustPhone &&
            (callerNum.includes(currentCustPhone) ||
              currentCustPhone.includes(callerNum) ||
              destNum.includes(currentCustPhone) ||
              currentCustPhone.includes(destNum))
          ) {
            const rawCallType = String(raw.call_type || resPayload.callType || '').toLowerCase();
            const isInbound = Boolean(
              rawCallType === 'rynxly_inbound' ||
              rawCallType.includes('inbound') ||
              String(resPayload.direction || raw.direction || '').toLowerCase().includes('inbound') ||
              raw.call_type === 'Inbound Dialplan'
            );

            if (isInbound) {
              setInboundDetected(true);
            }

            if (incomingCallId) {
              trackedCallIdRef.current = incomingCallId;
              setTrackedCallId(incomingCallId);
            }

            refreshFlowState(undefined, incomingCallId || undefined);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCallingProvider, phone, refreshFlowState]);

  // 2. Real-time Adaptive Polling Loop (1.2s when actively calling, auto-stops when ended)
  useEffect(() => {
    if (activeCallingProvider !== 'smartflo') return;
    const targetRef = trackedRefId || trackedRefIdRef.current;
    const targetCallId = trackedCallId || trackedCallIdRef.current;

    // Only poll if call is actively taking place or ref/callId exists
    if (!targetRef && !targetCallId && !isCalling && !isPlacingCall) return;

    if (flowState.isEnded && !isCalling && !isPlacingCall) return;

    const intervalMs = isCalling || isPlacingCall ? 1200 : 2500;
    const timer = setInterval(() => {
      refreshFlowState(targetRef, targetCallId);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    activeCallingProvider,
    trackedRefId,
    trackedCallId,
    isCalling,
    isPlacingCall,
    flowState.isEnded,
    refreshFlowState,
  ]);

  // Initial trigger when provider or phone changes
  useEffect(() => {
    if (activeCallingProvider === 'smartflo' && phone) {
      refreshFlowState();
    }
  }, [activeCallingProvider, phone, refreshFlowState]);

  return {
    flowState,
    rawLogs,
    trackedRefId,
    trackedCallId,
    refreshFlowState,
  };
}
