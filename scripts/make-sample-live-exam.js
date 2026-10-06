/**
 * Örnek canlı deneme dosyası üretir: docs/canli-deneme-ornek.json
 *   node scripts/make-sample-live-exam.js                     (lisans)
 *   node scripts/make-sample-live-exam.js --kulvar=onlisans    (docs/canli-deneme-ornek-onlisans.json)
 * Türkçe, Geometri ve Genel Kültür soruları katalogdan (data.js konu anahtarlarıyla) alınır;
 * Matematik soruları burada yazılıdır ve cevapları hesaplanarak denetlenir.
 * Dağılım lisans KPSS: Türkçe 30, Matematik 22, Geometri 8 | Tarih 27, Coğrafya 18, Vatandaşlık 9, Güncel 6.
 */
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
var cat = require(path.join(root, "catalog.json"));

// tekrarlanabilir rastgelelik
var seed = 20261011;
function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }

function strip(o) { return String(o).replace(/^[A-E][\)\.]\s*/, ""); }
function fromCatalog(ders, n, opts) {
    opts = opts || {};
    var konular = Object.keys(cat[ders]).filter(function (k) { return k !== "_" && (cat[ders][k].sorular || []).length; });
    var pool = [];
    konular.forEach(function (k) {
        (cat[ders][k].sorular || []).forEach(function (q, i) {
            if (q.img || q.imgs) return;
            if (!q.options || q.options.length !== 5 || q.correctAnswerIndex == null) return;
            if (opts.only && !opts.only(q)) return;
            pool.push({ konu: k, q: q, i: i });
        });
    });
    // konulara dengeli dağıt
    var byKonu = {};
    pool.forEach(function (p) { (byKonu[p.konu] = byKonu[p.konu] || []).push(p); });
    Object.keys(byKonu).forEach(function (k) { byKonu[k].sort(function () { return rnd() - 0.5; }); });
    var order = Object.keys(byKonu).sort(function () { return rnd() - 0.5; });
    var out = [], idx = 0;
    while (out.length < n) {
        var k = order[idx % order.length];
        var item = byKonu[k].shift();
        if (item) out.push(item);
        idx++;
        if (idx > 10000) throw new Error(ders + ": yeterli soru yok");
    }
    return out.map(function (p) {
        return { ders: ders, konu: p.konu, metin: p.q.question, siklar: p.q.options.map(strip),
                 dogru: "ABCDE".charAt(p.q.correctAnswerIndex), cozum: p.q.explanation || "" };
    });
}

// Matematik: [konu, soru, şıklar, doğru değer, çözüm, hesap]
function M(konu, metin, siklar, dogru, cozum, hesap) {
    if (String(hesap) !== String(dogru)) throw new Error("Matematik sorusu tutarsız: " + metin + " -> " + hesap + " ≠ " + dogru);
    var idx = siklar.map(String).indexOf(String(dogru));
    if (idx < 0 || new Set(siklar.map(String)).size !== 5) throw new Error("Şıklar hatalı: " + metin);
    return { ders: "Matematik", konu: konu, metin: metin, siklar: siklar.map(String), dogru: "ABCDE".charAt(idx), cozum: cozum };
}
var mat = [
    M("Temel Kavramlar", "a, b ve c ardışık tek sayılardır (a < b < c). a + b + c = 63 olduğuna göre, c kaçtır?", [19, 21, 23, 25, 27], 23, "a + (a + 2) + (a + 4) = 63 → 3a = 57 → a = 19, c = 23.", (63 - 6) / 3 + 4),
    M("Sayı Basamakları", "İki basamaklı AB ve BA sayıları için AB + BA = 121 olduğuna göre, A + B kaçtır?", [9, 10, 11, 12, 13], 11, "AB + BA = 11(A + B) = 121 → A + B = 11.", 121 / 11),
    M("Bölme ve Bölünebilme", "Bir A doğal sayısının 12 ile bölümünden kalan 7'dir. Buna göre, 3A sayısının 12 ile bölümünden kalan kaçtır?", [3, 5, 7, 9, 11], 9, "3A ≡ 3·7 = 21 ≡ 9 (mod 12).", (3 * 7) % 12),
    M("Asal Çarpanlar, EBOB ve EKOK", "12 ve 18 sayılarının en küçük ortak katı kaçtır?", [24, 36, 48, 72, 216], 36, "12 = 2²·3, 18 = 2·3² → EKOK = 2²·3² = 36.", 36),
    M("Rasyonel Sayılar", "(1/2 + 1/3) : (1/6) işleminin sonucu kaçtır?", [2, 3, 4, 5, 6], 5, "1/2 + 1/3 = 5/6. (5/6) : (1/6) = 5.", (1 / 2 + 1 / 3) / (1 / 6)),
    M("Ondalık Sayılar", "0,25 · 0,4 işleminin sonucu kaçtır?", ["0,01", "0,1", "1", "0,001", "10"], "0,1", "0,25 · 0,4 = 0,100 = 0,1.", "0,1"),
    M("Basit Eşitsizlikler", "−2 < x < 5 eşitsizliğini sağlayan kaç tane x tam sayısı vardır?", [5, 6, 7, 8, 4], 6, "x ∈ {−1, 0, 1, 2, 3, 4} → 6 tane.", 6),
    M("Mutlak Değer", "|x − 3| = 5 denklemini sağlayan x değerlerinin toplamı kaçtır?", [2, 4, 6, 8, 10], 6, "x − 3 = 5 → x = 8; x − 3 = −5 → x = −2. Toplam 6.", 8 + (-2)),
    M("Üslü Sayılar", "(2⁵ · 4²) / 8² işleminin sonucu kaçtır?", [2, 4, 8, 16, 32], 8, "2⁵ · 2⁴ / 2⁶ = 2³ = 8.", Math.pow(2, 5) * 16 / 64),
    M("Köklü Sayılar", "√12 + √27 işleminin sonucu kaçtır?", ["3√3", "4√3", "5√3", "6√3", "√39"], "5√3", "√12 = 2√3, √27 = 3√3 → 5√3.", "5√3"),
    M("Çarpanlara Ayırma", "x² − y² = 45 ve x − y = 5 olduğuna göre, x + y kaçtır?", [5, 7, 9, 11, 15], 9, "x² − y² = (x − y)(x + y) → 45 = 5(x + y) → x + y = 9.", 45 / 5),
    M("Oran ve Orantı", "a / b = 3 / 5 ve a + b = 40 olduğuna göre, b kaçtır?", [15, 20, 24, 25, 30], 25, "a = 3k, b = 5k → 8k = 40 → k = 5, b = 25.", 5 * 40 / 8),
    M("Denklem Çözme", "3x − 7 = 2x + 5 denklemini sağlayan x değeri kaçtır?", [10, 11, 12, 13, 14], 12, "3x − 2x = 5 + 7 → x = 12.", 12),
    M("Sayı ve Kesir Problemleri", "Bir sayının 2/3'ünün 12 fazlası 36'dır. Bu sayı kaçtır?", [24, 30, 32, 36, 40], 36, "(2/3)x + 12 = 36 → (2/3)x = 24 → x = 36.", 24 * 3 / 2),
    M("Yaş Problemleri", "Ali 12, babası 40 yaşındadır. Kaç yıl sonra babanın yaşı Ali'nin yaşının 3 katı olur?", [1, 2, 3, 4, 5], 2, "40 + x = 3(12 + x) → 40 + x = 36 + 3x → x = 2.", (40 - 36) / 2),
    M("Yüzde, Kâr ve Zarar Problemleri", "80 TL'ye alınan bir ürün %25 kârla satılırsa satış fiyatı kaç TL olur?", [90, 95, 100, 105, 120], 100, "80 · 1,25 = 100 TL.", 80 * 1.25),
    M("Yüzde, Kâr ve Zarar Problemleri", "Fiyatı önce %20 artırılıp sonra %20 indirilen bir ürünün son fiyatı, ilk fiyatına göre yüzde kaç azalmıştır?", [0, 2, 4, 5, 8], 4, "1,2 · 0,8 = 0,96 → %4 azalma.", Math.round((1 - 1.2 * 0.8) * 100)),
    M("Karışım Problemleri", "%20'si tuz olan 40 gram tuzlu suya 10 gram tuz ekleniyor. Yeni karışımın yüzde kaçı tuzdur?", [30, 32, 34, 36, 40], 36, "Tuz: 8 + 10 = 18 g, toplam 50 g → %36.", (8 + 10) / 50 * 100),
    M("Hareket Problemleri", "Saatte 60 km hızla giden bir araç 150 km yolu kaç saatte alır?", ["2", "2,5", "3", "3,5", "4"], "2,5", "Süre = yol / hız = 150 / 60 = 2,5 saat.", "2,5"),
    M("İşçi ve Havuz Problemleri", "Bir işi A tek başına 6 günde, B tek başına 12 günde bitiriyor. İkisi birlikte bu işi kaç günde bitirir?", [3, 4, 5, 6, 9], 4, "1/6 + 1/12 = 3/12 = 1/4 → 4 gün.", 1 / (1 / 6 + 1 / 12)),
    M("Kümeler", "s(A) = 12, s(B) = 15 ve s(A ∩ B) = 5 olduğuna göre, s(A ∪ B) kaçtır?", [17, 20, 22, 25, 27], 22, "s(A ∪ B) = 12 + 15 − 5 = 22.", 12 + 15 - 5),
    M("Permütasyon, Kombinasyon ve Olasılık", "Bir torbada 3 kırmızı ve 5 mavi top vardır. Rastgele çekilen bir topun kırmızı olma olasılığı kaçtır?", ["1/8", "3/8", "1/2", "5/8", "3/5"], "3/8", "Kırmızı / toplam = 3 / 8.", "3/8")
];
if (mat.length !== 22) throw new Error("Matematik 22 soru olmalı: " + mat.length);

var gy = fromCatalog("Türkçe", 30).concat(mat).concat(fromCatalog("Geometri", 8, { only: function (q) { return !q.sekilli; } }));
var gk = fromCatalog("Tarih", 27).concat(fromCatalog("Coğrafya", 18)).concat(fromCatalog("Vatandaşlık", 9)).concat(fromCatalog("Güncel Bilgiler", 6));

// Bir şekilli soru örneği: görsel alanı nasıl kullanılır
var geoKonu = "Üçgende Açılar";
var sekilli = (cat.Geometri[geoKonu].sorular || []).filter(function (q) { return q.sekilli; })[0];
if (sekilli) {
    gy[gy.length - 1] = { ders: "Geometri", konu: geoKonu, metin: sekilli.question, siklar: sekilli.options.map(strip),
        dogru: "ABCDE".charAt(sekilli.correctAnswerIndex), cozum: sekilli.explanation || "", gorsel: "soru-60.png" };
    var dir = path.join(root, "docs", "canli-deneme-gorseller");
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(path.join(root, String(sekilli.img).replace(/\?.*$/, "")), path.join(dir, "soru-60.png"));
}

var sorular = gy.map(function (q, i) { return Object.assign({ no: i + 1, bolum: "GY" }, q); })
    .concat(gk.map(function (q, i) { return Object.assign({ no: 61 + i, bolum: "GK" }, q); }));
// --kulvar=onlisans|ortaogretim: aynı soruları başka kulvar için (docs/canli-deneme-ornek-<kulvar>.json)
var kulvarArg = (process.argv.find(function (a) { return a.indexOf("--kulvar=") === 0; }) || "").slice(9) || "lisans";
if (["lisans", "onlisans", "ortaogretim"].indexOf(kulvarArg) < 0) { console.error("kulvar: lisans, onlisans ya da ortaogretim"); process.exit(1); }
var KULVAR_ADI = { lisans: "", onlisans: " · Önlisans", ortaogretim: " · Ortaöğretim" };
var doc = { kulvar: kulvarArg, baslik: "Örnek Canlı Deneme" + KULVAR_ADI[kulvarArg], sorular: sorular.map(function (q) {
    var o = { no: q.no, bolum: q.bolum, ders: q.ders, konu: q.konu, metin: q.metin, siklar: q.siklar, dogru: q.dogru, cozum: q.cozum };
    if (q.gorsel) o.gorsel = q.gorsel;
    return o;
}) };
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
var outName = kulvarArg === "lisans" ? "canli-deneme-ornek.json" : "canli-deneme-ornek-" + kulvarArg + ".json";
fs.writeFileSync(path.join(root, "docs", outName), JSON.stringify(doc, null, 2) + "\n");
console.log("docs/" + outName + ": " + sorular.length + " soru");
