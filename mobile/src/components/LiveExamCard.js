import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { LiveExam as L } from "../lib/liveExam";
import { LiveClient as C } from "../lib/liveClient";
import { StudentStore } from "../lib/store";
import { konuLabel } from "../lib/konuLabels";
import { go } from "../nav";
import { Card, Tap } from "../ui";

// Canlı deneme kartı: Bugün sekmesinde ve Canlı deneme sayfasında. Web karşılığı app.jsx LiveExamCard.
// Aşama sunucu saatine göre (lib/liveExam.js phase).

export function liveKonuHasContent(kpssData, ders, konu) {
    var kd = kpssData && kpssData[ders] && kpssData[ders][konu];
    return !!(kd && (((kd.notlar || []).length) || ((kd.sorular || []).length)));
}

function Btn({ label, onPress, primary, disabled, dark }) {
    return (
        <Tap onPress={onPress} disabled={disabled} accessibilityLabel={label}
            style={[s.btn, dark && s.btnDark, primary && s.btnPrimary, disabled && { opacity: 0.45 }]}>
            <Text style={[s.btnTxt, (dark || primary) && s.light]}>{label}</Text>
        </Tap>
    );
}

export function LiveExamCard({ navigation, student, kpssData, dark, full }) {
    var track = C.trackOf(student);
    var [dash, setDash] = useState(null);
    var [busy, setBusy] = useState(false);
    var [msg, setMsg] = useState("");
    var [booklet, setBooklet] = useState("");
    var [, setTick] = useState(0);
    var clockRef = useRef(null);
    var lastPhase = useRef("");
    var fetched = useRef({});

    function load() {
        return C.rpc("live_dashboard", { p_track: track }).then(function (d) {
            clockRef.current = L.createClock(d.now);
            setDash(d);
        }).catch(function () {});
    }
    useEffect(function () {
        load();
        var t = setInterval(load, 60000);
        var k = setInterval(function () { setTick(function (x) { return x + 1; }); }, 1000);
        return function () { clearInterval(t); clearInterval(k); };
    }, [track]);

    var now = clockRef.current ? clockRef.current.now() : Date.now();
    var ph = dash ? L.phase(dash, now) : "loading";
    var e = dash && dash.exam;
    var last = dash && dash.last_result;

    useEffect(function () {
        if (lastPhase.current && lastPhase.current !== ph && ph !== "loading") load();
        lastPhase.current = ph;
    }, [ph]);

    useEffect(function () {
        if (!e || ["about_to_start", "can_enter", "in_progress"].indexOf(ph) < 0) return;
        if (C.hasBooklet(e.id)) { setBooklet("ok"); return; }
        setBooklet("loading");
        C.fetchBooklet(e.id).then(function () { setBooklet("ok"); }, function () { setBooklet("fail"); });
    }, [ph, e && e.id]);

    useEffect(function () {
        if (!e || !dash.attempt || (ph !== "ended" && ph !== "ranking")) return;
        if ((last && last.exam_id === e.id) || fetched.current[e.id]) return;
        fetched.current[e.id] = true;
        C.flushPending(e.id).then(function () { return C.rpc("live_result", { p_exam: e.id }); })
            .then(load, function () { fetched.current[e.id] = false; });
    }, [ph, e && e.id]);

    useEffect(function () {
        if (last && last.by_konu && StudentStore.applyLiveExamGaps) {
            StudentStore.applyLiveExamGaps(last.exam_id, { title: last.title, at: last.starts_at }, L.gaps(last));
        }
    }, [last && last.exam_id]);

    if (!dash) return null;

    function act(name, args, done) {
        setBusy(true); setMsg("");
        C.rpc(name, args).then(function (r) { setBusy(false); if (done) done(r); load(); })
            .catch(function (x) { setBusy(false); setMsg(x.message); });
    }
    function register() { act("live_register", { p_exam: e.id }, function (r) { setMsg(r && r.status === "waitlist" ? "Kontenjan dolu; yedek listesine alındın." : "Kaydın alındı."); }); }
    function unregister() {
        Alert.alert("Kaydı sil", "Kaydını silmek istiyor musun?", [
            { text: "Vazgeç", style: "cancel" },
            { text: "Sil", style: "destructive", onPress: function () { act("live_unregister", { p_exam: e.id }); } }
        ]);
    }
    var startT = e ? L.ms(e.starts_at) : 0;
    var when = e ? L.fmtDay(startT, true) + " " + L.fmtClock(startT) : "";
    var title = e ? e.title : "Canlı deneme";

    function Result({ r }) {
        var weak = L.weakest(r, 3);
        return (
            <View>
                <Text style={[s.kicker, { color: "#0f766e" }]}>SON DENEME SONUCUN · {L.fmtDay(L.ms(r.starts_at)).toUpperCase()}</Text>
                <Text style={[s.title, dark && s.light]}>{r.title}</Text>
                <View style={s.rowWrap}>
                    <Text style={[s.big, dark && s.light]}>{L.fmtNet(r.net)} <Text style={s.muted}>net</Text></Text>
                </View>
                <Text style={[s.body, dark && s.lightMuted]}>{r.correct} doğru · {r.wrong} yanlış · {r.blank} boş</Text>
                <Text style={[s.body, dark && s.light, { fontWeight: "700" }]}>
                    {r.finalized && r.rank ? r.rank + ". / " + r.participants + " kişi · ilk %" + String(r.top_pct).replace(".", ",") : "Sıralama " + L.fmtClock(L.ms(r.ranking_at)) + "'ta açıklanır"}
                </Text>
                {weak.length ? (
                    <View style={{ marginTop: 10 }}>
                        <Text style={s.muted}>En zayıf 3 konun (Eksikler'e eklendi):</Text>
                        {weak.map(function (w) {
                            var can = liveKonuHasContent(kpssData, w.ders, w.konu);
                            return (
                                <Tap key={w.key} disabled={!can} onPress={function () { go(navigation, "KonuHub", { ders: w.ders, konu: w.konu }); }} style={s.weakRow}>
                                    <Text style={[s.weakTxt, dark && s.light, can && s.link]} numberOfLines={2}>{w.ders} / {konuLabel(w.konu)}{can ? " →" : ""}</Text>
                                    <Text style={s.muted}>{w.c}/{w.n}</Text>
                                </Tap>
                            );
                        })}
                    </View>
                ) : null}
                <View style={s.btns}>
                    <Btn primary label="Tüm raporu gör" onPress={function () { go(navigation, "LiveResult", { examId: r.exam_id }); }} />
                    <Btn dark={dark} label="Denemelerim" onPress={function () { go(navigation, "LiveArchive"); }} />
                </View>
            </View>
        );
    }

    var body = null;
    var showResult = last && ["ended", "ranking", "none", "reg_open", "registered", "waitlist", "reg_closed", "over_unregistered", "missed_live"].indexOf(ph) >= 0;
    var missedNewer = dash.missed && (!last || L.ms(dash.missed.starts_at) > L.ms(last.starts_at));

    if (ph === "about_to_start") {
        body = (
            <View>
                <Text style={[s.kicker, { color: "#b45309" }]}>SINAV BAŞLAMAK ÜZERE</Text>
                <Text style={[s.title, dark && s.light]}>{title}</Text>
                <Text style={[s.big, dark && s.light]}>{L.fmtLeft(startT - now)}</Text>
                <Text style={[s.body, dark && s.lightMuted]}>
                    {booklet === "ok" ? "✓ Soru kitapçığı şifreli olarak cihazına indi; 10:15'te açılacak." : booklet === "fail" ? "Kitapçık indirilemedi; internetini kontrol et." : "Soru kitapçığı cihazına iniyor…"}
                </Text>
                <View style={s.btns}><Btn primary disabled label="Sınava gir (10:15'te açılır)" /></View>
            </View>
        );
    } else if (ph === "can_enter" || ph === "in_progress") {
        body = (
            <View>
                <Text style={[s.kicker, { color: "#be123c" }]}>● SINAV DEVAM EDİYOR</Text>
                <Text style={[s.title, dark && s.light]}>{title}</Text>
                <Text style={[s.body, dark && s.lightMuted]}>Bitişe {L.fmtLeft(L.ms(e.ends_at) - now)} kaldı{ph === "can_enter" ? " · giriş " + L.fmtClock(L.ms(e.entry_closes_at)) + "'te kapanır" : ""}.</Text>
                <View style={s.btns}><Btn primary label={ph === "in_progress" ? "Kaldığın yerden devam et" : "Sınava gir"} onPress={function () { go(navigation, "LiveExam", { examId: e.id }); }} /></View>
            </View>
        );
    } else if (ph === "entry_closed") {
        body = <Text style={[s.title, dark && s.light]}>Sınava giriş {L.fmtClock(L.ms(e.entry_closes_at))}'te kapandı.</Text>;
    } else if (ph === "submitted") {
        body = <View><Text style={[s.title, dark && s.light]}>Kâğıdını teslim ettin.</Text><Text style={s.muted}>Sonucun ve çözümler {L.fmtClock(L.ms(e.ends_at))}'te açılır.</Text></View>;
    } else if (ph === "locked") {
        body = <View><Text style={[s.title, { color: "#be123c" }]}>Sınavın kilitlendi.</Text><Text style={s.muted}>Cihaz değişim sınırı aşıldı. Yönetici ile iletişime geç.</Text></View>;
    } else if ((ph === "ended" || ph === "ranking") && !(last && last.exam_id === e.id)) {
        body = <View><Text style={[s.title, dark && s.light]}>Sınav bitti.</Text><Text style={s.muted}>Sonucun hesaplanıyor…</Text></View>;
    } else if (showResult) {
        body = <Result r={last} />;
    } else if (missedNewer || ph === "missed_live" || ph === "over_unregistered") {
        body = <View><Text style={[s.title, dark && s.light]}>Bu haftaki denemeye katılmadın.</Text><Text style={s.muted}>Bir sonrakine kayıt ol; genel sonuçlar açıklandığında burada görünür.</Text></View>;
    }

    var reg = null;
    if (ph === "reg_open") {
        reg = (
            <View style={body ? s.sep : null}>
                <Text style={[s.kicker, { color: "#4338ca" }]}>CANLI DENEME · {L.TRACKS[e.track].toUpperCase()}</Text>
                <Text style={[s.title, dark && s.light]}>{when}'te canlı deneme</Text>
                <Text style={[s.body, dark && s.lightMuted]}>120 soru · 130 dakika · herkes aynı anda · başlamaya {L.fmtLeft(startT - now)}{dash.registered_count ? " · " + dash.registered_count + " kayıtlı" : ""}</Text>
                <View style={s.btns}><Btn primary disabled={busy} label="Kayıt ol" onPress={register} /></View>
            </View>
        );
    } else if (ph === "registered" || ph === "waitlist") {
        reg = (
            <View style={body ? s.sep : null}>
                <Text style={[s.kicker, { color: "#047857" }]}>{ph === "waitlist" ? "YEDEK LİSTESİNDESİN" : "✓ KAYITLISIN"}</Text>
                <Text style={[s.title, dark && s.light]}>{when} · {title}</Text>
                <Text style={[s.body, dark && s.lightMuted]}>{ph === "waitlist" ? "Sıran: " + ((dash.registration && dash.registration.waitlist_pos) || "?") + ". " : ""}Başlamaya {L.fmtLeft(startT - now)}.</Text>
                {ph === "registered" ? (
                    <Text style={[s.muted, { marginTop: 6, lineHeight: 18 }]}>• Kayıt pazar {L.fmtClock(L.ms(e.reg_closes_at))}'da kapanır; kitapçık o saatte iner.{"\n"}• 130 dakikalık sessiz bir zaman ayır, müsvedde hazırla.{"\n"}• Sınava {L.fmtClock(L.ms(e.entry_closes_at))}'e kadar girebilirsin.</Text>
                ) : null}
                <View style={s.btns}><Btn dark={dark} disabled={busy} label="Kaydımı sil" onPress={unregister} /></View>
            </View>
        );
    } else if (ph === "reg_closed" && !body) {
        reg = <View><Text style={[s.title, dark && s.light]}>Bu haftanın kaydı kapandı.</Text><Text style={s.muted}>Sınav {when}'te; sonraki denemeye kayıt hafta içi açılır.</Text></View>;
    } else if (ph === "none" && !body) {
        reg = <View><Text style={s.kicker}>CANLI DENEME</Text><Text style={[s.title, dark && s.light]}>Sıradaki canlı deneme yakında duyurulacak.</Text><Text style={s.muted}>Her pazar 10:15'te herkes aynı anda çözer.</Text></View>;
    }

    return (
        <Card dark={dark}>
            {dash.cancelled ? <Text style={s.warn}>{dash.cancelled.title} iptal edildi{dash.cancelled.cancel_reason ? ": " + dash.cancelled.cancel_reason : "."}</Text> : null}
            {body}
            {reg}
            {msg ? <Text style={[s.body, dark && s.lightMuted]}>{msg}</Text> : null}
            {!full ? (
                <Tap onPress={function () { go(navigation, "Live"); }} style={{ marginTop: 10 }}>
                    <Text style={s.more}>Canlı deneme sayfası →</Text>
                </Tap>
            ) : null}
        </Card>
    );
}

export var s = StyleSheet.create({
    light: { color: "#F5F5F4" },
    lightMuted: { color: "#D6D3D1" },
    kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1, color: "#78716C" },
    title: { fontSize: 17, fontWeight: "800", color: "#0F172A", marginTop: 3 },
    big: { fontSize: 32, fontWeight: "900", color: "#0F172A", marginTop: 6 },
    body: { fontSize: 13, color: "#44403C", marginTop: 4, lineHeight: 19 },
    muted: { fontSize: 12, color: "#78716C" },
    link: { color: "#0f766e" },
    rowWrap: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end" },
    weakRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, paddingVertical: 6 },
    weakTxt: { flex: 1, fontSize: 13, fontWeight: "700", color: "#1C1917" },
    btns: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
    btn: { minHeight: 42, paddingHorizontal: 14, justifyContent: "center", borderRadius: 99, backgroundColor: "#fff", borderWidth: 1, borderColor: "rgba(28,25,23,0.12)" },
    btnDark: { backgroundColor: "#292524", borderColor: "rgba(255,255,255,0.12)" },
    btnPrimary: { backgroundColor: "#0D2C4D", borderColor: "#0D2C4D" },
    btnTxt: { fontSize: 13, fontWeight: "700", color: "#1C1917" },
    sep: { marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(120,113,108,0.4)" },
    warn: { fontSize: 13, fontWeight: "600", padding: 10, borderRadius: 12, backgroundColor: "#fff7ed", color: "#9a3412", marginBottom: 10 },
    more: { fontSize: 12, fontWeight: "700", color: "#78716C" }
});
