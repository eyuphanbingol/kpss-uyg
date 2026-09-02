import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/AppProvider";
import Root from "./src/Root";

export default function App() {
    return (
        <SafeAreaProvider>
            <AppProvider>
                <Root />
                <StatusBar style="dark" />
            </AppProvider>
        </SafeAreaProvider>
    );
}
