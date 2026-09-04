const { useState, useEffect, useMemo, useRef } = React;

const DERS_THEME = {
    "Tarih": { text: "text-stone-700", icon: "🏛️", darkText: "text-stone-300" },
    "Coğrafya": { text: "text-stone-700", icon: "🗺️", darkText: "text-stone-300" },
    "Türkçe": { text: "text-stone-700", icon: "✍️", darkText: "text-stone-300" },
    "Vatandaşlık": { text: "text-stone-700", icon: "⚖️", darkText: "text-stone-300" },
    "Güncel Bilgiler": { text: "text-stone-700", icon: "📰", darkText: "text-stone-300" }
};

function stripChoicePrefix(opt) {
    return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
}

function themeFor(ders, isDark) {
    const t = DERS_THEME[ders] || { text: "text-stone-700", icon: "📚", darkText: "text-stone-300" };
    return isDark ? Object.assign({}, t, { text: t.darkText }) : t;
}

function masteryLabel(m) {
    if (m === "iyi") return { text: "İyi", cls: "bg-emerald-50 text-emerald-600" };
    if (m === "orta") return { text: "Orta", cls: "bg-amber-50 text-amber-600" };
    if (m === "zayif") return { text: "Zayıf", cls: "bg-coral-50 text-coral-600" };
    return { text: "Yeni", cls: "bg-stone-100 text-stone-500" };
}

function BrandLoad(props) {
    return (
        <div className="brand-backdrop min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="brand-glow" aria-hidden="true"></div>
            <div className="brand-ring brand-ring-outer" aria-hidden="true"></div>
            <div className="brand-ring brand-ring-inner" aria-hidden="true"></div>
            <p className="relative z-10 text-sm font-medium" style={{ color: "rgba(245,235,199,0.85)" }}>{props.children || "Yükleniyor"}</p>
        </div>
    );
}

function useStudent() {
    const [st, setSt] = useState(function () { return StudentStore.getState(); });
    useEffect(function () {
        return StudentStore.subscribe(function (s) { setSt(s); });
    }, []);
    return st;
}

function Shell(props) {
    return (
        <div className={"mx-auto px-5 pt-6 sm:pt-10 " + (props.wide ? "max-w-4xl" : "max-w-2xl")}>
            {props.children}
            {props.padBottom === false ? null : (
                <div aria-hidden="true" style={{ height: "calc(8rem + env(safe-area-inset-bottom, 0px))" }} />
            )}
        </div>
    );
}

function ThemeBtn(props) {
    return (
        <button onClick={props.onClick}
            className="p-2.5 rounded-2xl glass transition-all duration-200 hover:scale-105"
            aria-label="Tema">
            {props.isDark ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-stone-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
}

function BackBtn(props) {
    return (
        <button type="button" onClick={props.onClick} className="back-btn" aria-label={props.label || "Geri"}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{props.label || "Geri"}</span>
        </button>
    );
}

function Confetti() {
    const [pieces, setPieces] = useState([]);
    useEffect(function () {
        const colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981"];
        setPieces(Array.from({ length: 24 }, function (_, i) {
            return {
                id: i,
                left: Math.random() * 100 + "%",
                delay: Math.random() * 2 + "s",
                duration: (Math.random() * 2 + 2) + "s",
                color: colors[Math.floor(Math.random() * colors.length)],
                size: (Math.random() * 8 + 6) + "px"
            };
        }));
    }, []);
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map(function (p) {
                return (
                    <div key={p.id} className="confetti" style={{
                        left: p.left, animationDelay: p.delay, animationDuration: p.duration,
                        width: p.size, height: p.size, backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px"
                    }} />
                );
            })}
        </div>
    );
}

function BottomNav(props) {
    const tabs = [
        { id: "bugun", label: "Bugün", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        { id: "dersler", label: "Dersler", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { id: "alistirmalar", label: "Alıştırmalar", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
        { id: "eksikler", label: "Eksikler", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { id: "deneme", label: "Deneme", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
        { id: "ben", label: "Ben", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
    ];
    return (
        <nav className="fixed bottom-0 inset-x-0 z-40 nav-glass" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
            <div className="max-w-2xl mx-auto grid grid-cols-6 px-1 pt-1">
                {tabs.map(function (tab) {
                    const on = props.nav === tab.id;
                    return (
                        <button key={tab.id} onClick={function () { props.onChange(tab.id); }}
                            className={"relative flex flex-col items-center gap-0.5 py-2 rounded-2xl text-[10px] leading-tight font-medium transition-all duration-200 " +
                                (on ? "text-indigo-600 bg-indigo-50/60 dark:bg-indigo-900/20" : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200")}>
                            <span className="relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={on ? 2.2 : 1.7}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                                </svg>
                                {tab.id === "bugun" && props.streak > 0 ? (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                    </span>
                                ) : null}
                            </span>
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

function Onboarding(props) {
    var profile = (props.student && props.student.profile) || {};
    var up = (props.student && props.student.userProfile) || {};
    var dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
    const [name, setName] = useState(profile.name || "");
    const [level, setLevel] = useState(up.educationLevel || "lisans");
    const [target, setTarget] = useState(up.targetType || "B");
    const [examDate, setExamDate] = useState(profile.examDate || dates[up.educationLevel || "lisans"] || "2026-09-06");
    const [kvkk, setKvkk] = useState(false);
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl fade-in">
                {window.AtanomLogo
                    ? window.AtanomLogo("h-16 w-16 mx-auto mb-3 object-contain")
                    : <img src="icons/atanom.png?v=18" alt="Atanly" className="h-16 w-16 mx-auto mb-3 object-contain" />}
                <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-1 text-center">Atanly</h2>
                <p className="text-sm text-stone-500 mb-5 text-center">Google ile giriş yaptın. Adın ve eğitim düzeyin uygulamayı açmak için gerekli.</p>
                <label className="block text-xs font-bold text-stone-500 mb-1">Adın</label>
                <input value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Örn. Ayşe"
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium" />
                <p className="text-xs font-bold text-stone-500 mb-2">Eğitim düzeyi</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[{ id: "lisans", t: "Lisans" }, { id: "onlisans", t: "Ön lisans" }, { id: "ortaogretim", t: "Ortaöğretim" }].map(function (x) {
                        var on = level === x.id;
                        return (
                            <button key={x.id} type="button" onClick={function () {
                                setLevel(x.id);
                                if (dates[x.id]) setExamDate(dates[x.id]);
                            }} className={"px-2 py-2 rounded-xl border-2 text-xs font-semibold " + (on ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-stone-200")}>{x.t}</button>
                        );
                    })}
                </div>
                {level === "lisans" ? (
                    <div>
                        <p className="text-xs font-bold text-stone-500 mb-2">Kulvar</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {[{ id: "B", t: "B Grubu" }, { id: "A", t: "A Grubu" }, { id: "ogretmen", t: "Öğretmenlik" }, { id: "dhbt", t: "DHBT" }].map(function (x) {
                                var on = target === x.id;
                                return (
                                    <button key={x.id} type="button" onClick={function () { setTarget(x.id); }}
                                        className={"px-3 py-2 rounded-xl border-2 text-xs font-semibold " + (on ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-stone-200")}>{x.t}</button>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
                <label className="block text-xs font-bold text-stone-500 mb-1">Sınav tarihi</label>
                <input type="date" value={examDate} onChange={function (e) { setExamDate(e.target.value); }}
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium" />
                <label className="flex items-start gap-2 mb-5 text-xs text-stone-600">
                    <input type="checkbox" checked={kvkk} onChange={function (e) { setKvkk(e.target.checked); }} className="mt-0.5" />
                    İlerleme verilerimin hesabımda saklanmasına izin veriyorum.
                </label>
                <button disabled={!name.trim() || !kvkk} onClick={function () {
                    StudentStore.completeOnboarding({
                        name: name.trim(),
                        nickname: name.trim(),
                        examDate: examDate,
                        dailyMinutes: 45,
                        dailyQuestions: 25,
                        educationLevel: level,
                        targetType: level === "lisans" ? target : "B",
                        kvkkConsent: true,
                        weeklyHours: 7
                    });
                    if (window.SyncEngine) window.SyncEngine.sync();
                }} className="w-full btn-primary text-white font-bold py-4 rounded-2xl disabled:opacity-40">
                    Başla
                </button>
            </div>
        </div>
    );
}

function examTrackName(level) {
    if (level === "onlisans") return "Ön lisans KPSS";
    if (level === "ortaogretim") return "Ortaöğretim KPSS";
    return "Lisans KPSS";
}

function hourOptions() {
    return [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6];
}

function formatHours(n) {
    var x = Number(n) || 0;
    if (x === 1) return "1 saat";
    if (x === 0.5) return "30 dk";
    if (x % 1 === 0.5) return Math.floor(x) + ",5 saat";
    return x + " saat";
}

function formatSlotLine(slots, catalog) {
    var parts = [];
    (slots || []).forEach(function (s) {
        if (catalog && !catalog[s.ders]) return;
        parts.push(formatHours(s.hours) + " " + s.ders);
    });
    return parts.join(" · ");
}

function StudyProgram(props) {
    const kpssData = props.kpssData || {};
    const dersKeys = Object.keys(kpssData);
    const saved = (props.student.userProfile && props.student.userProfile.studyPlan) || null;
    const ready = !!(saved && saved.ready);
    const [open, setOpen] = useState(!ready);
    const [draft, setDraft] = useState(function () { return StudentStore.cloneStudyPlan(saved); });
    const days = StudentStore.WEEK_DAYS;
    const todayId = StudentStore.planDayId();
    const live = ready ? StudentStore.cloneStudyPlan(saved) : null;
    const today = live && live.days[todayId];

    function patchDay(id, fn) {
        setDraft(function (prev) {
            var next = StudentStore.cloneStudyPlan(prev);
            next.days[id] = Object.assign({ on: false, slots: [] }, next.days[id]);
            fn(next.days[id]);
            return next;
        });
    }

    function addSlot(dayId, ders) {
        if (!ders) return;
        patchDay(dayId, function (day) {
            day.on = true;
            var hit = null;
            day.slots.forEach(function (s) { if (s.ders === ders) hit = s; });
            if (!hit) day.slots.push({ ders: ders, hours: 1 });
        });
    }

    var todayLine = null;
    if (ready && today && today.on) {
        var line = formatSlotLine(today.slots, kpssData);
        todayLine = line ? ("Bugün " + line) : "Bugün gün açık; ders ve saat ekle";
    } else if (ready) {
        todayLine = "Bugün programında çalışma günü değil";
    }

    return (
        <div className="mb-6 slide-up">
            <div className="rounded-3xl glass p-5 card-hover">
                <div className="flex justify-between items-start gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                            <span>📋</span> Programın
                        </p>
                        <p className="text-sm font-medium mt-1 text-stone-600 dark:text-stone-300">{todayLine || "Her güne ayrı ders ve saat yaz."}</p>
                    </div>
                    <button type="button" onClick={function () {
                        setDraft(StudentStore.cloneStudyPlan(saved));
                        setOpen(!open);
                    }} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0">
                        {open ? "Kapat" : (ready ? "Düzenle" : "Oluştur")}
                    </button>
                </div>
                {open ? (
                    <div className="mt-5 space-y-3">
                        {days.map(function (w) {
                            var d = draft.days[w.id];
                            var used = {};
                            (d.slots || []).forEach(function (s) { used[s.ders] = true; });
                            var leftover = dersKeys.filter(function (k) { return !used[k]; });
                            return (
                                <div key={w.id} className={"rounded-2xl px-4 py-3 transition-all " +
                                    (d.on ? "bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30" : "opacity-50 bg-stone-50 dark:bg-stone-800/30")}>
                                    <label className="flex items-center gap-3 text-sm font-semibold cursor-pointer">
                                        <input type="checkbox" checked={!!d.on} onChange={function (e) { patchDay(w.id, function (day) { day.on = e.target.checked; }); }}
                                            className="w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500" />
                                        <span>{w.full}</span>
                                        {d.on && d.slots.length ? (
                                            <span className="text-xs font-normal text-stone-400">toplam {formatHours(StudentStore.daySlotHours(d))}</span>
                                        ) : null}
                                    </label>
                                    {d.on ? (
                                        <div className="mt-3 space-y-2.5 pl-6">
                                            {(d.slots || []).map(function (s, si) {
                                                return (
                                                    <div key={s.ders} className="flex items-center gap-2 bg-white dark:bg-stone-800/50 rounded-xl px-3 py-2 shadow-sm">
                                                        <span className="flex-1 text-sm font-medium min-w-0 truncate">{s.ders}</span>
                                                        <select value={String(s.hours)} onChange={function (e) {
                                                            var h = Number(e.target.value);
                                                            patchDay(w.id, function (day) { day.slots[si].hours = h; });
                                                        }} className="text-sm px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent font-medium">
                                                            {hourOptions().map(function (h) {
                                                                return <option key={h} value={h}>{formatHours(h)}</option>;
                                                            })}
                                                        </select>
                                                        <button type="button" className="text-xs text-stone-400 hover:text-rose-500 px-1 transition-colors" onClick={function () {
                                                            patchDay(w.id, function (day) {
                                                                day.slots = day.slots.filter(function (x) { return x.ders !== s.ders; });
                                                            });
                                                        }}>✕</button>
                                                    </div>
                                                );
                                            })}
                                            {leftover.length ? (
                                                <select key={leftover.join("|")} defaultValue="" onChange={function (e) {
                                                    addSlot(w.id, e.target.value);
                                                }} className="w-full text-sm px-3 py-2.5 rounded-xl border border-dashed border-stone-300 dark:border-stone-600 bg-transparent focus:border-indigo-400">
                                                    <option value="" disabled>+ Ders ekle</option>
                                                    {leftover.map(function (k) {
                                                        return <option key={k} value={k}>{k}</option>;
                                                    })}
                                                </select>
                                            ) : (dersKeys.length ? null : <p className="text-xs text-stone-400">Ders listesi henüz yok.</p>)}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                        <button type="button" onClick={function () {
                            StudentStore.saveStudyPlan(draft);
                            setOpen(false);
                        }} className="w-full py-3.5 rounded-2xl btn-primary text-white font-bold text-sm">
                            Programı kaydet
                        </button>
                    </div>
                ) : null}
            </div>
            {ready && today && today.on && today.slots && today.slots.length ? (
                <div className="flex flex-wrap gap-2 mt-3">
                    {today.slots.filter(function (s) { return kpssData[s.ders]; }).map(function (s) {
                        return (
                            <button key={s.ders} type="button" onClick={function () { props.onDers && props.onDers(s.ders); }}
                                className="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/30 hover:bg-indigo-100 transition-colors">
                                {s.ders} · {formatHours(s.hours)}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

var DASH_COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

function StudyDash(props) {
    const d = StudyPlanner.studyDashboard ? StudyPlanner.studyDashboard(props.student) : null;
    if (!d) return (
        <div className="rounded-2xl glass p-6 text-center text-stone-400 text-sm slide-up">
            Çalışmaya başlayınca istatistikler burada görünecek.
        </div>
    );

    var weekMax = 1;
    d.weekMin.forEach(function (v) { if (v > weekMax) weekMax = v; });
    var trendMax = 1;
    d.weeks.forEach(function (w) { if (w.minutes > trendMax) trendMax = w.minutes; });
    var pts = d.weeks.map(function (w, i) {
        var x = 8 + (i / Math.max(1, d.weeks.length - 1)) * 220;
        var y = 78 - (w.minutes / trendMax) * 64;
        return x + "," + y;
    }).join(" ");
    var area = "8,78 " + pts + " 228,78";
    var weekGoalPct = d.plannedWeek ? Math.min(100, Math.round((d.actualWeekH / d.plannedWeek) * 100)) : (d.actualWeekH ? 100 : 0);
    var todayGoal = d.todayPlanH;
    var todayH = Math.round((d.todayMin / 60) * 10) / 10;
    var todayPct = todayGoal ? Math.min(100, Math.round((todayH / todayGoal) * 100)) : (todayH ? 100 : 0);
    var rec = d.longest.minutes ? (Math.round((d.longest.minutes / 60) * 10) / 10 + " saat") : "—";
    var dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    var circ = 2 * Math.PI * 28;
    var donutEls = [];
    var donutOff = 0;
    d.dersList.forEach(function (x, i) {
        var dash = circ * (x.v / d.dersSum);
        donutEls.push({ ders: x.ders, dash: dash, off: donutOff, color: DASH_COLORS[i % DASH_COLORS.length] });
        donutOff += dash;
    });

    return (
        <div className="space-y-4 slide-up">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">📊 İstatistikler</span>
                <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700"></span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl glass p-4 text-center card-hover">
                    <div className="font-stat text-2xl font-bold text-indigo-600">{d.streak}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">🔥 seri gün</div>
                </div>
                <div className="rounded-2xl glass p-4 text-center card-hover">
                    <div className="font-stat text-2xl font-bold text-amber-600">{d.avgSeansMin || "—"}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">⏱ dk / oturum</div>
                </div>
                <div className="rounded-2xl glass p-4 text-center card-hover">
                    <div className="font-stat text-2xl font-bold text-emerald-600">{rec}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">🏆 rekor gün</div>
                </div>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">Toplam {d.totalHours} saat</span>
                    <span className="text-xs text-stone-400">Bu hafta {d.actualWeekH}/{d.plannedWeek || 0} sa</span>
                </div>
                <div className="h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: weekGoalPct + "%" }} />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-medium">Bugün {todayH} / {todayGoal || 0} saat</span>
                    <span className="text-xs font-bold text-indigo-600">{todayPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: todayPct + "%" }} />
                </div>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <p className="text-sm font-semibold mb-3">📈 Haftalık trend</p>
                <svg viewBox="0 0 236 86" className="w-full h-24">
                    <polyline fill="rgba(79,70,229,0.12)" points={area} />
                    <polyline fill="none" stroke="#4f46e5" strokeWidth="2.5" points={pts} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex justify-between text-[10px] text-stone-400 -mt-1">
                    <span>8 hafta önce</span>
                    <span>bu hafta</span>
                </div>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <p className="text-sm font-semibold mb-3">📅 Bu hafta</p>
                <div className="flex items-end gap-1.5 h-28">
                    {d.weekMin.map(function (m, i) {
                        var h = Math.max(6, Math.round((m / weekMax) * 92));
                        var colors = ["#4f46e5", "#7c3aed", "#6366f1", "#8b5cf6", "#a78bfa", "#c084fc", "#ddd6fe"];
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                                <div className="w-full rounded-t-lg transition-all duration-300" style={{ height: h + "%", background: colors[i % colors.length] }} />
                                <span className="text-[10px] text-stone-400 mt-1.5 font-medium">{dayNames[i]}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl glass p-5 card-hover">
                <p className="text-sm font-semibold mb-3">📚 Ders dağılımı</p>
                {d.dersSum ? (
                    <div className="flex items-center gap-6 flex-wrap">
                        <svg width="100" height="100" viewBox="0 0 88 88" className="shrink-0">
                            <circle cx="44" cy="44" r="28" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                            {donutEls.map(function (x) {
                                return (
                                    <circle key={x.ders} cx="44" cy="44" r="28" fill="none" stroke={x.color} strokeWidth="12"
                                        strokeDasharray={x.dash + " " + (circ - x.dash)} strokeDashoffset={-x.off} transform="rotate(-90 44 44)"
                                        className="transition-all duration-500" />
                                );
                            })}
                        </svg>
                        <div className="min-w-0 space-y-1.5 flex-1">
                            {d.dersList.slice(0, 5).map(function (x, i) {
                                var pct = Math.round((x.v / d.dersSum) * 100);
                                return (
                                    <div key={x.ders} className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: DASH_COLORS[i % DASH_COLORS.length] }} />
                                        <span className="text-xs truncate flex-1">{x.ders}</span>
                                        <span className="text-xs font-bold text-stone-400">{pct}%</span>
                                        <div className="w-12 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: pct + "%", background: DASH_COLORS[i % DASH_COLORS.length] }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-stone-400">Ders saati birikince pasta dolacak.</p>
                )}
            </div>
        </div>
    );
}

function Bugun(props) {
    const plan = props.plan;
    const name = props.student.profile.name;
    const level = (props.student.userProfile && props.student.userProfile.educationLevel) || "lisans";
    const track = examTrackName(level);
    var examLine;
    if (plan.daysLeft == null) examLine = track + " · sınav tarihi yok";
    else if (plan.daysLeft < 0) examLine = track + " tarihi geçti";
    else if (plan.daysLeft === 0) examLine = track + " bugün";
    else examLine = track + "’ye " + plan.daysLeft + " gün kaldı";
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div className="slide-up">
                    <p className="text-sm font-medium text-stone-400 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span>
                        Hoş geldin{name ? ", " + name : ""}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight mt-1 gradient-text">Bugün</h1>
                    <p className="text-sm text-stone-400 mt-1 max-w-sm">Hedefine doğru her gün bir adım.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-5 mb-6 shadow-xl shadow-indigo-500/20 slide-up">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Sınav takvimi</p>
                        <p className="text-xl font-bold mt-0.5">{examLine}</p>
                    </div>
                    {plan.daysLeft != null && plan.daysLeft > 0 && plan.daysLeft < 30 ? (
                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-sm font-bold animate-pulse">
                            {plan.daysLeft} gün
                        </span>
                    ) : null}
                </div>
            </div>

            <StudyProgram student={props.student} kpssData={props.kpssData} onDers={props.onDers} />

            <StudyDash student={props.student} />
        </Shell>
    );
}

function AlistirmalarHome(props) {
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div className="slide-up">
                    <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text">Alıştırmalar</h1>
                    <p className="text-sm text-stone-400 mt-1">İki oyun: boşluk doldurma ve harita.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="grid gap-4">
                <button type="button" onClick={function () { props.onKind("cloze"); }}
                    className="text-left p-6 rounded-3xl glass card-hover">
                    <div className="h-14 w-14 rounded-2xl bg-teal-50 text-2xl flex items-center justify-center mb-3">✏️</div>
                    <h2 className="font-bold text-lg">Boşluk doldurma</h2>
                    <p className="text-sm text-stone-400 mt-1">Her ders ve konu. Şıklardan doğruyu seç.</p>
                </button>
                <button type="button" onClick={function () { props.onKind("map"); }}
                    className="text-left p-6 rounded-3xl glass card-hover">
                    <div className="h-14 w-14 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center mb-3">🗺️</div>
                    <h2 className="font-bold text-lg">Harita oyunu</h2>
                    <p className="text-sm text-stone-400 mt-1">Coğrafya konularına göre haritada bul.</p>
                </button>
            </div>
        </Shell>
    );
}

function AlistirmaDersList(props) {
    const kpssData = props.kpssData;
    const engine = window.ClozeEngine;
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h1 className="text-2xl font-black mb-1">Boşluk doldurma</h1>
            <p className="text-sm text-stone-400 mb-6">Ders seç, sonra konu.</p>
            <div className="space-y-3">
                {Object.keys(kpssData).map(function (ders) {
                    const t = themeFor(ders, props.isDark);
                    const konular = Object.keys(kpssData[ders] || {});
                    var n = 0;
                    konular.forEach(function (k) {
                        n += engine ? engine.countForKonu(kpssData[ders][k] || {}) : 0;
                    });
                    return (
                        <button key={ders} onClick={function () { props.onDers(ders); }}
                            className="w-full text-left p-5 rounded-3xl glass card-hover flex items-center gap-5 group">
                            <div className="h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl shrink-0">
                                {t.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="font-bold text-stone-800 dark:text-stone-100 text-lg">{ders}</h2>
                                <p className="text-sm text-stone-400">{konular.length} konu · {n} boşluk</p>
                            </div>
                            <span className="text-stone-300 group-hover:text-indigo-500 transition-colors text-xl">→</span>
                        </button>
                    );
                })}
            </div>
        </Shell>
    );
}

function AlistirmaKonuList(props) {
    const ders = props.ders;
    const t = themeFor(ders, props.isDark);
    const konular = Object.keys(props.kpssData[ders] || {});
    const engine = window.ClozeEngine;
    const topics = (props.student && props.student.topics && props.student.topics[ders]) || {};
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Dersler" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl">{t.icon}</div>
                <div>
                    <h1 className="text-3xl font-black">{ders}</h1>
                    <p className="text-zinc-500 text-sm">Derslerle aynı sıra. Konu bitince burası da açılır.</p>
                </div>
            </div>
            <div className="space-y-3">
                {konular.map(function (konu, idx) {
                    const kd = props.kpssData[ders][konu] || {};
                    const n = engine ? engine.countForKonu(kd) : 0;
                    const tp = topics[konu] || {};
                    const open = StudentStore.isKonuOpen(ders, konular, idx, props.kpssData);
                    const done = StudentStore.topicComplete(tp, kd);
                    return (
                        <button key={konu} disabled={!open} onClick={function () { if (open) props.onKonu(konu); }}
                            className={"w-full text-left p-5 panel rounded-3xl " + (open ? "" : "opacity-45")}>
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex gap-3 min-w-0">
                                    <div className={"h-10 w-10 rounded-xl flex items-center justify-center font-stat text-sm shrink-0 " + (done ? "bg-emerald-50 text-emerald-600" : (open ? "bg-teal-50 text-teal-800" : "bg-stone-100 text-stone-400"))}>{done ? "✓" : (open ? idx + 1 : "🔒")}</div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{konu}</div>
                                        <p className="text-xs text-slate-400 mt-1">{open ? (n ? n + " boşluk" : "Henüz alıştırma yok") : "Önce önceki konuyu bitir"}</p>
                                    </div>
                                </div>
                                {open ? <span className="text-stone-300 text-lg shrink-0">→</span> : null}
                            </div>
                        </button>
                    );
                })}
            </div>
        </Shell>
    );
}

function clozePromptNodes(text) {
    var parts = String(text || "").split("______");
    return parts.map(function (p, i) {
        return (
            <span key={i}>
                {p}
                {i < parts.length - 1 ? <span className="cloze-blank">____</span> : null}
            </span>
        );
    });
}

function ClozePlay(props) {
    const items = useMemo(function () {
        if (!window.ClozeEngine) return [];
        return window.ClozeEngine.buildForKonu(props.konuData, 12);
    }, [props.ders, props.konu, props.seed]);
    const [idx, setIdx] = useState(0);
    const [picked, setPicked] = useState(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(function () {
        setIdx(0); setPicked(null); setScore(0); setDone(false);
    }, [props.seed, props.konu]);

    if (!items.length) {
        return (
            <Shell>
                <div className="flex justify-between mb-4">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <div className="text-center py-16 rounded-3xl glass">
                    <p className="font-bold">Bu konuda henüz boşluk yok.</p>
                    <p className="text-sm text-stone-400 mt-2">Not veya soru eklenince alıştırmalar burada açılır.</p>
                </div>
            </Shell>
        );
    }

    if (done) {
        return (
            <Shell>
                <div className="flex justify-between mb-4">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <article className="study-card fade-in">
                    <header className="study-card-head">
                        <div>
                            <p className="study-card-kicker">{props.ders}</p>
                            <h2 className="study-card-title">{props.konu} · Bitti</h2>
                        </div>
                        <div className="note-progress">{score}/{items.length}</div>
                    </header>
                    <div className="study-card-body text-center py-8">
                        <p className="text-4xl font-black mb-2">{Math.round((score / items.length) * 100)}%</p>
                        <p className="text-stone-500">{score} doğru · {items.length - score} yanlış</p>
                    </div>
                    <footer className="study-card-foot">
                        <button onClick={props.onBack} className="back-btn"><span>Konular</span></button>
                        <button onClick={props.onAgain} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold">Tekrar oyna</button>
                    </footer>
                </article>
            </Shell>
        );
    }

    const it = items[idx];
    const ok = picked && picked.toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Konular" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <article className="study-card fade-in">
                <header className="study-card-head">
                    <div>
                        <p className="study-card-kicker">{props.ders}</p>
                        <h2 className="study-card-title">{props.konu} · Boşluk</h2>
                    </div>
                    <div className="note-progress">{idx + 1}/{items.length}</div>
                </header>
                <div className="study-card-body">
                    {it.hint ? <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-2">{it.hint}</p> : null}
                    <p className="text-[17px] leading-relaxed mb-6">{clozePromptNodes(it.prompt)}</p>
                    <div className="grid gap-2">
                        {(it.choices || []).map(function (c, ci) {
                            var isP = picked === c;
                            var isA = String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
                            var cls = "w-full text-left px-4 py-3 rounded-2xl border font-medium transition-colors ";
                            if (!picked) cls += "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-600 hover:border-teal-500";
                            else if (isA) cls += "bg-emerald-50 border-emerald-400 text-emerald-800";
                            else if (isP) cls += "bg-rose-50 border-rose-400 text-rose-800";
                            else cls += "bg-stone-50 border-stone-200 opacity-60";
                            return (
                                <button key={ci + "-" + c} disabled={!!picked} onClick={function () {
                                    if (picked) return;
                                    setPicked(c);
                                    if (String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR")) setScore(score + 1);
                                }} className={cls}>{c}</button>
                            );
                        })}
                    </div>
                    {picked ? (
                        <p className={"mt-4 text-sm font-semibold " + (ok ? "text-emerald-600" : "text-rose-600")}>
                            {ok ? "Doğru" : "Doğrusu: " + it.answer}
                        </p>
                    ) : null}
                </div>
                <footer className="study-card-foot">
                    <span className="text-xs text-stone-400">{score} doğru</span>
                    <button disabled={!picked} onClick={function () {
                        if (idx + 1 >= items.length) setDone(true);
                        else { setIdx(idx + 1); setPicked(null); }
                    }} className={"btn-primary text-white px-5 py-2.5 rounded-full font-semibold " + (!picked ? "opacity-40 pointer-events-none" : "")}>
                        {idx + 1 >= items.length ? "Bitir" : "Sonraki"}
                    </button>
                </footer>
            </article>
        </Shell>
    );
}

function MapTopics(props) {
    const quiz = window.MapQuiz;
    const tree = (quiz && quiz.TREE) || [];
    return (
        <Shell wide>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h1 className="text-3xl font-black tracking-tight gradient-text">Harita oyunu</h1>
            <p className="text-sm text-stone-400 mt-1 mb-6">KPSS fiziki · iklim · nüfus · maden · ulaşım haritaları. Konuyu seç, noktayı bul.</p>
            {tree.map(function (g) {
                return (
                    <div key={g.id} className="mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-stone-400 mb-2">{g.icon} {g.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {g.kids.map(function (k) {
                                var n = quiz ? quiz.countFor(k.id) : 0;
                                return (
                                    <button key={k.id} type="button" onClick={function () { props.onTopic(k.id); }}
                                        className="text-left p-4 rounded-2xl glass card-hover">
                                        <div className="font-bold">{k.icon} {k.title}</div>
                                        <div className="text-xs text-stone-400 mt-1">{n} hedef</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <p className="text-[10px] text-stone-400 pb-4">{quiz && quiz.PARK_SOURCE}</p>
        </Shell>
    );
}

function MapPlay(props) {
    const quiz = window.MapQuiz;
    const meta = quiz ? quiz.topicMeta(props.topicId) : null;
    const items = useMemo(function () {
        return quiz ? quiz.pickRound(props.topicId, 8) : [];
    }, [props.seed, props.topicId]);
    const layerRef = useRef({ pins: [] });
    const [idx, setIdx] = useState(0);
    const [picked, setPicked] = useState(null);
    const [okHit, setOkHit] = useState(false);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [cleared, setCleared] = useState([]);
    const [pins, setPins] = useState([]);
    const [svgHtml, setSvgHtml] = useState("");
    const [mapFail, setMapFail] = useState(false);
    const hostRef = useRef(null);
    const pickedRef = useRef(null);
    const timerRef = useRef(null);
    const HOLD_MS = 5500;

    useEffect(function () {
        setIdx(0); setPicked(null); setOkHit(false); setScore(0); setDone(false);
        setCleared([]); setPins([]);
        pickedRef.current = null;
    }, [props.seed, props.topicId]);

    useEffect(function () {
        var gone = false;
        fetch("svg/tr.svg?v=2").then(function (r) { return r.ok ? r.text() : Promise.reject(); })
            .then(function (txt) {
                if (gone) return;
                var doc = new DOMParser().parseFromString(txt, "image/svg+xml");
                var svg = doc.querySelector("svg");
                if (!svg) throw new Error("svg");
                svg.removeAttribute("width");
                svg.removeAttribute("height");
                svg.setAttribute("viewBox", svg.getAttribute("viewBox") || svg.getAttribute("viewbox") || "0 0 1000 422");
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
                svg.setAttribute("class", "tr-map");
                svg.setAttribute("aria-label", "Türkiye illeri");
                setSvgHtml(svg.outerHTML);
            })
            .catch(function () { if (!gone) setMapFail(true); });
        return function () { gone = true; };
    }, []);

    function goNext() {
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
        if (!pickedRef.current) return;
        var stepNow = items[idx];
        if (stepNow && stepNow.type === "map" && quiz) {
            var loc = (layerRef.current.pins || []).filter(function (p) { return p.id === stepNow.item.id; })[0];
            setCleared(function (prev) {
                return prev.concat([{
                    id: stepNow.item.id,
                    label: stepNow.item.name,
                    x: loc ? loc.x : stepNow.item.x,
                    y: loc ? loc.y : stepNow.item.y
                }]);
            });
        }
        pickedRef.current = null;
        setPicked(null);
        setOkHit(false);
        setPins([]);
        setIdx(function (i) {
            if (i + 1 >= items.length) {
                setDone(true);
                return i;
            }
            return i + 1;
        });
    }

    function choosePin(pinId) {
        if (pickedRef.current || !quiz) return;
        var step = items[idx];
        if (!step || step.type !== "map") return;
        var hit = pinId === step.item.id;
        var clicked = (layerRef.current.pins || []).filter(function (p) { return p.id === pinId; })[0];
        var right = (layerRef.current.pins || []).filter(function (p) { return p.id === step.item.id; })[0];
        var nextPins = [];
        if (hit && clicked) {
            nextPins.push({ x: clicked.x, y: clicked.y, text: step.item.name, kind: "ok" });
        } else {
            if (clicked) nextPins.push({ x: clicked.x, y: clicked.y, text: clicked.name, kind: "bad" });
            if (right) nextPins.push({ x: right.x, y: right.y, text: step.item.name, kind: "ok" });
        }
        pickedRef.current = pinId;
        setPicked(pinId);
        setOkHit(hit);
        setPins(nextPins);
        if (hit) setScore(function (s) { return s + 1; });
        timerRef.current = setTimeout(goNext, HOLD_MS);
    }

    function chooseMcq(label) {
        if (pickedRef.current || !quiz) return;
        var step = items[idx];
        if (!step || step.type !== "mcq") return;
        var hit = String(label) === String(step.answer);
        pickedRef.current = label;
        setPicked(label);
        setOkHit(hit);
        if (hit) setScore(function (s) { return s + 1; });
        timerRef.current = setTimeout(goNext, HOLD_MS);
    }

    function chooseTap(choice) {
        if (pickedRef.current || !quiz) return;
        var step = items[idx];
        if (!step || step.type !== "map") return;
        var hit = quiz.isTapCorrect(step.item, choice);
        pickedRef.current = choice.label;
        setPicked(choice.label);
        setOkHit(hit);
        if (hit) setScore(function (s) { return s + 1; });
        timerRef.current = setTimeout(goNext, HOLD_MS);
    }

    useEffect(function () {
        var el = hostRef.current;
        if (!el || !svgHtml || done) return;
        var step = items[idx];
        var svg = el.querySelector("svg");
        if (!svg) return;
        svg.setAttribute("viewBox", "0 0 1000 422");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        var paths = el.querySelectorAll("path[id]");
        Array.prototype.forEach.call(paths, function (p) {
            p.setAttribute("class", "map-stage");
        });
        var built = (quiz && quiz.topicLayerFromSvg) ? quiz.topicLayerFromSvg(svg, props.topicId) : { pins: [] };
        layerRef.current = built;
        var oldDots = svg.querySelector("g.topic-dots");
        if (oldDots) oldDots.remove();
        var oldLabs = svg.querySelector("g.map-float-labels");
        if (oldLabs) oldLabs.remove();
        var doneIds = {};
        cleared.forEach(function (row) { doneIds[row.id] = true; });
        var glyph = (quiz && quiz.topicGlyph) ? quiz.topicGlyph(props.topicId) : "📍";
        var dots = document.createElementNS("http://www.w3.org/2000/svg", "g");
        dots.setAttribute("class", "topic-dots");
        (built.pins || []).forEach(function (pin) {
            var wrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
            wrap.setAttribute("data-pin", pin.id);
            wrap.setAttribute("class", "topic-mark");
            var hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            hit.setAttribute("cx", String(pin.x));
            hit.setAttribute("cy", String(pin.y));
            hit.setAttribute("r", "16");
            hit.setAttribute("class", "topic-hit");
            var ico = document.createElementNS("http://www.w3.org/2000/svg", "text");
            ico.setAttribute("x", String(pin.x));
            ico.setAttribute("y", String(pin.y));
            ico.setAttribute("class", "topic-ico");
            ico.setAttribute("text-anchor", "middle");
            ico.setAttribute("dominant-baseline", "central");
            ico.setAttribute("font-size", "22");
            ico.textContent = pin.glyph || glyph;
            if (doneIds[pin.id]) wrap.setAttribute("class", "topic-mark topic-mark-done");
            if (picked && step && step.type === "map") {
                if (pin.id === step.item.id) wrap.setAttribute("class", "topic-mark topic-mark-ok");
                else if (pin.id === picked) wrap.setAttribute("class", "topic-mark topic-mark-bad");
            }
            wrap.appendChild(hit);
            wrap.appendChild(ico);
            dots.appendChild(wrap);
        });
        svg.appendChild(dots);
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "map-float-labels");
        function addLab(x, y, text, kind) {
            if (!text) return;
            var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
            t.setAttribute("x", String(x));
            t.setAttribute("y", String(y - 22));
            t.setAttribute("class", "map-pin map-pin-" + kind);
            t.setAttribute("font-size", "13");
            t.textContent = text;
            g.appendChild(t);
        }
        cleared.forEach(function (row) { addLab(row.x, row.y, row.label, "done"); });
        pins.forEach(function (pin) { addLab(pin.x, pin.y, pin.text, pin.kind); });
        svg.appendChild(g);
        function onClick(ev) {
            var n = ev.target.closest ? ev.target.closest("[data-pin]") : null;
            if (!n || pickedRef.current) return;
            var stepNow = items[idx];
            if (!stepNow || stepNow.type !== "map") return;
            if (n.classList && (n.classList.contains("topic-mark-done") || (n.closest && n.closest(".topic-mark-done")))) return;
            choosePin(n.getAttribute("data-pin"));
        }
        el.addEventListener("click", onClick);
        return function () { el.removeEventListener("click", onClick); };
    }, [svgHtml, idx, picked, items, done, cleared, pins, props.topicId]);

    useEffect(function () {
        return function () { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    if (!quiz || !items.length) {
        return (
            <Shell wide>
                <BackBtn onClick={props.onBack} label="Konular" />
                <p className="mt-8 text-center text-stone-400">Bu konuda hedef yok.</p>
            </Shell>
        );
    }

    if (done) {
        return (
            <Shell wide>
                <div className="flex justify-between mb-4">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <article className="study-card fade-in">
                    <header className="study-card-head">
                        <div>
                            <p className="study-card-kicker">Konu tamamlandı</p>
                            <h2 className="study-card-title">{meta ? meta.title : "Harita"}</h2>
                        </div>
                        <div className="note-progress">{score}/{items.length}</div>
                    </header>
                    <div className="study-card-body text-center py-8">
                        <p className="text-4xl font-black mb-2">{Math.round((score / items.length) * 100)}%</p>
                        <p className="text-stone-500">{score} doğru · {items.length - score} yanlış</p>
                    </div>
                    <footer className="study-card-foot">
                        <button onClick={props.onBack} className="back-btn"><span>Konular</span></button>
                        <button onClick={props.onAgain} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold">Tekrar oyna</button>
                    </footer>
                </article>
            </Shell>
        );
    }

    const step = items[idx];
    const taps = mapFail && step.type === "map" ? quiz.tapChoices(step.item) : [];
    return (
        <div className="map-play-root">
            <header className="map-play-top">
                <div className="map-play-bar">
                    <BackBtn onClick={props.onBack} label="Konular" />
                    <div className="note-progress shrink-0">{idx + 1}/{items.length}</div>
                    <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
                </div>
                <p className="map-play-kicker">{meta ? (meta.icon + " " + meta.title) : "Harita"}</p>
                <p className="map-play-prompt">{step.prompt}</p>
            </header>
            {!mapFail ? (
                <div className="map-play-stage tr-map-wrap" ref={hostRef} dangerouslySetInnerHTML={{ __html: svgHtml }} />
            ) : (
                <div className="map-play-stage p-4 overflow-auto">
                    <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
                        {taps.map(function (c) {
                            var isP = picked === c.label;
                            var isA = quiz.isTapCorrect(step.item, c);
                            var cls = "px-3 py-3 rounded-2xl border text-sm font-semibold ";
                            if (!picked) cls += "bg-white border-stone-200";
                            else if (isA) cls += "bg-emerald-50 border-emerald-400";
                            else if (isP) cls += "bg-rose-50 border-rose-400";
                            else cls += "opacity-50";
                            return (
                                <button key={c.kind + c.id} disabled={!!picked} className={cls} onClick={function () { chooseTap(c); }}>{c.label}</button>
                            );
                        })}
                    </div>
                </div>
            )}
            <footer className="map-play-foot">
                {step.type === "mcq" ? (
                    <div className="grid gap-2 mb-3">
                        {(step.choices || []).map(function (c, ci) {
                            var isP = picked === c;
                            var isA = String(c) === String(step.answer);
                            var cls = "w-full text-left px-4 py-3 rounded-2xl border font-medium ";
                            if (!picked) cls += "bg-white dark:bg-stone-800 border-stone-200";
                            else if (isA) cls += "bg-emerald-50 border-emerald-400";
                            else if (isP) cls += "bg-rose-50 border-rose-400";
                            else cls += "opacity-50";
                            return (
                                <button key={ci} disabled={!!picked} className={cls} onClick={function () { chooseMcq(c); }}>{c}</button>
                            );
                        })}
                    </div>
                ) : null}
                {picked ? (
                    <p className={"mb-2 text-sm font-semibold " + (okHit ? "text-emerald-700" : "text-rose-600")}>
                        {okHit
                            ? ("Doğru — " + (step.type === "mcq" ? step.answer : (step.item.name + " · " + quiz.answerLabel(step.item))))
                            : (step.type === "mcq" ? ("Doğrusu: " + step.answer) : ("Yanlış nokta · doğrusu: " + step.item.name))}
                    </p>
                ) : null}
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-stone-500">{score} doğru{picked ? " · 5–6 sn" : ""}</span>
                    <button disabled={!picked} onClick={goNext} className={"btn-primary text-white px-5 py-2.5 rounded-full font-semibold " + (!picked ? "opacity-40 pointer-events-none" : "")}>
                        {idx + 1 >= items.length ? "Bitir" : "Sonraki"}
                    </button>
                </div>
            </footer>
        </div>
    );
}

function DersHome(props) {
    const kpssData = props.kpssData;
    const stats = StudyPlanner.catalogStats(kpssData);
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div className="slide-up">
                    <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text">Dersler</h1>
                    <p className="text-sm text-stone-400 mt-1">Not oku, test çöz. Konular sırayla açılır.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="space-y-3">
                {Object.keys(kpssData).map(function (ders) {
                    const t = themeFor(ders, props.isDark);
                    const s = stats[ders] || { konuSayisi: 0, soruSayisi: 0 };
                    return (
                        <button key={ders} onClick={function () { props.onDers(ders); }}
                            className="w-full text-left p-5 rounded-3xl glass card-hover flex items-center gap-5 group">
                            <div className="h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl shrink-0">
                                {t.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="font-bold text-stone-800 dark:text-stone-100 text-lg">{ders}</h2>
                                <p className="text-sm text-stone-400">{s.konuSayisi} konu · {s.soruSayisi} soru</p>
                            </div>
                            <span className="text-stone-300 group-hover:text-indigo-500 transition-colors text-xl">→</span>
                        </button>
                    );
                })}
            </div>
            {function () {
                var edu = props.student && props.student.userProfile && props.student.userProfile.educationLevel;
                if (edu && edu !== "lisans") return null;
                var cfg = window.KpssConfig || {};
                var tt = (props.student && props.student.userProfile && props.student.userProfile.targetType) || "B";
                var ids = (cfg.targetModules && cfg.targetModules[tt]) || ["gygk"];
                var mods = (cfg.modules || []).filter(function (m) { return ids.indexOf(m.id) >= 0 && m.id !== "gygk"; });
                if (!mods.length) return null;
                return (
                    <div className="mt-10">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2">
                            <span>🚀</span> Kulvarın diğer modülleri
                        </p>
                        <div className="space-y-3">
                            {mods.map(function (m) {
                                return (
                                    <div key={m.id} className="p-5 rounded-3xl glass card-hover flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">{m.title}</p>
                                            <p className="text-xs text-stone-400 mt-0.5">{(m.lessons || []).slice(0, 3).join(" · ") || "İçerik bekleniyor"}</p>
                                        </div>
                                        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Yakında</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }()}
        </Shell>
    );
}

function KonuList(props) {
    const ders = props.ders;
    const t = themeFor(ders, props.isDark);
    const konular = Object.keys(props.kpssData[ders] || {});
    const topics = (props.student && props.student.topics && props.student.topics[ders]) || {};
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Dersler" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl">{t.icon}</div>
                <div>
                    <h1 className="text-3xl font-black">{ders}</h1>
                    <p className="text-zinc-500 text-sm">Sırayla ilerle. Konu bitince sonraki açılır.</p>
                </div>
            </div>
            <div className="space-y-3">
                {konular.map(function (konu, idx) {
                    const kd = props.kpssData[ders][konu] || {};
                    const stored = topics[konu];
                    const tp = stored || { noteIndex: 0, notesDone: false, lastPct: null, attempts: 0, mastery: "yok" };
                    const m = masteryLabel(tp.mastery);
                    const nLen = (kd.notlar || []).length;
                    const notePct = !nLen ? 0 : (tp.notesDone ? 100 : (!stored ? 0 : Math.round(((tp.noteIndex + 1) / nLen) * 100)));
                    const heat = tp.mastery === "zayif" ? "heat-zayif" : tp.mastery === "orta" ? "heat-orta" : tp.mastery === "iyi" ? "heat-iyi" : "";
                    const open = StudentStore.isKonuOpen(ders, konular, idx, props.kpssData);
                    const done = StudentStore.topicComplete(tp, kd);
                    return (
                        <button key={konu} disabled={!open} onClick={function () { if (open) props.onKonu(konu); }}
                            className={"w-full text-left p-5 panel rounded-3xl " + (open ? heat : "opacity-45")}>
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex gap-3 min-w-0">
                                    <div className={"h-10 w-10 rounded-xl flex items-center justify-center font-stat text-sm shrink-0 " + (done ? "bg-emerald-50 text-emerald-600" : (open ? "bg-stone-100 text-stone-700" : "bg-stone-100 text-stone-400"))}>{done ? "✓" : (open ? idx + 1 : "🔒")}</div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-800 dark:text-slate-100">{konu}</div>
                                        <p className="text-xs text-slate-400 mt-1">{open ? ((kd.notlar || []).length + " not · " + (kd.sorular || []).length + " soru") : "Önce önceki konuyu bitir"}</p>
                                    </div>
                                </div>
                                {open ? (
                                    <div className="text-right shrink-0">
                                        <div className="font-black text-sm">{tp.lastPct == null ? "—" : "%" + tp.lastPct}</div>
                                        <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + m.cls}>{m.text}</span>
                                    </div>
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </div>
        </Shell>
    );
}

function KonuHub(props) {
    const kd = props.konuData;
    const notlar = kd.notlar || [];
    const sorular = kd.sorular || [];
    const packs = StudentStore.topicTestPacks(sorular);
    const tp = StudentStore.getTopic(props.ders, props.konu);
    const m = masteryLabel(tp.mastery);
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <BackBtn onClick={props.onBack} label="Konular" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h2 className="text-3xl font-black mb-2">{props.konu}</h2>
            <p className="text-slate-500 mb-2">{props.ders}</p>
            <div className="flex gap-2 mb-8">
                <span className={"text-xs font-bold px-3 py-1 rounded-full " + m.cls}>{m.text}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">Son net {tp.lastPct == null ? "yok" : "%" + tp.lastPct}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">{tp.attempts} deneme</span>
            </div>
            <button onClick={props.onNotes} className="group w-full text-left p-7 mb-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 border border-amber-200 rounded-3xl shadow-lg card-hover">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl mb-4">📖</div>
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Konu özeti</h3>
                <p className="text-sm text-amber-700">{notlar.length} hap not · {tp.notesDone ? "tamamlandı" : "kaldığın yerden"}</p>
            </button>
            {packs.length ? (
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">{sorular.length} soru · 25’lik testler</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {packs.map(function (p, pi) {
                            return (
                                <button key={p.no} onClick={function () { props.onTest(pi); }}
                                    className="group text-left p-6 bg-stone-50 dark:bg-stone-900 border border-stone-300 rounded-3xl card-hover">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black mb-3">{p.no}</div>
                                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 mb-1">Test {p.no}</h3>
                                    <p className="text-sm text-stone-500">{p.items.length} soru</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-stone-400">Bu konuya ait henüz soru yok.</p>
            )}
        </Shell>
    );
}

function NotesView(props) {
    const notlar = props.notlar || [];
    const idx = props.index;
    return (
        <Shell wide={true} padBottom={false}>
            <div className="flex justify-between items-center mb-4 gap-3">
                <BackBtn onClick={props.onBack} label="Geri" />
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            {notlar.length ? (
                <article className="study-card fade-in">
                    <header className="study-card-head">
                        <div>
                            {props.ders ? <p className="study-card-kicker">{props.ders}</p> : null}
                            <h2 className="study-card-title">{props.konu} · Özet</h2>
                        </div>
                        <div className="note-progress">{idx + 1}/{notlar.length}</div>
                    </header>
                    <div key={idx} className="study-card-body text-[16px] leading-relaxed" dangerouslySetInnerHTML={{ __html: notlar[idx] }} />
                    <footer className="study-card-foot">
                        <button disabled={idx === 0} onClick={function () { props.onIndex(idx - 1); }}
                            className={"back-btn " + (idx === 0 ? "opacity-30 pointer-events-none" : "")}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Önceki</span>
                        </button>
                        {idx === notlar.length - 1 ? (
                            <button onClick={function () {
                                if (props.ders && props.konu) StudentStore.markNotesComplete(props.ders, props.konu);
                                if (props.hasTest) props.onTest();
                                else props.onBack();
                            }} className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold">{props.hasTest ? "Teste geç" : "Konuyu bitir"}</button>
                        ) : (
                            <button onClick={function () { props.onIndex(idx + 1); }}
                                className="btn-primary text-white px-5 py-2.5 rounded-full font-semibold inline-flex items-center gap-1">
                                <span>Sonraki</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </footer>
                </article>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed">Bu konu için henüz not yok.</div>
            )}
            {props.hasTest ? (
                <button onClick={props.onTest} className="mt-8 mb-8 w-full btn-primary text-white p-5 rounded-2xl font-bold">
                    Notları bitirdim, teste geç
                </button>
            ) : null}
        </Shell>
    );
}

function TestView(props) {
    const items = props.session.items;
    const qIndex = props.qIndex;
    const item = items[qIndex] || { q: { question: "", options: [], correctAnswerIndex: 0, explanation: "" } };
    const soru = item.q;
    const progress = ((qIndex + 1) / (items.length || 1)) * 100;
    const timed = props.session.secondsLeft != null;
    const mm = timed ? Math.floor(props.session.secondsLeft / 60) : 0;
    const ss = timed ? String(props.session.secondsLeft % 60).padStart(2, "0") : "";
    const tLeft = props.session.secondsLeft;
    const tCls = !timed ? "" : (tLeft <= 60 ? "text-coral-500" : tLeft <= 300 ? "text-amber-500" : "text-navy-600");
    return (
        <Shell padBottom={false}>
            <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-4">
                <button onClick={props.onQuit} className="hover:text-rose-500 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200">Bitir</button>
                <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200">
                    {props.session.testNo ? ("Test " + props.session.testNo + " · ") : ""}{qIndex + 1}/{items.length} · Doğru {props.score}
                    {timed ? <span className={"ml-2 font-stat " + tCls}>{mm}:{ss}</span> : null}
                </span>
            </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mb-4 overflow-hidden">
                <div className="h-2.5 rounded-full" style={{ width: progress + "%", background: "linear-gradient(90deg, #0D2C4D, #1D8A99, #C5A059)" }} />
            </div>
            {item.ders ? <p className="text-xs font-bold text-slate-400 mb-3">{item.ders} · {item.konu}</p> : null}
            <div className="q-stem p-6 sm:p-8 rounded-3xl mb-6 relative overflow-hidden fade-in">
                <div className="q-stem-bar absolute top-0 left-0 w-1.5 h-full"></div>
                <h3 className="text-lg font-bold leading-relaxed whitespace-pre-line text-stone-900 pl-2">{soru.question}</h3>
            </div>
            <div className="space-y-3">
                {(soru.options || []).map(function (opt, i) {
                    let cls = "w-full text-left p-5 rounded-2xl border-2 font-semibold transition-all flex items-center gap-4 option-btn ";
                    let icon = null;
                    if (props.answered) {
                        if (i === soru.correctAnswerIndex) {
                            cls += "bg-emerald-500 border-emerald-500 text-white";
                            icon = <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
                        } else if (i === props.picked) {
                            cls += "bg-rose-500 border-rose-500 text-white";
                            icon = <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
                        } else cls += "bg-slate-50 dark:bg-slate-800/50 border-slate-200 text-slate-400 opacity-60";
                    } else {
                        cls += "bg-white dark:bg-slate-800 border-slate-200 text-stone-800";
                        icon = <span className="choice-letter flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + i)}</span>;
                    }
                    return (
                        <button key={i} onClick={function () { props.onAnswer(i); }} disabled={props.answered} className={cls}>
                            {icon}<span className="text-[15px]">{stripChoicePrefix(opt)}</span>
                        </button>
                    );
                })}
            </div>
            {props.answered ? (
                <div className="mt-8 space-y-4 fade-in pb-10">
                    <div className="bg-indigo-50 dark:bg-slate-900 border border-indigo-100 border-l-4 border-l-indigo-600 p-6 rounded-2xl">
                        <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm mb-2">Çözüm notu</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{soru.explanation}</p>
                    </div>
                    <button onClick={props.onNext} className="w-full btn-primary text-white p-5 rounded-2xl font-semibold">
                        {qIndex + 1 === items.length ? "Sonuçları gör" : "Sonraki soru"}
                    </button>
                </div>
            ) : <div className="h-8" />}
        </Shell>
    );
}

function ResultView(props) {
    const total = props.session.items.length;
    const score = props.score;
    const oran = total ? Math.round((score / total) * 100) : 0;
    const yorum = oran >= 85 ? "Mükemmel. Bu konuyu kilitle, zayıf olana geç." : oran >= 60 ? "İyi gidiyorsun. Yanlışları deftere aldık." : oran >= 40 ? "Eşik altı. Notu aç, aynı gün 10 soru daha." : "Önce not. Soru yağmuru şimdi işe yaramaz.";
    const renk = oran >= 85 ? "#10b981" : oran >= 60 ? "#4f46e5" : oran >= 40 ? "#f59e0b" : "#ef4444";
    return (
        <Shell>
            {oran >= 85 && <Confetti />}
            <div className="panel p-8 rounded-3xl text-center fade-in">
                <h2 className="text-2xl font-display font-bold mb-2">{props.session && props.session.testNo ? ("Test " + props.session.testNo + " bitti") : "Tur bitti"}</h2>
                <p className="text-zinc-500 mb-6 text-sm">{yorum}</p>
                <div className="relative mx-auto w-36 h-36 mb-6">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke={renk} strokeWidth="3" strokeDasharray={oran + ", 100"} strokeLinecap="round" className="progress-ring" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-stat text-3xl text-indigo-600">%{oran}</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-slate-50"><div className="font-black text-xl">{total}</div><div className="text-xs text-slate-400">Soru</div></div>
                    <div className="p-3 rounded-2xl bg-emerald-50"><div className="font-black text-xl text-emerald-600">{score}</div><div className="text-xs text-emerald-500">Doğru</div></div>
                    <div className="p-3 rounded-2xl bg-rose-50"><div className="font-black text-xl text-rose-500">{total - score}</div><div className="text-xs text-rose-400">Yanlış</div></div>
                </div>
                {props.breakdown && props.breakdown.length > 1 ? (
                    <div className="text-left mb-6">
                        <h3 className="text-sm font-black text-slate-500 mb-2">Konu kırılımı — çalışılacaklar üstte</h3>
                        {props.breakdown.slice(0, 5).map(function (b) {
                            return (
                                <div key={b.ders + b.konu} className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-700">
                                    <span className="pr-2">{b.konu}</span>
                                    <span className="font-black">%{b.pct}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
                {props.wrongList.length > 0 ? (
                    <details className="text-left mb-6">
                        <summary className="cursor-pointer text-sm font-bold p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">Yanlış {props.wrongList.length} soru</summary>
                        <div className="mt-3 space-y-3">
                            {props.wrongList.map(function (w, i) {
                                return (
                                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border text-left">
                                        <p className="text-sm font-semibold whitespace-pre-line">{w.question}</p>
                                        <p className="text-xs mt-2 text-emerald-600 font-bold">Doğru: {w.dogru}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </details>
                ) : null}
                <button onClick={function () {
                    if (!window.ShareCard) return;
                    const nick = (props.student && props.student.userProfile && props.student.userProfile.nickname) || "öğrenci";
                    const url = window.ShareCard.draw({
                        nickname: nick, pct: oran, correct: score, total: total,
                        streak: (props.student && props.student.streak && props.student.streak.count) || 0,
                        caption: "Net kartı · Atanly"
                    });
                    window.ShareCard.download(url, "atanly-net-karti.png");
                }} className="w-full mb-3 p-4 rounded-2xl btn-primary text-white font-semibold">Net kartını indir</button>
                <div className="flex gap-3">
                    <button onClick={props.onRetry} className="flex-1 btn-primary text-white p-4 rounded-2xl font-semibold">Tekrar</button>
                    <button onClick={props.onHome} className="flex-1 panel p-4 rounded-2xl font-medium">Kapat</button>
                </div>
            </div>
        </Shell>
    );
}

function Eksikler(props) {
    const plan = props.plan;
    const byDers = {};
    plan.rows.forEach(function (r) {
        if (!byDers[r.ders]) byDers[r.ders] = [];
        byDers[r.ders].push(r);
    });
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div className="slide-up">
                    <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text">Eksikler</h1>
                    <p className="text-sm text-stone-400 mt-1">Konu durumu. Not ve soru yalnızca Dersler’den.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={function () { props.onReview(); }} disabled={!plan.due.length}
                    className="p-4 rounded-2xl btn-primary text-white text-left disabled:opacity-40">
                    <span className="font-semibold block">Bugün tekrar · {plan.due.length}</span>
                    <span className="text-xs font-normal opacity-80 mt-1 block">Daha önce çözdüğün, bugün hatırlaman gereken sorular.</span>
                </button>
                <button onClick={function () { props.onWrong(); }} disabled={!plan.wrong.length}
                    className="p-4 rounded-2xl border-2 border-rose-500 text-rose-600 text-left disabled:opacity-40">
                    <span className="font-semibold block">Yanlış defteri · {plan.wrong.length}</span>
                    <span className="text-xs font-normal opacity-80 mt-1 block">Hâlâ yanlışta duran sorular. Konu kilidini açmaz.</span>
                </button>
            </div>
            {Object.keys(byDers).map(function (ders) {
                const t = themeFor(ders, props.isDark);
                return (
                    <div key={ders} className="mb-6">
                        <h2 className={"font-black mb-2 " + t.text}>{t.icon} {ders}</h2>
                        <div className="space-y-1.5">
                            {byDers[ders].map(function (r) {
                                const done = StudentStore.topicComplete(r, {
                                    sorular: new Array(r.soruSayisi || 0),
                                    notlar: new Array(r.notSayisi || 0)
                                });
                                return (
                                    <div key={r.konu}
                                        className={"w-full flex justify-between items-center p-3 rounded-xl border pointer-events-none " + (done
                                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                                            : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 opacity-45")}>
                                        <span className={"text-sm text-left pr-2 " + (done ? "font-semibold text-emerald-800 dark:text-emerald-200" : "font-medium text-stone-500")}>{r.konu}</span>
                                        <span className={"text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 " + (done ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400")}>
                                            {done ? "Bitti" : "Bekliyor"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </Shell>
    );
}

function DenemeSetup(props) {
    const dersler = Object.keys(props.kpssData);
    const stats = StudyPlanner.catalogStats(props.kpssData);
    const [sel, setSel] = useState(function () {
        const o = {};
        dersler.forEach(function (d) { o[d] = true; });
        return o;
    });
    const [n, setN] = useState(20);
    const [mins, setMins] = useState(0);
    function toggle(d) {
        const next = Object.assign({}, sel);
        next[d] = !next[d];
        setSel(next);
    }
    const chosen = dersler.filter(function (d) { return sel[d]; });
    var pool = 0;
    chosen.forEach(function (d) { pool += (stats[d] && stats[d].soruSayisi) || 0; });
    const nOpts = [10, 20, 30, 40];
    const tOpts = [
        { v: 0, t: "Süre yok" },
        { v: 15, t: "15 dk" },
        { v: 20, t: "20 dk" },
        { v: 40, t: "40 dk" }
    ];
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div className="slide-up">
                    <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text">Deneme</h1>
                    <p className="text-sm text-stone-400 mt-1">Karışık pratik veya tam kitapçık. Konu kilidini atlatmaz; rastgele soru çeker.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>

            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <div className="flex justify-between items-baseline mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Dersler</p>
                    <p className="text-xs text-stone-400">{chosen.length}/{dersler.length} seçili · {pool} soru</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {dersler.map(function (d) {
                        var t = themeFor(d, props.isDark);
                        var on = !!sel[d];
                        var sc = stats[d] || { soruSayisi: 0, konuSayisi: 0 };
                        return (
                            <button type="button" key={d} onClick={function () { toggle(d); }}
                                className={"w-full flex items-center gap-3 p-3 rounded-xl text-left border-2 transition-all " + (on ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800")}>
                                <span className={"h-10 w-10 rounded-xl flex items-center justify-center text-lg shrink-0 " + (on ? "bg-white/15" : "bg-white dark:bg-stone-800")}>{t.icon}</span>
                                <span className="min-w-0 flex-1">
                                    <span className="font-medium block">{d}</span>
                                    <span className={"text-xs block mt-0.5 " + (on ? "text-white/70" : "text-zinc-400")}>{sc.konuSayisi} konu · {sc.soruSayisi} soru</span>
                                </span>
                                <span className={"h-5 w-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 " + (on ? "border-white bg-white text-indigo-600" : "border-stone-300 text-transparent")}>✓</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Soru sayısı</p>
                <p className="text-sm font-semibold mb-3">{n} soru</p>
                <div className="flex gap-2 mb-2">
                    {nOpts.map(function (x) {
                        return (
                            <button type="button" key={x} onClick={function () { setN(x); }}
                                className={"flex-1 py-2 rounded-xl text-sm font-medium border-2 " + (n === x ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 dark:border-stone-700")}>{x}</button>
                        );
                    })}
                </div>
                <input type="range" min="5" max="50" step="5" value={n} onChange={function (e) { setN(Number(e.target.value)); }} className="w-full accent-indigo-600" />
            </div>

            <div className="rounded-3xl glass p-5 mb-5 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Süre</p>
                <p className="text-sm font-semibold mb-3">{mins === 0 ? "Sınır yok — kendi hızında" : mins + " dakikada bitir"}</p>
                <div className="grid grid-cols-4 gap-2">
                    {tOpts.map(function (x) {
                        return (
                            <button type="button" key={x.v} onClick={function () { setMins(x.v); }}
                                className={"py-2 rounded-xl text-xs font-medium border-2 " + (mins === x.v ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 dark:border-stone-700")}>{x.t}</button>
                        );
                    })}
                </div>
            </div>

            <button type="button" onClick={function () {
                const items = StudyPlanner.mixedQuiz(props.kpssData, chosen, n);
                if (!items.length) { alert("Seçilen derslerde soru yok."); return; }
                props.onStart(items, mins * 60);
            }} className="w-full btn-primary text-white p-4 rounded-2xl text-left">
                <span className="font-semibold block">Karışık testi başlat</span>
                <span className="text-xs font-normal text-white/75 mt-0.5 block">{chosen.length} ders · {n} soru · {mins ? mins + " dk" : "süre yok"}</span>
            </button>
            {props.onFullExam ? (
                <button type="button" onClick={props.onFullExam} className="mt-3 w-full p-4 rounded-2xl glass text-left card-hover">
                    <span className="font-semibold block">Tam deneme</span>
                    <span className="text-xs text-zinc-400 font-normal mt-0.5 block">40 soru, 40 dakika, optik kâğıt. Sınav temposu.</span>
                </button>
            ) : null}
        </Shell>
    );
}

function eduLabel(id) {
    if (id === "onlisans") return "Ön lisans";
    if (id === "ortaogretim") return "Ortaöğretim";
    return "Lisans";
}

function needsKulvar(level) {
    return !level || level === "lisans";
}

function trackLabel(id) {
    var list = (window.KpssConfig && window.KpssConfig.targetTypes) || [];
    var hit = list.filter(function (x) { return x.id === id; })[0];
    return (hit && hit.t) || id || "—";
}

function fmtExam(iso) {
    if (!iso) return "—";
    var p = String(iso).split("-");
    if (p.length === 3) return p[2] + "." + p[1] + "." + p[0];
    return iso;
}

function Ben(props) {
    const st = props.student;
    let totQ = 0, totC = 0;
    Object.keys(st.sessions).forEach(function (d) {
        totQ += st.sessions[d].questions || 0;
        totC += st.sessions[d].correct || 0;
    });
    const overall = totQ ? Math.round((totC / totQ) * 100) : 0;
    const up = st.userProfile || {};
    const field = "w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900";
    const isAdmin = up.role === "admin";
    const [editing, setEditing] = useState(false);
    const [draftName, setDraftName] = useState("");
    const [draftTrack, setDraftTrack] = useState("B");
    const [draftEdu, setDraftEdu] = useState("");
    const eduReq = up.educationChangeRequest;
    const showKulvar = needsKulvar(totQ === 0 && editing && draftEdu ? draftEdu : up.educationLevel);

    function startSettingsEdit() {
        setDraftName(st.profile.name || "");
        setDraftTrack(up.targetType || "B");
        setDraftEdu(totQ === 0 ? (up.educationLevel || "lisans") : "");
        setEditing(true);
    }

    function sendSettings() {
        var nextEdu = (totQ === 0 && draftEdu) ? draftEdu : up.educationLevel;
        StudentStore.updateProfile({ name: draftName });
        var patch = { nickname: draftName };
        if (needsKulvar(nextEdu)) patch.targetType = draftTrack;
        else patch.targetType = "B";
        StudentStore.updateUserProfile(patch);
        var wantEdu = draftEdu && draftEdu !== up.educationLevel && (!eduReq || eduReq.status !== "pending") ? draftEdu : "";
        if (wantEdu) {
            if (totQ === 0 && StudentStore.setEducationLevel) {
                StudentStore.setEducationLevel(wantEdu);
                wantEdu = "";
            } else {
                StudentStore.requestEducationChange(wantEdu);
            }
        }
        setEditing(false);
        var sb = window.SupabaseClient && window.SupabaseClient.get();
        var done = function () { if (window.SyncEngine) window.SyncEngine.sync(); };
        if (wantEdu && sb && sb.functions) {
            sb.functions.invoke("admin-action", { body: { action: "submit_edu", to: wantEdu } }).then(function () { done(); }).catch(done);
        } else {
            done();
        }
    }
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div className="slide-up">
                    <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text">Profil</h1>
                    <p className="text-sm text-stone-400 mt-1">{up.email || "Hesap bağlı"}</p>
                    <p className="text-xs text-stone-400 mt-1">Ayarlar, araçlar ve plan burada.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="p-4 rounded-2xl glass card-hover"><div className="text-xl font-semibold gradient-text">{totQ}</div><div className="text-xs text-stone-400 mt-1">Soru</div></div>
                <div className="p-4 rounded-2xl glass card-hover"><div className="text-xl font-semibold gradient-text">%{overall}</div><div className="text-xs text-stone-400 mt-1">Net</div></div>
            </div>
            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Ayarlar</p>
                    {!editing ? (
                        <button type="button" onClick={startSettingsEdit} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Düzenle</button>
                    ) : null}
                </div>
                {eduReq && eduReq.status === "pending" ? (
                    <p className="text-sm text-amber-800 bg-amber-50 rounded-xl px-3 py-2 mt-3">Eğitim değişikliği onay bekliyor: {eduLabel(eduReq.to)}</p>
                ) : null}
                {eduReq && eduReq.status === "rejected" && editing ? (
                    <p className="text-sm text-coral-600 mt-3">Son eğitim talebi reddedildi. Yeniden seçebilirsin.</p>
                ) : null}
                {!editing ? (
                    <dl className="mt-3 divide-y divide-stone-100 dark:divide-stone-800">
                        {[
                            { k: "Ad", v: st.profile.name || "—" },
                            { k: "Eğitim", v: eduLabel(up.educationLevel) },
                            { k: "Sınav tarihi", v: fmtExam(st.profile.examDate) }
                        ].concat(needsKulvar(up.educationLevel) ? [{ k: "Kulvar", v: trackLabel(up.targetType || "B") }] : []).map(function (row) {
                            return (
                                <div key={row.k} className="py-3 flex justify-between gap-4">
                                    <dt className="text-sm text-stone-400">{row.k}</dt>
                                    <dd className="text-sm font-medium text-right">{row.v}</dd>
                                </div>
                            );
                        })}
                    </dl>
                ) : (
                    <div className="mt-3 space-y-3">
                        <label className="text-sm text-stone-500">Ad</label>
                        <input value={draftName} onChange={function (e) { setDraftName(e.target.value); }} className={field} />
                        <label className="text-sm text-stone-500">Eğitim</label>
                        {totQ === 0 ? (
                            <div>
                                <select value={draftEdu || up.educationLevel || "lisans"} onChange={function (e) { setDraftEdu(e.target.value); }} className={field + " mt-1"}>
                                    <option value="lisans">Lisans</option>
                                    <option value="onlisans">Ön lisans</option>
                                    <option value="ortaogretim">Ortaöğretim</option>
                                </select>
                                <p className="text-xs text-stone-400 mt-1">Soru çözmeden önce düzeyi burada düzeltebilirsin. Sınav tarihi ÖSYM takvimine bağlanır.</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm font-medium">{eduLabel(up.educationLevel)}</p>
                                <p className="text-xs text-stone-400">Düzey değişimi admin onayı ister. Sınav tarihi ÖSYM takvimine bağlanır.</p>
                                {(!eduReq || eduReq.status !== "pending") ? (
                                    <div>
                                        <label className="text-sm text-stone-500">Yeni eğitim düzeyi</label>
                                        <select value={draftEdu} onChange={function (e) { setDraftEdu(e.target.value); }} className={field + " mt-1"}>
                                            <option value="">Değiştirme</option>
                                            {up.educationLevel !== "lisans" ? <option value="lisans">Lisans</option> : null}
                                            {up.educationLevel !== "onlisans" ? <option value="onlisans">Ön lisans</option> : null}
                                            {up.educationLevel !== "ortaogretim" ? <option value="ortaogretim">Ortaöğretim</option> : null}
                                        </select>
                                    </div>
                                ) : null}
                            </div>
                        )}
                        <label className="text-sm text-stone-500">Sınav tarihi</label>
                        <p className="text-sm font-medium">{fmtExam(st.profile.examDate)}</p>
                        {showKulvar ? (
                            <div>
                                <label className="text-sm text-stone-500">Kulvar</label>
                                <select value={draftTrack} onChange={function (e) { setDraftTrack(e.target.value); }} className={field}>
                                    {((window.KpssConfig && window.KpssConfig.targetTypes) || [
                                        { id: "B", t: "B Grubu" }, { id: "A", t: "A Grubu" }, { id: "ogretmen", t: "Öğretmenlik" }, { id: "dhbt", t: "DHBT" }
                                    ]).map(function (x) {
                                        return <option key={x.id} value={x.id}>{x.t}</option>;
                                    })}
                                </select>
                            </div>
                        ) : null}
                        <div className="flex gap-2 pt-1">
                            <button type="button" onClick={sendSettings} className="flex-1 py-3 rounded-xl btn-primary text-white text-sm font-semibold">Gönder</button>
                            <button type="button" onClick={function () { setEditing(false); }} className="px-4 py-3 rounded-xl border-2 border-stone-200 text-sm font-medium">Vazgeç</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Araçlar</p>
                <p className="text-xs text-stone-400 mb-3">Sıralama, deneme, puan ve asistan. Ders kilidini atlatmaz.</p>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: "placement", t: "Puan / tercih", d: "Tahmini puanın hangi kurumlara yeter" },
                        { id: "leaderboard", t: "Türkiye", d: "Haftalık soru ve deneme sıralaması" },
                        { id: "heat", t: "Isı haritası", d: "30 günlük tempo ve konu hakimiyeti" },
                        { id: "exam", t: "Tam deneme", d: "40 soru, 40 dakika kitapçık" },
                        { id: "ai", t: "Soru asistanı", d: "Yanlışın nedenini kısaca açıklar" },
                        { id: "live", t: "Canlı deneme", d: "Cumartesi ortak saat; şimdi de çözülür" },
                        { id: "instructor", t: "Kurum", d: "Davet kodu ve çalışma grubu" }
                    ].map(function (x) {
                        return (
                            <button key={x.id} onClick={function () { props.onOpen && props.onOpen(x.id); }}
                                className="text-left px-3 py-3 rounded-xl bg-stone-50 dark:bg-stone-800 card-hover">
                                <span className="text-sm font-medium block">{x.t}</span>
                                <span className="text-[11px] text-stone-400 font-normal leading-snug mt-0.5 block">{x.d}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Davet</p>
                <p className="text-xs text-stone-400 mt-1">Davet kodun: <b>{StudentStore.ensureReferralCode ? StudentStore.ensureReferralCode() : (up.referralCode || "—")}</b></p>
                <label className="text-xs text-stone-400 mt-2 block">Arkadaş kodu</label>
                <input defaultValue={up.referredBy || ""} onBlur={function (e) {
                    if (window.PaymentClient) window.PaymentClient.applyReferral(e.target.value);
                }} className={field + " mt-1"} />
            </div>
            <div className="rounded-3xl glass p-5 mb-4 card-hover">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Rozetler</p>
                <p className="text-xs text-stone-400 mb-2">Seri, soru ve ilk deneme hedefleri.</p>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "firstDay", title: "İlk çalışma günü" },
                        { id: "streak7", title: "7 gün kesintisiz" },
                        { id: "q1000", title: "1000 soru" },
                        { id: "firstExam", title: "İlk tam deneme" }
                    ].map(function (b) {
                        var on = st.achievements && st.achievements[b.id];
                        return (
                            <span key={b.id} className={"text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 " + (on ? "bg-emerald-50 text-emerald-600 pop-in" : "bg-stone-100 dark:bg-slate-800 text-stone-400")}>
                                {on ? null : (window.KpssIcon ? window.KpssIcon("lock", "w-3 h-3") : null)}
                                {b.title}
                            </span>
                        );
                    })}
                </div>
            </div>
            <button onClick={function () {
                if (window.NotificationEngine) window.NotificationEngine.requestPush().then(function (r) {
                    if (r.ok) {
                        var n = window.NotificationEngine.streakNudge(st);
                        if (n) window.NotificationEngine.showLocal("Atanly", n);
                    }
                });
            }} className="w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover">
                <span className="font-medium block">Hatırlatma izni</span>
                <span className="text-xs text-stone-400 font-normal mt-0.5 block">Tarayıcı bildirimi: seri bozulmasın diye "bugün çalış" uyarısı. İstersen kapatırsın.</span>
            </button>
            {isAdmin ? (
                <button onClick={function () { props.onAdmin && props.onAdmin(); }} className="w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover font-medium">Yönetim</button>
            ) : null}
            <button onClick={function () {
                if (confirm("Hesap silme talebi kaydedilir. Destek onayından sonra veri silinir.")) StudentStore.requestDeletion();
            }} className="w-full mb-3 p-3.5 rounded-2xl text-sm text-stone-400">Veri silme talebi</button>
            <button onClick={function () { props.onSignOut && props.onSignOut(); }} className="w-full p-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium">Çıkış</button>
        </Shell>
    );
}

function toItemsFromKonu(kpssData, ders, konu) {
    const sorular = ((kpssData[ders] || {})[konu] || {}).sorular || [];
    return sorular.map(function (q, idx) {
        const id = q.id != null ? q.id : idx;
        return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
    });
}

function packFromKonu(kpssData, ders, konu, packIdx) {
    var packs = StudentStore.topicTestPacks(toItemsFromKonu(kpssData, ders, konu));
    if (!packs.length) return null;
    var i = packIdx == null ? 0 : packIdx;
    if (i < 0 || i >= packs.length) i = 0;
    return packs[i];
}

function App() {
    const student = useStudent();
    const isDark = !!(student.profile && student.profile.dark);
    const kpssData = (typeof window !== "undefined" && window.kpssData) ? window.kpssData : {};
    const plan = useMemo(function () {
        return StudyPlanner.buildPlan(kpssData, student);
    }, [kpssData, student]);

    const [extra, setExtra] = useState(null);
    const [LazyCmp, setLazyCmp] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [authSession, setAuthSession] = useState(null);
    const [GateAuth, setGateAuth] = useState(null);
    const [AdminCmp, setAdminCmp] = useState(null);
    const [lazyErr, setLazyErr] = useState("");
    const [roleChecked, setRoleChecked] = useState(false);
    const [announce, setAnnounce] = useState("");
    const [pwRecovery, setPwRecovery] = useState(function () {
        return !!(window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending());
    });
    const [OnboardCmp, setOnboardCmp] = useState(null);
    const [profileHydrated, setProfileHydrated] = useState(false);
    const signingOutRef = useRef(false);

    function doSignOut() {
        signingOutRef.current = true;
        setAuthSession(null);
        setPwRecovery(false);
        setProfileHydrated(false);
        setRoleChecked(false);
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        var finish = function () {
            if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
        };
        if (sb && sb.auth && sb.auth.signOut) sb.auth.signOut().then(finish).catch(finish);
        else finish();
    }

    const LAZY = {
        onboarding: ["OnboardingScreen", "js/components/OnboardingScreen.jsx"],
        auth: ["AuthScreen", "js/components/AuthScreen.jsx"],
        leaderboard: ["LeaderboardScreen", "js/components/LeaderboardScreen.jsx"],
        exam: ["ExamSimulator", "js/components/ExamSimulator.jsx"],
        admin: ["AdminDashboard", "js/components/AdminDashboard.jsx"],
        placement: ["PlacementScreen", "js/components/PlacementScreen.jsx"],
        ai: ["AiAssistant", "js/components/AiAssistant.jsx"],
        live: ["LiveExamScreen", "js/components/LiveExamScreen.jsx"],
        heat: ["Heatmap30", "js/components/Heatmap30.jsx"],
        instructor: ["InstructorScreen", "js/components/InstructorScreen.jsx"],
        paywall: ["PaywallScreen", "js/components/PaywallScreen.jsx"]
    };

    useEffect(function () {
        if ((student.profile && student.profile.onboarded) || !window.JsxLoader) return;
        window.JsxLoader.load("OnboardingScreen", "js/components/OnboardingScreen.jsx").then(function (C) {
            if (C) setOnboardCmp(function () { return C; });
        }).catch(function () {});
    }, [student.profile && student.profile.onboarded]);

    useEffect(function () {
        if (!extra || extra === "onboarding") return;
        if (extra === "paywall" && !(window.KpssConfig && window.KpssConfig.premiumEnabled)) {
            setExtra(null);
            return;
        }
        var spec = LAZY[extra];
        if (!spec || !window.JsxLoader) {
            setLazyErr("Bu araç bulunamadı.");
            return;
        }
        setLazyCmp(null);
        setLazyErr("");
        window.JsxLoader.load(spec[0], spec[1]).then(function (C) {
            if (C) setLazyCmp(function () { return C; });
            else setLazyErr("Araç yüklenemedi.");
        }).catch(function (e) {
            setLazyErr((e && e.message) || "Araç yüklenemedi.");
        });
    }, [extra]);

    useEffect(function () {
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        if (!sb) { setAuthReady(true); return; }
        sb.auth.getSession().then(function (r) {
            var sess = r.data && r.data.session;
            var recovering = !!(window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending());
            if (recovering) {
                if (window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                setPwRecovery(true);
            }
            setAuthSession(sess || null);
            setAuthReady(true);
            if (sess && !recovering) {
                if (window.StudentStore && window.StudentStore.bindToUser) {
                    window.StudentStore.bindToUser(sess.user.id, sess.user.email);
                }
                if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                    window.StudentStore.consumeSignupIfNeeded(sess.user);
                }
                var st0 = window.StudentStore && window.StudentStore.getState && window.StudentStore.getState();
                if (st0 && st0.profile && st0.profile.onboarded) setProfileHydrated(true);
                var done0 = function () { setProfileHydrated(true); };
                if (window.SyncEngine && window.SyncEngine.ensureLocation) window.SyncEngine.ensureLocation();
                if (window.SyncEngine && window.SyncEngine.sync) window.SyncEngine.sync().then(done0).catch(done0);
                else done0();
            }
        }).catch(function () { setAuthReady(true); });
        var sub = sb.auth.onAuthStateChange(function (event, sess) {
            setAuthReady(true);
            if (event === "PASSWORD_RECOVERY") {
                if (window.SupabaseClient && window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                setPwRecovery(true);
                if (sess) setAuthSession(sess);
                return;
            }
            if (event === "SIGNED_OUT") {
                signingOutRef.current = true;
                setAuthSession(null);
                setPwRecovery(false);
                setProfileHydrated(false);
                setRoleChecked(false);
                if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
                return;
            }
            if (!sess) return;
            signingOutRef.current = false;
            if (window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending()) {
                if (window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                setPwRecovery(true);
                setAuthSession(sess);
                return;
            }
            setAuthSession(sess);
            if (window.StudentStore && window.StudentStore.bindToUser) {
                window.StudentStore.bindToUser(sess.user.id, sess.user.email);
            }
            if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                window.StudentStore.consumeSignupIfNeeded(sess.user);
            }
            var st1 = window.StudentStore && window.StudentStore.getState && window.StudentStore.getState();
            if (st1 && st1.profile && st1.profile.onboarded) setProfileHydrated(true);
            var done1 = function () { setProfileHydrated(true); };
            if (window.SyncEngine && window.SyncEngine.ensureLocation) window.SyncEngine.ensureLocation();
            if (window.SyncEngine && window.SyncEngine.sync) window.SyncEngine.sync().then(done1).catch(done1);
            else done1();
        });
        return function () {
            if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
        };
    }, []);

    useEffect(function () {
        if (!authSession) signingOutRef.current = false;
    }, [authSession]);

    useEffect(function () {
        if (authReady && (!authSession || pwRecovery) && window.JsxLoader) {
            window.JsxLoader.load("AuthScreen", "js/components/AuthScreen.jsx").then(function (C) {
                if (C) setGateAuth(function () { return C; });
            });
        }
    }, [authReady, authSession, pwRecovery]);

    useEffect(function () {
        if (!authSession) {
            setRoleChecked(false);
            setAdminCmp(null);
            return;
        }
        setRoleChecked(false);
        var uid = authSession.user.id;
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        var localAdmin = !!(StudentStore.getState().userProfile && StudentStore.getState().userProfile.role === "admin");
        var settled = false;
        function finish(isAdm) {
            if (settled) return;
            settled = true;
            if (isAdm) StudentStore.updateUserProfile({ role: "admin" });
            if (isAdm && window.JsxLoader) {
                window.JsxLoader.load("AdminDashboard", "js/components/AdminDashboard.jsx").then(function (C) {
                    if (C) setAdminCmp(function () { return C; });
                    setRoleChecked(true);
                }).catch(function (e) {
                    console.warn(e);
                    setRoleChecked(true);
                });
            } else {
                setRoleChecked(true);
            }
        }
        if (!sb) { finish(localAdmin); return; }
        var timed = setTimeout(function () { finish(localAdmin); }, 8000);
        sb.from("student_states").select("role").eq("user_id", uid).maybeSingle().then(function (r) {
            clearTimeout(timed);
            finish(!!(r.data && r.data.role === "admin") || localAdmin);
        }).catch(function () {
            clearTimeout(timed);
            finish(localAdmin);
        });
        return function () { clearTimeout(timed); };
    }, [authSession]);

    useEffect(function () {
        if (!authSession) { setAnnounce(""); return; }
        function pickBanner(rows) {
            var now = Date.now();
            var i;
            for (i = 0; i < (rows || []).length; i++) {
                var raw = String((rows[i] && rows[i].body) || "");
                var exp = rows[i] && rows[i].expires_at;
                var m = raw.match(/^<!--kpss-exp:([^>]+)-->/);
                if (m) {
                    exp = m[1];
                    raw = raw.slice(m[0].length);
                }
                if (exp) {
                    var ts = new Date(exp).getTime();
                    if (!isFinite(ts) || ts <= now) continue;
                }
                if (raw.trim()) return raw.trim();
            }
            return "";
        }
        function loadBanner() {
            var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
            if (!sb) return;
            function apply(r) {
                if (r.error) return;
                setAnnounce(pickBanner(r.data));
            }
            sb.from("app_announcements").select("body,created_at,expires_at").eq("published", true).order("created_at", { ascending: false }).limit(20)
                .then(function (r) {
                    if (r.error && /expires_at/i.test(r.error.message || "")) {
                        return sb.from("app_announcements").select("body,created_at").eq("published", true).order("created_at", { ascending: false }).limit(20).then(apply);
                    }
                    apply(r);
                });
        }
        loadBanner();
        var t = setInterval(loadBanner, 60000);
        return function () { clearInterval(t); };
    }, [authSession]);

    const [nav, setNav] = useState("bugun");
    const [selectedDers, setSelectedDers] = useState(null);
    const [selectedKonu, setSelectedKonu] = useState(null);
    const [drillKind, setDrillKind] = useState(null);
    const [drillMapTopic, setDrillMapTopic] = useState(null);
    const [drillDers, setDrillDers] = useState(null);
    const [drillKonu, setDrillKonu] = useState(null);
    const [drillSeed, setDrillSeed] = useState(0);
    const [viewMode, setViewMode] = useState("hub");
    const [noteIndex, setNoteIndex] = useState(0);
    const [session, setSession] = useState(null);
    const [qIndex, setQIndex] = useState(0);
    const [picked, setPicked] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongList, setWrongList] = useState([]);
    const [finished, setFinished] = useState(false);
    const [answerLog, setAnswerLog] = useState([]);
    const startedAt = useRef(null);
    const scoreRef = useRef(0);
    const finishedRef = useRef(false);
    const sessionRef = useRef(null);

    useEffect(function () {
        if (isDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [isDark]);

    useEffect(function () {
        sessionRef.current = session;
    }, [session]);

    useEffect(function () {
        if (!session || finished || session.secondsLeft == null) return;
        if (session.secondsLeft <= 0) {
            finishSession();
            return;
        }
        const t = setTimeout(function () {
            setSession(function (cur) {
                if (!cur || cur.secondsLeft == null) return cur;
                return Object.assign({}, cur, { secondsLeft: cur.secondsLeft - 1 });
            });
        }, 1000);
        return function () { clearTimeout(t); };
    }, [session, finished]);

    function toggleDark() { StudentStore.setDark(!isDark); }

    function resetTestUi() {
        scoreRef.current = 0;
        finishedRef.current = false;
        setQIndex(0); setPicked(null); setAnswered(false); setScore(0); setWrongList([]); setFinished(false); setAnswerLog([]);
    }

    function startSession(items, opts) {
        opts = opts || {};
        if (!items.length) { alert("Soru yok."); return; }
        if (opts.mode === "mixed") {
            var gate = StudentStore.consumeMixed ? StudentStore.consumeMixed() : { ok: true };
            if (!gate.ok) { alert(gate.reason); return; }
        }
        resetTestUi();
        startedAt.current = Date.now();
        const next = {
            items: items,
            mode: opts.mode || "topic",
            secondsLeft: opts.seconds || null,
            ders: opts.ders || null,
            konu: opts.konu || null,
            testNo: opts.testNo || null
        };
        sessionRef.current = next;
        setSession(next);
    }

    function finishSession() {
        if (finishedRef.current) return;
        finishedRef.current = true;
        const sess = sessionRef.current;
        if (!sess) {
            setFinished(true);
            return;
        }
        const elapsedMin = Math.max(0, Math.round((Date.now() - (startedAt.current || Date.now())) / 60000));
        if (sess.mode === "topic" && sess.ders && sess.konu) {
            StudentStore.recordTestResult(sess.ders, sess.konu, { correct: scoreRef.current, total: sess.items.length, minutes: elapsedMin });
        } else if (elapsedMin) {
            StudentStore.addSessionStats({ minutes: elapsedMin, seans: true, ders: sess.ders || null });
        }
        setFinished(true);
    }

    function handleAnswer(i) {
        if (answered || !session) return;
        const item = session.items[qIndex];
        const ok = i === item.q.correctAnswerIndex;
        setPicked(i); setAnswered(true);
        StudentStore.recordAnswer({ ders: item.ders, konu: item.konu, id: item.id, correct: ok });
        StudentStore.addSessionStats({ questions: 1, correct: ok ? 1 : 0 });
        setAnswerLog(function (l) { return l.concat([{ ders: item.ders, konu: item.konu, ok: ok }]); });
        if (ok) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
        }
        else setWrongList(function (w) {
            return w.concat([{ question: item.q.question, dogru: stripChoicePrefix(item.q.options[item.q.correctAnswerIndex]) }]);
        });
    }

    function nextQ() {
        if (qIndex + 1 < session.items.length) {
            setQIndex(qIndex + 1); setPicked(null); setAnswered(false);
        } else finishSession();
    }

    function closeStudy() {
        setSession(null); setFinished(false); resetTestUi();
        setViewMode("hub");
    }

    function openKonu(ders, konu) {
        setNav("dersler");
        setSelectedDers(ders);
        setSelectedKonu(konu);
        setViewMode("hub");
        setSession(null);
        setFinished(false);
        const tp = StudentStore.getTopic(ders, konu);
        setNoteIndex(tp.noteIndex || 0);
    }

    function onTask(task) {
        if (task.kind === "notes") {
            openKonu(task.ders, task.konu);
            const nLen = (((kpssData[task.ders] || {})[task.konu] || {}).notlar || []).length;
            const tp = StudentStore.getTopic(task.ders, task.konu);
            StudentStore.setNoteIndex(task.ders, task.konu, tp.noteIndex || 0, nLen);
            setViewMode("notlar");
        } else if (task.kind === "test") {
            var pack = packFromKonu(kpssData, task.ders, task.konu, 0);
            setNav("dersler"); setSelectedDers(task.ders); setSelectedKonu(task.konu); setViewMode("hub");
            if (pack) startSession(pack.items, { mode: "topic", ders: task.ders, konu: task.konu, testNo: pack.no });
        } else if (task.kind === "review") {
            startSession(plan.due.slice(0, 25), { mode: "review" });
        } else if (task.kind === "wrong") {
            startSession(plan.wrong.slice(0, 25), { mode: "wrong" });
        }
    }

    if (!kpssData || !Object.keys(kpssData).length) {
        return (
            <div className="brand-backdrop flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="font-medium text-lg" style={{ color: "rgba(245,235,199,0.9)" }}>Veriler yüklenemedi. Sayfayı yenileyin.</p>
            </div>
        );
    }

    const inTest = !!session;
    const inMapPlay = nav === "alistirmalar" && drillKind === "map" && !!drillMapTopic;
    const konuData = (selectedDers && selectedKonu && kpssData[selectedDers]) ? (kpssData[selectedDers][selectedKonu] || {}) : {};

    let body = null;
    if (inTest && finished) {
        body = (
            <ResultView
                session={session} score={score} wrongList={wrongList} student={student}
                breakdown={StudyPlanner.breakdownByTopic(answerLog)}
                onRetry={function () { startSession(session.items, { mode: session.mode, ders: session.ders, konu: session.konu, seconds: null, testNo: session.testNo }); }}
                onHome={closeStudy}
            />
        );
    } else if (inTest) {
        body = (
            <TestView session={session} qIndex={qIndex} picked={picked} answered={answered} score={score}
                onAnswer={handleAnswer} onNext={nextQ}
                onQuit={function () { if (confirm("Testten çıkmak istediğinize emin misiniz? Cevapladıkların kayıtlı kalır.")) { closeStudy(); } }} />
        );
    } else if (nav === "bugun") {
        body = <Bugun student={student} plan={plan} kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
            onDers={function (d) { setNav("dersler"); setSelectedDers(d); setSelectedKonu(null); }} />;
    } else if (nav === "eksikler") {
        body = <Eksikler plan={plan} isDark={isDark} toggleDark={toggleDark}
            onReview={function () { startSession(plan.due.slice(0, 30), { mode: "review" }); }}
            onWrong={function () { startSession(plan.wrong.slice(0, 30), { mode: "wrong" }); }} />;
    } else if (nav === "deneme") {
        body = <DenemeSetup kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
            onStart={function (items, seconds) { startSession(items, { mode: "mixed", seconds: seconds || null }); }}
            onFullExam={function () { setExtra("exam"); }} />;
    } else if (nav === "ben") {
        body = <Ben student={student} isDark={isDark} toggleDark={toggleDark}
            onOpen={function (id) { setExtra(id); }}
            onAdmin={function () { setExtra("admin"); }}
            onSignOut={doSignOut} />;
    } else if (nav === "alistirmalar") {
        var drillData = (drillDers && drillKonu && kpssData[drillDers]) ? (kpssData[drillDers][drillKonu] || {}) : {};
        if (!drillKind) {
            body = <AlistirmalarHome isDark={isDark} toggleDark={toggleDark}
                onKind={function (k) { setDrillKind(k); setDrillDers(null); setDrillKonu(null); setDrillSeed(Date.now()); }} />;
        } else if (drillKind === "map") {
            if (!drillMapTopic) {
                body = <MapTopics isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillKind(null); }}
                    onTopic={function (id) { setDrillMapTopic(id); setDrillSeed(Date.now()); }} />;
            } else {
                body = <MapPlay topicId={drillMapTopic} seed={drillSeed} isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillMapTopic(null); }}
                    onAgain={function () { setDrillSeed(Date.now()); }} />;
            }
        } else if (!drillDers) {
            body = <AlistirmaDersList kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
                onBack={function () { setDrillKind(null); }}
                onDers={function (d) { setDrillDers(d); setDrillKonu(null); }} />;
        } else {
            var clozeKeys = Object.keys(kpssData[drillDers] || {});
            var canPlayCloze = drillKonu && StudentStore.isKonuOpen(drillDers, clozeKeys, clozeKeys.indexOf(drillKonu), kpssData);
            if (!canPlayCloze) {
                body = <AlistirmaKonuList kpssData={kpssData} student={student} ders={drillDers} isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillDers(null); }}
                    onKonu={function (k) {
                        if (!StudentStore.isKonuOpen(drillDers, clozeKeys, clozeKeys.indexOf(k), kpssData)) return;
                        setDrillKonu(k); setDrillSeed(Date.now());
                    }} />;
            } else {
                body = <ClozePlay ders={drillDers} konu={drillKonu} konuData={drillData} seed={drillSeed}
                    isDark={isDark} toggleDark={toggleDark}
                    onBack={function () { setDrillKonu(null); }}
                    onAgain={function () { setDrillSeed(Date.now()); }} />;
            }
        }
    } else if (!selectedDers) {
        body = <DersHome kpssData={kpssData} student={student} plan={plan} isDark={isDark} toggleDark={toggleDark} onDers={function (d) { setSelectedDers(d); setSelectedKonu(null); }} />;
    } else if (!selectedKonu) {
        body = <KonuList kpssData={kpssData} student={student} ders={selectedDers} isDark={isDark} toggleDark={toggleDark}
            onBack={function () { setSelectedDers(null); }} onKonu={function (k) {
                setSelectedKonu(k); setViewMode("hub");
                const tp = StudentStore.getTopic(selectedDers, k);
                setNoteIndex(tp.noteIndex || 0);
            }} />;
    } else if (viewMode === "notlar") {
        body = (
            <NotesView notlar={konuData.notlar || []} index={noteIndex} ders={selectedDers} konu={selectedKonu} isDark={isDark} toggleDark={toggleDark}
                hasTest={(konuData.sorular || []).length > 0}
                onBack={function () { setViewMode("hub"); }}
                onIndex={function (i) {
                    setNoteIndex(i);
                    StudentStore.setNoteIndex(selectedDers, selectedKonu, i, (konuData.notlar || []).length);
                }}
                onTest={function () {
                    StudentStore.markNotesComplete(selectedDers, selectedKonu);
                    var pack = packFromKonu(kpssData, selectedDers, selectedKonu, 0);
                    if (pack) startSession(pack.items, { mode: "topic", ders: selectedDers, konu: selectedKonu, testNo: pack.no });
                }} />
        );
    } else {
        body = (
            <KonuHub ders={selectedDers} konu={selectedKonu} konuData={konuData} isDark={isDark} toggleDark={toggleDark}
                onBack={function () { setSelectedKonu(null); }}
                onNotes={function () {
                    const nLen = (konuData.notlar || []).length;
                    StudentStore.setNoteIndex(selectedDers, selectedKonu, noteIndex, nLen);
                    setViewMode("notlar");
                }}
                onTest={function (packIdx) {
                    var pack = packFromKonu(kpssData, selectedDers, selectedKonu, packIdx);
                    if (!pack) { alert("Bu konuya ait henüz soru yüklenmedi!"); return; }
                    startSession(pack.items, { mode: "topic", ders: selectedDers, konu: selectedKonu, testNo: pack.no });
                }} />
        );
    }

    if (!authReady) {
        return <BrandLoad />;
    }
    var AuthCmp = GateAuth || (window.KpssComponents && window.KpssComponents.AuthScreen);
    if (!authSession || pwRecovery || signingOutRef.current) {
        return AuthCmp
            ? React.createElement(AuthCmp, {
                gate: true,
                recovery: pwRecovery,
                onPasswordUpdated: function () {
                    if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                    setPwRecovery(false);
                    if (window.SyncEngine) window.SyncEngine.sync();
                },
                onRecoveryFailed: function () {
                    if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                    setPwRecovery(false);
                },
                onDone: function () { if (window.SyncEngine) window.SyncEngine.sync(); }
            })
            : <BrandLoad />;
    }
    if (!roleChecked) {
        return <BrandLoad />;
    }
    var isAdminUser = student.userProfile && student.userProfile.role === "admin";
    if (student.userProfile && student.userProfile.blocked) {
        return (
            <div className="brand-backdrop min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
                <div className="relative z-10 text-center max-w-sm bg-white/95 rounded-[28px] p-6 shadow-xl">
                    <h1 className="text-xl font-semibold mb-2 text-stone-900">Hesap kısıtlı</h1>
                    <p className="text-sm text-zinc-500 mb-6">Bu hesap yönetici tarafından durduruldu.</p>
                    <button onClick={doSignOut} className="px-4 py-2 rounded-xl border font-medium">Çıkış</button>
                </div>
            </div>
        );
    }
    if (isAdminUser) {
        var Adm = AdminCmp || (window.KpssComponents && window.KpssComponents.AdminDashboard);
        return Adm
            ? React.createElement(Adm, { student: student, onSignOut: doSignOut })
            : (
                <div className="brand-backdrop min-h-screen flex items-center justify-center p-8">
                    <div className="text-center max-w-sm bg-white/95 rounded-[28px] p-6 shadow-xl">
                        <p className="text-sm text-zinc-500 mb-4">Yönetim paneli yüklenemedi. Sayfayı yenile.</p>
                        <button onClick={function () { window.location.reload(); }} className="px-4 py-2 rounded-xl border font-medium">Yenile</button>
                        <button onClick={doSignOut} className="mt-3 block w-full px-4 py-2 rounded-xl font-medium">Çıkış</button>
                    </div>
                </div>
            );
    }

    if (!profileHydrated) {
        return <BrandLoad />;
    }
    var sessUid = authSession.user && authSession.user.id;
    var boundUid = student.userProfile && student.userProfile.authUserId;
    if (sessUid && boundUid && sessUid !== boundUid) {
        return <BrandLoad />;
    }
    if (!boundUid) {
        return <BrandLoad />;
    }
    if (!student.profile || !student.profile.onboarded) {
        var Ob = OnboardCmp || (window.KpssComponents && window.KpssComponents.OnboardingScreen) || Onboarding;
        return React.createElement(Ob, { student: student, isDark: isDark, toggleDark: function () { StudentStore.setDark(!isDark); } });
    }

    function closeTool() {
        setExtra(null);
        setLazyCmp(null);
        setLazyErr("");
    }

    var toolProps = {
        student: student,
        plan: plan,
        kpssData: kpssData,
        onBack: closeTool,
        onClose: closeTool,
        onDone: function () { closeTool(); if (window.SyncEngine) window.SyncEngine.sync(); },
        onOpen: function (id) { setLazyCmp(null); setLazyErr(""); setExtra(id); },
        onStartExam: function () { setLazyCmp(null); setLazyErr(""); setExtra("exam"); }
    };

    if (extra && extra !== "onboarding" && extra !== "auth") {
        return (
            <div className="min-h-screen app-shell">
                <div className="mx-auto max-w-3xl px-4 pt-5" style={{ paddingBottom: "2rem" }}>
                    <div className="mb-3"><BackBtn onClick={closeTool} label="Geri" /></div>
                    {lazyErr ? (
                        <div className="p-4 rounded-2xl panel text-sm">
                            <p className="text-coral-600 mb-3">{lazyErr}</p>
                            <button type="button" onClick={function () {
                                var spec = LAZY[extra];
                                setLazyErr("");
                                if (spec && window.JsxLoader) {
                                    window.JsxLoader.load(spec[0], spec[1]).then(function (C) {
                                        if (C) setLazyCmp(function () { return C; });
                                    }).catch(function (e) { setLazyErr((e && e.message) || "Yüklenemedi"); });
                                }
                            }} className="px-4 py-2 rounded-xl btn-primary text-white text-sm">Tekrar dene</button>
                        </div>
                    ) : (LazyCmp ? React.createElement(LazyCmp, toolProps) : (
                        <div className="p-10 text-center text-zinc-500 text-sm">Yükleniyor…</div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell">
            {announce && !inTest && !inMapPlay ? (
                <div className="sticky top-0 z-50 duyuru-bar text-white shadow-lg" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
                    <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-start gap-3">
                        <span className="duyuru-badge shrink-0 mt-0.5 text-[10px] font-black uppercase tracking-widest bg-white text-indigo-700 px-2 py-1 rounded-md">Duyuru</span>
                        <p className="text-sm font-semibold leading-snug flex-1">{announce}</p>
                    </div>
                </div>
            ) : null}
            {body}
            {!inTest && !inMapPlay ? (
                <BottomNav nav={nav} streak={plan.streak || 0} onChange={function (id) {
                    setNav(id);
                    if (id !== "dersler") { setSelectedDers(null); setSelectedKonu(null); setViewMode("hub"); }
                    if (id === "dersler") { setSelectedDers(null); setSelectedKonu(null); }
                    if (id !== "alistirmalar") { setDrillKind(null); setDrillMapTopic(null); setDrillDers(null); setDrillKonu(null); }
                    if (id === "alistirmalar") { setDrillKind(null); setDrillMapTopic(null); setDrillDers(null); setDrillKonu(null); }
                }} />
            ) : null}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);