import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { getDeviceInfo, getClientIP, getLocationFromIP } from '../../../lib/deviceUtils';

type Data = {
  success?: boolean;
  error?: string;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
    token_id: string;
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
    const { 
      email, 
      password, 
      location: clientLocation, 
      token_id: clientTokenId, 
      device_info: flutterDeviceInfo 
    } = req.body;

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

    const ipAddress = getClientIP(req);
    let location = clientLocation || 'Unknown Location';
    if (!clientLocation || clientLocation === 'Unknown Location') {
      location = await getLocationFromIP(ipAddress);
    }

    // Handle token_id (Support multi-account/quick-login system)
    const crypto = await import('crypto');
    const finalTokenId = clientTokenId || `token_${crypto.randomBytes(5).toString('hex')}`;

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
    sessionExpiry.setMonth(sessionExpiry.getMonth() + 1); // Exactly 1 month expiry from now

    // Store session information in database
    if (supabaseAdmin) {
      try {
        await supabaseAdmin
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
      } catch (sessionStoreError) {
        console.error('Error storing session:', sessionStoreError);
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
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
}


