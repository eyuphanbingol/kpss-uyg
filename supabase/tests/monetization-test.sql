-- Gelir modeli testleri (patch-monetization.sql). live-exam-test.sql'den sonra aynı veritabanında çalışır
-- (o dosyadaki t_ok/t_err ve denemeler kullanılır). Çalıştır: scripts/test-live-exam-sql.sh
\set ON_ERROR_STOP on
\pset format unaligned
\pset tuples_only on

create or replace function public.t_user(u text, ip text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', u, false);
  perform set_config('request.jwt.claims', json_build_object('sub', u, 'role', 'authenticated')::text, false);
  perform set_config('request.headers', json_build_object('x-forwarded-for', ip || ', 10.0.0.1')::text, false);
end $$;
grant execute on function public.t_user(text, text) to authenticated, anon;
-- live_register gibi security definer: kayıt satırına yazar, tetikleyici çalışır
create or replace function public.t_reg(e text, u text, st text default 'registered') returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into live_registrations (exam_id, user_id, status) values (e::uuid, u::uuid, st)
  on conflict (exam_id, user_id) do update set status = excluded.status;
end $$;
grant execute on function public.t_reg(text, text, text) to authenticated;

-- iki deneme (live-exam-test.sql'in oluşturdukları)
select set_config('t.e1', (select id::text from live_exams order by created_at, id limit 1), false);
select set_config('t.e2', (select id::text from live_exams order by created_at, id offset 1 limit 1), false);
select set_config('t.e3', (select id::text from live_exams order by created_at, id offset 2 limit 1), false);

insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-0000000000b1', 'm1@x'),
  ('00000000-0000-4000-8000-0000000000b2', 'm2@x'),
  ('00000000-0000-4000-8000-0000000000b3', 'm3@x'),
  ('00000000-0000-4000-8000-0000000000b4', 'ayni@x'),
  ('00000000-0000-4000-8000-0000000000c1', 'ip1@x'),
  ('00000000-0000-4000-8000-0000000000c2', 'ip2@x'),
  ('00000000-0000-4000-8000-0000000000c3', 'ip3@x');
insert into public.student_states (user_id, nickname) select id, 'M' from auth.users where email like 'm_@x' or email like 'ip_@x' or email = 'ayni@x';

-- ---------- 1. varsayılan: hepsi kapalı, hiçbir şey değişmez ----------
set role anon;
select t_ok((monet_status()->'settings'->>'enabled')::boolean = false and (monet_status()->'settings'->>'live_paywall')::boolean = false, 'varsayılan: kilitler ve deneme ücreti kapalı');
select t_ok((select count(*) from monet_settings) = 1, 'ziyaretçi ayarları okuyabilir');
select t_err($$select * from monet_secrets$$, 'permission denied', 'gizli tuz okunamaz');
reset role;

set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b1', '1.1.1.1');
select t_reg(current_setting('t.e1'), '00000000-0000-4000-8000-0000000000b1');
reset role;
select t_ok((select count(*) from monet_free_claims) = 0, 'ücret kapalıyken kayıt serbest, hak kullanılmaz');

-- ---------- 2. tablolar istemciye kapalı ----------
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b2', '2.2.2.2');
select t_err($$select * from live_credits$$, 'permission denied', 'kredi tablosu okunamaz');
select t_err($$insert into store_entitlements (user_id, premium_until) values (auth.uid(), now() + interval '1 year')$$, 'permission denied', 'premium kendine yazılamaz');
select t_err($$insert into ad_unlocks (user_id, item_key, until) values (auth.uid(), 'map:x', now() + interval '1 day')$$, 'permission denied', 'reklam kilidi kendine yazılamaz');
select t_err($$select monet_hash('x')$$, 'permission denied', 'özet fonksiyonu çağrılamaz');
select t_err($$select admin_monet_settings('{"live_paywall":true}')$$, 'forbidden', 'öğrenci ayarı değiştiremez');
reset role;

-- yönetici açar
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000a1', '5.5.5.5');
select t_ok((admin_monet_settings('{"live_paywall":true,"ip_free_limit":2}')->>'live_paywall')::boolean, 'yönetici deneme ücretini açar');
reset role;

-- ---------- 3. ilk deneme ücretsiz, ikincisi ödeme ister ----------
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b2', '2.2.2.2');
select monet_register_device('android-id-b2-aaaa', 'android');
select t_ok((monet_status()->'live'->>'free')::boolean, 'yeni hesapta ücretsiz deneme hakkı var');
select t_reg(current_setting('t.e1'), auth.uid()::text);
select t_ok((monet_status()->'live'->>'free')::boolean = false and monet_status()->'live'->>'free_reason' = 'account', 'ücretsiz hak kullanıldı');
select t_err($$select t_reg(current_setting('t.e2'), auth.uid()::text)$$,
  'payment_required', 'ikinci deneme ödeme ister');
reset role;

-- mağaza kredisi (sunucu fonksiyonu yazar)
insert into live_credits (user_id, store_tx, product, store, purchased_at) values ('00000000-0000-4000-8000-0000000000b2', 'GPA.1111', 'deneme_kaydi', 'play_store', now());
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b2', '2.2.2.2');
select t_ok((monet_status()->'live'->>'credits')::int = 1, 'satın alınan kredi görünür');
select t_reg(current_setting('t.e2'), auth.uid()::text);
select t_ok((monet_status()->'live'->>'credits')::int = 0, 'kredi kayıtta kullanıldı');
-- kaydı iptal edip yeniden alınca tekrar ücret yok
select t_reg(current_setting('t.e2'), auth.uid()::text, 'cancelled');
select t_reg(current_setting('t.e2'), auth.uid()::text, 'registered');
select t_ok(true, 'iptal edilip yeniden alınan kayıtta tekrar ücret istenmez');
reset role;

-- ---------- 4. aynı cihazda yeni hesap: ücretsiz hak yok ----------
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b3', '3.3.3.3');
select monet_register_device('iphone-vendor-b3-zzzz', 'ios');
select t_reg(current_setting('t.e1'), auth.uid()::text);
reset role;
delete from auth.users where id = '00000000-0000-4000-8000-0000000000b3';   -- hesap silindi
select t_ok((select count(*) from monet_free_claims where user_id = '00000000-0000-4000-8000-0000000000b3') = 1, 'hesap silinse de özet kalır');
select t_ok((select count(*) from monet_devices where user_id = '00000000-0000-4000-8000-0000000000b3') = 0, 'cihaz kaydı hesapla silinir');
insert into auth.users (id, email) values ('00000000-0000-4000-8000-0000000000b5', 'yeni-adres@x');
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b5', '33.33.33.33');
select monet_register_device('iphone-vendor-b3-zzzz', 'ios');
select t_ok(monet_status()->'live'->>'free_reason' = 'device', 'aynı cihazda yeni hesap: ücretsiz hak yok (cihaz)');
select t_err($$select t_reg(current_setting('t.e1'), auth.uid()::text)$$,
  'payment_required', 'aynı cihazda yeni hesap ödeme ister');
reset role;

-- ---------- 5. aynı e-postayla yeniden kayıt ----------
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b4', '4.4.4.4');
select t_reg(current_setting('t.e1'), auth.uid()::text);
reset role;
delete from auth.users where id = '00000000-0000-4000-8000-0000000000b4';
insert into auth.users (id, email) values ('00000000-0000-4000-8000-0000000000b6', 'AYNI@x');
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b6', '44.44.44.44');
select t_ok(monet_status()->'live'->>'free_reason' = 'email', 'silinen hesabın e-postasıyla yeni hesap: ücretsiz hak yok');
reset role;

-- ---------- 6. aynı IP: 30 günde en çok 2 (aile/yurt engellenmez) ----------
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000c1', '9.9.9.9');
select t_reg(current_setting('t.e1'), auth.uid()::text);
select t_user('00000000-0000-4000-8000-0000000000c2', '9.9.9.9');
select t_ok((monet_status()->'live'->>'free')::boolean, 'aynı IP ikinci kişi: ücretsiz');
select t_reg(current_setting('t.e1'), auth.uid()::text);
select t_user('00000000-0000-4000-8000-0000000000c3', '9.9.9.9');
select t_ok(monet_status()->'live'->>'free_reason' = 'ip', 'aynı IP üçüncü kişi: sınır');
select t_user('00000000-0000-4000-8000-0000000000c3', '8.8.8.8');
select t_ok((monet_status()->'live'->>'free')::boolean, 'başka IP: ücretsiz');
reset role;

-- ---------- 7. yönetici kaydı ödeme sormaz ----------
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000a1', '5.5.5.5');
select t_reg(current_setting('t.e3'), '00000000-0000-4000-8000-0000000000b6');
select t_ok(true, 'yönetici elle kayıt ekler (ödeme sorulmaz)');
reset role;

-- ---------- 8. premium: mağaza ve yönetici ----------
insert into store_entitlements (user_id, premium_until, product, store) values ('00000000-0000-4000-8000-0000000000b2', now() + interval '30 days', 'atanly_premium:aylik', 'play_store');
-- premium sütunu yalnız sunucu rolüyle değişir (protect_student_privileges)
select set_config('request.jwt.claims', '{"role":"service_role"}', false), set_config('request.jwt.claim.role', 'service_role', false);
update student_states set premium = true, payload = '{"userProfile":{"premiumUntil":"2099-01-01T00:00:00Z"}}' where user_id = '00000000-0000-4000-8000-0000000000c1';
update student_states set premium = true, payload = '{}' where user_id = '00000000-0000-4000-8000-0000000000c2';
insert into store_entitlements (user_id, premium_until) values ('00000000-0000-4000-8000-0000000000c3', now() - interval '1 day');
select set_config('request.jwt.claim.role', '', false);
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000b2', '2.2.2.2');
select t_ok((monet_status()->>'premium')::boolean and monet_status()->>'premium_source' = 'store', 'mağaza aboneliği premium yapar');
select t_user('00000000-0000-4000-8000-0000000000c1', '9.9.9.9');
select t_ok((monet_status()->>'premium')::boolean and monet_status()->>'premium_source' = 'admin', 'yönetici premiumu (tarihli) geçerli');
select t_user('00000000-0000-4000-8000-0000000000c2', '9.9.9.9');
select t_ok((monet_status()->>'premium')::boolean and monet_status()->>'premium_until' is null, 'süresiz yönetici premiumu');
select t_user('00000000-0000-4000-8000-0000000000c3', '9.9.9.9');
select t_ok(not (monet_status()->>'premium')::boolean, 'süresi geçen abonelik premium değil');
reset role;

-- ---------- 9. reklamla açılan kilitler ----------
insert into ad_unlocks (user_id, item_key, until) values
  ('00000000-0000-4000-8000-0000000000c3', 'map:gol-tektonik', now() + interval '20 hours'),
  ('00000000-0000-4000-8000-0000000000c3', 'konu:tarih:2', now() - interval '1 hour');
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000c3', '9.9.9.9');
select t_ok(monet_status()->'ad_unlocks' ? 'map:gol-tektonik' and not (monet_status()->'ad_unlocks' ? 'konu:tarih:2'), 'yalnız süresi dolmamış kilitler döner');
select t_err($$select monet_register_device('kisa', 'web')$$, 'bad_device', 'geçersiz cihaz kimliği reddedilir');
reset role;

-- ---------- 10. 2 yıldan eski özetler silinir ----------
insert into monet_free_claims (user_id, email_hash, created_at) values ('00000000-0000-4000-8000-0000000000d1', 'eski', now() - interval '3 years');
set role authenticated;
select t_user('00000000-0000-4000-8000-0000000000c3', '7.7.7.7');
select t_reg(current_setting('t.e2'), auth.uid()::text);
reset role;
select t_ok(not exists (select 1 from monet_free_claims where email_hash = 'eski'), '2 yıldan eski özet silinir');

-- kapatınca deneme yine serbest
update monet_settings set live_paywall = false, ip_free_limit = 3;
select 'TÜM GELİR MODELİ TESTLERİ GEÇTİ';
