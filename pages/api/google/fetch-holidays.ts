import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success: boolean;
  holidays?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { year, month } = req.query;

  if (!year) {
    return res.status(400).json({ success: false, error: 'Missing year' });
  }

  try {
    const holidayCalendarId = 'en.indian#holiday@group.v.calendar.google.com';
    const timeMin = new Date(Number(year), Number(month) || 0, 1).toISOString();
    const timeMax = new Date(Number(year), Number(month) + 1 || 12, 0).toISOString();

    const authHeader = req.headers.authorization;
    const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;

    let allHolidays: any[] = [];

    // 1. Try to fetch from Primary Calendar (Personal Events) if Auth exists
    if (authHeader) {
        try {
            const primaryUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
            const primaryRes = await fetch(primaryUrl, { headers: { 'Authorization': authHeader } });
            const primaryData = await primaryRes.json();
            if (primaryRes.ok) {
                const userEvents = primaryData.items?.map((item: any) => ({
                    id: item.id,
                    summary: item.summary,
                    description: item.description || '',
                    location: item.location || '',
                    start: item.start.date || item.start.dateTime,
                    end: item.end.date || item.end.dateTime,
                    allDay: !!item.start.date,
                    isPersonal: true
                })) || [];
                allHolidays = [...allHolidays, ...userEvents];
            }
        } catch (e) {
            console.error('Failed to fetch primary calendar:', e);
        }
    }

    // 2. Try to fetch from Holiday Calendar
    if (authHeader || API_KEY) {
        let url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(holidayCalendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
        
        const headers: Record<string, string> = {};
        if (authHeader) headers['Authorization'] = authHeader;
        else if (API_KEY) url += `&key=${API_KEY}`;

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (response.ok) {
            const holidays = data.items?.map((item: any) => ({
                id: item.id,
                status: item.status,
                summary: item.summary,
                description: item.description || '',
                location: item.location || '',
                start: item.start.date || item.start.dateTime,
                end: item.end.date || item.end.dateTime,
                allDay: !!item.start.date,
                isFestival: true
            })) || [];
            allHolidays = [...allHolidays, ...holidays];
        }
    }

    // 3. Fallback if no events found at all and we have no auth/key
    if (allHolidays.length === 0 && !authHeader && !API_KEY) {
        console.log("Using date-holidays fallback");
        const Holidays = require('date-holidays');
        const hd = new Holidays('IN');
        const holidaysData = hd.getHolidays(Number(year));
        
        allHolidays = holidaysData.filter((h: any) => {
            const d = new Date(h.date);
            return d.getFullYear() === Number(year) && d.getMonth() === Number(month);
        }).map((h: any) => ({
            id: `local-${h.date}-${h.name}`,
            summary: h.name,
            start: h.date.split(' ')[0],
            end: h.date.split(' ')[0],
            allDay: true,
            isFestival: true,
            description: h.type + ' Holiday'
        }));
    }

    return res.status(200).json({
      success: true,
      holidays: allHolidays
    });

  } catch (error: any) {
    console.error('Fetch holidays error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
