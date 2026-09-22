/*jsx:babel-7.29.9-react-classic:21051:1cm009o*/
(function () {
  const {
    useEffect,
    useState,
    useMemo
  } = React;
  var BackBtn = window.KpssBackBtn;

  // ============================================================
  // YARDIMCI FONKSİYONLAR
  // ============================================================

  function getScoreLevel(score) {
    if (score >= 90) return {
      label: "🌟 Mükemmel",
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30"
    };
    if (score >= 75) return {
      label: "✅ İyi",
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900/30"
    };
    if (score >= 60) return {
      label: "📈 Orta",
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/30"
    };
    if (score >= 40) return {
      label: "📉 Gelişmeli",
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    };
    return {
      label: "🔴 Çalışma Gerekli",
      color: "text-rose-600",
      bg: "bg-rose-100 dark:bg-rose-900/30"
    };
  }
  function getStatusBadge(diff) {
    if (diff >= 4) return {
      label: "✅ Güvenli",
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    };
    if (diff >= 0) return {
      label: "⚠️ Sınırda",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    };
    return {
      label: "🔴 Riskli",
      color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
    };
  }
  function getDiffEmoji(diff) {
    if (diff >= 4) return "🟢";
    if (diff >= 0) return "🟡";
    return "🔴";
  }
  function formatNumber(num) {
    return new Intl.NumberFormat('tr-TR').format(num);
  }
  function getScoreColor(score) {
    if (score >= 90) return "text-emerald-600";
    if (score >= 75) return "text-indigo-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-rose-600";
  }
  function getProgressWidth(score) {
    return Math.min(100, score / 100 * 100);
  }

  // ============================================================
  // ANA BİLEŞEN
  // ============================================================

  function PlacementScreen(props) {
    const [rows, setRows] = useState([]);
    const [ready, setReady] = useState(false);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("taban");
    const [searchTerm, setSearchTerm] = useState("");
    const est = window.ScoreEngine && window.ScoreEngine.estimate ? window.ScoreEngine.estimate(props.student) : {
      score: 0,
      level: "lisans",
      gyNet: 0,
      gkNet: 0,
      note: "Puan motoru yok."
    };
    const premium = window.StudentStore && window.StudentStore.isPremium();

    // ---------- Load Data ----------
    useEffect(function () {
      setLoading(true);
      fetch("data/tabanPuanlar.json").then(function (r) {
        return r.json();
      }).then(function (j) {
        setReady(!!(j && j.ready && j.rows && j.rows.length));
        setRows(j && j.rows || []);
        setNote(j && j.note || "");
        setLoading(false);
      }).catch(function () {
        setReady(false);
        setLoading(false);
      });
    }, []);

    // ---------- Filter & Sort ----------
    var filteredRows = useMemo(function () {
      var result = rows.filter(function (r) {
        if (r.level && r.level !== est.level) return false;
        if (searchTerm) {
          var hay = (r.kurum || "") + " " + (r.unvan || "") + " " + (r.il || "");
          return hay.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      });
      if (filter === "safe") {
        result = result.filter(function (r) {
          return Number(est.score) - Number(r.taban) >= 4;
        });
      } else if (filter === "risky") {
        result = result.filter(function (r) {
          return Number(est.score) - Number(r.taban) < 0;
        });
      } else if (filter === "border") {
        result = result.filter(function (r) {
          var diff = Number(est.score) - Number(r.taban);
          return diff >= 0 && diff < 4;
        });
      }
      if (sortBy === "taban") {
        result = result.slice().sort(function (a, b) {
          return Number(b.taban) - Number(a.taban);
        });
      } else if (sortBy === "diff") {
        result = result.slice().sort(function (a, b) {
          var diffA = Number(est.score) - Number(a.taban);
          var diffB = Number(est.score) - Number(b.taban);
          return diffB - diffA;
        });
      } else if (sortBy === "kurum") {
        result = result.slice().sort(function (a, b) {
          return (a.kurum || "").localeCompare(b.kurum || "");
        });
      }
      return result;
    }, [rows, est.score, est.level, filter, sortBy, searchTerm]);

    // ---------- Hits ----------
    var hits = ready && window.ScoreEngine && window.ScoreEngine.matchPlacement ? window.ScoreEngine.matchPlacement(est.score, filteredRows) : [];
    if (!premium && hits.length > 3) hits = hits.slice(0, 3);

    // ---------- Stats ----------
    var totalMatches = hits.length;
    var safeMatches = hits.filter(function (h) {
      return Number(est.score) - Number(h.taban) >= 4;
    }).length;
    var riskyMatches = hits.filter(function (h) {
      return Number(est.score) - Number(h.taban) < 0;
    }).length;
    var scoreLevel = getScoreLevel(est.score);

    // ============================================================
    // RENDER
    // ============================================================

    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-3xl mx-auto px-4 py-6 pb-10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center mb-6 slide-up"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl md:text-3xl font-black gradient-text"
    }, "\uD83C\uDFAF Puan / Tercih"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-0.5"
    }, "Tahmini puan\u0131na g\xF6re kurum e\u015Fle\u015Ftirmesi")), /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Geri"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400 dark:text-stone-500 mb-5"
    }, "\uD83D\uDCCA Kaba puan tahmini \xB7 \xD6SYM sonucu de\u011Fildir \xB7 GY-GK baz al\u0131n\u0131r"), /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 mb-5 shadow-xl shadow-indigo-500/20 card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold uppercase tracking-wider opacity-70"
    }, "\uD83D\uDCCA Tahmini ", est.level), /*#__PURE__*/React.createElement("div", {
      className: "font-stat text-5xl md:text-6xl font-bold mt-1"
    }, est.score), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mt-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold px-2.5 py-0.5 rounded-full " + scoreLevel.bg + " text-inherit"
    }, scoreLevel.label))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs opacity-70"
    }, "\uD83D\uDCDD Net"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium"
    }, "GY ", est.gyNet), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium"
    }, "GK ", est.gkNet))), est.note && /*#__PURE__*/React.createElement("p", {
      className: "text-sm opacity-80 mt-3 pt-3 border-t border-white/10"
    }, "\uD83D\uDCA1 ", est.note)), loading && /*#__PURE__*/React.createElement("div", {
      className: "text-center py-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-3"
    }, "Taban puanlar y\xFCkleniyor...")), !loading && !ready && /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass p-8 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-5xl mb-4"
    }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-bold text-stone-600 dark:text-stone-300 mb-2"
    }, "Veri Y\xFCklenemedi"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 max-w-sm mx-auto"
    }, "Taban puan listesi hen\xFCz y\xFCklenmemi\u015F. Puan motoru \xE7al\u0131\u015F\u0131yor, GY-GK etkilenmez."), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setLoading(true);
        fetch("data/tabanPuanlar.json").then(function (r) {
          return r.json();
        }).then(function (j) {
          setReady(!!(j && j.ready && j.rows && j.rows.length));
          setRows(j && j.rows || []);
          setNote(j && j.note || "");
          setLoading(false);
        }).catch(function () {
          setReady(false);
          setLoading(false);
        });
      },
      className: "mt-4 px-6 py-2 rounded-2xl btn-primary text-white font-semibold"
    }, "\uD83D\uDD04 Yeniden Dene")), !loading && ready && /*#__PURE__*/React.createElement("div", null, hits.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-3 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl glass p-3 text-center card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-indigo-600"
    }, totalMatches), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400"
    }, "\uD83C\uDFAF Toplam")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl glass p-3 text-center card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-emerald-600"
    }, safeMatches), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400"
    }, "\u2705 G\xFCvenli")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl glass p-3 text-center card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-rose-600"
    }, riskyMatches), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400"
    }, "\uD83D\uDD34 Riskli"))), note && /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-300 mb-4"
    }, "\uD83D\uDCA1 ", note), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mb-4"
    }, /*#__PURE__*/React.createElement("input", {
      value: searchTerm,
      onChange: function (e) {
        setSearchTerm(e.target.value);
      },
      placeholder: "\uD83D\uDD0D Ara: kurum, unvan, il...",
      className: "flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
    }), /*#__PURE__*/React.createElement("select", {
      value: filter,
      onChange: function (e) {
        setFilter(e.target.value);
      },
      className: "px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
    }, /*#__PURE__*/React.createElement("option", {
      value: "all"
    }, "\uD83D\uDCCB T\xFCm\xFC"), /*#__PURE__*/React.createElement("option", {
      value: "safe"
    }, "\u2705 G\xFCvenli"), /*#__PURE__*/React.createElement("option", {
      value: "border"
    }, "\uD83D\uDFE1 S\u0131n\u0131rda"), /*#__PURE__*/React.createElement("option", {
      value: "risky"
    }, "\uD83D\uDD34 Riskli")), /*#__PURE__*/React.createElement("select", {
      value: sortBy,
      onChange: function (e) {
        setSortBy(e.target.value);
      },
      className: "px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
    }, /*#__PURE__*/React.createElement("option", {
      value: "taban"
    }, "\uD83D\uDCCA Taban Puan"), /*#__PURE__*/React.createElement("option", {
      value: "diff"
    }, "\uD83D\uDCC8 Fark"), /*#__PURE__*/React.createElement("option", {
      value: "kurum"
    }, "\uD83D\uDD24 Kurum"))), !premium && hits.length >= 3 && /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-3 text-xs text-indigo-700 dark:text-indigo-300 mb-4 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD13 Premium ile t\xFCm e\u015Fle\u015Fmeleri g\xF6rebilirsin"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        if (props.onOpen) props.onOpen("paywall");
      },
      className: "px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold"
    }, "Y\xFCkselt")), hits.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass p-8 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-4xl mb-3"
    }, "\uD83D\uDD0D"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400"
    }, "Bu skor i\xE7in e\u015Fle\u015Fen kurum bulunamad\u0131."), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400 mt-1"
    }, "Filtreleri de\u011Fi\u015Ftirmeyi dene")) : /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, hits.map(function (h, i) {
      var diff = Number(est.score) - Number(h.taban);
      var safe = diff >= 4;
      var status = getStatusBadge(diff);
      var diffEmoji = getDiffEmoji(diff);
      var displayDiff = diff >= 0 ? "+" + diff : diff;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "rounded-2xl glass p-4 card-hover transition-all duration-200 border-l-4 " + (safe ? "border-l-emerald-500" : diff >= 0 ? "border-l-amber-500" : "border-l-rose-500")
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-start justify-between gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 flex-wrap"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-semibold text-sm"
      }, h.kurum || "—"), /*#__PURE__*/React.createElement("span", {
        className: "text-xs text-stone-400"
      }, "\xB7"), /*#__PURE__*/React.createElement("span", {
        className: "text-xs text-stone-500"
      }, h.unvan || "—")), /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap gap-3 mt-1 text-xs text-stone-400"
      }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCD ", h.il || "—"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCA Taban: ", h.taban), /*#__PURE__*/React.createElement("span", {
        className: "font-medium " + (safe ? "text-emerald-600" : diff >= 0 ? "text-amber-600" : "text-rose-600")
      }, diffEmoji, " ", displayDiff, " puan fark"))), /*#__PURE__*/React.createElement("div", {
        className: "text-right shrink-0"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] font-bold px-2 py-0.5 rounded-full " + status.color
      }, status.label), /*#__PURE__*/React.createElement("div", {
        className: "mt-1 h-1 w-16 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden ml-auto"
      }, /*#__PURE__*/React.createElement("div", {
        className: "h-full rounded-full " + (safe ? "bg-emerald-500" : diff >= 0 ? "bg-amber-500" : "bg-rose-500"),
        style: {
          width: Math.min(100, Number(h.taban) / 100 * 100) + "%"
        }
      })))));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mt-6 rounded-2xl bg-stone-50 dark:bg-stone-800/30 p-4 border border-stone-200 dark:border-stone-700"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-medium text-stone-600 dark:text-stone-300"
    }, "Uyar\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 leading-relaxed"
    }, "Bu puan tahmini ", /*#__PURE__*/React.createElement("strong", null, "kaba bir de\u011Ferlendirmedir"), ". Ger\xE7ek \xD6SYM sonucu farkl\u0131l\u0131k g\xF6sterebilir. Taban puanlar ge\xE7mi\u015F y\u0131llara aittir, g\xFCncel de\u011Fildir.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      className: "text-indigo-600 dark:text-indigo-400"
    }, "Resmi tercih dan\u0131\u015Fmanl\u0131\u011F\u0131 de\u011Fildir."))))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 text-center text-[10px] text-stone-400"
    }, /*#__PURE__*/React.createElement("p", null, "\uD83D\uDCCA Veriler \xF6rnek ama\xE7l\u0131d\u0131r \xB7 Ger\xE7ek tercihler i\xE7in \xD6SYM'yi ziyaret edin")));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.PlacementScreen = PlacementScreen;
})();