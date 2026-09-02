(function () {
    const { useEffect, useState, useMemo, useCallback, useRef } = React;

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function fmtDate(x) {
        if (!x) return "—";
        try {
            var d = new Date(x);
            if (isNaN(d.getTime())) return String(x).slice(0, 10);
            return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
        } catch (e) { return "—"; }
    }

    function fmtTime(x) {
        if (!x) return "—";
        try {
            var d = new Date(x);
            if (isNaN(d.getTime())) return String(x).slice(0, 10);
            return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        } catch (e) { return "—"; }
    }

    function fmtDateTime(x) {
        if (!x) return "—";
        try {
            var d = new Date(x);
            if (isNaN(d.getTime())) return String(x).slice(0, 10);
            return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + 
                   d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        } catch (e) { return "—"; }
    }

    function eduLabel(id) {
        if (id === "onlisans") return "Ön lisans";
        if (id === "ortaogretim") return "Ortaöğretim";
        if (id === "lisans") return "Lisans";
        return id || "—";
    }

    function trackLabel(id) {
        var map = { "B": "B Grubu", "A": "A Grubu", "ogretmen": "Öğretmenlik", "dhbt": "DHBT" };
        return map[id] || id || "—";
    }

    function getLevelColor(level) {
        var map = {
            "lisans": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
            "onlisans": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
            "ortaogretim": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        };
        return map[level] || "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300";
    }

    function getStatusBadge(lastStudyAt) {
        if (!lastStudyAt) return { label: "Hiç çalışmamış", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" };
        var diff = (Date.now() - new Date(lastStudyAt).getTime()) / (1000 * 60 * 60 * 24);
        if (diff < 1) return { label: "🟢 Bugün aktif", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
        if (diff < 3) return { label: "🟡 3 gün içinde", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
        if (diff < 7) return { label: "🟠 7 gün içinde", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" };
        return { label: "🔴 7+ gün pasif", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" };
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function AdminDashboard(props) {
        const student = props.student;
        const [tab, setTab] = useState("ozet");
        const [rows, setRows] = useState([]);
        const [kpi, setKpi] = useState(null);
        const [hard, setHard] = useState([]);
        const [announce, setAnnounce] = useState("");
        const [detail, setDetail] = useState(null);
        const [q, setQ] = useState("");
        const [filter, setFilter] = useState("all");
        const [msg, setMsg] = useState("");
        const [busy, setBusy] = useState(false);
        const [log, setLog] = useState([]);
        const [eduReqs, setEduReqs] = useState([]);
        const [sidebarOpen, setSidebarOpen] = useState(false);
        const [selectedUserId, setSelectedUserId] = useState(null);
        const [stats, setStats] = useState(null);
        const [sortField, setSortField] = useState("last_study_at");
        const [sortOrder, setSortOrder] = useState("desc");
        const [page, setPage] = useState(1);
        const pageSize = 20;

        const isAdmin = student.userProfile && student.userProfile.role === "admin";
        const email = (student.userProfile && student.userProfile.email) || "";

        // ---------- Refs ----------
        const searchInputRef = useRef(null);
        const announceRef = useRef(null);

        // ---------- Load Fonksiyonu ----------
        const load = useCallback(async function () {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { setMsg("Veritabanı bağlı değil."); return; }

            setBusy(true);
            try {
                // KPI'lar
                var r = await sb.rpc("admin_kpis");
                if (r.error) setMsg("Özet: " + r.error.message);
                else setKpi(r.data);

                // Kullanıcı listesi
                var r2 = await sb.rpc("admin_user_list");
                if (!r2.error && r2.data) {
                    setRows(Array.isArray(r2.data) ? r2.data : []);
                } else {
                    var r3 = await sb.from("admin_user_directory").select("*").limit(500);
                    if (r3.error) setMsg("Kullanıcı listesi: " + (r2.error && r2.error.message ? r2.error.message + " · " : "") + r3.error.message);
                    else setRows(r3.data || []);
                }

                // Zor konular
                var r4 = await sb.rpc("admin_hard_topics");
                if (!r4.error && r4.data) setHard(Array.isArray(r4.data) ? r4.data : []);

                // Eğitim talepleri
                var r5 = await sb.functions.invoke("admin-action", { body: { action: "list_edu_requests" } });
                if (!r5.error) {
                    var d = r5.data;
                    if (typeof d === "string") {
                        try { d = JSON.parse(d); } catch (e) { d = null; }
                    }
                    var list = [];
                    if (Array.isArray(d)) list = d;
                    else if (d && Array.isArray(d.data)) list = d.data;
                    else if (d && d.data && Array.isArray(d.data.data)) list = d.data.data;
                    setEduReqs(list);
                }

                // İstatistikler
                var r6 = await sb.rpc("admin_stats");
                if (!r6.error && r6.data) setStats(r6.data);

            } catch (e) {
                setMsg("Ağ hatası: " + (e && e.message));
            } finally {
                setBusy(false);
            }
        }, []);

        // ---------- Effect ----------
        useEffect(function () {
            if (isAdmin) load();
        }, [isAdmin, load]);

        // ---------- Action ----------
        const act = useCallback(async function (name, payload) {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { setMsg("Supabase yok"); return; }
            setBusy(true);
            try {
                var res = await sb.functions.invoke("admin-action", { body: Object.assign({ action: name }, payload) });
                if (res.error) {
                    setMsg(res.error.message);
                } else {
                    setMsg("✅ İşlem başarıyla uygulandı.");
                    setLog(function (L) {
                        return [{ t: name, at: new Date().toLocaleTimeString("tr-TR"), detail: payload }].concat(L).slice(0, 20);
                    });
                    if (name === "inspect_user" && res.data) {
                        setDetail(res.data.data || res.data);
                    }
                    load();
                }
            } catch (e) {
                setMsg("Hata: " + (e && e.message));
            } finally {
                setBusy(false);
            }
        }, [load]);

        // ---------- Inspect ----------
        const inspect = useCallback(async function (uid) {
            await act("inspect_user", { user_id: uid });
        }, [act]);

        // ---------- Sıralama ----------
        const sortedRows = useMemo(function () {
            var sorted = rows.slice();
            sorted.sort(function (a, b) {
                var aVal = a[sortField] || "";
                var bVal = b[sortField] || "";
                if (sortField === "last_study_at") {
                    var aDate = aVal ? new Date(aVal).getTime() : 0;
                    var bDate = bVal ? new Date(bVal).getTime() : 0;
                    return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
                }
                if (typeof aVal === "string") {
                    return sortOrder === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
                }
                return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
            });
            return sorted;
        }, [rows, sortField, sortOrder]);

        // ---------- Filtre ----------
        const filteredRows = useMemo(function () {
            return sortedRows.filter(function (u) {
                var hay = ((u.nickname || "") + (u.email || "") + (u.target_type || "") + (u.education_level || "") + (u.user_id || "")).toLowerCase();
                if (q && hay.indexOf(q.toLowerCase()) < 0) return false;
                if (filter === "premium" && !u.premium) return false;
                if (filter === "lisans" && u.education_level !== "lisans") return false;
                if (filter === "onlisans" && u.education_level !== "onlisans") return false;
                if (filter === "ortaogretim" && u.education_level !== "ortaogretim") return false;
                if (filter === "idle7") {
                    if (!u.last_study_at) return true;
                    return (Date.now() - new Date(u.last_study_at).getTime()) > 7 * 86400000;
                }
                if (filter === "active") {
                    if (!u.last_study_at) return false;
                    return (Date.now() - new Date(u.last_study_at).getTime()) < 1 * 86400000;
                }
                return true;
            });
        }, [sortedRows, q, filter]);

        // ---------- Sayfalama ----------
        const paginatedRows = useMemo(function () {
            var start = (page - 1) * pageSize;
            var end = start + pageSize;
            return filteredRows.slice(start, end);
        }, [filteredRows, page]);

        const totalPages = useMemo(function () {
            return Math.ceil(filteredRows.length / pageSize);
        }, [filteredRows]);

        // ---------- İstatistikler ----------
        const summaryStats = useMemo(function () {
            var total = rows.length;
            var premium = rows.filter(function (u) { return u.premium; }).length;
            var active = rows.filter(function (u) {
                if (!u.last_study_at) return false;
                return (Date.now() - new Date(u.last_study_at).getTime()) < 1 * 86400000;
            }).length;
            var totalQ = rows.reduce(function (sum, u) { return sum + (u.questions_total || 0); }, 0);
            return { total, premium, active, totalQ, avgQ: total > 0 ? Math.round(totalQ / total) : 0 };
        }, [rows]);

        // ---------- Navigation ----------
        const nav = [
            { id: "ozet", t: "📊 Özet", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
            { id: "talepler", t: "📋 Talepler" + (eduReqs.length ? " (" + eduReqs.length + ")" : ""), icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { id: "kullanicilar", t: "👥 Kullanıcılar", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { id: "analiz", t: "📈 Analiz", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { id: "icerik", t: "📢 Duyuru", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" }
        ];

        // ---------- Yetki Kontrol ----------
        if (!isAdmin) {
            return (
                <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
                    <div className="text-center max-w-sm p-8 rounded-3xl glass card-hover">
                        <div className="text-6xl mb-4">🔒</div>
                        <h1 className="text-2xl font-black gradient-text mb-2">Yetki Yok</h1>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Bu hesap yönetici yetkisine sahip değil.</p>
                        <button onClick={props.onSignOut} className="px-6 py-3 rounded-2xl btn-primary text-white font-semibold">
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            );
        }

        // ============================================================
        // RENDER
        // ============================================================

        return (
            <div className="min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-50 flex">
                {/* ===== SIDEBAR (Desktop) ===== */}
                <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-lg">
                    <div className="px-5 py-6 border-b border-stone-200 dark:border-stone-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                KPSS
                            </div>
                            <div>
                                <p className="text-sm font-bold gradient-text">Yönetim Paneli</p>
                                <p className="text-[10px] text-stone-400 truncate max-w-[140px]">{email}</p>
                            </div>
                        </div>
                    </div>
                    <nav className="px-3 py-4 space-y-1 flex-1">
                        {nav.map(function (n) {
                            var active = tab === n.id;
                            return (
                                <button key={n.id} onClick={function () { setTab(n.id); setSidebarOpen(false); }}
                                    className={"w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 " +
                                        (active 
                                            ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 shadow-sm" 
                                            : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800")}>
                                    <span className="text-lg">{n.t.split(" ")[0]}</span>
                                    <span className="flex-1">{n.t.split(" ").slice(1).join(" ")}</span>
                                    {n.id === "talepler" && eduReqs.length > 0 && (
                                        <span className="h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                            {eduReqs.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t border-stone-200 dark:border-stone-800">
                        <button onClick={props.onSignOut} className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                            🚪 Çıkış
                        </button>
                    </div>
                </aside>

                {/* ===== MAIN CONTENT ===== */}
                <div className="flex-1 min-w-0">
                    {/* Mobile Header */}
                    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 sticky top-0 z-10">
                        <button onClick={function () { setSidebarOpen(!sidebarOpen); }} className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="font-bold gradient-text">Yönetim</span>
                        <button onClick={props.onSignOut} className="text-sm font-medium text-stone-500">Çıkış</button>
                    </header>

                    {/* Mobile Sidebar Overlay */}
                    {sidebarOpen && (
                        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={function () { setSidebarOpen(false); }}>
                            <div className="w-72 h-full bg-white dark:bg-stone-950 shadow-2xl p-4" onClick={function (e) { e.stopPropagation(); }}>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold gradient-text">Yönetim</span>
                                    <button onClick={function () { setSidebarOpen(false); }} className="p-2 rounded-xl hover:bg-stone-100">✕</button>
                                </div>
                                {nav.map(function (n) {
                                    var active = tab === n.id;
                                    return (
                                        <button key={n.id} onClick={function () { setTab(n.id); setSidebarOpen(false); }}
                                            className={"w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 " +
                                                (active ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700" : "hover:bg-stone-100 dark:hover:bg-stone-800")}>
                                            <span>{n.t}</span>
                                            {n.id === "talepler" && eduReqs.length > 0 && (
                                                <span className="ml-auto h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                    {eduReqs.length}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                                <button onClick={props.onSignOut} className="w-full mt-4 py-3 rounded-xl border border-stone-200 text-sm font-medium">Çıkış</button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Tabs */}
                    <div className="md:hidden flex gap-1 px-4 py-3 overflow-x-auto border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 sticky top-12 z-10">
                        {nav.map(function (n) {
                            return (
                                <button key={n.id} onClick={function () { setTab(n.id); }}
                                    className={"shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors " + 
                                        (tab === n.id ? "bg-indigo-600 text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400")}>
                                    {n.t}
                                    {n.id === "talepler" && eduReqs.length > 0 && (
                                        <span className="ml-1 text-[10px] bg-white/30 px-1 rounded">{eduReqs.length}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <main className="p-4 md:p-8 max-w-7xl mx-auto">
                        {/* Messages */}
                        {msg && (
                            <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm flex items-center justify-between">
                                <span>{msg}</span>
                                <button onClick={function () { setMsg(""); }} className="text-amber-600 hover:text-amber-800">✕</button>
                            </div>
                        )}

                        {/* Loading */}
                        {busy && (
                            <div className="mb-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm flex items-center gap-3">
                                <div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                                İşlem devam ediyor...
                            </div>
                        )}

                        {/* ===== ÖZET TAB ===== */}
                        {tab === "ozet" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl md:text-3xl font-black gradient-text">📊 Yönetim Özeti</h1>
                                    <button onClick={load} disabled={busy} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                        🔄 Yenile
                                    </button>
                                </div>

                                {/* KPI Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="rounded-2xl glass p-5 card-hover">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">👥 Toplam Kullanıcı</p>
                                        <p className="text-3xl font-bold gradient-text mt-2">{kpi ? kpi.users : "—"}</p>
                                        <p className="text-xs text-stone-400 mt-1">+{summaryStats.active} bugün aktif</p>
                                    </div>
                                    <div className="rounded-2xl glass p-5 card-hover">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">⭐ Premium</p>
                                        <p className="text-3xl font-bold text-amber-600 mt-2">{summaryStats.premium}</p>
                                        <p className="text-xs text-stone-400 mt-1">%{rows.length ? Math.round((summaryStats.premium / rows.length) * 100) : 0} dönüşüm</p>
                                    </div>
                                    <div className="rounded-2xl glass p-5 card-hover">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">📝 Toplam Soru</p>
                                        <p className="text-3xl font-bold text-emerald-600 mt-2">{summaryStats.totalQ}</p>
                                        <p className="text-xs text-stone-400 mt-1">Ø {summaryStats.avgQ} / kullanıcı</p>
                                    </div>
                                    <div className="rounded-2xl glass p-5 card-hover">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">📈 Tahmini Ciro</p>
                                        <p className="text-3xl font-bold text-indigo-600 mt-2">{summaryStats.premium * 149} ₺</p>
                                        <p className="text-xs text-stone-400 mt-1">149 ₺ / ay · gerçek ödeme yok</p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/20 p-4 text-center border border-rose-100 dark:border-rose-800/30">
                                        <div className="text-2xl font-bold text-rose-600">{rows.filter(function(u) { return !u.last_study_at || (Date.now() - new Date(u.last_study_at).getTime()) > 7 * 86400000; }).length}</div>
                                        <div className="text-xs text-rose-500 mt-0.5">🔴 Pasif (7+ gün)</div>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 p-4 text-center border border-emerald-100 dark:border-emerald-800/30">
                                        <div className="text-2xl font-bold text-emerald-600">{summaryStats.active}</div>
                                        <div className="text-xs text-emerald-500 mt-0.5">🟢 Bugün Aktif</div>
                                    </div>
                                    <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 p-4 text-center border border-amber-100 dark:border-amber-800/30">
                                        <div className="text-2xl font-bold text-amber-600">{eduReqs.length}</div>
                                        <div className="text-xs text-amber-500 mt-0.5">📋 Bekleyen Talep</div>
                                    </div>
                                    <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 p-4 text-center border border-indigo-100 dark:border-indigo-800/30">
                                        <div className="text-2xl font-bold text-indigo-600">{hard.length}</div>
                                        <div className="text-xs text-indigo-500 mt-0.5">📊 Zor Konu</div>
                                    </div>
                                </div>

                                {/* Activity Log */}
                                {log.length > 0 && (
                                    <div className="rounded-2xl glass p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">📋 İşlem Geçmişi</p>
                                        <div className="space-y-1 max-h-48 overflow-y-auto">
                                            {log.map(function (x, i) {
                                                return (
                                                    <div key={i} className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 py-1 border-b border-stone-100 dark:border-stone-800">
                                                        <span className="font-mono text-stone-400">{x.at}</span>
                                                        <span className="font-medium text-stone-700 dark:text-stone-300">{x.t}</span>
                                                        {x.detail && <span className="text-stone-400">· {JSON.stringify(x.detail).slice(0, 40)}</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-stone-400 text-center">Öğrenci uygulaması bu hesapta açılmaz · v2.0</p>
                            </div>
                        )}

                        {/* ===== TALEPLER TAB ===== */}
                        {tab === "talepler" && (
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-black gradient-text">📋 Eğitim Değişiklik Talepleri</h1>
                                    <button type="button" disabled={busy} onClick={load} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline shrink-0">
                                        🔄 Yenile
                                    </button>
                                </div>
                                <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Öğrenci kayıtta seçtiği düzeyi kendi değiştiremez. Onaylarsan sınav tarihi de ÖSYM takvimine çekilir.</p>
                                
                                {eduReqs.length === 0 ? (
                                    <div className="rounded-2xl glass p-12 text-center">
                                        <div className="text-4xl mb-3">✅</div>
                                        <p className="text-sm text-stone-400">Bekleyen talep yok.</p>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl glass overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-xs text-stone-400 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                                                        <th className="font-medium px-4 py-3">Kullanıcı</th>
                                                        <th className="font-medium px-4 py-3">Şu an</th>
                                                        <th className="font-medium px-4 py-3">İstenen</th>
                                                        <th className="font-medium px-4 py-3">Tarih</th>
                                                        <th className="font-medium px-4 py-3 text-right">İşlem</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {eduReqs.map(function (r) {
                                                        return (
                                                            <tr key={r.user_id} className="border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                                                                <td className="px-4 py-3">
                                                                    <div className="font-medium">{r.nickname || "—"}</div>
                                                                    <div className="text-xs text-stone-400 font-mono">{(r.user_id || "").slice(0, 8)}…</div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={"text-xs font-medium px-2 py-0.5 rounded-full " + getLevelColor(r.from)}>
                                                                        {eduLabel(r.from)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={"text-xs font-medium px-2 py-0.5 rounded-full " + getLevelColor(r.to)}>
                                                                        {eduLabel(r.to)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-stone-500 text-xs">{fmtDateTime(r.at)}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex gap-2 justify-end">
                                                                        <button disabled={busy} onClick={function () { act("approve_edu", { user_id: r.user_id, to: r.to }); }}
                                                                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm">
                                                                            ✅ Onayla
                                                                        </button>
                                                                        <button disabled={busy} onClick={function () { act("reject_edu", { user_id: r.user_id }); }}
                                                                            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                                                                            ❌ Reddet
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== KULLANICILAR TAB ===== */}
                        {tab === "kullanicilar" && (
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <h1 className="text-2xl md:text-3xl font-black gradient-text">👥 Kullanıcılar</h1>
                                    <span className="text-sm text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
                                        {filteredRows.length} kayıt
                                    </span>
                                </div>

                                {/* Search & Filters */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                    <div className="flex-1 relative">
                                        <input 
                                            ref={searchInputRef}
                                            value={q} 
                                            onChange={function (e) { setQ(e.target.value); setPage(1); }} 
                                            placeholder="🔍 Ara: ad, kulvar, eğitim, email…"
                                            className="w-full px-4 py-3 pl-10 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { id: "all", t: "Tümü" },
                                            { id: "premium", t: "⭐ Premium" },
                                            { id: "lisans", t: "🎓 Lisans" },
                                            { id: "onlisans", t: "🎓 Ön Lisans" },
                                            { id: "ortaogretim", t: "🏫 Ortaöğretim" },
                                            { id: "active", t: "🟢 Bugün Aktif" },
                                            { id: "idle7", t: "🔴 Pasif 7+" }
                                        ].map(function (f) {
                                            var active = filter === f.id;
                                            return (
                                                <button key={f.id} onClick={function () { setFilter(f.id); setPage(1); }}
                                                    className={"shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + 
                                                        (active 
                                                            ? "bg-indigo-600 text-white shadow-sm" 
                                                            : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700")}>
                                                    {f.t}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="rounded-2xl glass overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-xs text-stone-400 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                                                    <th className="font-medium px-4 py-3 cursor-pointer hover:text-stone-700" onClick={function () { setSortField("nickname"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                                                        Kullanıcı {sortField === "nickname" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th className="font-medium px-4 py-3 cursor-pointer hover:text-stone-700" onClick={function () { setSortField("education_level"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                                                        Eğitim {sortField === "education_level" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th className="font-medium px-4 py-3 cursor-pointer hover:text-stone-700" onClick={function () { setSortField("target_type"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                                                        Kulvar {sortField === "target_type" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th className="font-medium px-4 py-3 cursor-pointer hover:text-stone-700" onClick={function () { setSortField("questions_total"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                                                        Soru {sortField === "questions_total" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th className="font-medium px-4 py-3 cursor-pointer hover:text-stone-700" onClick={function () { setSortField("last_study_at"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                                                        Son Çalışma {sortField === "last_study_at" && (sortOrder === "asc" ? "↑" : "↓")}
                                                    </th>
                                                    <th className="font-medium px-4 py-3">Plan</th>
                                                    <th className="font-medium px-4 py-3 text-right">İşlem</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedRows.length === 0 ? (
                                                    <tr><td colSpan={7} className="px-4 py-12 text-center text-stone-400">Kayıt yok veya liste yetkisi eksik.</td></tr>
                                                ) : paginatedRows.map(function (u) {
                                                    var status = getStatusBadge(u.last_study_at);
                                                    return (
                                                        <tr key={u.user_id || u.nickname} className={"border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors " + (status.label.includes("pasif") ? "bg-rose-50/30 dark:bg-rose-950/10" : "")}>
                                                            <td className="px-4 py-3">
                                                                <div className="font-medium">{u.nickname || "—"}</div>
                                                                <div className="text-xs text-stone-400 font-mono">{u.email || (u.user_id || "").slice(0, 12)}</div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={"text-[10px] font-medium px-2 py-0.5 rounded-full " + getLevelColor(u.education_level)}>
                                                                    {eduLabel(u.education_level)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-stone-600 dark:text-stone-400">{trackLabel(u.target_type)}</td>
                                                            <td className="px-4 py-3 font-semibold">{u.questions_total || 0}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="text-xs">{fmtDate(u.last_study_at)}</div>
                                                                <div className="text-[10px] text-stone-400">{status.label}</div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (u.premium ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400")}>
                                                                    {u.premium ? "⭐ Premium" : "Ücretsiz"}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex flex-wrap gap-1 justify-end">
                                                                    <button disabled={busy} onClick={function () {
                                                                        if (!confirm("Bu kullanıcıya 30 gün Premium verilsin mi?")) return;
                                                                        act("grant_premium", { user_id: u.user_id, days: 30 });
                                                                    }} className="text-[10px] font-medium px-2 py-1 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200 transition-colors">
                                                                        +30g ⭐
                                                                    </button>
                                                                    <button disabled={busy} onClick={function () { inspect(u.user_id); }} className="text-[10px] font-medium px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 transition-colors">
                                                                        Detay
                                                                    </button>
                                                                    <button disabled={busy} onClick={function () { if (confirm("Bu kullanıcı engellensin mi?")) act("block", { user_id: u.user_id }); }} className="text-[10px] font-medium px-2 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 hover:bg-rose-200 transition-colors">
                                                                        🚫
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between gap-4 mt-4">
                                        <div className="text-xs text-stone-400">
                                            {((page - 1) * pageSize + 1)} - {Math.min(page * pageSize, filteredRows.length)} / {filteredRows.length}
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={function () { setPage(Math.max(1, page - 1)); }} disabled={page === 1}
                                                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                                                ←
                                            </button>
                                            {Array.from({ length: Math.min(5, totalPages) }, function (_, i) {
                                                var p = i + 1;
                                                return (
                                                    <button key={p} onClick={function () { setPage(p); }}
                                                        className={"px-3 py-1.5 rounded-lg text-sm font-medium transition-colors " + 
                                                            (page === p ? "bg-indigo-600 text-white" : "border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800")}>
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                            <button onClick={function () { setPage(Math.min(totalPages, page + 1)); }} disabled={page === totalPages}
                                                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                                                →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Detail Panel */}
                                {detail && (
                                    <div className="mt-4 rounded-2xl glass p-5 border-l-4 border-l-indigo-500 slide-up">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg">{detail.nickname || "—"}</p>
                                                <p className="text-sm text-stone-500">{detail.email || detail.user_id}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-xs bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">📝 {detail.questions_total || (detail.counters && detail.counters.questions) || 0} soru</span>
                                                    <span className="text-xs bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">❌ {detail.wrongCount || 0} yanlış</span>
                                                    <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">🎯 {detail.target_type || "—"}</span>
                                                    <span className="text-xs bg-stone-50 dark:bg-stone-800 px-2 py-0.5 rounded-full">📱 {detail.platform || "web"}</span>
                                                </div>
                                            </div>
                                            <button onClick={function () { setDetail(null); }} className="text-stone-400 hover:text-stone-600">✕</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== ANALİZ TAB ===== */}
                        {tab === "analiz" && (
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black gradient-text mb-6">📈 Zor Konular</h1>
                                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">Türkiye genelinde yanlış ağırlığı en yüksek 10 konu.</p>
                                
                                {hard.length === 0 ? (
                                    <div className="rounded-2xl glass p-12 text-center">
                                        <div className="text-4xl mb-3">📊</div>
                                        <p className="text-sm text-stone-400">Henüz yeterli veri yok veya admin_hard_topics SQL’i çalıştırılmadı.</p>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl glass divide-y divide-stone-100 dark:divide-stone-800">
                                        {hard.map(function (h, i) {
                                            var colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", "#0ea5e9"];
                                            return (
                                                <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs font-bold text-stone-400 w-6">{i + 1}</span>
                                                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: colors[i % colors.length] }}>
                                                            {h.ders ? h.ders[0] : "?"}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{h.konu || "—"}</div>
                                                            <div className="text-xs text-stone-400">{h.ders || "—"}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-rose-600">{h.wrong_weight || 0}</div>
                                                        <div className="text-[10px] text-stone-400">{h.users || 0} kullanıcı</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Ekstra Analiz Kartları */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <div className="rounded-2xl glass p-5">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">📚 Toplam Konu</p>
                                        <p className="text-2xl font-bold gradient-text mt-1">{hard.length}</p>
                                        <p className="text-xs text-stone-400 mt-1">En çok yanlış yapılan konular</p>
                                    </div>
                                    <div className="rounded-2xl glass p-5">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">🎯 En Zor Ders</p>
                                        <p className="text-2xl font-bold text-rose-600 mt-1">
                                            {hard.length > 0 ? hard.reduce(function(a, b) { return (a.wrong_weight || 0) > (b.wrong_weight || 0) ? a : b; }).ders || "—" : "—"}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-1">En yüksek yanlış ağırlığı</p>
                                    </div>
                                    <div className="rounded-2xl glass p-5">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">👥 Etkilenen Kullanıcı</p>
                                        <p className="text-2xl font-bold text-indigo-600 mt-1">
                                            {hard.reduce(function(sum, h) { return sum + (h.users || 0); }, 0)}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-1">Toplam zor konu gören</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== İÇERİK / DUYURU TAB ===== */}
                        {tab === "icerik" && (
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black gradient-text mb-6">📢 Duyuru</h1>
                                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">Öğrencilerin "Bugün" ekranında göreceği duyuruyu yayınla.</p>
                                
                                <div className="rounded-2xl glass p-6">
                                    <textarea 
                                        ref={announceRef}
                                        value={announce} 
                                        onChange={function (e) { setAnnounce(e.target.value); }} 
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                        placeholder="📝 Duyuru metnini yaz... Örn: 'Yarın 14:00'de canlı deneme var!'"
                                    />
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-stone-400">{announce.length} karakter</span>
                                        <button 
                                            disabled={busy || !announce.trim()} 
                                            onClick={function () { 
                                                act("announce", { text: announce }); 
                                                setAnnounce(""); 
                                                if (announceRef.current) announceRef.current.focus();
                                            }}
                                            className="px-6 py-2.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all">
                                            {busy ? "⏳ Yayınlanıyor..." : "📢 Yayınla"}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl glass p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800/30">
                                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">💡 İpucu</p>
                                    <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                                        <li>• Duyuru tüm kullanıcılara gönderilir</li>
                                        <li>• "Bugün" ekranının üst kısmında görünür</li>
                                        <li>• HTML etiketleri desteklenir (bold, link, vs.)</li>
                                        <li>• Önceki duyurular otomatik olarak güncellenir</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AdminDashboard = AdminDashboard;

})();