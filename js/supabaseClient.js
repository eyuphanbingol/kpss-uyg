(function (global) {
    var client = null;

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
                if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
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
        ready: function () { return !!getClient(); }
    };
})(window);
