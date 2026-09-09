import { localStorageShim } from "./storage";
import { SITE } from "./media";

var CACHE_KEY = "kpss-catalog-v1";
export var CATALOG_URL = SITE + "/catalog.json";

var EMPTY_CATALOG = { Tarih: { _: {} }, Cografya: { _: {} } };
var bundledCatalog = EMPTY_CATALOG;
export var kpssData = EMPTY_CATALOG;
var bundledLoaded = false;

export function looksCatalog(data) {
    if (!data || typeof data !== "object") return false;
    var tarih = data.Tarih;
    var cografya = data.Cografya || data["Coğrafya"];
    return !!(tarih && cografya && Object.keys(tarih).length >= 1 && Object.keys(tarih)[0] !== "_");
}

export function loadBundledCatalog() {
    if (bundledLoaded) return bundledCatalog;
    try {
        bundledCatalog = require("../content/catalog.json");
        bundledLoaded = true;
        if (looksCatalog(bundledCatalog)) kpssData = bundledCatalog;
    } catch (e) {
        bundledCatalog = EMPTY_CATALOG;
    }
    return bundledCatalog;
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

export { bundledCatalog };
