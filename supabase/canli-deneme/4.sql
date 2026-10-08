-- CANLI DENEME · PARÇA 4 / 10
-- Supabase SQL Editor'da 1'den 10'a SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
-- p_mode: 'device' (cihazda çöz) ya da 'paper' (kitapçığı yazdır, optik formu okut). İlk girişte
-- seçilir, sonra değişmez. Kâğıt modunda cihaz kilidi yoktur: cevaplar akmaz, optik bir kez gönderilir.
drop function if exists public.live_enter(uuid, text);
