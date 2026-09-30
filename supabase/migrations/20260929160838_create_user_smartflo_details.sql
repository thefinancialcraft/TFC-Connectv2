create table public.user_smartflo_details (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(user_id) on delete cascade,
  smartflo_agent_id varchar(50) not null unique,
  extension_no varchar(20),
  extension_caller_id varchar(20),
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create index user_smartflo_details_user_id_idx
  on public.user_smartflo_details (user_id);

create trigger update_user_smartflo_details_updated_at
  before update on public.user_smartflo_details
  for each row execute function public.update_updated_at_column();

alter table public.user_smartflo_details enable row level security;

revoke all on table public.user_smartflo_details from public, anon, authenticated;
grant all on table public.user_smartflo_details to service_role;