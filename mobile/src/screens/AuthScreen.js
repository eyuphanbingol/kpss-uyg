import React, { useState, useRef, useEffect } from "react";
import { Animated, Image, Text, View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { AlertCircle, Check, CheckCircle2, ChevronLeft, Gift, GraduationCap, Lock, Mail, MailCheck, User } from "lucide-react-native";
import { SCORE_CLR, SCORE_TXT, passRules, passScore, suggestEmail, validEmail } from "../lib/authHints";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import { trError } from "../lib/trError";
import { StudentStore } from "../lib/store";
import { KpssConfig } from "../lib/config";
import { sessionStorageShim } from "../lib/storage";
import { SITE } from "../lib/media";
import { parseAuthUrl } from "../lib/authLinks";
import { useApp } from "../AppProvider";
import { Field, GhostButton, PrimaryButton, Tap, ThemeToggle } from "../ui";
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
                    <Text style={styles.googleBtnText}>Google ile devam et</Text>
                </View>
            )}
        </Tap>
    );
}

// ============================================================
// AUTH SCREEN
// ============================================================

export default function AuthScreen() {
    var app = useApp();
    var recovering = !!app.recovering;
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
    
    // Kayıttan sonra "mailini kontrol et" ekranı (web: js/components/AuthScreen.jsx checkMail)
    var _sentTo = useState("");
    var sentTo = _sentTo[0], setSentTo = _sentTo[1];
    var _resendIn = useState(0);
    var resendIn = _resendIn[0], setResendIn = _resendIn[1];
    var scrollRef = useRef(null);
    useEffect(function () {
        if (resendIn <= 0) return;
        var t = setTimeout(function () { setResendIn(resendIn - 1); }, 1000);
        return function () { clearTimeout(t); };
    }, [resendIn]);
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

    var _newPass = useState("");
    var newPass = _newPass[0];
    var setNewPass = _newPass[1];
    var _newPass2 = useState("");
    var newPass2 = _newPass2[0];
    var setNewPass2 = _newPass2[1];

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
            targetType: "B",
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
            var fr = await supabase.auth.resetPasswordForEmail(email, { redirectTo: SITE + "/auth/reset" });
            setBusy(false);
            setMsg(fr.error ? trError(fr.error, "Mail gönderilemedi.") : "Sıfırlama maili gönderildi. Linke basınca yeni şifreni yaz.");
            return;
        }
        if (!pass || pass.length < 6) {
            setMsg("Şifre en az 6 karakter olmalı.");
            return;
        }
        if (mode === "up") {
            if (!name.trim()) { setMsg("Adınızı yazın."); return; }
            if (!kvkk) { touch("kvkk"); setMsg(""); return; }
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
                var ids = up.data.user && up.data.user.identities;
                if (!up.data.session && Array.isArray(ids) && ids.length === 0) {
                    // Supabase kayıtlı e-postada hata vermez ve mail de göndermez; kullanıcıya söyle
                    switchMode("in"); setPass("");
                    setMsg("Bu e-postayla zaten bir Atanly hesabı var. Giriş yap; şifreni hatırlamıyorsan “Şifremi unuttum”a dokun.");
                    setBusy(false);
                    return;
                }
                if (up.data.user) {
                    StudentStore.bindToUser(up.data.user.id, up.data.user.email);
                    StudentStore.consumeSignupIfNeeded(up.data.user);
                }
                if (!up.data.session) {
                    setSentTo(email.trim()); setResendIn(60); setMsg("");
                    if (scrollRef.current && scrollRef.current.scrollTo) scrollRef.current.scrollTo({ y: 0, animated: true });
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

    // Maildeki bağlantı doğrulanamadıysa (AppProvider) nedenini göster
    useEffect(function () {
        if (!app.authLinkError) return;
        setMsg(app.authLinkError);
        if (app.clearAuthLinkError) app.clearAuthLinkError();
    }, [app.authLinkError]);

    async function sessionFromAuthUrl(url) {
        if (!url) return false;
        var p = parseAuthUrl(url);
        if (p.error) throw new Error(p.error_description || p.error);
        if (p.isRecovery) {
            if (app.beginRecovery) app.beginRecovery();
            if (p.access_token && p.refresh_token) {
                var recSet = await supabase.auth.setSession({
                    access_token: p.access_token,
                    refresh_token: p.refresh_token
                });
                if (recSet.error) throw recSet.error;
                return true;
            }
            if (p.code) {
                var recEx = await supabase.auth.exchangeCodeForSession(url);
                if (recEx.error) throw recEx.error;
                return true;
            }
            return true;
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

    useEffect(function () {
        if (!recovering) return;
        var cancelled = false;
        Linking.getInitialURL().then(function (url) {
            if (cancelled || !url || !parseAuthUrl(url).isRecovery) return;
            sessionFromAuthUrl(url).catch(function () {});
        }).catch(function () {});
        return function () { cancelled = true; };
    }, [recovering]);

    async function saveNewPassword() {
        if (!newPass || newPass.length < 6) {
            setMsg("Yeni şifre en az 6 karakter olmalı.");
            return;
        }
        if (newPass !== newPass2) {
            setMsg("Şifreler eşleşmiyor.");
            return;
        }
        setBusy(true);
        setMsg("");
        try {
            var res = await supabase.auth.updateUser({ password: newPass });
            if (res.error) throw res.error;
            if (app.finishRecovery) app.finishRecovery();
        } catch (e) {
            setMsg(trError(e, "Şifre güncellenemedi. Maildeki linke tekrar bas."));
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
    // ---------- görünüm durumu ----------
    var _touched = useState({});
    var touched = _touched[0];
    var setTouched = _touched[1];
    function touch(k) { setTouched(function (t) { var n = Object.assign({}, t); n[k] = true; return n; }); }
    var thumb = useRef(new Animated.Value(0)).current;
    var _segW = useState(0);
    var segW = _segW[0];
    var setSegW = _segW[1];
    useEffect(function () {
        Animated.spring(thumb, { toValue: mode === "up" ? 1 : 0, useNativeDriver: true, speed: 18, bounciness: 4 }).start();
    }, [mode]);

    var dark = !!app.isDark;
    var ink = dark ? "#F5F5F4" : "#0F172A";
    var muted = dark ? "#A8A29E" : "#64748B";
    var iconC = dark ? "#78716C" : "#94A3B8";
    var emailErr = touched.email && email && !validEmail(email) ? "E-posta adresi eksik ya da hatalı görünüyor." : "";
    var passErr = touched.pass && pass && pass.length < 6 ? "Şifre en az 6 karakter olmalı." : "";
    var nameErr = touched.name && !name.trim() ? "Adını yaz; liderlik tablosunda bu görünür." : "";
    var mailFix = suggestEmail(email);
    var okMsg = /gönderildi|doğrula|güncellendi/i.test(msg || "");
    var totalSteps = needsKulvar(level) ? 3 : 2;
    var stepLabels = totalSteps === 3 ? ["Seni tanıyalım", "Kulvar", "Hesabın"] : ["Seni tanıyalım", "Hesabın"];
    var stepIdx = totalSteps === 3 ? step : (step === 3 ? 2 : 1);

    async function resendConfirm() {
        if (!sentTo || resendIn > 0 || busy) return;
        setBusy(true); setMsg("");
        try {
            var r = await supabase.auth.resend({ type: "signup", email: sentTo });
            if (r && r.error) throw r.error;
            setMsg("✅ Yeni onay bağlantısı gönderildi."); setResendIn(60);
        } catch (e) {
            setMsg(trError(e, "Mail gönderilemedi."));
        }
        setBusy(false);
    }

    function switchMode(m) {
        setMode(m); setForgot(false); setStep(1); setMsg(""); setTouched({});
    }

    function MailFix() {
        if (!mailFix) return null;
        return (
            <Tap onPress={function () { setEmail(mailFix); }} accessibilityLabel={"E-postayı " + mailFix + " olarak düzelt"} style={ns.fix}>
                <Text style={[ns.fixTxt, { color: muted }]}>Bunu mu demek istedin: <Text style={ns.fixLink}>{mailFix}</Text>?</Text>
            </Tap>
        );
    }
    function Strength(props) {
        var sc = passScore(props.value), rules = passRules(props.value);
        return (
            <View style={{ marginTop: 8 }} accessible accessibilityLabel={props.value ? "Şifre gücü: " + SCORE_TXT[sc] : "Şifre gücü"}>
                <View style={ns.meter}>
                    {[1, 2, 3, 4].map(function (i) {
                        return <View key={i} style={[ns.meterSeg, { backgroundColor: sc >= i ? SCORE_CLR[sc] : (dark ? "#44403C" : "#E2E8F0") }]} />;
                    })}
                </View>
                <View style={ns.rules}>
                    {rules.map(function (r) {
                        return (
                            <View key={r.t} style={ns.rule}>
                                <Check size={13} color={r.ok ? "#047857" : iconC} strokeWidth={2.6} />
                                <Text style={[ns.ruleTxt, { color: r.ok ? "#047857" : iconC }]}>{r.t}</Text>
                            </View>
                        );
                    })}
                    {props.value ? <Text style={[ns.scoreTxt, { color: ink }]}>{SCORE_TXT[sc]}</Text> : null}
                </View>
            </View>
        );
    }
    function Notice() {
        if (!msg) return null;
        return (
            <View style={[ns.notice, okMsg ? ns.noticeOk : ns.noticeErr]} accessibilityLiveRegion="polite" accessibilityRole="alert">
                {okMsg ? <CheckCircle2 size={18} color="#047857" /> : <AlertCircle size={18} color="#BE123C" />}
                <Text style={[ns.noticeTxt, { color: okMsg ? "#065F46" : "#9F1239" }]}>{msg}</Text>
            </View>
        );
    }
    function OrLine() {
        return (
            <View style={ns.or}>
                <View style={[ns.orLine, dark && { backgroundColor: "#44403C" }]} />
                <Text style={[ns.orTxt, { color: muted }]}>veya</Text>
                <View style={[ns.orLine, dark && { backgroundColor: "#44403C" }]} />
            </View>
        );
    }
    function Steps() {
        return (
            <View style={ns.steps} accessibilityRole="progressbar" accessibilityLabel={"Adım " + stepIdx + " / " + totalSteps + ": " + stepLabels[stepIdx - 1]}>
                {stepLabels.map(function (t, i) {
                    var on = stepIdx === i + 1, done = stepIdx > i + 1;
                    return (
                        <View key={t} style={[ns.stepItem, i < stepLabels.length - 1 && { flex: 1 }]}>
                            <View style={[ns.stepDot, done && ns.stepDone, on && ns.stepOn]}>
                                {done ? <Check size={12} color="#fff" strokeWidth={3} /> : <Text style={[ns.stepNo, (on || done) && { color: "#fff" }]}>{i + 1}</Text>}
                            </View>
                            {on ? <Text style={[ns.stepTxt, { color: ink }]} numberOfLines={1}>{t}</Text> : null}
                            {i < stepLabels.length - 1 ? <View style={[ns.stepLine, dark && { backgroundColor: "#44403C" }, done && { backgroundColor: "#047857" }]} /> : null}
                        </View>
                    );
                })}
            </View>
        );
    }
    function Option(props) {
        return (
            <Tap onPress={props.onPress} accessibilityRole="radio" accessibilityState={{ checked: props.on }}
                style={[ns.option, dark && ns.optionDark, props.on && ns.optionOn, props.on && dark && { backgroundColor: "rgba(20,184,166,0.08)", borderColor: "#2DD4BF" }]}>
                <View style={[ns.optIcon, props.on && ns.optIconOn]}><GraduationCap size={20} color={props.on ? "#fff" : "#B45309"} /></View>
                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[ns.optTitle, { color: ink }]}>{props.title}</Text>
                    {props.sub ? <Text style={[ns.optSub, { color: muted }]}>{props.sub}</Text> : null}
                </View>
                <View style={[ns.radio, props.on && ns.radioOn]}>{props.on ? <Check size={12} color="#fff" strokeWidth={3} /> : null}</View>
            </Tap>
        );
    }

    var mailHost = (sentTo.split("@")[1] || "").toLowerCase();
    var inboxLink = /gmail|googlemail/.test(mailHost) ? ["Gmail'i aç", "https://mail.google.com/mail/u/0/#inbox"]
        : /hotmail|outlook|live|msn/.test(mailHost) ? ["Outlook'u aç", "https://outlook.live.com/mail/0/inbox"]
        : /yahoo/.test(mailHost) ? ["Yahoo Mail'i aç", "https://mail.yahoo.com"]
        : /icloud|me\.com|mac\.com/.test(mailHost) ? ["iCloud Mail'i aç", "https://www.icloud.com/mail"]
        : /yandex/.test(mailHost) ? ["Yandex Mail'i aç", "https://mail.yandex.com.tr"] : null;

    var heading = recovering ? "Yeni şifreni belirle" : sentTo ? "Mailini kontrol et" : forgot ? "Şifreni sıfırla" : mode === "up" ? "Hesabını oluştur" : "Tekrar hoş geldin";
    var sub = recovering ? "Maildeki bağlantı seni buraya getirdi. Yeni şifren en az 6 karakter olsun."
        : sentTo ? "Hesabın hazır; açmak için tek adım kaldı."
        : forgot ? "E-postanı yaz; şifre sıfırlama bağlantısını gönderelim."
        : mode === "up" ? "Ücretsiz. Kısa birkaç adım; kart bilgisi istenmez."
        : "Programın, notların ve yanlış defterin seni bekliyor.";

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <BrandBackdrop>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
                <View style={ns.top}>
                    <View style={ns.brandRow}>
                        <Image source={require("../../assets/atanom.png")} style={ns.logo} accessibilityIgnoresInvertColors />
                        <Text style={ns.brandName}>Atanly</Text>
                    </View>
                    <ThemeToggle dark={dark} />
                </View>
                <View style={ns.hero}>
                    <Text style={ns.kicker}>KPSS · GY-GK</Text>
                    <Text style={ns.heroTitle}>Atamaya giden çalışma odası.</Text>
                </View>
                <View style={[styles.sheet, dark && ns.sheetDark]}>
                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={ns.sheetInner}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        automaticallyAdjustKeyboardInsets
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={[ns.h1, { color: ink }]} accessibilityRole="header">{heading}</Text>
                        <Text style={[ns.sub, { color: muted }]}>{sub}</Text>

                        {recovering ? (
                            <View>
                                <Field dark={dark} label="Yeni şifre" value={newPass} onChangeText={setNewPass} placeholder="En az 6 karakter" secure
                                    icon={<Lock size={18} color={iconC} />} autoComplete="password-new" textContentType="newPassword" extra={<Strength value={newPass} />} />
                                <Field dark={dark} label="Yeni şifre (tekrar)" value={newPass2} onChangeText={setNewPass2} placeholder="Şifreni tekrar yaz" secure
                                    icon={<Lock size={18} color={iconC} />} error={newPass2 && newPass2 !== newPass ? "Şifreler eşleşmiyor." : ""} />
                                <PrimaryButton title="Şifreyi kaydet" onPress={saveNewPassword} busy={busy} disabled={busy} />
                                <Tap onPress={function () { if (app.cancelRecovery) app.cancelRecovery(); }} style={ns.linkBtn}>
                                    <Text style={ns.link}>Girişe dön</Text>
                                </Tap>
                                <Notice />
                            </View>
                        ) : sentTo ? (
                            <View accessibilityLiveRegion="polite">
                                <Notice />
                                <View style={[ns.mailIco, dark && { backgroundColor: "rgba(20,184,166,0.14)" }]}><MailCheck size={26} color="#0F766E" /></View>
                                <Text style={[ns.mailLead, { color: muted }]}><Text style={{ color: ink, fontWeight: "700" }}>{sentTo}</Text> adresine bir onay bağlantısı gönderdik.</Text>
                                <View style={ns.mailStep}><View style={[ns.mailNo, dark && { backgroundColor: "#292524" }]}><Text style={[ns.mailNoTxt, { color: ink }]}>1</Text></View><Text style={[ns.mailStepTxt, { color: muted }]}>Gelen kutunu aç; konu: <Text style={{ color: ink, fontWeight: "700" }}>“Atanly hesabını onayla”</Text>.</Text></View>
                                <View style={ns.mailStep}><View style={[ns.mailNo, dark && { backgroundColor: "#292524" }]}><Text style={[ns.mailNoTxt, { color: ink }]}>2</Text></View><Text style={[ns.mailStepTxt, { color: muted }]}><Text style={{ color: ink, fontWeight: "700" }}>Hesabımı onayla</Text> düğmesine dokun; uygulama açılır ve giriş yapılır.</Text></View>
                                {inboxLink ? (
                                    <PrimaryButton title={inboxLink[0]} onPress={function () { Linking.openURL(inboxLink[1]).catch(function () {}); }} style={{ marginTop: 16 }} />
                                ) : null}
                                <View style={[ns.mailTip, dark && { backgroundColor: "rgba(217,119,6,0.12)", borderColor: "#78350F" }]}>
                                    <Text style={[ns.mailTipTxt, dark && { color: "#FCD34D" }]}>Birkaç dakikada gelmezse <Text style={{ fontWeight: "700" }}>Spam / Gereksiz</Text> klasörüne bak. Oradaysa “Gereksiz değil” olarak işaretle.</Text>
                                </View>
                                <View style={ns.row}>
                                    <View style={{ flex: 1 }}><GhostButton title={resendIn > 0 ? "Tekrar gönder (" + resendIn + ")" : "Tekrar gönder"} disabled={resendIn > 0 || busy} busy={busy} onPress={resendConfirm} /></View>
                                    <View style={{ flex: 1 }}><GhostButton title="E-postayı düzelt" onPress={function () { setSentTo(""); setStep(3); setMsg(""); }} /></View>
                                </View>
                                <Tap onPress={function () { setSentTo(""); switchMode("in"); setPass(""); }} style={ns.linkBtn}>
                                    <Text style={ns.link}>Onayladım, giriş yap</Text>
                                </Tap>
                            </View>
                        ) : (
                            <View>
                                {!forgot ? (
                                    <View style={[ns.seg, dark && ns.segDark]} accessibilityRole="tablist" onLayout={function (e) { setSegW(e.nativeEvent.layout.width); }}>
                                        {segW ? (
                                            <Animated.View pointerEvents="none" style={[ns.segThumb, dark && ns.segThumbDark, { width: (segW - 8) / 2, transform: [{ translateX: thumb.interpolate({ inputRange: [0, 1], outputRange: [0, (segW - 8) / 2] }) }] }]} />
                                        ) : null}
                                        {[["in", "Giriş yap"], ["up", "Kayıt ol"]].map(function (t) {
                                            var on = mode === t[0];
                                            return (
                                                <Tap key={t[0]} onPress={function () { switchMode(t[0]); }} accessibilityRole="tab" accessibilityState={{ selected: on }} style={ns.segBtn}>
                                                    <Text style={[ns.segTxt, on && { color: ink }]}>{t[1]}</Text>
                                                </Tap>
                                            );
                                        })}
                                    </View>
                                ) : null}

                                <Notice />

                                {mode === "in" && (
                                    <View>
                                        <Field dark={dark} label="E-posta" ref={emailRef} value={email} onChangeText={setEmail} placeholder="ad@ornek.com"
                                            keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress"
                                            icon={<Mail size={18} color={iconC} />} error={emailErr} onBlur={function () { touch("email"); }} extra={<MailFix />}
                                            returnKeyType={forgot ? "send" : "next"} blurOnSubmit={false}
                                            onSubmitEditing={function () { if (forgot) submit(); else passRef.current && passRef.current.focus(); }} />
                                        {!forgot ? (
                                            <Field dark={dark} label="Şifre" ref={passRef} value={pass} onChangeText={setPass} placeholder="Şifren" secure
                                                autoComplete="password" textContentType="password" icon={<Lock size={18} color={iconC} />}
                                                error={passErr} onBlur={function () { touch("pass"); }} returnKeyType="go" onSubmitEditing={submit}
                                                aside={<Tap onPress={function () { setForgot(true); setMsg(""); }} hitSlop={8}><Text style={ns.link}>Şifremi unuttum</Text></Tap>} />
                                        ) : null}
                                        <PrimaryButton title={forgot ? "Sıfırlama bağlantısı gönder" : "Giriş yap"} onPress={submit} busy={busy} disabled={busy} />
                                        {forgot ? (
                                            <Tap onPress={function () { setForgot(false); setMsg(""); }} style={ns.linkBtn}>
                                                <Text style={ns.link}>Girişe dön</Text>
                                            </Tap>
                                        ) : (
                                            <View>
                                                <OrLine />
                                                <GoogleButton onPress={google} busy={googleBusy} disabled={busy} />
                                            </View>
                                        )}
                                    </View>
                                )}

                                {mode === "up" && (
                                    <View>
                                        <Steps />
                                        {step === 1 && (
                                            <View>
                                                <Field dark={dark} label="Adın" ref={nameRef} value={name} onChangeText={setName} placeholder="Adın" autoCapitalize="words"
                                                    autoComplete="name-given" textContentType="givenName" icon={<User size={18} color={iconC} />}
                                                    error={nameErr} onBlur={function () { touch("name"); }} hint="Liderlik tablosunda bu isim görünür."
                                                    returnKeyType="next" onSubmitEditing={goAfterEdu} />
                                                <Text style={[ns.legend, { color: ink }]}>Hangi KPSS'ye hazırlanıyorsun?</Text>
                                                <View accessibilityRole="radiogroup" style={{ gap: 8, marginBottom: 18 }}>
                                                    <Option title="Lisans" sub="4 yıllık üniversite mezunları" on={level === "lisans"} onPress={function () { pickLevel("lisans"); }} />
                                                    <Option title="Ön lisans" sub="2 yıllık önlisans mezunları" on={level === "onlisans"} onPress={function () { pickLevel("onlisans"); }} />
                                                    <Option title="Ortaöğretim" sub="Lise ve dengi okul mezunları" on={level === "ortaogretim"} onPress={function () { pickLevel("ortaogretim"); }} />
                                                </View>
                                                <PrimaryButton title="Devam et" onPress={function () { if (!name.trim()) { touch("name"); return; } goAfterEdu(); }} />
                                            </View>
                                        )}

                                        {step === 2 && (
                                            <View>
                                                <Text style={[ns.legend, { color: ink }]}>Kulvarın</Text>
                                                <View accessibilityRole="radiogroup" style={{ gap: 8, marginBottom: 18 }}>
                                                    {KpssConfig.targetTypes.map(function (x) {
                                                        return <Option key={x.id} title={x.t} sub={x.d} on={target === x.id} onPress={function () { setTarget(x.id); setMsg(""); }} />;
                                                    })}
                                                </View>
                                                <View style={ns.row}>
                                                    <Tap onPress={function () { setStep(1); }} style={[ns.backBtn, dark && ns.backBtnDark]} accessibilityLabel="Geri">
                                                        <ChevronLeft size={20} color={ink} />
                                                    </Tap>
                                                    <View style={{ flex: 1 }}><PrimaryButton title="Devam et" onPress={function () { setStep(3); setMsg(""); }} /></View>
                                                </View>
                                            </View>
                                        )}

                                        {step === 3 && (
                                            <View>
                                                <Field dark={dark} label="E-posta" value={email} onChangeText={setEmail} placeholder="ad@ornek.com" keyboardType="email-address" autoCapitalize="none"
                                                    autoComplete="email" textContentType="emailAddress" icon={<Mail size={18} color={iconC} />}
                                                    error={emailErr} onBlur={function () { touch("email"); }} extra={<MailFix />} returnKeyType="next" />
                                                <Field dark={dark} label="Şifre" value={pass} onChangeText={setPass} placeholder="En az 6 karakter" secure
                                                    autoComplete="password-new" textContentType="newPassword" icon={<Lock size={18} color={iconC} />}
                                                    error={passErr} onBlur={function () { touch("pass"); }} extra={<Strength value={pass} />} />
                                                <Field dark={dark} label="Davet kodu (isteğe bağlı)" value={refCode} onChangeText={function (v) { setRefCode(v.toUpperCase()); }}
                                                    autoCapitalize="characters" placeholder="KPSS-ABCD12" icon={<Gift size={18} color={iconC} />} />
                                                <Tap onPress={function () { setKvkk(!kvkk); }} style={[ns.consent, touched.kvkk && !kvkk && ns.consentErr]} accessibilityRole="checkbox" accessibilityState={{ checked: kvkk }}>
                                                    <View style={[ns.box, kvkk && ns.boxOn, touched.kvkk && !kvkk && { borderColor: "#E11D48" }]}>{kvkk ? <Check size={14} color="#fff" strokeWidth={3} /> : null}</View>
                                                    <Text style={[ns.consentTxt, { color: muted }]}>
                                                        <Text style={{ color: ink, fontWeight: "600" }}>Kullanım Koşulları</Text> ve <Text style={{ color: ink, fontWeight: "600" }}>Üyelik Sözleşmesi</Text>'ni kabul ediyorum; ilerleme verilerimin KVKK Aydınlatma Metni'ne göre hesabımda saklanmasına izin veriyorum.
                                                    </Text>
                                                </Tap>
                                                {touched.kvkk && !kvkk ? <Text style={ns.consentErrTxt} accessibilityLiveRegion="polite">Devam etmek için onay kutusunu işaretle.</Text> : null}
                                                <View style={ns.row}>
                                                    <Tap onPress={function () { setStep(needsKulvar(level) ? 2 : 1); }} style={[ns.backBtn, dark && ns.backBtnDark]} accessibilityLabel="Geri">
                                                        <ChevronLeft size={20} color={ink} />
                                                    </Tap>
                                                    <View style={{ flex: 1 }}><PrimaryButton title="Hesabı oluştur" onPress={submit} busy={busy} disabled={busy} /></View>
                                                </View>
                                                <OrLine />
                                                <GoogleButton onPress={google} busy={googleBusy} disabled={busy} />
                                            </View>
                                        )}
                                    </View>
                                )}

                                <Text style={[ns.foot, { color: muted }]}>
                                    {mode === "in" ? "İlk kez Google ile gelince ad, eğitim ve kulvar sorulur." : "Zaten hesabın var mı? Üstten \"Giriş yap\"a dokun."}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </BrandBackdrop>
    );
}

var ns = StyleSheet.create({
    mailIco: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#F0FDFA", alignItems: "center", justifyContent: "center", marginBottom: 16 },
    mailLead: { fontSize: 15, lineHeight: 22, marginBottom: 14 },
    mailStep: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginBottom: 10 },
    mailNo: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#F1F5F9", alignItems: "center", justifyContent: "center" },
    mailNoTxt: { fontSize: 12, fontWeight: "800" },
    mailStepTxt: { flex: 1, fontSize: 14, lineHeight: 20 },
    mailTip: { marginTop: 16, marginBottom: 16, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#FDE68A", backgroundColor: "#FFFBEB" },
    mailTipTxt: { fontSize: 13, lineHeight: 19, color: "#92400E" },
    top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 6 },
    brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    logo: { width: 38, height: 38 },
    brandName: { color: "#fff", fontSize: 19, fontWeight: "800", letterSpacing: -0.2 },
    hero: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 22 },
    kicker: { color: "#E8C987", fontSize: 11.5, fontWeight: "800", letterSpacing: 1.8 },
    heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", letterSpacing: -0.4, marginTop: 6, lineHeight: 30 },
    sheetDark: { backgroundColor: "#1C1917", borderColor: "rgba(68,64,60,0.6)" },
    sheetInner: { paddingHorizontal: 22, paddingTop: 26, paddingBottom: 40 },
    h1: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
    sub: { fontSize: 14.5, lineHeight: 21, marginTop: 6, marginBottom: 22 },
    seg: { flexDirection: "row", padding: 4, borderRadius: 14, backgroundColor: "#EEF2F6", marginBottom: 22, position: "relative" },
    segDark: { backgroundColor: "#292524" },
    segThumb: { position: "absolute", top: 4, bottom: 4, left: 4, borderRadius: 11, backgroundColor: "#fff",
        shadowColor: "#0F172A", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    segThumbDark: { backgroundColor: "#44403C" },
    segBtn: { flex: 1, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 11 },
    segTxt: { fontSize: 14.5, fontWeight: "700", color: "#64748B" },
    link: { color: "#127880", fontWeight: "700", fontSize: 13.5 },
    linkBtn: { alignSelf: "center", paddingVertical: 14, paddingHorizontal: 12 },
    fix: { marginTop: 6, alignSelf: "flex-start" },
    fixTxt: { fontSize: 13 },
    fixLink: { color: "#127880", fontWeight: "700" },
    meter: { flexDirection: "row", gap: 6 },
    meterSeg: { flex: 1, height: 5, borderRadius: 3 },
    rules: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: 12, rowGap: 4, marginTop: 8 },
    rule: { flexDirection: "row", alignItems: "center", gap: 4 },
    ruleTxt: { fontSize: 12 },
    scoreTxt: { marginLeft: "auto", fontSize: 12, fontWeight: "700" },
    notice: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 16, marginTop: 4, marginBottom: 16, alignItems: "flex-start" },
    noticeOk: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0" },
    noticeErr: { backgroundColor: "#FFF1F2", borderWidth: 1, borderColor: "#FECDD3" },
    noticeTxt: { flex: 1, fontSize: 13.5, lineHeight: 19 },
    or: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 16 },
    orLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
    orTxt: { fontSize: 12 },
    steps: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    stepItem: { flexDirection: "row", alignItems: "center", gap: 8 },
    stepDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
    stepOn: { backgroundColor: "#0D2C4D" },
    stepDone: { backgroundColor: "#047857" },
    stepNo: { fontSize: 12, fontWeight: "800", color: "#64748B" },
    stepTxt: { fontSize: 13, fontWeight: "700", maxWidth: 130 },
    stepLine: { flex: 1, height: 2, borderRadius: 1, backgroundColor: "#E2E8F0", marginHorizontal: 8 },
    legend: { fontSize: 13.5, fontWeight: "700", marginBottom: 10 },
    option: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#fff" },
    optionDark: { backgroundColor: "#1C1917", borderColor: "#44403C" },
    optionOn: { borderColor: "#127880", backgroundColor: "#F0FDFA" },
    optIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" },
    optIconOn: { backgroundColor: "#0D2C4D" },
    optTitle: { fontSize: 15, fontWeight: "700" },
    optSub: { fontSize: 12.5, marginTop: 2 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center" },
    radioOn: { borderColor: "#127880", backgroundColor: "#127880" },
    row: { flexDirection: "row", gap: 10, alignItems: "stretch" },
    backBtn: { width: 56, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
    backBtnDark: { backgroundColor: "#1C1917", borderColor: "#44403C" },
    consent: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginBottom: 18, marginTop: 2 },
    box: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: "#CBD5E1", alignItems: "center", justifyContent: "center", marginTop: 1 },
    boxOn: { backgroundColor: "#0D2C4D", borderColor: "#0D2C4D" },
    consentErr: { borderWidth: 1, borderColor: "#FDA4AF", backgroundColor: "rgba(225,29,72,0.06)", borderRadius: 14, padding: 10, marginHorizontal: -4 },
    consentErrTxt: { color: "#E11D48", fontSize: 12.5, fontWeight: "600", marginTop: -10, marginBottom: 14 },
    consentTxt: { flex: 1, fontSize: 12.5, lineHeight: 18 },
    foot: { fontSize: 12, textAlign: "center", marginTop: 18 },
});

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