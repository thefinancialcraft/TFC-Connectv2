import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  email?: string;
};

/**
 * Forgot Email API
 * 
 * Finds email using employee_id and date_of_birth
 * Both must match in user_profiles table
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { employee_id, date_of_birth } = req.body;

    console.log('=== Forgot Email Request Payload ===');
    console.log('Full Payload:', {
      employee_id: employee_id || 'missing',
      date_of_birth: date_of_birth || 'missing',
      timestamp: new Date().toISOString(),
    });
    console.log('====================================');

    // Validate required fields
    if (!employee_id || !date_of_birth) {
      const errorResponse = { error: 'Employee ID and Date of Birth are required' };
      console.log('=== Forgot Email Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('============================');
      return res.status(400).json(errorResponse);
    }

    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date_of_birth)) {
      const errorResponse = { error: 'Invalid date format. Please use DD/MM/YYYY format' };
      console.log('=== Forgot Email Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('============================');
      return res.status(400).json(errorResponse);
    }

    const clientToUse = supabaseAdmin || supabase;

    // Parse date from DD/MM/YYYY format
    const [day, month, year] = date_of_birth.split('/');
    const dobDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD for database comparison

    console.log('Searching for email in user_profiles table...', {
      employee_id: employee_id,
      date_of_birth_formatted: dobDate,
    });

    // Find user by employee_id and date_of_birth in user_profiles table
    const { data: profileData, error: profileError } = await clientToUse
      .from('user_profiles')
      .select('email, date_of_birth, employee_id')
      .eq('employee_id', employee_id)
      .single();

    if (profileError || !profileData) {
      console.log('User not found for employee_id:', {
        employee_id: employee_id,
        error: profileError?.message,
      });
      const errorResponse = { error: 'Invalid Employee ID or Date of Birth' };
      console.log('=== Forgot Email Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('============================');
      return res.status(400).json(errorResponse);
    }

    console.log('User found, verifying date of birth...', {
      stored_dob: profileData.date_of_birth,
      provided_dob: dobDate,
    });

    // Verify date of birth matches
    if (!profileData.date_of_birth) {
      const errorResponse = { error: 'Date of Birth not found for this account' };
      console.log('=== Forgot Email Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('============================');
      return res.status(400).json(errorResponse);
    }

    // Compare dates (handle different formats)
    const storedDob = new Date(profileData.date_of_birth);
    const providedDob = new Date(dobDate);
    
    // Compare only date part (ignore time)
    const storedDateOnly = new Date(storedDob.getFullYear(), storedDob.getMonth(), storedDob.getDate());
    const providedDateOnly = new Date(providedDob.getFullYear(), providedDob.getMonth(), providedDob.getDate());

    if (storedDateOnly.getTime() !== providedDateOnly.getTime()) {
      console.log('Date of birth mismatch:', {
        stored: storedDateOnly.toISOString().split('T')[0],
        provided: providedDateOnly.toISOString().split('T')[0],
      });
      const errorResponse = { error: 'Invalid Employee ID or Date of Birth' };
      console.log('=== Forgot Email Response ===');
      console.log('Status:', 400);
      console.log('Response:', errorResponse);
      console.log('============================');
      return res.status(400).json(errorResponse);
    }

    // Both employee_id and date_of_birth match, return email
    const successResponse = {
      success: true,
      email: profileData.email,
    };

    console.log('=== Forgot Email Response ===');
    console.log('Status:', 200);
    console.log('Response:', {
      success: successResponse.success,
      email: profileData.email ? `${profileData.email.substring(0, 3)}...` : 'missing',
    });
    console.log('============================');

    return res.status(200).json(successResponse);
  } catch (error: any) {
    console.error('Forgot email error:', error);
    const errorResponse = { error: 'An error occurred while finding email' };
    console.log('=== Forgot Email Response ===');
    console.log('Status:', 500);
    console.log('Response:', errorResponse);
    console.log('Error Details:', error);
    console.log('============================');
    return res.status(500).json(errorResponse);
  }
}

