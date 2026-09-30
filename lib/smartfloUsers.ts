import { smartfloAdminClient } from '@/lib/smartfloServer';

function asNullableString(value: unknown, maxLength: number): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text.slice(0, maxLength) : null;
}

export async function syncSmartfloUsers(organizationId: string, smartfloUsers: unknown[]) {
  const { data: crmUsers, error: crmUsersError } = await smartfloAdminClient!
    .from('user_profiles')
    .select('user_id, email')
    .eq('organization_id', organizationId)
    .limit(5000);

  if (crmUsersError) throw new Error('Unable to load CRM users for mapping.');

  const usersByEmail = new Map<string, string>();
  for (const crmUser of crmUsers || []) {
    if (crmUser.email && crmUser.user_id) {
      usersByEmail.set(String(crmUser.email).trim().toLowerCase(), crmUser.user_id);
    }
  }

  const rowsByAgentId = new Map<string, Record<string, unknown>>();
  for (const itemValue of smartfloUsers) {
    if (!itemValue || typeof itemValue !== 'object') continue;
    const item = itemValue as Record<string, unknown>;
    const agent = item.agent && typeof item.agent === 'object' ? item.agent as Record<string, unknown> : {};
    const agentId = asNullableString(agent.id, 50);
    if (!agentId) continue;

    const loginId = asNullableString(item.login_id, 100);
    const userId = loginId ? usersByEmail.get(loginId.toLowerCase()) || null : null;
    rowsByAgentId.set(agentId, {
      organization_id: organizationId,
      user_id: userId,
      smartflo_agent_id: agentId,
      smartflo_user_id: asNullableString(item.id, 50),
      intercom: asNullableString(item.intercom, 20),
      extension: asNullableString(item.extension, 50),
      follow_me_number: asNullableString(agent.follow_me_number, 20),
      login_id: loginId,
      agent_name: asNullableString(item.name, 100),
      is_mapped: Boolean(userId),
      is_active: Number(item.user_status) === 1,
    });
  }

  const rows = [...rowsByAgentId.values()];
  if (rows.length > 0) {
    const agentIds = rows.map((row) => String(row.smartflo_agent_id));
    const { data: existingAgents, error: existingAgentsError } = await smartfloAdminClient!
      .from('user_smartflo_details')
      .select('smartflo_agent_id, caller_id')
      .eq('organization_id', organizationId)
      .in('smartflo_agent_id', agentIds);
    if (existingAgentsError) throw new Error('Unable to preserve saved Smartflo caller IDs.');

    const callerIdsByAgentId = new Map((existingAgents || [])
      .map((agent) => [agent.smartflo_agent_id, agent.caller_id] as const));
    for (const row of rows) {
      row.caller_id = callerIdsByAgentId.get(String(row.smartflo_agent_id)) ?? null;
    }

    const { error } = await smartfloAdminClient!
      .from('user_smartflo_details')
      .upsert(rows, { onConflict: 'organization_id,smartflo_agent_id' });
    if (error) throw new Error('Unable to save Smartflo agent details.');
  }

  return {
    syncedCount: rows.length,
    mappedCount: rows.filter((row) => row.is_mapped).length,
    unmappedCount: rows.filter((row) => !row.is_mapped).length,
  };
}