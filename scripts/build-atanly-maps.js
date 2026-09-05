/**
 * Atanly özgün coğrafya haritaları — aynı bilgi, tek görsel dil.
 * İl sınırları: svg/tr.svg (Simplemaps ücretsiz ticari lisans).
 */
var fs = require("fs");
var path = require("path");
var { Resvg } = require("@resvg/resvg-js");

var ROOT = path.join(__dirname, "..");
var IMG = path.join(ROOT, "src", "img");
var SVG_TR = path.join(ROOT, "svg", "tr.svg");

var C = {
    paper: "#F6F1E4",
    sea: "#C5D9DE",
    land: "#E4EAD6",
    landHi: "#2F6F62",
    ink: "#041C24",
    muted: "#4A5C62",
    gold: "#C5A059",
    teal: "#127880",
    navy: "#0A3842",
    night: "#1A3340",
    day: "#F3E7C8",
    line: "#0A3842",
    white: "#FFFdf6",
    rose: "#B23A3A"
};

function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function norm(s) {
    return String(s || "")
        .toLowerCase()
        .replace(/ı/g, "i").replace(/İ/g, "i")
        .replace(/ğ/g, "g").replace(/ü/g, "u")
        .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u")
        .replace(/[^a-z0-9]/g, "");
}

function bboxFromPath(d) {
    var i = 0, cmd = "M", x = 0, y = 0, minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    function add(px, py) {
        if (px < minX) minX = px;
        if (py < minY) minY = py;
        if (px > maxX) maxX = px;
        if (py > maxY) maxY = py;
        x = px; y = py;
    }
    var re = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d+\.?\d*)/g;
    var m, nums = [];
    function flush() {
        if (cmd === "M" || cmd === "L" || cmd === "T") {
            for (var k = 0; k + 1 < nums.length; k += 2) add(nums[k], nums[k + 1]);
        } else if (cmd === "m" || cmd === "l" || cmd === "t") {
            for (var k = 0; k + 1 < nums.length; k += 2) add(x + nums[k], y + nums[k + 1]);
        } else if (cmd === "H") {
            nums.forEach(function (n) { add(n, y); });
        } else if (cmd === "h") {
            nums.forEach(function (n) { add(x + n, y); });
        } else if (cmd === "V") {
            nums.forEach(function (n) { add(x, n); });
        } else if (cmd === "v") {
            nums.forEach(function (n) { add(x, y + n); });
        } else if (cmd === "C" || cmd === "S" || cmd === "Q") {
            for (var k = 0; k + 1 < nums.length; k += 2) add(nums[k], nums[k + 1]);
        } else if (cmd === "c") {
            for (var k = 0; k + 1 < nums.length; k += 2) add(x + nums[k], y + nums[k + 1]);
        }
        nums = [];
    }
    while ((m = re.exec(d))) {
        if (m[1]) {
            if (nums.length) flush();
            cmd = m[1];
            if (cmd === "Z" || cmd === "z") nums = [];
        } else {
            nums.push(+m[2]);
        }
    }
    if (nums.length) flush();
    return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

function parseProvinces(svg) {
    var re = /<path d="([^"]+)" id="([^"]+)" name="([^"]+)"/g;
    var out = [];
    var m;
    while ((m = re.exec(svg))) {
        var d = m[1];
        var bb = bboxFromPath(d);
        out.push({ d: d, id: m[2], name: m[3], key: norm(m[3]), cx: bb.cx, cy: bb.cy });
    }
    return out;
}

var ALIAS = {
    canakkale: "canakkale", zinguldak: "zonguldak", zonguldak: "zonguldak",
    sanliurfa: "sanliurfa", sirnak: "sirnak", igdir: "igdir", agri: "agri",
    mugla: "mugla", kirklareli: "kirklareli", kahramanmaras: "kmaras", kmaras: "kmaras",
    afyonkarahisar: "afyon", afyon: "afyon", icel: "mersin", mersin: "mersin"
};

function keyOf(name) {
    var k = norm(name);
    return ALIAS[k] || k;
}

function findProv(provs, name) {
    var k = keyOf(name);
    for (var i = 0; i < provs.length; i++) {
        if (keyOf(provs[i].name) === k) return provs[i];
    }
    return null;
}

function landPaths(provs, hiKeys, hiFill) {
    var set = {};
    (hiKeys || []).forEach(function (k) { set[keyOf(k)] = true; });
    return provs.map(function (p) {
        var on = set[keyOf(p.name)];
        var fill = on ? (hiFill || C.landHi) : C.land;
        return '<path d="' + p.d + '" fill="' + fill + '" stroke="' + C.line + '" stroke-width="0.6" stroke-linejoin="round"/>';
    }).join("");
}

function wrapFacts(lines, x, y, w, fontSize) {
    fontSize = fontSize || 15;
    var lineH = fontSize + 8;
    var maxChars = Math.max(28, Math.floor((w - 28) / (fontSize * 0.52)));
    var rows = [];
    (lines || []).forEach(function (ln) {
        var s = String(ln);
        while (s.length > maxChars) {
            var cut = s.lastIndexOf(" ", maxChars);
            if (cut < 12) cut = maxChars;
            rows.push(s.slice(0, cut).trim());
            s = s.slice(cut).trim();
        }
        if (s) rows.push(s);
    });
    var h = 20 + rows.length * lineH;
    var t = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="' + C.white + '" stroke="' + C.gold + '" stroke-width="1.5"/>';
    rows.forEach(function (ln, i) {
        t += '<text x="' + (x + 14) + '" y="' + (y + 22 + i * lineH) + '" font-family="Segoe UI, Calibri, sans-serif" font-size="' + fontSize + '" fill="' + C.ink + '">' + esc(ln) + "</text>";
    });
    return { svg: t, h: h };
}

var CANVAS_W = 540;

function frame(H, title, kicker, body) {
    var W = CANVAS_W;
    return '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">\n' +
        '<rect width="' + W + '" height="' + H + '" fill="' + C.paper + '"/>' +
        '<rect x="0" y="0" width="' + W + '" height="64" fill="' + C.navy + '"/>' +
        '<text x="18" y="26" font-family="Segoe UI, Calibri, sans-serif" font-size="12" font-weight="700" fill="' + C.gold + '" letter-spacing="3">ATANLY</text>' +
        '<text x="18" y="50" font-family="Segoe UI, Calibri, sans-serif" font-size="18" font-weight="800" fill="#F6F1E4">' + esc(title) + "</text>" +
        '<text x="' + (W - 16) + '" y="38" text-anchor="end" font-family="Segoe UI, Calibri, sans-serif" font-size="11" fill="#9BB8B4">' + esc(kicker) + "</text>" +
        body +
        '<text x="18" y="' + (H - 12) + '" font-family="Segoe UI, Calibri, sans-serif" font-size="10" fill="' + C.muted + '">Atanly özgün görsel · KPSS coğrafya</text>' +
        "</svg>";
}

function mapBlock(provs, extra) {
    return '<g transform="translate(14,78) scale(0.51)">' +
        '<rect x="-16" y="-12" width="1040" height="446" rx="18" fill="' + C.sea + '"/>' +
        extra + "</g>";
}

var MAP_BLOCK_H = 250;

function writePng(file, svg, w) {
    var png = new Resvg(svg, { fitTo: { mode: "width", value: w || 1080 } }).render().asPng();
    var tmp = file + ".tmp";
    fs.writeFileSync(tmp, png);
    try { fs.unlinkSync(file); } catch (e) {}
    fs.renameSync(tmp, file);
}

function twoColList(items, startY) {
    var long = items.some(function (s) { return String(s).length > 24; });
    var rowH = 22;
    if (long) {
        return items.map(function (label, i) {
            return '<text x="18" y="' + (startY + i * rowH) + '" font-family="Segoe UI, Calibri, sans-serif" font-size="13" fill="' + C.ink + '"><tspan fill="' + C.gold + '" font-weight="800">' + (i + 1) + "  </tspan>" + esc(label) + "</text>";
        }).join("");
    }
    var x0 = 18;
    var x1 = 272;
    return items.map(function (label, i) {
        var x = (i % 2) ? x1 : x0;
        var y = startY + Math.floor(i / 2) * rowH;
        return '<text x="' + x + '" y="' + y + '" font-family="Segoe UI, Calibri, sans-serif" font-size="14" fill="' + C.ink + '"><tspan fill="' + C.gold + '" font-weight="800">' + (i + 1) + "  </tspan>" + esc(label) + "</text>";
    }).join("");
}

function listRows(items) {
    var long = items.some(function (s) { return String(s).length > 24; });
    return long ? items.length : Math.ceil(items.length / 2);
}

function cropMap(provs, opts) {
    var pins = "";
    opts.iller.forEach(function (name, i) {
        var fp = findProv(provs, name);
        if (!fp) {
            console.warn("il yok:", name);
            return;
        }
        pins += pin(fp.cx, fp.cy, i + 1);
    });
    var listY = 78 + MAP_BLOCK_H + 22;
    var rows = listRows(opts.iller);
    var factsY = listY + 14 + rows * 22 + 10;
    var facts = wrapFacts(opts.facts, 16, factsY, CANVAS_W - 32, 14);
    var H = factsY + facts.h + 28;
    var body = mapBlock(provs, landPaths(provs, opts.iller, C.landHi) + pins) +
        '<text x="18" y="' + listY + '" font-family="Segoe UI, Calibri, sans-serif" font-size="12" font-weight="800" fill="' + C.teal + '">' + esc(opts.listTitle || "YETİŞTİĞİ İLLER") + "</text>" +
        twoColList(opts.iller, listY + 20) +
        facts.svg;
    return frame(H, opts.title, opts.kicker || "Tarım dağılımı", body);
}

function pin(x, y, n) {
    return '<circle cx="' + Number(x).toFixed(1) + '" cy="' + Number(y).toFixed(1) + '" r="14" fill="' + C.navy + '" stroke="' + C.gold + '" stroke-width="1.8"/>' +
        '<text x="' + Number(x).toFixed(1) + '" y="' + (Number(y) + 5).toFixed(1) + '" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="#F6F1E4">' + n + "</text>";
}

function main() {
    var provs = parseProvinces(fs.readFileSync(SVG_TR, "utf8"));
    if (provs.length < 70) throw new Error("il parse hatası " + provs.length);

    var crops = [
        { file: "elma.png", title: "ELMA ÜRETİMİ", iller: ["Isparta", "Karaman", "Niğde", "Nevşehir", "Konya", "Denizli", "Antalya"], facts: ["Yoğunluk: Göller Yöresi ve Niğde–Nevşehir çevresi", "İç Anadolu’nun yüksek ovalarında da yetişir"] },
        { file: "bugday.png", title: "BUĞDAY ÜRETİMİ", iller: ["Konya", "Ankara", "Şanlıurfa", "Diyarbakır", "Tekirdağ", "Edirne", "Yozgat", "Kayseri", "Adana"], facts: ["İç Anadolu ve Güneydoğu başta gelir", "Trakya’da da önemli ekim alanı vardır"] },
        { file: "pamuk.png", title: "PAMUK ÜRETİMİ", iller: ["Şanlıurfa", "Diyarbakır", "Adana", "Aydın", "İzmir", "Hatay", "Mardin"], facts: ["Sıcaklık ve sulama ister", "Çukurova ve Güneydoğu öne çıkar"] },
        { file: "zeytin.png", title: "ZEYTİN ÜRETİMİ", iller: ["Aydın", "İzmir", "Balıkesir", "Manisa", "Muğla", "Bursa", "Hatay", "Mersin", "Gaziantep"], facts: ["Akdeniz iklimi kıyı kuşağı", "Ege birinci sıradadır"] },
        { file: "üzüm.png", title: "ÜZÜM ÜRETİMİ", iller: ["Manisa", "Denizli", "İzmir", "Nevşehir", "Elazığ", "Gaziantep", "Tekirdağ"], facts: ["Ege bağcılığın merkezidir", "Kapadokya ve Güneydoğu’da da yetişir"] },
        { file: "mısır.png", title: "MISIR ÜRETİMİ", iller: ["Adana", "Şanlıurfa", "Mardin", "Sakarya", "Mersin", "Konya"], facts: ["Hem tahıl hem yağ bitkisi grubunda sayılır", "Çukurova ve GAP sulama alanları yoğundur"] },
        { file: "patates.png", title: "PATATES ÜRETİMİ", iller: ["Niğde", "Nevşehir", "Afyon", "Bolu", "Erzurum", "İzmir"], facts: ["Serin ve yüksek yerlerde verim artar", "Niğde–Nevşehir öne çıkar"] },
        { file: "arpa.png", title: "ARPA ÜRETİMİ", iller: ["Konya", "Ankara", "Şanlıurfa", "Kayseri", "Yozgat", "Kırşehir"], facts: ["Buğdaya göre daha kurak koşullara dayanır", "Hayvancılık yemi olarak da önemlidir"] },
        { file: "seker_pancar.png", title: "ŞEKER PANCARI", iller: ["Konya", "Eskişehir", "Aksaray", "Yozgat", "Tokat", "Erzurum", "Kayseri"], facts: ["Ilıman-karasal iklim ve sulama", "Şeker fabrikaları çevresinde yoğunlaşır"] },
        { file: "hashas.png", title: "HAŞHAŞ ÜRETİMİ", iller: ["Afyon", "Denizli", "Kütahya", "Burdur", "Isparta", "Uşak"], facts: ["Devlet kontrolünde üretilir", "Afyonkarahisar adıyla özdeşleşir"] },
        { file: "incir.png", title: "İNCİR ÜRETİMİ", iller: ["Aydın", "İzmir", "Muğla", "Bursa", "Gaziantep"], facts: ["Aydın birinci sıradadır", "Ege’nin kurutmalık inciri meşhurdur"] },
        { file: "kayısı.png", title: "KAYISI ÜRETİMİ", iller: ["Malatya", "Elazığ", "Kahramanmaraş", "Iğdır"], facts: ["Malatya dünya ölçeğinde öne çıkar", "Kurutmalık kayısı ihracatı önemlidir"] },
        { file: "muz.png", title: "MUZ ÜRETİMİ", iller: ["Mersin", "Antalya", "Hatay"], facts: ["Don olayının az olduğu kıyı kuşağı", "Anamur–Alanya çevresi yoğundur"] },
        { file: "anason.png", title: "ANASON ÜRETİMİ", iller: ["Burdur", "Denizli", "Antalya", "Muğla"], facts: ["Göller Yöresi ve Teke çevresi", "Uçucu yağ bitkisidir"] },
        { file: "aspir.png", title: "ASPİR ÜRETİMİ", iller: ["Eskişehir", "Konya", "Ankara", "Aksaray"], facts: ["Kuraklığa dayanıklı yağ bitkisi", "İç Anadolu’da ekimi artmaktadır"] },
        { file: "susam.png", title: "SUSAM ÜRETİMİ", iller: ["Antalya", "Muğla", "Manisa", "Adana"], facts: ["Sıcak iklim ister", "Akdeniz ve Ege kıyılarında yetişir"] },
        { file: "tütün.png", title: "TÜTÜN ÜRETİMİ", iller: ["Manisa", "Denizli", "Samsun", "Adıyaman", "Bitlis", "Muş"], facts: ["Ege ve Karadeniz’de klasik üretim alanları", "Doğu Anadolu’da da ekilir"] },
        { file: "yer_fıstık.png", title: "YER FISTIĞI", iller: ["Osmaniye", "Adana", "Aydın", "Kahramanmaraş"], facts: ["Çukurova ve Osmaniye öne çıkar", "Sıcaklık ve kumlu-tınlı toprak ister"] },
        { file: "antep_fıstık.png", title: "ANTEP FISTIĞI", iller: ["Gaziantep", "Şanlıurfa", "Siirt", "Adıyaman"], facts: ["Güneydoğu Anadolu’nun karakteristik ürünü", "Gaziantep adıyla anılır"] },
        { file: "kırmızı_mercimek.png", title: "KIRMIZI MERCİMEK", iller: ["Şanlıurfa", "Diyarbakır", "Mardin", "Batman"], facts: ["Güneydoğu Anadolu birinci sıradadır", "Kuraklığa dayanıklı baklagildir"] },
        { file: "gül.png", title: "GÜL ÜRETİMİ", iller: ["Isparta", "Burdur", "Afyon", "Denizli"], facts: ["Isparta ‘gül bahçesi’ olarak anılır", "Yağ gülü üretimi yoğundur"] },
        { file: "turunc.png", title: "TURUNÇGİL ÜRETİMİ", iller: ["Antalya", "Mersin", "Adana", "Hatay", "Muğla"], facts: ["Akdeniz kıyı kuşağı", "Don riski düşük yerlerde yetişir"] },
        { file: "kenevir.jpg", title: "KENEVİR ÜRETİMİ", iller: ["Kastamonu", "Amasya", "Samsun"], facts: ["Devlet kontrolündedir", "Tohumuna çedene denir", "Ekime en çok izin Karadeniz’dedir"] },
        { file: "kanola.jpg", title: "KANOLA ÜRETİMİ", iller: ["Tekirdağ", "Edirne", "Kırklareli", "Konya"], facts: ["Trakya’nın Sarı Kızı olarak anılır", "Yağ oranı yüksektir"] },
        { file: "pirinc.jpg", title: "ÇELTİK / PİRİNÇ", iller: ["Edirne", "Samsun", "Balıkesir"], facts: ["Meriç boyları başta gelir", "Diğer ekim alanları Osmancık ve Tosya", "Üretim devlet kontrolündedir"] },
        { file: "ay_cicek.jpg", title: "AYÇİÇEĞİ ÜRETİMİ", iller: ["Tekirdağ", "Konya", "Adana", "Edirne"], facts: ["Trakya klasik üretim bölgesidir", "İntansif tarım ürünlerindendir"] },
        { file: "findik.jpg", title: "FINDIK ÜRETİMİ", iller: ["Ordu", "Samsun", "Düzce", "Giresun", "Sakarya", "Trabzon", "Rize"], facts: ["Karadeniz birinci, Marmara ikinci sıradadır", "Türkiye dünya üretiminde 1. sıradadır", "Devirli tarım ürünüdür"] },
        { file: "cay.jpg", title: "ÇAY ÜRETİMİ", iller: ["Rize", "Trabzon", "Artvin", "Giresun"], facts: ["Tamamı Doğu Karadeniz’dedir", "Zihni Derin tarafından Batum’dan getirilmiştir", "Dünya üretiminde Türkiye 5. sıradadır"] }
    ];

    crops.forEach(function (c) {
        writePng(path.join(IMG, c.file), cropMap(provs, c));
        console.log("ok", c.file);
    });

    // 21 Haziran
    var term = '<line x1="430" y1="8" x2="250" y2="410" stroke="' + C.ink + '" stroke-width="5"/>';
    var juneExtra = landPaths(provs) +
        '<clipPath id="nightJ"><polygon points="0,0 480,0 220,422 0,422"/></clipPath>' +
        '<g clip-path="url(#nightJ)">' + landPaths(provs).replace(/fill="#E4EAD6"/g, 'fill="' + C.night + '"') + "</g>" +
        term +
        '<text x="210" y="210" font-size="28" font-weight="800" fill="#F6F1E4" font-family="Segoe UI, sans-serif">GECE</text>' +
        '<text x="620" y="230" font-size="28" font-weight="800" fill="' + C.navy + '" font-family="Segoe UI, sans-serif">GÜNDÜZ</text>';
    var juneFacts = wrapFacts([
        "21 HAZİRAN — Yaz mevsimi başlar",
        "Güneş ışınları en büyük açıyla düşer",
        "Gölge boyu en kısadır · en uzun gündüz, en kısa gece",
        "Bu tarihten sonra gündüzler kısalmaya başlar"
    ], 16, 78 + MAP_BLOCK_H + 16, CANVAS_W - 32, 14);
    writePng(path.join(IMG, "21 haziran.png"), frame(78 + MAP_BLOCK_H + 16 + juneFacts.h + 28, "21 HAZİRAN", "Yaz gündönümü", mapBlock(provs, juneExtra) + juneFacts.svg));

    var decExtra = landPaths(provs) +
        '<clipPath id="nightD"><polygon points="0,0 500,0 240,422 0,422"/></clipPath>' +
        '<g clip-path="url(#nightD)">' + landPaths(provs).replace(/fill="#E4EAD6"/g, 'fill="' + C.night + '"') + "</g>" +
        '<line x1="450" y1="8" x2="260" y2="410" stroke="' + C.ink + '" stroke-width="5"/>' +
        '<text x="200" y="210" font-size="28" font-weight="800" fill="#F6F1E4" font-family="Segoe UI, sans-serif">GECE</text>' +
        '<text x="640" y="230" font-size="28" font-weight="800" fill="' + C.navy + '" font-family="Segoe UI, sans-serif">GÜNDÜZ</text>' +
        (function () {
            var s = findProv(provs, "Sinop");
            var h = findProv(provs, "Hatay");
            var t = "";
            if (s) t += pin(s.cx, s.cy, "S") + '<text x="' + (s.cx + 16) + '" y="' + (s.cy + 4) + '" font-size="13" font-weight="800" fill="' + C.navy + '" font-family="Segoe UI, sans-serif">Sinop</text>';
            if (h) t += pin(h.cx, h.cy, "H") + '<text x="' + (h.cx + 16) + '" y="' + (h.cy + 4) + '" font-size="13" font-weight="800" fill="' + C.navy + '" font-family="Segoe UI, sans-serif">Hatay</text>';
            return t;
        })();
    var decFacts = wrapFacts([
        "21 ARALIK — Kış başlangıcıdır",
        "Cisimlerin gölge boyu en uzun olur",
        "En uzun gece, en kısa gündüz yaşanır",
        "Bu tarihten sonra güneş ışınlarının geliş açısı büyür; gündüzler uzar, geceler kısalır",
        "En uzun gece Sinop’ta · en uzun gündüz Hatay’da yaşanır"
    ], 16, 78 + MAP_BLOCK_H + 16, CANVAS_W - 32, 14);
    writePng(path.join(IMG, "21 aralık.png"), frame(78 + MAP_BLOCK_H + 16 + decFacts.h + 28, "21 ARALIK", "Kış gündönümü", mapBlock(provs, decExtra) + decFacts.svg));
    console.log("ok solstice");

    function labeled(title, kicker, items, facts) {
        var extra = landPaths(provs, items.map(function (it) { return it.il; }), C.landHi);
        var pins = "";
        items.forEach(function (it, i) {
            var fp = findProv(provs, it.il);
            if (!fp) {
                console.warn("il yok:", it.il);
                return;
            }
            extra += pin(fp.cx, fp.cy, i + 1);
        });
        var labels = items.map(function (it) { return it.label; });
        var rows = listRows(labels);
        var listY = 78 + MAP_BLOCK_H + 20;
        var factsBox = wrapFacts(facts, 16, listY + rows * 22 + 8, CANVAS_W - 32, 14);
        var H = listY + rows * 22 + 8 + factsBox.h + 28;
        var body = mapBlock(provs, extra) + twoColList(labels, listY) + factsBox.svg;
        writePng(path.join(IMG, title.file), frame(H, title.head, kicker, body));
    }

    labeled({ file: "kıvrım_dağlar.png", head: "KIVRIM DAĞLARI" }, "Yer şekilleri",
        [
            { il: "Kırklareli", label: "Yıldız (Istranca)" },
            { il: "Bolu", label: "Köroğlu" },
            { il: "Kastamonu", label: "Küre" },
            { il: "Çankırı", label: "Ilgaz" },
            { il: "Samsun", label: "Canik" },
            { il: "Rize", label: "Kaçkar (Rize)" },
            { il: "Erzurum", label: "Kop · Mescit · Yalnızçam" },
            { il: "Antalya", label: "Bey · Batı Toroslar" },
            { il: "Mersin", label: "Bolkar · Geyik" },
            { il: "Niğde", label: "Aladağlar · Tahtalı" },
            { il: "Isparta", label: "Sultan" },
            { il: "Hakkari", label: "Hakkari / Güney Toroslar" }
        ],
        [
            "Karadeniz ve Akdeniz’de dağlar kıyıya paralel uzanır",
            "Boyuna kıyı tipi · girinti-çıkıntı az · falez yaygın",
            "Denizel etki iç kesimlere giremez · ulaşım geçitlerle",
            "Kıta sahanlığı dar · liman hinterlandı dardır",
            "Yamaç (orografik) yağış görülür · yandan sıkışma: antiklinal / senklinal"
        ]
    );

    labeled({ file: "kırık_dağlar.png", head: "KIRIK DAĞLAR" }, "Horst dağları",
        [
            { il: "Çanakkale", label: "Kaz" },
            { il: "Balıkesir", label: "Madra" },
            { il: "Manisa", label: "Yunt" },
            { il: "İzmir", label: "Boz" },
            { il: "Aydın", label: "Aydın" },
            { il: "Muğla", label: "Menteşe (istisna)" },
            { il: "Hatay", label: "Amanos (Nur)" }
        ],
        [
            "Şifre: Kazma Yuntmuş Boz Ayı Meledi → Kaz-Madra, Yunt, Boz, Aydın, Menteşe",
            "Ege’de dağlar kıyıya dik uzanır (Menteşe yöresi hariç)",
            "Enine kıyı tipi · koy/körfez fazla · kıta sahanlığı geniş",
            "Denizel etki iç kesimlere girebilir · ulaşım ağı gelişmiştir",
            "İç kesimlere ulaşım kolaydır"
        ]
    );

    labeled({ file: "volkanik_dağlar.png", head: "VOLKANİK DAĞLAR" }, "Koniler",
        [
            { il: "Manisa", label: "Kula (kül konileri)" },
            { il: "Konya", label: "Karadağ · Karacadağ" },
            { il: "Aksaray", label: "Hasan · Melendiz" },
            { il: "Kayseri", label: "Erciyes" },
            { il: "Bitlis", label: "Nemrut" },
            { il: "Van", label: "Süphan · Tendürek" },
            { il: "Ağrı", label: "B. Ağrı · K. Ağrı" },
            { il: "Şanlıurfa", label: "Karacadağ (GD)" }
        ],
        ["Volkan konileri ve kül konileri gösterilir", "Doğu’da Nemrut–Süphan–Tendürek–Ağrı (NESTA) hattı"]
    );

    labeled({ file: "volkanik_araziler.png", head: "VOLKANİK ARAZİLER" }, "Hat ve masifler",
        [
            { il: "Çanakkale", label: "Biga Yarımadası" },
            { il: "Bursa", label: "Uludağ (batolit)" },
            { il: "Balıkesir", label: "Kaz Dağları" },
            { il: "Afyon", label: "Afyon geçiş kuşağı" },
            { il: "Isparta", label: "Gölcük krater gölü" },
            { il: "Bolu", label: "Köroğlu Dağları" },
            { il: "Nevşehir", label: "Hasan (Kapadokya tüfleri)" },
            { il: "Kayseri", label: "Erciyes" },
            { il: "Erzurum", label: "Erzurum–Kars çernezyom" },
            { il: "Van", label: "NESTA hattı (Van G. batısı)" },
            { il: "Diyarbakır", label: "Karacadağ kalkan volkan" },
            { il: "Hatay", label: "Hassa lav tüpü mağaraları" }
        ],
        ["NESTA: Nemrut, Süphan, Tendürek, Ağrı", "Kapadokya tüfleri Hasan Dağı çevresiyle ilişkilidir"]
    );

    labeled({ file: "masif_arazi.png", head: "MASİF ARAZİLER" }, "Eski kütleler",
        [
            { il: "Kırklareli", label: "Yıldız Dağı" },
            { il: "Zonguldak", label: "Zonguldak" },
            { il: "Kastamonu", label: "Daday–Devrekani" },
            { il: "Kırşehir", label: "Kırşehir" },
            { il: "Bitlis", label: "Bitlis" },
            { il: "Mardin", label: "Mardin" },
            { il: "Mersin", label: "Anamur" },
            { il: "Muğla", label: "Menderes–Menteşe" }
        ],
        ["Masifler yaşlı, dirençli kara parçalarıdır", "Maden çeşitliliği bu kütlelerle ilişkilendirilir"]
    );

    labeled({ file: "tr_plato.png", head: "ÜLKEMİZİN PLATOLARI" }, "Oluşum tipleri",
        [
            { il: "Antalya", label: "Karstik: Teke, Taşeli" },
            { il: "Kars", label: "Volkanik: Erzurum–Kars, Ardahan" },
            { il: "Nevşehir", label: "Volkanik: Kapadokya, Kırşehir, Kula" },
            { il: "Kocaeli", label: "Aşınım: Çatalca–Kocaeli" },
            { il: "Karabük", label: "Aşınım: Safranbolu" },
            { il: "Ordu", label: "Aşınım: Perşembe" },
            { il: "Konya", label: "Tabaka: Obruk, Cihanbeyli, Haymana" },
            { il: "Yozgat", label: "Tabaka: Bozok, Uzunyayla" },
            { il: "Gaziantep", label: "Tabaka: Gaziantep, Şanlıurfa" }
        ],
        ["Karstik · volkanik · aşınım düzlüğü · tabaka düzlüğü", "Güneydoğu’da Gaziantep–Şanlıurfa platoları tabaka düzlüğüdür"]
    );

    labeled({ file: "tr_ovalar.jpg", head: "TÜRKİYE’NİN OVALARI" }, "Oluşum tipleri",
        [
            { il: "Adana", label: "Delta: Çukurova, Silifke" },
            { il: "Samsun", label: "Delta: Bafra, Çarşamba" },
            { il: "Sakarya", label: "Delta: Karasu" },
            { il: "İzmir", label: "Delta: Menemen, Selçuk, Balat" },
            { il: "Antalya", label: "Karstik (polye): Elmalı, Tefenni, Korkuteli" },
            { il: "Bursa", label: "Tektonik: Bursa, Yenişehir, İnegöl" },
            { il: "Erzincan", label: "Tektonik: Erzincan, Erbaa, Niksar" },
            { il: "Kayseri", label: "Volkanik örtü: Kayseri, Develi, Malazgirt" }
        ],
        [
            "Delta: Çukurova, Silifke, Bafra, Çarşamba, Karasu, Meriç, Dikili, Menemen, Selçuk, Balat",
            "Karstik polye: Tefenni, Acıpayam, Korkuteli, Kestel, Elmalı, Muğla, Gembos, Çeltikçi",
            "Tektonik ovalar fay hatları boyunca (KAF, DAF, BAF)",
            "Volkanik ova: lavların tektonik çukurları doldurmasıyla oluşur"
        ]
    );

    labeled({ file: "milli_parklar.png", head: "ÖNEMLİ MİLLÎ PARKLAR" }, "Ezber ilkler",
        [
            { il: "Yozgat", label: "1 Yozgat Çamlığı — ilk millî park (1958)" },
            { il: "Ankara", label: "2 Soğuksu — termal, kara akbaba" },
            { il: "Balıkesir", label: "3 Kuş Cenneti — göç yolu (Ramsar)" },
            { il: "Çanakkale", label: "4 Gelibolu Tarihi Alanı" },
            { il: "Adıyaman", label: "5 Nemrut — Kommagene, UNESCO" },
            { il: "Nevşehir", label: "6 Göreme — peri bacaları, UNESCO" },
            { il: "Antalya", label: "7 Köprülü Kanyon — rafting" },
            { il: "Tunceli", label: "8 Munzur Vadisi" },
            { il: "Trabzon", label: "9 Altındere — Sümela" },
            { il: "Bursa", label: "10 Uludağ — kış turizmi" },
            { il: "Rize", label: "11 Kaçkar" },
            { il: "Çanakkale", label: "12 Kaz Dağı — endemik bitki" },
            { il: "Muğla", label: "14 Saklıkent kanyonu" },
            { il: "Kırklareli", label: "15 İğneada longoz ormanları" }
        ],
        ["İlk millî park: Yozgat Çamlığı", "UNESCO: Göreme ve Nemrut", "Longoz: İğneada · Sümela: Altındere"]
    );

    var minerals = [
        { file: "maden_genel.png", title: "TÜRKİYE MADEN HARİTASI", listTitle: "BAŞLICA YATAKLAR", kicker: "Maden dağılımı",
            iller: ["Balıkesir", "Bursa", "Eskişehir", "İzmir", "Aydın", "Muğla", "Isparta", "Antalya", "Zonguldak", "Ankara", "Aksaray", "Çankırı", "Yozgat", "Artvin", "Sivas", "Elazığ", "Erzurum", "Mardin", "Afyon", "Konya"],
            facts: ["Çeşit fazla, miktar azdır", "En fazla çeşit: Yukarı Fırat (Elazığ) — volkanizma", "Bor dünya rezervinin ~%72’si Türkiye’dedir"] },
        { file: "maden_demir.png", title: "DEMİR", iller: ["Sivas", "Malatya", "Karabük", "Zonguldak", "Hatay"],
            facts: ["Çıkarım: Divriği, Hekimhan, Hasançelebi", "Karabük–Ereğli: taşkömürüne yakınlık", "İskenderun: ulaşım + ithal kömür, su kenarı"] },
        { file: "maden_bakir.png", title: "BAKIR", iller: ["Kastamonu", "Artvin", "Rize", "Samsun"],
            facts: ["En çok Karadeniz’de çıkarılır: Küre, Murgul, Çayeli", "İşleme: Samsun (ulaşım)"] },
        { file: "maden_boksit.png", title: "BOKSİT (ALÜMİNYUM)", iller: ["Antalya", "Konya"],
            facts: ["Çıkarım: Akseki ve Seydişehir", "İşleme: Seydişehir"] },
        { file: "maden_krom.png", title: "KROM", iller: ["Elazığ", "Muğla", "Antalya"],
            facts: ["Paslanmazlık–aşınmazlık · rezerv fazla · ihraç", "Çıkarım: Guleman, Köyceğiz", "İşleme: Elazığ (ham madde), Antalya (ulaşım)"] },
        { file: "maden_barit.png", title: "BARİT", iller: ["Antalya"],
            facts: ["Petrol kuyularında basıncı artırır", "Alanya · rezerv fazla · ihraç"] },
        { file: "maden_bor.png", title: "BOR", iller: ["Balıkesir", "Eskişehir", "Kütahya", "Bursa"],
            facts: ["Dünya rezervinin yaklaşık %72’si Türkiye’dedir", "İşleme: Kırka ve Bandırma", "İhraç edilir"] },
        { file: "maden_mermer.png", title: "MERMER", iller: ["Afyon", "Balıkesir", "Muğla", "Bursa"],
            facts: ["Kireç taşının başkalaşımıyla oluşur", "En çok Afyon ve Marmara Adası"] },
        { file: "maden_fosfat.png", title: "FOSFAT", iller: ["Mardin"],
            facts: ["Gübre hammaddesi", "Rezerv azdır", "Mazıdağı’nda hem çıkarılır hem işlenir"] },
        { file: "maden_asbest.png", title: "ASBEST (AMYANT)", iller: ["Eskişehir", "Sivas"],
            facts: ["Yanmazlık özelliği vardır", "Kanser yapıcı olduğu için yasaklıdır"] },
        { file: "maden_trona.png", title: "TRONA (SODA KÜLÜ)", iller: ["Ankara"],
            facts: ["Cam sanayisi (Şişecam)", "Sincan, Kazan, Beypazarı", "İşleme: Kazan"] },
        { file: "maden_altin.png", title: "ALTIN", iller: ["İzmir", "Çanakkale", "Gümüşhane", "Artvin"],
            facts: ["İlk yatak: Bergama–Ovacık", "Kaz Dağları, Mostra Dağı, Cerattepe"] },
        { file: "maden_uranyum.png", title: "URANYUM", iller: ["Yozgat"],
            facts: ["Nükleer enerji hammaddesi", "Yozgat–Sorgun"] },
        { file: "maden_toryum.png", title: "TORYUM", iller: ["Eskişehir"],
            facts: ["Nükleer enerji potansiyeli", "Sivrihisar’da bulunur, henüz işletilmez"] },
        { file: "maden_civa.png", title: "CIVA", iller: ["İzmir", "Konya"],
            facts: ["Oda sıcaklığında sıvı olan tek maden", "Karaburun ve Sarayönü", "Hassas alet (termometre, barometre)"] },
        { file: "maden_tuz.png", title: "TUZ", iller: ["Çankırı", "Iğdır", "Kars", "Aksaray", "Konya", "Ankara", "İzmir"],
            facts: ["Kaya tuzu: Çankırı, Iğdır, Kars", "Göl tuzu: Tuz Gölü (Aksaray–Konya–Ankara)", "Deniz tuzu: Çamaltı"] },
        { file: "maden_perlit.png", title: "PERLİT (İNCİ TAŞI)", iller: ["İzmir", "Ankara", "Bayburt", "Erzurum"],
            facts: ["Volkanik, camsı yapı", "Gıda, inşaat, boya, deterjan"] },
        { file: "maden_pomza.png", title: "POMZA TAŞI", iller: ["Nevşehir", "Kayseri"],
            facts: ["Tarım ve inşaat", "Kapadokya volkanizması"] },
        { file: "maden_kukurt.png", title: "KÜKÜRT", iller: ["Isparta"],
            facts: ["Bağcılık ve kayısıcılıkta hastalık önler", "Keçiborlu başlıca yataktır"] },
        { file: "maden_manganez.png", title: "MANGANEZ", iller: ["Zonguldak"],
            facts: ["Çeliğe sertlik verir", "Ereğli"] },
        { file: "maden_kursun.png", title: "KURŞUN VE ÇİNKO", iller: ["Yozgat", "Elazığ"],
            facts: ["Birlikte çıkarılır"] },
        { file: "maden_oltu.png", title: "OLTU TAŞI", iller: ["Erzurum"],
            facts: ["Süs eşyası ve takı", "Erzurum–Oltu"] },
        { file: "maden_lule.png", title: "LÜLE TAŞI", iller: ["Eskişehir"],
            facts: ["Pipo ve süs eşyası"] },
        { file: "maden_volfram.png", title: "VOLFRAM (TUNGSTEN)", iller: ["Bursa"],
            facts: ["Sert metal alaşımı", "Uludağ"] },
        { file: "maden_feldspat.png", title: "FELDSPAT", iller: ["Aydın", "Kütahya", "Yozgat"],
            facts: ["Cam, seramik, boya, plastik"] },
        { file: "maden_zimpara.png", title: "ZIMPARA TAŞI", iller: ["Aydın", "Antalya"],
            facts: ["Zımparalama ve parlatma", "Aydın ve Alanya · ihraç edilir"] }
    ];
    minerals.forEach(function (m) {
        writePng(path.join(IMG, m.file), cropMap(provs, {
            title: m.title,
            iller: m.iller,
            facts: m.facts,
            listTitle: m.listTitle || "ÇIKARILDIĞI / İŞLENDİĞİ İLLER",
            kicker: m.kicker || "Maden dağılımı"
        }));
        console.log("ok", m.file);
    });

    labeled({ file: "maden_etiket.png", head: "MADEN YATAKLARI" }, "Etiketli harita",
        [
            { il: "Balıkesir", label: "Mermer · Bor kuşağı" },
            { il: "Bursa", label: "Bor · Volfram (Uludağ)" },
            { il: "Eskişehir", label: "Lüle taşı · Toryum · Asbest · Bor" },
            { il: "İzmir", label: "Altın · Cıva · Perlit · Çamaltı tuzu" },
            { il: "Aydın", label: "Zımpara · Feldspat" },
            { il: "Muğla", label: "Mermer · Krom (Köyceğiz)" },
            { il: "Isparta", label: "Kükürt (Keçiborlu)" },
            { il: "Antalya", label: "Boksit · Barit · Zımpara" },
            { il: "Zonguldak", label: "Manganez · Demir-çelik (Ereğli)" },
            { il: "Ankara", label: "Trona · Tuz Gölü kıyısı" },
            { il: "Çankırı", label: "Kaya tuzu" },
            { il: "Yozgat", label: "Uranyum · Kurşun-çinko" },
            { il: "Kastamonu", label: "Bakır (Küre)" },
            { il: "Samsun", label: "Bakır işleme" },
            { il: "Hatay", label: "Demir-çelik (İskenderun)" },
            { il: "Aksaray", label: "Tuz Gölü" },
            { il: "Artvin", label: "Bakır (Murgul) · Altın" },
            { il: "Sivas", label: "Demir (Divriği) · Asbest" },
            { il: "Elazığ", label: "Krom (Guleman) · Yukarı Fırat" },
            { il: "Erzurum", label: "Oltu taşı · Perlit" },
            { il: "Mardin", label: "Fosfat (Mazıdağı)" },
            { il: "Afyon", label: "Mermer" },
            { il: "Konya", label: "Boksit (Seydişehir) · Cıva" },
            { il: "Malatya", label: "Demir (Hekimhan)" }
        ],
        ["Çeşit fazla, miktar az", "Yukarı Fırat (Elazığ) çeşitlilikte birinci", "Bor ~%72 dünya rezervi"]
    );

    // nüfus piramidi
    function pyr(cx, cy, color, label, pts) {
        var poly = pts.map(function (p) { return (cx + p[0] * 0.72) + "," + (cy + p[1] * 0.72); }).join(" ");
        return '<polygon points="' + poly + '" fill="' + color + '" opacity="0.9"/>' +
            '<line x1="' + (cx - 52) + '" y1="' + cy + '" x2="' + (cx + 52) + '" y2="' + cy + '" stroke="' + C.muted + '" stroke-width="0.6"/>' +
            '<text x="' + cx + '" y="' + (cy + 86) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + C.ink + '" font-family="Segoe UI, sans-serif">' + esc(label) + "</text>";
    }
    var pyBody = '<text x="270" y="88" text-anchor="middle" font-size="13" fill="' + C.muted + '" font-family="Segoe UI, sans-serif">15 ve 60 yaş çizgileri çalışma çağını ayırır</text>' +
        pyr(140, 210, "#C45C5C", "Gelişmemiş", [[0, -90], [70, 80], [-70, 80]]) +
        pyr(400, 210, "#3D6EA8", "Gelişmemiş", [[0, -90], [55, 80], [-55, 80]]) +
        pyr(140, 430, "#2A9B8F", "Gelişmekte", [[0, -90], [30, -20], [62, 20], [40, 80], [-40, 80], [-62, 20], [-30, -20]]) +
        pyr(400, 430, "#C5A059", "Gelişmiş", [[0, -90], [48, -10], [52, 40], [28, 80], [-28, 80], [-52, 40], [-48, -10]]) +
        pyr(140, 650, "#3F8F5A", "Gelişmiş", [[0, -95], [28, 0], [22, 80], [-22, 80], [-28, 0]]) +
        pyr(400, 650, "#6B4C9A", "Gelişmiş", [[0, -88], [38, -5], [58, 30], [20, 80], [-20, 80], [-58, 30], [-38, -5]]);
    writePng(path.join(IMG, "nüfus_prmt.png"), frame(780, "NÜFUS PİRAMİTLERİ", "Gelişmişlik tipleri", pyBody));
    console.log("ok pyramids");
}

main();
