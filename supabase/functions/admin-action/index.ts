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
    await admin.from("student_states").update({ premium: true }).eq("user_id", body.user_id);
  } else if (action === "block") {
    const { data: row } = await admin.from("student_states").select("payload").eq("user_id", body.user_id).maybeSingle();
    const payload = Object.assign({}, row?.payload || {}, { userProfile: Object.assign({}, row?.payload?.userProfile || {}, { blocked: true }) });
    await admin.from("student_states").update({ payload }).eq("user_id", body.user_id);
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
});
