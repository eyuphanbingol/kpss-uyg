import React from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { KpssConfig } from "../lib/config";
import { go } from "../nav";
import { Card, ScrollScreen, Badge, BackChip, PageHeader } from "../ui";
import { colors, masteryLabel } from "../lib/theme";
import { AccentCard, PctBadge } from "../kit";

function itemsFromSorular(ders, konu, sorular) {
    return (sorular || []).map(function (q, idx) {
        var id = q.id != null ? q.id : idx;
        return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
    });
}

function openTopicPack(navigation, ders, konu, sorular, packIdx) {
    var packs = StudentStore.topicTestPacks(itemsFromSorular(ders, konu, sorular));
    var pack = packs[packIdx == null ? 0 : packIdx];
    if (!pack) return;
    var tp = StudentStore.getTopic(ders, konu);
    if (!StudentStore.isPackOpen(tp, pack.no)) return;
    go(navigation, "Test", {
        mode: "topic",
        ders: ders,
        konu: konu,
        testNo: pack.no,
        items: pack.items
    });
}

// ============================================================
// DERS HOME SCREEN
// ============================================================

export function DersHomeScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var kpssData = app.kpssData;
    var stats = StudyPlanner.catalogStats(kpssData);
    var edu = app.student.userProfile && app.student.userProfile.educationLevel;
    var tt = (app.student.userProfile && app.student.userProfile.targetType) || "B";
    var ids = (KpssConfig.targetModules && KpssConfig.targetModules[tt]) || ["gygk"];
    var mods = (KpssConfig.modules || []).filter(function (m) { return ids.indexOf(m.id) >= 0 && m.id !== "gygk"; });

    return (
        <ScrollScreen dark={isDark} noBottom>
            <PageHeader dark={isDark} title="Dersler" subtitle="Not oku, test çöz. Tüm konular açık." />

            {/* Ders Listesi */}
            {Object.keys(kpssData).map(function (ders) {
                var s = stats[ders] || { konuSayisi: 0, soruSayisi: 0 };
                return (
                    <AccentCard
                        key={ders}
                        dark={isDark}
                        chevron
                        onPress={function () { go(navigation, "KonuList", { ders: ders }); }}
                    >
                        <Text style={[styles.dersName, isDark && styles.textLight]}>{ders}</Text>
                        <Text style={styles.dersMeta}>
                            {s.konuSayisi} konu · {s.soruSayisi} soru
                        </Text>
                    </AccentCard>
                );
            })}

            {/* Modüller */}
            {edu === "lisans" && mods.length ? (
                <View style={styles.modulesSection}>
                    <Text style={[styles.modulesTitle, isDark && styles.textMuted]}>
                        Kulvarın Diğer Modülleri
                    </Text>
                    {mods.map(function (m) {
                        return (
                            <Card key={m.id} style={[isDark && styles.cardDark]}>
                                <View style={styles.moduleRow}>
                                    <View>
                                        <Text style={[styles.moduleName, isDark && styles.textLight]}>
                                            {m.title}
                                        </Text>
                                        <Text style={[styles.moduleDesc, isDark && styles.textMuted]}>
                                            {(m.lessons || []).slice(0, 3).join(" · ") || "İçerik bekleniyor"}
                                        </Text>
                                    </View>
                                    <Badge type="warning" title="Yakında" />
                                </View>
                            </Card>
                        );
                    })}
                </View>
            ) : null}
        </ScrollScreen>
    );
}

// ============================================================
// KONU LIST SCREEN
// ============================================================

export function KonuListScreen({ route, navigation }) {
    var ders = route.params.ders;
    var app = useApp();
    var isDark = app.dark;
    var konular = Object.keys(app.kpssData[ders] || {});
    var topics = (app.student.topics && app.student.topics[ders]) || {};

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <BackChip dark={isDark} label="Dersler" onPress={function () { navigation.goBack(); }} />
            <Text style={[styles.konuTitle, isDark && styles.textLight]}>{ders}</Text>
            <Text style={styles.konuSubtitle}>{konular.length} konu</Text>

            {konular.map(function (konu, idx) {
                var kd = app.kpssData[ders][konu] || {};
                var tp = topics[konu] || { mastery: "yok", lastPct: null, attempts: 0 };
                var open = StudentStore.isKonuOpen(ders, konular, idx, app.kpssData);

                var meta = open
                    ? (function () {
                        var packs = StudentStore.topicTestPacks(kd.sorular || []);
                        var nLen = (kd.notlar || []).length;
                        if (!packs.length) return nLen + " not · " + (kd.sorular || []).length + " soru";
                        var doneN = packs.filter(function (p) { return StudentStore.isPackComplete(tp, p.no); }).length;
                        return nLen + " not · " + doneN + "/" + packs.length + " test";
                    })()
                    : "Önce önceki konunun testlerini bitir";

                return (
                    <AccentCard
                        key={konu}
                        dark={isDark}
                        disabled={!open}
                        chevron={open}
                        onPress={function () {
                            if (open) go(navigation, "KonuHub", { ders: ders, konu: konu });
                        }}
                    >
                        <View style={styles.konuRow}>
                            <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                                <Text style={[styles.konuName, isDark && styles.textLight]} numberOfLines={2}>{konu}</Text>
                                <Text style={styles.konuMeta}>{meta}</Text>
                            </View>
                            {open ? (
                                <PctBadge label={tp.lastPct == null ? "—" : "%" + tp.lastPct} />
                            ) : null}
                        </View>
                    </AccentCard>
                );
            })}
        </ScrollScreen>
    );
}

// ============================================================
// KONU HUB SCREEN
// ============================================================

export function KonuHubScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var isDark = app.dark;
    var kd = (app.kpssData[ders] && app.kpssData[ders][konu]) || {};
    var tp = StudentStore.getTopic(ders, konu);
    var m = masteryLabel(tp.mastery);
    var notlar = kd.notlar || [];
    var sorular = kd.sorular || [];
    var packs = StudentStore.topicTestPacks(sorular);

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <BackChip dark={isDark} label="Konular" onPress={function () { navigation.goBack(); }} />

            {/* Header */}
            <View style={styles.hubHeader}>
                <Text style={[styles.hubTitle, isDark && styles.textLight]}>
                    {konu}
                </Text>
                <Text style={[styles.hubDers, isDark && styles.textMuted]}>
                    {ders}
                </Text>
                <View style={styles.hubStats}>
                    <Badge 
                        type={
                            m.color === colors.emerald ? "success" : 
                            m.color === colors.amber ? "warning" : 
                            m.color === colors.rose ? "danger" : "muted"
                        }
                        title={m.text}
                    />
                    <Text style={[styles.hubStat, isDark && styles.textMuted]}>
                        Son net {tp.lastPct == null ? "yok" : "%" + tp.lastPct}
                    </Text>
                    <Text style={[styles.hubStat, isDark && styles.textMuted]}>
                        {tp.attempts} deneme
                    </Text>
                </View>
            </View>

            {/* Notes Button */}
            <Card dark={isDark} onPress={function () { go(navigation, "Notes", { ders: ders, konu: konu }); }} style={styles.hubNoteCard}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <DersIconBox icon="📖" />
                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={[styles.hubNoteTitle, isDark && styles.textLight]}>
                                Konu Özeti
                            </Text>
                            <Text style={[styles.hubNoteDesc, isDark && styles.textMuted]}>
                                {notlar.length} hap not · {tp.notesDone ? "tamamlandı" : "kaldığın yerden"}
                            </Text>
                        </View>
                        <Text style={[styles.dersArrow, isDark && styles.textMuted]}>→</Text>
                    </View>
            </Card>

            {(tp.solvedCloze && tp.solvedCloze.length) ? (
                <Card dark={isDark} onPress={function () {
                    Alert.alert("Boşlukları sıfırla", "Bu konudaki çözülen boşluklar baştan gelsin mi?", [
                        { text: "Vazgeç", style: "cancel" },
                        { text: "Sıfırla", style: "destructive", onPress: function () { StudentStore.resetCloze(ders, konu); } }
                    ]);
                }} style={styles.hubTestCard}>
                        <Text style={[styles.hubTestTitle, isDark && styles.textLight]}>Boşlukları sıfırla</Text>
                        <Text style={[styles.hubTestDesc, isDark && styles.textMuted]}>Doğru çözülen boşluklar tekrar gelir.</Text>
                </Card>
            ) : null}

            {/* Test packs */}
            {packs.length ? (
                <View>
                    <Text style={[styles.hubStat, isDark && styles.textMuted, { marginBottom: 8 }]}>
                        {sorular.length} soru · 25’lik testler · sırayla bitir
                    </Text>
                    {packs.map(function (p, pi) {
                        var packDone = StudentStore.isPackComplete(tp, p.no);
                        var packOpen = StudentStore.isPackOpen(tp, p.no);
                        return (
                            <Card
                                key={p.no}
                                dark={isDark}
                                disabled={!packOpen}
                                onPress={function () {
                                    openTopicPack(navigation, ders, konu, sorular, pi);
                                }}
                                style={[
                                    styles.hubTestCard,
                                    packDone && styles.hubTestCardDone,
                                    !packOpen && styles.hubTestCardLocked
                                ]}
                            >
                                    <Text style={styles.hubTestIcon}>{packDone ? "✓" : p.no}</Text>
                                    <Text style={[styles.hubTestTitle, isDark && styles.textLight]}>
                                        Test {p.no}
                                    </Text>
                                    <Text style={[styles.hubTestDesc, isDark && styles.textMuted]}>
                                        {packDone ? "Çözüldü" : (packOpen ? (p.items.length + " soru") : ("Önce Test " + (p.no - 1) + "’i bitir"))}
                                    </Text>
                            </Card>
                        );
                    })}
                </View>
            ) : (
                <Text style={[styles.hubTestDesc, isDark && styles.textMuted]}>Bu konuya ait henüz soru yok.</Text>
            )}
        </ScrollScreen>
    );
}

// ============================================================
// STILLER
// ============================================================

var styles = StyleSheet.create({
    // ---------- Text Helpers ----------
    textLight: {
        color: "#fff",
    },
    textMuted: {
        color: colors.muted,
    },

    // ---------- Card ----------
    cardDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },

    // ---------- Header ----------
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.navy,
    },
    subtitle: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },

    // ---------- Ders ----------
    dersCard: {
        marginBottom: 8,
    },
    dersRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    dersIcon: {
        fontSize: 26,
        marginRight: 14,
    },
    dersInfo: {
        flex: 1,
        minWidth: 0,
    },
    dersName: {
        fontWeight: "700",
        fontSize: 16,
        color: colors.text,
    },
    dersMeta: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 1,
    },
    dersArrow: {
        color: colors.muted,
        fontSize: 16,
    },

    // ---------- Modules ----------
    modulesSection: {
        marginTop: 16,
    },
    modulesTitle: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    moduleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    moduleName: {
        fontWeight: "600",
        fontSize: 14,
        color: colors.text,
    },
    moduleDesc: {
        color: colors.muted,
        fontSize: 12,
        marginTop: 1,
    },

    // ---------- Back ----------
    backText: {
        color: colors.muted,
        fontWeight: "600",
        fontSize: 13,
        marginBottom: 4,
    },

    // ---------- Konu List ----------
    konuHeader: {
        marginVertical: 4,
        marginBottom: 12,
    },
    konuTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0F172A",
    },
    konuSubtitle: {
        color: colors.muted,
        fontSize: 13,
    },
    konuCard: {
        marginBottom: 6,
    },
    konuCardLocked: {
        opacity: 0.45,
    },
    konuCardDone: {
        borderColor: colors.emerald,
        borderWidth: 1,
    },
    konuRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    konuLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
        paddingRight: 8,
    },
    konuStatus: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F5F5F4",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    konuStatusDone: {
        backgroundColor: colors.emerald,
    },
    konuStatusLocked: {
        backgroundColor: "transparent",
    },
    konuStatusText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.text,
    },
    konuName: {
        fontWeight: "600",
        fontSize: 14,
        color: colors.text,
        flexShrink: 1,
    },
    konuMeta: {
        color: "#64748B",
        fontSize: 11,
        marginTop: 1,
    },
    konuRight: {
        alignItems: "flex-end",
    },
    konuScore: {
        fontWeight: "700",
        fontSize: 14,
        color: colors.text,
    },
    konuLevel: {
        fontSize: 11,
        fontWeight: "600",
    },

    // ---------- Konu Hub ----------
    hubHeader: {
        marginVertical: 8,
    },
    hubTitle: {
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: -0.5,
        color: colors.navy,
    },
    hubDers: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },
    hubStats: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 6,
        flexWrap: "wrap",
    },
    hubStat: {
        color: colors.muted,
        fontSize: 12,
    },
    hubNoteCard: {
        marginBottom: 10,
        paddingVertical: 14,
    },
    hubNoteIcon: {
        fontSize: 28,
    },
    hubNoteTitle: {
        fontWeight: "800",
        fontSize: 17,
        color: colors.text,
    },
    hubNoteDesc: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },
    hubTestCard: {
        marginBottom: 10,
        alignItems: "center",
        paddingVertical: 18,
    },
    hubTestCardDone: {
        borderColor: "#34d399",
        backgroundColor: "#ecfdf5",
    },
    hubTestCardLocked: {
        opacity: 0.45,
    },
    hubTestIcon: {
        fontSize: 28,
    },
    hubTestTitle: {
        fontWeight: "700",
        fontSize: 17,
        color: colors.text,
        marginTop: 4,
    },
    hubTestDesc: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },
});