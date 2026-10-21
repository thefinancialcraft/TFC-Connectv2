-- Migration: Allow Level 1 Internal Team Users to access all organizations' workflows
-- Created: 2026-10-21

-- 1. Alter LeadPilot tenant isolation policy
ALTER POLICY "LeadPilot tenant isolation" ON public.leadpilot
USING (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
);

-- 2. Alter Workflows tenant isolation policy
ALTER POLICY "Workflows tenant isolation" ON public.workflows
USING (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
);

-- 3. Alter Lead sheduled tenant isolation policy
ALTER POLICY "Lead sheduled tenant isolation" ON public.lead_sheduled
USING (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
);

-- 4. Alter Pilotlead log tenant isolation policy
ALTER POLICY "Pilotlead log tenant isolation" ON public.pilotlead_log
USING (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
);

-- 5. Alter Pilotlead uploads tenant isolation policy
ALTER POLICY "Pilotlead uploads tenant isolation" ON public.pilotlead_uploads
USING (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND (
        user_profiles.is_client = false
        OR user_profiles.super_admin = true
        OR user_profiles.role IN ('superadmin', 'super_admin')
      )
  ))
  OR (organization_id IN (
    SELECT user_profiles.organization_id
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
  ))
);
