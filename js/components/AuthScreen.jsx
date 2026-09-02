(function () {
    const { useState } = React;
    const Ic = function (n, c) { return window.KpssIcon ? window.KpssIcon(n, c) : null; };

    function AuthScreen(props) {
        const dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
        const [email, setEmail] = useState("");
        const [pass, setPass] = useState("");
        const [name, setName] = useState("");
        const [level, setLevel] = useState("lisans");
        const [target, setTarget] = useState("B");
        const [refCode, setRefCode] = useState("");
        const [examDate, setExamDate] = useState(dates.lisans || "2026-09-06");
        const [kvkk, setKvkk] = useState(false);
        const [kvkkOpen, setKvkkOpen] = useState(false);
        const [interest, setInterest] = useState({});
        const [mode, setMode] = useState("in");
        const [step, setStep] = useState(1);
        const [msg, setMsg] = useState("");
        const [busy, setBusy] = useState(false);
        const sb = window.SupabaseClient && window.SupabaseClient.get();
        const field = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[15px]";

        var levels = [
            { id: "lisans", t: "Lisans", d: "Her yıl yapılan GY-GK" },
            { id: "onlisans", t: "Ön lisans", d: "Çift yıllarda" },
            { id: "ortaogretim", t: "Ortaöğretim", d: "Çift yıllarda" }
        ];
        var targets = [
            { id: "B", t: "B Grubu", d: "Standart memurluk · yalnızca GY-GK", ready: true, icon: "book" },
            { id: "A", t: "A Grubu", d: "GY-GK + hukuk, iktisat, maliye", ready: false, icon: "scale" },
            { id: "ogretmen", t: "Öğretmenlik", d: "GY-GK + eğitim bilimleri + ÖABT", ready: false, icon: "cap" },
            { id: "dhbt", t: "DHBT", d: "GY-GK + din hizmetleri", ready: false, icon: "book" }
        ];

        function savePending() {
            try {
                sessionStorage.setItem("kpss-signup-profile", JSON.stringify({
                    name: name, educationLevel: level, examDate: examDate, targetType: target, referredBy: refCode,
                    moduleInterest: Object.keys(interest).filter(function (k) { return interest[k]; })
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
                        options: { data: { full_name: name.trim(), education_level: level, exam_date: examDate, target_type: target } }
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
                if (step < 3) { setMsg("Önce adımları tamamla."); return; }
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

        function cardCls(on, dim) {
            return "w-full text-left p-4 rounded-2xl border transition-[border-color,background-color,transform] duration-200 " +
                (on ? "border-brand-navy bg-brand-navy/5 dark:bg-brand-navy/40" : "border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-900") +
                (dim ? " opacity-60" : "");
        }

        var signup = null;
        if (mode === "up") {
            signup = (
                <div className="slide-step">
                    <div className="h-1 bg-zinc-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
                        <div className="h-full bg-brand-navy dark:bg-brand-goldsoft transition-all duration-200" style={{ width: (step / 3 * 100) + "%" }} />
                    </div>
                    {step === 1 ? (
                        <div>
                            <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-name">Adın</label>
                            <input id="au-name" value={name} onChange={function (e) { setName(e.target.value); }} className={field + " mb-5"} placeholder="Örn. Ayşe" />
                            <p className="text-sm text-zinc-500 mb-3">Eğitim düzeyi</p>
                            <div className="space-y-2 mb-6">
                                {levels.map(function (x) {
                                    return (
                                        <button key={x.id} type="button" onClick={function () {
                                            setLevel(x.id);
                                            if (dates[x.id]) setExamDate(dates[x.id]);
                                        }} className={cardCls(level === x.id, false)}>
                                            <div className="font-display font-semibold">{x.t}</div>
                                            <div className="text-sm text-zinc-500 mt-0.5">{x.d}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            <button type="button" disabled={!name.trim()} onClick={function () { setStep(2); setMsg(""); }}
                                className="w-full py-3.5 rounded-xl bg-brand-navy text-white font-semibold disabled:opacity-40">Devam</button>
                        </div>
                    ) : null}
                    {step === 2 ? (
                        <div>
                            <p className="text-sm text-zinc-500 mb-3">Hedef türü</p>
                            <div className="space-y-2 mb-6">
                                {targets.map(function (x) {
                                    var on = target === x.id;
                                    return (
                                        <button key={x.id} type="button" onClick={function () {
                                            setTarget(x.id);
                                            if (!x.ready) {
                                                var n = Object.assign({}, interest);
                                                n[x.id] = true;
                                                setInterest(n);
                                            }
                                        }} className={cardCls(on, !x.ready)}>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2 font-display font-semibold">
                                                        {Ic(x.icon, "w-4 h-4 text-brand-navy dark:text-brand-goldsoft")}
                                                        {x.t}
                                                    </div>
                                                    <div className="text-sm text-zinc-500 mt-0.5">{x.d}</div>
                                                </div>
                                                {!x.ready ? <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-slate-800 text-zinc-500 shrink-0">Yakında</span> : null}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={function () { setStep(1); }} className="flex-1 py-3.5 rounded-xl border font-medium">Geri</button>
                                <button type="button" onClick={function () { setStep(3); setMsg(""); }} className="flex-1 py-3.5 rounded-xl bg-brand-navy text-white font-semibold">Devam</button>
                            </div>
                        </div>
                    ) : null}
                    {step === 3 ? (
                        <div>
                            <p className="text-sm text-zinc-500 mb-3">GY-GK hazır. Seçtiğin diğer modüller açılınca haber veririz.</p>
                            <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-mail">E-posta</label>
                            <input id="au-mail" type="email" autoComplete="email" value={email} onChange={function (e) { setEmail(e.target.value); }} className={field + " mb-4"} />
                            <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-pass">Şifre</label>
                            <input id="au-pass" type="password" autoComplete="new-password" value={pass} onChange={function (e) { setPass(e.target.value); }} className={field + " mb-4"} />
                            <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-date">Sınav tarihi</label>
                            <input id="au-date" type="date" value={examDate} onChange={function (e) { setExamDate(e.target.value); }} className={field + " mb-4"} />
                            <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-ref">Davet kodu (opsiyonel)</label>
                            <input id="au-ref" value={refCode} onChange={function (e) { setRefCode(e.target.value); }} className={field + " mb-4"} />
                            <label className="flex items-start gap-2 text-xs text-zinc-500 mb-4">
                                <input type="checkbox" checked={kvkk} onChange={function (e) { setKvkk(e.target.checked); }} className="mt-0.5" />
                                <span>İlerlememin hesabıma kaydedilmesine izin veriyorum.{" "}
                                    <button type="button" className="underline text-brand-navy dark:text-brand-goldsoft" onClick={function () { setKvkkOpen(!kvkkOpen); }}>Detayları oku</button>
                                </span>
                            </label>
                            {kvkkOpen ? (
                                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Verin yalnızca kendi hesabında tutulur. Liderlikte takma ad görünür; e-posta paylaşılmaz. Silme talebini profilden iletebilirsin.</p>
                            ) : null}
                            <div className="flex gap-2 mb-3">
                                <button type="button" onClick={function () { setStep(2); }} className="flex-1 py-3.5 rounded-xl border font-medium">Geri</button>
                                <button type="button" disabled={busy || !kvkk} onClick={submit} className="flex-1 py-3.5 rounded-xl bg-brand-navy text-white font-semibold disabled:opacity-40">
                                    {busy ? "…" : "Kayıt ol"}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            );
        }

        var form = (
            <div className={props.gate ? "" : "p-6 sm:p-8"}>
                <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-slate-800 mb-6">
                    <button type="button" onClick={function () { setMode("in"); setMsg(""); setStep(1); }}
                        className={"flex-1 py-2 rounded-lg text-sm font-semibold " + (mode === "in" ? "bg-white dark:bg-slate-900 shadow-sm" : "text-zinc-500")}>Giriş</button>
                    <button type="button" onClick={function () { setMode("up"); setMsg(""); setStep(1); }}
                        className={"flex-1 py-2 rounded-lg text-sm font-semibold " + (mode === "up" ? "bg-white dark:bg-slate-900 shadow-sm" : "text-zinc-500")}>Kayıt</button>
                </div>
                {signup}
                {mode === "in" ? (
                    <div>
                        <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-mail">E-posta</label>
                        <input id="au-mail" type="email" autoComplete="email" value={email} onChange={function (e) { setEmail(e.target.value); }} className={field + " mb-4"} />
                        <label className="text-sm text-zinc-500 block mb-1.5" htmlFor="au-pass">Şifre</label>
                        <input id="au-pass" type="password" autoComplete="current-password" value={pass} onChange={function (e) { setPass(e.target.value); }} className={field + " mb-4"} />
                        <button disabled={busy} onClick={submit} className="w-full py-3.5 rounded-xl bg-brand-navy text-white font-semibold disabled:opacity-50">
                            {busy ? "…" : "Giriş yap"}
                        </button>
                        <button type="button" disabled={busy} onClick={google}
                            className="w-full mt-3 py-3.5 rounded-xl border border-zinc-200 dark:border-slate-700 font-semibold text-sm disabled:opacity-50">
                            Google ile devam
                        </button>
                    </div>
                ) : null}
                {mode === "up" && step === 3 ? (
                    <button type="button" disabled={busy} onClick={google}
                        className="w-full mt-3 py-3.5 rounded-xl border border-zinc-200 dark:border-slate-700 font-semibold text-sm disabled:opacity-50">
                        Google ile devam
                    </button>
                ) : null}
                {msg ? <p className="text-sm text-brand-amber mt-4">{msg}</p> : null}
            </div>
        );

        if (!props.gate) return form;
        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#F7F6F3] dark:bg-slate-950">
                <div className="w-full max-w-md">
                    <p className="text-xs font-semibold tracking-[0.2em] text-brand-navy/50 dark:text-brand-goldsoft mb-2">KPSS</p>
                    <h1 className="text-2xl font-display font-bold tracking-tight mb-2">{mode === "up" ? "Hesap oluştur" : "Giriş yap"}</h1>
                    <p className="text-sm text-zinc-500 mb-8">{mode === "up" ? "Üç kısa adım. Derslere ondan sonra girersin." : "Kaldığın yerden devam et."}</p>
                    {form}
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AuthScreen = AuthScreen;
})();
