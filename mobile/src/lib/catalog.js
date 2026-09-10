import { localStorageShim } from "./storage";
import { SITE } from "./media";

var CACHE_KEY = "kpss-catalog-v1";
export var CATALOG_URL = SITE + "/catalog.json";

var EMPTY_CATALOG = { Tarih: { _: {} }, Cografya: { _: {} } };
export var kpssData = EMPTY_CATALOG;

export function looksCatalog(data) {
    if (!data || typeof data !== "object") return false;
    var tarih = data.Tarih;
    var cografya = data.Cografya || data["Coğrafya"];
    function realKeys(obj) {
        return Object.keys(obj || {}).filter(function (k) { return k !== "_"; });
    }
    return !!(tarih && cografya && realKeys(tarih).length >= 1 && realKeys(cografya).length >= 1);
}

export function getKpssData() {
    return kpssData;
}

export function setKpssData(data) {
    if (looksCatalog(data)) kpssData = data;
    return kpssData;
}

export function readCachedCatalog() {
    try {
        var raw = localStorageShim.getItem(CACHE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        return looksCatalog(parsed) ? parsed : null;
    } catch (e) {
        return null;
    }
}

export async function fetchRemoteCatalog() {
    var r = await fetch(CATALOG_URL + "?t=" + Date.now());
    if (!r.ok) throw new Error("catalog " + r.status);
    var data = await r.json();
    if (!looksCatalog(data)) throw new Error("bad catalog");
    try {
        localStorageShim.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {}
    return setKpssData(data);
}
