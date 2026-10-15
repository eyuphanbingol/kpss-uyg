-- Sıralamalarda ad gizleme (KVKK). SQL Editor'da bir kez çalıştır; tekrar çalıştırmak güvenlidir.
-- Herkese açık sıralamada adın yalnız ilk iki harfi görünür, gerisi "**" olur: "Eyüphan Bingöl" → "Ey**".
-- Maskeleme sunucuda yapılır: tam ad hiçbir öğrenciye/ziyaretçiye gönderilmez. Yönetici paneli tam adı görmeye devam eder.
-- Öğrencinin kendi satırını bulabilmesi için görünüme is_me sütunu eklenir (yalnız oturum sahibinin satırında true).

create or replace function public.mask_name(p_name text)
returns text language sql immutable set search_path = public as $$
  select case
    when coalesce(btrim(p_name), '') = '' then 'Öğ**'
    else left(regexp_replace(btrim(p_name), '\s+', ' ', 'g'), 2) || '**'
  end
$$;
grant execute on function public.mask_name(text) to anon, authenticated;

-- Haftalık sıralama. Yeni sütun sona eklenir (create or replace view sütun sırasını korumalı).
create or replace view public.leaderboard_public as
  select public.mask_name(nickname) as nickname, questions, 'week'::text as kind,
         (user_id = auth.uid()) as is_me
  from public.leaderboard_weekly
  where week_start = ((date_trunc('week', timezone('Europe/Istanbul', now())))::date);

revoke all on public.leaderboard_public from public, anon, authenticated;
grant select on public.leaderboard_public to anon, authenticated;
do $$
begin
  begin
    execute 'alter view public.leaderboard_public set (security_invoker = false)';
  exception when others then
    null;
  end;
end $$;

-- Ham tablo herkese açık okunamaz (patch-hardening ile kapatılmıştı; burada da garanti altına alınır).
drop policy if exists "public read week lb" on public.leaderboard_weekly;

-- Canlı deneme: kohorttaki ilk 20 listesi de maskeli saklanır (öğrenci sonuç ekranına giden veri).
do $$
begin
  if to_regclass('public.live_cohort') is null then return; end if;

  create or replace function public.live_cohort_mask_top()
  returns trigger language plpgsql set search_path = public as $f$
  begin
    if new.top is not null and jsonb_typeof(new.top) = 'array' then
      new.top := coalesce((
        select jsonb_agg(case when jsonb_typeof(e) = 'object' and e ? 'nickname'
                              then jsonb_set(e, '{nickname}', to_jsonb(public.mask_name(e->>'nickname')))
                              else e end order by i)
        from jsonb_array_elements(new.top) with ordinality as t(e, i)), '[]'::jsonb);
    end if;
    return new;
  end $f$;

  drop trigger if exists live_cohort_mask_top on public.live_cohort;
  create trigger live_cohort_mask_top before insert or update of top on public.live_cohort
    for each row execute function public.live_cohort_mask_top();

  -- Var olan kayıtlar: zaten maskeli olanlar ("Ey**") yeniden maskelenince değişmez.
  update public.live_cohort set top = top where top is not null;
end $$;
