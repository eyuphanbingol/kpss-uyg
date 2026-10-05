// Canlı deneme: mobil istemci (Supabase çağrıları, şifreli kitapçık önbelleği, bekleyen cevaplar).
// Web karşılığı js/liveClient.js; ortak motor lib/liveExam.js.
import { supabase } from "./supabase";
import { LiveExam as L } from "./liveExam";
import { localStorageShim } from "./storage";

var store = localStorageShim;

export function rpc(name, args) {
    if (!supabase || !supabase.rpc) return Promise.reject(Object.assign(new Error("Bağlantı kurulamadı."), { code: "offline", network: true }));
    return supabase.rpc(name, args || {}).then(function (r) {
        if (r.error) {
            var e = new Error(r.error.message || "İşlem başarısız.");
            e.code = r.error.hint || r.error.code || "error";
            e.network = !r.error.hint && /fetch|network|Failed|timeout/i.test(String(r.error.message || ""));
            throw e;
        }
        return r.data;
    }, function (err) {
        var e = new Error("İnternet bağlantısı yok.");
        e.code = "offline";
        e.network = true;
        e.cause = err;
        throw e;
    });
}

function getJson(k) {
    try { return JSON.parse(store.getItem(k) || "null"); } catch (e) { return null; }
}
function setJson(k, v) {
    try { store.setItem(k, JSON.stringify(v)); } catch (e) {}
}

export function trackOf(student) {
    return (student && student.userProfile && student.userProfile.educationLevel) || "lisans";
}

// ---------- base64 (AsyncStorage'da bayt saklamak için) ----------
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function toB64(bytes) {
    var out = "", i;
    for (i = 0; i < bytes.length; i += 3) {
        var a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
        var n = (a << 16) | ((b || 0) << 8) | (c || 0);
        out += B64.charAt((n >> 18) & 63) + B64.charAt((n >> 12) & 63) +
            (i + 1 < bytes.length ? B64.charAt((n >> 6) & 63) : "=") + (i + 2 < bytes.length ? B64.charAt(n & 63) : "=");
    }
    return out;
}
function fromB64(s) {
    var len = s.length, pad = s.charAt(len - 1) === "=" ? (s.charAt(len - 2) === "=" ? 2 : 1) : 0;
    var out = new Uint8Array((len / 4) * 3 - pad), o = 0, i;
    for (i = 0; i < len; i += 4) {
        var n = (B64.indexOf(s.charAt(i)) << 18) | (B64.indexOf(s.charAt(i + 1)) << 12) |
            ((B64.indexOf(s.charAt(i + 2)) & 63) << 6) | (B64.indexOf(s.charAt(i + 3)) & 63);
        if (o < out.length) out[o++] = (n >> 16) & 255;
        if (o < out.length) out[o++] = (n >> 8) & 255;
        if (o < out.length) out[o++] = n & 255;
    }
    return out;
}

// Şifreli kitapçık: AsyncStorage'da 400 KB'lık parçalar halinde (Android satır sınırı).
var CHUNK = 400 * 1024;
var memo = {};
function saveChunks(examId, bytes) {
    var n = Math.ceil(bytes.length / CHUNK), i;
    for (i = 0; i < n; i++) store.setItem("kpss-live-bk-" + examId + "-" + i, toB64(bytes.subarray(i * CHUNK, (i + 1) * CHUNK)));
    setJson("kpss-live-bk-" + examId, { n: n, len: bytes.length, at: Date.now() });
}
function loadChunks(examId) {
    var meta = getJson("kpss-live-bk-" + examId);
    if (!meta || !meta.n) return null;
    var out = new Uint8Array(meta.len), o = 0, i;
    for (i = 0; i < meta.n; i++) {
        var part = store.getItem("kpss-live-bk-" + examId + "-" + i);
        if (!part) return null;
        var b = fromB64(part);
        out.set(b, o); o += b.length;
    }
    return o === meta.len ? out : null;
}

export function fetchBooklet(examId) {
    if (memo[examId]) return Promise.resolve(memo[examId]);
    var cached = loadChunks(examId);
    if (cached) { memo[examId] = cached; return Promise.resolve(cached); }
    return rpc("live_booklet", { p_exam: examId }).then(function (info) {
        return supabase.storage.from("live-exam").createSignedUrl(info.path, 120).then(function (r) {
            if (r.error || !r.data) throw Object.assign(new Error("Kitapçık indirilemedi."), { code: "download", network: true });
            return fetch(r.data.signedUrl);
        }).then(function (res) {
            if (!res.ok) throw Object.assign(new Error("Kitapçık indirilemedi."), { code: "download", network: true });
            return res.arrayBuffer();
        }).then(function (buf) {
            memo[examId] = new Uint8Array(buf);
            saveChunks(examId, memo[examId]);
            return memo[examId];
        });
    });
}
export function hasBooklet(examId) {
    return !!memo[examId] || !!getJson("kpss-live-bk-" + examId);
}

var opened = {};
export function openBooklet(examId, keyHex, sha) {
    if (opened[examId]) return Promise.resolve(opened[examId]);
    return fetchBooklet(examId).then(function (bytes) {
        return L.decryptBooklet(bytes, keyHex, sha);
    }).then(function (txt) {
        opened[examId] = JSON.parse(txt);
        return opened[examId];
    });
}

export function deviceId() { return L.deviceId(store); }

function queueKey(examId) { return "kpss-live-q-" + examId; }
export function makeQueue(examId, onState) {
    var dev = deviceId();
    return L.createQueue({
        key: queueKey(examId),
        store: store,
        onState: onState,
        send: function (list) {
            return rpc("live_save", { p_exam: examId, p_device: dev, p_answers: list }).catch(function (e) {
                if (["device_replaced", "locked", "submitted", "ended", "cancelled", "not_entered"].indexOf(e.code) >= 0) e.fatal = true;
                throw e;
            });
        }
    });
}
export function pendingCount(examId) {
    var s = getJson(queueKey(examId));
    return s && s.pending ? Object.keys(s.pending).length : 0;
}
export function flushPending(examId) {
    if (!pendingCount(examId)) return Promise.resolve();
    var q = makeQueue(examId);
    return q.flush().then(function () { q.stop(); }, function () { q.stop(); });
}
export function rememberEntry(examId, data, clockOffset) {
    setJson("kpss-live-entry-" + examId, { key: data.key, sha: data.sha, path: data.path, exam: data.exam, offset: clockOffset });
}
export function recallEntry(examId) { return getJson("kpss-live-entry-" + examId); }

// ---------- kâğıtta çözme ----------
// Oturumdaki kullanıcı (karekod ve filigran için)
export function whoami(student) {
    var up = (student && student.userProfile) || {};
    var fallback = { id: up.authUserId || null, email: up.email || "" };
    if (!supabase || !supabase.auth) return Promise.resolve(fallback);
    return supabase.auth.getUser().then(function (r) {
        var u = r && r.data && r.data.user;
        return u ? { id: u.id, email: u.email || fallback.email } : fallback;
    }, function () { return fallback; });
}
export function pdfInfo(student, exam, who) {
    var t = L.ms(exam.starts_at), prof = (student && student.profile) || {}, up = (student && student.userProfile) || {};
    return {
        name: prof.name || up.nickname || "Öğrenci", email: who.email || "", title: exam.title,
        track: exam.track, trackLabel: "KPSS " + (L.TRACKS[exam.track] || ""), date: L.fmtDay(t, true) + " " + L.fmtClock(t),
        examId: exam.id, userId: who.id
    };
}
export function fileDay(exam) { return new Date(L.ms(exam.starts_at) + 3 * 3600000).toISOString().slice(0, 10); }
export function enterPaper(examId) {
    return rpc("live_enter", { p_exam: examId, p_device: deviceId(), p_mode: "paper" }).then(function (d) {
        if (d && d.error) throw Object.assign(new Error(d.message), { code: d.error });
        rememberEntry(examId, d, 0);
        return d;
    });
}
// Kitapçık PDF'i için çözülmüş kitapçık + bilgi
export function bookletJob(student, exam) {
    var ent = recallEntry(exam.id);
    return (ent && ent.key ? Promise.resolve(ent) : enterPaper(exam.id)).then(function (d) {
        return Promise.all([openBooklet(exam.id, d.key, d.sha), whoami(student)]);
    }).then(function (r) {
        return { type: "bookletPdf", booklet: r[0], info: pdfInfo(student, exam, r[1]), name: "atanly-kitapcik-" + fileDay(exam) + ".pdf" };
    });
}
export function formJob(student, exam) {
    return whoami(student).then(function (who) {
        if (!who.id) throw new Error("Oturum bilgisi alınamadı; yeniden giriş yap.");
        return { type: "formPdf", info: pdfInfo(student, exam, who), name: "atanly-optik-form-" + fileDay(exam) + ".pdf" };
    });
}

export var LiveClient = {
    rpc: rpc, trackOf: trackOf, fetchBooklet: fetchBooklet, hasBooklet: hasBooklet, openBooklet: openBooklet,
    deviceId: deviceId, makeQueue: makeQueue, pendingCount: pendingCount, flushPending: flushPending,
    rememberEntry: rememberEntry, recallEntry: recallEntry,
    whoami: whoami, pdfInfo: pdfInfo, enterPaper: enterPaper, bookletJob: bookletJob, formJob: formJob
};
