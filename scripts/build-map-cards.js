/**
 * Harita oyunu konu kartları için çizim tarzı arka planlar üretir.
 *   node scripts/build-map-cards.js
 * Çıktı:
 *   img/map/kart/<konu-id>.svg       (web kart arka planı, 960x400)
 *   mobile/assets/map/<konu-id>.png  (mobil küçük resim, 192x192)
 * Konu kimlikleri js/mapQuiz.js içindeki TREE ile aynıdır.
 */
var fs = require("fs");
var path = require("path");
var { Resvg } = require("@resvg/resvg-js");

var root = path.join(__dirname, "..");
var W = 960;
var H = 400;

// ---------- yardımcılar ----------
function rng(seed) {
    var a = 0;
    for (var i = 0; i < seed.length; i++) a = (a * 31 + seed.charCodeAt(i)) | 0;
    return function () {
        a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function f(n) { return Math.round(n * 10) / 10; }

function Scene(id) {
    this.id = id;
    this.r = rng(id);
    this.defs = [];
    this.body = [];
    this.n = 0;
}
Scene.prototype.uid = function (p) { this.n += 1; return p + this.n; };
Scene.prototype.add = function (s) { this.body.push(s); return this; };
Scene.prototype.grad = function (stops, x1, y1, x2, y2) {
    var id = this.uid("g");
    this.defs.push('<linearGradient id="' + id + '" x1="' + (x1 || 0) + '" y1="' + (y1 || 0) + '" x2="' + (x2 == null ? 0 : x2) + '" y2="' + (y2 == null ? 1 : y2) + '">' +
        stops.map(function (s, i) {
            var c = Array.isArray(s) ? s : [s, i / (stops.length - 1)];
            return '<stop offset="' + c[1] + '" stop-color="' + c[0] + '"' + (c[2] != null ? ' stop-opacity="' + c[2] + '"' : "") + "/>";
        }).join("") + "</linearGradient>");
    return "url(#" + id + ")";
};
Scene.prototype.radial = function (stops, cx, cy, r) {
    var id = this.uid("r");
    this.defs.push('<radialGradient id="' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">' +
        stops.map(function (s) { return '<stop offset="' + s[1] + '" stop-color="' + s[0] + '" stop-opacity="' + (s[2] == null ? 1 : s[2]) + '"/>'; }).join("") +
        "</radialGradient>");
    return "url(#" + id + ")";
};
Scene.prototype.svg = function (vb) {
    var v = (vb || "0 0 " + W + " " + H).split(" ");
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (vb || "0 0 " + W + " " + H) + '" width="' + W + '" height="' + H + '" preserveAspectRatio="xMidYMid slice">' +
        "<defs>" + this.defs.join("") +
        '<filter id="vib" filterUnits="userSpaceOnUse" x="' + v[0] + '" y="' + v[1] + '" width="' + v[2] + '" height="' + v[3] + '"><feColorMatrix type="saturate" values="1.25"/>' +
        '<feComponentTransfer><feFuncR type="linear" slope="1.08"/><feFuncG type="linear" slope="1.08"/><feFuncB type="linear" slope="1.08"/></feComponentTransfer></filter>' +
        '</defs><g filter="url(#vib)">' + this.body.join("") + "</g></svg>";
};

// gökyüzü
function sky(s, top, bottom, mid) {
    var stops = mid ? [top, mid, bottom] : [top, bottom];
    s.add('<rect width="' + W + '" height="' + H + '" fill="' + s.grad(stops) + '"/>');
}
function sun(s, x, y, r, color, glow) {
    s.add('<circle cx="' + x + '" cy="' + y + '" r="' + r * 3.2 + '" fill="' + s.radial([[glow || color, 0, 0.45], [glow || color, 1, 0]], 0.5, 0.5, 0.5) + '"/>');
    s.add('<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + color + '"/>');
}
function cloud(s, x, y, k, color, op) {
    var c = color || "#ffffff";
    s.add('<g fill="' + c + '" opacity="' + (op == null ? 0.85 : op) + '">' +
        '<ellipse cx="' + x + '" cy="' + y + '" rx="' + 46 * k + '" ry="' + 16 * k + '"/>' +
        '<ellipse cx="' + (x - 26 * k) + '" cy="' + (y + 4 * k) + '" rx="' + 30 * k + '" ry="' + 12 * k + '"/>' +
        '<ellipse cx="' + (x + 8 * k) + '" cy="' + (y - 10 * k) + '" rx="' + 28 * k + '" ry="' + 15 * k + '"/>' +
        '<ellipse cx="' + (x + 34 * k) + '" cy="' + (y + 3 * k) + '" rx="' + 26 * k + '" ry="' + 11 * k + '"/></g>');
}
// yumuşak dalgalı arazi katmanı
function layer(s, base, amp, fill, opt) {
    opt = opt || {};
    var r = s.r;
    var ph = [r() * 6, r() * 6, r() * 6];
    var fr = opt.freq || 1;
    var pts = [];
    for (var x = -10; x <= W + 10; x += 8) {
        var y = base
            - amp * (0.55 * Math.sin(x / 140 * fr + ph[0]) + 0.3 * Math.sin(x / 61 * fr + ph[1]) + 0.15 * Math.sin(x / 23 * fr + ph[2]))
            - (opt.tilt || 0) * (x / W);
        pts.push(f(x) + "," + f(y));
    }
    s.add('<polygon points="' + pts.join(" ") + " " + (W + 10) + "," + (H + 10) + " -10," + (H + 10) + '" fill="' + fill + '"' + (opt.op ? ' opacity="' + opt.op + '"' : "") + "/>");
}
// sivri dağ (karlı olabilir)
function peak(s, cx, top, base, half, fill, snow, shade) {
    var l = cx - half;
    var rr = cx + half * (0.9 + s.r() * 0.3);
    var sk = (s.r() - 0.5) * half * 0.25;
    var px = cx + sk;
    s.add('<polygon points="' + f(l) + "," + base + " " + f(px - half * 0.18) + "," + f(top + (base - top) * 0.22) + " " + f(px) + "," + top + " " + f(px + half * 0.22) + "," + f(top + (base - top) * 0.3) + " " + f(rr) + "," + base + '" fill="' + fill + '"/>');
    if (shade) {
        s.add('<polygon points="' + f(px) + "," + top + " " + f(px + half * 0.22) + "," + f(top + (base - top) * 0.3) + " " + f(rr) + "," + base + " " + f(px + half * 0.05) + "," + base + '" fill="' + shade + '"/>');
    }
    if (snow) {
        var sy = top + (base - top) * 0.28;
        var t = (sy - top) / (base - top);
        var sl = px - (px - l) * t;
        var sr = px + (rr - px) * t;
        s.add('<polygon points="' + f(px) + "," + top + " " + f(sr) + "," + f(sy) + " " + f(sr - (sr - px) * 0.3) + "," + f(sy - 6) + " " + f(px + (sr - px) * 0.15) + "," + f(sy + 8) + " " + f(px - (px - sl) * 0.35) + "," + f(sy - 4) + " " + f(sl) + "," + f(sy) + '" fill="' + snow + '"/>');
    }
}
function pine(s, x, y, h, c) {
    var w = h * 0.36;
    s.add('<polygon points="' + f(x) + "," + f(y - h) + " " + f(x + w) + "," + f(y) + " " + f(x - w) + "," + f(y) + '" fill="' + c + '"/>');
}
function pines(s, y0, x0, x1, n, h, c, jitter) {
    for (var i = 0; i < n; i++) {
        var x = x0 + (x1 - x0) * (i + s.r() * 0.8) / n;
        var hh = h * (0.7 + s.r() * 0.6);
        pine(s, x, y0 + (jitter || 0) * s.r(), hh, c);
    }
}
function bush(s, x, y, r, c) {
    s.add('<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + c + '"/>');
}
function house(s, x, y, k, wall, roof) {
    s.add('<g><rect x="' + f(x) + '" y="' + f(y - 14 * k) + '" width="' + f(20 * k) + '" height="' + f(14 * k) + '" fill="' + wall + '"/>' +
        '<polygon points="' + f(x - 3 * k) + "," + f(y - 14 * k) + " " + f(x + 10 * k) + "," + f(y - 24 * k) + " " + f(x + 23 * k) + "," + f(y - 14 * k) + '" fill="' + roof + '"/></g>');
}
// perspektif tarla şeritleri
function fields(s, yTop, colors, vx, n) {
    vx = vx == null ? W * 0.55 : vx;
    n = n || 14;
    for (var i = 0; i < n; i++) {
        var a = -W * 0.6 + (W * 2.2) * i / n;
        var b = -W * 0.6 + (W * 2.2) * (i + 1) / n;
        var ta = vx + (a - vx) * 0.08;
        var tb = vx + (b - vx) * 0.08;
        s.add('<polygon points="' + f(ta) + "," + yTop + " " + f(tb) + "," + yTop + " " + f(b) + "," + H + " " + f(a) + "," + H + '" fill="' + colors[i % colors.length] + '"/>');
    }
}
function waterRect(s, y, h, c1, c2) {
    s.add('<rect x="0" y="' + y + '" width="' + W + '" height="' + h + '" fill="' + s.grad([c1, c2]) + '"/>');
    for (var i = 0; i < 14; i++) {
        var yy = y + 6 + s.r() * (h - 10);
        var xx = s.r() * W;
        var ww = 20 + s.r() * 60;
        s.add('<rect x="' + f(xx) + '" y="' + f(yy) + '" width="' + f(ww) + '" height="2" rx="1" fill="#ffffff" opacity="0.28"/>');
    }
}
function smoke(s, x, y, k, c, op) {
    var g = '<g fill="' + (c || "#e7e5e4") + '" opacity="' + (op || 0.75) + '">';
    for (var i = 0; i < 6; i++) {
        g += '<circle cx="' + f(x + i * 14 * k + s.r() * 8) + '" cy="' + f(y - i * 16 * k) + '" r="' + f((10 + i * 5) * k) + '"/>';
    }
    s.add(g + "</g>");
}

// ---------- sahneler ----------
var SCENES = {};

SCENES.volkanik = function (s) {
    sky(s, "#2b1a3d", "#f08a4b", "#8a3b52");
    sun(s, 160, 120, 26, "#ffd8a8", "#ffb26b");
    layer(s, 330, 18, "#5b2f45");
    s.add('<polygon points="380,360 560,92 600,88 640,94 820,360" fill="#3a2230"/>');
    s.add('<polygon points="600,88 640,94 820,360 600,360" fill="#2a1824"/>');
    s.add('<polygon points="560,92 600,104 640,94 620,86 580,86" fill="#ff6a2b"/>');
    s.add('<path d="M598,100 C590,160 610,200 585,260 C570,300 590,330 575,360" stroke="#ff7b2e" stroke-width="7" fill="none" stroke-linecap="round"/>');
    s.add('<path d="M612,104 C630,170 640,220 670,290 L690,360" stroke="#ffb03b" stroke-width="4" fill="none" stroke-linecap="round"/>');
    smoke(s, 590, 70, 1.4, "#6b5260", 0.85);
    layer(s, 360, 12, "#1e1219");
};
SCENES["volkanik-arazi"] = function (s) {
    sky(s, "#7ec3e6", "#fde2b8");
    sun(s, 820, 80, 22, "#fff4d6");
    layer(s, 250, 14, "#e2b98a");
    var xs = [430, 500, 560, 620, 690, 760, 830, 900];
    xs.forEach(function (x, i) {
        var h = 120 + (i % 3) * 30 + s.r() * 20;
        var b = 330;
        s.add('<path d="M' + (x - 26) + "," + b + " Q" + (x - 14) + "," + (b - h * 0.6) + " " + (x - 6) + "," + (b - h) + " L" + (x + 6) + "," + (b - h) + " Q" + (x + 14) + "," + (b - h * 0.6) + " " + (x + 26) + "," + b + 'Z" fill="#f1d3ab"/>');
        s.add('<path d="M' + x + "," + (b - h) + " L" + (x + 6) + "," + (b - h) + " Q" + (x + 14) + "," + (b - h * 0.6) + " " + (x + 26) + "," + b + " L" + x + "," + b + 'Z" fill="#d9ad7f"/>');
        s.add('<ellipse cx="' + x + '" cy="' + (b - h - 2) + '" rx="17" ry="9" fill="#7a5640"/>');
    });
    layer(s, 340, 10, "#c98f5f");
    cloud(s, 230, 90, 0.9);
};
SCENES.kirik = function (s) {
    sky(s, "#8fc9ea", "#e8f4ea");
    cloud(s, 760, 70, 1);
    // horst (yükselen bloklar) ve graben (çöken ova)
    s.add('<polygon points="0,150 300,140 330,160 330,400 0,400" fill="#7c8f5a"/>');
    s.add('<polygon points="300,140 330,160 330,400 300,400" fill="#5d6e40"/>');
    s.add('<polygon points="630,160 960,150 960,400 630,400" fill="#7c8f5a"/>');
    s.add('<polygon points="630,160 655,175 655,400 630,400" fill="#5d6e40"/>');
    s.add('<polygon points="330,280 630,280 630,400 330,400" fill="#9fc46a"/>');
    for (var i = 0; i < 6; i++) s.add('<rect x="' + (340 + i * 48) + '" y="292" width="40" height="40" fill="' + ["#b9d47a", "#8db758", "#cfd98c"][i % 3] + '"/>');
    s.add('<path d="M330,350 C420,338 520,368 630,345" stroke="#5aa9d6" stroke-width="8" fill="none"/>');
    // katman çizgileri
    [190, 230, 270].forEach(function (y) {
        s.add('<line x1="0" y1="' + y + '" x2="300" y2="' + (y - 8) + '" stroke="#6a7d48" stroke-width="3"/>');
        s.add('<line x1="655" y1="' + (y + 10) + '" x2="960" y2="' + y + '" stroke="#6a7d48" stroke-width="3"/>');
    });
    s.add('<line x1="330" y1="160" x2="330" y2="400" stroke="#3f4a2c" stroke-width="3" stroke-dasharray="10 6"/>');
    s.add('<line x1="630" y1="160" x2="630" y2="400" stroke="#3f4a2c" stroke-width="3" stroke-dasharray="10 6"/>');
    pines(s, 150, 20, 290, 9, 26, "#3f5a2e");
    pines(s, 160, 670, 950, 9, 26, "#3f5a2e");
};
SCENES.kivrim = function (s) {
    sky(s, "#6fb4e0", "#d8eef8");
    peak(s, 300, 60, 260, 210, "#6b7c8f", "#f4f7fb", "#566577");
    peak(s, 620, 40, 260, 250, "#5f7083", "#ffffff", "#4c5b6c");
    peak(s, 860, 90, 260, 180, "#6b7c8f", "#f4f7fb", "#566577");
    // kıvrımlı tabakalar
    var cols = ["#b98b5e", "#d4a874", "#9c7048", "#e2bf8b", "#a87a50"];
    for (var i = 0; i < 5; i++) {
        var y = 250 + i * 30;
        var d = "M-10," + y;
        for (var x = 0; x <= W + 40; x += 40) {
            d += " Q" + (x + 20) + "," + (y - 46 + (x % 80 === 0 ? 0 : 92)) + " " + (x + 40) + "," + y;
        }
        d += " L" + (W + 10) + "," + H + " L-10," + H + "Z";
        s.add('<path d="' + d + '" fill="' + cols[i] + '"/>');
    }
};
SCENES.masif = function (s) {
    sky(s, "#9fd0ea", "#eef7f0");
    sun(s, 140, 90, 20, "#fff7da");
    layer(s, 210, 40, "#8fb59a", { freq: 0.6 });
    layer(s, 260, 50, "#5f9472", { freq: 0.55 });
    layer(s, 310, 40, "#3f7a55", { freq: 0.6 });
    for (var i = 0; i < 70; i++) bush(s, s.r() * W, 300 + s.r() * 100, 8 + s.r() * 8, ["#2f6644", "#3c7650", "#285a3b"][i % 3]);
    // eski, aşınmış kayaç: granit kubbe
    s.add('<path d="M560,250 C590,170 720,160 760,250 Z" fill="#b8b1a6"/>');
    s.add('<path d="M660,175 C720,180 750,210 760,250 L660,250Z" fill="#9c958a"/>');
};
SCENES.fay = function (s) {
    sky(s, "#a7c8de", "#f2e6d2");
    layer(s, 170, 20, "#a9b38f");
    // kayma: tarlalar fay boyunca ötelenmiş
    s.add('<polygon points="0,210 960,180 960,400 0,400" fill="#c9b27a"/>');
    var cols = ["#b5c46e", "#d9c97f", "#9fb35d", "#e3d391"];
    for (var i = 0; i < 8; i++) {
        var x = i * 120;
        s.add('<polygon points="' + x + "," + (210 - i * 4) + " " + (x + 110) + "," + (206 - i * 4) + " " + (x + 70) + "," + 300 + " " + (x - 40) + "," + 300 + '" fill="' + cols[i % 4] + '"/>');
        s.add('<polygon points="' + (x - 70) + ",310 " + (x + 40) + ",310 " + (x - 10) + ",400 " + (x - 120) + ',400" fill="' + cols[(i + 1) % 4] + '"/>');
    }
    // fay yarığı
    s.add('<path d="M-10,300 L120,306 L180,298 L300,308 L380,300 L520,310 L600,302 L720,309 L820,301 L970,306 L970,316 L820,311 L720,319 L600,312 L520,320 L380,310 L300,318 L180,308 L120,316 L-10,310Z" fill="#3b2a1e"/>');
    // yol ötelenmesi
    s.add('<rect x="610" y="190" width="22" height="112" fill="#6f6a63"/><rect x="560" y="316" width="22" height="90" fill="#6f6a63"/>');
};
SCENES["deprem-az"] = function (s) {
    sky(s, "#7fc0ea", "#fff3cf");
    sun(s, 760, 90, 28, "#fff0b3", "#ffd76a");
    layer(s, 220, 6, "#a7c98a");
    fields(s, 225, ["#f2c230", "#e5b21e", "#f7d14a"], 480, 18);
    for (var i = 0; i < 46; i++) {
        var y = 300 + s.r() * 100;
        var x = s.r() * W;
        var k = (y - 240) / 160;
        s.add('<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(16 * k) + '" fill="#ffd23f"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(7 * k) + '" fill="#6b3e1d"/>');
    }
    s.add('<g transform="translate(250,214)"><rect x="-2" y="-34" width="4" height="34" fill="#8a8f96"/><polygon points="0,-34 -26,-30 0,-38" fill="#e8e8e8"/><polygon points="0,-34 22,-48 2,-36" fill="#e8e8e8"/><polygon points="0,-34 8,-6 -2,-32" fill="#e8e8e8"/></g>');
};
SCENES["plato-karst"] = function (s) {
    sky(s, "#79b9e3", "#e9f3f6");
    cloud(s, 300, 80, 0.8);
    s.add('<polygon points="0,170 380,160 400,175 400,400 0,400" fill="#d8d2c4"/>');
    s.add('<polygon points="560,175 960,165 960,400 540,400" fill="#d8d2c4"/>');
    s.add('<polygon points="400,175 450,260 470,400 400,400" fill="#a99f8c"/>');
    s.add('<polygon points="560,175 520,260 500,400 540,400" fill="#bdb3a0"/>');
    s.add('<polygon points="450,260 520,260 500,400 470,400" fill="#6d8f5a"/>');
    s.add('<path d="M470,400 C480,340 495,300 488,262" stroke="#5aa9d6" stroke-width="6" fill="none"/>');
    [200, 240, 290, 340].forEach(function (y) {
        s.add('<line x1="0" y1="' + y + '" x2="400" y2="' + (y - 4) + '" stroke="#bfb7a6" stroke-width="2"/>');
        s.add('<line x1="545" y1="' + y + '" x2="960" y2="' + (y - 4) + '" stroke="#bfb7a6" stroke-width="2"/>');
    });
    for (var i = 0; i < 26; i++) bush(s, s.r() * 380, 170 + s.r() * 12, 5 + s.r() * 4, "#6f8a52");
    for (var j = 0; j < 26; j++) bush(s, 570 + s.r() * 380, 170 + s.r() * 12, 5 + s.r() * 4, "#6f8a52");
    s.add('<ellipse cx="200" cy="215" rx="34" ry="8" fill="#9a907c"/><ellipse cx="760" cy="230" rx="26" ry="6" fill="#9a907c"/>');
};
SCENES["plato-volkan"] = function (s) {
    sky(s, "#6f9fcf", "#e6eef2");
    peak(s, 760, 70, 200, 160, "#5b5560", "#f3f3f5", "#4a454f");
    s.add('<polygon points="0,200 960,195 960,400 0,400" fill="#6f7a52"/>');
    s.add('<polygon points="0,200 960,195 960,215 0,222" fill="#88935f"/>');
    // bazalt sütunları
    for (var x = 0; x < W; x += 16) {
        var h = 70 + s.r() * 20;
        s.add('<rect x="' + x + '" y="230" width="14" height="' + f(h) + '" fill="' + (x % 32 ? "#3a3640" : "#46414c") + '"/>');
    }
    s.add('<polygon points="0,225 960,218 960,235 0,240" fill="#55603f"/>');
    layer(s, 330, 8, "#2b2830");
};
SCENES["plato-asinim"] = function (s) {
    sky(s, "#7cbbe6", "#f8ecd0");
    sun(s, 820, 90, 24, "#fff3cf", "#ffd98a");
    // dümdüz aşınmış yüzey, üzerinde sertliği nedeniyle kalmış tepeler
    s.add('<polygon points="0,210 960,205 960,400 0,400" fill="#d6c28a"/>');
    s.add('<path d="M300,210 C330,150 400,150 430,208Z" fill="#a58d5c"/>');
    s.add('<path d="M640,206 C660,170 700,168 720,205Z" fill="#b39a68"/>');
    s.add('<polygon points="0,212 960,207 960,222 0,228" fill="#c4ae74"/>');
    fields(s, 228, ["#e1cf8f", "#cdb876", "#ead9a0", "#bfa968"], 520, 16);
    s.add('<path d="M560,228 C540,300 470,360 380,400" stroke="#8a7a5c" stroke-width="10" fill="none"/>');
    house(s, 610, 236, 0.7, "#f1e9d8", "#b5573a");
    house(s, 640, 238, 0.6, "#f1e9d8", "#b5573a");
};
SCENES["plato-tabaka"] = function (s) {
    sky(s, "#e7a76b", "#fbe6c4");
    sun(s, 800, 110, 26, "#fff2cf", "#ffc27a");
    var bands = ["#c98a55", "#e2ad73", "#b8764a", "#d99d64", "#a8683f"];
    s.add('<polygon points="250,140 760,140 800,400 210,400" fill="#c98a55"/>');
    bands.forEach(function (c, i) {
        var y = 140 + i * 40;
        s.add('<polygon points="' + (250 - i * 6) + "," + y + " " + (760 + i * 6) + "," + y + " " + (766 + i * 6) + "," + (y + 40) + " " + (244 - i * 6) + "," + (y + 40) + '" fill="' + c + '"/>');
    });
    s.add('<rect x="250" y="134" width="510" height="8" fill="#9a7a4a"/>');
    s.add('<polygon points="0,300 960,290 960,400 0,400" fill="#d9b884"/>');
    s.add('<polygon points="0,300 120,240 200,300" fill="#c28452"/><polygon points="840,290 900,250 960,292" fill="#c28452"/>');
};
SCENES.delta = function (s) {
    sky(s, "#7cc0ea", "#e7f6f7");
    cloud(s, 760, 70, 0.9);
    layer(s, 200, 10, "#6fa86a");
    waterRect(s, 205, 195, "#4aa3cf", "#2c7fae");
    // delta yelpazesi
    s.add('<path d="M300,400 C320,300 420,240 520,230 C620,240 720,300 760,400Z" fill="#8cc06a"/>');
    s.add('<path d="M330,400 C350,320 430,270 520,262 C610,270 690,320 730,400Z" fill="#a7d07d"/>');
    s.add('<path d="M520,400 L520,250 M520,320 C480,290 430,270 400,262 M520,320 C560,290 610,272 650,262 M520,360 C470,340 420,330 360,322 M520,360 C580,345 630,335 690,330" stroke="#4aa3cf" stroke-width="7" fill="none" stroke-linecap="round"/>');
    for (var i = 0; i < 18; i++) bush(s, 380 + s.r() * 280, 300 + s.r() * 90, 4 + s.r() * 3, "#5e9a48");
};
SCENES["ova-karst"] = function (s) {
    sky(s, "#8bc6ea", "#f2f4e8");
    peak(s, 120, 110, 260, 200, "#c9c3b4", null, "#b2ab9b");
    peak(s, 840, 100, 260, 220, "#c9c3b4", null, "#b2ab9b");
    peak(s, 480, 150, 230, 160, "#d6d0c2", null, "#c1baa9");
    s.add('<rect x="0" y="250" width="960" height="150" fill="#b8b19f"/>');
    s.add('<ellipse cx="480" cy="335" rx="440" ry="80" fill="#8fbf5c"/>');
    for (var i = 0; i < 7; i++) s.add('<rect x="' + (170 + i * 90) + '" y="' + (290 + (i % 2) * 18) + '" width="80" height="30" fill="' + ["#a8cf6c", "#c3da7f", "#7fb352"][i % 3] + '" transform="skewX(-12)"/>');
    s.add('<ellipse cx="700" cy="350" rx="38" ry="12" fill="#3d6b8a"/><ellipse cx="700" cy="348" rx="30" ry="8" fill="#5aa9d6"/>');
    s.add('<path d="M240,330 C360,345 520,320 690,348" stroke="#5aa9d6" stroke-width="4" fill="none"/>');
};
SCENES["ova-tektonik"] = function (s) {
    sky(s, "#76b6e3", "#e7f2f5");
    peak(s, 220, 50, 230, 260, "#61768a", "#ffffff", "#4f6274");
    peak(s, 520, 110, 230, 180, "#6f8396", "#f1f5f9", "#5c7083");
    s.add('<polygon points="0,230 960,222 960,400 0,400" fill="#9fc46a"/>');
    fields(s, 232, ["#b9d47a", "#8db758", "#cfd98c", "#a3c46b"], 520, 16);
    for (var i = 0; i < 8; i++) house(s, 600 + i * 34 + s.r() * 10, 250 + s.r() * 8, 0.7, "#f1ede4", "#c9563c");
    s.add('<line x1="0" y1="232" x2="960" y2="222" stroke="#4f5f3a" stroke-width="2" stroke-dasharray="12 8"/>');
};
SCENES["ova-volkan"] = function (s) {
    sky(s, "#7fb9e4", "#f1e6d6");
    peak(s, 620, 40, 250, 260, "#6e6670", "#ffffff", "#5c5560");
    s.add('<polygon points="0,250 960,244 960,400 0,400" fill="#c8b07a"/>');
    fields(s, 250, ["#d8c27f", "#bfa766", "#e6d394", "#a99a5c"], 600, 14);
    for (var i = 0; i < 12; i++) house(s, 80 + i * 26, 262 + s.r() * 6, 0.65, "#e8e1d4", "#9a5a3c");
};
SCENES["ova-asinim"] = function (s) {
    sky(s, "#7cc0ea", "#f6efdc");
    sun(s, 820, 90, 22, "#fff3cf");
    peak(s, 220, 60, 230, 240, "#7d8a64", "#f3f5ef", "#6b7754");
    peak(s, 560, 80, 230, 220, "#86936b", "#f3f5ef", "#73805a");
    s.add('<polygon points="0,228 960,222 960,400 0,400" fill="#b9c77c"/>');
    // dağ eteğinden ovaya açılan birikinti yelpazeleri
    [[220, 230], [560, 228]].forEach(function (p) {
        s.add('<path d="M' + p[0] + "," + p[1] + " C" + (p[0] - 60) + "," + (p[1] + 30) + " " + (p[0] - 150) + "," + (p[1] + 60) + " " + (p[0] - 170) + "," + (p[1] + 70) + " Q" + p[0] + "," + (p[1] + 110) + " " + (p[0] + 170) + "," + (p[1] + 70) + " C" + (p[0] + 150) + "," + (p[1] + 60) + " " + (p[0] + 60) + "," + (p[1] + 30) + " " + p[0] + "," + p[1] + 'Z" fill="#dccf93"/>');
        s.add('<path d="M' + p[0] + "," + p[1] + " C" + (p[0] - 10) + "," + (p[1] + 40) + " " + (p[0] + 20) + "," + (p[1] + 70) + " " + p[0] + "," + (p[1] + 96) + '" stroke="#6fb3d9" stroke-width="4" fill="none"/>');
    });
    for (var i = 0; i < 10; i++) s.add('<rect x="' + (40 + i * 92) + '" y="' + (336 + (i % 2) * 18) + '" width="84" height="26" fill="' + ["#a9c46a", "#c7d482", "#93b35a"][i % 3] + '"/>');
};
SCENES.karst = function (s) {
    sky(s, "#6fbdea", "#eaf6fb");
    cloud(s, 200, 70, 0.8);
    layer(s, 150, 24, "#8fb27a");
    s.add('<path d="M0,170 C240,150 520,140 960,175 L960,400 L0,400Z" fill="#ece9df"/>');
    // basamak basamak traverten havuzları
    var rows = [[190, 0.95], [228, 1], [268, 1.05], [310, 1.1], [354, 1.15]];
    rows.forEach(function (row, ri) {
        var y = row[0];
        var x = 30 + ri * 14;
        while (x < W - 20) {
            var w = 90 + s.r() * 70;
            var h = 30 * row[1];
            s.add('<path d="M' + f(x) + "," + f(y) + " Q" + f(x + w / 2) + "," + f(y + 10) + " " + f(x + w) + "," + f(y) + " L" + f(x + w - 6) + "," + f(y + h) + " Q" + f(x + w / 2) + "," + f(y + h + 12) + " " + f(x + 6) + "," + f(y + h) + 'Z" fill="#ffffff"/>');
            s.add('<ellipse cx="' + f(x + w / 2) + '" cy="' + f(y + 7) + '" rx="' + f(w / 2 - 8) + '" ry="7" fill="' + ["#5fd3e0", "#7fdde6", "#4cc6d6"][(ri + Math.round(x)) % 3] + '"/>');
            s.add('<path d="M' + f(x + 10) + "," + f(y + 16) + " Q" + f(x + w / 2) + "," + f(y + 26) + " " + f(x + w - 10) + "," + f(y + 16) + '" stroke="#e3e1d8" stroke-width="2" fill="none"/>');
            x += w + 4;
        }
    });
};
SCENES.akarsu = function (s) {
    sky(s, "#7cbbe6", "#eef6f2");
    sun(s, 160, 80, 20, "#fff6d6");
    layer(s, 180, 30, "#7aa36a");
    layer(s, 230, 26, "#94b874");
    s.add('<polygon points="0,250 960,240 960,400 0,400" fill="#a9cc82"/>');
    s.add('<path d="M560,240 C520,262 640,280 580,300 C500,326 700,340 600,370 C540,388 620,400 600,410" stroke="#3f97c9" stroke-width="26" fill="none" stroke-linecap="round"/>');
    s.add('<path d="M560,240 C520,262 640,280 580,300 C500,326 700,340 600,370 C540,388 620,400 600,410" stroke="#7cc4e6" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.7"/>');
    pines(s, 300, 40, 420, 10, 34, "#4d7a3f", 30);
    pines(s, 300, 700, 940, 7, 34, "#4d7a3f", 30);
};
SCENES.goller = function (s) {
    sky(s, "#6eaee0", "#d9ecf6");
    peak(s, 640, 70, 230, 230, "#6b7b8c", "#ffffff", "#596878");
    layer(s, 230, 14, "#7d9c72");
    waterRect(s, 240, 160, "#3a8fc4", "#1f6c9e");
    s.add('<polygon points="410,240 870,240 690,330 630,330" fill="#5a7d97" opacity="0.4"/>');
    s.add('<polygon points="600,240 680,240 650,300" fill="#ffffff" opacity="0.25"/>');
};
SCENES.havza = function (s) {
    sky(s, "#7cc2ec", "#fbf3e2");
    sun(s, 800, 80, 24, "#fffbe6");
    peak(s, 120, 110, 240, 200, "#b99a72", null, "#a3865f");
    peak(s, 860, 100, 240, 220, "#b99a72", null, "#a3865f");
    layer(s, 230, 14, "#cfb183");
    s.add('<rect x="0" y="250" width="960" height="150" fill="#d9be8c"/>');
    s.add('<ellipse cx="480" cy="320" rx="470" ry="74" fill="#f4efe6"/>');
    s.add('<ellipse cx="480" cy="322" rx="400" ry="56" fill="#ffffff"/>');
    s.add('<ellipse cx="560" cy="326" rx="180" ry="22" fill="#f6c9d3"/>');
    s.add('<ellipse cx="360" cy="318" rx="120" ry="14" fill="#cdeef5"/>');
};
SCENES.kiyi = function (s) {
    sky(s, "#5fb0e6", "#dff3fb");
    cloud(s, 760, 70, 0.9);
    waterRect(s, 200, 200, "#2bb3c9", "#1576a8");
    s.add('<path d="M0,170 C120,160 220,200 260,260 C280,300 240,360 300,400 L0,400Z" fill="#6e9a54"/>');
    s.add('<path d="M240,250 C270,300 230,360 290,400 L250,400 C210,360 240,300 220,262Z" fill="#c9a77a"/>');
    s.add('<path d="M960,160 C860,170 760,190 720,240 C700,270 760,300 700,330 C660,350 740,380 760,400 L960,400Z" fill="#577f45"/>');
    s.add('<path d="M720,240 C700,270 760,300 700,330 C680,345 700,370 730,400 L700,400 C670,370 660,345 690,325 C740,300 690,270 710,238Z" fill="#a9895f"/>');
    s.add('<path d="M300,330 C380,310 420,300 520,310" stroke="#e6fbff" stroke-width="3" fill="none" opacity="0.7"/>');
    s.add('<g transform="translate(520,300)"><polygon points="-26,0 26,0 18,10 -18,10" fill="#ffffff"/><polygon points="0,-34 0,-2 22,-2" fill="#ffffff"/><rect x="-1" y="-36" width="2" height="36" fill="#475569"/></g>');
};
SCENES.gecit = function (s) {
    sky(s, "#78b6e4", "#f3e7d8");
    sun(s, 480, 140, 24, "#fff1cf", "#ffc98a");
    peak(s, 200, 50, 300, 260, "#6d7f6a", "#f2f5f2", "#5a6b57");
    peak(s, 780, 40, 300, 280, "#6d7f6a", "#f2f5f2", "#5a6b57");
    s.add('<polygon points="0,300 960,300 960,400 0,400" fill="#7a9a63"/>');
    s.add('<path d="M430,400 C470,360 420,330 470,300 C510,280 450,250 480,214" stroke="#4b4f55" stroke-width="20" fill="none" stroke-linecap="round"/>');
    s.add('<path d="M430,400 C470,360 420,330 470,300 C510,280 450,250 480,214" stroke="#f8e27a" stroke-width="2" stroke-dasharray="10 10" fill="none"/>');
    pines(s, 330, 20, 330, 9, 40, "#3f5a35", 40);
    pines(s, 330, 600, 940, 9, 40, "#3f5a35", 40);
};
SCENES.yagis = function (s) {
    sky(s, "#5d7488", "#b7c7d1");
    cloud(s, 260, 70, 1.6, "#3f5263", 0.95);
    cloud(s, 640, 60, 1.9, "#475b6d", 0.95);
    cloud(s, 880, 90, 1.3, "#3f5263", 0.95);
    for (var i = 0; i < 90; i++) {
        var x = s.r() * W;
        var y = 100 + s.r() * 220;
        s.add('<line x1="' + f(x) + '" y1="' + f(y) + '" x2="' + f(x - 8) + '" y2="' + f(y + 22) + '" stroke="#dbe8f2" stroke-width="2" opacity="0.6"/>');
    }
    layer(s, 260, 50, "#3f7a4a", { freq: 0.8 });
    layer(s, 320, 30, "#2f6a3c");
    for (var j = 0; j < 40; j++) pine(s, s.r() * W, 320 + s.r() * 80, 26 + s.r() * 18, "#245632");
};
SCENES.mikro = function (s) {
    sky(s, "#6fb9e8", "#f6efd4");
    sun(s, 480, 90, 26, "#fff3c4", "#ffd97a");
    peak(s, 120, 40, 300, 220, "#6f8a6a", "#f5f7f5", "#5c7658");
    peak(s, 860, 40, 300, 220, "#6f8a6a", "#f5f7f5", "#5c7658");
    s.add('<rect x="0" y="296" width="960" height="104" fill="#6f9a52"/>');
    s.add('<polygon points="250,300 710,300 760,400 200,400" fill="#9cc56d"/>');
    // çay teraslar / narenciye
    for (var r = 0; r < 4; r++) {
        for (var i = 0; i < 12; i++) bush(s, 260 + i * 40 + r * 6, 318 + r * 22, 11, ["#3f8a46", "#4f9a50"][r % 2]);
    }
    for (var k = 0; k < 10; k++) {
        var x = 300 + k * 40;
        bush(s, x, 312 + (k % 3) * 22, 3, "#ff9f1c");
    }
};
SCENES.bitki = function (s) {
    sky(s, "#8ccbe8", "#eef7ec");
    sun(s, 820, 80, 20, "#fff9e0");
    layer(s, 170, 30, "#8fb38b");
    for (var i = 0; i < 30; i++) pine(s, s.r() * W, 230 + s.r() * 20, 50 + s.r() * 30, "#6c9a6a");
    for (var j = 0; j < 26; j++) pine(s, s.r() * W, 300 + s.r() * 20, 70 + s.r() * 40, "#3e7348");
    for (var k = 0; k < 14; k++) {
        var x = s.r() * W;
        s.add('<rect x="' + f(x - 3) + '" y="330" width="6" height="70" fill="#6b4a32"/>');
        bush(s, x, 330, 34 + s.r() * 10, ["#2e5e38", "#376b40"][k % 2]);
    }
};
SCENES.toprak = function (s) {
    sky(s, "#88c4ea", "#f1f6ea");
    sun(s, 820, 70, 20, "#fff7d6");
    s.add('<rect x="0" y="150" width="960" height="30" fill="#6f9a4c"/>');
    for (var i = 0; i < 40; i++) s.add('<line x1="' + f(i * 24 + 8) + '" y1="150" x2="' + f(i * 24 + 14) + '" y2="' + f(124 + s.r() * 12) + '" stroke="#5e8a3e" stroke-width="4"/>');
    var hz = [["#4a3221", 180, 50], ["#8a3a24", 230, 70], ["#b9542f", 300, 50], ["#d0a06c", 350, 50]];
    hz.forEach(function (h) {
        var d = "M0," + h[1];
        for (var x = 0; x <= W; x += 40) d += " L" + x + "," + f(h[1] + Math.sin(x / 60) * 5);
        d += " L960,400 L0,400Z";
        s.add('<path d="' + d + '" fill="' + h[0] + '"/>');
    });
    for (var j = 0; j < 40; j++) s.add('<ellipse cx="' + f(s.r() * W) + '" cy="' + f(240 + s.r() * 150) + '" rx="' + f(4 + s.r() * 8) + '" ry="' + f(3 + s.r() * 4) + '" fill="#e8d8c0" opacity="0.5"/>');
    s.add('<path d="M560,180 C570,220 540,250 560,300 M560,220 C590,240 600,260 620,262 M560,250 C530,270 520,280 500,284" stroke="#e8d3b0" stroke-width="3" fill="none" opacity="0.7"/>');
};
SCENES.tarim = function (s) {
    sky(s, "#7ec0ea", "#fff1cf");
    sun(s, 160, 90, 26, "#fff2c4", "#ffd47a");
    layer(s, 200, 10, "#9fbf72");
    fields(s, 210, ["#f1c64a", "#e3b23a", "#f6d66e", "#d9a42e"], 600, 20);
    s.add('<g transform="translate(640,250)"><rect x="-30" y="-24" width="44" height="22" rx="4" fill="#d93a2b"/><rect x="2" y="-40" width="20" height="18" rx="2" fill="#2f3a45"/><circle cx="-18" cy="0" r="9" fill="#2b2b2b"/><circle cx="14" cy="-2" r="13" fill="#2b2b2b"/></g>');
};
SCENES.hayvan = function (s) {
    sky(s, "#79bde8", "#eef6e6");
    peak(s, 260, 60, 220, 230, "#7a8a7a", "#f5f7f5", "#687868");
    peak(s, 700, 80, 220, 220, "#7a8a7a", "#f5f7f5", "#687868");
    layer(s, 230, 16, "#87b660");
    layer(s, 290, 10, "#9cc66e");
    for (var i = 0; i < 34; i++) {
        var x = 120 + s.r() * 720;
        var y = 280 + s.r() * 100;
        var k = 0.6 + (y - 280) / 160;
        s.add('<g transform="translate(' + f(x) + "," + f(y) + ") scale(" + f(k) + ')"><ellipse cx="0" cy="0" rx="14" ry="9" fill="#f7f4ee"/><ellipse cx="13" cy="-3" rx="5" ry="4" fill="#3b3b3b"/><rect x="-8" y="6" width="3" height="8" fill="#3b3b3b"/><rect x="5" y="6" width="3" height="8" fill="#3b3b3b"/></g>');
    }
};
SCENES["nufus-seyrek"] = function (s) {
    sky(s, "#7fb8e2", "#f6e6c8");
    sun(s, 760, 100, 24, "#fff1cf", "#ffc98a");
    layer(s, 230, 30, "#9b8a6a", { freq: 0.6 });
    layer(s, 270, 16, "#c2a878", { freq: 0.5 });
    s.add('<polygon points="0,300 960,295 960,400 0,400" fill="#d4bd8b"/>');
    house(s, 600, 300, 1.4, "#efe6d4", "#a14e33");
    s.add('<path d="M0,370 C200,350 400,340 600,302" stroke="#b49a6c" stroke-width="5" fill="none"/>');
    for (var i = 0; i < 12; i++) bush(s, s.r() * W, 320 + s.r() * 70, 3 + s.r() * 3, "#9a8a52");
};
SCENES["nufus-yogun"] = function (s) {
    sky(s, "#f3a46b", "#fde7c9", "#f6c58f");
    sun(s, 200, 150, 30, "#fff1cf", "#ffbf7a");
    var x = 0;
    while (x < W) {
        var w = 30 + s.r() * 40;
        var h = 80 + s.r() * 170;
        s.add('<rect x="' + f(x) + '" y="' + f(330 - h) + '" width="' + f(w) + '" height="' + f(h + 80) + '" fill="' + ["#5b4a63", "#6a5672", "#4c3d55"][Math.floor(s.r() * 3)] + '"/>');
        for (var wy = 330 - h + 10; wy < 320; wy += 16) {
            for (var wx = x + 5; wx < x + w - 8; wx += 10) if (s.r() > 0.45) s.add('<rect x="' + f(wx) + '" y="' + f(wy) + '" width="5" height="7" fill="#ffd98a" opacity="0.85"/>');
        }
        x += w + 2;
    }
    // cami silüeti
    s.add('<g fill="#3c2f44"><path d="M620,330 L620,280 Q680,220 740,280 L740,330Z"/><rect x="600" y="200" width="8" height="130"/><polygon points="600,200 604,180 608,200"/><rect x="752" y="200" width="8" height="130"/><polygon points="752,200 756,180 760,200"/></g>');
    s.add('<rect x="0" y="330" width="960" height="70" fill="#2f3e5c"/>');
    for (var i = 0; i < 20; i++) s.add('<rect x="' + f(s.r() * W) + '" y="' + f(340 + s.r() * 50) + '" width="' + f(20 + s.r() * 40) + '" height="2" fill="#ffd98a" opacity="0.4"/>');
};
SCENES.demiryolu = function (s) {
    sky(s, "#7db8e2", "#eaf2ee");
    peak(s, 200, 40, 300, 260, "#5f7a66", "#f3f6f3", "#4e6754");
    peak(s, 560, 70, 300, 220, "#6a856f", "#f3f6f3", "#58725c");
    peak(s, 860, 50, 300, 230, "#5f7a66", "#f3f6f3", "#4e6754");
    s.add('<polygon points="0,300 960,300 960,400 0,400" fill="#7f9d66"/>');
    // biten ray hattı ve bariyer
    s.add('<polygon points="40,400 130,400 460,300 430,300" fill="#a39684"/>');
    for (var i = 0; i < 10; i++) {
        var t = i / 10;
        var y = 400 - t * 100;
        var x0 = 40 + t * 390;
        var x1 = 130 + t * 330;
        s.add('<line x1="' + f(x0) + '" y1="' + f(y) + '" x2="' + f(x1) + '" y2="' + f(y) + '" stroke="#6b4b33" stroke-width="' + f(6 - t * 4) + '"/>');
    }
    s.add('<line x1="60" y1="400" x2="438" y2="300" stroke="#8a8f96" stroke-width="4"/><line x1="112" y1="400" x2="452" y2="300" stroke="#8a8f96" stroke-width="4"/>');
    s.add('<g transform="translate(445,300)"><rect x="-22" y="-26" width="44" height="10" fill="#ffffff"/><rect x="-22" y="-26" width="11" height="10" fill="#e11d48"/><rect x="0" y="-26" width="11" height="10" fill="#e11d48"/><rect x="-20" y="-16" width="4" height="16" fill="#555"/><rect x="16" y="-16" width="4" height="16" fill="#555"/></g>');
    s.add('<path d="M600,400 C640,370 700,350 760,330 C820,312 860,320 960,300" stroke="#55575c" stroke-width="16" fill="none"/>');
    s.add('<path d="M600,400 C640,370 700,350 760,330 C820,312 860,320 960,300" stroke="#f8e27a" stroke-width="2" stroke-dasharray="10 10" fill="none"/>');
};
SCENES.liman = function (s) {
    sky(s, "#78b9e6", "#eef5f8");
    cloud(s, 200, 70, 0.9);
    waterRect(s, 260, 140, "#2f86b8", "#1d5f88");
    s.add('<rect x="0" y="240" width="560" height="26" fill="#9aa3ad"/>');
    var cc = ["#e4572e", "#2e86ab", "#f3a712", "#29bf12", "#a23b72", "#3d5a80"];
    for (var r = 0; r < 3; r++) for (var i = 0; i < 12; i++) s.add('<rect x="' + (40 + i * 40) + '" y="' + (226 - r * 16) + '" width="38" height="15" fill="' + cc[(i + r * 2) % cc.length] + '"/>');
    // vinçler
    [140, 360].forEach(function (x) {
        s.add('<g fill="none" stroke="#f2b134" stroke-width="6"><path d="M' + x + ",240 L" + x + ",90 L" + (x + 40) + ",90 L" + (x + 40) + ',240"/><path d="M' + (x - 60) + ",100 L" + (x + 170) + ',100"/></g>');
        s.add('<line x1="' + (x + 150) + '" y1="100" x2="' + (x + 150) + '" y2="190" stroke="#334155" stroke-width="2"/>');
    });
    // gemi
    s.add('<g transform="translate(720,280)"><path d="M-170,0 L170,0 L140,40 L-150,40Z" fill="#26374d"/><rect x="-150" y="-30" width="220" height="30" fill="#c0392b"/><rect x="-150" y="-30" width="60" height="30" fill="#2e86ab"/><rect x="-80" y="-30" width="60" height="30" fill="#f3a712"/><rect x="90" y="-60" width="50" height="60" fill="#f1f5f9"/><rect x="100" y="-50" width="30" height="8" fill="#334155"/></g>');
};
SCENES.maden = function (s) {
    sky(s, "#86bfe6", "#f2e8d8");
    sun(s, 160, 80, 20, "#fff6d6");
    layer(s, 160, 20, "#9c8a6f");
    var cols = ["#b98a5c", "#a7764a", "#c99a68", "#94683f", "#b07c4e", "#8a5e38"];
    for (var i = 0; i < 6; i++) {
        var rx = 470 - i * 66;
        var ry = 150 - i * 20;
        s.add('<ellipse cx="480" cy="' + (300 + i * 6) + '" rx="' + rx + '" ry="' + ry + '" fill="' + cols[i] + '"/>');
        s.add('<ellipse cx="480" cy="' + (300 + i * 6) + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="#e1c39a" stroke-width="2" opacity="0.6"/>');
    }
    s.add('<ellipse cx="480" cy="340" rx="80" ry="22" fill="#4f7f8f"/>');
    s.add('<g transform="translate(640,250)"><rect x="-30" y="-22" width="44" height="20" fill="#f2b134"/><rect x="14" y="-30" width="18" height="28" fill="#f2b134"/><rect x="18" y="-26" width="10" height="8" fill="#334155"/><circle cx="-20" cy="0" r="8" fill="#2b2b2b"/><circle cx="20" cy="0" r="8" fill="#2b2b2b"/></g>');
};
SCENES.sanayi = function (s) {
    sky(s, "#9fb2c3", "#e9e3da");
    smoke(s, 300, 130, 1.4, "#d6d3cf", 0.8);
    smoke(s, 640, 110, 1.6, "#d6d3cf", 0.8);
    s.add('<rect x="280" y="120" width="24" height="200" fill="#8b5a4a"/><rect x="280" y="140" width="24" height="10" fill="#f1f5f9"/>');
    s.add('<rect x="620" y="100" width="28" height="220" fill="#8b5a4a"/><rect x="620" y="122" width="28" height="10" fill="#f1f5f9"/>');
    var x = 40;
    for (var i = 0; i < 6; i++) {
        s.add('<path d="M' + x + ",320 L" + x + ",250 L" + (x + 50) + ",220 L" + (x + 50) + ",250 L" + (x + 100) + ",220 L" + (x + 100) + ",250 L" + (x + 140) + ",225 L" + (x + 140) + ',320Z" fill="' + ["#5b6b7d", "#4f5e6f"][i % 2] + '"/>');
        x += 150;
    }
    s.add('<g fill="#9fb5c9"><circle cx="760" cy="270" r="44"/><rect x="716" y="270" width="88" height="50"/></g>');
    s.add('<rect x="0" y="320" width="960" height="80" fill="#4a5563"/>');
    s.add('<rect x="0" y="352" width="960" height="4" fill="#e2e8f0" opacity="0.5"/>');
};
SCENES.boru = function (s) {
    sky(s, "#80bce6", "#f4ead8");
    sun(s, 800, 90, 22, "#fff3cf");
    layer(s, 200, 30, "#b8a57a", { freq: 0.6 });
    layer(s, 250, 16, "#cdb88a");
    s.add('<polygon points="0,290 960,280 960,400 0,400" fill="#d9c596"/>');
    // boru hattı
    s.add('<path d="M-10,350 C200,330 400,300 600,290 C760,282 860,250 980,230" stroke="#6b7480" stroke-width="22" fill="none"/>');
    s.add('<path d="M-10,344 C200,324 400,294 600,284 C760,276 860,244 980,224" stroke="#aab4be" stroke-width="5" fill="none"/>');
    [80, 240, 400, 560, 720, 860].forEach(function (px) {
        var py = px < 600 ? 350 - (px / 600) * 60 : 290 - ((px - 600) / 360) * 60;
        s.add('<rect x="' + (px - 4) + '" y="' + f(py + 10) + '" width="8" height="24" fill="#4b5563"/>');
    });
    s.add('<g transform="translate(600,270)"><rect x="-10" y="-30" width="20" height="30" fill="#e5e7eb"/><circle cx="0" cy="-30" r="12" fill="#e11d48"/></g>');
};
SCENES.hes = function (s) {
    sky(s, "#6fb3e2", "#ecf4f4");
    cloud(s, 820, 60, 0.8);
    layer(s, 150, 24, "#7d8f76");
    waterRect(s, 160, 60, "#3d93c6", "#2d7bab");
    s.add('<polygon points="0,110 230,150 260,400 0,400" fill="#6f7d68"/><polygon points="960,110 730,150 700,400 960,400" fill="#6f7d68"/>');
    s.add('<polygon points="0,110 230,150 200,400 0,400" fill="#5f6d58" opacity="0.5"/>');
    // kemer baraj gövdesi
    s.add('<path d="M230,158 Q480,190 730,158 L700,330 Q480,350 260,330Z" fill="#d4d1c8"/>');
    s.add('<path d="M230,158 Q480,190 730,158 L728,170 Q480,202 232,170Z" fill="#aeaba1"/>');
    s.add('<path d="M420,190 L540,190 L548,330 L412,330Z" fill="#8fd0ee" opacity="0.7"/>');
    for (var i = 0; i < 7; i++) s.add('<line x1="' + (436 + i * 16) + '" y1="196" x2="' + (432 + i * 16) + '" y2="328" stroke="#ffffff" stroke-width="3" opacity="0.6"/>');
    s.add('<polygon points="0,330 960,330 960,400 0,400" fill="#6f9a5a"/>');
    s.add('<path d="M412,330 C420,360 470,380 480,400 L560,400 C540,370 548,350 548,330Z" fill="#4da3d1"/>');
    s.add('<rect x="600" y="300" width="70" height="30" fill="#e5e7eb"/><rect x="608" y="306" width="54" height="6" fill="#64748b"/>');
    [790, 890].forEach(function (x) {
        s.add('<g stroke="#334155" stroke-width="3" fill="none"><path d="M' + x + ",330 L" + (x + 12) + ",220 L" + (x + 24) + ",330 M" + (x - 8) + ",244 L" + (x + 32) + ",244 M" + (x - 2) + ",270 L" + (x + 26) + ',270"/></g>');
    });
    s.add('<path d="M670,306 Q730,250 782,244 M802,244 Q850,262 882,244" stroke="#334155" stroke-width="1.5" fill="none"/>');
};
SCENES.transit = function (s) {
    sky(s, "#f0a56b", "#fde8c8", "#f6c08f");
    sun(s, 760, 160, 30, "#fff1cf", "#ffbf7a");
    layer(s, 230, 20, "#b98a6a");
    s.add('<polygon points="0,260 960,255 960,400 0,400" fill="#c9a77a"/>');
    s.add('<polygon points="380,260 580,260 960,400 0,400" fill="#4a4f57"/>');
    s.add('<polygon points="478,260 482,260 488,400 472,400" fill="#f8e27a"/>');
    // tırlar
    [[300, 340, 1.2, "#2e86ab"], [560, 300, 0.8, "#e4572e"], [430, 285, 0.6, "#f3a712"]].forEach(function (t) {
        s.add('<g transform="translate(' + t[0] + "," + t[1] + ") scale(" + t[2] + ')"><rect x="-60" y="-50" width="90" height="46" fill="' + t[3] + '"/><rect x="32" y="-40" width="32" height="36" fill="#e5e7eb"/><rect x="40" y="-34" width="18" height="12" fill="#334155"/><circle cx="-40" cy="0" r="9" fill="#1f2937"/><circle cx="10" cy="0" r="9" fill="#1f2937"/><circle cx="48" cy="0" r="9" fill="#1f2937"/></g>');
    });
    s.add('<g transform="translate(860,250)"><rect x="-4" y="-60" width="8" height="60" fill="#475569"/><rect x="-40" y="-60" width="80" height="26" fill="#1e3a8a"/><rect x="-34" y="-54" width="68" height="4" fill="#ffffff" opacity="0.8"/><rect x="-34" y="-44" width="40" height="4" fill="#ffffff" opacity="0.8"/></g>');
};
SCENES.yht = function (s) {
    sky(s, "#6fb5e6", "#eef6fb");
    cloud(s, 180, 70, 0.9);
    peak(s, 300, 110, 260, 220, "#7a8c9a", "#f4f7fa", "#687a88");
    peak(s, 720, 90, 260, 240, "#7a8c9a", "#f4f7fa", "#687a88");
    layer(s, 280, 14, "#86ad68");
    // viyadük
    s.add('<rect x="0" y="232" width="960" height="12" fill="#b9b4aa"/>');
    for (var x = 40; x < W; x += 110) s.add('<path d="M' + x + ",244 L" + (x + 14) + ",244 L" + (x + 18) + ",400 L" + (x - 4) + ',400Z" fill="#a8a296"/>');
    // tren
    s.add('<g transform="translate(140,232)"><path d="M0,0 L560,0 L640,0 C620,-20 590,-34 540,-36 L0,-36Z" fill="#f8fafc"/><rect x="0" y="-14" width="610" height="5" fill="#dc2626"/><rect x="0" y="-8" width="620" height="4" fill="#1e3a8a"/>' +
        (function () { var w = ""; for (var i = 0; i < 26; i++) w += '<rect x="' + (12 + i * 20) + '" y="-30" width="12" height="9" rx="2" fill="#1e293b"/>'; return w; })() +
        '<path d="M560,-30 C590,-30 610,-22 620,-14 L560,-14Z" fill="#1e293b"/></g>');
    s.add('<g stroke="#64748b" stroke-width="2"><line x1="0" y1="186" x2="960" y2="186"/></g>');
    for (var p = 60; p < W; p += 160) s.add('<rect x="' + p + '" y="186" width="3" height="46" fill="#64748b"/>');
};

// Kartlar çok geniş ve alçak (≈6:1); her sahnenin görünmesi gereken 240 px'lik bandının üst kenarı.
var BAND = 240;
var BAND_TOP = {
    volkanik: 40, "volkanik-arazi": 90, kirik: 100, kivrim: 110, masif: 130, fay: 150, "deprem-az": 160,
    "plato-karst": 120, "plato-volkan": 90, "plato-asinim": 130, "plato-tabaka": 120,
    delta: 160, "ova-karst": 130, "ova-tektonik": 50, "ova-volkan": 40, "ova-asinim": 90,
    karst: 150, akarsu: 160, goller: 80, havza: 140, kiyi: 150, gecit: 90,
    yagis: 90, mikro: 160, bitki: 160, toprak: 110, tarim: 150, hayvan: 160,
    "nufus-seyrek": 150, "nufus-yogun": 110, demiryolu: 150, liman: 90, maden: 150, sanayi: 110,
    boru: 150, hes: 120, transit: 150, yht: 100
};

// ---------- çıktı ----------
var ORDER = Object.keys(SCENES);
var webDir = path.join(root, "img", "map", "kart");
var mobDir = path.join(root, "mobile", "assets", "map");
fs.mkdirSync(webDir, { recursive: true });
fs.mkdirSync(mobDir, { recursive: true });

ORDER.filter(function (id) { return !process.env.ONLY || process.env.ONLY === id; }).forEach(function (id) {
    var s = new Scene(id);
    SCENES[id](s);
    var top = BAND_TOP[id] == null ? 80 : BAND_TOP[id];
    fs.writeFileSync(path.join(webDir, id + ".svg"), s.svg("0 " + top + " " + W + " " + BAND).replace('width="960" height="400"', 'width="960" height="' + BAND + '"'));
    // mobil: ortadan kare kesit
    var sq = s.svg("280 0 400 400").replace('width="960" height="400"', 'width="400" height="400"');
    var png = new Resvg(sq, { fitTo: { mode: "width", value: 192 } }).render().asPng();
    fs.writeFileSync(path.join(mobDir, id + ".png"), png);
});
console.log(ORDER.length + " kart yazıldı.");

module.exports = { SCENES: SCENES, Scene: Scene };
