-- CANLI DENEME · PARÇA 6 / 8
-- Supabase SQL Editor'da 1'den 8'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

-- Kâğıtta çözenin optik gönderimi (kamera okuması ya da elle giriş, kullanıcı onayından sonra).
-- p_answers: soru sırasıyla 'A'..'E' ya da boş için '-' (ör. 'ACEB-D...'), tam question_count karakter.
-- p_meta: {source: 'optic'|'manual', qr: 'ATN|1|<deneme>|<kullanıcı>|<kulvar>', flagged, double, uncertain, ...}
-- Gönderilen kâğıt bir daha değiştirilemez.
create or replace function public.live_submit_optic(p_exam uuid, p_answers text, p_meta jsonb default '{}'::jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  att public.live_attempts;
  t timestamptz := public.live_clock();
  src text := case when p_meta->>'source' = 'manual' then 'manual' else 'optic' end;
  qr text := nullif(p_meta->>'qr', '');
  i int;
  ch text;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status = 'cancelled' then perform public.live_err('cancelled', 'Bu deneme iptal edildi.'); end if;
  select * into att from public.live_attempts where exam_id = p_exam and user_id = uid for update;
  if att.exam_id is null then
    perform public.live_err('not_entered', 'Kâğıtta çözmek için sınav saatinde "Kâğıtta çöz" ile giriş yapmalısın.');
  end if;
  if att.mode <> 'paper' then perform public.live_err('device_mode', 'Bu sınavı cihazda çözüyorsun; optik gönderilemez.'); end if;
  if att.locked then perform public.live_err('locked', 'Sınavın kilitlendi. Yönetici ile iletişime geç.'); end if;
  if att.submitted_at is not null then perform public.live_err('submitted', 'Optik formun zaten gönderildi; değiştirilemez.'); end if;
  if att.closed_at is not null or e.status <> 'scheduled' or t >= e.ranking_at then
    perform public.live_err('optic_closed', 'Optik okutma süresi doldu.');
  end if;
  if t < e.starts_at then perform public.live_err('too_early', 'Sınav henüz başlamadı.'); end if;
  if p_answers is null or length(p_answers) <> e.question_count or p_answers !~ '^[A-E-]+$' then
    perform public.live_err('bad_input', format('%s cevap bekleniyordu (A–E ya da boş için -).', e.question_count));
  end if;
  if qr is not null and (split_part(qr, '|', 1) <> 'ATN' or split_part(qr, '|', 3) <> p_exam::text or split_part(qr, '|', 4) <> uid::text) then
    perform public.live_err('wrong_form', 'Bu optik form sana ya da bu denemeye ait değil.');
  end if;
  for i in 1 .. e.question_count loop
    ch := nullif(substr(p_answers, i, 1), '-');
    insert into public.live_answers (exam_id, user_id, no, choice, ms, source, updated_at)
    values (p_exam, uid, i, ch, 0, src, t)
    on conflict (exam_id, user_id, no) do update set choice = excluded.choice, source = excluded.source, updated_at = excluded.updated_at;
  end loop;
  update public.live_attempts set submitted_at = t, last_seen_at = t where exam_id = p_exam and user_id = uid;
  perform public.live_close_attempt(p_exam, uid, src);
  insert into public.live_events (exam_id, user_id, kind, detail)
  values (p_exam, uid, 'optic_submit', jsonb_build_object('source', src, 'qr', qr is not null,
          'blank', length(p_answers) - length(replace(p_answers, '-', '')),
          'flagged', p_meta->'flagged', 'double', p_meta->'double', 'uncertain', p_meta->'uncertain', 'edited', p_meta->'edited'));
  return json_build_object('submitted', true, 'results_at', greatest(e.ends_at, t), 'ranking_at', e.ranking_at);
end;
$$;

-- Okuma sorunu kaydı (yönetici "okutmada sorun yaşayanlar" listesinde görür). Kişi başı en fazla 40 kayıt.
create or replace function public.live_optic_report(p_exam uuid, p_kind text, p_detail jsonb default '{}'::jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_user(); n int;
begin
  if p_kind not in ('fail', 'manual_open', 'wrong_form') then perform public.live_err('bad_input', 'Geçersiz kayıt.'); end if;
  if not exists (select 1 from public.live_attempts where exam_id = p_exam and user_id = uid) then
    return json_build_object('ok', false);
  end if;
  select count(*) into n from public.live_events where exam_id = p_exam and user_id = uid and kind like 'optic_%';
  if n >= 40 then return json_build_object('ok', false); end if;
  insert into public.live_events (exam_id, user_id, kind, detail)
  values (p_exam, uid, 'optic_' || p_kind, case when length(coalesce(p_detail, '{}'::jsonb)::text) > 1500 then '{}'::jsonb else coalesce(p_detail, '{}'::jsonb) end);
  return json_build_object('ok', true);
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
