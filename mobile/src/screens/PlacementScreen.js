import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Search } from "lucide-react-native";
import { useApp } from "../AppProvider";
import { ScoreEngine } from "../lib/scoreEngine";
import { StudentStore } from "../lib/store";
import taban from "../content/tabanPuanlar.json";
import { Card, Field, PageHeader, PrimaryButton, ScrollScreen, Tap } from "../ui";

// Puan / tercih: tahmini puan ve kurum eşleşmesi. Web karşılığı: js/components/PlacementScreen.jsx
// (aynı filtre, sıralama, arama ve ücretsiz sürüm sınırı).

function scoreLevel(score) {
    if (score >= 90) return "🌟 Mükemmel";
    if (score >= 75) return "✅ İyi";
    if (score >= 60) return "📈 Orta";
    if (score >= 40) return "📉 Gelişmeli";
    return "🔴 Çalışma gerekli";
}
function tone(diff) {
    if (diff >= 4) return { label: "✅ Güvenli", color: "#059669", bg: "#ECFDF5", emoji: "🟢" };
    if (diff >= 0) return { label: "⚠️ Sınırda", color: "#D97706", bg: "#FEF3C7", emoji: "🟡" };
    return { label: "🔴 Riskli", color: "#E11D48", bg: "#FFE4E6", emoji: "🔴" };
}

var FILTERS = [["all", "📋 Tümü"], ["safe", "✅ Güvenli"], ["border", "🟡 Sınırda"], ["risky", "🔴 Riskli"]];
var SORTS = [["taban", "📊 Taban puan"], ["diff", "📈 Fark"], ["kurum", "🔤 Kurum"]];

function fmtDiff(d) {
    var r = Math.round(d * 100) / 100;
    return (r >= 0 ? "+" : "") + String(r).replace(".", ",");
}

function Pill(p) {
    return (
        <Tap onPress={p.onPress} accessibilityState={{ selected: p.on }}
            style={[s.pill, p.dark && s.pillDark, p.on && s.pillOn]}>
            <Text style={[s.pillTxt, p.dark && { color: "#CBD5E1" }, p.on && s.pillTxtOn]}>{p.title}</Text>
        </Tap>
    );
}

export function PlacementScreen({ navigation }) {
    var app = useApp();
    var dark = app.dark;
    var est = ScoreEngine.estimate(app.student);
    var premium = StudentStore.isPremium();
    var [filter, setFilter] = useState("all");
    var [sortBy, setSortBy] = useState("taban");
    var [term, setTerm] = useState("");
    var score = Number(est.score);
    var ready = !!(taban && taban.ready !== false && taban.rows && taban.rows.length);

    var filtered = useMemo(function () {
        var q = term.trim().toLocaleLowerCase("tr-TR");
        var out = (taban.rows || []).filter(function (r) {
            if (r.level && r.level !== est.level) return false;
            if (q) return ((r.kurum || "") + " " + (r.unvan || "") + " " + (r.il || "")).toLocaleLowerCase("tr-TR").indexOf(q) >= 0;
            return true;
        });
        if (filter === "safe") out = out.filter(function (r) { return score - Number(r.taban) >= 4; });
        else if (filter === "risky") out = out.filter(function (r) { return score - Number(r.taban) < 0; });
        else if (filter === "border") out = out.filter(function (r) { var d = score - Number(r.taban); return d >= 0 && d < 4; });
        if (sortBy === "taban") out = out.slice().sort(function (a, b) { return Number(b.taban) - Number(a.taban); });
        else if (sortBy === "diff") out = out.slice().sort(function (a, b) { return (score - Number(b.taban)) - (score - Number(a.taban)); });
        else if (sortBy === "kurum") out = out.slice().sort(function (a, b) { return (a.kurum || "").localeCompare(b.kurum || "", "tr"); });
        return out;
    }, [est.level, score, filter, sortBy, term]);

    var hits = ready ? ScoreEngine.matchPlacement(score, filtered) : [];
    if (!premium && hits.length > 3) hits = hits.slice(0, 3);
    var safeN = hits.filter(function (h) { return score - Number(h.taban) >= 4; }).length;
    var riskyN = hits.filter(function (h) { return score - Number(h.taban) < 0; }).length;

    var ink = dark ? "#F5F5F4" : "#0F172A";
    var muted = dark ? "#94A3B8" : "#64748B";

    return (
        <ScrollScreen dark={dark}>
            <PageHeader dark={dark} title="Puan / Tercih" subtitle="Tahmini puanına göre kurum eşleştirmesi" onBack={function () { navigation.goBack(); }} right={null} />
            <Text style={[s.info, { color: muted }]}>📊 Kaba puan tahmini · ÖSYM sonucu değildir · GY-GK baz alınır</Text>

            <View style={s.hero}>
                <View style={{ flex: 1 }}>
                    <Text style={s.heroKicker}>TAHMİNİ {String(est.level || "").toLocaleUpperCase("tr-TR")}</Text>
                    <Text style={s.heroScore}>{est.score}</Text>
                    <View style={s.heroPill}><Text style={s.heroPillTxt}>{scoreLevel(score)}</Text></View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={s.heroSmall}>📝 Net</Text>
                    <Text style={s.heroNet}>GY {est.gyNet}</Text>
                    <Text style={s.heroNet}>GK {est.gkNet}</Text>
                </View>
            </View>
            {est.note ? <Text style={[s.note, { color: muted }]}>💡 {est.note}</Text> : null}

            {!ready ? (
                <Card dark={dark}><Text style={{ color: muted, textAlign: "center" }}>Taban puan listesi henüz yüklenmemiş. Puan motoru çalışıyor.</Text></Card>
            ) : (
                <View>
                    {hits.length ? (
                        <View style={s.stats}>
                            {[[hits.length, "🎯 Toplam", "#4F46E5"], [safeN, "✅ Güvenli", "#059669"], [riskyN, "🔴 Riskli", "#E11D48"]].map(function (x) {
                                return (
                                    <View key={x[1]} style={[s.stat, dark && s.cardDark]}>
                                        <Text style={[s.statN, { color: x[2] }]}>{x[0]}</Text>
                                        <Text style={[s.statL, { color: muted }]}>{x[1]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    ) : null}
                    {taban.note ? <View style={[s.warn, dark && { backgroundColor: "rgba(217,119,6,.12)", borderColor: "#78350F" }]}><Text style={[s.warnTxt, dark && { color: "#FCD34D" }]}>💡 {taban.note}</Text></View> : null}

                    <Field dark={dark} value={term} onChangeText={setTerm} placeholder="Ara: kurum, unvan, il…" accessibilityLabel="Kurum ara"
                        icon={<Search size={18} color={muted} />} autoCapitalize="none" returnKeyType="search" containerStyle={{ marginBottom: 10 }} />
                    <View style={s.chips}>
                        {FILTERS.map(function (f) { return <Pill key={f[0]} dark={dark} title={f[1]} on={filter === f[0]} onPress={function () { setFilter(f[0]); }} />; })}
                    </View>
                    <View style={[s.chips, { marginBottom: 14 }]}>
                        <Text style={[s.sortLbl, { color: muted }]}>Sırala:</Text>
                        {SORTS.map(function (f) { return <Pill key={f[0]} dark={dark} title={f[1]} on={sortBy === f[0]} onPress={function () { setSortBy(f[0]); }} />; })}
                    </View>

                    {!premium && hits.length >= 3 ? (
                        <View style={[s.premium, dark && { backgroundColor: "rgba(79,70,229,.14)", borderColor: "#3730A3" }]}>
                            <Text style={[s.premiumTxt, dark && { color: "#C7D2FE" }]}>🔓 Premium ile tüm eşleşmeleri görebilirsin</Text>
                            <PrimaryButton title="Yükselt" onPress={function () { navigation.navigate("Paywall"); }} style={{ minHeight: 40, paddingHorizontal: 14 }} />
                        </View>
                    ) : null}

                    {hits.length === 0 ? (
                        <Card dark={dark}>
                            <Text style={{ fontSize: 28, textAlign: "center" }}>🔍</Text>
                            <Text style={{ color: muted, textAlign: "center", marginTop: 6 }}>Bu skor için eşleşen kurum bulunamadı.</Text>
                            <Text style={{ color: muted, textAlign: "center", fontSize: 12, marginTop: 2 }}>Filtreleri değiştirmeyi dene.</Text>
                        </Card>
                    ) : hits.map(function (h, i) {
                        var diff = score - Number(h.taban);
                        var t = tone(diff);
                        return (
                            <View key={i} style={[s.row, dark && s.cardDark, { borderLeftColor: t.color }]}>
                                <View style={{ flex: 1, minWidth: 0 }}>
                                    <Text style={[s.kurum, { color: ink }]}>{h.kurum || "—"} <Text style={[s.unvan, { color: muted }]}>· {h.unvan || "—"}</Text></Text>
                                    <Text style={[s.meta, { color: muted }]}>📍 {h.il || "—"}   📊 Taban: {h.taban}</Text>
                                    <Text style={[s.meta, { color: t.color, fontWeight: "700" }]}>{t.emoji} {fmtDiff(diff)} puan fark</Text>
                                </View>
                                <View style={[s.badge, { backgroundColor: t.bg }]}><Text style={[s.badgeTxt, { color: t.color }]}>{t.label}</Text></View>
                            </View>
                        );
                    })}
                    <Text style={[s.foot, { color: muted }]}>Resmi tercih danışmanlığı değildir. Gerçek tercihler için ÖSYM'yi ziyaret et.</Text>
                </View>
            )}
        </ScrollScreen>
    );
}

var s = StyleSheet.create({
    info: { fontSize: 12, marginBottom: 12 },
    hero: { flexDirection: "row", borderRadius: 18, padding: 18, backgroundColor: "#0D2C4D", marginBottom: 8 },
    heroKicker: { color: "#E7CF8F", fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
    heroScore: { color: "#FFFFFF", fontSize: 48, fontWeight: "800", marginTop: 2 },
    heroPill: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,.14)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginTop: 4 },
    heroPillTxt: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
    heroSmall: { color: "rgba(255,255,255,.7)", fontSize: 12 },
    heroNet: { color: "#FFFFFF", fontSize: 14, fontWeight: "600", marginTop: 2 },
    note: { fontSize: 13, marginBottom: 12 },
    stats: { flexDirection: "row", gap: 8, marginBottom: 12 },
    stat: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 14, paddingVertical: 10, alignItems: "center" },
    statN: { fontSize: 18, fontWeight: "800" },
    statL: { fontSize: 11, marginTop: 2 },
    cardDark: { backgroundColor: "#1E293B", borderColor: "#334155" },
    warn: { borderRadius: 14, borderWidth: 1, borderColor: "#FDE68A", backgroundColor: "#FFFBEB", padding: 10, marginBottom: 12 },
    warnTxt: { fontSize: 12, color: "#B45309" },
    chips: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 8 },
    pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" },
    pillDark: { backgroundColor: "#1E293B", borderColor: "#334155" },
    pillOn: { backgroundColor: "#FEF3C7", borderColor: "#D97706" },
    pillTxt: { fontSize: 13, fontWeight: "600", color: "#334155" },
    pillTxtOn: { color: "#92400E" },
    sortLbl: { fontSize: 12, fontWeight: "700", marginRight: 2 },
    premium: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, borderColor: "#C7D2FE", backgroundColor: "#EEF2FF", padding: 10, marginBottom: 12 },
    premiumTxt: { flex: 1, fontSize: 12, color: "#4338CA" },
    row: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderLeftWidth: 4, borderRadius: 14, padding: 12, marginBottom: 8 },
    kurum: { fontSize: 14, fontWeight: "700" },
    unvan: { fontSize: 12, fontWeight: "400" },
    meta: { fontSize: 12, marginTop: 4 },
    badge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
    badgeTxt: { fontSize: 10, fontWeight: "800" },
    foot: { fontSize: 11, textAlign: "center", marginTop: 12 },
});
