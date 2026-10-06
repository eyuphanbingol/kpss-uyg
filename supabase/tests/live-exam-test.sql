-- Canlı deneme senaryo testleri (yerel PostgreSQL). Çalıştır: scripts/test-live-exam-sql.sh
-- Saat test.now ayarından okunur; pazar sabahı dakika dakika yürütülür.
\set ON_ERROR_STOP on
\pset format unaligned
\pset tuples_only on

create or replace function public.live_clock()
returns timestamptz language sql stable as $$
  select coalesce(nullif(current_setting('test.now', true), '')::timestamptz, now())
$$;

create or replace function public.t_ok(cond boolean, msg text) returns void language plpgsql as $$
begin
  if cond is distinct from true then raise exception 'TEST BAŞARISIZ: %', msg; end if;
  raise notice 'ok  %', msg;
end $$;

-- sql çalıştırılır; beklenen hata kodu (HINT) gelmezse test düşer
create or replace function public.t_err(q text, code text, msg text) returns void language plpgsql as $$
declare h text; m text;
begin
  begin
    execute q;
  exception when others then
    get stacked diagnostics h = pg_exception_hint, m = message_text;
    if coalesce(h, '') = code or (code = '*' ) or position(code in m) > 0 then
      raise notice 'ok  % (%)', msg, code; return;
    end if;
    raise exception 'TEST BAŞARISIZ: % — beklenen %, gelen % / %', msg, code, h, m;
  end;
  raise exception 'TEST BAŞARISIZ: % — hata bekleniyordu (%)', msg, code;
end $$;
grant execute on function public.t_ok(boolean, text) to authenticated;
grant execute on function public.t_err(text, text, text) to authenticated;

-- kullanıcılar
insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-0000000000a1', 'admin@x'),
  ('00000000-0000-4000-8000-000000000001', 'u1@x'),
  ('00000000-0000-4000-8000-000000000002', 'u2@x'),
  ('00000000-0000-4000-8000-000000000003', 'u3@x'),
  ('00000000-0000-4000-8000-000000000004', 'u4@x');
insert into public.student_states (user_id, nickname) values
  ('00000000-0000-4000-8000-0000000000a1', 'Yonetici'),
  ('00000000-0000-4000-8000-000000000001', 'Ayse'),
  ('00000000-0000-4000-8000-000000000002', 'Mehmet'),
  ('00000000-0000-4000-8000-000000000003', 'Zeynep'),
  ('00000000-0000-4000-8000-000000000004', 'Can');
select set_config('request.jwt.claim.role', 'service_role', false);
update public.student_states set role = 'admin' where user_id = '00000000-0000-4000-8000-0000000000a1';
select set_config('request.jwt.claim.role', '', false);

-- yardımcı: oturum ve saat
create or replace function public.t_as(u text, at text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', u, false);
  perform set_config('test.now', at, false);
end $$;
grant execute on function public.t_as(text, text) to authenticated;

set role authenticated;

-- ---------- 1. admin: deneme oluştur ----------
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-05 12:00+03');
select t_err($$select live_admin_save_exam('{"title":"x","day":"2026-10-11"}')$$, 'forbidden', 'öğrenci deneme oluşturamaz');
select t_err($$select * from live_questions$$, 'permission denied', 'tabloya doğrudan erişim yok');

select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-05 12:00+03');
select set_config('t.exam', (live_admin_save_exam('{"title":"Deneme 1","day":"2026-10-11","capacity":3}')->>'id'), false);
select t_ok((select (live_admin_save_exam(jsonb_build_object('id', current_setting('t.exam')))->>'starts_at')::timestamptz = '2026-10-11 10:15+03'), 'pazar 10:15 Europe/Istanbul');

-- eksik soru seti reddedilir
select t_ok((live_admin_set_questions(current_setting('t.exam')::uuid,
  (select jsonb_agg(jsonb_build_object('no', g, 'bolum', case when g <= 60 then 'GY' else 'GK' end, 'ders', 'Tarih', 'konu', 'Atatürk İlkeleri',
     'stem', 'Soru ' || g, 'options', jsonb_build_array('a','b','c','d','e'), 'answer', 'A'))
   from generate_series(1, 119) g))->>'ok')::boolean = false, '119 soru reddedilir');

-- 120 soru: doğru cevap sırayla A..E
select t_ok((live_admin_set_questions(current_setting('t.exam')::uuid,
  (select jsonb_agg(jsonb_build_object('no', g, 'bolum', case when g <= 60 then 'GY' else 'GK' end,
     'ders', case when g <= 30 then 'Türkçe' when g <= 60 then 'Matematik' when g <= 87 then 'Tarih' when g <= 105 then 'Coğrafya' when g <= 114 then 'Vatandaşlık' else 'Güncel Bilgiler' end,
     'konu', 'Konu ' || (g % 7), 'stem', 'Soru ' || g, 'options', jsonb_build_array('a','b','c','d','e'),
     'answer', substr('ABCDE', ((g - 1) % 5) + 1, 1), 'explanation', 'Çözüm ' || g))
   from generate_series(1, 120) g))->>'ok')::boolean, '120 soru yüklenir');
select t_err($$select live_admin_publish(current_setting('t.exam')::uuid)$$, 'incomplete', 'kitapçıksız yayınlanmaz');
select live_admin_set_booklet(current_setting('t.exam')::uuid, 'booklets/' || current_setting('t.exam') || '.bin', repeat('ab', 32), 'sha');
select t_ok(live_admin_publish(current_setting('t.exam')::uuid)->>'status' = 'scheduled', 'yayınlandı');

-- ---------- 2. kayıt, kontenjan, yedek ----------
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-08 20:00+03');
select t_ok(live_register(current_setting('t.exam')::uuid)->>'status' = 'registered', 'u1 kayıtlı');
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-08 20:01+03');
select t_ok(live_register(current_setting('t.exam')::uuid)->>'status' = 'registered', 'u2 kayıtlı');
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-08 20:02+03');
select t_ok(live_register(current_setting('t.exam')::uuid)->>'status' = 'registered', 'u3 kayıtlı');
select t_as('00000000-0000-4000-8000-000000000004', '2026-10-08 20:03+03');
select t_ok(live_register(current_setting('t.exam')::uuid)->>'status' = 'waitlist', 'u4 kontenjan dolu: yedek');
select t_ok((live_dashboard('lisans')->'registration'->>'waitlist_pos')::int = 1, 'yedek sırası 1');
select t_err($$select live_booklet(current_setting('t.exam')::uuid)$$, 'not_registered', 'yedekteki kitapçık alamaz');
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-09 09:00+03');
select live_unregister(current_setting('t.exam')::uuid);
select t_as('00000000-0000-4000-8000-000000000004', '2026-10-09 09:01+03');
select t_ok(live_dashboard('lisans')->'registration'->>'status' = 'registered', 'kayıt silinince yedek otomatik yükselir');
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-11 10:00:01+03');
select t_err($$select live_register(current_setting('t.exam')::uuid)$$, 'reg_closed', '10:00 sonrası kayıt yok');
-- u3'ü yeniden ekle (admin) ki giriş penceresini test edelim
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-11 10:00:02+03');
select live_admin_set_registration(current_setting('t.exam')::uuid, '00000000-0000-4000-8000-000000000003', 'registered');

-- ---------- 3. kitapçık ve giriş saatleri ----------
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-11 09:59:59+03');
select t_err($$select live_booklet(current_setting('t.exam')::uuid)$$, 'too_early', 'kitapçık 10:00 öncesi inmez');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-11 10:00:00+03');
select t_ok(live_booklet(current_setting('t.exam')::uuid)->>'path' like 'booklets/%', 'kitapçık 10:00''da iner');
select t_ok(live_can_read_object('booklets/' || current_setting('t.exam') || '.bin'), 'storage: kayıtlı okur');
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-11 09:30+03');
select t_ok(not live_can_read_object('booklets/' || current_setting('t.exam') || '.bin'), 'storage: 10:00 öncesi okuyamaz');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-11 10:14:59+03');
select t_err($$select live_enter(current_setting('t.exam')::uuid, 'device-one-xx')$$, 'too_early', '10:15 öncesi giriş yok, anahtar yok');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-11 10:15:00+03');
select t_ok(live_enter(current_setting('t.exam')::uuid, 'device-one-xx')->>'key' = repeat('ab', 32), '10:15 giriş: anahtar verilir');

-- u1: 100 doğru, 10 yanlış, 10 boş
select t_ok((live_save(current_setting('t.exam')::uuid, 'device-one-xx',
  (select jsonb_agg(jsonb_build_object('no', g, 'ms', 30000,
     'c', case when g <= 100 then substr('ABCDE', ((g - 1) % 5) + 1, 1)
               when g <= 110 then substr('ABCDE', ((g) % 5) + 1, 1) else null end))
   from generate_series(1, 120) g))->>'saved')::int = 120, 'u1 120 cevap kaydedildi');

-- ---------- 4. cihaz değişimi ve kilit ----------
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-11 10:20+03');
select live_enter(current_setting('t.exam')::uuid, 'device-two-aa');
select live_save(current_setting('t.exam')::uuid, 'device-two-aa', '[{"no":1,"c":"A"},{"no":2,"c":"A"},{"no":3,"c":"C"}]');
select t_ok((live_enter(current_setting('t.exam')::uuid, 'device-two-bb')->>'switches')::int = 1, '1. cihaz değişimi');
select t_err($$select live_save(current_setting('t.exam')::uuid, 'device-two-aa', '[{"no":4,"c":"D"}]')$$, 'device_replaced', 'eski cihaz düşer');
select t_ok((live_enter(current_setting('t.exam')::uuid, 'device-two-cc')->>'switches')::int = 2, '2. cihaz değişimi');
select t_ok(live_enter(current_setting('t.exam')::uuid, 'device-two-dd')->>'error' = 'locked', '3. değişimde kilit');
select t_err($$select live_enter(current_setting('t.exam')::uuid, 'device-two-cc')$$, 'locked', 'kilitliyken giriş yok');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-11 10:30+03');
select t_ok((live_admin_monitor(current_setting('t.exam')::uuid)->>'locked')::int = 1, 'admin kilidi görür');
select live_admin_unlock(current_setting('t.exam')::uuid, '00000000-0000-4000-8000-000000000002');
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-11 10:31+03');
select t_ok((live_enter(current_setting('t.exam')::uuid, 'device-two-cc')->>'answers')::jsonb @> '[{"no":3,"c":"C"}]', 'kilit açılınca cevaplar yerinde');

-- ---------- 5. giriş penceresi ----------
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-11 10:45:00+03');
select t_err($$select live_enter(current_setting('t.exam')::uuid, 'device-three')$$, 'entry_closed', '10:45 sonrası ilk giriş yok');
select t_as('00000000-0000-4000-8000-000000000004', '2026-10-11 10:44:59+03');
select live_enter(current_setting('t.exam')::uuid, 'device-four-x');
select live_save(current_setting('t.exam')::uuid, 'device-four-x', '[{"no":1,"c":"A"},{"no":2,"c":"B"}]');

-- ---------- 6. acil durum: süre uzatma ----------
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-11 11:00+03');
select t_ok((live_admin_extend(current_setting('t.exam')::uuid, 5)->>'ends_at')::timestamptz = '2026-10-11 12:30+03', 'süre 5 dk uzadı (bitiş 12:30)');

-- ---------- 7. bitiş, geç senkron, kişisel sonuç ----------
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-11 12:29+03');
select t_err($$select live_result(current_setting('t.exam')::uuid)$$, 'not_yet', 'bitişten önce sonuç yok');
select t_err($$select live_review(current_setting('t.exam')::uuid)$$, 'not_yet', 'bitişten önce çözüm yok');
-- u2 bağlantısı kopmuş: bitişten 1 dk sonra gecikmiş cevaplar kabul
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-11 12:31+03');
select t_ok((live_save(current_setting('t.exam')::uuid, 'device-two-cc', '[{"no":4,"c":"D"}]')->>'saved')::int = 1, 'geç senkron (2 dk içinde) kabul');
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-11 12:32:01+03');
select t_err($$select live_save(current_setting('t.exam')::uuid, 'device-two-cc', '[{"no":5,"c":"E"}]')$$, 'ended', 'geç senkron süresi dolunca kabul yok');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-11 12:30:30+03');
select t_ok((live_result(current_setting('t.exam')::uuid)->'result'->>'net')::numeric = 97.5, 'u1 net 97,5 (100 D, 10 Y, 10 B)');
select t_err($$select live_save(current_setting('t.exam')::uuid, 'device-one-xx', '[{"no":120,"c":"E"}]')$$, 'submitted', 'sonucu açan cevap değiştiremez');
select t_ok(json_array_length(live_review(current_setting('t.exam')::uuid)->'questions') = 120, 'u1 çözümleri açıldı');
select t_ok((live_review(current_setting('t.exam')::uuid)->'questions'->0->>'stat') is null, 'kesinleşmeden soru istatistiği yok');
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-11 12:30:30+03');
select t_err($$select live_review(current_setting('t.exam')::uuid)$$, 'not_yet', 'kâğıdı açık olan çözümü göremez');
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-11 12:31+03');
select t_err($$select live_result(current_setting('t.exam')::uuid)$$, 'not_participant', 'katılmayan sonuç göremez');

-- ---------- 8. otomatik kapanış ve kesinleşme ----------
select t_as('00000000-0000-4000-8000-000000000004', '2026-10-11 12:33+03');
select live_dashboard('lisans'); -- tick: geç senkron süresi dolan kâğıtlar kapanır
reset role;
select t_ok((select count(*) from live_attempts where exam_id = current_setting('t.exam')::uuid and closed_at is null) = 0, 'tarayıcı kapalı olsa da tüm kâğıtlar kapandı');
select t_ok((select finalized_at is null from live_exams where id = current_setting('t.exam')::uuid), '12:45''ten önce kesinleşmez');
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000004', '2026-10-11 12:45+03');
select t_ok((live_result(current_setting('t.exam')::uuid)->'result'->>'rank')::int = 3, 'u4 sıralaması 3 (12:45 kesinleşme)');
select t_ok((live_result(current_setting('t.exam')::uuid)->'cohort'->>'participants')::int = 3, 'katılımcı 3 (u3 giremedi)');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-11 12:46+03');
select t_ok((live_result(current_setting('t.exam')::uuid)->'result'->>'top_pct')::numeric = 33.3, 'u1 ilk %33,3');
select t_ok((live_review(current_setting('t.exam')::uuid)->'questions'->0->'stat'->>'correct')::int = 3, 'soru 1: 3 kişi doğru');
select t_ok(json_array_length(live_review(current_setting('t.exam')::uuid)->'most_wrong') = 10, 'en çok yanlış 10 soru');
select t_ok(json_array_length(live_history()) = 1, 'arşivde 1 deneme');
select t_ok((live_dashboard('lisans')->'last_result'->>'net')::numeric = 97.5, 'Bugün kartı son sonucu gösterir');
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-11 13:00+03');
select t_ok((live_dashboard('lisans')->'missed'->>'id') = current_setting('t.exam'), 'katılmayana "katılmadın" kartı');
select t_ok((live_public_summary(current_setting('t.exam')::uuid)->>'participants')::int = 3, 'genel sonuç özeti açık');

-- ---------- 9. silinmezlik ve arşiv ----------
reset role;
select t_err($$delete from live_answers where exam_id = current_setting('t.exam')::uuid$$, 'silinemez', 'postgres rolü bile cevap silemez');
select t_err($$truncate live_results$$, 'silinemez', 'truncate engelli');
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-12 09:00+03');
select t_err($$select live_admin_discard_draft(current_setting('t.exam')::uuid)$$, 'locked', 'bitmiş deneme kaldırılamaz');
select set_config('t.exam2', (live_admin_save_exam('{"title":"Deneme 2","day":"2026-10-18"}')->>'id'), false);
select live_admin_set_questions(current_setting('t.exam2')::uuid,
  (select jsonb_agg(jsonb_build_object('no', g, 'bolum', case when g <= 60 then 'GY' else 'GK' end, 'ders', 'Tarih', 'konu', 'Atatürk İlkeleri',
     'stem', 'Soru ' || g, 'options', jsonb_build_array('a','b','c','d','e'), 'answer', 'B')) from generate_series(1, 120) g));
select live_admin_set_booklet(current_setting('t.exam2')::uuid, 'booklets/' || current_setting('t.exam2') || '.bin', repeat('cd', 32), 'sha');
select live_admin_publish(current_setting('t.exam2')::uuid);
reset role;
select t_ok((select status from live_exams where id = current_setting('t.exam')::uuid) = 'archived', 'yeni deneme yayınlanınca eski arşive geçti');
select t_ok((select count(*) from live_answers where exam_id = current_setting('t.exam')::uuid) > 0, 'arşivdeki cevaplar yerinde');
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-12 10:00+03');
select t_ok(json_array_length(live_history()) = 1, 'arşivlenen deneme geçmişte kalır');
select t_ok((live_dashboard('lisans')->'exam'->>'id') = current_setting('t.exam2'), 'pano yeni denemeyi gösterir');
select t_ok((live_dashboard('lisans')->'last_result'->>'exam_id') = current_setting('t.exam'), 'sonuç kartı yeni sonuca kadar kalır');

-- ---------- 10. iptal ----------
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-13 10:00+03');
select t_ok(live_admin_cancel(current_setting('t.exam2')::uuid, 'Test iptali')->>'status' = 'cancelled', 'acil iptal');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-18 10:20+03');
select t_err($$select live_register(current_setting('t.exam2')::uuid)$$, 'not_found', 'iptal edilen denemeye kayıt yok');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-13 10:01+03');
select t_ok((live_dashboard('lisans')->>'cancelled') is null, 'kayıtsız olana iptal kartı çıkmaz');
reset role;
select set_config('request.jwt.claim.role', 'service_role', false);
insert into live_registrations (exam_id, user_id, status) values (current_setting('t.exam2')::uuid, '00000000-0000-4000-8000-000000000002', 'registered');
select set_config('request.jwt.claim.role', '', false);
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-14 10:00+03');
select t_ok((live_dashboard('lisans')->'cancelled'->>'cancel_reason') = 'Test iptali', 'kayıtlıya iptal nedeni gösterilir');

-- ---------- 11. kâğıtta çözme ve optik gönderimi (2. aşama) ----------
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-19 09:00+03');
select set_config('t.exam3', (live_admin_save_exam('{"title":"Deneme 3","day":"2026-10-25"}')->>'id'), false);
select live_admin_set_questions(current_setting('t.exam3')::uuid,
  (select jsonb_agg(jsonb_build_object('no', g, 'bolum', case when g <= 60 then 'GY' else 'GK' end, 'ders', 'Tarih', 'konu', 'Atatürk İlkeleri',
     'stem', 'Soru ' || g, 'options', jsonb_build_array('a','b','c','d','e'), 'answer', 'B')) from generate_series(1, 120) g));
select live_admin_set_booklet(current_setting('t.exam3')::uuid, 'booklets/' || current_setting('t.exam3') || '.bin', repeat('ef', 32), 'sha');
select live_admin_publish(current_setting('t.exam3')::uuid);
select t_ok((live_dashboard('lisans')->'exam'->>'optic_until')::timestamptz = '2026-10-25 12:40+03', 'optik okutma 12:40''a kadar');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-20 10:00+03'); select live_register(current_setting('t.exam3')::uuid);
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-20 10:00+03'); select live_register(current_setting('t.exam3')::uuid);
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-20 10:00+03'); select live_register(current_setting('t.exam3')::uuid);
select t_as('00000000-0000-4000-8000-000000000004', '2026-10-20 10:00+03'); select live_register(current_setting('t.exam3')::uuid);

select t_as('00000000-0000-4000-8000-000000000001', '2026-10-25 10:20+03');
select t_ok(live_enter(current_setting('t.exam3')::uuid, 'paper-one-pc', 'paper')->>'key' = repeat('ef', 32), 'kâğıt girişi: kitapçık anahtarı verilir');
select t_ok(live_dashboard('lisans')->'attempt'->>'mode' = 'paper', 'pano kâğıt modunu bilir');
select t_err($$select live_save(current_setting('t.exam3')::uuid, 'paper-one-pc', '[{"no":1,"c":"A"}]')$$, 'paper_mode', 'kâğıtta çözen cihazdan cevap yollayamaz');
select t_err($$select live_submit(current_setting('t.exam3')::uuid, 'paper-one-pc')$$, 'paper_mode', 'kâğıtta çözen cihaz teslimi yapamaz');
select t_err($$select live_enter(current_setting('t.exam3')::uuid, 'paper-one-pc', 'device')$$, 'mode_locked', 'kâğıttan cihaza geçilemez');
select t_ok((live_enter(current_setting('t.exam3')::uuid, 'paper-one-phone', 'paper')->>'switches')::int = 0, 'kâğıt modunda başka cihaz (telefon) kilit saymaz');
select t_as('00000000-0000-4000-8000-000000000004', '2026-10-25 10:21+03');
select live_enter(current_setting('t.exam3')::uuid, 'device-four-y');
select t_err($$select live_enter(current_setting('t.exam3')::uuid, 'device-four-y', 'paper')$$, 'mode_locked', 'cihazdan kâğıda geçilemez');
select live_save(current_setting('t.exam3')::uuid, 'device-four-y',
  (select jsonb_agg(jsonb_build_object('no', g, 'c', case when g <= 50 then 'B' else 'C' end)) from generate_series(1, 120) g));
select t_err($$select live_submit_optic(current_setting('t.exam3')::uuid, repeat('B', 120))$$, 'device_mode', 'cihazda çözen optik gönderemez');
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-25 10:22+03');
select live_enter(current_setting('t.exam3')::uuid, 'paper-two-pc', 'paper');
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-25 10:23+03');
select live_enter(current_setting('t.exam3')::uuid, 'paper-three-pc', 'paper');

-- u1 optik: 100 doğru, 10 yanlış, 10 boş
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-25 11:30+03');
select t_err($$select live_submit_optic(current_setting('t.exam3')::uuid, repeat('B', 119))$$, 'bad_input', '119 cevap reddedilir');
select t_err($$select live_submit_optic(current_setting('t.exam3')::uuid, repeat('B', 119) || 'X')$$, 'bad_input', 'geçersiz harf reddedilir');
select t_err($$select live_submit_optic(current_setting('t.exam3')::uuid, repeat('B', 120),
  jsonb_build_object('qr', 'ATN|1|' || current_setting('t.exam3') || '|00000000-0000-4000-8000-000000000002|lisans'))$$, 'wrong_form', 'başkasının formu reddedilir');
select t_ok((live_submit_optic(current_setting('t.exam3')::uuid, repeat('B', 100) || repeat('A', 10) || repeat('-', 10),
  jsonb_build_object('source', 'optic', 'qr', 'ATN|1|' || current_setting('t.exam3') || '|00000000-0000-4000-8000-000000000001|lisans',
                     'uncertain', 2, 'double', 0))->>'submitted')::boolean, 'u1 optiği gönderildi');
select t_err($$select live_submit_optic(current_setting('t.exam3')::uuid, repeat('B', 120))$$, 'submitted', 'gönderilen kâğıt değişmez');
select t_err($$select live_result(current_setting('t.exam3')::uuid)$$, 'not_yet', 'erken gönderen bile 12:25 öncesi sonuç görmez');
select t_err($$select live_review(current_setting('t.exam3')::uuid)$$, 'not_yet', 'erken gönderen 12:25 öncesi çözüm görmez');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-25 12:26+03');
select t_ok((live_result(current_setting('t.exam3')::uuid)->'result'->>'net')::numeric = 97.5, 'u1 kâğıt sonucu 97,5');
select t_ok(live_result(current_setting('t.exam3')::uuid)->'result'->>'mode' = 'paper', 'sonuçta çözme biçimi: kâğıt');
select t_ok(json_array_length(live_review(current_setting('t.exam3')::uuid)->'questions') = 120, 'onaylayan kâğıt katılımcısı çözümleri görür');
reset role;
select t_ok((select count(*) from live_answers where exam_id = current_setting('t.exam3')::uuid
  and user_id = '00000000-0000-4000-8000-000000000001' and source = 'optic') = 120, 'cevap kaynağı: optik');
set role authenticated;
-- u2 okutmadı: 12:25–12:40 arası sonuç yerine "optiğini okut"
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-25 12:30+03');
select t_err($$select live_result(current_setting('t.exam3')::uuid)$$, 'optic_pending', 'okutmayana sonuç yerine optik hatırlatması');
select t_err($$select live_review(current_setting('t.exam3')::uuid)$$, 'no_optic', 'okutmayan çözümleri göremez');
select t_ok((live_optic_report(current_setting('t.exam3')::uuid, 'fail', '{"code":"markers"}')->>'ok')::boolean, 'okuma hatası kaydedildi');
select t_err($$select live_optic_report(current_setting('t.exam3')::uuid, 'hack', '{}')$$, 'bad_input', 'geçersiz kayıt türü');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-25 12:31+03');
select t_ok(json_array_length(live_admin_monitor(current_setting('t.exam3')::uuid)->'paper') = 3, 'admin kâğıt katılımcılarını görür');
select t_ok((select (x->>'fails')::int from json_array_elements(live_admin_monitor(current_setting('t.exam3')::uuid)->'paper') x
             where x->>'user_id' = '00000000-0000-4000-8000-000000000002') = 1, 'admin okutma sorununu görür');
select t_err($$select live_admin_paper(current_setting('t.exam3')::uuid, '00000000-0000-4000-8000-000000000001', repeat('B', 120), 'deneme')$$,
  'submitted', 'gönderilmiş kâğıdı admin bile değiştiremez');
select t_err($$select live_admin_paper(current_setting('t.exam3')::uuid, '00000000-0000-4000-8000-000000000004', repeat('B', 120), 'deneme')$$,
  'not_paper', 'cihazda çözen için elle giriş yok');
-- 12:40: okutma kapanır
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-25 12:40+03');
select t_err($$select live_submit_optic(current_setting('t.exam3')::uuid, repeat('B', 120))$$, 'optic_closed', '12:40''ta okutma kapanır');
select t_as('00000000-0000-4000-8000-000000000002', '2026-10-25 12:41+03');
select t_err($$select live_result(current_setting('t.exam3')::uuid)$$, 'no_optic', 'okutmayanın sonucu yok');
select t_ok((live_public_summary(current_setting('t.exam3')::uuid)->>'participants')::int = 2, 'sıralamada 2 kişi (okutmayanlar yok)');
select t_ok((live_dashboard('lisans')->>'missed_no_optic')::boolean, 'okutmayana "optiğin gelmedi" kartı');
-- admin elle giriş (kayıtlı) sonrası sıralama yeniden
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-25 12:50+03');
select t_err($$select live_admin_paper(current_setting('t.exam3')::uuid, '00000000-0000-4000-8000-000000000003', repeat('B', 120), 'kendim')$$,
  'forbidden', 'öğrenci elle giriş yapamaz');
select t_err($$select live_rank(current_setting('t.exam3')::uuid)$$, 'permission denied', 'öğrenci sıralamayı yeniden hesaplatamaz');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-25 12:50+03');
select t_err($$select live_admin_paper(current_setting('t.exam3')::uuid, '00000000-0000-4000-8000-000000000003', repeat('B', 120), '')$$,
  'bad_input', 'elle girişte neden zorunlu');
select t_ok((live_admin_paper(current_setting('t.exam3')::uuid, '00000000-0000-4000-8000-000000000003', repeat('B', 110) || repeat('-', 10),
  'Kamera okumadı, form fotoğrafından girildi')->>'reranked')::boolean, 'admin elle girdi, sıralama yeniden hesaplandı');
select t_as('00000000-0000-4000-8000-000000000003', '2026-10-25 12:51+03');
select t_ok((live_result(current_setting('t.exam3')::uuid)->'result'->>'rank')::int = 1, 'u3 elle girişle 1. sırada (110 net)');
select t_ok((live_result(current_setting('t.exam3')::uuid)->'cohort'->>'participants')::int = 3, 'kohort 3 kişiye güncellendi');
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-25 12:52+03');
select t_ok((live_result(current_setting('t.exam3')::uuid)->'result'->>'rank')::int = 2, 'u1 sırası 2''ye kaydı');
reset role;
select t_ok((select count(*) from live_events where exam_id = current_setting('t.exam3')::uuid and kind = 'admin_paper') = 1, 'elle giriş denetim kaydında');
select t_ok((select close_reason from live_attempts where exam_id = current_setting('t.exam3')::uuid
  and user_id = '00000000-0000-4000-8000-000000000002') = 'no_optic', 'u2 kâğıdı sonuçsuz kapandı');

-- ---------- 12. kulvarlar ve kohort analizi (3. aşama) ----------
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-26 09:00+03');
select set_config('t.exam4', (live_admin_save_exam('{"title":"Lisans 4","day":"2026-11-01","track":"lisans"}')->>'id'), false);
select set_config('t.exam5', (live_admin_save_exam('{"title":"Önlisans 1","day":"2026-11-01","track":"onlisans"}')->>'id'), false);
select live_admin_set_questions(current_setting('t.exam' || x)::uuid,
  (select jsonb_agg(jsonb_build_object('no', g, 'bolum', case when g <= 60 then 'GY' else 'GK' end, 'ders', case when g <= 60 then 'Türkçe' else 'Tarih' end,
     'konu', 'Konu', 'stem', 'Soru ' || g, 'options', jsonb_build_array('a','b','c','d','e'), 'answer', 'B')) from generate_series(1, 120) g))
  from (values ('4'), ('5')) v(x);
select live_admin_set_booklet(current_setting('t.exam' || x)::uuid, 'booklets/' || current_setting('t.exam' || x) || '.bin', repeat('12', 32), 'sha') from (values ('4'), ('5')) v(x);
select t_ok(live_admin_publish(current_setting('t.exam5')::uuid)->>'track' = 'onlisans', 'önlisans denemesi yayınlandı');
reset role;
select t_ok((select status from live_exams where id = current_setting('t.exam3')::uuid) = 'finished', 'başka kulvarın yayını lisans denemesini arşive atmaz');
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-10-26 09:01+03');
select live_admin_publish(current_setting('t.exam4')::uuid);
reset role;
select t_ok((select status from live_exams where id = current_setting('t.exam3')::uuid) = 'archived', 'aynı kulvarın yeni denemesi eskisini arşive atar');
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000001', '2026-10-27 10:00+03');
select t_ok(live_dashboard('lisans')->'exam'->>'id' = current_setting('t.exam4'), 'lisans öğrencisi lisans denemesini görür');
select t_ok(live_dashboard('onlisans')->'exam'->>'id' = current_setting('t.exam5'), 'önlisans öğrencisi önlisans denemesini görür');
select t_ok(live_dashboard('ortaogretim')->>'exam' is null, 'ortaöğretimde deneme yok');

-- dört kişi lisans denemesinde: 100, 99, 97, 96 doğru (yanlış yok, gerisi boş)
select t_as(u, '2026-10-27 10:00+03'), live_register(current_setting('t.exam4')::uuid)
  from (values ('00000000-0000-4000-8000-000000000001'), ('00000000-0000-4000-8000-000000000002'),
               ('00000000-0000-4000-8000-000000000003'), ('00000000-0000-4000-8000-000000000004')) v(u);
select t_as(u, '2026-11-01 10:20+03'), live_enter(current_setting('t.exam4')::uuid, 'dev-' || right(u, 4) || '-four'),
       live_save(current_setting('t.exam4')::uuid, 'dev-' || right(u, 4) || '-four',
         (select jsonb_agg(jsonb_build_object('no', g, 'c', case when g <= k then 'B' else null end, 'ms', case when g <= 60 then 20000 else 40000 end))
          from generate_series(1, 120) g))
  from (values ('00000000-0000-4000-8000-000000000001', 100), ('00000000-0000-4000-8000-000000000002', 99),
               ('00000000-0000-4000-8000-000000000003', 97), ('00000000-0000-4000-8000-000000000004', 96)) v(u, k);
select t_as('00000000-0000-4000-8000-000000000001', '2026-11-01 12:30+03');
select t_ok((live_result(current_setting('t.exam4')::uuid)->>'peers') is null, 'kesinleşmeden benzer seviye yok');
select t_as('00000000-0000-4000-8000-000000000001', '2026-11-01 12:41+03');
select set_config('t.r', live_result(current_setting('t.exam4')::uuid)::text, false);
select t_ok((current_setting('t.r')::json->'peers'->>'n')::int = 3 and (current_setting('t.r')::json->'peers'->>'net')::numeric = 97.33,
  'benzer seviye (±5 net): 3 kişi, ortalama 97,33');
select t_ok((current_setting('t.r')::json->'peers'->'by_ders'->>'Türkçe')::numeric = 60, 'benzer seviyenin ders netleri');
select t_ok((select sum((x->>1)::int) from json_array_elements(current_setting('t.r')::json->'cohort'->'analysis'->'hist') x) = 4, 'dağılım: 4 kişi');
select t_ok((current_setting('t.r')::json->'cohort'->'analysis'->'pct'->>'p50')::numeric = 98, 'medyan net 98');
select t_ok((current_setting('t.r')::json->'cohort'->'analysis'->>'top10_n')::int = 1 and (current_setting('t.r')::json->'cohort'->'analysis'->>'top10_net')::numeric = 100, 'ilk %10: 1 kişi, 100 net');
select t_ok((current_setting('t.r')::json->'cohort'->'analysis'->'by_mode'->'device'->>'n')::int = 4, 'cihaz/kâğıt karşılaştırması');
select t_ok((current_setting('t.r')::json->'cohort'->'analysis'->'time_by_ders'->>'Tarih')::int = 40000, 'ders başına ortalama süre');
select t_ok((live_history()->0->>'cohort_avg')::numeric = 98, 'geçmişte katılan ortalaması');
select t_ok((live_history()->0->>'cohort_p50')::numeric = 98, 'geçmişte medyan');
-- yalnızca 2 benzer: benzer seviye gizli (kişisel sonuç sızmasın)
select t_as('00000000-0000-4000-8000-000000000003', '2026-11-01 12:42+03');
select t_ok((live_result(current_setting('t.exam4')::uuid)->'peers'->>'n')::int = 3, 'u3 için de 3 benzer');
select t_err($$select live_admin_trends('lisans')$$, 'forbidden', 'öğrenci kohort karşılaştırmasını göremez');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-11-01 13:00+03');
select t_ok(json_array_length(live_admin_trends('lisans')) >= 2, 'yönetici: lisans denemeleri yan yana');
select t_ok((select x->>'id' from json_array_elements(live_admin_trends('lisans')) x order by x->>'starts_at' desc limit 1) = current_setting('t.exam4'), 'en yeni deneme sonda');
select t_ok(json_array_length(live_admin_trends('onlisans')) = 1 and (live_admin_trends('onlisans')->0->>'participants')::int = 0, 'önlisans: katılımcısız deneme de kesinleşir (0 kişi)');

reset role;
select 'TÜM TESTLER GEÇTİ';
