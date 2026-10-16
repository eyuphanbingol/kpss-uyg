// Mobil Google girişi dönüş bağlantısı: kod ayrıştırma, akış kimliği ve tek seferlik kullanım.
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const src = readFileSync(new URL("../mobile/src/lib/authLinks.js", import.meta.url), "utf8");
const dir = mkdtempSync(join(tmpdir(), "authlinks-"));
const file = join(dir, "authLinks.mjs");
writeFileSync(file, src);
const L = await import(pathToFileURL(file).href);

let n = 0;
function ok(cond, msg) { if (!cond) { console.error("HATA:", msg); process.exit(1); } n++; }

const calls = [];
const client = { auth: {
    exchangeCodeForSession: async (code, opts) => { calls.push(["code", code, opts]); return { data: {}, error: null }; },
    setSession: async (s) => { calls.push(["set", s]); return { data: {}, error: null }; }
} };

const url = "atanly://auth/callback?sb_flow_id=flow-123&code=abc-def";
ok(L.isOAuthReturnUrl(url), "Google dönüşü tanınmalı");
ok(!L.isOAuthReturnUrl("atanly://auth/callback?token_hash=x&type=email"), "e-posta bağlantısı Google dönüşü sayılmamalı");
ok(!L.isOAuthReturnUrl("atanly://reset?code=abc"), "şifre sıfırlama Google dönüşü sayılmamalı");
ok(!L.isOAuthReturnUrl("atanly://"), "boş bağlantı");

const a = L.sessionFromOAuthUrl(client, url);
const b = L.sessionFromOAuthUrl(client, url);
await Promise.all([a, b]);
ok(calls.length === 1, "aynı kod bir kez kullanılmalı");
ok(calls[0][1] === "abc-def", "tam bağlantı değil yalnız kod gönderilmeli");
ok(calls[0][2] && calls[0][2].flowId === "flow-123", "akış kimliği iletilmeli");

await L.sessionFromOAuthUrl(client, "atanly://auth/callback?code=zzz");
ok(calls[1][1] === "zzz" && calls[1][2] === undefined, "akış kimliği yoksa yalnız kod");

await L.sessionFromOAuthUrl(client, "atanly://auth/callback#access_token=AT&refresh_token=RT");
ok(calls[2][0] === "set" && calls[2][1].access_token === "AT", "token'lı dönüş setSession ile açılmalı");

let rejected = false;
try { await L.sessionFromOAuthUrl(client, "atanly://auth/callback?error=access_denied&error_description=iptal"); } catch (e) { rejected = /iptal/.test(e.message); }
ok(rejected, "hata dönüşü hata vermeli");

console.log("Google giriş bağlantısı testleri: " + n + " kontrol geçti.");
