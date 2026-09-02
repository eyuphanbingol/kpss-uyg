(function () {
    function Heatmap30(props) {
        const sessions = (props.student && props.student.sessions) || {};
        const days = [];
        const today = new Date();
        for (var i = 29; i >= 0; i--) {
            var d = new Date(today);
            d.setDate(d.getDate() - i);
            var iso = (window.StudentStore && window.StudentStore.todayStr) ? window.StudentStore.todayStr(d) : d.toISOString().slice(0, 10);
            days.push({ iso: iso, q: (sessions[iso] && sessions[iso].questions) || 0 });
        }
        const rows = (props.plan && props.plan.rows) || [];
        const byDers = {};
        rows.forEach(function (r) {
            if (!byDers[r.ders]) byDers[r.ders] = [];
            byDers[r.ders].push(r);
        });
        function masteryBar(sc) {
            if (sc < 50) return "bg-coral-500";
            if (sc < 75) return "bg-amber-500";
            return "bg-emerald-500";
        }
        function heat(q) {
            if (q === 0) return "bg-amber-50";
            if (q < 10) return "bg-amber-100";
            if (q < 25) return "bg-amber-500";
            return "bg-amber-600";
        }
        return (
            <div className="p-4">
                {props.onBack ? (
                    <div className="flex justify-between mb-2">
                        <h1 className="text-xl font-display font-semibold">Isı haritası</h1>
                        <button type="button" onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                    </div>
                ) : null}
                <p className="text-sm text-zinc-500 mb-4">Kaç gün çalıştın, hangi konularda zayıfsın. Ders açmaz, sadece gösterir.</p>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Çalışma serisi</p>
                <p className="text-xs text-stone-500 mb-2">Amber = yoğunluk (kaç soru). Hakimiyet değil.</p>
                <div className="grid grid-cols-10 gap-1 mb-8">
                    {days.map(function (x) {
                        return <div key={x.iso} title={x.iso + " · " + x.q + " soru"} className={"h-3 rounded-sm " + heat(x.q)} />;
                    })}
                </div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Konu hakimiyeti</p>
                <p className="text-xs text-stone-500 mb-3">Mercan düşük · amber orta · zümrüt yüksek (durum, yoğunluk değil).</p>
                {Object.keys(byDers).length === 0 ? (
                    <p className="text-sm text-stone-500">Henüz konu verisi yok.</p>
                ) : Object.keys(byDers).map(function (ders) {
                    return (
                        <div key={ders} className="mb-4">
                            <p className="text-sm font-medium mb-1 text-stone-700">{ders}</p>
                            <div className="space-y-1">
                                {byDers[ders].map(function (r) {
                                    var sc = r.masteryScore != null ? r.masteryScore : 0;
                                    return (
                                        <div key={r.konu} className="flex items-center gap-2">
                                            <span className="text-xs text-stone-500 w-32 truncate">{r.konu}</span>
                                            <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                                <div className={"h-full " + masteryBar(sc)} style={{ width: sc + "%" }} />
                                            </div>
                                            <span className="text-xs font-stat w-8 text-right">{sc}</span>
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
