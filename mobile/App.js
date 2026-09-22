import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { Platform, View, StyleSheet, LogBox, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "./src/AppProvider";
import Root from "./src/Root";

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

class CrashGate extends React.Component {
    constructor(props) {
        super(props);
        this.state = { err: null };
    }
    static getDerivedStateFromError(err) {
        return { err: err };
    }
    componentDidCatch(err) {
        console.warn("App crash", err);
    }
    render() {
        if (!this.state.err) return this.props.children;
        return (
            <View style={{ flex: 1, justifyContent: "center", padding: 28, backgroundColor: "#041C24" }}>
                <Text style={{ color: "#F5EBC7", fontSize: 20, fontWeight: "800" }}>Açılış hatası</Text>
                <Text style={{ color: "rgba(255,255,255,0.75)", marginTop: 10, lineHeight: 20 }}>
                    {String((this.state.err && this.state.err.message) || this.state.err)}
                </Text>
            </View>
        );
    }
}

export default function App() {
    // Native chrome (nav bar / orientation) after first paint — crashes on some Androids if run immediately.

    // ---------- Splash Screen ----------
    // Native splash, Boot/SplashScreen tarafında gizlenir; burada erken hide yok.

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
        <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <CrashGate>
            <AppProvider>
                <View style={styles.container}>
                    <Root />
                </View>
                <StatusBar 
                    style="light" 
                    backgroundColor="#041C24"
                    translucent={true}
                />
            </AppProvider>
            </CrashGate>
        </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

// ============================================================
// STILLER
// ============================================================

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#041C24",
    },
    container: {
        flex: 1,
        backgroundColor: "#041C24",
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
var EU = typeof global !== "undefined" ? global.ErrorUtils : null;
if (EU && EU.setGlobalHandler) {
    EU.setGlobalHandler(function (error) {
        global.__ATANLY_ERR = String((error && (error.stack || error.message)) || error);
    });
}