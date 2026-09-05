import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { GamesEngine } from "../lib/gamesEngine";
import { MapQuiz } from "../lib/mapQuiz";
import { StudentStore } from "../lib/store";
import { Card, PrimaryButton, ScrollScreen } from "../ui";
import { colors } from "../lib/theme";

export function ConquerPlayScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var games = (app.student && app.student.games) || {};
    var owned = games.conquer || {};
    var [quiz, setQuiz] = useState(null);
    var regions = useMemo(function () { return GamesEngine.regionProgress(owned); }, [owned]);
    var codes = useMemo(function () { return GamesEngine.allCodes(); }, []);
    var nOwn = GamesEngine.conqueredCount(owned);

    function start(code) {
        if (owned[code]) return;
        setQuiz({ code: code, items: GamesEngine.quizForProvince(code, app.kpssData), i: 0, picked: null, ok: null, fail: false });
    }

    function answer(opt) {
        if (!quiz || quiz.picked || quiz.fail) return;
        var q = quiz.items[quiz.i];
        setQuiz(Object.assign({}, quiz, { picked: opt, ok: String(opt) === String(q.correct) }));
    }

    function next() {
        if (!quiz) return;
        if (!quiz.ok) {
            setQuiz(Object.assign({}, quiz, { fail: true }));
            return;
        }
        if (quiz.i + 1 >= quiz.items.length) {
            StudentStore.conquerProvince(quiz.code);
            setQuiz(null);
            return;
        }
        setQuiz({ code: quiz.code, items: quiz.items, i: quiz.i + 1, picked: null, ok: null, fail: false });
    }

    if (quiz) {
        var qNow = quiz.items[quiz.i];
        return (
            <ScrollScreen dark={isDark}>
                <Pressable onPress={function () { setQuiz(null); }}>
                    <Text style={[styles.back, isDark && styles.muted]}>← Harita</Text>
                </Pressable>
                <Text style={[styles.title, isDark && styles.light]}>{GamesEngine.nameOf(quiz.code)}</Text>
                <Text style={[styles.meta, isDark && styles.muted]}>3'te 3 doğru ile fethet · {quiz.i + 1}/3</Text>
                {quiz.fail ? (
                    <Card style={isDark && styles.cardDark}>
                        <Text style={styles.bad}>İl fethedilemedi.</Text>
                        <PrimaryButton title="Tekrar dene" onPress={function () { start(quiz.code); }} style={{ marginTop: 12 }} />
                    </Card>
                ) : qNow ? (
                    <Card style={isDark && styles.cardDark}>
                        <Text style={[styles.prompt, isDark && styles.light]}>{qNow.question}</Text>
                        {(qNow.options || []).map(function (opt, i) {
                            var marked = quiz.picked && (String(opt) === String(qNow.correct) ? styles.ok : (quiz.picked === opt ? styles.no : null));
                            return (
                                <Pressable key={i} disabled={!!quiz.picked} onPress={function () { answer(opt); }}
                                    style={[styles.choice, isDark && styles.cardDark, marked]}>
                                    <Text style={[styles.choiceText, isDark && styles.light]}>{opt}</Text>
                                </Pressable>
                            );
                        })}
                        {quiz.picked ? <PrimaryButton title={quiz.ok ? "Devam" : "Sonuç"} onPress={next} style={{ marginTop: 14 }} /> : null}
                    </Card>
                ) : null}
            </ScrollScreen>
        );
    }

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.muted]}>← Alıştırmalar</Text>
            </Pressable>
            <Text style={[styles.title, isDark && styles.light]}>Türkiye'yi Fethet</Text>
            <Text style={[styles.meta, isDark && styles.muted]}>{nOwn}/{codes.length} il · bölge bitince rozet</Text>
            {regions.map(function (r) {
                return (
                    <View key={r.id} style={{ marginTop: 12 }}>
                        <Text style={[styles.kicker, isDark && styles.muted]}>{r.done ? "🏅 " : ""}{r.title} {r.have}/{r.total}</Text>
                        {codes.filter(function (c) { return MapQuiz.PROVINCE_REGION[c] === r.id; }).map(function (code) {
                            var mine = !!owned[code];
                            return (
                                <Pressable key={code} onPress={function () { start(code); }}>
                                    <Card style={[styles.rowCard, isDark && styles.cardDark, mine && { backgroundColor: "#ECFDF5" }]}>
                                        <Text style={[styles.choiceText, isDark && styles.light]}>{mine ? "✓ " : ""}{GamesEngine.nameOf(code)}</Text>
                                    </Card>
                                </Pressable>
                            );
                        })}
                    </View>
                );
            })}
        </ScrollScreen>
    );
}

export function TabuPlayScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var seedState = useState(0);
    var seed = seedState[0];
    var setSeed = seedState[1];
    var deck = useMemo(function () { return GamesEngine.tabuDeck(12, app.kpssData); }, [seed]);
    var iState = useState(0);
    var i = iState[0];
    var setI = iState[1];
    var openState = useState(1);
    var open = openState[0];
    var setOpen = openState[1];
    var pickedState = useState(null);
    var picked = pickedState[0];
    var setPicked = pickedState[1];
    var scoreState = useState(0);
    var score = scoreState[0];
    var setScore = scoreState[1];
    var doneState = useState(false);
    var done = doneState[0];
    var setDone = doneState[1];
    var card = deck[i];
    var best = ((app.student && app.student.games) || {}).tabuBest || 0;

    useEffect(function () {
        setI(0); setOpen(1); setPicked(null); setScore(0); setDone(false);
    }, [seed]);

    function choose(opt) {
        if (picked || !card) return;
        var ok = String(opt) === String(card.answer);
        setPicked(opt);
        if (ok) setScore(score + GamesEngine.tabuPoints(open));
    }

    function next() {
        if (i + 1 >= deck.length) {
            StudentStore.noteTabuBest(score);
            setDone(true);
            return;
        }
        setI(i + 1); setOpen(1); setPicked(null);
    }

    if (done) {
        return (
            <ScrollScreen dark={isDark}>
                <Pressable onPress={function () { navigation.goBack(); }}>
                    <Text style={[styles.back, isDark && styles.muted]}>← Alıştırmalar</Text>
                </Pressable>
                <Card style={[styles.result, isDark && styles.cardDark]}>
                    <Text style={[styles.pct, isDark && styles.light]}>{score}</Text>
                    <Text style={[styles.meta, isDark && styles.muted]}>Rekor: {Math.max(score, best)}</Text>
                    <PrimaryButton title="Yeniden" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
                </Card>
            </ScrollScreen>
        );
    }

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.muted]}>← Alıştırmalar</Text>
            </Pressable>
            <Text style={[styles.kicker, isDark && styles.muted]}>Tabu · {score} puan · {i + 1}/{deck.length} · ilk ipucu açık</Text>
            <Text style={[styles.title, isDark && styles.light]}>Bu hangi kavram?</Text>
            <Card style={[styles.mystery, isDark && styles.cardDark]}>
                <Text style={styles.mysteryText}>{picked ? card.answer : "?"}</Text>
            </Card>
            <View style={styles.clueWrap}>
                {(card && card.clues || []).map(function (cl, ci) {
                    var shown = ci < open;
                    return (
                        <Pressable key={ci} disabled={!!picked || shown || ci !== open} onPress={function () { setOpen(open + 1); }}
                            style={[styles.clue, ci === 0 && styles.clueLead, shown && styles.clueOpen]}>
                            <Text style={styles.meta}>İpucu {ci + 1}{ci === 0 ? " · açık" : ""}</Text>
                            <Text style={[styles.choiceText, isDark && styles.light]}>{shown ? cl : (ci === open ? "Ek ipucu aç" : "Kilit")}</Text>
                        </Pressable>
                    );
                })}
            </View>
            <Text style={[styles.meta, { marginBottom: 8 }]}>{GamesEngine.tabuPoints(open)} puan</Text>
            {(card && card.choices || []).map(function (opt, oi) {
                var marked = picked && (String(opt) === String(card.answer) ? styles.ok : (picked === opt ? styles.no : null));
                return (
                    <Pressable key={oi} disabled={!!picked} onPress={function () { choose(opt); }}
                        style={[styles.choice, isDark && styles.cardDark, marked]}>
                        <Text style={[styles.choiceText, isDark && styles.light]}>{opt}</Text>
                    </Pressable>
                );
            })}
            {picked ? <PrimaryButton title={i + 1 >= deck.length ? "Bitir" : "Sonraki"} onPress={next} style={{ marginTop: 14 }} /> : null}
        </ScrollScreen>
    );
}

export function PanicPlayScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var seedState = useState(0);
    var seed = seedState[0];
    var setSeed = seedState[1];
    var deck = useMemo(function () { return GamesEngine.panicDeck(app.kpssData); }, [seed]);
    var iState = useState(0);
    var i = iState[0];
    var setI = iState[1];
    var msState = useState(10000);
    var ms = msState[0];
    var setMs = msState[1];
    var scoreState = useState(0);
    var score = scoreState[0];
    var setScore = scoreState[1];
    var overState = useState(false);
    var over = overState[0];
    var setOver = overState[1];
    var missedState = useState([]);
    var missed = missedState[0];
    var setMissed = missedState[1];
    var live = useRef({ ms: 10000, score: 0, i: 0 });
    var best = ((app.student && app.student.games) || {}).panicBest || 0;

    useEffect(function () {
        live.current = { ms: 10000, score: 0, i: 0 };
        setMs(10000); setI(0); setScore(0); setOver(false); setMissed([]);
    }, [seed]);

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
                setOver(true);
                StudentStore.notePanicBest(live.current.score);
            }
        }, 80);
        return function () { clearInterval(id); };
    }, [i, over, seed]);

    function choose(opt) {
        if (over || !deck.length) return;
        var q = deck[i % deck.length];
        var ok = String(opt) === String(q.a);
        if (ok) {
            live.current.score += 1;
            setScore(live.current.score);
            live.current.ms = Math.max(0, live.current.ms + 2000);
        } else {
            setMissed(function (prev) { return prev.concat([{ q: q.q, picked: opt, a: q.a }]); });
            live.current.ms = Math.max(0, live.current.ms - 3000);
        }
        setMs(live.current.ms);
        if (live.current.ms <= 0) {
            setOver(true);
            StudentStore.notePanicBest(live.current.score);
            return;
        }
        live.current.i += 1;
        setI(live.current.i);
    }

    var q = deck.length ? deck[i % deck.length] : null;

    if (over) {
        return (
            <ScrollScreen dark={isDark}>
                <Pressable onPress={function () { navigation.goBack(); }}>
                    <Text style={[styles.back, isDark && styles.muted]}>← Alıştırmalar</Text>
                </Pressable>
                <Card style={[styles.result, isDark && styles.cardDark]}>
                    <Text style={[styles.pct, isDark && styles.light]}>{score}</Text>
                    <Text style={[styles.meta, isDark && styles.muted]}>Rekor: {Math.max(score, best)}</Text>
                    {missed.length ? (
                        <View style={{ width: "100%", marginTop: 16 }}>
                            <Text style={[styles.bad, { marginBottom: 8 }]}>Yanlış {missed.length} soru</Text>
                            {missed.map(function (w, wi) {
                                return (
                                    <View key={wi} style={[styles.choice, styles.no, { marginTop: 8 }]}>
                                        <Text style={[styles.choiceText, isDark && styles.light]}>{w.q}</Text>
                                        <Text style={styles.bad}>Senin: {w.picked}</Text>
                                        <Text style={{ color: "#059669", fontWeight: "700", marginTop: 4 }}>Doğru: {w.a}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <Text style={[styles.meta, { marginTop: 12, color: "#059669" }]}>Bu turda yanlışın yok.</Text>
                    )}
                    <PrimaryButton title="Tekrar oyna" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
                </Card>
            </ScrollScreen>
        );
    }

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.muted]}>← Alıştırmalar</Text>
            </Pressable>
            <Text style={[styles.kicker, isDark && styles.muted]}>Son 10 saniye · doğru +2 · yanlış −3</Text>
            <Text style={[styles.timer, isDark && styles.light]}>{Math.max(0, ms / 1000).toFixed(1)}</Text>
            <Text style={[styles.title, isDark && styles.light]}>{q ? q.q : ""}</Text>
            {(q && q.choices || []).map(function (opt, oi) {
                return (
                    <Pressable key={oi} onPress={function () { choose(opt); }} style={[styles.choice, isDark && styles.cardDark]}>
                        <Text style={[styles.choiceText, isDark && styles.light]}>{opt}</Text>
                    </Pressable>
                );
            })}
            <Text style={[styles.meta, isDark && styles.muted, { marginTop: 12 }]}>{score} doğru · rekor {best}</Text>
        </ScrollScreen>
    );
}

var styles = StyleSheet.create({
    back: { color: colors.muted, fontWeight: "700", marginBottom: 8 },
    title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 4 },
    meta: { fontSize: 13, color: colors.muted, fontWeight: "600" },
    kicker: { fontSize: 12, fontWeight: "800", letterSpacing: 0.4, color: colors.muted, textTransform: "uppercase", marginBottom: 6 },
    light: { color: "#fff" },
    muted: { color: "#A8A29E" },
    cardDark: { backgroundColor: colors.navyDeep },
    prompt: { fontSize: 16, lineHeight: 24, fontWeight: "700", color: colors.text, marginBottom: 10 },
    choice: { borderWidth: 1, borderColor: "#E7E5E4", borderRadius: 14, padding: 14, marginTop: 8 },
    choiceText: { fontWeight: "700", color: colors.text },
    ok: { backgroundColor: "#ECFDF5", borderColor: "#34D399" },
    no: { backgroundColor: "#FFF1F2", borderColor: "#FB7185" },
    bad: { color: "#E11D48", fontWeight: "800" },
    rowCard: { marginTop: 6, paddingVertical: 12 },
    result: { alignItems: "center", paddingVertical: 28 },
    pct: { fontSize: 48, fontWeight: "800", color: colors.navy },
    mystery: { alignItems: "center", paddingVertical: 20, backgroundColor: "#111", marginVertical: 10 },
    mysteryText: { color: "#F5E9C0", fontSize: 24, fontWeight: "900" },
    clueWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
    clue: { width: "47%", flexGrow: 1, borderWidth: 1, borderStyle: "dashed", borderColor: "#D6D3D1", borderRadius: 12, padding: 10, minHeight: 72 },
    clueLead: { width: "100%" },
    clueOpen: { backgroundColor: "#ECFDF5", borderStyle: "solid", borderColor: "#34D399" },
    timer: { fontSize: 52, fontWeight: "900", color: colors.navy, marginVertical: 6 }
});
