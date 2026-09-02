(function () {
    const { useState, useEffect, useRef } = React;

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function getLevelEmoji(level) {
        var map = {
            "lisans": "🎓",
            "onlisans": "📘",
            "ortaogretim": "🏫"
        };
        return map[level] || "📚";
    }

    function getLevelDescription(level) {
        var map = {
            "lisans": "4 yıllık fakülte mezunları",
            "onlisans": "2 yıllık yüksekokul mezunları",
            "ortaogretim": "Lise ve dengi okul mezunları"
        };
        return map[level] || "";
    }

    function getLevelColor(level, isActive) {
        var colors = {
            "lisans": isActive ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300" : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400",
            "onlisans": isActive ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300" : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400",
            "ortaogretim": isActive ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300" : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
        };
        return colors[level] || colors["lisans"];
    }

    function getExamDateHint(level) {
        var map = {
            "lisans": "Her yıl yapılır",
            "onlisans": "Çift yıllarda yapılır",
            "ortaogretim": "Çift yıllarda yapılır"
        };
        return map[level] || "";
    }

    function formatDateForDisplay(iso) {
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

    function OnboardingScreen(props) {
        const student = props.student || {};
        const dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
        var profile = student.profile || {};
        
        // ---------- State ----------
        const [name, setName] = useState(profile.name || "");
        const [level, setLevel] = useState((student.userProfile && student.userProfile.educationLevel) || "lisans");
        const [target, setTarget] = useState((student.userProfile && student.userProfile.targetType) || "B");
        const [examDate, setExamDate] = useState(profile.examDate || dates[level] || "2026-09-06");
        const [kvkk, setKvkk] = useState(false);
        const [step, setStep] = useState(1);
        const [animating, setAnimating] = useState(false);

        const nameInputRef = useRef(null);
        const dateInputRef = useRef(null);

        // ---------- Focus ----------
        useEffect(function () {
            if (nameInputRef.current) {
                nameInputRef.current.focus();
            }
        }, []);

        // ---------- Pick Level ----------
        function pickLevel(lv) {
            setLevel(lv);
            if (dates[lv]) setExamDate(dates[lv]);
            setAnimating(true);
            setTimeout(function () { setAnimating(false); }, 300);
        }

        // ---------- Next Step ----------
        function goToNext() {
            if (step === 1 && name.trim()) {
                setStep(2);
                setTimeout(function () {
                    if (dateInputRef.current) dateInputRef.current.focus();
                }, 100);
            } else if (step === 2 && kvkk) {
                complete();
            }
        }

        // ---------- Complete ----------
        function complete() {
            if (!kvkk) return;
            
            StudentStore.completeOnboarding({
                name: name,
                nickname: name,
                examDate: examDate,
                dailyMinutes: 45,
                dailyQuestions: 25,
                educationLevel: level,
                targetType: level === "lisans" ? target : "B",
                kvkkConsent: true,
                weeklyHours: 7
            });
            if (window.SyncEngine) window.SyncEngine.sync();
        }

        // ---------- Enter Key ----------
        function handleKeyDown(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                goToNext();
            }
        }

        // ---------- Level Options ----------
        var levelOptions = [
            { id: "lisans", t: "🎓 Lisans", desc: "4 yıllık fakülte" },
            { id: "onlisans", t: "📘 Ön lisans", desc: "2 yıllık yüksekokul" },
            { id: "ortaogretim", t: "🏫 Ortaöğretim", desc: "Lise ve dengi" }
        ];

        // ============================================================
        // RENDER
        // ============================================================

        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                
                {/* Modal */}
                <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 fade-in slide-up border border-stone-200/50 dark:border-stone-700/50">
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 items-center justify-center text-white text-3xl shadow-lg shadow-indigo-500/20 mb-3">
                            🚀
                        </div>
                        <h2 className="text-2xl font-black gradient-text">Hazır mısın?</h2>
                        <p className="text-sm text-stone-400 mt-1 max-w-xs mx-auto">
                            Hedefine doğru ilk adımı atalım
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        {[1, 2].map(function (s) {
                            var isActive = s === step;
                            var isPast = s < step;
                            return (
                                <div key={s} className="flex items-center gap-2 flex-1">
                                    <div className={"h-2 rounded-full transition-all duration-500 flex-1 " +
                                        (isActive ? "bg-indigo-600 shadow-sm shadow-indigo-500/30" :
                                         isPast ? "bg-emerald-500" :
                                         "bg-stone-200 dark:bg-stone-700")
                                    } />
                                    {s < 2 && (
                                        <span className="text-[10px] text-stone-400">
                                            {isPast ? "✓" : "·"}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ===== STEP 1 ===== */}
                    {step === 1 && (
                        <div className="space-y-4 slide-up">
                            <div>
                                <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5" htmlFor="ob-name">
                                    👤 Adın
                                </label>
                                <input 
                                    id="ob-name" 
                                    ref={nameInputRef}
                                    value={name} 
                                    onChange={function (e) { setName(e.target.value); }} 
                                    onKeyDown={handleKeyDown}
                                    placeholder="Örn. Ayşe Yılmaz" 
                                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[15px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    autoComplete="given-name"
                                />
                                <p className="text-[10px] text-stone-400 mt-1.5">
                                    Bu isim liderlik tablosunda görünecek
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2">
                                    🎯 Eğitim Düzeyin
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {levelOptions.map(function (x) {
                                        var isActive = level === x.id;
                                        var color = getLevelColor(x.id, isActive);
                                        return (
                                            <button 
                                                key={x.id} 
                                                type="button" 
                                                onClick={function () { pickLevel(x.id); }}
                                                className={"text-center py-3.5 rounded-2xl border-2 font-medium transition-all duration-200 " + color + 
                                                    (isActive ? " shadow-sm scale-[1.02]" : " hover:border-stone-300 dark:hover:border-stone-600")}
                                            >
                                                <div className="text-lg">{getLevelEmoji(x.id)}</div>
                                                <div className="text-xs mt-0.5">{x.t.split(" ").slice(1).join(" ")}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-stone-400 mt-2 text-center">
                                    {getLevelDescription(level)}
                                </p>
                            </div>

                            <button 
                                disabled={!name.trim()} 
                                onClick={goToNext} 
                                className="w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Devam →
                            </button>
                        </div>
                    )}

                    {/* ===== STEP 2 ===== */}
                    {step === 2 && (
                        <div className="space-y-4 slide-up">
                            {level === "lisans" ? (
                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2">🎯 Kulvar</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: "B", t: "B Grubu", d: "GY-GK" },
                                        { id: "A", t: "A Grubu", d: "Yakında" },
                                        { id: "ogretmen", t: "Öğretmenlik", d: "Yakında" },
                                        { id: "dhbt", t: "DHBT", d: "Yakında" }
                                    ].map(function (x) {
                                        var on = target === x.id;
                                        return (
                                            <button key={x.id} type="button" onClick={function () { setTarget(x.id); }}
                                                className={"text-left px-3 py-2.5 rounded-2xl border-2 text-sm font-medium transition-all " + (on ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700" : "border-stone-200 dark:border-stone-700")}>
                                                <span className="block">{x.t}</span>
                                                <span className="text-[10px] text-stone-400 font-normal">{x.d}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            ) : null}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5" htmlFor="ob-date">
                                    📅 Sınav Tarihi
                                </label>
                                <input 
                                    id="ob-date" 
                                    ref={dateInputRef}
                                    type="date" 
                                    value={examDate} 
                                    onChange={function (e) { setExamDate(e.target.value); }} 
                                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[15px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                                <p className="text-[10px] text-stone-400 mt-1.5">
                                    {getExamDateHint(level)} · Seçilen: {formatDateForDisplay(examDate)}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 p-4 border border-indigo-100 dark:border-indigo-800/30">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">💡</span>
                                    <div>
                                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                            {level === "lisans" ? "🎓 Lisans KPSS" :
                                             level === "onlisans" ? "📘 Ön Lisans KPSS" :
                                             "🏫 Ortaöğretim KPSS"}
                                        </p>
                                        <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 mt-0.5">
                                            {level === "lisans" ? "Her yıl düzenlenir" :
                                             "Çift yıllarda düzenlenir"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={kvkk} 
                                    onChange={function (e) { setKvkk(e.target.checked); }} 
                                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <div>
                                    <p className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                        Veri Onayı
                                    </p>
                                    <p className="text-[10px] text-stone-400">
                                        İlerleme verilerimin hesabımda saklanmasına izin veriyorum.
                                        <br />
                                        <span className="text-indigo-600 dark:text-indigo-400">
                                            Verilerin güvenle saklanır, asla paylaşılmaz.
                                        </span>
                                    </p>
                                </div>
                            </label>

                            <div className="flex gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={function () { setStep(1); }} 
                                    className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    ← Geri
                                </button>
                                <button 
                                    disabled={!kvkk} 
                                    onClick={complete} 
                                    className="flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    🚀 Başla
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
                        <p className="text-[10px] text-stone-400">
                            🔒 Verilerin güvende · İstediğin zaman profilinden silebilirsin
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.OnboardingScreen = OnboardingScreen;

})();