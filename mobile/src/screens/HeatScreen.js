import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { ChevronRight } from "lucide-react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { konuLabel } from "../lib/konuLabels";
import { Card, PageHeader, ScrollScreen, Tap } from "../ui";

// Isı haritası ve ders analizi. Web karşılığı: js/components/Heatmap30.jsx (aynı veriler, aynı hesap).

var COL = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6", "#d946ef"];
var DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function intensity(value, max) {
    if (value === 0) return "rgba(203, 213, 225, 0.35)";
    var ratio = Math.min(1, value / max);
    var r = Math.round(251 + (239 - 251) * ratio);
    var g = Math.round(191 + (68 - 191) * ratio);
    var b = Math.round(36 + (34 - 36) * ratio);
    return "rgba(" + r + "," + g + "," + b + "," + (0.3 + ratio * 0.7) + ")";
}
function ringColor(score) {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#4f46e5";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
}
function scoreEmoji(score) {
    return score >= 80 ? "🌟" : score >= 60 ? "✅" : score >= 40 ? "📈" : "📉";
}
function fmtDate(iso) {
    var p = String(iso || "").split("-");
    return p.length === 3 ? p[2] + "." + p[1] : iso;
}
function weekNumber(iso) {
    var d = new Date(iso + "T12:00:00");
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    var w1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - w1) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
}
function hours(min) { return Math.round((min / 60) * 10) / 10; }

export function HeatScreen({ navigation }) {
    var app = useApp();
    var dark = app.dark;
    var sessions = app.student.sessions || {};
    var today = StudentStore.todayStr();
    var [view, setView] = useState("heatmap");
    var [pick, setPick] = useState(today);
    var [open, setOpen] = useState("");

    // ---------- Hücreler (pazartesiden hizalı 35 gün) ----------
    var cells = [];
    var startIso = StudentStore.addDays(today, -34);
    var lead = (new Date(startIso + "T12:00:00").getDay() + 6) % 7;
    var i;
    for (i = 0; i < lead; i++) cells.push(null);
    for (i = 0; i < 35; i++) {
        var iso = StudentStore.addDays(startIso, i);
        var s = sessions[iso] || {};
        cells.push({ iso: iso, q: s.questions || 0, min: s.minutes || 0, today: iso === today, date: Number(iso.slice(8, 10)) });
    }
    var q30 = 0, min30 = 0, dayOn = 0, qMax = 1;
    cells.forEach(function (c) {
        if (!c) return;
        q30 += c.q; min30 += c.min;
        if (c.q > 0 || c.min > 0) dayOn += 1;
        if (c.q > qMax) qMax = c.q;
    });
    var weeks = [], cur = [];
    cells.forEach(function (c, idx) {
        if (!c) return;
        cur.push(c);
        if (cur.length === 7 || idx === cells.length - 1) { weeks.push(cur); cur = []; }
    });
    var picked = cells.filter(function (c) { return c && c.iso === pick; })[0];

    // ---------- Ders analizi ----------
    var rows = (app.plan && app.plan.rows) || [];
    var dersMap = {};
    rows.forEach(function (r) {
        if (!dersMap[r.ders]) dersMap[r.ders] = { ders: r.ders, scores: [], hours: 0, topics: [] };
        var sc = r.masteryScore != null ? r.masteryScore : 0;
        dersMap[r.ders].scores.push(sc);
        dersMap[r.ders].topics.push({ konu: r.konu, score: sc });
    });
    Object.keys(sessions).forEach(function (d) {
        var bd = sessions[d].byDers || {};
        Object.keys(bd).forEach(function (ders) {
            if (!dersMap[ders]) dersMap[ders] = { ders: ders, scores: [], hours: 0, topics: [] };
            dersMap[ders].hours += (bd[ders] || 0) / 60;
        });
    });
    var dersList = Object.keys(dersMap).map(function (k) {
        var x = dersMap[k], sum = 0;
        x.scores.forEach(function (n) { sum += n; });
        x.avg = x.scores.length ? Math.round(sum / x.scores.length) : 0;
        x.weak = x.scores.filter(function (n) { return n < 50; }).length;
        x.strong = x.scores.filter(function (n) { return n >= 80; }).length;
        return x;
    }).sort(function (a, b) { return b.avg - a.avg; });
    var hourSum = dersList.reduce(function (a, x) { return a + x.hours; }, 0);

    var ink = dark ? "#F5F5F4" : "#0F172A";
    var muted = dark ? "#94A3B8" : "#64748B";

    function Stat(p) {
        return (
            <View style={[st.stat, dark && st.cardDark]}>
                <Text style={[st.statN, { color: p.color }]}>{p.n}</Text>
                <Text style={[st.statL, { color: muted }]}>{p.l}</Text>
            </View>
        );
    }

    return (
        <ScrollScreen dark={dark}>
            <PageHeader dark={dark} title="Isı Haritası" subtitle="Son 5 haftalık çalışma tempon" onBack={function () { navigation.goBack(); }} right={null} />

            <View style={[st.seg, dark && { backgroundColor: "#292524" }]} accessibilityRole="tablist">
                {[["heatmap", "🔥 Isı haritası"], ["ders", "📚 Ders analizi"]].map(function (t) {
                    var on = view === t[0];
                    return (
                        <Tap key={t[0]} onPress={function () { setView(t[0]); }} accessibilityRole="tab" accessibilityState={{ selected: on }}
                            style={[st.segBtn, on && st.segOn, on && dark && { backgroundColor: "#1E293B" }]}>
                            <Text style={[st.segTxt, { color: on ? (dark ? "#A5B4FC" : "#4F46E5") : muted }]}>{t[1]}</Text>
                        </Tap>
                    );
                })}
            </View>

            {view === "heatmap" ? (
                <View>
                    <View style={st.stats}>
                        <Stat n={dayOn} l="🔥 Aktif gün" color="#D97706" />
                        <Stat n={q30} l="📝 Toplam soru" color="#4F46E5" />
                        <Stat n={hours(min30)} l="⏱️ Çalışma saati" color="#059669" />
                        <Stat n={Math.round(q30 / Math.max(1, dayOn))} l="📊 Günlük ort." color="#E11D48" />
                    </View>

                    <Card dark={dark}>
                        <View style={st.calHead}>
                            <View style={{ flex: 1 }}>
                                <Text style={[st.h, { color: ink }]}>Çalışma takvimi</Text>
                                <Text style={[st.small, { color: muted }]}>Koyu renk = daha çok soru. Güne dokun.</Text>
                            </View>
                            <View style={st.legend}>
                                <Text style={[st.tiny, { color: muted }]}>Az</Text>
                                {[0, 0.25, 0.5, 0.75, 1].map(function (v) {
                                    return <View key={v} style={[st.legendDot, { backgroundColor: intensity(v * qMax, qMax) }]} />;
                                })}
                                <Text style={[st.tiny, { color: muted }]}>Çok</Text>
                            </View>
                        </View>
                        <View style={st.grid}>
                            {DAYS.map(function (d) { return <Text key={d} style={[st.dayLbl, { color: muted }]}>{d}</Text>; })}
                            {cells.map(function (c, idx) {
                                if (!c) return <View key={"e" + idx} style={st.cellWrap} />;
                                var sel = c.iso === pick;
                                return (
                                    <View key={c.iso} style={st.cellWrap}>
                                        <Tap onPress={function () { setPick(c.iso); }}
                                            accessibilityLabel={fmtDate(c.iso) + ": " + c.q + " soru, " + hours(c.min) + " saat"}
                                            style={[st.cell, { backgroundColor: intensity(c.q, qMax) }, c.today && st.cellToday, sel && st.cellSel]}>
                                            <Text style={[st.cellTxt, { color: c.q / qMax > 0.6 ? "#fff" : muted }]}>{c.date}</Text>
                                        </Tap>
                                    </View>
                                );
                            })}
                        </View>
                        {picked ? (
                            <View style={[st.detail, dark && { backgroundColor: "#0F172A", borderColor: "#334155" }]}>
                                <Text style={[st.detailDate, { color: ink }]}>{fmtDate(picked.iso)}{picked.today ? " · Bugün" : ""}</Text>
                                <Text style={st.detailQ}>{picked.q} soru</Text>
                                <Text style={[st.small, { color: muted }]}>{hours(picked.min)} saat</Text>
                            </View>
                        ) : null}
                    </Card>

                    <Text style={[st.section, { color: muted }]}>HAFTALIK ÖZET</Text>
                    <View style={st.weeks}>
                        {weeks.slice(-5).map(function (w) {
                            var wq = w.reduce(function (a, c) { return a + c.q; }, 0);
                            var wm = w.reduce(function (a, c) { return a + c.min; }, 0);
                            var wd = w.filter(function (c) { return c.q > 0 || c.min > 0; }).length;
                            return (
                                <View key={w[0].iso} style={[st.week, dark && st.cardDark]}>
                                    <Text style={[st.tiny, { color: muted }]}>Hafta {weekNumber(w[0].iso)}</Text>
                                    <Text style={st.weekQ}>{wq}</Text>
                                    <Text style={[st.tiny, { color: muted }]}>{wd} gün · {Math.round(wm / 60)} sa</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            ) : (
                <View>
                    {dersList.length ? (
                        <View>
                            <View style={st.stats}>
                                <Stat n={dersList.length} l="📚 Toplam ders" color="#4F46E5" />
                                <Stat n={dersList.filter(function (x) { return x.avg >= 80; }).length} l="🌟 Güçlü ders" color="#059669" />
                                <Stat n={dersList.filter(function (x) { return x.avg < 50; }).length} l="⚠️ Zayıf ders" color="#E11D48" />
                                <Stat n={Math.round(hourSum * 10) / 10} l="⏱️ Toplam saat" color="#D97706" />
                            </View>
                            {dersList.map(function (x, di) {
                                var r = 24, len = 2 * Math.PI * r, dash = len * (Math.min(100, x.avg) / 100);
                                var hourPct = hourSum ? Math.round((x.hours / hourSum) * 100) : 0;
                                var opened = open === x.ders;
                                return (
                                    <Card key={x.ders} dark={dark} style={{ padding: 14 }}>
                                        <Tap onPress={function () { setOpen(opened ? "" : x.ders); }} accessibilityState={{ expanded: opened }} style={st.dersRow}>
                                            <View>
                                                <Svg width={60} height={60} viewBox="0 0 60 60">
                                                    <Circle cx="30" cy="30" r={r} fill="none" stroke={dark ? "#334155" : "#E7E5E4"} strokeWidth="5" />
                                                    <Circle cx="30" cy="30" r={r} fill="none" stroke={ringColor(x.avg)} strokeWidth="5"
                                                        strokeDasharray={dash + " " + (len - dash)} strokeLinecap="round" transform="rotate(-90 30 30)" />
                                                    <SvgText x="30" y="35" textAnchor="middle" fontSize="14" fontWeight="800" fill={ink}>{String(x.avg)}</SvgText>
                                                </Svg>
                                                {x.weak > 0 ? <View style={st.weakBadge}><Text style={st.weakTxt}>{x.weak}</Text></View> : null}
                                            </View>
                                            <View style={{ flex: 1, minWidth: 0 }}>
                                                <Text style={[st.dersName, { color: ink }]}>{x.ders} <Text style={{ fontSize: 12 }}>{scoreEmoji(x.avg)}</Text></Text>
                                                <View style={st.barRow}>
                                                    <View style={[st.bar, dark && { backgroundColor: "#334155" }]}>
                                                        <View style={[st.barFill, { width: (hourPct || 4) + "%", backgroundColor: COL[di % COL.length] }]} />
                                                    </View>
                                                    <Text style={[st.tiny, { color: muted }]}>{Math.round(x.hours * 10) / 10} sa</Text>
                                                </View>
                                                <Text style={[st.tiny, { color: muted, marginTop: 4 }]}>{x.scores.length} konu · 💪 {x.strong} güçlü · ⚠️ {x.weak} zayıf</Text>
                                            </View>
                                            <View style={{ transform: [{ rotate: opened ? "90deg" : "0deg" }] }}><ChevronRight size={18} color={muted} /></View>
                                        </Tap>
                                        {opened ? (
                                            <View style={[st.topics, { borderTopColor: dark ? "#334155" : "#E2E8F0" }]}>
                                                <Text style={[st.section, { color: muted, marginTop: 0 }]}>KONU AYRINTILARI</Text>
                                                {x.topics.slice(0, 8).map(function (t) {
                                                    return (
                                                        <View key={t.konu} style={[st.topic, dark && { backgroundColor: "#0F172A", borderColor: "#334155" }]}>
                                                            <View style={st.topicHead}>
                                                                <Text style={[st.topicName, { color: ink }]} numberOfLines={1}>{konuLabel(t.konu)}</Text>
                                                                <Text style={{ fontSize: 11 }}>{scoreEmoji(t.score)}</Text>
                                                            </View>
                                                            <View style={[st.barLine, dark && { backgroundColor: "#334155" }]}>
                                                                <View style={[st.barFill, { width: Math.max(4, t.score) + "%", backgroundColor: ringColor(t.score) }]} />
                                                            </View>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        ) : null}
                                    </Card>
                                );
                            })}
                        </View>
                    ) : (
                        <Card dark={dark}>
                            <Text style={[st.h, { color: ink, textAlign: "center" }]}>Henüz veri yok</Text>
                            <Text style={[st.small, { color: muted, textAlign: "center", marginTop: 4 }]}>Konu çalıştıkça ders analizi burada görünür.</Text>
                        </Card>
                    )}
                </View>
            )}
        </ScrollScreen>
    );
}

var st = StyleSheet.create({
    cardDark: { backgroundColor: "#1E293B", borderColor: "#334155" },
    seg: { flexDirection: "row", padding: 4, borderRadius: 14, backgroundColor: "#EEF2F6", marginBottom: 14 },
    segBtn: { flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: "center" },
    segOn: { backgroundColor: "#FFFFFF", shadowColor: "#0F172A", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    segTxt: { fontSize: 14, fontWeight: "700" },
    stats: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
    stat: { flexGrow: 1, flexBasis: "45%", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 16, paddingVertical: 12, alignItems: "center" },
    statN: { fontSize: 22, fontWeight: "800" },
    statL: { fontSize: 12, marginTop: 2 },
    calHead: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 10 },
    h: { fontSize: 15, fontWeight: "700" },
    small: { fontSize: 12, marginTop: 2 },
    tiny: { fontSize: 11 },
    legend: { flexDirection: "row", alignItems: "center", gap: 3 },
    legendDot: { width: 11, height: 11, borderRadius: 3 },
    grid: { flexDirection: "row", flexWrap: "wrap" },
    dayLbl: { width: "14.2857%", textAlign: "center", fontSize: 10, fontWeight: "600", marginBottom: 4 },
    cellWrap: { width: "14.2857%", padding: 3 },
    cell: { aspectRatio: 1, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    cellToday: { borderWidth: 2, borderColor: "#4F46E5" },
    cellSel: { borderWidth: 2, borderColor: "#D97706" },
    cellTxt: { fontSize: 10, fontWeight: "600" },
    detail: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" },
    detailDate: { fontSize: 13, fontWeight: "700" },
    detailQ: { fontSize: 14, fontWeight: "800", color: "#D97706" },
    section: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8, marginTop: 6, marginBottom: 8 },
    weeks: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
    week: { flexGrow: 1, flexBasis: "30%", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 14, paddingVertical: 10, alignItems: "center" },
    weekQ: { fontSize: 18, fontWeight: "800", color: "#4F46E5", marginVertical: 2 },
    dersRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    weakBadge: { position: "absolute", top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: "#F43F5E", alignItems: "center", justifyContent: "center" },
    weakTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
    dersName: { fontSize: 16, fontWeight: "700" },
    barRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
    bar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: "#E7E5E4", overflow: "hidden" },
    barFill: { height: "100%", borderRadius: 3 },
    barLine: { height: 6, borderRadius: 3, backgroundColor: "#E7E5E4", overflow: "hidden", marginTop: 6 },
    topics: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
    topic: { padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#FFFFFF", marginBottom: 6 },
    topicHead: { flexDirection: "row", alignItems: "center", gap: 6 },
    topicName: { flex: 1, fontSize: 13, fontWeight: "600" },
});
