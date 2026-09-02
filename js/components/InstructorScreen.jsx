(function () {
    const { useEffect, useState } = React;
    function InstructorScreen(props) {
        const [group, setGroup] = useState({ students: [], ready: false, badge: "Yakında", name: "Sınıfım" });
        useEffect(function () {
            if (!window.InstructorDashboard) return;
            window.InstructorDashboard.fetchGroup().then(function (g) { setGroup(g || {}); });
        }, []);
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-10 bg-stone-50 dark:bg-stone-900 rounded-2xl">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Kurum</h1>
                    <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <p className="text-sm text-stone-500 mb-4">{group.name || "Sınıfım"}</p>
                {!group.ready ? (
                    <div className="p-4 rounded-2xl bg-stone-100 text-sm text-stone-500">
                        Grup tablosu boş. GY-GK akışı etkilenmez.
                    </div>
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
