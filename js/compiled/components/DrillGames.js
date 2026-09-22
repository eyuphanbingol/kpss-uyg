/*jsx:babel-7.29.9-react-classic:32194:prp502*/
(function () {
  const {
    useState,
    useEffect,
    useRef,
    useMemo
  } = React;
  var BackBtn = window.KpssBackBtn;
  var COLORS = ["#127880", "#059669", "#4f46e5", "#c2410c"];
  function ge() {
    return window.GamesEngine;
  }
  function store() {
    return window.StudentStore;
  }
  function useMapZoom(hostRef, stageRef, svgHtml, mapFail, locked) {
    var zoomRef = useRef({
      s: 1,
      x: 0,
      y: 0
    });
    useEffect(function () {
      var stage = stageRef.current;
      var canvas = hostRef.current;
      if (!stage || !canvas || mapFail || locked) return;
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
        s = Math.max(1, Math.min(4.5, s));
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
        } else if (e.touches.length === 1 && zoomRef.current.s > 1) {
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
        } else if (gest.mode === "pan" && e.touches.length === 1) {
          var dx = e.touches[0].clientX - gest.x;
          var dy = e.touches[0].clientY - gest.y;
          if (Math.abs(dx) + Math.abs(dy) > 8) gest.moved = true;
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
    }, [svgHtml, mapFail, locked]);
    function bumpZoom(dir) {
      var z = zoomRef.current;
      var s = dir === 0 ? 1 : z.s * (dir > 0 ? 1.35 : 0.74);
      var x = dir === 0 ? 0 : z.x;
      var y = dir === 0 ? 0 : z.y;
      if (s <= 1.02) {
        s = 1;
        x = 0;
        y = 0;
      }
      s = Math.max(1, Math.min(4.5, s));
      zoomRef.current = {
        s: s,
        x: x,
        y: y
      };
      if (hostRef.current) hostRef.current.style.transform = "translate(" + x + "px, " + y + "px) scale(" + s + ")";
    }
    return bumpZoom;
  }
  function ConquerPlay(props) {
    var student = props.student || {};
    var games = student.games || {};
    var owned = games.conquer || {};
    var color = games.conquerColor || "#127880";
    var engine = ge();
    var hostRef = useRef(null);
    var stageRef = useRef(null);
    var [svgHtml, setSvgHtml] = useState("");
    var [mapFail, setMapFail] = useState(false);
    var [pick, setPick] = useState(null);
    var [quiz, setQuiz] = useState(null);
    var [toast, setToast] = useState("");
    var bumpZoom = useMapZoom(hostRef, stageRef, svgHtml, mapFail, !!quiz);
    var progress = useMemo(function () {
      return engine ? engine.regionProgress(owned) : [];
    }, [owned, engine]);
    var nOwn = engine ? engine.conqueredCount(owned) : 0;
    var nAll = engine ? engine.allCodes().length : 81;
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
        setSvgHtml(svg.outerHTML);
      }).catch(function () {
        if (!gone) setMapFail(true);
      });
      return function () {
        gone = true;
      };
    }, []);
    useEffect(function () {
      var wrap = hostRef.current;
      if (!wrap) return;
      wrap.style.setProperty("--conquer-color", color);
      var nodes = wrap.querySelectorAll("path[id^='TR']");
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        var id = p.getAttribute("id");
        p.classList.toggle("conquer-owned", !!owned[id]);
        p.classList.toggle("conquer-pick", pick === id);
      }
    }, [svgHtml, owned, color, pick, quiz]);
    function onStageClick(e) {
      var stage = stageRef.current;
      if (quiz) return;
      if (stage && stage.getAttribute("data-skip-click")) {
        stage.removeAttribute("data-skip-click");
        return;
      }
      var path = e.target && e.target.closest ? e.target.closest("path") : null;
      var id = path && path.getAttribute("id");
      if (!id || !/^TR\d{2}$/.test(id)) return;
      if (owned[id]) {
        setToast((engine && engine.nameOf(id)) + " zaten fethedildi");
        setTimeout(function () {
          setToast("");
        }, 1400);
        return;
      }
      var items = engine ? engine.quizForProvince(id, props.kpssData) : [];
      setPick(id);
      setQuiz({
        code: id,
        items: items,
        i: 0,
        picked: null,
        ok: null,
        fail: false
      });
    }
    function answer(opt) {
      if (!quiz || quiz.picked || quiz.fail) return;
      var q = quiz.items[quiz.i];
      var good = q && String(opt) === String(q.correct);
      setQuiz(Object.assign({}, quiz, {
        picked: opt,
        ok: good
      }));
    }
    function nextQuiz() {
      if (!quiz) return;
      if (!quiz.ok) {
        setQuiz(Object.assign({}, quiz, {
          fail: true,
          picked: quiz.picked
        }));
        return;
      }
      if (quiz.i + 1 >= quiz.items.length) {
        var fresh = store() ? store().conquerProvince(quiz.code) : [];
        var name = engine ? engine.nameOf(quiz.code) : quiz.code;
        var msg = name + " fethedildi!";
        if (fresh && fresh.length) msg += " Rozet: " + fresh.map(function (b) {
          return b.title;
        }).join(", ");
        setToast(msg);
        setTimeout(function () {
          setToast("");
        }, 2200);
        setQuiz(null);
        setPick(null);
        return;
      }
      setQuiz({
        code: quiz.code,
        items: quiz.items,
        i: quiz.i + 1,
        picked: null,
        ok: null,
        fail: false
      });
    }
    function retry() {
      if (!quiz) return;
      var items = engine ? engine.quizForProvince(quiz.code, props.kpssData) : quiz.items;
      setQuiz({
        code: quiz.code,
        items: items,
        i: 0,
        picked: null,
        ok: null,
        fail: false
      });
    }
    var qNow = quiz && quiz.items[quiz.i];
    var qTotal = quiz && quiz.items ? quiz.items.length : 0;
    var qPct = qTotal ? Math.round((quiz.i + (quiz.ok ? 1 : 0)) / qTotal * 100) : 0;
    var mapPct = nAll ? Math.round(nOwn / nAll * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "map-play-root conquer-root" + (quiz ? " conquer-quiz" : "")
    }, /*#__PURE__*/React.createElement("header", {
      className: "map-play-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "map-play-bar"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: quiz ? function () {
        setQuiz(null);
        setPick(null);
      } : props.onBack,
      label: quiz ? "Harita" : "Alıştırmalar"
    }), !quiz ? /*#__PURE__*/React.createElement("div", {
      className: "conquer-colors"
    }, COLORS.map(function (c) {
      return /*#__PURE__*/React.createElement("button", {
        key: c,
        type: "button",
        className: "conquer-swatch" + (color === c ? " on" : ""),
        style: {
          background: c
        },
        "aria-label": "renk",
        onClick: function () {
          if (store()) store().setConquerColor(c);
        }
      });
    }), nOwn > 0 ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "conquer-reset",
      onClick: function () {
        if (!window.confirm("Fetih haritası sıfırlansın mı? Boyanan iller ve bölge rozetleri silinir.")) return;
        if (store()) store().resetConquer();
        setPick(null);
        setToast("Harita sıfırlandı");
        setTimeout(function () {
          setToast("");
        }, 1600);
      }
    }, "S\u0131f\u0131rla") : null) : /*#__PURE__*/React.createElement("span", {
      className: "conquer-scorepill"
    }, quiz.i + 1, " / ", qTotal)), !quiz ? /*#__PURE__*/React.createElement("div", {
      className: "conquer-mapstat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "conquer-mapstat-row"
    }, /*#__PURE__*/React.createElement("p", {
      className: "conquer-mapstat-title"
    }, "T\xFCrkiye'yi Fethet"), /*#__PURE__*/React.createElement("p", {
      className: "conquer-mapstat-num"
    }, nOwn, "/", nAll, " il")), /*#__PURE__*/React.createElement("div", {
      className: "conquer-bar",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: mapPct + "%"
      }
    })), /*#__PURE__*/React.createElement("p", {
      className: "map-play-kicker"
    }, "Boyamak i\xE7in bir ile dokun \xB7 b\xF6lge bitince rozet")) : null, /*#__PURE__*/React.createElement("div", {
      className: "conquer-regions"
    }, progress.map(function (r) {
      return /*#__PURE__*/React.createElement("span", {
        key: r.id,
        className: "conquer-chip" + (r.done ? " on" : "")
      }, r.done ? "🏅 " : "", r.title, " ", r.have, "/", r.total);
    }))), mapFail ? /*#__PURE__*/React.createElement("p", {
      className: "p-6 text-sm text-rose-600"
    }, "Harita y\xFCklenemedi.") : /*#__PURE__*/React.createElement("div", {
      className: "map-play-stage tr-map-wrap conquer-stage",
      ref: stageRef,
      onClick: onStageClick
    }, /*#__PURE__*/React.createElement("div", {
      className: "map-play-canvas",
      ref: hostRef,
      dangerouslySetInnerHTML: {
        __html: svgHtml
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "map-zoom-tools",
      "aria-label": "Harita yak\u0131nla\u015Ft\u0131r"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        bumpZoom(1);
      }
    }, "+"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function () {
        bumpZoom(-1);
      }
    }, "\u2212"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "map-zoom-reset",
      onClick: function () {
        bumpZoom(0);
      }
    }, "Tam"))), !quiz && !mapFail ? /*#__PURE__*/React.createElement("div", {
      className: "conquer-board",
      "aria-label": "B\xF6lge ilerlemesi"
    }, progress.map(function (r) {
      var pct = r.total ? Math.round(r.have / r.total * 100) : 0;
      return /*#__PURE__*/React.createElement("div", {
        key: r.id,
        className: "conquer-board-card" + (r.done ? " on" : "")
      }, /*#__PURE__*/React.createElement("div", {
        className: "conquer-board-row"
      }, /*#__PURE__*/React.createElement("span", {
        className: "conquer-board-title"
      }, r.done ? "🏅 " : "", r.title), /*#__PURE__*/React.createElement("span", {
        className: "conquer-board-num"
      }, r.have, "/", r.total)), /*#__PURE__*/React.createElement("div", {
        className: "conquer-board-bar"
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: pct + "%",
          background: color
        }
      })));
    })) : null, toast ? /*#__PURE__*/React.createElement("div", {
      className: "conquer-toast"
    }, toast) : null, quiz ? /*#__PURE__*/React.createElement("div", {
      className: "conquer-sheet"
    }, /*#__PURE__*/React.createElement("div", {
      className: "conquer-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: "conquer-topic"
    }, engine ? engine.regionTitle(quiz.code) : ""), /*#__PURE__*/React.createElement("p", {
      className: "conquer-il"
    }, engine ? engine.nameOf(quiz.code) : quiz.code), /*#__PURE__*/React.createElement("p", {
      className: "conquer-sub"
    }, "Bu ile ait ", qTotal, " soru \xB7 hepsini art arda bil"), /*#__PURE__*/React.createElement("div", {
      className: "conquer-bar light",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: qPct + "%"
      }
    }))), quiz.fail ? /*#__PURE__*/React.createElement("div", {
      className: "conquer-fail"
    }, /*#__PURE__*/React.createElement("p", {
      className: "conquer-fail-title"
    }, "\u0130l al\u0131namad\u0131"), /*#__PURE__*/React.createElement("p", {
      className: "conquer-fail-text"
    }, "Yanl\u0131\u015F cevapta fetih s\u0131f\u0131rlan\u0131r. ", engine ? engine.nameOf(quiz.code) : "", " sorular\u0131n\u0131 ba\u015Ftan bilmen gerekir."), /*#__PURE__*/React.createElement("div", {
      className: "conquer-fail-actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-primary text-white px-5 py-3 rounded-2xl font-semibold",
      onClick: retry
    }, "Tekrar dene"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "conquer-ghost",
      onClick: function () {
        setQuiz(null);
        setPick(null);
      }
    }, "Haritaya d\xF6n"))) : qNow ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "conquer-qcount"
    }, "Soru ", quiz.i + 1, " / ", qTotal), /*#__PURE__*/React.createElement("p", {
      className: "conquer-q"
    }, qNow.question), /*#__PURE__*/React.createElement("div", {
      className: "conquer-opts"
    }, (qNow.options || []).map(function (opt, i) {
      var isP = quiz.picked === opt;
      var isA = String(opt) === String(qNow.correct);
      var cls = "conquer-opt";
      if (quiz.picked && isA) cls += " yes";else if (quiz.picked && isP) cls += " no";
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        type: "button",
        disabled: !!quiz.picked,
        className: cls,
        onClick: function () {
          answer(opt);
        }
      }, opt);
    })), quiz.picked ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-primary text-white w-full px-5 py-3 rounded-2xl font-semibold mt-4",
      onClick: nextQuiz
    }, quiz.ok ? quiz.i + 1 >= qTotal ? "İli fethet" : "Sonraki soru" : "Sonucu gör") : null) : null) : null);
  }
  function TabuPlay(props) {
    var engine = ge();
    var games = props.student && props.student.games || {};
    var deck = useMemo(function () {
      var seen = props.student && props.student.games && props.student.games.tabuSeen || {};
      return engine ? engine.tabuDeck(12, props.kpssData, seen) : [];
    }, [props.seed]);
    var [i, setI] = useState(0);
    var [open, setOpen] = useState(1);
    var [picked, setPicked] = useState(null);
    var [score, setScore] = useState(0);
    var [done, setDone] = useState(false);
    var card = deck[i];
    useEffect(function () {
      if (done || !card || !card.id) return;
      if (store() && store().markGameSeen) store().markGameSeen("tabu", card.id);
    }, [card && card.id, done]);
    function resetCards() {
      if (!window.confirm("Görülen tabu kartları sıfırlansın mı? Sorular yeniden gelir.")) return;
      if (store() && store().resetGameSeen) store().resetGameSeen("tabu");
      if (props.onAgain) props.onAgain();
    }
    function reveal() {
      if (picked || !card) return;
      setOpen(Math.min(3, open + 1));
    }
    function choose(opt) {
      if (picked || !card) return;
      var ok = String(opt) === String(card.answer);
      var add = ok ? engine ? engine.tabuPoints(open) : 1 : 0;
      setPicked(opt);
      setScore(function (s) {
        return s + add;
      });
    }
    function next() {
      if (i + 1 >= deck.length) {
        setDone(true);
        if (store()) store().noteTabuBest(score);
        return;
      }
      setI(i + 1);
      setOpen(1);
      setPicked(null);
    }
    if (done) {
      return /*#__PURE__*/React.createElement("div", {
        className: "map-play-root tabu-root"
      }, /*#__PURE__*/React.createElement("header", {
        className: "map-play-top"
      }, /*#__PURE__*/React.createElement(BackBtn, {
        onClick: props.onBack,
        label: "Al\u0131\u015Ft\u0131rmalar"
      })), /*#__PURE__*/React.createElement("div", {
        className: "game-end"
      }, /*#__PURE__*/React.createElement("p", {
        className: "tabu-end-kicker"
      }, "Tur bitti"), /*#__PURE__*/React.createElement("p", {
        className: "tabu-end-score"
      }, score), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-500 mt-2"
      }, "En iyi: ", Math.max(score, games.tabuBest || 0)), /*#__PURE__*/React.createElement("p", {
        className: "tabu-end-note"
      }, "\u0130pucu a\xE7madan bilmek 5, ikinci ipucu 3, \xFC\xE7\xFCnc\xFC 1 puan. \xC7\u0131kan kart bir daha gelmez."), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn-primary text-white px-5 py-2.5 rounded-full mt-6",
        onClick: props.onAgain
      }, "Yeniden"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "conquer-reset mt-3",
        onClick: resetCards
      }, "Kartlar\u0131 s\u0131f\u0131rla")));
    }
    if (!deck.length) {
      return /*#__PURE__*/React.createElement("div", {
        className: "map-play-root tabu-root"
      }, /*#__PURE__*/React.createElement("header", {
        className: "map-play-top"
      }, /*#__PURE__*/React.createElement(BackBtn, {
        onClick: props.onBack,
        label: "Al\u0131\u015Ft\u0131rmalar"
      })), /*#__PURE__*/React.createElement("div", {
        className: "tabu-body"
      }, /*#__PURE__*/React.createElement("p", {
        className: "tabu-ask"
      }, "T\xFCm tabu kartlar\u0131n\u0131 g\xF6rd\xFCn."), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-400 mt-2"
      }, "S\u0131f\u0131rlarsan sorular yeniden gelir."), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn-primary text-white px-5 py-2.5 rounded-full mt-6",
        onClick: resetCards
      }, "Kartlar\u0131 s\u0131f\u0131rla")));
    }
    var pts = engine ? engine.tabuPoints(open) : 5;
    var ptsLabel = open <= 1 ? "Tek ipucu · 5 puan" : open === 2 ? "İki ipucu · 3 puan" : "Üç ipucu · 1 puan";
    return /*#__PURE__*/React.createElement("div", {
      className: "map-play-root tabu-root"
    }, /*#__PURE__*/React.createElement("header", {
      className: "map-play-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "map-play-bar"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Al\u0131\u015Ft\u0131rmalar"
    }), /*#__PURE__*/React.createElement("span", {
      className: "tabu-scorepill"
    }, score, " puan \xB7 ", i + 1, "/", deck.length), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "conquer-reset",
      onClick: resetCards
    }, "S\u0131f\u0131rla")), /*#__PURE__*/React.createElement("p", {
      className: "map-play-kicker"
    }, "Notlardan kavram \xB7 az ipucu = y\xFCksek puan")), /*#__PURE__*/React.createElement("div", {
      className: "tabu-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tabu-hero"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tabu-topic"
    }, card && card.topic ? card.topic : "Notlar"), /*#__PURE__*/React.createElement("p", {
      className: "tabu-ask"
    }, "Bu hangi kavram?"), /*#__PURE__*/React.createElement("div", {
      className: "tabu-mystery" + (picked ? " shown" : "")
    }, picked ? card.answer : "?")), /*#__PURE__*/React.createElement("div", {
      className: "tabu-clues"
    }, (card && card.clues || ["", "", ""]).map(function (cl, ci) {
      var shown = ci < open;
      var canOpen = !picked && ci === open;
      return /*#__PURE__*/React.createElement("button", {
        key: ci,
        type: "button",
        disabled: !!picked || shown || !canOpen,
        className: "tabu-card" + (shown ? " open" : "") + (canOpen ? " next" : "") + (!shown && !canOpen ? " locked" : ""),
        onClick: reveal
      }, /*#__PURE__*/React.createElement("span", {
        className: "tabu-n"
      }, ci + 1, ". ipucu", ci === 0 ? " · açık" : shown ? " · açıldı" : canOpen ? " · dokun" : " · kilitli"), /*#__PURE__*/React.createElement("span", {
        className: "tabu-cl"
      }, shown ? cl : canOpen ? "Bir ipucu daha aç" : "Kilitli"));
    })), /*#__PURE__*/React.createElement("div", {
      className: "tabu-meter",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: open === 1 ? "on" : ""
    }, "1 ipucu 5p"), /*#__PURE__*/React.createElement("span", {
      className: open === 2 ? "on" : ""
    }, "2 ipucu 3p"), /*#__PURE__*/React.createElement("span", {
      className: open === 3 ? "on" : ""
    }, "3 ipucu 1p")), /*#__PURE__*/React.createElement("p", {
      className: "tabu-hint"
    }, /*#__PURE__*/React.createElement("span", null, ptsLabel), /*#__PURE__*/React.createElement("span", {
      className: "tabu-pts"
    }, "\u015Eu an ", pts, " puan")), /*#__PURE__*/React.createElement("div", {
      className: "tabu-opts"
    }, (card && card.choices || []).map(function (opt, oi) {
      var isP = picked === opt;
      var isA = card && String(opt) === String(card.answer);
      var cls = "tabu-opt";
      if (picked && isA) cls += " yes";else if (picked && isP) cls += " no";
      return /*#__PURE__*/React.createElement("button", {
        key: oi,
        type: "button",
        disabled: !!picked,
        className: cls,
        onClick: function () {
          choose(opt);
        }
      }, opt);
    })), picked ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn-primary text-white w-full px-5 py-3 rounded-2xl font-semibold mt-4",
      onClick: next
    }, i + 1 >= deck.length ? "Bitir" : "Sonraki kavram") : null));
  }
  function PanicPlay(props) {
    var engine = ge();
    var games = props.student && props.student.games || {};
    var PANIC_MS = 30000;
    var deck = useMemo(function () {
      return engine ? engine.panicDeck(props.kpssData) : [];
    }, [props.seed]);
    var [i, setI] = useState(0);
    var [ms, setMs] = useState(PANIC_MS);
    var [score, setScore] = useState(0);
    var [flash, setFlash] = useState("");
    var [over, setOver] = useState(false);
    var [missed, setMissed] = useState([]);
    var live = useRef({
      ms: PANIC_MS,
      over: false,
      i: 0,
      score: 0
    });
    useEffect(function () {
      live.current = {
        ms: PANIC_MS,
        over: false,
        i: 0,
        score: 0
      };
      setMs(PANIC_MS);
      setI(0);
      setScore(0);
      setOver(false);
      setFlash("");
      setMissed([]);
    }, [props.seed]);
    useEffect(function () {
      if (over) return;
      var t0 = Date.now();
      var start = live.current.ms;
      var id = setInterval(function () {
        var left = start - (Date.now() - t0);
        live.current.ms = left;
        setMs(left);
        if (left <= 0) {
          clearInterval(id);
          live.current.over = true;
          setOver(true);
          if (store()) store().notePanicBest(live.current.score);
        }
      }, 80);
      return function () {
        clearInterval(id);
      };
    }, [i, over, props.seed]);
    function bump(delta) {
      var next = Math.max(0, live.current.ms + delta);
      live.current.ms = next;
      setMs(next);
      if (next <= 0) {
        live.current.over = true;
        setOver(true);
        if (store()) store().notePanicBest(live.current.score);
      }
    }
    function choose(opt) {
      if (over || !deck.length) return;
      var cur = deck[i % deck.length];
      var ok = String(opt) === String(cur.a);
      if (ok) {
        live.current.score += 1;
        setScore(live.current.score);
        setFlash("ok");
        bump(2000);
      } else {
        setMissed(function (prev) {
          return prev.concat([{
            q: cur.q,
            picked: opt,
            a: cur.a
          }]);
        });
        setFlash("bad");
        bump(-3000);
      }
      setTimeout(function () {
        setFlash("");
      }, 280);
      live.current.i += 1;
      setI(live.current.i);
    }
    var q = deck[i % Math.max(1, deck.length)];
    var sec = Math.max(0, ms / 1000);
    if (over) {
      return /*#__PURE__*/React.createElement("div", {
        className: "map-play-root panic-root"
      }, /*#__PURE__*/React.createElement("header", {
        className: "map-play-top"
      }, /*#__PURE__*/React.createElement(BackBtn, {
        onClick: props.onBack,
        label: "Al\u0131\u015Ft\u0131rmalar"
      })), /*#__PURE__*/React.createElement("div", {
        className: "game-end"
      }, /*#__PURE__*/React.createElement("p", {
        className: "tabu-end-kicker"
      }, "S\xFCre bitti"), /*#__PURE__*/React.createElement("p", {
        className: "tabu-end-score"
      }, score), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-stone-500 mt-2"
      }, "Do\u011Fru say\u0131s\u0131 \xB7 rekor ", Math.max(score, games.panicBest || 0)), missed.length ? /*#__PURE__*/React.createElement("div", {
        className: "panic-miss"
      }, /*#__PURE__*/React.createElement("p", {
        className: "panic-miss-title"
      }, "Yanl\u0131\u015F ", missed.length, " soru"), /*#__PURE__*/React.createElement("ul", {
        className: "space-y-3"
      }, missed.map(function (w, wi) {
        return /*#__PURE__*/React.createElement("li", {
          key: wi,
          className: "panic-miss-item"
        }, /*#__PURE__*/React.createElement("p", {
          className: "font-semibold"
        }, w.q), /*#__PURE__*/React.createElement("p", {
          className: "text-rose-600 dark:text-rose-400 mt-1"
        }, "Senin: ", w.picked), /*#__PURE__*/React.createElement("p", {
          className: "text-emerald-700 dark:text-emerald-400"
        }, "Do\u011Fru: ", w.a));
      }))) : /*#__PURE__*/React.createElement("p", {
        className: "tabu-end-note"
      }, "Bu turda yanl\u0131\u015F\u0131n yok."), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn-primary text-white px-5 py-2.5 rounded-full mt-6",
        onClick: props.onAgain
      }, "Tekrar oyna")));
    }
    var low = sec <= 8;
    var opts = q && q.choices || [];
    var twoCol = opts.length >= 2 && opts.every(function (c) {
      return String(c).length <= 28;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "map-play-root panic-root" + (flash === "ok" ? " panic-ok" : "") + (flash === "bad" ? " panic-bad" : "") + (low ? " panic-low" : "")
    }, /*#__PURE__*/React.createElement("header", {
      className: "map-play-top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "map-play-bar"
    }, /*#__PURE__*/React.createElement(BackBtn, {
      onClick: props.onBack,
      label: "Al\u0131\u015Ft\u0131rmalar"
    }), /*#__PURE__*/React.createElement("span", {
      className: "conquer-scorepill"
    }, score, " do\u011Fru"))), /*#__PURE__*/React.createElement("div", {
      className: "panic-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panic-hero"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panic-hero-row"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "conquer-topic"
    }, "+2 / \u22123 sn"), /*#__PURE__*/React.createElement("p", {
      className: "panic-ask"
    }, "Son 30 saniye")), /*#__PURE__*/React.createElement("div", {
      className: "panic-timer"
    }, sec.toFixed(1))), /*#__PURE__*/React.createElement("div", {
      className: "panic-bar"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: Math.min(100, ms / PANIC_MS * 100) + "%"
      }
    })), /*#__PURE__*/React.createElement("p", {
      className: "panic-hero-sub"
    }, "Rekor ", games.panicBest || 0)), /*#__PURE__*/React.createElement("div", {
      className: "panic-stem"
    }, /*#__PURE__*/React.createElement("div", {
      className: "panic-stem-bar",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("p", {
      className: "panic-q"
    }, q ? q.q : "")), /*#__PURE__*/React.createElement("div", {
      className: "panic-choices" + (twoCol ? " cols-2" : "")
    }, opts.map(function (opt, oi) {
      return /*#__PURE__*/React.createElement("button", {
        key: oi,
        type: "button",
        className: "panic-opt",
        onClick: function () {
          choose(opt);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "panic-letter"
      }, String.fromCharCode(65 + oi)), /*#__PURE__*/React.createElement("span", {
        className: "panic-opt-text"
      }, opt));
    }))));
  }
  window.KpssComponents = window.KpssComponents || {};
  window.KpssComponents.ConquerPlay = ConquerPlay;
  window.KpssComponents.TabuPlay = TabuPlay;
  window.KpssComponents.PanicPlay = PanicPlay;
})();