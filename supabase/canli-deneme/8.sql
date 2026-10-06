-- CANLI DENEME · PARÇA 8 / 9
-- Supabase SQL Editor'da 1'den 9'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
    'paper_entered', (select count(*) from public.live_attempts where exam_id = p_exam and mode = 'paper'),
    'paper_submitted', (select count(*) from public.live_attempts where exam_id = p_exam and mode = 'paper' and submitted_at is not null),
    'paper', (select coalesce(json_agg(json_build_object('user_id', a.user_id,
                 'nickname', (select nickname from public.live_registrations r where r.exam_id = p_exam and r.user_id = a.user_id),
                 'entered_at', a.entered_at, 'submitted', a.submitted_at is not null, 'close_reason', a.close_reason,
                 'source', (select max(x.source) from public.live_answers x where x.exam_id = p_exam and x.user_id = a.user_id),
                 'fails', (select count(*) from public.live_events v where v.exam_id = p_exam and v.user_id = a.user_id and v.kind in ('optic_fail', 'optic_wrong_form')),
                 'last_fail', (select v.detail from public.live_events v where v.exam_id = p_exam and v.user_id = a.user_id
                                 and v.kind in ('optic_fail', 'optic_wrong_form') order by v.at desc limit 1))
               order by a.submitted_at is not null, a.entered_at), '[]'::json)
              from public.live_attempts a where a.exam_id = p_exam and a.mode = 'paper'),
    'avg_answered', (select round(avg(c), 1) from (select count(*) filter (where choice is not null) as c
                      from public.live_answers where exam_id = p_exam group by user_id) z),
    'events', (select coalesce(json_agg(json_build_object('at', ev.at, 'kind', ev.kind, 'user_id', ev.user_id,
                 'nickname', (select nickname from public.live_registrations r where r.exam_id = p_exam and r.user_id = ev.user_id),
                 'detail', ev.detail) order by ev.at desc), '[]'::json)
               from (select * from public.live_events where exam_id = p_exam
                     and kind in ('device_switch', 'locked', 'admin_extend', 'admin_cancel', 'admin_unlock', 'finalize',
                                  'optic_fail', 'optic_wrong_form', 'optic_submit', 'admin_paper')
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

-- Okutmada sorun yaşayan kâğıt katılımcısı için elle giriş (kayıtlı). Yalnızca optiğini
-- GÖNDERMEMİŞ kâğıt katılımcısı için; gönderilmiş kâğıt değişmez. Sıralama kesinleşmişse yeniden hesaplanır.
create or replace function public.live_admin_paper(p_exam uuid, p_user uuid, p_answers text, p_note text)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_admin();
  e public.live_exams;
  att public.live_attempts;
  t timestamptz := public.live_clock();
  i int;
begin
  select * into e from public.live_exams where id = p_exam for update;
  if e.id is null or e.deleted_at is not null or e.status = 'cancelled' then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if t < e.starts_at then perform public.live_err('too_early', 'Sınav henüz başlamadı.'); end if;
  select * into att from public.live_attempts where exam_id = p_exam and user_id = p_user for update;
  if att.exam_id is null or att.mode <> 'paper' then perform public.live_err('not_paper', 'Bu kullanıcı kâğıtta çözmüyor.'); end if;
  if att.submitted_at is not null then perform public.live_err('submitted', 'Kullanıcının optiği gönderilmiş; gönderilen kâğıt değişmez.'); end if;
  if coalesce(length(trim(p_note)), 0) < 3 then perform public.live_err('bad_input', 'Düzeltme nedeni yaz.'); end if;
  if p_answers is null or length(p_answers) <> e.question_count or p_answers !~ '^[A-E-]+$' then
    perform public.live_err('bad_input', format('%s cevap bekleniyordu (A–E ya da boş için -).', e.question_count));
  end if;
  for i in 1 .. e.question_count loop
    insert into public.live_answers (exam_id, user_id, no, choice, ms, source, updated_at)
    values (p_exam, p_user, i, nullif(substr(p_answers, i, 1), '-'), 0, 'admin', t)
    on conflict (exam_id, user_id, no) do update set choice = excluded.choice, source = excluded.source, updated_at = excluded.updated_at;
  end loop;
  update public.live_attempts set submitted_at = t, closed_at = coalesce(closed_at, t), close_reason = 'admin', last_seen_at = t
   where exam_id = p_exam and user_id = p_user;
  perform public.live_compute_result(p_exam, p_user);
  if e.finalized_at is not null then perform public.live_rank(p_exam); end if;
  insert into public.live_events (exam_id, user_id, kind, detail)
  values (p_exam, p_user, 'admin_paper', json_build_object('by', uid, 'note', left(p_note, 300), 'reranked', e.finalized_at is not null)::jsonb);
  return json_build_object('ok', true, 'reranked', e.finalized_at is not null);
end;
$$;

-- Kohort karşılaştırması: bir kulvarın kesinleşmiş denemeleri yan yana (katılım, ortalama,
-- yüzdelikler, ilk %10, cihaz/kâğıt, ders ortalamaları).
create or replace function public.live_admin_trends(p_track text)
returns json language plpgsql security definer set search_path = public as $$
begin
  perform public.live_require_admin();
  return (select coalesce(json_agg(json_build_object(
      'id', e.id, 'title', e.title, 'track', e.track, 'starts_at', e.starts_at, 'status', e.status,
      'registered', (select count(*) from public.live_registrations r where r.exam_id = e.id and r.status = 'registered'),
      'participants', c.participants, 'avg_net', c.avg_net, 'avg_gy', c.avg_gy, 'avg_gk', c.avg_gk,
      'by_ders', c.by_ders, 'analysis', c.analysis) order by e.starts_at), '[]'::json)
    from public.live_exams e join public.live_cohort c on c.exam_id = e.id
    where e.track = p_track and e.deleted_at is null and e.status <> 'cancelled' and e.finalized_at is not null);
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
