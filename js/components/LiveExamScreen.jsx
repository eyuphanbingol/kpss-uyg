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
                                        return (
                                            <div key={n} className={"optic-row" + (props.current === n ? " is-current" : "")}>
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
                                                            aria-label={"Soru " + n + " " + l + (on ? " (işaretli)" : "")}
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
                    <span>ATANLY · CANLI DENEME · OPTİK FORM</span>
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
        var dersRows = L.dersRows(r, coh);
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
                        <thead><tr className="text-left text-xs text-stone-500"><th className="py-1">Ders</th><th>D</th><th>Y</th><th>B</th><th>Net</th><th>Katılan ort.</th></tr></thead>
                        <tbody>
                            {dersRows.map(function (d) {
                                return (
                                    <tr key={d.ders} className="border-t border-stone-200/70 dark:border-stone-700">
                                        <td className="py-1.5 font-semibold">{d.ders}</td><td>{d.c}</td><td>{d.w}</td><td>{d.b}</td>
                                        <td className="font-bold">{L.fmtNet(d.net)}</td><td>{d.avgNet == null ? "–" : L.fmtNet(d.avgNet)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Panel>

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
                                <li key={q.no} className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-900/50">
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
                                                {tot ? "Katılanların %" + pct(100 * q.stat.correct / tot) + "'i doğru yaptı." : ""}
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
        var p = L.progress(list);
        var dark = document.documentElement.classList.contains("dark");
        var ranked = p.points.filter(function (x) { return x.top_pct != null; });
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-display font-black tracking-tight gradient-text">Gelişimim</h1>
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
                                    return <li key={d}><b>{d}:</b> {p.ders[d].map(function (x) { return L.fmtNet(x.net); }).join(" → ")}</li>;
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
                            </ul>
                        </Panel>
                    </div>
                ) : null}
                {view === "result" && examId ? <ResultReport examId={examId} kpssData={props.kpssData} onKonu={props.onKonu} onBack={function () { open("home"); }} /> : null}
                {view === "archive" ? <Archive onOpen={function (id) { open("result", id); }} /> : null}
                {view === "progress" ? <Progress kpssData={props.kpssData} onKonu={props.onKonu} /> : null}
            </div>
        );
    }

    window.KpssComponents = window.KpssComponents || {};
    window.KpssComponents.LiveExamScreen = LiveExamScreen;
    window.KpssComponents.LiveOpticGrid = OpticGrid;
})();
