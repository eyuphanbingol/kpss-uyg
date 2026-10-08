/*jsx:babel-7.29.9-react-classic:76995:qd1db7*/
(function () {
  const {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback
  } = React;
  var BackBtn = window.KpssBackBtn;
  var L = window.LiveExam;
  var C = window.LiveClient;

  // Soru metni biçimi (L.richParse): __söz__ altı çizili, __söz__(II) altında numara, **söz** kalın,
  // \frac{pay}{payda} alt alta kesir, \sqrt{x} / √15 kök, x^{2} üs, a_{1} alt indis
  function Rich(props) {
    return L.richParse(props.text).map(function (x, i) {
      if (x.f) return /*#__PURE__*/React.createElement("span", {
        key: i,
        className: "live-frac"
      }, /*#__PURE__*/React.createElement("span", {
        className: "live-frac-n"
      }, /*#__PURE__*/React.createElement(Rich, {
        text: x.f[0]
      })), /*#__PURE__*/React.createElement("span", {
        className: "live-frac-d"
      }, /*#__PURE__*/React.createElement(Rich, {
        text: x.f[1]
      })));
      if (x.r != null) return /*#__PURE__*/React.createElement("span", {
        key: i,
        className: "live-sqrt"
      }, "\u221A", /*#__PURE__*/React.createElement("span", {
        className: "live-sqrt-in"
      }, /*#__PURE__*/React.createElement(Rich, {
        text: x.r
      })));
      if (x.sp != null) return /*#__PURE__*/React.createElement("sup", {
        key: i
      }, /*#__PURE__*/React.createElement(Rich, {
        text: x.sp
      }));
      if (x.sb != null) return /*#__PURE__*/React.createElement("sub", {
        key: i
      }, /*#__PURE__*/React.createElement(Rich, {
        text: x.sb
      }));
      if (x.b) return /*#__PURE__*/React.createElement("b", {
        key: i
      }, x.t);
      if (!x.u) return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, x.t);
      if (!x.m) return /*#__PURE__*/React.createElement("u", {
        key: i,
        className: "live-u"
      }, x.t);
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        className: "live-mark"
      }, /*#__PURE__*/React.createElement("u", {
        className: "live-u"
      }, x.t), /*#__PURE__*/React.createElement("span", {
        className: "live-num"
      }, x.m));
    });
  }

  // ============================================================
  // Canlı deneme: sınav, toplu görünüm (optik form), sonuç raporu, arşiv, gelişim
  // Sunucu kuralları supabase/patch-live-exam.sql; ortak motor js/liveExam.js
  // ============================================================

  function konuName(k) {
    return window.konuLabel ? window.konuLabel(k) : String(k || "").trim();
  }
  function hasContent(kpssData, ders, konu) {
    var kd = kpssData && kpssData[ders] && kpssData[ders][konu];
    return !!(kd && ((kd.notlar || []).length || (kd.sorular || []).length));
  }
  function pct(x) {
    return x == null ? "–" : String(Math.round(Number(x) * 10) / 10).replace(".", ",");
  }
  function Panel(props) {
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-3xl glass p-5 sm:p-6 " + (props.className || ""),
      "aria-label": props.label
    }, props.children);
  }
  function Kicker(props) {
    return /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
    }, props.children);
  }
  function Stat(props) {
    return /*#__PURE__*/React.createElement("div", {
      className: "rounded-2xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 p-3 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-stat font-black " + (props.big ? "text-3xl" : "text-xl")
    }, props.value), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-stone-500 mt-0.5"
    }, props.label));
  }
  function KonuLink(props) {
    var label = props.ders + " / " + konuName(props.konu);
    if (props.onKonu && hasContent(props.kpssData, props.ders, props.konu)) {
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "text-left font-semibold text-teal-700 dark:text-teal-300 hover:underline",
        onClick: function () {
          props.onKonu(props.ders, props.konu);
        }
      }, label, " \u2192");
    }
    return /*#__PURE__*/React.createElement("span", {
      className: "font-semibold"
    }, label, " ", /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-normal text-stone-400"
    }, "(konu anlat\u0131m\u0131 yak\u0131nda)"));
  }

  // ============================================================
  // OPTİK FORM GÖRÜNÜMÜ (120 cevap tek ekranda; kâğıt formla aynı dil)
  // ============================================================
  function OpticGrid(props) {
    var answers = props.answers || {};
    function block(from, to, title) {
      var rows = [];
      for (var no = from; no <= to; no++) rows.push(no);
      return /*#__PURE__*/React.createElement("div", {
        className: "optic-block"
      }, /*#__PURE__*/React.createElement("p", {
        className: "optic-title"
      }, title), /*#__PURE__*/React.createElement("div", {
        className: "optic-cols"
      }, [0, 1, 2].map(function (col) {
        return /*#__PURE__*/React.createElement("div", {
          key: col,
          className: "optic-col"
        }, rows.slice(col * 20, col * 20 + 20).map(function (n) {
          var a = answers[n] && answers[n].c;
          var correct = props.key_ && props.key_[n];
          var flag = props.flags && props.flags[n];
          return /*#__PURE__*/React.createElement("div", {
            key: n,
            className: "optic-row" + (props.current === n ? " is-current" : "") + (flag ? " is-flag-" + flag : ""),
            title: flag === "double" ? "Çift işaret: boş sayılır, düzelt" : flag === "uncertain" ? "Kararsız okuma: kontrol et" : undefined
          }, /*#__PURE__*/React.createElement("button", {
            type: "button",
            className: "optic-no",
            onClick: function () {
              props.onJump && props.onJump(n);
            },
            "aria-label": "Soru " + n + "'e git"
          }, n), L.LETTERS.map(function (l) {
            var on = a === l;
            var cls = "optic-bubble" + (on ? " is-on" : "");
            if (correct) {
              if (l === correct) cls += " is-key";
              if (on && l !== correct) cls += " is-wrong";
            }
            return /*#__PURE__*/React.createElement("button", {
              key: l,
              type: "button",
              className: cls,
              disabled: !props.onPick,
              "aria-label": "Soru " + n + " " + l + (on ? " (işaretli)" : "") + (flag === "double" ? ", çift işaret" : flag === "uncertain" ? ", kararsız okuma" : ""),
              onClick: function () {
                props.onPick && props.onPick(n, on ? null : l);
              }
            }, l);
          }));
        }));
      })));
    }
    var filled = Object.keys(answers).filter(function (k) {
      return answers[k] && answers[k].c;
    }).length;
    return /*#__PURE__*/React.createElement("div", {
      className: "optic-sheet",
      role: "group",
      "aria-label": "Optik form g\xF6r\xFCn\xFCm\xFC"
    }, /*#__PURE__*/React.createElement("div", {
      className: "optic-head"
    }, /*#__PURE__*/React.createElement("span", null, props.head || "ATANLY · CANLI DENEME · OPTİK FORM"), /*#__PURE__*/React.createElement("span", null, filled, " / 120 i\u015Faretli")), block(1, 60, "GENEL YETENEK (1–60)"), block(61, 120, "GENEL KÜLTÜR (61–120)"));
  }

  // ============================================================
  // SINAV
  // ============================================================
  function ExamRunner(props) {
    var examId = props.examId;
    const [stage, setStage] = useState("enter"); // enter | loading | run | ended | error
    const [err, setErr] = useState(null);
    const [exam, setExam] = useState(null);
    const [qs, setQs] = useState([]);
    const [idx, setIdx] = useState(0);
    const [grid, setGrid] = useState(false);
    const [, setTick] = useState(0);
    const [sync, setSync] = useState({
      pending: 0
    });
    const [fatal, setFatal] = useState(null);
    const [confirmEnd, setConfirmEnd] = useState(false);
    var clockRef = useRef(null);
    var queueRef = useRef(null);
    var seenAt = useRef(0);
    var dev = useMemo(function () {
      return C.deviceId();
    }, []);
    function onQueueState(s) {
      setSync(s);
      if (s && s.error && s.error.fatal) setFatal(s.error);
    }

    // giriş: sunucudan anahtar, kalan süre ve kayıtlı cevaplar
    useEffect(function () {
      var alive = true;
      function start(data, offline) {
        var clock = L.createClock(offline ? Date.now() + (data.offset || 0) : data.now);
        clockRef.current = clock;
        if (!offline) C.rememberEntry(examId, data, data.now - Date.now());
        var q = C.makeQueue(examId, onQueueState);
        if (!offline) q.seed(data.answers || []);
        queueRef.current = q;
        setExam(data.exam);
        setStage("loading");
        return C.openBooklet(examId, data.key, data.sha).then(function (bk) {
          if (!alive) return;
          setQs(bk.questions || []);
          setStage("run");
          q.flush();
        });
      }
      C.rpc("live_enter", {
        p_exam: examId,
        p_device: dev
      }).then(function (data) {
        if (!alive) return;
        if (data && data.error) {
          setErr({
            code: data.error,
            message: data.message
          });
          setStage("error");
          return;
        }
        return start(data, false);
      }).catch(function (e) {
        if (!alive) return;
        var saved = e.network ? C.recallEntry(examId) : null;
        if (saved && saved.key) return start(saved, true);
        setErr(e);
        setStage("error");
      });
      return function () {
        alive = false;
        if (queueRef.current) queueRef.current.stop();
      };
    }, [examId]);

    // saniyelik saat + dakikalık sunucu eşitlemesi
    useEffect(function () {
      if (stage !== "run") return;
      var t = setInterval(function () {
        setTick(function (x) {
          return x + 1;
        });
      }, 1000);
      var s = setInterval(function () {
        C.rpc("live_now").then(function (r) {
          if (r && clockRef.current) clockRef.current.sync(r.now);
        }).catch(function () {});
      }, 60000);
      function online() {
        if (queueRef.current) queueRef.current.flush();
      }
      window.addEventListener("online", online);
      return function () {
        clearInterval(t);
        clearInterval(s);
        window.removeEventListener("online", online);
      };
    }, [stage]);
    var now = clockRef.current ? clockRef.current.now() : 0;
    var endsAt = exam ? L.ms(exam.ends_at) : 0;
    var left = endsAt - now;

    // süre bitti: bekleyenleri gönder, sonuca geç
    useEffect(function () {
      if (stage === "run" && exam && left <= 0) {
        setStage("ended");
        recordTime();
        var q = queueRef.current;
        (q ? q.flush() : Promise.resolve()).then(function () {
          setTimeout(function () {
            props.onResult(examId);
          }, 1500);
        });
      }
    });
    var cur = qs[idx];
    // soru başına süre
    function recordTime() {
      var q = queueRef.current;
      if (!q || !cur || !seenAt.current) return;
      var spent = Date.now() - seenAt.current;
      seenAt.current = Date.now();
      if (spent > 500) q.addTime(cur.no, q.ms(cur.no) + spent);
    }
    useEffect(function () {
      seenAt.current = Date.now();
    }, [idx, stage]);
    function pick(no, letter) {
      var q = queueRef.current;
      if (!q || fatal || stage !== "run") return;
      recordTime();
      q.set(no, letter, q.ms(no));
      setTick(function (x) {
        return x + 1;
      });
    }
    function go(i) {
      recordTime();
      setIdx(Math.max(0, Math.min(qs.length - 1, i)));
    }
    function jumpTo(no) {
      var i = qs.findIndex(function (q) {
        return q.no === no;
      });
      if (i >= 0) {
        go(i);
        setGrid(false);
      }
    }

    // klavye: A–E, ← →
    useEffect(function () {
      if (stage !== "run") return;
      function onKey(e) {
        if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
        var k = (e.key || "").toUpperCase();
        if (cur && L.LETTERS.indexOf(k) >= 0) {
          e.preventDefault();
          pick(cur.no, queueRef.current.get(cur.no) === k ? null : k);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(idx + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(idx - 1);
        }
      }
      window.addEventListener("keydown", onKey);
      return function () {
        window.removeEventListener("keydown", onKey);
      };
    });
    function submitNow() {
      recordTime();
      var q = queueRef.current;
      (q ? q.flush() : Promise.resolve()).then(function () {
        return C.rpc("live_submit", {
          p_exam: examId,
          p_device: dev
        });
      }).then(function () {
        setConfirmEnd(false);
        props.onSubmitted && props.onSubmitted();
      }).catch(function (e) {
        setConfirmEnd(false);
        setErr(e);
      });
    }
    if (stage === "error") {
      var msg = err && err.message || "Sınava girilemedi.";
      return /*#__PURE__*/React.createElement(Panel, {
        label: "S\u0131nava girilemedi"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "text-xl font-black"
      }, "S\u0131nava girilemedi"), /*#__PURE__*/React.createElement("p", {
        className: "mt-2 text-stone-600 dark:text-stone-300"
      }, msg), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "quick-chip mt-4",
        onClick: props.onBack
      }, "Geri d\xF6n"));
    }
    if (stage === "enter" || stage === "loading") {
      return /*#__PURE__*/React.createElement(Panel, {
        label: "S\u0131nav haz\u0131rlan\u0131yor"
      }, /*#__PURE__*/React.createElement("p", {
        className: "font-semibold"
      }, stage === "enter" ? "Sunucuya bağlanılıyor…" : "Soru kitapçığı açılıyor…"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-500 mt-1"
      }, "S\xFCren sunucu saatine g\xF6re i\u015Fler; bu ekran\u0131 kapatsan da cevaplar\u0131n kay\u0131tl\u0131d\u0131r."));
    }
    if (stage === "ended") {
      return /*#__PURE__*/React.createElement(Panel, {
        label: "S\xFCre doldu"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "text-2xl font-black"
      }, "S\xFCre doldu"), /*#__PURE__*/React.createElement("p", {
        className: "mt-2 text-stone-600 dark:text-stone-300"
      }, "Cevaplar\u0131n g\xF6nderiliyor, sonu\xE7 ekran\u0131 a\xE7\u0131l\u0131yor\u2026"), sync.pending ? /*#__PURE__*/React.createElement("p", {
        className: "mt-2 text-sm font-semibold text-amber-700"
      }, sync.pending, " cevap g\xF6nderilmeyi bekliyor. \u0130nternetin geri gelince 12:27'ye kadar g\xF6nderilir.") : null);
    }
    var answers = queueRef.current ? queueRef.current.all() : {};
    var answered = Object.keys(answers).filter(function (k) {
      return answers[k] && answers[k].c;
    }).length;
    var blank = qs.length - answered;
    var mine = cur && queueRef.current ? queueRef.current.get(cur.no) : null;
    var warn = left < 10 * 60000;
    var syncText = fatal ? "Kayıt durdu" : sync.pending ? sync.ok === false ? "Çevrimdışı · " + sync.pending + " cevap bekliyor" : "Kaydediliyor…" : "Tüm cevaplar kaydedildi";
    return /*#__PURE__*/React.createElement("div", {
      className: "live-exam",
      "aria-live": "off"
    }, /*#__PURE__*/React.createElement("header", {
      className: "live-bar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] font-bold uppercase tracking-wider opacity-70 truncate"
    }, exam && exam.title), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-semibold " + (fatal ? "text-rose-600" : sync.pending ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"),
      role: "status"
    }, syncText)), /*#__PURE__*/React.createElement("div", {
      className: "live-timer font-stat " + (warn ? "is-warn" : ""),
      role: "timer",
      "aria-label": "Kalan süre " + L.fmtTimer(left)
    }, L.fmtTimer(left))), fatal ? /*#__PURE__*/React.createElement("div", {
      className: "plan-warn mt-3",
      role: "alert"
    }, fatal.code === "device_replaced" ? "Sınav başka bir cihazda açıldı; bu cihazda cevap kaydedilmiyor. Devam etmek için o cihazı kullan ya da bu sayfayı yenile (cihaz değişikliği hakkından düşer)." : fatal.code === "locked" ? "Cihaz değişim sınırı aşıldığı için sınavın kilitlendi. Yönetici ile iletişime geç." : fatal.message || "Cevaplar kaydedilemiyor.") : null, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2 mt-3"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip" + (grid ? " is-primary" : ""),
      "aria-pressed": grid,
      onClick: function () {
        recordTime();
        setGrid(!grid);
      }
    }, "\u25A6 Toplu g\xF6r\xFCn\xFCm"), /*#__PURE__*/React.createElement("span", {
      className: "text-xs text-stone-500"
    }, answered, " i\u015Faretli \xB7 ", blank, " bo\u015F"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip ml-auto",
      onClick: function () {
        setConfirmEnd(true);
      }
    }, "S\u0131nav\u0131 bitir")), grid ? /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mb-2"
    }, "Kayd\u0131rma hatas\u0131 var m\u0131 kontrol et; numaraya dokunarak o soruya git. Baloncu\u011Fa dokunarak da i\u015Faretleyebilirsin."), /*#__PURE__*/React.createElement(OpticGrid, {
      answers: answers,
      current: cur && cur.no,
      onJump: jumpTo,
      onPick: fatal ? null : pick
    })) : cur ? /*#__PURE__*/React.createElement("div", {
      className: "test-split mt-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "test-split-q"
    }, /*#__PURE__*/React.createElement("div", {
      className: "q-stem p-4 sm:p-7 rounded-3xl relative overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "q-stem-bar absolute top-0 left-0 w-1.5 h-full"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold text-stone-500 mb-2 pl-2"
    }, "Soru ", cur.no, " / 120 \xB7 ", L.BOLUM[cur.bolum], " \xB7 ", cur.ders), /*#__PURE__*/React.createElement("h3", {
      className: "text-lg font-bold leading-relaxed whitespace-pre-line text-stone-900 pl-2"
    }, /*#__PURE__*/React.createElement(Rich, {
      text: cur.stem
    })), cur.image ? /*#__PURE__*/React.createElement("img", {
      src: cur.image,
      alt: "Soru \u015Fekli",
      className: "live-img mt-4"
    }) : null)), /*#__PURE__*/React.createElement("div", {
      className: "test-split-a"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-3",
      role: "radiogroup",
      "aria-label": "Soru " + cur.no + " şıkları"
    }, (cur.options || []).map(function (opt, i) {
      var l = L.LETTERS[i];
      var on = mine === l;
      return /*#__PURE__*/React.createElement("button", {
        key: l,
        type: "button",
        role: "radio",
        "aria-checked": on,
        className: "w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-semibold flex items-center gap-3 option-btn " + (on ? "bg-[#0D2C4D] border-[#0D2C4D] text-white" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"),
        onClick: function () {
          pick(cur.no, on ? null : l);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "live-letter " + (on ? "is-on" : "")
      }, l), /*#__PURE__*/React.createElement("span", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement(Rich, {
        text: opt
      })));
    })), /*#__PURE__*/React.createElement("p", {
      className: "kbd-hint mt-3",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("kbd", null, "A"), "\u2013", /*#__PURE__*/React.createElement("kbd", null, "E"), " i\u015Faretle \xB7 ayn\u0131 \u015F\u0131kka tekrar bas\u0131nca silinir \xB7 ", /*#__PURE__*/React.createElement("kbd", null, "\u2190"), " ", /*#__PURE__*/React.createElement("kbd", null, "\u2192"), " ge\xE7"), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between gap-3 mt-4"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip",
      disabled: idx === 0,
      onClick: function () {
        go(idx - 1);
      }
    }, "\u2190 \xD6nceki"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip is-primary",
      disabled: idx >= qs.length - 1,
      onClick: function () {
        go(idx + 1);
      }
    }, "Sonraki \u2192")))) : null, confirmEnd ? /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 z-[70] bg-black/45 flex items-end sm:items-center justify-center p-3",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "end-title"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl"
    }, /*#__PURE__*/React.createElement("h2", {
      id: "end-title",
      className: "text-xl font-black"
    }, "K\xE2\u011F\u0131d\u0131n\u0131 teslim et?"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-2"
    }, blank ? blank + " soru boş. " : "", "Teslim ettikten sonra cevaplar\u0131n de\u011Fi\u015Ftirilemez. Sonucun ve \xE7\xF6z\xFCmler s\u0131nav bitince (", exam && L.fmtClock(L.ms(exam.ends_at)), ") a\xE7\u0131l\u0131r."), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end gap-2 mt-5"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip",
      onClick: function () {
        setConfirmEnd(false);
      }
    }, "Vazge\xE7"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip is-primary",
      onClick: submitNow
    }, "Teslim et")))) : null);
  }

  // ============================================================
  // SONUÇ RAPORU
  // ============================================================
  // Net dağılımı: 5 netlik dilimler; senin dilimin turuncu ve "Sen" etiketli (renk tek başına değil)
  var C_BLUE = {
      light: "#2a78d6",
      dark: "#3987e5"
    },
    C_ORANGE = {
      light: "#eb6834",
      dark: "#d95926"
    };
  function NetHistogram(props) {
    var rows = props.rows,
      dark = props.dark;
    const [hover, setHover] = useState(null);
    var W = 640,
      H = 200,
      padL = 34,
      padR = 10,
      padT = 22,
      padB = 28;
    var max = Math.max.apply(null, rows.map(function (r) {
      return r.n;
    }).concat([1]));
    var bw = (W - padL - padR) / rows.length;
    function y(v) {
      return padT + (H - padT - padB) * (1 - v / max);
    }
    var ink = dark ? "#c3c2b7" : "#52514e",
      grid = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)";
    var every = Math.ceil(rows.length / 10);
    var ticks = max <= 4 ? Array.from({
      length: max + 1
    }, function (_, i) {
      return i;
    }) : [0, Math.round(max / 2), max];
    return /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 " + W + " " + H,
      className: "w-full h-auto",
      role: "img",
      "aria-label": props.label,
      onMouseLeave: function () {
        setHover(null);
      }
    }, ticks.map(function (t) {
      return /*#__PURE__*/React.createElement("g", {
        key: t
      }, /*#__PURE__*/React.createElement("line", {
        x1: padL,
        x2: W - padR,
        y1: y(t),
        y2: y(t),
        stroke: grid
      }), /*#__PURE__*/React.createElement("text", {
        x: padL - 6,
        y: y(t) + 4,
        textAnchor: "end",
        fontSize: "11",
        fill: ink
      }, t));
    }), rows.map(function (r, i) {
      var x = padL + i * bw + 1,
        w = Math.max(2, bw - 2),
        top = y(r.n),
        col = r.mine ? dark ? C_ORANGE.dark : C_ORANGE.light : dark ? C_BLUE.dark : C_BLUE.light;
      var h = H - padB - top;
      return /*#__PURE__*/React.createElement("g", {
        key: r.from
      }, r.n ? /*#__PURE__*/React.createElement("path", {
        d: "M" + x + " " + (H - padB) + " V" + (top + 4) + " Q" + x + " " + top + " " + (x + 4) + " " + top + " H" + (x + w - 4) + " Q" + (x + w) + " " + top + " " + (x + w) + " " + (top + 4) + " V" + (H - padB) + " Z",
        fill: col,
        opacity: hover == null || hover === i ? 1 : 0.55
      }) : null, r.mine ? /*#__PURE__*/React.createElement("text", {
        x: x + w / 2,
        y: (r.n ? top : H - padB) - 6,
        textAnchor: "middle",
        fontSize: "11",
        fontWeight: "700",
        fill: ink
      }, "Sen") : null, i % every === 0 ? /*#__PURE__*/React.createElement("text", {
        x: x,
        y: H - 10,
        fontSize: "10",
        fill: ink
      }, r.from) : null, /*#__PURE__*/React.createElement("rect", {
        x: x - 1,
        y: padT,
        width: bw,
        height: H - padT - padB,
        fill: "transparent",
        tabIndex: "0",
        onMouseEnter: function () {
          setHover(i);
        },
        onFocus: function () {
          setHover(i);
        },
        "aria-label": r.from + "–" + r.to + " net: " + r.n + " kişi"
      }));
    })), hover != null ? /*#__PURE__*/React.createElement("div", {
      className: "absolute top-0 right-2 rounded-xl bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 px-3 py-2 text-xs"
    }, /*#__PURE__*/React.createElement("b", null, rows[hover].from, "\u2013", rows[hover].to, " net"), ": ", rows[hover].n, " ki\u015Fi", rows[hover].mine ? " · sen buradasın" : "") : null);
  }
  function ResultReport(props) {
    var examId = props.examId;
    const [data, setData] = useState(null);
    const [review, setReview] = useState(null);
    const [images, setImages] = useState({});
    const [err, setErr] = useState(null);
    const [filter, setFilter] = useState("yanlis");
    const [openQ, setOpenQ] = useState(null);
    const [attempt, setAttempt] = useState(0);
    useEffect(function () {
      var alive = true;
      C.flushPending(examId).then(function () {
        return C.rpc("live_result", {
          p_exam: examId
        });
      }).catch(function (e) {
        // saat farkı: bitişten birkaç saniye önce istenmişse kısa süre sonra yeniden dene
        if (e.code === "not_yet" && attempt < 6 && alive) {
          setTimeout(function () {
            if (alive) setAttempt(attempt + 1);
          }, 5000);
          return null;
        }
        throw e;
      }).then(function (r) {
        if (!r) return;
        if (!alive) return;
        setData(r);
        if (r && r.result && window.StudentStore && StudentStore.applyLiveExamGaps) {
          StudentStore.applyLiveExamGaps(examId, {
            title: r.exam.title,
            at: r.exam.starts_at
          }, L.gaps(r.result));
        }
        return C.rpc("live_review", {
          p_exam: examId
        }).then(function (rv) {
          if (!alive) return;
          setReview(rv);
          var withImg = (rv.questions || []).some(function (q) {
            return q.image;
          });
          if (withImg && rv.key) {
            C.openBooklet(examId, rv.key, rv.sha).then(function (bk) {
              var m = {};
              (bk.questions || []).forEach(function (q) {
                if (q.image) m[q.no] = q.image;
              });
              if (alive) setImages(m);
            }).catch(function () {});
          }
        });
      }).catch(function (e) {
        if (alive) setErr(e);
      });
      return function () {
        alive = false;
      };
    }, [examId, attempt]);
    if (err) return /*#__PURE__*/React.createElement(Panel, {
      label: "Sonu\xE7"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-semibold"
    }, err.message), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip mt-3",
      onClick: props.onBack
    }, "Geri"));
    if (!data) return /*#__PURE__*/React.createElement(Panel, {
      label: "Sonu\xE7"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-semibold"
    }, "Sonucun hesaplan\u0131yor\u2026"));
    var r = data.result || {};
    var exam = data.exam;
    var coh = data.cohort;
    var finalized = exam.finalized;
    var dersRows = L.dersCompare(r, coh, data.peers);
    var hasTop = dersRows.some(function (d) {
        return d.top10 != null;
      }),
      hasPeers = !!data.peers;
    var an = coh && coh.analysis || {};
    var dark = document.documentElement.classList.contains("dark");
    var konuRows = L.konuRows(r, coh);
    var weak = L.weakest(r, 3);
    var qs = review && review.questions || [];
    var shown = qs.filter(function (q) {
      if (filter === "yanlis") return q.mine && q.mine !== q.answer;
      if (filter === "bos") return !q.mine;
      if (filter === "dogru") return q.mine === q.answer;
      return true;
    });
    var keyMap = {},
      ansMap = {};
    qs.forEach(function (q) {
      keyMap[q.no] = q.answer;
      ansMap[q.no] = {
        c: q.mine
      };
    });
    var byDers = {};
    konuRows.forEach(function (k) {
      (byDers[k.ders] = byDers[k.ders] || []).push(k);
    });
    var timed = qs.filter(function (q) {
      return q.ms > 0;
    });
    var hist = finalized ? L.histRows(coh, r.net) : [];
    var beat = finalized ? L.beatPct(r) : null;
    var easy = L.easyMisses(qs).slice(0, 8);
    var tm = L.timeRows(qs, coh);
    var modes = an.by_mode || {};
    function jump(no) {
      setFilter("hepsi");
      setOpenQ(no);
      setTimeout(function () {
        var el = document.getElementById("lq-" + no);
        if (el) el.scrollIntoView({
          block: "center"
        });
      }, 50);
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement(Kicker, null, L.TRACKS[exam.track], " \xB7 ", L.fmtDate(L.ms(exam.starts_at)), " \xB7 ", r.mode === "paper" ? "kâğıtta çözüldü" : "cihazda çözüldü"), /*#__PURE__*/React.createElement("h1", {
      className: "text-3xl font-display font-black tracking-tight gradient-text mt-1"
    }, exam.title)), /*#__PURE__*/React.createElement(Panel, {
      label: "\xD6zet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-2"
    }, /*#__PURE__*/React.createElement(Stat, {
      big: true,
      value: L.fmtNet(r.net),
      label: "net"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: r.correct + " / " + r.wrong + " / " + r.blank,
      label: "do\u011Fru / yanl\u0131\u015F / bo\u015F"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: finalized && r.rank ? r.rank + " / " + r.participants : "–",
      label: finalized ? "sıralama" : "sıralama " + L.fmtClock(L.ms(exam.ranking_at)) + "'ta"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: finalized && r.top_pct != null ? "%" + pct(r.top_pct) : "–",
      label: "y\xFCzdelik dilim (ilk)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-2 mt-2"
    }, /*#__PURE__*/React.createElement(Stat, {
      value: L.fmtNet(r.gy_net),
      label: "Genel Yetenek net" + (coh ? " · ort. " + L.fmtNet(coh.avg_gy) : "")
    }), /*#__PURE__*/React.createElement(Stat, {
      value: L.fmtNet(r.gk_net),
      label: "Genel Kültür net" + (coh ? " · ort. " + L.fmtNet(coh.avg_gk) : "")
    })), !finalized ? /*#__PURE__*/React.createElement("p", {
      className: "plan-note mt-3"
    }, "Genel s\u0131ralama ve kat\u0131lan ortalamalar\u0131 ", L.fmtClock(L.ms(exam.ranking_at)), "'ta kesinle\u015Fir; k\xE2\u011F\u0131tta \xE7\xF6zenlerin okutmas\u0131 o saate kadar s\xFCrer.") : null), finalized && hist.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "Kat\u0131lanlar aras\u0131nda"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Kat\u0131lanlar aras\u0131nda \xB7 net da\u011F\u0131l\u0131m\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "text-lg font-bold mt-1"
    }, beat != null ? "Senden düşük net yapanların oranı: %" + beat : "Sıralaman " + r.rank + " / " + r.participants + "."), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
    }, an.pct ? "Medyan " + L.fmtNet(an.pct.p50) + " · ilk %25'in sınırı " + L.fmtNet(an.pct.p75) + " · ilk %10'un sınırı " + L.fmtNet(an.pct.p90) + " net." : "", an.top10_net != null ? " İlk %10'un ortalaması " + L.fmtNet(an.top10_net) + " net." : ""), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 max-w-2xl"
    }, /*#__PURE__*/React.createElement(NetHistogram, {
      rows: hist,
      dark: dark,
      label: "Net dağılımı: " + r.participants + " katılımcı, 5 netlik dilimler; senin dilimin işaretli"
    })), /*#__PURE__*/React.createElement("details", {
      className: "mt-2 text-xs"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer font-semibold"
    }, "Tablo olarak g\xF6ster"), /*#__PURE__*/React.createElement("table", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement("tbody", null, hist.map(function (h) {
      return /*#__PURE__*/React.createElement("tr", {
        key: h.from
      }, /*#__PURE__*/React.createElement("td", {
        className: "pr-4"
      }, h.from, "\u2013", h.to, " net"), /*#__PURE__*/React.createElement("td", null, h.n, " ki\u015Fi", h.mine ? " ← sen" : ""));
    })))), modes.device && modes.paper ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mt-2"
    }, "Cihazda \xE7\xF6zenler (", modes.device.n, " ki\u015Fi) ortalamas\u0131 ", L.fmtNet(modes.device.avg_net), " \xB7 k\xE2\u011F\u0131tta \xE7\xF6zenler (", modes.paper.n, " ki\u015Fi) ", L.fmtNet(modes.paper.avg_net), " net.") : null) : null, weak.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "En zay\u0131f konular"
    }, /*#__PURE__*/React.createElement(Kicker, null, "En zay\u0131f 3 konun \xB7 Eksikler'e eklendi"), /*#__PURE__*/React.createElement("ul", {
      className: "mt-3 space-y-2"
    }, weak.map(function (w) {
      return /*#__PURE__*/React.createElement("li", {
        key: w.key,
        className: "flex flex-wrap items-center justify-between gap-2 text-sm"
      }, /*#__PURE__*/React.createElement(KonuLink, {
        ders: w.ders,
        konu: w.konu,
        kpssData: props.kpssData,
        onKonu: props.onKonu
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-stone-500"
      }, w.c, "/", w.n, " do\u011Fru", w.avgC != null ? " · katılan ort. " + L.fmtNet(w.avgC) : ""));
    }))) : null, /*#__PURE__*/React.createElement(Panel, {
      label: "Ders baz\u0131nda"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Ders baz\u0131nda net"), /*#__PURE__*/React.createElement("table", {
      className: "w-full text-sm mt-3"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-xs text-stone-500"
    }, /*#__PURE__*/React.createElement("th", {
      className: "py-1"
    }, "Ders"), /*#__PURE__*/React.createElement("th", null, "D"), /*#__PURE__*/React.createElement("th", null, "Y"), /*#__PURE__*/React.createElement("th", null, "B"), /*#__PURE__*/React.createElement("th", null, "Net"), /*#__PURE__*/React.createElement("th", null, "Kat\u0131lan ort."), hasTop ? /*#__PURE__*/React.createElement("th", null, "\u0130lk %10") : null, hasPeers ? /*#__PURE__*/React.createElement("th", null, "Benzer seviye") : null)), /*#__PURE__*/React.createElement("tbody", null, dersRows.map(function (d) {
      return /*#__PURE__*/React.createElement("tr", {
        key: d.ders,
        className: "border-t border-stone-200/70 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 font-semibold"
      }, d.ders), /*#__PURE__*/React.createElement("td", null, d.c), /*#__PURE__*/React.createElement("td", null, d.w), /*#__PURE__*/React.createElement("td", null, d.b), /*#__PURE__*/React.createElement("td", {
        className: "font-bold"
      }, L.fmtNet(d.net)), /*#__PURE__*/React.createElement("td", null, d.avgNet == null ? "–" : L.fmtNet(d.avgNet)), hasTop ? /*#__PURE__*/React.createElement("td", null, d.top10 == null ? "–" : L.fmtNet(d.top10)) : null, hasPeers ? /*#__PURE__*/React.createElement("td", null, d.peers == null ? "–" : L.fmtNet(d.peers)) : null);
    })))), hasPeers || hasTop ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 -mt-2 px-2"
    }, hasPeers ? "Benzer seviye: netin ±5 içinde kalan " + data.peers.n + " katılımcının ortalaması. " : "", hasTop ? "İlk %10: en yüksek net yapan " + an.top10_n + " kişinin ortalaması." : "") : null, easy.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "\xC7o\u011Funlu\u011Fun yapt\u0131\u011F\u0131 ama senin ka\xE7\u0131rd\u0131\u011F\u0131n sorular"
    }, /*#__PURE__*/React.createElement(Kicker, null, "\xC7o\u011Funlu\u011Fun yapt\u0131\u011F\u0131, senin ka\xE7\u0131rd\u0131\u011F\u0131n sorular"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
    }, "Bu sorular kat\u0131lanlar\u0131n \xE7o\u011Fu i\xE7in kolayd\u0131; en h\u0131zl\u0131 puan kazanaca\u011F\u0131n yer buras\u0131."), /*#__PURE__*/React.createElement("ul", {
      className: "mt-2 space-y-1 text-sm"
    }, easy.map(function (q) {
      return /*#__PURE__*/React.createElement("li", {
        key: q.no
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "text-left hover:underline",
        onClick: function () {
          jump(q.no);
        }
      }, "Soru ", q.no, " \xB7 ", q.ders, " / ", konuName(q.konu), " \u2014 kat\u0131lanlarda do\u011Fru oran\u0131 %", q.pct, " \xB7 ", q.mine ? "senin cevabın " + q.mine : "boş bıraktın"));
    }))) : null, tm.rows.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "S\xFCre"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Soru ba\u015F\u0131na s\xFCre"), /*#__PURE__*/React.createElement("table", {
      className: "w-full text-sm mt-2"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-xs text-stone-500"
    }, /*#__PURE__*/React.createElement("th", {
      className: "py-1"
    }, "Ders"), /*#__PURE__*/React.createElement("th", null, "Sen"), /*#__PURE__*/React.createElement("th", null, "Kat\u0131lan ort."), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, tm.rows.map(function (t) {
      var note = t.ratio == null ? "" : t.ratio > 1.25 ? "yavaş" : t.ratio < 0.75 ? "hızlı" : "";
      return /*#__PURE__*/React.createElement("tr", {
        key: t.ders,
        className: "border-t border-stone-200/70 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1.5 font-semibold"
      }, t.ders), /*#__PURE__*/React.createElement("td", null, L.fmtSec(t.mine)), /*#__PURE__*/React.createElement("td", null, L.fmtSec(t.avg)), /*#__PURE__*/React.createElement("td", {
        className: "text-xs text-stone-500"
      }, note));
    }))), tm.slow.length ? /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-semibold"
    }, "Uzun s\xFCr\xFCp yine de ka\xE7\u0131rd\u0131\u011F\u0131n sorular"), /*#__PURE__*/React.createElement("ul", {
      className: "mt-1 space-y-1 text-sm"
    }, tm.slow.map(function (q) {
      return /*#__PURE__*/React.createElement("li", {
        key: q.no
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "text-left hover:underline",
        onClick: function () {
          jump(q.no);
        }
      }, "Soru ", q.no, " \xB7 ", q.ders, " \u2014 ", L.fmtSec(q.ms), " (ortalama ", L.fmtSec(q.avg), ")"));
    }))) : null) : null, /*#__PURE__*/React.createElement(Panel, {
      label: "Konu baz\u0131nda"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Konu baz\u0131nda"), Object.keys(byDers).map(function (d) {
      return /*#__PURE__*/React.createElement("div", {
        key: d,
        className: "mt-3"
      }, /*#__PURE__*/React.createElement("p", {
        className: "font-bold text-sm"
      }, d), /*#__PURE__*/React.createElement("ul", {
        className: "mt-1 space-y-1"
      }, byDers[d].map(function (k) {
        return /*#__PURE__*/React.createElement("li", {
          key: k.key,
          className: "flex flex-wrap items-baseline justify-between gap-x-3 text-sm py-1 border-b border-stone-200/60 dark:border-stone-700/60"
        }, /*#__PURE__*/React.createElement("span", {
          className: "min-w-0"
        }, konuName(k.konu)), /*#__PURE__*/React.createElement("span", {
          className: "text-stone-600 dark:text-stone-300"
        }, /*#__PURE__*/React.createElement("b", null, k.c, "/", k.n), k.avgC != null ? " — katılan ortalaması " + L.fmtNet(k.avgC) : ""));
      })));
    })), review && review.most_wrong && review.most_wrong.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "En \xE7ok yanl\u0131\u015F yap\u0131lan sorular"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Kat\u0131lanlar\u0131n en \xE7ok yanl\u0131\u015F yapt\u0131\u011F\u0131 10 soru"), /*#__PURE__*/React.createElement("ol", {
      className: "mt-3 space-y-1 text-sm"
    }, review.most_wrong.map(function (m) {
      var q = qs.find(function (x) {
        return x.no === m.no;
      });
      var miss = q && q.mine !== q.answer;
      return /*#__PURE__*/React.createElement("li", {
        key: m.no
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "text-left hover:underline",
        onClick: function () {
          setFilter("hepsi");
          setOpenQ(m.no);
        }
      }, "Soru ", m.no, " \xB7 ", m.ders, " / ", konuName(m.konu), " \u2014 %", pct(m.wrong_pct), " yanl\u0131\u015F", miss ? " · sen de kaçırdın" : ""));
    }))) : null, /*#__PURE__*/React.createElement(Panel, {
      label: "Optik form"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Optik form \xB7 ye\u015Fil: do\u011Fru cevap, k\u0131rm\u0131z\u0131: yanl\u0131\u015F i\u015Faretin"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3"
    }, /*#__PURE__*/React.createElement(OpticGrid, {
      answers: ansMap,
      key_: keyMap,
      onJump: function (n) {
        setFilter("hepsi");
        setOpenQ(n);
      }
    }))), /*#__PURE__*/React.createElement(Panel, {
      label: "Soru soru \xE7\xF6z\xFCmler"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Soru soru \xE7\xF6z\xFCmler", timed.length ? " · harcadığın süre" : ""), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mt-3"
    }, [["yanlis", "Yanlışlar"], ["bos", "Boşlar"], ["dogru", "Doğrular"], ["hepsi", "Tümü"]].map(function (f) {
      return /*#__PURE__*/React.createElement("button", {
        key: f[0],
        type: "button",
        className: "quick-chip" + (filter === f[0] ? " is-primary" : ""),
        "aria-pressed": filter === f[0],
        onClick: function () {
          setFilter(f[0]);
        }
      }, f[1]);
    })), /*#__PURE__*/React.createElement("ul", {
      className: "mt-3 space-y-2"
    }, shown.map(function (q) {
      var open = openQ === q.no;
      var state = !q.mine ? "boş" : q.mine === q.answer ? "doğru" : "yanlış";
      var tot = q.stat ? q.stat.correct + q.stat.wrong + q.stat.blank : 0;
      return /*#__PURE__*/React.createElement("li", {
        key: q.no,
        id: "lq-" + q.no,
        className: "rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-900/50"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "w-full text-left p-3 flex items-center gap-3",
        "aria-expanded": open,
        onClick: function () {
          setOpenQ(open ? null : q.no);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "live-state " + (state === "doğru" ? "is-ok" : state === "yanlış" ? "is-bad" : "")
      }, q.no), /*#__PURE__*/React.createElement("span", {
        className: "min-w-0 flex-1 text-sm"
      }, /*#__PURE__*/React.createElement("b", null, q.ders), " / ", konuName(q.konu), " ", /*#__PURE__*/React.createElement("span", {
        className: "text-stone-500"
      }, "\xB7 ", state, q.mine ? " (" + q.mine + ")" : "", " \xB7 do\u011Fru ", q.answer))), open ? /*#__PURE__*/React.createElement("div", {
        className: "px-4 pb-4 text-sm"
      }, /*#__PURE__*/React.createElement("p", {
        className: "whitespace-pre-line font-semibold leading-relaxed"
      }, /*#__PURE__*/React.createElement(Rich, {
        text: q.stem
      })), images[q.no] ? /*#__PURE__*/React.createElement("img", {
        src: images[q.no],
        alt: "Soru \u015Fekli",
        className: "live-img mt-3"
      }) : null, /*#__PURE__*/React.createElement("ul", {
        className: "mt-3 space-y-1"
      }, (q.options || []).map(function (o, i) {
        var l = L.LETTERS[i];
        var cls = l === q.answer ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300" : l === q.mine ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300" : "border-stone-200 dark:border-stone-700";
        return /*#__PURE__*/React.createElement("li", {
          key: l,
          className: "rounded-xl border px-3 py-2 " + cls
        }, /*#__PURE__*/React.createElement("b", null, l, ")"), " ", /*#__PURE__*/React.createElement(Rich, {
          text: o
        }), l === q.answer ? " ✓" : "", l === q.mine && l !== q.answer ? " ✗ senin cevabın" : "");
      })), q.explanation ? /*#__PURE__*/React.createElement("p", {
        className: "mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 whitespace-pre-line"
      }, /*#__PURE__*/React.createElement("b", null, "\xC7\xF6z\xFCm:"), " ", /*#__PURE__*/React.createElement(Rich, {
        text: q.explanation
      })) : null, /*#__PURE__*/React.createElement("p", {
        className: "mt-2 text-xs text-stone-500"
      }, q.ms ? "Bu soruda " + Math.max(1, Math.round(q.ms / 1000)) + " sn harcadın" + (q.stat && q.stat.avg_ms ? " (ortalama " + Math.round(q.stat.avg_ms / 1000) + " sn)" : "") + ". " : "", tot ? "Katılanlarda doğru oranı %" + pct(100 * q.stat.correct / tot) + "." : ""), /*#__PURE__*/React.createElement("div", {
        className: "mt-2"
      }, /*#__PURE__*/React.createElement(KonuLink, {
        ders: q.ders,
        konu: q.konu,
        kpssData: props.kpssData,
        onKonu: props.onKonu
      }))) : null);
    }), !shown.length ? /*#__PURE__*/React.createElement("li", {
      className: "text-sm text-stone-500"
    }, "Bu filtrede soru yok.") : null)));
  }

  // ============================================================
  // ARŞİV: Denemelerim
  // ============================================================
  function Archive(props) {
    const [list, setList] = useState(null);
    const [err, setErr] = useState(null);
    useEffect(function () {
      C.rpc("live_history").then(setList).catch(setErr);
    }, []);
    if (err) return /*#__PURE__*/React.createElement(Panel, {
      label: "Denemelerim"
    }, /*#__PURE__*/React.createElement("p", null, err.message));
    if (!list) return /*#__PURE__*/React.createElement(Panel, {
      label: "Denemelerim"
    }, /*#__PURE__*/React.createElement("p", null, "Y\xFCkleniyor\u2026"));
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-3xl font-display font-black tracking-tight gradient-text"
    }, "Denemelerim"), !list.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "Bo\u015F"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-stone-600 dark:text-stone-300"
    }, "Hen\xFCz kat\u0131ld\u0131\u011F\u0131n bir canl\u0131 deneme yok. Her pazar 10:15'te!")) : /*#__PURE__*/React.createElement("ul", {
      className: "space-y-2"
    }, list.map(function (h) {
      return /*#__PURE__*/React.createElement("li", {
        key: h.exam_id
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "w-full text-left rounded-2xl glass p-4 card-hover flex flex-wrap items-center gap-x-4 gap-y-1",
        onClick: function () {
          props.onOpen(h.exam_id);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("span", {
        className: "block font-bold"
      }, h.title), /*#__PURE__*/React.createElement("span", {
        className: "block text-xs text-stone-500"
      }, L.fmtDate(L.ms(h.starts_at)), " \xB7 ", L.TRACKS[h.track], " \xB7 ", h.mode === "paper" ? "kâğıt" : "cihaz")), /*#__PURE__*/React.createElement("span", {
        className: "font-stat text-xl font-black"
      }, L.fmtNet(h.net), " ", /*#__PURE__*/React.createElement("span", {
        className: "text-xs font-semibold text-stone-500"
      }, "net")), /*#__PURE__*/React.createElement("span", {
        className: "text-sm text-stone-600 dark:text-stone-300"
      }, h.rank ? h.rank + ". / " + h.participants + " · ilk %" + pct(h.top_pct) : "sıralama bekleniyor")));
    })));
  }

  // ============================================================
  // GELİŞİM
  // ============================================================
  var SERIES = [{
    key: "net",
    label: "Toplam",
    light: "#2a78d6",
    dark: "#3987e5"
  }, {
    key: "gy",
    label: "Genel Yetenek",
    light: "#eb6834",
    dark: "#d95926"
  }, {
    key: "gk",
    label: "Genel Kültür",
    light: "#1baf7a",
    dark: "#199e70"
  }];
  var VS = [{
    key: "net",
    label: "Sen",
    light: "#2a78d6",
    dark: "#3987e5"
  }, {
    key: "avg",
    label: "Katılan ort.",
    light: "#eb6834",
    dark: "#d95926"
  }];
  function LineChart(props) {
    var pts = props.points;
    var dark = props.dark;
    const [hover, setHover] = useState(null);
    var W = 640,
      H = 240,
      padL = 40,
      padR = 70,
      padT = 14,
      padB = 30;
    var max = props.max != null ? props.max : 120;
    var min = 0;
    var n = pts.length;
    function x(i) {
      return padL + (n <= 1 ? (W - padL - padR) / 2 : i * (W - padL - padR) / (n - 1));
    }
    function y(v) {
      return padT + (H - padT - padB) * (1 - (v - min) / (max - min || 1));
    }
    var ticks = [0, max / 4, max / 2, 3 * max / 4, max];
    var ink = dark ? "#c3c2b7" : "#52514e";
    var grid = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)";
    return /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 " + W + " " + H,
      className: "w-full h-auto",
      role: "img",
      "aria-label": props.label,
      onMouseLeave: function () {
        setHover(null);
      }
    }, ticks.map(function (t) {
      return /*#__PURE__*/React.createElement("g", {
        key: t
      }, /*#__PURE__*/React.createElement("line", {
        x1: padL,
        x2: W - padR,
        y1: y(t),
        y2: y(t),
        stroke: grid,
        strokeWidth: "1"
      }), /*#__PURE__*/React.createElement("text", {
        x: padL - 6,
        y: y(t) + 4,
        textAnchor: "end",
        fontSize: "11",
        fill: ink
      }, Math.round(t)));
    }), pts.map(function (p, i) {
      return /*#__PURE__*/React.createElement("text", {
        key: i,
        x: x(i),
        y: H - 10,
        textAnchor: "middle",
        fontSize: "11",
        fill: ink
      }, p.label);
    }), props.series.map(function (s) {
      var col = dark ? s.dark : s.light;
      var d = pts.map(function (p, i) {
        return (i ? "L" : "M") + x(i) + " " + y(p[s.key]);
      }).join(" ");
      var last = pts[pts.length - 1];
      return /*#__PURE__*/React.createElement("g", {
        key: s.key
      }, /*#__PURE__*/React.createElement("path", {
        d: d,
        fill: "none",
        stroke: col,
        strokeWidth: "2",
        strokeLinejoin: "round",
        strokeLinecap: "round"
      }), pts.map(function (p, i) {
        return /*#__PURE__*/React.createElement("circle", {
          key: i,
          cx: x(i),
          cy: y(p[s.key]),
          r: "4",
          fill: col,
          stroke: dark ? "#1c1917" : "#fff",
          strokeWidth: "2"
        });
      }), last ? /*#__PURE__*/React.createElement("text", {
        x: x(n - 1) + 8,
        y: y(last[s.key]) + 4,
        fontSize: "11",
        fontWeight: "700",
        fill: ink
      }, s.label, " ", L.fmtNet(last[s.key])) : null);
    }), pts.map(function (p, i) {
      var w = n <= 1 ? 80 : (W - padL - padR) / (n - 1);
      return /*#__PURE__*/React.createElement("rect", {
        key: i,
        x: x(i) - w / 2,
        y: padT,
        width: w,
        height: H - padT - padB,
        fill: "transparent",
        onMouseEnter: function () {
          setHover(i);
        },
        onFocus: function () {
          setHover(i);
        },
        tabIndex: "0"
      });
    }), hover != null ? /*#__PURE__*/React.createElement("line", {
      x1: x(hover),
      x2: x(hover),
      y1: padT,
      y2: H - padB,
      stroke: ink,
      strokeDasharray: "3 3"
    }) : null), hover != null ? /*#__PURE__*/React.createElement("div", {
      className: "absolute top-2 left-2 rounded-xl bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 px-3 py-2 text-xs"
    }, /*#__PURE__*/React.createElement("b", null, pts[hover].title), " \xB7 ", pts[hover].label, props.series.map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        key: s.key
      }, s.label, ": ", /*#__PURE__*/React.createElement("b", null, L.fmtNet(pts[hover][s.key])));
    })) : null);
  }
  function Progress(props) {
    const [list, setList] = useState(null);
    const [err, setErr] = useState(null);
    useEffect(function () {
      C.rpc("live_history").then(setList).catch(setErr);
    }, []);
    if (err) return /*#__PURE__*/React.createElement(Panel, {
      label: "Geli\u015Fim"
    }, /*#__PURE__*/React.createElement("p", null, err.message));
    if (!list) return /*#__PURE__*/React.createElement(Panel, {
      label: "Geli\u015Fim"
    }, /*#__PURE__*/React.createElement("p", null, "Y\xFCkleniyor\u2026"));
    // kulvar değiştirdiysen gelişim yalnızca şimdiki kulvarındaki denemelerden hesaplanır
    var track = C.trackOf(props.student);
    var mine = list.filter(function (h) {
      return h.track === track;
    });
    var otherTracks = list.length - mine.length;
    var p = L.progress(mine);
    var vsAvg = p.points.filter(function (x) {
      return x.avg != null;
    });
    var dark = document.documentElement.classList.contains("dark");
    var ranked = p.points.filter(function (x) {
      return x.top_pct != null;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-3xl font-display font-black tracking-tight gradient-text"
    }, "Geli\u015Fimim"), otherTracks ? /*#__PURE__*/React.createElement("p", {
      className: "plan-note"
    }, L.TRACKS[track], " kulvar\u0131ndaki denemelerin g\xF6steriliyor; ba\u015Fka kulvardaki ", otherTracks, " deneme Denemelerim'de duruyor.") : null, !p.points.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "Bo\u015F"
    }, /*#__PURE__*/React.createElement("p", null, "\u0130lk canl\u0131 denemenden sonra geli\u015Fimin burada g\xF6r\xFCnecek.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2"
    }, /*#__PURE__*/React.createElement(Stat, {
      big: true,
      value: p.streak,
      label: "hafta \xFCst \xFCste kat\u0131l\u0131m"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: L.fmtNet(p.points[p.points.length - 1].net),
      label: "son net"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: p.points.length,
      label: "deneme"
    })), /*#__PURE__*/React.createElement(Panel, {
      label: "Net grafi\u011Fi"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Deneme deneme net"), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs",
      "aria-hidden": "true"
    }, SERIES.map(function (s) {
      return /*#__PURE__*/React.createElement("span", {
        key: s.key,
        className: "inline-flex items-center gap-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "h-2.5 w-2.5 rounded-full",
        style: {
          background: dark ? s.dark : s.light
        }
      }), s.label);
    })), /*#__PURE__*/React.createElement(LineChart, {
      points: p.points,
      series: SERIES,
      dark: dark,
      max: 120,
      label: "Deneme deneme toplam, Genel Yetenek ve Genel K\xFClt\xFCr neti"
    }), /*#__PURE__*/React.createElement("table", {
      className: "w-full text-xs mt-3"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-stone-500"
    }, /*#__PURE__*/React.createElement("th", null, "Deneme"), /*#__PURE__*/React.createElement("th", null, "Toplam"), /*#__PURE__*/React.createElement("th", null, "GY"), /*#__PURE__*/React.createElement("th", null, "GK"), /*#__PURE__*/React.createElement("th", null, "S\u0131ra"), /*#__PURE__*/React.createElement("th", null, "\u0130lk %"))), /*#__PURE__*/React.createElement("tbody", null, p.points.map(function (x) {
      return /*#__PURE__*/React.createElement("tr", {
        key: x.exam_id,
        className: "border-t border-stone-200/70 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1"
      }, x.label), /*#__PURE__*/React.createElement("td", null, L.fmtNet(x.net)), /*#__PURE__*/React.createElement("td", null, L.fmtNet(x.gy)), /*#__PURE__*/React.createElement("td", null, L.fmtNet(x.gk)), /*#__PURE__*/React.createElement("td", null, x.rank ? x.rank + "/" + x.participants : "–"), /*#__PURE__*/React.createElement("td", null, x.top_pct != null ? pct(x.top_pct) : "–"));
    })))), vsAvg.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "Kat\u0131lanlara g\xF6re"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Kat\u0131lanlara g\xF6re"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
    }, "Son denemede kat\u0131lan ortalamas\u0131n\u0131n ", vsAvg[vsAvg.length - 1].diff >= 0 ? L.fmtNet(vsAvg[vsAvg.length - 1].diff) + " net üstündesin" : L.fmtNet(-vsAvg[vsAvg.length - 1].diff) + " net altındasın", "."), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs",
      "aria-hidden": "true"
    }, VS.map(function (s) {
      return /*#__PURE__*/React.createElement("span", {
        key: s.key,
        className: "inline-flex items-center gap-1.5"
      }, /*#__PURE__*/React.createElement("span", {
        className: "h-2.5 w-2.5 rounded-full",
        style: {
          background: dark ? s.dark : s.light
        }
      }), s.label);
    })), /*#__PURE__*/React.createElement(LineChart, {
      points: vsAvg,
      series: VS,
      dark: dark,
      max: 120,
      label: "Deneme deneme senin netin ve kat\u0131lanlar\u0131n ortalamas\u0131"
    }), /*#__PURE__*/React.createElement("table", {
      className: "w-full text-xs mt-3"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: "text-left text-stone-500"
    }, /*#__PURE__*/React.createElement("th", null, "Deneme"), /*#__PURE__*/React.createElement("th", null, "Sen"), /*#__PURE__*/React.createElement("th", null, "Kat\u0131lan ort."), /*#__PURE__*/React.createElement("th", null, "Medyan"), /*#__PURE__*/React.createElement("th", null, "Fark"))), /*#__PURE__*/React.createElement("tbody", null, vsAvg.map(function (x) {
      return /*#__PURE__*/React.createElement("tr", {
        key: x.exam_id,
        className: "border-t border-stone-200/70 dark:border-stone-700"
      }, /*#__PURE__*/React.createElement("td", {
        className: "py-1"
      }, x.label), /*#__PURE__*/React.createElement("td", null, L.fmtNet(x.net)), /*#__PURE__*/React.createElement("td", null, L.fmtNet(x.avg)), /*#__PURE__*/React.createElement("td", null, x.p50 == null ? "–" : L.fmtNet(x.p50)), /*#__PURE__*/React.createElement("td", null, (x.diff >= 0 ? "+" : "") + L.fmtNet(x.diff)));
    })))) : null, ranked.length ? /*#__PURE__*/React.createElement(Panel, {
      label: "Y\xFCzdelik dilim"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Y\xFCzdelik dilim (k\xFC\xE7\xFCk say\u0131 daha iyi)"), /*#__PURE__*/React.createElement("p", {
      className: "mt-2 text-sm"
    }, ranked.map(function (x) {
      return "ilk %" + pct(x.top_pct);
    }).join(" → "))) : null, /*#__PURE__*/React.createElement(Panel, {
      label: "Ders baz\u0131nda geli\u015Fim"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Ders baz\u0131nda net"), /*#__PURE__*/React.createElement("ul", {
      className: "mt-2 space-y-1 text-sm"
    }, Object.keys(p.ders).map(function (d) {
      return /*#__PURE__*/React.createElement("li", {
        key: d
      }, /*#__PURE__*/React.createElement("b", null, d, ":"), " ", p.ders[d].map(function (x) {
        return L.fmtNet(x.net) + (x.avg != null ? " (ort. " + L.fmtNet(x.avg) + ")" : "");
      }).join(" → "));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "grid sm:grid-cols-2 gap-4"
    }, /*#__PURE__*/React.createElement(Panel, {
      label: "En \xE7ok ilerledi\u011Fin konular"
    }, /*#__PURE__*/React.createElement(Kicker, null, "En \xE7ok ilerledi\u011Fin 3 konu"), /*#__PURE__*/React.createElement("ul", {
      className: "mt-2 space-y-1 text-sm"
    }, p.improved.length ? p.improved.map(function (k) {
      return /*#__PURE__*/React.createElement("li", {
        key: k.ders + k.konu
      }, /*#__PURE__*/React.createElement(KonuLink, {
        ders: k.ders,
        konu: k.konu,
        kpssData: props.kpssData,
        onKonu: props.onKonu
      }), " ", /*#__PURE__*/React.createElement("span", {
        className: "text-stone-500"
      }, "%", Math.round(k.from * 100), " \u2192 %", Math.round(k.to * 100)));
    }) : /*#__PURE__*/React.createElement("li", {
      className: "text-stone-500"
    }, "\u0130ki denemeden sonra g\xF6r\xFCn\xFCr."))), /*#__PURE__*/React.createElement(Panel, {
      label: "H\xE2l\xE2 tak\u0131ld\u0131\u011F\u0131n konular"
    }, /*#__PURE__*/React.createElement(Kicker, null, "H\xE2l\xE2 tak\u0131ld\u0131\u011F\u0131n 3 konu"), /*#__PURE__*/React.createElement("ul", {
      className: "mt-2 space-y-1 text-sm"
    }, p.stuck.length ? p.stuck.map(function (k) {
      return /*#__PURE__*/React.createElement("li", {
        key: k.ders + k.konu
      }, /*#__PURE__*/React.createElement(KonuLink, {
        ders: k.ders,
        konu: k.konu,
        kpssData: props.kpssData,
        onKonu: props.onKonu
      }), " ", /*#__PURE__*/React.createElement("span", {
        className: "text-stone-500"
      }, "son: %", Math.round(k.to * 100)));
    }) : /*#__PURE__*/React.createElement("li", {
      className: "text-stone-500"
    }, "Tak\u0131ld\u0131\u011F\u0131n konu yok."))))));
  }

  // ============================================================
  // ANA BİLEŞEN
  // ============================================================
  // ============================================================
  // OPTİK OKUTMA (kâğıtta çözenler): fotoğraf → okuma → onay ızgarası → gönder
  // Okuma optik/optik.html içinde yapılır (mobilde aynı sayfa WebView'da).
  // ============================================================
  function OpticScan(props) {
    var examId = props.examId;
    const [dash, setDash] = useState(null);
    const [me, setMe] = useState(null);
    const [stage, setStage] = useState("scan");
    const [read, setRead] = useState(null);
    const [ans, setAns] = useState({});
    const [flags, setFlags] = useState({});
    const [source, setSource] = useState("optic");
    const [edited, setEdited] = useState(0);
    const [manual, setManual] = useState("");
    const [fails, setFails] = useState(0);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const [, setTick] = useState(0);
    var frameRef = useRef(null),
      clockRef = useRef(null),
      meRef = useRef(null);
    var dark = document.documentElement.classList.contains("dark");
    function load() {
      return C.rpc("live_dashboard", {
        p_track: C.trackOf(props.student)
      }).then(function (d) {
        clockRef.current = L.createClock(d.now);
        setDash(d);
      }).catch(function (x) {
        setErr(x.message);
      });
    }
    useEffect(function () {
      load();
      C.whoami(props.student).then(function (w) {
        meRef.current = w;
        setMe(w);
        sendExpect();
      });
      var t = setInterval(function () {
        setTick(function (x) {
          return x + 1;
        });
      }, 1000);
      return function () {
        clearInterval(t);
      };
    }, [examId]);
    function sendExpect() {
      var f = frameRef.current;
      if (f && f.contentWindow && meRef.current) f.contentWindow.postMessage({
        type: "scan",
        expect: {
          exam: examId,
          user: meRef.current.id
        }
      }, window.location.origin);
    }
    useEffect(function () {
      function onMsg(e) {
        var f = frameRef.current;
        if (!f || e.source !== f.contentWindow) return;
        var m = e.data || {};
        if (m.type === "ready") sendExpect();else if (m.type === "result") {
          var a = {},
            fl = {};
          m.answers.forEach(function (x, i) {
            a[i + 1] = {
              c: x
            };
            if (m.flags[i]) fl[i + 1] = m.flags[i];
          });
          setRead(m);
          setAns(a);
          setFlags(fl);
          setSource("optic");
          setEdited(0);
          setErr("");
          setTimeout(function () {
            setStage("confirm");
            window.scrollTo(0, 0);
          }, 600);
        } else if (m.type === "fail") {
          setFails(function (x) {
            return x + 1;
          });
          C.rpc("live_optic_report", {
            p_exam: examId,
            p_kind: m.code === "wrong_form" ? "wrong_form" : "fail",
            p_detail: {
              code: m.code,
              size: m.detail && m.detail.size
            }
          }).catch(function () {});
        }
      }
      window.addEventListener("message", onMsg);
      return function () {
        window.removeEventListener("message", onMsg);
      };
    }, [examId]);
    var now = clockRef.current ? clockRef.current.now() : Date.now();
    var exam = dash && dash.exam && dash.exam.id === examId ? dash.exam : null;
    var att = dash && dash.attempt;
    var until = exam ? L.ms(exam.optic_until || exam.ranking_at) : 0;
    var header = /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center justify-between gap-2 mb-4"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip",
      onClick: props.onBack
    }, "\u2190 Canl\u0131 deneme"), exam && now < until ? /*#__PURE__*/React.createElement("span", {
      className: "text-sm font-semibold",
      role: "timer"
    }, "Okutma ", L.fmtClock(until), "'ta kapan\u0131r \xB7 ", L.fmtLeft(until - now)) : null);
    if (!dash) return /*#__PURE__*/React.createElement("div", null, header, /*#__PURE__*/React.createElement(Panel, {
      label: "Y\xFCkleniyor"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-500"
    }, err || "Yükleniyor…")));
    var blocker = null;
    if (!exam || !att) blocker = "Bu denemede kâğıt modunda giriş kaydın yok.";else if (att.mode !== "paper") blocker = "Bu sınavı cihazda çözüyorsun; optik okutma kâğıtta çözenler içindir.";else if (att.submitted && stage !== "sent") blocker = "Optik formun zaten gönderildi; cevapların değişmez.";else if (now >= until && stage !== "sent") blocker = "Optik okutma süresi " + L.fmtClock(until) + "'ta doldu.";
    if (blocker) return /*#__PURE__*/React.createElement("div", null, header, /*#__PURE__*/React.createElement(Panel, {
      label: "Optik okutma"
    }, /*#__PURE__*/React.createElement("p", {
      className: "font-semibold"
    }, blocker)));
    function pick(no, letter) {
      setAns(function (a) {
        var b = Object.assign({}, a);
        b[no] = {
          c: letter
        };
        return b;
      });
      setFlags(function (f) {
        if (!f[no]) return f;
        var g = Object.assign({}, f);
        delete g[no];
        return g;
      });
      setEdited(function (x) {
        return x + 1;
      });
    }
    var list = [];
    for (var i = 1; i <= 120; i++) list.push(ans[i] && ans[i].c ? ans[i].c : null);
    var answered = list.filter(Boolean).length;
    var flaggedNos = Object.keys(flags).map(Number).sort(function (a, b) {
      return a - b;
    });
    var doubles = flaggedNos.filter(function (n) {
      return flags[n] === "double";
    });
    function submit() {
      var msg = answered + " cevap, " + (120 - answered) + " boş gönderilecek.";
      if (flaggedNos.length) msg += "\n\nKontrol etmediğin " + flaggedNos.length + " satır var: " + flaggedNos.slice(0, 12).join(", ") + (flaggedNos.length > 12 ? "…" : "") + (doubles.length ? "\nÇift işaretli satırlar boş gönderilir." : "");
      msg += "\n\nGönderdikten sonra cevapların değiştirilemez. Onaylıyor musun?";
      if (!window.confirm(msg)) return;
      setBusy(true);
      setErr("");
      C.rpc("live_submit_optic", {
        p_exam: examId,
        p_answers: L.answerText(list),
        p_meta: {
          source: source,
          qr: source === "optic" && read ? read.qr : null,
          flagged: flaggedNos.length,
          double: doubles.length,
          uncertain: flaggedNos.length - doubles.length,
          edited: edited
        }
      }).then(function () {
        setBusy(false);
        setStage("sent");
        load();
      }).catch(function (x) {
        setBusy(false);
        setErr(x.message);
      });
    }
    if (stage === "sent") {
      var open = exam && now >= L.ms(exam.ends_at);
      return /*#__PURE__*/React.createElement("div", null, header, /*#__PURE__*/React.createElement(Panel, {
        label: "G\xF6nderildi"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300"
      }, "\u2713 Optik formun g\xF6nderildi"), /*#__PURE__*/React.createElement("p", {
        className: "mt-2 text-sm text-stone-600 dark:text-stone-300"
      }, answered, " cevap kaydedildi. Cevaplar\u0131n art\u0131k de\u011Fi\u015Fmez.", open ? " Sonucun ve çözümlerin açıldı; sıralama " + L.fmtClock(L.ms(exam.ranking_at)) + "'ta kesinleşir." : " Sonucun ve çözümler " + L.fmtClock(L.ms(exam.ends_at)) + "'te açılır."), open ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "quick-chip is-primary mt-3",
        onClick: function () {
          props.onResult(examId);
        }
      }, "Sonucumu g\xF6r") : null));
    }
    if (stage === "manual") {
      var parsed = L.parseAnswerText(manual, 120);
      return /*#__PURE__*/React.createElement("div", null, header, /*#__PURE__*/React.createElement(Panel, {
        label: "Elle giri\u015F"
      }, /*#__PURE__*/React.createElement(Kicker, null, "Cevaplar\u0131n\u0131 elle gir"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-600 dark:text-stone-300 mt-1"
      }, "Optik formundaki cevaplar\u0131 1'den 120'ye s\u0131rayla yaz. Bo\u015F b\u0131rakt\u0131\u011F\u0131n sorular i\xE7in ", /*#__PURE__*/React.createElement("b", null, "-"), " yaz. Bo\u015Fluk ve virg\xFCller yok say\u0131l\u0131r."), /*#__PURE__*/React.createElement("textarea", {
        className: "w-full mt-3 rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 p-3 font-mono text-sm tracking-widest uppercase",
        rows: 5,
        value: manual,
        onChange: function (ev) {
          setManual(ev.target.value);
        },
        placeholder: "ACEBD-A\u2026",
        "aria-label": "Cevaplar (A\u2013E, bo\u015F i\xE7in -)",
        spellCheck: "false",
        autoCapitalize: "characters"
      }), /*#__PURE__*/React.createElement("p", {
        className: "text-sm mt-1 " + (parsed.bad.length || parsed.extra ? "text-rose-700 dark:text-rose-300" : "text-stone-500"),
        role: "status"
      }, parsed.count, " / 120 cevap", parsed.bad.length ? " · geçersiz karakter: " + parsed.bad.join(" ") : "", parsed.extra ? " · " + parsed.extra + " fazla" : ""), /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap gap-2 mt-3"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "quick-chip is-primary",
        disabled: !parsed.complete,
        onClick: function () {
          var a = {};
          parsed.answers.forEach(function (x, j) {
            a[j + 1] = {
              c: x
            };
          });
          setAns(a);
          setFlags({});
          setSource("manual");
          setEdited(0);
          setStage("confirm");
          window.scrollTo(0, 0);
          C.rpc("live_optic_report", {
            p_exam: examId,
            p_kind: "manual_open",
            p_detail: {}
          }).catch(function () {});
        }
      }, "Kontrol ekran\u0131na ge\xE7"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "quick-chip",
        onClick: function () {
          setStage("scan");
        }
      }, "Foto\u011Frafla okut"))));
    }
    if (stage === "confirm") {
      return /*#__PURE__*/React.createElement("div", null, header, /*#__PURE__*/React.createElement(Panel, {
        label: "Okunan cevaplar\u0131 kontrol et",
        className: "mb-4"
      }, /*#__PURE__*/React.createElement(Kicker, null, source === "manual" ? "Elle girdiğin cevaplar" : "Okunan cevaplarını kontrol et"), /*#__PURE__*/React.createElement("h2", {
        className: "text-lg font-bold mt-1"
      }, answered, " cevap \xB7 ", 120 - answered, " bo\u015F", flaggedNos.length ? " · " + flaggedNos.length + " satırı kontrol et" : ""), source === "optic" && read ? /*#__PURE__*/React.createElement("div", {
        className: "mt-2 text-sm space-y-1"
      }, /*#__PURE__*/React.createElement("p", {
        className: read.qrOk ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
      }, read.qrOk ? "✓ Karekod okundu: form sana ve bu denemeye ait." : "⚠ Karekod okunamadı; formun sana ait olduğundan emin ol."), (read.warnings || []).filter(function (w) {
        return !/Karekod/.test(w);
      }).map(function (w) {
        return /*#__PURE__*/React.createElement("p", {
          key: w,
          className: "text-amber-700 dark:text-amber-300"
        }, "\u26A0 ", w);
      })) : null, /*#__PURE__*/React.createElement("ul", {
        className: "mt-3 text-sm text-stone-600 dark:text-stone-300 space-y-1"
      }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
        className: "optic-legend is-uncertain",
        "aria-hidden": "true"
      }), " Sar\u0131 sat\u0131r: okuma karars\u0131z (silinmi\u015F iz ya da a\xE7\u0131k i\u015Faret). En olas\u0131 cevap se\xE7ili; kontrol et."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
        className: "optic-legend is-double",
        "aria-hidden": "true"
      }), " K\u0131rm\u0131z\u0131 sat\u0131r: \xE7ift i\u015Faret. D\xFCzeltmezsen bo\u015F g\xF6nderilir."), /*#__PURE__*/React.createElement("li", null, "Bir baloncu\u011Fa dokunarak cevab\u0131 de\u011Fi\u015Ftir; i\u015Faretli baloncu\u011Fa yeniden dokunursan bo\u015F olur.")), source === "optic" && read && read.preview ? /*#__PURE__*/React.createElement("details", {
        className: "mt-3"
      }, /*#__PURE__*/React.createElement("summary", {
        className: "text-sm font-semibold cursor-pointer"
      }, "Foto\u011Fraftaki okumay\u0131 g\xF6ster"), /*#__PURE__*/React.createElement("img", {
        src: read.preview,
        alt: "Okunan optik form; ye\u015Fil: okunan, sar\u0131: karars\u0131z, k\u0131rm\u0131z\u0131: \xE7ift i\u015Faret",
        className: "mt-2 rounded-2xl border border-stone-200 dark:border-stone-700 max-h-[520px] w-auto"
      })) : null), /*#__PURE__*/React.createElement(OpticGrid, {
        answers: ans,
        flags: flags,
        onPick: busy ? null : pick,
        head: source === "manual" ? "ELLE GİRİŞ · KONTROL" : "OKUNAN OPTİK FORM · KONTROL"
      }), err ? /*#__PURE__*/React.createElement("p", {
        className: "plan-warn mt-3",
        role: "alert"
      }, err) : null, /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap gap-2 mt-4"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "quick-chip is-primary",
        disabled: busy,
        onClick: submit
      }, busy ? "Gönderiliyor…" : "Onaylıyorum, gönder"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "quick-chip",
        disabled: busy,
        onClick: function () {
          setStage("scan");
          setRead(null);
        }
      }, "Yeniden \xE7ek"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "quick-chip",
        disabled: busy,
        onClick: function () {
          setManual(L.answerText(list));
          setStage("manual");
        }
      }, "Elle d\xFCzenle")));
    }
    return /*#__PURE__*/React.createElement("div", null, header, /*#__PURE__*/React.createElement("iframe", {
      ref: frameRef,
      src: C.OPTIK_URL + "&mode=scan&theme=" + (dark ? "dark" : "light"),
      title: "Optik formunu okut",
      className: "optic-frame",
      onLoad: sendExpect
    }), fails ? /*#__PURE__*/React.createElement(Panel, {
      label: "Okuma olmuyor mu?",
      className: "mt-3"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-stone-600 dark:text-stone-300"
    }, "Foto\u011Fraf ", fails, " kez okunamad\u0131. \u0130pu\xE7lar\u0131n\u0131 deneyebilir ya da cevaplar\u0131n\u0131 elle girebilirsin."), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip mt-2",
      onClick: function () {
        setStage("manual");
      }
    }, "Cevaplar\u0131 elle gir")) : /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mt-2"
    }, "Kamera okumuyor mu? ", /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "underline font-semibold",
      onClick: function () {
        setStage("manual");
      }
    }, "Cevaplar\u0131 elle gir")));
  }
  function LiveExamScreen(props) {
    var init = props.liveView || {
      view: "home"
    };
    const [view, setView] = useState(init.view || "home");
    const [examId, setExamId] = useState(init.examId || null);
    const [submitted, setSubmitted] = useState(false);
    var Card = window.KpssLiveCard;
    function open(v, id) {
      setView(v);
      if (id) setExamId(id);
      window.scrollTo(0, 0);
    }
    var nav = /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2 mb-4"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip" + (view === "home" ? " is-primary" : ""),
      onClick: function () {
        open("home");
      }
    }, "Canl\u0131 deneme"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip" + (view === "archive" ? " is-primary" : ""),
      onClick: function () {
        open("archive");
      }
    }, "Denemelerim"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "quick-chip" + (view === "progress" ? " is-primary" : ""),
      onClick: function () {
        open("progress");
      }
    }, "Geli\u015Fimim"));
    if (view === "optic" && examId) {
      return /*#__PURE__*/React.createElement(OpticScan, {
        examId: examId,
        student: props.student,
        onBack: function () {
          open("home");
        },
        onResult: function (id) {
          open("result", id);
        }
      });
    }
    if (view === "exam" && examId && !submitted) {
      return /*#__PURE__*/React.createElement(ExamRunner, {
        examId: examId,
        onBack: function () {
          open("home");
        },
        onResult: function (id) {
          open("result", id);
        },
        onSubmitted: function () {
          setSubmitted(true);
          open("home");
        }
      });
    }
    return /*#__PURE__*/React.createElement("div", null, nav, view === "home" ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-3xl font-display font-black tracking-tight gradient-text"
    }, "Canl\u0131 deneme"), Card ? /*#__PURE__*/React.createElement(Card, {
      student: props.student,
      kpssData: props.kpssData,
      onKonu: props.onKonu,
      full: true,
      onOpen: function (v, id) {
        open(v, id);
      }
    }) : null, /*#__PURE__*/React.createElement(Panel, {
      label: "Nas\u0131l i\u015Fler?"
    }, /*#__PURE__*/React.createElement(Kicker, null, "Nas\u0131l i\u015Fler?"), /*#__PURE__*/React.createElement("ul", {
      className: "mt-2 space-y-1.5 text-sm text-stone-700 dark:text-stone-300 list-disc pl-5"
    }, /*#__PURE__*/React.createElement("li", null, "Hafta i\xE7i kay\u0131t ol. Kay\u0131t pazar 10:00'da kapan\u0131r."), /*#__PURE__*/React.createElement("li", null, "10:00'da soru kitap\xE7\u0131\u011F\u0131 \u015Fifreli olarak cihaz\u0131na iner; 10:15'te kilidi a\xE7\u0131l\u0131r ve herkes ayn\u0131 anda ba\u015Flar."), /*#__PURE__*/React.createElement("li", null, "S\u0131nava 10:45'e kadar girebilirsin; biti\u015F herkes i\xE7in 12:25. Ge\xE7 giren ek s\xFCre almaz."), /*#__PURE__*/React.createElement("li", null, "Her cevap an\u0131nda kaydedilir. \u0130nternet giderse \xE7\xF6zmeye devam et; ba\u011Flant\u0131 gelince g\xF6nderilir."), /*#__PURE__*/React.createElement("li", null, "S\u0131nav tek cihazda a\xE7\u0131k kal\u0131r. \u015Earj\u0131n biterse ba\u015Fka cihazdan devam edebilirsin (en fazla 2 de\u011Fi\u015Fim)."), /*#__PURE__*/React.createElement("li", null, "12:25'te kendi sonucun ve \xE7\xF6z\xFCmlerin a\xE7\u0131l\u0131r; s\u0131ralama ve kat\u0131lan ortalamalar\u0131 12:40'ta kesinle\u015Fir."), /*#__PURE__*/React.createElement("li", null, "Yanl\u0131\u015F ve bo\u015F b\u0131rakt\u0131\u011F\u0131n konular Eksikler'e d\xFC\u015Fer."), /*#__PURE__*/React.createElement("li", null, "K\xE2\u011F\u0131tta da \xE7\xF6zebilirsin: 10:15'te \"K\xE2\u011F\u0131tta \xE7\xF6z\" ile kitap\xE7\u0131k PDF olarak iner, cevaplar\u0131n\u0131 optik forma i\u015Faretlersin. S\u0131nav bitince 15 dakika i\xE7inde formun foto\u011Fraf\u0131n\u0131 \xE7ekip okutursun; okunan cevaplar\u0131 kontrol edip onaylamadan hi\xE7bir \u015Fey g\xF6nderilmez.")))) : null, view === "result" && examId ? /*#__PURE__*/React.createElement(ResultReport, {
      examId: examId,
      kpssData: props.kpssData,
      onKonu: props.onKonu,
      onBack: function () {
        open("home");
      }
    }) : null, view === "archive" ? /*#__PURE__*/React.createElement(Archive, {
      onOpen: function (id) {
        open("result", id);
      }
    }) : null, view === "progress" ? /*#__PURE__*/React.createElement(Progress, {
      student: props.student,
      kpssData: props.kpssData,
      onKonu: props.onKonu
    }) : null);
  }
  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.LiveExamScreen = LiveExamScreen;
  window.KpssComponents.LiveOpticGrid = OpticGrid;
})();