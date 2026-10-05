/**
 * Canlı deneme soru dosyasını yüklemeden önce denetler (admin panelindeki doğrulamanın aynısı).
 *   node scripts/validate-live-exam.js docs/canli-deneme-ornek.json [görsel-klasörü]
 */
var fs = require("fs");
var path = require("path");
var vm = require("vm");
var L = require("../js/liveExam.js");
var root = path.join(__dirname, "..");

var file = process.argv[2];
if (!file) { console.error("Kullanım: node scripts/validate-live-exam.js <dosya.json> [görsel-klasörü]"); process.exit(2); }
var doc;
try { doc = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { console.error("JSON okunamadı: " + e.message); process.exit(1); }
var imgDir = process.argv[3] || path.join(path.dirname(file), "canli-deneme-gorseller");
var images = {};
if (fs.existsSync(imgDir)) fs.readdirSync(imgDir).forEach(function (f) { images[f] = true; });

// data.js: konu anahtarları ve görünen adlar
var sb = { window: {} }; sb.window = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(root, "data.js"), "utf8"), sb);
var catalog = sb.getKpssData();

var r = L.validateUpload(doc, catalog, sb.KONU_LABELS || {}, images);
r.warnings.forEach(function (w) { console.log("uyarı: " + w); });
if (!r.ok) {
    r.errors.forEach(function (e) { console.log("HATA:  " + e); });
    console.log("\n" + r.errors.length + " hata: dosya yüklenemez.");
    process.exit(1);
}
var by = {};
r.questions.forEach(function (q) { by[q.ders] = (by[q.ders] || 0) + 1; });
console.log("Geçerli: " + r.questions.length + " soru (" + Object.keys(by).map(function (d) { return d + " " + by[d]; }).join(", ") + ").");
