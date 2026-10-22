import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type ResponseData = {
  success?: boolean;
  error?: string;
  lead?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, company, phone, email, team_strength, city, pincode, notes } = req.body;

  if (!name || !company || !phone || !email || !team_strength) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('contact_requests')
      .insert([
        {
          name: String(name).trim(),
          company: String(company).trim(),
          phone: String(phone).trim(),
          email: String(email).trim().toLowerCase(),
          team_strength: String(team_strength).trim(),
          city: city ? String(city).trim() : null,
          pincode: pincode ? String(pincode).trim() : null,
          notes: notes ? String(notes).trim() : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting into contact_requests:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, lead: data });
  } catch (err: any) {
    console.error('Contact request API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
