import { supabase } from '@/lib/supabase';

export type CallingProviderName = 'sim' | 'smartflo';

export async function resolveActiveCallingProvider(): Promise<CallingProviderName | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Please sign in again to verify the calling provider.');

  const response = await fetch('/api/calling/provider', {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Unable to verify the active calling provider.');
  }

  const provider = result.data?.active_provider;
  return provider === 'sim' || provider === 'smartflo' ? provider : null;
}

export interface ActiveProviderDetails {
  activeProvider: CallingProviderName | null;
  user: any;
  organization: any;
  smartfloAgent: any;
  resolution?: { provider: CallingProviderName | null; allowed: boolean; reason?: string };
}

export async function getCallingProviderDetails(): Promise<ActiveProviderDetails> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Please sign in again to verify the calling provider.');

  const response = await fetch('/api/calling/provider', {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Unable to verify the active calling provider.');
  }

  return {
    activeProvider: result.data?.active_provider === 'sim' || result.data?.active_provider === 'smartflo'
      ? result.data.active_provider
      : null,
    user: result.data?.user,
    organization: result.data?.organization,
    smartfloAgent: result.data?.smartflo_agent,
    resolution: result.data?.resolution,
  };
}