-- Migration: Prevent unregistered Google OAuth signups in auth.users
-- This ensures that only users who have an existing record in public.user_profiles
-- can sign in with Google OAuth.

CREATE OR REPLACE FUNCTION public.check_user_allowed_before_auth_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    is_oauth BOOLEAN;
    profile_exists BOOLEAN;
BEGIN
    -- Check if user is signing up via Google OAuth
    is_oauth := (NEW.raw_app_meta_data->>'provider' = 'google')
             OR (NEW.raw_app_meta_data->'providers' ? 'google');

    IF is_oauth THEN
        -- Check if an account already exists in user_profiles with this email
        SELECT EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE LOWER(email) = LOWER(NEW.email)
        ) INTO profile_exists;

        -- If not registered, reject creation so no entry is stored in auth.users
        IF NOT profile_exists THEN
            RAISE EXCEPTION 'NO_ACTIVE_ACCOUNT: Account with email % is not registered. Create new account or talk to team.', NEW.email;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_user_allowed_before_auth_insert() TO postgres, supabase_auth_admin;

DROP TRIGGER IF EXISTS trg_check_user_allowed_before_auth_insert ON auth.users;

CREATE TRIGGER trg_check_user_allowed_before_auth_insert
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.check_user_allowed_before_auth_insert();
