(function (global) {
    var client = null;
    var RECOVERY_KEY = "kpss-password-recovery";

    function recoveryFromUrl() {
        var s = String(window.location.search || "");
        var h = String(window.location.hash || "");
        if (/(?:[?&]code=)/.test(s) && !/(?:[?&]reset=)/.test(s) && !/type=recovery/.test(s) && !/type=recovery/.test(h)) {
            return false;
        }
        return /(?:[?&]reset=)/.test(s) || /type=recovery/.test(s) || /type=recovery/.test(h);
    }

    function recoveryPending() {
        var s = String(window.location.search || "");
        if (/(?:[?&]code=)/.test(s) && !/(?:[?&]reset=)/.test(s) && !/type=recovery/.test(s)) {
            try { sessionStorage.removeItem(RECOVERY_KEY); } catch (e) {}
            return false;
        }
        try {
            if (sessionStorage.getItem(RECOVERY_KEY) === "1") return true;
        } catch (e) {}
        return recoveryFromUrl();
    }

    function markRecovery() {
        try { sessionStorage.setItem(RECOVERY_KEY, "1"); } catch (e) {}
    }

    function clearRecovery() {
        try { sessionStorage.removeItem(RECOVERY_KEY); } catch (e) {}
        try {
            var u = new URL(window.location.href);
            u.searchParams.delete("reset");
            u.searchParams.delete("type");
            var next = u.pathname + (u.search || "");
            if (/access_token|type=recovery|refresh_token/.test(u.hash || "")) {
                history.replaceState({}, "", next);
            } else {
                history.replaceState({}, "", next + (u.hash || ""));
            }
        } catch (e) {}
    }

    function hashParams() {
        var raw = String(window.location.hash || "").replace(/^#/, "");
        try { return new URLSearchParams(raw); } catch (e) { return new URLSearchParams(); }
    }

    async function establishRecoverySession() {
        var sb = getClient();
        if (!sb) return null;
        var hp = hashParams();
        var at = hp.get("access_token");
        var rt = hp.get("refresh_token");
        if (at) {
            var setRes = await sb.auth.setSession({ access_token: at, refresh_token: rt || "" });
            if (!setRes.error && setRes.data && setRes.data.session) return setRes.data.session;
        }
        var q = new URLSearchParams(window.location.search || "");
        if (!at && q.get("access_token")) {
            at = q.get("access_token");
            rt = q.get("refresh_token") || rt;
            var setQ = await sb.auth.setSession({ access_token: at, refresh_token: rt || "" });
            if (!setQ.error && setQ.data && setQ.data.session) return setQ.data.session;
        }
        var tokenHash = q.get("token_hash") || q.get("token");
        var type = q.get("type") || "recovery";
        if (tokenHash) {
            var otp = await sb.auth.verifyOtp({ token_hash: tokenHash, type: type });
            if (!otp.error && otp.data && otp.data.session) return otp.data.session;
        }
        if (q.get("code") && typeof sb.auth.exchangeCodeForSession === "function") {
            try {
                var ex = await sb.auth.exchangeCodeForSession(window.location.href);
                if (!ex.error && ex.data && ex.data.session) return ex.data.session;
            } catch (e) {}
        }
        var cur = await sb.auth.getSession();
        return (cur.data && cur.data.session) || null;
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
                if (event === "SIGNED_IN" && recoveryPending()) markRecovery();
                if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
                    if (recoveryPending()) return;
                    var st = global.StudentStore && global.StudentStore.getState && global.StudentStore.getState();
                    if (st && st.profile && !st.profile.onboarded && !(st.userProfile && st.userProfile.role === "admin")) return;
                    if (global.SyncEngine && global.SyncEngine.sync) global.SyncEngine.sync();
                }
            });
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
        establishRecoverySession: establishRecoverySession
    };
})(window);
