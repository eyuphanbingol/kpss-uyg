// Deploy: supabase functions deploy store-sync
// Uygulama satın almadan (ya da "Satın alımları geri yükle"den) hemen sonra çağırır: giriş yapmış kullanıcının
// RevenueCat durumunu okuyup premium ve deneme kredilerini yazar. Bildirimi (store-webhook) beklemeye gerek kalmaz.
// Kullanıcı yalnız kendi hesabını eşitleyebilir; veri RevenueCat'ten gelir, istemciden değil.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { syncUser } from "../_shared/revenuecat.ts";

const ALLOWED_ORIGINS = ["https://www.atanly.com", "https://atanly.com", "https://kpss-uyg.vercel.app"];

function cors(req: Request) {
  const origin = req.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
    "Content-Type": "application/json"
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors(req) });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const url = Deno.env.get("SUPABASE_URL")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const auth = req.headers.get("Authorization") || "";
  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data, error } = await userClient.auth.getUser();
  if (error || !data || !data.user) return json({ error: "auth" }, 401);
  const admin = createClient(url, service, { auth: { persistSession: false } });
  try {
    const s = await syncUser(admin, data.user.id);
    return json({ ok: true, premium_until: s.premiumUntil, credits: s.credits.length });
  } catch (e) {
    console.error("store-sync", data.user.id, String(e && (e as Error).message || e));
    return json({ error: "sync_failed" }, 502);
  }
});
