(function () {
    const { useEffect, useState } = React;
    function InstructorScreen(props) {
        const [group, setGroup] = useState({ students: [], ready: false, badge: "Yakında", name: "Sınıfım" });
        useEffect(function () {
            if (!window.InstructorDashboard) return;
            window.InstructorDashboard.fetchGroup().then(function (g) { setGroup(g || {}); });
        }, []);
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Kurum</h1>
                    <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <p className="text-sm text-zinc-500 mb-4">{group.name || "Sınıfım"} · öğrenciler aynı hesap verisini web ve mobil ile paylaşır.</p>
                {!group.ready ? (
                    <div className="p-4 rounded-2xl panel text-sm text-zinc-500">
                        Grup tablosu boş. SQL’deki instructor_groups doldurulunca liste buraya gelir. GY-GK akışı etkilenmez.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {(group.members || group.students || []).map(function (s, i) {
                            return (
                                <div key={i} className="p-3 rounded-xl panel flex justify-between text-sm">
                                    <span>{s.nickname || "öğrenci"}</span>
                                    <span className="text-zinc-400">{s.questions_total || 0} soru</span>
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
