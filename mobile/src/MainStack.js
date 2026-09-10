import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "./AppProvider";
import BugunScreen from "./screens/BugunScreen";
import ProgramScreen from "./screens/ProgramScreen";
import { DersHomeScreen, KonuHubScreen, KonuListScreen } from "./screens/DerslerScreens";
import { AlistirmalarHomeScreen, AlistirmaDersListScreen, AlistirmaKonuListScreen, ClozePlayScreen, MapTopicsScreen, MapPlayScreen } from "./screens/AlistirmalarScreens";
import { ConquerPlayScreen, TabuPlayScreen, PanicPlayScreen } from "./screens/DrillGameScreens";
import EksiklerScreen from "./screens/EksiklerScreen";
import BenScreen from "./screens/BenScreen";
import NotesScreen from "./screens/NotesScreen";
import TestScreen from "./screens/TestScreen";
import ReviewNotebookScreen from "./screens/ReviewNotebookScreen";
import { AiScreen, HeatScreen, LeaderboardScreen, LiveScreen, PaywallScreen, PlacementScreen } from "./screens/ExtraScreens";
import { StatusBar } from "expo-status-bar";
import { colors } from "./lib/theme";
import { hapticTap } from "./ui";

var Stack = createNativeStackNavigator();
var Tab = createBottomTabNavigator();

var TAB_SCREENS = [
    { name: "BugunTab", component: BugunScreen, label: "Bugün", emoji: "⌂", streak: true },
    { name: "DerslerTab", component: DersHomeScreen, label: "Dersler", emoji: "☰" },
    { name: "AlistirmalarTab", component: AlistirmalarHomeScreen, label: "Alıştırmalar", emoji: "⚡", featured: true },
    { name: "EksiklerTab", component: EksiklerScreen, label: "Eksikler", emoji: "▦" },
    { name: "BenTab", component: BenScreen, label: "Ben", emoji: "●" },
];

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
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                    borderTopColor: isDark ? "#334155" : "#E2E8F0",
                    paddingBottom: Math.max(insets.bottom, 8),
                },
            ]}
        >
            <View style={styles.tabRow}>
                {state.routes.map(function (route, index) {
                    var focused = state.index === index;
                    var meta = TAB_SCREENS[index];
                    var color = focused ? "#D97706" : (isDark ? "#94A3B8" : "#64748B");
                    return (
                        <Pressable
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={{ selected: focused }}
                            accessibilityLabel={meta.label}
                            android_ripple={{ color: "rgba(0,0,0,0.05)" }}
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
                            style={[styles.tabItem, meta.featured && styles.tabFeatured]}
                        >
                            <View style={[styles.tabIconWrap, meta.featured && styles.tabFeaturedIcon, focused && meta.featured && styles.tabFeaturedIconOn]}>
                                <Text style={{ fontSize: meta.featured ? 18 : 16, color: meta.featured && focused ? "#fff" : color }}>
                                    {meta.emoji}
                                </Text>
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

export default function MainStack() {
    var { isDark } = useApp();
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
                <Stack.Screen name="Tabs" component={Tabs} />
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
                <Stack.Screen name="ReviewNotebook" component={ReviewNotebookScreen} />
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

var styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: 1,
        elevation: 2,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
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
    tabFeatured: { marginTop: -6 },
    tabFeaturedIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FEF3C7",
        alignItems: "center",
        justifyContent: "center",
    },
    tabFeaturedIconOn: { backgroundColor: "#D97706" },
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
});
