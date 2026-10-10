-- Güvenlik sıkılaştırması (Ekim 2026). Supabase SQL Editor'da bir kez çalıştır.
-- Tekrar çalıştırmak zararsızdır; uygulamanın kullandığı hiçbir okuma/yazma kapanmaz.
--
-- Neden: Supabase yeni her tabloya ve view'a anon + authenticated için TÜM yetkileri
-- (INSERT/UPDATE/DELETE/TRUNCATE dahil) otomatik verir. Satır kuralları (RLS) tabloları
-- korur ama:
--   · view'lar sahibinin yetkisiyle çalışır, RLS'i atlar. leaderboard_public üzerinden
--     giriş yapmamış biri bile haftalık sıralamayı SİLEBİLİYOR / puanları değiştirebiliyordu.
--   · TRUNCATE, RLS'e hiç bakmaz.
-- Bu dosya yalnızca gereken yetkileri bırakır.

begin;

-- 1) View'lar: yalnızca okuma ---------------------------------------------------
do $$
begin
  if to_regclass('public.leaderboard_public') is not null then
    revoke all on public.leaderboard_public from public, anon, authenticated;
    grant select on public.leaderboard_public to anon, authenticated;
  end if;
  if to_regclass('public.admin_user_directory') is not null then
    revoke all on public.admin_user_directory from public, anon, authenticated;   -- yalnız service_role
  end if;
end $$;

-- Bundan sonra eklenecek view'lar için de: public şemasındaki her view'dan yazma yetkisini al.
do $$
declare v record;
begin
  for v in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind in ('v', 'm') loop
    execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from public, anon, authenticated', v.relname);
  end loop;
end $$;

-- 2) Tablolar: giriş yapmamış (anon) hiçbir şey yazamaz ---------------------------
do $$
declare t record;
begin
  for t in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind in ('r', 'p') loop
    -- RLS'in kontrol etmediği yetkiler herkesten alınır
    execute format('revoke truncate, references, trigger on public.%I from public, anon, authenticated', t.relname);
    -- anon: tablolara doğrudan erişim yok (duyuru okuma hariç, aşağıda)
    execute format('revoke all on public.%I from anon', t.relname);
  end loop;
end $$;
do $$
begin
  if to_regclass('public.app_announcements') is not null then
    grant select on public.app_announcements to anon;   -- yayımlanmış duyurular (RLS: published = true)
  end if;
  -- Yalnız sunucunun (service_role) yazdığı tablo: istemciye kapalı
  if to_regclass('public.security_audit') is not null then
    revoke all on public.security_audit from public, anon, authenticated;
  end if;
end $$;

-- 3) Tetikleyici fonksiyonları doğrudan çağrılamasın -------------------------------
do $$
begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'protect_student_privileges') then
    execute 'revoke all on function public.protect_student_privileges() from public, anon, authenticated';
  end if;
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'sanitize_student_row') then
    execute 'revoke all on function public.sanitize_student_row() from public, anon, authenticated';
  end if;
end $$;

-- 4) Sıralama tabloları: akla yatkın değer sınırları -------------------------------
-- (NOT VALID: mevcut satırları denetlemez, yalnızca yeni yazılanları; eski veri yayını durdurmaz)
do $$
begin
  if to_regclass('public.leaderboard_weekly') is not null then
    alter table public.leaderboard_weekly drop constraint if exists leaderboard_weekly_sane;
    alter table public.leaderboard_weekly add constraint leaderboard_weekly_sane
      check (questions between 0 and 20000 and char_length(nickname) between 1 and 40) not valid;
  end if;
  if to_regclass('public.exam_ranks') is not null then
    alter table public.exam_ranks drop constraint if exists exam_ranks_sane;
    alter table public.exam_ranks add constraint exam_ranks_sane
      check ((score is null or score between -50 and 200) and char_length(nickname) between 1 and 40) not valid;
  end if;
end $$;

commit;

-- Kontrol (çalıştırdıktan sonra): anon'un yazabildiği tablo/view kalmamalı.
-- select table_name, privilege_type from information_schema.role_table_grants
--  where table_schema = 'public' and grantee = 'anon' order by 1;
--   → yalnızca app_announcements | SELECT ve leaderboard_public | SELECT
