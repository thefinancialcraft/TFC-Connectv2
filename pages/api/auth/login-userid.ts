import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { getDeviceInfo, getClientIP, getLocationFromIP } from '../../../lib/deviceUtils';
import crypto from 'crypto';

type Data = {
  success?: boolean;
  error?: string;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
    token_id: string;
  };
  user?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      userId: rawUserId, 
      password, 
      location: clientLocation,
      token_id: clientTokenId,
      device_info: flutterDeviceInfo 
    } = req.body;
    
    const userId = rawUserId?.toString().trim();

    if (!userId || !password) {
      return res.status(400).json({ error: 'User ID and password are required' });
    }

    // Use admin client if available, otherwise use regular client
    const clientToUse = supabaseAdmin || supabase;
    
    if (!supabaseAdmin) {
      console.warn('supabaseAdmin is not configured! Falling back to anon client.');
    }

    // Find user by employee_id in user_profiles table
    const { data: profileData, error: profileError } = await clientToUse
      .from('user_profiles')
      .select('email, user_id, employee_id, user_name, role, profile_pic_url, approval_status, status')
      .eq('employee_id', userId)
      .single();

    if (profileError || !profileData) {
      return res.status(401).json({ error: 'Invalid User ID' });
    }

    const email = profileData.email?.trim();
    if (!email) {
      return res.status(401).json({ error: 'Email not found for this Employee ID' });
    }

    // Use email to sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message || 'Invalid password' });
    }

    if (!data.session) {
      return res.status(401).json({ error: 'Failed to create session' });
    }

    // Check if email is confirmed
    if (!data.user?.email_confirmed_at) {
      return res.status(403).json({ 
        error: 'Please verify your email address before logging in.' 
      });
    }

    // --- Advanced Session Logic ---
    const ipAddress = getClientIP(req);
    let location = clientLocation || 'Unknown Location';
    if (!clientLocation || clientLocation === 'Unknown Location') {
      location = await getLocationFromIP(ipAddress);
    }

    // Handle token_id
    let finalTokenId = clientTokenId;
    if (!finalTokenId) {
      finalTokenId = `token_${crypto.randomBytes(5).toString('hex')}`;
    }

    // Handle Metadata (Nexus App vs Standard Browser)
    let deviceName, browser, deviceType, userAgent;

    if (flutterDeviceInfo) {
      // Nexus App Logic
      deviceName = `${flutterDeviceInfo.brand} ${flutterDeviceInfo.model}`;
      browser = "Nexus App";
      userAgent = flutterDeviceInfo.androidId || "Nexus-Android";
      deviceType = "mobile";
    } else {
      // Standard Browser Logic
      const rawUA = req.headers['user-agent'] || '';
      const info = getDeviceInfo(rawUA);
      deviceName = info.deviceName;
      browser = info.browser;
      userAgent = rawUA;
      deviceType = info.deviceType;
    }

    const sessionExpiry = new Date();
    sessionExpiry.setMonth(sessionExpiry.getMonth() + 1); // Exactly 1 month expiry from now (creation time)

    if (supabaseAdmin) {
      try {
        // Update or Insert session record
        const { error: sessionError } = await supabaseAdmin
          .from('user_sessions')
          .upsert({
            token_id: finalTokenId,
            user_id: data.user.id,
            session_token: data.session.access_token,
            device_name: deviceName,
            device_type: deviceType,
            browser: browser,
            user_agent: userAgent,
            ip_address: ipAddress,
            location: location,
            is_active: true,
            last_login_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString(),
            expires_at: sessionExpiry.toISOString(),
          }, { 
            onConflict: 'token_id' 
          });

        if (sessionError) console.error('Upsert Error:', sessionError);
      } catch (err) {
        console.error('Session update failed:', err);
      }
    }

    return res.status(200).json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: sessionExpiry.toISOString(),
        token_id: finalTokenId,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        displayName: profileData.user_name,
        role: profileData.role,
        profile_pic_url: profileData.profile_pic_url,
        employee_id: profileData.employee_id,
        approval_status: profileData.approval_status,
        status: profileData.status
      }
    });
  } catch (error: any) {
    console.error('Login internal error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
}


