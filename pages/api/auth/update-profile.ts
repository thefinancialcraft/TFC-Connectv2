import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
  rootCause?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the auth token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token and get user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const {
      // basic_info
      user_name,
      contact_no,
      // personal_info
      father_name,
      gender,
      date_of_birth,
      alternate_contact,
      emergency_contact_no,
      blood_group,
      // employment_info
      date_of_joining,
      in_hand_salary,
      // address_info
      primary_address,
      area_pincode,
      // kyc_info
      pan_number,
      aadhar_card_no,
      // bank_info
      bank_name,
      account_holder_name,
      account_number,
      ifsc_code,
      branch_city,
      branch_state,
      branch_pincode,
      // documents
      profile_pic_url,
      pancard_url,
      aadhar_front_url,
      aadhar_back_url,
      qualification_marksheet_url,
      bank_passbook_url,
      // Client Lifecycle
      is_client,
      joined_at,
      renewal_at,
      expire_at,
    } = req.body;

    // Fetch current user profile first to compare and preserve dates/name
    const clientToUse = supabaseAdmin || supabase;
    const { data: currentProfile, error: fetchError } = await clientToUse
      .from('user_profiles')
      .select('user_id, user_name, contact_no, expire_at, renewal_at, is_client')
      .eq('user_id', authUser.id)
      .maybeSingle();

    // Prepare update data (only include provided fields)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // basic_info: Prevent user_name from being set to null/empty string
    if (user_name !== undefined) {
      const trimmedName = typeof user_name === 'string' ? user_name.trim() : '';
      updateData.user_name = trimmedName !== '' ? trimmedName : (currentProfile?.user_name || null);
    }
    if (contact_no !== undefined) updateData.contact_no = contact_no || null;
    
    // personal_info
    if (father_name !== undefined) updateData.father_name = father_name || null;
    if (gender !== undefined) updateData.gender = gender || null;
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth || null;
    if (alternate_contact !== undefined) updateData.alternate_contact = alternate_contact || null;
    if (emergency_contact_no !== undefined) updateData.emergency_contact_no = emergency_contact_no || null;
    if (blood_group !== undefined) updateData.blood_group = blood_group || null;
    
    // employment_info
    if (date_of_joining !== undefined) updateData.date_of_joining = date_of_joining || null;
    if (in_hand_salary !== undefined) {
      updateData.in_hand_salary = in_hand_salary ? parseFloat(in_hand_salary) : null;
    }
    
    // address_info
    if (primary_address !== undefined) updateData.primary_address = primary_address || null;
    if (area_pincode !== undefined) updateData.area_pincode = area_pincode || null;
    
    // kyc_info
    if (pan_number !== undefined) updateData.pan_number = pan_number || null;
    if (aadhar_card_no !== undefined) updateData.aadhar_card_no = aadhar_card_no || null;
    
    // bank_info
    if (bank_name !== undefined) updateData.bank_name = bank_name || null;
    if (account_holder_name !== undefined) updateData.account_holder_name = account_holder_name || null;
    if (account_number !== undefined) updateData.account_number = account_number || null;
    if (ifsc_code !== undefined) updateData.ifsc_code = ifsc_code || null;
    if (branch_city !== undefined) updateData.branch_city = branch_city || null;
    if (branch_state !== undefined) updateData.branch_state = branch_state || null;
    if (branch_pincode !== undefined) updateData.branch_pincode = branch_pincode || null;
    
    // documents
    if (profile_pic_url !== undefined) updateData.profile_pic_url = profile_pic_url || null;
    if (pancard_url !== undefined) updateData.pancard_url = pancard_url || null;
    if (aadhar_front_url !== undefined) updateData.aadhar_front_url = aadhar_front_url || null;
    if (aadhar_back_url !== undefined) updateData.aadhar_back_url = aadhar_back_url || null;
    if (qualification_marksheet_url !== undefined) updateData.qualification_marksheet_url = qualification_marksheet_url || null;
    if (bank_passbook_url !== undefined) updateData.bank_passbook_url = bank_passbook_url || null;

    // Client Lifecycle: Default is_client to true unless explicitly passed false/false string
    if (is_client !== undefined) {
      updateData.is_client = is_client === true || is_client === 'true';
    } else if (!currentProfile || currentProfile.is_client === undefined || currentProfile.is_client === null) {
      updateData.is_client = true;
    }

    if (joined_at !== undefined) updateData.joined_at = joined_at || null;
    if (renewal_at !== undefined) {
      updateData.renewal_at = renewal_at || currentProfile?.renewal_at || new Date().toISOString();
    }

    // Expiry Date Logic:
    // If existing expiry date is in future, retain it unless a valid new date is passed.
    // If no existing future date or empty string passed, fallback to Current Date + 3 Days.
    const now = new Date();
    const existingExpiry = currentProfile?.expire_at ? new Date(currentProfile.expire_at) : null;
    const hasValidFutureExistingExpiry = existingExpiry && !isNaN(existingExpiry.getTime()) && existingExpiry > now;

    if (expire_at) {
      const parsedNewExpiry = new Date(expire_at);
      if (!isNaN(parsedNewExpiry.getTime())) {
        updateData.expire_at = parsedNewExpiry.toISOString();
      } else if (hasValidFutureExistingExpiry && currentProfile?.expire_at) {
        updateData.expire_at = currentProfile.expire_at;
      } else {
        const threeDaysAhead = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        updateData.expire_at = threeDaysAhead.toISOString();
      }
    } else if (hasValidFutureExistingExpiry && currentProfile?.expire_at) {
      updateData.expire_at = currentProfile.expire_at;
    } else {
      const threeDaysAhead = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      updateData.expire_at = threeDaysAhead.toISOString();
    }
    
    // profile_complete flag
    if (req.body.profile_complete !== undefined) {
      updateData.profile_complete = req.body.profile_complete;
    }

    // Update user profile in user_profiles table
    const { error: updateError } = await clientToUse
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', authUser.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return res.status(400).json({ 
        error: 'Failed to update profile. Account has some issue. Please contact Admin.',
        rootCause: updateError.message
      });
    }

    // Also update auth metadata if user_name or contact_no changed
    if (user_name !== undefined || contact_no !== undefined) {
      const finalName = updateData.user_name || currentProfile?.user_name;
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          display_name: finalName || authUser.user_metadata?.display_name || undefined,
          user_name: finalName || authUser.user_metadata?.user_name || undefined,
          phone: contact_no || authUser.user_metadata?.phone || undefined,
          contact_no: contact_no || authUser.user_metadata?.contact_no || undefined,
        },
      });

      if (metadataError) {
        console.error('Metadata update error:', metadataError);
        return res.status(400).json({
          error: 'Account metadata update failed. Please contact Admin.',
          rootCause: `Auth Metadata Error: ${metadataError.message}`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while updating profile. Account has some issue. Please contact Admin.',
      rootCause: error.message || String(error)
    });
  }
}


