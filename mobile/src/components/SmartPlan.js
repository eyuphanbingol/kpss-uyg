import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StudentStore } from "../lib/store";
import { StudyPlanner } from "../lib/planner";
import { SyncEngine } from "../lib/syncEngine";
import { KpssConfig } from "../lib/config";
import { SmartPlan as SP } from "../lib/smartPlan";
import { konuLabel } from "../lib/konuLabels";
import { go } from "../nav";
import { Card, Tap } from "../ui";

// Akıllı KPSS programı (motor: lib/smartPlan.js, web ile ortak). Bugün kartı ve ortak yardımcılar.

export var PLAN_ICON = { not: "📖", test: "🎯", tekrar: "🔁", zayif: "🩹", genel: "🧭", deneme: "📝" };

export function planSettingsOf(student) {
    return (student && student.userProfile && student.userProfile.smartPlan) || null;
}

export function savePlanSettings(next) {
    StudentStore.updateUserProfile({ smartPlan: next });
}

export function planTaskLabel(x) {
    var t = SP.taskTitle(x);
    if (x.kind === "deneme") return t;
    return t + " · " + x.ders + (x.konu ? " / " + konuLabel(x.konu) : "");
}

// Görevi başlat: ilgili not / konu / deneme ekranını aç.
export function runPlanTask(navigation, x, kpssData) {
    if (x.kind === "not") go(navigation, "Notes", { ders: x.ders, konu: x.konu });
    else if (x.kind === "test" || x.kind === "tekrar" || x.kind === "zayif") go(navigation, "KonuHub", { ders: x.ders, konu: x.konu });
    else if (x.kind === "genel") go(navigation, "KonuList", { ders: x.ders });
    else if (x.kind === "deneme") startPlanExam(navigation, kpssData);
}

function startPlanExam(navigation, kpssData) {
    if (!StudentStore.isPremium()) {
        var ws = SyncEngine.weekStart();
        var st = StudentStore.getState();
        var weekExams = (st.examAttempts || []).filter(function (a) { return a.at && a.at.slice(0, 10) >= ws; }).length;
        if (weekExams >= (KpssConfig.freeWeeklyExams || 2)) {
            Alert.alert("Kota doldu", "Ücretsiz haftalık tam deneme kotan doldu. Bugün karışık test çözebilirsin.", [
                { text: "Premium", onPress: function () { go(navigation, "Paywall"); } },
                { text: "Tamam", style: "cancel" }
            ]);
            return;
        }
    }
    var items = StudyPlanner.mixedQuiz(kpssData, ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"], 40);
    if (!items.length) { Alert.alert("Soru bulunamadı."); return; }
    go(navigation, "Test", { mode: "exam", items: items, seconds: 40 * 60 });
}

export function PlanTaskRow({ item, onToggle, onStart, dark }) {
    var x = item;
    return (
        <View style={[s.row, dark && s.rowDark, x.done && { opacity: 0.6 }]}>
            <Tap onPress={function () { onToggle(x); }} style={[s.check, dark && s.checkDark, x.done && s.checkOn]}
                accessibilityRole="checkbox" accessibilityState={{ checked: !!x.done }}
                accessibilityLabel={(x.done ? "Tamamlandı işaretini kaldır: " : "Tamamlandı olarak işaretle: ") + planTaskLabel(x)}>
                <Text style={s.checkTxt}>{x.done ? "✓" : ""}</Text>
            </Tap>
            <Text style={s.ico}>{PLAN_ICON[x.kind] || "•"}</Text>
            <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[s.rowTitle, dark && s.light, x.done && { textDecorationLine: "line-through" }]} numberOfLines={2}>{planTaskLabel(x)}</Text>
                <Text style={s.muted}>{SP.fmtMin(x.minutes)}{x.part ? " · parça" : ""}{x.kind === "zayif" && x.pct != null ? " · son net %" + x.pct : ""}</Text>
            </View>
            {!x.done && onStart ? (
                <Tap onPress={function () { onStart(x); }} style={[s.start, dark && s.startDark]} accessibilityRole="button" accessibilityLabel={"Başla: " + planTaskLabel(x)}>
                    <Text style={s.startTxt}>Başla</Text>
                </Tap>
            ) : null}
        </View>
    );
}

export function PlanPhaseBar({ plan, dark }) {
    var total = plan.days.length || 1;
    var seg = { ogrenme: 0, pekistirme: 0, son: 0 };
    var startOf = {};
    plan.days.forEach(function (d) { seg[d.phase] += 1; if (!startOf[d.phase]) startOf[d.phase] = d.date; });
    var keys = ["ogrenme", "pekistirme", "son"].filter(function (k) { return seg[k]; });
    return (
        <View>
            <View style={[s.phases, dark && { backgroundColor: "#44403c" }]}>
                {keys.map(function (k) {
                    return <View key={k} style={{ width: (seg[k] / total * 100) + "%", backgroundColor: SP.PHASES[k].color }} />;
                })}
            </View>
            <View style={s.legend}>
                {keys.map(function (k) {
                    return (
                        <View key={k} style={s.legendItem}>
                            <View style={[s.dot, { backgroundColor: SP.PHASES[k].color }]} />
                            <Text style={s.muted}>{SP.PHASES[k].label} · {SP.fmtDate(startOf[k])}’ten {seg[k]} gün</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export function SmartPlanCard({ navigation, student, kpssData, dark }) {
    var settings = planSettingsOf(student);
    var plan = useMemo(function () {
        return settings ? SP.generate(kpssData, student, settings) : null;
    }, [kpssData, student, settings]);
    var [missed, setMissed] = useState(0);

    // dün planlanıp yapılmayanlar: bir kez göster, sonra bugünün listesini "görüldü" olarak kaydet
    useEffect(function () {
        if (!plan || !plan.ok) return;
        var m = SP.missedSince(settings, plan);
        if (m.changed) {
            if (m.missed) setMissed(m.missed);
            savePlanSettings(Object.assign({}, settings, { seen: m.seen }));
        }
    }, [plan && plan.today, plan && plan.ok]);

    if (!settings) {
        return (
            <Tap onPress={function () { go(navigation, "Program", { mode: "wizard" }); }} accessibilityRole="button">
                <LinearGradient colors={["#0D2C4D", "#14607a", "#0f766e"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
                    <Text style={s.heroKicker}>AKILLI KPSS PROGRAMI</Text>
                    <Text style={s.heroTitle}>Sınavına kadar her gün hangi konuyu çalışacağını 1 dakikada çıkar.</Text>
                    <Text style={s.heroSub}>Sınav tarihin, boş saatlerin ve zayıf derslerine göre konu konu takvim. Bir gün kaçırırsan program kendini yeniden dağıtır.</Text>
                    <View style={s.heroBtn}><Text style={s.heroBtnTxt}>Programımı oluştur</Text></View>
                </LinearGradient>
            </Tap>
        );
    }
    if (!plan || !plan.ok) {
        return (
            <Card dark={dark}>
                <Text style={s.kicker}>AKILLI KPSS PROGRAMI</Text>
                <Text style={[s.title, dark && s.light]}>{plan ? plan.reason : "Program hesaplanamadı."}</Text>
                <Tap onPress={function () { go(navigation, "Program", { mode: "wizard" }); }} style={[s.chip, s.chipPrimary, { marginTop: 12, alignSelf: "flex-start" }]}>
                    <Text style={[s.chipTxt, s.light]}>Programı güncelle</Text>
                </Tap>
            </Card>
        );
    }
    var list = SP.todayList(plan, settings);
    var doneMin = 0, allMin = 0;
    list.forEach(function (x) { allMin += x.minutes; if (x.done) doneMin += x.minutes; });
    var phase = plan.days[0] ? plan.days[0].phase : "ogrenme";
    function toggle(x) {
        var cur = planSettingsOf(StudentStore.getState()) || settings;
        savePlanSettings(x.done ? SP.unmarkDone(cur, x) : SP.markDone(cur, x));
    }
    var tomorrow = plan.days[1] && plan.days[1].items.length;
    return (
        <Card dark={dark}>
            <Text style={[s.kicker, { color: SP.PHASES[phase].color }]}>{SP.PHASES[phase].label.toUpperCase()} DÖNEMİ · SINAVA {plan.daysLeft} GÜN</Text>
            <Text style={[s.title, dark && s.light]}>Bugünkü programın</Text>
            <View style={s.chips}>
                <Tap onPress={function () { go(navigation, "Program", { mode: "calendar" }); }} style={[s.chip, dark && s.chipDark]}>
                    <Text style={[s.chipTxt, dark && s.light]}>📅 Takvim</Text>
                </Tap>
                <Tap onPress={function () { go(navigation, "Program", { mode: "wizard" }); }} style={[s.chip, dark && s.chipDark]}>
                    <Text style={[s.chipTxt, dark && s.light]}>Düzenle</Text>
                </Tap>
            </View>
            {missed ? <Text style={[s.note, dark && s.noteDark]}>Dünden kalan {missed} görev programa yeniden dağıtıldı. Sıkıntı yok, devam.</Text> : null}
            {!plan.fits ? (
                <Text style={[s.warn, dark && s.warnDark]}>
                    Bu tempoyla konular sınavdan önce bitmiyor ({SP.fmtMin(plan.behindMin)} eksik). {plan.needWeekMin ? "Haftada " + SP.fmtMin(plan.needWeekMin) + " ayırabilirsen yetişir." : "Haftaya çalışma günü eklemen gerekiyor."}
                </Text>
            ) : null}
            {list.length ? (
                <View>
                    <View style={s.meterHead}>
                        <Text style={s.muted}>{SP.fmtMin(doneMin)} / {SP.fmtMin(allMin)} tamam</Text>
                        <Text style={s.muted}>{list.filter(function (x) { return x.done; }).length}/{list.length} görev</Text>
                    </View>
                    <View style={[s.bar, dark && { backgroundColor: "#44403c" }]}>
                        <View style={[s.barFill, { width: (allMin ? doneMin / allMin * 100 : 0) + "%" }]} />
                    </View>
                    {list.map(function (x, i) {
                        return <PlanTaskRow key={x.id + (x.done ? "-d" : "") + i} item={x} dark={dark} onToggle={toggle}
                            onStart={function (t) { runPlanTask(navigation, t, kpssData); }} />;
                    })}
                </View>
            ) : (
                <Text style={[s.muted, { marginTop: 12, fontSize: 13 }]}>Bugün programda dinlenme günü. Yarın {tomorrow ? tomorrow + " görev" : "da boş"}.</Text>
            )}
        </Card>
    );
}

export var s = StyleSheet.create({
    light: { color: "#F5F5F4" },
    muted: { fontSize: 12, color: "#78716C" },
    kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.1, color: "#0f766e" },
    title: { fontSize: 17, fontWeight: "800", color: "#0F172A", marginTop: 3 },
    hero: { borderRadius: 22, padding: 20 },
    heroKicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.1, color: "rgba(255,255,255,0.8)" },
    heroTitle: { fontSize: 19, fontWeight: "900", color: "#fff", marginTop: 6, lineHeight: 25 },
    heroSub: { fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 8, lineHeight: 19 },
    heroBtn: { alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 99, paddingHorizontal: 18, paddingVertical: 11, marginTop: 14 },
    heroBtnTxt: { color: "#0D2C4D", fontWeight: "800", fontSize: 14 },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
    chip: {
        minHeight: 40, paddingHorizontal: 14, justifyContent: "center", alignItems: "center", borderRadius: 99,
        backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(28,25,23,0.12)"
    },
    chipDark: { backgroundColor: "#292524", borderColor: "rgba(255,255,255,0.12)" },
    chipPrimary: { backgroundColor: "#0D2C4D", borderColor: "#0D2C4D" },
    chipTxt: { fontSize: 13, fontWeight: "700", color: "#1C1917" },
    note: { marginTop: 12, fontSize: 13, fontWeight: "600", lineHeight: 18, padding: 10, borderRadius: 12, backgroundColor: "#eef2ff", color: "#3730a3" },
    noteDark: { backgroundColor: "rgba(79,70,229,0.18)", color: "#c7d2fe" },
    warn: { marginTop: 12, fontSize: 13, fontWeight: "600", lineHeight: 18, padding: 10, borderRadius: 12, backgroundColor: "#fff7ed", color: "#9a3412" },
    warnDark: { backgroundColor: "rgba(194,65,12,0.2)", color: "#fed7aa" },
    ok: { marginTop: 12, fontSize: 13, fontWeight: "600", lineHeight: 18, padding: 10, borderRadius: 12, backgroundColor: "#ecfdf5", color: "#065f46" },
    meterHead: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, marginBottom: 6 },
    bar: { height: 8, borderRadius: 99, backgroundColor: "#E7E5E4", overflow: "hidden", marginBottom: 6 },
    barFill: { height: "100%", borderRadius: 99, backgroundColor: "#0d9488" },
    row: {
        flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8, paddingVertical: 9, paddingHorizontal: 10, borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 1, borderColor: "rgba(28,25,23,0.08)"
    },
    rowDark: { backgroundColor: "rgba(41,37,36,0.8)", borderColor: "rgba(255,255,255,0.08)" },
    check: { width: 30, height: 30, borderRadius: 99, borderWidth: 2, borderColor: "#d6d3d1", backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
    checkDark: { backgroundColor: "#292524", borderColor: "#57534e" },
    checkOn: { backgroundColor: "#059669", borderColor: "#059669" },
    checkTxt: { color: "#fff", fontWeight: "900", fontSize: 15 },
    ico: { fontSize: 17, width: 22, textAlign: "center" },
    rowTitle: { fontSize: 14, fontWeight: "700", color: "#1C1917", lineHeight: 19 },
    start: { backgroundColor: "#0D2C4D", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8 },
    startDark: { backgroundColor: "#0f766e" },
    startTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },
    phases: { flexDirection: "row", height: 10, borderRadius: 99, overflow: "hidden", backgroundColor: "#E7E5E4" },
    legend: { flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 4, marginTop: 8 },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    dot: { width: 10, height: 10, borderRadius: 99 }
});
