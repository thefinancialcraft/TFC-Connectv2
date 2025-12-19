import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';
import { getDeviceInfo, getClientIP } from '../../../lib/deviceUtils';

type Data = {
  success?: boolean;
  error?: string;
  session_id?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, session_token } = req.body;

    if (!user_id || !session_token) {
      return res.status(400).json({ error: 'user_id and session_token are required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get device info from user agent
    const userAgent = req.headers['user-agent'] || '';
    const deviceInfo = getDeviceInfo(userAgent);
    const ipAddress = getClientIP(req);

    // Get location (simplified - in production, use a geolocation API)
    const location = 'Unknown Location'; // TODO: Implement geolocation lookup

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Store session in database
    const { data, error } = await supabaseAdmin
      .from('user_sessions')
      .insert({
        user_id,
        session_token,
        device_name: deviceInfo.deviceName,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        user_agent: deviceInfo.userAgent,
        ip_address: ipAddress,
        location,
        is_active: true,
        expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing session:', error);
      return res.status(500).json({ error: 'Failed to store session' });
    }

    return res.status(200).json({
      success: true,
      session_id: data.id,
    });
  } catch (error: any) {
    console.error('Store session error:', error);
    return res.status(500).json({ error: 'An error occurred while storing session' });
  }
}

