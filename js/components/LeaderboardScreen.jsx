(function () {
    const { useEffect, useState } = React;
    function initials(n) {
        n = String(n || "?").trim();
        return (n.slice(0, 1) || "?").toUpperCase();
    }
    function LeaderboardScreen(props) {
        const [week, setWeek] = useState([]);
        const [exams, setExams] = useState([]);
        const [tab, setTab] = useState("week");
        const [err, setErr] = useState("");
        const me = (props.student && props.student.userProfile && props.student.userProfile.nickname) || "";
        useEffect(function () {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { setErr("Çevrimdışı. Sıralama bağlanınca açılır."); return; }
            var ws = window.SyncEngine && window.SyncEngine.weekStart();
            sb.from("leaderboard_public").select("nickname,questions,kind").limit(50).then(function (res) {
                if (res.error) {
                    sb.from("leaderboard_weekly").select("nickname,questions").eq("week_start", ws).order("questions", { ascending: false }).limit(20)
                        .then(function (r2) {
                            if (r2.error) setErr("Liderlik tablosu henüz yok.");
                            else setWeek(r2.data || []);
                        });
                } else {
                    var rows = res.data || [];
                    setWeek(rows.filter(function (x) { return x.kind !== "exam"; }));
                    setExams(rows.filter(function (x) { return x.kind === "exam"; }));
                }
            });
        }, []);
        var list = tab === "week" ? week : exams;
        var myIdx = -1;
        list.forEach(function (r, i) {
            if (me && r.nickname === me) myIdx = i;
        });
        var top = list.slice(0, 3);
        var rest = list.slice(3);
        var medal = ["#C9A227", "#D3D0CB", "#B45F04"];
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-24 relative">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-display font-bold">Türkiye</h1>
                    <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <p className="text-sm text-zinc-500 mb-4">Bu hafta kim daha çok soru çözdü, denemede kim önde. Takma ad görünür, e-posta görünmez.</p>
                <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-slate-800 mb-6">
                    <button type="button" onClick={function () { setTab("week"); }} className={"flex-1 py-2 rounded-lg text-sm font-semibold " + (tab === "week" ? "bg-white dark:bg-slate-900 shadow-sm" : "text-zinc-500")}>Haftalık</button>
                    <button type="button" onClick={function () { setTab("exam"); }} className={"flex-1 py-2 rounded-lg text-sm font-semibold " + (tab === "exam" ? "bg-white dark:bg-slate-900 shadow-sm" : "text-zinc-500")}>Deneme</button>
                </div>
                {err ? <div className="p-3 rounded-xl text-sm text-coral-500 mb-4">{err}</div> : null}
                {top.length >= 1 ? (
                    <div className="flex items-end justify-center gap-3 mb-6">
                        {top[1] ? (
                            <div className="flex-1 text-center">
                                <div className="mx-auto h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-stat" style={{ background: medal[1] }}>{initials(top[1].nickname)}</div>
                                <p className="text-xs mt-1 truncate">{top[1].nickname}</p>
                                <p className="font-stat text-sm">{top[1].questions}</p>
                            </div>
                        ) : <div className="flex-1" />}
                        <div className="flex-1 text-center">
                            <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-stat" style={{ background: medal[0] }}>{initials(top[0].nickname)}</div>
                            <p className="text-xs mt-1 truncate font-medium">{top[0].nickname}</p>
                            <p className="font-stat">{top[0].questions}</p>
                        </div>
                        {top[2] ? (
                            <div className="flex-1 text-center">
                                <div className="mx-auto h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-stat" style={{ background: medal[2] }}>{initials(top[2].nickname)}</div>
                                <p className="text-xs mt-1 truncate">{top[2].nickname}</p>
                                <p className="font-stat text-sm">{top[2].questions}</p>
                            </div>
                        ) : <div className="flex-1" />}
                    </div>
                ) : null}
                <div className="space-y-0 border-t border-zinc-200 dark:border-slate-800 mb-16">
                    {(rest.length ? rest : (top.length ? [] : [{ nickname: "henüz yok", questions: 0 }])).map(function (r, i) {
                        var rank = i + 4;
                        return (
                            <div key={rank} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-slate-800">
                                <span className="text-sm"><span className="font-stat text-zinc-400 w-8 inline-block">{rank}</span> {r.nickname}</span>
                                <span className="font-stat text-sm">{r.score || r.questions}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-navy-600 text-white flex justify-between text-sm">
                    <span>Senin sıran</span>
                    <span className="font-stat">{myIdx >= 0 ? (myIdx + 1) + ". · " + (list[myIdx].questions || 0) : "listede değil"}</span>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LeaderboardScreen = LeaderboardScreen;
})();
