import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
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
// TAB BAR (web BottomNav ile aynı)
// ============================================================

var TAB_SCREENS = [
    {
        name: "BugunTab",
        component: BugunScreen,
        label: "Bugün",
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        streak: true,
    },
    {
        name: "DerslerTab",
        component: DersHomeScreen,
        label: "Dersler",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
        name: "AlistirmalarTab",
        component: AlistirmalarHomeScreen,
        label: "Alıştırmalar",
        icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
        name: "EksiklerTab",
        component: EksiklerScreen,
        label: "Eksikler",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
        name: "BenTab",
        component: BenScreen,
        label: "Ben",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
];

function TabGlyph(props) {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
                d={props.d}
                stroke={props.color}
                strokeWidth={props.focused ? 2.2 : 1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

function AppTabBar(props) {
    var { isDark, student } = useApp();
    var insets = useSafeAreaInsets();
    var streak = (student && student.streak && student.streak.count) || 0;
    var state = props.state;
    var navigation = props.navigation;

    return (
        <View
            style={[
                styles.tabBar,
                {
                    backgroundColor: isDark ? "rgba(33, 31, 29, 0.96)" : "rgba(255,255,255,0.94)",
                    borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(226, 232, 240, 0.9)",
                    paddingBottom: Math.max(insets.bottom, 8),
                },
            ]}
        >
            <View style={styles.tabRow}>
                {state.routes.map(function (route, index) {
                    var focused = state.index === index;
                    var meta = TAB_SCREENS[index];
                    var color = focused ? colors.indigo : (isDark ? "#A8A29E" : "#78716C");
                    return (
                        <Pressable
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={{ selected: focused }}
                            accessibilityLabel={meta.label}
                            onPress={function () {
                                hapticTap();
                                var event = navigation.emit({
                                    type: "tabPress",
                                    target: route.key,
                                    canPreventDefault: true,
                                });
                                if (!focused && !event.defaultPrevented) {
                                    navigation.navigate(route.name);
                                }
                            }}
                            style={[styles.tabItem, focused && (isDark ? styles.tabItemOnDark : styles.tabItemOn)]}
                        >
                            <View style={styles.tabIconWrap}>
                                <TabGlyph d={meta.icon} color={color} focused={focused} />
                                {meta.streak && streak > 0 ? <View style={styles.streakDot} /> : null}
                            </View>
                            <Text style={[styles.tabLabel, { color: color }]} numberOfLines={1}>
                                {meta.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

function Tabs() {
    var { isDark } = useApp();

    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Tab.Navigator
                tabBar={function (p) { return <AppTabBar {...p} />; }}
                screenOptions={{
                    headerShown: false,
                    lazy: true,
                    sceneContainerStyle: {
                        backgroundColor: isDark ? colors.bgDark : colors.bg,
                    },
                }}
            >
                {TAB_SCREENS.map(function (screen) {
                    return (
                        <Tab.Screen
                            key={screen.name}
                            name={screen.name}
                            component={screen.component}
                            options={{ title: screen.label }}
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
    tabBar: {
        borderTopWidth: 1,
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
    },
    tabRow: {
        flexDirection: "row",
        alignItems: "stretch",
        paddingHorizontal: 2,
        paddingTop: 4,
        minHeight: 56,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderRadius: 16,
    },
    tabItemOn: {
        backgroundColor: "rgba(238, 242, 255, 0.85)",
    },
    tabItemOnDark: {
        backgroundColor: "rgba(49, 46, 129, 0.28)",
    },
    tabIconWrap: {
        width: 22,
        height: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    tabLabel: {
        marginTop: 2,
        fontSize: 10,
        lineHeight: 13,
        fontWeight: "600",
        textAlign: "center",
    },
    streakDot: {
        position: "absolute",
        top: -1,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#F59E0B",
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