import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, Text, View, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { Screen } from "../ui";
import { mediaUrl, rewriteHtmlMedia } from "../lib/media";
import { parseNoteBlocks } from "../lib/noteHtml";

var SCREEN_W = Dimensions.get("window").width;
var PAGE_PAD = 16;
var CARD_PAD = 14;
var ACCENT_W = 3;
var CONTENT_W = Math.max(200, SCREEN_W - PAGE_PAD * 2 - CARD_PAD * 2 - ACCENT_W - 12);

var C = {
    bg: "#F8FAFC",
    bgDark: "#0F172A",
    card: "#FFFFFF",
    cardDark: "#1E293B",
    navy: "#0F172A",
    gold: "#D97706",
    goldSoft: "#FEF3C7",
    goldInk: "#92400E",
    body: "#334155",
    muted: "#64748B",
    line: "#E2E8F0",
    lineDark: "#334155",
};

var htmlTags = {
    p: { fontSize: 15, lineHeight: 22, color: C.body, margin: 0 },
    span: { fontSize: 15, lineHeight: 22, color: C.body },
    b: { fontWeight: "800", color: C.navy },
    strong: { fontWeight: "800", color: C.navy },
    h3: { fontSize: 14, fontWeight: "800", color: C.goldInk, margin: 0 },
    h4: { fontSize: 15, fontWeight: "800", color: C.navy, margin: 0 },
    h5: { fontSize: 14, fontWeight: "800", color: C.navy, margin: 0 },
};

var htmlTagsDark = {
    p: { fontSize: 15, lineHeight: 22, color: "#CBD5E1", margin: 0 },
    span: { fontSize: 15, lineHeight: 22, color: "#CBD5E1" },
    b: { fontWeight: "800", color: "#F8FAFC" },
    strong: { fontWeight: "800", color: "#F8FAFC" },
    h3: { fontSize: 14, fontWeight: "800", color: "#FDE68A", margin: 0 },
    h4: { fontSize: 15, fontWeight: "800", color: "#F8FAFC", margin: 0 },
    h5: { fontSize: 14, fontWeight: "800", color: "#F8FAFC", margin: 0 },
};

var ignored = ["width", "minWidth", "maxWidth", "height", "flex", "flexDirection", "flexGrow", "flexShrink", "flexBasis", "position", "left", "right", "top", "bottom", "display"];

function wrapHtml(html) {
    return "<div>" + html + "</div>";
}

var NoteRich = memo(function NoteRich(props) {
    return (
        <RenderHTML
            contentWidth={CONTENT_W}
            source={{ html: wrapHtml(props.html), baseUrl: "https://www.atanly.com/" }}
            tagsStyles={props.dark ? htmlTagsDark : htmlTags}
            ignoredStyles={ignored}
            defaultTextProps={{ selectable: false }}
            computeEmbeddedMaxWidth={function () { return CONTENT_W; }}
        />
    );
});

var BadgeRow = memo(function BadgeRow(props) {
    return (
        <View style={styles.badge}>
            <NoteRich html={props.html} dark={props.dark} />
        </View>
    );
});

var HeadingRow = memo(function HeadingRow(props) {
    return (
        <View style={styles.heading}>
            <NoteRich html={props.html} dark={props.dark} />
        </View>
    );
});

var ItemCard = memo(function ItemCard(props) {
    return (
        <View style={[styles.itemCard, props.dark && styles.itemCardDark]}>
            <View style={styles.accent} />
            <View style={styles.itemBody}>
                <NoteRich html={props.html} dark={props.dark} />
            </View>
        </View>
    );
});

var TableCard = memo(function TableCard(props) {
    return (
        <View style={[styles.itemCard, props.dark && styles.itemCardDark]}>
            <View style={styles.accent} />
            <View style={styles.itemBody}>
                <NoteRich html={props.html} dark={props.dark} />
            </View>
        </View>
    );
});

var ImgCard = memo(function ImgCard(props) {
    var src = mediaUrl(props.src);
    var _h = useState(160);
    var h = _h[0];
    var setH = _h[1];
    if (!src) return null;
    return (
        <View style={[styles.itemCard, props.dark && styles.itemCardDark, { padding: 8 }]}>
            <Image
                source={{ uri: src }}
                resizeMode="contain"
                onLoad={function (e) {
                    var iw = e.nativeEvent.source && e.nativeEvent.source.width;
                    var ih = e.nativeEvent.source && e.nativeEvent.source.height;
                    if (iw && ih) setH(Math.min(280, Math.max(100, Math.round(CONTENT_W * ih / iw))));
                }}
                style={{ width: CONTENT_W, height: h, borderRadius: 12, backgroundColor: "#F1F5F9", alignSelf: "center" }}
            />
        </View>
    );
});

export default function NotesScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var isDark = app.dark;
    var insets = useSafeAreaInsets();
    var notlar = ((app.kpssData[ders] || {})[konu] || {}).notlar || [];
    var sorular = ((app.kpssData[ders] || {})[konu] || {}).sorular || [];
    var tp = StudentStore.getTopic(ders, konu);
    var _idx = useState(tp.noteIndex || 0);
    var idx = _idx[0];
    var setIdx = _idx[1];

    useEffect(function () {
        StudentStore.setNoteIndex(ders, konu, idx, notlar.length);
    }, [idx]);

    var blocks = useMemo(function () {
        return parseNoteBlocks(rewriteHtmlMedia(String(notlar[idx] || "")));
    }, [notlar, idx]);

    var goBack = useCallback(function () {
        navigation.goBack();
    }, [navigation]);

    var toggleDark = useCallback(function () {
        StudentStore.setDark(!isDark);
    }, [isDark]);

    var goPrev = useCallback(function () {
        setIdx(function (n) { return n > 0 ? n - 1 : n; });
    }, []);

    var goNext = useCallback(function () {
        setIdx(function (n) { return n < notlar.length - 1 ? n + 1 : n; });
    }, [notlar.length]);

    var goToTest = useCallback(function () {
        StudentStore.markNotesComplete(ders, konu);
        var packs = StudentStore.topicTestPacks(sorular.map(function (q, i) {
            var id = q.id != null ? q.id : i;
            return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
        }));
        var pack = packs[StudentStore.firstOpenPackIndex(StudentStore.getTopic(ders, konu), packs.length)];
        if (!pack) {
            navigation.goBack();
            return;
        }
        navigation.replace("Test", { mode: "topic", ders: ders, konu: konu, testNo: pack.no, items: pack.items });
    }, [ders, konu, sorular, navigation]);

    var renderItem = useCallback(function ({ item }) {
        if (item.type === "badge") return <BadgeRow html={item.html} dark={false} />;
        if (item.type === "heading") return <HeadingRow html={item.html} dark={isDark} />;
        if (item.type === "img") return <ImgCard src={item.src} dark={isDark} />;
        if (item.type === "table") return <TableCard html={item.html} dark={isDark} />;
        return <ItemCard html={item.html} dark={isDark} />;
    }, [isDark]);

    var keyExtractor = useCallback(function (item, i) {
        return item.type + "-" + i;
    }, []);

    var isLast = idx === notlar.length - 1;
    var iconColor = isDark ? "#E2E8F0" : C.navy;

    if (!notlar.length) {
        return (
            <Screen dark={isDark} style={{ backgroundColor: isDark ? C.bgDark : C.bg }}>
                <Pressable onPress={goBack} android_ripple={{ color: "rgba(0,0,0,0.05)" }} style={styles.iconBtn}>
                    <ChevronLeft size={22} color={iconColor} />
                </Pressable>
                <Text style={[styles.empty, { color: isDark ? "#fff" : C.navy }]}>Bu konu için henüz not yok.</Text>
            </Screen>
        );
    }

    return (
        <Screen dark={isDark} noBottom style={{ backgroundColor: isDark ? C.bgDark : C.bg }}>
            <View style={styles.header}>
                <Pressable onPress={goBack} android_ripple={{ color: "rgba(0,0,0,0.05)" }} style={[styles.iconBtn, isDark && styles.iconBtnDark]} hitSlop={8}>
                    <ChevronLeft size={22} color={iconColor} />
                </Pressable>
                <View style={styles.headerMid}>
                    <Text style={[styles.kicker, isDark && { color: "#94A3B8" }]} numberOfLines={1}>{ders}</Text>
                    <Text style={[styles.title, isDark && { color: "#F8FAFC" }]} numberOfLines={2}>{konu}</Text>
                </View>
                <Pressable onPress={toggleDark} android_ripple={{ color: "rgba(0,0,0,0.05)" }} style={[styles.iconBtn, isDark && styles.iconBtnDark]} hitSlop={8}>
                    <Settings size={20} color={iconColor} />
                </Pressable>
            </View>

            <FlatList
                data={blocks}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                extraData={isDark}
                style={{ flex: 1 }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={8}
                windowSize={7}
                removeClippedSubviews
            />

            <View style={[styles.bar, isDark && styles.barDark, { paddingBottom: Math.max(insets.bottom, 10) }]}>
                <Pressable
                    onPress={goPrev}
                    disabled={idx === 0}
                    android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                    style={[styles.navBtn, idx === 0 && { opacity: 0.35 }]}
                >
                    <ChevronLeft size={18} color={isDark ? "#F8FAFC" : C.navy} />
                    <Text style={[styles.navTxt, isDark && { color: "#F8FAFC" }]}>Önceki</Text>
                </Pressable>
                <Text style={[styles.counter, isDark && { color: "#FDE68A" }]}>{idx + 1} / {notlar.length}</Text>
                <Pressable
                    onPress={isLast ? (sorular.length ? goToTest : goBack) : goNext}
                    android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                    style={[styles.navBtn, styles.navBtnOn]}
                >
                    <Text style={styles.navTxtOn}>{isLast ? (sorular.length ? "Teste geç" : "Bitir") : "Sonraki"}</Text>
                    <ChevronRight size={18} color="#fff" />
                </Pressable>
            </View>
        </Screen>
    );
}

var styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingTop: 4,
        paddingBottom: 8,
    },
    headerMid: {
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 8,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: C.line,
        backgroundColor: "#fff",
    },
    iconBtnDark: {
        backgroundColor: "#1E293B",
        borderColor: "#334155",
    },
    kicker: {
        fontSize: 12,
        fontWeight: "700",
        color: C.muted,
        letterSpacing: 0.3,
        marginBottom: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: C.navy,
        lineHeight: 23,
    },
    listContent: {
        paddingHorizontal: PAGE_PAD,
        paddingBottom: 12,
    },
    badge: {
        alignSelf: "flex-start",
        maxWidth: "100%",
        backgroundColor: C.goldSoft,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#FDE68A",
    },
    heading: {
        marginBottom: 8,
        marginTop: 4,
    },
    itemCard: {
        flexDirection: "row",
        backgroundColor: C.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.line,
        overflow: "hidden",
        marginBottom: 10,
    },
    itemCardDark: {
        backgroundColor: C.cardDark,
        borderColor: C.lineDark,
    },
    accent: {
        width: ACCENT_W,
        backgroundColor: C.gold,
    },
    itemBody: {
        flex: 1,
        padding: CARD_PAD,
        minWidth: 0,
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingTop: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: C.line,
    },
    barDark: {
        backgroundColor: "#1E293B",
        borderTopColor: C.lineDark,
    },
    navBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.line,
        backgroundColor: "#fff",
        minWidth: 108,
    },
    navBtnOn: {
        backgroundColor: C.navy,
        borderColor: C.navy,
    },
    navTxt: {
        fontSize: 14,
        fontWeight: "700",
        color: C.navy,
        marginLeft: 2,
    },
    navTxtOn: {
        fontSize: 14,
        fontWeight: "700",
        color: "#fff",
        marginRight: 2,
    },
    counter: {
        fontSize: 13,
        fontWeight: "700",
        color: C.gold,
        letterSpacing: 0.4,
    },
    empty: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
    },
});
