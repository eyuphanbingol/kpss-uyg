(function () {
    const { useState, useEffect, useRef } = React;

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function formatCurrency(amount) {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function getPlanColor(plan) {
        if (plan === "premium") return "from-indigo-600 to-purple-600";
        return "from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700";
    }

    function getPlanBorder(plan) {
        if (plan === "premium") return "border-2 border-indigo-500 shadow-xl shadow-indigo-500/20";
        return "border border-stone-200 dark:border-stone-700";
    }

    function getPlanBadge(plan) {
        if (plan === "premium") return "bg-gradient-to-r from-amber-400 to-amber-500 text-white";
        return "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400";
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function PaywallScreen(props) {
        const [busy, setBusy] = useState(false);
        const [selectedPlan, setSelectedPlan] = useState("premium");
        const [billingCycle, setBillingCycle] = useState("monthly");
        const [cardNumber, setCardNumber] = useState("");
        const [cardName, setCardName] = useState("");
        const [cardExpiry, setCardExpiry] = useState("");
        const [cardCvv, setCardCvv] = useState("");
        const [cardFocused, setCardFocused] = useState(null);
        const [showCardForm, setShowCardForm] = useState(false);
        const [error, setError] = useState("");

        const mock = !(window.PaymentClient) || window.PaymentClient.mock;
        const cardInputRef = useRef(null);

        // ---------- Format Card Number ----------
        function formatCardNumber(value) {
            var cleaned = value.replace(/\D/g, '');
            var groups = cleaned.match(/(.{1,4})/g);
            return groups ? groups.join(' ') : '';
        }

        function formatExpiry(value) {
            var cleaned = value.replace(/\D/g, '');
            if (cleaned.length >= 2) {
                return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
            }
            return cleaned;
        }

        // ---------- Handle Input ----------
        function handleCardNumber(e) {
            var formatted = formatCardNumber(e.target.value);
            setCardNumber(formatted);
            if (formatted.replace(/\s/g, '').length === 16) {
                if (cardInputRef.current) {
                    // Focus next input
                }
            }
        }

        function handleExpiry(e) {
            var formatted = formatExpiry(e.target.value);
            setCardExpiry(formatted);
        }

        // ---------- Buy ----------
        async function buy() {
            if (!window.PaymentClient) {
                setError("Ödeme sistemi bağlı değil.");
                return;
            }

            if (!cardNumber.replace(/\s/g, '').length === 16) {
                setError("Lütfen geçerli bir kart numarası girin.");
                return;
            }

            setBusy(true);
            setError("");

            try {
                var r = await window.PaymentClient.checkout("premium", {
                    cardNumber: cardNumber.replace(/\s/g, ''),
                    cardName: cardName,
                    cardExpiry: cardExpiry,
                    cardCvv: cardCvv
                });

                if (r.error) {
                    setError(r.message || "Ödeme sırasında bir hata oluştu.");
                } else {
                    if (props.onDone) props.onDone();
                }
            } catch (e) {
                setError(e.message || "Beklenmeyen bir hata oluştu.");
            } finally {
                setBusy(false);
            }
        }

        // ---------- Plans ----------
        var plans = [
            {
                id: "free",
                name: "Ücretsiz",
                price: 0,
                currency: "₺",
                period: "süresiz",
                badge: "Başlangıç",
                features: [
                    "📚 GY-GK temel akış",
                    "📝 Günde 3 karışık test",
                    "📋 Haftada 2 tam deneme",
                    "📊 Temel istatistikler",
                    "👥 Liderlik tablosu"
                ],
                cta: "Mevcut Plan",
                popular: false
            },
            {
                id: "premium",
                name: "Premium",
                price: 149,
                currency: "₺",
                period: "/ ay",
                badge: "En Popüler",
                features: [
                    "♾️ Sınırsız deneme",
                    "📊 Detaylı branş analizi",
                    "🎯 Akıllı tercih robotu",
                    "🚫 Reklamsız çalışma",
                    "🏆 Özel liderlik rozetleri",
                    "📱 Öncelikli destek"
                ],
                cta: "Şimdi Başla",
                popular: true
            }
        ];

        if (!(window.KpssConfig && window.KpssConfig.premiumEnabled)) {
            return (
                <div className="max-w-lg mx-auto px-4 py-12 text-center">
                    <h1 className="text-xl font-black mb-2">Tüm özellikler açık</h1>
                    <p className="text-sm text-stone-400 mb-6">Abonelik şimdilik yok; deneme ve tercih listesi sınırlı değil.</p>
                    <button onClick={props.onBack} className="px-5 py-2.5 rounded-xl btn-primary text-white text-sm font-semibold">Geri</button>
                </div>
            );
        }

        // ============================================================
        // RENDER
        // ============================================================

        return (
            <div className="max-w-3xl mx-auto px-4 py-6 pb-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 slide-up">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black gradient-text">⭐ Premium</h1>
                        <p className="text-sm text-stone-400 mt-0.5">Hedefine daha hızlı ulaşmak için</p>
                    </div>
                    <button 
                        onClick={props.onBack} 
                        className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                        ✕ Kapat
                    </button>
                </div>

                {/* Info */}
                <p className="text-xs text-stone-400 dark:text-stone-500 mb-6">
                    💳 Güvenli ödeme · İstediğin zaman iptal et
                </p>

                {/* ===== PLAN CARDS ===== */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {plans.map(function (plan) {
                        var isSelected = selectedPlan === plan.id;
                        var isPremium = plan.id === "premium";
                        var color = getPlanColor(plan.id);
                        var border = getPlanBorder(plan.id);
                        var badge = getPlanBadge(plan.id);

                        return (
                            <div 
                                key={plan.id}
                                className={"rounded-3xl p-6 transition-all duration-300 relative " + 
                                    (isSelected ? "scale-[1.02] " + border : "border border-stone-200 dark:border-stone-700 hover:border-indigo-300 dark:hover:border-indigo-700") +
                                    (isPremium ? " bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20" : " bg-white dark:bg-stone-900")
                                }
                                onClick={function () { setSelectedPlan(plan.id); }}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <span className={"absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full " + badge}>
                                        {plan.badge}
                                    </span>
                                )}

                                {/* Plan Name */}
                                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{plan.name}</p>

                                {/* Price */}
                                <div className="mt-2">
                                    <span className="font-stat text-4xl font-bold text-stone-900 dark:text-white">
                                        {plan.price === 0 ? "0" : formatCurrency(plan.price)}
                                    </span>
                                    <span className="text-sm text-stone-400 dark:text-stone-500 ml-1">
                                        {plan.period}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul className="mt-4 space-y-2 text-sm text-stone-600 dark:text-stone-300">
                                    {plan.features.map(function (f, idx) {
                                        var isFree = plan.id === "free";
                                        var isLocked = isPremium && isFree;
                                        return (
                                            <li key={idx} className={"flex items-center gap-2 " + (isLocked ? "opacity-50" : "")}>
                                                <span className={isPremium ? "text-indigo-500" : "text-stone-400"}>
                                                    {isPremium ? "✓" : "•"}
                                                </span>
                                                {f}
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* CTA */}
                                <button 
                                    onClick={function (e) { 
                                        e.stopPropagation(); 
                                        if (plan.id === "premium") {
                                            setShowCardForm(true);
                                            setTimeout(function () {
                                                if (cardInputRef.current) cardInputRef.current.focus();
                                            }, 100);
                                        }
                                    }}
                                    className={"w-full mt-5 py-3 rounded-2xl font-semibold transition-all duration-200 " +
                                        (isPremium 
                                            ? "btn-primary text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20" 
                                            : "border-2 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800")
                                    }
                                >
                                    {plan.id === "premium" ? "🚀 " + plan.cta : plan.cta}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* ===== CARD FORM ===== */}
                {showCardForm && (
                    <div className="rounded-3xl glass p-6 slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-semibold">💳 Kart Bilgileri</p>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                {mock ? "🧪 Test Modu" : "🔒 Güvenli"}
                            </span>
                        </div>

                        {error && (
                            <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                                    Kart Üzerindeki İsim
                                </label>
                                <input 
                                    value={cardName} 
                                    onChange={function (e) { setCardName(e.target.value); }} 
                                    placeholder="Adınız Soyadınız" 
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                                    Kart Numarası
                                </label>
                                <input 
                                    ref={cardInputRef}
                                    value={cardNumber} 
                                    onChange={handleCardNumber} 
                                    placeholder="4242 4242 4242 4242" 
                                    maxLength="19"
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-mono tracking-wider focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                                        Son Kullanma
                                    </label>
                                    <input 
                                        value={cardExpiry} 
                                        onChange={handleExpiry} 
                                        placeholder="12/28" 
                                        maxLength="5"
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-mono focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                                        CVV
                                    </label>
                                    <input 
                                        value={cardCvv} 
                                        onChange={function (e) { setCardCvv(e.target.value.replace(/\D/g, '')); }} 
                                        placeholder="000" 
                                        maxLength="4"
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-mono focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={function () { setShowCardForm(false); setError(""); }}
                                    className="flex-1 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button 
                                    disabled={busy || !cardNumber || !cardName || !cardExpiry || !cardCvv} 
                                    onClick={buy} 
                                    className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {busy ? "⏳ İşleniyor..." : "💳 Ödemeyi Tamamla"}
                                </button>
                            </div>
                        </div>

                        {mock && (
                            <div className="mt-3 text-center text-[10px] text-stone-400">
                                🧪 Test modu: Gerçek ödeme yapılmaz. 4242 4242 4242 4242 ile test edebilirsin.
                            </div>
                        )}
                    </div>
                )}

                {/* ===== FEATURES COMPARISON ===== */}
                <div className="mt-6 rounded-3xl glass p-5">
                    <p className="text-sm font-semibold mb-3">✨ Premium ile Kazanacakların</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-800/30">
                            <div className="text-2xl mb-1">♾️</div>
                            <p className="text-xs font-medium">Sınırsız Deneme</p>
                            <p className="text-[10px] text-stone-400">40 soru · 40 dakika</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-800/30">
                            <div className="text-2xl mb-1">📊</div>
                            <p className="text-xs font-medium">Detaylı Analiz</p>
                            <p className="text-[10px] text-stone-400">Zayıf noktalarını bul</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
                            <div className="text-2xl mb-1">🎯</div>
                            <p className="text-xs font-medium">Akıllı Tercih</p>
                            <p className="text-[10px] text-stone-400">En uygun kurumlar</p>
                        </div>
                    </div>
                </div>

                {/* ===== GUARANTEE ===== */}
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                        <span>🔒</span>
                        Güvenli ödeme · 7 gün para iade garantisi
                        <span className="mx-1">·</span>
                        <span>💳</span>
                        Visa / Mastercard desteklenir
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-[10px] text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-4">
                    <p>Premium üyelik otomatik yenilenir. İstediğin zaman iptal edebilirsin.</p>
                </div>
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.PaywallScreen = PaywallScreen;

})();