import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabase } from '../../../lib/supabase';

type Data = {
  success: boolean;
  agents?: Record<string, { user_name: string | null; employee_id: string | null }>;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { agentIds } = req.body || {};
    if (!Array.isArray(agentIds) || agentIds.length === 0) {
      return res.status(200).json({ success: true, agents: {} });
    }

    const cleanIds = Array.from(new Set(agentIds.map(id => String(id).trim()).filter(Boolean)));
    if (cleanIds.length === 0) {
      return res.status(200).json({ success: true, agents: {} });
    }

    const client = supabaseAdmin || supabase;
    const agentMap: Record<string, { user_name: string | null; employee_id: string | null }> = {};

    // 1. Query by user_id
    const { data: byUserId } = await client
      .from('user_profiles')
      .select('user_id, id, user_name, employee_id')
      .in('user_id', cleanIds);

    if (byUserId) {
      byUserId.forEach(p => {
        const info = { user_name: p.user_name || null, employee_id: p.employee_id || null };
        if (p.user_id) agentMap[p.user_id] = info;
        if (p.id) agentMap[p.id] = info;
        if (p.employee_id) agentMap[p.employee_id] = info;
      });
    }

    // 2. For any remaining IDs not found, query by id (primary key)
    const remainingIds = cleanIds.filter(id => !agentMap[id]);
    if (remainingIds.length > 0) {
      const { data: byId } = await client
        .from('user_profiles')
        .select('user_id, id, user_name, employee_id')
        .in('id', remainingIds);

      if (byId) {
        byId.forEach(p => {
          const info = { user_name: p.user_name || null, employee_id: p.employee_id || null };
          if (p.user_id) agentMap[p.user_id] = info;
          if (p.id) agentMap[p.id] = info;
          if (p.employee_id) agentMap[p.employee_id] = info;
        });
      }
    }

    // 3. For any remaining IDs, query by employee_id
    const remainingForEmp = cleanIds.filter(id => !agentMap[id]);
    if (remainingForEmp.length > 0) {
      const { data: byEmp } = await client
        .from('user_profiles')
        .select('user_id, id, user_name, employee_id')
        .in('employee_id', remainingForEmp);

      if (byEmp) {
        byEmp.forEach(p => {
          const info = { user_name: p.user_name || null, employee_id: p.employee_id || null };
          if (p.user_id) agentMap[p.user_id] = info;
          if (p.id) agentMap[p.id] = info;
          if (p.employee_id) agentMap[p.employee_id] = info;
        });
      }
    }

    return res.status(200).json({ success: true, agents: agentMap });
  } catch (error: any) {
    console.error('Error fetching agent names for search:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
