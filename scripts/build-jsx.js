/**
 * JSX dosyalarını önceden derler: js/app.jsx ve js/components/*.jsx -> js/compiled/...
 * Tarayıcı (js/jsxLoader.js) ilk satırdaki özeti kaynakla karşılaştırır; tutmazsa
 * dosyayı yok sayıp eskisi gibi tarayıcıda derler. Yani bu adımı unutmak siteyi bozmaz,
 * sadece ilk açılışı yavaşlatır.
 *
 *   npm install          (bir kez)
 *   node scripts/build-jsx.js
 */
var fs = require("fs");
var path = require("path");
var Babel = require("@babel/standalone");

var root = path.join(__dirname, "..");
var loaderSrc = fs.readFileSync(path.join(root, "js", "jsxLoader.js"), "utf8");
var COMPILER = (loaderSrc.match(/var COMPILER = "([^"]+)"/) || [])[1];
if (!COMPILER) throw new Error("js/jsxLoader.js içinde COMPILER bulunamadı");
if (COMPILER.indexOf("babel-" + Babel.version + "-") !== 0) {
    console.warn("Uyarı: yüklü Babel " + Babel.version + ", jsxLoader " + COMPILER + " bekliyor.");
}

function hashOf(str) {
    str = String(str).replace(/\r\n?/g, "\n"); // Windows (CRLF) ve GitHub (LF) kopyası aynı özeti versin
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return COMPILER + ":" + str.length + ":" + (h >>> 0).toString(36);
}

var files = ["js/app.jsx"].concat(fs.readdirSync(path.join(root, "js", "components"))
    .filter(function (f) { return /\.jsx$/.test(f); })
    .map(function (f) { return "js/components/" + f; }));

files.forEach(function (rel) {
    var src = fs.readFileSync(path.join(root, rel), "utf8");
    var code = Babel.transform(src, {
        presets: [[Babel.availablePresets.react, { runtime: "classic" }]],
        filename: rel
    }).code;
    var out = path.join(root, rel.replace(/^js\//, "js/compiled/").replace(/\.jsx$/, ".js"));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, "/*jsx:" + hashOf(src) + "*/\n" + code);
    console.log(rel, "->", path.relative(root, out), Math.round(code.length / 1024) + " KB");
});
