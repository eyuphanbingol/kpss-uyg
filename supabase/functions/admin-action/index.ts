// Deploy: supabase functions deploy admin-action
// Uses SERVICE ROLE only on the server. Client calls via functions.invoke.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const auth = req.headers.get("Authorization") || "";
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const admin = createClient(url, service);
  const { data: me } = await admin.from("student_states").select("role").eq("user_id", user.id).maybeSingle();
  if (!me || me.role !== "admin") return new Response("forbidden", { status: 403 });

  const body = await req.json();
  const action = body.action;

  if (action === "grant_premium") {
    const { data: row } = await admin.from("student_states").select("payload").eq("user_id", body.user_id).maybeSingle();
    const until = new Date();
    until.setDate(until.getDate() + (Number(body.days) || 30));
    const payload = Object.assign({}, row?.payload || {}, {
      userProfile: Object.assign({}, row?.payload?.userProfile || {}, {
        premium: true,
        premiumUntil: until.toISOString()
      }),
      billing: Object.assign({}, row?.payload?.billing || {}, { plan: "premium" })
    });
    await admin.from("student_states").update({ premium: true, payload }).eq("user_id", body.user_id);
  } else if (action === "revoke_premium") {
    const { data: row } = await admin.from("student_states").select("payload").eq("user_id", body.user_id).maybeSingle();
    const payload = Object.assign({}, row?.payload || {}, {
      userProfile: Object.assign({}, row?.payload?.userProfile || {}, { premium: false, premiumUntil: null }),
      billing: Object.assign({}, row?.payload?.billing || {}, { plan: "free" })
    });
    await admin.from("student_states").update({ premium: false, payload }).eq("user_id", body.user_id);
  } else if (action === "block") {
    const { data: row } = await admin.from("student_states").select("payload").eq("user_id", body.user_id).maybeSingle();
    const payload = Object.assign({}, row?.payload || {}, {
      userProfile: Object.assign({}, row?.payload?.userProfile || {}, { blocked: true })
    });
    await admin.from("student_states").update({ payload }).eq("user_id", body.user_id);
  } else if (action === "announce") {
    await admin.from("app_announcements").insert({
      body: String(body.text || "").slice(0, 500),
      published: true,
      created_by: user.id
    });
  } else if (action === "inspect_user") {
    const { data } = await admin.from("student_states").select("nickname,education_level,target_type,premium,questions_total,last_study_at,payload,platform,role").eq("user_id", body.user_id).maybeSingle();
    const p = data?.payload || {};
    return new Response(JSON.stringify({
      ok: true,
      data: {
        nickname: data?.nickname,
        education_level: data?.education_level,
        target_type: data?.target_type,
        premium: data?.premium,
        questions_total: data?.questions_total,
        last_study_at: data?.last_study_at,
        platform: data?.platform,
        role: data?.role,
        streak: p.streak || null,
        counters: p.counters || null,
        wrongCount: (p.wrongBook || []).length
      }
    }), { headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
});
