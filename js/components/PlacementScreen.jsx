(function () {
    const { useEffect, useState, useMemo } = React;

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function getScoreLevel(score) {
        if (score >= 90) return { label: "🌟 Mükemmel", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" };
        if (score >= 75) return { label: "✅ İyi", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" };
        if (score >= 60) return { label: "📈 Orta", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" };
        if (score >= 40) return { label: "📉 Gelişmeli", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" };
        return { label: "🔴 Çalışma Gerekli", color: "text-rose-600", bg: "bg-rose-100 dark:bg-rose-900/30" };
    }

    function getStatusBadge(diff) {
        if (diff >= 4) return { label: "✅ Güvenli", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
        if (diff >= 0) return { label: "⚠️ Sınırda", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
        return { label: "🔴 Riskli", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" };
    }

    function getDiffEmoji(diff) {
        if (diff >= 4) return "🟢";
        if (diff >= 0) return "🟡";
        return "🔴";
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('tr-TR').format(num);
    }

    function getScoreColor(score) {
        if (score >= 90) return "text-emerald-600";
        if (score >= 75) return "text-indigo-600";
        if (score >= 60) return "text-amber-600";
        if (score >= 40) return "text-orange-600";
        return "text-rose-600";
    }

    function getProgressWidth(score) {
        return Math.min(100, (score / 100) * 100);
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function PlacementScreen(props) {
        const [rows, setRows] = useState([]);
        const [ready, setReady] = useState(false);
        const [note, setNote] = useState("");
        const [loading, setLoading] = useState(true);
        const [filter, setFilter] = useState("all");
        const [sortBy, setSortBy] = useState("taban");
        const [searchTerm, setSearchTerm] = useState("");

        const est = (window.ScoreEngine && window.ScoreEngine.estimate)
            ? window.ScoreEngine.estimate(props.student)
            : { score: 0, level: "lisans", gyNet: 0, gkNet: 0, note: "Puan motoru yok." };

        const premium = window.StudentStore && window.StudentStore.isPremium();

        // ---------- Load Data ----------
        useEffect(function () {
            setLoading(true);
            fetch("data/tabanPuanlar.json")
                .then(function (r) { return r.json(); })
                .then(function (j) {
                    setReady(!!(j && j.ready && j.rows && j.rows.length));
                    setRows((j && j.rows) || []);
                    setNote((j && j.note) || "");
                    setLoading(false);
                })
                .catch(function () { 
                    setReady(false); 
                    setLoading(false);
                });
        }, []);

        // ---------- Filter & Sort ----------
        var filteredRows = useMemo(function () {
            var result = rows.filter(function (r) {
                if (r.level && r.level !== est.level) return false;
                if (searchTerm) {
                    var hay = (r.kurum || "") + " " + (r.unvan || "") + " " + (r.il || "");
                    return hay.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return true;
            });

            if (filter === "safe") {
                result = result.filter(function (r) {
                    return Number(est.score) - Number(r.taban) >= 4;
                });
            } else if (filter === "risky") {
                result = result.filter(function (r) {
                    return Number(est.score) - Number(r.taban) < 0;
                });
            } else if (filter === "border") {
                result = result.filter(function (r) {
                    var diff = Number(est.score) - Number(r.taban);
                    return diff >= 0 && diff < 4;
                });
            }

            if (sortBy === "taban") {
                result = result.slice().sort(function (a, b) { return Number(b.taban) - Number(a.taban); });
            } else if (sortBy === "diff") {
                result = result.slice().sort(function (a, b) {
                    var diffA = Number(est.score) - Number(a.taban);
                    var diffB = Number(est.score) - Number(b.taban);
                    return diffB - diffA;
                });
            } else if (sortBy === "kurum") {
                result = result.slice().sort(function (a, b) { return (a.kurum || "").localeCompare(b.kurum || ""); });
            }

            return result;
        }, [rows, est.score, est.level, filter, sortBy, searchTerm]);

        // ---------- Hits ----------
        var hits = (ready && window.ScoreEngine && window.ScoreEngine.matchPlacement)
            ? window.ScoreEngine.matchPlacement(est.score, filteredRows)
            : [];

        if (!premium && hits.length > 3) hits = hits.slice(0, 3);

        // ---------- Stats ----------
        var totalMatches = hits.length;
        var safeMatches = hits.filter(function (h) { return Number(est.score) - Number(h.taban) >= 4; }).length;
        var riskyMatches = hits.filter(function (h) { return Number(est.score) - Number(h.taban) < 0; }).length;

        var scoreLevel = getScoreLevel(est.score);

        // ============================================================
        // RENDER
        // ============================================================

        return (
            <div className="max-w-3xl mx-auto px-4 py-6 pb-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 slide-up">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black gradient-text">🎯 Puan / Tercih</h1>
                        <p className="text-sm text-stone-400 mt-0.5">Tahmini puanına göre kurum eşleştirmesi</p>
                    </div>
                    <button 
                        onClick={props.onBack} 
                        className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                        ✕ Kapat
                    </button>
                </div>

                {/* Info */}
                <p className="text-xs text-stone-400 dark:text-stone-500 mb-5">
                    📊 Kaba puan tahmini · ÖSYM sonucu değildir · GY-GK baz alınır
                </p>

                {/* ===== PUAN KARTI ===== */}
                <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 mb-5 shadow-xl shadow-indigo-500/20 card-hover">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                                📊 Tahmini {est.level}
                            </p>
                            <div className="font-stat text-5xl md:text-6xl font-bold mt-1">
                                {est.score}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={"text-xs font-bold px-2.5 py-0.5 rounded-full " + scoreLevel.bg + " text-inherit"}>
                                    {scoreLevel.label}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs opacity-70">📝 Net</p>
                            <p className="text-sm font-medium">GY {est.gyNet}</p>
                            <p className="text-sm font-medium">GK {est.gkNet}</p>
                        </div>
                    </div>
                    {est.note && (
                        <p className="text-sm opacity-80 mt-3 pt-3 border-t border-white/10">
                            💡 {est.note}
                        </p>
                    )}
                </div>

                {/* ===== LOADING ===== */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="text-sm text-stone-400 mt-3">Taban puanlar yükleniyor...</p>
                    </div>
                )}

                {/* ===== NOT READY ===== */}
                {!loading && !ready && (
                    <div className="rounded-3xl glass p-8 text-center">
                        <div className="text-5xl mb-4">📋</div>
                        <h3 className="text-lg font-bold text-stone-600 dark:text-stone-300 mb-2">Veri Yüklenemedi</h3>
                        <p className="text-sm text-stone-400 max-w-sm mx-auto">
                            Taban puan listesi henüz yüklenmemiş. Puan motoru çalışıyor, GY-GK etkilenmez.
                        </p>
                        <button 
                            onClick={function () { 
                                setLoading(true);
                                fetch("data/tabanPuanlar.json")
                                    .then(function (r) { return r.json(); })
                                    .then(function (j) {
                                        setReady(!!(j && j.ready && j.rows && j.rows.length));
                                        setRows((j && j.rows) || []);
                                        setNote((j && j.note) || "");
                                        setLoading(false);
                                    })
                                    .catch(function () { setReady(false); setLoading(false); });
                            }}
                            className="mt-4 px-6 py-2 rounded-2xl btn-primary text-white font-semibold"
                        >
                            🔄 Yeniden Dene
                        </button>
                    </div>
                )}

                {/* ===== RESULTS ===== */}
                {!loading && ready && (
                    <div>
                        {/* Stats */}
                        {hits.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="rounded-2xl glass p-3 text-center card-hover">
                                    <div className="text-lg font-bold text-indigo-600">{totalMatches}</div>
                                    <div className="text-[10px] text-stone-400">🎯 Toplam</div>
                                </div>
                                <div className="rounded-2xl glass p-3 text-center card-hover">
                                    <div className="text-lg font-bold text-emerald-600">{safeMatches}</div>
                                    <div className="text-[10px] text-stone-400">✅ Güvenli</div>
                                </div>
                                <div className="rounded-2xl glass p-3 text-center card-hover">
                                    <div className="text-lg font-bold text-rose-600">{riskyMatches}</div>
                                    <div className="text-[10px] text-stone-400">🔴 Riskli</div>
                                </div>
                            </div>
                        )}

                        {/* Note */}
                        {note && (
                            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-300 mb-4">
                                💡 {note}
                            </div>
                        )}

                        {/* Filter & Search */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <input 
                                value={searchTerm}
                                onChange={function (e) { setSearchTerm(e.target.value); }}
                                placeholder="🔍 Ara: kurum, unvan, il..."
                                className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            />
                            <select 
                                value={filter}
                                onChange={function (e) { setFilter(e.target.value); }}
                                className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            >
                                <option value="all">📋 Tümü</option>
                                <option value="safe">✅ Güvenli</option>
                                <option value="border">🟡 Sınırda</option>
                                <option value="risky">🔴 Riskli</option>
                            </select>
                            <select 
                                value={sortBy}
                                onChange={function (e) { setSortBy(e.target.value); }}
                                className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            >
                                <option value="taban">📊 Taban Puan</option>
                                <option value="diff">📈 Fark</option>
                                <option value="kurum">🔤 Kurum</option>
                            </select>
                        </div>

                        {/* Premium Hint */}
                        {!premium && hits.length >= 3 && (
                            <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-3 text-xs text-indigo-700 dark:text-indigo-300 mb-4 flex items-center justify-between">
                                <span>🔓 Premium ile tüm eşleşmeleri görebilirsin</span>
                                <button 
                                    onClick={function () { if (props.onOpen) props.onOpen("paywall"); }}
                                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold"
                                >
                                    Yükselt
                                </button>
                            </div>
                        )}

                        {/* List */}
                        {hits.length === 0 ? (
                            <div className="rounded-3xl glass p-8 text-center">
                                <div className="text-4xl mb-3">🔍</div>
                                <p className="text-sm text-stone-400">Bu skor için eşleşen kurum bulunamadı.</p>
                                <p className="text-xs text-stone-400 mt-1">Filtreleri değiştirmeyi dene</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {hits.map(function (h, i) {
                                    var diff = Number(est.score) - Number(h.taban);
                                    var safe = diff >= 4;
                                    var status = getStatusBadge(diff);
                                    var diffEmoji = getDiffEmoji(diff);
                                    var displayDiff = diff >= 0 ? "+" + diff : diff;

                                    return (
                                        <div 
                                            key={i} 
                                            className={"rounded-2xl glass p-4 card-hover transition-all duration-200 border-l-4 " +
                                                (safe ? "border-l-emerald-500" : diff >= 0 ? "border-l-amber-500" : "border-l-rose-500")
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-sm">{h.kurum || "—"}</span>
                                                        <span className="text-xs text-stone-400">·</span>
                                                        <span className="text-xs text-stone-500">{h.unvan || "—"}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-stone-400">
                                                        <span>📍 {h.il || "—"}</span>
                                                        <span>📊 Taban: {h.taban}</span>
                                                        <span className={"font-medium " + (safe ? "text-emerald-600" : diff >= 0 ? "text-amber-600" : "text-rose-600")}>
                                                            {diffEmoji} {displayDiff} puan fark
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + status.color}>
                                                        {status.label}
                                                    </span>
                                                    <div className="mt-1 h-1 w-16 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden ml-auto">
                                                        <div className={"h-full rounded-full " + (safe ? "bg-emerald-500" : diff >= 0 ? "bg-amber-500" : "bg-rose-500")} 
                                                             style={{ width: Math.min(100, (Number(h.taban) / 100) * 100) + "%" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ===== DISCLAIMER ===== */}
                <div className="mt-6 rounded-2xl bg-stone-50 dark:bg-stone-800/30 p-4 border border-stone-200 dark:border-stone-700">
                    <div className="flex items-start gap-3">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="text-xs font-medium text-stone-600 dark:text-stone-300">Uyarı</p>
                            <p className="text-[10px] text-stone-400 leading-relaxed">
                                Bu puan tahmini <strong>kaba bir değerlendirmedir</strong>. 
                                Gerçek ÖSYM sonucu farklılık gösterebilir. 
                                Taban puanlar geçmiş yıllara aittir, güncel değildir. 
                                <br />
                                <span className="text-indigo-600 dark:text-indigo-400">
                                    Resmi tercih danışmanlığı değildir.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center text-[10px] text-stone-400">
                    <p>📊 Veriler örnek amaçlıdır · Gerçek tercihler için ÖSYM'yi ziyaret edin</p>
                </div>
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.PlacementScreen = PlacementScreen;

})();