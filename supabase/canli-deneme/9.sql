-- CANLI DENEME · PARÇA 9 / 9
-- Supabase SQL Editor'da 1'den 9'e SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
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
