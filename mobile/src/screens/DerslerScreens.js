import React from "react";
import { Pressable, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { KpssConfig } from "../lib/config";
import { go } from "../nav";
import { Card, ScrollScreen } from "../ui";
import { colors, DERS_ICON, masteryLabel } from "../lib/theme";

export function DersHomeScreen({ navigation }) {
    var app = useApp();
    var kpssData = app.kpssData;
    var stats = StudyPlanner.catalogStats(kpssData);
    var edu = app.student.userProfile && app.student.userProfile.educationLevel;
    var tt = (app.student.userProfile && app.student.userProfile.targetType) || "B";
    var ids = (KpssConfig.targetModules && KpssConfig.targetModules[tt]) || ["gygk"];
    var mods = (KpssConfig.modules || []).filter(function (m) { return ids.indexOf(m.id) >= 0 && m.id !== "gygk"; });

    return (
        <ScrollScreen>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy }}>Dersler</Text>
            <Text style={{ color: colors.muted, marginBottom: 16 }}>Not oku, test çöz. Konular sırayla açılır.</Text>
            {Object.keys(kpssData).map(function (ders) {
                var s = stats[ders] || { konuSayisi: 0, soruSayisi: 0 };
                return (
                    <Pressable key={ders} onPress={function () { go(navigation, "KonuList", { ders: ders }); }}>
                        <Card>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 28, marginRight: 12 }}>{DERS_ICON[ders] || "📚"}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "800", fontSize: 18 }}>{ders}</Text>
                                    <Text style={{ color: colors.muted }}>{s.konuSayisi} konu · {s.soruSayisi} soru</Text>
                                </View>
                                <Text style={{ color: colors.muted }}>→</Text>
                            </View>
                        </Card>
                    </Pressable>
                );
            })}
            {edu === "lisans" && mods.length ? (
                <View style={{ marginTop: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>Kulvarın diğer modülleri</Text>
                    {mods.map(function (m) {
                        return (
                            <Card key={m.id}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View>
                                        <Text style={{ fontWeight: "700" }}>{m.title}</Text>
                                        <Text style={{ color: colors.muted, fontSize: 12 }}>{(m.lessons || []).slice(0, 3).join(" · ") || "İçerik bekleniyor"}</Text>
                                    </View>
                                    <Text style={{ fontSize: 11, fontWeight: "800", color: colors.amber }}>Yakında</Text>
                                </View>
                            </Card>
                        );
                    })}
                </View>
            ) : null}
        </ScrollScreen>
    );
}

export function KonuListScreen({ route, navigation }) {
    var ders = route.params.ders;
    var app = useApp();
    var konular = Object.keys(app.kpssData[ders] || {});
    var topics = (app.student.topics && app.student.topics[ders]) || {};
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ color: colors.muted, fontWeight: "700" }}>← Dersler</Text></Pressable>
            <Text style={{ fontSize: 28, fontWeight: "800", marginVertical: 8 }}>{DERS_ICON[ders]} {ders}</Text>
            {konular.map(function (konu, idx) {
                var kd = app.kpssData[ders][konu] || {};
                var tp = topics[konu] || { mastery: "yok", lastPct: null, attempts: 0 };
                var open = StudentStore.isKonuOpen(ders, konular, idx, app.kpssData);
                var done = StudentStore.topicComplete(tp, kd);
                var m = masteryLabel(tp.mastery);
                return (
                    <Pressable key={konu} disabled={!open} onPress={function () { if (open) go(navigation, "KonuHub", { ders: ders, konu: konu }); }}>
                        <Card style={{ opacity: open ? 1 : 0.45 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flex: 1, paddingRight: 8 }}>
                                    <Text style={{ fontWeight: "700" }}>{done ? "✓ " : (open ? (idx + 1) + ". " : "🔒 ")}{konu}</Text>
                                    <Text style={{ color: colors.muted, fontSize: 12 }}>{open ? ((kd.notlar || []).length + " not · " + (kd.sorular || []).length + " soru") : "Önce önceki konuyu bitir"}</Text>
                                </View>
                                {open ? (
                                    <View>
                                        <Text style={{ fontWeight: "800", textAlign: "right" }}>{tp.lastPct == null ? "—" : "%" + tp.lastPct}</Text>
                                        <Text style={{ color: m.color, fontSize: 11, fontWeight: "700", textAlign: "right" }}>{m.text}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </Card>
                    </Pressable>
                );
            })}
        </ScrollScreen>
    );
}

export function KonuHubScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var kd = (app.kpssData[ders] && app.kpssData[ders][konu]) || {};
    var tp = StudentStore.getTopic(ders, konu);
    var m = masteryLabel(tp.mastery);
    var notlar = kd.notlar || [];
    var sorular = kd.sorular || [];
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ color: colors.muted, fontWeight: "700" }}>← Konular</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginTop: 8 }}>{konu}</Text>
            <Text style={{ color: colors.muted, marginBottom: 8 }}>{ders}</Text>
            <Text style={{ color: m.color, fontWeight: "700", marginBottom: 16 }}>{m.text} · Son net {tp.lastPct == null ? "yok" : "%" + tp.lastPct} · {tp.attempts} deneme</Text>
            <Pressable onPress={function () { go(navigation, "Notes", { ders: ders, konu: konu }); }}>
                <Card style={{ backgroundColor: "#FFF7ED" }}>
                    <Text style={{ fontSize: 20 }}>📖</Text>
                    <Text style={{ fontWeight: "800", fontSize: 18, marginTop: 6 }}>Konu özeti</Text>
                    <Text style={{ color: colors.muted }}>{notlar.length} hap not · {tp.notesDone ? "tamamlandı" : "kaldığın yerden"}</Text>
                </Card>
            </Pressable>
            <Pressable onPress={function () {
                if (!sorular.length) return;
                go(navigation, "Test", {
                    mode: "topic",
                    ders: ders,
                    konu: konu,
                    items: sorular.map(function (q, idx) {
                        var id = q.id != null ? q.id : idx;
                        return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
                    })
                });
            }}>
                <Card>
                    <Text style={{ fontSize: 20 }}>📝</Text>
                    <Text style={{ fontWeight: "800", fontSize: 18, marginTop: 6 }}>Testi çöz</Text>
                    <Text style={{ color: colors.muted }}>{sorular.length} soru · sonuç hakimiyeti günceller</Text>
                </Card>
            </Pressable>
        </ScrollScreen>
    );
}
