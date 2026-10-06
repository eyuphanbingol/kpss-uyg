-- CANLI DENEME · PARÇA 1 / 9
-- Supabase SQL Editor'da 1'den 9'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

-- ============================================================
-- CANLI DENEME SINAVI (1., 2. ve 3. aşama)
-- SQL Editor'da çalıştır. Tekrar çalıştırmak güvenlidir (idempotent); 1. aşamayı
-- daha önce kurduysan bu dosyanın tamamını yeniden çalıştırman yeterli.
--
-- İlkeler
--  * Saat yalnızca sunucudan: her kural live_clock() (= now()) ile denetlenir.
--  * İstemci tablolara doğrudan erişemez; her şey security definer fonksiyonlardan geçer.
--  * Hiçbir satır silinmez: DELETE / TRUNCATE tetikleyiciyle engellenir. Taslak deneme
--    yalnızca yumuşak silinir (deleted_at).
--  * Doğru cevaplar ve çözümler, kullanıcının kâğıdı kapanmadan ve sınav bitmeden asla dönmez.
--  * Kâğıtta çözen (mode = 'paper') cevaplarını optik formu okutarak 12:25–12:40 arasında
--    (ranking_at) bir kez gönderir; göndermeyenin sonucu olmaz, çözümleri açılmaz.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- saat ----------
create or replace function public.live_clock()
returns timestamptz language sql stable as $$ select now() $$;

-- ---------- tablolar ----------
create table if not exists public.live_exams (
  id uuid primary key default gen_random_uuid(),
  track text not null default 'lisans' check (track in ('lisans', 'onlisans', 'ortaogretim')),
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'finished', 'cancelled', 'archived')),
  reg_closes_at timestamptz not null,
  starts_at timestamptz not null,
  entry_closes_at timestamptz not null,
  ends_at timestamptz not null,
  late_sync_until timestamptz not null,
  ranking_at timestamptz not null,
  capacity int check (capacity is null or capacity > 0),
  question_count int not null default 120,
  booklet_path text,
  booklet_key text,
  booklet_sha text,
  extra_minutes int not null default 0,
  cancel_reason text,
  finalized_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (reg_closes_at <= starts_at and starts_at < entry_closes_at and entry_closes_at <= ends_at
         and ends_at <= late_sync_until and late_sync_until <= ranking_at)
);
create index if not exists live_exams_track_idx on public.live_exams (track, starts_at desc);

create table if not exists public.live_questions (
  exam_id uuid not null references public.live_exams(id),
  no int not null check (no between 1 and 200),
  bolum text not null check (bolum in ('GY', 'GK')),
  ders text not null,
  konu text not null,
  stem text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 5),
  answer text not null check (answer in ('A', 'B', 'C', 'D', 'E')),
  explanation text not null default '',
  image text,
  primary key (exam_id, no)
);

create table if not exists public.live_registrations (
  exam_id uuid not null references public.live_exams(id),
  user_id uuid not null,
  status text not null default 'registered' check (status in ('registered', 'waitlist', 'cancelled', 'blocked')),
  mode text not null default 'device' check (mode in ('device', 'paper')),
  nickname text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (exam_id, user_id)
);

create table if not exists public.live_attempts (
  exam_id uuid not null references public.live_exams(id),
  user_id uuid not null,
  device_id text not null,
  switches int not null default 0,
  locked boolean not null default false,
  entered_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  submitted_at timestamptz,
  closed_at timestamptz,
  close_reason text,
  primary key (exam_id, user_id)
);
alter table public.live_attempts add column if not exists mode text not null default 'device'
  check (mode in ('device', 'paper'));

create table if not exists public.live_answers (
  exam_id uuid not null references public.live_exams(id),
  user_id uuid not null,
  no int not null,
  choice text check (choice is null or choice in ('A', 'B', 'C', 'D', 'E')),
  ms int not null default 0,
  source text not null default 'device',
  updated_at timestamptz not null default now(),
  primary key (exam_id, user_id, no)
);

create table if not exists public.live_results (
  exam_id uuid not null references public.live_exams(id),
  user_id uuid not null,
  nickname text,
  mode text not null default 'device',
  correct int not null,
  wrong int not null,
  blank int not null,
  net numeric(6, 2) not null,
  gy_net numeric(6, 2) not null,
  gk_net numeric(6, 2) not null,
  by_ders jsonb not null default '{}'::jsonb,
  by_konu jsonb not null default '{}'::jsonb,
  rank int,
  top_pct numeric(5, 1),
  participants int,
  computed_at timestamptz not null default now(),
  primary key (exam_id, user_id)
);

create table if not exists public.live_cohort (
  exam_id uuid primary key references public.live_exams(id),
  participants int not null,
  avg_net numeric(6, 2),
  avg_gy numeric(6, 2),
  avg_gk numeric(6, 2),
  by_ders jsonb not null default '{}'::jsonb,
  by_konu jsonb not null default '{}'::jsonb,
  top jsonb not null default '[]'::jsonb,
  computed_at timestamptz not null default now()
);

-- 3. aşama: kohort analizi (net dağılımı, yüzdelikler, ilk %10, cihaz/kâğıt, ders başına süre)
alter table public.live_cohort add column if not exists analysis jsonb not null default '{}'::jsonb;

create table if not exists public.live_question_stats (
  exam_id uuid not null references public.live_exams(id),
  no int not null,
  correct int not null default 0,
  wrong int not null default 0,
  blank int not null default 0,
  choices jsonb not null default '{}'::jsonb,
  avg_ms int,
  primary key (exam_id, no)
);

create table if not exists public.live_events (
  id bigserial primary key,
  exam_id uuid,
  user_id uuid,
  kind text not null,
  detail jsonb not null default '{}'::jsonb,
  at timestamptz not null default now()
);
create index if not exists live_events_exam_idx on public.live_events (exam_id, at desc);
create index if not exists live_attempts_open_idx on public.live_attempts (exam_id) where closed_at is null;

-- ---------- erişim: yalnızca fonksiyonlar ----------
do $$
declare t text;
begin
  foreach t in array array['live_exams', 'live_questions', 'live_registrations', 'live_attempts', 'live_answers',
                           'live_results', 'live_cohort', 'live_question_stats', 'live_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
  end loop;
end $$;

-- ---------- silme yasak ----------
create or replace function public.live_no_delete()
returns trigger language plpgsql as $$
begin
  raise exception 'Canlı deneme verisi silinemez (%). Gerekirse yumuşak silme kullan.', TG_TABLE_NAME
    using errcode = 'P0001';
end;
$$;
