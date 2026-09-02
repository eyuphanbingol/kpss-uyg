(function () {
    const { useState } = React;
    function AuthScreen(props) {
        const dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
        const [email, setEmail] = useState("");
        const [pass, setPass] = useState("");
        const [name, setName] = useState("");
        const [level, setLevel] = useState("lisans");
        const [examDate, setExamDate] = useState(dates.lisans || "2026-09-06");
        const [kvkk, setKvkk] = useState(false);
        const [mode, setMode] = useState("in");
        const [msg, setMsg] = useState("");
        const [busy, setBusy] = useState(false);
        const sb = window.SupabaseClient && window.SupabaseClient.get();
        const field = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[15px]";

        function savePending() {
            try {
                sessionStorage.setItem("kpss-signup-profile", JSON.stringify({
                    name: name, educationLevel: level, examDate: examDate
                }));
            } catch (e) {}
        }

        function finishLocal(user) {
            if (window.StudentStore && window.StudentStore.bindToUser && user) {
                window.StudentStore.bindToUser(user.id, user.email);
            }
            if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                window.StudentStore.consumeSignupIfNeeded(user);
            }
            if (window.SyncEngine) window.SyncEngine.sync();
            if (props.onDone) props.onDone();
        }

        async function submit() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
            if (!email || pass.length < 6) { setMsg("E-posta ve en az 6 karakter şifre gir."); return; }
            if (mode === "up") {
                if (!name.trim()) { setMsg("Adını yaz."); return; }
                if (!kvkk) { setMsg("Devam için onay kutusu gerekli."); return; }
                savePending();
            }
            setBusy(true);
            setMsg("");
            try {
                var res = mode === "up"
                    ? await sb.auth.signUp({
                        email: email,
                        password: pass,
                        options: {
                            data: { full_name: name.trim(), education_level: level, exam_date: examDate }
                        }
                    })
                    : await sb.auth.signInWithPassword({ email: email, password: pass });
                if (res.error) setMsg(res.error.message);
                else if (mode === "up" && !(res.data && res.data.session)) {
                    setMsg("Kayıt tamam. E-postadaki linke tıkla, sonra giriş yap.");
                } else {
                    finishLocal(res.data && res.data.user);
                }
            } catch (e) { setMsg(String(e.message || e)); }
            setBusy(false);
        }

        async function google() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
            if (mode === "up") {
                if (!name.trim()) { setMsg("Google ile kayıt için önce adını yaz."); return; }
                if (!kvkk) { setMsg("Devam için onay kutusu gerekli."); return; }
                savePending();
            }
            setBusy(true);
            setMsg("");
            try {
                var res = await sb.auth.signInWithOAuth({
                    provider: "google",
                    options: { redirectTo: window.location.origin + window.location.pathname }
                });
                if (res.error) setMsg(res.error.message);
            } catch (e) { setMsg(String(e.message || e)); }
            setBusy(false);
        }

        var form = (
            <div className={props.gate ? "" : "p-6 sm:p-8"}>
                <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-6">
                    <button type="button" onClick={function () { setMode("in"); setMsg(""); }}
                        className={"flex-1 py-2 rounded-lg text-sm font-semibold " + (mode === "in" ? "bg-white dark:bg-zinc-900 shadow-sm" : "text-zinc-500")}>Giriş</button>
                    <button type="button" onClick={function () { setMode("up"); setMsg(""); }}
                        className={"flex-1 py-2 rounded-lg text-sm font-semibold " + (mode === "up" ? "bg-white dark:bg-zinc-900 shadow-sm" : "text-zinc-500")}>Kayıt</button>
                </div>
                {mode === "up" ? (
                    <div>
                        <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-name">Adın</label>
                        <input id="au-name" value={name} onChange={function (e) { setName(e.target.value); }} className={field + " mb-4"} placeholder="Örn. Ayşe" />
                        <p className="text-sm text-zinc-500 mb-2">Eğitim</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[{ id: "lisans", t: "Lisans" }, { id: "onlisans", t: "Ön lisans" }, { id: "ortaogretim", t: "Ortaöğretim" }].map(function (x) {
                                return (
                                    <button key={x.id} type="button" onClick={function () {
                                        setLevel(x.id);
                                        if (dates[x.id]) setExamDate(dates[x.id]);
                                    }} className={"text-xs font-medium py-2.5 rounded-xl border " + (level === x.id ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200")}>{x.t}</button>
                                );
                            })}
                        </div>
                        <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-date">Sınav tarihi</label>
                        <input id="au-date" type="date" value={examDate} onChange={function (e) { setExamDate(e.target.value); }} className={field + " mb-4"} />
                    </div>
                ) : null}
                <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-mail">E-posta</label>
                <input id="au-mail" type="email" autoComplete="email" value={email} onChange={function (e) { setEmail(e.target.value); }} className={field + " mb-4"} />
                <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-pass">Şifre</label>
                <input id="au-pass" type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={pass} onChange={function (e) { setPass(e.target.value); }} className={field + " mb-4"} />
                {mode === "up" ? (
                    <label className="flex items-start gap-2 text-xs text-zinc-500 mb-4">
                        <input type="checkbox" checked={kvkk} onChange={function (e) { setKvkk(e.target.checked); }} className="mt-0.5" />
                        <span>İlerlememin hesabıma kaydedilmesine izin veriyorum.</span>
                    </label>
                ) : null}
                <button disabled={busy} onClick={submit} className="w-full py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold disabled:opacity-50">
                    {busy ? "…" : (mode === "up" ? "Kayıt ol ve başla" : "Giriş yap")}
                </button>
                <button type="button" disabled={busy} onClick={google}
                    className="w-full mt-3 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google ile devam
                </button>
                {msg ? <p className="text-sm text-amber-700 mt-4">{msg}</p> : null}
            </div>
        );

        if (!props.gate) return form;

        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <p className="text-sm font-semibold tracking-wide text-zinc-400 mb-2">KPSS</p>
                    <h1 className="text-2xl font-semibold tracking-tight mb-2">{mode === "up" ? "Hesap oluştur" : "Giriş yap"}</h1>
                    <p className="text-sm text-zinc-500 mb-8">{mode === "up" ? "Bilgilerinle kaydol, derslere ondan sonra girersin." : "Kaldığın yerden devam et."}</p>
                    {form}
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AuthScreen = AuthScreen;
})();
