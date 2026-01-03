import React, { useState, useEffect } from 'react';
import { useAuthGuard } from '../../hooks/useAuthGuard';

interface BridgeMessage {
  id: string;
  direction: 'in' | 'out';
  type: string;
  payload: any;
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

import { sendToFlutter } from '../../lib/bridgeUtils';

export default function FlutterBridgeTab() {
  const [messages, setMessages] = useState<BridgeMessage[]>([]);
  const [testType, setTestType] = useState('test_event');
  const [testValue, setTestValue] = useState('');
  const [isBridgeActive, setIsBridgeActive] = useState(false);

  // Sync User Info Hook
  const { user } = useAuthGuard();

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('flutter_bridge_logs');
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages).map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp) // Revive dates
          }));
          setMessages(parsed);
        } catch (e) {
          console.error("Failed to load bridge logs", e);
        }
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flutter_bridge_logs', JSON.stringify(messages));
    }
  }, [messages]);

  // Helper to add message to log
  const addMessage = (direction: 'in' | 'out', type: string, payload: any) => {
    setMessages(prev => {
      const newMessages = [{
        id: Math.random().toString(36).substr(2, 9),
        direction,
        type,
        payload,
        timestamp: new Date()
      }, ...prev];
      return newMessages;
    });
  };

  useEffect(() => {
    // Check if bridge exists
    if (typeof window !== 'undefined' && window.flutter_inappwebview) {
      setIsBridgeActive(true);
    }

    // Mount receiving handler
    window.fromFlutter = (data: any) => {
      console.log("🔔 [Web] Received from Flutter:", data);
      
      // Parse payload based on expected Dart structure: {'type': type, 'value': value}
      const type = data?.type || 'unknown';
      const value = data?.value;
      
      addMessage('in', type, value);
    };
  }, []);

  const sendToFlutterHandler = (type: string, value: any) => {
    sendToFlutter(type, value, 
      (logMsg: string) => {
         // This is a debug log from the utility
         console.log(logMsg);
      },
      (statusUpdate: any) => {
        if (statusUpdate.status === 'error') {
          addMessage('out', type, { ...value, error: statusUpdate.error });
        } else {
          // Success is assumed, we already optimistic added the message locally usually
          // or we can add it here if we prefer strictly after success
        }
      }
    );
    // Optimistic log
    addMessage('out', type, value);
  };

  const handleSendToFlutter = () => {
    sendToFlutterHandler(testType, testValue);
  };

  const clearLogs = () => {
    setMessages([]);
    localStorage.removeItem('flutter_bridge_logs');
  };

  const syncUserInfoToFlutter = () => {
    if (!user) {
      addMessage('out', 'sync_user_info_error', 'No user data available to sync');
      return;
    }

    const userInfoPayload = {
      user_name: user.displayName,
      employee_id: user.employeeId,
      email: user.email,
      role: user.role,
      designation: user.role, 
      department: null,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      profilePicUrl: user.profilePicUrl
    };

    sendToFlutterHandler('sync_user_info', userInfoPayload);
  };

  const openDevMode = () => {
    sendToFlutterHandler('isdevmode_open', true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-4 sm:p-6" style={{ borderColor: "#E0E0E0" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
            Flutter Bridge Debugger
          </h3>
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${isBridgeActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs text-gray-500 font-medium">
              {isBridgeActive ? 'Bridge Active' : 'Bridge Not Detected'}
            </span>
          </div>
        </div>

        {/* Test Sender */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
           <h4 className="text-sm font-bold text-gray-700 mb-3">Send Message to Flutter</h4>
           <div className="flex flex-col sm:flex-row gap-3">
             <div className="flex-1">
               <input 
                  type="text" 
                  placeholder="Type (e.g. user_id)"
                  className="w-full px-3 text-gray-700 py-2 border rounded-md text-sm focus:outline-none focus:border-[#4b33e8]"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
               />
             </div>
             <div className="flex-[2]">
               <input 
                  type="text" 
                  placeholder="Value (e.g. 12345)"
                  className="w-full px-3 text-gray-700 py-2 border rounded-md text-sm focus:outline-none focus:border-[#4b33e8]"
                  value={testValue}
                  onChange={(e) => setTestValue(e.target.value)}
               />
             </div>
             <button 
                onClick={handleSendToFlutter}
                className="px-4 py-2 bg-[#4b33e8] text-white rounded-md text-sm font-medium hover:bg-[#3b25b8] transition-colors"
             >
                Send
             </button>
           </div>
        </div>

        
        {/* Sync Actions */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
           <h4 className="text-sm font-bold text-blue-900 mb-3">Sync Actions</h4>
           <div className="flex gap-3">
             <button 
                onClick={syncUserInfoToFlutter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Sync User Info to Flutter
             </button>

             <button 
                onClick={openDevMode}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                Open Dev Mode
             </button>
           </div>
        </div>

        {/* Console Log */}
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#E0E0E0" }}>
           <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Communication Log</span>
              <button onClick={clearLogs} className="text-xs text-[#4b33e8] hover:underline">Clear</button>
           </div>
           <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-[#f8f9fa] font-mono text-xs">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 italic py-10">No messages logged yet...</div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] rounded-lg p-3 border ${
                     msg.direction === 'out' 
                       ? 'bg-blue-50 border-blue-100 text-blue-900' 
                       : 'bg-green-50 border-green-100 text-green-900'
                   }`}>
                      <div className="flex items-center gap-2 mb-1 border-b border-black/5 pb-1">
                        <span className="font-bold uppercase text-[10px] opacity-70">
                          {msg.direction === 'out' ? '📤 To Flutter' : '📥 From Flutter'}
                        </span>
                        <span className="text-[10px] opacity-50 ml-auto">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="font-bold text-black/60 mr-2">Type:</span> 
                        <span className="font-bold">{msg.type}</span>
                      </div>
                      <div className="break-all whitespace-pre-wrap">
                        <span className="font-bold text-black/60 mr-2">Value:</span>
                        {typeof msg.payload === 'object' ? JSON.stringify(msg.payload, null, 2) : String(msg.payload)}
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

