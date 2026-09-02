import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { StudentStore } from "../lib/store";
import { confirmQuit, PrimaryButton, Screen, ScrollScreen } from "../ui";
import { colors } from "../lib/theme";

export default function TestScreen({ route, navigation }) {
    var items = route.params.items || [];
    var mode = route.params.mode || "topic";
    var seconds = route.params.seconds || null;
    var ders = route.params.ders;
    var konu = route.params.konu;
    var _i = useState(0);
    var qIndex = _i[0];
    var setQIndex = _i[1];
    var _picked = useState(null);
    var picked = _picked[0];
    var setPicked = _picked[1];
    var _ans = useState(false);
    var answered = _ans[0];
    var setAnswered = _ans[1];
    var scoreRef = useRef(0);
    var _score = useState(0);
    var score = _score[0];
    var setScore = _score[1];
    var _done = useState(false);
    var done = _done[0];
    var setDone = _done[1];
    var startedAt = useRef(Date.now());
    var finishedRef = useRef(false);
    var _left = useState(seconds);
    var left = _left[0];
    var setLeft = _left[1];

    useEffect(function () {
        if (left == null || done) return;
        if (left <= 0) { finish(); return; }
        var t = setTimeout(function () { setLeft(left - 1); }, 1000);
        return function () { clearTimeout(t); };
    }, [left, done]);

    function finish() {
        if (finishedRef.current) return;
        finishedRef.current = true;
        var elapsedMin = Math.max(0, Math.round((Date.now() - startedAt.current) / 60000));
        if (mode === "topic" && ders && konu) {
            StudentStore.recordTestResult(ders, konu, { correct: scoreRef.current, total: items.length, minutes: elapsedMin });
        } else if (elapsedMin) {
            StudentStore.addSessionStats({ minutes: elapsedMin, seans: true, ders: ders || null });
        }
        if (mode === "exam") {
            StudentStore.recordExamAttempt({ total: items.length, correct: scoreRef.current, secondsUsed: seconds ? (seconds - (left || 0)) : null });
        }
        setDone(true);
    }

    function onAnswer(i) {
        if (answered || done) return;
        var item = items[qIndex];
        var ok = i === item.q.correctAnswerIndex;
        setPicked(i);
        setAnswered(true);
        StudentStore.recordAnswer({ ders: item.ders, konu: item.konu, id: item.id, correct: ok });
        StudentStore.addSessionStats({ questions: 1, correct: ok ? 1 : 0 });
        if (ok) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
        }
    }

    function next() {
        if (qIndex + 1 < items.length) {
            setQIndex(qIndex + 1);
            setPicked(null);
            setAnswered(false);
        } else finish();
    }

    if (!items.length) {
        return (
            <ScrollScreen>
                <Text>Soru yok.</Text>
                <PrimaryButton title="Geri" onPress={function () { navigation.goBack(); }} />
            </ScrollScreen>
        );
    }

    if (done) {
        var oran = items.length ? Math.round((score / items.length) * 100) : 0;
        var yorum = oran >= 85 ? "Mükemmel. Bu konuyu kilitle, zayıf olana geç." : oran >= 60 ? "İyi gidiyorsun. Yanlışları deftere aldık." : oran >= 40 ? "Eşik altı. Notu aç, aynı gün 10 soru daha." : "Önce not. Soru yağmuru şimdi işe yaramaz.";
        return (
            <ScrollScreen>
                <Text style={{ fontSize: 24, fontWeight: "800", textAlign: "center" }}>Tur bitti</Text>
                <Text style={{ textAlign: "center", color: colors.muted, marginVertical: 8 }}>{yorum}</Text>
                <Text style={{ fontSize: 48, fontWeight: "800", textAlign: "center", color: colors.indigo }}>%{oran}</Text>
                <View style={{ flexDirection: "row", marginVertical: 16 }}>
                    <View style={{ flex: 1, alignItems: "center" }}><Text style={{ fontWeight: "800", fontSize: 20 }}>{items.length}</Text><Text style={{ color: colors.muted }}>Soru</Text></View>
                    <View style={{ flex: 1, alignItems: "center" }}><Text style={{ fontWeight: "800", fontSize: 20, color: colors.emerald }}>{score}</Text><Text style={{ color: colors.muted }}>Doğru</Text></View>
                    <View style={{ flex: 1, alignItems: "center" }}><Text style={{ fontWeight: "800", fontSize: 20, color: colors.rose }}>{items.length - score}</Text><Text style={{ color: colors.muted }}>Yanlış</Text></View>
                </View>
                <PrimaryButton title="Kapat" onPress={function () { navigation.popToTop(); }} />
            </ScrollScreen>
        );
    }

    var item = items[qIndex];
    var soru = item.q;
    var mm = left != null ? Math.floor(left / 60) : 0;
    var ss = left != null ? String(left % 60).padStart(2, "0") : "";

    return (
        <Screen>
            <View style={{ padding: 16, flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <Pressable onPress={function () { confirmQuit(function () { navigation.goBack(); }); }}>
                        <Text style={{ fontWeight: "700", color: colors.muted }}>Bitir</Text>
                    </Pressable>
                    <Text style={{ fontWeight: "700" }}>{qIndex + 1}/{items.length} · Doğru {score}{left != null ? " · " + mm + ":" + ss : ""}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: "#E7E5E4", borderRadius: 99, marginBottom: 12 }}>
                    <View style={{ height: 6, width: ((qIndex + 1) / items.length) * 100 + "%", backgroundColor: colors.indigo, borderRadius: 99 }} />
                </View>
                {item.ders ? <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>{item.ders} · {item.konu}</Text> : null}
                <Text style={{ fontSize: 17, fontWeight: "700", lineHeight: 26, marginBottom: 16 }}>{soru.question}</Text>
                <View style={{ flex: 1 }}>
                    {(soru.options || []).map(function (opt, i) {
                        var bg = "#fff";
                        var color = colors.text;
                        var border = colors.border;
                        if (answered) {
                            if (i === soru.correctAnswerIndex) { bg = colors.emerald; color = "#fff"; border = colors.emerald; }
                            else if (i === picked) { bg = colors.rose; color = "#fff"; border = colors.rose; }
                        }
                        return (
                            <Pressable key={i} disabled={answered} onPress={function () { onAnswer(i); }}
                                style={{ backgroundColor: bg, borderColor: border, borderWidth: 2, borderRadius: 16, padding: 14, marginBottom: 8 }}>
                                <Text style={{ color: color, fontWeight: "600" }}>{opt}</Text>
                            </Pressable>
                        );
                    })}
                </View>
                {answered ? (
                    <View>
                        <Text style={{ fontWeight: "700", color: colors.indigo, marginBottom: 4 }}>Çözüm notu</Text>
                        <Text style={{ color: colors.text, marginBottom: 12 }}>{soru.explanation}</Text>
                        <PrimaryButton title={qIndex + 1 === items.length ? "Sonuçları gör" : "Sonraki soru"} onPress={next} />
                    </View>
                ) : null}
            </View>
        </Screen>
    );
}
