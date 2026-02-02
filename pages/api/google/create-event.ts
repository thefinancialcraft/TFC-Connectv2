import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  eventId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { summary, description, startTime, endTime, providerToken } = req.body;

  if (!providerToken) {
    return res.status(401).json({ error: 'Missing Google OAuth token' });
  }

  try {
    // 1. Create Event via Google Calendar API key
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${providerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: summary || 'Follow-up Call',
        description: description || 'Scheduled callback from TFC Connect',
        start: {
          dateTime: startTime, // ISO String
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime, // ISO String
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 3 }
            ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Calendar API Error:', data);
      throw new Error(data.error?.message || 'Failed to create calendar event');
    }

    return res.status(200).json({
      success: true,
      eventId: data.id,
    });
  } catch (error: any) {
    console.error('Create event error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
