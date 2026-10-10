import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import * as NativeSplash from "expo-splash-screen";

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

// Yükleme ekranı: logo animasyonu (assets/atanly-loader.mp4). Web'deki .atn-loader ile aynı görünüm.
// Video kenarları zemin rengine radyal bir örtüyle karışır; hareketi azalt açıksa sabit görsel gösterilir.
var VIDEO = require("../../assets/atanly-loader.mp4");
var POSTER = require("../../assets/atanly-loader.jpg");
var BG = "#070D12";

function LoaderBar() {
    var x = useRef(new Animated.Value(0)).current;
    useEffect(function () {
        var loop = Animated.loop(Animated.timing(x, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }));
        loop.start();
        return function () { loop.stop(); };
    }, [x]);
    return (
        <View style={styles.bar}>
            <Animated.View style={[styles.barFill, { transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-68, 168] }) }] }]} />
        </View>
    );
}

function LoaderVideo() {
    var player = useVideoPlayer(VIDEO, function (p) {
        p.loop = true;
        p.muted = true;
        p.audioMixingMode = "mixWithOthers"; // açık müziği durdurmasın
        p.play();
    });
    return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} />;
}

export default function SplashScreen() {
    var [still, setStill] = useState(false);
    var size = Math.min(300, Math.round(Dimensions.get("window").width * 0.72));
    useEffect(function () {
        NativeSplash.hideAsync().catch(function () {});
        AccessibilityInfo.isReduceMotionEnabled().then(function (on) { if (on) setStill(true); }).catch(function () {});
    }, []);
    return (
        <View style={[styles.fill, { backgroundColor: BG }]} accessibilityRole="progressbar" accessibilityLabel="İşleminiz devam ediyor, lütfen bekleyin">
            <StatusBar style="light" />
            <View style={styles.center}>
                <View style={{ width: size, height: size }}>
                    <Image source={POSTER} style={StyleSheet.absoluteFill} resizeMode="cover" />
                    {still ? null : <LoaderVideo />}
                    <Svg style={StyleSheet.absoluteFill} width={size} height={size} pointerEvents="none">
                        <Defs>
                            <RadialGradient id="fade" cx="50%" cy="50%" r="50%">
                                <Stop offset="0.79" stopColor={BG} stopOpacity="0" />
                                <Stop offset="0.99" stopColor={BG} stopOpacity="1" />
                            </RadialGradient>
                        </Defs>
                        <Rect x="0" y="0" width={size} height={size} fill="url(#fade)" />
                    </Svg>
                </View>
                <Text style={styles.title}>İşleminiz devam ediyor</Text>
                <Text style={styles.sub}>Lütfen bekleyin, yükleniyor…</Text>
                {still ? <View style={styles.bar}><View style={[styles.barFill, { left: 50 }]} /></View> : <LoaderBar />}
            </View>
        </View>
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
    title: { marginTop: 6, fontSize: 17, fontWeight: "700", color: "#F1F5F9", letterSpacing: -0.1 },
    sub: { marginTop: 4, fontSize: 13.5, fontWeight: "500", color: "rgba(203,213,225,0.72)" },
    bar: { width: 168, height: 3, marginTop: 18, borderRadius: 3, overflow: "hidden", backgroundColor: "rgba(148,163,184,0.16)" },
    barFill: { position: "absolute", top: 0, bottom: 0, width: 68, borderRadius: 3, backgroundColor: "#5EC4CC" }
});
