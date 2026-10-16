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

// Google dönüşü (…/auth/callback?code=… ya da #access_token=…) için tek seferlik oturum açma.
// Aynı bağlantı hem giriş ekranına hem uygulamanın genel bağlantı dinleyicisine gelebilir; kod tek
// kullanımlık olduğu için ikinci çağrı ilkinin sonucunu bekler, yeniden denemez.
var oauthSeen = {};

// exchangeCodeForSession tam bağlantıyı değil yalnız kodu ister. sb_flow_id varsa doğrulayıcı o akışın
// kaydından okunur (supabase-js aynı anda birden çok giriş akışı tutabiliyor).
export function exchangeCode(client, parsed) {
    var flowId = parsed.params.sb_flow_id;
    return flowId
        ? client.auth.exchangeCodeForSession(parsed.code, { flowId: flowId })
        : client.auth.exchangeCodeForSession(parsed.code);
}
export function isOAuthReturnUrl(url) {
    var p = parseAuthUrl(url);
    return !p.isRecovery && !p.params.token_hash && !!(p.code || (p.access_token && p.refresh_token) || p.error);
}
export function sessionFromOAuthUrl(client, url) {
    var p = parseAuthUrl(url);
    if (p.error) return Promise.reject(new Error(p.error_description || p.error));
    var key = p.code || p.access_token;
    if (!key) return Promise.resolve(false);
    if (oauthSeen[key]) return oauthSeen[key];
    var run = p.code
        ? exchangeCode(client, p)
        : client.auth.setSession({ access_token: p.access_token, refresh_token: p.refresh_token });
    oauthSeen[key] = Promise.resolve(run).then(function (r) {
        if (r && r.error) throw r.error;
        return true;
    });
    return oauthSeen[key];
}
