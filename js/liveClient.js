/**
 * Canlı deneme: web istemcisi (Supabase çağrıları, şifreli kitapçık önbelleği, bekleyen cevaplar).
 * Ortak motor js/liveExam.js; mobil karşılığı mobile/src/lib/liveClient.js.
 */
(function (global) {
    "use strict";
    var L = global.LiveExam;

    function sb() {
        return global.SupabaseClient && global.SupabaseClient.get && global.SupabaseClient.get();
    }

    // Sunucu hata kodu PostgREST'te "hint" alanında gelir.
    function rpc(name, args) {
        var c = sb();
        if (!c) return Promise.reject(Object.assign(new Error("Bağlantı kurulamadı."), { code: "offline", network: true }));
        return c.rpc(name, args || {}).then(function (r) {
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

    function store() {
        try { return global.localStorage; } catch (e) { return null; }
    }
    function getJson(k) {
        try { return JSON.parse((store() && store().getItem(k)) || "null"); } catch (e) { return null; }
    }
    function setJson(k, v) {
        try { if (store()) store().setItem(k, JSON.stringify(v)); } catch (e) {}
    }

    function trackOf(student) {
        var lv = student && student.userProfile && student.userProfile.educationLevel;
        return lv || "lisans";
    }

    // ---------- IndexedDB: şifreli kitapçık önbelleği ----------
    var DB = "kpss-live";
    function idb() {
        return new Promise(function (resolve, reject) {
            if (!global.indexedDB) { reject(new Error("no idb")); return; }
            var req = global.indexedDB.open(DB, 1);
            req.onupgradeneeded = function () { req.result.createObjectStore("booklets"); };
            req.onsuccess = function () { resolve(req.result); };
            req.onerror = function () { reject(req.error); };
        });
    }
    function idbGet(key) {
        return idb().then(function (db) {
            return new Promise(function (resolve) {
                var tx = db.transaction("booklets", "readonly");
                var r = tx.objectStore("booklets").get(key);
                r.onsuccess = function () { resolve(r.result || null); };
                r.onerror = function () { resolve(null); };
            });
        }).catch(function () { return null; });
    }
    function idbSet(key, val) {
        return idb().then(function (db) {
            return new Promise(function (resolve) {
                var tx = db.transaction("booklets", "readwrite");
                tx.objectStore("booklets").put(val, key);
                tx.oncomplete = function () { resolve(true); };
                tx.onerror = function () { resolve(false); };
            });
        }).catch(function () { return false; });
    }

    // Şifreli kitapçığı indir (önbellekte varsa oradan). Dönen: Uint8Array
    var memo = {};
    function fetchBooklet(examId) {
        if (memo[examId]) return Promise.resolve(memo[examId]);
        return idbGet("bk:" + examId).then(function (cached) {
            if (cached) { memo[examId] = new Uint8Array(cached); return memo[examId]; }
            return rpc("live_booklet", { p_exam: examId }).then(function (info) {
                var c = sb();
                return c.storage.from("live-exam").download(info.path).then(function (r) {
                    if (r.error || !r.data) throw Object.assign(new Error("Kitapçık indirilemedi."), { code: "download", network: true });
                    return r.data.arrayBuffer();
                }).then(function (buf) {
                    memo[examId] = new Uint8Array(buf);
                    idbSet("bk:" + examId, buf);
                    setJson("kpss-live-bk-" + examId, { sha: info.sha, at: Date.now() });
                    return memo[examId];
                });
            });
        });
    }
    function hasBooklet(examId) {
        return !!memo[examId] || !!getJson("kpss-live-bk-" + examId);
    }

    // Kitapçığı aç: indir + çöz. Dönen: {questions:[...]}
    var opened = {};
    function openBooklet(examId, keyHex, sha) {
        if (opened[examId]) return Promise.resolve(opened[examId]);
        return fetchBooklet(examId).then(function (bytes) {
            return L.decryptBooklet(bytes, keyHex, sha);
        }).then(function (txt) {
            opened[examId] = JSON.parse(txt);
            return opened[examId];
        });
    }

    function deviceId() { return L.deviceId(store()); }

    // ---------- cevap kuyruğu ----------
    function queueKey(examId) { return "kpss-live-q-" + examId; }
    function makeQueue(examId, onState) {
        var dev = deviceId();
        return L.createQueue({
            key: queueKey(examId),
            store: store(),
            onState: onState,
            send: function (list) {
                return rpc("live_save", { p_exam: examId, p_device: dev, p_answers: list }).catch(function (e) {
                    if (["device_replaced", "locked", "submitted", "ended", "cancelled", "not_entered"].indexOf(e.code) >= 0) e.fatal = true;
                    throw e;
                });
            }
        });
    }
    function pendingCount(examId) {
        var s = getJson(queueKey(examId));
        return s && s.pending ? Object.keys(s.pending).length : 0;
    }
    // Sonuç istenmeden önce cihazda bekleyen cevapları gönder (sonuç çağrısı kâğıdı kapatır).
    function flushPending(examId) {
        if (!pendingCount(examId)) return Promise.resolve();
        var q = makeQueue(examId);
        return q.flush().then(function () { q.stop(); }, function () { q.stop(); });
    }

    // Girişte alınan anahtar: bağlantı kopup sayfa yenilenirse çevrimdışı devam için
    function rememberEntry(examId, data, clockOffset) {
        setJson("kpss-live-entry-" + examId, { key: data.key, sha: data.sha, path: data.path, exam: data.exam, offset: clockOffset });
    }
    function recallEntry(examId) { return getJson("kpss-live-entry-" + examId); }

    // ---------- optik sayfası: PDF üretimi gizli bir iframe'de (mobilde aynı sayfa WebView'da) ----------
    var OPTIK_URL = "optik/optik.html?v=3";
    var worker = null, waiters = {}, seq = 0;
    function onOptikMessage(e) {
        if (!worker || e.source !== worker.frame.contentWindow) return;
        var m = e.data || {};
        if (m.type === "ready") { worker.ok(); return; }
        var w = m.id && waiters[m.id];
        if (!w) return;
        if (m.type === "progress") { if (w.onProgress) w.onProgress(m.p); return; }
        delete waiters[m.id];
        if (m.type === "pdf") w.resolve(m);
        else w.reject(new Error(m.message || "PDF hazırlanamadı."));
    }
    function optikWorker() {
        if (worker) return worker.ready;
        var f = document.createElement("iframe");
        f.src = OPTIK_URL + "&mode=worker";
        f.title = "Optik PDF hazırlayıcı";
        f.setAttribute("aria-hidden", "true");
        f.tabIndex = -1;
        f.style.cssText = "position:fixed;left:-9999px;top:0;width:10px;height:10px;border:0;opacity:0;pointer-events:none";
        worker = { frame: f };
        worker.ready = new Promise(function (resolve, reject) {
            worker.ok = resolve;
            setTimeout(function () { reject(new Error("Optik sayfası yüklenemedi; internetini kontrol et.")); }, 30000);
        });
        worker.ready.catch(function () { if (worker && worker.frame.parentNode) worker.frame.parentNode.removeChild(worker.frame); worker = null; });
        global.addEventListener("message", onOptikMessage);
        document.body.appendChild(f);
        return worker.ready;
    }
    function optik(cmd, onProgress) {
        return optikWorker().then(function () {
            return new Promise(function (resolve, reject) {
                var id = "c" + (++seq);
                waiters[id] = { resolve: resolve, reject: reject, onProgress: onProgress };
                worker.frame.contentWindow.postMessage(Object.assign({ id: id }, cmd), global.location.origin);
            });
        });
    }
    function downloadPdf(b64, name) {
        var bin = atob(b64), bytes = new Uint8Array(bin.length), i;
        for (i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        var url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
        var a = document.createElement("a");
        a.href = url; a.download = name; a.rel = "noopener";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    }
    // Oturumdaki kullanıcı (karekod ve filigran için)
    function whoami(student) {
        var up = (student && student.userProfile) || {};
        var fallback = { id: up.authUserId || null, email: up.email || "" };
        var c = sb();
        if (!c || !c.auth || !c.auth.getUser) return Promise.resolve(fallback);
        return c.auth.getUser().then(function (r) {
            var u = r && r.data && r.data.user;
            return u ? { id: u.id, email: u.email || fallback.email } : fallback;
        }, function () { return fallback; });
    }
    function pdfInfo(student, exam, who) {
        var t = L.ms(exam.starts_at), prof = (student && student.profile) || {}, up = (student && student.userProfile) || {};
        return {
            name: prof.name || up.nickname || "Öğrenci", email: who.email || "", title: exam.title,
            track: exam.track, trackLabel: "KPSS " + (L.TRACKS[exam.track] || ""), date: L.fmtDay(t, true) + " " + L.fmtClock(t),
            examId: exam.id, userId: who.id
        };
    }
    function fileDay(exam) { return new Date(L.ms(exam.starts_at) + 3 * 3600000).toISOString().slice(0, 10); }
    // Kişiye özel optik form (karekodda deneme ve kullanıcı kimliği)
    function formPdf(student, exam) {
        return whoami(student).then(function (who) {
            if (!who.id) throw new Error("Oturum bilgisi alınamadı; yeniden giriş yap.");
            return optik({ type: "formPdf", info: pdfInfo(student, exam, who), name: "atanly-optik-form-" + fileDay(exam) + ".pdf" });
        }).then(function (m) { downloadPdf(m.b64, m.name); });
    }
    // Kâğıtta çöz: sınava kâğıt modunda gir (anahtar 10:15'te gelir)
    function enterPaper(examId) {
        return rpc("live_enter", { p_exam: examId, p_device: deviceId(), p_mode: "paper" }).then(function (d) {
            if (d && d.error) throw Object.assign(new Error(d.message), { code: d.error });
            rememberEntry(examId, d, 0);
            return d;
        });
    }
    // Filigranlı soru kitapçığı (ad ve e-posta her sayfada)
    function bookletPdf(student, exam, onProgress) {
        var ent = recallEntry(exam.id);
        return (ent && ent.key ? Promise.resolve(ent) : enterPaper(exam.id)).then(function (d) {
            return Promise.all([openBooklet(exam.id, d.key, d.sha), whoami(student)]);
        }).then(function (r) {
            return optik({ type: "bookletPdf", booklet: r[0], info: pdfInfo(student, exam, r[1]), name: "atanly-kitapcik-" + fileDay(exam) + ".pdf" }, onProgress);
        }).then(function (m) { downloadPdf(m.b64, m.name); });
    }

    global.LiveClient = {
        rpc: rpc,
        sb: sb,
        trackOf: trackOf,
        fetchBooklet: fetchBooklet,
        hasBooklet: hasBooklet,
        openBooklet: openBooklet,
        deviceId: deviceId,
        makeQueue: makeQueue,
        pendingCount: pendingCount,
        flushPending: flushPending,
        rememberEntry: rememberEntry,
        recallEntry: recallEntry,
        getJson: getJson,
        setJson: setJson,
        OPTIK_URL: OPTIK_URL,
        whoami: whoami,
        formPdf: formPdf,
        enterPaper: enterPaper,
        bookletPdf: bookletPdf
    };
})(typeof window !== "undefined" ? window : globalThis);
