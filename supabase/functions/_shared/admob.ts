// AdMob ödüllü reklam sunucu doğrulaması (SSV) imza kontrolü.
// Google, ödül verilince geri çağırma URL'sine imzalı bir GET isteği atar. İmzalanan içerik, sorgu dizesinin
// "&signature=" öncesindeki kısmıdır; imza ECDSA P-256 / SHA-256, DER biçiminde ve web-güvenli base64'tür.
// Anahtarlar: https://www.gstatic.com/admob/reward/verifier-keys.json

export const KEYS_URL = "https://www.gstatic.com/admob/reward/verifier-keys.json";

export function b64urlToBytes(s: string): Uint8Array {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// DER (SEQUENCE{INTEGER r, INTEGER s}) → WebCrypto'nun beklediği 64 baytlık r||s
export function derToRaw(der: Uint8Array): Uint8Array {
  let i = 0;
  if (der[i++] !== 0x30) throw new Error("der");
  let len = der[i++];
  if (len & 0x80) i += len & 0x7f;
  const read = () => {
    if (der[i++] !== 0x02) throw new Error("der int");
    const n = der[i++];
    let v = der.slice(i, i + n);
    i += n;
    while (v.length > 32 && v[0] === 0) v = v.slice(1);
    if (v.length > 32) throw new Error("der len");
    const p = new Uint8Array(32);
    p.set(v, 32 - v.length);
    return p;
  };
  const r = read();
  const s = read();
  const out = new Uint8Array(64);
  out.set(r, 0);
  out.set(s, 32);
  return out;
}

// rawQuery: "?" olmadan, URL'deki haliyle (çözülmeden) sorgu dizesi
export function splitSigned(rawQuery: string): { message: string; signature: string; keyId: string } | null {
  const at = rawQuery.indexOf("&signature=");
  if (at < 0) return null;
  const message = rawQuery.slice(0, at);
  const rest = new URLSearchParams(rawQuery.slice(at + 1));
  const signature = rest.get("signature") || "";
  const keyId = rest.get("key_id") || "";
  if (!signature || !keyId) return null;
  return { message, signature, keyId };
}

let cache: { at: number; keys: Record<string, CryptoKey> } | null = null;

export async function loadKeys(fetchImpl: typeof fetch = fetch, force = false): Promise<Record<string, CryptoKey>> {
  if (!force && cache && Date.now() - cache.at < 12 * 3600 * 1000) return cache.keys;
  const r = await fetchImpl(KEYS_URL);
  if (!r.ok) throw new Error("keys " + r.status);
  const body = await r.json();
  const keys: Record<string, CryptoKey> = {};
  for (const k of body.keys || []) {
    keys[String(k.keyId)] = await crypto.subtle.importKey("spki", b64urlToBytes(k.base64),
      { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  }
  cache = { at: Date.now(), keys };
  return keys;
}

export async function verify(rawQuery: string, keys: Record<string, CryptoKey>): Promise<boolean> {
  const parts = splitSigned(rawQuery);
  if (!parts) return false;
  const key = keys[parts.keyId];
  if (!key) return false;
  let raw: Uint8Array;
  try { raw = derToRaw(b64urlToBytes(parts.signature)); } catch (_e) { return false; }
  return crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, key, raw, new TextEncoder().encode(parts.message));
}
