(function () {
    const { useState } = React;
    function AuthScreen(props) {
        const [email, setEmail] = useState("");
        const [pass, setPass] = useState("");
        const [msg, setMsg] = useState("");
        const [busy, setBusy] = useState(false);
        const sb = window.SupabaseClient && window.SupabaseClient.get();

        async function mail(mode) {
            if (!sb) { setMsg("Supabase bağlı değil. Yerel çalışma sürüyor."); return; }
            setBusy(true);
            try {
                var res = mode === "up"
                    ? await sb.auth.signUp({ email: email, password: pass })
                    : await sb.auth.signInWithPassword({ email: email, password: pass });
                if (res.error) setMsg(res.error.message);
                else {
                    setMsg(mode === "up" ? "Kayıt alındı. E-posta onayını kontrol et." : "Giriş tamam.");
                    if (window.SyncEngine) window.SyncEngine.sync();
                    if (props.onDone) props.onDone();
                }
            } catch (e) { setMsg(String(e.message || e)); }
            setBusy(false);
        }

        async function google() {
            if (!sb) { setMsg("Supabase bağlı değil."); return; }
            var res = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + window.location.pathname } });
            if (res.error) setMsg(res.error.message);
        }

        return (
            <div className="p-4 space-y-3">
                <h2 className="text-xl font-black">Hesap</h2>
                <p className="text-sm text-slate-500">Çevrimdışı her şey durur. Giriş, cihazlar arası kopya içindir. Service role tarayıcıda yok.</p>
                <label className="text-xs font-bold" htmlFor="au-mail">E-posta</label>
                <input id="au-mail" type="email" autoComplete="email" value={email} onChange={function (e) { setEmail(e.target.value); }} className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800" />
                <label className="text-xs font-bold" htmlFor="au-pass">Şifre</label>
                <input id="au-pass" type="password" autoComplete="current-password" value={pass} onChange={function (e) { setPass(e.target.value); }} className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800" />
                <div className="flex gap-2">
                    <button disabled={busy} onClick={function () { mail("in"); }} className="flex-1 p-3 rounded-xl bg-indigo-600 text-white font-bold">Giriş</button>
                    <button disabled={busy} onClick={function () { mail("up"); }} className="flex-1 p-3 rounded-xl border font-bold">Kayıt</button>
                </div>
                <button onClick={google} className="w-full p-3 rounded-xl border font-bold">Google ile devam</button>
                {msg ? <p className="text-xs text-amber-600">{msg}</p> : null}
                <button onClick={props.onClose} className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold">Kapat</button>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AuthScreen = AuthScreen;
})();
