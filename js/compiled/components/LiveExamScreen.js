/*jsx:babel-7.29.9-react-classic:15308:17iyxk3*/
(function () {
  const {
    useState,
    useEffect,
    useMemo
  } = React;
  var BackBtn = window.KpssBackBtn;

  // ============================================================
  // YARDIMCI FONKSİYONLAR
  // ============================================================

  function nextSaturday21() {
    var d = new Date();
    var day = d.getDay();
    var add = (6 - day + 7) % 7;
    if (add === 0 && (d.getHours() > 21 || d.getHours() === 21 && d.getMinutes() > 0)) add = 7;
    d.setDate(d.getDate() + add);
    d.setHours(21, 0, 0, 0);
    return d;
  }
  function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    var seconds = Math.floor(ms / 1000);
    var days = Math.floor(seconds / 86400);
    seconds %= 86400;
    var hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;
    if (days > 0) return days + "g " + hours + "s " + minutes + "dk";
    if (hours > 0) return hours + "s " + minutes + "dk " + seconds + "sn";
    if (minutes > 0) return minutes + "dk " + seconds + "sn";
    return seconds + "sn";
  }
  function getCountdownColor(ms) {
    if (ms < 3600000) return "text-rose-500 animate-pulse"; // < 1 saat
    if (ms < 86400000) return "text-amber-500"; // < 1 gün
    return "text-indigo-600 dark:text-indigo-400";
  }
  function getPhase(ms) {
    if (ms <= 0) return {
      label: "🚀 Canlı Yayında!",
      color: "bg-emerald-500"
    };
    if (ms < 3600000) return {
      label: "⏰ Çok Yakında!",
      color: "bg-rose-500 animate-pulse"
    };
    if (ms < 86400000) return {
      label: "📅 Yarın!",
      color: "bg-amber-500"
    };
    if (ms < 172800000) return {
      label: "📅 2 Gün Kaldı",
      color: "bg-indigo-500"
    };
    return {
      label: "📅 Hazırlanıyor",
      color: "bg-stone-400"
    };
  }
  function getTimeUntilNext(ms) {
    if (ms < 0) return "🔴 Şimdi!";
    var hours = Math.floor(ms / 3600000);
    if (hours > 48) return Math.floor(hours / 24) + " gün sonra";
    if (hours > 24) return "1 gün " + (hours - 24) + " saat sonra";
    return hours + " saat " + Math.floor(ms % 3600000 / 60000) + " dk sonra";
  }
  function getParticipants(count) {
    if (count >= 1000) return "1.000+";
    if (count >= 100) return "100+";
    if (count >= 10) return "10+";
    return count;
  }

  // ============================================================
  // ANA BİLEŞEN
  // ============================================================

  function LiveExamScreen(props) {
    var targetTime = nextSaturday21();
    var [now, setNow] = useState(Date.now());
    var [participants, setParticipants] = useState(42);
    var [isLive, setIsLive] = useState(false);
    var [countdownEnded, setCountdownEnded] = useState(false);

    // ---------- Countdown Timer ----------
    useEffect(function () {
      var interval = setInterval(function () {
        var current = Date.now();
        setNow(current);
        var diff = targetTime.getTime() - current;
        if (diff <= 0) {
          setIsLive(true);
          setCountdownEnded(true);
        } else {
          setIsLive(false);
        }
      }, 1000);
      return function () {
        clearInterval(interval);
      };
    }, [targetTime]);

    // ---------- Simüle Katılımcı ----------
    useEffect(function () {
      var interval = setInterval(function () {
        if (isLive) {
          setParticipants(function (prev) {
            var increase = Math.floor(Math.random() * 3) + 1;
            return Math.min(999, prev + increase);
          });
        } else {
          setParticipants(function (prev) {
            var change = Math.floor(Math.random() * 3) - 1;
            return Math.max(10, prev + change);
          });
        }
      }, 3000);
      return function () {
        clearInterval(interval);
      };
    }, [isLive]);

    // ---------- Hesaplamalar ----------
    var diff = targetTime.getTime() - now;
    var countdown = formatCountdown(diff);
    var color = getCountdownColor(diff);
    var phase = getPhase(diff);
    var timeUntil = getTimeUntilNext(diff);
    var participantCount = getParticipants(participants);
    var dayName = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"][targetTime.getDay()];

    // ---------- Saat dilimi ----------
    var timeStr = targetTime.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    });
    var dateStr = targetTime.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    // ============================================================
    // RENDER
    // ============================================================

    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-2xl mx-auto px-4 py-6 pb-10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center mb-6 slide-up"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl md:text-3xl font-black gradient-text"
    }, "\uD83D\uDE80 Canl\u0131 Deneme"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-0.5"
    }, "Her hafta ayn\u0131 saatte, herkesle birlikte")), /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Geri"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400 dark:text-stone-500 mb-5"
    }, "\uD83D\uDCCA Ger\xE7ek s\u0131nav atmosferi \xB7 Haftal\u0131k etkinlik \xB7 GY-GK denemesi"), /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass p-6 card-hover relative overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "h-2.5 w-2.5 rounded-full " + (isLive ? "bg-emerald-500 animate-pulse" : "bg-stone-400")
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-medium text-stone-500 dark:text-stone-400"
    }, isLive ? "🟢 Canlı Yayında!" : "⏳ Bekleniyor")), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold px-2.5 py-0.5 rounded-full " + (isLive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400")
    }, isLive ? "🔴 LİVE" : "YAKINDA")), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-block px-3 py-1.5 rounded-full text-xs font-bold text-white " + phase.color
    }, phase.label)), /*#__PURE__*/React.createElement("div", {
      className: "text-center py-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 dark:text-stone-500"
    }, isLive ? "Deneme başladı!" : "Kalan Süre"), /*#__PURE__*/React.createElement("div", {
      className: "font-stat text-5xl md:text-6xl font-bold mt-1 " + color
    }, isLive ? "🔴 ŞİMDİ" : countdown), !isLive && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400 mt-2"
    }, dateStr, " \xB7 ", dayName, " ", timeStr, "'de ba\u015Fl\u0131yor")), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center gap-2 mt-2 text-sm text-stone-500 dark:text-stone-400"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "\uD83D\uDC65"), /*#__PURE__*/React.createElement("span", null, participantCount, " kat\u0131l\u0131mc\u0131"), isLive && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-emerald-500 animate-pulse"
    }, "+ canl\u0131")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-stone-200 dark:border-stone-700"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 uppercase tracking-wider"
    }, "\uD83D\uDCC5 G\xFCn"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, dayName)), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 uppercase tracking-wider"
    }, "\u23F0 Saat"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, timeStr)), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 uppercase tracking-wider"
    }, "\uD83D\uDCDD Soru"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, "40")), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 uppercase tracking-wider"
    }, "\u23F1\uFE0F S\xFCre"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, "40 dk")))), /*#__PURE__*/React.createElement("div", {
      className: "mt-5 rounded-3xl glass p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "\uD83D\uDCA1"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, "Nas\u0131l \xC7al\u0131\u015F\u0131r?")), /*#__PURE__*/React.createElement("ul", {
      className: "space-y-2 text-xs text-stone-500 dark:text-stone-400"
    }, /*#__PURE__*/React.createElement("li", {
      className: "flex items-start gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-indigo-500"
    }, "\u2022"), "Her hafta ", /*#__PURE__*/React.createElement("strong", {
      className: "text-stone-700 dark:text-stone-300"
    }, "Cumartesi 21:00"), "'de canl\u0131 deneme d\xFCzenlenir"), /*#__PURE__*/React.createElement("li", {
      className: "flex items-start gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-indigo-500"
    }, "\u2022"), "Herkes ayn\u0131 anda ba\u015Flar, ayn\u0131 s\xFCrede \xE7\xF6zer"), /*#__PURE__*/React.createElement("li", {
      className: "flex items-start gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-indigo-500"
    }, "\u2022"), "Sonu\xE7lar an\u0131nda liderlik tablosuna eklenir"), /*#__PURE__*/React.createElement("li", {
      className: "flex items-start gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-indigo-500"
    }, "\u2022"), "Ka\xE7\u0131rd\u0131ysan ", /*#__PURE__*/React.createElement("strong", {
      className: "text-stone-700 dark:text-stone-300"
    }, "\"\u015Eimdi \xC7\xF6z\""), " ile tek ba\u015F\u0131na da \xE7\xF6zebilirsin"))), /*#__PURE__*/React.createElement("div", {
      className: "mt-5 space-y-3"
    }, isLive && /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        if (props.onStartExam) props.onStartExam();
      },
      className: "w-full py-4 rounded-2xl btn-primary text-white font-bold text-lg shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all animate-pulse"
    }, "\uD83D\uDE80 Canl\u0131 Denemeye Kat\u0131l!"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        if (props.onStartExam) props.onStartExam();else if (props.onClose) props.onClose();
      },
      className: "w-full py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
    }, isLive ? "📝 Tek Başına Dene" : "📝 Şimdi Denemeyi Çöz"), !isLive && /*#__PURE__*/React.createElement("p", {
      className: "text-center text-[10px] text-stone-400"
    }, "\u23F3 Bir sonraki canl\u0131 denemeye ", timeUntil)), /*#__PURE__*/React.createElement("div", {
      className: "mt-6 rounded-3xl glass p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, "\xD6nceki Denemeler")), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-stone-400"
    }, "Son 3")), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, [{
      date: "20.09.2025",
      participants: 87,
      avg: 68
    }, {
      date: "13.09.2025",
      participants: 73,
      avg: 62
    }, {
      date: "06.09.2025",
      participants: 65,
      avg: 58
    }].map(function (exam, idx) {
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800 last:border-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-xs text-stone-400"
      }, idx + 1), /*#__PURE__*/React.createElement("span", {
        className: "text-xs font-medium"
      }, exam.date)), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-4 text-xs text-stone-400"
      }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC65 ", exam.participants), /*#__PURE__*/React.createElement("span", {
        className: "font-medium text-indigo-600"
      }, "%", exam.avg)));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mt-6 text-center text-[10px] text-stone-400"
    }, /*#__PURE__*/React.createElement("p", null, "\uD83D\uDCCC Saatler yerel saat dilimine g\xF6redir \xB7 Kat\u0131l\u0131m \xFCcretsizdir")));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.LiveExamScreen = LiveExamScreen;
})();