import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { trError } from "../lib/trError";
import { Card, PrimaryButton, ScrollScreen, Badge, PageHeader } from "../ui";
import { colors } from "../lib/theme";
import { questionImages } from "../lib/media";
import { ZoomableImage } from "../components/ZoomableImage";
export { HeatScreen } from "./HeatScreen";
export { PlacementScreen } from "./PlacementScreen";

function stripChoicePrefix(opt) {
    return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
}

// ============================================================
// LEADERBOARD SCREEN
// ============================================================

export function LeaderboardScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var _rows = useState([]);
    var rows = _rows[0];
    var setRows = _rows[1];
    var _err = useState("");
    var err = _err[0];
    var setErr = _err[1];
    var _loading = useState(true);
    var loading = _loading[0];
    var setLoading = _loading[1];

    useEffect(function () {
        supabase.from("leaderboard_public")
            .select("nickname,questions,kind")
            .limit(200)
            .then(function (r) {
                if (r.error) setErr(trError(r.error, "Sıralama yüklenemedi."));
                else {
                    var list = (r.data || []).filter(function (x) { return x.kind !== "exam"; });
                    list.sort(function (a, b) {
                        return (Number(b.questions) || 0) - (Number(a.questions) || 0);
                    });
                    setRows(list.slice(0, 50));
                }
                setLoading(false);
            });
    }, []);

    var top3 = rows.slice(0, 3);
    var rest = rows.slice(3);

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <PageHeader dark={isDark} title="Türkiye Sıralaması" subtitle="En çok doğru çözenler" onBack={function () { navigation.goBack(); }} right={null} />

            {/* Error */}
            {err ? (
                <Text style={[styles.errorText, isDark && styles.textMuted]}>{err}</Text>
            ) : null}

            {/* Loading */}
            {loading && (
                <Card style={[styles.loadingCard, isDark && styles.cardDark]}>
                    <Text style={[styles.loadingText, isDark && styles.textMuted]}>
                        Yükleniyor...
                    </Text>
                </Card>
            )}

            {/* Top 3 Podium */}
            {!loading && top3.length > 0 && (
                <View style={styles.podium}>
                    {top3.map(function (r, i) {
                        var medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
                        var colors_podium = i === 0 ? styles.podiumGold : i === 1 ? styles.podiumSilver : styles.podiumBronze;
                        return (
                            <View key={i} style={[styles.podiumItem, i === 0 && styles.podiumFirst]}>
                                <View style={[styles.podiumAvatar, colors_podium]}>
                                    <Text style={styles.podiumMedal}>{medal}</Text>
                                </View>
                                <Text style={[styles.podiumName, isDark && styles.textLight]} numberOfLines={1}>
                                    {r.nickname}
                                </Text>
                                <Text style={[styles.podiumScore, isDark && styles.textLight]}>
                                    {r.questions}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}

            {/* Rest List */}
            {!loading && rest.length > 0 && (
                <Card style={[styles.listCard, isDark && styles.cardDark]}>
                    {rest.map(function (r, i) {
                        var rank = i + 4;
                        return (
                            <View key={i} style={[
                                styles.listRow,
                                i < rest.length - 1 && styles.listRowBorder,
                                isDark && { borderBottomColor: colors.muted }
                            ]}>
                                <Text style={[styles.listRank, isDark && styles.textMuted]}>
                                    {rank}
                                </Text>
                                <Text style={[styles.listName, isDark && styles.textLight]}>
                                    {r.nickname}
                                </Text>
                                <Text style={[styles.listScore, isDark && styles.textLight]}>
                                    {r.questions}
                                </Text>
                            </View>
                        );
                    })}
                </Card>
            )}

            {/* Empty */}
            {!loading && rows.length === 0 && !err && (
                <Card style={[styles.emptyCard, isDark && styles.cardDark]}>
                    <Text style={[styles.emptyText, isDark && styles.textMuted]}>
                        Henüz sıralama verisi yok.
                    </Text>
                </Card>
            )}
        </ScrollScreen>
    );
}

// ============================================================
// AI SCREEN
// ============================================================

export function AiScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var wrong = app.plan.wrong || [];
    var item = wrong[0];

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <PageHeader dark={isDark} title="Soru Asistanı" subtitle="Yanlışlarını analiz et" onBack={function () { navigation.goBack(); }} right={null} />

            {!item ? (
                <Card style={[styles.emptyCard, isDark && styles.cardDark]}>
                    <Text style={styles.emptyIcon}>🧠</Text>
                    <Text style={[styles.emptyTitle, isDark && styles.textLight]}>
                        Yanlış Defteri Boş
                    </Text>
                    <Text style={[styles.emptyDesc, isDark && styles.textMuted]}>
                        Önce soru çöz, yanlışlarını analiz edelim.
                    </Text>
                </Card>
            ) : (
                <Card style={[isDark && styles.cardDark]}>
                    <View style={styles.aiHeader}>
                        <Badge type="warning" title="Yanlış Soru" />
                        <Text style={[styles.aiQuestion, isDark && styles.textLight]}>
                            {item.q.question}
                        </Text>
                        {questionImages(item.q).map(function (uri, gi) {
                            return <View key={uri + gi} style={{ marginTop: 10 }}><ZoomableImage uri={uri} dark={isDark} /></View>;
                        })}
                    </View>
                    <View style={styles.aiCorrect}>
                        <Text style={styles.aiCorrectLabel}>✅ Doğru Cevap</Text>
                        <Text style={[styles.aiCorrectValue, isDark && styles.textLight]}>
                            {stripChoicePrefix(item.q.options[item.q.correctAnswerIndex])}
                        </Text>
                    </View>
                    {item.q.explanation && (
                        <View style={styles.aiExplanation}>
                            <Text style={[styles.aiExplanationLabel, isDark && styles.textMuted]}>
                                💡 Çözüm Notu
                            </Text>
                            <Text style={[styles.aiExplanationText, isDark && styles.textLight]}>
                                {item.q.explanation}
                            </Text>
                        </View>
                    )}
                </Card>
            )}

            {wrong.length > 1 && (
                <Text style={[styles.aiCount, isDark && styles.textMuted]}>
                    {wrong.length - 1} soru daha yanlış defterinde
                </Text>
            )}
        </ScrollScreen>
    );
}

// ============================================================
// PAYWALL SCREEN
// ============================================================

export function PaywallScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var isPremium = StudentStore.isPremium();

    if (!StudentStore.premiumOfferEnabled()) {
        return (
            <ScrollScreen dark={isDark}>
                <PageHeader dark={isDark} title="Tüm özellikler açık" subtitle="Abonelik şimdilik yok; deneme ve tercih listesi sınırlı değil." onBack={function () { navigation.goBack(); }} right={null} />
            </ScrollScreen>
        );
    }

    return (
        <ScrollScreen dark={isDark}>
            <PageHeader dark={isDark} title="Premium" subtitle="Tüm özelliklerin kilidini aç" onBack={function () { navigation.goBack(); }} right={null} />

            {isPremium ? (
                <Card style={[styles.premiumActiveCard, isDark && styles.cardDark]}>
                    <Text style={styles.premiumActiveIcon}>⭐</Text>
                    <Text style={[styles.premiumActiveTitle, isDark && styles.textLight]}>
                        Premium Aktif
                    </Text>
                    <Text style={[styles.premiumActiveDesc, isDark && styles.textMuted]}>
                        Sınırsız deneme ve tüm özellikler kullanımda.
                    </Text>
                </Card>
            ) : (
                <Card style={[styles.premiumCard, isDark && styles.cardDark]}>
                    <Text style={styles.premiumPrice}>149 ₺</Text>
                    <Text style={[styles.premiumPeriod, isDark && styles.textMuted]}>/ ay</Text>
                    <View style={styles.premiumFeatures}>
                        <Text style={[styles.premiumFeature, isDark && styles.textLight]}>
                            ✅ Sınırsız deneme
                        </Text>
                        <Text style={[styles.premiumFeature, isDark && styles.textLight]}>
                            ✅ Tam tercih listesi
                        </Text>
                        <Text style={[styles.premiumFeature, isDark && styles.textLight]}>
                            ✅ Detaylı analiz
                        </Text>
                        <Text style={[styles.premiumFeature, isDark && styles.textLight]}>
                            ✅ Reklamsız çalışma
                        </Text>
                    </View>
                    <PrimaryButton 
                        title="7 Günlük Deneme Aç" 
                        onPress={function () {
                            StudentStore.grantMockPremium(7);
                            navigation.goBack();
                        }} 
                    />
                    <Text style={[styles.premiumNote, isDark && styles.textMuted]}>
                        💳 Ödeme şimdilik test modunda
                    </Text>
                </Card>
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

    // ---------- Leaderboard ----------
    errorText: {
        color: colors.rose,
        textAlign: "center",
        marginVertical: 12,
    },
    loadingCard: {
        padding: 20,
        alignItems: "center",
    },
    loadingText: {
        color: colors.muted,
    },
    podium: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    podiumItem: {
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 4,
    },
    podiumFirst: {
        flex: 1.2,
    },
    podiumAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    podiumGold: {
        backgroundColor: "#FCD34D",
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    podiumSilver: {
        backgroundColor: "#E5E7EB",
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    podiumBronze: {
        backgroundColor: "#FDE68A",
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    podiumMedal: {
        fontSize: 22,
    },
    podiumName: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.text,
        textAlign: "center",
    },
    podiumScore: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text,
    },
    listCard: {
        paddingHorizontal: 4,
    },
    listRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F4",
    },
    listRank: {
        width: 28,
        fontWeight: "700",
        fontSize: 13,
        color: colors.muted,
    },
    listName: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },
    listScore: {
        fontWeight: "700",
        fontSize: 14,
        color: colors.text,
    },

    // ---------- AI ----------
    aiHeader: {
        marginBottom: 12,
    },
    aiQuestion: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginTop: 8,
        lineHeight: 22,
    },
    aiCorrect: {
        backgroundColor: colors.emerald + "10",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.emerald + "30",
        marginBottom: 12,
    },
    aiCorrectLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.muted,
    },
    aiCorrectValue: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.emerald,
        marginTop: 2,
    },
    aiExplanation: {
        backgroundColor: colors.indigo + "08",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.indigo + "20",
    },
    aiExplanationLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.muted,
    },
    aiExplanationText: {
        fontSize: 14,
        color: colors.text,
        marginTop: 4,
        lineHeight: 20,
    },
    aiCount: {
        textAlign: "center",
        color: colors.muted,
        fontSize: 12,
        marginTop: 8,
    },

    // ---------- Paywall ----------
    premiumActiveCard: {
        alignItems: "center",
        paddingVertical: 24,
    },
    premiumActiveIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    premiumActiveTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },
    premiumActiveDesc: {
        color: colors.muted,
        fontSize: 13,
        textAlign: "center",
        marginTop: 4,
    },
    premiumCard: {
        padding: 20,
        alignItems: "center",
    },
    premiumPrice: {
        fontSize: 40,
        fontWeight: "800",
        color: colors.indigo,
    },
    premiumPeriod: {
        fontSize: 14,
        color: colors.muted,
        marginTop: 2,
    },
    premiumFeatures: {
        marginVertical: 16,
        gap: 6,
        alignSelf: "flex-start",
        width: "100%",
    },
    premiumFeature: {
        fontSize: 14,
        color: colors.text,
        paddingVertical: 2,
    },
    premiumNote: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 8,
        textAlign: "center",
    },

    // ---------- Empty ----------
    emptyCard: {
        alignItems: "center",
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
    },
    emptyDesc: {
        fontSize: 13,
        color: colors.muted,
        textAlign: "center",
        marginTop: 4,
    },
    emptyText: {
        color: colors.muted,
        fontSize: 14,
        textAlign: "center",
    },
});