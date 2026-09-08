import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, useWindowDimensions, View, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { PrimaryButton, ScrollScreen, Card, BackChip } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";
import { mediaUrl, rewriteHtmlMedia } from "../lib/media";

function NoteImage({ tnode, contentWidth }) {
    var src = mediaUrl(tnode && tnode.attributes && tnode.attributes.src);
    var _h = useState(200);
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
                if (w && hh) setH(Math.min(440, Math.max(140, Math.round(contentWidth * hh / w))));
            }}
            style={{ width: contentWidth, height: h, backgroundColor: "#F6F1E4", borderRadius: 12, marginVertical: 8 }}
        />
    );
}

var NOTE_SKIN = "<style>"
    + ".note-html{display:flex;flex-direction:column;gap:12px;font-size:15px;line-height:1.55;color:#1c1917;overflow:hidden;max-width:100%}"
    + ".note-html>div:first-child{background:none!important;border:0!important;padding:0!important}"
    + ".note-html span.inline-flex{display:inline-flex!important;padding:6px 12px!important;border-radius:999px!important;background:linear-gradient(135deg,#041C24,#127880)!important;color:#F5EBC7!important;border:0!important;font-size:11px!important;font-weight:800!important}"
    + ".note-pack,.note-html>div:not(:first-child){background:#f6f3ed!important;border:1px solid rgba(18,120,128,.16)!important;border-radius:16px!important;padding:14px!important}"
    + ".note-html ul,.note-html ol{list-style:none!important;padding:0!important;display:flex;flex-wrap:wrap;gap:8px}"
    + ".note-html li,.note-html .note-chip,.note-html .flex-wrap>span{background:#fff!important;border:1px solid #e7e5e4!important;border-radius:10px!important;padding:8px 12px!important}"
    + ".note-html p{background:#fff!important;border:1px solid #e7e5e4!important;border-radius:12px!important;padding:12px 14px!important}"
    + ".note-html .grid>div{background:#fff!important;border:1px solid #e7e5e4!important;border-radius:14px!important;padding:12px!important}"
    + ".note-html b,.note-html strong{color:#041C24;font-weight:800}"
    + ".note-html img{max-width:100%!important;width:100%!important;height:auto!important;display:block!important;border-radius:12px!important;margin:10px 0!important;background:#F6F1E4}"
    + ".note-html table{width:100%!important;display:table!important}"
    + "</style>";

export default function NotesScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var isDark = app.dark;

    // ---------- Data ----------
    var notlar = ((app.kpssData[ders] || {})[konu] || {}).notlar || [];
    var sorular = ((app.kpssData[ders] || {})[konu] || {}).sorular || [];
    var tp = StudentStore.getTopic(ders, konu);
    
    // ---------- State ----------
    var _idx = useState(tp.noteIndex || 0);
    var idx = _idx[0];
    var setIdx = _idx[1];
    
    var width = useWindowDimensions().width - 40;

    // ---------- Save Index ----------
    useEffect(function () {
        StudentStore.setNoteIndex(ders, konu, idx, notlar.length);
    }, [idx]);

    // ---------- Go to Test ----------
    function goToTest() {
        StudentStore.markNotesComplete(ders, konu);
        var packs = StudentStore.topicTestPacks(sorular.map(function (q, i) {
            var id = q.id != null ? q.id : i;
            return {
                ders: ders,
                konu: konu,
                q: q,
                id: id,
                qid: StudentStore.qid(ders, konu, id)
            };
        }));
        var pi = StudentStore.firstOpenPackIndex(StudentStore.getTopic(ders, konu), packs.length);
        var pack = packs[pi];
        if (!pack) {
            navigation.goBack();
            return;
        }
        navigation.replace("Test", {
            mode: "topic",
            ders: ders,
            konu: konu,
            testNo: pack.no,
            items: pack.items
        });
    }

    // ---------- Go Back ----------
    function goBack() {
        navigation.goBack();
    }

    // ============================================================
    // RENDER
    // ============================================================

    // Empty State
    if (!notlar.length) {
        return (
            <ScrollScreen dark={isDark}>
                <BackChip dark={isDark} label="Geri" onPress={goBack} />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={[styles.emptyTitle, isDark && styles.textLight]}>
                        Not Bulunamadı
                    </Text>
                    <Text style={[styles.emptyDesc, isDark && styles.textMuted]}>
                        Bu konu için henüz not eklenmemiş.
                    </Text>
                </View>
            </ScrollScreen>
        );
    }

    var html = rewriteHtmlMedia(String(notlar[idx] || ""));
    var isLast = idx === notlar.length - 1;

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <BackChip dark={isDark} label="Geri" onPress={goBack} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.dersName, isDark && styles.textMuted]}>
                        {DERS_ICON[ders] || "📚"} {ders}
                    </Text>
                    <Text style={[styles.konuName, isDark && styles.textLight]}>
                        {konu}
                    </Text>
                </View>
                <View style={styles.counter}>
                    <Text style={[styles.counterText, isDark && styles.textLight]}>
                        {idx + 1}/{notlar.length}
                    </Text>
                </View>
            </View>

            {/* Note Content */}
            <Card style={[styles.noteCard, isDark && styles.cardDark]}>
                <RenderHTML 
                    contentWidth={width} 
                    source={{ html: NOTE_SKIN + "<div class=\"note-html\">" + html + "</div>", baseUrl: "https://www.atanly.com/" }}
                    baseStyle={styles.noteContent}
                    tagsStyles={styles.tags}
                    renderers={{
                        img: function (p) {
                            return <NoteImage tnode={p.tnode} contentWidth={width} />;
                        }
                    }}
                />
            </Card>

            {/* Navigation */}
            <View style={styles.navRow}>
                <Pressable 
                    disabled={idx === 0} 
                    onPress={function () { setIdx(idx - 1); }}
                    unstable_pressDelay={0}
                    style={[styles.navBtn, idx === 0 && styles.navBtnDisabled]}
                >
                    <Text style={[styles.navBtnText, isDark && styles.textMuted]}>
                        ← Önceki
                    </Text>
                </Pressable>

                {isLast ? (
                    <Pressable 
                        onPress={sorular.length ? goToTest : goBack}
                        style={[styles.navBtn, styles.navBtnPrimary]}
                    >
                        <Text style={[styles.navBtnText, { color: "#fff" }]}>
                            {sorular.length ? "Teste Geç →" : "Konuyu Bitir"}
                        </Text>
                    </Pressable>
                ) : (
                    <Pressable 
                        onPress={function () { setIdx(idx + 1); }}
                        style={styles.navBtn}
                    >
                        <Text style={[styles.navBtnText, isDark && styles.textLight]}>
                            Sonraki →
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, isDark && { backgroundColor: colors.navyDeep }]}>
                    <View 
                        style={[
                            styles.progressFill,
                            { 
                                width: ((idx + 1) / notlar.length) * 100 + "%",
                                backgroundColor: isLast ? colors.emerald : colors.indigo
                            }
                        ]} 
                    />
                </View>
                <Text style={[styles.progressText, isDark && styles.textMuted]}>
                    %{Math.round(((idx + 1) / notlar.length) * 100)} tamamlandı
                </Text>
            </View>

            {/* Quick Test Button */}
            {!isLast && sorular.length > 0 && (
                <PrimaryButton 
                    title="Notları Bitirdim, Teste Geç" 
                    onPress={goToTest}
                    style={styles.testBtn}
                />
            )}
        </ScrollScreen>
    );
}

// ============================================================
// STILLER
// ============================================================

var styles = StyleSheet.create({
    // ---------- Text Helpers ----------
    textLight: {
        color: "#fff",
    },
    textMuted: {
        color: colors.muted,
    },

    // ---------- Card ----------
    cardDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },

    // ---------- Back ----------
    backText: {
        color: colors.muted,
        fontWeight: "600",
        fontSize: 13,
        marginBottom: 4,
    },

    // ---------- Header ----------
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8,
    },
    dersName: {
        color: colors.muted,
        fontSize: 13,
        marginBottom: 2,
    },
    konuName: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.navy,
    },
    counter: {
        backgroundColor: colors.indigo + "10",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.indigo + "20",
    },
    counterText: {
        fontWeight: "700",
        fontSize: 14,
        color: colors.indigo,
    },

    // ---------- Note Card ----------
    noteCard: {
        padding: 16,
        minHeight: 200,
        marginBottom: 12,
        overflow: "hidden",
    },
    noteContent: {
        fontSize: 16,
        lineHeight: 26,
        color: colors.text,
    },
    tags: {
        p: {
            fontSize: 16,
            lineHeight: 26,
            color: colors.text,
            marginBottom: 8,
        },
        strong: {
            fontWeight: "700",
            color: colors.indigo,
        },
        h1: {
            fontSize: 22,
            fontWeight: "700",
            color: colors.navy,
            marginVertical: 8,
        },
        h2: {
            fontSize: 19,
            fontWeight: "700",
            color: colors.navy,
            marginVertical: 6,
        },
        h3: {
            fontSize: 17,
            fontWeight: "700",
            color: colors.navy,
            marginVertical: 4,
        },
        ul: {
            paddingLeft: 20,
            marginVertical: 4,
        },
        li: {
            fontSize: 15,
            lineHeight: 24,
            color: colors.text,
            marginVertical: 2,
        },
        img: {
            width: "100%",
            marginVertical: 8,
            borderRadius: 12
        },
        blockquote: {
            borderLeftWidth: 4,
            borderLeftColor: colors.indigo,
            paddingLeft: 12,
            marginVertical: 8,
            fontStyle: "italic",
            color: colors.muted,
        },
    },

    // ---------- Navigation ----------
    navRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 12,
    },
    navBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    navBtnDisabled: {
        opacity: 0.3,
    },
    navBtnPrimary: {
        backgroundColor: colors.indigo,
        borderColor: colors.indigo,
    },
    navBtnText: {
        fontWeight: "600",
        fontSize: 14,
        color: colors.text,
    },

    // ---------- Progress ----------
    progressContainer: {
        marginTop: 4,
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        backgroundColor: "#F5F5F4",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 2,
    },
    progressText: {
        color: colors.muted,
        fontSize: 11,
        textAlign: "center",
        marginTop: 4,
    },

    // ---------- Test Button ----------
    testBtn: {
        marginTop: 4,
    },

    // ---------- Empty ----------
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
    },
    emptyDesc: {
        fontSize: 14,
        color: colors.muted,
        textAlign: "center",
        marginTop: 4,
    },
});