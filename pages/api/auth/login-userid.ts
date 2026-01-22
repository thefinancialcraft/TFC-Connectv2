import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { getDeviceInfo, getClientIP, getLocationFromIP } from '../../../lib/deviceUtils';

type Data = {
  success?: boolean;
  error?: string;
  session?: {
    access_token: string;
    refresh_token: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId: rawUserId, password, location: clientLocation } = req.body;
    const userId = rawUserId?.toString().trim();

    if (!userId || !password) {
      return res.status(400).json({ error: 'User ID and password are required' });
    }

    // Use admin client if available, otherwise use regular client
    const clientToUse = supabaseAdmin || supabase;
    
    if (!supabaseAdmin) {
      console.warn('supabaseAdmin is not configured! Falling back to anon client, which may fail due to RLS.');
    }

    // Find user by employee_id in user_profiles table
    const { data: profileData, error: profileError } = await clientToUse
      .from('user_profiles')
      .select('email, user_id, employee_id')
      .eq('employee_id', userId)
      .single();

    if (profileError || !profileData) {
      console.error('Profile fetch error for userId:', userId, profileError);
      return res.status(401).json({ error: 'Invalid User ID' });
    }

    const email = profileData.email?.trim();
    if (!email) {
      console.error('Email not found for Employee ID:', userId);
      return res.status(401).json({ error: 'Email not found for this Employee ID' });
    }

    // Use email to sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password,
    });

    if (error) {
      console.error('Supabase Auth error:', error.message);
      return res.status(401).json({ error: error.message || 'Invalid password' });
    }

    if (!data.session) {
      console.error('Session creation failed: no session returned');
      return res.status(401).json({ error: 'Failed to create session' });
    }

    // Check if email is confirmed
    if (!data.user?.email_confirmed_at) {
      return res.status(403).json({ 
        error: 'Please verify your email address before logging in. Check your inbox for the confirmation email.' 
      });
    }

    // Store session information in database
    if (supabaseAdmin) {
      try {
        const userAgent = req.headers['user-agent'] || '';
        const deviceInfo = getDeviceInfo(userAgent);
        const ipAddress = getClientIP(req);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        // Get location: prefer client location, fallback to IP-based geolocation
        let location = clientLocation || 'Unknown Location';
        if (!clientLocation || clientLocation === 'Unknown Location') {
          location = await getLocationFromIP(ipAddress);
        }

        await supabaseAdmin
          .from('user_sessions')
          .insert({
            user_id: data.user.id,
            session_token: data.session.access_token,
            device_name: deviceInfo.deviceName,
            device_type: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            user_agent: deviceInfo.userAgent,
            ip_address: ipAddress,
            location: location,
            is_active: true,
            expires_at: expiresAt.toISOString(),
          });
      } catch (sessionStoreError) {
        console.error('Error storing session:', sessionStoreError);
        // Don't fail login if session storage fails
      }
    }

    return res.status(200).json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
}

