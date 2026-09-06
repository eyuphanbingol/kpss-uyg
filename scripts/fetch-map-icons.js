var fs = require("fs");
var https = require("https");
var path = require("path");

var DIR = path.join(__dirname, "..", "src", "img", "map-icons");
fs.mkdirSync(DIR, { recursive: true });

var TW = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/";
var files = {
    rose: "1f339.png",
    apple: "1f34e.png",
    wheat: "1f33e.png",
    cotton: "1f9f6.png",
    olive: "1fad2.png",
    grapes: "1f347.png",
    corn: "1f33d.png",
    potato: "1f954.png",
    beet: "1f360.png",
    poppy: "1f337.png",
    fig: "1fad5.png",
    apricot: "1f351.png",
    banana: "1f34c.png",
    seed: "1f331.png",
    flower: "1f33c.png",
    leaf: "1f343.png",
    peanut: "1f95c.png",
    pistachio: "1f95c.png",
    lentil: "1fad8.png",
    citrus: "1f34a.png",
    canola: "1f33b.png",
    rice: "1f35a.png",
    sunflower: "1f33b.png",
    hazelnut: "1f330.png",
    tea: "1f33f.png",
    hemp: "1f33f.png",
    "fold-mtn": "26f0.png",
    "fault-mtn": "1f3d4.png",
    volcano: "1f30b.png",
    rock: "1faa8.png",
    plateau: "1f3d4.png",
    plain: "1f33e.png",
    park: "1f332.png",
    ore: "26cf.png",
    iron: "1f528.png",
    copper: "1f7e0.png",
    bauxite: "1f7e1.png",
    chrome: "2b1c.png",
    barite: "1f7e6.png",
    boron: "1f48e.png",
    marble: "26aa.png",
    phosphate: "1f331.png",
    gold: "1f4b0.png",
    uranium: "2622.png",
    mercury: "1f321.png",
    salt: "1f9c2.png",
    sulfur: "1f7e1.png",
    lead: "1f536.png",
    jet: "26ab.png",
    tungsten: "2699.png",
    emery: "1f9f4.png"
};

function get(url) {
    return new Promise(function (resolve, reject) {
        https.get(url, { headers: { "User-Agent": "atanly-maps/1.0" } }, function (res) {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return get(res.headers.location).then(resolve, reject);
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(url + " " + res.statusCode));
            }
            var chunks = [];
            res.on("data", function (c) { chunks.push(c); });
            res.on("end", function () { resolve(Buffer.concat(chunks)); });
        }).on("error", reject);
    });
}

(async function () {
    var names = Object.keys(files);
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var dest = path.join(DIR, name + ".png");
        if (fs.existsSync(dest) && fs.statSync(dest).size > 200) continue;
        var buf = await get(TW + files[name]);
        fs.writeFileSync(dest, buf);
        console.log("ok", name, buf.length);
    }
})().catch(function (e) {
    console.error(e);
    process.exit(1);
});
