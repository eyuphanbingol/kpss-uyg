/**
 * Optik okuma için SENTETİK test görselleri (tarayıcıda çalışır; scripts/test-omr-synthetic.js sürer).
 * Formu gerçek çizim koduyla (KpssOmr.drawForm) çizer, kurşun kalemle doldurur, sonra telefon
 * fotoğrafı gibi bozar: perspektif, dönme, lens bükülmesi, ışık eğimi, gölge, gürültü,
 * bulanıklık, JPEG sıkıştırma, dağınık arka plan. Ardından okuma hattından geçirip ölçer.
 */
(function (global) {
    "use strict";
    var O = global.KpssOmr;
    var PX = 8; // form çizim çözünürlüğü (px/mm)

    function rng(seed) {
        var s = seed >>> 0 || 1;
        return function () { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    }
    function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r()); }

    // ---------- 1) formu çiz ve doldur ----------
    // truth: [{ ans: 'A'|null, kind: 'single'|'blank'|'double'|'erased' }]
    function makeTruth(r, p) {
        var n = O.questionCount(), out = [], i;
        for (i = 0; i < n; i++) {
            var x = r(), ans = "ABCDE".charAt(Math.floor(r() * 5));
            if (x < (p.blank || 0.12)) out.push({ ans: null, kind: "blank" });
            else if (x < (p.blank || 0.12) + (p.double || 0)) out.push({ ans: null, kind: "double", second: other(r, ans), first: ans });
            else if (x < (p.blank || 0.12) + (p.double || 0) + (p.erased || 0)) out.push({ ans: ans, kind: "erased", ghost: other(r, ans) });
            else out.push({ ans: ans, kind: "single" });
        }
        return out;
    }
    function other(r, a) {
        var l = "ABCDE".replace(a, "");
        return l.charAt(Math.floor(r() * 4));
    }
    function pencil(ctx, r, cx, cy, R, tone, cover) {
        // kurşun kalem: baloncuğu karalayan yarı saydam çizgiler
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.98 + r() * 0.12), 0, Math.PI * 2);
        ctx.clip();
        var strokes = 9 + Math.floor(r() * 6), k, g = tone;
        ctx.lineCap = "round";
        for (k = 0; k < strokes; k++) {
            var t = (k / (strokes - 1) - 0.5) * 2 * R * cover;
            ctx.strokeStyle = "rgba(" + g + "," + g + "," + (g + 6) + "," + (0.55 + r() * 0.35) + ")";
            ctx.lineWidth = 0.55 + r() * 0.35;
            ctx.beginPath();
            ctx.moveTo(cx - R * 1.1, cy + t + (r() - 0.5) * 0.6);
            ctx.lineTo(cx + R * 1.1, cy + t + (r() - 0.5) * 0.6);
            ctx.stroke();
        }
        ctx.restore();
    }
    function renderForm(r, p, truth) {
        var L = O.layout(), cv = document.createElement("canvas");
        cv.width = Math.round(L.page.w * PX); cv.height = Math.round(L.page.h * PX);
        var ctx = cv.getContext("2d");
        O.drawForm(ctx, {
            pxPerMm: PX, name: "Deneme Öğrencisi " + Math.floor(r() * 1000), track: "KPSS Lisans",
            title: "Atanly Canlı Deneme · Sentetik test", date: "25 Ekim 2026 Pazar 10:15",
            qrText: p.qrText, qrcode: global.qrcode
        });
        if (p.inkFade) {
            // soluk yazıcı: siyah mürekkep griye döner (kalem izleri sonra çizilir)
            var im = ctx.getImageData(0, 0, cv.width, cv.height), dd = im.data, q;
            for (q = 0; q < dd.length; q += 4) { var v = 255 - (255 - dd[q]) * p.inkFade; dd[q] = dd[q + 1] = dd[q + 2] = v; }
            ctx.putImageData(im, 0, 0);
        }
        ctx.setTransform(PX, 0, 0, PX, 0, 0);
        var R = L.bubble.d / 2, tone = p.tone || [45, 95];
        truth.forEach(function (t, i) {
            var no = i + 1;
            function mark(letter, ghost) {
                var c = O.bubbleCenter(no, "ABCDE".indexOf(letter));
                var g = Math.round(tone[0] + r() * (tone[1] - tone[0]));
                var cov = p.cover ? p.cover[0] + r() * (p.cover[1] - p.cover[0]) : 0.8 + r() * 0.2;
                pencil(ctx, r, c.x + (r() - 0.5) * 0.5, c.y + (r() - 0.5) * 0.5, R, g, cov);
                if (ghost) {
                    // silinmiş: üstünü silgi gibi beyazla (iz kalır)
                    ctx.save();
                    ctx.beginPath(); ctx.arc(c.x, c.y, R * 1.15, 0, Math.PI * 2); ctx.clip();
                    ctx.fillStyle = "rgba(255,255,255," + (p.eraseAlpha || 0.8) + ")";
                    ctx.fillRect(c.x - R * 1.2, c.y - R * 1.2, R * 2.4, R * 2.4);
                    ctx.restore();
                    // silgi çemberi de soldurur; yeniden çiz
                    ctx.strokeStyle = "rgba(0,0,0,0.75)"; ctx.lineWidth = L.bubble.stroke;
                    ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, Math.PI * 2); ctx.stroke();
                }
            }
            if (t.kind === "single") mark(t.ans);
            else if (t.kind === "erased") { mark(t.ghost, true); mark(t.ans); }
            else if (t.kind === "double") { mark(t.first); mark(t.second); }
        });
        return cv;
    }

    // ---------- 2) fotoğrafla ----------
    function photograph(form, r, p) {
        var W = p.W || 1500, H = p.H || 2000;
        var fctx = form.getContext("2d"), fw = form.width, fh = form.height;
        var fd = fctx.getImageData(0, 0, fw, fh).data, fg = new Uint8Array(fw * fh), i, j;
        for (i = 0, j = 0; i < fg.length; i++, j += 4) fg[i] = fd[j];
        // sayfa köşeleri (çıktı px): ortada, kenar payı ile, dönme + perspektif
        var fill = p.fill || 0.86, ang = (p.rotate || 0) * Math.PI / 180 + (r() - 0.5) * (p.rotJitter || 6) * Math.PI / 180;
        var ph = H * fill, pw = ph * fw / fh;
        if (pw > W * fill) { pw = W * fill; ph = pw * fh / fw; }
        var cx = W / 2 + (r() - 0.5) * W * 0.04, cy = H / 2 + (r() - 0.5) * H * 0.04, persp = p.persp || 0.03;
        var base = [[-pw / 2, -ph / 2], [pw / 2, -ph / 2], [pw / 2, ph / 2], [-pw / 2, ph / 2]];
        var dst = base.map(function (b) {
            var x = b[0] + (r() - 0.5) * 2 * persp * pw, y = b[1] + (r() - 0.5) * 2 * persp * ph;
            return [cx + x * Math.cos(ang) - y * Math.sin(ang), cy + x * Math.sin(ang) + y * Math.cos(ang)];
        });
        if (!p.allowCut) {
            // sayfa kadraja sığsın (köşe kareleri kesilmesin)
            var bx0 = Math.min.apply(null, dst.map(function (d) { return d[0]; })), bx1 = Math.max.apply(null, dst.map(function (d) { return d[0]; }));
            var by0 = Math.min.apply(null, dst.map(function (d) { return d[1]; })), by1 = Math.max.apply(null, dst.map(function (d) { return d[1]; }));
            var k = Math.min(1, (W * 0.96) / (bx1 - bx0), (H * 0.96) / (by1 - by0));
            var mx = (bx0 + bx1) / 2, my = (by0 + by1) / 2;
            dst = dst.map(function (d) { return [W / 2 + (d[0] - mx) * k, H / 2 + (d[1] - my) * k]; });
        }
        var Hm = O.solveHomography(dst, [[0, 0], [fw, 0], [fw, fh], [0, fh]]); // çıktı → form
        var k1 = p.barrel || 0, diag = Math.hypot(W, H) / 2;
        // aydınlatma alanı
        var gx = (r() - 0.5) * (p.gradient || 0.3), gy = (r() - 0.5) * (p.gradient || 0.3), gain = p.gain || 1;
        var sh = p.shadow ? { a: r() * Math.PI * 2, off: (r() - 0.3) * 0.4, k: p.shadow } : null;
        var out = new Float32Array(W * H), bg = p.bg || [120, 150];
        var bgBase = bg[0] + r() * (bg[1] - bg[0]);
        var clutter = [];
        for (i = 0; i < (p.clutter || 0); i++) clutter.push([r() * W, r() * H, 40 + r() * 160, 30 + r() * 120, 20 + r() * 60]);
        var x, y;
        for (y = 0; y < H; y++) {
            for (x = 0; x < W; x++) {
                // lens bükülmesi (fıçı): görüntü noktası → ideal nokta
                var nx = (x - W / 2) / diag, ny = (y - H / 2) / diag, rr = nx * nx + ny * ny, f = 1 + k1 * rr;
                var ux = W / 2 + nx * f * diag, uy = H / 2 + ny * f * diag;
                var w = Hm[6] * ux + Hm[7] * uy + Hm[8];
                var sx = (Hm[0] * ux + Hm[1] * uy + Hm[2]) / w, sy = (Hm[3] * ux + Hm[4] * uy + Hm[5]) / w, v;
                if (p.curl) { sy += p.curl * fh * Math.sin(Math.PI * sx / fw); sx += p.curl * 0.5 * fw * Math.sin(Math.PI * sy / fh); }
                if (sx >= 0 && sy >= 0 && sx < fw - 1 && sy < fh - 1) {
                    var x0 = sx | 0, y0 = sy | 0, ax = sx - x0, ay = sy - y0, q = y0 * fw + x0;
                    var a1 = fg[q] + (fg[q + 1] - fg[q]) * ax, a2 = fg[q + fw] + (fg[q + fw + 1] - fg[q + fw]) * ax;
                    v = (a1 + (a2 - a1) * ay) * 0.93;
                } else {
                    v = bgBase + 18 * Math.sin(x * 0.013 + y * 0.004) + 10 * Math.sin(y * 0.031);
                    for (j = 0; j < clutter.length; j++) {
                        var c = clutter[j];
                        if (x > c[0] && x < c[0] + c[2] && y > c[1] && y < c[1] + c[3]) v = c[4];
                    }
                }
                var light = gain * (1 + gx * (x / W - 0.5) * 2 + gy * (y / H - 0.5) * 2);
                light *= 1 - 0.18 * rr * (p.vignette || 1);
                if (sh) {
                    var dd = ((x / W - 0.5) * Math.cos(sh.a) + (y / H - 0.5) * Math.sin(sh.a)) - sh.off;
                    var t = Math.max(0, Math.min(1, dd / 0.04 + 0.5));
                    light *= 1 - sh.k * t;
                }
                out[y * W + x] = v * light;
            }
        }
        if (p.blur) { boxBlur(out, W, H, p.blur); boxBlur(out, W, H, p.blur); }
        var cv = document.createElement("canvas");
        cv.width = W; cv.height = H;
        var ctx = cv.getContext("2d"), im = ctx.createImageData(W, H), noise = p.noise || 3;
        for (i = 0, j = 0; i < out.length; i++, j += 4) {
            var g2 = out[i] + gauss(r) * noise;
            im.data[j] = clamp(g2 * 1.02 + 4); im.data[j + 1] = clamp(g2); im.data[j + 2] = clamp(g2 * 0.95 - 3); im.data[j + 3] = 255;
        }
        ctx.putImageData(im, 0, 0);
        return { canvas: cv, corners: dst };
    }
    function clamp(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }
    function boxBlur(a, W, H, rad) {
        var tmp = new Float32Array(a.length), x, y, k, s, n;
        for (y = 0; y < H; y++) {
            for (x = 0; x < W; x++) {
                s = 0; n = 0;
                for (k = -rad; k <= rad; k++) { var xx = x + k; if (xx >= 0 && xx < W) { s += a[y * W + xx]; n++; } }
                tmp[y * W + x] = s / n;
            }
        }
        for (y = 0; y < H; y++) {
            for (x = 0; x < W; x++) {
                s = 0; n = 0;
                for (k = -rad; k <= rad; k++) { var yy = y + k; if (yy >= 0 && yy < H) { s += tmp[yy * W + x]; n++; } }
                a[y * W + x] = s / n;
            }
        }
    }
    function jpeg(canvas, q) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () {
                var c = document.createElement("canvas");
                c.width = img.width; c.height = img.height;
                c.getContext("2d").drawImage(img, 0, 0);
                resolve({ canvas: c, bytes: Math.round(img.src.length * 0.75) });
            };
            img.src = canvas.toDataURL("image/jpeg", q);
        });
    }

    // ---------- 3) karşılaştır ----------
    function score(truth, res) {
        var s = { rows: truth.length, correct: 0, flagged: 0, silent: 0, missedFlag: 0 };
        truth.forEach(function (t, i) {
            var a = res.answers[i], f = res.flags[i];
            if (t.kind === "double") {
                if (f === "double") s.correct++;
                else if (f) s.flagged++;
                else s.silent++;
                return;
            }
            if (a === t.ans && !f) s.correct++;
            else if (f) s.flagged++;          // kullanıcı onay ekranında görür
            else s.silent++;                   // fark edilmeden yanlış: asıl tehlike
        });
        return s;
    }

    function runOne(seed, p) {
        var r = rng(seed);
        var truth = makeTruth(r, p);
        var form = renderForm(r, p, truth);
        var shot = photograph(form, r, p);
        return jpeg(shot.canvas, p.jpeg || 0.82).then(function (j) {
            var c = j.canvas, data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
            var t0 = performance.now();
            var res = O.read(O.toGray(data, c.width, c.height), { jsQR: global.jsQR });
            var ms = Math.round(performance.now() - t0);
            var out = { seed: seed, ms: ms, ok: res.ok, code: res.code, bytes: j.bytes, align: res.align };
            if (res.ok) {
                out.score = score(truth, res);
                out.qr = res.qr === p.qrText;
                out.rotation = res.rotation;
                out.counts = res.counts;
                out.contrast = Math.round(res.stats.contrast * 100) / 100;
            }
            if (p.keepImage) {
                var sm = document.createElement("canvas"), k = 480 / c.width;
                sm.width = 480; sm.height = Math.round(c.height * k);
                sm.getContext("2d").drawImage(c, 0, 0, sm.width, sm.height);
                out.preview = sm.toDataURL("image/jpeg", 0.62);
            } else out.preview = null;
            return out;
        });
    }

    global.OmrSynth = { runOne: runOne, makeTruth: makeTruth, renderForm: renderForm, photograph: photograph, rng: rng, score: score };
})(window);
