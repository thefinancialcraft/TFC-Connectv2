import { supabaseAdmin } from '@/lib/supabase';

export type CallingProviderName = 'sim' | 'smartflo';

export interface OrganizationCallingProvider {
  sim: { enable: boolean };
  smartflo: { enable: boolean };
}

export interface UserCallingProvider {
  sim: { enable: boolean; in_use: boolean };
  smartflo: { enable: boolean; in_use: boolean };
}

export interface CallingProviderState {
  organization: OrganizationCallingProvider;
  user: UserCallingProvider;
}

export interface CallingProviderResolution {
  provider: CallingProviderName | null;
  allowed: boolean;
  reason?: string;
}

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function isEnabled(value: unknown): boolean {
  return asRecord(value).enable === true;
}

function isInUse(value: unknown): boolean {
  return asRecord(value).in_use === true;
}

function normalizeCallingProvider(
  value: unknown,
  includeInUse: false
): OrganizationCallingProvider;
function normalizeCallingProvider(
  value: unknown,
  includeInUse: true
): UserCallingProvider;
function normalizeCallingProvider(
  value: unknown,
  includeInUse: boolean
): OrganizationCallingProvider | UserCallingProvider {
  const input = asRecord(value);
  const sim = asRecord(input.sim);
  const smartflo = asRecord(input.smartflo);

  if (includeInUse) {
    return {
      sim: { enable: sim.enable === true, in_use: sim.in_use === true },
      smartflo: { enable: smartflo.enable === true, in_use: smartflo.in_use === true },
    };
  }

  return {
    sim: { enable: sim.enable === true },
    smartflo: { enable: smartflo.enable === true },
  };
}

export async function getCallingProviderState(userId: string): Promise<CallingProviderState | null> {
  if (!supabaseAdmin) throw new Error('calling_provider_service_unavailable');

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('organization_id, calling_provider')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) throw new Error('calling_provider_state_unavailable');
  if (!profile?.organization_id) return null;

  const { data: organization, error: organizationError } = await supabaseAdmin
    .from('organizations')
    .select('calling_provider')
    .eq('id', profile.organization_id)
    .maybeSingle();

  if (organizationError) throw new Error('calling_provider_state_unavailable');
  if (!organization) return null;

  return {
    organization: normalizeCallingProvider(organization.calling_provider, false),
    user: normalizeCallingProvider(profile.calling_provider, true),
  };
}

export function resolveCallingProviderFromState(
  state: CallingProviderState
): CallingProviderResolution {
  const simInUse = state.user.sim.in_use;
  const smartfloInUse = state.user.smartflo.in_use;

  if (simInUse && smartfloInUse) {
    return { provider: null, allowed: false, reason: 'multiple_providers_selected' };
  }

  const provider: CallingProviderName | null = simInUse
    ? 'sim'
    : smartfloInUse
      ? 'smartflo'
      : null;

  if (!provider) {
    return { provider: null, allowed: false, reason: 'no_provider_selected' };
  }

  if (!isEnabled(state.organization[provider])) {
    return { provider, allowed: false, reason: 'provider_disabled_for_organization' };
  }

  if (!isEnabled(state.user[provider])) {
    return { provider, allowed: false, reason: 'provider_disabled_for_user' };
  }

  if (!isInUse(state.user[provider])) {
    return { provider, allowed: false, reason: 'provider_not_selected' };
  }

  return { provider, allowed: true };
}

export async function resolveCallingProvider(userId: string): Promise<CallingProviderResolution> {
  try {
    const state = await getCallingProviderState(userId);
    if (!state) return { provider: null, allowed: false, reason: 'provider_state_not_found' };
    return resolveCallingProviderFromState(state);
  } catch {
    return { provider: null, allowed: false, reason: 'provider_state_unavailable' };
  }
}