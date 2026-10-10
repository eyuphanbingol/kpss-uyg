// Giriş / kayıt yardımcıları: e-posta alan adı yazım önerisi ve şifre gücü.
// Web karşılığı js/components/AuthScreen.jsx içindeki suggestEmail / passRules / passScore.

var MAIL_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com", "yandex.com", "live.com", "msn.com", "windowslive.com", "hotmail.com.tr", "outlook.com.tr"];

function lev(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[a.length][b.length];
}

// "ad@gmial.com" → "ad@gmail.com"; tanınan alan adıysa ya da çok farklıysa null
export function suggestEmail(email) {
    var m = /^([^@\s]+)@([^@\s]+)$/.exec(String(email || "").trim());
    if (!m) return null;
    var dom = m[2].toLowerCase();
    if (MAIL_DOMAINS.indexOf(dom) >= 0) return null;
    var best = null, bd = 3;
    MAIL_DOMAINS.forEach(function (c) { var x = lev(dom, c); if (x < bd) { bd = x; best = c; } });
    return best && bd > 0 && bd <= 2 ? m[1] + "@" + best : null;
}

export function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function passRules(p) {
    p = String(p || "");
    return [
        { ok: p.length >= 8, t: "En az 8 karakter" },
        { ok: /\d/.test(p) && /[a-zçğıöşü]/i.test(p), t: "Harf ve rakam" },
        { ok: /[A-ZÇĞİÖŞÜ]/.test(p) && /[a-zçğıöşü]/.test(p), t: "Büyük ve küçük harf" }
    ];
}

// 0 boş · 1 zayıf · 2 idare eder · 3 iyi · 4 güçlü
export function passScore(p) {
    if (!p) return 0;
    if (p.length < 6) return 1;
    var n = passRules(p).filter(function (r) { return r.ok; }).length;
    return Math.max(1, Math.min(4, n + (p.length >= 12 ? 1 : 0)));
}

export var SCORE_TXT = ["", "Zayıf", "İdare eder", "İyi", "Güçlü"];
export var SCORE_CLR = ["#E2E8F0", "#E11D48", "#D97706", "#14B8A6", "#047857"];
