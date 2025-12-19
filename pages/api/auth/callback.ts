import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  redirect?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get tokens from query params
    const { access_token, refresh_token, error: errorParam, error_description } = req.query;

    // Check for errors in URL
    if (errorParam) {
      const errorMsg = (error_description as string) || (errorParam as string);
      return res.status(400).json({ 
        error: errorMsg,
        redirect: '/login'
      });
    }

    // If we have tokens, verify and process them
    if (access_token && refresh_token) {
      // Verify the token and get user
      const { data: { user }, error: userError } = await supabase.auth.getUser(access_token as string);

      if (userError || !user) {
        return res.status(401).json({ 
          error: 'Invalid token',
          redirect: '/login'
        });
      }

      // Verify email confirmation
      if (!user.email_confirmed_at) {
        return res.status(403).json({ 
          error: 'Email verification required',
          redirect: '/login'
        });
      }

      // Success - return redirect URL
      return res.status(200).json({
        success: true,
        redirect: '/dashboard'
      });
    } else {
      // No tokens found
      return res.status(400).json({ 
        error: 'No authentication tokens found',
        redirect: '/login'
      });
    }
  } catch (error: any) {
    console.error('Callback error:', error);
    return res.status(500).json({ 
      error: error.message || 'An error occurred',
      redirect: '/login'
    });
  }
}

