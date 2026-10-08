-- CANLI DENEME · PARÇA 3 / 10
-- Supabase SQL Editor'da 1'den 10'a SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).
-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.

-- Sıralama, kohort ve soru istatistikleri. Kesinleşmede, ayrıca yöneticinin kayıtlı
-- elle düzeltmesinden sonra yeniden çalışır.
create or replace function public.live_rank(p_exam uuid)
returns void language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(*) into n from public.live_results where exam_id = p_exam;
  update public.live_results r set rank = x.rk, participants = n,
         top_pct = round(100.0 * x.rk / greatest(n, 1), 1)
    from (select user_id, rank() over (order by net desc) as rk from public.live_results where exam_id = p_exam) x
   where r.exam_id = p_exam and r.user_id = x.user_id;

  insert into public.live_cohort (exam_id, participants, avg_net, avg_gy, avg_gk, by_ders, by_konu, top, computed_at)
  select p_exam, n,
    (select round(avg(net), 2) from public.live_results where exam_id = p_exam),
    (select round(avg(gy_net), 2) from public.live_results where exam_id = p_exam),
    (select round(avg(gk_net), 2) from public.live_results where exam_id = p_exam),
    coalesce((select jsonb_object_agg(k, v) from (
       select d.key as k, json_build_object('net', round(avg((d.value->>'net')::numeric), 2),
              'c', round(avg((d.value->>'c')::numeric), 2), 'n', max((d.value->>'n')::int)) as v
       from public.live_results r cross join lateral jsonb_each(r.by_ders) d
       where r.exam_id = p_exam group by d.key) s), '{}'::jsonb),
    coalesce((select jsonb_object_agg(k, v) from (
       select d.key as k, json_build_object('net', round(avg((d.value->>'net')::numeric), 2),
              'c', round(avg((d.value->>'c')::numeric), 2), 'n', max((d.value->>'n')::int)) as v
       from public.live_results r cross join lateral jsonb_each(r.by_konu) d
       where r.exam_id = p_exam group by d.key) s), '{}'::jsonb),
    coalesce((select jsonb_agg(json_build_object('nickname', nickname, 'net', net, 'rank', rank) order by rank, nickname)
       from (select * from public.live_results where exam_id = p_exam order by rank, nickname limit 20) t), '[]'::jsonb),
    public.live_clock()
  on conflict (exam_id) do update set participants = excluded.participants, avg_net = excluded.avg_net,
    avg_gy = excluded.avg_gy, avg_gk = excluded.avg_gk, by_ders = excluded.by_ders, by_konu = excluded.by_konu,
    top = excluded.top, computed_at = excluded.computed_at;

  insert into public.live_question_stats (exam_id, no, correct, wrong, blank, choices, avg_ms)
  select q.exam_id, q.no,
    count(*) filter (where a.choice = q.answer),
    count(*) filter (where a.choice is not null and a.choice <> q.answer),
    n - count(*) filter (where a.choice is not null),
    coalesce((select jsonb_object_agg(c, cnt) from (
       select a2.choice as c, count(*) as cnt from public.live_answers a2
       join public.live_results r2 on r2.exam_id = a2.exam_id and r2.user_id = a2.user_id
       where a2.exam_id = q.exam_id and a2.no = q.no and a2.choice is not null group by a2.choice) z), '{}'::jsonb),
    round(avg(nullif(a.ms, 0)))::int
  from public.live_questions q
  left join public.live_answers a on a.exam_id = q.exam_id and a.no = q.no
       and exists (select 1 from public.live_results r where r.exam_id = a.exam_id and r.user_id = a.user_id)
  where q.exam_id = p_exam
  group by q.exam_id, q.no, q.answer
  on conflict (exam_id, no) do update set correct = excluded.correct, wrong = excluded.wrong, blank = excluded.blank,
    choices = excluded.choices, avg_ms = excluded.avg_ms;

  -- Derin analiz: dağılım (5 netlik dilimler), yüzdelikler, ilk %10'un ders netleri,
  -- cihaz/kâğıt karşılaştırması ve ders başına ortalama süre (yalnızca cihazda çözenler).
  update public.live_cohort c set analysis = jsonb_build_object(
    'hist', (select coalesce(jsonb_agg(jsonb_build_array(h.b, h.cnt) order by h.b), '[]'::jsonb) from (
        select (floor(net / 5) * 5)::int as b, count(*)::int as cnt from public.live_results where exam_id = p_exam group by 1) h),
    'pct', (select jsonb_build_object(
        'p25', round(percentile_cont(0.25) within group (order by net)::numeric, 2),
        'p50', round(percentile_cont(0.5) within group (order by net)::numeric, 2),
        'p75', round(percentile_cont(0.75) within group (order by net)::numeric, 2),
        'p90', round(percentile_cont(0.9) within group (order by net)::numeric, 2),
        'min', min(net), 'max', max(net)) from public.live_results where exam_id = p_exam),
    'top10_n', (select count(*) from public.live_results where exam_id = p_exam and rank <= greatest(1, ceil(n * 0.1))),
    'top10_net', (select round(avg(net), 2) from public.live_results where exam_id = p_exam and rank <= greatest(1, ceil(n * 0.1))),
    'top10', (select coalesce(jsonb_object_agg(t.k, t.v), '{}'::jsonb) from (
        select d.key as k, round(avg((d.value->>'net')::numeric), 2) as v
        from public.live_results r cross join lateral jsonb_each(r.by_ders) d
        where r.exam_id = p_exam and r.rank <= greatest(1, ceil(n * 0.1)) group by d.key) t),
    'by_mode', (select coalesce(jsonb_object_agg(m.mode, jsonb_build_object('n', m.cnt, 'avg_net', m.av)), '{}'::jsonb) from (
        select mode, count(*)::int as cnt, round(avg(net), 2) as av from public.live_results where exam_id = p_exam group by mode) m),
    'time_by_ders', (select coalesce(jsonb_object_agg(t.ders, t.ms), '{}'::jsonb) from (
        select q.ders, round(avg(a.ms))::int as ms
        from public.live_answers a
        join public.live_questions q on q.exam_id = a.exam_id and q.no = a.no
        join public.live_results r on r.exam_id = a.exam_id and r.user_id = a.user_id and r.mode = 'device'
        where a.exam_id = p_exam and a.ms > 0 and a.choice is not null group by q.ders) t))
  where c.exam_id = p_exam;
end;
$$;

-- Dakikalık bakım: geç senkron süresi dolan kâğıtları kapat, zamanı gelen sınavları kesinleştir.
create or replace function public.live_tick()
returns void language plpgsql security definer set search_path = public as $$
declare a record; x record;
begin
  for a in select t.exam_id, t.user_id from public.live_attempts t
           join public.live_exams e on e.id = t.exam_id
           where t.closed_at is null and e.status = 'scheduled'
             and ((t.mode = 'device' and public.live_clock() > e.late_sync_until)
               or (t.mode = 'paper' and public.live_clock() >= e.ranking_at)) loop
    perform public.live_close_attempt(a.exam_id, a.user_id, 'auto');
  end loop;
  for x in select id from public.live_exams
           where status = 'scheduled' and finalized_at is null and deleted_at is null and public.live_clock() >= ranking_at loop
    perform public.live_finalize(x.id);
  end loop;
end;
$$;

-- ============================================================
-- ÖĞRENCİ FONKSİYONLARI
-- ============================================================

create or replace function public.live_now()
returns json language sql stable as $$
  select json_build_object('now', (extract(epoch from public.live_clock()) * 1000)::bigint)
$$;
