import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Custom Fetch Wrapper for Logging
const customFetch = async (url: string | URL | Request, options?: any) => {
  const response = await fetch(url, options);
  
  const urlStr = url.toString();
  // EXCLUSIONS: Prevent infinite loops and noise
  // 1. Don't log the monitoring calls themselves
  // 2. Don't log Auth calls (getUser/session) - prevents recursion
  // 3. Don't log background utility sync calls (To-Do, Notes, etc.) to reduce noise
  // 4. Don't log user_profiles lookups (used by the logging system itself) to prevent loop
  const isExcluded = urlStr.includes('system_monitoring_logs') || 
                     urlStr.includes('rpc/get_monitoring_stats') ||
                     urlStr.includes('/auth/v1/') ||
                     urlStr.includes('/rest/v1/utility_data') ||
                     urlStr.includes('/rest/v1/user_profiles?select=user_name');


  
  const method = options?.method || 'GET';

  if (!isExcluded && typeof window !== 'undefined') {
    // Re-enabling all methods (including GET) to show backend activity
    // but we filter out very frequent polling if needed.
    try {
      const { logSystemEvent, estimateSize } = await import('./monitoring');
      const path = urlStr.split('.co')[1] || urlStr;
      
      // We only log if it's a real API call or if the user is interacting
      logSystemEvent({
        event_type: method === 'GET' ? 'READ' : 'WRITE',
        description: `API_HIT: ${method} ${path}`,
        path: path,
        payload_size: options?.body ? estimateSize(options.body) : 0,
        response_size: 1024 // Estimation
      }).catch(() => {});
    } catch (e) {}
  }

  
  return response;
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


