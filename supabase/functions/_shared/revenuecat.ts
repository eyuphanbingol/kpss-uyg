// RevenueCat ile mağaza satın almalarını doğrulayıp Supabase'e yazar (store-sync ve store-webhook ortak kodu).
// Ödeme Google Play / App Store'dadır; RevenueCat yalnız makbuzu doğrular. Burada RevenueCat'in REST API'sinden
// kullanıcının güncel durumu okunur (bildirim içeriğine güvenilmez) ve tablolara yazılır.
// Sırlar (Supabase → Edge Functions → Secrets): REVENUECAT_SECRET_KEY (sk_…), isteğe bağlı RC_ENTITLEMENT, RC_LIVE_PRODUCT.

export const PREMIUM_ENTITLEMENT = (globalThis as any).Deno?.env.get("RC_ENTITLEMENT") || "premium";
export const LIVE_PRODUCT = (globalThis as any).Deno?.env.get("RC_LIVE_PRODUCT") || "deneme_kaydi";

export function isUuid(v: unknown): v is string {
  return typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export type StoreSummary = {
  premiumUntil: string | null;
  product: string | null;
  store: string | null;
  willRenew: boolean | null;
  credits: { tx: string; product: string; store: string | null; purchasedAt: string | null }[];
};

function later(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(a) >= Date.parse(b) ? a : b;
}

// RevenueCat v1 "subscriber" nesnesinden premium bitişi ve canlı deneme kredileri.
export function summarize(sub: any, entitlement = PREMIUM_ENTITLEMENT, liveProduct = LIVE_PRODUCT): StoreSummary {
  const out: StoreSummary = { premiumUntil: null, product: null, store: null, willRenew: null, credits: [] };
  const ent = sub && sub.entitlements && sub.entitlements[entitlement];
  if (ent) {
    const product = ent.product_identifier || null;
    const s = product && sub.subscriptions ? sub.subscriptions[product] : null;
    // expires_date null = ömür boyu; ek süre (grace period) varsa o geçerli
    let until: string | null = ent.expires_date === null ? "9999-12-31T00:00:00Z" : (ent.expires_date || null);
    until = later(until, ent.grace_period_expires_date || null);
    if (s) until = later(until, s.grace_period_expires_date || null);
    out.premiumUntil = until;
    out.product = product;
    out.store = (s && s.store) || null;
    out.willRenew = s ? !s.unsubscribe_detected_at && !s.billing_issues_detected_at : null;
  }
  const list = (sub && sub.non_subscriptions && sub.non_subscriptions[liveProduct]) || [];
  for (const p of list) {
    const tx = String(p.store_transaction_id || p.id || "");
    if (!tx) continue;
    out.credits.push({ tx: tx.slice(0, 200), product: liveProduct, store: p.store || null, purchasedAt: p.purchase_date || null });
  }
  return out;
}

export async function fetchSubscriber(appUserId: string, fetchImpl: typeof fetch = fetch): Promise<any> {
  const key = (globalThis as any).Deno?.env.get("REVENUECAT_SECRET_KEY");
  if (!key) throw new Error("REVENUECAT_SECRET_KEY tanımlı değil");
  const r = await fetchImpl("https://api.revenuecat.com/v1/subscribers/" + encodeURIComponent(appUserId), {
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }
  });
  if (!r.ok) throw new Error("RevenueCat " + r.status);
  const body = await r.json();
  return body && body.subscriber;
}

// Tabloları günceller. Kredi satırları mağaza işlem numarasıyla tekildir: aynı satın alma iki kez yazılmaz.
export async function applySummary(admin: any, userId: string, s: StoreSummary) {
  const up = await admin.from("store_entitlements").upsert({
    user_id: userId,
    premium_until: s.premiumUntil,
    product: s.product,
    store: s.store,
    will_renew: s.willRenew,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id" });
  if (up.error) throw up.error;
  if (s.credits.length) {
    const ins = await admin.from("live_credits").upsert(s.credits.map((c) => ({
      user_id: userId, store_tx: c.tx, product: c.product, store: c.store, purchased_at: c.purchasedAt
    })), { onConflict: "store_tx", ignoreDuplicates: true });
    if (ins.error) throw ins.error;
  }
}

export async function syncUser(admin: any, userId: string, fetchImpl: typeof fetch = fetch) {
  const sub = await fetchSubscriber(userId, fetchImpl);
  const s = summarize(sub || {});
  await applySummary(admin, userId, s);
  return s;
}
