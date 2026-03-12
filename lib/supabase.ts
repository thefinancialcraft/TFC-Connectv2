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
  // 3. Optional: Don't log GET requests to reduce noise from internal polling
  const isExcluded = urlStr.includes('system_monitoring_logs') || 
                     urlStr.includes('rpc/get_monitoring_stats') ||
                     urlStr.includes('/auth/v1/');
  
  const method = options?.method || 'GET';

  if (!isExcluded && method !== 'GET' && typeof window !== 'undefined') {
    // We only log WRITE operations (POST, PUT, DELETE, etc.) automatically 
    // GET requests are too frequent due to internal polling (like call_sessions)
    try {
      const { logSystemEvent, estimateSize } = await import('./monitoring');
      const path = urlStr.split('.co')[1] || urlStr;
      
      logSystemEvent({
        event_type: 'WRITE',
        description: `API_WRITE: ${method} ${path}`,
        path: path,
        payload_size: options?.body ? estimateSize(options.body) : 0,
        response_size: 1024 
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


