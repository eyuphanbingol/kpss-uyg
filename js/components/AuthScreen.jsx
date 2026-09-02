(function () {
    const { useState, useEffect, useRef, useCallback } = React;
    const Ic = function (n, c) { return window.KpssIcon ? window.KpssIcon(n, c) : null; };

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(pass) {
        return pass.length >= 6;
    }

    function getStrengthLabel(pass) {
        if (!pass) return { label: "Şifre gir", color: "text-stone-400", bg: "bg-stone-200" };
        if (pass.length < 6) return { label: "Zayıf (6+ karakter)", color: "text-rose-500", bg: "bg-rose-500" };
        if (pass.length < 10) return { label: "Orta", color: "text-amber-500", bg: "bg-amber-500" };
        return { label: "Güçlü ✅", color: "text-emerald-500", bg: "bg-emerald-500" };
    }

    function formatDate(iso) {
        if (!iso) return "";
        var parts = iso.split("-");
        if (parts.length === 3) {
            return parts[2] + "." + parts[1] + "." + parts[0];
        }
        return iso;
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function AuthScreen(props) {
        const dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
        
        // ---------- State ----------
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
        const [showPassword, setShowPassword] = useState(false);
        const [rememberMe, setRememberMe] = useState(false);
        const [recovery, setRecovery] = useState(function () {
            return !!(props.recovery || (window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending()));
        });
        const [newPass, setNewPass] = useState("");
        const [newPass2, setNewPass2] = useState("");
        const [recReady, setRecReady] = useState(false);

        const sb = window.SupabaseClient && window.SupabaseClient.get();
        const field = "w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[15px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all";

        // ---------- Refs ----------
        const emailRef = useRef(null);
        const passRef = useRef(null);
        const nameRef = useRef(null);

        useEffect(function () {
            if (props.recovery) setRecovery(true);
        }, [props.recovery]);

        useEffect(function () {
            if (!sb) return;
            var sub = sb.auth.onAuthStateChange(function (event) {
                if (event === "PASSWORD_RECOVERY") {
                    if (window.SupabaseClient && window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                    setRecovery(true);
                }
            });
            return function () {
                if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
            };
        }, []);

        useEffect(function () {
            if (mode === "in" && !recovery && emailRef.current) emailRef.current.focus();
        }, [mode, recovery]);

        useEffect(function () {
            if (!recovery) return;
            var sc = window.SupabaseClient;
            if (!sc || !sc.establishRecoverySession) return;
            sc.establishRecoverySession().then(function (sess) {
                if (sess) {
                    if (sc.markRecovery) sc.markRecovery();
                    setRecReady(true);
                    setMsg("");
                } else {
                    if (sc.clearRecovery) sc.clearRecovery();
                    setRecReady(false);
                    setRecovery(false);
                    setMsg("Bu link kullanılamadı. E-postanı yazıp Şifremi Unuttum ile yeni mail iste. Üst üste çok denediysen birkaç dakika bekle.");
                    if (props.onRecoveryFailed) props.onRecoveryFailed();
                }
            }).catch(function () {
                if (sc.clearRecovery) sc.clearRecovery();
                setRecReady(false);
                setRecovery(false);
                setMsg("Bu link kullanılamadı. Yeni bir sıfırlama maili iste.");
                if (props.onRecoveryFailed) props.onRecoveryFailed();
            });
        }, [recovery]);

        // ---------- Levels ----------
        var levels = [
            { id: "lisans", t: "🎓 Lisans", d: "Her yıl yapılan GY-GK", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
            { id: "onlisans", t: "📘 Ön lisans", d: "Çift yıllarda", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
            { id: "ortaogretim", t: "🏫 Ortaöğretim", d: "Çift yıllarda", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" }
        ];

        var targets = [
            { id: "B", t: "B Grubu", d: "Standart memurluk · yalnızca GY-GK", ready: true, icon: "book", color: "bg-indigo-100 text-indigo-700" },
            { id: "A", t: "A Grubu", d: "GY-GK + hukuk, iktisat, maliye", ready: false, icon: "scale", color: "bg-purple-100 text-purple-700" },
            { id: "ogretmen", t: "Öğretmenlik", d: "GY-GK + eğitim bilimleri + ÖABT", ready: false, icon: "cap", color: "bg-rose-100 text-rose-700" },
            { id: "dhbt", t: "DHBT", d: "GY-GK + din hizmetleri", ready: false, icon: "book", color: "bg-emerald-100 text-emerald-700" }
        ];

        // ---------- Password Strength ----------
        const passStrength = getStrengthLabel(pass);

        // ---------- Save Pending ----------
        function savePending() {
            try {
                sessionStorage.setItem("kpss-signup-profile", JSON.stringify({
                    name: name,
                    educationLevel: level,
                    examDate: examDate,
                    targetType: level === "lisans" ? target : "B",
                    referredBy: refCode,
                    moduleInterest: Object.keys(interest).filter(function (k) { return interest[k]; })
                }));
            } catch (e) {}
        }

        // ---------- Finish Local ----------
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

        // ---------- Submit ----------
        async function saveNewPassword() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
            if (!validatePassword(newPass)) { setMsg("Yeni şifre en az 6 karakter olmalı."); return; }
            if (newPass !== newPass2) { setMsg("Şifreler eşleşmiyor."); return; }
            setBusy(true);
            setMsg("");
            try {
                var sess = null;
                if (window.SupabaseClient && window.SupabaseClient.establishRecoverySession) {
                    sess = await window.SupabaseClient.establishRecoverySession();
                }
                if (!sess) throw new Error("Oturum yok. Aynı tarayıcıda yeni sıfırlama maili iste, linke bir kez tıkla.");
                var res = await sb.auth.updateUser({ password: newPass });
                if (res.error) throw res.error;
                if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                setRecovery(false);
                setNewPass("");
                setNewPass2("");
                setMsg("✅ Şifren güncellendi.");
                if (props.onPasswordUpdated) props.onPasswordUpdated();
                else if (props.onDone) props.onDone();
            } catch (e) {
                var m = (e && e.message) || "Şifre güncellenemedi.";
                if (/session missing/i.test(m)) m = "Oturum yok. Aynı tarayıcıda yeni sıfırlama maili iste, linke bir kez tıkla.";
                setMsg(m);
            }
            setBusy(false);
        }

        async function submit() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
            if (!email || !validateEmail(email)) { setMsg("Geçerli bir e-posta adresi girin."); return; }
            if (!validatePassword(pass)) { setMsg("Şifre en az 6 karakter olmalı."); return; }

            if (mode === "up") {
                if (!name.trim()) { setMsg("Adınızı yazın."); return; }
                if (!kvkk) { setMsg("Devam etmek için onay kutusunu işaretleyin."); return; }
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
                            data: {
                                full_name: name.trim(),
                                education_level: level,
                                exam_date: examDate,
                                target_type: target
                            }
                        }
                    })
                    : await sb.auth.signInWithPassword({ email: email, password: pass });

                if (res.error) {
                    setMsg(res.error.message);
                } else if (mode === "up" && !(res.data && res.data.session)) {
                    setMsg("✅ Kayıt tamam! E-postanıza gelen linke tıklayarak hesabınızı doğrulayın.");
                } else {
                    finishLocal(res.data && res.data.user);
                }
            } catch (e) {
                setMsg(String(e.message || e));
            }
            setBusy(false);
        }

        // ---------- Google ----------
        async function google() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }

            if (mode === "up") {
                if (!name.trim()) { setMsg("Google ile kayıt için adınızı yazın."); return; }
                if (step < 3) { setMsg("Önce tüm adımları tamamlayın."); return; }
                if (!kvkk) { setMsg("Devam etmek için onay kutusunu işaretleyin."); return; }
                savePending();
            }

            setBusy(true);
            setMsg("");

            try {
                var res = await sb.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: window.location.origin + (window.location.pathname || "/")
                    }
                });
                if (res.error) setMsg(res.error.message);
            } catch (e) {
                setMsg(String(e.message || e));
            }
            setBusy(false);
        }

        // ---------- Enter Key ----------
        function goAfterEducation() {
            if (level === "lisans") {
                setStep(2);
            } else {
                setTarget("B");
                setStep(3);
            }
            setMsg("");
        }

        function handleKeyDown(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                if (mode === "in") {
                    submit();
                } else if (step === 1 && name.trim()) {
                    goAfterEducation();
                } else if (step === 2) {
                    setStep(3);
                } else if (step === 3) {
                    submit();
                }
            }
        }

        // ---------- Card Class ----------
        function cardCls(on, dim) {
            return "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 " +
                (on 
                    ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/10" 
                    : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-indigo-300 dark:hover:border-indigo-700") +
                (dim ? " opacity-50" : "");
        }

        // ---------- Step Indicator ----------
        function StepIndicator({ current, total }) {
            return (
                <div className="flex gap-1.5 mb-6">
                    {Array.from({ length: total }, function (_, i) {
                        var idx = i + 1;
                        var isActive = idx === current;
                        var isPast = idx < current;
                        return (
                            <div key={idx} className="flex-1 flex items-center gap-1">
                                <div className={"h-2 rounded-full transition-all duration-300 flex-1 " + 
                                    (isActive ? "bg-indigo-600 shadow-md shadow-indigo-500/30" : 
                                     isPast ? "bg-emerald-500" : "bg-stone-200 dark:bg-stone-700")} />
                                {idx < total && (
                                    <span className="text-[10px] text-stone-400">
                                        {isPast ? "✓" : "·"}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        // ============================================================
        // SIGNUP FORM
        // ============================================================

        var signup = null;
        if (mode === "up") {
            signup = (
                <div className="slide-step">
                    <StepIndicator current={step} total={3} />

                    {/* Step 1: Name & Education */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-name">
                                    👤 Adınız
                                </label>
                                <input 
                                    id="au-name" 
                                    ref={nameRef}
                                    value={name} 
                                    onChange={function (e) { setName(e.target.value); }} 
                                    onKeyDown={handleKeyDown}
                                    className={field} 
                                    placeholder="Örn. Ayşe Yılmaz"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2">🎯 Eğitim Düzeyiniz</p>
                                <div className="space-y-2">
                                    {levels.map(function (x) {
                                        var isActive = level === x.id;
                                        return (
                                            <button 
                                                key={x.id} 
                                                type="button" 
                                                onClick={function () {
                                                    setLevel(x.id);
                                                    if (dates[x.id]) setExamDate(dates[x.id]);
                                                }} 
                                                className={cardCls(isActive, false)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-display font-semibold text-base">{x.t}</div>
                                                        <div className="text-sm text-stone-500 mt-0.5">{x.d}</div>
                                                    </div>
                                                    {isActive && (
                                                        <span className="text-indigo-600 text-xl">✓</span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button 
                                type="button" 
                                disabled={!name.trim()} 
                                onClick={function () { goAfterEducation(); }}
                                className="w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
                            >
                                Devam →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Target */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2">🎯 Hedef Türünüz</p>
                                <div className="space-y-2">
                                    {targets.map(function (x) {
                                        var on = target === x.id;
                                        return (
                                            <button 
                                                key={x.id} 
                                                type="button" 
                                                onClick={function () {
                                                    setTarget(x.id);
                                                    if (!x.ready) {
                                                        var n = Object.assign({}, interest);
                                                        n[x.id] = true;
                                                        setInterest(n);
                                                    }
                                                }} 
                                                className={cardCls(on, !x.ready)}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 font-display font-semibold">
                                                            <span className="text-lg">{x.icon === "book" ? "📖" : x.icon === "scale" ? "⚖️" : x.icon === "cap" ? "🎓" : "📚"}</span>
                                                            {x.t}
                                                        </div>
                                                        <div className="text-sm text-stone-500 mt-0.5">{x.d}</div>
                                                    </div>
                                                    {!x.ready ? (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 shrink-0">
                                                            ⏳ Yakında
                                                        </span>
                                                    ) : on ? (
                                                        <span className="text-indigo-600 text-xl shrink-0">✓</span>
                                                    ) : null}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    onClick={function () { setStep(1); }} 
                                    className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    ← Geri
                                </button>
                                <button 
                                    type="button" 
                                    onClick={function () { setStep(3); setMsg(""); }} 
                                    className="flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold"
                                >
                                    Devam →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Account */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 p-4 border border-indigo-100 dark:border-indigo-800/30">
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    📌 <strong>GY-GK</strong> hazır. Diğer modüller açıldığında haberdar olacaksınız.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-mail">
                                    📧 E-posta
                                </label>
                                <input 
                                    id="au-mail" 
                                    ref={emailRef}
                                    type="email" 
                                    autoComplete="email" 
                                    value={email} 
                                    onChange={function (e) { setEmail(e.target.value); }} 
                                    onKeyDown={handleKeyDown}
                                    className={field} 
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-pass">
                                    🔒 Şifre
                                </label>
                                <div className="relative">
                                    <input 
                                        id="au-pass" 
                                        ref={passRef}
                                        type={showPassword ? "text" : "password"} 
                                        autoComplete="new-password" 
                                        value={pass} 
                                        onChange={function (e) { setPass(e.target.value); }} 
                                        onKeyDown={handleKeyDown}
                                        className={field + " pr-12"} 
                                        placeholder="En az 6 karakter"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={function () { setShowPassword(!showPassword); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <div className="flex-1 h-1 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                        <div className={"h-full transition-all duration-300 " + passStrength.bg} 
                                             style={{ width: pass ? Math.min(100, (pass.length / 10) * 100) + "%" : "0%" }} />
                                    </div>
                                    <span className={"text-[10px] font-medium " + passStrength.color}>
                                        {passStrength.label}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-date">
                                    📅 Sınav Tarihi
                                </label>
                                <input 
                                    id="au-date" 
                                    type="date" 
                                    value={examDate} 
                                    onChange={function (e) { setExamDate(e.target.value); }} 
                                    className={field}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-ref">
                                    🔑 Davet Kodu <span className="text-xs text-stone-400 font-normal">(opsiyonel)</span>
                                </label>
                                <input 
                                    id="au-ref" 
                                    value={refCode} 
                                    onChange={function (e) { setRefCode(e.target.value); }} 
                                    className={field} 
                                    placeholder="Örn: KPSS-ABCD12"
                                />
                            </div>

                            <label className="flex items-start gap-3 text-xs text-stone-500 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={kvkk} 
                                    onChange={function (e) { setKvkk(e.target.checked); }} 
                                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>
                                    İlerlememin hesabıma kaydedilmesine izin veriyorum.{""}
                                    <button 
                                        type="button" 
                                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                        onClick={function (e) { e.preventDefault(); setKvkkOpen(!kvkkOpen); }}
                                    >
                                        {kvkkOpen ? "Gizle" : "Detayları oku"}
                                    </button>
                                </span>
                            </label>

                            {kvkkOpen && (
                                <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 p-4 text-xs text-stone-500 leading-relaxed border border-stone-200 dark:border-stone-700 slide-up">
                                    <p className="font-medium text-stone-700 dark:text-stone-300 mb-1">🔒 Veri Güvenliği</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Verileriniz yalnızca kendi hesabınızda saklanır</li>
                                        <li>Liderlik tablosunda takma adınız görünür, e-posta paylaşılmaz</li>
                                        <li>İstediğiniz zaman profilden veri silme talebi gönderebilirsiniz</li>
                                        <li>Hesabınızı tamamen silebilirsiniz</li>
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    onClick={function () { setStep(level === "lisans" ? 2 : 1); }} 
                                    className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    ← Geri
                                </button>
                                <button 
                                    type="button" 
                                    disabled={busy || !kvkk || !validateEmail(email) || !validatePassword(pass)} 
                                    onClick={submit} 
                                    className="flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
                                >
                                    {busy ? "⏳" : "🚀 Kayıt Ol"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // ============================================================
        // LOGIN FORM
        // ============================================================

        var loginForm = mode === "in" ? (
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="login-email">
                        📧 E-posta
                    </label>
                    <input 
                        id="login-email" 
                        ref={emailRef}
                        type="email" 
                        autoComplete="email" 
                        value={email} 
                        onChange={function (e) { setEmail(e.target.value); }} 
                        onKeyDown={handleKeyDown}
                        className={field} 
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="login-pass">
                        🔒 Şifre
                    </label>
                    <div className="relative">
                        <input 
                            id="login-pass" 
                            ref={passRef}
                            type={showPassword ? "text" : "password"} 
                            autoComplete="current-password" 
                            value={pass} 
                            onChange={function (e) { setPass(e.target.value); }} 
                            onKeyDown={handleKeyDown}
                            className={field + " pr-12"} 
                            placeholder="••••••••"
                        />
                        <button 
                            type="button" 
                            onClick={function () { setShowPassword(!showPassword); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-stone-500 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={rememberMe} 
                            onChange={function (e) { setRememberMe(e.target.checked); }} 
                            className="w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Beni Hatırla
                    </label>
                    <button 
                        type="button" 
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        onClick={async function () {
                            if (!email || !validateEmail(email)) {
                                setMsg("Şifre sıfırlama için e-posta adresinizi girin.");
                                if (emailRef.current) emailRef.current.focus();
                                return;
                            }
                            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
                            setBusy(true);
                            setMsg("");
                            try {
                                var res = await sb.auth.resetPasswordForEmail(email.trim(), {
                                    redirectTo: window.location.origin + "/"
                                });
                                if (res.error) throw res.error;
                                setMsg("✅ Şifre sıfırlama bağlantısı gönderildi. Spam klasörüne de bak. Birkaç dakikada gelmezse biraz bekleyip tekrar dene.");
                            } catch (e) {
                                var m = (e && e.message) || "Mail gönderilemedi.";
                                if (/rate|too many|429/i.test(m)) {
                                    m = "Çok sık mail istendi. 10–15 dakika bekle, sonra bir kez daha dene. Spam klasörünü de kontrol et.";
                                }
                                setMsg(m);
                            }
                            setBusy(false);
                        }}
                    >
                        Şifremi Unuttum
                    </button>
                </div>

                <button 
                    disabled={busy || !validateEmail(email) || !validatePassword(pass)} 
                    onClick={submit} 
                    className="w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
                >
                    {busy ? "⏳" : "🔓 Giriş Yap"}
                </button>

                <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200 dark:border-stone-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white dark:bg-stone-900 text-stone-400">veya</span>
                    </div>
                </div>

                <button 
                    type="button" 
                    disabled={busy} 
                    onClick={google}
                    className="w-full py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-semibold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google ile Devam
                </button>
                <p className="text-[11px] text-stone-400 text-center">İlk kez Google ile gelince ad, eğitim ve kulvar sorulur.</p>
            </div>
        ) : null;

        // ============================================================
        // MAIN RENDER
        // ============================================================

        var form = (
            <div className={props.gate ? "" : "p-6 sm:p-8"}>
                {recovery ? (
                    <div className="space-y-4">
                        <p className="text-sm text-stone-500">Yeni şifreni yaz. En az 6 karakter.</p>
                        <div>
                            <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5">Yeni şifre</label>
                            <input type={showPassword ? "text" : "password"} value={newPass} onChange={function (e) { setNewPass(e.target.value); }} className={field} placeholder="••••••••" autoComplete="new-password" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5">Yeni şifre (tekrar)</label>
                            <input type={showPassword ? "text" : "password"} value={newPass2} onChange={function (e) { setNewPass2(e.target.value); }} className={field} placeholder="••••••••" autoComplete="new-password" />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-stone-500 cursor-pointer">
                            <input type="checkbox" checked={showPassword} onChange={function (e) { setShowPassword(e.target.checked); }} className="w-4 h-4 rounded border-stone-300 text-indigo-600" />
                            Şifreyi göster
                        </label>
                        <button type="button" disabled={busy || !recReady} onClick={saveNewPassword} className="w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40">
                            {busy ? "⏳" : (recReady ? "Şifreyi kaydet" : "Bağlantı doğrulanıyor…")}
                        </button>
                        <button type="button" className="w-full text-sm text-stone-500" onClick={function () {
                            if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                            setRecovery(false);
                            setRecReady(false);
                            if (props.onRecoveryFailed) props.onRecoveryFailed();
                        }}>Girişe dön</button>
                    </div>
                ) : (
                    <div>
                {/* Mode Toggle */}
                <div className="flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 mb-6">
                    <button 
                        type="button" 
                        onClick={function () { setMode("in"); setMsg(""); setStep(1); setPass(""); }}
                        className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " + 
                            (mode === "in" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")}
                    >
                        🔐 Giriş
                    </button>
                    <button 
                        type="button" 
                        onClick={function () { setMode("up"); setMsg(""); setStep(1); setPass(""); }}
                        className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " + 
                            (mode === "up" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")}
                    >
                        📝 Kayıt
                    </button>
                </div>

                {signup}
                {loginForm}

                {mode === "up" && step === 3 && (
                    <div className="mt-3">
                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-stone-200 dark:border-stone-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white dark:bg-stone-900 text-stone-400">veya</span>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            disabled={busy} 
                            onClick={google}
                            className="w-full py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-semibold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google ile Kayıt Ol
                        </button>
                    </div>
                )}
                    </div>
                )}

                {msg && (
                    <div className={"mt-4 p-4 rounded-2xl text-sm flex items-start gap-3 " + 
                        (msg.includes("✅") || msg.includes("tamam") 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" 
                            : "bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300")}
                    >
                        <span className="text-lg shrink-0">{msg.includes("✅") || msg.includes("tamam") ? "✅" : "⚠️"}</span>
                        <span className="whitespace-pre-line">{msg}</span>
                    </div>
                )}
            </div>
        );

        // ============================================================
        // GATE MODE (Full Page)
        // ============================================================

        if (!props.gate) return form;

        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
                <div className="w-full max-w-md">
                    {/* Logo / Brand */}
                    <div className="text-center mb-8">
                        {window.AtanomLogo
                            ? window.AtanomLogo("h-24 w-24 mx-auto mb-3 object-contain drop-shadow-sm")
                            : <img src="icons/atanom.png" alt="Atanom" className="h-24 w-24 mx-auto mb-3 object-contain" />}
                        <h1 className="text-2xl md:text-3xl font-black gradient-text">Atanom</h1>
                        <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">
                            {recovery
                                ? "Maildeki bağlantı seni buraya getirdi"
                                : (mode === "up"
                                ? "Hedefine doğru ilk adımı at"
                                : "Kaldığın yerden devam et")}
                        </p>
                    </div>

                    {form}
                </div>
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AuthScreen = AuthScreen;

})();