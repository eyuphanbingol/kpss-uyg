// Paylaşım görselleri: net kartı ve akıllı program görseli.
// Web'de doğrudan çalışır; mobilde aynı dosya gizli bir WebView'da çalışır
// (scripts/sync-map-data.js → mobile/src/lib/cardHtml.js, mobile/src/components/CardWorker.js).
(function (global) {
    var logoImg = new Image();
    var logoDone = false, logoWait = [];
    function logoReady() { logoDone = true; logoWait.splice(0).forEach(function (cb) { cb(); }); }
    logoImg.onload = logoReady;
    logoImg.onerror = logoReady;
    logoImg.src = (global.KpssConfig && global.KpssConfig.logoUrl) || "icons/atanom.png?v=18";

    // Logo yüklenince (ya da en çok 2 sn sonra) çağır.
    function ready(cb) {
        if (logoDone || logoImg.complete) { cb(); return; }
        logoWait.push(cb);
        setTimeout(function () { var i = logoWait.indexOf(cb); if (i >= 0) { logoWait.splice(i, 1); cb(); } }, 2000);
    }

    function draw(opts) {
        opts = opts || {};
        var c = document.createElement("canvas");
        c.width = 1080;
        c.height = 1920;
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#041C24";
        ctx.fillRect(0, 0, 1080, 1920);
        if (!opts.noLogo && logoImg.complete && logoImg.naturalWidth) {
            ctx.drawImage(logoImg, 80, 70, 160, 130);
        }
        ctx.fillStyle = "#C5A059";
        ctx.font = "700 42px Manrope, sans-serif";
        ctx.fillText("ATANLY", 270, 160);
        ctx.fillStyle = "rgba(243,230,196,0.7)";
        ctx.font = "400 28px Inter, sans-serif";
        ctx.fillText(opts.nickname || "öğrenci", 270, 220);
        ctx.fillStyle = "#C9A227";
        ctx.font = "700 200px 'Space Grotesk', sans-serif";
        ctx.fillText("%" + (opts.pct != null ? opts.pct : 0), 80, 620);
        ctx.fillStyle = "#fff";
        ctx.font = "500 40px Inter, sans-serif";
        ctx.fillText((opts.correct || 0) + " doğru / " + (opts.total || 0) + " soru", 80, 740);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = "28px Inter, sans-serif";
        ctx.fillText("Seri " + (opts.streak || 0) + " gün", 80, 810);
        ctx.fillText(opts.caption || "Net kartı", 80, 1760);
        return c.toDataURL("image/png");
    }

    function download(dataUrl, name) {
        var a = document.createElement("a");
        a.href = dataUrl;
        a.download = name || "kpss-kart.png";
        a.click();
        if (global.StudentStore) global.StudentStore.bumpShare();
    }

    // Program görseli (1080×1350); m = SmartPlan.imageModel(plan, name). Canvas döner.
    function drawPlan(m) {
        var W = 1080, H = 1350;
        var c = document.createElement("canvas");
        c.width = W; c.height = H;
        var g = c.getContext("2d");
        var bg = g.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, "#0D2C4D"); bg.addColorStop(1, "#14607a");
        g.fillStyle = bg; g.fillRect(0, 0, W, H);
        function text(t, x, y, size, weight, color, align) {
            g.font = (weight || 700) + " " + size + "px Inter, Manrope, system-ui, sans-serif";
            g.fillStyle = color || "#fff"; g.textAlign = align || "left"; g.fillText(t, x, y);
        }
        function fit(t, max, size, weight) {
            g.font = (weight || 600) + " " + size + "px Inter, system-ui, sans-serif";
            if (g.measureText(t).width <= max) return t;
            while (t.length > 4 && g.measureText(t + "…").width > max) t = t.slice(0, -1);
            return t + "…";
        }
        text("KPSS PROGRAMIM", 72, 120, 30, 800, "#5eead4");
        text(m.name ? m.name : "Akıllı çalışma takvimi", 72, 186, 58, 900);
        text(m.sub, 72, 246, 34, 600, "rgba(255,255,255,.85)");
        // dönem çubuğu
        var x = 72;
        m.phases.forEach(function (p) {
            var w = (W - 144) * p.days / m.total;
            if (w > 0) { g.fillStyle = p.color; g.fillRect(x, 292, w, 22); x += w; }
        });
        var lx = 72;
        m.phases.forEach(function (p) {
            if (!p.days) return;
            g.fillStyle = p.color; g.beginPath(); g.arc(lx + 9, 352, 9, 0, Math.PI * 2); g.fill();
            text(p.label, lx + 26, 362, 26, 600, "rgba(255,255,255,.85)");
            g.font = "600 26px Inter, Manrope, system-ui, sans-serif";
            lx += 26 + g.measureText(p.label).width + 34;
        });
        // haftalık kart
        g.fillStyle = "rgba(255,255,255,.96)";
        var top = 410, bh = 800;
        g.beginPath(); if (g.roundRect) g.roundRect(48, top, W - 96, bh, 36); else g.rect(48, top, W - 96, bh); g.fill();
        text("Bu hafta", 96, top + 76, 36, 800, "#0D2C4D");
        var rowH = (bh - 120) / 7;
        m.week.forEach(function (d, i) {
            var y = top + 120 + i * rowH;
            if (i) { g.fillStyle = "#e7e5e4"; g.fillRect(96, y - 8, W - 192, 2); }
            text(d.head, 96, y + 40, 28, 800, "#0f172a");
            d.lines.forEach(function (t, j) { text(fit(t, 600, 25, 600), 340, y + 28 + j * 34, 25, 600, j ? "#57534e" : "#0f766e"); });
            if (d.min) text(d.min, W - 96, y + 40, 26, 700, "#78716c", "right");
        });
        text("atanly.com · Kendi programını 1 dakikada oluştur", W / 2, H - 56, 30, 700, "rgba(255,255,255,.9)", "center");
        return c;
    }

    global.ShareCard = { draw: draw, download: download, ready: ready, drawPlan: drawPlan };
})(window);
