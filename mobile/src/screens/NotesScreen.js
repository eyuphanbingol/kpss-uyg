import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { PrimaryButton, ScrollScreen } from "../ui";
import { colors } from "../lib/theme";

export default function NotesScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var notlar = ((app.kpssData[ders] || {})[konu] || {}).notlar || [];
    var sorular = ((app.kpssData[ders] || {})[konu] || {}).sorular || [];
    var tp = StudentStore.getTopic(ders, konu);
    var _idx = useState(tp.noteIndex || 0);
    var idx = _idx[0];
    var setIdx = _idx[1];
    var width = useWindowDimensions().width - 40;

    useEffect(function () {
        StudentStore.setNoteIndex(ders, konu, idx, notlar.length);
    }, [idx]);

    if (!notlar.length) {
        return (
            <ScrollScreen>
                <Pressable onPress={function () { navigation.goBack(); }}><Text>← Geri</Text></Pressable>
                <Text style={{ marginTop: 24, color: colors.muted }}>Bu konu için henüz not yok.</Text>
            </ScrollScreen>
        );
    }

    var html = String(notlar[idx] || "");
    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ fontWeight: "700", color: colors.muted }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 22, fontWeight: "800", marginVertical: 8 }}>{konu} · Özet</Text>
            <Text style={{ textAlign: "center", fontWeight: "800", marginBottom: 12 }}>{idx + 1}/{notlar.length}</Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 12, borderWidth: 1, borderColor: colors.border }}>
                <RenderHTML contentWidth={width} source={{ html: html }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                <Pressable disabled={idx === 0} onPress={function () { setIdx(idx - 1); }}>
                    <Text style={{ fontWeight: "700", opacity: idx === 0 ? 0.3 : 1 }}>Önceki</Text>
                </Pressable>
                {idx === notlar.length - 1 ? (
                    <Pressable onPress={function () {
                        StudentStore.markNotesComplete(ders, konu);
                        if (sorular.length) {
                            navigation.replace("Test", {
                                mode: "topic", ders: ders, konu: konu,
                                items: sorular.map(function (q, i) {
                                    var id = q.id != null ? q.id : i;
                                    return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
                                })
                            });
                        } else navigation.goBack();
                    }}>
                        <Text style={{ fontWeight: "800" }}>{sorular.length ? "Teste geç" : "Konuyu bitir"}</Text>
                    </Pressable>
                ) : (
                    <Pressable onPress={function () { setIdx(idx + 1); }}><Text style={{ fontWeight: "700" }}>Sonraki</Text></Pressable>
                )}
            </View>
            {sorular.length ? (
                <PrimaryButton title="Notları bitirdim, teste geç" style={{ marginTop: 20 }} onPress={function () {
                    StudentStore.markNotesComplete(ders, konu);
                    navigation.replace("Test", {
                        mode: "topic", ders: ders, konu: konu,
                        items: sorular.map(function (q, i) {
                            var id = q.id != null ? q.id : i;
                            return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
                        })
                    });
                }} />
            ) : null}
        </ScrollScreen>
    );
}
