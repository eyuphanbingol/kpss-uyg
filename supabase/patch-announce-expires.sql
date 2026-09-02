-- İsteğe bağlı: duyuru bitiş zamanı kolonu.
-- Yoksa uygulama body içindeki <!--kpss-exp:ISO--> işaretini kullanır.

alter table public.app_announcements
  add column if not exists expires_at timestamptz;
