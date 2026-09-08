import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { go } from "../nav";
import { Card, ScrollScreen, Badge, Tap } from "../ui";
import { colors, examTrackName, DERS_ICON } from "../lib/theme";

// ============================================================
// BUGUN SCREEN
// ============================================================

export default function BugunScreen({ navigation }) {
    var app = useApp();
    var student = app.student;
    var plan = app.plan;
    var isDark = app.dark;

    // ---------- User ----------
    var name = student.profile && student.profile.name;
    var level = (student.userProfile && student.userProfile.educationLevel) || "lisans";

    // ---------- Dashboard ----------
    var dash = StudyPlanner.studyDashboard ? StudyPlanner.studyDashboard(student) : null;

    // ---------- Exam Line ----------
    var examLine;
    if (plan.daysLeft == null) {
        examLine = examTrackName(level) + " · sınav tarihi yok";
    } else if (plan.daysLeft < 0) {
        examLine = examTrackName(level) + " tarihi geçti";
    } else if (plan.daysLeft === 0) {
        examLine = examTrackName(level) + " bugün";
    } else {
        examLine = examTrackName(level) + "’ye " + plan.daysLeft + " gün kaldı";
    }

    // ---------- Study Plan ----------
    var saved = student.userProfile && student.userProfile.studyPlan;
    var todayId = StudentStore.planDayId();
    var today = saved && saved.ready && saved.days && saved.days[todayId];

    // ---------- Today's Plan Text ----------
    var planText = "Her güne ayrı ders ve saat yaz.";
    if (today && today.on && today.slots && today.slots.length) {
        planText = today.slots
            .map(function (s) { 
                var hourText = s.hours === 0.5 ? "30 dk" : s.hours + " sa";
                return s.ders + " · " + hourText; 
            })
            .join("  ·  ");
    }

    var isPlanReady = !!(saved && saved.ready);
    var DERS_ACCENT = { "Tarih": "#ea580c", "Coğrafya": "#059669", "Türkçe": "#2563eb", "Vatandaşlık": "#7c3aed", "Güncel Bilgiler": "#db2777" };
    var todaySlots = (today && today.on ? (today.slots || []) : []).filter(Boolean);
    var checks = (StudentStore.planChecksToday && StudentStore.planChecksToday()) || {};
    var goalH = StudentStore.daySlotHours ? StudentStore.daySlotHours({ slots: todaySlots }) : 0;
    var doneH = 0;
    todaySlots.forEach(function (s) { if (checks[s.ders]) doneH += Number(s.hours) || 0; });
    var pct = goalH > 0 ? Math.round((doneH / goalH) * 100) : 0;
    var workToday = !!(isPlanReady && today && today.on && todaySlots.length);
    var restMsgs = [
        "Bugün dinlenme günü ☕ Zihnini şarj et, yarın maratona devam!",
        "Mola da programın parçası. Bugün toparlan, yarın daha keskin olursun.",
        "Serbest gün. Kısa yürüyüş, su, erken uyku — yarın bloklara tam güç."
    ];
    var restText = restMsgs[new Date().getDate() % restMsgs.length];

    function fmtH(n) {
        var x = Number(n) || 0;
        if (x === 1) return "1 saat";
        if (x === 0.5) return "30 dk";
        if (x % 1 === 0.5) return Math.floor(x) + ",5 saat";
        return x + " saat";
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <ScrollScreen dark={isDark} noBottom>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, isDark && styles.textMuted]}>
                        Hoş geldin{name ? ", " + name : ""}
                    </Text>
                    <Text style={[styles.title, isDark && styles.textLight]}>
                        Bugün
                    </Text>
                </View>
                {dash && dash.streak > 0 && (
                    <View style={styles.streakBadge}>
                        <Text style={styles.streakText}>🔥 {dash.streak}</Text>
                    </View>
                )}
            </View>

            {/* Exam Banner */}
            <View style={[styles.banner, { backgroundColor: colors.indigo }]}>
                <Text style={styles.bannerLabel}>Sınav Takvimi</Text>
                <Text style={styles.bannerText}>{examLine}</Text>
                {plan.daysLeft != null && plan.daysLeft > 0 && plan.daysLeft <= 30 && (
                    <View style={styles.bannerDays}>
                        <Text style={styles.bannerDaysText}>{plan.daysLeft} gün</Text>
                    </View>
                )}
            </View>

            {/* Study Plan Card */}
            <Card style={[isDark && styles.cardDark]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, isDark && styles.textMuted]}>📅 Bugünün hedefi</Text>
                    <Tap onPress={function () { go(navigation, "Program"); }}>
                        <Text style={styles.cardAction}>{isPlanReady ? "Düzenle" : "Oluştur"}</Text>
                    </Tap>
                </View>
                {workToday ? (
                    <View>
                        <Text style={[styles.planText, isDark && styles.textLight]}>{fmtH(doneH)} / {fmtH(goalH)} tamamlandı</Text>
                        <View style={[styles.progressBar, { marginBottom: 10 }]}>
                            <View style={[styles.progressFill, { width: Math.min(100, pct) + "%", backgroundColor: colors.indigo }]} />
                        </View>
                        {todaySlots.map(function (s, i) {
                            var done = !!checks[s.ders];
                            var next = !done && todaySlots.slice(0, i).every(function (x) { return checks[x.ders]; });
                            return (
                                <View key={s.ders} style={[styles.taskRow, { borderLeftColor: DERS_ACCENT[s.ders] || colors.indigo }]}>
                                    <Tap onPress={function () { StudentStore.togglePlanSlot(s.ders); }} style={[styles.taskCheck, done && styles.taskCheckOn]}>
                                        <Text style={styles.taskCheckText}>{done ? "✓" : ""}</Text>
                                    </Tap>
                                    <Tap onPress={function () { go(navigation, "KonuList", { ders: s.ders }); }} style={{ flex: 1 }}>
                                        <Text style={[styles.taskName, isDark && styles.textLight]}>
                                            {(DERS_ICON[s.ders] || "📚") + "  " + s.ders}
                                        </Text>
                                        <Text style={[styles.statusText, isDark && styles.textMuted]}>
                                            {fmtH(s.hours)} · {done ? "Tamamlandı" : (next ? "Sıradaki" : "Bekliyor")}
                                        </Text>
                                    </Tap>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <Text style={[styles.planText, isDark && styles.textLight]}>
                        {isPlanReady ? restText : "Her güne ders ve saat yaz."}
                    </Text>
                )}
            </Card>

            {/* Stats Card */}
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.cardTitle, isDark && styles.textMuted, { marginBottom: 12 }]}>
                    İstatistikler
                </Text>
                {dash ? (
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.teal }]}>
                                {dash.streak}
                            </Text>
                            <Text style={[styles.statLabel, isDark && styles.textMuted]}>
                                Seri
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.teal }]}>
                                {dash.avgSeansMin || "—"}
                            </Text>
                            <Text style={[styles.statLabel, isDark && styles.textMuted]}>
                                Seans (dk)
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.teal }]}>
                                {dash.totalHours}
                            </Text>
                            <Text style={[styles.statLabel, isDark && styles.textMuted]}>
                                Toplam Saat
                            </Text>
                        </View>
                    </View>
                ) : (
                    <Text style={[styles.emptyText, isDark && styles.textMuted]}>
                        Çalışmaya başlayınca istatistikler burada görünecek.
                    </Text>
                )}
            </Card>

            {/* Weekly Progress - Optional */}
            {dash && dash.actualWeekH > 0 && (
                <Card style={[isDark && styles.cardDark]}>
                    <Text style={[styles.cardTitle, isDark && styles.textMuted, { marginBottom: 8 }]}>
                        Haftalık İlerleme
                    </Text>
                    <View style={styles.progressRow}>
                        <View style={styles.progressLabel}>
                            <Text style={[styles.progressText, isDark && styles.textLight]}>
                                {dash.actualWeekH} / {dash.plannedWeek || 0} saat
                            </Text>
                        </View>
                        <View style={[styles.progressBar, isDark && { backgroundColor: colors.navyDeep }]}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { 
                                        width: (dash.plannedWeek ? Math.min(100, (dash.actualWeekH / dash.plannedWeek) * 100) : 0) + "%",
                                        backgroundColor: colors.indigo
                                    }
                                ]} 
                            />
                        </View>
                    </View>
                </Card>
            )}

            {/* Footer */}
            <Text style={[styles.footer, isDark && styles.textMuted]}>
                Her gün bir adım ileri
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
        marginBottom: 16,
    },
    greeting: {
        color: colors.muted,
        fontSize: 13,
        fontWeight: "500",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.navy,
        marginTop: 2,
    },
    streakBadge: {
        backgroundColor: colors.amber + "15",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.amber + "30",
    },
    streakText: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.amber,
    },

    // ---------- Banner ----------
    banner: {
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
    },
    bannerLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    bannerText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 4,
    },
    bannerDays: {
        marginTop: 8,
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bannerDaysText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    // ---------- Card ----------
    cardDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    cardAction: {
        color: colors.indigo,
        fontWeight: "600",
        fontSize: 13,
    },

    // ---------- Plan ----------
    planText: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
        marginBottom: 8,
    },
    planStatus: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.emerald,
    },
    statusText: {
        fontSize: 11,
        color: colors.muted,
    },
    taskRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderLeftWidth: 4,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: "#FAFAF9",
        marginBottom: 8
    },
    taskCheck: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: "#D6D3D1",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff"
    },
    taskCheckOn: {
        backgroundColor: "#059669",
        borderColor: "#059669"
    },
    taskCheckText: {
        color: "#fff",
        fontWeight: "800"
    },
    taskName: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.text
    },

    // ---------- Stats ----------
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "700",
    },
    statLabel: {
        color: colors.muted,
        fontSize: 11,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: colors.border,
    },

    // ---------- Empty ----------
    emptyText: {
        color: colors.muted,
        fontSize: 13,
        textAlign: "center",
        paddingVertical: 8,
    },

    // ---------- Progress ----------
    progressRow: {
        marginTop: 4,
    },
    progressLabel: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    progressText: {
        fontSize: 13,
        color: colors.text,
        fontWeight: "500",
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: "#F5F5F4",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
    },

    // ---------- Footer ----------
    footer: {
        textAlign: "center",
        fontSize: 12,
        color: colors.muted,
        marginTop: 16,
        marginBottom: 8,
    },
});