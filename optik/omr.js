/**
 * Optik form: çizim ve kamera fotoğrafından okuma (saf JS; OpenCV gerekmez).
 * Web'de optik/optik.html içinde, mobilde aynı sayfa WebView'da çalışır.
 *
 * Yerleşim TEK kaynaktan gelir: optik/optik-form.json (setLayout ile verilir). Formu çizen
 * drawForm ile okuyan read aynı koordinatları kullanır; tasarım değişince okuma bozulmaz.
 *
 * Okuma hattı:
 *  1. Gri ton, küçültme.
 *  2. Uyarlamalı eşikleme (yerel ortalama; sabit eşik yok) → bağlı bileşenler → dört köşe kare.
 *  3. Perspektif dönüşümü (homografi); yön kareciği ile 180° dönüşü ayırt etme.
 *  4. Blok blok ince hizalama (baloncuk çemberlerine göre; lens bükülmesini telafi eder).
 *  5. Her baloncukta doluluk = 1 − iç parlaklık / yerel kâğıt beyazı (gölgeye dayanıklı).
 *  6. Formun kendi dağılımından eşikler: boş / işaretli / kararsız / çift işaret.
 *  7. Karekod: düzleştirilmiş karekod bölgesi jsQR'a verilir.
 */
(function (global) {
    "use strict";

    var LAYOUT = null;
    var LETTERS = ["A", "B", "C", "D", "E"];

    function setLayout(json) { LAYOUT = json; }
    function layout() {
        if (!LAYOUT) throw new Error("Optik form ayarı (optik-form.json) yüklenmedi.");
        return LAYOUT;
    }
    function questionCount() {
        return layout().columns.reduce(function (s, c) { return s + c.count; }, 0);
    }

    // Soru no (1..120) ve şık (0..4) → baloncuk merkezi (mm).
    function bubbleCenter(no, li) {
        var L = layout(), c, col;
        for (c = 0; c < L.columns.length; c++) {
            col = L.columns[c];
            if (no >= col.from && no < col.from + col.count) {
                var row = no - col.from;
                return {
                    x: col.x + L.label.w + L.bubble.d / 2 + li * L.bubble.pitchX,
                    y: col.y + L.bubble.d / 2 + row * L.bubble.pitchY,
                    col: c, row: row
                };
            }
        }
        return null;
    }

    // ---------------------------------------------------------------
    // karekod içeriği. Kâğıtta alfanümerik kip (daha iri modül, bulanık fotoğrafta da okunur):
    //   ATN:<sürüm>:<deneme 32 hex>:<kullanıcı 32 hex>:<kulvar harfi>
    // Sunucuya kanonik biçimde gider: ATN|<sürüm>|<deneme uuid>|<kullanıcı uuid>|<kulvar>
    // ---------------------------------------------------------------
    var TRACK_CODE = { lisans: "L", onlisans: "N", ortaogretim: "O" };
    function qrPayload(examId, userId, track) {
        function hex(u) { return String(u).replace(/-/g, "").toUpperCase(); }
        return ["ATN", String(layout().version), hex(examId), hex(userId), TRACK_CODE[track] || "L"].join(":");
    }
    function uuidOf(h) {
        h = String(h).toLowerCase();
        if (!/^[0-9a-f]{32}$/.test(h)) return null;
        return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
    }
    function parseQr(text) {
        var p = String(text || "").split(":");
        if (p.length !== 5 || p[0] !== "ATN") return null;
        var exam = uuidOf(p[2]), user = uuidOf(p[3]), track = null, k;
        for (k in TRACK_CODE) if (TRACK_CODE[k] === p[4]) track = k;
        if (!exam || !user || !track) return null;
        return { version: Number(p[1]), exam: exam, user: user, track: track, canonical: ["ATN", p[1], exam, user, track].join("|") };
    }

    // ---------------------------------------------------------------
    // geometri
    // ---------------------------------------------------------------
    // 4 nokta eşlemesinden homografi (h33 = 1). src, dst: [[x,y] x4]
    function solveHomography(src, dst) {
        var A = [], i, j, k;
        for (i = 0; i < 4; i++) {
            var x = src[i][0], y = src[i][1], u = dst[i][0], v = dst[i][1];
            A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
            A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
        }
        for (i = 0; i < 8; i++) {
            var piv = i;
            for (j = i + 1; j < 8; j++) if (Math.abs(A[j][i]) > Math.abs(A[piv][i])) piv = j;
            if (Math.abs(A[piv][i]) < 1e-12) return null;
            var tmp = A[i]; A[i] = A[piv]; A[piv] = tmp;
            for (j = 0; j < 8; j++) {
                if (j === i) continue;
                var f = A[j][i] / A[i][i];
                if (!f) continue;
                for (k = i; k < 9; k++) A[j][k] -= f * A[i][k];
            }
        }
        var h = [];
        for (i = 0; i < 8; i++) h.push(A[i][8] / A[i][i]);
        h.push(1);
        return h;
    }
    function applyH(H, x, y) {
        var w = H[6] * x + H[7] * y + H[8];
        return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
    }

    // ---------------------------------------------------------------
    // görüntü yardımcıları: { w, h, d: Uint8Array (gri) }
    // ---------------------------------------------------------------
    function toGray(rgba, w, h) {
        var d = new Uint8Array(w * h), i, j;
        for (i = 0, j = 0; i < d.length; i++, j += 4) d[i] = (rgba[j] * 77 + rgba[j + 1] * 150 + rgba[j + 2] * 29) >> 8;
        return { w: w, h: h, d: d };
    }
    function boxDown(img, f) {
        if (f <= 1) return img;
        var w = Math.floor(img.w / f), h = Math.floor(img.h / f), d = new Uint8Array(w * h), x, y, a, b, s, ff = f * f;
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                s = 0;
                for (b = 0; b < f; b++) {
                    var row = (y * f + b) * img.w + x * f;
                    for (a = 0; a < f; a++) s += img.d[row + a];
                }
                d[y * w + x] = (s / ff) | 0;
            }
        }
        return { w: w, h: h, d: d };
    }
    function sample(img, x, y) {
        if (x < 0) x = 0; else if (x > img.w - 1.001) x = img.w - 1.001;
        if (y < 0) y = 0; else if (y > img.h - 1.001) y = img.h - 1.001;
        var x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, i = y0 * img.w + x0, d = img.d;
        var a = d[i] + (d[i + 1] - d[i]) * fx;
        var b = d[i + img.w] + (d[i + img.w + 1] - d[i + img.w]) * fx;
        return a + (b - a) * fy;
    }
    function median(arr) {
        if (!arr.length) return 0;
        var s = arr.slice().sort(function (a, b) { return a - b; });
        var m = s.length >> 1;
        return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    }
    function percentile(arr, p) {
        var s = arr.slice().sort(function (a, b) { return a - b; });
        return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))];
    }

    // ---------------------------------------------------------------
    // 2) köşe kareleri
    // ---------------------------------------------------------------
    function findMarkerCandidates(full) {
        var f = Math.max(1, Math.ceil(Math.max(full.w, full.h) / 1000));
        var img = boxDown(full, f), w = img.w, h = img.h, d = img.d, x, y, i;
        // integral görüntü
        var W1 = w + 1, I = new Float64Array(W1 * (h + 1));
        for (y = 0; y < h; y++) {
            var rs = 0;
            for (x = 0; x < w; x++) {
                rs += d[y * w + x];
                I[(y + 1) * W1 + x + 1] = I[y * W1 + x + 1] + rs;
            }
        }
        // uyarlamalı eşik: pencere köşe karesinden büyük olmalı ki içi boş çıkmasın
        var half = Math.max(8, Math.round(Math.max(w, h) / 16));
        var bin = new Uint8Array(w * h);
        for (y = 0; y < h; y++) {
            var y0 = Math.max(0, y - half), y1 = Math.min(h, y + half + 1);
            for (x = 0; x < w; x++) {
                var x0 = Math.max(0, x - half), x1 = Math.min(w, x + half + 1);
                var sum = I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0];
                var area = (x1 - x0) * (y1 - y0);
                if (d[y * w + x] * area < sum * 0.78) bin[y * w + x] = 1;
            }
        }
        // bağlı bileşenler (8 komşu, birleşim-bul)
        var lab = new Int32Array(w * h), parent = [0], next = 1;
        function find(a) { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; }
        function union(a, b) { a = find(a); b = find(b); if (a !== b) { if (a < b) parent[b] = a; else parent[a] = b; } }
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                i = y * w + x;
                if (!bin[i]) continue;
                var l = 0, nb;
                if (x > 0 && (nb = lab[i - 1])) l = nb;
                if (y > 0) {
                    if ((nb = lab[i - w])) { if (l) union(l, nb); else l = nb; }
                    if (x > 0 && (nb = lab[i - w - 1])) { if (l) union(l, nb); else l = nb; }
                    if (x < w - 1 && (nb = lab[i - w + 1])) { if (l) union(l, nb); else l = nb; }
                }
                if (!l) { l = next++; parent.push(l); }
                lab[i] = l;
            }
        }
        var st = {};
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                i = y * w + x;
                if (!lab[i]) continue;
                var r = find(lab[i]);
                lab[i] = r;
                var s = st[r];
                if (!s) s = st[r] = { n: 0, x0: x, x1: x, y0: y, y1: y, sx: 0, sy: 0 };
                s.n++; s.sx += x; s.sy += y;
                if (x < s.x0) s.x0 = x; if (x > s.x1) s.x1 = x;
                if (y < s.y0) s.y0 = y; if (y > s.y1) s.y1 = y;
            }
        }
        var minSide = Math.min(w, h), out = [];
        Object.keys(st).forEach(function (k) {
            var s = st[k], bw = s.x1 - s.x0 + 1, bh = s.y1 - s.y0 + 1;
            if (s.n < Math.pow(minSide * 0.012, 2) || s.n > Math.pow(minSide * 0.15, 2)) return;
            if (bw / bh < 0.4 || bw / bh > 2.5) return;
            if (s.n / (bw * bh) < 0.45) return;
            if (s.x0 === 0 || s.y0 === 0 || s.x1 === w - 1 || s.y1 === h - 1) return;
            // iç bölge tamamen bu bileşene ait olmalı (karekod bulucusu gibi halkaları ele)
            var cx0 = Math.round(s.x0 + bw * 0.3), cx1 = Math.round(s.x1 - bw * 0.3);
            var cy0 = Math.round(s.y0 + bh * 0.3), cy1 = Math.round(s.y1 - bh * 0.3), own = 0, tot = 0, xx, yy;
            for (yy = cy0; yy <= cy1; yy++) for (xx = cx0; xx <= cx1; xx++) { tot++; if (lab[yy * w + xx] === +k) own++; }
            if (!tot || own / tot < 0.85) return;
            out.push({
                area: s.n * f * f,
                x: (s.sx / s.n) * f + (f - 1) / 2, y: (s.sy / s.n) * f + (f - 1) / 2,
                bx0: s.x0 * f, by0: s.y0 * f, bx1: (s.x1 + 1) * f, by1: (s.y1 + 1) * f
            });
        });
        out.sort(function (a, b) { return b.area - a.area; });
        return out.slice(0, 40).filter(function (c) { return onPaper(full, c); }).slice(0, 16)
            .map(function (c) { return refineMarker(full, c); });
    }

    // Köşe karesi beyaz kâğıdın üstündedir: içi koyu, hemen çevresi açık. Zemindeki koyu lekeleri eler.
    function onPaper(img, c) {
        var bw = c.bx1 - c.bx0, bh = c.by1 - c.by0, cx = (c.bx0 + c.bx1) / 2, cy = (c.by0 + c.by1) / 2;
        var inner = [], ring = [], k;
        for (k = 0; k < 9; k++) {
            inner.push(px(img, cx + (k % 3 - 1) * bw * 0.15, cy + (Math.floor(k / 3) - 1) * bh * 0.15));
        }
        for (k = 0; k < 24; k++) {
            var a = k * Math.PI / 12;
            ring.push(px(img, cx + Math.cos(a) * bw * 0.85, cy + Math.sin(a) * bh * 0.85));
        }
        var dark = median(inner), light = percentile(ring, 0.25);
        return light - dark > 40 && dark < light * 0.7;
    }
    function px(img, x, y) {
        x = Math.max(0, Math.min(img.w - 1, Math.round(x)));
        y = Math.max(0, Math.min(img.h - 1, Math.round(y)));
        return img.d[y * img.w + x];
    }

    // Tam çözünürlükte ağırlık merkezi: koyu/açık ortası eşikle.
    function refineMarker(img, c) {
        var bw = c.bx1 - c.bx0, bh = c.by1 - c.by0;
        var x0 = Math.max(0, Math.floor(c.bx0 - bw * 0.15)), x1 = Math.min(img.w - 1, Math.ceil(c.bx1 + bw * 0.15));
        var y0 = Math.max(0, Math.floor(c.by0 - bh * 0.15)), y1 = Math.min(img.h - 1, Math.ceil(c.by1 + bh * 0.15));
        var vals = [], x, y, step = Math.max(1, Math.round(Math.max(bw, bh) / 40));
        for (y = y0; y <= y1; y += step) for (x = x0; x <= x1; x += step) vals.push(img.d[y * img.w + x]);
        var thr = (percentile(vals, 0.08) + percentile(vals, 0.92)) / 2, sx = 0, sy = 0, n = 0;
        for (y = y0; y <= y1; y++) for (x = x0; x <= x1; x++) if (img.d[y * img.w + x] < thr) { sx += x; sy += y; n++; }
        if (n > 10) { c.x = sx / n; c.y = sy / n; }
        return c;
    }

    // Dört köşe adayları: dışbükey, sayfa oranına uygun, büyük dörtgenler.
    function quadCandidates(cands) {
        var out = [], n = Math.min(cands.length, 16), a, b, c, d;
        for (a = 0; a < n; a++) for (b = a + 1; b < n; b++) for (c = b + 1; c < n; c++) for (d = c + 1; d < n; d++) {
            var q = orderQuad([cands[a], cands[b], cands[c], cands[d]]);
            if (q) out.push(q);
        }
        out.sort(function (p, q) { return q.score - p.score; });
        return out.slice(0, 6);
    }
    function orderQuad(ps) {
        var mx = 0, my = 0, i;
        for (i = 0; i < 4; i++) { mx += ps[i].x / 4; my += ps[i].y / 4; }
        var s = ps.slice().sort(function (p, q) { return Math.atan2(p.y - my, p.x - mx) - Math.atan2(q.y - my, q.x - mx); });
        var sign = 0, area = 0;
        for (i = 0; i < 4; i++) {
            var p0 = s[i], p1 = s[(i + 1) % 4], p2 = s[(i + 2) % 4];
            var cr = (p1.x - p0.x) * (p2.y - p1.y) - (p1.y - p0.y) * (p2.x - p1.x);
            if (!sign) sign = cr > 0 ? 1 : -1; else if ((cr > 0 ? 1 : -1) !== sign) return null;
            area += p0.x * p1.y - p1.x * p0.y;
        }
        area = Math.abs(area) / 2;
        var L = [], minA = Infinity, maxA = 0;
        for (i = 0; i < 4; i++) {
            L.push(Math.hypot(s[(i + 1) % 4].x - s[i].x, s[(i + 1) % 4].y - s[i].y));
            minA = Math.min(minA, s[i].area); maxA = Math.max(maxA, s[i].area);
        }
        if (Math.min(L[0], L[2]) / Math.max(L[0], L[2]) < 0.45) return null;
        if (Math.min(L[1], L[3]) / Math.max(L[1], L[3]) < 0.45) return null;
        var A = (L[0] + L[2]) / 2, B = (L[1] + L[3]) / 2, ratio = Math.max(A, B) / Math.min(A, B);
        if (ratio < 1.12 || ratio > 2.3) return null;
        if (minA / maxA < 0.2) return null;
        // kenar uzunluğu ile kare boyutu tutarlı mı? (kısa kenar ≈ 18 kare boyu)
        var side = Math.sqrt((minA + maxA) / 2), shortSide = Math.min(A, B);
        if (shortSide / side < 8 || shortSide / side > 40) return null;
        return { pts: s, shortFirst: A < B, area: area, score: area * Math.sqrt(minA / maxA) };
    }

    // ---------------------------------------------------------------
    // 3) yön ve doğrulama
    // ---------------------------------------------------------------
    function meanAt(img, H, cx, cy, half) {
        var s = 0, n = 0, a, b;
        for (a = -2; a <= 2; a++) for (b = -2; b <= 2; b++) {
            var p = applyH(H, cx + a * half / 2, cy + b * half / 2);
            s += sample(img, p[0], p[1]); n++;
        }
        return s / n;
    }
    function orientFit(img, q) {
        var L = layout(), M = L.marker.centers, P = L.page, O = L.orient;
        var starts = q.shortFirst ? [0, 2] : [1, 3], best = null;
        var whites = [[6, 150], [204, 150], [100, 12], [100, 289], [55, 289], [150, 289], [60, 12], [6, 60], [204, 240]];
        starts.forEach(function (k) {
            var dst = [], i;
            for (i = 0; i < 4; i++) { var p = q.pts[(k + i) % 4]; dst.push([p.x, p.y]); }
            var H = solveHomography(M, dst);
            if (!H) return;
            var dark = 0;
            for (i = 0; i < 4; i++) dark += meanAt(img, H, M[i][0], M[i][1], 2.5) / 4;
            var white = median(whites.map(function (w) { return meanAt(img, H, w[0], w[1], 1.5); }));
            var ox = O.x + O.size / 2, oy = O.y + O.size / 2;
            var o = meanAt(img, H, ox, oy, O.size * 0.3), anti = meanAt(img, H, P.w - ox, P.h - oy, O.size * 0.3);
            var span = white - dark;
            // gölgeye dayanıklı: yön karesi koyu, karşı köşedeki aynı nokta ondan belirgin açık
            var ok = span > 25 && o < dark + 0.5 * span && anti - o > 0.35 * span;
            var cand = { H: H, ok: ok, rotation: k === starts[0] ? 0 : 180, span: span, dark: dark, white: white, orient: o, anti: anti };
            if (ok && (!best || !best.ok || o < best.orient)) best = cand;
            else if (!best) best = cand;
        });
        return best;
    }

    // ---------------------------------------------------------------
    // 4) blok blok ince hizalama
    // ---------------------------------------------------------------
    var ANG12 = [], ANG16 = [];
    (function () {
        var i;
        for (i = 0; i < 12; i++) ANG12.push([Math.cos(i * Math.PI / 6), Math.sin(i * Math.PI / 6)]);
        for (i = 0; i < 16; i++) ANG16.push([Math.cos(i * Math.PI / 8 + 0.2), Math.sin(i * Math.PI / 8 + 0.2)]);
    })();

    // Sütun çapası (her sütunun üstünde ve altında yatay siyah çubuk): sayfa kıvrılsa da satırı
    // kaydırmadan bulmanın başlangıç noktası. Arama penceresi bir satır aralığından büyüktür;
    // çubuk, çevresine göre en koyu ve kenarları en keskin yatay bant olarak benzersizdir.
    function anchorCenter(ci, which) {
        var L = layout(), col = L.columns[ci];
        return { x: col.x + L.label.w + L.bubble.d / 2 + 2 * L.bubble.pitchX, y: which === "top" ? L.anchor.top : L.anchor.bottom };
    }
    function barScore(img, H, cx, cy) {
        var A = layout().anchor, b = 0, wsum = 0, ends = 0, i, j, p;
        for (i = 0; i < 7; i++) {
            var x = cx + (i / 6 - 0.5) * A.w * 0.85;
            for (j = -1; j <= 1; j++) { p = applyH(H, x, cy + j * A.h * 0.25); b += sample(img, p[0], p[1]); }
            p = applyH(H, x, cy - A.h / 2 - 1.4); wsum += sample(img, p[0], p[1]);
            p = applyH(H, x, cy + A.h / 2 + 1.4); wsum += sample(img, p[0], p[1]);
        }
        // uçlar: çubuğun hemen dışı beyaz, hemen içi koyu → yatay konumu da sabitler
        for (j = -1; j <= 1; j++) {
            var yy = cy + j * A.h * 0.3;
            p = applyH(H, cx - A.w / 2 - 1.2, yy); ends += sample(img, p[0], p[1]);
            p = applyH(H, cx + A.w / 2 + 1.2, yy); ends += sample(img, p[0], p[1]);
            p = applyH(H, cx - A.w / 2 + 1.2, yy); ends -= sample(img, p[0], p[1]);
            p = applyH(H, cx + A.w / 2 - 1.2, yy); ends -= sample(img, p[0], p[1]);
        }
        return (wsum / 14 - b / 21) + 0.5 * ends / 6;
    }
    function findAnchor(img, H, ci, which, span) {
        // Dikey arama bir satır aralığından geniş; yatay arama yarım şık aralığından dar.
        var A = layout().anchor, c = anchorCenter(ci, which), S = A.search || 8, SX = 3, best = -Infinity, bx = 0, by = 0, x, y;
        for (y = -S; y <= S + 1e-9; y += 0.5) for (x = -SX; x <= SX + 1e-9; x += 0.5) {
            var sc = barScore(img, H, c.x + x, c.y + y);
            if (sc > best) { best = sc; bx = x; by = y; }
        }
        var cx = bx, cy = by;
        for (y = cy - 0.5; y <= cy + 0.5 + 1e-9; y += 0.125) for (x = cx - 0.5; x <= cx + 0.5 + 1e-9; x += 0.125) {
            var s2 = barScore(img, H, c.x + x, c.y + y);
            if (s2 > best) { best = s2; bx = x; by = y; }
        }
        // pencerenin kenarında bulunan çapa güvenilmez (asıl çubuk pencere dışında olabilir)
        var edge = Math.abs(by) > S - 0.75 || Math.abs(bx) > SX - 0.5;
        return { dx: bx, dy: by, strength: best, ok: best > 0.4 * span && !edge };
    }
    function ringScore(img, H, bubbles, dx, dy, R, slope, cx0) {
        var s = 0, i, k;
        for (i = 0; i < bubbles.length; i++) {
            var c = bubbles[i], ey = dy + (slope ? slope * (c.x - cx0) : 0);
            for (k = 0; k < 12; k++) {
                var a = ANG12[k];
                var p = applyH(H, c.x + dx + R * a[0], c.y + ey + R * a[1]);
                var q = applyH(H, c.x + dx + 1.55 * R * a[0], c.y + ey + 1.55 * R * a[1]);
                s += sample(img, q[0], q[1]) - sample(img, p[0], p[1]);
            }
        }
        return s;
    }
    // Her sütunu üst çapadan başlayıp satır satır izle: her satırın kayması bir öncekine yakındır
    // (kâğıt yavaş bükülür), bu yüzden komşu satıra atlama olmaz. Sonda alt çapayla karşılaştır.
    function trackColumns(img, H, span) {
        var L = layout(), R = L.bubble.d / 2, T = L.read.track || 1.25, cols = [], ci;
        for (ci = 0; ci < L.columns.length; ci++) {
            var col = L.columns[ci], top = findAnchor(img, H, ci, "top", span), bot = findAnchor(img, H, ci, "bottom", span);
            // İki çapa da bulunmalı: alt çapa, satır izlemenin kaymadığının tek bağımsız kanıtıdır.
            if (!top.ok || !bot.ok) return { error: "anchors", col: ci };
            // Sayfa bir satır aralığına yakın bükülmüşse güvenle okunamaz: yeniden çektir.
            if (Math.hypot(top.dx, top.dy) > 6 || Math.hypot(bot.dx, bot.dy) > 6 || Math.abs(top.dy - bot.dy) > 5) return { error: "bend", col: ci };
            var rows = [], cur = { dx: top.dx, dy: top.dy, sl: 0 }, r, x, y;
            var mid = anchorCenter(ci, "top").x;
            var k;
            for (k = 0; k < col.count; k++) {
                r = k;
                var win = [], rr;
                for (rr = r; rr < r + 2 && rr < col.count; rr++) {
                    for (var li = 0; li < 5; li++) win.push(bubbleCenter(col.from + rr, li));
                }
                // ilk satırda yatay kayma henüz bilinmiyor: yarım şık aralığına kadar ara
                var best = -Infinity, bx = cur.dx, by = cur.dy, bs = cur.sl, cx = cur.dx, cy = cur.dy, TX = k === 0 ? 1.5 : T, sl;
                for (y = cy - T; y <= cy + T + 1e-9; y += 0.25) for (x = cx - TX; x <= cx + TX + 1e-9; x += 0.25) {
                    var sc = ringScore(img, H, win, x, y, R, cur.sl, mid);
                    if (sc > best) { best = sc; bx = x; by = y; }
                }
                cx = bx; cy = by;
                // ince ayar: kayma ve satır eğimi (kıvrık kâğıtta satırın iki ucu farklı kayar)
                // ilk satırda eğim henüz bilinmiyor: tüm aralığı tara
                var sl0 = k === 0 ? -0.2 : cur.sl - 0.06, sl1 = k === 0 ? 0.2 : cur.sl + 0.06;
                for (sl = sl0; sl <= sl1 + 1e-9; sl += 0.02) {
                    if (Math.abs(sl) > 0.2 + 1e-9) continue;
                    for (y = cy - 0.25; y <= cy + 0.25 + 1e-9; y += 0.125) for (x = cx - 0.25; x <= cx + 0.25 + 1e-9; x += 0.125) {
                        var s2 = ringScore(img, H, win, x, y, R, sl, mid);
                        if (s2 > best) { best = s2; bx = x; by = y; bs = sl; }
                    }
                }
                rows[r] = { dx: bx, dy: by, sl: bs, strength: best / (win.length * 12) };
                cur = { dx: bx, dy: by, sl: bs };
            }
            // çapraz kontrol: izlemenin vardığı uç, öbür çapayla tutmalı
            var end = rows[col.count - 1], miss = Math.hypot(end.dx - bot.dx, end.dy - bot.dy);
            cols.push({ col: ci, top: top, bottom: bot, rows: rows, miss: miss });
        }
        return { cols: cols };
    }

    // Tek baloncuğun merkezini kendi çemberine göre ±1 mm içinde ince ayarla (yerel bükülme).
    function refineBubble(img, H, x0, y0) {
        var R = layout().bubble.d / 2, one = [{ x: x0, y: y0 }], best = ringScore(img, H, one, 0, 0, R), bx = 0, by = 0, x, y;
        for (y = -0.75; y <= 0.75 + 1e-9; y += 0.25) for (x = -0.75; x <= 0.75 + 1e-9; x += 0.25) {
            if (!x && !y) continue;
            var sc = ringScore(img, H, one, x, y, R) - 4 * (x * x + y * y);
            if (sc > best) { best = sc; bx = x; by = y; }
        }
        return [x0 + bx, y0 + by, best / 12];
    }

    // ---------------------------------------------------------------
    // 5) doluluk ölçümü
    // ---------------------------------------------------------------
    function fillOf(img, H, cx, cy) {
        var L = layout(), R = L.bubble.d / 2, rin = L.read.inner || 0.6, s = 0, n = 0, k;
        var p = applyH(H, cx, cy);
        s += sample(img, p[0], p[1]); n++;
        for (k = 0; k < 12; k++) {
            var a = ANG12[k];
            if (k % 2 === 0) { p = applyH(H, cx + R * rin * 0.5 * a[0], cy + R * rin * 0.5 * a[1]); s += sample(img, p[0], p[1]); n++; }
            p = applyH(H, cx + R * rin * a[0], cy + R * rin * a[1]); s += sample(img, p[0], p[1]); n++;
        }
        var ring = [];
        for (k = 0; k < 16; k++) {
            var b = ANG16[k];
            p = applyH(H, cx + R * L.read.ringIn * b[0], cy + R * L.read.ringIn * b[1]); ring.push(sample(img, p[0], p[1]));
            p = applyH(H, cx + R * L.read.ringOut * b[0], cy + R * L.read.ringOut * b[1]); ring.push(sample(img, p[0], p[1]));
        }
        var white = percentile(ring, 0.75), inner = s / n;
        return Math.max(0, Math.min(1, 1 - inner / Math.max(white, 1)));
    }

    // ---------------------------------------------------------------
    // 6) karar: formun kendi dağılımından eşikler
    // ---------------------------------------------------------------
    function classify(dark) {
        var all = [], i, j;
        for (i = 0; i < dark.length; i++) for (j = 0; j < 5; j++) all.push(dark[i][j]);
        var E = median(all);
        var dev = all.filter(function (v) { return v < E + 0.2; }).map(function (v) { return Math.abs(v - E); });
        var sigma = Math.max(0.008, 1.4826 * median(dev));
        var maxes = dark.map(function (r) { return Math.max.apply(null, r); });
        var filled = maxes.filter(function (v) { return v > E + Math.max(0.15, 6 * sigma); });
        var F = filled.length >= 3 ? median(filled) : E + 0.5;
        var gap = Math.max(0.15, F - E);
        // Tlo altı kesin boş; Tlo–Thi arası "kararsız" (kullanıcı onaylar); Thi üstü işaretli.
        var Thi = E + 0.5 * gap, Tlo = Math.max(E + 0.2 * gap, E + 3 * sigma);
        if (Tlo > Thi - 0.06) Tlo = Thi - 0.06;
        var answers = [], flags = [], counts = { answered: 0, blank: 0, uncertain: 0, double: 0 };
        for (i = 0; i < dark.length; i++) {
            var r = dark[i], idx = [0, 1, 2, 3, 4].sort(function (a, b) { return r[b] - r[a]; });
            var d1 = r[idx[0]], d2 = r[idx[1]], ans = null, flag = null;
            if (d1 < Tlo) { ans = null; }
            else if (d1 >= Thi) {
                if (d2 >= Thi) flag = "double";
                else { ans = LETTERS[idx[0]]; if (d2 >= Tlo) flag = "uncertain"; }
            } else {
                flag = "uncertain";
                if (d1 - d2 > 0.1 * gap) ans = LETTERS[idx[0]];
            }
            answers.push(ans); flags.push(flag);
            if (flag === "double") counts.double++;
            else if (flag === "uncertain") counts.uncertain++;
            if (ans) counts.answered++; else if (!flag) counts.blank++;
        }
        return { answers: answers, flags: flags, counts: counts, stats: { E: E, F: F, sigma: sigma, Thi: Thi, Tlo: Tlo, contrast: F - E, filledRows: filled.length } };
    }

    // ---------------------------------------------------------------
    // 7) karekod
    // ---------------------------------------------------------------
    function readQr(img, H, off, jsQR) {
        if (!jsQR) return null;
        var Q = layout().qr, pad = 3, scales = [8, 6, 11], si;
        for (si = 0; si < scales.length; si++) {
            var s = scales[si], size = Math.round((Q.size + 2 * pad) * s), rgba = new Uint8ClampedArray(size * size * 4), x, y, k = 0;
            for (y = 0; y < size; y++) {
                for (x = 0; x < size; x++) {
                    var mx = Q.x - pad + (x + 0.5) / s + off.dx, my = Q.y - pad + (y + 0.5) / s + off.dy;
                    var p = applyH(H, mx, my), v = sample(img, p[0], p[1]);
                    rgba[k++] = v; rgba[k++] = v; rgba[k++] = v; rgba[k++] = 255;
                }
            }
            var r = null;
            try { r = jsQR(rgba, size, size, { inversionAttempts: "dontInvert" }); } catch (e) { r = null; }
            if (r && r.data) return r.data;
        }
        return null;
    }

    // ---------------------------------------------------------------
    // ana giriş: read({w,h,d}, { jsQR }) → sonuç
    // ---------------------------------------------------------------
    function read(img, opts) {
        opts = opts || {};
        var L = layout(), t0 = Date.now();
        var maxSide = L.read.maxSide || 2000;
        if (Math.max(img.w, img.h) > maxSide * 1.5) img = boxDown(img, Math.floor(Math.max(img.w, img.h) / maxSide));
        var cands = findMarkerCandidates(img);
        if (cands.length < 4) return fail("markers", "Formun dört köşesindeki siyah kareler bulunamadı. Formun tamamı kadrajda olsun, düz ve aydınlık bir yerde çek.", { found: cands.length });
        var quads = quadCandidates(cands), fit = null, list = null, i, tried = 0, rejected = 0, trace = [];
        for (i = 0; i < quads.length && tried < 3; i++) {
            var f = orientFit(img, quads[i]);
            trace.push(f ? { span: Math.round(f.span), dark: Math.round(f.dark), orient: Math.round(f.orient), anti: Math.round(f.anti), ok: f.ok,
                pts: quads[i].pts.map(function (p) { return [Math.round(p.x), Math.round(p.y)]; }) } : null);
            if (!f || !f.ok) continue;
            tried++;
            // Doğrulama: baloncuk çemberleri beklenen yerde mi? Yanlış dört köşe seçilirse (ör. bir
            // köşe kadraj dışında) ya da sayfa çok kıvrıksa izleme tutmaz; yanlış göstermek yerine reddet.
            var tr = trackColumns(img, f.H, f.span);
            var strengths = [], maxMiss = 0;
            if (!tr.error) tr.cols.forEach(function (c) { maxMiss = Math.max(maxMiss, c.miss); c.rows.forEach(function (r) { strengths.push(r.strength); }); });
            var rel = tr.error ? 0 : median(strengths) / Math.max(f.span, 1);
            trace[trace.length - 1].rel = Math.round(rel * 100) / 100;
            trace[trace.length - 1].miss = tr.error ? tr.error : Math.round(maxMiss * 10) / 10;
            if (tr.error || rel < 0.18 || maxMiss > 1.6) { rejected++; continue; }
            fit = f; fit.quad = quads[i]; fit.rel = rel; fit.miss = maxMiss; list = tr.cols;
            break;
        }
        if (!fit) {
            if (rejected) return fail("verify", "Form tam okunamadı: dört köşe karesi kadrajda olmayabilir ya da kâğıt kıvrık. Formu düz bir zemine koyup yeniden çek.", { found: cands.length, quads: quads.length, trace: trace });
            return fail(quads.length ? "orientation" : "markers",
                quads.length ? "Form tanınamadı. Fotoğrafta yalnızca optik form olsun; karekod sağ üstte kalacak şekilde çek."
                    : "Dört köşe karesi düzgün bir dörtgen oluşturmadı. Formu düz bir zemine koy, tam üstten çek.",
                { found: cands.length, quads: quads.length, trace: trace });
        }
        var H = fit.H;
        var n = questionCount(), dark = [], centers = [], ringQ = [], q, li;
        for (q = 1; q <= n; q++) {
            var b0 = bubbleCenter(q, 0), ch = list[b0.col].rows[b0.row], row = [], crow = [], qrow = [];
            for (li = 0; li < 5; li++) {
                var c = bubbleCenter(q, li), mx = anchorCenter(b0.col, "top").x;
                var rf = refineBubble(img, H, c.x + ch.dx, c.y + ch.dy + (ch.sl || 0) * (c.x - mx));
                row.push(fillOf(img, H, rf[0], rf[1]));
                crow.push([rf[0], rf[1]]);
                qrow.push(rf[2] / Math.max(fit.span, 1));
            }
            dark.push(row); centers.push(crow); ringQ.push(qrow);
        }
        var weak = 0;
        list.forEach(function (c) { c.rows.forEach(function (r) { if (r.strength < 0.12 * fit.span) weak++; }); });
        var cls = classify(dark);
        // Hizalaması formun geri kalanından belirgin zayıf satırları kullanıcıya göster (sessiz hata olmasın).
        var rowStr = [];
        for (q = 1; q <= n; q++) { var bq = bubbleCenter(q, 0); rowStr.push(list[bq.col].rows[bq.row].strength); }
        var medStr = median(rowStr), weakRows = 0;
        for (q = 0; q < n; q++) {
            if (rowStr[q] < 0.55 * medStr && !cls.flags[q]) {
                cls.flags[q] = "uncertain"; weakRows++;
                cls.counts.uncertain++;
                if (cls.answers[q]) cls.counts.answered--; else cls.counts.blank--;
            }
        }
        var lastCol = list[L.columns.length - 1], qrChunk = lastCol.top.ok ? lastCol.top : lastCol.rows[0];
        var qrText = readQr(img, H, qrChunk, opts.jsQR || global.jsQR);
        var warnings = [];
        if (weak > 6) warnings.push("Bazı bölgelerde baloncuklar net değil; fotoğraf bulanık ya da karanlık olabilir.");
        if (cls.stats.filledRows >= 3 && cls.stats.contrast < 0.2) warnings.push("İşaretler soluk görünüyor; koyu kurşun kalem ve daha iyi ışık okumayı iyileştirir.");
        if (!qrText) warnings.push("Karekod okunamadı; formun sana ait olduğunu kendin doğrula.");
        return {
            ok: true,
            answers: cls.answers, flags: cls.flags, counts: cls.counts, dark: dark, ringQ: ringQ,
            qr: qrText, qrInfo: parseQr(qrText),
            rotation: fit.rotation, H: H, centers: centers,
            markers: fit.quad.pts.map(function (p) { return [p.x, p.y]; }),
            stats: cls.stats, contrast: fit.span, align: Math.round(fit.rel * 100) / 100, miss: Math.round(fit.miss * 10) / 10, weakRows: weak,
            offsets: list.map(function (c) { return [c.col, c.top.dx, c.top.dy, c.bottom.dx, c.bottom.dy, Math.round(c.miss * 10) / 10]; }),
            warnings: warnings, size: [img.w, img.h], ms: Date.now() - t0
        };
    }
    function fail(code, message, extra) {
        return { ok: false, code: code, message: message, detail: extra || {} };
    }

    // ---------------------------------------------------------------
    // form çizimi (canvas 2D). opts: { pxPerMm, name, track, title, date, qrText, qrcode }
    // ---------------------------------------------------------------
    function drawForm(ctx, opts) {
        var L = layout(), s = opts.pxPerMm || 8, P = L.page, B = L.bubble, i;
        ctx.save();
        ctx.setTransform(s, 0, 0, s, 0, 0);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, P.w, P.h);
        ctx.fillStyle = "#000";
        var m = L.marker.size;
        L.marker.centers.forEach(function (c) { ctx.fillRect(c[0] - m / 2, c[1] - m / 2, m, m); });
        ctx.fillRect(L.orient.x, L.orient.y, L.orient.size, L.orient.size);

        // karekod
        if (opts.qrText && opts.qrcode) {
            var qr = opts.qrcode(0, "M");
            qr.addData(opts.qrText, /^[0-9A-Z $%*+\-.\/:]+$/.test(opts.qrText) ? "Alphanumeric" : "Byte");
            qr.make();
            var nm = qr.getModuleCount(), ms = L.qr.size / nm, r, c;
            for (r = 0; r < nm; r++) for (c = 0; c < nm; c++) {
                if (qr.isDark(r, c)) ctx.fillRect(L.qr.x + c * ms, L.qr.y + r * ms, ms + 0.02, ms + 0.02);
            }
        }

        // başlık (insan okusun)
        var hx = L.header.x, hy = L.header.y;
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "left";
        ctx.font = "bold 4.6px Arial, Helvetica, sans-serif";
        ctx.fillText("ATANLY · CANLI DENEME OPTİK FORMU", hx, hy + 4);
        ctx.font = "3.4px Arial, Helvetica, sans-serif";
        ctx.fillText(fit(ctx, opts.title || "", 138), hx, hy + 10);
        ctx.font = "bold 3.6px Arial, Helvetica, sans-serif";
        ctx.fillText(fit(ctx, "Ad: " + (opts.name || ""), 138), hx, hy + 16);
        ctx.font = "3.2px Arial, Helvetica, sans-serif";
        ctx.fillText(fit(ctx, "Kulvar: " + (opts.track || "") + "    Tarih: " + (opts.date || ""), 138), hx, hy + 21.5);
        ctx.font = "2.6px Arial, Helvetica, sans-serif";
        ctx.fillText("Yalnızca koyu kurşun kalem (2B) kullan. Baloncuğu tamamen doldur; silerken iz bırakma.", hx, hy + 27);
        ctx.fillText("Yazdırırken ‘Sayfaya sığdır’ KAPALI, ölçek %100 olsun. Karekodu ve köşe karelerini kapatma, katlama.", hx, hy + 31);
        ctx.font = "2.2px Arial, Helvetica, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Form sürümü " + L.version, L.qr.x + L.qr.size / 2, L.qr.y + L.qr.size + 3);

        // bloklar
        L.blocks.forEach(function (b) {
            ctx.textAlign = "center";
            ctx.font = "bold 3.2px Arial, Helvetica, sans-serif";
            ctx.fillText(b.title, b.x + b.w / 2, b.y + 3);
        });
        ctx.fillRect(L.divider.x - 0.25, L.divider.y1, 0.5, L.divider.y2 - L.divider.y1);
        // sütun çapaları
        L.columns.forEach(function (col, ci) {
            ["top", "bottom"].forEach(function (w) {
                var a = anchorCenter(ci, w);
                ctx.fillRect(a.x - L.anchor.w / 2, a.y - L.anchor.h / 2, L.anchor.w, L.anchor.h);
            });
        });

        // satırlar
        ctx.lineWidth = B.stroke;
        L.columns.forEach(function (col) {
            for (var r = 0; r < col.count; r++) {
                var no = col.from + r, cy = col.y + B.d / 2 + r * B.pitchY;
                ctx.fillStyle = "#000";
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.font = "bold 3px Arial, Helvetica, sans-serif";
                ctx.fillText(String(no), col.x + L.label.w - 1.6, cy + 0.15);
                for (i = 0; i < 5; i++) {
                    var cx = col.x + L.label.w + B.d / 2 + i * B.pitchX;
                    ctx.strokeStyle = "#000";
                    ctx.beginPath();
                    ctx.arc(cx, cy, B.d / 2, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.fillStyle = "#9a9a9a";
                    ctx.textAlign = "center";
                    ctx.font = "2.3px Arial, Helvetica, sans-serif";
                    ctx.fillText(LETTERS[i], cx, cy + 0.12);
                }
                if ((r + 1) % L.groupEvery === 0 && r < col.count - 1) {
                    ctx.strokeStyle = "#c8c8c8";
                    ctx.lineWidth = 0.18;
                    ctx.beginPath();
                    var gy = cy + B.pitchY / 2;
                    ctx.moveTo(col.x + 1, gy); ctx.lineTo(col.x + L.label.w + 4 * B.pitchX + B.d, gy);
                    ctx.stroke();
                    ctx.lineWidth = B.stroke;
                }
            }
        });
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "2.4px Arial, Helvetica, sans-serif";
        ctx.fillText(fit(ctx, "Atanly · atanly.com · Bu form yalnızca " + (opts.name || "sahibi") + " içindir; başkasının formuyla okutma yapılamaz.", 160), P.w / 2, L.footerY);
        ctx.restore();
    }
    function fit(ctx, text, maxW) {
        text = String(text);
        if (ctx.measureText(text).width <= maxW) return text;
        while (text.length > 4 && ctx.measureText(text + "…").width > maxW) text = text.slice(0, -1);
        return text + "…";
    }

    var api = {
        LETTERS: LETTERS,
        setLayout: setLayout,
        layout: layout,
        questionCount: questionCount,
        bubbleCenter: bubbleCenter,
        qrPayload: qrPayload,
        parseQr: parseQr,
        solveHomography: solveHomography,
        applyH: applyH,
        toGray: toGray,
        boxDown: boxDown,
        read: read,
        classify: classify,
        drawForm: drawForm
    };
    global.KpssOmr = api;
    if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
