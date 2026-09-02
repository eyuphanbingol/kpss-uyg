(function () {
    const { useEffect, useMemo, useState } = React;

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
        const [optic, setOptic] = useState(false);
        const warn = student.profile.tabLeaveWarn !== false;

        useEffect(function () {
            if (!started || done) return;
            if (left <= 0) { setDone(true); return; }
            var t = setTimeout(function () { setLeft(left - 1); }, 1000);
            return function () { clearTimeout(t); };
        }, [started, done, left]);

        useEffect(function () {
            if (!started || !warn || done) return;
            function onVis() {
                if (document.hidden) alert("Deneme açıkken sekme değişti. Gerçek sınavda bu riskli olur.");
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
            setDone(true);
            var correct = 0;
            var by = {};
            items.forEach(function (it, idx) {
                var ok = picks[idx] === it.q.correctAnswerIndex;
                if (ok) correct += 1;
                StudentStore.recordAnswer({ ders: it.ders, konu: it.konu, id: it.id, correct: !!ok });
                if (!by[it.ders]) by[it.ders] = { c: 0, t: 0 };
                by[it.ders].t += 1;
                if (ok) by[it.ders].c += 1;
            });
            StudentStore.addSessionStats({ questions: items.length, correct: correct });
            StudentStore.recordExamAttempt({ total: items.length, correct: correct, changes: changes, secondsUsed: 40 * 60 - left });
            var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
            var nick = (student.userProfile && student.userProfile.nickname) || "ogrenci";
            if (sb) {
                sb.from("exam_ranks").insert({
                    user_id: student.userProfile && student.userProfile.authUserId,
                    nickname: nick,
                    score: correct
                }).then(function () {});
            }
        }

        if (!items.length) {
            return <div className="p-6">Soru yok. <button onClick={props.onBack} className="font-bold">Geri</button></div>;
        }

        if (!started) {
            var premium = StudentStore.isPremium();
            var weekExams = (student.examAttempts || []).filter(function (a) {
                return a.at && a.at.slice(0, 10) >= (window.SyncEngine && window.SyncEngine.weekStart ? window.SyncEngine.weekStart() : "2000-01-01");
            }).length;
            var capped = !premium && weekExams >= ((window.KpssConfig && window.KpssConfig.freeWeeklyExams) || 2);
            return (
                <div className="max-w-2xl mx-auto px-4 py-8 pb-28">
                    <button onClick={props.onBack} className="font-bold text-sm mb-4">← Geri</button>
                    <h1 className="text-3xl font-black mb-2">Tam deneme</h1>
                    <p className="text-slate-500 mb-4">40 soru · 40 dk mini kitapçık (GY-GK karışık). Optik kâğıt görünümü opsiyonel.</p>
                    {capped ? <p className="p-3 rounded-xl bg-amber-50 text-amber-800 text-sm mb-4">Ücretsiz haftalık deneme doldu. Premium veya admin yükseltmesi gerekir.</p> : null}
                    <label className="flex gap-2 text-sm mb-4"><input type="checkbox" checked={optic} onChange={function (e) { setOptic(e.target.checked); }} /> Optik kâğıt görünümü</label>
                    <button disabled={capped} onClick={function () { setStarted(true); }} className="w-full p-4 rounded-2xl bg-indigo-600 text-white font-bold">Başlat</button>
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
            return (
                <div className="max-w-2xl mx-auto px-4 py-8 pb-28">
                    <h1 className="text-3xl font-black mb-2">Deneme bitti</h1>
                    <p className="mb-4">{correct}/{items.length} doğru · {Math.floor(used / 60)} dk · {changes} cevap değişikliği</p>
                    {Object.keys(by).map(function (d) {
                        return <div key={d} className="flex justify-between py-2 border-b"><span>{d}</span><span className="font-black">{by[d].c}/{by[d].t}</span></div>;
                    })}
                    <button onClick={props.onBack} className="mt-6 w-full p-4 rounded-2xl bg-indigo-600 text-white font-bold">Kapat</button>
                </div>
            );
        }

        var it = items[i];
        var mm = Math.floor(left / 60);
        var ss = String(left % 60).padStart(2, "0");
        return (
            <div className="max-w-3xl mx-auto px-3 py-4 pb-28">
                <div className="flex justify-between text-sm font-bold mb-3">
                    <span>Soru {i + 1}/{items.length}</span>
                    <span>{mm}:{ss}</span>
                    <button onClick={finish} className="text-rose-500">Bitir</button>
                </div>
                <div className={optic ? "bg-white border-2 border-slate-800 p-4 font-mono text-sm mb-4" : "bg-white dark:bg-slate-800 rounded-2xl p-5 mb-4 border"}>
                    <p className="text-xs text-slate-400 mb-2">{it.ders} · {it.konu}</p>
                    <p className="font-bold whitespace-pre-line mb-4">{it.q.question}</p>
                    {(it.q.options || []).map(function (opt, idx) {
                        var on = picks[i] === idx;
                        return (
                            <button key={idx} onClick={function () { pick(idx); }}
                                className={"w-full text-left p-3 mb-2 rounded-xl border " + (on ? "border-indigo-600 bg-indigo-50" : "")}>{opt}</button>
                        );
                    })}
                </div>
                {optic ? (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {items.map(function (_, idx) {
                            return (
                                <button key={idx} onClick={function () { setI(idx); }}
                                    className={"h-8 w-8 text-xs rounded " + (picks[idx] != null ? "bg-indigo-600 text-white" : "bg-slate-200")}>{idx + 1}</button>
                            );
                        })}
                    </div>
                ) : null}
                <div className="flex gap-2">
                    <button disabled={i === 0} onClick={function () { setI(i - 1); }} className="flex-1 p-3 rounded-xl border font-bold">Önceki</button>
                    <button disabled={i === items.length - 1} onClick={function () { setI(i + 1); }} className="flex-1 p-3 rounded-xl bg-slate-900 text-white font-bold">Sonraki</button>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.ExamSimulator = ExamSimulator;
})();
