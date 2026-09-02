import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { ScoreEngine } from "../lib/scoreEngine";
import { StudentStore } from "../lib/store";
import { StudyPlanner } from "../lib/planner";
import { kpssData } from "../lib/catalog";
import { supabase } from "../lib/supabase";
import taban from "../content/tabanPuanlar.json";
import { Card, PrimaryButton, ScrollScreen } from "../ui";
import { colors } from "../lib/theme";

export function PlacementScreen({ navigation }) {
    var app = useApp();
    var est = ScoreEngine.estimate(app.student);
    var level = (app.student.userProfile && app.student.userProfile.educationLevel) || "lisans";
    var rows = (taban.rows || []).filter(function (r) { return r.level === level; });
    var matches = ScoreEngine.matchPlacement(est.score, rows);
    if (!StudentStore.isPremium()) matches = matches.slice(0, 3);
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ fontWeight: "700" }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginVertical: 8 }}>Puan / tercih</Text>
            <Text style={{ fontSize: 36, fontWeight: "800", color: colors.indigo }}>{est.score}</Text>
            <Text style={{ color: colors.muted, marginBottom: 12 }}>{est.note}</Text>
            {matches.map(function (r, i) {
                return (
                    <Card key={i}>
                        <Text style={{ fontWeight: "800" }}>{r.kurum}</Text>
                        <Text>{r.unvan} · {r.il}</Text>
                        <Text style={{ color: colors.muted }}>Taban {r.taban}</Text>
                    </Card>
                );
            })}
            {!StudentStore.isPremium() ? <PrimaryButton title="Tüm liste için Premium" onPress={function () { navigation.navigate("Paywall"); }} /> : null}
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 8 }}>{taban.note}</Text>
        </ScrollScreen>
    );
}

export function LeaderboardScreen({ navigation }) {
    var _rows = useState([]);
    var rows = _rows[0];
    var setRows = _rows[1];
    var _err = useState("");
    var err = _err[0];
    var setErr = _err[1];
    useEffect(function () {
        supabase.from("leaderboard_weekly").select("nickname,questions").order("questions", { ascending: false }).limit(50)
            .then(function (r) {
                if (r.error) setErr(r.error.message);
                else setRows(r.data || []);
            });
    }, []);
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ fontWeight: "700" }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginVertical: 8 }}>Türkiye</Text>
            {err ? <Text>{err}</Text> : null}
            {rows.map(function (r, i) {
                return (
                    <View key={i} style={{ flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F5F5F4" }}>
                        <Text style={{ width: 28, fontWeight: "800" }}>{i + 1}</Text>
                        <Text style={{ flex: 1 }}>{r.nickname}</Text>
                        <Text style={{ fontWeight: "700" }}>{r.questions}</Text>
                    </View>
                );
            })}
        </ScrollScreen>
    );
}

export function HeatScreen({ navigation }) {
    var app = useApp();
    var sessions = app.student.sessions || {};
    var today = StudentStore.todayStr();
    var cells = [];
    var i;
    for (i = 34; i >= 0; i--) {
        var iso = StudentStore.addDays(today, -i);
        cells.push({ iso: iso, q: (sessions[iso] && sessions[iso].questions) || 0 });
    }
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ fontWeight: "700" }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginVertical: 8 }}>Isı haritası</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {cells.map(function (c) {
                    var bg = c.q === 0 ? "#F5F5F4" : c.q < 10 ? "#FED7AA" : c.q < 25 ? "#FB923C" : "#EA580C";
                    return <View key={c.iso} style={{ width: 18, height: 18, margin: 2, borderRadius: 4, backgroundColor: bg }} />;
                })}
            </View>
        </ScrollScreen>
    );
}

export function AiScreen({ navigation }) {
    var app = useApp();
    var wrong = app.plan.wrong || [];
    var item = wrong[0];
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ fontWeight: "700" }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginVertical: 8 }}>Soru asistanı</Text>
            {!item ? <Text style={{ color: colors.muted }}>Yanlış defterin boş. Önce soru çöz.</Text> : (
                <Card>
                    <Text style={{ fontWeight: "700", marginBottom: 8 }}>{item.q.question}</Text>
                    <Text style={{ color: colors.emerald, fontWeight: "700" }}>Doğru: {item.q.options[item.q.correctAnswerIndex]}</Text>
                    <Text style={{ marginTop: 8 }}>{item.q.explanation}</Text>
                </Card>
            )}
        </ScrollScreen>
    );
}

export function LiveScreen({ navigation }) {
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ fontWeight: "700" }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginVertical: 8 }}>Canlı deneme</Text>
            <Text style={{ color: colors.muted, marginBottom: 16 }}>Cumartesi 21:00 ortak saat. Şimdi de çözebilirsin.</Text>
            <PrimaryButton title="Şimdi denemeyi çöz" onPress={function () {
                var items = StudyPlanner.mixedQuiz(kpssData, ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"], 40);
                navigation.navigate("Test", { mode: "exam", items: items, seconds: 40 * 60 });
            }} />
        </ScrollScreen>
    );
}

export function PaywallScreen({ navigation }) {
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ fontWeight: "700" }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginVertical: 8 }}>Premium</Text>
            <Card>
                <Text style={{ fontWeight: "800", fontSize: 20 }}>149 ₺ / ay</Text>
                <Text style={{ color: colors.muted, marginTop: 8 }}>Daha fazla deneme ve tam tercih listesi. Ödeme şimdilik sandbox.</Text>
            </Card>
            <PrimaryButton title="7 günlük deneme aç" onPress={function () {
                StudentStore.grantMockPremium(7);
                navigation.goBack();
            }} />
        </ScrollScreen>
    );
}
