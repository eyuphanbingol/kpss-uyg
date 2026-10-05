-- ============================================================
-- CANLI DENEME SINAVI (1. aşama)
-- SQL Editor'da bir kez çalıştır. Tekrar çalıştırmak güvenlidir (idempotent).
--
-- İlkeler
--  * Saat yalnızca sunucudan: her kural live_clock() (= now()) ile denetlenir.
--  * İstemci tablolara doğrudan erişemez; her şey security definer fonksiyonlardan geçer.
--  * Hiçbir satır silinmez: DELETE / TRUNCATE tetikleyiciyle engellenir. Taslak deneme
--    yalnızca yumuşak silinir (deleted_at).
--  * Doğru cevaplar ve çözümler, kullanıcının kâğıdı kapanmadan ve sınav bitmeden asla dönmez.
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

do $$
declare t text;
begin
  foreach t in array array['live_exams', 'live_questions', 'live_registrations', 'live_attempts', 'live_answers',
                           'live_results', 'live_cohort', 'live_question_stats', 'live_events'] loop
    execute format('drop trigger if exists trg_%s_no_delete on public.%I', t, t);
    execute format('create trigger trg_%s_no_delete before delete on public.%I for each row execute function public.live_no_delete()', t, t);
    execute format('drop trigger if exists trg_%s_no_truncate on public.%I', t, t);
    execute format('create trigger trg_%s_no_truncate before truncate on public.%I for each statement execute function public.live_no_delete()', t, t);
  end loop;
end $$;

-- ---------- yardımcılar ----------
create or replace function public.live_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.student_states s where s.user_id = auth.uid() and s.role = 'admin')
$$;

create or replace function public.live_err(p_code text, p_msg text)
returns void language plpgsql as $$
begin
  raise exception '%', p_msg using errcode = 'P0001', hint = p_code;
end;
$$;

create or replace function public.live_require_user()
returns uuid language plpgsql stable as $$
declare uid uuid := auth.uid();
begin
  if uid is null then perform public.live_err('auth', 'Giriş yapmalısın.'); end if;
  return uid;
end;
$$;

create or replace function public.live_exam_json(e public.live_exams)
returns json language sql stable as $$
  select json_build_object(
    'id', e.id, 'track', e.track, 'title', e.title, 'status', e.status,
    'reg_closes_at', e.reg_closes_at, 'starts_at', e.starts_at, 'entry_closes_at', e.entry_closes_at,
    'ends_at', e.ends_at, 'late_sync_until', e.late_sync_until, 'ranking_at', e.ranking_at,
    'capacity', e.capacity, 'question_count', e.question_count, 'extra_minutes', e.extra_minutes,
    'finalized', e.finalized_at is not null, 'cancel_reason', e.cancel_reason)
$$;

-- Bir kullanıcının sonucunu hesaplar (sınav kesinleşmeden önce tekrar hesaplanabilir).
create or replace function public.live_compute_result(p_exam uuid, p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  e public.live_exams;
  r record;
  nick text;
  md text;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.finalized_at is not null and exists (select 1 from public.live_results where exam_id = p_exam and user_id = p_user) then
    return; -- kesinleşmiş sonuç değişmez
  end if;
  select coalesce(reg.nickname, 'Öğrenci'), coalesce(reg.mode, 'device') into nick, md
    from public.live_registrations reg where reg.exam_id = p_exam and reg.user_id = p_user;

  with qa as (
    select q.no, q.bolum, q.ders, q.konu, q.answer, a.choice,
           case when a.choice is null then 'b' when a.choice = q.answer then 'c' else 'w' end as k
    from public.live_questions q
    left join public.live_answers a on a.exam_id = q.exam_id and a.no = q.no and a.user_id = p_user
    where q.exam_id = p_exam
  ),
  d as (
    select ders, json_build_object('c', count(*) filter (where k = 'c'), 'w', count(*) filter (where k = 'w'),
             'b', count(*) filter (where k = 'b'), 'n', count(*),
             'net', round(count(*) filter (where k = 'c') - count(*) filter (where k = 'w') / 4.0, 2)) as v
    from qa group by ders
  ),
  kk as (
    select ders || '|' || konu as key, json_build_object('ders', ders, 'konu', konu,
             'c', count(*) filter (where k = 'c'), 'w', count(*) filter (where k = 'w'),
             'b', count(*) filter (where k = 'b'), 'n', count(*),
             'net', round(count(*) filter (where k = 'c') - count(*) filter (where k = 'w') / 4.0, 2)) as v
    from qa group by ders, konu
  )
  select
    count(*) filter (where k = 'c') as c,
    count(*) filter (where k = 'w') as w,
    count(*) filter (where k = 'b') as b,
    round(count(*) filter (where k = 'c' and bolum = 'GY') - count(*) filter (where k = 'w' and bolum = 'GY') / 4.0, 2) as gy,
    round(count(*) filter (where k = 'c' and bolum = 'GK') - count(*) filter (where k = 'w' and bolum = 'GK') / 4.0, 2) as gk,
    (select coalesce(jsonb_object_agg(ders, v), '{}'::jsonb) from d) as bd,
    (select coalesce(jsonb_object_agg(key, v), '{}'::jsonb) from kk) as bk
  into r from qa;

  insert into public.live_results (exam_id, user_id, nickname, mode, correct, wrong, blank, net, gy_net, gk_net, by_ders, by_konu, computed_at)
  values (p_exam, p_user, nick, md, r.c, r.w, r.b, round(r.c - r.w / 4.0, 2), r.gy, r.gk, r.bd, r.bk, public.live_clock())
  on conflict (exam_id, user_id) do update set
    correct = excluded.correct, wrong = excluded.wrong, blank = excluded.blank, net = excluded.net,
    gy_net = excluded.gy_net, gk_net = excluded.gk_net, by_ders = excluded.by_ders, by_konu = excluded.by_konu,
    nickname = excluded.nickname, mode = excluded.mode, computed_at = excluded.computed_at;
end;
$$;

-- Kâğıdı kapat: bundan sonra cevap değişmez, sonuç hesaplanır.
create or replace function public.live_close_attempt(p_exam uuid, p_user uuid, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.live_attempts set closed_at = public.live_clock(), close_reason = p_reason,
         submitted_at = coalesce(submitted_at, public.live_clock())
   where exam_id = p_exam and user_id = p_user and closed_at is null;
  perform public.live_compute_result(p_exam, p_user);
end;
$$;

-- Sınavı kesinleştir: açık kâğıtları kapat, sıralama, kohort ve soru istatistikleri.
create or replace function public.live_finalize(p_exam uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  e public.live_exams;
  rec record;
  n int;
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.finalized_at is not null or e.status <> 'scheduled' or public.live_clock() < e.ranking_at then
    return;
  end if;
  for rec in select user_id from public.live_attempts where exam_id = p_exam and closed_at is null loop
    perform public.live_close_attempt(p_exam, rec.user_id, 'auto');
  end loop;
  for rec in select t.user_id from public.live_attempts t
           where t.exam_id = p_exam and not exists (select 1 from public.live_results r where r.exam_id = p_exam and r.user_id = t.user_id) loop
    perform public.live_compute_result(p_exam, rec.user_id);
  end loop;

  select count(*) into n from public.live_results where exam_id = p_exam;
  update public.live_results r set rank = x.rk, participants = n,
         top_pct = round(100.0 * x.rk / greatest(n, 1), 1)
    from (select user_id, rank() over (order by net desc) as rk from public.live_results where exam_id = p_exam) x
   where r.exam_id = p_exam and r.user_id = x.user_id;

  insert into public.live_cohort (exam_id, participants, avg_net, avg_gy, avg_gk, by_ders, by_konu, top, computed_at)
  select p_exam, n,
    (select round(avg(net), 2) from public.live_results where exam_id = p_exam),
    (select round(avg(gy_net), 2) from public.live_results where exam_id = p_exam),
    (select round(avg(gk_net), 2) from public.live_results where exam_id = p_exam),
    coalesce((select jsonb_object_agg(k, v) from (
       select d.key as k, json_build_object('net', round(avg((d.value->>'net')::numeric), 2),
              'c', round(avg((d.value->>'c')::numeric), 2), 'n', max((d.value->>'n')::int)) as v
       from public.live_results r cross join lateral jsonb_each(r.by_ders) d
       where r.exam_id = p_exam group by d.key) s), '{}'::jsonb),
    coalesce((select jsonb_object_agg(k, v) from (
       select d.key as k, json_build_object('net', round(avg((d.value->>'net')::numeric), 2),
              'c', round(avg((d.value->>'c')::numeric), 2), 'n', max((d.value->>'n')::int)) as v
       from public.live_results r cross join lateral jsonb_each(r.by_konu) d
       where r.exam_id = p_exam group by d.key) s), '{}'::jsonb),
    coalesce((select jsonb_agg(json_build_object('nickname', nickname, 'net', net, 'rank', rank) order by rank, nickname)
       from (select * from public.live_results where exam_id = p_exam order by rank, nickname limit 20) t), '[]'::jsonb),
    public.live_clock()
  on conflict (exam_id) do update set participants = excluded.participants, avg_net = excluded.avg_net,
    avg_gy = excluded.avg_gy, avg_gk = excluded.avg_gk, by_ders = excluded.by_ders, by_konu = excluded.by_konu,
    top = excluded.top, computed_at = excluded.computed_at;

  insert into public.live_question_stats (exam_id, no, correct, wrong, blank, choices, avg_ms)
  select q.exam_id, q.no,
    count(*) filter (where a.choice = q.answer),
    count(*) filter (where a.choice is not null and a.choice <> q.answer),
    n - count(*) filter (where a.choice is not null),
    coalesce((select jsonb_object_agg(c, cnt) from (
       select a2.choice as c, count(*) as cnt from public.live_answers a2
       join public.live_results r2 on r2.exam_id = a2.exam_id and r2.user_id = a2.user_id
       where a2.exam_id = q.exam_id and a2.no = q.no and a2.choice is not null group by a2.choice) z), '{}'::jsonb),
    round(avg(nullif(a.ms, 0)))::int
  from public.live_questions q
  left join public.live_answers a on a.exam_id = q.exam_id and a.no = q.no
       and exists (select 1 from public.live_results r where r.exam_id = a.exam_id and r.user_id = a.user_id)
  where q.exam_id = p_exam
  group by q.exam_id, q.no, q.answer
  on conflict (exam_id, no) do update set correct = excluded.correct, wrong = excluded.wrong, blank = excluded.blank,
    choices = excluded.choices, avg_ms = excluded.avg_ms;

  update public.live_exams set finalized_at = public.live_clock(), status = 'finished', updated_at = public.live_clock()
   where id = p_exam;
  insert into public.live_events (exam_id, kind, detail) values (p_exam, 'finalize', json_build_object('participants', n)::jsonb);
end;
$$;

-- Dakikalık bakım: geç senkron süresi dolan kâğıtları kapat, zamanı gelen sınavları kesinleştir.
create or replace function public.live_tick()
returns void language plpgsql security definer set search_path = public as $$
declare a record; x record;
begin
  for a in select t.exam_id, t.user_id from public.live_attempts t
           join public.live_exams e on e.id = t.exam_id
           where t.closed_at is null and e.status = 'scheduled' and public.live_clock() > e.late_sync_until loop
    perform public.live_close_attempt(a.exam_id, a.user_id, 'auto');
  end loop;
  for x in select id from public.live_exams
           where status = 'scheduled' and finalized_at is null and deleted_at is null and public.live_clock() >= ranking_at loop
    perform public.live_finalize(x.id);
  end loop;
end;
$$;

-- ============================================================
-- ÖĞRENCİ FONKSİYONLARI
-- ============================================================

create or replace function public.live_now()
returns json language sql stable as $$
  select json_build_object('now', (extract(epoch from public.live_clock()) * 1000)::bigint)
$$;

-- Bugün kartı ve canlı deneme ekranının tek çağrısı.
create or replace function public.live_dashboard(p_track text default 'lisans')
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  cur public.live_exams;
  reg public.live_registrations;
  att public.live_attempts;
  last_res record;
  missed public.live_exams;
  canc public.live_exams;
  waitpos int;
  regcount int;
begin
  perform public.live_tick();
  -- güncel deneme: henüz kesinleşmemiş, silinmemiş, en yakın planlı deneme
  select * into cur from public.live_exams
   where track = p_track and status = 'scheduled' and deleted_at is null
   order by starts_at asc limit 1;
  if uid is not null and cur.id is not null then
    select * into reg from public.live_registrations where exam_id = cur.id and user_id = uid;
    select * into att from public.live_attempts where exam_id = cur.id and user_id = uid;
    if reg.status = 'waitlist' then
      select count(*) + 1 into waitpos from public.live_registrations
       where exam_id = cur.id and status = 'waitlist' and created_at < reg.created_at;
    end if;
  end if;
  if cur.id is not null then
    select count(*) into regcount from public.live_registrations where exam_id = cur.id and status = 'registered';
  end if;
  -- en son sonucum
  if uid is not null then
    select r.*, e.title, e.track, e.starts_at, e.ranking_at, e.finalized_at, e.status as exam_status
      into last_res
      from public.live_results r join public.live_exams e on e.id = r.exam_id
     where r.user_id = uid and e.deleted_at is null and e.status <> 'cancelled'
     order by e.starts_at desc limit 1;
    -- katılmadığım en son kesinleşmiş deneme (son sonucumdan yeniyse)
    select e.* into missed from public.live_exams e
     where e.track = p_track and e.finalized_at is not null and e.deleted_at is null and e.status <> 'cancelled'
       and not exists (select 1 from public.live_results r where r.exam_id = e.id and r.user_id = uid)
       and (last_res.exam_id is null or e.starts_at > last_res.starts_at)
     order by e.starts_at desc limit 1;
    -- son bir haftada iptal edilen ve kayıtlı olduğum deneme
    select e.* into canc from public.live_exams e
      join public.live_registrations r on r.exam_id = e.id and r.user_id = uid and r.status = 'registered'
     where e.track = p_track and e.status = 'cancelled' and e.deleted_at is null
       and e.updated_at > public.live_clock() - interval '7 days'
     order by e.updated_at desc limit 1;
  end if;
  return json_build_object(
    'now', (extract(epoch from public.live_clock()) * 1000)::bigint,
    'exam', case when cur.id is null then null else public.live_exam_json(cur) end,
    'cancelled', case when canc.id is null then null else public.live_exam_json(canc) end,
    'registered_count', regcount,
    'registration', case when reg.exam_id is null then null else json_build_object('status', reg.status, 'mode', reg.mode, 'waitlist_pos', waitpos) end,
    'attempt', case when att.exam_id is null then null else json_build_object(
        'entered_at', att.entered_at, 'closed', att.closed_at is not null, 'submitted', att.submitted_at is not null,
        'locked', att.locked, 'switches', att.switches) end,
    'last_result', case when last_res.exam_id is null then null else json_build_object(
        'exam_id', last_res.exam_id, 'title', last_res.title, 'track', last_res.track, 'starts_at', last_res.starts_at,
        'net', last_res.net, 'gy_net', last_res.gy_net, 'gk_net', last_res.gk_net,
        'correct', last_res.correct, 'wrong', last_res.wrong, 'blank', last_res.blank,
        'rank', last_res.rank, 'participants', last_res.participants, 'top_pct', last_res.top_pct,
        'ranking_at', last_res.ranking_at, 'finalized', last_res.finalized_at is not null,
        'by_konu', last_res.by_konu) end,
    'missed', case when missed.id is null then null else public.live_exam_json(missed) end
  );
end;
$$;

create or replace function public.live_register(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  reg public.live_registrations;
  nick text;
  taken int;
  st text := 'registered';
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.deleted_at is not null or e.status <> 'scheduled' then
    perform public.live_err('not_found', 'Deneme bulunamadı.');
  end if;
  if public.live_clock() >= e.reg_closes_at then
    perform public.live_err('reg_closed', 'Kayıt kapandı.');
  end if;
  select * into reg from public.live_registrations where exam_id = p_exam and user_id = uid;
  if reg.status = 'blocked' then perform public.live_err('blocked', 'Bu denemeye kaydın engellendi.'); end if;
  if reg.status in ('registered', 'waitlist') then
    return json_build_object('status', reg.status);
  end if;
  if e.capacity is not null then
    select count(*) into taken from public.live_registrations where exam_id = p_exam and status = 'registered';
    if taken >= e.capacity then st := 'waitlist'; end if;
  end if;
  select coalesce(nullif(s.nickname, ''), 'Öğrenci') into nick from public.student_states s where s.user_id = uid;
  insert into public.live_registrations (exam_id, user_id, status, nickname, created_at, updated_at)
  values (p_exam, uid, st, coalesce(nick, 'Öğrenci'), public.live_clock(), public.live_clock())
  on conflict (exam_id, user_id) do update set status = excluded.status, nickname = excluded.nickname,
     created_at = excluded.created_at, updated_at = excluded.updated_at;
  return json_build_object('status', st);
end;
$$;

create or replace function public.live_unregister(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  was text;
  nxt uuid;
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if public.live_clock() >= e.reg_closes_at then perform public.live_err('reg_closed', 'Kayıt kapandıktan sonra kayıt silinemez.'); end if;
  select status into was from public.live_registrations where exam_id = p_exam and user_id = uid;
  if was not in ('registered', 'waitlist') then return json_build_object('status', coalesce(was, 'none')); end if;
  update public.live_registrations set status = 'cancelled', updated_at = public.live_clock()
   where exam_id = p_exam and user_id = uid;
  if was = 'registered' then
    select user_id into nxt from public.live_registrations
     where exam_id = p_exam and status = 'waitlist' order by created_at asc limit 1;
    if nxt is not null then
      update public.live_registrations set status = 'registered', updated_at = public.live_clock()
       where exam_id = p_exam and user_id = nxt;
      insert into public.live_events (exam_id, user_id, kind) values (p_exam, nxt, 'waitlist_promoted');
    end if;
  end if;
  return json_build_object('status', 'cancelled');
end;
$$;

-- Şifreli kitapçığın yolu (10:00'dan itibaren, yalnızca kayıtlılara).
create or replace function public.live_booklet(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if not exists (select 1 from public.live_registrations where exam_id = p_exam and user_id = uid and status = 'registered') then
    perform public.live_err('not_registered', 'Bu denemeye kayıtlı değilsin.');
  end if;
  if public.live_clock() < e.reg_closes_at then perform public.live_err('too_early', 'Kitapçık 10:00''da iner.'); end if;
  if e.booklet_path is null then perform public.live_err('no_booklet', 'Kitapçık henüz yüklenmedi.'); end if;
  return json_build_object('path', e.booklet_path, 'sha', e.booklet_sha);
end;
$$;

-- Sınava gir (ya da kaldığın yerden devam et). Çözme anahtarını ve kayıtlı cevapları döndürür.
create or replace function public.live_enter(p_exam uuid, p_device text)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  att public.live_attempts;
  t timestamptz := public.live_clock();
  ans json;
begin
  if coalesce(length(p_device), 0) < 8 or length(p_device) > 80 then perform public.live_err('bad_device', 'Geçersiz cihaz.'); end if;
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status = 'cancelled' then perform public.live_err('cancelled', 'Bu deneme iptal edildi.'); end if;
  if e.status <> 'scheduled' then perform public.live_err('ended', 'Sınav sona erdi.'); end if;
  if not exists (select 1 from public.live_registrations where exam_id = p_exam and user_id = uid and status = 'registered') then
    perform public.live_err('not_registered', 'Bu denemeye kayıtlı değilsin.');
  end if;
  if t < e.starts_at then perform public.live_err('too_early', 'Sınav henüz başlamadı.'); end if;
  if t >= e.ends_at then perform public.live_err('ended', 'Sınav sona erdi.'); end if;

  select * into att from public.live_attempts where exam_id = p_exam and user_id = uid for update;
  if att.exam_id is null then
    if t >= e.entry_closes_at then perform public.live_err('entry_closed', 'Sınava giriş 10:45''te kapandı.'); end if;
    insert into public.live_attempts (exam_id, user_id, device_id, entered_at, last_seen_at)
    values (p_exam, uid, p_device, t, t) returning * into att;
    insert into public.live_events (exam_id, user_id, kind) values (p_exam, uid, 'enter');
  else
    if att.locked then perform public.live_err('locked', 'Sınavın kilitlendi. Yönetici ile iletişime geç.'); end if;
    if att.submitted_at is not null then perform public.live_err('submitted', 'Kâğıdını teslim ettin.'); end if;
    if att.device_id <> p_device then
      if att.switches >= 2 then
        update public.live_attempts set locked = true where exam_id = p_exam and user_id = uid;
        insert into public.live_events (exam_id, user_id, kind, detail)
        values (p_exam, uid, 'locked', json_build_object('switches', att.switches + 1)::jsonb);
        return json_build_object('error', 'locked', 'message', 'Üçüncü cihaz değişimi: sınavın kilitlendi. Yönetici ile iletişime geç.');
      end if;
      update public.live_attempts set device_id = p_device, switches = switches + 1, last_seen_at = t
       where exam_id = p_exam and user_id = uid returning * into att;
      insert into public.live_events (exam_id, user_id, kind, detail)
      values (p_exam, uid, 'device_switch', json_build_object('switches', att.switches)::jsonb);
    else
      update public.live_attempts set last_seen_at = t where exam_id = p_exam and user_id = uid;
    end if;
  end if;
  select coalesce(json_agg(json_build_object('no', no, 'c', choice, 'ms', ms) order by no), '[]'::json) into ans
    from public.live_answers where exam_id = p_exam and user_id = uid;
  return json_build_object(
    'now', (extract(epoch from t) * 1000)::bigint,
    'exam', public.live_exam_json(e),
    'key', e.booklet_key, 'sha', e.booklet_sha, 'path', e.booklet_path,
    'answers', ans, 'switches', att.switches);
end;
$$;

-- Cevapları kaydet: [{no, c, ms}], c = null boş bırakır.
create or replace function public.live_save(p_exam uuid, p_device text, p_answers jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  att public.live_attempts;
  t timestamptz := public.live_clock();
  it jsonb;
  qn int;
  ch text;
  n int := 0;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status = 'cancelled' then perform public.live_err('cancelled', 'Bu deneme iptal edildi.'); end if;
  select * into att from public.live_attempts where exam_id = p_exam and user_id = uid for update;
  if att.exam_id is null then perform public.live_err('not_entered', 'Sınava girmedin.'); end if;
  if att.locked then perform public.live_err('locked', 'Sınavın kilitlendi.'); end if;
  if att.device_id <> p_device then perform public.live_err('device_replaced', 'Sınav başka bir cihazda açıldı.'); end if;
  if att.submitted_at is not null or att.closed_at is not null then perform public.live_err('submitted', 'Kâğıdın teslim edildi; cevaplar değişmez.'); end if;
  if t > e.late_sync_until or e.status <> 'scheduled' then perform public.live_err('ended', 'Sınav sona erdi.'); end if;
  if jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) > 200 then perform public.live_err('bad_input', 'Geçersiz cevap listesi.'); end if;
  for it in select * from jsonb_array_elements(p_answers) loop
    qn := (it->>'no')::int;
    ch := nullif(it->>'c', '');
    if qn is null or qn < 1 or qn > e.question_count then continue; end if;
    if ch is not null and ch not in ('A', 'B', 'C', 'D', 'E') then continue; end if;
    insert into public.live_answers (exam_id, user_id, no, choice, ms, updated_at)
    values (p_exam, uid, qn, ch, least(greatest(coalesce((it->>'ms')::int, 0), 0), 3 * 3600 * 1000), t)
    on conflict (exam_id, user_id, no) do update set choice = excluded.choice,
      ms = greatest(public.live_answers.ms, excluded.ms), updated_at = excluded.updated_at;
    n := n + 1;
  end loop;
  update public.live_attempts set last_seen_at = t where exam_id = p_exam and user_id = uid;
  return json_build_object('saved', n, 'now', (extract(epoch from t) * 1000)::bigint);
end;
$$;

-- Erken teslim: bundan sonra cevap değişmez; çözümler yine sınav bitince (12:25) açılır.
create or replace function public.live_submit(p_exam uuid, p_device text)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  att public.live_attempts;
begin
  select * into att from public.live_attempts where exam_id = p_exam and user_id = uid for update;
  if att.exam_id is null then perform public.live_err('not_entered', 'Sınava girmedin.'); end if;
  if att.device_id <> p_device then perform public.live_err('device_replaced', 'Sınav başka bir cihazda açıldı.'); end if;
  update public.live_attempts set submitted_at = coalesce(submitted_at, public.live_clock())
   where exam_id = p_exam and user_id = uid;
  insert into public.live_events (exam_id, user_id, kind) values (p_exam, uid, 'submit');
  return json_build_object('submitted', true);
end;
$$;

-- Kişisel sonuç: sınav bittikten sonra. Çağrıldığında kullanıcının kâğıdı kapanır.
create or replace function public.live_result(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  att public.live_attempts;
  res public.live_results;
  coh public.live_cohort;
begin
  perform public.live_tick();
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status = 'cancelled' then perform public.live_err('cancelled', 'Bu deneme iptal edildi.'); end if;
  select * into att from public.live_attempts where exam_id = p_exam and user_id = uid;
  if att.exam_id is null then perform public.live_err('not_participant', 'Bu denemeye katılmadın.'); end if;
  if public.live_clock() < e.ends_at then perform public.live_err('not_yet', 'Sonuçlar sınav bitince açılır.'); end if;
  if att.closed_at is null then perform public.live_close_attempt(p_exam, uid, 'result'); end if;
  select * into res from public.live_results where exam_id = p_exam and user_id = uid;
  select * into e from public.live_exams where id = p_exam;
  if e.finalized_at is not null then select * into coh from public.live_cohort where exam_id = p_exam; end if;
  return json_build_object(
    'exam', public.live_exam_json(e),
    'now', (extract(epoch from public.live_clock()) * 1000)::bigint,
    'result', row_to_json(res),
    'cohort', case when coh.exam_id is null then null else row_to_json(coh) end);
end;
$$;

-- Soru soru çözümler: yalnızca kâğıdı kapanmış katılımcıya, sınav bittikten sonra.
create or replace function public.live_review(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  att public.live_attempts;
  fin boolean;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  select * into att from public.live_attempts where exam_id = p_exam and user_id = uid;
  if att.exam_id is null then perform public.live_err('not_participant', 'Bu denemeye katılmadın.'); end if;
  if public.live_clock() < e.ends_at or att.closed_at is null then
    perform public.live_err('not_yet', 'Çözümler kâğıdın kapandıktan sonra açılır.');
  end if;
  fin := e.finalized_at is not null;
  return json_build_object(
    'exam', public.live_exam_json(e),
    'key', e.booklet_key, 'sha', e.booklet_sha, 'path', e.booklet_path,
    'questions', (select coalesce(json_agg(json_build_object(
        'no', q.no, 'bolum', q.bolum, 'ders', q.ders, 'konu', q.konu, 'stem', q.stem, 'options', q.options,
        'answer', q.answer, 'explanation', q.explanation, 'image', q.image,
        'mine', a.choice, 'ms', coalesce(a.ms, 0),
        'stat', case when fin then json_build_object('correct', s.correct, 'wrong', s.wrong, 'blank', s.blank,
                  'choices', s.choices, 'avg_ms', s.avg_ms) else null end) order by q.no), '[]'::json)
      from public.live_questions q
      left join public.live_answers a on a.exam_id = q.exam_id and a.no = q.no and a.user_id = uid
      left join public.live_question_stats s on s.exam_id = q.exam_id and s.no = q.no
      where q.exam_id = p_exam),
    'most_wrong', case when not fin then null else (select coalesce(json_agg(x order by x.wrong_pct desc, x.no), '[]'::json) from (
        select s.no, q.ders, q.konu, round(100.0 * s.wrong / greatest(s.correct + s.wrong + s.blank, 1), 1) as wrong_pct
        from public.live_question_stats s join public.live_questions q on q.exam_id = s.exam_id and q.no = s.no
        where s.exam_id = p_exam order by 4 desc, s.no limit 10) x) end
  );
end;
$$;

-- Katıldığım tüm denemeler (arşiv ve gelişim takibi).
create or replace function public.live_history()
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_user();
begin
  perform public.live_tick();
  return (select coalesce(json_agg(json_build_object(
      'exam_id', e.id, 'title', e.title, 'track', e.track, 'starts_at', e.starts_at, 'finalized', e.finalized_at is not null,
      'mode', r.mode, 'net', r.net, 'gy_net', r.gy_net, 'gk_net', r.gk_net,
      'correct', r.correct, 'wrong', r.wrong, 'blank', r.blank,
      'rank', r.rank, 'participants', r.participants, 'top_pct', r.top_pct,
      'by_ders', r.by_ders, 'by_konu', r.by_konu) order by e.starts_at desc), '[]'::json)
    from public.live_results r join public.live_exams e on e.id = r.exam_id
    where r.user_id = uid and e.deleted_at is null and e.status <> 'cancelled');
end;
$$;

-- Katılmayanlar için genel sonuç özeti (kesinleştikten sonra).
create or replace function public.live_public_summary(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare e public.live_exams; coh public.live_cohort;
begin
  perform public.live_tick();
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null or e.finalized_at is null then
    perform public.live_err('not_yet', 'Genel sonuçlar henüz açıklanmadı.');
  end if;
  select * into coh from public.live_cohort where exam_id = p_exam;
  return json_build_object('exam', public.live_exam_json(e), 'participants', coh.participants,
    'avg_net', coh.avg_net, 'avg_gy', coh.avg_gy, 'avg_gk', coh.avg_gk, 'by_ders', coh.by_ders, 'top', coh.top);
end;
$$;

-- ============================================================
-- YÖNETİCİ FONKSİYONLARI
-- ============================================================

create or replace function public.live_require_admin()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null or not public.live_is_admin() then perform public.live_err('forbidden', 'Bu işlem için yetkin yok.'); end if;
  return uid;
end;
$$;

-- Pazar tarihinden varsayılan saatler (Europe/Istanbul): kayıt 10:00, başlangıç 10:15,
-- giriş 10:45, bitiş 12:25, geç senkron 12:27, sıralama 12:40.
create or replace function public.live_default_times(p_day date)
returns json language sql stable as $$
  select json_build_object(
    'reg_closes_at', (p_day + time '10:00') at time zone 'Europe/Istanbul',
    'starts_at', (p_day + time '10:15') at time zone 'Europe/Istanbul',
    'entry_closes_at', (p_day + time '10:45') at time zone 'Europe/Istanbul',
    'ends_at', (p_day + time '12:25') at time zone 'Europe/Istanbul',
    'late_sync_until', (p_day + time '12:27') at time zone 'Europe/Istanbul',
    'ranking_at', (p_day + time '12:40') at time zone 'Europe/Istanbul')
$$;

-- Deneme oluştur / güncelle (yalnızca başlamamış denemeler).
create or replace function public.live_admin_save_exam(p jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_admin();
  e public.live_exams;
  d json;
  vid uuid := nullif(p->>'id', '')::uuid;
begin
  if p ? 'day' then
    d := public.live_default_times((p->>'day')::date);
    p := p || jsonb_build_object('reg_closes_at', d->>'reg_closes_at', 'starts_at', d->>'starts_at',
           'entry_closes_at', d->>'entry_closes_at', 'ends_at', d->>'ends_at',
           'late_sync_until', d->>'late_sync_until', 'ranking_at', d->>'ranking_at');
  end if;
  if vid is null then
    insert into public.live_exams (track, title, reg_closes_at, starts_at, entry_closes_at, ends_at, late_sync_until, ranking_at,
                                   capacity, created_by, created_at, updated_at)
    values (coalesce(p->>'track', 'lisans'), coalesce(nullif(p->>'title', ''), 'Canlı Deneme'),
            (p->>'reg_closes_at')::timestamptz, (p->>'starts_at')::timestamptz, (p->>'entry_closes_at')::timestamptz,
            (p->>'ends_at')::timestamptz, (p->>'late_sync_until')::timestamptz, (p->>'ranking_at')::timestamptz,
            nullif(p->>'capacity', '')::int, uid, public.live_clock(), public.live_clock())
    returning * into e;
    insert into public.live_events (exam_id, user_id, kind) values (e.id, uid, 'admin_create');
  else
    select * into e from public.live_exams where id = vid for update;
    if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
    if public.live_clock() >= e.starts_at and e.status = 'scheduled' then
      perform public.live_err('started', 'Başlamış denemenin saatleri buradan değiştirilemez; süre uzatmayı kullan.');
    end if;
    if e.status not in ('draft', 'scheduled') then perform public.live_err('locked', 'Bitmiş deneme değiştirilemez.'); end if;
    update public.live_exams set
      title = coalesce(nullif(p->>'title', ''), title),
      reg_closes_at = coalesce((p->>'reg_closes_at')::timestamptz, reg_closes_at),
      starts_at = coalesce((p->>'starts_at')::timestamptz, starts_at),
      entry_closes_at = coalesce((p->>'entry_closes_at')::timestamptz, entry_closes_at),
      ends_at = coalesce((p->>'ends_at')::timestamptz, ends_at),
      late_sync_until = coalesce((p->>'late_sync_until')::timestamptz, late_sync_until),
      ranking_at = coalesce((p->>'ranking_at')::timestamptz, ranking_at),
      capacity = case when p ? 'capacity' then nullif(p->>'capacity', '')::int else capacity end,
      updated_at = public.live_clock()
    where id = vid returning * into e;
    insert into public.live_events (exam_id, user_id, kind, detail) values (e.id, uid, 'admin_update', p);
  end if;
  return public.live_exam_json(e);
end;
$$;

-- Soruları yükle (başlamadan önce). İstemci tarafı doğrulamanın sunucudaki kopyası.
create or replace function public.live_admin_set_questions(p_exam uuid, p_questions jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_admin();
  e public.live_exams;
  n int;
  errs text[] := '{}';
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status not in ('draft', 'scheduled') or public.live_clock() >= e.reg_closes_at then
    perform public.live_err('locked', 'Kayıt kapandıktan sonra sorular değiştirilemez.');
  end if;
  if jsonb_typeof(p_questions) <> 'array' then perform public.live_err('bad_input', 'Soru listesi dizi olmalı.'); end if;
  n := jsonb_array_length(p_questions);
  if n <> e.question_count then errs := errs || format('%s soru bekleniyordu, %s geldi.', e.question_count, n); end if;
  if (select count(distinct (q->>'no')::int) from jsonb_array_elements(p_questions) q) <> n then errs := errs || 'Mükerrer soru numarası var.'::text; end if;
  if exists (select 1 from jsonb_array_elements(p_questions) q where (q->>'no')::int not between 1 and e.question_count) then
    errs := errs || 'Soru numaraları 1–120 aralığında olmalı.'::text;
  end if;
  if (select count(*) from jsonb_array_elements(p_questions) q where q->>'bolum' = 'GY') <> e.question_count / 2 then
    errs := errs || 'Genel Yetenek soru sayısı yarı yarıya olmalı.'::text;
  end if;
  if exists (select 1 from jsonb_array_elements(p_questions) q
             where jsonb_typeof(q->'options') <> 'array' or jsonb_array_length(q->'options') <> 5
                or coalesce(q->>'answer', '') not in ('A', 'B', 'C', 'D', 'E')
                or coalesce(q->>'stem', '') = '' or coalesce(q->>'ders', '') = '' or coalesce(q->>'konu', '') = '') then
    errs := errs || 'Eksik alanlı soru var (metin, ders, konu, 5 şık, doğru cevap).'::text;
  end if;
  if array_length(errs, 1) > 0 then
    return json_build_object('ok', false, 'errors', to_json(errs));
  end if;
  insert into public.live_questions (exam_id, no, bolum, ders, konu, stem, options, answer, explanation, image)
  select p_exam, (q->>'no')::int, q->>'bolum', q->>'ders', q->>'konu', q->>'stem', q->'options', q->>'answer',
         coalesce(q->>'explanation', ''), nullif(q->>'image', '')
  from jsonb_array_elements(p_questions) q
  on conflict (exam_id, no) do update set bolum = excluded.bolum, ders = excluded.ders, konu = excluded.konu,
    stem = excluded.stem, options = excluded.options, answer = excluded.answer,
    explanation = excluded.explanation, image = excluded.image;
  insert into public.live_events (exam_id, user_id, kind, detail) values (p_exam, uid, 'admin_questions', json_build_object('n', n)::jsonb);
  return json_build_object('ok', true, 'count', n);
end;
$$;

create or replace function public.live_admin_set_booklet(p_exam uuid, p_path text, p_key text, p_sha text)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams;
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if public.live_clock() >= e.reg_closes_at then perform public.live_err('locked', 'Kayıt kapandıktan sonra kitapçık değiştirilemez.'); end if;
  if p_key !~ '^[0-9a-f]{64}$' then perform public.live_err('bad_key', 'Anahtar 64 haneli hex olmalı.'); end if;
  update public.live_exams set booklet_path = p_path, booklet_key = p_key, booklet_sha = p_sha, updated_at = public.live_clock()
   where id = p_exam;
  insert into public.live_events (exam_id, user_id, kind) values (p_exam, uid, 'admin_booklet');
  return json_build_object('ok', true);
end;
$$;

-- Yayınla: 120 soru ve kitapçık hazırsa kayda açılır. Aynı kulvardaki bitmiş denemeler arşive geçer.
create or replace function public.live_admin_publish(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams; n int;
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status <> 'draft' then return public.live_exam_json(e); end if;
  select count(*) into n from public.live_questions where exam_id = p_exam;
  if n <> e.question_count then perform public.live_err('incomplete', format('Önce %s soruyu yükle (şu an %s).', e.question_count, n)); end if;
  if e.booklet_path is null then perform public.live_err('incomplete', 'Önce kitapçığı yükle.'); end if;
  if public.live_clock() >= e.reg_closes_at then perform public.live_err('late', 'Kayıt kapanış saati geçmiş; saatleri güncelle.'); end if;
  update public.live_exams set status = 'archived', updated_at = public.live_clock()
   where track = e.track and status = 'finished' and id <> e.id;
  update public.live_exams set status = 'scheduled', updated_at = public.live_clock() where id = p_exam returning * into e;
  insert into public.live_events (exam_id, user_id, kind) values (p_exam, uid, 'admin_publish');
  return public.live_exam_json(e);
end;
$$;

-- Yalnızca TASLAK deneme yumuşak silinir. Yayınlanmış/bitmiş/arşiv deneme asla silinemez.
create or replace function public.live_admin_discard_draft(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams;
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status <> 'draft' then perform public.live_err('locked', 'Yalnızca taslak deneme kaldırılabilir; yayınlanmış denemeler kalıcıdır.'); end if;
  update public.live_exams set deleted_at = public.live_clock(), updated_at = public.live_clock() where id = p_exam;
  insert into public.live_events (exam_id, user_id, kind) values (p_exam, uid, 'admin_discard_draft');
  return json_build_object('ok', true);
end;
$$;

create or replace function public.live_admin_list()
returns json language plpgsql security definer set search_path = public as $$
begin
  perform public.live_require_admin();
  perform public.live_tick();
  return (select coalesce(json_agg(x order by x.starts_at desc), '[]'::json) from (
    select e.id, e.track, e.title, e.status, e.starts_at, e.reg_closes_at, e.ends_at, e.ranking_at, e.capacity,
           e.extra_minutes, e.booklet_path is not null as has_booklet, e.finalized_at,
           (select count(*) from public.live_questions q where q.exam_id = e.id) as questions,
           (select count(*) from public.live_registrations r where r.exam_id = e.id and r.status = 'registered') as registered,
           (select count(*) from public.live_registrations r where r.exam_id = e.id and r.status = 'waitlist') as waitlist,
           (select count(*) from public.live_attempts a where a.exam_id = e.id) as entered,
           (select participants from public.live_cohort c where c.exam_id = e.id) as participants,
           (select avg_net from public.live_cohort c where c.exam_id = e.id) as avg_net
    from public.live_exams e where e.deleted_at is null) x);
end;
$$;

create or replace function public.live_admin_registrations(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  perform public.live_require_admin();
  return (select coalesce(json_agg(json_build_object('user_id', r.user_id, 'nickname', r.nickname, 'status', r.status,
            'mode', r.mode, 'created_at', r.created_at,
            'entered', a.entered_at is not null, 'switches', coalesce(a.switches, 0), 'locked', coalesce(a.locked, false),
            'answered', (select count(*) from public.live_answers x where x.exam_id = r.exam_id and x.user_id = r.user_id and x.choice is not null),
            'net', (select net from public.live_results x where x.exam_id = r.exam_id and x.user_id = r.user_id))
          order by r.created_at), '[]'::json)
    from public.live_registrations r
    left join public.live_attempts a on a.exam_id = r.exam_id and a.user_id = r.user_id
    where r.exam_id = p_exam);
end;
$$;

create or replace function public.live_admin_set_registration(p_exam uuid, p_user uuid, p_status text)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin();
begin
  if p_status not in ('registered', 'waitlist', 'cancelled', 'blocked') then perform public.live_err('bad_input', 'Geçersiz durum.'); end if;
  update public.live_registrations set status = p_status, updated_at = public.live_clock() where exam_id = p_exam and user_id = p_user;
  insert into public.live_events (exam_id, user_id, kind, detail)
  values (p_exam, p_user, 'admin_registration', json_build_object('status', p_status, 'by', uid)::jsonb);
  return json_build_object('ok', true);
end;
$$;

-- Canlı izleme: katılımcı sayıları ve olaylar.
create or replace function public.live_admin_monitor(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare t timestamptz := public.live_clock();
begin
  perform public.live_require_admin();
  return json_build_object(
    'now', (extract(epoch from t) * 1000)::bigint,
    'registered', (select count(*) from public.live_registrations where exam_id = p_exam and status = 'registered'),
    'waitlist', (select count(*) from public.live_registrations where exam_id = p_exam and status = 'waitlist'),
    'entered', (select count(*) from public.live_attempts where exam_id = p_exam),
    'active', (select count(*) from public.live_attempts where exam_id = p_exam and closed_at is null and submitted_at is null and last_seen_at > t - interval '3 minutes'),
    'submitted', (select count(*) from public.live_attempts where exam_id = p_exam and submitted_at is not null),
    'locked', (select count(*) from public.live_attempts where exam_id = p_exam and locked),
    'avg_answered', (select round(avg(c), 1) from (select count(*) filter (where choice is not null) as c
                      from public.live_answers where exam_id = p_exam group by user_id) z),
    'events', (select coalesce(json_agg(json_build_object('at', ev.at, 'kind', ev.kind, 'user_id', ev.user_id,
                 'nickname', (select nickname from public.live_registrations r where r.exam_id = p_exam and r.user_id = ev.user_id),
                 'detail', ev.detail) order by ev.at desc), '[]'::json)
               from (select * from public.live_events where exam_id = p_exam
                     and kind in ('device_switch', 'locked', 'admin_extend', 'admin_cancel', 'admin_unlock', 'finalize')
                     order by at desc limit 60) ev));
end;
$$;

-- ACİL DURUM: süreyi uzat (bitiş, geç senkron ve sıralama saatleri birlikte kayar).
create or replace function public.live_admin_extend(p_exam uuid, p_minutes int)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams;
begin
  if p_minutes is null or p_minutes < 1 or p_minutes > 120 then perform public.live_err('bad_input', 'Süre 1–120 dakika olmalı.'); end if;
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.status <> 'scheduled' then perform public.live_err('locked', 'Yalnızca süren deneme uzatılabilir.'); end if;
  if public.live_clock() >= e.ends_at then perform public.live_err('ended', 'Bitmiş sınav uzatılamaz.'); end if;
  update public.live_exams set ends_at = ends_at + make_interval(mins => p_minutes),
         late_sync_until = late_sync_until + make_interval(mins => p_minutes),
         ranking_at = ranking_at + make_interval(mins => p_minutes),
         extra_minutes = extra_minutes + p_minutes, updated_at = public.live_clock()
   where id = p_exam returning * into e;
  insert into public.live_events (exam_id, user_id, kind, detail) values (p_exam, uid, 'admin_extend', json_build_object('minutes', p_minutes)::jsonb);
  return public.live_exam_json(e);
end;
$$;

-- ACİL DURUM: iptal. Veri silinmez; sonuç ve sıralama üretilmez.
create or replace function public.live_admin_cancel(p_exam uuid, p_reason text)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams;
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.status not in ('draft', 'scheduled') then perform public.live_err('locked', 'Bu deneme iptal edilemez.'); end if;
  update public.live_exams set status = 'cancelled', cancel_reason = left(coalesce(p_reason, ''), 300), updated_at = public.live_clock()
   where id = p_exam returning * into e;
  insert into public.live_events (exam_id, user_id, kind, detail) values (p_exam, uid, 'admin_cancel', json_build_object('reason', p_reason)::jsonb);
  return public.live_exam_json(e);
end;
$$;

create or replace function public.live_admin_unlock(p_exam uuid, p_user uuid)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin();
begin
  update public.live_attempts set locked = false where exam_id = p_exam and user_id = p_user;
  insert into public.live_events (exam_id, user_id, kind, detail) values (p_exam, p_user, 'admin_unlock', json_build_object('by', uid)::jsonb);
  return json_build_object('ok', true);
end;
$$;

-- Sınav sonrası soru istatistiği (hangi şık kaç kişi).
create or replace function public.live_admin_stats(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
begin
  perform public.live_require_admin();
  return json_build_object(
    'cohort', (select row_to_json(c) from public.live_cohort c where c.exam_id = p_exam),
    'questions', (select coalesce(json_agg(json_build_object('no', q.no, 'ders', q.ders, 'konu', q.konu, 'answer', q.answer,
        'correct', s.correct, 'wrong', s.wrong, 'blank', s.blank, 'choices', s.choices, 'avg_ms', s.avg_ms) order by q.no), '[]'::json)
      from public.live_questions q left join public.live_question_stats s on s.exam_id = q.exam_id and s.no = q.no
      where q.exam_id = p_exam));
end;
$$;

-- ---------- yetkiler ----------
do $$
declare f text;
begin
  foreach f in array array[
    'live_now()', 'live_dashboard(text)', 'live_register(uuid)', 'live_unregister(uuid)', 'live_booklet(uuid)',
    'live_enter(uuid, text)', 'live_save(uuid, text, jsonb)', 'live_submit(uuid, text)', 'live_result(uuid)',
    'live_review(uuid)', 'live_history()', 'live_public_summary(uuid)',
    'live_admin_save_exam(jsonb)', 'live_admin_set_questions(uuid, jsonb)', 'live_admin_set_booklet(uuid, text, text, text)',
    'live_admin_publish(uuid)', 'live_admin_discard_draft(uuid)', 'live_admin_list()', 'live_admin_registrations(uuid)',
    'live_admin_set_registration(uuid, uuid, text)', 'live_admin_monitor(uuid)', 'live_admin_extend(uuid, int)',
    'live_admin_cancel(uuid, text)', 'live_admin_unlock(uuid, uuid)', 'live_admin_stats(uuid)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  foreach f in array array[
    'live_compute_result(uuid, uuid)', 'live_close_attempt(uuid, uuid, text)', 'live_finalize(uuid)', 'live_tick()',
    'live_is_admin()', 'live_require_admin()', 'live_default_times(date)'] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', f);
  end loop;
end $$;
grant execute on function public.live_now() to anon;

-- ---------- Storage: kapalı bucket ----------
-- booklets/<deneme-id>.bin : şifreli soru kitapçığı (görseller içinde gömülü).
-- Okuma: yalnızca kayıtlı kullanıcı, kayıt kapandıktan sonra. Yazma: yalnızca admin.
create or replace function public.live_can_read_object(p_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare eid uuid;
begin
  if p_name !~ '^booklets/[0-9a-f-]{36}\.bin$' then return false; end if;
  eid := substring(p_name from 'booklets/([0-9a-f-]{36})\.bin')::uuid;
  if public.live_is_admin() then return true; end if;
  return exists (select 1 from public.live_exams e join public.live_registrations r on r.exam_id = e.id
                 where e.id = eid and e.deleted_at is null and r.user_id = auth.uid() and r.status = 'registered'
                   and public.live_clock() >= e.reg_closes_at);
end;
$$;
revoke all on function public.live_can_read_object(text) from public, anon;
grant execute on function public.live_can_read_object(text) to authenticated;

do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    insert into storage.buckets (id, name, public) values ('live-exam', 'live-exam', false) on conflict (id) do nothing;
    execute 'drop policy if exists "live exam read" on storage.objects';
    execute 'create policy "live exam read" on storage.objects for select to authenticated using (bucket_id = ''live-exam'' and public.live_can_read_object(name))';
    execute 'drop policy if exists "live exam admin write" on storage.objects';
    execute 'create policy "live exam admin write" on storage.objects for insert to authenticated with check (bucket_id = ''live-exam'' and public.live_is_admin())';
    execute 'drop policy if exists "live exam admin update" on storage.objects';
    execute 'create policy "live exam admin update" on storage.objects for update to authenticated using (bucket_id = ''live-exam'' and public.live_is_admin())';
  end if;
end $$;
grant execute on function public.live_is_admin() to authenticated;

-- ---------- zamanlayıcı (pg_cron varsa) ----------
-- Supabase: Database → Extensions → pg_cron'u aç, sonra bu dosyayı yeniden çalıştır.
-- pg_cron yoksa da sistem çalışır: her sonuç/pano isteği live_tick() çağırır.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule(jobid) from cron.job where jobname = 'live-exam-tick';
    perform cron.schedule('live-exam-tick', '* * * * *', 'select public.live_tick()');
  end if;
end $$;
