import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AppState, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { WebView } from "react-native-webview";
import { OPTIK_HTML } from "../lib/optikHtml";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { useApp } from "../AppProvider";
import { LiveExam as L } from "../lib/liveExam";
import { LiveClient as C } from "../lib/liveClient";
import { StudentStore } from "../lib/store";
import { konuLabel } from "../lib/konuLabels";
import { go } from "../nav";
import { Card, PageHeader, ScrollScreen, Tap } from "../ui";
import { LiveExamCard, liveKonuHasContent, s as cs } from "../components/LiveExamCard";

// Soru metni biçimi (L.richParse): __söz__ altı çizili, __söz__(II) numaralı, **söz** kalın,
// \frac{pay}{payda} alt alta kesir, \sqrt{x} / √15 kök, x^{2} üs, a_{1} alt indis.
// React Native'de numara sözün altına konamadığı için hemen yanında küçük ve kalın gösterilir.
function richSeg(x, i, ts) {
    var base = StyleSheet.flatten(ts) || {}, size = base.fontSize || 16;
    if (x.f) return <Frac key={i} f={x.f} ts={ts} />;
    // RN'de üst çizgi yok: basit kök √15, karmaşık kök √(a+b) olarak yazılır
    if (x.r != null) return /^[\w.,]+$/.test(x.r) ? <Text key={i}>√{x.r}</Text> : <Text key={i}>√({rich(x.r, ts)})</Text>;
    if (x.sp != null || x.sb != null) return <Text key={i} style={{ fontSize: size * 0.68 }}>{rich(x.sp != null ? x.sp : x.sb, ts)}</Text>;
    if (x.b) return <Text key={i} style={{ fontWeight: "800" }}>{x.t}</Text>;
    if (!x.u) return x.t;
    return (
        <Text key={i}>
            <Text style={{ textDecorationLine: "underline" }}>{x.t}</Text>
            {x.m ? <Text style={{ fontSize: 11, fontWeight: "900" }}>{"\u2009(" + x.m + ")"}</Text> : null}
        </Text>
    );
}
function rich(text, ts) {
    return L.richParse(text).map(function (x, i) { return richSeg(x, i, ts); });
}
// Alt alta kesir: pay, çizgi, payda (iç metin aynı yazı stilinde, biraz küçük)
function Frac(props) {
    var base = StyleSheet.flatten(props.ts) || {}, size = base.fontSize || 16, color = base.color || "#1c1917";
    var inner = { fontSize: size * 0.85, color: color, fontWeight: base.fontWeight, lineHeight: size * 1.1 };
    return (
        <View style={{ alignItems: "center", marginHorizontal: 3, marginVertical: 2 }}>
            <Text style={inner}>{rich(props.f[0], inner)}</Text>
            <View style={{ alignSelf: "stretch", height: 1.5, backgroundColor: color, marginVertical: 1 }} />
            <Text style={inner}>{rich(props.f[1], inner)}</Text>
        </View>
    );
}
// Metin bloğu: kesir yoksa tek Text; varsa sözcükler ve kesirler sarmalanan bir satır düzeninde dizilir
// (RN'de metin içine gömülü View satır yüksekliğini büyütmediği için).
function RichBlock(props) {
    var ts = props.style, parts = L.richParse(props.text);
    if (!parts.some(function (x) { return x.f; })) return <Text style={ts}>{rich(props.text, ts)}</Text>;
    var base = StyleSheet.flatten(ts) || {}, gap = (base.fontSize || 16) * 0.3, items = [];
    // kelime başına kenar boşluğu ve flex uygulanmasın; dış boşluk kapsayıcıya geçer
    var wts = [ts, { margin: 0, marginTop: 0, marginBottom: 0, flex: 0 }];
    ts = wts;
    function push(el) { items.push({ el: el, sp: false }); }
    parts.forEach(function (x, i) {
        if (x.t == null) { push(<Text style={ts}>{richSeg(x, 0, ts)}</Text>); return; }
        var chunks = String(x.t).split(/(\s+)/);
        chunks.forEach(function (c, j) {
            if (!c) return;
            if (/^\s+$/.test(c)) {
                if (items.length) items[items.length - 1].sp = true;
                if (c.indexOf("\n") >= 0) items.push({ br: true });
                return;
            }
            var last = x.m && chunks.slice(j + 1).every(function (r) { return !r.trim(); });
            push(<Text style={ts}>{richSeg({ t: c, u: x.u, b: x.b, m: last ? x.m : undefined }, 0, ts)}</Text>);
        });
    });
    return (
        <View style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", flexShrink: 1, marginTop: base.marginTop || 0 }, props.box]}>
            {items.map(function (it, k) {
                return it.br ? <View key={k} style={{ width: "100%", height: 0 }} /> : <View key={k} style={{ marginRight: it.sp ? gap : 0 }}>{it.el}</View>;
            })}
        </View>
    );
}

// Canlı deneme ekranları (mobil). Web karşılığı js/components/LiveExamScreen.jsx.

function Chip({ label, onPress, primary, dark, disabled, selected }) {
    return (
        <Tap onPress={onPress} disabled={disabled} accessibilityState={selected != null ? { selected: !!selected } : undefined}
            style={[cs.btn, dark && cs.btnDark, primary && cs.btnPrimary, disabled && { opacity: 0.45 }]}>
            <Text style={[cs.btnTxt, (dark || primary) && cs.light]}>{label}</Text>
        </Tap>
    );
}
function Stat({ value, label, dark, big }) {
    return (
        <View style={[st.stat, dark && st.statDark]}>
            <Text style={[big ? st.statBig : st.statNum, dark && cs.light]}>{value}</Text>
            <Text style={st.statLab}>{label}</Text>
        </View>
    );
}
function KonuLink({ navigation, kpssData, ders, konu, dark }) {
    var can = liveKonuHasContent(kpssData, ders, konu);
    return (
        <Tap disabled={!can} onPress={function () { go(navigation, "KonuHub", { ders: ders, konu: konu }); }}>
            <Text style={[st.konu, dark && cs.light, can && cs.link]}>{ders} / {konuLabel(konu)}{can ? " →" : " (anlatım yakında)"}</Text>
        </Tap>
    );
}
function pct(x) { return x == null ? "–" : String(Math.round(Number(x) * 10) / 10).replace(".", ","); }

// ---------- Optik form görünümü ----------
function OpticGrid({ answers, current, onJump, onPick, keyMap, flags, head }) {
    function block(from, to, title) {
        var rows = [];
        for (var n = from; n <= to; n++) rows.push(n);
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={st.opTitle}>{title}</Text>
                {rows.map(function (n) {
                    var a = answers[n] && answers[n].c;
                    var key = keyMap && keyMap[n];
                    var flag = flags && flags[n];
                    return (
                        <View key={n} style={[st.opRow, current === n && st.opRowCur, n % 5 === 0 && st.opRowSep, flag === "uncertain" && st.opFlagU, flag === "double" && st.opFlagD]}>
                            <Tap onPress={function () { onJump && onJump(n); }} style={st.opNoWrap} accessibilityLabel={"Soru " + n + "'e git"}>
                                <Text style={st.opNo}>{n}</Text>
                            </Tap>
                            {L.LETTERS.map(function (l) {
                                var on = a === l;
                                return (
                                    <Tap key={l} disabled={!onPick} onPress={function () { onPick && onPick(n, on ? null : l); }}
                                        accessibilityLabel={"Soru " + n + " " + l + (on ? " işaretli" : "") + (flag === "double" ? ", çift işaret" : flag === "uncertain" ? ", kararsız okuma" : "")}
                                        style={[st.bub, on && st.bubOn, key && l === key && st.bubKey, key && on && l !== key && st.bubWrong]}>
                                        <Text style={[st.bubTxt, on && { color: "#fff" }]}>{l}</Text>
                                    </Tap>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    }
    var filled = Object.keys(answers).filter(function (k) { return answers[k] && answers[k].c; }).length;
    return (
        <View style={st.sheet}>
            <View style={st.sheetHead}><Text style={st.sheetHeadTxt}>{head || "ATANLY · OPTİK FORM"}</Text><Text style={st.sheetHeadTxt}>{filled} / 120</Text></View>
            {block(1, 60, "GENEL YETENEK (1–60)")}
            {block(61, 120, "GENEL KÜLTÜR (61–120)")}
        </View>
    );
}

// ============================================================
export function LiveHomeScreen({ navigation }) {
    var app = useApp();
    var dark = app.dark;
    return (
        <ScrollScreen dark={dark}>
            <PageHeader dark={dark} title="Canlı deneme" subtitle="Her pazar 10:15 · herkes aynı anda" onBack={function () { navigation.goBack(); }} right={null} />
            <LiveExamCard navigation={navigation} student={app.student} kpssData={app.kpssData} dark={dark} full />
            <View style={[cs.btns, { marginBottom: 10 }]}>
                <Chip dark={dark} label="Denemelerim" onPress={function () { go(navigation, "LiveArchive"); }} />
                <Chip dark={dark} label="Gelişimim" onPress={function () { go(navigation, "LiveArchive", { tab: "progress" }); }} />
            </View>
            <Card dark={dark}>
                <Text style={cs.kicker}>NASIL İŞLER?</Text>
                <Text style={[cs.body, dark && cs.lightMuted]}>
                    • Hafta içi kayıt ol; kayıt pazar 10:00'da kapanır.{"\n"}
                    • 10:00'da soru kitapçığı şifreli olarak telefonuna iner, 10:15'te açılır.{"\n"}
                    • Sınava 10:45'e kadar girebilirsin; bitiş herkes için 12:25.{"\n"}
                    • Her cevap anında kaydedilir; internet giderse çözmeye devam et.{"\n"}
                    • Telefonun kapanırsa başka cihazdan devam edebilirsin (en fazla 2 değişim).{"\n"}
                    • 12:25'te sonucun ve çözümlerin açılır; sıralama 12:40'ta kesinleşir.{"\n"}
                    • Yanlış ve boş bıraktığın konular Eksikler'e düşer.
                </Text>
            </Card>
        </ScrollScreen>
    );
}

// ============================================================
export function LiveExamScreen({ navigation, route }) {
    var app = useApp();
    var dark = app.dark;
    var examId = route.params.examId;
    var [stage, setStage] = useState("enter");
    var [err, setErr] = useState(null);
    var [exam, setExam] = useState(null);
    var [qs, setQs] = useState([]);
    var [idx, setIdx] = useState(0);
    var [grid, setGrid] = useState(false);
    var [, setTick] = useState(0);
    var [sync, setSync] = useState({ pending: 0 });
    var [fatal, setFatal] = useState(null);
    var clockRef = useRef(null);
    var queueRef = useRef(null);
    var seenAt = useRef(Date.now());
    var dev = useMemo(function () { return C.deviceId(); }, []);

    function onQueueState(s) { setSync(s); if (s && s.error && s.error.fatal) setFatal(s.error); }

    useEffect(function () {
        var alive = true;
        function start(data, offline) {
            clockRef.current = L.createClock(offline ? Date.now() + (data.offset || 0) : data.now);
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
            if (data && data.error) { setErr({ message: data.message }); setStage("error"); return; }
            return start(data, false);
        }).catch(function (e) {
            if (!alive) return;
            var saved = e.network ? C.recallEntry(examId) : null;
            if (saved && saved.key) return start(saved, true);
            setErr(e); setStage("error");
        });
        return function () { alive = false; if (queueRef.current) queueRef.current.stop(); };
    }, [examId]);

    useEffect(function () {
        if (stage !== "run") return;
        var t = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1000);
        var s = setInterval(function () {
            C.rpc("live_now").then(function (r) { if (r && clockRef.current) clockRef.current.sync(r.now); }).catch(function () {});
            if (queueRef.current) queueRef.current.flush();
        }, 60000);
        var sub = AppState.addEventListener("change", function (next) {
            if (next === "active") {
                C.rpc("live_now").then(function (r) { if (r && clockRef.current) clockRef.current.sync(r.now); }).catch(function () {});
                if (queueRef.current) queueRef.current.flush();
            }
        });
        return function () { clearInterval(t); clearInterval(s); sub.remove(); };
    }, [stage]);

    var now = clockRef.current ? clockRef.current.now() : 0;
    var left = exam ? L.ms(exam.ends_at) - now : 0;
    var cur = qs[idx];

    function recordTime() {
        var q = queueRef.current;
        if (!q || !cur) return;
        var spent = Date.now() - seenAt.current;
        seenAt.current = Date.now();
        if (spent > 500) q.addTime(cur.no, q.ms(cur.no) + spent);
    }
    useEffect(function () { seenAt.current = Date.now(); }, [idx, stage]);

    useEffect(function () {
        if (stage === "run" && exam && left <= 0) {
            setStage("ended");
            recordTime();
            var q = queueRef.current;
            (q ? q.flush() : Promise.resolve()).then(function () {
                setTimeout(function () { navigation.replace("LiveResult", { examId: examId }); }, 1500);
            });
        }
    });

    function pick(no, letter) {
        var q = queueRef.current;
        if (!q || fatal || stage !== "run") return;
        recordTime();
        q.set(no, letter, q.ms(no));
        setTick(function (x) { return x + 1; });
    }
    function goTo(i) { recordTime(); setIdx(Math.max(0, Math.min(qs.length - 1, i))); }
    function jump(no) { var i = qs.findIndex(function (q) { return q.no === no; }); if (i >= 0) { goTo(i); setGrid(false); } }

    function finish() {
        var answers = queueRef.current ? queueRef.current.all() : {};
        var blank = qs.length - Object.keys(answers).filter(function (k) { return answers[k] && answers[k].c; }).length;
        Alert.alert("Kâğıdını teslim et?", (blank ? blank + " soru boş. " : "") + "Teslim ettikten sonra cevapların değişmez. Sonucun ve çözümler " + L.fmtClock(L.ms(exam.ends_at)) + "'te açılır.", [
            { text: "Vazgeç", style: "cancel" },
            { text: "Teslim et", onPress: function () {
                recordTime();
                (queueRef.current ? queueRef.current.flush() : Promise.resolve()).then(function () {
                    return C.rpc("live_submit", { p_exam: examId, p_device: dev });
                }).then(function () { navigation.goBack(); }).catch(function (e) { Alert.alert("Teslim edilemedi", e.message); });
            } }
        ]);
    }

    if (stage === "error" || stage === "enter" || stage === "loading" || stage === "ended") {
        return (
            <ScrollScreen dark={dark}>
                <PageHeader dark={dark} title="Canlı deneme" onBack={function () { navigation.goBack(); }} right={null} />
                <Card dark={dark}>
                    <Text style={[cs.title, dark && cs.light]}>
                        {stage === "error" ? "Sınava girilemedi" : stage === "ended" ? "Süre doldu" : stage === "enter" ? "Sunucuya bağlanılıyor…" : "Soru kitapçığı açılıyor…"}
                    </Text>
                    <Text style={[cs.body, dark && cs.lightMuted]}>
                        {stage === "error" ? ((err && err.message) || "") : stage === "ended" ? "Cevapların gönderiliyor, sonuç ekranı açılıyor…" : "Süren sunucu saatine göre işler; uygulamayı kapatsan da cevapların kayıtlıdır."}
                    </Text>
                    {stage === "ended" && sync.pending ? <Text style={cs.warn}>{sync.pending} cevap bekliyor; internet gelince 12:27'ye kadar gönderilir.</Text> : null}
                </Card>
            </ScrollScreen>
        );
    }

    var answers = queueRef.current ? queueRef.current.all() : {};
    var answered = Object.keys(answers).filter(function (k) { return answers[k] && answers[k].c; }).length;
    var mine = cur && queueRef.current ? queueRef.current.get(cur.no) : null;
    var syncText = fatal ? "Kayıt durdu" : (sync.pending ? (sync.ok === false ? "Çevrimdışı · " + sync.pending + " cevap bekliyor" : "Kaydediliyor…") : "Tüm cevaplar kaydedildi");

    return (
        <ScrollScreen dark={dark}>
            <View style={[st.bar, dark && st.barDark]}>
                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={cs.kicker} numberOfLines={1}>{exam && exam.title}</Text>
                    <Text style={[st.sync, fatal ? { color: "#be123c" } : sync.pending ? { color: "#b45309" } : { color: "#047857" }]}>{syncText}</Text>
                </View>
                <Text style={[st.timer, dark && cs.light, left < 600000 && { color: "#b91c1c" }]} accessibilityRole="timer" accessibilityLabel={"Kalan süre " + L.fmtTimer(left)}>{L.fmtTimer(left)}</Text>
            </View>
            {fatal ? (
                <Text style={cs.warn}>
                    {fatal.code === "device_replaced" ? "Sınav başka bir cihazda açıldı; bu cihazda cevap kaydedilmiyor." : fatal.code === "locked" ? "Cihaz değişim sınırı aşıldı; sınavın kilitlendi. Yönetici ile iletişime geç." : fatal.message}
                </Text>
            ) : null}
            <View style={[cs.btns, { marginTop: 4 }]}>
                <Chip dark={dark} primary={grid} selected={grid} label="▦ Toplu görünüm" onPress={function () { recordTime(); setGrid(!grid); }} />
                <Chip dark={dark} label="Sınavı bitir" onPress={finish} />
            </View>
            <Text style={[cs.muted, { marginTop: 6 }]}>{answered} işaretli · {qs.length - answered} boş</Text>

            {grid ? (
                <View style={{ marginTop: 10 }}>
                    <OpticGrid answers={answers} current={cur && cur.no} onJump={jump} onPick={fatal ? null : pick} />
                </View>
            ) : cur ? (
                <View style={{ marginTop: 10 }}>
                    <Card dark={dark}>
                        <Text style={cs.muted}>Soru {cur.no} / 120 · {L.BOLUM[cur.bolum]} · {cur.ders}</Text>
                        <RichBlock text={cur.stem} style={[st.stem, dark && cs.light]} />
                        {cur.image ? <Image source={{ uri: cur.image }} style={st.img} resizeMode="contain" accessibilityLabel="Soru şekli" /> : null}
                    </Card>
                    {(cur.options || []).map(function (o, i) {
                        var l = L.LETTERS[i];
                        var on = mine === l;
                        return (
                            <Tap key={l} onPress={function () { pick(cur.no, on ? null : l); }} accessibilityRole="radio" accessibilityState={{ checked: on }}
                                style={[st.opt, dark && st.optDark, on && st.optOn]}>
                                <View style={[st.letter, on && st.letterOn]}><Text style={[st.letterTxt, on && { color: "#0D2C4D" }]}>{l}</Text></View>
                                <RichBlock text={o} style={[st.optTxt, (dark || on) && cs.light]} box={{ flex: 1 }} />
                            </Tap>
                        );
                    })}
                    <View style={[cs.btns, { justifyContent: "space-between" }]}>
                        <Chip dark={dark} disabled={idx === 0} label="← Önceki" onPress={function () { goTo(idx - 1); }} />
                        <Chip primary disabled={idx >= qs.length - 1} label="Sonraki →" onPress={function () { goTo(idx + 1); }} />
                    </View>
                </View>
            ) : null}
        </ScrollScreen>
    );
}

// ============================================================
export function LiveResultScreen({ navigation, route }) {
    var app = useApp();
    var dark = app.dark;
    var examId = route.params.examId;
    var [data, setData] = useState(null);
    var [review, setReview] = useState(null);
    var [images, setImages] = useState({});
    var [err, setErr] = useState(null);
    var [filter, setFilter] = useState("yanlis");
    var [openQ, setOpenQ] = useState(null);
    var [attempt, setAttempt] = useState(0);

    useEffect(function () {
        var alive = true;
        C.flushPending(examId).then(function () { return C.rpc("live_result", { p_exam: examId }); }).catch(function (e) {
            if (e.code === "not_yet" && attempt < 6 && alive) { setTimeout(function () { if (alive) setAttempt(attempt + 1); }, 5000); return null; }
            throw e;
        }).then(function (r) {
            if (!r || !alive) return;
            setData(r);
            if (r.result && StudentStore.applyLiveExamGaps) StudentStore.applyLiveExamGaps(examId, { title: r.exam.title, at: r.exam.starts_at }, L.gaps(r.result));
            return C.rpc("live_review", { p_exam: examId }).then(function (rv) {
                if (!alive) return;
                setReview(rv);
                if ((rv.questions || []).some(function (q) { return q.image; }) && rv.key) {
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

    var header = <PageHeader dark={dark} title="Deneme sonucu" onBack={function () { navigation.goBack(); }} right={null} />;
    if (err) return <ScrollScreen dark={dark}>{header}<Card dark={dark}><Text style={[cs.body, dark && cs.lightMuted]}>{err.message}</Text></Card></ScrollScreen>;
    if (!data) return <ScrollScreen dark={dark}>{header}<Card dark={dark}><Text style={[cs.body, dark && cs.lightMuted]}>Sonucun hesaplanıyor…</Text></Card></ScrollScreen>;

    var r = data.result || {};
    var exam = data.exam;
    var coh = data.cohort;
    var fin = exam.finalized;
    var weak = L.weakest(r, 3);
    var ders = L.dersCompare(r, coh, data.peers);
    var konu = L.konuRows(r, coh);
    var an = (coh && coh.analysis) || {};
    var hist = fin ? L.histRows(coh, r.net) : [];
    var beat = fin ? L.beatPct(r) : null;
    var qs = (review && review.questions) || [];
    var shown = qs.filter(function (q) {
        if (filter === "yanlis") return q.mine && q.mine !== q.answer;
        if (filter === "bos") return !q.mine;
        if (filter === "dogru") return q.mine === q.answer;
        return true;
    });
    var keyMap = {}, ansMap = {};
    qs.forEach(function (q) { keyMap[q.no] = q.answer; ansMap[q.no] = { c: q.mine }; });
    var easy = L.easyMisses(qs).slice(0, 8);
    var tm = L.timeRows(qs, coh);
    var modes = an.by_mode || {};

    return (
        <ScrollScreen dark={dark}>
            {header}
            <Text style={cs.kicker}>{L.trUpper(L.TRACKS[exam.track])} · {L.trUpper(L.fmtDate(L.ms(exam.starts_at)))} · {r.mode === "paper" ? "KÂĞIT" : "CİHAZ"}</Text>
            <Text style={[cs.title, dark && cs.light, { marginBottom: 8 }]}>{exam.title}</Text>
            <View style={st.stats}>
                <Stat big dark={dark} value={L.fmtNet(r.net)} label="net" />
                <Stat dark={dark} value={r.correct + "/" + r.wrong + "/" + r.blank} label="D / Y / B" />
            </View>
            <View style={st.stats}>
                <Stat dark={dark} value={fin && r.rank ? r.rank + " / " + r.participants : "–"} label={fin ? "sıralama" : "sıralama " + L.fmtClock(L.ms(exam.ranking_at)) + "'ta"} />
                <Stat dark={dark} value={fin && r.top_pct != null ? "%" + pct(r.top_pct) : "–"} label="yüzdelik (ilk)" />
            </View>
            <View style={st.stats}>
                <Stat dark={dark} value={L.fmtNet(r.gy_net)} label={"GY net" + (coh ? " · ort. " + L.fmtNet(coh.avg_gy) : "")} />
                <Stat dark={dark} value={L.fmtNet(r.gk_net)} label={"GK net" + (coh ? " · ort. " + L.fmtNet(coh.avg_gk) : "")} />
            </View>

            {fin && hist.length ? (
                <Card dark={dark} style={{ marginTop: 10 }}>
                    <Text style={cs.kicker}>KATILANLAR ARASINDA</Text>
                    <Text style={[cs.title, dark && cs.light]}>{beat != null ? "Senden düşük net yapanların oranı: %" + beat : "Sıralaman " + r.rank + " / " + r.participants + "."}</Text>
                    {an.pct ? <Text style={[cs.body, dark && cs.lightMuted]}>Medyan {L.fmtNet(an.pct.p50)} · ilk %25 sınırı {L.fmtNet(an.pct.p75)} · ilk %10 sınırı {L.fmtNet(an.pct.p90)} net.{an.top10_net != null ? " İlk %10'un ortalaması " + L.fmtNet(an.top10_net) + "." : ""}</Text> : null}
                    <NetHist rows={hist} dark={dark} />
                    <Text style={cs.muted}>{hist.filter(function (h) { return h.n || h.mine; }).map(function (h) { return h.from + "–" + h.to + ": " + h.n + (h.mine ? " (sen)" : ""); }).join(" · ")}</Text>
                    {modes.device && modes.paper ? <Text style={[cs.muted, { marginTop: 4 }]}>Cihazda çözenler ort. {L.fmtNet(modes.device.avg_net)} ({modes.device.n}) · kâğıtta {L.fmtNet(modes.paper.avg_net)} ({modes.paper.n})</Text> : null}
                </Card>
            ) : null}

            {weak.length ? (
                <Card dark={dark} style={{ marginTop: 10 }}>
                    <Text style={cs.kicker}>EN ZAYIF 3 KONUN · EKSİKLER'E EKLENDİ</Text>
                    {weak.map(function (w) {
                        return (
                            <View key={w.key} style={st.lineRow}>
                                <View style={{ flex: 1 }}><KonuLink navigation={navigation} kpssData={app.kpssData} ders={w.ders} konu={w.konu} dark={dark} /></View>
                                <Text style={cs.muted}>{w.c}/{w.n}{w.avgC != null ? " · ort. " + L.fmtNet(w.avgC) : ""}</Text>
                            </View>
                        );
                    })}
                </Card>
            ) : null}

            <Card dark={dark} style={{ marginTop: 10 }}>
                <Text style={cs.kicker}>DERS BAZINDA NET</Text>
                {ders.map(function (d) {
                    return (
                        <View key={d.ders} style={st.lineRow}>
                            <Text style={[st.konu, dark && cs.light, { flex: 1 }]}>{d.ders}</Text>
                            <Text style={[cs.body, dark && cs.lightMuted, { marginTop: 0, textAlign: "right" }]}>{d.c}D {d.w}Y {d.b}B · <Text style={{ fontWeight: "800" }}>{L.fmtNet(d.net)}</Text>{d.avgNet != null ? " · ort. " + L.fmtNet(d.avgNet) : ""}
                                {d.top10 != null || d.peers != null ? "\n" + (d.top10 != null ? "ilk %10 " + L.fmtNet(d.top10) : "") + (d.peers != null ? (d.top10 != null ? " · " : "") + "benzer " + L.fmtNet(d.peers) : "") : ""}</Text>
                        </View>
                    );
                })}
                {data.peers || an.top10_n ? <Text style={[cs.muted, { marginTop: 6 }]}>{data.peers ? "Benzer: netin ±5 içindeki " + data.peers.n + " kişinin ortalaması. " : ""}{an.top10_n ? "İlk %10: en yüksek " + an.top10_n + " kişinin ortalaması." : ""}</Text> : null}
            </Card>

            {easy.length ? (
                <Card dark={dark} style={{ marginTop: 10 }}>
                    <Text style={cs.kicker}>ÇOĞUNLUĞUN YAPTIĞI, SENİN KAÇIRDIĞIN SORULAR</Text>
                    <Text style={[cs.body, dark && cs.lightMuted]}>En hızlı puan kazanacağın yer burası.</Text>
                    {easy.map(function (q) {
                        return (
                            <Tap key={q.no} onPress={function () { setFilter("hepsi"); setOpenQ(q.no); }} style={st.lineRow}>
                                <Text style={[cs.body, dark && cs.lightMuted, { marginTop: 0, flex: 1 }]}>Soru {q.no} · {q.ders} / {konuLabel(q.konu)}</Text>
                                <Text style={cs.muted}>doğru oranı %{q.pct} · {q.mine ? "sen " + q.mine : "boş"}</Text>
                            </Tap>
                        );
                    })}
                </Card>
            ) : null}

            {tm.rows.length ? (
                <Card dark={dark} style={{ marginTop: 10 }}>
                    <Text style={cs.kicker}>SORU BAŞINA SÜRE</Text>
                    {tm.rows.map(function (t) {
                        var note = t.ratio == null ? "" : t.ratio > 1.25 ? " · yavaş" : t.ratio < 0.75 ? " · hızlı" : "";
                        return (
                            <View key={t.ders} style={st.lineRow}>
                                <Text style={[st.konu, dark && cs.light, { flex: 1 }]}>{t.ders}</Text>
                                <Text style={[cs.body, dark && cs.lightMuted, { marginTop: 0 }]}>sen {L.fmtSec(t.mine)} · ort. {L.fmtSec(t.avg)}{note}</Text>
                            </View>
                        );
                    })}
                    {tm.slow.length ? <Text style={[cs.kicker, { marginTop: 10 }]}>UZUN SÜRÜP KAÇIRDIKLARIN</Text> : null}
                    {tm.slow.map(function (q) {
                        return (
                            <Tap key={q.no} onPress={function () { setFilter("hepsi"); setOpenQ(q.no); }} style={st.lineRow}>
                                <Text style={[cs.body, dark && cs.lightMuted, { marginTop: 0, flex: 1 }]}>Soru {q.no} · {q.ders}</Text>
                                <Text style={cs.muted}>{L.fmtSec(q.ms)} (ort. {L.fmtSec(q.avg)})</Text>
                            </Tap>
                        );
                    })}
                </Card>
            ) : null}

            <Card dark={dark} style={{ marginTop: 10 }}>
                <Text style={cs.kicker}>KONU BAZINDA</Text>
                {konu.map(function (k) {
                    return (
                        <View key={k.key} style={st.lineRow}>
                            <Text style={[cs.body, dark && cs.lightMuted, { flex: 1, marginTop: 0 }]}>{k.ders} / {konuLabel(k.konu)}</Text>
                            <Text style={[cs.body, dark && cs.lightMuted, { marginTop: 0 }]}><Text style={{ fontWeight: "800" }}>{k.c}/{k.n}</Text>{k.avgC != null ? " · ort. " + L.fmtNet(k.avgC) : ""}</Text>
                        </View>
                    );
                })}
            </Card>

            {review && review.most_wrong && review.most_wrong.length ? (
                <Card dark={dark} style={{ marginTop: 10 }}>
                    <Text style={cs.kicker}>EN ÇOK YANLIŞ YAPILAN 10 SORU</Text>
                    {review.most_wrong.map(function (m) {
                        return (
                            <Tap key={m.no} onPress={function () { setFilter("hepsi"); setOpenQ(m.no); }} style={st.lineRow}>
                                <Text style={[cs.body, dark && cs.lightMuted, { marginTop: 0, flex: 1 }]}>Soru {m.no} · {m.ders} / {konuLabel(m.konu)}</Text>
                                <Text style={cs.muted}>%{pct(m.wrong_pct)} yanlış</Text>
                            </Tap>
                        );
                    })}
                </Card>
            ) : null}

            <View style={{ marginTop: 10 }}>
                <OpticGrid answers={ansMap} keyMap={keyMap} onJump={function (n) { setFilter("hepsi"); setOpenQ(n); }} />
            </View>

            <Card dark={dark} style={{ marginTop: 10 }}>
                <Text style={cs.kicker}>SORU SORU ÇÖZÜMLER</Text>
                <View style={cs.btns}>
                    {[["yanlis", "Yanlışlar"], ["bos", "Boşlar"], ["dogru", "Doğrular"], ["hepsi", "Tümü"]].map(function (f) {
                        return <Chip key={f[0]} dark={dark} primary={filter === f[0]} selected={filter === f[0]} label={f[1]} onPress={function () { setFilter(f[0]); }} />;
                    })}
                </View>
                {shown.map(function (q) {
                    var open = openQ === q.no;
                    var state = !q.mine ? "boş" : (q.mine === q.answer ? "doğru" : "yanlış");
                    var tot = q.stat ? q.stat.correct + q.stat.wrong + q.stat.blank : 0;
                    return (
                        <View key={q.no} style={[st.qItem, dark && st.optDark]}>
                            <Tap onPress={function () { setOpenQ(open ? null : q.no); }} accessibilityState={{ expanded: open }} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <View style={[st.qNo, state === "doğru" && st.qOk, state === "yanlış" && st.qBad]}><Text style={st.qNoTxt}>{q.no}</Text></View>
                                <Text style={[cs.body, dark && cs.lightMuted, { flex: 1, marginTop: 0 }]}>{q.ders} / {konuLabel(q.konu)} · {state}{q.mine ? " (" + q.mine + ")" : ""} · doğru {q.answer}</Text>
                            </Tap>
                            {open ? (
                                <View style={{ marginTop: 8 }}>
                                    <RichBlock text={q.stem} style={[st.stem, dark && cs.light]} />
                                    {images[q.no] ? <Image source={{ uri: images[q.no] }} style={st.img} resizeMode="contain" /> : null}
                                    {(q.options || []).map(function (o, i) {
                                        var l = L.LETTERS[i];
                                        return <Text key={l} style={[st.revOpt, l === q.answer && st.revOk, l === q.mine && l !== q.answer && st.revBad]}>{l}) {rich(o, st.revOpt)}{l === q.answer ? " ✓" : ""}{l === q.mine && l !== q.answer ? " ✗ senin cevabın" : ""}</Text>;
                                    })}
                                    {q.explanation ? <Text style={st.expl}>Çözüm: {rich(q.explanation, st.expl)}</Text> : null}
                                    <Text style={[cs.muted, { marginTop: 6 }]}>
                                        {q.ms ? "Bu soruda " + Math.max(1, Math.round(q.ms / 1000)) + " sn harcadın. " : ""}{tot ? "Katılanlarda doğru oranı %" + pct(100 * q.stat.correct / tot) + "." : ""}
                                    </Text>
                                    <View style={{ marginTop: 6 }}><KonuLink navigation={navigation} kpssData={app.kpssData} ders={q.ders} konu={q.konu} dark={dark} /></View>
                                </View>
                            ) : null}
                        </View>
                    );
                })}
                {!shown.length ? <Text style={[cs.muted, { marginTop: 8 }]}>Bu filtrede soru yok.</Text> : null}
            </Card>
        </ScrollScreen>
    );
}

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
// Net dağılımı (5 netlik dilimler); senin dilimin turuncu ve "Sen" etiketli
function NetHist({ rows, dark }) {
    var W = 340, H = 170, padL = 24, padR = 6, padT = 18, padB = 22;
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; }).concat([1]));
    var bw = (W - padL - padR) / rows.length, every = Math.ceil(rows.length / 6);
    function y(v) { return padT + (H - padT - padB) * (1 - v / max); }
    var ink = dark ? "#c3c2b7" : "#52514e";
    return (
        <Svg width="100%" height={H} viewBox={"0 0 " + W + " " + H} accessibilityLabel="Net dağılımı; senin dilimin işaretli">
            {[0, max].map(function (t) {
                return [<Line key={"l" + t} x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)"} strokeWidth="1" />,
                    <SvgText key={"t" + t} x={padL - 4} y={y(t) + 4} fontSize="10" fill={ink} textAnchor="end">{t}</SvgText>];
            })}
            {rows.map(function (r, i) {
                var x = padL + i * bw + 1, w = Math.max(2, bw - 2), top = y(r.n);
                var col = r.mine ? (dark ? "#d95926" : "#eb6834") : (dark ? "#3987e5" : "#2a78d6");
                return [
                    r.n ? <Rect key={"b" + i} x={x} y={top} width={w} height={H - padB - top} rx="3" fill={col} /> : null,
                    r.mine ? <SvgText key={"m" + i} x={x + w / 2} y={(r.n ? top : H - padB) - 5} fontSize="10" fontWeight="700" fill={ink} textAnchor="middle">Sen</SvgText> : null,
                    i % every === 0 ? <SvgText key={"x" + i} x={x} y={H - 6} fontSize="9" fill={ink}>{r.from}</SvgText> : null
                ];
            })}
        </Svg>
    );
}

function NetChart({ points, dark, series }) {
    var SER = series || SERIES;
    var W = 340, H = 200, padL = 30, padR = 12, padT = 10, padB = 24, max = 120;
    var n = points.length;
    function x(i) { return padL + (n <= 1 ? (W - padL - padR) / 2 : i * (W - padL - padR) / (n - 1)); }
    function y(v) { return padT + (H - padT - padB) * (1 - v / max); }
    var ink = dark ? "#c3c2b7" : "#52514e";
    return (
        <Svg width="100%" height={H} viewBox={"0 0 " + W + " " + H}>
            {[0, 30, 60, 90, 120].map(function (t) {
                return [<Line key={"l" + t} x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)"} strokeWidth="1" />,
                    <SvgText key={"t" + t} x={padL - 4} y={y(t) + 4} fontSize="10" fill={ink} textAnchor="end">{t}</SvgText>];
            })}
            {points.map(function (p, i) { return <SvgText key={"x" + i} x={x(i)} y={H - 6} fontSize="10" fill={ink} textAnchor="middle">{p.label}</SvgText>; })}
            {SER.map(function (s) {
                var col = dark ? s.dark : s.light;
                var d = points.map(function (p, i) { return (i ? "L" : "M") + x(i) + " " + y(p[s.key]); }).join(" ");
                return [<Path key={"p" + s.key} d={d} stroke={col} strokeWidth="2" fill="none" />].concat(points.map(function (p, i) {
                    return <Circle key={s.key + i} cx={x(i)} cy={y(p[s.key])} r="4" fill={col} stroke={dark ? "#1c1917" : "#fff"} strokeWidth="2" />;
                }));
            })}
        </Svg>
    );
}

// ============================================================
// OPTİK OKUTMA (kâğıtta çözenler): fotoğraf → okuma → onay ızgarası → gönder
// Çekim ve okuma optik/optik.html'in aynısında (WebView); onay ve gönderim burada.
// ============================================================
export function LiveOpticScreen({ navigation, route }) {
    var app = useApp();
    var dark = app.dark;
    var examId = route.params && route.params.examId;
    var [dash, setDash] = useState(null);
    var [me, setMe] = useState(null);
    var [stage, setStage] = useState("scan");
    var [read, setRead] = useState(null);
    var [ans, setAns] = useState({});
    var [flags, setFlags] = useState({});
    var [source, setSource] = useState("optic");
    var [edited, setEdited] = useState(0);
    var [manual, setManual] = useState("");
    var [fails, setFails] = useState(0);
    var [err, setErr] = useState("");
    var [busy, setBusy] = useState(false);
    var [, setTick] = useState(0);
    var webRef = useRef(null), clockRef = useRef(null), meRef = useRef(null);

    function load() {
        return C.rpc("live_dashboard", { p_track: C.trackOf(app.student) }).then(function (d) {
            clockRef.current = L.createClock(d.now);
            setDash(d);
        }).catch(function (x) { setErr(x.message); });
    }
    useEffect(function () {
        load();
        C.whoami(app.student).then(function (w) { meRef.current = w; setMe(w); sendExpect(); });
        var t = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1000);
        return function () { clearInterval(t); };
    }, [examId]);
    function sendExpect() {
        if (webRef.current && meRef.current) {
            webRef.current.injectJavaScript("window.optikCmd && window.optikCmd(" + JSON.stringify({ type: "scan", expect: { exam: examId, user: meRef.current.id } }) + "); true;");
        }
    }
    function onMessage(e) {
        var m;
        try { m = JSON.parse(e.nativeEvent.data); } catch (x) { return; }
        if (m.type === "ready") sendExpect();
        else if (m.type === "result") {
            var a = {}, fl = {};
            m.answers.forEach(function (x, i) { a[i + 1] = { c: x }; if (m.flags[i]) fl[i + 1] = m.flags[i]; });
            setRead(m); setAns(a); setFlags(fl); setSource("optic"); setEdited(0); setErr("");
            setTimeout(function () { setStage("confirm"); }, 600);
        } else if (m.type === "fail") {
            setFails(function (x) { return x + 1; });
            C.rpc("live_optic_report", { p_exam: examId, p_kind: m.code === "wrong_form" ? "wrong_form" : "fail",
                p_detail: { code: m.code, size: m.detail && m.detail.size } }).catch(function () {});
        }
    }

    var now = clockRef.current ? clockRef.current.now() : Date.now();
    var exam = dash && dash.exam && dash.exam.id === examId ? dash.exam : null;
    var att = dash && dash.attempt;
    var until = exam ? L.ms(exam.optic_until || exam.ranking_at) : 0;
    var head = <PageHeader dark={dark} title="Optiğimi okut" subtitle={exam && now < until ? "Okutma " + L.fmtClock(until) + "'ta kapanır · " + L.fmtLeft(until - now) : null} onBack={function () { navigation.goBack(); }} right={null} />;

    if (!dash) return <ScrollScreen dark={dark}>{head}<Card dark={dark}><Text style={[cs.body, dark && cs.lightMuted]}>{err || "Yükleniyor…"}</Text></Card></ScrollScreen>;
    var blocker = null;
    if (!exam || !att) blocker = "Bu denemede kâğıt modunda giriş kaydın yok.";
    else if (att.mode !== "paper") blocker = "Bu sınavı cihazda çözüyorsun; optik okutma kâğıtta çözenler içindir.";
    else if (att.submitted && stage !== "sent") blocker = "Optik formun zaten gönderildi; cevapların değişmez.";
    else if (now >= until && stage !== "sent") blocker = "Optik okutma süresi " + L.fmtClock(until) + "'ta doldu.";
    if (blocker) return <ScrollScreen dark={dark}>{head}<Card dark={dark}><Text style={[cs.title, dark && cs.light]}>{blocker}</Text></Card></ScrollScreen>;

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
        msg += "\n\nGönderdikten sonra cevapların değiştirilemez.";
        Alert.alert("Onaylıyor musun?", msg, [
            { text: "Vazgeç", style: "cancel" },
            { text: "Onaylıyorum, gönder", onPress: function () {
                setBusy(true); setErr("");
                C.rpc("live_submit_optic", { p_exam: examId, p_answers: L.answerText(list), p_meta: {
                    source: source, qr: source === "optic" && read ? read.qr : null,
                    flagged: flaggedNos.length, double: doubles.length, uncertain: flaggedNos.length - doubles.length, edited: edited
                } }).then(function () { setBusy(false); setStage("sent"); load(); })
                    .catch(function (x) { setBusy(false); setErr(x.message); });
            } }
        ]);
    }

    if (stage === "sent") {
        var open = exam && now >= L.ms(exam.ends_at);
        return (
            <ScrollScreen dark={dark}>{head}
                <Card dark={dark}>
                    <Text style={[cs.kicker, { color: "#047857" }]}>✓ OPTİK FORMUN GÖNDERİLDİ</Text>
                    <Text style={[cs.body, dark && cs.lightMuted]}>{answered} cevap kaydedildi. Cevapların artık değişmez.{open ? " Sonucun ve çözümlerin açıldı." : " Sonucun ve çözümler " + L.fmtClock(L.ms(exam.ends_at)) + "'te açılır."}</Text>
                    {open ? <View style={cs.btns}><Chip primary label="Sonucumu gör" onPress={function () { navigation.replace("LiveResult", { examId: examId }); }} /></View> : null}
                </Card>
            </ScrollScreen>
        );
    }

    if (stage === "manual") {
        var parsed = L.parseAnswerText(manual, 120);
        return (
            <ScrollScreen dark={dark}>{head}
                <Card dark={dark}>
                    <Text style={cs.kicker}>CEVAPLARINI ELLE GİR</Text>
                    <Text style={[cs.body, dark && cs.lightMuted]}>Optik formundaki cevapları 1'den 120'ye sırayla yaz. Boş bıraktığın sorular için - yaz. Boşluk ve virgüller yok sayılır.</Text>
                    <TextInput value={manual} onChangeText={setManual} multiline autoCapitalize="characters" autoCorrect={false} spellCheck={false}
                        placeholder="ACEBD-A…" placeholderTextColor="#a8a29e" accessibilityLabel="Cevaplar (A–E, boş için -)"
                        style={[st.manual, dark && st.manualDark]} />
                    <Text style={[cs.muted, (parsed.bad.length || parsed.extra) && { color: "#be123c" }]} accessibilityLiveRegion="polite">
                        {parsed.count} / 120 cevap{parsed.bad.length ? " · geçersiz karakter: " + parsed.bad.join(" ") : ""}{parsed.extra ? " · " + parsed.extra + " fazla" : ""}
                    </Text>
                    <View style={cs.btns}>
                        <Chip primary disabled={!parsed.complete} label="Kontrol ekranına geç" onPress={function () {
                            var a = {};
                            parsed.answers.forEach(function (x, j) { a[j + 1] = { c: x }; });
                            setAns(a); setFlags({}); setSource("manual"); setEdited(0); setStage("confirm");
                            C.rpc("live_optic_report", { p_exam: examId, p_kind: "manual_open", p_detail: {} }).catch(function () {});
                        }} />
                        <Chip dark={dark} label="Fotoğrafla okut" onPress={function () { setStage("scan"); }} />
                    </View>
                </Card>
            </ScrollScreen>
        );
    }

    if (stage === "confirm") {
        return (
            <ScrollScreen dark={dark}>{head}
                <Card dark={dark}>
                    <Text style={cs.kicker}>{source === "manual" ? "ELLE GİRDİĞİN CEVAPLAR" : "OKUNAN CEVAPLARINI KONTROL ET"}</Text>
                    <Text style={[cs.title, dark && cs.light]}>{answered} cevap · {120 - answered} boş{flaggedNos.length ? " · " + flaggedNos.length + " satırı kontrol et" : ""}</Text>
                    {source === "optic" && read ? (
                        <Text style={[cs.body, { color: read.qrOk ? "#047857" : "#b45309" }]}>{read.qrOk ? "✓ Karekod okundu: form sana ve bu denemeye ait." : "⚠ Karekod okunamadı; formun sana ait olduğundan emin ol."}</Text>
                    ) : null}
                    {source === "optic" && read ? (read.warnings || []).filter(function (w) { return !/Karekod/.test(w); }).map(function (w) {
                        return <Text key={w} style={[cs.body, { color: "#b45309" }]}>⚠ {w}</Text>;
                    }) : null}
                    <Text style={[cs.body, dark && cs.lightMuted]}>Sarı satır: okuma kararsız; en olası cevap seçili, kontrol et.{"\n"}Kırmızı satır: çift işaret; düzeltmezsen boş gönderilir.{"\n"}Baloncuğa dokunarak cevabı değiştir.</Text>
                    {source === "optic" && read && read.preview ? (
                        <Image source={{ uri: read.preview }} style={st.preview} resizeMode="contain" accessibilityLabel="Okunan optik form: yeşil okunan, sarı kararsız, kırmızı çift işaret" />
                    ) : null}
                </Card>
                <View style={{ marginTop: 12 }}>
                    <OpticGrid answers={ans} flags={flags} onPick={busy ? null : pick} head={source === "manual" ? "ELLE GİRİŞ · KONTROL" : "OKUNAN FORM · KONTROL"} />
                </View>
                {err ? <Text style={cs.warn}>{err}</Text> : null}
                <View style={[cs.btns, { marginBottom: 24 }]}>
                    <Chip primary disabled={busy} label={busy ? "Gönderiliyor…" : "Onaylıyorum, gönder"} onPress={submit} />
                    <Chip dark={dark} disabled={busy} label="Yeniden çek" onPress={function () { setStage("scan"); setRead(null); }} />
                    <Chip dark={dark} disabled={busy} label="Elle düzenle" onPress={function () { setManual(L.answerText(list)); setStage("manual"); }} />
                </View>
            </ScrollScreen>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: dark ? "#0c0a09" : "#F8FAFC" }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>{head}</View>
            <WebView ref={webRef} style={{ flex: 1, backgroundColor: "transparent" }} originWhitelist={["*"]}
                source={{ html: OPTIK_HTML, baseUrl: "https://www.atanly.com/optik/" }}
                injectedJavaScriptBeforeContentLoaded={"window.OPTIK_MODE = 'scan'; window.OPTIK_THEME = '" + (dark ? "dark" : "light") + "'; true;"}
                onMessage={onMessage} javaScriptEnabled domStorageEnabled allowFileAccess mediaCapturePermissionGrantType="grant"
                onContentProcessDidTerminate={function () { if (webRef.current) webRef.current.reload(); }} />
            <View style={{ padding: 16 }}>
                {fails ? <Text style={[cs.body, dark && cs.lightMuted]}>Fotoğraf {fails} kez okunamadı. İpuçlarını deneyebilir ya da cevaplarını elle girebilirsin.</Text> : null}
                <View style={cs.btns}><Chip dark={dark} label="Cevapları elle gir" onPress={function () { setStage("manual"); }} /></View>
            </View>
        </View>
    );
}

export function LiveArchiveScreen({ navigation, route }) {
    var app = useApp();
    var dark = app.dark;
    var [tab, setTab] = useState((route.params && route.params.tab) || "list");
    var [list, setList] = useState(null);
    var [err, setErr] = useState(null);
    useEffect(function () { C.rpc("live_history").then(setList).catch(setErr); }, []);
    // gelişim yalnızca şimdiki kulvardaki denemelerden
    var track = C.trackOf(app.student);
    var mineList = list ? list.filter(function (h) { return h.track === track; }) : null;
    var p = mineList && mineList.length ? L.progress(mineList) : null;
    var vsAvg = p ? p.points.filter(function (x) { return x.avg != null; }) : [];
    return (
        <ScrollScreen dark={dark}>
            <PageHeader dark={dark} title={tab === "list" ? "Denemelerim" : "Gelişimim"} onBack={function () { navigation.goBack(); }} right={null} />
            <View style={[cs.btns, { marginTop: 0, marginBottom: 10 }]}>
                <Chip dark={dark} primary={tab === "list"} selected={tab === "list"} label="Denemelerim" onPress={function () { setTab("list"); }} />
                <Chip dark={dark} primary={tab === "progress"} selected={tab === "progress"} label="Gelişimim" onPress={function () { setTab("progress"); }} />
            </View>
            {err ? <Card dark={dark}><Text style={[cs.body, dark && cs.lightMuted]}>{err.message}</Text></Card> : null}
            {!list && !err ? <Card dark={dark}><Text style={[cs.body, dark && cs.lightMuted]}>Yükleniyor…</Text></Card> : null}
            {list && !list.length ? <Card dark={dark}><Text style={[cs.body, dark && cs.lightMuted]}>Henüz katıldığın bir canlı deneme yok. Her pazar 10:15'te!</Text></Card> : null}
            {list && list.length && tab === "list" ? list.map(function (h) {
                return (
                    <Card key={h.exam_id} dark={dark} style={{ marginBottom: 8 }} onPress={function () { go(navigation, "LiveResult", { examId: h.exam_id }); }}>
                        <Text style={[cs.title, dark && cs.light]}>{h.title}</Text>
                        <Text style={cs.muted}>{L.fmtDate(L.ms(h.starts_at))} · {L.TRACKS[h.track]} · {h.mode === "paper" ? "kâğıt" : "cihaz"}</Text>
                        <Text style={[cs.body, dark && cs.lightMuted]}><Text style={{ fontWeight: "900", fontSize: 18 }}>{L.fmtNet(h.net)}</Text> net · {h.rank ? h.rank + ". / " + h.participants + " · ilk %" + pct(h.top_pct) : "sıralama bekleniyor"}</Text>
                    </Card>
                );
            }) : null}
            {list && list.length && tab === "progress" && list.length !== mineList.length ? (
                <Text style={[cs.muted, { marginBottom: 8 }]}>{L.TRACKS[track]} kulvarındaki denemelerin gösteriliyor; diğer kulvardakiler Denemelerim'de.</Text>
            ) : null}
            {list && list.length && tab === "progress" && !p ? <Card dark={dark}><Text style={[cs.body, dark && cs.lightMuted]}>{L.TRACKS[track]} kulvarında henüz denemen yok.</Text></Card> : null}
            {list && list.length && tab === "progress" && p ? (
                <View>
                    <View style={st.stats}>
                        <Stat dark={dark} big value={p.streak} label="hafta üst üste" />
                        <Stat dark={dark} value={L.fmtNet(p.points[p.points.length - 1].net)} label="son net" />
                    </View>
                    <Card dark={dark} style={{ marginTop: 10 }}>
                        <Text style={cs.kicker}>DENEME DENEME NET</Text>
                        <View style={[cs.btns, { marginTop: 6 }]}>
                            {SERIES.map(function (s) {
                                return <View key={s.key} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dark ? s.dark : s.light }} /><Text style={cs.muted}>{s.label}</Text></View>;
                            })}
                        </View>
                        <NetChart points={p.points} dark={dark} />
                        {p.points.map(function (x) {
                            return <Text key={x.exam_id} style={cs.muted}>{x.label}: toplam {L.fmtNet(x.net)} · GY {L.fmtNet(x.gy)} · GK {L.fmtNet(x.gk)}{x.top_pct != null ? " · ilk %" + pct(x.top_pct) : ""}</Text>;
                        })}
                    </Card>
                    {vsAvg.length ? (
                        <Card dark={dark} style={{ marginTop: 10 }}>
                            <Text style={cs.kicker}>KATILANLARA GÖRE</Text>
                            <Text style={[cs.body, dark && cs.lightMuted]}>Son denemede katılan ortalamasının {vsAvg[vsAvg.length - 1].diff >= 0 ? L.fmtNet(vsAvg[vsAvg.length - 1].diff) + " net üstündesin." : L.fmtNet(-vsAvg[vsAvg.length - 1].diff) + " net altındasın."}</Text>
                            <View style={[cs.btns, { marginTop: 6 }]}>
                                {VS.map(function (s) {
                                    return <View key={s.key} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: dark ? s.dark : s.light }} /><Text style={cs.muted}>{s.label}</Text></View>;
                                })}
                            </View>
                            <NetChart points={vsAvg} dark={dark} series={VS} />
                            {vsAvg.map(function (x) {
                                return <Text key={x.exam_id} style={cs.muted}>{x.label}: sen {L.fmtNet(x.net)} · ort. {L.fmtNet(x.avg)}{x.p50 != null ? " · medyan " + L.fmtNet(x.p50) : ""} · fark {(x.diff >= 0 ? "+" : "") + L.fmtNet(x.diff)}</Text>;
                            })}
                        </Card>
                    ) : null}
                    <Card dark={dark} style={{ marginTop: 10 }}>
                        <Text style={cs.kicker}>DERS BAZINDA</Text>
                        {Object.keys(p.ders).map(function (d) {
                            return <Text key={d} style={[cs.body, dark && cs.lightMuted]}><Text style={{ fontWeight: "800" }}>{d}:</Text> {p.ders[d].map(function (x) { return L.fmtNet(x.net) + (x.avg != null ? " (ort. " + L.fmtNet(x.avg) + ")" : ""); }).join(" → ")}</Text>;
                        })}
                    </Card>
                    <Card dark={dark} style={{ marginTop: 10 }}>
                        <Text style={cs.kicker}>EN ÇOK İLERLEDİĞİN 3 KONU</Text>
                        {p.improved.length ? p.improved.map(function (k) {
                            return <View key={k.ders + k.konu} style={st.lineRow}><View style={{ flex: 1 }}><KonuLink navigation={navigation} kpssData={app.kpssData} ders={k.ders} konu={k.konu} dark={dark} /></View><Text style={cs.muted}>%{Math.round(k.from * 100)} → %{Math.round(k.to * 100)}</Text></View>;
                        }) : <Text style={cs.muted}>İki denemeden sonra görünür.</Text>}
                        <Text style={[cs.kicker, { marginTop: 12 }]}>HÂLÂ TAKILDIĞIN 3 KONU</Text>
                        {p.stuck.length ? p.stuck.map(function (k) {
                            return <View key={k.ders + k.konu} style={st.lineRow}><View style={{ flex: 1 }}><KonuLink navigation={navigation} kpssData={app.kpssData} ders={k.ders} konu={k.konu} dark={dark} /></View><Text style={cs.muted}>son %{Math.round(k.to * 100)}</Text></View>;
                        }) : <Text style={cs.muted}>Takıldığın konu yok.</Text>}
                    </Card>
                </View>
            ) : null}
        </ScrollScreen>
    );
}

var st = StyleSheet.create({
    bar: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(28,25,23,0.1)", marginBottom: 8 },
    barDark: { backgroundColor: "#1c1917", borderColor: "rgba(255,255,255,0.1)" },
    sync: { fontSize: 12, fontWeight: "700", marginTop: 2 },
    timer: { fontSize: 24, fontWeight: "900", color: "#0D2C4D", fontVariant: ["tabular-nums"] },
    stem: { fontSize: 16, fontWeight: "700", color: "#1C1917", lineHeight: 23, marginTop: 6 },
    img: { width: "100%", aspectRatio: 1.6, marginTop: 10, backgroundColor: "#fff", borderRadius: 12 },
    opt: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderColor: "#E7E5E4", backgroundColor: "#fff", marginTop: 8 },
    optDark: { backgroundColor: "#1c1917", borderColor: "#44403c" },
    optOn: { backgroundColor: "#0D2C4D", borderColor: "#0D2C4D" },
    optTxt: { flex: 1, fontSize: 15, fontWeight: "600", color: "#1C1917" },
    letter: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: "#1c1917", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    letterOn: { borderColor: "#fff" },
    letterTxt: { fontWeight: "800", color: "#1c1917" },
    stats: { flexDirection: "row", gap: 8, marginTop: 8 },
    stat: { flex: 1, alignItems: "center", padding: 12, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(28,25,23,0.08)" },
    statDark: { backgroundColor: "#1c1917", borderColor: "#44403c" },
    statBig: { fontSize: 30, fontWeight: "900", color: "#0F172A" },
    statNum: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
    statLab: { fontSize: 11, color: "#78716C", marginTop: 2, textAlign: "center" },
    lineRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(120,113,108,0.3)" },
    konu: { fontSize: 13, fontWeight: "700", color: "#1C1917" },
    qItem: { padding: 10, borderRadius: 14, borderWidth: 1, borderColor: "#E7E5E4", marginTop: 8, backgroundColor: "#fff" },
    qNo: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#E7E5E4" },
    qOk: { backgroundColor: "#d1fae5" },
    qBad: { backgroundColor: "#ffe4e6" },
    qNoTxt: { fontWeight: "800", fontSize: 13, color: "#1C1917" },
    revOpt: { fontSize: 14, padding: 8, borderRadius: 10, borderWidth: 1, borderColor: "#E7E5E4", marginTop: 6, color: "#1C1917", backgroundColor: "#fff" },
    revOk: { backgroundColor: "#ecfdf5", borderColor: "#6ee7b7" },
    revBad: { backgroundColor: "#fff1f2", borderColor: "#fda4af" },
    expl: { marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: "#fffbeb", color: "#44403C", fontSize: 14, lineHeight: 20 },
    sheet: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#111827", borderRadius: 6, padding: 10 },
    sheetHead: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 2, borderBottomColor: "#111827", paddingBottom: 6 },
    sheetHeadTxt: { fontSize: 10, fontWeight: "800", letterSpacing: 1, color: "#111827" },
    opTitle: { fontSize: 10, fontWeight: "800", letterSpacing: 1, color: "#111827", marginBottom: 4 },
    opRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 3, paddingHorizontal: 2, borderRadius: 6 },
    opRowCur: { backgroundColor: "#fef3c7" },
    manual: { marginTop: 10, minHeight: 110, borderWidth: 1, borderColor: "#d6d3d1", borderRadius: 14, padding: 12, fontSize: 15, letterSpacing: 2, color: "#0f172a", backgroundColor: "#fff", textAlignVertical: "top", fontFamily: "monospace" },
    manualDark: { backgroundColor: "#1c1917", borderColor: "#44403c", color: "#f5f5f4" },
    preview: { width: "100%", height: 320, marginTop: 10, borderRadius: 12, backgroundColor: "#e7e5e4" },
    opFlagU: { backgroundColor: "#fef3c7", borderLeftWidth: 3, borderLeftColor: "#d97706" },
    opFlagD: { backgroundColor: "#ffe4e6", borderLeftWidth: 3, borderLeftColor: "#e11d48" },
    opRowSep: { borderBottomWidth: 1, borderBottomColor: "#9ca3af", borderStyle: "dashed" },
    opNoWrap: { width: 34, alignItems: "flex-end", paddingRight: 4 },
    opNo: { fontSize: 13, fontWeight: "800", color: "#111827" },
    bub: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: "#111827", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    bubOn: { backgroundColor: "#111827" },
    bubKey: { borderColor: "#10b981", borderWidth: 3 },
    bubWrong: { backgroundColor: "#e11d48", borderColor: "#e11d48" },
    bubTxt: { fontSize: 12, fontWeight: "700", color: "#111827" }
});
