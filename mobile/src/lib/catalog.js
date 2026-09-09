import bundled from "../content/catalog.json";
import { localStorageShim } from "./storage";
import { SITE } from "./media";

var CACHE_KEY = "kpss-catalog-v1";
export var CATALOG_URL = SITE + "/catalog.json";
export var bundledCatalog = bundled;
export var kpssData = bundled;

function looksCatalog(data) {
    if (!data || typeof data !== "object") return false;
    var tarih = data.Tarih;
    var cografya = data.Cografya || data["Coğrafya"];
    return !!(tarih && cografya && Object.keys(tarih).length >= 1);
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
        if (!raw) return bundledCatalog;
        var parsed = JSON.parse(raw);
        return looksCatalog(parsed) ? parsed : bundledCatalog;
    } catch (e) {
        return bundledCatalog;
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
