-- CANLI DENEME · PARÇA 7 / 8
-- Supabase SQL Editor'da 1'den 8'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
            'mode', coalesce(a.mode, r.mode), 'created_at', r.created_at, 'submitted', a.submitted_at is not null,
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
