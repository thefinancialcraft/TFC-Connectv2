import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
};

interface ImportUser {
  user_name: string;
  employee_id: string;
  email: string;
  contact_no: string;
  user_type: 'employee' | 'posp_agent';
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_name, employee_id, email, contact_no, user_type, password } = req.body as ImportUser;

    // Trim all string fields
    const trimmedEmployeeId = employee_id?.trim() || '';
    const trimmedEmail = email?.trim() || '';
    const trimmedUserName = user_name?.trim() || '';
    const trimmedContactNo = contact_no?.trim() || '';
    const trimmedUserType = user_type?.trim() || '';
    const trimmedPassword = password?.trim() || '';

    // Validate required fields
    if (!trimmedEmail || !trimmedPassword || !trimmedUserName || !trimmedContactNo || !trimmedEmployeeId || !trimmedUserType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (trimmedPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Validate contact number
    if (!/^\d{10}$/.test(trimmedContactNo)) {
      return res.status(400).json({ error: 'Contact number must be 10 digits' });
    }

    // Validate user type
    if (!['employee', 'posp_agent'].includes(trimmedUserType.toLowerCase())) {
      return res.status(400).json({ error: 'User Type must be "employee" or "posp_agent"' });
    }

    // Validate employee_id is not empty
    if (!trimmedEmployeeId || trimmedEmployeeId.length === 0) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Check if auth user already exists by email
    let userId: string | null = null;
    let existingAuthUser = null;

    try {
      // Try to get existing auth user by email
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      existingAuthUser = users?.find(u => u.email?.toLowerCase() === trimmedEmail.toLowerCase());
      
      if (existingAuthUser) {
        userId = existingAuthUser.id;
        console.log('Found existing auth user with ID:', userId);
      }
    } catch (listError) {
      console.error('Error listing users:', listError);
      // Continue to create new user if listing fails
    }

    // Check for existing profile (by user_id if auth user exists, or by email/employee_id)
    let existingProfile = null;
    
    if (userId) {
      // If auth user exists, check if profile exists for this user_id
      const { data: profileByUserId, error: profileCheckError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, user_id, email, employee_id')
        .eq('user_id', userId)
        .single();

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking existing profile by user_id:', profileCheckError);
        return res.status(500).json({ error: 'Failed to check existing profile' });
      }

      if (profileByUserId) {
        existingProfile = profileByUserId;
        console.log('Found existing profile for auth user:', existingProfile);
      }
    }

    // If no profile found by user_id, check by email and employee_id
    if (!existingProfile) {
      // Check for existing email
      const { data: existingEmail, error: emailCheckError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, user_id, email, employee_id')
        .eq('email', trimmedEmail.toLowerCase())
        .maybeSingle();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        console.error('Error checking existing email:', emailCheckError);
        return res.status(500).json({ error: 'Failed to check existing email' });
      }

      if (existingEmail) {
        existingProfile = existingEmail;
        console.log('Found existing profile by email:', existingProfile);
      } else {
        // Check for existing employee_id
        const { data: existingEmployeeId, error: employeeIdCheckError } = await supabaseAdmin
          .from('user_profiles')
          .select('id, user_id, email, employee_id')
          .eq('employee_id', trimmedEmployeeId)
          .maybeSingle();

        if (employeeIdCheckError && employeeIdCheckError.code !== 'PGRST116') {
          console.error('Error checking existing employee_id:', employeeIdCheckError);
          return res.status(500).json({ error: 'Failed to check existing employee ID' });
        }

        if (existingEmployeeId) {
          existingProfile = existingEmployeeId;
          console.log('Found existing profile by employee_id:', existingProfile);
        }
      }
    }

    // If profile exists, check if we can update employee_id instead of erroring
    if (existingProfile) {
      console.log('Existing profile found:', existingProfile);
      
      // If employee_id matches, it's a true duplicate - return error
      if (existingProfile.employee_id === trimmedEmployeeId && existingProfile.email?.toLowerCase() === trimmedEmail.toLowerCase()) {
        return res.status(409).json({ error: 'User with this email and employee ID already exists' });
      }
      
      // If email matches but employee_id is different or missing, update employee_id
      if (existingProfile.email?.toLowerCase() === trimmedEmail.toLowerCase()) {
        if (!existingProfile.employee_id || existingProfile.employee_id !== trimmedEmployeeId) {
          console.log('Profile exists with same email, updating employee_id');
          const { error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({ 
              employee_id: trimmedEmployeeId,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingProfile.id);
          
          if (updateError) {
            console.error('Error updating employee_id:', updateError);
            return res.status(500).json({ 
              error: 'Failed to update employee_id: ' + updateError.message 
            });
          }
          
          return res.status(200).json({
            success: true,
            message: 'User profile exists, employee_id updated successfully',
          });
        }
      }
      
      // If employee_id matches but email is different, it's a conflict
      if (existingProfile.employee_id === trimmedEmployeeId) {
        return res.status(409).json({ error: 'Employee ID already exists with a different email' });
      }
      
      // Otherwise, it's a different conflict
      return res.status(409).json({ error: 'User profile already exists' });
    }

    // Create auth user if it doesn't exist
    if (!userId) {
      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email: trimmedEmail,
        password: trimmedPassword,
        email_confirm: true, // Auto-confirm email for imported accounts
        user_metadata: {
          display_name: trimmedUserName,
          phone: trimmedContactNo,
          user_name: trimmedUserName,
          contact_no: trimmedContactNo,
        },
      });

      if (adminError) {
        console.error('Auth creation error:', adminError);
        
        // Handle duplicate email error specifically
        if (adminError.message?.includes('already registered') || 
            adminError.message?.includes('User already registered') ||
            adminError.message?.includes('already exists')) {
          return res.status(409).json({ 
            error: 'An account with this email already exists' 
          });
        }
        
        return res.status(400).json({ error: adminError.message || 'Failed to create user' });
      }

      if (!adminData?.user) {
        return res.status(400).json({ error: 'Failed to create user' });
      }

      userId = adminData.user.id;
    }

    // Final check if profile already exists for this user_id (in case it was created between checks)
    const { data: existingProfileCheck, error: profileCheckError2 } = await supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, email, employee_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileCheckError2 && profileCheckError2.code !== 'PGRST116') {
      console.error('Error in final profile check:', profileCheckError2);
      return res.status(500).json({ error: 'Failed to check existing profile' });
    }

    if (existingProfileCheck) {
      console.log('Profile found in final check, checking if employee_id needs update');
      console.log('Current employee_id:', existingProfileCheck.employee_id, 'New employee_id:', trimmedEmployeeId);
      
      // If profile exists, try to update employee_id if it's missing or different
      if (!existingProfileCheck.employee_id || existingProfileCheck.employee_id !== trimmedEmployeeId) {
        console.log('Updating employee_id from', existingProfileCheck.employee_id, 'to', trimmedEmployeeId);
        
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            employee_id: trimmedEmployeeId,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error updating employee_id:', updateError);
          return res.status(500).json({ 
            error: 'User profile exists but failed to update employee_id: ' + updateError.message 
          });
        }
        
        console.log('Successfully updated employee_id');
        return res.status(200).json({
          success: true,
          message: 'User profile exists, employee_id updated successfully',
        });
      } else {
        console.log('Employee_id already matches, returning success');
        return res.status(200).json({
          success: true,
          message: 'User profile already exists with matching employee_id',
        });
      }
    }

    // Prepare insert data
    const insertData = {
      user_id: userId,
      email: trimmedEmail,
      user_name: trimmedUserName,
      contact_no: trimmedContactNo,
      employee_id: trimmedEmployeeId, // Use employee_id from CSV (trimmed)
      user_type: trimmedUserType.toLowerCase(),
      status: 'inactive', // Default status: inactive
      work_type: 'on_site', // Default work type: on_site
      department: 'sales', // Default department: sales
      designation: 'agent', // Default designation: agent
      approval_status: 'pending', // Default approval status: pending
      created_at: new Date().toISOString(),
      profile_complete: false,
      super_admin: false,
    };

    // Log for debugging before insert
    console.log('Inserting user profile with data:', JSON.stringify(insertData, null, 2));
    console.log('Employee ID value:', trimmedEmployeeId, 'Type:', typeof trimmedEmployeeId, 'Length:', trimmedEmployeeId.length);

    // Create user profile with employee_id using insert
    const { data: insertedData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert(insertData)
      .select('id, employee_id, email, user_name');

    if (profileError) {
      console.error('Profile creation error:', profileError);
      console.error('Error details:', JSON.stringify(profileError, null, 2));
      
      // Only try to delete auth user if we created it in this request
      if (!existingAuthUser) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(userId);
        } catch (deleteError) {
          console.error('Error deleting auth user:', deleteError);
        }
      }
      
      return res.status(500).json({ 
        error: 'Failed to create user profile: ' + profileError.message 
      });
    }

    // Verify the inserted data and update employee_id if needed
    if (insertedData && insertedData.length > 0) {
      console.log('Successfully inserted user profile:', JSON.stringify(insertedData[0], null, 2));
      console.log('Inserted employee_id:', insertedData[0].employee_id);
      
      // Double-check by querying the database
      const { data: verifyData, error: verifyError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, employee_id, email')
        .eq('user_id', userId)
        .single();
      
      if (verifyError) {
        console.error('Error verifying inserted data:', verifyError);
      } else {
        console.log('Verified employee_id from database:', verifyData.employee_id);
        if (verifyData.employee_id !== trimmedEmployeeId) {
          console.error('MISMATCH: Expected employee_id:', trimmedEmployeeId, 'Got:', verifyData.employee_id);
          console.log('Attempting to update employee_id...');
          
          // Update employee_id if it doesn't match
          const { error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({ employee_id: trimmedEmployeeId })
            .eq('user_id', userId);
          
          if (updateError) {
            console.error('Error updating employee_id:', updateError);
          } else {
            console.log('Successfully updated employee_id to:', trimmedEmployeeId);
            
            // Verify again
            const { data: reVerifyData } = await supabaseAdmin
              .from('user_profiles')
              .select('employee_id')
              .eq('user_id', userId)
              .single();
            
            console.log('Re-verified employee_id:', reVerifyData?.employee_id);
          }
        }
      }
    } else {
      console.warn('No data returned from insert, but no error occurred');
      // Try to update employee_id directly
      console.log('Attempting to update employee_id directly...');
      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({ employee_id: trimmedEmployeeId })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating employee_id:', updateError);
      } else {
        console.log('Successfully updated employee_id to:', trimmedEmployeeId);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'User imported successfully',
    });
  } catch (error: any) {
    console.error('Import user error:', error);
    return res.status(500).json({ error: 'An error occurred during user import' });
  }
}

