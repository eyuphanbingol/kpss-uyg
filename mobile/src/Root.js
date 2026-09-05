import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useApp } from "./AppProvider";
import AuthScreen from "./screens/AuthScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import BugunScreen from "./screens/BugunScreen";
import ProgramScreen from "./screens/ProgramScreen";
import { DersHomeScreen, KonuHubScreen, KonuListScreen } from "./screens/DerslerScreens";
import { AlistirmalarHomeScreen, AlistirmaDersListScreen, AlistirmaKonuListScreen, ClozePlayScreen, MapTopicsScreen, MapPlayScreen } from "./screens/AlistirmalarScreens";
import { ConquerPlayScreen, TabuPlayScreen, PanicPlayScreen } from "./screens/DrillGameScreens";
import EksiklerScreen from "./screens/EksiklerScreen";
import DenemeScreen from "./screens/DenemeScreen";
import BenScreen from "./screens/BenScreen";
import NotesScreen from "./screens/NotesScreen";
import TestScreen from "./screens/TestScreen";
import { AiScreen, HeatScreen, LeaderboardScreen, LiveScreen, PaywallScreen, PlacementScreen } from "./screens/ExtraScreens";
import SplashScreen from "./screens/SplashScreen";
import { StatusBar } from "expo-status-bar";
import { colors } from "./lib/theme";
import { GhostButton, Screen, Card } from "./ui";

// ============================================================
// NAVIGATORLAR
// ============================================================

var Stack = createNativeStackNavigator();
var Tab = createBottomTabNavigator();

// ============================================================
// TAB ICON
// ============================================================

function TabIcon({ focused, icon, label }) {
    var isActive = focused;
    var color = isActive ? colors.indigo : colors.muted;

    return (
        <View style={styles.tabIcon}>
            <Text style={{ fontSize: 22, color: color }}>{icon}</Text>
            {isActive && <View style={styles.tabActiveIndicator} />}
        </View>
    );
}

// ============================================================
// TABS
// ============================================================

function Tabs() {
    var { isDark } = useApp();

    var tabOptions = {
        headerShown: false,
        tabBarActiveTintColor: colors.indigo,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
            backgroundColor: isDark ? colors.bgDark : "#fff",
            borderTopWidth: 1,
            borderTopColor: isDark ? colors.muted : colors.border,
            height: 64,
            paddingBottom: 8,
            paddingTop: 4,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
        },
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
        },
        tabBarIconStyle: {
            marginTop: 0,
        },
        tabBarItemStyle: {
            paddingVertical: 4,
            borderRadius: 12,
        },
        lazy: true,
        sceneContainerStyle: {
            backgroundColor: isDark ? colors.bgDark : colors.bg,
        },
    };

    var screens = [
        { name: "BugunTab", component: BugunScreen, icon: "🏠", label: "Bugün" },
        { name: "DerslerTab", component: DersHomeScreen, icon: "📚", label: "Dersler" },
        { name: "AlistirmalarTab", component: AlistirmalarHomeScreen, icon: "✏️", label: "Alıştırmalar" },
        { name: "EksiklerTab", component: EksiklerScreen, icon: "📋", label: "Eksikler" },
        { name: "DenemeTab", component: DenemeScreen, icon: "📝", label: "Deneme" },
        { name: "BenTab", component: BenScreen, icon: "👤", label: "Ben" },
    ];

    return (
        <>
            <StatusBar style="dark" />
            <Tab.Navigator screenOptions={tabOptions}>
                {screens.map(function (screen) {
                    return (
                        <Tab.Screen
                            key={screen.name}
                            name={screen.name}
                            component={screen.component}
                            options={{
                                title: screen.label,
                                tabBarIcon: function ({ focused }) {
                                    return (
                                        <TabIcon
                                            focused={focused}
                                            icon={screen.icon}
                                            label={screen.label}
                                        />
                                    );
                                },
                                tabBarLabel: function () { return null; },
                            }}
                        />
                    );
                })}
            </Tab.Navigator>
        </>
    );
}

// ============================================================
// GATE
// ============================================================

function Gate() {
    var app = useApp();
    var { isDark } = useApp();

    // ---------- Splash Screen ----------
    if (!app.bootReady) {
        return <SplashScreen />;
    }

    // ---------- Auth ----------
    if (!app.session) {
        return <AuthScreen />;
    }

    // ---------- Blocked ----------
    if (app.student.userProfile && app.student.userProfile.blocked) {
        return (
            <Screen dark={isDark}>
                <View style={[styles.center, { padding: 24 }]}>
                    <View style={styles.blockedIcon}>
                        <Text style={{ fontSize: 48 }}>🚫</Text>
                    </View>
                    <Text style={[styles.blockedTitle, isDark && { color: "#fff" }]}>
                        Hesap Kısıtlı
                    </Text>
                    <Text style={[styles.blockedDesc, isDark && { color: colors.muted }]}>
                        Bu hesap yönetici tarafından durduruldu.
                    </Text>
                    <GhostButton title="Çıkış Yap" onPress={app.signOut} style={{ marginTop: 16 }} />
                </View>
            </Screen>
        );
    }

    // ---------- Admin ----------
    if (app.student.userProfile && app.student.userProfile.role === "admin") {
        return (
            <Screen dark={isDark}>
                <View style={[styles.center, { padding: 24 }]}>
                    <View style={styles.adminIcon}>
                        <Text style={{ fontSize: 48 }}>🛠️</Text>
                    </View>
                    <Text style={[styles.adminTitle, isDark && { color: "#fff" }]}>
                        Yönetim Web'de
                    </Text>
                    <Text style={[styles.adminDesc, isDark && { color: colors.muted }]}>
                        Admin paneli mobil uygulamada yok.
                    </Text>
                    <Text style={[styles.adminUrl, isDark && { color: colors.indigo }]}>
                        https://kpss-uyg.vercel.app
                    </Text>
                    <GhostButton title="Çıkış Yap" onPress={app.signOut} style={{ marginTop: 16 }} />
                </View>
            </Screen>
        );
    }

    // ---------- Profile Hydrated ----------
    if (!app.profileHydrated) {
        return <SplashScreen />;
    }

    // ---------- Onboarding ----------
    if (!app.student.profile || !app.student.profile.onboarded) {
        return <OnboardingScreen />;
    }

    // ============================================================
    // MAIN APP
    // ============================================================

    var stackOptions = {
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
            backgroundColor: isDark ? colors.bgDark : colors.bg,
        },
    };

    var modalOptions = {
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_bottom",
        contentStyle: {
            backgroundColor: isDark ? colors.bgDark : colors.bg,
        },
    };

    var baseTheme = isDark ? DarkTheme : DefaultTheme;
    return (
        <NavigationContainer
            theme={{
                ...baseTheme,
                dark: isDark,
                colors: {
                    ...baseTheme.colors,
                    background: isDark ? colors.bgDark : colors.bg,
                    card: isDark ? colors.bgDark : "#fff",
                    text: isDark ? "#fff" : colors.text,
                    border: isDark ? colors.muted : colors.border,
                    primary: colors.indigo
                }
            }}
        >
            <Stack.Navigator screenOptions={stackOptions}>
                {/* Ana Tablar */}
                <Stack.Screen name="Tabs" component={Tabs} />

                {/* Modal Ekranlar */}
                <Stack.Screen name="Program" component={ProgramScreen} options={modalOptions} />
                <Stack.Screen name="KonuList" component={KonuListScreen} options={modalOptions} />
                <Stack.Screen name="KonuHub" component={KonuHubScreen} options={modalOptions} />
                <Stack.Screen name="AlistirmaDersList" component={AlistirmaDersListScreen} options={modalOptions} />
                <Stack.Screen name="AlistirmaKonuList" component={AlistirmaKonuListScreen} options={modalOptions} />
                <Stack.Screen name="ClozePlay" component={ClozePlayScreen} options={modalOptions} />
                <Stack.Screen name="MapTopics" component={MapTopicsScreen} options={modalOptions} />
                <Stack.Screen name="MapPlay" component={MapPlayScreen} options={modalOptions} />
                <Stack.Screen name="ConquerPlay" component={ConquerPlayScreen} options={modalOptions} />
                <Stack.Screen name="TabuPlay" component={TabuPlayScreen} options={modalOptions} />
                <Stack.Screen name="PanicPlay" component={PanicPlayScreen} options={modalOptions} />
                <Stack.Screen name="Notes" component={NotesScreen} options={modalOptions} />
                <Stack.Screen name="Test" component={TestScreen} options={modalOptions} />

                {/* Extra Ekranlar */}
                <Stack.Screen name="Placement" component={PlacementScreen} options={modalOptions} />
                <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={modalOptions} />
                <Stack.Screen name="Heat" component={HeatScreen} options={modalOptions} />
                <Stack.Screen name="Ai" component={AiScreen} options={modalOptions} />
                <Stack.Screen name="Live" component={LiveScreen} options={modalOptions} />
                <Stack.Screen name="Paywall" component={PaywallScreen} options={modalOptions} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// ============================================================
// ROOT
// ============================================================

export default function Root() {
    return <Gate />;
}

// ============================================================
// STILLER
// ============================================================

var styles = StyleSheet.create({
    // ---------- Tab Icon ----------
    tabIcon: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
    },
    tabActiveIndicator: {
        position: "absolute",
        bottom: -4,
        width: 16,
        height: 3,
        borderRadius: 2,
        backgroundColor: colors.indigo,
    },

    // ---------- Center ----------
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // ---------- Blocked ----------
    blockedIcon: {
        marginBottom: 16,
    },
    blockedTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: colors.text,
        textAlign: "center",
    },
    blockedDesc: {
        fontSize: 14,
        color: colors.muted,
        textAlign: "center",
        marginVertical: 12,
        maxWidth: 300,
    },

    // ---------- Admin ----------
    adminIcon: {
        marginBottom: 16,
    },
    adminTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: colors.text,
        textAlign: "center",
    },
    adminDesc: {
        fontSize: 14,
        color: colors.muted,
        textAlign: "center",
        marginVertical: 8,
        maxWidth: 300,
    },
    adminUrl: {
        fontSize: 14,
        color: colors.indigo,
        textAlign: "center",
        fontWeight: "600",
    },
});