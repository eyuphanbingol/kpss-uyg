-- ============================================================
-- CANLI DENEMEYİ AÇ + TELEFONA BİLDİRİM (ve ödeme ayarı)
-- SQL Editor'da bir kez çalıştır. Tekrar çalıştırmak güvenlidir. Önce patch-live-exam.sql kurulu olmalı.
--
-- 1) Ödemeler kapalı, reklam açık: içerik kilitleri reklamla açılır, canlı deneme ücretsiz.
--    (Uygulamada satın alma zaten kapalı: config monetization.paymentsPaused.)
-- 2) push_tokens: telefonların Expo bildirim adresleri (push_register ile uygulama yazar).
-- 3) live_admin_open: yönetici "Denemeyi aç" der → deneme kayda açılır ve o kulvardaki herkese
--    telefon bildirimi + web duyurusu gider. live_admin_notify: açık denemenin bildirimini yeniden yollar.
--    Yönetici açmadıkça kullanıcılarda canlı deneme kartı görünmez (istemci: js/liveExam.js cardVisible).
--
-- Bildirim gönderimi pg_net ile (Supabase'te hazır; aşağıda açılır). Expo'nun bildirim servisi
-- (exp.host) telefonlara Firebase (FCM) üzerinden ulaştırır; Firebase anahtarı expo.dev'e yüklenmiş olmalı.
-- ============================================================

-- ---------- 1) ödeme ayarı ----------
do $$
begin
  if to_regclass('public.monet_settings') is not null then
    update public.monet_settings set enabled = true, live_paywall = false;
    if not found then
      insert into public.monet_settings (id, enabled, live_paywall) values (1, true, false);
    end if;
  end if;
end $$;

-- ---------- pg_net (sunucudan HTTP isteği) ----------
do $$
begin
  create extension if not exists pg_net;
exception when others then
  raise notice 'pg_net açılamadı (%). Database → Extensions → pg_net''i aç, sonra bu dosyayı yeniden çalıştır.', sqlerrm;
end $$;

-- ---------- 2) bildirim adresleri ----------
create table if not exists public.push_tokens (
  token text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null default 'android' check (platform in ('android', 'ios')),
  track text check (track is null or track in ('lisans', 'onlisans', 'ortaogretim')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists push_tokens_user_idx on public.push_tokens (user_id);
create index if not exists push_tokens_track_idx on public.push_tokens (track);
alter table public.push_tokens enable row level security;
revoke all on public.push_tokens from public, anon, authenticated;

-- Uygulama açılışında: bu telefonun adresini hesaba bağla (aynı adres başka hesaptaysa bu hesaba geçer).
create or replace function public.push_register(p_token text, p_platform text default 'android', p_track text default null)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); n int;
begin
  if uid is null then raise exception 'Giriş yapmalısın.' using errcode = 'P0001', hint = 'auth'; end if;
  if p_token is null or length(p_token) > 200 or p_token !~ '^Expo(nent)?PushToken\[[A-Za-z0-9_-]+\]$' then
    raise exception 'Geçersiz bildirim adresi.' using errcode = 'P0001', hint = 'bad_token';
  end if;
  if p_platform not in ('android', 'ios') then p_platform := 'android'; end if;
  if p_track is not null and p_track not in ('lisans', 'onlisans', 'ortaogretim') then p_track := null; end if;
  -- hesap başına en fazla 10 cihaz: yeni cihaz gelince en eskisi düşer
  select count(*) into n from public.push_tokens where user_id = uid and token <> p_token;
  if n >= 10 then
    delete from public.push_tokens where token in (
      select token from public.push_tokens where user_id = uid and token <> p_token
       order by updated_at asc limit n - 9);
  end if;
  insert into public.push_tokens (token, user_id, platform, track, updated_at)
  values (p_token, uid, p_platform, p_track, clock_timestamp())
  on conflict (token) do update set user_id = excluded.user_id, platform = excluded.platform,
    track = excluded.track, updated_at = clock_timestamp();
  return json_build_object('ok', true);
end;
$$;

create or replace function public.push_unregister(p_token text)
returns json language plpgsql security definer set search_path = public as $$
begin
  delete from public.push_tokens where token = p_token and user_id = auth.uid();
  return json_build_object('ok', true);
end;
$$;

-- ---------- 3) duyuru ve gönderim (iç fonksiyon) ----------
-- Deneme açıldı bildirimi: o kulvardaki (ya da kulvarı bilinmeyen) tüm telefonlara + web duyurusu.
create or replace function public.live_push_open(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  e public.live_exams;
  t timestamptz;
  aylar text[] := array['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  gunler text[] := array['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  ne text;
  baslik text := 'Canlı deneme kaydı açıldı';
  metin text;
  batch jsonb;
  n int := 0;
  has_net boolean;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null then raise exception 'Deneme bulunamadı.' using errcode = 'P0001', hint = 'not_found'; end if;
  t := e.starts_at at time zone 'Europe/Istanbul';
  ne := extract(day from t)::int || ' ' || aylar[extract(month from t)::int] || ' ' || gunler[extract(dow from t)::int + 1]
        || ' ' || to_char(t, 'HH24:MI');
  metin := e.title || ' · ' || ne || '. Kaydını şimdi yap.';

  -- web duyurusu (kayıt kapanınca kendiliğinden kalkar)
  if to_regclass('public.app_announcements') is not null
     and exists (select 1 from information_schema.columns
                  where table_schema = 'public' and table_name = 'app_announcements' and column_name = 'expires_at') then
    execute 'insert into public.app_announcements (body, published, created_by, expires_at) values ($1, true, $2, $3)'
      using baslik || ': ' || metin, auth.uid(), e.reg_closes_at;
  end if;

  has_net := exists (select 1 from pg_proc p join pg_namespace s on s.oid = p.pronamespace
                      where s.nspname = 'net' and p.proname = 'http_post');
  if not has_net then
    insert into public.live_events (exam_id, user_id, kind, detail, at)
    values (p_exam, auth.uid(), 'admin_notify', jsonb_build_object('sent', 0, 'reason', 'no_pg_net'), public.live_clock());
    return json_build_object('sent', 0, 'reason', 'no_pg_net');
  end if;

  -- Expo bildirim servisi: istek başına en fazla 100 mesaj
  for batch in
    select jsonb_agg(jsonb_build_object(
             'to', x.token, 'title', baslik, 'body', metin, 'sound', 'default',
             'channelId', 'default', 'priority', 'high',
             'data', jsonb_build_object('type', 'live_open', 'exam_id', e.id)))
      from (select token, (row_number() over (order by token) - 1) / 100 as grp
              from public.push_tokens where track is null or track = e.track) x
     group by x.grp
  loop
    perform net.http_post(
      url := 'https://exp.host/--/api/v2/push/send',
      body := batch,
      headers := jsonb_build_object('Content-Type', 'application/json', 'Accept', 'application/json'),
      timeout_milliseconds := 15000);
    n := n + jsonb_array_length(batch);
  end loop;

  insert into public.live_events (exam_id, user_id, kind, detail, at)
  values (p_exam, auth.uid(), 'admin_notify', jsonb_build_object('sent', n), public.live_clock());
  return json_build_object('sent', n);
end;
$$;

-- ---------- yönetici ----------
-- Denemeyi aç: taslaksa yayınlar (120 soru + kitapçık şart), sonra bildirim yollar.
create or replace function public.live_admin_open(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams; push json;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status = 'scheduled' then
    -- zaten açık: yalnız bildirimi yinele (10 dakika sınırıyla)
    return json_build_object('exam', public.live_exam_json(e), 'push', public.live_admin_notify(p_exam));
  end if;
  if e.status <> 'draft' then perform public.live_err('state', 'Bu deneme açılamaz (durumu: ' || e.status || ').'); end if;
  perform public.live_admin_publish(p_exam);
  select * into e from public.live_exams where id = p_exam;
  push := public.live_push_open(p_exam);
  return json_build_object('exam', public.live_exam_json(e), 'push', push);
end;
$$;

-- Açık denemenin bildirimini yeniden yolla (kayıt kapanana kadar, 10 dakikada bir).
create or replace function public.live_admin_notify(p_exam uuid)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin(); e public.live_exams;
begin
  select * into e from public.live_exams where id = p_exam;
  if e.id is null or e.deleted_at is not null then perform public.live_err('not_found', 'Deneme bulunamadı.'); end if;
  if e.status <> 'scheduled' then perform public.live_err('state', 'Önce denemeyi aç.'); end if;
  if public.live_clock() >= e.reg_closes_at then perform public.live_err('late', 'Kayıt kapandı; bildirim gönderilmez.'); end if;
  if exists (select 1 from public.live_events where exam_id = p_exam and kind = 'admin_notify'
              and at > public.live_clock() - interval '10 minutes') then
    perform public.live_err('too_soon', 'Bildirim az önce gönderildi; 10 dakika sonra tekrar dene.');
  end if;
  return public.live_push_open(p_exam);
end;
$$;

-- Yönetici listesi için: kaç telefon bildirim alabilir
create or replace function public.live_admin_push_count(p_track text default null)
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := public.live_require_admin();
begin
  return json_build_object(
    'total', (select count(*) from public.push_tokens),
    'track', (select count(*) from public.push_tokens where p_track is null or track is null or track = p_track));
end;
$$;

-- ---------- yetkiler ----------
do $$
declare f text;
begin
  foreach f in array array['push_register(text, text, text)', 'push_unregister(text)',
                           'live_admin_open(uuid)', 'live_admin_notify(uuid)', 'live_admin_push_count(text)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  execute 'revoke all on function public.live_push_open(uuid) from public, anon, authenticated';
end $$;
