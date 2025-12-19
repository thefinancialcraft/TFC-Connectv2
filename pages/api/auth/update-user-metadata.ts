import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This endpoint requires admin access
    if (!supabaseAdmin) {
      return res.status(500).json({ 
        error: 'Admin client not configured. SUPABASE_SERVICE_ROLE_KEY is required.' 
      });
    }

    const { userId, display_name, phone } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Update user metadata in auth.users table
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          display_name: display_name || null,
          phone: phone || null,
          user_name: display_name || null,
          contact_no: phone || null,
        },
      }
    );

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({
      success: true,
      message: 'User metadata updated successfully',
    });
  } catch (error: any) {
    console.error('Update user metadata error:', error);
    return res.status(500).json({ error: 'An error occurred while updating user metadata' });
  }
}

