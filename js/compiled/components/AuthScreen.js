/*jsx:babel-7.29.9-react-classic:64267:q2ig62*/
(function () {
  const {
    useState,
    useEffect,
    useRef,
    useCallback
  } = React;
  const Ic = function (n, c) {
    return window.KpssIcon ? window.KpssIcon(n, c) : null;
  };

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
      if (q.get("type") === "recovery") return true;
      if (q.get("code") && q.get("type") !== "signup") return true;
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
      return {
        reset: false,
        code: false,
        giris: false,
        kayit: false
      };
    }
  }
  function LandingPage(props) {
    var logo = window.AtanomLogo ? window.AtanomLogo("h-14 w-14 object-contain") : /*#__PURE__*/React.createElement("img", {
      src: "icons/atanom.png?v=18",
      alt: "Atanly",
      className: "h-14 w-14 object-contain"
    });
    var shots = [{
      src: "img/landing/hedef.png?v=1",
      t: "Bugünün hedefi"
    }, {
      src: "img/landing/istatistik.png?v=1",
      t: "İstatistikler"
    }, {
      src: "img/landing/hafta.png?v=1",
      t: "Bu hafta · ders dağılımı"
    }, {
      src: "img/landing/tarih.png?v=1",
      t: "Tarih konuları"
    }, {
      src: "img/landing/eksikler.png?v=1",
      t: "Eksikler"
    }, {
      src: "img/landing/harita.png?v=1",
      t: "Harita oyunu"
    }, {
      src: "img/landing/fethet.png?v=1",
      t: "Türkiye'yi Fethet"
    }, {
      src: "img/landing/kavram.png?v=1",
      t: "Kavram · az ipucu"
    }];
    var feats = [{
      t: "Konu konu not",
      d: "Tarih, coğrafya, Türkçe, vatandaşlık, güncel. PDF yığını yok: her konu kendi notuyla açılır, sırayı atlayamazsın."
    }, {
      t: "Test ve aralıklı tekrar",
      d: "Paketler kilitli ilerler. Yanlışın deftere düşer; sistem zayıf konuyu öne çeker, unutma eğrisine göre geri getirir."
    }, {
      t: "Günlük program",
      d: "Sınav tarihine göre tempo, günlük soru hedefi, 30 günlük ısı haritası. Bugün ne çalışacağını uygulama söyler."
    }];
    var games = [{
      t: "Fetih haritası",
      d: "Türkiye illerini soruyla boya. Bölge bölge ilerle, coğrafyayı ezber değil yer olarak öğren."
    }, {
      t: "KPSS haritaları",
      d: "Fiziki, iklim, nüfus, maden, ulaşım. Konuyu seç, noktayı haritada işaretle."
    }, {
      t: "Tabu",
      d: "Yasaklı kelimelere takılmadan tanımı yakala. Vatandaşlık ve güncel için tempo."
    }, {
      t: "Panik ve boşluk",
      d: "Süre daralır, şıklar döner. Boşluk doldurma ile cümleyi tamamla — sınav stiline yakın."
    }];
    var steps = [{
      n: "1",
      t: "Kulvarını seç",
      d: "Lisans, ön lisans veya ortaöğretim. Google veya e-posta. İlerleme hesabına yazılır."
    }, {
      n: "2",
      t: "Programı takip et",
      d: "Notu bitir, testi aç. Zayıf konu ve yanlışlar ertesi günün planına girer."
    }, {
      n: "3",
      t: "Oyunla pekiştir",
      d: "Harita ve tempo oyunları aynı bankadan beslenir. Eğlence ayrı uygulama değil; aynı Atanly."
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "land-page text-stone-100"
    }, /*#__PURE__*/React.createElement("header", {
      className: "land-nav"
    }, /*#__PURE__*/React.createElement("div", {
      className: "land-nav-inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 min-w-0"
    }, logo, /*#__PURE__*/React.createElement("span", {
      className: "font-display font-extrabold text-lg tracking-tight truncate"
    }, "Atanly")), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 shrink-0"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: props.onLogin,
      className: "px-3.5 py-2 rounded-xl text-sm font-semibold text-gold-100/90 hover:bg-white/10"
    }, "Giri\u015F yap"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: props.onSignup,
      className: "px-3.5 py-2 rounded-xl text-sm font-bold bg-gold-500 text-stone-900 hover:bg-gold-400"
    }, "\xDCcretsiz ba\u015Fla")))), /*#__PURE__*/React.createElement("section", {
      className: "land-hero"
    }, /*#__PURE__*/React.createElement("p", {
      className: "land-kicker mb-4"
    }, "KPSS GY-GK \xB7 T\xFCrkiye geneli"), /*#__PURE__*/React.createElement("h1", {
      className: "font-display font-extrabold text-[2.05rem] sm:text-[3.15rem] leading-[1.08] max-w-3xl"
    }, "Atamaya giden", /*#__PURE__*/React.createElement("br", null), "\xE7al\u0131\u015Fma odas\u0131."), /*#__PURE__*/React.createElement("p", {
      className: "mt-5 text-[15px] sm:text-lg text-white/75 max-w-2xl leading-relaxed"
    }, "Atanly, da\u011F\u0131n\u0131k kaynaklar\u0131 tek programa ba\u011Flar. Notu oku, kilidi a\xE7, testi \xE7\xF6z, yanl\u0131\u015F\u0131n\u0131 tekrar et, haritada peki\u015Ftir. Lisans / \xF6n lisans / orta\xF6\u011Fretim \u2014 ayn\u0131 sistem, senin s\u0131nav takvimine g\xF6re."), /*#__PURE__*/React.createElement("div", {
      className: "mt-8 flex flex-col sm:flex-row gap-3 max-w-md"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: props.onSignup,
      className: "flex-1 py-3.5 rounded-2xl font-bold bg-gold-500 text-stone-900 text-[15px] hover:bg-gold-400"
    }, "\xDCcretsiz hesap a\xE7"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: props.onLogin,
      className: "flex-1 py-3.5 rounded-2xl font-semibold border border-white/25 bg-white/5 hover:bg-white/10 text-[15px]"
    }, "Giri\u015F yap")), /*#__PURE__*/React.createElement("p", {
      className: "mt-4 text-xs text-white/45"
    }, "Google ile de girebilirsin. Kart yok. \u0130lerlemen yaln\u0131z senin.")), /*#__PURE__*/React.createElement("section", {
      className: "land-wide"
    }, /*#__PURE__*/React.createElement("div", {
      className: "land-sun"
    }, /*#__PURE__*/React.createElement("p", {
      className: "land-kicker mb-2"
    }, "Yak\u0131nda"), /*#__PURE__*/React.createElement("p", {
      className: "font-display font-extrabold text-xl sm:text-2xl leading-snug"
    }, "Her Pazar, T\xFCrkiye geneli."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-white/70 mt-2 leading-relaxed"
    }, "Haftan\u0131n kilidi Pazar: ayn\u0131 anda T\xFCrkiye \xE7ap\u0131nda tempo. S\u0131ralama ve ortak saat yak\u0131nda a\xE7\u0131l\u0131r \u2014 \u015Fimdilik not, test ve oyunlarla \u0131s\u0131n, Pazar geldi\u011Finde haz\u0131r ol."))), /*#__PURE__*/React.createElement("section", {
      className: "land-grid"
    }, feats.map(function (f) {
      return /*#__PURE__*/React.createElement("article", {
        key: f.t,
        className: "land-card"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "font-display font-bold text-lg text-white mb-2"
      }, f.t), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-white/65 leading-relaxed"
      }, f.d));
    })), /*#__PURE__*/React.createElement("section", {
      className: "land-wide"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "font-display font-bold text-xl mb-2"
    }, "Sistem, program gibi \xE7al\u0131\u015F\u0131r"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-white/60 mb-5 max-w-2xl leading-relaxed"
    }, "Rastgele soru \xE7\xF6zmek de\u011Fil. Konu kilitleri, g\xFCnl\xFCk hedef, zay\u0131f konu \xF6ne \xE7ekme, yanl\u0131\u015F defteri, 30 g\xFCnl\xFCk \u0131s\u0131. Bug\xFCn ne yapaca\u011F\u0131n\u0131 sen aramazs\u0131n; Atanly s\u0131raya koyar."), /*#__PURE__*/React.createElement("ol", {
      className: "space-y-4"
    }, steps.map(function (s) {
      return /*#__PURE__*/React.createElement("li", {
        key: s.n,
        className: "flex gap-4"
      }, /*#__PURE__*/React.createElement("span", {
        className: "land-stepnum"
      }, s.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        className: "font-semibold"
      }, s.t), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-white/60 mt-0.5 leading-relaxed"
      }, s.d)));
    }))), /*#__PURE__*/React.createElement("section", {
      className: "land-wide"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "font-display font-bold text-xl mb-2"
    }, "Oyunlar da bankan\u0131n i\xE7inde"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-white/60 mb-5 max-w-2xl leading-relaxed"
    }, "Ayr\u0131 bir e\u011Flence uygulamas\u0131 yok. Fetih, harita, tabu, panik \u2014 hepsi GY-GK konular\u0131ndan \xFCretilir. Mola verdi\u011Fin an da \xE7al\u0131\u015Fmaya say\u0131l\u0131r."), /*#__PURE__*/React.createElement("div", {
      className: "land-game"
    }, games.map(function (g) {
      return /*#__PURE__*/React.createElement("article", {
        key: g.t,
        className: "land-card"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "font-display font-bold text-white mb-1.5"
      }, g.t), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-white/65 leading-relaxed"
      }, g.d));
    }))), /*#__PURE__*/React.createElement("section", {
      className: "land-wide"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "font-display font-bold text-xl mb-4"
    }, "Uygulamadan"), /*#__PURE__*/React.createElement("div", {
      className: "land-shots"
    }, shots.map(function (s) {
      return /*#__PURE__*/React.createElement("figure", {
        key: s.src,
        className: "land-shot"
      }, /*#__PURE__*/React.createElement("img", {
        src: s.src,
        alt: s.t,
        width: "900",
        height: "700",
        loading: "lazy"
      }), /*#__PURE__*/React.createElement("figcaption", null, s.t));
    }))), /*#__PURE__*/React.createElement("section", {
      className: "land-wide land-faq",
      "aria-labelledby": "sss-title"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "sss-title",
      className: "font-display font-bold text-xl mb-4"
    }, "S\u0131k sorulanlar"), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, "Atanly nedir?"), /*#__PURE__*/React.createElement("p", null, "KPSS GY-GK not, test, tekrar ve oyun. Lisans, \xF6n lisans, orta\xF6\u011Fretim.")), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, "\xDCcretsiz mi?"), /*#__PURE__*/React.createElement("p", null, "Evet. Hesap \xFCcretsiz. Kart yok. Google veya e-posta ile girersin.")), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, "Hangi dersler a\xE7\u0131k?"), /*#__PURE__*/React.createElement("p", null, "Tarih, co\u011Frafya, T\xFCrk\xE7e, vatanda\u015Fl\u0131k, g\xFCncel, geometri.")), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, "App Store ve Play Store?"), /*#__PURE__*/React.createElement("p", null, "Yak\u0131nda. \u015Eimdi taray\u0131c\u0131dan tam Atanly. Ayn\u0131 hesap uygulamaya ta\u015F\u0131nacak.")), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", null, "Her Pazar T\xFCrkiye geneli nedir?"), /*#__PURE__*/React.createElement("p", null, "Yak\u0131nda: Pazar g\xFCn\xFC T\xFCrkiye \xE7ap\u0131nda ortak tempo ve s\u0131ralama. \u015Eimdilik not, test ve oyunla \u0131s\u0131n."))), /*#__PURE__*/React.createElement("section", {
      className: "land-wide"
    }, /*#__PURE__*/React.createElement("div", {
      className: "land-cta"
    }, /*#__PURE__*/React.createElement("p", {
      className: "land-kicker mb-3"
    }, "Mobil"), /*#__PURE__*/React.createElement("p", {
      className: "font-display font-extrabold text-2xl mb-2"
    }, "Yakında App Store ve Play Store'da."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-white/65 mb-5 leading-relaxed"
    }, "\u015Eimdilik taray\u0131c\u0131dan tam Atanly. iPhone ve Android uygulamalar\u0131 yolda \u2014 ayn\u0131 hesap, ayn\u0131 ilerleme."), /*#__PURE__*/React.createElement("div", {
      className: "land-store mb-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "land-store-btn",
      "aria-label": "App Store yak\u0131nda"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "26",
      viewBox: "0 0 22 26",
      fill: "currentColor",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18.1 13.6c0-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-1.9-.2-3.8 1.2-4.8 1.2-1 0-2.6-1.1-4.3-1.1-2.2 0-4.3 1.3-5.4 3.3-2.3 4-0.6 9.9 1.7 13.1 1.1 1.6 2.4 3.3 4.1 3.3 1.6-.1 2.2-1.1 4.2-1.1s2.5 1.1 4.3 1c1.8 0 2.9-1.6 4-3.2 1.2-1.8 1.7-3.5 1.7-3.6-.1 0-3.4-1.3-3.4-5.1zM15.2 4.3c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.9.9-3.8 2-.8.9-1.6 2.4-1.4 3.8 1.5.1 3-.8 3.9-1.7z"
    })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("small", null, "Yak\u0131nda"), /*#__PURE__*/React.createElement("b", null, "App Store"))), /*#__PURE__*/React.createElement("div", {
      className: "land-store-btn",
      "aria-label": "Google Play yak\u0131nda"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "22",
      viewBox: "0 0 20 22",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      fill: "#F5EBC7",
      d: "M1.2 1.1c-.5.3-.8.8-.8 1.4v17c0 .6.3 1.1.8 1.4l14.6-9.9L1.2 1.1z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#C9A227",
      d: "M16.8 12.3L3.8 21.1 18.6 13c.8-.5.8-1.6 0-2.1l-1.8 1.4z"
    })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("small", null, "Yak\u0131nda"), /*#__PURE__*/React.createElement("b", null, "Google Play")))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: props.onSignup,
      className: "w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold bg-gold-500 text-stone-900"
    }, "Web'de şimdi başla")), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-center text-white/35 mt-8 leading-relaxed"
    }, /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/aydinlatma.html"
    }, "KVKK"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/kullanim.html"
    }, "Kullan\u0131m"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/gizlilik.html"
    }, "Gizlilik"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/cerez.html"
    }, "\xC7erez"))));
  }
  function getStrengthLabel(pass) {
    if (!pass) return {
      label: "Şifre gir",
      color: "text-stone-400",
      bg: "bg-stone-200"
    };
    if (pass.length < 6) return {
      label: "Zayıf (6+ karakter)",
      color: "text-rose-500",
      bg: "bg-rose-500"
    };
    if (pass.length < 10) return {
      label: "Orta",
      color: "text-amber-500",
      bg: "bg-amber-500"
    };
    return {
      label: "Güçlü ✅",
      color: "text-emerald-500",
      bg: "bg-emerald-500"
    };
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
    const dates = window.KpssConfig && window.KpssConfig.examDateByLevel || {};

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
      return !!(props.recovery || window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending());
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
        window.history.pushState({
          atanlyView: "auth",
          atanlyMode: modeNext
        }, "", u.pathname + u.search + u.hash);
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
          window.history.replaceState({
            atanlyView: "land"
          }, "", landHref);
          window.history.pushState({
            atanlyView: "auth",
            atanlyMode: modeNow
          }, "", authHref);
        } else if (!(window.history.state && window.history.state.atanlyView)) {
          window.history.replaceState({
            atanlyView: "land"
          }, "", landHref);
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
      return function () {
        window.removeEventListener("popstate", onPop);
      };
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
      return function () {
        cancelled = true;
      };
    }, [recovery]);

    // ---------- Levels ----------
    var levels = [{
      id: "lisans",
      t: "🎓 Lisans",
      d: "Her yıl yapılan GY-GK",
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
    }, {
      id: "onlisans",
      t: "📘 Ön lisans",
      d: "Çift yıllarda",
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    }, {
      id: "ortaogretim",
      t: "🏫 Ortaöğretim",
      d: "Çift yıllarda",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    }];
    var targets = [{
      id: "B",
      t: "B Grubu",
      d: "Standart memurluk · yalnızca GY-GK",
      ready: true,
      icon: "book",
      color: "bg-indigo-100 text-indigo-700"
    }, {
      id: "A",
      t: "A Grubu",
      d: "GY-GK + 9 alan testi",
      ready: true,
      icon: "scale",
      color: "bg-purple-100 text-purple-700"
    }, {
      id: "ogretmen",
      t: "Öğretmenlik",
      d: "GY-GK + MEB-AGS + ÖABT",
      ready: true,
      icon: "cap",
      color: "bg-rose-100 text-rose-700"
    }, {
      id: "dhbt",
      t: "DHBT",
      d: "GY-GK + din hizmetleri",
      ready: false,
      icon: "book",
      color: "bg-emerald-100 text-emerald-700"
    }];

    // ---------- Password Strength ----------
    const passStrength = getStrengthLabel(pass);

    // ---------- Save Pending ----------
    function savePending() {
      try {
        sessionStorage.setItem("kpss-signup-profile", JSON.stringify({
          name: name,
          educationLevel: level,
          examDate: examDate,
          targetType: "B",
          referredBy: refCode,
          moduleInterest: Object.keys(interest).filter(function (k) {
            return interest[k];
          })
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
      if (!sb) {
        setMsg("Sunucu bağlı değil.");
        return;
      }
      if (!validatePassword(newPass)) {
        setMsg("Yeni şifre en az 6 karakter olmalı.");
        return;
      }
      if (newPass !== newPass2) {
        setMsg("Şifreler eşleşmiyor.");
        return;
      }
      setBusy(true);
      setMsg("");
      try {
        var sess = null;
        if (window.SupabaseClient && window.SupabaseClient.establishRecoverySession) {
          sess = await window.SupabaseClient.establishRecoverySession();
        }
        if (!sess) throw new Error("Oturum yok. Aynı tarayıcıda yeni sıfırlama maili iste, linke bir kez tıkla.");
        var res = await sb.auth.updateUser({
          password: newPass
        });
        if (res.error) throw res.error;
        if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
        setRecovery(false);
        setNewPass("");
        setNewPass2("");
        setMsg("✅ Şifren güncellendi.");
        if (props.onPasswordUpdated) props.onPasswordUpdated();else if (props.onDone) props.onDone();
      } catch (e) {
        setMsg(window.trError ? window.trError(e, "Şifre güncellenemedi.") : "Şifre güncellenemedi.");
      }
      setBusy(false);
    }
    async function submit() {
      if (!sb) {
        setMsg("Sunucu bağlı değil.");
        return;
      }
      if (!email || !validateEmail(email)) {
        setMsg("Geçerli bir e-posta adresi girin.");
        return;
      }
      if (!validatePassword(pass)) {
        setMsg("Şifre en az 6 karakter olmalı.");
        return;
      }
      if (mode === "up") {
        if (!name.trim()) {
          setMsg("Adınızı yazın.");
          return;
        }
        savePending();
      }
      if (Date.now() < loginLockUntil) {
        setMsg(loginLockedMsg());
        return;
      }
      setBusy(true);
      setMsg("");
      try {
        var res = mode === "up" ? await sb.auth.signUp({
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
        }) : await sb.auth.signInWithPassword({
          email: email,
          password: pass
        });
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
      if (!sb) {
        setMsg("Sunucu bağlı değil.");
        return;
      }
      if (mode === "up") {
        if (!name.trim()) {
          setMsg("Google ile kayıt için adınızı yazın.");
          return;
        }
        if (step < 3) {
          setMsg("Önce tüm adımları tamamlayın.");
          return;
        }
        savePending();
      }
      setBusy(true);
      setMsg("");
      if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
      try {
        var res = await sb.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin + "/"
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
      setTarget("B");
      setStep(3);
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
      return "w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 text-stone-800 " + (on ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/10" : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-indigo-300 dark:hover:border-indigo-700") + (dim ? " opacity-50" : "");
    }

    // ---------- Step Indicator ----------
    function StepIndicator({
      current,
      total
    }) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex gap-1.5 mb-6"
      }, Array.from({
        length: total
      }, function (_, i) {
        var idx = i + 1;
        var isActive = idx === current;
        var isPast = idx < current;
        return /*#__PURE__*/React.createElement("div", {
          key: idx,
          className: "flex-1 flex items-center gap-1"
        }, /*#__PURE__*/React.createElement("div", {
          className: "h-2 rounded-full transition-all duration-300 flex-1 " + (isActive ? "bg-indigo-600 shadow-md shadow-indigo-500/30" : isPast ? "bg-emerald-500" : "bg-stone-200 dark:bg-stone-700")
        }), idx < total && /*#__PURE__*/React.createElement("span", {
          className: "text-[10px] text-stone-400"
        }, isPast ? "✓" : "·"));
      }));
    }

    // ============================================================
    // SIGNUP FORM
    // ============================================================

    var signup = null;
    if (mode === "up") {
      signup = /*#__PURE__*/React.createElement("div", {
        className: "slide-step"
      }, /*#__PURE__*/React.createElement(StepIndicator, {
        current: step === 1 ? 1 : 2,
        total: 2
      }), step === 1 && /*#__PURE__*/React.createElement("div", {
        className: "space-y-4"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5",
        htmlFor: "au-name"
      }, "\uD83D\uDC64 Ad\u0131n\u0131z"), /*#__PURE__*/React.createElement("input", {
        id: "au-name",
        ref: nameRef,
        value: name,
        onChange: function (e) {
          setName(e.target.value);
        },
        onKeyDown: handleKeyDown,
        className: field,
        placeholder: "Ad\u0131n\u0131 yaz",
        autoComplete: "given-name"
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        className: "text-sm font-medium text-stone-600 dark:text-stone-300 mb-2"
      }, "\uD83C\uDFAF E\u011Fitim D\xFCzeyiniz"), /*#__PURE__*/React.createElement("div", {
        className: "space-y-2"
      }, levels.map(function (x) {
        var isActive = level === x.id;
        return /*#__PURE__*/React.createElement("button", {
          key: x.id,
          type: "button",
          onClick: function () {
            setLevel(x.id);
            if (dates[x.id]) setExamDate(dates[x.id]);
          },
          className: cardCls(isActive, false)
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
          className: "font-display font-semibold text-base text-stone-800 dark:text-stone-100"
        }, x.t), /*#__PURE__*/React.createElement("div", {
          className: "text-sm text-stone-500 mt-0.5"
        }, x.d)), isActive && /*#__PURE__*/React.createElement("span", {
          className: "text-indigo-600 text-xl"
        }, "\u2713")));
      }))), /*#__PURE__*/React.createElement("button", {
        type: "button",
        disabled: !name.trim(),
        onClick: function () {
          goAfterEducation();
        },
        className: "w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
      }, "Devam \u2192")), step === 2 && /*#__PURE__*/React.createElement("div", {
        className: "space-y-4"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        className: "text-sm font-medium text-stone-600 dark:text-stone-300 mb-2"
      }, "\uD83C\uDFAF Hedef T\xFCr\xFCn\xFCz"), /*#__PURE__*/React.createElement("div", {
        className: "space-y-2"
      }, targets.map(function (x) {
        var on = target === x.id;
        return /*#__PURE__*/React.createElement("button", {
          key: x.id,
          type: "button",
          onClick: function () {
            setTarget(x.id);
            if (!x.ready) {
              var n = Object.assign({}, interest);
              n[x.id] = true;
              setInterest(n);
            }
          },
          className: cardCls(on, !x.ready)
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-start justify-between gap-3"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex-1"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center gap-2 font-display font-semibold text-stone-800 dark:text-stone-100"
        }, /*#__PURE__*/React.createElement("span", {
          className: "text-lg"
        }, x.icon === "book" ? "📖" : x.icon === "scale" ? "⚖️" : x.icon === "cap" ? "🎓" : "📚"), x.t), /*#__PURE__*/React.createElement("div", {
          className: "text-sm text-stone-500 mt-0.5"
        }, x.d)), !x.ready ? /*#__PURE__*/React.createElement("span", {
          className: "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 shrink-0"
        }, "\u23F3 Yak\u0131nda") : on ? /*#__PURE__*/React.createElement("span", {
          className: "text-indigo-600 text-xl shrink-0"
        }, "\u2713") : null));
      }))), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, React.createElement(window.KpssBackBtn, {
        onClick: function () {
          setStep(1);
        },
        label: "Geri"
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function () {
          setStep(3);
          setMsg("");
        },
        className: "flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold"
      }, "Devam \u2192"))), step === 3 && /*#__PURE__*/React.createElement("div", {
        className: "space-y-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 p-4 border border-indigo-100 dark:border-indigo-800/30"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-indigo-700 dark:text-indigo-300"
      }, "\uD83D\uDCCC ", /*#__PURE__*/React.createElement("strong", null, "GY-GK"), " not, test ve oyun haz\u0131r.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5",
        htmlFor: "au-mail"
      }, "\uD83D\uDCE7 E-posta"), /*#__PURE__*/React.createElement("input", {
        id: "au-mail",
        ref: emailRef,
        type: "email",
        autoComplete: "email",
        value: email,
        onChange: function (e) {
          setEmail(e.target.value);
        },
        onKeyDown: handleKeyDown,
        className: field,
        placeholder: "ornek@email.com"
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5",
        htmlFor: "au-pass"
      }, "\uD83D\uDD12 \u015Eifre"), /*#__PURE__*/React.createElement("div", {
        className: "relative"
      }, /*#__PURE__*/React.createElement("input", {
        id: "au-pass",
        ref: passRef,
        type: showPassword ? "text" : "password",
        autoComplete: "new-password",
        value: pass,
        onChange: function (e) {
          setPass(e.target.value);
        },
        onKeyDown: handleKeyDown,
        className: field + " pr-12",
        placeholder: "En az 6 karakter"
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function () {
          setShowPassword(!showPassword);
        },
        className: "absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
      }, showPassword ? "👁️" : "👁️‍🗨️")), /*#__PURE__*/React.createElement("div", {
        className: "mt-1.5 flex items-center gap-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex-1 h-1 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
      }, /*#__PURE__*/React.createElement("div", {
        className: "h-full transition-all duration-300 " + passStrength.bg,
        style: {
          width: pass ? Math.min(100, pass.length / 10 * 100) + "%" : "0%"
        }
      })), /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] font-medium " + passStrength.color
      }, passStrength.label))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5",
        htmlFor: "au-date"
      }, "\uD83D\uDCC5 S\u0131nav Tarihi"), /*#__PURE__*/React.createElement("input", {
        id: "au-date",
        type: "date",
        value: examDate,
        onChange: function (e) {
          setExamDate(e.target.value);
        },
        className: field
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5",
        htmlFor: "au-ref"
      }, "\uD83D\uDD11 Davet Kodu ", /*#__PURE__*/React.createElement("span", {
        className: "text-xs text-stone-400 font-normal"
      }, "(opsiyonel)")), /*#__PURE__*/React.createElement("input", {
        id: "au-ref",
        value: refCode,
        onChange: function (e) {
          setRefCode(e.target.value);
        },
        className: field,
        placeholder: "\xD6rn: KPSS-ABCD12"
      })), /*#__PURE__*/React.createElement("p", {
        className: "text-[11px] text-stone-500 leading-relaxed"
      }, "Hesap olu\u015Fturarak", " ", /*#__PURE__*/React.createElement("a", {
        className: "text-teal-700 font-semibold underline",
        href: "yasal/kullanim.html",
        target: "_blank",
        rel: "noopener"
      }, "Kullan\u0131m Ko\u015Fullar\u0131"), " ", "ile", " ", /*#__PURE__*/React.createElement("a", {
        className: "text-teal-700 font-semibold underline",
        href: "yasal/uyelik.html",
        target: "_blank",
        rel: "noopener"
      }, "\xDCyelik S\xF6zle\u015Fmesi"), "'ni kabul etmiş olursunuz. Kişisel verileriniz hakkında ", /*#__PURE__*/React.createElement("a", {
        className: "text-teal-700 font-semibold underline",
        href: "yasal/aydinlatma.html",
        target: "_blank",
        rel: "noopener"
      }, "KVKK Ayd\u0131nlatma Metni"), "'ni inceleyebilirsiniz. ", /*#__PURE__*/React.createElement("a", {
        className: "underline",
        href: "yasal/gizlilik.html",
        target: "_blank",
        rel: "noopener"
      }, "Gizlilik"), " · ", /*#__PURE__*/React.createElement("a", {
        className: "underline",
        href: "yasal/cerez.html",
        target: "_blank",
        rel: "noopener"
      }, "\xC7erezler")), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, React.createElement(window.KpssBackBtn, {
        onClick: function () {
          setStep(level === "lisans" ? 2 : 1);
        },
        label: "Geri"
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        disabled: busy || !validateEmail(email) || !validatePassword(pass),
        onClick: submit,
        className: "flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
      }, busy ? "⏳" : "🚀 Kayıt Ol"))));
    }

    // ============================================================
    // LOGIN FORM
    // ============================================================

    var loginForm = mode === "in" ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5",
      htmlFor: "login-email"
    }, "\uD83D\uDCE7 E-posta"), /*#__PURE__*/React.createElement("input", {
      id: "login-email",
      ref: emailRef,
      type: "email",
      autoComplete: "email",
      value: email,
      onChange: function (e) {
        setEmail(e.target.value);
      },
      onKeyDown: handleKeyDown,
      className: field,
      placeholder: "ornek@email.com"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5",
      htmlFor: "login-pass"
    }, "\uD83D\uDD12 \u015Eifre"), /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("input", {
      id: "login-pass",
      ref: passRef,
      type: showPassword ? "text" : "password",
      autoComplete: "current-password",
      value: pass,
      onChange: function (e) {
        setPass(e.target.value);
      },
      onKeyDown: handleKeyDown,
      className: field + " pr-12",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        setShowPassword(!showPassword);
      },
      className: "absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
    }, showPassword ? "👁️" : "👁️‍🗨️"))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-2 text-sm text-stone-500 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: rememberMe,
      onChange: function (e) {
        setRememberMe(e.target.checked);
      },
      className: "w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
    }), "Beni Hat\u0131rla"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "text-sm text-indigo-600 dark:text-indigo-400 hover:underline",
      onClick: async function () {
        if (!email || !validateEmail(email)) {
          setMsg("Şifre sıfırlama için e-posta adresinizi girin.");
          if (emailRef.current) emailRef.current.focus();
          return;
        }
        if (!sb) {
          setMsg("Sunucu bağlı değil.");
          return;
        }
        if (Date.now() < loginLockUntil) {
          setMsg(loginLockedMsg());
          return;
        }
        setBusy(true);
        setMsg("");
        try {
          if (window.SupabaseClient && window.SupabaseClient.clearRecoveryFlag) {
            window.SupabaseClient.clearRecoveryFlag();
          }
          var resetTo = window.location.origin + "/auth/reset";
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
          if (/çok sık|bağlantı|sunucu|zaman aşımı/i.test(em)) setMsg(em);else setMsg("Hesap varsa şifre sıfırlama bağlantısı gönderildi. Spam klasörüne de bak.");
        }
        setBusy(false);
      }
    }, "\u015Eifremi Unuttum")), /*#__PURE__*/React.createElement("button", {
      disabled: busy || !validateEmail(email) || !validatePassword(pass),
      onClick: submit,
      className: "w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all"
    }, busy ? "⏳" : "🔓 Giriş Yap"), /*#__PURE__*/React.createElement("div", {
      className: "relative my-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-0 flex items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full border-t border-stone-200 dark:border-stone-700"
    })), /*#__PURE__*/React.createElement("div", {
      className: "relative flex justify-center text-xs"
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-3 bg-white dark:bg-stone-900 text-stone-400"
    }, "veya"))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: busy,
      onClick: google,
      className: "w-full py-3.5 rounded-2xl btn-google font-semibold text-sm flex items-center justify-center gap-3 disabled:opacity-50"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-5 h-5",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      fill: "#4285F4",
      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#34A853",
      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#FBBC05",
      d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#EA4335",
      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    })), "Google ile Devam"), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-stone-500 text-center"
    }, "\u0130lk kez Google ile gelince ad ve e\u011Fitim sorulur.")) : null;

    // ============================================================
    // MAIN RENDER
    // ============================================================

    var form = /*#__PURE__*/React.createElement("div", {
      className: props.gate ? "" : "p-6 sm:p-8"
    }, recovery ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500"
    }, "Yeni \u015Fifreni yaz. En az 6 karakter."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5"
    }, "Yeni \u015Fifre"), /*#__PURE__*/React.createElement("input", {
      type: showPassword ? "text" : "password",
      value: newPass,
      onChange: function (e) {
        setNewPass(e.target.value);
      },
      className: field,
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      autoComplete: "new-password"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "text-sm font-medium text-stone-600 dark:text-stone-300 block mb-1.5"
    }, "Yeni \u015Fifre (tekrar)"), /*#__PURE__*/React.createElement("input", {
      type: showPassword ? "text" : "password",
      value: newPass2,
      onChange: function (e) {
        setNewPass2(e.target.value);
      },
      className: field,
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      autoComplete: "new-password"
    })), /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-2 text-sm text-stone-500 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: showPassword,
      onChange: function (e) {
        setShowPassword(e.target.checked);
      },
      className: "w-4 h-4 rounded border-stone-300 text-indigo-600"
    }), "\u015Eifreyi g\xF6ster"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: busy || !recReady,
      onClick: saveNewPassword,
      className: "w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40"
    }, busy ? "⏳" : recReady ? "Şifreyi kaydet" : "Bağlantı doğrulanıyor…"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "w-full text-sm text-stone-500",
      onClick: function () {
        if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
        setRecovery(false);
        setRecReady(false);
        if (props.onRecoveryFailed) props.onRecoveryFailed();
      }
    }, "Giri\u015Fe d\xF6n")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800 mb-6"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        setMode("in");
        setMsg("");
        setStep(1);
        setPass("");
      },
      className: "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " + (mode === "in" ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")
    }, "\uD83D\uDD10 Giri\u015F"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        setMode("up");
        setMsg("");
        setStep(1);
        setPass("");
      },
      className: "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 " + (mode === "up" ? "bg-white dark:bg-stone-900 shadow-md text-indigo-600 dark:text-indigo-400" : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")
    }, "\uD83D\uDCDD Kay\u0131t")), signup, loginForm, mode === "up" && step === 3 && /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative my-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-0 flex items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full border-t border-stone-200 dark:border-stone-700"
    })), /*#__PURE__*/React.createElement("div", {
      className: "relative flex justify-center text-xs"
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-3 bg-white dark:bg-stone-900 text-stone-400"
    }, "veya"))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: busy,
      onClick: google,
      className: "w-full py-3.5 rounded-2xl btn-google font-semibold text-sm flex items-center justify-center gap-3 disabled:opacity-50"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-5 h-5",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      fill: "#4285F4",
      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#34A853",
      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#FBBC05",
      d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#EA4335",
      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    })), "Google ile Kay\u0131t Ol"))), msg && /*#__PURE__*/React.createElement("div", {
      className: "mt-4 p-4 rounded-2xl text-sm flex items-start gap-3 " + (msg.includes("✅") || msg.includes("tamam") ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300")
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg shrink-0"
    }, msg.includes("✅") || msg.includes("tamam") ? "✅" : "⚠️"), /*#__PURE__*/React.createElement("span", {
      className: "whitespace-pre-line"
    }, msg)));

    // ============================================================
    // GATE MODE (Full Page)
    // ============================================================

    if (!props.gate) return form;
    if (showLand && !recovery) {
      return /*#__PURE__*/React.createElement(LandingPage, {
        onLogin: function () {
          goAuth("in");
        },
        onSignup: function () {
          goAuth("up");
        }
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "brand-backdrop min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand-glow",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "brand-ring brand-ring-outer",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "brand-ring brand-ring-inner",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "relative z-10 w-full max-w-md bg-white dark:bg-stone-900 rounded-[28px] shadow-2xl p-6 sm:p-8 text-stone-800 fade-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center mb-6"
    }, window.AtanomLogo ? window.AtanomLogo("h-24 w-24 mx-auto mb-3 object-contain drop-shadow-sm") : /*#__PURE__*/React.createElement("img", {
      src: "icons/atanom.png",
      alt: "Atanly",
      className: "h-24 w-24 mx-auto mb-3 object-contain"
    }), /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl md:text-3xl font-black gradient-text"
    }, "Atanly"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, recovery ? "Maildeki bağlantı seni buraya getirdi" : mode === "up" ? "Hedefine doğru ilk adımı at" : "Kaldığın yerden devam et")), form, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-center text-stone-400 mt-4 leading-relaxed"
    }, /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/aydinlatma.html"
    }, "KVKK Ayd\u0131nlatma"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/kullanim.html"
    }, "Kullan\u0131m"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/uyelik.html"
    }, "\xDCyelik"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/gizlilik.html"
    }, "Gizlilik"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/cerez.html"
    }, "\xC7erez"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/basvuru.html"
    }, "KVKK ba\u015Fvuru"))));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.AuthScreen = AuthScreen;
})();