-- CANLI DENEME · PARÇA 9 / 10
-- Supabase SQL Editor'da 1'den 10'a SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

-- ---------- yetkiler ----------
do $$
declare f text;
begin
  foreach f in array array[
    'live_now()', 'live_dashboard(text)', 'live_register(uuid)', 'live_unregister(uuid)', 'live_booklet(uuid)',
    'live_enter(uuid, text, text)', 'live_save(uuid, text, jsonb)',
    'live_submit_optic(uuid, text, jsonb)', 'live_optic_report(uuid, text, jsonb)', 'live_admin_paper(uuid, uuid, text, text)', 'live_submit(uuid, text)', 'live_result(uuid)',
    'live_review(uuid)', 'live_history()', 'live_public_summary(uuid)',
    'live_admin_save_exam(jsonb)', 'live_admin_set_questions(uuid, jsonb)', 'live_admin_set_booklet(uuid, text, text, text)',
    'live_admin_publish(uuid)', 'live_admin_discard_draft(uuid)', 'live_admin_list()', 'live_admin_registrations(uuid)',
    'live_admin_set_registration(uuid, uuid, text)', 'live_admin_monitor(uuid)', 'live_admin_extend(uuid, int)',
    'live_admin_cancel(uuid, text)', 'live_admin_unlock(uuid, uuid)', 'live_admin_stats(uuid)', 'live_admin_trends(text)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  foreach f in array array[
    'live_compute_result(uuid, uuid)', 'live_close_attempt(uuid, uuid, text)', 'live_finalize(uuid)', 'live_rank(uuid)', 'live_tick()',
    'live_is_admin()', 'live_require_admin()', 'live_default_times(date)'] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', f);
  end loop;
end $$;
grant execute on function public.live_now() to anon;

-- ---------- Storage: kapalı bucket ----------
-- booklets/<deneme-id>.bin : şifreli soru kitapçığı (görseller içinde gömülü).
-- Okuma: yalnızca kayıtlı kullanıcı, kayıt kapandıktan sonra. Yazma: yalnızca admin.
create or replace function public.live_can_read_object(p_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare eid uuid;
begin
  if p_name !~ '^booklets/[0-9a-f-]{36}\.bin$' then return false; end if;
  eid := substring(p_name from 'booklets/([0-9a-f-]{36})\.bin')::uuid;
  if public.live_is_admin() then return true; end if;
  return exists (select 1 from public.live_exams e join public.live_registrations r on r.exam_id = e.id
                 where e.id = eid and e.deleted_at is null and r.user_id = auth.uid() and r.status = 'registered'
                   and public.live_clock() >= e.reg_closes_at);
end;
$$;
revoke all on function public.live_can_read_object(text) from public, anon;
grant execute on function public.live_can_read_object(text) to authenticated;

do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    insert into storage.buckets (id, name, public) values ('live-exam', 'live-exam', false) on conflict (id) do nothing;
    execute 'drop policy if exists "live exam read" on storage.objects';
    execute 'create policy "live exam read" on storage.objects for select to authenticated using (bucket_id = ''live-exam'' and public.live_can_read_object(name))';
    execute 'drop policy if exists "live exam admin write" on storage.objects';
    execute 'create policy "live exam admin write" on storage.objects for insert to authenticated with check (bucket_id = ''live-exam'' and public.live_is_admin())';
    execute 'drop policy if exists "live exam admin update" on storage.objects';
    execute 'create policy "live exam admin update" on storage.objects for update to authenticated using (bucket_id = ''live-exam'' and public.live_is_admin())';
  end if;
end $$;
grant execute on function public.live_is_admin() to authenticated;

-- ---------- zamanlayıcı (pg_cron varsa) ----------
-- Supabase: Database → Extensions → pg_cron'u aç, sonra bu dosyayı yeniden çalıştır.
-- pg_cron yoksa da sistem çalışır: her sonuç/pano isteği live_tick() çağırır.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule(jobid) from cron.job where jobname = 'live-exam-tick';
    perform cron.schedule('live-exam-tick', '* * * * *', 'select public.live_tick()');
  end if;
end $$;

-- ---------- Yönetici: yüklenen soruları görüntüle / düzenle ----------
-- Sorular, kitapçık anahtarıyla birlikte (görseller şifreli kitapçıkta; yöneticinin tarayıcısı açar).
-- Düzenleme kayıt kapanana (10:00) kadar: kaydetme live_admin_set_questions + live_admin_set_booklet ile.
create or replace function public.live_admin_questions(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare e public.live_exams;
begin
  perform public.live_require_admin();
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  return json_build_object(
    'exam', public.live_exam_json(e),
    'editable', e.status in ('draft', 'scheduled') and public.live_clock() < e.reg_closes_at,
    'booklet', case when e.booklet_path is null then null
                    else json_build_object('path', e.booklet_path, 'key', e.booklet_key, 'sha', e.booklet_sha) end,
    'kit_downloads', (select count(distinct v.user_id) from public.live_events v where v.exam_id = p_exam and v.kind = 'kit_download'),
    'kit_stale', (select count(distinct v.user_id) from public.live_events v where v.exam_id = p_exam and v.kind = 'kit_download'
                    and not exists (select 1 from public.live_events w where w.exam_id = p_exam and w.user_id = v.user_id
                                      and w.kind = 'kit_download' and w.detail->>'sha' = e.booklet_sha)),
    'questions', (select coalesce(json_agg(json_build_object(
        'no', q.no, 'bolum', q.bolum, 'ders', q.ders, 'konu', q.konu, 'stem', q.stem, 'options', q.options,
        'answer', q.answer, 'explanation', q.explanation, 'image', q.image) order by q.no), '[]'::json)
      from public.live_questions q where q.exam_id = p_exam));
end;
$$;
revoke all on function public.live_admin_questions(uuid) from public, anon;
grant execute on function public.live_admin_questions(uuid) to authenticated;

-- ============================================================
-- Kayıt olana kitapçık: kayıtlı kullanıcı, kayıt olduğu andan itibaren soru kitapçığını
-- (filigranlı PDF) ve optik formunu indirebilir. Deneme başına kapatılabilir (early_kit = false
-- → eskisi gibi kitapçık pazar 10:00'da iner). Not: açıkken sorular sınavdan önce görülebilir.
-- ============================================================
alter table public.live_exams add column if not exists early_kit boolean not null default true;

create or replace function public.live_exam_json(e public.live_exams)
returns json language sql stable as $$
  select json_build_object(
    'id', e.id, 'track', e.track, 'title', e.title, 'status', e.status,
    'reg_closes_at', e.reg_closes_at, 'starts_at', e.starts_at, 'entry_closes_at', e.entry_closes_at,
    'ends_at', e.ends_at, 'late_sync_until', e.late_sync_until, 'ranking_at', e.ranking_at,
    'capacity', e.capacity, 'question_count', e.question_count, 'extra_minutes', e.extra_minutes,
    'finalized', e.finalized_at is not null, 'cancel_reason', e.cancel_reason,
    'optic_until', e.ranking_at, 'early_kit', e.early_kit, 'has_booklet', e.booklet_path is not null,
    'booklet_sha', e.booklet_sha)
$$;

-- Kitapçık dosyası: kayıtlı kullanıcı; early_kit kapalıysa kayıt kapandıktan sonra.
create or replace function public.live_can_read_object(p_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare eid uuid;
begin
  if p_name !~ '^booklets/[0-9a-f-]{36}\.bin$' then return false; end if;
  eid := substring(p_name from 'booklets/([0-9a-f-]{36})\.bin')::uuid;
  if public.live_is_admin() then return true; end if;
  return exists (select 1 from public.live_exams e join public.live_registrations r on r.exam_id = e.id
                 where e.id = eid and e.deleted_at is null and r.user_id = auth.uid() and r.status = 'registered'
                   and (e.early_kit or public.live_clock() >= e.reg_closes_at));
end;
$$;
revoke all on function public.live_can_read_object(text) from public, anon;
grant execute on function public.live_can_read_object(text) to authenticated;

-- Kâğıt seti: kitapçık yolu + anahtar (PDF'i öğrencinin cihazı üretir, adı ve e-postası filigranlı).
-- Her indirme kaydedilir; yönetici soruları sonradan değiştirirse kaç kişinin eski kitapçıkta kaldığını görür.
create or replace function public.live_kit(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  uid uuid := public.live_require_user();
  e public.live_exams;
  t timestamptz := public.live_clock();
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status = 'cancelled' then perform public.live_err('cancelled', 'Bu deneme iptal edildi.'); end if;
  if e.status <> 'scheduled' or t >= e.ends_at then perform public.live_err('ended', 'Sınav sona erdi.'); end if;
  if not exists (select 1 from public.live_registrations where exam_id = p_exam and user_id = uid and status = 'registered') then
    perform public.live_err('not_registered', 'Kitapçığı indirmek için denemeye kayıtlı olmalısın.');
  end if;
  if not e.early_kit and t < e.reg_closes_at then
    perform public.live_err('too_early', format('Kitapçık %s''da açılır.', to_char(e.reg_closes_at at time zone 'Europe/Istanbul', 'HH24:MI')));
  end if;
  if e.booklet_path is null then perform public.live_err('no_booklet', 'Kitapçık henüz hazır değil; biraz sonra tekrar dene.'); end if;
  if not exists (select 1 from public.live_events where exam_id = p_exam and user_id = uid and kind = 'kit_download' and detail->>'sha' = e.booklet_sha) then
    insert into public.live_events (exam_id, user_id, kind, detail) values (p_exam, uid, 'kit_download', jsonb_build_object('sha', e.booklet_sha));
  end if;
  return json_build_object('path', e.booklet_path, 'key', e.booklet_key, 'sha', e.booklet_sha, 'exam', public.live_exam_json(e));
end;
$$;
revoke all on function public.live_kit(uuid) from public, anon;
grant execute on function public.live_kit(uuid) to authenticated;

-- Yönetici: erken kitapçığı aç / kapat
create or replace function public.live_admin_set_early_kit(p_exam uuid, p_on boolean)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams;
begin
  update public.live_exams set early_kit = coalesce(p_on, true), updated_at = public.live_clock()
   where id = p_exam and deleted_at is null and status in ('draft', 'scheduled') returning * into e;
  if e.id is null then perform public.live_err('locked', 'Bu denemede değiştirilemez.'); end if;
  insert into public.live_events (exam_id, user_id, kind, detail) values (p_exam, uid, 'admin_early_kit', jsonb_build_object('on', e.early_kit));
  return public.live_exam_json(e);
end;
$$;
revoke all on function public.live_admin_set_early_kit(uuid, boolean) from public, anon;
grant execute on function public.live_admin_set_early_kit(uuid, boolean) to authenticated;
