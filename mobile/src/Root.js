import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useApp } from "./AppProvider";
import AuthScreen from "./screens/AuthScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import BugunScreen from "./screens/BugunScreen";
import ProgramScreen from "./screens/ProgramScreen";
import { DersHomeScreen, KonuHubScreen, KonuListScreen } from "./screens/DerslerScreens";
import EksiklerScreen from "./screens/EksiklerScreen";
import DenemeScreen from "./screens/DenemeScreen";
import BenScreen from "./screens/BenScreen";
import NotesScreen from "./screens/NotesScreen";
import TestScreen from "./screens/TestScreen";
import { AiScreen, HeatScreen, LeaderboardScreen, LiveScreen, PaywallScreen, PlacementScreen } from "./screens/ExtraScreens";
import SplashScreen from "./screens/SplashScreen";
import { colors } from "./lib/theme";
import { GhostButton, Screen } from "./ui";

var Stack = createNativeStackNavigator();
var Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.indigo, tabBarStyle: { backgroundColor: "#fff" } }}>
            <Tab.Screen name="BugunTab" component={BugunScreen} options={{ title: "Bugün" }} />
            <Tab.Screen name="DerslerTab" component={DersHomeScreen} options={{ title: "Dersler" }} />
            <Tab.Screen name="EksiklerTab" component={EksiklerScreen} options={{ title: "Eksikler" }} />
            <Tab.Screen name="DenemeTab" component={DenemeScreen} options={{ title: "Deneme" }} />
            <Tab.Screen name="BenTab" component={BenScreen} options={{ title: "Ben" }} />
        </Tab.Navigator>
    );
}

function Gate() {
    var app = useApp();
    if (!app.bootReady) {
        return <SplashScreen />;
    }
    if (!app.session) return <AuthScreen />;
    if (app.student.userProfile && app.student.userProfile.blocked) {
        return (
            <Screen>
                <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
                    <Text style={{ fontSize: 22, fontWeight: "800", textAlign: "center" }}>Hesap kısıtlı</Text>
                    <Text style={{ textAlign: "center", color: colors.muted, marginVertical: 12 }}>Bu hesap yönetici tarafından durduruldu.</Text>
                    <GhostButton title="Çıkış" onPress={app.signOut} />
                </View>
            </Screen>
        );
    }
    if (app.student.userProfile && app.student.userProfile.role === "admin") {
        return (
            <Screen>
                <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
                    <Text style={{ fontSize: 22, fontWeight: "800", textAlign: "center" }}>Yönetim web’de</Text>
                    <Text style={{ textAlign: "center", color: colors.muted, marginVertical: 12 }}>Admin paneli mobil uygulamada yok. https://kpss-uyg.vercel.app</Text>
                    <GhostButton title="Çıkış" onPress={app.signOut} />
                </View>
            </Screen>
        );
    }
    if (!app.profileHydrated) {
        return <SplashScreen />;
    }
    if (!app.student.profile || !app.student.profile.onboarded) return <OnboardingScreen />;
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Program" component={ProgramScreen} />
            <Stack.Screen name="KonuList" component={KonuListScreen} />
            <Stack.Screen name="KonuHub" component={KonuHubScreen} />
            <Stack.Screen name="Notes" component={NotesScreen} />
            <Stack.Screen name="Test" component={TestScreen} />
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

export default function Root() {
    return <Gate />;
}
