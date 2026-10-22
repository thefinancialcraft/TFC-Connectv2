import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type ResponseData = {
  success?: boolean;
  error?: string;
  message?: string;
  organization?: any;
  user?: any;
  expiryDate?: string;
};

// Helper to generate a clean org prefix from company name
function generateOrgCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (clean.length >= 3) {
    return clean.substring(0, 4);
  }
  return (clean + 'NXI').substring(0, 3);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    company_name,
    org_code,
    company_type,
    address,
    gst_no,
    owner_name,
    owner_phone_no,
    email,
    password,
  } = req.body;

  // 1. Validation
  if (!company_name || !owner_name || !owner_phone_no || !email || !password) {
    return res.status(400).json({
      error: 'Company Name, Owner Name, Mobile Number, Email, and Password are required.',
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPhone = String(owner_phone_no).trim().replace(/\D/g, '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email address format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Contact number must be at least 10 digits.' });
  }

  const client = supabaseAdmin || supabase;

  try {
    // 2. Check if email already exists in user_profiles
    const { data: existingProfile } = await client
      .from('user_profiles')
      .select('id, email')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (existingProfile) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please login instead.',
      });
    }

    // Check in auth.users if admin client is available
    if (supabaseAdmin) {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const authExists = userList?.users?.some(
        (u) => u.email?.toLowerCase() === cleanEmail
      );
      if (authExists) {
        return res.status(409).json({
          error: 'An account with this email already exists in auth. Please login instead.',
        });
      }
    }

    // 3. Compute Org Code and ensure uniqueness
    let targetOrgCode = (org_code ? String(org_code).trim().toUpperCase() : generateOrgCode(company_name)).substring(0, 5);
    
    // Check if org_code already exists
    const { data: existingOrgCode } = await client
      .from('organizations')
      .select('id, org_code')
      .eq('org_code', targetOrgCode)
      .maybeSingle();

    if (existingOrgCode) {
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      targetOrgCode = `${targetOrgCode.substring(0, 3)}${randomSuffix}`;
    }

    // 4. Calculate Expiry (+10 Days exact)
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const nowIso = now.toISOString();
    const expiryIso = expiryDate.toISOString();

    // 5. Create Organization in `public.organizations`
    const { data: newOrg, error: orgError } = await client
      .from('organizations')
      .insert([
        {
          company_name: String(company_name).trim(),
          org_code: targetOrgCode,
          company_code: `CM${targetOrgCode}1`,
          company_type: company_type ? String(company_type).trim() : 'Sales',
          description: '10-Day Free Trial Organization Account',
          address: address ? String(address).trim() : null,
          gst_no: gst_no ? String(gst_no).trim().toUpperCase() : null,
          owner_name: String(owner_name).trim(),
          owner_phone_no: cleanPhone,
          email: cleanEmail,
          is_active: true,
          company_joined: nowIso,
          renewal_date: expiryIso,
          expiry_date: expiryIso,
          calling_provider: {
            sim: { enable: true },
            smartflo: { enable: false },
          },
        },
      ])
      .select()
      .single();

    if (orgError || !newOrg) {
      console.error('Trial signup: Error creating organization:', orgError);
      return res.status(500).json({
        error: orgError?.message || 'Failed to register organization record.',
      });
    }

    // 6. Create Auth User
    let authUserId: string = '';

    if (supabaseAdmin) {
      const { data: adminAuthData, error: adminAuthError } =
        await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: password,
          email_confirm: true, // Auto-confirm email so trial user gets immediate access
          user_metadata: {
            display_name: String(owner_name).trim(),
            phone: cleanPhone,
            company_name: String(company_name).trim(),
            trial: true,
          },
        });

      if (adminAuthError || !adminAuthData?.user) {
        console.error('Trial signup: Auth user creation error:', adminAuthError);
        // Rollback organization
        await client.from('organizations').delete().eq('id', newOrg.id);
        return res.status(400).json({
          error: adminAuthError?.message || 'Failed to create authentication user.',
        });
      }

      authUserId = adminAuthData.user.id;
    } else {
      // Fallback if supabaseAdmin is not initialized
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            display_name: String(owner_name).trim(),
            phone: cleanPhone,
            company_name: String(company_name).trim(),
          },
        },
      });

      if (signUpError || !signUpData?.user) {
        console.error('Trial signup: regular signUp error:', signUpError);
        await client.from('organizations').delete().eq('id', newOrg.id);
        return res.status(400).json({
          error: signUpError?.message || 'Failed to create user account.',
        });
      }

      authUserId = signUpData.user.id;
    }

    // 7. Create User Profile with Super Admin + Level 2 (Client CEO) Access
    // Codebase logic in lib/dashboardUtils.ts requires:
    // isClient === true && (role === 'superadmin' || role === 'super_admin' || role === 'admin')
    // and designation !== 'team_leader' => evaluates to DashboardLevel.LEVEL_2_CLIENT_CEO!
    const employeeId = `${targetOrgCode}-001`;

    const { error: profileError } = await client.from('user_profiles').upsert(
      {
        user_id: authUserId,
        email: cleanEmail,
        user_name: String(owner_name).trim(),
        contact_no: cleanPhone,
        organization_id: newOrg.id,
        employee_id: employeeId,
        super_admin: true, // Super admin flag enabled
        role: 'super_admin', // Super Admin role
        designation: 'ceo', // CEO designation for Level 2 access
        is_client: true, // Client organization owner
        user_type: 'employee',
        status: 'active', // Active status
        approval_status: 'approved', // Approved to bypass /pending redirect
        profile_complete: true, // Direct access to dashboard
        is_caller: true,
        work_type: 'on_site',
        department: 'management',
        joined_at: nowIso,
        renewal_at: expiryIso,
        expire_at: expiryIso,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        onConflict: 'user_id',
      }
    );

    if (profileError) {
      console.error('Trial signup: Error creating user profile:', profileError);
      // Rollback auth user & organization
      if (supabaseAdmin && authUserId) {
        await supabaseAdmin.auth.admin.deleteUser(authUserId);
      }
      await client.from('organizations').delete().eq('id', newOrg.id);
      return res.status(500).json({
        error: 'Failed to create profile: ' + profileError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: '10-Day Trial account and organization created successfully.',
      organization: newOrg,
      user: {
        id: authUserId,
        email: cleanEmail,
        name: String(owner_name).trim(),
        role: 'super_admin',
        designation: 'ceo',
        level: 'LEVEL_2',
      },
      expiryDate: expiryIso,
    });
  } catch (err: any) {
    console.error('Trial signup unexpected error:', err);
    return res.status(500).json({
      error: err.message || 'An unexpected error occurred during trial signup.',
    });
  }
}
