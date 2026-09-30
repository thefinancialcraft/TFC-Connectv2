alter table public.user_smartflo_details
  alter column user_id drop not null,
  drop constraint user_smartflo_details_user_id_fkey,
  add constraint user_smartflo_details_user_id_fkey
    foreign key (user_id) references public.user_profiles(user_id) on delete set null,
  drop constraint user_smartflo_details_smartflo_agent_id_key,
  drop column extension_no,
  drop column extension_caller_id,
  add column smartflo_user_id varchar(50),
  add column intercom varchar(20),
  add column extension varchar(50),
  add column follow_me_number varchar(20),
  add column login_id varchar(100),
  add column agent_name varchar(100),
  add column is_mapped boolean not null default false,
  add column is_active boolean not null default true;

create index user_smartflo_details_smartflo_agent_id_idx
  on public.user_smartflo_details (smartflo_agent_id);