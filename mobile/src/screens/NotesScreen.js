import React, { useEffect, useMemo, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { ScrollScreen, Card, BackChip, Tap } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";
import { mediaUrl, rewriteHtmlMedia } from "../lib/media";
import { normalizeNoteHtml } from "../lib/noteHtml";

function NoteImage({ tnode, contentWidth }) {
    var src = mediaUrl(tnode && tnode.attributes && tnode.attributes.src);
    var _h = useState(160);
    var h = _h[0];
    var setH = _h[1];
    if (!src) return null;
    var w = Math.max(80, contentWidth);
    return (
        <Image
            source={{ uri: src }}
            resizeMode="contain"
            onLoad={function (e) {
                var iw = e.nativeEvent.source && e.nativeEvent.source.width;
                var ih = e.nativeEvent.source && e.nativeEvent.source.height;
                if (iw && ih) setH(Math.min(320, Math.max(100, Math.round(w * ih / iw))));
            }}
            style={{ width: w, height: h, alignSelf: "center", backgroundColor: "#F6F1E4", borderRadius: 10, marginVertical: 8 }}
        />
    );
}

function makeTags(dark) {
    var ink = dark ? "#e7e5e4" : colors.text;
    var strong = dark ? "#F5EBC7" : "#041C24";
    return {
        body: { margin: 0, padding: 0 },
        div: { margin: 0, padding: 0, flexDirection: "column", maxWidth: "100%" },
        p: { fontSize: 15, lineHeight: 22, color: ink, marginTop: 0, marginBottom: 10, marginLeft: 0, marginRight: 0 },
        li: { fontSize: 14, lineHeight: 21, color: ink, marginBottom: 6, paddingLeft: 0 },
        ul: { marginTop: 0, marginBottom: 8, paddingLeft: 16 },
        ol: { marginTop: 0, marginBottom: 8, paddingLeft: 16 },
        h3: {
            color: "#DC2626",
            fontWeight: "800",
            fontSize: 15,
            lineHeight: 21,
            marginTop: 0,
            marginBottom: 12,
            paddingBottom: 8,
            borderBottomWidth: 2,
            borderBottomColor: "rgba(220,38,38,0.25)",
        },
        h4: { color: "#DC2626", fontWeight: "800", fontSize: 15, lineHeight: 21, marginTop: 8, marginBottom: 6 },
        h5: { color: "#DC2626", fontWeight: "800", fontSize: 14, marginBottom: 6 },
        strong: { fontWeight: "800", color: strong },
        b: { fontWeight: "800", color: strong },
        span: { color: ink, fontSize: 14, lineHeight: 21 },
        table: { marginBottom: 10 },
        td: { fontSize: 13, lineHeight: 20, color: ink, paddingVertical: 4 },
        th: { fontSize: 12, fontWeight: "800", color: "#0D5C63", paddingVertical: 4 },
    };
}

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
    var _w = useState(280);
    var contentW = _w[0];
    var setContentW = _w[1];

    useEffect(function () {
        StudentStore.setNoteIndex(ders, konu, idx, notlar.length);
    }, [idx]);

    var html = useMemo(function () {
        return normalizeNoteHtml(rewriteHtmlMedia(String(notlar[idx] || "")));
    }, [notlar, idx]);

    var tags = useMemo(function () { return makeTags(isDark); }, [isDark]);

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
                <View style={styles.headerText}>
                    <Text style={styles.dersName} numberOfLines={1}>{DERS_ICON[ders] || "📚"} {ders}</Text>
                    <Text style={[styles.konuName, isDark && { color: "#fff" }]} numberOfLines={2}>{konu}</Text>
                </View>
                <View style={styles.counter}>
                    <Text style={styles.counterText}>{idx + 1}/{notlar.length}</Text>
                </View>
            </View>

            <Card dark={isDark} style={styles.noteCard}>
                <View
                    style={styles.noteInner}
                    onLayout={function (e) {
                        var w = Math.floor(e.nativeEvent.layout.width);
                        if (w > 60 && Math.abs(w - contentW) > 1) setContentW(w);
                    }}
                >
                    <RenderHTML
                        contentWidth={contentW}
                        source={{ html: html || "<p></p>", baseUrl: "https://www.atanly.com/" }}
                        baseStyle={isDark ? styles.baseDark : styles.base}
                        tagsStyles={tags}
                        ignoredStyles={["width", "minWidth", "maxWidth", "height", "flex", "flexDirection", "flexGrow", "flexShrink", "flexBasis", "position", "left", "right", "top", "bottom", "display"]}
                        defaultTextProps={{ selectable: false }}
                        computeEmbeddedMaxWidth={function () { return contentW; }}
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
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
    },
    headerText: {
        flex: 1,
        minWidth: 0,
        paddingRight: 8,
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
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
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
    noteInner: {
        width: "100%",
        overflow: "hidden",
    },
    base: {
        fontSize: 15,
        lineHeight: 22,
        color: colors.text,
    },
    baseDark: {
        fontSize: 15,
        lineHeight: 22,
        color: "#e7e5e4",
    },
    navRow: {
        flexDirection: "row",
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
