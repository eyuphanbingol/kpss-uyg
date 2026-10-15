/**
 * Gelir modeli istemci mantığı (web + mobil ortak; mobil kopyası scripts/sync-map-data.js ile üretilir).
 * Sunucu tarafı: supabase/patch-monetization.sql → monet_status(). Ayarlar sunucudadır; monet_settings.enabled
 * kapalıyken hiçbir şey kilitlenmez, live_paywall kapalıyken canlı deneme kaydı serbesttir.
 *
 * Kilit kuralı: her bölümde ilk free_count (3) öğe açık; gerisi premium ile ya da ödüllü reklamla
 * ad_unlock_hours (24) saat açılır. Reklam ödülü sunucuya AdMob doğrulamasıyla yazılır (web'de de geçerli);
 * sunucu cevabını beklemeden telefonda hemen açılsın diye yerelde de işaretlenir.
 * Bu dosya saf mantıktır: ağ ve depolama çağıranın işidir (web: js/monetWeb.js, mobil: src/lib/monet.js).
 */
(function (global) {
    var state = { status: null, local: {}, at: 0 };
    var listeners = [];

    function nowMs() { return Date.now(); }

    function emit() {
        listeners.slice().forEach(function (fn) { try { fn(); } catch (e) {} });
    }

    function subscribe(fn) {
        listeners.push(fn);
        return function () { listeners = listeners.filter(function (x) { return x !== fn; }); };
    }

    function settings() { return (state.status && state.status.settings) || {}; }
    function enabled() { return !!settings().enabled; }
    function livePaywall() { return !!settings().live_paywall; }
    function freeCount() {
        var n = Number(settings().free_count);
        return isFinite(n) && n >= 0 ? n : 3;
    }
    function unlockHours() {
        var n = Number(settings().ad_unlock_hours);
        return isFinite(n) && n > 0 ? n : 24;
    }

    function isPremium() {
        var s = state.status;
        if (!s || !s.premium) return false;
        if (!s.premium_until) return true;
        return Date.parse(s.premium_until) > nowMs();
    }

    function premiumUntil() {
        return (state.status && state.status.premium) ? (state.status.premium_until || null) : null;
    }

    // Sunucu anahtar biçimi: ^[a-z0-9:_.-]{1,120}$
    function slug(s) {
        var t = String(s == null ? "" : s).toLocaleLowerCase("tr-TR")
            .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
            .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
            .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (t.length <= 50) return t || "x";
        var h = 0;
        for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
        return t.slice(0, 42) + "-" + (h >>> 0).toString(36);
    }

    var keys = {
        konu: function (ders, konu) { return "konu:" + slug(ders) + ":" + slug(konu); },
        cloze: function (ders, konu) { return "cloze:" + slug(ders) + ":" + slug(konu); },
        map: function (topicId) { return "map:" + slug(topicId); }
    };

    function unlockUntil(key) {
        var srv = state.status && state.status.ad_unlocks && state.status.ad_unlocks[key];
        var a = srv ? Date.parse(srv) || 0 : 0;
        var b = Number(state.local[key]) || 0;
        return Math.max(a, b);
    }

    function isAdUnlocked(key) { return unlockUntil(key) > nowMs(); }

    // index: öğenin kendi bölümündeki sırası (0'dan). İlk free_count öğe her zaman açık.
    function isLocked(key, index) {
        if (!enabled()) return false;
        if (typeof index === "number" && index < freeCount()) return false;
        if (isPremium()) return false;
        return !isAdUnlocked(key);
    }

    // Kalan açık süre (dakika); kilitli değilse ya da süresizse null
    function unlockMinutesLeft(key) {
        var u = unlockUntil(key);
        if (u <= nowMs()) return null;
        return Math.ceil((u - nowMs()) / 60000);
    }

    // Reklam ödülü alındı: sunucu doğrulaması gelene kadar yerelde açık say.
    function markAdReward(key) {
        state.local[key] = nowMs() + unlockHours() * 3600 * 1000;
        emit();
    }

    // Canlı deneme kaydı nasıl yapılır? free | credit | pay (paywall kapalıysa her zaman free)
    function liveEntry() {
        if (!livePaywall()) return { kind: "free", paywall: false };
        var live = (state.status && state.status.live) || {};
        if (live.free) return { kind: "free", paywall: true };
        var c = Number(live.credits) || 0;
        if (c > 0) return { kind: "credit", credits: c, paywall: true };
        return { kind: "pay", reason: live.free_reason || null, paywall: true };
    }

    function setStatus(s) {
        if (!s || typeof s !== "object" || !s.settings) return false;
        state.status = s;
        state.at = nowMs();
        // sunucu onayladığı ya da süresi dolan yerel kilitleri temizle
        Object.keys(state.local).forEach(function (k) {
            var srv = s.ad_unlocks && s.ad_unlocks[k];
            if (state.local[k] <= nowMs() || (srv && Date.parse(srv) >= state.local[k])) delete state.local[k];
        });
        emit();
        return true;
    }

    function reset() {
        state = { status: null, local: {}, at: 0 };
        emit();
    }

    function serialize() {
        return JSON.stringify({ v: 1, status: state.status, local: state.local, at: state.at });
    }

    function restore(raw) {
        try {
            var o = typeof raw === "string" ? JSON.parse(raw) : raw;
            if (!o || o.v !== 1) return false;
            state.status = o.status && o.status.settings ? o.status : null;
            state.local = o.local && typeof o.local === "object" ? o.local : {};
            state.at = Number(o.at) || 0;
            emit();
            return true;
        } catch (e) {
            return false;
        }
    }

    // Kullanıcıya gösterilecek fiyat metinleri (mağaza fiyatı yoksa yedek)
    var PRICES = { monthly: "200 TL", yearly: "1000 TL", live: "50 TL" };
    var PRODUCTS = { premiumEntitlement: "premium", live: "deneme_kaydi", monthly: "atanly_premium:aylik", yearly: "atanly_premium:yillik" };

    var api = {
        subscribe: subscribe,
        enabled: enabled,
        livePaywall: livePaywall,
        freeCount: freeCount,
        unlockHours: unlockHours,
        isPremium: isPremium,
        premiumUntil: premiumUntil,
        keys: keys,
        slug: slug,
        isLocked: isLocked,
        isAdUnlocked: isAdUnlocked,
        unlockMinutesLeft: unlockMinutesLeft,
        markAdReward: markAdReward,
        liveEntry: liveEntry,
        setStatus: setStatus,
        status: function () { return state.status; },
        lastRefresh: function () { return state.at; },
        reset: reset,
        serialize: serialize,
        restore: restore,
        PRICES: PRICES,
        PRODUCTS: PRODUCTS
    };
    global.Monetization = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
