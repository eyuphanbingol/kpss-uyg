#!/usr/bin/env node
/**
 * Optik okuma hattının sentetik test seti ve başarı raporu.
 *   node scripts/test-omr-synthetic.js            (her senaryoda 8 form, ~100 form)
 *   node scripts/test-omr-synthetic.js --quick    (her senaryoda 2 form)
 * Playwright gerekir: PW=<playwright-core yolu> ya da `npm i -D playwright`.
 * Rapor: docs/optik-test-raporu.md, örnek görseller: docs/optik-ornekler/
 */
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
var pw;
try { pw = require(process.env.PW || "playwright"); } catch (e) {
    console.error("Playwright bulunamadı. PW=<playwright-core yolu> ile çalıştır ya da `npm i -D playwright` kur.");
    process.exit(2);
}
var quick = process.argv.indexOf("--quick") >= 0;
var only = (process.argv.find(function (a) { return a.indexOf("--only=") === 0; }) || "").slice(7);
var PER = quick ? 2 : 8;
var QR = "ATN:1:3F1C2A9E5B7D4C119E2F8A6B4D0C1E77:00000000000040008000000000000001:L";

// Her senaryo bir telefon fotoğrafı koşulu. Değerler omr-synth.js photograph() parametreleri.
var SCENARIOS = [
    { id: "duz", ad: "Düz, iyi ışık", p: { persp: 0.01, rotJitter: 2, noise: 3 } },
    { id: "egik", ad: "Eğik (±15°) ve hafif perspektif", p: { rotate: 12, rotJitter: 8, persp: 0.04 } },
    { id: "perspektif", ad: "Güçlü perspektif (yandan çekim)", p: { persp: 0.11, rotJitter: 6, fill: 0.8 } },
    { id: "ters", ad: "Ters çekilmiş (180°)", p: { rotate: 180, rotJitter: 6, persp: 0.04 } },
    { id: "golge", ad: "Sayfanın yarısında gölge", p: { shadow: 0.45, persp: 0.04 } },
    { id: "los", ad: "Loş ışık ve gürültü", p: { gain: 0.5, noise: 9, gradient: 0.5, persp: 0.04 } },
    { id: "bulanik", ad: "Bulanık (odak kayması)", p: { blur: 2, persp: 0.04, noise: 4 } },
    { id: "silik", ad: "Silik (açık) kurşun kalem", p: { tone: [120, 155], persp: 0.04 } },
    { id: "silgi", ad: "Silinmiş izler ve çift işaret", p: { erased: 0.1, double: 0.04, eraseAlpha: 0.72, persp: 0.04 } },
    { id: "lens", ad: "Lens bükülmesi, dağınık zemin", p: { barrel: 0.06, clutter: 8, fill: 0.78, persp: 0.05 } },
    { id: "dusuk", ad: "Düşük çözünürlük (1000×1333)", p: { W: 1000, H: 1333, persp: 0.04, jpeg: 0.7 } },
    { id: "kotusilgi", ad: "Kötü silinmiş izler", p: { erased: 0.15, eraseAlpha: 0.45, persp: 0.04 } },
    { id: "yarim", ad: "Yarım doldurulmuş baloncuklar", p: { cover: [0.4, 0.7], persp: 0.04 } },
    { id: "soluk", ad: "Soluk yazıcı baskısı", p: { inkFade: 0.5, persp: 0.04, noise: 5 } },
    { id: "kivrim", ad: "Kıvrık kâğıt (ortada ~7 mm kabarma)", p: { curl: 0.025, persp: 0.05, shadow: 0.2 } },
    { id: "cokdusuk", ad: "Çok düşük çözünürlük (800×1067)", p: { W: 800, H: 1067, persp: 0.04, jpeg: 0.6, noise: 5 } },
    { id: "kadraj", ad: "Köşe kadraj dışında", expectFail: true, p: { allowCut: true, fill: 1.02, rotate: 6, persp: 0.03 } },
    // Sınır senaryoları: okuyucu ya doğru okumalı ya "yeniden çek" demeli; sessizce yanlış okumamalı.
    { id: "sinir-bulanik", ad: "Sınır: çok bulanık", expectFail: true, p: { blur: 4, persp: 0.04 } },
    { id: "sinir-karanlik", ad: "Sınır: çok karanlık", expectFail: true, p: { gain: 0.25, noise: 12, persp: 0.04 } },
    { id: "sinir-kivrim", ad: "Sınır: ortada ~13 mm kabarma", expectFail: true, p: { curl: 0.045, persp: 0.04 } },
    { id: "sinir-yandan", ad: "Sınır: çok yandan çekim", expectFail: true, p: { persp: 0.18, fill: 0.75 } },
    { id: "karma", ad: "Karma zor koşul", p: { rotate: 8, rotJitter: 10, persp: 0.08, shadow: 0.35, gain: 0.7, noise: 7, blur: 1, tone: [70, 130], erased: 0.05, double: 0.02, barrel: 0.03, clutter: 4 } }
].filter(function (s) { return !only || s.id === only; });

(async function () {
    var browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
    var page = await browser.newPage();
    await page.route("http://omr.test/**", function (route) {
        var u = new URL(route.request().url());
        var f = path.join(root, decodeURIComponent(u.pathname));
        if (!f.startsWith(root) || !fs.existsSync(f)) return route.fulfill({ status: 404, body: "" });
        return route.fulfill({ path: f });
    });
    var errs = [];
    page.on("pageerror", function (e) { errs.push(e.message); });
    await page.goto("http://omr.test/scripts/omr-synth.html");
    await page.evaluate(function () { return window.ready; });

    var rows = [], samples = [];
    for (var si = 0; si < SCENARIOS.length; si++) {
        var sc = SCENARIOS[si], res = [];
        for (var k = 0; k < PER; k++) {
            var p = Object.assign({ qrText: QR, keepImage: k === 0 && !sc.expectFail }, sc.p);
            var r = await page.evaluate(function (a) { return OmrSynth.runOne(a.seed, a.p); }, { seed: 1000 * (si + 1) + k * 7 + 1, p: p });
            if (r.preview) { samples.push({ id: sc.id, data: r.preview }); r.preview = null; }
            res.push(r);
        }
        if (sc.expectFail) {
            var refused = res.filter(function (r) { return !r.ok; }).length;
            var wrong = res.filter(function (r) { return r.ok && r.score.silent > 0; });
            var safe = { id: sc.id, ad: sc.ad, forms: res.length, refused: refused, misread: wrong.length,
                silent: wrong.reduce(function (s, r) { return s + r.score.silent; }, 0), expectFail: true };
            rows.push(safe);
            console.log([sc.id.padEnd(14), "reddedildi " + refused + "/" + res.length, "yanlış kabul " + wrong.length,
                res.filter(function (r) { return r.ok && !r.score.silent; }).length + " doğru okundu"].join("  "));
            continue;
        }
        var ok = res.filter(function (r) { return r.ok; });
        var sum = function (f) { return ok.reduce(function (s, r) { return s + f(r); }, 0); };
        var rowsTot = sum(function (r) { return r.score.rows; });
        var row = {
            id: sc.id, ad: sc.ad, forms: res.length, read: ok.length,
            correctPct: rowsTot ? 100 * sum(function (r) { return r.score.correct; }) / rowsTot : 0,
            flaggedPct: rowsTot ? 100 * sum(function (r) { return r.score.flagged; }) / rowsTot : 0,
            silent: sum(function (r) { return r.score.silent; }),
            qr: ok.filter(function (r) { return r.qr; }).length,
            ms: Math.round(sum(function (r) { return r.ms; }) / Math.max(1, ok.length)),
            fails: res.filter(function (r) { return !r.ok; }).map(function (r) { return r.code; })
        };
        rows.push(row);
        console.log([row.id.padEnd(11), row.read + "/" + row.forms, row.correctPct.toFixed(2) + "%", "işaretli " + row.flaggedPct.toFixed(2) + "%",
            "sessiz hata " + row.silent, "karekod " + row.qr + "/" + row.read, row.ms + " ms", row.fails.join(",")].join("  "));
    }
    await browser.close();
    if (errs.length) { console.error("Sayfa hataları:", errs.slice(0, 5)); process.exit(1); }

    var safety = rows.filter(function (r) { return r.expectFail; });
    rows = rows.filter(function (r) { return !r.expectFail; });
    var T = rows.reduce(function (a, r) {
        a.forms += r.forms; a.read += r.read; a.silent += r.silent; a.qr += r.qr;
        a.correct += r.correctPct * r.read * 120 / 100; a.flag += r.flaggedPct * r.read * 120 / 100;
        return a;
    }, { forms: 0, read: 0, silent: 0, qr: 0, correct: 0, flag: 0 });
    var totalRows = T.read * 120;
    console.log("\nTOPLAM: " + T.read + "/" + T.forms + " form okundu · satırların %" + (100 * T.correct / totalRows).toFixed(2) +
        " doğrudan doğru, %" + (100 * T.flag / totalRows).toFixed(2) + " onaya düştü · sessiz hata " + T.silent + " · karekod " + T.qr + "/" + T.read);

    if (!quick && !only) {
        var dir = path.join(root, "docs", "optik-ornekler");
        fs.mkdirSync(dir, { recursive: true });
        samples.forEach(function (s) { fs.writeFileSync(path.join(dir, s.id + ".jpg"), Buffer.from(s.data.split(",")[1], "base64")); });
        var md = [
            "# Optik okuma — sentetik test raporu",
            "",
            "`node scripts/test-omr-synthetic.js` ile üretildi (" + new Date().toISOString().slice(0, 10) + "). Her senaryoda " + PER +
                " form; her formda 120 soru, rastgele cevaplar (%12 boş). Form, uygulamanın gerçek çizim koduyla çizilip kurşun kalem",
            "izleriyle doldurulur, sonra telefon fotoğrafı gibi bozulur ve okuma hattından geçirilir.",
            "",
            "- **Doğrudan doğru:** okunan cevap gerçek cevapla aynı ve uyarısız.",
            "- **Onaya düştü:** okuyucu satırı \"kararsız\" ya da \"çift işaret\" diye işaretledi; kullanıcı onay ekranında görüp düzeltir.",
            "- **Sessiz hata:** okuyucu uyarı vermeden yanlış okudu. Asıl risk budur; hedef 0.",
            "",
            "| Senaryo | Okunan form | Doğrudan doğru | Onaya düştü | Sessiz hata | Karekod | Süre |",
            "|---|---|---|---|---|---|---|"
        ];
        rows.forEach(function (r) {
            md.push("| " + r.ad + " | " + r.read + "/" + r.forms + " | %" + r.correctPct.toFixed(2) + " | %" + r.flaggedPct.toFixed(2) + " | " +
                r.silent + " | " + r.qr + "/" + r.read + " | " + r.ms + " ms |");
        });
        md.push("| **Toplam** | **" + T.read + "/" + T.forms + "** | **%" + (100 * T.correct / totalRows).toFixed(2) + "** | **%" +
            (100 * T.flag / totalRows).toFixed(2) + "** | **" + T.silent + "** | **" + T.qr + "/" + T.read + "** | |");
        md.push("", "## Güvenlik ve sınır senaryoları", "",
            "Bu fotoğraflarda okuyucunun iki doğru davranışı var: doğru okumak ya da \"yeniden çek\" diye reddetmek. Uyarısız yanlış okuma kabul edilmez.", "",
            "| Senaryo | Reddedildi | Doğru okundu | Uyarısız yanlış |", "|---|---|---|---|");
        safety.forEach(function (r) {
            md.push("| " + r.ad + " | " + r.refused + "/" + r.forms + " | " + (r.forms - r.refused - r.misread) + "/" + r.forms + " | " + r.misread + " |");
        });
        md.push("", "## Sınırlamalar", "",
            "- Görseller sentetiktir. Gerçek kâğıt, yazıcı ve telefon kameralarıyla birkaç formluk bir deneme yapılmadan yayına alınmamalı.",
            "- Süreler masaüstü Chromium'da ölçüldü; telefonda 3–5 kat uzun sürebilir (yaklaşık 1–2 saniye).",
            "- Okuma her zaman onay ekranından geçer: kararsız ve çift işaretli satırlar renkle gösterilir, kullanıcı onaylamadan hiçbir şey gönderilmez.");
        md.push("", "Örnek bozulmuş görseller: `docs/optik-ornekler/<senaryo>.jpg`.", "");
        fs.writeFileSync(path.join(root, "docs", "optik-test-raporu.md"), md.join("\n"));
        console.log("Rapor: docs/optik-test-raporu.md");
    }
    var unsafe = safety.reduce(function (s, r) { return s + r.misread; }, 0);
    if (T.read < T.forms || T.silent > 0 || unsafe > 0) process.exitCode = 1;
})().catch(function (e) { console.error(e); process.exit(1); });
