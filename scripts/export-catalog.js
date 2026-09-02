/**
 * Web soru/not dosyalarını mobile/src/content/catalog.json olarak çıkarır.
 */
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var sandbox = { window: {}, console: console };
sandbox.window = sandbox;
vm.createContext(sandbox);

function runFile(rel) {
    var p = path.join(root, rel);
    if (!fs.existsSync(p)) return;
    vm.runInContext(fs.readFileSync(p, "utf8"), sandbox, { filename: rel });
}

fs.readdirSync(path.join(root, "sorular")).forEach(function (f) {
    if (/\.js$/.test(f)) runFile(path.join("sorular", f));
});
fs.readdirSync(path.join(root, "notlar")).forEach(function (f) {
    if (/\.js$/.test(f)) runFile(path.join("notlar", f));
});
runFile("data.js");

var data = sandbox.getKpssData();
var outDir = path.join(root, "mobile", "src", "content");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "catalog.json"), JSON.stringify(data));
var ders = Object.keys(data);
var q = 0, n = 0;
ders.forEach(function (d) {
    Object.keys(data[d]).forEach(function (k) {
        q += (data[d][k].sorular || []).length;
        n += (data[d][k].notlar || []).length;
    });
});
console.log("catalog.json", ders.length, "ders", q, "soru", n, "not");
