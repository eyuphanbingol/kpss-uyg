import React, { useEffect, useMemo, useState } from "react";
import { Text, useWindowDimensions, View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "../AppProvider";
import { StudentStore } from "../lib/store";
import { ScrollScreen, BackChip, Tap, ThemeToggle } from "../ui";
import { colors } from "../lib/theme";
import { rewriteHtmlMedia } from "../lib/media";

var NOTE_CSS = ""
    + "*{box-sizing:border-box;-webkit-text-size-adjust:100%}"
    + "html,body{margin:0;padding:0;background:#fff;color:#1c1917;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}"
    + "html.dark,html.dark body{background:#2A2724;color:#e7e5e4}"
    + "body{padding:12px 12px 8px;overflow-x:hidden}"
    + ".note-html,.note-html *{max-width:100%!important;box-sizing:border-box!important}"
    + ".note-html{display:flex;flex-direction:column;gap:12px;font-size:15px;line-height:1.55;overflow:hidden;width:100%}"
    + ".note-html [class*='min-w-']{min-width:0!important}"
    + ".note-html .grid,.note-html [class*='grid-cols']{display:flex!important;flex-direction:column!important;gap:10px!important;width:100%!important}"
    + ".note-html .flex{flex-wrap:wrap!important;min-width:0}"
    + ".note-html .flex-col{flex-wrap:nowrap!important}"
    + ".note-html p,.note-html li,.note-html span,.note-html h1,.note-html h2,.note-html h3,.note-html h4{overflow-wrap:anywhere;word-break:break-word}"
    + ".note-html .text-xs{font-size:13px!important;line-height:1.5!important}"
    + ".note-html .text-sm,.note-html .text-base{font-size:15px!important;line-height:1.55!important}"
    + ".note-html .text-lg,.note-html .text-xl,.note-html .text-2xl{font-size:18px!important;line-height:1.3!important;font-weight:900!important;color:#DC2626!important}"
    + ".note-html b,.note-html strong{color:#041C24;font-weight:800}"
    + ".note-html>div:first-child{background:none!important;border:0!important;padding:0!important;margin:0!important;box-shadow:none!important}"
    + ".note-html span.inline-flex{display:flex!important;width:100%!important;max-width:100%;box-sizing:border-box;align-items:center;flex-wrap:wrap!important;white-space:normal!important;gap:8px;padding:12px 14px!important;border-radius:16px!important;background:linear-gradient(135deg,#9F1239,#DC2626,#E11D48)!important;color:#fff!important;border:0!important;font-size:15px!important;font-weight:900!important;letter-spacing:.02em;line-height:1.35!important;box-shadow:0 8px 20px rgba(190,18,60,.28)}"
    + ".note-html .font-black:not(.inline-flex){color:#DC2626!important;font-size:16px!important;font-weight:900!important;letter-spacing:-.02em;line-height:1.3!important}"
    + ".note-pack,.note-html>div:not(:first-child),.note-html>ul,.note-html>ol,.note-html>p,.note-html>table{background:#eef6fb!important;border:1px solid rgba(18,120,128,.16)!important;border-radius:16px!important;padding:14px!important;box-shadow:none!important}"
    + ".note-html .grid{gap:10px!important;width:100%}"
    + ".note-html .grid>div{background:#fff!important;border:1px solid #e7e5e4!important;border-radius:14px!important;padding:12px 14px!important}"
    + ".note-html ul,.note-html ol{list-style:none!important;padding:0!important;margin:0!important;display:flex;flex-direction:column;gap:8px}"
    + ".note-html li,.note-html .note-chip,.note-html .flex-wrap>span:not(.inline-flex){background:#fff!important;border:1px solid #e7e5e4!important;border-radius:10px!important;padding:8px 12px!important;color:#1c1917!important;list-style:none!important;margin:0!important}"
    + ".note-html p{background:#fff!important;border:1px solid #e7e5e4!important;border-radius:12px!important;padding:12px 14px!important;margin:0 0 8px!important}"
    + ".note-html p:last-child{margin-bottom:0!important}"
    + ".note-html h3,.note-html h4,.note-html h5,.note-html .font-bold.mb-2,.note-html .font-bold.mb-1,.note-html .font-bold.border-b{display:block;width:100%;background:transparent!important;border:0!important;border-bottom:2px solid rgba(220,38,38,.22)!important;border-radius:0!important;color:#DC2626!important;font-weight:900;font-size:17px!important;padding:0 0 8px!important;margin:0 0 10px!important}"
    + ".note-html img{max-width:100%!important;width:100%!important;height:auto!important;display:block!important;border-radius:12px!important;margin:10px 0!important;background:#F6F1E4}"
    + ".note-html table{width:100%!important;display:table!important;border-collapse:separate;border-spacing:0 6px;background:transparent!important;border:0!important;padding:0!important}"
    + "html.dark .note-html b,html.dark .note-html strong{color:#F5EBC7}"
    + "html.dark .note-pack,html.dark .note-html>div:not(:first-child){background:#211F1D!important;border-color:rgba(255,255,255,.08)!important}"
    + "html.dark .note-html p,html.dark .note-html li,html.dark .note-html .grid>div{background:#2A2724!important;border-color:rgba(255,255,255,.1)!important;color:#e7e5e4!important}"
    + "html.dark .note-html h3,html.dark .note-html h4,html.dark .note-html .font-black:not(.inline-flex){color:#F87171!important}";

var SHAPE_JS = "(function(){"
    + "var root=document.getElementById('note');if(!root)return;"
    + "Array.prototype.slice.call(root.children).forEach(function(el,i){"
    + "if(i===0&&el.querySelector&&el.querySelector('span.inline-flex'))return;"
    + "var tag=el.tagName;"
    + "if(tag==='UL'||tag==='OL'||tag==='P'||tag==='TABLE'){"
    + "var pack=document.createElement('div');pack.className='note-pack';"
    + "el.parentNode.insertBefore(pack,el);pack.appendChild(el);"
    + "}});"
    + "root.querySelectorAll('li').forEach(function(li){li.classList.add('note-chip');});"
    + "function post(){var h=Math.ceil((root.getBoundingClientRect().height||0)+16);"
    + "if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify({h:h}));}"
    + "post();setTimeout(post,80);setTimeout(post,400);"
    + "root.querySelectorAll('img').forEach(function(img){img.onload=post;img.onerror=post;});"
    + "})();true;";

function noteDocument(html, dark) {
    var safe = String(html || "").replace(/<\/script/gi, "<\\/script");
    return "<!DOCTYPE html><html class=\"" + (dark ? "dark" : "") + "\"><head>"
        + "<meta charset=\"utf-8\"/>"
        + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,maximum-scale=1\"/>"
        + "<style>" + NOTE_CSS + "</style></head><body>"
        + "<div class=\"note-html\" id=\"note\">" + safe + "</div>"
        + "<script>" + SHAPE_JS + "</script></body></html>";
}

export default function NotesScreen({ route, navigation }) {
    var ders = route.params.ders;
    var konu = route.params.konu;
    var app = useApp();
    var isDark = app.dark;
    var notlar = ((app.kpssData[ders] || {})[konu] || {}).notlar || [];
    var sorular = ((app.kpssData[ders] || {})[konu] || {}).sorular || [];
    var tp = StudentStore.getTopic(ders, konu);
    var _idx = useState(tp.noteIndex || 0);
    var idx = _idx[0];
    var setIdx = _idx[1];
    var _h = useState(280);
    var webH = _h[0];
    var setWebH = _h[1];
    var cardW = Math.max(280, useWindowDimensions().width - 24);

    useEffect(function () {
        StudentStore.setNoteIndex(ders, konu, idx, notlar.length);
    }, [idx]);

    useEffect(function () {
        setWebH(280);
    }, [idx, isDark]);

    var htmlDoc = useMemo(function () {
        return noteDocument(rewriteHtmlMedia(String(notlar[idx] || "")), isDark);
    }, [notlar, idx, isDark]);

    function goToTest() {
        StudentStore.markNotesComplete(ders, konu);
        var packs = StudentStore.topicTestPacks(sorular.map(function (q, i) {
            var id = q.id != null ? q.id : i;
            return { ders: ders, konu: konu, q: q, id: id, qid: StudentStore.qid(ders, konu, id) };
        }));
        var pack = packs[StudentStore.firstOpenPackIndex(StudentStore.getTopic(ders, konu), packs.length)];
        if (!pack) {
            navigation.goBack();
            return;
        }
        navigation.replace("Test", { mode: "topic", ders: ders, konu: konu, testNo: pack.no, items: pack.items });
    }

    function goBack() {
        navigation.goBack();
    }

    if (!notlar.length) {
        return (
            <ScrollScreen dark={isDark}>
                <BackChip dark={isDark} label="Geri" onPress={goBack} />
                <Text style={[styles.emptyTitle, isDark && { color: "#fff" }]}>Bu konu için henüz not yok.</Text>
            </ScrollScreen>
        );
    }

    var isLast = idx === notlar.length - 1;

    return (
        <ScrollScreen dark={isDark}>
            <View style={styles.topRow}>
                <BackChip dark={isDark} label="Geri" onPress={goBack} />
                <ThemeToggle dark={isDark} />
            </View>

            <View style={[styles.studyCard, isDark && styles.studyCardDark]}>
                <LinearGradient colors={["#041C24", "#0A3842", "#127880"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.head}>
                    <View style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                        <Text style={styles.kicker}>{String(ders || "").toUpperCase()}</Text>
                        <Text style={styles.title} numberOfLines={2}>{konu} · Özet</Text>
                    </View>
                    <View style={styles.progressPill}>
                        <Text style={styles.progressTxt}>{idx + 1}/{notlar.length}</Text>
                    </View>
                </LinearGradient>

                <WebView
                    key={idx + (isDark ? "-d" : "-l")}
                    originWhitelist={["*"]}
                    source={{ html: htmlDoc, baseUrl: "https://www.atanly.com/" }}
                    style={{ width: cardW, height: webH, backgroundColor: isDark ? "#2A2724" : "#fff" }}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    javaScriptEnabled
                    mixedContentMode="always"
                    setSupportMultipleWindows={false}
                    onMessage={function (e) {
                        try {
                            var msg = JSON.parse(e.nativeEvent.data);
                            if (msg && msg.h) setWebH(Math.min(4000, Math.max(180, Math.ceil(msg.h))));
                        } catch (err) {}
                    }}
                />

                <View style={[styles.foot, isDark && styles.footDark]}>
                    <Tap
                        disabled={idx === 0}
                        onPress={function () { setIdx(idx - 1); }}
                        style={[styles.prevBtn, idx === 0 && { opacity: 0.35 }]}
                    >
                        <Text style={[styles.prevTxt, isDark && { color: "#e7e5e4" }]}>‹  Önceki</Text>
                    </Tap>
                    {isLast ? (
                        <Tap onPress={sorular.length ? goToTest : goBack} style={styles.nextWrap}>
                            <LinearGradient colors={["#0D2C4D", "#14607a", "#1D8A99"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.nextBtn}>
                                <Text style={styles.nextTxt}>{sorular.length ? "Teste geç  ›" : "Konuyu bitir"}</Text>
                            </LinearGradient>
                        </Tap>
                    ) : (
                        <Tap onPress={function () { setIdx(idx + 1); }} style={styles.nextWrap}>
                            <LinearGradient colors={["#0D2C4D", "#14607a", "#1D8A99"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.nextBtn}>
                                <Text style={styles.nextTxt}>Sonraki  ›</Text>
                            </LinearGradient>
                        </Tap>
                    )}
                </View>
            </View>
        </ScrollScreen>
    );
}

var styles = StyleSheet.create({
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    studyCard: {
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "rgba(13, 44, 77, 0.1)",
        shadowColor: "#041C24",
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 8,
    },
    studyCardDark: {
        backgroundColor: "#2A2724",
        borderColor: "rgba(255,255,255,0.08)",
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    kicker: {
        marginBottom: 4,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.6,
        color: "rgba(245, 235, 199, 0.72)",
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
        color: "#fff",
        lineHeight: 21,
    },
    progressPill: {
        minWidth: 54,
        height: 34,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: "rgba(245, 235, 199, 0.14)",
        borderWidth: 1,
        borderColor: "rgba(245, 235, 199, 0.28)",
        alignItems: "center",
        justifyContent: "center",
    },
    progressTxt: {
        color: "#F5EBC7",
        fontWeight: "700",
        fontSize: 14,
        letterSpacing: 0.4,
    },
    foot: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: "#f6f4f1",
        borderTopWidth: 1,
        borderTopColor: "rgba(13, 44, 77, 0.07)",
    },
    footDark: {
        backgroundColor: "#211F1D",
        borderTopColor: "rgba(255,255,255,0.06)",
    },
    prevBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "rgba(13, 44, 77, 0.12)",
        marginRight: 8,
        marginVertical: 4,
        flexShrink: 1,
    },
    prevTxt: {
        fontWeight: "600",
        fontSize: 14,
        color: "#211F1D",
    },
    nextWrap: {
        borderRadius: 999,
        overflow: "hidden",
        marginVertical: 4,
        flexShrink: 1,
        maxWidth: "58%",
    },
    nextBtn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 999,
    },
    nextTxt: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    emptyTitle: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: colors.text,
    },
});
