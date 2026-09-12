(function () {
    const { useState, useEffect, useRef, useMemo } = React;
    var BackBtn = window.KpssBackBtn;

    var COLORS = ["#127880", "#059669", "#4f46e5", "#c2410c"];

    function ge() { return window.GamesEngine; }
    function store() { return window.StudentStore; }

    function useMapZoom(hostRef, stageRef, svgHtml, mapFail, locked) {
        var zoomRef = useRef({ s: 1, x: 0, y: 0 });
        useEffect(function () {
            var stage = stageRef.current;
            var canvas = hostRef.current;
            if (!stage || !canvas || mapFail || locked) return;
            var gest = { mode: "", x: 0, y: 0, dist: 0, s0: 1, x0: 0, y0: 0, moved: false };
            function apply(s, x, y) {
                s = Math.max(1, Math.min(4.5, s));
                if (s <= 1.02) { s = 1; x = 0; y = 0; }
                zoomRef.current = { s: s, x: x, y: y };
                canvas.style.transform = "translate(" + x + "px, " + y + "px) scale(" + s + ")";
            }
            function pinchDist(touches) {
                var a = touches[0], b = touches[1];
                var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
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
            stage.addEventListener("touchstart", onTouchStart, { passive: true });
            stage.addEventListener("touchmove", onTouchMove, { passive: false });
            stage.addEventListener("touchend", onTouchEnd);
            stage.addEventListener("wheel", onWheel, { passive: false });
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
            if (s <= 1.02) { s = 1; x = 0; y = 0; }
            s = Math.max(1, Math.min(4.5, s));
            zoomRef.current = { s: s, x: x, y: y };
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
            fetch("svg/tr.svg?v=2").then(function (r) { return r.ok ? r.text() : Promise.reject(); })
                .then(function (txt) {
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
                })
                .catch(function () { if (!gone) setMapFail(true); });
            return function () { gone = true; };
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
                setTimeout(function () { setToast(""); }, 1400);
                return;
            }
            var items = engine ? engine.quizForProvince(id, props.kpssData) : [];
            setPick(id);
            setQuiz({ code: id, items: items, i: 0, picked: null, ok: null, fail: false });
        }

        function answer(opt) {
            if (!quiz || quiz.picked || quiz.fail) return;
            var q = quiz.items[quiz.i];
            var good = q && String(opt) === String(q.correct);
            setQuiz(Object.assign({}, quiz, { picked: opt, ok: good }));
        }

        function nextQuiz() {
            if (!quiz) return;
            if (!quiz.ok) {
                setQuiz(Object.assign({}, quiz, { fail: true, picked: quiz.picked }));
                return;
            }
            if (quiz.i + 1 >= quiz.items.length) {
                var fresh = store() ? store().conquerProvince(quiz.code) : [];
                var name = engine ? engine.nameOf(quiz.code) : quiz.code;
                var msg = name + " fethedildi!";
                if (fresh && fresh.length) msg += " Rozet: " + fresh.map(function (b) { return b.title; }).join(", ");
                setToast(msg);
                setTimeout(function () { setToast(""); }, 2200);
                setQuiz(null);
                setPick(null);
                return;
            }
            setQuiz({ code: quiz.code, items: quiz.items, i: quiz.i + 1, picked: null, ok: null, fail: false });
        }

        function retry() {
            if (!quiz) return;
            var items = engine ? engine.quizForProvince(quiz.code, props.kpssData) : quiz.items;
            setQuiz({ code: quiz.code, items: items, i: 0, picked: null, ok: null, fail: false });
        }

        var qNow = quiz && quiz.items[quiz.i];
        var qTotal = quiz && quiz.items ? quiz.items.length : 0;
        var qPct = qTotal ? Math.round(((quiz.i + (quiz.ok ? 1 : 0)) / qTotal) * 100) : 0;
        var mapPct = nAll ? Math.round((nOwn / nAll) * 100) : 0;

        return (
            <div className={"map-play-root conquer-root" + (quiz ? " conquer-quiz" : "")}>
                <header className="map-play-top">
                    <div className="map-play-bar">
                        <BackBtn onClick={quiz ? function () { setQuiz(null); setPick(null); } : props.onBack} label={quiz ? "Harita" : "Alıştırmalar"} />
                        {!quiz ? (
                            <div className="conquer-colors">
                                {COLORS.map(function (c) {
                                    return (
                                        <button key={c} type="button" className={"conquer-swatch" + (color === c ? " on" : "")}
                                            style={{ background: c }} aria-label="renk"
                                            onClick={function () { if (store()) store().setConquerColor(c); }} />
                                    );
                                })}
                                {nOwn > 0 ? (
                                    <button type="button" className="conquer-reset"
                                        onClick={function () {
                                            if (!window.confirm("Fetih haritası sıfırlansın mı? Boyanan iller ve bölge rozetleri silinir.")) return;
                                            if (store()) store().resetConquer();
                                            setPick(null);
                                            setToast("Harita sıfırlandı");
                                            setTimeout(function () { setToast(""); }, 1600);
                                        }}>Sıfırla</button>
                                ) : null}
                            </div>
                        ) : (
                            <span className="conquer-scorepill">{quiz.i + 1} / {qTotal}</span>
                        )}
                    </div>
                    {!quiz ? (
                        <div className="conquer-mapstat">
                            <div className="conquer-mapstat-row">
                                <p className="conquer-mapstat-title">Türkiye'yi Fethet</p>
                                <p className="conquer-mapstat-num">{nOwn}/{nAll} il</p>
                            </div>
                            <div className="conquer-bar" aria-hidden="true"><span style={{ width: mapPct + "%" }} /></div>
                            <p className="map-play-kicker">Boyamak için bir ile dokun · bölge bitince rozet</p>
                        </div>
                    ) : null}
                    <div className="conquer-regions">
                        {progress.map(function (r) {
                            return (
                                <span key={r.id} className={"conquer-chip" + (r.done ? " on" : "")}>
                                    {r.done ? "🏅 " : ""}{r.title} {r.have}/{r.total}
                                </span>
                            );
                        })}
                    </div>
                </header>
                {mapFail ? (
                    <p className="p-6 text-sm text-rose-600">Harita yüklenemedi.</p>
                ) : (
                    <div className="map-play-stage tr-map-wrap conquer-stage" ref={stageRef} onClick={onStageClick}>
                        <div className="map-play-canvas" ref={hostRef} dangerouslySetInnerHTML={{ __html: svgHtml }} />
                        <div className="map-zoom-tools" aria-label="Harita yakınlaştır">
                            <button type="button" onClick={function () { bumpZoom(1); }}>+</button>
                            <button type="button" onClick={function () { bumpZoom(-1); }}>−</button>
                            <button type="button" className="map-zoom-reset" onClick={function () { bumpZoom(0); }}>Tam</button>
                        </div>
                    </div>
                )}
                {toast ? <div className="conquer-toast">{toast}</div> : null}
                {quiz ? (
                    <div className="conquer-sheet">
                        <div className="conquer-hero">
                            <span className="conquer-topic">{engine ? engine.regionTitle(quiz.code) : ""}</span>
                            <p className="conquer-il">{engine ? engine.nameOf(quiz.code) : quiz.code}</p>
                            <p className="conquer-sub">Bu ile ait {qTotal} soru · hepsini art arda bil</p>
                            <div className="conquer-bar light" aria-hidden="true"><span style={{ width: qPct + "%" }} /></div>
                        </div>
                        {quiz.fail ? (
                            <div className="conquer-fail">
                                <p className="conquer-fail-title">İl alınamadı</p>
                                <p className="conquer-fail-text">Yanlış cevapta fetih sıfırlanır. {engine ? engine.nameOf(quiz.code) : ""} sorularını baştan bilmen gerekir.</p>
                                <div className="conquer-fail-actions">
                                    <button type="button" className="btn-primary text-white px-5 py-3 rounded-2xl font-semibold" onClick={retry}>Tekrar dene</button>
                                    <button type="button" className="conquer-ghost" onClick={function () { setQuiz(null); setPick(null); }}>Haritaya dön</button>
                                </div>
                            </div>
                        ) : qNow ? (
                            <div>
                                <p className="conquer-qcount">Soru {quiz.i + 1} / {qTotal}</p>
                                <p className="conquer-q">{qNow.question}</p>
                                <div className="conquer-opts">
                                    {(qNow.options || []).map(function (opt, i) {
                                        var isP = quiz.picked === opt;
                                        var isA = String(opt) === String(qNow.correct);
                                        var cls = "conquer-opt";
                                        if (quiz.picked && isA) cls += " yes";
                                        else if (quiz.picked && isP) cls += " no";
                                        return (
                                            <button key={i} type="button" disabled={!!quiz.picked} className={cls}
                                                onClick={function () { answer(opt); }}>{opt}</button>
                                        );
                                    })}
                                </div>
                                {quiz.picked ? (
                                    <button type="button" className="btn-primary text-white w-full px-5 py-3 rounded-2xl font-semibold mt-4"
                                        onClick={nextQuiz}>{quiz.ok ? (quiz.i + 1 >= qTotal ? "İli fethet" : "Sonraki soru") : "Sonucu gör"}</button>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </div>
        );
    }

    function TabuPlay(props) {
        var engine = ge();
        var games = (props.student && props.student.games) || {};
        var deck = useMemo(function () {
            var seen = (props.student && props.student.games && props.student.games.tabuSeen) || {};
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
            var add = ok ? (engine ? engine.tabuPoints(open) : 1) : 0;
            setPicked(opt);
            setScore(function (s) { return s + add; });
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
            return (
                <div className="map-play-root tabu-root">
                    <header className="map-play-top">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                    </header>
                    <div className="game-end">
                        <p className="tabu-end-kicker">Tur bitti</p>
                        <p className="tabu-end-score">{score}</p>
                        <p className="text-sm text-stone-500 mt-2">En iyi: {Math.max(score, games.tabuBest || 0)}</p>
                        <p className="tabu-end-note">İpucu açmadan bilmek 5, ikinci ipucu 3, üçüncü 1 puan. Çıkan kart bir daha gelmez.</p>
                        <button type="button" className="btn-primary text-white px-5 py-2.5 rounded-full mt-6" onClick={props.onAgain}>Yeniden</button>
                        <button type="button" className="conquer-reset mt-3" onClick={resetCards}>Kartları sıfırla</button>
                    </div>
                </div>
            );
        }

        if (!deck.length) {
            return (
                <div className="map-play-root tabu-root">
                    <header className="map-play-top">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                    </header>
                    <div className="tabu-body">
                        <p className="tabu-ask">Tüm tabu kartlarını gördün.</p>
                        <p className="text-sm text-stone-400 mt-2">Sıfırlarsan sorular yeniden gelir.</p>
                        <button type="button" className="btn-primary text-white px-5 py-2.5 rounded-full mt-6" onClick={resetCards}>Kartları sıfırla</button>
                    </div>
                </div>
            );
        }

        var pts = engine ? engine.tabuPoints(open) : 5;
        var ptsLabel = open <= 1 ? "Tek ipucu · 5 puan" : open === 2 ? "İki ipucu · 3 puan" : "Üç ipucu · 1 puan";

        return (
            <div className="map-play-root tabu-root">
                <header className="map-play-top">
                    <div className="map-play-bar">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                        <span className="tabu-scorepill">{score} puan · {i + 1}/{deck.length}</span>
                        <button type="button" className="conquer-reset" onClick={resetCards}>Sıfırla</button>
                    </div>
                    <p className="map-play-kicker">Notlardan kavram · az ipucu = yüksek puan</p>
                </header>
                <div className="tabu-body">
                    <div className="tabu-hero">
                        <span className="tabu-topic">{card && card.topic ? card.topic : "Notlar"}</span>
                        <p className="tabu-ask">Bu hangi kavram?</p>
                        <div className={"tabu-mystery" + (picked ? " shown" : "")}>{picked ? card.answer : "?"}</div>
                    </div>
                    <div className="tabu-clues">
                        {(card && card.clues || ["", "", ""]).map(function (cl, ci) {
                            var shown = ci < open;
                            var canOpen = !picked && ci === open;
                            return (
                                <button key={ci} type="button" disabled={!!picked || shown || !canOpen}
                                    className={"tabu-card" + (shown ? " open" : "") + (canOpen ? " next" : "") + (!shown && !canOpen ? " locked" : "")}
                                    onClick={reveal}>
                                    <span className="tabu-n">{ci + 1}. ipucu{ci === 0 ? " · açık" : shown ? " · açıldı" : canOpen ? " · dokun" : " · kilitli"}</span>
                                    <span className="tabu-cl">{shown ? cl : (canOpen ? "Bir ipucu daha aç" : "Kilitli")}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="tabu-meter" aria-hidden="true">
                        <span className={open === 1 ? "on" : ""}>1 ipucu 5p</span>
                        <span className={open === 2 ? "on" : ""}>2 ipucu 3p</span>
                        <span className={open === 3 ? "on" : ""}>3 ipucu 1p</span>
                    </div>
                    <p className="tabu-hint"><span>{ptsLabel}</span><span className="tabu-pts">Şu an {pts} puan</span></p>
                    <div className="tabu-opts">
                        {(card && card.choices || []).map(function (opt, oi) {
                            var isP = picked === opt;
                            var isA = card && String(opt) === String(card.answer);
                            var cls = "tabu-opt";
                            if (picked && isA) cls += " yes";
                            else if (picked && isP) cls += " no";
                            return (
                                <button key={oi} type="button" disabled={!!picked} className={cls}
                                    onClick={function () { choose(opt); }}>{opt}</button>
                            );
                        })}
                    </div>
                    {picked ? (
                        <button type="button" className="btn-primary text-white w-full px-5 py-3 rounded-2xl font-semibold mt-4" onClick={next}>
                            {i + 1 >= deck.length ? "Bitir" : "Sonraki kavram"}
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }

    function PanicPlay(props) {
        var engine = ge();
        var games = (props.student && props.student.games) || {};
        var PANIC_MS = 30000;
        var deck = useMemo(function () { return engine ? engine.panicDeck(props.kpssData) : []; }, [props.seed]);
        var [i, setI] = useState(0);
        var [ms, setMs] = useState(PANIC_MS);
        var [score, setScore] = useState(0);
        var [flash, setFlash] = useState("");
        var [over, setOver] = useState(false);
        var [missed, setMissed] = useState([]);
        var live = useRef({ ms: PANIC_MS, over: false, i: 0, score: 0 });

        useEffect(function () {
            live.current = { ms: PANIC_MS, over: false, i: 0, score: 0 };
            setMs(PANIC_MS); setI(0); setScore(0); setOver(false); setFlash(""); setMissed([]);
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
            return function () { clearInterval(id); };
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
                    return prev.concat([{ q: cur.q, picked: opt, a: cur.a }]);
                });
                setFlash("bad");
                bump(-3000);
            }
            setTimeout(function () { setFlash(""); }, 280);
            live.current.i += 1;
            setI(live.current.i);
        }

        var q = deck[i % Math.max(1, deck.length)];
        var sec = Math.max(0, ms / 1000);

        if (over) {
            return (
                <div className="map-play-root panic-root">
                    <header className="map-play-top">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                    </header>
                    <div className="game-end">
                        <p className="tabu-end-kicker">Süre bitti</p>
                        <p className="tabu-end-score">{score}</p>
                        <p className="text-sm text-stone-500 mt-2">Doğru sayısı · rekor {Math.max(score, games.panicBest || 0)}</p>
                        {missed.length ? (
                            <div className="panic-miss">
                                <p className="panic-miss-title">Yanlış {missed.length} soru</p>
                                <ul className="space-y-3">
                                    {missed.map(function (w, wi) {
                                        return (
                                            <li key={wi} className="panic-miss-item">
                                                <p className="font-semibold">{w.q}</p>
                                                <p className="text-rose-600 dark:text-rose-400 mt-1">Senin: {w.picked}</p>
                                                <p className="text-emerald-700 dark:text-emerald-400">Doğru: {w.a}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : (
                            <p className="tabu-end-note">Bu turda yanlışın yok.</p>
                        )}
                        <button type="button" className="btn-primary text-white px-5 py-2.5 rounded-full mt-6" onClick={props.onAgain}>Tekrar oyna</button>
                    </div>
                </div>
            );
        }

        var low = sec <= 8;
        var opts = (q && q.choices) || [];
        var twoCol = opts.length >= 2 && opts.every(function (c) { return String(c).length <= 28; });
        return (
            <div className={"map-play-root panic-root" + (flash === "ok" ? " panic-ok" : "") + (flash === "bad" ? " panic-bad" : "") + (low ? " panic-low" : "")}>
                <header className="map-play-top">
                    <div className="map-play-bar">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                        <span className="conquer-scorepill">{score} doğru</span>
                    </div>
                </header>
                <div className="panic-body">
                    <div className="panic-hero">
                        <div className="panic-hero-row">
                            <div>
                                <span className="conquer-topic">+2 / −3 sn</span>
                                <p className="panic-ask">Son 30 saniye</p>
                            </div>
                            <div className="panic-timer">{sec.toFixed(1)}</div>
                        </div>
                        <div className="panic-bar"><span style={{ width: Math.min(100, (ms / PANIC_MS) * 100) + "%" }} /></div>
                        <p className="panic-hero-sub">Rekor {games.panicBest || 0}</p>
                    </div>
                    <div className="panic-stem">
                        <div className="panic-stem-bar" aria-hidden="true"></div>
                        <p className="panic-q">{q ? q.q : ""}</p>
                    </div>
                    <div className={"panic-choices" + (twoCol ? " cols-2" : "")}>
                        {opts.map(function (opt, oi) {
                            return (
                                <button key={oi} type="button" className="panic-opt"
                                    onClick={function () { choose(opt); }}>
                                    <span className="panic-letter">{String.fromCharCode(65 + oi)}</span>
                                    <span className="panic-opt-text">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    function KodlamaPlay(props) {
        var student = props.student || {};
        var games = student.games || {};
        var engine = ge();
        var TICK = engine && engine.kodlamaTickMs ? engine.kodlamaTickMs() : 12000;
        var deck = useMemo(function () {
            var seen = (props.student && props.student.games && props.student.games.kodlamaSeen) || {};
            return engine && engine.kodlamaDeck ? engine.kodlamaDeck(10, seen) : [];
        }, [engine, props.seed]);
        var [i, setI] = useState(0);
        var [picked, setPicked] = useState(null);
        var [score, setScore] = useState(0);
        var [combo, setCombo] = useState(0);
        var [comboMax, setComboMax] = useState(0);
        var [lives, setLives] = useState(3);
        var [ms, setMs] = useState(TICK);
        var [done, setDone] = useState(false);
        var [gain, setGain] = useState(0);
        var live = useRef({ picked: false, done: false, lives: 3, combo: 0, comboMax: 0, score: 0, ms: TICK });
        var card = deck[i];

        useEffect(function () {
            live.current = { picked: false, done: false, lives: 3, combo: 0, comboMax: 0, score: 0, ms: TICK };
            setI(0); setPicked(null); setScore(0); setCombo(0); setComboMax(0);
            setLives(3); setMs(TICK); setDone(false); setGain(0);
        }, [props.seed]);

        useEffect(function () {
            if (done || !card || !card.id) return;
            if (store() && store().markGameSeen) store().markGameSeen("kodlama", card.id);
        }, [card && card.id, done]);

        function finish() {
            if (live.current.done) return;
            live.current.done = true;
            setDone(true);
            if (store() && store().noteKodlamaBest) store().noteKodlamaBest(live.current.score);
        }

        function goNext() {
            if (live.current.done) return;
            if (live.current.lives <= 0 || i + 1 >= deck.length) {
                finish();
                return;
            }
            live.current.picked = false;
            setPicked(null);
            setGain(0);
            setI(i + 1);
        }

        function resolve(opt) {
            if (live.current.picked || live.current.done || !card) return;
            live.current.picked = true;
            var ok = opt !== "__time" && String(opt) === String(card.a);
            var left = Math.max(0, live.current.ms);
            if (ok) {
                var nextCombo = live.current.combo + 1;
                live.current.combo = nextCombo;
                if (nextCombo > live.current.comboMax) live.current.comboMax = nextCombo;
                var add = engine && engine.kodlamaScore ? engine.kodlamaScore(left, nextCombo, card.mode === "cipher") : 100;
                live.current.score += add;
                setCombo(nextCombo);
                setComboMax(live.current.comboMax);
                setScore(live.current.score);
                setGain(add);
            } else {
                live.current.combo = 0;
                live.current.lives = Math.max(0, live.current.lives - 1);
                setCombo(0);
                setLives(live.current.lives);
                setGain(0);
            }
            setPicked(opt);
        }

        useEffect(function () {
            if (done || picked || !card) return;
            live.current.picked = false;
            live.current.ms = TICK;
            setMs(TICK);
            var t0 = Date.now();
            var id = setInterval(function () {
                var left = TICK - (Date.now() - t0);
                live.current.ms = left;
                setMs(left);
                if (left <= 0 && !live.current.picked) {
                    clearInterval(id);
                    resolve("__time");
                }
            }, 80);
            return function () { clearInterval(id); };
        }, [i, done, picked, card && card.id]);

        useEffect(function () {
            if (!picked || done) return;
            var ok = picked !== "__time" && card && String(picked) === String(card.a);
            var t = setTimeout(goNext, ok ? 1050 : 1750);
            return function () { clearTimeout(t); };
        }, [picked, done]);

        function resetCards() {
            if (!window.confirm("Görülen kodlama kartları sıfırlansın mı? Sorular yeniden gelir.")) return;
            if (store() && store().resetGameSeen) store().resetGameSeen("kodlama");
            if (props.onAgain) props.onAgain();
        }

        var best = Number(games.kodlamaBest) || 0;
        if (best > 0 && best < 80) best = 0;
        var title = engine && engine.kodlamaTitle ? engine.kodlamaTitle(score, comboMax, lives) : "Tur bitti";
        var flash = !picked ? "" : (picked !== "__time" && card && String(picked) === String(card.a) ? "ok" : "bad");
        var low = !picked && ms < 4000;

        if (done) {
            return (
                <div className="map-play-root kodlama-root">
                    <header className="map-play-top">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                    </header>
                    <div className="game-end">
                        <p className="tabu-end-kicker">{title}</p>
                        <p className="tabu-end-score">{score}</p>
                        <p className="text-sm text-stone-500 mt-2">En iyi: {Math.max(score, best)} · combo {comboMax}</p>
                        <p className="tabu-end-note">12 saniye, 3 can. Hızlı ve seri doğru daha çok puan. Çıkan kart bir daha gelmez.</p>
                        <button type="button" className="btn-primary text-white px-5 py-2.5 rounded-full mt-6" onClick={props.onAgain}>Yeniden</button>
                        <button type="button" className="conquer-reset mt-3" onClick={resetCards}>Kartları sıfırla</button>
                    </div>
                </div>
            );
        }

        if (!deck.length) {
            return (
                <div className="map-play-root kodlama-root">
                    <header className="map-play-top">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                    </header>
                    <div className="tabu-body">
                        <p className="tabu-ask">Tüm kodlamaları gördün.</p>
                        <p className="text-sm text-stone-400 mt-2">Sıfırlarsan sorular yeniden gelir.</p>
                        <button type="button" className="btn-primary text-white px-5 py-2.5 rounded-full mt-6" onClick={resetCards}>Kartları sıfırla</button>
                    </div>
                </div>
            );
        }

        var ok = picked && picked !== "__time" && String(picked) === String(card.a);
        var timedOut = picked === "__time";
        var cipher = card.mode === "cipher";
        var sec = Math.max(0, ms / 1000);
        var barPct = Math.max(0, Math.min(100, (ms / TICK) * 100));

        return (
            <div className={"map-play-root kodlama-root" + (flash === "ok" ? " kodlama-hit" : "") + (flash === "bad" ? " kodlama-miss" : "") + (low ? " kodlama-low" : "")}>
                <header className="map-play-top">
                    <div className="map-play-bar">
                        <BackBtn onClick={props.onBack} label="Alıştırmalar" />
                        <span className="tabu-scorepill">{score} puan</span>
                        <button type="button" className="conquer-reset" onClick={resetCards}>Sıfırla</button>
                    </div>
                    <div className="kodlama-hud">
                        <span className="kodlama-hearts" aria-label="can">
                            {[0, 1, 2].map(function (h) {
                                return <span key={h} className={h < lives ? "on" : ""}>{h < lives ? "♥" : "♡"}</span>;
                            })}
                        </span>
                        <span className={"kodlama-combo" + (combo >= 3 ? " hot" : "")}>{combo >= 2 ? "Combo ×" + combo : i + 1 + "/" + deck.length}</span>
                        <span className="kodlama-clock">{sec.toFixed(1)}</span>
                    </div>
                    <div className="kodlama-bar" aria-hidden="true"><span style={{ width: barPct + "%" }} /></div>
                </header>
                <div className="tabu-body">
                    <div className="tabu-hero">
                        <span className="tabu-topic">{card.cat} · {cipher ? "ters şifre" : "kod çöz"}</span>
                        <p className="tabu-ask">{card.q}</p>
                        {cipher ? (
                            <div className="tabu-mystery shown">{card.prompt}</div>
                        ) : (
                            <p className="kodlama-slogan">{card.prompt}</p>
                        )}
                        {gain > 0 ? <p className="kodlama-gain">+{gain}</p> : null}
                    </div>
                    <div className="panic-choices">
                        {card.choices.map(function (opt, oi) {
                            var cls = "panic-opt";
                            if (picked) {
                                if (String(opt) === String(card.a)) cls += " kodlama-ok";
                                else if (String(opt) === String(picked)) cls += " kodlama-bad";
                            }
                            return (
                                <button key={oi} type="button" className={cls} disabled={!!picked}
                                    onClick={function () { resolve(opt); }}>
                                    <span className="panic-letter">{String.fromCharCode(65 + oi)}</span>
                                    <span className="panic-opt-text">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                    {picked ? (
                        <div className="kodlama-note">
                            <p className={ok ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                                {ok ? (combo >= 3 ? "Seri devam · ×" + combo : "Çözüldü") : (timedOut ? "Süre bitti · " + card.a : "Yanlış · " + card.a)}
                            </p>
                            {card.note ? <p className="text-sm text-stone-500 mt-1">{card.note}</p> : null}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.ConquerPlay = ConquerPlay;
    window.KpssComponents.TabuPlay = TabuPlay;
    window.KpssComponents.PanicPlay = PanicPlay;
    window.KpssComponents.KodlamaPlay = KodlamaPlay;
})();
