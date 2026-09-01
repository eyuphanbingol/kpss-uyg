(function () {
    function LiveExamScreen(props) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-black">Canlı deneme</h1>
                    <button onClick={props.onBack} className="font-bold text-sm">Kapat</button>
                </div>
                <div className="p-5 rounded-3xl border bg-white dark:bg-slate-800">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800">Yakında</span>
                    <p className="mt-3 text-sm text-slate-500">Haftalık sabit saatli Türkiye geneli deneme. Katılımcı ve anlık sıra Supabase event tablosundan gelecek. GY-GK akışın duruyor.</p>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LiveExamScreen = LiveExamScreen;
})();
