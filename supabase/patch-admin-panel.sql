-- Yönetim paneli veritabanı API'si. Supabase SQL Editor'da bir kez çalıştır (tekrar çalıştırmak zararsız).
--
-- Neden: panel eskiden işlemlerin çoğunu "admin-action" sunucu fonksiyonuyla yapıyordu. O fonksiyon
-- güncel kodla dağıtılmamışsa ya da sitenin alan adı fonksiyonun izinli listesinde yoksa istekler
-- sessizce düşüyor; örneğin eğitim değişikliği talepleri panelde hiç görünmüyordu. Bu fonksiyonlar
-- doğrudan veritabanında çalışır; her biri önce yönetici olduğunu doğrular ve işlemi security_audit'e yazar.
-- Premium/engel gibi ayrıcalık alanları normalde istemciden yazılamaz (protect_student_privileges);
-- buradaki fonksiyonlar yönetici doğrulandıktan sonra o güncelleme için sunucu yetkisine geçer.

begin;

-- ---------- yardımcılar ----------
create or replace function public.admin_require()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null or not exists (select 1 from public.student_states s where s.user_id = uid and s.role = 'admin') then
    raise exception 'forbidden' using errcode = '42501', hint = 'Bu işlem yalnızca yöneticiler içindir.';
  end if;
  return uid;
end $$;

create or replace function public.admin_log(p_action text, p_target uuid, p_detail text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.security_audit (actor, action, target, ok, detail) values (auth.uid(), p_action, p_target, true, left(coalesce(p_detail, ''), 200));
end $$;

-- Ayrıcalık tetikleyicisi yalnız sunucu (service_role) yazımına izin verir; yönetici doğrulandıktan sonra
-- bu işlem süresince sunucu kimliğine geçilir, sonra eski hâline dönülür.
create or replace function public.admin_as_server(p_on boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_on then
    perform set_config('admin.prev_role', coalesce(current_setting('request.jwt.claim.role', true), ''), true);
    perform set_config('admin.prev_claims', coalesce(current_setting('request.jwt.claims', true), ''), true);
    perform set_config('request.jwt.claim.role', 'service_role', true);
    perform set_config('request.jwt.claims', jsonb_set(coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb), '{role}', '"service_role"')::text, true);
  else
    perform set_config('request.jwt.claim.role', coalesce(current_setting('admin.prev_role', true), ''), true);
    perform set_config('request.jwt.claims', coalesce(current_setting('admin.prev_claims', true), ''), true);
  end if;
end $$;

create or replace function public.admin_edu_of(p jsonb)
returns jsonb language sql immutable as $$
  select coalesce(p->'userProfile'->'educationChangeRequest', p->'educationChangeRequest')
$$;

create or replace function public.admin_loc_of(p jsonb)
returns text language sql immutable as $$
  select nullif(concat_ws(', ',
    nullif(coalesce(p#>>'{userProfile,location,city}', p#>>'{userProfile,location,region}'), ''),
    nullif(coalesce(p#>>'{userProfile,location,country}', p#>>'{userProfile,location,countryCode}'), '')), '')
$$;

-- ---------- özet ----------
create or replace function public.admin_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare d date := (now() at time zone 'Europe/Istanbul')::date;
begin
  perform public.admin_require();
  return jsonb_build_object(
    'users', (select count(*) from student_states where role is distinct from 'admin'),
    'dau', (select count(*) from student_states where last_study_at = d),
    'wau', (select count(*) from student_states where last_study_at >= d - 6),
    'mau', (select count(*) from student_states where last_study_at >= d - 29),
    'idle7', (select count(*) from student_states where role is distinct from 'admin' and (last_study_at is null or last_study_at < d - 7)),
    'premium', (select count(*) from student_states where premium),
    'blocked', (select count(*) from student_states where blocked),
    'questions', (select coalesce(sum(questions_total), 0) from student_states),
    'pending_edu', (select count(*) from student_states where public.admin_edu_of(payload)->>'status' = 'pending'),
    'by_level', (select coalesce(jsonb_object_agg(k, n), '{}'::jsonb) from (select coalesce(education_level, 'bilinmiyor') k, count(*) n from student_states where role is distinct from 'admin' group by 1) x),
    'by_platform', (select coalesce(jsonb_object_agg(k, n), '{}'::jsonb) from (select coalesce(platform, 'bilinmiyor') k, count(*) n from student_states where role is distinct from 'admin' group by 1) x),
    'active_14', (select coalesce(jsonb_agg(jsonb_build_object('day', g::date, 'n', (select count(*) from student_states where last_study_at = g::date)) order by g), '[]'::jsonb)
                  from generate_series(d - 13, d, interval '1 day') g),
    'announcements', (select count(*) from app_announcements where published and (expires_at is null or expires_at > now()))
  );
end $$;

-- ---------- kullanıcılar ----------
create or replace function public.admin_users()
returns jsonb language plpgsql stable security definer set search_path = public, auth as $$
begin
  perform public.admin_require();
  return coalesce((select jsonb_agg(jsonb_build_object(
      'user_id', s.user_id, 'nickname', s.nickname, 'email', to_jsonb(u)->>'email',
      'created_at', to_jsonb(u)->>'created_at', 'last_sign_in_at', to_jsonb(u)->>'last_sign_in_at',
      'education_level', s.education_level, 'target_type', s.target_type, 'platform', s.platform,
      'premium', s.premium, 'premium_until', s.payload#>>'{userProfile,premiumUntil}', 'blocked', s.blocked, 'role', s.role,
      'last_study_at', s.last_study_at, 'questions_total', s.questions_total, 'updated_at', s.updated_at,
      'location', public.admin_loc_of(s.payload),
      'edu_request', case when public.admin_edu_of(s.payload)->>'status' = 'pending' then public.admin_edu_of(s.payload) end
    ) order by s.updated_at desc nulls last)
    from student_states s left join auth.users u on u.id = s.user_id), '[]'::jsonb);
end $$;

create or replace function public.admin_user_detail(p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = public, auth as $$
declare s student_states; p jsonb; days jsonb;
begin
  perform public.admin_require();
  select * into s from student_states where user_id = p_user;
  if s.user_id is null then raise exception 'not_found' using errcode = 'P0002', hint = 'Kullanıcı bulunamadı.'; end if;
  p := coalesce(s.payload, '{}'::jsonb);
  select coalesce(jsonb_agg(jsonb_build_object('day', k, 'q', coalesce((v->>'questions')::int, 0), 'c', coalesce((v->>'correct')::int, 0), 'min', coalesce((v->>'minutes')::int, 0)) order by k desc), '[]'::jsonb)
    into days from (select k, v from jsonb_each(coalesce(p->'sessions', '{}'::jsonb)) as e(k, v) order by k desc limit 14) x;
  return jsonb_build_object(
    'user_id', s.user_id, 'nickname', s.nickname, 'name', p#>>'{profile,name}',
    'email', (select to_jsonb(u)->>'email' from auth.users u where u.id = s.user_id),
    'created_at', (select to_jsonb(u)->>'created_at' from auth.users u where u.id = s.user_id),
    'education_level', s.education_level, 'target_type', s.target_type, 'platform', s.platform, 'role', s.role,
    'premium', s.premium, 'premium_until', p#>>'{userProfile,premiumUntil}', 'blocked', s.blocked,
    'exam_date', p#>>'{profile,examDate}', 'questions_total', s.questions_total, 'last_study_at', s.last_study_at,
    'updated_at', s.updated_at, 'location', public.admin_loc_of(p),
    'streak', p->'streak', 'counters', p->'counters',
    'wrong_count', coalesce(jsonb_array_length(case when jsonb_typeof(p->'wrongBook') = 'array' then p->'wrongBook' end), 0),
    'topics', (select count(*) from jsonb_each(coalesce(p->'topics', '{}'::jsonb)) d, jsonb_each(case when jsonb_typeof(d.value) = 'object' then d.value else '{}'::jsonb end) k),
    'days', days,
    'edu_request', public.admin_edu_of(p),
    'referred_by', p#>>'{userProfile,referredBy}'
  );
end $$;

create or replace function public.admin_set_premium(p_user uuid, p_days int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p jsonb; until timestamptz;
begin
  perform public.admin_require();
  select payload into p from student_states where user_id = p_user;
  if not found then raise exception 'not_found' using errcode = 'P0002', hint = 'Kullanıcı bulunamadı.'; end if;
  p := coalesce(p, '{}'::jsonb);
  if p->'userProfile' is null or jsonb_typeof(p->'userProfile') <> 'object' then p := jsonb_set(p, '{userProfile}', '{}'::jsonb); end if;
  if coalesce(p_days, 0) > 0 then
    until := now() + make_interval(days => least(p_days, 3650));
    p := jsonb_set(jsonb_set(p, '{userProfile,premium}', 'true'), '{userProfile,premiumUntil}', to_jsonb(until));
    p := jsonb_set(p, '{billing}', coalesce(p->'billing', '{}'::jsonb) || '{"plan":"premium"}');
  else
    p := jsonb_set(jsonb_set(p, '{userProfile,premium}', 'false'), '{userProfile,premiumUntil}', 'null');
    p := jsonb_set(p, '{billing}', coalesce(p->'billing', '{}'::jsonb) || '{"plan":"free"}');
  end if;
  perform public.admin_as_server(true);
  update student_states set premium = coalesce(p_days, 0) > 0, payload = p where user_id = p_user;
  perform public.admin_as_server(false);
  perform public.admin_log(case when coalesce(p_days, 0) > 0 then 'grant_premium' else 'revoke_premium' end, p_user, coalesce(p_days, 0)::text || ' gün');
  return jsonb_build_object('ok', true, 'premium', coalesce(p_days, 0) > 0, 'until', until);
end $$;

create or replace function public.admin_set_blocked(p_user uuid, p_blocked boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare me uuid := public.admin_require(); p jsonb; r text;
begin
  if p_user = me then raise exception 'self' using errcode = '42501', hint = 'Kendini engelleyemezsin.'; end if;
  select payload, role into p, r from student_states where user_id = p_user;
  if not found then raise exception 'not_found' using errcode = 'P0002', hint = 'Kullanıcı bulunamadı.'; end if;
  if r = 'admin' then raise exception 'admin' using errcode = '42501', hint = 'Yönetici engellenemez.'; end if;
  p := coalesce(p, '{}'::jsonb);
  if p->'userProfile' is null or jsonb_typeof(p->'userProfile') <> 'object' then p := jsonb_set(p, '{userProfile}', '{}'::jsonb); end if;
  p := jsonb_set(p, '{userProfile,blocked}', to_jsonb(coalesce(p_blocked, false)));
  perform public.admin_as_server(true);
  update student_states set blocked = coalesce(p_blocked, false), payload = p where user_id = p_user;
  perform public.admin_as_server(false);
  perform public.admin_log(case when p_blocked then 'block' else 'unblock' end, p_user, null);
  return jsonb_build_object('ok', true, 'blocked', coalesce(p_blocked, false));
end $$;

create or replace function public.admin_delete_user(p_user uuid)
returns jsonb language plpgsql security definer set search_path = public, auth as $$
declare me uuid := public.admin_require(); r text;
begin
  if p_user = me then raise exception 'self' using errcode = '42501', hint = 'Kendi hesabını buradan silemezsin.'; end if;
  select role into r from student_states where user_id = p_user;
  if r = 'admin' then raise exception 'admin' using errcode = '42501', hint = 'Yönetici hesabı silinemez.'; end if;
  perform public.admin_log('delete_user', p_user, null);
  delete from auth.users where id = p_user;   -- bağlı kayıtlar (student_states vb.) zincirleme silinir
  delete from student_states where user_id = p_user;
  return jsonb_build_object('ok', true);
end $$;

-- ---------- eğitim değişikliği talepleri ----------
create or replace function public.admin_edu_requests()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.admin_require();
  return coalesce((select jsonb_agg(jsonb_build_object(
      'user_id', s.user_id, 'nickname', s.nickname, 'from', coalesce(public.admin_edu_of(s.payload)->>'from', s.education_level),
      'to', public.admin_edu_of(s.payload)->>'to', 'at', public.admin_edu_of(s.payload)->>'at',
      'questions_total', s.questions_total, 'last_study_at', s.last_study_at
    ) order by public.admin_edu_of(s.payload)->>'at')
    from student_states s where public.admin_edu_of(s.payload)->>'status' = 'pending'), '[]'::jsonb);
end $$;

create or replace function public.admin_edu_decide(p_user uuid, p_approve boolean, p_exam_date text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare p jsonb; req jsonb; lvl text;
begin
  perform public.admin_require();
  select payload into p from student_states where user_id = p_user;
  if not found then raise exception 'not_found' using errcode = 'P0002', hint = 'Kullanıcı bulunamadı.'; end if;
  p := coalesce(p, '{}'::jsonb);
  req := public.admin_edu_of(p);
  if req is null or req->>'status' <> 'pending' then raise exception 'no_request' using errcode = 'P0002', hint = 'Bekleyen talep yok (başka bir yönetici sonuçlandırmış olabilir).'; end if;
  lvl := req->>'to';
  if p_approve and lvl not in ('lisans', 'onlisans', 'ortaogretim') then raise exception 'bad_level' using hint = 'Geçersiz eğitim düzeyi.'; end if;
  if p->'userProfile' is null or jsonb_typeof(p->'userProfile') <> 'object' then p := jsonb_set(p, '{userProfile}', '{}'::jsonb); end if;
  if p_approve then
    p := (p #- '{userProfile,educationChangeRequest}') - 'educationChangeRequest';
    p := jsonb_set(p, '{userProfile,educationLevel}', to_jsonb(lvl));
    -- sınav tarihi yalnız geçerli ve gelecekteyse yazılır
    begin
      if p_exam_date ~ '^\d{4}-\d{2}-\d{2}$' and p_exam_date::date > current_date then
        p := jsonb_set(p, '{profile}', coalesce(p->'profile', '{}'::jsonb) || jsonb_build_object('examDate', p_exam_date));
      end if;
    exception when others then null;
    end;
    update student_states set payload = p, education_level = lvl where user_id = p_user;
  else
    req := req || jsonb_build_object('status', 'rejected', 'decidedAt', now());
    p := jsonb_set(jsonb_set(p, '{userProfile,educationChangeRequest}', req), '{educationChangeRequest}', req);
    update student_states set payload = p where user_id = p_user;
  end if;
  perform public.admin_log(case when p_approve then 'approve_edu' else 'reject_edu' end, p_user, coalesce(req->>'from', '') || ' → ' || coalesce(req->>'to', ''));
  return jsonb_build_object('ok', true, 'approved', p_approve, 'level', case when p_approve then lvl end);
end $$;

-- ---------- duyurular ----------
create or replace function public.admin_announcements()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.admin_require();
  return coalesce((select jsonb_agg(jsonb_build_object('id', id, 'body', body, 'published', published, 'created_at', created_at, 'expires_at', expires_at) order by created_at desc)
    from (select * from app_announcements order by created_at desc limit 100) a), '[]'::jsonb);
end $$;

create or replace function public.admin_announce(p_text text, p_hours numeric default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare me uuid := public.admin_require(); t text := left(btrim(coalesce(p_text, '')), 500); exp timestamptz; nid uuid;
begin
  if t = '' then raise exception 'empty' using hint = 'Duyuru metni boş olamaz.'; end if;
  if p_hours is not null and p_hours > 0 then exp := now() + make_interval(secs => least(p_hours, 24 * 365) * 3600); end if;
  -- Bitiş zamanı eski istemciler için metnin başına da işlenir (uygulama <!--kpss-exp:...--> işaretini okur)
  insert into app_announcements (body, published, created_by, expires_at)
  values ((case when exp is not null then '<!--kpss-exp:' || to_char(exp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') || '-->' else '' end) || t, true, me, exp)
  returning id into nid;
  perform public.admin_log('announce', null, left(t, 120));
  return jsonb_build_object('ok', true, 'id', nid, 'expires_at', exp);
end $$;

create or replace function public.admin_announce_delete(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public.admin_require();
  delete from app_announcements where id = p_id;
  if not found then raise exception 'not_found' using errcode = 'P0002', hint = 'Duyuru bulunamadı.'; end if;
  perform public.admin_log('delete_announce', null, p_id::text);
  return jsonb_build_object('ok', true);
end $$;

-- ---------- işlem geçmişi ----------
create or replace function public.admin_audit_log(p_limit int default 60)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.admin_require();
  return coalesce((select jsonb_agg(jsonb_build_object('at', a.at, 'action', a.action, 'ok', a.ok, 'detail', a.detail,
      'actor', (select nickname from student_states where user_id = a.actor), 'target', (select nickname from student_states where user_id = a.target)) order by a.at desc)
    from (select * from security_audit order by at desc limit least(greatest(coalesce(p_limit, 60), 1), 300)) a), '[]'::jsonb);
end $$;

-- ---------- yetkiler: yalnız giriş yapmış kullanıcı çağırabilir, fonksiyon içinde yönetici denetlenir ----------
do $$
declare f text;
begin
  foreach f in array array['admin_require()', 'admin_overview()', 'admin_users()', 'admin_user_detail(uuid)', 'admin_set_premium(uuid, integer)',
    'admin_set_blocked(uuid, boolean)', 'admin_delete_user(uuid)', 'admin_edu_requests()', 'admin_edu_decide(uuid, boolean, text)',
    'admin_announcements()', 'admin_announce(text, numeric)', 'admin_announce_delete(uuid)', 'admin_audit_log(integer)'] loop
    execute 'revoke all on function public.' || f || ' from public, anon';
    execute 'grant execute on function public.' || f || ' to authenticated';
  end loop;
  -- iç yardımcılar dışarıdan çağrılamaz
  foreach f in array array['admin_log(text, uuid, text)', 'admin_as_server(boolean)'] loop
    execute 'revoke all on function public.' || f || ' from public, anon, authenticated';
  end loop;
end $$;

commit;
