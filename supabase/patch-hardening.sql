-- Production hardening. SQL Editor'da bir kez. Siteyi bozmaz; yetkisiz okuma/yazmayı daraltır.

revoke all on function public.admin_kpis() from public, anon;
revoke all on function public.admin_user_list() from public, anon;
revoke all on function public.admin_hard_topics() from public, anon;
grant execute on function public.admin_kpis() to authenticated;
grant execute on function public.admin_user_list() to authenticated;
grant execute on function public.admin_hard_topics() to authenticated;

revoke all on public.admin_user_directory from public, anon, authenticated;
revoke all on public.instructor_groups from public, anon, authenticated;
revoke all on public.instructor_group_members from public, anon, authenticated;
revoke all on public.student_states from public, anon;
grant select, insert, update, delete on public.student_states to authenticated;

drop policy if exists "public read week lb" on public.leaderboard_weekly;
drop policy if exists "public read ranks" on public.exam_ranks;

grant select on public.leaderboard_public to anon, authenticated;
do $$
begin
  begin
    execute 'alter view public.leaderboard_public set (security_invoker = false)';
  exception when others then
    null;
  end;
end $$;

drop policy if exists "no client write announcements" on public.app_announcements;

create table if not exists public.security_audit (
  id uuid primary key default gen_random_uuid(),
  at timestamptz not null default now(),
  actor uuid,
  action text not null,
  target uuid,
  ok boolean not null default true,
  detail text
);
alter table public.security_audit enable row level security;
revoke all on public.security_audit from public, anon, authenticated;

create or replace function public.sanitize_student_row()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if NEW.nickname is not null then
    NEW.nickname := left(regexp_replace(NEW.nickname, '<[^>]*>', '', 'g'), 40);
  end if;
  if NEW.education_level is not null
     and NEW.education_level not in ('lisans', 'onlisans', 'ortaogretim') then
    NEW.education_level := coalesce(OLD.education_level, 'lisans');
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_sanitize_student_row on public.student_states;
create trigger trg_sanitize_student_row
  before insert or update on public.student_states
  for each row execute function public.sanitize_student_row();
