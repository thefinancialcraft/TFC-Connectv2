import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SmartfloCredentials {
  integrationId: string;
  integrationName: string;
  validationUrl: string;
  apiKey: string;
  companyCode: string | null;
}

type SetupPhase = 'idle' | 'loading' | 'ready' | 'connecting' | 'waiting' | 'connected' | 'expired' | 'error';

interface SmartfloIntegrationCardProps {
  organizationId?: string | null;
}

async function authorizedSmartfloFetch(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Please sign in again to manage Smartflo.');

  return fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
}

async function requestSmartfloCredentials(integrationId: string): Promise<SmartfloCredentials> {
  const response = await authorizedSmartfloFetch(`/api/smartflo/setup?integrationId=${encodeURIComponent(integrationId)}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to load Smartflo credentials.');
  return result as SmartfloCredentials;
}

export default function SmartfloIntegrationCard({ organizationId }: SmartfloIntegrationCardProps) {
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [phase, setPhase] = useState<SetupPhase>('idle');
  const [integrationId, setIntegrationId] = useState('');
  const [credentials, setCredentials] = useState<SmartfloCredentials | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const [errorMessage, setErrorMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const fetchCredentials = async (id: string) => {
    setCredentials(await requestSmartfloCredentials(id));
  };

  const openSetup = async (existingIntegrationId?: string, pendingCreatedAt?: string) => {
    const id = existingIntegrationId || crypto.randomUUID();
    setIntegrationId(id);
    setCreatedAt(pendingCreatedAt || null);
    setCredentials(null);
    setErrorMessage('');
    setModalOpen(true);
    setPhase('loading');

    try {
      await fetchCredentials(id);
      if (pendingCreatedAt) {
        const deadline = new Date(pendingCreatedAt).getTime() + 120_000;
        setRemainingSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
        setPending(true);
        setPhase('waiting');
      } else {
        setPhase('ready');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load Smartflo credentials.');
      setPhase('error');
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadStatus = async () => {
      if (!organizationId) {
        setCheckingStatus(false);
        return;
      }

      try {
        const response = await authorizedSmartfloFetch('/api/smartflo/status');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to check Smartflo status.');
        if (cancelled) return;

        setEnabled(result.enabled === true && result.status === 'active');
        if (result.integrationId) setIntegrationId(result.integrationId);
        if (result.status === 'pending' && result.integrationId && result.createdAt) {
          setPending(true);
          setCreatedAt(result.createdAt);
          setModalOpen(true);
          setPhase('loading');
          try {
            setCredentials(await requestSmartfloCredentials(result.integrationId));
            const deadline = new Date(result.createdAt).getTime() + 120_000;
            setRemainingSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
            setPhase('waiting');
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Unable to load Smartflo credentials.');
            setPhase('error');
          }
        } else {
          setPending(false);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to check Smartflo status.');
        }
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    };

    void loadStatus();
    return () => { cancelled = true; };
  }, [organizationId]);

  useEffect(() => {
    if (!modalOpen || phase !== 'waiting' || !createdAt || !integrationId) return;

    let stopped = false;
    let expiryCheckStarted = false;
    const deadline = new Date(createdAt).getTime() + 120_000;

    const pollStatus = async () => {
      try {
        const response = await authorizedSmartfloFetch('/api/smartflo/status');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to check Smartflo status.');
        if (stopped) return;
        setErrorMessage('');

        if (result.enabled === true && result.status === 'active' && result.integrationId === integrationId) {
          setEnabled(true);
          setPending(false);
          setCredentials(null);
          setPhase('connected');
          return;
        }

        if (result.status === 'expired' || result.integrationId !== integrationId) {
          setPending(false);
          setCredentials(null);
          setPhase('expired');
        }
      } catch (error) {
        if (!stopped) setErrorMessage(error instanceof Error ? error.message : 'Unable to check Smartflo status.');
      }
    };

    const countdownInterval = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(seconds);
      if (seconds === 0 && !expiryCheckStarted) {
        expiryCheckStarted = true;
        void pollStatus();
      }
    }, 1000);
    const pollingInterval = window.setInterval(() => { void pollStatus(); }, 10_000);

    return () => {
      stopped = true;
      window.clearInterval(countdownInterval);
      window.clearInterval(pollingInterval);
    };
  }, [createdAt, integrationId, modalOpen, phase]);

  const handleToggle = async () => {
    if (busy || checkingStatus || pending) return;
    if (!enabled) {
      await openSetup();
      return;
    }

    if (!window.confirm('Disconnect Smartflo for this organization?')) return;
    setBusy(true);
    try {
      const response = await authorizedSmartfloFetch('/api/smartflo/setup', {
        method: 'DELETE',
        body: JSON.stringify({ integrationId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to disconnect Smartflo.');
      setEnabled(false);
      setIntegrationId('');
      setCredentials(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to disconnect Smartflo.');
    } finally {
      setBusy(false);
    }
  };

  const handleConnect = async () => {
    if (!integrationId || busy) return;
    setBusy(true);
    setErrorMessage('');
    setPhase('connecting');
    try {
      const response = await authorizedSmartfloFetch('/api/smartflo/setup', {
        method: 'POST',
        body: JSON.stringify({ integrationId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to start Smartflo connection.');
      setCreatedAt(result.createdAt || new Date().toISOString());
      setRemainingSeconds(120);
      setPending(true);
      setPhase('waiting');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to start Smartflo connection.');
      setPhase('ready');
    } finally {
      setBusy(false);
    }
  };

  const closeModal = async () => {
    if (busy) return;
    if (integrationId && phase !== 'connected' && phase !== 'expired') {
      setBusy(true);
      try {
        const response = await authorizedSmartfloFetch('/api/smartflo/setup', {
          method: 'DELETE',
          body: JSON.stringify({ integrationId }),
        });
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Unable to cancel Smartflo setup.');
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to cancel Smartflo setup.');
        setBusy(false);
        return;
      }
      setPending(false);
      setBusy(false);
    }

    setModalOpen(false);
    setCredentials(null);
    setPhase('idle');
    setCreatedAt(null);
    if (phase !== 'connected') setIntegrationId('');
  };

  const copyValue = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(''), 1500);
    } catch {
      setErrorMessage('Clipboard access is unavailable. Select and copy the value instead.');
    }
  };

  const statusLabel = checkingStatus
    ? 'Checking…'
    : enabled
      ? 'Connected'
      : pending
        ? 'Waiting for authorization'
        : 'Disabled';

  return (
    <>
      <div className="w-full max-w-[320px] overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 bg-[#888888] px-4 py-3">
          <p className="text-sm font-bold text-white">Smartflo</p>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[#4b33e8]">
            <i className="fi fi-rr-phone-call text-lg" aria-hidden="true" />
          </div>
        </div>
        <p className="px-4 py-3 text-xs leading-relaxed text-gray-600">
          Smartflo call management integration
        </p>
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
          <span className={`text-xs font-semibold ${enabled ? 'text-[#1a8f5a]' : pending ? 'text-amber-600' : 'text-gray-500'}`}>
            {statusLabel}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={`${enabled ? 'Disable' : 'Enable'} Smartflo`}
            title={`${enabled ? 'Disable' : 'Enable'} Smartflo`}
            disabled={busy || checkingStatus || pending || !organizationId}
            onClick={() => void handleToggle()}
            className={`flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              enabled ? 'justify-end border-[#1a8f5a] bg-[#1a8f5a]' : 'justify-start border-gray-300 bg-gray-200'
            }`}
          >
            <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="smartflo-dialog-title"
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#4b33e8]">
                <i className="fi fi-rr-phone-call text-lg" aria-hidden="true" />
              </div>
              <div>
                <h2 id="smartflo-dialog-title" className="text-base font-bold text-gray-900">Connect Smartflo</h2>
                <p className="text-xs text-gray-500">Rynxly CRM connector details</p>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              {phase === 'ready' && credentials && (
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                  {[
                    ['Integration ID', credentials.integrationId],
                    ['Integration Name', credentials.integrationName],
                    ['Validation URL', credentials.validationUrl],
                    ['API Key', credentials.apiKey],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start gap-3 px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[11px] font-semibold text-gray-500">{label}</p>
                        <code className="block break-all text-xs leading-relaxed text-gray-800">{value}</code>
                      </div>
                      <button
                        type="button"
                        onClick={() => void copyValue(label, value)}
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label={`Copy ${label}`}
                        title={copiedField === label ? 'Copied' : `Copy ${label}`}
                      >
                        <i className={`fi ${copiedField === label ? 'fi-rr-check' : 'fi-rr-copy'} text-sm`} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(phase === 'loading' || phase === 'connecting') && (
                <div className="flex flex-col items-center py-8 text-center">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#4b33e8] border-t-transparent" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-gray-700">
                    {phase === 'connecting' ? 'Creating secure connection…' : 'Preparing secure integration details…'}
                  </p>
                </div>
              )}

              {phase === 'waiting' && (
                <div className="flex flex-col items-center rounded-lg bg-gray-50 px-4 py-5 text-center" aria-live="polite">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#4b33e8] shadow-sm">
                    <span className="absolute inset-0 animate-ping rounded-full border border-[#4b33e8]/30" />
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#4b33e8] border-t-transparent" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">Waiting for Smartflo authorization</p>
                  <p className="mt-1 text-xs text-gray-500">Keep this window open while Smartflo verifies the connector.</p>
                  <p className="mt-3 font-mono text-sm font-semibold tabular-nums text-gray-700">
                    {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, '0')} remaining
                  </p>
                  <div
                    className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-200"
                    role="progressbar"
                    aria-label="Smartflo setup timeout"
                    aria-valuemin={0}
                    aria-valuemax={120}
                    aria-valuenow={120 - remainingSeconds}
                  >
                    <div
                      className="h-full rounded-full bg-[#4b33e8] transition-[width] duration-1000"
                      style={{ width: `${((120 - remainingSeconds) / 120) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {phase === 'connected' && (
                <div className="flex flex-col items-center rounded-lg bg-green-50 px-4 py-6 text-center">
                  <i className="fi fi-rr-check-circle text-2xl text-[#1a8f5a]" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-gray-900">Smartflo connected</p>
                </div>
              )}

              {phase === 'expired' && (
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
                  Setup expired. The pending integration was removed. Enable Smartflo to try again.
                </div>
              )}

              {(phase === 'error' || errorMessage) && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {errorMessage || 'Unable to prepare Smartflo integration.'}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
              {phase === 'connected' || phase === 'expired' ? (
                <button type="button" onClick={() => void closeModal()} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                  Done
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => void closeModal()}
                    disabled={busy}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {phase === 'waiting' || phase === 'connecting' ? 'Cancel setup' : 'Cancel'}
                  </button>
                  {phase === 'error' ? (
                    <button type="button" onClick={() => void fetchCredentials(integrationId).then(() => setPhase('ready')).catch((error) => setErrorMessage(error instanceof Error ? error.message : 'Unable to retry setup.'))} className="rounded-lg bg-[#4b33e8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d29cf]">
                      Retry
                    </button>
                  ) : (phase === 'ready' || phase === 'connecting') && (
                    <button
                      type="button"
                      onClick={() => void handleConnect()}
                      disabled={!credentials || (phase !== 'ready' && phase !== 'connecting') || busy}
                      className="rounded-lg bg-[#4b33e8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d29cf] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {phase === 'connecting' || busy ? 'Connecting…' : 'Connect'}
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}