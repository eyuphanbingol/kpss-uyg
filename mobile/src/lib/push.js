// Telefon bildirimleri (Expo push).
// - Giriş yapan kullanıcıdan bir kez bildirim izni istenir; izin verirse telefonun Expo adresi sunucuya
//   push_register ile yazılır (kulvarıyla birlikte). Sunucu: supabase/patch-live-open.sql.
// - Yönetici canlı denemeyi açınca sunucu o kulvardaki telefonlara bildirim yollar; bildirime dokununca
//   Canlı deneme sayfası açılır.
// - Android'de adres alınabilmesi için Firebase kurulu olmalı (app.config.js → google-services.json ve
//   expo.dev'de FCM anahtarı). Kurulu değilse ya da paket yoksa sessizce hiçbir şey yapmaz.
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { supabase } from "./supabase";

var N = null;
try { N = require("expo-notifications"); } catch (e) { N = null; }

var ASKED = "atanly-push-asked";
var lastKey = "";
var inflight = null;
var started = false;

function projectId() {
    var c = Constants || {};
    var a = c.expoConfig && c.expoConfig.extra && c.expoConfig.extra.eas && c.expoConfig.extra.eas.projectId;
    var b = c.easConfig && c.easConfig.projectId;
    return a || b || undefined;
}

async function ensureChannel() {
    if (Platform.OS !== "android" || !N.setNotificationChannelAsync) return;
    await N.setNotificationChannelAsync("default", {
        name: "Duyurular",
        importance: N.AndroidImportance ? N.AndroidImportance.HIGH : 4,
        sound: "default"
    });
}

// Uygulama açılışında bir kez: ön planda da göster, dokununca yönlendir.
// onOpen(data): bildirime dokunulduğunda (uygulama kapalıyken açıldıysa da) çağrılır.
export function startPush(onOpen) {
    if (!N || started) return;
    started = true;
    try {
        N.setNotificationHandler({
            handleNotification: async function () {
                return { shouldShowAlert: true, shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false };
            }
        });
    } catch (e) {}
    var handled = {};
    function handle(r) {
        var req = r && r.notification && r.notification.request;
        if (!req || handled[req.identifier]) return;
        handled[req.identifier] = true;
        try { if (N.clearLastNotificationResponseAsync) N.clearLastNotificationResponseAsync().catch(function () {}); } catch (e) {}
        if (onOpen) onOpen((req.content && req.content.data) || {});
    }
    try { N.addNotificationResponseReceivedListener(handle); } catch (e) {}
    // uygulama kapalıyken bildirime dokunularak açıldıysa
    try { N.getLastNotificationResponseAsync().then(handle, function () {}); } catch (e) {}
}

// Giriş yapan kullanıcının telefonunu kaydet (kulvar değişince yeniden). İzin bir kez sorulur.
export function registerPush(uid, track) {
    if (!N || !uid || Platform.OS === "web") return Promise.resolve(false);
    if (inflight) return inflight;
    inflight = (async function () {
        try {
            await ensureChannel();
            var perm = await N.getPermissionsAsync();
            var status = perm && perm.status;
            if (status !== "granted") {
                var asked = await AsyncStorage.getItem(ASKED).catch(function () { return null; });
                if (asked || (perm && perm.canAskAgain === false)) return false;
                await AsyncStorage.setItem(ASKED, "1").catch(function () {});
                var req = await N.requestPermissionsAsync();
                status = req && req.status;
                if (status !== "granted") return false;
            }
            var tok = await N.getExpoPushTokenAsync({ projectId: projectId() });
            var token = tok && tok.data;
            if (!token) return false;
            var key = uid + "|" + (track || "") + "|" + token;
            if (key === lastKey) return true;
            var r = await supabase.rpc("push_register", { p_token: token, p_platform: Platform.OS === "ios" ? "ios" : "android", p_track: track || null });
            if (r && r.error) return false;
            lastKey = key;
            return true;
        } catch (e) {
            // Firebase kurulu değil, izin yok ya da ağ yok: bildirim olmadan devam
            return false;
        } finally {
            inflight = null;
        }
    })();
    return inflight;
}
