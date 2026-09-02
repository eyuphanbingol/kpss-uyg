import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "../lib/supabase";
import { StudentStore } from "../lib/store";
import { KpssConfig } from "../lib/config";
import { sessionStorageShim } from "../lib/storage";
import { Chip, Field, PrimaryButton } from "../ui";
import { colors, needsKulvar } from "../lib/theme";
import { BrandBackdrop } from "./SplashScreen";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
    var dates = KpssConfig.examDateByLevel;
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
    }

    async function submit() {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMsg("Geçerli bir e-posta adresi girin.");
            return;
        }
        if (forgot) {
            setBusy(true);
            var resetRedirect = AuthSession.makeRedirectUri({ scheme: "atanom", path: "reset" });
            var fr = await supabase.auth.resetPasswordForEmail(email, { redirectTo: resetRedirect });
            setBusy(false);
            setMsg(fr.error ? fr.error.message : "Sıfırlama maili gönderildi.");
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
                if (!up.data.session) setMsg("E-postanı doğrula, sonra giriş yap.");
            } else {
                var inn = await supabase.auth.signInWithPassword({ email: email, password: pass });
                if (inn.error) throw inn.error;
            }
        } catch (e) {
            setMsg((e && e.message) || "İşlem başarısız.");
        }
        setBusy(false);
    }

    async function google() {
        if (mode === "up") {
            if (!name.trim() || !kvkk) {
                setMsg("Google ile kayıt için ad ve onay gerekli.");
                return;
            }
            savePending();
        }
        setBusy(true);
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
        setBusy(false);
    }

    function goAfterEdu() {
        if (!name.trim()) { setMsg("Adını yaz."); return; }
        setMsg("");
        setStep(needsKulvar(level) ? 2 : 3);
    }

    return (
        <BrandBackdrop>
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
            <View style={{ backgroundColor: "rgba(255,255,255,0.96)", borderRadius: 28, padding: 22, marginTop: 12 }}>
            <Image source={require("../../assets/atanom.png")} style={{ width: 88, height: 88, alignSelf: "center", marginBottom: 8 }} />
            <Text style={{ fontSize: 28, fontWeight: "800", color: colors.teal, textAlign: "center" }}>Atanom</Text>
            <Text style={{ textAlign: "center", color: colors.muted, marginBottom: 20 }}>Kaldığın yerden devam et</Text>
            <View style={{ flexDirection: "row", backgroundColor: "#E7E5E4", borderRadius: 16, padding: 4, marginBottom: 20 }}>
                <Pressable onPress={function () { setMode("in"); setForgot(false); }} style={{ flex: 1, padding: 10, borderRadius: 12, backgroundColor: mode === "in" ? "#fff" : "transparent" }}>
                    <Text style={{ textAlign: "center", fontWeight: "700" }}>Giriş</Text>
                </Pressable>
                <Pressable onPress={function () { setMode("up"); setStep(1); }} style={{ flex: 1, padding: 10, borderRadius: 12, backgroundColor: mode === "up" ? "#fff" : "transparent" }}>
                    <Text style={{ textAlign: "center", fontWeight: "700" }}>Kayıt</Text>
                </Pressable>
            </View>

            {mode === "in" ? (
                <View>
                    <Field label="E-posta" value={email} onChangeText={setEmail} placeholder="ornek@email.com" keyboardType="email-address" />
                    {forgot ? null : <Field label="Şifre" value={pass} onChangeText={setPass} placeholder="••••••" secure />}
                    <Pressable onPress={function () { setForgot(!forgot); }} style={{ marginBottom: 12 }}>
                        <Text style={{ color: colors.indigo, fontWeight: "600", textAlign: "right" }}>{forgot ? "Girişe dön" : "Şifremi Unuttum"}</Text>
                    </Pressable>
                    <PrimaryButton title={forgot ? "Mail gönder" : "Giriş Yap"} onPress={submit} busy={busy} disabled={busy} />
                    <Text style={{ textAlign: "center", color: colors.muted, marginVertical: 12 }}>veya</Text>
                    <PrimaryButton title="Google ile Devam" onPress={google} busy={busy} disabled={busy} style={{ backgroundColor: colors.navy }} />
                </View>
            ) : (
                <View>
                    {step === 1 ? (
                        <View>
                            <Field label="Adın" value={name} onChangeText={setName} placeholder="Örn. Ayşe Yılmaz" autoCapitalize="words" hint="Bu isim liderlik tablosunda görünecek" />
                            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>Eğitim düzeyin</Text>
                            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                                <Chip title="Lisans" sub="4 yıllık" on={level === "lisans"} onPress={function () { pickLevel("lisans"); }} />
                                <Chip title="Ön lisans" sub="2 yıllık" on={level === "onlisans"} onPress={function () { pickLevel("onlisans"); }} />
                                <Chip title="Ortaöğretim" sub="Lise" on={level === "ortaogretim"} onPress={function () { pickLevel("ortaogretim"); }} />
                            </View>
                            <PrimaryButton title="Devam →" onPress={goAfterEdu} />
                        </View>
                    ) : null}
                    {step === 2 ? (
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>Kulvar</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                                {KpssConfig.targetTypes.map(function (x) {
                                    return <View key={x.id} style={{ width: "48%" }}><Chip title={x.t} on={target === x.id} onPress={function () { setTarget(x.id); }} /></View>;
                                })}
                            </View>
                            <PrimaryButton title="Devam →" onPress={function () { setStep(3); }} />
                        </View>
                    ) : null}
                    {step === 3 ? (
                        <View>
                            <Pressable onPress={function () { setKvkk(!kvkk); }} style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
                                <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.indigo, backgroundColor: kvkk ? colors.indigo : "#fff" }} />
                                <Text style={{ flex: 1, color: colors.text }}>İlerleme verilerimin hesabımda saklanmasına izin veriyorum.</Text>
                            </Pressable>
                            <Field label="Davet kodu (isteğe bağlı)" value={refCode} onChangeText={setRefCode} autoCapitalize="characters" />
                            <Field label="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" />
                            <Field label="Şifre" value={pass} onChangeText={setPass} secure />
                            <PrimaryButton title="Kayıt Ol" onPress={submit} busy={busy} disabled={busy} />
                            <Text style={{ textAlign: "center", color: colors.muted, marginVertical: 12 }}>veya</Text>
                            <PrimaryButton title="Google ile Devam" onPress={google} busy={busy} disabled={busy} style={{ backgroundColor: colors.navy }} />
                        </View>
                    ) : null}
                </View>
            )}
            {msg ? <Text style={{ color: colors.rose, marginTop: 12, textAlign: "center" }}>{msg}</Text> : null}
            <Text style={{ fontSize: 11, color: colors.muted, textAlign: "center", marginTop: 24 }}>İlk kez Google ile gelince ad, eğitim ve kulvar sorulur.</Text>
            </View>
            </ScrollView>
            </SafeAreaView>
        </BrandBackdrop>
    );
}
