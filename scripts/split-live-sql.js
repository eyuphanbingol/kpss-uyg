#!/usr/bin/env node
/**
 * supabase/patch-live-exam.sql tek kaynaktır. Supabase SQL Editor'a tek seferde sığmayabildiği
 * için bu betik onu komut sınırlarından bölerek sırayla çalıştırılacak parçalara ayırır:
 *   supabase/canli-deneme/1.sql, 2.sql, ...
 *   node scripts/split-live-sql.js          -> parçaları yazar
 *   node scripts/split-live-sql.js --check  -> parçalar güncel değilse hata verir
 */
// Sayıya yönelme eki: 9'a, 10'a, 8'e, 12'ye …
function yonelme(n) {
    var son = { 0: "a", 1: "e", 2: "ye", 3: "e", 4: "e", 5: "e", 6: "ya", 7: "ye", 8: "e", 9: "a" }, onlar = { 1: "a", 2: "ye", 3: "a", 4: "a", 5: "ye", 6: "a", 7: "e", 8: "e", 9: "a" };
    return "'" + (n % 10 ? son[n % 10] : onlar[Math.floor(n / 10) % 10]);
}
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
var src = fs.readFileSync(path.join(root, "supabase", "patch-live-exam.sql"), "utf8").replace(/\r\n?/g, "\n");
var outDir = path.join(root, "supabase", "canli-deneme");
var MAX = 180; // parça başına yaklaşık satır

// Üst düzey komutlara böl: ';' ile biten satır, $$ bloğunun içinde değilse komut sonudur.
var lines = src.split("\n"), stmts = [], cur = [], inDollar = false;
lines.forEach(function (ln) {
    cur.push(ln);
    var n = (ln.match(/\$\$/g) || []).length;
    if (n % 2 === 1) inDollar = !inDollar;
    if (!inDollar && /;\s*(--.*)?$/.test(ln)) { stmts.push(cur.join("\n")); cur = []; }
});
if (cur.join("").trim()) stmts.push(cur.join("\n"));
if (inDollar) throw new Error("$$ bloğu kapanmamış");

var parts = [], buf = [];
stmts.forEach(function (st) {
    var size = buf.join("\n").split("\n").length;
    if (buf.length && size + st.split("\n").length > MAX) { parts.push(buf.join("\n")); buf = []; }
    buf.push(st);
});
if (buf.length) parts.push(buf.join("\n"));

var files = parts.map(function (p, i) {
    var head = "-- CANLI DENEME · PARÇA " + (i + 1) + " / " + parts.length + "\n" +
        "-- Supabase SQL Editor'da 1'den " + parts.length + yonelme(parts.length) + " SIRAYLA çalıştır (her parçayı ayrı ayrı: yapıştır → Run).\n" +
        "-- Bu dosya scripts/split-live-sql.js ile supabase/patch-live-exam.sql'den üretilir. Elle düzenleme.\n\n";
    return [path.join(outDir, (i + 1) + ".sql"), head + p.replace(/^\n+/, "").replace(/\n*$/, "\n")];
});

if (process.argv.indexOf("--check") >= 0) {
    var bad = files.filter(function (f) { return !fs.existsSync(f[0]) || fs.readFileSync(f[0], "utf8") !== f[1]; });
    var extra = fs.existsSync(outDir) ? fs.readdirSync(outDir).filter(function (n) { return !files.some(function (f) { return path.basename(f[0]) === n; }); }) : [];
    if (bad.length || extra.length) { console.error("supabase/canli-deneme parçaları güncel değil: node scripts/split-live-sql.js"); process.exit(1); }
    console.log("SQL parçaları güncel (" + files.length + " parça).");
} else {
    fs.mkdirSync(outDir, { recursive: true });
    fs.readdirSync(outDir).forEach(function (n) { if (/^\d+\.sql$/.test(n)) fs.unlinkSync(path.join(outDir, n)); });
    files.forEach(function (f) { fs.writeFileSync(f[0], f[1]); console.log(path.relative(root, f[0]) + " — " + f[1].split("\n").length + " satır"); });
}
