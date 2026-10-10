import AsyncStorage from "@react-native-async-storage/async-storage";

var mem = {};
var sess = {};

export var localStorageShim = {
    getItem: function (k) {
        return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
    },
    setItem: function (k, v) {
        mem[k] = String(v);
        AsyncStorage.setItem(k, String(v)).catch(function () {});
    },
    removeItem: function (k) {
        delete mem[k];
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
