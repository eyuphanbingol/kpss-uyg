import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, useWindowDimensions, View, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { PrimaryButton, ScrollScreen, Card } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";

// ============================================================
// NOTES SCREEN
// ============================================================

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
        navigation.replace("Test", {
            mode: "topic",
            ders: ders,
            konu: konu,
            items: sorular.map(function (q, i) {
                var id = q.id != null ? q.id : i;
                return {
                    ders: ders,
                    konu: konu,
                    q: q,
                    id: id,
                    qid: StudentStore.qid(ders, konu, id)
                };
            })
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
                <Pressable onPress={goBack}>
                    <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
                </Pressable>
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

    var html = String(notlar[idx] || "");
    var isLast = idx === notlar.length - 1;

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <Pressable onPress={goBack}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

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
                    source={{ html: html }}
                    baseStyle={styles.noteContent}
                    tagsStyles={styles.tags}
                />
            </Card>

            {/* Navigation */}
            <View style={styles.navRow}>
                <Pressable 
                    disabled={idx === 0} 
                    onPress={function () { setIdx(idx - 1); }}
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