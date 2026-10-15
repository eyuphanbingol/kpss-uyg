import { isAlanDers, isOgretmenDers } from "./alan";
import BANK from "../content/clozeBank.json";

// Boşluk doldurma: elle yazılmış soru bankasından (data/cloze/*.txt → scripts/build-cloze.js).
// Eskiden sorular notlardan otomatik kesiliyordu: cümleler yarım kalıyor, şıklar alakasız oluyordu ve
// her konuda tüm notları taramak telefonu kasıyordu. Banka hazır olduğu için burada hesaplama yoktur.
// Web karşılığı: js/clozeEngine.js (aynı mantık).

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
    var byKonu = BANK[ders] || {};
    var rows = [];
    if (/^Genel Tekrar/.test(String(konu || "").trim()) && !byKonu[konu]) {
        Object.keys(byKonu).forEach(function (k) { rows = rows.concat(byKonu[k]); });
    } else {
        rows = byKonu[konu] || [];
    }
    var out = rows.map(function (r) {
        return { id: "b|" + r[0].slice(0, 80), prompt: r[0], answer: r[1], distractors: r[2], explain: r[3] };
    });
    cache[key] = out;
    return out;
}

function remainingFrom(items, skipIds) {
    var skip = {};
    (skipIds || []).forEach(function (id) { if (id) skip[String(id)] = 1; });
    return items.filter(function (it) { return !skip[it.id]; });
}

export const ClozeEngine = {
    buildForKonu: function (kd, limit, skipIds, ders, konu) {
        return shuffle(remainingFrom(itemsFor(ders, konu), skipIds)).slice(0, limit || 12).map(function (it) {
            return Object.assign({}, it, { choices: shuffle([it.answer].concat(it.distractors)) });
        });
    },
    countForKonu: function (kd, ders, konu) {
        return itemsFor(ders, konu).length;
    },
    remainingCount: function (kd, skipIds, ders, konu) {
        return remainingFrom(itemsFor(ders, konu), skipIds).length;
    },
    hasDers: function (ders) {
        return Object.keys(BANK[ders] || {}).length > 0;
    },
    dersEnabled: function (ders) {
        var d = String(ders || "");
        if (d === "Geometri") return false;
        if (isAlanDers(d)) return false;
        if (isOgretmenDers(d)) return false;
        return true;
    }
};
