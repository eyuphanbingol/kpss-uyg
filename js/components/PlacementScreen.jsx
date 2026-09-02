(function () {
    const { useEffect, useState } = React;
    function PlacementScreen(props) {
        const [rows, setRows] = useState([]);
        const [ready, setReady] = useState(false);
        const [note, setNote] = useState("");
        const est = (window.ScoreEngine && window.ScoreEngine.estimate)
            ? window.ScoreEngine.estimate(props.student)
            : { score: 0, level: "lisans", gyNet: 0, gkNet: 0, note: "Puan motoru yok." };
        const premium = window.StudentStore && window.StudentStore.isPremium();
        useEffect(function () {
            fetch("data/tabanPuanlar.json").then(function (r) { return r.json(); }).then(function (j) {
                setReady(!!(j && j.ready && j.rows && j.rows.length));
                setRows((j && j.rows) || []);
                setNote((j && j.note) || "");
            }).catch(function () { setReady(false); });
        }, []);
        var hits = (ready && window.ScoreEngine && window.ScoreEngine.matchPlacement)
            ? window.ScoreEngine.matchPlacement(est.score, rows.filter(function (r) {
                return !r.level || r.level === est.level;
            }))
            : [];
        if (!premium && hits.length > 3) hits = hits.slice(0, 3);
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Puan / tercih</h1>
                    <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <div className="p-5 rounded-2xl bg-navy-600 text-white mb-4">
                    <div className="text-xs uppercase tracking-widest opacity-70">Tahmini {est.level}</div>
                    <div className="font-stat text-4xl mt-1">{est.score}</div>
                    <p className="text-sm opacity-80 mt-2">{est.note}</p>
                    <p className="text-xs mt-1">GY net ~{est.gyNet} · GK net ~{est.gkNet}</p>
                </div>
                {!ready ? (
                    <div className="p-4 rounded-2xl panel text-sm text-zinc-500">Tercih listesi henüz yok. Puan motoru çalışır; GY-GK etkilenmez.</div>
                ) : (
                    <div>
                        {note ? <p className="text-xs text-zinc-400 mb-3">{note}</p> : null}
                        {!premium ? <p className="text-xs text-zinc-500 mb-3">Ücretsiz planda ilk 3 eşleşme. Tam liste Premium.</p> : null}
                        <div className="space-y-2">
                            {hits.map(function (h, i) {
                                var high = Number(est.score) - Number(h.taban) >= 4;
                                return <div key={i} className={"p-3 rounded-xl bg-stone-50 border-l-4 text-sm " + (high ? "border-emerald-500" : "border-coral-500")}><b>{h.kurum}</b> · {h.unvan} · {h.il} · taban {h.taban}</div>;
                            })}
                            {hits.length === 0 ? <p className="text-sm text-zinc-500">Bu skorun altında taban yok (örnek veri).</p> : null}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.PlacementScreen = PlacementScreen;
})();
