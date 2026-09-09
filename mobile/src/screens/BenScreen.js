import React, { useState } from "react";
import { Alert, Linking, Text, TextInput, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { supabase } from "../lib/supabase";
import { go } from "../nav";
import { Card, GhostButton, PrimaryButton, ScrollScreen, Badge, Tap, PageHeader, ThemeToggle } from "../ui";
import { colors, eduLabel, fmtExam, needsKulvar, getScoreLabel, trackLabel } from "../lib/theme";
import { KpssConfig } from "../lib/config";

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

    var _ref = useState(up.referredBy || "");
    var refCode = _ref[0];
    var setRefCode = _ref[1];
    
    var eduReq = up.educationChangeRequest;
    var showKulvar = needsKulvar(totQ === 0 && editing && draftEdu ? draftEdu : up.educationLevel);

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
        <ScrollScreen dark={isDark} noBottom>
            <PageHeader
                dark={isDark}
                title="Profil"
                subtitle={(up.email || "Hesap bağlı") + " · Ayarlar, araçlar ve plan burada."}
                right={
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <View style={styles.levelBadge}>
                            <Text style={[styles.levelText, { color: scoreLevel.color }]}>
                                {scoreLevel.text}
                            </Text>
                        </View>
                        <ThemeToggle dark={isDark} />
                    </View>
                }
            />

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, isDark && styles.cardDark]}>
                    <Text style={[styles.statNumber, { color: "#0F172A" }]}>{totQ}</Text>
                    <Text style={[styles.statLabel, isDark && styles.textMuted]}>Soru</Text>
                </View>
                <View style={[styles.statCard, isDark && styles.cardDark]}>
                    <Text style={[styles.statNumber, { color: "#0F172A" }]}>{overall}%</Text>
                    <Text style={[styles.statLabel, isDark && styles.textMuted]}>Net</Text>
                </View>
                <View style={[styles.statCard, isDark && styles.cardDark]}>
                    <Text style={[styles.statNumber, { color: "#D97706" }]}>{streak}</Text>
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
                        <Tap onPress={function () {
                            setDraftName(st.profile.name || "");
                            setDraftTrack(up.targetType || "B");
                            setDraftEdu(totQ === 0 ? (up.educationLevel || "lisans") : "");
                            setEditing(true);
                        }}>
                            <Text style={styles.editBtn}>Düzenle</Text>
                        </Tap>
                    )}
                </View>

                {eduReq && eduReq.status === "pending" && eduReq.to !== up.educationLevel && (
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
                        {needsKulvar(up.educationLevel) ? (
                            <InfoRow label="Kulvar" value={trackLabel(up.targetType || "B")} isDark={isDark} />
                        ) : null}
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
                                        <Tap 
                                            key={x} 
                                            onPress={function () { setDraftEdu(x); }} 
                                            style={[styles.eduBtn, isActive && styles.eduBtnActive]}
                                        >
                                            <Text style={[styles.eduBtnText, isActive && styles.eduBtnTextActive]}>
                                                {eduLabel(x)}
                                            </Text>
                                        </Tap>
                                    );
                                })}
                            </View>
                        ) : (
                            <View>
                                <Text style={[styles.eduCurrent, isDark && styles.textLight]}>
                                    {eduLabel(up.educationLevel)}
                                </Text>
                                <Text style={[styles.eduHint, isDark && styles.textMuted]}>
                                    Düzey değişimi yönetici onayı gerektirir. Sınav tarihi ÖSYM takvimine bağlanır.
                                </Text>
                                {(!eduReq || eduReq.status !== "pending") ? (
                                    <View style={[styles.eduRow, { marginTop: 8, flexWrap: "wrap" }]}>
                                        {["lisans", "onlisans", "ortaogretim"].filter(function (x) {
                                            return x !== up.educationLevel;
                                        }).map(function (x) {
                                            var isActive = draftEdu === x;
                                            return (
                                                <Tap
                                                    key={x}
                                                    onPress={function () { setDraftEdu(draftEdu === x ? "" : x); }}
                                                    style={[styles.eduBtn, isActive && styles.eduBtnActive]}
                                                >
                                                    <Text style={[styles.eduBtnText, isActive && styles.eduBtnTextActive]}>
                                                        {eduLabel(x)}
                                                    </Text>
                                                </Tap>
                                            );
                                        })}
                                    </View>
                                ) : null}
                            </View>
                        )}

                        {showKulvar ? (
                            <View>
                                <Text style={[styles.editLabel, isDark && styles.textMuted, { marginTop: 12 }]}>Kulvar</Text>
                                <View style={styles.eduRow}>
                                    {(KpssConfig.targetTypes || []).map(function (x) {
                                        var isActive = draftTrack === x.id;
                                        return (
                                            <Tap
                                                key={x.id}
                                                onPress={function () { setDraftTrack(x.id); }}
                                                style={[styles.eduBtn, isActive && styles.eduBtnActive]}
                                            >
                                                <Text style={[styles.eduBtnText, isActive && styles.eduBtnTextActive]} numberOfLines={1}>
                                                    {x.t.split(" · ")[0]}
                                                </Text>
                                            </Tap>
                                        );
                                    })}
                                </View>
                            </View>
                        ) : null}

                        <PrimaryButton title="Kaydet" onPress={save} style={styles.saveBtn} />
                        <GhostButton title="Vazgeç" onPress={function () { setEditing(false); }} style={styles.cancelBtn} />
                    </View>
                )}
            </Card>

            <Card dark={isDark} onPress={function () { go(navigation, "Leaderboard"); }}>
                <Text style={[styles.toolName, isDark && styles.textLight]}>Türkiye sıralaması</Text>
                <Text style={[styles.toolDesc, isDark && styles.textMuted]}>Haftalık soru sıralaması</Text>
            </Card>

            <Card style={[isDark && styles.cardDark]}>
                <View style={styles.premiumHeader}>
                    <Text style={[styles.premiumTitle, isDark && styles.textLight]}>Davet</Text>
                </View>
                <View style={styles.referralBox}>
                    <Text style={[styles.referralLabel, isDark && styles.textMuted]}>
                        Davet kodun
                    </Text>
                    <View style={[styles.referralCodeBox, isDark && { backgroundColor: colors.navyDeep }]}>
                        <Text style={[styles.referralCode, isDark && { color: colors.indigo }]}>
                            {StudentStore.ensureReferralCode() || "—"}
                        </Text>
                    </View>
                    <Text style={[styles.referralLabel, isDark && styles.textMuted, { marginTop: 10 }]}>
                        Arkadaş kodu
                    </Text>
                    <TextInput
                        value={refCode}
                        onChangeText={setRefCode}
                        onEndEditing={function () {
                            StudentStore.updateUserProfile({ referredBy: String(refCode || "").slice(0, 16) });
                            SyncEngine.sync();
                        }}
                        placeholder="Kod"
                        placeholderTextColor={colors.muted}
                        autoCapitalize="characters"
                        style={[styles.input, isDark && styles.inputDark]}
                    />
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
                            <View key={b.id} style={styles.badgeCol}>
                                <View style={[
                                    styles.badgeCircle,
                                    on && styles.badgeCircleOn,
                                    isDark && !on && { backgroundColor: colors.navyDeep, borderColor: "#334155" }
                                ]}>
                                    <Text style={[styles.badgeMark, on && styles.badgeMarkOn]}>{on ? "●" : "○"}</Text>
                                </View>
                                <Text style={[
                                    styles.badgeText,
                                    on && styles.badgeTextActive,
                                    isDark && !on && { color: colors.muted }
                                ]}>
                                    {b.title}
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
            <View style={styles.legalRow}>
                {[
                    ["KVKK Aydınlatma", "aydinlatma.html"],
                    ["Kullanım", "kullanim.html"],
                    ["Üyelik", "uyelik.html"],
                    ["Gizlilik", "gizlilik.html"],
                    ["Çerez", "cerez.html"],
                    ["KVKK başvuru", "basvuru.html"]
                ].map(function (row) {
                    return (
                        <Tap
                            key={row[1]}
                            onPress={function () {
                                Linking.openURL("https://www.atanly.com/yasal/" + row[1]);
                            }}
                        >
                            <Text style={[styles.legalLink, isDark && styles.textMuted]}>{row[0]}</Text>
                        </Tap>
                    );
                })}
            </View>
            <Text style={[styles.footer, isDark && styles.textMuted]}>
                Atanly
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
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    cardDark: {
        backgroundColor: "rgba(15, 23, 42, 0.78)",
        borderColor: "rgba(255,255,255,0.06)",
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
        color: "#D97706",
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
        gap: 8,
        marginTop: 8,
        justifyContent: "space-between",
    },
    badgeCol: {
        width: "23%",
        alignItems: "center",
        gap: 6,
    },
    badgeCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        alignItems: "center",
        justifyContent: "center",
    },
    badgeCircleOn: {
        backgroundColor: "#FEF3C7",
        borderColor: "#FDE68A",
    },
    badgeMark: {
        fontSize: 16,
        color: "#94A3B8",
    },
    badgeMarkOn: {
        color: "#92400E",
    },
    badgeText: {
        fontSize: 11,
        color: "#64748B",
        fontWeight: "600",
        textAlign: "center",
    },
    badgeTextActive: {
        color: "#92400E",
        fontWeight: "700",
    },

    // ---------- Danger ----------
    dangerBtn: {
        borderColor: colors.rose + "40",
        marginTop: 4,
    },

    // ---------- Footer ----------
    legalRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginTop: 12,
        marginBottom: 4,
    },
    legalLink: {
        fontSize: 11,
        color: colors.muted,
        textDecorationLine: "underline",
    },
    footer: {
        textAlign: "center",
        fontSize: 11,
        color: colors.muted,
        marginTop: 16,
        marginBottom: 8,
    },
});