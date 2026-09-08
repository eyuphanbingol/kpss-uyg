import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useApp } from "../AppProvider";
import { GamesEngine } from "../lib/gamesEngine";
import { MapQuiz } from "../lib/mapQuiz";
import { StudentStore } from "../lib/store";
import { Card, PrimaryButton, ScrollScreen, BackChip, Tap, Screen } from "../ui";
import { colors } from "../lib/theme";
import { TrMapView } from "../components/TrMapView";
import { useLandscapeLock } from "../lib/useLandscapeLock";

export function ConquerPlayScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var win = useWindowDimensions();
    useLandscapeLock();
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
        var landscape = win.width > win.height;
        return (
            <Screen dark={isDark} style={{ overflow: "hidden" }} edges={["top", "right", "bottom", "left"]}>
                <View style={{ flex: 1, minHeight: 0, minWidth: 0, paddingHorizontal: 12, paddingTop: 4, overflow: "hidden", flexDirection: landscape ? "row" : "column", gap: 10 }}>
                    <View style={{ flex: landscape ? 0.46 : 0.36, minHeight: 0, minWidth: 0, overflow: "hidden" }}>
                        <BackChip dark={isDark} label="Harita" onPress={function () { setQuiz(null); }} />
                        <Text style={[styles.kicker, isDark && styles.muted]} numberOfLines={1}>{GamesEngine.regionTitle(quiz.code)}</Text>
                        <Text style={[styles.title, { fontSize: landscape ? 18 : 24, marginBottom: 4 }, isDark && styles.light]} numberOfLines={1}>{GamesEngine.nameOf(quiz.code)}</Text>
                        <View style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" }}>
                            <TrMapView mode="conquer" owned={owned} pick={quiz.code} locked={true} color="#127880" />
                        </View>
                    </View>
                    <ScrollView style={{ flex: 1, minHeight: 0, minWidth: 0 }} contentContainerStyle={{ paddingBottom: 16 }} keyboardShouldPersistTaps="always" delaysContentTouches={false}>
                        <Text style={[styles.meta, isDark && styles.muted]}>Soru {quiz.i + 1} / {quiz.items.length} · hepsini art arda bil</Text>
                        <View style={{ height: 8, borderRadius: 99, backgroundColor: isDark ? "#292524" : "#E7E5E4", overflow: "hidden", marginTop: 10, marginBottom: 16 }}>
                            <View style={{ height: 8, width: (quiz.items.length ? Math.round(((quiz.i + (quiz.ok ? 1 : 0)) / quiz.items.length) * 100) : 0) + "%", backgroundColor: "#127880", borderRadius: 99 }} />
                        </View>
                        {quiz.fail ? (
                            <Card style={isDark && styles.cardDark}>
                                <Text style={styles.bad}>İl alınamadı</Text>
                                <Text style={[styles.meta, { marginTop: 8 }]}>Yanlışta fetih sıfırlanır. Baştan dene.</Text>
                                <PrimaryButton title="Tekrar dene" onPress={function () { start(quiz.code); }} style={{ marginTop: 12 }} />
                            </Card>
                        ) : qNow ? (
                            <Card style={isDark && styles.cardDark}>
                                <Text style={[styles.prompt, isDark && styles.light]}>{qNow.question}</Text>
                                {(qNow.options || []).map(function (opt, i) {
                                    var marked = quiz.picked && (String(opt) === String(qNow.correct) ? styles.ok : (quiz.picked === opt ? styles.no : null));
                                    return (
                                        <Tap key={i} disabled={!!quiz.picked} onPress={function () { answer(opt); }}
                                            style={[styles.choice, isDark && styles.cardDark, marked]}>
                                            <Text style={[styles.choiceText, isDark && styles.light]}>{opt}</Text>
                                        </Tap>
                                    );
                                })}
                                {quiz.picked ? <PrimaryButton title={quiz.ok ? "Devam" : "Sonuç"} onPress={next} style={{ marginTop: 14 }} /> : null}
                            </Card>
                        ) : null}
                    </ScrollView>
                </View>
            </Screen>
        );
    }

    var landscapeHome = win.width > win.height;
    return (
        <Screen dark={isDark} style={{ overflow: "hidden" }} edges={["top", "right", "bottom", "left"]}>
            <View style={{ flex: 1, minHeight: 0, minWidth: 0, paddingHorizontal: 12, paddingTop: 4, overflow: "hidden" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <BackChip dark={isDark} label="Alıştırmalar" onPress={function () { navigation.goBack(); }} />
                    <Text style={[styles.title, { flex: 1, fontSize: landscapeHome ? 18 : 24, marginBottom: 0 }, isDark && styles.light]} numberOfLines={1}>Türkiye'yi Fethet</Text>
                </View>
                <Text style={[styles.meta, isDark && styles.muted]} numberOfLines={1}>{nOwn}/{codes.length} il boyandı · bölge bitince rozet</Text>
                <View style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden", marginTop: 4 }}>
                    <TrMapView
                        mode="conquer"
                        owned={owned}
                        pick={null}
                        color="#127880"
                        onProvince={function (code) { start(code); }}
                    />
                </View>
                <Text style={[styles.meta, isDark && styles.muted, { marginTop: 6 }]} numberOfLines={1}>Haritada ile bas. Fethedilen iller teal boyanır.</Text>
                <View style={{ height: 8, borderRadius: 99, backgroundColor: isDark ? "#292524" : "#E7E5E4", overflow: "hidden", marginTop: 8, flexShrink: 0 }}>
                    <View style={{ height: 8, width: (codes.length ? Math.round((nOwn / codes.length) * 100) : 0) + "%", backgroundColor: "#127880", borderRadius: 99 }} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, flexShrink: 0 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} delaysContentTouches={false} contentContainerStyle={{ gap: 6, paddingRight: 8 }} style={{ flex: 1 }}>
                        {regions.map(function (r) {
                            return (
                                <View key={r.id} style={{ backgroundColor: r.done ? "#D1FAE5" : (isDark ? "#292524" : "#EEF2EF"), borderRadius: 999, paddingVertical: 5, paddingHorizontal: 10 }}>
                                    <Text style={{ fontSize: 10, fontWeight: "700", color: r.done ? "#047857" : colors.muted }}>{r.done ? "🏅 " : ""}{r.title} {r.have}/{r.total}</Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                    {nOwn > 0 ? (
                        <Tap
                            onPress={function () {
                                Alert.alert("Haritayı sıfırla", "Boyanan iller ve bölge rozetleri silinsin mi?", [
                                    { text: "Vazgeç", style: "cancel" },
                                    { text: "Sıfırla", style: "destructive", onPress: function () { StudentStore.resetConquer(); } }
                                ]);
                            }}
                            style={{ marginLeft: 8, backgroundColor: "#FFF1F2", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 }}
                        >
                            <Text style={{ color: "#9F1239", fontWeight: "800" }}>Sıfırla</Text>
                        </Tap>
                    ) : null}
                </View>
            </View>
        </Screen>
    );
}

export function TabuPlayScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var seedState = useState(0);
    var seed = seedState[0];
    var setSeed = seedState[1];
    var deck = useMemo(function () {
        try {
            return GamesEngine.tabuDeck(12, app.kpssData) || [];
        } catch (e) {
            return [];
        }
    }, [seed, app.kpssData]);
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
                <BackChip dark={isDark} label="Alıştırmalar" onPress={function () { navigation.goBack(); }} />
                <Card style={[styles.result, isDark && styles.cardDark]}>
                    <Text style={[styles.pct, isDark && styles.light]}>{score}</Text>
                    <Text style={[styles.meta, isDark && styles.muted]}>Rekor: {Math.max(score, best)}</Text>
                    <PrimaryButton title="Yeniden" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
                </Card>
            </ScrollScreen>
        );
    }

    if (!deck.length) {
        return (
            <ScrollScreen dark={isDark}>
                <BackChip dark={isDark} label="Alıştırmalar" onPress={function () { navigation.goBack(); }} />
                <Text style={[styles.title, isDark && styles.light]}>Tabu</Text>
                <Text style={[styles.meta, isDark && styles.muted]}>Kartlar yüklenemedi. Tekrar dene.</Text>
                <PrimaryButton title="Yeniden dene" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
            </ScrollScreen>
        );
    }

    return (
        <ScrollScreen dark={isDark}>
            <BackChip dark={isDark} label="Alıştırmalar" onPress={function () { navigation.goBack(); }} />
            <Text style={[styles.kicker, isDark && styles.muted]}>{score} puan · {i + 1}/{deck.length} · az ipucu daha çok puan</Text>
            <Text style={[styles.meta, { marginBottom: 6 }]}>{card && card.topic ? card.topic : "KPSS"}</Text>
            <Text style={[styles.title, isDark && styles.light]}>Bu hangi kavram?</Text>
            <View style={styles.mystery}>
                <Text style={styles.mysteryText}>{picked && card ? card.answer : "?"}</Text>
            </View>
            <View style={styles.clueCol}>
                {(card && card.clues ? card.clues : []).map(function (cl, ci) {
                    var shown = ci < open;
                    var canOpen = !picked && !shown && ci === open;
                    return (
                        <Tap key={ci} disabled={!!picked || shown || ci !== open} onPress={function () { if (canOpen) setOpen(open + 1); }}
                            style={[styles.clue, shown && styles.clueOpen]}>
                            <Text style={styles.meta}>{ci + 1}. ipucu{ci === 0 ? " · açık" : shown ? "" : ci === open ? " · dokun" : " · kilit"}</Text>
                            <Text style={[styles.choiceText, isDark && styles.light]}>{shown ? cl : (ci === open ? "Bir ipucu daha aç" : "Kilitli")}</Text>
                        </Tap>
                    );
                })}
            </View>
            <Text style={[styles.meta, { marginBottom: 8 }]}>Şu an {GamesEngine.tabuPoints(open)} puan</Text>
            {(card && card.choices ? card.choices : []).map(function (opt, oi) {
                var marked = picked && (String(opt) === String(card.answer) ? styles.ok : (picked === opt ? styles.no : null));
                return (
                    <Tap key={oi} disabled={!!picked} onPress={function () { choose(opt); }}
                        style={[styles.choice, isDark && styles.cardDark, marked]}>
                        <Text style={[styles.choiceText, isDark && styles.light]}>{opt}</Text>
                    </Tap>
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
    var PANIC_MS = 30000;
    var msState = useState(PANIC_MS);
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
    var live = useRef({ ms: PANIC_MS, score: 0, i: 0 });
    var best = ((app.student && app.student.games) || {}).panicBest || 0;

    useEffect(function () {
        live.current = { ms: PANIC_MS, score: 0, i: 0 };
        setMs(PANIC_MS); setI(0); setScore(0); setOver(false); setMissed([]);
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
                <BackChip dark={isDark} label="Alıştırmalar" onPress={function () { navigation.goBack(); }} />
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
            <BackChip dark={isDark} label="Alıştırmalar" onPress={function () { navigation.goBack(); }} />
            <Text style={[styles.kicker, isDark && styles.muted]}>Son 30 saniye · doğru +2 · yanlış −3</Text>
            <Text style={[styles.timer, isDark && styles.light]}>{Math.max(0, ms / 1000).toFixed(1)}</Text>
            <View style={[styles.stem, isDark && styles.stemDark]}>
                <Text style={[styles.stemText, isDark && styles.light]}>{q ? q.q : ""}</Text>
            </View>
            {(q && q.choices || []).map(function (opt, oi) {
                return (
                    <Tap key={oi} onPress={function () { choose(opt); }} style={[styles.choice, styles.choiceRow, isDark && styles.cardDark]}>
                        <Text style={[styles.letter, isDark && styles.letterDark]}>{String.fromCharCode(65 + oi)}</Text>
                        <Text style={[styles.choiceText, isDark && styles.light, { flex: 1 }]}>{opt}</Text>
                    </Tap>
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
    choiceRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    choiceText: { fontWeight: "700", color: colors.text, lineHeight: 21 },
    letter: {
        width: 28, height: 28, borderRadius: 14, backgroundColor: "#F5F5F4", color: "#0D2C4D",
        fontSize: 12, fontWeight: "900", textAlign: "center", lineHeight: 28, overflow: "hidden"
    },
    letterDark: { backgroundColor: "#292524", color: "#F6F1E4" },
    stem: {
        backgroundColor: "#F6F1E4", borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16,
        marginTop: 8, marginBottom: 6, borderLeftWidth: 4, borderLeftColor: "#C5A059"
    },
    stemDark: { backgroundColor: "#1C2420" },
    stemText: { fontSize: 16, fontWeight: "800", color: colors.text, lineHeight: 24 },
    ok: { backgroundColor: "#ECFDF5", borderColor: "#34D399" },
    no: { backgroundColor: "#FFF1F2", borderColor: "#FB7185" },
    bad: { color: "#E11D48", fontWeight: "800" },
    rowCard: { marginTop: 6, paddingVertical: 12 },
    result: { alignItems: "center", paddingVertical: 28 },
    pct: { fontSize: 48, fontWeight: "800", color: colors.navy },
    mystery: { alignItems: "center", justifyContent: "center", paddingVertical: 28, backgroundColor: "#041C24", marginVertical: 10, borderRadius: 18, width: "100%" },
    mysteryText: { color: "#F5EBC7", fontSize: 28, fontWeight: "900" },
    clueCol: { width: "100%", marginBottom: 8 },
    clue: { width: "100%", borderWidth: 1, borderStyle: "dashed", borderColor: "#D6D3D1", borderRadius: 12, padding: 12, minHeight: 64, marginBottom: 8 },
    clueLead: { width: "100%" },
    clueOpen: { backgroundColor: "#ECFDF5", borderStyle: "solid", borderColor: "#34D399" },
    timer: { fontSize: 52, fontWeight: "900", color: colors.navy, marginVertical: 6 }
});
