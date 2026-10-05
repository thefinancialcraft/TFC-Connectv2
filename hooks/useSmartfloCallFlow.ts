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
  // activeCallType: 'inbound' | 'outbound' | null (null keeps both cards hidden)
  const [activeCallType, setActiveCallType] = useState<CallDirection | null>(null);

  const [flowState, setFlowState] = useState<SmartfloCallFlowState>(() =>
    computeSmartfloFlowState({
      isPlacingCall: false,
      isCalling: false,
      isEndingCall: false,
      refId: null,
      callId: null,
    })
  );

  const activeCallIdRef = useRef<string | null>(activeCallId);
  const activeRefIdRef = useRef<string | null>(activeRefId);
  const isFetchingRef = useRef(false);

  // Sync refs with props
  useEffect(() => {
    if (activeRefId) activeRefIdRef.current = activeRefId;
  }, [activeRefId]);

  useEffect(() => {
    if (activeCallId) activeCallIdRef.current = activeCallId;
  }, [activeCallId]);

  // Core function to query Smartflo API for latest call state using call_id / ref_id
  const refreshFlowState = useCallback(
    async (targetCallId?: string | null, targetDirection?: CallDirection) => {
      if (!phone || activeCallingProvider !== 'smartflo') return;
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const currentCallId = targetCallId || activeCallIdRef.current || '';
        const currentRef = activeRefIdRef.current || '';
        const cleanedPhone = cleanPhone(phone);

        const url = `/api/calling/smartflo-logs?phone=${encodeURIComponent(
          cleanedPhone
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
          const liveCall =
            data.live_calls_api_result?.matched_live_call ||
            (data.is_live && data.ref_status?.rawPayload) ||
            null;
          const liveCallId = data.active_call_id || liveCall?.call_id || currentCallId;

          if (liveCallId) {
            activeCallIdRef.current = liveCallId;
          }

          // Match relevant log
          let matchedLog: any = null;
          if (liveCallId || currentRef) {
            const key = liveCallId || currentRef;
            matchedLog = logs.find((l: any) => {
              const raw = (l.rawPayload || {}) as any;
              return (
                l.refId === key ||
                l.callId === key ||
                raw.ref_id === key ||
                raw.call_id === key ||
                raw.uuid === key
              );
            });
          }

          // Determine call direction
          let detectedDirection: CallDirection =
            targetDirection ||
            (data.ref_status?.isInbound ? 'inbound' : 'outbound');

          if (liveCall) {
            const d = String(liveCall.direction || liveCall.call_type || '').toLowerCase();
            if (d.includes('inbound') || d === 'rynxly_inbound') detectedDirection = 'inbound';
          } else if (matchedLog) {
            const raw = (matchedLog.rawPayload || {}) as any;
            const ct = String(raw.call_type || matchedLog.callType || '').toLowerCase();
            if (ct === 'rynxly_inbound' || ct.includes('inbound')) detectedDirection = 'inbound';
          }

          // Show the respective card
          setActiveCallType(detectedDirection);

          const computed = computeSmartfloFlowState({
            direction: detectedDirection,
            isPlacingCall,
            isCalling,
            isEndingCall,
            refId: currentRef || null,
            callId: liveCallId || null,
            liveCallData: liveCall,
            matchedLog,
          });

          setFlowState(computed);

          // If call has ended and was active, notify
          if (computed.isEnded && isCalling && onCallEndDetected) {
            onCallEndDetected(liveCallId || undefined);
          }
        }
      } catch (err) {
        console.warn('[useSmartfloCallFlow] API Error:', err);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [phone, customerId, activeCallingProvider, isPlacingCall, isCalling, isEndingCall, onCallEndDetected]
  );

  // 1. Connect Realtime Webhook directly to Flow Cards
  useEffect(() => {
    if (activeCallingProvider !== 'smartflo') return;

    const channel = supabase
      .channel('smartflo-flow-webhook-listener')
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

          // Check if webhook belongs to current customer
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

            const direction: CallDirection = isInbound ? 'inbound' : 'outbound';
            setActiveCallType(direction);

            if (incomingCallId) {
              activeCallIdRef.current = incomingCallId;
            }

            // Immediately run API with the call_id to get the latest call status
            refreshFlowState(incomingCallId || undefined, direction);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCallingProvider, phone, refreshFlowState]);

  // 2. Handle CRM UI Outbound Call Trigger
  useEffect(() => {
    if (isPlacingCall || isCalling) {
      setActiveCallType('outbound');
      setFlowState(
        computeSmartfloFlowState({
          direction: 'outbound',
          isPlacingCall,
          isCalling,
          isEndingCall,
          refId: activeRefId,
          callId: activeCallId,
        })
      );
    }
  }, [isPlacingCall, isCalling, isEndingCall, activeRefId, activeCallId]);

  // 3. Reset when customer changes or call is completely cleared
  useEffect(() => {
    activeCallIdRef.current = null;
    activeRefIdRef.current = null;
    setActiveCallType(null);
    setFlowState(
      computeSmartfloFlowState({
        isPlacingCall: false,
        isCalling: false,
        isEndingCall: false,
        refId: null,
        callId: null,
      })
    );
  }, [customerId]);

  return {
    flowState,
    activeCallType,
    refreshFlowState,
    setActiveCallType,
  };
}
