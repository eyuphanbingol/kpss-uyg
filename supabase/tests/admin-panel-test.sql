-- Yönetim paneli veritabanı API'si testleri (yerel PostgreSQL). Çalıştır: scripts/test-live-exam-sql.sh
-- Kimlik, gerçek Supabase'deki gibi yalnız request.jwt.claims (JSON) üzerinden okunur.
\set ON_ERROR_STOP on
\pset format unaligned
\pset tuples_only on

create or replace function auth.uid() returns uuid language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''), (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid
$$;
create or replace function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim', true), ''), nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$$;

create or replace function public.t_ok(cond boolean, msg text) returns void language plpgsql as $$
begin
  if cond is distinct from true then raise exception 'TEST BAŞARISIZ: %', msg; end if;
  raise notice 'ok  %', msg;
end $$;
create or replace function public.t_err(q text, code text, msg text) returns void language plpgsql as $$
declare h text; m text;
begin
  begin
    execute q;
  exception when others then
    get stacked diagnostics h = pg_exception_hint, m = message_text;
    if coalesce(h, '') = code or code = '*' or position(code in m) > 0 then
      raise notice 'ok  % (%)', msg, code; return;
    end if;
    raise exception 'TEST BAŞARISIZ: % — beklenen %, gelen % / %', msg, code, h, m;
  end;
  raise exception 'TEST BAŞARISIZ: % — hata bekleniyordu (%)', msg, code;
end $$;
grant execute on function public.t_ok(boolean, text) to authenticated, anon;
grant execute on function public.t_err(text, text, text) to authenticated, anon;

-- oturum: PostgREST'in yaptığı gibi rol + JSON talepler
create or replace function public.t_as(uid text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', '', false);
  perform set_config('request.jwt.claim.role', '', false);
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, false);
end $$;
grant execute on function public.t_as(text) to authenticated, anon;

alter table auth.users add column if not exists created_at timestamptz default now();
insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-0000000000a1', 'admin@x'),
  ('00000000-0000-4000-8000-000000000001', 'ayse@x'),
  ('00000000-0000-4000-8000-000000000002', 'mehmet@x'),
  ('00000000-0000-4000-8000-000000000003', 'silinecek@x');
select set_config('request.jwt.claims', '{"role":"service_role"}', false);
insert into public.student_states (user_id, nickname, education_level, questions_total, last_study_at, payload) values
  ('00000000-0000-4000-8000-0000000000a1', 'Yonetici', 'lisans', 0, null, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'Ayse', 'lisans', 120, current_date,
   '{"profile":{"name":"Ayşe","examDate":"2026-09-06"},"userProfile":{"educationLevel":"lisans"},"sessions":{"2026-10-10":{"questions":40,"correct":30,"minutes":25}}}'),
  ('00000000-0000-4000-8000-000000000002', 'Mehmet', 'lisans', 45, current_date - 9, '{"userProfile":{"educationLevel":"lisans"}}'),
  ('00000000-0000-4000-8000-000000000003', 'Silinecek', 'onlisans', 0, null, '{}');
update public.student_states set role = 'admin' where user_id = '00000000-0000-4000-8000-0000000000a1';
select set_config('request.jwt.claims', '', false);

-- ---------- öğrenci tarafı: talep gönderir (istemcinin yaptığı gibi tablo güncellemesi) ----------
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000001');
update public.student_states set payload = jsonb_set(jsonb_set(payload, '{userProfile,educationChangeRequest}',
  '{"from":"lisans","to":"onlisans","at":"2026-10-11T08:00:00Z","status":"pending"}'), '{educationChangeRequest}',
  '{"from":"lisans","to":"onlisans","at":"2026-10-11T08:00:00Z","status":"pending"}')
  where user_id = auth.uid();
-- öğrenci kendine premium/engel/rol veremez (tetikleyici korur)
update public.student_states set premium = true, role = 'admin', blocked = false where user_id = auth.uid();
select t_ok((select not premium and role = 'student' from public.student_states where user_id = auth.uid()), 'öğrenci kendine ayrıcalık veremez');

-- öğrenci yönetici işlevlerini çağıramaz
select t_err('select public.admin_overview()', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: özet yasak');
select t_err('select public.admin_users()', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: kullanıcı listesi yasak');
select t_err('select public.admin_user_detail(''00000000-0000-4000-8000-000000000002'')', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: kullanıcı ayrıntısı yasak');
select t_err('select public.admin_set_premium(auth.uid(), 30)', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: kendine premium yasak');
select t_err('select public.admin_set_blocked(''00000000-0000-4000-8000-000000000002'', true)', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: engelleme yasak');
select t_err('select public.admin_delete_user(''00000000-0000-4000-8000-000000000002'')', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: silme yasak');
select t_err('select public.admin_edu_requests()', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: talep listesi yasak');
select t_err('select public.admin_edu_decide(auth.uid(), true)', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: kendi talebini onaylayamaz');
select t_err('select public.admin_announce(''x'')', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: duyuru yasak');
select t_err('select public.admin_announcements()', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: duyuru listesi yasak');
select t_err('select public.admin_audit_log(10)', 'Bu işlem yalnızca yöneticiler içindir.', 'öğrenci: işlem geçmişi yasak');
select t_err('select public.admin_as_server(true)', 'permission denied', 'iç yardımcı admin_as_server çağrılamaz');
select t_err('select public.admin_log(''x'', null, null)', 'permission denied', 'iç yardımcı admin_log çağrılamaz');
reset role;

-- giriş yapmamış ziyaretçi hiçbirini çağıramaz
set role anon;
select t_as('');
select t_err('select public.admin_overview()', 'permission denied', 'ziyaretçi: özet yasak');
select t_err('select public.admin_users()', 'permission denied', 'ziyaretçi: liste yasak');
reset role;

-- ---------- yönetici ----------
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1');
select t_ok((public.admin_overview()->>'users')::int = 3, 'özet: öğrenci sayısı (yönetici hariç)');
select t_ok((public.admin_overview()->>'pending_edu')::int = 1, 'özet: bekleyen eğitim talebi 1');
select t_ok((public.admin_overview()->>'idle7')::int = 2, 'özet: 7 gündür pasif 2');
select t_ok(jsonb_array_length(public.admin_overview()->'active_14') = 14, 'özet: 14 günlük aktiflik serisi');
select t_ok(jsonb_array_length(public.admin_users()) = 4, 'kullanıcı listesi 4 satır');
select t_ok((select x->>'email' from jsonb_array_elements(public.admin_users()) x where x->>'nickname' = 'Ayse') = 'ayse@x', 'listede e-posta var');
select t_ok((select x->'edu_request'->>'to' from jsonb_array_elements(public.admin_users()) x where x->>'nickname' = 'Ayse') = 'onlisans', 'listede bekleyen talep görünür');
select t_ok(public.admin_user_detail('00000000-0000-4000-8000-000000000001')->>'name' = 'Ayşe', 'ayrıntı: ad');
select t_ok(jsonb_array_length(public.admin_user_detail('00000000-0000-4000-8000-000000000001')->'days') = 1, 'ayrıntı: günlük oturumlar');
select t_err('select public.admin_user_detail(''00000000-0000-4000-8000-00000000ffff'')', 'Kullanıcı bulunamadı.', 'ayrıntı: olmayan kullanıcı');

-- eğitim talebi: listede görünür, onaylanınca düzey + sınav tarihi değişir, talep kalkar
select t_ok(jsonb_array_length(public.admin_edu_requests()) = 1, 'talep listesinde 1 kayıt');
select t_ok(public.admin_edu_requests()->0->>'to' = 'onlisans', 'talep: hedef önlisans');
select t_ok(public.admin_edu_decide('00000000-0000-4000-8000-000000000001', true, '2027-10-03')->>'level' = 'onlisans', 'talep onaylandı');
reset role;  -- RLS: yönetici başkasının satırını tablodan okuyamaz; doğrulama sunucu olarak
select t_ok((select education_level = 'onlisans' and payload#>>'{userProfile,educationLevel}' = 'onlisans'
  and payload#>>'{profile,examDate}' = '2027-10-03' and public.admin_edu_of(payload) is null
  from public.student_states where user_id = '00000000-0000-4000-8000-000000000001'), 'onay: düzey, sınav tarihi yazıldı, talep silindi');
set role authenticated;
select t_ok(jsonb_array_length(public.admin_edu_requests()) = 0, 'onaydan sonra liste boş');
select t_err('select public.admin_edu_decide(''00000000-0000-4000-8000-000000000001'', true)', 'Bekleyen talep yok (başka bir yönetici sonuçlandırmış olabilir).', 'ikinci kez onay reddedilir');
reset role;

-- red akışı + geçmiş tarih yazılmaz
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000002');
update public.student_states set payload = jsonb_set(payload, '{userProfile,educationChangeRequest}',
  '{"from":"lisans","to":"ortaogretim","at":"2026-10-11T09:00:00Z","status":"pending"}') where user_id = auth.uid();
select t_as('00000000-0000-4000-8000-0000000000a1');
select t_ok(public.admin_edu_requests()->0->>'nickname' = 'Mehmet', 'yalnız iç içe kaydedilmiş talep de listelenir');
select t_ok((public.admin_edu_decide('00000000-0000-4000-8000-000000000002', false)->>'approved')::boolean = false, 'talep reddedildi');
reset role;  -- RLS: yönetici başkasının satırını tablodan okuyamaz; doğrulama sunucu olarak
select t_ok((select education_level = 'lisans' and public.admin_edu_of(payload)->>'status' = 'rejected' and payload#>>'{educationChangeRequest,status}' = 'rejected'
  from public.student_states where user_id = '00000000-0000-4000-8000-000000000002'), 'red: düzey aynı, talep rejected');
set role authenticated;
reset role;

-- premium ve engel: ayrıcalık tetikleyicisini yönetici yetkisiyle geçer, sonra oturum öğrenciye geri döner
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1');
select t_ok((public.admin_set_premium('00000000-0000-4000-8000-000000000002', 30)->>'premium')::boolean, 'premium verildi');
reset role;  -- RLS: yönetici başkasının satırını tablodan okuyamaz; doğrulama sunucu olarak
select t_ok((select premium and payload#>>'{userProfile,premium}' = 'true' and payload#>>'{billing,plan}' = 'premium'
  and (payload#>>'{userProfile,premiumUntil}')::timestamptz > now() + interval '29 days'
  from public.student_states where user_id = '00000000-0000-4000-8000-000000000002'), 'premium: sütun + payload + bitiş');
set role authenticated;
select t_ok(coalesce(auth.jwt()->>'role', '') = 'authenticated', 'işlemden sonra oturum rolü geri döndü');
select t_ok(not (public.admin_set_premium('00000000-0000-4000-8000-000000000002', 0)->>'premium')::boolean, 'premium geri alındı');
reset role;  -- RLS: yönetici başkasının satırını tablodan okuyamaz; doğrulama sunucu olarak
select t_ok((select not premium and payload#>>'{billing,plan}' = 'free' from public.student_states where user_id = '00000000-0000-4000-8000-000000000002'), 'premium kapalı');
set role authenticated;
select t_ok((public.admin_set_blocked('00000000-0000-4000-8000-000000000002', true)->>'blocked')::boolean, 'engellendi');
reset role;  -- RLS: yönetici başkasının satırını tablodan okuyamaz; doğrulama sunucu olarak
select t_ok((select blocked and payload#>>'{userProfile,blocked}' = 'true' from public.student_states where user_id = '00000000-0000-4000-8000-000000000002'), 'engel: sütun + payload');
set role authenticated;
select t_ok((public.admin_overview()->>'blocked')::int = 1, 'özet: engelli 1');
reset role;
-- engelli öğrenci engelini kaldıramaz
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000002');
update public.student_states set blocked = false, payload = jsonb_set(payload, '{userProfile,blocked}', 'false') where user_id = auth.uid();
reset role;
reset role;  -- RLS: yönetici başkasının satırını tablodan okuyamaz; doğrulama sunucu olarak
select t_ok((select blocked and payload#>>'{userProfile,blocked}' = 'true' from public.student_states where user_id = '00000000-0000-4000-8000-000000000002'), 'öğrenci kendi engelini kaldıramaz');
set role authenticated;
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1');
select t_ok(not (public.admin_set_blocked('00000000-0000-4000-8000-000000000002', false)->>'blocked')::boolean, 'engel kaldırıldı');
reset role;  -- RLS: yönetici başkasının satırını tablodan okuyamaz; doğrulama sunucu olarak
select t_ok((select not blocked and payload#>>'{userProfile,blocked}' = 'false' from public.student_states where user_id = '00000000-0000-4000-8000-000000000002'), 'engel kalktı: sütun + payload');
set role authenticated;
select t_err('select public.admin_set_blocked(''00000000-0000-4000-8000-0000000000a1'', true)', 'Kendini engelleyemezsin.', 'yönetici kendini engelleyemez');
select t_err('select public.admin_delete_user(''00000000-0000-4000-8000-0000000000a1'')', 'Kendi hesabını buradan silemezsin.', 'yönetici kendini silemez');

-- duyurular
select t_err('select public.admin_announce(''   '')', 'Duyuru metni boş olamaz.', 'boş duyuru reddedilir');
select t_ok((public.admin_announce('Yarın 21.00''de canlı deneme var', 24)->>'ok')::boolean, 'süreli duyuru eklendi');
select t_ok((public.admin_announce('Kalıcı duyuru')->>'expires_at') is null, 'süresiz duyuru eklendi');
select t_ok(jsonb_array_length(public.admin_announcements()) = 2, 'duyuru listesi 2');
select t_ok((select count(*) from public.app_announcements where body like '<!--kpss-exp:%-->Yarın%' and expires_at > now() + interval '23 hours') = 1, 'süreli duyuru: işaret + expires_at');
select t_ok((public.admin_overview()->>'announcements')::int = 2, 'özet: yayındaki duyuru 2');
select t_ok((public.admin_announce_delete((select id from public.app_announcements where body = 'Kalıcı duyuru'))->>'ok')::boolean, 'duyuru silindi');
select t_ok(jsonb_array_length(public.admin_announcements()) = 1, 'silmeden sonra 1 duyuru');
select t_err('select public.admin_announce_delete(''00000000-0000-4000-8000-00000000ffff'')', 'Duyuru bulunamadı.', 'olmayan duyuru silinemez');
reset role;
-- öğrenci yayındaki duyuruyu okuyabilir, yazamaz
set role authenticated;
select t_as('00000000-0000-4000-8000-000000000001');
select t_ok((select count(*) from public.app_announcements) = 1, 'öğrenci duyuruyu görür');
select t_err('insert into public.app_announcements (body, published) values (''sahte'', true)', '*', 'öğrenci duyuru ekleyemez');
reset role;

-- silme
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1');
select t_ok((public.admin_delete_user('00000000-0000-4000-8000-000000000003')->>'ok')::boolean, 'kullanıcı silindi');
reset role;
select t_ok(not exists (select 1 from public.student_states where user_id = '00000000-0000-4000-8000-000000000003')
  and not exists (select 1 from auth.users where id = '00000000-0000-4000-8000-000000000003'), 'silinen kullanıcının kaydı ve hesabı yok');

-- işlem geçmişi her işlemi yazar
set role authenticated;
select t_as('00000000-0000-4000-8000-0000000000a1');
select t_ok((select array_agg(distinct x->>'action' order by x->>'action') from jsonb_array_elements(public.admin_audit_log(100)) x)
  @> array['announce', 'approve_edu', 'block', 'delete_announce', 'delete_user', 'grant_premium', 'reject_edu', 'revoke_premium', 'unblock'], 'işlem geçmişi tüm işlemleri içerir');
select t_ok((select x->>'actor' from jsonb_array_elements(public.admin_audit_log(5)) x limit 1) = 'Yonetici', 'işlem geçmişinde yapan kişi adı');
reset role;

select 'TÜM YÖNETİM TESTLERİ GEÇTİ';
