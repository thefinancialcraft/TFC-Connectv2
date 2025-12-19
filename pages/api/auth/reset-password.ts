import type { NextApiRequest, NextApiResponse } from 'next';
import {supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
};

/**
 * Reset Password API
 * 
 * Resets user password using unique_id
 * Requires OTP to be verified first (unique_id should be from verified OTP)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { unique_id, new_password } = req.body;

    // Validate required fields
    if (!unique_id || !new_password) {
      return res.status(400).json({ error: 'Unique ID and new password are required' });
    }

    // Validate password length
    if (new_password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const clientToUse = supabaseAdmin || supabase;

    // Find verified OTP by unique_id
    const { data: otpData, error: otpError } = await clientToUse
      .from('otp_verifications')
      .select('email, purpose, is_used')
      .eq('unique_id', unique_id)
      .eq('is_used', true)
      .single();

    if (otpError || !otpData) {
      return res.status(400).json({ error: 'Invalid or unverified OTP. Please verify OTP first.' });
    }

    // Get user email from OTP
    const userEmail = otpData.email;

    // Find user in auth.users by email
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Admin access required for password reset' });
    }

    // Get user from auth.users
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError || !usersData) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    const user = usersData.users.find((u: any) => u.email?.toLowerCase() === userEmail.toLowerCase());

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password using Supabase Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: new_password,
      }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({ error: 'Failed to reset password' });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: 'An error occurred while resetting password' });
  }
}

