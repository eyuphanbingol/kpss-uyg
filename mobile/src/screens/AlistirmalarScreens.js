import React, { memo, useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View, StyleSheet, useWindowDimensions } from "react-native";
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
import { konuLabel } from "../lib/konuLabels";

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
            <PageHeader dark={isDark} title="Alıştırmalar" subtitle="Boşluk, harita ve oyunlar" />
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
                        <Text style={styles.meta}>Konuyu seç, isimleri haritaya yerleştir.</Text>
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
                                <Text style={[styles.dersName, isDark && styles.textLight]} numberOfLines={2}>{konuLabel(konu)}</Text>
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
                <Text style={[styles.konuTitle, isDark && styles.textLight]}>{konuLabel(konu)}</Text>
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
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>{konuLabel(konu)}</Text>
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
                            <Text style={[styles.choiceText, isDark && !picked && styles.textLight]}>{String(c).charAt(0).toLocaleUpperCase("tr-TR") + String(c).slice(1)}</Text>
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
                subtitle="Konu seç, turdaki isimleri haritaya yerleştir."
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
        </ScrollScreen>
    );
}

export function MapPlayScreen({ route, navigation }) {
    var topicId = route.params.topicId;
    var app = useApp();
    var isDark = app.dark;
    var win = useWindowDimensions();
    var insets = useSafeAreaInsets();
    var meta = MapQuiz.topicMeta(topicId);
    var _seed = useState(0);
    var seed = _seed[0];
    var setSeed = _seed[1];
    // Konunun tüm hedefleri tek oyunda, karışık sırayla sorulur.
    var round = useMemo(function () {
        return MapQuiz.pickPlaceRound ? MapQuiz.pickPlaceRound(topicId) : { items: [], chips: [] };
    }, [seed, topicId]);
    var items = round.items || [];
    var total = items.length;
    var layer = useMemo(function () {
        var want = {};
        items.forEach(function (it) { want[it.id] = true; });
        var pins = MapQuiz.topicPinsForPlay ? MapQuiz.topicPinsForPlay(topicId) : ((MapQuiz.topicLayer && MapQuiz.topicLayer(topicId).pins) || []);
        return { pins: pins.filter(function (p) { return want[p.id]; }) };
    }, [topicId, items]);
    var glyph = MapQuiz.topicGlyph ? MapQuiz.topicGlyph(topicId) : "📍";

    var _idx = useState(0); var idx = _idx[0]; var setIdx = _idx[1];
    var _solved = useState({}); var solved = _solved[0]; var setSolved = _solved[1];
    var _shown = useState({}); var shown = _shown[0]; var setShown = _shown[1];
    var _last = useState(null); var lastId = _last[0]; var setLastId = _last[1];
    var _miss = useState(0); var misses = _miss[0]; var setMisses = _miss[1];
    var _flash = useState(null); var flash = _flash[0]; var setFlash = _flash[1];
    var _d = useState(false); var done = _d[0]; var setDone = _d[1];
    var target = items[idx] || null;

    useEffect(function () {
        setIdx(0); setSolved({}); setShown({}); setLastId(null); setMisses(0); setFlash(null); setDone(false);
    }, [seed, topicId]);

    function advance(nextSolved) {
        var i = idx + 1;
        while (i < total && nextSolved[items[i].id]) i++;
        setIdx(i);
        if (i >= total) setTimeout(function () { setDone(true); }, 420);
    }

    function onPin(pinId) {
        if (!target || done || solved[pinId]) return;
        if (pinId === target.id) {
            var next = Object.assign({}, solved);
            next[pinId] = true;
            setSolved(next);
            setLastId(pinId);
            advance(next);
            return;
        }
        setMisses(misses + 1);
        setFlash(pinId);
        setTimeout(function () { setFlash(null); }, 560);
    }

    function reveal() {
        if (!target || done) return;
        var next = Object.assign({}, solved);
        next[target.id] = true;
        setSolved(next);
        setShown(Object.assign({}, shown, defineShown(target.id)));
        setLastId(target.id);
        setMisses(misses + 1);
        advance(next);
    }

    function defineShown(id) {
        var o = {};
        o[id] = true;
        return o;
    }

    var okCount = Object.keys(solved).filter(function (id) { return !shown[id]; }).length;

    if (done) {
        var pct = total ? Math.round((okCount / total) * 100) : 0;
        return (
            <ScrollScreen dark={isDark}>
                <PageHeader
                    dark={isDark}
                    title={meta ? meta.title : "Harita"}
                    subtitle={okCount + " / " + total + " doğru"}
                    onBack={function () { navigation.goBack(); }}
                />
                <Card style={[styles.result, isDark && styles.cardDark]}>
                    <Text style={[styles.pct, isDark && styles.textLight]}>%{pct}</Text>
                    <Text style={[styles.meta, isDark && styles.textMuted]}>
                        {okCount} doğru · {total - okCount} kaçtı{misses ? (" · " + misses + " yanlış deneme") : ""}
                    </Text>
                    <View style={{ marginTop: 14, width: "100%" }}>
                        {items.map(function (it) {
                            var ok = solved[it.id] && !shown[it.id];
                            return (
                                <View key={it.id} style={styles.resultRow}>
                                    <Text style={[styles.resultMark, { color: ok ? "#059669" : "#94A3B8" }]}>{ok ? "✓" : "•"}</Text>
                                    <Text style={[styles.resultName, isDark && styles.textLight]} numberOfLines={1}>{it.name}</Text>
                                </View>
                            );
                        })}
                    </View>
                    <PrimaryButton title="Tekrar oyna" onPress={function () { setSeed(seed + 1); }} style={{ marginTop: 16 }} />
                </Card>
            </ScrollScreen>
        );
    }

    var landscape = win.width > win.height;
    var playPad = {
        paddingTop: Math.max(insets.top, 8),
        paddingBottom: Math.max(insets.bottom, 8),
        paddingLeft: Math.max(insets.left, 10),
        paddingRight: Math.max(insets.right, 10)
    };

    return (
        <Screen dark={isDark} style={{ overflow: "hidden", backgroundColor: "#0c3d56" }} edges={[]}>
            <View key={win.width + "x" + win.height} style={[{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden" }, playPad]}>
                <View style={styles.mapAskRow}>
                    <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} style={{ marginBottom: 0 }} />
                    <Text style={[styles.kicker, { flex: 1, marginBottom: 0, minWidth: 0, color: "#d7c39a", textAlign: "right" }]} numberOfLines={1}>
                        {meta ? meta.title : "Harita"} · {okCount}/{total}
                    </Text>
                </View>
                <View style={styles.mapBar}>
                    <View style={[styles.mapBarFill, { width: (total ? Math.round((Object.keys(solved).length / total) * 100) : 0) + "%" }]} />
                </View>
                <View style={{ flex: 1, minHeight: 0, minWidth: 0, overflow: "hidden", marginTop: 8, borderRadius: 16 }}>
                    <TrMapView
                        mode="play"
                        place
                        pins={layer.pins || []}
                        glyph={glyph}
                        separate={topicId === "volkanik" ? 22 : (topicId === "kirik" ? 50 : 38)}
                        placed={solved}
                        shown={shown}
                        lastId={lastId}
                        flash={flash}
                        onPin={onPin}
                    />
                </View>
                <View style={styles.askBox}>
                    <Text style={styles.askKicker}>HARİTADA BUL VE DOKUN</Text>
                    <Text style={[styles.askName, landscape && { fontSize: 20 }]} numberOfLines={2}>{target ? target.name : ""}</Text>
                    <View style={styles.askRow}>
                        <Pressable onPress={reveal} style={styles.askSkip}>
                            <Text style={styles.askSkipTxt}>Bilmiyorum, göster</Text>
                        </Pressable>
                        <Text style={styles.askMeta}>{misses ? (misses + " yanlış") : "Hatasız"}</Text>
                    </View>
                </View>
            </View>
        </Screen>
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
    mapBar: { height: 5, borderRadius: 99, backgroundColor: "rgba(255,248,232,0.18)", overflow: "hidden", marginTop: 8 },
    mapBarFill: { height: 5, borderRadius: 99, backgroundColor: "#F59E0B" },
    askBox: { paddingTop: 10, alignItems: "center" },
    askKicker: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4, color: "#d7c39a" },
    askName: { fontSize: 24, fontWeight: "900", color: "#fff8e8", textAlign: "center", marginTop: 4 },
    askRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 10 },
    askSkip: {
        borderWidth: 1, borderColor: "rgba(244,228,180,0.38)", backgroundColor: "rgba(255,248,230,0.08)",
        paddingVertical: 12, paddingHorizontal: 18, borderRadius: 999, minHeight: 46, justifyContent: "center"
    },
    askSkipTxt: { color: "#f4e4b4", fontWeight: "700", fontSize: 14 },
    askMeta: { color: "#a8a29e", fontSize: 12 },
    resultRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 3 },
    resultMark: { fontWeight: "900", fontSize: 14, width: 14 },
    resultName: { fontSize: 14, color: "#334155", flex: 1 },
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
    mapHint: { marginTop: 8, fontSize: 12, color: colors.muted, fontWeight: "600" },
    placeHint: { marginTop: 8, marginBottom: 6, fontSize: 12, color: "#d7c39a", fontWeight: "700", textAlign: "center" },
    chipDock: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center", paddingBottom: 4 },
    placeChip: {
        backgroundColor: "#ead9a8",
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14
    },
    placeChipOn: { backgroundColor: "#fff4c4", transform: [{ scale: 1.04 }] },
    placeChipTxt: { color: "#2a2114", fontWeight: "800", fontSize: 13 }
});
