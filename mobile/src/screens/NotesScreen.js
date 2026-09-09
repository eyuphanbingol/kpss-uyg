import React, { useEffect, useMemo, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { ScrollScreen, Card, BackChip, Tap } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";
import { mediaUrl, rewriteHtmlMedia } from "../lib/media";

function NoteImage({ tnode, contentWidth }) {
    var src = mediaUrl(tnode && tnode.attributes && tnode.attributes.src);
    var _h = useState(180);
    var h = _h[0];
    var setH = _h[1];
    if (!src) return null;
    return (
        <Image
            source={{ uri: src }}
            resizeMode="contain"
            onLoad={function (e) {
                var w = e.nativeEvent.source && e.nativeEvent.source.width;
                var hh = e.nativeEvent.source && e.nativeEvent.source.height;
                if (w && hh) setH(Math.min(360, Math.max(120, Math.round(contentWidth * hh / w))));
            }}
            style={{ width: contentWidth, height: h, backgroundColor: "#F6F1E4", borderRadius: 12, marginVertical: 8 }}
        />
    );
}

var htmlTags = {
    p: {
        fontSize: 15,
        lineHeight: 23,
        color: colors.text,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e7e5e4",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    li: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.text,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e7e5e4",
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },
    ul: { paddingLeft: 0, marginVertical: 4 },
    ol: { paddingLeft: 0, marginVertical: 4 },
    h3: { color: "#DC2626", fontWeight: "800", fontSize: 16, marginBottom: 8, marginTop: 4 },
    h4: { color: "#DC2626", fontWeight: "800", fontSize: 16, marginBottom: 8, marginTop: 4 },
    h5: { color: "#DC2626", fontWeight: "800", fontSize: 15, marginBottom: 6 },
    strong: { fontWeight: "800", color: "#041C24" },
    b: { fontWeight: "800", color: "#041C24" },
    img: { width: "100%", marginVertical: 8, borderRadius: 12 },
};

var htmlClasses = {
    "inline-flex": {
        backgroundColor: "#DC2626",
        color: "#fff",
        fontWeight: "800",
        fontSize: 14,
        lineHeight: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 10,
        alignSelf: "stretch",
        flexWrap: "wrap",
    },
    "font-black": { fontWeight: "800" },
    "text-lg": { fontSize: 16, lineHeight: 24, fontWeight: "700" },
    "rounded-xl": { borderRadius: 12 },
    "rounded-lg": { borderRadius: 10 },
    "mb-4": { marginBottom: 12 },
    "mb-2": { marginBottom: 8 },
    "p-3": { padding: 12 },
    "p-4": { padding: 14 },
};

export default function NotesScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var isDark = app.dark;
    var notlar = ((app.kpssData[ders] || {})[konu] || {}).notlar || [];
    var sorular = ((app.kpssData[ders] || {})[konu] || {}).sorular || [];
    var tp = StudentStore.getTopic(ders, konu);
    var _idx = useState(tp.noteIndex || 0);
    var idx = _idx[0];
    var setIdx = _idx[1];
    var _w = useState(320);
    var contentW = _w[0];
    var setContentW = _w[1];

    useEffect(function () {
        StudentStore.setNoteIndex(ders, konu, idx, notlar.length);
    }, [idx]);

    var html = useMemo(function () {
        return rewriteHtmlMedia(String(notlar[idx] || ""));
    }, [notlar, idx]);

    function goToTest() {
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
    }

    if (!notlar.length) {
        return (
            <ScrollScreen dark={isDark}>
                <BackChip dark={isDark} label="Geri" onPress={function () { navigation.goBack(); }} />
                <Text style={[styles.empty, isDark && { color: "#fff" }]}>Bu konu için henüz not yok.</Text>
            </ScrollScreen>
        );
    }

    var isLast = idx === notlar.length - 1;

    return (
        <ScrollScreen dark={isDark}>
            <BackChip dark={isDark} label="Geri" onPress={function () { navigation.goBack(); }} />

            <View style={styles.header}>
                <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                    <Text style={[styles.dersName, isDark && { color: colors.muted }]} numberOfLines={1}>
                        {DERS_ICON[ders] || "📚"} {ders}
                    </Text>
                    <Text style={[styles.konuName, isDark && { color: "#fff" }]} numberOfLines={2}>{konu}</Text>
                </View>
                <View style={[styles.counter, isDark && { backgroundColor: "#211F1D" }]}>
                    <Text style={styles.counterText}>{idx + 1}/{notlar.length}</Text>
                </View>
            </View>

            <Card dark={isDark} style={styles.noteCard}>
                <View
                    onLayout={function (e) {
                        var w = Math.floor(e.nativeEvent.layout.width);
                        if (w > 40 && Math.abs(w - contentW) > 2) setContentW(w);
                    }}
                >
                    <RenderHTML
                        contentWidth={contentW}
                        source={{ html: html, baseUrl: "https://www.atanly.com/" }}
                        baseStyle={isDark ? styles.baseDark : styles.base}
                        tagsStyles={htmlTags}
                        classesStyles={htmlClasses}
                        ignoredStyles={["width", "minWidth", "maxWidth", "flexBasis", "height"]}
                        defaultTextProps={{ selectable: false }}
                        defaultViewProps={{ style: { maxWidth: "100%" } }}
                        renderers={{
                            img: function (p) {
                                return <NoteImage tnode={p.tnode} contentWidth={contentW} />;
                            }
                        }}
                    />
                </View>
            </Card>

            <View style={styles.navRow}>
                <Tap
                    disabled={idx === 0}
                    onPress={function () { if (idx > 0) setIdx(idx - 1); }}
                    style={[styles.navBtn, isDark && styles.navBtnDark, idx === 0 && { opacity: 0.35 }]}
                >
                    <Text style={[styles.navTxt, isDark && { color: "#e7e5e4" }]}>← Önceki</Text>
                </Tap>
                {isLast ? (
                    <Tap onPress={sorular.length ? goToTest : function () { navigation.goBack(); }} style={[styles.navBtn, styles.navBtnOn]}>
                        <Text style={[styles.navTxt, { color: "#fff" }]}>{sorular.length ? "Teste geç →" : "Bitir"}</Text>
                    </Tap>
                ) : (
                    <Tap onPress={function () { setIdx(idx + 1); }} style={[styles.navBtn, styles.navBtnOn]}>
                        <Text style={[styles.navTxt, { color: "#fff" }]}>Sonraki →</Text>
                    </Tap>
                )}
            </View>
        </ScrollScreen>
    );
}

var styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
    },
    dersName: {
        color: colors.muted,
        fontSize: 13,
        marginBottom: 2,
    },
    konuName: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.navy,
    },
    counter: {
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        flexShrink: 0,
    },
    counterText: {
        fontWeight: "700",
        fontSize: 13,
        color: colors.indigo,
    },
    noteCard: {
        padding: 14,
        overflow: "hidden",
        marginBottom: 12,
    },
    base: {
        fontSize: 15,
        lineHeight: 23,
        color: colors.text,
        maxWidth: "100%",
    },
    baseDark: {
        fontSize: 15,
        lineHeight: 23,
        color: "#e7e5e4",
        maxWidth: "100%",
    },
    navRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    navBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 4,
    },
    navBtnDark: {
        backgroundColor: "#211F1D",
        borderColor: "rgba(255,255,255,0.1)",
    },
    navBtnOn: {
        backgroundColor: "#0D2C4D",
        borderColor: "#0D2C4D",
    },
    navTxt: {
        fontWeight: "700",
        fontSize: 14,
        color: colors.text,
    },
    empty: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: colors.text,
    },
});
