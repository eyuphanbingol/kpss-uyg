import React, { useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { CARD_HTML } from "../lib/cardHtml";
import { StudentStore } from "../lib/store";

// Paylaşım görselleri (net kartı, program görseli): web'deki js/shareCard.js gizli bir
// WebView'da çalışır, PNG'yi base64 olarak döndürür. OptikWorker ile aynı düzen.
var seq = 0;
function js(cmd) {
    var LS = new RegExp(String.fromCharCode(0x2028), "g"), PS = new RegExp(String.fromCharCode(0x2029), "g");
    return "window.cardCmd(" + JSON.stringify(cmd).replace(LS, "\\u2028").replace(PS, "\\u2029") + "); true;";
}

export function useCardImage() {
    var [active, setActive] = useState(false);
    var web = useRef(null);
    var ready = useRef(false);
    var queue = useRef([]);
    var waiters = useRef({});

    function flush() {
        if (!ready.current || !web.current) return;
        while (queue.current.length) web.current.injectJavaScript(js(queue.current.shift()));
    }
    // cmd: { kind: "net", opts } ya da { kind: "plan", model } → Promise<base64 PNG>
    function run(cmd) {
        return new Promise(function (resolve, reject) {
            var id = "c" + (++seq);
            waiters.current[id] = { resolve: resolve, reject: reject };
            queue.current.push(Object.assign({ id: id }, cmd));
            setActive(true);
            flush();
            setTimeout(function () {
                if (waiters.current[id]) { delete waiters.current[id]; reject(new Error("Görsel hazırlanamadı (zaman aşımı).")); }
            }, 30000);
        });
    }
    function onMessage(e) {
        var m;
        try { m = JSON.parse(e.nativeEvent.data); } catch (x) { return; }
        if (m.type === "ready") { ready.current = true; flush(); return; }
        var w = m.id && waiters.current[m.id];
        if (!w) return;
        delete waiters.current[m.id];
        if (m.type === "png") w.resolve(m.b64); else w.reject(new Error(m.message || "Görsel hazırlanamadı."));
    }
    var host = active ? (
        <View style={{ position: "absolute", width: 2, height: 2, opacity: 0, left: -10, top: 0 }} pointerEvents="none">
            <WebView ref={web} originWhitelist={["*"]} source={{ html: CARD_HTML, baseUrl: "https://www.atanly.com/" }}
                onMessage={onMessage} javaScriptEnabled
                onContentProcessDidTerminate={function () { ready.current = false; if (web.current) web.current.reload(); }}
                onRenderProcessGone={function () { ready.current = false; return true; }} />
        </View>
    ) : null;
    return [host, run];
}

// PNG'yi önbelleğe yazıp paylaşım menüsünü aç (kaydet, gönder, hikâyeye ekle).
export function shareImage(b64, name) {
    var uri = FileSystem.cacheDirectory + name;
    return FileSystem.writeAsStringAsync(uri, b64, { encoding: FileSystem.EncodingType.Base64 }).then(function () {
        return Sharing.isAvailableAsync();
    }).then(function (ok) {
        if (!ok) throw new Error("Bu cihazda paylaşım menüsü yok.");
        return Sharing.shareAsync(uri, { mimeType: "image/png", UTI: "public.png", dialogTitle: name });
    }).then(function () {
        if (StudentStore.bumpShare) StudentStore.bumpShare();
        return uri;
    });
}
