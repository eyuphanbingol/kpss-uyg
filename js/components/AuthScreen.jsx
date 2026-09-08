(function () {
    const { useState, useEffect, useRef, useCallback } = React;
    const Ic = function (n, c) { return window.KpssIcon ? window.KpssIcon(n, c) : null; };

    // ============================================================
    // YARDIMCI FONKSİYONLAR
    // ============================================================

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(pass) {
        return pass.length >= 6;
    }

    var loginFails = 0;
    var loginLockUntil = 0;
    function loginLockedMsg() {
        var left = Math.ceil((loginLockUntil - Date.now()) / 1000);
        if (left < 1) return "";
        return "Çok fazla deneme. " + left + " saniye bekle, sonra tekrar dene.";
    }

    function wantAuthFromUrl() {
        try {
            var q = new URLSearchParams(window.location.search || "");
            if (q.get("reset") === "1" || q.get("giris") === "1" || q.get("kayit") === "1") return true;
            if (q.get("code") || q.get("type") === "recovery") return true;
            var h = String(window.location.hash || "");
            if (/access_token|refresh_token|type=recovery/.test(h)) return true;
        } catch (e) {}
        return false;
    }

    function authUrlFlags() {
        try {
            var q = new URLSearchParams(window.location.search || "");
            return {
                reset: q.get("reset") === "1",
                code: !!q.get("code"),
                giris: q.get("giris") === "1",
                kayit: q.get("kayit") === "1"
            };
        } catch (e) {
            return { reset: false, code: false, giris: false, kayit: false };
        }
    }

    function LandingPage(props) {
        var logo = window.AtanomLogo
            ? window.AtanomLogo("h-14 w-14 object-contain")
            : <img src="icons/atanom.png?v=18" alt="Atanly" className="h-14 w-14 object-contain" />;
        var feats = [
            { t: "Bugünün hedefi", d: "Düzenle’ye bas: 30 dk vatandaşlık, 30 dk güncel, 1,5 saat tarih, 1,5 saat coğrafya — senin günün. Sıradaki ders yeşil yanar, yüzde dolar. Ne çalışacağını aramazsın; ekran söyler." },
            { t: "Konu kilidi", d: "Tarih sırayla: İslamiyet öncesi, ilk Türk-İslam, Selçuklu, Osmanlı kültür, kuruluş, yükselme. Notu ve testleri bitirmeden kilit açılmaz. Atlayarak boşluk bırakmazsın." },
            { t: "Eksikler masası", d: "Bugün tekrar, yanlış defteri, yalnızca senin gördüğün tekrar defteri. Zayıfın görünür; kilit hileyle atlanmaz." }
        ];
        var stats = [
            { t: "Seri gün", d: "Ateş yanınca bırakmak zorlaşır. Kaç gündür masadasın, oturum kaç dakika, rekor gün kaç saat — İstatistikler’de durur." },
            { t: "Haftalık trend", d: "Sekiz haftalık çizgi, Pzt’den Paz’a çubuklar, bu hafta kaç / 20 saat. Düzleşince uyarı; yükselince gurur." },
            { t: "Ders dağılımı", d: "Zamanın yüzde kaçı Tarih, kaçı Coğrafya. Bir derse gömülüp diğerini unutma; dilim yalan söylemez." }
        ];
        var games = [
            { t: "Türkiye'yi Fethet", d: "81 ile dokun, boya, bölge bitince rozet. Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu, Güneydoğu — harita ezberi değil; fetih. KPSS Türkiye haritası böyle kalır." },
            { t: "Harita oyunu", d: "Yer şekilleri ve jeoloji: volkan, horst–graben, kıvrım, masif, KAF–DAF–BAF, deprem riski. Konuyu seç, noktayı haritada vur. Fiziki coğrafya parmak ucunda." },
            { t: "Kavram · az ipucu", d: "Nottaki kavram gizli. Az ipucu = yüksek puan. Şanlıurfa çevresi deyince Antep fıstığı mı, çay mı — bileceksin. Risk al, puanı koru." },
            { t: "Tabu", d: "Yasaklı kelimeye takılma, tanımı yakala. Vatandaşlık ve güncel bilgi için tempo; dilin sürçmesin, kavram gelsin." },
            { t: "Panik", d: "Süre daralır, şıklar döner. Sınav günü paniği burada biter; elin alışır, zihin soğuk kalır." },
            { t: "Boşluk doldur", d: "Cümlenin eksiğini tamamla. Aynı konunun notundan üretilir; oyun ayrı dünya değil, notun devamı." }
        ];
        var maps = [
            { t: "Volkanik dağlar", d: "Ağrı’dan Nemrut’a zirveyi haritada yakala. 11 hedef; KPSS fiziki coğrafyanın ateşi." },
            { t: "Volkanik araziler", d: "Lavın bıraktığı arazi. Konuyu seç, noktayı bul — ezber değil, yer." },
            { t: "Kırık dağlar", d: "Horst–graben. Anadolu’nun kırık omurgasını haritada gör." },
            { t: "Kıvrım dağları", d: "Kıvrılan sıra dağlar. 14 hedef; yükseltinin hikâyesi parmak ucunda." },
            { t: "Masif araziler", d: "Eski, sert, sakin masifler. Haritada dokun, isim otursun." },
            { t: "Fay hatları", d: "KAF · DAF · BAF. Türkiye’nin sismik anatomisi; üç hat, üç isim, unutulmaz." },
            { t: "Deprem riski az", d: "Sakin kuşakları da bil. Sınav hem riski hem sükûneti sorar." }
        ];
        var eksik = [
            { t: "Bugün tekrar", d: "Daha önce çözdüğün, bugün hatırlaman gereken sorular. Unutma eğrisi Atanly’de çalışır; masaya oturunca liste hazır." },
            { t: "Yanlış defteri", d: "Kaçırdığın soru burada bekler. Çözünce defterden düşer; konu kilidini açmaz — dürüst tekrar." },
            { t: "Tekrar defteri", d: "Kendine not yaz. Yalnız sen görürsün. Başkasının defterine karışılmaz; bu çekmece senin." }
        ];
        var steps = [
            { n: "1", t: "Kulvarını seç", d: "Lisans, ön lisans veya ortaöğretim. Google veya e-posta. İlerleme hesabına yazılır, başka göze gitmez." },
            { n: "2", t: "Hedefi işaretle", d: "Bugünün saatleri, sıradaki ders. Not, test, kilit, tekrar — tek akış." },
            { n: "3", t: "Haritada pekiştir", d: "Fetih, jeoloji, kavram, tabu, panik. Mola da GY-GK sayılır." }
        ];
        return (
            <div className="land-page text-stone-100">
                <header className="land-nav">
                    <div className="land-nav-inner">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {logo}
                            <span className="font-display font-extrabold text-lg tracking-tight truncate">Atanly</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={props.onLogin} className="px-3.5 py-2 rounded-xl text-sm font-semibold text-gold-100/90 hover:bg-white/10">
                                Giriş yap
                            </button>
                            <button type="button" onClick={props.onSignup} className="px-3.5 py-2 rounded-xl text-sm font-bold bg-gold-500 text-stone-900 hover:bg-gold-400">
                                Ücretsiz başla
                            </button>
                        </div>
                    </div>
                </header>

                <section className="land-hero">
                    <p className="land-kicker mb-4">KPSS GY-GK · Türkiye geneli</p>
                    <h1 className="font-display font-extrabold text-[2.05rem] sm:text-[3.15rem] leading-[1.08] max-w-3xl">
                        Atamaya giden<br />çalışma odası.
                    </h1>
                    <p className="mt-5 text-[15px] sm:text-lg text-white/75 max-w-2xl leading-relaxed">
                        Bugünün hedefi, kilitli Tarih konuları, eksikler, seri ve trend, 81 ili fethet, volkan–fay haritası, az ipucu yüksek puan. Hepsi aynı Atanly. Lisans, ön lisans, ortaöğretim GY-GK.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
                        <button type="button" onClick={props.onSignup} className="flex-1 py-3.5 rounded-2xl font-bold bg-gold-500 text-stone-900 text-[15px] hover:bg-gold-400">
                            Ücretsiz hesap aç
                        </button>
                        <button type="button" onClick={props.onLogin} className="flex-1 py-3.5 rounded-2xl font-semibold border border-white/25 bg-white/5 hover:bg-white/10 text-[15px]">
                            Giriş yap
                        </button>
                    </div>
                    <p className="mt-4 text-xs text-white/45">Google ile de girebilirsin. Kart yok. İlerlemen yalnız senin.</p>
                </section>

                <section className="land-wide">
                    <div className="land-sun">
                        <p className="land-kicker mb-2">Yakında</p>
                        <p className="font-display font-extrabold text-xl sm:text-2xl leading-snug">Her Pazar, Türkiye geneli.</p>
                        <p className="text-sm text-white/70 mt-2 leading-relaxed">
                            Ortak tempo ve sıralama yolda. Şimdilik hedef, test ve oyunla ısın; Pazar geldiğinde hazır ol.
                        </p>
                    </div>
                </section>

                <section className="land-grid">
                    {feats.map(function (f) {
                        return (
                            <article key={f.t} className="land-card">
                                <h2 className="font-display font-bold text-lg text-white mb-2">{f.t}</h2>
                                <p className="text-sm text-white/65 leading-relaxed">{f.d}</p>
                            </article>
                        );
                    })}
                </section>

                <section className="land-wide">
                    <h2 className="font-display font-bold text-xl mb-2">İstatistik, seri, dağılım</h2>
                    <p className="text-sm text-white/60 mb-5 max-w-2xl leading-relaxed">
                        Kaç gün seri, oturum kaç dakika, rekor gün, bu hafta kaç saat. Çizgi yükselince gurur; düzleşince uyarı. Çalışma saati kaybolmaz.
                    </p>
                    <div className="land-game">
                        {stats.map(function (s) {
                            return (
                                <article key={s.t} className="land-card">
                                    <h3 className="font-display font-bold text-white mb-1.5">{s.t}</h3>
                                    <p className="text-sm text-white/65 leading-relaxed">{s.d}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="land-wide">
                    <h2 className="font-display font-bold text-xl mb-2">Eksikler: tekrar, yanlış, defter</h2>
                    <p className="text-sm text-white/60 mb-5 max-w-2xl leading-relaxed">
                        Konu durumu Dersler’den gelir. Bugün tekrar hatırlatır; yanlış defteri ısrar eder; tekrar defterin kilitli çekmecen.
                    </p>
                    <div className="land-game">
                        {eksik.map(function (s) {
                            return (
                                <article key={s.t} className="land-card">
                                    <h3 className="font-display font-bold text-white mb-1.5">{s.t}</h3>
                                    <p className="text-sm text-white/65 leading-relaxed">{s.d}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="land-wide">
                    <h2 className="font-display font-bold text-xl mb-2">Sistem, program gibi çalışır</h2>
                    <p className="text-sm text-white/60 mb-5 max-w-2xl leading-relaxed">
                        Rastgele PDF değil. Sıra, kilit, günlük saat, yanlış ve ısı. Atanly bugünü dizer.
                    </p>
                    <ol className="space-y-4">
                        {steps.map(function (s) {
                            return (
                                <li key={s.n} className="flex gap-4">
                                    <span className="land-stepnum">{s.n}</span>
                                    <div>
                                        <p className="font-semibold">{s.t}</p>
                                        <p className="text-sm text-white/60 mt-0.5 leading-relaxed">{s.d}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </section>

                <section className="land-wide">
                    <h2 className="font-display font-bold text-xl mb-2">Oyunlar: fetih, harita, kavram</h2>
                    <p className="text-sm text-white/60 mb-5 max-w-2xl leading-relaxed">
                        Alıştırmalar. 81 il, yer şekilleri, kavram avı. Hepsi GY-GK notundan; mola da çalışmaya sayılır.
                    </p>
                    <div className="land-game">
                        {games.map(function (g) {
                            return (
                                <article key={g.t} className="land-card">
                                    <h3 className="font-display font-bold text-white mb-1.5">{g.t}</h3>
                                    <p className="text-sm text-white/65 leading-relaxed">{g.d}</p>
                                </article>
                            );
                        })}
                    </div>
                    <p className="font-display font-bold text-white mt-8 mb-2">Harita oyunu · yer şekilleri</p>
                    <p className="text-sm text-white/60 mb-5 max-w-2xl leading-relaxed">
                        Konuyu seç, noktayı bul. Volkan, kırık, kıvrım, masif, fay, sakin kuşak — KPSS fiziki coğrafya haritada.
                    </p>
                    <div className="land-game">
                        {maps.map(function (g) {
                            return (
                                <article key={g.t} className="land-card">
                                    <h3 className="font-display font-bold text-white mb-1.5">{g.t}</h3>
                                    <p className="text-sm text-white/65 leading-relaxed">{g.d}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="land-wide land-faq" aria-labelledby="sss-title">
                    <h2 id="sss-title" className="font-display font-bold text-xl mb-4">Sık sorulanlar</h2>
                    <details>
                        <summary>Atanly nedir?</summary>
                        <p>{"KPSS GY-GK çalışma odası: günlük hedef, kilitli Tarih konuları, eksikler, istatistik, Türkiye'yi Fethet, harita ve kavram oyunları. Lisans, ön lisans, ortaöğretim."}</p>
                    </details>
                    <details>
                        <summary>Ücretsiz mi?</summary>
                        <p>Evet. Hesap ücretsiz. Kart yok. Google veya e-posta ile girersin.</p>
                    </details>
                    <details>
                        <summary>Hangi dersler açık?</summary>
                        <p>Tarih, coğrafya, Türkçe, vatandaşlık, güncel. Konular sırayla açılır. A grubu, eğitim, ÖABT sonra.</p>
                    </details>
                    <details>
                        <summary>App Store ve Play Store?</summary>
                        <p>Yakında. Şimdi tarayıcıdan tam Atanly. Aynı hesap uygulamaya taşınacak.</p>
                    </details>
                    <details>
                        <summary>Her Pazar Türkiye geneli nedir?</summary>
                        <p>Yakında: Pazar günü Türkiye çapında ortak tempo ve sıralama. Şimdilik not, test ve oyunla ısın.</p>
                    </details>
                </section>

                <section className="land-wide">
                    <div className="land-cta">
                        <p className="land-kicker mb-3">Mobil</p>
                        <p className="font-display font-extrabold text-2xl mb-2">{"Yakında App Store ve Play Store'da."}</p>
                        <p className="text-sm text-white/65 mb-5 leading-relaxed">
                            Şimdilik tarayıcıdan tam Atanly. iPhone ve Android uygulamaları yolda — aynı hesap, aynı ilerleme.
                        </p>
                        <div className="land-store mb-6">
                            <div className="land-store-btn" aria-label="App Store yakında">
                                <svg width="22" height="26" viewBox="0 0 22 26" fill="currentColor" aria-hidden="true"><path d="M18.1 13.6c0-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-1.9-.2-3.8 1.2-4.8 1.2-1 0-2.6-1.1-4.3-1.1-2.2 0-4.3 1.3-5.4 3.3-2.3 4-0.6 9.9 1.7 13.1 1.1 1.6 2.4 3.3 4.1 3.3 1.6-.1 2.2-1.1 4.2-1.1s2.5 1.1 4.3 1c1.8 0 2.9-1.6 4-3.2 1.2-1.8 1.7-3.5 1.7-3.6-.1 0-3.4-1.3-3.4-5.1zM15.2 4.3c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.9.9-3.8 2-.8.9-1.6 2.4-1.4 3.8 1.5.1 3-.8 3.9-1.7z"/></svg>
                                <span><small>Yakında</small><b>App Store</b></span>
                            </div>
                            <div className="land-store-btn" aria-label="Google Play yakında">
                                <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true"><path fill="#F5EBC7" d="M1.2 1.1c-.5.3-.8.8-.8 1.4v17c0 .6.3 1.1.8 1.4l14.6-9.9L1.2 1.1z"/><path fill="#C9A227" d="M16.8 12.3L3.8 21.1 18.6 13c.8-.5.8-1.6 0-2.1l-1.8 1.4z"/></svg>
                                <span><small>Yakında</small><b>Google Play</b></span>
                            </div>
                        </div>
                        <button type="button" onClick={props.onSignup} className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold bg-gold-500 text-stone-900">
                            {"Web'de şimdi başla"}
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-white/35 mt-8 leading-relaxed">
                        <a className="underline" href="yasal/aydinlatma.html">KVKK</a>
                        {" · "}
                        <a className="underline" href="yasal/kullanim.html">Kullanım</a>
                        {" · "}
                        <a className="underline" href="yasal/gizlilik.html">Gizlilik</a>
                        {" · "}
                        <a className="underline" href="yasal/cerez.html">Çerez</a>
                    </p>
                </section>
            </div>
        );
    }

    function getStrengthLabel(pass) {
        if (!pass) return { label: "Şifre gir", color: "text-stone-400", bg: "bg-stone-200" };
        if (pass.length < 6) return { label: "Zayıf (6+ karakter)", color: "text-rose-500", bg: "bg-rose-500" };
        if (pass.length < 10) return { label: "Orta", color: "text-amber-500", bg: "bg-amber-500" };
        return { label: "Güçlü ✅", color: "text-emerald-500", bg: "bg-emerald-500" };
    }

    function formatDate(iso) {
        if (!iso) return "";
        var parts = iso.split("-");
        if (parts.length === 3) {
            return parts[2] + "." + parts[1] + "." + parts[0];
        }
        return iso;
    }

    // ============================================================
    // ANA BİLEŞEN
    // ============================================================

    function AuthScreen(props) {
        const dates = (window.KpssConfig && window.KpssConfig.examDateByLevel) || {};
        
        // ---------- State ----------
        const [email, setEmail] = useState("");
        const [pass, setPass] = useState("");
        const [name, setName] = useState("");
        const [level, setLevel] = useState("lisans");
        const [target, setTarget] = useState("B");
        const [refCode, setRefCode] = useState("");
        const [examDate, setExamDate] = useState(dates.lisans || "2026-09-06");
        const [interest, setInterest] = useState({});
        const [mode, setMode] = useState("in");
        const [step, setStep] = useState(1);
        const [msg, setMsg] = useState("");
        const [busy, setBusy] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const [rememberMe, setRememberMe] = useState(false);
        const [showLand, setShowLand] = useState(function () {
            if (props.recovery) return false;
            return !wantAuthFromUrl();
        });
        const [recovery, setRecovery] = useState(function () {
            return !!(props.recovery || (window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending()));
        });
        const [newPass, setNewPass] = useState("");
        const [newPass2, setNewPass2] = useState("");
        const [recReady, setRecReady] = useState(false);

        const sb = window.SupabaseClient && window.SupabaseClient.get();
        const field = "w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-[15px] focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all";

        // ---------- Refs ----------
        const emailRef = useRef(null);
        const passRef = useRef(null);
        const nameRef = useRef(null);

        function goAuth(which) {
            var modeNext = which === "up" ? "up" : "in";
            setShowLand(false);
            setMode(modeNext);
            if (modeNext === "up") setStep(1);
            setMsg("");
            try {
                var flags = authUrlFlags();
                if (flags.reset || flags.code) return;
                var u = new URL(window.location.href);
                u.searchParams.delete("giris");
                u.searchParams.delete("kayit");
                u.searchParams.set(modeNext === "up" ? "kayit" : "giris", "1");
                window.history.pushState(
                    { atanlyView: "auth", atanlyMode: modeNext },
                    "",
                    u.pathname + u.search + u.hash
                );
            } catch (e) {}
        }

        function goLand() {
            try {
                if (window.history.state && window.history.state.atanlyView === "auth") {
                    window.history.back();
                    return;
                }
            } catch (e) {}
            setShowLand(true);
            setMsg("");
        }

        useEffect(function () {
            if (props.recovery) setRecovery(true);
        }, [props.recovery]);

        useEffect(function () {
            if (recovery || props.recovery) setShowLand(false);
        }, [recovery, props.recovery]);

        useEffect(function () {
            try {
                var flags = authUrlFlags();
                if (flags.kayit) setMode("up");
            } catch (e) {}
        }, []);

        useEffect(function () {
            if (recovery || props.recovery) return;
            try {
                var flags = authUrlFlags();
                if (flags.reset || flags.code) return;
                var u = new URL(window.location.href);
                var isAuth = flags.giris || flags.kayit;
                var authHref = u.pathname + u.search + u.hash;
                var modeNow = flags.kayit ? "up" : "in";
                u.searchParams.delete("giris");
                u.searchParams.delete("kayit");
                var landHref = u.pathname + u.search + u.hash;
                if (isAuth) {
                    window.history.replaceState({ atanlyView: "land" }, "", landHref);
                    window.history.pushState({ atanlyView: "auth", atanlyMode: modeNow }, "", authHref);
                } else if (!(window.history.state && window.history.state.atanlyView)) {
                    window.history.replaceState({ atanlyView: "land" }, "", landHref);
                }
            } catch (e) {}
        }, []);

        useEffect(function () {
            function onPop(e) {
                if (recovery || props.recovery) return;
                var st = e.state;
                if (st && st.atanlyView === "auth") {
                    setShowLand(false);
                    if (st.atanlyMode === "up" || st.atanlyMode === "in") setMode(st.atanlyMode);
                } else {
                    setShowLand(true);
                    setMsg("");
                }
            }
            window.addEventListener("popstate", onPop);
            return function () { window.removeEventListener("popstate", onPop); };
        }, [recovery, props.recovery]);

        useEffect(function () {
            if (!sb) return;
            var sub = sb.auth.onAuthStateChange(function (event) {
                if (event === "PASSWORD_RECOVERY") {
                    if (window.SupabaseClient && window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
                    setRecovery(true);
                }
            });
            return function () {
                if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
            };
        }, []);

        useEffect(function () {
            if (mode === "in" && !recovery && !showLand && emailRef.current) emailRef.current.focus();
        }, [mode, recovery, showLand]);

        useEffect(function () {
            if (!recovery) return;
            var sc = window.SupabaseClient;
            if (!sc || !sc.establishRecoverySession) return;
            var cancelled = false;
            sc.establishRecoverySession().then(function (sess) {
                if (cancelled) return;
                if (sess) {
                    if (sc.markRecovery) sc.markRecovery();
                    setRecReady(true);
                    setMsg("");
                } else {
                    setRecReady(false);
                    setMsg("Bağlantı henüz doğrulanamadı. Aynı tarayıcıda maildeki linke bir kez tıkla.");
                }
            }).catch(function () {
                if (cancelled) return;
                setRecReady(false);
                setMsg("Bağlantı henüz doğrulanamadı. Aynı tarayıcıda maildeki linke bir kez tıkla.");
            });
            return function () { cancelled = true; };
        }, [recovery]);

        // ---------- Levels ----------
        var levels = [
            { id: "lisans", t: "🎓 Lisans", d: "Her yıl yapılan GY-GK", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
            { id: "onlisans", t: "📘 Ön lisans", d: "Çift yıllarda", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
            { id: "ortaogretim", t: "🏫 Ortaöğretim", d: "Çift yıllarda", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" }
        ];

        var targets = [
            { id: "B", t: "B Grubu", d: "Standart memurluk · yalnızca GY-GK", ready: true, icon: "book", color: "bg-indigo-100 text-indigo-700" },
            { id: "A", t: "A Grubu", d: "GY-GK + hukuk, iktisat, maliye", ready: false, icon: "scale", color: "bg-purple-100 text-purple-700" },
            { id: "ogretmen", t: "Öğretmenlik", d: "GY-GK + eğitim bilimleri + ÖABT", ready: false, icon: "cap", color: "bg-rose-100 text-rose-700" },
            { id: "dhbt", t: "DHBT", d: "GY-GK + din hizmetleri", ready: false, icon: "book", color: "bg-emerald-100 text-emerald-700" }
        ];

        // ---------- Password Strength ----------
        const passStrength = getStrengthLabel(pass);

        // ---------- Save Pending ----------
        function savePending() {
            try {
                sessionStorage.setItem("kpss-signup-profile", JSON.stringify({
                    name: name,
                    educationLevel: level,
                    examDate: examDate,
                    targetType: level === "lisans" ? target : "B",
                    referredBy: refCode,
                    moduleInterest: Object.keys(interest).filter(function (k) { return interest[k]; })
                }));
            } catch (e) {}
        }

        // ---------- Finish Local ----------
        function finishLocal(user) {
            if (window.StudentStore && window.StudentStore.bindToUser && user) {
                window.StudentStore.bindToUser(user.id, user.email);
            }
            if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
                window.StudentStore.consumeSignupIfNeeded(user);
            }
            if (window.SyncEngine) window.SyncEngine.sync();
            if (props.onDone) props.onDone();
        }

        // ---------- Submit ----------
        async function saveNewPassword() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
            if (!validatePassword(newPass)) { setMsg("Yeni şifre en az 6 karakter olmalı."); return; }
            if (newPass !== newPass2) { setMsg("Şifreler eşleşmiyor."); return; }
            setBusy(true);
            setMsg("");
            try {
                var sess = null;
                if (window.SupabaseClient && window.SupabaseClient.establishRecoverySession) {
                    sess = await window.SupabaseClient.establishRecoverySession();
                }
                if (!sess) throw new Error("Oturum yok. Aynı tarayıcıda yeni sıfırlama maili iste, linke bir kez tıkla.");
                var res = await sb.auth.updateUser({ password: newPass });
                if (res.error) throw res.error;
                if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                setRecovery(false);
                setNewPass("");
                setNewPass2("");
                setMsg("✅ Şifren güncellendi.");
                if (props.onPasswordUpdated) props.onPasswordUpdated();
                else if (props.onDone) props.onDone();
            } catch (e) {
                setMsg(window.trError ? window.trError(e, "Şifre güncellenemedi.") : "Şifre güncellenemedi.");
            }
            setBusy(false);
        }

        async function submit() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
            if (!email || !validateEmail(email)) { setMsg("Geçerli bir e-posta adresi girin."); return; }
            if (!validatePassword(pass)) { setMsg("Şifre en az 6 karakter olmalı."); return; }

            if (mode === "up") {
                if (!name.trim()) { setMsg("Adınızı yazın."); return; }
                savePending();
            }

            if (Date.now() < loginLockUntil) {
                setMsg(loginLockedMsg());
                return;
            }

            setBusy(true);
            setMsg("");

            try {
                var res = mode === "up"
                    ? await sb.auth.signUp({
                        email: email,
                        password: pass,
                        options: {
                            data: {
                                full_name: name.trim(),
                                education_level: level,
                                exam_date: examDate,
                                target_type: target
                            }
                        }
                    })
                    : await sb.auth.signInWithPassword({ email: email, password: pass });

                if (res.error) {
                    loginFails += 1;
                    if (loginFails >= 5) {
                        var wait = Math.min(180000, 30000 * Math.pow(2, loginFails - 5));
                        loginLockUntil = Date.now() + wait;
                    }
                    setMsg(window.trError ? window.trError(res.error, "Giriş yapılamadı.") : "Giriş yapılamadı.");
                    if (Date.now() < loginLockUntil) setMsg(loginLockedMsg());
                } else if (mode === "up" && !(res.data && res.data.session)) {
                    setMsg("✅ Kayıt tamam! E-postanıza gelen linke tıklayarak hesabınızı doğrulayın.");
                } else {
                    loginFails = 0;
                    loginLockUntil = 0;
                    if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                    finishLocal(res.data && res.data.user);
                }
            } catch (e) {
                setMsg(window.trError ? window.trError(e, "İşlem tamamlanamadı.") : "İşlem tamamlanamadı.");
            }
            setBusy(false);
        }

        // ---------- Google ----------
        async function google() {
            if (!sb) { setMsg("Sunucu bağlı değil."); return; }

            if (mode === "up") {
                if (!name.trim()) { setMsg("Google ile kayıt için adınızı yazın."); return; }
                if (step < 3) { setMsg("Önce tüm adımları tamamlayın."); return; }
                savePending();
            }

            setBusy(true);
            setMsg("");
            if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();

            try {
                var res = await sb.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: window.location.origin + (window.location.pathname || "/")
                    }
                });
                if (res.error) setMsg(window.trError ? window.trError(res.error, "Google ile giriş açılamadı.") : "Google ile giriş açılamadı.");
            } catch (e) {
                setMsg(window.trError ? window.trError(e, "Google ile giriş açılamadı.") : "Google ile giriş açılamadı.");
            }
            setBusy(false);
        }

        // ---------- Enter Key ----------
        function goAfterEducation() {
            if (level === "lisans") {
                setStep(2);
            } else {
                setTarget("B");
                setStep(3);
            }
            setMsg("");
        }

        function handleKeyDown(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                if (mode === "in") {
                    submit();
                } else if (step === 1 && name.trim()) {
                    goAfterEducation();
                } else if (step === 2) {
                    setStep(3);
                } else if (step === 3) {
                    submit();
                }
            }
        }

        // ---------- Card Class ----------
        function cardCls(on, dim) {
            return "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 text-stone-800 " +
                (on 
                    ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/10" 
                    : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-indigo-300 dark:hover:border-indigo-700") +
                (dim ? " opacity-50" : "");
        }

        // ---------- Step Indicator ----------
        function StepIndicator({ current, total }) {
            return (
                <div className="flex gap-1.5 mb-6">
                    {Array.from({ length: total }, function (_, i) {
                        var idx = i + 1;
                        var isActive = idx === current;
                        var isPast = idx < current;
                        return (
                            <div key={idx} className="flex-1 flex items-center gap-1">
                                <div className={"h-2 rounded-full transition-all duration-300 flex-1 " + 
                                    (isActive ? "bg-indigo-600 shadow-md shadow-indigo-500/30" : 
                                     isPast ? "bg-emerald-500" : "bg-stone-200 dark:bg-stone-700")} />
                                {idx < total && (
                                    <span className="text-[10px] text-stone-400">
                                        {isPast ? "✓" : "·"}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        // ============================================================
        // SIGNUP FORM
        // ============================================================

        var signup = null;
        if (mode === "up") {
            signup = (
                <div className="slide-step">
                    <StepIndicator current={step} total={3} />

                    {/* Step 1: Name & Education */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-name">
                                    👤 Adınız
                                </label>
                                <input 
                                    id="au-name" 
                                    ref={nameRef}
                                    value={name} 
                                    onChange={function (e) { setName(e.target.value); }} 
                                    onKeyDown={handleKeyDown}
                                    className={field} 
                                    placeholder="Adını yaz"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2">🎯 Eğitim Düzeyiniz</p>
                                <div className="space-y-2">
                                    {levels.map(function (x) {
                                        var isActive = level === x.id;
                                        return (
                                            <button 
                                                key={x.id} 
                                                type="button" 
                                                onClick={function () {
                                                    setLevel(x.id);
                                                    if (dates[x.id]) setExamDate(dates[x.id]);
                                                }} 
                                                className={cardCls(isActive, false)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-display font-semibold text-base text-stone-800 dark:text-stone-100">{x.t}</div>
                                                        <div className="text-sm text-stone-500 mt-0.5">{x.d}</div>
                                                    </div>
                                                    {isActive && (
                                                        <span className="text-indigo-600 text-xl">✓</span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button 
                                type="button" 
                                disabled={!name.trim()} 
                                onClick={function () { goAfterEducation(); }}
                                className="w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
                            >
                                Devam →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Target */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300 mb-2">🎯 Hedef Türünüz</p>
                                <div className="space-y-2">
                                    {targets.map(function (x) {
                                        var on = target === x.id;
                                        return (
                                            <button 
                                                key={x.id} 
                                                type="button" 
                                                onClick={function () {
                                                    setTarget(x.id);
                                                    if (!x.ready) {
                                                        var n = Object.assign({}, interest);
                                                        n[x.id] = true;
                                                        setInterest(n);
                                                    }
                                                }} 
                                                className={cardCls(on, !x.ready)}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 font-display font-semibold text-stone-800 dark:text-stone-100">
                                                            <span className="text-lg">{x.icon === "book" ? "📖" : x.icon === "scale" ? "⚖️" : x.icon === "cap" ? "🎓" : "📚"}</span>
                                                            {x.t}
                                                        </div>
                                                        <div className="text-sm text-stone-500 mt-0.5">{x.d}</div>
                                                    </div>
                                                    {!x.ready ? (
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 shrink-0">
                                                            ⏳ Yakında
                                                        </span>
                                                    ) : on ? (
                                                        <span className="text-indigo-600 text-xl shrink-0">✓</span>
                                                    ) : null}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    onClick={function () { setStep(1); }} 
                                    className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    ← Geri
                                </button>
                                <button 
                                    type="button" 
                                    onClick={function () { setStep(3); setMsg(""); }} 
                                    className="flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold"
                                >
                                    Devam →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Account */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 p-4 border border-indigo-100 dark:border-indigo-800/30">
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    📌 <strong>GY-GK</strong> hazır. Diğer modüller açıldığında haberdar olacaksınız.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-mail">
                                    📧 E-posta
                                </label>
                                <input 
                                    id="au-mail" 
                                    ref={emailRef}
                                    type="email" 
                                    autoComplete="email" 
                                    value={email} 
                                    onChange={function (e) { setEmail(e.target.value); }} 
                                    onKeyDown={handleKeyDown}
                                    className={field} 
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-pass">
                                    🔒 Şifre
                                </label>
                                <div className="relative">
                                    <input 
                                        id="au-pass" 
                                        ref={passRef}
                                        type={showPassword ? "text" : "password"} 
                                        autoComplete="new-password" 
                                        value={pass} 
                                        onChange={function (e) { setPass(e.target.value); }} 
                                        onKeyDown={handleKeyDown}
                                        className={field + " pr-12"} 
                                        placeholder="En az 6 karakter"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={function () { setShowPassword(!showPassword); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <div className="flex-1 h-1 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                        <div className={"h-full transition-all duration-300 " + passStrength.bg} 
                                             style={{ width: pass ? Math.min(100, (pass.length / 10) * 100) + "%" : "0%" }} />
                                    </div>
                                    <span className={"text-[10px] font-medium " + passStrength.color}>
                                        {passStrength.label}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-date">
                                    📅 Sınav Tarihi
                                </label>
                                <input 
                                    id="au-date" 
                                    type="date" 
                                    value={examDate} 
                                    onChange={function (e) { setExamDate(e.target.value); }} 
                                    className={field}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="au-ref">
                                    🔑 Davet Kodu <span className="text-xs text-stone-400 font-normal">(opsiyonel)</span>
                                </label>
                                <input 
                                    id="au-ref" 
                                    value={refCode} 
                                    onChange={function (e) { setRefCode(e.target.value); }} 
                                    className={field} 
                                    placeholder="Örn: KPSS-ABCD12"
                                />
                            </div>

                            <p className="text-[11px] text-stone-500 leading-relaxed">
                                Hesap oluşturarak{" "}
                                <a className="text-teal-700 font-semibold underline" href="yasal/kullanim.html" target="_blank" rel="noopener">Kullanım Koşulları</a>
                                {" "}ile{" "}
                                <a className="text-teal-700 font-semibold underline" href="yasal/uyelik.html" target="_blank" rel="noopener">Üyelik Sözleşmesi</a>
                                {"'ni kabul etmiş olursunuz. Kişisel verileriniz hakkında "}
                                <a className="text-teal-700 font-semibold underline" href="yasal/aydinlatma.html" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a>
                                {"'ni inceleyebilirsiniz. "}
                                <a className="underline" href="yasal/gizlilik.html" target="_blank" rel="noopener">Gizlilik</a>
                                {" · "}
                                <a className="underline" href="yasal/cerez.html" target="_blank" rel="noopener">Çerezler</a>
                            </p>

                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    onClick={function () { setStep(level === "lisans" ? 2 : 1); }} 
                                    className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    ← Geri
                                </button>
                                <button 
                                    type="button" 
                                    disabled={busy || !validateEmail(email) || !validatePassword(pass)} 
                                    onClick={submit} 
                                    className="flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
                                >
                                    {busy ? "⏳" : "🚀 Kayıt Ol"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // ============================================================
        // LOGIN FORM
        // ============================================================

        var loginForm = mode === "in" ? (
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="login-email">
                        📧 E-posta
                    </label>
                    <input 
                        id="login-email" 
                        ref={emailRef}
                        type="email" 
                        autoComplete="email" 
                        value={email} 
                        onChange={function (e) { setEmail(e.target.value); }} 
                        onKeyDown={handleKeyDown}
                        className={field} 
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5" htmlFor="login-pass">
                        🔒 Şifre
                    </label>
                    <div className="relative">
                        <input 
                            id="login-pass" 
                            ref={passRef}
                            type={showPassword ? "text" : "password"} 
                            autoComplete="current-password" 
                            value={pass} 
                            onChange={function (e) { setPass(e.target.value); }} 
                            onKeyDown={handleKeyDown}
                            className={field + " pr-12"} 
                            placeholder="••••••••"
                        />
                        <button 
                            type="button" 
                            onClick={function () { setShowPassword(!showPassword); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-stone-500 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={rememberMe} 
                            onChange={function (e) { setRememberMe(e.target.checked); }} 
                            className="w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Beni Hatırla
                    </label>
                    <button 
                        type="button" 
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        onClick={async function () {
                            if (!email || !validateEmail(email)) {
                                setMsg("Şifre sıfırlama için e-posta adresinizi girin.");
                                if (emailRef.current) emailRef.current.focus();
                                return;
                            }
                            if (!sb) { setMsg("Sunucu bağlı değil."); return; }
                            if (Date.now() < loginLockUntil) { setMsg(loginLockedMsg()); return; }
                            setBusy(true);
                            setMsg("");
                            try {
                                if (window.SupabaseClient && window.SupabaseClient.clearRecoveryFlag) {
                                    window.SupabaseClient.clearRecoveryFlag();
                                }
                                var resetTo = window.location.origin + (window.location.pathname || "/") + "?reset=1";
                                await sb.auth.resetPasswordForEmail(email.trim(), {
                                    redirectTo: resetTo
                                });
                                loginFails += 1;
                                if (loginFails >= 5) {
                                    loginLockUntil = Date.now() + 60000;
                                }
                                setMsg("Hesap varsa şifre sıfırlama bağlantısı gönderildi. Spam klasörüne de bak.");
                            } catch (e) {
                                var em = window.trError ? window.trError(e, "") : "";
                                if (/çok sık|bağlantı|sunucu|zaman aşımı/i.test(em)) setMsg(em);
                                else setMsg("Hesap varsa şifre sıfırlama bağlantısı gönderildi. Spam klasörüne de bak.");
                            }
                            setBusy(false);
                        }}
                    >
                        Şifremi Unuttum
                    </button>
                </div>

                <button 
                    disabled={busy || !validateEmail(email) || !validatePassword(pass)} 
                    onClick={submit} 
                    className="w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
                >
                    {busy ? "⏳" : "🔓 Giriş Yap"}
                </button>

                <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200 dark:border-stone-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white dark:bg-stone-900 text-stone-400">veya</span>
                    </div>
                </div>

                <button 
                    type="button" 
                    disabled={busy} 
                    onClick={google}
                    className="w-full py-3.5 rounded-2xl btn-google font-semibold text-sm flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google ile Devam
                </button>
                <p className="text-[11px] text-stone-500 text-center">İlk kez Google ile gelince ad, eğitim ve kulvar sorulur.</p>
            </div>
        ) : null;

        // ============================================================
        // MAIN RENDER
        // ============================================================

        var form = (
            <div className={props.gate ? "" : "p-6 sm:p-8"}>
                {recovery ? (
                    <div className="space-y-4">
                        <p className="text-sm text-stone-500">Yeni şifreni yaz. En az 6 karakter.</p>
                        <div>
                            <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5">Yeni şifre</label>
                            <input type={showPassword ? "text" : "password"} value={newPass} onChange={function (e) { setNewPass(e.target.value); }} className={field} placeholder="••••••••" autoComplete="new-password" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5">Yeni şifre (tekrar)</label>
                            <input type={showPassword ? "text" : "password"} value={newPass2} onChange={function (e) { setNewPass2(e.target.value); }} className={field} placeholder="••••••••" autoComplete="new-password" />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-stone-500 cursor-pointer">
                            <input type="checkbox" checked={showPassword} onChange={function (e) { setShowPassword(e.target.checked); }} className="w-4 h-4 rounded border-stone-300 text-indigo-600" />
                            Şifreyi göster
                        </label>
                        <button type="button" disabled={busy || !recReady} onClick={saveNewPassword} className="w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40">
                            {busy ? "⏳" : (recReady ? "Şifreyi kaydet" : "Bağlantı doğrulanıyor…")}
                        </button>
                        <button type="button" className="w-full text-sm text-stone-500" onClick={function () {
                            if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
                            setRecovery(false);
                            setRecReady(false);
                            if (props.onRecoveryFailed) props.onRecoveryFailed();
                        }}>Girişe dön</button>
                    </div>
                ) : (
                    <div>
                {props.gate ? (
                    <button type="button" onClick={goLand} className="mb-4 text-sm font-medium text-stone-500 hover:text-stone-800">
                        ← Tanıtıma dön
                    </button>
                ) : null}
                {/* Mode Toggle */}
                <div className="flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 mb-6">
                    <button 
                        type="button" 
                        onClick={function () { setMode("in"); setMsg(""); setStep(1); setPass(""); }}
                        className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " + 
                            (mode === "in" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")}
                    >
                        🔐 Giriş
                    </button>
                    <button 
                        type="button" 
                        onClick={function () { setMode("up"); setMsg(""); setStep(1); setPass(""); }}
                        className={"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " + 
                            (mode === "up" 
                                ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" 
                                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")}
                    >
                        📝 Kayıt
                    </button>
                </div>

                {signup}
                {loginForm}

                {mode === "up" && step === 3 && (
                    <div className="mt-3">
                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-stone-200 dark:border-stone-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white dark:bg-stone-900 text-stone-400">veya</span>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            disabled={busy} 
                            onClick={google}
                            className="w-full py-3.5 rounded-2xl btn-google font-semibold text-sm flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google ile Kayıt Ol
                        </button>
                    </div>
                )}
                    </div>
                )}

                {msg && (
                    <div className={"mt-4 p-4 rounded-2xl text-sm flex items-start gap-3 " + 
                        (msg.includes("✅") || msg.includes("tamam") 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" 
                            : "bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300")}
                    >
                        <span className="text-lg shrink-0">{msg.includes("✅") || msg.includes("tamam") ? "✅" : "⚠️"}</span>
                        <span className="whitespace-pre-line">{msg}</span>
                    </div>
                )}
            </div>
        );

        // ============================================================
        // GATE MODE (Full Page)
        // ============================================================

        if (!props.gate) return form;

        if (showLand && !recovery) {
            return (
                <LandingPage
                    onLogin={function () { goAuth("in"); }}
                    onSignup={function () { goAuth("up"); }}
                />
            );
        }

        return (
            <div className="brand-backdrop min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
                <div className="brand-glow" aria-hidden="true"></div>
                <div className="brand-ring brand-ring-outer" aria-hidden="true"></div>
                <div className="brand-ring brand-ring-inner" aria-hidden="true"></div>
                <div className="relative z-10 w-full max-w-md bg-white dark:bg-stone-900 rounded-[28px] shadow-2xl p-6 sm:p-8 text-stone-800 fade-in">
                    <div className="text-center mb-6">
                        {window.AtanomLogo
                            ? window.AtanomLogo("h-24 w-24 mx-auto mb-3 object-contain drop-shadow-sm")
                            : <img src="icons/atanom.png" alt="Atanly" className="h-24 w-24 mx-auto mb-3 object-contain" />}
                        <h1 className="text-2xl md:text-3xl font-black gradient-text">Atanly</h1>
                        <p className="text-sm text-stone-500 mt-1">
                            {recovery
                                ? "Maildeki bağlantı seni buraya getirdi"
                                : (mode === "up"
                                ? "Hedefine doğru ilk adımı at"
                                : "Kaldığın yerden devam et")}
                        </p>
                    </div>

                    {form}
                    <p className="text-[10px] text-center text-stone-400 mt-4 leading-relaxed">
                        <a className="underline" href="yasal/aydinlatma.html">KVKK Aydınlatma</a>
                        {" · "}
                        <a className="underline" href="yasal/kullanim.html">Kullanım</a>
                        {" · "}
                        <a className="underline" href="yasal/uyelik.html">Üyelik</a>
                        {" · "}
                        <a className="underline" href="yasal/gizlilik.html">Gizlilik</a>
                        {" · "}
                        <a className="underline" href="yasal/cerez.html">Çerez</a>
                        {" · "}
                        <a className="underline" href="yasal/basvuru.html">KVKK başvuru</a>
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================
    // EXPORT
    // ============================================================

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.AuthScreen = AuthScreen;

})();