// Deploy: supabase functions deploy admin-action
// Uses SERVICE ROLE only on the server. Client calls via functions.invoke.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

function eduReqFromPayload(payload: any) {
  if (!payload || typeof payload !== "object") return null;
  const nested = payload.userProfile && payload.userProfile.educationChangeRequest;
  const root = payload.educationChangeRequest;
  const req = nested || root;
  if (!req || typeof req !== "object") return null;
  return req;
}

function writeEduReq(payload: any, req: any) {
  const next = Object.assign({}, payload || {});
  next.userProfile = Object.assign({}, next.userProfile || {}, { educationChangeRequest: req });
  next.educationChangeRequest = req;
  return next;
}

function locLabel(loc: any) {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  const city = loc.city || loc.region || "";
  const country = loc.country || loc.countryCode || "";
  if (city && country) return city + ", " + country;
  return city || country || loc.tz || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const auth = req.headers.get("Authorization") || "";
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ ok: false, error: "unauthorized" }, 401);

  const admin = createClient(url, service);
  const body = await req.json();
  const action = body.action;
  const levels: Record<string, string> = {
    lisans: "2026-09-06",
    onlisans: "2026-10-04",
    ortaogretim: "2026-10-25"
  };

  if (action === "submit_edu") {
    const to = String(body.to || "").trim();
    if (!levels[to]) return json({ ok: false, error: "invalid level" }, 400);
    const { data: row } = await admin.from("student_states").select("payload,education_level").eq("user_id", user.id).maybeSingle();
    const payload = Object.assign({}, row?.payload || {});
    const from = (payload.userProfile && payload.userProfile.educationLevel) || row?.education_level || "lisans";
    if (to === from) return json({ ok: false, error: "same" }, 400);
    const reqObj = { from, to, at: new Date().toISOString(), status: "pending" };
    const next = writeEduReq(payload, reqObj);
    next.userProfile = Object.assign({}, next.userProfile || {}, { educationLevel: from });
    await admin.from("student_states").update({ payload: next }).eq("user_id", user.id);
    return json({ ok: true, data: reqObj });
  }

  const { data: me } = await admin.from("student_states").select("role").eq("user_id", user.id).maybeSingle();
  if (!me || me.role !== "admin") return json({ ok: false, error: "forbidden" }, 403);

  if (action === "user_list") {
    const { data } = await admin.from("student_states")
      .select("user_id,nickname,education_level,target_type,platform,premium,last_study_at,questions_total,updated_at,role,payload")
      .order("updated_at", { ascending: false })
      .limit(400);
    const list = (data || []).map((r: any) => {
      const p = r.payload || {};
      const up = p.userProfile || {};
      return {
        user_id: r.user_id,
        nickname: r.nickname,
        education_level: r.education_level,
        target_type: r.target_type,
        platform: r.platform,
        premium: r.premium,
        last_study_at: r.last_study_at,
        questions_total: r.questions_total,
        updated_at: r.updated_at,
        role: r.role,
        location: locLabel(up.location)
      };
    });
    return json({ ok: true, data: list });
  }

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
    const text = String(body.text || "").trim().slice(0, 500);
    if (!text) return json({ ok: false, error: "empty" }, 400);
    const hours = Number(body.hours);
    const expiresAt = (hours > 0 && isFinite(hours))
      ? new Date(Date.now() + hours * 3600 * 1000).toISOString()
      : null;
    const stored = (expiresAt ? ("<!--kpss-exp:" + expiresAt + "-->") : "") + text;
    const row: Record<string, unknown> = {
      body: stored,
      published: true,
      created_by: user.id
    };
    if (expiresAt) row.expires_at = expiresAt;
    const ins = await admin.from("app_announcements").insert(row);
    if (ins.error && /expires_at/i.test(ins.error.message || "")) {
      await admin.from("app_announcements").insert({
        body: stored,
        published: true,
        created_by: user.id
      });
    } else if (ins.error) {
      return json({ ok: false, error: ins.error.message }, 500);
    }
  } else if (action === "list_edu_requests") {
    const pending: any[] = [];
    const seen: Record<string, boolean> = {};
    let from = 0;
    for (let page = 0; page < 20; page++) {
      const { data, error } = await admin.from("student_states")
        .select("user_id,nickname,education_level,payload")
        .range(from, from + 199);
      if (error) return json({ ok: false, error: error.message }, 500);
      const rows = data || [];
      rows.forEach(function (row: any) {
        const req = eduReqFromPayload(row.payload);
        if (!req || req.status !== "pending" || seen[row.user_id]) return;
        seen[row.user_id] = true;
        pending.push({
          user_id: row.user_id,
          nickname: row.nickname,
          from: req.from || row.education_level,
          to: req.to,
          at: req.at
        });
      });
      if (rows.length < 200) break;
      from += 200;
    }
    return json({ ok: true, data: pending });
  } else if (action === "approve_edu") {
    const { data: row } = await admin.from("student_states").select("payload").eq("user_id", body.user_id).maybeSingle();
    const payload = Object.assign({}, row?.payload || {});
    const existing = eduReqFromPayload(payload);
    const to = String(body.to || (existing && existing.to) || "").trim();
    if (!levels[to]) return json({ ok: false, error: "invalid level" }, 400);
    const reqObj = { status: "approved", to: to, at: new Date().toISOString() };
    const next = writeEduReq(payload, reqObj);
    next.userProfile = Object.assign({}, next.userProfile || {}, { educationLevel: to });
    next.profile = Object.assign({}, next.profile || {}, { examDate: levels[to] });
    await admin.from("student_states").update({ payload: next, education_level: to }).eq("user_id", body.user_id);
  } else if (action === "reject_edu") {
    const { data: row } = await admin.from("student_states").select("payload").eq("user_id", body.user_id).maybeSingle();
    const payload = Object.assign({}, row?.payload || {});
    const existing = eduReqFromPayload(payload) || {};
    const reqObj = Object.assign({}, existing, { status: "rejected", at: new Date().toISOString() });
    const next = writeEduReq(payload, reqObj);
    await admin.from("student_states").update({ payload: next }).eq("user_id", body.user_id);
  } else if (action === "delete_user") {
    const uid = String(body.user_id || "").trim();
    if (!uid) return json({ ok: false, error: "missing user" }, 400);
    if (uid === user.id) return json({ ok: false, error: "Kendini silemezsin" }, 400);
    const { data: target } = await admin.from("student_states").select("role").eq("user_id", uid).maybeSingle();
    if (target && target.role === "admin") return json({ ok: false, error: "Admin silinemez" }, 400);
    await admin.from("referrals").delete().eq("owner", uid);
    await admin.from("instructor_group_members").delete().eq("user_id", uid);
    await admin.from("instructor_groups").delete().eq("owner", uid);
    await admin.from("exam_ranks").delete().eq("user_id", uid);
    await admin.from("leaderboard_weekly").delete().eq("user_id", uid);
    await admin.from("student_states").delete().eq("user_id", uid);
    const del = await admin.auth.admin.deleteUser(uid);
    if (del.error) return json({ ok: false, error: del.error.message }, 500);
    return json({ ok: true });
  } else if (action === "inspect_user") {
    const { data } = await admin.from("student_states").select("nickname,education_level,target_type,premium,questions_total,last_study_at,payload,platform,role").eq("user_id", body.user_id).maybeSingle();
    const p = data?.payload || {};
    const req = eduReqFromPayload(p);
    return json({
      ok: true,
      data: {
        nickname: data?.nickname,
        user_id: body.user_id,
        education_level: data?.education_level,
        target_type: data?.target_type,
        premium: data?.premium,
        questions_total: data?.questions_total,
        last_study_at: data?.last_study_at,
        platform: data?.platform,
        role: data?.role,
        location: locLabel(p.userProfile && p.userProfile.location),
        streak: p.streak || null,
        counters: p.counters || null,
        wrongCount: (p.wrongBook || []).length,
        educationChangeRequest: req
      }
    });
  }

  return json({ ok: true });
});
