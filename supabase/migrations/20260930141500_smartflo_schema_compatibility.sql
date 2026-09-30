alter table public.smartflo_dialer_config
  add column if not exists smartflo_api_token_hash text,
  add column if not exists is_token_valid boolean,
  add column if not exists is_validate boolean,
  add column if not exists token_created_at timestamptz,
  add column if not exists token_expires_at timestamptz,
  add column if not exists click_to_call_params jsonb not null default '{}'::jsonb;

update public.smartflo_dialer_config
set is_token_valid = coalesce(is_token_valid, is_validate, false)
where is_token_valid is null and is_validate is not null;

update public.smartflo_dialer_config
set is_validate = coalesce(is_validate, is_token_valid, false)
where is_validate is null and is_token_valid is not null;

alter table public.smartflo_dialer_config
  alter column is_token_valid set default false,
  alter column is_validate set default false,
  alter column is_token_valid set not null,
  alter column is_validate set not null;

create unique index if not exists smartflo_dialer_config_organization_id_key
  on public.smartflo_dialer_config (organization_id);

create index if not exists smartflo_dialer_config_token_valid_idx
  on public.smartflo_dialer_config (organization_id, is_token_valid);
