// LocalStorage Smartflo Call Session Cache & Timeline Store
import { cleanPhone } from './smartfloFlowEngine';

export type SmartfloSessionDirection = 'inbound' | 'outbound';
export type SmartfloSessionStatus =
  | 'originated'
  | 'agent_ringing'
  | 'agent_answered'
  | 'customer_ringing'
  | 'connected'
  | 'ended'
  | 'timeout';

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
      status: params.direction === 'inbound' ? 'connected' : 'agent_ringing',
      startTime: now,
      agentRingStartTime: params.direction === 'outbound' ? now : null,
      agentAnswerTime: null,
      customerAnswerTime: null,
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
    const existingKey = Object.keys(all).find((k) => {
      const s = all[k];
      return (
        k === targetKey ||
        s.id === targetKey ||
        s.ref_id === targetKey ||
        s.call_id === targetKey ||
        s.uuid === targetKey
      );
    });

    if (!existingKey) return null;
    const session = all[existingKey];
    const now = Date.now();

    // Append timeline entry if provided
    if (timelineEvent) {
      const nextIdx = (session.timeline?.length || 0) + 1;
      const newEntry: SmartfloTimelineEntry = {
        idx: nextIdx,
        timestamp: now,
        isoTime: new Date(now).toISOString(),
        stage: timelineEvent.stage,
        message: timelineEvent.message,
        data: timelineEvent.data,
      };

      const timeline = [...(session.timeline || []), newEntry];
      // Keep only up to MAX_TIMELINE_ENTRIES
      session.timeline =
        timeline.length > MAX_TIMELINE_ENTRIES
          ? timeline.slice(timeline.length - MAX_TIMELINE_ENTRIES)
          : timeline;
    }

    // Merge updates
    Object.assign(session, updates, { updated_at: now });

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
    maxAgeMs?: number;
  }): SmartfloCallSession | null {
    const { targetKey, phone, maxAgeMs = 300000 } = params; // default 5 min window
    const all = this.getAllSessions();
    const cleaned = phone ? cleanPhone(phone) : null;
    const now = Date.now();

    // 1. Direct key match (ID, Ref, CallId, UUID)
    if (targetKey) {
      for (const k of Object.keys(all)) {
        const s = all[k];
        if (
          k === targetKey ||
          s.id === targetKey ||
          s.ref_id === targetKey ||
          s.call_id === targetKey ||
          s.uuid === targetKey
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
        (!cleaned || active.phone === cleaned || active.phone.includes(cleaned))
      ) {
        return active;
      }
    }

    // 3. Recent session for phone
    if (cleaned) {
      const candidates = Object.values(all).filter((s) => {
        return (
          (s.phone === cleaned || s.phone.includes(cleaned) || cleaned.includes(s.phone)) &&
          now - s.updated_at <= maxAgeMs
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
};
