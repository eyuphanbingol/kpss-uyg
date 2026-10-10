#!/usr/bin/env node
// Supabase Auth e-posta şablonlarını (Türkçe, Atanly tasarımı) üretir:
//   node scripts/build-email-templates.js  →  supabase/email-templates/*.html
// Her dosyanın içeriği Supabase panelinde Authentication → Emails → Templates'e yapıştırılır.
// Konu satırları ve kurulum adımları: supabase/email-templates/README.md
// Şablon değişkenleri Supabase'in Go şablonlarıdır: {{ .ConfirmationURL }}, {{ .Token }}, {{ .Email }},
// {{ .NewEmail }}, {{ .TokenHash }}, {{ .Data.full_name }} (kayıtta gönderilen ad).
// Kayıt onayı ve şifre sıfırlama bağlantıları atanly.com üzerinden gider (gönderen alan adıyla aynı:
// spam filtreleri farklı alan adına giden bağlantıyı şüpheli sayar; ayrıca bağlantı başka cihazda da açılır).
// auth/callback.html ve auth/reset.html bağlantıyı uygulamaya ya da siteye iletir; doğrulama
// js/supabaseClient.js (web) ve mobile/src/AppProvider.js (mobil) içinde verifyOtp ile yapılır.
var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var outDir = path.join(root, "supabase", "email-templates");
var SITE = "https://www.atanly.com";
var LOGO = SITE + "/icons/atanom.png";

var GREET = '{{ if .Data.full_name }}Merhaba {{ .Data.full_name }},{{ else }}Merhaba,{{ end }}';

function layout(o) {
    var url = o.link || "{{ .ConfirmationURL }}";
    var button = o.cta ? (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px">' +
        '<tr><td style="border-radius:14px;background:#0D2C4D;background-image:linear-gradient(135deg,#0D2C4D,#14607A 60%,#1D8A99)">' +
        '<a href="' + url + '" target="_blank" style="display:inline-block;padding:15px 30px;font:700 16px/1 Arial,Helvetica,sans-serif;color:#FFFFFF;text-decoration:none;border-radius:14px">' + o.cta + '</a>' +
        '</td></tr></table>' +
        '<p style="margin:18px 0 0;font:13px/1.6 Arial,Helvetica,sans-serif;color:#64748B">Düğme çalışmazsa bu bağlantıyı tarayıcına yapıştır:<br>' +
        '<a href="' + url + '" style="color:#127880;word-break:break-all">' + url + '</a></p>'
    ) : "";
    var code = o.code ? (
        '<div style="margin:26px 0 8px;padding:18px;border-radius:14px;background:#F1F5F9;text-align:center;font:800 30px/1 \'Courier New\',monospace;letter-spacing:8px;color:#0D2C4D">{{ .Token }}</div>'
    ) : "";
    return '<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
        '<meta name="color-scheme" content="light">\n<title>' + o.title + '</title>\n</head>\n' +
        '<body style="margin:0;padding:0;background:#F1F5F9">\n' +
        // Gelen kutusunda konu satırının yanında görünen önizleme metni
        '<div style="display:none;max-height:0;overflow:hidden;opacity:0">' + o.preheader + '</div>\n' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1F5F9">\n<tr><td align="center" style="padding:32px 16px">\n' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">\n' +
        // Başlık bandı
        '<tr><td style="background:#0D2C4D;border-radius:20px 20px 0 0;padding:26px 32px">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
        '<td style="vertical-align:middle"><img src="' + LOGO + '" width="52" height="42" alt="" style="display:block;border:0;outline:none;text-decoration:none"></td>' +
        '<td style="vertical-align:middle;padding-left:12px;font:800 22px/1 Arial,Helvetica,sans-serif;color:#FFFFFF;letter-spacing:.2px">Atanly' +
        '<div style="margin-top:6px;font:700 11px/1 Arial,Helvetica,sans-serif;color:#E7CF8F;letter-spacing:1.5px">KPSS · ATAMAYA GİDEN YOL</div></td>' +
        '</tr></table></td></tr>\n' +
        // Gövde
        '<tr><td style="background:#FFFFFF;border-radius:0 0 20px 20px;padding:34px 32px 30px;border:1px solid #E2E8F0;border-top:0">' +
        '<h1 style="margin:0 0 16px;font:800 24px/1.3 Arial,Helvetica,sans-serif;color:#0F172A">' + o.heading + '</h1>' +
        '<p style="margin:0 0 12px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#334155">' + GREET + '</p>' +
        o.body.map(function (p) { return '<p style="margin:0 0 12px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#334155">' + p + '</p>'; }).join("") +
        button + code +
        '<div style="margin:28px 0 0;padding:14px 16px;border-radius:12px;background:#FFFBEB;border:1px solid #FDE68A;font:13px/1.55 Arial,Helvetica,sans-serif;color:#92400E">' + o.note + '</div>' +
        '</td></tr>\n' +
        // Alt bilgi
        '<tr><td style="padding:22px 12px 0;text-align:center;font:12px/1.6 Arial,Helvetica,sans-serif;color:#94A3B8">' +
        'Bu e-postayı {{ .Email }} adresine, Atanly hesabınla ilgili bir işlem yapıldığı için gönderdik.<br>' +
        '<a href="' + SITE + '" style="color:#127880;text-decoration:none">atanly.com</a> · ' +
        '<a href="' + SITE + '/yasal/gizlilik.html" style="color:#94A3B8">Gizlilik</a> · ' +
        '<a href="' + SITE + '/yasal/aydinlatma.html" style="color:#94A3B8">KVKK</a>' +
        '</td></tr>\n</table>\n</td></tr>\n</table>\n</body>\n</html>\n';
}

var TEMPLATES = [
    {
        file: "confirm-signup.html", panel: "Confirm signup", subject: "Atanly hesabını onayla",
        title: "Hesabını onayla", preheader: "Tek dokunuşla hesabını onayla ve çalışmaya başla.",
        heading: "Atanly'ye hoş geldin! 👋",
        body: ["Hesabını oluşturduk. Son bir adım kaldı: aşağıdaki düğmeye dokunarak e-posta adresini onayla.",
            "Onaydan sonra ilerlemen, programın ve yanlış defterin bu hesapta saklanır; web'de ve telefonda aynı yerden devam edersin."],
        cta: "Hesabımı onayla",
        link: SITE + "/auth/callback?token_hash={{ .TokenHash }}&type=email",
        note: "Bu kaydı sen yapmadıysan bu e-postayı yok sayabilirsin; onaylanmayan hesap kullanılamaz."
    },
    {
        file: "reset-password.html", panel: "Reset password", subject: "Atanly şifre sıfırlama",
        title: "Şifreni sıfırla", preheader: "Yeni şifreni belirlemek için bağlantıya dokun.",
        heading: "Şifreni sıfırla",
        body: ["Hesabın için şifre sıfırlama isteği aldık. Yeni şifreni belirlemek için aşağıdaki düğmeye dokun."],
        cta: "Yeni şifre belirle",
        link: SITE + "/auth/reset?token_hash={{ .TokenHash }}&type=recovery",
        note: "Bu isteği sen yapmadıysan bu e-postayı yok say; şifren değişmez. Bağlantı kısa bir süre sonra geçersiz olur."
    },
    {
        file: "magic-link.html", panel: "Magic link", subject: "Atanly giriş bağlantın",
        title: "Giriş bağlantın", preheader: "Şifresiz giriş için bağlantıya dokun.",
        heading: "Giriş bağlantın hazır",
        body: ["Atanly'ye şifresiz giriş yapmak için aşağıdaki düğmeye dokun."],
        cta: "Giriş yap",
        note: "Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin. Bağlantı tek kullanımlıktır."
    },
    {
        file: "change-email.html", panel: "Change email address", subject: "Atanly e-posta değişikliğini onayla",
        title: "E-posta değişikliği", preheader: "Yeni e-posta adresini onayla.",
        heading: "E-posta değişikliğini onayla",
        body: ["Hesabının e-posta adresini <b>{{ .Email }}</b> yerine <b>{{ .NewEmail }}</b> olarak değiştirmek istedin. Onaylamak için aşağıdaki düğmeye dokun."],
        cta: "Değişikliği onayla",
        note: "Bu değişikliği sen istemediysen bu e-postayı yok say ve şifreni değiştir."
    },
    {
        file: "invite.html", panel: "Invite user", subject: "Atanly'ye davet edildin",
        title: "Davet", preheader: "Atanly'de hesabını oluşturmak için daveti kabul et.",
        heading: "Atanly'ye davet edildin",
        body: ["KPSS çalışma odası Atanly'ye davet edildin. Daveti kabul edip şifreni belirlemek için aşağıdaki düğmeye dokun."],
        cta: "Daveti kabul et",
        note: "Bu daveti beklemiyorsan e-postayı yok sayabilirsin."
    },
    {
        file: "reauthentication.html", panel: "Reauthentication", subject: "Atanly doğrulama kodun",
        title: "Doğrulama kodu", preheader: "İşlemi onaylamak için doğrulama kodun.",
        heading: "Doğrulama kodun",
        body: ["Hassas bir işlemi onaylamak için aşağıdaki kodu uygulamaya gir."],
        code: true,
        note: "Bu kodu kimseyle paylaşma. İşlemi sen başlatmadıysan şifreni değiştir."
    }
];

fs.mkdirSync(outDir, { recursive: true });
TEMPLATES.forEach(function (t) {
    fs.writeFileSync(path.join(outDir, t.file), layout(t));
    console.log("supabase/email-templates/" + t.file + " yazıldı (" + t.panel + " · konu: " + t.subject + ")");
});
module.exports = { TEMPLATES: TEMPLATES };
