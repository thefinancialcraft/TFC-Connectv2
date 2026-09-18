import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split('Bearer ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Admin client not configured' });
    }

    // Verify caller privileges (CEO, internal non-client team with null organization, or super admin)
    const { data: callerProfile, error: callerError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, role, super_admin, designation, is_client, user_name, organization_id')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (callerError || !callerProfile) {
      return res.status(403).json({ error: 'Access denied: Caller profile not found' });
    }

    const isCeo = callerProfile.designation?.toLowerCase() === 'ceo';
    // Internal team requires ALL 3 conditions together:
    // 1. is_client === false
    // 2. organization_id === null / empty
    // 3. super_admin === true (or role === 'super admin')
    const isInternalTeam = Boolean(
      callerProfile.is_client === false &&
      (!callerProfile.organization_id || callerProfile.organization_id === null) &&
      (callerProfile.super_admin === true || callerProfile.role?.toLowerCase() === 'super admin')
    );

    if (!isCeo && !isInternalTeam) {
      return res.status(403).json({ error: 'Forbidden: Only CEO or internal team (non-client, null organization, and super_admin) can manage security settings' });
    }

    const {
      targetUserId, // user_profiles.id
      status,       // 'active' | 'inactive'
      is_caller,    // boolean
      role,         // 'user' | 'admin' | 'super admin'
      designation,  // 'agent' | 'tl' | 'ceo' | custom
      user_name,    // string
      email,        // string
      password,     // string
    } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ error: 'targetUserId is required' });
    }

    // Fetch target profile
    const { data: targetProfile, error: targetError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, email, user_name, status, is_caller, role, super_admin, designation')
      .eq('id', targetUserId)
      .maybeSingle();

    if (targetError || !targetProfile) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    const targetAuthUserId = targetProfile.user_id;

    // 1. Password Update in auth.users
    if (password && typeof password === 'string' && password.trim() !== '') {
      const trimmedPassword = password.trim();
      if (trimmedPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      if (targetAuthUserId) {
        const { error: pwdError } = await supabaseAdmin.auth.admin.updateUserById(
          targetAuthUserId,
          { password: trimmedPassword }
        );

        if (pwdError) {
          console.error('Error updating password in auth:', pwdError);
          return res.status(400).json({ error: `Password update failed: ${pwdError.message}` });
        }
      }
    }

    // 2. Email Update in auth.users
    if (email && typeof email === 'string' && email.trim() !== '' && email.trim() !== targetProfile.email) {
      const trimmedEmail = email.trim().toLowerCase();
      if (targetAuthUserId) {
        const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
          targetAuthUserId,
          { email: trimmedEmail, email_confirm: true }
        );

        if (emailError) {
          console.error('Error updating email in auth:', emailError);
          return res.status(400).json({ error: `Email update in auth failed: ${emailError.message}` });
        }
      }
    }

    // 3. User Name Update in auth.users metadata
    if (user_name && typeof user_name === 'string' && user_name.trim() !== '' && user_name.trim() !== targetProfile.user_name) {
      const trimmedName = user_name.trim();
      if (targetAuthUserId) {
        const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(
          targetAuthUserId,
          {
            user_metadata: {
              display_name: trimmedName,
              user_name: trimmedName,
            }
          }
        );

        if (metaError) {
          console.warn('Warning: Could not update user metadata in auth:', metaError.message);
        }
      }
    }

    // 4. Update user_profiles table
    const profileUpdates: any = {
      updated_at: new Date().toISOString()
    };

    if (status !== undefined) {
      profileUpdates.status = status;
    }
    if (is_caller !== undefined) {
      profileUpdates.is_caller = is_caller === true || is_caller === 'true';
    }
    if (role !== undefined) {
      profileUpdates.role = role;
      profileUpdates.super_admin = role === 'super admin';
    }
    if (designation !== undefined) {
      profileUpdates.designation = designation;
    }
    if (user_name !== undefined && user_name.trim() !== '') {
      profileUpdates.user_name = user_name.trim();
    }
    if (email !== undefined && email.trim() !== '') {
      profileUpdates.email = email.trim().toLowerCase();
    }

    const { error: updateProfileError } = await supabaseAdmin
      .from('user_profiles')
      .update(profileUpdates)
      .eq('id', targetUserId);

    if (updateProfileError) {
      console.error('Error updating user_profiles in admin-update-security:', updateProfileError);
      return res.status(400).json({ error: `Failed to update profile: ${updateProfileError.message}` });
    }

    return res.status(200).json({
      success: true,
      message: 'Security settings updated successfully',
    });
  } catch (error: any) {
    console.error('Unhandled error in admin-update-security:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
  }
}
