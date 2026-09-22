/*jsx:babel-7.29.9-react-classic:26293:1snnk30*/
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

  function getLevelColor(score) {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-indigo-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  }
  function getLevelLabel(score) {
    if (score >= 80) return {
      text: "Mükemmel",
      emoji: "🌟"
    };
    if (score >= 60) return {
      text: "İyi",
      emoji: "✅"
    };
    if (score >= 40) return {
      text: "Orta",
      emoji: "📈"
    };
    return {
      text: "Gelişmeli",
      emoji: "📉"
    };
  }
  function getStatusBadge(lastStudyAt) {
    if (!lastStudyAt) return {
      label: "Hiç çalışmamış",
      color: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
    };
    var diff = (Date.now() - new Date(lastStudyAt).getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 1) return {
      label: "🟢 Bugün aktif",
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    };
    if (diff < 3) return {
      label: "🟡 3 gün içinde",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    };
    if (diff < 7) return {
      label: "🟠 7 gün içinde",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    };
    return {
      label: "🔴 7+ gün pasif",
      color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
    };
  }
  function formatDate(iso) {
    if (!iso) return "—";
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (e) {
      return "—";
    }
  }
  function formatTimeAgo(iso) {
    if (!iso) return "—";
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "—";
      var diff = Date.now() - d.getTime();
      var minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Az önce";
      if (minutes < 60) return minutes + " dk önce";
      var hours = Math.floor(minutes / 60);
      if (hours < 24) return hours + " saat önce";
      var days = Math.floor(hours / 24);
      if (days < 7) return days + " gün önce";
      return formatDate(iso);
    } catch (e) {
      return "—";
    }
  }

  // ============================================================
  // ANA BİLEŞEN
  // ============================================================

  function InstructorScreen(props) {
    const [group, setGroup] = useState({
      students: [],
      ready: false,
      name: "Sınıfım"
    });
    const [copied, setCopied] = useState(false);
    const [showDetails, setShowDetails] = useState(null);
    const [sortBy, setSortBy] = useState("questions");
    const [filter, setFilter] = useState("all");
    const st = props.student || {};
    const up = st.userProfile || {};
    const code = window.StudentStore && window.StudentStore.ensureReferralCode ? window.StudentStore.ensureReferralCode() : up.referralCode || "";
    var totQ = st.counters && st.counters.questions || 0;
    var streak = st.streak && st.streak.count || 0;
    var correct = st.counters && st.counters.correct || 0;
    var overallPct = totQ > 0 ? Math.round(correct / totQ * 100) : 0;

    // ---------- Group Fetch ----------
    useEffect(function () {
      if (!window.InstructorDashboard) return;
      window.InstructorDashboard.fetchGroup().then(function (g) {
        setGroup(g || {
          students: [],
          ready: false,
          name: "Sınıfım"
        });
      });
    }, []);

    // ---------- Sort & Filter ----------
    const sortedStudents = useMemo(function () {
      var students = group.students || [];

      // Filter
      if (filter === "active") {
        students = students.filter(function (s) {
          if (!s.last_study_at) return false;
          return Date.now() - new Date(s.last_study_at).getTime() < 24 * 60 * 60 * 1000;
        });
      } else if (filter === "inactive") {
        students = students.filter(function (s) {
          if (!s.last_study_at) return true;
          return Date.now() - new Date(s.last_study_at).getTime() > 7 * 24 * 60 * 60 * 1000;
        });
      } else if (filter === "top") {
        students = students.filter(function (s) {
          return (s.questions_total || 0) > 0;
        });
      }

      // Sort
      students = students.slice().sort(function (a, b) {
        if (sortBy === "questions") return (b.questions_total || 0) - (a.questions_total || 0);
        if (sortBy === "streak") return (b.streak_days || 0) - (a.streak_days || 0);
        if (sortBy === "recent") {
          var aDate = a.last_study_at ? new Date(a.last_study_at).getTime() : 0;
          var bDate = b.last_study_at ? new Date(b.last_study_at).getTime() : 0;
          return bDate - aDate;
        }
        if (sortBy === "name") {
          return (a.nickname || "").localeCompare(b.nickname || "");
        }
        return 0;
      });
      return students;
    }, [group.students, sortBy, filter]);

    // ---------- Group Stats ----------
    const groupStats = useMemo(function () {
      var students = group.students || [];
      var total = students.length;
      var active = students.filter(function (s) {
        if (!s.last_study_at) return false;
        return Date.now() - new Date(s.last_study_at).getTime() < 24 * 60 * 60 * 1000;
      }).length;
      var totalQ = students.reduce(function (sum, s) {
        return sum + (s.questions_total || 0);
      }, 0);
      var totalCorrect = students.reduce(function (sum, s) {
        return sum + (s.correct_total || 0);
      }, 0);
      var avgAccuracy = totalQ > 0 ? Math.round(totalCorrect / totalQ * 100) : 0;
      var totalStreak = students.reduce(function (sum, s) {
        return sum + (s.streak_days || 0);
      }, 0);
      var avgStreak = total > 0 ? Math.round(totalStreak / total) : 0;
      var topStudent = null;
      if (students.length > 0) {
        var sorted = students.slice().sort(function (a, b) {
          return (b.questions_total || 0) - (a.questions_total || 0);
        });
        if (sorted[0] && sorted[0].questions_total > 0) {
          topStudent = sorted[0];
        }
      }
      return {
        total,
        active,
        totalQ,
        avgAccuracy,
        avgStreak,
        topStudent
      };
    }, [group.students]);

    // ---------- Copy ----------
    function handleCopy() {
      if (code && navigator.clipboard) {
        navigator.clipboard.writeText(code);
      }
      setCopied(true);
      setTimeout(function () {
        setCopied(false);
      }, 2000);
    }

    // ============================================================
    // RENDER
    // ============================================================

    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-3xl mx-auto px-4 pb-10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center mb-6 slide-up"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl md:text-3xl font-black gradient-text"
    }, "\uD83C\uDFEB Kurum"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-0.5"
    }, "\xC7al\u0131\u015Fma grubun ve davet sistemi")), /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Geri"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 dark:text-stone-400 mb-6"
    }, "Arkada\u015F\u0131n\u0131 davet kodunla \xE7a\u011F\u0131r, kendi \xE7al\u0131\u015Fma \xF6zetin burada g\xF6r\xFCn\xFCr."), /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-5 mb-5 shadow-xl shadow-indigo-500/20 card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold uppercase tracking-wider opacity-70"
    }, "\uD83D\uDC64 Profil"), /*#__PURE__*/React.createElement("p", {
      className: "text-xl font-bold mt-0.5"
    }, up.nickname || st.profile && st.profile.name || "Öğrenci")), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold uppercase tracking-wider opacity-70"
    }, "\uD83D\uDCCD Seviye"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-bold"
    }, overallPct >= 80 ? "🌟 Mükemmel" : overallPct >= 60 ? "✅ İyi" : overallPct >= 40 ? "📈 Orta" : "📉 Gelişmeli"))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-bold"
    }, totQ), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] font-medium uppercase tracking-wider opacity-70"
    }, "\uD83D\uDCDD Soru")), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-bold"
    }, streak), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] font-medium uppercase tracking-wider opacity-70"
    }, "\uD83D\uDD25 Seri")), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-bold"
    }, "%", overallPct), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] font-medium uppercase tracking-wider opacity-70"
    }, "\uD83C\uDFAF Net"))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-4 border-t border-white/10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-xs opacity-70 mb-1"
    }, /*#__PURE__*/React.createElement("span", null, "Hedefe \u0130lerleme"), /*#__PURE__*/React.createElement("span", null, "%", Math.min(100, Math.round(totQ / 1000 * 100)))), /*#__PURE__*/React.createElement("div", {
      className: "h-2 rounded-full bg-white/20 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full bg-white/50 transition-all duration-500",
      style: {
        width: Math.min(100, Math.round(totQ / 1000 * 100)) + "%"
      }
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] opacity-50 mt-1"
    }, "Hedef: 1000 soru"))), /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass p-5 mb-5 card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "\uD83D\uDD11"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, "Davet Kodun")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400 dark:text-stone-500 mb-3"
    }, "Arkada\u015F\u0131n kay\u0131t olurken bu kodu girerse, sizin grubunuza eklenir."), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("code", {
      className: "flex-1 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400"
    }, code || "—"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: handleCopy,
      className: "px-4 py-2.5 rounded-2xl text-white font-semibold transition-all duration-200 " + (copied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20")
    }, copied ? "✅ Kopyalandı" : "📋 Kopyala"))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mt-6 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg"
    }, "\uD83D\uDC65"), /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold"
    }, group.ready ? group.name || "Sınıfım" : "Sınıfım"), group.ready && groupStats.total > 0 && /*#__PURE__*/React.createElement("span", {
      className: "text-xs bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full text-stone-500"
    }, groupStats.total, " \xFCye")), group.ready && groupStats.total > 0 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        props.onOpen && props.onOpen("leaderboard");
      },
      className: "text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
    }, "\uD83C\uDFC6 S\u0131ralama")), group.ready && groupStats.total > 0 && /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl glass p-3 text-center card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-indigo-600"
    }, groupStats.total), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400"
    }, "\uD83D\uDC65 \xDCye")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl glass p-3 text-center card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-emerald-600"
    }, groupStats.active), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400"
    }, "\uD83D\uDFE2 Bug\xFCn Aktif")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl glass p-3 text-center card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-amber-600"
    }, groupStats.avgAccuracy, "%"), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400"
    }, "\uD83C\uDFAF Ort. Net")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl glass p-3 text-center card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-bold text-purple-600"
    }, groupStats.avgStreak), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400"
    }, "\uD83D\uDD25 Ort. Seri"))), group.ready && groupStats.total > 0 && /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1"
    }, [{
      id: "all",
      label: "Tümü"
    }, {
      id: "active",
      label: "🟢 Aktif"
    }, {
      id: "inactive",
      label: "🔴 Pasif"
    }, {
      id: "top",
      label: "🏆 En İyiler"
    }].map(function (f) {
      return /*#__PURE__*/React.createElement("button", {
        key: f.id,
        onClick: function () {
          setFilter(f.id);
        },
        className: "px-3 py-1 rounded-full text-xs font-medium transition-all " + (filter === f.id ? "bg-indigo-600 text-white shadow-sm" : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700")
      }, f.label);
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1 ml-auto"
    }, [{
      id: "questions",
      label: "📝 Soru"
    }, {
      id: "streak",
      label: "🔥 Seri"
    }, {
      id: "recent",
      label: "🕐 Son"
    }, {
      id: "name",
      label: "🔤 Ad"
    }].map(function (s) {
      return /*#__PURE__*/React.createElement("button", {
        key: s.id,
        onClick: function () {
          setSortBy(s.id);
        },
        className: "px-2 py-1 rounded-full text-[10px] font-medium transition-all " + (sortBy === s.id ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300")
      }, s.label);
    }))), !group.ready ? /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass p-8 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-5xl mb-4"
    }, "\uD83C\uDFEB"), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-bold text-stone-600 dark:text-stone-300 mb-2"
    }, "Hen\xFCz Grup Yok"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 max-w-sm mx-auto"
    }, "Davet kodunu arkada\u015Flar\u0131nla payla\u015F. Kay\u0131t olan herkes otomatik olarak grubuna eklenir."), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 flex items-center justify-center gap-2 text-xs text-stone-400"
    }, /*#__PURE__*/React.createElement("span", {
      className: "px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 font-mono"
    }, code || "Kod oluşturuluyor..."))) : sortedStudents.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass p-8 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-4xl mb-3"
    }, "\uD83D\uDC40"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400"
    }, "Hen\xFCz \xFCye yok. Davet kodunu payla\u015F!")) : /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, sortedStudents.map(function (s, i) {
      var score = s.masteryScore != null ? s.masteryScore : 0;
      var color = getLevelColor(score);
      var level = getLevelLabel(score);
      var status = getStatusBadge(s.last_study_at);
      var isYou = s.user_id === up.authUserId;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "rounded-2xl glass p-4 card-hover transition-all duration-200 " + (isYou ? "border-l-4 border-l-indigo-500" : "")
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-semibold"
      }, s.nickname || "Öğrenci", isYou && /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] font-medium text-indigo-500 ml-1"
      }, "(Sen)")), /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] opacity-50"
      }, level.emoji)), /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap gap-3 mt-0.5 text-xs text-stone-400"
      }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDD ", s.questions_total || 0, " soru"), s.streak_days > 0 && /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD25 ", s.streak_days, " g\xFCn"), s.last_study_at && /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD50 ", formatTimeAgo(s.last_study_at)))), /*#__PURE__*/React.createElement("div", {
        className: "text-right shrink-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-xs font-bold px-2 py-0.5 rounded-full " + status.color
      }, status.label), /*#__PURE__*/React.createElement("span", {
        className: "text-sm font-bold"
      }, score, "%")), /*#__PURE__*/React.createElement("div", {
        className: "mt-1 h-1.5 w-24 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden ml-auto"
      }, /*#__PURE__*/React.createElement("div", {
        className: "h-full rounded-full " + color,
        style: {
          width: Math.min(100, score) + "%"
        }
      })))), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function () {
          setShowDetails(showDetails === s.user_id ? null : s.user_id);
        },
        className: "mt-2 text-[10px] text-stone-400 hover:text-stone-600 transition-colors"
      }, showDetails === s.user_id ? "▲ Gizle" : "▼ Detay"), showDetails === s.user_id && /*#__PURE__*/React.createElement("div", {
        className: "mt-2 pt-2 border-t border-stone-200 dark:border-stone-700 slide-up"
      }, /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-2 gap-1 text-xs text-stone-500"
      }, /*#__PURE__*/React.createElement("div", null, "Do\u011Fru: ", /*#__PURE__*/React.createElement("span", {
        className: "font-medium text-emerald-600"
      }, s.correct_total || 0)), /*#__PURE__*/React.createElement("div", null, "Kat\u0131lma: ", /*#__PURE__*/React.createElement("span", {
        className: "font-medium"
      }, formatDate(s.joined_at))), s.last_study_at && /*#__PURE__*/React.createElement("div", {
        className: "col-span-2"
      }, "Son \xE7al\u0131\u015Fma: ", /*#__PURE__*/React.createElement("span", {
        className: "font-medium"
      }, formatDate(s.last_study_at))))));
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        props.onOpen && props.onOpen("leaderboard");
      },
      className: "w-full mt-5 p-4 rounded-2xl glass text-left font-medium flex items-center justify-between group card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-2xl"
    }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "font-semibold"
    }, "T\xFCrkiye S\u0131ralamas\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400"
    }, "T\xFCm kullan\u0131c\u0131lar aras\u0131ndaki yerini g\xF6r"))), /*#__PURE__*/React.createElement("span", {
      className: "text-stone-300 group-hover:text-indigo-500 transition-colors"
    }, "\u2192")), /*#__PURE__*/React.createElement("div", {
      className: "mt-6 text-center text-[10px] text-stone-400"
    }, /*#__PURE__*/React.createElement("p", null, "\uD83D\uDCCA Veriler g\xFCnl\xFCk olarak g\xFCncellenir \xB7 Grup lideri takip sistemi")));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.InstructorScreen = InstructorScreen;
})();