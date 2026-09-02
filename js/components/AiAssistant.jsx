(function () {
    const { useMemo, useState } = React;
    function AiAssistant(props) {
        const [q, setQ] = useState("");
        const [out, setOut] = useState("");
        const [pick, setPick] = useState(0);
        const wrong = (props.plan && props.plan.wrong) || [];
        const extra = useMemo(function () {
            if (wrong.length) return [];
            var data = props.kpssData || {};
            var list = [];
            Object.keys(data).forEach(function (ders) {
                Object.keys(data[ders] || {}).forEach(function (konu) {
                    ((data[ders][konu] && data[ders][konu].sorular) || []).forEach(function (soru, idx) {
                        if (list.length >= 12) return;
                        list.push({ ders: ders, konu: konu, q: soru, id: soru.id != null ? soru.id : idx });
                    });
                });
            });
            return list;
        }, [props.kpssData, wrong.length]);
        const pool = wrong.length ? wrong : extra;
        const item = pool[pick] || pool[0];
        function explain() {
            if (!item || !item.q) return;
            var exp = item.q.explanation || "";
            var opts = item.q.options || [];
            var dogru = opts[item.q.correctAnswerIndex] || "";
            var hint = q.trim() ? ("Sorun: " + q.trim() + ". ") : "";
            setOut(hint + "Doğru seçenek: " + dogru + ". " + (exp || "Kayıtlı çözüm notu yok."));
        }
        return (
            <div className="max-w-2xl mx-auto pb-10">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Soru asistanı</h1>
                    <button type="button" onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <p className="text-sm text-zinc-500 mb-4">Yanlış defterindeki (veya örnek) sorunun doğru şıkkını ve kayıtlı çözümünü gösterir. ChatGPT değil.</p>
                {!item ? (
                    <p className="text-zinc-500 text-sm">Soru yok. Derslerden test çözünce asistan da dolar.</p>
                ) : (
                    <div>
                        {pool.length > 1 ? (
                            <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
                                {pool.slice(0, 8).map(function (it, i) {
                                    return (
                                        <button key={i} type="button" onClick={function () { setPick(i); setOut(""); }}
                                            className={"shrink-0 px-3 py-1.5 rounded-full text-xs " + (pick === i ? "bg-navy-600 text-white" : "bg-stone-100")}>
                                            {i + 1}. {(it.konu || "").slice(0, 18)}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                        <p className="text-xs text-stone-400 mb-1">{item.ders} · {item.konu}</p>
                        <p className="text-sm font-medium mb-2">{item.q.question}</p>
                        <div className="space-y-1 mb-3">
                            {(item.q.options || []).map(function (opt, i) {
                                return <p key={i} className="text-sm text-stone-600">{opt}</p>;
                            })}
                        </div>
                        <textarea value={q} onChange={function (e) { setQ(e.target.value); }}
                            className="w-full border border-stone-300 rounded-xl p-3 text-sm bg-white dark:bg-zinc-900"
                            placeholder="Neden yanlış yaptım? (isteğe bağlı)" />
                        <button type="button" onClick={explain} className="mt-3 w-full py-2.5 rounded-xl bg-navy-600 text-white text-sm font-semibold">Açıkla</button>
                        {out ? <p className="text-sm text-stone-700 mt-4 leading-relaxed p-3 rounded-2xl bg-stone-100">{out}</p> : null}
                    </div>
                )}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AiAssistant = AiAssistant;
})();
