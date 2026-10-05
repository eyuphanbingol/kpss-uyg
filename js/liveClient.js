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
        setJson: setJson
    };
})(typeof window !== "undefined" ? window : globalThis);
