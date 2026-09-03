var fs = require("fs");
var path = require("path");
var PNG = require("pngjs").PNG;

function knockoutBuffer(png) {
    var i;
    for (i = 0; i < png.data.length; i += 4) {
        var r = png.data[i];
        var g = png.data[i + 1];
        var b = png.data[i + 2];
        var minc = Math.min(r, g, b);
        var maxc = Math.max(r, g, b);
        var avg = (r + g + b) / 3;
        if (maxc <= 12) png.data[i + 3] = 0;
        else if (maxc <= 28 && maxc - minc <= 14) {
            png.data[i + 3] = Math.max(0, Math.min(255, Math.round(255 * (maxc - 12) / 16)));
        } else if (avg > 242 && maxc - minc < 18) png.data[i + 3] = 0;
        else if (avg > 210 && maxc - minc < 22) {
            png.data[i + 3] = Math.max(0, Math.round(255 * (1 - (avg - 210) / 45)));
        }
    }
    return png;
}

function fill(png, r, g, b) {
    var i;
    for (i = 0; i < png.data.length; i += 4) {
        png.data[i] = r;
        png.data[i + 1] = g;
        png.data[i + 2] = b;
        png.data[i + 3] = 255;
    }
}

function blit(src, dest, dx, dy) {
    var y, x;
    for (y = 0; y < src.height; y++) {
        for (x = 0; x < src.width; x++) {
            var si = (src.width * y + x) << 2;
            var a = src.data[si + 3] / 255;
            if (a <= 0) continue;
            var tx = dx + x;
            var ty = dy + y;
            if (tx < 0 || ty < 0 || tx >= dest.width || ty >= dest.height) continue;
            var di = (dest.width * ty + tx) << 2;
            dest.data[di] = Math.round(src.data[si] * a + dest.data[di] * (1 - a));
            dest.data[di + 1] = Math.round(src.data[si + 1] * a + dest.data[di + 1] * (1 - a));
            dest.data[di + 2] = Math.round(src.data[si + 2] * a + dest.data[di + 2] * (1 - a));
            dest.data[di + 3] = 255;
        }
    }
}

var root = path.join(__dirname, "..");
var markPath = path.join(root, "mobile", "assets", "atanom-mark.png");
var srcPath = path.join(root, "mobile", "assets", "atanom.png");
var mark = knockoutBuffer(PNG.sync.read(fs.readFileSync(srcPath)));
fs.writeFileSync(markPath, PNG.sync.write(mark));

var splash = new PNG({ width: 1242, height: 2688 });
fill(splash, 4, 28, 36);
var scale = 2;
if (mark.width * scale > 720) scale = 1;
var logo = mark;
var dx = Math.round((splash.width - logo.width) / 2);
var dy = Math.round((splash.height - logo.height) / 2) - 80;
blit(logo, splash, dx, dy);
fs.writeFileSync(path.join(root, "mobile", "assets", "splash-full.png"), PNG.sync.write(splash));
console.log("mark + splash-full written", mark.width, mark.height);
