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
            <Pressable onPress={function () { go(navigation, "MapTopics"); }}>
                <Card style={[styles.dersCard, isDark && styles.cardDark]}>
                    <Text style={styles.icon}>🗺️</Text>
                    <Text style={[styles.dersName, isDark && styles.textLight]}>Harita oyunu</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>Coğrafya konularına göre haritada bul.</Text>
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

export function MapTopicsScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var tree = MapQuiz.TREE || [];
    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.textMuted]}>← Alıştırmalar</Text>
            </Pressable>
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>Harita oyunu</Text>
            <Text style={[styles.subtitle, isDark && styles.textMuted]}>Konu seç, hedef ili bul, sonra bilgi bağı.</Text>
            {tree.map(function (g) {
                return (
                    <View key={g.id} style={{ marginBottom: 14 }}>
                        <Text style={[styles.kicker, isDark && styles.textMuted]}>{g.icon} {g.title}</Text>
                        {g.kids.map(function (k) {
                            var n = MapQuiz.countFor(k.id);
                            return (
                                <Pressable key={k.id} onPress={function () { go(navigation, "MapPlay", { topicId: k.id }); }}>
                                    <Card style={[styles.dersCard, isDark && styles.cardDark]}>
                                        <Text style={[styles.dersName, isDark && styles.textLight]}>{k.icon} {k.title}</Text>
                                        <Text style={[styles.meta, isDark && styles.textMuted]}>{n} hedef</Text>
                                    </Card>
                                </Pressable>
                            );
                        })}
                    </View>
                );
            })}
            <Text style={[styles.meta, isDark && styles.textMuted]}>{MapQuiz.PARK_SOURCE}</Text>
        </ScrollScreen>
    );
}

export function MapPlayScreen({ route, navigation }) {
    var topicId = route.params.topicId;
    var app = useApp();
    var isDark = app.dark;
    var meta = MapQuiz.topicMeta(topicId);
    var _seed = useState(0);
    var seed = _seed[0];
    var setSeed = _seed[1];
    var list = useMemo(function () {
        return MapQuiz.pickRound(topicId, 8);
    }, [seed, topicId]);
    var layer = useMemo(function () {
        return MapQuiz.topicLayer ? MapQuiz.topicLayer(topicId) : { pins: [], viewBox: "0 0 1000 422" };
    }, [topicId]);
    var glyph = MapQuiz.topicGlyph ? MapQuiz.topicGlyph(topicId) : "📍";
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

    var _c = useState([]);
    var cleared = _c[0];
    var setCleared = _c[1];

    useEffect(function () {
        setIdx(0); setPicked(null); setScore(0); setDone(false); setCleared([]);
    }, [seed, topicId]);

    function advance() {
        var stepNow = list[idx];
        if (stepNow && stepNow.type === "map") {
            setCleared(cleared.concat([stepNow.item.id]));
        }
        if (idx + 1 >= list.length) setDone(true);
        else { setIdx(idx + 1); setPicked(null); }
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

    var step = list[idx];
    var isMap = step && step.type === "map";
    var vb = String(layer.viewBox || "0 0 1000 422").split(" ").map(Number);
    var ok = false;
    if (picked) {
        if (isMap) ok = picked === step.item.id;
        else ok = String(picked) === String(step.answer);
    }

    return (
        <ScrollScreen dark={isDark}>
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.back, isDark && styles.textMuted]}>← Konular</Text>
            </Pressable>
            <Text style={[styles.kicker, isDark && styles.textMuted]}>{meta ? meta.title : "Harita"} · {idx + 1}/{list.length}</Text>
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>{isMap ? "Haritada bul" : "Bilgi bağı"}</Text>
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.prompt, isDark && styles.textLight]}>{step.prompt}</Text>
                {isMap ? (
                    <View style={styles.mapBoard}>
                        {layer.pins.map(function (p) {
                            var left = ((p.x - vb[0]) / vb[2]) * 100;
                            var top = ((p.y - vb[1]) / vb[3]) * 100;
                            var donePin = cleared.indexOf(p.id) >= 0;
                            var tint = null;
                            if (picked && p.id === step.item.id) tint = "rgba(5,150,105,0.22)";
                            else if (picked && p.id === picked) tint = "rgba(225,29,72,0.22)";
                            return (
                                <Pressable key={p.id} disabled={!!picked || donePin} onPress={function () {
                                    if (picked) return;
                                    setPicked(p.id);
                                    if (p.id === step.item.id) setScore(score + 1);
                                    setTimeout(advance, 5500);
                                }} style={[styles.mapMark, { left: left + "%", top: top + "%", opacity: donePin ? 0.42 : 1, backgroundColor: tint || "transparent" }]}>
                                    <Text style={styles.mapIco}>{glyph}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                ) : (
                    (step.choices || []).map(function (c, ci) {
                        var isP = picked === c;
                        var isA = String(c) === String(step.answer);
                        var bg = "#fff";
                        var border = colors.border;
                        if (picked && isA) { bg = "#ECFDF5"; border = "#34D399"; }
                        else if (picked && isP) { bg = "#FEF2F2"; border = "#F87171"; }
                        return (
                            <Pressable key={ci} disabled={!!picked} onPress={function () {
                                if (picked) return;
                                setPicked(c);
                                if (String(c) === String(step.answer)) setScore(score + 1);
                                setTimeout(advance, 5500);
                            }} style={[styles.choice, { backgroundColor: isDark && !picked ? colors.navyDeep : bg, borderColor: border }]}>
                                <Text style={[styles.choiceText, isDark && !picked && styles.textLight]}>{c}</Text>
                            </Pressable>
                        );
                    })
                )}
                {picked ? (
                    <Text style={{ marginTop: 10, fontWeight: "700", color: ok ? "#059669" : "#E11D48" }}>
                        {ok ? "Doğru — " + (isMap ? step.item.name : step.answer) : ("Doğrusu: " + (isMap ? step.item.name : step.answer))}
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
    mapChip: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 12, minWidth: "47%", flexGrow: 1 },
    mapBoard: { height: 240, backgroundColor: "#d7e5db", borderRadius: 16, overflow: "hidden", marginTop: 4, position: "relative" },
    mapMark: { position: "absolute", width: 28, height: 28, marginLeft: -14, marginTop: -14, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    mapIco: { fontSize: 18, lineHeight: 22 }
});
