alter table public.smartflo_dialer_config
  add column smartflo_api_token_hash text,
  add column is_token_valid boolean not null default false,
  add column token_created_at timestamptz,
  add column token_expires_at timestamptz,
  add column click_to_call_params jsonb not null default '{}'::jsonb;

create unique index smartflo_dialer_config_organization_id_key
  on public.smartflo_dialer_config (organization_id);

alter table public.user_smartflo_details
  add column organization_id uuid references public.organizations(id) on delete cascade;

create unique index user_smartflo_details_organization_agent_key
  on public.user_smartflo_details (organization_id, smartflo_agent_id);