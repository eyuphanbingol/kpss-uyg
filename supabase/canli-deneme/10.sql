-- CANLI DENEME · PARÇA 10 / 10
-- Supabase SQL Editor'da 1'den 10'a SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

-- Yönetici listesi: + erken kitapçık ayarı ve indiren kişi sayısı
create or replace function public.live_admin_list()
returns json language plpgsql security definer set search_path = public as $$
begin
  perform public.live_require_admin();
  perform public.live_tick();
  return (select coalesce(json_agg(x order by x.starts_at desc), '[]'::json) from (
    select e.id, e.track, e.title, e.status, e.starts_at, e.reg_closes_at, e.ends_at, e.ranking_at, e.capacity,
           e.extra_minutes, e.booklet_path is not null as has_booklet, e.finalized_at, e.early_kit,
           (select count(*) from public.live_questions q where q.exam_id = e.id) as questions,
           (select count(*) from public.live_registrations r where r.exam_id = e.id and r.status = 'registered') as registered,
           (select count(*) from public.live_registrations r where r.exam_id = e.id and r.status = 'waitlist') as waitlist,
           (select count(*) from public.live_attempts a where a.exam_id = e.id) as entered,
           (select count(distinct v.user_id) from public.live_events v where v.exam_id = e.id and v.kind = 'kit_download') as kit_downloads,
           (select participants from public.live_cohort c where c.exam_id = e.id) as participants,
           (select avg_net from public.live_cohort c where c.exam_id = e.id) as avg_net
    from public.live_exams e where e.deleted_at is null) x);
end;
$$;
