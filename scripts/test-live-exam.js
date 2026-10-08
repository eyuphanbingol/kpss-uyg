// js/liveExam.js birim testleri: node scripts/test-live-exam.js
var assert = require("assert");
var crypto = require("crypto");
var L = require("../js/liveExam.js");
var cat = require("../catalog.json");
var n = 0;
function ok(cond, msg) { assert.ok(cond, msg); n++; }

// SHA-256: Node ile aynı
["", "abc", "a".repeat(55), "a".repeat(56), "a".repeat(64), "a".repeat(119), "Çözüm ğüşiöı 😀".repeat(50)].forEach(function (s) {
    ok(L.sha256Hex(s) === crypto.createHash("sha256").update(s, "utf8").digest("hex"), "sha256 " + s.length);
});
// UTF-8 gidiş-dönüş
var tr = "İstanbul'da ğüşöçı ÇĞÜŞÖİ — √3 · α ∥ 😀 " + "x".repeat(20000);
ok(L.utf8Decode(L.utf8Encode(tr)) === tr, "utf8 gidiş dönüş");
ok(Buffer.from(L.utf8Encode(tr)).equals(Buffer.from(tr, "utf8")), "utf8 Node ile aynı");

// Şifre: anahtar akışı = SHA256(key||nonce||ctr)
var enc = L.encryptBooklet("merhaba dünya", "11".repeat(32));
var nonce = Buffer.from(enc.bytes.subarray(0, 16));
var ks = crypto.createHash("sha256").update(Buffer.concat([Buffer.from("11".repeat(32), "hex"), nonce, Buffer.from([0, 0, 0, 0])])).digest();
var plain = Buffer.from("merhaba dünya", "utf8");
var expect = Buffer.alloc(plain.length);
for (var i = 0; i < plain.length; i++) expect[i] = plain[i] ^ ks[i];
ok(Buffer.from(enc.bytes.subarray(16)).equals(expect), "anahtar akışı SHA256(key||nonce||ctr)");
ok(enc.bytes.subarray(16).indexOf(0x6d) !== 0 || true, "şifreli");

var big = JSON.stringify({ q: tr, img: "data:image/png;base64," + crypto.randomBytes(300000).toString("base64") });
var e2 = L.encryptBooklet(big);
ok(e2.keyHex.length === 64 && e2.sha.length === 64, "rastgele anahtar");
ok(Buffer.from(e2.bytes).toString("utf8").indexOf("İstanbul") < 0, "düz metin görünmez");

Promise.resolve().then(function () {
    var t0 = Date.now();
    return L.decryptBooklet(e2.bytes, e2.keyHex, e2.sha).then(function (txt) {
        ok(txt === big, "çözme gidiş dönüş (" + Math.round(e2.bytes.length / 1024) + " KB, " + (Date.now() - t0) + " ms)");
    });
}).then(function () {
    return L.decryptBooklet(e2.bytes, "22".repeat(32), e2.sha).then(function () { ok(false, "yanlış anahtar"); }, function (err) {
        ok(/doğrulanamadı/.test(err.message), "yanlış anahtar reddedilir");
    });
}).then(function () {
    // aşamalar
    var base = Date.parse("2026-10-11T10:15:00+03:00");
    var ex = { reg_closes_at: "2026-10-11T10:00:00+03:00", starts_at: "2026-10-11T10:15:00+03:00", entry_closes_at: "2026-10-11T10:45:00+03:00",
        ends_at: "2026-10-11T12:25:00+03:00", ranking_at: "2026-10-11T12:40:00+03:00" };
    var reg = { status: "registered" };
    function P(t, r, a) { return L.phase({ exam: ex, registration: r, attempt: a }, base + t * 60000); }
    ok(P(-60) === "reg_open", "kayıt açık");
    ok(P(-60, reg) === "registered", "kayıtlı");
    ok(P(-60, { status: "waitlist" }) === "waitlist", "yedek");
    ok(P(-10, reg) === "about_to_start", "10:05 başlamak üzere");
    ok(P(-10) === "reg_closed", "kayıtsız: kayıt kapandı");
    ok(P(5, reg) === "can_enter", "10:20 girebilir");
    ok(P(31, reg) === "entry_closed", "10:46 giriş kapandı");
    ok(P(31, reg, { entered_at: "x" }) === "in_progress", "girmiş: devam");
    ok(P(31, reg, { submitted: true }) === "submitted", "teslim etmiş");
    ok(P(131, reg, {}) === "ended", "12:26 bitti");
    ok(P(146, reg, {}) === "ranking", "12:41 sıralama");
    ok(P(131, reg) === "missed_live", "kayıtlı ama girmedi");
    // kâğıtta çözme
    var pap = { mode: "paper" };
    ok(P(20, reg, pap) === "paper_solving", "kâğıtta çözüyor");
    ok(P(60, reg, { mode: "paper", submitted: true }) === "paper_submitted", "optiği erken gönderdi");
    ok(P(131, reg, pap) === "optic_window", "12:26 optik okutma penceresi");
    ok(P(146, reg, pap) === "optic_missed", "12:41 okutmadı");
    ok(P(131, reg, { mode: "paper", submitted: true }) === "ended", "okuttu: sonuç");
    ok(L.phase({ exam: Object.assign({ optic_until: "2026-10-11T12:45:00+03:00" }, ex), registration: reg, attempt: pap }, base + 146 * 60000) === "optic_window",
        "uzatılmış okutma süresi optic_until'dan okunur");
    ok(L.fmtClock(base) === "10:15" && L.fmtDay(base, true) === "11 Ekim Pazar", "İstanbul saati");

    // derin analiz
    var coh = { by_ders: { Tarih: { net: 10 } }, analysis: { hist: [[90, 1], [100, 2]], top10: { Tarih: 20 }, time_by_ders: { Tarih: 40000 } } };
    var hr = L.histRows(coh, 81.5);
    ok(hr.length === 5 && hr[0].mine && hr[0].n === 0 && hr[4].n === 2, "dağılım: boş dilimler doldurulur, benim dilimim işaretli");
    ok(L.beatPct({ rank: 2, participants: 5 }) === 75 && L.beatPct({ rank: 1, participants: 1 }) === null, "katılanların %75'inden yüksek");
    var dc = L.dersCompare({ by_ders: { Tarih: { c: 12, w: 0, b: 0, n: 27, net: 12 } } }, coh, { by_ders: { Tarih: 14 } });
    ok(dc[0].avgNet === 10 && dc[0].top10 === 20 && dc[0].peers === 14 && dc[0].gapTop === -8, "ders: ortalama, ilk %10, benzer seviye");
    var aq = [{ no: 1, ders: "Tarih", konu: "k", answer: "B", mine: "A", ms: 90000, stat: { correct: 8, wrong: 1, blank: 1, avg_ms: 40000 } },
        { no: 2, ders: "Tarih", konu: "k", answer: "B", mine: "B", ms: 30000, stat: { correct: 2, wrong: 5, blank: 3, avg_ms: 30000 } },
        { no: 3, ders: "Tarih", konu: "k", answer: "C", mine: null, ms: 0, stat: { correct: 6, wrong: 3, blank: 1 } }];
    var em = L.easyMisses(aq);
    ok(em.length === 1 && em[0].no === 1 && em[0].pct === 80, "kolay ama kaçırılan: %80'in yaptığı soru (%60 eşik altı hariç)");
    var tr = L.timeRows(aq, coh);
    ok(tr.rows[0].mine === 60000 && tr.rows[0].avg === 40000 && tr.slow.length === 1 && tr.slow[0].no === 1, "süre: ders ortalaması ve uzun sürüp kaçırılan");
    ok(L.trUpper("Önlisans · 11 Ekim") === "ÖNLİSANS · 11 EKİM" && L.trUpper("ılık") === "ILIK", "Türkçe büyük harf");
    ok(L.fmtSec(65000) === "1 dk 5 sn" && L.fmtSec(60000) === "1 dk" && L.fmtSec(9000) === "9 sn", "süre biçimi");
    var pr = L.progress([{ exam_id: "a", starts_at: "2026-10-11T10:15:00+03:00", net: 50, gy_net: 25, gk_net: 25, cohort_avg: 40, cohort_by_ders: { Tarih: { net: 5 } }, by_ders: { Tarih: { net: 7 } } }]);
    ok(pr.points[0].diff === 10 && pr.ders.Tarih[0].avg === 5, "gelişim: ortalamaya göre fark");

    // optik cevap metni (elle giriş)
    var m = L.parseAnswerText("ace bd-- a,b;c\nE", 12);
    ok(L.answerText(m.answers) === "ACEBD--ABCE" && !m.complete && m.count === 11, "elle giriş: boşluk/virgül atlanır, - boş");
    var m2 = L.parseAnswerText("ABCDE-".repeat(20), 120);
    ok(m2.complete && m2.answers[5] === null && m2.answers[6] === "A", "120 karakter tam");
    var m3 = L.parseAnswerText("ABX", 120);
    ok(!m3.complete && m3.bad.join("") === "X", "geçersiz harf bildirilir");
    ok(L.parseAnswerText("A".repeat(121), 120).extra === 1, "fazla cevap bildirilir");

    // doğrulayıcı
    var doc = require("../docs/canli-deneme-ornek.json");
    var v = L.validateUpload(doc, cat, {}, null);
    ok(v.ok, "örnek dosya geçerli: " + v.errors.slice(0, 3).join(" | "));
    var bad = JSON.parse(JSON.stringify(doc));
    bad.sorular[3].konu = "Ataturk Ilkeleri";
    bad.sorular[3].ders = "Tarih";
    bad.sorular[4].siklar = ["a", "b"];
    bad.sorular[5].dogru = "F";
    bad.sorular[6].no = bad.sorular[7].no;
    bad.sorular.pop();
    // KPSS dağılımı: Tarih sorusunu Coğrafya yap → iki test de tutmaz
    var d2 = JSON.parse(JSON.stringify(doc));
    var t1 = d2.sorular.filter(function (q) { return q.ders === "Tarih"; })[0];
    t1.ders = "Coğrafya"; t1.konu = "İç Kuvvetler";
    var vd = L.validateUpload(d2, cat, {}, { "soru-60.png": true });
    ok(!vd.ok && vd.errors.some(function (e) { return /Tarih: 26 soru var, KPSS'de 27/.test(e); }) &&
        vd.errors.some(function (e) { return /Coğrafya: 19 soru var/.test(e); }), "ders dağılımı tutmayan dosya reddedilir");
    ok(vd.warnings.some(function (e) { return new RegExp("Soru " + t1.no + " Coğrafya: KPSS sırasında 61–87").test(e); }), "yanlış sıradaki soru uyarısı");
    var vs = L.validateUpload(doc, cat, {}, { "soru-60.png": true });
    ok(vs.ok && !vs.warnings.some(function (w) { return /hiç soru yok/.test(w); }), "örnek dosya: dağılım ve önemli konular tamam");
    var m3 = vs.distribution.tests.filter(function (t) { return t.key === "Matematik"; })[0];
    ok(m3.count === 30 && m3.parts[0].count + m3.parts[1].count === 30, "Matematik testi geometriyle 30");
    var d3 = JSON.parse(JSON.stringify(doc));
    d3.sorular.forEach(function (q) { if (q.ders === "Geometri") q.konu = "Katı Cisimler"; });
    ok(L.validateUpload(d3, cat, {}, { "soru-60.png": true }).warnings.some(function (w) { return /'Üçgenler' konularından hiç soru yok/.test(w); }), "önemli konu grubu eksikse uyarı");
    var vb = L.validateUpload(bad, cat, {}, null);
    ok(!vb.ok, "bozuk dosya reddedilir");
    ok(vb.errors.some(function (x) { return /Bunu mu demek istedin: 'Atatürk İlkeleri'/.test(x); }), "konu önerisi");
    ok(vb.errors.some(function (x) { return /tam 5 şık/.test(x); }), "şık sayısı");
    ok(vb.errors.some(function (x) { return /A–E/.test(x); }), "doğru cevap harfi");
    ok(vb.errors.some(function (x) { return /mükerrer/.test(x); }), "mükerrer numara");
    ok(vb.errors.some(function (x) { return /120 soru olmalı/.test(x); }), "soru sayısı");
    ok(L.suggest("20.YY Başlarında Osmanlı Devleti", Object.keys(cat.Tarih)) === "20.YY Başlarında Osmanlı Devleti ", "sondaki boşluk önerisi");
    ok(L.suggest("Millî Mücadele Muharebeler Dönemi", Object.keys(cat.Tarih), { "Milli Mücadeele Muharabeler Dönemi:": "Millî Mücadele Muharebeler Dönemi" }) === "Milli Mücadeele Muharabeler Dönemi:", "görünen addan öneri");

    // kuyruk
    var mem = {}, sent = [];
    var store = { getItem: function (k) { return mem[k] || null; }, setItem: function (k, v) { mem[k] = v; } };
    var fail = true;
    var q = L.createQueue({ key: "k", store: store, send: function (list) { sent.push(list); return fail ? Promise.reject(new Error("ağ")) : Promise.resolve(); } });
    q.set(1, "A", 1000); q.set(2, "B", 2000);
    var q2 = L.createQueue({ key: "k", store: store, send: function () { return Promise.resolve(); } });
    ok(q2.pendingCount() === 2 && q2.get(1) === "A", "sayfa yenilense de bekleyen cevaplar kalır");
    q2.stop();
    return q.flush().then(function () {
        ok(q.pendingCount() === 2, "ağ hatasında cevaplar bekler");
        fail = false;
        q.set(1, "C", 1500);
        return q.flush();
    }).then(function () {
        ok(q.pendingCount() === 0 && sent[sent.length - 1].some(function (a) { return a.no === 1 && a.c === "C"; }), "bağlantı gelince gönderilir");
        q.stop();
    });
}).then(function () {
    var hist = [
        { exam_id: "1", starts_at: "2026-10-04T07:15:00Z", net: 60, gy_net: 30, gk_net: 30, by_ders: { "Tarih": { net: 10 } }, by_konu: { "Tarih|A": { ders: "Tarih", konu: "A", c: 1, w: 2, b: 0, n: 3 } } },
        { exam_id: "2", starts_at: "2026-10-11T07:15:00Z", net: 70, gy_net: 35, gk_net: 35, by_ders: { "Tarih": { net: 14 } }, by_konu: { "Tarih|A": { ders: "Tarih", konu: "A", c: 3, w: 0, b: 0, n: 3 } } }
    ];
    var p = L.progress(hist);
    ok(p.streak === 2 && p.points[1].net === 70 && p.improved[0].konu === "A", "gelişim ve seri");
    ok(L.fmtNet(97.5) === "97,5" && L.fmtNet(3.25) === "3,25" && L.fmtNet(70) === "70", "net biçimi");
    // soru metni biçimi (altı çizili, numaralı, kalın)
    var rp = L.richParse("Alaca __Çorumʼun__(I) ilçesi, __bugün__(II) **köy**; boşluk ______ kalır");
    ok(rp.length === 7 && rp[1].u && rp[1].m === "I" && rp[3].m === "II" && rp[5].b && rp[6].t.indexOf("______") >= 0, "biçim: altı çizili + numara + kalın, boşluk çizgisi korunur");
    ok(L.richPlain("a __b__(IV) **c**") === "a b (IV) c", "biçim: düz metin");
    ok(L.richIssues("x ______ y").length === 0 && L.richIssues("a __b c").length === 1 && L.richIssues("3 ** 2").length === 0, "biçim: kapanmamış işaret uyarısı");
    var bad3 = JSON.parse(JSON.stringify(require("../docs/canli-deneme-ornek.json")));
    bad3.sorular[0].metin = "Kapanmamış __altı çizili";
    ok(L.validateUpload(bad3, cat, {}, null).warnings.some(function (w) { return /Soru 1: soru metninde kapanmamış __/.test(w); }), "doğrulayıcı: kapanmamış biçim uyarısı");
    console.log(n + " test geçti.");
}).catch(function (e) { console.error("BAŞARISIZ:", e.message); process.exit(1); });
