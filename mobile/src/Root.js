import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useApp } from "./AppProvider";
import OnboardingScreen from "./screens/OnboardingScreen";
import SplashScreen from "./screens/SplashScreen";
import AuthScreen from "./screens/AuthScreen";
import MainStack from "./MainStack";
import { colors } from "./lib/theme";
import { GhostButton, Screen } from "./ui";

function Gate() {
    var app = useApp();
    var isDark = app.isDark;

    if (!app.bootReady) return <SplashScreen />;
    if (!app.session) return <AuthScreen />;

    if (app.student.userProfile && app.student.userProfile.blocked) {
        return (
            <Screen dark={isDark}>
                <View style={[styles.center, { padding: 24 }]}>
                    <Text style={{ fontSize: 48 }}>🚫</Text>
                    <Text style={[styles.title, isDark && { color: "#fff" }]}>Hesap Kısıtlı</Text>
                    <Text style={[styles.desc, isDark && { color: colors.muted }]}>Bu hesap yönetici tarafından durduruldu.</Text>
                    <GhostButton title="Çıkış Yap" onPress={app.signOut} style={{ marginTop: 16 }} />
                </View>
            </Screen>
        );
    }

    if (app.student.userProfile && app.student.userProfile.role === "admin") {
        return (
            <Screen dark={isDark}>
                <View style={[styles.center, { padding: 24 }]}>
                    <Text style={{ fontSize: 48 }}>🛠️</Text>
                    <Text style={[styles.title, isDark && { color: "#fff" }]}>Yönetim Web'de</Text>
                    <Text style={[styles.desc, isDark && { color: colors.muted }]}>Admin paneli mobil uygulamada yok.</Text>
                    <Text style={[styles.url, isDark && { color: colors.indigo }]}>https://kpss-uyg.vercel.app</Text>
                    <GhostButton title="Çıkış Yap" onPress={app.signOut} style={{ marginTop: 16 }} />
                </View>
            </Screen>
        );
    }

    if (!app.profileHydrated) return <SplashScreen />;
    if (!app.student.profile || !app.student.profile.onboarded) return <OnboardingScreen />;

    return <MainStack />;
}

export default function Root() {
    return <Gate />;
}

var styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center", marginTop: 12 },
    desc: { fontSize: 14, color: colors.muted, textAlign: "center", marginVertical: 12, maxWidth: 300 },
    url: { fontSize: 14, color: colors.indigo, textAlign: "center", fontWeight: "600" },
});
