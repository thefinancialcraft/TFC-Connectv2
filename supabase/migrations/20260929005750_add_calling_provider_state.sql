alter table public.user_profiles
  add column calling_provider jsonb;

update public.user_profiles
set calling_provider = '{"sim":{"enable":true,"in_use":true},"smartflo":{"enable":false,"in_use":false}}'::jsonb
where calling_provider is null;

alter table public.user_profiles
  alter column calling_provider set default '{"sim":{"enable":true,"in_use":true},"smartflo":{"enable":false,"in_use":false}}'::jsonb,
  alter column calling_provider set not null,
  add constraint user_profiles_calling_provider_valid_check check (
    jsonb_typeof(calling_provider) = 'object'
    and jsonb_typeof(calling_provider -> 'sim') = 'object'
    and jsonb_typeof(calling_provider -> 'smartflo') = 'object'
    and coalesce((calling_provider #>> '{sim,enable}') in ('true', 'false'), false)
    and coalesce((calling_provider #>> '{sim,in_use}') in ('true', 'false'), false)
    and coalesce((calling_provider #>> '{smartflo,enable}') in ('true', 'false'), false)
    and coalesce((calling_provider #>> '{smartflo,in_use}') in ('true', 'false'), false)
    and not (
      calling_provider #>> '{sim,in_use}' = 'true'
      and calling_provider #>> '{smartflo,in_use}' = 'true'
    )
    and not (
      calling_provider #>> '{sim,enable}' = 'false'
      and calling_provider #>> '{sim,in_use}' = 'true'
    )
    and not (
      calling_provider #>> '{smartflo,enable}' = 'false'
      and calling_provider #>> '{smartflo,in_use}' = 'true'
    )
  );

alter table public.organizations
  add column calling_provider jsonb;

update public.organizations
set calling_provider = '{"sim":{"enable":true},"smartflo":{"enable":false}}'::jsonb
where calling_provider is null;

alter table public.organizations
  alter column calling_provider set default '{"sim":{"enable":true},"smartflo":{"enable":false}}'::jsonb,
  alter column calling_provider set not null,
  add constraint organizations_calling_provider_valid_check check (
    jsonb_typeof(calling_provider) = 'object'
    and jsonb_typeof(calling_provider -> 'sim') = 'object'
    and jsonb_typeof(calling_provider -> 'smartflo') = 'object'
    and coalesce((calling_provider #>> '{sim,enable}') in ('true', 'false'), false)
    and coalesce((calling_provider #>> '{smartflo,enable}') in ('true', 'false'), false)
    and not (calling_provider -> 'sim' ? 'in_use')
    and not (calling_provider -> 'smartflo' ? 'in_use')
  );

create or replace function public.prevent_client_calling_provider_changes()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $function$
begin
  if current_user in ('anon', 'authenticated') then
    raise exception using
      errcode = '42501',
      message = 'Calling provider settings must be changed through the server API';
  end if;

  return new;
end;
$function$;

create trigger prevent_client_user_calling_provider_changes
before update of calling_provider on public.user_profiles
for each row execute function public.prevent_client_calling_provider_changes();

create trigger prevent_client_organization_calling_provider_changes
before update of calling_provider on public.organizations
for each row execute function public.prevent_client_calling_provider_changes();

create or replace function public.select_calling_provider(p_user_id uuid, p_provider text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $function$
declare
  v_organization_id uuid;
  v_organization_provider jsonb;
  v_user_provider jsonb;
  v_updated_provider jsonb;
  v_sim_enabled boolean;
  v_smartflo_enabled boolean;
begin
  if p_provider not in ('sim', 'smartflo') then
    raise exception using errcode = 'P0001', message = 'invalid_provider';
  end if;

  select up.organization_id, up.calling_provider
    into v_organization_id, v_user_provider
  from public.user_profiles as up
  where up.user_id = p_user_id
  for update;

  if not found or v_organization_id is null then
    raise exception using errcode = 'P0001', message = 'organization_not_found';
  end if;

  select organization.calling_provider
    into v_organization_provider
  from public.organizations as organization
  where organization.id = v_organization_id
  for share;

  if not found then
    raise exception using errcode = 'P0001', message = 'organization_not_found';
  end if;

  if coalesce((v_organization_provider -> p_provider ->> 'enable')::boolean, false) is not true then
    raise exception using errcode = 'P0001', message = 'provider_not_enabled_for_organization';
  end if;

  if coalesce((v_user_provider -> p_provider ->> 'enable')::boolean, false) is not true then
    raise exception using errcode = 'P0001', message = 'provider_not_enabled_for_user';
  end if;

  v_sim_enabled := (v_user_provider #>> '{sim,enable}')::boolean;
  v_smartflo_enabled := (v_user_provider #>> '{smartflo,enable}')::boolean;

  v_updated_provider := jsonb_build_object(
    'sim', jsonb_build_object('enable', v_sim_enabled, 'in_use', p_provider = 'sim'),
    'smartflo', jsonb_build_object('enable', v_smartflo_enabled, 'in_use', p_provider = 'smartflo')
  );

  update public.user_profiles
  set calling_provider = v_updated_provider
  where user_id = p_user_id;

  return jsonb_build_object(
    'organization', v_organization_provider,
    'user', v_updated_provider,
    'active_provider', p_provider
  );
end;
$function$;

revoke all on function public.prevent_client_calling_provider_changes() from public, anon, authenticated;
revoke all on function public.select_calling_provider(uuid, text) from public, anon, authenticated;
grant execute on function public.select_calling_provider(uuid, text) to service_role;