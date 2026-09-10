import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "./config";

var supabase = null;
try {
    require("react-native-url-polyfill/auto");
    supabase = createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY, {
        auth: {
            storage: AsyncStorage,
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
            flowType: "pkce"
        }
    });
} catch (e) {
    supabase = {
        auth: {
            getSession: function () { return Promise.resolve({ data: { session: null }, error: e }); },
            onAuthStateChange: function () { return { data: { subscription: { unsubscribe: function () {} } } }; },
            signOut: function () { return Promise.resolve(); }
        }
    };
}

export { supabase };
