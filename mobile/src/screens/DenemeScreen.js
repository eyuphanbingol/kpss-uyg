import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { KpssConfig } from "../lib/config";
import { go } from "../nav";
import { Card, PrimaryButton, ScrollScreen } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";

export default function DenemeScreen({ navigation }) {
    var app = useApp();
    var dersler = Object.keys(app.kpssData);
    var stats = StudyPlanner.catalogStats(app.kpssData);
    var _sel = useState(function () {
        var o = {};
        dersler.forEach(function (d) { o[d] = true; });
        return o;
    });
    var sel = _sel[0];
    var setSel = _sel[1];
    var _n = useState(20);
    var n = _n[0];
    var setN = _n[1];
    var _mins = useState(0);
    var mins = _mins[0];
    var setMins = _mins[1];
    var chosen = dersler.filter(function (d) { return sel[d]; });
    var pool = 0;
    chosen.forEach(function (d) { pool += (stats[d] && stats[d].soruSayisi) || 0; });

    function startMixed() {
        var items = StudyPlanner.mixedQuiz(app.kpssData, chosen, n);
        if (!items.length) { Alert.alert("Seçilen derslerde soru yok."); return; }
        var gate = StudentStore.consumeMixed();
        if (!gate.ok) { Alert.alert("Kota", gate.reason); return; }
        go(navigation, "Test", { mode: "mixed", items: items, seconds: mins ? mins * 60 : null });
    }

    function startFull() {
        if (!StudentStore.isPremium()) {
            var ws = SyncEngine.weekStart();
            var weekExams = (app.student.examAttempts || []).filter(function (a) {
                return a.at && a.at.slice(0, 10) >= ws;
            }).length;
            if (weekExams >= (KpssConfig.freeWeeklyExams || 2)) {
                Alert.alert("Kota", "Ücretsiz haftalık tam deneme doldu.", [
                    { text: "Planı gör", onPress: function () { go(navigation, "Paywall"); } },
                    { text: "Tamam" }
                ]);
                return;
            }
        }
        var items = StudyPlanner.mixedQuiz(app.kpssData, ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"], 40);
        go(navigation, "Test", { mode: "exam", items: items, seconds: 40 * 60 });
    }

    return (
        <ScrollScreen>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy }}>Deneme</Text>
            <Text style={{ color: colors.muted, marginBottom: 16 }}>Karışık pratik veya tam kitapçık. Konu kilidini atlatmaz.</Text>
            <Card>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>Dersler · {chosen.length}/{dersler.length} · {pool} soru</Text>
                {dersler.map(function (d) {
                    var on = !!sel[d];
                    var sc = stats[d] || {};
                    return (
                        <Pressable key={d} onPress={function () {
                            var next = Object.assign({}, sel);
                            next[d] = !next[d];
                            setSel(next);
                        }} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
                            <Text style={{ fontSize: 20, marginRight: 8 }}>{DERS_ICON[d]}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: "700" }}>{d}</Text>
                                <Text style={{ color: colors.muted, fontSize: 12 }}>{sc.konuSayisi} konu · {sc.soruSayisi} soru</Text>
                            </View>
                            <Text>{on ? "✓" : "○"}</Text>
                        </Pressable>
                    );
                })}
            </Card>
            <Card>
                <Text style={{ fontWeight: "700", marginBottom: 8 }}>{n} soru</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                    {[10, 20, 30, 40].map(function (x) {
                        return (
                            <Pressable key={x} onPress={function () { setN(x); }} style={{ flex: 1, padding: 8, borderRadius: 12, backgroundColor: n === x ? colors.indigo : "#F5F5F4" }}>
                                <Text style={{ textAlign: "center", color: n === x ? "#fff" : colors.text, fontWeight: "700" }}>{x}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Card>
            <Card>
                <Text style={{ fontWeight: "700", marginBottom: 8 }}>{mins === 0 ? "Süre yok" : mins + " dk"}</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                    {[{ v: 0, t: "Yok" }, { v: 15, t: "15" }, { v: 20, t: "20" }, { v: 40, t: "40" }].map(function (x) {
                        return (
                            <Pressable key={x.v} onPress={function () { setMins(x.v); }} style={{ flex: 1, padding: 8, borderRadius: 12, backgroundColor: mins === x.v ? colors.indigo : "#F5F5F4" }}>
                                <Text style={{ textAlign: "center", color: mins === x.v ? "#fff" : colors.text, fontWeight: "700" }}>{x.t}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Card>
            <PrimaryButton title={"Karışık testi başlat (" + n + " soru)"} onPress={startMixed} />
            <Pressable onPress={startFull} style={{ marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontWeight: "800" }}>Tam deneme</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>40 soru, 40 dakika, sınav temposu.</Text>
            </Pressable>
            {!StudentStore.isPremium() ? (
                <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", marginTop: 12 }}>
                    Ücretsiz: günde {KpssConfig.freeDailyMixed} karışık · haftada {KpssConfig.freeWeeklyExams} tam deneme
                </Text>
            ) : null}
        </ScrollScreen>
    );
}
