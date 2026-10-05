/*jsx:babel-7.29.9-react-classic:241468:1g16gya*/
const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;
const DERS_THEME = {
  "Tarih": {
    text: "text-stone-700",
    icon: "📜",
    darkText: "text-stone-300",
    accent: "#ea580c",
    pastel: "#ffedd5"
  },
  "Coğrafya": {
    text: "text-stone-700",
    icon: "🗺️",
    darkText: "text-stone-300",
    accent: "#059669",
    pastel: "#d1fae5"
  },
  "Türkçe": {
    text: "text-stone-700",
    icon: "✍️",
    darkText: "text-stone-300",
    accent: "#2563eb",
    pastel: "#dbeafe"
  },
  "Vatandaşlık": {
    text: "text-stone-700",
    icon: "⚖️",
    darkText: "text-stone-300",
    accent: "#7c3aed",
    pastel: "#ede9fe"
  },
  "Güncel Bilgiler": {
    text: "text-stone-700",
    icon: "📰",
    darkText: "text-stone-300",
    accent: "#db2777",
    pastel: "#fce7f3"
  },
  "Geometri": {
    text: "text-stone-700",
    icon: "📐",
    darkText: "text-stone-300",
    accent: "#0d9488",
    pastel: "#ccfbf1"
  },
  "Hukuk": {
    text: "text-stone-700",
    icon: "⚖️",
    darkText: "text-stone-300",
    accent: "#4f46e5",
    pastel: "#e0e7ff"
  },
  "İktisat": {
    text: "text-stone-700",
    icon: "📈",
    darkText: "text-stone-300",
    accent: "#0f766e",
    pastel: "#ccfbf1"
  },
  "Maliye": {
    text: "text-stone-700",
    icon: "🏦",
    darkText: "text-stone-300",
    accent: "#b45309",
    pastel: "#fef3c7"
  },
  "Muhasebe": {
    text: "text-stone-700",
    icon: "📒",
    darkText: "text-stone-300",
    accent: "#0369a1",
    pastel: "#e0f2fe"
  },
  "İşletme": {
    text: "text-stone-700",
    icon: "🏢",
    darkText: "text-stone-300",
    accent: "#be185d",
    pastel: "#fce7f3"
  },
  "İstatistik": {
    text: "text-stone-700",
    icon: "📊",
    darkText: "text-stone-300",
    accent: "#4338ca",
    pastel: "#e0e7ff"
  },
  "Kamu Yönetimi": {
    text: "text-stone-700",
    icon: "🏛️",
    darkText: "text-stone-300",
    accent: "#b91c1c",
    pastel: "#fee2e2"
  },
  "Uluslararası İlişkiler": {
    text: "text-stone-700",
    icon: "🌐",
    darkText: "text-stone-300",
    accent: "#1d4ed8",
    pastel: "#dbeafe"
  },
  "ÇEKO": {
    text: "text-stone-700",
    icon: "👷",
    darkText: "text-stone-300",
    accent: "#047857",
    pastel: "#d1fae5"
  },
  "AGS Sözel Yetenek": {
    text: "text-stone-700",
    icon: "🗣️",
    darkText: "text-stone-300",
    accent: "#1d4ed8",
    pastel: "#dbeafe"
  },
  "AGS Sayısal Yetenek": {
    text: "text-stone-700",
    icon: "🔢",
    darkText: "text-stone-300",
    accent: "#0f766e",
    pastel: "#ccfbf1"
  },
  "AGS Tarih": {
    text: "text-stone-700",
    icon: "📜",
    darkText: "text-stone-300",
    accent: "#b45309",
    pastel: "#fef3c7"
  },
  "AGS Türkiye Coğrafyası": {
    text: "text-stone-700",
    icon: "🗺️",
    darkText: "text-stone-300",
    accent: "#047857",
    pastel: "#d1fae5"
  },
  "AGS Eğitim Bilimleri": {
    text: "text-stone-700",
    icon: "🎓",
    darkText: "text-stone-300",
    accent: "#be185d",
    pastel: "#fce7f3"
  },
  "AGS Mevzuat": {
    text: "text-stone-700",
    icon: "⚖️",
    darkText: "text-stone-300",
    accent: "#4f46e5",
    pastel: "#e0e7ff"
  },
  "ÖABT Türkçe": {
    text: "text-stone-700",
    icon: "✍️",
    darkText: "text-stone-300",
    accent: "#2563eb",
    pastel: "#dbeafe"
  },
  "ÖABT İlköğretim Matematik": {
    text: "text-stone-700",
    icon: "➗",
    darkText: "text-stone-300",
    accent: "#0d9488",
    pastel: "#ccfbf1"
  },
  "ÖABT Matematik": {
    text: "text-stone-700",
    icon: "📐",
    darkText: "text-stone-300",
    accent: "#115e59",
    pastel: "#ccfbf1"
  },
  "ÖABT Fen Bilimleri": {
    text: "text-stone-700",
    icon: "🔬",
    darkText: "text-stone-300",
    accent: "#0369a1",
    pastel: "#e0f2fe"
  },
  "ÖABT Fizik": {
    text: "text-stone-700",
    icon: "⚛️",
    darkText: "text-stone-300",
    accent: "#4338ca",
    pastel: "#e0e7ff"
  },
  "ÖABT Kimya": {
    text: "text-stone-700",
    icon: "🧪",
    darkText: "text-stone-300",
    accent: "#b91c1c",
    pastel: "#fee2e2"
  },
  "ÖABT Biyoloji": {
    text: "text-stone-700",
    icon: "🧬",
    darkText: "text-stone-300",
    accent: "#15803d",
    pastel: "#dcfce7"
  },
  "ÖABT Sosyal Bilgiler": {
    text: "text-stone-700",
    icon: "🌍",
    darkText: "text-stone-300",
    accent: "#c2410c",
    pastel: "#ffedd5"
  },
  "ÖABT Türk Dili ve Edebiyatı": {
    text: "text-stone-700",
    icon: "📖",
    darkText: "text-stone-300",
    accent: "#7c3aed",
    pastel: "#ede9fe"
  },
  "ÖABT Tarih": {
    text: "text-stone-700",
    icon: "🏛️",
    darkText: "text-stone-300",
    accent: "#a16207",
    pastel: "#fef3c7"
  },
  "ÖABT Coğrafya": {
    text: "text-stone-700",
    icon: "🧭",
    darkText: "text-stone-300",
    accent: "#047857",
    pastel: "#d1fae5"
  },
  "ÖABT DKAB / İHL": {
    text: "text-stone-700",
    icon: "🕌",
    darkText: "text-stone-300",
    accent: "#0f766e",
    pastel: "#ccfbf1"
  },
  "ÖABT Rehberlik": {
    text: "text-stone-700",
    icon: "💚",
    darkText: "text-stone-300",
    accent: "#047857",
    pastel: "#d1fae5"
  },
  "ÖABT Beden Eğitimi": {
    text: "text-stone-700",
    icon: "🏃",
    darkText: "text-stone-300",
    accent: "#ea580c",
    pastel: "#ffedd5"
  },
  "ÖABT Sınıf Öğretmenliği": {
    text: "text-stone-700",
    icon: "🏫",
    darkText: "text-stone-300",
    accent: "#db2777",
    pastel: "#fce7f3"
  },
  "ÖABT Okul Öncesi": {
    text: "text-stone-700",
    icon: "🧸",
    darkText: "text-stone-300",
    accent: "#d97706",
    pastel: "#fef3c7"
  },
  "ÖABT Özel Eğitim": {
    text: "text-stone-700",
    icon: "🤝",
    darkText: "text-stone-300",
    accent: "#7c3aed",
    pastel: "#ede9fe"
  }
};
function stripChoicePrefix(opt) {
  return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
}

// Konu adını ekranda yazım düzeltilmiş göster (anahtar değişmez; bkz. data.js KONU_LABELS).
function kLabel(k) {
  return typeof window !== "undefined" && window.konuLabel ? window.konuLabel(k) : k;
}
function SoruGorsel(soru) {
  if (!soru) return null;
  var list = soru.imgs || (soru.img ? Array.isArray(soru.img) ? soru.img : [soru.img] : []);
  if (!list.length) return null;
  return /*#__PURE__*/React.createElement("div", null, list.map(function (src, i) {
    return /*#__PURE__*/React.createElement("img", {
      key: src + i,
      src: src,
      alt: soru.imgAlt || "Soru görseli",
      className: "mt-4 w-full h-auto rounded-2xl object-contain bg-[#F6F1E4] border border-stone-200 dark:border-stone-700"
    });
  }));
}
function themeFor(ders, isDark) {
  const t = DERS_THEME[ders] || {
    text: "text-stone-700",
    icon: "📚",
    darkText: "text-stone-300"
  };
  return isDark ? Object.assign({}, t, {
    text: t.darkText
  }) : t;
}
function masteryLabel(m) {
  if (m === "iyi") return {
    text: "İyi",
    cls: "bg-emerald-50 text-emerald-600"
  };
  if (m === "orta") return {
    text: "Orta",
    cls: "bg-amber-50 text-amber-600"
  };
  if (m === "zayif") return {
    text: "Zayıf",
    cls: "bg-coral-50 text-coral-600"
  };
  return {
    text: "Yeni",
    cls: "bg-stone-100 text-stone-500"
  };
}
function BrandLoad(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "brand-backdrop min-h-screen flex items-center justify-center relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand-glow",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "brand-ring brand-ring-outer",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "brand-ring brand-ring-inner",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("p", {
    className: "relative z-10 text-sm font-medium",
    style: {
      color: "rgba(245,235,199,0.85)"
    }
  }, props.children || "Yükleniyor"));
}
function useStudent() {
  const [st, setSt] = useState(function () {
    return StudentStore.getState();
  });
  useEffect(function () {
    return StudentStore.subscribe(function (s) {
      setSt(s);
    });
  }, []);
  return st;
}
function CookieBar() {
  var student = useStudent();
  var seen = student.consent && student.consent.bannerSeen;
  if (seen) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "cookie-bar fixed left-3 right-3 z-[60] rounded-2xl bg-stone-900 text-stone-100 p-4 shadow-2xl text-sm",
    style: {
      bottom: "calc(var(--app-tabbar-h) + 12px)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs leading-relaxed mb-3"
  }, "Giri\u015F ve ilerleme i\xE7in zorunlu \xE7erez / yerel depolama kullan\u0131l\u0131r. Reklam a\u011F\u0131 yok.", " ", /*#__PURE__*/React.createElement("a", {
    className: "underline text-teal-300",
    href: "yasal/cerez.html"
  }, "\xC7erez politikas\u0131"), " · ", /*#__PURE__*/React.createElement("a", {
    className: "underline text-teal-300",
    href: "yasal/aydinlatma.html"
  }, "KVKK")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "w-full py-2 rounded-xl bg-white text-stone-900 text-xs font-bold",
    onClick: function () {
      StudentStore.setConsent({
        bannerSeen: true,
        marketing: false,
        analytics: false
      });
    }
  }, "Tamam"));
}

// Klavye kısayolları yazı yazılan alanda tetiklenmesin.
function isTypingTarget(el) {
  if (!el) return false;
  var tag = el.tagName || "";
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || !!el.isContentEditable;
}
function Shell(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "app-page pt-6 sm:pt-10 overflow-x-hidden"
  }, props.children, props.padBottom === false ? null : /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      height: "calc(var(--app-tabbar-h) + 1.5rem)"
    }
  }));
}
function ThemeBtn(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: props.onClick,
    className: "p-2.5 rounded-2xl glass transition-all duration-200 hover:scale-105",
    "aria-label": "Tema"
  }, props.isDark ? /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-amber-400",
    fill: "currentColor",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z",
    clipRule: "evenodd"
  })) : /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-stone-600",
    fill: "currentColor",
    viewBox: "0 0 20 20"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
  })));
}
function BackBtn(props) {
  var C = window.KpssBackBtn;
  if (!C) return null;
  return /*#__PURE__*/React.createElement(C, {
    onClick: props.onClick,
    label: props.label
  });
}
function Confetti() {
  const [pieces, setPieces] = useState([]);
  useEffect(function () {
    const colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981"];
    setPieces(Array.from({
      length: 24
    }, function (_, i) {
      return {
        id: i,
        left: Math.random() * 100 + "%",
        delay: Math.random() * 2 + "s",
        duration: Math.random() * 2 + 2 + "s",
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6 + "px"
      };
    }));
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 pointer-events-none z-50 overflow-hidden"
  }, pieces.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "confetti",
      style: {
        left: p.left,
        animationDelay: p.delay,
        animationDuration: p.duration,
        width: p.size,
        height: p.size,
        backgroundColor: p.color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px"
      }
    });
  }));
}
function BottomNav(props) {
  const tabs = [{
    id: "bugun",
    label: "Bugün",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  }, {
    id: "dersler",
    label: "Dersler",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  }, {
    id: "alistirmalar",
    label: "Alıştırmalar",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
  }, {
    id: "eksikler",
    label: "Eksikler",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  }, {
    id: "ben",
    label: "Ben",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  }];
  return /*#__PURE__*/React.createElement("nav", {
    className: "app-tabbar fixed bottom-0 inset-x-0 z-40 nav-glass",
    "aria-label": "Ana men\xFC",
    style: {
      paddingBottom: "max(8px, env(safe-area-inset-bottom))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabbar-brand",
    "aria-hidden": "true"
  }, window.AtanomLogo ? window.AtanomLogo("h-9 w-9 object-contain") : null, /*#__PURE__*/React.createElement("span", null, "Atanly")), /*#__PURE__*/React.createElement("div", {
    className: "tabbar-list app-page grid grid-cols-5 pt-1 min-w-0"
  }, tabs.map(function (tab) {
    const on = props.nav === tab.id;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      type: "button",
      onClick: function () {
        props.onChange(tab.id);
      },
      "aria-current": on ? "page" : undefined,
      className: "relative flex flex-col items-center gap-0.5 py-2 rounded-2xl text-[10px] leading-tight font-medium transition-all duration-200 " + (on ? "text-indigo-600 bg-indigo-50/60 dark:bg-indigo-900/20" : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200")
    }, /*#__PURE__*/React.createElement("span", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-5 h-5",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      strokeWidth: on ? 2.2 : 1.7
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: tab.icon
    })), tab.id === "bugun" && props.streak > 0 ? /*#__PURE__*/React.createElement("span", {
      className: "absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
    }), /*#__PURE__*/React.createElement("span", {
      className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"
    })) : null), /*#__PURE__*/React.createElement("span", {
      className: "label"
    }, tab.label));
  })), /*#__PURE__*/React.createElement("div", {
    className: "tabbar-keys kbd-hint",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", null, "A"), "\u2013", /*#__PURE__*/React.createElement("kbd", null, "E"), " \u015F\u0131k se\xE7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", null, "Enter"), " sonraki soru"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", null, "\u2190"), /*#__PURE__*/React.createElement("kbd", null, "\u2192"), " not \xE7evir")));
}
function Onboarding(props) {
  var profile = props.student && props.student.profile || {};
  var up = props.student && props.student.userProfile || {};
  var dates = window.KpssConfig && window.KpssConfig.examDateByLevel || {};
  const [name, setName] = useState(profile.name || "");
  const [level, setLevel] = useState(up.educationLevel || "lisans");
  const [target, setTarget] = useState(up.targetType || "B");
  const [examDate, setExamDate] = useState(profile.examDate || dates[up.educationLevel || "lisans"] || "2026-09-06");
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl fade-in"
  }, window.AtanomLogo ? window.AtanomLogo("h-16 w-16 mx-auto mb-3 object-contain") : /*#__PURE__*/React.createElement("img", {
    src: "icons/atanom.png?v=18",
    alt: "Atanly",
    className: "h-16 w-16 mx-auto mb-3 object-contain"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-black text-stone-900 dark:text-white mb-1 text-center"
  }, "Atanly"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mb-5 text-center"
  }, "Google ile giri\u015F yapt\u0131n. Ad\u0131n ve e\u011Fitim d\xFCzeyin uygulamay\u0131 a\xE7mak i\xE7in gerekli."), /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-stone-500 mb-1"
  }, "Ad\u0131n"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: function (e) {
      setName(e.target.value);
    },
    placeholder: "Ad\u0131n\u0131 yaz",
    className: "w-full mb-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-stone-500 mb-2"
  }, "E\u011Fitim d\xFCzeyi"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mb-4"
  }, [{
    id: "lisans",
    t: "Lisans"
  }, {
    id: "onlisans",
    t: "Ön lisans"
  }, {
    id: "ortaogretim",
    t: "Ortaöğretim"
  }].map(function (x) {
    var on = level === x.id;
    return /*#__PURE__*/React.createElement("button", {
      key: x.id,
      type: "button",
      onClick: function () {
        setLevel(x.id);
        if (dates[x.id]) setExamDate(dates[x.id]);
      },
      className: "px-2 py-2 rounded-xl border-2 text-xs font-semibold " + (on ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-stone-200")
    }, x.t);
  })), level === "lisans" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-stone-500 mb-2"
  }, "Kulvar"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mb-4"
  }, [{
    id: "B",
    t: "B Grubu"
  }, {
    id: "A",
    t: "A Grubu"
  }, {
    id: "ogretmen",
    t: "Öğretmenlik"
  }, {
    id: "dhbt",
    t: "DHBT"
  }].map(function (x) {
    var on = target === x.id;
    return /*#__PURE__*/React.createElement("button", {
      key: x.id,
      type: "button",
      onClick: function () {
        setTarget(x.id);
      },
      className: "px-3 py-2 rounded-xl border-2 text-xs font-semibold " + (on ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-stone-200")
    }, x.t);
  }))) : null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-stone-500 mb-1"
  }, "S\u0131nav tarihi"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: examDate,
    onChange: function (e) {
      setExamDate(e.target.value);
    },
    className: "w-full mb-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-stone-500 leading-relaxed mb-5"
  }, "Ba\u015Fla diyerek ", /*#__PURE__*/React.createElement("a", {
    className: "underline font-semibold",
    href: "yasal/kullanim.html",
    target: "_blank",
    rel: "noopener"
  }, "Kullan\u0131m Ko\u015Fullar\u0131"), " ve ", /*#__PURE__*/React.createElement("a", {
    className: "underline font-semibold",
    href: "yasal/uyelik.html",
    target: "_blank",
    rel: "noopener"
  }, "\xDCyelik S\xF6zle\u015Fmesi"), "'ni kabul etmiş olursunuz. ", /*#__PURE__*/React.createElement("a", {
    className: "underline",
    href: "yasal/aydinlatma.html",
    target: "_blank",
    rel: "noopener"
  }, "KVKK Ayd\u0131nlatma")), /*#__PURE__*/React.createElement("button", {
    disabled: !name.trim(),
    onClick: function () {
      StudentStore.completeOnboarding({
        name: name.trim(),
        nickname: name.trim(),
        examDate: examDate,
        dailyMinutes: 45,
        dailyQuestions: 25,
        educationLevel: level,
        targetType: level === "lisans" ? target : "B",
        kvkkConsent: true,
        weeklyHours: 7
      });
      if (window.SyncEngine) window.SyncEngine.sync();
    },
    className: "w-full btn-primary text-white font-bold py-4 rounded-2xl disabled:opacity-40"
  }, "Ba\u015Fla")));
}
function examTrackName(level) {
  if (level === "onlisans") return "Ön lisans KPSS";
  if (level === "ortaogretim") return "Ortaöğretim KPSS";
  return "Lisans KPSS";
}
function hourOptions() {
  return [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6];
}
function formatHours(n) {
  var x = Number(n) || 0;
  if (x === 1) return "1 saat";
  if (x === 0.5) return "30 dk";
  if (x % 1 === 0.5) return Math.floor(x) + ",5 saat";
  return x + " saat";
}
function formatSlotLine(slots, catalog) {
  var parts = [];
  (slots || []).forEach(function (s) {
    if (catalog && !catalog[s.ders]) return;
    parts.push(formatHours(s.hours) + " " + s.ders);
  });
  return parts.join(" · ");
}
function dersAccent(ders) {
  var t = DERS_THEME[ders];
  return t || {
    icon: "📚",
    accent: "#127880",
    pastel: "#e7f6f4"
  };
}
function restDayCopy() {
  var msgs = ["Bugün dinlenme günü ☕ Zihnini şarj et, yarın maratona devam!", "Mola da programın parçası. Bugün toparlan, yarın daha keskin olursun.", "Serbest gün. Kısa yürüyüş, su, erken uyku — yarın bloklara tam güç."];
  var i = new Date().getDate() % msgs.length;
  return msgs[i];
}

// ---------- Akıllı KPSS programı (motor: js/smartPlan.js) ----------

var PLAN_ICON = {
  not: "📖",
  test: "🎯",
  tekrar: "🔁",
  zayif: "🩹",
  genel: "🧭",
  deneme: "📝"
};
function planSettingsOf(student) {
  return student.userProfile && student.userProfile.smartPlan || null;
}
function savePlanSettings(next) {
  StudentStore.updateUserProfile({
    smartPlan: next
  });
}
function planTaskLabel(x) {
  var SP = window.SmartPlan;
  var t = SP.taskTitle(x);
  if (x.kind === "deneme") return t;
  return t + " · " + x.ders + (x.konu ? " / " + kLabel(x.konu) : "");
}

// Görevi başlat: ilgili not / konu / deneme ekranını aç.
function runPlanTask(x, props) {
  if (x.kind === "not") props.onKonu(x.ders, x.konu, "notes");else if (x.kind === "test" || x.kind === "tekrar" || x.kind === "zayif") props.onKonu(x.ders, x.konu, "hub");else if (x.kind === "genel") props.onDers(x.ders);else if (x.kind === "deneme" && props.onExam) props.onExam();
}
function PlanTaskRow(props) {
  var x = props.item;
  var SP = window.SmartPlan;
  return /*#__PURE__*/React.createElement("li", {
    className: "plan-row" + (x.done ? " is-done" : "")
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "plan-check",
    "aria-pressed": !!x.done,
    "aria-label": (x.done ? "Tamamlandı işaretini kaldır: " : "Tamamlandı olarak işaretle: ") + planTaskLabel(x),
    onClick: function () {
      props.onToggle(x);
    }
  }, x.done ? "✓" : ""), /*#__PURE__*/React.createElement("span", {
    className: "plan-row-ico",
    "aria-hidden": "true"
  }, PLAN_ICON[x.kind] || "•"), /*#__PURE__*/React.createElement("span", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block text-sm font-semibold leading-snug"
  }, planTaskLabel(x)), /*#__PURE__*/React.createElement("span", {
    className: "block text-xs text-stone-500"
  }, SP.fmtMin(x.minutes), x.part ? " · parça" : "", x.kind === "zayif" && x.pct != null ? " · son net %" + x.pct : "")), !x.done && props.onStart ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "plan-start",
    onClick: function () {
      props.onStart(x);
    }
  }, "Ba\u015Fla") : null);
}
function PlanPhaseBar(props) {
  var plan = props.plan;
  var SP = window.SmartPlan;
  var total = plan.days.length || 1;
  var seg = {
    ogrenme: 0,
    pekistirme: 0,
    son: 0
  };
  plan.days.forEach(function (d) {
    seg[d.phase] += 1;
  });
  var startOf = {};
  plan.days.forEach(function (d) {
    if (!startOf[d.phase]) startOf[d.phase] = d.date;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "plan-phases",
    role: "img",
    "aria-label": "D\xF6nemler"
  }, ["ogrenme", "pekistirme", "son"].map(function (k) {
    if (!seg[k]) return null;
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        width: seg[k] / total * 100 + "%",
        background: SP.PHASES[k].color
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-stone-500"
  }, ["ogrenme", "pekistirme", "son"].map(function (k) {
    if (!seg[k]) return null;
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "h-2.5 w-2.5 rounded-full",
      style: {
        background: SP.PHASES[k].color
      }
    }), SP.PHASES[k].label, " \xB7 ", SP.fmtDate(startOf[k]), "\u2019ten ", seg[k], " g\xFCn");
  })));
}
function SmartPlanCard(props) {
  var SP = window.SmartPlan;
  var settings = planSettingsOf(props.student);
  var plan = useMemo(function () {
    if (!SP || !settings) return null;
    return SP.generate(props.kpssData, props.student, settings);
  }, [props.kpssData, props.student, settings]);
  const [missed, setMissed] = useState(0);

  // dün planlanıp yapılmayanlar: bir kez göster, sonra bugünün listesini "görüldü" olarak kaydet
  useEffect(function () {
    if (!SP || !plan || !plan.ok) return;
    var m = SP.missedSince(settings, plan);
    if (m.changed) {
      if (m.missed) setMissed(m.missed);
      savePlanSettings(Object.assign({}, settings, {
        seen: m.seen
      }));
    }
  }, [plan && plan.today, plan && plan.ok]);
  if (!SP) return null;
  if (!settings) {
    return /*#__PURE__*/React.createElement("section", {
      className: "plan-hero rounded-3xl p-6 mb-4 slide-up"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider opacity-80"
    }, "Ak\u0131ll\u0131 KPSS program\u0131"), /*#__PURE__*/React.createElement("h2", {
      className: "text-xl sm:text-2xl font-black mt-1 leading-snug"
    }, "S\u0131nav\u0131na kadar her g\xFCn hangi konuyu \xE7al\u0131\u015Faca\u011F\u0131n\u0131 1 dakikada \xE7\u0131kar."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm opacity-85 mt-2 max-w-2xl"
    }, "S\u0131nav tarihin, bo\u015F saatlerin ve zay\u0131f derslerine g\xF6re konu konu takvim. Bir g\xFCn ka\xE7\u0131r\u0131rsan program kendini yeniden da\u011F\u0131t\u0131r."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: props.onWizard,
      className: "plan-hero-btn mt-4"
    }, "Program\u0131m\u0131 olu\u015Ftur"));
  }
  if (!plan || !plan.ok) {
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-3xl glass p-5 mb-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-stone-400"
    }, "Ak\u0131ll\u0131 KPSS program\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "font-semibold mt-1"
    }, plan ? plan.reason : "Program hesaplanamadı."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip is-primary mt-3",
      onClick: props.onWizard
    }, "Program\u0131 g\xFCncelle"));
  }
  var list = SP.todayList(plan, settings);
  var doneMin = 0,
    allMin = 0;
  list.forEach(function (x) {
    allMin += x.minutes;
    if (x.done) doneMin += x.minutes;
  });
  var phase = plan.days[0] ? plan.days[0].phase : "ogrenme";
  function toggle(x) {
    var cur = planSettingsOf(StudentStore.getState()) || settings;
    savePlanSettings(x.done ? SP.unmarkDone(cur, x) : SP.markDone(cur, x));
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "rounded-3xl glass p-5 sm:p-6 mb-4 slide-up",
    "aria-labelledby": "plan-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-start justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider",
    style: {
      color: SP.PHASES[phase].color
    }
  }, SP.PHASES[phase].label, " d\xF6nemi \xB7 s\u0131nava ", plan.daysLeft, " g\xFCn"), /*#__PURE__*/React.createElement("h2", {
    id: "plan-title",
    className: "text-lg font-bold mt-0.5"
  }, "Bug\xFCnk\xFC program\u0131n")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: props.onCalendar
  }, "\uD83D\uDCC5 Takvim"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: props.onWizard
  }, "D\xFCzenle"))), missed ? /*#__PURE__*/React.createElement("p", {
    className: "plan-note mt-3",
    role: "status"
  }, "D\xFCnden kalan ", missed, " g\xF6rev programa yeniden da\u011F\u0131t\u0131ld\u0131. S\u0131k\u0131nt\u0131 yok, devam.") : null, !plan.fits ? /*#__PURE__*/React.createElement("p", {
    className: "plan-warn mt-3"
  }, "Bu tempoyla konular s\u0131navdan \xF6nce bitmiyor (", SP.fmtMin(plan.behindMin), " eksik). ", plan.needWeekMin ? "Haftada " + SP.fmtMin(plan.needWeekMin) + " ayırabilirsen yetişir." : "Haftaya çalışma günü eklemen gerekiyor.") : null, list.length ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs text-stone-500 mt-4 mb-1.5"
  }, /*#__PURE__*/React.createElement("span", null, SP.fmtMin(doneMin), " / ", SP.fmtMin(allMin), " tamam"), /*#__PURE__*/React.createElement("span", null, list.filter(function (x) {
    return x.done;
  }).length, "/", list.length, " g\xF6rev")), /*#__PURE__*/React.createElement("div", {
    className: "h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500",
    style: {
      width: (allMin ? doneMin / allMin * 100 : 0) + "%",
      transition: "width .3s"
    }
  })), /*#__PURE__*/React.createElement("ul", {
    className: "mt-3 space-y-2"
  }, list.map(function (x, i) {
    return /*#__PURE__*/React.createElement(PlanTaskRow, {
      key: x.id + (x.done ? "-d" : "") + i,
      item: x,
      onToggle: toggle,
      onStart: function (t) {
        runPlanTask(t, props);
      }
    });
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mt-3"
  }, "Bug\xFCn programda dinlenme g\xFCn\xFC. Yar\u0131n ", plan.days[1] && plan.days[1].items.length ? plan.days[1].items.length + " görev" : "da boş", "."));
}
function PlanWizard(props) {
  var SP = window.SmartPlan;
  var dersler = Object.keys(props.kpssData || {});
  var cur = planSettingsOf(props.student);
  const [step, setStep] = useState(0);
  const [s, setS] = useState(function () {
    var base = cur ? SP.normSettings(cur) : SP.defaultSettings(props.student);
    // eski haftalık programdan saatleri al
    var old = props.student.userProfile && props.student.userProfile.studyPlan;
    if (!cur && old && old.ready && old.days) {
      var ids = ["pzt", "sal", "car", "per", "cum", "cmt", "paz"];
      base.hours = ids.map(function (id) {
        var d = old.days[id];
        return d && d.on ? StudentStore.daySlotHours ? StudentStore.daySlotHours(d) : 0 : 0;
      });
    }
    return base;
  });
  var preview = useMemo(function () {
    return step === 3 ? SP.generate(props.kpssData, props.student, s) : null;
  }, [step, s]);
  var weekH = s.hours.reduce(function (a, h) {
    return a + h;
  }, 0);
  function setHour(i, v) {
    var h = s.hours.slice();
    h[i] = Math.max(0, Math.min(12, Math.round(v * 2) / 2));
    setS(Object.assign({}, s, {
      hours: h
    }));
  }
  function preset(arr) {
    setS(Object.assign({}, s, {
      hours: arr
    }));
  }
  function toggleWeak(d) {
    var w = s.weak.indexOf(d) >= 0 ? s.weak.filter(function (x) {
      return x !== d;
    }) : s.weak.concat([d]);
    setS(Object.assign({}, s, {
      weak: w
    }));
  }
  function save() {
    var next = Object.assign({}, s, {
      createdAt: cur && cur.createdAt || new Date().toISOString(),
      seen: null
    });
    StudentStore.updateUserProfile({
      smartPlan: next,
      studyPlan: SP.legacyStudyPlan(next)
    });
    if (s.examDate) StudentStore.updateProfile({
      examDate: s.examDate
    });
    props.onDone();
  }
  var canNext = step === 0 ? s.examDate && s.examDate > SP.todayIso() : step === 1 ? weekH > 0 : true;
  var steps = ["Sınav tarihi", "Boş saatler", "Zayıf dersler", "Önizleme"];
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "wiz-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 shadow-2xl fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300"
  }, "Ad\u0131m ", step + 1, " / 4 \xB7 ", steps[step]), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "text-sm text-stone-500 px-2 py-1",
    onClick: props.onClose,
    "aria-label": "Kapat"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 mt-2 mb-5",
    "aria-hidden": "true"
  }, steps.map(function (_t, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "h-1.5 flex-1 rounded-full " + (i <= step ? "bg-teal-600" : "bg-stone-200 dark:bg-stone-700")
    });
  })), step === 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    id: "wiz-title",
    className: "text-xl font-black"
  }, "S\u0131nav\u0131n ne zaman?"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mt-1"
  }, "\xD6SYM takvimindeki s\u0131nav g\xFCn\xFCn\xFC se\xE7. Program bu g\xFCne kadar g\xFCn g\xFCn haz\u0131rlan\u0131r."), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: s.examDate,
    min: SP.addDays(SP.todayIso(), 7),
    onChange: function (e) {
      setS(Object.assign({}, s, {
        examDate: e.target.value
      }));
    },
    className: "w-full mt-4 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-base"
  }), s.examDate && s.examDate > SP.todayIso() ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold text-teal-700 dark:text-teal-300 mt-3"
  }, "S\u0131nava ", SP.diffDays(SP.todayIso(), s.examDate), " g\xFCn var.") : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 mt-3"
  }, "Tarih hen\xFCz a\xE7\u0131klanmad\u0131ysa tahmini bir tarih se\xE7; sonra de\u011Fi\u015Ftirebilirsin.")) : null, step === 1 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    id: "wiz-title",
    className: "text-xl font-black"
  }, "Hangi g\xFCn ka\xE7 saat \xE7al\u0131\u015Fabilirsin?"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mt-1"
  }, "Ger\xE7ek\xE7i ol: program s\xFCrd\xFCr\xFClebilir olursa i\u015Fe yarar. Haftal\u0131k toplam: ", /*#__PURE__*/React.createElement("b", null, weekH, " saat")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      preset([1, 1, 1, 1, 1, 2, 0]);
    }
  }, "Hafif (7 sa)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      preset([2, 2, 2, 2, 2, 4, 0]);
    }
  }, "Dengeli (14 sa)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      preset([3, 3, 3, 3, 3, 5, 3]);
    }
  }, "Yo\u011Fun (23 sa)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      preset([0, 0, 0, 0, 0, 5, 5]);
    }
  }, "Hafta sonu (10 sa)")), /*#__PURE__*/React.createElement("ul", {
    className: "mt-4 space-y-2"
  }, SP.DAY_FULL.map(function (d, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: d,
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-24 text-sm font-semibold"
    }, d), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "step-btn",
      "aria-label": d + " yarım saat azalt",
      onClick: function () {
        setHour(i, s.hours[i] - 0.5);
      }
    }, "\u2212"), /*#__PURE__*/React.createElement("span", {
      className: "w-16 text-center font-stat font-bold",
      "aria-live": "polite"
    }, s.hours[i] ? s.hours[i] + " sa" : "boş"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "step-btn",
      "aria-label": d + " yarım saat artır",
      onClick: function () {
        setHour(i, s.hours[i] + 0.5);
      }
    }, "+"));
  }))) : null, step === 2 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    id: "wiz-title",
    className: "text-xl font-black"
  }, "Hangi derslerde zorlan\u0131yorsun?"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mt-1"
  }, "Se\xE7ti\u011Fin derslere daha \xE7ok zaman ayr\u0131l\u0131r. Hi\xE7birini se\xE7meden de ge\xE7ebilirsin; da\u011F\u0131l\u0131m \xD6SYM soru say\u0131lar\u0131na g\xF6re yap\u0131l\u0131r."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-4"
  }, dersler.map(function (d) {
    var on = s.weak.indexOf(d) >= 0;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      type: "button",
      "aria-pressed": on,
      className: "quick-chip" + (on ? " is-primary" : ""),
      onClick: function () {
        toggleWeak(d);
      }
    }, on ? "✓ " : "", d);
  }))) : null, step === 3 && preview ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    id: "wiz-title",
    className: "text-xl font-black"
  }, "Program\u0131n haz\u0131r"), preview.ok ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mt-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl bg-stone-100 dark:bg-stone-800 p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-stat text-xl font-bold"
  }, preview.daysLeft), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-stone-500"
  }, "g\xFCn")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl bg-stone-100 dark:bg-stone-800 p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-stat text-xl font-bold"
  }, SP.fmtMin(preview.weekMin)), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-stone-500"
  }, "haftada")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl bg-stone-100 dark:bg-stone-800 p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-stat text-xl font-bold"
  }, SP.fmtMin(preview.learnTotal)), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-stone-500"
  }, "konu \xE7al\u0131\u015Fmas\u0131"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(PlanPhaseBar, {
    plan: preview
  })), preview.fits ? /*#__PURE__*/React.createElement("p", {
    className: "plan-ok mt-4"
  }, "Yeti\u015Fiyor: konular ", SP.fmtDate(preview.learnDoneOn || preview.finalStart), " civar\u0131 biter, sonras\u0131 tekrar ve deneme.") : /*#__PURE__*/React.createElement("p", {
    className: "plan-warn mt-4"
  }, "Bu saatlerle konular son d\xF6neme kadar bitmiyor (", SP.fmtMin(preview.behindMin), " eksik). ", preview.needWeekMin ? "Haftada en az " + SP.fmtMin(preview.needWeekMin) + " öneririz" : "Haftaya çalışma günü eklemeni öneririz", "; yine de kaydedebilirsin."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mt-5 mb-2"
  }, "\u0130lk g\xFCn"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-1.5"
  }, (preview.days.find(function (d) {
    return d.items.length;
  }) || {
    items: []
  }).items.map(function (x, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      className: "text-sm flex gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true"
    }, PLAN_ICON[x.kind]), /*#__PURE__*/React.createElement("span", {
      className: "min-w-0"
    }, planTaskLabel(x), " ", /*#__PURE__*/React.createElement("span", {
      className: "text-stone-500"
    }, "\xB7 ", SP.fmtMin(x.minutes))));
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "plan-warn mt-4"
  }, preview.reason)) : null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between gap-3 mt-7"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      if (step) setStep(step - 1);else props.onClose();
    }
  }, step ? "← Geri" : "Vazgeç"), step < 3 ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip is-primary",
    disabled: !canNext,
    onClick: function () {
      setStep(step + 1);
    }
  }, "Devam \u2192") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip is-primary",
    disabled: !preview || !preview.ok,
    onClick: save
  }, "Program\u0131 kaydet"))));
}
var DASH_COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

// Paylaşım görseli (1080x1350): bu haftanın programı ve dönemler.
function drawPlanImage(plan, name) {
  var SP = window.SmartPlan;
  var W = 1080,
    H = 1350;
  var c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  var g = c.getContext("2d");
  var bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0D2C4D");
  bg.addColorStop(1, "#14607a");
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  function text(t, x, y, size, weight, color, align) {
    g.font = (weight || 700) + " " + size + "px Inter, Manrope, system-ui, sans-serif";
    g.fillStyle = color || "#fff";
    g.textAlign = align || "left";
    g.fillText(t, x, y);
  }
  function fit(t, max, size, weight) {
    g.font = (weight || 600) + " " + size + "px Inter, system-ui, sans-serif";
    if (g.measureText(t).width <= max) return t;
    while (t.length > 4 && g.measureText(t + "…").width > max) t = t.slice(0, -1);
    return t + "…";
  }
  text("KPSS PROGRAMIM", 72, 120, 30, 800, "#5eead4");
  text(name ? name : "Akıllı çalışma takvimi", 72, 186, 58, 900);
  text("Sınava " + plan.daysLeft + " gün · haftada " + SP.fmtMin(plan.weekMin), 72, 246, 34, 600, "rgba(255,255,255,.85)");
  // dönem çubuğu
  var seg = {
      ogrenme: 0,
      pekistirme: 0,
      son: 0
    },
    total = plan.days.length || 1,
    x = 72;
  plan.days.forEach(function (d) {
    seg[d.phase]++;
  });
  ["ogrenme", "pekistirme", "son"].forEach(function (k) {
    var w = (W - 144) * seg[k] / total;
    if (w > 0) {
      g.fillStyle = SP.PHASES[k].color;
      g.fillRect(x, 292, w, 22);
      x += w;
    }
  });
  var lx = 72;
  var shortLabel = {
    ogrenme: "Öğrenme",
    pekistirme: "Pekiştirme",
    son: "Son dönem"
  };
  ["ogrenme", "pekistirme", "son"].forEach(function (k) {
    if (!seg[k]) return;
    var lbl = shortLabel[k] + " " + seg[k] + " gün";
    g.fillStyle = SP.PHASES[k].color;
    g.beginPath();
    g.arc(lx + 9, 352, 9, 0, Math.PI * 2);
    g.fill();
    text(lbl, lx + 26, 362, 26, 600, "rgba(255,255,255,.85)");
    g.font = "600 26px Inter, Manrope, system-ui, sans-serif";
    lx += 26 + g.measureText(lbl).width + 34;
  });
  // haftalık kart
  g.fillStyle = "rgba(255,255,255,.96)";
  var top = 410,
    bh = 800;
  g.beginPath();
  if (g.roundRect) g.roundRect(48, top, W - 96, bh, 36);else g.rect(48, top, W - 96, bh);
  g.fill();
  text("Bu hafta", 96, top + 76, 36, 800, "#0D2C4D");
  var rowH = (bh - 120) / 7;
  plan.days.slice(0, 7).forEach(function (d, i) {
    var y = top + 120 + i * rowH;
    if (i) {
      g.fillStyle = "#e7e5e4";
      g.fillRect(96, y - 8, W - 192, 2);
    }
    text(SP.DAY_SHORT[d.weekday] + " " + SP.fmtDate(d.date), 96, y + 40, 28, 800, "#0f172a");
    var items = d.items.slice(0, 2).map(function (it) {
      return SP.taskTitle(it) + (it.ders ? " · " + it.ders : "");
    });
    if (!items.length) items = ["Dinlenme"];
    items.forEach(function (t, j) {
      text(fit(t, 600, 25, 600), 340, y + 28 + j * 34, 25, 600, j ? "#57534e" : "#0f766e");
    });
    if (d.items.length) text(SP.fmtMin(d.minutes), W - 96, y + 40, 26, 700, "#78716c", "right");
  });
  text("atanly.com · Kendi programını 1 dakikada oluştur", W / 2, H - 56, 30, 700, "rgba(255,255,255,.9)", "center");
  return c;
}
function PlanCalendar(props) {
  var SP = window.SmartPlan;
  var settings = planSettingsOf(props.student);
  var plan = useMemo(function () {
    return settings ? SP.generate(props.kpssData, props.student, settings) : null;
  }, [props.kpssData, props.student, settings]);
  const [weeks, setWeeks] = useState(4);
  const [msg, setMsg] = useState("");
  if (!plan || !plan.ok) {
    return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Bug\xFCn"
    }), /*#__PURE__*/React.createElement("p", {
      className: "mt-8 text-stone-500"
    }, plan ? plan.reason : "Önce programını oluştur."));
  }
  // günleri haftalara böl (Pazartesi başlangıçlı)
  var groups = [];
  plan.days.forEach(function (d) {
    if (!groups.length || d.weekday === 0) groups.push([]);
    groups[groups.length - 1].push(d);
  });
  var shown = groups.slice(0, weeks);
  var doneIds = {};
  SP.doneOn(settings, plan.today).forEach(function (x) {
    doneIds[x.id] = true;
  });
  function print() {
    setWeeks(groups.length);
    setTimeout(function () {
      window.print();
    }, 350);
  }
  function shareImage() {
    var c = drawPlanImage(plan, props.student.profile && props.student.profile.name);
    c.toBlob(function (blob) {
      if (!blob) return;
      var file = typeof File !== "undefined" ? new File([blob], "kpss-programim.png", {
        type: "image/png"
      }) : null;
      if (file && navigator.canShare && navigator.canShare({
        files: [file]
      })) {
        navigator.share({
          files: [file],
          title: "KPSS programım",
          text: "Kendi programını oluştur: https://www.atanly.com"
        }).catch(function () {});
        return;
      }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "kpss-programim.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 4000);
      setMsg("Görsel indirildi: kpss-programim.png");
    }, "image/png");
  }
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4 gap-3 no-print"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Bug\xFCn"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("header", {
    className: "mb-5"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-display font-black tracking-tight gradient-text"
  }, "KPSS program\u0131m"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mt-1"
  }, props.student.profile && props.student.profile.name ? props.student.profile.name + " · " : "", "S\u0131nav ", SP.fmtDate(plan.exam), " \xB7 ", plan.daysLeft, " g\xFCn \xB7 haftada ", SP.fmtMin(plan.weekMin)), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(PlanPhaseBar, {
    plan: plan
  })), !plan.fits ? /*#__PURE__*/React.createElement("p", {
    className: "plan-warn mt-3"
  }, "Bu tempoyla ", SP.fmtMin(plan.behindMin), " konu \xE7al\u0131\u015Fmas\u0131 son d\xF6neme yeti\u015Fmiyor. ", plan.needWeekMin ? "Haftada " + SP.fmtMin(plan.needWeekMin) + " önerilir." : "Haftaya çalışma günü eklemen önerilir.") : null, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-4 no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip is-primary",
    onClick: print
  }, "\uD83D\uDDA8 Yazd\u0131r / PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: shareImage
  }, "\uD83D\uDCE4 Payla\u015F\u0131m g\xF6rseli"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: props.onWizard
  }, "D\xFCzenle")), msg ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-emerald-700 mt-2 no-print",
    role: "status"
  }, msg) : null), /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, shown.map(function (g, gi) {
    var mins = g.reduce(function (a, d) {
      return a + d.minutes;
    }, 0);
    return /*#__PURE__*/React.createElement("section", {
      key: gi,
      className: "plan-week"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-sm font-bold text-stone-500 mb-2"
    }, SP.fmtDate(g[0].date), " \u2013 ", SP.fmtDate(g[g.length - 1].date), " \xB7 ", SP.fmtMin(mins)), /*#__PURE__*/React.createElement("div", {
      className: "plan-week-grid"
    }, g.map(function (d) {
      var isToday = d.date === plan.today;
      return /*#__PURE__*/React.createElement("article", {
        key: d.date,
        className: "plan-day" + (isToday ? " is-today" : ""),
        style: {
          borderTopColor: SP.PHASES[d.phase].color
        }
      }, /*#__PURE__*/React.createElement("p", {
        className: "plan-day-head"
      }, /*#__PURE__*/React.createElement("b", null, SP.DAY_SHORT[d.weekday], " ", SP.fmtDate(d.date)), isToday ? /*#__PURE__*/React.createElement("span", {
        className: "plan-today-pill"
      }, "bug\xFCn") : null), d.items.length ? /*#__PURE__*/React.createElement("ul", {
        className: "space-y-1.5"
      }, d.items.map(function (x, i) {
        return /*#__PURE__*/React.createElement("li", {
          key: i,
          className: "plan-day-item" + (isToday && doneIds[x.id] ? " is-done" : "")
        }, /*#__PURE__*/React.createElement("span", {
          "aria-hidden": "true"
        }, PLAN_ICON[x.kind]), /*#__PURE__*/React.createElement("span", {
          className: "min-w-0"
        }, /*#__PURE__*/React.createElement("span", {
          className: "block font-semibold"
        }, SP.taskTitle(x)), /*#__PURE__*/React.createElement("span", {
          className: "block text-stone-500"
        }, x.ders ? x.ders + (x.konu ? " / " + kLabel(x.konu) : "") + " · " : "", SP.fmtMin(x.minutes))));
      })) : /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-stone-400"
      }, "Dinlenme"));
    })));
  })), weeks < groups.length ? /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-6 no-print"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      setWeeks(weeks + 8);
    }
  }, "Sonraki 8 haftay\u0131 g\xF6ster (", groups.length - weeks, " hafta kald\u0131)")) : null);
}
function StudyDash(props) {
  const d = StudyPlanner.studyDashboard ? StudyPlanner.studyDashboard(props.student) : null;
  const [pickDay, setPickDay] = useState(null);
  const [hoverWeek, setHoverWeek] = useState(null);
  if (!d) return /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-6 text-center text-stone-400 text-sm slide-up"
  }, "\xC7al\u0131\u015Fmaya ba\u015Flay\u0131nca istatistikler burada g\xF6r\xFCnecek.");
  var weekMax = 1;
  d.weekMin.forEach(function (v) {
    if (v > weekMax) weekMax = v;
  });
  var trendMax = 1;
  d.weeks.forEach(function (w) {
    if (w.minutes > trendMax) trendMax = w.minutes;
  });
  var pts = d.weeks.map(function (w, i) {
    var x = 8 + i / Math.max(1, d.weeks.length - 1) * 220;
    var y = 78 - w.minutes / trendMax * 64;
    return x + "," + y;
  }).join(" ");
  var area = "8,78 " + pts + " 228,78";
  var weekGoalPct = d.plannedWeek ? Math.min(100, Math.round(d.actualWeekH / d.plannedWeek * 100)) : d.actualWeekH ? 100 : 0;
  var todayGoal = d.todayPlanH;
  var todayH = Math.round(d.todayMin / 60 * 10) / 10;
  var todayPct = todayGoal ? Math.min(100, Math.round(todayH / todayGoal * 100)) : todayH ? 100 : 0;
  var rec = d.longest.minutes ? Math.round(d.longest.minutes / 60 * 10) / 10 + " saat" : "—";
  var dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  var dayFull = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  // bu haftanın günleri (Pzt başlangıçlı) ve her günün soru / doğru sayısı
  var todayIso = StudentStore.todayStr();
  var todayIdx = (new Date(todayIso + "T12:00:00").getDay() + 6) % 7;
  var weekIso = dayNames.map(function (_n, i) {
    return StudentStore.addDays(todayIso, i - todayIdx);
  });
  var weekQ = weekIso.map(function (iso) {
    var x = (props.student.sessions || {})[iso] || {};
    return {
      q: x.questions || 0,
      c: x.correct || 0
    };
  });
  var selDay = pickDay == null ? todayIdx : pickDay;
  var lastW = d.weeks[d.weeks.length - 1] || {
    minutes: 0
  };
  var prevW = d.weeks[d.weeks.length - 2] || {
    minutes: 0
  };
  var wDelta = prevW.minutes ? Math.round((lastW.minutes - prevW.minutes) / prevW.minutes * 100) : null;
  var circ = 2 * Math.PI * 28;
  var donutEls = [];
  var donutOff = 0;
  d.dersList.forEach(function (x, i) {
    var dash = circ * (x.v / d.dersSum);
    donutEls.push({
      ders: x.ders,
      dash: dash,
      off: donutOff,
      color: DASH_COLORS[i % DASH_COLORS.length]
    });
    donutOff += dash;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 slide-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400"
  }, "\uD83D\uDCCA \u0130statistikler"), /*#__PURE__*/React.createElement("span", {
    className: "h-px flex-1 bg-stone-200 dark:bg-stone-700"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-4 text-center card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-stat text-2xl font-bold text-indigo-600"
  }, d.streak), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-stone-500 mt-0.5"
  }, "\uD83D\uDD25 seri g\xFCn")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-4 text-center card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-stat text-2xl font-bold text-amber-600"
  }, d.avgSeansMin || "—"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-stone-500 mt-0.5"
  }, "\u23F1 dk / oturum")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-4 text-center card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-stat text-2xl font-bold text-emerald-600"
  }, rec), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-stone-500 mt-0.5"
  }, "\uD83C\uDFC6 rekor g\xFCn"))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-5 card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-semibold"
  }, "Toplam ", d.totalHours, " saat"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-400"
  }, "Bu hafta ", d.actualWeekH, "/", d.plannedWeek || 0, " sa")), /*#__PURE__*/React.createElement("div", {
    className: "h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500",
    style: {
      width: weekGoalPct + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mt-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, "Bug\xFCn ", todayH, " / ", todayGoal || 0, " saat"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-indigo-600"
  }, todayPct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500",
    style: {
      width: todayPct + "%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-5 card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold"
  }, "\uD83D\uDCC8 Haftal\u0131k trend"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-500"
  }, hoverWeek != null ? d.weeks[hoverWeek].label + " haftası: " + d.weeks[hoverWeek].minutes + " dk" : wDelta == null ? "Bu hafta " + lastW.minutes + " dk" : "Bu hafta " + lastW.minutes + " dk · geçen haftaya göre " + (wDelta >= 0 ? "+" : "") + wDelta + "%")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 236 86",
    className: "w-full h-24",
    onMouseLeave: function () {
      setHoverWeek(null);
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    fill: "rgba(79,70,229,0.12)",
    points: area
  }), /*#__PURE__*/React.createElement("polyline", {
    fill: "none",
    stroke: "#4f46e5",
    strokeWidth: "2.5",
    points: pts,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), d.weeks.map(function (w, i) {
    var x = 8 + i / Math.max(1, d.weeks.length - 1) * 220;
    var y = 78 - w.minutes / trendMax * 64;
    var on = hoverWeek === i;
    return /*#__PURE__*/React.createElement("g", {
      key: i,
      onMouseEnter: function () {
        setHoverWeek(i);
      },
      onClick: function () {
        setHoverWeek(i);
      },
      style: {
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: x - 13,
      y: "0",
      width: "26",
      height: "86",
      fill: "transparent"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: on ? 4.5 : 2.6,
      fill: on ? "#4f46e5" : "#fff",
      stroke: "#4f46e5",
      strokeWidth: "1.6"
    }), /*#__PURE__*/React.createElement("title", null, w.label + " haftası: " + w.minutes + " dk"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-[10px] text-stone-400 -mt-1"
  }, /*#__PURE__*/React.createElement("span", null, "8 hafta \xF6nce"), /*#__PURE__*/React.createElement("span", null, "bu hafta"))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-5 card-hover"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold mb-3"
  }, "\uD83D\uDCC5 Bu hafta"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end gap-1.5 h-28",
    role: "group",
    "aria-label": "Bu haftan\u0131n g\xFCnleri"
  }, d.weekMin.map(function (m, i) {
    var h = Math.max(6, Math.round(m / weekMax * 92));
    var on = i === selDay;
    var future = i > todayIdx;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: function () {
        setPickDay(i);
      },
      "aria-pressed": on,
      "aria-label": dayFull[i] + ": " + m + " dakika, " + weekQ[i].q + " soru",
      className: "week-bar flex-1 flex flex-col items-center justify-end h-full"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block w-full rounded-t-lg transition-all duration-300",
      style: {
        height: h + "%",
        background: on ? "#4f46e5" : future ? "#e7e5e4" : "#a5b4fc"
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] mt-1.5 " + (i === todayIdx ? "font-black text-indigo-600" : "font-medium text-stone-400")
    }, dayNames[i]));
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-600 dark:text-stone-300 mt-3",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("b", null, dayFull[selDay], selDay === todayIdx ? " (bugün)" : "", ":"), " ", d.weekMin[selDay], " dk \xB7 ", weekQ[selDay].q, " soru", weekQ[selDay].q ? " · %" + Math.round(weekQ[selDay].c / weekQ[selDay].q * 100) + " doğru" : "")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass p-5 card-hover"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold mb-3"
  }, "\uD83D\uDCDA Ders da\u011F\u0131l\u0131m\u0131"), d.dersSum ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-6 flex-wrap"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100",
    height: "100",
    viewBox: "0 0 88 88",
    className: "shrink-0"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "44",
    cy: "44",
    r: "28",
    fill: "none",
    stroke: "#e2e8f0",
    strokeWidth: "12"
  }), donutEls.map(function (x) {
    return /*#__PURE__*/React.createElement("circle", {
      key: x.ders,
      cx: "44",
      cy: "44",
      r: "28",
      fill: "none",
      stroke: x.color,
      strokeWidth: "12",
      strokeDasharray: x.dash + " " + (circ - x.dash),
      strokeDashoffset: -x.off,
      transform: "rotate(-90 44 44)",
      className: "transition-all duration-500"
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 space-y-1.5 flex-1"
  }, d.dersList.slice(0, 5).map(function (x, i) {
    var pct = Math.round(x.v / d.dersSum * 100);
    return /*#__PURE__*/React.createElement("button", {
      key: x.ders,
      type: "button",
      title: x.ders + " sayfasını aç",
      onClick: function () {
        if (props.onDers) props.onDers(x.ders);
      },
      className: "ders-row w-full text-left flex items-center gap-2 rounded-lg px-1.5 py-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "h-2.5 w-2.5 rounded-full shrink-0",
      style: {
        background: DASH_COLORS[i % DASH_COLORS.length]
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-xs truncate flex-1"
    }, x.ders), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-stone-400"
    }, pct, "%"), /*#__PURE__*/React.createElement("span", {
      className: "w-12 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block h-full rounded-full",
      style: {
        width: pct + "%",
        background: DASH_COLORS[i % DASH_COLORS.length]
      }
    })));
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400"
  }, "Ders saati birikince pasta dolacak.")));
}

// ---------- Bugün: etkileşimli çalışma araçları ----------

var TASK_ICON = {
  notes: "📖",
  test: "🎯",
  review: "🔁",
  wrong: "🩹"
};
function NextSteps(props) {
  var plan = props.plan;
  var tasks = plan.tasks || [];
  function run(t) {
    if (t.kind === "notes") props.onKonu(t.ders, t.konu, "notes");else if (t.kind === "test") props.onKonu(t.ders, t.konu, "hub");else if (t.kind === "review") props.onReview();else if (t.kind === "wrong") props.onWrong();
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "rounded-3xl glass p-5 sm:p-6 mb-4 slide-up",
    "aria-labelledby": "next-steps-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-3 mb-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300"
  }, "\u015Eimdi ne \xE7al\u0131\u015Fay\u0131m?"), /*#__PURE__*/React.createElement("h2", {
    id: "next-steps-title",
    className: "text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5 leading-snug"
  }, plan.coach))), tasks.length ? /*#__PURE__*/React.createElement("ol", {
    className: "mt-4 space-y-2"
  }, tasks.map(function (t, i) {
    return /*#__PURE__*/React.createElement("li", {
      key: t.id
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        run(t);
      },
      className: "next-step w-full text-left rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 transition-all " + (i === 0 ? "is-first" : "")
    }, /*#__PURE__*/React.createElement("span", {
      className: "next-step-ico shrink-0",
      "aria-hidden": "true"
    }, TASK_ICON[t.kind] || "•"), /*#__PURE__*/React.createElement("span", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block font-semibold text-[15px] leading-snug"
    }, t.title, /*#__PURE__*/React.createElement("span", {
      className: "font-normal opacity-70"
    }, " \xB7 ", t.detail)), /*#__PURE__*/React.createElement("span", {
      className: "block text-xs mt-0.5 opacity-70 leading-snug"
    }, t.why)), /*#__PURE__*/React.createElement("span", {
      className: "next-step-go shrink-0",
      "aria-hidden": "true"
    }, i === 0 ? "Başla" : "→")));
  })) : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mt-3"
  }, "Bekleyen g\xF6rev yok. Kar\u0131\u015F\u0131k soruyla tempoyu koru."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: props.onMixed,
    className: "quick-chip"
  }, "\uD83C\uDFB2 Kar\u0131\u015F\u0131k 10 soru"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: props.onReview,
    disabled: !plan.due.length,
    className: "quick-chip"
  }, "\uD83D\uDD01 Tekrar (", plan.due.length, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: props.onWrong,
    disabled: !plan.wrong.length,
    className: "quick-chip"
  }, "\uD83E\uDE79 Yanl\u0131\u015Flar (", plan.wrong.length, ")")));
}
function DailyGoal(props) {
  var student = props.student;
  var sess = (student.sessions || {})[StudentStore.todayStr()] || {};
  var goal = Number(student.profile && student.profile.dailyQuestions) || 25;
  var done = sess.questions || 0;
  var correct = sess.correct || 0;
  var minutes = sess.minutes || 0;
  var pct = Math.min(1, done / goal);
  var R = 42;
  var C = 2 * Math.PI * R;
  function setGoal(v) {
    v = Math.max(5, Math.min(300, v));
    if (v !== goal) StudentStore.updateProfile({
      dailyQuestions: v
    });
  }
  var left = Math.max(0, goal - done);
  return /*#__PURE__*/React.createElement("section", {
    className: "rounded-3xl glass p-5 flex items-center gap-5",
    "aria-label": "G\xFCnl\xFCk soru hedefi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative shrink-0",
    style: {
      width: 104,
      height: 104
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 104 104",
    width: "104",
    height: "104",
    role: "img",
    "aria-label": done + " / " + goal + " soru"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "52",
    cy: "52",
    r: R,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "10",
    className: "text-stone-200 dark:text-stone-700"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "52",
    cy: "52",
    r: R,
    fill: "none",
    stroke: pct >= 1 ? "#059669" : "#4f46e5",
    strokeWidth: "10",
    strokeLinecap: "round",
    strokeDasharray: C * pct + " " + C,
    transform: "rotate(-90 52 52)",
    style: {
      transition: "stroke-dasharray .5s ease"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-stat text-2xl font-bold leading-none"
  }, done), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-stone-400 mt-0.5"
  }, "/ ", goal, " soru"))), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400"
  }, "G\xFCnl\xFCk hedef"), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold mt-0.5"
  }, left ? "Hedefe " + left + " soru kaldı" : "Bugünkü hedef tamam 🎉"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 mt-1"
  }, correct, " do\u011Fru", done ? " (%" + Math.round(correct / done * 100) + ")" : "", " \xB7 ", minutes, " dk \xE7al\u0131\u015Fma"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-500"
  }, "Hedef"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "step-btn",
    "aria-label": "Hedefi 5 azalt",
    onClick: function () {
      setGoal(goal - 5);
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    className: "font-stat font-bold w-8 text-center",
    "aria-live": "polite"
  }, goal), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "step-btn",
    "aria-label": "Hedefi 5 art\u0131r",
    onClick: function () {
      setGoal(goal + 5);
    }
  }, "+"))));
}
var FOCUS_KEY = "kpss-focus-timer";
function readFocus() {
  try {
    return JSON.parse(localStorage.getItem(FOCUS_KEY) || "null");
  } catch (e) {
    return null;
  }
}
function writeFocus(v) {
  try {
    if (v) localStorage.setItem(FOCUS_KEY, JSON.stringify(v));else localStorage.removeItem(FOCUS_KEY);
  } catch (e) {}
}
function focusElapsed(f, now) {
  if (!f) return 0;
  return (f.acc || 0) + (f.runningSince ? Math.max(0, now - f.runningSince) : 0);
}
function chime() {
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ctx = new Ctx();
    [0, 0.22, 0.44].forEach(function (t, i) {
      var o = ctx.createOscillator(),
        g = ctx.createGain();
      o.frequency.value = [660, 880, 990][i];
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.35);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.4);
    });
  } catch (e) {}
}

// Pomodoro: süre bitince ya da erken bitirince dakikalar istatistiğe "oturum" olarak yazılır.
// Durum localStorage'da tutulur; başka sayfaya geçip dönünce sayaç kaldığı yerden sürer.
function FocusTimer(props) {
  const [f, setF] = useState(readFocus);
  const [now, setNow] = useState(Date.now());
  const [ders, setDers] = useState((readFocus() || {}).ders || "");
  const [msg, setMsg] = useState("");
  var dersler = Object.keys(props.kpssData || {});
  var durMs = f ? f.minutes * 60000 : 0;
  var el = focusElapsed(f, now);
  var leftMs = f ? Math.max(0, durMs - el) : 0;
  function record(ms, auto) {
    var mins = Math.round(ms / 60000);
    if (mins >= 1) {
      StudentStore.addSessionStats({
        minutes: mins,
        seans: true,
        ders: f && f.ders || null
      });
      setMsg((auto ? "Süre doldu! " : "") + mins + " dk çalışma kaydedildi.");
    } else {
      setMsg("1 dakikadan kısa oturum kaydedilmedi.");
    }
    writeFocus(null);
    setF(null);
  }
  useEffect(function () {
    if (!f || !f.runningSince) return;
    var id = setInterval(function () {
      setNow(Date.now());
    }, 1000);
    return function () {
      clearInterval(id);
    };
  }, [f]);
  useEffect(function () {
    if (f && f.runningSince && leftMs <= 0) {
      chime();
      if (window.NotificationEngine && window.NotificationEngine.showLocal) {
        try {
          window.NotificationEngine.showLocal("Atanly", "Odak süresi bitti. Kısa bir mola ver.");
        } catch (e) {}
      }
      record(durMs, true);
    }
  }, [leftMs, f]);

  // sekme başlığında kalan süre
  useEffect(function () {
    var base = document.title.replace(/^\(\d+:\d\d\) /, "");
    if (f && f.runningSince) {
      var m = Math.floor(leftMs / 60000),
        s = Math.floor(leftMs % 60000 / 1000);
      document.title = "(" + m + ":" + String(s).padStart(2, "0") + ") " + base;
    } else document.title = base;
    return function () {
      document.title = document.title.replace(/^\(\d+:\d\d\) /, "");
    };
  }, [leftMs, f]);
  function start(minutes) {
    var next = {
      minutes: minutes,
      acc: 0,
      runningSince: Date.now(),
      ders: ders || null
    };
    writeFocus(next);
    setF(next);
    setNow(Date.now());
    setMsg("");
  }
  function pause() {
    var t = Date.now();
    var next = Object.assign({}, f, {
      acc: focusElapsed(f, t),
      runningSince: null
    });
    writeFocus(next);
    setF(next);
    setNow(t);
  }
  function resume() {
    var next = Object.assign({}, f, {
      runningSince: Date.now()
    });
    writeFocus(next);
    setF(next);
    setNow(Date.now());
  }
  var mm = Math.floor(leftMs / 60000),
    ss = Math.floor(leftMs % 60000 / 1000);
  var pct = f ? Math.min(1, el / durMs) : 0;
  return /*#__PURE__*/React.createElement("section", {
    className: "rounded-3xl glass p-5",
    "aria-label": "Odak sayac\u0131"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400"
  }, "\u23F1 Odak sayac\u0131"), f ? /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-500"
  }, f.ders ? f.ders + " · " : "", f.minutes, " dk") : null), f ? /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-stat text-4xl font-bold tracking-tight",
    "aria-live": "off"
  }, mm, ":", String(ss).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    className: "h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500",
    style: {
      width: pct * 100 + "%",
      transition: "width 1s linear"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-4"
  }, f.runningSince ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: pause
  }, "\u23F8 Duraklat") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip is-primary",
    onClick: resume
  }, "\u25B6 Devam et"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      record(focusElapsed(f, Date.now()), false);
    }
  }, "\u2713 Bitir ve kaydet"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: function () {
      writeFocus(null);
      setF(null);
      setMsg("Oturum iptal edildi.");
    }
  }, "Vazge\xE7"))) : /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-xs text-stone-500 block mb-1",
    htmlFor: "focus-ders"
  }, "Ders (iste\u011Fe ba\u011Fl\u0131)"), /*#__PURE__*/React.createElement("select", {
    id: "focus-ders",
    value: ders,
    onChange: function (e) {
      setDers(e.target.value);
    },
    className: "w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Ders se\xE7meden"), dersler.map(function (d) {
    return /*#__PURE__*/React.createElement("option", {
      key: d,
      value: d
    }, d);
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-3"
  }, [25, 45, 60].map(function (m) {
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      type: "button",
      className: "quick-chip" + (m === 25 ? " is-primary" : ""),
      onClick: function () {
        start(m);
      }
    }, "\u25B6 ", m, " dk");
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 mt-3"
  }, "S\xFCre dolunca \xE7al\u0131\u015Fma dakikan ve oturumun istatistiklere eklenir.")), msg ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-emerald-700 dark:text-emerald-300 mt-3",
    role: "status"
  }, msg) : null);
}
function WeakTopics(props) {
  // Önce net düşük (%85 altı) test edilmiş konular; hiç test yoksa sıradaki başlanmamış konular.
  var rows = (props.plan.rows || []).filter(function (r) {
    return r.soruSayisi > 0;
  });
  var tested = rows.filter(function (r) {
    return r.lastPct != null && r.lastPct < 85;
  }).sort(function (a, b) {
    return a.lastPct - b.lastPct;
  });
  var list = tested.length ? tested.slice(0, 5) : rows.filter(function (r) {
    return r.lastPct == null;
  }).slice(0, 3);
  if (!list.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "rounded-3xl glass p-5",
    "aria-labelledby": "weak-title"
  }, /*#__PURE__*/React.createElement("p", {
    id: "weak-title",
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-3"
  }, tested.length ? "🎯 Önce bunları güçlendir" : "🎯 Sıradaki konular"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, list.map(function (r) {
    var pct = r.lastPct;
    var col = pct == null ? "#a8a29e" : pct < 50 ? "#e11d48" : pct < 75 ? "#d97706" : "#059669";
    return /*#__PURE__*/React.createElement("li", {
      key: r.ders + "|" + r.konu
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        props.onKonu(r.ders, r.konu, "hub");
      },
      className: "weak-row w-full text-left rounded-2xl p-3 flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block text-sm font-semibold truncate"
    }, kLabel(r.konu)), /*#__PURE__*/React.createElement("span", {
      className: "block text-xs text-stone-500"
    }, r.ders, " \xB7 ", pct == null ? "henüz test yok" : "son net %" + pct), /*#__PURE__*/React.createElement("span", {
      className: "block h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden mt-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block h-full rounded-full",
      style: {
        width: (pct == null ? 4 : Math.max(4, pct)) + "%",
        background: col
      }
    }))), /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-teal-700 dark:text-teal-300 shrink-0"
    }, "\xC7al\u0131\u015F \u2192")));
  })));
}

// ---------- Canlı deneme kartı (Bugün ve Canlı deneme ekranı) ----------
// Aşamalar sunucu saatine göre: js/liveExam.js phase(); kurallar supabase/patch-live-exam.sql
function liveKonuHasContent(kpssData, ders, konu) {
  var kd = kpssData && kpssData[ders] && kpssData[ders][konu];
  return !!(kd && ((kd.notlar || []).length || (kd.sorular || []).length));
}
function LiveExamCard(props) {
  var L = window.LiveExam,
    C = window.LiveClient;
  var track = C ? C.trackOf(props.student) : "lisans";
  const [dash, setDash] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [booklet, setBooklet] = useState("");
  const [, setTick] = useState(0);
  var clockRef = useRef(null);
  var lastPhase = useRef("");
  var fetchedResult = useRef({});
  function load() {
    if (!C) return Promise.resolve();
    return C.rpc("live_dashboard", {
      p_track: track
    }).then(function (d) {
      clockRef.current = L.createClock(d.now);
      setDash(d);
      setErr(null);
    }).catch(function (e) {
      setErr(e);
    });
  }
  useEffect(function () {
    if (!C || !L) return;
    load();
    var t = setInterval(load, 60000);
    var s = setInterval(function () {
      setTick(function (x) {
        return x + 1;
      });
    }, 1000);
    return function () {
      clearInterval(t);
      clearInterval(s);
    };
  }, [track]);
  var now = clockRef.current ? clockRef.current.now() : Date.now();
  var ph = dash ? L.phase(dash, now) : "loading";
  var e = dash && dash.exam;
  var last = dash && dash.last_result;

  // aşama değişince (10:00, 10:15, 12:25 …) panoyu yenile
  useEffect(function () {
    if (lastPhase.current && lastPhase.current !== ph && ph !== "loading") load();
    lastPhase.current = ph;
  }, [ph]);

  // 10:00'dan itibaren kitapçığı önceden indir (şifreli; 10:15'te açılır)
  useEffect(function () {
    if (!e || !C) return;
    if (["about_to_start", "can_enter", "in_progress"].indexOf(ph) < 0) return;
    if (C.hasBooklet(e.id)) {
      setBooklet("ok");
      return;
    }
    setBooklet("loading");
    C.fetchBooklet(e.id).then(function () {
      setBooklet("ok");
    }, function () {
      setBooklet("fail");
    });
  }, [ph, e && e.id]);

  // sınav bitti: bekleyen cevapları gönder, sonucu hesaplat
  useEffect(function () {
    if (!e || !C || !dash.attempt) return;
    if (ph !== "ended" && ph !== "ranking") return;
    if (last && last.exam_id === e.id) return;
    if (fetchedResult.current[e.id]) return;
    fetchedResult.current[e.id] = true;
    C.flushPending(e.id).then(function () {
      return C.rpc("live_result", {
        p_exam: e.id
      });
    }).then(load, function () {
      fetchedResult.current[e.id] = false;
    });
  }, [ph, e && e.id]);

  // yanlış/boş konular Eksikler'e
  useEffect(function () {
    if (last && last.by_konu && window.StudentStore && StudentStore.applyLiveExamGaps) {
      StudentStore.applyLiveExamGaps(last.exam_id, {
        title: last.title,
        at: last.starts_at
      }, L.gaps(last));
    }
  }, [last && last.exam_id]);
  if (!L || !C) return null;
  if (!dash) {
    if (err) return null;
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-3xl glass p-5 mb-4 live-card",
      "aria-busy": "true"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500"
    }, "Canl\u0131 deneme y\xFCkleniyor\u2026"));
  }
  function act(name, args, done) {
    setBusy(true);
    setMsg("");
    C.rpc(name, args).then(function (r) {
      setBusy(false);
      if (done) done(r);
      load();
    }).catch(function (x) {
      setBusy(false);
      setMsg(x.message);
    });
  }
  function register() {
    act("live_register", {
      p_exam: e.id
    }, function (r) {
      setMsg(r && r.status === "waitlist" ? "Kontenjan dolu; yedek listesine alındın." : "Kaydın alındı.");
    });
  }
  function unregister() {
    if (window.confirm("Kaydını silmek istiyor musun?")) act("live_unregister", {
      p_exam: e.id
    });
  }
  function enter() {
    props.onOpen && props.onOpen("exam", e.id);
  }
  var startT = e ? L.ms(e.starts_at) : 0;
  var title = e ? e.title : "Canlı deneme";
  var when = e ? L.fmtDay(startT, true) + " " + L.fmtClock(startT) : "";
  function ResultBlock(p) {
    var r = p.r;
    var weak = L.weakest(r, 3);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300"
    }, "Son deneme sonucun \xB7 ", L.fmtDay(L.ms(r.starts_at))), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold mt-0.5"
    }, r.title), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-end gap-x-6 gap-y-2 mt-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "font-stat text-4xl font-black"
    }, L.fmtNet(r.net)), " ", /*#__PURE__*/React.createElement("span", {
      className: "text-sm text-stone-500"
    }, "net")), /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-stone-600 dark:text-stone-300"
    }, r.correct, " do\u011Fru \xB7 ", r.wrong, " yanl\u0131\u015F \xB7 ", r.blank, " bo\u015F"), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-semibold"
    }, r.finalized && r.rank ? r.rank + ". / " + r.participants + " kişi · ilk %" + String(r.top_pct).replace(".", ",") : "Sıralama " + L.fmtClock(L.ms(r.ranking_at)) + "'ta açıklanır")), weak.length ? /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mb-1"
    }, "En zay\u0131f 3 konun (Eksikler'e eklendi):"), /*#__PURE__*/React.createElement("ul", {
      className: "space-y-1"
    }, weak.map(function (w) {
      var can = liveKonuHasContent(props.kpssData, w.ders, w.konu) && props.onKonu;
      return /*#__PURE__*/React.createElement("li", {
        key: w.key,
        className: "text-sm flex flex-wrap justify-between gap-2"
      }, can ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "font-semibold text-teal-700 dark:text-teal-300 hover:underline text-left",
        onClick: function () {
          props.onKonu(w.ders, w.konu);
        }
      }, w.ders, " / ", kLabel(w.konu), " \u2192") : /*#__PURE__*/React.createElement("span", {
        className: "font-semibold"
      }, w.ders, " / ", kLabel(w.konu)), /*#__PURE__*/React.createElement("span", {
        className: "text-stone-500"
      }, w.c, "/", w.n));
    }))) : null, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mt-4"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip is-primary",
      onClick: function () {
        props.onOpen && props.onOpen("result", r.exam_id);
      }
    }, "T\xFCm raporu g\xF6r"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip",
      onClick: function () {
        props.onOpen && props.onOpen("archive");
      }
    }, "Denemelerim")));
  }
  var body = null;
  var showResult = last && ["ended", "ranking", "none", "reg_open", "registered", "waitlist", "reg_closed", "over_unregistered", "missed_live"].indexOf(ph) >= 0;
  var missedNewer = dash.missed && (!last || L.ms(dash.missed.starts_at) > L.ms(last.starts_at));
  if (ph === "loading") body = null;else if (ph === "about_to_start") {
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300"
    }, "S\u0131nav ba\u015Flamak \xFCzere"), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold mt-0.5"
    }, title), /*#__PURE__*/React.createElement("p", {
      className: "mt-2 font-stat text-3xl font-black",
      role: "timer"
    }, L.fmtLeft(startT - now)), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
    }, booklet === "ok" ? "✓ Soru kitapçığı şifreli olarak cihazına indi; 10:15'te açılacak." : booklet === "fail" ? "Kitapçık indirilemedi; internetini kontrol et, tekrar denenecek." : "Soru kitapçığı cihazına iniyor…"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip is-primary mt-3",
      disabled: true
    }, "S\u0131nava gir (10:15'te a\xE7\u0131l\u0131r)"));
  } else if (ph === "can_enter" || ph === "in_progress") {
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300"
    }, "\u25CF S\u0131nav devam ediyor"), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold mt-0.5"
    }, title), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
    }, "Biti\u015Fe ", L.fmtLeft(L.ms(e.ends_at) - now), " kald\u0131", ph === "can_enter" ? " · giriş " + L.fmtClock(L.ms(e.entry_closes_at)) + "'te kapanır" : "", "."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip is-primary mt-3",
      onClick: enter
    }, ph === "in_progress" ? "Kaldığın yerden devam et" : "Sınava gir"));
  } else if (ph === "entry_closed") {
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-bold"
    }, "S\u0131nava giri\u015F ", L.fmtClock(L.ms(e.entry_closes_at)), "'te kapand\u0131."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, "Sonraki denemeye kay\u0131t hafta i\xE7i a\xE7\u0131lacak."));
  } else if (ph === "submitted") {
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-bold"
    }, "K\xE2\u011F\u0131d\u0131n\u0131 teslim ettin."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, "Sonucun ve \xE7\xF6z\xFCmler ", L.fmtClock(L.ms(e.ends_at)), "'te a\xE7\u0131l\u0131r."));
  } else if (ph === "locked") {
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-bold text-rose-700"
    }, "S\u0131nav\u0131n kilitlendi."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, "Cihaz de\u011Fi\u015Fim s\u0131n\u0131r\u0131 a\u015F\u0131ld\u0131. Y\xF6netici ile ileti\u015Fime ge\xE7."));
  } else if ((ph === "ended" || ph === "ranking") && !(last && last.exam_id === e.id)) {
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-bold"
    }, "S\u0131nav bitti."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, "Sonucun hesaplan\u0131yor\u2026"));
  } else if (showResult) {
    body = /*#__PURE__*/React.createElement(ResultBlock, {
      r: last
    });
  } else if (missedNewer || ph === "missed_live" || ph === "over_unregistered") {
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-bold"
    }, "Bu haftaki denemeye kat\u0131lmad\u0131n."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, "Genel sonu\xE7lar a\xE7\u0131kland\u0131\u011F\u0131nda burada g\xF6r\xFCn\xFCr; bir sonrakine kay\u0131t ol."));
  }

  // kayıt bölümü (sonuç kartının altında da görünür)
  var regBlock = null;
  if (ph === "reg_open") {
    regBlock = /*#__PURE__*/React.createElement("div", {
      className: body ? "mt-4 pt-4 border-t border-stone-200/70 dark:border-stone-700" : ""
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300"
    }, "Canl\u0131 deneme \xB7 ", L.TRACKS[e.track]), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold mt-0.5"
    }, when, "'te canl\u0131 deneme"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
    }, "120 soru \xB7 130 dakika \xB7 herkes ayn\u0131 anda \xB7 ba\u015Flamaya ", L.fmtLeft(startT - now), dash.registered_count ? " · " + dash.registered_count + " kayıtlı" : "", e.capacity ? " / " + e.capacity : ""), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip is-primary mt-3",
      disabled: busy,
      onClick: register
    }, "Kay\u0131t ol"));
  } else if (ph === "registered" || ph === "waitlist") {
    regBlock = /*#__PURE__*/React.createElement("div", {
      className: body ? "mt-4 pt-4 border-t border-stone-200/70 dark:border-stone-700" : ""
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300"
    }, ph === "waitlist" ? "Yedek listesindesin" : "✓ Kayıtlısın"), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold mt-0.5"
    }, when, " \xB7 ", title), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
    }, ph === "waitlist" ? "Sıran: " + (dash.registration && dash.registration.waitlist_pos || "?") + ". Yer açılırsa otomatik kaydedilirsin. " : "", "Ba\u015Flamaya ", L.fmtLeft(startT - now), "."), ph === "registered" ? /*#__PURE__*/React.createElement("ul", {
      className: "text-xs text-stone-500 mt-2 space-y-0.5 list-disc pl-4"
    }, /*#__PURE__*/React.createElement("li", null, "Kay\u0131t pazar ", L.fmtClock(L.ms(e.reg_closes_at)), "'da kapan\u0131r; kitap\xE7\u0131k o saatte cihaz\u0131na iner."), /*#__PURE__*/React.createElement("li", null, "130 dakikal\u0131k sessiz bir zaman ay\u0131r; m\xFCsvedde k\xE2\u011F\u0131t ve kalem haz\u0131rla."), /*#__PURE__*/React.createElement("li", null, "S\u0131nava ", L.fmtClock(L.ms(e.entry_closes_at)), "'e kadar girebilirsin; ge\xE7 giren ek s\xFCre almaz.")) : null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip mt-3",
      disabled: busy,
      onClick: unregister
    }, "Kayd\u0131m\u0131 sil"));
  } else if (ph === "reg_closed") {
    regBlock = body ? null : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-bold"
    }, "Bu haftan\u0131n kayd\u0131 kapand\u0131."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, "S\u0131nav ", when, "'te ba\u015Fl\u0131yor; sonraki denemeye kay\u0131t hafta i\xE7i a\xE7\u0131l\u0131r."));
  } else if (ph === "none" && !body) {
    regBlock = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-stone-500"
    }, "Canl\u0131 deneme"), /*#__PURE__*/React.createElement("p", {
      className: "font-bold mt-1"
    }, "S\u0131radaki canl\u0131 deneme yak\u0131nda duyurulacak."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mt-1"
    }, "Her pazar 10:15'te herkes ayn\u0131 anda \xE7\xF6zer, ortak s\u0131ralama \xE7\u0131kar."));
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "rounded-3xl glass p-5 sm:p-6 mb-4 slide-up live-card",
    "aria-label": "Canl\u0131 deneme"
  }, dash.cancelled ? /*#__PURE__*/React.createElement("p", {
    className: "plan-warn mb-3"
  }, dash.cancelled.title, " iptal edildi", dash.cancelled.cancel_reason ? ": " + dash.cancelled.cancel_reason : ".") : null, body, regBlock, msg ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm mt-2 text-stone-600 dark:text-stone-300",
    role: "status"
  }, msg) : null, !props.full ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "text-xs font-semibold text-stone-500 hover:underline mt-3",
    onClick: function () {
      props.onOpen && props.onOpen("home");
    }
  }, "Canl\u0131 deneme sayfas\u0131 \u2192") : null);
}
window.KpssLiveCard = LiveExamCard;

// Eksikler: son canlı denemeden gelen konular
function LiveGaps(props) {
  var g = props.student && props.student.userProfile && props.student.userProfile.liveGaps;
  if (!g || !g.items || !g.items.length) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "rounded-3xl glass p-5 mb-6",
    "aria-label": "Canl\u0131 denemeden eksikler"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300"
  }, "Canl\u0131 denemeden \xB7 ", g.title), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-bold mt-0.5"
  }, "Yanl\u0131\u015F ve bo\u015F b\u0131rakt\u0131\u011F\u0131n konular"), /*#__PURE__*/React.createElement("ul", {
    className: "mt-3 space-y-1.5"
  }, g.items.slice(0, 12).map(function (it) {
    var can = liveKonuHasContent(props.kpssData, it.ders, it.konu);
    return /*#__PURE__*/React.createElement("li", {
      key: it.ders + "|" + it.konu,
      className: "flex flex-wrap items-center justify-between gap-2 text-sm"
    }, can ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "font-semibold text-left text-teal-700 dark:text-teal-300 hover:underline",
      onClick: function () {
        props.onKonu(it.ders, it.konu);
      }
    }, it.ders, " / ", kLabel(it.konu), " \u2192") : /*#__PURE__*/React.createElement("span", {
      className: "font-semibold"
    }, it.ders, " / ", kLabel(it.konu), " ", /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-normal text-stone-400"
    }, "(konu anlat\u0131m\u0131 yak\u0131nda)")), /*#__PURE__*/React.createElement("span", {
      className: "text-stone-500"
    }, it.w, " yanl\u0131\u015F \xB7 ", it.b, " bo\u015F"));
  })));
}
function Bugun(props) {
  const plan = props.plan;
  const [wizard, setWizard] = useState(false);
  const [calendar, setCalendar] = useState(false);
  if (calendar) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PlanCalendar, {
      student: props.student,
      kpssData: props.kpssData,
      isDark: props.isDark,
      toggleDark: props.toggleDark,
      onBack: function () {
        setCalendar(false);
      },
      onWizard: function () {
        setWizard(true);
      }
    }), wizard ? /*#__PURE__*/React.createElement(PlanWizard, {
      student: props.student,
      kpssData: props.kpssData,
      onClose: function () {
        setWizard(false);
      },
      onDone: function () {
        setWizard(false);
      }
    }) : null);
  }
  const name = props.student.profile.name;
  const level = props.student.userProfile && props.student.userProfile.educationLevel || "lisans";
  const track = examTrackName(level);
  var examLine,
    examSub = "";
  if (plan.daysLeft == null) {
    examLine = track + " · sınav tarihi yok";
    examSub = "Ben › Ayarlar’dan sınav tarihini seç, plan ona göre kurulsun.";
  } else if (plan.daysLeft < 0) {
    examLine = track + " geride kaldı";
    examSub = "Yeni hedefin için Ben › Ayarlar’dan sınav tarihini güncelle.";
  } else if (plan.daysLeft === 0) {
    examLine = track + " bugün";
    examSub = "Başarılar! Sakin kal, bildiğin soruya önce git.";
  } else {
    examLine = track + "’ye " + plan.daysLeft + " gün kaldı";
    examSub = plan.daysLeft <= 30 ? "Son düzlük: tekrar ve deneme ağırlıklı çalış." : "Her gün not + test; yanlışlar tekrara düşer.";
  }
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "slide-up"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium text-stone-400 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-2 w-2 rounded-full bg-emerald-400 inline-block"
  }), "Ho\u015F geldin", name ? ", " + name : ""), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-display font-black tracking-tight mt-1 gradient-text"
  }, "Bug\xFCn"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1 max-w-sm"
  }, "Hedefine do\u011Fru her g\xFCn bir ad\u0131m.")), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "exam-hero rounded-3xl text-white p-5 mb-6 slide-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold uppercase tracking-wider exam-hero-kicker"
  }, "S\u0131nav takvimi"), /*#__PURE__*/React.createElement("p", {
    className: "text-xl font-bold mt-0.5 leading-snug"
  }, examLine), examSub ? /*#__PURE__*/React.createElement("p", {
    className: "text-[13px] mt-1 opacity-80 leading-snug"
  }, examSub) : null), plan.daysLeft != null && plan.daysLeft > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "exam-hero-count shrink-0" + (plan.daysLeft <= 30 ? " is-soon" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-stat"
  }, plan.daysLeft), /*#__PURE__*/React.createElement("small", null, "g\xFCn")) : null)), /*#__PURE__*/React.createElement("div", {
    className: "dash-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement(LiveExamCard, {
    student: props.student,
    kpssData: props.kpssData,
    onKonu: function (d, k) {
      props.onKonu(d, k, "hub");
    },
    onOpen: props.onLive
  }), /*#__PURE__*/React.createElement(SmartPlanCard, {
    student: props.student,
    kpssData: props.kpssData,
    onKonu: props.onKonu,
    onDers: props.onDers,
    onExam: props.onExam,
    onWizard: function () {
      setWizard(true);
    },
    onCalendar: function () {
      setCalendar(true);
    }
  }), /*#__PURE__*/React.createElement(NextSteps, {
    plan: plan,
    onKonu: props.onKonu,
    onReview: props.onReview,
    onWrong: props.onWrong,
    onMixed: props.onMixed
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tool-pair"
  }, /*#__PURE__*/React.createElement(DailyGoal, {
    student: props.student
  }), /*#__PURE__*/React.createElement(FocusTimer, {
    kpssData: props.kpssData
  })), /*#__PURE__*/React.createElement(WeakTopics, {
    plan: plan,
    onKonu: props.onKonu
  }), /*#__PURE__*/React.createElement(StudyDash, {
    student: props.student,
    onDers: props.onDers
  }))), wizard ? /*#__PURE__*/React.createElement(PlanWizard, {
    student: props.student,
    kpssData: props.kpssData,
    onClose: function () {
      setWizard(false);
    },
    onDone: function () {
      setWizard(false);
    }
  }) : null);
}
function AlistirmalarHome(props) {
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "slide-up"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text"
  }, "Al\u0131\u015Ft\u0131rmalar"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "Bo\u015Fluk, harita ve oyunlar.")), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-4 sm:grid-cols-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      props.onKind("cloze");
    },
    className: "text-left p-6 rounded-3xl glass card-hover flex flex-col items-start justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-900/40 text-2xl flex items-center justify-center mb-3"
  }, "\u270F\uFE0F"), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-lg"
  }, "Bo\u015Fluk doldurma"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "Nottaki bo\u015Flu\u011Fu \u015F\u0131klardan tamamla.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      props.onKind("map");
    },
    className: "text-left p-6 rounded-3xl glass card-hover flex flex-col items-start justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-2xl flex items-center justify-center mb-3"
  }, "\uD83D\uDDFA\uFE0F"), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-lg"
  }, "Harita oyunu"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "Konuyu se\xE7, turdaki isimleri haritaya yerle\u015Ftir.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      props.onKind("conquer");
    },
    className: "text-left p-6 rounded-3xl glass card-hover flex flex-col items-start justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-2xl flex items-center justify-center mb-3"
  }, "\uD83D\uDEE1\uFE0F"), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-lg"
  }, "T\xFCrkiye'yi Fethet"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "\u0130li se\xE7, sorular\u0131 bitir; ili boya, b\xF6lge rozeti kap.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      props.onKind("tabu");
    },
    className: "text-left p-6 rounded-3xl glass card-hover flex flex-col items-start justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl bg-violet-50 dark:bg-violet-900/40 text-2xl flex items-center justify-center mb-3"
  }, "\uD83C\uDCCF"), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-lg"
  }, "Tabu"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "\u0130pu\xE7lar\u0131ndan kavrama ula\u015F. Az ipucu, \xE7ok puan.")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      props.onKind("panic");
    },
    className: "text-left p-6 rounded-3xl glass card-hover flex flex-col items-start justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-2xl flex items-center justify-center mb-3"
  }, "\u23F1\uFE0F"), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-lg"
  }, "Son 30 saniye"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "Do\u011Fru +2 sn, yanl\u0131\u015F \u22123 sn. H\u0131zl\u0131 net bilgi."))));
}
function AlistirmaDersList(props) {
  const kpssData = props.kpssData;
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Al\u0131\u015Ft\u0131rmalar"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-black mb-1"
  }, "Bo\u015Fluk doldurma"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mb-6"
  }, "Ders se\xE7, sonra konu."), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, Object.keys(kpssData).map(function (ders) {
    if (window.ClozeEngine && !window.ClozeEngine.dersEnabled(ders)) return null;
    const t = themeFor(ders, props.isDark);
    const konular = Object.keys(kpssData[ders] || {}).filter(function (k) {
      return k !== "_";
    });
    if (!konular.length) return null;
    return /*#__PURE__*/React.createElement("button", {
      key: ders,
      onClick: function () {
        props.onDers(ders);
      },
      className: "w-full text-left p-5 rounded-3xl glass card-hover flex items-center gap-5 group"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl shrink-0"
    }, t.icon), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "font-bold text-stone-800 dark:text-stone-100 text-lg"
    }, ders), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400"
    }, konular.length, " konu")), /*#__PURE__*/React.createElement("span", {
      className: "text-stone-300 group-hover:text-indigo-500 transition-colors text-xl"
    }, "\u2192"));
  })));
}
function AlistirmaKonuList(props) {
  const ders = props.ders;
  const t = themeFor(ders, props.isDark);
  const konular = Object.keys(props.kpssData[ders] || {}).filter(function (k) {
    return k !== "_";
  });
  const engine = window.ClozeEngine;
  const topics = props.student && props.student.topics && props.student.topics[ders] || {};
  const [stats, setStats] = useState(null);
  useEffect(function () {
    var id = requestAnimationFrame(function () {
      var next = {};
      konular.forEach(function (konu, idx) {
        var kd = props.kpssData[ders][konu] || {};
        var tp = topics[konu] || {};
        var n = engine ? engine.countForKonu(kd) : 0;
        next[konu] = {
          n: n,
          left: n && engine ? engine.remainingCount(kd, tp.solvedCloze) : 0,
          open: StudentStore.isKonuOpen(ders, konular, idx, props.kpssData),
          done: StudentStore.topicComplete(tp, kd)
        };
      });
      setStats(next);
    });
    return function () {
      cancelAnimationFrame(id);
    };
  }, [ders, props.student]);
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Dersler"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl"
  }, t.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-black"
  }, ders), /*#__PURE__*/React.createElement("p", {
    className: "text-zinc-500 text-sm"
  }, "Derslerle ayn\u0131 s\u0131ra. Konu bitince buras\u0131 da a\xE7\u0131l\u0131r."))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, konular.map(function (konu, idx) {
    const st = stats && stats[konu] || {
      n: 0,
      left: 0,
      open: true,
      done: false
    };
    const open = st.open !== false;
    return /*#__PURE__*/React.createElement("button", {
      key: konu,
      disabled: !open,
      onClick: function () {
        if (open) props.onKonu(konu);
      },
      className: "w-full text-left p-5 panel rounded-3xl " + (open ? "" : "opacity-45")
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-10 w-10 rounded-xl flex items-center justify-center font-stat text-sm shrink-0 " + (st.done ? "bg-emerald-50 text-emerald-600" : open ? "bg-teal-50 text-teal-800" : "bg-stone-100 text-stone-400")
    }, st.done ? "✓" : open ? idx + 1 : "🔒"), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-bold text-slate-800 dark:text-slate-100"
    }, kLabel(konu)), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-400 mt-1"
    }, open ? st.n ? st.left + " / " + st.n + " boşluk" : stats ? "Henüz alıştırma yok" : "\u00a0" : "Önce önceki konunun testlerini bitir"))), open ? /*#__PURE__*/React.createElement("span", {
      className: "text-stone-300 text-lg shrink-0"
    }, "\u2192") : null));
  })));
}
function tidyClozePrompt(text) {
  return String(text || "").replace(/\s*Boşluk:\s*/g, " ").replace(/\s*→\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}
function clozePromptNodes(text, fill, fillOk) {
  var raw = tidyClozePrompt(text);
  var parts = raw.split("______");
  if (parts.length === 1 && !fill) {
    return /*#__PURE__*/React.createElement("span", null, raw);
  }
  var nodes = [];
  parts.forEach(function (p, i) {
    if (p) nodes.push(/*#__PURE__*/React.createElement("span", {
      key: "t" + i
    }, p));
    if (i < parts.length - 1 || parts.length === 1 && fill) {
      nodes.push(/*#__PURE__*/React.createElement("span", {
        key: "b" + i,
        className: "cloze-blank" + (fill ? fillOk ? " is-ok" : " is-bad" : "")
      }, fill || "\u00a0"));
    }
  });
  return nodes;
}
function clozeChoiceLabel(c) {
  var t = String(c == null ? "" : c).trim();
  return t ? t.charAt(0).toLocaleUpperCase("tr-TR") + t.slice(1) : t;
}

// Cevaptan sonra "Sonraki" düğmesi alt menünün arkasında kalmasın.
function revealSoon(ref) {
  setTimeout(function () {
    var el = ref && ref.current;
    if (el && el.scrollIntoView) {
      try {
        el.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      } catch (e) {
        el.scrollIntoView(false);
      }
    }
  }, 60);
}
function ClozePlay(props) {
  const [items, setItems] = useState(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const footRef = useRef(null);
  useEffect(function () {
    if (picked) revealSoon(footRef);
  }, [picked]);
  useEffect(function () {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setItems(null);
    var id = requestAnimationFrame(function () {
      if (!window.ClozeEngine) {
        setItems([]);
        return;
      }
      setItems(window.ClozeEngine.buildForKonu(props.konuData, 12, StudentStore.solvedClozeIds(props.ders, props.konu)) || []);
    });
    return function () {
      cancelAnimationFrame(id);
    };
  }, [props.ders, props.konu, props.seed]);
  var totalCloze = window.ClozeEngine ? window.ClozeEngine.countForKonu(props.konuData) : 0;
  var leftCloze = window.ClozeEngine ? window.ClozeEngine.remainingCount(props.konuData, StudentStore.solvedClozeIds(props.ders, props.konu)) : 0;
  if (items == null) {
    return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between mb-4"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Konular"
    }), /*#__PURE__*/React.createElement(ThemeBtn, {
      isDark: props.isDark,
      onClick: props.toggleDark
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold text-stone-400 uppercase tracking-wider"
    }, props.ders), /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl font-black mb-4"
    }, kLabel(props.konu)));
  }
  if (!items.length) {
    var allSolved = totalCloze > 0 && leftCloze === 0;
    return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between mb-4"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Konular"
    }), /*#__PURE__*/React.createElement(ThemeBtn, {
      isDark: props.isDark,
      onClick: props.toggleDark
    })), /*#__PURE__*/React.createElement("div", {
      className: "text-center py-16 rounded-3xl glass"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-bold"
    }, allSolved ? "Bu konudaki boşlukları çözdün." : "Bu konuda henüz boşluk yok."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-2"
    }, allSolved ? "Konuyu sıfırlarsan tekrar gelir." : "Not veya soru eklenince alıştırmalar burada açılır."), allSolved ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        StudentStore.resetCloze(props.ders, props.konu);
        if (props.onAgain) props.onAgain();
      },
      className: "btn-primary text-white px-5 py-2.5 rounded-full font-semibold mt-6"
    }, "S\u0131f\u0131rla") : null));
  }
  if (done) {
    return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between mb-4"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Konular"
    }), /*#__PURE__*/React.createElement(ThemeBtn, {
      isDark: props.isDark,
      onClick: props.toggleDark
    })), /*#__PURE__*/React.createElement("article", {
      className: "study-card fade-in"
    }, /*#__PURE__*/React.createElement("header", {
      className: "study-card-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "study-card-kicker"
    }, props.ders), /*#__PURE__*/React.createElement("h2", {
      className: "study-card-title"
    }, kLabel(props.konu), " \xB7 Bitti")), /*#__PURE__*/React.createElement("div", {
      className: "note-progress"
    }, score, "/", items.length)), /*#__PURE__*/React.createElement("div", {
      className: "study-card-body text-center py-8"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-4xl font-black mb-2"
    }, Math.round(score / items.length * 100), "%"), /*#__PURE__*/React.createElement("p", {
      className: "text-stone-500"
    }, score, " do\u011Fru \xB7 ", items.length - score, " yanl\u0131\u015F"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-3"
    }, leftCloze ? leftCloze + " boşluk kaldı" : "Doğru çözülenler bir daha gelmez. Konuyu sıfırlarsan tekrar gelir.")), /*#__PURE__*/React.createElement("footer", {
      className: "study-card-foot"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Konular"
    }), leftCloze ? /*#__PURE__*/React.createElement("button", {
      onClick: props.onAgain,
      className: "btn-primary text-white px-5 py-2.5 rounded-full font-semibold"
    }, "Devam et") : /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        StudentStore.resetCloze(props.ders, props.konu);
        if (props.onAgain) props.onAgain();
      },
      className: "btn-primary text-white px-5 py-2.5 rounded-full font-semibold"
    }, "S\u0131f\u0131rla"))));
  }
  const it = items[idx];
  const ok = picked && picked.toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Konular"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("article", {
    className: "study-card fade-in"
  }, /*#__PURE__*/React.createElement("header", {
    className: "study-card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "study-card-kicker"
  }, props.ders), /*#__PURE__*/React.createElement("h2", {
    className: "study-card-title"
  }, kLabel(props.konu), " \xB7 Bo\u015Fluk")), /*#__PURE__*/React.createElement("div", {
    className: "note-progress"
  }, idx + 1, "/", items.length)), /*#__PURE__*/React.createElement("div", {
    className: "study-card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cloze-stem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cloze-stem-bar",
    "aria-hidden": "true"
  }), it.hint ? /*#__PURE__*/React.createElement("p", {
    className: "cloze-hint"
  }, it.hint) : null, /*#__PURE__*/React.createElement("p", {
    className: "cloze-stem-text"
  }, clozePromptNodes(it.prompt, picked ? it.answer : "", ok))), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-2.5 mt-5"
  }, (it.choices || []).map(function (c, ci) {
    var isP = picked === c;
    var isA = String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
    var cls = "option-btn w-full text-left px-4 py-3 rounded-2xl border font-medium ";
    if (!picked) cls += "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-600";else if (isA) cls += "bg-emerald-50 border-emerald-400 text-emerald-900";else if (isP) cls += "bg-rose-50 border-rose-400 text-rose-900";else cls += "bg-stone-50 border-stone-200 opacity-55";
    return /*#__PURE__*/React.createElement("button", {
      key: ci + "-" + c,
      disabled: !!picked,
      onClick: function () {
        if (picked) return;
        setPicked(c);
        if (String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR")) {
          setScore(score + 1);
          StudentStore.markClozeSolved(props.ders, props.konu, it.id);
        }
      },
      className: cls
    }, clozeChoiceLabel(c));
  })), picked ? /*#__PURE__*/React.createElement("p", {
    className: "cloze-verdict " + (ok ? "is-ok" : "is-bad")
  }, ok ? "Doğru." : "Doğrusu: " + it.answer) : null), /*#__PURE__*/React.createElement("footer", {
    className: "study-card-foot",
    ref: footRef,
    style: {
      scrollMarginBottom: "calc(var(--app-tabbar-h) + 16px)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-400"
  }, score, " do\u011Fru"), /*#__PURE__*/React.createElement("button", {
    disabled: !picked,
    onClick: function () {
      if (idx + 1 >= items.length) setDone(true);else {
        setIdx(idx + 1);
        setPicked(null);
      }
    },
    className: "btn-primary text-white px-5 py-2.5 rounded-full font-semibold " + (!picked ? "opacity-40 pointer-events-none" : "")
  }, idx + 1 >= items.length ? "Bitir" : "Sonraki"))));
}
function MapTopics(props) {
  const quiz = window.MapQuiz;
  const tree = quiz && quiz.TREE || [];
  return /*#__PURE__*/React.createElement(Shell, {
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Al\u0131\u015Ft\u0131rmalar"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-black tracking-tight gradient-text"
  }, "Harita oyunu"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1 mb-6"
  }, "KPSS fiziki \xB7 iklim \xB7 n\xFCfus \xB7 maden \xB7 ula\u015F\u0131m. Konuyu se\xE7, 6\u20138 ismi haritadaki pinlere b\u0131rak."), tree.map(function (g) {
    return /*#__PURE__*/React.createElement("div", {
      key: g.id,
      className: "mb-6"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-sm font-black uppercase tracking-widest text-stone-400 mb-2"
    }, g.icon, " ", g.title), /*#__PURE__*/React.createElement("div", {
      className: "wide-grid is-tight"
    }, g.kids.map(function (k) {
      var n = quiz ? quiz.countFor(k.id) : 0;
      var hoverImg = k.hoverImg;
      return /*#__PURE__*/React.createElement("button", {
        key: k.id,
        type: "button",
        onClick: function () {
          props.onTopic(k.id);
        },
        className: "text-left p-4 rounded-2xl glass card-hover" + (hoverImg ? " map-topic-card--photo" : "")
      }, hoverImg ? /*#__PURE__*/React.createElement("span", {
        className: "map-topic-card-photo",
        "aria-hidden": "true",
        style: {
          backgroundImage: "url(" + hoverImg + ")"
        }
      }) : null, /*#__PURE__*/React.createElement("div", {
        className: "map-topic-card-fg relative z-10 font-bold"
      }, hoverImg ? k.title : k.icon + " " + k.title), /*#__PURE__*/React.createElement("div", {
        className: "map-topic-card-meta relative z-10 text-xs text-stone-400 mt-1"
      }, n, " hedef"));
    })));
  }));
}
function MapPlay(props) {
  const quiz = window.MapQuiz;
  const meta = quiz ? quiz.topicMeta(props.topicId) : null;
  // Konunun tüm hedefleri tek oyunda, karışık sırayla sorulur.
  const round = useMemo(function () {
    if (!quiz || !quiz.pickPlaceRound) return {
      items: [],
      chips: []
    };
    return quiz.pickPlaceRound(props.topicId);
  }, [props.seed, props.topicId]);
  const total = round.items.length;
  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState({}); // pinId -> "ok" | "shown"
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState(null);
  const [hit, setHit] = useState(null);
  const [done, setDone] = useState(false);
  const [svgHtml, setSvgHtml] = useState("");
  const [mapFail, setMapFail] = useState(false);
  const hostRef = useRef(null);
  const stageRef = useRef(null);
  const zoomRef = useRef({
    s: 1,
    x: 0,
    y: 0
  });
  const solvedRef = useRef({});
  const targetRef = useRef(null);
  const flashTimer = useRef(null);
  const fitKeyRef = useRef("");
  const lastRef = useRef(null);
  const target = round.items[idx] || null;
  targetRef.current = target;
  useEffect(function () {
    setIdx(0);
    setSolved({});
    solvedRef.current = {};
    setMisses(0);
    setFlash(null);
    setHit(null);
    setDone(false);
    zoomRef.current = {
      s: 1,
      x: 0,
      y: 0
    };
    fitKeyRef.current = "";
    if (hostRef.current) hostRef.current.style.transform = "translate(0px, 0px) scale(1)";
  }, [props.seed, props.topicId]);
  useEffect(function () {
    var gone = false;
    fetch("svg/tr.svg?v=4").then(function (r) {
      return r.ok ? r.text() : Promise.reject();
    }).then(function (txt) {
      if (gone) return;
      var doc = new DOMParser().parseFromString(txt, "image/svg+xml");
      var svg = doc.querySelector("svg");
      if (!svg) throw new Error("svg");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("viewBox", svg.getAttribute("viewBox") || svg.getAttribute("viewbox") || "0 0 1000 422");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("class", "tr-map");
      svg.setAttribute("aria-label", "Türkiye haritası");
      setSvgHtml(svg.outerHTML);
    }).catch(function () {
      if (!gone) setMapFail(true);
    });
    return function () {
      gone = true;
    };
  }, []);

  // ---- yakınlaştır / kaydır ----
  useEffect(function () {
    var stage = stageRef.current;
    var canvas = hostRef.current;
    if (!stage || !canvas || mapFail || done) return;
    var gest = {
      mode: "",
      x: 0,
      y: 0,
      dist: 0,
      s0: 1,
      x0: 0,
      y0: 0,
      moved: false
    };
    function apply(s, x, y) {
      s = Math.max(1, Math.min(5, s));
      if (s <= 1.02) {
        s = 1;
        x = 0;
        y = 0;
      }
      zoomRef.current = {
        s: s,
        x: x,
        y: y
      };
      canvas.style.transform = "translate(" + x + "px, " + y + "px) scale(" + s + ")";
    }
    function pinchDist(touches) {
      var a = touches[0],
        b = touches[1];
      var dx = a.clientX - b.clientX,
        dy = a.clientY - b.clientY;
      return Math.sqrt(dx * dx + dy * dy) || 1;
    }
    function onTouchStart(e) {
      if (e.touches.length === 2) {
        gest.mode = "pinch";
        gest.dist = pinchDist(e.touches);
        gest.s0 = zoomRef.current.s;
        gest.x0 = zoomRef.current.x;
        gest.y0 = zoomRef.current.y;
        gest.moved = true;
      } else if (e.touches.length === 1) {
        gest.mode = "pan";
        gest.x = e.touches[0].clientX;
        gest.y = e.touches[0].clientY;
        gest.x0 = zoomRef.current.x;
        gest.y0 = zoomRef.current.y;
        gest.moved = false;
      } else gest.mode = "";
    }
    function onTouchMove(e) {
      if (gest.mode === "pinch" && e.touches.length === 2) {
        e.preventDefault();
        apply(gest.s0 * (pinchDist(e.touches) / gest.dist), gest.x0, gest.y0);
      } else if (gest.mode === "pan" && e.touches.length === 1 && zoomRef.current.s > 1) {
        var dx = e.touches[0].clientX - gest.x;
        var dy = e.touches[0].clientY - gest.y;
        if (Math.abs(dx) + Math.abs(dy) > 10) gest.moved = true;
        if (gest.moved) {
          e.preventDefault();
          apply(zoomRef.current.s, gest.x0 + dx, gest.y0 + dy);
        }
      }
    }
    function onTouchEnd() {
      if (gest.moved) stage.setAttribute("data-skip-click", "1");
      gest.mode = "";
    }
    function onWheel(e) {
      e.preventDefault();
      var z = zoomRef.current;
      apply(z.s * (e.deltaY > 0 ? 0.88 : 1.14), z.x, z.y);
    }
    stage.addEventListener("touchstart", onTouchStart, {
      passive: true
    });
    stage.addEventListener("touchmove", onTouchMove, {
      passive: false
    });
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("wheel", onWheel, {
      passive: false
    });
    apply(zoomRef.current.s, zoomRef.current.x, zoomRef.current.y);
    return function () {
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("wheel", onWheel);
    };
  }, [svgHtml, mapFail, done]);
  function bumpZoom(dir) {
    var z = zoomRef.current;
    var s = dir === 0 ? 1 : z.s * (dir > 0 ? 1.4 : 0.72);
    var x = dir === 0 ? 0 : z.x;
    var y = dir === 0 ? 0 : z.y;
    if (s <= 1.02) {
      s = 1;
      x = 0;
      y = 0;
    }
    s = Math.max(1, Math.min(5, s));
    zoomRef.current = {
      s: s,
      x: x,
      y: y
    };
    if (hostRef.current) hostRef.current.style.transform = "translate(" + x + "px, " + y + "px) scale(" + s + ")";
  }
  function advance(nextSolved) {
    var i = idx + 1;
    while (i < total && nextSolved[round.items[i].id]) i++;
    if (i >= total) setTimeout(function () {
      setDone(true);
    }, 420);
    setIdx(i);
  }

  // Dokunulan noktaya en yakın pini seç: üst üste binen hedeflerde yanlış pine gitmesin.
  function nearestPin(x, y) {
    var host = hostRef.current;
    if (!host) return null;
    var best = null,
      bestD = Infinity;
    Array.prototype.forEach.call(host.querySelectorAll("[data-pin]"), function (n) {
      var ring = n.querySelector(".place-well") || n;
      var r = ring.getBoundingClientRect();
      var cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      var d = Math.sqrt((cx - x) * (cx - x) + (cy - y) * (cy - y));
      var reach = Math.max(24, r.width * 1.1);
      if (d <= reach && d < bestD) {
        bestD = d;
        best = n.getAttribute("data-pin");
      }
    });
    return best;
  }
  function answer(pinId) {
    var t = targetRef.current;
    if (!t || done) return;
    if (solvedRef.current[pinId]) return;
    if (pinId === t.id) {
      var next = Object.assign({}, solvedRef.current);
      next[pinId] = "ok";
      solvedRef.current = next;
      lastRef.current = pinId;
      setSolved(next);
      setHit(pinId);
      setTimeout(function () {
        setHit(null);
      }, 500);
      advance(next);
      return;
    }
    setMisses(function (m) {
      return m + 1;
    });
    setFlash(pinId);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(function () {
      setFlash(null);
    }, 620);
  }
  function reveal() {
    var t = targetRef.current;
    if (!t || done) return;
    var next = Object.assign({}, solvedRef.current);
    next[t.id] = "shown";
    solvedRef.current = next;
    lastRef.current = t.id;
    setSolved(next);
    setMisses(function (m) {
      return m + 1;
    });
    advance(next);
  }

  // ---- pinleri çiz ----
  useEffect(function () {
    var el = hostRef.current;
    if (!el || !svgHtml || done) return;
    var svg = el.querySelector("svg");
    if (!svg) return;
    svg.setAttribute("viewBox", "0 0 1000 422");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    var built = quiz && quiz.topicLayerFromSvg ? quiz.topicLayerFromSvg(svg, props.topicId) : {
      pins: []
    };
    var want = {};
    round.items.forEach(function (it) {
      want[it.id] = true;
    });
    var pins = (built.pins || []).filter(function (p) {
      return want[p.id];
    });
    var old = svg.querySelector("g.topic-dots");
    if (old) old.remove();
    var oldLabs = svg.querySelector("g.map-float-labels");
    if (oldLabs) oldLabs.remove();

    // Son işaretlenen yerin illeri haritada vurgulanır: cevabın gerçek alanı görülsün.
    var lastPin = null;
    pins.forEach(function (p) {
      if (p.id === lastRef.current && solved[p.id]) lastPin = p;
    });
    var hl = {};
    (lastPin && lastPin.codes || []).forEach(function (c) {
      hl[c] = true;
    });
    Array.prototype.forEach.call(el.querySelectorAll("path[id]"), function (pth) {
      pth.setAttribute("class", hl[pth.getAttribute("id")] ? "map-stage map-hl" : "map-stage");
    });
    var NS = "http://www.w3.org/2000/svg";
    function mk(tag, attrs) {
      var n = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) {
        n.setAttribute(k, String(attrs[k]));
      });
      return n;
    }
    var dots = mk("g", {
      "class": "topic-dots"
    });
    pins.forEach(function (pin) {
      var state = solved[pin.id];
      var wrap = mk("g", {
        "data-pin": pin.id,
        "class": "topic-mark place-mark" + (state === "ok" ? " place-ok" : "") + (state === "shown" ? " place-shown" : "") + (flash === pin.id ? " place-miss" : "") + (hit === pin.id ? " place-hit" : "")
      });
      // işaret yana alındıysa gerçek noktaya bağla
      if (pin.off) {
        wrap.appendChild(mk("line", {
          x1: pin.ax,
          y1: pin.ay,
          x2: pin.x,
          y2: pin.y,
          "class": "place-leader"
        }));
        wrap.appendChild(mk("circle", {
          cx: pin.ax,
          cy: pin.ay,
          r: 2.2,
          "class": "place-anchor"
        }));
      }
      wrap.appendChild(mk("circle", {
        cx: pin.x,
        cy: pin.y,
        r: state ? 10 : 13,
        "class": "place-well-core" + (state ? " is-locked" : "")
      }));
      wrap.appendChild(mk("circle", {
        cx: pin.x,
        cy: pin.y,
        r: 9,
        "class": "place-well"
      }));
      if (state === "ok") {
        wrap.appendChild(mk("path", {
          d: "M" + (pin.x - 4) + " " + (pin.y + 0.2) + " l2.8 2.9 l5.4 -6",
          "class": "place-check"
        }));
      } else if (state === "shown") {
        wrap.appendChild(mk("circle", {
          cx: pin.x,
          cy: pin.y,
          r: 2.6,
          "class": "place-dot is-shown"
        }));
      } else {
        wrap.appendChild(mk("circle", {
          cx: pin.x,
          cy: pin.y,
          r: 2.6,
          "class": "place-dot"
        }));
      }
      wrap.appendChild(mk("circle", {
        cx: pin.x,
        cy: pin.y,
        r: 20,
        "class": "topic-hit"
      }));
      dots.appendChild(wrap);
    });
    svg.appendChild(dots);

    // ilk açılışta tüm hedeflere yakınlaş (küçük ekranda pinler görünür olsun)
    var fitKey = props.seed + "|" + props.topicId;
    var stageEl = stageRef.current;
    if (fitKeyRef.current !== fitKey && stageEl && pins.length) {
      fitKeyRef.current = fitKey;
      var W = stageEl.clientWidth,
        H = stageEl.clientHeight;
      if (W > 0 && H > 0) {
        var k = Math.min(W / 1000, H / 422);
        var pad = 50;
        var xs = pins.map(function (p) {
          return p.x;
        }).concat(pins.map(function (p) {
          return p.ax;
        }));
        var ys = pins.map(function (p) {
          return p.y;
        }).concat(pins.map(function (p) {
          return p.ay;
        }));
        var mnx = Math.min.apply(null, xs) - pad,
          mxx = Math.max.apply(null, xs) + pad;
        var mny = Math.min.apply(null, ys) - pad,
          mxy = Math.max.apply(null, ys) + pad;
        var sFit = Math.min(W / ((mxx - mnx) * k), H / ((mxy - mny) * k));
        var sMax = Math.max(1, 16 / (14 * k));
        var s = Math.max(1, Math.min(sFit, sMax, 3.2));
        if (s > 1.15) {
          var bx = (W - 1000 * k) / 2 + k * (mnx + mxx) / 2;
          var by = (H - 422 * k) / 2 + k * (mny + mxy) / 2;
          var tx = -s * (bx - W / 2),
            ty = -s * (by - H / 2);
          zoomRef.current = {
            s: s,
            x: tx,
            y: ty
          };
          el.style.transform = "translate(" + tx + "px, " + ty + "px) scale(" + s + ")";
        }
      }
    }
    var labels = document.createElementNS("http://www.w3.org/2000/svg", "g");
    labels.setAttribute("class", "map-float-labels");
    pins.forEach(function (pin) {
      var state = solved[pin.id];
      // Ad etiketi yalnız son işaretlenen pinde; hepsi birden yazınca harita okunmuyor.
      if (!state || pin.id !== lastRef.current) return;
      var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", String(pin.x));
      t.setAttribute("y", String(pin.y - 16));
      t.setAttribute("class", "map-pin " + (state === "ok" ? "map-pin-ok" : "map-pin-done"));
      t.setAttribute("font-size", "14");
      t.textContent = pin.name;
      labels.appendChild(t);
    });
    svg.appendChild(labels);
    function onClick(ev) {
      if (stageRef.current && stageRef.current.getAttribute("data-skip-click") === "1") {
        stageRef.current.removeAttribute("data-skip-click");
        return;
      }
      var near = nearestPin(ev.clientX, ev.clientY);
      if (near) {
        answer(near);
        return;
      }
      var n = ev.target.closest ? ev.target.closest("[data-pin]") : null;
      if (!n) return;
      answer(n.getAttribute("data-pin"));
    }
    el.addEventListener("click", onClick);
    return function () {
      el.removeEventListener("click", onClick);
    };
  }, [svgHtml, solved, flash, hit, round, done, idx, props.topicId]);
  useEffect(function () {
    return function () {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);
  if (!quiz || !total) {
    return /*#__PURE__*/React.createElement(Shell, {
      wide: true
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Konular"
    }), /*#__PURE__*/React.createElement("p", {
      className: "mt-8 text-center text-stone-400"
    }, "Bu konuda hedef yok."));
  }
  if (done) {
    var okN = Object.keys(solved).filter(function (id) {
      return solved[id] === "ok";
    }).length;
    var pct = total ? Math.round(okN / total * 100) : 0;
    return /*#__PURE__*/React.createElement(Shell, {
      wide: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between mb-4"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Konular"
    }), /*#__PURE__*/React.createElement(ThemeBtn, {
      isDark: props.isDark,
      onClick: props.toggleDark
    })), /*#__PURE__*/React.createElement("article", {
      className: "study-card fade-in"
    }, /*#__PURE__*/React.createElement("header", {
      className: "study-card-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "study-card-kicker"
    }, "Harita bitti"), /*#__PURE__*/React.createElement("h2", {
      className: "study-card-title"
    }, meta ? meta.title : "Harita")), /*#__PURE__*/React.createElement("div", {
      className: "note-progress"
    }, okN, "/", total)), /*#__PURE__*/React.createElement("div", {
      className: "study-card-body py-6"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-4xl font-black mb-1 text-center"
    }, "%", pct), /*#__PURE__*/React.createElement("p", {
      className: "text-stone-500 text-center"
    }, okN, " do\u011Fru \xB7 ", total - okN, " ka\xE7t\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-2 text-center"
    }, misses ? misses + " yanlış deneme" : "Tek hata yok, tam isabet."), /*#__PURE__*/React.createElement("ul", {
      className: "map-result-list"
    }, round.items.map(function (it) {
      var ok = solved[it.id] === "ok";
      return /*#__PURE__*/React.createElement("li", {
        key: it.id,
        className: ok ? "is-ok" : "is-miss"
      }, /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true"
      }, ok ? "✓" : "•"), it.name);
    }))), /*#__PURE__*/React.createElement("footer", {
      className: "study-card-foot"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Konular"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: props.onAgain,
      className: "btn-primary text-white px-5 py-2.5 rounded-full font-semibold"
    }, "Tekrar oyna"))));
  }
  var okCount = Object.keys(solved).filter(function (id) {
    return solved[id] === "ok";
  }).length;
  var pctBar = total ? Math.round(Object.keys(solved).length / total * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "map-play-root map-place"
  }, /*#__PURE__*/React.createElement("header", {
    className: "map-play-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-play-bar"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Konular"
  }), /*#__PURE__*/React.createElement("div", {
    className: "note-progress shrink-0"
  }, okCount, "/", total), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("p", {
    className: "map-play-kicker"
  }, meta ? (meta.hoverImg ? "" : meta.icon + " ") + meta.title : "Harita"), /*#__PURE__*/React.createElement("div", {
    className: "map-progress",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pctBar + "%"
    }
  }))), !mapFail ? /*#__PURE__*/React.createElement("div", {
    className: "map-play-stage tr-map-wrap",
    ref: stageRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-relief",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "map-play-canvas",
    ref: hostRef,
    dangerouslySetInnerHTML: {
      __html: svgHtml
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "map-zoom-tools",
    "aria-label": "Haritay\u0131 yak\u0131nla\u015Ft\u0131r"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      bumpZoom(1);
    },
    "aria-label": "Yak\u0131nla\u015Ft\u0131r"
  }, "+"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      bumpZoom(-1);
    },
    "aria-label": "Uzakla\u015Ft\u0131r"
  }, "\u2212"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "map-zoom-reset",
    onClick: function () {
      bumpZoom(0);
    }
  }, "Tam"))) : /*#__PURE__*/React.createElement("div", {
    className: "map-play-stage p-4 overflow-auto"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-center text-stone-300 py-10"
  }, "Harita y\xFCklenemedi. Ba\u011Flant\u0131n\u0131 kontrol edip tekrar dene.")), /*#__PURE__*/React.createElement("footer", {
    className: "map-play-foot map-ask"
  }, /*#__PURE__*/React.createElement("p", {
    className: "map-ask-kicker"
  }, "Haritada bul ve dokun"), /*#__PURE__*/React.createElement("p", {
    className: "map-ask-name"
  }, target ? target.name : ""), target && target.prompt ? /*#__PURE__*/React.createElement("p", {
    className: "map-ask-hint"
  }, target.prompt) : null, /*#__PURE__*/React.createElement("div", {
    className: "map-ask-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "map-ask-skip",
    onClick: reveal
  }, "Bilmiyorum, g\xF6ster"), /*#__PURE__*/React.createElement("span", {
    className: "map-ask-meta"
  }, misses ? misses + " yanlış" : "Hatasız"))));
}
function DersHome(props) {
  const kpssData = props.kpssData;
  const stats = StudyPlanner.catalogStats(kpssData);
  var groups = window.AlanCatalog && window.AlanCatalog.groupCatalogDersler ? window.AlanCatalog.groupCatalogDersler(kpssData) : [{
    id: "all",
    title: "",
    dersler: Object.keys(kpssData)
  }];
  var labelOf = window.AlanCatalog && window.AlanCatalog.dersLabel ? window.AlanCatalog.dersLabel : function (d) {
    return d;
  };
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "slide-up"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text"
  }, "Dersler"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "Not oku, test \xE7\xF6z. T\xFCm konular a\xE7\u0131k.")), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, groups.map(function (g) {
    var cards = g.dersler.map(function (ders) {
      const t = themeFor(ders, props.isDark);
      const s = stats[ders] || {
        konuSayisi: 0,
        soruSayisi: 0
      };
      if (!s.konuSayisi && !s.soruSayisi) return null;
      return /*#__PURE__*/React.createElement("button", {
        key: ders,
        onClick: function () {
          props.onDers(ders);
        },
        className: "w-full text-left p-5 rounded-3xl glass card-hover flex items-center gap-5 group"
      }, /*#__PURE__*/React.createElement("div", {
        className: "h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl shrink-0"
      }, t.icon), /*#__PURE__*/React.createElement("div", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "font-bold text-stone-800 dark:text-stone-100 text-lg"
      }, labelOf(ders)), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-400"
      }, s.konuSayisi, " konu \xB7 ", s.soruSayisi, " soru")), /*#__PURE__*/React.createElement("span", {
        className: "text-stone-300 group-hover:text-indigo-500 transition-colors text-xl"
      }, "\u2192"));
    }).filter(Boolean);
    if (!cards.length) return null;
    return /*#__PURE__*/React.createElement("section", {
      key: g.id
    }, g.title ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-3"
    }, g.title) : null, /*#__PURE__*/React.createElement("div", {
      className: "wide-grid"
    }, cards));
  })), function () {
    var edu = props.student && props.student.userProfile && props.student.userProfile.educationLevel;
    if (edu && edu !== "lisans") return null;
    var cfg = window.KpssConfig || {};
    var tt = props.student && props.student.userProfile && props.student.userProfile.targetType || "B";
    var ids = cfg.targetModules && cfg.targetModules[tt] || ["gygk"];
    var mods = (cfg.modules || []).filter(function (m) {
      return ids.indexOf(m.id) >= 0 && m.id !== "gygk" && !m.ready;
    });
    if (!mods.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-10"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDE80"), " Kulvar\u0131n di\u011Fer mod\xFClleri"), /*#__PURE__*/React.createElement("div", {
      className: "wide-grid"
    }, mods.map(function (m) {
      return /*#__PURE__*/React.createElement("div", {
        key: m.id,
        className: "p-5 rounded-3xl glass card-hover flex items-center justify-between"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        className: "font-bold"
      }, m.title), /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-stone-400 mt-0.5"
      }, (m.lessons || []).slice(0, 3).join(" · ") || "İçerik bekleniyor")), /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      }, "Yak\u0131nda"));
    })));
  }());
}
function KonuList(props) {
  const ders = props.ders;
  const t = themeFor(ders, props.isDark);
  const konular = Object.keys(props.kpssData[ders] || {}).filter(function (k) {
    return k !== "_";
  });
  const topics = props.student && props.student.topics && props.student.topics[ders] || {};
  var dersTitle = window.AlanCatalog && window.AlanCatalog.dersLabel ? window.AlanCatalog.dersLabel(ders) : ders;
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Dersler"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl ders-icon flex items-center justify-center text-2xl"
  }, t.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-black"
  }, dersTitle), /*#__PURE__*/React.createElement("p", {
    className: "text-zinc-500 text-sm"
  }, "S\u0131rayla ilerle. Konunun t\xFCm testleri bitince sonraki a\xE7\u0131l\u0131r."))), /*#__PURE__*/React.createElement("div", {
    className: "wide-grid"
  }, konular.map(function (konu, idx) {
    const kd = props.kpssData[ders][konu] || {};
    const stored = topics[konu];
    const tp = stored || {
      noteIndex: 0,
      notesDone: false,
      lastPct: null,
      attempts: 0,
      mastery: "yok"
    };
    const m = masteryLabel(tp.mastery);
    const nLen = (kd.notlar || []).length;
    const notePct = !nLen ? 0 : tp.notesDone ? 100 : !stored ? 0 : Math.round((tp.noteIndex + 1) / nLen * 100);
    const heat = tp.mastery === "zayif" ? "heat-zayif" : tp.mastery === "orta" ? "heat-orta" : tp.mastery === "iyi" ? "heat-iyi" : "";
    const open = StudentStore.isKonuOpen(ders, konular, idx, props.kpssData);
    const done = StudentStore.topicComplete(tp, kd);
    return /*#__PURE__*/React.createElement("button", {
      key: konu,
      disabled: !open,
      onClick: function () {
        if (open) props.onKonu(konu);
      },
      className: "w-full text-left p-5 panel rounded-3xl " + (open ? heat : "opacity-45")
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-10 w-10 rounded-xl flex items-center justify-center font-stat text-sm shrink-0 " + (done ? "bg-emerald-50 text-emerald-600" : open ? "bg-stone-100 text-stone-700" : "bg-stone-100 text-stone-400")
    }, done ? "✓" : open ? idx + 1 : "🔒"), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-bold text-slate-800 dark:text-slate-100"
    }, kLabel(konu)), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-400 mt-1"
    }, open ? function () {
      var packs = StudentStore.topicTestPacks(kd.sorular || []);
      var nLen = (kd.notlar || []).length;
      if (!packs.length) return nLen + " not · " + (kd.sorular || []).length + " soru";
      var doneN = packs.filter(function (p) {
        return StudentStore.isPackComplete(tp, p.no);
      }).length;
      return nLen + " not · " + doneN + "/" + packs.length + " test";
    }() : "Önce önceki konunun testlerini bitir"))), open ? /*#__PURE__*/React.createElement("div", {
      className: "text-right shrink-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-black text-sm"
    }, tp.lastPct == null ? "—" : "%" + tp.lastPct), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold px-2 py-0.5 rounded-full " + m.cls
    }, m.text)) : null));
  })));
}
function KonuHub(props) {
  const kd = props.konuData;
  const notlar = kd.notlar || [];
  const sorular = kd.sorular || [];
  const packs = StudentStore.topicTestPacks(sorular);
  const tp = StudentStore.getTopic(props.ders, props.konu);
  const m = masteryLabel(tp.mastery);
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Konular"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-black mb-2"
  }, kLabel(props.konu)), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 mb-2"
  }, props.ders), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-8"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-3 py-1 rounded-full " + m.cls
  }, m.text), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700"
  }, "Son net ", tp.lastPct == null ? "yok" : "%" + tp.lastPct), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700"
  }, tp.attempts, " deneme")), /*#__PURE__*/React.createElement("button", {
    onClick: props.onNotes,
    className: "group w-full text-left p-7 mb-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 border border-amber-200 rounded-3xl shadow-lg card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl mb-4"
  }, "\uD83D\uDCD6"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-amber-900 dark:text-amber-100 mb-2"
  }, "Konu \xF6zeti"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-amber-700"
  }, notlar.length, " hap not \xB7 ", tp.notesDone ? "tamamlandı" : "kaldığın yerden")), window.ClozeEngine && window.ClozeEngine.dersEnabled(props.ders) && tp.solvedCloze && tp.solvedCloze.length ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      if (!window.confirm("Bu konudaki çözülen boşluklar baştan gelsin mi?")) return;
      StudentStore.resetCloze(props.ders, props.konu);
    },
    className: "w-full mb-5 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-600 dark:text-stone-300"
  }, "Bo\u015Fluklar\u0131 s\u0131f\u0131rla") : null, packs.length ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-3"
  }, sorular.length, " soru \xB7 25\u2019lik testler \xB7 s\u0131rayla bitir"), /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-2 gap-4"
  }, packs.map(function (p, pi) {
    var packDone = StudentStore.isPackComplete(tp, p.no);
    var packOpen = StudentStore.isPackOpen(tp, p.no);
    return /*#__PURE__*/React.createElement("button", {
      key: p.no,
      disabled: !packOpen,
      onClick: function () {
        if (packOpen) props.onTest(pi);
      },
      className: "group text-left p-6 border rounded-3xl " + (packDone ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200" : packOpen ? "bg-stone-50 dark:bg-stone-900 border-stone-300 card-hover" : "bg-stone-50 dark:bg-stone-900 border-stone-200 opacity-45")
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black mb-3 " + (packDone ? "bg-emerald-500" : "bg-gradient-to-br from-indigo-600 to-purple-600")
    }, packDone ? "✓" : p.no), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-bold text-stone-900 dark:text-stone-50 mb-1"
    }, "Test ", p.no, p.sekilli ? " · Şekilli sorular" : ""), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500"
    }, packDone ? "Çözüldü" : packOpen ? p.items.length + " soru" : "Önce Test " + (p.no - 1) + "’i bitir"));
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400"
  }, "Bu konuya ait hen\xFCz soru yok."));
}
function looksHeadingText(text) {
  var t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t || t.length > 80) return false;
  if (/[:：]\s+\S{8,}/.test(t)) return false;
  return true;
}
function hasBlockChild(html) {
  return /<(ul|ol|table|img|p|h[1-6])\b/i.test(String(html || ""));
}
function promoteNoteHeadings(root) {
  Array.prototype.slice.call(root.querySelectorAll("span.inline-flex")).forEach(function (sp) {
    var h = document.createElement("h3");
    h.className = "note-title";
    h.innerHTML = sp.innerHTML;
    sp.parentNode.replaceChild(h, sp);
  });
  Array.prototype.slice.call(root.querySelectorAll("p, div")).forEach(function (el) {
    if (el.querySelector("ul,ol,table,img,p,h3,h4,h5")) return;
    var cls = String(el.getAttribute("class") || "");
    var text = (el.textContent || "").replace(/\s+/g, " ").trim();
    var boldish = /font-bold|font-black|tracking-wider/.test(cls);
    var onlyLabel = el.children.length <= 1 && el.querySelector("b,strong") && text.length <= 80 && !/[:：]\s+\S{8,}/.test(text);
    if (!(boldish || onlyLabel) || !looksHeadingText(text)) return;
    var h = document.createElement("h4");
    h.className = "note-sub";
    h.innerHTML = el.innerHTML;
    el.parentNode.replaceChild(h, el);
  });
}
function shapeNoteHtml(html) {
  if (typeof document === "undefined") return html;
  var root = document.createElement("div");
  root.innerHTML = String(html || "");
  promoteNoteHeadings(root);
  Array.prototype.slice.call(root.children).forEach(function (el) {
    var tag = el.tagName;
    if (tag === "H3" || tag === "H4" || tag === "H5" || tag === "H6") return;
    if (el.querySelector && el.querySelector("span.inline-flex, h3.note-title")) return;
    if (tag === "UL" || tag === "OL" || tag === "P" || tag === "TABLE") {
      var pack = document.createElement("div");
      pack.className = "note-pack";
      el.parentNode.insertBefore(pack, el);
      pack.appendChild(el);
    }
  });
  root.querySelectorAll("li").forEach(function (li) {
    li.classList.add("note-chip");
  });
  root.querySelectorAll(".flex-wrap > span, [class*='flex-wrap'] > span").forEach(function (sp) {
    if (sp.classList.contains("inline-flex")) return;
    if (sp.closest && sp.closest("h3,h4,.note-title,.note-sub")) return;
    sp.classList.add("note-chip");
  });
  return root.innerHTML;
}
function NotesView(props) {
  const notlar = props.notlar || [];
  const idx = props.index;
  // ← / → ile sayfa çevir (yazı alanındayken devre dışı)
  useEffect(function () {
    function onKey(e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return;
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        props.onIndex(idx - 1);
      } else if (e.key === "ArrowRight" && idx < notlar.length - 1) {
        e.preventDefault();
        props.onIndex(idx + 1);
      }
    }
    document.addEventListener("keydown", onKey);
    return function () {
      document.removeEventListener("keydown", onKey);
    };
  }, [idx, notlar.length, props.onIndex]);
  return /*#__PURE__*/React.createElement(Shell, {
    wide: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4 gap-3"
  }, /*#__PURE__*/React.createElement(BackBtn, {
    onClick: props.onBack,
    label: "Geri"
  }), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), notlar.length ? /*#__PURE__*/React.createElement("article", {
    className: "study-card fade-in"
  }, /*#__PURE__*/React.createElement("header", {
    className: "study-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, props.ders ? /*#__PURE__*/React.createElement("p", {
    className: "study-card-kicker"
  }, props.ders) : null, /*#__PURE__*/React.createElement("h2", {
    className: "study-card-title"
  }, kLabel(props.konu), " \xB7 \xD6zet")), /*#__PURE__*/React.createElement("div", {
    className: "note-progress"
  }, idx + 1, "/", notlar.length)), /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "study-card-body note-html text-[16px] leading-relaxed" + (props.ders === "Geometri" ? " note-math" : ""),
    dangerouslySetInnerHTML: {
      __html: shapeNoteHtml(notlar[idx])
    }
  }), /*#__PURE__*/React.createElement("footer", {
    className: "study-card-foot"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: idx === 0,
    onClick: function () {
      props.onIndex(idx - 1);
    },
    className: "back-btn " + (idx === 0 ? "opacity-30 pointer-events-none" : "")
  }, /*#__PURE__*/React.createElement("svg", {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2.25,
    d: "M15 19l-7-7 7-7"
  })), /*#__PURE__*/React.createElement("span", null, "\xD6nceki")), idx === notlar.length - 1 ? /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      if (props.ders && props.konu) StudentStore.markNotesComplete(props.ders, props.konu);
      if (props.hasTest) props.onTest();else props.onBack();
    },
    className: "btn-primary text-white px-5 py-2.5 rounded-full font-semibold"
  }, props.hasTest ? "Teste geç" : "Konuyu bitir") : /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onIndex(idx + 1);
    },
    className: "btn-primary text-white px-5 py-2.5 rounded-full font-semibold inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", null, "Sonraki"), /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2.25,
    d: "M9 5l7 7-7 7"
  })))), /*#__PURE__*/React.createElement("p", {
    className: "kbd-hint study-card-keys",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", null, "\u2190"), " \xF6nceki"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", null, "\u2192"), " sonraki"))) : /*#__PURE__*/React.createElement("div", {
    className: "text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed"
  }, "Bu konu i\xE7in hen\xFCz not yok."));
}
function TestView(props) {
  const items = props.session.items;
  const qIndex = props.qIndex;
  const item = items[qIndex] || {
    q: {
      question: "",
      options: [],
      correctAnswerIndex: 0,
      explanation: ""
    }
  };
  const soru = item.q;
  const progress = (qIndex + 1) / (items.length || 1) * 100;
  const timed = props.session.secondsLeft != null;
  const mm = timed ? Math.floor(props.session.secondsLeft / 60) : 0;
  const ss = timed ? String(props.session.secondsLeft % 60).padStart(2, "0") : "";
  const tLeft = props.session.secondsLeft;
  const tCls = !timed ? "" : tLeft <= 60 ? "text-coral-500" : tLeft <= 300 ? "text-amber-500" : "text-navy-600";
  const nextRef = useRef(null);
  useEffect(function () {
    if (props.answered) revealSoon(nextRef);
  }, [props.answered, qIndex]);
  // Klavye: A–E ya da 1–5 şık seçer; cevaptan sonra Enter / → sonraki soru.
  useEffect(function () {
    function onKey(e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return;
      var n = (soru.options || []).length;
      if (!props.answered) {
        var k = String(e.key || "").toLocaleLowerCase("tr-TR");
        var i = "abcde".indexOf(k);
        if (i < 0) i = "12345".indexOf(k);
        if (k && i >= 0 && i < n) {
          e.preventDefault();
          props.onAnswer(i);
        }
        return;
      }
      // odaktaki düğmede Enter zaten tıklama üretir; iki kez ilerlemesin
      if (e.key === "ArrowRight" || e.key === "Enter" && !(e.target && e.target.tagName === "BUTTON")) {
        e.preventDefault();
        props.onNext();
      }
    }
    document.addEventListener("keydown", onKey);
    return function () {
      document.removeEventListener("keydown", onKey);
    };
  }, [props.answered, props.onAnswer, props.onNext, qIndex, soru]);
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-sm font-bold text-slate-500 mb-4 gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: props.onQuit,
    className: "hover:text-rose-500 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 shrink-0"
  }, "Bitir"), /*#__PURE__*/React.createElement("span", {
    className: "bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 min-w-0 text-right"
  }, props.session.testNo ? "Test " + props.session.testNo + " · " : "", qIndex + 1, "/", items.length, " \xB7 Do\u011Fru ", props.score, timed ? /*#__PURE__*/React.createElement("span", {
    className: "ml-2 font-stat " + tCls
  }, mm, ":", ss) : null)), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mb-4 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-2.5 rounded-full",
    style: {
      width: progress + "%",
      background: "linear-gradient(90deg, #0D2C4D, #1D8A99, #C5A059)"
    }
  })), item.ders ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-400 mb-3"
  }, item.ders, " \xB7 ", kLabel(item.konu)) : null, /*#__PURE__*/React.createElement("div", {
    className: "test-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "test-split-q"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-stem p-4 sm:p-8 rounded-3xl mb-6 relative overflow-hidden fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-stem-bar absolute top-0 left-0 w-1.5 h-full"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold leading-relaxed whitespace-pre-line text-stone-900 pl-2"
  }, soru.question), SoruGorsel(soru)), /*#__PURE__*/React.createElement("p", {
    className: "kbd-hint",
    "aria-hidden": "true"
  }, props.answered ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", null, "Enter"), " ya da ", /*#__PURE__*/React.createElement("kbd", null, "\u2192"), " sonraki soru") : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", null, "A"), "\u2013", /*#__PURE__*/React.createElement("kbd", null, String.fromCharCode(64 + Math.max(1, (soru.options || []).length))), " ya da ", /*#__PURE__*/React.createElement("kbd", null, "1"), "\u2013", /*#__PURE__*/React.createElement("kbd", null, Math.max(1, (soru.options || []).length)), " ile \u015F\u0131k se\xE7"))), /*#__PURE__*/React.createElement("div", {
    className: "test-split-a"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, (soru.options || []).map(function (opt, i) {
    let cls = "w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-semibold transition-all flex items-center gap-3 sm:gap-4 option-btn ";
    let icon = null;
    if (props.answered) {
      if (i === soru.correctAnswerIndex) {
        cls += "bg-emerald-500 border-emerald-500 text-white";
        icon = /*#__PURE__*/React.createElement("svg", {
          className: "w-6 h-6 flex-shrink-0",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        }, /*#__PURE__*/React.createElement("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 3,
          d: "M5 13l4 4L19 7"
        }));
      } else if (i === props.picked) {
        cls += "bg-rose-500 border-rose-500 text-white";
        icon = /*#__PURE__*/React.createElement("svg", {
          className: "w-6 h-6 flex-shrink-0",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        }, /*#__PURE__*/React.createElement("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 3,
          d: "M6 18L18 6M6 6l12 12"
        }));
      } else cls += "bg-slate-50 dark:bg-slate-800/50 border-slate-200 text-slate-400 opacity-60";
    } else {
      cls += "bg-white dark:bg-slate-800 border-slate-200 text-stone-800";
      icon = /*#__PURE__*/React.createElement("span", {
        className: "choice-letter flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
      }, String.fromCharCode(65 + i));
    }
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: function () {
        props.onAnswer(i);
      },
      disabled: props.answered,
      className: cls
    }, icon, /*#__PURE__*/React.createElement("span", {
      className: "text-[15px] min-w-0"
    }, stripChoicePrefix(opt)));
  })), props.answered ? /*#__PURE__*/React.createElement("div", {
    className: "mt-8 space-y-4 fade-in pb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-indigo-50 dark:bg-slate-900 border border-indigo-100 border-l-4 border-l-indigo-600 p-6 rounded-2xl"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-semibold text-indigo-600 dark:text-indigo-400 text-sm mb-2"
  }, "\xC7\xF6z\xFCm notu"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
  }, soru.explanation)), item.ders ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      StudentStore.toggleReviewBook(item.ders, item.konu, item.id);
    },
    className: "w-full p-4 rounded-2xl font-semibold border-2 " + (StudentStore.inReviewBook(item.ders, item.konu, item.id) ? "border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200" : "border-stone-200 bg-white dark:bg-slate-800 text-stone-800")
  }, StudentStore.inReviewBook(item.ders, item.konu, item.id) ? "Tekrardan çıkar" : "Tekrara at") : null, /*#__PURE__*/React.createElement("button", {
    ref: nextRef,
    style: {
      scrollMarginBottom: "24px"
    },
    onClick: props.onNext,
    className: "w-full btn-primary text-white p-5 rounded-2xl font-semibold"
  }, qIndex + 1 === items.length ? "Sonuçları gör" : "Sonraki soru")) : /*#__PURE__*/React.createElement("div", {
    className: "h-8"
  }))));
}
function ResultView(props) {
  const total = props.session.items.length;
  const score = props.score;
  const oran = total ? Math.round(score / total * 100) : 0;
  const yorum = oran >= 85 ? "Mükemmel. Bu konuyu kilitle, zayıf olana geç." : oran >= 60 ? "İyi gidiyorsun. Yanlışları deftere aldık." : oran >= 40 ? "Eşik altı. Notu aç, aynı gün 10 soru daha." : "Önce not. Soru yağmuru şimdi işe yaramaz.";
  const renk = oran >= 85 ? "#10b981" : oran >= 60 ? "#4f46e5" : oran >= 40 ? "#f59e0b" : "#ef4444";
  return /*#__PURE__*/React.createElement(Shell, null, oran >= 85 && /*#__PURE__*/React.createElement(Confetti, null), /*#__PURE__*/React.createElement("div", {
    className: "panel p-8 rounded-3xl text-center fade-in"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-display font-bold mb-2"
  }, props.session && props.session.testNo ? "Test " + props.session.testNo + " bitti" : "Tur bitti"), /*#__PURE__*/React.createElement("p", {
    className: "text-zinc-500 mb-6 text-sm"
  }, yorum), /*#__PURE__*/React.createElement("div", {
    className: "relative mx-auto w-36 h-36 mb-6"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 36 36",
    className: "w-full h-full"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32",
    fill: "none",
    stroke: "#e2e8f0",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32",
    fill: "none",
    stroke: renk,
    strokeWidth: "3",
    strokeDasharray: oran + ", 100",
    strokeLinecap: "round",
    className: "progress-ring"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-stat text-3xl text-indigo-600"
  }, "%", oran))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-2xl bg-slate-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-black text-xl"
  }, total), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-400"
  }, "Soru")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-2xl bg-emerald-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-black text-xl text-emerald-600"
  }, score), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-emerald-500"
  }, "Do\u011Fru")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-2xl bg-rose-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-black text-xl text-rose-500"
  }, total - score), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-rose-400"
  }, "Yanl\u0131\u015F"))), props.breakdown && props.breakdown.length > 1 ? /*#__PURE__*/React.createElement("div", {
    className: "text-left mb-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-black text-slate-500 mb-2"
  }, "Konu k\u0131r\u0131l\u0131m\u0131 \u2014 \xE7al\u0131\u015F\u0131lacaklar \xFCstte"), props.breakdown.slice(0, 5).map(function (b) {
    return /*#__PURE__*/React.createElement("div", {
      key: b.ders + b.konu,
      className: "flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pr-2"
    }, kLabel(b.konu)), /*#__PURE__*/React.createElement("span", {
      className: "font-black"
    }, "%", b.pct));
  })) : null, props.wrongList.length > 0 ? /*#__PURE__*/React.createElement("details", {
    className: "text-left mb-6"
  }, /*#__PURE__*/React.createElement("summary", {
    className: "cursor-pointer text-sm font-bold p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
  }, "Yanl\u0131\u015F ", props.wrongList.length, " soru"), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 space-y-3"
  }, props.wrongList.map(function (w, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border text-left"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold whitespace-pre-line"
    }, w.question), SoruGorsel(w), /*#__PURE__*/React.createElement("p", {
      className: "text-xs mt-2 text-emerald-600 font-bold"
    }, "Do\u011Fru: ", w.dogru), w.ders ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        StudentStore.toggleReviewBook(w.ders, w.konu, w.id);
      },
      className: "mt-3 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-600 text-teal-700"
    }, StudentStore.inReviewBook(w.ders, w.konu, w.id) ? "Tekrardan çıkar" : "Tekrara at") : null);
  }))) : null, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      if (!window.ShareCard) return;
      const nick = props.student && props.student.userProfile && props.student.userProfile.nickname || "öğrenci";
      const url = window.ShareCard.draw({
        nickname: nick,
        pct: oran,
        correct: score,
        total: total,
        streak: props.student && props.student.streak && props.student.streak.count || 0,
        caption: "Net kartı · Atanly"
      });
      window.ShareCard.download(url, "atanly-net-karti.png");
    },
    className: "w-full mb-3 p-4 rounded-2xl btn-primary text-white font-semibold"
  }, "Net kart\u0131n\u0131 indir"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: props.onRetry,
    className: "flex-1 btn-primary text-white p-4 rounded-2xl font-semibold"
  }, "Tekrar"), /*#__PURE__*/React.createElement("button", {
    onClick: props.onHome,
    className: "flex-1 panel p-4 rounded-2xl font-medium"
  }, "Kapat"))));
}
function Eksikler(props) {
  const plan = props.plan;
  const byDers = {};
  plan.rows.forEach(function (r) {
    if (!byDers[r.ders]) byDers[r.ders] = [];
    byDers[r.ders].push(r);
  });
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "slide-up"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text"
  }, "Eksikler"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "Konu durumu. Not ve soru yaln\u0131zca Dersler\u2019den.")), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onReview();
    },
    disabled: !plan.due.length,
    className: "p-4 rounded-2xl btn-primary text-white text-left disabled:opacity-40"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold block"
  }, "Bug\xFCn tekrar \xB7 ", plan.due.length), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-normal opacity-80 mt-1 block"
  }, "Soru yan\u0131nda Tekrara at dediklerin. \xC7\xF6z\xFCnce listeden d\xFC\u015Fer.")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onWrong();
    },
    disabled: !plan.wrong.length,
    className: "p-4 rounded-2xl border-2 border-rose-500 text-rose-600 text-left disabled:opacity-40"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold block"
  }, "Yanl\u0131\u015F defteri \xB7 ", plan.wrong.length), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-normal opacity-80 mt-1 block"
  }, "\xC7\xF6zd\xFC\u011F\xFCn soru defterden d\xFC\u015Fer. Konu kilidini a\xE7maz."))), /*#__PURE__*/React.createElement(LiveGaps, {
    student: props.student,
    kpssData: props.kpssData,
    onKonu: props.onKonu
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onNotebook && props.onNotebook();
    },
    className: "w-full mb-6 p-4 rounded-2xl glass text-left card-hover"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold block"
  }, "Tekrar defteri"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-400 font-normal mt-1 block"
  }, "Tekrar etmek istedi\u011Fin notlar\u0131 kendine yaz. Yaln\u0131zca sen g\xF6r\xFCrs\xFCn.")), Object.keys(byDers).map(function (ders) {
    const t = themeFor(ders, props.isDark);
    return /*#__PURE__*/React.createElement("div", {
      key: ders,
      className: "mb-6"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "font-black mb-2 " + t.text
    }, t.icon, " ", ders), /*#__PURE__*/React.createElement("div", {
      className: "wide-grid is-tight"
    }, byDers[ders].map(function (r) {
      const tp = StudentStore.getTopic(r.ders, r.konu);
      const kd = {
        sorular: new Array(r.soruSayisi || 0),
        notlar: new Array(r.notSayisi || 0)
      };
      const done = StudentStore.topicComplete(tp, kd);
      return /*#__PURE__*/React.createElement("div", {
        key: r.konu,
        className: "w-full flex justify-between items-center p-3 rounded-xl border pointer-events-none " + (done ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 opacity-45")
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-sm text-left pr-2 " + (done ? "font-semibold text-emerald-800 dark:text-emerald-200" : "font-medium text-stone-500")
      }, kLabel(r.konu)), /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 " + (done ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400")
      }, done ? "Bitti" : "Bekliyor"));
    })));
  }));
}
function DenemeSetup(props) {
  const dersler = Object.keys(props.kpssData);
  const stats = StudyPlanner.catalogStats(props.kpssData);
  const [sel, setSel] = useState(function () {
    const o = {};
    dersler.forEach(function (d) {
      o[d] = true;
    });
    return o;
  });
  const [n, setN] = useState(20);
  const [mins, setMins] = useState(0);
  function toggle(d) {
    const next = Object.assign({}, sel);
    next[d] = !next[d];
    setSel(next);
  }
  const chosen = dersler.filter(function (d) {
    return sel[d];
  });
  var pool = 0;
  chosen.forEach(function (d) {
    pool += stats[d] && stats[d].soruSayisi || 0;
  });
  const nOpts = [10, 20, 30, 40];
  const tOpts = [{
    v: 0,
    t: "Süre yok"
  }, {
    v: 15,
    t: "15 dk"
  }, {
    v: 20,
    t: "20 dk"
  }, {
    v: 40,
    t: "40 dk"
  }];
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "slide-up"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text"
  }, "Deneme"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, "Kar\u0131\u015F\u0131k pratik veya tam kitap\xE7\u0131k. Konu kilidini atlatmaz; rastgele soru \xE7eker.")), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl glass p-5 mb-4 card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-baseline mb-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400"
  }, "Dersler"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-400"
  }, chosen.length, "/", dersler.length, " se\xE7ili \xB7 ", pool, " soru")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-2"
  }, dersler.map(function (d) {
    var t = themeFor(d, props.isDark);
    var on = !!sel[d];
    var sc = stats[d] || {
      soruSayisi: 0,
      konuSayisi: 0
    };
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: d,
      onClick: function () {
        toggle(d);
      },
      className: "w-full flex items-center gap-3 p-3 rounded-xl text-left border-2 transition-all " + (on ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800")
    }, /*#__PURE__*/React.createElement("span", {
      className: "h-10 w-10 rounded-xl flex items-center justify-center text-lg shrink-0 " + (on ? "bg-white/15" : "bg-white dark:bg-stone-800")
    }, t.icon), /*#__PURE__*/React.createElement("span", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-medium block"
    }, d), /*#__PURE__*/React.createElement("span", {
      className: "text-xs block mt-0.5 " + (on ? "text-white/70" : "text-zinc-400")
    }, sc.konuSayisi, " konu \xB7 ", sc.soruSayisi, " soru")), /*#__PURE__*/React.createElement("span", {
      className: "h-5 w-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 " + (on ? "border-white bg-white text-indigo-600" : "border-stone-300 text-transparent")
    }, "\u2713"));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl glass p-5 mb-4 card-hover"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-1"
  }, "Soru say\u0131s\u0131"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold mb-3"
  }, n, " soru"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-2"
  }, nOpts.map(function (x) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: x,
      onClick: function () {
        setN(x);
      },
      className: "flex-1 py-2 rounded-xl text-sm font-medium border-2 " + (n === x ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 dark:border-stone-700")
    }, x);
  })), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "5",
    max: "50",
    step: "5",
    value: n,
    onChange: function (e) {
      setN(Number(e.target.value));
    },
    className: "w-full accent-indigo-600"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl glass p-5 mb-5 card-hover"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-1"
  }, "S\xFCre"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold mb-3"
  }, mins === 0 ? "Sınır yok — kendi hızında" : mins + " dakikada bitir"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, tOpts.map(function (x) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: x.v,
      onClick: function () {
        setMins(x.v);
      },
      className: "py-2 rounded-xl text-xs font-medium border-2 " + (mins === x.v ? "bg-indigo-600 text-white border-indigo-600" : "border-stone-200 dark:border-stone-700")
    }, x.t);
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      const items = StudyPlanner.mixedQuiz(props.kpssData, chosen, n);
      if (!items.length) {
        alert("Seçilen derslerde soru yok.");
        return;
      }
      props.onStart(items, mins * 60);
    },
    className: "w-full btn-primary text-white p-4 rounded-2xl text-left"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold block"
  }, "Kar\u0131\u015F\u0131k testi ba\u015Flat"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-normal text-white/75 mt-0.5 block"
  }, chosen.length, " ders \xB7 ", n, " soru \xB7 ", mins ? mins + " dk" : "süre yok")), props.onFullExam ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: props.onFullExam,
    className: "mt-3 w-full p-4 rounded-2xl glass text-left card-hover"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold block"
  }, "Tam deneme"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-zinc-400 font-normal mt-0.5 block"
  }, "40 soru, 40 dakika, optik k\xE2\u011F\u0131t. S\u0131nav temposu.")) : null);
}
function eduLabel(id) {
  if (id === "onlisans") return "Ön lisans";
  if (id === "ortaogretim") return "Ortaöğretim";
  return "Lisans";
}
function needsKulvar(level) {
  return false;
}
function trackLabel(id) {
  var list = window.KpssConfig && window.KpssConfig.targetTypes || [];
  var hit = list.filter(function (x) {
    return x.id === id;
  })[0];
  return hit && hit.t || id || "—";
}
function fmtExam(iso) {
  if (!iso) return "—";
  var p = String(iso).split("-");
  if (p.length === 3) return p[2] + "." + p[1] + "." + p[0];
  return iso;
}
function ResetProfileModal(props) {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ok = typed.trim().toLocaleUpperCase("tr-TR") === "SIFIRLA";
  function run() {
    if (!ok || busy) return;
    if (!window.SyncEngine || !window.SyncEngine.resetProgress) {
      setErr("Sıfırlama şu an kullanılamıyor. Verilerin silinmedi.");
      return;
    }
    setBusy(true);
    setErr("");
    window.SyncEngine.resetProgress().then(function (r) {
      if (r && r.ok) {
        if (props.onClose) props.onClose();
        return;
      }
      setBusy(false);
      setErr(r && (r.reason === "offline" || r.reason === "anon") ? "İnternet bağlantısı ya da oturum yok. Verilerin silinmedi, tekrar dene." : "Sıfırlama tamamlanamadı, verilerin silinmedi. Biraz sonra tekrar dene.");
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4",
    onClick: function () {
      if (!busy && props.onClose) props.onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl fade-in",
    onClick: function (e) {
      e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black text-stone-900 dark:text-white mb-1"
  }, "Profili s\u0131f\u0131rla"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-rose-600 mb-4"
  }, "Bunu geri alamazs\u0131n."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-1"
  }, "Silinecek"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-600 dark:text-stone-300 mb-3 leading-relaxed"
  }, "\xC7\xF6zd\xFC\u011F\xFCn sorular, netler ve deneme ge\xE7mi\u015Fi, konu ilerlemesi, eksikler ve tekrar listesi, seri, rozetler, oyun rekorlar\u0131, haftal\u0131k program ve T\xFCrkiye s\u0131ralamas\u0131ndaki yerin."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-1"
  }, "Kalacak"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-600 dark:text-stone-300 mb-4 leading-relaxed"
  }, "Hesab\u0131n ve e-postan, ad\u0131n, e\u011Fitim d\xFCzeyin, premium \xFCyeli\u011Fin, davet kodun, Notlar\u0131m ve g\xF6r\xFCn\xFCm ayarlar\u0131n."), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mb-2"
  }, "Sonra yeni s\u0131nav tarihini se\xE7ip s\u0131f\u0131rdan ba\u015Flars\u0131n. Onaylamak i\xE7in ", /*#__PURE__*/React.createElement("b", null, "SIFIRLA"), " yaz:"), /*#__PURE__*/React.createElement("input", {
    value: typed,
    onChange: function (e) {
      setTyped(e.target.value);
    },
    placeholder: "SIFIRLA",
    autoCapitalize: "characters",
    autoComplete: "off",
    disabled: busy,
    className: "w-full mb-3 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-semibold tracking-wider"
  }), err ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-rose-600 mb-3"
  }, err) : null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: !ok || busy,
    onClick: run,
    className: "flex-1 py-3 rounded-xl bg-rose-600 text-white text-sm font-bold disabled:opacity-40"
  }, busy ? "Sıfırlanıyor…" : "Profili sıfırla"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: busy,
    onClick: function () {
      if (props.onClose) props.onClose();
    },
    className: "px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 text-sm font-medium"
  }, "Vazge\xE7"))));
}
function Ben(props) {
  const st = props.student;
  let totQ = 0,
    totC = 0;
  Object.keys(st.sessions).forEach(function (d) {
    totQ += st.sessions[d].questions || 0;
    totC += st.sessions[d].correct || 0;
  });
  const overall = totQ ? Math.round(totC / totQ * 100) : 0;
  const up = st.userProfile || {};
  const field = "w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900";
  const isAdmin = up.role === "admin";
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftTrack, setDraftTrack] = useState("B");
  const [draftEdu, setDraftEdu] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const examPassed = !!(st.profile.examDate && st.profile.examDate < StudentStore.todayStr());
  const eduReq = up.educationChangeRequest;
  const showKulvar = needsKulvar(totQ === 0 && editing && draftEdu ? draftEdu : up.educationLevel);
  function startSettingsEdit() {
    setDraftName(st.profile.name || "");
    setDraftTrack(up.targetType || "B");
    setDraftEdu(totQ === 0 ? up.educationLevel || "lisans" : "");
    setEditing(true);
  }
  function sendSettings() {
    var nextEdu = totQ === 0 && draftEdu ? draftEdu : up.educationLevel;
    StudentStore.updateProfile({
      name: draftName
    });
    var patch = {
      nickname: draftName
    };
    if (needsKulvar(nextEdu)) patch.targetType = draftTrack;else patch.targetType = "B";
    StudentStore.updateUserProfile(patch);
    var wantEdu = draftEdu && draftEdu !== up.educationLevel && (!eduReq || eduReq.status !== "pending") ? draftEdu : "";
    if (wantEdu) {
      if (totQ === 0 && StudentStore.setEducationLevel) {
        StudentStore.setEducationLevel(wantEdu);
        wantEdu = "";
      } else {
        StudentStore.requestEducationChange(wantEdu);
      }
    }
    setEditing(false);
    var sb = window.SupabaseClient && window.SupabaseClient.get();
    var done = function () {
      if (window.SyncEngine) window.SyncEngine.sync();
    };
    if (wantEdu && sb && sb.functions) {
      sb.functions.invoke("admin-action", {
        body: {
          action: "submit_edu",
          to: wantEdu
        }
      }).then(function () {
        done();
      }).catch(done);
    } else {
      done();
    }
  }
  return /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "slide-up"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-display font-black tracking-tight gradient-text"
  }, "Profil"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-400 mt-1"
  }, up.email || "Hesap bağlı"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-400 mt-1"
  }, "Ayarlar, ara\xE7lar ve plan burada.")), /*#__PURE__*/React.createElement(ThemeBtn, {
    isDark: props.isDark,
    onClick: props.toggleDark
  })), /*#__PURE__*/React.createElement("div", {
    className: "ben-cols"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl glass card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-semibold gradient-text"
  }, totQ), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-stone-400 mt-1"
  }, "Toplam soru")), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl glass card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-semibold gradient-text"
  }, "%", overall), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-stone-400 mt-1"
  }, "Net"))), /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl glass p-5 mb-4 card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400"
  }, "Ayarlar"), !editing ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: startSettingsEdit,
    className: "text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
  }, "D\xFCzenle") : null), eduReq && eduReq.status === "pending" && eduReq.to !== up.educationLevel ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-amber-800 bg-amber-50 rounded-xl px-3 py-2 mt-3"
  }, "E\u011Fitim de\u011Fi\u015Fikli\u011Fi onay bekliyor: ", eduLabel(eduReq.to)) : null, eduReq && eduReq.status === "rejected" && editing ? /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-coral-600 mt-3"
  }, "Son e\u011Fitim talebi reddedildi. Yeniden se\xE7ebilirsin.") : null, !editing ? /*#__PURE__*/React.createElement("dl", {
    className: "mt-3 divide-y divide-stone-100 dark:divide-stone-800"
  }, [{
    k: "Ad",
    v: st.profile.name || "—"
  }, {
    k: "Eğitim",
    v: eduLabel(up.educationLevel)
  }, {
    k: "Sınav tarihi",
    v: fmtExam(st.profile.examDate)
  }].concat(needsKulvar(up.educationLevel) ? [{
    k: "Kulvar",
    v: trackLabel(up.targetType || "B")
  }] : []).map(function (row) {
    return /*#__PURE__*/React.createElement("div", {
      key: row.k,
      className: "py-3 flex justify-between gap-4"
    }, /*#__PURE__*/React.createElement("dt", {
      className: "text-sm text-stone-400"
    }, row.k), /*#__PURE__*/React.createElement("dd", {
      className: "text-sm font-medium text-right"
    }, row.v));
  })) : /*#__PURE__*/React.createElement("div", {
    className: "mt-3 space-y-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm text-stone-500"
  }, "Ad"), /*#__PURE__*/React.createElement("input", {
    value: draftName,
    onChange: function (e) {
      setDraftName(e.target.value);
    },
    className: field
  }), /*#__PURE__*/React.createElement("label", {
    className: "text-sm text-stone-500"
  }, "E\u011Fitim"), totQ === 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("select", {
    value: draftEdu || up.educationLevel || "lisans",
    onChange: function (e) {
      setDraftEdu(e.target.value);
    },
    className: field + " mt-1"
  }, /*#__PURE__*/React.createElement("option", {
    value: "lisans"
  }, "Lisans"), /*#__PURE__*/React.createElement("option", {
    value: "onlisans"
  }, "\xD6n lisans"), /*#__PURE__*/React.createElement("option", {
    value: "ortaogretim"
  }, "Orta\xF6\u011Fretim")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-400 mt-1"
  }, "Soru \xE7\xF6zmeden \xF6nce d\xFCzeyi burada d\xFCzeltebilirsin. S\u0131nav tarihi \xD6SYM takvimine ba\u011Flan\u0131r.")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium"
  }, eduLabel(up.educationLevel)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-400"
  }, "D\xFCzey de\u011Fi\u015Fimi admin onay\u0131 ister. S\u0131nav tarihi \xD6SYM takvimine ba\u011Flan\u0131r."), !eduReq || eduReq.status !== "pending" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm text-stone-500"
  }, "Yeni e\u011Fitim d\xFCzeyi"), /*#__PURE__*/React.createElement("select", {
    value: draftEdu,
    onChange: function (e) {
      setDraftEdu(e.target.value);
    },
    className: field + " mt-1"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "De\u011Fi\u015Ftirme"), up.educationLevel !== "lisans" ? /*#__PURE__*/React.createElement("option", {
    value: "lisans"
  }, "Lisans") : null, up.educationLevel !== "onlisans" ? /*#__PURE__*/React.createElement("option", {
    value: "onlisans"
  }, "\xD6n lisans") : null, up.educationLevel !== "ortaogretim" ? /*#__PURE__*/React.createElement("option", {
    value: "ortaogretim"
  }, "Orta\xF6\u011Fretim") : null)) : null), /*#__PURE__*/React.createElement("label", {
    className: "text-sm text-stone-500"
  }, "S\u0131nav tarihi"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-medium"
  }, fmtExam(st.profile.examDate)), showKulvar ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-sm text-stone-500"
  }, "Kulvar"), /*#__PURE__*/React.createElement("select", {
    value: draftTrack,
    onChange: function (e) {
      setDraftTrack(e.target.value);
    },
    className: field
  }, (window.KpssConfig && window.KpssConfig.targetTypes || [{
    id: "B",
    t: "B Grubu"
  }, {
    id: "A",
    t: "A Grubu"
  }, {
    id: "ogretmen",
    t: "Öğretmenlik"
  }, {
    id: "dhbt",
    t: "DHBT"
  }]).map(function (x) {
    return /*#__PURE__*/React.createElement("option", {
      key: x.id,
      value: x.id
    }, x.t);
  }))) : null, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 pt-1"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: sendSettings,
    className: "flex-1 py-3 rounded-xl btn-primary text-white text-sm font-semibold"
  }, "G\xF6nder"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setEditing(false);
    },
    className: "px-4 py-3 rounded-xl border-2 border-stone-200 text-sm font-medium"
  }, "Vazge\xE7")))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      props.onOpen && props.onOpen("leaderboard");
    },
    className: "w-full mb-4 p-3.5 rounded-2xl glass text-left card-hover"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium block"
  }, "T\xFCrkiye s\u0131ralamas\u0131"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-400 font-normal mt-0.5 block"
  }, "Haftal\u0131k soru s\u0131ralamas\u0131")), /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl glass p-5 mb-4 card-hover"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-1"
  }, "Davet"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-400 mt-1"
  }, "Davet kodun: ", /*#__PURE__*/React.createElement("b", null, StudentStore.ensureReferralCode ? StudentStore.ensureReferralCode() : up.referralCode || "—")), /*#__PURE__*/React.createElement("label", {
    className: "text-xs text-stone-400 mt-2 block"
  }, "Arkada\u015F kodu"), /*#__PURE__*/React.createElement("input", {
    defaultValue: up.referredBy || "",
    onBlur: function (e) {
      if (window.PaymentClient) window.PaymentClient.applyReferral(e.target.value);
    },
    className: field + " mt-1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rounded-3xl glass p-5 mb-4 card-hover"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-1"
  }, "Rozetler"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-400 mb-2"
  }, "Seri, soru ve ilk deneme hedefleri."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, [{
    id: "firstDay",
    title: "İlk çalışma günü"
  }, {
    id: "streak7",
    title: "7 gün kesintisiz"
  }, {
    id: "q1000",
    title: "1000 soru"
  }, {
    id: "firstExam",
    title: "İlk tam deneme"
  }].map(function (b) {
    var on = st.achievements && st.achievements[b.id];
    return /*#__PURE__*/React.createElement("span", {
      key: b.id,
      className: "text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 " + (on ? "bg-emerald-50 text-emerald-600 pop-in" : "bg-stone-100 dark:bg-slate-800 text-stone-400")
    }, on ? null : window.KpssIcon ? window.KpssIcon("lock", "w-3 h-3") : null, b.title);
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      if (window.NotificationEngine) window.NotificationEngine.requestPush().then(function (r) {
        if (r.ok) {
          var n = window.NotificationEngine.streakNudge(st);
          if (n) window.NotificationEngine.showLocal("Atanly", n);
        }
      });
    },
    className: "w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium block"
  }, "Hat\u0131rlatma izni"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-400 font-normal mt-0.5 block"
  }, "Taray\u0131c\u0131 bildirimi: seri bozulmas\u0131n diye \"bug\xFCn \xE7al\u0131\u015F\" uyar\u0131s\u0131. \u0130stersen kapat\u0131rs\u0131n.")), isAdmin ? /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onAdmin && props.onAdmin();
    },
    className: "w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover font-medium"
  }, "Y\xF6netim") : null, examPassed ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setResetOpen(true);
    },
    className: "w-full mb-3 p-3.5 rounded-2xl glass text-left card-hover"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium block"
  }, "S\u0131nav\u0131n bitti mi? Yeni d\xF6neme ba\u015Fla"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-400 font-normal mt-0.5 block"
  }, "\xC7al\u0131\u015Fma ge\xE7mi\u015Fini s\u0131f\u0131rla, hesab\u0131n ve notlar\u0131n kals\u0131n.")) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function () {
      setResetOpen(true);
    },
    className: "w-full mb-1 p-3.5 rounded-2xl text-sm text-stone-400"
  }, "Profili s\u0131f\u0131rla"), resetOpen ? /*#__PURE__*/React.createElement(ResetProfileModal, {
    onClose: function () {
      setResetOpen(false);
    }
  }) : null, /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      if (confirm("Hesap silme talebi kaydedilir. Destek onayından sonra veri silinir.")) StudentStore.requestDeletion();
    },
    className: "w-full mb-3 p-3.5 rounded-2xl text-sm text-stone-400"
  }, "Veri silme talebi"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-stone-400 text-center leading-relaxed mb-3 space-x-1"
  }, /*#__PURE__*/React.createElement("a", {
    className: "underline",
    href: "yasal/aydinlatma.html"
  }, "KVKK Ayd\u0131nlatma"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    className: "underline",
    href: "yasal/kullanim.html"
  }, "Kullan\u0131m"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    className: "underline",
    href: "yasal/uyelik.html"
  }, "\xDCyelik"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    className: "underline",
    href: "yasal/gizlilik.html"
  }, "Gizlilik"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    className: "underline",
    href: "yasal/cerez.html"
  }, "\xC7erez"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    className: "underline",
    href: "yasal/basvuru.html"
  }, "KVKK ba\u015Fvuru")), /*#__PURE__*/React.createElement("button", {
    onClick: function () {
      props.onSignOut && props.onSignOut();
    },
    className: "w-full p-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium"
  }, "\xC7\u0131k\u0131\u015F")));
}
function toItemsFromKonu(kpssData, ders, konu) {
  const sorular = ((kpssData[ders] || {})[konu] || {}).sorular || [];
  return sorular.map(function (q, idx) {
    const id = q.id != null ? q.id : idx;
    return {
      ders: ders,
      konu: konu,
      q: q,
      id: id,
      qid: StudentStore.qid(ders, konu, id)
    };
  });
}
function packFromKonu(kpssData, ders, konu, packIdx) {
  var packs = StudentStore.topicTestPacks(toItemsFromKonu(kpssData, ders, konu));
  if (!packs.length) return null;
  var i = packIdx == null ? 0 : packIdx;
  if (i < 0 || i >= packs.length) i = 0;
  return packs[i];
}

// Not/soru görsellerine dokununca tam ekran büyütme (haritalar telefonda okunabilsin).
function ImageZoom() {
  const [src, setSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const dragRef = useRef(null);
  const imgRef = useRef(null);
  const posRef = useRef({
    x: 0,
    y: 0
  });
  useEffect(function () {
    function onClick(e) {
      var img = e.target && e.target.tagName === "IMG" ? e.target : null;
      if (!img) return;
      if (!img.closest(".note-html, .q-stem, .study-card-body, .zoomable")) return;
      if (img.closest("a, button")) return;
      e.preventDefault();
      posRef.current = {
        x: 0,
        y: 0
      };
      setZoom(1);
      setSrc(img.currentSrc || img.src);
    }
    document.addEventListener("click", onClick);
    return function () {
      document.removeEventListener("click", onClick);
    };
  }, []);
  useEffect(function () {
    function onKey(e) {
      if (e.key === "Escape") setSrc(null);
    }
    if (src) document.addEventListener("keydown", onKey);
    return function () {
      document.removeEventListener("keydown", onKey);
    };
  }, [src]);
  function applyTransform(z, x, y) {
    posRef.current = {
      x: x,
      y: y
    };
    if (imgRef.current) imgRef.current.style.transform = "translate(" + x + "px," + y + "px) scale(" + z + ")";
  }
  function toggleZoom(e) {
    var next = zoom > 1 ? 1 : 2.4;
    setZoom(next);
    applyTransform(next, 0, 0);
    if (e) e.stopPropagation();
  }
  function onPointerDown(e) {
    if (zoom <= 1) return;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: posRef.current.x,
      oy: posRef.current.y
    };
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    var d = dragRef.current;
    if (!d) return;
    applyTransform(zoom, d.ox + (e.clientX - d.x), d.oy + (e.clientY - d.y));
  }
  function onPointerUp() {
    dragRef.current = null;
  }
  if (!src) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "img-zoom",
    onClick: function () {
      setSrc(null);
    }
  }, /*#__PURE__*/React.createElement("img", {
    ref: imgRef,
    src: src,
    alt: "",
    className: "img-zoom-pic",
    style: {
      transform: "translate(" + posRef.current.x + "px," + posRef.current.y + "px) scale(" + zoom + ")",
      cursor: zoom > 1 ? "grab" : "zoom-in"
    },
    onClick: toggleZoom,
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    onPointerCancel: onPointerUp
  }), /*#__PURE__*/React.createElement("div", {
    className: "img-zoom-bar"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: toggleZoom
  }, zoom > 1 ? "Küçült" : "Büyüt"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function (e) {
      e.stopPropagation();
      setSrc(null);
    }
  }, "Kapat")));
}
function App() {
  const student = useStudent();
  const isDark = !!(student.profile && student.profile.dark);
  // window.kpssData her okunuşta yeni nesne üretir; bir kez al ki plan/filtre her render'da baştan hesaplanmasın.
  const rawData = useMemo(function () {
    return typeof window !== "undefined" && window.kpssData ? window.kpssData : {};
  }, []);
  const kpssData = useMemo(function () {
    var ac = window.AlanCatalog;
    return ac && ac.filterCatalog ? ac.filterCatalog(rawData, student) : rawData;
  }, [rawData, student]);
  const plan = useMemo(function () {
    return StudyPlanner.buildPlan(kpssData, student);
  }, [kpssData, student]);
  const [extra, setExtra] = useState(null);
  const [liveView, setLiveView] = useState({
    view: "home"
  });
  const [LazyCmp, setLazyCmp] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authSession, setAuthSession] = useState(null);
  const [GateAuth, setGateAuth] = useState(null);
  const [AdminCmp, setAdminCmp] = useState(null);
  const [lazyErr, setLazyErr] = useState("");
  const [roleChecked, setRoleChecked] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [pwRecovery, setPwRecovery] = useState(function () {
    return !!(window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending());
  });
  const [OnboardCmp, setOnboardCmp] = useState(null);
  const [profileHydrated, setProfileHydrated] = useState(false);
  const signingOutRef = useRef(false);
  function doSignOut() {
    signingOutRef.current = true;
    setAuthSession(null);
    setPwRecovery(false);
    setProfileHydrated(false);
    setRoleChecked(false);
    var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
    var finish = function () {
      if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
    };
    if (sb && sb.auth && sb.auth.signOut) sb.auth.signOut().then(finish).catch(finish);else finish();
  }
  const LAZY = {
    onboarding: ["OnboardingScreen", "js/components/OnboardingScreen.jsx"],
    auth: ["AuthScreen", "js/components/AuthScreen.jsx"],
    leaderboard: ["LeaderboardScreen", "js/components/LeaderboardScreen.jsx"],
    exam: ["ExamSimulator", "js/components/ExamSimulator.jsx"],
    admin: ["AdminDashboard", "js/components/AdminDashboard.jsx"],
    placement: ["PlacementScreen", "js/components/PlacementScreen.jsx"],
    ai: ["AiAssistant", "js/components/AiAssistant.jsx"],
    live: ["LiveExamScreen", "js/components/LiveExamScreen.jsx"],
    heat: ["Heatmap30", "js/components/Heatmap30.jsx"],
    instructor: ["InstructorScreen", "js/components/InstructorScreen.jsx"],
    paywall: ["PaywallScreen", "js/components/PaywallScreen.jsx"],
    notebook: ["ReviewNotebook", "js/components/ReviewNotebook.jsx"]
  };
  useEffect(function () {
    if (student.profile && student.profile.onboarded || !window.JsxLoader) return;
    window.JsxLoader.load("OnboardingScreen", "js/components/OnboardingScreen.jsx").then(function (C) {
      if (C) setOnboardCmp(function () {
        return C;
      });
    }).catch(function () {});
  }, [student.profile && student.profile.onboarded]);
  useEffect(function () {
    if (!extra || extra === "onboarding") return;
    if (extra === "instructor" || extra === "admin" || extra === "exam") {
      setExtra(null);
      return;
    }
    if (extra === "paywall" && !(window.KpssConfig && window.KpssConfig.premiumEnabled)) {
      setExtra(null);
      return;
    }
    var spec = LAZY[extra];
    if (!spec || !window.JsxLoader) {
      setLazyErr("Bu araç bulunamadı.");
      return;
    }
    setLazyCmp(null);
    setLazyErr("");
    window.JsxLoader.load(spec[0], spec[1]).then(function (C) {
      if (C) setLazyCmp(function () {
        return C;
      });else setLazyErr("Araç yüklenemedi.");
    }).catch(function (e) {
      setLazyErr(window.trError && window.trError(e, "Araç yüklenemedi.") || "Araç yüklenemedi.");
    });
  }, [extra]);
  useEffect(function () {
    var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
    if (!sb) {
      setAuthReady(true);
      return;
    }
    sb.auth.getSession().then(function (r) {
      var sess = r.data && r.data.session;
      var recovering = !!(window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending());
      if (recovering) {
        if (window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
        setPwRecovery(true);
      }
      setAuthSession(sess || null);
      setAuthReady(true);
      if (sess && !recovering) {
        if (window.StudentStore && window.StudentStore.bindToUser) {
          window.StudentStore.bindToUser(sess.user.id, sess.user.email);
        }
        if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
          window.StudentStore.consumeSignupIfNeeded(sess.user);
        }
        var st0 = window.StudentStore && window.StudentStore.getState && window.StudentStore.getState();
        if (st0 && st0.profile && st0.profile.onboarded) setProfileHydrated(true);
        var done0 = function () {
          setProfileHydrated(true);
        };
        if (window.SyncEngine && window.SyncEngine.ensureLocation) window.SyncEngine.ensureLocation();
        if (window.SyncEngine && window.SyncEngine.sync) window.SyncEngine.sync().then(done0).catch(done0);else done0();
      }
    }).catch(function () {
      setAuthReady(true);
    });
    var sub = sb.auth.onAuthStateChange(function (event, sess) {
      setAuthReady(true);
      if (event === "PASSWORD_RECOVERY") {
        if (window.SupabaseClient && window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
        setPwRecovery(true);
        if (sess) setAuthSession(sess);
        return;
      }
      if (event === "SIGNED_OUT") {
        signingOutRef.current = true;
        setAuthSession(null);
        setPwRecovery(false);
        setProfileHydrated(false);
        setRoleChecked(false);
        if (window.StudentStore && window.StudentStore.bindToUser) window.StudentStore.bindToUser(null);
        return;
      }
      if (!sess) return;
      signingOutRef.current = false;
      if (window.SupabaseClient && window.SupabaseClient.recoveryPending && window.SupabaseClient.recoveryPending()) {
        if (window.SupabaseClient.markRecovery) window.SupabaseClient.markRecovery();
        setPwRecovery(true);
        setAuthSession(sess);
        return;
      }
      setAuthSession(sess);
      if (window.StudentStore && window.StudentStore.bindToUser) {
        window.StudentStore.bindToUser(sess.user.id, sess.user.email);
      }
      if (window.StudentStore && window.StudentStore.consumeSignupIfNeeded) {
        window.StudentStore.consumeSignupIfNeeded(sess.user);
      }
      var st1 = window.StudentStore && window.StudentStore.getState && window.StudentStore.getState();
      if (st1 && st1.profile && st1.profile.onboarded) setProfileHydrated(true);
      var done1 = function () {
        setProfileHydrated(true);
      };
      if (window.SyncEngine && window.SyncEngine.ensureLocation) window.SyncEngine.ensureLocation();
      if (window.SyncEngine && window.SyncEngine.sync) window.SyncEngine.sync().then(done1).catch(done1);else done1();
    });
    return function () {
      if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
    };
  }, []);
  useEffect(function () {
    if (!authSession) signingOutRef.current = false;
  }, [authSession]);
  useEffect(function () {
    if (authReady && (!authSession || pwRecovery) && window.JsxLoader) {
      window.JsxLoader.load("AuthScreen", "js/components/AuthScreen.jsx").then(function (C) {
        if (C) setGateAuth(function () {
          return C;
        });
      });
    }
  }, [authReady, authSession, pwRecovery]);
  useEffect(function () {
    if (!authSession) {
      setRoleChecked(false);
      setAdminCmp(null);
      return;
    }
    setRoleChecked(false);
    var uid = authSession.user.id;
    var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
    var settled = false;
    function finish(isAdm, flags) {
      if (settled) return;
      settled = true;
      if (StudentStore.applyServerFlags) {
        StudentStore.applyServerFlags(Object.assign({
          role: isAdm ? "admin" : "student"
        }, flags || {}));
      }
      if (isAdm && window.JsxLoader) {
        window.JsxLoader.load("AdminDashboard", "js/components/AdminDashboard.jsx").then(function (C) {
          if (C) setAdminCmp(function () {
            return C;
          });
          setRoleChecked(true);
        }).catch(function (e) {
          console.warn(e);
          setRoleChecked(true);
        });
      } else {
        setRoleChecked(true);
      }
    }
    if (!sb) {
      finish(false);
      return;
    }
    var timed = setTimeout(function () {
      finish(false);
    }, 8000);
    function fromRow(r) {
      clearTimeout(timed);
      var row = r && r.data || {};
      var blocked = !!(row.blocked || row.payload && row.payload.userProfile && row.payload.userProfile.blocked);
      finish(row.role === "admin", {
        premium: !!row.premium,
        blocked: blocked
      });
    }
    sb.from("student_states").select("role,premium,blocked,payload").eq("user_id", uid).maybeSingle().then(function (r) {
      if (r && r.error) {
        return sb.from("student_states").select("role,premium,payload").eq("user_id", uid).maybeSingle();
      }
      return r;
    }).then(fromRow).catch(function () {
      clearTimeout(timed);
      finish(false);
    });
    return function () {
      clearTimeout(timed);
    };
  }, [authSession]);
  useEffect(function () {
    if (!authSession) {
      setAnnounce("");
      return;
    }
    function pickBanner(rows) {
      var now = Date.now();
      var i;
      for (i = 0; i < (rows || []).length; i++) {
        var raw = String(rows[i] && rows[i].body || "");
        var exp = rows[i] && rows[i].expires_at;
        var m = raw.match(/^<!--kpss-exp:([^>]+)-->/);
        if (m) {
          exp = m[1];
          raw = raw.slice(m[0].length);
        }
        if (exp) {
          var ts = new Date(exp).getTime();
          if (!isFinite(ts) || ts <= now) continue;
        }
        if (raw.trim()) return raw.trim();
      }
      return "";
    }
    function loadBanner() {
      var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
      if (!sb) return;
      function apply(r) {
        if (r.error) return;
        setAnnounce(pickBanner(r.data));
      }
      sb.from("app_announcements").select("body,created_at,expires_at").eq("published", true).order("created_at", {
        ascending: false
      }).limit(20).then(function (r) {
        if (r.error && /expires_at/i.test(r.error.message || "")) {
          return sb.from("app_announcements").select("body,created_at").eq("published", true).order("created_at", {
            ascending: false
          }).limit(20).then(apply);
        }
        apply(r);
      });
    }
    loadBanner();
    var t = setInterval(loadBanner, 60000);
    return function () {
      clearInterval(t);
    };
  }, [authSession]);
  const [nav, setNav] = useState("bugun");
  const [selectedDers, setSelectedDers] = useState(null);
  const [selectedKonu, setSelectedKonu] = useState(null);
  const [drillKind, setDrillKind] = useState(null);
  const [drillMapTopic, setDrillMapTopic] = useState(null);
  const [drillDers, setDrillDers] = useState(null);
  const [drillKonu, setDrillKonu] = useState(null);
  const [drillSeed, setDrillSeed] = useState(0);
  const [drillGameCmp, setDrillGameCmp] = useState(null);
  const [drillGameErr, setDrillGameErr] = useState("");
  const [viewMode, setViewMode] = useState("hub");
  const [noteIndex, setNoteIndex] = useState(0);
  const [session, setSession] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongList, setWrongList] = useState([]);
  const [finished, setFinished] = useState(false);
  const [answerLog, setAnswerLog] = useState([]);
  const startedAt = useRef(null);
  const scoreRef = useRef(0);
  const finishedRef = useRef(false);
  const sessionRef = useRef(null);
  useEffect(function () {
    if (isDark) document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");
  }, [isDark]);
  useEffect(function () {
    sessionRef.current = session;
  }, [session]);
  useEffect(function () {
    var names = {
      conquer: "ConquerPlay",
      tabu: "TabuPlay",
      panic: "PanicPlay"
    };
    var name = names[drillKind];
    if (!name || !window.JsxLoader) {
      setDrillGameCmp(null);
      setDrillGameErr("");
      return;
    }
    setDrillGameErr("");
    window.JsxLoader.load(name, "js/components/DrillGames.jsx").then(function (C) {
      if (C) setDrillGameCmp(function () {
        return C;
      });else setDrillGameErr("Oyun yüklenemedi.");
    }).catch(function (e) {
      setDrillGameErr(window.trError && window.trError(e, "Oyun yüklenemedi.") || "Oyun yüklenemedi.");
    });
  }, [drillKind]);
  useEffect(function () {
    if (!session || finished || session.secondsLeft == null) return;
    if (session.secondsLeft <= 0) {
      finishSession();
      return;
    }
    const t = setTimeout(function () {
      setSession(function (cur) {
        if (!cur || cur.secondsLeft == null) return cur;
        return Object.assign({}, cur, {
          secondsLeft: cur.secondsLeft - 1
        });
      });
    }, 1000);
    return function () {
      clearTimeout(t);
    };
  }, [session, finished]);
  function toggleDark() {
    StudentStore.setDark(!isDark);
  }
  function resetTestUi() {
    scoreRef.current = 0;
    finishedRef.current = false;
    setQIndex(0);
    setPicked(null);
    setAnswered(false);
    setScore(0);
    setWrongList([]);
    setFinished(false);
    setAnswerLog([]);
  }
  function startSession(items, opts) {
    opts = opts || {};
    if (!items.length) {
      alert("Soru yok.");
      return;
    }
    if (opts.mode === "mixed") {
      var gate = StudentStore.consumeMixed ? StudentStore.consumeMixed() : {
        ok: true
      };
      if (!gate.ok) {
        alert(gate.reason);
        return;
      }
    }
    resetTestUi();
    startedAt.current = Date.now();
    const next = {
      items: items,
      mode: opts.mode || "topic",
      secondsLeft: opts.seconds || null,
      ders: opts.ders || null,
      konu: opts.konu || null,
      testNo: opts.testNo || null
    };
    sessionRef.current = next;
    setSession(next);
  }
  function finishSession() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const sess = sessionRef.current;
    if (!sess) {
      setFinished(true);
      return;
    }
    const elapsedMin = Math.max(0, Math.round((Date.now() - (startedAt.current || Date.now())) / 60000));
    if (sess.mode === "topic" && sess.ders && sess.konu) {
      StudentStore.recordTestResult(sess.ders, sess.konu, {
        correct: scoreRef.current,
        total: sess.items.length,
        minutes: elapsedMin,
        testNo: sess.testNo
      });
    } else if (elapsedMin) {
      StudentStore.addSessionStats({
        minutes: elapsedMin,
        seans: true,
        ders: sess.ders || null
      });
    }
    setFinished(true);
  }
  function handleAnswer(i) {
    if (answered || !session) return;
    const item = session.items[qIndex];
    const ok = i === item.q.correctAnswerIndex;
    setPicked(i);
    setAnswered(true);
    StudentStore.recordAnswer({
      ders: item.ders,
      konu: item.konu,
      id: item.id,
      correct: ok,
      fromWrongBook: session.mode === "wrong",
      fromReview: session.mode === "review"
    });
    StudentStore.addSessionStats({
      questions: 1,
      correct: ok ? 1 : 0
    });
    setAnswerLog(function (l) {
      return l.concat([{
        ders: item.ders,
        konu: item.konu,
        ok: ok
      }]);
    });
    if (ok) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    } else setWrongList(function (w) {
      return w.concat([{
        question: item.q.question,
        img: item.q.img,
        imgs: item.q.imgs,
        imgAlt: item.q.imgAlt,
        dogru: stripChoicePrefix(item.q.options[item.q.correctAnswerIndex]),
        ders: item.ders,
        konu: item.konu,
        id: item.id
      }]);
    });
  }
  function nextQ() {
    if (qIndex + 1 < session.items.length) {
      setQIndex(qIndex + 1);
      setPicked(null);
      setAnswered(false);
    } else finishSession();
  }
  function closeStudy() {
    setSession(null);
    setFinished(false);
    resetTestUi();
    setViewMode("hub");
  }
  function openLive(view, examId) {
    setLiveView({
      view: view || "home",
      examId: examId || null
    });
    setLazyCmp(null);
    setLazyErr("");
    setExtra("live");
  }
  function openKonu(ders, konu) {
    setNav("dersler");
    setSelectedDers(ders);
    setSelectedKonu(konu);
    setViewMode("hub");
    setSession(null);
    setFinished(false);
    const tp = StudentStore.getTopic(ders, konu);
    setNoteIndex(tp.noteIndex || 0);
  }
  function onTask(task) {
    if (task.kind === "notes") {
      openKonu(task.ders, task.konu);
      const nLen = (((kpssData[task.ders] || {})[task.konu] || {}).notlar || []).length;
      const tp = StudentStore.getTopic(task.ders, task.konu);
      StudentStore.setNoteIndex(task.ders, task.konu, tp.noteIndex || 0, nLen);
      setViewMode("notlar");
    } else if (task.kind === "test") {
      var packs = StudentStore.topicTestPacks(toItemsFromKonu(kpssData, task.ders, task.konu));
      var pi = StudentStore.firstOpenPackIndex(StudentStore.getTopic(task.ders, task.konu), packs.length);
      var pack = packs[pi];
      setNav("dersler");
      setSelectedDers(task.ders);
      setSelectedKonu(task.konu);
      setViewMode("hub");
      if (pack) startSession(pack.items, {
        mode: "topic",
        ders: task.ders,
        konu: task.konu,
        testNo: pack.no
      });
    } else if (task.kind === "review") {
      startSession(plan.due.slice(0, 25), {
        mode: "review"
      });
    } else if (task.kind === "wrong") {
      startSession(plan.wrong.slice(0, 25), {
        mode: "wrong"
      });
    }
  }
  if (!kpssData || !Object.keys(kpssData).length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "brand-backdrop flex flex-col items-center justify-center min-h-screen gap-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-medium text-lg",
      style: {
        color: "rgba(245,235,199,0.9)"
      }
    }, "Veriler y\xFCklenemedi. Sayfay\u0131 yenileyin."));
  }
  const inTest = !!session;
  const inMapPlay = nav === "alistirmalar" && drillKind === "map" && !!drillMapTopic;
  const inDrillGame = nav === "alistirmalar" && (drillKind === "conquer" || drillKind === "tabu" || drillKind === "panic");
  const konuData = selectedDers && selectedKonu && kpssData[selectedDers] ? kpssData[selectedDers][selectedKonu] || {} : {};
  let body = null;
  if (inTest && finished) {
    body = /*#__PURE__*/React.createElement(ResultView, {
      session: session,
      score: score,
      wrongList: wrongList,
      student: student,
      breakdown: StudyPlanner.breakdownByTopic(answerLog),
      onRetry: function () {
        if (session.mode === "wrong") startSession(plan.wrong.slice(0, 30), {
          mode: "wrong"
        });else startSession(session.items, {
          mode: session.mode,
          ders: session.ders,
          konu: session.konu,
          seconds: null,
          testNo: session.testNo
        });
      },
      onHome: closeStudy
    });
  } else if (inTest) {
    body = /*#__PURE__*/React.createElement(TestView, {
      session: session,
      qIndex: qIndex,
      picked: picked,
      answered: answered,
      score: score,
      onAnswer: handleAnswer,
      onNext: nextQ,
      onQuit: function () {
        if (confirm("Testten çıkmak istediğinize emin misiniz? Cevapladıkların kayıtlı kalır.")) {
          closeStudy();
        }
      }
    });
  } else if (nav === "bugun") {
    body = /*#__PURE__*/React.createElement(Bugun, {
      student: student,
      plan: plan,
      kpssData: kpssData,
      isDark: isDark,
      toggleDark: toggleDark,
      onDers: function (d) {
        setNav("dersler");
        setSelectedDers(d);
        setSelectedKonu(null);
      },
      onKonu: function (d, k, mode) {
        setNav("dersler");
        setSelectedDers(d);
        setSelectedKonu(k);
        setViewMode(mode === "notes" ? "notlar" : "hub");
        setNoteIndex(StudentStore.getTopic(d, k).noteIndex || 0);
      },
      onReview: function () {
        startSession(plan.due.slice(0, 30), {
          mode: "review"
        });
      },
      onWrong: function () {
        startSession(plan.wrong.slice(0, 30), {
          mode: "wrong"
        });
      },
      onMixed: function () {
        startSession(StudyPlanner.mixedQuiz(kpssData, null, 10), {
          mode: "mixed"
        });
      },
      onExam: function () {
        startSession(StudyPlanner.mixedQuiz(kpssData, null, 40), {
          mode: "mixed"
        });
      },
      onLive: openLive
    });
  } else if (nav === "eksikler") {
    body = /*#__PURE__*/React.createElement(Eksikler, {
      plan: plan,
      isDark: isDark,
      toggleDark: toggleDark,
      student: student,
      kpssData: kpssData,
      onKonu: openKonu,
      onReview: function () {
        startSession(plan.due.slice(0, 30), {
          mode: "review"
        });
      },
      onWrong: function () {
        startSession(plan.wrong.slice(0, 30), {
          mode: "wrong"
        });
      },
      onNotebook: function () {
        setExtra("notebook");
      }
    });
  } else if (nav === "ben") {
    body = /*#__PURE__*/React.createElement(Ben, {
      student: student,
      isDark: isDark,
      toggleDark: toggleDark,
      onOpen: function (id) {
        setExtra(id);
      },
      onAdmin: function () {
        setExtra("admin");
      },
      onSignOut: doSignOut
    });
  } else if (nav === "alistirmalar") {
    var drillData = drillDers && drillKonu && kpssData[drillDers] ? kpssData[drillDers][drillKonu] || {} : {};
    if (!drillKind) {
      body = /*#__PURE__*/React.createElement(AlistirmalarHome, {
        isDark: isDark,
        toggleDark: toggleDark,
        onKind: function (k) {
          setDrillKind(k);
          setDrillDers(null);
          setDrillKonu(null);
          setDrillSeed(Date.now());
        }
      });
    } else if (drillKind === "map") {
      if (!drillMapTopic) {
        body = /*#__PURE__*/React.createElement(MapTopics, {
          isDark: isDark,
          toggleDark: toggleDark,
          onBack: function () {
            setDrillKind(null);
          },
          onTopic: function (id) {
            setDrillMapTopic(id);
            setDrillSeed(Date.now());
          }
        });
      } else {
        body = /*#__PURE__*/React.createElement(MapPlay, {
          topicId: drillMapTopic,
          seed: drillSeed,
          isDark: isDark,
          toggleDark: toggleDark,
          onBack: function () {
            setDrillMapTopic(null);
          },
          onAgain: function () {
            setDrillSeed(Date.now());
          }
        });
      }
    } else if (drillKind === "conquer" || drillKind === "tabu" || drillKind === "panic") {
      if (drillGameErr) {
        body = /*#__PURE__*/React.createElement(Shell, null, /*#__PURE__*/React.createElement(BackBtn, {
          onClick: function () {
            setDrillKind(null);
          },
          label: "Al\u0131\u015Ft\u0131rmalar"
        }), /*#__PURE__*/React.createElement("p", {
          className: "text-coral-600 mt-6"
        }, drillGameErr));
      } else if (!drillGameCmp) {
        body = /*#__PURE__*/React.createElement("div", {
          className: "p-10 text-center text-zinc-500 text-sm"
        }, "Oyun y\xFCkleniyor\u2026");
      } else {
        body = React.createElement(drillGameCmp, {
          key: drillSeed,
          student: student,
          kpssData: kpssData,
          seed: drillSeed,
          isDark: isDark,
          toggleDark: toggleDark,
          onBack: function () {
            setDrillKind(null);
          },
          onAgain: function () {
            setDrillSeed(Date.now());
          }
        });
      }
    } else if (!drillDers) {
      body = /*#__PURE__*/React.createElement(AlistirmaDersList, {
        kpssData: kpssData,
        isDark: isDark,
        toggleDark: toggleDark,
        onBack: function () {
          setDrillKind(null);
        },
        onDers: function (d) {
          setDrillDers(d);
          setDrillKonu(null);
        }
      });
    } else {
      var clozeKeys = Object.keys(kpssData[drillDers] || {}).filter(function (k) {
        return k !== "_";
      });
      var clozeOn = !window.ClozeEngine || window.ClozeEngine.dersEnabled(drillDers);
      var canPlayCloze = clozeOn && drillKonu && StudentStore.isKonuOpen(drillDers, clozeKeys, clozeKeys.indexOf(drillKonu), kpssData);
      if (!clozeOn) {
        body = /*#__PURE__*/React.createElement(AlistirmaDersList, {
          kpssData: kpssData,
          isDark: isDark,
          toggleDark: toggleDark,
          onBack: function () {
            setDrillKind(null);
          },
          onDers: function (d) {
            setDrillDers(d);
            setDrillKonu(null);
          }
        });
      } else if (!canPlayCloze) {
        body = /*#__PURE__*/React.createElement(AlistirmaKonuList, {
          kpssData: kpssData,
          student: student,
          ders: drillDers,
          isDark: isDark,
          toggleDark: toggleDark,
          onBack: function () {
            setDrillDers(null);
          },
          onKonu: function (k) {
            if (!StudentStore.isKonuOpen(drillDers, clozeKeys, clozeKeys.indexOf(k), kpssData)) return;
            setDrillKonu(k);
            setDrillSeed(Date.now());
          }
        });
      } else {
        body = /*#__PURE__*/React.createElement(ClozePlay, {
          ders: drillDers,
          konu: drillKonu,
          konuData: drillData,
          seed: drillSeed,
          isDark: isDark,
          toggleDark: toggleDark,
          onBack: function () {
            setDrillKonu(null);
          },
          onAgain: function () {
            setDrillSeed(Date.now());
          }
        });
      }
    }
  } else if (!selectedDers) {
    body = /*#__PURE__*/React.createElement(DersHome, {
      kpssData: kpssData,
      student: student,
      plan: plan,
      isDark: isDark,
      toggleDark: toggleDark,
      onDers: function (d) {
        setSelectedDers(d);
        setSelectedKonu(null);
      }
    });
  } else if (!selectedKonu) {
    body = /*#__PURE__*/React.createElement(KonuList, {
      kpssData: kpssData,
      student: student,
      ders: selectedDers,
      isDark: isDark,
      toggleDark: toggleDark,
      onBack: function () {
        setSelectedDers(null);
      },
      onKonu: function (k) {
        setSelectedKonu(k);
        setViewMode("hub");
        const tp = StudentStore.getTopic(selectedDers, k);
        setNoteIndex(tp.noteIndex || 0);
      }
    });
  } else if (viewMode === "notlar") {
    body = /*#__PURE__*/React.createElement(NotesView, {
      notlar: konuData.notlar || [],
      index: noteIndex,
      ders: selectedDers,
      konu: selectedKonu,
      isDark: isDark,
      toggleDark: toggleDark,
      hasTest: (konuData.sorular || []).length > 0,
      onBack: function () {
        setViewMode("hub");
      },
      onIndex: function (i) {
        setNoteIndex(i);
        StudentStore.setNoteIndex(selectedDers, selectedKonu, i, (konuData.notlar || []).length);
      },
      onTest: function () {
        StudentStore.markNotesComplete(selectedDers, selectedKonu);
        var packs = StudentStore.topicTestPacks(toItemsFromKonu(kpssData, selectedDers, selectedKonu));
        var pi = StudentStore.firstOpenPackIndex(StudentStore.getTopic(selectedDers, selectedKonu), packs.length);
        var pack = packs[pi];
        if (pack) startSession(pack.items, {
          mode: "topic",
          ders: selectedDers,
          konu: selectedKonu,
          testNo: pack.no
        });
      }
    });
  } else {
    body = /*#__PURE__*/React.createElement(KonuHub, {
      ders: selectedDers,
      konu: selectedKonu,
      konuData: konuData,
      isDark: isDark,
      toggleDark: toggleDark,
      onBack: function () {
        setSelectedKonu(null);
      },
      onNotes: function () {
        const nLen = (konuData.notlar || []).length;
        StudentStore.setNoteIndex(selectedDers, selectedKonu, noteIndex, nLen);
        setViewMode("notlar");
      },
      onTest: function (packIdx) {
        var pack = packFromKonu(kpssData, selectedDers, selectedKonu, packIdx);
        if (!pack) {
          alert("Bu konuya ait henüz soru yüklenmedi!");
          return;
        }
        var tp = StudentStore.getTopic(selectedDers, selectedKonu);
        if (!StudentStore.isPackOpen(tp, pack.no)) return;
        startSession(pack.items, {
          mode: "topic",
          ders: selectedDers,
          konu: selectedKonu,
          testNo: pack.no
        });
      }
    });
  }
  if (!authReady) {
    return /*#__PURE__*/React.createElement(BrandLoad, null);
  }
  var AuthCmp = GateAuth || window.KpssComponents && window.KpssComponents.AuthScreen;
  if (!authSession || pwRecovery || signingOutRef.current) {
    return AuthCmp ? React.createElement(AuthCmp, {
      gate: true,
      recovery: pwRecovery,
      onPasswordUpdated: function () {
        if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
        setPwRecovery(false);
        if (window.SyncEngine) window.SyncEngine.sync();
      },
      onRecoveryFailed: function () {
        if (window.SupabaseClient && window.SupabaseClient.clearRecovery) window.SupabaseClient.clearRecovery();
        setPwRecovery(false);
      },
      onDone: function () {
        if (window.SyncEngine) window.SyncEngine.sync();
      }
    }) : /*#__PURE__*/React.createElement(BrandLoad, null);
  }
  if (!roleChecked) {
    return /*#__PURE__*/React.createElement(BrandLoad, null);
  }
  var isAdminUser = student.userProfile && student.userProfile.role === "admin";
  if (student.userProfile && student.userProfile.blocked) {
    return /*#__PURE__*/React.createElement("div", {
      className: "brand-backdrop min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative z-10 text-center max-w-sm bg-white/95 rounded-[28px] p-6 shadow-xl"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-xl font-semibold mb-2 text-stone-900"
    }, "Hesap k\u0131s\u0131tl\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-zinc-500 mb-6"
    }, "Bu hesap y\xF6netici taraf\u0131ndan durduruldu."), /*#__PURE__*/React.createElement("button", {
      onClick: doSignOut,
      className: "px-4 py-2 rounded-xl border font-medium"
    }, "\xC7\u0131k\u0131\u015F")));
  }
  if (isAdminUser) {
    var Adm = AdminCmp || window.KpssComponents && window.KpssComponents.AdminDashboard;
    return Adm ? React.createElement(Adm, {
      student: student,
      onSignOut: doSignOut
    }) : /*#__PURE__*/React.createElement("div", {
      className: "brand-backdrop min-h-screen flex items-center justify-center p-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center max-w-sm bg-white/95 rounded-[28px] p-6 shadow-xl"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-zinc-500 mb-4"
    }, "Y\xF6netim paneli y\xFCklenemedi. Sayfay\u0131 yenile."), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        window.location.reload();
      },
      className: "px-4 py-2 rounded-xl border font-medium"
    }, "Yenile"), /*#__PURE__*/React.createElement("button", {
      onClick: doSignOut,
      className: "mt-3 block w-full px-4 py-2 rounded-xl font-medium"
    }, "\xC7\u0131k\u0131\u015F")));
  }
  if (!profileHydrated) {
    return /*#__PURE__*/React.createElement(BrandLoad, null);
  }
  var sessUid = authSession.user && authSession.user.id;
  var boundUid = student.userProfile && student.userProfile.authUserId;
  if (sessUid && boundUid && sessUid !== boundUid) {
    return /*#__PURE__*/React.createElement(BrandLoad, null);
  }
  if (!boundUid) {
    return /*#__PURE__*/React.createElement(BrandLoad, null);
  }
  if (!student.profile || !student.profile.onboarded) {
    var Ob = OnboardCmp || window.KpssComponents && window.KpssComponents.OnboardingScreen || Onboarding;
    return React.createElement(Ob, {
      student: student,
      isDark: isDark,
      toggleDark: function () {
        StudentStore.setDark(!isDark);
      }
    });
  }
  function closeTool() {
    setExtra(null);
    setLazyCmp(null);
    setLazyErr("");
  }
  var toolProps = {
    student: student,
    plan: plan,
    kpssData: kpssData,
    onBack: closeTool,
    onClose: closeTool,
    onDone: function () {
      closeTool();
      if (window.SyncEngine) window.SyncEngine.sync();
    },
    onOpen: function (id) {
      setLazyCmp(null);
      setLazyErr("");
      setExtra(id);
    },
    onStartExam: function () {
      setLazyCmp(null);
      setLazyErr("");
      setExtra("exam");
    },
    liveView: liveView,
    onKonu: function (d, k) {
      closeTool();
      openKonu(d, k);
    }
  };
  if (extra && extra !== "onboarding" && extra !== "auth") {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen app-shell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "app-page pt-5",
      style: {
        paddingBottom: "2rem"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: closeTool,
      label: "Geri"
    })), lazyErr ? /*#__PURE__*/React.createElement("div", {
      className: "p-4 rounded-2xl panel text-sm"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-coral-600 mb-3"
    }, lazyErr), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        var spec = LAZY[extra];
        setLazyErr("");
        if (spec && window.JsxLoader) {
          window.JsxLoader.load(spec[0], spec[1]).then(function (C) {
            if (C) setLazyCmp(function () {
              return C;
            });
          }).catch(function (e) {
            setLazyErr(window.trError && window.trError(e, "Yüklenemedi") || "Yüklenemedi");
          });
        }
      },
      className: "px-4 py-2 rounded-xl btn-primary text-white text-sm"
    }, "Tekrar dene")) : LazyCmp ? React.createElement(LazyCmp, toolProps) : /*#__PURE__*/React.createElement("div", {
      className: "p-10 text-center text-zinc-500 text-sm"
    }, "Y\xFCkleniyor\u2026")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell" + (!inTest ? " has-nav" : "")
  }, announce && !inTest && !inMapPlay && !inDrillGame ? /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-50 duyuru-bar text-white shadow-lg",
    style: {
      paddingTop: "env(safe-area-inset-top, 0px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "app-page py-2.5 flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "duyuru-badge shrink-0 mt-0.5 text-[10px] font-black uppercase tracking-widest bg-white text-indigo-700 px-2 py-1 rounded-md"
  }, "Duyuru"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold leading-snug flex-1"
  }, announce))) : null, body, /*#__PURE__*/React.createElement(ImageZoom, null), !inTest ? /*#__PURE__*/React.createElement(CookieBar, null) : null, !inTest ? /*#__PURE__*/React.createElement(BottomNav, {
    nav: nav,
    streak: plan.streak || 0,
    onChange: function (id) {
      setNav(id);
      if (id !== "dersler") {
        setSelectedDers(null);
        setSelectedKonu(null);
        setViewMode("hub");
      }
      if (id === "dersler") {
        setSelectedDers(null);
        setSelectedKonu(null);
      }
      if (id !== "alistirmalar") {
        setDrillKind(null);
        setDrillMapTopic(null);
        setDrillDers(null);
        setDrillKonu(null);
      }
      if (id === "alistirmalar") {
        setDrillKind(null);
        setDrillMapTopic(null);
        setDrillDers(null);
        setDrillKonu(null);
      }
    }
  }) : null);
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));