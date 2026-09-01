(function () {
    const { useState } = React;
    function AiAssistant(props) {
        const [q, setQ] = useState("");
        const wrong = (props.plan && props.plan.wrong) || [];
        const item = wrong[0];
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-black">Soru asistanı</h1>
                    <button onClick={props.onBack} className="font-bold text-sm">Kapat</button>
                </div>
                {!item ? <p className="text-slate-500">Yanlış defteri boş. Asistan defterden beslenir.</p> : (
                    <div>
                        <p className="text-sm font-semibold mb-2">{item.q.question}</p>
                        <p className="text-xs text-emerald-600 mb-4">{item.q.explanation}</p>
                        <textarea value={q} onChange={function (e) { setQ(e.target.value); }} className="w-full border rounded-xl p-3 text-sm" placeholder="Neden yanlış yaptım?" />
                        <p className="text-xs text-amber-700 mt-3">Yakında: model bağlantısı. Şimdilik açıklama notu yeterli. İçeriği olmayan derslerde kapalı kalır.</p>
                    </div>
                )}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AiAssistant = AiAssistant;
})();
