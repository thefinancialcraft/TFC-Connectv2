alter table public.smartflo_dialer_config
  add column if not exists webhook_id text,
  add column if not exists webhook_events jsonb not null default '[]'::jsonb;

update public.smartflo_dialer_config
  set webhook_id = coalesce(webhook_id, integration_id, gen_random_uuid()::text)
  where webhook_id is null;
