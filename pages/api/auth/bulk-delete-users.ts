import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
  deletedCount?: number;
  errors?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userIds } = req.body as { userIds: string[] }; // Array of user_profiles.id (primary keys)

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs array is required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Admin client not available' });
    }

    let deletedCount = 0;
    const errors: string[] = [];

    // Fetch all user profiles to get user_id and profile_pic_url
    const { data: userProfiles, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, profile_pic_url, email, user_name')
      .in('id', userIds);

    if (fetchError) {
      console.error('Error fetching user profiles:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch user profiles' });
    }

    if (!userProfiles || userProfiles.length === 0) {
      return res.status(404).json({ error: 'No users found with provided IDs' });
    }

    // Process each user for deletion
    for (const profile of userProfiles) {
      try {
        const profileId = profile.id;
        const authUserId = profile.user_id;
        const profilePicUrl = profile.profile_pic_url;

        // Delete profile picture from storage if it exists
        if (profilePicUrl) {
          try {
            let filePath: string | null = null;
            let bucketName = 'user-documents'; // Default bucket name

            // Try to extract file path from URL
            // URL format options:
            // 1. Public URL: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
            // 2. Signed URL: https://[project].supabase.co/storage/v1/object/sign/[bucket]/[path]?token=...
            // 3. Direct path: [user_id]/profile_pic/[filename]
            
            if (profilePicUrl.includes('/storage/v1/object/')) {
              // Extract from Supabase storage URL
              const urlParts = profilePicUrl.split('/storage/v1/object/');
              if (urlParts.length === 2) {
                const afterStorage = urlParts[1];
                // Remove query params if present (for signed URLs)
                const pathWithoutQuery = afterStorage.split('?')[0];
                const pathParts = pathWithoutQuery.split('/');
                
                if (pathParts.length >= 2) {
                  // First part after 'public' or 'sign' is bucket name
                  bucketName = pathParts[0];
                  filePath = pathParts.slice(1).join('/');
                }
              }
            } else if (profilePicUrl.includes('/')) {
              // Assume it's a direct path
              filePath = profilePicUrl;
            }

            // If we have a file path, try to delete from storage
            if (filePath) {
              // Try to delete from the bucket
              const { error: storageError } = await supabaseAdmin.storage
                .from(bucketName)
                .remove([filePath]);

              if (storageError) {
                console.error(`Error deleting profile picture for user ${profileId} from ${bucketName}/${filePath}:`, storageError);
                // Continue with deletion even if storage deletion fails
              } else {
                console.log(`Deleted profile picture for user ${profileId} from ${bucketName}/${filePath}`);
              }
            } else {
              console.warn(`Could not extract file path from profile_pic_url for user ${profileId}: ${profilePicUrl}`);
            }
          } catch (storageErr: any) {
            console.error(`Error processing storage deletion for user ${profileId}:`, storageErr);
            // Continue with deletion even if storage deletion fails
          }
        }

        // Delete from user_profiles
        const { error: profileDeleteError } = await supabaseAdmin
          .from('user_profiles')
          .delete()
          .eq('id', profileId);

        if (profileDeleteError) {
          console.error(`Error deleting user profile ${profileId}:`, profileDeleteError);
          errors.push(`Failed to delete profile for ${profile.email || profileId}: ${profileDeleteError.message}`);
          continue;
        }

        // Delete from auth
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);

        if (authDeleteError) {
          console.error(`Error deleting auth user ${authUserId}:`, authDeleteError);
          errors.push(`Failed to delete auth account for ${profile.email || profileId}: ${authDeleteError.message}`);
          // Continue - profile is already deleted
        } else {
          deletedCount++;
          console.log(`Successfully deleted user ${profile.email || profileId}`);
        }
      } catch (err: any) {
        console.error(`Error deleting user ${profile.id}:`, err);
        errors.push(`Failed to delete ${profile.email || profile.id}: ${err.message || 'Unknown error'}`);
      }
    }

    if (deletedCount === 0) {
      return res.status(500).json({
        error: 'Failed to delete any users',
        errors: errors,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedCount} user(s)`,
      deletedCount: deletedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return res.status(500).json({ error: 'An error occurred during bulk deletion' });
  }
}

