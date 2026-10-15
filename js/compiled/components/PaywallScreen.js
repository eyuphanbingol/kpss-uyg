/*jsx:babel-7.29.9-react-classic:6468:14rqpli*/
(function () {
  const {
    useState,
    useEffect
  } = React;
  var BackBtn = window.KpssBackBtn;

  // Premium ekranı (web). Ödeme web'de alınmaz: Premium ve canlı deneme kaydı yalnız Google Play / App Store
  // üzerinden uygulamadan satın alınır. Satın alınca hesap web'de de Premium olur (sunucu: monet_status).
  // Mobil karşılığı: mobile/src/screens/ExtraScreens.js → PaywallScreen (satın alma orada).

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return "";
    }
  }
  function PaywallScreen(props) {
    var M = window.Monetization;
    const [, setTick] = useState(0);
    const [busy, setBusy] = useState(false);
    useEffect(function () {
      if (!M) return undefined;
      return M.subscribe(function () {
        setTick(function (x) {
          return x + 1;
        });
      });
    }, []);
    var cfg = window.KpssConfig || {};
    var stores = cfg.stores || {};
    var prices = M && M.PRICES || {
      monthly: "200 TL",
      yearly: "1000 TL",
      live: "50 TL"
    };
    if (!M || !M.enabled()) {
      return /*#__PURE__*/React.createElement("div", {
        className: "max-w-lg mx-auto px-4 py-12 text-center"
      }, /*#__PURE__*/React.createElement("h1", {
        className: "text-xl font-black mb-2"
      }, "T\xFCm \xF6zellikler a\xE7\u0131k"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-400 mb-6"
      }, "\u015Eu an b\xFCt\xFCn konular ve oyunlar \xFCcretsiz."), /*#__PURE__*/React.createElement(BackBtn, {
        onClick: props.onBack,
        label: "Geri"
      }));
    }
    function refresh() {
      if (!window.MonetWeb) return;
      setBusy(true);
      window.MonetWeb.refresh().then(function () {
        setBusy(false);
      }, function () {
        setBusy(false);
      });
    }
    var premium = M.isPremium();
    var until = M.premiumUntil();
    var n = M.freeCount();
    return /*#__PURE__*/React.createElement("div", {
      className: "app-page py-6 pb-10 max-w-2xl mx-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-6 slide-up"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl md:text-3xl font-black gradient-text"
    }, "Atanly Premium"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-0.5"
    }, "B\xFCt\xFCn konular ve oyunlar, reklams\u0131z")), premium ? /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl p-6 mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-lg font-black text-emerald-800 dark:text-emerald-300"
    }, "Premium a\xE7\u0131k"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-emerald-700 dark:text-emerald-400 mt-1"
    }, until ? fmtDate(until) + " tarihine kadar geçerli." : "Süresiz.", " Aboneli\u011Fini sat\u0131n ald\u0131\u011F\u0131n ma\u011Fazadan (Google Play / App Store) y\xF6netebilir ya da iptal edebilirsin.")) : null, /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-2 gap-4 mb-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl p-6 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-stone-500"
    }, "Ayl\u0131k"), /*#__PURE__*/React.createElement("p", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-stat text-4xl font-bold"
    }, prices.monthly), /*#__PURE__*/React.createElement("span", {
      className: "text-sm text-stone-400 ml-1"
    }, "/ ay"))), /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl p-6 border-2 border-indigo-500 relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20"
    }, /*#__PURE__*/React.createElement("span", {
      className: "absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white"
    }, "En avantajl\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-stone-500"
    }, "Y\u0131ll\u0131k"), /*#__PURE__*/React.createElement("p", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-stat text-4xl font-bold"
    }, prices.yearly), /*#__PURE__*/React.createElement("span", {
      className: "text-sm text-stone-400 ml-1"
    }, "/ y\u0131l")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-indigo-600 dark:text-indigo-300 mt-1"
    }, "Ayda yakla\u015F\u0131k 83 TL"))), /*#__PURE__*/React.createElement("ul", {
      className: "rounded-3xl glass p-5 mb-5 space-y-2 text-sm text-stone-600 dark:text-stone-300"
    }, /*#__PURE__*/React.createElement("li", null, "\u2713 B\xFCt\xFCn konu notlar\u0131 ve testleri"), /*#__PURE__*/React.createElement("li", null, "\u2713 B\xFCt\xFCn harita oyunlar\u0131 ve bo\u015Fluk doldurma"), /*#__PURE__*/React.createElement("li", null, "\u2713 Reklam yok"), /*#__PURE__*/React.createElement("li", null, "\u2713 Telefonda ve web'de ayn\u0131 hesap")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl p-5 mb-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-bold mb-1"
    }, "Sat\u0131n alma uygulamadan yap\u0131l\u0131r"), /*#__PURE__*/React.createElement("p", null, "Premium'u Atanly uygulamas\u0131ndan Google Play ya da App Store ile alabilirsin; web'de kart bilgisi istenmez. Sat\u0131n ald\u0131ktan sonra burada otomatik a\xE7\u0131l\u0131r."), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mt-3"
    }, stores.play ? /*#__PURE__*/React.createElement("a", {
      className: "px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-semibold",
      href: stores.play,
      target: "_blank",
      rel: "noopener"
    }, "Google Play'den indir") : null, stores.appStore ? /*#__PURE__*/React.createElement("a", {
      className: "px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-semibold",
      href: stores.appStore,
      target: "_blank",
      rel: "noopener"
    }, "App Store'dan indir") : null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: busy,
      onClick: refresh,
      className: "px-4 py-2 rounded-xl border-2 border-amber-300 text-sm font-semibold disabled:opacity-50"
    }, busy ? "Kontrol ediliyor…" : "Satın aldım, yenile"))), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-stone-400 space-y-1"
    }, /*#__PURE__*/React.createElement("p", null, "Premium olmadan da her b\xF6l\xFCm\xFCn ilk ", n, " ba\u015Fl\u0131\u011F\u0131 \xFCcretsiz; di\u011Ferlerini uygulamada k\u0131sa bir reklam izleyerek ", M.unlockHours(), " saat a\xE7abilirsin."), /*#__PURE__*/React.createElement("p", null, "Canl\u0131 denemeler Premium'a dahil de\u011Fildir: her hesab\u0131n ilk canl\u0131 denemesi \xFCcretsiz, sonrakiler kay\u0131t ba\u015F\u0131na ", prices.live, "."), /*#__PURE__*/React.createElement("p", null, "Abonelik, ma\u011Faza hesab\u0131ndan iptal edilmedik\xE7e d\xF6nem sonunda otomatik yenilenir.")));
  }
  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.PaywallScreen = PaywallScreen;
})();