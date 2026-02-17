import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('email')
      .ilike('employee_id', employeeId.trim())
      .maybeSingle();

    if (error) {
      console.error('Error looking up email:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Employee ID not found' });
    }

    return res.status(200).json({ email: data.email });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
