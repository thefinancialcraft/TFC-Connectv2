create or replace function public.prevent_client_calling_provider_changes()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $function$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if tg_table_name = 'organizations'
        and new.calling_provider is distinct from '{"sim":{"enable":true},"smartflo":{"enable":false}}'::jsonb then
        raise exception using
          errcode = '42501',
          message = 'Calling provider settings must be changed through the server API';
      end if;

      if tg_table_name = 'user_profiles'
        and new.calling_provider is distinct from '{"sim":{"enable":true,"in_use":true},"smartflo":{"enable":false,"in_use":false}}'::jsonb then
        raise exception using
          errcode = '42501',
          message = 'Calling provider settings must be changed through the server API';
      end if;
    elsif new.calling_provider is distinct from old.calling_provider then
      raise exception using
        errcode = '42501',
        message = 'Calling provider settings must be changed through the server API';
    end if;
  end if;

  return new;
end;
$function$;

drop trigger prevent_client_user_calling_provider_changes on public.user_profiles;
create trigger prevent_client_user_calling_provider_changes
before insert or update of calling_provider on public.user_profiles
for each row execute function public.prevent_client_calling_provider_changes();

drop trigger prevent_client_organization_calling_provider_changes on public.organizations;
create trigger prevent_client_organization_calling_provider_changes
before insert or update of calling_provider on public.organizations
for each row execute function public.prevent_client_calling_provider_changes();