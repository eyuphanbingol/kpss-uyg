import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import * as NativeSplash from "expo-splash-screen";
import { Platform, View, StyleSheet, LogBox } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { AppProvider } from "./src/AppProvider";
import Root from "./src/Root";

// ============================================================
// SPLASH SCREEN
// ============================================================

NativeSplash.preventAutoHideAsync().catch(function () {});

// ============================================================
// IGNORE WARNINGS (Opsiyonel)
// ============================================================

// Gereksiz uyarıları gizle
LogBox.ignoreLogs([
    "ViewPropTypes will be removed",
    "ColorPropType will be removed",
    "NativeBase:",
    "AsyncStorage has been extracted",
]);

// ============================================================
// ANA UYGULAMA
// ============================================================

export default function App() {
    // ---------- Android Navigation Bar ----------
    useEffect(function () {
        if (Platform.OS === "android") {
            // Navigation bar rengi
            NavigationBar.setBackgroundColorAsync("#0f172a")
                .catch(function () {});
            NavigationBar.setButtonStyleAsync("light")
                .catch(function () {});
            
            // System UI rengi
            SystemUI.setBackgroundColorAsync("#0f172a")
                .catch(function () {});
        }
    }, []);

    // ---------- Splash Screen ----------
    useEffect(function () {
        // Uygulama hazır olduğunda splash'i gizle
        var timer = setTimeout(function () {
            NativeSplash.hideAsync()
                .catch(function () {
                    // Splash zaten gizlenmiş olabilir
                });
        }, 500);

        return function () {
            clearTimeout(timer);
        };
    }, []);

    // ---------- Debug Mode ----------
    useEffect(function () {
        if (__DEV__) {
            console.log("📱 KPSS Uygulaması başlatıldı");
            console.log("📦 Platform:", Platform.OS);
            console.log("📦 Versiyon:", Platform.Version);
            console.log("📦 Screen:", initialWindowMetrics);
        }
    }, []);

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <AppProvider>
                {/* Ana Uygulama */}
                <View style={styles.container}>
                    <Root />
                </View>
                
                {/* Status Bar - Global */}
                <StatusBar 
                    style="light" 
                    backgroundColor="#0f172a"
                    translucent={true}
                />
            </AppProvider>
        </SafeAreaProvider>
    );
}

// ============================================================
// STILLER
// ============================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        // Android için ekstra
        ...(Platform.OS === "android" && {
            paddingTop: 0,
        }),
    },
});

// ============================================================
// GLOBAL HATA YAKALAMA
// ============================================================

// Prodüksiyonda hataları logla
if (!__DEV__) {
    var originalError = console.error;
    console.error = function (error) {
        // Hata tracking servisine gönderilebilir
        // Örn: Sentry, Firebase Crashlytics
        originalError(error);
    };
}