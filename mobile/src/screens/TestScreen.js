import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { StudentStore } from "../lib/store";
import { confirmQuit, PrimaryButton, Screen, ScrollScreen, Card, Badge } from "../ui";
import { colors } from "../lib/theme";

// ============================================================
// TEST SCREEN
// ============================================================

function stripChoicePrefix(opt) {
    return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
}

export default function TestScreen({ route, navigation }) {
    var items = route.params.items || [];
    var mode = route.params.mode || "topic";
    var seconds = route.params.seconds || null;
    var ders = route.params.ders;
    var konu = route.params.konu;

    // ---------- State ----------
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

    // ---------- Timer ----------
    useEffect(function () {
        if (left == null || done) return;
        if (left <= 0) { finish(); return; }
        var t = setTimeout(function () { setLeft(left - 1); }, 1000);
        return function () { clearTimeout(t); };
    }, [left, done]);

    // ---------- Finish ----------
    function finish() {
        if (finishedRef.current) return;
        finishedRef.current = true;
        var elapsedMin = Math.max(0, Math.round((Date.now() - startedAt.current) / 60000));

        if (mode === "topic" && ders && konu) {
            StudentStore.recordTestResult(ders, konu, { 
                correct: scoreRef.current, 
                total: items.length, 
                minutes: elapsedMin 
            });
        } else if (elapsedMin) {
            StudentStore.addSessionStats({ 
                minutes: elapsedMin, 
                seans: true, 
                ders: ders || null 
            });
        }

        if (mode === "exam") {
            StudentStore.recordExamAttempt({ 
                total: items.length, 
                correct: scoreRef.current, 
                secondsUsed: seconds ? (seconds - (left || 0)) : null 
            });
        }
        setDone(true);
    }

    // ---------- Answer ----------
    function onAnswer(i) {
        if (answered || done) return;
        var item = items[qIndex];
        var ok = i === item.q.correctAnswerIndex;
        setPicked(i);
        setAnswered(true);
        StudentStore.recordAnswer({ 
            ders: item.ders, 
            konu: item.konu, 
            id: item.id, 
            correct: ok 
        });
        StudentStore.addSessionStats({ 
            questions: 1, 
            correct: ok ? 1 : 0 
        });
        if (ok) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
        }
    }

    // ---------- Next ----------
    function next() {
        if (qIndex + 1 < items.length) {
            setQIndex(qIndex + 1);
            setPicked(null);
            setAnswered(false);
        } else finish();
    }

    // ============================================================
    // EMPTY STATE
    // ============================================================

    if (!items.length) {
        return (
            <ScrollScreen>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={styles.emptyTitle}>Soru Bulunamadı</Text>
                    <Text style={styles.emptyDesc}>Bu test için soru yüklenmemiş.</Text>
                    <PrimaryButton title="Geri Dön" onPress={function () { navigation.goBack(); }} />
                </View>
            </ScrollScreen>
        );
    }

    // ============================================================
    // RESULT SCREEN
    // ============================================================

    if (done) {
        var oran = items.length ? Math.round((score / items.length) * 100) : 0;
        var yorum = oran >= 85 ? "🌟 Mükemmel! Bu konuyu kilitle, zayıf olana geç." 
            : oran >= 60 ? "✅ İyi gidiyorsun. Yanlışları deftere aldık." 
            : oran >= 40 ? "📈 Eşik altı. Notu aç, aynı gün 10 soru daha." 
            : "📖 Önce not. Soru yağmuru şimdi işe yaramaz.";
        
        var levelColor = oran >= 85 ? colors.emerald : oran >= 60 ? colors.indigo : oran >= 40 ? colors.amber : colors.rose;

        return (
            <ScrollScreen>
                {/* Header */}
                <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>📊 Tur Bitti</Text>
                    <Badge 
                        type={oran >= 85 ? "success" : oran >= 60 ? "primary" : oran >= 40 ? "warning" : "danger"}
                        title={oran >= 85 ? "Mükemmel" : oran >= 60 ? "İyi" : oran >= 40 ? "Orta" : "Gelişmeli"}
                    />
                </View>

                <Text style={[styles.resultYorum, { color: levelColor }]}>
                    {yorum}
                </Text>

                {/* Score */}
                <View style={styles.resultScoreContainer}>
                    <Text style={[styles.resultScore, { color: levelColor }]}>
                        %{oran}
                    </Text>
                </View>

                {/* Stats */}
                <View style={styles.resultStats}>
                    <View style={styles.resultStat}>
                        <Text style={styles.resultStatNumber}>{items.length}</Text>
                        <Text style={styles.resultStatLabel}>Soru</Text>
                    </View>
                    <View style={styles.resultStatDivider} />
                    <View style={styles.resultStat}>
                        <Text style={[styles.resultStatNumber, { color: colors.emerald }]}>{score}</Text>
                        <Text style={styles.resultStatLabel}>Doğru</Text>
                    </View>
                    <View style={styles.resultStatDivider} />
                    <View style={styles.resultStat}>
                        <Text style={[styles.resultStatNumber, { color: colors.rose }]}>{items.length - score}</Text>
                        <Text style={styles.resultStatLabel}>Yanlış</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.resultProgress}>
                    <View style={styles.resultProgressBar}>
                        <View 
                            style={[
                                styles.resultProgressFill,
                                { 
                                    width: oran + "%",
                                    backgroundColor: levelColor
                                }
                            ]} 
                        />
                    </View>
                    <Text style={styles.resultProgressText}>%{oran} başarı</Text>
                </View>

                <PrimaryButton 
                    title="Kapat" 
                    onPress={function () { navigation.popToTop(); }} 
                    style={styles.resultBtn}
                />
            </ScrollScreen>
        );
    }

    // ============================================================
    // TEST SCREEN
    // ============================================================

    var item = items[qIndex];
    var soru = item.q;
    var mm = left != null ? Math.floor(left / 60) : 0;
    var ss = left != null ? String(left % 60).padStart(2, "0") : "";
    var progress = ((qIndex + 1) / items.length) * 100;
    var isLast = qIndex + 1 === items.length;

    // Timer color
    var timerColor = left != null 
        ? (left <= 60 ? colors.rose : left <= 300 ? colors.amber : colors.indigo)
        : colors.indigo;

    return (
        <Screen>
            <View style={styles.testContainer}>
                {/* Header */}
                <View style={styles.testHeader}>
                    <Pressable 
                        onPress={function () { 
                            confirmQuit(function () { navigation.goBack(); }); 
                        }}
                        style={styles.testQuit}
                    >
                        <Text style={styles.testQuitText}>✕ Bitir</Text>
                    </Pressable>
                    <View style={styles.testInfo}>
                        <Text style={styles.testCounter}>
                            {qIndex + 1}/{items.length}
                        </Text>
                        <Text style={styles.testScore}>
                            ✓ {score}
                        </Text>
                        {left != null && (
                            <Text style={[styles.testTimer, { color: timerColor }]}>
                                ⏱ {mm}:{ss}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.testProgress}>
                    <View style={[styles.testProgressFill, { width: progress + "%" }]} />
                </View>

                {/* Question Meta */}
                {item.ders && (
                    <View style={styles.testMeta}>
                        <Badge type="primary" title={item.ders} />
                        <Text style={styles.testKonu}>{item.konu}</Text>
                    </View>
                )}

                {/* Question */}
                <Text style={styles.testQuestion}>{soru.question}</Text>

                {/* Options */}
                <View style={styles.testOptions}>
                    {(soru.options || []).map(function (opt, i) {
                        var isCorrect = i === soru.correctAnswerIndex;
                        var isPicked = i === picked;
                        var isAnswered = answered;

                        var bgColor = "#fff";
                        var textColor = colors.text;
                        var borderColor = colors.border;

                        if (isAnswered) {
                            if (isCorrect) {
                                bgColor = colors.emerald + "15";
                                borderColor = colors.emerald;
                                textColor = colors.emerald;
                            } else if (isPicked) {
                                bgColor = colors.rose + "15";
                                borderColor = colors.rose;
                                textColor = colors.rose;
                            } else {
                                bgColor = "#F5F5F4";
                                borderColor = "#E7E5E4";
                                textColor = colors.muted;
                            }
                        }

                        var letter = String.fromCharCode(65 + i);

                        return (
                            <Pressable 
                                key={i} 
                                disabled={answered} 
                                onPress={function () { onAnswer(i); }}
                                style={[
                                    styles.testOption,
                                    { 
                                        backgroundColor: bgColor, 
                                        borderColor: borderColor,
                                        opacity: isAnswered && !isCorrect && !isPicked ? 0.5 : 1,
                                    }
                                ]}
                            >
                                <View style={[
                                    styles.testOptionLetter,
                                    isAnswered && isCorrect && styles.testOptionLetterCorrect,
                                    isAnswered && isPicked && !isCorrect && styles.testOptionLetterWrong,
                                ]}>
                                    <Text style={[
                                        styles.testOptionLetterText,
                                        isAnswered && (isCorrect || (isPicked && !isCorrect)) && { color: "#fff" }
                                    ]}>
                                        {letter}
                                    </Text>
                                </View>
                                <Text style={[styles.testOptionText, { color: textColor }]}>
                                    {stripChoicePrefix(opt)}
                                </Text>
                                {isAnswered && isCorrect && (
                                    <Text style={styles.testOptionCheck}>✓</Text>
                                )}
                                {isAnswered && isPicked && !isCorrect && (
                                    <Text style={styles.testOptionCheck}>✕</Text>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Explanation */}
                {answered && (
                    <View style={styles.testExplanation}>
                        <Text style={styles.testExplanationLabel}>💡 Çözüm Notu</Text>
                        <Text style={styles.testExplanationText}>{soru.explanation || "Çözüm notu bulunmuyor."}</Text>
                        <PrimaryButton 
                            title={isLast ? "📊 Sonuçları Gör" : "➡️ Sonraki Soru"} 
                            onPress={next} 
                            style={styles.testNextBtn}
                        />
                    </View>
                )}
            </View>
        </Screen>
    );
}

// ============================================================
// STILLER
// ============================================================

var styles = StyleSheet.create({
    // ---------- Empty ----------
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
    },
    emptyDesc: {
        fontSize: 14,
        color: colors.muted,
        marginBottom: 16,
        textAlign: "center",
    },

    // ---------- Result ----------
    resultHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.navy,
    },
    resultYorum: {
        fontSize: 15,
        textAlign: "center",
        marginVertical: 12,
        fontWeight: "500",
    },
    resultScoreContainer: {
        alignItems: "center",
        marginVertical: 8,
    },
    resultScore: {
        fontSize: 56,
        fontWeight: "800",
    },
    resultStats: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginVertical: 12,
    },
    resultStat: {
        flex: 1,
        alignItems: "center",
    },
    resultStatNumber: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.text,
    },
    resultStatLabel: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 2,
    },
    resultStatDivider: {
        width: 1,
        height: 36,
        backgroundColor: colors.border,
    },
    resultProgress: {
        marginVertical: 8,
    },
    resultProgressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: "#F5F5F4",
        overflow: "hidden",
    },
    resultProgressFill: {
        height: "100%",
        borderRadius: 3,
    },
    resultProgressText: {
        textAlign: "center",
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },
    resultBtn: {
        marginTop: 8,
    },

    // ---------- Test ----------
    testContainer: {
        flex: 1,
        padding: 16,
    },
    testHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    testQuit: {
        padding: 4,
    },
    testQuitText: {
        fontWeight: "600",
        color: colors.muted,
        fontSize: 13,
    },
    testInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    testCounter: {
        fontWeight: "600",
        fontSize: 13,
        color: colors.text,
    },
    testScore: {
        fontWeight: "700",
        fontSize: 13,
        color: colors.emerald,
    },
    testTimer: {
        fontWeight: "700",
        fontSize: 13,
    },
    testProgress: {
        height: 4,
        borderRadius: 2,
        backgroundColor: "#F5F5F4",
        overflow: "hidden",
        marginBottom: 12,
    },
    testProgressFill: {
        height: "100%",
        borderRadius: 2,
        backgroundColor: colors.indigo,
    },
    testMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    testKonu: {
        fontSize: 12,
        color: colors.muted,
    },
    testQuestion: {
        fontSize: 17,
        fontWeight: "600",
        lineHeight: 26,
        marginBottom: 16,
        color: colors.text,
    },
    testOptions: {
        flex: 1,
        gap: 8,
    },
    testOption: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 14,
        padding: 14,
        gap: 12,
    },
    testOptionLetter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F5F5F4",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    testOptionLetterCorrect: {
        backgroundColor: colors.emerald,
    },
    testOptionLetterWrong: {
        backgroundColor: colors.rose,
    },
    testOptionLetterText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.muted,
    },
    testOptionText: {
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
        color: colors.text,
    },
    testOptionCheck: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.emerald,
    },
    testExplanation: {
        marginTop: 12,
        padding: 14,
        backgroundColor: colors.indigo + "08",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.indigo + "20",
    },
    testExplanationLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.indigo,
        marginBottom: 4,
    },
    testExplanationText: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
        marginBottom: 12,
    },
    testNextBtn: {
        marginTop: 0,
    },
});