import React, { useState, useRef } from "react";
import { Image, Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import { trError } from "../lib/trError";
import { StudentStore } from "../lib/store";
import { KpssConfig } from "../lib/config";
import { sessionStorageShim } from "../lib/storage";
import { SITE } from "../lib/media";
import { Chip, Field, PrimaryButton, Tap, ThemeToggle } from "../ui";
import { needsKulvar } from "../lib/theme";
import { BrandBackdrop } from "./SplashScreen";
import { StatusBar } from "expo-status-bar";

WebBrowser.maybeCompleteAuthSession();

// ============================================================
// GOOGLE BUTTON (Özel)
// ============================================================

function GoogleMark() {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </Svg>
    );
}

function GoogleButton({ onPress, busy, disabled }) {
    return (
        <Tap
            onPress={onPress}
            disabled={disabled || busy}
            style={styles.googleBtn}
        >
            {busy ? (
                <ActivityIndicator size="small" color="#3C4043" />
            ) : (
                <View style={styles.googleBtnContent}>
                    <GoogleMark />
                    <Text style={styles.googleBtnText}>Google ile Devam</Text>
                </View>
            )}
        </Tap>
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
            var resetRedirect = AuthSession.makeRedirectUri({ scheme: "atanly", path: "reset" });
            var fr = await supabase.auth.resetPasswordForEmail(email, { redirectTo: resetRedirect });
            setBusy(false);
            setMsg(fr.error ? trError(fr.error, "Mail gönderilemedi.") : "Sıfırlama maili gönderildi.");
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
                    setMsg("E-postanı doğrula, sonra giriş yap.");
                }
            } else {
                var inn = await supabase.auth.signInWithPassword({ email: email, password: pass });
                if (inn.error) throw inn.error;
            }
        } catch (e) {
            setMsg(trError(e, "İşlem başarısız."));
        }
        setBusy(false);
    }

    function authUrlParams(url) {
        var out = {};
        function eat(chunk) {
            String(chunk || "").replace(/^[?#]/, "").split("&").forEach(function (part) {
                if (!part) return;
                var i = part.indexOf("=");
                var k = decodeURIComponent((i < 0 ? part : part.slice(0, i)).replace(/\+/g, " "));
                var v = decodeURIComponent((i < 0 ? "" : part.slice(i + 1)).replace(/\+/g, " "));
                if (k && v && !out[k]) out[k] = v;
            });
        }
        var u = String(url || "");
        var qi = u.indexOf("?");
        var hi = u.indexOf("#");
        if (qi >= 0) eat(u.slice(qi + 1, hi > qi ? hi : u.length));
        if (hi >= 0) eat(u.slice(hi + 1));
        return out;
    }

    async function sessionFromAuthUrl(url) {
        if (!url) return false;
        var p = authUrlParams(url);
        if (p.error) throw new Error(p.error_description || p.error);
        if (String(p.type || "").toLowerCase() === "recovery") {
            throw new Error("Bu bağlantı şifre sıfırlama için. Google ile girişe tekrar bas.");
        }
        if (p.access_token && p.refresh_token) {
            var set = await supabase.auth.setSession({
                access_token: p.access_token,
                refresh_token: p.refresh_token
            });
            if (set.error) throw set.error;
            return true;
        }
        if (p.code) {
            var ex = await supabase.auth.exchangeCodeForSession(url);
            if (ex.error) throw ex.error;
            return true;
        }
        return false;
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
        var linkSub = null;
        try {
            var redirectTo = SITE + "/auth/callback";
            linkSub = Linking.addEventListener("url", function (ev) {
                if (ev && ev.url) sessionFromAuthUrl(ev.url).catch(function () {});
            });
            var res = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: redirectTo, skipBrowserRedirect: true }
            });
            if (res.error) throw res.error;
            var opened = await WebBrowser.openAuthSessionAsync(res.data.url, redirectTo);
            if (opened.type === "success" && opened.url) {
                await sessionFromAuthUrl(opened.url);
            } else if (opened.type === "cancel" || opened.type === "dismiss") {
                setMsg("Google girişi iptal edildi.");
            }
        } catch (e) {
            setMsg(trError(e, "Google girişi açılamadı."));
        }
        if (linkSub && linkSub.remove) linkSub.remove();
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
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
                <View style={styles.topBar}>
                    <ThemeToggle />
                </View>
                <View style={styles.brand}>
                    <Image source={require("../../assets/atanom.png")} style={styles.logo} />
                    <Text style={styles.title}>Atanly</Text>
                    <Text style={styles.subtitle}>
                        {mode === "in" ? "Kaldığın yerden devam et" : "Hedefine doğru ilk adım"}
                    </Text>
                </View>
                <View style={styles.sheet}>
                    <ScrollView
                        contentContainerStyle={styles.sheetInner}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        automaticallyAdjustKeyboardInsets
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.toggleContainer}>
                            <Tap
                                onPress={function () { setMode("in"); setForgot(false); setMsg(""); }}
                                style={[styles.toggleBtn, mode === "in" && styles.toggleBtnActive]}
                            >
                                <Text style={[styles.toggleText, mode === "in" && styles.toggleTextActive]}>Giriş</Text>
                            </Tap>
                            <Tap
                                onPress={function () { setMode("up"); setStep(1); setMsg(""); }}
                                style={[styles.toggleBtn, mode === "up" && styles.toggleBtnActive]}
                            >
                                <Text style={[styles.toggleText, mode === "up" && styles.toggleTextActive]}>Kayıt</Text>
                            </Tap>
                        </View>

                            {mode === "in" && (
                                <View>
                                    <Field
                                        label="E-posta"
                                        ref={emailRef}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="ornek@email.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        returnKeyType={forgot ? "send" : "next"}
                                        onSubmitEditing={function () { if (forgot) submit(); else passRef.current && passRef.current.focus(); }}
                                    />
                                    {!forgot && (
                                        <Field
                                            label="Şifre"
                                            ref={passRef}
                                            value={pass}
                                            onChangeText={setPass}
                                            placeholder="••••••••"
                                            secure
                                            returnKeyType="done"
                                            onSubmitEditing={submit}
                                        />
                                    )}
                                    <Tap
                                        onPress={function () { setForgot(!forgot); setMsg(""); }}
                                        style={styles.forgotBtn}
                                    >
                                        <Text style={styles.forgotText}>
                                            {forgot ? "Girişe dön" : "Şifremi unuttum"}
                                        </Text>
                                    </Tap>

                                    <PrimaryButton
                                        title={forgot ? "Mail gönder" : "Giriş yap"}
                                        onPress={submit}
                                        busy={busy}
                                        disabled={busy}
                                    />

                                    <Text style={styles.orText}>veya</Text>

                                    <GoogleButton
                                        onPress={google}
                                        busy={googleBusy}
                                        disabled={busy}
                                    />
                                </View>
                            )}

                            {mode === "up" && (
                                <View>
                                    <StepIndicator />

                                    {step === 1 && (
                                        <View>
                                            <Field
                                                label="Adın"
                                                ref={nameRef}
                                                value={name}
                                                onChangeText={setName}
                                                placeholder="Adını yaz"
                                                autoCapitalize="words"
                                                hint="Bu isim liderlik tablosunda görünecek"
                                                returnKeyType="next"
                                                onSubmitEditing={goAfterEdu}
                                            />
                                            <Text style={styles.sectionLabel}>Eğitim düzeyin</Text>
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
                                            <PrimaryButton title="Devam" onPress={goAfterEdu} />
                                        </View>
                                    )}

                                    {step === 2 && (
                                        <View>
                                            <Text style={styles.sectionLabel}>Kulvar</Text>
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
                                            <PrimaryButton title="Devam" onPress={function () { setStep(3); setMsg(""); }} />
                                        </View>
                                    )}

                                    {step === 3 && (
                                        <View>
                                            <Tap
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
                                            </Tap>

                                            <Field
                                                label="Davet kodu (isteğe bağlı)"
                                                value={refCode}
                                                onChangeText={setRefCode}
                                                autoCapitalize="characters"
                                                placeholder="Örn: KPSS-ABCD12"
                                            />
                                            <Field
                                                label="E-posta"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                            <Field
                                                label="Şifre"
                                                value={pass}
                                                onChangeText={setPass}
                                                placeholder="En az 6 karakter"
                                                secure
                                            />

                                            <PrimaryButton
                                                title="Kayıt ol"
                                                onPress={submit}
                                                busy={busy}
                                                disabled={busy}
                                            />

                                            <Text style={styles.orText}>veya</Text>

                                            <GoogleButton
                                                onPress={google}
                                                busy={googleBusy}
                                                disabled={busy}
                                            />
                                        </View>
                                    )}
                                </View>
                            )}

                            {msg ? (
                                <View style={[
                                    styles.msgContainer,
                                    (msg.indexOf("gönderildi") >= 0 || msg.indexOf("doğrula") >= 0) && styles.msgSuccess,
                                ]}>
                                    <Text style={[
                                        styles.msgText,
                                        (msg.indexOf("gönderildi") >= 0 || msg.indexOf("doğrula") >= 0) && styles.msgTextSuccess,
                                    ]}>
                                        {msg}
                                    </Text>
                                </View>
                            ) : null}

                            <Text style={styles.footerText}>
                                {mode === "in"
                                    ? "İlk kez Google ile gelince ad, eğitim ve kulvar sorulur."
                                    : "Hesabın var mı? Giriş yap’a dokun."
                                }
                            </Text>
                    </ScrollView>
                </View>
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
    topBar: {
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingBottom: 4,
    },
    brand: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    logo: {
        width: 64,
        height: 64,
    },
    title: {
        marginTop: 6,
        fontSize: 28,
        fontWeight: "700",
        color: "#F5EBC7",
        letterSpacing: 0.4,
    },
    subtitle: {
        marginTop: 4,
        textAlign: "center",
        color: "rgba(255,255,255,0.72)",
        fontSize: 14,
        fontWeight: "500",
    },
    sheet: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderWidth: 1,
        borderColor: "rgba(226,232,240,0.4)",
        overflow: "hidden",
    },
    sheetInner: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 28,
    },
    toggleContainer: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 14,
        padding: 4,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 11,
        alignItems: "center",
        overflow: "hidden",
    },
    toggleBtnActive: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    toggleText: {
        textAlign: "center",
        fontWeight: "600",
        color: "#64748B",
        fontSize: 14,
    },
    toggleTextActive: {
        color: "#0F172A",
        fontWeight: "700",
    },
    stepContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    stepWrapper: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    stepDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        alignItems: "center",
        justifyContent: "center",
    },
    stepDotActive: {
        borderColor: "#D97706",
        backgroundColor: "#D97706",
    },
    stepDotPast: {
        borderColor: "#FEF3C7",
        backgroundColor: "#FEF3C7",
    },
    stepDotText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#64748B",
    },
    stepDotTextActive: {
        color: "#fff",
    },
    stepDotCheck: {
        fontSize: 12,
        fontWeight: "700",
        color: "#92400E",
    },
    stepLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E2E8F0",
        marginHorizontal: 4,
    },
    stepLinePast: {
        backgroundColor: "#FDE68A",
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#64748B",
        marginBottom: 8,
        letterSpacing: 0.3,
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
    kvkkContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
        alignItems: "center",
        overflow: "hidden",
        borderRadius: 12,
    },
    kvkkCheck: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#D97706",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    kvkkCheckActive: {
        backgroundColor: "#D97706",
    },
    kvkkCheckText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    kvkkText: {
        flex: 1,
        color: "#334155",
        fontSize: 13,
        lineHeight: 18,
    },
    forgotBtn: {
        marginBottom: 12,
        alignSelf: "flex-end",
        overflow: "hidden",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 2,
    },
    forgotText: {
        color: "#D97706",
        fontWeight: "600",
        fontSize: 13,
    },
    orText: {
        textAlign: "center",
        color: "#64748B",
        marginVertical: 12,
        fontSize: 13,
    },
    googleBtn: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        minHeight: 52,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    googleBtnContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    googleBtnText: {
        color: "#3C4043",
        fontWeight: "600",
        fontSize: 15,
    },
    msgContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#FFE4E6",
        borderWidth: 1,
        borderColor: "#FECDD3",
    },
    msgSuccess: {
        backgroundColor: "#FEF3C7",
        borderColor: "#FDE68A",
    },
    msgText: {
        color: "#9F1239",
        textAlign: "center",
        fontSize: 13,
    },
    msgTextSuccess: {
        color: "#92400E",
    },
    footerText: {
        fontSize: 11,
        color: "#64748B",
        textAlign: "center",
        marginTop: 16,
        lineHeight: 16,
    },
});