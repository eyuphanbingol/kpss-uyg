// Kullanım: node render.js <sayfa.html> preview <t1,t2,..>  |  node render.js <sayfa.html> video <çıktı.mp4> [genişlik yükseklik]
const { chromium } = require(process.env.PW);
const fs = require("fs"), { spawn } = require("child_process");
(async () => {
  const page = process.argv[2], mode = process.argv[3], D = __dirname;
  const W = +(process.argv[5] || 1080), H = +(process.argv[6] || 1920);
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: W, height: H } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + D + "/" + page); await p.evaluate(() => window.__ready); await p.waitForTimeout(300);
  const tag = page.replace(/\.html$/, "");
  if (mode === "preview") {
    fs.mkdirSync(D + "/prev", { recursive: true });
    for (const t of process.argv[4].split(",").map(Number)) { await p.evaluate(t => window.render(t), t); await p.screenshot({ path: D + "/prev/" + tag + "-" + t + ".jpg", type: "jpeg", quality: 80 }); }
  } else {
    const fps = 30, n = Math.round((await p.evaluate(() => window.DUR)) * fps), out = process.argv[4];
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
    for (let i = 0; i < n; i++) { await p.evaluate(t => window.render(t), i / fps); const buf = await p.screenshot({ type: "jpeg", quality: 94 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r)); if (i % 150 === 0) console.log("kare", i, "/", n); }
    ff.stdin.end(); await new Promise(r => ff.on("close", r));
  }
  if (errs.length) console.log("ERR", errs.slice(0, 5));
  await b.close(); console.log("bitti");
})();
