export var SITE = "https://www.atanly.com";

function encodeSrc(url) {
    try {
        return encodeURI(decodeURI(url));
    } catch (e) {
        return encodeURI(url);
    }
}

export function mediaUrl(src) {
    if (!src) return null;
    var s = String(src).trim();
    if (!s) return null;
    if (/^data:/i.test(s)) return s;
    if (/^https?:\/\//i.test(s)) return encodeSrc(s);
    s = s.replace(/^\.\//, "").replace(/^\/+/, "");
    return encodeSrc(SITE + "/" + s);
}

export function rewriteHtmlMedia(html) {
    return String(html || "").replace(/(src|href)=(["'])([^"']+)\2/gi, function (_m, attr, q, url) {
        if (/^(https?:|data:|mailto:|#|javascript:)/i.test(url)) {
            if (/^https?:/i.test(url)) return attr + "=" + q + encodeSrc(url) + q;
            return attr + "=" + q + url + q;
        }
        var abs = mediaUrl(url);
        return attr + "=" + q + (abs || url) + q;
    });
}

export function questionImages(soru) {
    if (!soru) return [];
    var raw = soru.imgs || (soru.img ? (Array.isArray(soru.img) ? soru.img : [soru.img]) : []);
    return raw.map(mediaUrl).filter(Boolean);
}
