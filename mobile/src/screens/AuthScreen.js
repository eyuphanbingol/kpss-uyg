import React, { useState, useRef, useEffect } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "../lib/supabase";
import { StudentStore } from "../lib/store";
import { KpssConfig } from "../lib/config";
import { sessionStorageShim } from "../lib/storage";
import { Chip, Field, PrimaryButton, GhostButton, Card } from "../ui";
import { colors, needsKulvar } from "../lib/theme";
import { BrandBackdrop } from "./SplashScreen";

WebBrowser.maybeCompleteAuthSession();

// ============================================================
// GOOGLE BUTTON (Özel)
// ============================================================

function GoogleButton({ onPress, busy, disabled }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || busy}
            activeOpacity={0.7}
            style={styles.googleBtn}
        >
            {busy ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <View style={styles.googleBtnContent}>
                    {/* Google Logosu */}
                    <View style={styles.googleIcon}>
                        <Text style={styles.googleIconText}>G</Text>
                    </View>
                    <Text style={styles.googleBtnText}>Google ile Devam</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

// ============================================================
// AUTH SCREEN
// ============================================================

export default function AuthScreen() {
    var dates = KpssConfig.examDateByLevel;
    
    // ---------- State ----------
    var _mode = useState("in");
    var mode = _mode[0];
    var setMode = _mode[1];
    
    var _step = useState(1);
    var step = _step[0];
    var setStep = _step[1];
    
    var _email = useState("");
    var email = _email[0];
    var setEmail = _email[1];
    
    var _pass = useState("");
    var pass = _pass[0];
    var setPass = _pass[1];
    
    var _name = useState("");
    var name = _name[0];
    var setName = _name[1];
    
    var _level = useState("lisans");
    var level = _level[0];
    var setLevel = _level[1];
    
    var _target = useState("B");
    var target = _target[0];
    var setTarget = _target[1];
    
    var _exam = useState(dates.lisans);
    var examDate = _exam[0];
    var setExamDate = _exam[1];
    
    var _kvkk = useState(false);
    var kvkk = _kvkk[0];
    var setKvkk = _kvkk[1];
    
    var _ref = useState("");
    var refCode = _ref[0];
    var setRefCode = _ref[1];
    
    var _msg = useState("");
    var msg = _msg[0];
    var setMsg = _msg[1];
    
    var _busy = useState(false);
    var busy = _busy[0];
    var setBusy = _busy[1];
    
    var _forgot = useState(false);
    var forgot = _forgot[0];
    var setForgot = _forgot[1];
    
    var _showPassword = useState(false);
    var showPassword = _showPassword[0];
    var setShowPassword = _showPassword[1];
    
    var _googleBusy = useState(false);
    var googleBusy = _googleBusy[0];
    var setGoogleBusy = _googleBusy[1];

    // ---------- Refs ----------
    var emailRef = useRef(null);
    var passRef = useRef(null);
    var nameRef = useRef(null);

    // ---------- Focus ----------
    useEffect(function () {
        if (mode === "in" && emailRef.current) {
            emailRef.current.focus();
        }
    }, [mode]);

    // ---------- Helpers ----------
    function savePending() {
        sessionStorageShim.setItem("kpss-signup-profile", JSON.stringify({
            name: name,
            educationLevel: level,
            examDate: examDate,
            targetType: level === "lisans" ? target : "B",
            referredBy: refCode
        }));
    }

    function pickLevel(lv) {
        setLevel(lv);
        if (dates[lv]) setExamDate(dates[lv]);
        if (lv !== "lisans") setTarget("B");
        setMsg("");
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ---------- Submit ----------
    async function submit() {
        if (!email || !validateEmail(email)) {
            setMsg("Geçerli bir e-posta adresi girin.");
            return;
        }
        if (forgot) {
            setBusy(true);
            var resetRedirect = AuthSession.makeRedirectUri({ scheme: "atanom", path: "reset" });
            var fr = await supabase.auth.resetPasswordForEmail(email, { redirectTo: resetRedirect });
            setBusy(false);
            setMsg(fr.error ? fr.error.message : "✅ Sıfırlama maili gönderildi.");
            return;
        }
        if (!pass || pass.length < 6) {
            setMsg("Şifre en az 6 karakter olmalı.");
            return;
        }
        if (mode === "up") {
            if (!name.trim()) { setMsg("Adınızı yazın."); return; }
            if (!kvkk) { setMsg("Devam etmek için onay kutusunu işaretleyin."); return; }
            savePending();
        }
        setBusy(true);
        setMsg("");
        try {
            if (mode === "up") {
                var up = await supabase.auth.signUp({
                    email: email,
                    password: pass,
                    options: {
                        data: {
                            full_name: name.trim(),
                            education_level: level,
                            exam_date: examDate,
                            target_type: level === "lisans" ? target : "B"
                        }
                    }
                });
                if (up.error) throw up.error;
                if (up.data.user) {
                    StudentStore.bindToUser(up.data.user.id, up.data.user.email);
                    StudentStore.consumeSignupIfNeeded(up.data.user);
                }
                if (!up.data.session) {
                    setMsg("✅ E-postanı doğrula, sonra giriş yap.");
                }
            } else {
                var inn = await supabase.auth.signInWithPassword({ email: email, password: pass });
                if (inn.error) throw inn.error;
            }
        } catch (e) {
            setMsg((e && e.message) || "İşlem başarısız.");
        }
        setBusy(false);
    }

    // ---------- Google ----------
    async function google() {
        if (mode === "up") {
            if (!name.trim() || !kvkk) {
                setMsg("Google ile kayıt için ad ve onay gerekli.");
                return;
            }
            savePending();
        }
        setGoogleBusy(true);
        setMsg("");
        try {
            var redirectTo = AuthSession.makeRedirectUri({ scheme: "atanom", path: "auth/callback" });
            var res = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: redirectTo, skipBrowserRedirect: true }
            });
            if (res.error) throw res.error;
            var opened = await WebBrowser.openAuthSessionAsync(res.data.url, redirectTo);
            if (opened.type === "success" && opened.url) {
                var url = opened.url;
                var codeMatch = url.match(/[?&#]code=([^&]+)/);
                if (codeMatch) {
                    var ex = await supabase.auth.exchangeCodeForSession(url);
                    if (ex.error) throw ex.error;
                }
            }
        } catch (e) {
            setMsg((e && e.message) || "Google girişi açılamadı. Supabase redirect listesine atanom:// ekle.");
        }
        setGoogleBusy(false);
    }

    // ---------- Enter Key ----------
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (mode === "in") {
                submit();
            } else if (step === 1 && name.trim()) {
                goAfterEdu();
            } else if (step === 2) {
                setStep(3);
            } else if (step === 3) {
                submit();
            }
        }
    }

    function goAfterEdu() {
        if (!name.trim()) { setMsg("Adını yaz."); return; }
        setMsg("");
        setStep(needsKulvar(level) ? 2 : 3);
    }

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

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <BrandBackdrop>
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <KeyboardAvoidingView 
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent} 
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            {/* Logo */}
                            <Image source={require("../../assets/atanom.png")} style={styles.logo} />
                            <Text style={styles.title}>Atanom</Text>
                            <Text style={styles.subtitle}>
                                {mode === "in" ? "Kaldığın yerden devam et" : "Hedefine doğru ilk adım"}
                            </Text>

                            {/* Mode Toggle */}
                            <View style={styles.toggleContainer}>
                                <Pressable 
                                    onPress={function () { setMode("in"); setForgot(false); setMsg(""); }} 
                                    style={[styles.toggleBtn, mode === "in" && styles.toggleBtnActive]}
                                >
                                    <Text style={[styles.toggleText, mode === "in" && styles.toggleTextActive]}>
                                        🔐 Giriş
                                    </Text>
                                </Pressable>
                                <Pressable 
                                    onPress={function () { setMode("up"); setStep(1); setMsg(""); }} 
                                    style={[styles.toggleBtn, mode === "up" && styles.toggleBtnActive]}
                                >
                                    <Text style={[styles.toggleText, mode === "up" && styles.toggleTextActive]}>
                                        📝 Kayıt
                                    </Text>
                                </Pressable>
                            </View>

                            {/* ===== LOGIN ===== */}
                            {mode === "in" && (
                                <View>
                                    <Field 
                                        label="📧 E-posta"
                                        ref={emailRef}
                                        value={email} 
                                        onChangeText={setEmail} 
                                        placeholder="ornek@email.com" 
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onSubmitEditing={function () { if (forgot) submit(); else passRef.current?.focus(); }}
                                    />
                                    {!forgot && (
                                        <Field 
                                            label="🔒 Şifre"
                                            ref={passRef}
                                            value={pass} 
                                            onChangeText={setPass} 
                                            placeholder="••••••••" 
                                            secure
                                            onSubmitEditing={submit}
                                        />
                                    )}
                                    <Pressable 
                                        onPress={function () { setForgot(!forgot); setMsg(""); }} 
                                        style={styles.forgotBtn}
                                    >
                                        <Text style={styles.forgotText}>
                                            {forgot ? "← Girişe dön" : "Şifremi Unuttum"}
                                        </Text>
                                    </Pressable>

                                    <PrimaryButton 
                                        title={forgot ? "📩 Mail Gönder" : "🚀 Giriş Yap"} 
                                        onPress={submit} 
                                        busy={busy} 
                                        disabled={busy} 
                                    />

                                    <Text style={styles.orText}>veya</Text>

                                    {/* Google Button with Logo */}
                                    <GoogleButton 
                                        onPress={google} 
                                        busy={googleBusy} 
                                        disabled={busy} 
                                    />
                                </View>
                            )}

                            {/* ===== SIGNUP ===== */}
                            {mode === "up" && (
                                <View>
                                    {/* Step Indicator */}
                                    <StepIndicator />

                                    {/* Step 1: Name & Education */}
                                    {step === 1 && (
                                        <View>
                                            <Field 
                                                label="👤 Adın"
                                                ref={nameRef}
                                                value={name} 
                                                onChangeText={setName} 
                                                placeholder="Örn. Ayşe Yılmaz" 
                                                autoCapitalize="words"
                                                hint="Bu isim liderlik tablosunda görünecek"
                                                onSubmitEditing={goAfterEdu}
                                            />
                                            <Text style={styles.sectionLabel}>🎯 Eğitim düzeyin</Text>
                                            <View style={styles.chipRow}>
                                                <Chip 
                                                    title="Lisans" 
                                                    sub="4 yıllık" 
                                                    on={level === "lisans"} 
                                                    onPress={function () { pickLevel("lisans"); }} 
                                                />
                                                <Chip 
                                                    title="Ön lisans" 
                                                    sub="2 yıllık" 
                                                    on={level === "onlisans"} 
                                                    onPress={function () { pickLevel("onlisans"); }} 
                                                />
                                                <Chip 
                                                    title="Ortaöğretim" 
                                                    sub="Lise" 
                                                    on={level === "ortaogretim"} 
                                                    onPress={function () { pickLevel("ortaogretim"); }} 
                                                />
                                            </View>
                                            <PrimaryButton title="Devam →" onPress={goAfterEdu} />
                                        </View>
                                    )}

                                    {/* Step 2: Target */}
                                    {step === 2 && (
                                        <View>
                                            <Text style={styles.sectionLabel}>🎯 Kulvar</Text>
                                            <View style={styles.targetGrid}>
                                                {KpssConfig.targetTypes.map(function (x) {
                                                    return (
                                                        <View key={x.id} style={styles.targetItem}>
                                                            <Chip 
                                                                title={x.t} 
                                                                on={target === x.id} 
                                                                onPress={function () { setTarget(x.id); setMsg(""); }} 
                                                            />
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                            <PrimaryButton title="Devam →" onPress={function () { setStep(3); setMsg(""); }} />
                                        </View>
                                    )}

                                    {/* Step 3: Account */}
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
                                                <Text style={styles.kvkkText}>
                                                    İlerleme verilerimin hesabımda saklanmasına izin veriyorum.
                                                </Text>
                                            </Pressable>

                                            <Field 
                                                label="🔑 Davet kodu (isteğe bağlı)"
                                                value={refCode} 
                                                onChangeText={setRefCode} 
                                                autoCapitalize="characters"
                                                placeholder="Örn: KPSS-ABCD12"
                                            />
                                            <Field 
                                                label="📧 E-posta"
                                                value={email} 
                                                onChangeText={setEmail} 
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                            <Field 
                                                label="🔒 Şifre"
                                                value={pass} 
                                                onChangeText={setPass} 
                                                placeholder="En az 6 karakter" 
                                                secure
                                            />

                                            <PrimaryButton 
                                                title="🚀 Kayıt Ol" 
                                                onPress={submit} 
                                                busy={busy} 
                                                disabled={busy} 
                                            />

                                            <Text style={styles.orText}>veya</Text>

                                            {/* Google Button with Logo */}
                                            <GoogleButton 
                                                onPress={google} 
                                                busy={googleBusy} 
                                                disabled={busy} 
                                            />
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Message */}
                            {msg ? (
                                <View style={[
                                    styles.msgContainer,
                                    msg.includes("✅") && styles.msgSuccess,
                                ]}>
                                    <Text style={[
                                        styles.msgText,
                                        msg.includes("✅") && styles.msgTextSuccess,
                                    ]}>
                                        {msg}
                                    </Text>
                                </View>
                            ) : null}

                            <Text style={styles.footerText}>
                                {mode === "in" 
                                    ? "İlk kez Google ile gelince ad, eğitim ve kulvar sorulur."
                                    : "Hesabın var mı? Giriş yap butonuna tıkla."
                                }
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BrandBackdrop>
    );
}

// ============================================================
// STILLER
// ============================================================

var styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        flexGrow: 1,
        justifyContent: "center",
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.96)",
        borderRadius: 28,
        padding: 22,
        marginTop: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    logo: {
        width: 72,
        height: 72,
        alignSelf: "center",
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.teal,
        textAlign: "center",
    },
    subtitle: {
        textAlign: "center",
        color: colors.muted,
        marginBottom: 16,
        fontSize: 14,
    },

    // ---------- Toggle ----------
    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#E7E5E4",
        borderRadius: 16,
        padding: 4,
        marginBottom: 16,
    },
    toggleBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
    },
    toggleBtnActive: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    toggleText: {
        textAlign: "center",
        fontWeight: "600",
        color: colors.muted,
        fontSize: 14,
    },
    toggleTextActive: {
        color: colors.text,
    },

    // ---------- Step ----------
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
        marginBottom: 8,
    },
    chipRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    targetGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },
    targetItem: {
        width: "48%",
    },

    // ---------- KVKK ----------
    kvkkContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
        alignItems: "center",
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
        fontSize: 13,
    },

    // ---------- Forgot ----------
    forgotBtn: {
        marginBottom: 12,
        alignSelf: "flex-end",
    },
    forgotText: {
        color: colors.indigo,
        fontWeight: "600",
        fontSize: 13,
    },

    // ---------- Or ----------
    orText: {
        textAlign: "center",
        color: colors.muted,
        marginVertical: 12,
        fontSize: 13,
    },

    // ---------- Google Button ----------
    googleBtn: {
        backgroundColor: colors.navy,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        minHeight: 52,
        shadowColor: colors.navy,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    googleBtnContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    googleIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    googleIconText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#4285F4",
    },
    googleBtnText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
        letterSpacing: 0.3,
    },

    // ---------- Message ----------
    msgContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.rose + "15",
        borderWidth: 1,
        borderColor: colors.rose + "30",
    },
    msgSuccess: {
        backgroundColor: colors.emerald + "15",
        borderColor: colors.emerald + "30",
    },
    msgText: {
        color: colors.rose,
        textAlign: "center",
        fontSize: 13,
    },
    msgTextSuccess: {
        color: colors.emerald,
    },

    // ---------- Footer ----------
    footerText: {
        fontSize: 11,
        color: colors.muted,
        textAlign: "center",
        marginTop: 16,
    },
});