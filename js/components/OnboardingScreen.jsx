(function () {
    const { useState } = React;
    function OnboardingScreen(props) {
        const student = props.student;
        const dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
        const [name, setName] = useState(student.profile.name || "");
        const [nick, setNick] = useState((student.userProfile && student.userProfile.nickname) || "");
        const [level, setLevel] = useState((student.userProfile && student.userProfile.educationLevel) || "lisans");
        const [target, setTarget] = useState((student.userProfile && student.userProfile.targetType) || "B");
        const [mins, setMins] = useState(student.profile.dailyMinutes || 45);
        const [examDate, setExamDate] = useState(student.profile.examDate || dates[level] || "2026-09-06");
        const [kvkk, setKvkk] = useState(false);
        const [hours, setHours] = useState(7);

        function pickLevel(lv) {
            setLevel(lv);
            if (dates[lv]) setExamDate(dates[lv]);
        }

        return (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl fade-in my-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Kişisel eğitim alanı</p>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Kulvarını seç</h2>
                    <p className="text-sm text-slate-500 mb-5">GY-GK içeriğin duruyor. A Grubu, ÖABT ve DHBT altyapısı hazır; içerik gelince açılacak.</p>

                    <label className="block text-xs font-bold text-slate-500 mb-1" htmlFor="ob-name">Adın (gizli, sadece sende)</label>
                    <input id="ob-name" value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Örn. Eyüp"
                        className="w-full mb-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium" />

                    <label className="block text-xs font-bold text-slate-500 mb-1" htmlFor="ob-nick">Takma ad (liderlik / paylaşım)</label>
                    <input id="ob-nick" value={nick} onChange={function (e) { setNick(e.target.value); }} placeholder="herkese görünen ad"
                        className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium" />

                    <p className="text-xs font-bold text-slate-500 mb-2">Eğitim düzeyi</p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[{ id: "lisans", t: "Lisans" }, { id: "onlisans", t: "Ön lisans" }, { id: "ortaogretim", t: "Ortaöğretim" }].map(function (x) {
                            return (
                                <button key={x.id} type="button" onClick={function () { pickLevel(x.id); }}
                                    className={"text-xs font-bold py-3 rounded-xl border " + (level === x.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 border-slate-200")}>{x.t}</button>
                            );
                        })}
                    </div>

                    <p className="text-xs font-bold text-slate-500 mb-2">Hedef türü</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                            { id: "B", t: "B Grubu GY-GK" },
                            { id: "A", t: "A Grubu", soon: true },
                            { id: "ogretmen", t: "Öğretmenlik", soon: true },
                            { id: "dhbt", t: "DHBT", soon: true }
                        ].map(function (x) {
                            return (
                                <button key={x.id} type="button" onClick={function () { setTarget(x.id); }}
                                    className={"text-left text-xs font-bold p-3 rounded-xl border " + (target === x.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white dark:bg-slate-900 border-slate-200")}>
                                    {x.t}{x.soon ? <span className="block font-medium opacity-80 mt-1">Yakında</span> : null}
                                </button>
                            );
                        })}
                    </div>

                    <label className="block text-xs font-bold text-slate-500 mb-1" htmlFor="ob-date">Sınav tarihi</label>
                    <input id="ob-date" type="date" value={examDate} onChange={function (e) { setExamDate(e.target.value); }}
                        className="w-full mb-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium" />

                    <label className="block text-xs font-bold text-slate-500 mb-1" htmlFor="ob-mins">Günlük çalışma · {mins} dk</label>
                    <input id="ob-mins" type="range" min="20" max="180" step="5" value={mins} onChange={function (e) { setMins(Number(e.target.value)); }} className="w-full mb-3" />
                    <label className="block text-xs font-bold text-slate-500 mb-1" htmlFor="ob-h">Haftalık saat · {hours}</label>
                    <input id="ob-h" type="range" min="3" max="40" step="1" value={hours} onChange={function (e) { setHours(Number(e.target.value)); }} className="w-full mb-4" />

                    <label className="flex items-start gap-2 text-xs text-slate-600 mb-5">
                        <input type="checkbox" checked={kvkk} onChange={function (e) { setKvkk(e.target.checked); }} className="mt-0.5" />
                        <span>Aydınlatma metnini okudum; ilerleme verimin bu cihazda ve giriş yaparsam hesabımda işlenmesine açık rıza veriyorum. Gerçek adım liderlikte görünmez.</span>
                    </label>

                    <button disabled={!kvkk} onClick={function () {
                        const q = Math.max(10, Math.round(mins / 1.8));
                        StudentStore.completeOnboarding({
                            name: name, nickname: nick || name, examDate: examDate, dailyMinutes: mins, dailyQuestions: q,
                            educationLevel: level, targetType: target, kvkkConsent: true, weeklyHours: hours
                        });
                    }} className={"w-full font-bold py-4 rounded-2xl shadow-lg " + (kvkk ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-slate-200 text-slate-400")}>
                        Koçluğu başlat
                    </button>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.OnboardingScreen = OnboardingScreen;
})();
