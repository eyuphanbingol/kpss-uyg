(function () {
    const { useState } = React;
    var COL = ["#1E1B4B", "#0f766e", "#d97706", "#e11d48", "#57534e"];

    function Heatmap30(props) {
        const sessions = (props.student && props.student.sessions) || {};
        const todayStr = (window.StudentStore && window.StudentStore.todayStr)
            ? window.StudentStore.todayStr
            : function (d) { return d.toISOString().slice(0, 10); };
        const today = new Date();
        const todayIso = todayStr(today);
        const cells = [];
        var start = new Date(today);
        start.setDate(start.getDate() - 34);
        var lead = (start.getDay() + 6) % 7;
        var i;
        for (i = 0; i < lead; i++) cells.push(null);
        for (i = 0; i < 35; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - (34 - i));
            var iso = todayStr(d);
            var s = sessions[iso] || {};
            cells.push({
                iso: iso,
                q: s.questions || 0,
                min: s.minutes || 0,
                today: iso === todayIso
            });
        }
        var q30 = 0, dayOn = 0, min30 = 0;
        cells.forEach(function (c) {
            if (!c) return;
            q30 += c.q;
            min30 += c.min;
            if (c.q > 0 || c.min > 0) dayOn += 1;
        });
        var qMax = 1;
        cells.forEach(function (c) { if (c && c.q > qMax) qMax = c.q; });

        const rows = (props.plan && props.plan.rows) || [];
        const dersMap = {};
        rows.forEach(function (r) {
            if (!dersMap[r.ders]) dersMap[r.ders] = { ders: r.ders, scores: [], hours: 0 };
            dersMap[r.ders].scores.push(r.masteryScore != null ? r.masteryScore : 0);
        });
        Object.keys(sessions).forEach(function (iso) {
            var bd = sessions[iso].byDers || {};
            Object.keys(bd).forEach(function (ders) {
                if (!dersMap[ders]) dersMap[ders] = { ders: ders, scores: [], hours: 0 };
                dersMap[ders].hours += (bd[ders] || 0) / 60;
            });
        });
        var dersList = Object.keys(dersMap).map(function (k) {
            var x = dersMap[k];
            var sum = 0;
            x.scores.forEach(function (n) { sum += n; });
            x.avg = x.scores.length ? Math.round(sum / x.scores.length) : 0;
            x.weak = x.scores.filter(function (n) { return n < 50; }).length;
            return x;
        });
        dersList.sort(function (a, b) { return a.avg - b.avg; });
        var hourSum = dersList.reduce(function (a, x) { return a + x.hours; }, 0);

        const [open, setOpen] = useState("");
        const dayNames = ["P", "S", "Ç", "P", "C", "C", "P"];

        function cellBg(c) {
            if (!c) return "transparent";
            if (!c.q) return "#f5f5f4";
            var a = 0.2 + (c.q / qMax) * 0.8;
            return "rgba(217, 119, 6, " + a + ")";
        }
        function ring(avg) {
            if (avg < 50) return "#e11d48";
            if (avg < 75) return "#d97706";
            return "#0f766e";
        }

        return (
            <div className="pb-8">
                {props.onBack ? (
                    <div className="flex justify-between mb-2">
                        <h1 className="text-xl font-display font-semibold">Isı haritası</h1>
                        <button type="button" onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                    </div>
                ) : null}
                <p className="text-sm text-zinc-500 mb-4">Son 5 haftanın temposu ve ders bazında durum. Konuya girmez.</p>

                <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="rounded-2xl bg-amber-50 p-3 text-center">
                        <div className="font-stat text-xl text-amber-600">{dayOn}</div>
                        <div className="text-[11px] text-amber-800">aktif gün</div>
                    </div>
                    <div className="rounded-2xl bg-stone-100 dark:bg-stone-900 p-3 text-center">
                        <div className="font-stat text-xl">{q30}</div>
                        <div className="text-[11px] text-stone-500">soru</div>
                    </div>
                    <div className="rounded-2xl bg-stone-100 dark:bg-stone-900 p-3 text-center">
                        <div className="font-stat text-xl">{Math.round((min30 / 60) * 10) / 10}</div>
                        <div className="text-[11px] text-stone-500">saat</div>
                    </div>
                </div>

                <div className="rounded-2xl panel p-4 mb-4">
                    <p className="text-sm font-medium mb-1">Takvim</p>
                    <p className="text-[11px] text-stone-500 mb-3">Koyu amber = o gün daha çok soru.</p>
                    <div className="grid grid-cols-7 gap-1.5 mb-1">
                        {dayNames.map(function (n, di) {
                            return <div key={di} className="text-[10px] text-zinc-400 text-center">{n}</div>;
                        })}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                        {cells.map(function (c, idx) {
                            if (!c) return <div key={"e" + idx} className="aspect-square" />;
                            return (
                                <div key={c.iso} title={c.iso + " · " + c.q + " soru"}
                                    className={"aspect-square rounded-lg " + (c.today ? "ring-2 ring-navy-600" : "")}
                                    style={{ background: cellBg(c) }} />
                            );
                        })}
                    </div>
                </div>

                {dersList.length ? (
                    <div className="rounded-2xl panel p-4 mb-4">
                        <p className="text-sm font-medium mb-1">Dersler</p>
                        <p className="text-[11px] text-stone-500 mb-3">Çember = ortalama hakimiyet. Kutu = zayıf konu sayısı.</p>
                        <div className="space-y-3">
                            {dersList.map(function (x, i) {
                                var r = 22;
                                var cLen = 2 * Math.PI * r;
                                var dash = cLen * (x.avg / 100);
                                var col = COL[i % COL.length];
                                var hourPct = hourSum ? Math.round((x.hours / hourSum) * 100) : 0;
                                var opened = open === x.ders;
                                var topics = (dersMap[x.ders] && rows.filter(function (r) { return r.ders === x.ders; })) || [];
                                return (
                                    <button type="button" key={x.ders} onClick={function () { setOpen(opened ? "" : x.ders); }}
                                        className="w-full text-left rounded-xl bg-stone-50 dark:bg-stone-900 p-3">
                                        <div className="flex items-center gap-3">
                                            <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
                                                <circle cx="28" cy="28" r={r} fill="none" stroke="#e7e5e4" strokeWidth="6" />
                                                <circle cx="28" cy="28" r={r} fill="none" stroke={ring(x.avg)} strokeWidth="6"
                                                    strokeDasharray={dash + " " + (cLen - dash)} strokeLinecap="round" transform="rotate(-90 28 28)" />
                                                <text x="28" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{x.avg}</text>
                                            </svg>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate">{x.ders}</p>
                                                <div className="mt-1.5 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: (hourPct || Math.max(4, x.avg)) + "%", background: col }} />
                                                </div>
                                                <p className="text-[11px] text-stone-500 mt-1">
                                                    {x.hours ? (Math.round(x.hours * 10) / 10 + " saat · ") : ""}{x.weak} zayıf konu
                                                </p>
                                            </div>
                                        </div>
                                        {opened ? (
                                            <div className="mt-3 grid grid-cols-2 gap-1.5">
                                                {topics.map(function (r) {
                                                    var sc = r.masteryScore != null ? r.masteryScore : 0;
                                                    return (
                                                        <div key={r.konu} className="rounded-lg px-2 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                                                            <p className="text-[11px] truncate">{r.konu}</p>
                                                            <div className="mt-1 h-1 rounded-full bg-stone-100 overflow-hidden">
                                                                <div className="h-full rounded-full" style={{ width: sc + "%", background: ring(sc) }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-stone-500">Konu verisi yok. Derslerden çalışınca çemberler dolar.</p>
                )}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.Heatmap30 = Heatmap30;
})();
