import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import {
  getCallingProviderState,
  resolveCallingProviderFromState,
  type CallingProviderName,
} from '@/lib/callingProvider';

interface ApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

async function getAuthenticatedUser(req: NextApiRequest) {
  const authorization = req.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch || !supabaseAdmin) return null;

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(bearerMatch[1]);
  return error || !user ? null : user;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const authenticatedUser = await getAuthenticatedUser(req);
  if (!authenticatedUser) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, message: 'Provider service unavailable' });
  }

  if (req.method === 'GET') {
    try {
      const state = await getCallingProviderState(authenticatedUser.id);
      if (!state) {
        return res.status(404).json({ success: false, message: 'Calling provider settings not found' });
      }

      const resolution = resolveCallingProviderFromState(state);
      return res.status(200).json({
        success: true,
        data: {
          organization: state.organization,
          user: state.user,
          active_provider: resolution.allowed ? resolution.provider : null,
        },
      });
    } catch {
      return res.status(500).json({ success: false, message: 'Unable to load calling provider settings' });
    }
  }

  const requestedProvider = req.body?.provider;
  if (requestedProvider !== 'sim' && requestedProvider !== 'smartflo') {
    return res.status(400).json({ success: false, message: 'Invalid provider' });
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('select_calling_provider', {
      p_user_id: authenticatedUser.id,
      p_provider: requestedProvider as CallingProviderName,
    });

    if (error) {
      if (error.message.includes('provider_not_enabled_for_organization') || error.message.includes('organization_not_found')) {
        return res.status(403).json({ success: false, message: 'Provider is not enabled for this organization' });
      }
      if (error.message.includes('provider_not_enabled_for_user')) {
        return res.status(403).json({ success: false, message: 'Provider is not enabled for this user' });
      }
      if (error.message.includes('invalid_provider')) {
        return res.status(400).json({ success: false, message: 'Invalid provider' });
      }
      return res.status(500).json({ success: false, message: 'Unable to update calling provider' });
    }

    return res.status(200).json({ success: true, data });
  } catch {
    return res.status(500).json({ success: false, message: 'Unable to update calling provider' });
  }
}