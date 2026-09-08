-- İstemci student_states.role / premium / blocked yazamasın.
-- SQL Editor'da bir kez çalıştır. service_role (admin-action) tetikleyiciyi geçer.

alter table public.student_states
  add column if not exists blocked boolean not null default false;

create or replace function public.protect_student_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text;
  old_payload jsonb;
  new_payload jsonb;
  keep_blocked boolean;
begin
  jwt_role := coalesce(auth.jwt() ->> 'role', '');
  if jwt_role = 'service_role' then
    return NEW;
  end if;

  old_payload := coalesce(OLD.payload, '{}'::jsonb);
  new_payload := coalesce(NEW.payload, '{}'::jsonb);
  if new_payload->'userProfile' is null or jsonb_typeof(new_payload->'userProfile') <> 'object' then
    new_payload := jsonb_set(new_payload, '{userProfile}', '{}'::jsonb, true);
  end if;

  if TG_OP = 'INSERT' then
    NEW.role := 'student';
    NEW.premium := false;
    NEW.blocked := false;
    new_payload := jsonb_set(new_payload, '{userProfile,role}', '"student"'::jsonb, true);
    new_payload := jsonb_set(new_payload, '{userProfile,premium}', 'false'::jsonb, true);
    new_payload := jsonb_set(new_payload, '{userProfile,blocked}', 'false'::jsonb, true);
    NEW.payload := new_payload;
    return NEW;
  end if;

  NEW.role := OLD.role;
  NEW.premium := OLD.premium;
  NEW.blocked := coalesce(OLD.blocked, false);
  keep_blocked := coalesce(OLD.blocked, false)
    or coalesce(old_payload#>>'{userProfile,blocked}', 'false') in ('true', 't', '1');

  new_payload := jsonb_set(new_payload, '{userProfile,role}', to_jsonb(coalesce(OLD.role, 'student')), true);
  new_payload := jsonb_set(new_payload, '{userProfile,premium}', to_jsonb(coalesce(OLD.premium, false)), true);
  new_payload := jsonb_set(new_payload, '{userProfile,blocked}', to_jsonb(keep_blocked), true);
  if old_payload ? 'billing' then
    new_payload := jsonb_set(new_payload, '{billing}', coalesce(old_payload->'billing', '{}'::jsonb), true);
  end if;
  NEW.payload := new_payload;
  return NEW;
end;
$$;

drop trigger if exists trg_protect_student_privileges on public.student_states;
create trigger trg_protect_student_privileges
  before insert or update on public.student_states
  for each row execute function public.protect_student_privileges();

create or replace function public.admin_kpis()
returns json language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.student_states s where s.user_id = auth.uid() and s.role = 'admin') then
    raise exception 'forbidden';
  end if;
  return json_build_object(
    'users', (select count(*) from public.student_states),
    'dau', (select count(*) from public.student_states where last_study_at = current_date),
    'mau', (select count(*) from public.student_states where last_study_at >= current_date - 30)
  );
end;
$$;
