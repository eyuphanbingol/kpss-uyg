(function (global) {
    function draw(opts) {
        opts = opts || {};
        var c = document.createElement("canvas");
        c.width = 1080;
        c.height = 1920;
        var ctx = c.getContext("2d");
        var g = ctx.createLinearGradient(0, 0, 0, 1920);
        g.addColorStop(0, "#312e81");
        g.addColorStop(1, "#6d28d9");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1080, 1920);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 54px Inter, sans-serif";
        ctx.fillText("KPSS Eğitim Alanı", 80, 180);
        ctx.font = "32px Inter, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText(opts.nickname || "öğrenci", 80, 250);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 160px Inter, sans-serif";
        ctx.fillText("%" + (opts.pct != null ? opts.pct : 0), 80, 620);
        ctx.font = "40px Inter, sans-serif";
        ctx.fillText((opts.correct || 0) + " doğru / " + (opts.total || 0) + " soru", 80, 720);
        ctx.fillText("Seri: " + (opts.streak || 0) + " gün", 80, 800);
        ctx.font = "28px Inter, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillText(opts.caption || "Bugünkü tur", 80, 1700);
        return c.toDataURL("image/png");
    }

    function download(dataUrl, name) {
        var a = document.createElement("a");
        a.href = dataUrl;
        a.download = name || "kpss-kart.png";
        a.click();
        if (global.StudentStore) global.StudentStore.bumpShare();
    }

    global.ShareCard = { draw: draw, download: download };
})(window);
