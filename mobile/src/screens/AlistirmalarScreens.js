import React, { memo, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../AppProvider";
import { ClozeEngine } from "../lib/clozeEngine";
import { MapQuiz } from "../lib/mapQuiz";
import { StudentStore } from "../lib/store";
import { go } from "../nav";
import { Card, PrimaryButton, ScrollScreen, Screen, Tap, PageHeader, BackChip } from "../ui";
import { colors } from "../lib/theme";
import { PencilLine, Map, Shield, Layers, Timer, ChevronRight } from "lucide-react-native";
import { AccentCard, PctBadge, Hit } from "../kit";
import { TrMapView } from "../components/TrMapView";
import { useLandscapeLock } from "../lib/useLandscapeLock";

var MAP_CARD_IMG = {
    volkan: require("../../assets/volkan-hover.png"),
    kirik: require("../../assets/kirik-kivrim.png"),
    masif: require("../../assets/masif.png"),
    fay: require("../../assets/fay.png"),
    "deprem-az": require("../../assets/deprem-az.png"),
    "plato-karst": require("../../assets/plato-karst.png"),
    "plato-asinim": require("../../assets/plato-asinim.png"),
    "plato-tabaka": require("../../assets/plato-tabaka.png"),
    delta: require("../../assets/delta.png")
};

export function AlistirmalarHomeScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;

    return (
        <ScrollScreen dark={isDark} noBottom>
            <PageHeader dark={isDark} title="Alıştırmalar" subtitle="Boşluk, harita ve üç yeni oyun" />
            <AccentCard dark={isDark} chevron onPress={function () { go(navigation, "AlistirmaDersList"); }} style={styles.playCard}>
                <View style={styles.playRow}>
                    <View style={styles.playIco}><PencilLine size={20} color="#0F172A" /></View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.dersName, isDark && styles.textLight]}>Boşluk doldurma</Text>
                        <Text style={styles.meta}>Nottaki boşluğu şıklardan tamamla.</Text>
                    </View>
                </View>
            </AccentCard>
            <AccentCard dark={isDark} chevron onPress={function () { go(navigation, "MapTopics"); }} style={styles.playCard}>
                <View style={styles.playRow}>
                    <View style={styles.playIco}><Map size={20} color="#0F172A" /></View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.dersName, isDark && styles.textLight]}>Harita oyunu</Text>
                        <Text style={styles.meta}>Konuyu seç, yeri haritada işaretle.</Text>
                    </View>
                </View>
            </AccentCard>
            <AccentCard dark={isDark} chevron onPress={function () { go(navigation, "ConquerPlay"); }} style={styles.playCard}>
                <View style={styles.playRow}>
                    <View style={styles.playIco}><Shield size={20} color="#0F172A" /></View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.dersName, isDark && styles.textLight]}>Türkiye'yi Fethet</Text>
                        <Text style={styles.meta}>İli seç, soruları bitir; ili boya, bölge rozeti kap.</Text>
                    </View>
                </View>
            </AccentCard>
            <AccentCard dark={isDark} chevron onPress={function () { go(navigation, "TabuPlay"); }} style={styles.playCard}>
                <View style={styles.playRow}>
                    <View style={styles.playIco}><Layers size={20} color="#0F172A" /></View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.dersName, isDark && styles.textLight]}>Tabu</Text>
                        <Text style={styles.meta}>İpuçlarından kavrama ulaş. Az ipucu, çok puan.</Text>
                    </View>
                </View>
            </AccentCard>
            <AccentCard dark={isDark} chevron onPress={function () { go(navigation, "PanicPlay"); }} style={styles.playCard}>
                <View style={styles.playRow}>
                    <View style={styles.playIco}><Timer size={20} color="#0F172A" /></View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.dersName, isDark && styles.textLight]}>Son 30 saniye</Text>
                        <Text style={styles.meta}>Doğru +2 sn, yanlış −3 sn. Hızlı net bilgi.</Text>
                    </View>
                </View>
            </AccentCard>
        </ScrollScreen>
    );
}

export function AlistirmaDersListScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var kpssData = app.kpssData;

    return (
        <ScrollScreen dark={isDark}>
            <PageHeader
                dark={isDark}
                title="Boşluk doldurma"
                subtitle="Ders seç, sonra konu."
                onBack={function () { navigation.goBack(); }}
                right={null}
            />
            {Object.keys(kpssData).filter(function (ders) {
                if (!ClozeEngine.dersEnabled(ders)) return false;
                return Object.keys(kpssData[ders] || {}).filter(function (k) { return k !== "_"; }).length > 0;
            }).map(function (ders) {
                var konular = Object.keys(kpssData[ders] || {}).filter(function (k) { return k !== "_"; });
                return (
                    <AccentCard key={ders} dark={isDark} chevron onPress={function () { go(navigation, "AlistirmaKonuList", { ders: ders }); }} style={styles.playCard}>
                        <Text style={[styles.dersName, isDark && styles.textLight]}>{ders}</Text>
                        <Text style={styles.meta}>{konular.length} konu</Text>
                    </AccentCard>
                );
            })}
            {!Object.keys(kpssData).some(function (ders) {
                return Object.keys(kpssData[ders] || {}).some(function (k) { return k !== "_"; });
            }) ? (
                <Text style={[styles.meta, isDark && styles.textMuted]}>Konular henüz inmedi. İnterneti kontrol edip uygulamayı kapat-aç.</Text>
            ) : null}
        </ScrollScreen>
    );
}

export function AlistirmaKonuListScreen({ route, navigation }) {
    var ders = route.params.ders;
    var app = useApp();
    var isDark = app.dark;
    useEffect(function () {
        if (!ClozeEngine.dersEnabled(ders)) navigation.goBack();
    }, [ders, navigation]);
    var konular = Object.keys(app.kpssData[ders] || {}).filter(function (k) { return k !== "_"; });
    var statsState = useState(null);
    var stats = statsState[0];
    var setStats = statsState[1];

    useEffect(function () {
        var id = requestAnimationFrame(function () {
            var next = {};
            konular.forEach(function (konu, idx) {
                var kd = app.kpssData[ders][konu] || {};
                var tp = ((app.student.topics && app.student.topics[ders]) || {})[konu] || {};
                var n = ClozeEngine.countForKonu(kd);
                next[konu] = {
                    n: n,
                    left: n ? ClozeEngine.remainingCount(kd, tp.solvedCloze) : 0,
                    open: StudentStore.isKonuOpen(ders, konular, idx, app.kpssData),
                    done: StudentStore.topicComplete(tp, kd)
                };
            });
            setStats(next);
        });
        return function () { cancelAnimationFrame(id); };
    }, [ders, app.student]);

    return (
        <ScrollScreen dark={isDark}>
            <PageHeader
                dark={isDark}
                title={ders}
                subtitle="Derslerle aynı sıra. Konu bitince burası da açılır."
                onBack={function () { navigation.goBack(); }}
                right={null}
            />
            {konular.map(function (konu) {
                var st = (stats && stats[konu]) || { n: 0, left: 0, open: true, done: false };
                var open = st.open !== false;
                return (
                    <AccentCard
                        key={konu}
                        dark={isDark}
                        disabled={!open}
                        chevron={open}
                        onPress={function () {
                            if (open) go(navigation, "ClozePlay", { ders: ders, konu: konu });
                        }}
                        style={styles.playCard}
                    >
                        <View style={styles.konuRow}>
                            <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                                <Text style={[styles.dersName, isDark && styles.textLight]} numberOfLines={2}>{konu}</Text>
                                <Text style={styles.meta}>{open ? (st.n ? (st.left + " / " + st.n + " boşluk") : (stats ? "Henüz yok" : " ")) : "Önce önceki konunun testlerini bitir"}</Text>
                            </View>
                            {st.done ? <PctBadge label="Tamam" /> : null}
                        </View>
                    </AccentCard>
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
    var konular = Object.keys(app.kpssData[ders] || {}).filter(function (k) { return k !== "_"; });
    var konuIdx = konular.indexOf(konu);
    var open = StudentStore.isKonuOpen(ders, konular, konuIdx, app.kpssData);
    var kd = ((app.kpssData[ders] || {})[konu]) || {};
    var _seed = useState(0);
    var seed = _seed[0];
    var setSeed = _seed[1];
    var listState = useState(null);
    var list = listState[0];
    var setList = listState[1];
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
        if (!ClozeEngine.dersEnabled(ders)) {
            navigation.goBack();
            return;
        }
        setIdx(0); setPicked(null); setScore(0); setDone(false); setList(null);
        var id = requestAnimationFrame(function () {
            var built = [];
            try {
                built = ClozeEngine.buildForKonu(kd, 12, StudentStore.solvedClozeIds(ders, konu)) || [];
            } catch (e) {
                built = [];
            }
            setList(built);
        });
        return function () { cancelAnimationFrame(id); };
    }, [seed, ders, konu]);

    useEffect(function () {
        if (!open) navigation.goBack();
    }, [open]);

    if (!open) return null;

    if (list == null) {
        return (
            <ScrollScreen dark={isDark}>
                <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} />
                <Text style={[styles.kicker, isDark && styles.textMuted]}>{ders}</Text>
                <Text style={[styles.konuTitle, isDark && styles.textLight]}>{konu}</Text>
            </ScrollScreen>
        );
    }

    if (!list.length) {
        var totalCloze = ClozeEngine.countForKonu(kd);
        var leftCloze = ClozeEngine.remainingCount(kd, StudentStore.solvedClozeIds(ders, konu));
        var allSolved = totalCloze > 0 && leftCloze === 0;
        return (
            <ScrollScreen dark={isDark}>
                <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} />
                <Text style={[styles.konuTitle, isDark && styles.textLight]}>{allSolved ? "Bu konudaki boşlukları çözdün." : "Bu konuda henüz boşluk yok."}</Text>
                {allSolved ? (
                    <PrimaryButton title="Sıfırla" onPress={function () {
                        StudentStore.resetCloze(ders, konu);
                        setSeed(seed + 1);
                    }} style={{ marginTop: 16 }} />
                ) : null}
            </ScrollScreen>
        );
    }

    if (done) {
        var leftAfter = ClozeEngine.remainingCount(kd, StudentStore.solvedClozeIds(ders, konu));
        return (
            <ScrollScreen dark={isDark}>
                <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} />
                <Card style={[styles.result, isDark && styles.cardDark]}>
                    <Text style={[styles.pct, isDark && styles.textLight]}>{Math.round((score / list.length) * 100)}%</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>{score} doğru · {list.length - score} yanlış</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted, { marginTop: 8 }]}>
                        {leftAfter ? (leftAfter + " boşluk kaldı") : "Doğru çözülenler bir daha gelmez. Konuyu sıfırlarsan tekrar gelir."}
                    </Text>
                    <PrimaryButton title={leftAfter ? "Devam et" : "Sıfırla"} onPress={function () {
                        if (!leftAfter) StudentStore.resetCloze(ders, konu);
                        setSeed(seed + 1);
                    }} style={{ marginTop: 16 }} />
                </Card>
            </ScrollScreen>
        );
    }

    var it = list[idx];
    var ok = picked && String(picked).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");

    return (
        <ScrollScreen dark={isDark}>
            <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} />
            <Text style={[styles.kicker, isDark && styles.textMuted]}>{ders} · {idx + 1}/{list.length}</Text>
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>{konu}</Text>
            <Card style={[isDark && styles.cardDark]}>
                {it.hint ? <Text style={[styles.clozeHint, isDark && styles.textMuted]}>{it.hint}</Text> : null}
                <View style={[styles.clozeStem, isDark && styles.clozeStemDark]}>
                    <View style={styles.clozeBar} />
                    <Text style={[styles.clozeText, isDark && styles.textLight]}>
                        {String(it.prompt || "").replace(/\s*Boşluk:\s*/g, " ").replace(/\s*→\s*/g, " ").split("______").map(function (p, i, arr) {
                            return (
                                <Text key={i}>
                                    {p}
                                    {i < arr.length - 1 ? (
                                        <Text style={[styles.clozeBlank, picked ? styles.clozeBlankFilled : null]}>
                                            {picked ? " " + it.answer + " " : "          "}
                                        </Text>
                                    ) : null}
                                </Text>
                            );
                        })}
                    </Text>
                </View>
                {(it.choices || []).map(function (c, ci) {
                    var isP = picked === c;
                    var isA = String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR");
                    var bg = "#fff";
                    var border = colors.border;
                    if (picked && isA) { bg = "#ECFDF5"; border = "#34D399"; }
                    else if (picked && isP) { bg = "#FEF2F2"; border = "#F87171"; }
                    return (
                        <Tap key={ci} disabled={!!picked} onPress={function () {
                            if (picked) return;
                            setPicked(c);
                            if (String(c).toLocaleLowerCase("tr-TR") === String(it.answer).toLocaleLowerCase("tr-TR")) {
                                setScore(score + 1);
                                StudentStore.markClozeSolved(ders, konu, it.id);
                            }
                        }} style={[styles.choice, { backgroundColor: isDark && !picked ? colors.navyDeep : bg, borderColor: border }]}>
                            <Text style={[styles.choiceText, isDark && !picked && styles.textLight]}>{c}</Text>
                        </Tap>
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

var MapTopicRow = memo(function MapTopicRow(props) {
    var src = props.imgKey ? MAP_CARD_IMG[props.imgKey] : null;
    return (
        <View style={[styles.mapRow, props.dark && styles.mapRowDark]}>
            <Hit onPress={props.onPress} style={styles.mapRowHit}>
                {src ? (
                    <Image source={src} style={styles.thumb} />
                ) : (
                    <View style={styles.thumbFallback}>
                        <Map size={22} color="#0F172A" />
                    </View>
                )}
                <View style={styles.mapRowBody}>
                    <Text style={[styles.dersName, props.dark && styles.textLight]} numberOfLines={2}>{props.title}</Text>
                    <View style={styles.targetBadge}>
                        <Text style={styles.targetBadgeTxt}>{props.count} hedef</Text>
                    </View>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
            </Hit>
        </View>
    );
});

export function MapTopicsScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var tree = MapQuiz.TREE || [];
    return (
        <ScrollScreen dark={isDark}>
            <PageHeader
                dark={isDark}
                title="Harita oyunu"
                subtitle="Konu seç, hedef ili bul, sonra bilgi bağı."
                onBack={function () { navigation.goBack(); }}
                right={null}
            />
            {tree.map(function (g) {
                return (
                    <View key={g.id} style={styles.sectionBlock}>
                        <Text style={[styles.sectionHead, isDark && styles.textMuted]}>{g.title}</Text>
                        {g.kids.map(function (k) {
                            return (
                                <MapTopicRow
                                    key={k.id}
                                    dark={isDark}
                                    title={k.title}
                                    count={MapQuiz.countFor(k.id)}
                                    imgKey={k.hoverImg}
                                    onPress={function () { go(navigation, "MapPlay", { topicId: k.id }); }}
                                />
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
    var win = useWindowDimensions();
    var insets = useSafeAreaInsets();
    var landReady = useLandscapeLock();
    var meta = MapQuiz.topicMeta(topicId);
    var _seed = useState(0);
    var seed = _seed[0];
    var setSeed = _seed[1];
    var list = useMemo(function () {
        return MapQuiz.pickRound(topicId, 8);
    }, [seed, topicId]);
    var layer = useMemo(function () {
        if (MapQuiz.topicPinsForPlay) return { pins: MapQuiz.topicPinsForPlay(topicId) };
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

    var playPad = {
        paddingTop: Math.min(Math.max(insets.top, 12), Math.round(win.height * 0.12)),
        paddingBottom: Math.min(Math.max(insets.bottom, 10), Math.round(win.height * 0.12)),
        paddingLeft: Math.min(Math.max(insets.left, 12), Math.round(win.width * 0.12)),
        paddingRight: Math.min(Math.max(insets.right, 12), Math.round(win.width * 0.12))
    };

    if (done) {
        return (
            <Screen dark={isDark} edges={[]} style={{ overflow: "hidden" }}>
                <ScrollView contentContainerStyle={[playPad, { paddingBottom: Math.max(insets.bottom, 28) }]} keyboardShouldPersistTaps="handled">
                    <Card style={[styles.result, isDark && styles.cardDark]}>
                        <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} style={{ marginBottom: 12 }} />
                        <Text style={[styles.pct, isDark && styles.textLight]}>{Math.round((score / list.length) * 100)}%</Text>
                        <Text style={[styles.meta, isDark && styles.textMuted]}>{score} doğru · {list.length - score} yanlış</Text>
                        <PrimaryButton title="Tekrar oyna" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
                    </Card>
                </ScrollView>
            </Screen>
        );
    }

    var step = list[idx];
    var isMap = step && step.type === "map";
    var ok = false;
    if (picked) {
        if (isMap) ok = picked === step.item.id;
        else ok = String(picked) === String(step.answer);
    }
    var clearedMap = {};
    cleared.forEach(function (id) { clearedMap[id] = true; });
    var landscape = win.width > win.height;
    var labels = [];
    if (isMap && picked && step.item) {
        var hitPin = (layer.pins || []).filter(function (p) { return p.id === picked; })[0];
        var rightPin = (layer.pins || []).filter(function (p) { return p.id === step.item.id; })[0];
        if (picked === step.item.id && rightPin) labels.push({ id: rightPin.id, x: rightPin.x, y: rightPin.y, text: step.item.name, kind: "ok" });
        else {
            if (hitPin) labels.push({ id: hitPin.id, x: hitPin.x, y: hitPin.y, text: hitPin.name, kind: "bad" });
            if (rightPin) labels.push({ id: rightPin.id, x: rightPin.x, y: rightPin.y, text: step.item.name, kind: "ok" });
        }
    }

    if (!landReady) {
        return (
            <Screen dark={isDark} edges={["top"]} style={{ overflow: "hidden" }}>
                <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
                    <Text style={[styles.konuTitle, isDark && styles.textLight]}>Harita</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>Yataya alınıyor…</Text>
                </View>
            </Screen>
        );
    }

    return (
        isMap ? (
        <Screen dark={isDark} style={{ overflow: "hidden" }} edges={[]}>
            <View key={win.width + "x" + win.height} style={[{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" }, playPad]}>
            <Card style={[styles.mapAskCard, isDark && styles.cardDark]}>
                <View style={styles.mapAskRow}>
                    <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} style={{ marginBottom: 0 }} />
                    <Text style={[styles.kicker, { flex: 1, marginBottom: 0, minWidth: 0 }, isDark && styles.textMuted]} numberOfLines={1}>
                        {meta ? meta.title : "Harita"} · {idx + 1}/{list.length}
                    </Text>
                </View>
                <Text style={[styles.prompt, { marginBottom: 0, marginTop: 8, fontSize: landscape ? 13 : 16, lineHeight: landscape ? 18 : 24 }, isDark && styles.textLight]} numberOfLines={landscape ? 2 : 4}>
                    {step.prompt}
                </Text>
            </Card>
            <View style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden", marginTop: 8 }}>
            <TrMapView
                mode="play"
                pins={layer.pins || []}
                glyph={glyph}
                separate={topicId === "volkanik" ? 20 : (topicId === "kirik" ? 50 : 36)}
                picked={picked}
                targetId={step.item && step.item.id}
                cleared={clearedMap}
                labels={labels}
                locked={!!picked}
                onPin={function (id) {
                    if (picked || clearedMap[id]) return;
                    setPicked(id);
                    if (id === step.item.id) setScore(score + 1);
                    setTimeout(advance, 5500);
                }}
            />
            </View>
            {picked ? (
                <Text style={{ marginTop: 6, fontWeight: "700", color: ok ? "#059669" : "#E11D48" }} numberOfLines={1}>
                    {ok ? "Doğru — " + step.item.name : ("Doğrusu: " + step.item.name)}
                </Text>
            ) : (
                <Text style={[styles.mapHint, isDark && styles.textMuted]}>İşarete bas</Text>
            )}
            </View>
        </Screen>
        ) : (
        <Screen dark={isDark} edges={[]} style={{ overflow: "hidden" }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[playPad, { paddingBottom: Math.max(insets.bottom, 28) }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
            <Card style={[isDark && styles.cardDark]}>
                <View style={styles.mapAskRow}>
                    <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} style={{ marginBottom: 0 }} />
                    <Text style={[styles.kicker, { flex: 1, marginBottom: 0, minWidth: 0 }, isDark && styles.textMuted]} numberOfLines={1}>
                        {meta ? meta.title : "Harita"} · {idx + 1}/{list.length}
                    </Text>
                </View>
                <Text style={[styles.konuTitle, { fontSize: landscape ? 18 : 22, marginTop: 8 }, isDark && styles.textLight]}>Bilgi bağı</Text>
                <Text style={[styles.prompt, isDark && styles.textLight]}>{step.prompt}</Text>
                    {(step.choices || []).map(function (c, ci) {
                        var isP = picked === c;
                        var isA = String(c) === String(step.answer);
                        var bg = "#fff";
                        var border = colors.border;
                        if (picked && isA) { bg = "#ECFDF5"; border = "#34D399"; }
                        else if (picked && isP) { bg = "#FEF2F2"; border = "#F87171"; }
                        return (
                            <Tap key={ci} disabled={!!picked} onPress={function () {
                                if (picked) return;
                                setPicked(c);
                                if (String(c) === String(step.answer)) setScore(score + 1);
                                setTimeout(advance, 5500);
                            }} style={[styles.choice, { backgroundColor: isDark && !picked ? colors.navyDeep : bg, borderColor: border }]}>
                                <Text style={[styles.choiceText, isDark && !picked && styles.textLight]}>{c}</Text>
                            </Tap>
                        );
                    })}
                {picked ? (
                    <Text style={{ marginTop: 10, fontWeight: "700", color: ok ? "#059669" : "#E11D48" }}>
                        {ok ? "Doğru — " + step.answer : ("Doğrusu: " + step.answer)}
                    </Text>
                ) : null}
            </Card>
            </ScrollView>
        </Screen>
        )
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
    volkanCard: {
        marginBottom: 10,
        overflow: "hidden",
        borderRadius: 16
    },
    volkanCardInner: { minHeight: 72 },
    volkanCardImg: { borderRadius: 16 },
    volkanScrim: { backgroundColor: "rgba(8,6,4,0.42)", padding: 16, minHeight: 72, justifyContent: "center" },
    volkanName: { color: "#fff", textShadowColor: "rgba(0,0,0,0.7)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 },
    volkanMeta: { color: "rgba(255,255,255,0.88)" },
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
    icon: { fontSize: 26 },
    dersName: { fontWeight: "700", fontSize: 16, color: "#0F172A" },
    meta: { color: "#64748B", fontSize: 12, marginTop: 2 },
    playCard: { borderRadius: 20, minHeight: 76 },
    konuRow: { flexDirection: "row", alignItems: "center" },
    playRow: { flexDirection: "row", alignItems: "center" },
    playIco: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#FEF3C7",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    arrow: { color: colors.muted, fontSize: 18 },
    back: { color: colors.muted, marginBottom: 8, fontWeight: "600" },
    konuTitle: { fontSize: 22, fontWeight: "800", color: colors.navy, marginBottom: 4 },
    num: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#CCFBF1", alignItems: "center", justifyContent: "center" },
    numText: { fontWeight: "800", color: "#115E59" },
    kicker: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, color: "#94A3B8", textTransform: "uppercase" },
    sectionBlock: { marginBottom: 18 },
    sectionHead: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.4,
        color: "#94A3B8",
        textTransform: "uppercase",
        marginBottom: 8,
        marginTop: 2,
    },
    mapRow: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 10,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    mapRowDark: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
    },
    mapRowHit: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        minHeight: 76,
        borderRadius: 16,
    },
    thumb: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: "#F1F5F9",
    },
    thumbFallback: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: "#FEF3C7",
        alignItems: "center",
        justifyContent: "center",
    },
    mapRowBody: {
        flex: 1,
        minWidth: 0,
        marginLeft: 12,
        marginRight: 8,
    },
    targetBadge: {
        alignSelf: "flex-start",
        marginTop: 6,
        backgroundColor: "#FEF3C7",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    targetBadgeTxt: {
        color: "#92400E",
        fontWeight: "700",
        fontSize: 11,
    },
    mapAskCard: { paddingVertical: 10, paddingHorizontal: 12, marginBottom: 0, flexShrink: 0 },
    mapAskRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    prompt: { fontSize: 16, lineHeight: 24, color: colors.text, marginBottom: 12 },
    clozeHint: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8, color: "#8A7A4A", textTransform: "uppercase", marginBottom: 8 },
    clozeStem: { backgroundColor: "#F6F1E4", borderRadius: 16, paddingVertical: 16, paddingHorizontal: 16, paddingLeft: 18, marginBottom: 4, borderWidth: 1, borderColor: "rgba(13,44,77,0.08)", position: "relative" },
    clozeStemDark: { backgroundColor: colors.navyDeep, borderColor: "rgba(255,255,255,0.08)" },
    clozeBar: { position: "absolute", left: 0, top: 12, bottom: 12, width: 4, borderRadius: 4, backgroundColor: "#C5A059" },
    clozeText: { fontSize: 17, lineHeight: 28, color: colors.text, fontWeight: "600", paddingLeft: 8 },
    clozeBlank: { textDecorationLine: "underline", color: "#127880", fontWeight: "800" },
    clozeBlankFilled: { color: "#047857", textDecorationLine: "none" },
    choice: { borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 8 },
    choiceText: { fontWeight: "600", color: colors.text },
    result: { alignItems: "center", paddingVertical: 28 },
    pct: { fontSize: 40, fontWeight: "800", color: colors.navy },
    mapGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    mapChip: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 12, minWidth: "47%", flexGrow: 1 },
    mapBoard: { width: "100%", backgroundColor: "#d7e5db", borderRadius: 16, overflow: "visible", marginTop: 4, position: "relative" },
    mapMark: { position: "absolute", width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 20, alignItems: "center", justifyContent: "center" },
    mapIco: { fontSize: 22, lineHeight: 26 },
    mapHint: { marginTop: 8, fontSize: 12, color: colors.muted, fontWeight: "600" }
});
