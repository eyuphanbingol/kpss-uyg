import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { KpssConfig } from "../lib/config";
import { go } from "../nav";
import { Card, ScrollScreen, Badge } from "../ui";
import { colors, DERS_ICON, masteryLabel } from "../lib/theme";

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
        <ScrollScreen dark={isDark}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, isDark && styles.textLight]}>
                        Dersler
                    </Text>
                    <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                        Not oku, test çöz. Konular sırayla açılır.
                    </Text>
                </View>
            </View>

            {/* Ders Listesi */}
            {Object.keys(kpssData).map(function (ders) {
                var s = stats[ders] || { konuSayisi: 0, soruSayisi: 0 };
                return (
                    <Pressable 
                        key={ders} 
                        onPress={function () { go(navigation, "KonuList", { ders: ders }); }}
                    >
                        <Card style={[styles.dersCard, isDark && styles.cardDark]}>
                            <View style={styles.dersRow}>
                                <Text style={styles.dersIcon}>{DERS_ICON[ders] || "📚"}</Text>
                                <View style={styles.dersInfo}>
                                    <Text style={[styles.dersName, isDark && styles.textLight]}>{ders}</Text>
                                    <Text style={[styles.dersMeta, isDark && styles.textMuted]}>
                                        {s.konuSayisi} konu · {s.soruSayisi} soru
                                    </Text>
                                </View>
                                <Text style={[styles.dersArrow, isDark && styles.textMuted]}>→</Text>
                            </View>
                        </Card>
                    </Pressable>
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
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Dersler</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.konuHeader}>
                <Text style={styles.konuIcon}>{DERS_ICON[ders] || "📚"}</Text>
                <Text style={[styles.konuTitle, isDark && styles.textLight]}>{ders}</Text>
                <Text style={[styles.konuSubtitle, isDark && styles.textMuted]}>
                    {konular.length} konu
                </Text>
            </View>

            {/* Konu Listesi */}
            {konular.map(function (konu, idx) {
                var kd = app.kpssData[ders][konu] || {};
                var tp = topics[konu] || { mastery: "yok", lastPct: null, attempts: 0 };
                var open = StudentStore.isKonuOpen(ders, konular, idx, app.kpssData);
                var done = StudentStore.topicComplete(tp, kd);
                var m = masteryLabel(tp.mastery);

                return (
                    <Pressable 
                        key={konu} 
                        disabled={!open} 
                        onPress={function () { 
                            if (open) go(navigation, "KonuHub", { ders: ders, konu: konu }); 
                        }}
                    >
                        <Card style={[
                            styles.konuCard,
                            !open && styles.konuCardLocked,
                            isDark && styles.cardDark,
                            done && styles.konuCardDone,
                        ]}>
                            <View style={styles.konuRow}>
                                <View style={styles.konuLeft}>
                                    <View style={[
                                        styles.konuStatus,
                                        done && styles.konuStatusDone,
                                        !open && styles.konuStatusLocked,
                                    ]}>
                                        <Text style={styles.konuStatusText}>
                                            {done ? "✓" : open ? (idx + 1) : "🔒"}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.konuName, isDark && styles.textLight]}>
                                            {konu}
                                        </Text>
                                        <Text style={[styles.konuMeta, isDark && styles.textMuted]}>
                                            {open 
                                                ? ((kd.notlar || []).length + " not · " + (kd.sorular || []).length + " soru")
                                                : "Önce önceki konuyu bitir"
                                            }
                                        </Text>
                                    </View>
                                </View>
                                {open && (
                                    <View style={styles.konuRight}>
                                        <Text style={[styles.konuScore, isDark && styles.textLight]}>
                                            {tp.lastPct == null ? "—" : "%" + tp.lastPct}
                                        </Text>
                                        <Text style={[styles.konuLevel, { color: m.color }]}>
                                            {m.text}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Card>
                    </Pressable>
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
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Konular</Text>
            </Pressable>

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
            <Pressable onPress={function () { go(navigation, "Notes", { ders: ders, konu: konu }); }}>
                <Card style={[styles.hubNoteCard, isDark && styles.cardDark]}>
                    <Text style={styles.hubNoteIcon}>📖</Text>
                    <Text style={[styles.hubNoteTitle, isDark && styles.textLight]}>
                        Konu Özeti
                    </Text>
                    <Text style={[styles.hubNoteDesc, isDark && styles.textMuted]}>
                        {notlar.length} hap not · {tp.notesDone ? "tamamlandı" : "kaldığın yerden"}
                    </Text>
                </Card>
            </Pressable>

            {/* Test packs */}
            {packs.length ? (
                <View>
                    <Text style={[styles.hubStat, isDark && styles.textMuted, { marginBottom: 8 }]}>
                        {sorular.length} soru · 25’lik testler
                    </Text>
                    {packs.map(function (p, pi) {
                        return (
                            <Pressable key={p.no} onPress={function () {
                                openTopicPack(navigation, ders, konu, sorular, pi);
                            }}>
                                <Card style={[styles.hubTestCard, isDark && styles.cardDark]}>
                                    <Text style={styles.hubTestIcon}>{p.no}</Text>
                                    <Text style={[styles.hubTestTitle, isDark && styles.textLight]}>
                                        Test {p.no}
                                    </Text>
                                    <Text style={[styles.hubTestDesc, isDark && styles.textMuted]}>
                                        {p.items.length} soru
                                    </Text>
                                </Card>
                            </Pressable>
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
    },
    dersName: {
        fontWeight: "700",
        fontSize: 16,
        color: colors.text,
    },
    dersMeta: {
        color: colors.muted,
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
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        flexWrap: "wrap",
    },
    konuIcon: {
        fontSize: 28,
        marginRight: 10,
    },
    konuTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.navy,
        flex: 1,
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
    },
    konuMeta: {
        color: colors.muted,
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
        fontSize: 24,
        fontWeight: "700",
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
        backgroundColor: "#FFF7ED",
        marginBottom: 10,
        alignItems: "center",
        paddingVertical: 18,
    },
    hubNoteIcon: {
        fontSize: 28,
    },
    hubNoteTitle: {
        fontWeight: "700",
        fontSize: 17,
        color: colors.text,
        marginTop: 4,
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