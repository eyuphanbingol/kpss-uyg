import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { ClozeEngine } from "../lib/clozeEngine";
import { MapQuiz } from "../lib/mapQuiz";
import { go } from "../nav";
import { Card, PrimaryButton, ScrollScreen } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";

export function AlistirmalarHomeScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;

    return (
        <ScrollScreen dark={isDark}>
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>Alıştırmalar</Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    İki oyun: boşluk doldurma ve harita
                </Text>
            </View>
            <Pressable onPress={function () { go(navigation, "AlistirmaDersList"); }}>
                <Card style={[styles.dersCard, isDark && styles.cardDark]}>
                    <Text style={styles.icon}>✏️</Text>
                    <Text style={[styles.dersName, isDark && styles.textLight]}>Boşluk doldurma</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>Her ders ve konu. Şıklardan doğruyu seç.</Text>
                </Card>
            </Pressable>
            <Pressable onPress={function () { go(navigation, "MapPlay"); }}>
                <Card style={[styles.dersCard, isDark && styles.cardDark]}>
                    <Text style={styles.icon}>🗺️</Text>
                    <Text style={[styles.dersName, isDark && styles.textLight]}>Harita oyunu</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>Coğrafya notlarından: ne nerede? İl veya bölge seç.</Text>
                </Card>
            </Pressable>
        </ScrollScreen>
    );
}

export function AlistirmaDersListScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var kpssData = app.kpssData;

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.textMuted]}>← Alıştırmalar</Text>
            </Pressable>
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>Boşluk doldurma</Text>
            <Text style={[styles.subtitle, isDark && styles.textMuted]}>Ders seç, sonra konu.</Text>
            {Object.keys(kpssData).map(function (ders) {
                var konular = Object.keys(kpssData[ders] || {});
                var n = 0;
                konular.forEach(function (k) {
                    n += ClozeEngine.countForKonu(kpssData[ders][k] || {});
                });
                return (
                    <Pressable key={ders} onPress={function () { go(navigation, "AlistirmaKonuList", { ders: ders }); }}>
                        <Card style={[styles.dersCard, isDark && styles.cardDark]}>
                            <View style={styles.row}>
                                <Text style={styles.icon}>{DERS_ICON[ders] || "✏️"}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.dersName, isDark && styles.textLight]}>{ders}</Text>
                                    <Text style={[styles.meta, isDark && styles.textMuted]}>{konular.length} konu · {n} boşluk</Text>
                                </View>
                                <Text style={[styles.arrow, isDark && styles.textMuted]}>→</Text>
                            </View>
                        </Card>
                    </Pressable>
                );
            })}
        </ScrollScreen>
    );
}

export function AlistirmaKonuListScreen({ route, navigation }) {
    var ders = route.params.ders;
    var app = useApp();
    var isDark = app.dark;
    var konular = Object.keys(app.kpssData[ders] || {});

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.textMuted]}>← Dersler</Text>
            </Pressable>
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>{ders}</Text>
            <Text style={[styles.subtitle, isDark && styles.textMuted]}>Konu seç, boşlukları doldur.</Text>
            {konular.map(function (konu, idx) {
                var kd = app.kpssData[ders][konu] || {};
                var n = ClozeEngine.countForKonu(kd);
                return (
                    <Pressable key={konu} onPress={function () { go(navigation, "ClozePlay", { ders: ders, konu: konu }); }}>
                        <Card style={[styles.dersCard, isDark && styles.cardDark]}>
                            <View style={styles.row}>
                                <View style={styles.num}><Text style={styles.numText}>{idx + 1}</Text></View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.dersName, isDark && styles.textLight]}>{konu}</Text>
                                    <Text style={[styles.meta, isDark && styles.textMuted]}>{n ? n + " boşluk" : "Henüz yok"}</Text>
                                </View>
                                <Text style={[styles.arrow, isDark && styles.textMuted]}>→</Text>
                            </View>
                        </Card>
                    </Pressable>
                );
            })}
        </ScrollScreen>
    );
}

export function ClozePlayScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var isDark = app.dark;
    var kd = ((app.kpssData[ders] || {})[konu]) || {};
    var _seed = useState(0);
    var seed = _seed[0];
    var setSeed = _seed[1];
    var list = useMemo(function () {
        return ClozeEngine.buildForKonu(kd, 12);
    }, [ders, konu, seed]);
    var _i = useState(0);
    var idx = _i[0];
    var setIdx = _i[1];
    var _p = useState(null);
    var picked = _p[0];
    var setPicked = _p[1];
    var _s = useState(0);
    var score = _s[0];
    var setScore = _s[1];
    var _d = useState(false);
    var done = _d[0];
    var setDone = _d[1];

    useEffect(function () {
        setIdx(0); setPicked(null); setScore(0); setDone(false);
    }, [seed]);

    if (!list.length) {
        return (
            <ScrollScreen dark={isDark}>
                <Pressable onPress={function () { navigation.goBack(); }}>
                    <Text style={[styles.back, isDark && styles.textMuted]}>← Konular</Text>
                </Pressable>
                <Text style={[styles.konuTitle, isDark && styles.textLight]}>Bu konuda henüz boşluk yok.</Text>
            </ScrollScreen>
        );
    }

    if (done) {
        return (
            <ScrollScreen dark={isDark}>
                <Pressable onPress={function () { navigation.goBack(); }}>
                    <Text style={[styles.back, isDark && styles.textMuted]}>← Konular</Text>
                </Pressable>
                <Card style={[styles.result, isDark && styles.cardDark]}>
                    <Text style={[styles.pct, isDark && styles.textLight]}>{Math.round((score / list.length) * 100)}%</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>{score} doğru · {list.length - score} yanlış</Text>
                    <PrimaryButton title="Tekrar oyna" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
                </Card>
            </ScrollScreen>
        );
    }

    var it = list[idx];
    var ok = picked && String(picked).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.textMuted]}>← Konular</Text>
            </Pressable>
            <Text style={[styles.kicker, isDark && styles.textMuted]}>{ders} · {idx + 1}/{list.length}</Text>
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>{konu}</Text>
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.prompt, isDark && styles.textLight]}>{it.prompt}</Text>
                {(it.choices || []).map(function (c, ci) {
                    var isP = picked === c;
                    var isA = String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
                    var bg = "#fff";
                    var border = colors.border;
                    if (picked && isA) { bg = "#ECFDF5"; border = "#34D399"; }
                    else if (picked && isP) { bg = "#FEF2F2"; border = "#F87171"; }
                    return (
                        <Pressable key={ci} disabled={!!picked} onPress={function () {
                            if (picked) return;
                            setPicked(c);
                            if (String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR")) setScore(score + 1);
                        }} style={[styles.choice, { backgroundColor: isDark && !picked ? colors.navyDeep : bg, borderColor: border }]}>
                            <Text style={[styles.choiceText, isDark && !picked && styles.textLight]}>{c}</Text>
                        </Pressable>
                    );
                })}
                {picked ? (
                    <Text style={{ marginTop: 10, fontWeight: "700", color: ok ? "#059669" : "#E11D48" }}>
                        {ok ? "Doğru" : "Doğrusu: " + it.answer}
                    </Text>
                ) : null}
            </Card>
            <PrimaryButton
                title={idx + 1 >= list.length ? "Bitir" : "Sonraki"}
                onPress={function () {
                    if (!picked) return;
                    if (idx + 1 >= list.length) setDone(true);
                    else { setIdx(idx + 1); setPicked(null); }
                }}
                style={{ marginTop: 12, opacity: picked ? 1 : 0.4 }}
            />
        </ScrollScreen>
    );
}

export function MapPlayScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var _seed = useState(0);
    var seed = _seed[0];
    var setSeed = _seed[1];
    var list = useMemo(function () {
        return MapQuiz.pickRound(10);
    }, [seed]);
    var _i = useState(0);
    var idx = _i[0];
    var setIdx = _i[1];
    var _p = useState(null);
    var picked = _p[0];
    var setPicked = _p[1];
    var _s = useState(0);
    var score = _s[0];
    var setScore = _s[1];
    var _d = useState(false);
    var done = _d[0];
    var setDone = _d[1];

    useEffect(function () {
        setIdx(0); setPicked(null); setScore(0); setDone(false);
    }, [seed]);

    if (done) {
        return (
            <ScrollScreen dark={isDark}>
                <Pressable onPress={function () { navigation.goBack(); }}>
                    <Text style={[styles.back, isDark && styles.textMuted]}>← Alıştırmalar</Text>
                </Pressable>
                <Card style={[styles.result, isDark && styles.cardDark]}>
                    <Text style={[styles.pct, isDark && styles.textLight]}>{Math.round((score / list.length) * 100)}%</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>{score} doğru · {list.length - score} yanlış</Text>
                    <PrimaryButton title="Tekrar oyna" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
                </Card>
            </ScrollScreen>
        );
    }

    var it = list[idx];
    var taps = MapQuiz.tapChoices(it);
    var ok = picked && MapQuiz.isTapCorrect(it, picked);

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.textMuted]}>← Alıştırmalar</Text>
            </Pressable>
            <Text style={[styles.kicker, isDark && styles.textMuted]}>Harita · {idx + 1}/{list.length}</Text>
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>Ne nerede?</Text>
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.prompt, isDark && styles.textLight]}>{it.prompt}</Text>
                <View style={styles.mapGrid}>
                    {taps.map(function (c) {
                        var isP = picked && picked.id === c.id && picked.kind === c.kind;
                        var isA = MapQuiz.isTapCorrect(it, c);
                        var bg = "#fff";
                        var border = colors.border;
                        if (picked && isA) { bg = "#ECFDF5"; border = "#34D399"; }
                        else if (picked && isP) { bg = "#FEF2F2"; border = "#F87171"; }
                        return (
                            <Pressable key={c.kind + c.id} disabled={!!picked} onPress={function () {
                                if (picked) return;
                                setPicked(c);
                                if (MapQuiz.isTapCorrect(it, c)) setScore(score + 1);
                                setTimeout(function () {
                                    if (idx + 1 >= list.length) setDone(true);
                                    else { setIdx(idx + 1); setPicked(null); }
                                }, MapQuiz.isTapCorrect(it, c) ? 700 : 1100);
                            }} style={[styles.mapChip, { backgroundColor: isDark && !picked ? colors.navyDeep : bg, borderColor: border }]}>
                                <Text style={[styles.choiceText, isDark && !picked && styles.textLight]}>{c.label}</Text>
                            </Pressable>
                        );
                    })}
                </View>
                {picked ? (
                    <Text style={{ marginTop: 10, fontWeight: "700", color: ok ? "#059669" : "#E11D48" }}>
                        {ok ? "Doğru" : "Doğrusu: " + MapQuiz.answerLabel(it)}
                    </Text>
                ) : null}
            </Card>
        </ScrollScreen>
    );
}

var styles = StyleSheet.create({
    header: { marginBottom: 12 },
    title: { fontSize: 28, fontWeight: "800", color: colors.navy },
    subtitle: { color: colors.muted, fontSize: 13, marginTop: 4, marginBottom: 10 },
    textLight: { color: "#fff" },
    textMuted: { color: colors.muted },
    cardDark: { backgroundColor: colors.navyDeep },
    dersCard: { marginBottom: 10 },
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
    icon: { fontSize: 26 },
    dersName: { fontWeight: "700", fontSize: 16, color: colors.text },
    meta: { color: colors.muted, fontSize: 12, marginTop: 2 },
    arrow: { color: colors.muted, fontSize: 18 },
    back: { color: colors.muted, marginBottom: 8, fontWeight: "600" },
    konuTitle: { fontSize: 22, fontWeight: "800", color: colors.navy, marginBottom: 4 },
    num: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#CCFBF1", alignItems: "center", justifyContent: "center" },
    numText: { fontWeight: "800", color: "#115E59" },
    kicker: { fontSize: 12, fontWeight: "700", letterSpacing: 0.4, color: colors.muted, textTransform: "uppercase" },
    prompt: { fontSize: 16, lineHeight: 24, color: colors.text, marginBottom: 12 },
    choice: { borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 8 },
    choiceText: { fontWeight: "600", color: colors.text },
    result: { alignItems: "center", paddingVertical: 28 },
    pct: { fontSize: 40, fontWeight: "800", color: colors.navy },
    mapGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    mapChip: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 12, minWidth: "47%", flexGrow: 1 }
});
