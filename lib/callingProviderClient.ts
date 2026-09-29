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