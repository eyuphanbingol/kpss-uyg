const { useState, useEffect, useMemo, useRef } = React;

const DERS_THEME = {
    "Tarih": { grad: "from-violet-500 to-fuchsia-900", text: "text-violet-700", soft: "bg-violet-50", icon: "🏛️", darkText: "text-violet-400", darkSoft: "bg-violet-950" },
    "Coğrafya": { grad: "from-emerald-400 to-cyan-900", text: "text-emerald-700", soft: "bg-emerald-50", icon: "🗺️", darkText: "text-emerald-400", darkSoft: "bg-emerald-950" },
    "Türkçe": { grad: "from-rose-400 to-pink-900", text: "text-rose-700", soft: "bg-rose-50", icon: "✍️", darkText: "text-rose-400", darkSoft: "bg-rose-950" },
    "Vatandaşlık": { grad: "from-sky-400 to-blue-900", text: "text-sky-700", soft: "bg-sky-50", icon: "⚖️", darkText: "text-sky-400", darkSoft: "bg-sky-950" },
    "Güncel Bilgiler": { grad: "from-amber-400 to-orange-900", text: "text-amber-700", soft: "bg-amber-50", icon: "📰", darkText: "text-amber-400", darkSoft: "bg-amber-950" }
};

function themeFor(ders, isDark) {
    const t = DERS_THEME[ders] || { grad: "from-slate-500 to-slate-700", text: "text-slate-700", soft: "bg-slate-50", icon: "📚", darkText: "text-slate-400", darkSoft: "bg-slate-950" };
    return isDark ? Object.assign({}, t, { text: t.darkText, soft: t.darkSoft }) : t;
}

function masteryLabel(m) {
    if (m === "iyi") return { text: "İyi", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" };
    if (m === "orta") return { text: "Orta", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" };
    if (m === "zayif") return { text: "Zayıf", cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" };
    return { text: "Yeni", cls: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300" };
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
        <div className={"mx-auto px-4 py-6 sm:py-8 " + (props.wide ? "max-w-3xl" : "max-w-2xl") + (props.padBottom === false ? "" : " pb-32")}>
            {props.children}
        </div>
    );
}

function ThemeBtn(props) {
    return (
        <button onClick={props.onClick}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500"
            aria-label="Tema">
            {props.isDark ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
            ) : (
                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
        </button>
    );
}

function Confetti() {
    const [pieces, setPieces] = useState([]);
    useEffect(function () {
        const colors = ["#6366f1", "#8b5cf6", "#d946ef", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
        setPieces(Array.from({ length: 50 }, function (_, i) {
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
        { id: "eksikler", label: "Eksikler", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { id: "deneme", label: "Deneme", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
        { id: "ben", label: "Ben", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
    ];
    return (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
            <div className="max-w-2xl mx-auto grid grid-cols-5 px-1 pt-1">
                {tabs.map(function (tab) {
                    const on = props.nav === tab.id;
                    return (
                        <button key={tab.id} onClick={function () { props.onChange(tab.id); }}
                            className={"flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-medium transition " + (on ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={on ? 2.2 : 1.7} d={tab.icon} /></svg>
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

function Onboarding(props) {
    const [name, setName] = useState(props.student.profile.name || "");
    const [examDate, setExamDate] = useState(props.student.profile.examDate || "2026-09-06");
    const [mins, setMins] = useState(props.student.profile.dailyMinutes || 45);
    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl fade-in">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Kişisel eğitim alanı</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Dershanedeki yerin hazır</h2>
                <p className="text-sm text-slate-500 mb-6">Hedefini söyle, her gün ne çalışacağını biz sıraya koyalım. Veriler bu cihazda kalır.</p>
                <label className="block text-xs font-bold text-slate-500 mb-1">Adın (isteğe bağlı)</label>
                <input value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Örn. Eyüp"
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium" />
                <label className="block text-xs font-bold text-slate-500 mb-1">Sınav tarihi</label>
                <input type="date" value={examDate} onChange={function (e) { setExamDate(e.target.value); }}
                    className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium" />
                <label className="block text-xs font-bold text-slate-500 mb-1">Günlük çalışma · {mins} dk</label>
                <input type="range" min="20" max="180" step="5" value={mins} onChange={function (e) { setMins(Number(e.target.value)); }} className="w-full mb-6" />
                <button onClick={function () {
                    const q = Math.max(10, Math.round(mins / 1.8));
                    StudentStore.completeOnboarding({ name: name, examDate: examDate, dailyMinutes: mins, dailyQuestions: q });
                }} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg">
                    Koçluğu başlat
                </button>
            </div>
        </div>
    );
}

function Bugun(props) {
    const plan = props.plan;
    const name = props.student.profile.name;
    const qPct = Math.min(100, Math.round(((plan.session.questions || 0) / (plan.qGoal || 1)) * 100));
    return (
        <Shell>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-sm text-zinc-500">Merhaba{name ? ", " + name : ""}</p>
                    <h1 className="text-2xl font-semibold tracking-tight mt-0.5">Bugün</h1>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="rounded-2xl panel p-3 text-center">
                    <div className="text-lg font-semibold">{plan.daysLeft == null ? "—" : plan.daysLeft}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">gün</div>
                </div>
                <div className="rounded-2xl panel p-3 text-center">
                    <div className="text-lg font-semibold">{plan.streak}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">seri</div>
                </div>
                <div className="rounded-2xl panel p-3 text-center">
                    <div className="text-lg font-semibold">{plan.session.questions || 0}/{plan.qGoal}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">soru</div>
                </div>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-zinc-900 dark:bg-white" style={{ width: qPct + "%" }} />
            </div>
            {plan.coach ? <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">{plan.coach}</p> : null}
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Sırada</p>
            <div className="space-y-2">
                {plan.tasks.length === 0 ? (
                    <div className="p-5 rounded-2xl panel text-sm text-zinc-500">Bugünlük bitti. Denemeden pratik açabilirsin.</div>
                ) : plan.tasks.slice(0, 3).map(function (task) {
                    return (
                        <button key={task.id} onClick={function () { props.onTask(task); }}
                            className="w-full text-left p-4 panel rounded-2xl">
                            <div className="flex justify-between items-center gap-3">
                                <div>
                                    <div className="font-medium">{task.title}</div>
                                    <div className="text-sm text-zinc-500 mt-0.5">{task.detail}</div>
                                </div>
                                <span className="text-zinc-400 text-sm shrink-0">Başla</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </Shell>
    );
}

function DersHome(props) {
    const kpssData = props.kpssData;
    const stats = StudyPlanner.catalogStats(kpssData);
    return (
        <Shell>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Dersler</h1>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="space-y-2">
                {Object.keys(kpssData).map(function (ders) {
                    const t = themeFor(ders, props.isDark);
                    const s = stats[ders] || { konuSayisi: 0, soruSayisi: 0 };
                    const rows = props.plan.rows.filter(function (r) { return r.ders === ders; });
                    const done = rows.filter(function (r) { return r.mastery === "iyi"; }).length;
                    return (
                        <button key={ders} onClick={function () { props.onDers(ders); }}
                            className="w-full text-left p-4 panel rounded-2xl flex items-center gap-4">
                            <div className={"h-11 w-11 rounded-xl bg-gradient-to-br " + t.grad + " flex items-center justify-center text-lg shrink-0"}>{t.icon}</div>
                            <div className="min-w-0 flex-1">
                                <h2 className="font-medium">{ders}</h2>
                                <p className="text-sm text-zinc-500">{s.konuSayisi} konu · {s.soruSayisi} soru{rows.length ? " · " + done + " iyi" : ""}</p>
                            </div>
                            <span className="text-zinc-300">›</span>
                        </button>
                    );
                })}
            </div>
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
                <button onClick={props.onBack} className="text-sm font-bold text-slate-500">← Dersler</button>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="flex items-center gap-4 mb-6">
                <div className={"h-14 w-14 rounded-2xl bg-gradient-to-br " + t.grad + " flex items-center justify-center text-white text-2xl shadow-lg"}>{t.icon}</div>
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
                            className={"w-full text-left p-5 panel rounded-2xl " + (open ? heat : "opacity-45")}>
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex gap-3 min-w-0">
                                    <div className={"h-10 w-10 rounded-xl bg-gradient-to-br " + t.grad + " flex items-center justify-center text-white font-bold text-sm shrink-0"}>{done ? "✓" : (open ? idx + 1 : "🔒")}</div>
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
    const tp = StudentStore.getTopic(props.ders, props.konu);
    const m = masteryLabel(tp.mastery);
    return (
        <Shell>
            <div className="flex justify-between mb-4">
                <button onClick={props.onBack} className="text-sm font-bold text-slate-500">← Konular</button>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h2 className="text-3xl font-black mb-2">{props.konu}</h2>
            <p className="text-slate-500 mb-2">{props.ders}</p>
            <div className="flex gap-2 mb-8">
                <span className={"text-xs font-bold px-3 py-1 rounded-full " + m.cls}>{m.text}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">Son net {tp.lastPct == null ? "yok" : "%" + tp.lastPct}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">{tp.attempts} deneme</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
                <button onClick={props.onNotes} className="group text-left p-7 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 border border-amber-200 rounded-3xl shadow-lg card-hover">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl mb-4">📖</div>
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Konu özeti</h3>
                    <p className="text-sm text-amber-700">{notlar.length} hap not · {tp.notesDone ? "tamamlandı" : "kaldığın yerden"}</p>
                </button>
                <button onClick={function () {
                    if (!sorular.length) { alert("Bu konuya ait henüz soru yüklenmedi!"); return; }
                    props.onTest();
                }} className="group text-left p-7 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 border border-indigo-200 rounded-3xl shadow-lg card-hover">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">Testi çöz</h3>
                    <p className="text-sm text-indigo-700">{sorular.length} soru · sonuç hakimiyeti günceller</p>
                </button>
            </div>
        </Shell>
    );
}

function NotesView(props) {
    const notlar = props.notlar || [];
    const idx = props.index;
    return (
        <Shell wide={true} padBottom={false}>
            <div className="flex justify-between items-center mb-4 gap-3">
                <button onClick={props.onBack} className="text-sm font-bold text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200">← Geri</button>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h2 className="text-2xl font-black mb-4">{props.konu} · Özet</h2>
            {notlar.length ? (
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 shadow-xl flex flex-col p-6 sm:p-10 min-h-[400px]">
                    <div className="flex justify-center mb-6">
                        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">{idx + 1}/{notlar.length}</div>
                    </div>
                    <div key={idx} className="flex-1 fade-in text-center mb-20">
                        <div className="text-slate-700 dark:text-slate-300 text-[17px] leading-relaxed max-w-2xl w-full mx-auto" dangerouslySetInnerHTML={{ __html: notlar[idx] }} />
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-center">
                        <button disabled={idx === 0} onClick={function () { props.onIndex(idx - 1); }}
                            className={"p-3 rounded-xl font-bold " + (idx === 0 ? "opacity-30" : "bg-indigo-50 text-indigo-600")}>Önceki</button>
                        {idx === notlar.length - 1 ? (
                            <button onClick={function () {
                                if (props.ders && props.konu) StudentStore.markNotesComplete(props.ders, props.konu);
                                if (props.hasTest) props.onTest();
                                else props.onBack();
                            }} className="p-3 rounded-xl font-bold bg-zinc-900 text-white">{props.hasTest ? "Teste geç" : "Konuyu bitir"}</button>
                        ) : (
                            <button onClick={function () { props.onIndex(idx + 1); }}
                                className="p-3 rounded-xl font-bold bg-indigo-50 text-indigo-600">Sonraki</button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed">Bu konu için henüz not yok.</div>
            )}
            {props.hasTest ? (
                <button onClick={props.onTest} className="mt-8 mb-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-2xl font-bold shadow-xl">
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
    return (
        <Shell padBottom={false}>
            <div className="flex justify-between items-center text-sm font-bold text-slate-500 mb-4">
                <button onClick={props.onQuit} className="hover:text-rose-500 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200">Bitir</button>
                <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200">
                    {qIndex + 1}/{items.length} · Doğru {props.score}
                    {timed ? <span className={"ml-2 " + (props.session.secondsLeft < 30 ? "text-rose-500" : "text-indigo-500")}>{mm}:{ss}</span> : null}
                </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" style={{ width: progress + "%" }} />
            </div>
            {item.ders ? <p className="text-xs font-bold text-slate-400 mb-3">{item.ders} · {item.konu}</p> : null}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                <h3 className="text-lg font-bold leading-relaxed whitespace-pre-line">{soru.question}</h3>
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
                        cls += "bg-white dark:bg-slate-800 border-slate-200 hover:border-indigo-400";
                        icon = <span className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + i)}</span>;
                    }
                    return (
                        <button key={i} onClick={function () { props.onAnswer(i); }} disabled={props.answered} className={cls}>
                            {icon}<span className="text-[15px]">{opt}</span>
                        </button>
                    );
                })}
            </div>
            {props.answered ? (
                <div className="mt-8 space-y-4 fade-in pb-10">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 border border-blue-200 border-l-4 border-l-blue-500 p-6 rounded-2xl">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">Çözüm notu</h4>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{soru.explanation}</p>
                    </div>
                    <button onClick={props.onNext} className="w-full bg-gradient-to-r from-slate-800 to-slate-900 dark:from-indigo-600 dark:to-purple-600 text-white p-5 rounded-2xl font-bold">
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
    const renk = oran >= 85 ? "#10b981" : oran >= 60 ? "#6366f1" : oran >= 40 ? "#f59e0b" : "#ef4444";
    return (
        <Shell>
            {oran >= 80 && <Confetti />}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 shadow-2xl text-center fade-in">
                <div className="text-5xl mb-3">{oran >= 85 ? "🎉" : oran >= 60 ? "👏" : "📚"}</div>
                <h2 className="text-3xl font-black mb-2">Tur bitti</h2>
                <p className="text-slate-500 mb-6">{yorum}</p>
                <div className="relative mx-auto w-36 h-36 mb-6">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke={renk} strokeWidth="3" strokeDasharray={oran + ", 100"} strokeLinecap="round" className="progress-ring" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black">%{oran}</span>
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
                            caption: "Net kartı · KPSS Eğitim Alanı"
                        });
                        window.ShareCard.download(url, "kpss-net-karti.png");
                    }} className="w-full mb-3 p-4 rounded-2xl border font-bold">Hikâye kartını indir</button>
                <div className="flex gap-3">
                    <button onClick={props.onRetry} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl font-bold">Tekrar</button>
                    <button onClick={props.onHome} className="flex-1 bg-slate-100 dark:bg-slate-700 p-4 rounded-2xl font-bold">Kapat</button>
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
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-black">Eksikler</h1>
                    <p className="text-slate-500 text-sm">Isı haritası, yanlış defteri, vadesi gelen tekrar</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={function () { props.onReview(); }} disabled={!plan.due.length}
                    className="p-4 rounded-2xl bg-indigo-600 text-white font-bold disabled:opacity-40">Tekrar · {plan.due.length}</button>
                <button onClick={function () { props.onWrong(); }} disabled={!plan.wrong.length}
                    className="p-4 rounded-2xl bg-rose-500 text-white font-bold disabled:opacity-40">Yanlış defteri · {plan.wrong.length}</button>
            </div>
            {Object.keys(byDers).map(function (ders) {
                const t = themeFor(ders, props.isDark);
                return (
                    <div key={ders} className="mb-6">
                        <h2 className={"font-black mb-2 " + t.text}>{t.icon} {ders}</h2>
                        <div className="space-y-1.5">
                            {byDers[ders].map(function (r) {
                                const heat = r.mastery === "zayif" ? "heat-zayif" : r.mastery === "orta" ? "heat-orta" : r.mastery === "iyi" ? "heat-iyi" : "";
                                const m = masteryLabel(r.mastery);
                                return (
                                    <button key={r.konu} onClick={function () { props.openKonu(r.ders, r.konu); }}
                                        className={"w-full flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 " + heat}>
                                        <span className="text-sm font-semibold text-left pr-2">{r.konu}</span>
                                        <span className="flex items-center gap-2 shrink-0">
                                            <span className="text-sm font-black">{r.lastPct == null ? "—" : "%" + r.lastPct}</span>
                                            <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + m.cls}>{m.text}</span>
                                        </span>
                                    </button>
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
    return (
        <Shell>
            <div className="flex justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Deneme</h1>
                    <p className="text-sm text-zinc-500">Karışık pratik.</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <h2 className="text-sm font-black text-slate-500 mb-2">Dersler</h2>
            <div className="flex flex-wrap gap-2 mb-6">
                {dersler.map(function (d) {
                    return (
                        <button key={d} onClick={function () { toggle(d); }}
                            className={"px-3 py-2 rounded-xl text-sm font-bold border " + (sel[d] ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-800 border-slate-200")}>{d}</button>
                    );
                })}
            </div>
            <label className="text-sm font-bold">Soru sayısı · {n}</label>
            <input type="range" min="5" max="50" step="5" value={n} onChange={function (e) { setN(Number(e.target.value)); }} className="w-full mb-4" />
            <label className="text-sm font-bold">Süre · {mins === 0 ? "kapalı" : mins + " dk"}</label>
            <input type="range" min="0" max="60" step="5" value={mins} onChange={function (e) { setMins(Number(e.target.value)); }} className="w-full mb-6" />
            <button onClick={function () {
                const items = StudyPlanner.mixedQuiz(props.kpssData, chosen, n);
                if (!items.length) { alert("Seçilen derslerde soru yok."); return; }
                props.onStart(items, mins * 60);
            }} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-2xl font-bold">Karışık testi başlat</button>
            {props.onFullExam ? (
                <button onClick={props.onFullExam} className="mt-3 w-full p-4 rounded-2xl border font-bold">Tam deneme (kitapçık)</button>
            ) : null}
        </Shell>
    );
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
    const field = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900";
    const isAdmin = up.role === "admin";
    return (
        <Shell>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
                    <p className="text-sm text-zinc-500 mt-1">{up.email || "Hesap bağlı"}</p>
                </div>
                <ThemeBtn isDark={props.isDark} onClick={props.toggleDark} />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="p-4 rounded-2xl panel"><div className="text-xl font-semibold">{totQ}</div><div className="text-xs text-zinc-400 mt-1">Soru</div></div>
                <div className="p-4 rounded-2xl panel"><div className="text-xl font-semibold">%{overall}</div><div className="text-xs text-zinc-400 mt-1">Net</div></div>
            </div>
            <div className="panel rounded-2xl p-4 mb-4 space-y-3">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Ayarlar</p>
                <label className="text-sm text-zinc-500">Ad</label>
                <input value={st.profile.name || ""} onChange={function (e) { StudentStore.updateProfile({ name: e.target.value }); StudentStore.updateUserProfile({ nickname: e.target.value }); }} className={field} />
                <label className="text-sm text-zinc-500">Eğitim</label>
                <select value={up.educationLevel || "lisans"} onChange={function (e) { StudentStore.updateUserProfile({ educationLevel: e.target.value }); }} className={field}>
                    <option value="lisans">Lisans</option>
                    <option value="onlisans">Ön lisans</option>
                    <option value="ortaogretim">Ortaöğretim</option>
                </select>
                <label className="text-sm text-zinc-500">Sınav tarihi</label>
                <input type="date" value={st.profile.examDate} onChange={function (e) { StudentStore.updateProfile({ examDate: e.target.value }); }} className={field} />
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-zinc-500">Günlük soru</label>
                        <input type="number" min="5" max="200" value={st.profile.dailyQuestions}
                            onChange={function (e) { StudentStore.updateProfile({ dailyQuestions: Number(e.target.value) || 25 }); }} className={field + " mt-1"} />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-500">Günlük dk</label>
                        <input type="number" min="10" max="300" value={st.profile.dailyMinutes}
                            onChange={function (e) { StudentStore.updateProfile({ dailyMinutes: Number(e.target.value) || 45 }); }} className={field + " mt-1"} />
                    </div>
                </div>
            </div>
            {isAdmin ? (
                <button onClick={function () { props.onAdmin && props.onAdmin(); }} className="w-full mb-3 p-3.5 rounded-2xl panel text-left font-medium">Yönetim</button>
            ) : null}
            <button onClick={function () { props.onSignOut && props.onSignOut(); }} className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 font-medium">Çıkış</button>
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

function App() {
    const student = useStudent();
    const isDark = !!student.profile.dark;
    const kpssData = (typeof window !== "undefined" && window.kpssData) ? window.kpssData : {};
    const plan = useMemo(function () {
        return StudyPlanner.buildPlan(kpssData, student);
    }, [kpssData, student]);

    const [extra, setExtra] = useState(null);
    const [LazyCmp, setLazyCmp] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [authSession, setAuthSession] = useState(null);
    const [GateAuth, setGateAuth] = useState(null);

    const LAZY = {
        onboarding: ["OnboardingScreen", "js/components/OnboardingScreen.jsx"],
        auth: ["AuthScreen", "js/components/AuthScreen.jsx"],
        leaderboard: ["LeaderboardScreen", "js/components/LeaderboardScreen.jsx"],
        exam: ["ExamSimulator", "js/components/ExamSimulator.jsx"],
        admin: ["AdminDashboard", "js/components/AdminDashboard.jsx"],
        placement: ["PlacementScreen", "js/components/PlacementScreen.jsx"],
        ai: ["AiAssistant", "js/components/AiAssistant.jsx"],
        live: ["LiveExamScreen", "js/components/LiveExamScreen.jsx"],
        heat: ["Heatmap30", "js/components/Heatmap30.jsx"]
    };

    useEffect(function () {
        if (!student.profile.onboarded && window.JsxLoader) {
            window.JsxLoader.load("OnboardingScreen", "js/components/OnboardingScreen.jsx");
        }
    }, [student.profile.onboarded]);

    useEffect(function () {
        if (!extra || extra === "onboarding") return;
        var spec = LAZY[extra];
        if (!spec || !window.JsxLoader) return;
        setLazyCmp(null);
        window.JsxLoader.load(spec[0], spec[1]).then(function (C) { if (C) setLazyCmp(function () { return C; }); });
    }, [extra]);

    useEffect(function () {
        var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
        if (!sb) { setAuthReady(true); return; }
        sb.auth.getSession().then(function (r) {
            var sess = r.data && r.data.session;
            setAuthSession(sess || null);
            setAuthReady(true);
            if (sess) {
                if (window.StudentStore && window.StudentStore.bindToUser) {
                    window.StudentStore.bindToUser(sess.user.id, sess.user.email);
                }
                if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                    window.StudentStore.consumeSignupIfNeeded(sess.user);
                }
                if (window.SyncEngine) window.SyncEngine.sync();
            }
        }).catch(function () { setAuthReady(true); });
        var sub = sb.auth.onAuthStateChange(function (event, sess) {
            setAuthReady(true);
            if (event === "SIGNED_OUT") {
                setAuthSession(null);
                if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
                return;
            }
            if (!sess) return;
            setAuthSession(sess);
            if (window.StudentStore && window.StudentStore.bindToUser) {
                window.StudentStore.bindToUser(sess.user.id, sess.user.email);
            }
            if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                window.StudentStore.consumeSignupIfNeeded(sess.user);
            }
            if (window.SyncEngine) window.SyncEngine.sync();
        });
        return function () {
            if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
        };
    }, []);

    useEffect(function () {
        if (authReady && !authSession && window.JsxLoader) {
            window.JsxLoader.load("AuthScreen", "js/components/AuthScreen.jsx").then(function (C) {
                if (C) setGateAuth(function () { return C; });
            });
        }
    }, [authReady, authSession]);
    const [nav, setNav] = useState("bugun");
    const [selectedDers, setSelectedDers] = useState(null);
    const [selectedKonu, setSelectedKonu] = useState(null);
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
        resetTestUi();
        startedAt.current = Date.now();
        const next = {
            items: items,
            mode: opts.mode || "topic",
            secondsLeft: opts.seconds || null,
            ders: opts.ders || null,
            konu: opts.konu || null
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
            StudentStore.addSessionStats({ minutes: elapsedMin });
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
            return w.concat([{ question: item.q.question, dogru: item.q.options[item.q.correctAnswerIndex] }]);
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
            const items = toItemsFromKonu(kpssData, task.ders, task.konu);
            setNav("dersler"); setSelectedDers(task.ders); setSelectedKonu(task.konu); setViewMode("hub");
            startSession(items, { mode: "topic", ders: task.ders, konu: task.konu });
        } else if (task.kind === "review") {
            startSession(plan.due.slice(0, 25), { mode: "review" });
        } else if (task.kind === "wrong") {
            startSession(plan.wrong.slice(0, 25), { mode: "wrong" });
        }
    }

    if (!kpssData || !Object.keys(kpssData).length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 gap-4">
                <p className="font-medium text-lg">Veriler yüklenemedi. Sayfayı yenileyin.</p>
            </div>
        );
    }

    const inTest = !!session;
    const konuData = (selectedDers && selectedKonu && kpssData[selectedDers]) ? (kpssData[selectedDers][selectedKonu] || {}) : {};

    let body = null;
    if (inTest && finished) {
        body = (
            <ResultView
                session={session} score={score} wrongList={wrongList} student={student}
                breakdown={StudyPlanner.breakdownByTopic(answerLog)}
                onRetry={function () { startSession(session.items, { mode: session.mode, ders: session.ders, konu: session.konu, seconds: null }); }}
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
        body = <Bugun student={student} plan={plan} isDark={isDark} toggleDark={toggleDark} onTask={onTask} openKonu={openKonu} />;
    } else if (nav === "eksikler") {
        body = <Eksikler plan={plan} isDark={isDark} toggleDark={toggleDark} openKonu={openKonu}
            onReview={function () { startSession(plan.due.slice(0, 30), { mode: "review" }); }}
            onWrong={function () { startSession(plan.wrong.slice(0, 30), { mode: "wrong" }); }} />;
    } else if (nav === "deneme") {
        body = <DenemeSetup kpssData={kpssData} isDark={isDark} toggleDark={toggleDark}
            onStart={function (items, seconds) { startSession(items, { mode: "mixed", seconds: seconds || null }); }}
            onFullExam={function () { setExtra("exam"); }} />;
    } else if (nav === "ben") {
        body = <Ben student={student} isDark={isDark} toggleDark={toggleDark}
            onAdmin={function () { setExtra("admin"); }}
            onSignOut={function () {
                var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
                if (sb) {
                    if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
                    sb.auth.signOut();
                }
            }} />;
    } else if (!selectedDers) {
        body = <DersHome kpssData={kpssData} plan={plan} isDark={isDark} toggleDark={toggleDark} onDers={function (d) { setSelectedDers(d); setSelectedKonu(null); }} />;
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
                    startSession(toItemsFromKonu(kpssData, selectedDers, selectedKonu), { mode: "topic", ders: selectedDers, konu: selectedKonu });
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
                onTest={function () { startSession(toItemsFromKonu(kpssData, selectedDers, selectedKonu), { mode: "topic", ders: selectedDers, konu: selectedKonu }); }} />
        );
    }

    if (!authReady) {
        return <div className="min-h-screen flex items-center justify-center text-sm text-zinc-400">Yükleniyor</div>;
    }
    var AuthCmp = GateAuth || (window.KpssComponents && window.KpssComponents.AuthScreen);
    if (!authSession) {
        return AuthCmp
            ? React.createElement(AuthCmp, { gate: true, onDone: function () { if (window.SyncEngine) window.SyncEngine.sync(); } })
            : <div className="min-h-screen flex items-center justify-center text-sm text-zinc-400">Yükleniyor</div>;
    }

    return (
        <div>
            {extra && extra !== "onboarding" && extra !== "auth" ? (
                <div className="fixed inset-0 z-[70] overlay-scrim overflow-y-auto">
                    <div className={"min-h-full mx-auto px-4 py-6 " + (extra === "admin" || extra === "exam" || extra === "leaderboard" ? "max-w-3xl" : "max-w-lg")} style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
                        <button type="button" onClick={function () { setExtra(null); setLazyCmp(null); }}
                            className="mb-4 px-4 py-2 rounded-xl panel text-sm font-medium">Kapat</button>
                        <div className="overlay-sheet">
                            {LazyCmp ? React.createElement(LazyCmp, {
                                student: student, plan: plan, kpssData: kpssData,
                                onBack: function () { setExtra(null); setLazyCmp(null); },
                                onClose: function () { setExtra(null); setLazyCmp(null); },
                                onDone: function () { setExtra(null); setLazyCmp(null); if (window.SyncEngine) window.SyncEngine.sync(); }
                            }) : <div className="p-10 text-center text-zinc-500">Yükleniyor…</div>}
                        </div>
                    </div>
                </div>
            ) : null}
            {body}
            {!inTest ? (
                <BottomNav nav={nav} onChange={function (id) {
                    setNav(id);
                    if (id !== "dersler") { setSelectedDers(null); setSelectedKonu(null); setViewMode("hub"); }
                    if (id === "dersler") { setSelectedDers(null); setSelectedKonu(null); }
                }} />
            ) : null}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
