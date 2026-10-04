import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpDown,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  ExternalLink,
  FileCode,
  Fingerprint,
  Headset,
  Info,
  KeyRound,
  LoaderCircle,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  Radio,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  Smartphone,
  Timer,
  Trash2,
  Users,
  Webhook,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SMARTFLO_EXPIRY_DAYS, normalizeExpiryDays } from '@/lib/smartfloUi';

// Types
export interface SmartfloAgentOption {
  agentId: string;
  userId: string | null;
  agentName: string | null;
  loginId: string | null;
  extension: string | null;
  intercom: string | null;
  followMeNumber: string | null;
  callerId: string | null;
  isActive: boolean;
  c2cRouting?: 'extension' | 'agent' | string | null;
}

export interface CrmUserOption {
  userId: string;
  userName: string | null;
  employeeId: string | null;
  email: string | null;
}

export type RequestParameters = Record<string, string | string[] | null>;

export interface WebhookResponseItem {
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

// -------------------------------------------------------------
// UI Subcomponents: Dropdowns, DatePickers, MultiSelects
// -------------------------------------------------------------

interface CheckboxMultiSelectProps {
  name: string;
  options: { value: string; label: string; detail: string }[];
  selectedValues: string[];
  icon: LucideIcon;
  disabled: boolean;
  onChange: (values: string[]) => void;
}

function CheckboxMultiSelect({
  name,
  options,
  selectedValues,
  icon: Icon,
  disabled,
  onChange,
}: CheckboxMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative min-w-0 space-y-1.5">
      <span className="block text-xs font-semibold text-gray-700">{name}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <Icon className="h-4 w-4 shrink-0 text-gray-400" />
        <span className="min-w-0 flex-1 truncate">
          {selectedValues.length ? `${selectedValues.length} selected` : `Select ${name}`}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          aria-label={name}
          aria-multiselectable="true"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-500">No Smartflo users available.</p>
          ) : (
            <>
              <label
                role="option"
                aria-selected={options.length > 0 && options.every((option) => selectedValues.includes(option.value))}
                className="flex cursor-pointer items-center gap-2 rounded border-b border-gray-100 px-2.5 py-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={options.length > 0 && options.every((option) => selectedValues.includes(option.value))}
                  onChange={(event) =>
                    onChange(event.target.checked ? options.map((option) => option.value) : [])
                  }
                  className="peer sr-only"
                />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-white peer-checked:border-[#4b33e8] peer-checked:bg-[#4b33e8] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4b33e8]/30">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-xs font-semibold text-gray-800">All agents</span>
              </label>
              {options.map((option) => {
                const checked = selectedValues.includes(option.value);
                return (
                  <label
                    key={option.value}
                    role="option"
                    aria-selected={checked}
                    className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        onChange(
                          event.target.checked
                            ? [...selectedValues, option.value]
                            : selectedValues.filter((value) => value !== option.value)
                        );
                      }}
                      className="peer sr-only"
                    />
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-white peer-checked:border-[#4b33e8] peer-checked:bg-[#4b33e8] peer-focus-visible:ring-2 peer-focus-visible:ring-[#4b33e8]/30">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-gray-800">
                        {option.label}
                      </span>
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

function CrmUserMappingDropdown({
  users,
  value,
  disabled,
  onChange,
}: CrmUserMappingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedUser = users.find((user) => user.userId === value);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = normalizedSearch
    ? users.filter((user) =>
        [user.userName, user.employeeId, user.email].some((field) =>
          field?.toLowerCase().includes(normalizedSearch)
        )
      )
    : users;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const chooseUser = (userId: string | null) => {
    onChange(userId);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={dropdownRef} className="relative min-w-0 space-y-1">
      <span className="block text-[11px] font-semibold text-gray-600">Assigned CRM User</span>
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
            ? `${selectedUser.userName || selectedUser.email || selectedUser.userId} · ${selectedUser.employeeId || 'No code'}`
            : 'Not mapped (Select User)'}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && !disabled && (
        <div
          role="dialog"
          aria-label="Map Smartflo agent to CRM user"
          className="absolute inset-x-0 top-full z-40 mt-1 flex max-h-72 flex-col rounded-md border border-gray-200 bg-white p-1 shadow-xl"
        >
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
              className="flex min-h-9 w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
            >
              <span className="text-gray-500 font-medium">Not mapped (None)</span>
              {!value && <Check className="h-3.5 w-3.5 text-[#4b33e8]" />}
            </button>
            {filteredUsers.length === 0 ? (
              <p className="px-2.5 py-3 text-xs text-gray-500">No matching users.</p>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.userId}
                  type="button"
                  role="option"
                  aria-selected={value === user.userId}
                  onClick={() => chooseUser(user.userId)}
                  className="flex min-h-11 w-full items-center justify-between gap-2 rounded px-2.5 py-2 text-left hover:bg-gray-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-gray-800">
                      {user.userName || 'Unnamed user'}
                    </span>
                    <span className="block truncate text-[11px] text-gray-500">
                      Code: {user.employeeId || 'Not set'}
                      {user.email ? ` · ${user.email}` : ''}
                    </span>
                  </span>
                  {value === user.userId && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#4b33e8]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ParameterDropdownProps {
  name: string;
  options: string[];
  icon: LucideIcon;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}function ParameterDropdown({
  name,
  options,
  icon: Icon,
  disabled,
  value,
  onChange,
}: ParameterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative min-w-0 space-y-1.5">
      <span className="block text-xs font-semibold text-gray-700">{name}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-[#4b33e8] focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:hover:border-gray-200"
      >
        <Icon className={`h-4 w-4 shrink-0 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
        <span className={`min-w-0 flex-1 truncate ${value ? 'text-gray-800' : 'text-gray-400'}`}>
          {value || `Select ${name}`}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <ul
          role="listbox"
          aria-label={name}
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
        >
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
                {value === option && <Check className="h-3.5 w-3.5 text-[#4b33e8]" />}
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
        <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose Created At date"
          className="absolute left-0 top-full z-30 mt-1 w-[min(18rem,calc(100vw-3rem))] rounded-md border border-gray-200 bg-white p-3 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((weekday) => (
              <span key={weekday} className="py-1 text-[10px] font-semibold text-gray-400">
                {weekday}
              </span>
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
                  className={`aspect-square rounded text-xs transition-colors ${
                    isSelected ? 'bg-[#4b33e8] font-semibold text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
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

// -------------------------------------------------------------
// TAB 1: Initial Setup (Token Verification & Agent Mapping)
// -------------------------------------------------------------

interface InitialSetupContentProps {
  token: string;
  setToken: (t: string) => void;
  createdDate: string;
  setCreatedDate: (d: string) => void;
  expiryDays: number;
  setExpiryDays: (days: number) => void;
  authStatus: 'idle' | 'checking' | 'verified' | 'error';
  authMessage: string;
  hasSavedToken: boolean;
  hasSavedConfiguration: boolean;
  integrationId: string | null;
  organizationId: string;
  smartfloAgents: SmartfloAgentOption[];
  crmUsers: CrmUserOption[];
  callerIdDrafts: Record<string, string>;
  setCallerIdDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onAuthenticate: (retry?: boolean) => Promise<void>;
  onSaveAgentMapping: (agentId: string, userId: string | null) => Promise<void>;
  onSaveAgentCallerId: (agentId: string) => Promise<void>;
  onRefreshConfiguration: () => Promise<void>;
  onNavigateToClickToCall: () => void;
}

function InitialSetupContent({
  token,
  setToken,
  createdDate,
  setCreatedDate,
  expiryDays,
  setExpiryDays,
  authStatus,
  authMessage,
  hasSavedToken,
  hasSavedConfiguration,
  integrationId,
  organizationId,
  smartfloAgents,
  crmUsers,
  callerIdDrafts,
  setCallerIdDrafts,
  onAuthenticate,
  onSaveAgentMapping,
  onSaveAgentCallerId,
  onRefreshConfiguration,
  onNavigateToClickToCall,
}: InitialSetupContentProps) {
  const [agentSearch, setAgentSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isAuthenticated = authStatus === 'verified';

  const mappedCount = smartfloAgents.filter((a) => Boolean(a.userId)).length;
  const unmappedCount = smartfloAgents.length - mappedCount;

  const normalizedSearch = agentSearch.trim().toLowerCase();
  const filteredAgents = normalizedSearch
    ? smartfloAgents.filter((agent) =>
        [agent.agentName, agent.loginId, agent.agentId, agent.extension, agent.intercom]
          .some((f) => f?.toLowerCase().includes(normalizedSearch))
      )
    : smartfloAgents;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshConfiguration();
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Token Verification & Authentication */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/70 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4b33e8]/10 text-[#4b33e8]">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Token Verification</h2>
              <p className="text-xs text-gray-500">Authenticate API token and sync account.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isAuthenticated
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isAuthenticated ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isAuthenticated ? 'Token Verified' : 'Authentication Required'}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              onChange={(val) => setExpiryDays(Number.parseInt(val, 10))}
            />

            <div className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-semibold text-gray-700">Smartflo API Token</span>
              <div className="flex min-w-0">
                <input
                  type="password"
                  autoComplete="new-password"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder={hasSavedToken ? '••••••••••••••••••••' : 'Enter Smartflo API token'}
                  disabled={authStatus === 'checking'}
                  className="h-11 min-w-0 flex-1 rounded-l-md border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => void onAuthenticate(isAuthenticated || hasSavedConfiguration)}
                  disabled={authStatus === 'checking'}
                  className="inline-flex h-11 shrink-0 items-center gap-1.5 border border-l-0 border-gray-200 bg-gray-50 px-4 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {authStatus === 'checking' ? (
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#4b33e8]" />
                  ) : isAuthenticated || hasSavedConfiguration ? (
                    <RefreshCw className="h-4 w-4 text-[#4b33e8]" />
                  ) : (
                    <KeyRound className="h-4 w-4 text-gray-600" />
                  )}
                  {authStatus === 'checking' ? 'Verifying…' : isAuthenticated || hasSavedConfiguration ? 'Re-verify' : 'Authenticate'}
                </button>
              </div>
            </div>
          </div>

          {authMessage && (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 text-xs ${
                isAuthenticated
                  ? 'border border-emerald-200 bg-emerald-50/80 text-emerald-800'
                  : 'border border-rose-200 bg-rose-50/80 text-rose-700'
              }`}
            >
              {isAuthenticated ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <Info className="h-4 w-4 shrink-0 text-rose-600" />}
              <span>{authMessage}</span>
            </div>
          )}

          {/* Integration & Organization details info box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-xs">
            <div>
              <span className="block text-[11px] font-semibold text-gray-500">Integration ID</span>
              <span className="font-mono text-xs font-medium text-gray-800 truncate block">
                {integrationId || 'Generated on verification'}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-gray-500">Organization ID</span>
              <span className="font-mono text-xs font-medium text-gray-800 truncate block">
                {organizationId || 'Auto-detected'}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-gray-500">Smartflo Sync</span>
              <span className="font-medium text-gray-800">
                {smartfloAgents.length > 0 ? `${smartfloAgents.length} Agents Synced` : 'Pending Authentication'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Agent Mapping Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/70 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4b33e8]/10 text-[#4b33e8]">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Agent Mapping & Caller IDs</h2>
              <p className="text-xs text-gray-500">Map agents to CRM users and caller IDs.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Agents list"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Agent Mapping Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <span className="text-[11px] font-semibold text-gray-500">Total Agents</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-gray-900">{smartfloAgents.length}</span>
                <span className="text-xs text-gray-400">Synced</span>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
              <span className="text-[11px] font-semibold text-emerald-800">Mapped CRM Users</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-emerald-700">{mappedCount}</span>
                <span className="text-xs font-medium text-emerald-600">Active</span>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3">
              <span className="text-[11px] font-semibold text-amber-800">Unmapped</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xl font-bold text-amber-700">{unmappedCount}</span>
                <span className="text-xs font-medium text-amber-600">Pending</span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                placeholder="Search agents by name, ID, or extension…"
                className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10"
              />
            </div>
          </div>

          {/* Agents List */}
          {smartfloAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6 text-center">
              <Headset className="h-7 w-7 text-gray-400" />
              <h4 className="mt-2 text-xs font-bold text-gray-800">No Smartflo Agents Found</h4>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-xs text-gray-500">
              No matching agents.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
              {filteredAgents.map((agent) => {
                const isMapped = Boolean(agent.userId);
                return (
                  <div
                    key={agent.agentId}
                    className="grid grid-cols-1 items-center gap-3 p-3 sm:grid-cols-12 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Agent Details (Col 1-4) */}
                    <div className="min-w-0 sm:col-span-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            isMapped ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        />
                        <p className="truncate text-xs font-bold text-gray-900">
                          {agent.agentName || agent.loginId || `Agent ${agent.agentId}`}
                        </p>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                        <span className="font-mono font-medium text-gray-700">ID: {agent.agentId}</span>
                        {agent.extension && <span>· Ext: {agent.extension}</span>}
                        {agent.intercom && <span>· Intercom: {agent.intercom}</span>}
                      </div>
                    </div>

                    {/* CRM User Mapping (Col 5-8) */}
                    <div className="min-w-0 sm:col-span-4">
                      <CrmUserMappingDropdown
                        users={crmUsers}
                        value={agent.userId}
                        disabled={!isAuthenticated}
                        onChange={(userId) => void onSaveAgentMapping(agent.agentId, userId)}
                      />
                    </div>

                    {/* Caller ID / Forward Number (Col 9-12) */}
                    <div className="min-w-0 sm:col-span-4">
                      <label className="min-w-0 space-y-1 block">
                        <span className="block text-[11px] font-semibold text-gray-600">
                          DID / Forward Caller ID
                        </span>
                        <input
                          type="tel"
                          value={callerIdDrafts[agent.agentId] ?? ''}
                          onChange={(e) =>
                            setCallerIdDrafts((prev) => ({ ...prev, [agent.agentId]: e.target.value }))
                          }
                          onBlur={() => void onSaveAgentCallerId(agent.agentId)}
                          placeholder="Optional DID override"
                          disabled={!isAuthenticated}
                          className="h-10 w-full min-w-0 rounded-md border border-gray-200 px-3 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-3 sm:px-6 flex items-center justify-end">
          <button
            type="button"
            onClick={onNavigateToClickToCall}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4b33e8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3b25d1] transition-colors"
          >
            <span>Proceed to Click to Call</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 2: Click to Call (Setup, Request Config, Extension & Forward)
// -------------------------------------------------------------

interface ClickToCallTabContentProps {
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => Promise<void>;
  isToggling: boolean;
  isActivated: boolean;
  token: string;
  authStatus: 'idle' | 'checking' | 'verified' | 'error';
  integrationId: string | null;
  smartfloAgents: SmartfloAgentOption[];
  crmUsers: CrmUserOption[];
  selectedParameters: RequestParameters;
  selectedAgentNumbers: string[];
  callerId: string;
  callerIdDrafts: Record<string, string>;
  setCallerId: (cid: string) => void;
  onSaveParameters: (params: RequestParameters) => Promise<void>;
  onTestCall: (destination: string) => Promise<void>;
  testCallStatus: 'idle' | 'sending' | 'error';
  testCallMessage: string;
  testCallDetails: { message: string; refId: string | null; callId: string | null } | null;
  isWebhookActive: boolean;
  onSwitchToWebhook: () => void;
  onSwitchToInitialSetup: () => void;
  onUpdateGlobalRoutingMode: (mode: 'extension_first' | 'caller_forward_first') => Promise<void>;
  onUpdateAgentRouting: (agentId: string, routing: 'extension' | 'agent') => Promise<void>;
}

function ClickToCallTabContent({
  isEnabled,
  onToggleEnabled,
  isToggling,
  isActivated,
  authStatus,
  integrationId,
  smartfloAgents,
  crmUsers,
  selectedParameters,
  selectedAgentNumbers,
  callerId,
  callerIdDrafts,
  setCallerId,
  onSaveParameters,
  onTestCall,
  testCallStatus,
  testCallMessage,
  testCallDetails,
  isWebhookActive,
  onSwitchToWebhook,
  onSwitchToInitialSetup,
  onUpdateGlobalRoutingMode,
  onUpdateAgentRouting,
}: ClickToCallTabContentProps) {
  const [requestView, setRequestView] = useState<'html' | 'json'>('html');
  const [testDestinationNumber, setTestDestinationNumber] = useState('9217175080');
  const [copiedField, setCopiedField] = useState<'ref' | 'call' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [callExtensionMode, setCallExtensionMode] = useState<'extension_first' | 'caller_forward_first' | 'custom'>(() => {
    const saved = typeof selectedParameters.routing_mode === 'string' ? selectedParameters.routing_mode : '';
    if (saved === 'caller_forward_first' || saved === 'custom') return saved;
    return 'extension_first';
  });
  const [updatingAgentId, setUpdatingAgentId] = useState<string | null>(null);
  const [isRoutingUpdating, setIsRoutingUpdating] = useState(false);
  const [routingSearchQuery, setRoutingSearchQuery] = useState('');
  const [routingSortBy, setRoutingSortBy] = useState<'name' | 'empId' | 'extension' | 'routing'>('name');
  const [routingSortOrder, setRoutingSortOrder] = useState<'asc' | 'desc'>('asc');

  const mappedAgents = smartfloAgents.filter((agent) => Boolean(agent.userId));

  const filteredAndSortedAgents = mappedAgents
    .filter((agent) => {
      if (!routingSearchQuery.trim()) return true;
      const query = routingSearchQuery.toLowerCase().trim();
      const crmUser = crmUsers.find((u) => u.userId === agent.userId);
      const nameMatch = (agent.agentName || '').toLowerCase().includes(query);
      const loginIdMatch = (agent.loginId || '').toLowerCase().includes(query);
      const agentIdMatch = (agent.agentId || '').toLowerCase().includes(query);
      const extMatch = (agent.extension || '').toLowerCase().includes(query);
      const crmUserNameMatch = (crmUser?.userName || '').toLowerCase().includes(query);
      const crmEmpIdMatch = (crmUser?.employeeId || '').toLowerCase().includes(query);
      const crmEmailMatch = (crmUser?.email || '').toLowerCase().includes(query);
      return (
        nameMatch ||
        loginIdMatch ||
        agentIdMatch ||
        extMatch ||
        crmUserNameMatch ||
        crmEmpIdMatch ||
        crmEmailMatch
      );
    })
    .sort((a, b) => {
      const crmUserA = crmUsers.find((u) => u.userId === a.userId);
      const crmUserB = crmUsers.find((u) => u.userId === b.userId);
      let comparison = 0;

      if (routingSortBy === 'name') {
        const nameA = (a.agentName || a.loginId || a.agentId).toLowerCase();
        const nameB = (b.agentName || b.loginId || b.agentId).toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (routingSortBy === 'empId') {
        const empA = (crmUserA?.employeeId || crmUserA?.userName || '').toLowerCase();
        const empB = (crmUserB?.employeeId || crmUserB?.userName || '').toLowerCase();
        comparison = empA.localeCompare(empB);
      } else if (routingSortBy === 'extension') {
        const extA = (a.extension || '').toLowerCase();
        const extB = (b.extension || '').toLowerCase();
        comparison = extA.localeCompare(extB);
      } else if (routingSortBy === 'routing') {
        const routeA = a.c2cRouting === 'agent' ? 'agent' : 'extension';
        const routeB = b.c2cRouting === 'agent' ? 'agent' : 'extension';
        comparison = routeA.localeCompare(routeB);
      }

      return routingSortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleRoutingSort = (column: 'name' | 'empId' | 'extension' | 'routing') => {
    if (routingSortBy === column) {
      setRoutingSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setRoutingSortBy(column);
      setRoutingSortOrder('asc');
    }
  };

  const isAuthenticated = authStatus === 'verified';
  const effectiveCallerId =
    callerId.trim() ||
    (selectedAgentNumbers.length ? callerIdDrafts[selectedAgentNumbers[0]]?.trim() || '' : '');

  const copyToClipboard = async (text: string, field: 'ref' | 'call') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleParamChange = async (updates: Partial<RequestParameters>) => {
    setIsSaving(true);
    const next = { ...selectedParameters, agent_number: selectedAgentNumbers, ...updates };
    await onSaveParameters(next);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Master Outbound Click to Call Toggle & Status Banner */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                isEnabled ? 'bg-[#4b33e8] text-white shadow-xs' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Click to Call Outbound Service</h2>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    isEnabled
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-gray-200 bg-gray-100 text-gray-600'
                  }`}
                >
                  {isEnabled ? 'Service Active' : 'Service Disabled'}
                </span>
                {isActivated && (
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700">
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Enable one-click calling from CRM lead profiles.
              </p>
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
              onClick={() => void onToggleEnabled(!isEnabled)}
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

        {!isAuthenticated && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-amber-600" />
              <span>Token authentication required in <strong>Initial Setup</strong> before outgoing calls can be made.</span>
            </div>
            <button
              type="button"
              onClick={onSwitchToInitialSetup}
              className="font-bold text-[#4b33e8] hover:underline shrink-0"
            >
              Initial Setup &rarr;
            </button>
          </div>
        )}
      </div>

      {/* 2. Extension & Forward Routing (Full Width Section) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4b33e8]/10 text-[#4b33e8]">
              <PhoneForwarded className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Extension & Forward Routing</h2>
                {isRoutingUpdating && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4b33e8]/10 px-2 py-0.5 text-[10px] font-semibold text-[#4b33e8]">
                    <LoaderCircle className="h-3 w-3 animate-spin" />
                    Updating Routing...
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Choose how outbound Click-to-Call connects mapped agents — via Softphone extension, registered mobile SIM, or per-agent rules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Mode:</span>
            <span className="font-semibold text-gray-800">
              {callExtensionMode === 'extension_first'
                ? 'All Agents (Extension)'
                : callExtensionMode === 'caller_forward_first'
                ? 'All Agents (Mobile Forward)'
                : 'Custom Agent-Wise'}
            </span>
          </div>
        </div>

        {/* 3 Interactive Mode Cards without Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Option 1: All Extension */}
          <div
            onClick={async () => {
              if (callExtensionMode === 'extension_first' || isRoutingUpdating) return;
              setCallExtensionMode('extension_first');
              setIsRoutingUpdating(true);
              try {
                await onUpdateGlobalRoutingMode('extension_first');
                await onSaveParameters({ routing_mode: 'extension_first' });
              } finally {
                setIsRoutingUpdating(false);
              }
            }}
            className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
              callExtensionMode === 'extension_first'
                ? 'border-[#4b33e8] bg-[#4b33e8]/5 shadow-xs ring-2 ring-[#4b33e8]/20'
                : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
            } ${isRoutingUpdating ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    callExtensionMode === 'extension_first'
                      ? 'bg-[#4b33e8] text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Headset className="h-4 w-4" />
                </div>
                <input
                  type="radio"
                  name="call_routing_mode_grid"
                  checked={callExtensionMode === 'extension_first'}
                  readOnly
                  className="text-[#4b33e8] focus:ring-[#4b33e8]"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Call at Agent Extension</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                  All mapped agents receive calls on their Softphone / WebRTC browser client.
                </p>
              </div>
            </div>
          </div>

          {/* Option 2: All Mobile */}
          <div
            onClick={async () => {
              if (callExtensionMode === 'caller_forward_first' || isRoutingUpdating) return;
              setCallExtensionMode('caller_forward_first');
              setIsRoutingUpdating(true);
              try {
                await onUpdateGlobalRoutingMode('caller_forward_first');
                await onSaveParameters({ routing_mode: 'caller_forward_first' });
              } finally {
                setIsRoutingUpdating(false);
              }
            }}
            className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
              callExtensionMode === 'caller_forward_first'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
            } ${isRoutingUpdating ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    callExtensionMode === 'caller_forward_first'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                </div>
                <input
                  type="radio"
                  name="call_routing_mode_grid"
                  checked={callExtensionMode === 'caller_forward_first'}
                  readOnly
                  className="text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Forward to Agent Mobile Number</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                  All mapped agents receive calls on their registered mobile SIM phone number.
                </p>
              </div>
            </div>
          </div>

          {/* Option 3: Custom Per-Agent */}
          <div
            onClick={async () => {
              if (callExtensionMode === 'custom' || isRoutingUpdating) return;
              setCallExtensionMode('custom');
              await onSaveParameters({ routing_mode: 'custom' });
            }}
            className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
              callExtensionMode === 'custom'
                ? 'border-purple-600 bg-purple-50/40 shadow-xs ring-2 ring-purple-600/20'
                : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
            } ${isRoutingUpdating ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    callExtensionMode === 'custom'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Sliders className="h-4 w-4" />
                </div>
                <input
                  type="radio"
                  name="call_routing_mode_grid"
                  checked={callExtensionMode === 'custom'}
                  readOnly
                  className="text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Custom Agent-Wise Routing</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                  Assign individual routing (Extension or Mobile) per mapped agent in the table below.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapped Agents Table when Custom Routing is Selected */}
        {callExtensionMode === 'custom' && (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            {/* Table Toolbar with Search Bar */}
            <div className="border-b border-gray-200 bg-gray-50/80 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  Mapped Agents ({filteredAndSortedAgents.length}
                  {routingSearchQuery ? ` of ${mappedAgents.length}` : ''})
                </h3>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  value={routingSearchQuery}
                  onChange={(e) => setRoutingSearchQuery(e.target.value)}
                  placeholder="Search agent, emp code, extension..."
                  className="h-8 w-full rounded-md border border-gray-200 bg-white pl-8 pr-7 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8]"
                />
                {routingSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setRoutingSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {mappedAgents.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No mapped agents found. Please map agents in the Initial Setup tab first.
              </div>
            ) : filteredAndSortedAgents.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No mapped agents matching &ldquo;{routingSearchQuery}&rdquo;
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50/90 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <tr>
                      {/* Sortable: Agent */}
                      <th
                        scope="col"
                        onClick={() => toggleRoutingSort('name')}
                        className="px-5 py-3 cursor-pointer hover:bg-gray-100/80 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Agent</span>
                          {routingSortBy === 'name' ? (
                            routingSortOrder === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5 text-purple-600" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-purple-600" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </th>

                      {/* Sortable: User */}
                      <th
                        scope="col"
                        onClick={() => toggleRoutingSort('empId')}
                        className="px-5 py-3 cursor-pointer hover:bg-gray-100/80 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>User</span>
                          {routingSortBy === 'empId' ? (
                            routingSortOrder === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5 text-purple-600" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-purple-600" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </th>

                      {/* Sortable: Extension */}
                      <th
                        scope="col"
                        onClick={() => toggleRoutingSort('extension')}
                        className="px-5 py-3 cursor-pointer hover:bg-gray-100/80 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Extension</span>
                          {routingSortBy === 'extension' ? (
                            routingSortOrder === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5 text-purple-600" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-purple-600" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </th>

                      {/* Sortable: Status */}
                      <th
                        scope="col"
                        onClick={() => toggleRoutingSort('routing')}
                        className="px-5 py-3 text-center cursor-pointer hover:bg-gray-100/80 transition-colors select-none"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span>Status</span>
                          {routingSortBy === 'routing' ? (
                            routingSortOrder === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5 text-purple-600" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-purple-600" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </th>

                      <th scope="col" className="px-5 py-3 text-right">Routing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredAndSortedAgents.map((agent) => {
                      const crmUser = crmUsers.find((u) => u.userId === agent.userId);
                      const currentRouting = agent.c2cRouting === 'agent' ? 'agent' : 'extension';
                      const isAgentUpdating = updatingAgentId === agent.agentId;

                      return (
                        <tr key={agent.agentId} className="hover:bg-gray-50/60 transition-colors">
                          {/* Agent Name & ID (Clean - no badge) */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                                {(agent.agentName || agent.loginId || 'A')[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">
                                  {agent.agentName || agent.loginId || `Agent ${agent.agentId}`}
                                </div>
                                {agent.loginId && (
                                  <div className="text-[11px] text-gray-500">
                                    {agent.loginId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CRM User Name + Employee Code (Clean - no badge) */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {crmUser ? (
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {crmUser.userName || crmUser.email}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {crmUser.employeeId ? (
                                    <span>Emp Code: <strong className="font-medium text-gray-700">{crmUser.employeeId}</strong></span>
                                  ) : (
                                    <span>{crmUser.email || 'No Employee Code'}</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Unmapped</span>
                            )}
                          </td>

                          {/* Smartflo Extension / Agent ID (Clean - no badge) */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="font-mono text-xs text-gray-800">
                              Ext: {agent.extension || 'N/A'}
                            </div>
                            <div className="font-mono text-[11px] text-gray-400">
                              ID: {agent.agentId}
                            </div>
                          </td>

                          {/* Active Routing Dot Indicator (Clean - no badge) */}
                          <td className="px-5 py-3.5 whitespace-nowrap text-center">
                            {currentRouting === 'extension' ? (
                              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                Extension
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                                Mobile SIM
                              </div>
                            )}
                          </td>

                          {/* Interactive Dual Toggle Control */}
                          <td className="px-5 py-3.5 whitespace-nowrap text-right">
                            <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-100/90 p-0.5 shadow-2xs">
                              {/* Option 1: Extension */}
                              <button
                                type="button"
                                disabled={isAgentUpdating || isRoutingUpdating}
                                onClick={async () => {
                                  if (currentRouting === 'extension') return;
                                  setUpdatingAgentId(agent.agentId);
                                  try {
                                    await onUpdateAgentRouting(agent.agentId, 'extension');
                                  } finally {
                                    setUpdatingAgentId(null);
                                  }
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                  currentRouting === 'extension'
                                    ? 'bg-white text-[#4b33e8] shadow-xs ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                              >
                                {isAgentUpdating && currentRouting !== 'extension' ? (
                                  <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#4b33e8]" />
                                ) : (
                                  <Headset className={`h-3.5 w-3.5 ${currentRouting === 'extension' ? 'text-[#4b33e8]' : 'text-gray-400'}`} />
                                )}
                                <span>Extension</span>
                              </button>

                              {/* Option 2: Mobile */}
                              <button
                                type="button"
                                disabled={isAgentUpdating || isRoutingUpdating}
                                onClick={async () => {
                                  if (currentRouting === 'agent') return;
                                  setUpdatingAgentId(agent.agentId);
                                  try {
                                    await onUpdateAgentRouting(agent.agentId, 'agent');
                                  } finally {
                                    setUpdatingAgentId(null);
                                  }
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                                  currentRouting === 'agent'
                                    ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                              >
                                {isAgentUpdating && currentRouting !== 'agent' ? (
                                  <LoaderCircle className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                                ) : (
                                  <Smartphone className={`h-3.5 w-3.5 ${currentRouting === 'agent' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                )}
                                <span>Mobile</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Request Configuration & Live Dial Console */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <div className="border-b border-gray-200 bg-gray-50/70 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Request Configuration</h2>
            <p className="mt-0.5 text-xs text-gray-500">Configure parameters and test live dialing.</p>
          </div>

          <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5" role="group">
            {(['html', 'json'] as const).map((view) => (
              <button
                key={view}
                type="button"
                aria-pressed={requestView === view}
                onClick={() => setRequestView(view)}
                className={`rounded px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                  requestView === view ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y divide-gray-200 lg:divide-x lg:divide-y-0">
          {/* Left Column: API Specs & Info (Col 1-4) */}
          <div className="space-y-5 p-5 sm:p-6 lg:col-span-4 bg-white">
            <section className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                API Endpoint Details
              </h3>
              <dl className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-gray-50/80">
                <div className="space-y-1 p-2.5">
                  <dt className="text-[10px] font-semibold uppercase text-gray-500">URL</dt>
                  <dd className="break-all font-mono text-xs text-gray-800 select-all">
                    https://api-smartflo.tatateleservices.com/v1/click_to_call
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 p-2.5">
                  <dt className="text-[10px] font-semibold uppercase text-gray-500">Method</dt>
                  <dd className="rounded bg-white px-2 py-0.5 font-mono text-xs font-semibold text-gray-800 border border-gray-200">
                    POST
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 p-2.5">
                  <dt className="text-[10px] font-semibold uppercase text-gray-500">Content-Type</dt>
                  <dd className="text-right font-mono text-xs text-gray-800">application/json</dd>
                </div>
              </dl>
            </section>

            <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3.5 space-y-1.5 text-xs text-blue-900">
              <div className="flex items-center gap-2 font-bold text-blue-950">
                <Info className="h-4 w-4 text-blue-600 shrink-0" />
                <span>One-Click Dialing</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800">
                Click-to-Call connects the assigned agent first (via Softphone or Mobile SIM based on your routing above), then originates outbound to customer phone.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Parameter Setup & Live Test (Col 5-12) */}
          <div className="space-y-5 p-5 sm:p-6 lg:col-span-8 bg-gray-50/40">
            {requestView === 'html' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Agent / Extension Selector */}
                  <CheckboxMultiSelect
                    name="agent_number (Select Agents)"
                    options={smartfloAgents.map((agent) => ({
                      value: agent.agentId,
                      label: agent.agentName || agent.loginId || `Agent ${agent.agentId}`,
                      detail: `Ext: ${agent.extension || agent.agentId} · ID: ${agent.agentId}`,
                    }))}
                    selectedValues={selectedAgentNumbers}
                    icon={Headset}
                    disabled={!isAuthenticated || isSaving}
                    onChange={(values) => {
                      void handleParamChange({ agent_number: values });
                    }}
                  />

                  {/* Shared Caller ID */}
                  <div className="min-w-0 space-y-1.5">
                    <label htmlFor="smartflo-shared-caller-id" className="block text-xs font-semibold text-gray-700">
                      caller_id (Shared DID)
                    </label>
                    <input
                      id="smartflo-shared-caller-id"
                      type="tel"
                      value={callerId}
                      onChange={(event) => setCallerId(event.target.value)}
                      onBlur={() =>
                        void handleParamChange({
                          caller_id: callerId.trim() || null,
                        })
                      }
                      placeholder="e.g. 919876543210"
                      disabled={!isAuthenticated || isSaving}
                      className="h-11 min-w-0 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                    />
                  </div>

                  {/* Parameters */}
                  {[
                    {
                      name: 'destination_number',
                      label: 'destination_number',
                      options: ['CRM lead phone number', 'Manual dial number'],
                      icon: Phone,
                    },
                    {
                      name: 'async',
                      label: 'async',
                      options: ['true', 'false'],
                      icon: Zap,
                    },
                    {
                      name: 'custom_identifier',
                      label: 'custom_identifier',
                      options: ['Customer ID', 'Campaign ID'],
                      icon: Fingerprint,
                    },
                    {
                      name: 'call_timeout',
                      label: 'call_timeout',
                      options: ['30 seconds', '60 seconds', '90 seconds'],
                      icon: Timer,
                    },
                  ].map(({ name, label, options, icon }) => (
                    <ParameterDropdown
                      key={name}
                      name={label}
                      options={options}
                      icon={icon}
                      disabled={!isAuthenticated || isSaving}
                      value={
                        typeof selectedParameters[name] === 'string'
                          ? (selectedParameters[name] as string)
                          : ''
                      }
                      onChange={(value) => {
                        void handleParamChange({ [name]: value });
                      }}
                    />
                  ))}
                </div>

                {/* Live Test Call Console */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                      Live Test Call
                    </h3>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                      DID: {effectiveCallerId || 'None'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <label htmlFor="smartflo-test-destination-number" className="block text-xs font-semibold text-gray-700">
                        Test Destination Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          id="smartflo-test-destination-number"
                          type="tel"
                          value={testDestinationNumber}
                          onChange={(e) => setTestDestinationNumber(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          disabled={!isAuthenticated || testCallStatus === 'sending'}
                          className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#4b33e8] focus:ring-2 focus:ring-[#4b33e8]/10 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void onTestCall(testDestinationNumber)}
                      disabled={
                        !isAuthenticated ||
                        !selectedAgentNumbers.length ||
                        !effectiveCallerId ||
                        !testDestinationNumber.trim() ||
                        testCallStatus === 'sending'
                      }
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {testCallStatus === 'sending' ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <PhoneCall className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span>Test Call</span>
                    </button>
                  </div>

                  {testCallStatus === 'sending' && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5" role="status">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#4b33e8]" />
                      Originate request dispatched to Smartflo…
                    </p>
                  )}

                  {testCallStatus === 'error' && (
                    <p className="text-xs text-rose-600" role="status">
                      {testCallMessage}
                    </p>
                  )}

                  {/* Test Call Details & Live Ref/Call ID Resolution */}
                  {testCallDetails && (
                    <div
                      className={`rounded-lg border p-3.5 space-y-3 ${
                        isWebhookActive ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-bold text-gray-900">
                            {testCallDetails.message || 'Originate Queued Successfully'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={onSwitchToWebhook}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#4b33e8] hover:underline"
                        >
                          <span>View in Webhook Logs</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="rounded border border-gray-200 bg-white p-2 flex items-center justify-between">
                          <span className="text-gray-500">Ref ID:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-semibold text-gray-800">
                              {testCallDetails.refId || 'N/A'}
                            </span>
                            {testCallDetails.refId && (
                              <button
                                type="button"
                                onClick={() => void copyToClipboard(testCallDetails.refId!, 'ref')}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {copiedField === 'ref' ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3 text-gray-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="rounded border border-gray-200 bg-white p-2 flex items-center justify-between">
                          <span className="text-gray-500">Call ID:</span>
                          <div className="flex items-center gap-1">
                            {testCallDetails.callId ? (
                              <>
                                <span className="font-mono font-semibold text-emerald-700">
                                  {testCallDetails.callId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => void copyToClipboard(testCallDetails.callId!, 'call')}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  {copiedField === 'call' ? (
                                    <Check className="h-3 w-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3 w-3 text-gray-400" />
                                  )}
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] italic text-amber-700 flex items-center gap-1">
                                <LoaderCircle className="h-3 w-3 animate-spin" />
                                Waiting for webhook response…
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <pre className="max-h-[30rem] overflow-auto rounded-lg border border-gray-200 bg-stone-900 p-4 font-mono text-xs leading-relaxed text-emerald-400">
                <code>
                  {JSON.stringify(
                    {
                      agent_number: selectedAgentNumbers,
                      destination_number:
                        selectedParameters.destination_number === 'Manual dial number'
                          ? 'Manual dial number'
                          : '{customer.phone}',
                      caller_id: effectiveCallerId || null,
                      async: selectedParameters.async || 'false',
                      custom_identifier:
                        selectedParameters.custom_identifier === 'Campaign ID'
                          ? '{campaign.id}'
                          : '{customer.id}',
                      call_timeout: selectedParameters.call_timeout || '30 seconds',
                      routing_mode: callExtensionMode,
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 3: Dialplan (API Dialplan & Inbound Routing)
// -------------------------------------------------------------

interface DialplanContentProps {
  organizationId: string;
  integrationId: string | null;
  webhookId: string | null;
  isDialplanActive: boolean;
  onToggleDialplan: (active: boolean) => void;
  isToggling?: boolean;
  smartfloAgents: SmartfloAgentOption[];
  crmUsers: CrmUserOption[];
  fallbackAgentId: string | null;
  onSaveFallbackAgent: (agentId: string | null) => Promise<void>;
  isSavingFallbackAgent?: boolean;
}

function DialplanContent({
  organizationId,
  integrationId,
  webhookId,
  isDialplanActive,
  onToggleDialplan,
  isToggling = false,
  smartfloAgents,
  crmUsers,
  fallbackAgentId,
  onSaveFallbackAgent,
  isSavingFallbackAgent = false,
}: DialplanContentProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selectedCrmUser = crmUsers.find(
    (u) => u.userId === fallbackAgentId
  ) || (fallbackAgentId ? crmUsers.find((u) => {
    const agent = smartfloAgents.find(a => a.agentId === fallbackAgentId);
    return agent && agent.userId === u.userId;
  }) : null);

  const selectedFallbackAgent = selectedCrmUser
    ? smartfloAgents.find((agent) => agent.userId === selectedCrmUser.userId)
    : (fallbackAgentId ? smartfloAgents.find((agent) => agent.agentId === fallbackAgentId) : null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const mappedUsers = (() => {
    const seen = new Set<string>();
    return smartfloAgents
      .filter((agent) => Boolean(agent.userId) && agent.isActive)
      .filter((agent) => {
        if (seen.has(agent.userId!)) return false;
        seen.add(agent.userId!);
        return true;
      })
      .map((agent) => {
        const user = crmUsers.find((u) => u.userId === agent.userId);
        return {
          userId: agent.userId!,
          userName: user?.userName || user?.email || agent.agentName || agent.loginId || 'CRM User',
          email: user?.email || '',
          employeeId: user?.employeeId || '',
          extension: agent.extension || '',
          phone: agent.followMeNumber || agent.callerId || '',
          agentId: agent.agentId,
        };
      });
  })();

  const filteredUsers = mappedUsers.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.userName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.employeeId.toLowerCase().includes(q) ||
      u.extension.toLowerCase().includes(q)
    );
  });

  const domain = 'https://www.rynxly.in';
  const dialplanEndpoint =
    organizationId && webhookId
      ? `${domain}/webhook/${organizationId}/${webhookId}`
      : `${domain}/webhook/${organizationId || 'org_id'}/${webhookId || 'webhook_id'}`;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  const headersList = [
    {
      key: 'call_type',
      value: 'rynxly_inbound',
      description: 'Identifies incoming inbound call for CRM dynamic agent routing',
    },
    {
      key: 'integration_id',
      value: integrationId || 'integration_default',
      description: 'Smartflo integration identifier for your organization',
    },
    {
      key: 'webhook_id',
      value: webhookId || 'webhook_default',
      description: 'Webhook ID to record inbound call logs and lifecycle events',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Status Banner */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                isDialplanActive ? 'bg-[#4b33e8] text-white shadow-xs' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Tata Smartflo Inbound API Dialplan</h2>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    isDialplanActive
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-gray-200 bg-gray-100 text-gray-600'
                  }`}
                >
                  {isDialplanActive ? 'Service Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Dynamic inbound call routing to assigned CRM lead owners.
              </p>
            </div>
          </div>

          {/* Active / Inactive Toggle Switch */}
          <div className="flex items-center gap-3">
            {isToggling && <LoaderCircle className="h-4 w-4 animate-spin text-[#4b33e8]" />}
            <span className="text-xs font-semibold text-gray-700">
              {isDialplanActive ? 'Active' : 'Inactive'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isDialplanActive}
              aria-label="Toggle Dialplan Routing Active State"
              disabled={isToggling}
              onClick={() => onToggleDialplan(!isDialplanActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                isDialplanActive ? 'bg-[#4b33e8]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isDialplanActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {!isDialplanActive && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
            <Info className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Dialplan dynamic routing is currently <strong>Inactive</strong>.</span>
          </div>
        )}
      </div>

      {/* 2. Fallback Inbound Agent Selector Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Headset className="h-4 w-4 text-[#4b33e8]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Fallback Inbound Agent
              </h3>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              When an inbound call comes from an unassigned lead or new customer, the call will be forwarded to this Fallback Agent.
            </p>
          </div>
          {isSavingFallbackAgent && (
            <span className="flex items-center gap-1.5 text-xs text-[#4b33e8] font-semibold">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Select Fallback Agent (Rynxly User)
            </label>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                disabled={isSavingFallbackAgent}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-left text-xs font-medium text-gray-800 shadow-2xs transition-all hover:border-gray-400 focus:border-[#4b33e8] focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {selectedCrmUser ? (
                    <>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4b33e8]/10 text-[11px] font-bold text-[#4b33e8]">
                        {(selectedCrmUser.userName || selectedCrmUser.email || 'U').charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 truncate">
                          {selectedCrmUser.userName || selectedCrmUser.email}
                        </span>
                        {selectedCrmUser.employeeId && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-600">
                            Emp: {selectedCrmUser.employeeId}
                          </span>
                        )}
                        {selectedFallbackAgent?.extension && (
                          <span className="font-mono text-[11px] text-gray-500">
                            · Ext: {selectedFallbackAgent.extension}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Users className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-semibold text-gray-800">
                        Auto Round-Robin (All Active Mapped Agents)
                      </span>
                    </>
                  )}
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-150 ${
                    isDropdownOpen ? 'rotate-180 text-[#4b33e8]' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
                  {mappedUsers.length > 4 && (
                    <div className="border-b border-gray-100 p-2">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search mapped agent or emp code..."
                          className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-3 text-xs text-gray-800 outline-none focus:border-[#4b33e8] focus:bg-white"
                        />
                      </div>
                    </div>
                  )}

                  <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                    {/* Option 1: Auto Round-Robin */}
                    <button
                      type="button"
                      onClick={() => {
                        void onSaveFallbackAgent(null);
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                        !selectedCrmUser
                          ? 'bg-[#4b33e8]/[0.08] text-[#4b33e8] font-semibold'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <Users className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="block font-bold text-gray-900">Auto Round-Robin</span>
                          <span className="block text-[10px] text-gray-500">
                            Distribute unassigned calls to all active mapped agents
                          </span>
                        </div>
                      </div>
                      {!selectedCrmUser && <Check className="h-4 w-4 shrink-0 text-[#4b33e8]" />}
                    </button>

                    {/* Mapped Users List */}
                    {filteredUsers.map((user) => {
                      const isSelected = selectedCrmUser?.userId === user.userId;
                      return (
                        <button
                          key={user.userId}
                          type="button"
                          onClick={() => {
                            void onSaveFallbackAgent(user.userId);
                            setIsDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-[#4b33e8]/[0.08] text-[#4b33e8] font-semibold'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4b33e8]/10 text-xs font-bold text-[#4b33e8]">
                              {user.userName.charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-gray-900 truncate">{user.userName}</span>
                                {user.employeeId && (
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600">
                                    Emp: {user.employeeId}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                {user.extension && <span>Ext: {user.extension}</span>}
                                {user.phone && <span>· {user.phone}</span>}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="h-4 w-4 shrink-0 text-[#4b33e8]" />}
                        </button>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <div className="p-3 text-center text-xs text-gray-500">
                        {searchQuery ? 'No matching mapped agents found.' : 'No active mapped agents available.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              {selectedCrmUser
                ? `Selected Rynxly User (${selectedCrmUser.userName || selectedCrmUser.email}) will receive unassigned inbound calls.`
                : 'If no specific user is selected, incoming calls will automatically be distributed round-robin among active mapped CRM users.'}
            </p>
          </div>

          {/* Current Target Summary Card */}
          <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-3.5 text-xs space-y-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Current Target
            </span>
            {selectedCrmUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4b33e8]/10 text-xs font-bold text-[#4b33e8]">
                      {(selectedCrmUser.userName || selectedCrmUser.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block leading-tight">
                        {selectedCrmUser.userName || 'Rynxly User'}
                      </span>
                      {selectedCrmUser.employeeId && (
                        <span className="text-[10px] font-mono text-gray-500">
                          Emp Code: {selectedCrmUser.employeeId}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                    Active Target
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1.5 border-t border-gray-200/60">
                  <div>
                    <span className="text-gray-400">Extension:</span>{' '}
                    <span className="font-mono font-bold text-gray-800">{selectedFallbackAgent?.extension || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>{' '}
                    <span className="font-mono font-bold text-gray-800">{selectedFallbackAgent?.followMeNumber || selectedFallbackAgent?.callerId || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Rynxly User ID:</span>{' '}
                    <span className="font-mono font-medium text-gray-700 select-all">{selectedCrmUser.userId}</span>
                  </div>
                  {selectedCrmUser.email && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Email:</span>{' '}
                      <span className="font-medium text-gray-700">{selectedCrmUser.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Auto Round-Robin</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800">
                    Default
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Unassigned incoming calls will bridge to the first available active CRM user in your organization.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. API Endpoint Details (Full Width) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-[#4b33e8]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                CRM API Dialplan &amp; Webhook Endpoint
              </h3>
            </div>
            <p className="mt-1 font-mono text-[11px] text-gray-500">
              Webhook ID: <span className="font-bold text-gray-700">{webhookId || 'Auto Generated'}</span> · Org: <span className="font-bold text-gray-700">{organizationId || 'Auto Detected'}</span>
            </p>
          </div>
          <span className="text-xs text-gray-500">
            Paste this endpoint into your Tata Smartflo API Dialplan URL configuration
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={dialplanEndpoint}
              className="h-11 flex-1 rounded-lg border border-gray-200 bg-gray-50/80 px-3.5 font-mono text-xs text-gray-800 outline-none select-all focus:border-[#4b33e8]"
            />
            <button
              type="button"
              onClick={() => void copyToClipboard(dialplanEndpoint, 'endpoint')}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
            >
              {copiedField === 'endpoint' ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Endpoint</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
            <div>
              <span className="font-semibold text-gray-700">Method:</span>{' '}
              <span className="font-mono font-medium text-gray-800">POST / GET</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Content-Type:</span>{' '}
              <span className="font-mono font-medium text-gray-800">application/json</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Required Headers / Parameters Card (Full Width) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#4b33e8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Required Headers / Parameters
            </h3>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Add these headers or query parameters in your Tata Smartflo API Dialplan configuration:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th scope="col" className="px-4 py-3">Header / Key</th>
                <th scope="col" className="px-4 py-3">Value</th>
                <th scope="col" className="px-4 py-3">Description</th>
                <th scope="col" className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-mono">
              {headersList.map((header) => (
                <tr key={header.key} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap font-bold text-gray-900 font-sans">
                    {header.key}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-800 font-semibold select-all">
                    {header.value}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 font-sans text-xs">
                    {header.description}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right font-sans">
                    <button
                      type="button"
                      onClick={() => void copyToClipboard(header.value, header.key)}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      {copiedField === header.key ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                      <span>{copiedField === header.key ? 'Copied' : 'Copy'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Setup Guide (Full Width) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#4b33e8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Tata Smartflo Dialplan Setup Guide
            </h3>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Step-by-step instructions to configure dynamic inbound call routing in the Tata Smartflo portal:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4b33e8] text-xs font-bold text-white">
              1
            </span>
            <div className="space-y-1">
              <strong className="block text-gray-900">Smartflo Portal Login</strong>
              <p className="text-gray-600 leading-relaxed">
                Log in to the Tata Smartflo Admin Portal and navigate to <strong>Inbound Services &gt; Dialplans</strong> (API Dialplan).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4b33e8] text-xs font-bold text-white">
              2
            </span>
            <div className="space-y-1">
              <strong className="block text-gray-900">Add API Dialplan</strong>
              <p className="text-gray-600 leading-relaxed">
                Click <strong>Add Dialplan</strong>, select Type = <strong>API / Dynamic Routing</strong>, and paste the <strong>CRM Endpoint URL</strong> provided above.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4b33e8] text-xs font-bold text-white">
              3
            </span>
            <div className="space-y-1">
              <strong className="block text-gray-900">Add Headers &amp; Timeout</strong>
              <p className="text-gray-600 leading-relaxed">
                Under Request Headers, add <code>call_type</code>, <code>integration_id</code>, and <code>webhook_id</code>. Set the Timeout to <strong>5 seconds</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-xs">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4b33e8] text-xs font-bold text-white">
              4
            </span>
            <div className="space-y-1">
              <strong className="block text-gray-900">Map Inbound DIDs</strong>
              <p className="text-gray-600 leading-relaxed">
                Go to <strong>Numbers / DIDs</strong> and assign this API Dialplan to the routing configuration of your incoming virtual numbers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Expected JSON Response Preview */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Expected CRM Response to Smartflo
          </span>
          <span className="text-[11px] font-mono text-gray-400">application/json</span>
        </div>
        <pre className="overflow-auto rounded-lg bg-stone-900 p-4 font-mono text-xs leading-relaxed text-emerald-400">
          <code>
            {JSON.stringify(
              {
                action: 'bridge',
                destination: selectedFallbackAgent?.extension || '0607733050014',
                agent_extension: selectedFallbackAgent?.extension || '0607733050014',
                agent_number: selectedFallbackAgent?.followMeNumber || selectedFallbackAgent?.callerId || '+919217175070',
                rynxly_agent_id: selectedCrmUser?.userId || selectedFallbackAgent?.userId || 'usr_f893e271',
                user_id: selectedCrmUser?.userId || selectedFallbackAgent?.userId || 'usr_f893e271',
                agent_id: selectedFallbackAgent?.agentId || '0507733050014',
                fallback_queue: 'QUEUE-DEFAULT-SUPPORT',
              },
              null,
              2
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 4: Webhook (All Webhook Responses for Smartflo)
// -------------------------------------------------------------

interface SetupWebhookContentProps {
  initialOrganizationId?: string;
  initialWebhookId?: string;
  onEventsCountChange?: (count: number) => void;
}

function SetupWebhookContent({
  initialOrganizationId,
  initialWebhookId,
  onEventsCountChange,
}: SetupWebhookContentProps) {
  const [organizationId, setOrganizationId] = useState<string>(initialOrganizationId || '');
  const [webhookId, setWebhookId] = useState<string>(initialWebhookId || '');
  const [events, setEvents] = useState<WebhookResponseItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null);
  const [copiedPayloadId, setCopiedPayloadId] = useState<string | null>(null);

  const isClearingRef = useRef(false);
  const activePollAbortRef = useRef<AbortController | null>(null);
  const latestRequestTimeRef = useRef<number>(0);

  const leftColRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const copyPayload = async (event: WebhookResponseItem) => {
    try {
      const payloadText = JSON.stringify(event.rawPayload || event, null, 2);
      await navigator.clipboard.writeText(payloadText);
      setCopiedPayloadId(event.id);
      setTimeout(() => setCopiedPayloadId(null), 2000);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (initialOrganizationId && (!organizationId || initialOrganizationId !== organizationId)) {
      setOrganizationId(initialOrganizationId);
    }
    if (initialWebhookId && (!webhookId || initialWebhookId !== webhookId)) {
      setWebhookId(initialWebhookId);
    }
  }, [initialOrganizationId, initialWebhookId]);

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
    const ro = new ResizeObserver(() => updateHeight());
    ro.observe(el);

    return () => ro.disconnect();
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
  }, [organizationId, webhookId, initialOrganizationId, initialWebhookId]);

  const loadWebhookData = async (silent = false) => {
    if (isClearingRef.current) return;

    const requestTime = Date.now();
    latestRequestTimeRef.current = requestTime;

    if (activePollAbortRef.current) {
      activePollAbortRef.current.abort();
    }
    const abortController = new AbortController();
    activePollAbortRef.current = abortController;

    try {
      if (!silent) setIsLoading(true);

      let targetOrg = organizationId || initialOrganizationId || '';
      let targetWebhook = webhookId || initialWebhookId || '';

      if (!targetOrg || !targetWebhook) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session || isClearingRef.current || latestRequestTimeRef.current !== requestTime) return;

        try {
          const response = await fetch('/api/smartflo/configuration', {
            method: 'GET',
            headers: { Authorization: `Bearer ${session.access_token}` },
            cache: 'no-store',
            signal: abortController.signal,
          });

          if (response.ok && !isClearingRef.current && latestRequestTimeRef.current === requestTime) {
            const result = await response.json();
            if (result?.configuration?.organizationId) {
              targetOrg = result.configuration.organizationId;
              setOrganizationId(targetOrg);
            }
            if (result?.configuration?.webhookId) {
              targetWebhook = result.configuration.webhookId;
              setWebhookId(targetWebhook);
            } else if (result?.configuration?.integrationId) {
              targetWebhook = result.configuration.integrationId;
              setWebhookId(targetWebhook);
            }
            if (
              Array.isArray(result?.configuration?.webhookEvents) &&
              result.configuration.webhookEvents.length > 0
            ) {
              setEvents(result.configuration.webhookEvents);
            }
          }
        } catch (err: any) {
          if (err?.name === 'AbortError') return;
        }

        if (!targetOrg || !targetWebhook) {
          try {
            const user = session.user;
            let { data: profile } = await supabase
              .from('user_profiles')
              .select('organization_id')
              .eq('user_id', user.id)
              .maybeSingle();

            if (!profile) {
              const fallback = await supabase
                .from('user_profiles')
                .select('organization_id')
                .eq('id', user.id)
                .maybeSingle();
              profile = fallback.data;
            }

            if (profile?.organization_id) {
              targetOrg = profile.organization_id;
              setOrganizationId(targetOrg);

              const { data: dialerConfig } = await supabase
                .from('smartflo_dialer_config')
                .select('webhook_id, integration_id')
                .eq('organization_id', targetOrg)
                .maybeSingle();

              const wId = dialerConfig?.webhook_id || dialerConfig?.integration_id;
              if (wId) {
                targetWebhook = wId;
                setWebhookId(wId);
              }
            }
          } catch {
            // ignore
          }
        }
      }

      if (!targetOrg || !targetWebhook) {
        if (!silent) setIsLoading(false);
        return;
      }

      let hasLoadedEvents = false;
      try {
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
            hasLoadedEvents = true;
            if (directData.orgId && !organizationId) setOrganizationId(directData.orgId);
            if (directData.webhookId && !webhookId) setWebhookId(directData.webhookId);
            return;
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }

      if (!hasLoadedEvents && targetOrg) {
        try {
          const { data: dbResponses } = await supabase
            .from('webhook_responses')
            .select('id, webhook_id, organization_id, response, created_at')
            .eq('organization_id', targetOrg)
            .order('created_at', { ascending: false })
            .limit(50);

          if (
            dbResponses &&
            dbResponses.length > 0 &&
            !isClearingRef.current &&
            latestRequestTimeRef.current === requestTime
          ) {
            const mapped = dbResponses.map((row: any) => ({
              id: row.id,
              receivedAt: row.created_at,
              callId: row.response?.call_id || row.response?.uuid || row.response?.id || row.id,
              refId: row.response?.ref_id || row.response?.custom_identifier || row.response?.uuid || '',
              direction: row.response?.direction || row.response?.call_direction || 'Outbound',
              callType: row.response?.call_type || 'Click to Call',
              agentNumber: row.response?.agent_number || row.response?.agent || row.response?.caller_id || '',
              destinationNumber:
                row.response?.destination_number ||
                row.response?.destination ||
                row.response?.customer_number ||
                '',
              status: row.response?.status || row.response?.call_status || row.response?.hangup_cause || 'Hangup',
              hangupCause:
                row.response?.hangup_cause ||
                row.response?.reason ||
                row.response?.status ||
                'NORMAL_CLEARING',
              duration: Number(row.response?.duration || row.response?.talk_time || 0),
              recordingUrl: row.response?.recording_url || row.response?.recording || null,
              rawPayload: row.response || {},
            }));
            setEvents(mapped);
          }
        } catch {
          // ignore
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
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

    if (activePollAbortRef.current) {
      activePollAbortRef.current.abort();
      activePollAbortRef.current = null;
    }

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
      const {
        data: { session },
      } = await supabase.auth.getSession();

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

      setEvents([]);
    } catch (error) {
      console.error('Failed to clear webhook events', error);
    } finally {
      setTimeout(() => {
        isClearingRef.current = false;
        setIsClearing(false);
      }, 1500);
    }
  };

  const domain = 'https://www.rynxly.in';
  const effectiveOrgId = organizationId;
  const effectiveWebhookId = webhookId;
  const effectiveWebhookPath =
    effectiveOrgId && effectiveWebhookId ? `/webhook/${effectiveOrgId}/${effectiveWebhookId}` : '';
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
    <div id="panel-webhook-config" className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
      <div className="border-b border-gray-200 bg-gray-50/70 px-4 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Tata Smartflo Webhook Integration & Event Stream</h2>
          <p className="mt-0.5 break-all text-xs text-gray-500">
            Webhook ID: <span className="font-mono text-gray-700">{effectiveWebhookId || 'Generated'}</span> · Org: <span className="font-mono text-gray-700">{effectiveOrgId || 'Detected'}</span>
          </p>
        </div>
        {events.length > 0 && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            {events.length} event{events.length > 1 ? 's' : ''} captured
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* Left Column: Webhook URL & Smartflo Portal Setup Guide */}
        <div ref={leftColRef} className="space-y-6 p-5 sm:p-6 lg:col-span-1 bg-white">
          {/* Webhook URL Box */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Webhook Endpoint URL</h3>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Active & Listening</span>
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

          {/* Portal Guide */}
          <section className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#4b33e8]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Smartflo Portal Configuration</h3>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Configure destination webhook settings in Smartflo portal.
              </p>
            </div>

            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between p-3 text-xs">
                <span className="font-medium text-gray-500">Channel</span>
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
                  Call hangup (Missed / Answered)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 text-xs">
                <span className="font-medium text-gray-500">My Number</span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 border border-emerald-200/60">
                  All numbers selected
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Webhook Received Responses as Cards */}
        <div
          style={
            isDesktop && leftHeight && leftHeight > 200
              ? { height: `${leftHeight}px`, maxHeight: `${leftHeight}px`, minHeight: '450px' }
              : { minHeight: '450px' }
          }
          className="flex flex-col bg-gray-50/50 p-5 sm:p-6 lg:col-span-1 min-h-[450px] overflow-hidden"
        >
          <div className="shrink-0 mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Received Webhook Responses</h3>
              <p className="mt-0.5 text-xs text-gray-500">Real-time stream of incoming call hangup records.</p>
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

          {/* Cards list */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {events.length === 0 ? (
              <div className="flex h-full min-h-[16rem] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Webhook className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-xs font-bold text-gray-800">No Webhook Responses Yet</h4>
                <button
                  type="button"
                  onClick={() => void handleSimulateWebhook()}
                  disabled={isSimulating}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSimulating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Radio className="h-3.5 w-3.5" />}
                  <span>Test Event</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => {
                  const isInbound =
                    event.direction === 'inbound' ||
                    (event.callType && event.callType.toLowerCase().includes('inbound')) ||
                    (event.callType && event.callType.toLowerCase().includes('dialplan')) ||
                    Boolean(event.rawPayload?.billing_circle);

                  const isAnswered = ['answered', 'completed', 'success', 'bridged'].includes(event.status.toLowerCase());
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
                      className={`rounded-xl border p-4 transition-shadow hover:shadow-xs ${
                        isInbound ? 'border-purple-200/80 bg-purple-50/[0.15]' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                            {event.status}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                              isInbound
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {isInbound && <PhoneIncoming className="h-3 w-3 text-purple-600" />}
                            {event.callType || (isInbound ? 'Inbound Dialplan' : 'Click to Call')}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {new Date(event.receivedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>

                      {isInbound ? (() => {
                        const rawCustomer = String(
                          event.rawPayload?.caller_id_number ||
                          event.rawPayload?.customer_number ||
                          event.rawPayload?.from ||
                          (event.destinationNumber !== event.rawPayload?.call_to_number ? event.destinationNumber : '') ||
                          'Unknown Customer'
                        );

                        const rawDid = String(
                          event.rawPayload?.call_to_number ||
                          event.rawPayload?.virtual_did ||
                          'Virtual DID'
                        );

                        let rawAgent = '';
                        if (
                          event.agentNumber &&
                          event.agentNumber !== rawCustomer &&
                          event.agentNumber !== rawDid &&
                          event.agentNumber !== 'Unknown'
                        ) {
                          rawAgent = event.agentNumber;
                        } else if (typeof event.rawPayload?.routed_to_name === 'string' && event.rawPayload.routed_to_name) {
                          const ext = event.rawPayload.routed_to_extension ? ` (Ext: ${event.rawPayload.routed_to_extension})` : '';
                          const num = event.rawPayload.routed_to_number ? ` (${event.rawPayload.routed_to_number})` : '';
                          rawAgent = `${event.rawPayload.routed_to_name}${ext || num}`;
                        } else if (typeof event.rawPayload?.routed_to_extension === 'string' && event.rawPayload.routed_to_extension) {
                          rawAgent = `Ext: ${event.rawPayload.routed_to_extension}`;
                        } else if (typeof event.rawPayload?.routed_to_number === 'string' && event.rawPayload.routed_to_number) {
                          rawAgent = String(event.rawPayload.routed_to_number);
                        } else {
                          rawAgent = 'Fallback Agent';
                        }

                        return (
                          /* Inbound Dialplan Specific Card Layout */
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-white/90 border border-purple-100 p-2.5">
                              <span className="block text-[10px] uppercase font-semibold text-purple-600/80">Customer Phone</span>
                              <span
                                className="font-mono text-[11px] font-bold text-gray-900 truncate block mt-0.5 select-all"
                                title={rawCustomer}
                              >
                                {rawCustomer}
                              </span>
                            </div>
                            <div className="rounded-lg bg-white/90 border border-purple-100 p-2.5">
                              <span className="block text-[10px] uppercase font-semibold text-purple-600/80">Routed Agent</span>
                              <span
                                className="font-mono text-[11px] font-bold text-[#4b33e8] truncate block mt-0.5"
                                title={rawAgent}
                              >
                                {rawAgent}
                              </span>
                            </div>
                            <div className="rounded-lg bg-white/90 border border-purple-100 p-2.5">
                              <span className="block text-[10px] uppercase font-semibold text-gray-400">Dialed Virtual DID</span>
                              <span
                                className="font-mono text-[11px] font-medium text-gray-700 truncate block mt-0.5"
                                title={rawDid}
                              >
                                {rawDid}
                              </span>
                            </div>
                            <div className="rounded-lg bg-white/90 border border-purple-100 p-2.5">
                              <span className="block text-[10px] uppercase font-semibold text-gray-400">Circle / Operator</span>
                              <span className="font-mono text-[11px] font-medium text-gray-700 truncate block mt-0.5">
                                {(() => {
                                  const bc = event.rawPayload?.billing_circle as
                                    | { circle?: string; operator?: string }
                                    | undefined;
                                  return bc?.circle
                                    ? `${bc.circle} (${bc.operator || 'TTL'})`
                                    : event.hangupCause || 'ROUTED';
                                })()}
                              </span>
                            </div>
                          </div>
                        );
                      })() : (
                        /* Outbound Click-to-Call Card Layout */
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-gray-50 p-2.5">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Agent</span>
                            <span className="font-mono text-[11px] font-semibold text-gray-800 truncate block mt-0.5" title={event.agentNumber}>
                              {event.agentNumber || 'Unknown'}
                            </span>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2.5">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Destination</span>
                            <span className="font-mono text-[11px] font-semibold text-gray-800 truncate block mt-0.5" title={event.destinationNumber}>
                              {event.destinationNumber || 'Unknown'}
                            </span>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2.5">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Duration</span>
                            <span className="font-semibold text-gray-800 block mt-0.5">
                              {event.duration > 0
                                ? `${event.duration}s (${Math.floor(event.duration / 60)}m ${event.duration % 60}s)`
                                : event.rawPayload?.agent_ring_time
                                ? `0s (Ring: ${event.rawPayload.agent_ring_time}s)`
                                : '0s'}
                            </span>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2.5">
                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Hangup Cause</span>
                            <span className="font-mono text-[10px] font-medium text-gray-700 truncate block mt-0.5" title={event.hangupCause}>
                              {event.hangupCause || 'NORMAL_CLEARING'}
                            </span>
                          </div>
                        </div>
                      )}

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
                              title={`Ref: ${displayRefId}${
                                event.callId && event.callId !== displayRefId ? ` · Call ID: ${event.callId}` : ''
                              }`}
                            >
                              Ref: {displayRefId}
                            </span>
                          );
                        })()}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => void copyPayload(event)}
                            className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                            title="Copy Raw JSON Payload"
                          >
                            {copiedPayloadId === event.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 text-gray-400" />
                                <span>Copy Payload</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedPayloadId(isExpandedPayload ? null : event.id)}
                            className="inline-flex items-center gap-1 font-semibold text-[#4b33e8] hover:underline"
                          >
                            <FileCode className="h-3 w-3" />
                            <span>{isExpandedPayload ? 'Hide Payload' : 'View Payload'}</span>
                          </button>
                        </div>
                      </div>

                      {isExpandedPayload && (
                        <div className="mt-2.5 space-y-2.5">
                          {Array.isArray(event.rawPayload?.process_logs) && event.rawPayload.process_logs.length > 0 && (
                            <div className="rounded-lg border border-purple-200 bg-purple-50/70 p-3">
                              <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900 mb-2">
                                <Activity className="h-3.5 w-3.5 text-purple-600" />
                                <span>Execution Steps / Process Logs</span>
                              </div>
                              <div className="space-y-1 font-mono text-[11px] text-purple-950">
                                {event.rawPayload.process_logs.map((log: string, lIdx: number) => (
                                  <div key={lIdx} className="leading-snug bg-white/85 rounded px-2 py-1 border border-purple-100/80">
                                    {log}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <pre className="max-h-48 overflow-auto rounded-lg bg-stone-900 p-3 font-mono text-[10px] leading-relaxed text-emerald-400">
                            <code>{JSON.stringify(event.rawPayload || event, null, 2)}</code>
                          </pre>
                        </div>
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

// -------------------------------------------------------------
// MAIN COMPONENT: 4 Cards Navigation & Container
// -------------------------------------------------------------

export type SmartfloTabType = 'initial-setup' | 'click-to-call' | 'dialplan' | 'webhook';

interface SmartfloDialerConfigurationProps {
  onBack: () => void;
}

export default function SmartfloDialerConfiguration({ onBack }: SmartfloDialerConfigurationProps) {
  const [activeTab, setActiveTab] = useState<SmartfloTabType>('initial-setup');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
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
  const [isClickToCallActivated, setIsClickToCallActivated] = useState(false);
  const [isDialplanActive, setIsDialplanActive] = useState(true);
  const [isTogglingDialplan, setIsTogglingDialplan] = useState(false);
  const [isSavingFallbackAgent, setIsSavingFallbackAgent] = useState(false);
  const [webhookEventsCount, setWebhookEventsCount] = useState<number>(0);
  const [testCallStatus, setTestCallStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [testCallMessage, setTestCallMessage] = useState('');
  const [testCallDetails, setTestCallDetails] = useState<{
    message: string;
    refId: string | null;
    callId: string | null;
  } | null>(null);

  const isAuthenticated = authStatus === 'verified';
  const mappedAgentsCount = smartfloAgents.filter((agent) => Boolean(agent.userId)).length;

  useEffect(() => {
    void loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) return;

      const result = await response.json();
      const configuration = result?.configuration;
      const loadedAgents: SmartfloAgentOption[] = Array.isArray(result?.smartfloAgents)
        ? result.smartfloAgents
        : [];
      setSmartfloAgents(loadedAgents);
      setCallerIdDrafts(Object.fromEntries(loadedAgents.map((agent) => [agent.agentId, agent.callerId || ''])));
      setCrmUsers(Array.isArray(result?.crmUsers) ? result.crmUsers : []);

      if (!configuration) return;

      if (configuration.organizationId) setOrganizationId(configuration.organizationId);
      if (configuration.webhookId) setWebhookId(configuration.webhookId);
      if (Array.isArray(configuration.webhookEvents) && configuration.webhookEvents.length > 0) {
        setWebhookEventsCount(configuration.webhookEvents.length);
      }
      setIntegrationId(configuration.integrationId ?? null);
      if (configuration.tokenCreatedAt) {
        setCreatedDate(String(configuration.tokenCreatedAt).slice(0, 10));
      }
      setHasSavedConfiguration(Boolean(configuration.integrationId || configuration.tokenCreatedAt));
      const isAct = Boolean(configuration.isActivated || configuration.enabled);
      setIsEnabled(isAct);
      setIsClickToCallActivated(Boolean(configuration.isActivated));
      setExpiryDays(normalizeExpiryDays(configuration.expiryDays ?? 30));
      setSelectedParameters(configuration.clickToCallParams ?? {});

      const savedCallerId = configuration.clickToCallParams?.caller_id;
      setCallerId(
        typeof savedCallerId === 'string'
          ? savedCallerId
          : Array.isArray(savedCallerId) && typeof savedCallerId[0] === 'string'
          ? savedCallerId[0]
          : ''
      );
      setSelectedAgentNumbers(
        Array.isArray(configuration.clickToCallParams?.agent_number)
          ? configuration.clickToCallParams.agent_number
          : []
      );
      setAuthStatus(configuration.isTokenValid ? 'verified' : 'idle');
      setAuthMessage(configuration.isTokenValid ? 'Token already verified.' : '');
    } catch {
      setAuthStatus('error');
      setAuthMessage('Unable to load the Smartflo configuration.');
    }
  };

  const handleToggleEnabled = async (nextEnabled: boolean) => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again.');

      const res = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: nextEnabled ? 'enable' : 'disable' }),
      });

      if (!res.ok) throw new Error('Failed to toggle Click to Call');

      setIsEnabled(nextEnabled);
      if (!nextEnabled) {
        setIsClickToCallActivated(false);
      }
    } catch (err) {
      console.error('Error toggling Click to Call:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const authenticateToken = async (retry = false) => {
    if (authStatus === 'checking') return;
    if (!retry && !token.trim()) return;

    setAuthStatus('checking');
    setAuthMessage('');

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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

      const nextCreatedAt = result.configuration?.tokenCreatedAt;
      if (nextCreatedAt) setCreatedDate(String(nextCreatedAt).slice(0, 10));
      if (result.configuration?.integrationId) setIntegrationId(result.configuration.integrationId);
      setHasSavedConfiguration(true);
      setHasSavedToken(true);
      setExpiryDays(normalizeExpiryDays(result.configuration?.expiryDays ?? expiryDays));
      setSelectedParameters((prev) => ({ ...prev, ...(result.configuration?.clickToCallParams ?? {}) }));
      setAuthStatus('verified');
      setAuthMessage(
        retry
          ? 'Token refreshed. Smartflo is verified again.'
          : 'Token verified. Smartflo agents and Click-to-Call are ready.'
      );
      await loadConfiguration();
    } catch (error) {
      setAuthStatus('error');
      setAuthMessage(error instanceof Error ? error.message : 'Unable to verify the Smartflo token.');
    }
  };

  const saveRequestParameters = async (nextParameters: RequestParameters) => {
    setSelectedParameters(nextParameters);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again to save settings.');

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ clickToCallParams: nextParameters }),
      });
      const result = await response.json();
      if (response.ok) {
        const saved = result.clickToCallParams as RequestParameters;
        setSelectedParameters(saved);
        setCallerId(typeof saved.caller_id === 'string' ? saved.caller_id : '');
        setSelectedAgentNumbers(Array.isArray(saved.agent_number) ? saved.agent_number : []);
      }
    } catch (err) {
      console.error('Error saving clickToCallParams', err);
    }
  };

  const saveFallbackAgent = async (agentId: string | null) => {
    setIsSavingFallbackAgent(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ fallbackAgent: { fallback_agent_id: agentId } }),
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedParameters((prev) => ({
          ...prev,
          fallback_agent_id: result.fallback_agent_id,
        }));
      }
    } catch (err) {
      console.error('Error saving fallback agent', err);
    } finally {
      setIsSavingFallbackAgent(false);
    }
  };

  const saveAgentCallerId = async (agentId: string) => {
    const cid = callerIdDrafts[agentId]?.trim() || null;
    const current = smartfloAgents.find((a) => a.agentId === agentId)?.callerId || null;
    if (cid === current) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ agentCallerId: { agentId, callerId: cid } }),
      });
      const result = await response.json();
      if (response.ok) {
        setSmartfloAgents((agents) =>
          agents.map((a) => (a.agentId === agentId ? { ...a, callerId: result.callerId } : a))
        );
        setCallerIdDrafts((drafts) => ({ ...drafts, [agentId]: result.callerId || '' }));
      }
    } catch (err) {
      console.error('Error saving agent callerId', err);
    }
  };

  const saveAgentUserMapping = async (agentId: string, userId: string | null) => {
    const previousUserId = smartfloAgents.find((a) => a.agentId === agentId)?.userId || null;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ agentUserMapping: { agentId, userId } }),
      });
      const result = await response.json();
      if (response.ok) {
        setSmartfloAgents((agents) =>
          agents.map((a) => (a.agentId === agentId ? { ...a, userId: result.userId } : a))
        );
        for (const affectedUserId of new Set(
          [previousUserId, result.userId].filter((id): id is string => Boolean(id))
        )) {
          window.dispatchEvent(
            new CustomEvent('calling-provider-updated', { detail: { userId: affectedUserId } })
          );
        }
      }
    } catch (err) {
      console.error('Error saving agent user mapping', err);
    }
  };

  const updateGlobalRoutingMode = async (mode: 'extension_first' | 'caller_forward_first') => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ c2cRouting: { globalMode: mode } }),
      });

      if (response.ok) {
        const targetRouting = mode === 'caller_forward_first' ? 'agent' : 'extension';
        setSmartfloAgents((agents) =>
          agents.map((a) => ({ ...a, c2cRouting: targetRouting }))
        );
      }
    } catch (err) {
      console.error('Error updating global routing mode:', err);
    }
  };

  const updateAgentRouting = async (agentId: string, routing: 'extension' | 'agent') => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/smartflo/configuration', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ c2cRouting: { agentId, routing } }),
      });

      if (response.ok) {
        setSmartfloAgents((agents) =>
          agents.map((a) => (a.agentId === agentId ? { ...a, c2cRouting: routing } : a))
        );
      }
    } catch (err) {
      console.error('Error updating agent routing:', err);
    }
  };

  const testClickToCall = async (destination: string) => {
    if (testCallStatus === 'sending') return;
    if (!destination.trim()) {
      setTestCallStatus('error');
      setTestCallMessage('Please enter a destination phone number to test.');
      setTestCallDetails(null);
      return;
    }

    setTestCallStatus('sending');
    setTestCallMessage('');
    setTestCallDetails(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again to test Click to Call.');

      const response = await fetch('/api/smartflo/test-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          destination_number: destination.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.error || 'Smartflo could not queue the test call.');
      }

      setIsClickToCallActivated(true);
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
              setTestCallDetails((prev) => (prev ? { ...prev, callId: String(foundCallId) } : prev));
              setWebhookEventsCount((prev) => Math.max(prev, 1));
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

  return (
    <div id="smartflo-dialer-config-container" className="space-y-6">
      {/* Top Header */}
      <div id="smartflo-dialer-config-header" className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="smartflo-dialer-config-title" className="text-xl font-bold text-[#263238]">
            Tata Smartflo Dialer Configuration
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage token authentication, CRM agent mapping, click-to-call, dialplans, and webhooks.
          </p>
        </div>
        <button
          type="button"
          id="btn-back-smartflo-dialer"
          onClick={onBack}
          aria-label="Back to Admin Apps"
          title="Back to Admin Apps"
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs"
        >
          <i className="fi flex fi-rr-arrow-left" aria-hidden="true" />
          <span>Back</span>
        </button>
      </div>

      {/* 4 Cards Navigation Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Initial Setup */}
        <button
          type="button"
          onClick={() => setActiveTab('initial-setup')}
          className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
            activeTab === 'initial-setup'
              ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03] ring-1 ring-[#4b33e8] shadow-xs'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                activeTab === 'initial-setup' ? 'bg-[#4b33e8] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <KeyRound className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">Initial Setup</h3>
              <p className="mt-0.5 text-xs text-gray-500 truncate">Token & agent mapping</p>
            </div>
          </div>
        </button>

        {/* Card 2: Click to Call */}
        <button
          type="button"
          onClick={() => setActiveTab('click-to-call')}
          className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
            activeTab === 'click-to-call'
              ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03] ring-1 ring-[#4b33e8] shadow-xs'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                activeTab === 'click-to-call' ? 'bg-[#4b33e8] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <PhoneCall className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">Click to call</h3>
              <p className="mt-0.5 text-xs text-gray-500 truncate">Outbound setup & forward</p>
            </div>
          </div>
        </button>

        {/* Card 3: Dialplan */}
        <button
          type="button"
          onClick={() => setActiveTab('dialplan')}
          className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
            activeTab === 'dialplan'
              ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03] ring-1 ring-[#4b33e8] shadow-xs'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                activeTab === 'dialplan' ? 'bg-[#4b33e8] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Radio className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">Dialplan</h3>
              <p className="mt-0.5 text-xs text-gray-500 truncate">Inbound & API routing</p>
            </div>
          </div>
        </button>

        {/* Card 4: Webhook */}
        <button
          type="button"
          onClick={() => setActiveTab('webhook')}
          className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-150 ${
            activeTab === 'webhook'
              ? 'border-[#4b33e8] bg-[#4b33e8]/[0.03] ring-1 ring-[#4b33e8] shadow-xs'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                activeTab === 'webhook' ? 'bg-[#4b33e8] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Webhook className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">Webhook</h3>
              <p className="mt-0.5 text-xs text-gray-500 truncate">All webhook responses</p>
            </div>
          </div>
        </button>
      </div>

      {/* Active Tab Screen Content */}
      <div className="pt-1 animate-in fade-in duration-150">
        {activeTab === 'initial-setup' && (
          <InitialSetupContent
            token={token}
            setToken={setToken}
            createdDate={createdDate}
            setCreatedDate={setCreatedDate}
            expiryDays={expiryDays}
            setExpiryDays={setExpiryDays}
            authStatus={authStatus}
            authMessage={authMessage}
            hasSavedToken={hasSavedToken}
            hasSavedConfiguration={hasSavedConfiguration}
            integrationId={integrationId}
            organizationId={organizationId}
            smartfloAgents={smartfloAgents}
            crmUsers={crmUsers}
            callerIdDrafts={callerIdDrafts}
            setCallerIdDrafts={setCallerIdDrafts}
            onAuthenticate={authenticateToken}
            onSaveAgentMapping={saveAgentUserMapping}
            onSaveAgentCallerId={saveAgentCallerId}
            onRefreshConfiguration={loadConfiguration}
            onNavigateToClickToCall={() => setActiveTab('click-to-call')}
          />
        )}

        {activeTab === 'click-to-call' && (
          <ClickToCallTabContent
            isEnabled={isEnabled}
            onToggleEnabled={handleToggleEnabled}
            isToggling={isToggling}
            isActivated={isClickToCallActivated}
            token={token}
            authStatus={authStatus}
            integrationId={integrationId}
            smartfloAgents={smartfloAgents}
            crmUsers={crmUsers}
            selectedParameters={selectedParameters}
            selectedAgentNumbers={selectedAgentNumbers}
            callerId={callerId}
            callerIdDrafts={callerIdDrafts}
            setCallerId={setCallerId}
            onSaveParameters={saveRequestParameters}
            onTestCall={testClickToCall}
            testCallStatus={testCallStatus}
            testCallMessage={testCallMessage}
            testCallDetails={testCallDetails}
            isWebhookActive={Boolean(webhookEventsCount > 0 || testCallDetails?.callId)}
            onSwitchToWebhook={() => setActiveTab('webhook')}
            onSwitchToInitialSetup={() => setActiveTab('initial-setup')}
            onUpdateGlobalRoutingMode={updateGlobalRoutingMode}
            onUpdateAgentRouting={updateAgentRouting}
          />
        )}

        {activeTab === 'dialplan' && (
          <DialplanContent
            organizationId={organizationId}
            integrationId={integrationId}
            webhookId={webhookId}
            isDialplanActive={isDialplanActive}
            onToggleDialplan={(active) => setIsDialplanActive(active)}
            isToggling={isTogglingDialplan}
            smartfloAgents={smartfloAgents}
            crmUsers={crmUsers}
            fallbackAgentId={
              typeof selectedParameters.fallback_agent_id === 'string'
                ? selectedParameters.fallback_agent_id
                : null
            }
            onSaveFallbackAgent={saveFallbackAgent}
            isSavingFallbackAgent={isSavingFallbackAgent}
          />
        )}

        {activeTab === 'webhook' && (
          <SetupWebhookContent
            initialOrganizationId={organizationId}
            initialWebhookId={webhookId}
            onEventsCountChange={setWebhookEventsCount}
          />
        )}
      </div>
    </div>
  );
}