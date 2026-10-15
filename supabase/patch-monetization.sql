-- Gelir modeli altyapısı. SQL Editor'da bir kez çalıştır; tekrar çalıştırmak güvenlidir.
-- Hiçbir şeyi açmaz: monet_settings'teki anahtarlar kapalı başlar. Açmak için (mağaza ürünleri hazır olunca):
--   update public.monet_settings set enabled = true;        -- içerik kilitleri + premium teklifleri
--   update public.monet_settings set live_paywall = true;   -- canlı deneme: ilki ücretsiz, sonrası 50 TL
--
-- Ödemeler yalnız Google Play / App Store'dan alınır. RevenueCat satın almayı doğrular; sunucu fonksiyonları
-- (supabase/functions/store-sync, store-webhook) sonucu store_entitlements ve live_credits tablolarına yazar.
-- Ödüllü reklam ödülü AdMob sunucu doğrulamasıyla (supabase/functions/admob-ssv) ad_unlocks'a yazılır.
-- Böylece telefonda alınan premium / açılan kilit web'de de geçerlidir.
--
-- Ücretsiz deneme kötüye kullanımı: ilk deneme hesap başına ücretsizdir. Hesap silinip yeniden açılınca
-- tekrar ücretsiz alınmasın diye ücretsiz hak kullanılırken e-posta, cihaz ve IP'nin TUZLU ÖZETİ (geri
-- çevrilemez) monet_free_claims'e yazılır ve hesap silinse de saklanır (gizlilik metninde açıklanır).
-- Aynı IP yalnız ek işarettir: aynı internetteki aile/yurt engellenmesin diye 30 günde ip_free_limit kadar
-- ücretsiz deneme o IP'den alınabilir.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------- ayarlar (herkes okuyabilir; istemciler kilitlerin açık olup olmadığını buradan öğrenir) ----------
create table if not exists public.monet_settings (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default false,
  live_paywall boolean not null default false,
  free_count int not null default 3 check (free_count between 0 and 50),
  ad_unlock_hours int not null default 24 check (ad_unlock_hours between 1 and 720),
  ip_free_limit int not null default 3 check (ip_free_limit between 1 and 1000),
  updated_at timestamptz not null default now()
);
insert into public.monet_settings (id) values (1) on conflict (id) do nothing;
alter table public.monet_settings enable row level security;
revoke all on public.monet_settings from public, anon, authenticated;
grant select on public.monet_settings to anon, authenticated;
drop policy if exists "monet settings read" on public.monet_settings;
create policy "monet settings read" on public.monet_settings for select using (true);

-- ---------- gizli tuz (kimse okuyamaz) ----------
create table if not exists public.monet_secrets (k text primary key, v text not null);
alter table public.monet_secrets enable row level security;
revoke all on public.monet_secrets from public, anon, authenticated;
-- pgcrypto Supabase'de "extensions" şemasında, bazı kurulumlarda "public"te: ikisi de arama yolunda
do $$
begin
  perform set_config('search_path', 'public, extensions', true);
  insert into public.monet_secrets (k, v) values ('hash_salt', encode(gen_random_bytes(32), 'hex'))
    on conflict (k) do nothing;
end $$;

create or replace function public.monet_hash(p text)
returns text language sql stable security definer set search_path = public, extensions as $$
  select case when coalesce(btrim(p), '') = '' then null
    else encode(digest((select v from public.monet_secrets where k = 'hash_salt') || ':' || lower(btrim(p)), 'sha256'), 'hex') end
$$;
revoke all on function public.monet_hash(text) from public, anon, authenticated;

-- İsteği yapan istemcinin IP'si (PostgREST başlıklarından). Bulunamazsa null.
create or replace function public.monet_client_ip()
returns text language plpgsql stable as $$
declare h json; v text;
begin
  begin
    h := nullif(current_setting('request.headers', true), '')::json;
  exception when others then
    return null;
  end;
  v := coalesce(h->>'cf-connecting-ip', split_part(coalesce(h->>'x-forwarded-for', ''), ',', 1), h->>'x-real-ip');
  return nullif(btrim(v), '');
end;
$$;
revoke all on function public.monet_client_ip() from public, anon, authenticated;

-- ---------- tablolar (istemci doğrudan erişemez; yalnız aşağıdaki fonksiyonlar ve sunucu) ----------
create table if not exists public.monet_devices (
  user_id uuid not null references auth.users(id) on delete cascade,
  device_hash text not null,
  platform text,
  last_seen timestamptz not null default now(),
  primary key (user_id, device_hash)
);

-- Bilerek auth.users'a bağlı değil: hesap silinince de kalır (yalnız özetler, kişisel veri yok).
create table if not exists public.monet_free_claims (
  id bigserial primary key,
  user_id uuid not null,
  exam_id uuid,
  email_hash text,
  device_hashes text[] not null default '{}',
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists monet_free_claims_user on public.monet_free_claims (user_id);
create index if not exists monet_free_claims_email on public.monet_free_claims (email_hash);
create index if not exists monet_free_claims_ip on public.monet_free_claims (ip_hash, created_at);
create index if not exists monet_free_claims_dev on public.monet_free_claims using gin (device_hashes);
create index if not exists monet_free_claims_at on public.monet_free_claims (created_at);

create table if not exists public.store_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  premium_until timestamptz,
  product text,
  store text,
  will_renew boolean,
  updated_at timestamptz not null default now()
);

create table if not exists public.live_credits (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  store_tx text not null unique,
  product text,
  store text,
  purchased_at timestamptz,
  used_exam uuid,
  used_at timestamptz
);
create index if not exists live_credits_user on public.live_credits (user_id) where used_exam is null;

create table if not exists public.ad_unlocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null check (item_key ~ '^[a-z0-9:_.\-]{1,120}$'),
  until timestamptz not null,
  primary key (user_id, item_key)
);

create table if not exists public.ad_rewards (
  tx text primary key,
  user_id uuid,
  item_key text,
  at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['monet_devices', 'monet_free_claims', 'store_entitlements', 'live_credits', 'ad_unlocks', 'ad_rewards'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;
grant usage, select on all sequences in schema public to service_role;

-- ---------- yardımcılar ----------
create or replace function public.monet_settings_row()
returns public.monet_settings language sql stable security definer set search_path = public as $$
  select * from public.monet_settings where id = 1
$$;
revoke all on function public.monet_settings_row() from public, anon, authenticated;

-- Premium bitiş: mağaza aboneliği ya da yönetici panelinden verilen premium (süresizse 'infinity').
create or replace function public.monet_premium(p_user uuid, out until timestamptz, out source text)
language plpgsql stable security definer set search_path = public as $$
declare s_until timestamptz; a_until timestamptz; prem boolean; raw text;
begin
  select premium_until into s_until from public.store_entitlements where user_id = p_user;
  select s.premium, s.payload#>>'{userProfile,premiumUntil}' into prem, raw from public.student_states s where s.user_id = p_user;
  if coalesce(prem, false) then
    begin
      a_until := coalesce(nullif(raw, '')::timestamptz, 'infinity'::timestamptz);
    exception when others then
      a_until := 'infinity'::timestamptz;
    end;
  end if;
  if s_until is not null and s_until > now() and (a_until is null or s_until >= a_until) then
    until := s_until; source := 'store';
  elsif a_until is not null and a_until > now() then
    until := a_until; source := 'admin';
  else
    until := null; source := null;
  end if;
end;
$$;
revoke all on function public.monet_premium(uuid) from public, anon, authenticated;

-- Ücretsiz deneme hakkı var mı? (hesap, e-posta, cihaz, IP)
create or replace function public.monet_free_check(p_user uuid, out ok boolean, out reason text,
  out email_hash text, out device_hashes text[], out ip_hash text)
language plpgsql stable security definer set search_path = public as $$
declare lim int := (select ip_free_limit from public.monet_settings where id = 1);
begin
  email_hash := public.monet_hash((select email from auth.users where id = p_user));
  device_hashes := coalesce((select array_agg(device_hash) from public.monet_devices where user_id = p_user), '{}');
  ip_hash := public.monet_hash(public.monet_client_ip());
  ok := false;
  if exists (select 1 from public.monet_free_claims where user_id = p_user) then reason := 'account'; return; end if;
  if email_hash is not null and exists (select 1 from public.monet_free_claims where monet_free_claims.email_hash = monet_free_check.email_hash) then
    reason := 'email'; return;
  end if;
  if cardinality(device_hashes) > 0 and exists (select 1 from public.monet_free_claims where monet_free_claims.device_hashes && monet_free_check.device_hashes) then
    reason := 'device'; return;
  end if;
  if ip_hash is not null and (select count(*) from public.monet_free_claims c
      where c.ip_hash = monet_free_check.ip_hash and c.created_at > now() - interval '30 days') >= coalesce(lim, 3) then
    reason := 'ip'; return;
  end if;
  ok := true; reason := null;
end;
$$;
revoke all on function public.monet_free_check(uuid) from public, anon, authenticated;

-- ---------- istemci fonksiyonları ----------
-- Cihaz kimliği uygulama açılınca bildirilir (yalnız özeti saklanır).
create or replace function public.monet_register_device(p_device text, p_platform text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Giriş yapmalısın.' using errcode = 'P0001', hint = 'auth'; end if;
  if length(coalesce(p_device, '')) < 8 or length(p_device) > 200 then
    raise exception 'Geçersiz cihaz.' using errcode = 'P0001', hint = 'bad_device';
  end if;
  insert into public.monet_devices (user_id, device_hash, platform, last_seen)
  values (uid, public.monet_hash(p_device), left(p_platform, 16), now())
  on conflict (user_id, device_hash) do update set last_seen = now(), platform = excluded.platform;
  -- bir hesapta en çok 10 cihaz tutulur (en eskiler silinir)
  delete from public.monet_devices d where d.user_id = uid and d.device_hash in (
    select device_hash from public.monet_devices where user_id = uid order by last_seen desc offset 10);
  return jsonb_build_object('ok', true);
end;
$$;
revoke all on function public.monet_register_device(text, text) from public, anon;
grant execute on function public.monet_register_device(text, text) to authenticated;

-- Tek çağrıda bütün durum: ayarlar, premium, canlı deneme hakkı, reklamla açılan kilitler.
create or replace function public.monet_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  st public.monet_settings := public.monet_settings_row();
  pu timestamptz; ps text;
  fc record;
  credits int := 0;
  unlocks jsonb := '{}'::jsonb;
  settings jsonb;
begin
  settings := jsonb_build_object('enabled', st.enabled, 'live_paywall', st.live_paywall, 'free_count', st.free_count,
    'ad_unlock_hours', st.ad_unlock_hours);
  if uid is null then
    return jsonb_build_object('settings', settings, 'now', now());
  end if;
  select until, source into pu, ps from public.monet_premium(uid);
  select * into fc from public.monet_free_check(uid);
  select count(*) into credits from public.live_credits where user_id = uid and used_exam is null;
  select coalesce(jsonb_object_agg(item_key, until), '{}'::jsonb) into unlocks
    from public.ad_unlocks where user_id = uid and until > now();
  return jsonb_build_object(
    'settings', settings,
    'premium', pu is not null,
    'premium_until', case when pu = 'infinity'::timestamptz then null else pu end,
    'premium_source', ps,
    'live', jsonb_build_object('free', fc.ok, 'free_reason', fc.reason, 'credits', credits),
    'ad_unlocks', unlocks,
    'now', now());
end;
$$;
revoke all on function public.monet_status() from public;
grant execute on function public.monet_status() to anon, authenticated;

-- ---------- canlı deneme kaydında ödeme kontrolü ----------
-- live_register / live_admin_set_registration hangisi çağrılırsa çağrılsın kayıt satırına uygulanır
-- (fonksiyonlar yeniden kurulsa da geçerli kalır). live_paywall kapalıyken hiçbir şey yapmaz.
create or replace function public.monet_live_registration_gate()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  st public.monet_settings := public.monet_settings_row();
  fc record;
  cid bigint;
  role_claim text := coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '');
begin
  if not coalesce(st.live_paywall, false) then return new; end if;
  if new.status not in ('registered', 'waitlist') then return new; end if;
  -- gizlilik politikası: özetler en fazla 2 yıl saklanır
  delete from public.monet_free_claims where created_at < now() - interval '2 years';
  if TG_OP = 'UPDATE' and old.status in ('registered', 'waitlist', 'blocked') then return new; end if;
  if role_claim = 'service_role' or public.live_is_admin() then return new; end if;
  -- bu deneme için daha önce hak kullanıldıysa (kaydını silip yeniden alan) tekrar ücret alınmaz
  if exists (select 1 from public.monet_free_claims where user_id = new.user_id and exam_id = new.exam_id)
     or exists (select 1 from public.live_credits where user_id = new.user_id and used_exam = new.exam_id) then
    return new;
  end if;
  select * into fc from public.monet_free_check(new.user_id);
  if fc.ok then
    insert into public.monet_free_claims (user_id, exam_id, email_hash, device_hashes, ip_hash)
    values (new.user_id, new.exam_id, fc.email_hash, fc.device_hashes, fc.ip_hash);
    return new;
  end if;
  select id into cid from public.live_credits where user_id = new.user_id and used_exam is null
    order by purchased_at nulls first, id limit 1 for update skip locked;
  if cid is not null then
    update public.live_credits set used_exam = new.exam_id, used_at = now() where id = cid;
    return new;
  end if;
  raise exception 'Bu deneme için kayıt hakkın yok. Uygulamadan deneme kaydı satın alabilirsin.'
    using errcode = 'P0001', hint = 'payment_required';
end;
$$;
revoke all on function public.monet_live_registration_gate() from public, anon, authenticated;

do $$
begin
  if to_regclass('public.live_registrations') is null then return; end if;
  drop trigger if exists monet_live_registration_gate on public.live_registrations;
  create trigger monet_live_registration_gate before insert or update of status on public.live_registrations
    for each row execute function public.monet_live_registration_gate();
end $$;

-- ---------- yönetici ----------
create or replace function public.admin_monet_settings(p jsonb default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare st public.monet_settings;
begin
  if not public.live_is_admin() then raise exception 'Yetki yok.' using errcode = '42501', hint = 'forbidden'; end if;
  if p is not null then
    update public.monet_settings set
      enabled = coalesce((p->>'enabled')::boolean, enabled),
      live_paywall = coalesce((p->>'live_paywall')::boolean, live_paywall),
      free_count = coalesce((p->>'free_count')::int, free_count),
      ad_unlock_hours = coalesce((p->>'ad_unlock_hours')::int, ad_unlock_hours),
      ip_free_limit = coalesce((p->>'ip_free_limit')::int, ip_free_limit),
      updated_at = now()
    where id = 1;
  end if;
  select * into st from public.monet_settings where id = 1;
  return jsonb_build_object('enabled', st.enabled, 'live_paywall', st.live_paywall, 'free_count', st.free_count,
    'ad_unlock_hours', st.ad_unlock_hours, 'ip_free_limit', st.ip_free_limit,
    'store_premium', (select count(*) from public.store_entitlements where premium_until > now()),
    'credits_sold', (select count(*) from public.live_credits),
    'free_claims', (select count(*) from public.monet_free_claims));
end;
$$;
revoke all on function public.admin_monet_settings(jsonb) from public, anon;
grant execute on function public.admin_monet_settings(jsonb) to authenticated;

-- Kontrol: aşağıdaki sorgu monet_settings satırını (hepsi kapalı) döndürmeli.
select enabled, live_paywall, free_count, ad_unlock_hours from public.monet_settings;
