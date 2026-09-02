(function () {
    const { useEffect, useState } = React;
    function InstructorScreen(props) {
        const [group, setGroup] = useState({ students: [], ready: false, name: "Sınıfım" });
        const [copied, setCopied] = useState(false);
        const st = props.student || {};
        const up = st.userProfile || {};
        const code = (window.StudentStore && window.StudentStore.ensureReferralCode) ? window.StudentStore.ensureReferralCode() : (up.referralCode || "");
        var totQ = (st.counters && st.counters.questions) || 0;
        var streak = (st.streak && st.streak.count) || 0;
        useEffect(function () {
            if (!window.InstructorDashboard) return;
            window.InstructorDashboard.fetchGroup().then(function (g) { setGroup(g || {}); });
        }, []);
        return (
            <div className="max-w-2xl mx-auto pb-10">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Kurum</h1>
                    <button type="button" onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <div className="p-4 rounded-2xl bg-navy-600 text-white mb-4">
                    <p className="text-sm opacity-80">{up.nickname || (st.profile && st.profile.name) || "Öğrenci"}</p>
                    <p className="font-stat text-3xl mt-1">{totQ} soru</p>
                    <p className="text-sm mt-1">{streak} gün seri</p>
                </div>
                <div className="p-4 rounded-2xl panel mb-4">
                    <p className="text-sm font-medium mb-1">Davet kodun</p>
                    <p className="text-xs text-stone-500 mb-3">Arkadaşın kayıtta bunu yazınca senin grubuna bağlanır (sıralamada görünür).</p>
                    <div className="flex gap-2">
                        <code className="flex-1 px-3 py-2 rounded-xl bg-stone-100 text-sm">{code || "—"}</code>
                        <button type="button" className="px-3 py-2 rounded-xl bg-navy-600 text-white text-sm" onClick={function () {
                            if (code && navigator.clipboard) navigator.clipboard.writeText(code);
                            setCopied(true);
                        }}>{copied ? "Kopyalandı" : "Kopyala"}</button>
                    </div>
                </div>
                <button type="button" onClick={function () { props.onOpen && props.onOpen("leaderboard"); }}
                    className="w-full mb-4 p-4 rounded-2xl panel text-left font-medium">Türkiye sıralamasını aç</button>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Grup</p>
                {!group.ready ? (
                    <p className="text-sm text-stone-500">Kurum listesi henüz boş. Kendi özetin ve davet kodun çalışır.</p>
                ) : (
                    <div className="space-y-2">
                        {(group.members || group.students || []).map(function (s, i) {
                            var sc = s.masteryScore != null ? s.masteryScore : 0;
                            var bar = sc < 50 ? "bg-coral-500" : sc < 75 ? "bg-amber-500" : "bg-emerald-500";
                            return (
                                <div key={i} className="p-3 rounded-xl bg-white border border-stone-300 text-sm">
                                    <div className="flex justify-between">
                                        <span>{s.nickname || "öğrenci"}</span>
                                        <span className="text-stone-500 font-stat">{s.questions_total || 0}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                        <div className={"h-full " + bar} style={{ width: Math.min(100, sc) + "%" }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.InstructorScreen = InstructorScreen;
})();
