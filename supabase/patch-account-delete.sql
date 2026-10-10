-- Hesap silme. Supabase SQL Editor'da bir kez çalıştır (tekrar çalıştırmak zararsız).
--
-- 1) auth.users'a bağlı bütün yabancı anahtarlar "kullanıcı silinince ne olacak" kuralı kazanır.
--    Kural olmayan anahtarlar (referrals.owner, instructor_groups.owner, app_announcements.created_by)
--    Supabase panelinde "Database error deleting user" hatasına yol açıyordu.
--      · created_by / updated_by / reviewed_by sütunları → SET NULL (içerik kalır, yazan boşalır)
--      · diğerleri (owner, user_id …)                    → CASCADE (kullanıcının kaydı silinir)
-- 2) auth.users'a bağlı olmayan kullanıcı kayıtları (canlı deneme tabloları, eğitmen grubu üyeliği)
--    kullanıcı silinince tetikleyiciyle temizlenir.
-- 3) public.delete_my_account(): giriş yapmış kullanıcı kendi hesabını kalıcı olarak siler
--    (web: js/app.jsx DeleteAccountDialog, mobil: mobile/src/screens/BenScreen.js).
--    Yönetici hesabı uygulamadan silinemez; security_audit'e iz bırakılır.

-- ---------- 1) yabancı anahtarlara silme kuralı ----------
do $$
declare
  r record;
  rule text;
begin
  for r in
    select c.conname, n.nspname, t.relname, a.attname, c.confdeltype
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    where c.contype = 'f'
      and c.confrelid = 'auth.users'::regclass
      and n.nspname = 'public'
      and array_length(c.conkey, 1) = 1
  loop
    rule := case when r.attname in ('created_by', 'updated_by', 'reviewed_by', 'decided_by') then 'set null' else 'cascade' end;
    -- confdeltype: a = no action, r = restrict, c = cascade, n = set null
    if (rule = 'cascade' and r.confdeltype = 'c') or (rule = 'set null' and r.confdeltype = 'n') then
      continue;
    end if;
    execute format('alter table %I.%I drop constraint %I', r.nspname, r.relname, r.conname);
    execute format('alter table %I.%I add constraint %I foreign key (%I) references auth.users(id) on delete %s',
      r.nspname, r.relname, r.conname, r.attname, rule);
    raise notice '%.%.% → on delete %', r.nspname, r.relname, r.attname, rule;
  end loop;
end $$;

-- ---------- 2) bağlantısız kullanıcı kayıtlarını temizle ----------
-- Canlı deneme tablolarındaki silme yasağına hesap silme istisnası (patch-live-exam.sql ile aynı tanım)
-- Tek istisna: hesap silinirken o kullanıcının kendi satırları (supabase/patch-account-delete.sql,
-- on_auth_user_deleted bu işlem içinde atanly.user_purge = 'on' yapar). Kullanıcılar bu tablolara
-- doğrudan yazamadığı için bayrak dışarıdan kullanılamaz.
create or replace function public.live_no_delete()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'DELETE' and coalesce(current_setting('atanly.user_purge', true), '') = 'on' then
    return old;
  end if;
  raise exception 'Canlı deneme verisi silinemez (%). Gerekirse yumuşak silme kullan.', TG_TABLE_NAME
    using errcode = 'P0001';
end;
$$;

create or replace function public.on_auth_user_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  t text;
begin
  perform set_config('atanly.user_purge', 'on', true);
  foreach t in array array['live_answers', 'live_attempts', 'live_results', 'live_registrations', 'live_events', 'instructor_group_members']
  loop
    if to_regclass('public.' || t) is not null then
      execute format('delete from public.%I where user_id = $1', t) using old.id;
    end if;
  end loop;
  perform set_config('atanly.user_purge', 'off', true);
  return old;
end;
$$;

revoke all on function public.on_auth_user_deleted() from public, anon, authenticated;

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute function public.on_auth_user_deleted();

-- ---------- 3) kullanıcının kendi hesabını silmesi ----------
create or replace function public.delete_my_account()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  r text;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select role into r from public.student_states where user_id = uid;
  if r = 'admin' then
    raise exception 'admin_account' using errcode = '42501',
      hint = 'Yönetici hesabı uygulamadan silinemez; önce yöneticiliği kaldır.';
  end if;
  insert into public.security_audit (actor, action, target, ok, detail)
  values (uid, 'delete_my_account', uid, true, 'kullanıcı kendi hesabını sildi');
  delete from auth.users where id = uid;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
