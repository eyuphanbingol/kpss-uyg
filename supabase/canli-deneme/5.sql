-- CANLI DENEME · PARÇA 5 / 8
-- Supabase SQL Editor'da 1'den 8'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
  if att.mode = 'paper' then perform public.live_err('paper_mode', 'Kâğıtta çözüyorsun; cevaplarını optik formla gönder.'); end if;
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
  if att.mode = 'paper' then perform public.live_err('paper_mode', 'Kâğıtta çözüyorsun; cevaplarını optik formla gönder.'); end if;
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
  if att.mode = 'paper' and att.submitted_at is null then
    if att.closed_at is null then perform public.live_err('optic_pending', 'Sonucun için önce optik formunu okut.'); end if;
    perform public.live_err('no_optic', 'Optik formun gönderilmediği için bu denemede sonucun yok.');
  end if;
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
  if att.mode = 'paper' and att.submitted_at is null then
    perform public.live_err('no_optic', 'Çözümler optik formunu gönderdikten sonra açılır.');
  end if;
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
