// Optik okuma çekirdeği birim testleri (Node): node scripts/test-omr.js
// Görüntü üzerinden uçtan uca ölçüm için: node scripts/test-omr-synthetic.js
var assert = require("assert");
var O = require("../optik/omr.js");
var layout = require("../optik/optik-form.json");
var n = 0;
function ok(c, m) { assert.ok(c, m); n++; }
O.setLayout(layout);

// yerleşim
ok(O.questionCount() === 120, "120 soru");
var seen = {}, inside = true, unique = true;
for (var q = 1; q <= 120; q++) for (var li = 0; li < 5; li++) {
    var c = O.bubbleCenter(q, li);
    if (!(c && c.x > 10 && c.x < 200 && c.y > 70 && c.y < 265)) inside = false;
    var k = c.x.toFixed(2) + "," + c.y.toFixed(2);
    if (seen[k]) unique = false;
    seen[k] = 1;
}
ok(inside, "600 baloncuk sayfa içinde");
ok(unique, "baloncuklar çakışmaz");
// köşe kareleri, karekod ve baloncuklar çakışmaz
var M = layout.marker, Q = layout.qr;
M.centers.forEach(function (m) {
    ok(m[0] - M.size / 2 >= 3 && m[0] + M.size / 2 <= layout.page.w - 3, "köşe karesi yazıcı payının içinde");
});
ok(Q.x + Q.size <= M.centers[1][0] - M.size / 2 + 10 && Q.y >= M.centers[1][1] + M.size / 2, "karekod köşe karesine değmez");

// homografi: bilinen dönüşümü geri bul
var src = [[0, 0], [100, 0], [100, 150], [0, 150]], dst = [[10, 20], [210, 35], [190, 330], [5, 300]];
var H = O.solveHomography(src, dst);
src.forEach(function (p, i) {
    var r = O.applyH(H, p[0], p[1]);
    ok(Math.abs(r[0] - dst[i][0]) < 1e-6 && Math.abs(r[1] - dst[i][1]) < 1e-6, "homografi köşe " + i);
});

// karekod içeriği
var payload = O.qrPayload("3f1c2a9e-5b7d-4c11-9e2f-8a6b4d0c1e77", "00000000-0000-4000-8000-000000000001", "lisans");
ok(/^[0-9A-Z:]+$/.test(payload), "karekod alfanümerik kipte: " + payload);
var info = O.parseQr(payload);
ok(info && info.exam === "3f1c2a9e-5b7d-4c11-9e2f-8a6b4d0c1e77" && info.user === "00000000-0000-4000-8000-000000000001" && info.track === "lisans", "karekod geri çözülür");
ok(info.canonical === "ATN|1|3f1c2a9e-5b7d-4c11-9e2f-8a6b4d0c1e77|00000000-0000-4000-8000-000000000001|lisans", "sunucuya giden kanonik biçim");
ok(O.parseQr("başka bir karekod") === null && O.parseQr("ATN:1:XYZ:ABC:L") === null, "yabancı karekod reddedilir");

// karar eşikleri
function rows(spec) { return spec.map(function (r) { return r.slice(); }); }
var dark = [];
for (var i = 0; i < 120; i++) dark.push([0.05, 0.06, 0.05, 0.04, 0.05]);
for (i = 0; i < 100; i++) dark[i][i % 5] = 0.6;
dark[100] = [0.6, 0.62, 0.05, 0.05, 0.05];   // çift
dark[101] = [0.6, 0.05, 0.3, 0.05, 0.05];    // silinmiş iz
dark[102] = [0.25, 0.05, 0.05, 0.05, 0.05];  // çok hafif tek işaret
var cl = O.classify(rows(dark));
ok(cl.answers[0] === "A" && cl.answers[4] === "E" && !cl.flags[0], "net işaretler okunur");
ok(cl.flags[100] === "double" && cl.answers[100] === null, "çift işaret boş + uyarı");
ok(cl.flags[101] === "uncertain" && cl.answers[101] === "A", "silinmiş iz: tahmin + kararsız");
ok(cl.flags[102] === "uncertain", "hafif işaret kararsız");
ok(cl.answers[110] === null && !cl.flags[110], "boş satır boş");
var blank = [];
for (i = 0; i < 120; i++) blank.push([0.05, 0.06, 0.05, 0.04, 0.05]);
var cb = O.classify(blank);
ok(cb.counts.blank === 120 && cb.counts.uncertain === 0, "tamamen boş form: 120 boş, uyarı yok");

console.log(n + " optik test geçti.");
