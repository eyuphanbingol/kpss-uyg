// Sunucu fonksiyonlarının saf mantığı: AdMob imza doğrulaması ve RevenueCat özeti.
//   node scripts/test-store-functions.mjs
import { verify, derToRaw, splitSigned } from "../supabase/functions/_shared/admob.ts";
import { summarize } from "../supabase/functions/_shared/revenuecat.ts";

let n = 0;
function ok(c, m) { if (!c) { console.error("HATA: " + m); process.exit(1); } n++; }

function b64url(u8) { return Buffer.from(u8).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function rawToDer(raw) {
  const int = (b) => { let i = 0; while (i < b.length - 1 && b[i] === 0) i++; b = b.slice(i); if (b[0] & 0x80) b = Uint8Array.from([0, ...b]); return [0x02, b.length, ...b]; };
  const body = [...int(raw.slice(0, 32)), ...int(raw.slice(32))];
  return Uint8Array.from([0x30, body.length, ...body]);
}

const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
const keys = { "3335741209": kp.publicKey };
const msg = "ad_network=5450213213286189855&ad_unit=1234567890&custom_data=map%3Agol-tektonik&reward_amount=1&reward_item=kilit&timestamp=1507770365237823&transaction_id=18fa792de1bca816048293fc71035638&user_id=00000000-0000-4000-8000-000000000001";
const raw = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, kp.privateKey, new TextEncoder().encode(msg)));
const der = rawToDer(raw);
ok(Buffer.from(derToRaw(der)).equals(Buffer.from(raw)), "DER → r||s dönüşümü");
const q = msg + "&signature=" + b64url(der) + "&key_id=3335741209";
ok(splitSigned(q).message === msg, "imzalanan kısım &signature= öncesi");
ok(await verify(q, keys), "geçerli imza kabul");
ok(!(await verify(q.replace("gol-tektonik", "gol-volkanik"), keys)), "değiştirilmiş içerik reddedilir");
ok(!(await verify(msg + "&signature=" + b64url(der) + "&key_id=999", keys)), "bilinmeyen anahtar reddedilir");
ok(!(await verify(msg, keys)), "imzasız istek reddedilir");

// RevenueCat özeti
const future = new Date(Date.now() + 30 * 864e5).toISOString();
const sub = {
  entitlements: { premium: { expires_date: future, product_identifier: "atanly_premium:aylik" } },
  subscriptions: { "atanly_premium:aylik": { store: "play_store", unsubscribe_detected_at: null, billing_issues_detected_at: null } },
  non_subscriptions: { deneme_kaydi: [
    { id: "rc1", store_transaction_id: "GPA.1", purchase_date: "2026-10-10T10:00:00Z", store: "play_store" },
    { id: "rc2", store_transaction_id: "GPA.2", purchase_date: "2026-10-12T10:00:00Z", store: "play_store" }] }
};
let s = summarize(sub);
ok(s.premiumUntil === future && s.store === "play_store" && s.willRenew === true, "abonelik bitişi ve yenileme");
ok(s.credits.length === 2 && s.credits[0].tx === "GPA.1", "deneme kredileri işlem numarasıyla");
sub.subscriptions["atanly_premium:aylik"].unsubscribe_detected_at = "2026-10-13T00:00:00Z";
ok(summarize(sub).willRenew === false, "iptal edilen abonelik yenilenmez");
sub.entitlements.premium.grace_period_expires_date = new Date(Date.now() + 40 * 864e5).toISOString();
ok(summarize(sub).premiumUntil === sub.entitlements.premium.grace_period_expires_date, "ek süre (grace) bitişe sayılır");
ok(summarize({}).premiumUntil === null && summarize({}).credits.length === 0, "boş abone");
ok(summarize({ entitlements: { premium: { expires_date: null, product_identifier: "x" } } }).premiumUntil.startsWith("9999"), "ömür boyu");
console.log("Sunucu fonksiyonu testleri: " + n + " kontrol geçti.");
