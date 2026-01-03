import React, { useState, useEffect } from 'react';

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

  // Helper to add message to log
  const addMessage = (direction: 'in' | 'out', type: string, payload: any) => {
    setMessages(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      direction,
      type,
      payload,
      timestamp: new Date()
    }, ...prev]);
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

    // Cleanup not strictly necessary for window globals, but good practice if we want to remove hook
    return () => {
      // We often keep it attached so we don't miss messages if component unmounts/remounts quickly
      // or we can allow it to be overwritten on remount.
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
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:border-[#4b33e8]"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
               />
             </div>
             <div className="flex-[2]">
               <input 
                  type="text" 
                  placeholder="Value (e.g. 12345)"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:border-[#4b33e8]"
                  value={testValue}
                  onChange={(e) => setTestValue(e.target.value)}
               />
             </div>
             <button 
                onClick={sendToFlutter}
                className="px-4 py-2 bg-[#4b33e8] text-white rounded-md text-sm font-medium hover:bg-[#3b25b8] transition-colors"
             >
                Send
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

