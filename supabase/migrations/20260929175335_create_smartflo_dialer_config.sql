create table public.smartflo_dialer_config (
  id uuid primary key default gen_random_uuid(),
  integration_id varchar(100) not null unique,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  smartflo_api_token text,
  fallback_queue_id varchar(50),
  is_outbound_configured boolean not null default false,
  is_inbound_configured boolean not null default false,
  is_dialplan_configured boolean not null default false,
  enabled boolean not null default false,
  status varchar(20) not null default 'not_configured'
    check (status in ('not_configured', 'pending', 'configured')),
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create index smartflo_dialer_config_organization_id_idx
  on public.smartflo_dialer_config (organization_id);

create trigger update_smartflo_dialer_config_updated_at
  before update on public.smartflo_dialer_config
  for each row execute function public.update_updated_at_column();

alter table public.smartflo_dialer_config enable row level security;

revoke all on table public.smartflo_dialer_config from public, anon, authenticated;
grant all on table public.smartflo_dialer_config to service_role;