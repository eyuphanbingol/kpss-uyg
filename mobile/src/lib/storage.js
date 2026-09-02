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

export async function hydrateLocalStorage() {
    var keys = await AsyncStorage.getAllKeys();
    var ours = keys.filter(function (k) {
        return k.indexOf("kpss-") === 0;
    });
    if (!ours.length) return;
    var pairs = await AsyncStorage.multiGet(ours);
    pairs.forEach(function (row) {
        if (row[1] != null) mem[row[0]] = row[1];
    });
}
