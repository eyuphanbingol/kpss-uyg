import React, { useState } from "react";
import { Alert, Text, TextInput, View, StyleSheet } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { Card, GhostButton, PrimaryButton, ScrollScreen, PageHeader, Tap } from "../ui";
import { colors } from "../lib/theme";

function fmtWhen(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var hh = String(d.getHours()).padStart(2, "0");
    var mi = String(d.getMinutes()).padStart(2, "0");
    return dd + "." + mm + " " + hh + ":" + mi;
}

export default function ReviewNotebookScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    var notes = StudentStore.listReviewNotes();

    var _title = useState("");
    var title = _title[0];
    var setTitle = _title[1];
    var _body = useState("");
    var body = _body[0];
    var setBody = _body[1];
    var _edit = useState("");
    var editId = _edit[0];
    var setEditId = _edit[1];

    function resetForm() {
        setTitle("");
        setBody("");
        setEditId("");
    }

    function save() {
        var t = title.trim();
        var b = body.trim();
        if (!t && !b) return;
        StudentStore.upsertReviewNote({ id: editId || undefined, title: t, body: b });
        resetForm();
        SyncEngine.sync();
    }

    function startEdit(n) {
        setEditId(n.id);
        setTitle(n.title || "");
        setBody(n.body || "");
    }

    function remove(id) {
        Alert.alert("Notu sil", "Bu notu silmek istiyor musun?", [
            { text: "Vazgeç", style: "cancel" },
            {
                text: "Sil",
                style: "destructive",
                onPress: function () {
                    StudentStore.deleteReviewNote(id);
                    if (editId === id) resetForm();
                    SyncEngine.sync();
                }
            }
        ]);
    }

    return (
        <ScrollScreen dark={isDark} noBottom>
            <PageHeader
                dark={isDark}
                title="Tekrar defteri"
                subtitle="Kural, tarih, formül… yalnızca sen görürsün."
                onBack={function () { navigation.goBack(); }}
            />

            <Card style={[isDark && styles.cardDark]}>
                <Text style={[styles.formLabel, isDark && styles.textMuted]}>
                    {editId ? "Notu düzenle" : "Yeni not"}
                </Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Başlık (isteğe bağlı)"
                    placeholderTextColor={colors.muted}
                    maxLength={80}
                    style={[styles.input, isDark && styles.inputDark]}
                />
                <TextInput
                    value={body}
                    onChangeText={setBody}
                    placeholder="Tekrar etmek istediğin şeyi yaz…"
                    placeholderTextColor={colors.muted}
                    maxLength={4000}
                    multiline
                    style={[styles.input, styles.area, isDark && styles.inputDark]}
                />
                <View style={styles.formRow}>
                    <PrimaryButton title="Kaydet" onPress={save} style={{ flex: 1 }} />
                    {editId ? (
                        <GhostButton title="Vazgeç" onPress={resetForm} style={{ marginLeft: 8 }} />
                    ) : null}
                </View>
            </Card>

            {notes.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={[styles.emptyText, isDark && styles.textMuted]}>
                        Henüz not yok. Yukarıya yazıp kaydet.
                    </Text>
                </View>
            ) : notes.map(function (n) {
                return (
                    <Card key={n.id} style={[isDark && styles.cardDark, editId === n.id && styles.editing]}>
                        <View style={styles.noteHead}>
                            <View style={{ flex: 1, minWidth: 0 }}>
                                {n.title ? (
                                    <Text style={[styles.noteTitle, isDark && styles.textLight]}>{n.title}</Text>
                                ) : null}
                                <Text style={[styles.noteWhen, isDark && styles.textMuted]}>{fmtWhen(n.updatedAt)}</Text>
                            </View>
                            <Tap onPress={function () { startEdit(n); }}>
                                <Text style={styles.editBtn}>Düzenle</Text>
                            </Tap>
                            <Tap onPress={function () { remove(n.id); }}>
                                <Text style={styles.delBtn}>Sil</Text>
                            </Tap>
                        </View>
                        {n.body ? (
                            <Text style={[styles.noteBody, isDark && styles.textLight]}>{n.body}</Text>
                        ) : null}
                    </Card>
                );
            })}
        </ScrollScreen>
    );
}

var styles = StyleSheet.create({
    textLight: { color: "#F8FAFC" },
    textMuted: { color: "#94A3B8" },
    cardDark: {
        backgroundColor: "rgba(15, 23, 42, 0.78)",
        borderColor: "rgba(255,255,255,0.06)",
    },
    formLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        backgroundColor: "#fff",
        color: colors.text,
        marginBottom: 8,
    },
    inputDark: {
        backgroundColor: colors.navyDeep,
        borderColor: "#334155",
        color: "#F8FAFC",
    },
    area: {
        minHeight: 120,
        textAlignVertical: "top",
    },
    formRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    empty: {
        padding: 24,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#E2E8F0",
        borderRadius: 20,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: colors.muted,
        textAlign: "center",
    },
    editing: {
        borderColor: "#0D9488",
        borderWidth: 2,
    },
    noteHead: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    noteTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.text,
    },
    noteWhen: {
        fontSize: 11,
        color: colors.muted,
        marginTop: 2,
    },
    noteBody: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.text,
        marginTop: 10,
    },
    editBtn: {
        color: "#0F766E",
        fontWeight: "600",
        fontSize: 13,
        paddingHorizontal: 4,
    },
    delBtn: {
        color: "#E11D48",
        fontWeight: "600",
        fontSize: 13,
        paddingHorizontal: 4,
    },
});
