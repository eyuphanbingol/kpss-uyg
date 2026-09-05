import React from "react";
import { Alert, Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { go } from "../nav";
import { Card, ScrollScreen, Badge } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";

// ============================================================
// EKSIKLER SCREEN
// ============================================================

export default function EksiklerScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var plan = app.plan;

    // ---------- Group by Ders ----------
    var byDers = {};
    plan.rows.forEach(function (r) {
        if (!byDers[r.ders]) byDers[r.ders] = [];
        byDers[r.ders].push(r);
    });

    // ---------- Start Review ----------
    function start(kind) {
        var pool = kind === "review" ? plan.due : plan.wrong;
        if (!pool.length) return;
        go(navigation, "Test", { mode: kind, items: pool.slice(0, 30) });
    }

    // ---------- Stats ----------
    var totalTopics = plan.rows.length;
    var completedTopics = plan.rows.filter(function (r) {
        return StudentStore.topicComplete(StudentStore.getTopic(r.ders, r.konu), {
            sorular: new Array(r.soruSayisi || 0),
            notlar: new Array(r.notSayisi || 0)
        });
    }).length;
    var progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <ScrollScreen dark={isDark}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, isDark && styles.textLight]}>
                        Eksikler
                    </Text>
                    <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                        Konu durumu ve tekrar ihtiyaçları
                    </Text>
                </View>
                <Badge 
                    type={progress >= 80 ? "success" : progress >= 50 ? "warning" : "muted"}
                    title={progress + "%"}
                />
            </View>

            {/* Progress */}
            <View style={[styles.progressContainer, isDark && { backgroundColor: colors.navyDeep }]}>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { 
                                width: progress + "%",
                                backgroundColor: progress >= 80 ? colors.emerald : 
                                               progress >= 50 ? colors.amber : 
                                               colors.indigo
                            }
                        ]} 
                    />
                </View>
                <Text style={[styles.progressText, isDark && styles.textMuted]}>
                    {completedTopics} / {totalTopics} konu tamamlandı
                </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <Pressable 
                    disabled={!plan.due.length} 
                    onPress={function () { start("review"); }} 
                    style={[
                        styles.actionBtn, 
                        styles.reviewBtn,
                        !plan.due.length && styles.actionBtnDisabled,
                        isDark && styles.actionBtnDark
                    ]}
                >
                    <Text style={styles.actionBtnTitle}>
                        Bugün Tekrar
                    </Text>
                    <Text style={styles.actionBtnCount}>
                        {plan.due.length} soru
                    </Text>
                    <Text style={styles.actionBtnDesc}>
                        Daha önce çözdüğün sorular
                    </Text>
                </Pressable>

                <Pressable 
                    disabled={!plan.wrong.length} 
                    onPress={function () { start("wrong"); }} 
                    style={[
                        styles.actionBtn, 
                        styles.wrongBtn,
                        !plan.wrong.length && styles.actionBtnDisabled,
                        isDark && styles.actionBtnDark
                    ]}
                >
                    <Text style={styles.actionBtnTitle}>
                        Yanlış Defteri
                    </Text>
                    <Text style={[styles.actionBtnCount, { color: colors.rose }]}>
                        {plan.wrong.length} soru
                    </Text>
                    <Text style={styles.actionBtnDesc}>
                        Yanlış yaptığın sorular. Çözdüğün düşer.
                    </Text>
                </Pressable>
            </View>

            {/* Ders Listesi */}
            {Object.keys(byDers).map(function (ders) {
                var dersTopics = byDers[ders] || [];
                var doneCount = dersTopics.filter(function (r) {
                    return StudentStore.topicComplete(StudentStore.getTopic(r.ders, r.konu), {
                        sorular: new Array(r.soruSayisi || 0),
                        notlar: new Array(r.notSayisi || 0)
                    });
                }).length;

                return (
                    <View key={ders} style={styles.dersSection}>
                        <View style={styles.dersHeader}>
                            <View style={styles.dersTitleRow}>
                                <Text style={styles.dersIcon}>{DERS_ICON[ders] || "📚"}</Text>
                                <Text style={[styles.dersName, isDark && styles.textLight]}>{ders}</Text>
                            </View>
                            <Text style={[styles.dersProgress, isDark && styles.textMuted]}>
                                {doneCount}/{dersTopics.length}
                            </Text>
                        </View>

                        {dersTopics.map(function (r) {
                            var done = StudentStore.topicComplete(StudentStore.getTopic(r.ders, r.konu), {
                                sorular: new Array(r.soruSayisi || 0),
                                notlar: new Array(r.notSayisi || 0)
                            });

                            return (
                                <View 
                                    key={r.konu} 
                                    style={[
                                        styles.topicRow,
                                        done && styles.topicRowDone,
                                        isDark && styles.topicRowDark,
                                        !done && isDark && { borderBottomColor: colors.muted }
                                    ]}
                                >
                                    <Text style={[
                                        styles.topicName, 
                                        isDark && styles.textLight,
                                        !done && { opacity: 0.45 }
                                    ]}>
                                        {r.konu}
                                    </Text>
                                    <View style={styles.topicStatus}>
                                        <View style={[
                                            styles.topicDot,
                                            done ? styles.topicDotDone : styles.topicDotPending
                                        ]} />
                                        <Text style={[
                                            styles.topicStatusText,
                                            done ? styles.topicStatusDone : styles.topicStatusPending,
                                            isDark && done && { color: colors.emerald }
                                        ]}>
                                            {done ? "Tamamlandı" : "Bekliyor"}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                );
            })}

            {/* Empty State */}
            {Object.keys(byDers).length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🎯</Text>
                    <Text style={[styles.emptyTitle, isDark && styles.textLight]}>
                        Henüz Konu Yok
                    </Text>
                    <Text style={[styles.emptyDesc, isDark && styles.textMuted]}>
                        Derslerden çalışmaya başladıkça 
                        konular burada görünecek.
                    </Text>
                </View>
            )}

            {/* Footer */}
            <Text style={[styles.footer, isDark && styles.textMuted]}>
                {totalTopics > 0 ? totalTopics + " konu takip ediliyor" : "Henüz konu eklenmemiş"}
            </Text>
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

    // ---------- Header ----------
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
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

    // ---------- Progress ----------
    progressContainer: {
        backgroundColor: "#F5F5F4",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: "#E7E5E4",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
    },
    progressText: {
        color: colors.muted,
        fontSize: 12,
        marginTop: 6,
        textAlign: "center",
    },

    // ---------- Action Buttons ----------
    actionRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    actionBtn: {
        flex: 1,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
    },
    actionBtnDisabled: {
        opacity: 0.4,
    },
    actionBtnDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    reviewBtn: {
        backgroundColor: colors.teal,
        borderColor: colors.teal,
    },
    wrongBtn: {
        backgroundColor: "transparent",
        borderColor: colors.rose,
        borderWidth: 2,
    },
    actionBtnTitle: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    actionBtnCount: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 18,
        marginTop: 2,
    },
    actionBtnDesc: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 10,
        marginTop: 4,
    },

    // ---------- Ders Section ----------
    dersSection: {
        marginBottom: 14,
    },
    dersHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    dersTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    dersIcon: {
        fontSize: 18,
        marginRight: 6,
    },
    dersName: {
        fontWeight: "700",
        fontSize: 15,
        color: colors.text,
    },
    dersProgress: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "500",
    },

    // ---------- Topic Row ----------
    topicRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F4",
    },
    topicRowDone: {
        borderBottomColor: colors.emerald + "20",
    },
    topicRowDark: {
        borderBottomColor: colors.muted,
    },
    topicName: {
        fontSize: 14,
        color: colors.text,
        flex: 1,
        paddingRight: 8,
    },
    topicStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    topicDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    topicDotDone: {
        backgroundColor: colors.emerald,
    },
    topicDotPending: {
        backgroundColor: colors.muted,
    },
    topicStatusText: {
        fontSize: 11,
        fontWeight: "600",
    },
    topicStatusDone: {
        color: colors.emerald,
    },
    topicStatusPending: {
        color: colors.muted,
    },

    // ---------- Empty ----------
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
    },
    emptyDesc: {
        fontSize: 14,
        color: colors.muted,
        textAlign: "center",
        marginTop: 4,
    },

    // ---------- Footer ----------
    footer: {
        textAlign: "center",
        fontSize: 12,
        color: colors.muted,
        marginTop: 8,
        marginBottom: 4,
    },
});