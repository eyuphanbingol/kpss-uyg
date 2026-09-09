import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { go } from "../nav";
import { Card, ScrollScreen, PageHeader, Tap } from "../ui";
import { colors, examTrackName, DERS_ICON } from "../lib/theme";

var DASH_COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];
var WEEK_BAR = ["#CBD5E1", "#94A3B8", "#64748B", "#D97706", "#F59E0B", "#FCD34D", "#E2E8F0"];
var DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
var DERS_ACCENT = { "Tarih": "#ea580c", "Coğrafya": "#059669", "Türkçe": "#2563eb", "Vatandaşlık": "#7c3aed", "Güncel Bilgiler": "#db2777" };

function fmtH(n) {
    var x = Number(n) || 0;
    if (x === 1) return "1 saat";
    if (x === 0.5) return "30 dk";
    if (x % 1 === 0.5) return Math.floor(x) + ",5 saat";
    return x + " saat";
}

function Spark({ values, color }) {
    var max = 1;
    (values || []).forEach(function (v) { if (v > max) max = v; });
    return (
        <View style={styles.spark}>
            {(values || []).map(function (v, i) {
                var h = Math.max(4, Math.round((v / max) * 72));
                return (
                    <View key={i} style={styles.sparkCol}>
                        <View style={[styles.sparkFill, { height: h, backgroundColor: color }]} />
                    </View>
                );
            })}
        </View>
    );
}

export default function BugunScreen({ navigation }) {
    var app = useApp();
    var student = app.student;
    var plan = app.plan;
    var isDark = app.dark;
    var name = student.profile && student.profile.name;
    var level = (student.userProfile && student.userProfile.educationLevel) || "lisans";
    var dash = StudyPlanner.studyDashboard ? StudyPlanner.studyDashboard(student) : null;

    var examLine;
    if (plan.daysLeft == null) examLine = examTrackName(level) + " · sınav tarihi yok";
    else if (plan.daysLeft < 0) examLine = examTrackName(level) + " tarihi geçti";
    else if (plan.daysLeft === 0) examLine = examTrackName(level) + " bugün";
    else examLine = examTrackName(level) + "’ye " + plan.daysLeft + " gün kaldı";

    var saved = student.userProfile && student.userProfile.studyPlan;
    var todayId = StudentStore.planDayId();
    var today = saved && saved.ready && saved.days && saved.days[todayId];
    var isPlanReady = !!(saved && saved.ready);
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
    var goalLine = todaySlots.map(function (s) { return fmtH(s.hours) + " " + s.ders; }).join(" · ");

    var weekMax = 1;
    var weekMin = (dash && dash.weekMin) || [0, 0, 0, 0, 0, 0, 0];
    weekMin.forEach(function (v) { if (v > weekMax) weekMax = v; });
    var weeks = (dash && dash.weeks) || [];
    var trendVals = weeks.map(function (w) { return w.minutes || 0; });
    var weekGoalPct = dash && dash.plannedWeek ? Math.min(100, Math.round((dash.actualWeekH / dash.plannedWeek) * 100)) : (dash && dash.actualWeekH ? 100 : 0);
    var todayGoal = dash ? dash.todayPlanH : 0;
    var todayH = dash ? Math.round((dash.todayMin / 60) * 10) / 10 : 0;
    var todayPct = todayGoal ? Math.min(100, Math.round((todayH / todayGoal) * 100)) : (todayH ? 100 : 0);
    var rec = dash && dash.longest && dash.longest.minutes
        ? (Math.round((dash.longest.minutes / 60) * 10) / 10 + " saat")
        : "—";
    var dersList = (dash && dash.dersList) || [];
    var dersSum = (dash && dash.dersSum) || 0;

    return (
        <ScrollScreen dark={isDark} noBottom>
            <PageHeader
                dark={isDark}
                title="Bugün"
                subtitle="Hedefine doğru her gün bir adım."
                kicker={
                    <View style={styles.greetRow}>
                        <View style={styles.liveDot} />
                        <Text style={[styles.greeting, isDark && styles.textMuted]} numberOfLines={1}>
                            Hoş geldin{name ? ", " + name : ""}
                        </Text>
                    </View>
                }
            />

            <LinearGradient colors={["#0F172A", "#1E293B"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
                <View style={styles.bannerRow}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.bannerLabel}>Sınav takvimi</Text>
                        <Text style={styles.bannerText}>{examLine}</Text>
                    </View>
                    {plan.daysLeft != null && plan.daysLeft > 0 ? (
                        <View style={styles.bannerDays}>
                            <Text style={styles.bannerDaysText}>{plan.daysLeft} gün</Text>
                        </View>
                    ) : null}
                </View>
            </LinearGradient>

            <Card dark={isDark}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, isDark && styles.textMuted]}>🗓️ Bugünün hedefi</Text>
                    <Tap onPress={function () { go(navigation, "Program"); }}>
                        <Text style={styles.cardAction}>{isPlanReady ? "Düzenle" : "Oluştur"}</Text>
                    </Tap>
                </View>
                {workToday ? (
                    <View>
                        <View style={styles.meterRow}>
                            <Text style={[styles.planText, { flex: 1, marginBottom: 0 }, isDark && styles.textLight]}>
                                {fmtH(doneH)} / {fmtH(goalH)} tamamlandı
                            </Text>
                            <Text style={styles.pctLabel}>{pct}%</Text>
                        </View>
                        <View style={[styles.progressBar, { marginTop: 8, marginBottom: 10 }]}>
                            <View style={[styles.progressFill, { width: Math.min(100, pct) + "%", backgroundColor: "#D97706" }]} />
                        </View>
                        <Text style={[styles.goalLine, isDark && styles.textMuted]}>Bugünkü hedef · {goalLine}</Text>
                        {todaySlots.map(function (s, i) {
                            var done = !!checks[s.ders];
                            var next = !done && todaySlots.slice(0, i).every(function (x) { return checks[x.ders]; });
                            var st = done ? "Tamamlandı" : (next ? "Sıradaki" : "Bekliyor");
                            return (
                                <View key={s.ders} style={[styles.taskRow, isDark && styles.taskRowDark, { borderLeftColor: DERS_ACCENT[s.ders] || "#4f46e5" }, done && { backgroundColor: "rgba(5,150,105,0.08)" }]}>
                                    <Tap onPress={function () { StudentStore.togglePlanSlot(s.ders); }} style={[styles.taskCheck, done && styles.taskCheckOn]}>
                                        <Text style={styles.taskCheckText}>{done ? "✓" : ""}</Text>
                                    </Tap>
                                    <Tap onPress={function () { go(navigation, "KonuList", { ders: s.ders }); }} style={styles.taskMain}>
                                        <Text style={styles.taskIco}>{DERS_ICON[s.ders] || "📚"}</Text>
                                        <Text style={[styles.taskName, isDark && styles.textLight]} numberOfLines={1}>{s.ders}</Text>
                                        <Text style={[styles.taskHrs, isDark && styles.textMuted]}>{s.hours === 0.5 ? "30 dk" : (s.hours + " sa")}</Text>
                                        <View style={[styles.stPill, done ? styles.stDone : (next ? styles.stNext : styles.stWait)]}>
                                            <Text style={[styles.stTxt, done ? styles.stDoneTxt : (next ? styles.stNextTxt : styles.stWaitTxt)]}>{st}</Text>
                                        </View>
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

            <View style={styles.secHead}>
                <Text style={[styles.cardTitle, isDark && styles.textMuted]}>📊 İstatistikler</Text>
                <View style={[styles.secLine, isDark && { backgroundColor: "#44403c" }]} />
            </View>

            {!dash ? (
                <Card dark={isDark}>
                    <Text style={[styles.emptyText, isDark && styles.textMuted]}>Çalışmaya başlayınca istatistikler burada görünecek.</Text>
                </Card>
            ) : (
                <View>
                    <View style={styles.kpiRow}>
                        <View style={[styles.kpi, isDark && styles.cardDark]}>
                            <Text style={[styles.kpiNum, { color: "#4f46e5" }]}>{dash.streak}</Text>
                            <Text style={[styles.kpiLab, isDark && styles.textMuted]}>🔥 seri gün</Text>
                        </View>
                        <View style={[styles.kpi, isDark && styles.cardDark]}>
                            <Text style={[styles.kpiNum, { color: "#d97706" }]}>{dash.avgSeansMin || "—"}</Text>
                            <Text style={[styles.kpiLab, isDark && styles.textMuted]}>⏱ dk / oturum</Text>
                        </View>
                        <View style={[styles.kpi, isDark && styles.cardDark]}>
                            <Text style={[styles.kpiNum, { color: "#059669" }]}>{rec}</Text>
                            <Text style={[styles.kpiLab, isDark && styles.textMuted]}>🏆 rekor gün</Text>
                        </View>
                    </View>

                    <Card dark={isDark} style={{ marginTop: 10 }}>
                        <View style={styles.meterRow}>
                            <Text style={[styles.statLine, isDark && styles.textLight]}>Toplam {dash.totalHours} saat</Text>
                            <Text style={[styles.kpiLab, { marginTop: 0 }]}>Bu hafta {dash.actualWeekH}/{dash.plannedWeek || 0} sa</Text>
                        </View>
                        <View style={[styles.progressBar, { height: 10, marginTop: 8 }]}>
                            <LinearGradient colors={["#6366f1", "#a855f7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: weekGoalPct + "%" }]} />
                        </View>
                        <View style={[styles.meterRow, { marginTop: 12 }]}>
                            <Text style={[styles.statLine, isDark && styles.textLight]}>Bugün {todayH} / {todayGoal || 0} saat</Text>
                            <Text style={{ color: "#4f46e5", fontWeight: "800", fontSize: 12 }}>{todayPct}%</Text>
                        </View>
                        <View style={[styles.progressBar, { height: 8, marginTop: 8 }]}>
                            <View style={[styles.progressFill, { width: todayPct + "%", backgroundColor: "#f59e0b" }]} />
                        </View>
                    </Card>

                    <Card dark={isDark} style={{ marginTop: 10 }}>
                        <Text style={[styles.chartTitle, isDark && styles.textLight]}>📈 Haftalık trend</Text>
                        <Spark values={trendVals} color="#4f46e5" />
                        <View style={styles.sparkLabs}>
                            <Text style={[styles.kpiLab, { marginTop: 0 }]}>8 hafta önce</Text>
                            <Text style={[styles.kpiLab, { marginTop: 0 }]}>bu hafta</Text>
                        </View>
                    </Card>

                    <Card dark={isDark} style={{ marginTop: 10 }}>
                        <Text style={[styles.chartTitle, isDark && styles.textLight]}>📅 Bu hafta</Text>
                        <View style={styles.weekBars}>
                            {weekMin.map(function (m, i) {
                                var h = Math.max(8, Math.round((m / weekMax) * 96));
                                return (
                                    <View key={i} style={styles.weekCol}>
                                        <View style={[styles.weekBar, { height: h, backgroundColor: WEEK_BAR[i % WEEK_BAR.length] }]} />
                                        <Text style={[styles.weekLab, isDark && styles.textMuted]}>{DAY_NAMES[i]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </Card>

                    <Card dark={isDark} style={{ marginTop: 10 }}>
                        <Text style={[styles.chartTitle, isDark && styles.textLight]}>📚 Ders dağılımı</Text>
                        {dersSum ? (
                            <View>
                                <View style={styles.stackBar}>
                                    {dersList.map(function (x, i) {
                                        return (
                                            <View key={x.ders} style={{ flex: x.v, backgroundColor: DASH_COLORS[i % DASH_COLORS.length], height: 12 }} />
                                        );
                                    })}
                                </View>
                                {dersList.slice(0, 5).map(function (x, i) {
                                    var p = Math.round((x.v / dersSum) * 100);
                                    return (
                                        <View key={x.ders} style={styles.dersRow}>
                                            <View style={[styles.dersDot, { backgroundColor: DASH_COLORS[i % DASH_COLORS.length] }]} />
                                            <Text style={[styles.dersName, isDark && styles.textLight]} numberOfLines={1}>{x.ders}</Text>
                                            <Text style={styles.dersPct}>{p}%</Text>
                                            <View style={[styles.miniBar, isDark && { backgroundColor: "#292524" }]}>
                                                <View style={{ width: p + "%", height: 6, borderRadius: 99, backgroundColor: DASH_COLORS[i % DASH_COLORS.length] }} />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <Text style={[styles.emptyText, isDark && styles.textMuted]}>Ders saati birikince pasta dolacak.</Text>
                        )}
                    </Card>
                </View>
            )}
        </ScrollScreen>
    );
}

var styles = StyleSheet.create({
    textLight: { color: "#fff" },
    textMuted: { color: colors.muted },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 },
    greetRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#34d399" },
    greeting: { color: colors.muted, fontSize: 13, fontWeight: "600", flex: 1 },
    title: { fontSize: 32, fontWeight: "900", color: colors.navy, marginTop: 4 },
    subtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
    themeBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    themeBtnDark: { backgroundColor: colors.navyDeep, borderColor: "#44403c" },
    banner: { borderRadius: 24, padding: 18, marginBottom: 16 },
    bannerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    bannerLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
    bannerText: { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 4 },
    bannerDays: { backgroundColor: "rgba(255,255,255,0.22)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
    bannerDaysText: { color: "#fff", fontSize: 13, fontWeight: "800" },
    cardDark: { backgroundColor: colors.navyDeep, borderColor: "#44403c" },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    cardTitle: { fontSize: 11, fontWeight: "800", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.6 },
    cardAction: { color: colors.indigo, fontWeight: "700", fontSize: 13 },
    planText: { fontSize: 15, color: colors.text, lineHeight: 22, fontWeight: "700", marginBottom: 8 },
    meterRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    pctLabel: { fontSize: 13, fontWeight: "800", color: "#4f46e5" },
    goalLine: { fontSize: 12, color: colors.muted, lineHeight: 18, marginBottom: 10 },
    taskRow: { flexDirection: "row", alignItems: "center", gap: 8, borderLeftWidth: 4, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, backgroundColor: "#FAFAF9", marginBottom: 8 },
    taskRowDark: { backgroundColor: "#1c1917" },
    taskCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: "#D6D3D1", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    taskCheckOn: { backgroundColor: "#059669", borderColor: "#059669" },
    taskCheckText: { color: "#fff", fontWeight: "800" },
    taskMain: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 6 },
    taskIco: { fontSize: 16 },
    taskName: { flex: 1, minWidth: 0, fontSize: 14, fontWeight: "800", color: colors.text },
    taskHrs: { fontSize: 11, fontWeight: "700", color: colors.muted },
    stPill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
    stNext: { backgroundColor: "#ccfbf1" },
    stWait: { backgroundColor: "#f5f5f4" },
    stDone: { backgroundColor: "#d1fae5" },
    stTxt: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
    stNextTxt: { color: "#0f766e" },
    stWaitTxt: { color: "#78716c" },
    stDoneTxt: { color: "#047857" },
    secHead: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18, marginBottom: 10 },
    secLine: { flex: 1, height: 1, backgroundColor: "#e7e5e4" },
    kpiRow: { flexDirection: "row", gap: 8 },
    kpi: { flex: 1, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 6, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border, alignItems: "center" },
    kpiNum: { fontSize: 20, fontWeight: "800" },
    kpiLab: { fontSize: 10, color: colors.muted, marginTop: 4, textAlign: "center", fontWeight: "600" },
    statLine: { fontSize: 14, fontWeight: "700", color: colors.text, flex: 1 },
    chartTitle: { fontSize: 14, fontWeight: "800", color: colors.text, marginBottom: 10 },
    spark: { height: 86, flexDirection: "row", alignItems: "flex-end", gap: 4 },
    sparkCol: { flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center" },
    sparkFill: { width: "70%", borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: "#4f46e5" },
    sparkLabs: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
    weekBars: { height: 120, flexDirection: "row", alignItems: "flex-end", gap: 6 },
    weekCol: { flex: 1, height: "100%", justifyContent: "flex-end", alignItems: "center" },
    weekBar: { width: "100%", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    weekLab: { fontSize: 10, color: colors.muted, marginTop: 6, fontWeight: "700" },
    stackBar: { flexDirection: "row", height: 12, borderRadius: 99, overflow: "hidden", marginBottom: 12, backgroundColor: "#e7e5e4" },
    dersRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
    dersDot: { width: 10, height: 10, borderRadius: 5 },
    dersName: { flex: 1, minWidth: 0, fontSize: 12, fontWeight: "700", color: colors.text },
    dersPct: { fontSize: 12, fontWeight: "800", color: colors.muted, width: 36, textAlign: "right" },
    miniBar: { width: 48, height: 6, borderRadius: 99, backgroundColor: "#e7e5e4", overflow: "hidden" },
    emptyText: { color: colors.muted, fontSize: 13, textAlign: "center", paddingVertical: 8 },
    progressBar: { height: 6, borderRadius: 99, backgroundColor: "#e7e5e4", overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 99 }
});
