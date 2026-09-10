export function parseAuthUrl(url) {
    var out = {};
    function eat(chunk) {
        String(chunk || "").replace(/^[?#]/, "").split("&").forEach(function (part) {
            if (!part) return;
            var i = part.indexOf("=");
            var k = decodeURIComponent((i < 0 ? part : part.slice(0, i)).replace(/\+/g, " "));
            var v = decodeURIComponent((i < 0 ? "" : part.slice(i + 1)).replace(/\+/g, " "));
            if (k && v && !out[k]) out[k] = v;
        });
    }
    var u = String(url || "");
    var qi = u.indexOf("?");
    var hi = u.indexOf("#");
    if (qi >= 0) eat(u.slice(qi + 1, hi > qi ? hi : u.length));
    if (hi >= 0) eat(u.slice(hi + 1));
    var host = "";
    try {
        host = String(u.split("://")[1] || "").split(/[/?#]/)[0] || "";
    } catch (e) {}
    var type = String(out.type || "").toLowerCase();
    var isRecovery = type === "recovery" || host === "reset" || /\/reset(?:[/?#]|$)/i.test(u) || out.reset === "1";
    return {
        params: out,
        type: type,
        host: host,
        isRecovery: isRecovery,
        code: out.code || "",
        access_token: out.access_token || "",
        refresh_token: out.refresh_token || "",
        error: out.error || "",
        error_description: out.error_description || ""
    };
}

export function isRecoveryUrl(url) {
    return parseAuthUrl(url).isRecovery;
}
