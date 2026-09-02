import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import * as NativeSplash from "expo-splash-screen";

var LOGO = require("../../assets/atanom-mark.png");

NativeSplash.preventAutoHideAsync().catch(function () {});

export function BrandBackdrop(props) {
    return (
        <LinearGradient colors={["#041C24", "#0A3842", "#127880"]} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={styles.fill}>
            <View style={styles.goldGlow} pointerEvents="none" />
            <View style={styles.ringOuter} pointerEvents="none" />
            <View style={styles.ringInner} pointerEvents="none" />
            {props.children}
        </LinearGradient>
    );
}

export default function SplashScreen() {
    useEffect(function () {
        NativeSplash.hideAsync().catch(function () {});
    }, []);
    return (
        <BrandBackdrop>
            <StatusBar style="light" />
            <View style={styles.center}>
                <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Atanom</Text>
                <Text style={styles.tag}>Hedefine doğru ilk adım</Text>
                <ActivityIndicator color="#C5A059" style={{ marginTop: 28 }} />
            </View>
        </BrandBackdrop>
    );
}

var styles = StyleSheet.create({
    fill: { flex: 1 },
    goldGlow: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "rgba(197,160,89,0.12)",
        top: "28%",
        left: "50%",
        marginLeft: -140
    },
    ringOuter: {
        position: "absolute",
        width: 340,
        height: 340,
        borderRadius: 170,
        borderWidth: 1,
        borderColor: "rgba(197,160,89,0.28)",
        top: "24%",
        left: "50%",
        marginLeft: -170
    },
    ringInner: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 1,
        borderColor: "rgba(29,138,153,0.45)",
        top: "32%",
        left: "50%",
        marginLeft: -110
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40
    },
    logo: { width: 168, height: 136 },
    title: {
        marginTop: 18,
        fontSize: 36,
        fontWeight: "800",
        color: "#F5EBC7",
        letterSpacing: 0.6
    },
    tag: {
        marginTop: 8,
        fontSize: 15,
        color: "rgba(255,255,255,0.78)"
    }
});
