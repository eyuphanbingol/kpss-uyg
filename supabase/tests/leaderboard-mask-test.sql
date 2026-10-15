-- Sıralama ad gizleme testleri (patch-leaderboard-mask.sql). admin-panel-test.sql'den sonra aynı veritabanında çalışır.
\set ON_ERROR_STOP on
\pset format unaligned
\pset tuples_only on

select t_ok(public.mask_name('Eyüphan Bingöl') = 'Ey**', 'ad soyad → ilk iki harf + **');
select t_ok(public.mask_name('  Öz  ') = 'Öz**', 'Türkçe harfler ve boşluklar');
select t_ok(public.mask_name('A') = 'A**', 'tek harflik ad');
select t_ok(public.mask_name(null) = 'Öğ**' and public.mask_name('') = 'Öğ**', 'boş ad');
select t_ok(public.mask_name(public.mask_name('Mehmet Yılmaz')) = 'Me**', 'iki kez maskelemek aynı sonucu verir');

select set_config('request.jwt.claims', '{"role":"service_role"}', false);
insert into public.leaderboard_weekly (user_id, week_start, nickname, questions) values
  ('00000000-0000-4000-8000-000000000001', (date_trunc('week', timezone('Europe/Istanbul', now())))::date, 'Ayşe Kaya', 120),
  ('00000000-0000-4000-8000-000000000002', (date_trunc('week', timezone('Europe/Istanbul', now())))::date, 'Mehmet Yılmaz', 90)
on conflict (user_id, week_start) do update set nickname = excluded.nickname, questions = excluded.questions;

set role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', false);
select t_ok((select count(*) from public.leaderboard_public where nickname in ('Ay**', 'Me**')) = 2, 'ziyaretçi yalnız maskeli adları görür');
select t_ok(not exists (select 1 from public.leaderboard_public where nickname like '%Kaya%' or nickname like '%Yılmaz%'), 'tam ad görünmez');
select t_ok(not exists (select 1 from public.leaderboard_public where is_me), 'ziyaretçide is_me yok');
select t_err('select nickname from public.leaderboard_weekly', '*', 'ham tablo ziyaretçiye kapalı');
reset role;

set role authenticated;
select t_as('00000000-0000-4000-8000-000000000001');
select t_ok((select nickname from public.leaderboard_public where is_me) = 'Ay**', 'öğrenci kendi satırını is_me ile bulur');
select t_ok((select count(*) from public.leaderboard_public where is_me) = 1, 'yalnız bir satır is_me');
select t_ok(not exists (select 1 from public.leaderboard_weekly where user_id <> auth.uid()), 'ham tabloda başkasının satırı okunamaz');
reset role;

do $$
begin
  if to_regclass('public.live_cohort') is not null then
    raise notice 'ok  canlı deneme tablosu yok sayılmadı';
  end if;
end $$;

select 'TÜM SIRALAMA GİZLEME TESTLERİ GEÇTİ';
