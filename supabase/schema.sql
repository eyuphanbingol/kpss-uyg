-- KPSS Eğitim Alanı — PostgreSQL + RLS
-- SQL Editor'da çalıştır. service_role tarayıcıya asla konmaz.

create table if not exists public.student_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  nickname text,
  education_level text,
  target_type text,
  platform text default 'web',
  premium boolean default false,
  last_study_at date,
  questions_total int default 0,
  role text default 'student'
);

create table if not exists public.leaderboard_weekly (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  nickname text not null,
  questions int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start)
);

create table if not exists public.exam_ranks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nickname text not null,
  score numeric,
  created_at timestamptz default now()
);

create table if not exists public.referrals (
  code text primary key,
  owner uuid references auth.users(id),
  uses int default 0
);

create table if not exists public.instructor_groups (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users(id),
  name text
);

create table if not exists public.instructor_group_members (
  group_id uuid references public.instructor_groups(id) on delete cascade,
  user_id uuid,
  nickname text,
  last_study_at date,
  questions_total int default 0
);

create or replace view public.leaderboard_public as
  select nickname, questions, 'week'::text as kind from public.leaderboard_weekly
  union all
  select nickname, coalesce(score,0)::int as questions, 'exam'::text as kind from public.exam_ranks;

alter table public.student_states enable row level security;
alter table public.leaderboard_weekly enable row level security;
alter table public.exam_ranks enable row level security;
alter table public.referrals enable row level security;
alter table public.instructor_groups enable row level security;
alter table public.instructor_group_members enable row level security;

create policy "own state" on public.student_states
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own week lb write" on public.leaderboard_weekly
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "public read week lb" on public.leaderboard_weekly
  for select using (true);

create policy "public read ranks" on public.exam_ranks for select using (true);
create policy "own rank write" on public.exam_ranks
  for insert with check (auth.uid() = user_id);

-- Admin dizin: yalnızca role=admin satırı olan kullanıcı (JWT app_metadata veya student_states.role)
create or replace view public.admin_user_directory as
  select user_id, nickname, education_level, target_type, platform, premium, last_study_at, questions_total, updated_at
  from public.student_states;

-- View RLS: Postgres views run as owner; tighten via grant + function instead in production.
revoke all on public.admin_user_directory from anon, authenticated;
-- Edge Function service role okur.

create or replace function public.admin_kpis()
returns json language plpgsql security definer as $$
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
