import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
};

/**
 * Admin endpoint to update any user's profile by their user_profiles.id
 * This is used when viewing/editing other users' profiles
 */
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

    // Get target user ID from request body (the id from user_profiles table)
    const { targetUserId, ...updateFields } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ error: 'targetUserId is required' });
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
    } = updateFields;

    // Prepare update data (only include provided fields)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // basic_info
    if (user_name !== undefined) updateData.user_name = user_name || null;
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
    
    // profile_complete flag
    if (req.body.profile_complete !== undefined) {
      updateData.profile_complete = req.body.profile_complete;
    }

    // Use admin client to update any user's profile
    if (!supabaseAdmin) {
      return res.status(500).json({ 
        error: 'Admin client not configured. This endpoint requires admin access.' 
      });
    }

    // First, get the target user's profile to get their user_id
    const { data: targetProfile, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, user_name, contact_no')
      .eq('id', targetUserId)
      .single();

    if (fetchError || !targetProfile) {
      console.error('Error fetching target user profile:', fetchError);
      return res.status(404).json({ error: 'Target user not found' });
    }

    // Update user profile in user_profiles table using id (primary key)
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return res.status(400).json({ error: updateError.message || 'Failed to update profile' });
    }

    // Also update auth metadata if user_name or contact_no changed
    if ((user_name !== undefined || contact_no !== undefined) && targetProfile.user_id) {
      const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
        targetProfile.user_id,
        {
          user_metadata: {
            display_name: user_name !== undefined ? (user_name || null) : undefined,
            user_name: user_name !== undefined ? (user_name || null) : undefined,
            phone: contact_no !== undefined ? (contact_no || null) : undefined,
            contact_no: contact_no !== undefined ? (contact_no || null) : undefined,
          },
        }
      );

      if (metadataError) {
        console.error('Metadata update error:', metadataError);
        // Don't fail the request if metadata update fails
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update user profile error:', error);
    return res.status(500).json({ error: 'An error occurred while updating profile' });
  }
}

