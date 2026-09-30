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
	v_smartflo_metadata jsonb;
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
	v_smartflo_metadata := coalesce(v_user_provider -> 'smartflo', '{}'::jsonb) - 'enable' - 'in_use';

	v_updated_provider := jsonb_build_object(
		'sim', jsonb_build_object('enable', v_sim_enabled, 'in_use', p_provider = 'sim'),
		'smartflo', v_smartflo_metadata || jsonb_build_object(
			'enable', v_smartflo_enabled,
			'in_use', p_provider = 'smartflo'
		)
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
