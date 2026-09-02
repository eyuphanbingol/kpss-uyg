-- Admin kullanıcı listesine konum (payload.userProfile.location)
create or replace function public.admin_user_list()
returns json language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.student_states s where s.user_id = auth.uid() and s.role = 'admin') then
    raise exception 'forbidden';
  end if;
  return (
    select coalesce(json_agg(row_to_json(t)), '[]'::json)
    from (
      select
        user_id,
        nickname,
        education_level,
        target_type,
        platform,
        premium,
        last_study_at,
        questions_total,
        updated_at,
        role,
        nullif(trim(both from concat_ws(', ',
          nullif(payload#>>'{userProfile,location,city}', ''),
          nullif(payload#>>'{userProfile,location,country}', '')
        )), '') as location
      from public.student_states
      order by updated_at desc nulls last
      limit 400
    ) t
  );
end;
$$;
