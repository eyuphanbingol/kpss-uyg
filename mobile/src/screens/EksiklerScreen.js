import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { go } from "../nav";
import { ScrollScreen, Badge, Tap, PageHeader, ThemeToggle } from "../ui";
import { colors } from "../lib/theme";
import { AccentCard, PctBadge } from "../kit";

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
        <ScrollScreen dark={isDark} noBottom>
            <PageHeader
                dark={isDark}
                title="Eksikler"
                subtitle="Konu durumu ve tekrar ihtiyaçları"
                right={
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Badge
                            type={progress >= 80 ? "success" : progress >= 50 ? "warning" : "muted"}
                            title={progress + "%"}
                        />
                        <ThemeToggle dark={isDark} />
                    </View>
                }
            />

            {/* Progress */}
            <View style={[styles.progressContainer, isDark && { backgroundColor: colors.navyDeep }]}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: progress + "%" }]} />
                </View>
                <Text style={[styles.progressText, isDark && styles.textMuted]}>
                    {completedTopics} / {totalTopics} konu tamamlandı
                </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <Tap
                    disabled={!plan.due.length}
                    onPress={function () { start("review"); }}
                    style={[styles.actionBtn, !plan.due.length && styles.actionBtnDisabled, isDark && styles.actionBtnDark]}
                >
                    <Text style={[styles.actionBtnTitle, isDark && styles.textLight]}>Bugün Tekrar</Text>
                    <Text style={styles.actionBtnCount}>{plan.due.length} soru</Text>
                    <Text style={styles.actionBtnDesc}>Daha önce çözdüğün sorular</Text>
                </Tap>
                <Tap
                    disabled={!plan.wrong.length}
                    onPress={function () { start("wrong"); }}
                    style={[styles.actionBtn, !plan.wrong.length && styles.actionBtnDisabled, isDark && styles.actionBtnDark]}
                >
                    <Text style={[styles.actionBtnTitle, isDark && styles.textLight]}>Yanlış Defteri</Text>
                    <Text style={styles.actionBtnCount}>{plan.wrong.length} soru</Text>
                    <Text style={styles.actionBtnDesc}>Yanlış yaptığın sorular. Çözdüğün düşer.</Text>
                </Tap>
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
                            <Text style={[styles.dersName, isDark && styles.textLight]}>{ders}</Text>
                            <PctBadge label={doneCount + "/" + dersTopics.length} />
                        </View>

                        {dersTopics.map(function (r) {
                            var done = StudentStore.topicComplete(StudentStore.getTopic(r.ders, r.konu), {
                                sorular: new Array(r.soruSayisi || 0),
                                notlar: new Array(r.notSayisi || 0)
                            });

                            return (
                                <AccentCard key={r.konu} dark={isDark} accent={done ? "#D97706" : "#CBD5E1"}>
                                    <View style={styles.topicRowInner}>
                                        <Text style={[styles.topicName, isDark && styles.textLight]} numberOfLines={2}>{r.konu}</Text>
                                        <Badge type={done ? "warning" : "muted"} title={done ? "Tamam" : "Bekliyor"} />
                                    </View>
                                </AccentCard>
                            );
                        })}
                    </View>
                );
            })}

            {/* Empty State */}
            {Object.keys(byDers).length === 0 && (
                <View style={styles.emptyContainer}>
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
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        padding: 12,
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: "#E2E8F0",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
        backgroundColor: "#D97706",
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
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    actionBtnDisabled: {
        opacity: 0.4,
    },
    actionBtnDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    actionBtnTitle: {
        color: "#0F172A",
        fontWeight: "700",
        fontSize: 14,
    },
    actionBtnCount: {
        color: "#D97706",
        fontWeight: "800",
        fontSize: 18,
        marginTop: 2,
    },
    actionBtnDesc: {
        color: "#64748B",
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
        color: "#0F172A",
    },
    topicRowInner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
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