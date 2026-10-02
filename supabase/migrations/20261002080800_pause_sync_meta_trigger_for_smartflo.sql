-- Migration to pause handle_sync_meta_to_user_profile trigger when calling provider is Smartflo

CREATE OR REPLACE FUNCTION public.handle_sync_meta_to_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_clean_digits text;
    v_last_10 text;
    v_hash_raw text;
    v_hash_10 text;
    v_hash_91 text;
    v_hash_0 text;
    v_is_customer boolean := false;
    v_is_personal boolean := false;
    v_is_smartflo_active boolean := false;
    v_provider_json jsonb;
BEGIN
    IF NEW.employee_id IS NULL OR NEW.employee_id = '' THEN
        RETURN NEW;
    END IF;

    -- Check if calling provider is Smartflo for this user in user_profiles
    SELECT calling_provider INTO v_provider_json
    FROM public.user_profiles
    WHERE employee_id = NEW.employee_id
    LIMIT 1;

    IF v_provider_json IS NOT NULL THEN
        IF (v_provider_json->'smartflo'->>'in_use')::boolean = true THEN
            v_is_smartflo_active := true;
        END IF;
    END IF;

    -- When calling provider is Smartflo, pause sync_meta -> user_profiles update (handled exclusively by Smartflo endpoints)
    IF v_is_smartflo_active THEN
        RETURN NEW;
    END IF;

    -- Only react when on_call or dialed_no actually changes for SIM provider
    IF TG_OP = 'UPDATE' AND (OLD.on_call IS NOT DISTINCT FROM NEW.on_call) AND (OLD.dialed_no IS NOT DISTINCT FROM NEW.dialed_no) THEN
        RETURN NEW;
    END IF;

    IF NEW.on_call = true THEN
        v_clean_digits := regexp_replace(COALESCE(NEW.dialed_no, ''), '[^0-9]', '', 'g');
        
        IF length(v_clean_digits) >= 10 THEN
            v_last_10 := right(v_clean_digits, 10);
            v_hash_raw := encode(extensions.digest(v_clean_digits, 'sha256'), 'hex');
            v_hash_10 := encode(extensions.digest(v_last_10, 'sha256'), 'hex');
            v_hash_91 := encode(extensions.digest('91' || v_last_10, 'sha256'), 'hex');
            v_hash_0 := encode(extensions.digest('0' || v_last_10, 'sha256'), 'hex');

            -- Check customers table
            IF EXISTS (
                SELECT 1 FROM public.customers 
                WHERE phone_search_hash IN (v_hash_raw, v_hash_10, v_hash_91, v_hash_0)
            ) THEN
                v_is_customer := true;
            -- Check rejected_leads table
            ELSIF EXISTS (
                SELECT 1 FROM public.rejected_leads 
                WHERE phone_search_hash IN (v_hash_raw, v_hash_10, v_hash_91, v_hash_0)
            ) THEN
                v_is_customer := true;
            -- Check closed_deals table
            ELSIF EXISTS (
                SELECT 1 FROM public.closed_deals 
                WHERE phone_search_hash IN (v_hash_raw, v_hash_10, v_hash_91, v_hash_0)
            ) THEN
                v_is_customer := true;
            END IF;

            IF v_is_customer THEN
                v_is_personal := false;
            ELSE
                v_is_personal := true;
            END IF;
        ELSE
            v_is_personal := COALESCE(NEW.is_personal, false);
        END IF;

        NEW.is_personal := v_is_personal;

        UPDATE public.user_profiles 
        SET on_call = true,
            is_personal = v_is_personal,
            updated_at = now()
        WHERE employee_id = NEW.employee_id;

    ELSIF TG_OP = 'UPDATE' AND OLD.on_call = true AND (NEW.on_call = false OR NEW.on_call IS NULL) THEN
        NEW.is_personal := false;

        UPDATE public.user_profiles 
        SET on_call = false,
            is_personal = false,
            idle_time = now(),
            updated_at = now()
        WHERE employee_id = NEW.employee_id;
    END IF;

    RETURN NEW;
END;
$function$;
