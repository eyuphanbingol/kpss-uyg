(function () {
    const { useState } = React;
    function AiAssistant(props) {
        const [q, setQ] = useState("");
        const [out, setOut] = useState("");
        const wrong = (props.plan && props.plan.wrong) || [];
        const item = wrong[0];
        function explain() {
            if (!item) return;
            var exp = (item.q && item.q.explanation) || "";
            var opts = (item.q && item.q.options) || [];
            var dogru = opts[item.q.correctAnswerIndex] || "";
            var hint = q.trim()
                ? "Sorun: " + q.trim() + ". "
                : "Bu soru yanlış defterinde. ";
            setOut(hint + "Doğru seçenek: " + dogru + ". " + (exp || "Kayıtlı çözüm notu yok.") + " Aynı tuzağı bir daha görünce önce şıkları ele, sonra metne dön.");
        }
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
                <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-semibold tracking-tight">Soru asistanı</h1>
                    <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                {!item ? <p className="text-zinc-500 text-sm">Yanlış defteri boş. Asistan defterden beslenir; model API’si yokken çözüm notu kullanılır.</p> : (
                    <div>
                        <p className="text-sm font-medium mb-2">{item.q.question}</p>
                        <p className="text-xs text-emerald-700 mb-4">{item.q.explanation}</p>
                        <textarea value={q} onChange={function (e) { setQ(e.target.value); }} className="w-full border rounded-xl p-3 text-sm" placeholder="Neden yanlış yaptım?" />
                        <button onClick={explain} className="mt-3 w-full py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold">Açıkla</button>
                        {out ? <p className="text-sm text-zinc-600 mt-4 leading-relaxed">{out}</p> : null}
                    </div>
                )}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AiAssistant = AiAssistant;
})();
