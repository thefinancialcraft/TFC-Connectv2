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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      email, 
      password, 
      user_name, 
      contact_no, 
      profile_pic_url, 
      user_type, 
      from_admin_panel, 
      organization_id,
      is_client,
      is_caller,
      joined_at,
      renewal_at,
      expire_at
    } = req.body;

    // Validate required fields
    if (!email || !password || !user_name || !contact_no) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate contact number
    if (!/^\d{10}$/.test(contact_no)) {
      return res.status(400).json({ error: 'Contact number must be 10 digits' });
    }

    // Check if user is logged in and get their role
    let isAdmin = false;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
        
        if (!authError && authUser) {
          // Get user profile to check role
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role, super_admin')
            .eq('user_id', authUser.id)
            .maybeSingle();
          
          // Check if user is admin (role === 'admin' or role === 'super_admin' or super_admin === true)
          if (profile) {
            const role = profile.role?.toLowerCase();
            const isSuperAdmin = (profile as any).super_admin === true;
            
            if (role === 'admin' || role === 'super_admin' || isSuperAdmin) {
              isAdmin = true;
            }
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        // Continue with regular signup if error
      }
    }

    // Check if email already exists in auth.users and user_profiles
    // Prevent duplicate signups with same email
    let emailExists = false;
    
    // Check in user_profiles table first (use admin client if available to bypass RLS)
    const clientForCheck = supabaseAdmin || supabase;
    const { data: existingProfile, error: profileCheckError } = await clientForCheck
      .from('user_profiles')
      .select('email')
      .ilike('email', email)
      .maybeSingle();
    
    if (profileCheckError) {
      console.error('Error checking user_profiles:', profileCheckError);
      // Continue with auth check even if profile check fails
    }
    
    if (existingProfile && !profileCheckError) {
      console.log('Email found in user_profiles:', email);
      emailExists = true;
    }
    
    // Also check in auth.users if admin client is available
    if (supabaseAdmin && !emailExists) {
      const { data: existingUsers, error: checkError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (checkError) {
        console.error('Error checking auth.users:', checkError);
      }
      
      if (!checkError && existingUsers?.users) {
        const authEmailExists = existingUsers.users.some(
          (user: any) => user.email?.toLowerCase() === email.toLowerCase()
        );
        
        if (authEmailExists) {
          console.log('Email found in auth.users:', email);
          emailExists = true;
        }
      }
    }
    
    if (emailExists) {
      console.log('Duplicate email detected:', email);
      return res.status(409).json({ 
        error: 'An account with this email already exists. Please use login instead.' 
      });
    }
    
    console.log('Email check passed:', email);

    // Determine which client to use and email_confirm value
    // If user is logged in AND role is admin → use supabaseAdmin with email_confirm: true
    // Otherwise → use supabase with email_confirm: false
    let authData: any;
    let authError: any;
    let userId: string;
    let usedAdminClient = false;

    // Use admin client if: from admin panel OR user is admin
    if ((from_admin_panel || isAdmin) && supabaseAdmin) {
      // Admin panel or admin user creating account - use admin client with email_confirm: true
      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for admin-created accounts
        user_metadata: {
          display_name: user_name, // Display Name in auth metadata
          phone: contact_no, // Phone number in auth metadata
          user_name: user_name, // Also store as user_name for consistency
          contact_no: contact_no, // Also store as contact_no for consistency
        },
      });

      authData = { user: adminData?.user };
      authError = adminError;
      userId = adminData?.user?.id || '';
      usedAdminClient = true;
    } else {
      // Regular signup - use regular client with email_confirm: false (requires email verification)
      const signUpResult = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
          data: {
            display_name: user_name,
            phone: contact_no,
            user_name: user_name,
            contact_no: contact_no,
          },
        },
      });

      authData = signUpResult.data;
      authError = signUpResult.error;
      userId = signUpResult.data?.user?.id || '';
      usedAdminClient = false;
    }

    if (authError) {
      console.error('Auth creation error:', authError);
      
      // Handle duplicate email error specifically
      if (authError.message?.includes('already registered') || 
          authError.message?.includes('User already registered') ||
          authError.message?.includes('already exists')) {
        return res.status(409).json({ 
          error: 'An account with this email already exists. Please use login instead.' 
        });
      }
      
      // Handle other auth errors
      if (authError.message?.includes('email')) {
        return res.status(409).json({ 
          error: 'This email is already registered. Please use login instead.' 
        });
      }
      
      return res.status(400).json({ error: authError.message || 'Failed to create user' });
    }

    if (!authData?.user || !userId) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    // Store additional user data (user_name, contact_no) in user_profiles table
    // Use UPSERT to handle duplicate user_id (unique constraint)
    // Use admin client if available, otherwise use regular client (requires RLS policies)
    const clientToUse = supabaseAdmin || supabase;

    // -----------------------------------------------------------------------
    // Generate employee_id based on user_type or Organization
    // -----------------------------------------------------------------------
    const resolvedUserType: 'employee' | 'posp_agent' =
      user_type === 'posp_agent' ? 'posp_agent' : 'employee';

    let generatedEmployeeId: string | null = null;

    try {
      let basePrefix = resolvedUserType === 'posp_agent' ? 'ANXUS' : 'NXUS';
      
      // If organization_id is provided, use the organization's org_code as basePrefix
      if (organization_id) {
        const { data: orgData } = await clientToUse
          .from('organizations')
          .select('org_code')
          .eq('id', organization_id)
          .maybeSingle();
        
        if (orgData?.org_code) {
          basePrefix = orgData.org_code.toUpperCase();
        }
      }

      // For posp_agent, the prefix should be A{basePrefix}
      const idPrefix = resolvedUserType === 'posp_agent' ? `A${basePrefix}` : basePrefix;

      // Find latest employee_id with this prefix
      const { data: latestIds, error: latestError } = await clientToUse
        .from('user_profiles')
        .select('employee_id')
        .ilike('employee_id', `${idPrefix}-%`)
        .order('employee_id', { ascending: false })
        .limit(1);

      if (latestError) {
        console.error('Error fetching latest employee_id:', latestError);
      }

      let nextNumber = 1;
      if (latestIds && latestIds.length > 0 && latestIds[0].employee_id) {
        // Find all matches for the prefix pattern to correctly parse the number
        const idStr = String(latestIds[0].employee_id);
        const lastDashIndex = idStr.lastIndexOf('-');
        
        if (lastDashIndex !== -1) {
          const numPart = idStr.substring(lastDashIndex + 1);
          const parsed = parseInt(numPart, 10);
          if (!isNaN(parsed) && parsed >= 1) {
            nextNumber = parsed + 1;
          }
        }
      }

      generatedEmployeeId = `${idPrefix}-${String(nextNumber).padStart(3, '0')}`;
    } catch (genErr) {
      console.error('Error generating employee_id:', genErr);
      generatedEmployeeId = null;
    }
    
    const { error: profileError } = await clientToUse
      .from('user_profiles')
      .upsert(
        {
          user_id: userId, // UID from auth.users (unique constraint)
          email: email,
          user_name: user_name, // Display Name
          contact_no: contact_no, // Phone number
          profile_pic_url: profile_pic_url || null, // Profile picture URL
          user_type: resolvedUserType, // User type: employee or posp_agent
          organization_id: organization_id || null, // Association with organization
          // For a brand new profile, set generated employee_id
          employee_id: generatedEmployeeId,
          status: 'inactive', // Default status: inactive
          work_type: 'on_site', // Default work type: on_site
          department: 'sales', // Default department: sales
          designation: 'agent', // Default designation: agent
          created_at: new Date().toISOString(),
          profile_complete: false,
          super_admin: false,
          // Client Lifecycle
          is_client: is_client ?? true,
          is_caller: is_caller ?? true,
          joined_at: joined_at || new Date().toISOString(),
          renewal_at: renewal_at || new Date().toISOString(),
          expire_at: expire_at || (() => {
            const today = new Date();
            
            if (today.getDate() === 1) {
              const nextMonth = new Date(today);
              nextMonth.setMonth(today.getMonth() + 1);
              return nextMonth.toISOString().split('T')[0];
            } else {
              const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              const year = lastDay.getFullYear();
              const month = String(lastDay.getMonth() + 1).padStart(2, '0');
              const day = String(lastDay.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            }
          })(),
        },
        {
          onConflict: 'user_id', // Conflict resolution on user_id unique constraint
          ignoreDuplicates: false, // Update existing record instead of ignoring
        }
      );

    if (profileError) {
      console.error('Profile creation/update error:', profileError);
      // Check if it's a duplicate error
      if (profileError.code === '23505') {
        // Try to update existing profile
        const { error: updateError } = await clientToUse
          .from('user_profiles')
          .update({
            email: email,
            user_name: user_name,
            contact_no: contact_no,
            profile_pic_url: profile_pic_url || null,
            user_type: user_type || 'employee',
            status: 'inactive', // Default status: inactive
            work_type: 'on_site', // Default work type: on_site
            department: 'sales', // Default department: sales
            designation: 'agent', // Default designation: agent
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Profile update error:', updateError);
          return res.status(500).json({ 
            error: 'Account created but failed to update profile. Please contact support.' 
          });
        }
      } else {
        return res.status(500).json({ 
          error: 'Account created but failed to save profile. Please contact support.' 
        });
      }
    }

    // Verify profile was created/updated with profile_pic_url if provided
    if (profile_pic_url) {
      const { data: verifyProfile, error: verifyError } = await clientToUse
        .from('user_profiles')
        .select('profile_pic_url')
        .eq('user_id', userId)
        .single();

      if (verifyError) {
        console.error('Error verifying profile_pic_url:', verifyError);
      } else if (verifyProfile && verifyProfile.profile_pic_url !== profile_pic_url) {
        // If URL doesn't match, update it
        console.log('Profile pic URL mismatch, updating...');
        await clientToUse
          .from('user_profiles')
          .update({ profile_pic_url: profile_pic_url })
          .eq('user_id', userId);
      } else {
        console.log('Profile picture URL saved successfully:', profile_pic_url);
      }
    }


    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'An error occurred during signup' });
  }
}

