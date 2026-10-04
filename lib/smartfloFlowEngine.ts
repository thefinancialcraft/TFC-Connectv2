// Engine for computing deterministic Smartflo Call Flow States
export type CallDirection = 'inbound' | 'outbound';
export type StepColor = 'gray' | 'orange' | 'green' | 'violet' | 'red' | 'indigo';

export interface FlowStepState {
  title: string;
  sublabel: string;
  color: StepColor;
  icon: string;
  isSpinning?: boolean;
  spinColor?: 'orange' | 'green' | 'indigo';
}

export interface SmartfloCallFlowState {
  direction: CallDirection;
  refId: string | null;
  callId: string | null;
  isLive: boolean;
  isEnded: boolean;
  hasRecord: boolean;
  duration: number;
  recordingUrl: string | null;
  steps: {
    step1: FlowStepState; // Originated (Ref Issued / Inbound Call)
    step2: FlowStepState; // Outbound: Agent Leg | Inbound: Customer
    step3: FlowStepState; // Outbound: Customer  | Inbound: Agent Leg
    step4: FlowStepState; // Hangup
  };
  rawPayload?: any;
}

export function cleanPhone(raw: string): string {
  let cleaned = String(raw || '').replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.substring(2);
  if (cleaned.startsWith('0') && cleaned.length === 11) cleaned = cleaned.substring(1);
  return cleaned.slice(-10);
}

export function computeSmartfloFlowState(params: {
  direction?: CallDirection;
  isPlacingCall?: boolean;
  isCalling?: boolean;
  isEndingCall?: boolean;
  refId?: string | null;
  callId?: string | null;
  liveCallData?: any | null;
  matchedLog?: any | null;
}): SmartfloCallFlowState {
  const {
    isPlacingCall = false,
    isCalling = false,
    isEndingCall = false,
    refId = null,
    callId = null,
    liveCallData = null,
    matchedLog = null,
  } = params;

  // 1. Determine Direction
  let direction: CallDirection = params.direction || 'outbound';
  if (liveCallData) {
    const d = String(liveCallData.direction || liveCallData.call_type || '').toLowerCase();
    if (d.includes('inbound') || d === 'rynxly_inbound') direction = 'inbound';
  } else if (matchedLog) {
    const raw = (matchedLog.rawPayload || {}) as any;
    const rawCallType = String(raw.call_type || matchedLog.callType || '').toLowerCase();
    const d = String(
      matchedLog.direction ||
      raw.direction ||
      ''
    ).toLowerCase();
    if (rawCallType === 'rynxly_inbound' || rawCallType.includes('inbound') || d.includes('inbound')) {
      direction = 'inbound';
    }
  }

  const hasOriginated = Boolean(
    isPlacingCall || isCalling || refId || callId || liveCallData || matchedLog
  );

  // 2. Compute based on LIVE CALL on Switch
  if (liveCallData) {
    const statusStr = String(liveCallData.status || liveCallData.call_status || '').toLowerCase();
    const isAnswered =
      statusStr.includes('answered') ||
      statusStr.includes('in_call') ||
      statusStr.includes('bridge') ||
      statusStr.includes('connected') ||
      statusStr.includes('speaking');
    const isRinging =
      statusStr.includes('ring') ||
      statusStr.includes('dial') ||
      statusStr.includes('originate') ||
      statusStr.includes('progress');

    const dur = Number(liveCallData.duration || liveCallData.billsec || 0);

    if (direction === 'inbound') {
      // Inbound Live
      const customerStep: FlowStepState = {
        title: 'Customer',
        sublabel: isAnswered ? 'Connected' : 'Ringing',
        color: isAnswered ? 'green' : 'orange',
        icon: 'fi-rr-user',
        isSpinning: !isAnswered,
        spinColor: !isAnswered ? 'orange' : undefined,
      };

      const agentStep: FlowStepState = {
        title: 'Agent Leg',
        sublabel: isAnswered ? 'Answered' : isRinging ? 'Ringing Agent...' : 'Connecting...',
        color: isAnswered ? 'green' : 'orange',
        icon: 'fi-rr-phone-call',
        isSpinning: !isAnswered,
        spinColor: 'orange',
      };

      const hangupStep: FlowStepState = {
        title: 'Hangup',
        sublabel: isAnswered ? (dur > 0 ? `${dur}s` : 'In Call') : 'Standby',
        color: isAnswered ? 'indigo' : 'gray',
        icon: 'fi-rr-phone-slash',
        isSpinning: isAnswered,
        spinColor: 'indigo',
      };

      return {
        direction: 'inbound',
        refId,
        callId: liveCallData.call_id || callId,
        isLive: true,
        isEnded: false,
        hasRecord: true,
        duration: dur,
        recordingUrl: null,
        steps: {
          step1: {
            title: 'Originated',
            sublabel: 'Inbound Call',
            color: 'green',
            icon: 'fi-rr-check',
          },
          step2: customerStep,
          step3: agentStep,
          step4: hangupStep,
        },
        rawPayload: liveCallData,
      };
    } else {
      // Outbound Live
      const agentStep: FlowStepState = {
        title: 'Agent Leg',
        sublabel: 'Answered',
        color: 'green',
        icon: 'fi-rr-phone-call',
      };

      const customerStep: FlowStepState = {
        title: 'Customer',
        sublabel: isAnswered ? 'Speaking' : isRinging ? 'Ringing Customer...' : 'Waiting',
        color: isAnswered ? 'green' : 'orange',
        icon: 'fi-rr-user',
        isSpinning: true,
        spinColor: isAnswered ? 'green' : 'orange',
      };

      const hangupStep: FlowStepState = {
        title: 'Hangup',
        sublabel: dur > 0 ? `${dur}s` : 'In Call',
        color: 'indigo',
        icon: 'fi-rr-phone-slash',
        isSpinning: true,
        spinColor: 'indigo',
      };

      return {
        direction: 'outbound',
        refId,
        callId: liveCallData.call_id || callId,
        isLive: true,
        isEnded: false,
        hasRecord: true,
        duration: dur,
        recordingUrl: null,
        steps: {
          step1: {
            title: 'Originated',
            sublabel: 'Ref Issued',
            color: 'green',
            icon: 'fi-rr-check',
          },
          step2: agentStep,
          step3: customerStep,
          step4: hangupStep,
        },
        rawPayload: liveCallData,
      };
    }
  }

  // 3. Compute based on COMPLETED CDR or Webhook Log
  if (matchedLog && !isCalling && !isPlacingCall) {
    const raw = (matchedLog.rawPayload || {}) as any;
    const statusStr = String(matchedLog.status || raw.call_status || '').toLowerCase();
    const causeStr = String(
      matchedLog.hangupCause || raw.hangup_cause_description || raw.hangup_cause_key || ''
    ).toLowerCase();
    const reasonStr = String(raw.reason_key || '').toLowerCase();

    const isBusy = causeStr.includes('busy') || reasonStr.includes('busy') || statusStr.includes('busy');
    const isMissedOrDropped =
      statusStr.includes('miss') ||
      reasonStr.includes('drop') ||
      reasonStr.includes('noanswer') ||
      causeStr.includes('normal_unspecified') ||
      causeStr.includes('no_answer') ||
      causeStr.includes('cancel') ||
      causeStr.includes('reject');
    const isAnswered =
      !isMissedOrDropped && (statusStr.includes('answer') || matchedLog.callType === 'Answered');

    const duration = Number(matchedLog.duration || raw.duration || raw.billsec || 0);

    if (direction === 'inbound') {
      const customerStep: FlowStepState = {
        title: 'Customer',
        sublabel: isAnswered ? 'Connected' : isBusy ? 'Busy' : 'Connected',
        color: 'green',
        icon: 'fi-rr-user',
      };

      let agentColor: StepColor = 'green';
      let agentSublabel = 'Answered';
      if (!isAnswered) {
        if (isBusy) {
          agentColor = 'violet';
          agentSublabel = 'Busy';
        } else {
          agentColor = 'red';
          agentSublabel = raw.reason_key === 'noanswer' ? 'No Answer' : 'Missed / Cut';
        }
      }

      const agentStep: FlowStepState = {
        title: 'Agent Leg',
        sublabel: agentSublabel,
        color: agentColor,
        icon: 'fi-rr-phone-call',
      };

      let hangupColor: StepColor = 'indigo';
      let hangupSublabel = raw.hangup_cause_description || matchedLog.hangupCause || (duration > 0 ? `${duration}s` : 'Completed');
      if (isBusy) {
        hangupColor = 'violet';
        hangupSublabel = 'User Busy';
      } else if (isMissedOrDropped) {
        hangupColor = 'red';
        hangupSublabel = raw.hangup_cause_description || raw.reason_key || 'Dropped / Cut';
      }

      const hangupStep: FlowStepState = {
        title: 'Hangup',
        sublabel: hangupSublabel,
        color: hangupColor,
        icon: 'fi-rr-phone-slash',
      };

      return {
        direction: 'inbound',
        refId,
        callId: matchedLog.callId || callId,
        isLive: false,
        isEnded: true,
        hasRecord: true,
        duration,
        recordingUrl: matchedLog.recordingUrl || null,
        steps: {
          step1: {
            title: 'Originated',
            sublabel: 'Inbound Call',
            color: 'green',
            icon: 'fi-rr-check',
          },
          step2: customerStep,
          step3: agentStep,
          step4: hangupStep,
        },
        rawPayload: matchedLog.rawPayload,
      };
    } else {
      // Outbound Completed
      const hasMissedAgent = Boolean(
        raw.missed_agent &&
          (Array.isArray(raw.missed_agent)
            ? raw.missed_agent.length > 0
            : String(raw.missed_agent).trim() !== '')
      );
      const agentRingSecs = Number(raw.agent_ring_time || 0);

      let agentColor: StepColor = 'green';
      let agentSublabel = 'Answered';
      if (hasMissedAgent || (agentRingSecs === 0 && isBusy)) {
        agentColor = isBusy ? 'violet' : 'red';
        agentSublabel = isBusy ? 'Busy' : 'Cut / Rejected';
      }

      const agentStep: FlowStepState = {
        title: 'Agent Leg',
        sublabel: agentSublabel,
        color: agentColor,
        icon: 'fi-rr-phone-call',
      };

      let customerColor: StepColor = 'gray';
      let customerSublabel = 'Not Reached';
      if (agentColor === 'green') {
        if (isAnswered) {
          customerColor = 'green';
          customerSublabel = 'Connected';
        } else if (isBusy) {
          customerColor = 'violet';
          customerSublabel = 'Busy';
        } else if (isMissedOrDropped) {
          customerColor = 'red';
          customerSublabel =
            raw.reason_key === 'noanswer'
              ? 'No Answer'
              : raw.reason_key === 'cancel'
              ? 'Cancelled'
              : raw.reason_key || raw.hangup_cause_description || 'Missed';
        }
      }

      const customerStep: FlowStepState = {
        title: 'Customer',
        sublabel: customerSublabel,
        color: customerColor,
        icon: 'fi-rr-user',
      };

      let hangupColor: StepColor = 'indigo';
      let hangupSublabel = raw.hangup_cause_description || matchedLog.hangupCause || (duration > 0 ? `${duration}s` : 'Completed');
      if (agentColor === 'violet' || customerColor === 'violet') {
        hangupColor = 'violet';
        hangupSublabel = raw.hangup_cause_description || 'User Busy';
      } else if (agentColor === 'red' || customerColor === 'red') {
        hangupColor = 'red';
        hangupSublabel = raw.hangup_cause_description || raw.reason_key || 'Dropped / Cut';
      }

      const hangupStep: FlowStepState = {
        title: 'Hangup',
        sublabel: hangupSublabel,
        color: hangupColor,
        icon: 'fi-rr-phone-slash',
      };

      return {
        direction: 'outbound',
        refId,
        callId: matchedLog.callId || callId,
        isLive: false,
        isEnded: true,
        hasRecord: true,
        duration,
        recordingUrl: matchedLog.recordingUrl || null,
        steps: {
          step1: {
            title: 'Originated',
            sublabel: 'Ref Issued',
            color: 'green',
            icon: 'fi-rr-check',
          },
          step2: agentStep,
          step3: customerStep,
          step4: hangupStep,
        },
        rawPayload: matchedLog.rawPayload,
      };
    }
  }

  // 4. In-Flight UI Progress State (when CRM is placing or actively in call)
  if (isPlacingCall || isCalling) {
    if (direction === 'inbound') {
      return {
        direction: 'inbound',
        refId,
        callId,
        isLive: true,
        isEnded: isEndingCall,
        hasRecord: false,
        duration: 0,
        recordingUrl: null,
        steps: {
          step1: {
            title: 'Originated',
            sublabel: 'Inbound Call',
            color: 'green',
            icon: 'fi-rr-check',
          },
          step2: {
            title: 'Customer',
            sublabel: isEndingCall ? 'Ended' : 'Connected',
            color: isEndingCall ? 'gray' : 'green',
            icon: 'fi-rr-user',
          },
          step3: {
            title: 'Agent Leg',
            sublabel: isEndingCall ? 'Answered' : 'Ringing Agent...',
            color: isEndingCall ? 'green' : 'orange',
            icon: 'fi-rr-phone-call',
            isSpinning: !isEndingCall,
            spinColor: 'orange',
          },
          step4: {
            title: 'Hangup',
            sublabel: isEndingCall ? 'Ending...' : 'Standby',
            color: isEndingCall ? 'red' : 'gray',
            icon: 'fi-rr-phone-slash',
            isSpinning: isEndingCall,
            spinColor: 'indigo',
          },
        },
      };
    } else {
      // Outbound In-Flight
      return {
        direction: 'outbound',
        refId,
        callId,
        isLive: true,
        isEnded: isEndingCall,
        hasRecord: false,
        duration: 0,
        recordingUrl: null,
        steps: {
          step1: {
            title: 'Originated',
            sublabel: 'Ref Issued',
            color: 'green',
            icon: 'fi-rr-check',
          },
          step2: {
            title: 'Agent Leg',
            sublabel: isEndingCall
              ? 'Answered'
              : isPlacingCall
              ? 'Dialing Agent...'
              : 'Ringing Agent...',
            color: isEndingCall ? 'green' : 'orange',
            icon: 'fi-rr-phone-call',
            isSpinning: !isEndingCall,
            spinColor: 'orange',
          },
          step3: {
            title: 'Customer',
            sublabel: isEndingCall ? 'Ended' : 'Waiting',
            color: 'gray',
            icon: 'fi-rr-user',
          },
          step4: {
            title: 'Hangup',
            sublabel: isEndingCall ? 'Ending...' : 'Standby',
            color: isEndingCall ? 'red' : 'gray',
            icon: 'fi-rr-phone-slash',
          },
        },
      };
    }
  }

  // 5. Default Standby State
  return {
    direction: 'outbound',
    refId: null,
    callId: null,
    isLive: false,
    isEnded: false,
    hasRecord: false,
    duration: 0,
    recordingUrl: null,
    steps: {
      step1: {
        title: 'Originated',
        sublabel: 'Standby',
        color: hasOriginated ? 'green' : 'gray',
        icon: hasOriginated ? 'fi-rr-check' : 'fi-rr-play',
      },
      step2: {
        title: 'Agent Leg',
        sublabel: 'Standby',
        color: 'gray',
        icon: 'fi-rr-phone-call',
      },
      step3: {
        title: 'Customer',
        sublabel: 'Standby',
        color: 'gray',
        icon: 'fi-rr-user',
      },
      step4: {
        title: 'Hangup',
        sublabel: 'Standby',
        color: 'gray',
        icon: 'fi-rr-phone-slash',
      },
    },
  };
}
