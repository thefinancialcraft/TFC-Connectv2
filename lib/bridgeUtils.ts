
// Helper types
export interface BridgePayload {
  type: string;
  value: any;
}

export type LogCallback = (message: string) => void;

// Message status tracking for UI feedback
export type MessageStatus = 'pending' | 'success' | 'error';
export interface MessageStatusUpdate {
  status: MessageStatus;
  error?: any;
}

// Global window extensions for diverse bridge methods
declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, ...args: any[]) => Promise<any>;
    };
    chrome?: {
      webview?: {
        postMessage: (message: any) => void;
      };
    };
    webkit?: {
      messageHandlers?: {
        fromWebApp?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

/**
 * Universal Bridge Sender
 * Tries multiple methods to communicate with the native wrapper (Flutter, etc.)
 */
export function sendToFlutter(
  type: string, 
  value: any, 
  onLog?: LogCallback,
  onStatusUpdate?: (update: MessageStatusUpdate) => void
) {
  const payload: BridgePayload = { type, value };
  let bridgeMethod = 'unknown';

  try {
    console.log("📤 App sending to Flutter:", payload);
    if (onLog) onLog(`🛰️ sendToFlutter called with payload: ${JSON.stringify(payload)}`);

    // Signal start
    // In a real app we might return a promise, but sticking to the fire-and-forget pattern with callbacks for now as requested

    // 1. Try Flutter InAppWebView (Primary Target) -> Handler: 'bridge'
    if (window.flutter_inappwebview && typeof window.flutter_inappwebview.callHandler === 'function') {
      bridgeMethod = 'InAppWebView';
      
      // We are using 'bridge' as the handler name as requested by the user
      window.flutter_inappwebview.callHandler("bridge", payload)
        .then((res: any) => {
          const resStr = typeof res === 'object' ? JSON.stringify(res) : String(res);
          if (onLog) onLog(`📤 Sent to Flutter (InAppWebView): ${type} - Response: ${resStr}`);
          if (onStatusUpdate) onStatusUpdate({ status: 'success' });
        })
        .catch((err: any) => {
          const errStr = typeof err === 'object' ? JSON.stringify(err) : String(err);
          if (onLog) onLog(`❌ Error sending to Flutter (InAppWebView): ${errStr}`);
          if (onStatusUpdate) onStatusUpdate({ status: 'error', error: err });
        });
      return;
    }

    // 2. Try WebView2 (Edge/Windows) fallback
    if (window.chrome?.webview && typeof window.chrome.webview.postMessage === 'function') {
      bridgeMethod = 'WebView2';
      window.chrome.webview.postMessage(payload);
      if (onLog) onLog(`📤 Sent to Flutter (WebView2): ${type}`);
      if (onStatusUpdate) onStatusUpdate({ status: 'success' }); // Async nature assumes success if no immediate crash
      return;
    }

    // 3. Try iOS WKWebView message handler
    if (window.webkit?.messageHandlers?.fromWebApp && typeof window.webkit.messageHandlers.fromWebApp.postMessage === 'function') {
      bridgeMethod = 'WKWebView';
      window.webkit.messageHandlers.fromWebApp.postMessage(payload);
      if (onLog) onLog(`📤 Sent to Flutter (WKWebView): ${type}`);
      if (onStatusUpdate) onStatusUpdate({ status: 'success' });
      return;
    }

    // 4. Parent window fallback (for iframes)
    if (window.parent && window.parent !== window && typeof window.parent.postMessage === 'function') {
      bridgeMethod = 'ParentWindow';
      window.parent.postMessage(payload, '*');
      if (onLog) onLog(`📤 Sent to parent window: ${type}`);
      if (onStatusUpdate) onStatusUpdate({ status: 'success' });
      return;
    }

    // If we get here, no bridge was found
    if (onLog) onLog("❌ Flutter bridge not available - all methods failed");
    console.warn("Debug info:", {
      hasFlutterInApp: !!window.flutter_inappwebview,
      hasWebView2: !!(window.chrome && window.chrome.webview),
      hasWKWebView: !!(window.webkit && window.webkit.messageHandlers),
      hasParent: !!(window.parent && window.parent !== window)
    });
    
    if (onStatusUpdate) onStatusUpdate({ status: 'error', error: 'No bridge available' });

  } catch (err: any) {
    console.error('❌ sendToFlutter error:', err);
    if (onLog) onLog(`❌ Exception in sendToFlutter: ${err.message}`);
    if (onStatusUpdate) onStatusUpdate({ status: 'error', error: err.message });
  }
}
