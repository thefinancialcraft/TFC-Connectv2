import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
  purpose?: string;
  employee_id?: string;
  email?: string;
};

/**
 * OTP Verification API
 * 
 * Verifies OTP using unique_id and otp_code
 * Returns purpose on successful verification
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { unique_id, otp_code, employee_id } = req.body;

    // Log full payload
    console.log('=== OTP Verification Request Payload ===');
    console.log('Full Payload:', {
      unique_id: unique_id || 'missing',
      otp_code: otp_code || 'missing',
      employee_id: employee_id || 'missing',
      timestamp: new Date().toISOString(),
    });
    console.log('========================================');

    // Validate required fields
    if (!unique_id || !otp_code) {
      console.log('Validation failed: Missing required fields', {
        has_unique_id: !!unique_id,
        has_otp_code: !!otp_code,
      });
      const errorResponse = { error: 'Unique ID and OTP code are required' };
      console.log('=== OTP Verification Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('================================');
      return res.status(400).json(errorResponse);
    }

    // Validate OTP code format (should be numeric, typically 4-6 digits)
    if (!/^\d+$/.test(otp_code)) {
      console.log('Validation failed: Invalid OTP format', {
        otp_code: otp_code.substring(0, 3) + '...',
      });
      const errorResponse = { error: 'Invalid OTP code format' };
      console.log('=== OTP Verification Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('================================');
      return res.status(400).json(errorResponse);
    }

    const clientToUse = supabaseAdmin || supabase;
    console.log('Using Supabase client:', clientToUse === supabaseAdmin ? 'Admin' : 'Regular');

    // Find OTP record by unique_id
    console.log('Fetching OTP record from database...');
    const { data: otpData, error: otpError } = await clientToUse
      .from('otp_verifications')
      .select('otp_code, purpose, email, is_used, expires_at')
      .eq('unique_id', unique_id)
      .single();

    if (otpError || !otpData) {
      console.log('OTP record not found:', {
        error: otpError?.message,
        unique_id: unique_id ? `${unique_id.substring(0, 8)}...` : 'missing',
      });
      const errorResponse = { error: 'Invalid unique ID. OTP not found.' };
      console.log('=== OTP Verification Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('================================');
      return res.status(400).json(errorResponse);
    }

    console.log('OTP record found:', {
      purpose: otpData.purpose,
      email: otpData.email ? `${otpData.email}` : 'missing',
      is_used: otpData.is_used,
      expires_at: otpData.expires_at,
    });

    // Check if OTP is already used
    if (otpData.is_used) {
      console.log('OTP verification failed: OTP already used', {
        unique_id: unique_id ? `${unique_id.substring(0, 8)}...` : 'missing',
      });
      const errorResponse = { error: 'OTP has already been used' };
      console.log('=== OTP Verification Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('================================');
      return res.status(400).json(errorResponse);
    }

    // Check if OTP is expired
    if (otpData.expires_at) {
      const expiresAt = new Date(otpData.expires_at);
      const now = new Date();
      console.log('Checking OTP expiration:', {
        expires_at: expiresAt.toISOString(),
        current_time: now.toISOString(),
        is_expired: now > expiresAt,
      });
      if (now > expiresAt) {
        console.log('OTP verification failed: OTP expired');
        const errorResponse = { error: 'OTP has expired. Please request a new one.' };
        console.log('=== OTP Verification Response ===');
        console.log('Status:', 400);
        console.log('Response:', errorResponse);
        console.log('================================');
        return res.status(400).json(errorResponse);
      }
    }

    // Verify OTP code
    console.log('Verifying OTP code...', {
      stored_otp_length: otpData.otp_code?.length || 0,
      provided_otp_length: otp_code.length,
      match: otpData.otp_code === otp_code,
    });
    if (otpData.otp_code !== otp_code) {
      console.log('OTP verification failed: Invalid OTP code');
      const errorResponse = { error: 'Invalid OTP code' };
      console.log('=== OTP Verification Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('================================');
      return res.status(400).json(errorResponse);
    }

    // Mark OTP as used
    console.log('Marking OTP as used...');
    const { error: updateError } = await clientToUse
      .from('otp_verifications')
      .update({ is_used: true })
      .eq('unique_id', unique_id);

    if (updateError) {
      console.error('Error updating OTP status:', updateError);
      // Don't fail the request if update fails, OTP is still verified
    } else {
      console.log('OTP marked as used successfully');
    }

    console.log('OTP verification successful:', {
      purpose: otpData.purpose,
      unique_id: unique_id ? `${unique_id.substring(0, 8)}...` : 'missing',
    });

    // If purpose is 'forgot_user_id', find employee_id from user_profiles using email
    let employeeId: string | undefined;
    if (otpData.purpose === 'forgot_user_id' && otpData.email) {
      console.log('Finding employee_id for forgot_user_id purpose...');
      // Case-insensitive email comparison using ilike
      const { data: profileData, error: profileError } = await clientToUse
        .from('user_profiles')
        .select('employee_id')
        .ilike('email', otpData.email)
        .single();

      if (profileError || !profileData) {
        console.log('Employee ID not found for email:', {
          email: otpData.email ? `${otpData.email.substring(0, 3)}...` : 'missing',
          error: profileError?.message,
        });
      } else {
        employeeId = profileData.employee_id;
        console.log('Employee ID found:', {
          employee_id: employeeId ? `${employeeId.substring(0, 3)}...` : 'missing',
        });
      }
    }

    // If purpose is 'forgot_email', find email from user_profiles using employee_id
    let foundEmail: string | undefined;
    if (otpData.purpose === 'forgot_email') {
      if (!employee_id) {
        console.log('Employee ID is required for forgot_email purpose');
        const errorResponse = { error: 'Employee ID is required for email recovery' };
        console.log('=== OTP Verification Response ===');
        console.log('Status:', 400);
        console.log('Response:', errorResponse);
        console.log('================================');
        return res.status(400).json(errorResponse);
      }

      console.log('Finding email for forgot_email purpose...');
      const { data: profileData, error: profileError } = await clientToUse
        .from('user_profiles')
        .select('email')
        .eq('employee_id', employee_id)
        .single();

      if (profileError || !profileData) {
        console.log('Email not found for employee_id:', {
          employee_id: employee_id ? `${employee_id.substring(0, 3)}...` : 'missing',
          error: profileError?.message,
        });
        const errorResponse = { error: 'Invalid Employee ID. Email not found.' };
        console.log('=== OTP Verification Response ===');
        console.log('Status:', 400);
        console.log('Response:', errorResponse);
        console.log('================================');
        return res.status(400).json(errorResponse);
      }

      foundEmail = profileData.email;

      // Verify that the email from employee_id matches the email in OTP record
      if (otpData.email && foundEmail) {
        const emailMatch = otpData.email.toLowerCase() === foundEmail.toLowerCase();
        console.log('Verifying email match between OTP record and employee_id:', {
          otp_email: otpData.email ? `${otpData.email.substring(0, 3)}...` : 'missing',
          found_email: foundEmail ? `${foundEmail.substring(0, 3)}...` : 'missing',
          match: emailMatch,
        });

        if (!emailMatch) {
          console.log('Email mismatch: OTP email does not match employee_id email');
          const errorResponse = { error: 'Employee ID does not match the email used for OTP verification' };
          console.log('=== OTP Verification Response ===');
          console.log('Status:', 400);
          console.log('Response:', errorResponse);
          console.log('================================');
          return res.status(400).json(errorResponse);
        }
      }

      console.log('Email found and verified:', {
        email: foundEmail ? `${foundEmail.substring(0, 3)}...` : 'missing',
      });
    }

    const successResponse: Data = {
      success: true,
      message: 'OTP verified successfully',
      purpose: otpData.purpose,
    };

    // Only include employee_id if found and purpose is forgot_user_id
    if (employeeId) {
      successResponse.employee_id = employeeId;
    }

    // Only include email if found and purpose is forgot_email
    if (foundEmail) {
      successResponse.email = foundEmail;
    }

    console.log('=== OTP Verification Response ===');
    console.log('Status:', 200);
    console.log('Response:', successResponse);
    console.log('================================');

    return res.status(200).json(successResponse);
  } catch (error: any) {
    console.error('OTP verification error:', error);
    const errorResponse = { error: 'An error occurred while verifying OTP' };
    console.log('=== OTP Verification Response ===');
    console.log('Status:', 500);
    console.log('Response:', errorResponse);
    console.log('Error Details:', error);
    console.log('================================');
    return res.status(500).json(errorResponse);
  }
}

