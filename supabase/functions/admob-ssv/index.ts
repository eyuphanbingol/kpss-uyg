// Deploy: supabase functions deploy admob-ssv --no-verify-jwt
// AdMob → Uygulamalar → Ödüllü reklam birimi → "Sunucu tarafı doğrulama" URL'si:
//   https://<proje>.supabase.co/functions/v1/admob-ssv
// Uygulama reklamı açarken user_id = Supabase kullanıcı kimliği, custom_data = açılacak öğe (ör. "map:gol-tektonik")
// gönderir. Google imzası doğrulanınca öğe o kullanıcı için monet_settings.ad_unlock_hours (24 saat) açılır;
// web'de de geçerli olur. Aynı ödül (transaction_id) iki kez sayılmaz.
// İsteğe bağlı sır: ADMOB_REWARDED_UNIT_IDS (virgülle ayrılmış reklam birimi numaraları; başka birimden gelen reddedilir).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { loadKeys, verify } from "../_shared/admob.ts";
import { isUuid } from "../_shared/revenuecat.ts";

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "GET") return new Response("method", { status: 405 });
  const url = new URL(req.url);
  const rawQuery = url.search.replace(/^\?/, "");
  let valid = false;
  try {
    valid = await verify(rawQuery, await loadKeys());
    if (!valid) valid = await verify(rawQuery, await loadKeys(fetch, true)); // anahtar yenilenmiş olabilir
  } catch (e) {
    console.error("admob-ssv keys", String(e && (e as Error).message || e));
    return new Response("keys", { status: 503 });
  }
  if (!valid) return new Response("bad signature", { status: 400 });

  const q = url.searchParams;
  const units = (Deno.env.get("ADMOB_REWARDED_UNIT_IDS") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const unit = q.get("ad_unit") || "";
  if (units.length && units.indexOf(unit) < 0) return ok({ ok: false, skipped: "unit" });
  const userId = (q.get("user_id") || "").toLowerCase();
  const item = (q.get("custom_data") || "").toLowerCase();
  const tx = q.get("transaction_id") || "";
  // AdMob konsolundaki "URL'yi doğrula" testi kullanıcı göndermez: imza doğruysa 200
  if (!isUuid(userId) || !/^[a-z0-9:_.\-]{1,120}$/.test(item) || !tx) return ok({ ok: true, skipped: "test_or_incomplete" });

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const first = await admin.from("ad_rewards").insert({ tx: tx.slice(0, 200), user_id: userId, item_key: item });
  if (first.error) {
    if (String(first.error.code) === "23505") return ok({ ok: true, duplicate: true });
    console.error("admob-ssv insert", first.error.message);
    return new Response("db", { status: 500 });
  }
  const st = await admin.from("monet_settings").select("ad_unlock_hours").eq("id", 1).maybeSingle();
  const hours = (st.data && st.data.ad_unlock_hours) || 24;
  const until = new Date(Date.now() + hours * 3600 * 1000).toISOString();
  const up = await admin.from("ad_unlocks").upsert({ user_id: userId, item_key: item, until }, { onConflict: "user_id,item_key" });
  if (up.error) {
    console.error("admob-ssv unlock", up.error.message);
    return new Response("db", { status: 500 });
  }
  return ok({ ok: true, until });
});
