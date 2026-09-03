var fs = require("fs");
var path = require("path");
var PNG = require("pngjs").PNG;

var root = path.join(__dirname, "..");
var src = PNG.sync.read(fs.readFileSync(path.join(root, "icons", "atanom.png")));

function fill(png, r, g, b, a) {
    var i;
    for (i = 0; i < png.data.length; i += 4) {
        png.data[i] = r;
        png.data[i + 1] = g;
        png.data[i + 2] = b;
        png.data[i + 3] = a == null ? 255 : a;
    }
}

function sample(srcPng, x, y) {
    var w = srcPng.width;
    var h = srcPng.height;
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
        return [srcPng.data[i], srcPng.data[i + 1], srcPng.data[i + 2], srcPng.data[i + 3]];
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

function resize(srcPng, w, h) {
    var dest = new PNG({ width: w, height: h });
    var y;
    var x;
    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            var p = sample(srcPng, (x + 0.5) * srcPng.width / w - 0.5, (y + 0.5) * srcPng.height / h - 0.5);
            var i = (w * y + x) << 2;
            dest.data[i] = p[0];
            dest.data[i + 1] = p[1];
            dest.data[i + 2] = p[2];
            dest.data[i + 3] = p[3];
        }
    }
    return dest;
}

function blit(srcPng, dest, dx, dy) {
    var y;
    var x;
    for (y = 0; y < srcPng.height; y++) {
        for (x = 0; x < srcPng.width; x++) {
            var si = (srcPng.width * y + x) << 2;
            var a = srcPng.data[si + 3] / 255;
            if (a <= 0) continue;
            var tx = dx + x;
            var ty = dy + y;
            if (tx < 0 || ty < 0 || tx >= dest.width || ty >= dest.height) continue;
            var di = (dest.width * ty + tx) << 2;
            dest.data[di] = Math.round(srcPng.data[si] * a + dest.data[di] * (1 - a));
            dest.data[di + 1] = Math.round(srcPng.data[si + 1] * a + dest.data[di + 1] * (1 - a));
            dest.data[di + 2] = Math.round(srcPng.data[si + 2] * a + dest.data[di + 2] * (1 - a));
            dest.data[di + 3] = 255;
        }
    }
}

function cropOpaque(srcPng, pad) {
    var minX = srcPng.width;
    var minY = srcPng.height;
    var maxX = 0;
    var maxY = 0;
    var y;
    var x;
    for (y = 0; y < srcPng.height; y++) {
        for (x = 0; x < srcPng.width; x++) {
            if (srcPng.data[((srcPng.width * y + x) << 2) + 3] < 24) continue;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
    }
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(srcPng.width - 1, maxX + pad);
    maxY = Math.min(srcPng.height - 1, maxY + pad);
    var w = maxX - minX + 1;
    var h = maxY - minY + 1;
    var dest = new PNG({ width: w, height: h });
    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            var si = (srcPng.width * (minY + y) + (minX + x)) << 2;
            var di = (w * y + x) << 2;
            dest.data[di] = srcPng.data[si];
            dest.data[di + 1] = srcPng.data[si + 1];
            dest.data[di + 2] = srcPng.data[si + 2];
            dest.data[di + 3] = srcPng.data[si + 3];
        }
    }
    return dest;
}

function extract(srcPng, sx, sy, w, h) {
    var dest = new PNG({ width: w, height: h });
    var y;
    var x;
    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            var si = (srcPng.width * (sy + y) + (sx + x)) << 2;
            var di = (w * y + x) << 2;
            dest.data[di] = srcPng.data[si];
            dest.data[di + 1] = srcPng.data[si + 1];
            dest.data[di + 2] = srcPng.data[si + 2];
            dest.data[di + 3] = srcPng.data[si + 3];
        }
    }
    return dest;
}

function headCrop(srcPng) {
    var box = cropOpaque(srcPng, 2);
    var side = Math.round(Math.min(box.width, box.height) * 0.58);
    var sx = Math.round((box.width - side) / 2);
    var sy = Math.round(box.height * 0.02);
    if (sx < 0) sx = 0;
    if (sy < 0) sy = 0;
    if (sx + side > box.width) side = box.width - sx;
    if (sy + side > box.height) side = box.height - sy;
    return extract(box, sx, sy, side, side);
}

function punchUp(srcPng) {
    var i;
    for (i = 0; i < srcPng.data.length; i += 4) {
        var a = srcPng.data[i + 3];
        if (a < 8) continue;
        var r = srcPng.data[i];
        var g = srcPng.data[i + 1];
        var b = srcPng.data[i + 2];
        srcPng.data[i] = Math.min(255, Math.round(r * 1.28 + 22));
        srcPng.data[i + 1] = Math.min(255, Math.round(g * 1.42 + 28));
        srcPng.data[i + 2] = Math.min(255, Math.round(b * 1.22 + 18));
    }
    return srcPng;
}

function favicon(size) {
    var mark = punchUp(headCrop(src));
    var dest = new PNG({ width: size, height: size });
    fill(dest, 10, 72, 88, 255);
    var inner = Math.round(size * 0.98);
    var scale = Math.min(inner / mark.width, inner / mark.height);
    var w = Math.max(1, Math.round(mark.width * scale));
    var h = Math.max(1, Math.round(mark.height * scale));
    var scaled = resize(mark, w, h);
    blit(scaled, dest, Math.round((size - w) / 2), Math.round((size - h) / 2));
    return dest;
}

function write(name, png) {
    fs.writeFileSync(path.join(root, "icons", name), PNG.sync.write(png));
}

write("favicon-32.png", favicon(32));
write("favicon-48.png", favicon(48));
write("favicon.png", favicon(64));
fs.writeFileSync(path.join(root, "mobile", "assets", "favicon.png"), PNG.sync.write(favicon(64)));
console.log("favicon written");
