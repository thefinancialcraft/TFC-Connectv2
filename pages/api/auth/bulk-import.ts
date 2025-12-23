import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
  successCount?: number;
  errors?: string[];
};

interface BulkUser {
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
    const { users } = req.body as { users: BulkUser[] };

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: 'Users array is required' });
    }

    // Validate all users first
    const validationErrors: string[] = [];
    const emails = new Set<string>();
    const employeeIds = new Set<string>();

    users.forEach((user, index) => {
      // Check for duplicate emails in the batch
      if (emails.has(user.email.toLowerCase())) {
        validationErrors.push(`Row ${index + 1}: Duplicate email in CSV: ${user.email}`);
      } else {
        emails.add(user.email.toLowerCase());
      }

      // Check for duplicate employee IDs in the batch
      if (employeeIds.has(user.employee_id)) {
        validationErrors.push(`Row ${index + 1}: Duplicate Employee ID in CSV: ${user.employee_id}`);
      } else {
        employeeIds.add(user.employee_id);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check for existing emails and employee IDs in database
    const existingEmails = users.map(u => u.email.toLowerCase());
    const existingEmployeeIds = users.map(u => u.employee_id);

    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('email, employee_id')
      .or(`email.in.(${existingEmails.map(e => `"${e}"`).join(',')}),employee_id.in.(${existingEmployeeIds.map(id => `"${id}"`).join(',')})`);

    if (checkError) {
      console.error('Error checking existing users:', checkError);
      return res.status(500).json({ error: 'Failed to check existing users' });
    }

    const existingEmailSet = new Set((existingUsers || []).map(u => u.email?.toLowerCase()).filter(Boolean));
    const existingEmployeeIdSet = new Set((existingUsers || []).map(u => u.employee_id).filter(Boolean));

    const dbErrors: string[] = [];
    users.forEach((user, index) => {
      if (existingEmailSet.has(user.email.toLowerCase())) {
        dbErrors.push(`Row ${index + 1}: Email already exists: ${user.email}`);
      }
      if (existingEmployeeIdSet.has(user.employee_id)) {
        dbErrors.push(`Row ${index + 1}: Employee ID already exists: ${user.employee_id}`);
      }
    });

    if (dbErrors.length > 0) {
      return res.status(409).json({ 
        error: 'Duplicate entries found',
        errors: dbErrors
      });
    }

    // Create users
    const createdUsers = [];
    const creationErrors: string[] = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // Create auth user with email_confirm: true
        const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm email for bulk imported accounts
          user_metadata: {
            display_name: user.user_name,
            phone: user.contact_no,
            user_name: user.user_name,
            contact_no: user.contact_no,
          },
        });

        if (adminError || !adminData?.user) {
          creationErrors.push(`Row ${i + 1}: Failed to create user - ${adminError?.message || 'Unknown error'}`);
          continue;
        }

        const userId = adminData.user.id;

        // Create user profile with employee_id
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: userId,
            email: user.email,
            user_name: user.user_name,
            contact_no: user.contact_no,
            employee_id: user.employee_id, // Use employee_id from CSV
            user_type: user.user_type,
            status: 'inactive', // Default status: inactive
            work_type: 'on_site', // Default work type: on_site
            department: 'sales', // Default department: sales
            designation: 'agent', // Default designation: agent
            approval_status: 'pending', // Default approval status: pending
            created_at: new Date().toISOString(),
            profile_complete: false,
            super_admin: false,
          });

        if (profileError) {
          creationErrors.push(`Row ${i + 1}: Failed to create profile - ${profileError.message}`);
          // Try to delete the auth user if profile creation fails
          try {
            await supabaseAdmin.auth.admin.deleteUser(userId);
          } catch (deleteError) {
            console.error('Error deleting auth user:', deleteError);
          }
          continue;
        }

        createdUsers.push(user);
      } catch (err: any) {
        creationErrors.push(`Row ${i + 1}: ${err.message || 'Unknown error'}`);
      }
    }

    if (createdUsers.length === 0) {
      return res.status(400).json({ 
        error: 'Failed to create any users',
        errors: creationErrors
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully imported ${createdUsers.length} user(s)`,
      successCount: createdUsers.length,
      errors: creationErrors.length > 0 ? creationErrors : undefined,
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return res.status(500).json({ error: 'An error occurred during bulk import' });
  }
}

