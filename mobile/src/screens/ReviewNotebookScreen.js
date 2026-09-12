import React, { useRef, useState } from "react";
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

function applyBold(val, start, end) {
    val = String(val || "");
    start = Math.max(0, start || 0);
    end = Math.max(start, end || 0);
    if (start === end) {
        var a = val.lastIndexOf("\n", start - 1) + 1;
        var b = val.indexOf("\n", start);
        if (b < 0) b = val.length;
        start = a;
        end = b;
        if (start === end) {
            return { val: val.slice(0, start) + "****" + val.slice(end), start: start + 2, end: start + 2 };
        }
    }
    var sel = val.slice(start, end);
    if (sel.length > 4 && sel.slice(0, 2) === "**" && sel.slice(-2) === "**") {
        var inner = sel.slice(2, -2);
        return { val: val.slice(0, start) + inner + val.slice(end), start: start, end: start + inner.length };
    }
    if (start >= 2 && val.slice(start - 2, start) === "**" && val.slice(end, end + 2) === "**") {
        return { val: val.slice(0, start - 2) + sel + val.slice(end + 2), start: start - 2, end: end - 2 };
    }
    return { val: val.slice(0, start) + "**" + sel + "**" + val.slice(end), start: start, end: end + 4 };
}

function RichText(props) {
    var text = String(props.text || "");
    var nodes = [];
    var re = /\*\*([^*]+)\*\*/g;
    var last = 0;
    var m;
    var i = 0;
    while ((m = re.exec(text))) {
        if (m.index > last) nodes.push(<Text key={"t" + i}>{text.slice(last, m.index)}</Text>);
        i += 1;
        nodes.push(<Text key={"b" + i} style={{ fontWeight: "800" }}>{m[1]}</Text>);
        last = m.index + m[0].length;
        i += 1;
    }
    if (last < text.length) nodes.push(<Text key={"t" + i}>{text.slice(last)}</Text>);
    if (!nodes.length) return <Text style={props.style}>{text}</Text>;
    return <Text style={props.style}>{nodes}</Text>;
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
    var lastField = useRef("body");
    var titleSel = useRef({ start: 0, end: 0 });
    var bodySel = useRef({ start: 0, end: 0 });

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

    function makeBold() {
        var which = lastField.current === "title" ? "title" : "body";
        var val = which === "title" ? title : body;
        var sel = which === "title" ? titleSel.current : bodySel.current;
        var next = applyBold(val, sel.start, sel.end);
        if (which === "title") setTitle(next.val);
        else setBody(next.val);
        var stored = { start: next.start, end: next.end };
        if (which === "title") titleSel.current = stored;
        else bodySel.current = stored;
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
                    onFocus={function () { lastField.current = "title"; }}
                    onSelectionChange={function (e) { titleSel.current = e.nativeEvent.selection; }}
                    placeholder="Başlık (isteğe bağlı)"
                    placeholderTextColor={colors.muted}
                    maxLength={80}
                    style={[styles.input, styles.titleInput, isDark && styles.inputDark]}
                />
                <Tap onPress={makeBold}>
                    <View style={[styles.boldBtn, isDark && styles.inputDark]}>
                        <Text style={styles.boldBtnText}>K Kalın</Text>
                    </View>
                </Tap>
                <TextInput
                    value={body}
                    onChangeText={setBody}
                    onFocus={function () { lastField.current = "body"; }}
                    onSelectionChange={function (e) { bodySel.current = e.nativeEvent.selection; }}
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
                                    <RichText text={n.title} style={[styles.noteTitle, isDark && styles.textLight]} />
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
                            <RichText text={n.body} style={[styles.noteBody, isDark && styles.textLight]} />
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
    titleInput: {
        fontWeight: "700",
    },
    boldBtn: {
        alignSelf: "flex-start",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
        backgroundColor: "#fff",
    },
    boldBtnText: {
        fontWeight: "800",
        fontSize: 14,
        color: colors.text,
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
