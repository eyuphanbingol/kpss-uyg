import React, { useState } from "react";
import { Alert, Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { KpssConfig } from "../lib/config";
import { go } from "../nav";
import { Card, PrimaryButton, ScrollScreen, Badge } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";

// ============================================================
// DENEME SCREEN
// ============================================================

export default function DenemeScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var dersler = Object.keys(app.kpssData);
    var stats = StudyPlanner.catalogStats(app.kpssData);
    var isPremium = StudentStore.isPremium();

    // ---------- State ----------
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

    // ---------- Computed ----------
    var chosen = dersler.filter(function (d) { return sel[d]; });
    var pool = 0;
    chosen.forEach(function (d) { pool += (stats[d] && stats[d].soruSayisi) || 0; });

    // ---------- Start Mixed ----------
    function startMixed() {
        var items = StudyPlanner.mixedQuiz(app.kpssData, chosen, n);
        if (!items.length) {
            Alert.alert("Seçilen derslerde soru yok.");
            return;
        }
        var gate = StudentStore.consumeMixed();
        if (!gate.ok) {
            Alert.alert("Kota", gate.reason);
            return;
        }
        go(navigation, "Test", { mode: "mixed", items: items, seconds: mins ? mins * 60 : null });
    }

    // ---------- Start Full ----------
    function startFull() {
        if (!isPremium) {
            var ws = SyncEngine.weekStart();
            var weekExams = (app.student.examAttempts || []).filter(function (a) {
                return a.at && a.at.slice(0, 10) >= ws;
            }).length;
            if (weekExams >= (KpssConfig.freeWeeklyExams || 2)) {
                Alert.alert(
                    "Kota Doldu",
                    "Ücretsiz haftalık tam deneme kotan doldu.",
                    [
                        { text: "Premium'a Yükselt", onPress: function () { go(navigation, "Paywall"); } },
                        { text: "Tamam", style: "cancel" }
                    ]
                );
                return;
            }
        }
        var items = StudyPlanner.mixedQuiz(
            app.kpssData,
            ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"],
            40
        );
        go(navigation, "Test", { mode: "exam", items: items, seconds: 40 * 60 });
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <ScrollScreen dark={isDark}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, isDark && styles.textLight]}>
                        Deneme
                    </Text>
                    <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                        Karışık pratik veya tam kitapçık
                    </Text>
                </View>
                {!isPremium && (
                    <Badge type="warning" title="Ücretsiz" />
                )}
            </View>

            {/* Dersler Card */}
            <Card style={[isDark && styles.cardDark]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, isDark && styles.textMuted]}>
                        Dersler
                    </Text>
                    <Text style={[styles.cardCount, isDark && styles.textMuted]}>
                        {chosen.length}/{dersler.length} · {pool} soru
                    </Text>
                </View>
                {dersler.map(function (d) {
                    var on = !!sel[d];
                    var sc = stats[d] || {};
                    return (
                        <Pressable 
                            key={d} 
                            onPress={function () {
                                var next = Object.assign({}, sel);
                                next[d] = !next[d];
                                setSel(next);
                            }} 
                            style={[styles.dersItem, isDark && styles.dersItemDark]}
                        >
                            <View style={styles.dersLeft}>
                                <Text style={styles.dersIcon}>{DERS_ICON[d] || "📚"}</Text>
                                <View>
                                    <Text style={[styles.dersName, isDark && styles.textLight]}>{d}</Text>
                                    <Text style={[styles.dersInfo, isDark && styles.textMuted]}>
                                        {sc.konuSayisi || 0} konu · {sc.soruSayisi || 0} soru
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.dersCheck, on && styles.dersCheckOn]}>
                                <Text style={[styles.dersCheckText, on && styles.dersCheckTextOn]}>
                                    {on ? "✓" : ""}
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
            </Card>

            {/* Soru Sayısı Card */}
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.label, isDark && styles.textMuted]}>
                    Soru Sayısı
                </Text>
                <Text style={[styles.value, isDark && styles.textLight]}>
                    {n} soru
                </Text>
                <View style={styles.optionsRow}>
                    {[10, 20, 30, 40].map(function (x) {
                        var isActive = n === x;
                        return (
                            <Pressable 
                                key={x} 
                                onPress={function () { setN(x); }} 
                                style={[styles.optionBtn, isActive && styles.optionBtnActive]}
                            >
                                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                                    {x}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Card>

            {/* Süre Card */}
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.label, isDark && styles.textMuted]}>
                    Süre
                </Text>
                <Text style={[styles.value, isDark && styles.textLight]}>
                    {mins === 0 ? "Süresiz" : mins + " dakika"}
                </Text>
                <View style={styles.optionsRow}>
                    {[{ v: 0, t: "Süresiz" }, { v: 15, t: "15" }, { v: 20, t: "20" }, { v: 40, t: "40" }].map(function (x) {
                        var isActive = mins === x.v;
                        return (
                            <Pressable 
                                key={x.v} 
                                onPress={function () { setMins(x.v); }} 
                                style={[styles.optionBtn, isActive && styles.optionBtnActive]}
                            >
                                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                                    {x.t}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Card>

            {/* Start Buttons */}
            <PrimaryButton 
                title={"Karışık Testi Başlat (" + n + " soru)"} 
                onPress={startMixed} 
                style={styles.startBtn}
            />

            <Pressable 
                onPress={startFull} 
                style={[styles.fullBtn, isDark && styles.fullBtnDark]}
            >
                <Text style={[styles.fullBtnTitle, isDark && styles.textLight]}>
                    Tam Deneme
                </Text>
                <Text style={[styles.fullBtnDesc, isDark && styles.textMuted]}>
                    40 soru · 40 dakika · Sınav temposu
                </Text>
            </Pressable>

            {/* Footer */}
            {!isPremium && (
                <Text style={[styles.footer, isDark && styles.textMuted]}>
                    Ücretsiz: günde {KpssConfig.freeDailyMixed || 3} karışık · 
                    haftada {KpssConfig.freeWeeklyExams || 2} tam deneme
                </Text>
            )}
        </ScrollScreen>
    );
}

// ============================================================
// STILLER
// ============================================================

var styles = StyleSheet.create({
    // ---------- Text Helpers ----------
    textLight: {
        color: "#fff",
    },
    textMuted: {
        color: colors.muted,
    },

    // ---------- Header ----------
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: colors.navy,
    },
    subtitle: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },

    // ---------- Card ----------
    cardDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    cardCount: {
        fontSize: 12,
        color: colors.muted,
    },

    // ---------- Ders ----------
    dersItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F4",
    },
    dersItemDark: {
        borderBottomColor: colors.muted,
    },
    dersLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    dersIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    dersName: {
        fontWeight: "600",
        fontSize: 14,
        color: colors.text,
    },
    dersInfo: {
        color: colors.muted,
        fontSize: 11,
        marginTop: 1,
    },
    dersCheck: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    dersCheckOn: {
        borderColor: colors.indigo,
        backgroundColor: colors.indigo,
    },
    dersCheckText: {
        fontSize: 12,
        color: "transparent",
    },
    dersCheckTextOn: {
        color: "#fff",
    },

    // ---------- Options ----------
    label: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 10,
    },
    optionsRow: {
        flexDirection: "row",
        gap: 8,
    },
    optionBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#F5F5F4",
        alignItems: "center",
    },
    optionBtnActive: {
        backgroundColor: colors.indigo,
    },
    optionText: {
        fontWeight: "600",
        fontSize: 13,
        color: colors.text,
    },
    optionTextActive: {
        color: "#fff",
    },

    // ---------- Buttons ----------
    startBtn: {
        marginTop: 4,
    },
    fullBtn: {
        marginTop: 12,
        padding: 16,
        borderRadius: 14,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
    },
    fullBtnDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    fullBtnTitle: {
        fontWeight: "700",
        fontSize: 15,
        color: colors.text,
    },
    fullBtnDesc: {
        color: colors.muted,
        fontSize: 12,
        marginTop: 2,
    },

    // ---------- Footer ----------
    footer: {
        fontSize: 12,
        color: colors.muted,
        textAlign: "center",
        marginTop: 14,
    },
});