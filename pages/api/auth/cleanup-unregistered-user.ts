import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
  deleted?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client not configured' });
  }

  try {
    const { userId, email } = req.body;

    // Verify requesting user via bearer token or userId
    let targetUserId = userId;
    let targetEmail = email;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const { data: { user: authUser } } = await supabase.auth.getUser(token);
      if (authUser) {
        targetUserId = targetUserId || authUser.id;
        targetEmail = targetEmail || authUser.email;
      }
    }

    if (!targetUserId && !targetEmail) {
      return res.status(400).json({ error: 'User ID or Email is required' });
    }

    // Safety Check: Verify that this email or userId does NOT exist in user_profiles
    // We should NEVER delete a user who actually has a valid profile!
    let query = supabaseAdmin.from('user_profiles').select('id, user_id, email');
    if (targetUserId && targetEmail) {
      query = query.or(`user_id.eq.${targetUserId},email.ilike.${targetEmail}`);
    } else if (targetUserId) {
      query = query.eq('user_id', targetUserId);
    } else {
      query = query.ilike('email', targetEmail);
    }

    const { data: existingProfiles, error: profileCheckError } = await query;

    if (profileCheckError) {
      console.error('Error checking user_profiles before cleanup:', profileCheckError);
      return res.status(500).json({ error: 'Failed to verify profile existence' });
    }

    if (existingProfiles && existingProfiles.length > 0) {
      // User is registered in user_profiles, DO NOT DELETE!
      return res.status(200).json({
        success: true,
        deleted: false,
        message: 'User is registered, not deleting.'
      });
    }

    // If userId was not passed directly, look up auth.users by email
    if (!targetUserId && targetEmail) {
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (!listError && listData?.users) {
        const found = listData.users.find(
          (u) => u.email?.toLowerCase() === targetEmail.toLowerCase()
        );
        if (found) {
          targetUserId = found.id;
        }
      }
    }

    if (!targetUserId) {
      return res.status(200).json({
        success: true,
        deleted: false,
        message: 'No auth user found to delete.'
      });
    }

    // Delete the unregistered user from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      console.error('Error deleting unregistered auth user:', deleteError);
      return res.status(500).json({ error: deleteError.message || 'Failed to delete user' });
    }

    console.log(`[Google OAuth Guard] Successfully deleted unregistered auth user ${targetUserId} (${targetEmail})`);

    return res.status(200).json({
      success: true,
      deleted: true,
      message: 'Unregistered auth user deleted successfully.'
    });
  } catch (error: any) {
    console.error('Cleanup unregistered user error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
