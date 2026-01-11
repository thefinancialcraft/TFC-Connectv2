
/**
 * Bridge Logger System
 * Manages logs for communication between Web and Native Flutter
 */

export interface BridgeLogEntry {
  id: string;
  direction: 'in' | 'out';
  type: string;
  payload: any;
  timestamp: string;
}

const BRIDGE_LOG_STORAGE_KEY = 'flutter_bridge_logs';
const MAX_BRIDGE_LOGS = 200;

class BridgeLogger {
  addLog(direction: 'in' | 'out', type: string, payload: any) {
    if (typeof window === 'undefined') return;

    try {
      const newEntry: BridgeLogEntry = {
        id: Math.random().toString(36).substring(2, 11),
        direction,
        type,
        payload,
        timestamp: new Date().toISOString()
      };

      const existingLogs = this.getLogs();
      const updatedLogs = [newEntry, ...existingLogs].slice(0, MAX_BRIDGE_LOGS);
      
      localStorage.setItem(BRIDGE_LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
      
      // Trigger a custom event so the UI can update in real-time
      window.dispatchEvent(new CustomEvent('tfc-new-bridge-log', { detail: newEntry }));
    } catch (e) {
      console.error("Failed to save bridge log", e);
    }
  }

  getLogs(): BridgeLogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const logs = localStorage.getItem(BRIDGE_LOG_STORAGE_KEY);
      if (!logs) return [];
      
      const parsed = JSON.parse(logs);
      // Ensure it's an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse bridge logs", e);
      return [];
    }
  }

  clearLogs() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(BRIDGE_LOG_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('tfc-bridge-logs-cleared'));
  }
}

export const globalBridgeLogger = new BridgeLogger();
