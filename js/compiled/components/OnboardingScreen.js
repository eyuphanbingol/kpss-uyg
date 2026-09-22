/*jsx:babel-7.29.9-react-classic:15759:1sgceir*/
(function () {
  const {
    useState,
    useEffect,
    useRef
  } = React;
  var BackBtn = window.KpssBackBtn;

  // ============================================================
  // YARDIMCI FONKSİYONLAR
  // ============================================================

  function getLevelEmoji(level) {
    var map = {
      "lisans": "🎓",
      "onlisans": "📘",
      "ortaogretim": "🏫"
    };
    return map[level] || "📚";
  }
  function getLevelDescription(level) {
    var map = {
      "lisans": "4 yıllık fakülte mezunları",
      "onlisans": "2 yıllık yüksekokul mezunları",
      "ortaogretim": "Lise ve dengi okul mezunları"
    };
    return map[level] || "";
  }
  function getLevelColor(level, isActive) {
    var colors = {
      "lisans": isActive ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300" : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400",
      "onlisans": isActive ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300" : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400",
      "ortaogretim": isActive ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300" : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
    };
    return colors[level] || colors["lisans"];
  }
  function getExamDateHint(level) {
    var map = {
      "lisans": "Her yıl yapılır",
      "onlisans": "Çift yıllarda yapılır",
      "ortaogretim": "Çift yıllarda yapılır"
    };
    return map[level] || "";
  }
  function formatDateForDisplay(iso) {
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

  function OnboardingScreen(props) {
    const student = props.student || {};
    const dates = window.KpssConfig && window.KpssConfig.examDateByLevel || {};
    var profile = student.profile || {};

    // ---------- State ----------
    const [name, setName] = useState("");
    const [level, setLevel] = useState(student.userProfile && student.userProfile.educationLevel || "lisans");
    const [target, setTarget] = useState(student.userProfile && student.userProfile.targetType || "B");
    const [examDate, setExamDate] = useState(profile.examDate || dates[level] || "2026-09-06");
    const [step, setStep] = useState(1);
    const [animating, setAnimating] = useState(false);
    const nameInputRef = useRef(null);
    const dateInputRef = useRef(null);

    // ---------- Focus ----------
    useEffect(function () {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, []);

    // ---------- Pick Level ----------
    function pickLevel(lv) {
      setLevel(lv);
      if (dates[lv]) setExamDate(dates[lv]);
      setAnimating(true);
      setTimeout(function () {
        setAnimating(false);
      }, 300);
    }

    // ---------- Next Step ----------
    function goToNext() {
      if (step === 1 && name.trim()) {
        setStep(2);
        setTimeout(function () {
          if (dateInputRef.current) dateInputRef.current.focus();
        }, 100);
      } else if (step === 2) {
        complete();
      }
    }

    // ---------- Complete ----------
    function complete() {
      StudentStore.completeOnboarding({
        name: name,
        nickname: name,
        examDate: examDate,
        dailyMinutes: 45,
        dailyQuestions: 25,
        educationLevel: level,
        targetType: "B",
        kvkkConsent: true,
        weeklyHours: 7
      });
      if (window.SyncEngine) window.SyncEngine.sync();
    }

    // ---------- Enter Key ----------
    function handleKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        goToNext();
      }
    }

    // ---------- Level Options ----------
    var levelOptions = [{
      id: "lisans",
      t: "🎓 Lisans",
      desc: "4 yıllık fakülte"
    }, {
      id: "onlisans",
      t: "📘 Ön lisans",
      desc: "2 yıllık yüksekokul"
    }, {
      id: "ortaogretim",
      t: "🏫 Ortaöğretim",
      desc: "Lise ve dengi"
    }];

    // ============================================================
    // RENDER
    // ============================================================

    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto"
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-0 bg-black/40 backdrop-blur-sm"
    }), /*#__PURE__*/React.createElement("div", {
      className: "relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 fade-in slide-up border border-stone-200/50 dark:border-stone-700/50"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center mb-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "inline-flex items-center justify-center mb-3"
    }, window.AtanomLogo ? window.AtanomLogo("h-20 w-20 object-contain") : /*#__PURE__*/React.createElement("img", {
      src: "icons/atanom.png",
      alt: "Atanly",
      className: "h-20 w-20 object-contain"
    })), /*#__PURE__*/React.createElement("h2", {
      className: "text-2xl font-black gradient-text"
    }, "Atanly"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-1 max-w-xs mx-auto"
    }, "Hedefine do\u011Fru ilk ad\u0131m\u0131 atal\u0131m")), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-6"
    }, [1, 2].map(function (s) {
      var isActive = s === step;
      var isPast = s < step;
      return /*#__PURE__*/React.createElement("div", {
        key: s,
        className: "flex items-center gap-2 flex-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "h-2 rounded-full transition-all duration-500 flex-1 " + (isActive ? "bg-indigo-600 shadow-sm shadow-indigo-500/30" : isPast ? "bg-emerald-500" : "bg-stone-200 dark:bg-stone-700")
      }), s < 2 && /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] text-stone-400"
      }, isPast ? "✓" : "·"));
    })), step === 1 && /*#__PURE__*/React.createElement("div", {
      className: "space-y-4 slide-up"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5",
      htmlFor: "ob-name"
    }, "\uD83D\uDC64 Ad\u0131n"), /*#__PURE__*/React.createElement("input", {
      id: "ob-name",
      ref: nameInputRef,
      value: name,
      onChange: function (e) {
        setName(e.target.value);
      },
      onKeyDown: handleKeyDown,
      placeholder: "Ad\u0131n\u0131 yaz",
      className: "w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[15px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all",
      autoComplete: "given-name"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 mt-1.5"
    }, "Bu isim liderlik tablosunda g\xF6r\xFCnecek")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-stone-600 dark:text-stone-300 mb-2"
    }, "\uD83C\uDFAF E\u011Fitim D\xFCzeyin"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2"
    }, levelOptions.map(function (x) {
      var isActive = level === x.id;
      var color = getLevelColor(x.id, isActive);
      return /*#__PURE__*/React.createElement("button", {
        key: x.id,
        type: "button",
        onClick: function () {
          pickLevel(x.id);
        },
        className: "text-center py-3.5 rounded-2xl border-2 font-medium transition-all duration-200 " + color + (isActive ? " shadow-sm scale-[1.02]" : " hover:border-stone-300 dark:hover:border-stone-600")
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-lg"
      }, getLevelEmoji(x.id)), /*#__PURE__*/React.createElement("div", {
        className: "text-xs mt-0.5"
      }, x.t.split(" ").slice(1).join(" ")));
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 mt-2 text-center"
    }, getLevelDescription(level))), /*#__PURE__*/React.createElement("button", {
      disabled: !name.trim(),
      onClick: goToNext,
      className: "w-full py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
    }, "Devam \u2192")), step === 2 && /*#__PURE__*/React.createElement("div", {
      className: "space-y-4 slide-up"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5",
      htmlFor: "ob-date"
    }, "\uD83D\uDCC5 S\u0131nav Tarihi"), /*#__PURE__*/React.createElement("input", {
      id: "ob-date",
      ref: dateInputRef,
      type: "date",
      value: examDate,
      onChange: function (e) {
        setExamDate(e.target.value);
      },
      className: "w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[15px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 mt-1.5"
    }, getExamDateHint(level), " \xB7 Se\xE7ilen: ", formatDateForDisplay(examDate))), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 p-4 border border-indigo-100 dark:border-indigo-800/30"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "\uD83D\uDCA1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-medium text-indigo-700 dark:text-indigo-300"
    }, level === "lisans" ? "🎓 Lisans KPSS" : level === "onlisans" ? "📘 Ön Lisans KPSS" : "🏫 Ortaöğretim KPSS"), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-indigo-600/70 dark:text-indigo-400/70 mt-0.5"
    }, level === "lisans" ? "Her yıl düzenlenir" : "Çift yıllarda düzenlenir")))), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-stone-500 leading-relaxed"
    }, "Devam ederek", " ", /*#__PURE__*/React.createElement("a", {
      className: "text-teal-700 font-semibold underline",
      href: "yasal/kullanim.html",
      target: "_blank",
      rel: "noopener"
    }, "Kullan\u0131m Ko\u015Fullar\u0131"), " ", "ve", " ", /*#__PURE__*/React.createElement("a", {
      className: "text-teal-700 font-semibold underline",
      href: "yasal/uyelik.html",
      target: "_blank",
      rel: "noopener"
    }, "\xDCyelik S\xF6zle\u015Fmesi"), "'ni kabul etmiş olursunuz. ", /*#__PURE__*/React.createElement("a", {
      className: "underline",
      href: "yasal/aydinlatma.html",
      target: "_blank",
      rel: "noopener"
    }, "KVKK Ayd\u0131nlatma Metni")), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 pt-2"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: function () {
        setStep(1);
      },
      label: "Geri"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: complete,
      className: "flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
    }, "\uD83D\uDE80 Ba\u015Fla"))), /*#__PURE__*/React.createElement("div", {
      className: "mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400"
    }, "\uD83D\uDD12 Verilerin g\xFCvende \xB7 \u0130stedi\u011Fin zaman profilinden silebilirsin"))));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.OnboardingScreen = OnboardingScreen;
})();