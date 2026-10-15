// Gelir modeli: web bağlantısı (js/monetization.js'in sunucu ve depolama tarafı).
// Ödeme web'de alınmaz: premium ve deneme kaydı uygulama mağazasından alınır, durum buradan okunur.
// Mobil karşılığı: mobile/src/lib/monet.js
(function (global) {
    var M = global.Monetization;
    var uid = null;
    var inflight = null;
    var CACHE = "atanly-monet:";
    var DEVICE = "atanly-device-web";

    function save() {
        if (!uid) return;
        try { localStorage.setItem(CACHE + uid, M.serialize()); } catch (e) {}
    }

    function webDeviceId() {
        try {
            var id = localStorage.getItem(DEVICE);
            if (!id) {
                id = "web-" + (global.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now());
                localStorage.setItem(DEVICE, id);
            }
            return id;
        } catch (e) {
            return null;
        }
    }

    function refresh() {
        var sb = global.SupabaseClient && global.SupabaseClient.get();
        if (!sb || !M) return Promise.resolve(null);
        if (inflight) return inflight;
        inflight = sb.rpc("monet_status").then(function (r) {
            inflight = null;
            if (r && !r.error && r.data) {
                M.setStatus(r.data);
                save();
            }
            return M.status();
        }, function () {
            inflight = null;
            return M.status();
        });
        return inflight;
    }

    function onUser(nextUid) {
        if (nextUid === uid) return;
        uid = nextUid;
        M.reset();
        if (!uid) return;
        try {
            var raw = localStorage.getItem(CACHE + uid);
            if (raw) M.restore(raw);
        } catch (e) {}
        refresh();
        var sb = global.SupabaseClient && global.SupabaseClient.get();
        var dev = webDeviceId();
        if (sb && dev) sb.rpc("monet_register_device", { p_device: dev, p_platform: "web" }).then(function () {}, function () {});
    }

    function boot() {
        if (!M) return;
        var sb = global.SupabaseClient && global.SupabaseClient.get();
        if (!sb) {
            // giriş yapılmamışken de ayarlar okunabilir (kilitler kapalıysa hiçbir şey değişmez)
            return;
        }
        sb.auth.getSession().then(function (r) {
            var s = r && r.data && r.data.session;
            onUser(s && s.user ? s.user.id : null);
            if (!s) refresh();
        }, function () {});
        sb.auth.onAuthStateChange(function (event, session) {
            if (event === "SIGNED_OUT") onUser(null);
            else if (session && session.user) onUser(session.user.id);
        });
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible" && Date.now() - M.lastRefresh() > 5 * 60 * 1000) refresh();
        });
        M.subscribe(save);
    }

    global.MonetWeb = { refresh: refresh };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})(window);
