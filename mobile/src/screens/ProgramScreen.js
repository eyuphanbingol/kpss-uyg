import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { PrimaryButton, ScrollScreen } from "../ui";
import { colors } from "../lib/theme";

export default function ProgramScreen({ navigation }) {
    var app = useApp();
    var kpssData = app.kpssData;
    var dersKeys = Object.keys(kpssData);
    var saved = (app.student.userProfile && app.student.userProfile.studyPlan) || null;
    var _draft = useState(function () { return StudentStore.cloneStudyPlan(saved); });
    var draft = _draft[0];
    var setDraft = _draft[1];
    var days = StudentStore.WEEK_DAYS;

    function patchDay(id, fn) {
        setDraft(function (prev) {
            var next = StudentStore.cloneStudyPlan(prev);
            next.days[id] = Object.assign({ on: false, slots: [] }, next.days[id]);
            fn(next.days[id]);
            return next;
        });
    }

    return (
        <ScrollScreen>
            <Pressable onPress={function () { navigation.goBack(); }}><Text style={{ color: colors.muted, fontWeight: "700", marginBottom: 12 }}>← Geri</Text></Pressable>
            <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 12 }}>Programın</Text>
            {days.map(function (w) {
                var d = draft.days[w.id];
                return (
                    <View key={w.id} style={{ marginBottom: 12, opacity: d.on ? 1 : 0.5 }}>
                        <Pressable onPress={function () { patchDay(w.id, function (day) { day.on = !day.on; }); }}>
                            <Text style={{ fontWeight: "700" }}>{d.on ? "☑ " : "☐ "}{w.full}</Text>
                        </Pressable>
                        {d.on ? (d.slots || []).map(function (s) {
                            return (
                                <View key={s.ders} style={{ flexDirection: "row", alignItems: "center", marginTop: 6, marginLeft: 20 }}>
                                    <Text style={{ flex: 1 }}>{s.ders} · {s.hours} sa</Text>
                                    <Pressable onPress={function () {
                                        patchDay(w.id, function (day) {
                                            day.slots = day.slots.filter(function (x) { return x.ders !== s.ders; });
                                        });
                                    }}><Text style={{ color: colors.rose }}>✕</Text></Pressable>
                                </View>
                            );
                        }) : null}
                        {d.on ? (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: 12, marginTop: 8 }}>
                                {dersKeys.filter(function (k) {
                                    return !(d.slots || []).some(function (s) { return s.ders === k; });
                                }).map(function (k) {
                                    return (
                                        <Pressable key={k} onPress={function () {
                                            patchDay(w.id, function (day) {
                                                day.on = true;
                                                day.slots.push({ ders: k, hours: 1 });
                                            });
                                        }} style={{ margin: 4, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#EEF2FF", borderRadius: 12 }}>
                                            <Text style={{ fontSize: 12, color: colors.indigo }}>+ {k}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ) : null}
                    </View>
                );
            })}
            <PrimaryButton title="Programı kaydet" onPress={function () {
                StudentStore.saveStudyPlan(draft);
                navigation.goBack();
            }} />
        </ScrollScreen>
    );
}
