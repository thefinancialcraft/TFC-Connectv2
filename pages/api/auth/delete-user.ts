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
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query; // This is the user_profiles.id (primary key)

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Admin client not available' });
    }

    // First, fetch the user profile to get the user_id (auth user ID)
    const { data: userProfile, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user profile:', fetchError);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!userProfile || !userProfile.user_id) {
      return res.status(404).json({ error: 'User ID not found in profile' });
    }

    const authUserId = userProfile.user_id;

    // --- CLEAN UP DEPENDENCIES ---
    
    // 1. Unassign from Teams as Leader
    await supabaseAdmin
      .from('teams')
      .update({ leader_id: null })
      .eq('leader_id', authUserId);

    // 2. Remove from Teams.members (Array cleanup)
    // We fetch teams where user is a member
    const { data: userTeams } = await supabaseAdmin
      .from('teams')
      .select('id, members')
      .filter('members', 'cs', `{"${authUserId}"}`);

    if (userTeams && userTeams.length > 0) {
      for (const t of userTeams) {
        const filteredMembers = (t.members || []).filter((m: string) => m !== authUserId);
        await supabaseAdmin.from('teams').update({ members: filteredMembers }).eq('id', t.id);
      }
    }

    // 3. Nullify relations in Call Logs (history preservation)
    await supabaseAdmin
      .from('call_logs')
      .update({ agent_id: null, last_updated_by: null })
      .or(`agent_id.eq.${authUserId},last_updated_by.eq.${authUserId}`);

    // 4. Nullify relations in Customers & Campaigns
    await supabaseAdmin
      .from('customers')
      .update({ last_updated_by: null })
      .eq('last_updated_by', authUserId);
      
    await supabaseAdmin
      .from('campaigns')
      .update({ last_updated_by: null })
      .eq('last_updated_by', authUserId);

    // 5. Clear Call Sessions (active work)
    await supabaseAdmin
      .from('call_sessions')
      .delete()
      .eq('user_id', authUserId);

    // Finally, Delete from user_profiles
    const { error: profileDeleteError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError);
      return res.status(500).json({ error: 'Failed to delete user profile' });
    }

    // Delete from auth
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError);
      // Note: Profile is already deleted, but auth deletion failed
      // This is logged but we still return success since profile is deleted
      // In production, you might want to handle this differently
      return res.status(500).json({ 
        error: 'User profile deleted but failed to delete auth user',
        message: 'User profile was deleted but authentication account deletion failed. Please contact support.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'An error occurred during user deletion' });
  }
}

