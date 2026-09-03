var fs = require("fs");
var path = require("path");
var PNG = require("pngjs").PNG;

var root = path.join(__dirname, "..");
var srcPath = process.argv[2];
if (!srcPath) {
    console.error("usage: node apply-new-logo.js <source.png>");
    process.exit(1);
}

function knockoutBlack(png) {
    var i;
    for (i = 0; i < png.data.length; i += 4) {
        var r = png.data[i];
        var g = png.data[i + 1];
        var b = png.data[i + 2];
        var maxc = Math.max(r, g, b);
        var minc = Math.min(r, g, b);
        if (maxc <= 12) png.data[i + 3] = 0;
        else if (maxc <= 28 && maxc - minc <= 14) {
            png.data[i + 3] = Math.max(0, Math.min(255, Math.round(255 * (maxc - 12) / 16)));
        }
    }
    return png;
}

function fill(png, r, g, b, a) {
    var i;
    var alpha = a == null ? 255 : a;
    for (i = 0; i < png.data.length; i += 4) {
        png.data[i] = r;
        png.data[i + 1] = g;
        png.data[i + 2] = b;
        png.data[i + 3] = alpha;
    }
}

function sample(src, x, y) {
    var w = src.width;
    var h = src.height;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > w - 1) x = w - 1;
    if (y > h - 1) y = h - 1;
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var x1 = Math.min(x0 + 1, w - 1);
    var y1 = Math.min(y0 + 1, h - 1);
    var fx = x - x0;
    var fy = y - y0;
    function pix(px, py) {
        var i = (w * py + px) << 2;
        return [src.data[i], src.data[i + 1], src.data[i + 2], src.data[i + 3]];
    }
    var p00 = pix(x0, y0);
    var p10 = pix(x1, y0);
    var p01 = pix(x0, y1);
    var p11 = pix(x1, y1);
    var out = [0, 0, 0, 0];
    var c;
    for (c = 0; c < 4; c++) {
        var top = p00[c] * (1 - fx) + p10[c] * fx;
        var bot = p01[c] * (1 - fx) + p11[c] * fx;
        out[c] = Math.round(top * (1 - fy) + bot * fy);
    }
    return out;
}

function resize(src, w, h) {
    var dest = new PNG({ width: w, height: h });
    var y;
    var x;
    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            var sx = (x + 0.5) * src.width / w - 0.5;
            var sy = (y + 0.5) * src.height / h - 0.5;
            var p = sample(src, sx, sy);
            var i = (w * y + x) << 2;
            dest.data[i] = p[0];
            dest.data[i + 1] = p[1];
            dest.data[i + 2] = p[2];
            dest.data[i + 3] = p[3];
        }
    }
    return dest;
}

function blit(src, dest, dx, dy) {
    var y;
    var x;
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
            dest.data[di + 3] = Math.round(src.data[si + 3] * a + dest.data[di + 3] * (1 - a));
        }
    }
}

function containOnCanvas(src, size, padRatio, bg) {
    var dest = new PNG({ width: size, height: size });
    if (bg) fill(dest, bg[0], bg[1], bg[2], 255);
    else fill(dest, 0, 0, 0, 0);
    var inner = Math.round(size * (1 - padRatio * 2));
    var scale = Math.min(inner / src.width, inner / src.height);
    var w = Math.max(1, Math.round(src.width * scale));
    var h = Math.max(1, Math.round(src.height * scale));
    var scaled = resize(src, w, h);
    blit(scaled, dest, Math.round((size - w) / 2), Math.round((size - h) / 2));
    return dest;
}

function writePng(filePath, png) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, PNG.sync.write(png));
}

var raw = PNG.sync.read(fs.readFileSync(srcPath));
var mark = knockoutBlack(raw);

writePng(path.join(root, "icons", "atanom.png"), mark);
writePng(path.join(root, "icons", "icon-192.png"), containOnCanvas(mark, 192, 0.08, [0, 0, 0]));
writePng(path.join(root, "icons", "icon-512.png"), containOnCanvas(mark, 512, 0.08, [0, 0, 0]));

var mobileAssets = path.join(root, "mobile", "assets");
writePng(path.join(mobileAssets, "atanom.png"), mark);
writePng(path.join(mobileAssets, "atanom-mark.png"), mark);
writePng(path.join(mobileAssets, "icon.png"), containOnCanvas(mark, 1024, 0.08, [4, 28, 36]));
writePng(path.join(mobileAssets, "favicon.png"), containOnCanvas(mark, 48, 0.08, [0, 0, 0]));
writePng(path.join(mobileAssets, "splash-icon.png"), containOnCanvas(mark, 1024, 0.18, [4, 28, 36]));
writePng(path.join(mobileAssets, "android-icon-foreground.png"), containOnCanvas(mark, 1024, 0.18, null));
writePng(path.join(mobileAssets, "android-icon-background.png"), (function () {
    var p = new PNG({ width: 1024, height: 1024 });
    fill(p, 4, 28, 36, 255);
    return p;
})());
writePng(path.join(mobileAssets, "android-icon-monochrome.png"), containOnCanvas(mark, 1024, 0.18, null));

var splash = new PNG({ width: 1242, height: 2688 });
fill(splash, 4, 28, 36, 255);
var logoW = 720;
var logoH = Math.max(1, Math.round(mark.height * (logoW / mark.width)));
if (logoH > 720) {
    logoH = 720;
    logoW = Math.max(1, Math.round(mark.width * (logoH / mark.height)));
}
var splashLogo = resize(mark, logoW, logoH);
blit(splashLogo, splash, Math.round((splash.width - logoW) / 2), Math.round((splash.height - logoH) / 2) - 80);
writePng(path.join(mobileAssets, "splash-full.png"), splash);

var desktop = path.join(process.env.USERPROFILE || "", "Desktop");
if (desktop && fs.existsSync(desktop)) {
    fs.writeFileSync(path.join(desktop, "atanom-logo.png"), PNG.sync.write(raw));
    fs.writeFileSync(path.join(desktop, "atanom-logo-seffaf.png"), PNG.sync.write(mark));
}

console.log("logo applied", mark.width, "x", mark.height);
