import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  session?: any;
  server_now?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[API] Update Call Session Request Received');
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[API] Missing or invalid authorization header');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('[API] User verification failed:', userError?.message);
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Set session for RLS if admin client is not available
    if (!supabaseAdmin) {
      console.log('[API] Using Anon Client, setting session for RLS');
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    }

    const { campaign_id, customer_id, status } = req.body;
    console.log('[API] Session Data:', { user_id: user.id, campaign_id, customer_id, status });

    if (!campaign_id || !customer_id || !status) {
      console.error('[API] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use admin client to ensure we can upsert regardless of RLS complexities for now
    const client = supabaseAdmin || supabase;

    // 1. Fetch Existing Session
    const { data: existingSession } = await client
        .from('call_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    let updatedSession;

    // Normalize customer IDs for comparison (ensure both are strings and trimmed)
    const incomingCustomerId = String(customer_id || '').trim();
    const existingCustomerId = existingSession ? String(existingSession.customer_id || '').trim() : '';

    console.log('[API] Existing session check:', {
        exists: !!existingSession,
        existingCustomerId: existingCustomerId,
        incomingCustomerId: incomingCustomerId,
        isMatch: existingCustomerId === incomingCustomerId,
        existingStatus: existingSession?.status,
        existingIsManual: existingSession?.is_manual
    });

    // 2. Check for Manual Call (Mismatch)
    if (existingSession && existingCustomerId !== incomingCustomerId) {
        console.log(`[API] 🔴 Manual Call Detected!`);
        console.log(`[API]    Assigned CRM Lead: ${existingCustomerId}`);
        console.log(`[API]    Dialing Customer:  ${incomingCustomerId}`);
        
        // Manual Call Logic:
        // Do NOT overwrite customer_id/campaign_id.
        // If starting manual call ('active'), PAUSE the main session AND set is_manual = true.
        // If ending manual call ('disposition_pending' or 'closed'), RESUME the main session AND set is_manual = false.

        let newStatus = existingSession.status;
        let isManual = existingSession.is_manual || false;

        console.log('[API] Before update - Status:', existingSession.status, 'is_manual:', existingSession.is_manual);
        console.log('[API] Incoming status:', status);

        if (status === 'active') {
             newStatus = 'paused';
             isManual = true;
             console.log('[API] ✅ Setting is_manual=true, status=paused (Manual call starting)');
        } else if (status === 'disposition_pending' || status === 'closed') {
             newStatus = 'assigned'; // Resume as 'assigned' to hold the lead, not 'active' to auto-call
             isManual = false;
             console.log('[API] ✅ Setting is_manual=false, status=assigned (Manual call ending)');
        }

        console.log('[API] After calculation - newStatus:', newStatus, 'isManual:', isManual);

        const { data: session, error: updateError } = await client
            .from('call_sessions')
            .update({
                status: newStatus,
                is_manual: isManual,
                updated_at: new Date().toISOString(),
                ...(status === 'active' ? { call_start_at: new Date().toISOString() } : {})
            })
            .eq('user_id', user.id)
            .select('campaign_id, customer_id, status, call_start_at, is_manual')
            .single();

        if (updateError) {
             console.error('[API] Error updating manual session state:', updateError);
             return res.status(500).json({ error: updateError.message });
        }
        updatedSession = session;

    } else {
        // 3. Standard CRM Call (Upsert)
        const { data: session, error: upsertError } = await client
          .from('call_sessions')
          .upsert({
            user_id: user.id,
            campaign_id,
            customer_id,
            status,
            is_manual: false,
            updated_at: new Date().toISOString(),
            ...(status === 'active' ? { call_start_at: new Date().toISOString() } : {})
          }, { onConflict: 'user_id' })
          .select('campaign_id, customer_id, status, call_start_at, is_manual')
          .single();

        if (upsertError) {
          console.error('[API] Upsert Error:', upsertError);
          return res.status(500).json({ error: upsertError.message });
        }
        updatedSession = session;
    }



    console.log('[API] Session updated successfully');
    return res.status(200).json({ 
        success: true, 
        session: updatedSession,
        server_now: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[API] Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
