import { supabase } from '@/lib/supabase';

export type CallingProviderName = 'sim' | 'smartflo';

async function getValidSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { data: refreshData } = await supabase.auth.refreshSession();
      return refreshData.session;
    }

    if (session.expires_at && session.expires_at * 1000 < Date.now() + 30000) {
      const { data: refreshData } = await supabase.auth.refreshSession();
      if (refreshData.session) return refreshData.session;
    }
    return session;
  } catch {
    return null;
  }
}

export async function resolveActiveCallingProvider(): Promise<CallingProviderName | null> {
  let session = await getValidSession();
  if (!session) throw new Error('Please sign in again to verify the calling provider.');

  let response = await fetch('/api/calling/provider', {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: 'no-store',
  });

  if (response.status === 401) {
    try {
      const { data: refreshData } = await supabase.auth.refreshSession();
      if (refreshData.session) {
        session = refreshData.session;
        response = await fetch('/api/calling/provider', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
        });
      }
    } catch {
      // Continue to parse response
    }
  }

  const result = await response.json().catch(() => ({}));
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
  let session = await getValidSession();
  if (!session) throw new Error('Please sign in again to verify the calling provider.');

  let response = await fetch('/api/calling/provider', {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: 'no-store',
  });

  if (response.status === 401) {
    try {
      const { data: refreshData } = await supabase.auth.refreshSession();
      if (refreshData.session) {
        session = refreshData.session;
        response = await fetch('/api/calling/provider', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
        });
      }
    } catch {
      // Continue to parse response
    }
  }

  const result = await response.json().catch(() => ({}));
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