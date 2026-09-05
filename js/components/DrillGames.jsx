(function () {
    const { useState, useEffect, useRef, useMemo } = React;

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

        return (
            <div className={"map-play-root conquer-root" + (quiz ? " conquer-quiz" : "")}>
                <header className="map-play-top">
                    <div className="map-play-bar">
                        <button type="button" className="back-btn" onClick={quiz ? function () { setQuiz(null); setPick(null); } : props.onBack}>
                            <span>←</span> {quiz ? "Harita" : "Alıştırmalar"}
                        </button>
                        {!quiz ? (
                            <div className="conquer-colors">
                                {COLORS.map(function (c) {
                                    return (
                                        <button key={c} type="button" className={"conquer-swatch" + (color === c ? " on" : "")}
                                            style={{ background: c }} aria-label="renk"
                                            onClick={function () { if (store()) store().setConquerColor(c); }} />
                                    );
                                })}
                            </div>
                        ) : (
                            <span className="text-sm font-bold">{quiz.i + 1}/3</span>
                        )}
                    </div>
                    {quiz ? (
                        <p className="map-play-kicker">3 doğru üst üste · ili fethet</p>
                    ) : (
                        <p className="map-play-kicker">Türkiye'yi Fethet · {nOwn}/{nAll} il · bir ile dokun</p>
                    )}
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
                        <p className="conquer-il">{engine ? engine.nameOf(quiz.code) : quiz.code}</p>
                        <p className="conquer-sub">{engine ? engine.regionTitle(quiz.code) : ""} · 3'te 3 şart</p>
                        <div className="conquer-steps" aria-hidden="true">
                            {[0, 1, 2].map(function (s) {
                                var cls = "conquer-step";
                                if (quiz.fail && s === quiz.i) cls += " bad";
                                else if (s < quiz.i || (s === quiz.i && quiz.ok)) cls += " on";
                                else if (s === quiz.i) cls += " on";
                                return <span key={s} className={cls} />;
                            })}
                        </div>
                        {quiz.fail ? (
                            <div>
                                <p className="text-rose-600 font-bold mb-3">Bu il alınamadı. Üç soruyu art arda bilmen gerek.</p>
                                <div className="flex gap-2 flex-wrap">
                                    <button type="button" className="btn-primary text-white px-4 py-2.5 rounded-full" onClick={retry}>Tekrar dene</button>
                                    <button type="button" className="px-4 py-2.5 rounded-full border" onClick={function () { setQuiz(null); setPick(null); }}>Haritaya dön</button>
                                </div>
                            </div>
                        ) : qNow ? (
                            <div>
                                <p className="font-bold text-base mb-3 leading-snug">{qNow.question}</p>
                                <div className="grid gap-2">
                                    {(qNow.options || []).map(function (opt, i) {
                                        var isP = quiz.picked === opt;
                                        var isA = String(opt) === String(qNow.correct);
                                        var cls = "w-full text-left px-4 py-3.5 rounded-2xl border font-medium ";
                                        if (!quiz.picked) cls += "bg-white dark:bg-stone-800 border-stone-200";
                                        else if (isA) cls += "bg-emerald-50 border-emerald-400";
                                        else if (isP) cls += "bg-rose-50 border-rose-400";
                                        else cls += "opacity-50";
                                        return (
                                            <button key={i} type="button" disabled={!!quiz.picked} className={cls}
                                                onClick={function () { answer(opt); }}>{opt}</button>
                                        );
                                    })}
                                </div>
                                {quiz.picked ? (
                                    <button type="button" className="btn-primary text-white w-full px-5 py-3 rounded-2xl font-semibold mt-4"
                                        onClick={nextQuiz}>{quiz.ok ? (quiz.i + 1 >= quiz.items.length ? "İli fethet" : "Sonraki soru") : "Devam"}</button>
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
        var deck = useMemo(function () { return engine ? engine.tabuDeck(12, props.kpssData) : []; }, [props.seed]);
        var [i, setI] = useState(0);
        var [open, setOpen] = useState(1);
        var [picked, setPicked] = useState(null);
        var [score, setScore] = useState(0);
        var [done, setDone] = useState(false);
        var card = deck[i];

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
                        <button type="button" className="back-btn" onClick={props.onBack}><span>←</span> Alıştırmalar</button>
                    </header>
                    <div className="game-end">
                        <p className="text-sm text-stone-500">Tur bitti</p>
                        <p className="text-5xl font-black mt-2">{score}</p>
                        <p className="text-sm text-stone-400 mt-2">En iyi: {Math.max(score, games.tabuBest || 0)}</p>
                        <p className="text-sm mt-4">Az ipucu = yüksek puan. Kavramlar birbirine bağlanınca tabu çözülür.</p>
                        <button type="button" className="btn-primary text-white px-5 py-2.5 rounded-full mt-6" onClick={props.onAgain}>Yeniden</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="map-play-root tabu-root">
                <header className="map-play-top">
                    <div className="map-play-bar">
                        <button type="button" className="back-btn" onClick={props.onBack}><span>←</span> Alıştırmalar</button>
                        <span className="text-sm font-bold">{score} puan · {i + 1}/{deck.length}</span>
                    </div>
                    <p className="map-play-kicker">Tabu · ilk ipucu açık · az ek ipucu = çok puan</p>
                    <h2 className="map-play-prompt">Bu hangi kavram?</h2>
                </header>
                <div className="tabu-body">
                    <div className="tabu-mystery">{picked ? card.answer : "?"}</div>
                    <div className="tabu-clues">
                        {(card && card.clues || ["", "", ""]).map(function (cl, ci) {
                            var shown = ci < open;
                            return (
                                <button key={ci} type="button" disabled={!!picked || shown || (ci !== open)}
                                    className={"tabu-card" + (ci === 0 ? " lead" : "") + (shown ? " open" : "") + (ci === open && !picked ? " next" : "")}
                                    onClick={reveal}>
                                    <span className="tabu-n">İpucu {ci + 1}{ci === 0 ? " · açık" : ""}</span>
                                    <span>{shown ? cl : (ci === open ? "Ek ipucu aç" : "Kilitli")}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="tabu-hint">
                        <span>{open <= 1 ? "Şu an 5 puan" : open === 2 ? "2 ipucu · 3 puan" : "3 ipucu · 1 puan"}</span>
                        <span className="tabu-pts">{engine ? engine.tabuPoints(open) : 5} puan</span>
                    </div>
                    <div className="grid gap-2">
                        {(card && card.choices || []).map(function (opt, oi) {
                            var isP = picked === opt;
                            var isA = card && String(opt) === String(card.answer);
                            var cls = "w-full text-left px-4 py-3.5 rounded-2xl border font-medium ";
                            if (!picked) cls += "bg-white dark:bg-stone-800 border-stone-200";
                            else if (isA) cls += "bg-emerald-50 border-emerald-400";
                            else if (isP) cls += "bg-rose-50 border-rose-400";
                            else cls += "opacity-50";
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
        var deck = useMemo(function () { return engine ? engine.panicDeck(props.kpssData) : []; }, [props.seed]);
        var [i, setI] = useState(0);
        var [ms, setMs] = useState(10000);
        var [score, setScore] = useState(0);
        var [flash, setFlash] = useState("");
        var [over, setOver] = useState(false);
        var [missed, setMissed] = useState([]);
        var live = useRef({ ms: 10000, over: false, i: 0, score: 0 });

        useEffect(function () {
            live.current = { ms: 10000, over: false, i: 0, score: 0 };
            setMs(10000); setI(0); setScore(0); setOver(false); setFlash(""); setMissed([]);
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
                        <button type="button" className="back-btn" onClick={props.onBack}><span>←</span> Alıştırmalar</button>
                    </header>
                    <div className="game-end">
                        <p className="text-sm text-stone-500">Süre bitti</p>
                        <p className="text-5xl font-black mt-2">{score}</p>
                        <p className="text-sm text-stone-400 mt-2">Rekor: {Math.max(score, games.panicBest || 0)}</p>
                        {missed.length ? (
                            <div className="mt-6 text-left max-w-xl mx-auto">
                                <p className="text-sm font-bold mb-3">Yanlış {missed.length} soru</p>
                                <ul className="space-y-3">
                                    {missed.map(function (w, wi) {
                                        return (
                                            <li key={wi} className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 p-3 text-sm">
                                                <p className="font-semibold text-stone-800 dark:text-stone-100">{w.q}</p>
                                                <p className="text-rose-600 dark:text-rose-400 mt-1">Senin: {w.picked}</p>
                                                <p className="text-emerald-700 dark:text-emerald-400">Doğru: {w.a}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-sm text-emerald-600 mt-4">Bu turda yanlışın yok.</p>
                        )}
                        <button type="button" className="btn-primary text-white px-5 py-2.5 rounded-full mt-6" onClick={props.onAgain}>Tekrar oyna</button>
                    </div>
                </div>
            );
        }

        return (
            <div className={"map-play-root panic-root" + (flash === "ok" ? " panic-ok" : "") + (flash === "bad" ? " panic-bad" : "")}>
                <header className="map-play-top">
                    <div className="map-play-bar">
                        <button type="button" className="back-btn" onClick={props.onBack}><span>←</span> Alıştırmalar</button>
                        <span className="text-sm font-bold">{score} doğru</span>
                    </div>
                    <p className="map-play-kicker">Son 10 saniye · doğru +2 · yanlış −3</p>
                    <div className="panic-timer">{sec.toFixed(1)}</div>
                    <div className="panic-bar"><span style={{ width: Math.min(100, (ms / 20000) * 100) + "%" }} /></div>
                </header>
                <div className="panic-body">
                    <h2 className="panic-q">{q ? q.q : ""}</h2>
                    <div className="panic-choices">
                        {(q && q.choices || []).map(function (opt, oi) {
                            return (
                                <button key={oi} type="button" className="text-left px-3 py-3 rounded-2xl border font-bold bg-white dark:bg-stone-800"
                                    onClick={function () { choose(opt); }}>{opt}</button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-stone-400 mt-4">Bu tur {score} doğru · rekor {games.panicBest || 0}</p>
                </div>
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.ConquerPlay = ConquerPlay;
    window.KpssComponents.TabuPlay = TabuPlay;
    window.KpssComponents.PanicPlay = PanicPlay;
})();
