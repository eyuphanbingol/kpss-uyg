import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight, Dice5 } from "lucide-react-native";
import { useApp } from "../AppProvider";
import { konuLabel } from "../lib/konuLabels";
import { questionImages } from "../lib/media";
import { ZoomableImage } from "../components/ZoomableImage";
import { Card, Field, PageHeader, PrimaryButton, ScrollScreen, Tap } from "../ui";

// Soru asistanı. Web karşılığı: js/components/AiAssistant.jsx (aynı havuz, gezinme ve açıklama metni).

var COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6", "#d946ef"];

function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
}
function strip(opt) { return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim(); }
function letter(i) { return String.fromCharCode(65 + i); }
function levelText(n) {
    if (n === 0) return { t: "Hiç yanlış yok! 🌟", c: "#059669" };
    if (n <= 3) return { t: "Az yanlış, gelişime açık 📈", c: "#D97706" };
    if (n <= 7) return { t: "Orta seviye, tekrar gerekli 📊", c: "#EA580C" };
    return { t: "Çok yanlış, detaylı çalışma şart! 🔥", c: "#E11D48" };
}
export function explainText(item, note) {
    var q = item.q || {};
    var opts = q.options || [];
    var exp = q.explanation || "";
    var txt = note ? "❓ " + note + "\n\n" : "";
    txt += "✅ Doğru cevap: " + letter(q.correctAnswerIndex) + ") " + strip(opts[q.correctAnswerIndex]) + "\n\n";
    txt += "📖 Çözüm notu:\n" + (exp || "Bu soru için kayıtlı bir çözüm notu bulunmuyor.");
    if (!exp) txt += "\n\n💡 Öneri:\n• Konu tekrarı yapmayı dene\n• Benzer soruları çöz\n• Yanlışlarını defterine not et";
    return txt;
}

export function AiScreen({ navigation }) {
    var app = useApp();
    var dark = app.dark;
    var wrong = (app.plan && app.plan.wrong) || [];
    var [pick, setPick] = useState(0);
    var [showOpts, setShowOpts] = useState(true);
    var [shuffleOn, setShuffleOn] = useState(false);
    var [note, setNote] = useState("");
    var [out, setOut] = useState("");
    var [typing, setTyping] = useState(false);
    var timer = useRef(null);

    // Yanlış defteri boşsa katalogdan rastgele 20 soru (web ile aynı)
    var extra = useMemo(function () {
        if (wrong.length) return [];
        var data = app.kpssData || {}, list = [];
        Object.keys(data).forEach(function (ders) {
            Object.keys(data[ders] || {}).forEach(function (konu) {
                ((data[ders][konu] && data[ders][konu].sorular) || []).forEach(function (soru, idx) {
                    if (list.length >= 20) return;
                    list.push({ ders: ders, konu: konu, q: soru, id: soru.id != null ? soru.id : idx });
                });
            });
        });
        return shuffle(list);
    }, [app.kpssData, wrong.length]);
    var pool = useMemo(function () {
        var base = wrong.length ? wrong : extra;
        return shuffleOn ? shuffle(base) : base;
    }, [wrong, extra, shuffleOn]);
    var item = pool[pick] || pool[0];

    var stats = useMemo(function () {
        var count = {}, top = "", topN = 0;
        pool.forEach(function (p) { if (p.ders) count[p.ders] = (count[p.ders] || 0) + 1; });
        Object.keys(count).forEach(function (k) { if (count[k] > topN) { topN = count[k]; top = k; } });
        return { total: pool.length, top: top, level: levelText(pool.length) };
    }, [pool]);

    useEffect(function () { return function () { if (timer.current) clearInterval(timer.current); }; }, []);

    function go(i) {
        if (timer.current) { clearInterval(timer.current); timer.current = null; }
        setTyping(false); setOut(""); setPick(i);
    }
    function explain() {
        if (!item || typing) return;
        var full = explainText(item, note.trim());
        var n = 0;
        setTyping(true); setOut(""); setNote("");
        timer.current = setInterval(function () {
            n += 3;
            if (n >= full.length) { clearInterval(timer.current); timer.current = null; setOut(full); setTyping(false); return; }
            setOut(full.slice(0, n));
        }, 15);
    }

    var ink = dark ? "#F5F5F4" : "#0F172A";
    var muted = dark ? "#94A3B8" : "#64748B";
    var many = pool.length > 1;

    return (
        <ScrollScreen dark={dark}>
            <PageHeader dark={dark} title="Soru Asistanı" subtitle={wrong.length ? "Yanlış defterindeki soruları çözümle" : "Rastgele sorularla çalış"} onBack={function () { navigation.goBack(); }} right={null} />

            {stats.total > 0 ? (
                <Card dark={dark} style={st.statCard}>
                    <View style={st.statN}><Text style={st.statNTxt}>{stats.total}</Text></View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[st.tiny, { color: muted }]}>{wrong.length ? "Yanlış defterindeki soru" : "Havuzdaki soru"}</Text>
                        <Text style={[st.statLine, { color: ink }]}>{stats.total} soru{stats.top ? " · " + stats.top + " ağırlıklı" : ""}</Text>
                        {wrong.length ? <Text style={[st.tiny, { color: stats.level.c, fontWeight: "700", marginTop: 2 }]}>{stats.level.t}</Text> : null}
                    </View>
                </Card>
            ) : null}

            {!item ? (
                <Card dark={dark}>
                    <Text style={{ fontSize: 40, textAlign: "center" }}>🧘</Text>
                    <Text style={[st.h, { color: ink, textAlign: "center" }]}>Henüz soru yok</Text>
                    <Text style={{ color: muted, textAlign: "center", marginTop: 4 }}>Derslerden test çözdükçe yanlışların burada birikir.</Text>
                </Card>
            ) : (
                <View>
                    <View style={st.navRow}>
                        <View style={st.navBtns}>
                            <Tap disabled={!many} onPress={function () { go((pick - 1 + pool.length) % pool.length); }} accessibilityLabel="Önceki soru" style={[st.navBtn, dark && st.btnDark, !many && { opacity: 0.4 }]}><ChevronLeft size={18} color={ink} /></Tap>
                            <Tap onPress={function () { go(Math.floor(Math.random() * pool.length)); }} accessibilityLabel="Rastgele soru" style={[st.navBtn, dark && st.btnDark]}><Dice5 size={18} color={ink} /></Tap>
                            <Tap disabled={!many} onPress={function () { go((pick + 1) % pool.length); }} accessibilityLabel="Sonraki soru" style={[st.navBtn, dark && st.btnDark, !many && { opacity: 0.4 }]}><ChevronRight size={18} color={ink} /></Tap>
                        </View>
                        <Text style={[st.tiny, { color: muted, fontWeight: "700" }]}>{pick + 1} / {pool.length}</Text>
                    </View>
                    <View style={st.toggles}>
                        <Tap onPress={function () { setShuffleOn(!shuffleOn); go(0); }} accessibilityState={{ selected: shuffleOn }} style={[st.toggle, dark && st.btnDark, shuffleOn && st.toggleOn]}>
                            <Text style={[st.toggleTxt, { color: shuffleOn ? "#fff" : ink }]}>🔀 Karışık</Text>
                        </Tap>
                        <Tap onPress={function () { setShowOpts(!showOpts); }} style={[st.toggle, dark && st.btnDark]}>
                            <Text style={[st.toggleTxt, { color: ink }]}>{showOpts ? "📝 Şıkları gizle" : "📝 Şıkları göster"}</Text>
                        </Tap>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips} style={{ marginBottom: 10 }}>
                        {pool.slice(0, 12).map(function (it, i) {
                            var on = i === pick;
                            var label = konuLabel(it.konu || "Soru");
                            return (
                                <Tap key={i} onPress={function () { go(i); }} style={[st.chip, dark && st.btnDark, on && { backgroundColor: COLORS[i % COLORS.length], borderColor: COLORS[i % COLORS.length] }]}>
                                    <Text style={[st.chipTxt, { color: on ? "#fff" : muted }]} numberOfLines={1}>{i + 1}. {label.length > 18 ? label.slice(0, 18) + "…" : label}</Text>
                                </Tap>
                            );
                        })}
                        {pool.length > 12 ? <Text style={[st.tiny, { color: muted, alignSelf: "center", marginLeft: 4 }]}>+{pool.length - 12} daha</Text> : null}
                    </ScrollView>

                    <Card dark={dark}>
                        <View style={st.tagRow}>
                            <View style={st.tag}><Text style={st.tagTxt}>{item.ders || "—"}</Text></View>
                            <Text style={[st.tiny, { color: muted, flex: 1 }]} numberOfLines={1}>{item.konu ? konuLabel(item.konu) : "—"}</Text>
                        </View>
                        <Text style={[st.question, { color: ink }]}>{item.q.question}</Text>
                        {questionImages(item.q).map(function (uri, gi) {
                            return <View key={uri + gi} style={{ marginTop: 10 }}><ZoomableImage uri={uri} dark={dark} /></View>;
                        })}
                        {showOpts ? (
                            <View style={{ marginTop: 12 }}>
                                {(item.q.options || []).map(function (opt, i) {
                                    var ok = i === item.q.correctAnswerIndex;
                                    return (
                                        <View key={i} style={[st.opt, ok && st.optOk, ok && dark && { backgroundColor: "rgba(16,185,129,.12)", borderColor: "#047857" }]}>
                                            <Text style={[st.optL, { color: ok ? "#059669" : muted }]}>{letter(i)}</Text>
                                            <Text style={[st.optT, { color: ok ? (dark ? "#6EE7B7" : "#065F46") : (dark ? "#CBD5E1" : "#475569") }, ok && { fontWeight: "600" }]}>{strip(opt)}</Text>
                                            {ok ? <Text style={st.optOkTxt}>✅ Doğru</Text> : null}
                                        </View>
                                    );
                                })}
                            </View>
                        ) : null}
                        <Field dark={dark} value={note} onChangeText={function (t) { setNote(t.slice(0, 500)); }} placeholder="Neden yanlış yaptım? (isteğe bağlı)"
                            accessibilityLabel="Neden yanlış yaptım" multiline numberOfLines={2} autoCapitalize="sentences" containerStyle={{ marginTop: 14, marginBottom: 8 }}
                            hint={note.length + "/500"} />
                        <PrimaryButton title={typing ? "Yazılıyor…" : "🔍 Açıkla"} busy={typing} onPress={explain} />
                    </Card>

                    {out ? (
                        <View style={[st.out, dark && { backgroundColor: "#1E293B", borderColor: "#334155" }]}>
                            <Text style={st.outHead}>💡 {typing ? "YANIT OLUŞTURULUYOR…" : "ÇÖZÜM ANALİZİ"}</Text>
                            <Text style={[st.outTxt, { color: dark ? "#E2E8F0" : "#334155" }]}>{out}</Text>
                        </View>
                    ) : null}

                    <Text style={[st.foot, { color: muted }]}>🤖 Bu asistan kayıtlı çözüm notlarını gösterir; gerçek yapay zekâ değildir.</Text>
                </View>
            )}
        </ScrollScreen>
    );
}

var st = StyleSheet.create({
    statCard: { flexDirection: "row", alignItems: "center", gap: 12 },
    statN: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#4F46E5", alignItems: "center", justifyContent: "center" },
    statNTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },
    statLine: { fontSize: 14, fontWeight: "700", marginTop: 1 },
    h: { fontSize: 17, fontWeight: "700", marginTop: 6 },
    tiny: { fontSize: 12 },
    navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    navBtns: { flexDirection: "row", gap: 6 },
    navBtn: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
    btnDark: { backgroundColor: "#1E293B", borderColor: "#334155" },
    toggles: { flexDirection: "row", gap: 6, marginBottom: 10 },
    toggle: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" },
    toggleOn: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
    toggleTxt: { fontSize: 13, fontWeight: "600" },
    chips: { gap: 6, paddingRight: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F1F5F9", maxWidth: 200 },
    chipTxt: { fontSize: 12, fontWeight: "600" },
    tagRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
    tag: { backgroundColor: "#EEF2FF", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
    tagTxt: { fontSize: 10, fontWeight: "800", color: "#4338CA", letterSpacing: 0.5 },
    question: { fontSize: 16, fontWeight: "600", lineHeight: 24 },
    opt: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "transparent", marginBottom: 4 },
    optOk: { borderColor: "#34D399", backgroundColor: "#ECFDF5" },
    optL: { fontSize: 12, fontWeight: "800", marginTop: 1 },
    optT: { flex: 1, fontSize: 14, lineHeight: 20 },
    optOkTxt: { fontSize: 10, fontWeight: "800", color: "#059669", marginTop: 2 },
    out: { marginTop: 4, marginBottom: 12, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", borderLeftWidth: 4, borderLeftColor: "#4F46E5", backgroundColor: "#FFFFFF" },
    outHead: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8, color: "#4F46E5", marginBottom: 8 },
    outTxt: { fontSize: 14, lineHeight: 21 },
    foot: { fontSize: 11, textAlign: "center", marginTop: 6 },
});
