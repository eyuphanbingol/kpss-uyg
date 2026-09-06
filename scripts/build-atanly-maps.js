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
    var cmd = "M", x = 0, y = 0, minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    var pts = [];
    function add(px, py) {
        if (px < minX) minX = px;
        if (py < minY) minY = py;
        if (px > maxX) maxX = px;
        if (py > maxY) maxY = py;
        pts.push([px, py]);
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
    return {
        cx: (minX + maxX) / 2, cy: (minY + maxY) / 2,
        minX: minX, minY: minY, maxX: maxX, maxY: maxY,
        w: maxX - minX, h: maxY - minY, pts: pts
    };
}

function pointInPoly(pts, x, y) {
    var inside = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi)) inside = !inside;
    }
    return inside;
}

function distToSeg(x, y, x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1;
    var len2 = dx * dx + dy * dy;
    var t = len2 ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / len2)) : 0;
    return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function minEdgeDist(pts, x, y) {
    var d = 1e9, i, j;
    for (i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        d = Math.min(d, distToSeg(x, y, pts[j][0], pts[j][1], pts[i][0], pts[i][1]));
    }
    return d;
}

function visualCenter(bb, capX, capY) {
    var pts = bb.pts || [];
    if (pts.length < 3) return { x: bb.cx, y: bb.cy };
    var capOk = capX != null && pointInPoly(pts, capX, capY);
    if (!pointInPoly(pts, bb.cx, bb.cy) && capOk) {
        var dirs = [[0, -12], [0, -18], [10, -12], [-10, -12], [0, 12], [14, 0], [-14, 0]];
        var i, nx, ny;
        for (i = 0; i < dirs.length; i++) {
            nx = capX + dirs[i][0];
            ny = capY + dirs[i][1];
            if (pointInPoly(pts, nx, ny) && minEdgeDist(pts, nx, ny) >= 14) return { x: nx, y: ny };
        }
        return { x: capX, y: capY };
    }
    var best = { x: capOk ? capX : bb.cx, y: capOk ? capY : bb.cy, s: capOk ? minEdgeDist(pts, capX, capY) : -1 };
    var step = Math.max(2.5, Math.min(bb.w, bb.h) / 28);
    var x, y, s, r;
    for (y = bb.minY + 8; y < bb.maxY - 8; y += step) {
        for (x = bb.minX + 8; x < bb.maxX - 8; x += step) {
            if (!pointInPoly(pts, x, y)) continue;
            s = minEdgeDist(pts, x, y);
            if (s > best.s) best = { x: x, y: y, s: s };
        }
    }
    r = step;
    for (y = best.y - r; y <= best.y + r; y += 1.2) {
        for (x = best.x - r; x <= best.x + r; x += 1.2) {
            if (!pointInPoly(pts, x, y)) continue;
            s = minEdgeDist(pts, x, y);
            if (s > best.s) best = { x: x, y: y, s: s };
        }
    }
    if (capOk && best.y > capY + 6) return { x: capX, y: capY };
    return { x: best.x, y: best.y };
}

function parseProvinces(svg) {
    var re = /<path d="([^"]+)" id="([^"]+)" name="([^"]+)"/g;
    var out = [];
    var m;
    while ((m = re.exec(svg))) {
        var d = m[1];
        var bb = bboxFromPath(d);
        out.push({
            d: d, id: m[2], name: m[3], key: norm(m[3]),
            cx: bb.cx, cy: bb.cy, vx: bb.cx, vy: bb.cy, pts: bb.pts,
            minX: bb.minX, minY: bb.minY, maxX: bb.maxX, maxY: bb.maxY, w: bb.w, h: bb.h
        });
    }
    var cre = /<circle class="[^"]*" cx="([\d.]+)" cy="([\d.]+)" id="([^"]+)"/g;
    while ((m = cre.exec(svg))) {
        for (var i = 0; i < out.length; i++) {
            if (out[i].id === m[3]) {
                out[i].capX = +m[1];
                out[i].capY = +m[2];
                break;
            }
        }
    }
    out.forEach(function (p) {
        var vc = visualCenter({
            pts: p.pts, cx: p.cx, cy: p.cy,
            minX: p.minX, minY: p.minY, maxX: p.maxX, maxY: p.maxY, w: p.w, h: p.h
        }, p.capX, p.capY);
        p.vx = vc.x;
        p.vy = vc.y;
        delete p.pts;
    });
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

function districtXY(fp) {
    return { x: fp.vx != null ? fp.vx : fp.cx, y: fp.vy != null ? fp.vy : fp.cy };
}

function clampInProv(fp, x, y, pad) {
    pad = pad == null ? 14 : pad;
    return {
        x: Math.max(fp.minX + pad, Math.min(fp.maxX - pad, x)),
        y: Math.max(fp.minY + pad, Math.min(fp.maxY - pad, y))
    };
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
    var fills = provs.map(function (p) {
        var on = set[keyOf(p.name)];
        var fill = on ? (hiFill || C.landHi) : C.land;
        return '<path d="' + p.d + '" fill="' + fill + '" stroke="none"/>';
    }).join("");
    var strokes = provs.map(function (p) {
        var on = set[keyOf(p.name)];
        return '<path d="' + p.d + '" fill="none" stroke="' + (on ? "#E8D7A0" : C.line) + '" stroke-width="' + (on ? "1.7" : "0.7") + '" stroke-linejoin="round"/>';
    }).join("");
    return fills + strokes;
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

function mapCaption(s) {
    s = String(s || "").replace(/^\d+\s+/, "").trim();
    var em = s.indexOf(" — ");
    if (em > 0) s = s.slice(0, em);
    if (s.length > 22) {
        var cut = s.indexOf(" · ");
        if (cut > 4 && cut < 20) s = s.slice(0, cut);
    }
    if (s.length > 22) s = s.slice(0, 20).trim();
    return s;
}

function wrapOnMap(text, maxChars) {
    text = String(text || "").trim();
    maxChars = maxChars || 18;
    if (text.length <= maxChars) return [text];
    var cut = text.lastIndexOf(" ", maxChars);
    if (cut < 4) cut = text.indexOf(" · ");
    if (cut < 4) cut = maxChars;
    return [text.slice(0, cut).trim()].filter(Boolean);
}

function labelFs(n) {
    if (n > 12) return 9;
    if (n > 8) return 10;
    return 11;
}

function iconPx(n) {
    if (n > 10) return 16;
    if (n > 6) return 18;
    return 20;
}

function textW(p, fs) {
    var lines = wrapOnMap(String(p.text || ""), fs <= 11 ? 11 : 13);
    var max = 0;
    lines.forEach(function (ln) { if (ln.length > max) max = ln.length; });
    return Math.max(22, max * fs * 0.82);
}

function onMapText(x, y, text, fs, p) {
    fs = fs || 11;
    var lines;
    if (p && p.urun) {
        lines = [p.urun];
        if (p.il && p.ilce) lines.push(p.il + " / " + p.ilce);
        else if (p.il) lines.push(p.il);
    } else {
        lines = [wrapOnMap(text, 16)[0]];
    }
    var startY = y;
    return lines.map(function (ln, i) {
        var size = i === 0 && p && p.urun ? fs : Math.max(8, fs - 1);
        var ty = startY + i * (size + 2);
        var wt = i === 0 ? "800" : "700";
        var common = 'x="' + Number(x).toFixed(1) + '" y="' + Number(ty).toFixed(1) + '" text-anchor="middle" font-family="Segoe UI, Calibri, sans-serif" font-size="' + size + '" font-weight="' + wt + '"';
        return '<text ' + common + ' fill="#FFFDF6" stroke="#FFFDF6" stroke-width="2.2" stroke-linejoin="round">' + esc(ln) + "</text>" +
            '<text ' + common + ' fill="' + C.navy + '">' + esc(ln) + "</text>";
    }).join("");
}

function nudgeLabels(pts, fs) {
    fs = fs || 12;
    var k, i, j;
    for (k = 0; k < 22; k++) {
        for (i = 0; i < pts.length; i++) {
            for (j = i + 1; j < pts.length; j++) {
                var dx = pts[j].x - pts[i].x;
                var dy = pts[j].y - pts[i].y;
                var gapX = (textW(pts[i], fs) + textW(pts[j], fs)) / 2 + 10;
                var gapY = (pts[i].urun || pts[j].urun) ? fs * 4.6 + 28 : fs * 2.4 + 12;
                var ox = gapX - Math.abs(dx);
                var oy = gapY - Math.abs(dy);
                if (ox > 0 && oy > 0) {
                    var pushX = ox * 0.5 * (dx === 0 ? (i % 2 ? 1 : -1) : (dx > 0 ? 1 : -1));
                    var pushY = oy * 0.62 * (dy === 0 ? (i % 2 ? 1 : -1) : (dy > 0 ? 1 : -1));
                    pts[i].x -= pushX;
                    pts[i].y -= pushY;
                    pts[j].x += pushX;
                    pts[j].y += pushY;
                }
            }
        }
    }
    pts.forEach(function (p) {
        if (p.x < 40) p.x = 40;
        if (p.x > 960) p.x = 960;
        if (p.y < 28) p.y = 28;
        if (p.y > 390) p.y = 390;
    });
    return pts;
}

function labelsOnMap(pts, fs) {
    fs = fs || labelFs(pts.length);
    var photo = pts.some(function (p) { return p.urun; });
    var offsetLabels = photo || pts.some(function (p) { return p.locked; });
    if (offsetLabels) {
        var lfs = photo ? 9 : fs;
        return pts.map(function (p) {
            var lx = (p.pinX != null ? p.pinX : p.x) + (p.ldx || 0);
            var ly = (p.pinY != null ? p.pinY : p.y) + (p.ldy != null ? p.ldy : 22);
            var pinX = p.pinX != null ? p.pinX : p.x;
            var pinY = p.pinY != null ? p.pinY : p.y;
            var lead = "";
            if (Math.abs(lx - pinX) + Math.abs(ly - pinY) > 16) {
                lead = '<line x1="' + pinX.toFixed(1) + '" y1="' + pinY.toFixed(1) + '" x2="' + lx.toFixed(1) + '" y2="' + (ly - 8).toFixed(1) + '" stroke="' + C.navy + '" stroke-width="0.7" opacity="0.55"/>';
            }
            return lead + onMapText(lx, ly, p.text, lfs, p);
        }).join("");
    }
    nudgeLabels(pts, fs);
    return pts.map(function (p) { return onMapText(p.x, p.y, p.text, fs, p); }).join("");
}

function spreadSameCell(pts) {
    var i, j, n;
    for (i = 0; i < pts.length; i++) {
        n = 0;
        for (j = 0; j < i; j++) {
            if (Math.abs(pts[i].x - pts[j].ox) < 2 && Math.abs(pts[i].y - pts[j].oy) < 2) n++;
            else if (Math.abs(pts[i].x - pts[j].x) < 8 && Math.abs(pts[i].y - pts[j].y) < 8) n++;
        }
        if (!pts[i].ox) { pts[i].ox = pts[i].x; pts[i].oy = pts[i].y; }
        if (n) {
            pts[i].x = pts[i].ox + (n % 2 ? 1 : -1) * (18 + n * 16);
            pts[i].y = pts[i].oy + (n > 1 ? 22 : -18);
        }
    }
}

function clampPhotoLabel(p) {
    if (p.locked || p.minX == null) return;
    var minOff = 28;
    function inside(x, y) {
        return x >= p.minX + 12 && x <= p.maxX - 12 && y >= p.minY + 12 && y <= p.maxY - 12;
    }
    var tries = [
        [p.ldx || 0, p.ldy != null ? p.ldy : 24],
        [0, 30], [0, -26],
        [42, 8], [-42, 8], [42, 20], [-42, 20],
        [50, 0], [-50, 0], [36, -16], [-36, -16]
    ];
    var i, dx, dy, x, y;
    for (i = 0; i < tries.length; i++) {
        dx = tries[i][0];
        dy = tries[i][1];
        if (Math.hypot(dx, dy) < minOff) continue;
        x = p.pinX + dx;
        y = p.pinY + dy;
        if (inside(x, y)) {
            p.ldx = dx;
            p.ldy = dy;
            return;
        }
    }
    p.ldx = (p.pinX - p.minX) <= (p.maxX - p.pinX) ? 38 : -38;
    p.ldy = 6;
}

function spreadPhotoLabels(pts) {
    var i, j, a, b, dx, dy;
    for (i = 0; i < pts.length; i++) {
        for (j = i + 1; j < pts.length; j++) {
            if (pts[i].locked || pts[j].locked) continue;
            dx = pts[j].pinX - pts[i].pinX;
            dy = pts[j].pinY - pts[i].pinY;
            if (Math.hypot(dx, dy) > 120) continue;
            a = pts[i].pinX <= pts[j].pinX ? pts[i] : pts[j];
            b = a === pts[i] ? pts[j] : pts[i];
            a.ldx = -28;
            b.ldx = 28;
            a.ldy = -18;
            b.ldy = 20;
        }
    }
    pts.forEach(clampPhotoLabel);
}

var ICON_DIR = path.join(IMG, "map-icons");
var iconCache = {};

function topicIcon(file) {
    var k = norm(String(file || "").replace(/\.(png|jpg)$/i, ""));
    var T = {
        gul: "rose", elma: "elma", bugday: "bugday", pamuk: "cotton", zeytin: "olive",
        uzum: "grapes", misir: "corn", patates: "potato", arpa: "arpa", sekerpancar: "beet",
        hashas: "poppy", incir: "fig", kayisi: "apricot", muz: "banana", anason: "anason",
        aspir: "aspir", susam: "seed", tutun: "leaf", yerfistik: "peanut", antepfistik: "antepfistik",
        kirmizimercimek: "lentil", turunc: "citrus", kanola: "canola", pirinc: "rice",
        aycicek: "aycicek", findik: "findik", cay: "cay", kenevir: "hemp",
        kivrimdaglar: "fold-mtn", kirikdaglar: "fault-mtn", volkanikdaglar: "volcano",
        volkanikaraziler: "volcano", masifarazi: "rock", trplato: "plateau", trovlar: "plain",
        milliparklar: "park",
        madengenel: "ore", madendemir: "iron", madenbakir: "copper", madenboksit: "bauxite",
        madenkrom: "chrome", madenbarit: "barite", madenbor: "boron", madenmermer: "marble",
        madenfosfat: "phosphate", madenasbest: "asbestos", madentrona: "salt", madenaltin: "gold",
        madenuranyum: "uranium", madentoryum: "uranium", madenciva: "mercury", madentuz: "salt",
        madenperlit: "rock", madenpomza: "rock", madenkukurt: "sulfur", madenmanganez: "manganese",
        madenkursun: "lead", madenoltu: "jet", madenlule: "lule", madenvolfram: "tungsten",
        madenfeldspat: "feldspar", madenzimpara: "emery", madenetiket: "ore"
    };
    return T[k] || null;
}

function iconDataUri(name) {
    if (!name) return "";
    if (iconCache[name]) return iconCache[name];
    var p = path.join(ICON_DIR, name + ".png");
    if (!fs.existsSync(p)) return "";
    var uri = "data:image/png;base64," + fs.readFileSync(p).toString("base64");
    iconCache[name] = uri;
    return uri;
}

function iconsOnMap(pts, iconName, sizeOverride) {
    var href = iconDataUri(iconName);
    if (!href || !pts.length) return "";
    var photo = pts.some(function (p) { return p.urun; });
    if (!photo) {
        var size0 = sizeOverride || iconPx(pts.length);
        return pts.map(function (p) {
            var cx = p.pinX != null ? p.pinX : p.x;
            var cy = p.pinY != null ? p.pinY : p.y;
            var x = (cx - size0 / 2).toFixed(1);
            var y = (p.pinX != null ? cy - size0 / 2 : cy - size0 - 1).toFixed(1);
            return '<image href="' + href + '" x="' + x + '" y="' + y + '" width="' + size0 + '" height="' + size0 + '" preserveAspectRatio="xMidYMid meet"/>';
        }).join("");
    }
    var size = 20;
    return pts.map(function (p, i) {
        var cid = "ic" + i + Math.round(p.pinX || p.x) + Math.round(p.pinY || p.y);
        var r = size / 2;
        var cx = p.pinX != null ? p.pinX : p.x;
        var cy = p.pinY != null ? p.pinY : p.y;
        return '<defs><clipPath id="' + cid + '"><circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r + '"/></clipPath></defs>' +
            '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (r + 1.6).toFixed(1) + '" fill="#FFFDF6" stroke="' + C.navy + '" stroke-width="1.2"/>' +
            '<image href="' + href + '" x="' + (cx - r).toFixed(1) + '" y="' + (cy - r).toFixed(1) + '" width="' + size + '" height="' + size + '" clip-path="url(#' + cid + ')" preserveAspectRatio="xMidYMid slice"/>';
    }).join("");
}

function cropMap(provs, opts) {
    var pts = [];
    var rows = opts.noktalar || (opts.iller || []).map(function (name, i) {
        return { il: name, ilce: (opts.ilceler && opts.ilceler[i]) || "", yazi: opts.yazilar && opts.yazilar[i] };
    });
    var hi = [];
    rows.forEach(function (row) {
        var fp = findProv(provs, row.il);
        if (!fp) {
            console.warn("il yok:", row.il);
            return;
        }
        hi.push(row.il);
        var pos = districtXY(fp);
        if (!opts.urun) {
            if (row.pin === "cap" && fp.capX != null) pos = { x: fp.capX, y: fp.capY };
            pos = clampInProv(fp, pos.x + (row.pdx || 0), pos.y + (row.pdy || 0));
        }
        var ldy = row.ldy != null ? row.ldy : ((fp.maxY - pos.y) < 55 ? -16 : 18);
        pts.push({
            x: pos.x, y: pos.y, ox: pos.x, oy: pos.y,
            pinX: pos.x, pinY: pos.y,
            ldx: row.ldx != null ? row.ldx : 0,
            ldy: ldy,
            text: row.yazi || row.il,
            urun: opts.urun || "",
            il: row.il,
            ilce: row.ilce || "",
            locked: row.ldx != null,
            minX: fp.minX, maxX: fp.maxX, minY: fp.minY, maxY: fp.maxY
        });
    });
    if (!opts.urun) spreadSameCell(pts);
    else {
        spreadPhotoLabels(pts);
        pts.forEach(function (p) {
            if (p.locked) return;
            clampPhotoLabel(p);
        });
    }
    var factsY = 78 + MAP_BLOCK_H + 16;
    var facts = wrapFacts(opts.facts, 16, factsY, CANVAS_W - 32, 14);
    var H = factsY + facts.h + 28;
    var labels = labelsOnMap(pts);
    var overlay = iconsOnMap(pts, topicIcon(opts.file));
    var body = mapBlock(provs, landPaths(provs, hi, C.landHi) + overlay + labels) + facts.svg;
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
        { file: "elma.png", title: "ELMA ÜRETİMİ", urun: "Elma",
            noktalar: [
                { il: "Isparta", ilce: "Eğirdir" },
                { il: "Karaman", ilce: "Merkez" },
                { il: "Niğde", ilce: "Merkez" },
                { il: "Nevşehir", ilce: "Derinkuyu" },
                { il: "Konya", ilce: "Ereğli" },
                { il: "Denizli", ilce: "Çal" },
                { il: "Antalya", ilce: "Elmalı" }
            ],
            facts: ["Yoğunluk: Göller Yöresi ve Niğde–Nevşehir çevresi", "İç Anadolu’nun yüksek ovalarında da yetişir"] },
        { file: "bugday.png", title: "BUĞDAY ÜRETİMİ", urun: "Buğday",
            noktalar: [
                { il: "Konya", ilce: "Cihanbeyli" },
                { il: "Ankara", ilce: "Polatlı" },
                { il: "Şanlıurfa", ilce: "Harran" },
                { il: "Diyarbakır", ilce: "Bismil" },
                { il: "Tekirdağ", ilce: "Malkara" },
                { il: "Edirne", ilce: "Uzunköprü" },
                { il: "Yozgat", ilce: "Sorgun" },
                { il: "Kayseri", ilce: "Develi" },
                { il: "Adana", ilce: "Ceyhan" }
            ],
            facts: ["İç Anadolu ve Güneydoğu başta gelir", "Trakya’da da önemli ekim alanı vardır"] },
        { file: "pamuk.png", title: "PAMUK ÜRETİMİ", iller: ["Şanlıurfa", "Diyarbakır", "Adana", "Aydın", "İzmir", "Hatay", "Mardin"], facts: ["Sıcaklık ve sulama ister", "Çukurova ve Güneydoğu öne çıkar"] },
        { file: "zeytin.png", title: "ZEYTİN ÜRETİMİ", iller: ["Aydın", "İzmir", "Balıkesir", "Manisa", "Muğla", "Bursa", "Hatay", "Mersin", "Gaziantep"], facts: ["Akdeniz iklimi kıyı kuşağı", "Ege birinci sıradadır"] },
        { file: "üzüm.png", title: "ÜZÜM ÜRETİMİ", iller: ["Manisa", "Denizli", "İzmir", "Nevşehir", "Elazığ", "Gaziantep", "Tekirdağ"], facts: ["Ege bağcılığın merkezidir", "Kapadokya ve Güneydoğu’da da yetişir"] },
        { file: "mısır.png", title: "MISIR ÜRETİMİ", iller: ["Adana", "Şanlıurfa", "Mardin", "Sakarya", "Mersin", "Konya"], facts: ["Hem tahıl hem yağ bitkisi grubunda sayılır", "Çukurova ve GAP sulama alanları yoğundur"] },
        { file: "patates.png", title: "PATATES ÜRETİMİ", iller: ["Niğde", "Nevşehir", "Afyon", "Bolu", "Erzurum", "İzmir"], facts: ["Serin ve yüksek yerlerde verim artar", "Niğde–Nevşehir öne çıkar"] },
        { file: "arpa.png", title: "ARPA ÜRETİMİ", urun: "Arpa", iller: ["Konya", "Ankara", "Şanlıurfa", "Kayseri", "Yozgat", "Kırşehir"], facts: ["Buğdaya göre daha kurak koşullara dayanır", "Hayvancılık yemi olarak da önemlidir"] },
        { file: "seker_pancar.png", title: "ŞEKER PANCARI", iller: ["Konya", "Eskişehir", "Aksaray", "Yozgat", "Tokat", "Erzurum", "Kayseri"], facts: ["Ilıman-karasal iklim ve sulama", "Şeker fabrikaları çevresinde yoğunlaşır"] },
        { file: "hashas.png", title: "HAŞHAŞ ÜRETİMİ", urun: "Haşhaş",
            noktalar: [
                { il: "Kütahya", ilce: "Gediz", ldx: 8, ldy: -30 },
                { il: "Afyon", ilce: "Bolvadin", ldx: 28, ldy: -8 },
                { il: "Uşak", ilce: "Banaz", ldx: -34, ldy: 4 },
                { il: "Denizli", ilce: "Çal", ldx: -32, ldy: 18 },
                { il: "Burdur", ilce: "Yeşilova", ldx: 8, ldy: 32 },
                { il: "Isparta", ilce: "Yalvaç", ldx: 34, ldy: 12 }
            ],
            facts: ["Devlet kontrolünde üretilir", "Afyonkarahisar adıyla özdeşleşir"] },
        { file: "incir.png", title: "İNCİR ÜRETİMİ", urun: "İncir",
            noktalar: [
                { il: "Aydın", ilce: "İncirliova", ldx: 8, ldy: 30 },
                { il: "İzmir", ilce: "Tire", ldx: -32, ldy: 6 },
                { il: "Muğla", ilce: "Yatağan", ldx: 10, ldy: 32 },
                { il: "Bursa", ilce: "İznik", ldx: 8, ldy: -28 },
                { il: "Gaziantep", ilce: "Nizip", ldx: -32, ldy: 6 }
            ],
            facts: ["Aydın birinci sıradadır", "Ege’nin kurutmalık inciri meşhurdur"] },
        { file: "kayısı.png", title: "KAYISI ÜRETİMİ", urun: "Kayısı",
            noktalar: [
                { il: "Malatya", ilce: "Yeşilyurt", ldx: 8, ldy: 30 },
                { il: "Elazığ", ilce: "Baskil", ldx: 32, ldy: -8 },
                { il: "Kahramanmaraş", ilce: "Elbistan", ldx: -34, ldy: 6 },
                { il: "Iğdır", ilce: "Tuzluca", ldx: -36, ldy: 6 }
            ],
            facts: ["Malatya dünya ölçeğinde öne çıkar", "Kurutmalık kayısı ihracatı önemlidir"] },
        { file: "muz.png", title: "MUZ ÜRETİMİ", iller: ["Mersin", "Antalya", "Hatay"], facts: ["Don olayının az olduğu kıyı kuşağı", "Anamur–Alanya çevresi yoğundur"] },
        { file: "anason.png", title: "ANASON ÜRETİMİ", urun: "Anason",
            noktalar: [
                { il: "Burdur", ilce: "Tefenni" },
                { il: "Denizli", ilce: "Acıpayam" },
                { il: "Antalya", ilce: "Elmalı" },
                { il: "Muğla", ilce: "Fethiye" }
            ],
            facts: ["Göller Yöresi ve Teke çevresi", "Burdur–Tefenni öne çıkar", "Uçucu yağ bitkisidir"] },
        { file: "aspir.png", title: "ASPİR ÜRETİMİ", urun: "Aspir",
            noktalar: [
                { il: "Eskişehir", ilce: "Alpu" },
                { il: "Konya", ilce: "Cihanbeyli" },
                { il: "Ankara", ilce: "Polatlı" },
                { il: "Aksaray", ilce: "Eskil" }
            ],
            facts: ["Kuraklığa dayanıklı yağ bitkisi", "İç Anadolu’da ekimi artmaktadır"] },
        { file: "susam.png", title: "SUSAM ÜRETİMİ", iller: ["Antalya", "Muğla", "Manisa", "Adana"], facts: ["Sıcak iklim ister", "Akdeniz ve Ege kıyılarında yetişir"] },
        { file: "tütün.png", title: "TÜTÜN ÜRETİMİ", iller: ["Manisa", "Denizli", "Samsun", "Adıyaman", "Bitlis", "Muş"], facts: ["Ege ve Karadeniz’de klasik üretim alanları", "Doğu Anadolu’da da ekilir"] },
        { file: "yer_fıstık.png", title: "YER FISTIĞI", iller: ["Osmaniye", "Adana", "Aydın", "Kahramanmaraş"], facts: ["Çukurova ve Osmaniye öne çıkar", "Sıcaklık ve kumlu-tınlı toprak ister"] },
        { file: "antep_fıstık.png", title: "ANTEP FISTIĞI", urun: "Antep fıstığı",
            noktalar: [
                { il: "Gaziantep", ilce: "Nizip" },
                { il: "Şanlıurfa", ilce: "Birecik" },
                { il: "Siirt", ilce: "Pervari" },
                { il: "Adıyaman", ilce: "Kâhta" }
            ],
            facts: ["Güneydoğu Anadolu’nun karakteristik ürünü", "En çok Şanlıurfa–Birecik çevresi", "Gaziantep–Nizip adıyla anılır"] },
        { file: "kırmızı_mercimek.png", title: "KIRMIZI MERCİMEK", urun: "Kırmızı mercimek",
            noktalar: [
                { il: "Şanlıurfa", ilce: "Viranşehir", ldx: -34, ldy: 8 },
                { il: "Diyarbakır", ilce: "Bismil", ldx: 8, ldy: -28 },
                { il: "Mardin", ilce: "Kızıltepe", ldx: 8, ldy: 30 },
                { il: "Batman", ilce: "Kozluk", ldx: 32, ldy: 6 }
            ],
            facts: ["Güneydoğu Anadolu birinci sıradadır", "Kuraklığa dayanıklı baklagildir"] },
        { file: "gül.png", title: "GÜL ÜRETİMİ", urun: "Gül",
            noktalar: [
                { il: "Afyon", ilce: "Dinar", ldx: 8, ldy: -30 },
                { il: "Isparta", ilce: "Keçiborlu", ldx: 32, ldy: 8 },
                { il: "Burdur", ilce: "Bucak", ldx: 6, ldy: 32 },
                { il: "Denizli", ilce: "Çal", ldx: -36, ldy: 4 }
            ],
            facts: ["Isparta ‘gül bahçesi’ olarak anılır", "Yağ gülü üretimi yoğundur"] },
        { file: "turunc.png", title: "TURUNÇGİL ÜRETİMİ", iller: ["Antalya", "Mersin", "Adana", "Hatay", "Muğla"], facts: ["Akdeniz kıyı kuşağı", "Don riski düşük yerlerde yetişir"] },
        { file: "kenevir.jpg", title: "KENEVİR ÜRETİMİ", urun: "Kenevir",
            noktalar: [
                { il: "Kastamonu", ilce: "Taşköprü", ldx: -34, ldy: 8 },
                { il: "Samsun", ilce: "Vezirköprü", ldx: 32, ldy: 8 },
                { il: "Amasya", ilce: "Suluova", ldx: 8, ldy: 30 }
            ],
            facts: ["Devlet kontrolündedir", "Tohumuna çedene denir", "Ekime en çok izin Karadeniz’dedir"] },
        { file: "kanola.jpg", title: "KANOLA ÜRETİMİ", urun: "Kanola",
            noktalar: [
                { il: "Edirne", ilce: "Uzunköprü", ldx: -36, ldy: -8 },
                { il: "Kırklareli", ilce: "Lüleburgaz", ldx: 10, ldy: -30 },
                { il: "Tekirdağ", ilce: "Malkara", ldx: 28, ldy: 28 },
                { il: "Konya", ilce: "Cihanbeyli", ldx: 8, ldy: -28 }
            ],
            facts: ["Trakya’nın Sarı Kızı olarak anılır", "Yağ oranı yüksektir"] },
        { file: "pirinc.jpg", title: "ÇELTİK / PİRİNÇ", iller: ["Edirne", "Samsun", "Balıkesir"], facts: ["Meriç boyları başta gelir", "Diğer ekim alanları Osmancık ve Tosya", "Üretim devlet kontrolündedir"] },
        { file: "ay_cicek.jpg", title: "AYÇİÇEĞİ ÜRETİMİ", urun: "Ayçiçeği",
            noktalar: [
                { il: "Tekirdağ", ilce: "Malkara", ldx: 38, ldy: 30 },
                { il: "Edirne", ilce: "Uzunköprü", ldx: -34, ldy: -26 },
                { il: "Konya", ilce: "Cihanbeyli" },
                { il: "Adana", ilce: "Ceyhan" }
            ],
            facts: ["Trakya klasik üretim bölgesidir", "İntansif tarım ürünlerindendir"] },
        { file: "findik.jpg", title: "FINDIK ÜRETİMİ", urun: "Fındık",
            noktalar: [
                { il: "Sakarya", ilce: "Karasu", ldx: -52, ldy: 8 },
                { il: "Düzce", ilce: "Akçakoca", ldx: 52, ldy: 8 },
                { il: "Samsun", ilce: "Terme", ldx: 44, ldy: 10 },
                { il: "Ordu", ilce: "Ünye", ldx: -46, ldy: 8 },
                { il: "Giresun", ilce: "Bulancak", ldx: 46, ldy: 10 },
                { il: "Trabzon", ilce: "Akçaabat", ldx: -44, ldy: 10 },
                { il: "Rize", ilce: "Pazar", ldx: 50, ldy: 8 }
            ],
            facts: ["Karadeniz birinci, Marmara ikinci sıradadır", "Türkiye dünya üretiminde 1. sıradadır", "Devirli tarım ürünüdür"] },
        { file: "cay.jpg", title: "ÇAY ÜRETİMİ", urun: "Çay",
            noktalar: [
                { il: "Giresun", ilce: "Tirebolu", ldx: -40, ldy: 26 },
                { il: "Trabzon", ilce: "Of", ldx: 6, ldy: 28 },
                { il: "Rize", ilce: "Çayeli", ldx: -8, ldy: 26 },
                { il: "Artvin", ilce: "Hopa", ldx: 42, ldy: 18 }
            ],
            facts: ["Tamamı Doğu Karadeniz’dedir", "Zihni Derin tarafından Batum’dan getirilmiştir", "Dünya üretiminde Türkiye 5. sıradadır"] }
    ];

    var only = process.argv.slice(2);
    if (only.length) {
        crops = crops.filter(function (c) {
            return only.some(function (n) { return c.file.indexOf(n) >= 0; });
        });
    }
    crops.forEach(function (c) {
        writePng(path.join(IMG, c.file), cropMap(provs, c));
        console.log("ok", c.file);
    });
    var onlyMore = process.argv.slice(2);
    function wantFile(file) {
        if (!onlyMore.length) return true;
        var f = norm(file);
        return onlyMore.some(function (n) { return f.indexOf(norm(n)) >= 0; });
    }

    if (!(wantFile("21haziran") || wantFile("21aralik"))) { /* skip solstice */ } else {

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
    }

    function labeled(title, kicker, items, facts) {
        if (!wantFile(title.file)) return;
        var pts = [];
        var usePins = items.some(function (it) { return it.ldx != null || it.ldy != null || it.pdx || it.pdy; });
        items.forEach(function (it) {
            var fp = findProv(provs, it.il);
            if (!fp) {
                console.warn("il yok:", it.il);
                return;
            }
            var pos = districtXY(fp);
            pos = clampInProv(fp, pos.x + (it.pdx || 0), pos.y + (it.pdy || 0));
            var p = { x: pos.x, y: pos.y, ox: pos.x, oy: pos.y, text: mapCaption(it.label) };
            if (usePins) {
                p.pinX = pos.x;
                p.pinY = pos.y;
                p.ldx = it.ldx != null ? it.ldx : 0;
                p.ldy = it.ldy != null ? it.ldy : 26;
                p.locked = true;
            }
            pts.push(p);
        });
        if (!usePins) spreadSameCell(pts);
        var overlay = iconsOnMap(pts, topicIcon(title.file), title.iconSize);
        var labels = labelsOnMap(pts);
        var hi = [];
        items.forEach(function (it) {
            if (it.hi === false) return;
            hi.push(it.il);
            (it.boya || []).forEach(function (b) { hi.push(b); });
        });
        var extra = landPaths(provs, hi, C.landHi) + overlay + labels;
        var factsY = 78 + MAP_BLOCK_H + 16;
        var factsBox = wrapFacts(facts, 16, factsY, CANVAS_W - 32, 14);
        var H = factsY + factsBox.h + 28;
        var body = mapBlock(provs, extra) + factsBox.svg;
        writePng(path.join(IMG, title.file), frame(H, title.head, kicker, body));
        console.log("ok", title.file);
    }

    labeled({ file: "kıvrım_dağlar.png", head: "KIVRIM DAĞLARI", iconSize: 15 }, "Yer şekilleri",
        [
            { il: "Kırklareli", label: "Yıldız", ldx: 8, ldy: 28 },
            { il: "Kastamonu", label: "Küre", ldx: -36, ldy: -20, boya: ["Bartın"] },
            { il: "Çankırı", label: "Ilgaz", ldx: 8, ldy: 28, boya: ["Kastamonu"] },
            { il: "Bolu", label: "Köroğlu", ldx: -8, ldy: 28 },
            { il: "Samsun", label: "Canik", ldx: 36, ldy: -20, boya: ["Ordu"] },
            { il: "Rize", label: "Kaçkar", ldx: 8, ldy: -28, boya: ["Artvin"] },
            { il: "Erzurum", label: "Mescit", ldx: 36, ldy: -12, pdy: -48 },
            { il: "Ardahan", label: "Yalnızçam", ldx: 40, ldy: 8, boya: ["Artvin"] },
            { il: "Bayburt", label: "Kop", ldx: -40, ldy: 8, boya: ["Erzurum"] },
            { il: "Antalya", label: "Beydağları", ldx: -44, ldy: 8, pdx: -28, pdy: -8 },
            { il: "Afyon", label: "Sultan", ldx: 32, ldy: 12, pdx: 36, pdy: 36 },
            { il: "Antalya", label: "Geyik", ldx: 8, ldy: -24, pdx: 96, pdy: -10, boya: ["Karaman"] },
            { il: "Karaman", label: "Bolkar", ldx: 8, ldy: -26, boya: ["Mersin", "Niğde"] },
            { il: "Niğde", label: "Aladağlar", ldx: 8, ldy: -26, boya: ["Kayseri", "Adana"] },
            { il: "Hakkari", label: "Hakkari", ldx: -8, ldy: -26 }
        ],
        [
            "Karadeniz ve Akdeniz’de dağlar kıyıya paralel uzanır",
            "Boyuna kıyı tipi · girinti-çıkıntı az · falez yaygın",
            "Denizel etki iç kesimlere giremez · ulaşım geçitlerle",
            "Kıta sahanlığı dar · liman hinterlandı dardır",
            "Yamaç (orografik) yağış görülür · yandan sıkışma: antiklinal / senklinal"
        ]
    );

    labeled({ file: "kırık_dağlar.png", head: "KIRIK DAĞLAR", iconSize: 15 }, "Horst dağları",
        [
            { il: "Çanakkale", label: "Kaz", ldx: -66, ldy: -53 },
            { il: "Balıkesir", label: "Madra", ldx: -103, ldy: -29 },
            { il: "Manisa", label: "Yunt", ldx: -127, ldy: -46 },
            { il: "İzmir", label: "Bozdağlar", ldx: -116, ldy: -37, pdx: 36, pdy: 8 },
            { il: "Aydın", label: "Aydın", ldx: -109, ldy: -14 },
            { il: "Muğla", label: "Menteşe", ldx: -138, ldy: -10 },
            { il: "Hatay", label: "Amanos (Nur)", ldx: 6, ldy: -28 }
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
        { file: "maden_genel.png", title: "TÜRKİYE MADEN HARİTASI",             listTitle: "BAŞLICA YATAKLAR", kicker: "Maden dağılımı",
            iller: ["Balıkesir", "Bursa", "Eskişehir", "İzmir", "Aydın", "Muğla", "Isparta", "Antalya", "Zonguldak", "Ankara", "Aksaray", "Çankırı", "Yozgat", "Artvin", "Sivas", "Elazığ", "Erzurum", "Mardin", "Afyon", "Konya"],
            yazilar: ["Bor · Mermer", "Bor · Volfram", "Lüle · Toryum", "Altın · Cıva", "Zımpara", "Krom · Mermer", "Kükürt", "Boksit · Barit", "Manganez", "Trona", "Tuz Gölü", "Kaya tuzu", "Uranyum", "Bakır · Altın", "Demir", "Krom", "Oltu taşı", "Fosfat", "Mermer", "Boksit"],
            facts: ["Çeşit fazla, miktar azdır", "En fazla çeşit: Yukarı Fırat (Elazığ) — volkanizma", "Bor dünya rezervinin ~%72’si Türkiye’dedir"] },
        { file: "maden_demir.png", title: "DEMİR", urun: "Demir",
            noktalar: [
                { il: "Sivas", ilce: "Divriği", ldx: 36, ldy: -8 },
                { il: "Malatya", ilce: "Hekimhan", ldx: -36, ldy: 8 },
                { il: "Karabük", ilce: "Karabük", ldx: 8, ldy: 28 },
                { il: "Zonguldak", ilce: "Ereğli", ldx: -36, ldy: 6 },
                { il: "Hatay", ilce: "İskenderun", ldx: -36, ldy: 8 }
            ],
            facts: ["Çıkarım: Divriği, Hekimhan, Hasançelebi", "Karabük–Ereğli: taşkömürüne yakınlık", "İskenderun: ulaşım + ithal kömür, su kenarı"] },
        { file: "maden_bakir.png", title: "BAKIR", urun: "Bakır",
            noktalar: [
                { il: "Kastamonu", ilce: "Küre", ldx: -34, ldy: 8 },
                { il: "Samsun", ilce: "İşleme", ldx: 8, ldy: 30 },
                { il: "Rize", ilce: "Çayeli", ldx: -34, ldy: 8 },
                { il: "Artvin", ilce: "Murgul", ldx: 32, ldy: 8 }
            ],
            facts: ["En çok Karadeniz’de çıkarılır: Küre, Murgul, Çayeli", "İşleme: Samsun (ulaşım)"] },
        { file: "maden_boksit.png", title: "BOKSİT (ALÜMİNYUM)", urun: "Boksit",
            noktalar: [
                { il: "Antalya", ilce: "Akseki", ldx: -40, ldy: 10 },
                { il: "Konya", ilce: "Seydişehir", ldx: 40, ldy: -10 }
            ],
            facts: ["Çıkarım: Akseki ve Seydişehir", "İşleme: Seydişehir"] },
        { file: "maden_krom.png", title: "KROM", urun: "Krom",
            noktalar: [
                { il: "Elazığ", ilce: "Guleman", ldx: 32, ldy: 8 },
                { il: "Muğla", ilce: "Köyceğiz", ldx: -34, ldy: 8 },
                { il: "Antalya", ilce: "İşleme", ldx: 8, ldy: 28 }
            ],
            facts: ["Paslanmazlık–aşınmazlık · rezerv fazla · ihraç", "Çıkarım: Guleman, Köyceğiz", "İşleme: Elazığ (ham madde), Antalya (ulaşım)"] },
        { file: "maden_barit.png", title: "BARİT", urun: "Barit",
            noktalar: [
                { il: "Antalya", ilce: "Alanya", ldx: -36, ldy: 8 }
            ],
            facts: ["Petrol kuyularında basıncı artırır", "Alanya · rezerv fazla · ihraç"] },
        { file: "maden_bor.png", title: "BOR", urun: "Bor",
            noktalar: [
                { il: "Balıkesir", ilce: "Bandırma", ldx: -38, ldy: -8 },
                { il: "Bursa", ilce: "Kestelek", ldx: 38, ldy: 10 },
                { il: "Kütahya", ilce: "Emet", ldx: 8, ldy: 30 },
                { il: "Eskişehir", ilce: "Kırka", ldx: 40, ldy: -10 }
            ],
            facts: ["Dünya rezervinin yaklaşık %72’si Türkiye’dedir", "İşleme: Kırka ve Bandırma", "İhraç edilir"] },
        { file: "maden_mermer.png", title: "MERMER", urun: "Mermer",
            noktalar: [
                { il: "Afyon", ldx: 8, ldy: 30 },
                { il: "Balıkesir", ilce: "Marmara Adası", ldx: -42, ldy: 8 },
                { il: "Muğla", ldx: -34, ldy: 8 },
                { il: "Bursa", ldx: 36, ldy: 8 }
            ],
            facts: ["Kireç taşının başkalaşımıyla oluşur", "En çok Afyon ve Marmara Adası"] },
        { file: "maden_fosfat.png", title: "FOSFAT", urun: "Fosfat",
            noktalar: [
                { il: "Mardin", ilce: "Mazıdağı", ldx: -34, ldy: 8 }
            ],
            facts: ["Gübre hammaddesi", "Rezerv azdır", "Mazıdağı’nda hem çıkarılır hem işlenir"] },
        { file: "maden_asbest.png", title: "ASBEST (AMYANT)", urun: "Asbest",
            noktalar: [
                { il: "Eskişehir", ilce: "Mihalıççık", ldx: -32, ldy: 8 },
                { il: "Sivas", ilce: "Yıldızeli", ldx: 8, ldy: -28 }
            ],
            facts: ["Yanmazlık özelliği vardır", "Kanser yapıcı olduğu için yasaklıdır"] },
        { file: "maden_trona.png", title: "TRONA (SODA KÜLÜ)", iller: ["Ankara"],
            yazilar: ["Beypazarı · Kazan"],
            facts: ["Cam sanayisi (Şişecam)", "Sincan, Kazan, Beypazarı", "İşleme: Kazan"] },
        { file: "maden_altin.png", title: "ALTIN", urun: "Altın",
            noktalar: [
                { il: "İzmir", ilce: "Ovacık", ldx: -34, ldy: 8 },
                { il: "Çanakkale", ilce: "Kaz Dağları", ldx: 8, ldy: -28 },
                { il: "Gümüşhane", ilce: "Mostra Dağı", ldx: -34, ldy: 8 },
                { il: "Artvin", ilce: "Cerattepe", ldx: 32, ldy: 8 }
            ],
            facts: ["İlk yatak: Bergama–Ovacık", "Kaz Dağları, Mostra Dağı, Cerattepe"] },
        { file: "maden_uranyum.png", title: "URANYUM", iller: ["Yozgat"],
            yazilar: ["Sorgun"],
            facts: ["Nükleer enerji hammaddesi", "Yozgat–Sorgun"] },
        { file: "maden_toryum.png", title: "TORYUM", iller: ["Eskişehir"],
            yazilar: ["Sivrihisar"],
            facts: ["Nükleer enerji potansiyeli", "Sivrihisar’da bulunur, henüz işletilmez"] },
        { file: "maden_civa.png", title: "CIVA", urun: "Cıva",
            noktalar: [
                { il: "İzmir", ilce: "Karaburun", ldx: -38, ldy: 8 },
                { il: "Konya", ilce: "Sarayönü", ldx: 40, ldy: -10 }
            ],
            facts: ["Oda sıcaklığında sıvı olan tek maden", "Karaburun ve Sarayönü", "Hassas alet (termometre, barometre)"] },
        { file: "maden_tuz.png", title: "TUZ", iller: ["Çankırı", "Iğdır", "Kars", "Aksaray", "Konya", "Ankara", "İzmir"],
            yazilar: ["Çankırı", "Iğdır", "Kars", "Tuz Gölü", "Tuz Gölü", "Tuz Gölü", "Çamaltı"],
            facts: ["Kaya tuzu: Çankırı, Iğdır, Kars", "Göl tuzu: Tuz Gölü (Aksaray–Konya–Ankara)", "Deniz tuzu: Çamaltı"] },
        { file: "maden_perlit.png", title: "PERLİT (İNCİ TAŞI)", iller: ["İzmir", "Ankara", "Bayburt", "Erzurum"],
            facts: ["Volkanik, camsı yapı", "Gıda, inşaat, boya, deterjan"] },
        { file: "maden_pomza.png", title: "POMZA TAŞI", iller: ["Nevşehir", "Kayseri"],
            facts: ["Tarım ve inşaat", "Kapadokya volkanizması"] },
        { file: "maden_kukurt.png", title: "KÜKÜRT", urun: "Kükürt",
            noktalar: [
                { il: "Isparta", ilce: "Keçiborlu", ldx: 32, ldy: 8 }
            ],
            facts: ["Bağcılık ve kayısıcılıkta hastalık önler", "Keçiborlu başlıca yataktır"] },
        { file: "maden_manganez.png", title: "MANGANEZ", urun: "Manganez",
            noktalar: [
                { il: "Zonguldak", ilce: "Ereğli", ldx: 32, ldy: 8 }
            ],
            facts: ["Çeliğe sertlik verir", "Ereğli"] },
        { file: "maden_kursun.png", title: "KURŞUN VE ÇİNKO", urun: "Kurşun",
            noktalar: [
                { il: "Yozgat", ldx: -32, ldy: 8 },
                { il: "Elazığ", ldx: 32, ldy: 8 }
            ],
            facts: ["Birlikte çıkarılır"] },
        { file: "maden_oltu.png", title: "OLTU TAŞI", iller: ["Erzurum"],
            yazilar: ["Oltu"],
            facts: ["Süs eşyası ve takı", "Erzurum–Oltu"] },
        { file: "maden_lule.png", title: "LÜLE TAŞI", urun: "Lüle taşı",
            noktalar: [
                { il: "Eskişehir", ldx: 32, ldy: 8 }
            ],
            facts: ["Pipo ve süs eşyası"] },
        { file: "maden_volfram.png", title: "VOLFRAM (TUNGSTEN)", iller: ["Bursa"],
            yazilar: ["Uludağ"],
            facts: ["Sert metal alaşımı", "Uludağ"] },
        { file: "maden_feldspat.png", title: "FELDSPAT", urun: "Feldspat",
            noktalar: [
                { il: "Aydın", ldx: -34, ldy: 8 },
                { il: "Kütahya", ldx: 8, ldy: -28 },
                { il: "Yozgat", ldx: 32, ldy: 8 }
            ],
            facts: ["Cam, seramik, boya, plastik"] },
        { file: "maden_zimpara.png", title: "ZIMPARA TAŞI", iller: ["Aydın", "Antalya"],
            yazilar: ["Aydın", "Alanya"],
            facts: ["Zımparalama ve parlatma", "Aydın ve Alanya · ihraç edilir"] }
    ];
    if (onlyMore.length) {
        minerals = minerals.filter(function (m) { return wantFile(m.file); });
    }
    minerals.forEach(function (m) {
        writePng(path.join(IMG, m.file), cropMap(provs, {
            file: m.file,
            title: m.title,
            urun: m.urun,
            noktalar: m.noktalar,
            iller: m.iller,
            yazilar: m.yazilar,
            facts: m.facts,
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

    if (wantFile("nufusprmt") || wantFile("nufus")) {
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
}

main();
