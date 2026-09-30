create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  webhook_id text not null unique,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  webhook_for text not null default 'smartflo',
  webhook_type text not null default 'click_to_call',
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz not null default current_timestamp
);

create index if not exists webhooks_organization_id_idx on public.webhooks(organization_id);
create index if not exists webhooks_webhook_id_idx on public.webhooks(webhook_id);

create table if not exists public.webhook_responses (
  id uuid primary key default gen_random_uuid(),
  webhook_id text not null references public.webhooks(webhook_id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default current_timestamp
);

create index if not exists webhook_responses_webhook_id_idx on public.webhook_responses(webhook_id);
create index if not exists webhook_responses_organization_id_idx on public.webhook_responses(organization_id);
create index if not exists webhook_responses_created_at_idx on public.webhook_responses(created_at desc);

alter table public.webhooks enable row level security;
alter table public.webhook_responses enable row level security;

grant all on table public.webhooks to service_role;
grant all on table public.webhook_responses to service_role;
grant select on table public.webhooks to authenticated;
grant select on table public.webhook_responses to authenticated;

create policy "Users can view webhooks for their organization"
  on public.webhooks
  for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.user_profiles where user_id = auth.uid()
    )
  );

create policy "Users can view webhook responses for their organization"
  on public.webhook_responses
  for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.user_profiles where user_id = auth.uid()
    )
  );
