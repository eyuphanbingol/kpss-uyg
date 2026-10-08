-- CANLI DENEME · PARÇA 2 / 10
-- Supabase SQL Editor'da 1'den 10'a SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
    'finalized', e.finalized_at is not null, 'cancel_reason', e.cancel_reason,
    'optic_until', e.ranking_at)
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
  select coalesce(t.mode, md) into md from public.live_attempts t where t.exam_id = p_exam and t.user_id = p_user;

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
-- Kâğıtta çözüp optik formunu göndermeyenin kâğıdı sonuçsuz kapanır ('no_optic').
create or replace function public.live_close_attempt(p_exam uuid, p_user uuid, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
declare att public.live_attempts;
begin
  select * into att from public.live_attempts where exam_id = p_exam and user_id = p_user;
  if att.exam_id is null then return; end if;
  if att.mode = 'paper' and att.submitted_at is null then
    update public.live_attempts set closed_at = public.live_clock(), close_reason = 'no_optic'
     where exam_id = p_exam and user_id = p_user and closed_at is null;
    return;
  end if;
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
           where t.exam_id = p_exam and not (t.mode = 'paper' and t.submitted_at is null)
             and not exists (select 1 from public.live_results r where r.exam_id = p_exam and r.user_id = t.user_id) loop
    perform public.live_compute_result(p_exam, rec.user_id);
  end loop;

  perform public.live_rank(p_exam);
  select participants into n from public.live_cohort where exam_id = p_exam;
  update public.live_exams set finalized_at = public.live_clock(), status = 'finished', updated_at = public.live_clock()
   where id = p_exam;
  insert into public.live_events (exam_id, kind, detail) values (p_exam, 'finalize', json_build_object('participants', n)::jsonb);
end;
$$;
