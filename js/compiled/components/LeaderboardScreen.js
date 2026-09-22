/*jsx:babel-7.29.9-react-classic:19222:3spybg*/
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

  function initials(n) {
    n = String(n || "?").trim();
    if (n.includes(" ")) {
      var parts = n.split(" ");
      return (parts[0]?.[0] || "?").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
    }
    return (n.slice(0, 1) || "?").toUpperCase();
  }
  function getMedalColor(rank) {
    if (rank === 0) return {
      bg: "from-amber-400 to-amber-600",
      text: "text-amber-500",
      shadow: "shadow-amber-500/30"
    };
    if (rank === 1) return {
      bg: "from-stone-300 to-stone-400",
      text: "text-stone-400",
      shadow: "shadow-stone-400/30"
    };
    if (rank === 2) return {
      bg: "from-orange-400 to-orange-600",
      text: "text-orange-500",
      shadow: "shadow-orange-500/30"
    };
    return {
      bg: "from-indigo-500 to-purple-500",
      text: "text-indigo-400",
      shadow: "shadow-indigo-500/20"
    };
  }
  function getMedalEmoji(rank) {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return "🏅";
  }
  function getRankEmoji(rank) {
    if (rank === 0) return "👑";
    if (rank === 1) return "⭐";
    if (rank === 2) return "🌟";
    return "";
  }
  function getScoreColor(rank) {
    if (rank === 0) return "text-amber-500";
    if (rank === 1) return "text-stone-400";
    if (rank === 2) return "text-orange-500";
    return "text-indigo-400";
  }
  function formatNumber(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  }
  function getLevelBadge(rank) {
    if (rank === 0) return {
      label: "🏆 Şampiyon",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    };
    if (rank === 1) return {
      label: "🥈 İkinci",
      color: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
    };
    if (rank === 2) return {
      label: "🥉 Üçüncü",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    };
    return null;
  }

  // ============================================================
  // ANA BİLEŞEN
  // ============================================================

  function LeaderboardScreen(props) {
    const [week, setWeek] = useState([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    const [myRank, setMyRank] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const me = props.student && props.student.userProfile && props.student.userProfile.nickname || "";
    const meInitials = initials(me);

    // ---------- Fetch ----------
    useEffect(function () {
      var sb = window.SupabaseClient && window.SupabaseClient.get();
      if (!sb) {
        setErr("📡 Çevrimdışı. Sıralama bağlanınca açılır.");
        setLoading(false);
        return;
      }
      function loadRows() {
        return sb.from("leaderboard_public").select("nickname,questions,kind").limit(200).then(function (res) {
          if (res.error) {
            setErr("📊 Sıralama şu an yok.");
          } else {
            var rows = (res.data || []).filter(function (x) {
              return x.kind !== "exam";
            });
            rows.sort(function (a, b) {
              return (Number(b.questions) || 0) - (Number(a.questions) || 0);
            });
            setWeek(rows);
            setErr("");
          }
          setLoading(false);
        });
      }
      var ready = window.SyncEngine && window.SyncEngine.sync ? window.SyncEngine.sync().catch(function () {
        return null;
      }) : Promise.resolve();
      Promise.resolve(ready).then(loadRows);
    }, []);

    // ---------- List ----------
    var list = week;
    var myScore = 0;
    Object.keys(props.student && props.student.sessions || {}).forEach(function (d) {
      myScore += Number(props.student.sessions[d].correct) || 0;
    });
    if (props.student && props.student.counters) {
      myScore = Math.max(myScore, Number(props.student.counters.correct) || 0);
    }
    var myIdx = -1;
    list.forEach(function (r, i) {
      if (!me || r.nickname !== me) return;
      if (myIdx < 0) myIdx = i;
      if (Number(r.questions) === myScore) myIdx = i;
    });

    // ---------- Top 3 ----------
    var top = list.slice(0, 3);
    var rest = list.slice(3);

    // ---------- My Rank ----------
    var myRankData = myIdx >= 0 ? {
      rank: myIdx + 1,
      score: list[myIdx].questions || 0,
      nickname: list[myIdx].nickname
    } : null;

    // ---------- Total Participants ----------
    var totalParticipants = list.length;

    // ---------- Medal Colors ----------
    var medalColors = [{
      bg: "from-amber-400 to-amber-600",
      text: "text-amber-500",
      shadow: "shadow-amber-500/30",
      emoji: "🥇"
    }, {
      bg: "from-stone-300 to-stone-400",
      text: "text-stone-400",
      shadow: "shadow-stone-400/30",
      emoji: "🥈"
    }, {
      bg: "from-orange-400 to-orange-600",
      text: "text-orange-500",
      shadow: "shadow-orange-500/30",
      emoji: "🥉"
    }];

    // ============================================================
    // RENDER
    // ============================================================

    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-2xl mx-auto px-4 py-6 pb-24 relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center mb-4 slide-up"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl md:text-3xl font-black gradient-text"
    }, "\uD83C\uDFC6 T\xFCrkiye"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-0.5"
    }, "En \xE7ok do\u011Fru \xE7\xF6zenler")), /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Geri"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400 dark:text-stone-500 mb-5"
    }, "\uD83D\uDCCA S\u0131ra: profildeki net ile ayn\u0131 toplam do\u011Fru \xB7 Takma ad g\xF6r\xFCn\xFCr"), loading && /*#__PURE__*/React.createElement("div", {
      className: "text-center py-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 mt-3"
    }, "Liderlik tablosu y\xFCkleniyor...")), err && !loading && /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 p-4 text-sm text-rose-700 dark:text-rose-300 mb-5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg mr-2"
    }, "\u26A0\uFE0F"), err), !loading && list.length === 0 && !err && /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass p-12 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-6xl mb-4"
    }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-bold text-stone-600 dark:text-stone-300 mb-2"
    }, "Hen\xFCz Veri Yok"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-400 max-w-sm mx-auto"
    }, "Bu hafta hen\xFCz kimse s\u0131ralamaya girmemi\u015F. \u0130lk sen olmak ister misin?")), !loading && list.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mb-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-end justify-center gap-4"
    }, top[1] ? /*#__PURE__*/React.createElement("div", {
      className: "flex-1 text-center slide-up",
      style: {
        animationDelay: "0.1s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center text-2xl text-white shadow-lg shadow-stone-400/30 ring-4 ring-white dark:ring-stone-800"
    }, initials(top[1].nickname)), /*#__PURE__*/React.createElement("div", {
      className: "absolute -top-1 -right-1 text-2xl"
    }, "\uD83E\uDD48")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-medium mt-2 truncate max-w-[80px] mx-auto"
    }, top[1].nickname), /*#__PURE__*/React.createElement("div", {
      className: "font-stat text-lg font-bold text-stone-400"
    }, formatNumber(top[1].questions)), /*#__PURE__*/React.createElement("div", {
      className: "h-1 w-full rounded-full bg-stone-300 dark:bg-stone-700 mt-1"
    })) : /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }), top[0] && /*#__PURE__*/React.createElement("div", {
      className: "flex-1 text-center slide-up",
      style: {
        animationDelay: "0.2s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl text-white shadow-2xl shadow-amber-500/30 ring-4 ring-white dark:ring-stone-800"
    }, initials(top[0].nickname)), /*#__PURE__*/React.createElement("div", {
      className: "absolute -top-2 -right-1 text-3xl"
    }, "\uD83D\uDC51")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold mt-2 truncate max-w-[80px] mx-auto"
    }, top[0].nickname), /*#__PURE__*/React.createElement("div", {
      className: "font-stat text-2xl font-bold text-amber-500"
    }, formatNumber(top[0].questions)), /*#__PURE__*/React.createElement("div", {
      className: "h-1.5 w-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mt-1 shadow-sm shadow-amber-500/30"
    })), top[2] ? /*#__PURE__*/React.createElement("div", {
      className: "flex-1 text-center slide-up",
      style: {
        animationDelay: "0.3s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl text-white shadow-lg shadow-orange-500/30 ring-4 ring-white dark:ring-stone-800"
    }, initials(top[2].nickname)), /*#__PURE__*/React.createElement("div", {
      className: "absolute -top-1 -right-1 text-xl"
    }, "\uD83E\uDD49")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-medium mt-2 truncate max-w-[80px] mx-auto"
    }, top[2].nickname), /*#__PURE__*/React.createElement("div", {
      className: "font-stat text-lg font-bold text-orange-500"
    }, formatNumber(top[2].questions)), /*#__PURE__*/React.createElement("div", {
      className: "h-1 w-full rounded-full bg-orange-300 dark:bg-orange-700 mt-1"
    })) : /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-center text-xs text-stone-400 mt-4"
    }, "\uD83D\uDC65 ", totalParticipants, " kat\u0131l\u0131mc\u0131")), !loading && list.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl glass overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "px-4 py-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700 flex justify-between text-xs font-medium text-stone-400 uppercase tracking-wider"
    }, /*#__PURE__*/React.createElement("span", null, "S\u0131ralama"), /*#__PURE__*/React.createElement("span", null, "Do\u011Fru")), /*#__PURE__*/React.createElement("div", {
      className: "divide-y divide-stone-100 dark:divide-stone-800 max-h-96 overflow-y-auto"
    }, (rest.length ? rest : []).map(function (r, i) {
      var rank = i + 4;
      var isMe = me && r.nickname === me;
      var medalEmoji = getMedalEmoji(rank - 1);
      var rankEmoji = getRankEmoji(rank - 1);
      return /*#__PURE__*/React.createElement("div", {
        key: rank,
        className: "flex items-center justify-between px-4 py-3 transition-colors " + (isMe ? "bg-indigo-50 dark:bg-indigo-950/20 border-l-4 border-l-indigo-500" : "hover:bg-stone-50 dark:hover:bg-stone-800/30")
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3 min-w-0"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-stat text-sm text-stone-400 w-8 text-right"
      }, rank), rank <= 10 && /*#__PURE__*/React.createElement("span", {
        className: "text-sm"
      }, medalEmoji), /*#__PURE__*/React.createElement("span", {
        className: "text-sm truncate flex-1 " + (isMe ? "font-semibold text-indigo-700 dark:text-indigo-300" : "")
      }, r.nickname, isMe && /*#__PURE__*/React.createElement("span", {
        className: "ml-2 text-[10px] font-medium text-indigo-500"
      }, "(Sen)")), rank <= 3 && rankEmoji && /*#__PURE__*/React.createElement("span", {
        className: "text-xs"
      }, rankEmoji)), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-stat text-sm font-bold " + (rank <= 3 ? getScoreColor(rank - 1) : "")
      }, r.questions || r.score || 0), rank <= 3 && /*#__PURE__*/React.createElement("span", {
        className: "text-xs opacity-50"
      }, "\uD83C\uDFC5")));
    }))), !loading && list.length > 0 && myIdx >= 0 && /*#__PURE__*/React.createElement("div", {
      className: "fixed bottom-0 left-0 right-0 z-40 px-4 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 shadow-lg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-2xl mx-auto flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
    }, meInitials || "?"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400"
    }, "Senin S\u0131ran"), /*#__PURE__*/React.createElement("p", {
      className: "font-bold text-sm"
    }, myRankData.rank, ". ", me || "Sen"))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400"
    }, "Do\u011Fru"), /*#__PURE__*/React.createElement("p", {
      className: "font-stat text-xl font-bold text-indigo-600"
    }, myRankData.score)))), !loading && list.length > 0 && myIdx < 0 && me && /*#__PURE__*/React.createElement("div", {
      className: "fixed bottom-0 left-0 right-0 z-40 px-4 py-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 shadow-lg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-2xl mx-auto flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-10 w-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-500 font-bold text-sm"
    }, meInitials || "?"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400"
    }, "Senin Durumun"), /*#__PURE__*/React.createElement("p", {
      className: "font-bold text-sm text-stone-500"
    }, "Listede de\u011Filsin"))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400"
    }, "Bu hafta"), /*#__PURE__*/React.createElement("p", {
      className: "font-stat text-sm text-stone-400"
    }, "0 do\u011Fru")))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: "80px"
      }
    }));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.LeaderboardScreen = LeaderboardScreen;
})();