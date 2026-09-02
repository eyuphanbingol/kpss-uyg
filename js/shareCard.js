(function (global) {
    function draw(opts) {
        opts = opts || {};
        var c = document.createElement("canvas");
        c.width = 1080;
        c.height = 1920;
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#0D2C4D";
        ctx.fillRect(0, 0, 1080, 1920);
        ctx.fillStyle = "#C5A059";
        ctx.font = "700 42px Manrope, sans-serif";
        ctx.fillText("ATANOM", 80, 160);
        ctx.fillStyle = "rgba(243,230,196,0.7)";
        ctx.font = "400 28px Inter, sans-serif";
        ctx.fillText(opts.nickname || "öğrenci", 80, 220);
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

    global.ShareCard = { draw: draw, download: download };
})(window);
