(function () {
    const { useState } = React;
    function OnboardingScreen(props) {
        const student = props.student;
        const dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
        const [name, setName] = useState(student.profile.name || "");
        const [level, setLevel] = useState((student.userProfile && student.userProfile.educationLevel) || "lisans");
        const [examDate, setExamDate] = useState(student.profile.examDate || dates[level] || "2026-09-06");
        const [kvkk, setKvkk] = useState(false);

        function pickLevel(lv) {
            setLevel(lv);
            if (dates[lv]) setExamDate(dates[lv]);
        }

        return (
            <div className="fixed inset-0 z-50 overlay-scrim flex items-end sm:items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-md overlay-sheet p-6 sm:p-8 fade-in my-6">
                    <h2 className="text-xl font-semibold tracking-tight mb-1">Kısa kurulum</h2>
                    <p className="text-sm text-zinc-500 mb-6">GY-GK ile başlıyorsun. Diğer kulvarlar sonra açılır.</p>

                    <label className="block text-sm text-zinc-500 mb-1.5" htmlFor="ob-name">Adın</label>
                    <input id="ob-name" value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Örn. Eyüp"
                        className="w-full mb-4 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" />

                    <p className="text-sm text-zinc-500 mb-2">Eğitim</p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[{ id: "lisans", t: "Lisans" }, { id: "onlisans", t: "Ön lisans" }, { id: "ortaogretim", t: "Ortaöğretim" }].map(function (x) {
                            return (
                                <button key={x.id} type="button" onClick={function () { pickLevel(x.id); }}
                                    className={"text-sm font-medium py-2.5 rounded-xl border " + (level === x.id ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 dark:border-zinc-700")}>{x.t}</button>
                            );
                        })}
                    </div>

                    <label className="block text-sm text-zinc-500 mb-1.5" htmlFor="ob-date">Sınav tarihi</label>
                    <input id="ob-date" type="date" value={examDate} onChange={function (e) { setExamDate(e.target.value); }}
                        className="w-full mb-5 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900" />

                    <label className="flex items-start gap-2 text-xs text-zinc-500 mb-5">
                        <input type="checkbox" checked={kvkk} onChange={function (e) { setKvkk(e.target.checked); }} className="mt-0.5" />
                        <span>İlerleme verimin hesabımda işlenmesine izin veriyorum.</span>
                    </label>

                    <button disabled={!kvkk} onClick={function () {
                        StudentStore.completeOnboarding({
                            name: name, nickname: name, examDate: examDate, dailyMinutes: 45, dailyQuestions: 25,
                            educationLevel: level, targetType: "B", kvkkConsent: true, weeklyHours: 7
                        });
                    }} className={"w-full font-semibold py-3.5 rounded-xl " + (kvkk ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-400")}>
                        Başla
                    </button>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.OnboardingScreen = OnboardingScreen;
})();
