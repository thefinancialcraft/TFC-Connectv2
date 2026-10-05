// LocalStorage Smartflo Call Session Cache & Timeline Store
import { cleanPhone } from './smartfloFlowEngine';

export type SmartfloSessionDirection = 'inbound' | 'outbound';
export type SmartfloSessionStatus =
  | 'originated'
  | 'agent_dialing'
  | 'agent_ringing'
  | 'agent_answered'
  | 'customer_ringing'
  | 'connected'
  | 'hangup_detected'
  | 'ended'
  | 'timeout';

export const SMARTFLO_STAGE_RANK: Record<string, number> = {
  originated: 0,
  agent_dialing: 1,
  agent_ringing: 2,
  agent_answered: 2.5,
  customer_ringing: 3,
  connected: 4,
  hangup_detected: 5,
  ended: 6,
  timeout: 6,
};

// Fix #6: Trim all CDR object keys (fixes keys like 'customer_no_with_prefix ')
export function normalizeCdr(cdr: Record<string, any> | null | undefined): Record<string, any> {
  if (!cdr || typeof cdr !== 'object') return {};
  return Object.fromEntries(Object.entries(cdr).map(([k, v]) => [k.trim(), v]));
}

// Fix #2: Strict CDR matching by ref_id / call_id only (NEVER by phone number alone)
export function cdrMatchesSession(cdrRaw: any, session: SmartfloCallSession | null | undefined): boolean {
  if (!cdrRaw || !session) return false;
  const cdr = normalizeCdr(cdrRaw);
  const cdrRef = String(cdr.ref_id || cdr.custom_identifier?.ref_id || '');
  const cdrCallId = String(cdr.call_id || cdr.id || '');
  const customIdStr = cdr.custom_identifier ? JSON.stringify(cdr.custom_identifier) : '';

  if (session.ref_id && (cdrRef === session.ref_id || customIdStr.includes(session.ref_id))) {
    return true;
  }
  if (session.call_id && (cdrCallId === session.call_id || customIdStr.includes(session.call_id))) {
    return true;
  }
  return false;
}

// Fix #4: Populate session fields directly from CDR
export function applyCdrToSession(session: SmartfloCallSession, rawCdr: any): void {
  if (!rawCdr || !session) return;
  const cdr = normalizeCdr(rawCdr);
  session.hangupCause =
    cdr.hangup_cause_description ||
    cdr.hangup_cause_key ||
    cdr.reason_key ||
    session.hangupCause;
  session.recordingUrl = cdr.recording_url || cdr.record_url || session.recordingUrl;
  session.duration = Number(
    cdr.duration ?? cdr.billsec ?? cdr.outbound_sec ?? session.duration ?? 0
  );
  if (cdr.call_id && !session.call_id) {
    session.call_id = String(cdr.call_id);
  }
}

export interface SmartfloTimelineEntry {
  idx: number;
  timestamp: number;
  isoTime: string;
  stage: SmartfloSessionStatus | string;
  message: string;
  data?: any;
}

export interface SmartfloCallSession {
  id: string; // unique session key (ref_id or call_id or uuid)
  ref_id: string | null;
  call_id: string | null;
  uuid?: string | null;
  direction: SmartfloSessionDirection;
  phone: string;
  customerId: string | null;
  status: SmartfloSessionStatus;
  startTime: number;
  agentRingStartTime: number | null;
  agentAnswerTime: number | null;
  customerAnswerTime: number | null;
  hangupDetectedAt?: number | null;
  endTime: number | null;
  duration: number;
  hangupCause: string | null;
  recordingUrl: string | null;
  rawPayload: any | null;
  timeline: SmartfloTimelineEntry[];
  created_at: number;
  updated_at: number;
}

const STORAGE_KEY = 'rynxly_smartflo_call_sessions';
const ACTIVE_SESSION_KEY = 'rynxly_smartflo_active_session_id';
const MAX_SESSIONS = 50;
const MAX_TIMELINE_ENTRIES = 100;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function notifyUpdate(session: SmartfloCallSession | null) {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(
      new CustomEvent('smartflo:session_updated', {
        detail: session,
      })
    );
  } catch (e) {
    // Ignore event dispatch errors
  }
}

export const SmartfloSessionStore = {
  getAllSessions(): Record<string, SmartfloCallSession> {
    if (!isBrowser()) return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('[SmartfloSessionStore] Error reading sessions from localStorage:', e);
      return {};
    }
  },

  saveAllSessions(sessions: Record<string, SmartfloCallSession>): void {
    if (!isBrowser()) return;
    try {
      // Keep only the most recent MAX_SESSIONS
      const entries = Object.entries(sessions);
      if (entries.length > MAX_SESSIONS) {
        entries.sort((a, b) => (b[1].updated_at || 0) - (a[1].updated_at || 0));
        const pruned: Record<string, SmartfloCallSession> = {};
        for (let i = 0; i < MAX_SESSIONS; i++) {
          if (entries[i]) {
            pruned[entries[i][0]] = entries[i][1];
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('[SmartfloSessionStore] Error saving sessions to localStorage:', e);
    }
  },

  getActiveSessionId(): string | null {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(ACTIVE_SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  setActiveSessionId(sessionId: string | null): void {
    if (!isBrowser()) return;
    try {
      if (sessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
      } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (e) {
      // Ignore
    }
  },

  getActiveSession(): SmartfloCallSession | null {
    const activeId = this.getActiveSessionId();
    if (!activeId) return null;
    const all = this.getAllSessions();
    return all[activeId] || null;
  },

  createSession(params: {
    direction: SmartfloSessionDirection;
    phone: string;
    customerId?: string | null;
    ref_id?: string | null;
    call_id?: string | null;
    uuid?: string | null;
    initialPayload?: any;
  }): SmartfloCallSession {
    const now = Date.now();
    const cleanedPhone = cleanPhone(params.phone);
    const sessionId =
      params.ref_id ||
      params.call_id ||
      params.uuid ||
      `session_${now}_${Math.random().toString(36).slice(2, 7)}`;

    const initialEntry: SmartfloTimelineEntry = {
      idx: 1,
      timestamp: now,
      isoTime: new Date(now).toISOString(),
      stage: params.direction === 'inbound' ? 'connected' : 'originated',
      message:
        params.direction === 'inbound'
          ? `Inbound call arrived for DID / Customer (${cleanedPhone})`
          : `Outbound C2C initiated. Ref issued: ${params.ref_id || sessionId}`,
      data: params.initialPayload || null,
    };

    const session: SmartfloCallSession = {
      id: sessionId,
      ref_id: params.ref_id || null,
      call_id: params.call_id || null,
      uuid: params.uuid || null,
      direction: params.direction,
      phone: cleanedPhone,
      customerId: params.customerId || null,
      status: params.direction === 'inbound' ? 'connected' : 'originated',
      startTime: now,
      agentRingStartTime: params.direction === 'outbound' ? now : null,
      agentAnswerTime: null,
      customerAnswerTime: null,
      hangupDetectedAt: null,
      endTime: null,
      duration: 0,
      hangupCause: null,
      recordingUrl: null,
      rawPayload: params.initialPayload || null,
      timeline: [initialEntry],
      created_at: now,
      updated_at: now,
    };

    const all = this.getAllSessions();
    all[sessionId] = session;
    this.saveAllSessions(all);
    this.setActiveSessionId(sessionId);
    notifyUpdate(session);

    return session;
  },

  updateSession(
    targetKey: string,
    updates: Partial<SmartfloCallSession>,
    timelineEvent?: { stage: string; message: string; data?: any }
  ): SmartfloCallSession | null {
    if (!targetKey) return null;
    const all = this.getAllSessions();
    let existingKey = Object.keys(all).find((k) => {
      const s = all[k];
      return (
        k === targetKey ||
        s.id === targetKey ||
        s.ref_id === targetKey ||
        s.call_id === targetKey ||
        s.uuid === targetKey
      );
    });

    // Fallback to active session if key was newly issued by switch
    if (!existingKey) {
      const activeId = this.getActiveSessionId();
      if (activeId && all[activeId]) {
        existingKey = activeId;
      }
    }

    if (!existingKey) return null;
    const session = all[existingKey];
    const now = Date.now();

    // Fix #1: Monotonic stage enforcement (stages cannot go backwards)
    const currentRank = SMARTFLO_STAGE_RANK[session.status] ?? 0;
    let newStatus = updates.status;

    if (newStatus) {
      const newRank = SMARTFLO_STAGE_RANK[newStatus] ?? 0;
      if (newRank < currentRank) {
        // Prevent regressing from connected -> customer_ringing when liveCall disappears
        if (currentRank >= (SMARTFLO_STAGE_RANK['connected'] ?? 4)) {
          newStatus = 'hangup_detected';
        } else {
          // Reject backward transition
          newStatus = session.status;
        }
      }
    }

    // De-duplicated Timeline Logging with Monotonic Rank enforcement
    if (timelineEvent) {
      const timeline = session.timeline || [];
      const lastEntry = timeline.length > 0 ? timeline[timeline.length - 1] : null;
      const eventRank = SMARTFLO_STAGE_RANK[timelineEvent.stage] ?? 0;

      if (lastEntry && lastEntry.stage === timelineEvent.stage) {
        // Update in-place (latest timestamp, message, data)
        lastEntry.timestamp = now;
        lastEntry.isoTime = new Date(now).toISOString();
        if (timelineEvent.message) lastEntry.message = timelineEvent.message;
        if (timelineEvent.data !== undefined) lastEntry.data = timelineEvent.data;
      } else if (eventRank >= currentRank) {
        // Unique forward state change -> append new entry
        const nextIdx = timeline.length + 1;
        const newEntry: SmartfloTimelineEntry = {
          idx: nextIdx,
          timestamp: now,
          isoTime: new Date(now).toISOString(),
          stage: timelineEvent.stage,
          message: timelineEvent.message,
          data: timelineEvent.data,
        };

        const updatedTimeline = [...timeline, newEntry];
        session.timeline =
          updatedTimeline.length > MAX_TIMELINE_ENTRIES
            ? updatedTimeline.slice(updatedTimeline.length - MAX_TIMELINE_ENTRIES)
            : updatedTimeline;
      }
    }

    // Merge updates
    const safeUpdates = { ...updates };
    if (newStatus) safeUpdates.status = newStatus;
    if (newStatus === 'hangup_detected' && !session.hangupDetectedAt) {
      safeUpdates.hangupDetectedAt = now;
    }
    if (newStatus === 'ended' && !session.endTime) {
      safeUpdates.endTime = now;
    }

    Object.assign(session, safeUpdates, { updated_at: now });

    // Sync mapped call_id if arrived
    if (updates.call_id && !session.call_id) {
      session.call_id = updates.call_id;
    }

    all[existingKey] = session;
    this.saveAllSessions(all);
    notifyUpdate(session);

    return session;
  },

  findSession(params: {
    targetKey?: string | null;
    phone?: string | null;
    customerId?: string | null;
    direction?: SmartfloSessionDirection;
    onlyActive?: boolean;
    maxAgeMs?: number;
  }): SmartfloCallSession | null {
    const { targetKey, phone, direction, onlyActive = false, maxAgeMs = 180000 } = params;
    const all = this.getAllSessions();
    const cleaned = phone ? cleanPhone(phone) : null;
    const now = Date.now();

    const isEligible = (s: SmartfloCallSession) => {
      if (onlyActive && (s.status === 'ended' || s.status === 'timeout')) {
        return false;
      }
      if (direction && s.direction !== direction) {
        return false;
      }
      return true;
    };

    // 1. Direct key match (ID, Ref, CallId, UUID)
    if (targetKey) {
      for (const k of Object.keys(all)) {
        const s = all[k];
        if (
          (k === targetKey ||
            s.id === targetKey ||
            s.ref_id === targetKey ||
            s.call_id === targetKey ||
            s.uuid === targetKey) &&
          isEligible(s)
        ) {
          return s;
        }
      }
    }

    // 2. Active Session match
    const activeId = this.getActiveSessionId();
    if (activeId && all[activeId]) {
      const active = all[activeId];
      if (
        now - active.updated_at <= maxAgeMs &&
        (!cleaned || active.phone === cleaned || active.phone.includes(cleaned)) &&
        isEligible(active)
      ) {
        return active;
      }
    }

    // 3. Recent session for phone
    if (cleaned) {
      const candidates = Object.values(all).filter((s) => {
        return (
          (s.phone === cleaned || s.phone.includes(cleaned) || cleaned.includes(s.phone)) &&
          now - s.updated_at <= maxAgeMs &&
          isEligible(s)
        );
      });
      if (candidates.length > 0) {
        candidates.sort((a, b) => b.updated_at - a.updated_at);
        return candidates[0];
      }
    }

    return null;
  },

  checkAgentRingingTimeout(sessionId: string, timeoutSec: number = 30): boolean {
    const all = this.getAllSessions();
    const session = all[sessionId];
    if (!session) return false;

    if (
      session.direction === 'outbound' &&
      session.status === 'agent_ringing' &&
      session.agentRingStartTime
    ) {
      const elapsed = (Date.now() - session.agentRingStartTime) / 1000;
      if (elapsed >= timeoutSec) {
        this.updateSession(
          sessionId,
          {
            status: 'timeout',
            hangupCause: 'Agent Did Not Answer (30s Timeout)',
            endTime: Date.now(),
          },
          {
            stage: 'timeout',
            message: `Agent phone ringing timeout reached (${timeoutSec}s). Auto-cancelling call.`,
          }
        );
        return true;
      }
    }
    return false;
  },

  applyCdrToSession(session: SmartfloCallSession, rawCdr: any): void {
    applyCdrToSession(session, rawCdr);
  },

  cdrMatchesSession(cdrRaw: any, session: SmartfloCallSession | null | undefined): boolean {
    return cdrMatchesSession(cdrRaw, session);
  },

  normalizeCdr(cdr: Record<string, any> | null | undefined): Record<string, any> {
    return normalizeCdr(cdr);
  },
};
