(function (global) {
    var client = null;
    var RECOVERY_KEY = "kpss-password-recovery";

    function recoveryFromUrl() {
        var s = String(window.location.search || "");
        var h = String(window.location.hash || "");
        return /(?:[?&]reset=)/.test(s) || /type=recovery/.test(s) || /type=recovery/.test(h);
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
        clearRecovery: clearRecovery
    };
})(window);
