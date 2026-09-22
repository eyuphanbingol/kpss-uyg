/*jsx:babel-7.29.9-react-classic:36801:1c7fsc0*/
(function () {
  const {
    useEffect,
    useMemo,
    useRef,
    useState
  } = React;
  var BackBtn = window.KpssBackBtn;

  // ============================================================
  // YARDIMCI FONKSİYONLAR
  // ============================================================

  function stripChoicePrefix(opt) {
    return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
  }
  function questionImages(q) {
    if (!q) return [];
    if (q.imgs) return q.imgs;
    if (!q.img) return [];
    return Array.isArray(q.img) ? q.img : [q.img];
  }
  function getOptionLetter(index) {
    return String.fromCharCode(65 + index);
  }
  function formatTime(seconds) {
    var mm = Math.floor(seconds / 60);
    var ss = String(seconds % 60).padStart(2, "0");
    return mm + ":" + ss;
  }
  function getTimeColor(seconds) {
    if (seconds <= 60) return "text-rose-500 animate-pulse";
    if (seconds <= 300) return "text-amber-500";
    return "text-indigo-600 dark:text-indigo-400";
  }
  function getTimeWarning(seconds) {
    if (seconds <= 60) return "⏰ Çok az zaman kaldı!";
    if (seconds <= 300) return "⚠️ Süre bitiyor!";
    return "";
  }

  // ============================================================
  // ANA BİLEŞEN
  // ============================================================

  function ExamSimulator(props) {
    const kpssData = props.kpssData;
    const student = props.student;

    // ---------- State ----------
    const [i, setI] = useState(0);
    const [picks, setPicks] = useState({});
    const [changes, setChanges] = useState(0);
    const [started, setStarted] = useState(false);
    const [left, setLeft] = useState(40 * 60);
    const [done, setDone] = useState(false);
    const [optic, setOptic] = useState(true);
    const [leaves, setLeaves] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [reviewMode, setReviewMode] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const finishedRef = useRef(false);
    const timerRef = useRef(null);
    const warn = student.profile.tabLeaveWarn !== false;

    // ---------- Items ----------
    const items = useMemo(function () {
      try {
        return StudyPlanner.mixedQuiz(kpssData, ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"], 40);
      } catch (e) {
        return [];
      }
    }, [kpssData]);

    // ---------- İstatistikler ----------
    const stats = useMemo(function () {
      var answered = 0;
      var unanswered = 0;
      items.forEach(function (_, idx) {
        if (picks[idx] != null) answered++;else unanswered++;
      });
      return {
        answered,
        unanswered,
        total: items.length
      };
    }, [items, picks]);

    // ---------- Timer ----------
    useEffect(function () {
      if (!started || done) return;
      if (left <= 0) {
        finish();
        return;
      }
      timerRef.current = setTimeout(function () {
        setLeft(function (prev) {
          return prev - 1;
        });
      }, 1000);
      return function () {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [started, done, left]);

    // ---------- Tab Warn ----------
    useEffect(function () {
      if (!started || !warn || done) return;
      function onVis() {
        if (document.hidden) {
          setLeaves(function (n) {
            var newCount = n + 1;
            if (newCount >= 3) {
              // 3. uyarıda otomatik bitir
              if (!finishedRef.current) {
                finish();
              }
            }
            return newCount;
          });
        }
      }
      document.addEventListener("visibilitychange", onVis);
      return function () {
        document.removeEventListener("visibilitychange", onVis);
      };
    }, [started, warn, done]);

    // ---------- Pick ----------
    function pick(idx) {
      if (picks[i] != null && picks[i] !== idx) {
        setChanges(function (prev) {
          return prev + 1;
        });
      }
      var n = Object.assign({}, picks);
      n[i] = idx;
      setPicks(n);
    }

    // ---------- Clear Answer ----------
    function clearAnswer() {
      var n = Object.assign({}, picks);
      delete n[i];
      setPicks(n);
    }

    // ---------- Finish ----------
    function finish() {
      if (finishedRef.current) return;
      finishedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      setDone(true);
      var correct = 0;
      var wrong = 0;
      var unanswered = 0;
      var dersStats = {};
      items.forEach(function (it, idx) {
        var picked = picks[idx];
        var ok = picked === it.q.correctAnswerIndex;
        if (ok) correct += 1;else if (picked != null) wrong += 1;else unanswered += 1;
        if (!dersStats[it.ders]) {
          dersStats[it.ders] = {
            correct: 0,
            wrong: 0,
            unanswered: 0,
            total: 0
          };
        }
        dersStats[it.ders].total += 1;
        if (ok) dersStats[it.ders].correct += 1;else if (picked != null) dersStats[it.ders].wrong += 1;else dersStats[it.ders].unanswered += 1;
        StudentStore.recordAnswer({
          ders: it.ders,
          konu: it.konu,
          id: it.id,
          correct: !!ok
        });
      });
      StudentStore.addSessionStats({
        questions: items.length,
        correct: correct
      });
      StudentStore.recordExamAttempt({
        total: items.length,
        correct: correct,
        changes: changes,
        secondsUsed: 40 * 60 - left
      });

      // Leaderboard
      var sb = window.SupabaseClient && window.SupabaseClient.get && window.SupabaseClient.get();
      var nick = student.userProfile && student.userProfile.nickname || "ogrenci";
      if (sb && student.userProfile && student.userProfile.authUserId) {
        sb.from("exam_ranks").insert({
          user_id: student.userProfile.authUserId,
          nickname: nick,
          score: correct,
          total: items.length,
          created_at: new Date().toISOString()
        }).then(function () {});
      }

      // Sonuçları set et
      setSelectedReview({
        correct: correct,
        wrong: wrong,
        unanswered: unanswered,
        total: items.length,
        dersStats: dersStats,
        changes: changes,
        secondsUsed: 40 * 60 - left
      });
    }

    // ---------- Navigation ----------
    function goToPrev() {
      if (i > 0) setI(i - 1);
    }
    function goToNext() {
      if (i < items.length - 1) setI(i + 1);
    }
    function goToQuestion(idx) {
      setI(idx);
    }

    // ---------- Toggle Review ----------
    function toggleReview() {
      setReviewMode(!reviewMode);
    }

    // ============================================================
    // RENDER: BOŞ
    // ============================================================

    if (!items.length) {
      return /*#__PURE__*/React.createElement("div", {
        className: "max-w-2xl mx-auto px-4 py-12 text-center"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-6xl mb-4"
      }, "\uD83D\uDCDD"), /*#__PURE__*/React.createElement("h2", {
        className: "text-xl font-bold text-stone-600 dark:text-stone-300 mb-2"
      }, "Soru Bulunamad\u0131"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-400 mb-6"
      }, "Deneme i\xE7in yeterli soru y\xFCklenmemi\u015F."), /*#__PURE__*/React.createElement("button", {
        onClick: props.onBack,
        className: "px-6 py-2.5 rounded-2xl btn-primary text-white font-semibold"
      }, "Geri D\xF6n"));
    }

    // ============================================================
    // RENDER: BAŞLANGIÇ EKRANI
    // ============================================================

    if (!started) {
      var premium = StudentStore.isPremium();
      var weekExams = (student.examAttempts || []).filter(function (a) {
        return a.at && a.at.slice(0, 10) >= (window.SyncEngine && window.SyncEngine.weekStart ? window.SyncEngine.weekStart() : "2000-01-01");
      }).length;
      var capped = !premium && weekExams >= (window.KpssConfig && window.KpssConfig.freeWeeklyExams || 2);
      return /*#__PURE__*/React.createElement("div", {
        className: "max-w-2xl mx-auto px-4 py-8 pb-10"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between items-center mb-6"
      }, /*#__PURE__*/React.createElement(BackBtn, {
        onClick: props.onBack,
        label: "Geri"
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-xs text-stone-400"
      }, "\uD83D\uDCCB Deneme")), /*#__PURE__*/React.createElement("div", {
        className: "text-center mb-8"
      }, /*#__PURE__*/React.createElement("div", {
        className: "inline-flex h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 items-center justify-center text-white text-3xl shadow-xl shadow-indigo-500/20 mb-4"
      }, "\uD83D\uDCDD"), /*#__PURE__*/React.createElement("h1", {
        className: "text-3xl md:text-4xl font-black gradient-text"
      }, "Tam Deneme"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-400 mt-2 max-w-md mx-auto"
      }, "Ger\xE7ek s\u0131nav temposu: ", /*#__PURE__*/React.createElement("strong", null, "40 soru"), " \xB7 ", /*#__PURE__*/React.createElement("strong", null, "40 dakika"))), /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-2 gap-3 mb-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl glass p-4 text-center card-hover"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-2xl font-bold text-indigo-600"
      }, "40"), /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-stone-400"
      }, "Soru")), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl glass p-4 text-center card-hover"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-2xl font-bold text-amber-600"
      }, "40'"), /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-stone-400"
      }, "S\xFCre"))), /*#__PURE__*/React.createElement("div", {
        className: "rounded-3xl glass p-5 mb-6 card-hover"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        checked: optic,
        onChange: function (e) {
          setOptic(e.target.checked);
        },
        className: "w-4 h-4 rounded border-stone-300 text-indigo-600 focus:ring-indigo-500"
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        className: "text-sm font-medium"
      }, "\uD83D\uDCCB Optik K\xE2\u011F\u0131t"), /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-stone-400"
      }, "Soru atlamana ve i\u015Faretlemene yard\u0131mc\u0131 olur")))), capped && /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-700 dark:text-amber-300 mb-4"
      }, "\u26A0\uFE0F Haftal\u0131k \xFCcretsiz deneme kotan doldu. Premium \xFCye olarak daha fazla deneme \xE7\xF6zebilirsin."), /*#__PURE__*/React.createElement("button", {
        disabled: capped,
        onClick: function () {
          setStarted(true);
        },
        className: "w-full py-4 rounded-2xl btn-primary text-white font-bold text-lg disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
      }, capped ? "🔒 Kullanım Hakkı Doldu" : "🚀 Denemeyi Başlat"), !premium && /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-stone-400 text-center mt-4"
      }, "\xDCcretsiz: haftada ", window.KpssConfig && window.KpssConfig.freeWeeklyExams || 2, " deneme"));
    }

    // ============================================================
    // RENDER: SONUÇ EKRANI
    // ============================================================

    if (done) {
      var result = selectedReview || {};
      var correct = result.correct || 0;
      var wrong = result.wrong || 0;
      var unanswered = result.unanswered || 0;
      var total = result.total || items.length;
      var pct = Math.round(correct / total * 100);
      var used = result.secondsUsed || 40 * 60 - left;
      var avg = total ? Math.round(used / total) : 0;
      var dersStats = result.dersStats || {};
      var level = pct >= 85 ? "🌟 Mükemmel" : pct >= 70 ? "✅ İyi" : pct >= 50 ? "📈 Orta" : "📉 Gelişmeli";
      var levelColor = pct >= 85 ? "text-emerald-600" : pct >= 70 ? "text-indigo-600" : pct >= 50 ? "text-amber-600" : "text-rose-600";
      return /*#__PURE__*/React.createElement("div", {
        className: "max-w-2xl mx-auto px-4 py-8 pb-10"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between items-center mb-6"
      }, /*#__PURE__*/React.createElement("h1", {
        className: "text-2xl font-black gradient-text"
      }, "\uD83D\uDCCA Deneme Sonucu"), /*#__PURE__*/React.createElement(BackBtn, {
        onClick: props.onBack,
        label: "Geri"
      })), /*#__PURE__*/React.createElement("div", {
        className: "text-center mb-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "relative inline-block"
      }, /*#__PURE__*/React.createElement("svg", {
        className: "w-36 h-36",
        viewBox: "0 0 120 120"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "60",
        cy: "60",
        r: "52",
        fill: "none",
        stroke: "#e2e8f0",
        strokeWidth: "8"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "60",
        cy: "60",
        r: "52",
        fill: "none",
        stroke: pct >= 85 ? "#10b981" : pct >= 70 ? "#4f46e5" : pct >= 50 ? "#f59e0b" : "#ef4444",
        strokeWidth: "8",
        strokeDasharray: pct * 3.27 + ", 327",
        strokeLinecap: "round",
        className: "progress-ring transition-all duration-1000"
      })), /*#__PURE__*/React.createElement("div", {
        className: "absolute inset-0 flex flex-col items-center justify-center"
      }, /*#__PURE__*/React.createElement("span", {
        className: "font-stat text-4xl font-bold text-indigo-600 dark:text-indigo-400"
      }, pct, "%"), /*#__PURE__*/React.createElement("span", {
        className: "text-xs text-stone-400"
      }, correct, "/", total))), /*#__PURE__*/React.createElement("p", {
        className: "text-lg font-bold mt-2 " + levelColor
      }, level)), /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-3 gap-3 mb-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl glass p-4 text-center"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-2xl font-bold text-emerald-600"
      }, correct), /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-stone-400"
      }, "\u2705 Do\u011Fru")), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl glass p-4 text-center"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-2xl font-bold text-rose-600"
      }, wrong), /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-stone-400"
      }, "\u274C Yanl\u0131\u015F")), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl glass p-4 text-center"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-2xl font-bold text-stone-400"
      }, unanswered), /*#__PURE__*/React.createElement("div", {
        className: "text-xs text-stone-400"
      }, "\u2B1C Bo\u015F"))), /*#__PURE__*/React.createElement("div", {
        className: "grid grid-cols-2 gap-3 mb-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl glass p-4 text-center card-hover"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-stone-400"
      }, "S\xFCre"), /*#__PURE__*/React.createElement("p", {
        className: "font-stat text-lg font-bold"
      }, Math.floor(used / 60), "' ", used % 60, "\"")), /*#__PURE__*/React.createElement("div", {
        className: "rounded-2xl glass p-4 text-center card-hover"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-xs text-stone-400"
      }, "Soru Ba\u015F\u0131 S\xFCre"), /*#__PURE__*/React.createElement("p", {
        className: "font-stat text-lg font-bold"
      }, avg, " sn"))), Object.keys(dersStats).length > 0 && /*#__PURE__*/React.createElement("div", {
        className: "rounded-3xl glass p-5 mb-6"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-3"
      }, "\uD83D\uDCDA Ders Baz\u0131nda Performans"), Object.keys(dersStats).map(function (ders) {
        var d = dersStats[ders];
        var p = d.total ? Math.round(d.correct / d.total * 100) : 0;
        var colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981"];
        var idx = Object.keys(dersStats).indexOf(ders);
        return /*#__PURE__*/React.createElement("div", {
          key: ders,
          className: "mb-2 last:mb-0"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex justify-between text-sm mb-1"
        }, /*#__PURE__*/React.createElement("span", {
          className: "font-medium"
        }, ders), /*#__PURE__*/React.createElement("span", {
          className: "font-stat"
        }, d.correct, "/", d.total, " (%", p, ")")), /*#__PURE__*/React.createElement("div", {
          className: "h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden"
        }, /*#__PURE__*/React.createElement("div", {
          className: "h-full rounded-full transition-all duration-500",
          style: {
            width: p + "%",
            background: colors[idx % colors.length]
          }
        })));
      })), /*#__PURE__*/React.createElement("div", {
        className: "flex gap-3"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function () {
          setStarted(false);
          setDone(false);
          setPicks({});
          setChanges(0);
          setLeft(40 * 60);
          finishedRef.current = false;
        },
        className: "flex-1 py-3.5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
      }, "\uD83D\uDD04 Tekrar Dene"), /*#__PURE__*/React.createElement("button", {
        onClick: props.onBack,
        className: "flex-1 py-3.5 rounded-2xl btn-primary text-white font-semibold"
      }, "\uD83D\uDCCB Sonu\xE7lar\u0131 \u0130ncele")));
    }

    // ============================================================
    // RENDER: SINAV EKRANI
    // ============================================================

    var it = items[i];
    var mm = Math.floor(left / 60);
    var ss = String(left % 60).padStart(2, "0");
    var timeColor = getTimeColor(left);
    var timeWarning = getTimeWarning(left);
    var progress = (i + 1) / items.length * 100;

    // Optik Grid
    var opticGrid = optic ? /*#__PURE__*/React.createElement("div", {
      className: "bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-700 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-stone-400"
    }, "\uD83D\uDCCB Optik"), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-stone-400"
    }, stats.answered, "/", stats.total, " i\u015Faretli")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-5 gap-1.5"
    }, items.map(function (_, idx) {
      var isActive = i === idx;
      var isAnswered = picks[idx] != null;
      var isCorrect = picks[idx] === items[idx].q.correctAnswerIndex;
      return /*#__PURE__*/React.createElement("button", {
        key: idx,
        onClick: function () {
          goToQuestion(idx);
        },
        className: "h-9 w-9 text-xs rounded-lg font-stat transition-all duration-200 " + (isActive ? "ring-2 ring-indigo-500 ring-offset-2 bg-indigo-600 text-white scale-110" : isAnswered ? isCorrect ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" : "bg-stone-100 dark:bg-stone-800 text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700")
      }, idx + 1);
    }))) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-5xl mx-auto px-4 py-4 pb-10"
    }, leaves > 0 && /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl p-4 mb-4 flex items-center justify-between " + (leaves >= 3 ? "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300" : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300")
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xl"
    }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-medium"
    }, leaves >= 3 ? "Sınav otomatik olarak sonlandırıldı!" : `${leaves}. kez sınav dışına çıktın. ${3 - leaves} hakkın kaldı.`)), leaves < 3 && /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold"
    }, 3 - leaves, " kald\u0131")), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-4 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-medium text-stone-600 dark:text-stone-300"
    }, "Soru ", /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, i + 1), "/", items.length), /*#__PURE__*/React.createElement("div", {
      className: "w-24 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden hidden sm:block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300",
      style: {
        width: progress + "%"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-stat text-xl font-bold " + timeColor
    }, formatTime(left)), timeWarning && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold text-rose-500 animate-pulse hidden sm:inline"
    }, timeWarning), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setShowConfirm(true);
      },
      className: "text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
    }, "\u23F9 Bitir"))), /*#__PURE__*/React.createElement("div", {
      className: "w-full h-1 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden mb-4 sm:hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300",
      style: {
        width: progress + "%"
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 p-6 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 mb-4 flex-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
    }, it.ders || "—"), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-stone-400"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-stone-500 dark:text-stone-400"
    }, it.konu ? window.konuLabel ? window.konuLabel(it.konu) : it.konu : "—"), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto text-[10px] text-stone-400 font-mono"
    }, i + 1, "/", items.length)), /*#__PURE__*/React.createElement("div", {
      className: "text-base md:text-lg font-medium leading-relaxed mb-5"
    }, it.q.question, questionImages(it.q).map(function (src, ii) {
      return /*#__PURE__*/React.createElement("img", {
        key: src + ii,
        src: src,
        alt: it.q.imgAlt || "Soru görseli",
        className: "mt-4 w-full h-auto rounded-2xl object-contain bg-[#F6F1E4] border border-stone-200 dark:border-stone-700"
      });
    })), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, (it.q.options || []).map(function (opt, idx) {
      var on = picks[i] === idx;
      var letter = getOptionLetter(idx);
      return /*#__PURE__*/React.createElement("button", {
        key: idx,
        onClick: function () {
          pick(idx);
        },
        className: "w-full text-left p-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 " + (on ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/10" : "border-stone-200 dark:border-stone-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-stone-50 dark:hover:bg-stone-800/50")
      }, /*#__PURE__*/React.createElement("span", {
        className: "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " + (on ? "bg-indigo-600 text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-500")
      }, letter), /*#__PURE__*/React.createElement("span", {
        className: "text-sm " + (on ? "text-indigo-800 dark:text-indigo-200 font-medium" : "text-stone-700 dark:text-stone-300")
      }, stripChoicePrefix(opt)), on && /*#__PURE__*/React.createElement("span", {
        className: "ml-auto text-indigo-600"
      }, "\u2713"));
    })), picks[i] != null && /*#__PURE__*/React.createElement("button", {
      onClick: clearAnswer,
      className: "mt-3 text-xs text-stone-400 hover:text-rose-500 transition-colors"
    }, "\u2715 Cevab\u0131 temizle")), /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, opticGrid, /*#__PURE__*/React.createElement("div", {
      className: "bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-700"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-stone-400 mb-2"
    }, "\uD83D\uDCCA Durum"), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1.5 text-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-stone-500"
    }, "Cevaplanan"), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-emerald-600"
    }, stats.answered)), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-stone-500"
    }, "Bo\u015F"), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-stone-400"
    }, stats.unanswered)), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between pt-1.5 border-t border-stone-100 dark:border-stone-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-stone-500"
    }, "De\u011Fi\u015Fiklik"), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-amber-600"
    }, changes)))), timeWarning && /*#__PURE__*/React.createElement("div", {
      className: "bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-3 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm text-center animate-pulse"
    }, "\u23F0 ", timeWarning))), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3 mt-4"
    }, /*#__PURE__*/React.createElement("button", {
      disabled: i === 0,
      onClick: goToPrev,
      className: "flex-1 py-3 rounded-2xl border-2 border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    }, "\u2190 \xD6nceki"), /*#__PURE__*/React.createElement("button", {
      disabled: i === items.length - 1,
      onClick: goToNext,
      className: "flex-1 py-3 rounded-2xl btn-primary text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
    }, "Sonraki \u2192")), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 text-center text-[10px] text-stone-400 flex flex-wrap gap-4 justify-center"
    }, /*#__PURE__*/React.createElement("span", null, "\u2328\uFE0F ", /*#__PURE__*/React.createElement("kbd", {
      className: "px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono"
    }, "\u2190"), " ", /*#__PURE__*/React.createElement("kbd", {
      className: "px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono"
    }, "\u2192"), " Ge\xE7i\u015F"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", {
      className: "px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono"
    }, "1"), "-", /*#__PURE__*/React.createElement("kbd", {
      className: "px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono"
    }, "4"), " \u015E\u0131k se\xE7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", {
      className: "px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono"
    }, "C"), " Temizle"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("kbd", {
      className: "px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono"
    }, "Esc"), " Bitir")), showConfirm && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-xl font-bold mb-2"
    }, "\u23F9 S\u0131nav\u0131 Bitir?"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500 mb-4"
    }, stats.unanswered > 0 ? `${stats.unanswered} soruyu boş bıraktın. Emin misin?` : 'Tüm soruları cevapladın. Sonuçları görmek ister misin?'), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setShowConfirm(false);
      },
      className: "flex-1 py-2.5 rounded-xl border-2 border-stone-200 font-medium hover:bg-stone-50 transition-colors"
    }, "Devam Et"), /*#__PURE__*/React.createElement("button", {
      onClick: function () {
        setShowConfirm(false);
        finish();
      },
      className: "flex-1 py-2.5 rounded-xl btn-primary text-white font-semibold"
    }, "Bitir")))));
  }

  // ============================================================
  // EXPORT
  // ============================================================

  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.ExamSimulator = ExamSimulator;
})();