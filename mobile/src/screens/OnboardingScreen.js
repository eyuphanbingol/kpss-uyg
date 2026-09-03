import React, { useState } from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { KpssConfig } from "../lib/config";
import { Chip, Field, PrimaryButton, ScrollScreen } from "../ui";
import { colors, needsKulvar } from "../lib/theme";

// ============================================================
// ONBOARDING SCREEN
// ============================================================

export default function OnboardingScreen() {
    var app = useApp();
    var isDark = app.dark;
    var student = app.student;
    var dates = KpssConfig.examDateByLevel;
    var profile = student.profile || {};
    var up = student.userProfile || {};

    // ---------- State ----------
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

    // ---------- Step Indicator ----------
    function StepIndicator() {
        var total = needsKulvar(level) ? 3 : 2;
        return (
            <View style={styles.stepContainer}>
                {Array.from({ length: total }, function (_, i) {
                    var idx = i + 1;
                    var isActive = idx === step;
                    var isPast = idx < step;
                    return (
                        <View key={idx} style={styles.stepWrapper}>
                            <View style={[
                                styles.stepDot,
                                isActive && styles.stepDotActive,
                                isPast && styles.stepDotPast,
                            ]}>
                                {isPast ? (
                                    <Text style={styles.stepDotCheck}>✓</Text>
                                ) : (
                                    <Text style={[
                                        styles.stepDotText,
                                        isActive && styles.stepDotTextActive,
                                    ]}>
                                        {idx}
                                    </Text>
                                )}
                            </View>
                            {idx < total && (
                                <View style={[
                                    styles.stepLine,
                                    isPast && styles.stepLinePast,
                                ]} />
                            )}
                        </View>
                    );
                })}
            </View>
        );
    }

    // ---------- Helpers ----------
    function pickLevel(lv) {
        setLevel(lv);
        if (dates[lv]) setExamDate(dates[lv]);
        if (lv !== "lisans") setTarget("B");
    }

    function goToNext() {
        if (step === 1 && !name.trim()) return;
        setStep(needsKulvar(level) ? 2 : 3);
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

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <ScrollScreen dark={isDark}>
            {/* Logo */}
            <Image source={require("../../assets/atanom.png")} style={styles.logo} />
            <Text style={[styles.title, isDark && { color: colors.teal }]}>Atanly</Text>
            <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                Hedefine doğru ilk adımı atalım
            </Text>

            {/* Step Indicator */}
            <StepIndicator />

            {/* ===== STEP 1: Name & Education ===== */}
            {step === 1 && (
                <View>
                    <Field 
                        label="Adın"
                        value={name}
                        onChangeText={setName}
                        placeholder="Örn. Ayşe Yılmaz"
                        autoCapitalize="words"
                        hint="Bu isim liderlik tablosunda görünecek"
                    />
                    <Text style={[styles.sectionLabel, isDark && styles.textMuted]}>
                        Eğitim Düzeyin
                    </Text>
                    <View style={styles.chipRow}>
                        <Chip 
                            title="Lisans" 
                            sub="4 yıllık fakülte" 
                            on={level === "lisans"} 
                            onPress={function () { pickLevel("lisans"); }} 
                        />
                        <Chip 
                            title="Ön lisans" 
                            sub="2 yıllık yüksekokul" 
                            on={level === "onlisans"} 
                            onPress={function () { pickLevel("onlisans"); }} 
                        />
                        <Chip 
                            title="Ortaöğretim" 
                            sub="Lise ve dengi" 
                            on={level === "ortaogretim"} 
                            onPress={function () { pickLevel("ortaogretim"); }} 
                        />
                    </View>
                    <PrimaryButton 
                        title="Devam →" 
                        disabled={!name.trim()} 
                        onPress={goToNext} 
                    />
                </View>
            )}

            {/* ===== STEP 2: Target ===== */}
            {step === 2 && (
                <View>
                    <Text style={[styles.sectionLabel, isDark && styles.textMuted]}>
                        Hedef Kulvarın
                    </Text>
                    <Text style={[styles.sectionHint, isDark && styles.textMuted]}>
                        Hangi alanda sınava gireceksin?
                    </Text>
                    {KpssConfig.targetTypes.map(function (x) {
                        return (
                            <View key={x.id} style={styles.targetItem}>
                                <Chip 
                                    title={x.t} 
                                    on={target === x.id} 
                                    onPress={function () { setTarget(x.id); }} 
                                />
                            </View>
                        );
                    })}
                    <PrimaryButton 
                        title="Devam →" 
                        onPress={function () { setStep(3); }} 
                    />
                </View>
            )}

            {/* ===== STEP 3: KVKK & Account ===== */}
            {step === 3 && (
                <View>
                    <Pressable 
                        onPress={function () { setKvkk(!kvkk); }} 
                        style={styles.kvkkContainer}
                    >
                        <View style={[
                            styles.kvkkCheck,
                            kvkk && styles.kvkkCheckActive,
                        ]}>
                            {kvkk && <Text style={styles.kvkkCheckText}>✓</Text>}
                        </View>
                        <Text style={[styles.kvkkText, isDark && styles.textLight]}>
                            İlerleme verilerimin hesabımda saklanmasına izin veriyorum.
                        </Text>
                    </Pressable>

                    <PrimaryButton 
                        title="🚀 Başla" 
                        disabled={!kvkk} 
                        onPress={complete} 
                    />

                    <Text style={[styles.footerText, isDark && styles.textMuted]}>
                        🔒 Verilerin güvende · İstediğin zaman profilinden silebilirsin
                    </Text>
                </View>
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

    // ---------- Logo ----------
    logo: {
        width: 72,
        height: 72,
        alignSelf: "center",
        marginTop: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: colors.teal,
        textAlign: "center",
        marginTop: 4,
    },
    subtitle: {
        textAlign: "center",
        color: colors.muted,
        fontSize: 14,
        marginBottom: 16,
    },

    // ---------- Step Indicator ----------
    stepContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    stepWrapper: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    stepDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    stepDotActive: {
        borderColor: colors.indigo,
        backgroundColor: colors.indigo,
    },
    stepDotPast: {
        borderColor: colors.emerald,
        backgroundColor: colors.emerald,
    },
    stepDotText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.muted,
    },
    stepDotTextActive: {
        color: "#fff",
    },
    stepDotCheck: {
        fontSize: 13,
        fontWeight: "700",
        color: "#fff",
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: colors.border,
        marginHorizontal: 4,
    },
    stepLinePast: {
        backgroundColor: colors.emerald,
    },

    // ---------- Form ----------
    sectionLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    sectionHint: {
        fontSize: 13,
        color: colors.muted,
        marginBottom: 12,
    },
    chipRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    targetItem: {
        marginBottom: 8,
    },

    // ---------- KVKK ----------
    kvkkContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
        alignItems: "center",
        paddingVertical: 4,
    },
    kvkkCheck: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.indigo,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    kvkkCheckActive: {
        backgroundColor: colors.indigo,
    },
    kvkkCheckText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    kvkkText: {
        flex: 1,
        color: colors.text,
        fontSize: 14,
        lineHeight: 20,
    },

    // ---------- Footer ----------
    footerText: {
        fontSize: 11,
        color: colors.muted,
        textAlign: "center",
        marginTop: 16,
        lineHeight: 16,
    },
});