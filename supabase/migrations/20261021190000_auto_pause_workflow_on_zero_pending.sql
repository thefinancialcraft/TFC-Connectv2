-- Migration: Auto pause LeadPilot workflow when no pending leads remain
-- Created at: 2026-10-21 19:00:00

-- 1. Trigger function to auto-pause workflow when pending_leads reaches 0
CREATE OR REPLACE FUNCTION public.check_leadpilot_auto_pause()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If pending leads reached 0 or less and workflow is active (scheduled or running), auto-pause it
    IF NEW.pending_leads <= 0 AND NEW.status IN ('scheduled', 'running') THEN
        NEW.status := 'paused';
        NEW.next_execution_at := NULL;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_leadpilot_auto_pause ON public.leadpilot;
CREATE TRIGGER trg_leadpilot_auto_pause
BEFORE INSERT OR UPDATE OF pending_leads, status ON public.leadpilot
FOR EACH ROW
EXECUTE FUNCTION public.check_leadpilot_auto_pause();

-- 2. Update execute_due_leadpilot_batches procedure to explicitly set paused when pending_leads is 0
CREATE OR REPLACE FUNCTION public.execute_due_leadpilot_batches()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_wf RECORD;
    v_lead RECORD;
    v_batch_num integer;
    v_leads_attempted integer := 0;
    v_leads_succeeded integer := 0;
    v_leads_failed integer := 0;
    v_agent_ids uuid[] := '{}';
    v_agent_count integer := 0;
    v_assigned_agent_id uuid;
    v_cursor integer;
    v_dist_summary jsonb := '{}'::jsonb;
    v_next_exec timestamptz;
    v_pending_remaining integer;
    v_results jsonb := '[]'::jsonb;
    v_new_cust_id uuid;
BEGIN
    FOR v_wf IN 
        SELECT *
        FROM public.leadpilot
        WHERE status IN ('scheduled', 'running')
          AND next_execution_at IS NOT NULL
          AND next_execution_at <= now()
          AND CURRENT_DATE BETWEEN start_date AND end_date
        FOR UPDATE SKIP LOCKED
    LOOP
        -- Check pause days in IST
        IF v_wf.pause_days IS NOT NULL AND trim(to_char((now() AT TIME ZONE 'Asia/Kolkata'), 'Day')) = ANY(v_wf.pause_days) THEN
            v_next_exec := public.calculate_leadpilot_next_execution(v_wf.batch_times, v_wf.pause_days, v_wf.start_date, v_wf.end_date, now());
            UPDATE public.leadpilot SET next_execution_at = v_next_exec, updated_at = now() WHERE id = v_wf.id;
            CONTINUE;
        END IF;

        v_batch_num := v_wf.completed_batches + 1;
        v_leads_attempted := 0;
        v_leads_succeeded := 0;
        v_leads_failed := 0;
        v_dist_summary := '{}'::jsonb;
        v_cursor := COALESCE(v_wf.agent_cursor_index, 0);

        IF v_wf.assignment_type = 'assigned' AND v_wf.assigned_agents_config ? 'agent_ids' THEN
            SELECT array_agg(elem::uuid)
            INTO v_agent_ids
            FROM jsonb_array_elements_text(v_wf.assigned_agents_config->'agent_ids') AS elem
            WHERE elem ~ '^[0-9a-fA-F-]{36}$';
            v_agent_count := COALESCE(array_length(v_agent_ids, 1), 0);
        ELSE
            v_agent_count := 0;
            v_agent_ids := '{}';
        END IF;

        FOR v_lead IN
            SELECT *
            FROM public.lead_sheduled
            WHERE pilotlead_id = v_wf.id
              AND upload_status = 'pending'
            ORDER BY 
              CASE WHEN v_wf.sort_by = 'name_asc' THEN customer_name END ASC,
              CASE WHEN v_wf.sort_by = 'name_desc' THEN customer_name END DESC,
              CASE WHEN v_wf.sort_by = 'expiry_date_asc' THEN expiry_date END ASC NULLS LAST,
              CASE WHEN v_wf.sort_by = 'expiry_date_desc' THEN expiry_date END DESC NULLS LAST,
              row_index ASC
            LIMIT v_wf.batch_size
            FOR UPDATE SKIP LOCKED
        LOOP
            v_leads_attempted := v_leads_attempted + 1;

            IF v_agent_count > 0 THEN
                v_assigned_agent_id := v_agent_ids[(v_cursor % v_agent_count) + 1];
                v_cursor := v_cursor + 1;
                v_dist_summary := jsonb_set(
                    v_dist_summary,
                    ARRAY[v_assigned_agent_id::text],
                    to_jsonb(COALESCE((v_dist_summary->>v_assigned_agent_id::text)::int, 0) + 1)
                );
            ELSE
                v_assigned_agent_id := NULL;
            END IF;

            BEGIN
                INSERT INTO public.customers (
                    organization_id,
                    campaign_id,
                    source_id,
                    lead_id,
                    customer_name,
                    phone_no,
                    phone_search_hash,
                    expiry_date,
                    customer_details,
                    assigned_to,
                    pilotlead_id,
                    batch_number,
                    batch_executed_at,
                    status,
                    created_at,
                    updated_at
                ) VALUES (
                    v_wf.organization_id,
                    v_wf.campaign_id,
                    v_wf.source_id,
                    COALESCE(v_lead.lead_id, 'LEAD-LP-' || to_char(now(), 'YYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
                    v_lead.customer_name,
                    v_lead.phone_no,
                    v_lead.phone_search_hash,
                    v_lead.expiry_date,
                    v_lead.customer_details,
                    v_assigned_agent_id,
                    v_wf.id,
                    v_batch_num,
                    now(),
                    'active',
                    now(),
                    now()
                )
                RETURNING id INTO v_new_cust_id;

                UPDATE public.lead_sheduled
                SET upload_status = 'uploaded',
                    batch_number = v_batch_num,
                    uploaded_at = now(),
                    live_customer_id = v_new_cust_id,
                    assigned_to = v_assigned_agent_id
                WHERE id = v_lead.id;

                v_leads_succeeded := v_leads_succeeded + 1;
            EXCEPTION WHEN OTHERS THEN
                UPDATE public.lead_sheduled
                SET upload_status = 'failed',
                    error_reason = SQLERRM
                WHERE id = v_lead.id;
                v_leads_failed := v_leads_failed + 1;
            END;
        END LOOP;

        INSERT INTO public.pilotlead_log (
            pilotlead_id,
            organization_id,
            batch_number,
            scheduled_time,
            executed_at,
            leads_attempted,
            leads_succeeded,
            leads_failed,
            leads_skipped,
            status,
            agent_distribution_summary
        ) VALUES (
            v_wf.id,
            v_wf.organization_id,
            v_batch_num,
            to_char((now() AT TIME ZONE 'Asia/Kolkata'), 'HH24:MI'),
            now(),
            v_leads_attempted,
            v_leads_succeeded,
            v_leads_failed,
            0,
            CASE WHEN v_leads_failed = 0 THEN 'success' WHEN v_leads_succeeded > 0 THEN 'partial' ELSE 'failed' END,
            v_dist_summary
        );

        SELECT count(*)
        INTO v_pending_remaining
        FROM public.lead_sheduled
        WHERE pilotlead_id = v_wf.id AND upload_status = 'pending';

        v_next_exec := public.calculate_leadpilot_next_execution(v_wf.batch_times, v_wf.pause_days, v_wf.start_date, v_wf.end_date, now());

        UPDATE public.leadpilot
        SET uploaded_leads = uploaded_leads + v_leads_succeeded,
            pending_leads = v_pending_remaining,
            failed_leads = failed_leads + v_leads_failed,
            completed_batches = v_batch_num,
            agent_cursor_index = v_cursor,
            last_executed_at = now(),
            next_execution_at = CASE WHEN v_pending_remaining <= 0 THEN NULL ELSE v_next_exec END,
            status = CASE 
                WHEN v_pending_remaining <= 0 THEN 'paused'
                WHEN v_next_exec IS NULL THEN 'paused'
                ELSE 'running'
            END,
            updated_at = now()
        WHERE id = v_wf.id;

        v_results := v_results || jsonb_build_object(
            'workflow_id', v_wf.id,
            'batch_number', v_batch_num,
            'succeeded', v_leads_succeeded,
            'failed', v_leads_failed,
            'pending_remaining', v_pending_remaining,
            'next_execution_at', v_next_exec,
            'status', CASE WHEN v_pending_remaining <= 0 THEN 'paused' ELSE 'running' END
        );
    END LOOP;

    RETURN v_results;
END;
$$;

-- 3. One-time sync for any existing workflows with 0 pending leads
UPDATE public.leadpilot
SET status = 'paused',
    next_execution_at = NULL,
    updated_at = now()
WHERE pending_leads <= 0 AND status IN ('scheduled', 'running');
