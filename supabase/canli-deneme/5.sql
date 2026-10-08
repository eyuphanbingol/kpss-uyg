-- CANLI DENEME · PARÇA 5 / 10
-- Supabase SQL Editor'da 1'den 10'a SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

create or replace function public.live_enter(p_exam uuid, p_device text, p_mode text default 'device')
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  att public.live_attempts;
  t timestamptz := public.live_clock();
  md text := coalesce(nullif(p_mode, ''), 'device');
  ans json;
begin
  if coalesce(length(p_device), 0) < 8 or length(p_device) > 80 then perform public.live_err('bad_device', 'Geçersiz cihaz.'); end if;
  if md not in ('device', 'paper') then perform public.live_err('bad_input', 'Geçersiz çözme biçimi.'); end if;
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
    insert into public.live_attempts (exam_id, user_id, device_id, mode, entered_at, last_seen_at)
    values (p_exam, uid, p_device, md, t, t) returning * into att;
    update public.live_registrations set mode = md, updated_at = t where exam_id = p_exam and user_id = uid;
    insert into public.live_events (exam_id, user_id, kind, detail) values (p_exam, uid, 'enter', json_build_object('mode', md)::jsonb);
  else
    if att.locked then perform public.live_err('locked', 'Sınavın kilitlendi. Yönetici ile iletişime geç.'); end if;
    if att.submitted_at is not null then perform public.live_err('submitted', 'Kâğıdını teslim ettin.'); end if;
    if att.mode <> md then
      perform public.live_err('mode_locked', case when att.mode = 'paper'
        then 'Kâğıtta çözmeyi seçtin; cevaplarını optik formunu okutarak gönder.'
        else 'Sınava cihazda başladın; cihazda devam et.' end);
    end if;
    if att.mode = 'paper' then
      update public.live_attempts set last_seen_at = t where exam_id = p_exam and user_id = uid;
    elsif att.device_id <> p_device then
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
    'answers', ans, 'switches', att.switches, 'mode', att.mode);
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
  peers json;
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
  if e.finalized_at is not null then
    select * into coh from public.live_cohort where exam_id = p_exam;
    -- benzer seviyedekiler: netin ±5 içindeki diğer katılımcılar (en az 3 kişi; tek kişinin sonucu sızmasın)
    select case when count(*) >= 3 then json_build_object('n', count(*), 'net', round(avg(r.net), 2),
             'by_ders', (select coalesce(json_object_agg(t.k, t.v), '{}'::json) from (
                select d.key as k, round(avg((d.value->>'net')::numeric), 2) as v
                from public.live_results r2 cross join lateral jsonb_each(r2.by_ders) d
                where r2.exam_id = p_exam and r2.user_id <> uid and abs(r2.net - res.net) <= 5 group by d.key) t))
           else null end
      into peers
      from public.live_results r where r.exam_id = p_exam and r.user_id <> uid and abs(r.net - res.net) <= 5;
  end if;
  return json_build_object(
    'exam', public.live_exam_json(e),
    'now', (extract(epoch from public.live_clock()) * 1000)::bigint,
    'result', row_to_json(res),
    'cohort', case when coh.exam_id is null then null else row_to_json(coh) end,
    'peers', peers);
end;
$$;
