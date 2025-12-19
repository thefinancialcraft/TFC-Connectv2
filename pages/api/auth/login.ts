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
    const { email, password, location: clientLocation } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message || 'Invalid email or password' });
    }

    if (!data.session) {
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

