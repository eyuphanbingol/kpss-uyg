/**
 * Canlı deneme sınavı: web ve mobilin ortak motoru (saf JS, DOM/React yok).
 * Mobil kopyası scripts/sync-map-data.js ile üretilir (mobile/src/lib/liveExam.js).
 *
 *  - Saat: sunucudan alınır; cihaz saati değişse de geri sayım bozulmaz (monoton sayaç).
 *  - Cevap kuyruğu: her işaretleme önce cihaza yazılır, sonra toplu gönderilir; bağlantı
 *    gidince bekler, gelince kaldığı yerden gönderir.
 *  - Kitapçık şifresi: SHA-256 sayaç modu akış şifresi (WebCrypto gerektirmez, mobilde de çalışır).
 *  - Yükleme doğrulayıcısı ve rapor yardımcıları.
 */
(function (global) {
    "use strict";

    var TZ_OFFSET_MIN = 180; // Europe/Istanbul: 2016'dan beri sabit UTC+3
    var TRACKS = { lisans: "Lisans", onlisans: "Önlisans", ortaogretim: "Ortaöğretim" };
    var BOLUM = { GY: "Genel Yetenek", GK: "Genel Kültür" };
    // Lisans KPSS GY-GK dağılımı (ÖSYM)
    var LISANS_PLAN = [
        { ders: "Türkçe", bolum: "GY", n: 30 },
        { ders: "Matematik", bolum: "GY", n: 22 },
        { ders: "Geometri", bolum: "GY", n: 8 },
        { ders: "Tarih", bolum: "GK", n: 27 },
        { ders: "Coğrafya", bolum: "GK", n: 18 },
        { ders: "Vatandaşlık", bolum: "GK", n: 9 },
        { ders: "Güncel Bilgiler", bolum: "GK", n: 6 }
    ];
    var LETTERS = ["A", "B", "C", "D", "E"];

    // ---------------------------------------------------------------
    // saat
    // ---------------------------------------------------------------
    function mono() {
        if (typeof performance !== "undefined" && performance && typeof performance.now === "function") return performance.now();
        return Date.now(); // son çare
    }

    // Sunucu saatini (ms) monoton sayaçla ilerletir. Cihaz saati değişse de etkilenmez.
    function createClock(serverMs) {
        var base = Number(serverMs) || Date.now();
        var at = mono();
        return {
            now: function () { return base + (mono() - at); },
            sync: function (ms) { if (ms) { base = Number(ms); at = mono(); } },
            synced: !!serverMs
        };
    }

    function ms(iso) { return iso ? new Date(iso).getTime() : 0; }

    // İstanbul saatiyle bileşenler (Intl gerektirmez)
    function trParts(t) {
        var d = new Date(Number(t) + TZ_OFFSET_MIN * 60000);
        return { y: d.getUTCFullYear(), mo: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), wd: d.getUTCDay() };
    }
    var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    var GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function fmtClock(t) { var p = trParts(t); return pad(p.h) + ":" + pad(p.mi); }
    function fmtDay(t, withWeekday) {
        var p = trParts(t);
        return p.d + " " + AYLAR[p.mo] + (withWeekday ? " " + GUNLER[p.wd] : "");
    }
    function fmtDate(t) { var p = trParts(t); return p.d + " " + AYLAR[p.mo] + " " + p.y; }

    function fmtLeft(msLeft) {
        if (msLeft <= 0) return "0 sn";
        var s = Math.floor(msLeft / 1000);
        var d = Math.floor(s / 86400); s -= d * 86400;
        var h = Math.floor(s / 3600); s -= h * 3600;
        var m = Math.floor(s / 60); s -= m * 60;
        if (d > 0) return d + " gün " + h + " sa";
        if (h > 0) return h + " sa " + m + " dk";
        if (m > 0) return m + " dk " + pad(s) + " sn";
        return s + " sn";
    }
    function fmtTimer(msLeft) {
        if (msLeft < 0) msLeft = 0;
        var s = Math.floor(msLeft / 1000);
        var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
        return (h ? h + ":" + pad(m) : pad(m)) + ":" + pad(sec);
    }

    // ---------------------------------------------------------------
    // aşamalar
    // ---------------------------------------------------------------
    // Panodaki deneme için kullanıcının bulunduğu aşama.
    function phase(dash, now) {
        var e = dash && dash.exam;
        var reg = dash && dash.registration;
        var att = dash && dash.attempt;
        if (!e) return "none";
        var t = now;
        var registered = !!(reg && reg.status === "registered");
        var waitlist = !!(reg && reg.status === "waitlist");
        if (t < ms(e.reg_closes_at)) return registered ? "registered" : (waitlist ? "waitlist" : "reg_open");
        if (!registered) return t < ms(e.ends_at) ? "reg_closed" : "over_unregistered";
        if (t < ms(e.starts_at)) return "about_to_start";
        if (att && att.locked) return "locked";
        // kâğıtta çözen: cevaplar optik formla, bitişten sonra okutma süresi (optic_until) içinde gelir
        var paper = !!(att && att.mode === "paper");
        if (t < ms(e.ends_at)) {
            if (paper) return att.submitted ? "paper_submitted" : "paper_solving";
            if (att && att.submitted) return "submitted";
            if (att) return "in_progress";
            return t < ms(e.entry_closes_at) ? "can_enter" : "entry_closed";
        }
        if (!att) return "missed_live";
        if (paper && !att.submitted) return t < ms(e.optic_until || e.ranking_at) ? "optic_window" : "optic_missed";
        return t < ms(e.ranking_at) ? "ended" : "ranking";
    }

    // ---------------------------------------------------------------
    // UTF-8 ve hex
    // ---------------------------------------------------------------
    function utf8Encode(str) {
        var out = [], i, c;
        for (i = 0; i < str.length; i++) {
            c = str.charCodeAt(i);
            if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
                var c2 = str.charCodeAt(i + 1);
                if (c2 >= 0xdc00 && c2 <= 0xdfff) { c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00); i++; }
            }
            if (c < 0x80) out.push(c);
            else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
            else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
            else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
        }
        return new Uint8Array(out);
    }
    function utf8Decode(bytes) {
        var out = "", i = 0, c;
        var parts = [];
        while (i < bytes.length) {
            c = bytes[i++];
            if (c < 0x80) out += String.fromCharCode(c);
            else if (c < 0xe0) out += String.fromCharCode(((c & 31) << 6) | (bytes[i++] & 63));
            else if (c < 0xf0) out += String.fromCharCode(((c & 15) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63));
            else {
                var cp = ((c & 7) << 18) | ((bytes[i++] & 63) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63);
                cp -= 0x10000;
                out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 1023));
            }
            if (out.length > 8192) { parts.push(out); out = ""; }
        }
        parts.push(out);
        return parts.join("");
    }
    function toHex(bytes) {
        var s = "", i;
        for (i = 0; i < bytes.length; i++) s += (bytes[i] < 16 ? "0" : "") + bytes[i].toString(16);
        return s;
    }
    function fromHex(hex) {
        var out = new Uint8Array(hex.length / 2), i;
        for (i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
        return out;
    }

    // ---------------------------------------------------------------
    // SHA-256 (FIPS 180-4)
    // ---------------------------------------------------------------
    var K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var W = new Int32Array(64);

    function compress(H, block, off) {
        var i, a, b, c, d, e, f, g, h, t1, t2, x, y;
        for (i = 0; i < 16; i++) {
            W[i] = (block[off + i * 4] << 24) | (block[off + i * 4 + 1] << 16) | (block[off + i * 4 + 2] << 8) | block[off + i * 4 + 3];
        }
        for (i = 16; i < 64; i++) {
            x = W[i - 15]; y = W[i - 2];
            W[i] = (((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3))
                + W[i - 7] + (((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10)) + W[i - 16] | 0;
        }
        a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];
        for (i = 0; i < 64; i++) {
            t1 = h + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7)))
                + ((e & f) ^ (~e & g)) + K[i] + W[i] | 0;
            t2 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10)))
                + ((a & b) ^ (a & c) ^ (b & c)) | 0;
            h = g; g = f; f = e; e = d + t1 | 0; d = c; c = b; b = a; a = t1 + t2 | 0;
        }
        H[0] = H[0] + a | 0; H[1] = H[1] + b | 0; H[2] = H[2] + c | 0; H[3] = H[3] + d | 0;
        H[4] = H[4] + e | 0; H[5] = H[5] + f | 0; H[6] = H[6] + g | 0; H[7] = H[7] + h | 0;
    }
    function initH() {
        return new Int32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
    }
    function sha256(bytes) {
        var H = initH();
        var len = bytes.length;
        var full = Math.floor(len / 64), i;
        for (i = 0; i < full; i++) compress(H, bytes, i * 64);
        var restLen = len - full * 64;
        var tail = new Uint8Array(restLen < 56 ? 64 : 128);
        tail.set(bytes.subarray(full * 64));
        tail[restLen] = 0x80;
        var bits = len * 8;
        var hi = Math.floor(bits / 0x100000000), lo = bits >>> 0;
        var p = tail.length - 8;
        tail[p] = hi >>> 24; tail[p + 1] = (hi >>> 16) & 255; tail[p + 2] = (hi >>> 8) & 255; tail[p + 3] = hi & 255;
        tail[p + 4] = lo >>> 24; tail[p + 5] = (lo >>> 16) & 255; tail[p + 6] = (lo >>> 8) & 255; tail[p + 7] = lo & 255;
        compress(H, tail, 0);
        if (tail.length === 128) compress(H, tail, 64);
        var out = new Uint8Array(32);
        for (i = 0; i < 8; i++) {
            out[i * 4] = H[i] >>> 24; out[i * 4 + 1] = (H[i] >>> 16) & 255; out[i * 4 + 2] = (H[i] >>> 8) & 255; out[i * 4 + 3] = H[i] & 255;
        }
        return out;
    }

    // ---------------------------------------------------------------
    // Kitapçık şifresi: anahtar(32) || nonce(16) || sayaç(4) -> SHA-256 blokları, XOR.
    // Anahtar 10:15'e kadar sunucuda kalır; bütünlük düz metnin SHA-256'sıyla denetlenir.
    // ---------------------------------------------------------------
    function randomBytes(n) {
        var out = new Uint8Array(n), i;
        var c = (typeof global !== "undefined" && global.crypto) || (typeof crypto !== "undefined" ? crypto : null);
        if (c && typeof c.getRandomValues === "function") { c.getRandomValues(out); return out; }
        for (i = 0; i < n; i++) out[i] = Math.floor(Math.random() * 256);
        return out;
    }

    function keystreamXor(data, keyBytes, nonce, startBlock, endBlock) {
        var msg = new Uint8Array(64);
        msg.set(keyBytes, 0);
        msg.set(nonce, 32);
        msg[52] = 0x80;
        msg[62] = 0x01; msg[63] = 0xa0; // 52 bayt = 416 bit
        var H, i, j, ctr, off, ks = new Uint8Array(32);
        for (i = startBlock; i < endBlock; i++) {
            ctr = i;
            msg[48] = (ctr >>> 24) & 255; msg[49] = (ctr >>> 16) & 255; msg[50] = (ctr >>> 8) & 255; msg[51] = ctr & 255;
            H = initH();
            compress(H, msg, 0);
            for (j = 0; j < 8; j++) {
                ks[j * 4] = H[j] >>> 24; ks[j * 4 + 1] = (H[j] >>> 16) & 255; ks[j * 4 + 2] = (H[j] >>> 8) & 255; ks[j * 4 + 3] = H[j] & 255;
            }
            off = i * 32;
            for (j = 0; j < 32 && off + j < data.length; j++) data[off + j] ^= ks[j];
        }
    }

    // Düz metni şifreler: çıktı = nonce(16) || şifreli. Dönen: {bytes, keyHex, sha}
    function encryptBooklet(plainText, keyHex) {
        var plain = utf8Encode(plainText);
        var key = keyHex ? fromHex(keyHex) : randomBytes(32);
        var nonce = randomBytes(16);
        var data = new Uint8Array(plain);
        keystreamXor(data, key, nonce, 0, Math.ceil(data.length / 32));
        var out = new Uint8Array(16 + data.length);
        out.set(nonce, 0);
        out.set(data, 16);
        return { bytes: out, keyHex: toHex(key), sha: toHex(sha256(plain)) };
    }

    // Parça parça çözer (arayüz donmasın). Dönen Promise: düz metin.
    function decryptBooklet(bytes, keyHex, shaHex) {
        return new Promise(function (resolve, reject) {
            if (!bytes || bytes.length < 17 || !/^[0-9a-f]{64}$/.test(keyHex || "")) { reject(new Error("Kitapçık bozuk.")); return; }
            var key = fromHex(keyHex);
            var nonce = bytes.subarray(0, 16);
            var data = new Uint8Array(bytes.subarray(16));
            var blocks = Math.ceil(data.length / 32);
            var step = 4096, at = 0;
            function run() {
                var end = Math.min(blocks, at + step);
                keystreamXor(data, key, nonce, at, end);
                at = end;
                if (at < blocks) { setTimeout(run, 0); return; }
                if (shaHex && shaHex !== "sha" && toHex(sha256(data)) !== shaHex) { reject(new Error("Kitapçık doğrulanamadı.")); return; }
                resolve(utf8Decode(data));
            }
            run();
        });
    }

    // Kitapçık içeriği: cevaplar ve çözümler ASLA girmez.
    function bookletText(exam, questions, images) {
        return JSON.stringify({
            v: 1,
            title: exam.title || "",
            track: exam.track || "lisans",
            questions: questions.map(function (q) {
                return {
                    no: q.no, bolum: q.bolum, ders: q.ders, konu: q.konu, stem: q.stem, options: q.options,
                    image: q.image && images && images[q.image] ? images[q.image] : null
                };
            })
        });
    }

    // ---------------------------------------------------------------
    // Cevap kuyruğu
    // ---------------------------------------------------------------
    // store: {getItem, setItem} (localStorage ya da mobil karşılığı)
    // send(list) -> Promise; list: [{no, c, ms}]
    function createQueue(opts) {
        var storeKey = opts.key;
        var store = opts.store;
        var send = opts.send;
        var onState = opts.onState || function () {};
        var pending = {};
        var answers = {};
        var timer = null, busy = false, failures = 0, stopped = false;
        try {
            var saved = JSON.parse((store && store.getItem(storeKey)) || "null");
            if (saved && saved.pending) pending = saved.pending;
            if (saved && saved.answers) answers = saved.answers;
        } catch (e) { pending = {}; }

        function persist() {
            try { if (store) store.setItem(storeKey, JSON.stringify({ pending: pending, answers: answers })); } catch (e) {}
        }
        function count() { return Object.keys(pending).length; }
        function schedule(delay) {
            if (stopped) return;
            if (timer) clearTimeout(timer);
            timer = setTimeout(flush, delay);
        }
        function flush() {
            timer = null;
            if (busy || stopped || !count()) return Promise.resolve();
            busy = true;
            var batch = Object.keys(pending).map(function (no) {
                var a = pending[no];
                return { no: Number(no), c: a.c, ms: a.ms || 0, v: a.v };
            });
            onState({ syncing: true, pending: count() });
            return send(batch.map(function (b) { return { no: b.no, c: b.c, ms: b.ms }; })).then(function () {
                batch.forEach(function (b) {
                    if (pending[b.no] && pending[b.no].v === b.v) delete pending[b.no];
                });
                failures = 0;
                busy = false;
                persist();
                onState({ syncing: false, pending: count(), ok: true });
                if (count()) schedule(300);
            }, function (err) {
                busy = false;
                failures++;
                onState({ syncing: false, pending: count(), ok: false, error: err });
                var fatal = err && err.fatal;
                if (!fatal) schedule(Math.min(15000, 1000 * Math.pow(2, Math.min(failures, 4))));
            });
        }
        return {
            set: function (no, choice, msSpent) {
                var cur = answers[no] || {};
                var v = (cur.v || 0) + 1;
                answers[no] = { c: choice || null, ms: Math.max(cur.ms || 0, msSpent || 0), v: v };
                pending[no] = answers[no];
                persist();
                onState({ pending: count() });
                schedule(800);
            },
            addTime: function (no, msSpent) {
                var cur = answers[no];
                if (!cur) { answers[no] = { c: null, ms: msSpent, v: 1 }; return; }
                cur.ms = Math.max(cur.ms || 0, msSpent);
            },
            seed: function (list) {
                // sunucudaki cevapları al; cihazda bekleyenler önceliklidir
                (list || []).forEach(function (a) {
                    if (pending[a.no]) return;
                    answers[a.no] = { c: a.c || null, ms: a.ms || 0, v: (answers[a.no] && answers[a.no].v) || 0 };
                });
                persist();
            },
            get: function (no) { return answers[no] ? answers[no].c : null; },
            ms: function (no) { return answers[no] ? answers[no].ms || 0 : 0; },
            all: function () { return answers; },
            pendingCount: count,
            flush: flush,
            stop: function () { stopped = true; if (timer) clearTimeout(timer); },
            clear: function () { pending = {}; answers = {}; try { if (store) store.setItem(storeKey, ""); } catch (e) {} }
        };
    }

    function deviceId(store) {
        var k = "kpss-live-device";
        var v = null;
        try { v = store && store.getItem(k); } catch (e) { v = null; }
        if (!v || v.length < 16) {
            v = "d-" + toHex(randomBytes(12));
            try { if (store) store.setItem(k, v); } catch (e) {}
        }
        return v;
    }

    // ---------------------------------------------------------------
    // Yükleme doğrulayıcısı
    // ---------------------------------------------------------------
    function fold(s) {
        return String(s || "").toLocaleLowerCase("tr")
            .replace(/[ıi̇]/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[âà]/g, "a").replace(/[îì]/g, "i").replace(/[ûù]/g, "u")
            .replace(/[^a-z0-9]+/g, " ").trim();
    }
    function lev(a, b) {
        if (a === b) return 0;
        var m = a.length, n = b.length, i, j, prev = [], cur = [];
        for (j = 0; j <= n; j++) prev[j] = j;
        for (i = 1; i <= m; i++) {
            cur = [i];
            for (j = 1; j <= n; j++) {
                cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
            }
            prev = cur;
        }
        return prev[n];
    }
    // En yakın anahtar önerisi ("Bunu mu demek istedin?")
    function suggest(value, keys, labels) {
        var f = fold(value);
        if (!f) return null;
        var best = null, bestScore = Infinity;
        keys.forEach(function (k) {
            var cands = [fold(k)];
            if (labels && labels[k]) cands.push(fold(labels[k]));
            cands.forEach(function (c) {
                var d = lev(f, c);
                var score = d / Math.max(f.length, c.length, 1);
                if (c.indexOf(f) >= 0 || f.indexOf(c) >= 0) score = Math.min(score, 0.2);
                if (score < bestScore) { bestScore = score; best = k; }
            });
        });
        return bestScore <= 0.35 ? best : null;
    }

    /**
     * Admin yükleme dosyasını doğrular.
     * doc: {kulvar, baslik, sorular:[{no, bolum, ders, konu, metin, siklar[5], dogru, cozum, gorsel?}]}
     * catalog: data.js'in ham verisi (getKpssData()) — konu anahtarları buradan
     * images: {dosyaAdı: true|dataUrl} yüklenen görseller
     * Dönen: {ok, errors[], warnings[], exam, questions[]}
     */
    function validateUpload(doc, catalog, labels, images) {
        var errors = [], warnings = [];
        var out = [];
        if (!doc || typeof doc !== "object") return { ok: false, errors: ["Dosya JSON nesnesi değil."], warnings: [], questions: [] };
        var track = doc.kulvar || "lisans";
        if (!TRACKS[track]) errors.push("kulvar: '" + track + "' geçersiz (lisans, onlisans, ortaogretim).");
        if (!doc.baslik) warnings.push("baslik boş; 'Canlı Deneme' kullanılacak.");
        var list = Array.isArray(doc.sorular) ? doc.sorular : null;
        if (!list) return { ok: false, errors: errors.concat(["'sorular' dizisi yok."]), warnings: warnings, questions: [] };
        if (list.length !== 120) errors.push("120 soru olmalı, dosyada " + list.length + " soru var.");
        var seen = {};
        var nGY = 0, nGK = 0;
        var dersler = Object.keys(catalog || {});
        list.forEach(function (q, idx) {
            var tag = "Soru " + (q && q.no != null ? q.no : "#" + (idx + 1));
            if (!q || typeof q !== "object") { errors.push(tag + ": nesne değil."); return; }
            var no = Number(q.no);
            if (!Number.isInteger(no) || no < 1 || no > 120) errors.push(tag + ": numara 1–120 arası tam sayı olmalı.");
            else if (seen[no]) errors.push(tag + ": numara mükerrer.");
            else seen[no] = true;
            var bolum = String(q.bolum || "").trim();
            if (/^genel yetenek$/i.test(bolum)) bolum = "GY";
            if (/^genel k[üu]lt[üu]r$/i.test(bolum)) bolum = "GK";
            if (bolum !== "GY" && bolum !== "GK") errors.push(tag + ": bölüm 'GY' (Genel Yetenek) ya da 'GK' (Genel Kültür) olmalı.");
            if (bolum === "GY") nGY++;
            if (bolum === "GK") nGK++;
            if (Number.isInteger(no) && bolum === "GY" && no > 60) errors.push(tag + ": Genel Yetenek soruları 1–60 arasında olmalı.");
            if (Number.isInteger(no) && bolum === "GK" && no <= 60) errors.push(tag + ": Genel Kültür soruları 61–120 arasında olmalı.");
            var ders = q.ders;
            if (dersler.indexOf(ders) < 0) {
                var sd = suggest(ders, dersler);
                errors.push(tag + ": ders '" + ders + "' data.js'te yok." + (sd ? " Bunu mu demek istedin: '" + sd + "'?" : ""));
            } else {
                var keys = Object.keys(catalog[ders] || {}).filter(function (k) { return k !== "_"; });
                if (keys.indexOf(q.konu) < 0) {
                    var sk = suggest(q.konu, keys, labels);
                    errors.push(tag + ": konu '" + q.konu + "' " + ders + " altında yok." +
                        (sk ? " Bunu mu demek istedin: '" + sk + "'?" : ""));
                }
            }
            if (!q.metin || !String(q.metin).trim()) errors.push(tag + ": soru metni boş.");
            if (!Array.isArray(q.siklar) || q.siklar.length !== 5) errors.push(tag + ": tam 5 şık olmalı.");
            else if (q.siklar.some(function (s) { return !String(s == null ? "" : s).trim(); })) errors.push(tag + ": boş şık var.");
            var dogru = String(q.dogru || "").trim().toUpperCase();
            if (LETTERS.indexOf(dogru) < 0) errors.push(tag + ": doğru cevap A–E olmalı.");
            if (!q.cozum || !String(q.cozum).trim()) warnings.push(tag + ": çözüm/açıklama boş.");
            if (q.gorsel && images && !images[q.gorsel]) errors.push(tag + ": görsel '" + q.gorsel + "' yüklenmedi.");
            out.push({
                no: no, bolum: bolum, ders: ders, konu: q.konu, stem: String(q.metin || ""),
                options: (q.siklar || []).map(function (s) { return String(s == null ? "" : s).replace(/^[A-E][\)\.]\s*/, ""); }),
                answer: dogru, explanation: String(q.cozum || ""), image: q.gorsel || null
            });
        });
        if (list.length === 120 && (nGY !== 60 || nGK !== 60)) errors.push("Genel Yetenek " + nGY + ", Genel Kültür " + nGK + " soru: 60/60 olmalı.");
        for (var i = 1; i <= 120 && list.length === 120; i++) if (!seen[i]) errors.push("Soru " + i + " eksik.");
        out.sort(function (a, b) { return a.no - b.no; });
        return {
            ok: errors.length === 0, errors: errors, warnings: warnings,
            exam: { track: track, title: doc.baslik || "Canlı Deneme" }, questions: out
        };
    }

    // ---------------------------------------------------------------
    // Rapor yardımcıları
    // ---------------------------------------------------------------
    function net(c, w) { return Math.round((c - w / 4) * 100) / 100; }
    function fmtNet(n) {
        if (n == null || isNaN(n)) return "–";
        var s = (Math.round(Number(n) * 100) / 100).toFixed(2).replace(/\.?0+$/, "");
        return s.replace(".", ",");
    }

    // Konu satırları: kullanıcının sonucu + katılan ortalaması
    function konuRows(result, cohort) {
        var mine = (result && result.by_konu) || {};
        var avg = (cohort && cohort.by_konu) || {};
        return Object.keys(mine).map(function (k) {
            var m = mine[k];
            var a = avg[k];
            return {
                key: k, ders: m.ders, konu: m.konu, c: m.c, w: m.w, b: m.b, n: m.n, net: Number(m.net),
                avgC: a ? Number(a.c) : null, avgNet: a ? Number(a.net) : null,
                miss: m.w + m.b, ratio: m.n ? m.c / m.n : 0
            };
        }).sort(function (x, y) { return x.ders === y.ders ? x.ratio - y.ratio : (x.ders < y.ders ? -1 : 1); });
    }
    function dersRows(result, cohort) {
        var mine = (result && result.by_ders) || {};
        var avg = (cohort && cohort.by_ders) || {};
        var order = LISANS_PLAN.map(function (p) { return p.ders; });
        return Object.keys(mine).map(function (d) {
            var m = mine[d], a = avg[d];
            return { ders: d, c: m.c, w: m.w, b: m.b, n: m.n, net: Number(m.net), avgNet: a ? Number(a.net) : null };
        }).sort(function (x, y) {
            var ix = order.indexOf(x.ders), iy = order.indexOf(y.ders);
            return (ix < 0 ? 99 : ix) - (iy < 0 ? 99 : iy);
        });
    }
    // En zayıf konular: en çok kaçırılan (yanlış + boş), oranı düşük olan önce
    function weakest(result, n) {
        return konuRows(result, null).filter(function (r) { return r.miss > 0; })
            .sort(function (a, b) { return (a.ratio - b.ratio) || (b.miss - a.miss); })
            .slice(0, n || 3);
    }
    // Eksikler'e düşecek konular
    function gaps(result) {
        return konuRows(result, null).filter(function (r) { return r.w + r.b > 0; }).map(function (r) {
            return { ders: r.ders, konu: r.konu, w: r.w, b: r.b, n: r.n };
        }).sort(function (a, b) { return (b.w + b.b) - (a.w + a.b); });
    }

    // Gelişim: eskiden yeniye seriler
    function progress(history) {
        var list = (history || []).slice().sort(function (a, b) { return ms(a.starts_at) - ms(b.starts_at); });
        var points = list.map(function (h) {
            return {
                exam_id: h.exam_id, t: ms(h.starts_at), label: fmtDay(ms(h.starts_at)), title: h.title,
                net: Number(h.net), gy: Number(h.gy_net), gk: Number(h.gk_net),
                rank: h.rank, participants: h.participants, top_pct: h.top_pct == null ? null : Number(h.top_pct)
            };
        });
        var ders = {};
        list.forEach(function (h, i) {
            Object.keys(h.by_ders || {}).forEach(function (d) {
                (ders[d] = ders[d] || []).push({ i: i, net: Number(h.by_ders[d].net) });
            });
        });
        var konu = {};
        list.forEach(function (h, i) {
            Object.keys(h.by_konu || {}).forEach(function (k) {
                var v = h.by_konu[k];
                (konu[k] = konu[k] || { ders: v.ders, konu: v.konu, pts: [] }).pts.push({ i: i, ratio: v.n ? v.c / v.n : 0, n: v.n });
            });
        });
        var konuTrend = Object.keys(konu).map(function (k) {
            var p = konu[k].pts;
            var first = p[0], last = p[p.length - 1];
            return { ders: konu[k].ders, konu: konu[k].konu, from: first.ratio, to: last.ratio, delta: last.ratio - first.ratio, count: p.length };
        });
        var withHistory = konuTrend.filter(function (x) { return x.count >= 2; });
        var improved = withHistory.filter(function (x) { return x.delta > 0; }).sort(function (a, b) { return b.delta - a.delta; }).slice(0, 3);
        var stuck = konuTrend.filter(function (x) { return x.to < 0.5; }).sort(function (a, b) { return (a.to - b.to) || (b.count - a.count); }).slice(0, 3);
        // katılım serisi: en yeniden geriye, aralarında en fazla 8 gün olan denemeler
        var streak = 0;
        for (var i = list.length - 1; i >= 0; i--) {
            if (i === list.length - 1) { streak = 1; continue; }
            if (ms(list[i + 1].starts_at) - ms(list[i].starts_at) <= 8 * 86400000) streak++;
            else break;
        }
        return { points: points, ders: ders, improved: improved, stuck: stuck, streak: list.length ? streak : 0 };
    }

    // ---------------------------------------------------------------
    // optik cevap metni: "ACE-B..." (A–E, boş için -). Elle girişte boşluk/virgül yok sayılır.
    // ---------------------------------------------------------------
    function answerText(arr) {
        return arr.map(function (a) { return a || "-"; }).join("");
    }
    function parseAnswerText(text, n) {
        var clean = String(text || "").toUpperCase().replace(/[\s,;.]/g, "").replace(/[_*–—]/g, "-");
        var out = [], bad = [], i;
        for (i = 0; i < clean.length; i++) {
            var ch = clean.charAt(i);
            if (LETTERS.indexOf(ch) >= 0) out.push(ch);
            else if (ch === "-") out.push(null);
            else if (bad.indexOf(ch) < 0) bad.push(ch);
        }
        return { answers: out.slice(0, n), count: out.length, bad: bad, complete: out.length === n && !bad.length, extra: Math.max(0, out.length - n) };
    }

    var api = {
        TRACKS: TRACKS,
        BOLUM: BOLUM,
        LISANS_PLAN: LISANS_PLAN,
        LETTERS: LETTERS,
        createClock: createClock,
        ms: ms,
        fmtClock: fmtClock,
        fmtDay: fmtDay,
        fmtDate: fmtDate,
        fmtLeft: fmtLeft,
        fmtTimer: fmtTimer,
        phase: phase,
        sha256Hex: function (s) { return toHex(sha256(typeof s === "string" ? utf8Encode(s) : s)); },
        utf8Encode: utf8Encode,
        utf8Decode: utf8Decode,
        toHex: toHex,
        fromHex: fromHex,
        encryptBooklet: encryptBooklet,
        decryptBooklet: decryptBooklet,
        bookletText: bookletText,
        createQueue: createQueue,
        deviceId: deviceId,
        fold: fold,
        suggest: suggest,
        validateUpload: validateUpload,
        net: net,
        fmtNet: fmtNet,
        konuRows: konuRows,
        dersRows: dersRows,
        weakest: weakest,
        gaps: gaps,
        progress: progress,
        answerText: answerText,
        parseAnswerText: parseAnswerText
    };

    global.LiveExam = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
