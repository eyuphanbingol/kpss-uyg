(function () {
    const { useState, useEffect, useMemo, useRef, useCallback } = React;
    var BackBtn = window.KpssBackBtn;
    var L = window.LiveExam;
    var C = window.LiveClient;

    // ============================================================
    // Canlı deneme: sınav, toplu görünüm (optik form), sonuç raporu, arşiv, gelişim
    // Sunucu kuralları supabase/patch-live-exam.sql; ortak motor js/liveExam.js
    // ============================================================

    function konuName(k) { return (window.konuLabel ? window.konuLabel(k) : String(k || "").trim()); }
    function hasContent(kpssData, ders, konu) {
        var kd = kpssData && kpssData[ders] && kpssData[ders][konu];
        return !!(kd && (((kd.notlar || []).length) || ((kd.sorular || []).length)));
    }
    function pct(x) { return x == null ? "–" : (String(Math.round(Number(x) * 10) / 10).replace(".", ",")); }

    function Panel(props) {
        return <section className={"rounded-3xl glass p-5 sm:p-6 " + (props.className || "")} aria-label={props.label}>{props.children}</section>;
    }
    function Kicker(props) {
        return <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{props.children}</p>;
    }
    function Stat(props) {
        return (
            <div className="rounded-2xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 p-3 text-center">
                <div className={"font-stat font-black " + (props.big ? "text-3xl" : "text-xl")}>{props.value}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{props.label}</div>
            </div>
        );
    }
    function KonuLink(props) {
        var label = props.ders + " / " + konuName(props.konu);
        if (props.onKonu && hasContent(props.kpssData, props.ders, props.konu)) {
            return <button type="button" className="text-left font-semibold text-teal-700 dark:text-teal-300 hover:underline" onClick={function () { props.onKonu(props.ders, props.konu); }}>{label} →</button>;
        }
        return <span className="font-semibold">{label} <span className="text-[11px] font-normal text-stone-400">(konu anlatımı yakında)</span></span>;
    }

    // ============================================================
    // OPTİK FORM GÖRÜNÜMÜ (120 cevap tek ekranda; kâğıt formla aynı dil)
    // ============================================================
    function OpticGrid(props) {
        var answers = props.answers || {};
        function block(from, to, title) {
            var rows = [];
            for (var no = from; no <= to; no++) rows.push(no);
            return (
                <div className="optic-block">
                    <p className="optic-title">{title}</p>
                    <div className="optic-cols">
                        {[0, 1, 2].map(function (col) {
                            return (
                                <div key={col} className="optic-col">
                                    {rows.slice(col * 20, col * 20 + 20).map(function (n) {
                                        var a = answers[n] && answers[n].c;
                                        var correct = props.key_ && props.key_[n];
                                        var flag = props.flags && props.flags[n];
                                        return (
                                            <div key={n} className={"optic-row" + (props.current === n ? " is-current" : "") + (flag ? " is-flag-" + flag : "")}
                                                title={flag === "double" ? "Çift işaret: boş sayılır, düzelt" : flag === "uncertain" ? "Kararsız okuma: kontrol et" : undefined}>
                                                <button type="button" className="optic-no" onClick={function () { props.onJump && props.onJump(n); }} aria-label={"Soru " + n + "'e git"}>{n}</button>
                                                {L.LETTERS.map(function (l) {
                                                    var on = a === l;
                                                    var cls = "optic-bubble" + (on ? " is-on" : "");
                                                    if (correct) {
                                                        if (l === correct) cls += " is-key";
                                                        if (on && l !== correct) cls += " is-wrong";
                                                    }
                                                    return (
                                                        <button key={l} type="button" className={cls} disabled={!props.onPick}
                                                            aria-label={"Soru " + n + " " + l + (on ? " (işaretli)" : "") + (flag === "double" ? ", çift işaret" : flag === "uncertain" ? ", kararsız okuma" : "")}
                                                            onClick={function () { props.onPick && props.onPick(n, on ? null : l); }}>{l}</button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        var filled = Object.keys(answers).filter(function (k) { return answers[k] && answers[k].c; }).length;
        return (
            <div className="optic-sheet" role="group" aria-label="Optik form görünümü">
                <div className="optic-head">
                    <span>{props.head || "ATANLY · CANLI DENEME · OPTİK FORM"}</span>
                    <span>{filled} / 120 işaretli</span>
                </div>
                {block(1, 60, "GENEL YETENEK (1–60)")}
                {block(61, 120, "GENEL KÜLTÜR (61–120)")}
            </div>
        );
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
        const [sync, setSync] = useState({ pending: 0 });
        const [fatal, setFatal] = useState(null);
        const [confirmEnd, setConfirmEnd] = useState(false);
        var clockRef = useRef(null);
        var queueRef = useRef(null);
        var seenAt = useRef(0);
        var dev = useMemo(function () { return C.deviceId(); }, []);

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
            C.rpc("live_enter", { p_exam: examId, p_device: dev }).then(function (data) {
                if (!alive) return;
                if (data && data.error) { setErr({ code: data.error, message: data.message }); setStage("error"); return; }
                return start(data, false);
            }).catch(function (e) {
                if (!alive) return;
                var saved = e.network ? C.recallEntry(examId) : null;
                if (saved && saved.key) return start(saved, true);
                setErr(e); setStage("error");
            });
            return function () { alive = false; if (queueRef.current) queueRef.current.stop(); };
        }, [examId]);

        // saniyelik saat + dakikalık sunucu eşitlemesi
        useEffect(function () {
            if (stage !== "run") return;
            var t = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1000);
            var s = setInterval(function () {
                C.rpc("live_now").then(function (r) { if (r && clockRef.current) clockRef.current.sync(r.now); }).catch(function () {});
            }, 60000);
            function online() { if (queueRef.current) queueRef.current.flush(); }
            window.addEventListener("online", online);
            return function () { clearInterval(t); clearInterval(s); window.removeEventListener("online", online); };
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
                    setTimeout(function () { props.onResult(examId); }, 1500);
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
        useEffect(function () { seenAt.current = Date.now(); }, [idx, stage]);

        function pick(no, letter) {
            var q = queueRef.current;
            if (!q || fatal || stage !== "run") return;
            recordTime();
            q.set(no, letter, q.ms(no));
            setTick(function (x) { return x + 1; });
        }
        function go(i) {
            recordTime();
            setIdx(Math.max(0, Math.min(qs.length - 1, i)));
        }
        function jumpTo(no) {
            var i = qs.findIndex(function (q) { return q.no === no; });
            if (i >= 0) { go(i); setGrid(false); }
        }

        // klavye: A–E, ← →
        useEffect(function () {
            if (stage !== "run") return;
            function onKey(e) {
                if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
                var k = (e.key || "").toUpperCase();
                if (cur && L.LETTERS.indexOf(k) >= 0) { e.preventDefault(); pick(cur.no, queueRef.current.get(cur.no) === k ? null : k); }
                else if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
                else if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
            }
            window.addEventListener("keydown", onKey);
            return function () { window.removeEventListener("keydown", onKey); };
        });

        function submitNow() {
            recordTime();
            var q = queueRef.current;
            (q ? q.flush() : Promise.resolve()).then(function () {
                return C.rpc("live_submit", { p_exam: examId, p_device: dev });
            }).then(function () {
                setConfirmEnd(false);
                props.onSubmitted && props.onSubmitted();
            }).catch(function (e) { setConfirmEnd(false); setErr(e); });
        }

        if (stage === "error") {
            var msg = (err && err.message) || "Sınava girilemedi.";
            return (
                <Panel label="Sınava girilemedi">
                    <h2 className="text-xl font-black">Sınava girilemedi</h2>
                    <p className="mt-2 text-stone-600 dark:text-stone-300">{msg}</p>
                    <button type="button" className="quick-chip mt-4" onClick={props.onBack}>Geri dön</button>
                </Panel>
            );
        }
        if (stage === "enter" || stage === "loading") {
            return (
                <Panel label="Sınav hazırlanıyor">
                    <p className="font-semibold">{stage === "enter" ? "Sunucuya bağlanılıyor…" : "Soru kitapçığı açılıyor…"}</p>
                    <p className="text-sm text-stone-500 mt-1">Süren sunucu saatine göre işler; bu ekranı kapatsan da cevapların kayıtlıdır.</p>
                </Panel>
            );
        }
        if (stage === "ended") {
            return (
                <Panel label="Süre doldu">
                    <h2 className="text-2xl font-black">Süre doldu</h2>
                    <p className="mt-2 text-stone-600 dark:text-stone-300">Cevapların gönderiliyor, sonuç ekranı açılıyor…</p>
                    {sync.pending ? <p className="mt-2 text-sm font-semibold text-amber-700">{sync.pending} cevap gönderilmeyi bekliyor. İnternetin geri gelince 12:27'ye kadar gönderilir.</p> : null}
                </Panel>
            );
        }

        var answers = queueRef.current ? queueRef.current.all() : {};
        var answered = Object.keys(answers).filter(function (k) { return answers[k] && answers[k].c; }).length;
        var blank = qs.length - answered;
        var mine = cur && queueRef.current ? queueRef.current.get(cur.no) : null;
        var warn = left < 10 * 60000;
        var syncText = fatal ? "Kayıt durdu" : (sync.pending ? (sync.ok === false ? "Çevrimdışı · " + sync.pending + " cevap bekliyor" : "Kaydediliyor…") : "Tüm cevaplar kaydedildi");

        return (
            <div className="live-exam" aria-live="off">
                <header className="live-bar">
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 truncate">{exam && exam.title}</p>
                        <p className={"text-xs font-semibold " + (fatal ? "text-rose-600" : (sync.pending ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"))} role="status">{syncText}</p>
                    </div>
                    <div className={"live-timer font-stat " + (warn ? "is-warn" : "")} role="timer" aria-label={"Kalan süre " + L.fmtTimer(left)}>{L.fmtTimer(left)}</div>
                </header>

                {fatal ? (
                    <div className="plan-warn mt-3" role="alert">
                        {fatal.code === "device_replaced" ? "Sınav başka bir cihazda açıldı; bu cihazda cevap kaydedilmiyor. Devam etmek için o cihazı kullan ya da bu sayfayı yenile (cihaz değişikliği hakkından düşer)." :
                         fatal.code === "locked" ? "Cihaz değişim sınırı aşıldığı için sınavın kilitlendi. Yönetici ile iletişime geç." :
                         (fatal.message || "Cevaplar kaydedilemiyor.")}
                    </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <button type="button" className={"quick-chip" + (grid ? " is-primary" : "")} aria-pressed={grid} onClick={function () { recordTime(); setGrid(!grid); }}>▦ Toplu görünüm</button>
                    <span className="text-xs text-stone-500">{answered} işaretli · {blank} boş</span>
                    <button type="button" className="quick-chip ml-auto" onClick={function () { setConfirmEnd(true); }}>Sınavı bitir</button>
                </div>

                {grid ? (
                    <div className="mt-4">
                        <p className="text-xs text-stone-500 mb-2">Kaydırma hatası var mı kontrol et; numaraya dokunarak o soruya git. Baloncuğa dokunarak da işaretleyebilirsin.</p>
                        <OpticGrid answers={answers} current={cur && cur.no} onJump={jumpTo} onPick={fatal ? null : pick} />
                    </div>
                ) : cur ? (
                    <div className="test-split mt-4">
                        <div className="test-split-q">
                            <div className="q-stem p-4 sm:p-7 rounded-3xl relative overflow-hidden">
                                <div className="q-stem-bar absolute top-0 left-0 w-1.5 h-full"></div>
                                <p className="text-xs font-bold text-stone-500 mb-2 pl-2">Soru {cur.no} / 120 · {L.BOLUM[cur.bolum]} · {cur.ders}</p>
                                <h3 className="text-lg font-bold leading-relaxed whitespace-pre-line text-stone-900 pl-2">{cur.stem}</h3>
                                {cur.image ? <img src={cur.image} alt="Soru şekli" className="live-img mt-4" /> : null}
                            </div>
                        </div>
                        <div className="test-split-a">
                            <div className="space-y-3" role="radiogroup" aria-label={"Soru " + cur.no + " şıkları"}>
                                {(cur.options || []).map(function (opt, i) {
                                    var l = L.LETTERS[i];
                                    var on = mine === l;
                                    return (
                                        <button key={l} type="button" role="radio" aria-checked={on}
                                            className={"w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-semibold flex items-center gap-3 option-btn " + (on ? "bg-[#0D2C4D] border-[#0D2C4D] text-white" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700")}
                                            onClick={function () { pick(cur.no, on ? null : l); }}>
                                            <span className={"live-letter " + (on ? "is-on" : "")}>{l}</span>
                                            <span className="min-w-0">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="kbd-hint mt-3" aria-hidden="true"><kbd>A</kbd>–<kbd>E</kbd> işaretle · aynı şıkka tekrar basınca silinir · <kbd>←</kbd> <kbd>→</kbd> geç</p>
                            <div className="flex justify-between gap-3 mt-4">
                                <button type="button" className="quick-chip" disabled={idx === 0} onClick={function () { go(idx - 1); }}>← Önceki</button>
                                <button type="button" className="quick-chip is-primary" disabled={idx >= qs.length - 1} onClick={function () { go(idx + 1); }}>Sonraki →</button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {confirmEnd ? (
                    <div className="fixed inset-0 z-[70] bg-black/45 flex items-end sm:items-center justify-center p-3" role="dialog" aria-modal="true" aria-labelledby="end-title">
                        <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl">
                            <h2 id="end-title" className="text-xl font-black">Kâğıdını teslim et?</h2>
                            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2">{blank ? blank + " soru boş. " : ""}Teslim ettikten sonra cevapların değiştirilemez. Sonucun ve çözümler sınav bitince ({exam && L.fmtClock(L.ms(exam.ends_at))}) açılır.</p>
                            <div className="flex justify-end gap-2 mt-5">
                                <button type="button" className="quick-chip" onClick={function () { setConfirmEnd(false); }}>Vazgeç</button>
                                <button type="button" className="quick-chip is-primary" onClick={submitNow}>Teslim et</button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    // ============================================================
    // SONUÇ RAPORU
    // ============================================================
    // Net dağılımı: 5 netlik dilimler; senin dilimin turuncu ve "Sen" etiketli (renk tek başına değil)
    var C_BLUE = { light: "#2a78d6", dark: "#3987e5" }, C_ORANGE = { light: "#eb6834", dark: "#d95926" };
    function NetHistogram(props) {
        var rows = props.rows, dark = props.dark;
        const [hover, setHover] = useState(null);
        var W = 640, H = 200, padL = 34, padR = 10, padT = 22, padB = 28;
        var max = Math.max.apply(null, rows.map(function (r) { return r.n; }).concat([1]));
        var bw = (W - padL - padR) / rows.length;
        function y(v) { return padT + (H - padT - padB) * (1 - v / max); }
        var ink = dark ? "#c3c2b7" : "#52514e", grid = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)";
        var every = Math.ceil(rows.length / 10);
        var ticks = max <= 4 ? Array.from({ length: max + 1 }, function (_, i) { return i; }) : [0, Math.round(max / 2), max];
        return (
            <div className="relative">
                <svg viewBox={"0 0 " + W + " " + H} className="w-full h-auto" role="img" aria-label={props.label} onMouseLeave={function () { setHover(null); }}>
                    {ticks.map(function (t) { return <g key={t}><line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={grid} /><text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill={ink}>{t}</text></g>; })}
                    {rows.map(function (r, i) {
                        var x = padL + i * bw + 1, w = Math.max(2, bw - 2), top = y(r.n), col = r.mine ? (dark ? C_ORANGE.dark : C_ORANGE.light) : (dark ? C_BLUE.dark : C_BLUE.light);
                        var h = H - padB - top;
                        return (
                            <g key={r.from}>
                                {r.n ? <path d={"M" + x + " " + (H - padB) + " V" + (top + 4) + " Q" + x + " " + top + " " + (x + 4) + " " + top + " H" + (x + w - 4) + " Q" + (x + w) + " " + top + " " + (x + w) + " " + (top + 4) + " V" + (H - padB) + " Z"}
                                    fill={col} opacity={hover == null || hover === i ? 1 : 0.55} /> : null}
                                {r.mine ? <text x={x + w / 2} y={(r.n ? top : H - padB) - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={ink}>Sen</text> : null}
                                {i % every === 0 ? <text x={x} y={H - 10} fontSize="10" fill={ink}>{r.from}</text> : null}
                                <rect x={x - 1} y={padT} width={bw} height={H - padT - padB} fill="transparent" tabIndex="0"
                                    onMouseEnter={function () { setHover(i); }} onFocus={function () { setHover(i); }} aria-label={r.from + "–" + r.to + " net: " + r.n + " kişi"} />
                            </g>
                        );
                    })}
                </svg>
                {hover != null ? (
                    <div className="absolute top-0 right-2 rounded-xl bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 px-3 py-2 text-xs">
                        <b>{rows[hover].from}–{rows[hover].to} net</b>: {rows[hover].n} kişi{rows[hover].mine ? " · sen buradasın" : ""}
                    </div>
                ) : null}
            </div>
        );
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
                return C.rpc("live_result", { p_exam: examId });
            }).catch(function (e) {
                // saat farkı: bitişten birkaç saniye önce istenmişse kısa süre sonra yeniden dene
                if (e.code === "not_yet" && attempt < 6 && alive) {
                    setTimeout(function () { if (alive) setAttempt(attempt + 1); }, 5000);
                    return null;
                }
                throw e;
            }).then(function (r) {
                if (!r) return;
                if (!alive) return;
                setData(r);
                if (r && r.result && window.StudentStore && StudentStore.applyLiveExamGaps) {
                    StudentStore.applyLiveExamGaps(examId, { title: r.exam.title, at: r.exam.starts_at }, L.gaps(r.result));
                }
                return C.rpc("live_review", { p_exam: examId }).then(function (rv) {
                    if (!alive) return;
                    setReview(rv);
                    var withImg = (rv.questions || []).some(function (q) { return q.image; });
                    if (withImg && rv.key) {
                        C.openBooklet(examId, rv.key, rv.sha).then(function (bk) {
                            var m = {};
                            (bk.questions || []).forEach(function (q) { if (q.image) m[q.no] = q.image; });
                            if (alive) setImages(m);
                        }).catch(function () {});
                    }
                });
            }).catch(function (e) { if (alive) setErr(e); });
            return function () { alive = false; };
        }, [examId, attempt]);

        if (err) return <Panel label="Sonuç"><p className="font-semibold">{err.message}</p><button type="button" className="quick-chip mt-3" onClick={props.onBack}>Geri</button></Panel>;
        if (!data) return <Panel label="Sonuç"><p className="font-semibold">Sonucun hesaplanıyor…</p></Panel>;

        var r = data.result || {};
        var exam = data.exam;
        var coh = data.cohort;
        var finalized = exam.finalized;
        var dersRows = L.dersCompare(r, coh, data.peers);
        var hasTop = dersRows.some(function (d) { return d.top10 != null; }), hasPeers = !!data.peers;
        var an = (coh && coh.analysis) || {};
        var dark = document.documentElement.classList.contains("dark");
        var konuRows = L.konuRows(r, coh);
        var weak = L.weakest(r, 3);
        var qs = (review && review.questions) || [];
        var shown = qs.filter(function (q) {
            if (filter === "yanlis") return q.mine && q.mine !== q.answer;
            if (filter === "bos") return !q.mine;
            if (filter === "dogru") return q.mine === q.answer;
            return true;
        });
        var keyMap = {}, ansMap = {};
        qs.forEach(function (q) { keyMap[q.no] = q.answer; ansMap[q.no] = { c: q.mine }; });
        var byDers = {};
        konuRows.forEach(function (k) { (byDers[k.ders] = byDers[k.ders] || []).push(k); });
        var timed = qs.filter(function (q) { return q.ms > 0; });
        var hist = finalized ? L.histRows(coh, r.net) : [];
        var beat = finalized ? L.beatPct(r) : null;
        var easy = L.easyMisses(qs).slice(0, 8);
        var tm = L.timeRows(qs, coh);
        var modes = an.by_mode || {};
        function jump(no) { setFilter("hepsi"); setOpenQ(no); setTimeout(function () { var el = document.getElementById("lq-" + no); if (el) el.scrollIntoView({ block: "center" }); }, 50); }

        return (
            <div className="space-y-4">
                <header>
                    <Kicker>{L.TRACKS[exam.track]} · {L.fmtDate(L.ms(exam.starts_at))} · {r.mode === "paper" ? "kâğıtta çözüldü" : "cihazda çözüldü"}</Kicker>
                    <h1 className="text-3xl font-display font-black tracking-tight gradient-text mt-1">{exam.title}</h1>
                </header>

                <Panel label="Özet">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Stat big value={L.fmtNet(r.net)} label="net" />
                        <Stat value={r.correct + " / " + r.wrong + " / " + r.blank} label="doğru / yanlış / boş" />
                        <Stat value={finalized && r.rank ? r.rank + " / " + r.participants : "–"} label={finalized ? "sıralama" : "sıralama " + L.fmtClock(L.ms(exam.ranking_at)) + "'ta"} />
                        <Stat value={finalized && r.top_pct != null ? "%" + pct(r.top_pct) : "–"} label="yüzdelik dilim (ilk)" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <Stat value={L.fmtNet(r.gy_net)} label={"Genel Yetenek net" + (coh ? " · ort. " + L.fmtNet(coh.avg_gy) : "")} />
                        <Stat value={L.fmtNet(r.gk_net)} label={"Genel Kültür net" + (coh ? " · ort. " + L.fmtNet(coh.avg_gk) : "")} />
                    </div>
                    {!finalized ? <p className="plan-note mt-3">Genel sıralama ve katılan ortalamaları {L.fmtClock(L.ms(exam.ranking_at))}'ta kesinleşir; kâğıtta çözenlerin okutması o saate kadar sürer.</p> : null}
                </Panel>

                {finalized && hist.length ? (
                    <Panel label="Katılanlar arasında">
                        <Kicker>Katılanlar arasında · net dağılımı</Kicker>
                        <p className="text-lg font-bold mt-1">{beat != null ? "Senden düşük net yapanların oranı: %" + beat : "Sıralaman " + r.rank + " / " + r.participants + "."}</p>
                        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                            {an.pct ? "Medyan " + L.fmtNet(an.pct.p50) + " · ilk %25'in sınırı " + L.fmtNet(an.pct.p75) + " · ilk %10'un sınırı " + L.fmtNet(an.pct.p90) + " net." : ""}
                            {an.top10_net != null ? " İlk %10'un ortalaması " + L.fmtNet(an.top10_net) + " net." : ""}
                        </p>
                        <div className="mt-3 max-w-2xl"><NetHistogram rows={hist} dark={dark} label={"Net dağılımı: " + r.participants + " katılımcı, 5 netlik dilimler; senin dilimin işaretli"} /></div>
                        <details className="mt-2 text-xs">
                            <summary className="cursor-pointer font-semibold">Tablo olarak göster</summary>
                            <table className="mt-2"><tbody>{hist.map(function (h) { return <tr key={h.from}><td className="pr-4">{h.from}–{h.to} net</td><td>{h.n} kişi{h.mine ? " ← sen" : ""}</td></tr>; })}</tbody></table>
                        </details>
                        {modes.device && modes.paper ? (
                            <p className="text-xs text-stone-500 mt-2">Cihazda çözenler ({modes.device.n} kişi) ortalaması {L.fmtNet(modes.device.avg_net)} · kâğıtta çözenler ({modes.paper.n} kişi) {L.fmtNet(modes.paper.avg_net)} net.</p>
                        ) : null}
                    </Panel>
                ) : null}

                {weak.length ? (
                    <Panel label="En zayıf konular">
                        <Kicker>En zayıf 3 konun · Eksikler'e eklendi</Kicker>
                        <ul className="mt-3 space-y-2">
                            {weak.map(function (w) {
                                return (
                                    <li key={w.key} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                        <KonuLink ders={w.ders} konu={w.konu} kpssData={props.kpssData} onKonu={props.onKonu} />
                                        <span className="text-stone-500">{w.c}/{w.n} doğru{w.avgC != null ? " · katılan ort. " + L.fmtNet(w.avgC) : ""}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </Panel>
                ) : null}

                <Panel label="Ders bazında">
                    <Kicker>Ders bazında net</Kicker>
                    <table className="w-full text-sm mt-3">
                        <thead><tr className="text-left text-xs text-stone-500"><th className="py-1">Ders</th><th>D</th><th>Y</th><th>B</th><th>Net</th><th>Katılan ort.</th>{hasTop ? <th>İlk %10</th> : null}{hasPeers ? <th>Benzer seviye</th> : null}</tr></thead>
                        <tbody>
                            {dersRows.map(function (d) {
                                return (
                                    <tr key={d.ders} className="border-t border-stone-200/70 dark:border-stone-700">
                                        <td className="py-1.5 font-semibold">{d.ders}</td><td>{d.c}</td><td>{d.w}</td><td>{d.b}</td>
                                        <td className="font-bold">{L.fmtNet(d.net)}</td><td>{d.avgNet == null ? "–" : L.fmtNet(d.avgNet)}</td>
                                        {hasTop ? <td>{d.top10 == null ? "–" : L.fmtNet(d.top10)}</td> : null}
                                        {hasPeers ? <td>{d.peers == null ? "–" : L.fmtNet(d.peers)}</td> : null}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Panel>

                {hasPeers || hasTop ? (
                    <p className="text-xs text-stone-500 -mt-2 px-2">{hasPeers ? "Benzer seviye: netin ±5 içinde kalan " + data.peers.n + " katılımcının ortalaması. " : ""}{hasTop ? "İlk %10: en yüksek net yapan " + an.top10_n + " kişinin ortalaması." : ""}</p>
                ) : null}

                {easy.length ? (
                    <Panel label="Çoğunluğun yaptığı ama senin kaçırdığın sorular">
                        <Kicker>Çoğunluğun yaptığı, senin kaçırdığın sorular</Kicker>
                        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">Bu sorular katılanların çoğu için kolaydı; en hızlı puan kazanacağın yer burası.</p>
                        <ul className="mt-2 space-y-1 text-sm">
                            {easy.map(function (q) {
                                return (
                                    <li key={q.no}>
                                        <button type="button" className="text-left hover:underline" onClick={function () { jump(q.no); }}>
                                            Soru {q.no} · {q.ders} / {konuName(q.konu)} — katılanlarda doğru oranı %{q.pct} · {q.mine ? "senin cevabın " + q.mine : "boş bıraktın"}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </Panel>
                ) : null}

                {tm.rows.length ? (
                    <Panel label="Süre">
                        <Kicker>Soru başına süre</Kicker>
                        <table className="w-full text-sm mt-2">
                            <thead><tr className="text-left text-xs text-stone-500"><th className="py-1">Ders</th><th>Sen</th><th>Katılan ort.</th><th></th></tr></thead>
                            <tbody>{tm.rows.map(function (t) {
                                var note = t.ratio == null ? "" : t.ratio > 1.25 ? "yavaş" : t.ratio < 0.75 ? "hızlı" : "";
                                return <tr key={t.ders} className="border-t border-stone-200/70 dark:border-stone-700"><td className="py-1.5 font-semibold">{t.ders}</td><td>{L.fmtSec(t.mine)}</td><td>{L.fmtSec(t.avg)}</td><td className="text-xs text-stone-500">{note}</td></tr>;
                            })}</tbody>
                        </table>
                        {tm.slow.length ? (
                            <div className="mt-3">
                                <p className="text-sm font-semibold">Uzun sürüp yine de kaçırdığın sorular</p>
                                <ul className="mt-1 space-y-1 text-sm">{tm.slow.map(function (q) {
                                    return <li key={q.no}><button type="button" className="text-left hover:underline" onClick={function () { jump(q.no); }}>Soru {q.no} · {q.ders} — {L.fmtSec(q.ms)} (ortalama {L.fmtSec(q.avg)})</button></li>;
                                })}</ul>
                            </div>
                        ) : null}
                    </Panel>
                ) : null}

                <Panel label="Konu bazında">
                    <Kicker>Konu bazında</Kicker>
                    {Object.keys(byDers).map(function (d) {
                        return (
                            <div key={d} className="mt-3">
                                <p className="font-bold text-sm">{d}</p>
                                <ul className="mt-1 space-y-1">
                                    {byDers[d].map(function (k) {
                                        return (
                                            <li key={k.key} className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm py-1 border-b border-stone-200/60 dark:border-stone-700/60">
                                                <span className="min-w-0">{konuName(k.konu)}</span>
                                                <span className="text-stone-600 dark:text-stone-300">
                                                    <b>{k.c}/{k.n}</b>{k.avgC != null ? " — katılan ortalaması " + L.fmtNet(k.avgC) : ""}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </Panel>

                {review && review.most_wrong && review.most_wrong.length ? (
                    <Panel label="En çok yanlış yapılan sorular">
                        <Kicker>Katılanların en çok yanlış yaptığı 10 soru</Kicker>
                        <ol className="mt-3 space-y-1 text-sm">
                            {review.most_wrong.map(function (m) {
                                var q = qs.find(function (x) { return x.no === m.no; });
                                var miss = q && q.mine !== q.answer;
                                return (
                                    <li key={m.no}>
                                        <button type="button" className="text-left hover:underline" onClick={function () { setFilter("hepsi"); setOpenQ(m.no); }}>
                                            Soru {m.no} · {m.ders} / {konuName(m.konu)} — %{pct(m.wrong_pct)} yanlış{miss ? " · sen de kaçırdın" : ""}
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </Panel>
                ) : null}

                <Panel label="Optik form">
                    <Kicker>Optik form · yeşil: doğru cevap, kırmızı: yanlış işaretin</Kicker>
                    <div className="mt-3"><OpticGrid answers={ansMap} key_={keyMap} onJump={function (n) { setFilter("hepsi"); setOpenQ(n); }} /></div>
                </Panel>

                <Panel label="Soru soru çözümler">
                    <Kicker>Soru soru çözümler{timed.length ? " · harcadığın süre" : ""}</Kicker>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {[["yanlis", "Yanlışlar"], ["bos", "Boşlar"], ["dogru", "Doğrular"], ["hepsi", "Tümü"]].map(function (f) {
                            return <button key={f[0]} type="button" className={"quick-chip" + (filter === f[0] ? " is-primary" : "")} aria-pressed={filter === f[0]} onClick={function () { setFilter(f[0]); }}>{f[1]}</button>;
                        })}
                    </div>
                    <ul className="mt-3 space-y-2">
                        {shown.map(function (q) {
                            var open = openQ === q.no;
                            var state = !q.mine ? "boş" : (q.mine === q.answer ? "doğru" : "yanlış");
                            var tot = q.stat ? (q.stat.correct + q.stat.wrong + q.stat.blank) : 0;
                            return (
                                <li key={q.no} id={"lq-" + q.no} className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-900/50">
                                    <button type="button" className="w-full text-left p-3 flex items-center gap-3" aria-expanded={open} onClick={function () { setOpenQ(open ? null : q.no); }}>
                                        <span className={"live-state " + (state === "doğru" ? "is-ok" : state === "yanlış" ? "is-bad" : "")}>{q.no}</span>
                                        <span className="min-w-0 flex-1 text-sm"><b>{q.ders}</b> / {konuName(q.konu)} <span className="text-stone-500">· {state}{q.mine ? " (" + q.mine + ")" : ""} · doğru {q.answer}</span></span>
                                    </button>
                                    {open ? (
                                        <div className="px-4 pb-4 text-sm">
                                            <p className="whitespace-pre-line font-semibold leading-relaxed">{q.stem}</p>
                                            {images[q.no] ? <img src={images[q.no]} alt="Soru şekli" className="live-img mt-3" /> : null}
                                            <ul className="mt-3 space-y-1">
                                                {(q.options || []).map(function (o, i) {
                                                    var l = L.LETTERS[i];
                                                    var cls = l === q.answer ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300" : (l === q.mine ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300" : "border-stone-200 dark:border-stone-700");
                                                    return <li key={l} className={"rounded-xl border px-3 py-2 " + cls}><b>{l})</b> {o}{l === q.answer ? " ✓" : ""}{l === q.mine && l !== q.answer ? " ✗ senin cevabın" : ""}</li>;
                                                })}
                                            </ul>
                                            {q.explanation ? <p className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 whitespace-pre-line"><b>Çözüm:</b> {q.explanation}</p> : null}
                                            <p className="mt-2 text-xs text-stone-500">
                                                {q.ms ? "Bu soruda " + Math.max(1, Math.round(q.ms / 1000)) + " sn harcadın" + (q.stat && q.stat.avg_ms ? " (ortalama " + Math.round(q.stat.avg_ms / 1000) + " sn)" : "") + ". " : ""}
                                                {tot ? "Katılanlarda doğru oranı %" + pct(100 * q.stat.correct / tot) + "." : ""}
                                            </p>
                                            <div className="mt-2"><KonuLink ders={q.ders} konu={q.konu} kpssData={props.kpssData} onKonu={props.onKonu} /></div>
                                        </div>
                                    ) : null}
                                </li>
                            );
                        })}
                        {!shown.length ? <li className="text-sm text-stone-500">Bu filtrede soru yok.</li> : null}
                    </ul>
                </Panel>
            </div>
        );
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
        if (err) return <Panel label="Denemelerim"><p>{err.message}</p></Panel>;
        if (!list) return <Panel label="Denemelerim"><p>Yükleniyor…</p></Panel>;
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-display font-black tracking-tight gradient-text">Denemelerim</h1>
                {!list.length ? <Panel label="Boş"><p className="text-stone-600 dark:text-stone-300">Henüz katıldığın bir canlı deneme yok. Her pazar 10:15'te!</p></Panel> : (
                    <ul className="space-y-2">
                        {list.map(function (h) {
                            return (
                                <li key={h.exam_id}>
                                    <button type="button" className="w-full text-left rounded-2xl glass p-4 card-hover flex flex-wrap items-center gap-x-4 gap-y-1" onClick={function () { props.onOpen(h.exam_id); }}>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-bold">{h.title}</span>
                                            <span className="block text-xs text-stone-500">{L.fmtDate(L.ms(h.starts_at))} · {L.TRACKS[h.track]} · {h.mode === "paper" ? "kâğıt" : "cihaz"}</span>
                                        </span>
                                        <span className="font-stat text-xl font-black">{L.fmtNet(h.net)} <span className="text-xs font-semibold text-stone-500">net</span></span>
                                        <span className="text-sm text-stone-600 dark:text-stone-300">{h.rank ? h.rank + ". / " + h.participants + " · ilk %" + pct(h.top_pct) : "sıralama bekleniyor"}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }

    // ============================================================
    // GELİŞİM
    // ============================================================
    var SERIES = [
        { key: "net", label: "Toplam", light: "#2a78d6", dark: "#3987e5" },
        { key: "gy", label: "Genel Yetenek", light: "#eb6834", dark: "#d95926" },
        { key: "gk", label: "Genel Kültür", light: "#1baf7a", dark: "#199e70" }
    ];
    var VS = [
        { key: "net", label: "Sen", light: "#2a78d6", dark: "#3987e5" },
        { key: "avg", label: "Katılan ort.", light: "#eb6834", dark: "#d95926" }
    ];
    function LineChart(props) {
        var pts = props.points;
        var dark = props.dark;
        const [hover, setHover] = useState(null);
        var W = 640, H = 240, padL = 40, padR = 70, padT = 14, padB = 30;
        var max = props.max != null ? props.max : 120;
        var min = 0;
        var n = pts.length;
        function x(i) { return padL + (n <= 1 ? (W - padL - padR) / 2 : i * (W - padL - padR) / (n - 1)); }
        function y(v) { return padT + (H - padT - padB) * (1 - (v - min) / ((max - min) || 1)); }
        var ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
        var ink = dark ? "#c3c2b7" : "#52514e";
        var grid = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)";
        return (
            <div className="relative">
                <svg viewBox={"0 0 " + W + " " + H} className="w-full h-auto" role="img" aria-label={props.label}
                    onMouseLeave={function () { setHover(null); }}>
                    {ticks.map(function (t) {
                        return <g key={t}><line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={grid} strokeWidth="1" /><text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill={ink}>{Math.round(t)}</text></g>;
                    })}
                    {pts.map(function (p, i) {
                        return <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill={ink}>{p.label}</text>;
                    })}
                    {props.series.map(function (s) {
                        var col = dark ? s.dark : s.light;
                        var d = pts.map(function (p, i) { return (i ? "L" : "M") + x(i) + " " + y(p[s.key]); }).join(" ");
                        var last = pts[pts.length - 1];
                        return (
                            <g key={s.key}>
                                <path d={d} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                                {pts.map(function (p, i) { return <circle key={i} cx={x(i)} cy={y(p[s.key])} r="4" fill={col} stroke={dark ? "#1c1917" : "#fff"} strokeWidth="2" />; })}
                                {last ? <text x={x(n - 1) + 8} y={y(last[s.key]) + 4} fontSize="11" fontWeight="700" fill={ink}>{s.label} {L.fmtNet(last[s.key])}</text> : null}
                            </g>
                        );
                    })}
                    {pts.map(function (p, i) {
                        var w = n <= 1 ? 80 : (W - padL - padR) / (n - 1);
                        return <rect key={i} x={x(i) - w / 2} y={padT} width={w} height={H - padT - padB} fill="transparent" onMouseEnter={function () { setHover(i); }} onFocus={function () { setHover(i); }} tabIndex="0" />;
                    })}
                    {hover != null ? <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke={ink} strokeDasharray="3 3" /> : null}
                </svg>
                {hover != null ? (
                    <div className="absolute top-2 left-2 rounded-xl bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 px-3 py-2 text-xs">
                        <b>{pts[hover].title}</b> · {pts[hover].label}
                        {props.series.map(function (s) { return <div key={s.key}>{s.label}: <b>{L.fmtNet(pts[hover][s.key])}</b></div>; })}
                    </div>
                ) : null}
            </div>
        );
    }

    function Progress(props) {
        const [list, setList] = useState(null);
        const [err, setErr] = useState(null);
        useEffect(function () { C.rpc("live_history").then(setList).catch(setErr); }, []);
        if (err) return <Panel label="Gelişim"><p>{err.message}</p></Panel>;
        if (!list) return <Panel label="Gelişim"><p>Yükleniyor…</p></Panel>;
        // kulvar değiştirdiysen gelişim yalnızca şimdiki kulvarındaki denemelerden hesaplanır
        var track = C.trackOf(props.student);
        var mine = list.filter(function (h) { return h.track === track; });
        var otherTracks = list.length - mine.length;
        var p = L.progress(mine);
        var vsAvg = p.points.filter(function (x) { return x.avg != null; });
        var dark = document.documentElement.classList.contains("dark");
        var ranked = p.points.filter(function (x) { return x.top_pct != null; });
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-display font-black tracking-tight gradient-text">Gelişimim</h1>
                {otherTracks ? <p className="plan-note">{L.TRACKS[track]} kulvarındaki denemelerin gösteriliyor; başka kulvardaki {otherTracks} deneme Denemelerim'de duruyor.</p> : null}
                {!p.points.length ? <Panel label="Boş"><p>İlk canlı denemenden sonra gelişimin burada görünecek.</p></Panel> : (
                    <>
                        <div className="grid grid-cols-3 gap-2">
                            <Stat big value={p.streak} label="hafta üst üste katılım" />
                            <Stat value={L.fmtNet(p.points[p.points.length - 1].net)} label="son net" />
                            <Stat value={p.points.length} label="deneme" />
                        </div>
                        <Panel label="Net grafiği">
                            <Kicker>Deneme deneme net</Kicker>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" aria-hidden="true">
                                {SERIES.map(function (s) { return <span key={s.key} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: dark ? s.dark : s.light }} />{s.label}</span>; })}
                            </div>
                            <LineChart points={p.points} series={SERIES} dark={dark} max={120} label="Deneme deneme toplam, Genel Yetenek ve Genel Kültür neti" />
                            <table className="w-full text-xs mt-3">
                                <thead><tr className="text-left text-stone-500"><th>Deneme</th><th>Toplam</th><th>GY</th><th>GK</th><th>Sıra</th><th>İlk %</th></tr></thead>
                                <tbody>{p.points.map(function (x) {
                                    return <tr key={x.exam_id} className="border-t border-stone-200/70 dark:border-stone-700"><td className="py-1">{x.label}</td><td>{L.fmtNet(x.net)}</td><td>{L.fmtNet(x.gy)}</td><td>{L.fmtNet(x.gk)}</td><td>{x.rank ? x.rank + "/" + x.participants : "–"}</td><td>{x.top_pct != null ? pct(x.top_pct) : "–"}</td></tr>;
                                })}</tbody>
                            </table>
                        </Panel>
                        {vsAvg.length ? (
                            <Panel label="Katılanlara göre">
                                <Kicker>Katılanlara göre</Kicker>
                                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                                    Son denemede katılan ortalamasının {vsAvg[vsAvg.length - 1].diff >= 0 ? L.fmtNet(vsAvg[vsAvg.length - 1].diff) + " net üstündesin" : L.fmtNet(-vsAvg[vsAvg.length - 1].diff) + " net altındasın"}.
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" aria-hidden="true">
                                    {VS.map(function (s) { return <span key={s.key} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: dark ? s.dark : s.light }} />{s.label}</span>; })}
                                </div>
                                <LineChart points={vsAvg} series={VS} dark={dark} max={120} label="Deneme deneme senin netin ve katılanların ortalaması" />
                                <table className="w-full text-xs mt-3">
                                    <thead><tr className="text-left text-stone-500"><th>Deneme</th><th>Sen</th><th>Katılan ort.</th><th>Medyan</th><th>Fark</th></tr></thead>
                                    <tbody>{vsAvg.map(function (x) {
                                        return <tr key={x.exam_id} className="border-t border-stone-200/70 dark:border-stone-700"><td className="py-1">{x.label}</td><td>{L.fmtNet(x.net)}</td><td>{L.fmtNet(x.avg)}</td><td>{x.p50 == null ? "–" : L.fmtNet(x.p50)}</td><td>{(x.diff >= 0 ? "+" : "") + L.fmtNet(x.diff)}</td></tr>;
                                    })}</tbody>
                                </table>
                            </Panel>
                        ) : null}
                        {ranked.length ? (
                            <Panel label="Yüzdelik dilim">
                                <Kicker>Yüzdelik dilim (küçük sayı daha iyi)</Kicker>
                                <p className="mt-2 text-sm">{ranked.map(function (x) { return "ilk %" + pct(x.top_pct); }).join(" → ")}</p>
                            </Panel>
                        ) : null}
                        <Panel label="Ders bazında gelişim">
                            <Kicker>Ders bazında net</Kicker>
                            <ul className="mt-2 space-y-1 text-sm">
                                {Object.keys(p.ders).map(function (d) {
                                    return <li key={d}><b>{d}:</b> {p.ders[d].map(function (x) { return L.fmtNet(x.net) + (x.avg != null ? " (ort. " + L.fmtNet(x.avg) + ")" : ""); }).join(" → ")}</li>;
                                })}
                            </ul>
                        </Panel>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Panel label="En çok ilerlediğin konular">
                                <Kicker>En çok ilerlediğin 3 konu</Kicker>
                                <ul className="mt-2 space-y-1 text-sm">
                                    {p.improved.length ? p.improved.map(function (k) {
                                        return <li key={k.ders + k.konu}><KonuLink ders={k.ders} konu={k.konu} kpssData={props.kpssData} onKonu={props.onKonu} /> <span className="text-stone-500">%{Math.round(k.from * 100)} → %{Math.round(k.to * 100)}</span></li>;
                                    }) : <li className="text-stone-500">İki denemeden sonra görünür.</li>}
                                </ul>
                            </Panel>
                            <Panel label="Hâlâ takıldığın konular">
                                <Kicker>Hâlâ takıldığın 3 konu</Kicker>
                                <ul className="mt-2 space-y-1 text-sm">
                                    {p.stuck.length ? p.stuck.map(function (k) {
                                        return <li key={k.ders + k.konu}><KonuLink ders={k.ders} konu={k.konu} kpssData={props.kpssData} onKonu={props.onKonu} /> <span className="text-stone-500">son: %{Math.round(k.to * 100)}</span></li>;
                                    }) : <li className="text-stone-500">Takıldığın konu yok.</li>}
                                </ul>
                            </Panel>
                        </div>
                    </>
                )}
            </div>
        );
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
        var frameRef = useRef(null), clockRef = useRef(null), meRef = useRef(null);
        var dark = document.documentElement.classList.contains("dark");

        function load() {
            return C.rpc("live_dashboard", { p_track: C.trackOf(props.student) }).then(function (d) {
                clockRef.current = L.createClock(d.now);
                setDash(d);
            }).catch(function (x) { setErr(x.message); });
        }
        useEffect(function () {
            load();
            C.whoami(props.student).then(function (w) { meRef.current = w; setMe(w); sendExpect(); });
            var t = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1000);
            return function () { clearInterval(t); };
        }, [examId]);

        function sendExpect() {
            var f = frameRef.current;
            if (f && f.contentWindow && meRef.current) f.contentWindow.postMessage({ type: "scan", expect: { exam: examId, user: meRef.current.id } }, window.location.origin);
        }
        useEffect(function () {
            function onMsg(e) {
                var f = frameRef.current;
                if (!f || e.source !== f.contentWindow) return;
                var m = e.data || {};
                if (m.type === "ready") sendExpect();
                else if (m.type === "result") {
                    var a = {}, fl = {};
                    m.answers.forEach(function (x, i) { a[i + 1] = { c: x }; if (m.flags[i]) fl[i + 1] = m.flags[i]; });
                    setRead(m); setAns(a); setFlags(fl); setSource("optic"); setEdited(0); setErr("");
                    setTimeout(function () { setStage("confirm"); window.scrollTo(0, 0); }, 600);
                } else if (m.type === "fail") {
                    setFails(function (x) { return x + 1; });
                    C.rpc("live_optic_report", { p_exam: examId, p_kind: m.code === "wrong_form" ? "wrong_form" : "fail",
                        p_detail: { code: m.code, size: m.detail && m.detail.size } }).catch(function () {});
                }
            }
            window.addEventListener("message", onMsg);
            return function () { window.removeEventListener("message", onMsg); };
        }, [examId]);

        var now = clockRef.current ? clockRef.current.now() : Date.now();
        var exam = dash && dash.exam && dash.exam.id === examId ? dash.exam : null;
        var att = dash && dash.attempt;
        var until = exam ? L.ms(exam.optic_until || exam.ranking_at) : 0;
        var header = (
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <button type="button" className="quick-chip" onClick={props.onBack}>← Canlı deneme</button>
                {exam && now < until ? <span className="text-sm font-semibold" role="timer">Okutma {L.fmtClock(until)}'ta kapanır · {L.fmtLeft(until - now)}</span> : null}
            </div>
        );
        if (!dash) return <div>{header}<Panel label="Yükleniyor"><p className="text-sm text-stone-500">{err || "Yükleniyor…"}</p></Panel></div>;
        var blocker = null;
        if (!exam || !att) blocker = "Bu denemede kâğıt modunda giriş kaydın yok.";
        else if (att.mode !== "paper") blocker = "Bu sınavı cihazda çözüyorsun; optik okutma kâğıtta çözenler içindir.";
        else if (att.submitted && stage !== "sent") blocker = "Optik formun zaten gönderildi; cevapların değişmez.";
        else if (now >= until && stage !== "sent") blocker = "Optik okutma süresi " + L.fmtClock(until) + "'ta doldu.";
        if (blocker) return <div>{header}<Panel label="Optik okutma"><p className="font-semibold">{blocker}</p></Panel></div>;

        function pick(no, letter) {
            setAns(function (a) { var b = Object.assign({}, a); b[no] = { c: letter }; return b; });
            setFlags(function (f) { if (!f[no]) return f; var g = Object.assign({}, f); delete g[no]; return g; });
            setEdited(function (x) { return x + 1; });
        }
        var list = [];
        for (var i = 1; i <= 120; i++) list.push(ans[i] && ans[i].c ? ans[i].c : null);
        var answered = list.filter(Boolean).length;
        var flaggedNos = Object.keys(flags).map(Number).sort(function (a, b) { return a - b; });
        var doubles = flaggedNos.filter(function (n) { return flags[n] === "double"; });

        function submit() {
            var msg = answered + " cevap, " + (120 - answered) + " boş gönderilecek.";
            if (flaggedNos.length) msg += "\n\nKontrol etmediğin " + flaggedNos.length + " satır var: " + flaggedNos.slice(0, 12).join(", ") + (flaggedNos.length > 12 ? "…" : "") +
                (doubles.length ? "\nÇift işaretli satırlar boş gönderilir." : "");
            msg += "\n\nGönderdikten sonra cevapların değiştirilemez. Onaylıyor musun?";
            if (!window.confirm(msg)) return;
            setBusy(true); setErr("");
            C.rpc("live_submit_optic", { p_exam: examId, p_answers: L.answerText(list), p_meta: {
                source: source, qr: source === "optic" && read ? read.qr : null,
                flagged: flaggedNos.length, double: doubles.length, uncertain: flaggedNos.length - doubles.length, edited: edited
            } }).then(function () { setBusy(false); setStage("sent"); load(); })
                .catch(function (x) { setBusy(false); setErr(x.message); });
        }

        if (stage === "sent") {
            var open = exam && now >= L.ms(exam.ends_at);
            return (
                <div>{header}
                    <Panel label="Gönderildi">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">✓ Optik formun gönderildi</p>
                        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{answered} cevap kaydedildi. Cevapların artık değişmez.
                            {open ? " Sonucun ve çözümlerin açıldı; sıralama " + L.fmtClock(L.ms(exam.ranking_at)) + "'ta kesinleşir." : " Sonucun ve çözümler " + L.fmtClock(L.ms(exam.ends_at)) + "'te açılır."}</p>
                        {open ? <button type="button" className="quick-chip is-primary mt-3" onClick={function () { props.onResult(examId); }}>Sonucumu gör</button> : null}
                    </Panel>
                </div>
            );
        }

        if (stage === "manual") {
            var parsed = L.parseAnswerText(manual, 120);
            return (
                <div>{header}
                    <Panel label="Elle giriş">
                        <Kicker>Cevaplarını elle gir</Kicker>
                        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">Optik formundaki cevapları 1'den 120'ye sırayla yaz. Boş bıraktığın sorular için <b>-</b> yaz. Boşluk ve virgüller yok sayılır.</p>
                        <textarea className="w-full mt-3 rounded-2xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 p-3 font-mono text-sm tracking-widest uppercase"
                            rows={5} value={manual} onChange={function (ev) { setManual(ev.target.value); }} placeholder="ACEBD-A…" aria-label="Cevaplar (A–E, boş için -)" spellCheck="false" autoCapitalize="characters" />
                        <p className={"text-sm mt-1 " + (parsed.bad.length || parsed.extra ? "text-rose-700 dark:text-rose-300" : "text-stone-500")} role="status">
                            {parsed.count} / 120 cevap{parsed.bad.length ? " · geçersiz karakter: " + parsed.bad.join(" ") : ""}{parsed.extra ? " · " + parsed.extra + " fazla" : ""}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button type="button" className="quick-chip is-primary" disabled={!parsed.complete} onClick={function () {
                                var a = {};
                                parsed.answers.forEach(function (x, j) { a[j + 1] = { c: x }; });
                                setAns(a); setFlags({}); setSource("manual"); setEdited(0); setStage("confirm"); window.scrollTo(0, 0);
                                C.rpc("live_optic_report", { p_exam: examId, p_kind: "manual_open", p_detail: {} }).catch(function () {});
                            }}>Kontrol ekranına geç</button>
                            <button type="button" className="quick-chip" onClick={function () { setStage("scan"); }}>Fotoğrafla okut</button>
                        </div>
                    </Panel>
                </div>
            );
        }

        if (stage === "confirm") {
            return (
                <div>{header}
                    <Panel label="Okunan cevapları kontrol et" className="mb-4">
                        <Kicker>{source === "manual" ? "Elle girdiğin cevaplar" : "Okunan cevaplarını kontrol et"}</Kicker>
                        <h2 className="text-lg font-bold mt-1">{answered} cevap · {120 - answered} boş{flaggedNos.length ? " · " + flaggedNos.length + " satırı kontrol et" : ""}</h2>
                        {source === "optic" && read ? (
                            <div className="mt-2 text-sm space-y-1">
                                <p className={read.qrOk ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
                                    {read.qrOk ? "✓ Karekod okundu: form sana ve bu denemeye ait." : "⚠ Karekod okunamadı; formun sana ait olduğundan emin ol."}</p>
                                {(read.warnings || []).filter(function (w) { return !/Karekod/.test(w); }).map(function (w) { return <p key={w} className="text-amber-700 dark:text-amber-300">⚠ {w}</p>; })}
                            </div>
                        ) : null}
                        <ul className="mt-3 text-sm text-stone-600 dark:text-stone-300 space-y-1">
                            <li><span className="optic-legend is-uncertain" aria-hidden="true"></span> Sarı satır: okuma kararsız (silinmiş iz ya da açık işaret). En olası cevap seçili; kontrol et.</li>
                            <li><span className="optic-legend is-double" aria-hidden="true"></span> Kırmızı satır: çift işaret. Düzeltmezsen boş gönderilir.</li>
                            <li>Bir baloncuğa dokunarak cevabı değiştir; işaretli baloncuğa yeniden dokunursan boş olur.</li>
                        </ul>
                        {source === "optic" && read && read.preview ? (
                            <details className="mt-3">
                                <summary className="text-sm font-semibold cursor-pointer">Fotoğraftaki okumayı göster</summary>
                                <img src={read.preview} alt="Okunan optik form; yeşil: okunan, sarı: kararsız, kırmızı: çift işaret" className="mt-2 rounded-2xl border border-stone-200 dark:border-stone-700 max-h-[520px] w-auto" />
                            </details>
                        ) : null}
                    </Panel>
                    <OpticGrid answers={ans} flags={flags} onPick={busy ? null : pick} head={source === "manual" ? "ELLE GİRİŞ · KONTROL" : "OKUNAN OPTİK FORM · KONTROL"} />
                    {err ? <p className="plan-warn mt-3" role="alert">{err}</p> : null}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <button type="button" className="quick-chip is-primary" disabled={busy} onClick={submit}>{busy ? "Gönderiliyor…" : "Onaylıyorum, gönder"}</button>
                        <button type="button" className="quick-chip" disabled={busy} onClick={function () { setStage("scan"); setRead(null); }}>Yeniden çek</button>
                        <button type="button" className="quick-chip" disabled={busy} onClick={function () { setManual(L.answerText(list)); setStage("manual"); }}>Elle düzenle</button>
                    </div>
                </div>
            );
        }

        return (
            <div>{header}
                <iframe ref={frameRef} src={C.OPTIK_URL + "&mode=scan&theme=" + (dark ? "dark" : "light")} title="Optik formunu okut"
                    className="optic-frame" onLoad={sendExpect} />
                {fails ? (
                    <Panel label="Okuma olmuyor mu?" className="mt-3">
                        <p className="text-sm text-stone-600 dark:text-stone-300">Fotoğraf {fails} kez okunamadı. İpuçlarını deneyebilir ya da cevaplarını elle girebilirsin.</p>
                        <button type="button" className="quick-chip mt-2" onClick={function () { setStage("manual"); }}>Cevapları elle gir</button>
                    </Panel>
                ) : <p className="text-xs text-stone-500 mt-2">Kamera okumuyor mu? <button type="button" className="underline font-semibold" onClick={function () { setStage("manual"); }}>Cevapları elle gir</button></p>}
            </div>
        );
    }

    function LiveExamScreen(props) {
        var init = props.liveView || { view: "home" };
        const [view, setView] = useState(init.view || "home");
        const [examId, setExamId] = useState(init.examId || null);
        const [submitted, setSubmitted] = useState(false);
        var Card = window.KpssLiveCard;

        function open(v, id) { setView(v); if (id) setExamId(id); window.scrollTo(0, 0); }
        var nav = (
            <div className="flex flex-wrap gap-2 mb-4">
                <button type="button" className={"quick-chip" + (view === "home" ? " is-primary" : "")} onClick={function () { open("home"); }}>Canlı deneme</button>
                <button type="button" className={"quick-chip" + (view === "archive" ? " is-primary" : "")} onClick={function () { open("archive"); }}>Denemelerim</button>
                <button type="button" className={"quick-chip" + (view === "progress" ? " is-primary" : "")} onClick={function () { open("progress"); }}>Gelişimim</button>
            </div>
        );

        if (view === "optic" && examId) {
            return <OpticScan examId={examId} student={props.student} onBack={function () { open("home"); }} onResult={function (id) { open("result", id); }} />;
        }
        if (view === "exam" && examId && !submitted) {
            return <ExamRunner examId={examId} onBack={function () { open("home"); }}
                onResult={function (id) { open("result", id); }}
                onSubmitted={function () { setSubmitted(true); open("home"); }} />;
        }
        return (
            <div>
                {nav}
                {view === "home" ? (
                    <div className="space-y-4">
                        <h1 className="text-3xl font-display font-black tracking-tight gradient-text">Canlı deneme</h1>
                        {Card ? <Card student={props.student} kpssData={props.kpssData} onKonu={props.onKonu} full onOpen={function (v, id) { open(v, id); }} /> : null}
                        <Panel label="Nasıl işler?">
                            <Kicker>Nasıl işler?</Kicker>
                            <ul className="mt-2 space-y-1.5 text-sm text-stone-700 dark:text-stone-300 list-disc pl-5">
                                <li>Hafta içi kayıt ol. Kayıt pazar 10:00'da kapanır.</li>
                                <li>10:00'da soru kitapçığı şifreli olarak cihazına iner; 10:15'te kilidi açılır ve herkes aynı anda başlar.</li>
                                <li>Sınava 10:45'e kadar girebilirsin; bitiş herkes için 12:25. Geç giren ek süre almaz.</li>
                                <li>Her cevap anında kaydedilir. İnternet giderse çözmeye devam et; bağlantı gelince gönderilir.</li>
                                <li>Sınav tek cihazda açık kalır. Şarjın biterse başka cihazdan devam edebilirsin (en fazla 2 değişim).</li>
                                <li>12:25'te kendi sonucun ve çözümlerin açılır; sıralama ve katılan ortalamaları 12:40'ta kesinleşir.</li>
                                <li>Yanlış ve boş bıraktığın konular Eksikler'e düşer.</li>
                                <li>Kâğıtta da çözebilirsin: 10:15'te "Kâğıtta çöz" ile kitapçık PDF olarak iner, cevaplarını optik forma işaretlersin. Sınav bitince 15 dakika içinde formun fotoğrafını çekip okutursun; okunan cevapları kontrol edip onaylamadan hiçbir şey gönderilmez.</li>
                            </ul>
                        </Panel>
                    </div>
                ) : null}
                {view === "result" && examId ? <ResultReport examId={examId} kpssData={props.kpssData} onKonu={props.onKonu} onBack={function () { open("home"); }} /> : null}
                {view === "archive" ? <Archive onOpen={function (id) { open("result", id); }} /> : null}
                {view === "progress" ? <Progress student={props.student} kpssData={props.kpssData} onKonu={props.onKonu} /> : null}
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LiveExamScreen = LiveExamScreen;
    window.KpssComponents.LiveOpticGrid = OpticGrid;
})();
