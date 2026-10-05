import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { StudentStore } from "../lib/store";
import { StudyPlanner } from "../lib/planner";
import { localStorageShim } from "../lib/storage";
import { konuLabel } from "../lib/konuLabels";
import { go } from "../nav";
import { Card, Tap } from "../ui";
import { colors } from "../lib/theme";

// Bugün ekranının etkileşimli araçları (web'deki js/app.jsx Bugün araçlarının karşılığı).

var TASK_ICON = { notes: "📖", test: "🎯", review: "🔁", wrong: "🩹" };

export function startReview(navigation, plan) {
    if (!plan.due.length) return;
    go(navigation, "Test", { mode: "review", items: plan.due.slice(0, 30) });
}

export function startWrong(navigation, plan) {
    if (!plan.wrong.length) return;
    go(navigation, "Test", { mode: "wrong", items: plan.wrong.slice(0, 30) });
}

export function startMixed(navigation, kpssData) {
    var items = StudyPlanner.mixedQuiz(kpssData, null, 10);
    if (!items.length) { Alert.alert("Soru yok."); return; }
    var gate = StudentStore.consumeMixed ? StudentStore.consumeMixed() : { ok: true };
    if (!gate.ok) { Alert.alert("Kota", gate.reason); return; }
    go(navigation, "Test", { mode: "mixed", items: items });
}

// ---------- Şimdi ne çalışayım? ----------
export function NextSteps({ navigation, plan, kpssData, dark }) {
    var tasks = plan.tasks || [];
    function run(t) {
        if (t.kind === "notes") go(navigation, "Notes", { ders: t.ders, konu: t.konu });
        else if (t.kind === "test") go(navigation, "KonuHub", { ders: t.ders, konu: t.konu });
        else if (t.kind === "review") startReview(navigation, plan);
        else if (t.kind === "wrong") startWrong(navigation, plan);
    }
    return (
        <Card dark={dark}>
            <Text style={s.kicker}>ŞİMDİ NE ÇALIŞAYIM?</Text>
            <Text style={[s.coach, dark && s.light]}>{plan.coach}</Text>
            {tasks.length ? tasks.map(function (t, i) {
                var first = i === 0;
                return (
                    <Tap key={t.id} onPress={function () { run(t); }}
                        style={[s.step, first ? s.stepFirst : (dark ? s.stepDark : null)]}
                        accessibilityLabel={t.title + ", " + t.detail}>
                        <View style={[s.stepIco, first && s.stepIcoFirst]}><Text style={s.stepIcoTxt}>{TASK_ICON[t.kind] || "•"}</Text></View>
                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={[s.stepTitle, (first || dark) && s.light]} numberOfLines={2}>
                                {t.title}<Text style={s.stepDetail}> · {t.detail}</Text>
                            </Text>
                            <Text style={[s.stepWhy, (first || dark) && s.lightMuted]} numberOfLines={2}>{t.why}</Text>
                        </View>
                        {first ? <View style={s.goPill}><Text style={s.goPillTxt}>Başla</Text></View> : <Text style={s.arrow}>›</Text>}
                    </Tap>
                );
            }) : <Text style={[s.muted, { marginTop: 10 }]}>Bekleyen görev yok. Karışık soruyla tempoyu koru.</Text>}
            <View style={s.chips}>
                <Chip dark={dark} label="🎲 Karışık 10 soru" onPress={function () { startMixed(navigation, kpssData); }} />
                <Chip dark={dark} label={"🔁 Tekrar (" + plan.due.length + ")"} disabled={!plan.due.length} onPress={function () { startReview(navigation, plan); }} />
                <Chip dark={dark} label={"🩹 Yanlışlar (" + plan.wrong.length + ")"} disabled={!plan.wrong.length} onPress={function () { startWrong(navigation, plan); }} />
            </View>
        </Card>
    );
}

function Chip({ label, onPress, disabled, primary, dark }) {
    return (
        <Tap onPress={onPress} disabled={disabled}
            style={[s.chip, dark && s.chipDark, primary && s.chipPrimary, disabled && { opacity: 0.45 }]}>
            <Text style={[s.chipTxt, (dark || primary) && s.light]}>{label}</Text>
        </Tap>
    );
}

// ---------- Günlük hedef ----------
export function DailyGoal({ student, dark }) {
    var sess = (student.sessions || {})[StudentStore.todayStr()] || {};
    var goal = Number(student.profile && student.profile.dailyQuestions) || 25;
    var done = sess.questions || 0;
    var correct = sess.correct || 0;
    var pct = Math.min(1, done / goal);
    var R = 38;
    var C = 2 * Math.PI * R;
    var left = Math.max(0, goal - done);
    function setGoal(v) {
        v = Math.max(5, Math.min(300, v));
        if (v !== goal) {
            StudentStore.updateProfile({ dailyQuestions: v });
            Haptics.selectionAsync().catch(function () {});
        }
    }
    return (
        <Card dark={dark}>
            <View style={s.row}>
                <View style={{ width: 92, height: 92 }}>
                    <Svg width={92} height={92} viewBox="0 0 92 92">
                        <Circle cx={46} cy={46} r={R} stroke={dark ? "#44403c" : "#E7E5E4"} strokeWidth={9} fill="none" />
                        <Circle cx={46} cy={46} r={R} stroke={pct >= 1 ? "#059669" : "#4f46e5"} strokeWidth={9} fill="none"
                            strokeLinecap="round" strokeDasharray={(C * pct) + " " + C} transform="rotate(-90 46 46)" />
                    </Svg>
                    <View style={s.ringCenter} pointerEvents="none">
                        <Text style={[s.ringNum, dark && s.light]}>{done}</Text>
                        <Text style={s.ringSub}>/ {goal} soru</Text>
                    </View>
                </View>
                <View style={{ flex: 1, minWidth: 0, marginLeft: 14 }}>
                    <Text style={s.kickerMuted}>GÜNLÜK HEDEF</Text>
                    <Text style={[s.goalTitle, dark && s.light]}>{left ? ("Hedefe " + left + " soru kaldı") : "Bugünkü hedef tamam 🎉"}</Text>
                    <Text style={s.muted}>{correct} doğru{done ? " (%" + Math.round((correct / done) * 100) + ")" : ""} · {sess.minutes || 0} dk</Text>
                    <View style={[s.row, { marginTop: 10 }]}>
                        <Text style={[s.muted, { marginRight: 8 }]}>Hedef</Text>
                        <Tap onPress={function () { setGoal(goal - 5); }} style={[s.stepBtn, dark && s.stepBtnDark]} accessibilityLabel="Hedefi 5 azalt">
                            <Text style={[s.stepBtnTxt, dark && s.light]}>−</Text>
                        </Tap>
                        <Text style={[s.goalNum, dark && s.light]}>{goal}</Text>
                        <Tap onPress={function () { setGoal(goal + 5); }} style={[s.stepBtn, dark && s.stepBtnDark]} accessibilityLabel="Hedefi 5 artır">
                            <Text style={[s.stepBtnTxt, dark && s.light]}>+</Text>
                        </Tap>
                    </View>
                </View>
            </View>
        </Card>
    );
}

// ---------- Odak sayacı ----------
// Durum kalıcı tutulur: uygulama kapanıp açılınca ya da başka ekrana geçince sayaç sürer.
var FOCUS_KEY = "kpss-focus-timer";
function readFocus() {
    try { return JSON.parse(localStorageShim.getItem(FOCUS_KEY) || "null"); } catch (e) { return null; }
}
function writeFocus(v) {
    if (v) localStorageShim.setItem(FOCUS_KEY, JSON.stringify(v));
    else localStorageShim.removeItem(FOCUS_KEY);
}
function focusElapsed(f, now) {
    if (!f) return 0;
    return (f.acc || 0) + (f.runningSince ? Math.max(0, now - f.runningSince) : 0);
}

export function FocusTimer({ kpssData, dark }) {
    var [f, setF] = useState(readFocus);
    var [now, setNow] = useState(Date.now());
    var [ders, setDers] = useState((readFocus() || {}).ders || "");
    var [msg, setMsg] = useState("");
    var fRef = useRef(f);
    fRef.current = f;
    var dersler = Object.keys(kpssData || {});
    var durMs = f ? f.minutes * 60000 : 0;
    var el = focusElapsed(f, now);
    var leftMs = f ? Math.max(0, durMs - el) : 0;

    function record(ms, auto) {
        var cur = fRef.current;
        var mins = Math.round(ms / 60000);
        if (mins >= 1) {
            StudentStore.addSessionStats({ minutes: mins, seans: true, ders: (cur && cur.ders) || null });
            setMsg((auto ? "Süre doldu! " : "") + mins + " dk çalışma kaydedildi.");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(function () {});
        } else {
            setMsg("1 dakikadan kısa oturum kaydedilmedi.");
        }
        writeFocus(null);
        setF(null);
    }

    useEffect(function () {
        if (!f || !f.runningSince) return;
        var id = setInterval(function () { setNow(Date.now()); }, 1000);
        return function () { clearInterval(id); };
    }, [f]);

    useEffect(function () {
        var sub = AppState.addEventListener("change", function (st) { if (st === "active") setNow(Date.now()); });
        return function () { sub.remove(); };
    }, []);

    useEffect(function () {
        if (f && f.runningSince && leftMs <= 0) record(durMs, true);
    }, [leftMs, f]);

    function start(minutes) {
        var next = { minutes: minutes, acc: 0, runningSince: Date.now(), ders: ders || null };
        writeFocus(next); setF(next); setNow(Date.now()); setMsg("");
        Haptics.selectionAsync().catch(function () {});
    }
    function pause() {
        var t = Date.now();
        var next = Object.assign({}, f, { acc: focusElapsed(f, t), runningSince: null });
        writeFocus(next); setF(next); setNow(t);
    }
    function resume() {
        var next = Object.assign({}, f, { runningSince: Date.now() });
        writeFocus(next); setF(next); setNow(Date.now());
    }

    var mm = Math.floor(leftMs / 60000), ss = Math.floor((leftMs % 60000) / 1000);
    var pct = f ? Math.min(1, el / durMs) : 0;
    return (
        <Card dark={dark}>
            <View style={[s.row, { justifyContent: "space-between" }]}>
                <Text style={s.kickerMuted}>⏱ ODAK SAYACI</Text>
                {f ? <Text style={s.muted}>{f.ders ? f.ders + " · " : ""}{f.minutes} dk</Text> : null}
            </View>
            {f ? (
                <View style={{ marginTop: 8 }}>
                    <Text style={[s.timer, dark && s.light]} accessibilityLabel={mm + " dakika " + ss + " saniye kaldı"}>{mm}:{String(ss).padStart(2, "0")}</Text>
                    <View style={[s.bar, dark && { backgroundColor: "#44403c" }]}>
                        <View style={[s.barFill, { width: (pct * 100) + "%" }]} />
                    </View>
                    <View style={s.chips}>
                        {f.runningSince
                            ? <Chip dark={dark} label="⏸ Duraklat" onPress={pause} />
                            : <Chip dark={dark} primary label="▶ Devam et" onPress={resume} />}
                        <Chip dark={dark} label="✓ Bitir ve kaydet" onPress={function () { record(focusElapsed(f, Date.now()), false); }} />
                        <Chip dark={dark} label="Vazgeç" onPress={function () { writeFocus(null); setF(null); setMsg("Oturum iptal edildi."); }} />
                    </View>
                </View>
            ) : (
                <View style={{ marginTop: 8 }}>
                    <Text style={s.muted}>Ders (isteğe bağlı)</Text>
                    <View style={[s.chips, { marginTop: 6 }]}>
                        <Chip dark={dark} primary={!ders} label="Hepsi" onPress={function () { setDers(""); }} />
                        {dersler.map(function (d) {
                            return <Chip key={d} dark={dark} primary={ders === d} label={d} onPress={function () { setDers(d); }} />;
                        })}
                    </View>
                    <View style={s.chips}>
                        {[25, 45, 60].map(function (m) {
                            return <Chip key={m} dark={dark} primary={m === 25} label={"▶ " + m + " dk"} onPress={function () { start(m); }} />;
                        })}
                    </View>
                    <Text style={[s.muted, { marginTop: 8 }]}>Süre dolunca çalışma dakikan ve oturumun istatistiklere eklenir.</Text>
                </View>
            )}
            {msg ? <Text style={s.okMsg}>{msg}</Text> : null}
        </Card>
    );
}

// ---------- Zayıf konular ----------
export function WeakTopics({ navigation, plan, dark }) {
    var rows = (plan.rows || []).filter(function (r) { return r.soruSayisi > 0; });
    var tested = rows.filter(function (r) { return r.lastPct != null && r.lastPct < 85; })
        .sort(function (a, b) { return a.lastPct - b.lastPct; });
    var list = tested.length ? tested.slice(0, 5) : rows.filter(function (r) { return r.lastPct == null; }).slice(0, 3);
    if (!list.length) return null;
    return (
        <Card dark={dark}>
            <Text style={s.kickerMuted}>{tested.length ? "🎯 ÖNCE BUNLARI GÜÇLENDİR" : "🎯 SIRADAKİ KONULAR"}</Text>
            {list.map(function (r) {
                var p = r.lastPct;
                var col = p == null ? "#a8a29e" : p < 50 ? "#e11d48" : p < 75 ? "#d97706" : "#059669";
                return (
                    <Tap key={r.ders + "|" + r.konu} onPress={function () { go(navigation, "KonuHub", { ders: r.ders, konu: r.konu }); }} style={s.weakRow}>
                        <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={[s.weakName, dark && s.light]} numberOfLines={1}>{konuLabel(r.konu)}</Text>
                            <Text style={s.muted}>{r.ders} · {p == null ? "henüz test yok" : "son net %" + p}</Text>
                            <View style={[s.bar, { height: 6, marginTop: 6 }, dark && { backgroundColor: "#44403c" }]}>
                                <View style={{ height: 6, borderRadius: 99, width: (p == null ? 4 : Math.max(4, p)) + "%", backgroundColor: col }} />
                            </View>
                        </View>
                        <Text style={s.weakGo}>Çalış ›</Text>
                    </Tap>
                );
            })}
        </Card>
    );
}

// ---------- Bu hafta: dokunulabilir günler ----------
var DAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
var DAY_FULL = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export function WeekBars({ student, weekMin, dark }) {
    var todayIso = StudentStore.todayStr();
    var todayIdx = (new Date(todayIso + "T12:00:00").getDay() + 6) % 7;
    var [pick, setPick] = useState(todayIdx);
    var max = 1;
    weekMin.forEach(function (v) { if (v > max) max = v; });
    var iso = StudentStore.addDays(todayIso, pick - todayIdx);
    var day = (student.sessions || {})[iso] || {};
    var q = day.questions || 0;
    return (
        <View>
            <View style={s.weekBars}>
                {weekMin.map(function (m, i) {
                    var on = i === pick;
                    var h = Math.max(8, Math.round((m / max) * 96));
                    return (
                        <Tap key={i} onPress={function () { setPick(i); }} style={s.weekCol}
                            accessibilityLabel={DAY_FULL[i] + ": " + m + " dakika"} accessibilityState={{ selected: on }}>
                            <View style={{ height: h, width: "100%", borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: on ? "#4f46e5" : (i > todayIdx ? (dark ? "#44403c" : "#E7E5E4") : "#a5b4fc") }} />
                            <Text style={[s.weekLab, i === todayIdx && { color: "#4f46e5", fontWeight: "900" }]}>{DAY_SHORT[i]}</Text>
                        </Tap>
                    );
                })}
            </View>
            <Text style={[s.dayInfo, dark && s.light]}>
                <Text style={{ fontWeight: "800" }}>{DAY_FULL[pick]}{pick === todayIdx ? " (bugün)" : ""}: </Text>
                {weekMin[pick]} dk · {q} soru{q ? " · %" + Math.round(((day.correct || 0) / q) * 100) + " doğru" : ""}
            </Text>
        </View>
    );
}

var s = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center" },
    light: { color: "#fff" },
    lightMuted: { color: "rgba(255,255,255,0.75)" },
    kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.1, color: colors.teal },
    kickerMuted: { fontSize: 11, fontWeight: "800", letterSpacing: 1.1, color: "#A8A29E" },
    coach: { fontSize: 16, fontWeight: "800", color: "#0F172A", marginTop: 4, lineHeight: 22 },
    muted: { fontSize: 12, color: "#78716C" },
    step: {
        flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10, padding: 12, borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 1, borderColor: "rgba(28,25,23,0.08)"
    },
    stepDark: { backgroundColor: "rgba(41,37,36,0.8)", borderColor: "rgba(255,255,255,0.08)" },
    stepFirst: { backgroundColor: "#0D2C4D", borderColor: "#0D2C4D" },
    stepIco: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(13,148,136,0.1)" },
    stepIcoFirst: { backgroundColor: "rgba(255,255,255,0.14)" },
    stepIcoTxt: { fontSize: 18 },
    stepTitle: { fontSize: 14, fontWeight: "800", color: "#1C1917" },
    stepDetail: { fontWeight: "500", opacity: 0.75 },
    stepWhy: { fontSize: 12, color: "#78716C", marginTop: 2 },
    goPill: { backgroundColor: "#fff", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 7 },
    goPillTxt: { color: "#0D2C4D", fontWeight: "800", fontSize: 13 },
    arrow: { fontSize: 22, color: colors.teal, fontWeight: "700" },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
    chip: {
        minHeight: 40, paddingHorizontal: 14, justifyContent: "center", borderRadius: 99,
        backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(28,25,23,0.12)"
    },
    chipDark: { backgroundColor: "#292524", borderColor: "rgba(255,255,255,0.12)" },
    chipPrimary: { backgroundColor: "#0D2C4D", borderColor: "#0D2C4D" },
    chipTxt: { fontSize: 13, fontWeight: "700", color: "#1C1917" },
    ringCenter: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
    ringNum: { fontSize: 22, fontWeight: "800", color: "#0F172A" },
    ringSub: { fontSize: 10, color: "#A8A29E" },
    goalTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginTop: 2 },
    goalNum: { width: 36, textAlign: "center", fontSize: 15, fontWeight: "800", color: "#0F172A" },
    stepBtn: {
        width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center",
        backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(28,25,23,0.14)"
    },
    stepBtnDark: { backgroundColor: "#292524", borderColor: "rgba(255,255,255,0.14)" },
    stepBtnTxt: { fontSize: 18, fontWeight: "800", color: "#1C1917" },
    timer: { fontSize: 40, fontWeight: "800", color: "#0F172A", letterSpacing: -1, fontVariant: ["tabular-nums"] },
    bar: { height: 8, borderRadius: 99, backgroundColor: "#E7E5E4", overflow: "hidden", marginTop: 8 },
    barFill: { height: "100%", borderRadius: 99, backgroundColor: "#0d9488" },
    okMsg: { marginTop: 10, fontSize: 12, color: "#047857", fontWeight: "600" },
    weakRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(120,113,108,0.25)" },
    weakName: { fontSize: 14, fontWeight: "700", color: "#1C1917" },
    weakGo: { fontSize: 12, fontWeight: "800", color: colors.teal },
    weekBars: { flexDirection: "row", alignItems: "flex-end", height: 124, gap: 6, marginTop: 8 },
    weekCol: { flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" },
    weekLab: { fontSize: 10, color: "#A8A29E", marginTop: 6, fontWeight: "600" },
    dayInfo: { fontSize: 12, color: "#44403C", marginTop: 10 }
});
