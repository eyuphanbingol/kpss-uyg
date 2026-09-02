import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NativeSplash from "expo-splash-screen";
import { AppProvider } from "./src/AppProvider";
import Root from "./src/Root";

NativeSplash.preventAutoHideAsync().catch(function () {});

export default function App() {
    return (
        <SafeAreaProvider>
            <AppProvider>
                <Root />
                <StatusBar style="light" />
            </AppProvider>
        </SafeAreaProvider>
    );
}
