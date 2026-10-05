-- CANLI DENEME · PARÇA 8 / 8
-- Supabase SQL Editor'da 1'den 8'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

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
    'live_admin_cancel(uuid, text)', 'live_admin_unlock(uuid, uuid)', 'live_admin_stats(uuid)'] loop
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
