
/**
 * Global Logger System
 * Intercepts console logs and stores them in localStorage for debugging on mobile devices.
 */

const LOG_STORAGE_KEY = 'tfc_console_logs';
const MAX_LOGS = 500; // Keep last 500 logs to prevent storage bloat

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  category: string;
}

class Logger {
  private initialized = false;
  private originalConsole: any = {};

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    this.originalConsole = {
      log: console.log,
      info: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };

    const levels: LogEntry['level'][] = ['log', 'info', 'warn', 'error', 'debug'];

    levels.forEach(level => {
      (console as any)[level] = (...args: any[]) => {
        // Call original console
        this.originalConsole[level].apply(console, args);

        // Filter out Recharts noise that causes render-cycle state updates
        const message = args.join(' ');
        if (message.includes('width(-1)') || message.includes('height(-1)')) {
          return;
        }

        // Save to storage
        this.saveLog(level, args);
      };
    });


    this.initialized = true;
    console.log("🚀 [Logger] Persistant logging initialized.");
  }

  private saveLog(level: LogEntry['level'], args: any[]) {
    try {
      const message = args
        .map(arg => {
          if (typeof arg === 'object') {
            try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
          }
          return String(arg);
        })
        .join(' ');

      const newEntry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        level,
        message,
        category: window.location.pathname
      };

      const existingLogs = this.getLogs();
      const updatedLogs = [newEntry, ...existingLogs].slice(0, MAX_LOGS);
      
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
      
      // Trigger a custom event so the UI can update in real-time if open
      window.dispatchEvent(new CustomEvent('tfc-new-log', { detail: newEntry }));
    } catch (e) {
      // Avoid infinite loop if saving fails
      this.originalConsole.error("Failed to save log to localStorage", e);
    }
  }

  getLogs(): LogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const logs = localStorage.getItem(LOG_STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      return [];
    }
  }

  clearLogs() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOG_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('tfc-logs-cleared'));
  }
}

export const globalLogger = new Logger();
