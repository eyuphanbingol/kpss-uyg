-- Canlı denemeyi aç + bildirim (patch-live-open.sql) senaryo testleri (yerel PostgreSQL).
-- Çalıştır: scripts/test-live-exam-sql.sh. pg_net yerine net.http_post taklidi istekleri net.calls'a yazar.
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

create or replace function public.t_as(u text, at text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', u, false);
  perform set_config('test.now', at, false);
end $$;
grant execute on function public.t_as(text, text) to authenticated;

-- pg_net taklidi
create schema if not exists net;
create table if not exists net.calls (id serial primary key, url text, body jsonb, headers jsonb);
create or replace function net.http_post(url text, body jsonb default '{}'::jsonb, params jsonb default '{}'::jsonb,
  headers jsonb default '{}'::jsonb, timeout_milliseconds int default 5000)
returns bigint language plpgsql as $$
declare i bigint;
begin
  insert into net.calls (url, body, headers) values (url, body, headers) returning id into i;
  return i;
end $$;

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

-- ---------- ödeme ayarı ----------
select t_ok((select enabled and not live_paywall from public.monet_settings where id = 1), 'kilitler reklamla açık, canlı deneme ücretsiz');

set role authenticated;

-- ---------- bildirim adresi kaydı ----------
select t_as('', '2026-11-30 12:00+03');
select t_err($$select push_register('ExponentPushToken[zz]', 'android', 'lisans')$$, 'auth', 'girişsiz kayıt olmaz');
select t_as('00000000-0000-4000-8000-000000000001', '2026-11-30 12:00+03');
select t_err($$select push_register('https://kotu.example/x', 'android', 'lisans')$$, 'bad_token', 'geçersiz adres reddedilir');
select t_ok((push_register('ExponentPushToken[aaa1]', 'android', 'lisans')->>'ok')::boolean, 'lisans telefonu kaydolur');
select t_ok((push_register('ExponentPushToken[aaa1]', 'android', 'lisans')->>'ok')::boolean, 'aynı adres tekrar kaydolur (çift satır yok)');
select t_err($$select count(*) from public.push_tokens$$, '*', 'tablo doğrudan okunamaz');
select t_as('00000000-0000-4000-8000-000000000002', '2026-11-30 12:00+03');
select push_register('ExpoPushToken[bbb2]', 'android', 'onlisans');
select t_as('00000000-0000-4000-8000-000000000003', '2026-11-30 12:00+03');
select push_register('ExponentPushToken[ccc3]', 'ios', null);
select t_as('00000000-0000-4000-8000-000000000004', '2026-11-30 12:00+03');
select push_register('ExponentPushToken[d' || g || ']', 'android', 'lisans') from generate_series(1, 12) g;
select t_ok((push_unregister('ExponentPushToken[aaa1]')->>'ok')::boolean, 'başkasının adresini silemez (sessizce)');

reset role;
select t_ok((select count(*) from public.push_tokens) = 13, '1 + 1 + 1 + 10 adres');
select t_ok((select count(*) from public.push_tokens where user_id = '00000000-0000-4000-8000-000000000004') = 10, 'hesap başına en fazla 10 cihaz');
select t_ok(not exists (select 1 from public.push_tokens where token in ('ExponentPushToken[d1]', 'ExponentPushToken[d2]')), 'en eski cihazlar düşer');
select t_ok((select user_id from public.push_tokens where token = 'ExponentPushToken[aaa1]') = '00000000-0000-4000-8000-000000000001', 'adres sahibinde kalır');
set role authenticated;

-- ---------- yetki ----------
select t_as('00000000-0000-4000-8000-000000000001', '2026-11-30 12:00+03');
select t_err($$select live_admin_open('00000000-0000-4000-8000-00000000ffff')$$, 'forbidden', 'öğrenci denemeyi açamaz');
select t_err($$select live_admin_notify('00000000-0000-4000-8000-00000000ffff')$$, 'forbidden', 'öğrenci bildirim yollayamaz');
select t_err($$select live_push_open('00000000-0000-4000-8000-00000000ffff')$$, '*', 'iç gönderim fonksiyonu kapalı');

-- ---------- yönetici: taslak hazırlanır, kullanıcıda görünmez ----------
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-11-30 12:00+03');
select set_config('t.exam', (live_admin_save_exam('{"title":"Kasım Denemesi","day":"2026-12-06","track":"lisans"}')->>'id'), false);
select live_admin_set_questions(current_setting('t.exam')::uuid,
  (select jsonb_agg(jsonb_build_object('no', g, 'bolum', case when g <= 60 then 'GY' else 'GK' end, 'ders', case when g <= 60 then 'Türkçe' else 'Tarih' end,
     'konu', 'Konu', 'stem', 'Soru ' || g, 'options', jsonb_build_array('a','b','c','d','e'), 'answer', 'B')) from generate_series(1, 120) g));
select t_as('00000000-0000-4000-8000-000000000001', '2026-11-30 12:00+03');
select t_ok(live_dashboard('lisans')->'exam' is null or json_typeof(live_dashboard('lisans')->'exam') = 'null', 'taslak deneme kullanıcıda görünmez');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-11-30 12:00+03');
select t_err(format('select live_admin_open(%L)', current_setting('t.exam')), 'incomplete', 'kitapçıksız açılmaz');
reset role;
select t_ok((select count(*) from net.calls) = 0, 'açılmayınca bildirim gitmez');
set role authenticated;
select live_admin_set_booklet(current_setting('t.exam')::uuid, 'booklets/' || current_setting('t.exam') || '.bin', repeat('ab', 32), 'sha');

-- ---------- Denemeyi aç ----------
select set_config('t.r', live_admin_open(current_setting('t.exam')::uuid)::text, false);
select t_ok((current_setting('t.r')::json->'exam'->>'status') = 'scheduled', 'deneme kayda açıldı');
select t_ok((current_setting('t.r')::json->'push'->>'sent')::int = 12, 'lisans (1 + 10) ve kulvarı bilinmeyen (1) telefona gider, önlisansa gitmez');
reset role;
select t_ok((select count(*) from net.calls) = 1 and (select url from net.calls limit 1) = 'https://exp.host/--/api/v2/push/send', 'Expo servisine tek istek');
select t_ok((select bool_and(m->'data'->>'type' = 'live_open' and m->>'channelId' = 'default' and m->>'title' = 'Canlı deneme kaydı açıldı')
               from net.calls c, jsonb_array_elements(c.body) m), 'mesaj başlığı, kanal ve veri');
select t_ok((select bool_and(position('6 Aralık Pazar 10:15' in m->>'body') > 0) from net.calls c, jsonb_array_elements(c.body) m), 'metinde İstanbul saatiyle gün ve saat');
select t_ok(not exists (select 1 from net.calls c, jsonb_array_elements(c.body) m where m->>'to' = 'ExpoPushToken[bbb2]'), 'önlisans adresi listede yok');
select t_ok((select count(*) from public.app_announcements where body like 'Canlı deneme kaydı açıldı:%'
              and expires_at = (select reg_closes_at from public.live_exams where id = current_setting('t.exam')::uuid)) = 1, 'web duyurusu kayıt kapanınca biter');
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000001', '2026-11-30 12:01+03');
select t_ok(live_dashboard('lisans')->'exam'->>'id' = current_setting('t.exam'), 'açılan deneme kullanıcıda görünür');

-- ---------- yeniden bildirim ----------
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-11-30 12:05+03');
select t_err(format('select live_admin_notify(%L)', current_setting('t.exam')), 'too_soon', '10 dakika dolmadan yeniden gönderilmez');
select t_err(format('select live_admin_open(%L)', current_setting('t.exam')), 'too_soon', 'açık denemede "aç" da yalnız bildirimi yineler');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-11-30 12:11+03');
select t_ok((live_admin_notify(current_setting('t.exam')::uuid)->>'sent')::int = 12, '10 dakika sonra yeniden gönderilir');
select t_ok((live_admin_push_count('lisans')->>'track')::int = 12 and (live_admin_push_count(null)->>'total')::int = 13, 'yönetici telefon sayısını görür');
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-12-06 10:01+03');
select t_err(format('select live_admin_notify(%L)', current_setting('t.exam')), 'late', 'kayıt kapanınca bildirim yok');

-- ---------- 100'den fazla telefon: parça parça ----------
reset role;
insert into public.push_tokens (token, user_id, platform, track)
select 'ExponentPushToken[bulk' || g || ']', '00000000-0000-4000-8000-000000000003', 'android', 'onlisans' from generate_series(1, 150) g;
delete from net.calls;
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-11-30 12:00+03');
select set_config('t.exam2', (live_admin_save_exam('{"title":"Önlisans Denemesi","day":"2026-12-06","track":"onlisans"}')->>'id'), false);
select live_admin_set_questions(current_setting('t.exam2')::uuid,
  (select jsonb_agg(jsonb_build_object('no', g, 'bolum', case when g <= 60 then 'GY' else 'GK' end, 'ders', case when g <= 60 then 'Türkçe' else 'Tarih' end,
     'konu', 'Konu', 'stem', 'Soru ' || g, 'options', jsonb_build_array('a','b','c','d','e'), 'answer', 'B')) from generate_series(1, 120) g));
select live_admin_set_booklet(current_setting('t.exam2')::uuid, 'booklets/' || current_setting('t.exam2') || '.bin', repeat('cd', 32), 'sha');
select t_ok((live_admin_open(current_setting('t.exam2')::uuid)->'push'->>'sent')::int = 152, '150 + 1 önlisans + 1 bilinmeyen');
reset role;
select t_ok((select count(*) from net.calls) = 2 and (select max(jsonb_array_length(body)) from net.calls) = 100, '100''lük parçalar');

-- ---------- pg_net yoksa ----------
drop function net.http_post(text, jsonb, jsonb, jsonb, int);
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1', '2026-11-30 12:30+03');
select t_ok((live_admin_notify(current_setting('t.exam2')::uuid)->>'reason') = 'no_pg_net', 'pg_net yoksa hata vermez, sebebini döner');

-- ---------- hesap silinince adresleri de gider ----------
reset role;
delete from auth.users where id = '00000000-0000-4000-8000-000000000004';
select t_ok(not exists (select 1 from public.push_tokens where user_id = '00000000-0000-4000-8000-000000000004'), 'hesap silinince telefon adresleri silinir');

\echo TÜM CANLI DENEME AÇMA / BİLDİRİM TESTLERİ GEÇTİ
