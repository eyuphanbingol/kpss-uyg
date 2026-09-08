import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { PrimaryButton, ScrollScreen, Card, BackChip, Tap } from "../ui";
import { colors, DERS_ICON } from "../lib/theme";

// ============================================================
// PROGRAM SCREEN
// ============================================================

export default function ProgramScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var kpssData = app.kpssData;
    var dersKeys = Object.keys(kpssData);
    var saved = (app.student.userProfile && app.student.userProfile.studyPlan) || null;
    
    var _draft = useState(function () { return StudentStore.cloneStudyPlan(saved); });
    var draft = _draft[0];
    var setDraft = _draft[1];
    
    var _edit = useState(StudentStore.planDayId());
    var editDay = _edit[0];
    var setEditDay = _edit[1];
    var days = StudentStore.WEEK_DAYS;
    var DERS_ACCENT = { "Tarih": "#ea580c", "Coğrafya": "#059669", "Türkçe": "#2563eb", "Vatandaşlık": "#7c3aed", "Güncel Bilgiler": "#db2777" };

    // ---------- Helpers ----------
    function patchDay(id, fn) {
        setDraft(function (prev) {
            var next = StudentStore.cloneStudyPlan(prev);
            next.days[id] = Object.assign({ on: false, slots: [] }, next.days[id]);
            fn(next.days[id]);
            return next;
        });
    }

    function toggleDay(id) {
        patchDay(id, function (day) {
            day.on = !day.on;
        });
    }

    function removeSlot(dayId, ders) {
        patchDay(dayId, function (day) {
            day.slots = day.slots.filter(function (x) { return x.ders !== ders; });
        });
    }

    function addSlot(dayId, ders) {
        patchDay(dayId, function (day) {
            day.on = true;
            day.slots.push({ ders: ders, hours: 1 });
        });
    }

    function moveSlot(dayId, from, dir) {
        patchDay(dayId, function (day) {
            var slots = (day.slots || []).slice();
            var to = from + dir;
            if (to < 0 || to >= slots.length) return;
            var item = slots.splice(from, 1)[0];
            slots.splice(to, 0, item);
            day.slots = slots;
        });
    }

    function getDayTotal(day) {
        var total = 0;
        (day.slots || []).forEach(function (s) {
            total += s.hours || 0;
        });
        return total;
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <ScrollScreen dark={isDark}>
            {/* Back */}
            <BackChip dark={isDark} label="Geri" onPress={function () { navigation.goBack(); }} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>
                    Çalışma Programı
                </Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    Her güne ders ve saat ekle
                </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} delaysContentTouches={false} keyboardShouldPersistTaps="always" style={{ marginBottom: 10 }} contentContainerStyle={{ gap: 8 }}>
                {[
                    { id: "yogun", t: "Yoğun" },
                    { id: "hafif", t: "Hafif" },
                    { id: "haftasonu", t: "Hafta sonu" }
                ].map(function (p) {
                    return (
                        <Tap key={p.id} onPress={function () { setDraft(StudentStore.applyPlanPreset(p.id, dersKeys)); }}
                            style={[styles.addBtn, { marginRight: 6 }]}>
                            <Text style={styles.addBtnText}>{p.t}</Text>
                        </Tap>
                    );
                })}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} delaysContentTouches={false} keyboardShouldPersistTaps="always" style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
                {days.map(function (w) {
                    var d = draft.days[w.id];
                    var sel = editDay === w.id;
                    return (
                        <Tap key={w.id} onPress={function () { setEditDay(w.id); }}
                            style={[styles.dayChip, sel && styles.dayChipOn, d.on && styles.dayChipActive]}>
                            <Text style={[styles.dayName, { fontSize: 13 }, isDark && styles.textLight]}>{w.short}</Text>
                            <Text style={[styles.dayTotal, { fontSize: 10 }]}>{d.on && getDayTotal(d) ? getDayTotal(d) + " sa" : "—"}</Text>
                        </Tap>
                    );
                })}
            </ScrollView>
            {function () {
                var w = days.filter(function (x) { return x.id === editDay; })[0] || days[0];
                var d = draft.days[w.id];
                var isActive = !!d.on;
                var availableDers = dersKeys.filter(function (k) {
                    return !(d.slots || []).some(function (s) { return s.ders === k; });
                });
                return (
                    <Card style={[styles.dayCard, isActive && styles.dayCardActive, isDark && styles.cardDark]}>
                        <Tap onPress={function () { toggleDay(w.id); }} style={styles.dayHeader}>
                            <View style={styles.dayLeft}>
                                <Text style={[styles.dayCheck, isActive && styles.dayCheckActive]}>{isActive ? "✓" : "○"}</Text>
                                <Text style={[styles.dayName, isDark && styles.textLight]}>{w.full}</Text>
                            </View>
                            {isActive && getDayTotal(d) > 0 ? (
                                <Text style={[styles.dayTotal, isDark && styles.textMuted]}>{getDayTotal(d)} sa</Text>
                            ) : (
                                <Text style={[styles.dayTotal, isDark && styles.textMuted]}>dinlenme</Text>
                            )}
                        </Tap>
                        {isActive && (d.slots || []).map(function (s, si) {
                            var hourText = s.hours === 0.5 ? "30 dk" : s.hours + " sa";
                            return (
                                <View key={s.ders} style={[styles.slotRow, { borderLeftWidth: 4, borderLeftColor: DERS_ACCENT[s.ders] || colors.indigo }]}>
                                    <Tap onPress={function () { moveSlot(w.id, si, -1); }}><Text style={styles.slotHour}>↑</Text></Tap>
                                    <Tap onPress={function () { moveSlot(w.id, si, 1); }}><Text style={styles.slotHour}>↓</Text></Tap>
                                    <View style={styles.slotLeft}>
                                        <Text style={[styles.slotText, isDark && styles.textLight]}>{(DERS_ICON[s.ders] || "📚") + " " + s.ders}</Text>
                                        <Text style={[styles.slotHour, isDark && styles.textMuted]}>{hourText}</Text>
                                    </View>
                                    <Tap onPress={function () { removeSlot(w.id, s.ders); }} style={styles.slotRemove}>
                                        <Text style={styles.slotRemoveText}>✕</Text>
                                    </Tap>
                                </View>
                            );
                        })}
                        {isActive && availableDers.length > 0 ? (
                            <View style={styles.addRow}>
                                {availableDers.slice(0, 5).map(function (k) {
                                    return (
                                        <Tap key={k} onPress={function () { addSlot(w.id, k); }}
                                            style={[styles.addBtn, isDark && styles.addBtnDark]}>
                                            <Text style={[styles.addBtnText, isDark && { color: colors.indigo }]}>+ {k}</Text>
                                        </Tap>
                                    );
                                })}
                            </View>
                        ) : null}
                    </Card>
                );
            }()}

            {/* Save Button */}
            <PrimaryButton 
                title="Programı Kaydet" 
                onPress={function () {
                    StudentStore.saveStudyPlan(draft);
                    navigation.goBack();
                }} 
                style={styles.saveBtn}
            />

            {/* Footer */}
            <Text style={[styles.footer, isDark && styles.textMuted]}>
                Haftalık programını belirle, her gün ne çalışacağını planla.
            </Text>
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

    // ---------- Day Card ----------
    dayCard: {
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dayCardActive: {
        borderColor: colors.indigo,
        borderWidth: 1.5,
    },
    dayHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dayLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    dayCheck: {
        fontSize: 16,
        color: colors.muted,
    },
    dayCheckActive: {
        color: colors.indigo,
        fontWeight: "700",
    },
    dayName: {
        fontWeight: "600",
        fontSize: 15,
        color: colors.text,
    },
    dayTotal: {
        color: colors.muted,
        fontSize: 12,
        fontWeight: "500",
    },
    dayChip: {
        minWidth: 52,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E7E5E4",
        backgroundColor: "#FAFAF9",
        alignItems: "center",
        marginRight: 6
    },
    dayChipOn: {
        borderColor: colors.indigo,
        backgroundColor: "#fff"
    },
    dayChipActive: {
        backgroundColor: "#ECFDF5"
    },

    // ---------- Slot ----------
    slotRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        marginLeft: 0,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: "#F5F5F4",
        borderRadius: 8,
    },
    slotLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    slotDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.indigo,
    },
    slotText: {
        fontSize: 13,
        color: colors.text,
    },
    slotHour: {
        fontSize: 12,
        color: colors.muted,
    },
    slotRemove: {
        padding: 4,
    },
    slotRemoveText: {
        color: colors.rose,
        fontSize: 14,
        fontWeight: "600",
    },

    // ---------- Add ----------
    addRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        marginLeft: 26,
        gap: 6,
    },
    addBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#EEF2FF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.indigo + "30",
    },
    addBtnDark: {
        backgroundColor: colors.navyDeep,
        borderColor: colors.muted,
    },
    addBtnText: {
        fontSize: 11,
        color: colors.indigo,
        fontWeight: "600",
    },
    addMore: {
        fontSize: 11,
        color: colors.muted,
        alignSelf: "center",
    },
    allAdded: {
        fontSize: 12,
        color: colors.muted,
        marginTop: 8,
        marginLeft: 26,
        fontStyle: "italic",
    },

    // ---------- Save ----------
    saveBtn: {
        marginTop: 4,
    },

    // ---------- Footer ----------
    footer: {
        color: colors.muted,
        fontSize: 12,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 4,
        lineHeight: 16,
    },
});