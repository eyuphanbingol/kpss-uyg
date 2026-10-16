import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

var mem = {};
var sess = {};

// Öğrenci durumu (≈300 KB) her cevapta kaydediliyor. Her seferinde diske yazmak dokunmaları
// geciktiriyordu: büyük kayıtlar bellekte hemen güncellenir, diske kısa bir beklemeyle tek seferde
// yazılır. Uygulama arka plana geçerken bekleyen her şey hemen yazılır.
var BIG = 16 * 1024;
var WRITE_DELAY_MS = 1500;
var pending = {};
var timer = null;

export function flushStorage() {
    if (timer) { clearTimeout(timer); timer = null; }
    var keys = Object.keys(pending);
    if (!keys.length) return;
    var pairs = keys.map(function (k) { return [k, pending[k]]; });
    pending = {};
    AsyncStorage.multiSet(pairs).catch(function () {
        pairs.forEach(function (p) { AsyncStorage.setItem(p[0], p[1]).catch(function () {}); });
    });
}

AppState.addEventListener("change", function (st) {
    if (st !== "active") flushStorage();
});

export var localStorageShim = {
    getItem: function (k) {
        return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
    },
    setItem: function (k, v) {
        var s = String(v);
        mem[k] = s;
        if (s.length < BIG) {
            delete pending[k];
            AsyncStorage.setItem(k, s).catch(function () {});
            return;
        }
        pending[k] = s;
        if (!timer) timer = setTimeout(flushStorage, WRITE_DELAY_MS);
    },
    removeItem: function (k) {
        delete mem[k];
        delete pending[k];
        AsyncStorage.removeItem(k).catch(function () {});
    }
};

export var sessionStorageShim = {
    getItem: function (k) {
        return Object.prototype.hasOwnProperty.call(sess, k) ? sess[k] : null;
    },
    setItem: function (k, v) {
        sess[k] = String(v);
    },
    removeItem: function (k) {
        delete sess[k];
    }
};

// Eski sürümün ≈4 MB katalog kaydı (artık dosyada, lib/catalog.js). Android'de okunması
// "Row too big" hatası verip diğer kayıtların da okunmasını engelleyebiliyordu: okunmadan silinir.
var LEGACY_BIG_KEYS = ["kpss-catalog-v1"];

export async function hydrateLocalStorage() {
    var keys = await AsyncStorage.getAllKeys();
    var stale = keys.filter(function (k) { return LEGACY_BIG_KEYS.indexOf(k) >= 0; });
    if (stale.length) await AsyncStorage.multiRemove(stale).catch(function () {});
    var ours = keys.filter(function (k) {
        return k.indexOf("kpss-") === 0 && LEGACY_BIG_KEYS.indexOf(k) < 0;
    });
    if (!ours.length) return;
    var pairs;
    try {
        pairs = await AsyncStorage.multiGet(ours);
    } catch (e) {
        // Toplu okuma bir kayıt yüzünden düşerse tek tek oku: bozuk kayıt ötekileri (ilerleme) engellemesin
        pairs = [];
        for (var i = 0; i < ours.length; i++) {
            try { pairs.push([ours[i], await AsyncStorage.getItem(ours[i])]); } catch (e2) {}
        }
    }
    pairs.forEach(function (row) {
        if (row[1] != null) mem[row[0]] = row[1];
    });
}
