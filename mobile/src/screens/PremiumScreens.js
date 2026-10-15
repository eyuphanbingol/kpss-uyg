// Gelir modeli ekranları (mobil): kilit rozeti, kilitli ekran, kilit sarmalayıcısı ve Premium satın alma.
// Kural ve durum: src/lib/monetization.js (web ile ortak), mağaza/reklam: src/lib/monet.js.
// Sunucuda monet_settings.enabled kapalıyken hiçbir şey kilitlenmez ve bu ekranlar görünmez.
// Web karşılığı: js/app.jsx (MonetLockScreen) ve js/components/PaywallScreen.jsx
import React, { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { Crown, Lock } from "lucide-react-native";
import { useApp } from "../AppProvider";
import { Monetization } from "../lib/monetization";
import { Monet } from "../lib/monet";
import { Card, PageHeader, PrimaryButton, ScrollScreen, SecondaryButton, Tap } from "../ui";
import { colors } from "../lib/theme";
import { go } from "../nav";

export function useMonet() {
    var [, setTick] = useState(0);
    useEffect(function () {
        return Monetization.subscribe(function () { setTick(function (x) { return x + 1; }); });
    }, []);
    return Monetization;
}

export function LockBadge() {
    return (
        <View style={styles.badge}>
            <Lock size={11} color="#92400E" strokeWidth={2.6} />
            <Text style={styles.badgeTxt}>Premium</Text>
        </View>
    );
}

export function LockedScreen(props) {
    var app = useApp();
    var isDark = app.dark;
    var navigation = props.navigation;
    var [busy, setBusy] = useState(false);
    var [msg, setMsg] = useState("");
    var ads = Monet.canShowAds();
    var h = Monetization.unlockHours();

    function watch() {
        setBusy(true);
        setMsg("");
        Monet.watchRewarded(props.lockKey).then(function (r) {
            setBusy(false);
            // ödül alınınca durum değişir ve sarmalayıcı gerçek ekranı açar
            if (r && !r.ok && !r.cancelled) setMsg(r.message || "Reklam gösterilemedi.");
        });
    }

    return (
        <ScrollScreen dark={isDark}>
            <PageHeader dark={isDark} title={props.title || "Kilitli"} onBack={function () { navigation.goBack(); }} right={null} />
            <Card style={[styles.lockCard, isDark && styles.cardDark]}>
                <View style={styles.lockIcon}><Lock size={28} color="#92400E" strokeWidth={2.2} /></View>
                <Text style={[styles.lockTitle, isDark && styles.textLight]}>Bu bölüm kilitli</Text>
                <Text style={[styles.lockDesc, isDark && styles.textMuted]}>
                    Her bölümün ilk {Monetization.freeCount()} başlığı ücretsiz. {ads ? "Kısa bir reklam izleyerek bu bölümü " + h + " saat açabilir ya da " : ""}Premium ile hepsini reklamsız açabilirsin.
                </Text>
                {ads ? <PrimaryButton title={"Reklam izle · " + h + " saat aç"} busy={busy} onPress={watch} style={{ alignSelf: "stretch", marginTop: 16 }} /> : null}
                <SecondaryButton title="Premium'a geç" onPress={function () { go(navigation, "Paywall"); }} style={{ alignSelf: "stretch", marginTop: 10 }} />
                {msg ? <Text style={styles.err}>{msg}</Text> : null}
            </Card>
        </ScrollScreen>
    );
}

// lockOf(params, app) → { key, index, title } ya da null. Kilitliyse ekran yerine LockedScreen çizilir;
// hangi yoldan açılırsa açılsın (liste, plan kartı, bildirim) aynı kontrol geçerli olur.
export function withMonetGate(Screen, lockOf) {
    function Gated(props) {
        var app = useApp();
        useMonet();
        var l = lockOf((props.route && props.route.params) || {}, app);
        if (l && Monetization.isLocked(l.key, l.index)) {
            return <LockedScreen navigation={props.navigation} title={l.title} lockKey={l.key} />;
        }
        return <Screen {...props} />;
    }
    Gated.displayName = "Gated(" + (Screen.displayName || Screen.name || "Screen") + ")";
    return Gated;
}

function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return ""; }
}

var MANAGE_URL = Platform.OS === "ios" ? "https://apps.apple.com/account/subscriptions" : "https://play.google.com/store/account/subscriptions";

export function PaywallScreen({ navigation }) {
    var app = useApp();
    var isDark = app.dark;
    useMonet();
    var [pkgs, setPkgs] = useState(null);
    var [loading, setLoading] = useState(true);
    var [plan, setPlan] = useState("yearly");
    var [busy, setBusy] = useState("");
    var [msg, setMsg] = useState("");

    useEffect(function () {
        var alive = true;
        Monet.refresh();
        Monet.premiumPackages().then(function (p) {
            if (!alive) return;
            setPkgs(p);
            setLoading(false);
        });
        return function () { alive = false; };
    }, []);

    if (!Monetization.enabled()) {
        return (
            <ScrollScreen dark={isDark}>
                <PageHeader dark={isDark} title="Tüm özellikler açık" subtitle="Şu an bütün konular ve oyunlar ücretsiz." onBack={function () { navigation.goBack(); }} right={null} />
            </ScrollScreen>
        );
    }

    var premium = Monetization.isPremium();
    var until = Monetization.premiumUntil();
    var P = Monetization.PRICES;
    function price(kind) {
        var p = pkgs && pkgs[kind];
        return (p && p.product && p.product.priceString) || P[kind];
    }

    function buy() {
        var pkg = pkgs && pkgs[plan];
        if (!pkg) { setMsg("Mağaza şu an yanıt vermiyor. İnternet bağlantını kontrol edip tekrar dene."); return; }
        setBusy("buy");
        setMsg("");
        Monet.buyPackage(pkg).then(function (r) {
            setBusy("");
            if (r.ok) setMsg("Premium açıldı. Teşekkürler!");
            else if (!r.cancelled) setMsg(r.message);
        });
    }

    function restore() {
        setBusy("restore");
        setMsg("");
        Monet.restorePurchases().then(function (r) {
            setBusy("");
            if (r.ok) setMsg(Monetization.isPremium() ? "Satın alımın geri yüklendi." : "Bu mağaza hesabında etkin bir abonelik bulunamadı.");
            else if (!r.cancelled) setMsg(r.message);
        });
    }

    var canBuy = Monet.canPurchase();

    return (
        <ScrollScreen dark={isDark}>
            <PageHeader dark={isDark} title="Atanly Premium" subtitle="Bütün konular ve oyunlar, reklamsız" onBack={function () { navigation.goBack(); }} right={null} />

            {premium ? (
                <Card style={[styles.activeCard, isDark && styles.cardDark]}>
                    <Crown size={26} color="#047857" />
                    <Text style={[styles.activeTitle, isDark && styles.textLight]}>Premium açık</Text>
                    <Text style={[styles.lockDesc, isDark && styles.textMuted]}>{until ? fmtDate(until) + " tarihine kadar geçerli." : "Süresiz."} Web'de de geçerli.</Text>
                    <SecondaryButton title="Aboneliği yönet" onPress={function () { Linking.openURL(MANAGE_URL).catch(function () {}); }} style={{ alignSelf: "stretch", marginTop: 12 }} />
                </Card>
            ) : (
                <View>
                    {["monthly", "yearly"].map(function (k) {
                        var sel = plan === k;
                        return (
                            <Tap key={k} onPress={function () { setPlan(k); }} style={[styles.plan, isDark && styles.cardDark, sel && styles.planSel]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.planName, isDark && styles.textLight]}>{k === "monthly" ? "Aylık" : "Yıllık"}</Text>
                                    {k === "yearly" ? <Text style={styles.planHint}>En avantajlı · ayda yaklaşık 83 TL</Text> : <Text style={styles.planHint}>İstediğin zaman iptal</Text>}
                                </View>
                                <Text style={[styles.planPrice, isDark && styles.textLight]}>{price(k)}</Text>
                                <View style={[styles.radio, sel && styles.radioOn]} />
                            </Tap>
                        );
                    })}
                    <View style={[styles.features, isDark && styles.cardDark]}>
                        {["Bütün konu notları ve testleri", "Bütün harita oyunları ve boşluk doldurma", "Reklam yok", "Telefonda ve web'de aynı hesap"].map(function (f) {
                            return <Text key={f} style={[styles.feature, isDark && styles.textLight]}>✓  {f}</Text>;
                        })}
                    </View>
                    <PrimaryButton
                        title={canBuy ? (plan === "yearly" ? "Yıllık Premium'u al" : "Aylık Premium'u al") : "Satın alma yakında"}
                        disabled={!canBuy || loading}
                        busy={busy === "buy"}
                        onPress={buy}
                        style={{ marginTop: 14 }}
                    />
                </View>
            )}

            {msg ? <Text style={[styles.msg, isDark && styles.textLight]}>{msg}</Text> : null}

            {canBuy ? (
                <Tap onPress={restore} disabled={!!busy} style={{ alignSelf: "center", padding: 12 }}>
                    <Text style={styles.link}>{busy === "restore" ? "Kontrol ediliyor…" : "Satın alımları geri yükle"}</Text>
                </Tap>
            ) : null}

            <Text style={[styles.legal, isDark && styles.textMuted]}>
                Ödeme {Platform.OS === "ios" ? "Apple" : "Google Play"} hesabından alınır. Abonelik, dönem bitmeden en az 24 saat önce mağaza hesabından iptal edilmedikçe otomatik yenilenir. Premium olmadan da her bölümün ilk {Monetization.freeCount()} başlığı ücretsizdir. Canlı denemeler Premium'a dahil değildir: her hesabın ilk denemesi ücretsiz, sonrakiler kayıt başına {P.live}.
            </Text>
            <View style={styles.legalLinks}>
                <Tap onPress={function () { Linking.openURL("https://www.atanly.com/yasal/kullanim").catch(function () {}); }}><Text style={styles.link}>Kullanım koşulları</Text></Tap>
                <Tap onPress={function () { Linking.openURL("https://www.atanly.com/yasal/gizlilik").catch(function () {}); }}><Text style={styles.link}>Gizlilik</Text></Tap>
            </View>
        </ScrollScreen>
    );
}

var styles = StyleSheet.create({
    textLight: { color: "#fff" },
    textMuted: { color: colors.muted },
    cardDark: { backgroundColor: colors.navyDeep, borderColor: colors.muted },
    badge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FEF3C7", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, flexShrink: 0 },
    badgeTxt: { color: "#92400E", fontSize: 11, fontWeight: "800" },
    lockCard: { alignItems: "center", padding: 22 },
    lockIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center", marginBottom: 12 },
    lockTitle: { fontSize: 19, fontWeight: "900", color: colors.text, marginBottom: 6 },
    lockDesc: { fontSize: 14, lineHeight: 20, color: "#57534E", textAlign: "center" },
    err: { color: colors.rose, marginTop: 12, textAlign: "center" },
    activeCard: { alignItems: "center", padding: 22, backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
    activeTitle: { fontSize: 19, fontWeight: "900", color: "#065F46", marginTop: 8, marginBottom: 4 },
    plan: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 18, borderWidth: 1.5, borderColor: "#E7E5E4", backgroundColor: "#fff", marginBottom: 10 },
    planSel: { borderColor: "#14607a", borderWidth: 2.5 },
    planName: { fontSize: 16, fontWeight: "800", color: colors.text },
    planHint: { fontSize: 12, color: "#0F766E", marginTop: 2 },
    planPrice: { fontSize: 20, fontWeight: "900", color: colors.text },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#A8A29E" },
    radioOn: { borderColor: "#14607a", backgroundColor: "#14607a" },
    features: { padding: 14, borderRadius: 18, backgroundColor: "#F5F5F4", marginTop: 4, gap: 6 },
    feature: { fontSize: 14, color: "#44403C" },
    msg: { textAlign: "center", marginTop: 12, color: colors.text, fontWeight: "600" },
    link: { color: "#14607a", fontWeight: "700", fontSize: 13 },
    legal: { fontSize: 11, lineHeight: 16, color: "#78716C", marginTop: 12 },
    legalLinks: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 8, marginBottom: 20 }
});
