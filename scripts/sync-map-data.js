/**
 * Web ile mobilin paylaştığı saf JS modüllerinin tek kaynağı js/ altındadır. Bu betik mobil
 * kopyaları ondan üretir; elle düzenleme iki tarafın ayrışmasına yol açıyordu.
 *   mobile/src/lib/mapQuiz.js   <- js/mapQuiz.js
 *   mobile/src/lib/smartPlan.js <- js/smartPlan.js
 *   mobile/src/lib/liveExam.js  <- js/liveExam.js
 *   mobile/src/lib/trSvgData.js <- svg/tr.svg (uygulamaya gömülü; açılışta internetten indirilmez)
 *   node scripts/sync-map-data.js          -> mobil dosyaları yazar
 *   node scripts/sync-map-data.js --check  -> farklıysa hata verir (yazmaz)
 */
var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
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

// "(function (global) { ... global.<Name> = api; ... })(...)" biçimli bir web modülünü
// ES modülüne çevirir: "export const <Name> = api;"
function buildModule(file, name, transform) {
    var src = fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n?/g, "\n");
    var lead = "";
    var mLead = /^\/\*\*[\s\S]*?\*\/\n/.exec(src); // baştaki açıklama yorumu korunur
    if (mLead) { lead = mLead[0]; src = src.slice(lead.length); }
    var head = "(function (global) {\n";
    var tailRe = new RegExp("\\n    global\\." + name + " = api;\\n    if \\(typeof module !== \"undefined\" && module\\.exports\\) module\\.exports = api;\\n\\}\\)\\(typeof window !== \"undefined\" \\? window : globalThis\\);\\s*$");
    if (src.indexOf(head) !== 0 || !tailRe.test(src)) {
        throw new Error(file + " sarmalayıcısı beklenen biçimde değil");
    }
    var body = src.slice(head.length).replace(tailRe, "\n");
    if (transform) body = transform(body);
    return "// Bu dosya scripts/sync-map-data.js ile " + file + "'ten üretilir. Elle düzenleme.\n" + lead +
        body + "export const " + name + " = api;\n";
}

function build() {
    // mobilde kart görselleri require() anahtarıyla seçilir: "img/map/kart/<id>.svg" -> "<id>"
    return buildModule("js/mapQuiz.js", "MapQuiz", function (body) {
        return body.replace(/hoverImg: "img\/map\/kart\/([a-z0-9-]+)\.svg"/g, 'hoverImg: "$1"');
    });
}

var planOutPath = path.join(root, "mobile", "src", "lib", "smartPlan.js");
var liveOutPath = path.join(root, "mobile", "src", "lib", "liveExam.js");
var outputs = [[mobPath, build()], [planOutPath, buildModule("js/smartPlan.js", "SmartPlan")],
    [liveOutPath, buildModule("js/liveExam.js", "LiveExam")], [svgOutPath, buildSvg()]];
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
