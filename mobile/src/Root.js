import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "./AppProvider";
import AuthScreen from "./screens/AuthScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import BugunScreen from "./screens/BugunScreen";
import ProgramScreen from "./screens/ProgramScreen";
import { DersHomeScreen, KonuHubScreen, KonuListScreen } from "./screens/DerslerScreens";
import { AlistirmalarHomeScreen, AlistirmaDersListScreen, AlistirmaKonuListScreen, ClozePlayScreen, MapTopicsScreen, MapPlayScreen } from "./screens/AlistirmalarScreens";
import { ConquerPlayScreen, TabuPlayScreen, PanicPlayScreen } from "./screens/DrillGameScreens";
import EksiklerScreen from "./screens/EksiklerScreen";
import BenScreen from "./screens/BenScreen";
import NotesScreen from "./screens/NotesScreen";
import TestScreen from "./screens/TestScreen";
import { AiScreen, HeatScreen, LeaderboardScreen, LiveScreen, PaywallScreen, PlacementScreen } from "./screens/ExtraScreens";
import SplashScreen from "./screens/SplashScreen";
import { StatusBar } from "expo-status-bar";
import { colors } from "./lib/theme";
import { GhostButton, Screen, Card, hapticTap } from "./ui";

// ============================================================
// NAVIGATORLAR
// ============================================================

var Stack = createNativeStackNavigator();
var Tab = createBottomTabNavigator();

// ============================================================
// TAB ICON
// ============================================================

function TabIcon({ focused, icon }) {
    return (
        <View style={styles.tabIcon}>
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.72 }}>{icon}</Text>
        </View>
    );
}

function TabBarButton(props) {
    var focused = !!(props.accessibilityState && props.accessibilityState.selected);
    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={props.accessibilityState}
            accessibilityLabel={props.accessibilityLabel}
            testID={props.testID}
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            delayPressIn={0}
            delayPressOut={0}
            activeOpacity={0.75}
            style={[
                props.style,
                styles.tabBtn,
                focused && styles.tabBtnOn,
            ]}
        >
            {props.children}
        </TouchableOpacity>
    );
}

// ============================================================
// TABS
// ============================================================

function Tabs() {
    var { isDark } = useApp();
    var insets = useSafeAreaInsets();

    var tabOptions = {
        headerShown: false,
        tabBarActiveTintColor: colors.indigo,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.92)" : "rgba(255,255,255,0.88)",
            borderTopWidth: 1,
            borderTopColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.35)",
            height: 58 + Math.max(insets.bottom, 8),
            paddingBottom: Math.max(insets.bottom, 8),
            paddingTop: 4,
            paddingHorizontal: 2,
            elevation: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 16,
        },
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginBottom: 2,
        },
        tabBarIconStyle: {
            marginTop: 0,
        },
        tabBarItemStyle: {
            paddingVertical: 0,
        },
        tabBarButton: function (p) {
            return <TabBarButton {...p} />;
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
        { name: "BenTab", component: BenScreen, icon: "👤", label: "Ben" },
    ];

    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Tab.Navigator screenOptions={tabOptions}>
                {screens.map(function (screen) {
                    return (
                        <Tab.Screen
                            key={screen.name}
                            name={screen.name}
                            component={screen.component}
                            listeners={{
                                tabPress: function () { hapticTap(); }
                            }}
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
                                tabBarLabel: screen.label,
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
        animationDuration: 140,
        presentation: "card",
        gestureEnabled: true,
        fullScreenGestureEnabled: false,
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

                {/* İç sayfalar */}
                <Stack.Screen name="Program" component={ProgramScreen} />
                <Stack.Screen name="KonuList" component={KonuListScreen} />
                <Stack.Screen name="KonuHub" component={KonuHubScreen} />
                <Stack.Screen name="AlistirmaDersList" component={AlistirmaDersListScreen} />
                <Stack.Screen name="AlistirmaKonuList" component={AlistirmaKonuListScreen} />
                <Stack.Screen name="ClozePlay" component={ClozePlayScreen} />
                <Stack.Screen name="MapTopics" component={MapTopicsScreen} />
                <Stack.Screen name="MapPlay" component={MapPlayScreen} />
                <Stack.Screen name="ConquerPlay" component={ConquerPlayScreen} />
                <Stack.Screen name="TabuPlay" component={TabuPlayScreen} />
                <Stack.Screen name="PanicPlay" component={PanicPlayScreen} />
                <Stack.Screen name="Notes" component={NotesScreen} />
                <Stack.Screen name="Test" component={TestScreen} />

                {/* Extra Ekranlar */}
                <Stack.Screen name="Placement" component={PlacementScreen} />
                <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
                <Stack.Screen name="Heat" component={HeatScreen} />
                <Stack.Screen name="Ai" component={AiScreen} />
                <Stack.Screen name="Live" component={LiveScreen} />
                <Stack.Screen name="Paywall" component={PaywallScreen} />
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
        paddingVertical: 2,
    },
    tabBtn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        marginHorizontal: 2,
        marginVertical: 4,
        overflow: "hidden",
    },
    tabBtnOn: {
        backgroundColor: "rgba(79, 70, 229, 0.12)",
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