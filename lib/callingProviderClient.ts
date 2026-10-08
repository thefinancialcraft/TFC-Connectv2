import { supabase } from '@/lib/supabase';

export type CallingProviderName = 'sim' | 'smartflo';

export interface ActiveProviderDetails {
  activeProvider: CallingProviderName | null;
  user: any;
  organization: any;
  smartfloAgent: any;
  resolution?: { provider: CallingProviderName | null; allowed: boolean; reason?: string };
}

let cachedProviderDetails: ActiveProviderDetails | null = null;
let inflightDetailsPromise: Promise<ActiveProviderDetails> | null = null;

export function getCachedProviderDetails(): ActiveProviderDetails | null {
  return cachedProviderDetails;
}

export function setCachedProviderDetails(details: ActiveProviderDetails | null): void {
  cachedProviderDetails = details;
}

export function clearCallingProviderCache(): void {
  cachedProviderDetails = null;
  inflightDetailsPromise = null;
}

// Auto-sync cache when calling provider is updated anywhere in the window
if (typeof window !== 'undefined') {
  window.addEventListener('calling-provider-updated', (event: any) => {
    const detail = event?.detail;
    if (detail?.state) {
      const state = detail.state;
      cachedProviderDetails = {
        activeProvider: state.active_provider === 'sim' || state.active_provider === 'smartflo'
          ? state.active_provider
          : null,
        user: state.user,
        organization: state.organization,
        smartfloAgent: state.smartflo_agent ?? null,
        resolution: state.resolution,
      };
    } else {
      clearCallingProviderCache();
    }
  });
}

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

export async function getCallingProviderDetails(forceRefresh = false): Promise<ActiveProviderDetails> {
  if (!forceRefresh && cachedProviderDetails) {
    return cachedProviderDetails;
  }
  if (inflightDetailsPromise) {
    return inflightDetailsPromise;
  }

  inflightDetailsPromise = (async () => {
    try {
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

      const details: ActiveProviderDetails = {
        activeProvider: result.data?.active_provider === 'sim' || result.data?.active_provider === 'smartflo'
          ? result.data.active_provider
          : null,
        user: result.data?.user,
        organization: result.data?.organization,
        smartfloAgent: result.data?.smartflo_agent,
        resolution: result.data?.resolution,
      };

      cachedProviderDetails = details;
      return details;
    } finally {
      inflightDetailsPromise = null;
    }
  })();

  return inflightDetailsPromise;
}

export async function resolveActiveCallingProvider(forceRefresh = false): Promise<CallingProviderName | null> {
  const details = await getCallingProviderDetails(forceRefresh);
  return details.activeProvider;
}