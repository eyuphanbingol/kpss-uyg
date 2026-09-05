(function (global) {
    var client = null;
    var RECOVERY_KEY = "kpss-password-recovery";
    var capturedHref = String(window.location.href || "");
    var capturedSearch = String(window.location.search || "");
    var capturedHash = String(window.location.hash || "");
    var recoverInflight = null;

    function sleep(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    function looksRecovery(search, hash) {
        var s = String(search || "");
        var h = String(hash || "");
        return /(?:[?&]reset=)/.test(s)
            || /(?:[?&]type=recovery)/.test(s)
            || /type=recovery/.test(h)
            || /access_token=/.test(h)
            || /(?:[?&]access_token=)/.test(s)
            || /(?:[?&]code=)/.test(s)
            || /(?:[?&]token_hash=)/.test(s)
            || /(?:[?&]token=)/.test(s);
    }

    function recoveryFromUrl() {
        return looksRecovery(capturedSearch, capturedHash) || looksRecovery(window.location.search, window.location.hash);
    }

    function recoveryPending() {
        try {
            if (sessionStorage.getItem(RECOVERY_KEY) === "1") return true;
        } catch (e) {}
        return recoveryFromUrl();
    }

    function markRecovery() {
        try { sessionStorage.setItem(RECOVERY_KEY, "1"); } catch (e) {}
    }

    function clearRecoveryFlag() {
        try { sessionStorage.removeItem(RECOVERY_KEY); } catch (e) {}
    }

    function stripRecoveryUrl() {
        try {
            var u = new URL(window.location.href);
            ["reset", "type", "code", "token", "token_hash", "access_token", "refresh_token", "error", "error_description", "error_code"].forEach(function (k) {
                u.searchParams.delete(k);
            });
            var next = u.pathname + (u.search || "");
            history.replaceState({}, "", next);
        } catch (e) {}
    }

    function clearRecovery() {
        clearRecoveryFlag();
        stripRecoveryUrl();
        capturedSearch = "";
        capturedHash = "";
        capturedHref = window.location.href;
    }

    function paramsFrom(search, hash) {
        var q = new URLSearchParams(String(search || "").replace(/^\?/, ""));
        var hp = new URLSearchParams(String(hash || "").replace(/^#/, ""));
        hp.forEach(function (v, k) {
            if (!q.get(k)) q.set(k, v);
        });
        return q;
    }

    async function waitForSession(sb, tries) {
        for (var i = 0; i < tries; i++) {
            try {
                var cur = await sb.auth.getSession();
                if (cur.data && cur.data.session) return cur.data.session;
            } catch (e) {}
            await sleep(200);
        }
        return null;
    }

    async function doEstablishRecoverySession() {
        var sb = getClient();
        if (!sb) return null;

        var q = paramsFrom(capturedSearch || window.location.search, capturedHash || window.location.hash);
        var at = q.get("access_token");
        var rt = q.get("refresh_token") || "";
        if (at) {
            try {
                var setRes = await sb.auth.setSession({ access_token: at, refresh_token: rt });
                if (!setRes.error && setRes.data && setRes.data.session) {
                    markRecovery();
                    return setRes.data.session;
                }
            } catch (e) {}
        }

        var tokenHash = q.get("token_hash") || q.get("token");
        var type = q.get("type") || "recovery";
        if (tokenHash && tokenHash.length > 20 && !q.get("code")) {
            try {
                var otp = await sb.auth.verifyOtp({ token_hash: tokenHash, type: type });
                if (!otp.error && otp.data && otp.data.session) {
                    markRecovery();
                    return otp.data.session;
                }
            } catch (e) {}
        }

        var existing = await waitForSession(sb, 12);
        if (existing) {
            markRecovery();
            return existing;
        }

        if (q.get("code") && typeof sb.auth.exchangeCodeForSession === "function") {
            try {
                var ex = await sb.auth.exchangeCodeForSession(capturedHref || window.location.href);
                if (!ex.error && ex.data && ex.data.session) {
                    markRecovery();
                    return ex.data.session;
                }
            } catch (e) {}
        }

        existing = await waitForSession(sb, 8);
        if (existing) markRecovery();
        return existing;
    }

    function establishRecoverySession() {
        if (recoverInflight) return recoverInflight;
        recoverInflight = doEstablishRecoverySession().then(function (sess) {
            recoverInflight = null;
            return sess;
        }, function (err) {
            recoverInflight = null;
            throw err;
        });
        return recoverInflight;
    }

    function creds() {
        var app = global.APP_CONFIG || {};
        var kpss = global.KpssConfig || {};
        return {
            url: app.SUPABASE_URL || kpss.supabaseUrl,
            key: app.SUPABASE_ANON_KEY || kpss.supabaseAnonKey
        };
    }

    function getClient() {
        if (client) return client;
        var c = creds();
        if (!global.supabase || !c.url || !c.key) return null;
        try {
            client = global.supabase.createClient(c.url, c.key, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    flowType: "pkce"
                },
                global: {
                    fetch: function (input, init) {
                        return window.fetch(input, init);
                    }
                }
            });
            client.auth.onAuthStateChange(function (event) {
                if (event === "PASSWORD_RECOVERY") markRecovery();
                if (event === "SIGNED_IN" && (recoveryPending() || recoveryFromUrl())) markRecovery();
                if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
                    if (recoveryPending() || recoveryFromUrl()) return;
                    if (global.SyncEngine && global.SyncEngine.sync) global.SyncEngine.sync();
                }
            });
            if (recoveryFromUrl()) establishRecoverySession();
        } catch (e) {
            client = null;
        }
        return client;
    }

    global.SupabaseClient = {
        get: getClient,
        ready: function () { return !!getClient(); },
        recoveryPending: recoveryPending,
        markRecovery: markRecovery,
        clearRecovery: clearRecovery,
        clearRecoveryFlag: clearRecoveryFlag,
        establishRecoverySession: establishRecoverySession
    };
})(window);
