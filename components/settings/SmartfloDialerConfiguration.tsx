import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileCode,
  Fingerprint,
  Headset,
  Info,
  KeyRound,
  LoaderCircle,
  Phone,
  PhoneCall,
  Radio,
  RefreshCw,
  Settings,
  Timer,
  Trash2,
  Webhook,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SMARTFLO_EXPIRY_DAYS, normalizeExpiryDays } from '@/lib/smartfloUi';

interface ConfigurationSectionProps {
  title: string;
  description: string;
  fields?: string[];
  children?: ReactNode;
}

function ConfigurationSection({ title, description, fields = [], children }: ConfigurationSectionProps) {
  return (
    <section className="min-w-0 border-t border-gray-200 py-5 first:border-t-0 first:pt-0 last:pb-0">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#263238]">{title}</h2>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
          Not configured
        </span>
      </div>

      {children}

      {fields.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label key={field} className="block min-w-0 space-y-1.5">
              <span className="text-xs font-semibold text-gray-700">{field}</span>
              <input
                disabled
                placeholder="Not configured"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 placeholder:text-gray-400"
              />
            </label>
          ))}
        </div>
      )}
    </section>
  );
}

interface ParameterDropdownProps {
  name: string;
  options: string[];
  icon: LucideIcon;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}

interface SmartfloAgentOption {
  agentId: string;
  userId: string | null;
  agentName: string | null;
  loginId: string | null;
  extension: string | null;
  intercom: string | null;
  followMeNumber: string | null;
  callerId: string | null;
  isActive: boolean;
}

interface CrmUserOption {
  userId: string;
  userName: string | null;
  employeeId: string | null;
  email: string | null;
}

type RequestParameters = Record<string, string | string[] | null>;

interface CheckboxMultiSelectProps {
  name: string;
  options: { value: string; label: string; detail: string }[];
  selectedValues: string[];
  icon: LucideIcon;
  disabled: boolean;
  onChange: (values: string[]) => void;
}

function CheckboxMultiSelect({ name, options, selectedValues, icon: Icon, disabled, onChange }: CheckboxMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-0 space-y-1.5">
      <span className="block text-xs font-semibold text-gray-700">{name}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">
          {selectedValues.length ? `${selectedValues.length} selected` : `Select ${name}`}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && !disabled && (
        <div role="listbox" aria-label={name} aria-multiselectable="true" className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-500">No Smartflo users available.</p>
          ) : (
            <>
              <label role="option" aria-selected={options.every((option) => selectedValues.includes(option.value))} className="flex cursor-pointer items-center gap-2 rounded border-b border-gray-100 px-2.5 py-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={options.every((option) => selectedValues.includes(option.value))}
                  onChange={(event) => onChange(event.target.checked ? options.map((option) => option.value) : [])}
                  className="peer sr-only"
                />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-white peer-checked:border-[#4b33e8] peer-checked:bg-[#4b33e8] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4b33e8]/30">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-gray-800">All agents</span>
              </label>
              {options.map((option) => {
            const checked = selectedValues.includes(option.value);
            return (
              <label key={option.value} role="option" aria-selected={checked} className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    onChange(event.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((value) => value !== option.value));
                  }}
                  className="peer sr-only"
                />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-white peer-checked:border-[#4b33e8] peer-checked:bg-[#4b33e8] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4b33e8]/30">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-gray-800">{option.label}</span>
                  <span className="block truncate text-[11px] text-gray-500">{option.detail}</span>
                </span>
              </label>
            );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface CrmUserMappingDropdownProps {
  users: CrmUserOption[];
  value: string | null;
  disabled: boolean;
  onChange: (userId: string | null) => void;
}

function CrmUserMappingDropdown({ users, value, disabled, onChange }: CrmUserMappingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectedUser = users.find((user) => user.userId === value);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = normalizedSearch
    ? users.filter((user) => [user.userName, user.employeeId, user.email]
      .some((field) => field?.toLowerCase().includes(normalizedSearch)))
    : users;

  const chooseUser = (userId: string | null) => {
    onChange(userId);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative min-w-0 space-y-1.5">
      <span className="block text-[11px] font-semibold text-gray-600">CRM user</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-xs text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <span className="min-w-0 flex-1 truncate">
          {selectedUser
            ? `${selectedUser.userName || selectedUser.email || selectedUser.userId} · ${selectedUser.employeeId || 'No employee code'}`
            : 'Not mapped'}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && !disabled && (
        <div role="dialog" aria-label="Map Smartflo agent to CRM user" className="absolute inset-x-0 top-full z-40 mt-1 flex max-h-72 flex-col rounded-md border border-gray-200 bg-white p-1 shadow-xl">
          <input
            type="search"
            aria-label="Search CRM users"
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or employee code"
            className="mb-1 h-9 shrink-0 rounded border border-gray-200 px-2.5 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10"
          />
          <div role="listbox" aria-label="CRM users" className="min-h-0 overflow-y-auto">
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => chooseUser(null)}
              className="flex min-h-10 w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
            >
              <span>Not mapped</span>
              {!value && <Check className="h-3.5 w-3.5 text-[#4b33e8]" aria-hidden="true" />}
            </button>
            {filteredUsers.length === 0 ? (
              <p className="px-2.5 py-3 text-xs text-gray-500">No matching users.</p>
            ) : filteredUsers.map((user) => (
              <button
                key={user.userId}
                type="button"
                role="option"
                aria-selected={value === user.userId}
                onClick={() => chooseUser(user.userId)}
                className="flex min-h-11 w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left hover:bg-gray-50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-gray-800">{user.userName || 'Unnamed user'}</span>
                  <span className="block truncate text-[11px] text-gray-500">Employee code: {user.employeeId || 'Not set'}{user.email ? ` · ${user.email}` : ''}</span>
                </span>
                {value === user.userId && <Check className="h-3.5 w-3.5 shrink-0 text-[#4b33e8]" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ParameterDropdown({ name, options, icon: Icon, disabled, value, onChange }: ParameterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-0 space-y-1.5">
      <span className="block text-xs font-semibold text-gray-700">{name}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-[#4b33e8] focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:border-gray-200"
      >
        <Icon className={`h-4 w-4 shrink-0 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} aria-hidden="true" />
        <span className={`min-w-0 flex-1 truncate ${value ? 'text-gray-800' : 'text-gray-400'}`}>
          {value || `Select ${name}`}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && !disabled && (
        <ul role="listbox" aria-label={name} className="absolute inset-x-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg">
          {options.map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="flex min-h-9 w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
              >
                <span>{option}</span>
                {value === option && <Check className="h-3.5 w-3.5 text-[#4b33e8]" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface CreatedAtDatePickerProps {
  value: string;
  disabled: boolean;
  onChange: (date: string) => void;
}

function CreatedAtDatePicker({ value, disabled, onChange }: CreatedAtDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const pickerRef = useRef<HTMLDivElement>(null);
  const [year, month, day] = value.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [isOpen]);

  const openCalendar = () => {
    setVisibleMonth(selectedDate);
    setIsOpen(true);
  };

  const formatDate = (date: Date) => {
    const dateParts = [
      String(date.getDate()).padStart(2, '0'),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getFullYear()),
    ];
    return dateParts.join('/');
  };

  return (
    <div ref={pickerRef} className="relative min-w-0 space-y-1.5">
      <span className="block text-xs font-semibold text-gray-700">Created At</span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : openCalendar())}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <span>{formatDate(selectedDate)}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Choose Created At date" className="absolute left-0 top-full z-30 mt-1 w-[min(18rem,calc(100vw-3rem))] rounded-md border border-gray-200 bg-white p-3 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((weekday) => (
              <span key={weekday} className="py-1 text-[10px] font-semibold text-gray-400">{weekday}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }, (_, index) => (
              <span key={`empty-${index}`} aria-hidden="true" />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1);
              const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              const isSelected = dateValue === value;

              return (
                <button
                  key={dateValue}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(dateValue);
                    setIsOpen(false);
                  }}
                  className={`aspect-square rounded text-xs transition-colors ${isSelected ? 'bg-[#4b33e8] font-semibold text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ClickToCallContentProps {
  isWebhookSetup?: boolean;
  onActivatedChange?: (activated: boolean) => void;
  onSwitchToWebhook?: () => void;
  onWebhookDetected?: () => void;
}

function ClickToCallContent({
  isWebhookSetup = false,
  onActivatedChange,
  onSwitchToWebhook,
  onWebhookDetected,
}: ClickToCallContentProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [hasWebhookResponses, setHasWebhookResponses] = useState(false);
  const [token, setToken] = useState('');
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [createdDate, setCreatedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [integrationId, setIntegrationId] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [webhookId, setWebhookId] = useState<string>('');
  const [hasSavedConfiguration, setHasSavedConfiguration] = useState(false);
  const [hasSavedToken, setHasSavedToken] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'verified' | 'error'>('idle');
  const [authMessage, setAuthMessage] = useState('');
  const [selectedParameters, setSelectedParameters] = useState<RequestParameters>({});
  const [smartfloAgents, setSmartfloAgents] = useState<SmartfloAgentOption[]>([]);
  const [selectedAgentNumbers, setSelectedAgentNumbers] = useState<string[]>([]);
  const [callerIdDrafts, setCallerIdDrafts] = useState<Record<string, string>>({});
  const [crmUsers, setCrmUsers] = useState<CrmUserOption[]>([]);
  const [callerId, setCallerId] = useState('');
  const [isCallerIdManagerOpen, setIsCallerIdManagerOpen] = useState(false);
  const [parameterSaveStatus, setParameterSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [requestView, setRequestView] = useState<'html' | 'json'>('html');
  const [testCallStatus, setTestCallStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [testCallMessage, setTestCallMessage] = useState('');
  const [testCallDetails, setTestCallDetails] = useState<{
    message: string;
    refId: string | null;
    callId: string | null;
  } | null>(null);
  const [testDestinationNumber, setTestDestinationNumber] = useState('9217175080');
  const isAuthenticated = authStatus === 'verified';
  const isSavingRequestParameters = parameterSaveStatus === 'saving';
  const mappedAgents = smartfloAgents.filter((agent) => Boolean(agent.userId));
  const headerAgent = mappedAgents.find((agent) => selectedAgentNumbers.includes(agent.agentId)) || mappedAgents[0] || null;
  const effectiveCallerId = callerId.trim() || (selectedAgentNumbers.length
    ? callerIdDrafts[selectedAgentNumbers[0]]?.trim() || ''
    : '');
  const isWebhookActive = Boolean(isWebhookSetup || hasWebhookResponses || testCallDetails?.callId);
  const [copiedField, setCopiedField] = useState<'ref' | 'call' | null>(null);

  const copyToClipboard = async (text: string, field: 'ref' | 'call') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  // Real-time lookup: auto-fetch call_id from webhook response matching test call refId
  useEffect(() => {
    if (!testCallDetails?.refId || testCallDetails.callId) return;

    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 30;

    const checkCallId = async () => {
      try {
        const targetOrg = organizationId;
        const targetWebhook = webhookId || integrationId;
        if (!targetOrg || !targetWebhook) return;
        const res = await fetch(`/api/webhook/${targetOrg}/${targetWebhook}`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.events)) {
          const match = data.events.find((ev: any) => {
            const evRef = String(ev.refId || ev.rawPayload?.ref_id || ev.rawPayload?.uuid || '');
            return evRef === testCallDetails.refId;
          });
          if (match && isMounted) {
            const foundCallId = match.rawPayload?.call_id || match.callId;
            if (foundCallId && String(foundCallId) !== testCallDetails.refId) {
              setTestCallDetails((prev) => prev ? { ...prev, callId: String(foundCallId) } : prev);
              setHasWebhookResponses(true);
              onWebhookDetected?.();
            }
          }
        }
      } catch {
        // ignore
      }
    };

    const interval = setInterval(() => {
      attempts++;
      void checkCallId();
      if (attempts >= maxAttempts) clearInterval(interval);
    }, 1000);

    void checkCallId();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [testCallDetails?.refId, testCallDetails?.callId, organizationId, webhookId, integrationId]);

  useEffect(() => {
    void loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error('Failed to load configuration:', response.status);
        return;
      }
      const result = await response.json();
      const configuration = result?.configuration;
      const loadedAgents: SmartfloAgentOption[] = Array.isArray(result?.smartfloAgents) ? result.smartfloAgents : [];
      setSmartfloAgents(loadedAgents);
      setCallerIdDrafts(Object.fromEntries(loadedAgents.map((agent) => [agent.agentId, agent.callerId || ''])));
      setCrmUsers(Array.isArray(result?.crmUsers) ? result.crmUsers : []);
      if (!configuration) return;

      if (configuration.organizationId) setOrganizationId(configuration.organizationId);
      if (configuration.webhookId) setWebhookId(configuration.webhookId);
      if (Array.isArray(configuration.webhookEvents) && configuration.webhookEvents.length > 0) {
        setHasWebhookResponses(true);
        onWebhookDetected?.();
      }
      setIntegrationId(configuration.integrationId ?? null);
      if (configuration.tokenCreatedAt) {
        setCreatedDate(String(configuration.tokenCreatedAt).slice(0, 10));
      }
      setHasSavedConfiguration(Boolean(configuration.integrationId || configuration.tokenCreatedAt));
      const isAct = Boolean(configuration.isActivated);
      setIsActivated(isAct);
      onActivatedChange?.(isAct);
      setExpiryDays(normalizeExpiryDays(configuration.expiryDays ?? 30));
      setSelectedParameters(configuration.clickToCallParams ?? {});
      const savedCallerId = configuration.clickToCallParams?.caller_id;
      setCallerId(typeof savedCallerId === 'string'
        ? savedCallerId
        : Array.isArray(savedCallerId) && typeof savedCallerId[0] === 'string'
          ? savedCallerId[0]
          : '');
      setSelectedAgentNumbers(Array.isArray(configuration.clickToCallParams?.agent_number)
        ? configuration.clickToCallParams.agent_number
        : []);
      setAuthStatus(configuration.isTokenValid ? 'verified' : 'idle');
      setAuthMessage(configuration.isTokenValid ? 'Token already verified.' : '');
    } catch {
      setAuthStatus('error');
      setAuthMessage('Unable to load the Smartflo configuration.');
    }
  };

  const saveRequestParameters = async (nextParameters: RequestParameters) => {
    setSelectedParameters(nextParameters);
    setParameterSaveStatus('saving');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again to save request settings.');

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ clickToCallParams: nextParameters }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save request settings.');

      const savedParameters = result.clickToCallParams as RequestParameters;
      setSelectedParameters(savedParameters);
      setCallerId(typeof savedParameters.caller_id === 'string' ? savedParameters.caller_id : '');
      setSelectedAgentNumbers(Array.isArray(savedParameters.agent_number) ? savedParameters.agent_number : []);
      setParameterSaveStatus('saved');
    } catch {
      setParameterSaveStatus('error');
    }
  };

  const saveAgentCallerId = async (agentId: string) => {
    const callerId = callerIdDrafts[agentId]?.trim() || null;
    const currentCallerId = smartfloAgents.find((agent) => agent.agentId === agentId)?.callerId || null;
    if (callerId === currentCallerId) return;

    setParameterSaveStatus('saving');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again to save caller ID.');

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ agentCallerId: { agentId, callerId } }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save caller ID.');

      setSmartfloAgents((agents) => agents.map((agent) => agent.agentId === agentId
        ? { ...agent, callerId: result.callerId }
        : agent));
      setCallerIdDrafts((drafts) => ({ ...drafts, [agentId]: result.callerId || '' }));
      setParameterSaveStatus('saved');
    } catch {
      setParameterSaveStatus('error');
    }
  };

  const saveAgentUserMapping = async (agentId: string, userId: string | null) => {
    const previousUserId = smartfloAgents.find((agent) => agent.agentId === agentId)?.userId || null;
    setParameterSaveStatus('saving');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again to update user mapping.');

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ agentUserMapping: { agentId, userId } }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save user mapping.');

      setSmartfloAgents((agents) => agents.map((agent) => agent.agentId === agentId
        ? { ...agent, userId: result.userId }
        : agent));
      for (const affectedUserId of new Set([previousUserId, result.userId].filter((id): id is string => Boolean(id)))) {
        window.dispatchEvent(new CustomEvent('calling-provider-updated', { detail: { userId: affectedUserId } }));
      }
      setParameterSaveStatus('saved');
    } catch {
      setParameterSaveStatus('error');
    }
  };

  const testClickToCall = async () => {
    if (testCallStatus === 'sending' || isSavingRequestParameters) return;
    const destination = testDestinationNumber.trim();
    if (!destination) {
      setTestCallStatus('error');
      setTestCallMessage('Please enter a destination phone number to test.');
      setTestCallDetails(null);
      return;
    }

    setTestCallStatus('sending');
    setTestCallMessage('');
    setTestCallDetails(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again to test Click to Call.');

      const response = await fetch('/api/smartflo/test-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          destination_number: destination,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.error || 'Smartflo could not queue the test call.');
      }

      setIsActivated(true);
      onActivatedChange?.(true);
      setTestCallMessage(result.message || 'Originate successfully queued');
      setTestCallDetails({
        message: result.message || 'Originate successfully queued',
        refId: result.ref_id || null,
        callId: result.call_id || null,
      });
      setTestCallStatus('idle');
    } catch (error) {
      setTestCallStatus('error');
      setTestCallMessage(error instanceof Error ? error.message : 'Unable to test Click to Call.');
      setTestCallDetails(null);
    }
  };

  const authenticateToken = async (retry = false) => {
    if (authStatus === 'checking') return;
    if (!retry && !token.trim()) return;

    setAuthStatus('checking');
    setAuthMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again to authenticate Smartflo.');

      const useSavedToken = retry && !token.trim() && hasSavedConfiguration;
      const payload = useSavedToken
        ? { retry: true, expiryDays, createdAt: createdDate }
        : { token: token.trim(), expiryDays, createdAt: createdDate };
      const response = await fetch('/api/smartflo/preflight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.error || 'Smartflo token verification failed.');
      }

      if (process.env.NODE_ENV === 'development') {
        console.info('[Smartflo] verified users:', result.users ?? []);
      }

      const nextCreatedAt = result.configuration?.tokenCreatedAt;
      if (nextCreatedAt) setCreatedDate(String(nextCreatedAt).slice(0, 10));
      if (result.configuration?.integrationId) setIntegrationId(result.configuration.integrationId);
      setHasSavedConfiguration(true);
      setHasSavedToken(true);
      setExpiryDays(normalizeExpiryDays(result.configuration?.expiryDays ?? expiryDays));
      setSelectedParameters((previous) => ({ ...previous, ...(result.configuration?.clickToCallParams ?? {}) }));
      setAuthStatus('verified');
      setAuthMessage(retry ? 'Token refreshed. Smartflo is verified again.' : 'Token verified. Configuration fields are now available.');
      await loadConfiguration();
    } catch (error) {
      setAuthStatus('error');
      setAuthMessage(error instanceof Error ? error.message : 'Unable to verify the Smartflo token.');
    }
  };

  return (
    <div id="panel-click-to-call-config" className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50/50 px-4 py-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Click-to-Call Configuration</h2>
          <p className="mt-0.5 break-all text-xs text-gray-500">
            Integration ID: {integrationId || 'Not configured'}
          </p>
        </div>
        {headerAgent && (
          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-gray-700">{headerAgent.agentName || headerAgent.loginId}</span>
            <span className="text-gray-400 font-mono text-[11px]">({headerAgent.agentId})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="space-y-6 p-5 sm:p-6 lg:col-span-1">
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase text-gray-500">Connection Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CreatedAtDatePicker
                    value={createdDate}
                    onChange={setCreatedDate}
                    disabled={authStatus === 'checking'}
                  />
                  <ParameterDropdown
                    name="Token Expiry"
                    options={SMARTFLO_EXPIRY_DAYS.map((days) => `${days} days`)}
                    icon={CalendarClock}
                    disabled={authStatus === 'checking'}
                    value={`${expiryDays} days`}
                    onChange={(value) => setExpiryDays(Number.parseInt(value, 10))}
                  />

                  <div className="space-y-1.5 sm:col-span-2">
                    <span className="text-xs font-semibold text-gray-700">Token</span>
                    <div className="flex min-w-0">
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={token}
                        onChange={(event) => {
                          setToken(event.target.value);
                          setAuthStatus('idle');
                          setAuthMessage('');
                        }}
                        placeholder={hasSavedToken ? '*********' : 'Enter Smartflo API token'}
                        disabled={authStatus === 'checking'}
                        className="h-11 min-w-0 flex-1 rounded-l-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => void authenticateToken(isAuthenticated || hasSavedConfiguration)}
                        disabled={authStatus === 'checking'}
                        className="inline-flex h-11 shrink-0 items-center gap-1.5 border border-l-0 border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {authStatus === 'checking' ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : isAuthenticated || hasSavedConfiguration ? (
                          <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <KeyRound className="h-4 w-4" aria-hidden="true" />
                        )}
                        {authStatus === 'checking' ? 'Checking…' : isAuthenticated || hasSavedConfiguration ? 'Retry' : 'Authenticate'}
                      </button>
                    </div>
                    {authMessage && (
                      <p className={`text-xs ${isAuthenticated ? 'text-emerald-700' : 'text-rose-600'}`} role="status">
                        {authMessage}
                      </p>
                    )}
                  </div>

                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-900">API Endpoint Details</h3>
                <dl className="mt-3 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="space-y-1.5 p-3">
                    <dt className="text-[11px] font-semibold uppercase text-gray-500">URL</dt>
                    <dd className="break-all font-mono text-xs leading-relaxed text-gray-800">
                      https://api-smartflo.tatateleservices.com/v1/click_to_call
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3">
                    <dt className="text-[11px] font-semibold uppercase text-gray-500">Method</dt>
                    <dd className="rounded bg-white px-2 py-1 font-mono text-xs font-semibold text-gray-800">POST</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-3">
                    <dt className="text-[11px] font-semibold uppercase text-gray-500">Content-Type</dt>
                    <dd className="text-right font-mono text-xs text-gray-800">application/json</dd>
                  </div>
                </dl>
              </section>
            </div>

            <section className="border-t border-gray-200 bg-gray-50 p-5 sm:p-6 lg:col-span-1 lg:border-l lg:border-t-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Request Configuration</h3>
                  <p className="mt-1 text-xs text-gray-500">Body parameters</p>
                </div>
                <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5" role="group" aria-label="Request configuration view">
                  {(['html', 'json'] as const).map((view) => (
                    <button
                      key={view}
                      type="button"
                      aria-pressed={requestView === view}
                      onClick={() => setRequestView(view)}
                      className={`rounded px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${requestView === view ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
              {requestView === 'html' ? (
                <>
                <div
                  aria-busy={isSavingRequestParameters}
                  className={`grid grid-cols-1 gap-4 transition-opacity duration-200 sm:grid-cols-2 ${isSavingRequestParameters ? 'pointer-events-none opacity-45' : 'opacity-100'}`}
                >
                <CheckboxMultiSelect
                  name="agent_number"
                  options={smartfloAgents.map((agent) => ({
                    value: agent.agentId,
                    label: agent.agentName || agent.loginId || `Agent ${agent.agentId}`,
                    detail: `Agent ID: ${agent.agentId}`,
                  }))}
                  selectedValues={selectedAgentNumbers}
                  icon={Headset}
                  disabled={!isAuthenticated || isSavingRequestParameters}
                  onChange={(values) => {
                    setSelectedAgentNumbers(values);
                    void saveRequestParameters({ ...selectedParameters, agent_number: values });
                  }}
                />
                <div className="min-w-0 space-y-1.5">
                  <label htmlFor="smartflo-shared-caller-id" className="block text-xs font-semibold text-gray-700">caller_id</label>
                  <div className="flex min-w-0 gap-2">
                    <input
                      id="smartflo-shared-caller-id"
                      type="tel"
                      value={callerId}
                      onChange={(event) => setCallerId(event.target.value)}
                      onBlur={() => void saveRequestParameters({
                        ...selectedParameters,
                        agent_number: selectedAgentNumbers,
                        caller_id: callerId.trim() || null,
                      })}
                      placeholder="Shared DID for Click to Call"
                      disabled={!isAuthenticated || isSavingRequestParameters}
                      className="h-11 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                    />
                    <button
                      type="button"
                      aria-label="Configure per-user caller IDs"
                      title="Per-user caller ID settings"
                      onClick={() => setIsCallerIdManagerOpen(true)}
                      disabled={!isAuthenticated}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {[
                  { name: 'destination_number', options: ['CRM lead phone number', 'Manual dial number'], icon: Phone },
                  { name: 'async', options: ['true', 'false'], icon: Zap },
                  { name: 'custom_identifier', options: ['Customer ID', 'Campaign ID'], icon: Fingerprint },
                  { name: 'call_timeout', options: ['30 seconds', '60 seconds', '90 seconds'], icon: Timer },
                ].map(({ name, options, icon }) => (
                  <ParameterDropdown
                    key={name}
                    name={name}
                    options={options}
                    icon={icon}
                    disabled={!isAuthenticated || isSavingRequestParameters}
                    value={typeof selectedParameters[name] === 'string' ? selectedParameters[name] as string : ''}
                    onChange={(value) => {
                      void saveRequestParameters({
                        ...selectedParameters,
                        agent_number: selectedAgentNumbers,
                        [name]: value,
                      });
                    }}
                  />
                ))}
                </div>
                <div className="mt-5 border-t border-gray-200/80 pt-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1 max-w-sm space-y-1.5">
                      <label htmlFor="smartflo-test-destination-number" className="block text-xs font-semibold text-gray-700">
                        Destination Number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                        <input
                          id="smartflo-test-destination-number"
                          type="tel"
                          value={testDestinationNumber}
                          onChange={(event) => setTestDestinationNumber(event.target.value)}
                          placeholder="Enter destination phone number"
                          disabled={!isAuthenticated || isSavingRequestParameters || testCallStatus === 'sending'}
                          className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void testClickToCall()}
                      disabled={!isAuthenticated || !selectedAgentNumbers.length || !effectiveCallerId || !testDestinationNumber.trim() || isSavingRequestParameters || testCallStatus === 'sending'}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {testCallStatus === 'sending'
                        ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                        : <PhoneCall className="h-4 w-4" aria-hidden="true" />}
                      Test
                    </button>
                  </div>
                  {testCallStatus === 'sending' && (
                    <p className="mt-2.5 text-xs text-gray-500" role="status">Sending test call…</p>
                  )}
                  {testCallStatus === 'error' && (
                    <p className="mt-2.5 text-xs text-rose-600" role="status">{testCallMessage}</p>
                  )}
                  {testCallStatus === 'idle' && testCallDetails && (
                    <div
                      className={`mt-4 rounded-xl border p-4 sm:p-5 transition-all space-y-3.5 ${
                        isWebhookActive
                          ? 'border-emerald-200/90 bg-white shadow-xs'
                          : 'border-amber-200/90 bg-white shadow-xs'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                              isWebhookActive
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                : 'border-amber-200 bg-amber-50 text-amber-600'
                            }`}
                          >
                            {isWebhookActive ? (
                              <Check className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <PhoneCall className="h-5 w-5" aria-hidden="true" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 leading-tight">
                              {isWebhookActive ? 'Setup ready to run' : 'Call Originated · Webhook Setup Needed'}
                            </h4>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isWebhookActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                                }`}
                              />
                              {testCallDetails.message || 'Originate successfully queued'}
                            </p>
                          </div>
                        </div>

                        {isWebhookActive ? (
                          <button
                            type="button"
                            onClick={() => onSwitchToWebhook?.()}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          >
                            <span>View in Webhook Logs</span>
                            <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSwitchToWebhook?.()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4b33e8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3b25d1] transition-colors"
                          >
                            <span>Setup Webhook</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Details Box */}
                      <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-3 divide-y divide-gray-200/60">
                        {/* Reference ID Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5">
                          <span className="text-xs font-medium text-gray-500">Reference ID (Originate)</span>
                          <div className="flex items-center gap-1.5">
                            <span className="rounded border border-gray-200 bg-white px-2 py-0.5 font-mono text-xs font-semibold text-gray-900 select-all">
                              {testCallDetails.refId || 'N/A'}
                            </span>
                            {testCallDetails.refId && (
                              <button
                                type="button"
                                title="Copy Reference ID"
                                onClick={() => void copyToClipboard(testCallDetails.refId!, 'ref')}
                                className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                              >
                                {copiedField === 'ref' ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Call ID Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5">
                          <span className="text-xs font-medium text-gray-500">Call ID (Smartflo Webhook)</span>
                          <div className="flex items-center gap-1.5">
                            {testCallDetails.callId ? (
                              <>
                                <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-800 select-all">
                                  {testCallDetails.callId}
                                </span>
                                <button
                                  type="button"
                                  title="Copy Call ID"
                                  onClick={() => void copyToClipboard(testCallDetails.callId!, 'call')}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                                >
                                  {copiedField === 'call' ? (
                                    <Check className="h-3 w-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-sans text-xs italic text-amber-700">
                                <LoaderCircle className="h-3 w-3 animate-spin text-amber-600 inline shrink-0" />
                                Waiting for webhook response…
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Message */}
                      {isWebhookActive ? (
                        <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-800">
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span className="text-[11px] font-medium leading-relaxed">
                            Smartflo outbound call originate & incoming webhook events are fully connected.
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200/70 bg-amber-50/60 p-3 text-xs text-amber-900">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                            <p className="text-[11px] leading-relaxed">
                              <strong className="font-semibold">Setup webhook for see response:</strong> Add the webhook URL in your Tata Smartflo portal under <em>Services &gt; Webhooks</em> to automatically receive call logs, hangup causes & call recordings.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onSwitchToWebhook?.()}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#4b33e8] hover:underline shrink-0"
                          >
                            <span>Go to Webhook Setup</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </>
              ) : (
                <pre className="max-h-[28rem] overflow-auto rounded-md border border-stone-200 bg-[#f7f6f2] p-4 text-xs leading-relaxed text-gray-800"><code>{JSON.stringify({
                  agent_number: selectedAgentNumbers,
                  destination_number: selectedParameters.destination_number === 'Manual dial number'
                    ? 'Manual dial number'
                    : '{customer.phone}',
                  caller_id: effectiveCallerId || null,
                  async: selectedParameters.async || 'false',
                  custom_identifier: selectedParameters.custom_identifier === 'Campaign ID'
                    ? '{campaign.id}'
                    : '{customer.id}',
                  call_timeout: selectedParameters.call_timeout || '30 seconds',
                }, null, 2)}</code></pre>
              )}
              {isCallerIdManagerOpen && (
                <div
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-3 sm:p-6"
                  onClick={() => setIsCallerIdManagerOpen(false)}
                >
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="smartflo-caller-id-title"
                    onClick={(event) => event.stopPropagation()}
                    className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
                  >
                    <header className="border-b border-gray-200 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 id="smartflo-caller-id-title" className="text-sm font-bold text-gray-900">Caller ID Configuration</h3>
                          <p className="mt-1 text-xs text-gray-500">Optional caller ID overrides for individual agents.</p>
                        </div>
                        <button
                          type="button"
                          aria-label="Close Caller ID configuration"
                          onClick={() => setIsCallerIdManagerOpen(false)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </header>

                    <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-5">
                      {smartfloAgents.length === 0 ? (
                        <p className="rounded-md border border-dashed border-gray-300 p-4 text-xs text-gray-500">No Smartflo users found for this organization.</p>
                      ) : smartfloAgents.map((agent) => (
                        <div key={agent.agentId} className="grid grid-cols-1 items-start gap-3 rounded-md border border-gray-200 p-3 sm:grid-cols-[minmax(10rem,1.1fr)_minmax(10rem,1fr)_minmax(10rem,1fr)]">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-gray-800">{agent.agentName || agent.loginId || `Agent ${agent.agentId}`}</p>
                            <p className="mt-0.5 truncate text-[11px] text-gray-500">Agent {agent.agentId}{agent.loginId ? ` · ${agent.loginId}` : ''}</p>
                            <p className="truncate text-[11px] text-gray-400">{agent.loginId || 'Smartflo user'}{agent.extension ? ` · Ext ${agent.extension}` : ''}{agent.intercom ? ` · Intercom ${agent.intercom}` : ''}</p>
                          </div>
                          <label className="min-w-0 space-y-1.5">
                            <span className="block text-[11px] font-semibold text-gray-600">Caller ID</span>
                            <input
                              type="tel"
                              aria-label={`Caller ID for ${agent.agentName || agent.agentId}`}
                              value={callerIdDrafts[agent.agentId] ?? ''}
                              onChange={(event) => setCallerIdDrafts((drafts) => ({ ...drafts, [agent.agentId]: event.target.value }))}
                              onBlur={() => void saveAgentCallerId(agent.agentId)}
                              placeholder="Optional override"
                              disabled={isSavingRequestParameters || !isAuthenticated}
                              className="h-10 w-full min-w-0 rounded-md border border-gray-200 px-3 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                            />
                          </label>
                          <CrmUserMappingDropdown
                            users={crmUsers}
                            value={agent.userId}
                            disabled={isSavingRequestParameters || !isAuthenticated}
                            onChange={(userId) => void saveAgentUserMapping(agent.agentId, userId)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {parameterSaveStatus !== 'idle' && (
                <p className={`mt-3 text-xs ${parameterSaveStatus === 'error' ? 'text-rose-600' : 'text-gray-500'}`} role="status">
                  {parameterSaveStatus === 'saving' ? 'Saving request settings…' : parameterSaveStatus === 'saved' ? 'Request settings saved.' : 'Could not save request settings.'}
                </p>
              )}
            </section>
          </div>
        </div>
      );
    }

interface WebhookResponseItem {
  id: string;
  receivedAt: string;
  callId: string;
  refId?: string;
  direction: string;
  callType: string;
  agentNumber: string;
  destinationNumber: string;
  status: string;
  hangupCause: string;
  duration: number;
  recordingUrl: string | null;
  rawPayload: Record<string, unknown>;
}

interface SetupWebhookContentProps {
  onEventsCountChange?: (count: number) => void;
}

function SetupWebhookContent({ onEventsCountChange }: SetupWebhookContentProps) {
  const [organizationId, setOrganizationId] = useState<string>('');
  const [webhookId, setWebhookId] = useState<string>('');
  const [events, setEvents] = useState<WebhookResponseItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null);

  const isClearingRef = useRef(false);
  const activePollAbortRef = useRef<AbortController | null>(null);
  const latestRequestTimeRef = useRef<number>(0);

  const leftColRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const el = leftColRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el) {
        setLeftHeight(el.offsetHeight);
      }
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      updateHeight();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    onEventsCountChange?.(events.length);
  }, [events.length, onEventsCountChange]);

  useEffect(() => {
    void loadWebhookData(false);
  }, []);

  // Real-time polling: automatically refreshes every 1000ms (1 second) when mounted
  useEffect(() => {
    const interval = setInterval(() => {
      void loadWebhookData(true);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (activePollAbortRef.current) {
        activePollAbortRef.current.abort();
      }
    };
  }, [organizationId, webhookId]);

  const loadWebhookData = async (silent = false) => {
    // If clearing is currently in progress or guarded, skip loading to prevent reviving deleted items
    if (isClearingRef.current) return;

    const requestTime = Date.now();
    latestRequestTimeRef.current = requestTime;

    // Abort previous in-flight polling request to avoid overlapping race conditions
    if (activePollAbortRef.current) {
      activePollAbortRef.current.abort();
    }
    const abortController = new AbortController();
    activePollAbortRef.current = abortController;

    try {
      if (!silent) setIsLoading(true);

      const targetOrg = organizationId;
      const targetWebhook = webhookId;
      if (!targetOrg || !targetWebhook) {
        if (!silent) setIsLoading(false);
        return;
      }

      // 1. Direct fetch via lightweight webhook endpoint for real-time responsiveness
      const directRes = await fetch(`/api/webhook/${targetOrg}/${targetWebhook}`, {
        cache: 'no-store',
        signal: abortController.signal,
      });

      if (isClearingRef.current || latestRequestTimeRef.current !== requestTime) return;

      if (directRes.ok) {
        const directData = await directRes.json();
        if (isClearingRef.current || latestRequestTimeRef.current !== requestTime) return;

        if (Array.isArray(directData.events)) {
          setEvents(directData.events);
          if (directData.orgId && !organizationId) setOrganizationId(directData.orgId);
          if (directData.webhookId && !webhookId) setWebhookId(directData.webhookId);
          return;
        }
      }

      // 2. Fetch full config only on manual load or initial mount (not on 1s silent tick)
      if (!silent) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || isClearingRef.current || latestRequestTimeRef.current !== requestTime) return;

        const response = await fetch('/api/smartflo/configuration', {
          method: 'GET',
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
          signal: abortController.signal,
        });

        if (!response.ok || isClearingRef.current || latestRequestTimeRef.current !== requestTime) return;
        const result = await response.json();

        if (result?.configuration?.organizationId) {
          setOrganizationId(result.configuration.organizationId);
        }
        if (result?.configuration?.webhookId) {
          setWebhookId(result.configuration.webhookId);
        } else if (result?.configuration?.integrationId) {
          setWebhookId(result.configuration.integrationId);
        }
        if (Array.isArray(result?.configuration?.webhookEvents)) {
          setEvents(result.configuration.webhookEvents);
        }
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      if (!silent) console.error('Failed to load webhook configuration', error);
    } finally {
      if (activePollAbortRef.current === abortController) {
        activePollAbortRef.current = null;
      }
      if (!silent) setIsLoading(false);
    }
  };

  const handleSimulateWebhook = async () => {
    if (isSimulating || isClearingRef.current) return;
    setIsSimulating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'simulate_webhook' }),
      });
      const result = await response.json();
      if (result?.webhookEvents) {
        setEvents(result.webhookEvents);
      }
    } catch (error) {
      console.error('Failed to simulate webhook event', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClearLogs = async () => {
    if (isClearing || isClearingRef.current) return;

    // 1. Immediately abort any in-flight polling request so its old result can't be rendered
    if (activePollAbortRef.current) {
      activePollAbortRef.current.abort();
      activePollAbortRef.current = null;
    }

    // 2. Lock clearing state and clear UI immediately (optimistic UI update)
    isClearingRef.current = true;
    setIsClearing(true);
    setEvents([]);
    setExpandedPayloadId(null);

    const targetOrg = organizationId;
    const targetWebhook = webhookId;
    if (!targetOrg || !targetWebhook) {
      isClearingRef.current = false;
      setIsClearing(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Clear both endpoints in parallel to ensure database is clean
      await Promise.allSettled([
        fetch(`/api/webhook/${targetOrg}/${targetWebhook}`, {
          method: 'DELETE',
        }),
        session
          ? fetch('/api/smartflo/configuration', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ action: 'clear_webhook_events' }),
            })
          : Promise.resolve(),
      ]);

      // Ensure state remains empty
      setEvents([]);
    } catch (error) {
      console.error('Failed to clear webhook events', error);
    } finally {
      // Keep guard active for 1500ms to discard any delayed responses
      setTimeout(() => {
        isClearingRef.current = false;
        setIsClearing(false);
      }, 1500);
    }
  };

  const domain = 'https://www.rynxly.in';
  const effectiveOrgId = organizationId;
  const effectiveWebhookId = webhookId;
  const effectiveWebhookPath = effectiveOrgId && effectiveWebhookId ? `/webhook/${effectiveOrgId}/${effectiveWebhookId}` : '';
  const fullWebhookUrl = effectiveWebhookPath ? `${domain}${effectiveWebhookPath}` : '';

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullWebhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div id="panel-webhook-config" className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50/50 px-4 py-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Outbound Webhook Configuration</h2>
          <p className="mt-0.5 break-all text-xs text-gray-500">
            Webhook ID: {effectiveWebhookId} · Organization ID: {effectiveOrgId}
          </p>
        </div>
        {events.length > 0 && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            {events.length} event{events.length > 1 ? 's' : ''} received
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {/* Left End: Webhook URL & Smartflo Portal Setup Guide */}
            <div ref={leftColRef} className="space-y-6 p-5 sm:p-6 lg:col-span-1">
              {/* Webhook URL Box */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Webhook Endpoint URL</h3>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Active</span>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-3.5 space-y-2.5">
                  <label htmlFor="smartflo-webhook-url-path" className="block text-xs font-medium text-gray-600">
                    Smartflo Destination Webhook URL
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative min-w-0 flex-1">
                      <input
                        id="smartflo-webhook-url-path"
                        type="text"
                        readOnly
                        value={fullWebhookUrl}
                        className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 font-mono text-xs text-gray-800 outline-none select-all"
                      />
                    </div>
                    <button
                      type="button"
                      title="Copy webhook URL"
                      onClick={() => void copyWebhookUrl()}
                      className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-500">
                    <span>Endpoint path: <span className="font-mono text-gray-700">{effectiveWebhookPath}</span></span>
                  </div>
                </div>
              </section>

              {/* Portal Guide - EXACT specs requested by user */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[#4b33e8]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Smartflo Portal Setup Guide</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Configure the following webhook parameters in your <strong>Tata Smartflo Portal</strong> under <em>Services &gt; Webhooks &gt; Add Webhook</em>:
                </p>

                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-center justify-between p-3 text-xs">
                    <span className="font-medium text-gray-500">Chanel</span>
                    <span className="rounded-md bg-purple-50 px-2.5 py-1 font-semibold text-purple-700 border border-purple-200/60">
                      Voice
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 text-xs">
                    <span className="font-medium text-gray-500">Call Direction</span>
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 border border-blue-200/60">
                      Outbound
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 text-xs">
                    <span className="font-medium text-gray-500">Call Type</span>
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 border border-indigo-200/60">
                      Click to Call
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 text-xs">
                    <span className="font-medium text-gray-500">Trigger</span>
                    <span className="rounded-md bg-amber-50 px-2.5 py-1 font-semibold text-amber-800 border border-amber-200/60">
                      Call hangup (Missed or Answered)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 text-xs">
                    <span className="font-medium text-gray-500">My Number</span>
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 border border-emerald-200/60">
                      All numbers selected
                    </span>
                  </div>
                </div>

                <div className="rounded-md border border-gray-100 bg-gray-50 p-3 text-[11px] text-gray-600 leading-relaxed">
                  <p>
                    <strong>Note:</strong> Once configured in Smartflo, each time an outbound click-to-call ends (whether answered or missed), Smartflo immediately dispatches the call metrics and hangup payload to this webhook URL.
                  </p>
                </div>
              </section>
            </div>

            {/* Right End: Webhook Received Responses as Cards */}
            <div
              style={isDesktop && leftHeight ? { height: `${leftHeight}px`, maxHeight: `${leftHeight}px` } : undefined}
              className="flex flex-col bg-gray-50/50 p-5 sm:p-6 lg:col-span-1 min-h-0 overflow-hidden"
            >
              <div className="shrink-0 mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Received Webhook Responses</h3>
                  <p className="text-xs text-gray-500">Real-time incoming call hangup records</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Simulate a test hangup webhook from Smartflo"
                    onClick={() => void handleSimulateWebhook()}
                    disabled={isSimulating}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isSimulating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Radio className="h-3.5 w-3.5 text-[#4b33e8]" />}
                    <span>Test Event</span>
                  </button>
                  <button
                    type="button"
                    title="Refresh logs"
                    onClick={() => void loadWebhookData()}
                    disabled={isLoading}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  {events.length > 0 && (
                    <button
                      type="button"
                      title="Clear logs"
                      onClick={() => void handleClearLogs()}
                      disabled={isClearing}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cards list - takes remaining height and scrolls */}
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {events.length === 0 ? (
                  <div className="flex h-full min-h-[16rem] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <Webhook className="h-6 w-6" />
                    </div>
                    <h4 className="mt-3 text-xs font-bold text-gray-800">No Webhook Responses Yet</h4>
                    <p className="mt-1 max-w-xs text-[11px] text-gray-500">
                      Responses sent by Tata Smartflo upon call hangup will automatically show up here as individual cards.
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleSimulateWebhook()}
                      disabled={isSimulating}
                      className="mt-4 inline-flex items-center gap-2 rounded-md bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {isSimulating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Radio className="h-3.5 w-3.5" />}
                      Simulate Sample Response
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                  {events.map((event) => {
                    const isAnswered = ['answered', 'completed', 'success'].includes(event.status.toLowerCase());
                    const isBusy = ['busy', 'user_busy'].includes(event.status.toLowerCase());
                    const statusColor = isAnswered
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : isBusy
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200';

                    const isExpandedPayload = expandedPayloadId === event.id;

                    return (
                      <div
                        key={event.id}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                              {event.status}
                            </span>
                            <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-[10px] text-gray-600">
                              {event.callType || 'Click to Call'}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(event.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded bg-gray-50 p-2">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Agent</span>
                            <span className="font-mono text-[11px] font-semibold text-gray-800 truncate block" title={event.agentNumber}>
                              {event.agentNumber || 'Unknown'}
                            </span>
                          </div>
                          <div className="rounded bg-gray-50 p-2">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Destination</span>
                            <span className="font-mono text-[11px] font-semibold text-gray-800 truncate block" title={event.destinationNumber}>
                              {event.destinationNumber || 'Unknown'}
                            </span>
                          </div>
                          <div className="rounded bg-gray-50 p-2">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Duration</span>
                            <span className="font-semibold text-gray-800">
                              {event.duration > 0
                                ? `${event.duration}s (${Math.floor(event.duration / 60)}m ${event.duration % 60}s)`
                                : event.rawPayload?.agent_ring_time
                                  ? `0s (Ring: ${event.rawPayload.agent_ring_time}s)`
                                  : '0s'}
                            </span>
                          </div>
                          <div className="rounded bg-gray-50 p-2">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Hangup Cause</span>
                            <span className="font-mono text-[10px] font-medium text-gray-700 truncate block" title={event.hangupCause}>
                              {event.hangupCause || 'NORMAL_CLEARING'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px]">
                          {(() => {
                            const displayRefId = String(
                              event.refId ||
                              event.rawPayload?.ref_id ||
                              event.rawPayload?.uuid ||
                              event.rawPayload?.custom_identifier ||
                              event.callId
                            );
                            return (
                              <span
                                className="font-mono text-gray-500 truncate max-w-[14rem]"
                                title={`Ref: ${displayRefId}${event.callId && event.callId !== displayRefId ? ` · Call ID: ${event.callId}` : ''}`}
                              >
                                Ref: {displayRefId}
                              </span>
                            );
                          })()}
                          <button
                            type="button"
                            onClick={() => setExpandedPayloadId(isExpandedPayload ? null : event.id)}
                            className="inline-flex items-center gap-1 font-semibold text-[#4b33e8] hover:underline"
                          >
                            <FileCode className="h-3 w-3" />
                            <span>{isExpandedPayload ? 'Hide Payload' : 'View Payload'}</span>
                          </button>
                        </div>

                        {isExpandedPayload && (
                          <pre className="mt-2.5 max-h-48 overflow-auto rounded bg-stone-900 p-2.5 font-mono text-[10px] leading-relaxed text-emerald-400">
                            <code>{JSON.stringify(event.rawPayload || event, null, 2)}</code>
                          </pre>
                        )}
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

function OutboundSetupSection() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'click-to-call' | 'webhook'>('click-to-call');
  const [isClickToCallActivated, setIsClickToCallActivated] = useState(false);
  const [webhookEventsCount, setWebhookEventsCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const loadStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch('/api/smartflo/configuration', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.configuration && isMounted) {
          const active = Boolean(data.configuration.isActivated || data.configuration.hasToken || data.configuration.isTokenValid);
          setIsEnabled(active);
          if (data.configuration.isActivated) {
            setIsClickToCallActivated(true);
          }
          if (Array.isArray(data.configuration.webhookEvents) && data.configuration.webhookEvents.length > 0) {
            setWebhookEventsCount(data.configuration.webhookEvents.length);
          }
        }
      } catch {
        // ignore
      }
    };
    void loadStatus();
    return () => {
      isMounted = false;
    };
  }, [formResetKey]);

  const handleToggleEnabled = async (nextEnabled: boolean) => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again.');

      if (!nextEnabled) {
        // DISABLE: Call API to reset all Click to Call records in Supabase
        const res = await fetch('/api/smartflo/configuration', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: 'disable' }),
        });
        if (!res.ok) throw new Error('Failed to disable Click to Call');

        setIsEnabled(false);
        setIsClickToCallActivated(false);
        setWebhookEventsCount(0);
        setFormResetKey((k) => k + 1);
      } else {
        // ENABLE: Update enabled state in Supabase and show forms
        const res = await fetch('/api/smartflo/configuration', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: 'enable' }),
        });
        if (!res.ok) throw new Error('Failed to enable Click to Call');

        setIsEnabled(true);
      }
    } catch (err) {
      console.error('Error toggling Click to Call:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Click to Call Setup Card with Enable / Disable Switch */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isEnabled ? 'bg-[#4b33e8] text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <PhoneCall className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Click to Call Setup</h2>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isEnabled
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-gray-200 bg-gray-100 text-gray-600'
                  }`}
                >
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">Outgoing call routing details</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3">
            {isToggling && <LoaderCircle className="h-4 w-4 animate-spin text-[#4b33e8]" />}
            <span className="text-xs font-semibold text-gray-700">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isEnabled}
              aria-label="Toggle Click to Call Setup"
              disabled={isToggling}
              onClick={() => void handleToggleEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                isEnabled ? 'bg-[#4b33e8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Forms shown only when enabled */}
      {isEnabled && (
        <div key={formResetKey} className="space-y-4 pt-1 animate-in fade-in duration-200">
          {/* Top 2 Cards: Click to Call Config | Webhook */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Card 1: Click to Call Config */}
            <button
              type="button"
              onClick={() => setActiveTab('click-to-call')}
              className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
                activeTab === 'click-to-call'
                  ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03] ring-1 ring-[#4b33e8]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    activeTab === 'click-to-call'
                      ? 'bg-[#4b33e8] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <PhoneCall className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Click to Call Config</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Outbound API calling & agent configuration</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  isClickToCallActivated
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isClickToCallActivated ? 'Activated' : 'Setup'}
              </span>
            </button>

            {/* Card 2: Webhook */}
            <button
              type="button"
              onClick={() => setActiveTab('webhook')}
              className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
                activeTab === 'webhook'
                  ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03] ring-1 ring-[#4b33e8]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    activeTab === 'webhook'
                      ? 'bg-[#4b33e8] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Webhook className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Webhook</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Real-time call events & hangup details</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  webhookEventsCount > 0
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {webhookEventsCount > 0 ? `${webhookEventsCount} Event${webhookEventsCount > 1 ? 's' : ''}` : 'Active'}
              </span>
            </button>
          </div>

          {/* Active Configuration Screen Underneath */}
          <div className="pt-1">
            {activeTab === 'click-to-call' && (
              <ClickToCallContent
                isWebhookSetup={webhookEventsCount > 0}
                onActivatedChange={(act) => {
                  setIsClickToCallActivated(act);
                  if (act) setIsEnabled(true);
                }}
                onSwitchToWebhook={() => setActiveTab('webhook')}
                onWebhookDetected={() => setWebhookEventsCount((prev) => Math.max(prev, 1))}
              />
            )}
            {activeTab === 'webhook' && (
              <SetupWebhookContent
                onEventsCountChange={setWebhookEventsCount}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SmartfloDialerConfigurationProps {
  onBack: () => void;
}

export default function SmartfloDialerConfiguration({ onBack }: SmartfloDialerConfigurationProps) {
  return (
    <div id="smartflo-dialer-config-container" className="space-y-4">
      <div id="smartflo-dialer-config-header" className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="smartflo-dialer-config-title" className="mt-1 text-xl font-bold text-[#263238]">Smartflo Dialer Configuration</h1>
        </div>
        <button
          type="button"
          id="btn-back-smartflo-dialer"
          onClick={onBack}
          aria-label="Back to Admin Apps"
          title="Back to Admin Apps"
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          <i className="fi flex fi-rr-arrow-left" aria-hidden="true" />
        </button>
      </div>

      <div id="smartflo-dialer-config-sections" className="space-y-4">
        <OutboundSetupSection />

        <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white px-4 py-5 sm:px-6">
          <ConfigurationSection title="Inbound Configuration" description="Incoming call routing details" fields={['Inbound Number', 'Extension Number']} />
          <ConfigurationSection title="API Dialplan Configuration" description="API-based inbound routing and fallback transfer details" fields={['Dialplan ID', 'API Endpoint', 'Fallback Queue ID']} />
        </div>
      </div>
    </div>
  );
}