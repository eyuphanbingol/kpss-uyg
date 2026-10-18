// Ortak reklam altyapısı: render(t) tamamen t'ye bağlı (deterministik), Playwright kare kare çeker.
// Güvenli alan (Reels/TikTok): önemli içerik y=170..1540 ve x=60..1000 arasında.
(function () {
    var css = "" +
        "@font-face{font-family:Manrope;font-weight:800;src:url(assets/fonts/manrope-latin-ext-800-normal.woff2)}" +
        "@font-face{font-family:Manrope;font-weight:800;src:url(assets/fonts/manrope-latin-800-normal.woff2);unicode-range:U+0000-00FF}" +
        "@font-face{font-family:Inter;font-weight:500;src:url(assets/fonts/inter-latin-ext-500-normal.woff2)}" +
        "@font-face{font-family:Inter;font-weight:500;src:url(assets/fonts/inter-latin-500-normal.woff2);unicode-range:U+0000-00FF}" +
        "@font-face{font-family:Inter;font-weight:600;src:url(assets/fonts/inter-latin-ext-600-normal.woff2)}" +
        "@font-face{font-family:Inter;font-weight:600;src:url(assets/fonts/inter-latin-600-normal.woff2);unicode-range:U+0000-00FF}" +
        "*{margin:0;padding:0;box-sizing:border-box}" +
        "html,body{width:1080px;height:1920px;overflow:hidden;background:#020f15}" +
        "#stage{position:absolute;inset:0;overflow:hidden;font-family:Inter;color:#fff}" +
        "#bg{position:absolute;inset:-160px;background:radial-gradient(900px 800px at 15% 10%, rgba(29,138,153,.55), transparent 60%),radial-gradient(900px 800px at 90% 95%, rgba(197,160,89,.30), transparent 60%),linear-gradient(165deg,#021219 0%,#0B2744 55%,#0D4352 100%)}" +
        "#grid{position:absolute;inset:-60px;opacity:.05;background-image:linear-gradient(rgba(255,255,255,.9) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.9) 1px,transparent 1px);background-size:60px 60px}" +
        "#cam{position:absolute;inset:0}" +
        ".sc{position:absolute;inset:0;display:none}" +
        ".h{font-family:Manrope;font-weight:800;letter-spacing:-3px;line-height:1.02;text-align:center}" +
        ".gold{background:linear-gradient(100deg,#F8E4AE,#E0BB66 45%,#C29A4E);-webkit-background-clip:text;background-clip:text;color:transparent}" +
        ".goldbg{background:linear-gradient(100deg,#F8E4AE,#E0BB66 45%,#C29A4E)}" +
        ".ch{display:inline-block;will-change:transform,opacity}" +
        "#flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:40}" +
        "#bar{position:absolute;left:0;top:0;height:8px;z-index:41}" +
        ".part{position:absolute;border-radius:50%}" +
        ".pill{display:inline-flex;align-items:center;gap:16px;font-weight:600;border-radius:999px}" +
        ".card{position:absolute;border-radius:44px;background:#F7F9FC;color:#0D2C4D;box-shadow:0 60px 140px -30px rgba(0,0,0,.85)}" +
        ".phone{position:absolute;border-radius:84px;background:#0b0f14;padding:18px;box-shadow:0 70px 140px -30px rgba(0,0,0,.85),0 0 0 3px rgba(255,255,255,.14)}" +
        ".screen{position:relative;width:100%;height:100%;border-radius:68px;overflow:hidden;background:#F6F8FB;color:#0D2C4D}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    document.body.innerHTML = '<div id="stage"><div id="bg"></div><div id="grid"></div><div id="cam"></div><div id="flash"></div><div id="bar" class="goldbg"></div></div>';
})();
function cl(x, a, b) { return Math.max(a, Math.min(b, x)); }
function seg(t, a, b) { return cl((t - a) / (b - a), 0, 1); }
function eo(x) { return 1 - Math.pow(1 - x, 3); }
function eo5(x) { return 1 - Math.pow(1 - x, 5); }
function eio(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function eb(x) { var c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
function rnd(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var cam = document.getElementById("cam");
function E(tag, css, html, p) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; (p || cam).appendChild(e); return e; }
function chars(s, cls) { return s.split("").map(function (c) { return '<span class="ch ' + (cls || "") + '">' + (c === " " ? "&nbsp;" : c) + '</span>'; }).join(""); }
function animChars(root, t, at, stag, dy) { var cs = root.querySelectorAll(".ch"); for (var i = 0; i < cs.length; i++) { var p = eo5(seg(t, at + i * stag, at + i * stag + .4)); cs[i].style.opacity = cl(p * 1.5, 0, 1); cs[i].style.transform = "translateY(" + ((1 - p) * (dy || 110)) + "px) scale(" + (.6 + .4 * p) + ") rotate(" + ((1 - p) * 10) + "deg)"; } }
function words(s, cls) { return s.split(" ").map(function (w) { return '<span class="ch ' + (cls || "") + '">' + w + '</span>'; }).join(" "); }
function animWords(root, t, at, stag) { var cs = root.querySelectorAll(".ch"); for (var i = 0; i < cs.length; i++) { var p = eo5(seg(t, at + i * stag, at + i * stag + .35)); cs[i].style.opacity = cl(p * 1.4, 0, 1); cs[i].style.transform = "translateY(" + ((1 - p) * 30) + "px)"; cs[i].style.filter = "blur(" + ((1 - p) * 8) + "px)"; } }
function rise(e, t, at, dy) { var p = eo(seg(t, at, at + .4)); e.style.opacity = p; e.style.transform = "translateY(" + ((1 - p) * (dy || 50)) + "px)"; }
function pop(e, t, at, d) { var p = eb(seg(t, at, at + (d || .32))); e.style.opacity = cl(seg(t, at, at + .08) * 12, 0, 1); e.style.transform = "scale(" + p + ")"; }
var SC = {}, FN = {};
function scene(id, a, b, fn) { var d = E("div"); d.className = "sc"; SC[id] = { el: d, a: a, b: b }; FN[id] = fn; return d; }
var PT = [];
function particles(n, col) { for (var i = 0; i < n; i++) { var e = E("div", "width:" + (4 + rnd(i) * 8) + "px;height:" + (4 + rnd(i) * 8) + "px;background:" + (col || "rgba(242,211,138,") + (.15 + rnd(i + 1) * .4) + ")", null, document.getElementById("stage")); e.className = "part"; PT.push(e); } }
// Konfeti: deterministik patlama
function confetti(root, n, cx, cy) { var arr = []; var cols = ["#F2D38A", "#34D399", "#60A5FA", "#F472B6", "#FBBF24", "#fff"]; for (var i = 0; i < n; i++) arr.push(E("div", "position:absolute;left:0;top:0;width:" + (12 + rnd(i + 40) * 14) + "px;height:" + (8 + rnd(i + 80) * 10) + "px;border-radius:3px;background:" + cols[i % cols.length], null, root)); return { els: arr, cx: cx, cy: cy }; }
function confettiAt(c, lt) { c.els.forEach(function (e, i) { if (lt < 0) { e.style.opacity = 0; return; } var a = rnd(i + 3) * Math.PI * 2, v = 600 + rnd(i + 9) * 1100; var x = c.cx + Math.cos(a) * v * lt * .9, y = c.cy + Math.sin(a) * v * lt * .9 - 300 * lt + 1400 * lt * lt; e.style.opacity = cl(1.6 - lt, 0, 1); e.style.transform = "translate(" + x + "px," + y + "px) rotate(" + (lt * 720 * (rnd(i) - .5) * 2) + "deg)"; }); }
var CUTS = [], FLASH = [], BGMOOD = null;
function render(t) {
    var punch = 0; CUTS.forEach(function (c) { var d = t - c; if (d >= 0 && d < .3) punch = Math.max(punch, 1 - d / .3); });
    var shx = (rnd(Math.floor(t * 30)) - .5) * 22 * punch, shy = (rnd(Math.floor(t * 30) + 7) - .5) * 22 * punch;
    cam.style.transform = "translate(" + shx + "px," + shy + "px) scale(" + (1 + .035 * punch) + ")";
    var fl = 0; FLASH.forEach(function (c) { var d = t - c; if (d >= 0 && d < .18) fl = Math.max(fl, (1 - d / .18) * .7); }); document.getElementById("flash").style.opacity = fl;
    document.getElementById("bg").style.transform = "translate(" + (Math.sin(t * .4) * 60) + "px," + (Math.cos(t * .35) * 50) + "px) rotate(" + (t * .6) + "deg)";
    document.getElementById("grid").style.transform = "translateY(" + ((t * 50) % 60) + "px)";
    document.getElementById("bar").style.width = (t / window.DUR * 1080) + "px";
    if (BGMOOD) BGMOOD(t);
    PT.forEach(function (e, i) { var y = (2020 - ((t * (50 + rnd(i + 5) * 90) + rnd(i + 3) * 2000) % 2100)); e.style.transform = "translate(" + (rnd(i + 2) * 1080 + Math.sin(t + i) * 30) + "px," + y + "px)"; });
    for (var k in SC) { var s = SC[k]; var vis = t >= s.a && t <= s.b; s.el.style.display = vis ? "block" : "none"; if (!vis) continue; s.el.style.opacity = Math.min(seg(t, s.a, s.a + .12), 1 - seg(t, s.b - .12, s.b)); FN[k](t); }
}
function start(dur) { window.DUR = dur; window.render = render; window.__ready = document.fonts.ready.then(function () { render(0); return true; }); }
// Ortak kapanış (CTA)
function ctaScene(a, b, line1, line2) {
    var s = scene("cta", a, b, function (t) {
        var lt = t - a;
        var p = eb(seg(lt, .05, .45)); lg.style.opacity = cl(seg(lt, .05, .15) * 10, 0, 1); lg.style.transform = "scale(" + p + ") rotate(" + ((1 - eo(seg(lt, .05, .45))) * -25) + "deg)";
        animChars(nm, lt, .3, .045, 90);
        rise(l1, lt, .7, 30); rise(l2, lt, .85, 30);
        var bp = eb(seg(lt, 1.0, 1.35)); btn.style.opacity = cl(seg(lt, 1.0, 1.1) * 10, 0, 1); btn.style.transform = "scale(" + (bp * (1 + .045 * Math.sin(Math.max(0, lt - 1.4) * 2 * Math.PI))) + ")";
        rise(url, lt, 1.25, 20);
        glow.style.opacity = .55 + .25 * Math.sin(lt * 2.4); glow.style.transform = "scale(" + (1 + .06 * Math.sin(lt * 1.7)) + ")";
    });
    var glow = E("div", "position:absolute;left:190px;top:280px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(242,211,138,.35),transparent 65%)", null, s);
    var lg = E("img", "position:absolute;left:400px;top:400px;width:280px;height:280px;border-radius:66px;box-shadow:0 50px 120px -20px rgba(0,0,0,.8),0 0 0 3px rgba(255,255,255,.14)", null, s); lg.src = "assets/icon.png";
    var nm = E("div", "position:absolute;left:0;right:0;top:740px", "<div class='h' style='font-size:150px'>" + chars("Atanly") + "</div>", s);
    var l1 = E("div", "position:absolute;left:60px;right:60px;top:930px;text-align:center", "<div class='h gold' style='font-size:76px;letter-spacing:-2px'>" + line1 + "</div>", s);
    var l2 = E("div", "position:absolute;left:60px;right:60px;top:1030px;text-align:center;font-weight:600;font-size:40px;color:rgba(255,255,255,.85)", line2, s);
    var btn = E("div", "position:absolute;left:0;right:0;top:1170px;text-align:center", "<span class='goldbg' style='display:inline-block;font-family:Manrope;font-weight:800;font-size:68px;padding:38px 100px;border-radius:999px;color:#1a1405;box-shadow:0 30px 90px -20px rgba(224,187,102,.85)'>Ücretsiz başla</span>", s);
    var url = E("div", "position:absolute;left:0;right:0;top:1380px;text-align:center;font-family:Manrope;font-weight:800;font-size:52px;letter-spacing:1px", "atanly.com", s);
    return s;
}
