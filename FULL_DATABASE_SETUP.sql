-- ============================================================================
-- TFC-NEXUS COMPLETE DATABASE SETUP
-- ============================================================================
-- Run this entire file in Supabase SQL Editor
-- This will create all tables, functions, triggers, and policies
-- ============================================================================

-- ============================================================================
-- STEP 1: EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_graphql" SCHEMA graphql;
CREATE EXTENSION IF NOT EXISTS "supabase_vault" SCHEMA vault;
CREATE EXTENSION IF NOT EXISTS "plpgsql" SCHEMA pg_catalog;

-- ============================================================================
-- ============================================================================

-- Drop policies & triggers safely (only if tables already exist)
DO $$
BEGIN
  -- user_profiles: policies & trigger
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_profiles'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can delete profiles" ON public.user_profiles';
    EXECUTE 'DROP POLICY IF EXISTS "Service role full access" ON public.user_profiles';
    EXECUTE 'DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles';
  END IF;

  -- otp_verifications: policies only
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'otp_verifications'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can insert OTP" ON public.otp_verifications';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can select OTP" ON public.otp_verifications';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can update OTP" ON public.otp_verifications';
    EXECUTE 'DROP POLICY IF EXISTS "Service role OTP access" ON public.otp_verifications';
  END IF;

  -- user_sessions: policies & trigger
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_sessions'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert own sessions" ON public.user_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own sessions" ON public.user_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete own sessions" ON public.user_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions';
    EXECUTE 'DROP POLICY IF EXISTS "Service role sessions access" ON public.user_sessions';
    EXECUTE 'DROP TRIGGER IF EXISTS update_user_sessions_updated_at ON public.user_sessions';
  END IF;
END $$;

-- Drop auth trigger (auth.users always exists in Supabase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop tables (CASCADE will drop related objects)
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.otp_verifications CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.delete_user_profile(UUID);
DROP FUNCTION IF EXISTS public.update_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_super_admin();
DROP FUNCTION IF EXISTS public.is_admin();

-- Drop types
DROP TYPE IF EXISTS public.otp_purpose_enum;
DROP TYPE IF EXISTS public.gender_enum;
DROP TYPE IF EXISTS public.work_type_enum;
DROP TYPE IF EXISTS public.user_type_enum;
DROP TYPE IF EXISTS public.approval_status;
DROP TYPE IF EXISTS public.user_status;
DROP TYPE IF EXISTS public.user_role;

-- ============================================================================
-- STEP 3: CREATE CUSTOM TYPES
-- ============================================================================

CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'super_admin', 'manager', 'facility_staff');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'hold', 'suspend');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected', 'hold', 'suspend');
CREATE TYPE public.user_type_enum AS ENUM ('employee', 'posp_agent');
CREATE TYPE public.work_type_enum AS ENUM ('remote', 'on_site');
CREATE TYPE public.gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE public.otp_purpose_enum AS ENUM ('forgot_user_id', 'forgot_password', 'email_verification');

-- ============================================================================
-- STEP 4: CREATE TABLES
-- ============================================================================

-- USER PROFILES TABLE
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    user_name TEXT,
    contact_no TEXT,
    employee_id TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin', 'manager', 'facility_staff')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'hold', 'suspend')),
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'hold', 'suspend')),
    super_admin BOOLEAN DEFAULT false,
    father_name TEXT,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    pan_number TEXT,
    aadhar_card_no TEXT,
    date_of_birth DATE,
    date_of_joining DATE,
    in_hand_salary NUMERIC,
    alternate_contact TEXT,
    primary_address TEXT,
    area_pincode TEXT,
    bank_name TEXT,
    account_holder_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    branch_pincode TEXT,
    branch_state TEXT,
    branch_city TEXT,
    blood_group TEXT,
    emergency_contact_no TEXT,
    profile_pic_url TEXT,
    pancard_url TEXT,
    aadhar_front_url TEXT,
    aadhar_back_url TEXT,
    qualification_marksheet_url TEXT,
    bank_passbook_url TEXT,
    profile_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    hold_start_date TIMESTAMPTZ,
    hold_end_date TIMESTAMPTZ,
    status_reason TEXT,
    user_type VARCHAR CHECK (user_type IN ('employee', 'posp_agent')),
    work_type VARCHAR CHECK (work_type IN ('remote', 'on_site')),
    department VARCHAR CHECK (department IS NULL OR department IN ('sales', 'renewal', 'administration', 'management')),
    designation TEXT
);

COMMENT ON TABLE public.user_profiles IS 'Main user profile table with RLS enabled';
COMMENT ON COLUMN public.user_profiles.hold_start_date IS 'Date when the account hold started';
COMMENT ON COLUMN public.user_profiles.hold_end_date IS 'Date when the account hold ends';
COMMENT ON COLUMN public.user_profiles.status_reason IS 'Reason for current status (hold, suspend, rejected, etc.)';
COMMENT ON COLUMN public.user_profiles.user_type IS 'Type of user: employee or posp_agent';
COMMENT ON COLUMN public.user_profiles.work_type IS 'Work type: remote or on_site';

-- OTP VERIFICATIONS TABLE
CREATE TABLE public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('forgot_user_id', 'forgot_password', 'email_verification')),
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    used_at TIMESTAMPTZ,
    unique_id UUID UNIQUE
);

COMMENT ON TABLE public.otp_verifications IS 'Stores OTP codes for email verification, forgot user ID, and forgot password functionality';
COMMENT ON COLUMN public.otp_verifications.unique_id IS 'Unique identifier for OTP verification session';

-- USER SESSIONS TABLE
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    device_name TEXT,
    browser TEXT,
    user_agent TEXT,
    ip_address TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT true,
    last_accessed_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    device_type TEXT
);

COMMENT ON TABLE public.user_sessions IS 'Tracks user login sessions with device and location information';
COMMENT ON COLUMN public.user_sessions.device_type IS 'Device type: mobile, tablet, desktop, or unknown';

-- ============================================================================
-- STEP 5: CREATE INDEXES
-- ============================================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_employee_id ON public.user_profiles(employee_id);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX idx_user_profiles_approval_status ON public.user_profiles(approval_status);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_user_type ON public.user_profiles(user_type);
CREATE INDEX idx_user_profiles_department ON public.user_profiles(department);

-- OTP verifications indexes
CREATE INDEX idx_otp_verifications_email ON public.otp_verifications(email);
CREATE INDEX idx_otp_verifications_unique_id ON public.otp_verifications(unique_id);
CREATE INDEX idx_otp_verifications_expires_at ON public.otp_verifications(expires_at);

-- User sessions indexes
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_is_active ON public.user_sessions(is_active);

-- ============================================================================
-- STEP 6: CREATE FUNCTIONS
-- ============================================================================

-- IS_ADMIN FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.user_profiles
    WHERE user_id = auth.uid()
    LIMIT 1;
    
    RETURN user_role IN ('admin', 'super_admin');
END;
$$;

COMMENT ON FUNCTION public.is_admin() IS 'Returns true if current user is admin or super_admin';

-- IS_SUPER_ADMIN FUNCTION
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
    is_super BOOLEAN;
BEGIN
    SELECT super_admin INTO is_super
    FROM public.user_profiles
    WHERE user_id = auth.uid()
    LIMIT 1;
    
    RETURN COALESCE(is_super, false);
END;
$$;

COMMENT ON FUNCTION public.is_super_admin() IS 'Returns true if current user is a super admin';

-- HANDLE_NEW_USER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    user_name_value TEXT;
    contact_no_value TEXT;
    employee_id_value TEXT;
    role_value TEXT;
    approval_status_value TEXT;
BEGIN
    user_name_value := COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'full_name');
    contact_no_value := NEW.raw_user_meta_data->>'contact_no';
    employee_id_value := NEW.raw_user_meta_data->>'employee_id';
    role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
    approval_status_value := COALESCE(NEW.raw_user_meta_data->>'approval_status', 'pending');

    INSERT INTO public.user_profiles (
        user_id,
        email,
        user_name,
        contact_no,
        employee_id,
        role,
        approval_status,
        super_admin,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        user_name_value,
        contact_no_value,
        employee_id_value,
        role_value,
        approval_status_value,
        COALESCE((NEW.raw_user_meta_data->>'super_admin')::BOOLEAN, false),
        now(),
        now()
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user_profiles entry when new user signs up';

-- UPDATE_UPDATED_AT FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at() IS 'Automatically updates updated_at timestamp on UPDATE';

-- DELETE_USER_PROFILE FUNCTION
CREATE OR REPLACE FUNCTION public.delete_user_profile(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can delete users';
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = target_user_id AND super_admin = true
    ) THEN
        RAISE EXCEPTION 'Cannot delete super admin users';
    END IF;

    DELETE FROM auth.users WHERE id = target_user_id;

    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error deleting user: %', SQLERRM;
        RETURN false;
END;
$$;

COMMENT ON FUNCTION public.delete_user_profile(UUID) IS 'Admin function to delete user and all associated data';

-- ============================================================================
-- STEP 7: CREATE TRIGGERS
-- ============================================================================

-- Trigger on auth.users (may fail if insufficient permissions)
DO $$
BEGIN
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user();
    
    RAISE NOTICE '✓ Successfully created auth.users trigger';
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE '⚠ WARNING: Could not create auth.users trigger due to permissions.';
        RAISE NOTICE '  Please create it manually via Supabase Dashboard:';
        RAISE NOTICE '  Database > Triggers > Create Trigger';
        RAISE NOTICE '  Name: on_auth_user_created';
        RAISE NOTICE '  Table: auth.users';
        RAISE NOTICE '  Events: INSERT';
        RAISE NOTICE '  Function: public.handle_new_user';
    WHEN OTHERS THEN
        RAISE NOTICE '⚠ WARNING: Could not create auth.users trigger: %', SQLERRM;
END $$;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TRIGGER update_user_profiles_updated_at ON public.user_profiles IS 'Auto-updates updated_at timestamp';

-- Trigger for user_sessions
CREATE TRIGGER update_user_sessions_updated_at
    BEFORE UPDATE ON public.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- STEP 8: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 9: CREATE RLS POLICIES
-- ============================================================================

-- USER_PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can insert profiles"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all profiles"
    ON public.user_profiles
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete profiles"
    ON public.user_profiles
    FOR DELETE
    USING (
        public.is_super_admin() AND
        NOT EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_id = public.user_profiles.user_id
            AND super_admin = true
        )
    );

CREATE POLICY "Service role full access"
    ON public.user_profiles
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- OTP_VERIFICATIONS POLICIES
CREATE POLICY "Anyone can insert OTP"
    ON public.otp_verifications
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can select OTP"
    ON public.otp_verifications
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can update OTP"
    ON public.otp_verifications
    FOR UPDATE
    USING (true);

CREATE POLICY "Service role OTP access"
    ON public.otp_verifications
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- USER_SESSIONS POLICIES
CREATE POLICY "Users can view own sessions"
    ON public.user_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON public.user_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON public.user_sessions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
    ON public.user_sessions
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
    ON public.user_sessions
    FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Service role sessions access"
    ON public.user_sessions
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- STEP 10: GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.otp_verifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.otp_verifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sessions TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_profile(UUID) TO authenticated;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
    table_count INT;
    function_count INT;
    policy_count INT;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('user_profiles', 'otp_verifications', 'user_sessions');
    
    -- Count functions
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name IN ('is_admin', 'is_super_admin', 'handle_new_user', 'update_updated_at', 'delete_user_profile');
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public';
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DATABASE SETUP COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ Tables created: %', table_count;
    RAISE NOTICE '✓ Functions created: %', function_count;
    RAISE NOTICE '✓ RLS Policies created: %', policy_count;
    RAISE NOTICE '';
    RAISE NOTICE 'NEXT STEPS:';
    RAISE NOTICE '1. Verify auth.users trigger was created';
    RAISE NOTICE '2. Create storage bucket: user-documents';
    RAISE NOTICE '3. Apply storage policies (see README)';
    RAISE NOTICE '4. Test user registration';
    RAISE NOTICE '';
    RAISE NOTICE 'Check trigger status:';
    RAISE NOTICE 'SELECT trigger_name FROM information_schema.triggers';
    RAISE NOTICE 'WHERE trigger_name = ''on_auth_user_created'';';
    RAISE NOTICE '========================================';
END $$;

-- ============================================================================
-- END OF SETUP
-- ============================================================================

