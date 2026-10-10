import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import {
    ArrowRight, BookOpen, Brain, CalendarDays, Check, CheckCircle2, Flag, Flame, Map as MapIcon,
    Medal, RotateCcw, Sparkles, Target, Timer, TrendingUp, Trophy, Users, X, Zap
} from "lucide-react-native";
import { BrandBackdrop } from "./SplashScreen";
import { Tap } from "../ui";

// Uygulama ilk kez açılınca giriş ekranından önce bir kez gösterilen tanıtım sayfaları.
export var INTRO_KEY = "kpss-intro-seen";

var GOLD = "#E8C987";
var GOLD_D = "#C5A059";
var INK = "#0F172A";
var MUTED = "#64748B";
var TEAL = "#127880";
// Görseller bu kutuya göre çizilir, ekrana sığacak kadar ölçeklenir
var ART_W = 330;
var ART_H = 318;

// ---------- Ortak parçalar ----------

function Glow(props) {
    return (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
            <Defs>
                <RadialGradient id={"g" + props.id} cx="50%" cy="46%" r="52%">
                    <Stop offset="0" stopColor={props.color} stopOpacity="0.42" />
                    <Stop offset="1" stopColor={props.color} stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill={"url(#g" + props.id + ")"} />
        </Svg>
    );
}

// Yavaşça süzülen rozet (hareketi azalt açıksa sabit)
function Float(props) {
    var v = useRef(new Animated.Value(0)).current;
    useEffect(function () {
        if (props.still) return;
        var loop = Animated.loop(Animated.sequence([
            Animated.timing(v, { toValue: 1, duration: 1800 + (props.delay || 0), easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(v, { toValue: 0, duration: 1800 + (props.delay || 0), easing: Easing.inOut(Easing.sin), useNativeDriver: true })
        ]));
        loop.start();
        return function () { loop.stop(); };
    }, [props.still]);
    var ty = v.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
    return <Animated.View style={[{ position: "absolute" }, props.style, { transform: [{ translateY: ty }] }]}>{props.children}</Animated.View>;
}

function Chip(props) {
    var Icon = props.icon;
    return (
        <View style={[a.chip, props.dark && a.chipDark]}>
            <View style={[a.chipIco, { backgroundColor: props.bg || "#FEF3C7" }]}>
                <Icon size={14} color={props.color || "#B45309"} strokeWidth={2.5} />
            </View>
            <View>
                <Text style={[a.chipTop, props.dark && { color: "rgba(255,255,255,0.65)" }]}>{props.top}</Text>
                <Text style={[a.chipVal, props.dark && { color: "#fff" }]}>{props.val}</Text>
            </View>
        </View>
    );
}

function Card(props) {
    return <View style={[a.card, props.style]}>{props.children}</View>;
}

function Bar(props) {
    return (
        <View style={a.barBg}>
            <LinearGradient colors={props.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[a.barFill, { width: props.pct + "%" }]} />
        </View>
    );
}

// ---------- Sayfa görselleri ----------

function ArtWelcome(props) {
    var stats = [
        [BookOpen, "5.800+", "ÖSYM tarzı soru"],
        [Sparkles, "1.200+", "konu notu"],
        [MapIcon, "390+", "harita hedefi"],
        [Trophy, "Her Pazar", "canlı deneme"]
    ];
    return (
        <View style={a.box}>
            <View style={a.halo}>
                <View style={a.haloRing2} />
                <View style={a.haloRing} />
                <Image source={require("../../assets/atanom.png")} style={a.bigLogo} accessibilityIgnoresInvertColors />
            </View>
            <View style={a.statGrid}>
                {stats.map(function (st) {
                    var Icon = st[0];
                    return (
                        <View key={st[2]} style={a.stat}>
                            <View style={a.statIco}><Icon size={15} color={GOLD} strokeWidth={2.4} /></View>
                            <Text style={a.statN}>{st[1]}</Text>
                            <Text style={a.statT}>{st[2]}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

function ArtProgram(props) {
    var rows = [
        { icon: BookOpen, t: "Konu notu", d: "Tarih · Osmanlı Kuruluş", done: true },
        { icon: Target, t: "Konu testi · 20 soru", d: "Coğrafya · İklim", done: true },
        { icon: RotateCcw, t: "Aralıklı tekrar", d: "8 kart seni bekliyor", done: false }
    ];
    return (
        <View style={a.box}>
            <Card style={{ position: "absolute", left: 14, right: 14, top: 28, padding: 16 }}>
                <View style={a.rowBetween}>
                    <View>
                        <Text style={a.cardKick}>BUGÜNÜN PLANI</Text>
                        <Text style={a.cardTitle}>Salı · 45 dk</Text>
                    </View>
                    <View style={a.ring}>
                        <Text style={a.ringN}>2/3</Text>
                    </View>
                </View>
                {rows.map(function (r) {
                    var Icon = r.icon;
                    return (
                        <View key={r.t} style={a.task}>
                            <View style={[a.taskIco, r.done ? { backgroundColor: "#E6F4F1" } : { backgroundColor: "#FEF3C7" }]}>
                                <Icon size={15} color={r.done ? TEAL : "#B45309"} strokeWidth={2.4} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[a.taskT, r.done && a.taskDone]}>{r.t}</Text>
                                <Text style={a.taskD}>{r.d}</Text>
                            </View>
                            {r.done
                                ? <CheckCircle2 size={20} color={TEAL} strokeWidth={2.4} />
                                : <View style={a.go}><Text style={a.goTxt}>Başla</Text></View>}
                        </View>
                    );
                })}
            </Card>
            <Float still={props.still} style={{ right: 0, top: 0 }}>
                <Chip icon={CalendarDays} top="Sınava" val="281 gün" bg="#DBEAFE" color="#1D4ED8" />
            </Float>
            <Float still={props.still} delay={400} style={{ left: -4, bottom: -14 }}>
                <Chip icon={Flame} top="Çalışma serisi" val="6 gün" />
            </Float>
        </View>
    );
}

function ArtEksik(props) {
    var ders = [["Vatandaşlık", 81, ["#34D399", "#059669"]], ["Tarih", 72, ["#5EEAD4", TEAL]], ["Coğrafya", 58, [GOLD, GOLD_D]], ["Türkçe", 44, ["#FCA5A5", "#E11D48"]]];
    return (
        <View style={a.box}>
            <Card style={{ position: "absolute", left: 14, right: 14, top: 40, padding: 16 }}>
                <Text style={a.cardKick}>DERS HÂKİMİYETİ</Text>
                {ders.map(function (d) {
                    return (
                        <View key={d[0]} style={{ marginTop: 11 }}>
                            <View style={a.rowBetween}>
                                <Text style={a.dersT}>{d[0]}</Text>
                                <Text style={[a.dersP, d[1] < 50 && { color: "#E11D48" }]}>%{d[1]}</Text>
                            </View>
                            <Bar pct={d[1]} colors={d[2]} />
                        </View>
                    );
                })}
                <View style={a.weak}>
                    <Zap size={14} color="#B45309" strokeWidth={2.5} />
                    <Text style={a.weakTxt}>Türkçe · Paragraf yarına öne çekildi</Text>
                </View>
            </Card>
            <Float still={props.still} style={{ left: -4, bottom: -14 }}>
                <View style={[a.chip, { paddingRight: 14 }]}>
                    <View style={[a.chipIco, { backgroundColor: "#FFE4E6" }]}><X size={14} color="#E11D48" strokeWidth={3} /></View>
                    <View>
                        <Text style={a.chipTop}>Yanlış defteri</Text>
                        <Text style={a.chipVal}>12 soru tekrarda</Text>
                    </View>
                </View>
            </Float>
            <Float still={props.still} delay={500} style={{ right: 0, top: -8 }}>
                <Chip icon={Check} top="Bu hafta kapanan" val="9 konu" bg="#DCFCE7" color="#15803D" />
            </Float>
        </View>
    );
}

function ArtGames(props) {
    var games = [
        { icon: Flag, t: "Türkiye'yi Fethet", d: "İl il boya", c: ["#14B8A6", "#0F766E"] },
        { icon: MapIcon, t: "KPSS Haritaları", d: "Dağ, maden, YHT", c: ["#38BDF8", "#1D4ED8"] },
        { icon: Brain, t: "Tabu", d: "Az ipucu, çok puan", c: ["#A78BFA", "#6D28D9"] },
        { icon: Timer, t: "Son 30 saniye", d: "Sınav temposu", c: ["#FBBF24", "#D97706"] }
    ];
    return (
        <View style={a.box}>
            <View style={a.gameGrid}>
                {games.map(function (g) {
                    var Icon = g.icon;
                    return (
                        <View key={g.t} style={a.game}>
                            <LinearGradient colors={g.c} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={a.gameIco}>
                                <Icon size={22} color="#fff" strokeWidth={2.3} />
                            </LinearGradient>
                            <Text style={a.gameT}>{g.t}</Text>
                            <Text style={a.gameD}>{g.d}</Text>
                        </View>
                    );
                })}
            </View>
            <Float still={props.still} style={{ right: 4, top: 0 }}>
                <View style={a.xp}><Sparkles size={13} color="#1F1A0E" strokeWidth={2.6} /><Text style={a.xpTxt}>+120 puan</Text></View>
            </Float>
            <Float still={props.still} delay={450} style={{ left: 0, bottom: 0 }}>
                <Chip icon={Check} top="Doğru · Sivas" val="İç Anadolu Bölgesi" bg="#DCFCE7" color="#15803D" />
            </Float>
        </View>
    );
}

function ArtDeneme(props) {
    var rows = [["1", "Zeynep K.", "112,5"], ["2", "Mert A.", "109,0"], ["3", "Elif S.", "107,25"]];
    var medal = ["#F59E0B", "#94A3B8", "#B45309"];
    return (
        <View style={a.box}>
            <Card style={{ position: "absolute", left: 14, right: 14, top: 40, padding: 16 }}>
                <View style={a.rowBetween}>
                    <View>
                        <Text style={a.cardKick}>PAZAR DENEMESİ</Text>
                        <Text style={a.cardTitle}>Türkiye sıralaması</Text>
                    </View>
                    <View style={a.live}><View style={a.liveDot} /><Text style={a.liveTxt}>CANLI</Text></View>
                </View>
                {rows.map(function (r, i) {
                    return (
                        <View key={r[0]} style={a.rank}>
                            <Medal size={18} color={medal[i]} strokeWidth={2.4} />
                            <Text style={a.rankName}>{r[1]}</Text>
                            <Text style={a.rankNet}>{r[2]} net</Text>
                        </View>
                    );
                })}
                <LinearGradient colors={["#0D2C4D", "#14607a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={a.me}>
                    <Text style={a.meRank}>1.248.</Text>
                    <Text style={a.meName}>Sen</Text>
                    <Text style={a.meNet}>78,5 net</Text>
                </LinearGradient>
            </Card>
            <Float still={props.still} style={{ right: 0, top: -6 }}>
                <Chip icon={Users} top="Herkes aynı anda" val="Sonuç Pazar akşamı" bg="#DBEAFE" color="#1D4ED8" />
            </Float>
            <Float still={props.still} delay={500} style={{ left: -4, bottom: -14 }}>
                <Chip icon={TrendingUp} top="Geçen haftaya göre" val="+312 sıra" bg="#DCFCE7" color="#15803D" />
            </Float>
        </View>
    );
}

var PAGES = [
    {
        art: ArtWelcome, glow: GOLD_D,
        kicker: "Atanly'ye hoş geldin",
        title: "Atamaya giden yol tek uygulamada.",
        text: "GY-GK'nın tamamı: konu notları, ÖSYM tarzı sorular, aralıklı tekrar, oyunlar ve her Pazar canlı deneme."
    },
    {
        art: ArtProgram, glow: "#1D8A99",
        kicker: "Akıllı program",
        title: "Bugün ne çalışacağını düşünme.",
        text: "Sınav tarihine, boş saatlerine ve zayıf derslerine göre günlük plan. Bir gün kaçırırsan program kendini yeniden dağıtır."
    },
    {
        art: ArtEksik, glow: "#E11D48",
        kicker: "Eksikler ve yanlış defteri",
        title: "Zayıf konun seni bulur.",
        text: "Yanlışların deftere düşer, unutma eğrisine göre tekrar önüne gelir. Hangi derste ne kadar hazır olduğunu hep görürsün."
    },
    {
        art: ArtGames, glow: "#7C3AED",
        kicker: "Oyunlarla pekiştir",
        title: "Ezberi oyunla kalıcı yap.",
        text: "Haritada dağı, madeni, YHT durağını, boru hattını bul. Tabu ve Son 30 saniye ile kavramlar sınav temposunda oturur."
    },
    {
        art: ArtDeneme, glow: "#F59E0B",
        kicker: "Her Pazar canlı deneme",
        title: "Türkiye geneli sıralamada yerini gör.",
        text: "Herkes aynı anda çözer. Sıralama, net dağılımı ve konu analizi Pazar akşamı hazır."
    }
];

function Page(props) {
    var p = props.page;
    var Art = p.art;
    var w = props.width;
    var i = props.index;
    var x = props.x;
    var range = [(i - 1) * w, i * w, (i + 1) * w];
    // Görsel ve yazı farklı hızda kayar (parallax), sayfa ortadayken tam görünür
    var artStyle = {
        opacity: x.interpolate({ inputRange: range, outputRange: [0, 1, 0], extrapolate: "clamp" }),
        transform: [
            { translateX: x.interpolate({ inputRange: range, outputRange: [w * 0.35, 0, -w * 0.35], extrapolate: "clamp" }) },
            { scale: x.interpolate({ inputRange: range, outputRange: [0.86, 1, 0.86], extrapolate: "clamp" }) }
        ]
    };
    var copyStyle = {
        opacity: x.interpolate({ inputRange: range, outputRange: [0, 1, 0], extrapolate: "clamp" }),
        transform: [{ translateX: x.interpolate({ inputRange: range, outputRange: [w * 0.15, 0, -w * 0.15], extrapolate: "clamp" }) }]
    };
    var _box = useState(null);
    var box = _box[0];
    var setBox = _box[1];
    var scale = box ? Math.min(1.12, box.w / ART_W, box.h / ART_H) : 1;
    return (
        <View style={[s.page, { width: w }]}>
            <View style={s.visual} onLayout={function (e) { var l = e.nativeEvent.layout; setBox({ w: l.width, h: l.height }); }}>
                <Glow id={i} color={p.glow} />
                {box ? (
                    <Animated.View style={artStyle}>
                        <View style={{ width: ART_W, height: ART_H, transform: [{ scale: scale }] }}>
                            <Art still={props.still} />
                        </View>
                    </Animated.View>
                ) : null}
            </View>
            <Animated.View style={[s.copy, copyStyle]}>
                <Text style={s.kicker}>{p.kicker.toLocaleUpperCase("tr-TR")}</Text>
                <Text style={s.title} accessibilityRole="header">{p.title}</Text>
                <Text style={s.text}>{p.text}</Text>
            </Animated.View>
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
    var _still = useState(false);
    var still = _still[0];
    var setStill = _still[1];
    var last = index === PAGES.length - 1;

    useEffect(function () {
        AccessibilityInfo.isReduceMotionEnabled().then(function (on) { if (on) setStill(true); }).catch(function () {});
    }, []);

    function go(i) {
        if (ref.current) ref.current.scrollTo({ x: i * width, animated: true });
        setIndex(i);
    }

    var fill = x.interpolate({ inputRange: [0, width * (PAGES.length - 1)], outputRange: [1 / PAGES.length, 1], extrapolate: "clamp" });

    return (
        <BrandBackdrop>
            <StatusBar style="light" />
            <SafeAreaView style={s.fill} edges={["top", "bottom"]}>
                <View style={s.top}>
                    <View style={s.brandRow}>
                        <Image source={require("../../assets/atanom.png")} style={s.logo} accessibilityIgnoresInvertColors />
                        <Text style={s.brand}>Atanly</Text>
                    </View>
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
                        return <Page key={i} page={p} index={i} width={width} x={x} still={still} />;
                    })}
                </Animated.ScrollView>
                <View style={s.bottom}>
                    <View style={s.progWrap} accessibilityLabel={"Sayfa " + (index + 1) + " / " + PAGES.length}>
                        <Text style={s.progTxt}><Text style={s.progNow}>{String(index + 1).padStart(2, "0")}</Text> / {String(PAGES.length).padStart(2, "0")}</Text>
                        <View style={s.progBg}>
                            <Animated.View style={[s.progFill, { transform: [{ scaleX: fill }] }]} />
                        </View>
                    </View>
                    <Tap onPress={last ? props.onDone : function () { go(index + 1); }} style={s.cta} accessibilityLabel={last ? "Hemen başla" : "Sonraki sayfa"}>
                        <LinearGradient colors={[GOLD, GOLD_D]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.ctaIn, last && { paddingHorizontal: 26 }]}>
                            <Text style={s.ctaTxt}>{last ? "Hemen başla" : "İleri"}</Text>
                            <ArrowRight size={18} color="#1F1A0E" strokeWidth={2.6} />
                        </LinearGradient>
                    </Tap>
                </View>
            </SafeAreaView>
        </BrandBackdrop>
    );
}

var shadow = { shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8 };

var a = StyleSheet.create({
    box: { width: ART_W, height: ART_H },
    card: Object.assign({ backgroundColor: "#fff", borderRadius: 22 }, shadow),
    rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    cardKick: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, color: TEAL },
    cardTitle: { fontSize: 18, fontWeight: "800", color: INK, marginTop: 2, letterSpacing: -0.3 },
    chip: Object.assign({ flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#fff", borderRadius: 16, paddingVertical: 9, paddingLeft: 9, paddingRight: 13 }, shadow),
    chipDark: { backgroundColor: "rgba(15,23,42,0.85)" },
    chipIco: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    chipTop: { fontSize: 10.5, fontWeight: "600", color: MUTED },
    chipVal: { fontSize: 13.5, fontWeight: "800", color: INK, marginTop: 1 },
    // hoş geldin
    halo: { alignSelf: "center", width: 124, height: 124, alignItems: "center", justifyContent: "center", marginTop: 2 },
    haloRing: { position: "absolute", width: 104, height: 104, borderRadius: 52, borderWidth: 1, borderColor: "rgba(232,201,135,0.55)", backgroundColor: "rgba(232,201,135,0.07)" },
    haloRing2: { position: "absolute", width: 124, height: 124, borderRadius: 62, borderWidth: 1, borderColor: "rgba(94,234,212,0.28)" },
    bigLogo: { width: 86, height: 70 },
    statGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10, marginTop: 14 },
    stat: { width: (ART_W - 10) / 2, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.13)" },
    statIco: { width: 26, height: 26, borderRadius: 8, backgroundColor: "rgba(232,201,135,0.14)", alignItems: "center", justifyContent: "center", marginBottom: 6 },
    statN: { color: "#fff", fontSize: 19, fontWeight: "800", letterSpacing: -0.4 },
    statT: { color: "rgba(255,255,255,0.68)", fontSize: 11.5, fontWeight: "600", marginTop: 1 },
    // program
    ring: { width: 50, height: 50, borderRadius: 25, borderWidth: 5, borderColor: TEAL, borderLeftColor: "#E2E8F0", alignItems: "center", justifyContent: "center", transform: [{ rotate: "-45deg" }] },
    ringN: { fontSize: 13, fontWeight: "800", color: INK, transform: [{ rotate: "45deg" }] },
    task: { flexDirection: "row", alignItems: "center", gap: 11, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
    taskIco: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
    taskT: { fontSize: 13.5, fontWeight: "700", color: INK },
    taskDone: { color: MUTED, textDecorationLine: "line-through" },
    taskD: { fontSize: 11.5, color: MUTED, marginTop: 1 },
    go: { backgroundColor: "#0D2C4D", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
    goTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },
    // eksikler
    dersT: { fontSize: 13, fontWeight: "700", color: INK },
    dersP: { fontSize: 12.5, fontWeight: "800", color: INK },
    barBg: { height: 8, borderRadius: 4, backgroundColor: "#EEF2F6", marginTop: 6, overflow: "hidden" },
    barFill: { height: 8, borderRadius: 4 },
    weak: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 14, backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
    weakTxt: { fontSize: 12, fontWeight: "700", color: "#92400E", flex: 1 },
    // oyunlar
    gameGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12, marginTop: 34, paddingHorizontal: 8 },
    game: Object.assign({ width: (ART_W - 16 - 12) / 2, backgroundColor: "#fff", borderRadius: 20, padding: 14 }, shadow),
    gameIco: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    gameT: { fontSize: 13.5, fontWeight: "800", color: INK, letterSpacing: -0.2 },
    gameD: { fontSize: 11.5, color: MUTED, marginTop: 2 },
    xp: Object.assign({ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: GOLD, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 }, shadow),
    xpTxt: { fontSize: 12.5, fontWeight: "800", color: "#1F1A0E" },
    // deneme
    live: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFE4E6", borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
    liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#E11D48" },
    liveTxt: { fontSize: 10, fontWeight: "800", color: "#BE123C", letterSpacing: 0.8 },
    rank: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 11, paddingTop: 11, borderTopWidth: 1, borderTopColor: "#F1F5F9" },
    rankName: { flex: 1, fontSize: 13.5, fontWeight: "700", color: INK },
    rankNet: { fontSize: 12.5, fontWeight: "700", color: MUTED },
    me: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
    meRank: { fontSize: 13, fontWeight: "800", color: GOLD },
    meName: { flex: 1, fontSize: 13.5, fontWeight: "800", color: "#fff" },
    meNet: { fontSize: 13, fontWeight: "800", color: "#fff" }
});

var s = StyleSheet.create({
    fill: { flex: 1 },
    top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 22, paddingTop: 8, height: 48 },
    brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    logo: { width: 30, height: 30 },
    brand: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: -0.2 },
    skip: { paddingHorizontal: 15, paddingVertical: 7, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" },
    skipTxt: { color: "#fff", fontSize: 13.5, fontWeight: "700" },
    skipPh: { height: 32 },
    page: { flex: 1 },
    visual: { flex: 1, alignItems: "center", justifyContent: "center", marginHorizontal: 12, marginTop: 6, overflow: "visible" },
    copy: { paddingHorizontal: 26, paddingTop: 24, paddingBottom: 6, minHeight: 186 },
    kicker: { color: GOLD, fontSize: 11.5, fontWeight: "800", letterSpacing: 1.8 },
    title: { color: "#fff", fontSize: 28, fontWeight: "800", letterSpacing: -0.7, lineHeight: 34, marginTop: 10 },
    text: { color: "rgba(255,255,255,0.74)", fontSize: 15, lineHeight: 22, marginTop: 10 },
    bottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 26, paddingTop: 10, paddingBottom: 14 },
    progWrap: { width: 110 },
    progTxt: { color: "rgba(255,255,255,0.55)", fontSize: 12.5, fontWeight: "700", letterSpacing: 1 },
    progNow: { color: "#fff" },
    progBg: { height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.16)", marginTop: 8, overflow: "hidden" },
    progFill: { height: 3, width: 110, backgroundColor: GOLD, borderRadius: 2, transformOrigin: "left" },
    cta: Object.assign({ borderRadius: 999 }, { shadowColor: GOLD_D, shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 }),
    ctaIn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 22, height: 52, borderRadius: 999 },
    ctaTxt: { color: "#1F1A0E", fontSize: 16, fontWeight: "800" }
});
