(function () {
    const { useEffect, useState, useMemo } = React;

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function initials(n) {
        n = String(n || "?").trim();
        if (n.includes(" ")) {
            var parts = n.split(" ");
            return (parts[0]?.[0] || "?").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
        }
        return (n.slice(0, 1) || "?").toUpperCase();
    }

    function getMedalColor(rank) {
        if (rank === 0) return { bg: "from-amber-400 to-amber-600", text: "text-amber-500", shadow: "shadow-amber-500/30" };
        if (rank === 1) return { bg: "from-stone-300 to-stone-400", text: "text-stone-400", shadow: "shadow-stone-400/30" };
        if (rank === 2) return { bg: "from-orange-400 to-orange-600", text: "text-orange-500", shadow: "shadow-orange-500/30" };
        return { bg: "from-indigo-500 to-purple-500", text: "text-indigo-400", shadow: "shadow-indigo-500/20" };
    }

    function getMedalEmoji(rank) {
        if (rank === 0) return "🥇";
        if (rank === 1) return "🥈";
        if (rank === 2) return "🥉";
        return "🏅";
    }

    function getRankEmoji(rank) {
        if (rank === 0) return "👑";
        if (rank === 1) return "⭐";
        if (rank === 2) return "🌟";
        return "";
    }

    function getScoreColor(rank) {
        if (rank === 0) return "text-amber-500";
        if (rank === 1) return "text-stone-400";
        if (rank === 2) return "text-orange-500";
        return "text-indigo-400";
    }

    function formatNumber(num) {
        if (num >= 1000) return (num / 1000).toFixed(1) + "k";
        return num;
    }

    function getLevelBadge(rank) {
        if (rank === 0) return { label: "🏆 Şampiyon", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" };
        if (rank === 1) return { label: "🥈 İkinci", color: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300" };
        if (rank === 2) return { label: "🥉 Üçüncü", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" };
        return null;
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function LeaderboardScreen(props) {
        const [week, setWeek] = useState([]);
        const [exams, setExams] = useState([]);
        const [tab, setTab] = useState("week");
        const [err, setErr] = useState("");
        const [loading, setLoading] = useState(true);
        const [myRank, setMyRank] = useState(null);
        const [expanded, setExpanded] = useState(false);

        const me = (props.student && props.student.userProfile && props.student.userProfile.nickname) || "";
        const meInitials = initials(me);

        // ---------- Fetch ----------
        useEffect(function () {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { 
                setErr("📡 Çevrimdışı. Sıralama bağlanınca açılır."); 
                setLoading(false);
                return; 
            }

            var ws = window.SyncEngine && window.SyncEngine.weekStart();
            
            // Leaderboard_public den dene
            sb.from("leaderboard_public").select("nickname,questions,kind").limit(100).then(function (res) {
                if (res.error) {
                    // Fallback: leaderboard_weekly
                    sb.from("leaderboard_weekly").select("nickname,questions").eq("week_start", ws).order("questions", { ascending: false }).limit(50)
                        .then(function (r2) {
                            if (r2.error) {
                                setErr("📊 Liderlik tablosu henüz oluşturulmamış.");
                                setLoading(false);
                            } else {
                                var data = r2.data || [];
                                setWeek(data.filter(function (x) { return x.kind !== "exam"; }));
                                setExams(data.filter(function (x) { return x.kind === "exam"; }));
                                setLoading(false);
                            }
                        });
                } else {
                    var rows = res.data || [];
                    setWeek(rows.filter(function (x) { return x.kind !== "exam"; }));
                    setExams(rows.filter(function (x) { return x.kind === "exam"; }));
                    setLoading(false);
                }
            });
        }, []);

        // ---------- List ----------
        var list = tab === "week" ? week : exams;
        
        // ---------- Me Index ----------
        var myIdx = -1;
        list.forEach(function (r, i) {
            if (me && r.nickname === me) myIdx = i;
        });

        // ---------- Top 3 ----------
        var top = list.slice(0, 3);
        var rest = list.slice(3);

        // ---------- My Rank ----------
        var myRankData = myIdx >= 0 ? {
            rank: myIdx + 1,
            score: list[myIdx].questions || 0,
            nickname: list[myIdx].nickname
        } : null;

        // ---------- Total Participants ----------
        var totalParticipants = list.length;

        // ---------- Medal Colors ----------
        var medalColors = [
            { bg: "from-amber-400 to-amber-600", text: "text-amber-500", shadow: "shadow-amber-500/30", emoji: "🥇" },
            { bg: "from-stone-300 to-stone-400", text: "text-stone-400", shadow: "shadow-stone-400/30", emoji: "🥈" },
            { bg: "from-orange-400 to-orange-600", text: "text-orange-500", shadow: "shadow-orange-500/30", emoji: "🥉" }
        ];

        // ============================================================
        // RENDER
        // ============================================================

        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-24 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 slide-up">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black gradient-text">🏆 Türkiye</h1>
                        <p className="text-sm text-stone-400 mt-0.5">Bu haftanın en çalışkanları</p>
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
                    📊 Takma ad görünür, e-posta gizlidir · Her hafta sıfırlanır
                </p>

                {/* Tab Toggle */}
                <div className="flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 mb-6">
                    <button 
                        type="button" 
                        onClick={function () { setTab("week"); }}
                        className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " +
                            (tab === "week" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")
                        }
                    >
                        📝 Haftalık Soru
                    </button>
                    <button 
                        type="button" 
                        onClick={function () { setTab("exam"); }}
                        className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " +
                            (tab === "exam" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")
                        }
                    >
                        📋 Deneme
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="text-sm text-stone-400 mt-3">Liderlik tablosu yükleniyor...</p>
                    </div>
                )}

                {/* Error */}
                {err && !loading && (
                    <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 p-4 text-sm text-rose-700 dark:text-rose-300 mb-5">
                        <span className="text-lg mr-2">⚠️</span>
                        {err}
                    </div>
                )}

                {/* Empty State */}
                {!loading && list.length === 0 && !err && (
                    <div className="rounded-3xl glass p-12 text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-lg font-bold text-stone-600 dark:text-stone-300 mb-2">Henüz Veri Yok</h3>
                        <p className="text-sm text-stone-400 max-w-sm mx-auto">
                            Bu hafta henüz kimse sıralamaya girmemiş. 
                            İlk sen olmak ister misin?
                        </p>
                    </div>
                )}

                {/* ===== TOP 3 PODIUM ===== */}
                {!loading && list.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-end justify-center gap-4">
                            {/* 2nd */}
                            {top[1] ? (
                                <div className="flex-1 text-center slide-up" style={{ animationDelay: "0.1s" }}>
                                    <div className="relative">
                                        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center text-2xl text-white shadow-lg shadow-stone-400/30 ring-4 ring-white dark:ring-stone-800">
                                            {initials(top[1].nickname)}
                                        </div>
                                        <div className="absolute -top-1 -right-1 text-2xl">🥈</div>
                                    </div>
                                    <p className="text-xs font-medium mt-2 truncate max-w-[80px] mx-auto">{top[1].nickname}</p>
                                    <div className="font-stat text-lg font-bold text-stone-400">{formatNumber(top[1].questions)}</div>
                                    <div className="h-1 w-full rounded-full bg-stone-300 dark:bg-stone-700 mt-1" />
                                </div>
                            ) : (
                                <div className="flex-1" />
                            )}

                            {/* 1st */}
                            {top[0] && (
                                <div className="flex-1 text-center slide-up" style={{ animationDelay: "0.2s" }}>
                                    <div className="relative">
                                        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl text-white shadow-2xl shadow-amber-500/30 ring-4 ring-white dark:ring-stone-800">
                                            {initials(top[0].nickname)}
                                        </div>
                                        <div className="absolute -top-2 -right-1 text-3xl">👑</div>
                                    </div>
                                    <p className="text-xs font-bold mt-2 truncate max-w-[80px] mx-auto">{top[0].nickname}</p>
                                    <div className="font-stat text-2xl font-bold text-amber-500">{formatNumber(top[0].questions)}</div>
                                    <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mt-1 shadow-sm shadow-amber-500/30" />
                                </div>
                            )}

                            {/* 3rd */}
                            {top[2] ? (
                                <div className="flex-1 text-center slide-up" style={{ animationDelay: "0.3s" }}>
                                    <div className="relative">
                                        <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl text-white shadow-lg shadow-orange-500/30 ring-4 ring-white dark:ring-stone-800">
                                            {initials(top[2].nickname)}
                                        </div>
                                        <div className="absolute -top-1 -right-1 text-xl">🥉</div>
                                    </div>
                                    <p className="text-xs font-medium mt-2 truncate max-w-[80px] mx-auto">{top[2].nickname}</p>
                                    <div className="font-stat text-lg font-bold text-orange-500">{formatNumber(top[2].questions)}</div>
                                    <div className="h-1 w-full rounded-full bg-orange-300 dark:bg-orange-700 mt-1" />
                                </div>
                            ) : (
                                <div className="flex-1" />
                            )}
                        </div>

                        {/* Participants Count */}
                        <p className="text-center text-xs text-stone-400 mt-4">
                            👥 {totalParticipants} katılımcı
                        </p>
                    </div>
                )}

                {/* ===== REST LIST ===== */}
                {!loading && list.length > 0 && (
                    <div className="rounded-3xl glass overflow-hidden">
                        <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700 flex justify-between text-xs font-medium text-stone-400 uppercase tracking-wider">
                            <span>Sıralama</span>
                            <span>{tab === "week" ? "Soru" : "Puan"}</span>
                        </div>
                        <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-96 overflow-y-auto">
                            {(rest.length ? rest : []).map(function (r, i) {
                                var rank = i + 4;
                                var isMe = me && r.nickname === me;
                                var medalEmoji = getMedalEmoji(rank - 1);
                                var rankEmoji = getRankEmoji(rank - 1);
                                
                                return (
                                    <div 
                                        key={rank} 
                                        className={"flex items-center justify-between px-4 py-3 transition-colors " +
                                            (isMe 
                                                ? "bg-indigo-50 dark:bg-indigo-950/20 border-l-4 border-l-indigo-500" 
                                                : "hover:bg-stone-50 dark:hover:bg-stone-800/30")
                                        }
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="font-stat text-sm text-stone-400 w-8 text-right">
                                                {rank}
                                            </span>
                                            {rank <= 10 && (
                                                <span className="text-sm">{medalEmoji}</span>
                                            )}
                                            <span className={"text-sm truncate flex-1 " + (isMe ? "font-semibold text-indigo-700 dark:text-indigo-300" : "")}>
                                                {r.nickname}
                                                {isMe && <span className="ml-2 text-[10px] font-medium text-indigo-500">(Sen)</span>}
                                            </span>
                                            {rank <= 3 && rankEmoji && (
                                                <span className="text-xs">{rankEmoji}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={"font-stat text-sm font-bold " + (rank <= 3 ? getScoreColor(rank - 1) : "")}>
                                                {r.questions || r.score || 0}
                                            </span>
                                            {rank <= 3 && (
                                                <span className="text-xs opacity-50">🏅</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ===== MY RANK (Sticky Bottom) ===== */}
                {!loading && list.length > 0 && myIdx >= 0 && (
                    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 shadow-lg">
                        <div className="max-w-2xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {meInitials || "?"}
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400">Senin Sıran</p>
                                    <p className="font-bold text-sm">{myRankData.rank}. {me || "Sen"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-stone-400">Puan</p>
                                <p className="font-stat text-xl font-bold text-indigo-600">{myRankData.score}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== MY RANK (Not in list) ===== */}
                {!loading && list.length > 0 && myIdx < 0 && me && (
                    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 shadow-lg">
                        <div className="max-w-2xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500 font-bold text-sm">
                                    {meInitials || "?"}
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400">Senin Durumun</p>
                                    <p className="font-bold text-sm text-stone-500">Listede değilsin</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-stone-400">Bu hafta</p>
                                <p className="font-stat text-sm text-stone-400">0 soru</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Padding for Sticky */}
                <div style={{ height: "80px" }} />
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LeaderboardScreen = LeaderboardScreen;

})();