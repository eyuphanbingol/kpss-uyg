(function () {
    const { useEffect, useMemo, useRef, useState } = React;

    function ExamSimulator(props) {
        const kpssData = props.kpssData;
        const student = props.student;
        const items = useMemo(function () {
            try {
                return StudyPlanner.mixedQuiz(kpssData, ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"], 40);
            } catch (e) { return []; }
        }, [kpssData]);
        const [i, setI] = useState(0);
        const [picks, setPicks] = useState({});
        const [changes, setChanges] = useState(0);
        const [started, setStarted] = useState(false);
        const [left, setLeft] = useState(40 * 60);
        const [done, setDone] = useState(false);
        const [optic, setOptic] = useState(true);
        const [leaves, setLeaves] = useState(0);
        const finishedRef = useRef(false);
        const warn = student.profile.tabLeaveWarn !== false;

        useEffect(function () {
            if (!started || done) return;
            if (left <= 0) { finish(); return; }
            var t = setTimeout(function () { setLeft(left - 1); }, 1000);
            return function () { clearTimeout(t); };
        }, [started, done, left]);

        useEffect(function () {
            if (!started || !warn || done) return;
            function onVis() {
                if (document.hidden) setLeaves(function (n) { return n + 1; });
            }
            document.addEventListener("visibilitychange", onVis);
            return function () { document.removeEventListener("visibilitychange", onVis); };
        }, [started, warn, done]);

        function pick(idx) {
            if (picks[i] != null && picks[i] !== idx) setChanges(changes + 1);
            var n = Object.assign({}, picks);
            n[i] = idx;
            setPicks(n);
        }

        function finish() {
            if (finishedRef.current) return;
            finishedRef.current = true;
            setDone(true);
            var correct = 0;
            items.forEach(function (it, idx) {
                var ok = picks[idx] === it.q.correctAnswerIndex;
                if (ok) correct += 1;
                StudentStore.recordAnswer({ ders: it.ders, konu: it.konu, id: it.id, correct: !!ok });
            });
            StudentStore.addSessionStats({ questions: items.length, correct: correct });
            StudentStore.recordExamAttempt({ total: items.length, correct: correct, changes: changes, secondsUsed: 40 * 60 - left });
            var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
            var nick = (student.userProfile && student.userProfile.nickname) || "ogrenci";
            if (sb && student.userProfile && student.userProfile.authUserId) {
                sb.from("exam_ranks").insert({
                    user_id: student.userProfile.authUserId,
                    nickname: nick,
                    score: correct
                }).then(function () {});
            }
        }

        if (!items.length) {
            return <div className="p-6">Soru yok. <button onClick={props.onBack} className="font-medium">Geri</button></div>;
        }

        if (!started) {
            var premium = StudentStore.isPremium();
            var weekExams = (student.examAttempts || []).filter(function (a) {
                return a.at && a.at.slice(0, 10) >= (window.SyncEngine && window.SyncEngine.weekStart ? window.SyncEngine.weekStart() : "2000-01-01");
            }).length;
            var capped = !premium && weekExams >= ((window.KpssConfig && window.KpssConfig.freeWeeklyExams) || 2);
            return (
                <div className="max-w-2xl mx-auto px-4 py-8 pb-10">
                    <button onClick={props.onBack} className="text-sm font-medium mb-4">← Geri</button>
                    <h1 className="text-2xl font-display font-bold mb-2">Tam deneme</h1>
                    <p className="text-zinc-500 mb-4 text-sm">40 soru · 40 dk kitapçık. Optik kâğıt masaüstünde yanında, telefonda altta.</p>
                    {capped ? <p className="p-3 rounded-xl bg-amber-50 text-amber-600 text-sm mb-4">Ücretsiz haftalık deneme doldu.</p> : null}
                    <label className="flex gap-2 text-sm mb-4"><input type="checkbox" checked={optic} onChange={function (e) { setOptic(e.target.checked); }} /> Optik kâğıt</label>
                    <button disabled={capped} onClick={function () { setStarted(true); }} className="w-full p-4 rounded-2xl bg-navy-600 text-white font-semibold">Başlat</button>
                </div>
            );
        }

        if (done) {
            var correct = 0;
            var by = {};
            items.forEach(function (it, idx) {
                var ok = picks[idx] === it.q.correctAnswerIndex;
                if (ok) correct += 1;
                if (!by[it.ders]) by[it.ders] = { c: 0, t: 0 };
                by[it.ders].t += 1; if (ok) by[it.ders].c += 1;
            });
            var used = 40 * 60 - left;
            var avg = items.length ? Math.round(used / items.length) : 0;
            var keys = Object.keys(by);
            return (
                <div className="max-w-2xl mx-auto px-4 py-8 pb-10">
                    <h1 className="text-2xl font-display font-bold mb-1">Deneme bitti</h1>
                    <p className="font-stat text-4xl text-navy-600 dark:text-navy-400 mb-4">{correct}/{items.length}</p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="panel rounded-xl p-3"><p className="text-xs text-zinc-400">Soru başı</p><p className="font-stat text-lg">{avg} sn</p></div>
                        <div className="panel rounded-xl p-3"><p className="text-xs text-zinc-400">Cevap değişimi</p><p className="font-stat text-lg">{changes}</p></div>
                    </div>
                    {keys.map(function (d) {
                        var pct = Math.round(by[d].c / by[d].t * 100);
                        return (
                            <div key={d} className="mb-2">
                                <div className="flex justify-between text-sm mb-1"><span>{d}</span><span className="font-stat">{by[d].c}/{by[d].t}</span></div>
                                <div className="h-1.5 bg-zinc-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: pct + "%" }} />
                                </div>
                            </div>
                        );
                    })}
                    <button onClick={props.onBack} className="mt-6 w-full p-4 rounded-2xl bg-navy-600 text-white font-semibold">Kapat</button>
                </div>
            );
        }

        var it = items[i];
        var mm = Math.floor(left / 60);
        var ss = String(left % 60).padStart(2, "0");
        var tCls = left <= 60 ? "text-coral-500" : left <= 300 ? "text-amber-500" : "text-stone-900 dark:text-stone-50";
        var opticGrid = optic ? (
            <div className="flex flex-wrap gap-1 p-3 panel rounded-xl">
                {items.map(function (_, idx) {
                    return (
                        <button key={idx} onClick={function () { setI(idx); }}
                            className={"h-8 w-8 text-xs rounded-sm font-stat " + (i === idx ? "bg-navy-600 text-white" : (picks[idx] != null ? "bg-navy-600/15" : "bg-zinc-100 dark:bg-slate-800"))}>{idx + 1}</button>
                    );
                })}
            </div>
        ) : null;

        return (
            <div className="max-w-5xl mx-auto px-3 py-4 pb-10">
                {leaves > 0 ? <div className="exam-banner rounded-lg mb-3">Sınav dışına çıktın · {leaves}. uyarı</div> : null}
                <div className="flex justify-between items-center text-sm mb-3">
                    <span>Soru {i + 1}/{items.length}</span>
                    <span className={"font-stat text-lg " + tCls}>{mm}:{ss}</span>
                    <button onClick={finish} className="text-coral-500 text-sm font-medium">Bitir</button>
                </div>
                <div className="md:grid md:grid-cols-[1fr_220px] md:gap-4">
                    <div className="booklet p-5 mb-4 md:mb-0 rounded-sm">
                        <p className="text-xs text-zinc-400 mb-2">{it.ders} · {it.konu}</p>
                        <p className="font-medium whitespace-pre-line mb-4 leading-relaxed">{it.q.question}</p>
                        {(it.q.options || []).map(function (opt, idx) {
                            var on = picks[i] === idx;
                            return (
                                <button key={idx} onClick={function () { pick(idx); }}
                                    className={"w-full text-left p-3 mb-2 rounded-lg border " + (on ? "border-navy-600 bg-navy-600 text-white" : "border-stone-300 dark:border-stone-700")}>{opt}</button>
                            );
                        })}
                    </div>
                    <div className="hidden md:block">{opticGrid}</div>
                </div>
                <div className="md:hidden mt-3">{opticGrid}</div>
                <div className="flex gap-2 mt-4">
                    <button disabled={i === 0} onClick={function () { setI(i - 1); }} className="flex-1 p-3 rounded-xl border font-medium">Önceki</button>
                    <button disabled={i === items.length - 1} onClick={function () { setI(i + 1); }} className="flex-1 p-3 rounded-xl bg-navy-600 text-white font-medium">Sonraki</button>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.ExamSimulator = ExamSimulator;
})();
