-- Sadece yeni SaaS parçaları. Tüm schema.sql'i ikinci kez çalıştırma.

create table if not exists public.app_announcements (
  id uuid primary key default gen_random_uuid(),
  body text not null,
  published boolean default true,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

alter table public.app_announcements enable row level security;

drop policy if exists "read published announcements" on public.app_announcements;
create policy "read published announcements" on public.app_announcements
  for select using (published = true);

drop policy if exists "own referral write" on public.referrals;
create policy "own referral write" on public.referrals
  for all using (auth.uid() = owner) with check (auth.uid() = owner);

drop policy if exists "read own referral" on public.referrals;
create policy "read own referral" on public.referrals
  for select using (auth.uid() = owner);

create or replace function public.admin_hard_topics()
returns json language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.student_states s where s.user_id = auth.uid() and s.role = 'admin') then
    raise exception 'forbidden';
  end if;
  return (
    select coalesce(json_agg(row_to_json(x)), '[]'::json)
    from (
      select ders, konu, sum(w) as wrong_weight, count(*) as users
      from (
        select ders.key as ders,
               konu.key as konu,
               coalesce((konu.value->>'wrongWeight')::int, 0) as w
        from public.student_states s
        cross join lateral jsonb_each(coalesce(s.payload->'topics', '{}'::jsonb)) ders
        cross join lateral jsonb_each(ders.value) konu
      ) t
      where w > 0
      group by ders, konu
      order by sum(w) desc
      limit 10
    ) x
  );
end;
$$;

grant execute on function public.admin_hard_topics() to authenticated;
