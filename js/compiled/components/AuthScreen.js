/*jsx:babel-7.29.9-react-classic:69815:iapioo*/
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  // GÖRSEL YARDIMCILAR (giriş / kayıt): çizgi simgeler, alan, e-posta önerisi, şifre gücü
  // ============================================================
  var ICONS = {
    mail: "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 1 8 6 8-6",
    lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zm6 4v2",
    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    eyeOff: "M3 3l18 18M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a9.9 9.9 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",
    cal: "M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
    gift: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1zm0 0c1.5-3 5-3 5-1s-3 1-5 1z",
    check: "M5 12.5l4.2 4.2L19 7",
    alert: "M12 8v5m0 3.5v.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z",
    ok: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14.01l-3-3",
    back: "M15 18l-6-6 6-6",
    cap: "M2 9l10-5 10 5-10 5zm4 2.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5M22 9v5",
    key: "M15 7a4 4 0 1 1-3.5 6L5 19.5V22H2v-3l6.5-6.5A4 4 0 0 1 15 7zm1.5-1.5h.01"
  };
  function AuthIcon(props) {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: props.size || 18,
      height: props.size || 18,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: props.sw || 1.8,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      className: props.className
    }, /*#__PURE__*/React.createElement("path", {
      d: ICONS[props.name]
    }));
  }
  function AuthThemeBtn(props) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: props.onClick,
      "aria-label": props.dark ? "Gündüz moduna geç" : "Gece moduna geç",
      className: "h-10 w-10 grid place-items-center rounded-xl transition " + (props.onBrand ? "bg-white/10 ring-1 ring-white/20 text-white hover:bg-white/15" : "ring-1 ring-slate-200 dark:ring-stone-700 text-slate-600 dark:text-amber-300 hover:bg-white dark:hover:bg-stone-800")
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "18",
      height: "18",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: props.dark ? "M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17m10-10 1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" : "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
    })));
  }
  function GoogleMark() {
    return /*#__PURE__*/React.createElement("svg", {
      className: "w-5 h-5",
      viewBox: "0 0 24 24",
      "aria-hidden": "true"
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
    }));
  }
  // Etiketli alan: soldaki simge, sağdaki ek (göz düğmesi), altında ipucu ya da hata
  function AuthField(props) {
    var hintId = props.id + "-hint";
    var hasNote = !!(props.error || props.hint || props.extra);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline justify-between mb-1.5"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: props.id,
      className: "text-[13px] font-semibold text-slate-700 dark:text-stone-200"
    }, props.label, props.optional ? /*#__PURE__*/React.createElement("span", {
      className: "font-normal text-slate-400"
    }, " \xB7 iste\u011Fe ba\u011Fl\u0131") : null), props.aside || null), /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, props.icon ? /*#__PURE__*/React.createElement("span", {
      className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-stone-500 pointer-events-none"
    }, /*#__PURE__*/React.createElement(AuthIcon, {
      name: props.icon
    })) : null, props.children({
      "aria-invalid": props.error ? "true" : "false",
      "aria-describedby": hasNote ? hintId : undefined,
      className: "atn-field" + (props.icon ? "" : " no-icon") + (props.trailing ? " pr-12" : "")
    }), props.trailing || null), hasNote ? /*#__PURE__*/React.createElement("div", {
      id: hintId,
      className: "mt-1.5 space-y-1",
      "aria-live": "polite"
    }, props.error ? /*#__PURE__*/React.createElement("p", {
      className: "text-[12.5px] text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(AuthIcon, {
      name: "alert",
      size: 14
    }), props.error) : null, !props.error && props.hint ? /*#__PURE__*/React.createElement("p", {
      className: "text-[12.5px] text-slate-500 dark:text-stone-400"
    }, props.hint) : null, props.extra || null) : null);
  }
  // Sık yapılan e-posta alan adı yazım hataları: gmial.com → gmail.com
  var MAIL_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com", "yandex.com", "live.com", "msn.com", "windowslive.com", "hotmail.com.tr", "outlook.com.tr"];
  function lev(a, b) {
    var d = [],
      i,
      j;
    for (i = 0; i <= a.length; i++) {
      d[i] = [i];
    }
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[a.length][b.length];
  }
  function suggestEmail(email) {
    var m = /^([^@\s]+)@([^@\s]+)$/.exec(String(email || "").trim());
    if (!m) return null;
    var dom = m[2].toLowerCase();
    if (MAIL_DOMAINS.indexOf(dom) >= 0) return null;
    var best = null,
      bd = 3;
    MAIL_DOMAINS.forEach(function (c) {
      var x = lev(dom, c);
      if (x < bd) {
        bd = x;
        best = c;
      }
    });
    return best && bd > 0 && bd <= 2 ? m[1] + "@" + best : null;
  }
  // Şifre gücü: 0–4 ve kurallar
  function passRules(p) {
    p = String(p || "");
    return [{
      ok: p.length >= 8,
      t: "En az 8 karakter"
    }, {
      ok: /\d/.test(p) && /[a-zçğıöşü]/i.test(p),
      t: "Harf ve rakam"
    }, {
      ok: /[A-ZÇĞİÖŞÜ]/.test(p) && /[a-zçğıöşü]/.test(p),
      t: "Büyük ve küçük harf"
    }];
  }
  function passScore(p) {
    if (!p) return 0;
    if (p.length < 6) return 1;
    var n = passRules(p).filter(function (r) {
      return r.ok;
    }).length;
    return Math.max(1, Math.min(4, n + (p.length >= 12 ? 1 : 0)));
  }
  var SCORE_TXT = ["", "Zayıf", "İdare eder", "İyi", "Güçlü"];
  var SCORE_CLR = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-emerald-600"];
  function StrengthMeter(props) {
    var sc = passScore(props.value),
      rules = passRules(props.value);
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5",
      "aria-hidden": "true"
    }, [1, 2, 3, 4].map(function (i) {
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        className: "h-1.5 flex-1 rounded-full transition-colors " + (sc >= i ? SCORE_CLR[sc] : "bg-slate-200 dark:bg-stone-700")
      });
    })), /*#__PURE__*/React.createElement("p", {
      className: "sr-only",
      "aria-live": "polite"
    }, props.value ? "Şifre gücü: " + SCORE_TXT[sc] : ""), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-x-3 gap-y-1 mt-2"
    }, rules.map(function (r) {
      return /*#__PURE__*/React.createElement("span", {
        key: r.t,
        className: "text-[12px] inline-flex items-center gap-1 " + (r.ok ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400")
      }, /*#__PURE__*/React.createElement(AuthIcon, {
        name: "check",
        size: 13,
        sw: 2.4
      }), r.t);
    }), props.value ? /*#__PURE__*/React.createElement("span", {
      className: "text-[12px] font-semibold ml-auto text-slate-600 dark:text-stone-300"
    }, SCORE_TXT[sc]) : null));
  }
  // Sol marka paneli (masaüstü) ve üst marka bandı (telefon)
  function BrandPanel(props) {
    var points = [["Konu konu not, test ve aralıklı tekrar", "Kilitli ilerleme; zayıf konu öne çekilir, yanlışlar deftere düşer."], ["Her pazar Türkiye geneli canlı deneme", "Herkes aynı anda çözer; sıralama, net dağılımı ve konu analizi."], ["Sınav tarihine göre akıllı program", "Boş saatlerine göre günlük plan; kaçırırsan kendini yeniden dağıtır."]];
    return /*#__PURE__*/React.createElement("aside", {
      className: "atn-brand relative hidden lg:flex flex-col justify-between p-12 xl:p-16 text-white overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "atn-brand-grid",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "relative flex items-center gap-3"
    }, window.AtanomLogo ? window.AtanomLogo("h-11 w-11 object-contain") : /*#__PURE__*/React.createElement("img", {
      src: "icons/atanom.png",
      alt: "",
      className: "h-11 w-11 object-contain"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xl font-bold tracking-tight"
    }, "Atanly")), /*#__PURE__*/React.createElement("div", {
      className: "relative max-w-md"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[12px] font-bold uppercase tracking-[0.18em] text-[#E8C987]"
    }, "KPSS \xB7 GY-GK"), /*#__PURE__*/React.createElement("h2", {
      className: "text-4xl xl:text-[44px] font-bold leading-[1.1] tracking-tight mt-3"
    }, "Atamaya giden", /*#__PURE__*/React.createElement("br", null), "\xE7al\u0131\u015Fma odas\u0131."), /*#__PURE__*/React.createElement("ul", {
      className: "mt-10 space-y-6"
    }, points.map(function (p) {
      return /*#__PURE__*/React.createElement("li", {
        key: p[0],
        className: "flex gap-4"
      }, /*#__PURE__*/React.createElement("span", {
        className: "mt-0.5 h-7 w-7 shrink-0 rounded-full bg-white/10 ring-1 ring-white/20 grid place-items-center text-[#E8C987]"
      }, /*#__PURE__*/React.createElement(AuthIcon, {
        name: "check",
        size: 15,
        sw: 2.4
      })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        className: "block font-semibold"
      }, p[0]), /*#__PURE__*/React.createElement("span", {
        className: "block text-sm text-white/65 mt-0.5 leading-relaxed"
      }, p[1])));
    }))), /*#__PURE__*/React.createElement("p", {
      className: "relative text-sm text-white/55"
    }, "Lisans \xB7 \xD6n lisans \xB7 Orta\xF6\u011Fretim"));
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
    // Maildeki onay bağlantısı doğrulanamadıysa nedenini göster (doğrulama birkaç saniye sürebilir)
    useEffect(function () {
      var n = 0;
      var t = setInterval(function () {
        var m = window.SupabaseClient && window.SupabaseClient.takeLinkError && window.SupabaseClient.takeLinkError();
        if (m) {
          // Tanıtım sayfasındaysa mesajın görüneceği giriş ekranına geç
          setMode("in");
          setShowLand(false);
          setMsg(m);
          clearInterval(t);
          try {
            window.history.pushState({
              atanlyView: "auth",
              atanlyMode: "in"
            }, "", window.location.pathname + window.location.search);
          } catch (e) {}
        }
        if (++n > 20) clearInterval(t);
      }, 500);
      return function () {
        clearInterval(t);
      };
    }, []);
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
      // Düğme hiç kilitlenmez: eksik alan tıklayınca işaretlenir ve oraya odaklanılır.
      var badEmail = !email || !validateEmail(email),
        badPass = !validatePassword(pass),
        badKvkk = mode === "up" && !kvkk;
      if (badEmail || badPass || badKvkk) {
        setTouched(function (t) {
          return Object.assign({}, t, {
            email: true,
            pass: true,
            kvkk: mode === "up"
          });
        });
        setMsg("");
        var firstBad = badEmail ? mode === "up" ? "au-mail" : "login-email" : badPass ? mode === "up" ? "au-pass" : "login-pass" : "au-kvkk";
        setTimeout(function () {
          var el = document.getElementById(firstBad);
          if (el) el.focus();
        }, 0);
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
    // GÖRÜNÜM (premium): etkileşim durumu
    // ============================================================
    const [touched, setTouched] = useState({});
    const [caps, setCaps] = useState(false);
    const [kvkk, setKvkk] = useState(false);
    function touch(k) {
      setTouched(function (t) {
        var n = Object.assign({}, t);
        n[k] = true;
        return n;
      });
    }
    function capsCheck(e) {
      if (e && e.getModifierState) setCaps(e.getModifierState("CapsLock"));
    }
    var emailErr = !touched.email ? "" : !email.trim() ? "E-posta adresini yaz." : !validateEmail(email.trim()) ? "E-posta adresi eksik ya da hatalı görünüyor." : "";
    var passErr = !touched.pass ? "" : !pass ? "Şifreni yaz." : !validatePassword(pass) ? "Şifre en az 6 karakter olmalı." : "";
    var kvkkErr = touched.kvkk && !kvkk;
    var nameErr = touched.name && !name.trim() ? "Adını yaz; liderlik tablosunda bu görünür." : "";
    var mailFix = suggestEmail(email);
    var okMsg = /✅|tamam|gönderildi|güncellendi/i.test(msg || "");
    var cleanMsg = String(msg || "").replace(/^✅\s*/, "");
    async function forgot() {
      if (!email || !validateEmail(email)) {
        touch("email");
        setMsg("Şifre sıfırlama bağlantısı için önce e-posta adresini yaz.");
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
        if (window.SupabaseClient && window.SupabaseClient.clearRecoveryFlag) window.SupabaseClient.clearRecoveryFlag();
        await sb.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + "/auth/reset"
        });
        loginFails += 1;
        if (loginFails >= 5) loginLockUntil = Date.now() + 60000;
        setMsg("Hesap varsa şifre sıfırlama bağlantısı gönderildi. Spam klasörüne de bak.");
      } catch (e) {
        var em = window.trError ? window.trError(e, "") : "";
        if (/çok sık|bağlantı|sunucu|zaman aşımı/i.test(em)) setMsg(em);else setMsg("Hesap varsa şifre sıfırlama bağlantısı gönderildi. Spam klasörüne de bak.");
      }
      setBusy(false);
    }
    function emailInput(id, autoFocusRef) {
      return /*#__PURE__*/React.createElement(AuthField, {
        id: id,
        label: "E-posta",
        icon: "mail",
        error: emailErr,
        extra: mailFix ? /*#__PURE__*/React.createElement("p", {
          className: "text-[12.5px] text-slate-600 dark:text-stone-300"
        }, "Bunu mu demek istedin: ", /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "atn-link",
          onClick: function () {
            setEmail(mailFix);
          }
        }, mailFix), "?") : null
      }, function (a) {
        return /*#__PURE__*/React.createElement("input", _extends({}, a, {
          id: id,
          ref: autoFocusRef,
          type: "email",
          inputMode: "email",
          autoComplete: "email",
          autoCapitalize: "none",
          spellCheck: "false",
          value: email,
          onChange: function (e) {
            setEmail(e.target.value);
          },
          onBlur: function () {
            touch("email");
          },
          onKeyDown: handleKeyDown,
          placeholder: "ad@ornek.com"
        }));
      });
    }
    function passInput(id, isNew) {
      return /*#__PURE__*/React.createElement(AuthField, {
        id: id,
        label: "\u015Eifre",
        icon: "lock",
        error: passErr,
        aside: !isNew ? /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "atn-link text-[13px]",
          onClick: forgot,
          disabled: busy
        }, "\u015Eifremi unuttum") : null,
        extra: /*#__PURE__*/React.createElement("div", null, caps ? /*#__PURE__*/React.createElement("p", {
          className: "text-[12.5px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5"
        }, /*#__PURE__*/React.createElement(AuthIcon, {
          name: "alert",
          size: 14
        }), "Caps Lock a\xE7\u0131k") : null, isNew ? /*#__PURE__*/React.createElement(StrengthMeter, {
          value: pass
        }) : null),
        trailing: /*#__PURE__*/React.createElement("button", {
          type: "button",
          onClick: function () {
            setShowPassword(!showPassword);
          },
          "aria-label": showPassword ? "Şifreyi gizle" : "Şifreyi göster",
          "aria-pressed": showPassword,
          className: "absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-stone-800 dark:hover:text-white"
        }, /*#__PURE__*/React.createElement(AuthIcon, {
          name: showPassword ? "eyeOff" : "eye"
        }))
      }, function (a) {
        return /*#__PURE__*/React.createElement("input", _extends({}, a, {
          id: id,
          ref: passRef,
          type: showPassword ? "text" : "password",
          autoComplete: isNew ? "new-password" : "current-password",
          value: pass,
          onChange: function (e) {
            setPass(e.target.value);
          },
          onBlur: function () {
            touch("pass");
          },
          onKeyDown: function (e) {
            capsCheck(e);
            handleKeyDown(e);
          },
          onKeyUp: capsCheck,
          placeholder: isNew ? "En az 6 karakter" : "Şifren"
        }));
      });
    }
    function primaryBtn(label, busyLabel, disabled, onClick) {
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "atn-btn inline-flex items-center justify-center gap-2.5",
        disabled: disabled,
        onClick: onClick,
        "aria-busy": busy
      }, busy ? /*#__PURE__*/React.createElement("span", {
        className: "atn-spin",
        "aria-hidden": "true"
      }) : null, busy ? busyLabel : label);
    }
    function orLine() {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3 my-1",
        "aria-hidden": "true"
      }, /*#__PURE__*/React.createElement("span", {
        className: "h-px flex-1 bg-slate-200 dark:bg-stone-700"
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-[12px] text-slate-400"
      }, "veya"), /*#__PURE__*/React.createElement("span", {
        className: "h-px flex-1 bg-slate-200 dark:bg-stone-700"
      }));
    }
    function googleBtn(label) {
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        disabled: busy,
        onClick: google,
        className: "atn-btn-ghost disabled:opacity-50"
      }, /*#__PURE__*/React.createElement(GoogleMark, null), label);
    }

    // ---------- KAYIT ----------
    var signup = null;
    if (mode === "up") {
      var stepNo = step === 3 ? 2 : 1;
      signup = /*#__PURE__*/React.createElement("div", {
        className: "space-y-5 atn-in",
        key: "up-" + step
      }, /*#__PURE__*/React.createElement("ol", {
        className: "flex items-center gap-3 text-[12.5px] font-semibold",
        "aria-label": "Kay\u0131t ad\u0131mlar\u0131"
      }, [["1", "Seni tanıyalım"], ["2", "Hesabın"]].map(function (s2, i) {
        var on = stepNo === i + 1,
          done = stepNo > i + 1;
        return /*#__PURE__*/React.createElement("li", {
          key: s2[0],
          className: "flex items-center gap-2 " + (i ? "flex-1 justify-end" : "flex-1"),
          "aria-current": on ? "step" : undefined
        }, /*#__PURE__*/React.createElement("span", {
          className: "h-6 w-6 rounded-full grid place-items-center text-[11px] " + (done ? "bg-emerald-600 text-white" : on ? "bg-[#0D2C4D] text-white dark:bg-teal-500" : "bg-slate-200 text-slate-500 dark:bg-stone-700")
        }, done ? /*#__PURE__*/React.createElement(AuthIcon, {
          name: "check",
          size: 13,
          sw: 2.6
        }) : s2[0]), /*#__PURE__*/React.createElement("span", {
          className: on ? "text-slate-900 dark:text-white" : "text-slate-400"
        }, s2[1]), i === 0 ? /*#__PURE__*/React.createElement("span", {
          className: "h-px flex-1 bg-slate-200 dark:bg-stone-700 ml-1"
        }) : null);
      })), step === 1 ? /*#__PURE__*/React.createElement("div", {
        className: "space-y-5"
      }, /*#__PURE__*/React.createElement(AuthField, {
        id: "au-name",
        label: "Ad\u0131n",
        icon: "user",
        error: nameErr,
        hint: "Liderlik tablosunda ve sertifikalarda g\xF6r\xFCn\xFCr."
      }, function (a) {
        return /*#__PURE__*/React.createElement("input", _extends({}, a, {
          id: "au-name",
          ref: nameRef,
          value: name,
          onChange: function (e) {
            setName(e.target.value);
          },
          onBlur: function () {
            touch("name");
          },
          onKeyDown: handleKeyDown,
          placeholder: "Ad\u0131n",
          autoComplete: "given-name"
        }));
      }), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", {
        className: "text-[13px] font-semibold text-slate-700 dark:text-stone-200 mb-2"
      }, "Hangi KPSS'ye haz\u0131rlan\u0131yorsun?"), /*#__PURE__*/React.createElement("div", {
        className: "space-y-2",
        role: "radiogroup",
        "aria-label": "E\u011Fitim d\xFCzeyi"
      }, levels.map(function (x) {
        var isActive = level === x.id;
        return /*#__PURE__*/React.createElement("button", {
          key: x.id,
          type: "button",
          role: "radio",
          "aria-checked": isActive,
          className: "atn-option",
          onClick: function () {
            setLevel(x.id);
            if (dates[x.id]) setExamDate(dates[x.id]);
          }
        }, /*#__PURE__*/React.createElement("span", {
          className: "h-10 w-10 rounded-xl grid place-items-center shrink-0 " + (isActive ? "bg-[#0D2C4D] text-white dark:bg-teal-500" : "bg-amber-50 text-amber-700 dark:bg-stone-800 dark:text-amber-300")
        }, /*#__PURE__*/React.createElement(AuthIcon, {
          name: "cap",
          size: 20
        })), /*#__PURE__*/React.createElement("span", {
          className: "flex-1 min-w-0"
        }, /*#__PURE__*/React.createElement("span", {
          className: "block font-semibold text-[15px] text-slate-900 dark:text-white"
        }, x.t), /*#__PURE__*/React.createElement("span", {
          className: "block text-[13px] text-slate-500 dark:text-stone-400 mt-0.5"
        }, x.d)), /*#__PURE__*/React.createElement("span", {
          className: "h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 " + (isActive ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 dark:border-stone-600")
        }, isActive ? /*#__PURE__*/React.createElement(AuthIcon, {
          name: "check",
          size: 12,
          sw: 3
        }) : null));
      }))), primaryBtn("Devam et", "", false, function () {
        if (!name.trim()) {
          touch("name");
          return;
        }
        goAfterEducation();
      })) : step === 2 ? /*#__PURE__*/React.createElement("div", {
        className: "space-y-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "space-y-2",
        role: "radiogroup",
        "aria-label": "Hedef"
      }, targets.map(function (x) {
        var on = target === x.id;
        return /*#__PURE__*/React.createElement("button", {
          key: x.id,
          type: "button",
          role: "radio",
          "aria-checked": on,
          className: "atn-option" + (x.ready ? "" : " opacity-60"),
          onClick: function () {
            setTarget(x.id);
            if (!x.ready) {
              var n2 = Object.assign({}, interest);
              n2[x.id] = true;
              setInterest(n2);
            }
          }
        }, /*#__PURE__*/React.createElement("span", {
          className: "flex-1"
        }, /*#__PURE__*/React.createElement("span", {
          className: "block font-semibold text-slate-900 dark:text-white"
        }, x.t), /*#__PURE__*/React.createElement("span", {
          className: "block text-[13px] text-slate-500 mt-0.5"
        }, x.d)), !x.ready ? /*#__PURE__*/React.createElement("span", {
          className: "text-[11px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800"
        }, "Yak\u0131nda") : null);
      })), /*#__PURE__*/React.createElement("div", {
        className: "flex gap-2"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "atn-btn-ghost !w-auto px-5",
        onClick: function () {
          setStep(1);
        }
      }, /*#__PURE__*/React.createElement(AuthIcon, {
        name: "back"
      }), "Geri"), /*#__PURE__*/React.createElement("div", {
        className: "flex-1"
      }, primaryBtn("Devam et", "", false, function () {
        setStep(3);
        setMsg("");
      })))) : /*#__PURE__*/React.createElement("div", {
        className: "space-y-5"
      }, emailInput("au-mail", emailRef), passInput("au-pass", true), /*#__PURE__*/React.createElement("details", {
        className: "group rounded-2xl border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-900 open:pb-4"
      }, /*#__PURE__*/React.createElement("summary", {
        className: "cursor-pointer list-none px-4 py-3 flex items-center justify-between text-[13.5px] font-semibold text-slate-700 dark:text-stone-200"
      }, /*#__PURE__*/React.createElement("span", null, "S\u0131nav tarihi ve davet kodu"), /*#__PURE__*/React.createElement("span", {
        className: "text-slate-400 text-[12px] font-normal"
      }, formatDate(examDate), refCode ? " · kod: " + refCode : "")), /*#__PURE__*/React.createElement("div", {
        className: "px-4 space-y-4"
      }, /*#__PURE__*/React.createElement(AuthField, {
        id: "au-date",
        label: "S\u0131nav tarihi",
        icon: "cal",
        hint: "Program\u0131n bu tarihe g\xF6re kurulur; sonradan Ben \u203A Ayarlar'dan de\u011Fi\u015Ftirebilirsin."
      }, function (a) {
        return /*#__PURE__*/React.createElement("input", _extends({}, a, {
          id: "au-date",
          type: "date",
          value: examDate,
          onChange: function (e) {
            setExamDate(e.target.value);
          }
        }));
      }), /*#__PURE__*/React.createElement(AuthField, {
        id: "au-ref",
        label: "Davet kodu",
        optional: true,
        icon: "gift"
      }, function (a) {
        return /*#__PURE__*/React.createElement("input", _extends({}, a, {
          id: "au-ref",
          value: refCode,
          onChange: function (e) {
            setRefCode(e.target.value.toUpperCase());
          },
          placeholder: "KPSS-ABCD12",
          autoCapitalize: "characters"
        }));
      }))), /*#__PURE__*/React.createElement("label", {
        className: "flex items-start gap-3 cursor-pointer select-none rounded-2xl p-3 -mx-1 border transition-colors " + (kvkkErr ? "border-rose-300 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800" : "border-transparent hover:bg-slate-50 dark:hover:bg-stone-800/60")
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        id: "au-kvkk",
        checked: kvkk,
        onChange: function (e) {
          setKvkk(e.target.checked);
        },
        className: "mt-0.5 w-5 h-5 shrink-0 rounded-md accent-[#0D2C4D] cursor-pointer",
        "aria-describedby": "au-kvkk-hint",
        "aria-invalid": kvkkErr || undefined
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-[12.5px] text-slate-500 dark:text-stone-400 leading-relaxed"
      }, /*#__PURE__*/React.createElement("a", {
        className: "atn-link",
        href: "yasal/kullanim.html",
        target: "_blank",
        rel: "noopener"
      }, "Kullan\u0131m Ko\u015Fullar\u0131"), " ve", " ", /*#__PURE__*/React.createElement("a", {
        className: "atn-link",
        href: "yasal/uyelik.html",
        target: "_blank",
        rel: "noopener"
      }, "\xDCyelik S\xF6zle\u015Fmesi"), "'ni kabul ediyorum; ilerleme verilerimin", " ", /*#__PURE__*/React.createElement("a", {
        className: "atn-link",
        href: "yasal/aydinlatma.html",
        target: "_blank",
        rel: "noopener"
      }, "KVKK Ayd\u0131nlatma Metni"), "'ne g\xF6re hesab\u0131mda saklanmas\u0131na izin veriyorum.", !kvkk ? /*#__PURE__*/React.createElement("span", {
        id: "au-kvkk-hint",
        role: kvkkErr ? "alert" : undefined,
        className: "block mt-1 text-[11.5px] " + (kvkkErr ? "text-rose-600 dark:text-rose-400 font-semibold" : "text-slate-400")
      }, "Devam etmek i\xE7in onay kutusunu i\u015Faretle.") : null)), /*#__PURE__*/React.createElement("div", {
        className: "flex gap-2"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "atn-btn-ghost !w-auto px-5",
        "aria-label": "Geri",
        onClick: function () {
          setStep(level === "lisans" && false ? 2 : 1);
        }
      }, /*#__PURE__*/React.createElement(AuthIcon, {
        name: "back"
      }), "Geri"), /*#__PURE__*/React.createElement("div", {
        className: "flex-1"
      }, primaryBtn("Hesabı oluştur", "Hesap oluşturuluyor…", busy, submit))), orLine(), googleBtn("Google ile kayıt ol")));
    }

    // ---------- GİRİŞ ----------
    var loginForm = mode === "in" ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-5 atn-in",
      key: "in"
    }, emailInput("login-email", emailRef), passInput("login-pass", false), /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-2.5 text-[13.5px] text-slate-600 dark:text-stone-300 cursor-pointer select-none w-fit"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: rememberMe,
      onChange: function (e) {
        setRememberMe(e.target.checked);
      },
      className: "h-[18px] w-[18px] rounded border-slate-300 text-teal-700 focus:ring-teal-600"
    }), "Bu cihazda oturumum a\xE7\u0131k kals\u0131n"), primaryBtn("Giriş yap", "Giriş yapılıyor…", busy, submit), orLine(), googleBtn("Google ile devam et")) : null;

    // ---------- MESAJ ----------
    var notice = msg ? /*#__PURE__*/React.createElement("div", {
      role: okMsg ? "status" : "alert",
      className: "mt-5 p-4 rounded-2xl text-[13.5px] flex items-start gap-3 atn-in " + (okMsg ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:ring-emerald-900" : "bg-rose-50 text-rose-800 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:ring-rose-900")
    }, /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 mt-0.5"
    }, /*#__PURE__*/React.createElement(AuthIcon, {
      name: okMsg ? "ok" : "alert"
    })), /*#__PURE__*/React.createElement("span", {
      className: "whitespace-pre-line leading-relaxed"
    }, cleanMsg)) : null;

    // ---------- ŞİFRE YENİLEME ----------
    var recoveryForm = recovery ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-5 atn-in"
    }, /*#__PURE__*/React.createElement(AuthField, {
      id: "rec-pass",
      label: "Yeni \u015Fifre",
      icon: "lock",
      extra: /*#__PURE__*/React.createElement(StrengthMeter, {
        value: newPass
      })
    }, function (a) {
      return /*#__PURE__*/React.createElement("input", _extends({}, a, {
        id: "rec-pass",
        type: showPassword ? "text" : "password",
        value: newPass,
        onChange: function (e) {
          setNewPass(e.target.value);
        },
        placeholder: "En az 6 karakter",
        autoComplete: "new-password"
      }));
    }), /*#__PURE__*/React.createElement(AuthField, {
      id: "rec-pass2",
      label: "Yeni \u015Fifre (tekrar)",
      icon: "lock",
      error: newPass2 && newPass2 !== newPass ? "Şifreler eşleşmiyor." : ""
    }, function (a) {
      return /*#__PURE__*/React.createElement("input", _extends({}, a, {
        id: "rec-pass2",
        type: showPassword ? "text" : "password",
        value: newPass2,
        onChange: function (e) {
          setNewPass2(e.target.value);
        },
        placeholder: "\u015Eifreni tekrar yaz",
        autoComplete: "new-password"
      }));
    }), /*#__PURE__*/React.createElement("label", {
      className: "flex items-center gap-2.5 text-[13.5px] text-slate-600 dark:text-stone-300 cursor-pointer w-fit"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: showPassword,
      onChange: function (e) {
        setShowPassword(e.target.checked);
      },
      className: "h-[18px] w-[18px] rounded border-slate-300 text-teal-700"
    }), "\u015Eifreyi g\xF6ster"), primaryBtn(recReady ? "Şifreyi kaydet" : "Bağlantı doğrulanıyor…", "Kaydediliyor…", busy || !recReady, saveNewPassword), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "w-full text-[13.5px] atn-link py-2",
      onClick: function () {
        if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
        setRecovery(false);
        setRecReady(false);
        if (props.onRecoveryFailed) props.onRecoveryFailed();
      }
    }, "Giri\u015Fe d\xF6n")) : null;
    var form = /*#__PURE__*/React.createElement("div", {
      className: props.gate ? "" : "p-6 sm:p-8"
    }, recovery ? recoveryForm : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "atn-seg mb-7",
      role: "tablist",
      "aria-label": "Giri\u015F ya da kay\u0131t"
    }, /*#__PURE__*/React.createElement("span", {
      className: "atn-seg-thumb",
      style: {
        transform: mode === "up" ? "translateX(100%)" : "none"
      },
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      role: "tab",
      "aria-selected": mode === "in",
      onClick: function () {
        setMode("in");
        setMsg("");
        setStep(1);
        setPass("");
        setTouched({});
      }
    }, "Giri\u015F yap"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      role: "tab",
      "aria-selected": mode === "up",
      onClick: function () {
        setMode("up");
        setMsg("");
        setStep(1);
        setPass("");
        setTouched({});
      }
    }, "Kay\u0131t ol")), signup, loginForm), notice);
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
    var heading = recovery ? "Yeni şifreni belirle" : mode === "up" ? "Hesabını oluştur" : "Tekrar hoş geldin";
    var sub = recovery ? "Maildeki bağlantı seni buraya getirdi. Yeni şifren en az 6 karakter olsun." : mode === "up" ? "Ücretsiz. İki kısa adım; kart bilgisi istenmez." : "Kaldığın yerden devam et: programın, notların ve yanlış defterin seni bekliyor.";
    return /*#__PURE__*/React.createElement("div", {
      className: "atn-auth min-h-screen lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
    }, /*#__PURE__*/React.createElement(BrandPanel, null), /*#__PURE__*/React.createElement("main", {
      className: "min-h-screen flex flex-col"
    }, /*#__PURE__*/React.createElement("div", {
      className: "atn-brand lg:hidden relative overflow-hidden text-white px-5 pt-6 pb-16"
    }, /*#__PURE__*/React.createElement("div", {
      className: "atn-brand-grid",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("div", {
      className: "relative flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: goLand,
      className: "flex items-center gap-2.5",
      "aria-label": "Atanly ana sayfa"
    }, window.AtanomLogo ? window.AtanomLogo("h-9 w-9 object-contain") : /*#__PURE__*/React.createElement("img", {
      src: "icons/atanom.png",
      alt: "",
      className: "h-9 w-9 object-contain"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-lg font-bold tracking-tight"
    }, "Atanly")), props.toggleDark ? /*#__PURE__*/React.createElement(AuthThemeBtn, {
      dark: props.isDark,
      onClick: props.toggleDark,
      onBrand: true
    }) : null), /*#__PURE__*/React.createElement("p", {
      className: "relative mt-6 text-[12px] font-bold uppercase tracking-[0.16em] text-[#E8C987]"
    }, "KPSS \xB7 GY-GK"), /*#__PURE__*/React.createElement("p", {
      className: "relative text-2xl font-bold leading-tight mt-1.5"
    }, "Atamaya giden \xE7al\u0131\u015Fma odas\u0131.")), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex justify-center lg:items-center px-4 sm:px-8 -mt-10 lg:mt-0 pb-10 lg:py-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-[440px] bg-white dark:bg-stone-900 lg:bg-transparent lg:dark:bg-transparent rounded-[28px] lg:rounded-none shadow-[0_20px_50px_-20px_rgba(15,23,42,.35)] lg:shadow-none ring-1 ring-slate-200/70 dark:ring-stone-800 lg:ring-0 p-6 sm:p-8 lg:p-0 relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hidden lg:flex items-center justify-between mb-10"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: goLand,
      className: "atn-link text-[13.5px] inline-flex items-center gap-1"
    }, /*#__PURE__*/React.createElement(AuthIcon, {
      name: "back",
      size: 16
    }), "Ana sayfa"), props.toggleDark ? /*#__PURE__*/React.createElement(AuthThemeBtn, {
      dark: props.isDark,
      onClick: props.toggleDark
    }) : null), /*#__PURE__*/React.createElement("h1", {
      className: "text-[26px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white"
    }, heading), /*#__PURE__*/React.createElement("p", {
      className: "text-[14.5px] text-slate-500 dark:text-stone-400 mt-1.5 mb-7 leading-relaxed"
    }, sub), form, /*#__PURE__*/React.createElement("p", {
      className: "text-[11.5px] text-center text-slate-400 mt-8 leading-relaxed"
    }, /*#__PURE__*/React.createElement("a", {
      className: "hover:underline",
      href: "yasal/aydinlatma.html"
    }, "KVKK Ayd\u0131nlatma"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "hover:underline",
      href: "yasal/kullanim.html"
    }, "Kullan\u0131m"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "hover:underline",
      href: "yasal/uyelik.html"
    }, "\xDCyelik"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "hover:underline",
      href: "yasal/gizlilik.html"
    }, "Gizlilik"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "hover:underline",
      href: "yasal/cerez.html"
    }, "\xC7erez"), " · ", /*#__PURE__*/React.createElement("a", {
      className: "hover:underline",
      href: "yasal/basvuru.html"
    }, "KVKK ba\u015Fvuru"))))));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.AuthScreen = AuthScreen;
})();