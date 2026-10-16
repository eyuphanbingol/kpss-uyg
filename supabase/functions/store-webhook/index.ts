// Deploy: supabase functions deploy store-webhook --no-verify-jwt
// RevenueCat bildirimleri (yenileme, iptal, süre bitişi, iade, satın alma) buraya gelir.
// RevenueCat → Project → Integrations → Webhooks: URL https://<proje>.supabase.co/functions/v1/store-webhook,
// "Authorization header" alanına REVENUECAT_WEBHOOK_AUTH sırrının değerini yaz (Supabase'de de aynı değer).
// Bildirimdeki içeriğe güvenilmez: yalnız hangi kullanıcının değiştiği alınır, durum RevenueCat API'sinden okunur.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isUuid, syncUser } from "../_shared/revenuecat.ts";

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method", { status: 405 });
  const secret = Deno.env.get("REVENUECAT_WEBHOOK_AUTH") || "";
  const got = req.headers.get("Authorization") || "";
  if (!secret || !(safeEqual(got, secret) || safeEqual(got, "Bearer " + secret))) {
    return new Response("unauthorized", { status: 401 });
  }
  let body: any = null;
  try { body = await req.json(); } catch (_e) { return new Response("bad json", { status: 400 }); }
  const ev = (body && body.event) || {};
  const ids = new Set<string>();
  for (const v of [ev.app_user_id, ev.original_app_user_id].concat(ev.aliases || [], ev.transferred_from || [], ev.transferred_to || [])) {
    if (isUuid(v)) ids.add(String(v).toLowerCase());
  }
  // RevenueCat panelindeki "Send test event": bağlantı ve şifre doğruysa buraya gelir
  if (ev.type === "TEST") return new Response(JSON.stringify({ ok: true, type: "TEST" }), { status: 200 });
  if (!ids.size) return new Response(JSON.stringify({ ok: true, skipped: "no_user" }), { status: 200 });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const results: Record<string, string> = {};
  for (const id of ids) {
    // Hesabı silinmiş (ya da hiç olmamış) kullanıcı: yazılacak yer yok. 200 ile atlanır; 500 dönersek
    // RevenueCat aynı bildirimi günlerce yeniden dener.
    const u = await admin.auth.admin.getUserById(id);
    if (u.error || !u.data || !u.data.user) {
      results[id] = "no_account";
      continue;
    }
    try {
      await syncUser(admin, id);
      results[id] = "ok";
    } catch (e) {
      results[id] = "error";
      console.error("store-webhook", ev.type, id, String(e && (e as Error).message || e));
    }
  }
  // yalnız gerçek hesaplarda yazma başarısızsa 500: RevenueCat bildirimi daha sonra yeniden dener
  const failed = Object.values(results).some((r) => r === "error") && !Object.values(results).some((r) => r === "ok");
  // hepsi başarısızsa 500: RevenueCat bildirimi daha sonra yeniden dener
  return new Response(JSON.stringify({ ok: !failed, type: ev.type || null }), { status: failed ? 500 : 200 });
});
