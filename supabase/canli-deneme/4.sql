-- CANLI DENEME · PARÇA 4 / 8
-- Supabase SQL Editor'da 1'den 8'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
