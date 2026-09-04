(function () {
    const { useMemo, useState, useRef, useEffect } = React;

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function shuffleArray(arr) {
        var shuffled = arr.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    function stripChoicePrefix(opt) {
        return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
    }

    function getOptionLetter(index) {
        return String.fromCharCode(65 + index); // A, B, C, D, E
    }

    function getLevelText(wrongCount) {
        if (wrongCount === 0) return { text: "Hiç yanlış yok! 🌟", color: "text-emerald-600" };
        if (wrongCount <= 3) return { text: "Az yanlış, gelişime açık 📈", color: "text-amber-600" };
        if (wrongCount <= 7) return { text: "Orta seviye, tekrar gerekli 📊", color: "text-orange-600" };
        return { text: "Çok yanlış, detaylı çalışma şart! 🔥", color: "text-rose-600" };
    }

    function truncateText(text, maxLength) {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function AiAssistant(props) {
        const [q, setQ] = useState("");
        const [out, setOut] = useState("");
        const [pick, setPick] = useState(0);
        const [showOptions, setShowOptions] = useState(true);
        const [isTyping, setIsTyping] = useState(false);
        const [favoriteMode, setFavoriteMode] = useState(false);
        const [shuffleMode, setShuffleMode] = useState(false);

        const outputRef = useRef(null);
        const questionInputRef = useRef(null);

        // ---------- Veri Hazırlama ----------
        const wrong = (props.plan && props.plan.wrong) || [];
        
        const extra = useMemo(function () {
            if (wrong.length) return [];
            var data = props.kpssData || {};
            var list = [];
            Object.keys(data).forEach(function (ders) {
                Object.keys(data[ders] || {}).forEach(function (konu) {
                    ((data[ders][konu] && data[ders][konu].sorular) || []).forEach(function (soru, idx) {
                        if (list.length >= 20) return;
                        list.push({ 
                            ders: ders, 
                            konu: konu, 
                            q: soru, 
                            id: soru.id != null ? soru.id : idx 
                        });
                    });
                });
            });
            return shuffleArray(list);
        }, [props.kpssData, wrong.length]);

        // ---------- Havuz ve Seçili Öğe ----------
        const pool = useMemo(function () {
            var base = wrong.length ? wrong : extra;
            if (shuffleMode) return shuffleArray(base);
            return base;
        }, [wrong, extra, shuffleMode]);

        const item = pool[pick] || pool[0];

        // ---------- İstatistikler ----------
        const stats = useMemo(function () {
            var total = pool.length;
            var dersCount = {};
            pool.forEach(function (p) {
                if (!p.ders) return;
                dersCount[p.ders] = (dersCount[p.ders] || 0) + 1;
            });
            var topDers = "";
            var topCount = 0;
            for (var key in dersCount) {
                if (dersCount[key] > topCount) {
                    topCount = dersCount[key];
                    topDers = key;
                }
            }
            var level = getLevelText(total);
            return { total, topDers, topCount, level };
        }, [pool]);

        // ---------- Açıklama Fonksiyonu ----------
        function explain() {
            if (!item || !item.q) return;

            var exp = item.q.explanation || "";
            var opts = item.q.options || [];
            var dogru = opts[item.q.correctAnswerIndex] || "";
            var dogruLetter = getOptionLetter(item.q.correctAnswerIndex);
            var userQuestion = q.trim();

            setIsTyping(true);
            setOut("");

            // Animasyonlu yazma efekti
            var fullText = "";
            if (userQuestion) {
                fullText += "❓ " + userQuestion + "\n\n";
            }
            fullText += "✅ **Doğru Cevap:** " + dogruLetter + ") " + dogru + "\n\n";
            fullText += "📖 **Çözüm Notu:**\n" + (exp || "Bu soru için kayıtlı bir çözüm notu bulunmuyor.");

            // Çözüm notu yoksa öneri ekle
            if (!exp) {
                fullText += "\n\n💡 **Öneri:**\n• Konu tekrarı yapmayı dene\n• Benzer soruları çöz\n• Yanlışlarını defterine not et";
            }

            // Yavaş yazma efekti
            var index = 0;
            var interval = setInterval(function () {
                if (index < fullText.length) {
                    setOut(fullText.slice(0, index + 1));
                    index++;
                    if (outputRef.current) {
                        outputRef.current.scrollTop = outputRef.current.scrollHeight;
                    }
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 15);

            // Input'u temizle
            setQ("");
        }

        // ---------- Klavye Kısayolları ----------
        useEffect(function () {
            function handleKeyDown(e) {
                // Enter ile açıkla (Ctrl+Enter ile daha güvenli)
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    explain();
                }
                // Sağ/Sol ok ile soru değiştir
                if (e.key === "ArrowRight" && pool.length > 1) {
                    e.preventDefault();
                    setPick(function (prev) { return (prev + 1) % pool.length; });
                    setOut("");
                }
                if (e.key === "ArrowLeft" && pool.length > 1) {
                    e.preventDefault();
                    setPick(function (prev) { return (prev - 1 + pool.length) % pool.length; });
                    setOut("");
                }
                // R tuşu ile rastgele soru
                if (e.key === "r" && !e.ctrlKey && !e.metaKey) {
                    if (pool.length > 1) {
                        var randomIdx = Math.floor(Math.random() * pool.length);
                        setPick(randomIdx);
                        setOut("");
                    }
                }
            }

            document.addEventListener("keydown", handleKeyDown);
            return function () { document.removeEventListener("keydown", handleKeyDown); };
        }, [pool, explain]);

        // ---------- Önceki/Sonraki ----------
        function goToPrev() {
            if (pool.length > 1) {
                setPick(function (prev) { return (prev - 1 + pool.length) % pool.length; });
                setOut("");
            }
        }

        function goToNext() {
            if (pool.length > 1) {
                setPick(function (prev) { return (prev + 1) % pool.length; });
                setOut("");
            }
        }

        function goToRandom() {
            if (pool.length > 1) {
                var randomIdx = Math.floor(Math.random() * pool.length);
                setPick(randomIdx);
                setOut("");
            }
        }

        // ---------- Toggle ----------
        function toggleOptions() {
            setShowOptions(!showOptions);
        }

        function toggleShuffle() {
            setShuffleMode(!shuffleMode);
            setPick(0);
            setOut("");
        }

        // ---------- Render ----------
        return (
            <div className="max-w-2xl mx-auto pb-10 px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 slide-up">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black gradient-text">🤖 Soru Asistanı</h1>
                        <p className="text-sm text-stone-400 mt-1">Yanlış defterindeki soruları anında çözümle</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={props.onBack} 
                        className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                        ✕ Kapat
                    </button>
                </div>

                {/* İstatistik Kartı */}
                {stats.total > 0 && (
                    <div className="rounded-2xl glass p-4 mb-5 flex flex-wrap items-center justify-between gap-3 card-hover">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {stats.total}
                            </div>
                            <div>
                                <p className="text-xs text-stone-400 font-medium">Havuzdaki Soru</p>
                                <p className="text-sm font-semibold">{stats.total} soru · {stats.topDers} ağırlıklı</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={"text-xs font-bold " + stats.level.color}>{stats.level.text}</p>
                        </div>
                    </div>
                )}

                {/* Boş Durum */}
                {!item || pool.length === 0 ? (
                    <div className="rounded-3xl glass p-12 text-center">
                        <div className="text-6xl mb-4">🧘</div>
                        <h2 className="text-xl font-bold text-stone-600 dark:text-stone-300 mb-2">Henüz Soru Yok</h2>
                        <p className="text-sm text-stone-400 max-w-xs mx-auto">
                            Derslerden test çözdükçe yanlışların burada birikir. 
                            Önce biraz pratik yap!
                        </p>
                        <button 
                            onClick={props.onBack} 
                            className="mt-6 px-6 py-2.5 rounded-2xl btn-primary text-white font-semibold"
                        >
                            Derslere Dön
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Navigasyon Butonları */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex gap-1">
                                <button 
                                    onClick={goToPrev} 
                                    disabled={pool.length <= 1}
                                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors"
                                    title="Önceki soru (←)"
                                >
                                    ←
                                </button>
                                <button 
                                    onClick={goToRandom} 
                                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                    title="Rastgele soru (R)"
                                >
                                    🎲
                                </button>
                                <button 
                                    onClick={goToNext} 
                                    disabled={pool.length <= 1}
                                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors"
                                    title="Sonraki soru (→)"
                                >
                                    →
                                </button>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-xs text-stone-400 font-medium">
                                    {pick + 1} / {pool.length}
                                </span>
                                <button
                                    onClick={toggleShuffle}
                                    className={"text-xs px-2 py-1 rounded-lg border transition-colors " + 
                                        (shuffleMode ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800")}
                                >
                                    🔀 Karışık
                                </button>
                                <button
                                    onClick={toggleOptions}
                                    className="text-xs px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    {showOptions ? "📝 Şıkları Gizle" : "📝 Şıkları Göster"}
                                </button>
                            </div>
                        </div>

                        {/* Konu Etiketleri */}
                        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                            {pool.slice(0, 12).map(function (it, i) {
                                var isActive = pick === i;
                                var colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6", "#d946ef"];
                                var label = (it.konu || "Soru").slice(0, 20);
                                return (
                                    <button 
                                        key={i} 
                                        type="button" 
                                        onClick={function () { setPick(i); setOut(""); }}
                                        className={"shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 " + 
                                            (isActive 
                                                ? "text-white shadow-sm" 
                                                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700")}
                                        style={isActive ? { background: colors[i % colors.length] } : {}}
                                    >
                                        {i + 1}. {truncateText(label, 18)}
                                    </button>
                                );
                            })}
                            {pool.length > 12 && (
                                <span className="text-xs text-stone-400 px-2 py-1.5">
                                    +{pool.length - 12} daha
                                </span>
                            )}
                        </div>

                        {/* Soru Kartı */}
                        <div className="rounded-3xl glass p-5 md:p-6 card-hover">
                            {/* Ders ve Konu */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                    {item.ders || "—"}
                                </span>
                                <span className="text-[10px] font-medium text-stone-400">·</span>
                                <span className="text-xs text-stone-500 dark:text-stone-400">{item.konu || "—"}</span>
                            </div>

                            {/* Soru Metni */}
                            <div className="mb-4">
                                <p className="text-base md:text-lg font-semibold leading-relaxed">
                                    {item.q.question}
                                </p>
                            </div>

                            {/* Seçenekler */}
                            {showOptions && (
                                <div className="space-y-1.5 mb-4">
                                    {(item.q.options || []).map(function (opt, i) {
                                        var isCorrect = i === item.q.correctAnswerIndex;
                                        return (
                                            <div 
                                                key={i} 
                                                className={"flex items-start gap-3 p-2.5 rounded-xl border transition-all " + 
                                                    (isCorrect 
                                                        ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700" 
                                                        : "border-transparent hover:border-stone-200 dark:hover:border-stone-700")}
                                            >
                                                <span className={"text-xs font-bold shrink-0 mt-0.5 " + 
                                                    (isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400")}>
                                                    {getOptionLetter(i)}
                                                </span>
                                                <span className={"text-sm " + (isCorrect ? "text-emerald-800 dark:text-emerald-300 font-medium" : "text-stone-600 dark:text-stone-400")}>
                                                    {stripChoicePrefix(opt)}
                                                </span>
                                                {isCorrect && (
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
                                                        ✅ Doğru
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Kullanıcı Sorusu */}
                            <div className="relative">
                                <textarea 
                                    ref={questionInputRef}
                                    value={q} 
                                    onChange={function (e) { setQ(e.target.value); }} 
                                    onKeyDown={function (e) {
                                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                            e.preventDefault();
                                            explain();
                                        }
                                    }}
                                    className="w-full px-4 py-3 pr-24 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                    placeholder="❓ Neden yanlış yaptım? (isteğe bağlı) Ctrl+Enter ile gönder"
                                    rows={2}
                                />
                                <div className="absolute bottom-3 right-3 flex gap-1">
                                    <span className="text-[10px] text-stone-400 self-center">
                                        {q.length}/500
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={explain} 
                                        disabled={isTyping}
                                        className="px-4 py-1.5 rounded-xl btn-primary text-white text-sm font-semibold disabled:opacity-50 transition-all"
                                    >
                                        {isTyping ? "⏳" : "🔍 Açıkla"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Çıktı */}
                        {out && (
                            <div 
                                ref={outputRef}
                                className="rounded-3xl glass p-5 md:p-6 border-l-4 border-l-indigo-500 slide-up max-h-80 overflow-y-auto"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">💡</span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                        {isTyping ? "Yanıt oluşturuluyor..." : "Çözüm Analizi"}
                                    </span>
                                    {isTyping && (
                                        <span className="inline-flex gap-1">
                                            <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                                    {out}
                                </div>
                            </div>
                        )}

                        {/* Klavye Kısayolları */}
                        <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 p-3 text-xs text-stone-400 flex flex-wrap gap-3 justify-center">
                            <span>⌨️ <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono">→</kbd> Soru değiştir</span>
                            <span><kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono">R</kbd> Rastgele soru</span>
                            <span><kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono">Enter</kbd> Açıkla</span>
                        </div>

                        {/* Alt Bilgi */}
                        <p className="text-[10px] text-stone-400 text-center">
                            🤖 Bu asistan yanlış defterindeki soruları açıklar. Gerçek AI değil, kayıtlı çözüm notlarını gösterir.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AiAssistant = AiAssistant;

})();