(function () {
    const { useState, useMemo } = React;
    
    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    var COL = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6", "#d946ef"];

    function getIntensityColor(value, max) {
        if (value === 0) return "rgba(241, 245, 249, 0.4)";
        var ratio = Math.min(1, value / max);
        // Turuncu-amber gradient
        var r = Math.round(251 + (239 - 251) * ratio);
        var g = Math.round(191 + (68 - 191) * ratio);
        var b = Math.round(36 + (34 - 36) * ratio);
        return "rgba(" + r + "," + g + "," + b + "," + (0.3 + ratio * 0.7) + ")";
    }

    function getScoreRingColor(score) {
        if (score >= 80) return "#10b981";
        if (score >= 60) return "#4f46e5";
        if (score >= 40) return "#f59e0b";
        return "#ef4444";
    }

    function getScoreLabel(score) {
        if (score >= 80) return { text: "Mükemmel", emoji: "🌟" };
        if (score >= 60) return { text: "İyi", emoji: "✅" };
        if (score >= 40) return { text: "Orta", emoji: "📈" };
        return { text: "Gelişmeli", emoji: "📉" };
    }

    function formatDate(iso) {
        if (!iso) return "";
        var parts = iso.split("-");
        if (parts.length === 3) {
            return parts[2] + "." + parts[1];
        }
        return iso;
    }

    function getDayName(index) {
        var days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
        return days[index] || "";
    }

    function getWeekNumber(date) {
        var d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        var week1 = new Date(d.getFullYear(), 0, 4);
        return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function Heatmap30(props) {
        const sessions = (props.student && props.student.sessions) || {};
        const todayStr = (window.StudentStore && window.StudentStore.todayStr)
            ? window.StudentStore.todayStr
            : function (d) { return d.toISOString().slice(0, 10); };
        
        const today = new Date();
        const todayIso = todayStr(today);
        
        // ---------- Hücre Verileri ----------
        const cells = [];
        var start = new Date(today);
        start.setDate(start.getDate() - 34);
        var lead = (start.getDay() + 6) % 7;
        
        for (var i = 0; i < lead; i++) cells.push(null);
        
        for (i = 0; i < 35; i++) {
            var d = new Date(today);
            d.setDate(d.getDate() - (34 - i));
            var iso = todayStr(d);
            var s = sessions[iso] || {};
            cells.push({
                iso: iso,
                q: s.questions || 0,
                min: s.minutes || 0,
                today: iso === todayIso,
                day: d.getDay(),
                date: d.getDate()
            });
        }

        // ---------- İstatistikler ----------
        var q30 = 0, dayOn = 0, min30 = 0;
        cells.forEach(function (c) {
            if (!c) return;
            q30 += c.q;
            min30 += c.min;
            if (c.q > 0 || c.min > 0) dayOn += 1;
        });
        var qMax = 1;
        cells.forEach(function (c) { if (c && c.q > qMax) qMax = c.q; });

        // ---------- Ders Verileri ----------
        const rows = (props.plan && props.plan.rows) || [];
        const dersMap = {};
        
        rows.forEach(function (r) {
            if (!dersMap[r.ders]) {
                dersMap[r.ders] = { 
                    ders: r.ders, 
                    scores: [], 
                    hours: 0,
                    topics: []
                };
            }
            dersMap[r.ders].scores.push(r.masteryScore != null ? r.masteryScore : 0);
            dersMap[r.ders].topics.push({
                konu: r.konu,
                score: r.masteryScore != null ? r.masteryScore : 0,
                notSayisi: r.notSayisi || 0,
                soruSayisi: r.soruSayisi || 0
            });
        });

        Object.keys(sessions).forEach(function (iso) {
            var bd = sessions[iso].byDers || {};
            Object.keys(bd).forEach(function (ders) {
                if (!dersMap[ders]) {
                    dersMap[ders] = { ders: ders, scores: [], hours: 0, topics: [] };
                }
                dersMap[ders].hours += (bd[ders] || 0) / 60;
            });
        });

        // ---------- Ders Listesi ----------
        var dersList = Object.keys(dersMap).map(function (k) {
            var x = dersMap[k];
            var sum = 0;
            x.scores.forEach(function (n) { sum += n; });
            x.avg = x.scores.length ? Math.round(sum / x.scores.length) : 0;
            x.weak = x.scores.filter(function (n) { return n < 50; }).length;
            x.strong = x.scores.filter(function (n) { return n >= 80; }).length;
            return x;
        });
        dersList.sort(function (a, b) { return b.avg - a.avg; });
        var hourSum = dersList.reduce(function (a, x) { return a + x.hours; }, 0);

        // ---------- State ----------
        const [open, setOpen] = useState("");
        const [viewMode, setViewMode] = useState("heatmap"); // heatmap | ders

        // ---------- Hafta Grupları ----------
        const weekGroups = useMemo(function () {
            var groups = [];
            var currentWeek = [];
            cells.forEach(function (c, idx) {
                if (!c) return;
                currentWeek.push(c);
                if (currentWeek.length === 7 || idx === cells.length - 1) {
                    if (currentWeek.length > 0) {
                        groups.push(currentWeek);
                    }
                    currentWeek = [];
                }
            });
            return groups;
        }, [cells]);

        // ---------- Tooltip ----------
        const [tooltip, setTooltip] = useState(null);

        // ============================================================
        // RENDER
        // ============================================================

        return (
            <div className="pb-8">
                {/* Header */}
                {props.onBack ? (
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black gradient-text">📊 Isı Haritası</h1>
                            <p className="text-sm text-stone-400 mt-0.5">30 günlük çalışma tempon ve ders analizlerin</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={props.onBack} 
                            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                        >
                            ✕ Kapat
                        </button>
                    </div>
                ) : null}

                {/* View Toggle */}
                <div className="flex p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 mb-5">
                    <button 
                        type="button"
                        onClick={function () { setViewMode("heatmap"); }}
                        className={"flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 " +
                            (viewMode === "heatmap" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")
                        }
                    >
                        🔥 Isı Haritası
                    </button>
                    <button 
                        type="button"
                        onClick={function () { setViewMode("ders"); }}
                        className={"flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 " +
                            (viewMode === "ders" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")
                        }
                    >
                        📚 Ders Analizi
                    </button>
                </div>

                {/* ===== HEATMAP VIEW ===== */}
                {viewMode === "heatmap" && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                            <div className="rounded-2xl glass p-4 text-center card-hover">
                                <div className="text-2xl font-bold text-amber-600">{dayOn}</div>
                                <div className="text-xs text-stone-400 mt-0.5">🔥 Aktif Gün</div>
                            </div>
                            <div className="rounded-2xl glass p-4 text-center card-hover">
                                <div className="text-2xl font-bold text-indigo-600">{q30}</div>
                                <div className="text-xs text-stone-400 mt-0.5">📝 Toplam Soru</div>
                            </div>
                            <div className="rounded-2xl glass p-4 text-center card-hover">
                                <div className="text-2xl font-bold text-emerald-600">{Math.round((min30 / 60) * 10) / 10}</div>
                                <div className="text-xs text-stone-400 mt-0.5">⏱️ Çalışma Saati</div>
                            </div>
                            <div className="rounded-2xl glass p-4 text-center card-hover">
                                <div className="text-2xl font-bold text-rose-600">{Math.round((q30 / Math.max(1, dayOn)))}</div>
                                <div className="text-xs text-stone-400 mt-0.5">📊 Günlük Ortalama</div>
                            </div>
                        </div>

                        {/* Heatmap */}
                        <div className="rounded-3xl glass p-5 mb-5 card-hover">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-sm font-semibold">🔥 Çalışma Takvimi</p>
                                    <p className="text-[11px] text-stone-400">Koyu renk = daha çok soru çözülen günler</p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-stone-400">
                                    <span>Az</span>
                                    <div className="flex gap-0.5 h-3">
                                        {[0, 0.25, 0.5, 0.75, 1].map(function (v, idx) {
                                            var color = getIntensityColor(v * qMax, qMax);
                                            return <div key={idx} className="w-3 rounded-sm" style={{ background: color }} />;
                                        })}
                                    </div>
                                    <span>Çok</span>
                                </div>
                            </div>

                            {/* Week Labels */}
                            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(function (n, di) {
                                    return <div key={di} className="text-[10px] font-medium text-stone-400 text-center">{n}</div>;
                                })}
                            </div>

                            {/* Heatmap Grid */}
                            <div className="grid grid-cols-7 gap-1.5 relative">
                                {cells.map(function (c, idx) {
                                    if (!c) return <div key={"e" + idx} className="aspect-square" />;
                                    var bg = getIntensityColor(c.q, qMax);
                                    var isToday = c.today;
                                    var hasActivity = c.q > 0 || c.min > 0;
                                    
                                    return (
                                        <div 
                                            key={c.iso} 
                                            className={"aspect-square rounded-lg transition-all duration-200 cursor-pointer hover:scale-110 hover:shadow-lg " +
                                                (isToday ? "ring-2 ring-indigo-500 ring-offset-2" : "") +
                                                (hasActivity ? " hover:opacity-80" : "")
                                            }
                                            style={{ background: bg }}
                                            onMouseEnter={function () {
                                                setTooltip({
                                                    iso: c.iso,
                                                    q: c.q,
                                                    min: c.min,
                                                    date: formatDate(c.iso),
                                                    today: c.today
                                                });
                                            }}
                                            onMouseLeave={function () { setTooltip(null); }}
                                        >
                                            <div className="w-full h-full flex items-center justify-center text-[8px] font-medium text-stone-500 opacity-50">
                                                {c.date}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tooltip */}
                            {tooltip && (
                                <div className="absolute top-0 left-0 pointer-events-none bg-white dark:bg-stone-900 rounded-2xl p-3 shadow-2xl border border-stone-200 dark:border-stone-700 z-10"
                                     style={{ transform: "translate(10px, 10px)" }}
                                >
                                    <p className="text-xs font-medium">{tooltip.date}</p>
                                    <p className="text-sm font-bold text-amber-600">{tooltip.q} soru</p>
                                    <p className="text-xs text-stone-400">{Math.round(tooltip.min / 60 * 10) / 10} saat</p>
                                    {tooltip.today && <span className="text-[10px] font-bold text-indigo-600">⭐ Bugün</span>}
                                </div>
                            )}
                        </div>

                        {/* Weekly Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {weekGroups.slice(-5).map(function (week, wi) {
                                var weekQ = week.reduce(function (sum, c) { return sum + c.q; }, 0);
                                var weekMin = week.reduce(function (sum, c) { return sum + c.min; }, 0);
                                var weekDays = week.filter(function (c) { return c.q > 0 || c.min > 0; }).length;
                                var weekNum = getWeekNumber(new Date(week[0]?.iso || today));
                                
                                return (
                                    <div key={wi} className="rounded-2xl glass p-3 text-center card-hover">
                                        <p className="text-[10px] font-medium text-stone-400">Hafta {weekNum}</p>
                                        <p className="text-lg font-bold text-indigo-600">{weekQ}</p>
                                        <p className="text-[10px] text-stone-400">{weekDays} gün · {Math.round(weekMin / 60)}s</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ===== DERS ANALİZİ VIEW ===== */}
                {viewMode === "ders" && (
                    <div>
                        {dersList.length ? (
                            <div>
                                {/* Ders Özeti */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                    <div className="rounded-2xl glass p-4 text-center card-hover">
                                        <div className="text-2xl font-bold text-indigo-600">{dersList.length}</div>
                                        <div className="text-xs text-stone-400 mt-0.5">📚 Toplam Ders</div>
                                    </div>
                                    <div className="rounded-2xl glass p-4 text-center card-hover">
                                        <div className="text-2xl font-bold text-emerald-600">
                                            {dersList.filter(function (x) { return x.avg >= 80; }).length}
                                        </div>
                                        <div className="text-xs text-stone-400 mt-0.5">🌟 Güçlü Ders</div>
                                    </div>
                                    <div className="rounded-2xl glass p-4 text-center card-hover">
                                        <div className="text-2xl font-bold text-rose-600">
                                            {dersList.filter(function (x) { return x.avg < 50; }).length}
                                        </div>
                                        <div className="text-xs text-stone-400 mt-0.5">⚠️ Zayıf Ders</div>
                                    </div>
                                    <div className="rounded-2xl glass p-4 text-center card-hover">
                                        <div className="text-2xl font-bold text-amber-600">{Math.round(hourSum * 10) / 10}</div>
                                        <div className="text-xs text-stone-400 mt-0.5">⏱️ Toplam Saat</div>
                                    </div>
                                </div>

                                {/* Ders Listesi */}
                                <div className="space-y-3">
                                    {dersList.map(function (x, i) {
                                        var r = 24;
                                        var cLen = 2 * Math.PI * r;
                                        var dash = cLen * (Math.min(100, x.avg) / 100);
                                        var col = COL[i % COL.length];
                                        var hourPct = hourSum ? Math.round((x.hours / hourSum) * 100) : 0;
                                        var opened = open === x.ders;
                                        var topics = (dersMap[x.ders] && rows.filter(function (r) { return r.ders === x.ders; })) || [];
                                        var scoreInfo = getScoreLabel(x.avg);
                                        var ringColor = getScoreRingColor(x.avg);

                                        return (
                                            <div 
                                                key={x.ders} 
                                                className="rounded-3xl glass p-4 card-hover transition-all duration-300"
                                            >
                                                <button 
                                                    type="button" 
                                                    onClick={function () { setOpen(opened ? "" : x.ders); }}
                                                    className="w-full text-left"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {/* Ring Chart */}
                                                        <div className="relative shrink-0">
                                                            <svg width="60" height="60" viewBox="0 0 60 60">
                                                                <circle cx="30" cy="30" r={r} fill="none" stroke="#e7e5e4" strokeWidth="5" />
                                                                <circle 
                                                                    cx="30" cy="30" r={r} 
                                                                    fill="none" 
                                                                    stroke={ringColor} 
                                                                    strokeWidth="5"
                                                                    strokeDasharray={dash + " " + (cLen - dash)} 
                                                                    strokeLinecap="round" 
                                                                    transform="rotate(-90 30 30)"
                                                                    className="transition-all duration-1000"
                                                                />
                                                                <text x="30" y="33" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor">
                                                                    {x.avg}
                                                                </text>
                                                            </svg>
                                                            {x.weak > 0 && (
                                                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                                                                    {x.weak}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-lg">{x.ders}</span>
                                                                <span className="text-xs">{scoreInfo.emoji}</span>
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <div className="flex-1 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                                                    <div className="h-full rounded-full transition-all duration-500" 
                                                                         style={{ width: (hourPct || 4) + "%", background: col }} />
                                                                </div>
                                                                <span className="text-[10px] text-stone-400 shrink-0">
                                                                    {Math.round(x.hours * 10) / 10} sa
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-3 mt-1 text-[10px] text-stone-400">
                                                                <span>{x.scores.length} konu</span>
                                                                <span>💪 {x.strong} güçlü</span>
                                                                <span>⚠️ {x.weak} zayıf</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-stone-300 dark:text-stone-600 text-xl transition-transform duration-300" 
                                                             style={{ transform: opened ? "rotate(90deg)" : "rotate(0deg)" }}>
                                                            ›
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Konu Detayları */}
                                                {opened && (
                                                    <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 slide-up">
                                                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                                                            📋 Konu Detayları
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {topics.slice(0, 8).map(function (r) {
                                                                var sc = r.score != null ? r.score : 0;
                                                                var color = getScoreRingColor(sc);
                                                                var label = getScoreLabel(sc);
                                                                return (
                                                                    <div key={r.konu} className="rounded-xl bg-white dark:bg-stone-800/50 p-3 border border-stone-200 dark:border-stone-700">
                                                                        <div className="flex items-center justify-between">
                                                                            <p className="text-xs font-medium truncate flex-1">{r.konu}</p>
                                                                            <span className="text-[10px] ml-2">{label.emoji}</span>
                                                                        </div>
                                                                        <div className="mt-1.5 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                                                            <div className="h-full rounded-full transition-all duration-500" 
                                                                                 style={{ width: sc + "%", background: color }} />
                                                                        </div>
                                                                        <div className="flex justify-between mt-0.5 text-[9px] text-stone-400">
                                                                            <span>{r.soruSayisi || 0} soru</span>
                                                                            <span className="font-medium" style={{ color: color }}>{sc}%</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        {topics.length > 8 && (
                                                            <p className="text-[10px] text-stone-400 text-center mt-2">
                                                                +{topics.length - 8} konu daha
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-3xl glass p-12 text-center">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-lg font-bold text-stone-600 dark:text-stone-300 mb-2">Henüz Veri Yok</h3>
                                <p className="text-sm text-stone-400 max-w-sm mx-auto">
                                    Derslerden çalışmaya başladıkça analizlerin burada görünecek.
                                    Her konu bitirdiğinde istatistiklerin güncellenir.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Alt Bilgi */}
                <div className="mt-6 text-center text-[10px] text-stone-400">
                    <p>📊 Veriler günlük olarak güncellenir · Son 30 gün gösterimi</p>
                </div>
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.Heatmap30 = Heatmap30;

})();