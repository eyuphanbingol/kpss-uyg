-- CANLI DENEME · PARÇA 7 / 9
-- Supabase SQL Editor'da 1'den 9'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
