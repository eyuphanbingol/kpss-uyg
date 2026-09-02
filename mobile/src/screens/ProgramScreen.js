import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { PrimaryButton, ScrollScreen, Card } from "../ui";
import { colors } from "../lib/theme";

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
    
    var days = StudentStore.WEEK_DAYS;

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
            <Pressable onPress={function () { navigation.goBack(); }}>
                <Text style={[styles.backText, isDark && styles.textMuted]}>← Geri</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, isDark && styles.textLight]}>
                    Çalışma Programı
                </Text>
                <Text style={[styles.subtitle, isDark && styles.textMuted]}>
                    Her güne ders ve saat ekle
                </Text>
            </View>

            {/* Days */}
            {days.map(function (w) {
                var d = draft.days[w.id];
                var isActive = !!d.on;
                var totalHours = getDayTotal(d);
                var availableDers = dersKeys.filter(function (k) {
                    return !(d.slots || []).some(function (s) { return s.ders === k; });
                });

                return (
                    <Card 
                        key={w.id} 
                        style={[
                            styles.dayCard,
                            isActive && styles.dayCardActive,
                            isDark && styles.cardDark,
                            !isActive && isDark && { opacity: 0.5 }
                        ]}
                    >
                        {/* Day Header */}
                        <Pressable 
                            onPress={function () { toggleDay(w.id); }} 
                            style={styles.dayHeader}
                        >
                            <View style={styles.dayLeft}>
                                <Text style={[styles.dayCheck, isActive && styles.dayCheckActive]}>
                                    {isActive ? "✓" : "○"}
                                </Text>
                                <Text style={[styles.dayName, isDark && styles.textLight]}>
                                    {w.full}
                                </Text>
                            </View>
                            {isActive && totalHours > 0 && (
                                <Text style={[styles.dayTotal, isDark && styles.textMuted]}>
                                    {totalHours} sa
                                </Text>
                            )}
                        </Pressable>

                        {/* Slots */}
                        {isActive && (d.slots || []).map(function (s) {
                            var hourText = s.hours === 0.5 ? "30 dk" : s.hours + " sa";
                            return (
                                <View key={s.ders} style={styles.slotRow}>
                                    <View style={styles.slotLeft}>
                                        <View style={styles.slotDot} />
                                        <Text style={[styles.slotText, isDark && styles.textLight]}>
                                            {s.ders}
                                        </Text>
                                        <Text style={[styles.slotHour, isDark && styles.textMuted]}>
                                            {hourText}
                                        </Text>
                                    </View>
                                    <Pressable 
                                        onPress={function () { removeSlot(w.id, s.ders); }}
                                        style={styles.slotRemove}
                                    >
                                        <Text style={styles.slotRemoveText}>✕</Text>
                                    </Pressable>
                                </View>
                            );
                        })}

                        {/* Add Buttons */}
                        {isActive && availableDers.length > 0 && (
                            <View style={styles.addRow}>
                                {availableDers.slice(0, 5).map(function (k) {
                                    return (
                                        <Pressable 
                                            key={k} 
                                            onPress={function () { addSlot(w.id, k); }}
                                            style={[styles.addBtn, isDark && styles.addBtnDark]}
                                        >
                                            <Text style={[styles.addBtnText, isDark && { color: colors.indigo }]}>
                                                + {k}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                                {availableDers.length > 5 && (
                                    <Text style={[styles.addMore, isDark && styles.textMuted]}>
                                        +{availableDers.length - 5} ders
                                    </Text>
                                )}
                            </View>
                        )}

                        {isActive && availableDers.length === 0 && (d.slots || []).length > 0 && (
                            <Text style={[styles.allAdded, isDark && styles.textMuted]}>
                                Tüm dersler eklendi ✓
                            </Text>
                        )}
                    </Card>
                );
            })}

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

    // ---------- Slot ----------
    slotRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        marginLeft: 26,
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