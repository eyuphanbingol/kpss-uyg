/**
 * Optik form ve soru kitapçığı PDF'i (tarayıcıda; web'de ve mobil WebView'da aynı kod).
 * Sayfalar canvas'ta çizilip JPEG olarak gömülür: Türkçe karakter ve görseller yazı tipi
 * gömmeden sorunsuz basılır. PDF, yazdırmada ölçeklemeyi kapatmasını ister (PrintScaling None).
 */
(function (global) {
    "use strict";
    var A4 = { w: 210, h: 297 };
    var PT = 72 / 25.4;

    // ---------------------------------------------------------------
    // en küçük PDF yazıcısı: her sayfa tek bir JPEG görsel
    // ---------------------------------------------------------------
    function ascii(s) {
        var out = new Uint8Array(s.length), i;
        for (i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 255;
        return out;
    }
    function utf16hex(s) {
        var h = "FEFF", i;
        for (i = 0; i < s.length; i++) h += ("000" + s.charCodeAt(i).toString(16).toUpperCase()).slice(-4);
        return "<" + h + ">";
    }
    function makePdf(pages, meta) {
        meta = meta || {};
        var parts = [], offsets = [], len = 0;
        function push(x) { var b = typeof x === "string" ? ascii(x) : x; parts.push(b); len += b.length; }
        function obj(n, body, stream) {
            offsets[n] = len;
            push(n + " 0 obj\n" + body);
            if (stream) { push("\nstream\n"); push(stream); push("\nendstream"); }
            push("\nendobj\n");
        }
        var W = (A4.w * PT).toFixed(2), H = (A4.h * PT).toFixed(2);
        var n = pages.length, kids = [], i;
        for (i = 0; i < n; i++) kids.push((4 + i * 3) + " 0 R");
        push("%PDF-1.4\n%âãÏÓ\n");
        obj(1, "<< /Type /Catalog /Pages 2 0 R /ViewerPreferences << /PrintScaling /None /Duplex /Simplex >> >>");
        obj(2, "<< /Type /Pages /Count " + n + " /Kids [" + kids.join(" ") + "] >>");
        obj(3, "<< /Title " + utf16hex(meta.title || "Atanly") + " /Author " + utf16hex(meta.author || "Atanly") +
            " /Producer (Atanly) /Creator (Atanly) >>");
        for (i = 0; i < n; i++) {
            var p = pages[i], base = 4 + i * 3;
            var content = "q " + W + " 0 0 " + H + " 0 0 cm /Im0 Do Q";
            obj(base, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /XObject << /Im0 " +
                (base + 2) + " 0 R >> >> /Contents " + (base + 1) + " 0 R >>");
            obj(base + 1, "<< /Length " + content.length + " >>", ascii(content));
            obj(base + 2, "<< /Type /XObject /Subtype /Image /Width " + p.w + " /Height " + p.h +
                " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + p.jpeg.length + " >>", p.jpeg);
        }
        var xref = len, total = 4 + n * 3;
        var x = "xref\n0 " + total + "\n0000000000 65535 f \n";
        for (i = 1; i < total; i++) x += ("0000000000" + offsets[i]).slice(-10) + " 00000 n \n";
        push(x + "trailer\n<< /Size " + total + " /Root 1 0 R /Info 3 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
        var out = new Uint8Array(len), o = 0;
        parts.forEach(function (b) { out.set(b, o); o += b.length; });
        return out;
    }
    function b64ToBytes(b64) {
        var bin = atob(b64), out = new Uint8Array(bin.length), i;
        for (i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
        return out;
    }
    function bytesToB64(bytes) {
        var s = "", i, CH = 0x8000;
        for (i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
        return btoa(s);
    }
    function canvasPage(canvas, q) {
        var url = canvas.toDataURL("image/jpeg", q || 0.9);
        return { w: canvas.width, h: canvas.height, jpeg: b64ToBytes(url.split(",")[1]) };
    }
    function newPage(pxPerMm) {
        var c = document.createElement("canvas");
        c.width = Math.round(A4.w * pxPerMm);
        c.height = Math.round(A4.h * pxPerMm);
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.setTransform(pxPerMm, 0, 0, pxPerMm, 0, 0);
        return { canvas: c, ctx: ctx };
    }

    // ---------------------------------------------------------------
    // optik form PDF'i (tek sayfa)
    // ---------------------------------------------------------------
    function formPdf(info) {
        var Omr = global.KpssOmr, s = 9.45; // ≈240 dpi
        var pg = newPage(s);
        Omr.drawForm(pg.ctx, {
            pxPerMm: s, name: info.name, track: info.trackLabel, title: info.title, date: info.date,
            qrText: Omr.qrPayload(info.examId, info.userId, info.track), qrcode: global.qrcode
        });
        return makePdf([canvasPage(pg.canvas, 0.92)], { title: "Optik form · " + (info.title || "") });
    }

    // ---------------------------------------------------------------
    // soru kitapçığı PDF'i: iki sütun, filigranlı
    // ---------------------------------------------------------------
    var BK = { s: 7, margin: 13, gap: 7, top: 22, bottom: 16, font: 3.55, lead: 4.9 };
    var FONT = "Arial, Helvetica, sans-serif";

    function loadImage(src) {
        return new Promise(function (resolve) {
            if (!src) return resolve(null);
            var im = new Image();
            im.onload = function () { resolve(im); };
            im.onerror = function () { resolve(null); };
            im.src = src;
        });
    }
    function wrap(ctx, text, maxW) {
        var out = [];
        String(text || "").split(/\n/).forEach(function (para) {
            var words = para.split(/\s+/).filter(Boolean), line = "";
            if (!words.length) { out.push(""); return; }
            words.forEach(function (w) {
                var t = line ? line + " " + w : w;
                if (ctx.measureText(t).width <= maxW || !line) {
                    // tek kelime sütundan genişse harf harf böl
                    if (!line && ctx.measureText(w).width > maxW) {
                        var part = "";
                        for (var i = 0; i < w.length; i++) {
                            if (ctx.measureText(part + w[i]).width > maxW) { out.push(part); part = ""; }
                            part += w[i];
                        }
                        line = part;
                    } else line = t;
                } else { out.push(line); line = w; }
            });
            out.push(line);
        });
        return out;
    }
    function watermark(ctx, text) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.075)";
        ctx.font = "bold 6px " + FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(A4.w / 2, A4.h / 2);
        ctx.rotate(-Math.PI / 6);
        var y, x, tw = ctx.measureText(text).width + 30;
        for (y = -190; y <= 190; y += 46) {
            for (x = -230 + ((y / 46) % 2 ? tw / 2 : 0); x <= 230; x += tw) ctx.fillText(text, x, y);
        }
        ctx.restore();
    }
    function chrome(ctx, info, pageNo) {
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = "bold 3.2px " + FONT;
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "left";
        ctx.fillText("ATANLY · CANLI DENEME · " + (info.title || ""), BK.margin, 12);
        ctx.textAlign = "right";
        ctx.font = "3px " + FONT;
        ctx.fillText(info.name || "", A4.w - BK.margin, 12);
        ctx.fillRect(BK.margin, 14.5, A4.w - 2 * BK.margin, 0.35);
        ctx.fillRect(A4.w / 2 - 0.15, BK.top, 0.3, A4.h - BK.top - BK.bottom);
        ctx.font = "2.5px " + FONT;
        ctx.textAlign = "left";
        ctx.fillText("Bu kitapçık " + (info.name || "") + " (" + (info.email || "") + ") için basılmıştır; paylaşılması yasaktır.", BK.margin, A4.h - 8);
        ctx.textAlign = "right";
        ctx.font = "bold 3px " + FONT;
        ctx.fillText(String(pageNo), A4.w - BK.margin, A4.h - 8);
        ctx.restore();
    }

    // Soru → çizim parçaları (satırlar ve görsel); yükseklikleri mm.
    function layoutQuestion(ctx, q, colW, img) {
        var items = [], indent = 7;
        ctx.font = BK.font + "px " + FONT;
        var stem = wrap(ctx, q.stem, colW - indent);
        stem.forEach(function (line, i) { items.push({ kind: "text", text: line, x: indent, h: BK.lead, no: i === 0 ? q.no : null }); });
        if (img) {
            var w = Math.min(colW - indent, img.width / 6), h = w * img.height / img.width;
            if (h > 75) { h = 75; w = h * img.width / img.height; }
            items.push({ kind: "img", img: img, x: indent, w: w, h: h + 2.5 });
        }
        (q.options || []).forEach(function (o, i) {
            var L = "ABCDE".charAt(i);
            var lines = wrap(ctx, String(o), colW - indent - 6);
            lines.forEach(function (line, j) { items.push({ kind: "text", text: line, x: indent + 6, h: BK.lead, letter: j === 0 ? L : null }); });
        });
        return items;
    }

    function bookletPdf(booklet, info, onProgress) {
        var qs = booklet.questions || [];
        return Promise.all(qs.map(function (q) { return loadImage(q.image); })).then(function (imgs) {
            var pages = [], pg = null, col = 0, y = 0, pageNo = 0;
            var colW = (A4.w - 2 * BK.margin - BK.gap) / 2, maxY = A4.h - BK.bottom;
            var wm = (info.name || "") + " · " + (info.email || "");
            function startPage() {
                if (pg) pages.push(canvasPage(pg.canvas, 0.86));
                pg = newPage(BK.s);
                pageNo++;
                watermark(pg.ctx, wm);
                chrome(pg.ctx, info, pageNo);
                col = 0; y = BK.top + 3;
            }
            function nextCol() { if (col === 0) { col = 1; y = BK.top + 3; } else startPage(); }
            function colX() { return BK.margin + col * (colW + BK.gap); }
            function section(title) {
                if (y + 14 > maxY) nextCol();
                var ctx = pg.ctx;
                ctx.fillStyle = "#000";
                ctx.fillRect(colX(), y, colW, 7);
                ctx.fillStyle = "#fff";
                ctx.font = "bold 3.6px " + FONT;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(title, colX() + colW / 2, y + 3.6);
                y += 11;
            }
            startPage();
            var lastBolum = null;
            qs.forEach(function (q, qi) {
                if (q.bolum !== lastBolum) {
                    if (lastBolum !== null) { if (col === 0 && y > BK.top + 3) nextCol(); if (col === 1 && y > BK.top + 3) startPage(); }
                    section(q.bolum === "GY" ? "GENEL YETENEK" : "GENEL KÜLTÜR");
                    lastBolum = q.bolum;
                }
                var ctx = pg.ctx, items = layoutQuestion(ctx, q, colW, imgs[qi]);
                var total = items.reduce(function (s, it) { return s + it.h; }, 0);
                if (y + total > maxY && total <= maxY - BK.top - 3) nextCol();
                items.forEach(function (it) {
                    if (y + it.h > maxY) nextCol();
                    ctx = pg.ctx;
                    var x = colX();
                    ctx.fillStyle = "#000";
                    ctx.textAlign = "left";
                    ctx.textBaseline = "alphabetic";
                    if (it.kind === "img") {
                        ctx.drawImage(it.img, x + it.x, y + 0.5, it.w, it.h - 2.5);
                    } else {
                        if (it.no != null) { ctx.font = "bold " + BK.font + "px " + FONT; ctx.fillText(it.no + ".", x, y + BK.font); }
                        if (it.letter) { ctx.font = "bold " + BK.font + "px " + FONT; ctx.fillText(it.letter + ")", x + it.x - 6, y + BK.font); }
                        ctx.font = BK.font + "px " + FONT;
                        ctx.fillText(it.text, x + it.x, y + BK.font);
                    }
                    y += it.h;
                });
                y += 4;
                if (onProgress && qi % 10 === 9) onProgress((qi + 1) / qs.length);
            });
            pages.push(canvasPage(pg.canvas, 0.86));
            return makePdf(pages, { title: "Soru kitapçığı · " + (info.title || ""), author: info.name });
        });
    }

    var api = { makePdf: makePdf, formPdf: formPdf, bookletPdf: bookletPdf, b64ToBytes: b64ToBytes, bytesToB64: bytesToB64 };
    global.KpssPdf = api;
})(typeof window !== "undefined" ? window : globalThis);
