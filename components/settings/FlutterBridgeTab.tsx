import React, { useState, useEffect } from 'react';
import { useAuthGuard } from '../../hooks/useAuthGuard';

interface BridgeMessage {
  id: string;
  direction: 'in' | 'out';
  event: string;
  value: any;
  timestamp: Date;
}

declare global {
  interface Window {
    fromFlutter?: (data: any) => void;
    flutter_inappwebview?: {
      callHandler: (handlerName: string, ...args: any[]) => Promise<any>;
    };
  }
}

export default function FlutterBridgeTab() {
  const [messages, setMessages] = useState<BridgeMessage[]>([]);
  const [testEvent, setTestEvent] = useState('test_event');
  const [testValue, setTestValue] = useState('');
  const [isBridgeActive, setIsBridgeActive] = useState(false);

  // ===============================
  // 🔁 LOAD / SAVE LOGS
  // ===============================

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('flutter_bridge_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to load bridge logs', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flutter_bridge_logs', JSON.stringify(messages));
    }
  }, [messages]);

  // ===============================
  // 🧾 LOG HELPER
  // ===============================

  const addMessage = (direction: 'in' | 'out', event: string, value: any) => {
    setMessages(prev => [
      {
        id: Math.random().toString(36).slice(2, 10),
        direction,
        event,
        value,
        timestamp: new Date(),
      },
      ...prev,
    ]);
  };

  // ===============================
  // 📥 FLUTTER → WEB
  // ===============================

  useEffect(() => {
    if (window.flutter_inappwebview) {
      setIsBridgeActive(true);
    }

    window.fromFlutter = (data: any) => {
      const event = data?.event || 'unknown';
      const value = data?.value;

      console.log('📥 [From Flutter]', event, value);
      addMessage('in', event, value);
    };
  }, []);

  // ===============================
  // 📤 WEB → FLUTTER (CORE)
  // ===============================

  const sendToFlutter = (event: string, value: any) => {
    const payload = { event, value };

    if (window.flutter_inappwebview?.callHandler) {
      console.log('📤 [To Flutter]', payload);
      window.flutter_inappwebview.callHandler('bridge', payload);
      addMessage('out', event, value);
    } else {
      addMessage('out', event, { error: 'Bridge not detected' });
    }
  };

  // ===============================
  // 🔘 ACTIONS
  // ===============================

  const { user } = useAuthGuard();

  const syncUserInfoToFlutter = () => {
    if (!user) {
      addMessage('out', 'sync_user_info_error', 'No user available');
      return;
    }

    sendToFlutter('sync_user_info', {
      user_name: user.displayName,
      employee_id: user.employeeId,
      email: user.email,
      role: user.role,
      designation: user.role,
      department: null,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      profilePicUrl: user.profilePicUrl,
    });
  };

  const openDevMode = () => {
    sendToFlutter('open_dev_mode', true);
  };

  const clearLogs = () => {
    setMessages([]);
    localStorage.removeItem('flutter_bridge_logs');
  };

  // ===============================
  // 🖥️ UI
  // ===============================

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Flutter Bridge Debugger
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                isBridgeActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-gray-500">
              {isBridgeActive ? 'Bridge Active' : 'Bridge Not Detected'}
            </span>
          </div>
        </div>

        {/* Test Sender */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <h4 className="text-sm font-bold mb-3 text-gray-700">Send Message</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 px-3 py-2 border rounded text-sm text-gray-700"
              placeholder="Event"
              value={testEvent}
              onChange={e => setTestEvent(e.target.value)}
            />
            <input
              className="flex-[2] px-3 py-2 border rounded text-sm text-gray-700"
              placeholder="Value"
              value={testValue}
              onChange={e => setTestValue(e.target.value)}
            />
            <button
              onClick={() => sendToFlutter(testEvent, testValue)}
              className="px-4 py-2 bg-indigo-600 text-white rounded text-sm whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={syncUserInfoToFlutter}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm w-full sm:w-auto"
          >
            Sync User Info
          </button>
          <button
            onClick={openDevMode}
            className="px-4 py-2 bg-purple-600 text-white rounded text-sm w-full sm:w-auto"
          >
            Open Dev Mode
          </button>
        </div>

        {/* Logs */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 flex justify-between">
            <span className="text-xs font-bold">Communication Log</span>
            <button onClick={clearLogs} className="text-xs text-indigo-600">
              Clear
            </button>
          </div>

          <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-gray-50 text-xs font-mono">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                No messages yet…
              </div>
            )}

            {messages.map(m => (
              <div
                key={m.id}
                className={`flex ${
                  m.direction === 'out' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded p-3 border ${
                    m.direction === 'out'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-bold uppercase">
                      {m.direction === 'out' ? '📤 To Flutter' : '📥 From Flutter'}
                    </span>
                    <span>{m.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <b>Event:</b> {m.event}
                  </div>
                  <div className="whitespace-pre-wrap break-all">
                    <b>Value:</b>{' '}
                    {typeof m.value === 'object'
                      ? JSON.stringify(m.value, null, 2)
                      : String(m.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
