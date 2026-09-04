import React, { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { ScoreEngine } from "../lib/scoreEngine";
import { StudentStore } from "../lib/store";
import { StudyPlanner } from "../lib/planner";
import { kpssData } from "../lib/catalog";
import { supabase } from "../lib/supabase";
import taban from "../content/tabanPuanlar.json";
import { Card, PrimaryButton, ScrollScreen, Badge } from "../ui";
import { colors } from "../lib/theme";

function stripChoicePrefix(opt) {
    return String(opt || "").replace(/^[A-Ea-e][\s\)\.:\-]+\s*/, "").trim();
}

// ============================================================
// PLACEMENT SCREEN
// ============================================================

export function PlacementScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var est = ScoreEngine.estimate(app.student);
    var level = (app.student.userProfile && app.student.userProfile.educationLevel) || "lisans";
    var rows = (taban.rows || []).filter(function (r) { return r.level === level; });
    var matches = ScoreEngine.matchPlacement(est.score, rows);
    var isPremium = StudentStore.isPremium();
    
    if (!isPremium) matches = matches.slice(0, 3);

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>Puan / Tercih</Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    Tahmini puan ve kurum eşleşmesi
                </Text>
            </View>

            {/* Score */}
            <View style={[styles.scoreContainer, isDark && styles.scoreContainerDark]}>
                <Text style={styles.scoreLabel}>Tahmini Puan</Text>
                <Text style={[styles.scoreValue, isDark && styles.textLight]}>{est.score}</Text>
                <Text style={[styles.scoreNote, isDark && styles.textMuted]}>{est.note}</Text>
            </View>

            {/* Matches */}
            {matches.length > 0 ? (
                <View>
                    <Text style={[styles.matchesLabel, isDark && styles.textMuted]}>
                        Eşleşen Kurumlar ({matches.length})
                    </Text>
                    {matches.map(function (r, i) {
                        var diff = Number(est.score) - Number(r.taban);
                        var isSafe = diff >= 4;
                        var isBorder = diff >= 0 && diff < 4;
                        
                        return (
                            <Card key={i} style={[
                                styles.matchCard,
                                isSafe && styles.matchCardSafe,
                                isBorder && styles.matchCardBorder,
                                isDark && styles.cardDark
                            ]}>
                                <View style={styles.matchRow}>
                                    <View style={styles.matchInfo}>
                                        <Text style={[styles.matchName, isDark && styles.textLight]}>
                                            {r.kurum}
                                        </Text>
                                        <Text style={[styles.matchDetail, isDark && styles.textMuted]}>
                                            {r.unvan} · {r.il}
                                        </Text>
                                    </View>
                                    <View style={styles.matchRight}>
                                        <Text style={[styles.matchTaban, isDark && styles.textMuted]}>
                                            {r.taban}
                                        </Text>
                                        <Badge 
                                            type={isSafe ? "success" : isBorder ? "warning" : "danger"}
                                            title={isSafe ? "✅ Güvenli" : isBorder ? "⚠️ Sınırda" : "❌ Riskli"}
                                        />
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                </View>
            ) : (
                <Card style={[styles.emptyCard, isDark && styles.cardDark]}>
                    <Text style={[styles.emptyText, isDark && styles.textMuted]}>
                        Bu skor için eşleşen kurum bulunamadı.
                    </Text>
                </Card>
            )}

            {/* Premium Upgrade */}
            {!isPremium && matches.length >= 3 && (
                <PrimaryButton 
                    title="Tüm Liste için Premium" 
                    onPress={function () { navigation.navigate("Paywall"); }} 
                    style={styles.upgradeBtn}
                />
            )}

            {/* Note */}
            <Text style={[styles.footerNote, isDark && styles.textMuted]}>
                {taban.note}
            </Text>
        </ScrollScreen>
    );
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
        supabase.from("leaderboard_weekly")
            .select("nickname,questions")
            .order("questions", { ascending: false })
            .limit(50)
            .then(function (r) {
                if (r.error) setErr(r.error.message);
                else setRows(r.data || []);
                setLoading(false);
            });
    }, []);

    var top3 = rows.slice(0, 3);
    var rest = rows.slice(3);

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>Türkiye Sıralaması</Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    Bu haftanın en çalışkanları
                </Text>
            </View>

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
// HEAT SCREEN
// ============================================================

export function HeatScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var sessions = app.student.sessions || {};
    var today = StudentStore.todayStr();
    var cells = [];
    var i;
    for (i = 34; i >= 0; i--) {
        var iso = StudentStore.addDays(today, -i);
        cells.push({ iso: iso, q: (sessions[iso] && sessions[iso].questions) || 0 });
    }

    var maxQ = Math.max(1, ...cells.map(function (c) { return c.q; }));

    function getHeatColor(q) {
        if (q === 0) return "#F5F5F4";
        var ratio = q / maxQ;
        if (ratio < 0.25) return "#FED7AA";
        if (ratio < 0.5) return "#FB923C";
        if (ratio < 0.75) return "#EA580C";
        return "#C2410C";
    }

    var totalQ = cells.reduce(function (sum, c) { return sum + c.q; }, 0);
    var activeDays = cells.filter(function (c) { return c.q > 0; }).length;

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>Isı Haritası</Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    30 günlük çalışma tempon
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.heatStats}>
                <View style={styles.heatStat}>
                    <Text style={[styles.heatStatValue, isDark && styles.textLight]}>
                        {activeDays}
                    </Text>
                    <Text style={[styles.heatStatLabel, isDark && styles.textMuted]}>
                        Aktif Gün
                    </Text>
                </View>
                <View style={styles.heatStatDivider} />
                <View style={styles.heatStat}>
                    <Text style={[styles.heatStatValue, isDark && styles.textLight]}>
                        {totalQ}
                    </Text>
                    <Text style={[styles.heatStatLabel, isDark && styles.textMuted]}>
                        Toplam Soru
                    </Text>
                </View>
                <View style={styles.heatStatDivider} />
                <View style={styles.heatStat}>
                    <Text style={[styles.heatStatValue, isDark && styles.textLight]}>
                        {activeDays > 0 ? Math.round(totalQ / activeDays) : 0}
                    </Text>
                    <Text style={[styles.heatStatLabel, isDark && styles.textMuted]}>
                        Günlük Ort.
                    </Text>
                </View>
            </View>

            {/* Heatmap Grid */}
            <Card style={[styles.heatCard, isDark && styles.cardDark]}>
                <View style={styles.heatGrid}>
                    {cells.map(function (c) {
                        return (
                            <View 
                                key={c.iso} 
                                style={[
                                    styles.heatCell,
                                    { backgroundColor: getHeatColor(c.q) }
                                ]} 
                            />
                        );
                    })}
                </View>
                <View style={styles.heatLegend}>
                    <Text style={[styles.heatLegendText, isDark && styles.textMuted]}>Az</Text>
                    <View style={styles.heatLegendBar}>
                        <View style={[styles.heatLegendDot, { backgroundColor: "#F5F5F4" }]} />
                        <View style={[styles.heatLegendDot, { backgroundColor: "#FED7AA" }]} />
                        <View style={[styles.heatLegendDot, { backgroundColor: "#FB923C" }]} />
                        <View style={[styles.heatLegendDot, { backgroundColor: "#EA580C" }]} />
                        <View style={[styles.heatLegendDot, { backgroundColor: "#C2410C" }]} />
                    </View>
                    <Text style={[styles.heatLegendText, isDark && styles.textMuted]}>Çok</Text>
                </View>
            </Card>
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
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>Soru Asistanı</Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    Yanlışlarını analiz et
                </Text>
            </View>

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
// LIVE SCREEN
// ============================================================

export function LiveScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>Canlı Deneme</Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    Cumartesi 21:00 ortak saat
                </Text>
            </View>

            <Card style={[styles.liveCard, isDark && styles.cardDark]}>
                <View style={styles.liveHeader}>
                    <View style={styles.liveDot} />
                    <Text style={[styles.liveStatus, isDark && styles.textMuted]}>
                        Hazırlanıyor
                    </Text>
                </View>
                <Text style={[styles.liveTitle, isDark && styles.textLight]}>
                    🚀 Cumartesi 21:00
                </Text>
                <Text style={[styles.liveDesc, isDark && styles.textMuted]}>
                    Her hafta aynı saatte, herkesle birlikte.
                    Kaçırdıysan şimdi de çözebilirsin.
                </Text>
            </Card>

            <PrimaryButton 
                title="Şimdi Denemeyi Çöz" 
                onPress={function () {
                    var items = StudyPlanner.mixedQuiz(
                        kpssData, 
                        ["Tarih", "Coğrafya", "Türkçe", "Vatandaşlık", "Güncel Bilgiler"], 
                        40
                    );
                    navigation.navigate("Test", { mode: "exam", items: items, seconds: 40 * 60 });
                }} 
            />
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
                <Pressable onPress={function () { navigation.goBack(); }}>
                    <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
                </Pressable>
                <View style={styles.header}>
                    <Text style={[styles.title, isDark && styles.textLight]}>Tüm özellikler açık</Text>
                    <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                        Abonelik şimdilik yok; deneme ve tercih listesi sınırlı değil.
                    </Text>
                </View>
            </ScrollScreen>
        );
    }

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>Premium</Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    Tüm özelliklerin kilidini aç
                </Text>
            </View>

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

    // ---------- Back ----------
    backText: {
        color: colors.muted,
        fontWeight: "600",
        fontSize: 13,
        marginBottom: 4,
    },

    // ---------- Header ----------
    header: {
        marginVertical: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.navy,
    },
    subtitle: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },

    // ---------- Placement ----------
    scoreContainer: {
        backgroundColor: colors.indigo + "10",
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.indigo + "30",
    },
    scoreContainerDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: "800",
        color: colors.indigo,
        marginTop: 4,
    },
    scoreNote: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 4,
        textAlign: "center",
    },
    matchesLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.muted,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    matchCard: {
        marginBottom: 6,
    },
    matchCardSafe: {
        borderColor: colors.emerald,
        borderWidth: 1,
    },
    matchCardBorder: {
        borderColor: colors.amber,
        borderWidth: 1,
    },
    matchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    matchInfo: {
        flex: 1,
        paddingRight: 8,
    },
    matchName: {
        fontWeight: "700",
        fontSize: 14,
        color: colors.text,
    },
    matchDetail: {
        color: colors.muted,
        fontSize: 12,
        marginTop: 1,
    },
    matchRight: {
        alignItems: "flex-end",
        gap: 4,
    },
    matchTaban: {
        color: colors.muted,
        fontSize: 12,
    },
    upgradeBtn: {
        marginTop: 8,
    },
    footerNote: {
        fontSize: 11,
        color: colors.muted,
        marginTop: 8,
        textAlign: "center",
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

    // ---------- Heat ----------
    heatStats: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    heatStat: {
        flex: 1,
        alignItems: "center",
    },
    heatStatValue: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
    },
    heatStatLabel: {
        color: colors.muted,
        fontSize: 11,
        marginTop: 2,
    },
    heatStatDivider: {
        width: 1,
        height: 32,
        backgroundColor: colors.border,
    },
    heatCard: {
        padding: 12,
    },
    heatGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    heatCell: {
        width: 18,
        height: 18,
        margin: 2,
        borderRadius: 4,
    },
    heatLegend: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        gap: 6,
    },
    heatLegendText: {
        fontSize: 10,
        color: colors.muted,
    },
    heatLegendBar: {
        flexDirection: "row",
        gap: 3,
    },
    heatLegendDot: {
        width: 14,
        height: 14,
        borderRadius: 4,
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

    // ---------- Live ----------
    liveCard: {
        padding: 18,
        marginBottom: 16,
    },
    liveHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.amber,
    },
    liveStatus: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "500",
    },
    liveTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 4,
    },
    liveDesc: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 18,
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