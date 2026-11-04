import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcglmkmhqvmkugaqvqih.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// In the browser, route queries via /backend-api reverse proxy to mask the direct Supabase domain
const isBrowser = typeof window !== 'undefined';
const clientUrl = isBrowser ? `${window.location.origin}/backend-api` : supabaseUrl;

// Client-side Supabase client (uses anon key)
export const supabase = createClient(clientUrl, supabaseAnonKey);

// Ensure realtime WebSockets connect directly to Supabase wss endpoint so HTTP proxy doesn't break sockets
if (isBrowser && (supabase as any)?.realtime) {
  const wsUrl = supabaseUrl.replace(/^http/, 'ws');
  (supabase as any).realtime.endPoint = `${wsUrl}/realtime/v1/websocket`;
}

// Server-side Supabase client
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;



  