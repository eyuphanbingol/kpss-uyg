import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { go } from "../nav";
import { Card, ScrollScreen } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";

export default function EksiklerScreen({ navigation }) {
    var app = useApp();
    var plan = app.plan;
    var byDers = {};
    plan.rows.forEach(function (r) {
        if (!byDers[r.ders]) byDers[r.ders] = [];
        byDers[r.ders].push(r);
    });

    function start(kind) {
        var pool = kind === "review" ? plan.due : plan.wrong;
        if (!pool.length) return;
        go(navigation, "Test", { mode: kind, items: pool.slice(0, 30) });
    }

    return (
        <ScrollScreen>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy }}>Eksikler</Text>
            <Text style={{ color: colors.muted, marginBottom: 16 }}>Konu durumu. Not ve soru yalnızca Dersler’den.</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                <Pressable disabled={!plan.due.length} onPress={function () { start("review"); }} style={{ flex: 1, backgroundColor: colors.teal, borderRadius: 16, padding: 14, opacity: plan.due.length ? 1 : 0.4 }}>
                    <Text style={{ color: "#fff", fontWeight: "800" }}>Bugün tekrar · {plan.due.length}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 4 }}>Daha önce çözdüğün, bugün hatırlaman gereken sorular.</Text>
                </Pressable>
                <Pressable disabled={!plan.wrong.length} onPress={function () { start("wrong"); }} style={{ flex: 1, borderWidth: 2, borderColor: colors.rose, borderRadius: 16, padding: 14, opacity: plan.wrong.length ? 1 : 0.4 }}>
                    <Text style={{ color: colors.rose, fontWeight: "800" }}>Yanlış defteri · {plan.wrong.length}</Text>
                    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>Hâlâ yanlışta duran sorular. Konu kilidini açmaz.</Text>
                </Pressable>
            </View>
            {Object.keys(byDers).map(function (ders) {
                return (
                    <View key={ders} style={{ marginBottom: 16 }}>
                        <Text style={{ fontWeight: "800", marginBottom: 6 }}>{DERS_ICON[ders]} {ders}</Text>
                        {byDers[ders].map(function (r) {
                            var done = StudentStore.topicComplete(r, {
                                sorular: new Array(r.soruSayisi || 0),
                                notlar: new Array(r.notSayisi || 0)
                            });
                            return (
                                <View key={r.konu} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, opacity: done ? 1 : 0.45 }}>
                                    <Text style={{ flex: 1 }}>{r.konu}</Text>
                                    <Text style={{ fontSize: 11, fontWeight: "700", color: done ? colors.emerald : colors.muted }}>{done ? "Bitti" : "Bekliyor"}</Text>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </ScrollScreen>
    );
}
