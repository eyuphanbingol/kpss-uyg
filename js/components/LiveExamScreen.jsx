(function () {
    function nextSaturday21() {
        var d = new Date();
        var day = d.getDay();
        var add = (6 - day + 7) % 7;
        if (add === 0 && (d.getHours() > 21 || (d.getHours() === 21 && d.getMinutes() > 0))) add = 7;
        d.setDate(d.getDate() + add);
        d.setHours(21, 0, 0, 0);
        return d;
    }
    function LiveExamScreen(props) {
        var when = nextSaturday21();
        var n = Math.max(0, when.getTime() - Date.now());
        var hrs = Math.floor(n / 3600000);
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Canlı deneme</h1>
                    <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <div className="p-5 rounded-2xl panel">
                    <p className="text-sm text-zinc-500">Haftalık sabit saat: cumartesi 21:00 (yerel).</p>
                    <p className="text-2xl font-semibold mt-3">{hrs} saat sonra</p>
                    <p className="text-xs text-zinc-400 mt-2">{when.toLocaleString("tr-TR")}</p>
                    <p className="text-sm text-zinc-500 mt-4">Anlık sıra, canlı event tablosu bağlanınca açılır. Şimdilik tam deneme modunu kullan; GY-GK durmaz.</p>
                    <button onClick={function () { if (props.onClose) props.onClose(); }} className="mt-4 w-full py-2.5 rounded-xl border text-sm font-medium">Tam denemeye geç (Profil → Tam deneme)</button>
                </div>
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LiveExamScreen = LiveExamScreen;
})();
