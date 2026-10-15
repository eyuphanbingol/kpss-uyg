// Boşluk doldurma: elle yazılmış soru bankasından (data/cloze/*.txt → scripts/build-cloze.js → js/clozeBank.js).
// Eskiden sorular notlardan otomatik kesiliyordu: cümleler yarım kalıyor, şıklar alakasız oluyordu ve
// her konuda tüm notları taramak zayıf cihazları kasıyordu. Banka hazır olduğu için burada hesaplama yoktur.
// Mobil karşılığı: mobile/src/lib/clozeEngine.js (aynı mantık).
(function (global) {
    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    var cache = {};

    // Konunun soruları. "Genel Tekrar" konuları dersin bütün konularından karışık çeker.
    function itemsFor(ders, konu) {
        var key = ders + "\u0000" + konu;
        if (cache[key]) return cache[key];
        var bank = global.ClozeBank || {};
        var byKonu = bank[ders] || {};
        var rows = [];
        if (/^Genel Tekrar/.test(String(konu || "").trim()) && !byKonu[konu]) {
            Object.keys(byKonu).forEach(function (k) { rows = rows.concat(byKonu[k]); });
        } else {
            rows = byKonu[konu] || [];
        }
        var out = rows.map(function (r) {
            return { id: "b|" + r[0].slice(0, 80), prompt: r[0], answer: r[1], distractors: r[2], explain: r[3] };
        });
        if (global.ClozeBank) cache[key] = out;
        return out;
    }

    function remainingFrom(items, skipIds) {
        var skip = {};
        (skipIds || []).forEach(function (id) { if (id) skip[String(id)] = 1; });
        return items.filter(function (it) { return !skip[it.id]; });
    }

    function buildForKonu(kd, limit, skipIds, ders, konu) {
        return shuffle(remainingFrom(itemsFor(ders, konu), skipIds)).slice(0, limit || 12).map(function (it) {
            return Object.assign({}, it, { choices: shuffle([it.answer].concat(it.distractors)) });
        });
    }

    function countForKonu(kd, ders, konu) {
        return itemsFor(ders, konu).length;
    }

    function remainingCount(kd, skipIds, ders, konu) {
        return remainingFrom(itemsFor(ders, konu), skipIds).length;
    }

    function hasDers(ders) {
        return Object.keys((global.ClozeBank || {})[ders] || {}).length > 0;
    }

    function dersEnabled(ders) {
        var d = String(ders || "");
        if (d === "Geometri") return false;
        if (global.AlanCatalog && global.AlanCatalog.isAlanDers(d)) return false;
        if (global.AlanCatalog && global.AlanCatalog.isOgretmenDers(d)) return false;
        return true;
    }

    var api = { buildForKonu: buildForKonu, countForKonu: countForKonu, remainingCount: remainingCount, hasDers: hasDers, dersEnabled: dersEnabled };
    global.ClozeEngine = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
