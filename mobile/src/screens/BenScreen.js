import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { SyncEngine } from "../lib/syncEngine";
import { supabase } from "../lib/supabase";
import { go } from "../nav";
import { Card, GhostButton, PrimaryButton, ScrollScreen } from "../ui";
import { colors, eduLabel, fmtExam, needsKulvar } from "../lib/theme";

var TOOLS = [
    { id: "Placement", t: "Puan / tercih", d: "Tahmini puanın hangi kurumlara yeter" },
    { id: "Leaderboard", t: "Türkiye", d: "Haftalık soru ve deneme sıralaması" },
    { id: "Heat", t: "Isı haritası", d: "30 günlük tempo" },
    { id: "Ai", t: "Soru asistanı", d: "Yanlışın nedenini kısaca açıklar" },
    { id: "Live", t: "Canlı deneme", d: "Cumartesi ortak saat" },
    { id: "Paywall", t: "Premium", d: "Plan ve davet kodu" }
];

export default function BenScreen({ navigation }) {
    var app = useApp();
    var st = app.student;
    var totQ = 0, totC = 0;
    Object.keys(st.sessions || {}).forEach(function (d) {
        totQ += st.sessions[d].questions || 0;
        totC += st.sessions[d].correct || 0;
    });
    var overall = totQ ? Math.round((totC / totQ) * 100) : 0;
    var up = st.userProfile || {};
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

    function save() {
        var nextEdu = (totQ === 0 && draftEdu) ? draftEdu : up.educationLevel;
        StudentStore.updateProfile({ name: draftName });
        var patch = { nickname: draftName };
        patch.targetType = needsKulvar(nextEdu) ? draftTrack : "B";
        StudentStore.updateUserProfile(patch);
        var wantEdu = draftEdu && draftEdu !== up.educationLevel && (!eduReq || eduReq.status !== "pending") ? draftEdu : "";
        if (wantEdu) {
            if (totQ === 0) StudentStore.setEducationLevel(wantEdu);
            else {
                StudentStore.requestEducationChange(wantEdu);
                supabase.functions.invoke("admin-action", { body: { action: "submit_edu", to: wantEdu } });
            }
        }
        setEditing(false);
        SyncEngine.sync();
    }

    return (
        <ScrollScreen>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy }}>Profil</Text>
            <Text style={{ color: colors.muted }}>{up.email || "Hesap bağlı"}</Text>
            <View style={{ flexDirection: "row", marginVertical: 12 }}>
                <Card style={{ flex: 1, marginRight: 8 }}><Text style={{ fontSize: 22, fontWeight: "800", color: colors.teal }}>{totQ}</Text><Text style={{ color: colors.muted }}>Soru</Text></Card>
                <Card style={{ flex: 1 }}><Text style={{ fontSize: 22, fontWeight: "800", color: colors.teal }}>%{overall}</Text><Text style={{ color: colors.muted }}>Net</Text></Card>
            </View>
            <Card>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted }}>Ayarlar</Text>
                    {!editing ? <Pressable onPress={function () { setDraftName(st.profile.name || ""); setDraftTrack(up.targetType || "B"); setDraftEdu(totQ === 0 ? (up.educationLevel || "lisans") : ""); setEditing(true); }}><Text style={{ color: colors.indigo, fontWeight: "700" }}>Düzenle</Text></Pressable> : null}
                </View>
                {eduReq && eduReq.status === "pending" ? <Text style={{ color: colors.amber, marginTop: 8 }}>Eğitim değişikliği onay bekliyor: {eduLabel(eduReq.to)}</Text> : null}
                {!editing ? (
                    <View style={{ marginTop: 8 }}>
                        <Row k="Ad" v={st.profile.name || "—"} />
                        <Row k="Eğitim" v={eduLabel(up.educationLevel)} />
                        <Row k="Sınav tarihi" v={fmtExam(st.profile.examDate)} />
                        {needsKulvar(up.educationLevel) ? <Row k="Kulvar" v={up.targetType || "B"} /> : null}
                    </View>
                ) : (
                    <View style={{ marginTop: 8 }}>
                        <TextInput value={draftName} onChangeText={setDraftName} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 8 }} />
                        {totQ === 0 ? (
                            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                                {["lisans", "onlisans", "ortaogretim"].map(function (x) {
                                    return <Pressable key={x} onPress={function () { setDraftEdu(x); }} style={{ flex: 1, padding: 8, borderRadius: 10, backgroundColor: (draftEdu || up.educationLevel) === x ? colors.indigo : "#F5F5F4" }}>
                                        <Text style={{ textAlign: "center", color: (draftEdu || up.educationLevel) === x ? "#fff" : colors.text, fontSize: 11 }}>{eduLabel(x)}</Text>
                                    </Pressable>;
                                })}
                            </View>
                        ) : (
                            <View>
                                <Text>{eduLabel(up.educationLevel)}</Text>
                                <Text style={{ fontSize: 12, color: colors.muted }}>Düzey değişimi admin onayı ister.</Text>
                            </View>
                        )}
                        <PrimaryButton title="Gönder" onPress={save} />
                        <GhostButton title="Vazgeç" onPress={function () { setEditing(false); }} style={{ marginTop: 8 }} />
                    </View>
                )}
            </Card>
            <Card>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>Araçlar</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {TOOLS.map(function (x) {
                        return (
                            <Pressable key={x.id} onPress={function () { go(navigation, x.id); }} style={{ width: "50%", padding: 8 }}>
                                <Text style={{ fontWeight: "700" }}>{x.t}</Text>
                                <Text style={{ fontSize: 11, color: colors.muted }}>{x.d}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </Card>
            <Card>
                <Text style={{ fontWeight: "700" }}>{StudentStore.isPremium() ? "Premium açık" : "Ücretsiz plan · sınırlı deneme"}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>Davet kodun: {StudentStore.ensureReferralCode()}</Text>
            </Card>
            <Card>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.muted, marginBottom: 8 }}>Rozetler</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {[
                        { id: "firstDay", title: "İlk çalışma günü" },
                        { id: "streak7", title: "7 gün kesintisiz" },
                        { id: "q1000", title: "1000 soru" },
                        { id: "firstExam", title: "İlk tam deneme" }
                    ].map(function (b) {
                        var on = st.achievements && st.achievements[b.id];
                        return <Text key={b.id} style={{ fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99, backgroundColor: on ? "#ECFDF5" : "#F5F5F4", color: on ? colors.emerald : colors.muted }}>{b.title}</Text>;
                    })}
                </View>
            </Card>
            <GhostButton title="Veri silme talebi" onPress={function () {
                Alert.alert("Silme", "Hesap silme talebi kaydedilir.", [
                    { text: "Vazgeç" },
                    { text: "Talep et", onPress: function () { StudentStore.requestDeletion(); } }
                ]);
            }} />
            <GhostButton title="Çıkış" onPress={app.signOut} style={{ marginTop: 8 }} />
        </ScrollScreen>
    );
}

function Row(props) {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F5F5F4" }}>
            <Text style={{ color: colors.muted }}>{props.k}</Text>
            <Text style={{ fontWeight: "600" }}>{props.v}</Text>
        </View>
    );
}
