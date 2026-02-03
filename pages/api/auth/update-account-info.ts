
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase Admin Client (Service Role)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // 1. Get User Token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });

  try {
    // 2. Verify User
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { field, value } = req.body;

    if (!field || !value) {
        return res.status(400).json({ success: false, error: 'Missing field or value' });
    }

    // 3. Update Auth Table via Admin API
    let updateData: any = {};
    let profileUpdateData: any = {};

    if (field === 'email') {
        updateData.email = value;
        profileUpdateData.email = value;
    } else if (field === 'contact_no') { // Mapped from phone
        updateData.phone = value;
        profileUpdateData.contact_no = value;
    } else if (field === 'phone') { // Direct map
        updateData.phone = value;
        profileUpdateData.contact_no = value;
    } else if (field === 'user_name') {
        updateData.user_metadata = { ...user.user_metadata, display_name: value };
        profileUpdateData.user_name = value;
    } else {
        return res.status(400).json({ success: false, error: 'Invalid field for account update' });
    }

    // Update Auth User (requires service role)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      updateData
    );

    if (authError) throw authError;

    // 4. Update User Profile Table (Sync)
    const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update(profileUpdateData)
        .eq('user_id', user.id);

    if (profileError) {
        console.error("Profile sync error:", profileError);
        // We don't fail the request if auth update succeeded, but it's good to know
    }

    return res.status(200).json({ success: true, message: 'Account updated successfully', user: authData.user });

  } catch (error: any) {
    console.error('Update Account Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
