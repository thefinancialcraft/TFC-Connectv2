import React, { useState, useEffect } from 'react';
import { SmartfloCallFlowState } from '@/lib/smartfloFlowEngine';
import { SmartfloSessionStore, SmartfloCallSession } from '@/lib/smartfloSessionStore';

interface SmartfloLiveCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowState: SmartfloCallFlowState;
  onRefresh?: () => void;
}

export const SmartfloLiveCallModal: React.FC<SmartfloLiveCallModalProps> = ({
  isOpen,
  onClose,
  flowState,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'raw'>('timeline');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [session, setSession] = useState<SmartfloCallSession | null>(null);

  const activeKey = flowState.callId || flowState.refId;

  // Load session from store and subscribe to real-time session updates
  useEffect(() => {
    if (!isOpen) return;

    const loadSession = () => {
      if (activeKey) {
        const found = SmartfloSessionStore.findSession({ targetKey: activeKey });
        if (found) {
          setSession(found);
          return;
        }
      }
      const active = SmartfloSessionStore.getActiveSession();
      setSession(active);
    };

    loadSession();

    const handleSessionUpdate = (e: any) => {
      const updated = e.detail as SmartfloCallSession | null;
      if (updated) {
        if (!activeKey || updated.id === activeKey || updated.call_id === activeKey || updated.ref_id === activeKey) {
          setSession(updated);
        }
      }
    };

    window.addEventListener('smartflo:session_updated', handleSessionUpdate);
    return () => {
      window.removeEventListener('smartflo:session_updated', handleSessionUpdate);
    };
  }, [isOpen, activeKey]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rawPayload = flowState.rawPayload || session?.rawPayload || {};
  const timeline = session?.timeline && session.timeline.length > 0 ? session.timeline : [];

  const isInbound = flowState.direction === 'inbound';
  const isLive = flowState.isLive;
  const isEnded = flowState.isEnded;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <i className="fi flex fi-rr-pulse text-lg animate-pulse"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Smartflo Live Call Diagnostics</h3>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    isInbound
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                  }`}
                >
                  {isInbound ? 'Inbound (DID)' : 'Outbound (C2C)'}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1.5 border ${
                    isEnded
                      ? 'bg-slate-700 text-slate-300 border-slate-600'
                      : isLive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isEnded ? 'bg-slate-400' : isLive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                    }`}
                  />
                  {isEnded ? 'Ended' : isLive ? 'Live On Switch' : 'Ringing / Bridging'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time Smartflo Telemetry, API Call Trace &amp; Event Stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                title="Refresh Live API State"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-sm border border-slate-700 flex items-center gap-1.5"
              >
                <i className="fi flex fi-rr-refresh"></i>
                <span className="text-xs hidden sm:inline font-medium">Refresh</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all text-sm border border-slate-700"
            >
              <i className="fi flex fi-rr-cross text-xs"></i>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-3 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Call ID</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[140px]" title={flowState.callId || 'Pending...'}>
                {flowState.callId || 'Pending...'}
              </span>
              {flowState.callId && (
                <button
                  onClick={() => copyToClipboard(flowState.callId || '', 'call_id')}
                  className="text-slate-400 hover:text-indigo-600 transition-colors text-[11px]"
                  title="Copy Call ID"
                >
                  <i className={`fi flex ${copiedKey === 'call_id' ? 'fi-rr-check text-emerald-500' : 'fi-rr-copy'}`}></i>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Reference / Ref ID</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[140px]" title={flowState.refId || 'N/A'}>
                {flowState.refId || 'N/A'}
              </span>
              {flowState.refId && (
                <button
                  onClick={() => copyToClipboard(flowState.refId || '', 'ref_id')}
                  className="text-slate-400 hover:text-indigo-600 transition-colors text-[11px]"
                  title="Copy Ref ID"
                >
                  <i className={`fi flex ${copiedKey === 'ref_id' ? 'fi-rr-check text-emerald-500' : 'fi-rr-copy'}`}></i>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Stage</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize mt-0.5">
              {isInbound
                ? `${flowState.steps.step2.sublabel} / ${flowState.steps.step3.sublabel}`
                : `${flowState.steps.step2.sublabel} ➔ ${flowState.steps.step3.sublabel}`}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Duration</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {flowState.duration}s
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <i className="fi flex fi-rr-time-past"></i>
            Realtime Timeline ({timeline.length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <i className="fi flex fi-rr-info"></i>
            Telemetry &amp; Call Legs
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'raw'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <i className="fi flex fi-rr-code-simple"></i>
            Raw Live API Payload (A-Z)
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar">
          {/* TAB 1: Realtime Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  <i className="fi flex fi-rr-hourglass-end text-3xl mb-2 text-slate-300"></i>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Awaiting switch timeline events...
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Realtime state changes are recorded automatically.
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100 dark:before:bg-indigo-950">
                  {timeline.map((item, idx) => {
                    const isLatest = idx === timeline.length - 1;
                    return (
                      <div key={item.idx || idx} className="relative mb-6 last:mb-0">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                            isLatest && isLive
                              ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950'
                              : 'bg-indigo-600 ring-2 ring-indigo-100 dark:ring-indigo-950'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>

                        {/* Event Card */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              {item.stage.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {item.message}
                          </p>
                          {item.data && (
                            <details className="mt-2 text-[11px]">
                              <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline select-none">
                                View Switch Event Payload
                              </summary>
                              <pre className="mt-2 p-3 bg-slate-900 text-emerald-400 rounded-lg overflow-x-auto text-[10px] font-mono border border-slate-800">
                                {JSON.stringify(item.data, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Telemetry & Call Legs */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stepper Status Overview */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Flow Stepper Status
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Step 1 (Originated)</span>
                    <span className="text-xs font-bold text-emerald-600">{flowState.steps.step1.sublabel}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Step 2 ({isInbound ? 'Customer' : 'Agent Leg'})
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {flowState.steps.step2.sublabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Step 3 ({isInbound ? 'Agent Leg' : 'Customer'})
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {flowState.steps.step3.sublabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Step 4 (Hangup)</span>
                    <span className="text-xs font-bold text-indigo-600">{flowState.steps.step4.sublabel}</span>
                  </div>
                </div>
              </div>

              {/* Raw Switch Metadata */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Switch Call Metadata
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-slate-500">Agent Extension / CLI:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                      {rawPayload.agent_number || rawPayload.caller_id || rawPayload.agent_id || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-slate-500">Destination Number:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                      {rawPayload.destination || rawPayload.customer_number || rawPayload.call_to_number || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-slate-500">Switch State:</span>
                    <span className="font-bold text-indigo-600">
                      {rawPayload.state || rawPayload.status || rawPayload.call_status || (isLive ? 'Active' : 'Standby')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-slate-500">Hangup Cause:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {rawPayload.hangup_cause || rawPayload.hangup_cause_description || 'Active Call'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Raw Live API Payload (A-to-Z JSON) */}
          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Full Tata Smartflo API &amp; Webhook Payload
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(rawPayload, null, 2), 'raw_json')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <i className={`fi flex ${copiedKey === 'raw_json' ? 'fi-rr-check' : 'fi-rr-copy'}`}></i>
                  {copiedKey === 'raw_json' ? 'Copied!' : 'Copy Full JSON'}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
                <pre className="p-4 text-emerald-400 text-xs font-mono overflow-x-auto max-h-[420px] custom-scrollbar">
                  {Object.keys(rawPayload).length > 0
                    ? JSON.stringify(rawPayload, null, 2)
                    : JSON.stringify(
                        {
                          status: flowState.isEnded ? 'Call Ended' : 'Awaiting Switch Events',
                          message: flowState.isEnded
                            ? 'Call completed. Final CDR / webhook events recorded.'
                            : 'No raw switch payload captured yet. Polling /v1/live_calls in real-time...',
                          flowState,
                        },
                        null,
                        2
                      )}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <i className="fi flex fi-rr-shield-check text-emerald-500"></i>
            Connected to Tata Smartflo Telephony API Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartfloLiveCallModal;
