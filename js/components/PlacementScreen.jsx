(function () {
    const { useEffect, useState } = React;
    function PlacementScreen(props) {
        const [rows, setRows] = useState([]);
        const [ready, setReady] = useState(false);
        const est = window.ScoreEngine.estimate(props.student);
        useEffect(function () {
            fetch("data/tabanPuanlar.json").then(function (r) { return r.json(); }).then(function (j) {
                setReady(!!(j && j.ready && j.rows && j.rows.length));
                setRows((j && j.rows) || []);
            }).catch(function () { setReady(false); });
        }, []);
        const hits = ready ? window.ScoreEngine.matchPlacement(est.score, rows) : [];
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
                <div className="flex justify-between mb-4">
                    <h1 className="text-3xl font-black">Puan / tercih</h1>
                    <button onClick={props.onBack} className="font-bold text-sm">Kapat</button>
                </div>
                <div className="p-5 rounded-3xl bg-indigo-600 text-white mb-4">
                    <div className="text-xs uppercase tracking-widest opacity-70">Tahmini {est.level}</div>
                    <div className="text-4xl font-black">{est.score}</div>
                    <p className="text-sm opacity-80 mt-2">{est.note}</p>
                    <p className="text-xs mt-1">GY net ~{est.gyNet} · GK net ~{est.gkNet}</p>
                </div>
                {!ready ? (
                    <div className="p-4 rounded-2xl border bg-amber-50 text-amber-900 text-sm">
                        Tercih robotu <b>Yakında</b>. `data/tabanPuanlar.json` doldurulunca kadro eşlemesi açılır; GY-GK akışı etkilenmez.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {hits.map(function (h, i) {
                            return <div key={i} className="p-3 rounded-xl border bg-white dark:bg-slate-800"><b>{h.kurum}</b> · {h.unvan} · {h.il} · taban {h.taban}</div>;
                        })}
                    </div>
                )}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.PlacementScreen = PlacementScreen;
})();
