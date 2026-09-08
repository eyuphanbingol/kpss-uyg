-- Haftalık sıralama: bu hafta, en çok doğru.
create or replace view public.leaderboard_public as
  select nickname, questions, 'week'::text as kind
  from public.leaderboard_weekly
  where week_start = ((date_trunc('week', timezone('Europe/Istanbul', now())))::date);

grant select on public.leaderboard_public to anon, authenticated;

do $$
begin
  begin
    execute 'alter view public.leaderboard_public set (security_invoker = false)';
  exception when others then
    null;
  end;
end $$;
