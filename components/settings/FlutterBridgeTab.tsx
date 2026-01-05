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

export default function FlutterBridgeTab() {
  const [messages, setMessages] = useState<BridgeMessage[]>([]);
  const [testType, setTestType] = useState('test_event');
  const [testValue, setTestValue] = useState('');
  const [isBridgeActive, setIsBridgeActive] = useState(false);

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

  const sendToFlutter = () => {
    const payload = { type: testType, value: testValue };
    
    if (window.flutter_inappwebview?.callHandler) {
      console.log("📤 [Web] Sending to Flutter:", payload);
      window.flutter_inappwebview.callHandler('fromWebApp', payload);
      addMessage('out', testType, testValue);
    } else {
      console.warn("⚠️ Flutter InAppWebView not detected.");
      addMessage('out', testType, { ...payload, error: 'Bridge not detected' });
    }
  };

  const clearLogs = () => {
    setMessages([]);
    localStorage.removeItem('flutter_bridge_logs');
  };

  // Sync User Info Hook
  const { user } = useAuthGuard();

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
      designation: user.role, // Mapping role to designation as designation is not explicit
      department: null, // Schema does not currently have department
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      profilePicUrl: user.profilePicUrl
    };

    const messagePayload = {
      type: 'sync_user_info',
      value: userInfoPayload
    };

    if (window.flutter_inappwebview?.callHandler) {
      console.log("📤 [Web] Syncing User Info to Flutter:", messagePayload);
      window.flutter_inappwebview.callHandler('fromWebApp', messagePayload);
      addMessage('out', 'sync_user_info', userInfoPayload);
    } else {
      console.warn("⚠️ Flutter InAppWebView not detected.");
      addMessage('out', 'sync_user_info', { ...userInfoPayload, error: 'Bridge not detected' });
    }
  };

  const openDevMode = () => {
    if (window.flutter_inappwebview?.callHandler) {
      console.log("📤 [Web] Opening Dev Mode");
      const payload = { type: 'isdevmode_open', value: true };
      window.flutter_inappwebview.callHandler('fromWebApp', payload);
      addMessage('out', 'isdevmode_open', true);
    } else {
       console.warn("⚠️ Flutter InAppWebView not detected.");
       addMessage('out', 'isDevMode_open', { error: 'Bridge not detected' });
    }
  };

  const sendLoginEvent = () => {
    if (window.flutter_inappwebview?.callHandler) {
      console.log("📤 [Web] Sending Manual Login Event");
      window.flutter_inappwebview.callHandler('fromWebApp', { type: 'login', value: true });
      addMessage('out', 'login', true);
    } else {
      addMessage('out', 'login', { error: 'Bridge not detected' });
    }
  };

  const sendLogoutEvent = () => {
    if (window.flutter_inappwebview?.callHandler) {
      console.log("📤 [Web] Sending Manual Logout Event");
      window.flutter_inappwebview.callHandler('fromWebApp', { type: 'logout', value: true });
      addMessage('out', 'logout', true);
    } else {
      addMessage('out', 'logout', { error: 'Bridge not detected' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden" style={{ borderColor: "#E0E0E0" }}>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4b33e8]/10 flex items-center justify-center text-[#4b33e8]">
                <i className="fi fi-rr-data-transfer text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Bridge Debugger
                </h3>
                <p className="text-xs text-[#787E9D]">Monitor web-to-app communication</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isBridgeActive 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              <span className={`h-2 w-2 rounded-full animate-pulse ${isBridgeActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              {isBridgeActive ? 'Bridge Active' : 'Native Bridge Missing'}
            </div>
          </div>

          {/* Test Sender */}
          <div className="bg-gray-50/50 p-5 rounded-2xl mb-8 border border-gray-100">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <i className="fi fi-rr-paper-plane text-[10px]" />
               Send Message to Flutter
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
               <div className="md:col-span-1">
                 <input 
                    type="text" 
                    placeholder="Event Type"
                    className="w-full h-11 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4b33e8]/20 outline-none transition-all"
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                 />
               </div>
               <div className="md:col-span-2">
                 <input 
                    type="text" 
                    placeholder="Payload Value"
                    className="w-full h-11 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4b33e8]/20 outline-none transition-all"
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value)}
                 />
               </div>
               <button 
                  onClick={sendToFlutter}
                  className="h-11 px-6 bg-[#4b33e8] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#4b33e8]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                  <i className="fi fi-rr-paper-plane-top flex" />
                  Send
               </button>
             </div>
          </div>

          
          {/* Action Buttons Grid */}
          <div className="mb-8">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <i className="fi fi-rr-bolt text-[10px]" />
               Quick Actions
             </h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
               <button 
                  onClick={syncUserInfoToFlutter}
                  className="px-4 py-3 bg-white border border-gray-100 text-[#4b33e8] rounded-xl text-xs font-bold hover:border-[#4b33e8] hover:bg-gray-50 transition-all flex items-center gap-3 group"
               >
                  <div className="w-8 h-8 rounded-lg bg-[#4b33e8]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fi fi-rr-refresh flex" />
                  </div>
                  Sync User Info
               </button>

               <button 
                  onClick={openDevMode}
                  className="px-4 py-3 bg-white border border-gray-100 text-indigo-600 rounded-xl text-xs font-bold hover:border-indigo-600 hover:bg-gray-50 transition-all flex items-center gap-3 group"
               >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fi fi-rr-code-compare flex" />
                  </div>
                  Toggle Dev Mode
               </button>

               <button 
                  onClick={sendLoginEvent}
                  className="px-4 py-3 bg-white border border-gray-100 text-emerald-600 rounded-xl text-xs font-bold hover:border-emerald-600 hover:bg-gray-50 transition-all flex items-center gap-3 group"
               >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fi fi-rr-sign-in-alt flex" />
                  </div>
                  Manual Login
               </button>

               <button 
                  onClick={sendLogoutEvent}
                  className="px-4 py-3 bg-white border border-gray-100 text-rose-600 rounded-xl text-xs font-bold hover:border-rose-600 hover:bg-gray-50 transition-all flex items-center gap-3 group"
               >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fi fi-rr-sign-out-alt flex" />
                  </div>
                  Manual Logout
               </button>
             </div>
          </div>

          {/* Console Log */}
          <div className="border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm">
             <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Communication Log</span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold">{messages.length}</span>
                </div>
                <button 
                  onClick={clearLogs} 
                  className="text-[10px] font-bold text-[#4b33e8] hover:underline flex items-center gap-1"
                >
                  <i className="fi fi-rr-trash text-[10px]" />
                  Clear Logs
                </button>
             </div>
             
             <div className="h-[450px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 py-10">
                    <i className="fi fi-rr-layer-group text-4xl mb-4" />
                    <p className="text-sm font-medium italic">Waiting for communications...</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.direction === 'out' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-top-1`}>
                       <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm border transition-all ${
                         msg.direction === 'out' 
                           ? 'bg-white border-[#4b33e8]/10 text-gray-700' 
                           : 'bg-[#4b33e8] border-[#4b33e8] text-white'
                       }`}>
                          <div className={`flex items-center gap-3 mb-3 pb-2 border-b ${
                            msg.direction === 'out' ? 'border-gray-100' : 'border-white/10'
                          }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                              msg.direction === 'out' ? 'bg-[#4b33e8]/10 text-[#4b33e8]' : 'bg-white/20 text-white'
                            }`}>
                              <i className={`fi ${msg.direction === 'out' ? 'fi-rr-arrow-up' : 'fi-rr-arrow-down'} flex`} />
                            </div>
                            <span className="font-black uppercase text-[10px] tracking-wider opacity-80">
                              {msg.direction === 'out' ? 'Sent to Native' : 'Received from Native'}
                            </span>
                            <span className="text-[10px] font-bold opacity-60 ml-auto">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase ${msg.direction === 'out' ? 'text-gray-400' : 'text-white/60'}`}>Type</span>
                              <span className="text-xs font-black tracking-wide">{msg.type}</span>
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                              <span className={`text-[10px] font-bold uppercase ${msg.direction === 'out' ? 'text-gray-400' : 'text-white/60'}`}>Payload</span>
                              <div className={`p-3 rounded-xl font-mono text-[11px] overflow-x-auto break-all whitespace-pre-wrap ${
                                msg.direction === 'out' ? 'bg-gray-50 text-gray-600' : 'bg-white/10 text-white'
                              }`}>
                                {typeof msg.payload === 'object' ? JSON.stringify(msg.payload, null, 2) : String(msg.payload)}
                              </div>
                            </div>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
