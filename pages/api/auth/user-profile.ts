import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  server_now?: string;
  user?: {
    uid: string;
    displayName: string | null;
    email: string;
    phone: string | null;
    providers: string[];
    providerType: string | null;
    createdAt: string;
    lastSignInAt: string | null;
    employeeId: string | null;
    role: string | null;
    approvalStatus: string | null;
    accountStatus: string | null;
    updatedAt: string | null;
    profile_pic_url: string | null;
    user_name: string | null;
    profile_complete: boolean | null;
    activeCampaignId: string | null;
    activeCustomerId: string | null;
    activeSessionState: string | null;
    activeSessionStart: string | null;
    currentCallSession?: {
        campaign_id: string;
        customer_id: string;
        status: string;
        call_start_at: string;
    } | null;
    statusReason: string | null;
    holdStartDate: string | null;
    holdEndDate: string | null;
    allTimeActive: boolean;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the auth token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token and get user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get user profile from user_profiles table
    // First try to get the session to set it on the client for RLS
    // Or use admin client to bypass RLS (since we're in server-side API)
    const clientToUse = supabaseAdmin || supabase;
    
    // If using regular client (not admin), we need to set the session first for RLS
    let profile;
    let profileError;
    
    if (supabaseAdmin) {
      // Use admin client - bypasses RLS
      const result = await supabaseAdmin
        .from('user_profiles')
        .select('user_name, contact_no, email, employee_id, role, approval_status, status, updated_at, profile_pic_url, profile_complete, status_reason, hold_start_date, hold_end_date, all_time_active')
        .eq('user_id', authUser.id)
        .maybeSingle();
      profile = result.data;
      profileError = result.error;
    } else {
      // Use regular client with user token - RLS will be enforced
      // Set session first so RLS policies can check auth.uid()
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '', // Not needed for server-side
      });
      
      if (!sessionError && sessionData.session) {
        const result = await supabase
          .from('user_profiles')
          .select('user_name, contact_no, email, employee_id, role, approval_status, status, updated_at, profile_pic_url, profile_complete, status_reason, hold_start_date, hold_end_date, all_time_active')
          .eq('user_id', authUser.id)
          .maybeSingle();
        profile = result.data;
        profileError = result.error;
      } else {
        profileError = sessionError || new Error('Failed to set session');
      }
    }

    if (profileError) {
      // Log all errors for debugging
      console.error('Profile fetch error:', profileError);
      // Don't fail the request, but log the error
    }
    
    // Debug: Log if profile is null
    if (!profile) {
      console.warn('Profile is null for user_id:', authUser.id, 'Error:', profileError?.message);
    }

    // Get user metadata from auth (stored in user_metadata)
    const userMetadata = authUser.user_metadata || {};
    const providers = authUser.app_metadata?.providers || [];
    const providerType = providers.length > 0 ? providers[0] : null;

    // Priority: user_metadata > profile table > null
    const displayName = userMetadata.display_name || userMetadata.user_name || profile?.user_name || null;
    const phone = userMetadata.phone || userMetadata.contact_no || profile?.contact_no || null;

    // Fetch call session
    const { data: callSession } = await clientToUse
      .from('call_sessions')
      .select('campaign_id, customer_id, status, call_start_at')
      .eq('user_id', authUser.id)
      .maybeSingle();

    return res.status(200).json({
      success: true,
      server_now: new Date().toISOString(),
      user: {
        uid: authUser.id,
        displayName: displayName,
        email: authUser.email || profile?.email || '',
        phone: phone,
        providers: providers,
        providerType: providerType,
        createdAt: authUser.created_at,
        lastSignInAt: authUser.last_sign_in_at || null,
        employeeId: profile?.employee_id || null,
        role: profile?.role || null,
        approvalStatus: profile?.approval_status || null,
        accountStatus: profile?.status || null,
        updatedAt: profile?.updated_at || null,
        profile_pic_url: profile?.profile_pic_url || null,
        user_name: profile?.user_name || null,
        profile_complete: profile?.profile_complete ?? false,
        activeCampaignId: userMetadata.active_campaign_id || null,
        activeCustomerId: userMetadata.active_customer_id || null,
        activeSessionState: userMetadata.active_session_state || null,
        activeSessionStart: userMetadata.active_session_start || null,
        currentCallSession: callSession || null,
        statusReason: profile?.status_reason || null,
        holdStartDate: profile?.hold_start_date || null,
        holdEndDate: profile?.hold_end_date || null,
        allTimeActive: profile?.all_time_active ?? true,
      },
    });
  } catch (error: any) {
    console.error('User profile error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching user profile' });
  }
}

