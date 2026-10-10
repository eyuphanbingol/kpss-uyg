// Gömülü WebView'lar (harita, optik, kart) yalnızca kendi HTML'imizi çalıştırır.
// İçeriden başka bir siteye geçilirse o sayfa uygulamayla mesajlaşamasın diye gezinme engellenir.
export function inlineOnly(req) {
    var url = String((req && req.url) || "");
    return url === "" || /^(about:|data:|blob:)/i.test(url) || url.indexOf("https://www.atanly.com/") === 0;
}
