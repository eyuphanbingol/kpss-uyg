(function (global) {
    var client = null;
    var cfg = global.KpssConfig || {};

    function getClient() {
        if (client) return client;
        if (!global.supabase || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;
        try {
            client = global.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
                auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
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
