function InstructorDashboardScreen(props) {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        InstructorDashboard.fetchGroup().then(data => {
            setGroup(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Yükleniyor...</div>;
    if (!group || !group.ready) return <div>Henüz sınıf oluşturulmamış.</div>;

    const stats = InstructorDashboard.getClassStats(group);
    const leaders = InstructorDashboard.getLeaderboard(group, 5);
    const activity = InstructorDashboard.getWeeklyActivity(group);

    return (
        <div className="space-y-4">
            {/* Sınıf Başlığı */}
            <div className="rounded-3xl glass p-6">
                <h1 className="text-2xl font-black gradient-text">{group.name}</h1>
                <p className="text-sm text-stone-400">{stats.total} öğrenci · {stats.active} bugün aktif</p>
                {group.inviteCode && (
                    <p className="text-xs text-stone-400 mt-1">Davet Kodu: <span className="font-bold text-indigo-600">{group.inviteCode}</span></p>
                )}
            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl glass p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                    <div className="text-xs text-stone-400">Öğrenci</div>
                </div>
                <div className="rounded-2xl glass p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
                    <div className="text-xs text-stone-400">Bugün Aktif</div>
                </div>
                <div className="rounded-2xl glass p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600">{stats.avgQuestions}</div>
                    <div className="text-xs text-stone-400">Ort. Soru</div>
                </div>
                <div className="rounded-2xl glass p-4 text-center">
                    <div className="text-2xl font-bold text-rose-600">{stats.completionRate}%</div>
                    <div className="text-xs text-stone-400">Tamamlama</div>
                </div>
            </div>

            {/* Liderlik Tablosu */}
            <div className="rounded-3xl glass p-5">
                <h2 className="font-bold mb-3">🏆 Liderlik</h2>
                {leaders.map((l, i) => (
                    <div key={l.userId} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-700">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-stone-400 w-6">{l.rank}</span>
                            <span className="font-medium">{l.nickname}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-stone-400">{l.questions} soru</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                l.accuracy >= 80 ? 'bg-emerald-100 text-emerald-600' :
                                l.accuracy >= 60 ? 'bg-amber-100 text-amber-600' :
                                'bg-rose-100 text-rose-600'
                            }`}>%{l.accuracy}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}