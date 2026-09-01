(function () {
    const { useEffect, useState } = React;
    function LeaderboardScreen(props) {
        const [week, setWeek] = useState([]);
        const [exams, setExams] = useState([]);
        const [err, setErr] = useState("");
        useEffect(function () {
            var sb = window.SupabaseClient && window.SupabaseClient.get();
            if (!sb) { setErr("Çevrimdışı veya henüz bağlı değil. Tablo görünümü public aggregate."); return; }
            var ws = window.SyncEngine && window.SyncEngine.weekStart();
            sb.from("leaderboard_public").select("nickname,questions,kind").limit(50).then(function (res) {
                if (res.error) {
                    sb.from("leaderboard_weekly").select("nickname,questions").eq("week_start", ws).order("questions", { ascending: false }).limit(20)
                        .then(function (r2) {
                            if (r2.error) setErr("Liderlik tablosu henüz yok (SQL şemasını çalıştır).");
                            else setWeek(r2.data || []);
                        });
                } else {
                    var rows = res.data || [];
                    setWeek(rows.filter(function (x) { return x.kind !== "exam"; }));
                    setExams(rows.filter(function (x) { return x.kind === "exam"; }));
                }
            });
        }, []);
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
                <div className="flex justify-between mb-4">
                    <h1 className="text-3xl font-black">Türkiye</h1>
                    <button onClick={props.onBack} className="font-bold text-sm">Kapat</button>
                </div>
                <p className="text-sm text-slate-500 mb-4">Sadece takma ad. E-posta asla listelenmez.</p>
                {err ? <div className="p-4 rounded-2xl bg-amber-50 text-amber-800 text-sm mb-4">{err}</div> : null}
                <h2 className="font-black mb-2">Haftanın soru avcıları</h2>
                <div className="space-y-2 mb-6">
                    {(week.length ? week : [{ nickname: "henüz yok", questions: 0 }]).map(function (r, i) {
                        return (
                            <div key={i} className="flex justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border">
                                <span className="font-bold">{i + 1}. {r.nickname}</span>
                                <span>{r.questions} soru</span>
                            </div>
                        );
                    })}
                </div>
                <h2 className="font-black mb-2">Deneme sıralaması</h2>
                <div className="space-y-2">
                    {(exams.length ? exams : [{ nickname: "Yakında", questions: 0 }]).map(function (r, i) {
                        return (
                            <div key={i} className="flex justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border">
                                <span className="font-bold">{r.nickname}</span>
                                <span>{r.score || r.questions}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LeaderboardScreen = LeaderboardScreen;
})();
