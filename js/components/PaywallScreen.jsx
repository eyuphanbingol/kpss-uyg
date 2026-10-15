(function () {
    const { useState, useEffect } = React;
    var BackBtn = window.KpssBackBtn;

    // Premium ekranı (web). Ödeme web'de alınmaz: Premium ve canlı deneme kaydı yalnız Google Play / App Store
    // üzerinden uygulamadan satın alınır. Satın alınca hesap web'de de Premium olur (sunucu: monet_status).
    // Mobil karşılığı: mobile/src/screens/ExtraScreens.js → PaywallScreen (satın alma orada).

    function fmtDate(iso) {
        try { return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return ""; }
    }

    function PaywallScreen(props) {
        var M = window.Monetization;
        const [, setTick] = useState(0);
        const [busy, setBusy] = useState(false);
        useEffect(function () {
            if (!M) return undefined;
            return M.subscribe(function () { setTick(function (x) { return x + 1; }); });
        }, []);

        var cfg = window.KpssConfig || {};
        var stores = cfg.stores || {};
        var prices = (M && M.PRICES) || { monthly: "200 TL", yearly: "1000 TL", live: "50 TL" };

        if (!M || !M.enabled()) {
            return (
                <div className="max-w-lg mx-auto px-4 py-12 text-center">
                    <h1 className="text-xl font-black mb-2">Tüm özellikler açık</h1>
                    <p className="text-sm text-stone-400 mb-6">Şu an bütün konular ve oyunlar ücretsiz.</p>
                    <BackBtn onClick={props.onBack} label="Geri" />
                </div>
            );
        }

        function refresh() {
            if (!window.MonetWeb) return;
            setBusy(true);
            window.MonetWeb.refresh().then(function () { setBusy(false); }, function () { setBusy(false); });
        }

        var premium = M.isPremium();
        var until = M.premiumUntil();
        var n = M.freeCount();

        return (
            <div className="app-page py-6 pb-10 max-w-2xl mx-auto">
                <div className="mb-6 slide-up">
                    <h1 className="text-2xl md:text-3xl font-black gradient-text">Atanly Premium</h1>
                    <p className="text-sm text-stone-400 mt-0.5">Bütün konular ve oyunlar, reklamsız</p>
                </div>

                {premium ? (
                    <div className="rounded-3xl p-6 mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-lg font-black text-emerald-800 dark:text-emerald-300">Premium açık</p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                            {until ? fmtDate(until) + " tarihine kadar geçerli." : "Süresiz."} Aboneliğini satın aldığın mağazadan (Google Play / App Store) yönetebilir ya da iptal edebilirsin.
                        </p>
                    </div>
                ) : null}

                <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div className="rounded-3xl p-6 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
                        <p className="text-sm font-medium text-stone-500">Aylık</p>
                        <p className="mt-2"><span className="font-stat text-4xl font-bold">{prices.monthly}</span><span className="text-sm text-stone-400 ml-1">/ ay</span></p>
                    </div>
                    <div className="rounded-3xl p-6 border-2 border-indigo-500 relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                        <span className="absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white">En avantajlı</span>
                        <p className="text-sm font-medium text-stone-500">Yıllık</p>
                        <p className="mt-2"><span className="font-stat text-4xl font-bold">{prices.yearly}</span><span className="text-sm text-stone-400 ml-1">/ yıl</span></p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-1">Ayda yaklaşık 83 TL</p>
                    </div>
                </div>

                <ul className="rounded-3xl glass p-5 mb-5 space-y-2 text-sm text-stone-600 dark:text-stone-300">
                    <li>✓ Bütün konu notları ve testleri</li>
                    <li>✓ Bütün harita oyunları ve boşluk doldurma</li>
                    <li>✓ Reklam yok</li>
                    <li>✓ Telefonda ve web'de aynı hesap</li>
                </ul>

                <div className="rounded-3xl p-5 mb-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
                    <p className="font-bold mb-1">Satın alma uygulamadan yapılır</p>
                    <p>Premium'u Atanly uygulamasından Google Play ya da App Store ile alabilirsin; web'de kart bilgisi istenmez. Satın aldıktan sonra burada otomatik açılır.</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {stores.play ? <a className="px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-semibold" href={stores.play} target="_blank" rel="noopener">Google Play'den indir</a> : null}
                        {stores.appStore ? <a className="px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-semibold" href={stores.appStore} target="_blank" rel="noopener">App Store'dan indir</a> : null}
                        <button type="button" disabled={busy} onClick={refresh} className="px-4 py-2 rounded-xl border-2 border-amber-300 text-sm font-semibold disabled:opacity-50">{busy ? "Kontrol ediliyor…" : "Satın aldım, yenile"}</button>
                    </div>
                </div>

                <div className="text-xs text-stone-400 space-y-1">
                    <p>Premium olmadan da her bölümün ilk {n} başlığı ücretsiz; diğerlerini uygulamada kısa bir reklam izleyerek {M.unlockHours()} saat açabilirsin.</p>
                    <p>Canlı denemeler Premium'a dahil değildir: her hesabın ilk canlı denemesi ücretsiz, sonrakiler kayıt başına {prices.live}.</p>
                    <p>Abonelik, mağaza hesabından iptal edilmedikçe dönem sonunda otomatik yenilenir.</p>
                </div>
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.PaywallScreen = PaywallScreen;
})();
