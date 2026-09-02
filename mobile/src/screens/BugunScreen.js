import React from "react";
import { Pressable, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudyPlanner } from "../lib/planner";
import { StudentStore } from "../lib/store";
import { go } from "../nav";
import { Card, ScrollScreen } from "../ui";
import { colors, examTrackName } from "../lib/theme";

export default function BugunScreen({ navigation }) {
    var app = useApp();
    var student = app.student;
    var plan = app.plan;
    var name = student.profile && student.profile.name;
    var level = (student.userProfile && student.userProfile.educationLevel) || "lisans";
    var dash = StudyPlanner.studyDashboard ? StudyPlanner.studyDashboard(student) : null;
    var examLine;
    if (plan.daysLeft == null) examLine = examTrackName(level) + " · sınav tarihi yok";
    else if (plan.daysLeft < 0) examLine = examTrackName(level) + " tarihi geçti";
    else if (plan.daysLeft === 0) examLine = examTrackName(level) + " bugün";
    else examLine = examTrackName(level) + "’ye " + plan.daysLeft + " gün kaldı";

    var saved = student.userProfile && student.userProfile.studyPlan;
    var todayId = StudentStore.planDayId();
    var today = saved && saved.ready && saved.days && saved.days[todayId];

    return (
        <ScrollScreen>
            <Text style={{ color: colors.muted }}>Hoş geldin{name ? ", " + name : ""}</Text>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, marginBottom: 12 }}>Bugün</Text>
            <View style={{ backgroundColor: colors.indigo, borderRadius: 24, padding: 18, marginBottom: 16 }}>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "700" }}>Sınav takvimi</Text>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 4 }}>{examLine}</Text>
            </View>
            <Card>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted }}>Programın</Text>
                <Text style={{ marginTop: 6, color: colors.text }}>
                    {today && today.on && today.slots && today.slots.length
                        ? today.slots.map(function (s) { return s.ders + " · " + s.hours + " sa"; }).join("  ·  ")
                        : "Her güne ayrı ders ve saat yaz."}
                </Text>
                <Pressable onPress={function () { go(navigation, "Program"); }}>
                    <Text style={{ color: colors.indigo, fontWeight: "700", marginTop: 10 }}>{saved && saved.ready ? "Düzenle" : "Oluştur"}</Text>
                </Pressable>
            </Card>
            <Card>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>İstatistikler</Text>
                {dash ? (
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.teal }}>{dash.streak}</Text>
                            <Text style={{ color: colors.muted, fontSize: 12 }}>Seri</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.teal }}>{dash.avgSeansMin}</Text>
                            <Text style={{ color: colors.muted, fontSize: 12 }}>Ort. seans dk</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.teal }}>{dash.totalHours}</Text>
                            <Text style={{ color: colors.muted, fontSize: 12 }}>Toplam saat</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={{ color: colors.muted }}>Çalışmaya başlayınca istatistikler burada görünecek.</Text>
                )}
            </Card>
        </ScrollScreen>
    );
}
