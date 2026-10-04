/**
 * Harita oyunu doğruluk testi:
 *   node scripts/check-map-pins.js
 * - Her hedefin gerçek konumu (ITEM_LL -> svg/tr.svg izdüşümü) cevap illerinden birinin içinde mi?
 * - Takip sorularında doğru cevap şıklar arasında mı, şıklar tekrarsız mı?
 * - Aynı konuda aynı adı taşıyan iki hedef var mı?
 * - Mobil kopya (mobile/src/lib/mapQuiz.js) js/mapQuiz.js ile aynı mı?
 * Hata varsa listeler ve 1 ile çıkar.
 */
var fs = require("fs");
var path = require("path");
var cp = require("child_process");

var root = path.join(__dirname, "..");
var Q = require(path.join(root, "js", "mapQuiz.js"));
var svg = fs.readFileSync(path.join(root, "svg", "tr.svg"), "utf8");

// --- il sınırları (yalnız M/m/L/l/H/h/V/v/Z/z komutları kullanılıyor) ---
var polys = {};
var re = /<path d="([^"]+)"[^>]*id="(TR\d+)"/g;
var m;
while ((m = re.exec(svg))) {
    var toks = m[1].match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g);
    var rings = polys[m[2]] = polys[m[2]] || [];
    var i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0, cur = null;
    var num = function () { return parseFloat(toks[i++]); };
    while (i < toks.length) {
        if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
        if (cmd === "M" || cmd === "m") {
            var a = num(), b = num();
            if (cmd === "m" && cur) { x += a; y += b; } else { x = a; y = b; }
            sx = x; sy = y; cur = [[x, y]]; rings.push(cur);
            cmd = cmd === "m" ? "l" : "L";
        } else if (cmd === "L") { x = num(); y = num(); cur.push([x, y]); }
        else if (cmd === "l") { x += num(); y += num(); cur.push([x, y]); }
        else if (cmd === "H") { x = num(); cur.push([x, y]); }
        else if (cmd === "h") { x += num(); cur.push([x, y]); }
        else if (cmd === "V") { y = num(); cur.push([x, y]); }
        else if (cmd === "v") { y += num(); cur.push([x, y]); }
        else if (cmd === "Z" || cmd === "z") { x = sx; y = sy; }
        else throw new Error("desteklenmeyen path komutu: " + cmd);
    }
}
function inRing(p, r) {
    var c = false;
    for (var a = 0, b = r.length - 1; a < r.length; b = a++) {
        if (((r[a][1] > p[1]) !== (r[b][1] > p[1])) &&
            (p[0] < (r[b][0] - r[a][0]) * (p[1] - r[a][1]) / (r[b][1] - r[a][1]) + r[a][0])) c = !c;
    }
    return c;
}
function provinceAt(px, py) {
    var found = null;
    Object.keys(polys).forEach(function (code) {
        var n = 0;
        polys[code].forEach(function (r) { if (inRing([px, py], r)) n++; });
        if (n % 2) found = found || code;
    });
    return found;
}

var errors = [];
var seen = {};
Q.ITEMS.forEach(function (it) {
    var key = it.topic + "|" + it.name;
    if (seen[key]) errors.push("tekrarlanan hedef: " + key);
    seen[key] = true;
    if (it.codes && it.codes.length) {
        var at = provinceAt(it.x, it.y);
        if (it.codes.indexOf(at) < 0) {
            errors.push(it.topic + " / " + it.name + ": konum " + (at ? Q.nameOf(at) : "denizde/harita dışında") +
                ", beklenen " + it.codes.map(Q.nameOf).join(" / "));
        }
    } else if (!it.mcq) {
        errors.push(it.topic + " / " + it.name + ": cevap ili yok (yer adı tanınmadı)");
    }
    var f = it.follow;
    if (f) {
        if (!f.q || !Array.isArray(f.choices) || f.choices.indexOf(f.answer) < 0) {
            errors.push(it.topic + " / " + it.name + ": takip sorusunun cevabı şıklarda yok");
        } else if (f.choices.length !== new Set(f.choices).size) {
            errors.push(it.topic + " / " + it.name + ": takip sorusunda tekrarlanan şık");
        }
    }
});
Q.TREE.forEach(function (g) {
    g.kids.forEach(function (k) {
        if (!Q.countFor(k.id)) errors.push("konu boş: " + k.id);
    });
});

try {
    cp.execFileSync(process.execPath, [path.join(__dirname, "sync-map-data.js"), "--check"], { stdio: "pipe" });
} catch (e) {
    errors.push(String(e.stderr || e.message).trim());
}

if (errors.length) {
    console.error(errors.length + " sorun:\n- " + errors.join("\n- "));
    process.exit(1);
}
console.log("Harita oyunu: " + Q.ITEMS.length + " hedefin hepsi doğru ilde, sorular ve mobil kopya tutarlı.");
