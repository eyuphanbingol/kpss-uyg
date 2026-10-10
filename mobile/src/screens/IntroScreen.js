import React, { useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, BookOpen, CalendarCheck, Gamepad2, NotebookPen, Trophy } from "lucide-react-native";
import { BrandBackdrop } from "./SplashScreen";
import { Tap } from "../ui";

// Uygulama ilk kez açılınca giriş ekranından önce bir kez gösterilen tanıtım sayfaları.
export var INTRO_KEY = "kpss-intro-seen";

var PAGES = [
    {
        icon: BookOpen,
        kicker: "Atanly'ye hoş geldin",
        title: "KPSS'ye planlı, akıllı ve keyifli hazırlan.",
        text: "GY-GK'nın tamamı tek uygulamada: konu notları, ÖSYM tarzı sorular, aralıklı tekrar, oyunlar ve canlı denemeler.",
        stats: [["5.800+", "ÖSYM tarzı soru"], ["1.200+", "konu notu"], ["390+", "harita hedefi"], ["7", "ders · GY-GK"]]
    },
    {
        icon: CalendarCheck,
        kicker: "Akıllı program",
        title: "Bugün ne çalışacağını uygulama söyler.",
        text: "Sınav tarihine, boş saatlerine ve zayıf derslerine göre konu konu takvim. Bir gün kaçırırsan program kendini yeniden dağıtır.",
        img: require("../../assets/intro/program.webp"), ratio: 1160 / 870
    },
    {
        icon: NotebookPen,
        kicker: "Eksikler ve yanlış defteri",
        title: "Eksiklerini tek tek kapat.",
        text: "Yanlışın deftere düşer, tekrar zamanı gelen konu önüne gelir. Hangi konuda kaldığını hep bilirsin.",
        img: require("../../assets/intro/eksikler.webp"), ratio: 1400 / 1050
    },
    {
        icon: Gamepad2,
        kicker: "Oyunlarla pekiştir",
        title: "Ezberi oyunla kalıcı yap.",
        text: "Türkiye'yi Fethet, KPSS haritaları, Tabu ve Son 30 saniye. Dağlar, madenler, YHT ve boru hatları haritada.",
        img: require("../../assets/intro/harita.webp"), ratio: 1400 / 1158
    },
    {
        icon: Trophy,
        kicker: "Her Pazar canlı deneme",
        title: "Türkiye geneli sıralamada yerini gör.",
        text: "Herkes aynı anda çözer; sıralama, net dağılımı ve konu analizi Pazar akşamı hazır. Serini ve çalışma saatini de takip et.",
        img: require("../../assets/intro/istatistik.webp"), ratio: 800 / 616
    }
];

function Stats(props) {
    return (
        <View style={s.stats}>
            {props.items.map(function (st) {
                return (
                    <View key={st[1]} style={s.stat}>
                        <Text style={s.statN}>{st[0]}</Text>
                        <Text style={s.statT}>{st[1]}</Text>
                    </View>
                );
            })}
        </View>
    );
}

function Page(props) {
    var p = props.page;
    var Icon = p.icon;
    var shotW = Math.min(props.width - 48, 420);
    var shotH = Math.min(shotW / p.ratio || 0, props.maxShot);
    return (
        <View style={[s.page, { width: props.width }]}>
            <View style={s.visual}>
                {p.img ? (
                    <View style={[s.shot, { width: shotW, height: shotH }]}>
                        <Image source={p.img} style={s.shotImg} resizeMode="contain" accessibilityIgnoresInvertColors />
                    </View>
                ) : (
                    <View style={s.hello}>
                        <Image source={require("../../assets/atanom.png")} style={s.logo} accessibilityIgnoresInvertColors />
                        <Stats items={p.stats} />
                    </View>
                )}
            </View>
            <View style={s.copy}>
                <View style={s.kickerRow}>
                    <View style={s.kickerIco}><Icon size={14} color="#E8C987" strokeWidth={2.4} /></View>
                    <Text style={s.kicker}>{p.kicker.toLocaleUpperCase("tr-TR")}</Text>
                </View>
                <Text style={s.title} accessibilityRole="header">{p.title}</Text>
                <Text style={s.text}>{p.text}</Text>
            </View>
        </View>
    );
}

export default function IntroScreen(props) {
    var dim = useWindowDimensions();
    var width = dim.width;
    var ref = useRef(null);
    var x = useRef(new Animated.Value(0)).current;
    var _i = useState(0);
    var index = _i[0];
    var setIndex = _i[1];
    var last = index === PAGES.length - 1;
    var maxShot = Math.max(150, dim.height * 0.36);

    function go(i) {
        if (ref.current) ref.current.scrollTo({ x: i * width, animated: true });
        setIndex(i);
    }

    return (
        <BrandBackdrop>
            <StatusBar style="light" />
            <SafeAreaView style={s.fill} edges={["top", "bottom"]}>
                <View style={s.top}>
                    <Text style={s.brand}>Atanly</Text>
                    {last ? <View style={s.skipPh} /> : (
                        <Tap onPress={props.onDone} hitSlop={12} style={s.skip} accessibilityLabel="Tanıtımı atla">
                            <Text style={s.skipTxt}>Atla</Text>
                        </Tap>
                    )}
                </View>
                <Animated.ScrollView
                    ref={ref}
                    horizontal
                    pagingEnabled
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: x } } }], { useNativeDriver: true })}
                    onMomentumScrollEnd={function (e) { setIndex(Math.round(e.nativeEvent.contentOffset.x / width)); }}
                    style={s.fill}
                >
                    {PAGES.map(function (p, i) {
                        return <Page key={i} page={p} width={width} maxShot={maxShot} />;
                    })}
                </Animated.ScrollView>
                <View style={s.bottom}>
                    <View style={s.dots} accessibilityLabel={"Sayfa " + (index + 1) + " / " + PAGES.length}>
                        {PAGES.map(function (p, i) {
                            var range = [(i - 1) * width, i * width, (i + 1) * width];
                            return (
                                <Animated.View key={i} style={[s.dot, {
                                    opacity: x.interpolate({ inputRange: range, outputRange: [0.35, 1, 0.35], extrapolate: "clamp" }),
                                    transform: [{ scaleX: x.interpolate({ inputRange: range, outputRange: [1, 3, 1], extrapolate: "clamp" }) }]
                                }]} />
                            );
                        })}
                    </View>
                    <Tap onPress={last ? props.onDone : function () { go(index + 1); }} style={s.cta} accessibilityLabel={last ? "Hemen başla" : "Sonraki sayfa"}>
                        <LinearGradient colors={["#E8C987", "#C5A059"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.ctaIn}>
                            <Text style={s.ctaTxt}>{last ? "Hemen başla" : "İleri"}</Text>
                            <ArrowRight size={18} color="#1F1A0E" strokeWidth={2.6} />
                        </LinearGradient>
                    </Tap>
                </View>
            </SafeAreaView>
        </BrandBackdrop>
    );
}

var s = StyleSheet.create({
    fill: { flex: 1 },
    top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 22, paddingTop: 8, height: 44 },
    brand: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: -0.2 },
    skip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
    skipTxt: { color: "#fff", fontSize: 13.5, fontWeight: "700" },
    skipPh: { height: 32 },
    page: { flex: 1, paddingHorizontal: 24 },
    visual: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 8 },
    shot: {
        borderRadius: 18, overflow: "hidden", backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "rgba(232,201,135,0.45)",
        shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 22, shadowOffset: { width: 0, height: 12 }, elevation: 10
    },
    shotImg: { width: "100%", height: "100%" },
    hello: { alignItems: "center", width: "100%" },
    logo: { width: 132, height: 107, marginBottom: 22 },
    stats: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, maxWidth: 380 },
    stat: {
        width: "46%", paddingVertical: 14, paddingHorizontal: 12, borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)"
    },
    statN: { color: "#E8C987", fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
    statT: { color: "rgba(255,255,255,0.82)", fontSize: 12.5, fontWeight: "600", marginTop: 2 },
    copy: { paddingTop: 22, paddingBottom: 8, minHeight: 206 },
    kickerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    kickerIco: { width: 24, height: 24, borderRadius: 8, backgroundColor: "rgba(197,160,89,0.18)", alignItems: "center", justifyContent: "center" },
    kicker: { color: "#E8C987", fontSize: 11.5, fontWeight: "800", letterSpacing: 1.6 },
    title: { color: "#fff", fontSize: 26, fontWeight: "800", letterSpacing: -0.5, lineHeight: 32, marginTop: 10 },
    text: { color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 22, marginTop: 10 },
    bottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14 },
    dots: { flexDirection: "row", alignItems: "center", gap: 14, paddingLeft: 6 },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#E8C987" },
    cta: { borderRadius: 999, overflow: "hidden" },
    ctaIn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 22, height: 50, borderRadius: 999 },
    ctaTxt: { color: "#1F1A0E", fontSize: 16, fontWeight: "800" }
});
