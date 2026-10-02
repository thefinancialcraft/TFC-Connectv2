import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabase } from '@/lib/supabase';
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
  if (!bearerMatch) return null;

  const token = bearerMatch[1];
  const client = supabaseAdmin || supabase;
  if (!client) return null;

  try {
    const { data: { user }, error } = await client.auth.getUser(token);
    if (!error && user) return user;

    if (supabaseAdmin && client !== supabase) {
      const { data: { user: fallbackUser }, error: fallbackError } = await supabase.auth.getUser(token);
      if (!fallbackError && fallbackUser) return fallbackUser;
    }
  } catch {
    return null;
  }

  return null;
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
    return res.status(401).json({ success: false, message: 'Unauthorized. Please sign in.' });
  }

  const client = supabaseAdmin || supabase;
  if (!client) {
    return res.status(503).json({ success: false, message: 'Provider service unavailable' });
  }

  if (req.method === 'GET') {
    try {
      const state = await getCallingProviderState(authenticatedUser.id);
      if (!state) {
        return res.status(404).json({ success: false, message: 'Calling provider settings not found' });
      }

      const resolution = resolveCallingProviderFromState(state);
      let smartfloAgent: { agentId: string; agentName: string | null } | null = null;
      if (state.user.smartflo.is_mapped && state.user.smartflo.agent_id) {
        const { data: mappedAgent, error: mappedAgentError } = await client
          .from('user_smartflo_details')
          .select('smartflo_agent_id, agent_name')
          .eq('organization_id', state.organizationId)
          .eq('smartflo_agent_id', state.user.smartflo.agent_id)
          .maybeSingle();
        if (mappedAgentError) {
          return res.status(500).json({ success: false, message: 'Unable to load mapped Smartflo agent details' });
        }
        if (mappedAgent) {
          smartfloAgent = {
            agentId: mappedAgent.smartflo_agent_id,
            agentName: mappedAgent.agent_name,
          };
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          organization: state.organization,
          user: state.user,
          smartflo_agent: smartfloAgent,
          active_provider: resolution.allowed ? resolution.provider : null,
          resolution,
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

  if (requestedProvider === 'smartflo') {
    const currentState = await getCallingProviderState(authenticatedUser.id);
    if (!currentState?.user.smartflo.is_mapped) {
      return res.status(400).json({
        success: false,
        message: 'DID number not avilable config softllow setting. Please contact your admin.',
      });
    }
  }

  try {
    const { data, error } = await client.rpc('select_calling_provider', {
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