(function () {
    const { useState } = React;
    function PaywallScreen(props) {
        const [busy, setBusy] = useState(false);
        const mock = !(window.PaymentClient) || window.PaymentClient.mock;
        async function buy() {
            if (!window.PaymentClient) return;
            setBusy(true);
            var r = await window.PaymentClient.checkout("premium");
            setBusy(false);
            alert(r.message || "Tamam");
            if (props.onDone) props.onDone();
        }
        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-display font-bold">Planın</h1>
                    <button onClick={props.onBack} className="text-sm font-medium">Kapat</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                    <div className="panel rounded-2xl p-5">
                        <p className="text-sm text-zinc-500">Ücretsiz</p>
                        <p className="font-stat text-3xl mt-2">0 ₺</p>
                        <ul className="text-sm text-zinc-600 mt-4 space-y-2">
                            <li>GY-GK temel akış</li>
                            <li>Günde 3 karışık test</li>
                            <li>Haftada 2 tam deneme</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl p-5 border-2 border-gold-500 bg-white dark:bg-stone-900 relative">
                        <span className="absolute -top-2.5 left-4 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-100 text-gold-700">En popüler</span>
                        <p className="text-sm text-stone-500">Premium</p>
                        <p className="font-stat text-3xl mt-2 text-navy-600">149 ₺<span className="text-base font-sans font-medium text-stone-500"> / ay</span></p>
                        <p className="text-xs text-zinc-500 mt-1">İstediğin zaman iptal et.</p>
                        <ul className="text-sm text-zinc-600 dark:text-zinc-300 mt-4 space-y-2">
                            <li>Sınırsız deneme</li>
                            <li>Branş analizi ve tercih robotu</li>
                            <li>Reklamsız çalışma</li>
                        </ul>
                        <button disabled={busy} onClick={buy} className="mt-5 w-full py-3 rounded-xl bg-navy-600 text-white font-semibold disabled:opacity-50">
                            {busy ? "…" : (mock ? "7 gün dene (test)" : "Devam et")}
                        </button>
                    </div>
                </div>
                {mock ? (
                    <div className="mt-6 panel rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium">Kart (görünüm)</p>
                            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">Test modu</span>
                        </div>
                        <input className="w-full mb-2 px-3 py-2 rounded-lg border text-sm" placeholder="Kart üzerindeki isim" defaultValue="TEST KULLANICI" />
                        <input className="w-full mb-2 px-3 py-2 rounded-lg border text-sm font-stat" placeholder="**** **** **** 4242" defaultValue="4242 4242 4242 4242" />
                        <div className="grid grid-cols-2 gap-2">
                            <input className="px-3 py-2 rounded-lg border text-sm" defaultValue="12/28" />
                            <input className="px-3 py-2 rounded-lg border text-sm" defaultValue="000" />
                        </div>
                        <p className="text-xs text-zinc-400 mt-2">iyzico henüz bağlı değil. Gerçek çekim yapılmaz.</p>
                    </div>
                ) : null}
            </div>
        );
    }
    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.PaywallScreen = PaywallScreen;
})();
