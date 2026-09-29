import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import type { CallingProviderName } from '@/lib/callingProvider';

interface ProviderFlags {
  enable: boolean;
  in_use: boolean;
}

interface ProviderState {
  sim: ProviderFlags;
  smartflo: ProviderFlags;
}

interface OrganizationProviderState {
  sim: { enable: boolean };
  smartflo: { enable: boolean };
}

interface ApiResponse {
  success: boolean;
  data?: {
    organization: OrganizationProviderState;
    user: ProviderState;
  };
  message?: string;
}

function normalizeUserProvider(value: unknown): ProviderState {
  const provider = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const sim = provider.sim && typeof provider.sim === 'object' ? provider.sim as Record<string, unknown> : {};
  const smartflo = provider.smartflo && typeof provider.smartflo === 'object' ? provider.smartflo as Record<string, unknown> : {};

  return {
    sim: { enable: sim.enable === true, in_use: sim.in_use === true },
    smartflo: { enable: smartflo.enable === true, in_use: smartflo.in_use === true },
  };
}

function normalizeOrganizationProvider(value: unknown): OrganizationProviderState {
  const provider = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const sim = provider.sim && typeof provider.sim === 'object' ? provider.sim as Record<string, unknown> : {};
  const smartflo = provider.smartflo && typeof provider.smartflo === 'object' ? provider.smartflo as Record<string, unknown> : {};

  return {
    sim: { enable: sim.enable === true },
    smartflo: { enable: smartflo.enable === true },
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, message: 'Provider service unavailable' });
  }

  const bearerMatch = req.headers.authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { data: { user: actor }, error: authError } = await supabaseAdmin.auth.getUser(bearerMatch[1]);
  if (authError || !actor) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { data: actorProfile, error: actorError } = await supabaseAdmin
    .from('user_profiles')
    .select('designation, is_client, organization_id, role, super_admin')
    .eq('user_id', actor.id)
    .maybeSingle();

  if (actorError || !actorProfile) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const isCeo = actorProfile.designation?.toLowerCase() === 'ceo';
  const isInternalAdmin = actorProfile.is_client === false &&
    !actorProfile.organization_id &&
    (actorProfile.super_admin === true || actorProfile.role?.toLowerCase() === 'super admin');

  if (!isCeo && !isInternalAdmin) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const targetUserId = req.method === 'GET' ? req.query.targetUserId : req.body?.targetUserId;
  if (typeof targetUserId !== 'string' || targetUserId.length === 0) {
    return res.status(400).json({ success: false, message: 'Target user is required' });
  }

  const { data: targetProfile, error: targetError } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, organization_id, calling_provider')
    .eq('user_id', targetUserId)
    .maybeSingle();

  if (targetError || !targetProfile?.organization_id) {
    return res.status(404).json({ success: false, message: 'Agent not found' });
  }

  const { data: organization, error: organizationError } = await supabaseAdmin
    .from('organizations')
    .select('calling_provider')
    .eq('id', targetProfile.organization_id)
    .maybeSingle();

  if (organizationError || !organization) {
    return res.status(404).json({ success: false, message: 'Agent organization not found' });
  }

  const userProvider = normalizeUserProvider(targetProfile.calling_provider);
  const organizationProvider = normalizeOrganizationProvider(organization.calling_provider);

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: { organization: organizationProvider, user: userProvider },
    });
  }

  const provider = req.body?.provider;
  const hasEnableValue = typeof req.body?.enable === 'boolean';
  const hasInUseValue = typeof req.body?.in_use === 'boolean';

  if (provider !== 'sim' && provider !== 'smartflo') {
    return res.status(400).json({ success: false, message: 'Invalid provider' });
  }
  if (hasEnableValue === hasInUseValue) {
    return res.status(400).json({ success: false, message: 'Provide exactly one of enable or in_use' });
  }

  const providerName = provider as CallingProviderName;
  const updatedProvider = {
    sim: { ...userProvider.sim },
    smartflo: { ...userProvider.smartflo },
  };

  if (hasEnableValue) {
    updatedProvider[providerName].enable = req.body.enable;
    if (!req.body.enable) updatedProvider[providerName].in_use = false;
  } else {
    if (req.body.in_use && !organizationProvider[providerName].enable) {
      return res.status(403).json({ success: false, message: 'Provider is not enabled for this organization' });
    }
    if (req.body.in_use && !userProvider[providerName].enable) {
      return res.status(403).json({ success: false, message: 'Provider is not enabled for this user' });
    }

    updatedProvider[providerName].in_use = req.body.in_use;
    if (req.body.in_use) {
      const otherProvider: CallingProviderName = providerName === 'sim' ? 'smartflo' : 'sim';
      updatedProvider[otherProvider].in_use = false;
    }
  }

  const { data: updatedProfile, error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update({ calling_provider: updatedProvider })
    .eq('user_id', targetUserId)
    .eq('organization_id', targetProfile.organization_id)
    .select('calling_provider')
    .maybeSingle();

  if (updateError || !updatedProfile) {
    return res.status(500).json({ success: false, message: 'Unable to update agent provider settings' });
  }

  return res.status(200).json({
    success: true,
    data: {
      organization: organizationProvider,
      user: normalizeUserProvider(updatedProfile.calling_provider),
    },
  });
}