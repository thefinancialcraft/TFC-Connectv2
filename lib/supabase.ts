import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Global flag to prevent recursive logging
let isLoggingInternal = false;

// Custom Fetch Wrapper for Logging
const customFetch = async (url: string | URL | Request, options?: any) => {
  const urlStr = typeof url === 'string' 
    ? url 
    : (url instanceof Request ? url.url : url.toString());

  // CRITICAL: Immediately identify if this is an Auth or internal monitoring request
  // We skip EVERYTHING for these to ensure no interference with login
  const isExcluded = isLoggingInternal ||
                     urlStr.includes('system_monitoring_logs') || 
                     urlStr.includes('rpc/get_monitoring_stats') ||
                     urlStr.includes('/auth/v1/') ||
                     urlStr.includes('/rest/v1/utility_data') ||
                     urlStr.includes('/rest/v1/user_profiles?select=user_name');

  // If excluded, just return the standard fetch immediately
  if (isExcluded) {
    return fetch(url, options);
  }

  try {
    // 1. Execute the original request
    const response = await fetch(url, options);

    // 2. Schedule logging in the background (post-response, non-blocking)
    if (typeof window !== 'undefined') {
      (async () => {
        try {
          isLoggingInternal = true;
          const { logSystemEvent, estimateSize } = await import('./monitoring');
          const path = urlStr.split('.co')[1] || urlStr;
          const method = options?.method || (url instanceof Request ? url.method : 'GET');

          await logSystemEvent({
            event_type: method === 'GET' ? 'READ' : 'WRITE',
            description: `API_HIT: ${method} ${path}`,
            path: path,
            payload_size: options?.body ? estimateSize(options.body) : 0,
            response_size: 1024 
          });
        } catch (logErr) {
          // Ignore background logging errors
        } finally {
          isLoggingInternal = false;
        }
      })();
    }

    return response;
  } catch (err) {
    console.error('[Sentinel] API Request Failed:', urlStr, err);
    throw err; // Re-throw so the app can handle it
  }
};





// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: customFetch
    }
});

// Server-side Supabase client
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;


