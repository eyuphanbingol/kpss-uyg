-- CANLI DENEME · PARÇA 3 / 8
-- Supabase SQL Editor'da 1'den 8'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

-- Sıralama, kohort ve soru istatistikleri. Kesinleşmede, ayrıca yöneticinin kayıtlı
-- elle düzeltmesinden sonra yeniden çalışır.
create or replace function public.live_rank(p_exam uuid)
returns void language plpgsql security definer set search_path = public as $$
declare n int;
begin
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
end;
$$;

-- Dakikalık bakım: geç senkron süresi dolan kâğıtları kapat, zamanı gelen sınavları kesinleştir.
create or replace function public.live_tick()
returns void language plpgsql security definer set search_path = public as $$
declare a record; x record;
begin
  for a in select t.exam_id, t.user_id from public.live_attempts t
           join public.live_exams e on e.id = t.exam_id
           where t.closed_at is null and e.status = 'scheduled'
             and ((t.mode = 'device' and public.live_clock() > e.late_sync_until)
               or (t.mode = 'paper' and public.live_clock() >= e.ranking_at)) loop
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
        'locked', att.locked, 'switches', att.switches, 'mode', att.mode, 'close_reason', att.close_reason) end,
    'last_result', case when last_res.exam_id is null then null else json_build_object(
        'exam_id', last_res.exam_id, 'title', last_res.title, 'track', last_res.track, 'starts_at', last_res.starts_at,
        'net', last_res.net, 'gy_net', last_res.gy_net, 'gk_net', last_res.gk_net,
        'correct', last_res.correct, 'wrong', last_res.wrong, 'blank', last_res.blank,
        'rank', last_res.rank, 'participants', last_res.participants, 'top_pct', last_res.top_pct,
        'ranking_at', last_res.ranking_at, 'finalized', last_res.finalized_at is not null,
        'by_konu', last_res.by_konu) end,
    'missed', case when missed.id is null then null else public.live_exam_json(missed) end,
    'missed_no_optic', missed.id is not null and exists (select 1 from public.live_attempts t
        where t.exam_id = missed.id and t.user_id = uid and t.mode = 'paper' and t.submitted_at is null)
  );
end;
$$;
