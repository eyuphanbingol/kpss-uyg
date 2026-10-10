#!/usr/bin/env node
// Web stillerini derler: tailwind.config.js → css/tailwind.css (küçültülmüş).
// build:jsx sonunda ve katalog dışa aktarımından sonra kendiliğinden çalışır.
var cp = require("child_process"), fs = require("fs"), path = require("path");
var root = path.join(__dirname, "..");
var bin = path.join(root, "node_modules", ".bin", "tailwindcss");
if (!fs.existsSync(bin)) { console.error("tailwindcss yok: npm install"); process.exit(1); }
fs.mkdirSync(path.join(root, "css"), { recursive: true });
cp.execFileSync(bin, ["-c", path.join(root, "tailwind.config.js"), "-i", path.join(__dirname, "tailwind.in.css"),
    "-o", path.join(root, "css", "tailwind.css"), "--minify"], { cwd: root, stdio: ["ignore", "ignore", "inherit"] });
console.log("css/tailwind.css " + Math.round(fs.statSync(path.join(root, "css", "tailwind.css")).size / 1024) + " KB");
