import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { KpssConfig } from "../lib/config";
import { Chip, Field, PrimaryButton, ScrollScreen } from "../ui";
import { colors, needsKulvar } from "../lib/theme";

export default function OnboardingScreen() {
    var app = useApp();
    var student = app.student;
    var dates = KpssConfig.examDateByLevel;
    var profile = student.profile || {};
    var up = student.userProfile || {};
    var _name = useState(profile.name || "");
    var name = _name[0];
    var setName = _name[1];
    var _level = useState(up.educationLevel || "lisans");
    var level = _level[0];
    var setLevel = _level[1];
    var _target = useState(up.targetType || "B");
    var target = _target[0];
    var setTarget = _target[1];
    var _exam = useState(profile.examDate || dates[up.educationLevel || "lisans"]);
    var examDate = _exam[0];
    var setExamDate = _exam[1];
    var _kvkk = useState(false);
    var kvkk = _kvkk[0];
    var setKvkk = _kvkk[1];
    var _step = useState(1);
    var step = _step[0];
    var setStep = _step[1];

    function pick(lv) {
        setLevel(lv);
        if (dates[lv]) setExamDate(dates[lv]);
        if (lv !== "lisans") setTarget("B");
    }

    function complete() {
        if (!kvkk || !name.trim()) return;
        StudentStore.completeOnboarding({
            name: name.trim(),
            nickname: name.trim(),
            examDate: examDate,
            dailyMinutes: 45,
            dailyQuestions: 25,
            educationLevel: level,
            targetType: level === "lisans" ? target : "B",
            kvkkConsent: true,
            weeklyHours: 7
        });
        SyncEngine.sync();
    }

    return (
        <ScrollScreen>
            <Image source={require("../../assets/atanom.png")} style={{ width: 80, height: 80, alignSelf: "center" }} />
            <Text style={{ fontSize: 26, fontWeight: "800", color: colors.teal, textAlign: "center" }}>Atanom</Text>
            <Text style={{ textAlign: "center", color: colors.muted, marginBottom: 16 }}>Hedefine doğru ilk adımı atalım</Text>
            {step === 1 ? (
                <View>
                    <Field label="Adın" value={name} onChangeText={setName} placeholder="Örn. Ayşe Yılmaz" autoCapitalize="words" hint="Bu isim liderlik tablosunda görünecek" />
                    <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>Eğitim düzeyin</Text>
                    <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                        <Chip title="Lisans" sub="4 yıllık fakülte" on={level === "lisans"} onPress={function () { pick("lisans"); }} />
                        <Chip title="Ön lisans" sub="2 yıllık yüksekokul" on={level === "onlisans"} onPress={function () { pick("onlisans"); }} />
                        <Chip title="Ortaöğretim" sub="Lise ve dengi" on={level === "ortaogretim"} onPress={function () { pick("ortaogretim"); }} />
                    </View>
                    <PrimaryButton title="Devam →" disabled={!name.trim()} onPress={function () { setStep(needsKulvar(level) ? 2 : 3); }} />
                </View>
            ) : null}
            {step === 2 ? (
                <View>
                    {KpssConfig.targetTypes.map(function (x) {
                        return <View key={x.id} style={{ marginBottom: 8 }}><Chip title={x.t} on={target === x.id} onPress={function () { setTarget(x.id); }} /></View>;
                    })}
                    <PrimaryButton title="Devam →" onPress={function () { setStep(3); }} />
                </View>
            ) : null}
            {step === 3 ? (
                <View>
                    <Pressable onPress={function () { setKvkk(!kvkk); }} style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
                        <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.indigo, backgroundColor: kvkk ? colors.indigo : "#fff" }} />
                        <Text style={{ flex: 1 }}>İlerleme verilerimin hesabımda saklanmasına izin veriyorum.</Text>
                    </Pressable>
                    <PrimaryButton title="Başla" disabled={!kvkk} onPress={complete} />
                    <Text style={{ fontSize: 11, color: colors.muted, textAlign: "center", marginTop: 16 }}>Verilerin güvende · İstediğin zaman profilinden silebilirsin</Text>
                </View>
            ) : null}
        </ScrollScreen>
    );
}
