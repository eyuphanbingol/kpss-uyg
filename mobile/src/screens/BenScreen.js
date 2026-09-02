import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { supabase } from "../lib/supabase";
import { go } from "../nav";
import { Card, GhostButton, PrimaryButton, ScrollScreen, Badge } from "../ui";
import { colors, eduLabel, fmtExam, needsKulvar, getScoreLabel } from "../lib/theme";

// ============================================================
// TOOLS
// ============================================================

var TOOLS = [
    { id: "Placement", t: "Puan / Tercih", d: "Tahmini puan ve kurum eşleşmesi" },
    { id: "Leaderboard", t: "Türkiye Sıralaması", d: "Haftalık liderlik tablosu" },
    { id: "Heat", t: "Isı Haritası", d: "30 günlük çalışma tempon" },
    { id: "Ai", t: "Soru Asistanı", d: "Yanlışlarını analiz et" },
    { id: "Live", t: "Canlı Deneme", d: "Haftalık ortak sınav" },
    { id: "Paywall", t: "Premium", d: "Plan ve davet kodu" }
];

// ============================================================
// BEN SCREEN
// ============================================================

export default function BenScreen({ navigation }) {
    var app = useApp();
    var st = app.student;
    var isDark = app.dark;

    // ---------- Stats ----------
    var totQ = 0, totC = 0;
    Object.keys(st.sessions || {}).forEach(function (d) {
        totQ += st.sessions[d].questions || 0;
        totC += st.sessions[d].correct || 0;
    });
    var overall = totQ ? Math.round((totC / totQ) * 100) : 0;
    var scoreLevel = getScoreLabel(overall);
    var up = st.userProfile || {};

    // ---------- State ----------
    var _edit = useState(false);
    var editing = _edit[0];
    var setEditing = _edit[1];
    
    var _name = useState(st.profile.name || "");
    var draftName = _name[0];
    var setDraftName = _name[1];
    
    var _track = useState(up.targetType || "B");
    var draftTrack = _track[0];
    var setDraftTrack = _track[1];
    
    var _edu = useState("");
    var draftEdu = _edu[0];
    var setDraftEdu = _edu[1];
    
    var eduReq = up.educationChangeRequest;

    // ---------- Streak ----------
    var streak = (st.streak && st.streak.count) || 0;

    // ---------- Save ----------
    function save() {
        var nextEdu = (totQ === 0 && draftEdu) ? draftEdu : up.educationLevel;
        StudentStore.updateProfile({ name: draftName });
        var patch = { nickname: draftName };
        patch.targetType = needsKulvar(nextEdu) ? draftTrack : "B";
        StudentStore.updateUserProfile(patch);
        
        var wantEdu = draftEdu && draftEdu !== up.educationLevel && (!eduReq || eduReq.status !== "pending") ? draftEdu : "";
        if (wantEdu) {
            if (totQ === 0) {
                StudentStore.setEducationLevel(wantEdu);
            } else {
                StudentStore.requestEducationChange(wantEdu);
                supabase.functions.invoke("admin-action", { body: { action: "submit_edu", to: wantEdu } });
            }
        }
        setEditing(false);
        SyncEngine.sync();
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <ScrollScreen dark={isDark}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, isDark && styles.textLight]}>
                        Profil
                    </Text>
                    <Text style={[styles.headerSub, isDark && styles.textMuted]}>
                        {up.email || "Hesap bağlı"}
                    </Text>
                </View>
                <View style={styles.levelBadge}>
                    <Text style={[styles.levelText, { color: scoreLevel.color }]}>
                        {scoreLevel.emoji} {scoreLevel.text}
                    </Text>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, isDark && styles.cardDark]}>
                    <Text style={[styles.statNumber, { color: colors.teal }]}>{totQ}</Text>
                    <Text style={[styles.statLabel, isDark && styles.textMuted]}>Soru</Text>
                </View>
                <View style={[styles.statCard, isDark && styles.cardDark]}>
                    <Text style={[styles.statNumber, { color: colors.teal }]}>{overall}%</Text>
                    <Text style={[styles.statLabel, isDark && styles.textMuted]}>Net</Text>
                </View>
                <View style={[styles.statCard, isDark && styles.cardDark]}>
                    <Text style={[styles.statNumber, { color: colors.amber }]}>{streak}</Text>
                    <Text style={[styles.statLabel, isDark && styles.textMuted]}>Seri</Text>
                </View>
            </View>

            {/* Settings Card */}
            <Card style={[isDark && styles.cardDark]}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, isDark && styles.textMuted]}>
                        Ayarlar
                    </Text>
                    {!editing && (
                        <Pressable onPress={function () {
                            setDraftName(st.profile.name || "");
                            setDraftTrack(up.targetType || "B");
                            setDraftEdu(totQ === 0 ? (up.educationLevel || "lisans") : "");
                            setEditing(true);
                        }}>
                            <Text style={styles.editBtn}>Düzenle</Text>
                        </Pressable>
                    )}
                </View>

                {eduReq && eduReq.status === "pending" && (
                    <View style={styles.pendingBox}>
                        <Text style={styles.pendingText}>
                            Eğitim değişikliği onay bekliyor: {eduLabel(eduReq.to)}
                        </Text>
                    </View>
                )}

                {!editing ? (
                    <View style={styles.infoGrid}>
                        <InfoRow label="Ad" value={st.profile.name || "—"} isDark={isDark} />
                        <InfoRow label="Eğitim" value={eduLabel(up.educationLevel)} isDark={isDark} />
                        <InfoRow label="Sınav Tarihi" value={fmtExam(st.profile.examDate)} isDark={isDark} />
                        {needsKulvar(up.educationLevel) && (
                            <InfoRow label="Kulvar" value={up.targetType || "B"} isDark={isDark} />
                        )}
                        <InfoRow label="Platform" value={app.platform || "Web"} isDark={isDark} />
                    </View>
                ) : (
                    <View style={styles.editForm}>
                        <Text style={[styles.editLabel, isDark && styles.textMuted]}>Ad</Text>
                        <TextInput 
                            value={draftName} 
                            onChangeText={setDraftName} 
                            style={[styles.input, isDark && styles.inputDark]} 
                            placeholder="Adınız"
                            placeholderTextColor={colors.muted}
                        />

                        <Text style={[styles.editLabel, isDark && styles.textMuted, { marginTop: 12 }]}>
                            Eğitim Düzeyi
                        </Text>
                        {totQ === 0 ? (
                            <View style={styles.eduRow}>
                                {["lisans", "onlisans", "ortaogretim"].map(function (x) {
                                    var isActive = (draftEdu || up.educationLevel) === x;
                                    return (
                                        <Pressable 
                                            key={x} 
                                            onPress={function () { setDraftEdu(x); }} 
                                            style={[styles.eduBtn, isActive && styles.eduBtnActive]}
                                        >
                                            <Text style={[styles.eduBtnText, isActive && styles.eduBtnTextActive]}>
                                                {eduLabel(x)}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ) : (
                            <View>
                                <Text style={[styles.eduCurrent, isDark && styles.textLight]}>
                                    {eduLabel(up.educationLevel)}
                                </Text>
                                <Text style={[styles.eduHint, isDark && styles.textMuted]}>
                                    Düzey değişimi yönetici onayı gerektirir
                                </Text>
                            </View>
                        )}

                        <PrimaryButton title="Kaydet" onPress={save} style={styles.saveBtn} />
                        <GhostButton title="Vazgeç" onPress={function () { setEditing(false); }} style={styles.cancelBtn} />
                    </View>
                )}
            </Card>

            {/* Tools Card */}
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.sectionTitle, isDark && styles.textMuted]}>
                    Araçlar
                </Text>
                <View style={styles.toolsGrid}>
                    {TOOLS.map(function (x) {
                        return (
                            <Pressable 
                                key={x.id} 
                                onPress={function () { go(navigation, x.id); }} 
                                style={styles.toolItem}
                            >
                                <Text style={[styles.toolName, isDark && styles.textLight]}>{x.t}</Text>
                                <Text style={[styles.toolDesc, isDark && styles.textMuted]}>{x.d}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Card>

            {/* Premium Card */}
            <Card style={[isDark && styles.cardDark, StudentStore.isPremium() && styles.premiumCard]}>
                <View style={styles.premiumHeader}>
                    <Text style={[styles.premiumTitle, StudentStore.isPremium() && { color: colors.gold }]}>
                        {StudentStore.isPremium() ? "Premium" : "Ücretsiz Plan"}
                    </Text>
                    {StudentStore.isPremium() && (
                        <Badge type="gold" title="Aktif" />
                    )}
                </View>
                <Text style={[styles.premiumDesc, isDark && styles.textMuted]}>
                    {StudentStore.isPremium() 
                        ? "Sınırsız deneme ve tüm özellikler" 
                        : "Sınırlı deneme, Premium'a yükselt"}
                </Text>
                <View style={styles.referralBox}>
                    <Text style={[styles.referralLabel, isDark && styles.textMuted]}>
                        Davet Kodun
                    </Text>
                    <View style={[styles.referralCodeBox, isDark && { backgroundColor: colors.navyDeep }]}>
                        <Text style={[styles.referralCode, isDark && { color: colors.indigo }]}>
                            {StudentStore.ensureReferralCode() || "—"}
                        </Text>
                    </View>
                </View>
            </Card>

            {/* Badges Card */}
            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.sectionTitle, isDark && styles.textMuted]}>
                    Rozetler
                </Text>
                <View style={styles.badgesRow}>
                    {[
                        { id: "firstDay", title: "İlk Çalışma" },
                        { id: "streak7", title: "7 Gün Seri" },
                        { id: "q1000", title: "1000 Soru" },
                        { id: "firstExam", title: "İlk Deneme" }
                    ].map(function (b) {
                        var on = st.achievements && st.achievements[b.id];
                        return (
                            <View key={b.id} style={[
                                styles.badgeItem,
                                on && styles.badgeItemActive,
                                isDark && !on && { backgroundColor: colors.navyDeep }
                            ]}>
                                <Text style={[
                                    styles.badgeText,
                                    on && styles.badgeTextActive,
                                    isDark && !on && { color: colors.muted }
                                ]}>
                                    {on ? "✓" : "○"} {b.title}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </Card>

            {/* Actions */}
            <GhostButton 
                title="Veri Silme Talebi" 
                onPress={function () {
                    Alert.alert(
                        "Veri Silme Talebi",
                        "Hesap silme talebi kaydedilir. Destek onayından sonra verileriniz silinir.",
                        [
                            { text: "Vazgeç", style: "cancel" },
                            { text: "Talep Et", style: "destructive", onPress: function () { StudentStore.requestDeletion(); } }
                        ]
                    );
                }} 
                style={styles.dangerBtn}
            />
            <GhostButton 
                title="Çıkış Yap" 
                onPress={app.signOut} 
                style={[styles.dangerBtn, { marginTop: 8 }]} 
            />

            {/* Footer */}
            <Text style={[styles.footer, isDark && styles.textMuted]}>
                Atanom v1.0 · {app.platform || "Web"}
            </Text>
        </ScrollScreen>
    );
}

// ============================================================
// INFO ROW
// ============================================================

function InfoRow({ label, value, isDark }) {
    return (
        <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isDark && styles.textMuted]}>{label}</Text>
            <Text style={[styles.infoValue, isDark && styles.textLight]}>{value}</Text>
        </View>
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

    // ---------- Header ----------
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: colors.navy,
    },
    headerSub: {
        color: colors.muted,
        fontSize: 13,
        marginTop: 2,
    },
    levelBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.04)",
    },
    levelText: {
        fontSize: 12,
        fontWeight: "600",
    },

    // ---------- Stats ----------
    statsRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "700",
    },
    statLabel: {
        color: colors.muted,
        fontSize: 11,
        marginTop: 2,
    },

    // ---------- Section ----------
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    editBtn: {
        color: colors.indigo,
        fontWeight: "600",
        fontSize: 13,
    },

    // ---------- Info Grid ----------
    infoGrid: {
        marginTop: 4,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F4",
    },
    infoLabel: {
        color: colors.muted,
        fontSize: 14,
    },
    infoValue: {
        fontWeight: "500",
        fontSize: 14,
        color: colors.text,
    },

    // ---------- Pending ----------
    pendingBox: {
        backgroundColor: colors.amber + "15",
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.amber + "30",
    },
    pendingText: {
        color: colors.amber,
        fontSize: 13,
        fontWeight: "500",
    },

    // ---------- Edit Form ----------
    editForm: {
        marginTop: 4,
    },
    editLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: colors.muted,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        backgroundColor: "#fff",
        color: colors.text,
    },
    inputDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
        color: "#fff",
    },
    eduRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    eduBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#F5F5F4",
        alignItems: "center",
    },
    eduBtnActive: {
        backgroundColor: colors.indigo,
    },
    eduBtnText: {
        fontSize: 11,
        fontWeight: "500",
        color: colors.text,
    },
    eduBtnTextActive: {
        color: "#fff",
    },
    eduCurrent: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.text,
    },
    eduHint: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 4,
    },
    saveBtn: {
        marginTop: 8,
    },
    cancelBtn: {
        marginTop: 8,
    },

    // ---------- Tools ----------
    toolsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 4,
    },
    toolItem: {
        width: "50%",
        paddingVertical: 6,
        paddingRight: 8,
    },
    toolName: {
        fontWeight: "600",
        fontSize: 13,
        color: colors.text,
    },
    toolDesc: {
        fontSize: 11,
        color: colors.muted,
        marginTop: 1,
    },

    // ---------- Premium ----------
    premiumCard: {
        borderColor: colors.gold,
        borderWidth: 1.5,
    },
    premiumHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    premiumTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },
    premiumDesc: {
        fontSize: 13,
        color: colors.muted,
        marginBottom: 8,
    },
    referralBox: {
        marginTop: 4,
    },
    referralLabel: {
        fontSize: 11,
        color: colors.muted,
        marginBottom: 4,
    },
    referralCodeBox: {
        backgroundColor: "#F5F5F4",
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
    },
    referralCode: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.indigo,
        letterSpacing: 1,
    },

    // ---------- Badges ----------
    badgesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 4,
    },
    badgeItem: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
        backgroundColor: "#F5F5F4",
    },
    badgeItemActive: {
        backgroundColor: "#ECFDF5",
    },
    badgeText: {
        fontSize: 12,
        color: colors.muted,
        fontWeight: "500",
    },
    badgeTextActive: {
        color: colors.emerald,
        fontWeight: "600",
    },

    // ---------- Danger ----------
    dangerBtn: {
        borderColor: colors.rose + "40",
        marginTop: 4,
    },

    // ---------- Footer ----------
    footer: {
        textAlign: "center",
        fontSize: 11,
        color: colors.muted,
        marginTop: 16,
        marginBottom: 8,
    },
});