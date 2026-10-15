// Gelir modeli: mobil bağlantı (src/lib/monetization.js'in sunucu, mağaza ve reklam tarafı).
// - Durum: Supabase monet_status() (web ile aynı kaynak). Sunucuda monet_settings.enabled kapalıyken kilit yok.
// - Satın alma: yalnız Google Play / App Store, RevenueCat SDK ile. Satın almadan sonra store-sync sunucu fonksiyonu
//   çağrılır; premium ve deneme kredisi hesaba yazılır, web'de de geçerli olur.
// - Ödüllü reklam: AdMob. Ödül sunucuya AdMob doğrulamasıyla (admob-ssv) yazılır; telefonda hemen açılsın diye
//   yerelde de işaretlenir.
// Yerel paketler (react-native-purchases, react-native-google-mobile-ads, expo-application) yoksa
// (eski derleme, tarayıcı önizlemesi) satın alma/reklam düğmeleri gizlenir, uygulama çalışmaya devam eder.
// Web karşılığı: js/monetWeb.js
import { AppState, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Monetization } from "./monetization";
import { supabase } from "./supabase";
import { KpssConfig } from "./config";

var Purchases = null;
var AdsLib = null;
var AppInfo = null;
try { Purchases = require("react-native-purchases").default; } catch (e) { Purchases = null; }
try { AdsLib = require("react-native-google-mobile-ads"); } catch (e) { AdsLib = null; }
try { AppInfo = require("expo-application"); } catch (e) { AppInfo = null; }

var CACHE = "atanly-monet:";
var uid = null;
var started = false;
var inflight = null;
var rcConfigured = false;
var adsInit = null;

function cfg() { return KpssConfig.monetization || {}; }

function rcKey() {
    var c = cfg().revenueCat || {};
    return Platform.OS === "ios" ? (c.iosKey || "") : (c.androidKey || "");
}

function rewardedUnit() {
    var c = cfg().admob || {};
    var id = Platform.OS === "ios" ? c.rewardedIos : c.rewardedAndroid;
    if (id) return id;
    // gerçek birim girilmeden önce Google'ın test birimi (gerçek reklam ve gelir yok)
    return AdsLib && AdsLib.TestIds ? AdsLib.TestIds.REWARDED : null;
}

function save() {
    if (!uid) return;
    AsyncStorage.setItem(CACHE + uid, Monetization.serialize()).catch(function () {});
}

export function refresh() {
    if (!supabase || !supabase.rpc) return Promise.resolve(null);
    if (inflight) return inflight;
    inflight = supabase.rpc("monet_status").then(function (r) {
        inflight = null;
        if (r && !r.error && r.data) {
            Monetization.setStatus(r.data);
            save();
        }
        return Monetization.status();
    }, function () {
        inflight = null;
        return Monetization.status();
    });
    return inflight;
}

async function deviceId() {
    if (!AppInfo) return null;
    try {
        if (Platform.OS === "android" && AppInfo.getAndroidId) return "android-" + AppInfo.getAndroidId();
        if (Platform.OS === "ios" && AppInfo.getIosIdForVendorAsync) {
            var v = await AppInfo.getIosIdForVendorAsync();
            return v ? "ios-" + v : null;
        }
    } catch (e) {}
    return null;
}

async function configurePurchases(nextUid) {
    if (!Purchases || !rcKey()) return;
    try {
        if (!rcConfigured) {
            Purchases.configure({ apiKey: rcKey(), appUserID: nextUid || null });
            rcConfigured = true;
        } else if (nextUid) {
            await Purchases.logIn(nextUid);
        } else {
            var anon = await Purchases.isAnonymous();
            if (!anon) await Purchases.logOut();
        }
    } catch (e) {}
}

async function onUser(nextUid) {
    if (nextUid === uid) return;
    uid = nextUid;
    Monetization.reset();
    configurePurchases(nextUid);
    if (!uid) { refresh(); return; }
    try {
        var raw = await AsyncStorage.getItem(CACHE + uid);
        if (raw) Monetization.restore(raw);
    } catch (e) {}
    refresh();
    var dev = await deviceId();
    if (dev && supabase.rpc) {
        supabase.rpc("monet_register_device", { p_device: dev, p_platform: Platform.OS }).then(function () {}, function () {});
    }
}

// Uygulama açılışında bir kez (AppProvider)
export function startMonet() {
    if (started) return;
    started = true;
    Monetization.subscribe(save);
    supabase.auth.getSession().then(function (r) {
        var s = r && r.data && r.data.session;
        onUser(s && s.user ? s.user.id : null);
    }, function () {});
    supabase.auth.onAuthStateChange(function (event, session) {
        if (event === "SIGNED_OUT") onUser(null);
        else if (session && session.user) onUser(session.user.id);
    });
    AppState.addEventListener("change", function (st) {
        if (st === "active" && Date.now() - Monetization.lastRefresh() > 5 * 60 * 1000) refresh();
    });
}

// ---------- satın alma ----------
export function canPurchase() {
    return !!(Purchases && rcKey() && uid);
}

async function syncStore() {
    try {
        if (supabase.functions && supabase.functions.invoke) await supabase.functions.invoke("store-sync", { method: "POST" });
    } catch (e) {}
    return refresh();
}

function cancelled(e) {
    return !!(e && (e.userCancelled || (Purchases && Purchases.PURCHASES_ERROR_CODE && e.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR)));
}

function purchaseError(e) {
    if (cancelled(e)) return { ok: false, cancelled: true };
    return { ok: false, message: (e && e.message) ? String(e.message) : "Satın alma tamamlanamadı." };
}

// Premium paketleri: { monthly, yearly } (mağaza fiyatıyla). Yoksa null.
export async function premiumPackages() {
    if (!canPurchase()) return null;
    try {
        var off = await Purchases.getOfferings();
        var cur = off && off.current;
        if (!cur) return null;
        var list = cur.availablePackages || [];
        function find(type, idPart) {
            return list.find(function (p) { return p.packageType === type; })
                || list.find(function (p) { return p.product && String(p.product.identifier).indexOf(idPart) >= 0; }) || null;
        }
        return { monthly: cur.monthly || find("MONTHLY", "aylik"), yearly: cur.annual || find("ANNUAL", "yillik") };
    } catch (e) {
        return null;
    }
}

export async function buyPackage(pkg) {
    if (!canPurchase() || !pkg) return { ok: false, message: "Satın alma şu an kullanılamıyor." };
    try {
        await Purchases.purchasePackage(pkg);
        await syncStore();
        return { ok: true };
    } catch (e) {
        return purchaseError(e);
    }
}

export async function liveProduct() {
    if (!canPurchase()) return null;
    try {
        var cat = Purchases.PRODUCT_CATEGORY ? Purchases.PRODUCT_CATEGORY.NON_SUBSCRIPTION : undefined;
        var list = await Purchases.getProducts([Monetization.PRODUCTS.live], cat);
        return (list && list[0]) || null;
    } catch (e) {
        return null;
    }
}

export async function buyLiveCredit() {
    var p = await liveProduct();
    if (!p) return { ok: false, message: "Deneme kaydı şu an satın alınamıyor. Biraz sonra tekrar dene." };
    try {
        await Purchases.purchaseStoreProduct(p);
        await syncStore();
        return { ok: true };
    } catch (e) {
        return purchaseError(e);
    }
}

export async function restorePurchases() {
    if (!canPurchase()) return { ok: false, message: "Satın alma şu an kullanılamıyor." };
    try {
        await Purchases.restorePurchases();
        await syncStore();
        return { ok: true };
    } catch (e) {
        return purchaseError(e);
    }
}

// ---------- ödüllü reklam ----------
export function canShowAds() {
    return !!(AdsLib && AdsLib.RewardedAd && rewardedUnit() && uid && Monetization.enabled());
}

function initAds() {
    if (!adsInit) {
        adsInit = Promise.resolve().then(function () {
            var m = AdsLib.default || AdsLib.mobileAds;
            return typeof m === "function" ? m().initialize() : null;
        }).catch(function () { return null; });
    }
    return adsInit;
}

// key: Monetization.keys.*(...). Ödül alınırsa true.
export async function watchRewarded(key) {
    if (!canShowAds()) return { ok: false, message: "Reklam şu an gösterilemiyor." };
    await initAds();
    return new Promise(function (resolve) {
        var earned = false;
        var done = false;
        var subs = [];
        function finish(res) {
            if (done) return;
            done = true;
            subs.forEach(function (u) { try { u(); } catch (e) {} });
            if (earned) refresh();
            resolve(res);
        }
        try {
            var ad = AdsLib.RewardedAd.createForAdRequest(rewardedUnit(), {
                requestNonPersonalizedAdsOnly: true,
                serverSideVerificationOptions: { userId: uid, customData: key }
            });
            var E = AdsLib.RewardedAdEventType || {};
            var A = AdsLib.AdEventType || {};
            subs.push(ad.addAdEventListener(E.LOADED || "rewarded_loaded", function () { ad.show().catch(function () { finish({ ok: false, message: "Reklam açılamadı." }); }); }));
            subs.push(ad.addAdEventListener(E.EARNED_REWARD || "rewarded_earned_reward", function () {
                earned = true;
                Monetization.markAdReward(key);
            }));
            subs.push(ad.addAdEventListener(A.CLOSED || "closed", function () {
                finish(earned ? { ok: true } : { ok: false, cancelled: true });
            }));
            subs.push(ad.addAdEventListener(A.ERROR || "error", function () {
                finish(earned ? { ok: true } : { ok: false, message: "Şu an reklam bulunamadı. Biraz sonra tekrar dene." });
            }));
            ad.load();
            setTimeout(function () { finish(earned ? { ok: true } : { ok: false, message: "Reklam yüklenemedi. İnternet bağlantını kontrol et." }); }, 45000);
        } catch (e) {
            finish({ ok: false, message: "Reklam şu an gösterilemiyor." });
        }
    });
}

export var Monet = {
    start: startMonet,
    refresh: refresh,
    canPurchase: canPurchase,
    premiumPackages: premiumPackages,
    buyPackage: buyPackage,
    liveProduct: liveProduct,
    buyLiveCredit: buyLiveCredit,
    restorePurchases: restorePurchases,
    canShowAds: canShowAds,
    watchRewarded: watchRewarded
};
