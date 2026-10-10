import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { SITE } from "./media";

// Güncel katalog (≈4 MB) dosyada tutulur. AsyncStorage'a yazılmaz: Android'de tek kayıt ≈2 MB'tan
// büyükse okunamaz ("Row too big to fit into CursorWindow") ve toplam sınır 6 MB'tır; eskiden
// "kpss-catalog-v1" anahtarına yazılıyordu ve kullanıcı ilerlemesinin okunmasını da bozabiliyordu.
export var LEGACY_CACHE_KEY = "kpss-catalog-v1";
var META_KEY = "atanly-catalog-meta";            // { etag, checkedAt } (küçük)
var FILE = (FileSystem.documentDirectory || "") + "catalog-v2.json";
var CHECK_EVERY_MS = 6 * 60 * 60 * 1000;          // en çok 6 saatte bir sunucuya sor
export var CATALOG_URL = SITE + "/catalog.json";

var EMPTY_CATALOG = { Tarih: { _: {} }, "Coğrafya": { _: {} } };
export var kpssData = EMPTY_CATALOG;

function realKeys(obj) {
    return Object.keys(obj || {}).filter(function (k) { return k && k !== "_"; });
}

function normalizeCatalog(data) {
    if (!data || typeof data !== "object") return data;
    var out = Object.assign({}, data);
    if (out.Cografya && !out["Coğrafya"]) {
        out["Coğrafya"] = out.Cografya;
        delete out.Cografya;
    }
    return out;
}

export function looksCatalog(data) {
    if (!data || typeof data !== "object") return false;
    var n = normalizeCatalog(data);
    var tarih = n.Tarih;
    var cografya = n["Coğrafya"] || n.Cografya;
    return !!(tarih && cografya && realKeys(tarih).length >= 1 && realKeys(cografya).length >= 1);
}

export function getKpssData() {
    return kpssData;
}

export function setKpssData(data) {
    if (looksCatalog(data)) kpssData = normalizeCatalog(data);
    return kpssData;
}

// Cihazdaki güncel kopya (yoksa null). Açılışta bir kez çağrılır.
export async function readCachedCatalog() {
    try {
        if (!FileSystem.documentDirectory) return null;
        var info = await FileSystem.getInfoAsync(FILE);
        if (!info.exists) return null;
        var parsed = JSON.parse(await FileSystem.readAsStringAsync(FILE));
        return looksCatalog(parsed) ? normalizeCatalog(parsed) : null;
    } catch (e) {
        return null;
    }
}

async function readMeta() {
    try { return JSON.parse((await AsyncStorage.getItem(META_KEY)) || "{}") || {}; } catch (e) { return {}; }
}

// Sunucudaki katalog değiştiyse indirir (ETag ile; değişmediyse 304, gövde gelmez).
// force olmadan en çok 6 saatte bir sorar. Değişiklik yoksa null döner.
export async function fetchRemoteCatalog(force) {
    var meta = await readMeta();
    if (!force && meta.checkedAt && Date.now() - meta.checkedAt < CHECK_EVERY_MS) return null;
    var headers = {};
    if (meta.etag && FileSystem.documentDirectory) {
        var info = await FileSystem.getInfoAsync(FILE).catch(function () { return { exists: false }; });
        if (info.exists) headers["If-None-Match"] = meta.etag;
    }
    var r = await fetch(CATALOG_URL, { headers: headers });
    var next = { etag: meta.etag || "", checkedAt: Date.now() };
    if (r.status === 304) {
        AsyncStorage.setItem(META_KEY, JSON.stringify(next)).catch(function () {});
        return null;
    }
    if (!r.ok) throw new Error("catalog " + r.status);
    var text = await r.text();
    var data = JSON.parse(text);
    if (!looksCatalog(data)) throw new Error("bad catalog");
    if (FileSystem.documentDirectory) {
        await FileSystem.writeAsStringAsync(FILE, text).catch(function () {});
    }
    next.etag = r.headers && r.headers.get ? (r.headers.get("etag") || "") : "";
    AsyncStorage.setItem(META_KEY, JSON.stringify(next)).catch(function () {});
    return setKpssData(data);
}
