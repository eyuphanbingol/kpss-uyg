import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

var LOGO = require("../../assets/atanom.png");

export function BrandBackdrop(props) {
    return (
        <LinearGradient colors={["#041C24", "#0A3842", "#127880"]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.fill}>
            <View style={styles.goldGlow} pointerEvents="none" />
            <View style={styles.ringOuter} pointerEvents="none" />
            <View style={styles.ringInner} pointerEvents="none" />
            <Image source={LOGO} style={styles.watermark} resizeMode="contain" />
            {props.children}
        </LinearGradient>
    );
}

export default function SplashScreen() {
    return (
        <BrandBackdrop>
            <StatusBar style="light" />
            <View style={styles.center}>
                <View style={styles.logoWrap}>
                    <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                </View>
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
        backgroundColor: "rgba(197,160,89,0.14)",
        top: "28%",
        alignSelf: "center",
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
    watermark: {
        position: "absolute",
        width: 420,
        height: 420,
        opacity: 0.07,
        bottom: -40,
        right: -80
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40
    },
    logoWrap: {
        width: 148,
        height: 148,
        borderRadius: 36,
        backgroundColor: "rgba(255,255,255,0.94)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#C5A059",
        shadowOpacity: 0.35,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10
    },
    logo: { width: 118, height: 118 },
    title: {
        marginTop: 22,
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
