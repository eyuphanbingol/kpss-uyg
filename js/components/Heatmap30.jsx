(function () {
    function Heatmap30(props) {
        const sessions = (props.student && props.student.sessions) || {};
        const days = [];
        const today = new Date();
        for (var i = 29; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var iso = StudentStore.todayStr(d);
            days.push({ iso: iso, q: (sessions[iso] && sessions[iso].questions) || 0 });
        }
        const rows = (props.plan && props.plan.rows) || [];
        const byDers = {};
        rows.forEach(function (r) {
            if (!byDers[r.ders]) byDers[r.ders] = [];
            byDers[r.ders].push(r);
        });
        return (
            <div className="p-4">
                {props.onBack ? (
                    <div className="flex justify-between mb-4">
                        <h1 className="text-xl font-semibold">Hakimiyet</h1>
                        <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                    </div>
                ) : null}
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Son 30 gün</p>
                <div className="grid grid-cols-10 gap-1 mb-6">
                    {days.map(function (x) {
                        var bg = x.q === 0 ? "bg-zinc-200 dark:bg-slate-800" : x.q < 10 ? "bg-amber-200" : x.q < 25 ? "bg-amber-400" : "bg-amber-600";
                        return <div key={x.iso} title={x.iso + " · " + x.q} className={"h-3 rounded-sm " + bg} />;
                    })}
                </div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Konu bazlı 0–100</p>
                {Object.keys(byDers).length === 0 ? (
                    <p className="text-sm text-zinc-500">Henüz konu verisi yok.</p>
                ) : Object.keys(byDers).map(function (ders) {
                    return (
                        <div key={ders} className="mb-4">
                            <p className="text-sm font-medium mb-1">{ders}</p>
                            <div className="space-y-1">
                                {byDers[ders].map(function (r) {
                                    var sc = r.masteryScore != null ? r.masteryScore : 0;
                                    return (
                                        <div key={r.konu} className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-500 w-32 truncate">{r.konu}</span>
                                            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-emerald" style={{ width: sc + "%" }} />
                                            </div>
                                            <span className="text-xs font-semibold w-8 text-right">{sc}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.Heatmap30 = Heatmap30;
})();
