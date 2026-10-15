#!/usr/bin/env node
// Boşluk doldurma bankası: data/cloze/*.txt → js/clozeBank.js (web) + mobile/src/content/clozeBank.json (mobil)
//   node scripts/build-cloze.js          üretir
//   node scripts/build-cloze.js --check  yalnız denetler; üretilen dosyalar kaynakla aynı değilse hata verir
//
// Kaynak biçimi (data/cloze/<ders>.txt):
//   "## Konu adı"  → katalogdaki konu adıyla (baştaki/sondaki boşluk hariç) aynı olmalı
//   cümle (boşluk ____) | doğru cevap | çeldirici ; çeldirici ; çeldirici | kısa açıklama
// Boşluktan hemen sonra gelen ek-fiil ('dır, 'dir, 'tur…) kaldırılır: cevaba göre ses uyumu bozulmasın.
"use strict";
var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var SRC = path.join(ROOT, "data", "cloze");
var OUT_WEB = path.join(ROOT, "js", "clozeBank.js");
var OUT_MOB = path.join(ROOT, "mobile", "src", "content", "clozeBank.json");
var CATALOG = path.join(ROOT, "mobile", "src", "content", "catalog.json");
var DERS_OF_FILE = {
    "tarih.txt": "Tarih",
    "cografya.txt": "Coğrafya",
    "turkce.txt": "Türkçe",
    "vatandaslik.txt": "Vatandaşlık",
    "guncel.txt": "Güncel Bilgiler"
};

function low(s) { return String(s || "").trim().toLocaleLowerCase("tr-TR"); }

function build() {
    var catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
    var errors = [];
    var bank = {};
    var total = 0;
    Object.keys(DERS_OF_FILE).forEach(function (file) {
        var full = path.join(SRC, file);
        if (!fs.existsSync(full)) return;
        var ders = DERS_OF_FILE[file];
        var konuKeys = Object.keys(catalog[ders] || {}).filter(function (k) { return k !== "_"; });
        var byTrim = {};
        konuKeys.forEach(function (k) { byTrim[k.trim()] = k; });
        var out = {};
        var konu = null;
        var seen = {};
        fs.readFileSync(full, "utf8").split("\n").forEach(function (raw, i) {
            var line = raw.replace(/\r$/, "");
            var where = file + ":" + (i + 1);
            if (!line.trim() || /^#\s/.test(line) || line === "#") return;
            var h = /^##\s+(.+)$/.exec(line);
            if (h) {
                var name = h[1].trim();
                konu = byTrim[name] || null;
                if (!konu) errors.push(where + ": katalogda böyle bir konu yok: \"" + name + "\"");
                else if (out[konu]) errors.push(where + ": konu iki kez yazılmış: " + name);
                else out[konu] = [];
                return;
            }
            if (!konu) { errors.push(where + ": konu başlığından (##) önce soru var"); return; }
            var parts = line.split("|").map(function (p) { return p.trim(); });
            if (parts.length !== 4) { errors.push(where + ": 4 bölüm olmalı (cümle | cevap | çeldiriciler | açıklama)"); return; }
            var text = parts[0], ans = parts[1], dis = parts[2].split(";").map(function (d) { return d.trim(); }).filter(Boolean), exp = parts[3];
            if ((text.match(/____/g) || []).length !== 1) { errors.push(where + ": cümlede tam bir boşluk (____) olmalı"); return; }
            text = text.replace(/____'(?:d|t)(?:ı|i|u|ü)r\b/, "____");
            if (!ans) errors.push(where + ": cevap boş");
            if (dis.length !== 3) errors.push(where + ": tam 3 çeldirici olmalı (" + dis.length + " var)");
            var all = [low(ans)].concat(dis.map(low));
            if (all.some(function (x, j) { return all.indexOf(x) !== j; })) errors.push(where + ": cevap ve çeldiriciler birbirinden farklı olmalı");
            if (!exp) errors.push(where + ": açıklama boş");
            var key = low(text);
            if (seen[key]) errors.push(where + ": aynı cümle iki kez");
            seen[key] = 1;
            out[konu].push([text.replace("____", "______"), ans, dis, exp]);
            total++;
        });
        Object.keys(out).forEach(function (k) {
            if (out[k].length < 6 && !/^Genel Tekrar/.test(k.trim())) errors.push(file + ": \"" + k.trim() + "\" konusunda en az 6 soru olmalı (" + out[k].length + " var)");
        });
        bank[ders] = out;
    });
    return { bank: bank, errors: errors, total: total };
}

function render(bank) {
    var json = JSON.stringify(bank);
    return {
        web: "// Üretildi: node scripts/build-cloze.js (kaynak: data/cloze/*.txt). Elle düzenleme.\nwindow.ClozeBank = " + json + ";\n",
        mob: json + "\n"
    };
}

var r = build();
if (r.errors.length) {
    console.error("Boşluk bankasında " + r.errors.length + " hata:\n  " + r.errors.slice(0, 60).join("\n  "));
    process.exit(1);
}
var files = render(r.bank);
var counts = Object.keys(r.bank).map(function (d) {
    var n = 0; Object.keys(r.bank[d]).forEach(function (k) { n += r.bank[d][k].length; });
    return d + " " + n + " (" + Object.keys(r.bank[d]).length + " konu)";
}).join(", ");
if (process.argv.indexOf("--check") >= 0) {
    var stale = [];
    if (!fs.existsSync(OUT_WEB) || fs.readFileSync(OUT_WEB, "utf8") !== files.web) stale.push("js/clozeBank.js");
    if (!fs.existsSync(OUT_MOB) || fs.readFileSync(OUT_MOB, "utf8") !== files.mob) stale.push("mobile/src/content/clozeBank.json");
    if (stale.length) {
        console.error("Boşluk bankası güncel değil: " + stale.join(", ") + " → node scripts/build-cloze.js");
        process.exit(1);
    }
    console.log("Boşluk bankası: " + r.total + " soru denetlendi, dosyalar güncel. " + counts);
} else {
    fs.writeFileSync(OUT_WEB, files.web);
    fs.writeFileSync(OUT_MOB, files.mob);
    console.log("Boşluk bankası yazıldı: " + r.total + " soru. " + counts);
}
