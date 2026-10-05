import React, { useMemo, useState } from "react";
import { Share, StyleSheet, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { SmartPlan as SP } from "../lib/smartPlan";
import { konuLabel } from "../lib/konuLabels";
import { Card, PageHeader, ScrollScreen, Tap } from "../ui";
import { PLAN_ICON, PlanPhaseBar, planSettingsOf, planTaskLabel, s as ps } from "../components/SmartPlan";

// ============================================================
// AKILLI PROGRAM: sihirbaz (mode "wizard") ve takvim (mode "calendar")
// ============================================================

export default function ProgramScreen({ navigation, route }) {
    var app = useApp();
    var settings = planSettingsOf(app.student);
    var mode = (route && route.params && route.params.mode) || (settings ? "calendar" : "wizard");
    var [view, setView] = useState(mode);
    if (view === "wizard" || !settings) {
        return <PlanWizard navigation={navigation} onDone={function () { if (mode === "wizard") navigation.goBack(); else setView("calendar"); }} />;
    }
    return <PlanCalendar navigation={navigation} onEdit={function () { setView("wizard"); }} />;
}

function Chip({ label, onPress, primary, dark, disabled, selected }) {
    return (
        <Tap onPress={onPress} disabled={disabled} accessibilityState={selected != null ? { selected: !!selected } : undefined}
            style={[ps.chip, dark && ps.chipDark, primary && ps.chipPrimary, disabled && { opacity: 0.45 }]}>
            <Text style={[ps.chipTxt, (dark || primary) && ps.light]}>{label}</Text>
        </Tap>
    );
}

function StepBtn({ label, onPress, dark, a11y }) {
    return (
        <Tap onPress={onPress} accessibilityLabel={a11y} style={[st.stepBtn, dark && st.stepBtnDark]}>
            <Text style={[st.stepBtnTxt, dark && ps.light]}>{label}</Text>
        </Tap>
    );
}

function addMonths(iso, n) {
    var p = iso.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1 + n, 1);
    var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(p[2], last));
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function longDate(iso) {
    var p = iso.split("-").map(Number);
    var wd = (new Date(p[0], p[1] - 1, p[2]).getDay() + 6) % 7;
    return SP.fmtDate(iso) + " " + p[0] + " · " + SP.DAY_FULL[wd];
}

function PlanWizard({ navigation, onDone }) {
    var app = useApp();
    var dark = app.dark;
    var student = app.student;
    var kpssData = app.kpssData;
    var dersler = Object.keys(kpssData || {});
    var cur = planSettingsOf(student);
    var today = SP.todayIso();
    var [step, setStep] = useState(0);
    var [s, setS] = useState(function () {
        var base = cur ? SP.normSettings(cur) : SP.defaultSettings(student);
        var old = student.userProfile && student.userProfile.studyPlan;
        if (!cur && old && old.ready && old.days) {
            var ids = ["pzt", "sal", "car", "per", "cum", "cmt", "paz"];
            base.hours = ids.map(function (id) {
                var d = old.days[id];
                return d && d.on ? (StudentStore.daySlotHours ? StudentStore.daySlotHours(d) : 0) : 0;
            });
        }
        if (!base.examDate) base.examDate = SP.addDays(today, 180);
        return base;
    });
    var preview = useMemo(function () {
        return step === 3 ? SP.generate(kpssData, student, s) : null;
    }, [step, s]);
    var weekH = s.hours.reduce(function (a, h) { return a + h; }, 0);
    function setHour(i, v) {
        var h = s.hours.slice();
        h[i] = Math.max(0, Math.min(12, Math.round(v * 2) / 2));
        setS(Object.assign({}, s, { hours: h }));
    }
    function setDate(iso) {
        if (iso <= today) iso = SP.addDays(today, 1);
        setS(Object.assign({}, s, { examDate: iso }));
    }
    function toggleWeak(d) {
        var w = s.weak.indexOf(d) >= 0 ? s.weak.filter(function (x) { return x !== d; }) : s.weak.concat([d]);
        setS(Object.assign({}, s, { weak: w }));
    }
    function save() {
        var next = Object.assign({}, s, { createdAt: (cur && cur.createdAt) || new Date().toISOString(), seen: null });
        StudentStore.updateUserProfile({ smartPlan: next, studyPlan: SP.legacyStudyPlan(next) });
        if (s.examDate) StudentStore.updateProfile({ examDate: s.examDate });
        onDone();
    }
    var canNext = step === 0 ? (s.examDate && s.examDate > today) : step === 1 ? weekH > 0 : true;
    var steps = ["Sınav tarihi", "Boş saatler", "Zayıf dersler", "Önizleme"];

    return (
        <ScrollScreen dark={dark}>
            <PageHeader dark={dark} title="Programımı oluştur" subtitle={"Adım " + (step + 1) + " / 4 · " + steps[step]}
                onBack={function () { if (step) setStep(step - 1); else navigation.goBack(); }} right={null} />
            <View style={st.progress}>
                {steps.map(function (_t, i) {
                    return <View key={i} style={[st.progSeg, { backgroundColor: i <= step ? "#0d9488" : (dark ? "#44403c" : "#E7E5E4") }]} />;
                })}
            </View>
            <Card dark={dark}>
                {step === 0 ? (
                    <View>
                        <Text style={[st.h, dark && ps.light]}>Sınavın ne zaman?</Text>
                        <Text style={st.p}>ÖSYM takvimindeki sınav gününü seç. Program bu güne kadar gün gün hazırlanır.</Text>
                        <Text style={[st.date, dark && ps.light]} accessibilityLiveRegion="polite">{longDate(s.examDate)}</Text>
                        <Text style={st.dateSub}>Sınava {SP.diffDays(today, s.examDate)} gün var.</Text>
                        <View style={st.dateRow}>
                            <Text style={[st.dateLab, dark && ps.light]}>Ay</Text>
                            <StepBtn dark={dark} label="−" a11y="Bir ay geri" onPress={function () { setDate(addMonths(s.examDate, -1)); }} />
                            <StepBtn dark={dark} label="+" a11y="Bir ay ileri" onPress={function () { setDate(addMonths(s.examDate, 1)); }} />
                        </View>
                        <View style={st.dateRow}>
                            <Text style={[st.dateLab, dark && ps.light]}>Gün</Text>
                            <StepBtn dark={dark} label="−7" a11y="Bir hafta geri" onPress={function () { setDate(SP.addDays(s.examDate, -7)); }} />
                            <StepBtn dark={dark} label="−1" a11y="Bir gün geri" onPress={function () { setDate(SP.addDays(s.examDate, -1)); }} />
                            <StepBtn dark={dark} label="+1" a11y="Bir gün ileri" onPress={function () { setDate(SP.addDays(s.examDate, 1)); }} />
                            <StepBtn dark={dark} label="+7" a11y="Bir hafta ileri" onPress={function () { setDate(SP.addDays(s.examDate, 7)); }} />
                        </View>
                        <Text style={[ps.muted, { marginTop: 12 }]}>Tarih henüz açıklanmadıysa tahmini bir tarih seç; sonra değiştirebilirsin.</Text>
                    </View>
                ) : null}
                {step === 1 ? (
                    <View>
                        <Text style={[st.h, dark && ps.light]}>Hangi gün kaç saat çalışabilirsin?</Text>
                        <Text style={st.p}>Gerçekçi ol: program sürdürülebilir olursa işe yarar. Haftalık toplam: {weekH} saat</Text>
                        <View style={ps.chips}>
                            <Chip dark={dark} label="Hafif (7 sa)" onPress={function () { setS(Object.assign({}, s, { hours: [1, 1, 1, 1, 1, 2, 0] })); }} />
                            <Chip dark={dark} label="Dengeli (14 sa)" onPress={function () { setS(Object.assign({}, s, { hours: [2, 2, 2, 2, 2, 4, 0] })); }} />
                            <Chip dark={dark} label="Yoğun (23 sa)" onPress={function () { setS(Object.assign({}, s, { hours: [3, 3, 3, 3, 3, 5, 3] })); }} />
                            <Chip dark={dark} label="Hafta sonu (10 sa)" onPress={function () { setS(Object.assign({}, s, { hours: [0, 0, 0, 0, 0, 5, 5] })); }} />
                        </View>
                        <View style={{ marginTop: 12 }}>
                            {SP.DAY_FULL.map(function (d, i) {
                                return (
                                    <View key={d} style={st.hourRow}>
                                        <Text style={[st.dayName, dark && ps.light]}>{d}</Text>
                                        <StepBtn dark={dark} label="−" a11y={d + " yarım saat azalt"} onPress={function () { setHour(i, s.hours[i] - 0.5); }} />
                                        <Text style={[st.hourVal, dark && ps.light]}>{s.hours[i] ? s.hours[i] + " sa" : "boş"}</Text>
                                        <StepBtn dark={dark} label="+" a11y={d + " yarım saat artır"} onPress={function () { setHour(i, s.hours[i] + 0.5); }} />
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ) : null}
                {step === 2 ? (
                    <View>
                        <Text style={[st.h, dark && ps.light]}>Hangi derslerde zorlanıyorsun?</Text>
                        <Text style={st.p}>Seçtiğin derslere daha çok zaman ayrılır. Hiçbirini seçmeden de geçebilirsin; dağılım ÖSYM soru sayılarına göre yapılır.</Text>
                        <View style={ps.chips}>
                            {dersler.map(function (d) {
                                var on = s.weak.indexOf(d) >= 0;
                                return <Chip key={d} dark={dark} primary={on} selected={on} label={(on ? "✓ " : "") + d} onPress={function () { toggleWeak(d); }} />;
                            })}
                        </View>
                    </View>
                ) : null}
                {step === 3 ? (
                    <View>
                        <Text style={[st.h, dark && ps.light]}>Programın hazır</Text>
                        {preview && preview.ok ? (
                            <View>
                                <View style={st.stats}>
                                    <Stat dark={dark} n={preview.daysLeft} l="gün" />
                                    <Stat dark={dark} n={SP.fmtMin(preview.weekMin)} l="haftada" />
                                    <Stat dark={dark} n={SP.fmtMin(preview.learnTotal)} l="konu çalışması" />
                                </View>
                                <View style={{ marginTop: 14 }}><PlanPhaseBar plan={preview} dark={dark} /></View>
                                {preview.fits ? (
                                    <Text style={[ps.ok, dark && { backgroundColor: "rgba(5,150,105,0.18)", color: "#a7f3d0" }]}>Yetişiyor: konular {SP.fmtDate(preview.learnDoneOn || preview.finalStart)} civarı biter, sonrası tekrar ve deneme.</Text>
                                ) : (
                                    <Text style={[ps.warn, dark && ps.warnDark]}>Bu saatlerle konular son döneme kadar bitmiyor ({SP.fmtMin(preview.behindMin)} eksik). {preview.needWeekMin ? "Haftada en az " + SP.fmtMin(preview.needWeekMin) + " öneririz" : "Haftaya çalışma günü eklemeni öneririz"}; yine de kaydedebilirsin.</Text>
                                )}
                                <Text style={[ps.kicker, { color: "#A8A29E", marginTop: 16, marginBottom: 4 }]}>İLK GÜN</Text>
                                {(preview.days[0] ? preview.days[0].items : []).map(function (x, i) {
                                    return <Text key={i} style={[st.firstItem, dark && ps.light]}>{PLAN_ICON[x.kind]} {planTaskLabel(x)} <Text style={ps.muted}>· {SP.fmtMin(x.minutes)}</Text></Text>;
                                })}
                            </View>
                        ) : <Text style={[ps.warn, dark && ps.warnDark]}>{preview ? preview.reason : ""}</Text>}
                    </View>
                ) : null}
                <View style={st.nav}>
                    <Chip dark={dark} label={step ? "← Geri" : "Vazgeç"} onPress={function () { if (step) setStep(step - 1); else navigation.goBack(); }} />
                    {step < 3 ? (
                        <Chip primary disabled={!canNext} label="Devam →" onPress={function () { setStep(step + 1); }} />
                    ) : (
                        <Chip primary disabled={!preview || !preview.ok} label="Programı kaydet" onPress={save} />
                    )}
                </View>
            </Card>
        </ScrollScreen>
    );
}

function Stat({ n, l, dark }) {
    return (
        <View style={[st.stat, dark && { backgroundColor: "#292524" }]}>
            <Text style={[st.statNum, dark && ps.light]}>{n}</Text>
            <Text style={ps.muted}>{l}</Text>
        </View>
    );
}

function PlanCalendar({ navigation, onEdit }) {
    var app = useApp();
    var dark = app.dark;
    var student = app.student;
    var settings = planSettingsOf(student);
    var plan = useMemo(function () { return SP.generate(app.kpssData, student, settings); }, [app.kpssData, student, settings]);
    var [weeks, setWeeks] = useState(2);
    if (!plan || !plan.ok) {
        return (
            <ScrollScreen dark={dark}>
                <PageHeader dark={dark} title="KPSS programım" onBack={function () { navigation.goBack(); }} right={null} />
                <Card dark={dark}>
                    <Text style={[ps.warn, dark && ps.warnDark]}>{plan ? plan.reason : "Önce programını oluştur."}</Text>
                    <View style={{ marginTop: 12, alignSelf: "flex-start" }}><Chip primary label="Programı güncelle" onPress={onEdit} /></View>
                </Card>
            </ScrollScreen>
        );
    }
    // pazartesiden başlayan haftalara böl
    var groups = [];
    plan.days.forEach(function (d) {
        if (!groups.length || d.weekday === 0) groups.push([]);
        groups[groups.length - 1].push(d);
    });
    var doneIds = {};
    SP.doneOn(settings, plan.today).forEach(function (x) { doneIds[x.id] = true; });
    var name = student.profile && student.profile.name;
    function share() {
        Share.share({ message: SP.shareText(plan, name), title: "KPSS programım" }).catch(function () {});
    }
    return (
        <ScrollScreen dark={dark}>
            <PageHeader dark={dark} title="KPSS programım"
                subtitle={"Sınav " + SP.fmtDate(plan.exam) + " · " + plan.daysLeft + " gün · haftada " + SP.fmtMin(plan.weekMin)}
                onBack={function () { navigation.goBack(); }} right={null} />
            <PlanPhaseBar plan={plan} dark={dark} />
            {!plan.fits ? (
                <Text style={[ps.warn, dark && ps.warnDark]}>Bu tempoyla {SP.fmtMin(plan.behindMin)} konu çalışması son döneme yetişmiyor. {plan.needWeekMin ? "Haftada " + SP.fmtMin(plan.needWeekMin) + " önerilir." : "Haftaya çalışma günü eklemen önerilir."}</Text>
            ) : null}
            <View style={[ps.chips, { marginBottom: 6 }]}>
                <Chip primary label="📤 Paylaş" onPress={share} />
                <Chip dark={dark} label="Düzenle" onPress={onEdit} />
            </View>
            {groups.slice(0, weeks).map(function (g, gi) {
                var mins = g.reduce(function (a, d) { return a + d.minutes; }, 0);
                return (
                    <View key={gi} style={{ marginTop: 14 }}>
                        <Text style={st.weekHead}>{SP.fmtDate(g[0].date)} – {SP.fmtDate(g[g.length - 1].date)} · {SP.fmtMin(mins)}</Text>
                        {g.map(function (d) {
                            var isToday = d.date === plan.today;
                            return (
                                <View key={d.date} style={[st.day, dark && st.dayDark, { borderLeftColor: SP.PHASES[d.phase].color }, isToday && st.dayToday]}>
                                    <View style={st.dayHead}>
                                        <Text style={[st.dayTitle, dark && ps.light]}>{SP.DAY_FULL[d.weekday]} {SP.fmtDate(d.date)}</Text>
                                        {isToday ? <View style={st.pill}><Text style={st.pillTxt}>bugün</Text></View> : null}
                                        <Text style={[ps.muted, { marginLeft: "auto" }]}>{d.items.length ? SP.fmtMin(d.minutes) : ""}</Text>
                                    </View>
                                    {d.items.length ? d.items.map(function (x, i) {
                                        var done = isToday && doneIds[x.id];
                                        return (
                                            <View key={i} style={[st.item, done && { opacity: 0.5 }]}>
                                                <Text style={st.itemIco}>{PLAN_ICON[x.kind]}</Text>
                                                <View style={{ flex: 1, minWidth: 0 }}>
                                                    <Text style={[st.itemTitle, dark && ps.light, done && { textDecorationLine: "line-through" }]}>{SP.taskTitle(x)}</Text>
                                                    <Text style={ps.muted}>{x.ders ? x.ders + (x.konu ? " / " + konuLabel(x.konu) : "") + " · " : ""}{SP.fmtMin(x.minutes)}</Text>
                                                </View>
                                            </View>
                                        );
                                    }) : <Text style={ps.muted}>Dinlenme</Text>}
                                </View>
                            );
                        })}
                    </View>
                );
            })}
            {weeks < groups.length ? (
                <View style={{ marginTop: 14, alignItems: "center" }}>
                    <Chip dark={dark} label={"Sonraki 4 haftayı göster (" + (groups.length - weeks) + " hafta kaldı)"} onPress={function () { setWeeks(weeks + 4); }} />
                </View>
            ) : null}
        </ScrollScreen>
    );
}

var st = StyleSheet.create({
    progress: { flexDirection: "row", gap: 6, marginBottom: 12 },
    progSeg: { flex: 1, height: 6, borderRadius: 99 },
    h: { fontSize: 19, fontWeight: "900", color: "#0F172A" },
    p: { fontSize: 13, color: "#78716C", marginTop: 4, lineHeight: 19 },
    date: { fontSize: 26, fontWeight: "900", color: "#0F172A", marginTop: 16 },
    dateSub: { fontSize: 13, fontWeight: "700", color: "#0f766e", marginTop: 2 },
    dateRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
    dateLab: { width: 44, fontSize: 13, fontWeight: "700", color: "#44403C" },
    stepBtn: {
        minWidth: 44, height: 40, paddingHorizontal: 8, borderRadius: 10, alignItems: "center", justifyContent: "center",
        backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(28,25,23,0.14)"
    },
    stepBtnDark: { backgroundColor: "#292524", borderColor: "rgba(255,255,255,0.14)" },
    stepBtnTxt: { fontSize: 16, fontWeight: "800", color: "#1C1917" },
    hourRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 5 },
    dayName: { width: 96, fontSize: 14, fontWeight: "600", color: "#1C1917" },
    hourVal: { width: 56, textAlign: "center", fontSize: 14, fontWeight: "800", color: "#0F172A" },
    nav: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 },
    stats: { flexDirection: "row", gap: 8, marginTop: 14 },
    stat: { flex: 1, alignItems: "center", backgroundColor: "#F5F5F4", borderRadius: 16, paddingVertical: 10 },
    statNum: { fontSize: 17, fontWeight: "800", color: "#0F172A" },
    firstItem: { fontSize: 14, color: "#1C1917", marginTop: 6, lineHeight: 19 },
    weekHead: { fontSize: 13, fontWeight: "800", color: "#78716C", marginBottom: 6 },
    day: {
        backgroundColor: "#fff", borderRadius: 14, padding: 12, marginBottom: 8,
        borderWidth: 1, borderColor: "rgba(28,25,23,0.08)", borderLeftWidth: 4
    },
    dayDark: { backgroundColor: "#1c1917", borderColor: "#44403c" },
    dayToday: { borderColor: "#0f766e", borderWidth: 2, borderLeftWidth: 4 },
    dayHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
    dayTitle: { fontSize: 14, fontWeight: "800", color: "#0F172A" },
    pill: { backgroundColor: "#0f766e", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
    pillTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
    item: { flexDirection: "row", gap: 8, marginTop: 6 },
    itemIco: { fontSize: 14, width: 20, textAlign: "center" },
    itemTitle: { fontSize: 13, fontWeight: "700", color: "#1C1917" }
});
