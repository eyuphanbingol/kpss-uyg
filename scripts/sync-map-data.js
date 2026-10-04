/**
 * Harita oyunu verisinin tek kaynağı js/mapQuiz.js ve svg/tr.svg'dir. Bu betik mobil kopyaları
 * ondan üretir; elle düzenleme iki tarafın ayrışmasına yol açıyordu.
 *   mobile/src/lib/mapQuiz.js   <- js/mapQuiz.js
 *   mobile/src/lib/trSvgData.js <- svg/tr.svg (uygulamaya gömülü; açılışta internetten indirilmez)
 *   node scripts/sync-map-data.js          -> mobil dosyaları yazar
 *   node scripts/sync-map-data.js --check  -> farklıysa hata verir (yazmaz)
 */
var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var webPath = path.join(root, "js", "mapQuiz.js");
var mobPath = path.join(root, "mobile", "src", "lib", "mapQuiz.js");
var svgPath = path.join(root, "svg", "tr.svg");
var svgOutPath = path.join(root, "mobile", "src", "lib", "trSvgData.js");

function buildSvg() {
    var txt = fs.readFileSync(svgPath, "utf8").replace(/\r\n?/g, "\n")
        .replace(/<\?xml[^>]*>/, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<metadata>[\s\S]*?<\/metadata>/g, "")
        .replace(/<g id="points">[\s\S]*?<\/g>/, "")
        .replace(/<g id="label_points">[\s\S]*?<\/g>/, "")
        .replace(/\s+xmlns:c2pa="[^"]*"/, "")
        .replace(/\n\s*/g, "\n")
        .trim();
    return "// Bu dosya scripts/sync-map-data.js ile svg/tr.svg'den üretilir. Elle düzenleme.\n" +
        "export var TR_SVG = " + JSON.stringify(txt) + ";\n";
}

function build() {
    var src = fs.readFileSync(webPath, "utf8").replace(/\r\n?/g, "\n");
    var head = "(function (global) {\n";
    var tailRe = /\n    global\.MapQuiz = api;\n    if \(typeof module !== "undefined" && module\.exports\) module\.exports = api;\n\}\)\(typeof window !== "undefined" \? window : globalThis\);\s*$/;
    if (src.indexOf(head) !== 0 || !tailRe.test(src)) {
        throw new Error("js/mapQuiz.js sarmalayıcısı beklenen biçimde değil");
    }
    var body = src.slice(head.length).replace(tailRe, "\n");
    // mobilde kart görselleri require() anahtarıyla seçilir: "img/map/kart/<id>.svg" -> "<id>"
    body = body.replace(/hoverImg: "img\/map\/kart\/([a-z0-9-]+)\.svg"/g, 'hoverImg: "$1"');
    return "// Bu dosya scripts/sync-map-data.js ile js/mapQuiz.js'ten üretilir. Elle düzenleme.\n" +
        body + "export const MapQuiz = api;\n";
}

var outputs = [[mobPath, build()], [svgOutPath, buildSvg()]];
if (process.argv.indexOf("--check") >= 0) {
    var stale = outputs.filter(function (o) {
        var cur = fs.existsSync(o[0]) ? fs.readFileSync(o[0], "utf8").replace(/\r\n?/g, "\n") : "";
        return cur !== o[1];
    });
    if (stale.length) {
        console.error(stale.map(function (o) { return path.relative(root, o[0]); }).join(", ") +
            " güncel değil: node scripts/sync-map-data.js çalıştır.");
        process.exit(1);
    }
    console.log("mobil harita verisi güncel.");
} else {
    outputs.forEach(function (o) {
        fs.writeFileSync(o[0], o[1]);
        console.log(path.relative(root, o[0]) + " yazıldı.");
    });
}
